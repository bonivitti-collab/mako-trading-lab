"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { PRO_CHECKOUT_URL, PRO_MAX_MT5_SLOTS, hasProAccess } from "@/lib/plans";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";

function persistSession(userData: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("mako_user", JSON.stringify(userData));
  document.cookie = `mako_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=2592000`;
}

function clearClientSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("mako_user");
  localStorage.removeItem("mako_remember_pass");
  document.cookie = "mako_user=; path=/; max-age=0";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never keep plaintext passwords in the browser
    localStorage.removeItem("mako_remember_pass");

    const savedEmail = localStorage.getItem("mako_remember_email");
    if (savedEmail) setEmail(savedEmail);

    // Drop forged local-only sessions that are not backed by Supabase Auth
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        clearClientSession();
        return;
      }
      // Already signed in — send to dashboard
      router.replace("/dashboard");
    })();
  }, [router]);

  const finishMemberLogin = (cleanEmail: string, planTier: string, role = "user", maxSlots = PRO_MAX_MT5_SLOTS) => {
    const userData = {
      email: cleanEmail,
      role,
      plan_tier: planTier,
      max_mt5_slots: maxSlots,
    };
    persistSession(userData);
    if (hasProAccess(role, planTier)) {
      setSuccessMessage("Welcome back! Redirecting to Dashboard...");
      setTimeout(() => router.push("/dashboard"), 400);
    } else {
      setSuccessMessage("Account found. Activate Mako Pro Pass to unlock the Terminal.");
      setTimeout(() => router.push("/dashboard"), 500);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("mako_remember_email", email.trim().toLowerCase());
      } else {
        localStorage.removeItem("mako_remember_email");
      }
      localStorage.removeItem("mako_remember_pass");
    }

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        // Email confirmation required (mailer_autoconfirm is off)
        const confirmed = Boolean(data.user?.email_confirmed_at || data.session);
        if (!confirmed) {
          setSuccessMessage(
            "Check your inbox to confirm your email, then sign in here. After that, activate Pro Pass ($19/mo) to unlock downloads and AI."
          );
          setIsSignUp(false);
          return;
        }

        // Rare: autoconfirm on — proceed with real session only
        let planTier = "free";
        let maxSlots = 0;
        let role = "user";
        try {
          const token = data.session?.access_token;
          if (token) {
            const meRes = await fetch("/api/v1/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (meRes.ok) {
              const me = await meRes.json();
              planTier = me.has_pro ? me.plan_tier : "free";
              maxSlots = me.has_pro ? (me.max_mt5_slots ?? PRO_MAX_MT5_SLOTS) : 0;
              role = me.role || "user";
            }
          }
        } catch {
          // keep free until server confirms Pro
        }
        finishMemberLogin(cleanEmail, planTier, role, maxSlots);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        let planTier = "free";
        let maxSlots = 0;
        let role = "user";
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const token = sessionData.session?.access_token;
          if (token) {
            const meRes = await fetch("/api/v1/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (meRes.ok) {
              const me = await meRes.json();
              planTier = me.has_pro ? me.plan_tier : "free";
              maxSlots = me.has_pro ? (me.max_mt5_slots ?? PRO_MAX_MT5_SLOTS) : 0;
              role = me.role || "user";
            }
          }
        } catch {
          // keep free until server confirms Pro
        }
        finishMemberLogin(cleanEmail, planTier, role, maxSlots);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-300 bg-white p-8 sm:p-10 space-y-7 shadow-xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <Image src="/mako_logo.png" alt="Mako Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-slate-950">MAKO</span>
          </Link>

          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            {isSignUp ? "Create Your Mako Account" : "Sign In to Mako Terminal"}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isSignUp
              ? "Create your member account with email, confirm it, then activate Mako Pro Pass ($19/mo) to unlock all 533 MT5 tools."
              : "Access your Pro Pass licenses, MT5 slots, and algorithm downloads."}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@fundedorprop.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-mako-blue focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-mako-blue focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-mako-blue focus:ring-blue-400 border-slate-300 cursor-pointer"
              />
              <span className="font-medium">Remember email</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : isSignUp ? "Create Account" : "Access MT5 Terminal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <a
          href={PRO_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-mako-blue font-bold text-xs transition-all"
        >
          <span>Get Mako Pro Pass ($19/mo)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          {isSignUp ? (
            <p>
              Already a member?{" "}
              <button type="button" onClick={() => setIsSignUp(false)} className="text-mako-blue font-bold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New here?{" "}
              <button type="button" onClick={() => setIsSignUp(true)} className="text-mako-blue font-bold hover:underline">
                Create account
              </button>
              {" · "}
              <a href={PRO_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="text-mako-blue font-bold hover:underline">
                Subscribe to Pro Pass
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
