// SHOWCASE STYLE: crayon — a children's storybook drawn in wax crayon on toothy paper (3.0 s).
// Beat: a kid and a little dog run up a hill dragging a kite -> a gust (wind swirls) -> the kite soars
// high near the smiling sun -> kid hops with joy, "Terbang!" hand-written. Lines boil at 8 fps, characters on 12s.
(() => {
  const TAU = Math.PI * 2;
  const J = (s, i) => (h2(s * 1.37 + 3.1, i * .71 + 1.3) - .5) * 2;

  // ---------------------------------------------------------------- paper tooth (world-aligned)
  const CT = mk(512, 512); (() => {
    const g = CT.getContext('2d'), r = mulberry(4242);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(0,0,0,${.3 + r() * .7})`; const x = r() * 512, y = r() * 512, s = .7 + r() * 2.2; g.fillRect(x, y, s * (1 + r() * 2.8), s * .75); }
    for (let i = 0; i < 700; i++) { g.strokeStyle = `rgba(0,0,0,${.2 + r() * .5})`; g.lineWidth = .8 + r() * 1.2; const x = r() * 512, y = r() * 512, l = 4 + r() * 14; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y - l * .25); g.stroke(); }
    // soft clusters (paper fibre pits)
    for (let i = 0; i < 60; i++) { const x = r() * 512, y = r() * 512, rad = 6 + r() * 20; for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(0,0,0,${r() * .8})`; g.fillRect(x + (r() - .5) * rad * 2, y + (r() - .5) * rad * 2, 1 + r() * 2, 1 + r() * 1.5); } }
  })();
  const CTP = MAIN.createPattern(CT, 'repeat');
  function tooth(alpha, x = -200, y = -200, w = 1500, hh = 2400) {
    ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = alpha; ctx.fillStyle = CTP; ctx.fillRect(x, y, w, hh); ctx.restore();
  }

  // ---------------------------------------------------------------- crayon primitives
  function smoothPath(pts) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
    const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]);
  }
  // waxy line: a heavy pass + a lighter offset pass, jitter boils with seed
  function cline(pts, col, w, sd, o = {}) {
    const { jit = 2.2, alpha = .9, passes = 2 } = o;
    ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let p = 0; p < passes; p++) {
      ctx.globalAlpha = alpha * (p ? .5 : 1); ctx.lineWidth = w * (p ? .6 : 1);
      smoothPath(pts.map((q, i) => [q[0] + J(sd + p * 7, i) * jit, q[1] + J(sd + p * 7, i + 50) * jit]));
      ctx.stroke();
    }
    ctx.restore();
  }
  function closed(pts) { return [...pts, pts[0], pts[1]]; }
  function circ(cx, cy, rx, ry = rx, n = 18, sd = 0, wob = .04, a0 = 0) {
    const out = []; for (let i = 0; i < n; i++) { const a = a0 + i / n * TAU, k = 1 + J(sd, i) * wob; out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return out;
  }
  function pathOf(pts) { return () => { smoothPath(closed(pts)); ctx.closePath(); }; }
  // zig-zag scribble fill clipped to a path (like a child colouring in), optional base wash
  function hatch(pathFn, col, bx, by, bw, bh, sd, o = {}) {
    const { ang = -.55, sp = 9, lw = 7, alpha = .8, base = .16, jit = 1.6 } = o;
    ctx.save(); pathFn(); ctx.clip();
    if (base) { ctx.globalAlpha = base; ctx.fillStyle = col; ctx.fillRect(bx - 4, by - 4, bw + 8, bh + 8); }
    ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.globalAlpha = alpha;
    const cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2 + lw, ca = Math.cos(ang), sa = Math.sin(ang);
    ctx.beginPath(); let i = 0;
    for (let d = -R; d <= R; d += sp, i++) {
      const off = d + J(sd, i) * sp * .25, dir = i % 2 ? 1 : -1, n = 4;
      for (let k = 0; k <= n; k++) {
        const u = dir * (-R + 2 * R * k / n) + J(sd + 3, i * 9 + k) * 6;
        const px = cx + ca * u - sa * off + J(sd + k, i) * jit, py = cy + sa * u + ca * off + J(sd + k + 9, i) * jit;
        if (i === 0 && k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
    }
    ctx.stroke(); ctx.restore();
  }
  // filled crayon shape: base colour scribble + cross-layer + outline
  function shape(pts, fill, line, sd, o = {}) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const bx = Math.min(...xs), by = Math.min(...ys), bw = Math.max(...xs) - bx, bh = Math.max(...ys) - by;
    const pf = pathOf(pts);
    hatch(pf, fill, bx, by, bw, bh, sd, { ang: o.ang ?? -.6, sp: o.sp ?? 8, lw: o.lw ?? 7, alpha: o.alpha ?? .85, base: o.base ?? .22 });
    if (o.cross) hatch(pf, o.cross, bx, by, bw, bh, sd + 11, { ang: (o.ang ?? -.6) + 1.1, sp: o.csp ?? 13, lw: 5, alpha: o.calpha ?? .35, base: 0 });
    if (o.shade) { ctx.save(); pf(); ctx.clip(); hatch(o.shade.path, o.shade.col, bx, by, bw, bh, sd + 21, { ang: (o.ang ?? -.6) - .9, sp: 7, lw: 5, alpha: .55, base: 0 }); ctx.restore(); }
    if (line) cline(closed(pts), line, o.olw ?? 6, sd + 5, { jit: o.ojit ?? 1.8 });
  }

  // ---------------------------------------------------------------- world geometry
  const hill = x => 1468 - 128 * Math.exp(-Math.pow((x - 690) / 400, 2)) + 14 * Math.sin(x * .011);
  const farHill = x => 1236 + 36 * Math.sin(x * .0062 + 1) + 22 * Math.sin(x * .017 + 2);

  // ---------------------------------------------------------------- background (pre-rendered, 3 boil variants)
  const BX = -140, BY = -140, BW = W + 280, BH = H + 280;
  function drawBG(v) {
    const sd = v * 101 + 7;
    // sky: layered blues, lavender at the top, warm near the sun and horizon
    const sky = () => { ctx.beginPath(); ctx.rect(BX, BY, BW, 1500); };
    ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, 'rgba(120,150,230,.35)'); g.addColorStop(.6, 'rgba(140,200,240,.25)'); g.addColorStop(1, 'rgba(255,230,180,.25)'); ctx.fillStyle = g; ctx.fillRect(BX, BY, BW, 1500); ctx.restore();
    hatch(() => { ctx.beginPath(); ctx.rect(BX, BY, BW, 820); }, '#7fa8ec', BX, BY, BW, 820, sd, { ang: -.45, sp: 13, lw: 10, alpha: .55, base: .12 });
    hatch(() => { ctx.beginPath(); ctx.rect(BX, 560, BW, 760); }, '#8fd0f4', BX, 560, BW, 760, sd + 1, { ang: -.42, sp: 14, lw: 10, alpha: .5, base: .1 });
    hatch(() => { ctx.beginPath(); ctx.rect(BX, BY, BW, 380); }, '#a58fe0', BX, BY, BW, 380, sd + 2, { ang: .5, sp: 18, lw: 7, alpha: .3, base: 0 });
    hatch(() => { ctx.beginPath(); ctx.ellipse(840, 380, 420, 380, 0, 0, TAU); }, '#ffe7a3', 420, 0, 840, 760, sd + 3, { ang: .3, sp: 15, lw: 8, alpha: .35, base: 0 });
    hatch(() => { ctx.beginPath(); ctx.rect(BX, 1080, BW, 240); }, '#ffd9a8', BX, 1080, BW, 240, sd + 4, { ang: -.2, sp: 15, lw: 8, alpha: .35, base: 0 });
    // far hills (blue-green, softer)
    const fh = []; for (let x = BX; x <= BX + BW; x += 40) fh.push([x, farHill(x)]);
    const fhp = () => { smoothPath(fh); ctx.lineTo(BX + BW, 1700); ctx.lineTo(BX, 1700); ctx.closePath(); };
    hatch(fhp, '#86bfa6', BX, 1150, BW, 550, sd + 5, { ang: -.7, sp: 9, lw: 8, alpha: .8, base: .25 });
    hatch(fhp, '#6a9fc0', BX, 1150, BW, 550, sd + 6, { ang: .5, sp: 15, lw: 5, alpha: .35, base: 0 });
    cline(fh, '#4f8d7c', 6, sd + 7);
    // little far tree + house on the far hill
    const tx = 190, ty = farHill(190);
    cline([[tx, ty + 10], [tx + 2, ty - 60]], '#7a4b2a', 12, sd + 8);
    shape(circ(tx, ty - 100, 62, 56, 14, sd + 9, .1), '#4f9d4a', '#2f6b34', sd + 9, { cross: '#2f7f5a', olw: 5 });
    const hx = 905, hy = farHill(905) - 6;
    shape([[hx - 50, hy + 4], [hx - 50, hy - 54], [hx + 50, hy - 54], [hx + 50, hy + 4]], '#fff1d8', '#c0784a', sd + 10, { olw: 4, sp: 7, lw: 5 });
    shape([[hx - 64, hy - 50], [hx, hy - 104], [hx + 64, hy - 50]], '#e85d4a', '#a8362c', sd + 11, { olw: 4, sp: 7, lw: 5 });
    shape([[hx - 12, hy + 2], [hx - 12, hy - 30], [hx + 12, hy - 30], [hx + 12, hy + 2]], '#7a4b2a', null, sd + 12, { sp: 5, lw: 4 });
    // near hill: rich layered greens
    const nh = []; for (let x = BX; x <= BX + BW; x += 40) nh.push([x, hill(x)]);
    const nhp = () => { smoothPath(nh); ctx.lineTo(BX + BW, BY + BH); ctx.lineTo(BX, BY + BH); ctx.closePath(); };
    hatch(nhp, '#7cc84f', BX, 1300, BW, 900, sd + 13, { ang: -.6, sp: 9, lw: 9, alpha: .85, base: .3 });
    hatch(nhp, '#c3e05a', BX, 1300, BW, 900, sd + 14, { ang: .6, sp: 17, lw: 6, alpha: .35, base: 0 });
    // darker lower ground (gives the lower-left a calm, deep base)
    hatch(() => { ctx.beginPath(); ctx.rect(BX, 1620, BW, 700); }, '#3f9a45', BX, 1620, BW, 700, sd + 15, { ang: -.5, sp: 10, lw: 9, alpha: .45, base: .12 });
    hatch(() => { ctx.beginPath(); ctx.rect(BX, 1780, BW, 600); }, '#2f7a3c', BX, 1780, BW, 600, sd + 16, { ang: .4, sp: 12, lw: 8, alpha: .35, base: .1 });
    cline(nh, '#3c8a34', 8, sd + 17);
    // grass tufts along the crest and on the right (left-bottom kept calm)
    for (let i = 0; i < 46; i++) {
      const x = 20 + h(i * 1.3) * 1040, y = hill(x) + 30 + h(i * 2.1) * 260;
      if (x < 560 && y > 1560) continue;
      const c = i % 3 ? '#3c8a34' : '#5aa83a';
      for (let k = -1; k <= 1; k++) cline([[x + k * 9, y], [x + k * 14 + J(sd, i + k) * 3, y - 22 - h(i + k) * 14]], c, 4, sd + i * 3 + k, { jit: 1 });
    }
    // flowers on the right slope
    const FC = ['#ff5d73', '#ffd23f', '#b07cf0', '#ff8c42'];
    for (let i = 0; i < 9; i++) {
      const x = 640 + h(i * 4.7) * 400, y = hill(x) + 80 + h(i * 3.3) * 260;
      cline([[x, y + 30], [x + 2, y]], '#3c8a34', 4, sd + 40 + i, { jit: 1 });
      const c = FC[i % 4];
      for (let p = 0; p < 5; p++) { const a = p / 5 * TAU + i; shape(circ(x + Math.cos(a) * 11, y + Math.sin(a) * 11, 9, 9, 8, sd + i * 5 + p, .12), c, null, sd + i * 5 + p, { sp: 5, lw: 5, base: .4 }); }
      shape(circ(x, y, 6, 6, 8, sd + i), '#ffcf3a', '#e08a1a', sd + 50 + i, { sp: 4, lw: 4, olw: 2.5 });
    }
    tooth(.55, BX, BY, BW, BH);
  }
  const BGV = [0, 1, 2].map(v => { const c = mk(BW, BH), g = c.getContext('2d'); g.translate(-BX, -BY); on(g, () => drawBG(v)); return c; });

  // ---------------------------------------------------------------- characters
  function sun(sd, lt) {
    const sx = 846, sy = 372;
    for (let k = 0; k < 14; k++) {
      const a = k / 14 * TAU + lt * .25, r0 = 140, r1 = 196 + (k % 2) * 30 + J(sd, k) * 8;
      cline([[sx + Math.cos(a) * r0, sy + Math.sin(a) * r0], [sx + Math.cos(a) * r1, sy + Math.sin(a) * r1]], k % 2 ? '#ffb21f' : '#ff8a1a', 14, sd + k, { jit: 2 });
    }
    shape(circ(sx, sy, 118, 118, 22, sd, .03), '#ffd23f', '#f08a14', sd, { cross: '#ffb21f', sp: 9, lw: 9, base: .35, olw: 8 });
    hatch(() => { ctx.beginPath(); ctx.arc(sx, sy, 118, 0, TAU); }, '#ff9d2a', sx - 120, sy - 120, 240, 240, sd + 4, { ang: 1, sp: 11, lw: 6, alpha: .35, base: 0 });
    // sleepy-happy face
    for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 6; i++) { const a = Math.PI + i / 6 * Math.PI; pts.push([sx + s * 40 + Math.cos(a) * 18, sy - 12 - Math.sin(a) * 12]); } cline(pts, '#a8501a', 7, sd + 30 + s); }
    const sm = []; for (let i = 0; i <= 8; i++) { const a = .35 + i / 8 * (Math.PI - .7); sm.push([sx + Math.cos(a) * 48, sy + 18 + Math.sin(a) * 34]); } cline(sm, '#a8501a', 8, sd + 33);
    for (const s of [-1, 1]) shape(circ(sx + s * 70, sy + 26, 18, 13, 10, sd + 40 + s, .1), '#ff7b7b', null, sd + 40 + s, { sp: 5, lw: 5, base: .3 });
  }
  function cloud(cx, cy, s, sd) {
    const pts = []; const n = 26;
    for (let i = 0; i < n; i++) { const a = i / n * TAU; const bump = 1 + .16 * Math.abs(Math.sin(a * 3.5)); pts.push([cx + Math.cos(a) * 150 * s * bump, cy + Math.sin(a) * 62 * s * bump * (Math.sin(a) > 0 ? .7 : 1.15)]); }
    shape(pts, '#ffffff', '#7ba7d8', sd, { sp: 9, lw: 8, base: .55, alpha: .95, olw: 6, ang: -.3 });
    hatch(pathOf(pts), '#b9cdf0', cx - 160 * s, cy, 320 * s, 90 * s, sd + 2, { ang: .4, sp: 12, lw: 6, alpha: .45, base: 0 });
  }
  function bird(x, y, s, sd, fl) {
    const w = fl ? 14 : -6;
    cline([[x - 26 * s, y + w * s], [x - 10 * s, y - 2 * s], [x, y + 6 * s], [x + 10 * s, y - 2 * s], [x + 26 * s, y + w * s]], '#4b5fa8', 5, sd, { jit: 1 });
  }
  function kid(x, y, sd, st) {
    // st: { run (0..1 phase), running (0..1), lean, hop, armA (string arm angle), joy (0..1) }
    ctx.save(); ctx.translate(x, y - st.hop);
    const ph = st.run * TAU, rk = st.running;
    const legA = Math.sin(ph) * .7 * rk, legB = -legA;
    ctx.rotate(st.lean);
    const SK = '#f7c6a0', SKL = '#c9825a';
    // legs + shoes
    const leg = (a, dx, s2) => {
      const hip = [dx, -108], knee = [dx + Math.sin(a) * 40, -60 + Math.abs(Math.sin(a)) * -6], foot = [knee[0] + Math.sin(a - .6 * rk) * 40, -12 - (a > 0 ? 0 : 1) * Math.abs(Math.sin(a)) * 14 * rk];
      cline([hip, knee, foot], SK, 17, sd + s2, { jit: 1.2 }); cline([hip, knee, foot], SKL, 4, sd + s2 + 1, { jit: 1.2, alpha: .5, passes: 1 });
      shape(circ(foot[0] + 12, foot[1] + 2, 24, 13, 12, sd + s2 + 2, .08), '#e63946', '#9d1d2a', sd + s2 + 2, { sp: 5, lw: 6, olw: 4, base: .4 });
    };
    leg(legB, -14, 1); leg(legA, 14, 5);
    // shorts (blue overalls)
    shape([[-40, -150], [40, -150], [46, -96], [6, -92], [0, -104], [-6, -92], [-46, -96]], '#3a7bd5', '#22427a', sd + 10, { cross: '#5aa0f0', sp: 7, lw: 6, olw: 5 });
    // body: yellow shirt with orange stripes
    const shirt = [[-36, -232], [36, -232], [50, -196], [44, -140], [-44, -140], [-50, -196]];
    shape(shirt, '#ffd23f', '#e07b14', sd + 12, { sp: 7, lw: 6, olw: 5, base: .35 });
    ctx.save(); pathOf(shirt)(); ctx.clip();
    for (let i = 0; i < 3; i++) cline([[-60, -212 + i * 26], [60, -208 + i * 26]], '#ff8c42', 9, sd + 14 + i, { jit: 1.5, alpha: .8 });
    ctx.restore();
    // overall straps
    cline([[-26, -150], [-30, -226]], '#3a7bd5', 9, sd + 18, { jit: 1 }); cline([[26, -150], [30, -226]], '#3a7bd5', 9, sd + 19, { jit: 1 });
    // free arm (swinging / cheering)
    const fa = st.joy > .5 ? -2.4 + Math.sin(st.run * TAU * 2) * .2 : .6 + Math.sin(ph + Math.PI) * .7 * rk;
    const sh1 = [-38, -222], el1 = [sh1[0] + Math.sin(fa) * -38, sh1[1] + Math.cos(fa) * 38], ha1 = [el1[0] + Math.sin(fa + .4) * -36, el1[1] + Math.cos(fa + .4) * 36];
    cline([sh1, el1, ha1], '#ffd23f', 18, sd + 20, { jit: 1 }); cline([el1, ha1], SK, 14, sd + 21, { jit: 1 });
    shape(circ(ha1[0], ha1[1], 12, 12, 8, sd + 22), SK, SKL, sd + 22, { sp: 4, lw: 4, olw: 3 });
    // string arm reaching up toward the kite
    const sa = st.armA, sh2 = [38, -222], el2 = [sh2[0] + Math.cos(sa) * 40, sh2[1] + Math.sin(sa) * 40], ha2 = [el2[0] + Math.cos(sa - .15) * 40, el2[1] + Math.sin(sa - .15) * 40];
    cline([sh2, el2, ha2], '#ffd23f', 18, sd + 23, { jit: 1 }); cline([el2, ha2], SK, 14, sd + 24, { jit: 1 });
    shape(circ(ha2[0], ha2[1], 13, 13, 8, sd + 25), SK, SKL, sd + 25, { sp: 4, lw: 4, olw: 3 });
    st.hand = [x + (ha2[0] * Math.cos(st.lean) - ha2[1] * Math.sin(st.lean)), y - st.hop + (ha2[0] * Math.sin(st.lean) + ha2[1] * Math.cos(st.lean))];
    // red scarf fluttering back
    const sf = (k) => Math.sin(st.run * TAU * 2 + k) * 10;
    shape([[-24, -238], [-60, -232 + sf(0)], [-110, -222 + sf(1)], [-140, -206 + sf(2)], [-104, -204 + sf(1.5)], [-58, -214 + sf(.5)], [-20, -222]], '#e63946', '#9d1d2a', sd + 26, { sp: 6, lw: 6, olw: 4, base: .35 });
    shape([[-34, -246], [34, -246], [30, -226], [-30, -226]], '#e63946', '#9d1d2a', sd + 27, { sp: 5, lw: 6, olw: 4 });
    // head
    const hx = 4, hy = -306;
    shape(circ(hx, hy, 64, 60, 18, sd + 30, .025), SK, SKL, sd + 30, { cross: '#f2a98a', sp: 7, lw: 7, olw: 5, base: .35 });
    // hair: brown mop with a cowlick
    const hair = [[hx - 66, hy - 8], [hx - 60, hy - 46], [hx - 30, hy - 70], [hx + 10, hy - 74], [hx + 48, hy - 58], [hx + 66, hy - 20], [hx + 44, hy - 30], [hx + 30, hy - 22], [hx + 10, hy - 36], [hx - 10, hy - 24], [hx - 30, hy - 34], [hx - 48, hy - 16]];
    shape(hair, '#8a4f2a', '#5a2f14', sd + 31, { cross: '#b06a34', sp: 6, lw: 6, olw: 5, base: .4 });
    cline([[hx + 6, hy - 72], [hx + 14, hy - 100], [hx + 34, hy - 96], [hx + 26, hy - 84]], '#5a2f14', 6, sd + 32);
    // face
    if (st.joy > .5) {
      for (const s of [-1, 1]) cline([[hx + s * 22 - 10, hy + 2], [hx + s * 22, hy - 8], [hx + s * 22 + 10, hy + 2]], '#3b2416', 5, sd + 33 + s);
    } else {
      for (const s of [-1, 1]) shape(circ(hx + s * 22 + 6, hy - 2, 6, 8, 8, sd + 33 + s, .05), '#3b2416', null, sd + 33 + s, { sp: 3, lw: 4, base: .8 });
    }
    for (const s of [-1, 1]) shape(circ(hx + s * 38 + 4, hy + 20, 13, 9, 10, sd + 36 + s, .1), '#ff7b8a', null, sd + 36 + s, { sp: 4, lw: 4, base: .35, alpha: .7 });
    const mo = st.joy > .2 ? 1 : .4;
    shape([[hx - 16, hy + 22], [hx + 22, hy + 20], [hx + 14, hy + 22 + 18 * mo], [hx + 2, hy + 26 + 20 * mo], [hx - 10, hy + 22 + 14 * mo]], '#d6283b', '#8a1424', sd + 38, { sp: 4, lw: 4, olw: 3, base: .5 });
    cline([[hx + 8, hy + 2], [hx + 12, hy + 10], [hx + 6, hy + 12]], SKL, 4, sd + 39, { jit: .8 });
    ctx.restore();
  }
  function dog(x, y, sd, run, hop, wag) {
    ctx.save(); ctx.translate(x, y - hop);
    const ph = run * TAU, CR = '#fff4dc', BR = '#a0643a', OL = '#8a5a34';
    // tail
    const ta = -1.1 + Math.sin(wag * TAU) * .5;
    cline([[-56, -64], [-56 + Math.cos(ta) * 22 - 10, -64 + Math.sin(ta) * 30], [-56 + Math.cos(ta) * 30 - 18, -64 + Math.sin(ta) * 48]], OL, 12, sd + 1); cline([[-56, -64], [-56 + Math.cos(ta) * 22 - 10, -64 + Math.sin(ta) * 30]], CR, 7, sd + 2, { passes: 1 });
    // legs
    for (let i = 0; i < 4; i++) {
      const lx = [-40, -26, 26, 40][i], a = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? .8 : 0)) * .6;
      cline([[lx, -46], [lx + Math.sin(a) * 26, -8 + Math.abs(Math.cos(a)) * 2]], i % 2 ? CR : '#f0dfc0', 14, sd + 3 + i, { jit: 1 });
      cline([[lx, -46], [lx + Math.sin(a) * 26, -8]], OL, 3, sd + 7 + i, { jit: 1, alpha: .6, passes: 1 });
    }
    // body
    shape(circ(0, -58, 66, 34, 16, sd + 10, .04), CR, OL, sd + 10, { cross: '#f1d6a8', sp: 7, lw: 6, olw: 5, base: .45 });
    shape(circ(-14, -72, 26, 16, 10, sd + 11, .12), BR, null, sd + 11, { sp: 5, lw: 5, base: .4 });
    // head
    const hx = 62, hy = -96;
    shape(circ(hx, hy, 36, 32, 14, sd + 12, .04), CR, OL, sd + 12, { cross: '#f1d6a8', sp: 6, lw: 6, olw: 5, base: .45 });
    shape([[hx + 22, hy + 4], [hx + 58, hy + 2], [hx + 60, hy + 22], [hx + 24, hy + 26]], CR, OL, sd + 13, { sp: 5, lw: 5, olw: 4, base: .45 });
    shape(circ(hx + 58, hy + 6, 8, 7, 8, sd + 14), '#2a1a12', null, sd + 14, { sp: 3, lw: 4, base: .9 });
    shape(circ(hx + 12, hy - 8, 5, 6, 8, sd + 15), '#2a1a12', null, sd + 15, { sp: 3, lw: 4, base: .9 });
    // floppy ear (flaps)
    const ea = Math.sin(ph * 2) * .25;
    ctx.save(); ctx.translate(hx - 14, hy - 22); ctx.rotate(.3 + ea);
    shape([[-6, 0], [14, -4], [12, 30], [0, 44], [-14, 30]], BR, '#6a3b1c', sd + 16, { sp: 4, lw: 5, olw: 4, base: .5 });
    ctx.restore();
    // tongue + collar
    shape([[hx + 34, hy + 22], [hx + 46, hy + 24], [hx + 44, hy + 40], [hx + 36, hy + 38]], '#ff6f8a', '#c2405a', sd + 17, { sp: 3, lw: 4, olw: 2.5, base: .5 });
    cline([[hx - 28, hy + 10], [hx - 14, hy + 26], [hx + 4, hy + 30]], '#e63946', 9, sd + 18, { jit: 1 });
    shape(circ(hx - 4, hy + 34, 6, 6, 8, sd + 19), '#ffd23f', '#e08a1a', sd + 19, { sp: 3, lw: 3, olw: 2 });
    ctx.restore();
  }
  function kite(x, y, rot, sd, tailPhase, vel) {
    ctx.save(); ctx.translate(x, y);
    // tail with bows trails opposite the motion
    const tp = []; for (let i = 0; i <= 10; i++) { const u = i / 10; tp.push([-vel[0] * u * 120 + Math.sin(u * 6 - tailPhase) * 26 * u - u * 30, 110 + u * 230 - vel[1] * u * 60]); }
    ctx.save(); ctx.rotate(rot * .4);
    cline(tp, '#5a4a8a', 4, sd + 1, { jit: 1 });
    [3, 6, 9].forEach((k, i) => {
      const p = tp[k], c = ['#3a86ff', '#ffd23f', '#2bb673'][i];
      shape([[p[0] - 20, p[1] - 12], [p[0], p[1]], [p[0] - 20, p[1] + 12]], c, '#3b3b6a', sd + 3 + i * 2, { sp: 4, lw: 4, olw: 3, base: .5 });
      shape([[p[0] + 20, p[1] - 12], [p[0], p[1]], [p[0] + 20, p[1] + 12]], c, '#3b3b6a', sd + 4 + i * 2, { sp: 4, lw: 4, olw: 3, base: .5 });
    });
    ctx.restore();
    ctx.rotate(rot);
    const T_ = [0, -108], R_ = [78, -18], B_ = [0, 124], L_ = [-78, -18], C_ = [0, -18];
    shape([T_, R_, C_], '#ffd23f', null, sd + 10, { sp: 6, lw: 6, base: .35, ang: .3 });
    shape([T_, C_, L_], '#e63946', null, sd + 11, { sp: 6, lw: 6, base: .35, ang: .3 });
    shape([L_, C_, B_], '#ffd23f', null, sd + 12, { sp: 6, lw: 6, base: .35, ang: .3 });
    shape([C_, R_, B_], '#e63946', null, sd + 13, { sp: 6, lw: 6, base: .35, ang: .3 });
    hatch(pathOf([T_, R_, B_, L_]), '#ff8c42', -80, -110, 160, 236, sd + 14, { ang: -1, sp: 14, lw: 5, alpha: .3, base: 0 });
    cline([T_, B_], '#7a4b2a', 6, sd + 15, { jit: 1, passes: 1 }); cline([L_, R_], '#7a4b2a', 6, sd + 16, { jit: 1, passes: 1 });
    cline([T_, R_, B_, L_, T_, R_], '#a3202c', 6, sd + 17, { jit: 1.4 });
    // tiny smile on the kite
    cline([[-20, 30], [0, 44], [20, 30]], '#7a1c24', 5, sd + 18, { jit: .8 });
    ctx.restore();
  }
  function swirl(x0, y0, len, amp, k, sd, col) {
    // a wind swoosh drawn progressively (k: 0..1) ending in a curl
    const pts = [];
    const n = 26;
    for (let i = 0; i <= n; i++) {
      const u = i / n; if (u > k) break;
      if (u < .72) pts.push([x0 + u / .72 * len, y0 + Math.sin(u * 9) * amp]);
      else { const v = (u - .72) / .28, a = -Math.PI / 2 + v * TAU * .9, r = 40 * (1 - v * .4); pts.push([x0 + len + Math.cos(a) * r, y0 - r + 40 + Math.sin(a) * r + 0]); }
    }
    if (pts.length > 2) cline(pts, col, 9, sd, { jit: 1.5, alpha: .95 });
  }
  function star(x, y, r, col, sd) {
    const pts = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - Math.PI / 2, rr_ = i % 2 ? r * .38 : r; pts.push([x + Math.cos(a) * rr_, y + Math.sin(a) * rr_]); }
    shape(pts, col, '#e08a1a', sd, { sp: 4, lw: 4, olw: 3, base: .5 });
  }

  // ---------------------------------------------------------------- kite flight path
  function kitePos(t) {
    const kx0 = kidX(t);
    if (t < .85) { const b = Math.abs(Math.sin(t * 9)); return [kx0 - 250 - b * 14, hill(kx0 - 250) - 110 - b * 70]; }
    const k = E.io(P(t, .85, 2.15));
    const p0 = [kidX(.85) - 250, hill(kidX(.85) - 250) - 110], p1 = [180, 900], p2 = [470, 420], p3 = [742, 600];
    const u = 1 - k; let x = u * u * u * p0[0] + 3 * u * u * k * p1[0] + 3 * u * k * k * p2[0] + k * k * k * p3[0], y = u * u * u * p0[1] + 3 * u * u * k * p1[1] + 3 * u * k * k * p2[1] + k * k * k * p3[1];
    const d = P(t, 1.8, 2.6); x += Math.sin(t * 3.1) * 36 * d; y += Math.sin(t * 6.2) * 22 * d;
    return [x, y];
  }
  const kidX = t => lerp(400, 610, E.out(P(t, 0, 1.0)));

  // ---------------------------------------------------------------- frame
  STYLES_REG.crayon = {
    label: 'GAYA CRAYON',
    cues: [[0.86, 'whoosh'], [2.05, 'shimmer'], [2.4, 'pop']],
    draw(lt, t) {
      const bf = Math.floor(lt * 8), sd = bf * 13 + 1;          // boil at 8 fps
      const tq = Math.floor(lt * 12) / 12;                       // character animation on 12s
      // gentle camera drift (smooth, continuous)
      const kk = E.sine(clamp(lt / 3)), cz = lerp(1.07, 1.0, kk), cx = 540 + Math.sin(lt * .9) * 8, cy = lerp(1010, 905, kk);
      const camT = () => { ctx.translate(540, 960); ctx.scale(cz, cz); ctx.translate(-cx, -cy); };
      // paper + background
      ctx.save(); camT();
      ctx.drawImage(PAPER, BX, BY, BW, BH);
      ctx.drawImage(BGV[bf % 3], BX, BY);
      ctx.restore();
      // foreground crayon layer (tooth applied in world space)
      const fg = paint('crayon_fg', () => {
        ctx.save(); camT();
        sun(sd + 100, lt);
        cloud(250 + lt * 26, 520, 1.05, sd + 200);
        cloud(760 - lt * 14, 760, .62, sd + 230);
        cloud(-60 + lt * 20, 900, .5, sd + 260);
        const fl = bf % 2;
        bird(250 + lt * 30, 300, 1, sd + 300, fl); bird(330 + lt * 30, 340, .75, sd + 301, 1 - fl);
        // wind gust swirls
        if (lt > .7 && lt < 2.3) {
          const a = 1 - P(lt, 1.8, 2.3);
          ctx.save(); ctx.globalAlpha = a;
          swirl(-40, 1120, 520, 26, E.out(P(lt, .7, 1.25)), sd + 400, '#ffffff');
          swirl(40, 980, 420, 22, E.out(P(lt, .8, 1.35)), sd + 410, '#d8ecff');
          swirl(-80, 1250, 380, 18, E.out(P(lt, .9, 1.4)), sd + 420, '#ffffff');
          for (let i = 0; i < 6; i++) { const u = P(lt, .8 + i * .05, 1.8 + i * .05); if (u <= 0 || u >= 1) continue; const lx = lerp(60, 760, u) + i * 20, ly = 1200 - u * 500 + Math.sin(u * 12 + i) * 40; ctx.save(); ctx.translate(lx, ly); ctx.rotate(u * 8 + i); shape([[-12, 0], [0, -7], [14, 0], [0, 7]], i % 2 ? '#7cc84f' : '#ffb21f', '#3c8a34', sd + 430 + i, { sp: 3, lw: 3, olw: 2.5, base: .5 }); ctx.restore(); }
          ctx.restore();
        }
        // kite + string
        const kp = kitePos(tq), kp2 = kitePos(tq + .08), vel = [(kp2[0] - kp[0]) / 40, (kp2[1] - kp[1]) / 40];
        const rot = clamp(vel[0] * .25, -.45, .45) + Math.sin(tq * 5) * .08 - .1;
        const running = 1 - P(tq, .8, 1.05);
        const joy = P(tq, 2.0, 2.1);
        const kx = kidX(tq), ky = hill(kx) + 8;
        const hop = joy > 0 ? Math.abs(Math.sin(tq * Math.PI * 2.4)) * 34 : running * Math.abs(Math.sin(tq * TAU * 2.2)) * 10;
        const st = { run: (tq * 2.2) % 1, running, lean: running * .12 - (1 - running) * .08, hop, joy, armA: 0 };
        // string arm aims at the kite
        st.armA = Math.atan2(kp[1] + 40 - (ky - 230), kp[0] - (kx + 40));
        st.armA = clamp(st.armA, -2.6, -.3);
        // draw kid first to get the hand position, string after (behind would hide it)
        const dx = kx - 190, dy = hill(dx) + 8, dhop = running > .2 ? Math.abs(Math.sin(tq * TAU * 2.2)) * 18 : Math.abs(Math.sin(tq * TAU * 1.6)) * 26;
        dog(dx, dy, sd + 600, (tq * 2.2) % 1, dhop, tq * 4);
        kid(kx, ky, sd + 500, st);
        const hd = st.hand, sag = lerp(120, 30, P(tq, .9, 2));
        const mid = [(hd[0] + kp[0]) / 2 - 20, (hd[1] + kp[1]) / 2 + sag];
        const sp = []; for (let i = 0; i <= 12; i++) { const u = i / 12; sp.push([(1 - u) * (1 - u) * hd[0] + 2 * u * (1 - u) * mid[0] + u * u * kp[0], (1 - u) * (1 - u) * hd[1] + 2 * u * (1 - u) * mid[1] + u * u * (kp[1] + 20)]); }
        cline(sp, '#4a3a5a', 3.5, sd + 700, { jit: .9, passes: 1 });
        const ksc = lerp(.8, 1, P(tq, .9, 2));
        ctx.save(); ctx.translate(kp[0], kp[1]); ctx.scale(ksc, ksc); kite(0, 0, rot, sd + 800, tq * 7, vel); ctx.restore();
        // joy sparkles around the kite + hand-written word
        if (lt > 2.0) {
          for (let i = 0; i < 5; i++) { const s = pop(lt, 2.05 + i * .09, .3); if (s <= 0) continue; const a = i / 5 * TAU + .4, r = 150 + (i % 2) * 40; star(kp[0] + Math.cos(a) * r, kp[1] + Math.sin(a) * r * .8, 22 * s, ['#ffd23f', '#ff8c42', '#ffd23f', '#ff5d73', '#ffd23f'][i], sd + 900 + i); }
        }
        if (lt > 1.95) {
          const k = P(lt, 1.95, 2.6), word = 'Terbang!';
          ctx.save(); ctx.translate(300, 820); ctx.rotate(-.1);
          ctx.font = `150px ${fs('Caveat')}`; const ww = ctx.measureText(word).width;
          ctx.beginPath(); ctx.rect(-ww / 2 - 20, -120, (ww + 40) * k, 240); ctx.clip();
          for (let p = 0; p < 3; p++) T(word, J(sd, p) * 2.5, J(sd, p + 5) * 2.5, { size: 150, font: 'Caveat', color: p === 2 ? '#ff8c42' : '#e63946', alpha: p === 2 ? .5 : .8 });
          ctx.restore();
          // underline swoosh
          const uk = P(lt, 2.45, 2.75); if (uk > 0) { const pts = []; for (let i = 0; i <= 14 * uk; i++) pts.push([150 + i / 14 * 300, 900 - i * 4 + Math.sin(i * .9) * 6]); if (pts.length > 2) cline(pts, '#3a86ff', 9, sd + 950); }
        }
        tooth(.5);
        ctx.restore();
      });
      ctx.drawImage(fg, 0, 0);
      // warm paper unity pass
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .25; camT(); ctx.drawImage(PAPER, BX, BY, BW, BH); ctx.restore();
    },
  };
})();
