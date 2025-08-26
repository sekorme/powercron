// backend/generateTip.ts
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";



const db = admin.firestore();

// ✅ Gemini setup with google-genai
const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0];

    const prompt =
        "Give me a short, motivational health tip for the day. Make it unique and practical.";

    const response = await client.models.generateContent({
        model: "gemini-2.5-flash", // use 2.0 or latest supported model
        contents: prompt,
    });

    const tip = response.choices?.[0]?.message?.contents?.trim() ?? "No tip generated.";

    // ✅ Works with locked Firestore rules
    await db.collection("dailyTips").doc(today).set({
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}
