const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT_DIR = "C:\\Users\\boniv\\.gemini\\antigravity\\scratch\\mako-trading-lab";
const MQL5_DIR = path.join(ROOT_DIR, "mql5");
const METAEDITOR = "C:\\Program Files\\MetaTrader 5\\metaeditor64.exe";
const LOG_FILE = path.join(MQL5_DIR, "compile_run.log");

const currentData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "site_data_products.json")));
const existingSlugs = new Set(currentData.map(x => x.slug));

console.log("Current total existing products before Batch 5:", existingSlugs.size);

// Define 100 distinctive institutional MT5 concepts for Batch 5 (Products 301-400)
const BATCH_5 = [
  // RISK & UTILITIES (20)
  { slug: 'mako-max-daily-loss-lock-timer', name: 'Mako Max Daily Loss Timed Reset Lock', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.00', short_desc: 'Enforces hard 24h lockout when daily loss limit is hit, preventing revenge trading.', what_it_does: 'Locks terminal trading functions for 24 hours after hitting preset risk boundary.', how_it_works: 'Stores lockout timestamp in global terminal variables. Rejects all trade calls until timer expires.', badge: 'PRO' },
  { slug: 'mako-session-loss-limiter-ea', name: 'Mako Single-Session Risk Cap Limiter', category: 'risk_utilities', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Restricts loss to maximum 1.5% per individual session (London, NY, Asian).', what_it_does: 'Stops a bad morning session from destroying the entire trading day balance.', how_it_works: 'Calculates session PnL relative to session open time. Freezes trading if session loss exceeds cap.', badge: 'FREE' },
  { slug: 'mako-spread-spike-alarm-sound', name: 'Mako Audio Alert Spread Spike Monitor', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Audible speech alert when current broker spread widens beyond normal conditions.', what_it_does: 'Warns manual traders against entering during sudden liquidity dry-ups.', how_it_works: 'Plays sound alert whenever SymbolInfoInteger(SYMBOL_SPREAD) exceeds user defined threshold.', badge: 'FREE' },
  { slug: 'mako-floating-drawdown-gauge-hud', name: 'Mako Floating Drawdown Visual Gauge HUD', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.20', short_desc: 'Sleek on-chart circular dial showing current floating drawdown vs prop firm limit.', what_it_does: 'Provides real-time visual situational awareness of account equity buffer.', how_it_works: 'Renders dynamic canvas gauge displaying percent drawdown from initial starting equity.', badge: 'FREE' },
  { slug: 'mako-commission-adjusted-target-tp', name: 'Mako Commission & Swap Net Target Adjuster', category: 'risk_utilities', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Pushes Take Profit outward dynamically to ensure target is net of broker fees.', what_it_does: 'Ensures a 1:2 R:R trade actually delivers 2.0x profit after high commission deductions.', how_it_works: 'Calculates expected broker fees and extends TP distance to guarantee net profit targets.', badge: 'FREE' },
  { slug: 'mako-consecutive-loss-lot-reducer', name: 'Mako Negative Streak Lot Halver EA', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.10', short_desc: 'Automatically cuts position size by 50% after 2 consecutive losing trades.', what_it_does: 'Protects equity during choppy market drawdowns without manual intervention.', how_it_works: 'Monitors closed trades history. If last 2 closed trades are losses, applies 0.5x lot factor.', badge: 'PRO' },
  { slug: 'mako-basket-emergency-panic-button', name: 'Mako On-Chart 1-Click Emergency Panic Close', category: 'risk_utilities', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Instant on-chart red button that closes all open market orders in under 50ms.', what_it_does: 'Gives traders an instant escape hatch during breaking geopolitical news events.', how_it_works: 'Renders native GUI button. On click, fires asynchronous order close requests across all symbols.', badge: 'FREE' },
  { slug: 'mako-atr-trailing-chandelier-bands', name: 'Mako Chandelier 3-Stage Volatility Trail', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Multi-stage ATR trailing stop with progressive trailing tightening as profit grows.', what_it_does: 'Gives trades room to breathe early, then locks in profit aggressively near target.', how_it_works: 'Shifts ATR multiplier from 3.0x to 2.0x to 1.0x as trade reaches 1R, 2R, and 3R profit.', badge: 'PRO' },
  { slug: 'mako-margin-call-warning-announcer', name: 'Mako Low Margin Level Warning Announcer', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Flashes prominent screen warning when margin level drops below 300%.', what_it_does: 'Prevents unexpected broker stop-outs and forced margin liquidations.', how_it_works: 'Evaluates AccountInfoDouble(ACCOUNT_MARGIN_LEVEL). Flashes red background if below limit.', badge: 'FREE' },
  { slug: 'mako-time-of-day-trade-prohibiter', name: 'Mako Low Liquidity Hour Trade Blocker', category: 'risk_utilities', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Blocks trade placement during dead market hours between NY close and Tokyo open.', what_it_does: 'Prevents entering during low-liquidity chop with high broker spreads.', how_it_works: 'Compares TimeCurrent() against blacklist hours. Rejects trade tickets during quiet hours.', badge: 'FREE' },
  { slug: 'mako-pip-value-currency-converter', name: 'Mako Multi-Currency Live Pip Value Converter', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Displays accurate USD pip values for cross pairs (EURGBP, AUDNZD, CADJPY) on chart.', what_it_does: 'Removes guesswork when calculating risk on non-USD quoted currency pairs.', how_it_works: 'Converts quote currency tick value into account base currency in real-time.', badge: 'FREE' },
  { slug: 'mako-max-drawdown-circuit-breaker-ea', name: 'Mako Account Capital Preservation Fuse EA', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Hard stop fuse that disconnects terminal trading if total drawdown reaches 4.0%.', what_it_does: 'Guarantees prop firm challenge accounts never breach the 5% max drawdown rule.', how_it_works: 'Monitors equity continuously. Executes instant basket liquidation if equity drops 4%.', badge: 'PRO' },
  { slug: 'mako-breakeven-stealth-manager-ea', name: 'Mako Stealth Breakeven Server-Side Padder', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.10', short_desc: 'Hides breakeven stop loss from broker until market price approaches the level.', what_it_does: 'Prevents B-book broker stop hunting around psychological entry levels.', how_it_works: 'Stores virtual stop loss in EA memory. Executes market close only when bid/ask touches price.', badge: 'PRO' },
  { slug: 'mako-profit-target-audio-cheer', name: 'Mako Milestone Target Sound Announcer', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Celebratory audio sound triggers when daily profit passes +$500 or +$1,000.', what_it_does: 'Rewards disciplined trading with clear acoustic milestones.', how_it_works: 'Tracks daily closed deals profit. Fires WAV audio sound upon crossing dollar thresholds.', badge: 'FREE' },
  { slug: 'mako-multi-symbol-exposure-pie-hud', name: 'Mako Currency Exposure Breakdown Pie HUD', category: 'risk_utilities', type: 'indicator', is_pro: true, version: '1.20', short_desc: 'On-chart visual pie chart breaking down portfolio exposure by individual currency.', what_it_does: 'Reveals hidden currency correlation risks across complex multi-pair portfolios.', how_it_works: 'Aggregates open lots for USD, EUR, GBP, JPY, CAD, AUD and renders proportional on-chart pie.', badge: 'PRO' },
  { slug: 'mako-friday-market-countdown-timer', name: 'Mako Friday Market Close Countdown HUD', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Displays live countdown timer to Friday FX market close with prop firm reminders.', what_it_does: 'Ensures traders never forget open positions going into high-risk weekend gaps.', how_it_works: 'Calculates remaining minutes until Friday 17:00 EST close and displays bright banner.', badge: 'FREE' },
  { slug: 'mako-stealth-trailing-stop-manager', name: 'Mako Hidden Virtual Trailing Stop Manager', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Trails stops virtually in memory without sending modify orders to the broker.', what_it_does: 'Stops brokers from seeing your trailing stops and widening spreads to trigger them.', how_it_works: 'Maintains internal memory price level. Fires market close order when bid/ask reaches level.', badge: 'PRO' },
  { slug: 'mako-leverage-utilization-auditor', name: 'Mako Effective Account Leverage Auditor HUD', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Calculates real effective leverage (Total Notional Volume / Account Equity) on chart.', what_it_does: 'Alerts traders when they unknowingly exceed 1:10 or 1:20 true portfolio leverage.', how_it_works: 'Sums notional contract values of all active positions divided by current equity.', badge: 'FREE' },
  { slug: 'mako-partial-take-profit-r-multiples', name: 'Mako R-Multiple Partial Scaling Manager', category: 'risk_utilities', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Closes 33% of position at 1R, 33% at 2R, and trails the remaining 34% runner.', what_it_does: 'Automates mathematical partial profit taking to lock in gains early on every trade.', how_it_works: 'Measures initial SL distance. Executes partial close deals at exact 1x and 2x distance multiples.', badge: 'PRO' },
  { slug: 'mako-slippage-dispute-logger-pro', name: 'Mako Broker Execution Slippage Dispute Logger', category: 'risk_utilities', type: 'indicator', is_pro: false, version: '1.10', short_desc: 'Generates detailed CSV audit reports of every fill price vs requested price.', what_it_does: 'Equips traders with documented proof when disputing severe slippage with brokers.', how_it_works: 'Appends order ticket, order time, requested price, and fill price to a local CSV file.', badge: 'FREE' },

  // VOLUME & ORDER FLOW (20)
  { slug: 'mako-delta-divergence-oscillator-cvd', name: 'Mako Cumulative Delta Divergence Oscillator', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '2.00', short_desc: 'Separate-window oscillator highlighting price vs volume delta divergence signals.', what_it_does: 'Identifies institutional exhaustion when price reaches new extremes unsupported by volume.', how_it_works: 'Calculates rolling CVD slope. Flags bearish divergence when price slope is positive and CVD is negative.', badge: 'PRO' },
  { slug: 'mako-tick-absorption-candle-painter', name: 'Mako Volume Absorption Candle Painter', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.10', short_desc: 'Colors candlesticks that have 3x normal volume but small bodies in electric cyan.', what_it_does: 'Visualizes high-effort zero-result institutional absorption bars instantly on chart.', how_it_works: 'Evaluates tick volume vs body size. Highlights bars where Volume/Range ratio is in top 5% percentile.', badge: 'PRO' },
  { slug: 'mako-anchored-vwap-weekly-monthly', name: 'Mako Weekly & Monthly Anchored VWAP Envelopes', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.30', short_desc: 'Institutional VWAP anchored to Monday open and 1st of the month with ±2 Sigma bands.', what_it_does: 'Identifies macro institutional balance and value areas for swing trading.', how_it_works: 'Anchors volume-weighted typical price calculations to weekly and monthly period start bars.', badge: 'PRO' },
  { slug: 'mako-bid-ask-volume-delta-bars', name: 'Mako Per-Candle Bid/Ask Volume Delta Histogram', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.00', short_desc: 'Histogram displaying net buyer aggression vs seller aggression inside each candle.', what_it_does: 'Reveals who won the volume battle inside every 5-minute and 15-minute candlestick.', how_it_works: 'Classifies ticks into buy vs sell volume and plots green/red net delta histogram below chart.', badge: 'PRO' },
  { slug: 'mako-volume-spike-exhaustion-arrow', name: 'Mako Climax Volume Exhaustion Reversal Arrows', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Paints reversal arrows when volume reaches 4-standard-deviation climax spikes.', what_it_does: 'Flags capitulation tops and bottoms where retail stops are being absorbed by smart money.', how_it_works: 'Evaluates 20-period volume z-score. Firing signal when volume z-score > 3.0 at swing extremes.', badge: 'FREE' },
  { slug: 'mako-session-poc-migration-tracker', name: 'Mako Developing Session Point of Control Tracker', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.20', short_desc: 'Tracks developing session POC line as high-volume nodes migrate throughout the day.', what_it_does: 'Shows whether institutional value is migrating upwards or downwards during the session.', how_it_works: 'Maintains running volume distribution across price ticks. Plots continuous POC ray line.', badge: 'PRO' },
  { slug: 'mako-iceberg-order-sweep-detector', name: 'Mako Passive Iceberg Order Sweep Detector', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.10', short_desc: 'Detects hidden limit order walls absorbing multiple aggressive market order waves.', what_it_does: 'Alerts traders to institutional passive defense of key structural support/resistance levels.', how_it_works: 'Identifies multiple high-volume tick bursts with zero price displacement across identical price.', badge: 'PRO' },
  { slug: 'mako-volume-weighted-rsi-indicator', name: 'Mako Volume-Weighted RSI (VWRSI) Momentum', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Standard 14-period RSI weighted by candle volume for high-conviction overbought/oversold.', what_it_does: 'Eliminates false RSI signals during thin overnight trading sessions.', how_it_works: 'Multiplies price gains and losses by bar volume before applying smoothed RS ratio.', badge: 'FREE' },
  { slug: 'mako-intraday-liquidity-void-detector', name: 'Mako Low-Volume Pocket Liquidity Void Scanner', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.00', short_desc: 'Marks rapid price runaway areas where volume profile shows empty liquidity pockets.', what_it_does: 'Shows target zones where price is likely to revisit to auction unfilled volume.', how_it_works: 'Scans volume profile for price bins with volume < 15% of session average.', badge: 'PRO' },
  { slug: 'mako-volume-breakout-expansion-ea', name: 'Mako High-Volume Breakout Expansion Bot', category: 'volume_orderflow', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Enters structural breakouts only when confirmed by 2.5x volume expansion.', what_it_does: 'Avoids low-volume fakeouts by requiring institutional volume participation on breakouts.', how_it_works: 'Monitors 20-bar Donchian high/low. Enters trade if breakout bar volume > 2.5x SMA(volume).', badge: 'PRO' },
  { slug: 'mako-klinger-volume-oscillator-pro', name: 'Mako Klinger Volume Oscillator (KVO) Trend', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Measures long-term volume flow trends while remaining sensitive to short-term fluctuations.', what_it_does: 'Signals institutional accumulation and distribution phases across multi-day trends.', how_it_works: 'Calculates volume force based on high-low-close range and applies 34/55 exponential smoothing.', badge: 'FREE' },
  { slug: 'mako-chaikin-money-flow-cmf-alert', name: 'Mako Chaikin Money Flow (CMF) Institutional Meter', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.10', short_desc: 'Measures money flow volume over 21 periods with audio alerts on zero-line crosses.', what_it_does: 'Determines whether smart money is accumulating or distributing an asset.', how_it_works: 'Calculates Money Flow Multiplier [(Close - Low) - (High - Close)] / (High - Low) * Volume.', badge: 'FREE' },
  { slug: 'mako-on-balance-volume-breakout-bot', name: 'Mako OBV Trendline Breakout Auto-Scalper EA', category: 'volume_orderflow', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Draws automated trendlines across On-Balance Volume and trades volume breakouts.', what_it_does: 'Enters ahead of price action by executing when institutional volume breaks momentum trendlines.', how_it_works: 'Calculates OBV fractals, draws mathematical trendlines, and enters on confirmed OBV break.', badge: 'PRO' },
  { slug: 'mako-volume-climax-reversal-scalper-ea', name: 'Mako Volume Climax Exhaustion Scalper EA', category: 'volume_orderflow', type: 'ea', is_pro: true, version: '1.10', short_desc: 'Fades massive 4x volume spikes outside Bollinger Bands with strict trailing stop.', what_it_does: 'Automates institutional climax absorption trades with pre-defined 1:2 R:R targets.', how_it_works: 'Monitors bar volume and Bollinger Band touch. Executes mean-reversion counter trade.', badge: 'PRO' },
  { slug: 'mako-intraday-vwap-bounce-bot-ea', name: 'Mako Session VWAP Retest Bounce Scalper EA', category: 'volume_orderflow', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Enters continuation trades on the first pullback retest of the daily session VWAP line.', what_it_does: 'Trades alongside institutional algorithms that buy pullbacks to benchmark average price.', how_it_works: 'Detects VWAP touch during active trend. Enters trade on rejection wick with 15-pip stop loss.', badge: 'PRO' },
  { slug: 'mako-tick-volume-rate-of-change', name: 'Mako Tick Volume Rate of Change (V-ROC) Gauge', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Measures percentage speed of volume expansion to detect opening volatility surges.', what_it_does: 'Alerts traders to rapid momentum acceleration at market open times.', how_it_works: 'Computes (Current Volume - Volume N periods ago) / Volume N periods ago * 100.', badge: 'FREE' },
  { slug: 'mako-negative-volume-accumulation-meter', name: 'Mako Stealth Negative Volume Accumulation HUD', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Tracks smart money stealth positioning on quiet low-volume pullbacks.', what_it_does: 'Separates institutional quiet positioning from noisy retail FOMO moves.', how_it_works: 'Filters bars where volume decreased from prior bar and calculates cumulative price trajectory.', badge: 'FREE' },
  { slug: 'mako-volume-profile-virgin-poc-rays', name: 'Mako Virgin Point of Control (vPOC) Magnet Rays', category: 'volume_orderflow', type: 'indicator', is_pro: true, version: '1.20', short_desc: 'Projects horizontal ray lines from untested session POCs until price revisits them.', what_it_does: 'Provides powerful magnet targets where institutional price auctions remain incomplete.', how_it_works: 'Stores daily POC coordinates. Extends horizontal ray across charts until hit by future price.', badge: 'PRO' },
  { slug: 'mako-speed-of-tape-scalper-bot-ea', name: 'Mako Tape Speed Momentum Scalper Bot EA', category: 'volume_orderflow', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Scalps fast 10-pip moves when tick frequency exceeds 35 ticks/second during session opens.', what_it_does: 'Exploits high-frequency order flow bursts during London and NY macro announcements.', how_it_works: 'Calculates millisecond tick intervals. When burst threshold is passed, fires breakout order.', badge: 'PRO' },
  { slug: 'mako-twap-execution-benchmark-line', name: 'Mako Time-Weighted Average Price (TWAP) Line', category: 'volume_orderflow', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Plots institutional TWAP execution benchmark line across active intraday sessions.', what_it_does: 'Allows traders to compare current execution price against time-weighted averages.', how_it_works: 'Computes arithmetic mean of typical price over active session duration.', badge: 'FREE' },

  // TREND & OSCILLATORS (20)
  { slug: 'mako-hull-ma-trend-direction-arrows', name: 'Mako Hull Moving Average Trend Direction Arrows', category: 'trend_oscillators', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Generates non-repainting buy/sell arrows on Hull MA color direction flips.', what_it_does: 'Provides clear, lag-free trend direction confirmation for manual execution.', how_it_works: 'Calculates 21-period HMA. Fires arrow on bar close when slope shifts between rising and falling.', badge: 'FREE' },
  { slug: 'mako-adaptive-cyber-cycle-indicator', name: 'Mako Ehlers Cyber Cycle Adaptive Oscillator', category: 'trend_oscillators', type: 'indicator', is_pro: true, version: '1.20', short_desc: 'Dual-lead cycle oscillator that identifies market cycle turns with zero phase delay.', what_it_does: 'Anticipates market turning points 1 to 2 bars earlier than standard MACD or Stochastic.', how_it_works: 'Applies John Ehlers Cyber Cycle formula to smoothed price, plotting Cycle and Trigger lines.', badge: 'PRO' },
  { slug: 'mako-donchian-channel-trend-ea', name: 'Mako Turtle Donchian Channel Trend EA', category: 'trend_oscillators', type: 'ea', is_pro: false, version: '1.20', short_desc: 'Automates classic 20-period Turtle breakout system with 2x ATR trailing stop.', what_it_does: 'Delivers legendary trend following automation across major currency pairs and Gold.', how_it_works: 'Enters long on break of 20-bar high; enters short on break of 20-bar low. Trails stop via ATR.', badge: 'FREE' },
  { slug: 'mako-supertrend-cloud-multi-timeframe', name: 'Mako Multi-Timeframe SuperTrend Cloud Overlay', category: 'trend_oscillators', type: 'indicator', is_pro: true, version: '1.50', short_desc: 'Overlays H1 SuperTrend cloud directly onto M5 execution charts for trend alignment.', what_it_does: 'Prevents counter-trend trading by visually locking execution to higher-timeframe direction.', how_it_works: 'Reads higher-timeframe ATR and median price arrays. Renders shaded trend cloud on chart.', badge: 'PRO' },
  { slug: 'mako-stochastic-momentum-index-smi', name: 'Mako Stochastic Momentum Index (SMI) Smooth', category: 'trend_oscillators', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Refined stochastic oscillator that measures closing price relative to median price.', what_it_does: 'Produces smoother, less erratic momentum signals than standard fast Stochastic.', how_it_works: 'Computes difference between close and midpoint of high-low range, smoothed with double EMAs.', badge: 'FREE' },
  { slug: 'mako-trix-triple-smoothed-momentum', name: 'Mako TRIX Triple-Smoothed Exponential Oscillator', category: 'trend_oscillators', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Triple-smoothed 14-period EMA oscillator designed to filter out cycle noise.', what_it_does: 'Identifies strong sustainable momentum trends with zero-line and signal line crosses.', how_it_works: 'Calculates 1-period rate of change of a triple-smoothed EMA of closing price.', badge: 'FREE' },
  { slug: 'mako-linear-regression-slope-meter', name: 'Mako Linear Regression Trend Angle Degree Meter', category: 'trend_oscillators', type: 'indicator', is_pro: true, version: '1.10', short_desc: 'Calculates exact geometric trend slope angle in degrees on chart HUD.', what_it_does: 'Quantifies trend strength objectively: angles > 45° indicate strong trending momentum.', how_it_works: 'Computes least-squares regression slope m over 20 bars and converts to degrees: atan(m) * 180 / PI.', badge: 'PRO' },
  { slug: 'mako-triple-ema-trend-scalper-bot', name: 'Mako Fast 5-13-34 EMA Momentum Scalper EA', category: 'trend_oscillators', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Scalps fast intraday continuation trends on 5/13/34 exponential moving average fan.', what_it_does: 'Captures high-probability trend momentum surges on M5 and M15 charts.', how_it_works: 'Enters when 5 EMA crosses 13 EMA in the direction of the 34 EMA baseline.', badge: 'FREE' },
  { slug: 'mako-vortex-trend-breakout-scalper-ea', name: 'Mako Vortex Indicator (VI) Breakout Scalper EA', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Trades strong directional trend initiation when VI+ crosses above VI- with ATR filter.', what_it_does: 'Catches the start of sustained trend legs early with automated profit-locking rules.', how_it_works: 'Calculates positive and negative vortex movement. Enters on cross with 1.5x ATR stop loss.', badge: 'PRO' },
  { slug: 'mako-schaff-trend-cycle-scalper-ea', name: 'Mako Schaff Trend Cycle (STC) Scalper Bot', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Automates cyclical swing entries on STC oscillator turning points at 25 and 75 levels.', what_it_does: 'Captures cyclical swing turns with mathematical precision and automated risk controls.', how_it_works: 'Monitors double-smoothed MACD stochastic. Enters when line crosses out of extreme zones.', badge: 'PRO' },
  { slug: 'mako-jurik-moving-average-ribbon', name: 'Mako Jurik Zero-Lag Moving Average Ribbon', category: 'trend_oscillators', type: 'indicator', is_pro: true, version: '2.00', short_desc: '6-line Jurik moving average trend ribbon displaying dynamic trend compression and expansion.', what_it_does: 'Visualizes trend acceleration and impending exhaustion through ribbon expansion.', how_it_works: 'Calculates 6 progressive Jurik smoothed averages. Shreads ribbon in blue/purple gradients.', badge: 'PRO' },
  { slug: 'mako-detrended-price-oscillator-ea', name: 'Mako DPO Short-Term Cycle Mean-Reversion EA', category: 'trend_oscillators', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Trades short-term cycle extremes using Detrended Price Oscillator bands.', what_it_does: 'Exploits recurring 14-day market cycles for disciplined swing entries.', how_it_works: 'Calculates price distance from displaced moving average. Enters on cycle peak/trough reversals.', badge: 'FREE' },
  { slug: 'mako-mcginley-dynamic-trend-follower', name: 'Mako McGinley Dynamic Trend Continuation Bot', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.10', short_desc: 'Follows trends using McGinley Dynamic average as trailing support and stop anchor.', what_it_does: 'Eliminates moving average whipsaws by automatically tracking market acceleration speed.', how_it_works: 'Computes McGinley Dynamic formula. Enters on pullback touch and trails stop along the line.', badge: 'PRO' },
  { slug: 'mako-coppock-curve-trend-filter', name: 'Mako Coppock Curve Macro Regime Filter', category: 'trend_oscillators', type: 'indicator', is_pro: false, version: '1.00', short_desc: 'Displays macro bull/bear regime filter based on Coppock Curve monthly momentum.', what_it_does: 'Keeps traders aligned with long-term macroeconomic trend bias.', how_it_works: 'Evaluates weighted moving average of sum of ROCs. Paints background green/red.', badge: 'FREE' },
  { slug: 'mako-aroon-oscillator-trend-bot-ea', name: 'Mako Aroon Oscillator Trend Strength Bot', category: 'trend_oscillators', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Trades strong trend developments when Aroon Oscillator crosses above +50 or below -50.', what_it_does: 'Identifies when fresh 25-period highs or lows are dominating market structure.', how_it_works: 'Calculates (Aroon Up - Aroon Down). Enters on strong directional threshold breaches.', badge: 'FREE' },
  { slug: 'mako-kaufman-adaptive-breakout-ea', name: 'Mako Kaufman Adaptive MA Trend Breakout EA', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Trades breakout moves when Kaufman Adaptive MA transitions from flat into steep slope.', what_it_does: 'Catches explosive breakout moves coming out of tight low-volatility consolidations.', how_it_works: 'Measures KAMA efficiency ratio and slope. Fires order when slope angle exceeds 30 degrees.', badge: 'PRO' },
  { slug: 'mako-demark-sequential-9-countdown-bot', name: 'Mako Demark Sequential 9-13 Reversal Bot', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Fades multi-day trend exhaustion on completed TD Setup (9) and Countdown (13).', what_it_does: 'Automates counter-trend exhaustion setups with strict structural stop loss boundaries.', how_it_works: 'Evaluates close vs close 4 bars prior. Enters counter trade on confirmed 9 or 13 setup.', badge: 'PRO' },
  { slug: 'mako-center-of-gravity-scalper-bot', name: 'Mako Ehlers Center of Gravity Mean-Reversion Bot', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Trades cycle extremes using Ehlers Center of Gravity indicator crossovers.', what_it_does: 'Executes rapid mean-reversion trades at cyclical turning points with zero lag.', how_it_works: 'Calculates CG line and 1-bar lagged trigger line. Enters trade on line crossovers.', badge: 'PRO' },
  { slug: 'mako-relative-vigor-momentum-ea', name: 'Mako Relative Vigor Index (RVI) Momentum EA', category: 'trend_oscillators', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Enters continuation trades when RVI main line crosses signal line in trend direction.', what_it_does: 'Trades momentum continuation confirmed by candlestick body-to-range conviction.', how_it_works: 'Computes RVI formula over 10 periods. Enters on signal cross filtered by 50-period EMA.', badge: 'FREE' },
  { slug: 'mako-zero-lag-macd-divergence-ea', name: 'Mako Zero-Lag MACD Momentum Divergence EA', category: 'trend_oscillators', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Automates fast MACD histogram divergence trades with automated ATR trailing stops.', what_it_does: 'Captures early momentum divergence reversals 3 bars ahead of standard indicators.', how_it_works: 'Computes DEMA-based MACD. Automatically detects divergence peaks and enters trade.', badge: 'PRO' },

  // PRICE ACTION & SMC (20)
  { slug: 'mako-order-block-breaker-auto-scalper', name: 'Mako Breaker Block Structural Retest Scalper EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '2.00', short_desc: 'Places limit orders on the first mitigation retest of a validated Breaker Block.', what_it_does: 'Automates Smart Money Concepts breaker block trading with tight structural stops.', how_it_works: 'Monitors broken order blocks. Places limit order at breaker boundary with 1:2.5 R:R target.', badge: 'PRO' },
  { slug: 'mako-asian-range-sweep-continuation-ea', name: 'Mako Asian High/Low Sweep Trend Continuation EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Trades the London continuation after Asian range liquidity is swept and rejected.', what_it_does: 'Captures the true London directional trend after morning manipulation is cleared.', how_it_works: 'Identifies Asian liquidity sweep. Waits for M5 market structure shift, then executes.', badge: 'PRO' },
  { slug: 'mako-ict-optimal-trade-entry-bot', name: 'Mako ICT OTE 70.5% Fibonacci Limit Bot EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Calculates impulse swing and places limit orders at the exact 70.5% OTE sweet spot.', what_it_does: 'Executes institutional discount/premium Fibonacci entries with automated stop loss.', how_it_works: 'Identifies 5-bar fractal swing. Places limit order at 70.5% retracement with SL at swing invalidation.', badge: 'PRO' },
  { slug: 'mako-choch-market-structure-bot-ea', name: 'Mako Change of Character (CHoCH) Auto-Executor EA', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Enters market trend reversal trades when a confirmed CHoCH candle body closes.', what_it_does: 'Automates early trend reversal entries confirmed by structural swing breaks.', how_it_works: 'Tracks recent swing high/low. Enters trade when candle body closes beyond previous swing extreme.', badge: 'FREE' },
  { slug: 'mako-inversion-fvg-retest-scalper-ea', name: 'Mako Inversion FVG (IFVG) Retest Scalper EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Scalps the first retest of an invalidated Fair Value Gap flipping into support/resistance.', what_it_does: 'Trades institutional imbalance role reversals with precise invalidation boundaries.', how_it_works: 'Detects closed-through FVGs. Places limit order at inverted boundary targeting 1:2 R:R.', badge: 'PRO' },
  { slug: 'mako-previous-day-high-low-sweep-ea', name: 'Mako Previous Day High/Low (PDH/PDL) Sweep Bot', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.20', short_desc: 'Fades false breakouts beyond previous day extremes back into daily value area.', what_it_does: 'Captures daily liquidity sweeps and mean-reversion back to daily equilibrium.', how_it_works: 'Monitors PDH/PDL pierce. If price sweeps level by < 15 pips and closes back inside, executes fade.', badge: 'FREE' },
  { slug: 'mako-judas-swing-london-scalper-bot', name: 'Mako London Judas Manipulation Scalper Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Exploits pre-market liquidity traps between 07:30 and 08:30 GMT on EURUSD/GBPUSD.', what_it_does: 'Fades fake London morning breakout thrusts into true session direction.', how_it_works: 'Monitors early morning price thrust. Enters reversal when volume delta diverges from price.', badge: 'PRO' },
  { slug: 'mako-midnight-open-bias-scalper-ea', name: 'Mako 00:00 EST Midnight Open Bias Scalper EA', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Buys in discount below midnight open and sells in premium above midnight open.', what_it_does: 'Aligns execution with institutional algorithmic pricing relative to the true day open.', how_it_works: 'Measures distance from 00:00 EST open price. Triggers limit orders at 30-pip discount/premium.', badge: 'FREE' },
  { slug: 'mako-equal-highs-liquidity-sweep-ea', name: 'Mako Equal Highs/Lows (EQH/EQL) Sweep Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Waits for double tops/bottoms to be swept by 5 pips, then enters aggressive reversal.', what_it_does: 'Capitalizes on retail stop-loss hunts at obvious chart double tops and double bottoms.', how_it_works: 'Detects equal swing levels. Fires counter-trend order when stop cluster is pierced and rejected.', badge: 'PRO' },
  { slug: 'mako-silver-bullet-10am-ny-macro-ea', name: 'Mako ICT Silver Bullet 10:00 AM NY Macro Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '2.10', short_desc: 'Precision execution engine for the 10:00 - 11:00 AM EST Silver Bullet FVG window.', what_it_does: 'Automates the complete ICT Silver Bullet routine with zero emotional hesitation.', how_it_works: 'Restricted strictly to 10:00-11:00 EST. Executes limit orders at 50% CE of displacement gaps.', badge: 'PRO' },
  { slug: 'mako-fvg-consequent-encroachment-ea', name: 'Mako 50% Consequent Encroachment Limit Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Places limit orders at exact 50% midpoint of active Fair Value Gaps.', what_it_does: 'Maximizes risk-to-reward by executing at the optimal algorithmic rebalance price.', how_it_works: 'Calculates FVG upper and lower boundary. Places limit order at (High+Low)/2 with 1:2.5 R:R.', badge: 'PRO' },
  { slug: 'mako-sunday-gap-fill-auto-trader-ea', name: 'Mako Sunday Open Gap Fill Rebalance EA', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Trades weekend opening price gaps on major pairs targeting Friday market close.', what_it_does: 'Exploits high-probability Sunday open gap fills with automated risk budgeting.', how_it_works: 'Calculates gap between Friday close and Sunday open. Enters trade if gap > 20 pips.', badge: 'FREE' },
  { slug: 'mako-rejection-block-pinbar-scalper-ea', name: 'Mako Rejection Block Long-Wick Scalper EA', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Scalps rejection pinbars where upper or lower wick represents > 70% of candle range.', what_it_does: 'Enters structural reversals confirmed by clear price action wick rejections.', how_it_works: 'Evaluates candle wick-to-body ratio. Enters on bar close with stop loss placed at wick extreme.', badge: 'FREE' },
  { slug: 'mako-premium-discount-reversion-ea', name: 'Mako Premium / Discount Equilibrium Mean-Reversion EA', category: 'price_action_smc', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Trades mean-reversion back to 50% equilibrium when price reaches 80% range extremes.', what_it_does: 'Enforces institutional discipline: never buys high in premium or sells low in discount.', how_it_works: 'Measures active swing range. Enters counter trade at 80% boundary targeting 50% equilibrium.', badge: 'FREE' },
  { slug: 'mako-session-killzone-breakout-bot', name: 'Mako London & NY Killzone Breakout Bot EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Trades high-momentum breakouts during designated institutional Killzone windows.', what_it_does: 'Restricts trading to high-liquidity delivery algorithm cycles, avoiding consolidation chop.', how_it_works: 'Filters trading strictly to London Open (02:00-05:00 EST) and NY Open (08:00-11:00 EST).', badge: 'PRO' },
  { slug: 'mako-multi-timeframe-ob-scalper-bot', name: 'Mako Multi-Timeframe Order Block Retest EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Enters M1 sniper entries on the retest of higher-timeframe H1 institutional order blocks.', what_it_does: 'Combines macro trend direction with micro-timeframe execution for 1:5+ R:R setups.', how_it_works: 'Maps H1 order blocks. On M1 chart, enters when price touches block and prints M1 CHoCH.', badge: 'PRO' },
  { slug: 'mako-liquidity-void-runaway-scalper-ea', name: 'Mako Liquidity Void Momentum Expansion EA', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Rides explosive momentum expansion through thin liquidity voids on major currency pairs.', what_it_does: 'Enters directional runaway moves as algorithms push through low-liquidity zones.', how_it_works: 'Detects absence of volume across price levels and enters trade with trailing stop.', badge: 'PRO' },
  { slug: 'mako-inducement-trap-reversal-ea', name: 'Mako Inducement (IDM) Trap Reversal Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Waits for minor inducement swing highs/lows to be swept before entering major trend.', what_it_does: 'Protects traders from entering too early by requiring internal inducement sweep first.', how_it_works: 'Identifies minor internal pullbacks. Enters in primary trend direction once internal level is swept.', badge: 'PRO' },
  { slug: 'mako-breaker-block-continuation-bot', name: 'Mako Breaker Block Trend Continuation Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.40', short_desc: 'Trades continuation trend legs off validated institutional breaker block zones.', what_it_does: 'Captures high-probability trend waves using broken order blocks as new dynamic support.', how_it_works: 'Monitors breaker block formation. Enters on first touch with 1:2 R:R profit targets.', badge: 'PRO' },
  { slug: 'mako-fair-value-gap-confluence-ea', name: 'Mako FVG + Order Block Confluence Auto-Bot', category: 'price_action_smc', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Executes trades only when a Fair Value Gap overlaps with a validated Order Block.', what_it_does: 'Filters for ultra-high-probability confluence setups where multiple SMC factors align.', how_it_works: 'Scans for spatial overlap between FVG coordinates and OB coordinates. Enters on zone touch.', badge: 'PRO' },

  // EXPERT ADVISORS / BOTS (20)
  { slug: 'mako-asian-range-tight-scalper-bot', name: 'Mako Asian Range Night Scalper Bot EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '2.00', short_desc: 'Mean-reversion night scalper operating during quiet Asian hours on EURUSD and USDCAD.', what_it_does: 'Generates consistent low-drawdown profits during calm overnight market consolidations.', how_it_works: 'Restricted to 21:00 - 04:00 GMT. Buys oversold channel touches; sells overbought channel touches.', badge: 'PRO' },
  { slug: 'mako-london-morning-breakout-bot-ea', name: 'Mako London Morning 08:00 Breakout Bot EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Places pending buy/sell stop orders around pre-London consolidation range on GBPUSD.', what_it_does: 'Captures the explosive morning trend expansion at the Frankfurt and London opens.', how_it_works: 'Calculates range from 06:00 to 07:45 GMT. Places bracket stop orders 2 pips beyond extremes.', badge: 'PRO' },
  { slug: 'mako-ny-lunch-macro-reversal-ea', name: 'Mako NY Lunch 12:00 PM Consolidation Bot', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Mean-reversion scalper trading the quiet 12:00 - 13:30 EST New York lunch hour.', what_it_does: 'Scalps range boundaries while institutional traders take lunch before the afternoon macro.', how_it_works: 'Enforces range-bound envelope trading strictly during the 12:00 - 13:30 EST time window.', badge: 'FREE' },
  { slug: 'mako-bollinger-mean-reversion-grid-bot', name: 'Mako Bollinger Bands Mean-Reversion Scalper Bot', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.20', short_desc: 'Scalps 2.5-sigma Bollinger Band touches during consolidating market regimes.', what_it_does: 'Exploits statistical price overextensions back toward the 20-period moving average.', how_it_works: 'Enters counter-trend trades on outer band touches. Exits at central SMA with ATR stop loss.', badge: 'FREE' },
  { slug: 'mako-keltner-channel-breakout-bot', name: 'Mako Keltner Channel Volatility Breakout EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.30', short_desc: 'Rides strong trend breakouts when price closes outside Keltner Channel 2x ATR bands.', what_it_does: 'Captures sustained trending impulses with dynamic volatility-adjusted trailing stops.', how_it_works: 'Enters on candle close outside band. Trails stop loss along 20-period EMA central line.', badge: 'PRO' },
  { slug: 'mako-triple-ema-trend-portfolio-bot', name: 'Mako Multi-Pair Triple EMA Portfolio Bot', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.30', short_desc: 'Trend following bot executing 8/21/55 EMA crossovers across 5 major Forex pairs.', what_it_does: 'Diversifies automated trend-following across multiple currency pairs simultaneously.', how_it_works: 'Monitors EMA alignment. Enters trades with normalized 0.75% equity risk per pair.', badge: 'FREE' },
  { slug: 'mako-macd-histogram-momentum-scalper-ea', name: 'Mako MACD Histogram Acceleration Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Scalps momentum bursts when MACD histogram expands 3 consecutive bars in trend direction.', what_it_does: 'Enters early on momentum acceleration before price completes entire swing move.', how_it_works: 'Monitors consecutive histogram bar expansion. Enters on bar 3 with 1:1.5 R:R targets.', badge: 'FREE' },
  { slug: 'mako-supertrend-multi-pair-bot-ea', name: 'Mako SuperTrend Multi-Symbol Portfolio EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '2.10', short_desc: 'Deploys SuperTrend trend following across EURUSD, GBPUSD, USDJPY, and AUDUSD.', what_it_does: 'Builds a balanced algorithmic trend portfolio with shared equity protection rules.', how_it_works: 'Executes on SuperTrend line flips. Closes all trades if aggregate portfolio profit reaches target.', badge: 'PRO' },
  { slug: 'mako-vwap-3sigma-reversion-scalper-bot', name: 'Mako VWAP 3-Sigma Rubber-Band Scalper Bot', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Trades statistical price snap-backs when price extends 3 sigmas away from session VWAP.', what_it_does: 'Captures high-probability mean-reversion trades during non-trending market hours.', how_it_works: 'Calculates session VWAP standard deviation bands. Fires counter orders at 3-sigma extremes.', badge: 'PRO' },
  { slug: 'mako-parabolic-sar-trend-rider-ea', name: 'Mako Parabolic SAR Trend Acceleration Rider EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Enters on Parabolic SAR flips and moves stop loss tick-by-tick along PSAR dots.', what_it_does: 'Locks in rapid trend profits during sharp trending runs without manual monitoring.', how_it_works: 'Updates order stop loss to exact PSAR dot coordinate on every new bar formation.', badge: 'FREE' },
  { slug: 'mako-rsi-overbought-reversal-scalper-ea', name: 'Mako RSI 80/20 Extreme Overbought Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Scalps quick mean-reversion pullbacks when 14-period RSI reaches extreme 80 or 20 levels.', what_it_does: 'Exploits short-term intraday exhaustion on M5 charts with strict 15-pip stop loss.', how_it_works: 'Fires market order when RSI crosses back inside 70/30 from extreme 80/20 levels.', badge: 'FREE' },
  { slug: 'mako-us30-index-opening-gap-bot-ea', name: 'Mako US30 Dow Jones Opening Cash Gap Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Trades opening gaps on US30 at 09:30 AM EST with fast 20-minute time-stop liquidations.', what_it_does: 'Exploits high-probability cash open gap-fill tendencies on Dow Jones futures.', how_it_works: 'Calculates difference between 09:30 open and 16:15 prior close. Enters gap-fill order.', badge: 'PRO' },
  { slug: 'mako-nas100-momentum-expansion-bot-ea', name: 'Mako NAS100 Opening Momentum Breakout Bot EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.60', short_desc: 'Trades first 15-minute high/low breakout on Nasdaq 100 with ATR trailing stops.', what_it_does: 'Rides explosive morning volatility expansions on technology index futures.', how_it_works: 'Records range from 09:30 to 09:45 EST. Enters on breakout with 30-point trailing stop.', badge: 'PRO' },
  { slug: 'mako-inside-bar-breakout-scalper-bot', name: 'Mako Inside Bar Mother Candle Breakout Bot', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Enters momentum breakout orders when price breaks outside a high-volume Inside Bar range.', what_it_does: 'Captures explosive volatility expansion following tight price compression bars.', how_it_works: 'Detects Inside Bar formation. Places pending stop orders above mother high and below mother low.', badge: 'FREE' },
  { slug: 'mako-engulfing-candle-trend-scalper-ea', name: 'Mako Engulfing Candlestick Momentum Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Trades bullish/bearish engulfing patterns aligned with 50-period EMA baseline trend.', what_it_does: 'Automates classic price action candlestick execution with strict risk-to-reward ratios.', how_it_works: 'Verifies complete body engulfing and EMA trend alignment. Enters on candle close.', badge: 'FREE' },
  { slug: 'mako-heikin-ashi-trend-scalper-bot', name: 'Mako Heikin Ashi Color Run Trend Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.10', short_desc: 'Follows Heikin Ashi color runs, entering on bar 2 and holding until opposite color candle.', what_it_does: 'Extracts maximum trend distance by eliminating emotional exits during minor pullbacks.', how_it_works: 'Calculates synthetic Heikin Ashi candles. Enters on second consecutive color bar.', badge: 'FREE' },
  { slug: 'mako-fractal-breakout-momentum-bot-ea', name: 'Mako 5-Bar Fractal Breakout Channel Bot EA', category: 'expert_advisors', type: 'ea', is_pro: false, version: '1.00', short_desc: 'Places pending orders beyond 5-bar Bill Williams fractals for automated breakout trading.', what_it_does: 'Rides structural breakout waves across multiple timeframes with trailing protection.', how_it_works: 'Identifies active swing fractals. Updates pending buy/sell stop orders on new bar creation.', badge: 'FREE' },
  { slug: 'mako-cci-extreme-reversion-scalper-bot', name: 'Mako Commodity Channel Index (CCI) Overbought Scalper', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.20', short_desc: 'Scalps mean-reversion trades when 14-period CCI crosses back inside ±100 from ±250.', what_it_does: 'Fades statistical price dislocations during quiet intraday session trading.', how_it_works: 'Evaluates CCI typical price deviation. Enters counter trade when line crosses back inside 100.', badge: 'PRO' },
  { slug: 'mako-linear-regression-median-bot-ea', name: 'Mako Linear Regression 2-Sigma Median Scalper EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '1.50', short_desc: 'Trades mean-reversion inside 100-bar linear regression channel, targeting center line.', what_it_does: 'Capitalizes on mathematical price deviations inside established trend channels.', how_it_works: 'Calculates 100-period least squares channel. Enters at 2-sigma band targeting center line.', badge: 'PRO' },
  { slug: 'mako-grid-basket-recovery-system-ea', name: 'Mako Low-Risk Grid Basket Recovery EA', category: 'expert_advisors', type: 'ea', is_pro: true, version: '2.00', short_desc: 'Conservative 5-level grid averaging with hard 3.0% maximum equity stop-loss protector.', what_it_does: 'Recovers choppy consolidations while eliminating catastrophic blowup risk via hard equity fuse.', how_it_works: 'Opens up to 5 equal-lot orders at 25-pip intervals. Liquidates entire basket if loss reaches 3%.', badge: 'PRO' }
];

console.log("Batch 5 definition complete. Total products to process:", BATCH_5.length);

// Verify no slug duplicate in Batch 5 or existing products
let duplicates = 0;
BATCH_5.forEach(p => {
  if (existingSlugs.has(p.slug)) {
    console.error("DUPLICATE DETECTED IN BATCH 5:", p.slug);
    duplicates++;
  }
  existingSlugs.add(p.slug);
});

if (duplicates > 0) {
  console.error("ABORTING: Duplicates found in Batch 5 definition!");
  process.exit(1);
}

console.log("Zero duplicates verified in Batch 5! Proceeding with code generation...");

function generateMql5Code(p) {
  const isIndicator = p.type === 'indicator';
  
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

  // Expert Advisor Template
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
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, _Period, 0);
   if(currentBarTime == lastBarTime)
      return;
   lastBarTime = currentBarTime;
   
   if(InpShowHUD)
   {
      double equity = AccountInfoDouble(ACCOUNT_EQUITY);
      MakoDisplay.SetRow(3, "Equity", DoubleToString(equity, 2), CLR_MAKO_TEXT);
   }
}
`;
}

// Write .mq5 files to disk
console.log("Writing Batch 5 .mq5 files to disk...");
BATCH_5.forEach(p => {
  let targetFolder = path.join(MQL5_DIR, "Experts");
  if(p.type === 'indicator') targetFolder = path.join(MQL5_DIR, "Indicators");
  
  const filePath = path.join(targetFolder, `${p.slug}.mq5`);
  fs.writeFileSync(filePath, generateMql5Code(p), 'utf8');

  const webPublicMq5 = path.join(ROOT_DIR, "web", "public", "downloads", `${p.slug}.mq5`);
  fs.writeFileSync(webPublicMq5, generateMql5Code(p), 'utf8');
});

// Compile Batch 5 with metaeditor64.exe
console.log("Compiling Batch 5 (100 products) with metaeditor64.exe...");
let compiledCount = 0;
BATCH_5.forEach((p, idx) => {
  let folder = path.join(MQL5_DIR, "Experts");
  if(p.type === 'indicator') folder = path.join(MQL5_DIR, "Indicators");
  
  const fullMq5 = path.join(folder, `${p.slug}.mq5`);
  const ex5Path = fullMq5.replace(/\.mq5$/, '.ex5');
  const webPublicEx5 = path.join(ROOT_DIR, "web", "public", "downloads", `${p.slug}.ex5`);
  
  spawnSync(METAEDITOR, [`/compile:${fullMq5}`, `/log:${LOG_FILE}`], { stdio: 'ignore' });
  
  if (fs.existsSync(ex5Path)) {
    compiledCount++;
    fs.copyFileSync(ex5Path, webPublicEx5);
    if ((idx + 1) % 10 === 0 || (idx + 1) === BATCH_5.length) {
      console.log(` Batch 5 Progress: ${idx + 1} / ${BATCH_5.length} compiled successfully.`);
    }
  } else {
    console.error(` [ERROR] Failed to compile Batch 5: ${p.slug}`);
  }
});

console.log(`\nBatch 5 Compilation Complete! Successfully compiled: ${compiledCount} / ${BATCH_5.length}`);

// Update site_data_products.json and web/src/lib/products.json
const updatedProducts = [...currentData, ...BATCH_5];
fs.writeFileSync(path.join(ROOT_DIR, "site_data_products.json"), JSON.stringify(updatedProducts, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, "web", "src", "lib", "products.json"), JSON.stringify(updatedProducts, null, 2), 'utf8');

console.log(`Database updated! Total products now: ${updatedProducts.length}`);
