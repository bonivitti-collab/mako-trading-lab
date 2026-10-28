"use client";

import { useState, useEffect } from "react";
import { Shield, Copy, Check, AlertCircle, RefreshCw, Plus, Trash2, Key, CheckCircle2, Lock, HelpCircle, UserCheck } from "lucide-react";

export default function Dashboard() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<"slots" | "guide">("slots");
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
          setCurrentUser(JSON.parse(stored));
        } catch(e) {}
      }
    }
  }, []);

  const [slots, setSlots] = useState([
    { id: 1, login: "88991122", label: "FTMO 100K Challenge (Demo)", cooldownDays: 0, status: "Active" },
    { id: 2, login: "12345678", label: "IC Markets Live (Raw ECN)", cooldownDays: 4, status: "Active" },
    { id: 3, login: "99887766", label: "Apex Trader Funding (Funded)", cooldownDays: 0, status: "Active" },
    { id: 4, login: "", label: "", cooldownDays: 0, status: "Empty Slot" },
    { id: 5, login: "", label: "", cooldownDays: 0, status: "Empty Slot" }
  ]);
  const [newLogin, setNewLogin] = useState("");
  const [newLabel, setNewLabel] = useState("");

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
      cooldownDays: 7, // 7-day anti-abuse cooldown
      status: "Active"
    };
    setSlots(updated);
    setNewLogin("");
    setNewLabel("");
  };

  const handleClearSlot = (index: number) => {
    if (slots[index].cooldownDays > 0) {
      alert(`Anti-Abuse Rule: This slot is locked for ${slots[index].cooldownDays} more days before you can swap accounts.`);
      return;
    }
    const updated = [...slots];
    updated[index] = { id: index + 1, login: "", label: "", cooldownDays: 0, status: "Empty Slot" };
    setSlots(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold mb-2">
            <Key className="w-3.5 h-3.5" />
            Zero-Password Licensing Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950">
            {currentUser.role === "owner" ? "Painel de Controle do Administrador" : "License Manager & MT5 Accounts"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {currentUser.role === "owner" 
              ? "Visão geral executiva da plataforma, telemetria de licenças e autorização de contas MT5."
              : "Authorize your MetaTrader 5 account numbers directly on the high-speed verification network."}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "slots" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            {currentUser.role === "owner" ? "Minhas Contas MT5" : "My Accounts"} ({slots.filter(s => s.login).length}/{currentUser.max_mt5_slots || 5})
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "guide" ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Setup Guide (1-Step)
          </button>
        </div>
      </div>

      {/* Admin Executive Overview (Exibido para você) */}
      {currentUser.role === "owner" && (
        <div className="rounded-3xl border border-slate-300 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
            <div>
              <div className="text-xs font-mono text-mako-blue uppercase font-bold tracking-wider">Acesso de Administrador</div>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">Status Geral do Mako Trading Lab</h2>
              <p className="text-xs text-slate-500">Logado como: <strong className="text-slate-900">dbonivitti@gmail.com</strong> (Proprietário)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SERVIDORES OPERACIONAIS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Catálogo Total</div>
              <div className="text-2xl font-black font-mono text-slate-900">533 Ferramentas</div>
              <div className="text-[11px] text-slate-500">533 .EX5 + 533 .MQ5</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Divisão dos Planos</div>
              <div className="text-2xl font-black font-mono text-emerald-600">20 Free / 513 Pro</div>
              <div className="text-[11px] text-slate-500">Plano Pro a $29/mês</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Capacidade MT5</div>
              <div className="text-2xl font-black font-mono text-cyan-600">5 Contas Ativas</div>
              <div className="text-[11px] text-slate-500">Permissão Ilimitada Owner</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-medium">Licenciamento</div>
              <div className="text-2xl font-black font-mono text-mako-blue">WebRequest 200 OK</div>
              <div className="text-[11px] text-slate-500">Anti-Pirataria Nativo</div>
            </div>
          </div>
        </div>
      )}

      {/* What is an MT5 Account Slot? (Guia Visual Ultra Didático) */}
      <div className="rounded-3xl border border-slate-300 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-mako-blue border border-blue-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-950">
              O que é uma Conta MT5 e como funciona a liberação?
            </h3>
            <p className="text-xs text-slate-500">
              Guia rápido para iniciantes • Zero senhas • Configuração feita em menos de 1 minuto
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">1</span>
              <span>O que é o número da conta?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              É apenas o <strong>login numérico</strong> que sua corretora (ou mesa proprietária como FTMO) te envia (ex: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-bold text-slate-900">88991122</code>). Ele aparece no topo esquerdo do seu MetaTrader 5.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">2</span>
              <span>Preciso colocar minha senha?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>NUNCA.</strong> O Mako Trading Lab é 100% seguro e <em>Zero-Password</em>. Nós nunca pedimos nem temos acesso à sua senha de negociação ou do seu saldo. Apenas autorizamos o número da conta.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-mono font-bold text-mako-blue flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-mako-blue flex items-center justify-center text-[11px]">3</span>
              <span>Como o robô sabe que paguei?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Quando você arrasta o robô pro gráfico, ele lê o número da sua conta e checa em milissegundos se ela está na sua lista abaixo. Estando cadastrada, ele liga imediatamente!
            </p>
          </div>
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

      {/* Account Slots Management (Step 2) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Active MT5 Account Slots
              <span className="text-xs font-mono font-normal text-slate-500">
                ({slots.filter(s => s.login).length} of {currentUser.max_mt5_slots || 5} allocated)
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Account: <strong className="text-slate-800">{currentUser.email}</strong> • Tools attached to these MT5 accounts validate automatically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-800 bg-cyan-50 border border-cyan-200 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              {currentUser.role === "owner" ? "OWNER / STUDIO PASS" : "PRO Tier Active"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, idx) => (
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
                  
                  {slot.cooldownDays > 0 ? (
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
          ))}
        </div>
      </div>
    </div>
  );
}
