// ===== Characters: Disney-inspired stylised 3D-look adults drawn with layered gradients =====
// Local space: origin at the neck base, head ≈ y -350..-40 (chin ≈ -44), torso down to y 560.
// Key light from the upper left; warm subsurface tones on the shadow side.

// ---------- palettes ----------
// skin: mid tone · light: lit plane · dark: form shadow · deep: occlusion/creases · sss: warm terminator
const PAL = {
  L: { // Rahul – the hard way: hoodie, messy curls, stubble. Light wheatish Indian.
    skin: '#e4b591', light: '#f8dcc4', dark: '#c08765', deep: '#8e5a40', sss: '#e9876c', blushC: '#e8907e', lip: '#b9715f',
    hair: '#17100e', hairHi: '#5c4238', hairSheen: '#8c6c5e', iris: '#3b2213', irisHi: '#9c6a3a',
    top: '#5d6e92', topDark: '#3e4a6a', topHi: '#8396bd', inner: '#e6dfd2',
    phone: '#2b2f3a', style: 'curly', beard: 'stubble', outfit: 'hoodie', seed: 1,
    face: {
      shape: { cw: 100, jx: 86, jy: -95, chw: 30, chy: -44, top: -292 },
      eye: { w: 22, top: 15.5, bot: 9, tilt: -0.5, ir: 12.2, peak: 0.42, lash: 2.8, crease: 7.5, creaseA: 0.55, deep: 0.34 },
      brow: { x0: 15, x1: 71, y: -206, th: 12.5, arch: 4, tilt: 2.5, bushy: 1 },
      nose: { tipR: 14.5, alaW: 16.5, bridge: 0.8, top: -200, tipY: -140 },
      ex: 44, ey: -170, mouthY: -101, ridge: 1,
    },
  },
  R: { // Arjun – the AiiDell way: navy blazer, quiff, groomed beard. Fair wheatish Indian.
    skin: '#ebc09e', light: '#fde2cc', dark: '#c78d69', deep: '#955f40', sss: '#ec8a72', blushC: '#ec9282', lip: '#bf7566',
    hair: '#130c0a', hairHi: '#5e443a', hairSheen: '#9a7a6a', iris: '#381f11', irisHi: '#a87443',
    top: '#2d3b66', topDark: '#1c2546', topHi: '#53669e', inner: '#f6f2fc',
    phone: '#f1c9b5', style: 'quiff', beard: 'full', outfit: 'blazer', accent: '#ff6b9e', seed: 4,
    face: {
      shape: { cw: 99, jx: 88, jy: -100, chw: 27, chy: -43, top: -292 },
      eye: { w: 22, top: 15.5, bot: 8.5, tilt: 0.6, ir: 12.2, peak: 0.4, lash: 2.9, crease: 7, creaseA: 0.55, deep: 0.3 },
      brow: { x0: 16, x1: 72, y: -207, th: 11, arch: 7, tilt: 1.5, bushy: 0.6 },
      nose: { tipR: 12.5, alaW: 14, bridge: 1, top: -203, tipY: -141 },
      ex: 44, ey: -170, mouthY: -101, ridge: 1,
    },
  },
  T: { // AiiDell Indonesia team member: pink polo + headset. Light golden Indonesian.
    skin: '#f0c7a3', light: '#fee7d2', dark: '#cf9874', deep: '#9e6b4b', sss: '#f08d70', blushC: '#f0968a', lip: '#c47868',
    hair: '#14100e', hairHi: '#4e3e38', hairSheen: '#7e6c66', iris: '#37200f', irisHi: '#9a6c40',
    top: '#ff6a9e', topDark: '#d8467f', topHi: '#ffa2c4', inner: '#ffffff',
    phone: '#333a44', style: 'short', beard: 'none', outfit: 'polo', headset: true, seed: 9,
    face: {
      shape: { cw: 101, jx: 84, jy: -92, chw: 31, chy: -45, top: -290 },
      eye: { w: 22, top: 14, bot: 8.5, tilt: 2, ir: 11.6, peak: 0.52, lash: 2.8, crease: 3.6, creaseA: 0.28, deep: 0.12, soft: 1 },
      brow: { x0: 17, x1: 68, y: -208, th: 9, arch: 4, tilt: 0, bushy: 0.3 },
      nose: { tipR: 12.5, alaW: 15.5, bridge: 0.35, top: -182, tipY: -139 },
      ex: 43, ey: -169, mouthY: -100, ridge: 0.25,
    },
  },
};
const WPAL = {
  P: { // Putri – the girlfriend in Indonesia. Fair, warm-peach Indonesian; modern kebaya.
    skin: '#e9b893', light: '#f6d3b8', dark: '#c98d68', deep: '#9f6a4c', sss: '#ee8a6c', blushC: '#f0928e', lip: '#d36a78',
    hair: '#110b0a', hairHi: '#3e3238', hairSheen: '#8a7d92', iris: '#3a2214', irisHi: '#aa7c4c',
    top: '#f9c6d7', topDark: '#eaa1bb', topHi: '#ffe3ee', cream: '#fbf1e1', gold: '#d6aa5c', goldHi: '#f6dc96',
    flower: true, seed: 13,
    face: {
      shape: { cw: 98, jx: 72, jy: -84, chw: 19, chy: -45, top: -288, fem: true },
      eye: { w: 24, top: 19.5, bot: 11, tilt: 3, ir: 15, peak: 0.56, lash: 5, crease: 4, creaseA: 0.3, deep: 0.1, fem: true, soft: 1 },
      brow: { x0: 16, x1: 72, y: -213, th: 7, arch: 7, tilt: 1.5, fem: true },
      nose: { tipR: 10, alaW: 12, bridge: 0.22, top: -174, tipY: -137, fem: true },
      ex: 41, ey: -171, mouthY: -99, ridge: 0,
    },
  },
  H: { // AiiDell team member in a hijab, with headset.
    skin: '#e7b591', light: '#f5d2b6', dark: '#c78b66', deep: '#9d684a', sss: '#ec886a', blushC: '#ee908c', lip: '#cb6676',
    hair: '#1b1210', hairHi: '#5b3e33', hairSheen: '#8a6a5c', iris: '#3a2214', irisHi: '#a87a4c',
    top: '#ff6a9e', topDark: '#d8467f', topHi: '#ffa2c4', cream: '#fbf1e1', gold: '#d6aa5c', goldHi: '#f6dc96',
    hijab: '#bba6ff', hijabDark: '#8b74e4', headset: true, seed: 8,
    face: {
      shape: { cw: 97, jx: 72, jy: -84, chw: 19, chy: -45, top: -288, fem: true },
      eye: { w: 23, top: 18.5, bot: 10.5, tilt: 2.5, ir: 14.5, peak: 0.55, lash: 4.8, crease: 4, creaseA: 0.3, deep: 0.1, fem: true, soft: 1 },
      brow: { x0: 16, x1: 71, y: -213, th: 7, arch: 6, tilt: 1.5, fem: true },
      nose: { tipR: 10, alaW: 12, bridge: 0.22, top: -174, tipY: -137, fem: true },
      ex: 40, ey: -171, mouthY: -99, ridge: 0,
    },
  },
};

// mood -> facial parameters
function faceParams(o) {
  const m = Object.assign({ stress: 0, happy: 0, surprise: 0, tired: 0 }, o.mood || {});
  const b = o.blink || 0;
  return {
    open: clamp(0.86 - m.tired * 0.45 + m.surprise * 0.24 - m.happy * 0.08 - b, 0, 1.12),
    squint: clamp(m.happy * 0.5 - m.surprise * 0.4 + (o.extraSquint || 0)),
    raise: m.surprise * 1.1 + m.happy * 0.35 - m.tired * 0.35,
    worry: clamp(m.stress * 1 + m.tired * 0.4),
    smile: clamp(m.happy * 1.05 - m.stress * 0.75 - m.tired * 0.35, -1, 1),
    mopen: clamp(m.surprise * 0.75 + m.happy * 0.32 + m.stress * 0.12, 0, 1),
    mw: 25 + m.happy * 9 + m.surprise * -6,
    blush: clamp(m.happy * 0.9),
    sweat: clamp((m.stress - 0.45) * 2),
    bags: clamp(m.tired * 1 + m.stress * 0.4),
    pupil: 1 + m.surprise * -0.18 + m.happy * 0.1,
  };
}

// ---------- small helpers ----------
function hex6(h) { // normalise #rgb -> #rrggbb so mixHex/hexA never produce NaN
  if (typeof h !== 'string') return '#888888';
  if (h.length === 4) return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  return h.slice(0, 7);
}
function shade(h, k) { return k >= 0 ? mixHex(hex6(h), '#ffffff', k) : mixHex(hex6(h), '#000000', -k); }
function fistAmt(v) { return v === true ? 1 : (+v ? clamp(+v) : 0); }

// tapered capsule (circle A radius ra -> circle B radius rb)
function capsulePath(c, ax, ay, ra, bx, by, rb, fresh = true) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 0.001, th = Math.atan2(dy, dx);
  const ph = Math.acos(clamp((ra - rb) / d, -1, 1));
  if (fresh) c.beginPath();
  c.moveTo(ax + Math.cos(th + ph) * ra, ay + Math.sin(th + ph) * ra);
  c.arc(ax, ay, ra, th + ph, th + TAU - ph);
  c.arc(bx, by, rb, th - ph, th + ph);
  c.closePath();
}

// batik kawung motif (four radial ovals around each lattice point)
function kawung(c, x0, y0, w, h, cell, ink, dot) {
  c.save();
  for (let gy = -1; gy * cell <= h + cell; gy++) for (let gx = -1; gx * cell <= w + cell; gx++) {
    const cx = x0 + gx * cell + (gy % 2 ? cell / 2 : 0), cy = y0 + gy * cell;
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2;
      const px = cx + Math.cos(a) * cell * 0.25, py = cy + Math.sin(a) * cell * 0.25;
      c.fillStyle = ink; c.beginPath(); c.ellipse(px, py, cell * 0.22, cell * 0.14, a, 0, TAU); c.fill();
      if (dot) { c.fillStyle = dot; c.beginPath(); c.arc(px, py, cell * 0.04, 0, TAU); c.fill(); }
    }
    if (dot) { c.fillStyle = dot; c.beginPath(); c.arc(cx, cy, cell * 0.06, 0, TAU); c.fill(); }
  }
  c.restore();
}

// ---------- natural idle motion (smooth, eased, no jitter) ----------
function idleAt(t, seed, amt) {
  const bp = t * TAU / 4.4 + seed * 1.7;                        // ~13.6 breaths / min
  const breath = Math.sin(bp) * 0.8 + Math.sin(bp * 2 + 0.6) * 0.12; // slightly asymmetric inhale/exhale
  return {
    breath: breath * amt,
    lean: (sn(t * 0.16, seed + 1) * 0.006 + sn(t * 0.41, seed + 2) * 0.0018) * amt,   // weight shift
    tilt: (sn(t * 0.23, seed + 3) * 0.014 + sn(t * 0.57, seed + 4) * 0.004) * amt,    // head drift
    hx: sn(t * 0.19, seed + 5) * 1.8 * amt,
    hy: (sn(t * 0.31, seed + 6) * 1.1 - breath * 0.9) * amt,
  };
}
function idleMotion(t, seed, amt = 1) {
  const M = idleAt(t, seed, amt);
  const lag = idleAt(t - 0.32, seed, amt);
  // hair follows the head with a little lag + a soft breeze
  M.hair = (lag.tilt - M.tilt) * 420 + (lag.hx - M.hx) * 0.8 + Math.sin(t * 0.83 + seed) * 0.9 * amt;
  return M;
}

// --- 2 bone IK (kept for API): returns the elbow that bends outward & down, never inverted
function ik(S, Hn, L1, L2, bendSign) {
  const dx = Hn[0] - S[0], dy = Hn[1] - S[1];
  let d = Math.hypot(dx, dy);
  d = clamp(d, Math.abs(L1 - L2) + 0.5, L1 + L2 - 0.5);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const th = Math.atan2(dy, dx);
  const side = bendSign > 0 ? -1 : 1;
  const e1 = [S[0] + Math.cos(th + a) * L1, S[1] + Math.sin(th + a) * L1];
  const e2 = [S[0] + Math.cos(th - a) * L1, S[1] + Math.sin(th - a) * L1];
  const sc = e => side * (e[0] - S[0]) + 0.6 * (e[1] - S[1]);
  return sc(e1) >= sc(e2) ? e1 : e2;
}
// pseudo-3D two-bone IK: the hand sits z units in front of the shoulder plane and the elbow
// is pulled out, down and back (pole), then projected. Gives natural foreshortening.
function ik3(S, Hn, L1, L2, side, z) {
  const v = [Hn[0] - S[0], Hn[1] - S[1], z];
  const d = Math.hypot(v[0], v[1], v[2]) || 1;
  const dc = clamp(d, Math.abs(L1 - L2) + 1, L1 + L2 - 0.5);
  const ax = [v[0] / d, v[1] / d, v[2] / d];
  const a = (L1 * L1 - L2 * L2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  let p = [side * 0.66, 0.6, -0.46];
  const dt = p[0] * ax[0] + p[1] * ax[1] + p[2] * ax[2];
  p = [p[0] - dt * ax[0], p[1] - dt * ax[1], p[2] - dt * ax[2]];
  const pl = Math.hypot(p[0], p[1], p[2]);
  if (pl < 1e-3) return ik(S, Hn, L1, L2, side > 0 ? -1 : 1);
  const E = [S[0] + ax[0] * a + p[0] / pl * h, S[1] + ax[1] * a + p[1] / pl * h];
  // safety: never let the elbow fold inward toward the body/face
  if (side * (E[0] - S[0]) < -6) return ik(S, Hn, L1, L2, side > 0 ? -1 : 1);
  return E;
}

function skinGrad(c, P, cx, cy, r) {
  const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r * 1.15);
  g.addColorStop(0, P.light); g.addColorStop(0.55, P.skin); g.addColorStop(1, P.dark);
  return g;
}

// ---------- face construction ----------
function facePath(c, S) {
  if (!S || S === true) S = S === true ? WPAL.P.face.shape : PAL.R.face.shape;
  const { cw, jx, jy, chw, chy } = S, top = S.top || -290;
  c.beginPath();
  c.moveTo(0, top);
  c.bezierCurveTo(cw * 0.7, top, cw, top + 42, cw, -192);
  if (S.fem) {
    c.bezierCurveTo(cw, -146, jx + 16, jy - 30, jx, jy);
    c.bezierCurveTo(jx - 16, jy + 22, chw + 18, chy - 1, chw, chy);
  } else {
    c.bezierCurveTo(cw, -150, jx + 8, jy - 26, jx, jy);
    c.bezierCurveTo(jx - 12, jy + 26, chw + 20, chy + 1, chw, chy + 0.5);
  }
  c.bezierCurveTo(chw * 0.5, chy + 2, -chw * 0.5, chy + 2, -chw, chy + 0.5);
  if (S.fem) {
    c.bezierCurveTo(-chw - 18, chy - 1, -jx + 16, jy + 22, -jx, jy);
    c.bezierCurveTo(-jx - 16, jy - 30, -cw, -146, -cw, -192);
  } else {
    c.bezierCurveTo(-chw - 20, chy + 1, -jx + 12, jy + 26, -jx, jy);
    c.bezierCurveTo(-jx - 8, jy - 26, -cw, -150, -cw, -192);
  }
  c.bezierCurveTo(-cw, top + 42, -cw * 0.7, top, 0, top);
  c.closePath();
}

