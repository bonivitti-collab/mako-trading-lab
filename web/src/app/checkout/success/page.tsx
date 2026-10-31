"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
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
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-black text-slate-950">Payment received</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Hotmart will notify Mako when the purchase is approved. Then sign in with the{" "}
          <span className="font-semibold">same email</span> you used at checkout to unlock Pro Pass.
        </p>

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
