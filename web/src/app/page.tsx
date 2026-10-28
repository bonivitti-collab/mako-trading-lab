"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/lib/products.json";
import { 
  Search, Download, Terminal, Shield, Zap, CheckCircle2, 
  ChevronRight, Cpu, SlidersHorizontal, ArrowUpRight, Copy, Check,
  Sparkles, ExternalLink, Activity, Info, X, Play, Code2, BookOpen, Compass
} from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterTier, setFilterTier] = useState<"all" | "free" | "pro">("all");
  const [filterType, setFilterType] = useState<"all" | "ea" | "indicator" | "script">("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Algorithms", count: 533 },
    { id: "risk_utilities", label: "Risk & Utilities", count: 107 },
    { id: "volume_orderflow", label: "Volume & Order Flow", count: 107 },
    { id: "trend_oscillators", label: "Trend & Momentum", count: 107 },
    { id: "price_action_smc", label: "Price Action & SMC", count: 106 },
    { id: "expert_advisors", label: "Expert Advisors (Bots)", count: 106 },
  ];

  const filteredProducts = useMemo(() => {
    return productsData.filter((item: any) => {
      const q = search.toLowerCase();
      const matchesSearch = 
        item.name.toLowerCase().includes(q) ||
        item.short_desc.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCat = activeCategory === "all" || item.category === activeCategory;
      const matchesTier = filterTier === "all" || 
                          (filterTier === "free" && !item.is_pro) || 
                          (filterTier === "pro" && item.is_pro);
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesCat && matchesTier && matchesType;
    });
  }, [search, activeCategory, filterTier, filterType]);

  const copySetCommand = (slug: string) => {
    navigator.clipboard.writeText(`#include <${slug}.mq5>`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* High-Contrast Light Hero Section */}
      <section className="relative rounded-3xl border border-slate-300 bg-white p-8 sm:p-14 overflow-hidden tech-grid-light shadow-sm">
        {/* Subtle Watermark Logo */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block opacity-[0.04] pointer-events-none select-none">
          <Image src="/mako_logo.png" alt="Mako BG" width={440} height={440} />
        </div>

        <div className="relative max-w-3xl space-y-7">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-mako-blue text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-mako-blue animate-pulse"></span>
            <span>Proprietary MT5 Algorithm Hub • 500+ Compiled .EX5 Binaries</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            The Institutional Pass for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mako-blue via-blue-600 to-cyan-600">
              MetaTrader 5 Algorithms.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Bypass the $30 individual minimum of MQL5 Market. Access essential starter utilities for free, or get the <strong>Mako Pro Pass ($29/mo)</strong> for unlimited downloads across our entire 500+ quantitative arsenal — including automated bots, order flow heatmaps, and prop-firm drawdown shields.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a 
              href="#pricing" 
              className="px-7 py-3.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <span>View All-Access Plans</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <Link 
              href="/ai-studio" 
              className="px-7 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center gap-2.5 transition-all shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-mako-blue group-hover:rotate-12 transition-transform" />
              <span>Create with AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-mako-blue font-bold border border-blue-200">PROMPT STUDIO</span>
            </Link>

            <Link 
              href="/guide" 
              className="px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>How to Use Guide</span>
            </Link>
          </div>

          {/* Social Proof & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950">500+</div>
              <div className="text-xs text-slate-500 font-medium">Compiled .EX5 Binaries</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">20 FREE</div>
              <div className="text-xs text-slate-500 font-medium">Starter Utilities</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-mako-blue">0 ERRORS</div>
              <div className="text-xs text-slate-500 font-medium">MetaEditor Audited</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800">24H CACHE</div>
              <div className="text-xs text-slate-500 font-medium">Offline Resilience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Station: Search, Filters & Types */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Instant Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search 500+ tools by keyword (e.g. FVG, PropFirm, Scalper, SMC, VWAP, Trail)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-mako-blue focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type selector (EA vs Indicator) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                All Types
              </button>
              <button
                onClick={() => setFilterType("ea")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "ea" ? "bg-mako-blue text-white font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Bots (EA)
              </button>
              <button
                onClick={() => setFilterType("indicator")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "indicator" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Indicators
              </button>
            </div>

            {/* Tier Switcher (Free vs Pro) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono">
              <button 
                onClick={() => setFilterTier("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTier === "all" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                All (100)
              </button>
              <button 
                onClick={() => setFilterTier("free")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTier === "free" ? "bg-emerald-600 text-white font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Free (20)
              </button>
              <button 
                onClick={() => setFilterTier("pro")}
                className={`px-3 py-1.5 rounded-lg transition-all ${filterTier === "pro" ? "bg-mako-blue text-white font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                PRO (80)
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-2 ${
                activeCategory === c.id 
                  ? "bg-mako-blue text-white shadow-md shadow-blue-500/20 font-semibold" 
                  : "bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 shadow-sm"
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                activeCategory === c.id ? "bg-white/20 text-white font-bold" : "bg-slate-100 text-slate-500"
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Product Cards (High-Contrast White Cards with Logic Summary) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono px-1">
          <div>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> verified algorithms
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Compiled .EX5 Ready
            </span>
            <span>•</span>
            <span className="text-slate-500">Instant MT5 Account Linking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p: any) => (
            <div 
              key={p.slug}
              className="group relative rounded-2xl white-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Type, Version & Tier Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                      {p.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">v{p.version}</span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    p.is_pro 
                      ? "bg-blue-50 text-mako-blue border border-blue-200" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {p.is_pro ? "PRO PASS" : "FREE STARTER"}
                  </span>
                </div>

                {/* Title & Short Description */}
                <div className="space-y-1.5">
                  <h3 
                    onClick={() => setSelectedProduct(p)}
                    className="text-base font-bold text-slate-900 group-hover:text-mako-blue transition-colors leading-snug cursor-pointer"
                    title={p.name}
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.short_desc}
                  </p>
                </div>

                {/* What it does / How it works - Full Text & Auditable */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
                  <div>
                    <strong className="text-slate-950 font-mono text-[10px] uppercase font-bold tracking-wider block mb-0.5">Function:</strong>
                    <span className="text-slate-600 leading-relaxed text-[11px] block">{p.what_it_does}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/80">
                    <strong className="text-mako-blue font-mono text-[10px] uppercase font-bold tracking-wider block mb-0.5">Logic:</strong>
                    <span className="text-slate-600 leading-relaxed text-[11px] block font-mono bg-white p-2 rounded-lg border border-slate-200 text-[10px]">{p.how_it_works}</span>
                  </div>
                </div>

                {/* Technical Tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    {p.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    DPI-Scaled HUD
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    Zero-Lag
                  </span>
                </div>
              </div>

              {/* Bottom Actions: Inspect Spec & Download */}
              <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="text-xs font-mono text-slate-600 hover:text-mako-blue flex items-center gap-1.5 transition-colors font-bold"
                >
                  <Info className="w-3.5 h-3.5 text-mako-blue" />
                  <span>Audit Logic</span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a 
                    href={`/downloads/${p.slug}.mq5`} 
                    download
                    title="Download MQL5 Source Code (.mq5)"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5 text-mako-blue" />
                    <span>.MQ5</span>
                  </a>
                  <a 
                    href={`/downloads/${p.slug}.ex5`} 
                    download
                    title="Download Compiled MT5 Binary (.ex5)"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      p.is_pro
                        ? "bg-mako-blue hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "bg-blue-50 hover:bg-blue-100 text-mako-blue border border-blue-200"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.EX5</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Detail Modal (With Auditable Logic Section) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-300 bg-white p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute top-5 right-5">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pr-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase font-bold border border-slate-300">
                  {selectedProduct.type.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">Version {selectedProduct.version}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                  selectedProduct.is_pro ? "bg-blue-50 text-mako-blue border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {selectedProduct.is_pro ? "PRO TOOL" : "FREE STARTER"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950">{selectedProduct.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.short_desc}</p>
            </div>

            {/* Auditable Logic Breakdown */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-700">
              <div className="space-y-1">
                <div className="font-bold font-mono text-slate-950 flex items-center gap-1.5 uppercase text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-mako-blue" />
                  <span>What It Does:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedProduct.what_it_does}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200">
                <div className="font-bold font-mono text-mako-blue flex items-center gap-1.5 uppercase text-[11px]">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Mathematical & Execution Logic (Auditable):</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedProduct.how_it_works}</p>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] font-bold">EXECUTION ENVIRONMENT</div>
                <div className="text-slate-900 font-bold">MetaTrader 5 (x64)</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] font-bold">INTEGRATED PROTECTION</div>
                <div className="text-mako-blue font-bold">LicenseGuard + 24h Cache</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-mako-blue" />
                <span>How to Install into your MT5:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 font-mono text-[11px] text-slate-700">
                <li>Download the compiled binary <code className="text-mako-blue font-bold">{selectedProduct.slug}.ex5</code>.</li>
                <li>In MT5, click <code className="text-slate-900 font-semibold">File → Open Data Folder → MQL5/{selectedProduct.type === 'indicator' ? 'Indicators' : 'Experts'}</code>.</li>
                <li>Paste the file, right-click &quot;Refresh&quot; in MT5 Navigator, and drag to any chart!</li>
              </ol>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => copySetCommand(selectedProduct.slug)}
                className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors font-medium"
              >
                {copiedSlug === selectedProduct.slug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSlug === selectedProduct.slug ? "Copied!" : "Copy include path"}</span>
              </button>

              <div className="flex items-center gap-2">
                <a 
                  href={`/downloads/${selectedProduct.slug}.mq5`} 
                  download
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Code2 className="w-4 h-4 text-mako-blue" />
                  <span>Download .MQ5 Source</span>
                </a>
                <a 
                  href={`/downloads/${selectedProduct.slug}.ex5`} 
                  download
                  className="px-6 py-2.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .EX5 Binary</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing / Pass Section (2 Strategic Tiers: Free Starter vs Mako Pro Pass $29) */}
      <section id="pricing" className="pt-16 border-t border-slate-200 text-center space-y-10">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing • No $30 Single Lock-in
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Simple, Institutional Access</h2>
          <p className="text-sm text-slate-600">Start with our essential zero-cost utilities, or unlock the entire 500+ quantitative algorithmic arsenal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Tier 1: Free Starter (Taste / Gateway) */}
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
                    <span><strong>20 Essential Starter Utilities</strong> (.EX5 & .MQ5)</span>
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
                    <span className="line-through">Automated Expert Advisors (EAs)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-4 h-4 text-center text-xs font-bold font-mono">✕</span>
                    <span className="line-through">Institutional SMC & Order Flow Engine</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link 
              href="/dashboard"
              className="block w-full py-3.5 text-center text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all shadow-sm"
            >
              Start Free (1 MT5 Slot)
            </Link>
          </div>

          {/* Tier 2: Mako Pro Pass ($29/mo - All Inclusive) */}
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
                    <span><strong>Full 500+ MT5 Algorithm Catalog</strong> (533 Tools)</span>
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