function drawEar(c, P, s, x, y, fem) {
  const rx = fem ? 14 : 16.5, ry = fem ? 24 : 27.5;
  c.save();
  c.translate(x, y); c.rotate(s * 0.12);
  const g = c.createRadialGradient(-s * 4, -6, 2, 0, 0, ry * 1.1);
  g.addColorStop(0, P.light); g.addColorStop(0.5, mixHex(P.skin, P.sss, 0.25)); g.addColorStop(1, mixHex(P.dark, P.sss, 0.2));
  c.fillStyle = g;
  c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fill();
  // helix & concha
  c.strokeStyle = hexA(P.deep, 0.55); c.lineWidth = 2.6; c.lineCap = 'round';
  c.beginPath(); c.ellipse(s * 1.5, -1, rx * 0.55, ry * 0.62, 0, s > 0 ? -1.3 : Math.PI - 1.9, s > 0 ? 1.9 : Math.PI + 1.3); c.stroke();
  c.fillStyle = hexA(P.deep, 0.28);
  c.beginPath(); c.ellipse(s * -1, 2, rx * 0.32, ry * 0.32, 0, 0, TAU); c.fill();
  c.restore();
}

// eye with almond construction: inner/outer corners, upper & lower lid curves.
function drawEye(c, x, y, side, F, o, P, E_) {
  const w = E_.w, ir = E_.ir;
  const look = o.look || {};
  const lx = clamp(look.x || 0, -1.2, 1.2), ly = clamp(look.y || 0, -1.2, 1.2);
  let lidF = clamp(F.open / 0.86, 0, 1.3);
  lidF *= 1 - clamp(ly, 0, 1) * 0.2;                 // lids follow the gaze down
  lidF = Math.min(1.3, lidF + clamp(-ly, 0, 1) * 0.06);
  const open = Math.min(lidF, 1);
  const topH = E_.top * (1 + Math.max(0, lidF - 1) * 0.9);
  const botH = E_.bot * (1 - F.squint * 0.75) + Math.max(0, lidF - 1) * 2;
  const xi = x - side * w, xo = x + side * w;
  const yi = y + 1, yo = y - (E_.tilt || 0);
  const kU = Math.log(0.5) / Math.log(E_.peak || 0.45), kL = Math.log(0.5) / Math.log(0.56);
  const N = 18, up = [], lo = [], full = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, px = lerp(xi, xo, u), base = lerp(yi, yo, u);
    const su = Math.sin(Math.PI * Math.pow(u, kU)), sl = Math.sin(Math.PI * Math.pow(u, kL));
    const lower = base + botH * sl;
    const upperFull = base - topH * su;
    full.push([px, upperFull]); lo.push([px, lower]);
    up.push([px, lerp(lower - 0.6 * sl, upperFull, open)]);
  }
  // socket depth (brow-ridge shadow for deep-set eyes; softer for Indonesian eyes)
  c.save();
  const dep = E_.deep || 0.12;
  // soft shadow tucked under the brow / into the inner corner (no hard "goggle" ring)
  const sx0 = x - side * w * 0.2, sy0 = y - E_.top * 0.85;
  const sock = c.createRadialGradient(sx0, sy0, 2, sx0, sy0, w * 1.25);
  sock.addColorStop(0, hexA(P.deep, dep * 0.75)); sock.addColorStop(0.55, hexA(P.deep, dep * 0.3)); sock.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = sock;
  c.beginPath(); c.ellipse(sx0, sy0, w * 1.25, w * 0.8, 0, 0, TAU); c.fill();
  const ic = c.createRadialGradient(xi, y - 1, 1, xi, y - 1, 10);
  ic.addColorStop(0, hexA(P.deep, dep * 0.7 + 0.06)); ic.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = ic; c.beginPath(); c.arc(xi, y - 1, 10, 0, TAU); c.fill();
  if (F.bags > 0.05) {
    const bg = c.createRadialGradient(x, y + E_.bot + 6, 2, x, y + E_.bot + 6, w);
    bg.addColorStop(0, hexA('#7a4a5a', 0.18 * F.bags)); bg.addColorStop(1, hexA('#7a4a5a', 0));
    c.fillStyle = bg; c.beginPath(); c.ellipse(x, y + E_.bot + 6, w, 9, 0, 0, TAU); c.fill();
  }
  c.restore();

  const eyePath = () => {
    c.beginPath();
    up.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
    for (let i = lo.length - 1; i >= 0; i--) c.lineTo(lo[i][0], lo[i][1]);
    c.closePath();
  };
  if (open > 0.03) {
    c.save();
    eyePath(); c.clip();
    const sg = c.createRadialGradient(x - side * 2, y - 2, 2, x, y, w * 1.1);
    sg.addColorStop(0, '#fffaf6'); sg.addColorStop(0.65, '#f4e9e3'); sg.addColorStop(1, '#dcc4ba');
    c.fillStyle = sg; c.fillRect(x - w - 2, y - topH - 4, w * 2 + 4, topH + botH + 8);
    // iris
    const ix = x + lx * w * 0.42, iy = y + ly * E_.top * 0.32 + 1.5;
    const ig = c.createRadialGradient(ix + ir * 0.15, iy + ir * 0.4, 1, ix, iy, ir);
    ig.addColorStop(0, P.irisHi); ig.addColorStop(0.5, P.iris); ig.addColorStop(0.88, shade(P.iris, -0.35)); ig.addColorStop(1, '#120905');
    c.fillStyle = ig;
    c.beginPath(); c.arc(ix, iy, ir, 0, TAU); c.fill();
    c.strokeStyle = hexA(P.irisHi, 0.28); c.lineWidth = 0.9;
    for (let k = 0; k < 16; k++) {
      const a = k / 16 * TAU + 0.2;
      c.beginPath(); c.moveTo(ix + Math.cos(a) * ir * 0.5, iy + Math.sin(a) * ir * 0.5);
      c.lineTo(ix + Math.cos(a) * ir * 0.86, iy + Math.sin(a) * ir * 0.86); c.stroke();
    }
    c.fillStyle = '#0a0504';
    const pr = ir * 0.44 * F.pupil;
    c.beginPath(); c.arc(ix, iy, pr, 0, TAU); c.fill();
    // upper-lid cast shadow on the eyeball
    c.lineCap = 'round'; c.lineJoin = 'round';
    [[14, 0.07], [9, 0.09], [4.5, 0.12]].forEach(([lw, a]) => {
      c.strokeStyle = hexA(P.deep, a); c.lineWidth = lw;
      c.beginPath(); up.forEach((p, i) => (i ? c.lineTo(p[0], p[1] + 1) : c.moveTo(p[0], p[1] + 1))); c.stroke();
    });
    // catchlights
    c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(ix - ir * 0.36, iy - ir * 0.4, ir * 0.27, ir * 0.31, -0.5, 0, TAU); c.fill();
    c.globalAlpha = 0.8;
    c.beginPath(); c.arc(ix + ir * 0.38, iy + ir * 0.36, ir * 0.12, 0, TAU); c.fill();
    c.globalAlpha = 1;
    c.restore();
  }
  // lid form: a touch of light on the visible upper lid
  if (open < 0.98) {
    c.save();
    c.beginPath();
    full.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
    for (let i = up.length - 1; i >= 0; i--) c.lineTo(up[i][0], up[i][1]);
    c.closePath();
    c.fillStyle = hexA(P.light, 0.22); c.fill();
    c.restore();
  }
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';
  // crease (Indian: defined & deep-set; Indonesian: lower, softer, shorter lid line)
  const cg = E_.crease, ca = (E_.creaseA || 0.5) * (0.4 + 0.6 * open);
  c.strokeStyle = hexA(P.deep, ca); c.lineWidth = 2;
  c.beginPath();
  const c0 = E_.soft ? 5 : 3, c1 = E_.soft ? 17 : 17;
  for (let i = c0; i <= c1; i++) {
    const p = full[i], u = i / N;
    const yy = p[1] - cg * Math.sin(Math.PI * Math.min(1, u * 1.05)) * (0.5 + 0.5 * open) - (1 - open) * 2;
    i === c0 ? c.moveTo(p[0], yy) : c.lineTo(p[0], yy);
  }
  c.stroke();
  // lash line: tapered, heavier toward the outer corner
  c.fillStyle = '#1b100c';
  c.beginPath();
  up.forEach((p, i) => (i ? c.lineTo(p[0], p[1] + 0.8) : c.moveTo(p[0], p[1] + 0.8)));
  for (let i = up.length - 1; i >= 0; i--) {
    const u = i / N;
    c.lineTo(up[i][0], up[i][1] - lerp(1.2, E_.lash, Math.pow(u, 0.7)));
  }
  c.closePath(); c.fill();
  const oc = up[N];
  if (E_.fem) {
    // soft wing + lashes
    c.beginPath();
    c.moveTo(oc[0] - side * 3, oc[1] - 3.5);
    c.quadraticCurveTo(oc[0] + side * 6, oc[1] - 3, oc[0] + side * 11, oc[1] - 8.5);
    c.quadraticCurveTo(oc[0] + side * 5, oc[1] + 0.5, oc[0] - side * 2, oc[1] + 1);
    c.fill();
    if (open > 0.25) {
      c.strokeStyle = '#1b100c'; c.lineWidth = 1.4;
      for (let k = 0; k < 3; k++) {
        const p = up[12 + k * 2];
        c.beginPath(); c.moveTo(p[0], p[1] - 2);
        c.quadraticCurveTo(p[0] + side * (1.5 + k), p[1] - 5 - k * 0.4, p[0] + side * (3.5 + k * 1.3), p[1] - 5.5 - k * 0.5);
        c.stroke();
      }
    }
  }
  // lower lid: waterline highlight + soft lash shadow
  c.strokeStyle = hexA(P.deep, E_.fem ? 0.5 : 0.35); c.lineWidth = E_.fem ? 1.6 : 1.3;
  c.beginPath();
  for (let i = 6; i <= N; i++) { const p = lo[i]; i === 6 ? c.moveTo(p[0], p[1] + 0.8) : c.lineTo(p[0], p[1] + 0.8); }
  c.stroke();
  c.strokeStyle = hexA(P.light, 0.55); c.lineWidth = 1.4;
  c.beginPath();
  for (let i = 3; i <= N - 3; i++) { const p = lo[i]; i === 3 ? c.moveTo(p[0], p[1] + 3) : c.lineTo(p[0], p[1] + 3); }
  c.stroke();
  // smile squint fold / tired bags
  if (F.squint > 0.2) {
    c.strokeStyle = hexA(P.deep, 0.22 * F.squint); c.lineWidth = 1.6;
    c.beginPath();
    for (let i = 5; i <= N - 2; i++) { const p = lo[i]; i === 5 ? c.moveTo(p[0], p[1] + 7) : c.lineTo(p[0], p[1] + 7); }
    c.stroke();
  }
  if (F.bags > 0.05) {
    c.strokeStyle = hexA('#6a4058', 0.3 * F.bags); c.lineWidth = 2.2;
    c.beginPath();
    for (let i = 3; i <= N - 3; i++) { const p = lo[i]; i === 3 ? c.moveTo(p[0], p[1] + 8) : c.lineTo(p[0], p[1] + 8 + Math.sin(i / N * Math.PI) * 2); }
    c.stroke();
  }
  c.restore();
}

function drawBrow(c, side, F, P, B) {
  const yi = B.y - F.raise * 10 - F.worry * 13;
  const yo = B.y + (B.tilt || 0) - F.raise * 7 + F.worry * 7;
  const xi = side * B.x0, xo = side * B.x1;
  const pk = 0.62, ypk = lerp(yi, yo, pk) - B.arch - F.raise * 3 + F.worry * 2;
  // quadratic control so that the curve passes through the peak at u=pk
  const cxp = (lerp(xi, xo, pk) - (1 - pk) * (1 - pk) * xi - pk * pk * xo) / (2 * pk * (1 - pk));
  const cyp = (ypk - (1 - pk) * (1 - pk) * yi - pk * pk * yo) / (2 * pk * (1 - pk));
  const Q = u => [(1 - u) * (1 - u) * xi + 2 * u * (1 - u) * cxp + u * u * xo, (1 - u) * (1 - u) * yi + 2 * u * (1 - u) * cyp + u * u * yo];
  const N = 16, topE = [], botE = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = Q(u);
    const th = B.th * (B.fem ? (0.75 + 0.35 * Math.sin(Math.PI * Math.min(1, u * 1.6)) - 0.55 * u * u) : (1 - 0.72 * Math.pow(u, 1.5)));
    topE.push([p[0], p[1] - th * 0.58]); botE.push([p[0], p[1] + th * 0.42]);
  }
  c.save();
  const g = c.createLinearGradient(xi, 0, xo, 0);
  g.addColorStop(0, hexA(shade(P.hair, 0.12), B.fem ? 0.7 : 0.8)); g.addColorStop(0.3, P.hair); g.addColorStop(1, P.hair);
  c.fillStyle = g;
  c.beginPath();
  topE.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
  for (let i = N; i > 0; i--) c.lineTo(botE[i][0], botE[i][1]);
  // rounded, feathered brow head
  c.quadraticCurveTo(botE[0][0] - side * B.th * 0.45, (botE[0][1] + topE[0][1]) / 2 + B.th * 0.1, topE[0][0], topE[0][1]);
  c.closePath(); c.fill();
  // hair texture: strands rise at the head, then follow the arch
  c.lineCap = 'round';
  const R = rng(side > 0 ? 77 : 78);
  const n = B.fem ? 10 : 22;
  for (let k = 0; k < n; k++) {
    const u = R() * 0.95, p = Q(u), q = Q(Math.min(1, u + 0.08));
    const th = B.th * (1 - 0.7 * u);
    const oy = (R() - 0.5) * th * 0.8;
    const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) - side * (u < 0.25 ? 0.9 * (1 - u * 4) : 0) * 0.8;
    const len = (B.fem ? 5 : 7 + (B.bushy || 0) * 3) * (1 - u * 0.4);
    c.strokeStyle = R() < 0.5 ? hexA(P.hairSheen || P.hairHi, 0.45) : hexA('#000000', 0.35);
    c.lineWidth = B.fem ? 0.9 : 1.3;
    c.beginPath(); c.moveTo(p[0], p[1] + oy); c.lineTo(p[0] + Math.cos(ang) * len, p[1] + oy + Math.sin(ang) * len); c.stroke();
  }
  c.restore();
}

