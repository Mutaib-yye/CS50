// Screenshot the character test sheet.
// Usage: node test/shot.js <outDir> [charsSrc] [t0]
//   charsSrc defaults to ../src/characters.js (relative to test/chars.html)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const out = path.resolve(process.argv[2] || path.join(__dirname, 'out'));
  const chars = process.argv[3] || '../src/characters.js';
  const t0 = process.argv[4] || '1.3';
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  const base = 'file://' + path.resolve(__dirname, 'chars.html');
  const shots = [
    ['sheet', `mode=sheet&t0=${t0}`],
    ['faces', `mode=faces&t0=${t0}`],
    ['hands', `mode=hands&t0=${t0}`],
    ['zoom_L', `mode=zoom&who=L&t0=${t0}`],
    ['zoom_R', `mode=zoom&who=R&t0=${t0}`],
    ['zoom_T', `mode=zoom&who=T&t0=${t0}`],
    ['zoom_P', `mode=zoom&who=P&t0=${t0}`],
    ['zoom_H', `mode=zoom&who=H&t0=${t0}`],
    ['motion_R', `mode=motion&who=R&t0=0&dt=0.1`],
    ['motion_P', `mode=motion&who=P&t0=0&dt=0.1`],
    ['motion_L_slow', `mode=motion&who=L&t0=0&dt=0.5`],
  ];
  for (const [name, qs] of shots) {
    await page.goto(`${base}?${qs}&chars=${encodeURIComponent(chars)}`);
    await page.evaluate(() => window.ready);
    const el = await page.$('#cv');
    await el.screenshot({ path: path.join(out, name + '.png') });
    console.log('wrote', path.join(out, name + '.png'));
  }
  await browser.close();
})();
