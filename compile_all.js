const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const METAEDITOR = "C:\\Program Files\\MetaTrader 5\\metaeditor64.exe";
const MQL5_DIR = "C:\\Users\\boniv\\.gemini\\antigravity\\scratch\\mako-trading-lab\\mql5";
const LOG_FILE = path.join(MQL5_DIR, "compile_run.log");

const categories = ["Experts", "Indicators", "Scripts"];
let totalCompiled = 0;
let errors = 0;

console.log("=== STARTING MAKO COMPILATION SUITE ===");

categories.forEach(cat => {
  const folder = path.join(MQL5_DIR, cat);
  if (!fs.existsSync(folder)) return;
  
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.mq5'));
  console.log(`\nCompiling ${files.length} items in ${cat}...`);
  
  files.forEach(f => {
    const fullMq5 = path.join(folder, f);
    const ex5Path = fullMq5.replace(/\.mq5$/, '.ex5');
    
    const args = [
      `/compile:${fullMq5}`,
      `/log:${LOG_FILE}`
    ];
    
    spawnSync(METAEDITOR, args, { stdio: 'ignore' });
    
    if (fs.existsSync(ex5Path)) {
      totalCompiled++;
      process.stdout.write(` [OK] ${f} -> .ex5\n`);
    } else {
      errors++;
      process.stdout.write(` [ERR] ${f} failed to compile!\n`);
      if (fs.existsSync(LOG_FILE)) {
        console.log(fs.readFileSync(LOG_FILE, 'utf8'));
      }
    }
  });
});

console.log("\n==========================================");
console.log(`Compilation Finished!`);
console.log(`Total .ex5 generated: ${totalCompiled}`);
console.log(`Errors: ${errors}`);
console.log("==========================================");