function drawNose(c, P, N) {
  const ty = N.tipY, r = N.tipR, aw = N.alaW, top = N.top, bs = N.bridge;
  c.save();
  // shadow-side plane of the bridge (viewer right), widening toward the tip
  if (bs > 0.05) {
    const g = c.createLinearGradient(0, 0, r + 6, 0);
    g.addColorStop(0, hexA(P.deep, 0.02)); g.addColorStop(0.35, hexA(P.deep, 0.3 * bs)); g.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(1, top);
    c.quadraticCurveTo(7, (top + ty) / 2, r * 0.95, ty - 2);
    c.quadraticCurveTo(r * 0.5, ty - r * 0.6, 3, ty - r * 0.9);
    c.quadraticCurveTo(1, (top + ty) / 2, -2, top);
    c.closePath(); c.fill();
    // light-side plane + bridge highlight
    const hg = c.createLinearGradient(0, top, 0, ty);
    hg.addColorStop(0, hexA(P.light, 0)); hg.addColorStop(0.45, hexA(P.light, 0.55 * bs + 0.1)); hg.addColorStop(1, hexA(P.light, 0.25));
    c.fillStyle = hg;
    c.beginPath(); c.ellipse(-2.5, (top + ty) / 2 + 2, 3, (ty - top) / 2 - 2, 0, 0, TAU); c.fill();
    // brow-to-nose shadow at the root (strong brow ridge)
    glowDot(c, 0, top - 4, 12, hexA(P.deep, 0.12 * bs), 1);
  }
  // cast shadow under the tip & on the philtrum
  const us = c.createRadialGradient(3, ty + r * 0.8, 1, 3, ty + r * 0.8, aw * 1.3);
  us.addColorStop(0, hexA(P.deep, 0.34)); us.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = us; c.beginPath(); c.ellipse(3, ty + r * 0.8, aw * 1.3, r * 0.7, 0, 0, TAU); c.fill();
  // alae: soft volume + crease line
  [-1, 1].forEach(s => {
    const ax = s * (aw - 4), ay = ty + 3;
    const ag = c.createRadialGradient(ax + s * 3, ay + 1, 1, ax, ay, 9);
    ag.addColorStop(0, hexA(P.deep, s > 0 ? 0.24 : 0.14)); ag.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = ag; c.beginPath(); c.ellipse(ax, ay, 9, 8, 0, 0, TAU); c.fill();
    c.strokeStyle = hexA(P.deep, N.fem ? 0.32 : 0.45); c.lineWidth = N.fem ? 1.4 : 1.8; c.lineCap = 'round';
    c.beginPath(); c.arc(ax - s * 1, ay, 6.5, s > 0 ? -1.7 : Math.PI - 1.1, s > 0 ? 1.1 : Math.PI + 1.7, s < 0); c.stroke();
  });
  // tip: no hard edge, just warm subsurface + highlight
  const tw = c.createRadialGradient(0, ty, 1, 0, ty, r * 1.2);
  tw.addColorStop(0, hexA(P.sss, 0.16)); tw.addColorStop(1, hexA(P.sss, 0));
  c.fillStyle = tw; c.beginPath(); c.arc(0, ty, r * 1.2, 0, TAU); c.fill();
  const rs = c.createRadialGradient(r * 0.55, ty + 1, 1, r * 0.55, ty + 1, r * 0.8);
  rs.addColorStop(0, hexA(P.deep, 0.16)); rs.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = rs; c.beginPath(); c.arc(r * 0.55, ty + 1, r * 0.8, 0, TAU); c.fill();
  // underside of the tip (columella line)
  c.strokeStyle = hexA(P.deep, 0.32); c.lineWidth = 1.8; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-r * 0.55, ty + r * 0.62); c.quadraticCurveTo(0, ty + r * 0.95, r * 0.6, ty + r * 0.6); c.stroke();
  glowDot(c, -r * 0.28, ty - r * 0.3, r * 0.75, hexA(P.light, 0.85), 1);
  c.fillStyle = hexA('#ffffff', 0.5); c.beginPath(); c.ellipse(-r * 0.28, ty - r * 0.38, r * 0.22, r * 0.14, -0.3, 0, TAU); c.fill();
  // nostrils
  c.fillStyle = hexA('#4a2418', 0.5);
  [-1, 1].forEach(s => { c.beginPath(); c.ellipse(s * (aw * 0.42), ty + r * 0.62, N.fem ? 3 : 3.8, N.fem ? 1.7 : 2.2, s * 0.4, 0, TAU); c.fill(); });
  c.restore();
}

function drawMouth(c, F, P, y, fem, beard) {
  const w = F.mw * (fem ? 0.84 : 0.92), s = F.smile, op = F.mopen;
  const cy = y - s * 8;
  const lipC = fem ? P.lip : mixHex(P.skin, P.lip, 0.6);
  const lipD = mixHex(lipC, P.deep, fem ? 0.3 : 0.4);
  const upH = fem ? 7.5 : 5, loH = fem ? 11 : 7.5;
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';
  // smile / nasolabial hint
  if (s > 0.25) {
    c.strokeStyle = hexA(P.deep, (fem ? 0.14 : 0.22) * s); c.lineWidth = 2.2;
    [-1, 1].forEach(k => { c.beginPath(); c.moveTo(k * (w * 0.55 + 10), y - 32); c.quadraticCurveTo(k * (w + 12), y - 18, k * (w + 5), cy + 4); c.stroke(); });
  }
  if (op < 0.07) {
    const midY = y + s * 6;
    // upper lip with cupid's bow
    c.fillStyle = hexA(lipD, fem ? 0.95 : 0.6);
    c.beginPath(); c.moveTo(-w, cy);
    c.bezierCurveTo(-w * 0.6, y - upH * 0.6, -w * 0.3, y - upH * 1.15, 0, y - upH * 0.75);
    c.bezierCurveTo(w * 0.3, y - upH * 1.15, w * 0.6, y - upH * 0.6, w, cy);
    c.quadraticCurveTo(0, midY + s * 4, -w, cy);
    c.fill();
    // lower lip
    const lg = c.createLinearGradient(0, midY, 0, midY + loH * 1.3);
    lg.addColorStop(0, hexA(lipC, fem ? 1 : 0.6)); lg.addColorStop(1, hexA(lipD, fem ? 0.95 : 0.4));
    c.fillStyle = lg;
    c.beginPath(); c.moveTo(-w * 0.86, cy + 1);
    c.quadraticCurveTo(0, midY + s * 4, w * 0.86, cy + 1);
    c.quadraticCurveTo(w * 0.5, midY + loH * 1.25, 0, midY + loH * 1.2);
    c.quadraticCurveTo(-w * 0.5, midY + loH * 1.25, -w * 0.86, cy + 1);
    c.fill();
    // lip line
    c.strokeStyle = fem ? mixHex(P.lip, '#3a1018', 0.55) : '#6a3328'; c.lineWidth = fem ? 2.4 : 2.8;
    c.beginPath(); c.moveTo(-w, cy); c.quadraticCurveTo(0, midY + s * 4, w, cy); c.stroke();
    // corners
    c.fillStyle = hexA(P.deep, 0.5);
    [-1, 1].forEach(k => { c.beginPath(); c.arc(k * w, cy, 2, 0, TAU); c.fill(); });
    // gloss / highlight
    c.fillStyle = hexA('#ffffff', fem ? 0.5 : 0.22);
    c.beginPath(); c.ellipse(-w * 0.12, midY + loH * 0.65, w * 0.26, fem ? 2.6 : 1.8, -0.05, 0, TAU); c.fill();
  } else {
    const top = y - s * 2 - op * 3;
    const bot = y + 6 + op * 30 + Math.max(s, 0) * 9;
    const cav = () => {
      c.beginPath();
      c.moveTo(-w, cy);
      c.bezierCurveTo(-w * 0.5, top - 2, w * 0.5, top - 2, w, cy);
      c.bezierCurveTo(w * 0.6, bot, -w * 0.6, bot, -w, cy);
      c.closePath();
    };
    cav(); c.fillStyle = '#3d1119'; c.fill();
    c.save(); cav(); c.clip();
    if (s > -0.2) {
      c.fillStyle = '#fbf6ef';
      c.beginPath(); c.ellipse(0, top + 1, w * 0.86, 8 + op * 2, 0, 0, TAU); c.fill();
      c.fillStyle = hexA('#c9b8b0', 0.5); c.fillRect(-w, top + 7 + op * 2, w * 2, 2);
    }
    c.fillStyle = '#d65f78';
    c.beginPath(); c.ellipse(0, bot + 3, w * 0.62, 11 + op * 6, 0, 0, TAU); c.fill();
    c.restore();
    // lips around the opening
    c.fillStyle = hexA(lipD, fem ? 0.95 : 0.55);
    c.beginPath(); c.moveTo(-w - 1, cy);
    c.bezierCurveTo(-w * 0.6, top - upH - 1, -w * 0.25, top - upH - 3, 0, top - upH - 1);
    c.bezierCurveTo(w * 0.25, top - upH - 3, w * 0.6, top - upH - 1, w + 1, cy);
    c.bezierCurveTo(w * 0.5, top - 2, -w * 0.5, top - 2, -w - 1, cy);
    c.fill();
    c.fillStyle = hexA(lipC, fem ? 1 : 0.55);
    c.beginPath(); c.moveTo(-w, cy);
    c.bezierCurveTo(-w * 0.6, bot, w * 0.6, bot, w, cy);
    c.bezierCurveTo(w * 0.6, bot + loH * 1.2, -w * 0.6, bot + loH * 1.2, -w, cy);
    c.fill();
    c.strokeStyle = fem ? mixHex(P.lip, '#3a1018', 0.5) : '#5e2c24'; c.lineWidth = 2.2;
    cav(); c.stroke();
    c.fillStyle = hexA('#ffffff', fem ? 0.45 : 0.2);
    c.beginPath(); c.ellipse(-w * 0.1, bot + loH * 0.55, w * 0.24, 2.2, 0, 0, TAU); c.fill();
  }
  c.restore();
}

// skin shading inside the face silhouette
function faceShade(c, P, F, o, C, covered) {
  const S = C.shape;
  // shadow-side warm terminator (subsurface) + core shadow
  const sg = c.createLinearGradient(20, 0, S.cw + 2, 0);
  sg.addColorStop(0, hexA(P.sss, 0)); sg.addColorStop(0.5, hexA(P.sss, 0.16)); sg.addColorStop(0.8, hexA(P.dark, 0.32)); sg.addColorStop(1, hexA(P.deep, 0.42));
  c.fillStyle = sg; c.fillRect(20, -300, S.cw + 10, 270);
  const lg = c.createLinearGradient(-S.cw - 2, 0, -54, 0);
  lg.addColorStop(0, hexA(P.dark, 0.32)); lg.addColorStop(0.35, hexA(P.sss, 0.1)); lg.addColorStop(1, hexA(P.sss, 0));
  c.fillStyle = lg; c.fillRect(-S.cw - 10, -300, S.cw - 40, 270);
  // underside of the jaw turns away from the light
  const jg = c.createLinearGradient(0, -104, 0, S.chy);
  jg.addColorStop(0, hexA(P.dark, 0)); jg.addColorStop(1, hexA(P.dark, 0.32));
  c.fillStyle = jg; c.fillRect(-110, -104, 220, 64);
  // hairline / hijab occlusion
  const ao = c.createLinearGradient(0, -284, 0, covered ? -236 : -228);
  ao.addColorStop(0, hexA(P.deep, 0.5)); ao.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = ao; c.fillRect(-110, -300, 220, 80);
  // brow ridge (Indian men): shadow under the brow, light on the brow bone
  if (C.ridge > 0) {
    [-1, 1].forEach(s => {
      const g = c.createRadialGradient(s * C.ex, C.ey - 22, 2, s * C.ex, C.ey - 20, 40);
      g.addColorStop(0, hexA(P.deep, 0.16 * C.ridge)); g.addColorStop(1, hexA(P.deep, 0));
      c.fillStyle = g; c.beginPath(); c.ellipse(s * C.ex, C.ey - 20, 40, 22, 0, 0, TAU); c.fill();
      glowDot(c, s * (C.ex - 4), C.brow - 18 - 2, 30, hexA(P.light, 0.3 * C.ridge), 1);
    });
  }
  // forehead, cheekbones, chin highlights
  glowDot(c, -20, -246, 54, hexA(P.light, 0.55), 1);
  glowDot(c, -C.ex - 18, -136, 28, hexA(P.light, 0.35), 1);
  glowDot(c, C.ex + 18, -138, 22, hexA(P.light, 0.16), 1);
  glowDot(c, -4, S.chy - 18, 18, hexA(P.light, 0.4), 1);
  // blush
  [-1, 1].forEach(s => glowDot(c, s * (C.ex + 14), -128, S.fem ? 36 : 34, hexA(P.blushC, (S.fem ? 0.22 : 0.12) + F.blush * (S.fem ? 0.4 : 0.22)), 1));
  // under-lip & temple shading
  const ul = c.createRadialGradient(0, C.mouthY + 22, 1, 0, C.mouthY + 22, 18);
  ul.addColorStop(0, hexA(P.deep, 0.22)); ul.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = ul; c.beginPath(); c.ellipse(0, C.mouthY + 22, 18, 6, 0, 0, TAU); c.fill();
  // scene lighting
  if (o.rim) {
    c.globalCompositeOperation = 'screen';
    const rs = o.rimSide || 1;
    const rg = c.createLinearGradient(rs * (S.cw - 34), 0, rs * (S.cw + 2), 0);
    rg.addColorStop(0, hexA(hex6(o.rim), 0)); rg.addColorStop(1, hexA(hex6(o.rim), 0.6));
    c.fillStyle = rg; c.fillRect(-110, -300, 220, 270);
    c.globalCompositeOperation = 'source-over';
  }
  if (o.screenGlow) {
    c.globalCompositeOperation = 'screen';
    const sgl = c.createLinearGradient(0, -40, 0, -210);
    sgl.addColorStop(0, hexA(hex6(o.screenGlow), 0.32)); sgl.addColorStop(1, hexA(hex6(o.screenGlow), 0));
    c.fillStyle = sgl; c.fillRect(-110, -220, 220, 200);
    c.globalCompositeOperation = 'source-over';
  }
}

