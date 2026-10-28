"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Shield, Sparkles, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Direct Admin Credentials Shortcut for Owner
      if (email === "dbonivitti@gmail.com" && password === "mako!26") {
        setSuccessMessage("Owner Authenticated! Accessing Full MT5 Slot Dashboard...");
        if (typeof window !== "undefined") {
          localStorage.setItem("mako_user", JSON.stringify({
            email: "dbonivitti@gmail.com",
            role: "owner",
            plan_tier: "studio",
            max_mt5_slots: 5
          }));
        }
        setTimeout(() => router.push("/dashboard"), 600);
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage("Account created successfully! Check your email for confirmation or log in.");
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If in offline mock mode
          if (error.message.includes("fetch") || error.message.includes("placeholder")) {
            setSuccessMessage("Logged in (Demo Mode). Redirecting to MT5 Slot Dashboard...");
            setTimeout(() => router.push("/dashboard"), 1000);
            return;
          }
          setErrorMessage(error.message);
        } else {
          setSuccessMessage("Welcome back! Redirecting to Dashboard...");
          setTimeout(() => router.push("/dashboard"), 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-300 bg-white p-8 sm:p-10 space-y-8 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <Image src="/mako_logo.png" alt="Mako Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-slate-950">MAKO</span>
          </Link>
          
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            {isSignUp ? "Create Your Mako Profile" : "Sign In to Mako Terminal"}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isSignUp 
              ? "Link your MT5 account numbers and unlock 186 free indicators & bots."
              : "Manage your authorized MT5 slots, license keys, and AI synthesis history."}
          </p>
        </div>

        {/* Feedback banners */}
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

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 uppercase">
              Email Address
            </label>
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
            <label className="text-xs font-mono font-bold text-slate-700 uppercase">
              Password
            </label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Processing..." : isSignUp ? "Create Free Account" : "Access Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          {isSignUp ? (
            <p>
              Already registered?{" "}
              <button 
                type="button" 
                onClick={() => setIsSignUp(false)}
                className="text-mako-blue font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account yet?{" "}
              <button 
                type="button" 
                onClick={() => setIsSignUp(true)}
                className="text-mako-blue font-bold hover:underline"
              >
                Sign Up for Free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}