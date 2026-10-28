"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ShieldAlert, Sparkles, HelpCircle, ArrowRight, CheckCircle2, DollarSign, Percent } from "lucide-react";

interface PairConfig {
  symbol: string;
  name: string;
  contractSize: number;
  pipSize: number;
  pipValuePerLotUSD: number;
  category: "forex" | "metals" | "indices" | "crypto";
}

const POPULAR_SYMBOLS: PairConfig[] = [
  { symbol: "EURUSD", name: "Euro / US Dollar", contractSize: 100000, pipSize: 0.0001, pipValuePerLotUSD: 10, category: "forex" },
  { symbol: "GBPUSD", name: "British Pound / USD", contractSize: 100000, pipSize: 0.0001, pipValuePerLotUSD: 10, category: "forex" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", contractSize: 100000, pipSize: 0.01, pipValuePerLotUSD: 6.8, category: "forex" },
  { symbol: "AUDUSD", name: "Australian Dollar / USD", contractSize: 100000, pipSize: 0.0001, pipValuePerLotUSD: 10, category: "forex" },
  { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", contractSize: 100000, pipSize: 0.0001, pipValuePerLotUSD: 7.4, category: "forex" },
  { symbol: "XAUUSD", name: "Gold (100 oz)", contractSize: 100, pipSize: 0.01, pipValuePerLotUSD: 1, category: "metals" },
  { symbol: "US30", name: "Dow Jones Industrial", contractSize: 1, pipSize: 1.0, pipValuePerLotUSD: 1, category: "indices" },
  { symbol: "NAS100", name: "Nasdaq 100 Index", contractSize: 1, pipSize: 1.0, pipValuePerLotUSD: 1, category: "indices" },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", contractSize: 1, pipSize: 1.0, pipValuePerLotUSD: 1, category: "crypto" },
];

export default function LotCalculatorPage() {
  const [balance, setBalance] = useState<number>(10000);
  const [riskType, setRiskType] = useState<"percent" | "cash">("percent");
  const [riskValue, setRiskValue] = useState<number>(1.0);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("EURUSD");
  const [stopLossPips, setStopLossPips] = useState<number>(25);

  const activePair = useMemo(() => {
    return POPULAR_SYMBOLS.find(s => s.symbol === selectedSymbol) || POPULAR_SYMBOLS[0];
  }, [selectedSymbol]);

  // Calculations
  const calculatedRiskAmount = useMemo(() => {
    if (riskType === "percent") {
      return (balance * riskValue) / 100;
    }
    return riskValue;
  }, [balance, riskType, riskValue]);

  const calculatedLot = useMemo(() => {
    if (stopLossPips <= 0 || calculatedRiskAmount <= 0) return 0;
    // Pip value per 1 standard lot
    let lot = calculatedRiskAmount / (stopLossPips * activePair.pipValuePerLotUSD);
    return Math.max(0.01, Math.floor(lot * 100) / 100);
  }, [calculatedRiskAmount, stopLossPips, activePair]);

  const unitsPosition = useMemo(() => {
    return Math.round(calculatedLot * activePair.contractSize);
  }, [calculatedLot, activePair]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <Calculator className="w-3.5 h-3.5" />
          <span>Client-Side Utility • 100% Free & Unlimited</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
          MT5 Position Size & Lot Calculator
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Never blow an evaluation due to lot sizing confusion. Calculate exact micro, mini, and standard lots for Forex, Gold (XAUUSD), and Indices before submitting orders to MetaTrader 5.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Box */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center justify-between">
            <span>Trading Parameters</span>
            <span className="text-xs font-mono font-normal text-slate-500">Live Client-Side Math</span>
          </h2>

          <div className="space-y-5">
            {/* Account Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                Account Balance / Challenge Equity ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
                  placeholder="10000"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[5000, 10000, 25000, 50000, 100000, 200000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBalance(preset)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono transition-colors"
                  >
                    ${preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                Symbol / Instrument
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
              >
                {POPULAR_SYMBOLS.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Mode (Percentage vs USD Cash) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Risk Per Trade
                </label>
                <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-100 text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => { setRiskType("percent"); setRiskValue(1.0); }}
                    className={`px-2.5 py-1 rounded-md transition-all ${riskType === "percent" ? "bg-white text-mako-blue shadow-sm" : "text-slate-600"}`}
                  >
                    % Equity
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRiskType("cash"); setRiskValue(100); }}
                    className={`px-2.5 py-1 rounded-md transition-all ${riskType === "cash" ? "bg-white text-mako-blue shadow-sm" : "text-slate-600"}`}
                  >
                    $ Cash
                  </button>
                </div>
              </div>

              <div className="relative">
                <input 
                  type="number"
                  step={riskType === "percent" ? "0.25" : "10"}
                  value={riskValue}
                  onChange={(e) => setRiskValue(Math.max(0.01, parseFloat(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs font-bold">
                  {riskType === "percent" ? "%" : "USD"}
                </span>
              </div>

              {riskType === "percent" && (
                <div className="flex gap-2 pt-1">
                  {[0.25, 0.5, 1.0, 1.5, 2.0].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setRiskValue(p)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors ${riskValue === p ? "bg-mako-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stop Loss in Pips / Points */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Stop Loss Distance</span>
                <span className="text-slate-500 font-normal">
                  {activePair.category === "metals" || activePair.category === "indices" ? "Points / Ticks" : "Pips"}
                </span>
              </label>
              <input 
                type="number"
                step="1"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm focus:outline-none focus:border-mako-blue focus:bg-white transition-all font-bold"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        {/* Calculation Result HUD Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/70 to-white p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-mako-blue font-bold border border-blue-200">
                RECOMMENDED MT5 LOT
              </span>
              <span className="text-slate-500 font-bold">{selectedSymbol}</span>
            </div>

            {/* BIG LOT DISPLAY */}
            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-950">
                {calculatedLot.toFixed(2)}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-1">
                Standard MT5 Lots ({(unitsPosition).toLocaleString()} units)
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-mono">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Total Capital Risked:</span>
                <span className="font-bold text-red-600">-${calculatedRiskAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Effective Equity Risk:</span>
                <span className="font-bold text-slate-900">
                  {((calculatedRiskAmount / balance) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Estimated Pip/Point Value:</span>
                <span className="font-bold text-slate-900">
                  ${(calculatedLot * activePair.pipValuePerLotUSD).toFixed(2)} / pip
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Contract Unit Size:</span>
                <span className="font-bold text-slate-900">{activePair.contractSize.toLocaleString()}</span>
              </div>
            </div>

            {/* Safety Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Prop Firm Warning:</strong> If you are taking an FTMO or Apex challenge, never risk more than <strong>0.50% to 1.00%</strong> per trade to safeguard against slippage and spread spikes.
              </span>
            </div>
          </div>

          {/* Quick Link to Shield EAs */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 space-y-3">
            <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mako-blue" />
              <span>Automate this on your MT5 Chart</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tired of manual math? Download our automated <strong>Auto Lot Risk Manager</strong> or <strong>PropFirm Account Shield</strong> from the algorithm catalog to calculate and enforce stops automatically.
            </p>
            <Link 
              href="/#catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-mako-blue hover:text-blue-700 transition-colors pt-1"
            >
              <span>Browse Risk Algorithms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}