// beard / stubble region (follows the jaw, extends a little beyond it for volume)
function beardPath(c, S, ext) {
  const { cw, jx, jy, chw, chy } = S;
  c.beginPath();
  c.moveTo(-cw + 1, -204);
  c.lineTo(-cw + 9, -204);
  c.bezierCurveTo(-cw + 12, -150, -70, -124, -46, -114);          // cheek line, low & clean
  c.quadraticCurveTo(-36, -110, -24, -112);
  c.lineTo(24, -112);
  c.quadraticCurveTo(36, -110, 46, -114);
  c.bezierCurveTo(70, -124, cw - 12, -150, cw - 9, -204);
  c.lineTo(cw - 1, -204);
  c.bezierCurveTo(cw + ext * 0.3, -150, jx + 8 + ext, jy - 26, jx + ext * 0.8, jy + ext * 0.4);
  c.bezierCurveTo(jx - 12 + ext * 0.5, jy + 26 + ext, chw + 20, chy + 1 + ext, chw, chy + 0.5 + ext);
  c.bezierCurveTo(chw * 0.5, chy + 2 + ext * 1.1, -chw * 0.5, chy + 2 + ext * 1.1, -chw, chy + 0.5 + ext);
  c.bezierCurveTo(-chw - 20, chy + 1 + ext, -jx + 12 - ext * 0.5, jy + 26 + ext, -jx - ext * 0.8, jy + ext * 0.4);
  c.bezierCurveTo(-jx - 8 - ext, jy - 26, -cw - ext * 0.3, -150, -cw + 1, -196);
  c.closePath();
}
function beardDraw(c, P, kind, C) {
  if (kind === 'none' || !kind) return;
  const S = C.shape, full = kind === 'full';
  c.save();
  if (full) {
    // groomed full beard: soft volume, crisp cheek line, connected moustache
    beardPath(c, S, 3);
    const g = c.createLinearGradient(-60, -200, 50, -40);
    g.addColorStop(0, shade(P.hair, 0.14)); g.addColorStop(0.5, P.hair); g.addColorStop(1, '#070403');
    c.fillStyle = g; c.fill();
    c.save(); beardPath(c, S, 3); c.clip();
    // light falloff (lit left, darker right / underside)
    const lg = c.createLinearGradient(-100, 0, 100, 0);
    lg.addColorStop(0, hexA(P.hairSheen, 0.25)); lg.addColorStop(0.45, hexA(P.hairSheen, 0.1)); lg.addColorStop(1, hexA('#000000', 0.25));
    c.fillStyle = lg; c.fillRect(-110, -200, 220, 170);
    // strands following growth direction
    const R = rng(7);
    c.lineCap = 'round';
    for (let i = 0; i < 260; i++) {
      const x = (R() * 2 - 1) * 98, y = -186 + R() * 148;
      const ang = Math.PI / 2 + (x / 100) * 0.55 + (R() - 0.5) * 0.3;
      c.strokeStyle = R() < 0.55 ? hexA(P.hairSheen, 0.32) : hexA('#000000', 0.4);
      c.lineWidth = 1.1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang) * 6, y + Math.sin(ang) * 6); c.stroke();
    }
    c.restore();
  } else {
    // stubble: a translucent shadow plus fine flecks, clipped to the face so nothing lands outside
    c.save(); facePath(c, S); c.clip();
    c.save(); c.filter = 'blur(5px)';
    beardPath(c, S, 0);
    c.fillStyle = hexA(mixHex(P.hair, '#3a4a6a', 0.3), 0.2); c.fill();
    c.restore();
    beardPath(c, S, 0); c.clip();
    const R = rng(9);
    c.fillStyle = hexA(P.hair, 0.22);
    for (let i = 0; i < 900; i++) {
      const x = (R() * 2 - 1) * 100, y = -188 + R() * 148;
      c.fillRect(x, y, 0.9, 1.2);
    }
    c.restore();
  }
  // moustache
  c.fillStyle = full ? P.hair : hexA(mixHex(P.hair, '#3a4a6a', 0.25), 0.22);
  c.beginPath();
  c.moveTo(-36, -103);
  c.bezierCurveTo(-30, -120, -10, -123, 0, -119);
  c.bezierCurveTo(10, -123, 30, -120, 36, -103);
  c.bezierCurveTo(24, -110, 10, -111, 0, -109);
  c.bezierCurveTo(-10, -111, -24, -110, -36, -103);
  c.fill();
  if (full) {
    c.strokeStyle = hexA(P.hairSheen, 0.35); c.lineWidth = 1;
    for (let k = 0; k < 10; k++) {
      const x = -30 + k * 6.6;
      c.beginPath(); c.moveTo(x, -120 + Math.abs(x) * 0.08); c.lineTo(x + (x < 0 ? -3 : 3), -112); c.stroke();
    }
  }
  c.restore();
}

// ---------- hair: men ----------
const CURLS = (() => {
  const R = rng(42), back = [], front = [];
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * (0.9 + i / 25 * 1.2);
    const rr_ = 104 + R() * 8;
    back.push([Math.cos(a) * rr_, -216 + Math.sin(a) * rr_ * 0.92, 18 + R() * 6, R() * TAU]);
  }
  // clumps on the dome, back rows first so the front rows overlap them
  const rows = [[-322, 40, 4], [-306, 70, 6], [-288, 88, 8], [-270, 98, 9], [-252, 100, 10]];
  rows.forEach(([y, span, n], r) => {
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const x = lerp(-span, span, u) + (R() - 0.5) * 9;
      const yy = y + (R() - 0.5) * 7 + Math.pow(Math.abs(u - 0.5) * 2, 2) * (r * 8 + 10);
      front.push([x, yy, 15 + R() * 5, R() * TAU, r]);
    }
  });
  return { back, front };
})();

function curl(c, P, x, y, r, ph) {
  const lit = clamp(0.6 - x / 200 - (y + 260) / 160, 0.05, 1);
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.45, 1, x, y, r);
  g.addColorStop(0, mixHex(P.hair, P.hairHi, lit)); g.addColorStop(0.6, P.hair); g.addColorStop(1, '#070403');
  c.fillStyle = g;
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  // coil highlight: a thin open spiral on the lit side only
  c.strokeStyle = hexA(P.hairSheen, 0.15 + lit * 0.45); c.lineWidth = 1.5;
  c.beginPath(); c.arc(x - r * 0.05, y, r * 0.62, Math.PI * 1.0 + ph * 0.08, Math.PI * 1.65 + ph * 0.05); c.stroke();
  c.beginPath(); c.arc(x + r * 0.05, y + r * 0.05, r * 0.3, Math.PI * 1.3, Math.PI * 1.95); c.stroke();
}

function hairBack(c, P, style, sway = 0) {
  c.save();
  c.fillStyle = P.hair;
  if (style === 'curly') {
    c.beginPath(); c.ellipse(0, -220, 112, 96, 0, 0, TAU); c.fill();
    CURLS.back.forEach(([x, y, r, ph], i) => curl(c, P, x + sway * 0.6 * Math.sin(ph), y, r, ph));
  } else if (style === 'quiff' || style === 'short') {
    c.beginPath(); c.ellipse(0, -222, 106, 86, 0, 0, TAU); c.fill();
  }
  c.restore();
}

function sideFade(c, P, s, y0, y1, a0 = 0.9) {
  // tapered sideburn / faded side — soft bezier shape, not a box
  const g = c.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, hexA(P.hair, a0)); g.addColorStop(0.7, hexA(P.hair, a0 * 0.55)); g.addColorStop(1, hexA(P.hair, 0.05));
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(s * 103, y0);
  c.bezierCurveTo(s * 104, y0 + 30, s * 102, y1 - 20, s * 98, y1);
  c.bezierCurveTo(s * 94, y1 - 10, s * 90, y0 + 40, s * 84, y0 + 4);
  c.closePath(); c.fill();
}

function hairFront(c, P, style, t, sway = 0) {
  c.save();
  c.lineCap = 'round';
  if (style === 'curly') {
    sideFade(c, P, -1, -232, -150, 0.95); sideFade(c, P, 1, -232, -150, 0.95);
    const g = c.createLinearGradient(0, -330, 0, -200);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.35, P.hair); g.addColorStop(1, P.hair);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-104, -196);
    c.bezierCurveTo(-112, -300, 112, -300, 104, -196);
    c.bezierCurveTo(94, -228, 50, -246, 0, -244);
    c.bezierCurveTo(-50, -246, -94, -228, -104, -196);
    c.fill();
    CURLS.front.forEach(([x, y, r, ph, row]) => {
      const sw = sway * (0.5 + row * 0.25) * (0.7 + 0.3 * Math.sin(ph));
      curl(c, P, x + sw, y, r, ph);
    });
    // loose curls falling on the forehead (kept above the brows)
    [[-56, -238, 1, 13], [-14, -242, -1, 15], [30, -240, 1, 13], [66, -230, -1, 11]].forEach(([fx, fy, d, r], i) => {
      const sw = sway * 1.3 + Math.sin(t * 0.9 + i * 1.7) * 0.6;
      c.strokeStyle = P.hair; c.lineWidth = 5;
      c.beginPath(); c.moveTo(fx - d * 4, fy - 8);
      c.bezierCurveTo(fx + d * 9 + sw, fy - 4, fx + d * 8 + sw, fy + r * 0.7, fx + d * 2 + sw * 1.2, fy + r * 0.6);
      c.stroke();
    });
  } else if (style === 'quiff') {
    sideFade(c, P, -1, -240, -160, 0.8); sideFade(c, P, 1, -240, -160, 0.8);
    const g = c.createLinearGradient(-70, -350, 50, -220);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.35, P.hair); g.addColorStop(1, '#090605');
    c.fillStyle = g;
    const sw = sway * 0.6;
    c.beginPath();
    c.moveTo(-101, -214);
    c.bezierCurveTo(-108, -268, -86, -312, -44, -326);
    c.bezierCurveTo(-8 + sw, -350, 40 + sw, -358, 76 + sw, -338);
    c.bezierCurveTo(102 + sw * 0.5, -320, 108, -284, 101, -232);
    c.bezierCurveTo(94, -246, 86, -254, 74, -256);
    c.bezierCurveTo(50, -266, 22, -268, 0, -262);
    c.bezierCurveTo(-24, -258, -52, -266, -74, -254);
    c.bezierCurveTo(-88, -248, -98, -232, -101, -214);
    c.fill();
    // swept strands & sheen
    for (let k = 0; k < 11; k++) {
      c.strokeStyle = k % 3 === 0 ? hexA(P.hairSheen, 0.42) : hexA(P.hairSheen, 0.18);
      c.lineWidth = 1.4 + (k % 2);
      c.beginPath();
      c.moveTo(-84 + k * 9, -244 - k * 1.5);
      c.bezierCurveTo(-70 + k * 9, -300 - k * 2, 0 + k * 6 + sw, -338 + k, 64 + k * 3 + sw, -322 + k * 4);
      c.stroke();
    }
    c.strokeStyle = hexA('#000000', 0.5); c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(-64, -258); c.quadraticCurveTo(-66, -296, -50, -322); c.stroke();
  } else if (style === 'short') {
    sideFade(c, P, -1, -240, -172, 0.85); sideFade(c, P, 1, -240, -172, 0.85);
    const sw = sway * 0.5;
    const cap = () => {
      c.beginPath();
      c.moveTo(-103, -206);
      c.bezierCurveTo(-112, -296, -48, -334, 8, -332);
      c.bezierCurveTo(68, -330, 114, -296, 103, -206);
      c.bezierCurveTo(100, -232, 90, -248, 72, -254);
      c.bezierCurveTo(56, -258, 46, -256, 36, -260);
      // fringe swept toward the viewer's left, soft textured tips
      c.quadraticCurveTo(22 + sw, -258, 10 + sw, -250);
      c.quadraticCurveTo(0 + sw, -260, -14 + sw, -252);
      c.quadraticCurveTo(-26 + sw, -260, -40 + sw, -248);
      c.quadraticCurveTo(-54 + sw, -256, -66 + sw, -244);
      c.quadraticCurveTo(-72, -248, -78, -244);
      c.bezierCurveTo(-90, -240, -100, -226, -103, -206);
      c.closePath();
    };
    const g = c.createLinearGradient(-40, -334, 30, -230);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.4, P.hair); g.addColorStop(1, '#0a0706');
    c.fillStyle = g; cap(); c.fill();
    c.save(); cap(); c.clip();
    for (let k = 0; k < 12; k++) {
      c.strokeStyle = k % 3 === 0 ? hexA(P.hairSheen, 0.42) : hexA(P.hairSheen, 0.16); c.lineWidth = 1.6;
      const x = 46 - k * 11;
      c.beginPath(); c.moveTo(48 + k * 2, -326 + k * 2); c.quadraticCurveTo(x + 6 + sw, -300, x - 8 + sw, -252); c.stroke();
    }
    c.strokeStyle = hexA('#000000', 0.45); c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(42, -258); c.quadraticCurveTo(48, -296, 50, -326); c.stroke();
    c.restore();
  }
  c.restore();
}

function drawHeadset(c, fem) {
  c.save();
  c.lineCap = 'round';
  // band over the head
  c.strokeStyle = '#2a2a36'; c.lineWidth = 7;
  c.beginPath(); c.moveTo(-108, -182); c.bezierCurveTo(-118, -300, 118, -300, 108, -182); c.stroke();
  c.strokeStyle = hexA('#8a8aa8', 0.6); c.lineWidth = 2;
  c.beginPath(); c.moveTo(-104, -230); c.bezierCurveTo(-90, -296, 60, -306, 98, -250); c.stroke();
  // ear cups
  [-1, 1].forEach(s => {
    const g = c.createLinearGradient(s * 96, -196, s * 118, -150);
    g.addColorStop(0, '#4a4a5c'); g.addColorStop(1, '#1e1e28');
    c.fillStyle = g;
    c.beginPath(); c.ellipse(s * 108, -172, s < 0 ? 17 : 12, s < 0 ? 25 : 18, 0, 0, TAU); c.fill();
  });
  c.fillStyle = '#ff5f97'; c.beginPath(); c.ellipse(-112, -172, 5, 9, 0, 0, TAU); c.fill();
  // mic boom: short, stays at the jaw line, never across the face
  c.strokeStyle = '#2a2a36'; c.lineWidth = 4.5;
  c.beginPath(); c.moveTo(-108, -152); c.quadraticCurveTo(-100, -104, fem ? -72 : -76, -90); c.stroke();
  c.fillStyle = '#2a2a36'; c.beginPath(); c.ellipse(fem ? -68 : -72, -89, 7, 5.5, 0.3, 0, TAU); c.fill();
  c.fillStyle = '#ff5f97'; c.beginPath(); c.arc(fem ? -67 : -71, -90, 2.4, 0, TAU); c.fill();
  c.restore();
}

