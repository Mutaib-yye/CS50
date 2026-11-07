// Renders ad.html frame-by-frame to MP4 (video only) using Playwright + ffmpeg.
//   node render.js                 -> out/video.mp4
//   STILLS=1.5,9,24 node render.js -> out/still_<t>.jpg  (quick previews)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, DUR = 69.5, N = FPS * DUR;
const WORKERS = +(process.env.WORKERS || 4);
const OUT = path.resolve(process.env.OUT || path.join(__dirname, 'out'));
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file://' + path.join(__dirname, 'ad.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await page.goto(URL);
  await page.waitForFunction('window.READY === true', null, { timeout: 60000 });
  return page;
}
const grab = (page, t, q) => page.evaluate(([t, q]) => { window.renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', q).split(',')[1]; }, [t, q]);

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  if (process.env.STILLS) {
    const page = await openPage(browser);
    for (const s of process.env.STILLS.split(',')) fs.writeFileSync(path.join(OUT, `still_${s}.jpg`), Buffer.from(await grab(page, +s, .85), 'base64'));
    await browser.close(); return;
  }
  const per = Math.ceil(N / WORKERS); const t0 = Date.now();
  await Promise.all([...Array(WORKERS)].map(async (_, w) => {
    const a = w * per, b = Math.min(N, a + per);
    const page = await openPage(browser);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), path.join(OUT, `seg${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = a; i < b; i++) {
      const buf = Buffer.from(await grab(page, i / FPS, .94), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((i - a) % 150 === 0) console.log(`worker ${w}: frame ${i - a}/${b - a}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }));
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'list.txt'), [...Array(WORKERS)].map((_, w) => `file 'seg${w}.mp4'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'list.txt'), '-c', 'copy', path.join(OUT, 'video.mp4')]);
  console.log('done', ((Date.now() - t0) / 1000).toFixed(0) + 's');
})();
