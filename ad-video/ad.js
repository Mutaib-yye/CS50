// =====================================================================
//  AI MOTION CUAN — 68s vertical (1080x1920) motion-graphic ad
//  Every frame is a pure function of time t → window.renderFrame(t)
// =====================================================================
const W = 1080, H = 1920, DUR = 68;
const MAIN = document.getElementById('c').getContext('2d');
let ctx = MAIN;
const CUES = window.CUES || [];
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
const fs = f => `${f}, 'Noto Color Emoji', 'IPAGothic', sans-serif`;
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
const PIX = mk(216, 384).getContext('2d');

// ---------- global camera hits from cues
const HITS = { impact: [16, .22], impact_big: [30, .45], slam: [22, .18], stamp: [14, .1] };
function shake(t) { let s = 0; for (const [ct, ty] of CUES) { const hdef = HITS[ty]; if (hdef && t >= ct && t < ct + .5) s += hdef[0] * Math.exp(-(t - ct) * 11); } return s; }
function flash(t) { let a = 0; for (const [ct, ty] of CUES) { const hdef = HITS[ty]; if (hdef && t >= ct && t < ct + .25) a = Math.max(a, hdef[1] * (1 - (t - ct) / .25)); } return a; }

// =====================================================================
// SCENE 1 — HOOK (0 – 3.5)
// =====================================================================
function sHook(t) {
  bgFill('#07070b');
  const beat = Math.exp(-(t % .469) * 5);
  radial(540, 960, 1100, `rgba(220,20,60,${.16 + .22 * beat})`, 'rgba(0,0,0,0)');
  let zs = 1, za = 1; if (t > 3.15) { const k = E.in(P(t, 3.15, 3.5)); zs = 1 + k * 1.2; za = 1 - k; }
  ctx.save(); ctx.globalAlpha = za; camera(540, 960, zs, () => {
    if (t < .9) {
      const sc = lerp(2.2, 1, E.back(P(t, 0, .28)));
      T('✋', 540, 640, { size: 210, sc: pop(t, .12) });
      glitchT('TUNGGU!', 540, 960, { size: 270, font: 'Anton', color: '#fff', sc }, t < .3 ? 1 : .12, t);
      T('JANGAN SCROLL DULU', 540, 1170, { size: 54, weight: 900, color: '#ff3b5c', alpha: fi(t, .35), ls: 6 });
    } else {
      T('Pernah lihat', 540, 610, { size: 124, weight: 900, sc: pop(t, .9) });
      T('video kayak', 540, 765, { size: 124, weight: 900, sc: pop(t, 1.2) });
      const s3 = pop(t, 1.6, .4);
      if (s3 > 0) { ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.05); ctx.scale(s3, s3); ctx.fillStyle = YEL; rr(-330, -155, 660, 310, 34); ctx.fill(); T('GINI?', 0, 12, { size: 280, font: 'Anton', color: '#111' }); ctx.restore(); }
      T('👀', 540, 1330, { size: 180, sc: pop(t, 2.0), rot: Math.sin(t * 10) * .12 });
      if (t > 2.3) for (let i = 0; i < 3; i++) chevron(540, 1540 + i * 62, .25 + .75 * Math.max(0, Math.sin(t * 8 - i * .9)), YEL);
    }
  }); ctx.restore();
}

// =====================================================================
// SCENE 2 — FEED + VIEWS (3.5 – 11)
// =====================================================================
const CARDS = [
  { title: 'Sejarah Dunia dalam 10 Menit (Versi Animasi)', ch: 'Si Paling Sejarah', v: '87 jt', ago: '5 bln', word: '10 MENIT', pal: ['#ff9f1c', '#e63946'], dur: '10:02' },
  { title: 'Kenapa Kucing Takut Timun? Ini Jawabannya', ch: 'Kartun Fakta', v: '54 jt', ago: '3 bln', word: 'TIMUN?!', pal: ['#2ec4b6', '#1b4e9e'], dur: '6:41' },
  { title: 'Kisah Horor Animasi: Rumah Nomor 13', ch: 'Kisah Seram', v: '61 jt', ago: '1 thn', word: 'NO. 13', pal: ['#5a189a', '#10002b'], dur: '12:18' },
  { title: 'Apa Jadinya Kalau Kamu Tidak Tidur Selama 1 Tahun?', ch: 'Animasi Fakta', v: '128 jt', ago: '2 bln', word: '1 TAHUN?!', pal: ['#f72585', '#560bad'], dur: '8:42' },
  { title: 'Bagaimana Piramida Sebenarnya Dibangun?', ch: 'Sains Kartun', v: '103 jt', ago: '8 bln', word: 'RAHASIA', pal: ['#ffbe0b', '#fb5607'], dur: '9:15' },
  { title: 'Hidup di Jepang Tahun 1600', ch: 'Dongeng Dunia', v: '72 jt', ago: '4 bln', word: '1600', pal: ['#06d6a0', '#118ab2'], dur: '11:30' },
];
function toon(cx, cy, r, i, t) {
  ctx.lineWidth = r * .08; ctx.strokeStyle = '#111';
  ctx.fillStyle = ['#4cc9f0', '#ffd166', '#ef476f', '#06d6a0', '#f4a261', '#9b5de5'][i % 6];
  rr(cx - r * .75, cy + r * .75, r * 1.5, r * 1.4, r * .45); ctx.fill(); ctx.stroke();
  ctx.fillStyle = i === 2 ? '#c9d6df' : '#ffd7b5'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.stroke();
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(cx + s * r * .38, cy - r * .1, r * .26, r * .33, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = i === 2 ? '#d00000' : '#111'; ctx.beginPath(); ctx.arc(cx + s * r * .38 + Math.sin(t * 3 + i) * r * .07, cy - r * .05, r * .12, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#7a1f2b'; ctx.beginPath(); ctx.ellipse(cx, cy + r * .5, r * .2, r * .25, 0, 0, 7); ctx.fill(); ctx.stroke();
}
function thumb(c, x, y, w, hh, t, i) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + hh); g.addColorStop(0, c.pal[0]); g.addColorStop(1, c.pal[1]); ctx.fillStyle = g; ctx.fillRect(x, y, w, hh);
  const cx = x + w * .28, cy = y + hh * .5;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .4 + i); ctx.fillStyle = 'rgba(255,255,255,0.13)';
  for (let k = 0; k < 12; k++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, w, k * Math.PI / 6, k * Math.PI / 6 + .17); ctx.fill(); } ctx.restore();
  toon(cx, cy, hh * .27, i, t);
  T(c.word, x + w * .69, y + hh * .45, { size: hh * .21, font: 'Anton', color: YEL, stroke: '#000', sw: 16, rot: -.06, maxW: w * .5 });
  ctx.strokeStyle = '#ff1f1f'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w * .62, y + hh * .75); ctx.lineTo(x + w * .45, y + hh * .62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w * .45, y + hh * .62); ctx.lineTo(x + w * .5, y + hh * .58); ctx.moveTo(x + w * .45, y + hh * .62); ctx.lineTo(x + w * .475, y + hh * .69); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.82)'; rr(x + w - 118, y + hh - 58, 100, 42, 8); ctx.fill(); T(c.dur, x + w - 68, y + hh - 36, { size: 26, weight: 700 });
  ctx.restore();
}
function phoneUI(lt, t) {
  const px = 120, py = 300, pw = 840, ph = 1480, sx = px + 22, sy = py + 22, sw = pw - 44, sh = ph - 44;
  ctx.fillStyle = '#1c1c22'; rr(px, py, pw, ph, 90); ctx.fill(); ctx.strokeStyle = '#3a3a44'; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); rr(sx, sy, sw, sh, 70); ctx.clip(); ctx.fillStyle = '#0f0f0f'; ctx.fillRect(sx, sy, sw, sh);
  const scroll = 1920 * E.io(P(lt, .45, 3.9)) + Math.sin(lt * 1.2) * 0;
  const cy0 = sy + 232; const out = {};
  for (let i = 0; i < CARDS.length; i++) {
    const y = cy0 + i * 640 - scroll; if (y > sy + sh || y + 640 < sy) continue; const c = CARDS[i];
    thumb(c, sx, y, sw, 448, t, i);
    ctx.fillStyle = c.pal[0]; ctx.beginPath(); ctx.arc(sx + 52, y + 448 + 62, 32, 0, 7); ctx.fill();
    T(c.ch[0], sx + 52, y + 448 + 64, { size: 32, weight: 900 });
    const lines = wrap(c.title, 640, 33, 'Mont', 700).slice(0, 2);
    lines.forEach((l, k) => T(l, sx + 104, y + 448 + 46 + k * 42, { size: 33, weight: 700, align: 'left' }));
    const my = y + 448 + 46 + lines.length * 42 + 6; const a = c.ch + ' • ', b = c.v + ' x ditonton', d = ' • ' + c.ago + ' lalu';
    const wa = TW(a, 27, 'Mont', 600), wb = TW(b, 27, 'Mont', 800);
    T(a, sx + 104, my, { size: 27, weight: 600, color: '#9a9a9a', align: 'left' });
    T(b, sx + 104 + wa, my, { size: 27, weight: 800, color: '#fff', align: 'left' });
    T(d, sx + 104 + wa + wb, my, { size: 27, weight: 600, color: '#9a9a9a', align: 'left' });
    if (i === 3) out.view = { x: sx + 104 + wa, y: my, w: wb };
  }
  // header (status + app bar + chips)
  ctx.fillStyle = '#0f0f0f'; ctx.fillRect(sx, sy, sw, 232);
  T('21:37', sx + 70, sy + 42, { size: 28, weight: 700, align: 'left' }); T('▮▮▮  87%', sx + sw - 70, sy + 42, { size: 24, weight: 700, align: 'right' });
  ctx.fillStyle = '#ff2d55'; rr(sx + 34, sy + 88, 64, 46, 12); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(sx + 58, sy + 99); ctx.lineTo(sx + 80, sy + 111); ctx.lineTo(sx + 58, sy + 123); ctx.fill();
  T('Tontonan', sx + 112, sy + 112, { size: 40, weight: 900, align: 'left', ls: -1 });
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(sx + sw - 140, sy + 108, 17, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx + sw - 128, sy + 120); ctx.lineTo(sx + sw - 114, sy + 134); ctx.stroke();
  ctx.beginPath(); ctx.arc(sx + sw - 60, sy + 110, 18, Math.PI, 0); ctx.lineTo(sx + sw - 42, sy + 124); ctx.lineTo(sx + sw - 78, sy + 124); ctx.closePath(); ctx.stroke();
  let cx = sx + 34; ['Semua', 'Animasi', 'Shorts', 'Viral', 'Sejarah'].forEach((s, i) => { const w = TW(s, 28, 'Mont', 700) + 44; ctx.fillStyle = i === 1 ? '#fff' : '#272727'; rr(cx, sy + 160, w, 52, 12); ctx.fill(); T(s, cx + w / 2, sy + 187, { size: 28, weight: 700, color: i === 1 ? '#000' : '#fff' }); cx += w + 16; });
  ctx.restore();
  ctx.fillStyle = '#000'; rr(540 - 80, sy + 14, 160, 36, 18); ctx.fill();
  return out;
}
function sFeed(t, lt) {
  bgGrad([[0, '#140a1f'], [1, '#05050a']]);
  radial(540, 900, 1000, 'rgba(255,45,85,0.18)', 'rgba(0,0,0,0)');
  const enter = (1 - E.out(P(lt, 0, .55))) * 1700;
  const zk = E.io(P(lt, 3.95, 4.7));
  const z = lerp(1, 1.75, zk);
  let vw = { x: 400, y: 1110, w: 300 };
  ctx.save(); ctx.translate(0, enter);
  camera(lerp(540, 470, zk), lerp(960, 1080, zk), z, () => {
    const o = phoneUI(lt, t); if (o.view) vw = o.view;
    if (lt > 4.2) { // red highlight around view count
      const k = E.out(P(lt, 4.2, 4.6)); ctx.save(); ctx.strokeStyle = '#ff1f3d'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      const L = 2 * (vw.w + 40) + 2 * 60; ctx.setLineDash([L * k, L]); rr(vw.x - 20, vw.y - 30, vw.w + 40, 60, 30); ctx.stroke(); ctx.restore();
    }
  });
  ctx.restore();
  if (lt < 4.7) rich([['Video ', '#fff'], ['ANIMASI', YEL], [' kayak gini...', '#fff']], 540, 190 + enter * .2, { size: 70, weight: 900, sc: pop(lt, .5) });
  // overlay: giant counter
  if (lt > 4.65) {
    const a = P(lt, 4.65, 4.85); ctx.fillStyle = `rgba(5,3,10,${.86 * a})`; ctx.fillRect(-100, -100, W + 200, H + 200);
    radial(540, 960, 900, `rgba(255,30,60,${.35 * a})`, 'rgba(0,0,0,0)');
    rays(540, 990, 18, lt * .25, `rgba(255,230,0,${.05 * a})`);
    T('🔥', 540, 560, { size: 170, sc: pop(lt, 4.72) });
    T('DITONTON', 540, 760, { size: 96, weight: 900, sc: pop(lt, 4.75), ls: 6 });
    const v = 128e6 * E.out(P(lt, 4.75, 6.3));
    T(idn(v), 540, 960, { size: 205, font: 'Anton', color: YEL, glow: 'rgba(255,200,0,.8)', gb: 50, sc: pop(lt, 4.7), maxW: 1000 });
    T('KALI!', 540, 1150, { size: 120, font: 'Anton', sc: pop(lt, 6.3), color: '#fff' });
    const pills = [['87 JT VIEWS', 230, 410, -.12, 5.4], ['54 JT VIEWS', 850, 440, .1, 5.6], ['103 JT VIEWS', 240, 1330, .09, 5.8], ['72 JT VIEWS', 845, 1370, -.08, 6.0]];
    for (const [s, x, y, r, t0] of pills) pill(x, y + Math.sin(lt * 3 + x) * 10, s, { size: 40, bg: '#ff1f3d', sc: pop(lt, t0), rot: r, font: 'Anton', weight: '' });
    rich([['...padahal cuma ', '#fff'], ['video animasi simpel.', YEL]], 540, 1580, { size: 50, weight: 800, sc: pop(lt, 6.4) });
  }
}