// ---------- hands ----------
// local frame: +x toward the fingertips, +y toward the little finger. Origin = grip point.
function fingerJ(x0, y0, len, ang, curl) {
  const l1 = len * 0.52, l2 = len * 0.48;
  const j = [x0 + Math.cos(ang) * l1, y0 + Math.sin(ang) * l1];
  return { j, tip: [j[0] + Math.cos(ang + curl) * l2, j[1] + Math.sin(ang + curl) * l2], a2: ang + curl };
}
function limbGrad(c, P, y0, h) {
  const g = c.createLinearGradient(0, y0 - h, 0, y0 + h);
  g.addColorStop(0, P.light); g.addColorStop(0.45, P.skin); g.addColorStop(1, P.dark);
  return g;
}
function drawFinger(c, P, x0, y0, len, w, ang, curl, nail = true) {
  const J = fingerJ(x0, y0, len, ang, curl);
  const r0 = w / 2, r1 = w * 0.46, r2 = w * 0.4;
  c.lineWidth = 2.4; c.strokeStyle = hexA(P.deep, 0.42);
  capsulePath(c, x0, y0, r0, J.j[0], J.j[1], r1); c.stroke();
  capsulePath(c, J.j[0], J.j[1], r1, J.tip[0], J.tip[1], r2); c.stroke();
  c.fillStyle = limbGrad(c, P, (y0 + J.tip[1]) / 2, w * 0.6);
  capsulePath(c, x0, y0, r0, J.j[0], J.j[1], r1); c.fill();
  capsulePath(c, J.j[0], J.j[1], r1, J.tip[0], J.tip[1], r2); c.fill();
  // knuckle wrinkles at the middle joint
  c.save(); c.translate(J.j[0], J.j[1]); c.rotate(ang);
  c.strokeStyle = hexA(P.deep, 0.35); c.lineWidth = 1;
  c.beginPath(); c.arc(-3, 0, r1 * 0.75, -0.7, 0.7); c.stroke();
  c.beginPath(); c.arc(0, 0, r1 * 0.6, -0.6, 0.6); c.stroke();
  c.fillStyle = hexA(P.light, 0.45); c.beginPath(); c.ellipse(-1, -r1 * 0.35, 3, 1.6, 0, 0, TAU); c.fill();
  c.restore();
  if (nail) {
    c.save(); c.translate(J.tip[0], J.tip[1]); c.rotate(J.a2);
    c.fillStyle = mixHex(P.light, '#ffe0dc', 0.45);
    rr(c, -10.5, -r2 * 0.66, 10, r2 * 1.32, r2 * 0.6); c.fill();
    c.strokeStyle = hexA(P.deep, 0.3); c.lineWidth = 0.9; c.stroke();
    c.fillStyle = hexA('#ffffff', 0.7); c.fillRect(-8, -r2 * 0.4, 5, 1.2);
    c.restore();
  }
  // base knuckle highlight
  c.fillStyle = hexA(P.light, 0.5); c.beginPath(); c.ellipse(x0 + 2, y0 - r0 * 0.3, 4, 2.4, ang, 0, TAU); c.fill();
}
function drawGripHand(c, P, thumbFront) {
  const out = hexA(P.deep, 0.42);
  // back of the hand (seen at an angle), wrist enters at x≈-44
  c.beginPath();
  c.moveTo(-46, -15);
  c.bezierCurveTo(-30, -23, -12, -27, 5, -24);
  c.bezierCurveTo(12, -10, 10, 14, 0, 25);
  c.bezierCurveTo(-14, 29, -32, 25, -46, 16);
  c.bezierCurveTo(-49, 6, -49, -6, -46, -15);
  c.closePath();
  c.strokeStyle = out; c.lineWidth = 2.4; c.stroke();
  c.fillStyle = limbGrad(c, P, 0, 28); c.fill();
  // tendons
  c.strokeStyle = hexA(P.light, 0.4); c.lineWidth = 1.6;
  [[-15], [-4], [7]].forEach(([y], i) => { c.beginPath(); c.moveTo(-38, y * 0.5); c.quadraticCurveTo(-18, y * 0.85, -2, y); c.stroke(); });
  // fingers: little -> index (index sits on top)
  const F = [[3, -17, 40, 12.6, -0.04, 0.1], [4, -5, 44, 13.2, 0.0, 0.1], [2, 7, 41, 12.4, 0.05, 0.12], [-3, 17.5, 33, 10.8, 0.12, 0.14]];
  for (let i = F.length - 1; i >= 0; i--) { const f = F[i]; drawFinger(c, P, f[0], f[1], f[2], f[3], f[4], f[5]); }
  // thumb: in front (resting on the prop) or curling around behind the object (only the base shows)
  if (thumbFront) {
    drawFinger(c, P, -26, -19, 40, 15, -0.42, 0.28);
  } else {
    c.strokeStyle = out; c.lineWidth = 2.4;
    capsulePath(c, -32, -18, 11, -6, -26, 8); c.stroke();
    c.fillStyle = limbGrad(c, P, -22, 12);
    capsulePath(c, -32, -18, 11, -6, -26, 8); c.fill();
    c.strokeStyle = hexA(P.deep, 0.3); c.lineWidth = 1;
    c.beginPath(); c.arc(-12, -24, 6, -0.4, 1.0); c.stroke();
  }
}
function drawFist(c, P, ts) {
  // ts: +1/-1 which local side the thumb is on. Fist ≈ 60 × 56, knuckles toward +x.
  const out = hexA(P.deep, 0.45);
  c.beginPath(); rr(c, -30, -30, 62, 60, 20);
  c.strokeStyle = out; c.lineWidth = 2.6; c.stroke();
  c.fillStyle = skinGrad(c, P, 0, 0, 38); c.fill();
  // curled fingers (middle phalanges facing the viewer)
  const ys = [-21, -7, 7, 20.5], ws = [14, 14.5, 14, 12];
  const order = ts > 0 ? [0, 1, 2, 3] : [3, 2, 1, 0];
  order.forEach(i => {
    const y = ys[i] * (ts > 0 ? 1 : -1), w = ws[i];
    const x0 = -10 + (i === 3 ? 4 : 0), x1 = 30 - (i === 3 ? 3 : 0);
    rr(c, x0, y - w / 2, x1 - x0, w, w / 2);
    c.strokeStyle = out; c.lineWidth = 2.2; c.stroke();
    c.fillStyle = limbGrad(c, P, y, w * 0.7); c.fill();
    c.fillStyle = hexA(P.light, 0.55); c.beginPath(); c.ellipse(x1 - 6, y - w * 0.15, 4, 3, 0, 0, TAU); c.fill(); // knuckle
    c.strokeStyle = hexA(P.deep, 0.32); c.lineWidth = 1;
    c.beginPath(); c.moveTo(x0 + 12, y - w * 0.3); c.quadraticCurveTo(x0 + 14, y, x0 + 12, y + w * 0.3); c.stroke();
  });
  // thumb wrapped across the index & middle fingers
  // finger-curl crease across the columns
  c.strokeStyle = hexA(P.deep, 0.35); c.lineWidth = 1.4;
  c.beginPath(); c.moveTo(4, -27); c.quadraticCurveTo(7, 0, 4, 27); c.stroke();
  const sy = ts * 31;
  c.strokeStyle = out; c.lineWidth = 2.4;
  capsulePath(c, -18, sy, 12.5, -6, -ts * 5, 8.5); c.stroke();
  c.fillStyle = limbGrad(c, P, sy * 0.5, 16);
  capsulePath(c, -18, sy, 12.5, -6, -ts * 5, 8.5); c.fill();
  glowDot(c, -10, -ts * 2, 8, hexA(P.light, 0.6), 1);
  c.strokeStyle = hexA(P.deep, 0.3); c.lineWidth = 1;
  c.beginPath(); c.arc(-12, ts * 12, 5, 0, Math.PI); c.stroke();
}
// x,y: hand position; a: forearm angle (direction the fingers point); side: which arm
function drawHand(c, P, x, y, a, side, fist = 0, opt = {}) {
  const f = fistAmt(fist), k = (opt.k || 1) * (1 + 0.1 * fistAmt(fist));
  c.save(); c.translate(x, y); c.rotate(a); c.scale(k, k);
  const flip = Math.abs(Math.cos(a)) > 0.2 ? Math.sign(Math.cos(a)) : -side; // index finger on top
  const grip = () => { c.save(); c.scale(1, flip); drawGripHand(c, P, opt.thumbFront); c.restore(); };
  const fistD = () => {
    const ty = -Math.sin(a);                   // world x of local +y
    drawFist(c, P, ty * side > 0 ? -1 : 1);    // thumb toward the body midline
  };
  if (f <= 0.001) grip();
  else if (f >= 0.999) fistD();
  else { // short crossfade instead of a snap
    c.save(); c.globalAlpha *= Math.min(1, (1 - f) * 2); grip(); c.restore();
    c.save(); c.globalAlpha *= Math.min(1, f * 2); fistD(); c.restore();
  }
  c.restore();
}

// ---------- arms ----------
// Draws shoulder cap, tapered upper arm & forearm with sleeve; returns a cuff painter that is
// called after the hand so the wrist always tucks into the sleeve.
function drawArm(c, P, S, Hn, side, sleeveCol, sleeveDark, cuffCol, opt = {}) {
  const fem = !!opt.fem, kind = opt.sleeve || 'long';
  const L1 = opt.L1 || (fem ? 176 : 200), L2 = opt.L2 || (fem ? 162 : 180);
  const z = opt.z !== undefined ? opt.z : 80 * clamp(1 - (Math.abs(Hn[0]) - 60) / 220, 0.3, 1);
  const El = ik3(S, Hn, L1, L2, side, z);
  const ang = Math.atan2(Hn[1] - El[1], Hn[0] - El[0]);
  const dxF = Math.cos(ang), dyF = Math.sin(ang);
  const W = [Hn[0] - dxF * 40 * (opt.hk || 1), Hn[1] - dyF * 40 * (opt.hk || 1)];
  // sleeve radii (shoulder ~66, elbow ~54, wrist ~42 for men) and bare-skin radii
  const sR = fem ? [28, 21.5, 16.5] : [33, 27, 21];
  const kR = fem ? [24, 17, 12.5] : [30, 23, 17];
  const light = shade(sleeveCol, 0.16);
  const contour = shade(sleeveDark, -0.25);
  const lit = (ax, ay, bx, by, r, c0, c1, c2) => {
    const vx = bx - ax, vy = by - ay, l = Math.hypot(vx, vy) || 1;
    let nx = -vy / l, ny = vx / l;
    if (nx * -0.6 + ny * -0.8 < 0) { nx = -nx; ny = -ny; }
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const g = c.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
    g.addColorStop(0, c0); g.addColorStop(0.45, c1); g.addColorStop(1, c2);
    return g;
  };
  const twoBone = (r, from, to, fill1, fill2, stroke, lw, between) => {
    // from/to fractions along the chain: 0 = shoulder, 1 = elbow, 2 = wrist
    const pt = u => u <= 1 ? [lerp(S[0], El[0], u), lerp(S[1], El[1], u)] : [lerp(El[0], W[0], u - 1), lerp(El[1], W[1], u - 1)];
    const rad = u => u <= 1 ? lerp(r[0], r[1], u) : lerp(r[1], r[2], u - 1);
    const segs = [];
    if (from < 1) segs.push([from, Math.min(1, to)]);
    if (to > 1) segs.push([Math.max(1, from), to]);
    if (stroke) {
      c.strokeStyle = stroke; c.lineWidth = lw;
      segs.forEach(([a, b]) => { const A = pt(a), B = pt(b); capsulePath(c, A[0], A[1], rad(a), B[0], B[1], rad(b)); c.stroke(); });
    }
    if (between) between();
    segs.forEach(([a, b], i) => {
      const A = pt(a), B = pt(b);
      c.fillStyle = (a < 1 ? fill1 : fill2)(A, B, Math.max(rad(a), rad(b)));
      capsulePath(c, A[0], A[1], rad(a), B[0], B[1], rad(b)); c.fill();
    });
    return { pt, rad };
  };
  const skinFill = (A, B, r) => lit(A[0], A[1], B[0], B[1], r, P.light, P.skin, P.dark);
  const clothFill = (A, B, r) => lit(A[0], A[1], B[0], B[1], r, light, sleeveCol, sleeveDark);
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';
  // soft cast shadow of the forearm onto the torso
  if (opt.shadowClip) {
    c.save(); opt.shadowClip(c);
    c.fillStyle = hexA('#1a0f20', 0.16);
    capsulePath(c, El[0] + 6, El[1] + 12, sR[1] + 4, W[0] + 6, W[1] + 14, sR[2] + 4); c.fill();
    c.restore();
  }
  // bare skin underneath where the sleeve stops short
  let sleeveEnd = 2;
  if (kind === 'short') sleeveEnd = 0.5;
  if (kind === 'three4') sleeveEnd = 1.38;
  if (sleeveEnd < 2) {
    twoBone(kR, 0.2, 2, skinFill, skinFill, hexA(P.deep, 0.5), 4);
    // forearm muscle / wrist definition
    const mid = [lerp(El[0], W[0], 0.3), lerp(El[1], W[1], 0.3)];
    glowDot(c, mid[0] - 4, mid[1] - 6, kR[1] * 0.9, hexA(P.light, 0.35), 1);
  }
  // sleeve
  const sr = kind === 'short' ? [sR[0] + 2, sR[0] - 2, sR[0] - 2] : sR;
  // deltoid cap in the torso colour, laid over the contour so the shoulder blends into the body
  const deltoid = () => {
    const tc = opt.torsoCol || sleeveCol;
    const g = c.createLinearGradient(S[0] - side * 30, S[1] - 40, S[0] + side * 20, S[1] + 30);
    g.addColorStop(0, shade(tc, 0.04)); g.addColorStop(1, tc);
    c.fillStyle = g;
    c.beginPath(); c.ellipse(S[0] - side * 8, S[1] - 12, sR[0] + 2, sR[0] * 0.62, side * 0.38, 0, TAU); c.fill();
  };
  const G = twoBone(sr, 0, sleeveEnd, clothFill, clothFill, contour, 4, deltoid);
  // folds: elbow crease + gather
  const ep = G.pt(Math.min(1, sleeveEnd));
  if (sleeveEnd >= 1) {
    c.strokeStyle = hexA(shade(sleeveDark, -0.3), 0.55); c.lineWidth = 2.2;
    const ua = Math.atan2(El[1] - S[1], El[0] - S[0]);
    let bend = ang - ua; while (bend > Math.PI) bend -= TAU; while (bend < -Math.PI) bend += TAU;
    for (let k = 0; k < 2; k++) {
      const off = 10 + k * 9;
      const px = El[0] - Math.cos(ua) * off, py = El[1] - Math.sin(ua) * off;
      const nx = -Math.sin(ua), ny = Math.cos(ua);
      const inner = Math.sign(bend) || 1;
      c.beginPath();
      c.moveTo(px + nx * inner * sR[1] * 0.9, py + ny * inner * sR[1] * 0.9);
      c.quadraticCurveTo(px + nx * inner * 2 + Math.cos(ua) * 6, py + ny * inner * 2 + Math.sin(ua) * 6, px - nx * inner * sR[1] * 0.2, py - ny * inner * sR[1] * 0.2);
      c.stroke();
    }
    c.strokeStyle = hexA(light, 0.35); c.lineWidth = 2;
    const q = G.pt(0.55), nx = -Math.sin(Math.atan2(El[1] - S[1], El[0] - S[0])), ny = Math.cos(Math.atan2(El[1] - S[1], El[0] - S[0]));
    c.beginPath(); c.moveTo(q[0] - nx * 12, q[1] - ny * 12); c.quadraticCurveTo(q[0] + 4, q[1] + 6, q[0] + nx * 10, q[1] + ny * 10); c.stroke();
  }
  // sleeve hem for short / three-quarter sleeves
  if (sleeveEnd < 2) {
    const u = sleeveEnd, A = G.pt(Math.max(0, u - 0.06)), B = G.pt(u);
    const a = Math.atan2(B[1] - A[1], B[0] - A[0]), r = G.rad(u);
    c.save(); c.translate(B[0], B[1]); c.rotate(a);
    if (kind === 'three4') { // scalloped lace edge
      c.fillStyle = P.cream || '#fff6ee';
      for (let k = -3; k <= 3; k++) { c.beginPath(); c.arc(2, k * r / 3.3, r / 6.2, -Math.PI / 2, Math.PI / 2); c.fill(); }
      c.strokeStyle = P.gold || '#d6aa5c'; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(-1, -r); c.lineTo(-1, r); c.stroke();
    } else { // polo sleeve band with a small batik trim
      c.fillStyle = shade(sleeveCol, -0.08); rr(c, -9, -r, 10, r * 2, 3); c.fill();
      c.save(); rr(c, -9, -r, 10, r * 2, 3); c.clip();
      kawung(c, -9, -r, 10, r * 2, 7, hexA('#fff1d6', 0.6), null);
      c.restore();
    }
    c.restore();
  }
  c.restore();
  const cuff = () => {
    if (sleeveEnd < 2) {
      if (kind === 'three4') { // thin gold bangle
        const b = [Hn[0] - dxF * 34, Hn[1] - dyF * 34];
        c.save(); c.translate(b[0], b[1]); c.rotate(ang);
        c.strokeStyle = P.gold || '#d6aa5c'; c.lineWidth = 3;
        c.beginPath(); c.ellipse(0, 0, 3.5, kR[2] + 2, 0, -Math.PI / 2, Math.PI / 2); c.stroke();
        c.restore();
      }
      return;
    }
    c.save(); c.translate(W[0], W[1]); c.rotate(ang);
    const r = sR[2];
    if (kind === 'blazer') {
      // shirt cuff peeking out of the jacket sleeve + cufflink
      c.fillStyle = '#f7f4fb'; c.strokeStyle = '#c9c0dc'; c.lineWidth = 1.5;
      rr(c, -6, -r * 0.92, 15, r * 1.84, 5); c.fill(); c.stroke();
      c.fillStyle = '#d9b46a'; c.beginPath(); c.arc(4, r * 0.5, 2.6, 0, TAU); c.fill();
      c.fillStyle = clothFill([0, -r], [0, r], r);
      c.strokeStyle = contour; c.lineWidth = 3;
      rr(c, -26, -r - 2, 22, r * 2 + 4, 7); c.stroke(); c.fill();
      c.fillStyle = shade(sleeveDark, -0.1);
      [-8, -15, -22].forEach(x => { c.beginPath(); c.arc(x, r - 4, 2, 0, TAU); c.fill(); });
    } else if (kind === 'long' || kind === 'tunic') {
      // ribbed cuff, slightly bunched
      c.fillStyle = cuffCol; c.strokeStyle = contour; c.lineWidth = 3;
      rr(c, -14, -r * 0.9, 18, r * 1.8, 7); c.stroke(); c.fill();
      if (kind === 'tunic') {
        c.save(); rr(c, -14, -r * 0.9, 18, r * 1.8, 7); c.clip();
        kawung(c, -14, -r, 18, r * 2, 9, hexA(P.goldHi || '#f6dc96', 0.75), hexA('#ffffff', 0.6));
        c.restore();
      } else {
        c.strokeStyle = hexA('#000000', 0.18); c.lineWidth = 1.2;
        for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(-12, k * r * 0.24); c.lineTo(2, k * r * 0.24); c.stroke(); }
      }
      c.strokeStyle = hexA(shade(sleeveDark, -0.3), 0.5); c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(-26, -r * 0.7); c.quadraticCurveTo(-20, 0, -27, r * 0.7); c.stroke();
    }
    c.restore();
  };
  return { El, ang, W, cuff };
}

