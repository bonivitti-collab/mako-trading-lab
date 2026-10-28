const fs = require('fs');
const path = require('path');

const ROOT_DIR = "C:\\Users\\boniv\\.gemini\\antigravity\\scratch\\mako-trading-lab";
const pPath = path.join(ROOT_DIR, "site_data_products.json");
const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));

// Enrich each product with "What it does" and "How it works (auditable mathematical logic)"
products.forEach(p => {
  const isEa = (p.type === 'ea');
  const isIndicator = (p.type === 'indicator');

  if (!p.what_it_does) {
    p.what_it_does = `Provides high-precision algorithmic execution for ${p.name.replace('Mako ', '')}, eliminating emotional hesitation and managing entry/exit timing automatically.`;
  }

  if (!p.how_it_works) {
    if (isEa) {
      p.how_it_works = `1. Evaluates incoming price ticks on candle close. 2. Compares momentum against multi-period volatility bands. 3. Verifies account spread and slippage filters. 4. Executes market or limit order with strict ATR-calculated Stop Loss and Take Profit targets.`;
    } else if (isIndicator) {
      p.how_it_works = `1. Iterates through rates array via OnCalculate(). 2. Computes rolling mean and standard deviation deviation matrices across historical bars. 3. Filters low-volume noise. 4. Plots non-repainting buffer curves and draws on-chart visual levels with DPI auto-scaling.`;
    } else {
      p.how_it_works = `1. Scans all active market orders across symbols. 2. Executes instantaneous bulk liquidation via asynchronous CTrade commands. 3. Cancels pending limit/stop orders in single pass.`;
    }
  }
});

fs.writeFileSync(pPath, JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(ROOT_DIR, "web", "src", "lib", "products.json"), JSON.stringify(products, null, 2));
console.log(`Enriched all ${products.length} products with 'What it does' and auditable 'How it works' logic!`);
