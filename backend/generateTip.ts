// backend/generateTip.ts
import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
        ),
    });
}

const db = admin.firestore();

// Gemini setup...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0];

    const prompt = `Give me a short, motivational health tip for the day. Make it unique and practical.`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const tip = result.response?.text().trim() ?? "No tip generated.";

    // ✅ This works even with locked Firestore rules
    await db.collection("dailyTips").doc(today).set({
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}