// =====================================================================
// SCENE 3 — MONEY (11 – 17.5)
// =====================================================================
function bill(x, y, rot, s, a, kind) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  const base = kind ? '#e86a86' : '#86c06c', dark = kind ? '#9b2340' : '#2f6b2a', mid = kind ? '#c9476a' : '#4e9a45', lite = kind ? '#ffd9e2' : '#dcf5cf';
  ctx.fillStyle = base; rr(-115, -54, 230, 108, 8); ctx.fill(); ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = mid; ctx.lineWidth = 3; rr(-100, -41, 200, 82, 6); ctx.stroke();
  ctx.fillStyle = mid; ctx.beginPath(); ctx.arc(0, 0, 27, 0, 7); ctx.fill();
  T(kind ? 'Rp' : '$', 0, 2, { size: kind ? 26 : 38, font: 'Anton', color: lite });
  T(kind ? '100.000' : '100', -62, -24, { size: 18, font: 'Anton', color: dark }); T(kind ? '100.000' : '100', 62, 26, { size: 18, font: 'Anton', color: dark });
  ctx.restore();
}
function moneyRain(lt, a, n = 34) {
  for (let i = 0; i < n; i++) {
    const depth = .45 + h(i + .2) * .75, sp = (380 + h(i + .3) * 420) * depth;
    const y = ((lt * sp + h(i + .7) * 2500) % 2500) - 300, x = h(i) * W + Math.sin(lt * 2 + i) * 40;
    bill(x, y, lt * (h(i + .9) - .5) * 5 + i, depth, a * (.5 + depth * .5), i % 2);
  }
}
function sMoney(t, lt) {
  bgGrad([[0, '#06301a'], [1, '#020d07']]);
  radial(540, 760, 900, 'rgba(60,255,140,0.18)', 'rgba(0,0,0,0)');
  moneyRain(lt, fi(lt, 1.3, .6) * .9);
  if (lt < 1.45) {
    const out = E.in(P(lt, 1.2, 1.45));
    ctx.save(); ctx.globalAlpha = 1 - out;
    T('Dan yang bikin', 540, 820, { size: 104, weight: 900, sc: pop(lt, .2) });
    T('videonya?', 540, 960, { size: 150, font: 'Anton', color: YEL, sc: pop(lt, .55) });
    T('🤔', 540, 1170, { size: 160, sc: pop(lt, .7), rot: Math.sin(lt * 6) * .1 });
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-100, -100, W + 200, H + 200);
    T('bisa menghasilkan', 540, 470, { size: 66, weight: 800, sc: pop(lt, 1.4) });
    const v = 100e6 * E.out(P(lt, 1.4, 2.8));
    T('Rp' + idn(v), 540, 650, { size: 165, font: 'Anton', grad: ['#fff6b0', '#ffd000', '#ff9d00'], stroke: '#3b2200', sw: 14, glow: 'rgba(255,200,0,.6)', gb: 40, sc: pop(lt, 1.4), maxW: 1000 });
    pill(540, 830, 'PER BULAN!', { size: 70, font: 'Anton', weight: '', bg: '#ff1f3d', sc: lt > 2.9 ? lerp(1.8, 1, E.back(P(lt, 2.9, 3.15))) : 0, rot: -.06 });
    if (lt > 3.6) {
      const k = pop(lt, 3.6); ctx.save(); ctx.translate(540, 1110); ctx.scale(k, k);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(-440, -150, 880, 300, 40); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3; ctx.stroke();
      T('Channel besar? Bisa tembus', 0, -80, { size: 46, weight: 700, color: '#d8ffe6' });
      T('$' + Math.floor(600000 * E.out(P(lt, 3.65, 4.6))).toLocaleString('en-US') + '+', 0, 40, { size: 140, font: 'Anton', color: '#3dff8f', glow: 'rgba(60,255,140,.7)', gb: 40 });
      ctx.restore();
    }
    rich([['...cuma dari ', '#fff'], ['VIDEO ANIMASI', YEL], [' 🎬', '#fff']], 540, 1400, { size: 58, weight: 900, sc: pop(lt, 5.0) });
    T('*Ilustrasi potensi penghasilan. Hasil setiap kreator berbeda.', 540, 1840, { size: 26, weight: 600, color: 'rgba(255,255,255,.6)', alpha: fi(lt, 1.5) });
  }
}

