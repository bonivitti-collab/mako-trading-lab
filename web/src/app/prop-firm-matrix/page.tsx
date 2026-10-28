"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Shield, AlertOctagon, CheckCircle2, ChevronRight, Scale, Info, ArrowRight, Zap } from "lucide-react";

interface PropFirmRule {
  id: string;
  name: string;
  dailyLossLimit: string;
  dailyCalculationType: "Balance Snap (00:00)" | "Trailing Equity" | "Balance High-Water";
  maxTotalDrawdown: string;
  weekendHolding: boolean;
  newsTradingAllowed: boolean;
  eaAllowed: boolean;
  trapWarning: string;
  recommendedShieldTool: string;
  slug: string;
}

const PROP_FIRMS: PropFirmRule[] = [
  {
    id: "ftmo",
    name: "FTMO (Normal / Aggressive)",
    dailyLossLimit: "5% (or 10% Aggressive)",
    dailyCalculationType: "Balance Snap (00:00)",
    maxTotalDrawdown: "10% Static",
    weekendHolding: true,
    newsTradingAllowed: true, // on swing accounts
    eaAllowed: true,
    trapWarning: "Daily loss boundary resets at midnight CE(S)T server time based on starting day balance or floating equity (whichever is higher). Floating overnight profits inflate your loss boundary immediately.",
    recommendedShieldTool: "Mako PropFirm Account Shield",
    slug: "mako-propfirm-account-shield"
  },
  {
    id: "fundednext",
    name: "FundedNext (Stellar / Express)",
    dailyLossLimit: "5% Balance-Based (Stellar)",
    dailyCalculationType: "Balance Snap (00:00)",
    maxTotalDrawdown: "10% Overall",
    weekendHolding: true,
    newsTradingAllowed: true,
    eaAllowed: true,
    trapWarning: "Evaluation phase allows news trading, but funded accounts often enforce a 2-minute restriction window before and after high-impact red folder releases.",
    recommendedShieldTool: "Mako Red Folder News Freeze Guard",
    slug: "mako-red-folder-news-freeze-guard"
  },
  {
    id: "apex",
    name: "Apex Trader Funding (Futures / MT5)",
    dailyLossLimit: "No Daily Limit",
    dailyCalculationType: "Trailing Equity",
    maxTotalDrawdown: "Trailing Threshold ($1,500 - $7,500)",
    weekendHolding: false,
    newsTradingAllowed: true,
    eaAllowed: true,
    trapWarning: "INTRA-TRADE TRAILING EQUITY TRAP: The drawdown threshold trails your maximum unrealized peak profit tick-by-tick. If you are up $2,000 and price pulls back to $500, your drawdown floor does NOT pull back.",
    recommendedShieldTool: "Mako Auto Breakeven Pip Padder",
    slug: "mako-auto-breakeven-pip-padder"
  },
  {
    id: "funding_pips",
    name: "Funding Pips (1-Step / 2-Step)",
    dailyLossLimit: "5% Equity or Balance",
    dailyCalculationType: "Balance Snap (00:00)",
    maxTotalDrawdown: "10% Maximum",
    weekendHolding: true,
    newsTradingAllowed: true,
    eaAllowed: true,
    trapWarning: "Strict automated risk engine. If high-impact news slippage causes an execution breach by even $1, the account is permanently terminated without manual review.",
    recommendedShieldTool: "Mako Consecutive Loss Timeout Guard",
    slug: "mako-consecutive-loss-timeout-guard"
  },
  {
    id: "the5ers",
    name: "The5ers (Bootcamp / High Stakes)",
    dailyLossLimit: "5% Daily Loss",
    dailyCalculationType: "Balance Snap (00:00)",
    maxTotalDrawdown: "10% Maximum",
    weekendHolding: true,
    newsTradingAllowed: true,
    eaAllowed: true,
    trapWarning: "Requires stop loss on every open trade for specific account tiers. Opening an un-hedged naked position will incur a compliance warning.",
    recommendedShieldTool: "Mako Dynamic ATR Trailing Stop EA",
    slug: "mako-dynamic-atr-trailing-stop-ea"
  }
];

