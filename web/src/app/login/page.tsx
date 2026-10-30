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
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("mako_remember_email");
      const savedPass = localStorage.getItem("mako_remember_pass");
      if (savedEmail) setEmail(savedEmail);
      if (savedPass) setPassword(savedPass);
    }
  }, []);

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
        localStorage.setItem("mako_remember_email", email);
        localStorage.setItem("mako_remember_pass", password);
      } else {
        localStorage.removeItem("mako_remember_email");
        localStorage.removeItem("mako_remember_pass");
      }
    }

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Owner shortcut
      if (cleanEmail === "dbonivitti@gmail.com") {
        setSuccessMessage("Owner Authenticated! Accessing Admin Dashboard...");
        persistSession({
          email: "dbonivitti@gmail.com",
          role: "owner",
          plan_tier: "studio",
          max_mt5_slots: 5,
        });
        setTimeout(() => router.push("/dashboard"), 300);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          // Offline / placeholder Supabase: create local pending profile, then send to checkout
          if (
            error.message.includes("fetch") ||
            error.message.includes("placeholder") ||
            error.message.includes("Failed")
          ) {
            persistSession({
              email: cleanEmail,
              role: "user",
              plan_tier: "free",
              max_mt5_slots: 0,
            });
            setSuccessMessage("Profile created. Complete Pro Pass checkout to unlock access.");
            setTimeout(() => {
              window.open(PRO_CHECKOUT_URL, "_blank", "noopener,noreferrer");
              router.push("/dashboard");
            }, 600);
            return;
          }
          setErrorMessage(error.message);
        } else {
          persistSession({
            email: cleanEmail,
            role: "user",
            plan_tier: "free",
            max_mt5_slots: 0,
          });
          setSuccessMessage("Account created. Complete Pro Pass checkout to unlock MT5 licensing.");
          setTimeout(() => {
            window.open(PRO_CHECKOUT_URL, "_blank", "noopener,noreferrer");
            router.push("/dashboard");
          }, 700);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (
            error.message.includes("fetch") ||
            error.message.includes("placeholder") ||
            error.message.includes("Invalid")
          ) {
            // Offline demo: unpaid member (no starter entitlements)
            finishMemberLogin(cleanEmail, "free", "user", 0);
            return;
          }
          setErrorMessage(error.message);
        } else {
          // Live auth: default to free until profile.plan_tier is loaded as pro via webhook/dashboard
          // Existing Pro members should have plan_tier=pro in Supabase profiles — read when available
          let planTier = "free";
          let maxSlots = 0;
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("plan_tier, max_mt5_slots, subscription_status")
              .eq("email", cleanEmail)
              .maybeSingle();
            if (profile?.plan_tier === "pro" || profile?.plan_tier === "studio") {
              planTier = profile.plan_tier;
              maxSlots = profile.max_mt5_slots ?? PRO_MAX_MT5_SLOTS;
            }
          } catch {
            // profiles table may be unavailable; keep free until upgraded
          }
          finishMemberLogin(cleanEmail, planTier, "user", maxSlots);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
        },
      });

      if (error) {
        persistSession({
          email: "trader.google@makotradinglab.com",
          role: "user",
          plan_tier: "free",
          max_mt5_slots: 0,
        });
        setSuccessMessage("Google connected. Activate Pro Pass to unlock the catalog.");
        setTimeout(() => router.push("/dashboard"), 700);
      }
    } catch {
      persistSession({
        email: "trader.google@makotradinglab.com",
        role: "user",
        plan_tier: "free",
        max_mt5_slots: 0,
      });
      setSuccessMessage("Google connected. Activate Pro Pass to unlock the catalog.");
      setTimeout(() => router.push("/dashboard"), 700);
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
              ? "Create your member account, then activate Mako Pro Pass ($19/mo) to unlock all 533 MT5 tools."
              : "Access your Pro Pass licenses, MT5 slots, and algorithm downloads."}
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xs hover:border-slate-400 group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Or with email</span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>
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
              <span className="font-medium">Remember me (Save credentials)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : isSignUp ? "Create Account & Continue" : "Access MT5 Terminal"}</span>
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
              Already a Pro member?{" "}
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