// =====================================================================
// SCENE 4 — TWIST → CLAUDE (17.5 – 23.2)
// =====================================================================
function sTwist(t, lt) {
  if (lt < 2.7) {
    bgFill('#060608');
    if (lt < 1.15) {
      glitchT('Tapi tahu nggak', 540, 860, { size: 104, weight: 900 }, lt < .35 ? 1 : .1, t);
      glitchT('rahasianya?', 540, 1010, { size: 150, font: 'Anton', color: YEL }, lt < .35 ? 1 : .1, t);
    } else {
      T('Mereka itu...', 540, 560, { size: 80, weight: 800, color: '#aaa', alpha: fi(lt, 1.15) });
      ['animator', 'editor video', 'desainer'].forEach((w, i) => {
        const t0 = 1.2 + i * .45, y = 760 + i * 210, s = pop(lt, t0);
        if (s <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(s, s);
        rich([['BUKAN ', '#ff3b5c'], [w, '#fff']], 40, 0, { size: 96, font: 'Anton' });
        T('❌', -420, 0, { size: 80 });
        const k = E.out(P(lt, t0 + .2, t0 + .35)); if (k > 0) { const ww = TW('BUKAN ' + w, 96, 'Anton'); ctx.strokeStyle = '#ff1f3d'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(40 - ww / 2 - 20, 8); ctx.lineTo(40 - ww / 2 - 20 + (ww + 40) * k, -4); ctx.stroke(); }
        ctx.restore();
      });
    }
  } else {
    const k = E.out(P(lt, 2.7, 3.0));
    bgFill('#1a0d08'); ctx.save(); ctx.globalAlpha = k; bgGrad([[0, '#e88a68'], [.5, CORAL], [1, '#a9472c']]); ctx.restore();
    rays(540, 960, 16, lt * .3, 'rgba(255,255,255,.09)');
    radial(540, 960, 700, 'rgba(255,240,220,.35)', 'rgba(255,240,220,0)');
    let zs = 1, za = 1; if (lt > 5.4) { const q = E.in(P(lt, 5.4, 5.7)); zs = 1 + q * 1.5; za = 1 - q; }
    ctx.save(); ctx.globalAlpha = za; camera(540, 960, zs, () => {
      T('Mereka cuma pakai', 540, 700, { size: 76, weight: 900, sc: pop(lt, 2.85), color: '#2a1209' });
      const s = lt > 3.2 ? lerp(2.6, 1, E.back(P(lt, 3.2, 3.5))) : 0;
      for (let i = 0; i < 6; i++) sparkle(540 + Math.cos(i + lt) * 470, 960 + Math.sin(i * 2 + lt) * 260, 30 * pop(lt, 3.3 + i * .05), '#fff', lt);
      T('CLAUDE', 540, 960, { size: 300, font: 'Anton', color: '#fff', sc: s, shadow: { c: '#7a2e17', x: 12, y: 14 }, ls: 8 });
      rich([['AI yang bikin animasinya ', '#fff'], ['UNTUKMU ✨', '#2a1209']], 540, 1180, { size: 44, weight: 900, sc: pop(lt, 3.7) });
      pill(540, 1420, 'Lihat sendiri hasilnya 👇', { size: 50, bg: '#2a1209', sc: pop(lt, 4.4) * (1 + .04 * Math.sin(lt * 12)) });
    }); ctx.restore();
  }
}

// =====================================================================
// SCENE 5 — STYLE SHOWCASE (23.2 – 43)
// =====================================================================
// --- crayon helpers
function crayonStroke(pts, color, width, seed, passes = 4, closed = false) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let k = 0; k < passes; k++) {
    ctx.globalAlpha = .55; ctx.lineWidth = width * (.45 + h2(seed, k) * .6); ctx.beginPath();
    pts.forEach((p, i) => { const jx = (h2(seed + i * 3.1, k) - .5) * width * .55, jy = (h2(seed + i * 7.3, k + 9) - .5) * width * .55; i ? ctx.lineTo(p[0] + jx, p[1] + jy) : ctx.moveTo(p[0] + jx, p[1] + jy); });
    if (closed) ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}