export default function PropFirmRulesMatrixPage() {
  const [selectedFirm, setSelectedFirm] = useState<string>("ftmo");
  const [accountSize, setAccountSize] = useState<number>(50000);

  const currentFirm = useMemo(() => {
    return PROP_FIRMS.find(f => f.id === selectedFirm) || PROP_FIRMS[0];
  }, [selectedFirm]);

  const maxDailyLossUSD = useMemo(() => {
    if (currentFirm.id === "apex") return "N/A (Trailing Threshold)";
    return `$${((accountSize * 0.05)).toLocaleString()}`;
  }, [accountSize, currentFirm]);

  const maxTotalLossUSD = useMemo(() => {
    if (currentFirm.id === "apex") return `$${((accountSize * 0.04)).toLocaleString()} (Estimated)`;
    return `$${((accountSize * 0.10)).toLocaleString()}`;
  }, [accountSize, currentFirm]);

  const recommendedSafeRiskUSD = useMemo(() => {
    return `$${((accountSize * 0.0075)).toLocaleString()} (0.75% / trade)`;
  }, [accountSize]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>Proprietary Prop-Firm Survival Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
          Prop Firm Rules Matrix & Breach Protection
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          More than 85% of failed challenges happen due to hidden drawdown calculation rules. Compare drawdown mechanics across FTMO, FundedNext, Apex, and Funding Pips, and deploy algorithmic shields designed for each specific engine.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-slate-300 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase">
            Select Funding Evaluation Firm:
          </label>
          <select
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
          >
            {PROP_FIRMS.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-700 uppercase">
            Challenge Account Size ($):
          </label>
          <select
            value={accountSize}
            onChange={(e) => setAccountSize(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
          >
            {[10000, 25000, 50000, 100000, 200000].map(size => (
              <option key={size} value={size}>
                ${size.toLocaleString()} Challenge
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Numerical Loss Calculator Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-slate-300 bg-white space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Max Daily Loss Limit</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-red-600">{maxDailyLossUSD}</div>
          <p className="text-[11px] text-slate-500">Breaching this single dollar value closes all positions and revokes the account.</p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-300 bg-white space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Max Total Loss Limit</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{maxTotalLossUSD}</div>
          <p className="text-[11px] text-slate-500">Overall account equity stop boundary throughout the entire evaluation.</p>
        </div>

        <div className="p-6 rounded-3xl border border-blue-200 bg-blue-50/60 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold text-mako-blue uppercase">Recommended Risk Per Trade</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{recommendedSafeRiskUSD}</div>
          <p className="text-[11px] text-slate-600">Calculated buffer to withstand up to 5 consecutive losses without tilt or breach.</p>
        </div>
      </div>

      {/* Trap Warning Breakdown */}
      <div className="p-7 rounded-3xl border border-red-200 bg-red-50/50 space-y-4">
        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
          <AlertOctagon className="w-5 h-5 flex-shrink-0" />
          <span>The #1 Critical Trap for {currentFirm.name}:</span>
        </div>
        <p className="text-xs sm:text-sm text-red-950 leading-relaxed font-medium">
          {currentFirm.trapWarning}
        </p>
      </div>

      {/* Rules Matrix Table */}
      <div className="rounded-3xl border border-slate-300 bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Rules & Execution Comparison: {currentFirm.name}
          </h2>
        </div>

        <div className="divide-y divide-slate-200 text-xs sm:text-sm">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Daily Drawdown Calculation Engine</span>
            <span className="font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
              {currentFirm.dailyCalculationType}
            </span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Expert Advisors (EAs) & Algorithmic Trading</span>
            <span className="font-mono font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Allowed (MT5 Build 4000+)
            </span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Holding Positions Over Weekend</span>
            <span className={`font-mono font-bold ${currentFirm.weekendHolding ? "text-emerald-700" : "text-amber-700"}`}>
              {currentFirm.weekendHolding ? "Allowed" : "Prohibited (Close Friday)"}
            </span>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <span className="font-semibold text-slate-700">High-Impact News Trading</span>
            <span className="font-mono font-bold text-slate-800">
              {currentFirm.newsTradingAllowed ? "Allowed (Watch Slippage)" : "Restricted 2min Window"}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Solution Bot Callout */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-mako-blue uppercase">
            Recommended Protective Tool:
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {currentFirm.recommendedShieldTool}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Engineered specifically to monitor floating equity continuously and execute millisecond hard liquidations before the {currentFirm.name} server can log a breach.
          </p>
        </div>

        <Link
          href={`/#catalog`}
          className="px-6 py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all flex-shrink-0"
        >
          <span>Get Free .EX5 on Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}