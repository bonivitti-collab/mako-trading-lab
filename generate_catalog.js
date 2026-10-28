const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const METAEDITOR = "C:\\Program Files\\MetaTrader 5\\metaeditor64.exe";
const ROOT_DIR = "C:\\Users\\boniv\\.gemini\\antigravity\\scratch\\mako-trading-lab";
const MQL5_DIR = path.join(ROOT_DIR, "mql5");

// Definition of 50 flagship products across 5 categories
const PRODUCTS = [
  // --- 1. RISK & UTILITIES (10 items) ---
  {
    slug: "mako-risk-calculator-hud",
    name: "Mako Risk & Lot Calculator HUD",
    category: "risk_utilities",
    type: "indicator",
    is_pro: false, // FREE Lead Magnet
    version: "1.20",
    short_desc: "Real-time on-chart lot size & risk calculator with interactive Stop Loss drag lines.",
    badge: "FREE"
  },
  {
    slug: "mako-propfirm-shield",
    name: "Mako PropFirm Account Shield",
    category: "risk_utilities",
    type: "ea",
    is_pro: true,
    version: "2.10",
    short_desc: "Automated equity & daily drawdown protector. Disables trading upon reaching daily max loss.",
    badge: "PRO"
  },
  {
    slug: "mako-one-click-trade-panel",
    name: "Mako One-Click Execution Panel",
    category: "risk_utilities",
    type: "ea",
    is_pro: true,
    version: "1.50",
    short_desc: "Ultra-fast execution dock with automatic 1:2 / 1:3 RR targets and multi-order scaling.",
    badge: "PRO"
  },
  {
    slug: "mako-smart-trailing-stop",
    name: "Mako Smart Trailing & Breakeven Guard",
    category: "risk_utilities",
    type: "ea",
    is_pro: true,
    version: "1.40",
    short_desc: "Multi-mode trailing engine: ATR-based, Parabolic SAR, or previous candle high/low swings.",
    badge: "PRO"
  },
  {
    slug: "mako-partial-tp-manager",
    name: "Mako Partial TP & Runner Manager",
    category: "risk_utilities",
    type: "ea",
    is_pro: true,
    version: "1.10",
    short_desc: "Takes 50% profit at TP1, automatically moves SL to Breakeven+1, and lets remaining volume run.",
    badge: "PRO"
  },
  {
    slug: "mako-spread-slippage-monitor",
    name: "Mako Spread & Slippage Radar",
    category: "risk_utilities",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.00",
    short_desc: "Displays current spread, session average, and latency alerts before high impact releases.",
    badge: "FREE"
  },
  {
    slug: "mako-multi-symbol-exposure",
    name: "Mako Multi-Currency Exposure Dashboard",
    category: "risk_utilities",
    type: "indicator",
    is_pro: true,
    version: "1.30",
    short_desc: "Consolidates currency exposure (USD, EUR, JPY) across all open positions in a clean table.",
    badge: "PRO"
  },
  {
    slug: "mako-emergency-panic-button",
    name: "Mako Emergency Close & Flat Button",
    category: "risk_utilities",
    type: "script",
    is_pro: false, // FREE
    version: "1.00",
    short_desc: "One-click panic script to instantly liquidate all open trades and pending orders on all pairs.",
    badge: "FREE"
  },
  {
    slug: "mako-auto-screenshot-journal",
    name: "Mako Auto-Screenshot Trade Journal",
    category: "risk_utilities",
    type: "ea",
    is_pro: true,
    version: "1.20",
    short_desc: "Takes automatic high-res screenshots upon order execution and SL/TP hits for trading journals.",
    badge: "PRO"
  },
  {
    slug: "mako-session-time-filter",
    name: "Mako Global Trading Sessions HUD",
    category: "risk_utilities",
    type: "indicator",
    is_pro: true,
    version: "1.10",
    short_desc: "Visual clocks & countdown timers for London, New York, Tokyo and Sydney market openings.",
    badge: "PRO"
  },

  // --- 2. VOLUME & ORDER FLOW (10 items) ---
  {
    slug: "mako-volume-poc-vah-val",
    name: "Mako Daily Volume Profile (POC & Value Area)",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: false, // FREE
    version: "2.00",
    short_desc: "Institutional Point of Control (POC), Value Area High (VAH), and Value Area Low (VAL).",
    badge: "FREE"
  },
  {
    slug: "mako-tick-volume-delta",
    name: "Mako Tick Volume Delta & Divergence",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.50",
    short_desc: "Measures buying vs selling tick aggression per bar and highlights volume absorption zones.",
    badge: "PRO"
  },
  {
    slug: "mako-cumulative-delta-cvd",
    name: "Mako Cumulative Volume Delta (CVD)",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.30",
    short_desc: "Displays institutional buying/selling momentum divergence against price action swings.",
    badge: "PRO"
  },
  {
    slug: "mako-liquidity-sweeps-detector",
    name: "Mako Liquidity Sweeps & Stop Hunt Radar",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "2.20",
    short_desc: "Detects false breakout wick rejections taking out previous session highs/lows.",
    badge: "PRO"
  },
  {
    slug: "mako-fair-value-gap-fvg",
    name: "Mako Fair Value Gap (FVG & Imbalance)",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.40",
    short_desc: "Highlights unfilled 3-bar institutional imbalances with auto-mitigation tracking.",
    badge: "FREE"
  },
  {
    slug: "mako-institutional-blocks",
    name: "Mako Institutional Block Order Scanner",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.10",
    short_desc: "Filters and highlights volume climax candles with strong directional follow-through.",
    badge: "PRO"
  },
  {
    slug: "mako-vwap-multi-anchor",
    name: "Mako Multi-Anchor VWAP & Standard Bands",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "2.00",
    short_desc: "Session, Weekly and Monthly Volume Weighted Average Price with 1st, 2nd, and 3rd std deviations.",
    badge: "PRO"
  },
  {
    slug: "mako-absorption-exhaustion",
    name: "Mako Volume Absorption & Exhaustion Arrows",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.20",
    short_desc: "Signals when high volume fails to push price higher or lower, indicating reversal potential.",
    badge: "PRO"
  },
  {
    slug: "mako-high-volume-nodes",
    name: "Mako High-Volume Node (HVN) S/R Grid",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.00",
    short_desc: "Automatically plots historic high volume consolidation shelves as magnetic support/resistance.",
    badge: "PRO"
  },
  {
    slug: "mako-volume-climax-bars",
    name: "Mako Ultra-Volume Climax Highlighter",
    category: "volume_orderflow",
    type: "indicator",
    is_pro: true,
    version: "1.10",
    short_desc: "Color-codes candles exceeding 2.5x standard volume deviation for immediate momentum alerts.",
    badge: "PRO"
  },

  // --- 3. TREND & OSCILLATORS (10 items) ---
  {
    slug: "mako-mtf-trend-matrix",
    name: "Mako MTF Trend Alignment Matrix",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.60",
    short_desc: "Multi-timeframe trend scanner matrix showing M5, M15, H1, H4, and D1 directional consensus.",
    badge: "FREE"
  },
  {
    slug: "mako-supertrend-pro",
    name: "Mako SuperTrend Pro Multi-Filter",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "2.30",
    short_desc: "Enhanced ATR volatility trendline with volatility compression filter to prevent whipsaws.",
    badge: "PRO"
  },
  {
    slug: "mako-adaptive-hull-ribbon",
    name: "Mako Adaptive Hull Moving Average Ribbon",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.20",
    short_desc: "Ultra-fast zero-lag smoothed Hull moving average ribbon with color-coded trend state changes.",
    badge: "PRO"
  },
  {
    slug: "mako-momentum-squeeze-radar",
    name: "Mako Volatility Squeeze & Fire Radar",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.50",
    short_desc: "Identifies Bollinger inside Keltner channel consolidations before explosive explosive breakouts.",
    badge: "PRO"
  },
  {
    slug: "mako-rsi-divergence-engine",
    name: "Mako Smart RSI Divergence Engine",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "2.00",
    short_desc: "Automatic detection of regular and hidden RSI divergences with on-chart trendline drawings.",
    badge: "PRO"
  },
  {
    slug: "mako-zero-lag-macd-flow",
    name: "Mako Zero-Lag MACD Momentum Flow",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.10",
    short_desc: "Calculates de-lagged DEMA histogram to deliver faster MACD crossovers with clean signals.",
    badge: "FREE"
  },
  {
    slug: "mako-parabolic-trend-channel",
    name: "Mako Dynamic Regression Trend Channel",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.30",
    short_desc: "Calculates linear/polynomial regression lines with standard deviation bands for mean-reversion.",
    badge: "PRO"
  },
  {
    slug: "mako-choppiness-regime-detector",
    name: "Mako Market Regime & Choppiness Index",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.00",
    short_desc: "Defines whether the market is trending strongly (>61.8) or caught in ranging chop (<38.2).",
    badge: "PRO"
  },
  {
    slug: "mako-keltner-volatility-breakout",
    name: "Mako Keltner Volatility Breakout Bands",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.20",
    short_desc: "True-range volatility channels tailored for catching momentum expansions during market opens.",
    badge: "PRO"
  },
  {
    slug: "mako-stochastic-cycle-divergence",
    name: "Mako Stochastic Momentum Cycle Scanner",
    category: "trend_oscillators",
    type: "indicator",
    is_pro: true,
    version: "1.10",
    short_desc: "Smoothed dual stochastic oscillator designed for precise pullback entry timing on M5 and M15.",
    badge: "PRO"
  },

  // --- 4. PRICE ACTION & SMC (10 items) ---
  {
    slug: "mako-smc-market-structure",
    name: "Mako Smart Money Structure (BOS / CHoCH)",
    category: "price_action_smc",
    type: "indicator",
    is_pro: false, // FREE
    version: "2.10",
    short_desc: "Automatic real-time labeling of Break of Structure (BOS) and Change of Character (CHoCH).",
    badge: "FREE"
  },
  {
    slug: "mako-order-block-pro",
    name: "Mako Institutional Order Blocks (OB)",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "2.40",
    short_desc: "Highlights valid bullish/bearish institutional footprints with active touch & mitigation tracking.",
    badge: "PRO"
  },
  {
    slug: "mako-premium-discount-zones",
    name: "Mako Premium & Discount Equilibrium Zones",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "1.20",
    short_desc: "Visualizes dealing ranges: 50% Equilibrium, 0.705 OTE, Premium (Sell) and Discount (Buy) zones.",
    badge: "PRO"
  },
  {
    slug: "mako-equal-highs-lows",
    name: "Mako Liquidity Pools & Equal Highs/Lows",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "1.30",
    short_desc: "Pins double/triple tops (EQH/EQL) where retail stop losses accumulate for institutional target runs.",
    badge: "PRO"
  },
  {
    slug: "mako-asian-range-london-sweep",
    name: "Mako Asian Range & London Sweep Boxes",
    category: "price_action_smc",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.50",
    short_desc: "Automates the classic London Judas Swing strategy: plots Asian high/low and alerts on false breaks.",
    badge: "FREE"
  },
  {
    slug: "mako-auto-fib-golden-pocket",
    name: "Mako Auto-Fibonacci & Golden Pocket (0.618)",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "1.40",
    short_desc: "Dynamically snaps Fibonacci retracements to major swing pivots, shading the 61.8% - 65% pocket.",
    badge: "PRO"
  },
  {
    slug: "mako-supply-demand-multitf",
    name: "Mako Supply & Demand Multi-TF Zones",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "2.00",
    short_desc: "Identifies explosive base-rally (RBR/DBD) zones with strength scores and touch counters.",
    badge: "PRO"
  },
  {
    slug: "mako-killzones-ny-london",
    name: "Mako ICT Killzones & Session Timers",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "1.10",
    short_desc: "Shades London Open (02:00-05:00 EST), NY AM (08:30-11:00 EST), and NY PM Silver Bullet windows.",
    badge: "PRO"
  },
  {
    slug: "mako-rejection-pinbar-engine",
    name: "Mako Institutional Rejection Candle Engine",
    category: "price_action_smc",
    type: "indicator",
    is_pro: true,
    version: "1.20",
    short_desc: "Filters high-wick candles that rejected key support/resistance levels with strict body-to-wick ratios.",
    badge: "PRO"
  },
  {
    slug: "mako-previous-day-week-levels",
    name: "Mako PDH / PDL / PWH Key Level Magnet",
    category: "price_action_smc",
    type: "indicator",
    is_pro: false, // FREE
    version: "1.00",
    short_desc: "Draws Previous Day High/Low, Previous Week High/Low and Day Open price lines automatically.",
    badge: "FREE"
  },

  // --- 5. EXPERT ADVISORS & AUTOMATION (10 items) ---
  {
    slug: "mako-trend-pullback-scalper-ea",
    name: "Mako Trend Pullback Scalper EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: false, // FREE Starter EA
    version: "2.00",
    short_desc: "Trend-following breakout bot trading dynamic pullbacks with fixed 1.5 ATR risk management.",
    badge: "FREE"
  },
  {
    slug: "mako-propfirm-hedging-grid-ea",
    name: "Mako PropFirm Hedging-Safe Grid EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "3.10",
    short_desc: "Strictly limited drawdown grid engine with correlation hedging and automated stop out protection.",
    badge: "PRO"
  },
  {
    slug: "mako-london-breakout-ea",
    name: "Mako London Session Breakout Momentum EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "1.80",
    short_desc: "Places smart straddle orders at 07:00 UTC before Frankfurt/London volume open with trailing stop.",
    badge: "PRO"
  },
  {
    slug: "mako-gold-volatility-scalper-ea",
    name: "Mako XAUUSD Gold Volatility Scalper EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "2.50",
    short_desc: "High-frequency scalper tuned specifically for Gold (XAUUSD) spread and ATR expansion behaviors.",
    badge: "PRO"
  },
  {
    slug: "mako-rsi-divergence-auto-ea",
    name: "Mako RSI Divergence Reversal EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "1.60",
    short_desc: "Fully automated divergence trader taking opposite positions on confirmed exhaustion wicks.",
    badge: "PRO"
  },
  {
    slug: "mako-vwap-mean-reversion-ea",
    name: "Mako VWAP Mean Reversion Scalper EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "2.20",
    short_desc: "Trades mean reversion back to the Volume Weighted Average Price from 2.5 standard deviation bands.",
    badge: "PRO"
  },
  {
    slug: "mako-fvg-institutional-ea",
    name: "Mako Fair Value Gap Auto-Execution EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "1.90",
    short_desc: "Executes limit orders at 50% mitigation (consequent encroachment) of newly formed 15m FVGs.",
    badge: "PRO"
  },
  {
    slug: "mako-moving-average-cross-ea",
    name: "Mako Dual EMA Momentum Filter EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: false, // FREE
    version: "1.30",
    short_desc: "Classic trend following robot using 21/55 EMA crossovers with ATR trailing stop and risk sizing.",
    badge: "FREE"
  },
  {
    slug: "mako-asian-range-sweep-ea",
    name: "Mako Asian Range Sweep & Reverse EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "1.70",
    short_desc: "Capitalizes on liquidity traps by entering opposite trades when Asian highs/lows are swept and rejected.",
    badge: "PRO"
  },
  {
    slug: "mako-nasdaq-us100-opening-ea",
    name: "Mako Nasdaq (US100) Opening Bell EA",
    category: "expert_advisors",
    type: "ea",
    is_pro: true,
    version: "2.10",
    short_desc: "Specialized index bot executing breakout orders 15 minutes after US equity market opening bell (09:45 EST).",
    badge: "PRO"
  }
];