function circPts(cx, cy, r, n, seed) { const pts = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, q = 1 + (h2(seed, i % n) - .5) * .07; pts.push([cx + Math.cos(a) * r * q, cy + Math.sin(a) * r * q]); } return pts; }
function hatch(pathFn, color, bx, by, bw, bh, seed, sp = 15, lw = 13, alpha = .6, ang = .55) {
  ctx.save(); pathFn(); ctx.clip(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.globalAlpha = alpha; ctx.beginPath();
  let i = 0; for (let d = 0; d < bw + bh * ang + sp; d += sp) { const j1 = (h2(seed, i) - .5) * sp * .9, j2 = (h2(seed, i + .5) - .5) * sp * .9; ctx.moveTo(bx + d + j1, by - 10); ctx.lineTo(bx + d - bh * ang + j2, by + bh + 10); i++; }
  ctx.stroke(); ctx.restore();
}
const polyPath = pts => () => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
const circPath = (x, y, r) => () => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); };
function hillY(x) { return 1330 + Math.sin(x * .004 + 1) * 60 + Math.sin(x * .011) * 18; }
function sCrayon(lt, T0) {
  ctx.drawImage(PAPER, 0, 0);
  const b = Math.floor(T0 * 8);
  on(LAYER, () => {
    ctx.clearRect(0, 0, W, H);
    hatch(() => { ctx.beginPath(); ctx.rect(0, 330, W, 1060); }, '#7cc6ec', 0, 330, W, 1060, b, 22, 16, .32, .4);
    const sx = 820, sy = 560;
    hatch(circPath(sx, sy, 118), '#ffd60a', sx - 120, sy - 120, 240, 240, b + 1, 11, 13, .8);
    crayonStroke(circPts(sx, sy, 118, 28, b), '#f77f00', 11, b);
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + lt * .6; crayonStroke([[sx + Math.cos(a) * 150, sy + Math.sin(a) * 150], [sx + Math.cos(a) * 215, sy + Math.sin(a) * 215]], '#f77f00', 13, b + k); }
    // sun face
    crayonStroke([[sx - 40, sy - 10], [sx - 36, sy - 30]], '#6a3b00', 12, b + 2); crayonStroke([[sx + 40, sy - 10], [sx + 36, sy - 30]], '#6a3b00', 12, b + 3);
    const sm = []; for (let i = 0; i <= 8; i++) { const a = .3 + i / 8 * (Math.PI - .6); sm.push([sx + Math.cos(a) * 50, sy + 10 + Math.sin(a) * 40]); } crayonStroke(sm, '#6a3b00', 10, b + 4);
    // cloud
    const cx = 150 + lt * 70, cy = 470; const cpts = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 2; cpts.push([cx + Math.cos(a) * 150 * (1 + .12 * Math.sin(a * 5)), cy + Math.sin(a) * 62 * (1 + .2 * Math.cos(a * 5))]); }
    hatch(polyPath(cpts), '#ffffff', cx - 170, cy - 80, 340, 160, b + 5, 10, 14, .9); crayonStroke(cpts, '#5d8bb3', 9, b + 6);
    // hills
    const hp = []; for (let x = -20; x <= W + 20; x += 40) hp.push([x, hillY(x)]); const fill = [...hp, [W + 20, H + 20], [-20, H + 20]];
    hatch(polyPath(fill), '#7bc043', -20, 1230, W + 40, 700, b + 7, 14, 15, .75, .3);
    crayonStroke(hp, '#2b8a3e', 14, b + 8);
    // flowers
    for (let i = 0; i < 9; i++) { const fx = 60 + i * 120 + h(i) * 40, fy = hillY(fx) + 120 + h(i + 2) * 280; const fc = ['#ff4d6d', '#ffd60a', '#9b5de5'][i % 3]; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.28 + lt; hatch(circPath(fx + Math.cos(a) * 16, fy + Math.sin(a) * 16, 12), fc, fx - 40, fy - 40, 80, 80, b + i + p, 6, 8, .9); } }
    // tree
    crayonStroke([[170, 1380], [180, 1180]], '#7f4f24', 30, b + 9);
    const tp = circPts(178, 1080, 120, 22, b + 10); hatch(polyPath(tp), '#2d6a4f', 50, 950, 260, 260, b + 11, 12, 14, .8); crayonStroke(tp, '#1b4332', 10, b + 12);
    // kid
    const kx = 380 + lt * 110, bounce = Math.abs(Math.sin(lt * 7)) * 16, ky = hillY(kx) + 110 - bounce;
    const sw_ = Math.sin(lt * 7) * 26;
    crayonStroke([[kx - 18, ky - 70], [kx - 18 + sw_, ky]], '#333', 13, b + 13); crayonStroke([[kx + 18, ky - 70], [kx + 18 - sw_, ky]], '#333', 13, b + 14);
    const dress = [[kx, ky - 230], [kx - 75, ky - 62], [kx + 75, ky - 62]]; hatch(polyPath(dress), '#e63946', kx - 80, ky - 240, 160, 190, b + 15, 9, 12, .9); crayonStroke([...dress, dress[0]], '#9d0208', 9, b + 16);
    crayonStroke([[kx - 30, ky - 180], [kx - 85, ky - 120 + sw_ * .4]], '#333', 11, b + 17);
    const hx = kx + 120, hy = ky - 470 + Math.sin(lt * 2) * 12;
    crayonStroke([[kx + 30, ky - 180], [kx + 95, ky - 250]], '#333', 11, b + 18);
    crayonStroke([[kx + 95, ky - 250], [hx - 10, hy + 100], [hx, hy + 75]], '#555', 5, b + 19, 2);
    hatch(circPath(hx, hy, 72), '#ff006e', hx - 75, hy - 75, 150, 150, b + 20, 9, 12, .85); crayonStroke(circPts(hx, hy, 72, 20, b), '#9d0208', 9, b + 21);
    const hdx = kx, hdy = ky - 290; hatch(circPath(hdx, hdy, 62), '#ffcb9a', hdx - 64, hdy - 64, 128, 128, b + 22, 9, 11, .9); crayonStroke(circPts(hdx, hdy, 62, 20, b + 23), '#a0522d', 8, b + 24);
    crayonStroke([[hdx - 22, hdy - 8], [hdx - 20, hdy - 4]], '#222', 12, b + 25); crayonStroke([[hdx + 22, hdy - 8], [hdx + 20, hdy - 4]], '#222', 12, b + 26);
    const sm2 = []; for (let i = 0; i <= 8; i++) { const a = .4 + i / 8 * (Math.PI - .8); sm2.push([hdx + Math.cos(a) * 26, hdy + 14 + Math.sin(a) * 18]); } crayonStroke(sm2, '#c1121f', 7, b + 27);
    for (let i = 0; i < 7; i++) crayonStroke([[hdx - 50 + i * 16, hdy - 52], [hdx - 60 + i * 18, hdy - 80 - h(i) * 15]], '#6f1d1b', 9, b + 28 + i);
    // written text
    const s = 'Halo, Dunia!', n = Math.floor(P(lt, .15, 1.3) * s.length + .001);
    const colors = ['#e63946', '#f77f00', '#2a9d8f', '#3a86ff', '#9b5de5', '#ff006e'];
    ctx.font = `150px ${fs('Caveat')}`; let tw = 0; const ws = [...s].map(c => { const w = ctx.measureText(c).width; tw += w; return w; });
    let x = 540 - tw / 2; [...s].forEach((c, i) => { if (i < n) { for (let p = 0; p < 2; p++) T(c, x + ws[i] / 2 + (h2(b, i + p) - .5) * 5, 880 + (h2(b + 1, i + p) - .5) * 6, { size: 150, font: 'Caveat', color: colors[i % 6], rot: (h2(b + i, p) - .5) * .12, alpha: .85 }); } x += ws[i]; });
    if (lt > 1.3) { const k = P(lt, 1.3, 1.7); const pts = []; for (let i = 0; i <= 20 * k; i++) pts.push([540 - tw / 2 + i / 20 * tw, 965 + Math.sin(i * 1.7) * 9]); if (pts.length > 1) crayonStroke(pts, '#3a86ff', 10, b + 40); }
    for (let i = 0; i < 5; i++) { const st = pop(lt, 1.5 + i * .15); if (st > 0) { const x0 = [140, 940, 230, 880, 520][i], y0 = [760, 800, 1020, 1060, 1100][i]; ctx.save(); ctx.translate(x0, y0); ctx.scale(st, st); const pts = []; for (let k = 0; k <= 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2, r = k % 2 ? 14 : 34; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } crayonStroke(pts, colors[i], 7, b + 50 + i); ctx.restore(); } }
    ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = .45; ctx.fillStyle = TOOTHPAT; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  });
  ctx.drawImage(LAYER.canvas, 0, 0);
}
// --- graffiti
function sprayCan(x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const g = ctx.createLinearGradient(-40, 0, 40, 0); g.addColorStop(0, '#666'); g.addColorStop(.4, '#eee'); g.addColorStop(1, '#555');
  ctx.fillStyle = g; rr(-40, 0, 80, 190, 14); ctx.fill(); ctx.fillStyle = '#ff2e88'; ctx.fillRect(-40, 60, 80, 70);
  ctx.fillStyle = '#ccc'; rr(-28, -26, 56, 30, 8); ctx.fill(); ctx.fillStyle = '#222'; ctx.fillRect(-10, -46, 20, 22);
  ctx.restore();
}
function sGraffiti(lt, T0) {
  ctx.drawImage(BRICK, 0, 0);
  const f = Math.floor(T0 * 30);
  // small tag
  T('cuan', 230, 470, { size: 120, font: 'Marker', color: '#00e08a', stroke: '#002b1a', sw: 10, rot: -.15, alpha: fi(lt, .9, .3) });
  T('★', 880, 520, { size: 130, color: YEL, stroke: '#000', sw: 8, rot: .2, sc: pop(lt, 1.1) });
  // main word
  const word = 'VIRAL!', size = 300; const ww = TW(word, size, 'Marker');
  const rp = E.io(P(lt, .1, 1.5));
  ctx.save(); ctx.translate(540, 930); ctx.rotate(-.07);
  ctx.save(); ctx.beginPath(); ctx.rect(-ww / 2 - 80, -300, (ww + 160) * rp, 900); ctx.clip();
  for (let d = 22; d > 0; d -= 2) T(word, d * 1.1, d * 1.1, { size, font: 'Marker', color: '#2b0a3d', stroke: '#2b0a3d', sw: 46 });
  T(word, 0, 0, { size, font: 'Marker', color: '#000', stroke: '#000', sw: 46 });
  T(word, 0, 0, { size, font: 'Marker', color: '#fff', stroke: '#fff', sw: 24 });
  ctx.save(); ctx.font = `${size}px ${fs('Marker')}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const g = ctx.createLinearGradient(-ww / 2, 0, ww / 2, 0); g.addColorStop(0, '#ff2e88'); g.addColorStop(.5, '#ff8a00'); g.addColorStop(1, '#ffe600'); ctx.fillStyle = g; ctx.fillText(word, 0, 0);
  ctx.globalAlpha = .35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.rect(-ww, -size * .5, ww * 2, size * .28); ctx.clip(); ctx.fillText(word, 0, 0); ctx.restore();
  // drips
  for (let i = 0; i < 11; i++) {
    const x = -ww / 2 + 40 + h(i + 3) * (ww - 80), t0 = .6 + h(i) * .9, L = P(lt, t0, t0 + 1.6) * (50 + h(i + 1) * 170);
    if (L <= 0) continue; const c = ['#ff2e88', '#ff8a00', '#ffe600'][Math.floor((x / ww + .5) * 3)] || '#ff8a00';
    ctx.fillStyle = c; rr(x - 8, 90, 16, L, 8); ctx.fill(); ctx.beginPath(); ctx.arc(x, 90 + L, 13, 0, 7); ctx.fill();
  }
  ctx.restore();
  // spray particles + can at reveal edge
  if (lt < 1.6) {
    const ex = -ww / 2 - 80 + (ww + 160) * rp, ey = Math.sin(lt * 22) * 110;
    for (let i = 0; i < 160; i++) { const r = Math.pow(h2(f, i), 2) * 110, a = h2(f, i + .5) * 6.28; ctx.fillStyle = ['#ff2e88', '#ff8a00', '#ffe600', '#fff'][i % 4]; ctx.globalAlpha = .8; ctx.beginPath(); ctx.arc(ex + Math.cos(a) * r, ey + Math.sin(a) * r, 1 + h2(f, i + .3) * 4, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; sprayCan(ex + 120, ey + 60, .5);
  }
  ctx.restore();
  // #FYP
  const s2 = pop(lt, 1.6, .3);
  if (s2 > 0) {
    ctx.save(); ctx.translate(540, 1300); ctx.rotate(.05);
    ctx.fillStyle = '#00d5ff'; ctx.globalAlpha = .9; for (let i = 0; i < 40; i++) { const a = h(i) * 6.28, r = 150 + h(i + 1) * 300 * s2; ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r * .5, 4 + h(i + 2) * 14, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    T('#FYP', 0, 0, { size: 190, font: 'Marker', color: '#00d5ff', stroke: '#001a33', sw: 26, sc: s2, shadow: { c: '#001a33', x: 12, y: 12 } });
    ctx.restore();
  }
}
// --- manga
function mangaEye(cx, cy, dir, lt) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(dir, 1);
  const path = () => { ctx.beginPath(); ctx.moveTo(-175, 12); ctx.quadraticCurveTo(-40, -115, 165, -42); ctx.quadraticCurveTo(70, 75, -175, 12); ctx.closePath(); };
  ctx.fillStyle = '#fff'; path(); ctx.fill();
  ctx.save(); path(); ctx.clip();
  const inten = E.out(P(lt, 1.3, 1.5)), ir = 1 - .12 * inten;
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, -8, 88 * ir, 104 * ir, 0, 0, 7); ctx.fill();
  ctx.fillStyle = HALFDPAT; ctx.beginPath(); ctx.ellipse(0, 10, 70 * ir, 70 * ir, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(0, -6, lerp(34, 12, inten), lerp(48, 30, inten), 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-32, -52, 24, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(34, 22, 10, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
  ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-185, 16); ctx.quadraticCurveTo(-40, -118, 172, -46); ctx.stroke();
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(150, -44); ctx.lineTo(214, -82); ctx.moveTo(120, -58); ctx.lineTo(170, -100); ctx.stroke();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-120, 38); ctx.quadraticCurveTo(40, 72, 142, 18); ctx.stroke();
  const by = lerp(0, 18, inten); ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(-180, -110 + by); ctx.quadraticCurveTo(0, -150, 185, -190 - by * .3); ctx.stroke();
  ctx.restore();
}
function panel(x, y, w, hh, t0, lt, fn) {
  if (lt < t0) return; const k = E.out(P(lt, t0, t0 + .18)), s = lerp(1.25, 1, k);
  ctx.save(); ctx.globalAlpha = k; ctx.translate(x + w / 2, y + hh / 2); ctx.scale(s, s); ctx.translate(-(x + w / 2), -(y + hh / 2));
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, hh); fn(); ctx.restore();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 10; ctx.strokeRect(x, y, w, hh); ctx.restore();
}
function sManga(lt, T0) {
  bgFill('#f3f0e8');
  const f = Math.floor(T0 * 12);
  panel(40, 330, 1000, 500, 0, lt, () => {
    const cx = 540, cy = 590;
    ctx.fillStyle = '#000';
    for (let k = 0; k < 110; k++) { const a = h2(f, k) * 6.28, w = .004 + h2(f, k + 1) * .014, ri = 360 + h2(f, k + 2) * 260; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - w) * 1400, cy + Math.sin(a - w) * 900); ctx.lineTo(cx + Math.cos(a) * ri, cy + Math.sin(a) * ri * .55); ctx.lineTo(cx + Math.cos(a + w) * 1400, cy + Math.sin(a + w) * 900); ctx.fill(); }
    mangaEye(300, 600, -1, lt); mangaEye(780, 600, 1, lt);
    ctx.fillStyle = '#000';
    for (let i = 0; i < 14; i++) { const x = 40 + i * 75 + Math.sin(lt * 3 + i) * 4, len = 120 + h(i) * 140; ctx.beginPath(); ctx.moveTo(x - 50, 330); ctx.lineTo(x + 50, 330); ctx.lineTo(x + (h(i + 1) - .5) * 60, 330 + len); ctx.fill(); }
    if (lt > 1.3) T('!!', 960, 450, { size: 120, font: 'Bangers', color: '#000', rot: .2, sc: pop(lt, 1.3) });
  });
  panel(40, 860, 480, 600, .6, lt, () => {
    ctx.fillStyle = HALFPAT; ctx.fillRect(40, 860, 480, 600);
    ctx.fillStyle = '#000'; for (let i = 0; i < 40; i++) { const y = 860 + h2(f, i) * 600, w = 200 + h2(f, i + 1) * 300; ctx.fillRect(520 - w - h2(f, i + 2) * 100, y, w, 2 + h2(f, i + 3) * 5); }
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 10; ctx.beginPath(); const bolt = [[330, 870], [210, 1130], [300, 1130], [170, 1450], [420, 1080], [320, 1080], [430, 870]]; bolt.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke();
    ['ド', 'ド', 'ド'].forEach((c, i) => T(c, 120 + i * 18 + (h2(f, i) - .5) * 10, 990 + i * 170 + (h2(f, i + 4) - .5) * 10, { size: 150, font: 'IPAGothic', weight: 900, color: '#000', stroke: '#fff', sw: 18, rot: -.15 }));
  });
  panel(550, 860, 490, 600, 1.1, lt, () => {
    const cx = 795, cy = 1160; rays(cx, cy, 28, lt * .5, '#000');
    const k = pop(lt, 1.15, .3); ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.rotate(-.1);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 10; ctx.beginPath();
    for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28, r = i % 2 ? 120 : 230 + h(i) * 40; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke();
    T('BAM!', 0, 8, { size: 150, font: 'Bangers', color: '#000', ls: 4 }); ctx.restore();
  });
  panel(40, 1490, 1000, 250, 1.7, lt, () => {
    ctx.fillStyle = HALFPAT; ctx.globalAlpha = .35; ctx.fillRect(40, 1490, 1000, 250); ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(560, 1612, 420, 95, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(220, 1650); ctx.lineTo(120, 1730); ctx.lineTo(280, 1680); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(560, 1612, 412, 88, 0, 0, 7); ctx.fill();
    T('Aku pasti VIRAL!!', 560, 1618, { size: 92, font: 'Bangers', color: '#000', ls: 3, sc: pop(lt, 1.8) });
  });
}
// --- anime sunset
function girl(x, y, s, lt) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#0d0618';
  ctx.fillRect(-20, -125, 15, 125); ctx.fillRect(6, -125, 15, 125);
  const fl = Math.sin(lt * 3.2) * 10;
  ctx.beginPath(); ctx.moveTo(-32, -235); ctx.lineTo(32, -235); ctx.lineTo(62 + fl * .4, -112); ctx.lineTo(-75 + fl, -108 + fl * .3); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-34, -238); ctx.lineTo(34, -238); ctx.lineTo(30, -335); ctx.lineTo(-30, -335); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 15; ctx.strokeStyle = '#0d0618'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-26, -320); ctx.lineTo(-95, -420); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(26, -320); ctx.lineTo(40, -230); ctx.stroke();
  ctx.fillRect(-9, -358, 18, 28); ctx.beginPath(); ctx.ellipse(0, -392, 37, 43, 0, 0, 7); ctx.fill();
  const w1 = Math.sin(lt * 4) * 14, w2 = Math.sin(lt * 4 + 1) * 22, w3 = Math.sin(lt * 4 + 2) * 30;
  ctx.beginPath(); ctx.moveTo(26, -430); ctx.quadraticCurveTo(-30, -452, -48, -405);
  ctx.bezierCurveTo(-110, -390 + w1, -170, -345 + w2, -250, -330 + w3); ctx.bezierCurveTo(-180, -310 + w2, -120, -310 + w1, -34, -340); ctx.closePath(); ctx.fill();
  // ribbon
  ctx.beginPath(); ctx.moveTo(-20, -320); ctx.bezierCurveTo(-80, -300 + w1, -140, -280 + w2, -190, -270 + w3); ctx.lineTo(-185, -255 + w3); ctx.bezierCurveTo(-130, -265 + w2, -80, -285, -20, -305); ctx.fill();
  ctx.restore();
}
function sAnime(lt, T0) {
  const z = 1 + lt * .035;
  camera(540, 1000, z, () => {
    bgGrad([[0, '#140c3c'], [.28, '#4b1f7a'], [.5, '#c73e7a'], [.63, '#ff7a59'], [.7, '#ffc78a']], 0, 1260);
    for (let i = 0; i < 90; i++) { const tw = .4 + .6 * Math.abs(Math.sin(T0 * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${tw * .8})`; ctx.fillRect(h(i) * W, h(i + .5) * 650, 3, 3); }
    radial(540, 1180, 640, 'rgba(255,235,180,.75)', 'rgba(255,150,100,0)');
    rays(540, 1180, 22, T0 * .05, 'rgba(255,220,180,.05)');
    ctx.fillStyle = '#fff4cf'; ctx.beginPath(); ctx.arc(540, 1180, 175, 0, 7); ctx.fill();
    for (let i = 0; i < 6; i++) {
      const cx = ((h(i) * 1400 + T0 * (14 + i * 8)) % 1600) - 260, cy = 380 + i * 120, cw = 260 + h(i + 1) * 260;
      ctx.fillStyle = i < 3 ? 'rgba(120,60,140,.75)' : 'rgba(255,140,150,.75)';
      for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(cx + k * cw * .22, cy - Math.sin(k * 1.3) * 18, cw * .3, 30 + Math.sin(k) * 10, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,220,200,.45)'; ctx.beginPath(); ctx.ellipse(cx + cw * .4, cy + 16, cw * .55, 9, 0, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#3a1d5c'; ctx.beginPath(); ctx.moveTo(-100, 1260); for (let x = -100; x <= W + 100; x += 30) ctx.lineTo(x, 1190 - Math.abs(Math.sin(x * .007)) * 120 - h(Math.floor(x / 30)) * 30); ctx.lineTo(W + 100, 1300); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#28124a'; ctx.fillRect(-100, 1258, W + 200, 900);
    ctx.fillStyle = 'rgba(255,200,160,.35)'; for (let i = 0; i < 9; i++) ctx.fillRect(540 - 160 + h(i) * 40, 1275 + i * 22, 320 - i * 30 + h(i + 1) * 40, 5);
    ctx.fillStyle = '#140b26'; ctx.beginPath(); ctx.moveTo(-100, 2100); ctx.lineTo(-100, 1640); ctx.bezierCurveTo(300, 1600, 600, 1460, 1200, 1400); ctx.lineTo(1200, 2100); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#140b26'; ctx.lineWidth = 4; for (let i = 0; i < 70; i++) { const x = i * 18 - 40, y0 = x < 0 ? 1640 : lerp(1630, 1400, Math.pow(x / 1200, .8)); const sw = Math.sin(T0 * 3 + i * .4) * 12; ctx.beginPath(); ctx.moveTo(x, y0 + 10); ctx.quadraticCurveTo(x + sw * .5, y0 - 20, x + sw, y0 - 35 - h(i) * 25); ctx.stroke(); }
    girl(800, 1450, 1.05, T0);
    ctx.strokeStyle = 'rgba(255,170,200,.5)'; ctx.lineWidth = 3;
  });
  // petals (screen space)
  for (let i = 0; i < 75; i++) {
    const sp = 160 + h(i + 1) * 220, y = ((T0 * sp + h(i + 2) * 2300) % 2300) - 150, x = ((h(i) * 1500 - T0 * 140 + Math.sin(T0 * 1.6 + i) * 50) % 1300 + 1300) % 1300 - 110;
    ctx.save(); ctx.translate(x, y); ctx.rotate(T0 * 2 + i); ctx.scale(1, Math.cos(T0 * 3 + i)); ctx.fillStyle = i % 3 ? '#ffb7c5' : '#ffd6e0';
    ctx.beginPath(); ctx.ellipse(0, 0, 15 + h(i + 3) * 8, 9, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  // lens flare
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  [[.3, 60, 'rgba(255,180,120,.12)'], [.55, 30, 'rgba(255,120,200,.15)'], [.8, 90, 'rgba(150,120,255,.08)']].forEach(([k, r, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(lerp(540, 120, k), lerp(1180, 300, k), r, 0, 7); ctx.fill(); });
  ctx.restore();
  const jp = '夕焼けの約束'; [...jp].forEach((c, i) => T(c, 980, 420 + i * 82, { size: 70, font: 'IPAGothic', color: '#fff', alpha: fi(lt, .4 + i * .08, .4) * .9, glow: 'rgba(255,180,200,.8)', gb: 20 }));
}
// --- pixel art
const ROBOT = ['....k.......', '....y.......', '..kkkkkkk...', '.kgggggggk..', '.kgwkgwkgk..', '.kgggggggk..', '.kggrrrggk..', '..kkkkkkk...', '..kbbbbbk...', '.kbbbybbbk..', '..kbbbbbk...'];
const LEGS = [['..k....k....', '.kk....kk...'], ['...k..k.....', '...kk.kk....']];
const PCOL = { k: '#1d1d2c', y: '#ffd23f', g: '#a8e6cf', w: '#ffffff', r: '#ff5e78', b: '#3d7eff' };
function sPixel(lt, T0) {
  on(PIX, () => {
    const c = ctx; c.imageSmoothingEnabled = false;
    ['#5ac8fa', '#73d2fb', '#8fdcfc', '#aee6fd', '#cdf0ff'].forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * 50, 216, 52); });
    c.fillStyle = '#fff6a8'; c.fillRect(160, 50, 24, 24); c.fillStyle = '#ffe14d'; c.fillRect(164, 54, 16, 16);
    for (let i = 0; i < 4; i++) { const x = Math.floor(((i * 70 - T0 * 8) % 280 + 280) % 280) - 40, y = 30 + i * 22; c.fillStyle = '#fff'; c.fillRect(x, y, 30, 8); c.fillRect(x + 6, y - 6, 16, 6); }
    const off2 = Math.floor(T0 * 14);
    c.fillStyle = '#5bbf72'; for (let x = 0; x < 216; x++) { const X = x + off2; const hh = 30 + Math.floor(12 * Math.abs(Math.sin(X * .03))); c.fillRect(x, 300 - hh, 1, hh); }
    const off = Math.floor(T0 * 40) % 12;
    c.fillStyle = '#3fae49'; c.fillRect(0, 300, 216, 8); c.fillStyle = '#2f8a39'; for (let x = -off; x < 216; x += 12) c.fillRect(x, 300, 4, 3);
    c.fillStyle = '#9c6b3c'; c.fillRect(0, 308, 216, 76); c.fillStyle = '#7a5230'; for (let y = 312; y < 384; y += 12) for (let x = -off + (y % 24 ? 6 : 0); x < 216; x += 12) c.fillRect(x, y, 4, 4);
    // trees + floating platform
    for (let i = 0; i < 4; i++) { const tx = Math.floor(((i * 64 - T0 * 40) % 256 + 256) % 256) - 30; c.fillStyle = '#7a5230'; c.fillRect(tx + 8, 270, 6, 30); c.fillStyle = '#2f8a39'; c.fillRect(tx, 250, 22, 22); c.fillStyle = '#3fae49'; c.fillRect(tx + 3, 244, 16, 10); c.fillRect(tx + 2, 252, 6, 6); }
    const S = 3, plx = Math.floor(40 + 27 + (1.5 - lt) * 110) - 20; c.fillStyle = '#c47a3a'; c.fillRect(plx, 214, 40, 8); c.fillStyle = '#7a5230'; for (let x = 0; x < 40; x += 8) c.fillRect(plx + x, 214, 2, 8); c.fillStyle = '#3fae49'; c.fillRect(plx, 212, 40, 3);
    // character (each sprite pixel = 3x3)
    const jump = lt > 1.0 && lt < 1.65 ? Math.sin(P(lt, 1.0, 1.65) * Math.PI) * 62 : 0;
    const cx = 40, cy = Math.floor(300 - 13 * S - jump);
    const fr = Math.floor(T0 * 10) % 2;
    [...ROBOT, ...LEGS[jump ? 0 : fr]].forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') { c.fillStyle = PCOL[ch]; c.fillRect(cx + x * S, cy + y * S, S, S); } }));
    // gems with collect times
    const gemT = [.5, .9, 1.5, 2.3], gemY = [270, 270, 196, 270]; let score = 0;
    gemT.forEach((gt, i) => {
      const gx = Math.floor(cx + 18 + (gt - lt) * 110);
      if (lt < gt) { const by = gemY[i] + Math.round(Math.sin(T0 * 6 + i) * 2); c.fillStyle = '#ff4fd8'; c.fillRect(gx - 6, by - 2, 13, 6); c.fillRect(gx - 4, by - 6, 9, 4); c.fillRect(gx - 2, by + 4, 5, 4); c.fillStyle = '#ffb3f0'; c.fillRect(gx - 3, by - 5, 3, 2); c.fillStyle = '#fff'; c.fillRect(gx - 2, by - 4, 1, 1); }
      else { score += 100; const k = lt - gt; if (k < .6) { c.globalAlpha = 1 - k / .6; T('+100', cx + 18, gemY[i] - 22 - k * 40, { size: 10, font: 'Pixel', color: '#fff', stroke: '#1d1d2c', sw: 4 }); c.globalAlpha = 1; } }
    });
    T('SCORE ' + String(1200 + score).padStart(6, '0'), 108, 116, { size: 8, font: 'Pixel', color: '#fff', stroke: '#1d1d2c', sw: 3 });
    if (lt > 1.9 && Math.floor(T0 * 8) % 2 === 0) T('LEVEL UP!', 108, 165, { size: 16, font: 'Pixel', color: '#ffd23f', stroke: '#1d1d2c', sw: 5 });
  });
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(PIX.canvas, 0, 0, W, H); ctx.restore();
}
// --- neon synthwave
function sNeon(lt, T0) {
  bgGrad([[0, '#05000f'], [.57, '#2d0050']], 0, 1100);
  for (let i = 0; i < 80; i++) { ctx.fillStyle = `rgba(255,255,255,${.3 + .7 * Math.abs(Math.sin(T0 + i))})`; ctx.fillRect(h(i) * W, h(i + .4) * 900, 2, 2); }
  ctx.save(); ctx.beginPath(); ctx.arc(540, 1000, 280, 0, 7); ctx.clip();
  const g = ctx.createLinearGradient(0, 720, 0, 1100); g.addColorStop(0, '#ffd319'); g.addColorStop(.5, '#ff2975'); g.addColorStop(1, '#8c1eff'); ctx.fillStyle = g; ctx.fillRect(200, 700, 700, 420);
  for (let i = 0; i < 8; i++) { const y = 880 + i * 30 + (T0 * 20) % 30; ctx.fillStyle = '#1a0033'; ctx.fillRect(200, y, 700, 3 + i * 2); }
  ctx.restore();
  ctx.save(); ctx.shadowColor = '#ff2975'; ctx.shadowBlur = 80; ctx.fillStyle = 'rgba(255,41,117,.15)'; ctx.beginPath(); ctx.arc(540, 1000, 280, 0, 7); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#12002a'; ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3; ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(-50, 1100); [[120, 940], [230, 1020], [330, 900], [450, 1100]].forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(600, 1100); [[720, 960], [820, 1030], [940, 880], [1130, 1100]].forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0018'; ctx.fillRect(-100, 1100, W + 200, 900);
  ctx.save(); ctx.strokeStyle = '#ff2bd6'; ctx.shadowColor = '#ff2bd6'; ctx.shadowBlur = 18; ctx.lineWidth = 3;
  for (let i = 0; i < 22; i++) { const z = i + 1 - (T0 * 2.2) % 1; const y = 1100 + 820 / z; if (y > 1990) continue; ctx.globalAlpha = clamp(1.4 - z / 14); ctx.beginPath(); ctx.moveTo(-100, y); ctx.lineTo(W + 100, y); ctx.stroke(); }
  ctx.globalAlpha = 1; for (let j = -14; j <= 14; j++) { ctx.beginPath(); ctx.moveTo(540 + j * 26, 1100); ctx.lineTo(540 + j * 330, 1920); ctx.stroke(); }
  ctx.restore();
  const flick = (lt < .5 && Math.floor(T0 * 20) % 3 === 0) || (lt > 1.9 && lt < 2.0) ? .25 : 1;
  ctx.save(); ctx.globalAlpha = flick; ctx.font = `270px ${fs('Anton')}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.letterSpacing = '14px';
  ctx.shadowColor = '#ff2bd6'; ctx.shadowBlur = 60; ctx.strokeStyle = '#ff2bd6'; ctx.lineWidth = 16; ctx.strokeText('CUAN', 540, 560); ctx.strokeText('CUAN', 540, 560);
  ctx.shadowBlur = 10; ctx.strokeStyle = '#fff0fb'; ctx.lineWidth = 5; ctx.strokeText('CUAN', 540, 560); ctx.restore();
  const s2 = 'MODE AUTOPILOT', n = Math.floor(P(lt, .5, 1.4) * s2.length);
  T(s2.slice(0, n) + (Math.floor(T0 * 4) % 2 ? '_' : ''), 540, 760, { size: 64, weight: 900, color: '#bff9ff', glow: '#00f0ff', gb: 30, ls: 8 });
}
// --- showcase driver
const STYLES = [
  { f: sCrayon, name: 'CRAYON', lab: { font: 'Caveat', size: 130, color: '#e63946', stroke: '#fff', sw: 10 } },
  { f: sGraffiti, name: 'GRAFFITI', lab: { font: 'Marker', size: 110, color: '#ffe600', stroke: '#000', sw: 14 } },
  { f: sManga, name: 'MANGA', lab: { font: 'Bangers', size: 140, color: '#000', stroke: '#fff', sw: 14, ls: 6 } },
  { f: sAnime, name: 'ANIME', lab: { font: 'Anton', size: 130, color: '#fff', glow: '#ff6fa8', gb: 30, ls: 10 } },
  { f: sPixel, name: 'PIXEL ART', lab: { font: 'Pixel', size: 70, color: '#ffd23f', stroke: '#1d1d2c', sw: 14 } },
  { f: sNeon, name: 'NEON', lab: { font: 'Mont', weight: 900, size: 120, color: '#bff9ff', glow: '#00f0ff', gb: 40, ls: 10 } },
];
const SHOW0 = 23.2, STEP = 3.0;
function styleOverlay(i, lt, t) {
  const s = STYLES[i];
  pill(540, 120, `GAYA 0${i + 1}`, { size: 34, bg: 'rgba(0,0,0,.75)', sc: pop(lt, .05, .3) });
  T(s.name, 540, 235, { ...s.lab, sc: pop(lt, .1, .35) });
  pill(540, 1835, '✦ Dibuat dengan Claude', { size: 36, bg: CORAL, sc: pop(lt, .2, .3) });
  for (let k = 0; k < 6; k++) { ctx.fillStyle = k === i ? '#fff' : 'rgba(255,255,255,.35)'; rr(540 - 6 * 28 + k * 56, 1760, 40, 8, 4); ctx.fill(); }
}
function sShowcase(t, lt) {
  if (t < SHOW0) return;
  if (t < 41.2) {
    const i = Math.floor((t - SHOW0) / STEP), l = t - SHOW0 - i * STEP;
    const zin = lerp(1.18, 1, E.out(P(l, 0, .3)));
    camera(540, 960, zin, () => STYLES[i].f(l, t));
    styleOverlay(i, l, t);
  } else {
    const k = Math.floor((t - 41.2) / .15), i = k % 6;
    camera(540, 960, 1.05 + (k % 2) * .05, () => STYLES[i].f(1.6 + (t - 41.2) % .15 * 3, t));
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-100, -100, W + 200, H + 200);
    if (t < 42.1) T('SEMUA GAYA.', 540, 960, { size: 190, font: 'Anton', stroke: '#000', sw: 22, sc: pop(t, 41.2, .25) });
    else T('SATU AI.', 540, 960, { size: 240, font: 'Anton', color: '#fff', stroke: CORAL, sw: 24, sc: pop(t, 42.1, .25) });
    pill(540, 1835, '✦ Dibuat dengan Claude', { size: 36, bg: CORAL });
  }
}
function sIntroShow(t, lt) {
  // 23.2 handled by showcase; nothing here
}

// =====================================================================
// SCENE 6 — COURSE (43 – 52)
// =====================================================================
function techBg(lt) {
  bgGrad([[0, '#0b1026'], [1, '#1d0b3a']]);
  ctx.save(); ctx.globalAlpha = .05; ctx.fillStyle = '#fff'; for (let i = -6; i < 14; i++) { const x = i * 160 + (lt * 60) % 160; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x - 540, H); ctx.lineTo(x - 600, H); ctx.fill(); } ctx.restore();
  for (let i = 0; i < 18; i++) { const x = h(i) * W, y = ((h(i + 1) * H - lt * (20 + h(i + 2) * 40)) % H + H) % H, r = 20 + h(i + 3) * 70; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, i % 2 ? 'rgba(217,119,87,.25)' : 'rgba(120,90,255,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
}
const ITEMS = [
  'Bikin video animasi pakai Claude',
  'Crayon, graffiti, anime, manga & lainnya',
  'Cara pilih niche yang paling cuan',
  'Upload ke YouTube, IG & TikTok',
  'Strategi monetisasi dari nol',
  'BONUS: PDF Prompt siap pakai 🎁',
];
function sCourse(t, lt) {
  techBg(lt);
  if (lt < 1.5) {
    const out = E.in(P(lt, 1.25, 1.5)); ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out * 200);
    T('Dan di kelas ini,', 540, 780, { size: 80, weight: 800, sc: pop(lt, .05) });
    T('kami ajarkan', 540, 890, { size: 80, weight: 800, sc: pop(lt, .3) });
    T('SEMUANYA.', 540, 1070, { size: 210, font: 'Anton', grad: ['#ffd1a8', CORAL, '#ff4f7b'], sc: pop(lt, .6), glow: 'rgba(217,119,87,.6)', gb: 40 });
    ctx.restore(); return;
  }
  const k = E.out(P(lt, 1.4, 1.9)); ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * 300);
  ctx.fillStyle = 'rgba(255,255,255,.07)'; rr(60, 250, 960, 1500, 50); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 3; ctx.stroke();
  pill(540, 340, '🎓 KELAS ONLINE', { size: 36, bg: CORAL });
  T('AI MOTION', 540, 490, { size: 150, font: 'Anton', ls: 4 });
  T('CUAN', 540, 650, { size: 200, font: 'Anton', grad: ['#fff2a8', '#ffcf3f', CORAL], glow: 'rgba(255,190,60,.5)', gb: 40, ls: 10 });
  T('Bikin video animasi viral pakai Claude', 540, 785, { size: 42, weight: 700, color: '#cfd3ff' });
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(140, 850, 800, 3);
  ITEMS.forEach((s, i) => {
    const t0 = 2.2 + i * 1.0, y = 950 + i * 132, a = E.out(P(lt, t0, t0 + .3)); if (a <= 0) return;
    check(170, y, 36, pop(lt, t0, .3));
    T(s, 230 + (1 - a) * 60, y, { size: 40, weight: 800, align: 'left', alpha: a, color: i === 5 ? YEL : '#fff', maxW: 760 });
  });
  ctx.restore();
}

// =====================================================================
// SCENE 7 — HOW IT WORKS + SLEEPING (52 – 60)
// =====================================================================
function pdfIcon(x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(28, -80); ctx.lineTo(60, -48); ctx.lineTo(60, 80); ctx.lineTo(-60, 80); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#cfcfcf'; ctx.beginPath(); ctx.moveTo(28, -80); ctx.lineTo(28, -48); ctx.lineTo(60, -48); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ddd'; for (let i = 0; i < 3; i++) ctx.fillRect(-40, -50 + i * 18, 70 - i * 15, 7);
  ctx.fillStyle = '#e11d48'; rr(-76, 4, 112, 48, 8); ctx.fill(); T('PDF', -20, 30, { size: 36, font: 'Anton' });
  ctx.restore();
}
function sHow(t, lt) {
  if (lt < 4.5) {
    techBg(lt + 9);
    T('Caranya?', 540, 220, { size: 74, weight: 800, sc: pop(lt, .05) });
    T('GAMPANG BANGET.', 540, 340, { size: 130, font: 'Anton', color: YEL, sc: pop(lt, .2) });
    const rows = [600, 1010, 1420];
    const caps = ['Kasih PDF kami ke Claude', 'Pilih topik / niche kamu', 'Video jadi. Tinggal upload!'];
    rows.forEach((ry, i) => {
      const t0 = .5 + i * 1.3, a = pop(lt, t0); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(a);
      ctx.fillStyle = 'rgba(255,255,255,.06)'; rr(60, ry - 170, 960, 360, 36); ctx.fill();
      ctx.fillStyle = CORAL; ctx.beginPath(); ctx.arc(130, ry - 105, 44 * a, 0, 7); ctx.fill(); T(String(i + 1), 130, ry - 102, { size: 54, font: 'Anton', sc: a });
      T(caps[i], 200, ry - 105, { size: 46, weight: 800, align: 'left', maxW: 790 });
      ctx.restore();
    });
    // row1: pdf → claude chat
    if (lt > .5) {
      const ry = 640; const cbx = 560, cby = ry - 60;
      ctx.fillStyle = '#1b1b24'; rr(cbx, cby, 400, 170, 26); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 2; ctx.stroke();
      sparkle(cbx + 46, cby + 42, 24, CORAL, lt); T('Claude', cbx + 80, cby + 44, { size: 32, weight: 800, align: 'left' });
      const k = E.io(P(lt, .7, 1.4));
      if (lt > 1.4) { const done = lt > 2.0; if (!done) for (let d = 0; d < 3; d++) { ctx.fillStyle = `rgba(255,255,255,${.3 + .7 * Math.max(0, Math.sin(lt * 10 - d))})`; ctx.beginPath(); ctx.arc(cbx + 60 + d * 30, cby + 115, 9, 0, 7); ctx.fill(); } else T('✓ Siap!', cbx + 40, cby + 115, { size: 34, weight: 800, align: 'left', color: '#4ade80' }); }
      if (k < 1) pdfIcon(lerp(250, cbx + 340, k), lerp(ry + 40, cby + 100, k) - Math.sin(k * Math.PI) * 120, lerp(1, .45, k), Math.sin(k * Math.PI) * .6);
      else pdfIcon(cbx + 340, cby + 100, .45, 0);
    }
    // row2: chips
    if (lt > 1.8) {
      const ch = ['Sejarah', 'Horor', 'Sains', 'Motivasi', 'Anak-anak', 'Bisnis']; const sel = lt < 3.0 ? Math.floor((lt - 1.8) * 6) % 6 : 0;
      ch.forEach((s, i) => { const x = 230 + (i % 3) * 290, y = 1010 + Math.floor(i / 3) * 100; const sc = pop(lt, 1.9 + i * .06); pill(x, y, s, { size: 38, bg: i === sel ? CORAL : 'rgba(255,255,255,.12)', sc: sc * (i === sel ? 1.08 : 1), stroke: i === sel ? '#fff' : null }); });
    }
    // row3: video render
    if (lt > 3.1) {
      const ry = 1460, vx = 140, vy = ry - 70, vw = 380, vh = 214;
      thumb(CARDS[3], vx, vy, vw, vh, t, 3);
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.arc(vx + vw / 2, vy + vh / 2, 46, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(vx + vw / 2 - 14, vy + vh / 2 - 24); ctx.lineTo(vx + vw / 2 + 24, vy + vh / 2); ctx.lineTo(vx + vw / 2 - 14, vy + vh / 2 + 24); ctx.fill();
      const pk = P(lt, 3.1, 3.8); ctx.fillStyle = 'rgba(255,255,255,.2)'; rr(580, ry - 10, 380, 22, 11); ctx.fill(); ctx.fillStyle = '#4ade80'; rr(580, ry - 10, 380 * pk, 22, 11); ctx.fill();
      T(lt < 3.8 ? `Rendering ${Math.floor(pk * 100)}%` : '', 770, ry - 50, { size: 30, weight: 700, color: '#ccc' });
      if (lt > 3.8) pill(770, ry - 50, '✓ VIDEO JADI!', { size: 46, font: 'Anton', weight: '', bg: '#16a34a', sc: lerp(1.8, 1, E.back(P(lt, 3.8, 4.0))), rot: -.05 });
    }
    return;
  }
  // --- sleeping scene
  const l = lt - 4.5;
  bgGrad([[0, '#040820'], [1, '#1a1f5c']]);
  for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${.25 + .75 * Math.abs(Math.sin(t * 1.5 + i * 3))})`; const s = 2 + h(i + 9) * 3; ctx.fillRect(h(i + 7) * W, h(i + 8) * 1300, s, s); }
  ctx.save(); ctx.beginPath(); ctx.rect(-100, -100, W + 200, H + 200); ctx.arc(205, 255, 80, 0, 7, true); ctx.clip('evenodd');
  ctx.shadowColor = '#fff6c8'; ctx.shadowBlur = 60; ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.arc(170, 280, 90, 0, 7); ctx.fill(); ctx.restore();
  // bed
  const by = 1600; const br = 1 + Math.sin(t * 2.4) * .02;
  ctx.fillStyle = '#5b3a29'; rr(90, by - 40, 900, 330, 30); ctx.fill(); ctx.fillStyle = '#7b4f37'; rr(70, by - 200, 70, 520, 20); ctx.fill();
  ctx.fillStyle = '#f1f1f1'; rr(140, by - 60, 830, 90, 30); ctx.fill();
  ctx.fillStyle = '#e8e3ff'; rr(150, by - 140, 230, 110, 50); ctx.fill();
  ctx.fillStyle = '#f2c9a0'; ctx.beginPath(); ctx.arc(270, by - 120, 62, 0, 7); ctx.fill();
  ctx.fillStyle = '#3b2a20'; ctx.beginPath(); ctx.arc(255, by - 145, 60, Math.PI * .9, Math.PI * 2.1); ctx.fill();
  ctx.strokeStyle = '#3b2a20'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (const ex of [248, 292]) { ctx.beginPath(); ctx.arc(ex, by - 112, 12, .2, Math.PI - .2); ctx.stroke(); }
  ctx.save(); ctx.translate(620, by - 40); ctx.scale(1, br); ctx.fillStyle = '#3d5af1'; rr(-300, -95, 650, 150, 60); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.15)'; for (let i = 0; i < 6; i++) ctx.fillRect(-250 + i * 100, -90, 40, 140); ctx.restore();
  for (let i = 0; i < 3; i++) { const k = ((l * .6 + i / 3) % 1); T('Z', 360 + k * 120 + i * 10, by - 190 - k * 110, { size: 50 + i * 20, font: 'Anton', color: '#bcd0ff', alpha: Math.sin(k * Math.PI) }); }
  const notes = [['🔔', 'Video kamu ditonton', '+25.000 kali hari ini'], ['💰', 'Pendapatan masuk', '+Rp450.000'], ['❤️', 'Subscriber baru', '+3.200 orang'], ['🔥', 'Video kamu', 'masuk TRENDING!']];
  notes.forEach(([ic, a, b], i) => {
    const t0 = .3 + i * .6, k = E.out(P(l, t0, t0 + .35)); if (k <= 0) return; const y = 400 + i * 160;
    ctx.save(); ctx.globalAlpha = k; ctx.translate(0, (1 - k) * -120);
    ctx.fillStyle = 'rgba(255,255,255,.95)'; rr(110, y - 65, 860, 130, 34); ctx.fill();
    ctx.fillStyle = '#f3f3f7'; rr(135, y - 45, 90, 90, 22); ctx.fill(); T(ic, 180, y + 2, { size: 54 });
    T(a, 250, y - 22, { size: 34, weight: 700, color: '#555', align: 'left' }); T(b, 250, y + 24, { size: 42, weight: 900, color: '#111', align: 'left' });
    T('sekarang', 940, y - 22, { size: 26, weight: 600, color: '#999', align: 'right' });
    ctx.restore();
  });
  T('Kamu tidur...', 540, 1090, { size: 76, weight: 900, sc: pop(l, .6) });
  rich([['channel tetap ', '#fff'], ['CUAN 💸', YEL]], 540, 1195, { size: 76, weight: 900, sc: pop(l, 1.6) });
}