// ---------- phone (back side, as seen by viewer) ----------
function drawPhoneBack(c, x, y, a, col, glowCol) {
  col = hex6(col);
  c.save();
  c.translate(x, y); c.rotate(a);
  c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
  const g = c.createLinearGradient(-50, -95, 50, 95);
  g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, mixHex(col, '#000000', 0.3));
  c.fillStyle = g;
  rr(c, -52, -98, 104, 196, 20); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.strokeStyle = mixHex(col, '#ffffff', 0.4); c.lineWidth = 2; c.stroke();
  c.fillStyle = mixHex(col, '#000000', 0.25);
  rr(c, -42, -88, 44, 44, 12); c.fill();
  [[-30, -76], [-14, -76], [-30, -58]].forEach(([cx, cy]) => {
    c.fillStyle = '#0c0d12'; c.beginPath(); c.arc(cx, cy, 6.5, 0, TAU); c.fill();
    c.fillStyle = 'rgba(120,160,255,0.6)'; c.beginPath(); c.arc(cx - 2, cy - 2, 2, 0, TAU); c.fill();
  });
  drawHeart(c, 0, 10, 18, '#ffffff', 0.35, false);
  c.restore();
  if (glowCol) glowDot(c, x, y - 120, 150, hexA(hex6(glowCol), 1), 0.25);
}

// ---------- torso outfits (men) ----------
function torsoPath(c, wide = 1) {
  c.beginPath();
  c.moveTo(-50, -36);
  c.bezierCurveTo(-92 * wide, -24, -142 * wide, -10, -168 * wide, 22);
  c.bezierCurveTo(-196 * wide, 58, -206 * wide, 150, -208 * wide, 280);
  c.lineTo(-214 * wide, 560);
  c.lineTo(214 * wide, 560);
  c.lineTo(208 * wide, 280);
  c.bezierCurveTo(206 * wide, 150, 196 * wide, 58, 168 * wide, 22);
  c.bezierCurveTo(142 * wide, -10, 92 * wide, -24, 50, -36);
  c.quadraticCurveTo(0, -14, -50, -36);
  c.closePath();
}
function drawNeck(c, P, fem) {
  const w0 = fem ? 25 : 36, w1 = fem ? 31 : 46;
  const ng = c.createLinearGradient(-w1, 0, w1, 0);
  ng.addColorStop(0, mixHex(P.dark, P.sss, 0.15)); ng.addColorStop(0.35, P.skin); ng.addColorStop(0.7, mixHex(P.skin, P.dark, 0.45)); ng.addColorStop(1, P.deep);
  c.fillStyle = ng;
  c.beginPath();
  c.moveTo(-w0, -116); c.lineTo(w0, -116);
  c.bezierCurveTo(w0 + 1, -60, w0 + 4, -30, w1 + 12, 6);
  c.lineTo(-w1 - 12, 6);
  c.bezierCurveTo(-w0 - 4, -30, -w0 - 1, -60, -w0, -116);
  c.closePath(); c.fill();
  // head's cast shadow under the jaw
  const cs = c.createLinearGradient(0, -80, 0, -28);
  cs.addColorStop(0, hexA(P.deep, 0.75)); cs.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = cs; c.fillRect(-w1 - 4, -100, w1 * 2 + 8, 74);
  // sternocleidomastoid & adam's apple
  c.strokeStyle = hexA(P.deep, 0.18); c.lineWidth = fem ? 1.5 : 2.4; c.lineCap = 'round';
  [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * (w0 - 4), -70); c.quadraticCurveTo(s * (w0 - 10), -30, s * 8, -4); c.stroke(); });
  if (!fem) glowDot(c, -1, -46, 9, hexA(P.light, 0.45), 1);
}
function drawTorso(c, P, o) {
  const outfit = P.outfit;
  if (outfit === 'hoodie') { // hood bunched behind the neck
    const hg = c.createLinearGradient(0, -70, 0, 20);
    hg.addColorStop(0, P.topDark); hg.addColorStop(1, P.top);
    c.fillStyle = hg;
    c.beginPath(); c.ellipse(0, -18, 116, 50, 0, 0, TAU); c.fill();
  }
  drawNeck(c, P, false);
  const tg = c.createLinearGradient(-200, -20, 200, 320);
  tg.addColorStop(0, P.topHi); tg.addColorStop(0.35, P.top); tg.addColorStop(1, P.topDark);
  c.fillStyle = tg;
  torsoPath(c); c.fill();
  // chest/pec form shading
  c.save(); torsoPath(c); c.clip();
  glowDot(c, -70, 110, 110, hexA('#ffffff', 0.08), 1);
  const sd = c.createLinearGradient(110, 0, 210, 0);
  sd.addColorStop(0, hexA('#000000', 0)); sd.addColorStop(1, hexA('#000000', 0.18));
  c.fillStyle = sd; c.fillRect(100, -40, 120, 600);
  c.restore();
  const neckFill = () => {
    const g = c.createLinearGradient(-40, 0, 40, 0);
    g.addColorStop(0, P.dark); g.addColorStop(0.4, P.skin); g.addColorStop(1, P.dark);
    return g;
  };
  if (outfit === 'hoodie') {
    // inner tee
    c.fillStyle = P.inner;
    c.beginPath(); c.moveTo(-50, -32); c.quadraticCurveTo(0, 60, 50, -32); c.closePath(); c.fill();
    c.fillStyle = neckFill();
    c.beginPath(); c.moveTo(-40, -34); c.quadraticCurveTo(0, 40, 40, -34); c.closePath(); c.fill();
    const ls = c.createLinearGradient(0, -34, 0, 12);
    ls.addColorStop(0, hexA(P.deep, 0.5)); ls.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = ls; c.beginPath(); c.moveTo(-40, -34); c.quadraticCurveTo(0, 40, 40, -34); c.closePath(); c.fill();
    // hood opening rim
    c.lineCap = 'round';
    c.strokeStyle = P.topDark; c.lineWidth = 20;
    c.beginPath(); c.moveTo(-74, -26); c.quadraticCurveTo(0, 82, 74, -26); c.stroke();
    c.strokeStyle = hexA(P.topHi, 0.6); c.lineWidth = 4;
    c.beginPath(); c.moveTo(-80, -30); c.quadraticCurveTo(0, 74, 80, -30); c.stroke();
    // drawstrings
    [-1, 1].forEach(s => {
      const sw = Math.sin(o.t * 0.9 + s) * 2;
      c.strokeStyle = '#ece6dc'; c.lineWidth = 5;
      c.beginPath(); c.moveTo(s * 26, 30); c.quadraticCurveTo(s * 32, 90, s * 29 + sw, 160); c.stroke();
      c.fillStyle = '#b8b2a6'; rr(c, s * 29 - 4 + sw, 156, 8, 17, 3); c.fill();
    });
    // kangaroo pocket & folds
    c.strokeStyle = hexA(P.topDark, 0.8); c.lineWidth = 4;
    c.beginPath(); c.moveTo(-120, 560); c.lineTo(-104, 400); c.quadraticCurveTo(0, 384, 104, 400); c.lineTo(120, 560); c.stroke();
    c.strokeStyle = hexA(P.topDark, 0.55); c.lineWidth = 3;
    [[-130, 130, -110, 270], [136, 150, 120, 290], [-50, 300, -30, 380]].forEach(([a, b, d, e]) => {
      c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + d) / 2 + 18, (b + e) / 2, d, e); c.stroke();
    });
  } else if (outfit === 'blazer') {
    const sg = c.createLinearGradient(0, -30, 0, 360);
    sg.addColorStop(0, '#ffffff'); sg.addColorStop(1, '#ddd6ee');
    c.fillStyle = sg;
    c.beginPath(); c.moveTo(-64, -32); c.lineTo(64, -32); c.lineTo(26, 560); c.lineTo(-26, 560); c.closePath(); c.fill();
    // open collar: skin V
    c.fillStyle = neckFill();
    c.beginPath(); c.moveTo(-34, -34); c.lineTo(0, 44); c.lineTo(34, -34); c.closePath(); c.fill();
    const ls = c.createLinearGradient(0, -34, 0, 30);
    ls.addColorStop(0, hexA(P.deep, 0.45)); ls.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = ls; c.beginPath(); c.moveTo(-34, -34); c.lineTo(0, 44); c.lineTo(34, -34); c.closePath(); c.fill();
    // placket & buttons
    c.strokeStyle = hexA('#b9b0d0', 0.8); c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(4, 50); c.lineTo(6, 560); c.stroke();
    c.fillStyle = '#e6e0f0'; [92, 170, 248].forEach(y => { c.beginPath(); c.arc(0, y, 3.2, 0, TAU); c.fill(); });
    // collar wings
    [-1, 1].forEach(s => {
      c.fillStyle = '#fbf9ff'; c.strokeStyle = '#c8bfdc'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(s * 34, -46); c.lineTo(s * 70, -20); c.lineTo(s * 52, 34); c.lineTo(s * 6, 50); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = hexA('#9a90b8', 0.25);
      c.beginPath(); c.moveTo(s * 52, 34); c.lineTo(s * 6, 50); c.lineTo(s * 30, 30); c.closePath(); c.fill();
    });
    // lapels (notched) with roll highlight
    [-1, 1].forEach(s => {
      const lg = c.createLinearGradient(s * 40, 0, s * 120, 220);
      lg.addColorStop(0, P.topHi); lg.addColorStop(1, P.top);
      c.fillStyle = lg;
      c.beginPath(); c.moveTo(s * 64, -28); c.lineTo(s * 110, 58); c.lineTo(s * 88, 88); c.lineTo(s * 104, 118); c.lineTo(s * 26, 336); c.lineTo(s * 58, -22); c.closePath(); c.fill();
      c.strokeStyle = hexA('#0d1430', 0.6); c.lineWidth = 2.5; c.stroke();
      c.strokeStyle = hexA('#ffffff', 0.18); c.lineWidth = 2;
      c.beginPath(); c.moveTo(s * 62, -14); c.lineTo(s * 32, 320); c.stroke();
    });
    // pocket square & welt
    c.fillStyle = P.accent;
    c.beginPath(); c.moveTo(118, 150); c.lineTo(128, 128); c.lineTo(138, 142); c.lineTo(148, 124); c.lineTo(158, 150); c.closePath(); c.fill();
    c.strokeStyle = hexA('#0d1430', 0.7); c.lineWidth = 3;
    c.beginPath(); c.moveTo(110, 150); c.lineTo(166, 150); c.stroke();
    c.fillStyle = '#1a2240'; c.beginPath(); c.arc(28, 360, 5, 0, TAU); c.fill();
  } else if (outfit === 'polo') {
    c.fillStyle = neckFill();
    c.beginPath(); c.moveTo(-30, -32); c.lineTo(0, 34); c.lineTo(30, -32); c.closePath(); c.fill();
    const ls = c.createLinearGradient(0, -32, 0, 24);
    ls.addColorStop(0, hexA(P.deep, 0.45)); ls.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = ls; c.beginPath(); c.moveTo(-30, -32); c.lineTo(0, 34); c.lineTo(30, -32); c.closePath(); c.fill();
    // placket
    c.fillStyle = shade(P.top, -0.05); c.strokeStyle = hexA(P.topDark, 0.8); c.lineWidth = 2;
    c.beginPath(); c.rect(-12, 30, 24, 80); c.fill(); c.stroke();
    c.fillStyle = '#ffffff'; [54, 88].forEach(y => { c.beginPath(); c.arc(0, y, 3.6, 0, TAU); c.fill(); });
    // collar with a thin batik band
    [-1, 1].forEach(s => {
      c.fillStyle = '#ffffff'; c.strokeStyle = '#e7d9e2'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(s * 30, -44); c.lineTo(s * 74, -18); c.lineTo(s * 44, 22); c.lineTo(s * 4, 34); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = hexA('#b8a6c8', 0.25);
      c.beginPath(); c.moveTo(s * 44, 22); c.lineTo(s * 4, 34); c.lineTo(s * 26, 16); c.closePath(); c.fill();
    });
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-112, 112, 20, 0, TAU); c.fill();
    drawHeart(c, -112, 114, 22, '#ff4f8b', 1, false);
    c.strokeStyle = hexA(P.topDark, 0.5); c.lineWidth = 3;
    [[-140, 160, -120, 300], [140, 170, 124, 300]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + d) / 2 + 16, (b + e) / 2, d, e); c.stroke(); });
  }
  if (o.rim) {
    c.save(); torsoPath(c); c.clip();
    const rs = o.rimSide || 1;
    const rg = c.createRadialGradient(rs * 200, 40, 10, rs * 200, 40, 190);
    rg.addColorStop(0, hexA(hex6(o.rim), 0.5)); rg.addColorStop(1, hexA(hex6(o.rim), 0));
    c.globalCompositeOperation = 'screen';
    c.fillStyle = rg; c.fillRect(-260, -60, 520, 400);
    c.restore();
  }
}

