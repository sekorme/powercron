// backend/generateTip.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import OpenAI from "openai";

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLI_FIREBASEC_MESSASING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// OpenAI client
const openaiApiKey = process.env.OPENAI_API_KEY!;
if (!openaiApiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable. Set it in your environment (e.g., .env.local or Vercel project settings).");
}
const client = new OpenAI({
    apiKey: openaiApiKey,
});

// Function to generate tip
export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const prompt = `Give me a short, motivational health tip for the day. Make it unique and practical.`;

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
    });

    const tip = response.choices?.[0]?.message?.content?.trim() ?? "No tip generated.";

    // Store in Firestore
    await setDoc(doc(db, "dailyTips", today), {
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}
