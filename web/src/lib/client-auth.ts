import { supabase } from "@/lib/supabase/client";

export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

export async function authHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function downloadProtectedFile(slug: string, ext: "ex5" | "mq5") {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Sign in required to download.");
  }

  const res = await fetch(`/api/v1/download?slug=${encodeURIComponent(slug)}&ext=${ext}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Download failed (${res.status})`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
