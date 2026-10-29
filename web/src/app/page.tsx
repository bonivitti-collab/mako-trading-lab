"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  Terminal, 
  Lock, 
  ArrowRight, 
  Zap, 
  SlidersHorizontal, 
  TrendingUp, 
  Layers, 
  FileCode, 
  Activity, 
  Cpu, 
  HelpCircle,
  BarChart3,
  Bot
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="absolute inset-0 tech-grid-light opacity-60 pointer-events-none"></div>
        <div className="absolute -top-40 right-1/2 translate-x-1/2 w-[600px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/90 text-mako-blue text-xs font-mono font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-mako-blue animate-pulse"></span>
            <span>Zero-Password Licensing Architecture • 533 MT5 Algorithms</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] max-w-4xl mx-auto">
            The Institutional Pass for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mako-blue via-blue-600 to-cyan-600">
              MetaTrader 5 Algorithms.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Never pay $30+ for a single indicator again. Access 533 institutional algorithms, 106 Expert Advisors, prop-firm equity shields, and Mako AI Studio for a single pass.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login?plan=pro"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
            >
              <span>Get Mako Pro Pass ($29/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login?plan=starter"
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Start Free (20 Tools)</span>
            </Link>

            <Link
              href="/terminal"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-slate-600 hover:text-slate-950 text-sm font-mono flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
            >
              <Terminal className="w-4 h-4 text-slate-500" />
              <span>Explore 533 Catalog</span>
            </Link>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black font-mono text-slate-950">533</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Compiled .EX5 + .MQ5</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black font-mono text-emerald-600">106</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Expert Advisors (EAs)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black font-mono text-mako-blue">0 Errors</div>
              <div className="text-xs text-slate-500 font-medium mt-1">MetaEditor Audited</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl font-black font-mono text-cyan-600">0 Passwords</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Zero-Password License</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Product Feature Teasers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-mako-blue font-bold">Quantitative Arsenal</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Everything Needed to Pass & Protect Funded Accounts</h2>
          <p className="text-sm text-slate-600">From microsecond scalping bots to institutional liquidity order flow profiles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl border border-slate-200 bg-white space-y-4 hover:border-mako-blue transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-mako-blue border border-blue-100 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950">106 Automated EAs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ICT Silver Bullet bots, London breakout engines, Mean Reversion scalpers, and Martingale-free quantitative algorithms.
            </p>
            <div className="pt-2 text-xs font-mono text-mako-blue font-bold flex items-center gap-1">
              <span>Dual .EX5 + .MQ5</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-7 rounded-3xl border border-slate-200 bg-white space-y-4 hover:border-mako-blue transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950">Order Flow & Liquidity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fair Value Gap (FVG) visualizers, Delta Divergence radars, Session Volume Profile heatmaps, and Multi-Timeframe Orderblocks.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-600 font-bold flex items-center gap-1">
              <span>Institutional HUD</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-7 rounded-3xl border border-slate-200 bg-white space-y-4 hover:border-mako-blue transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950">Prop Firm Hard Shields</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trailing daily drawdown monitors, emergency close-all panic triggers, news blackout guards, and lot size auto-calibrators.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
              <span>FTMO & Apex Ready</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Terminal Preview Banner (Direct User Onboarding) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-300 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 p-8 sm:p-14 text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none tech-grid-light"></div>
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Mako Terminal Live Hub
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              One Login. <br />
              All 533 MT5 Tools Unlocked.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Once you sign in with your email or Google, you enter the Mako Terminal: an instant search and download cockpit with direct 1-click .EX5 binaries, auditable source code, and automatic MT5 account licensing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-blue-500/30 transition-all"
            >
              Sign In to Enter Terminal
            </Link>
            <Link
              href="/terminal"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-all border border-white/15"
            >
              Browse Catalog Publicly
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Strategic Pricing Tiers */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing • No Single Item Traps
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Simple, Institutional Access</h2>
          <p className="text-sm text-slate-600">Start with our essential zero-cost utilities, or unlock the entire 533 quantitative arsenal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Tier 1: Free Starter */}
          <div className="rounded-3xl border border-slate-300 bg-white p-7 sm:p-9 space-y-6 flex flex-col justify-between white-card shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">Starter Edition</div>
                <div className="text-4xl font-extrabold text-slate-950 mt-1">$0 <span className="text-xs text-slate-500 font-normal">/ forever</span></div>
                <p className="text-xs text-slate-500 mt-2">Essential utility pack to verify our clean code quality on your demo or live MT5 charts.</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 tracking-wider">What&apos;s Included:</div>
                <ul className="space-y-3.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>20 Essential Starter Utilities</strong> (.MQ5 Source Code)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Risk Calculator, Spread Radar & Sessions HUD</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>1 MT5 Account Slot</strong> (Live or Demo)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Full Access to Prop Firm Rules Matrix & Diagnostics</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-4 h-4 text-center text-xs font-bold font-mono">✕</span>
                    <span className="line-through">Pre-Compiled .EX5 Binaries (Compile via F7)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-4 h-4 text-center text-xs font-bold font-mono">✕</span>
                    <span className="line-through">Automated Expert Advisors (EAs)</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link 
              href="/login?plan=starter"
              className="block w-full py-3.5 text-center text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all shadow-sm"
            >
              Sign In to Activate Starter (1 MT5 Slot)
            </Link>
          </div>

          {/* Tier 2: Mako Pro Pass ($29/mo) */}
          <div className="relative rounded-3xl border-2 border-mako-blue bg-white p-7 sm:p-9 space-y-6 shadow-xl shadow-blue-500/10 flex flex-col justify-between white-card">
            <div className="absolute -top-3.5 right-6 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-mako-blue to-cyan-500 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-md">
              ALL-ACCESS PASS
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-mako-blue uppercase tracking-wider font-bold">Mako Pro Pass</div>
                <div className="text-4xl font-extrabold text-slate-950 mt-1">$29 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                <p className="text-xs text-slate-600 mt-2">Bypass individual \$30 minimums. The complete quantitative institutional arsenal for funded traders.</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-mono uppercase text-mako-blue font-bold mb-3 tracking-wider">Everything Unlocked:</div>
                <ul className="space-y-3.5 text-xs text-slate-800 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span><strong>Full 533 MT5 Algorithm Catalog</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span><strong>Dual Downloads:</strong> Compiled .EX5 + .MQ5 Source for All</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span><strong>All 106 Automated Expert Advisors (EAs)</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span>Prop-Firm Hard Equity Shields & Emergency Liquidators</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span><strong>Mako AI Studio:</strong> Generate & customize MQL5 strategies</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0" />
                    <span><strong>3 to 5 Active MT5 Slots</strong> (Challenge + Funded Accounts)</span>
                  </li>
                </ul>
              </div>
            </div>

            <a 
              href="https://buy.stripe.com/test_placeholder_29"
              className="block w-full py-4 text-center text-xs font-bold rounded-xl bg-mako-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Get All-Access Pass ($29/mo)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
