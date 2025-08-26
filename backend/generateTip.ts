// backend/generateTip.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSASING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY!;
if (!geminiApiKey) {
    throw new Error(
        "Missing GEMINI_API_KEY environment variable. Set.. it in your environment (.env.local or Vercel project settings)."
    );
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Function to generate tip
export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const prompt = `Give me a short,.. motivational health tip for the day. Make it unique and practical.`;

    // Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const tip = result.response?.text().trim() ?? "No tip generated.";

    // Store in Firestore
    await setDoc(doc(db, "dailyTips", today), {
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}