// ---------- shared head painter ----------
function paintFace(c, P, F, o, covered) {
  const C = P.face, fem = !!C.shape.fem;
  C.brow = C.brow || {};
  facePath(c, C.shape);
  const fg = c.createRadialGradient(-30, -214, 10, -6, -180, 178);
  fg.addColorStop(0, P.light); fg.addColorStop(0.5, P.skin); fg.addColorStop(1, mixHex(P.skin, P.dark, 0.75));
  c.fillStyle = fg; c.fill();
  c.save(); facePath(c, C.shape); c.clip();
  faceShade(c, P, F, o, Object.assign({}, C, { brow: C.brow.y }), covered);
  c.restore();
  if (!fem) beardDraw(c, P, P.beard, C);
  drawNose(c, P, C.nose);
  drawMouth(c, F, P, C.mouthY, fem, P.beard === 'full');
  drawEye(c, -C.ex, C.ey, -1, F, o, P, C.eye);
  drawEye(c, C.ex, C.ey, 1, F, o, P, C.eye);
  drawBrow(c, -1, F, P, C.brow);
  drawBrow(c, 1, F, P, C.brow);
}

function sweatDrops(c, F, t) {
  if (F.sweat <= 0) return;
  c.save();
  const drop = (sx, y0, y1, ph, sz) => {
    const p = (t * 0.55 + ph) % 1;
    const a = F.sweat * Math.sin(Math.PI * Math.min(1, p * 1.25)) * 0.9;
    if (a <= 0.01) return;
    const yy = lerp(y0, y1, E.inOutSine(p));
    c.globalAlpha = a;
    const g = c.createLinearGradient(sx - 8, yy - 14, sx + 8, yy + 12);
    g.addColorStop(0, '#f2fbff'); g.addColorStop(1, '#8ccaf5');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(sx, yy - 14 * sz); c.quadraticCurveTo(sx + 9 * sz, yy, sx, yy + 8 * sz); c.quadraticCurveTo(sx - 9 * sz, yy, sx, yy - 14 * sz); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(sx - 2 * sz, yy + 1, 2 * sz, 0, TAU); c.fill();
  };
  drop(86, -200, -155, 0, 1);       // temple, below the hairline
  drop(-90, -192, -160, 0.5, 0.8);
  c.restore();
}

// ---------- main man ----------
function drawMan(c, o) {
  const P = PAL[o.who] || PAL.R;
  const t = o.t || 0;
  const oo = Object.assign({}, o, { blink: o.blink !== undefined ? o.blink : blink(t, P.seed) });
  const F = faceParams(oo);
  const M = idleMotion(t, P.seed, o.breath === undefined ? 1 : o.breath);
  const pose = o.pose || {};
  c.save();
  c.translate(o.x, o.y);
  c.scale(o.s, o.s);
  c.translate(0, o.slump || 0);
  const sx = 1 + M.breath * 0.0025, sy = 1 + M.breath * 0.0045, lean = M.lean;
  const body = (px, py) => {
    const x1 = px * sx, y1 = (py - 560) * sy, cs = Math.cos(lean), s_ = Math.sin(lean);
    return [x1 * cs - y1 * s_, x1 * s_ + y1 * cs + 560];
  };
  const applyBody = () => { c.translate(0, 560); c.rotate(lean); c.scale(sx, sy); c.translate(0, -560); };

  c.save(); applyBody(); drawTorso(c, P, o); c.restore();

  // head – pivots near the top of the neck so the crown doesn't swing like a hinge
  const hb = body(0, -120);
  const sway = M.hair;
  c.save();
  c.translate(hb[0] + M.hx, hb[1] + M.hy);
  c.rotate(lean + (o.tilt || 0) + M.tilt);
  c.translate(o.headX || 0, 120);
  hairBack(c, P, P.style, sway);
  [-1, 1].forEach(s => drawEar(c, P, s, s * (P.face.shape.cw - 1), -166, false));
  {
    const full = P.beard === 'full';
    const js = c.createRadialGradient(4, -40, 4, 4, -40, 64);
    js.addColorStop(0, hexA(P.deep, full ? 0.55 : 0.35)); js.addColorStop(1, hexA(P.deep, 0));
    c.fillStyle = js; c.beginPath(); c.ellipse(4, -40, 64, full ? 26 : 20, 0, 0, TAU); c.fill();
  }
  paintFace(c, P, F, oo, false);
  hairFront(c, P, P.style, t, sway);
  if (P.headset) drawHeadset(c, false);
  sweatDrops(c, F, t);
  c.restore();

  // arms & phone – hands always well below the chin (nothing crosses the face)
  const phoneY = pose.phoneY !== undefined ? pose.phoneY : 215;
  const phoneX = pose.phoneX || 0;
  const phoneA = pose.phoneA || 0;
  const lh = pose.lh || [phoneX - 52, phoneY + 18];
  const rh = pose.rh || [phoneX + 52, phoneY + 18];
  const sleeveKind = P.outfit === 'blazer' ? 'blazer' : (P.outfit === 'polo' ? 'short' : 'long');
  const cuff = P.outfit === 'hoodie' ? P.topDark : P.top;
  const shadowClip = cc => {
    cc.translate(0, 560); cc.rotate(lean); cc.scale(sx, sy); cc.translate(0, -560);
    torsoPath(cc); cc.clip();
    cc.translate(0, 560); cc.scale(1 / sx, 1 / sy); cc.rotate(-lean); cc.translate(0, -560);
  };
  const SL = body(-158, 62), SR = body(158, 62);
  const sleeveHi = P.outfit === 'blazer' ? shade(P.top, 0.06) : P.top;
  const LA = drawArm(c, P, SL, lh, -1, sleeveHi, P.topDark, cuff, { sleeve: sleeveKind, shadowClip });
  const RA = drawArm(c, P, SR, rh, 1, sleeveHi, P.topDark, cuff, { sleeve: sleeveKind, shadowClip });
  if (pose.phone !== false) drawPhoneBack(c, phoneX, phoneY, phoneA, P.phone, o.screenGlow);
  if (pose.prop) pose.prop(c);
  const thumbFront = pose.phone === false;
  drawHand(c, P, lh[0], lh[1], LA.ang, -1, pose.lFist, { thumbFront, k: 1.08 });
  drawHand(c, P, rh[0], rh[1], RA.ang, 1, pose.rFist, { thumbFront, k: 1.08 });
  LA.cuff(); RA.cuff();
  c.restore();
}

// ---------- woman ----------
function womanTorsoPath(c) {
  c.beginPath();
  c.moveTo(-34, -30);
  c.bezierCurveTo(-72, -20, -116, -6, -140, 22);
  c.bezierCurveTo(-164, 50, -170, 110, -168, 170);
  c.bezierCurveTo(-166, 250, -150, 330, -148, 400);
  c.bezierCurveTo(-150, 470, -172, 520, -180, 560);
  c.lineTo(180, 560);
  c.bezierCurveTo(172, 520, 150, 470, 148, 400);
  c.bezierCurveTo(150, 330, 166, 250, 168, 170);
  c.bezierCurveTo(170, 110, 164, 50, 140, 22);
  c.bezierCurveTo(116, -6, 72, -20, 34, -30);
  c.quadraticCurveTo(0, -12, -34, -30);
  c.closePath();
}

function drawKebaya(c, P, o) {
  const tg = c.createLinearGradient(-170, -20, 170, 360);
  tg.addColorStop(0, P.topHi); tg.addColorStop(0.4, P.top); tg.addColorStop(1, P.topDark);
  c.fillStyle = tg;
  womanTorsoPath(c); c.fill();
  c.save(); womanTorsoPath(c); c.clip();
  // lace: tiny five-dot florets
  const R = rng(5);
  c.fillStyle = hexA('#ffffff', 0.32);
  for (let i = 0; i < 70; i++) {
    const x = (R() * 2 - 1) * 170, y = -10 + R() * 560;
    if (Math.abs(x) < 50 && y < 440) continue;
    for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; c.beginPath(); c.arc(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 1.8, 0, TAU); c.fill(); }
  }
  // side shading & bust form
  const sd = c.createLinearGradient(90, 0, 175, 0);
  sd.addColorStop(0, hexA('#a0406a', 0)); sd.addColorStop(1, hexA('#a0406a', 0.2));
  c.fillStyle = sd; c.fillRect(80, -40, 110, 600);
  [-1, 1].forEach(s => {
    c.strokeStyle = hexA('#b25a80', 0.18); c.lineWidth = 3;
    c.beginPath(); c.moveTo(s * 50, 150); c.quadraticCurveTo(s * 90, 176, s * 130, 150); c.stroke();
  });
  c.restore();
  // front opening: cream kemben with a subtle kawung batik
  const open = () => {
    c.beginPath();
    c.moveTo(-46, -26); c.bezierCurveTo(-30, 40, -22, 120, -18, 560);
    c.lineTo(18, 560); c.bezierCurveTo(22, 120, 30, 40, 46, -26);
    c.closePath();
  };
  open(); c.fillStyle = P.cream; c.fill();
  c.save(); open(); c.clip();
  kawung(c, -50, 30, 100, 540, 26, hexA(P.gold, 0.4), hexA('#c98aa0', 0.55));
  // skin of the décolletage above the kemben edge
  const ng = c.createLinearGradient(-40, 0, 40, 0);
  ng.addColorStop(0, P.dark); ng.addColorStop(0.4, P.skin); ng.addColorStop(1, P.dark);
  c.fillStyle = ng;
  c.beginPath(); c.moveTo(-50, -30); c.lineTo(50, -30); c.lineTo(50, 34); c.quadraticCurveTo(0, 48, -50, 34); c.closePath(); c.fill();
  const ls = c.createLinearGradient(0, -30, 0, 30);
  ls.addColorStop(0, hexA(P.deep, 0.35)); ls.addColorStop(1, hexA(P.deep, 0));
  c.fillStyle = ls; c.fillRect(-50, -30, 100, 60);
  // collarbones
  c.strokeStyle = hexA(P.light, 0.5); c.lineWidth = 2;
  [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 8, 4); c.quadraticCurveTo(s * 26, -2, s * 48, 2); c.stroke(); });
  c.strokeStyle = P.gold; c.lineWidth = 2;
  c.beginPath(); c.moveTo(-50, 36); c.quadraticCurveTo(0, 50, 50, 36); c.stroke();
  c.restore();
  // kutubaru "bef" panel across the opening
  c.fillStyle = shade(P.top, -0.04);
  c.beginPath(); c.moveTo(-36, 74); c.lineTo(36, 74); c.lineTo(32, 128); c.lineTo(-32, 128); c.closePath(); c.fill();
  c.strokeStyle = P.gold; c.lineWidth = 2; c.stroke();
  // scalloped lace trim along the opening edges
  [-1, 1].forEach(s => {
    for (let k = 0; k < 18; k++) {
      const u = k / 17, y = lerp(-24, 420, u);
      const x = s * (y < 120 ? lerp(46, 22, (y + 26) / 146) : lerp(22, 18, (y - 120) / 300));
      c.fillStyle = P.cream; c.beginPath(); c.arc(x + s * 3, y, 7, 0, TAU); c.fill();
    }
    c.strokeStyle = P.gold; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(s * 50, -26); c.bezierCurveTo(s * 34, 40, s * 26, 120, s * 24, 440); c.stroke();
  });
  // kerongsang brooches
  [168, 232, 296].forEach((y, i) => {
    if (i) { c.strokeStyle = P.gold; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, y - 64 + 10); c.quadraticCurveTo(6, y - 32, 0, y - 10); c.stroke(); }
    const g = c.createRadialGradient(-2, y - 3, 1, 0, y, 10);
    g.addColorStop(0, P.goldHi); g.addColorStop(1, P.gold);
    c.fillStyle = g;
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; c.beginPath(); c.arc(Math.cos(a) * 6, y + Math.sin(a) * 6, 4, 0, TAU); c.fill(); }
    c.fillStyle = '#f7a8c4'; c.beginPath(); c.arc(0, y, 4, 0, TAU); c.fill();
  });
  // batik obi at the waist
  c.save(); womanTorsoPath(c); c.clip();
  c.fillStyle = '#e48aab'; c.fillRect(-200, 400, 400, 46);
  c.beginPath(); c.rect(-200, 400, 400, 46); c.clip();
  kawung(c, -200, 423, 400, 46, 40, hexA(P.goldHi, 0.7), hexA(P.cream, 0.85));
  c.restore();
  c.strokeStyle = P.gold; c.lineWidth = 2.5;
  [400, 446].forEach(y => { c.beginPath(); c.moveTo(-150, y); c.lineTo(150, y); c.stroke(); });
  // necklace
  c.strokeStyle = P.gold; c.lineWidth = 2;
  c.beginPath(); c.moveTo(-28, -16); c.quadraticCurveTo(0, 22, 28, -16); c.stroke();
  drawHeart(c, 0, 14, 11, '#f2c66d', 1, false);
}

function drawTunic(c, P, o) {
  const tg = c.createLinearGradient(-170, -20, 170, 360);
  tg.addColorStop(0, P.topHi); tg.addColorStop(0.4, P.top); tg.addColorStop(1, P.topDark);
  c.fillStyle = tg;
  womanTorsoPath(c); c.fill();
  c.save(); womanTorsoPath(c); c.clip();
  const sd = c.createLinearGradient(90, 0, 175, 0);
  sd.addColorStop(0, hexA('#7a1a4a', 0)); sd.addColorStop(1, hexA('#7a1a4a', 0.2));
  c.fillStyle = sd; c.fillRect(80, -40, 110, 600);
  // batik placket accent
  c.fillStyle = P.cream; c.fillRect(-14, 120, 28, 440);
  c.beginPath(); c.rect(-14, 120, 28, 440); c.clip();
  kawung(c, -14, 120, 28, 440, 14, hexA(P.gold, 0.55), hexA(P.topDark, 0.6));
  c.restore();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(-104, 210, 17, 0, TAU); c.fill();
  drawHeart(c, -104, 212, 19, '#ff4f8b', 1, false);
}