// =====================================================================
// SCENE 8 — OFFER + CTA (60 – 68)
// =====================================================================
function coin(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.scale(Math.cos(rot), 1); ctx.fillStyle = '#b8860b'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(0, 0, r * .84, 0, 7); ctx.fill(); T('$', 0, 2, { size: r * 1.1, font: 'Anton', color: '#b8860b' }); ctx.restore(); }
function sOffer(t, lt) {
  if (lt < 1.3) {
    bgFill('#e11d48');
    ctx.save(); ctx.globalAlpha = .12; ctx.fillStyle = '#000'; for (let i = -10; i < 20; i++) { const x = i * 120 + (lt * 300) % 120; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 50, 0); ctx.lineTo(x - 900, H); ctx.lineTo(x - 950, H); ctx.fill(); } ctx.restore();
    const s = lerp(2.5, 1, E.back(P(lt, 0, .25)));
    T('BAYAR', 540, 830, { size: 290, font: 'Anton', sc: s, shadow: { c: '#7f0d26', x: 14, y: 16 } });
    T('SEKALI.', 540, 1090, { size: 290, font: 'Anton', color: YEL, sc: lt > .3 ? lerp(2.5, 1, E.back(P(lt, .3, .55))) : 0, shadow: { c: '#7f0d26', x: 14, y: 16 } });
    return;
  }
  if (lt < 2.8) {
    const l = lt - 1.3; bgFill('#0a0705'); rays(540, 940, 20, l * .4, 'rgba(255,200,60,.1)'); radial(540, 940, 800, 'rgba(255,190,60,.35)', 'rgba(0,0,0,0)');
    for (let i = 0; i < 40; i++) { const a = h(i) * 6.28, v = 900 + h(i + 1) * 1300; const x = 540 + Math.cos(a) * v * l, y = 940 + Math.sin(a) * v * l * .8 + 1400 * l * l; coin(x, y, 26 + h(i + 2) * 22, l * 10 + i); }
    T('CUAN', 540, 820, { size: 320, font: 'Anton', grad: ['#fff6c0', '#ffd34d', '#e09b00'], glow: 'rgba(255,200,60,.7)', gb: 60, sc: lerp(2.4, 1, E.back(P(l, 0, .25))) });
    T('SEUMUR HIDUP.', 540, 1060, { size: 150, font: 'Anton', sc: pop(l, .3), ls: 4 });
    return;
  }
  // final CTA
  const l = lt - 2.8;
  bgGrad([[0, '#0b0b16'], [1, '#22102e']]);
  rays(540, 1500, 24, l * .2, 'rgba(255,200,80,.045)');
  radial(540, 1500, 800, 'rgba(217,119,87,.28)', 'rgba(0,0,0,0)');
  for (let i = 0; i < 30; i++) { const y = ((h(i) * H - l * (60 + h(i + 1) * 120)) % H + H) % H; ctx.fillStyle = `rgba(255,210,120,${.2 + h(i + 2) * .5})`; ctx.beginPath(); ctx.arc(h(i + 3) * W, y, 2 + h(i + 4) * 4, 0, 7); ctx.fill(); }
  pill(540, 190, '⚠️ PROMO TERBATAS', { size: 40, bg: '#e11d48', sc: pop(l, .05) * (1 + .05 * Math.sin(l * 10)) });
  T('AI MOTION CUAN', 540, 360, { size: 140, font: 'Anton', grad: ['#fff2a8', '#ffcf3f', CORAL], sc: pop(l, .15), maxW: 980, ls: 2 });
  T('Kelas lengkap bikin video animasi viral pakai Claude', 540, 465, { size: 38, weight: 700, color: '#d6d8ff', alpha: fi(l, .3), maxW: 960 });
  [['♾️', 'Akses SELAMANYA'], ['📄', 'PDF Prompt siap pakai'], ['🔄', 'Update materi gratis']].forEach(([ic, s], i) => {
    const sc = pop(l, .5 + i * .3); rich([[ic + '  ', '#fff'], [s, '#fff']], 540, 580 + i * 80, { size: 46, weight: 800, sc });
  });
  rich([['Investasi ', '#fff'], ['SEKALI', CORAL], [', cuan ', '#fff'], ['SEUMUR HIDUP', YEL]], 540, 860, { size: 44, weight: 900, sc: pop(l, 1.4) });
  // countdown
  const cdA = pop(l, 1.8); if (cdA > 0) {
    ctx.save(); ctx.translate(540, 1080); ctx.scale(cdA, cdA);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; rr(-450, -130, 900, 260, 34); ctx.fill(); ctx.strokeStyle = 'rgba(255,80,110,.6)'; ctx.lineWidth = 3; ctx.stroke();
    T('HARGA PROMO BERAKHIR DALAM', 0, -82, { size: 36, weight: 900, color: '#ff6b81', ls: 3 });
    const rem = 14 * 60 + 59 - Math.floor(l) , mm = Math.floor(rem / 60), ss = rem % 60, cs = 99 - Math.floor((l * 100) % 100);
    const parts = ['00', String(mm).padStart(2, '0'), String(ss).padStart(2, '0'), String(cs).padStart(2, '0')];
    parts.forEach((p, i) => { const x = -300 + i * 200; ctx.fillStyle = '#000'; rr(x - 80, -38, 160, 140, 18); ctx.fill(); T(p, x, 34, { size: 104, font: 'Anton', color: i === 3 ? '#ff6b81' : '#fff' }); if (i < 3) T(':', x + 100, 26, { size: 80, font: 'Anton', color: '#888' }); });
    ctx.restore();
  }
  // button
  const bA = pop(l, 2.3); if (bA > 0) {
    const pul = 1 + .045 * Math.sin(l * 9); ctx.save(); ctx.translate(540, 1420); ctx.scale(bA * pul, bA * pul);
    ctx.shadowColor = 'rgba(34,197,94,.8)'; ctx.shadowBlur = 60;
    const g = ctx.createLinearGradient(0, -90, 0, 90); g.addColorStop(0, '#4ade80'); g.addColorStop(1, '#15803d'); ctx.fillStyle = g; rr(-430, -95, 860, 190, 95); ctx.fill(); ctx.shadowBlur = 0;
    ctx.save(); rr(-430, -95, 860, 190, 95); ctx.clip(); const sx = ((l * 900) % 2400) - 900; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(sx, -100); ctx.lineTo(sx + 80, -100); ctx.lineTo(sx + 20, 100); ctx.lineTo(sx - 60, 100); ctx.fill(); ctx.restore();
    T('DAFTAR SEKARANG', 0, 6, { size: 104, font: 'Anton', ls: 3, shadow: { c: 'rgba(0,60,20,.6)', x: 0, y: 6 } });
    ctx.restore();
    T('👆', 820, 1580 + Math.abs(Math.sin(l * 6)) * -30, { size: 120, sc: pop(l, 2.6) });
  }
  rich([['👇 Klik link di bawah ', '#fff'], ['sebelum kuota habis!', YEL]], 540, 1660, { size: 40, weight: 800, sc: pop(l, 3.0) });
  T('*Iklan ini juga 100% dibuat dengan Claude', 540, 1830, { size: 30, weight: 700, color: 'rgba(255,255,255,.65)', alpha: fi(l, 3.5) });
}

