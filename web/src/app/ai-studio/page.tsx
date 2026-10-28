"use client";

import { useState } from "react";
import { Cpu, Send, Copy, Check, Download, Terminal, Sparkles, BookOpen, ChevronRight, Zap, Code2, AlertCircle } from "lucide-react";

export default function AiStudio() {
  const [prompt, setPrompt] = useState("");
  const [productType, setProductType] = useState<"ea" | "indicator">("ea");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePrompts = [
    {
      label: "ICT Silver Bullet Scalper",
      text: "Create an MT5 EA that executes limit orders at the 50% consequent encroachment of Fair Value Gaps between 10:00 and 11:00 AM EST, with 1.5 ATR Stop Loss and 1:2 Risk to Reward."
    },
    {
      label: "Dual EMA Momentum Bot",
      text: "Build a trend-following EA based on 21 and 55 EMA crossover on M15 timeframe. Include 1% balance risk sizing, ATR trailing stop, and emergency Friday close at 20:00 GMT."
    },
    {
      label: "PropFirm Drawdown Guard",
      text: "Develop an automated risk management utility that calculates daily starting equity at 00:00 broker time and closes all open positions if drawdown reaches 4.0%."
    },
    {
      label: "Volume Absorption Indicator",
      text: "Create a custom indicator plotting on-chart arrows when volume exceeds 2.5x standard deviation but the candle has a high wick rejection (absorption)."
    }
  ];

  const handleGenerate = async (pText?: string) => {
    const textToSend = pText || prompt;
    if (!textToSend.trim()) return;

    setLoading(true);
    setCode(null);

    try {
      const res = await fetch("/api/ai-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, product_type: productType })
      });
      const data = await res.json();
      setCode(data.code || "// Error generating code");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMq5 = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mako_${productType.toUpperCase()}_Custom.mq5`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative MQL5 Engine • Tailored Algorithmic Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Mako AI Studio</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Describe any trading strategy in plain English. Our specialized algorithmic neural network generates clean, bug-free MQL5 code with zero syntax errors, ready to compile in MetaEditor with <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-xs border border-slate-300">F7</kbd>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prompt Input & Strategy Config */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
            {/* Target Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-500 font-bold">1. Select Target Architecture</label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                <button
                  onClick={() => setProductType("ea")}
                  className={`py-2 rounded-lg font-bold transition-all ${productType === "ea" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Expert Advisor (Bot)
                </button>
                <button
                  onClick={() => setProductType("indicator")}
                  className={`py-2 rounded-lg font-bold transition-all ${productType === "indicator" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Indicator
                </button>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono uppercase text-slate-500 font-bold">2. Describe Strategy Rules</label>
                <span className="text-[11px] font-mono text-slate-400">English prompt</span>
              </div>
              <textarea 
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Build an MT5 EA that trades EURUSD pullbacks to the 20 EMA on M15. Only trade in the direction of the 200 EMA trend with 1.5 ATR Stop Loss and 1:2 Risk to Reward..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-mako-blue focus:ring-2 focus:ring-blue-100 transition-all font-mono leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 bg-mako-blue hover:bg-blue-600 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Synthesizing MQL5 Architecture...</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Synthesize MQL5 Algorithm (.mq5)</span>
                </>
              )}
            </button>

            {/* Preset Inspiration Cards */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">Quick Prompt Inspiration</div>
              <div className="space-y-2">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(s.text);
                      handleGenerate(s.text);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-mako-blue hover:bg-blue-50/40 transition-all space-y-1 group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-mako-blue transition-colors flex items-center justify-between">
                      <span>{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-mako-blue" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{s.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Compilation Guide */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 text-xs text-slate-600 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <BookOpen className="w-4 h-4 text-mako-blue" />
              <span>How to Compile in MetaTrader 5 (10s):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] font-mono text-slate-700">
              <li>Click <strong>&quot;Download .mq5&quot;</strong> and save into MT5 <code className="text-mako-blue font-bold">MQL5/Experts</code>.</li>
              <li>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-xs border border-slate-200">F4</kbd> in MT5 to open MetaEditor.</li>
              <li>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-xs border border-slate-200">F7</kbd> to compile. Your .ex5 appears in Navigator!</li>
            </ol>
          </div>
        </div>

        {/* Right Column: Code Viewer Console (Dark Tech contrast on pure white canvas) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-[#0B0F19] overflow-hidden flex flex-col h-[700px] shadow-2xl shadow-slate-900/10">
          {/* Console Header Bar */}
          <div className="h-14 border-b border-slate-800 bg-[#111726] px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">
                {code ? `Generated_${productType.toUpperCase()}.mq5` : "Output Terminal"}
              </span>
            </div>

            {code && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button
                  onClick={downloadMq5}
                  className="px-4 py-1.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .mq5</span>
                </button>
              </div>
            )}
          </div>

          {/* Console Body */}
          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed selection:bg-mako-blue selection:text-white">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="relative w-12 h-12">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-mako-blue animate-spin"></div>
                  <Cpu className="w-5 h-5 text-mako-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-white font-bold text-sm">Synthesizing MQL5 Architecture...</div>
                  <div className="text-slate-500 text-xs">Injecting CTrade orders, risk checks, and MT5 event handlers</div>
                </div>
              </div>
            ) : code ? (
              <pre className="whitespace-pre text-slate-200">{code}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto p-6">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-mako-blue">
                  <Cpu className="w-7 h-7 opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-base font-bold text-white">Mako Algorithmic Generator Ready</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Type your strategy parameters in the prompt box on the left or select a template to generate a complete MT5 bot in seconds.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
