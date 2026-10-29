const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT_DIR = 'C:\\Users\\boniv\\.gemini\\antigravity\\scratch\\mako-trading-lab';
const MQL5_DIR = path.join(ROOT_DIR, 'mql5');
const METAEDITOR = 'C:\\Program Files\\MetaTrader 5\\metaeditor64.exe';
const LOG_FILE = path.join(MQL5_DIR, 'batch_recompile.log');

const prods = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'web/src/lib/products.json'), 'utf8'));
console.log('Total catalog tools to recompile:', prods.length);

let success = 0;
let errors = 0;

prods.forEach((p, idx) => {
  let folder = path.join(MQL5_DIR, p.type === 'indicator' ? 'Indicators' : (p.type === 'script' ? 'Scripts' : 'Experts'));
  const mq5File = path.join(folder, p.slug + '.mq5');
  const ex5File = mq5File.replace(/\.mq5$/, '.ex5');
  const webEx5 = path.join(ROOT_DIR, 'web/public/downloads', p.slug + '.ex5');

  if (fs.existsSync(mq5File)) {
    spawnSync(METAEDITOR, ['/compile:' + mq5File, '/log:' + LOG_FILE], { stdio: 'ignore' });
    if (fs.existsSync(ex5File)) {
      success++;
      fs.copyFileSync(ex5File, webEx5);
    } else {
      errors++;
      console.error('Failed:', p.slug);
    }
  }

  if ((idx + 1) % 50 === 0 || idx + 1 === prods.length) {
    console.log('Progress: ' + (idx + 1) + ' / ' + prods.length + ' (Success: ' + success + ', Errors: ' + errors + ')');
  }
});

console.log('--- RECOMPILATION FINISHED ---');
console.log('Total Success: ' + success);
console.log('Total Errors: ' + errors);
