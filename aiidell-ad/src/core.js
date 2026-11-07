// ===== Core utilities: easing, timing, drawing helpers =====
const W = 1080, H = 1920, FPS = 30, DURATION = 50;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const TAU = Math.PI * 2;

const E = {
  lin: t => t,
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outBackS: t => { const c1 = 1.1, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: t => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1),
};

// fade-in at a over fi seconds, fade-out ending at b over fo seconds
function win(t, a, b, fi = 0.35, fo = 0.35) {
  return Math.min(E.out(seg(t, a, a + fi)), 1 - E.in(seg(t, b - fo, b)));
}
// damped spring response to a step at time a (0 -> 1 with overshoot)
function spring(t, a, freq = 2.2, damp = 5.5) {
  const x = t - a;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(TAU * freq * x);
}

function hash(n) { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
function sn(x, seed = 0) { // smooth 1D value noise in [-1,1]
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 101.3), hash(i + 1 + seed * 101.3), u) * 2 - 1;
}
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// blink: returns lid closure 0..1 at regular-ish intervals
function blink(t, seed = 0, period = 3.6) {
  const off = hash(seed) * period;
  const k = Math.floor((t + off) / period);
  const jitter = hash(k * 7.7 + seed) * 1.2;
  const local = (t + off) - k * period - jitter;
  if (local < 0 || local > 0.18) return 0;
  return Math.sin((local / 0.18) * Math.PI);
}

// ---------- path helpers ----------
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function heartPath(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y + s * 0.3);
  c.bezierCurveTo(x, y - s * 0.05, x - s * 0.5, y - s * 0.15, x - s * 0.5, y + s * 0.2);
  c.bezierCurveTo(x - s * 0.5, y + s * 0.55, x - s * 0.1, y + s * 0.7, x, y + s * 0.95);
  c.bezierCurveTo(x + s * 0.1, y + s * 0.7, x + s * 0.5, y + s * 0.55, x + s * 0.5, y + s * 0.2);
  c.bezierCurveTo(x + s * 0.5, y - s * 0.15, x, y - s * 0.05, x, y + s * 0.3);
  c.closePath();
}
function drawHeart(c, x, y, s, col = '#ff4f8b', alpha = 1, glow = true) {
  if (alpha <= 0 || s <= 0) return;
  c.save();
  c.globalAlpha *= alpha;
  if (glow) { c.shadowColor = col; c.shadowBlur = s * 0.6; }
  const g = c.createLinearGradient(x - s / 2, y, x + s / 2, y + s);
  g.addColorStop(0, '#ffa3c4'); g.addColorStop(0.5, col); g.addColorStop(1, '#d6246b');
  c.fillStyle = g;
  heartPath(c, x, y - s * 0.45, s);
  c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.fillStyle = 'rgba(255,255,255,0.65)';
  c.beginPath(); c.ellipse(x - s * 0.24, y - s * 0.14, s * 0.1, s * 0.06, -0.6, 0, TAU); c.fill();
  c.restore();
}
function sparkle(c, x, y, s, col = '#fff6d8', alpha = 1, rot = 0) {
  if (alpha <= 0 || s <= 0) return;
  c.save();
  c.globalAlpha *= alpha;
  c.translate(x, y); c.rotate(rot);
  c.shadowColor = col; c.shadowBlur = s * 1.5;
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(0, -s);
  c.quadraticCurveTo(s * 0.12, -s * 0.12, s, 0);
  c.quadraticCurveTo(s * 0.12, s * 0.12, 0, s);
  c.quadraticCurveTo(-s * 0.12, s * 0.12, -s, 0);
  c.quadraticCurveTo(-s * 0.12, -s * 0.12, 0, -s);
  c.fill();
  c.fillStyle = '#ffffff';
  c.beginPath(); c.arc(0, 0, s * 0.18, 0, TAU); c.fill();
  c.restore();
}
function glowDot(c, x, y, r, col, alpha = 1) {
  if (alpha <= 0) return;
  c.save();
  c.globalAlpha *= alpha;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g;
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.restore();
}
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function mixHex(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], t)).toString(16).padStart(2, '0')).join('');
}

// ---------- text ----------
function txt(c, s, x, y, o = {}) {
  c.save();
  c.font = `${o.weight || 600} ${o.size || 40}px ${o.font || 'Poppins'}`;
  c.textAlign = o.align || 'center';
  c.textBaseline = o.base || 'middle';
  if (o.ls) c.letterSpacing = o.ls + 'px';
  c.globalAlpha *= (o.alpha === undefined ? 1 : o.alpha);
  if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = o.blur || 12; c.shadowOffsetY = o.sy || 3; }
  if (o.stroke) { c.lineJoin = 'round'; c.lineWidth = o.sw || 8; c.strokeStyle = o.stroke; c.strokeText(s, x, y); c.shadowColor = 'transparent'; }
  c.fillStyle = o.color || '#fff';
  c.fillText(s, x, y);
  c.restore();
}
// text with per-letter pop-in animation
function popText(c, s, x, y, p, o = {}) {
  c.save();
  c.font = `${o.weight || 700} ${o.size || 60}px ${o.font || 'Fredoka'}`;
  if (o.ls) c.letterSpacing = o.ls + 'px';
  const total = c.measureText(s).width;
  let cx = x - total / 2;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const ch = s[i];
    const w = c.measureText(ch).width + (o.ls || 0);
    const lp = clamp(p * (1 + n * 0.06) - i * 0.06);
    const k = E.outBack(lp);
    if (lp > 0) {
      c.save();
      c.translate(cx + w / 2, y + (1 - k) * 40);
      c.scale(k, k);
      c.rotate((1 - k) * 0.3);
      c.globalAlpha *= clamp(lp * 3);
      txt(c, ch, 0, 0, Object.assign({}, o, { align: 'center', ls: 0 }));
      c.restore();
    }
    cx += w;
  }
  c.restore();
}

// soft drop shadow ellipse
function groundShadow(c, x, y, w, h, a = 0.3) {
  c.save();
  const g = c.createRadialGradient(x, y, 0, x, y, w);
  g.addColorStop(0, `rgba(20,10,40,${a})`); g.addColorStop(1, 'rgba(20,10,40,0)');
  c.fillStyle = g;
  c.translate(x, y); c.scale(1, h / w); c.translate(-x, -y);
  c.beginPath(); c.arc(x, y, w, 0, TAU); c.fill();
  c.restore();
}
