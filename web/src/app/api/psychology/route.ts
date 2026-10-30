import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { extractBearerToken, getEntitlementByAccessToken } from "@/lib/entitlements";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required", success: false }, { status: 400 });
    }

    const token = extractBearerToken(req);
    const entitlement = token ? await getEntitlementByAccessToken(token) : null;
    if (!entitlement?.hasPro) {
      return NextResponse.json(
        {
          error: "An active Mako Pro Pass is required to use the Mindset mentor.",
          success: false,
          code: "pro_required",
        },
        { status: 403 }
      );
    }

    const systemInstruction = `
You are the "Mako Trader Mindset Mentor & Trading Psychologist" at Mako Trading Lab (makotradinglab.com).
Your mission:
1. Provide empathetic, realistic psychological support for traders who feel frustrated, revenge-traded, blew accounts, took heavy drawdown in prop firms, or struggle with fear and greed.
2. Maintain a compassionate yet disciplined tone.
3. Encourage strict risk management and capital preservation.
4. Answer in the same language as the user (Portuguese -> Portuguese, English -> English).
5. Keep answers practical, clear, and constructive. Avoid medical claims.
`;

    const result = await callGemini({
      systemInstruction,
      userText: message,
      maxOutputTokens: 2000,
    });

    if (result.ok === false) {
      return NextResponse.json(
        { error: result.error, success: false, code: "gemini_error" },
        { status: result.status && result.status >= 400 ? result.status : 502 }
      );
    }

    return NextResponse.json({ reply: result.text, success: true, model: result.model });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Psychology API failed", success: false }, { status: 500 });
  }
}