// =====================================================================
// TIMELINE + POST
// =====================================================================
const SCENES = [
  [0, 3.5, (t) => sHook(t)],
  [3.5, 11, (t) => sFeed(t, t - 3.5)],
  [11, 17.5, (t) => sMoney(t, t - 11)],
  [17.5, 23.2, (t) => sTwist(t, t - 17.5)],
  [23.2, 43, (t) => sShowcase(t, t - 23.2)],
  [43, 52, (t) => sCourse(t, t - 43)],
  [52, 60, (t) => sHow(t, t - 52)],
  [60, 99, (t) => sOffer(t, t - 60)],
];
function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.setLineDash([]);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sk = shake(t);
  ctx.save(); ctx.translate((h(t * 91.7) - .5) * sk, (h(t * 37.3 + 5) - .5) * sk);
  for (const s of SCENES) if (t >= s[0] && t < s[1]) { s[2](t); break; }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.drawImage(VIG, 0, 0);
  const f = Math.floor(t * 30); ctx.save(); ctx.globalAlpha = .05; ctx.globalCompositeOperation = 'overlay'; ctx.translate(-h(f) * 512, -h(f + .5) * 512); ctx.fillStyle = GRAINPAT; ctx.fillRect(0, 0, W + 512, H + 512); ctx.restore();
  const fa = flash(t); if (fa > 0) { ctx.fillStyle = `rgba(255,255,255,${fa})`; ctx.fillRect(0, 0, W, H); }
  // short fade in at start
  if (t < .08) { ctx.fillStyle = `rgba(0,0,0,${1 - t / .08})`; ctx.fillRect(0, 0, W, H); }
}
window.renderFrame = render;
window.DURATION = DUR;
(async () => {
  const fams = ['400 40px Anton', '400 40px Bangers', '400 40px Marker', '400 40px Caveat', '400 40px Pixel', '600 40px Mont', '700 40px Mont', '800 40px Mont', '900 40px Mont'];
  await Promise.all(fams.map(f => document.fonts.load(f, 'AaÁ0')));
  await document.fonts.load('40px IPAGothic', 'ドド夕焼け');
  render(0);
  window.READY = true;
  // live preview when opened in a browser (not during rendering)
  if (!navigator.webdriver) { const t0 = performance.now(); const loop = () => { render(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); }; loop(); }
})();
