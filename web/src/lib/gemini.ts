const DEFAULT_MODEL = "gemini-2.5-flash";

export type GeminiResult =
  | { ok: true; text: string; model: string }
  | { ok: false; error: string; status?: number };

export async function callGemini(params: {
  systemInstruction: string;
  userText: string;
  maxOutputTokens?: number;
}): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY is not configured on the server." };
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: params.systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: params.userText }] }],
      generationConfig: {
        maxOutputTokens: params.maxOutputTokens ?? 4096,
        temperature: 0.7,
      },
    }),
  });

  const data = await response.json().catch(() => ({} as any));

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Gemini HTTP ${response.status}`;
    return { ok: false, error: message, status: response.status };
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || "").join("") ||
    "";

  if (!text.trim()) {
    const block = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason;
    return {
      ok: false,
      error: block ? `Gemini returned empty output (${block})` : "Gemini returned empty output",
      status: response.status,
    };
  }

  return { ok: true, text, model };
}
