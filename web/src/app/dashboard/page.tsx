"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Key, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  UserCheck,
  Terminal,
  HeartHandshake,
  Sparkles,
  Eye,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const CHECKOUT_URL = "https://makotrading.lemonsqueezy.com/checkout/buy/5928ad57-c624-4697-b474-0a40ce1568af";

export default function Dashboard() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<"slots" | "guide">("slots");
  const [simulatedRole, setSimulatedRole] = useState<"owner" | "pro">("owner");
  const [currentUser, setCurrentUser] = useState<any>({
    email: "dbonivitti@gmail.com",
    role: "owner",
    plan_tier: "studio",
    max_mt5_slots: 5
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mako_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const isOwner = parsed.role === "owner" || (parsed.email && parsed.email.toLowerCase().includes("bonivitti"));
          const savedSim = parsed.simulated_role as "owner" | "pro" | undefined;
          const paid = parsed.plan_tier === "pro" || parsed.plan_tier === "studio" || parsed.role === "owner";
          const effectiveRole: "owner" | "pro" = isOwner
            ? ((savedSim === "pro" || savedSim === "owner") ? savedSim : "owner")
            : "pro";
          
          setCurrentUser({
            ...parsed,
            role: isOwner ? "owner" : parsed.role || "user",
            plan_tier: isOwner ? (effectiveRole === "owner" ? "studio" : "pro") : (paid ? "pro" : "free"),
            max_mt5_slots: effectiveRole === "owner" ? 5 : (paid ? 3 : 0),
            simulated_role: effectiveRole,
            has_active_pass: isOwner || paid
          });
          setSimulatedRole(effectiveRole);
        } catch(e) {}
      } else {
        const defaultOwner = {
          email: "dbonivitti@gmail.com",
          role: "owner",
          plan_tier: "studio",
          max_mt5_slots: 5,
          simulated_role: "owner"
        };
        localStorage.setItem("mako_user", JSON.stringify(defaultOwner));
        document.cookie = `mako_user=${encodeURIComponent(JSON.stringify(defaultOwner))}; path=/; max-age=2592000`;
        setCurrentUser(defaultOwner);
      }
    }
  }, []);

  // Switch perspective and persist across the whole website so Admin can audit every page as that client tier
  const handleSelectViewMode = (mode: "owner" | "pro") => {
    setSimulatedRole(mode);
    const maxSlots = mode === "owner" ? 5 : 3;
    const planTier = mode === "owner" ? "studio" : "pro";
    const updatedUser = {
      ...currentUser,
      role: "owner",
      plan_tier: planTier,
      max_mt5_slots: maxSlots,
      simulated_role: mode
    };
    setCurrentUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("mako_user", JSON.stringify(updatedUser));
      document.cookie = `mako_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("storage"));
    }
  };

  const [slots, setSlots] = useState([
    { id: 1, login: "88991122", label: "FTMO 100K Challenge (Demo)", cooldownDays: 0, status: "Active" },
    { id: 2, login: "12345678", label: "IC Markets Live (Raw ECN)", cooldownDays: 4, status: "Active" },
    { id: 3, login: "99887766", label: "Apex Trader Funding (Funded)", cooldownDays: 0, status: "Active" },
    { id: 4, login: "", label: "", cooldownDays: 0, status: "Empty Slot" },
    { id: 5, login: "", label: "", cooldownDays: 0, status: "Empty Slot" }
  ]);
  const [newLogin, setNewLogin] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const isTrueOwner = currentUser.role === "owner" || (currentUser.email && currentUser.email.toLowerCase().includes("bonivitti"));

  // Compute how many slots the current view mode allows (Pro Pass = 3, Owner = 5, unpaid = 0)
  const allowedSlotCount = (!isTrueOwner && !currentUser.has_active_pass) ? 0 : (simulatedRole === "owner" ? 5 : 3);
  const allocatedInView = slots.slice(0, allowedSlotCount).filter(s => s.login).length;

  const copyEndpoint = () => {
    navigator.clipboard.writeText("https://makotradinglab.com");
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleAssignSlot = (index: number) => {
    if (!newLogin) return;
    const updated = [...slots];
    updated[index] = {
      id: index + 1,
      login: newLogin,
      label: newLabel || "MT5 Account",
      cooldownDays: 7,
      status: "Active"
    };
    setSlots(updated);
    setNewLogin("");
    setNewLabel("");
  };

  const handleClearSlot = (index: number) => {
    if (slots[index].cooldownDays > 0 && simulatedRole !== "owner") {
      alert(`Anti-Abuse Rule: This slot is locked for ${slots[index].cooldownDays} more days before you can swap accounts.`);
      return;
    }
    const updated = [...slots];
    updated[index] = { id: index + 1, login: "", label: "", cooldownDays: 0, status: "Empty Slot" };
    setSlots(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Admin Executive Control & View Mode Switcher (Always visible at top for Owner so you never get stuck) */}
      {isTrueOwner && (
        <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-mako-blue uppercase font-bold tracking-wider">
                <Eye className="w-3.5 h-3.5" />
                <span>Administrator Interactive Auditor</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">Mako Trading Lab — Client View Simulator</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Logged in as: <strong className="text-slate-900">dbonivitti@gmail.com</strong> (Owner). Click any View Mode below to transform this screen and the entire website into that exact client experience:
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-300 text-xs font-mono">
                <span className="text-[10px] text-slate-500 px-2 font-bold uppercase">View Mode:</span>
                <button
                  type="button"
                  onClick={() => handleSelectViewMode("owner")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    simulatedRole === "owner" 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  Admin/Owner (5 Slots)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectViewMode("pro")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    simulatedRole === "pro" 
                      ? "bg-mako-blue text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  Pro Pass ($19/mo)
                </button>
              </div>
            </div>
          </div>

          {/* Live Audit Status & Quick Links to Test Other Pages in Current Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
              simulatedRole === "pro" ? "bg-blue-50/70 border-mako-blue ring-2 ring-blue-500/20" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Pro Pass View ($19)</span>
                {simulatedRole === "pro" && <span className="text-[10px] px-2 py-0.5 rounded bg-mako-blue text-white font-mono">ACTIVE</span>}
              </div>
              <div className="text-xl font-black font-mono text-mako-blue">3 MT5 Slots</div>
              <div className="text-[11px] text-slate-600">533 .EX5+.MQ5 Unlocked • Mindset AI Unlocked • AI Studio Active</div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
              simulatedRole === "owner" ? "bg-slate-100 border-slate-400 ring-2 ring-slate-900/15" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Admin/Owner View</span>
                {simulatedRole === "owner" && <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white font-mono">ACTIVE</span>}
              </div>
              <div className="text-xl font-black font-mono text-slate-900">5 MT5 Slots</div>
              <div className="text-[11px] text-slate-600">Zero Cooldown Lock • Full System Telemetry • All Features</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase">Audit Pages in {simulatedRole.toUpperCase()} Mode:</div>
              <div className="flex flex-col gap-1.5">
                <Link 
                  href="/psychology" 
                  className="text-xs font-bold text-mako-blue hover:underline flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                >
                  <span>1. Audit Mindset AI "(Unlocked)"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link 
                  href="/terminal" 
                  className="text-xs font-bold text-mako-blue hover:underline flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                >
                  <span>2. Audit 533 Catalog "(All Open)"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Perspective Header (Dynamically changes according to View Mode) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold mb-2">
            <Key className="w-3.5 h-3.5" />
            <span>
              {simulatedRole === "owner" 
                ? "Zero-Password Licensing • Administrator Master View" 
                : "Mako Pro Pass ($19/mo) • Client Account Portal"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">
            {simulatedRole === "owner" 
              ? "Administrator Control Panel" 
              : "Pro Pass Member — MT5 License Manager"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {simulatedRole === "owner" 
              ? "Master account with 5 unrestricted MT5 slots and zero swap cooldown."
              : currentUser.has_active_pass
              ? "Your Mako Pro Pass is active! You have 3 MT5 account slots and full access to all 533 .EX5 binaries, AI Studio, and Mindset AI."
              : "Your account is ready. Activate Mako Pro Pass ($19/mo) to unlock MT5 licensing, the 533-tool catalog, AI Studio, and Mindset AI."}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "slots" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            MT5 Slots ({allocatedInView}/{allowedSlotCount})
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "guide" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Setup Guide (1-Step)
          </button>
        </div>
      </div>

      {/* Unpaid member: Pro Pass required */}
      {!isTrueOwner && !currentUser.has_active_pass && (
        <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-white to-blue-50 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-mono font-bold uppercase">
              <Lock className="w-3 h-3" />
              <span>Pro Pass Required</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              Unlock All 533 Compiled .EX5 Algorithms, 3 MT5 Slots & Mindset AI Psychologist
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mako Trading Lab is Pro Pass only. Subscribe for <strong>$19/mo</strong> to unlock the full catalog, dual .EX5 + .MQ5 downloads, AI Studio, Mindset AI, and 3 simultaneous MT5 license slots.
            </p>
          </div>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap transition-all"
          >
            <span>Get Pro Pass ($19/mo)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Client Plan Feature Matrix */}
      {(() => {
        const unlocked = isTrueOwner || !!currentUser.has_active_pass;
        return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold">Catalog Access</div>
            <div className="text-base font-extrabold text-slate-950">
              {unlocked ? "All 533 Tools (.EX5 + .MQ5)" : "Locked — Pro Pass Required"}
            </div>
            <p className="text-xs text-slate-500">
              {unlocked ? "106 Automated EAs + 427 Indicators" : "Subscribe to unlock the full catalog"}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
            unlocked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {unlocked ? "UNLOCKED" : "LOCKED"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold">Mako AI Psychologist</div>
            <div className="text-base font-extrabold text-slate-950">
              {unlocked ? "24/7 Mindset AI Active" : "Locked — Pro Pass Required"}
            </div>
            <p className="text-xs text-slate-500">
              {unlocked ? "Full emotional & drawdown coaching" : "Included with Mako Pro Pass ($19/mo)"}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
            unlocked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            {unlocked ? "ACTIVE" : "LOCKED"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold">Mako AI Studio (Generator)</div>
            <div className="text-base font-extrabold text-slate-950">
              {unlocked ? "Unlimited MQL5 Synthesis" : "Locked — Pro Pass Required"}
            </div>
            <p className="text-xs text-slate-500">
              {unlocked ? "Generate custom EAs & Indicators" : "Included with Mako Pro Pass ($19/mo)"}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
            unlocked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
            {unlocked ? "ACTIVE" : "LOCKED"}
          </span>
        </div>
      </div>
        );
      })()}

      {/* Account Slots Management (Step 2) - Dynamically locks slots beyond allowedSlotCount */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Authorized MT5 Account Slots
              <span className="text-xs font-mono font-normal text-slate-500">
                ({allocatedInView} of {allowedSlotCount} available in {simulatedRole.toUpperCase()} plan)
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Account: <strong className="text-slate-800">{ isTrueOwner && simulatedRole === "pro" ? "client.pro@makotradinglab.com (Simulated)" : currentUser.email }</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-3.5 py-1 rounded-full flex items-center gap-1.5 font-bold ${
              simulatedRole === "owner" 
                ? "text-slate-900 bg-slate-100 border border-slate-300" 
                : "text-mako-blue bg-blue-50 border border-blue-200"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                simulatedRole === "owner" ? "bg-slate-900" : "bg-mako-blue"
              }`}></span>
              {simulatedRole === "owner" ? "OWNER (5 SLOTS)" : "PRO PASS (3 SLOTS)"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, idx) => {
            const isSlotLockedByTier = idx >= allowedSlotCount;

            if (isSlotLockedByTier) {
              return (
                <div
                  key={slot.id}
                  className="rounded-2xl border border-slate-200 bg-slate-100/75 p-6 flex flex-col justify-between space-y-5 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      Account Slot #{slot.id}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{simulatedRole === "pro" ? "OWNER SLOT" : "STUDIO / OWNER"}</span>
                    </span>
                  </div>

                  <div className="space-y-2 py-3 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {"Additional Institutional Slot"}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {"Pro Pass includes 3 active MT5 slots for your Challenge and Funded accounts."}
                    </p>
                  </div>

                  <a
                    href={CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-white hover:bg-blue-50 text-mako-blue border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Unlock with Pro Pass ($19/mo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            }

            return (
              <div 
                key={slot.id} 
                className={`rounded-2xl border p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                  slot.login 
                    ? "bg-white border-slate-200 hover:border-mako-blue" 
                    : "bg-slate-50/70 border-dashed border-slate-300 hover:border-mako-blue"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                    Account Slot #{slot.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    slot.login ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
                  }`}>
                    {slot.status}
                  </span>
                </div>

                {slot.login ? (
                  <div className="space-y-3">
                    <div className="text-2xl font-black font-mono text-slate-950 tracking-wider flex items-center gap-2">
                      <span>#{slot.login}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-slate-700 font-medium truncate bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {slot.label}
                    </div>
                    
                    {slot.cooldownDays > 0 && simulatedRole !== "owner" ? (
                      <div className="text-[11px] font-mono text-amber-700 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Locked for {slot.cooldownDays}d (Anti-Abuse)</span>
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1.5 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Ready to swap anytime</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 py-1">
                    <input 
                      type="text" 
                      placeholder="MT5 Login (numbers only)"
                      value={newLogin}
                      onChange={(e) => setNewLogin(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-mako-blue"
                    />
                    <input 
                      type="text" 
                      placeholder="Label (e.g. FTMO Challenge)"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-mako-blue"
                    />
                    <button 
                      onClick={() => handleAssignSlot(idx)}
                      className="w-full py-2.5 bg-mako-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Authorize MT5 Account</span>
                    </button>
                  </div>
                )}

                {slot.login && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 text-[10px]">24H CACHE ACTIVE</span>
                    <button 
                      onClick={() => handleClearSlot(idx)}
                      className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unlink</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zero-Friction Onboarding Box (Step 1) */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 space-y-5 tech-grid-light shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-900 text-sm font-bold">
            <Shield className="w-5 h-5 text-mako-blue" />
            <span>Essential 1-Step Setup: Authorize WebRequest in MetaTrader 5</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-100 text-mako-blue font-bold border border-blue-200">
            MANDATORY ONCE
          </span>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Mako tools require <strong>zero passwords</strong>. The EA/Indicator reads your account number and checks with our secure verification server. To enable this, simply add our URL to your MT5 terminal:
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 flex items-center justify-between shadow-sm">
            <span>https://makotradinglab.com</span>
            <span className="text-[10px] text-slate-400 font-bold hidden md:inline">PORT 443 (HTTPS)</span>
          </div>
          <button 
            onClick={copyEndpoint}
            className="px-5 py-3 rounded-xl bg-mako-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUrl ? "URL Copied to Clipboard!" : "Copy Verification URL"}</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
          <span className="text-mako-blue font-bold">PATH:</span>
          <span>Tools → Options → Expert Advisors → Check &quot;Allow WebRequest for listed URL&quot; → Paste URL</span>
        </div>
      </div>

      {/* What is an MT5 Account Slot? (Ultra Beginner-Friendly Guide) */}
      <div className="rounded-3xl border border-slate-300 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-mako-blue border border-blue-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-950">
              What is an MT5 Account Slot and how does activation work?
            </h3>
            <p className="text-xs text-slate-500">
              Quick start guide • Zero passwords required • Setup takes under 60 seconds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">1</span>
              <span>What is your account number?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              It is simply the <strong>numerical login</strong> provided by your broker or prop firm like FTMO (e.g. <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-slate-900">88991122</code>). It is displayed in the upper-left corner of your MetaTrader 5 terminal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">2</span>
              <span>Do I need to enter my password?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>NEVER.</strong> Mako Trading Lab is 100% secure and <em>Zero-Password</em>. We never ask for and never have access to your trading password or your account balance. We only verify the account ID number.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">3</span>
              <span>How does the EA know I have an active pass?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              When you attach an EA or indicator to any chart, it reads your terminal account number and verifies in milliseconds that it is listed above. If active, the tool initializes instantly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
