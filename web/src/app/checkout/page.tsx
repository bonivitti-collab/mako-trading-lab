"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRO_PRICE_LABEL } from "@/lib/plans";
import { supabase } from "@/lib/supabase/client";
import { AlertCircle, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";

const HOTMART_URL = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL?.trim() || "";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionEmail = data.session?.user?.email;
        if (sessionEmail) {
          setEmail(sessionEmail);
          return;
        }
        const raw = localStorage.getItem("mako_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.email) setEmail(String(parsed.email));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-300 bg-white p-8 sm:p-10 space-y-6 shadow-xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <Image src="/mako_logo.png" alt="Mako Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-slate-950">MAKO</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Activate Pro Pass</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {PRO_PRICE_LABEL} via Hotmart — unlocks all 533 MT5 tools, account slots, and AI Studio.
            International cards welcome. Use the <span className="font-semibold text-slate-700">same email</span>{" "}
            you use to sign in on Mako.
          </p>
        </div>

        {!HOTMART_URL && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Hotmart checkout link is not configured yet (`NEXT_PUBLIC_HOTMART_CHECKOUT_URL`). Create the
              subscription product in Hotmart and paste the payment link.
            </span>
          </div>
        )}

        <ul className="space-y-2 text-xs text-slate-600">
          {["533 compiled .EX5 downloads", "3 MT5 license slots", "Mako AI Studio + Mindset mentor", "Works for buyers outside Brazil"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {item}
              </li>
            )
          )}
        </ul>

        {email && (
          <p className="text-[11px] text-center font-mono text-slate-500 bg-slate-50 rounded-lg py-2 px-3">
            Sign-in email: {email}
          </p>
        )}

        {HOTMART_URL ? (
          <a
            href={HOTMART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#e2652b] hover:bg-[#c95520] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Pay {PRO_PRICE_LABEL} on Hotmart</span>
            <ExternalLink className="w-4 h-4" />
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl bg-slate-300 text-slate-600 font-bold text-xs cursor-not-allowed"
          >
            Checkout unavailable
          </button>
        )}

        <p className="text-[11px] text-center text-slate-400">
          Already paid?{" "}
          <Link href="/login" className="text-mako-blue font-semibold hover:underline">
            Sign in
          </Link>{" "}
          with the same email used at Hotmart checkout.
        </p>
      </div>
    </div>
  );
}
