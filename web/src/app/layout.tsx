import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Shield, Sparkles, Activity } from "lucide-react";
import type { Metadata } from "next";
import HeaderNav from "@/components/HeaderNav";
import { LanguageProvider } from "@/lib/languageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://makotradinglab.com"),
  title: {
    default: "Mako Trading Lab — 500+ Institutional MT5 Indicators, EAs & AI Studio",
    template: "%s | Mako Trading Lab"
  },
  description: "Bypass MQL5 Market $30+ price markups. Unlimited institutional MetaTrader 5 tools, prop-firm daily loss shields, order flow footprints, and generative AI bot builder for $10/mo.",
  keywords: [
    "MQL5 alternative",
    "MetaTrader 5 indicators download",
    "MT5 Expert Advisors subscription",
    "FTMO daily drawdown protector EA",
    "Order flow delta MT5 indicator",
    "Fair Value Gap FVG indicator MT5",
    "ICT Silver Bullet MT5 bot",
    "Prop firm EA MetaTrader 5",
    "MT5 risk management lot calculator",
    "AI MQL5 code generator",
    "trading psychology MT5 mentor",
    "cheap MT5 indicators",
    "best MT5 trading algorithms"
  ],
  authors: [{ name: "Mako Trading Lab" }],
  creator: "Mako Trading Lab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://makotradinglab.com",
    title: "Mako Trading Lab — 500+ Institutional MetaTrader 5 Algorithms",
    description: "The all-access institutional subscription for MetaTrader 5. Download 500+ verified .EX5 tools or generate custom EAs with AI.",
    siteName: "Mako Trading Lab",
    images: [
      {
        url: "/mako_logo.png",
        width: 800,
        height: 800,
        alt: "Mako Trading Lab Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mako Trading Lab — MetaTrader 5 All-Access Pass",
    description: "Access 500+ institutional MT5 indicators, prop-firm risk guards, and generative MQL5 bots for $29/month.",
    images: ["/mako_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mako Trading Lab",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "MetaTrader 5 (Windows x64)",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0.00",
      "highPrice": "29.00",
      "offerCount": "533"
    },
    "description": "Institutional repository of 500+ verified MetaTrader 5 Expert Advisors and technical indicators with zero-password licensing."
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-mako-blue selection:text-white">
        <LanguageProvider>
          {/* Top Ticker / Network Banner */}
          <div className="border-b border-slate-200 bg-white px-4 py-2 text-[11px] font-mono text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-mako-blue font-semibold">
                <span className="w-2 h-2 rounded-full bg-mako-blue animate-pulse"></span>
                <span>MAKO NETWORK: ONLINE</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-slate-500">CATALOG:</span>
                <span className="text-slate-900 font-bold">500+ VERIFIED .EX5 & .MQ5 TOOLS</span>
              </div>
              <span className="text-slate-300 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-slate-500">METATRADER COMPATIBILITY:</span>
                <span className="text-emerald-700 font-semibold">BUILD 4000+ (X64)</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-500 font-medium">
              <span>ZERO-PASSWORD LICENSEGUARD • 24H OFFLINE RESILIENCE</span>
            </div>
          </div>
        </div>

        {/* Clean White Institutional Navigation Bar */}
        <HeaderNav />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Crisp Institutional Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                  <Image src="/mako_logo.png" alt="Mako Footer Logo" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Mako Trading Lab</div>
                  <div className="text-[11px] text-slate-500 font-mono">Algorithmic Systems & Quantitative Distribution for MetaTrader 5</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-600 font-mono text-[11px]">
                <Link href="/" className="hover:text-mako-blue transition-colors">Catalog (100 Binaries)</Link>
                <Link href="/psychology" className="hover:text-emerald-700 transition-colors font-bold">Mindset & Psychology</Link>
                <Link href="/guide" className="hover:text-mako-blue transition-colors">How to Use</Link>
                <Link href="/articles" className="hover:text-mako-blue transition-colors">Strategy Articles</Link>
                <Link href="/market-news" className="hover:text-mako-blue transition-colors">Market News</Link>
                <Link href="/ai-studio" className="hover:text-mako-blue transition-colors">AI Studio</Link>
                <Link href="/dashboard" className="hover:text-mako-blue transition-colors">License Setup</Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-mono">
              <div>
                © 2026 Mako Trading Lab. MetaTrader 5 is a registered trademark of MetaQuotes Software Corp.
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification Server Online • Zero-Latency Cache</span>
              </div>
            </div>
          </div>
        </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
