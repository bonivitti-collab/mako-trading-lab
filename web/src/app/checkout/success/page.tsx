"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const subscriptionId = searchParams.get("subscription_id") || searchParams.get("token") || "";
  const [status, setStatus] = useState<"pending" | "ok" | "wait">("pending");
  const [message, setMessage] = useState("Confirming your PayPal subscription...");

  useEffect(() => {
    void (async () => {
      // PayPal returns subscription_id on some flows; webhook is source of truth.
      // Give the webhook a moment, then guide the user to sign in.
      await new Promise((r) => setTimeout(r, 1500));
      if (subscriptionId) {
        try {
          const res = await fetch(`/api/paypal/confirm?subscription_id=${encodeURIComponent(subscriptionId)}`);
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.activated) {
            setStatus("ok");
            setMessage("Pro Pass activated. Sign in with the same email to access downloads and AI.");
            return;
          }
        } catch {
          /* fall through */
        }
      }
      setStatus("wait");
      setMessage(
        "Payment received. Pro unlocks within a minute via PayPal webhook — then sign in with the email you used at checkout."
      );
    })();
  }, [subscriptionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-300 bg-white p-8 sm:p-10 space-y-6 shadow-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
            <Image src="/mako_logo.png" alt="Mako Logo" fill className="object-cover" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-slate-950">MAKO</span>
        </Link>

        <div className="flex justify-center">
          {status === "pending" ? (
            <Loader2 className="w-10 h-10 text-mako-blue animate-spin" />
          ) : (
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-950">Thank you</h1>
        <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        {email && <p className="text-xs font-mono text-slate-500">{email}</p>}

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs"
        >
          Sign in to Terminal
        </Link>
      </div>
    </div>
  );
}