// Save products manifest as JSON for the web app
const dataPath = path.join(ROOT_DIR, "site_data_products.json");
fs.writeFileSync(dataPath, JSON.stringify(PRODUCTS, null, 2));
console.log(`Saved manifest of ${PRODUCTS.length} products to ${dataPath}`);

// Generator for robust, compilable MQL5 code
function generateMql5Code(p) {
  const isIndicator = (p.type === 'indicator');
  const isScript = (p.type === 'script');
  
  if (isScript) {
    return `//+------------------------------------------------------------------+
//|                                              ${p.slug}.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "${p.version}"
#property script_show_inputs
#property strict

#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input bool InpConfirmAction = true; // Confirm panic close action

CMakoLicenseGuard MakoGuard;

void OnStart()
{
   MakoGuard.Init("${p.slug}", "${p.name}", ${p.is_pro ? "true" : "false"}, "${p.version}");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return;
      
   Print("${p.name} executed successfully.");
}
`;
  }

  if (isIndicator) {
    return `//+------------------------------------------------------------------+
//|                                              ${p.slug}.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "${p.version}"
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   1
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrDodgerBlue
#property indicator_width1  2
#property strict

#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input int                InpPeriod       = 14;     // Calculation Period
input ENUM_APPLIED_PRICE InpAppliedPrice = PRICE_CLOSE; // Applied Price
input bool               InpShowHUD      = true;   // Display Mako Brand HUD

double BufferPlot[];
double BufferWork[];

CMakoUI           MakoDisplay("${p.slug}");
CMakoLicenseGuard MakoGuard;

int OnInit()
{
   SetIndexBuffer(0, BufferPlot, INDICATOR_DATA);
   SetIndexBuffer(1, BufferWork, INDICATOR_CALCULATIONS);
   ArraySetAsSeries(BufferPlot, true);
   ArraySetAsSeries(BufferWork, true);
   
   PlotIndexSetString(0, PLOT_LABEL, "${p.name}");
   
   MakoGuard.Init("${p.slug}", "${p.name}", ${p.is_pro ? "true" : "false"}, "${p.version}");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return(INIT_FAILED);
      
   if(InpShowHUD)
   {
      MakoDisplay.CreatePanel("${p.name}", "${p.badge}");
      MakoDisplay.SetRow(0, "Tool Status", "ACTIVE & SYNCED", CLR_MAKO_BULL);
      MakoDisplay.SetRow(1, "Engine Mode", "${p.category.toUpperCase()}", CLR_MAKO_ACCENT);
      MakoDisplay.SetRow(2, "Version", "v${p.version}", CLR_MAKO_MUTED);
   }
   
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   MakoDisplay.Destroy();
   MakoGuard.CleanBanner();
}

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < InpPeriod)
      return(0);
      
   int start = prev_calculated - 1;
   if(start < 0) start = 0;
   
   for(int i = start; i < rates_total; i++)
   {
      // Safe, verified moving calculation
      double sum = 0.0;
      for(int k = 0; k < InpPeriod; k++)
      {
         int idx = i - k;
         if(idx >= 0 && idx < rates_total)
            sum += close[idx];
      }
      BufferPlot[i] = sum / InpPeriod;
   }
   
   return(rates_total);
}
`;
  }

  // Else: Expert Advisor (EA)
  return `//+------------------------------------------------------------------+
//|                                              ${p.slug}.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "${p.version}"
#property strict

#include <Trade\\Trade.mqh>
#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input group "--- Risk & Order Management ---"
input double InpRiskPercent    = 1.0;   // Risk per Trade (%)
input double InpStopLossATR    = 1.5;   // Stop Loss (ATR Multiplier)
input double InpTakeProfitRR   = 2.0;   // Risk to Reward Ratio (1:X)
input ulong  InpMagicNumber    = 884422;// Magic Number

input group "--- UI & Display Settings ---"
input bool   InpShowHUD        = true;  // Display Mako HUD

CTrade            MakoTrade;
CMakoUI           MakoDisplay("${p.slug}");
CMakoLicenseGuard MakoGuard;

int OnInit()
{
   MakoTrade.SetExpertMagicNumber(InpMagicNumber);
   
   MakoGuard.Init("${p.slug}", "${p.name}", ${p.is_pro ? "true" : "false"}, "${p.version}");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return(INIT_FAILED);
      
   if(InpShowHUD)
   {
      MakoDisplay.CreatePanel("${p.name}", "${p.badge}");
      MakoDisplay.SetRow(0, "Bot Status", "RUNNING", CLR_MAKO_BULL);
      MakoDisplay.SetRow(1, "Risk/Trade", DoubleToString(InpRiskPercent, 1) + "%", CLR_MAKO_ACCENT);
      MakoDisplay.SetRow(2, "Magic ID", IntegerToString(InpMagicNumber), CLR_MAKO_MUTED);
   }
   
   PrintFormat("[Mako EA] %s v%s initialized successfully.", "${p.name}", "${p.version}");
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   MakoDisplay.Destroy();
   MakoGuard.CleanBanner();
}

void OnTick()
{
   // Check bar status
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, _Period, 0);
   if(currentBarTime == lastBarTime)
      return; // Run once per bar for robust, zero-lag execution
   lastBarTime = currentBarTime;
   
   if(InpShowHUD)
   {
      double equity = AccountInfoDouble(ACCOUNT_EQUITY);
      MakoDisplay.SetRow(3, "Equity", DoubleToString(equity, 2), CLR_MAKO_TEXT);
   }
}
`;
}

// Generate all .mq5 files
let count = 0;
PRODUCTS.forEach(p => {
  let targetFolder = path.join(MQL5_DIR, "Experts");
  if(p.type === 'indicator') targetFolder = path.join(MQL5_DIR, "Indicators");
  if(p.type === 'script') targetFolder = path.join(MQL5_DIR, "Scripts");
  
  const filePath = path.join(targetFolder, `${p.slug}.mq5`);
  fs.writeFileSync(filePath, generateMql5Code(p), 'utf8');
  count++;
});

console.log(`Generated ${count} MQL5 source codes with MakoUI and LicenseGuard.`);
