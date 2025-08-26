// backend/generateTip.ts
import admin from "firebase-admin";
import { GoogleAI } from "google-genai";

if (!admin.apps.length) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require("@/service_key.json"); // adjust path

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

// ✅ Gemini setup with google-genai
const client = new GoogleAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateDailyTip() {
    const today = new Date().toISOString().split("T")[0];

    const prompt =
        "Give me a short, motivational health tip for the day. Make it unique and practical.";

    const response = await client.models.generateContent({
        model: "gemini-2.0-flash", // use 2.0 or latest supported model
        input: prompt,
    });

    const tip =
        response.output_text?.trim() ??
        "No tip generated.";

    // ✅ Works with locked Firestore rules
    await db.collection("dailyTips").doc(today).set({
        date: today,
        tip,
        createdAt: new Date().toISOString(),
    });

    return tip;
}
