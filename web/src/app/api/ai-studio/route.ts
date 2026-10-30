import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { extractBearerToken, getEntitlementByAccessToken } from "@/lib/entitlements";

export async function POST(req: NextRequest) {
  try {
    const { prompt, product_type } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required", success: false }, { status: 400 });
    }

    const token = extractBearerToken(req);
    const entitlement = token ? await getEntitlementByAccessToken(token) : null;
    if (!entitlement?.hasPro) {
      return NextResponse.json(
        {
          error: "An active Mako Pro Pass is required to use AI Studio.",
          success: false,
          code: "pro_required",
        },
        { status: 403 }
      );
    }

    const isEa = product_type === "ea" || !product_type;
    const systemInstruction = `
You are an expert MQL5 algorithmic engineer for MetaTrader 5.
Generate clean, production-grade, bug-free MQL5 code based on the user's prompt.
Strict rules:
1. Include #property strict and #property version "1.00".
2. If it is an EA, include <Trade\\Trade.mqh> and use CTrade for order executions.
3. Include inputs for Risk %, Stop Loss, and Take Profit.
4. Ensure array bounds checking and safe historical data checks.
5. Provide complete, fully compilable code with zero syntax errors or placeholders.
6. Return ONLY the MQL5 source code, no markdown fences unless necessary.
`;

    const result = await callGemini({
      systemInstruction,
      userText: `Generate a complete MQL5 ${isEa ? "Expert Advisor" : "Indicator"}: ${prompt}`,
      maxOutputTokens: 6000,
    });

    if (result.ok === false) {
      return NextResponse.json(
        { error: result.error, success: false, code: "gemini_error" },
        { status: result.status && result.status >= 400 ? result.status : 502 }
      );
    }

    const cleanCode = result.text.replace(/^```(?:mql5|cpp)?\n?/i, "").replace(/\n?```$/i, "");

    return NextResponse.json({
      code: cleanCode,
      model: result.model,
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "AI Studio failed", success: false }, { status: 500 });
  }
}
