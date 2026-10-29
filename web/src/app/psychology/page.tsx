"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, Send, Sparkles, MessageCircle, RefreshCw, Compass, ArrowRight, UserCheck, Lock } from "lucide-react";

export default function PsychologyPage() {
  const [ventMessage, setVentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userSession, setUserSession] = useState<{ role?: string; plan_tier?: string } | null>(null);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "mentor"; text: string }>>([
    {
      sender: "mentor",
      text: "Hello, I am your Mako Trading Psychologist & Mindset Mentor. Trading is one of the most psychologically demanding pursuits on earth. Whether you just blew a prop-firm evaluation, revenge-traded after a bad stop run, or feel completely paralyzed to take the next trade: talk to me freely. What is on your mind right now?"
    }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mako_user");
      if (stored) {
        try {
          setUserSession(JSON.parse(stored));
        } catch(e) {}
      }
    }
  }, []);

  const isProOrOwner = userSession?.role === "owner" || userSession?.plan_tier === "pro" || userSession?.plan_tier === "studio";

  const handleSend = async (customText?: string) => {
    const textToSend = customText || ventMessage;
    if (!textToSend.trim()) return;

    const newLog = [...chatLog, { sender: "user" as const, text: textToSend }];
    setChatLog(newLog);
    setVentMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/psychology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      setChatLog([...newLog, { sender: "mentor" as const, text: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Founder's Story & Letter */}
      <section className="rounded-3xl border border-slate-300 bg-white p-8 sm:p-12 space-y-7 white-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-emerald-700 uppercase font-bold tracking-wider">The Beginner&apos;s Room</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">A Letter from the Founder: You Are Not Failing, You Are Learning.</h1>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          <p>
            When you first open MetaTrader 5, the flashing numbers and candlestick wicks create an illusion that trading is about technical indicators and trendlines. But after your first blown account, you realize the brutal truth: <strong>trading is 10% strategy and 90% human emotion</strong>.
          </p>
          <p>
            I spent years blowing accounts, staying awake until 4 AM agonizing over revenge trades, and feeling the knot in my stomach every time a trade moved against me. You are fighting against multi-billion dollar algorithms programmed to exploit your fear and greed. Willpower alone cannot defeat them.
          </p>
          <p>
            That is why we built <strong>Mako Trading Lab</strong>: to give you quantitative armor. Our automated risk shields remove the emotional burden of cutting losses. And this room exists because every trader needs a place to decompress, speak openly without judgment, and rebuild their psychological capital.
          </p>
          <p className="font-semibold text-slate-900">
            Take a deep breath. Close your MT5 for the day if you are in drawdown. Talk to our mentor below, reset your mind, and remember: this is a marathon, not a sprint.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <span>Mako Trading Lab Founder & Quantitative Team</span>
          </div>
          <Link 
            href="/guide"
            className="text-mako-blue font-bold flex items-center gap-1 hover:underline"
          >
            <span>Read our 3-Step MT5 Setup Walkthrough</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Freeform Trading Psychologist AI Chat */}
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Conversation • 24/7 Grounded Mental Reset</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">Mako AI Trading Psychologist</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Type anything. Vent about a bad loss, fear of executing, overtrading, or account drawdown. Receive grounded, compassionate, and mathematically realistic advice to regain clarity.
          </p>
        </div>

        {/* Chat Conversation Box */}
        <div className="rounded-3xl border border-slate-300 bg-white shadow-sm overflow-hidden flex flex-col h-[600px] white-card">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>TRADING PSYCHOLOGY SESSION ACTIVE</span>
            </div>
            <span className="text-slate-500 font-medium">Safe Space • No Judgment</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatLog.map((c, i) => (
              <div 
                key={i} 
                className={`flex gap-3 ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {c.sender === 'mentor' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-xs font-mono shadow-sm">
                    Ψ
                  </div>
                )}
                <div 
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    c.sender === 'user' 
                      ? 'bg-mako-blue text-white font-medium rounded-br-none shadow-sm' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200 font-normal whitespace-pre-line'
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
                <span className="w-3.5 h-3.5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></span>
                <span>Crafting grounded perspective...</span>
              </div>
            )}
          </div>

          {/* Clean Open Chat Input or Pro Lock Barrier */}
          {isProOrOwner ? (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <input 
                type="text" 
                value={ventMessage}
                onChange={(e) => setVentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tell me what happened today... What are you feeling?"
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-mako-blue shadow-sm font-sans"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !ventMessage.trim()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mako AI Psychologist is Exclusive to Mako Pro Pass</div>
                  <div className="text-[11px] text-slate-500">Starter tier includes the 20 Essential MT5 Utilities. Upgrade to Pro ($29/mo) to unlock the 24/7 AI Mindset Mentor.</div>
                </div>
              </div>
              <a
                href="https://makotrading.lemonsqueezy.com/checkout/buy/5928ad57-c624-4697-b474-0a40ce1568af"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 whitespace-nowrap"
              >
                Unlock Pro Pass ($29/mo)
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
