// =====================================================================
//  AI MOTION CUAN — vertical 1080x1920 ad. CORE: shared helpers + render loop.
//  Every frame is a pure function of time t -> window.renderFrame(t).
//  Scenes live in scenes/*.js and register into SCENES_REG / STYLES_REG.
//  Order + durations live in timeline.js.
// =====================================================================
const W = 1080, H = 1920;
const MAIN = document.getElementById('c').getContext('2d');
let ctx = MAIN;
let CUES = [];       // filled by timeline.js (global, absolute times)
const CORAL = '#D97757', YEL = '#FFE600';

// ---------- math helpers
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, k) => a + (b - a) * k;
const P = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: k => 1 - Math.pow(1 - k, 3),
  in: k => k * k * k,
  io: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  back: k => { const c1 = 2.0, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
};
const pop = (t, t0, d = .35) => t < t0 ? 0 : E.back(P(t, t0, t0 + d));
const fi = (t, t0, d = .25) => P(t, t0, t0 + d);
function h(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const h2 = (a, b) => h(a * 57.31 + b * 13.77);
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mk(w, hh) { const c = document.createElement('canvas'); c.width = w; c.height = hh; return c; }
function on(c, fn) { const o = ctx; ctx = c; try { fn(); } finally { ctx = o; } }
const idn = v => Math.floor(v).toLocaleString('id-ID');

// ---------- drawing helpers
const fs = f => `${f}, 'Noto Color Emoji', 'IPAGothic', sans-serif`;  // font stack with emoji + Japanese fallback
function T(s, x, y, o = {}) {
  const { size = 100, font = 'Mont', weight = '', color = '#fff', stroke = null, sw = 0, align = 'center', base = 'middle',
    glow = null, gb = 30, alpha = 1, rot = 0, sc = 1, ls = 0, shadow = null, maxW = 0, grad = null } = o;
  if (sc <= 0.001 || alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); if (rot) ctx.rotate(rot); if (sc !== 1) ctx.scale(sc, sc);
  ctx.font = `${weight} ${size}px ${fs(font)}`; ctx.textAlign = align; ctx.textBaseline = base; ctx.letterSpacing = ls + 'px';
  if (maxW) { const w = ctx.measureText(s).width; if (w > maxW) { const k = maxW / w; ctx.scale(k, k); } }
  ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  if (shadow) {
    ctx.save(); ctx.fillStyle = shadow.c; ctx.strokeStyle = shadow.c;
    if (stroke) { ctx.lineWidth = sw; ctx.strokeText(s, shadow.x, shadow.y); }
    ctx.fillText(s, shadow.x, shadow.y); ctx.restore();
  }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeText(s, 0, 0); }
  let fill = color;
  if (grad) { const g = ctx.createLinearGradient(0, -size * .5, 0, size * .5); grad.forEach((c, i) => g.addColorStop(i / (grad.length - 1), c)); fill = g; }
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = gb; }
  ctx.fillStyle = fill; ctx.fillText(s, 0, 0);
  if (glow) ctx.fillText(s, 0, 0);
  ctx.restore();
}
function TW(s, size, font = 'Mont', weight = '', ls = 0) { ctx.save(); ctx.font = `${weight} ${size}px ${fs(font)}`; ctx.letterSpacing = ls + 'px'; const w = ctx.measureText(s).width; ctx.restore(); return w; }
function rich(segs, x, y, o) {
  const ws = segs.map(s => TW(s[0], o.size, o.font, o.weight, o.ls || 0)); const tot = ws.reduce((a, b) => a + b, 0);
  const sc = o.sc ?? 1; if (sc <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= (o.alpha ?? 1);
  let cx = -tot / 2; segs.forEach((s, i) => { T(s[0], cx, 0, { ...o, color: s[1], align: 'left', sc: 1, alpha: 1 }); cx += ws[i]; });
  ctx.restore();
}
function wrap(s, maxW, size, font, weight) {
  const words = s.split(' '); const lines = []; let cur = '';
  for (const w of words) { const test = cur ? cur + ' ' + w : w; if (TW(test, size, font, weight) > maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
  if (cur) lines.push(cur); return lines;
}
function bgFill(c) { ctx.fillStyle = c; ctx.fillRect(-100, -100, W + 200, H + 200); }
function bgGrad(stops, y0 = 0, y1 = H) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200); }
function radial(x, y, r, c0, c1) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200); }
function rr(x, y, w, hh, r) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, r); }
function rays(cx, cy, n, rot, c) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = c; for (let k = 0; k < n; k++) { const a = k * 2 * Math.PI / n; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 2600, a, a + Math.PI / n); ctx.closePath(); ctx.fill(); } ctx.restore(); }
function chevron(x, y, a, c = '#fff') { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 55, y - 22); ctx.lineTo(x, y + 22); ctx.lineTo(x + 55, y - 22); ctx.stroke(); ctx.restore(); }
function pill(x, y, text, o = {}) {
  const { size = 40, font = 'Mont', weight = 800, bg = '#000', color = '#fff', padX = 34, padY = 18, sc = 1, alpha = 1, rot = 0, stroke = null } = o;
  if (sc <= 0.001) return;
  const w = TW(text, size, font, weight) + padX * 2, hh = size + padY * 2;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.fillStyle = bg; rr(-w / 2, -hh / 2, w, hh, hh / 2); ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 4; ctx.stroke(); }
  T(text, 0, 3, { size, font, weight, color }); ctx.restore();
}
function glitchT(s, x, y, o, amt, t) {
  const f = Math.floor(t * 24);
  const dx = (h(f * 1.3) - .5) * 70 * amt + 6, dy = (h(f * 2.1) - .5) * 24 * amt;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  T(s, x - dx, y - dy, { ...o, color: '#00e5ff', stroke: null, grad: null, alpha: (o.alpha ?? 1) * .85 });
  T(s, x + dx, y + dy, { ...o, color: '#ff0050', stroke: null, grad: null, alpha: (o.alpha ?? 1) * .85 });
  ctx.restore();
  T(s, x, y, o);
  if (amt > .3) for (let i = 0; i < 3; i++) {
    const sz = o.size || 100, by = y - sz * .6 + h(f + i * 7.7) * sz * 1.2, bh = 10 + h(f + i * 3.3) * 34;
    ctx.save(); ctx.beginPath(); ctx.rect(-100, by, W + 200, bh); ctx.clip();
    T(s, x + (h(f + i) - .5) * 160 * amt, y, { ...o, color: '#fff' }); ctx.restore();
  }
}
function check(x, y, r, s) { if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = r * .22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-r * .45, 0); ctx.lineTo(-r * .1, r * .35); ctx.lineTo(r * .5, -r * .35); ctx.stroke(); ctx.restore(); }
function sparkle(x, y, r, c, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = c; ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr_ = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } ctx.closePath(); ctx.fill(); ctx.restore(); }
function camera(cx, cy, z, fn) { ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }

