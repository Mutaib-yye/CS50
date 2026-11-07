// SHOWCASE STYLE: manga — a black-and-white manga page that comes to life (3.0 s).
// Beat: P1 hero dash (speed lines) -> whip to P2 eye close-up (pupil snaps) -> whip + impact frames
// -> P3 black splash panel, fist toward the reader, ドン!  One red accent: the headband.
(() => {
  const INK = '#0b0b0d', PAP = '#f6f3ec', RED = '#d4232b';
  const TAU = Math.PI * 2;
  let INV = false, HS = 1.2;               // impact-frame: everything strictly B/W
  const red = () => INV ? INK : RED;

  // ---------------------------------------------------------------- geometry
  function crs(pts, seg) {
    const out = [], n = pts.length;
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      for (let k = 0; k < seg; k++) {
        const t = k / seg, t2 = t * t, t3 = t2 * t;
        out.push([
          .5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(pts[n - 1]); return out;
  }
  // tapered brush stroke (filled shape). a/b = taper length fraction at start/end, mn = min width ratio
  function ink(pts, w, a = .3, b = .3, mn = 0, seg = 6, col = null) {
    const s = crs(pts, seg), n = s.length; if (n < 2) return;
    const L = [0]; for (let i = 1; i < n; i++) L.push(L[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]));
    const tot = L[n - 1] || 1, lf = [], rt = [];
    for (let i = 0; i < n; i++) {
      const p = s[Math.min(n - 1, i + 1)], q = s[Math.max(0, i - 1)];
      let dx = p[0] - q[0], dy = p[1] - q[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const u = L[i] / tot;
      const pa = a > 0 ? Math.sin(Math.min(1, u / a) * Math.PI / 2) : 1, pb = b > 0 ? Math.sin(Math.min(1, (1 - u) / b) * Math.PI / 2) : 1;
      const ww = w * (mn + (1 - mn) * Math.pow(pa * pb, .8)) / 2;
      lf.push([s[i][0] - dy * ww, s[i][1] + dx * ww]); rt.push([s[i][0] + dy * ww, s[i][1] - dx * ww]);
    }
    ctx.beginPath(); ctx.moveTo(lf[0][0], lf[0][1]);
    for (let i = 1; i < n; i++) ctx.lineTo(lf[i][0], lf[i][1]);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(rt[i][0], rt[i][1]);
    ctx.closePath(); if (col) ctx.fillStyle = col; ctx.fill();
  }
  // smooth closed blob through points; a point with p[2]===1 is a sharp corner
  function blob(pts) {
    const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    ctx.beginPath();
    let st = pts[0][2] ? pts[0] : m(pts[n - 1], pts[0]); ctx.moveTo(st[0], st[1]);
    for (let i = 0; i < n; i++) {
      const p = pts[i], nx = pts[(i + 1) % n], q = nx[2] ? nx : m(p, nx);
      if (p[2]) ctx.lineTo(q[0], q[1]); else ctx.quadraticCurveTo(p[0], p[1], q[0], q[1]);
    }
    ctx.closePath();
  }
  function poly(pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); }
  function limb(a, b, ra, rb) {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ctx.beginPath(); ctx.arc(a[0], a[1], ra, ang + Math.PI / 2, ang + Math.PI * 1.5); ctx.arc(b[0], b[1], rb, ang - Math.PI / 2, ang + Math.PI / 2); ctx.closePath();
  }
  function fs_(fill, lw = 4) { ctx.fillStyle = fill; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); } }
  const rot = (p, c, a) => { const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co]; };

  // ---------------------------------------------------------------- tones (pre-rendered)
  // gradient screentone: dots grow along +y (0 -> 1); transparent background
  function toneGrad(w, hh, sp, r0, r1, curve = 1) {
    const c = mk(w, hh), g = c.getContext('2d'); g.fillStyle = INK;
    for (let y = 0, row = 0; y < hh + sp; y += sp * .5, row++) for (let x = (row % 2) * sp * .5; x < w + sp; x += sp) {
      const r = lerp(r0, r1, Math.pow(clamp(y / hh), curve)); if (r < .35) continue; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
    return c;
  }
  const TONE_V = toneGrad(1100, 900, 13, 0, 7.2, 1.3);     // top-light -> bottom-dark
  const TONE_FLAT = toneGrad(400, 400, 11, 2.6, 2.6);     // 30% flat tone
  const TONE_FLAT_P = MAIN.createPattern(TONE_FLAT, 'repeat');
  const TONE_DK = toneGrad(400, 400, 10, 3.9, 3.9);       // 55% tone
  const TONE_DK_P = MAIN.createPattern(TONE_DK, 'repeat');
  // fine white-dot tone for black areas
  const WDOT = mk(12, 12); (() => { const g = WDOT.getContext('2d'); g.fillStyle = PAP; g.beginPath(); g.arc(6, 6, 1.6, 0, TAU); g.fill(); })();
  const WDOT_P = MAIN.createPattern(WDOT, 'repeat');

  // ---------------------------------------------------------------- page layout (world coords)
  const P1 = [[40, 70], [1040, 70], [1040, 1560], [40, 1640]];
  const P2 = [[40, 1680], [1040, 1600], [1040, 2230], [40, 2270]];
  const P3 = [[-200, 2312], [1280, 2262], [1280, 4300], [-200, 4300]];  // bleed splash

  // ---------------------------------------------------------------- effects
  // speed lines: thin wedges along direction ang, refreshed at 12 fps
  function speedLines(x0, y0, w, hh, ang, n, f, seed, col = INK, len = [200, 700], wd = [2, 9]) {
    ctx.save(); ctx.fillStyle = col;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    for (let i = 0; i < n; i++) {
      const r1 = h2(seed + f, i), r2 = h2(seed + f, i + 99), r3 = h2(seed + f * 3, i + 7);
      const px = x0 + r1 * w, py = y0 + r2 * hh, L = lerp(len[0], len[1], r3), ww = lerp(wd[0], wd[1], h2(i, seed + f));
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + ca * L - sa * ww, py + sa * L + ca * ww); ctx.lineTo(px + ca * L + sa * ww, py + sa * L - ca * ww); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // focus lines: wedges from far outside towards an inner ellipse
  function focusLines(cx, cy, rx, ry, n, f, seed, col = INK, far = 1600, wmax = .022) {
    ctx.save(); ctx.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const a = (i + h2(seed + f, i) * .9) / n * TAU, w = (.15 + h2(seed + f, i + 50)) * wmax, k = 1 + h2(seed + f * 2, i + 3) * .55;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a - w) * far, cy + Math.sin(a - w) * far);
      ctx.lineTo(cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k);
      ctx.lineTo(cx + Math.cos(a + w) * far, cy + Math.sin(a + w) * far); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // hand-lettered SFX (IPAGothic): white halo, heavy ink body, optional red misregistration
  function sfx(str, x, y, size, o = {}) {
    const { rot: r = 0, sc = 1, skew = -.18, gap = .82, redOff = 0, alpha = 1, white = false, stretch = 1 } = o;
    if (sc <= .001 || alpha <= .001) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(r); ctx.scale(sc, sc); ctx.transform(1, 0, skew, 1, 0, 0);
    ctx.font = `${size}px ${fs('IPAGothic')}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const chars = [...str]; const ws = chars.map(c => ctx.measureText(c).width * gap); const tot = ws.reduce((a, b) => a + b, 0);
    const place = (fn) => { let cx = -tot / 2; chars.forEach((c, i) => { const j = i % 2 ? 1 : -1; ctx.save(); ctx.translate(cx + ws[i] / 2, j * size * .05 + i * size * .06); ctx.rotate(j * .06); ctx.scale(1 + i * .05, stretch * (1 + i * .05)); fn(c); ctx.restore(); cx += ws[i]; }); };
    if (redOff && !INV) { ctx.save(); ctx.translate(redOff, redOff * .8); ctx.fillStyle = RED; ctx.strokeStyle = RED; ctx.lineWidth = size * .2; place(c => { ctx.strokeText(c, 0, 0); ctx.fillText(c, 0, 0); }); ctx.restore(); }
    ctx.strokeStyle = white ? INK : PAP; ctx.lineWidth = size * .3; place(c => ctx.strokeText(c, 0, 0));
    ctx.strokeStyle = white ? PAP : INK; ctx.lineWidth = size * .12; place(c => ctx.strokeText(c, 0, 0));
    ctx.fillStyle = white ? PAP : INK; place(c => ctx.fillText(c, 0, 0));
    ctx.restore();
  }

  // ---------------------------------------------------------------- HERO: dash pose (local coords, facing right, origin = hip)
  function hairBack(hc, f, flow, tilt) {
    // spikes streaming backwards (flow = wind strength), animated on 12 fps
    const n = (i, k) => noise2(f * .9 + i * 1.7, k) * flow;
    const spikes = [
      [[40, -62], [-30, -100], [-160 + n(1, 1) * 16, -122 + n(1, 2) * 14], 34],
      [[-10, -80], [-90, -88], [-225 + n(2, 1) * 20, -80 + n(2, 2) * 18], 36],
      [[-40, -60], [-120, -40], [-250 + n(3, 1) * 22, -20 + n(3, 2) * 16], 34],
      [[-55, -25], [-130, 4], [-225 + n(4, 1) * 18, 44 + n(4, 2) * 16], 30],
      [[-50, 10], [-96, 44], [-160 + n(5, 1) * 14, 92 + n(5, 2) * 12], 24],
      [[-20, -90], [-50, -136], [-130 + n(6, 1) * 14, -178 + n(6, 2) * 14], 28],
      [[30, -84], [24, -136], [-26 + n(7, 1) * 10, -176 + n(7, 2) * 10], 24],
      [[50, -70], [70, -120], [40 + n(8, 1) * 8, -150 + n(8, 2) * 8], 18],
    ];
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(tilt); ctx.scale(HS, HS);
    ctx.fillStyle = INK;
    for (const s of spikes) { ctx.beginPath(); const [a, b, c, wv] = s; const nx = -(c[1] - a[1]), ny = c[0] - a[0], d = Math.hypot(nx, ny); ctx.moveTo(a[0] + nx / d * wv, a[1] + ny / d * wv); ctx.quadraticCurveTo(b[0] + nx / d * wv * .6, b[1] + ny / d * wv * .6, c[0], c[1]); ctx.quadraticCurveTo(b[0] - nx / d * wv * .6, b[1] - ny / d * wv * .6, a[0] - nx / d * wv, a[1] - ny / d * wv); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = PAP;
    ink([[-60, -96], [-130, -100], [-200, -86 + n(2, 2) * 18]], 5, .4, .6);
    ink([[-80, -40], [-160, -24], [-230, -18 + n(3, 2) * 16]], 4, .4, .6);
    ctx.restore();
  }
  function hairFront(hc, f, tilt) {
    const n = (i) => noise2(f * .9 + i * 1.3, 4) * 6;
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(tilt); ctx.scale(HS, HS);
    ctx.fillStyle = INK;
    blob([[66, -38], [56, -88], [0, -102], [-64, -78], [-74, -10], [-50, 40], [-16, 30], [-6, -6], [14, -34], [40, -30]]); ctx.fill();
    // bangs: sharp locks over the forehead pointing forward/down
    [[[60, -60], [96 + n(1), -28], 18], [[40, -50], [66 + n(2), -6], 14], [[20, -48], [34 + n(3), 6], 12], [[-6, -40], [6, 22], 12]].forEach(([a, b, w]) => {
      ctx.beginPath(); ctx.moveTo(a[0] - w, a[1] - w * .6); ctx.quadraticCurveTo(a[0] + w * .6, a[1] + 4, b[0], b[1]); ctx.quadraticCurveTo(a[0] - w * .2, a[1] + w, a[0] - w * 1.4, a[1] + w * .2); ctx.closePath(); ctx.fill();
    });
    // sideburn
    ctx.beginPath(); ctx.moveTo(-6, -10); ctx.quadraticCurveTo(10, 20, 4, 44); ctx.quadraticCurveTo(-8, 20, -24, 0); ctx.closePath(); ctx.fill();
    // glossy highlight band
    ctx.fillStyle = PAP;
    ink([[30, -80], [-10, -90], [-56, -74]], 7, .4, .5);
    ink([[38, -72], [10, -78]], 4, .4, .4);
    ink([[-36, -60], [-60, -44]], 4, .4, .4);
    ctx.restore();
  }
  function headProfile(hc, f, tilt, eyeK = 1) {
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(tilt); ctx.scale(HS, HS);
    blob([[-18, -46], [44, -50, 1], [58, -26], [56, -12, 1], [70, 4], [84, 16, 1], [66, 21, 1], [68, 28], [62, 33, 1], [65, 39], [60, 56, 1], [34, 66], [6, 58], [-14, 44], [-24, 8]]);
    fs_(PAP, 3.5);
    ctx.fillStyle = TONE_FLAT_P; blob([[-20, 0], [-10, 40], [10, 56], [34, 62], [20, 40], [6, 10]]); ctx.fill();
    ctx.fillStyle = INK;
    ink([[60, 54], [40, 66], [8, 60], [-14, 44]], 10, .2, .5);   // jaw weight
    ink([[70, 4], [84, 16], [66, 21]], 5, .3, .3);             // nose
    // eye (profile, fierce): almond with big dark iris
    ctx.fillStyle = PAP; blob([[26, -6, 1], [44, -16], [58, -10, 1], [52, 2], [38, 4]]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(48, -5, 7, 11 * eyeK, 0, 0, TAU); ctx.fill(); ctx.fillStyle = PAP; ctx.beginPath(); ctx.arc(47, -10, 2.4, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = INK;
    ink([[22, -6], [40, -18], [62, -12]], 9, .1, .25);
    ink([[34, 6], [52, 4]], 3, .3, .3);
    // brow: thick, angled down to the nose
    ink([[14, -32], [38, -30], [64, -18]], 13, .1, .35);
    ink([[52, -24], [60, -38]], 3, .3, .3);
    // gritted mouth, cheek hatching
    ink([[42, 32], [56, 30], [66, 33]], 5, .3, .2);
    ink([[60, 30], [63, 37]], 2, .2, .2);
    for (let i = 0; i < 3; i++) ink([[16 + i * 9, 16], [8 + i * 9, 30]], 3, .3, .3);
    ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(-4, 10, 13, -1.2, 1.9); ctx.stroke();
    ctx.restore();
  }
  function headband(hc, f, tilt, flow, len = 1) {
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(tilt); ctx.scale(HS, HS);
    const tail = (k) => { const pts = []; for (let i = 0; i <= 7; i++) { const u = i / 7; pts.push([-52 - u * 290 * len, -40 + k * 12 + u * (30 + k * 40) + Math.sin(u * 5 - f * 1.9 + k) * 26 * u * flow + noise1(f * .7 + k * 4 + u * 3) * 14 * u]); } return pts; };
    // tails (behind) as ribbons
    for (const k of [1, 0]) {
      const pts = tail(k);
      ctx.fillStyle = INK; ink(pts, 30, .02, .55, .25); ctx.fillStyle = red(); ink(pts, 21, .02, .55, .2);
    }
    // band across the forehead
    ctx.beginPath(); ctx.moveTo(-56, -52); ctx.quadraticCurveTo(0, -60, 54, -44); ctx.lineTo(56, -30); ctx.quadraticCurveTo(0, -44, -56, -36); ctx.closePath();
    fs_(red(), 3);
    blob([[-62, -50], [-46, -56], [-40, -38], [-58, -32]]); fs_(red(), 3);
    ctx.restore();
  }
  function sideFist(p, ang, r) {
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang);
    blob([[-r * .9, -r * .7], [r * .2, -r * 1.05], [r * 1.05, -r * .55], [r * 1.1, r * .45], [r * .3, r * .95], [-r * .9, r * .7]]); fs_(PAP, r * .13);
    ctx.fillStyle = INK;
    for (let i = 0; i < 3; i++) ink([[r * .45, -r * .62 + i * r * .5], [r * .95, -r * .4 + i * r * .5]], r * .1, .3, .3);
    ink([[-r * .5, r * .2], [r * .2, r * .3], [r * .55, r * .05]], r * .12, .2, .4);   // thumb
    ink([[r * 1.1, -r * .3], [r * 1.1, r * .45], [r * .3, r * .95]], r * .22, .3, .3);  // shadow weight
    ctx.restore();
  }
  function heroDash(f, run) {
    // run: 0..1 cycle phase (12 fps quantised by caller)
    const ph = run * TAU, sw = Math.sin(ph), bob = -Math.abs(Math.cos(ph)) * 12;
    ctx.save(); ctx.translate(0, bob);
    const Hd = [176, -380], N = [118, -290];
    const Sn = [100, -262], Sf = [140, -272];
    const En = [-6 - sw * 16, -150 + sw * 6], Fn = [-108 - sw * 20, -120 + sw * 6];
    const Ef = [250 + sw * 12, -196], Ff = [318 + sw * 12, -300 - sw * 8];
    const Kn = [200 + sw * 12, 70], An = [180 + sw * 10, 268], Tn = [270 + sw * 8, 282];
    const Kf = [-110 - sw * 10, 150], Af = [-262 - sw * 12, 262], Tf = [-344 - sw * 12, 300];
    headband(Hd, f, -.12, 1.2);
    hairBack(Hd, f, 1, -.12);
    // --- far arm (forward) in jacket sleeve
    limb(Sf, Ef, 36, 30); fs_(INK, 0); limb(Ef, Ff, 30, 25); fs_(INK, 0);
    ctx.fillStyle = PAP; ink([[Ef[0] - 10, Ef[1] - 30], [Ff[0] - 30, Ff[1] + 0]], 4, .3, .5);
    sideFist([Ff[0] + 10, Ff[1] - 14], -1.1, 36);
    // --- far leg (pushing off behind): pants tone
    limb([-20, 10], Kf, 52, 40); fs_(TONE_DK_P, 4); limb(Kf, Af, 40, 30); fs_(TONE_DK_P, 4);
    ctx.fillStyle = INK; ink([[-30, 60], Kf, [Af[0] + 10, Af[1] + 30]], 14, .2, .3);
    ctx.save(); ctx.translate(Af[0], Af[1]); ctx.rotate(Math.atan2(Tf[1] - Af[1], Tf[0] - Af[0]) - .2);
    blob([[-16, -30], [44, -32], [92, -12], [98, 18, 1], [-12, 28, 1], [-28, 0]]); fs_(PAP, 4);
    ctx.fillStyle = INK; ctx.fillRect(-12, 15, 110, 13); ink([[22, -30], [32, 6]], 4, .2, .2);
    ctx.restore();
    // --- jacket tails flowing back
    const fl = (k) => noise2(f * .8, k) * 28;
    blob([[40, -260], [-40, -170], [-170, -140 + fl(1)], [-340, -120 + fl(2), 1], [-250, -60 + fl(3)], [-380, -10 + fl(4), 1], [-220, 30 + fl(5)], [-300, 90 + fl(6), 1], [-120, 80], [10, 40]]);
    fs_(INK, 0);
    ctx.fillStyle = '#3a3a3e'; ink([[-40, -150], [-170, -126 + fl(1)], [-320, -116 + fl(2)]], 6, .3, .6);
    ctx.fillStyle = PAP; ink([[30, -240], [-60, -164], [-180, -138 + fl(1)], [-330, -118 + fl(2)]], 5, .3, .7);
    ink([[-70, 70], [-190, 40 + fl(5)], [-360, -4 + fl(4)]], 3, .3, .7);
    // --- torso: white shirt + black open jacket
    blob([[-58, 20], [-40, -120], [14, -246], [104, -310], [164, -290], [140, -170], [106, -60], [74, 30]]); fs_(INK, 0);
    blob([[64, 24], [86, -80], [126, -200], [152, -280], [124, -296], [98, -176], [44, -40], [28, 30]]); fs_(PAP, 3);
    ctx.fillStyle = TONE_FLAT_P; blob([[40, 20], [60, -60], [96, -170], [110, -170], [72, -50], [56, 24]]); ctx.fill();
    ctx.fillStyle = PAP; ink([[-50, -40], [-20, -156], [44, -250], [104, -300]], 7, .3, .5);
    // belt
    ctx.fillStyle = INK; poly([[-62, 10], [78, 22], [76, 46], [-64, 36]]); ctx.fill();
    // --- near leg forward (knee high)
    limb([34, 34], Kn, 54, 42); fs_(TONE_FLAT_P, 4); limb(Kn, An, 42, 30); fs_(TONE_FLAT_P, 4);
    ctx.fillStyle = INK; ink([[-10, 78], [110, 110], [Kn[0] + 10, Kn[1] + 36], [An[0] - 30, An[1]]], 16, .15, .3);
    ink([[Kn[0] - 40, Kn[1] - 34], [Kn[0] - 10, Kn[1] - 12]], 4, .3, .3); ink([[60, 34], [118, 64]], 4, .3, .3); ink([[An[0] - 20, An[1] - 80], [An[0] - 8, An[1] - 40]], 4, .3, .3);
    ctx.save(); ctx.translate(An[0], An[1]); ctx.rotate(Math.atan2(Tn[1] - An[1], Tn[0] - An[0]));
    blob([[-24, -32], [40, -34], [100, -14], [108, 18, 1], [-20, 30, 1], [-34, 0]]); fs_(PAP, 4);
    ctx.fillStyle = INK; ctx.fillRect(-22, 17, 130, 14); ink([[16, -32], [28, 10]], 4, .2, .2); ink([[46, -30], [54, 4]], 3, .2, .2);
    ctx.restore();
    // --- neck + head
    limb(N, [Hd[0] - 14, Hd[1] + 34], 27, 25); fs_(PAP, 3.5);
    ctx.fillStyle = INK; ink([[N[0] + 16, N[1] - 14], [Hd[0] + 6, Hd[1] + 46]], 7, .3, .3);
    headProfile(Hd, f, -.12);
    hairFront(Hd, f, -.12);
    headband(Hd, f, -.12, 0, 0);
    // --- near arm swinging back (straight-ish, fist behind hip)
    limb(Sn, En, 40, 33); fs_(INK, 0); limb(En, Fn, 33, 27); fs_(INK, 0);
    ctx.fillStyle = PAP; ink([[Sn[0] - 24, Sn[1] - 20], [En[0] - 20, En[1] - 22]], 6, .3, .5); ink([[En[0] - 26, En[1] - 18], [Fn[0] - 4, Fn[1] - 28]], 4, .3, .5);
    sideFist([Fn[0] - 18, Fn[1] + 6], Math.PI + .5, 38);
    ctx.restore();
  }
  // ---------------------------------------------------------------- HERO: front-facing (P3 splash)
  function heroFront(f, lt) {
    // origin = face centre. The punching fist is drawn separately, in front.
    const fl = (k, a = 1) => noise2(f * .8, k) * a;
    // headband tails flaring behind, both sides
    for (const s of [-1, 1]) {
      const pts = []; for (let i = 0; i <= 7; i++) { const u = i / 7; pts.push([s * (70 + u * 380), -90 - u * 120 + Math.sin(u * 5 - f * 1.7 + s) * 34 * u + fl(s * 3 + u * 2, 22) * u]); }
      ctx.fillStyle = PAP; ink(pts, 52, .02, .6, .25); ctx.fillStyle = INK; ink(pts, 42, .02, .6, .25); ctx.fillStyle = red(); ink(pts, 30, .02, .6, .2);
    }
    // shoulders + open jacket (black, white rim)
    ctx.lineJoin = 'round';
    const body = () => blob([[-330, 420], [-300, 220], [-150, 150], [-60, 170], [0, 260, 1], [60, 170], [150, 150], [300, 210], [340, 420]]);
    body(); ctx.lineWidth = 14; ctx.strokeStyle = PAP; ctx.stroke(); ctx.fillStyle = INK; ctx.fill();
    blob([[-62, 172], [0, 262, 1], [62, 172], [40, 420], [-40, 420]]); fs_(PAP, 4);
    ctx.fillStyle = TONE_FLAT_P; blob([[-50, 200], [0, 270], [-30, 420], [-44, 420]]); ctx.fill();
    ctx.fillStyle = PAP; ink([[-310, 300], [-260, 200], [-130, 160]], 7, .3, .4); ink([[130, 160], [260, 196], [316, 290]], 7, .3, .4);
    // neck
    blob([[-58, 90], [-52, 196], [0, 222], [52, 196], [58, 90]]); fs_(PAP, 4);
    ctx.fillStyle = TONE_DK_P; blob([[-56, 100], [56, 100], [52, 150], [0, 168], [-52, 150]]); ctx.fill();
    // hair spikes radiating (blown back by the leap), white halo to read on black
    const sp = [[-2.8, 200], [-2.5, 250], [-2.2, 255], [-1.9, 275], [-1.6, 260], [-1.3, 278], [-1.0, 255], [-.72, 236], [-.42, 205], [-3.05, 170], [-.12, 160]];
    const spike = (pad) => sp.forEach(([a, L], i) => {
      const aa = a + fl(i + 10, .07), r0 = 90, LL = L + fl(i + 30, 20) + pad;
      const bx = Math.cos(aa), by = Math.sin(aa), nx = -by, ny = bx, wv = 50 + pad;
      ctx.beginPath(); ctx.moveTo(bx * r0 + nx * wv, -30 + by * r0 + ny * wv); ctx.quadraticCurveTo(bx * LL * .7 + nx * 14, -30 + by * LL * .7 + ny * 14, bx * LL, -30 + by * LL); ctx.quadraticCurveTo(bx * LL * .7 - nx * 14, -30 + by * LL * .7 - ny * 14, bx * r0 - nx * wv, -30 + by * r0 - ny * wv); ctx.closePath(); ctx.fill();
    });
    ctx.fillStyle = PAP; spike(8); blob([[-142, 0], [-134, -136], [0, -192], [134, -136], [142, 0], [0, -60]]); ctx.fill();
    ctx.fillStyle = INK; spike(0); blob([[-132, -4], [-124, -128], [0, -180], [124, -128], [132, -4], [0, -64]]); ctx.fill();
    ctx.fillStyle = PAP; ink([[-80, -150], [-150, -200], [-210, -250]], 6, .3, .7); ink([[60, -156], [110, -210], [150, -250]], 5, .3, .7);
    // face: strong jaw, pointed chin
    blob([[-114, -50], [-110, 36], [-80, 110], [-20, 156, 1], [44, 120], [96, 44], [108, -50], [0, -84]]); fs_(PAP, 5);
    ctx.fillStyle = TONE_FLAT_P; blob([[-112, -20], [-106, 50], [-78, 108], [-30, 136], [-66, 60], [-80, -10]]); ctx.fill();
    ctx.fillStyle = INK; ink([[-110, 36], [-80, 110], [-20, 156], [44, 120]], 12, .3, .3);
    ink([[-96, -10], [-70, 40]], 3, .3, .3); ink([[92, 0], [70, 44]], 3, .3, .3);
    // ears
    for (const s of [-1, 1]) { blob([[s * 104, -26], [s * 132, -34], [s * 136, 10], [s * 108, 34]]); fs_(PAP, 4); }
    // bangs over forehead
    [[-104, -70, -92, -26], [-66, -80, -46, -40], [-24, -84, -6, -48], [16, -84, 30, -46], [58, -76, 74, -38], [98, -60, 110, -20]].forEach(([x0, y0, x1, y1], i) => {
      ctx.beginPath(); ctx.moveTo(x0 - 28, y0 - 12); ctx.quadraticCurveTo(x0 + 6, y0 + 10, x1 + fl(i + 60, 5), y1); ctx.quadraticCurveTo(x0 + 18, y0, x0 + 30, y0 - 16); ctx.closePath(); ctx.fill();
    });
    // eyes in the shadow of the brow (fierce)
    ctx.fillStyle = TONE_DK_P; blob([[-104, -44], [0, -30], [104, -44], [100, -20], [0, -6], [-100, -20]]); ctx.fill();
    for (const s of [-1, 1]) {
      ctx.save(); ctx.translate(s * 50, -6); ctx.scale(s, 1);
      const eye = () => blob([[-40, 4, 1], [-4, -18], [40, -16, 1], [30, 12], [-6, 16]]);
      ctx.fillStyle = PAP; eye(); ctx.fill();
      ctx.save(); eye(); ctx.clip(); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(-4, 0, 10, 13, 0, 0, TAU); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(-4, 0, 16, 0, TAU); ctx.stroke();
      ctx.fillStyle = PAP; ctx.beginPath(); ctx.arc(-7, -4, 3.5, 0, TAU); ctx.fill(); ctx.restore();
      ctx.fillStyle = INK; ink([[-46, 6], [-10, -20], [40, -17], [54, -28]], 11, .1, .3);
      ink([[-26, 18], [24, 14]], 3.5, .3, .3);
      ink([[-50, -38], [-10, -44], [52, -62]], 19, .08, .45);
      ink([[-6, -52], [8, -40]], 3, .3, .3);
      ctx.restore();
    }
    ctx.fillStyle = INK; ink([[-14, -50], [-4, -30]], 4, .3, .3); ink([[14, -50], [4, -30]], 4, .3, .3);
    ink([[6, 8], [16, 40], [0, 46]], 5, .3, .3);
    // yelling mouth: clenched teeth rows, corners pulled down
    blob([[-56, 74, 1], [-20, 62], [20, 62], [56, 74, 1], [36, 104], [0, 112], [-36, 104]]); fs_(INK, 0);
    ctx.fillStyle = PAP; blob([[-48, 74, 1], [0, 66], [48, 74, 1], [40, 84, 1], [-40, 84, 1]]); ctx.fill();
    blob([[-30, 104, 1], [0, 108], [30, 104, 1], [26, 96, 1], [-26, 96, 1]]); ctx.fill();
    ctx.fillStyle = INK; for (let i = -2; i <= 2; i++) ink([[i * 15, 68], [i * 15, 84]], 2.5, .2, .2);
    ink([[-66, 70], [-56, 80], [-60, 92]], 4, .3, .3); ink([[66, 70], [56, 80], [60, 92]], 4, .3, .3);
    ink([[-20, 130], [20, 130]], 3, .3, .3);
    // headband over bangs + knot
    ctx.beginPath(); ctx.moveTo(-132, -96); ctx.quadraticCurveTo(0, -128, 132, -96); ctx.lineTo(128, -68); ctx.quadraticCurveTo(0, -100, -128, -68); ctx.closePath(); fs_(red(), 4.5);
    ctx.fillStyle = INK; ink([[-120, -80], [0, -108], [120, -80]], 3, .3, .3);
    // sweat drop
    ctx.fillStyle = PAP; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
    blob([[150, -50, 1], [164, -12], [150, 4], [136, -10]]); ctx.fill(); ctx.stroke();
  }
  function fist(f) {
    // giant foreshortened fist punching at the reader. origin = fist centre
    ctx.lineJoin = 'round';
    const sleeve = () => blob([[-40, -210], [-300, -200], [-470, -150], [-520, -80], [-470, -10], [-300, 60], [-40, 180]]);
    sleeve(); ctx.lineWidth = 16; ctx.strokeStyle = PAP; ctx.stroke(); ctx.fillStyle = INK; ctx.fill();
    ctx.fillStyle = PAP;
    ink([[-500, -130], [-330, -186], [-150, -200]], 7, .3, .6);
    ink([[-330, -150], [-290, -110], [-330, -60]], 5, .3, .3); ink([[-250, -170], [-200, -110], [-250, -40], [-210, 20]], 6, .3, .3);
    ink([[-420, -110], [-390, -70]], 4, .3, .3); ink([[-170, -150], [-140, -60]], 4, .3, .3);
    ink([[-480, -30], [-330, 30], [-150, 120]], 4, .3, .6);
    // cuff
    ctx.save(); ctx.translate(-70, -10); ctx.rotate(-.15);
    ctx.beginPath(); ctx.ellipse(0, 0, 150, 200, 0, 0, TAU); ctx.lineWidth = 14; ctx.strokeStyle = PAP; ctx.stroke(); ctx.fillStyle = INK; ctx.fill();
    ctx.fillStyle = PAP; ink([[-130, -110], [-60, -186], [40, -196]], 6, .3, .3);
    ctx.restore();
    // hand back (behind fingers)
    blob([[-220, -10], [-190, -160], [0, -220], [190, -170], [250, -20], [210, 150], [0, 220], [-190, 140]]); fs_(PAP, 6);
    // proximal finger segments (the punching face), arc of four
    const fx = [-150, -52, 46, 142], fyo = [16, -4, -4, 18];
    for (let i = 0; i < 4; i++) {
      const x = fx[i], y = -150 + fyo[i], w = 98 - Math.abs(i - 1.5) * 6, hh = 128;
      ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, hh, [44, 44, 26, 26]); fs_(PAP, 5);
      ctx.fillStyle = INK; ink([[x - w * .28, y + 26], [x, y + 18], [x + w * .28, y + 26]], 4, .3, .3);   // knuckle crease
      ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, hh, [44, 44, 26, 26]); ctx.clip();
      ctx.fillStyle = TONE_FLAT_P; ctx.fillRect(x + w * .18, y, w, hh); ctx.restore();
      // curled middle segment underneath
      const y2 = y + hh - 8, h2_ = 74;
      ctx.beginPath(); ctx.roundRect(x - w / 2 + 4, y2, w - 8, h2_, [10, 10, 34, 34]); fs_(PAP, 5);
      ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2 + 4, y2, w - 8, h2_, [10, 10, 34, 34]); ctx.clip(); ctx.fillStyle = TONE_DK_P; ctx.fillRect(x - w, y2 + h2_ * .55, w * 2, h2_); ctx.restore();
    }
    // thumb wrapped across the middle segments
    blob([[-230, 70], [-120, 44], [10, 60], [84, 92], [70, 140], [-60, 150], [-200, 140]]); fs_(PAP, 5.5);
    ctx.fillStyle = TONE_FLAT_P; blob([[-200, 120], [-60, 130], [70, 126], [60, 142], [-60, 152], [-200, 142]]); ctx.fill();
    ctx.fillStyle = INK; ink([[-210, 140], [-60, 152], [76, 136]], 12, .2, .3);
    ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(36, 92, 30, 20, .2, -2.4, 1.2); ctx.stroke();
    // heavy contour on the shadow side
    ink([[190, -150], [252, -20], [230, 150], [60, 226]], 18, .25, .3);
    // speed highlights
    ctx.fillStyle = PAP; ink([[-180, -150], [-110, -175]], 6, .3, .3); ink([[-80, -170], [-10, -186]], 6, .3, .3);
  }

  // ---------------------------------------------------------------- EYE close-up (P2), local coords centred on the eye
  function eyeCU(f, k, lt) {
    // k: pupil contraction 0..1
    const sk = PAP;
    // skin with tone shading under brow
    ctx.fillStyle = TONE_FLAT_P; blob([[-520, -120], [-200, -150], [300, -170], [520, -150], [520, -60], [200, -100], [-200, -70], [-520, -40]]); ctx.fill();
    // brow (thick, angry: inner end low at the left)
    ctx.fillStyle = INK;
    ink([[-330, -40], [-200, -112], [20, -150], [280, -178], [430, -190]], 64, .08, .5, .1);
    ctx.fillStyle = PAP; ink([[-200, -126], [0, -158], [200, -178]], 5, .4, .5);
    ctx.fillStyle = INK; ink([[-260, -10], [-180, -60]], 8, .3, .3); ink([[-230, 14], [-160, -30]], 5, .3, .3);
    // eye shape
    const eye = () => blob([[-300, 40, 1], [-180, -50], [20, -92], [230, -72], [330, -30, 1], [220, 40], [0, 70], [-180, 66]]);
    ctx.save(); eye(); ctx.fillStyle = PAP; ctx.fill(); ctx.clip();
    // iris
    const ix = 10, iy = -6, ir = 128;
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(ix, iy, ir - 10, 0, TAU); ctx.clip();
    ctx.fillStyle = PAP; ctx.fillRect(ix - ir, iy - ir, ir * 2, ir * 2);
    ctx.drawImage(TONE_V, 0, 0, 1100, 900, ix - ir, iy - ir, ir * 2, ir * 2.2);
    ctx.fillStyle = INK; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU + h(i) * .05, r0 = lerp(40, 22, k) + h(i + 3) * 10, r1 = ir - 6 - h(i + 9) * 30; ink([[ix + Math.cos(a) * r0, iy + Math.sin(a) * r0], [ix + Math.cos(a) * r1, iy + Math.sin(a) * r1]], 3 + h(i) * 3, .4, .3); }
    ctx.fillStyle = INK; ctx.fillRect(ix - ir, iy - ir, ir * 2, 70);    // lid shadow on iris
    ctx.restore();
    ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(ix, iy, lerp(ir - 40, ir - 50, k), 0, TAU); ctx.globalAlpha = .4; ctx.stroke(); ctx.globalAlpha = 1;
    // pupil
    const pr = lerp(48, 15, k);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(ix, iy, pr, pr * 1.15, 0, 0, TAU); ctx.fill();
    // highlights
    ctx.fillStyle = PAP; blob([[ix - 70, iy - 52], [ix - 40, iy - 66], [ix - 22, iy - 40], [ix - 50, iy - 22]]); ctx.fill();
    ctx.beginPath(); ctx.arc(ix + 54, iy + 46, 11, 0, TAU); ctx.fill();
    if (k > .05) { ctx.save(); ctx.globalAlpha = k; ctx.translate(ix + 70, iy - 70); sparkle(0, 0, 50 * k, PAP, .3); ctx.restore(); }
    // eyeball shadow under the lid
    ctx.fillStyle = TONE_FLAT_P; blob([[-320, -20], [-160, -76], [40, -100], [300, -60], [300, -36], [40, -64], [-160, -46]]); ctx.fill();
    ctx.restore();
    // lids: heavy tapered upper lid + lashes, thin lower lid
    ctx.fillStyle = INK;
    ink([[-310, 44], [-200, -46], [20, -96], [240, -78], [350, -30], [400, 6]], 34, .1, .25, .15);
    ink([[300, -50], [380, -96], [430, -110]], 16, .1, .9);
    ink([[250, -66], [310, -116], [350, -140]], 12, .1, .9);
    ink([[-250, -10], [-290, -40]], 8, .2, .9);
    ink([[-160, 70], [0, 76], [180, 48], [290, 4]], 9, .5, .3);
    ink([[-120, 108], [40, 116], [190, 92]], 4, .4, .4);   // under-eye crease
    for (let i = 0; i < 7; i++) ink([[120 + i * 26, 132], [96 + i * 26, 170]], 3, .3, .3);  // cheek hatch
    // hair strands falling across (front)
    ctx.fillStyle = INK; const fx = (i) => noise2(f * .6, i) * 14;
    ink([[300, -330], [340 + fx(1), -150], [300 + fx(2), 40], [250 + fx(3), 160]], 46, .02, .9);
    ink([[420, -330], [450 + fx(4), -120], [440 + fx(5), 80]], 40, .02, .9);
    ink([[-420, -330], [-460 + fx(6), -140], [-430 + fx(7), 40]], 50, .02, .9);
    ctx.fillStyle = PAP; ink([[330, -260], [344 + fx(1), -130], [318, -20]], 4, .4, .5);
  }

  // ---------------------------------------------------------------- panels
  function panelPath(p) { poly(p); }
  function slamK(lt, t0) { return E.expo(P(lt, t0, t0 + .22)); }
  function drawPanel(p, lt, t0, content) {
    if (lt < t0) return;
    const k = slamK(lt, t0), cx = (p[0][0] + p[2][0]) / 2, cy = (p[0][1] + p[2][1]) / 2, s = lerp(1.14, 1, k);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.rotate((1 - k) * -.03); ctx.translate(-cx, -cy);
    ctx.save(); panelPath(p); ctx.clip(); content(); ctx.restore();
    panelPath(p); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.lineJoin = 'miter'; ctx.stroke();
    // first frames of the slam: panel flashes solid ink, then reveals
    if (lt - t0 < .045) { panelPath(p); ctx.fillStyle = INK; ctx.fill(); }
    ctx.restore();
  }

  // camera keys (world): [t, cx, cy, z]
  const CAM = [
    [0.00, 560, 860, 1.10], [0.80, 520, 820, 1.20],
    [0.98, 560, 1960, 1.40], [1.40, 580, 1960, 1.52],
    [1.52, 540, 3000, 1.04], [2.20, 540, 3000, 1.10], [3.00, 540, 2840, .97],
  ];
  function cam(lt) {
    let i = 0; while (i < CAM.length - 2 && lt >= CAM[i + 1][0]) i++;
    const a = CAM[i], b = CAM[i + 1]; const whip = (b[0] - a[0]) < .25;
    let k = P(lt, a[0], b[0]); k = whip ? E.io(k) : E.sine(k);
    if (i === 4) k = E.out(P(lt, a[0], b[0]));
    if (i === 5) k = E.io(P(lt, 2.25, 3.0));
    return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), z: lerp(a[3], b[3], k), whip: whip ? Math.sin(P(lt, a[0], b[0]) * Math.PI) : 0, dir: Math.sign(b[2] - a[2]) };
  }

  function world(lt, f) {
    // page paper + the black bleed of the splash (printed page, always there)
    ctx.fillStyle = PAP; ctx.fillRect(-400, -600, 1900, 3000);
    ctx.save(); ctx.globalAlpha = .35; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(PAPER, -100, -200, 1300, 2600); ctx.restore();
    ctx.fillStyle = INK; poly([[-400, P3[0][1]], [1500, P3[1][1] - 6], [1500, 4600], [-400, 4600]]); ctx.fill();
    if (lt < 1.5) { ctx.save(); ctx.globalAlpha = .18; focusLines(560, 3020, 380, 380, 70, 0, 21, PAP, 1500, .01); ctx.restore(); }

    // ---------------- P1: dash
    drawPanel(P1, lt, 0.0, () => {
      ctx.fillStyle = PAP; ctx.fillRect(0, 0, 1100, 1700);
      ctx.drawImage(TONE_V, 0, 0, 1100, 900, 0, 40, 1100, 900);
      ctx.fillStyle = INK; ctx.fillRect(0, 1230, 1100, 500);
      for (let i = 0; i < 12; i++) { const x = ((i * 160 - lt * 2400) % 1920 + 1920) % 1920 - 300; ctx.fillStyle = '#26262a'; poly([[x, 1230], [x + 34, 1230], [x - 330, 1700], [x - 420, 1700]]); ctx.fill(); }
      speedLines(-200, 100, 1400, 1150, Math.PI + .1, 100, f, 3, INK, [260, 900], [2, 11]);
      speedLines(-200, 1240, 1400, 400, Math.PI + .1, 40, f, 7, PAP, [200, 700], [1, 5]);
      // dust kick behind the back foot
      ctx.save(); ctx.translate(250, 1215);
      for (let i = 0; i < 7; i++) { const r = 34 + h(i) * 40, x = -i * 74 - (lt * 300 % 74), y = -h(i + 2) * 70; ctx.fillStyle = PAP; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, y, r * (1 - i / 9), 0, TAU); ctx.fill(); ctx.stroke(); }
      ctx.restore();
      const run = (f % 6) / 6;
      ctx.save(); ctx.translate(540, 920); ctx.scale(1.22, 1.22); ctx.rotate(-.05);
      heroDash(f, run);
      ctx.restore();
      sfx('ダッ', 290, 330, 200, { rot: -.2, sc: E.back(P(lt, .18, .4)) });
    });

    // ---------------- P2: eye close-up
    drawPanel(P2, lt, 0.92, () => {
      ctx.fillStyle = PAP; ctx.fillRect(0, 1560, 1100, 760);
      const k = E.expo(P(lt, 1.16, 1.3));
      focusLines(540, 1960, 560, 300, 130, f, 11, INK, 1400, .011);
      const s = .92 + .04 * P(lt, .92, 1.5);
      ctx.save(); ctx.translate(540, 1975); ctx.scale(s, s); eyeCU(f, k, lt); ctx.restore();
      sfx('カッ', 860, 1760, 130, { rot: .12, sc: E.back(P(lt, 1.16, 1.32)) });
    });

    // ---------------- P3: splash (black)
    drawPanel(P3, lt, 1.50, () => {
      ctx.fillStyle = INK; ctx.fillRect(-300, 2200, 1700, 2200);
      focusLines(600, 2980, 330, 330, 160, f, 21, PAP, 1800, .013);
      // calm the lower-left (lines fade into the black)
      const g = ctx.createLinearGradient(0, 3440, 0, 3720); g.addColorStop(0, 'rgba(11,11,13,0)'); g.addColorStop(1, INK); ctx.fillStyle = g; ctx.fillRect(-300, 3440, 1700, 900);
      const sr = E.expo(P(lt, 1.5, 2.1));
      ctx.save(); ctx.globalAlpha = 1 - P(lt, 1.7, 2.4); ctx.strokeStyle = PAP; ctx.lineWidth = 18 * (1 - sr) + 3; ctx.beginPath(); ctx.ellipse(640, 3100, 220 + sr * 700, 170 + sr * 560, -.2, 0, TAU); ctx.stroke(); ctx.restore();
      const push = E.out(P(lt, 1.5, 2.2));
      ctx.save(); ctx.translate(430, 2640 - push * 24); ctx.scale(1.3, 1.3); heroFront(f, lt); ctx.restore();
      ctx.save(); ctx.translate(650, 3210); const fs2 = lerp(.8, 1.0, E.expo(P(lt, 1.5, 1.9))) + .03 * P(lt, 1.9, 3);
      ctx.scale(fs2, fs2); ctx.rotate(-.1); fist(f); ctx.restore();
      ctx.fillStyle = PAP;
      for (let i = 0; i < 30; i++) {
        const a = h(i * 3.1) * TAU, d = 280 + E.out(P(lt, 1.5, 3)) * (300 + h(i) * 600), s = 5 + h(i + 2) * 16;
        const x = 640 + Math.cos(a) * d, y = 3100 + Math.sin(a) * d * .8; ctx.save(); ctx.translate(x, y); ctx.rotate(a + lt * 3); poly([[-s, 0], [0, -s * .5], [s * 1.6, 0], [0, s * .5]]); ctx.fill(); ctx.restore();
      }
      // ドン! stacked vertically down the right side
      const dk = E.expo(P(lt, 1.62, 1.84)), wob = 1 + .03 * Math.sin(lt * 50) * (1 - P(lt, 1.8, 2.3));
      if (lt >= 1.62) {
        sfx('ド', 900, 2560, 250, { rot: -.08, sc: lerp(1.7, 1, dk) * wob, redOff: 20 });
        sfx('ン', 880, 2800, 270, { rot: .1, sc: lerp(1.7, 1, E.expo(P(lt, 1.68, 1.9))) * wob, redOff: 20 });
        if (lt >= 1.74) sfx('!', 905, 3020, 230, { rot: .05, sc: lerp(1.8, 1, E.expo(P(lt, 1.74, 1.94))) * wob, redOff: 16 });
      }
    });
  }

  STYLES_REG.manga = {
    label: 'GAYA MANGA',
    cues: [[0.05, 'slam'], [0.82, 'whoosh'], [0.94, 'slam'], [1.42, 'whoosh'], [1.52, 'impact_big']],
    draw(lt, t) {
      const f = Math.floor(lt * 12);
      // impact frames: strict B/W inversion flicker
      INV = (lt >= 1.50 && lt < 1.57) || (lt >= 1.60 && lt < 1.67);
      const c = cam(lt);
      // shake while on the splash
      const shk = (lt > 1.5 && lt < 2.1) ? (1 - P(lt, 1.5, 2.1)) * 10 : 0;
      ctx.save();
      ctx.translate(540 + (h(f * 1.7) - .5) * shk, 960 + (h(f * 2.3) - .5) * shk); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
      world(lt, f);
      ctx.restore();
      // whip-pan: vertical smear lines in screen space
      if (c.whip > .05) {
        ctx.save(); ctx.globalAlpha = c.whip; speedLines(-100, -200, W + 200, H + 400, Math.PI / 2 * c.dir, 70, f + 50, 31, INK, [500, 1600], [2, 12]); ctx.restore();
      }
      if (INV) { ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore(); }
    },
  };
})();
