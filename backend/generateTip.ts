// backend/generateTip.ts

import { GoogleGenAI } from "@google/genai";
import { dbAdmin } from "../firebase/admin";

// ✅ Gemini setup with google-genai
const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0];

    const prompt =
        "Give me a short, motivational health tip for the day. Make it unique and practical.";

    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const tip =
        response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "No tip generated.";

    await dbAdmin.collection("dailyTips").doc(today).set({
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}