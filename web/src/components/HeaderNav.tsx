"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Layers, 
  Sparkles, 
  ChevronDown, 
  Calculator, 
  Terminal, 
  Scale, 
  HeartHandshake, 
  BookOpen, 
  Compass, 
  Shield, 
  Wrench, 
  Menu, 
  X,
  ArrowRight,
  Globe
} from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/languageContext";
import { TRANSLATIONS } from "@/lib/translations";

export default function HeaderNav() {
  const pathname = usePathname();
  const { language, setLanguage, currentOption } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  
  const [toolsOpen, setToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ email?: string; role?: string; plan_tier?: string; simulated_role?: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const effectiveRole = userSession?.simulated_role || (userSession?.role === "owner" ? "owner" : userSession?.plan_tier === "pro" ? "pro" : userSession ? "starter" : null);
  const isOwnerSession = userSession?.role === "owner";

  // Sync logged in user from localStorage and cookie
  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("mako_user");
        if (stored) {
          try {
            setUserSession(JSON.parse(stored));
            return;
          } catch(e) {}
        }
        // Fallback check cookie
        const match = document.cookie.match(/mako_user=([^;]+)/);
        if (match) {
          try {
            const parsed = JSON.parse(decodeURIComponent(match[1]));
            localStorage.setItem("mako_user", JSON.stringify(parsed));
            setUserSession(parsed);
            return;
          } catch(e) {}
        }
        setUserSession(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    const interval = setInterval(checkUser, 1000);
    return () => {
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setToolsOpen(false);
    setLangOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isToolActive = ["/lot-calculator", "/diagnostics", "/prop-firm-matrix"].includes(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm group-hover:border-mako-blue transition-colors">
              <Image 
                src="/mako_logo.png" 
                alt="Mako Trading Lab" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-base tracking-wider text-slate-950">MAKO</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-mako-blue border border-blue-200 font-bold">MT5</span>
              </div>
              <span className="text-[9px] tracking-[0.25em] text-slate-500 uppercase font-mono mt-0.5 font-medium">Trading Lab</span>
            </div>
          </Link>

          {/* Desktop Clean Segmented Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
            {/* Terminal Hub */}
            <Link 
              href="/terminal" 
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                pathname === "/terminal" 
                  ? "bg-blue-50 text-mako-blue font-bold shadow-xs border border-blue-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-mako-blue" />
              <span>Terminal (533 Tools)</span>
            </Link>

            {/* Free Tools Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isToolActive || toolsOpen
                    ? "bg-blue-50 text-mako-blue font-bold border border-blue-200/60" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.navFreeUtilities}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Flyout Menu */}
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5 animate-fadeIn z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Instant Browser Calculators
                  </div>

                  <Link
                    href="/lot-calculator"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-mako-blue border border-blue-100 group-hover:bg-mako-blue group-hover:text-white transition-colors">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-mako-blue transition-colors">
                        {t.navLotCalc}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Calculate exact MT5 lots for Forex, Gold & Indices.
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/diagnostics"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-mako-blue transition-colors">
                        {t.navDiagnostics}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Check AlgoTrading, WebRequest & DLL permissions.
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/prop-firm-matrix"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-mako-blue transition-colors">
                        {t.navPropRules}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Compare FTMO, Apex & FundedNext drawdown traps.
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mindset / Trader Psychology */}
            <Link 
              href="/psychology" 
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                pathname === "/psychology" 
                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.navMindset}</span>
            </Link>

            {/* Research Articles */}
            <Link 
              href="/articles" 
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                pathname.startsWith("/articles") 
                  ? "bg-slate-100 text-mako-blue font-bold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navArticles}</span>
            </Link>

            {/* Setup Guide */}
            <Link 
              href="/guide" 
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                pathname === "/guide" 
                  ? "bg-slate-100 text-mako-blue font-bold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.navGuide}</span>
            </Link>

            {/* AI Studio */}
            <Link 
              href="/ai-studio" 
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap group ${
                pathname === "/ai-studio" 
                  ? "bg-blue-50 text-mako-blue font-bold border border-blue-200" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-mako-blue group-hover:rotate-12 transition-transform flex-shrink-0" />
              <span>Studio</span>
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown (Exact 11 MQL5 Languages) */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="text-xs font-semibold px-2.5 py-2 rounded-xl text-slate-700 hover:text-mako-blue hover:bg-slate-100 transition-all flex items-center gap-1.5 border border-slate-200"
              title="Select Platform Language"
            >
              <span className="text-sm">{currentOption.flag}</span>
              <span className="hidden md:inline font-mono text-[11px] font-bold uppercase">{currentOption.code}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-fadeIn z-50 max-h-80 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  MQL5 Supported Languages
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                      language === lang.code 
                        ? "bg-blue-50 text-mako-blue font-bold" 
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-mako-blue"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {userSession ? (
            <Link 
              href="/dashboard" 
              className="text-xs font-semibold px-3 py-2 rounded-xl text-mako-blue bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {isOwnerSession 
                  ? (effectiveRole === "pro" ? "Admin (Pro View)" : effectiveRole === "starter" ? "Admin (Starter View)" : "Admin Panel")
                  : "My Account"}
              </span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 hover:text-mako-blue hover:bg-slate-100 transition-all whitespace-nowrap"
            >
              {t.navSignIn}
            </Link>
          )}

          <Link 
            href="/dashboard" 
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-300 transition-all shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {effectiveRole === "owner" 
                ? "MT5 Slots: Owner (5)" 
                : effectiveRole === "pro" 
                ? "MT5 Slots: Pro (3)" 
                : effectiveRole === "starter" 
                ? "MT5 Slots: Starter (1)" 
                : "Contas MT5: Ativas"}
            </span>
          </Link>

          <a 
            href="https://makotrading.lemonsqueezy.com/checkout/buy/5928ad57-c624-4697-b474-0a40ce1568af"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <span>View Plans</span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">$29/mo</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link 
              href="/" 
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-mako-blue" />
              <span>Catalog</span>
            </Link>

            <Link 
              href="/psychology" 
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center gap-2 font-bold"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Mindset</span>
            </Link>

            <Link 
              href="/lot-calculator" 
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-mako-blue" />
              <span>Lot Calc</span>
            </Link>

            <Link 
              href="/diagnostics" 
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>Diagnostics</span>
            </Link>

            <Link 
              href="/prop-firm-matrix" 
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Prop Rules</span>
            </Link>

            <Link 
              href="/articles" 
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>Articles</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link 
              href="/ai-studio" 
              className="p-3 rounded-xl bg-blue-50 text-mako-blue font-bold text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Mako AI Studio</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              href="/guide" 
              className="p-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-400" />
                <span>MT5 Setup Guide</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}