// hijab shapes
function hijabBack(c, P) {
  const hj = c.createLinearGradient(-150, -320, 150, 200);
  hj.addColorStop(0, shade(P.hijab, 0.22)); hj.addColorStop(1, P.hijabDark);
  c.fillStyle = hj;
  c.beginPath();
  c.moveTo(-122, -196);
  c.bezierCurveTo(-140, -346, 140, -346, 122, -196);
  c.bezierCurveTo(130, -90, 170, -10, 186, 70);
  c.lineTo(-186, 70);
  c.bezierCurveTo(-170, -10, -130, -90, -122, -196);
  c.fill();
}
function hijabFront(c, P, sway) {
  // underscarf (ciput) framing the face and wrapping under the chin
  c.save();
  const base = shade(P.hijab, 0.08);
  const g = c.createLinearGradient(-120, -300, 120, 40);
  g.addColorStop(0, shade(P.hijab, 0.3)); g.addColorStop(0.6, P.hijab); g.addColorStop(1, P.hijabDark);
  c.fillStyle = g;
  c.beginPath();
  // outer contour
  c.moveTo(-124, -196);
  c.bezierCurveTo(-142, -350, 142, -350, 124, -196);
  c.bezierCurveTo(128, -120, 108, -40, 74, -6);
  c.quadraticCurveTo(0, 30, -74, -6);
  c.bezierCurveTo(-108, -40, -128, -120, -124, -196);
  c.closePath();
  // face opening (cut out)
  c.moveTo(-100, -190);
  c.bezierCurveTo(-104, -300, 104, -300, 100, -190);
  c.bezierCurveTo(100, -120, 66, -46, 0, -41);
  c.bezierCurveTo(-66, -46, -100, -120, -100, -190);
  c.closePath();
  c.fill('evenodd');
  // inner band edge + soft folds
  c.strokeStyle = shade(P.hijab, 0.38); c.lineWidth = 6; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-99, -186); c.bezierCurveTo(-104, -294, 104, -294, 99, -186); c.stroke();
  c.strokeStyle = hexA(shade(P.hijabDark, -0.2), 0.45); c.lineWidth = 2.5;
  [[-112, -150, -86, -40], [112, -150, 84, -40], [-40, 6, 40, 6]].forEach(([a, b, d, e], i) => {
    c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo(i < 2 ? (a + d) / 2 + (a < 0 ? -8 : 8) : 0, i < 2 ? (b + e) / 2 : 18, d, e); c.stroke();
  });
  c.restore();
}
function hijabDrape(c, P, sway) {
  // drape over shoulders & chest (raised so it sits like fabric, not a bib)
  const g = c.createLinearGradient(-160, -40, 160, 220);
  g.addColorStop(0, shade(P.hijab, 0.18)); g.addColorStop(0.55, P.hijab); g.addColorStop(1, P.hijabDark);
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(-130, -70);
  c.quadraticCurveTo(0, 60, 130, -70);
  c.bezierCurveTo(150, -20, 160, 40, 150 + sway * 0.5, 100);
  c.quadraticCurveTo(0, 196 + sway * 0.3, -150 + sway * 0.5, 100);
  c.bezierCurveTo(-160, 40, -150, -20, -130, -70);
  c.closePath(); c.fill();
  c.strokeStyle = hexA(shade(P.hijabDark, -0.2), 0.4); c.lineWidth = 2.5; c.lineCap = 'round';
  [[-100, 40, -60, 140], [96, 40, 60, 140], [-20, 70, -10, 170], [30, 70, 24, 168]].forEach(([a, b, d, e]) => {
    c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + d) / 2 + 10, (b + e) / 2, d, e); c.stroke();
  });
  c.strokeStyle = hexA('#ffffff', 0.25); c.lineWidth = 3;
  c.beginPath(); c.moveTo(-120, -40); c.quadraticCurveTo(-60, 60, 0, 60); c.stroke();
}

// long straight hair (Putri)
function longHairBack(c, P, hp, sway) {
  const pts = (arr) => arr.map(([x, y]) => hp(x, y));
  const s = sway;
  const hg = c.createLinearGradient(0, -320, 0, 340);
  hg.addColorStop(0, P.hairHi); hg.addColorStop(0.25, P.hair); hg.addColorStop(1, '#060303');
  c.fillStyle = hg;
  c.beginPath();
  let p = hp(0, -322); c.moveTo(p[0], p[1]);
  const bz = (a, b, d) => { const q = pts([a, b, d]); c.bezierCurveTo(q[0][0], q[0][1], q[1][0], q[1][1], q[2][0], q[2][1]); };
  bz([72, -322], [120, -282], [118, -205]);
  bz([120, -120], [126, -20], [132 + s * 0.4, 110]);
  bz([136 + s * 0.6, 210], [130 + s, 290], [116 + s * 1.2, 330]);
  // strand tips along the bottom
  const tips = [[90, 318], [64, 334], [36, 322], [0, 338], [-36, 322], [-64, 334], [-90, 318]];
  tips.forEach(([x, y]) => { const q = hp(x + s * 1.1, y); c.lineTo(q[0], q[1]); });
  p = hp(-116 + s * 1.2, 330); c.lineTo(p[0], p[1]);
  bz([-130 + s, 290], [-136 + s * 0.6, 210], [-132 + s * 0.4, 110]);
  bz([-126, -20], [-120, -120], [-118, -205]);
  bz([-120, -282], [-72, -322], [0, -322]);
  c.fill();
  // glossy strands
  c.lineCap = 'round';
  for (let k = 0; k < 9; k++) {
    const x0 = -110 + k * 27;
    const a = hp(x0 * 0.9, -200), b = hp(x0 * 1.1 + s * 0.6, 60), d = hp(x0 * 1.05 + s * 1.1, 300);
    c.strokeStyle = k % 2 ? hexA(P.hairSheen, 0.18) : hexA('#000000', 0.35); c.lineWidth = k % 2 ? 2 : 3;
    c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], d[0], d[1]); c.stroke();
  }
}
function longHairStrands(c, P, hp, sway) {
  // two front sections falling over the shoulders (in front of the kebaya, behind the arms)
  const s = sway;
  [-1, 1].forEach(side => {
    const g = c.createLinearGradient(side * 90, -200, side * 130, 220);
    g.addColorStop(0, P.hair); g.addColorStop(0.5, shade(P.hair, 0.04)); g.addColorStop(1, '#070404');
    c.fillStyle = g;
    const P0 = hp(side * 90, -196), A1 = hp(side * 104, -110), A2 = hp(side * 120, -30), A3 = hp(side * 128 + s * 0.3, 50);
    const B1 = hp(side * 138 + s * 0.6, 120), B2 = hp(side * 134 + s * 0.8, 180), B3 = hp(side * 124 + s, 220);
    const T1 = hp(side * 112 + s, 206), T2 = hp(side * 100 + s * 0.9, 222);
    const C1 = hp(side * 96 + s * 0.6, 150), C2 = hp(side * 86, 70), C3 = hp(side * 80, 0);
    const D1 = hp(side * 76, -80), D2 = hp(side * 78, -150), D3 = hp(side * 86, -196);
    c.beginPath();
    c.moveTo(P0[0], P0[1]);
    c.bezierCurveTo(A1[0], A1[1], A2[0], A2[1], A3[0], A3[1]);
    c.bezierCurveTo(B1[0], B1[1], B2[0], B2[1], B3[0], B3[1]);
    c.lineTo(T1[0], T1[1]); c.lineTo(T2[0], T2[1]);
    c.bezierCurveTo(C1[0], C1[1], C2[0], C2[1], C3[0], C3[1]);
    c.bezierCurveTo(D1[0], D1[1], D2[0], D2[1], D3[0], D3[1]);
    c.closePath(); c.fill();
    // sheen strands
    for (let k = 0; k < 3; k++) {
      const a = hp(side * (88 + k * 10), -150), b = hp(side * (100 + k * 12) + s * 0.4, 40), d = hp(side * (106 + k * 9) + s * 0.9, 190);
      c.strokeStyle = hexA(P.hairSheen, 0.3 - k * 0.06); c.lineWidth = 2;
      c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], d[0], d[1]); c.stroke();
    }
  });
}
function longHairFront(c, P, t, sway) {
  c.save();
  const hg = c.createLinearGradient(-60, -330, 40, -160);
  hg.addColorStop(0, P.hairHi); hg.addColorStop(0.35, P.hair); hg.addColorStop(1, '#070404');
  c.fillStyle = hg;
  const s = sway * 0.4;
  const shape = () => {
  c.beginPath();
  c.moveTo(-106, -146);
  c.bezierCurveTo(-118, -240, -80, -320, -14, -324);
  c.bezierCurveTo(52, -328, 114, -292, 110, -206);
  c.bezierCurveTo(108, -196, 104, -192, 100, -194);
  c.bezierCurveTo(94, -232, 66, -264, 24, -270);
  c.bezierCurveTo(-8 + s, -270, -40 + s, -254, -62 + s, -232);
  c.bezierCurveTo(-82 + s, -212, -90, -186, -93, -146);
  c.closePath();
  };
  shape(); c.fill();
  c.save(); shape(); c.clip();
  // glossy halo across the crown
  c.lineCap = 'round';
  const halo = c.createLinearGradient(-90, 0, 100, 0);
  halo.addColorStop(0, hexA(P.hairSheen, 0)); halo.addColorStop(0.35, hexA(P.hairSheen, 0.65)); halo.addColorStop(0.7, hexA(P.hairSheen, 0.35)); halo.addColorStop(1, hexA(P.hairSheen, 0));
  c.strokeStyle = halo; c.lineWidth = 12;
  c.beginPath(); c.moveTo(-92, -252); c.bezierCurveTo(-70, -300, 40, -312, 98, -262); c.stroke();
  // strand separations
  for (let k = 0; k < 8; k++) {
    const x = -84 + k * 24;
    c.strokeStyle = hexA('#000000', 0.45); c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(-14, -322); c.quadraticCurveTo(x * 0.8, -300, x * 1.12 + (x < 0 ? s : 0), -230 + Math.abs(x) * 0.5); c.stroke();
  }
  c.strokeStyle = hexA('#000000', 0.55); c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(-14, -324); c.lineTo(-10, -300); c.stroke();
  c.restore();
  c.restore();
}
function frangipani(c, x, y, s, rot) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (let k = 0; k < 5; k++) {
    c.save(); c.rotate(k / 5 * TAU);
    const pg = c.createLinearGradient(0, 0, 0, -28);
    pg.addColorStop(0, '#ffcf45'); pg.addColorStop(0.45, '#fff6e6'); pg.addColorStop(1, '#ffffff');
    c.fillStyle = pg;
    c.beginPath(); c.ellipse(6, -14, 9, 16, 0.42, 0, TAU); c.fill();
    c.strokeStyle = hexA('#e8cfa8', 0.7); c.lineWidth = 0.8; c.stroke();
    c.restore();
  }
  c.fillStyle = '#f7b733'; c.beginPath(); c.arc(0, 0, 3.5, 0, TAU); c.fill();
  c.restore();
}

function drawWoman(c, o) {
  const P = WPAL[o.who] || WPAL.P;
  const t = o.t || 0;
  const oo = Object.assign({}, o, { blink: o.blink !== undefined ? o.blink : blink(t, P.seed) });
  const F = faceParams(oo);
  F.mw *= 0.92;
  const M = idleMotion(t, P.seed, o.breath === undefined ? 1 : o.breath);
  const pose = o.pose || {};
  c.save();
  c.translate(o.x, o.y);
  c.scale(o.s, o.s);
  c.translate(0, o.slump || 0);
  const sx = 1 + M.breath * 0.0025, sy = 1 + M.breath * 0.0045, lean = M.lean;
  const body = (px, py) => {
    const x1 = px * sx, y1 = (py - 560) * sy, cs = Math.cos(lean), s_ = Math.sin(lean);
    return [x1 * cs - y1 * s_, x1 * s_ + y1 * cs + 560];
  };
  const applyBody = () => { c.translate(0, 560); c.rotate(lean); c.scale(sx, sy); c.translate(0, -560); };
  const hb = body(0, -120);
  const tilt = lean + (o.tilt || 0) + M.tilt;
  const hdx = hb[0] + M.hx + (o.headX || 0), hdy = hb[1] + M.hy;
  const sway = M.hair * 1.4;
  // head-frame point -> body, with hair hanging (rotation fades out toward the tips)
  const hp = (x, y) => {
    const wgt = y < -150 ? 1 : lerp(1, 0.25, clamp((y + 150) / 450));
    const a = tilt * wgt, ca = Math.cos(a), sa = Math.sin(a);
    const lx = x, ly = y + 120;
    return [lx * ca - ly * sa + hdx, lx * sa + ly * ca + hdy];
  };
  const headXf = () => { c.translate(hdx, hdy); c.rotate(tilt); c.translate(0, 120); };

  // behind everything: hair / hijab back
  if (!P.hijab) longHairBack(c, P, hp, sway);
  else { c.save(); headXf(); hijabBack(c, P); c.restore(); }

  // torso
  c.save(); applyBody();
  if (!P.hijab) drawNeck(c, P, true);
  if (P.hijab) drawTunic(c, P, o); else drawKebaya(c, P, o);
  if (P.hijab) hijabDrape(c, P, sway);
  if (o.rim) {
    c.save(); womanTorsoPath(c); c.clip();
    const rs = o.rimSide || 1;
    const rg = c.createRadialGradient(rs * 190, 40, 10, rs * 190, 40, 180);
    rg.addColorStop(0, hexA(hex6(o.rim), 0.45)); rg.addColorStop(1, hexA(hex6(o.rim), 0));
    c.globalCompositeOperation = 'screen'; c.fillStyle = rg; c.fillRect(-240, -60, 480, 400);
    c.restore();
  }
  c.restore();
  if (!P.hijab) longHairStrands(c, P, hp, sway);

  // head
  c.save(); headXf();
  if (!P.hijab) [-1, 1].forEach(s => drawEar(c, P, s, s * 95, -166, true));
  paintFace(c, P, F, oo, !!P.hijab);
  if (!P.hijab) {
    longHairFront(c, P, t, sway);
    // earrings
    [-1, 1].forEach(s => {
      const sw = Math.sin(t * 1.6 + s) * 0.08 + sway * 0.004;
      c.save(); c.translate(s * 97, -140); c.rotate(sw);
      c.fillStyle = P.gold; c.beginPath(); c.arc(0, 0, 4.5, 0, TAU); c.fill();
      c.strokeStyle = P.gold; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 12); c.stroke();
      c.fillStyle = P.goldHi; c.beginPath(); c.ellipse(0, 16, 3.5, 5, 0, 0, TAU); c.fill();
      c.restore();
    });
    if (P.flower) frangipani(c, 88, -262, 1, 0.3 + Math.sin(t * 0.7) * 0.05 + sway * 0.004);
  } else {
    hijabFront(c, P, sway);
    if (P.headset) drawHeadset(c, true);
  }
  c.restore();

  // arms (holding prop at chest)
  const lh = pose.lh || [-62, 190], rh = pose.rh || [62, 190];
  const shadowClip = cc => {
    cc.translate(0, 560); cc.rotate(lean); cc.scale(sx, sy); cc.translate(0, -560);
    womanTorsoPath(cc); cc.clip();
    cc.translate(0, 560); cc.scale(1 / sx, 1 / sy); cc.rotate(-lean); cc.translate(0, -560);
  };
  const kind = P.hijab ? 'tunic' : 'three4';
  const SL = body(-146, 66), SR = body(146, 66);
  const LA = drawArm(c, P, SL, lh, -1, P.top, P.topDark, P.hijab ? P.cream : P.top, { fem: true, sleeve: kind, shadowClip, hk: 0.86 });
  const RA = drawArm(c, P, SR, rh, 1, P.top, P.topDark, P.hijab ? P.cream : P.top, { fem: true, sleeve: kind, shadowClip, hk: 0.86 });
  if (pose.prop) pose.prop(c);
  drawHand(c, P, lh[0], lh[1], LA.ang, -1, pose.lFist, { k: 0.86, thumbFront: true });
  drawHand(c, P, rh[0], rh[1], RA.ang, 1, pose.rFist, { k: 0.86, thumbFront: true });
  LA.cuff(); RA.cuff();
  c.restore();
}
