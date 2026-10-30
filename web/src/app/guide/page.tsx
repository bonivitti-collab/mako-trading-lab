"use client";

import Link from "next/link";
import { Terminal, Shield, Download, CheckCircle2, Play, AlertCircle, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function GuidePage() {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText("https://makotradinglab.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Quick Setup • Zero Configuration Lag</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">How to Use Mako MT5 Algorithms</h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Follow this 3-step walkthrough to download, authorize, and run any of our 500+ compiled indicators and automated bots on your MetaTrader 5 terminal in under 60 seconds.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-300 bg-white p-8 space-y-5 white-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-mako-blue text-white font-mono font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              1
            </span>
            <h2 className="text-xl font-bold text-slate-900">Authorize WebRequest in MetaTrader 5 (Mandatory Once)</h2>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-mako-blue border border-blue-200">
            One-Time Setup
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Because Mako tools use our seamless <strong>Zero-Password LicenseGuard</strong>, they verify your MT5 account number directly via a secure handshake. To enable this in your terminal:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
          <li>Open your <strong>MetaTrader 5</strong> terminal.</li>
          <li>Click top menu: <code className="bg-slate-100 text-slate-900 font-mono px-2 py-0.5 rounded font-bold">Tools → Options</code> (or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">Ctrl + O</kbd>).</li>
          <li>Select the <strong>Expert Advisors</strong> tab.</li>
          <li>Check <code className="bg-slate-100 text-slate-900 font-mono px-2 py-0.5 rounded font-bold">&quot;Allow WebRequest for listed URL&quot;</code>.</li>
          <li>Double-click the list and paste our official endpoint:</li>
        </ol>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm text-slate-900 font-bold">
            https://makotradinglab.com
          </div>
          <button 
            onClick={copyUrl}
            className="px-5 py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy URL"}</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-300 bg-white p-8 space-y-5 white-card">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            2
          </span>
          <h2 className="text-xl font-bold text-slate-900">Link Your Account Number in the Dashboard</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Navigate to your <Link href="/dashboard" className="text-mako-blue font-bold hover:underline">Mako License Dashboard</Link> and enter your MT5 Account Login (e.g. <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">88991122</code>). Mako Pro Pass includes 3 simultaneous slots (Live, Demo, PropFirm); Owner/Studio includes up to 5.
        </p>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <Shield className="w-5 h-5 text-mako-blue flex-shrink-0 mt-0.5" />
          <span>
            <strong>24-Hour Offline Cache:</strong> Once validated online, your tool caches a hardware-secured token. You can trade uninterrupted even through network drops or timeframe changes.
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-300 bg-white p-8 space-y-5 white-card">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            3
          </span>
          <h2 className="text-xl font-bold text-slate-900">Download .EX5 & Drag to Chart</h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Download any compiled <code className="font-mono text-mako-blue font-bold">.ex5</code> binary from our catalog. In MT5, click <code className="bg-slate-100 font-mono px-2 py-0.5 rounded text-slate-900 font-bold">File → Open Data Folder</code>:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-mono">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mako-blue"></span>
            <span>Indicators: Save inside <strong className="text-slate-950">MQL5/Indicators</strong></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mako-blue"></span>
            <span>Robots (EAs): Save inside <strong className="text-slate-950">MQL5/Experts</strong></span>
          </li>
        </ul>

        <p className="text-xs sm:text-sm text-slate-600">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs font-mono">Ctrl + N</kbd> to open Navigator, right-click &quot;Refresh&quot;, and drag the tool onto any active chart. That&apos;s it!
        </p>

        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Explore 500+ Algorithms Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
