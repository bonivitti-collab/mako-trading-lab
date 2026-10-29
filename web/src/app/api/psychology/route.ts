import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6LXjiOmoKthENVdfqZi2uPCZXwxGKv3VnUvdQRqA0nHKA";

    const systemInstruction = `
You are the "Mako Trader Mindset Mentor & Trading Psychologist" at Mako Trading Lab (makotradinglab.com).
Your mission:
1. Provide empathetic, realistic, ground-to-earth psychological support for traders who feel frustrated, revenge-traded, blew accounts, took heavy drawdown in prop firms, or are struggling with fear and greed.
2. Maintain a positive, compassionate, yet disciplined tone: "Trading is one of the hardest psychological professions on earth. Losses are not a reflection of your self-worth; they are statistical operating expenses."
3. Encourage strict risk management: Focus on capital preservation, reducing lot sizes, stepping away from charts when tilted, and using automated guards (like daily max drawdown shields).
4. Share perspective from veteran traders: Every professional trader went through blowing accounts before learning that discipline and automated risk rules outweigh predictive guessing.
5. Answer in the same language as the user (if user speaks Portuguese, answer in Portuguese; if English, answer in English). Keep answers practical, clear, and constructive.
`;

    if (apiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 3000,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      });

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (reply) {
        return NextResponse.json({ reply, success: true });
      }
    }

    // High quality empathetic fallback if API key is not yet set
    const fallbackReply = `Take a deep breath and step away from your MT5 terminal for at least an hour. What you are feeling right now is completely human — every single profitable trader alive today has felt that exact punch in the stomach after a bad session or revenge trade.

The market did not defeat you; emotional impulse did. When you trade angry or anxious, you stop executing a mathematical edge and start gambling with your future. Remember: your account balance can be rebuilt, but only if you protect your psychological capital first.

Here is your actionable reset for today: Close all charts. Do not attempt to "make it back" today. Log the mistake in your trade journal without beating yourself up. Tomorrow, cut your risk to 0.5% per trade and let our automated risk shields handle the exit rules. You are in this for a 10-year career, not a single afternoon.`;

    return NextResponse.json({ reply: fallbackReply, success: true });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