// ---------- precomputed textures
const R = mulberry(1234);
const GRAIN = mk(512, 512); (() => { const g = GRAIN.getContext('2d'); const id = g.createImageData(512, 512); for (let i = 0; i < id.data.length; i += 4) { const v = R() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); })();
const GRAINPAT = MAIN.createPattern(GRAIN, 'repeat');
const VIG = mk(W, H); (() => { const g = VIG.getContext('2d'); const gr = g.createRadialGradient(540, 960, 500, 540, 960, 1250); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); })();
const PAPER = mk(W, H); (() => {
  const g = PAPER.getContext('2d'); g.fillStyle = '#fbf4e2'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2200; i++) { g.strokeStyle = `rgba(120,90,40,${R() * .07})`; g.lineWidth = 1; const x = R() * W, y = R() * H, a = R() * 6.28, l = 6 + R() * 20; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  for (let i = 0; i < 40; i++) { const x = R() * W, y = R() * H, r = 60 + R() * 200; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(200,170,110,0.07)'); gr.addColorStop(1, 'rgba(200,170,110,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
})();
const TOOTH = mk(160, 160); (() => { const g = TOOTH.getContext('2d'); for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(0,0,0,${.3 + R() * .7})`; const s = 1 + R() * 3; g.fillRect(R() * 160, R() * 160, s, s * (0.5 + R())); } })();
const TOOTHPAT = MAIN.createPattern(TOOTH, 'repeat');
const HALF = mk(14, 14); (() => { const g = HALF.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 14, 14); g.fillStyle = '#000'; g.beginPath(); g.arc(7, 7, 3.2, 0, 7); g.fill(); })();
const HALFPAT = MAIN.createPattern(HALF, 'repeat');
const HALFD = mk(10, 10); (() => { const g = HALFD.getContext('2d'); g.fillStyle = '#555'; g.fillRect(0, 0, 10, 10); g.fillStyle = '#111'; g.beginPath(); g.arc(5, 5, 3.4, 0, 7); g.fill(); })();
const HALFDPAT = MAIN.createPattern(HALFD, 'repeat');
const BRICK = mk(W, H); (() => {
  const g = BRICK.getContext('2d'); g.fillStyle = '#2b201d'; g.fillRect(0, 0, W, H);
  const bw = 180, bh = 74;
  for (let row = 0; row * bh < H + bh; row++) for (let col = -1; col * bw < W + bw; col++) {
    const x = col * bw + (row % 2 ? bw / 2 : 0), y = row * bh; const v = R();
    g.fillStyle = `hsl(${8 + R() * 14},${30 + R() * 20}%,${18 + v * 14}%)`; g.fillRect(x + 5, y + 5, bw - 10, bh - 10);
    for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(0,0,0,${R() * .25})`; g.fillRect(x + 5 + R() * (bw - 14), y + 5 + R() * (bh - 14), 3 + R() * 10, 2 + R() * 6); }
  }
  // old faded tags & splats
  const cols = ['#3fa7ff', '#ffd400', '#00e08a', '#ff3d9a', '#ffffff'];
  for (let i = 0; i < 26; i++) { g.fillStyle = cols[i % 5]; g.globalAlpha = .12 + R() * .12; const x = R() * W, y = R() * H, r = 10 + R() * 70; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); for (let k = 0; k < 14; k++) { g.beginPath(); g.arc(x + (R() - .5) * r * 4, y + (R() - .5) * r * 4, R() * 8, 0, 7); g.fill(); } }
  g.globalAlpha = 1;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
})();
const LAYER = mk(W, H).getContext('2d');

