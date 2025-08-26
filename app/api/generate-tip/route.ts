import { NextResponse } from "next/server";
import { generateDailyTip } from "@/backend/generateTip";

export async function GET() {
    try {
        const tip = await generateDailyTip();
        return NextResponse.json({ success: true, tip });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
