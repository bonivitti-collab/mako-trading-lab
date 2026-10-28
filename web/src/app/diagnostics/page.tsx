"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldCheck, Terminal, Copy, Check, ExternalLink, HelpCircle, ArrowRight } from "lucide-react";

interface DiagnosticItem {
  id: string;
  title: string;
  shortDesc: string;
  solution: string;
  steps: string[];
  severity: "critical" | "warning" | "tip";
}

const DIAGNOSTIC_CHECKS: DiagnosticItem[] = [
  {
    id: "algotrading_button",
    title: "1. 'Algo Trading' Button is Disabled (Grey/Red icon)",
    shortDesc: "The master switch in the MT5 top toolbar is deactivated, preventing any Expert Advisor from placing trades.",
    solution: "Click the 'Algo Trading' button in the MT5 top toolbar so it turns green with a play symbol. Also ensure in EA settings that 'Allow Algo Trading' is checked.",
    steps: [
      "Look at the top toolbar in MT5 next to Timeframes.",
      "Click the 'Algo Trading' button until it displays a green indicator.",
      "Check the top-right corner of your chart: the robot icon should be colored, not grey."
    ],
    severity: "critical"
  },
  {
    id: "webrequest_url",
    title: "2. WebRequest URL Not Whitelisted (Error 4014 / 4060)",
    shortDesc: "MT5 sandbox blocks internet requests by default. The LicenseGuard cannot verify your active subscription without this URL.",
    solution: "Add 'https://makotradinglab.com' to the Allowed WebRequest URLs list inside MT5 Options.",
    steps: [
      "In MT5 menu, click Tools → Options (or press Ctrl + O).",
      "Click the 'Expert Advisors' tab.",
      "Check 'Allow WebRequest for listed URL:'.",
      "Click 'Add new URL', paste: https://makotradinglab.com and press Enter.",
      "Click OK and restart your Expert Advisor."
    ],
    severity: "critical"
  },
  {
    id: "dll_imports",
    title: "3. 'Allow DLL Imports' Configuration Check",
    shortDesc: "Proprietary high-frequency tools or sound alerts may require Windows system DLL hooks.",
    solution: "Enable DLL imports in the EA input dialog before attaching it to the chart.",
    steps: [
      "Right-click on your chart → Expert List → Properties (or press F7).",
      "Go to the 'Common' tab.",
      "Ensure 'Allow DLL imports' is ticked.",
      "Click OK."
    ],
    severity: "warning"
  },
  {
    id: "folder_location",
    title: "4. Wrong Folder Installation (File Not Appearing in Navigator)",
    shortDesc: "Pastes .ex5 files into the program installation folder instead of the user roaming AppData folder.",
    solution: "Always use MT5's internal 'Open Data Folder' shortcut to find the true MQL5 directory.",
    steps: [
      "Open MT5, click File → Open Data Folder.",
      "Open the 'MQL5' folder.",
      "Indicators go into 'MQL5/Indicators', while Bots go into 'MQL5/Experts'.",
      "Go back to MT5, right-click any item in Navigator (Ctrl + N) and click 'Refresh'."
    ],
    severity: "warning"
  },
  {
    id: "market_watch_spread",
    title: "5. Symbol Not Enabled or Spread Exceeds Max Filter",
    shortDesc: "Robots with spread filters will refuse to trade during broker rollover or volatile news spikes.",
    solution: "Check the 'Experts' log tab at the bottom of MT5 (Ctrl + T) to see if trades are blocked by 'Spread too high'.",
    steps: [
      "Open the Toolbox window at the bottom (Ctrl + T) and select the 'Experts' tab.",
      "Look for messages like 'Spread 35 exceeds MaxSpread 25'.",
      "If you are trading outside London/NY sessions, temporarily widen the MaxSpread parameter in EA properties (F7)."
    ],
    severity: "tip"
  }
];

export default function DiagnosticsPage() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedUrl, setCopiedUrl] = useState(false);

  const toggleCheck = (id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyUrl = () => {
    navigator.clipboard.writeText("https://makotradinglab.com");
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllReady = completedCount === DIAGNOSTIC_CHECKS.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <Terminal className="w-3.5 h-3.5" />
          <span>MT5 Self-Service Diagnostic Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
          MT5 Installation & Connection Diagnostic
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Is your robot not placing trades or indicator showing a blank chart? 99% of beginner MT5 issues stem from 5 simple security checkboxes. Run through this interactive diagnostic checklist to solve it in under 60 seconds.
        </p>
      </div>

      {/* Live Readiness HUD */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isAllReady 
          ? "bg-emerald-50 border-emerald-300 text-emerald-950" 
          : "bg-white border-slate-300 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAllReady ? "bg-emerald-500 animate-ping" : "bg-mako-blue"}`}></span>
              <h2 className="font-bold text-base sm:text-lg">
                Diagnostic Progress: {completedCount} of {DIAGNOSTIC_CHECKS.length} Verified
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {isAllReady 
                ? "All critical MT5 permissions verified! Your charts are primed for automated execution." 
                : "Check off each item below as you verify it on your MetaTrader 5 terminal."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-mono font-bold transition-all"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? "URL Copied!" : "Copy WebRequest URL"}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-5">
          <div 
            className="bg-mako-blue h-full transition-all duration-300"
            style={{ width: `${(completedCount / DIAGNOSTIC_CHECKS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-5">
        {DIAGNOSTIC_CHECKS.map((item) => {
          const isDone = !!completedSteps[item.id];
          return (
            <div 
              key={item.id}
              className={`rounded-3xl border p-6 transition-all bg-white ${
                isDone 
                  ? "border-emerald-300 bg-emerald-50/20 shadow-sm" 
                  : "border-slate-300 hover:border-slate-400 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleCheck(item.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isDone 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "border-slate-300 hover:border-mako-blue bg-white"
                      }`}
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <h3 className={`text-base sm:text-lg font-bold ${isDone ? "text-slate-800 line-through opacity-75" : "text-slate-950"}`}>
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">
                    {item.shortDesc}
                  </p>

                  {/* Steps container */}
                  <div className="mt-4 ml-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold font-mono text-slate-900 uppercase text-[11px]">
                      Quick Fix Steps:
                    </div>
                    <ol className="list-decimal list-inside space-y-1 font-mono text-slate-700">
                      {item.steps.map((st, sidx) => (
                        <li key={sidx} className="leading-relaxed">{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="font-bold text-base">Still Having Issues?</div>
          <p className="text-xs sm:text-sm text-slate-300">
            Check the detailed step-by-step visual installation guide with screenshots.
          </p>
        </div>
        <Link 
          href="/guide"
          className="px-5 py-2.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 transition-all flex-shrink-0"
        >
          <span>Open Full Installation Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}