// ---------- global camera hits from cues
const HITS = { impact: [14, .1], impact_big: [24, .22], slam: [20, .12], stamp: [12, .06] };
function shake(t) { let s = 0; for (const [ct, ty] of CUES) { const hdef = HITS[ty]; if (hdef && t >= ct && t < ct + .5) s += hdef[0] * Math.exp(-(t - ct) * 11); } return s; }
function flash(t) { let a = 0; for (const [ct, ty] of CUES) { const hdef = HITS[ty]; if (hdef && t >= ct && t < ct + .25) a = Math.max(a, hdef[1] * (1 - (t - ct) / .25)); } return a; }


// ---------- extra premium helpers
E.expo = k => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
E.expoIn = k => k <= 0 ? 0 : Math.pow(2, 10 * k - 10);
E.sine = k => -(Math.cos(Math.PI * k) - 1) / 2;
E.quint = k => 1 - Math.pow(1 - k, 5);
// smooth value noise (deterministic)
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1; }
function noise2(x, y) { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy); const a = h2(i, j), b = h2(i + 1, j), c = h2(i, j + 1), d = h2(i + 1, j + 1); return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1; }
function fbm2(x, y, oct = 4) { let v = 0, a = .5, f = 1; for (let o = 0; o < oct; o++) { v += a * noise2(x * f, y * f); f *= 2; a *= .5; } return v; }
const mixc = (c1, c2, k) => { const p = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; const a = p(c1), b = p(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; };
// Named full-frame offscreen layers (W x H). Use unique names per scene, e.g. layer('ghibli_bg').
const _LAYERS = {};
function layer(name, w = W, hh = H) { if (!_LAYERS[name]) { const c = mk(w, hh); _LAYERS[name] = c.getContext('2d'); } return _LAYERS[name]; }
// Draw fn() into a cleared named layer and return its canvas (does not composite it).
function paint(name, fn, w = W, hh = H) { const l = layer(name, w, hh); l.setTransform(1, 0, 0, 1, 0, 0); l.globalAlpha = 1; l.globalCompositeOperation = 'source-over'; l.filter = 'none'; l.clearRect(0, 0, w, hh); on(l, fn); return l.canvas; }
// Composite a canvas onto ctx with optional blur (depth of field), alpha and blend mode.
function comp(canvas, { blur = 0, alpha = 1, mode = 'source-over', x = 0, y = 0, w = null, hh = null } = {}) { ctx.save(); ctx.globalAlpha *= alpha; ctx.globalCompositeOperation = mode; if (blur > 0) ctx.filter = `blur(${blur}px)`; if (w) ctx.drawImage(canvas, x, y, w, hh); else ctx.drawImage(canvas, x, y); ctx.restore(); }
// Bloom: blur a bright layer and add it on top ('lighter').
function bloom(canvas, px = 30, alpha = .6) { comp(canvas, { blur: px, alpha, mode: 'lighter' }); }
// Soft light leak / glow blob
function glowBlob(x, y, r, color, alpha = 1, mode = 'lighter') { ctx.save(); ctx.globalCompositeOperation = mode; ctx.globalAlpha *= alpha; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
// Letterbox bars for cinematic shots (k: 0..1 amount)
function letterbox(k, size = 170) { if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, size * k); ctx.fillRect(0, H - size * k, W, size * k); ctx.restore(); }
// Small elegant subtitle (cinema style)
function subtitle(s, y = 1640, a = 1, o = {}) { T(s, 540, y, { size: 46, font: 'Playfair', weight: 'italic 700', color: '#fff', shadow: { c: 'rgba(0,0,0,.6)', x: 0, y: 4 }, alpha: a, maxW: 960, ...o }); }

// =====================================================================
// RENDER LOOP (scenes come from timeline.js)
// =====================================================================
window.SCENES_REG = window.SCENES_REG || {};   // name -> { draw(lt, t), cues: [[lt, type, dur?]] }
window.STYLES_REG = window.STYLES_REG || {};   // showcase styles: name -> { label, draw(lt, t), cues }
function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sk = shake(t);
  ctx.save(); ctx.translate((h(t * 91.7) - .5) * sk, (h(t * 37.3 + 5) - .5) * sk);
  for (const s of window.TIMELINE) if (t >= s.start && t < s.start + s.dur) { ctx.save(); window.SCENES_REG[s.name].draw(t - s.start, t); ctx.restore(); break; }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(VIG, 0, 0);
  const f = Math.floor(t * 30); ctx.save(); ctx.globalAlpha = .05; ctx.globalCompositeOperation = 'overlay'; ctx.translate(-h(f) * 512, -h(f + .5) * 512); ctx.fillStyle = GRAINPAT; ctx.fillRect(0, 0, W + 512, H + 512); ctx.restore();
  const fa = flash(t); if (fa > 0) { ctx.fillStyle = `rgba(255,255,255,${fa})`; ctx.fillRect(0, 0, W, H); }
  if (t < .08) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .08})`; ctx.fillRect(0, 0, W, H); }
}
window.renderFrame = render;
window.addEventListener('load', async () => {
  const fams = ['400 40px Anton', '400 40px Bangers', '400 40px Marker', '400 40px Caveat', '400 40px Pixel', '600 40px Mont', '700 40px Mont', '800 40px Mont', '900 40px Mont',
    'italic 400 40px Playfair', '700 40px Playfair', 'italic 700 40px Playfair', '900 40px Playfair', 'italic 900 40px Playfair'];
  await Promise.all(fams.map(f => document.fonts.load(f, 'AaÁ0')));
  await document.fonts.load('40px IPAGothic', 'ドド夕焼け');
  render(0);
  window.READY = true;
  if (!navigator.webdriver) { const t0 = performance.now(); const loop = () => { render(((performance.now() - t0) / 1000) % window.DURATION); requestAnimationFrame(loop); }; loop(); }
});
