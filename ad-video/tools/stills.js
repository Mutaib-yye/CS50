// Preview tool: render stills of one scene (or one showcase style) at LOCAL times, plus a contact sheet.
//   node tools/stills.js --scene hook --times 0.2,1,2,3.5 --out /some/dir
//   node tools/stills.js --style ghibli --times 0.3,1.5,3 --out /some/dir
//   node tools/stills.js --global 12.5,30 --out /some/dir
// Prints per-frame render time (budget: keep typical frames under ~150 ms).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : null; };
const OUT = path.resolve(arg('out') || path.join(__dirname, '..', 'out', 'stills'));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'ad.html'));
  await page.waitForFunction('window.READY === true', null, { timeout: 60000 }).catch(() => {});
  if (errs.length) { console.error('PAGE ERRORS:\n' + errs.join('\n')); }
  const info = await page.evaluate(() => ({ tl: window.TIMELINE, seq: window.SHOWCASE_SEQ }));
  let base = 0, label = 'global';
  if (arg('scene')) { const s = info.tl.find(s => s.name === arg('scene')); if (!s) throw new Error('no scene ' + arg('scene')); base = s.start; label = s.name; }
  if (arg('style')) { const sc = info.tl.find(s => s.name === 'showcase'); const st = info.seq.find(s => s.name === arg('style')); if (!st) throw new Error('no style ' + arg('style')); base = sc.start + st.start; label = st.name; }
  const times = (arg('times') || arg('global') || '0').split(',').map(Number);
  const files = [];
  for (const lt of times) {
    const r = await page.evaluate(([t]) => { const a = performance.now(); window.renderFrame(t); window.renderFrame(t); const ms = (performance.now() - a) / 2; return { ms, d: document.getElementById('c').toDataURL('image/jpeg', .85).split(',')[1] }; }, [base + lt]);
    const f = path.join(OUT, `${label}_${lt.toFixed(2)}.jpg`); fs.writeFileSync(f, Buffer.from(r.d, 'base64')); files.push(f);
    console.log(`${label} t=${lt.toFixed(2)}  ${r.ms.toFixed(0)} ms  -> ${f}`);
  }
  if (errs.length) console.error('PAGE ERRORS:\n' + errs.join('\n'));
  await browser.close();
  const cols = Math.min(files.length, 4), n = files.length, tw = 405, th = 720;
  const layout = files.map((_, i) => `${(i % cols) * tw}_${Math.floor(i / cols) * th}`).join('|');
  const sheet = path.join(OUT, `${label}_sheet.jpg`);
  const inputs = files.flatMap(f => ['-i', f]);
  const filt = files.map((_, i) => `[${i}:v]scale=${tw}:${th}[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + (n > 1 ? `xstack=inputs=${n}:layout=${layout}:fill=black` : 'null');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filt, sheet]);
  console.log('sheet -> ' + sheet);
})();
