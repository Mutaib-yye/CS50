// SHOWCASE STYLE: bollywood — golden-hour haveli courtyard. A dancer in a magenta lehenga spins in
// dramatic slow motion, backlit by the sun through a great cusped arch; marigold petals swirl, dust
// glitters in god rays, lanterns and diyas bloom. Slow orbit + push-in, lens-flare reveal, nose-ring glint.
(() => {
  const DUR = 3.2;
  const OX = 220, OY = 220, LW = W + OX * 2, LH = H + OY * 2;
  const sm = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const SUN = [572, 770];          // world position of the sun (behind the great arch)
  const DX = 540, DY = 1010;       // dancer waist (world)
  function cv(w, hh, fn) { const c = mk(w, hh); on(c.getContext('2d'), () => fn(c)); return c; }

  // ---------------------------------------------------------------- generic path helpers
  function crPts(pts, seg = 8) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let s = 0; s < seg; s++) {
        const t = s / seg, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(pts[pts.length - 1]); return out;
  }
  function tube(pts, wf, pen = null) {
    const n = pts.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const w = wf(i / (n - 1));
      L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
    }
    const pp = pen || new Path2D(); pp.moveTo(L[0][0], L[0][1]);
    for (const p of L) pp.lineTo(p[0], p[1]);
    for (let i = n - 1; i >= 0; i--) pp.lineTo(R[i][0], R[i][1]);
    pp.closePath(); return { L, R, path: pp };
  }
  // fill a Path2D, then a directional rim light: the crescent of the shape facing the light (lx,ly = unit dir to light)
  // bb = [x0,y0,x1,y1] must contain the shape (keeps the evenodd fill small = fast)
  function rimP(path, fill, lx, ly, w, col, a, bb) {
    if (fill) { ctx.fillStyle = fill; ctx.fill(path); }
    ctx.save(); ctx.clip(path); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = col; const ga = ctx.globalAlpha;
    for (const [k, al] of [[1, .95], [3, .3]]) {
      const q = new Path2D(); q.rect(bb[0] - 24, bb[1] - 24, bb[2] - bb[0] + 48, bb[3] - bb[1] + 48); q.addPath(path, new DOMMatrix([1, 0, 0, 1, -lx * w * k, -ly * w * k]));
      ctx.globalAlpha = ga * a * al; ctx.fill(q, 'evenodd');
    }
    ctx.restore();
  }
  const bbOf = (pts, m) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return [x0 - m, y0 - m, x1 + m, y1 + m]; };
  const nrm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  function polyline(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); }
  function lg(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  function rg(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  // multifoil (cusped) pointed arch opening path: base at y0, springs at ys, peak at yp
  function cuspArch(cx, w, y0, ys, yp, lobes = 9, depth = .5, move = true) {
    const pts = [];
    for (let i = 0; i <= lobes; i++) {
      const s = i / lobes, side = s < .5 ? -1 : 1, q = s < .5 ? s * 2 : (1 - s) * 2;   // q 0 at spring -> 1 at peak
      const x = cx + side * (w / 2) * Math.pow(Math.cos(q * Math.PI / 2), 1.25), y = ys - (ys - yp) * Math.pow(Math.sin(q * Math.PI / 2), .85);
      pts.push([x, y]);
    }
    if (move) ctx.beginPath();
    ctx.moveTo(cx - w / 2, y0); ctx.lineTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      let nx = mx - cx, ny = my - (ys + 20); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]) * depth;
      ctx.quadraticCurveTo(mx + nx * d, my + ny * d, b[0], b[1]);
    }
    ctx.lineTo(cx + w / 2, y0); ctx.closePath();
  }

  // ---------------------------------------------------------------- sprites
  const GLOW = cv(256, 256, () => { ctx.fillStyle = rg(128, 128, 0, 128, [[0, 'rgba(255,255,255,1)'], [.18, 'rgba(255,255,255,.55)'], [.5, 'rgba(255,255,255,.14)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(0, 0, 256, 256); });
  const tint = (src, col) => cv(src.width, src.height, () => { ctx.drawImage(src, 0, 0); ctx.globalCompositeOperation = 'source-in'; ctx.fillStyle = col; ctx.fillRect(0, 0, src.width, src.height); });
  const G_WARM = tint(GLOW, '#ffab4a'), G_GOLD = tint(GLOW, '#ffe0a0'), G_MAG = tint(GLOW, '#ff3d8b'), G_TEAL = tint(GLOW, '#3fd6c8'), G_WHITE = GLOW;
  function glow(spr, x, y, r, a) { if (a <= 0.003) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= a; ctx.drawImage(spr, x - r, y - r, r * 2, r * 2); ctx.restore(); }

  // marigold petals (4 colours x 4 blur levels)
  const PET_COLS = [['#ff7b00', '#ffb347', '#c84600'], ['#ffa313', '#ffd36b', '#d06a00'], ['#ffc81e', '#fff0a0', '#d79000'], ['#d81b60', '#ff6fa3', '#7a0636']];
  const PET_BLUR = [0, 2.5, 6, 13];
  const PETALS = PET_COLS.map(([c, l, d]) => {
    const base = cv(64, 64, () => {
      ctx.translate(32, 34);
      ctx.beginPath(); ctx.moveTo(0, 22);
      ctx.bezierCurveTo(-16, 14, -22, -6, -16, -16); ctx.quadraticCurveTo(-11, -22, -6, -17); ctx.quadraticCurveTo(-2, -25, 3, -18);
      ctx.quadraticCurveTo(9, -24, 14, -15); ctx.bezierCurveTo(22, -4, 16, 14, 0, 22); ctx.closePath();
      ctx.fillStyle = rg(0, 14, 2, 34, [[0, d], [.45, c], [1, l]]); ctx.fill();
      ctx.strokeStyle = 'rgba(120,30,0,.35)'; ctx.lineWidth = 1; for (const a of [-.5, 0, .5]) { ctx.beginPath(); ctx.moveTo(0, 18); ctx.lineTo(Math.sin(a) * 18, -12); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,220,.35)'; ctx.beginPath(); ctx.ellipse(-6, -6, 4, 9, -.4, 0, 7); ctx.fill();
    });
    return PET_BLUR.map(b => cv(128, 128, () => { if (b) ctx.filter = `blur(${b}px)`; ctx.drawImage(base, 32, 32); }));
  });

  // brass lantern with coloured glass (sharp + soft)
  const LANT = cv(180, 330, () => {
    ctx.translate(90, 20);
    const brass = lg(-50, 0, 50, 0, [[0, '#3a1a08'], [.4, '#a8661c'], [.6, '#ffd27a'], [1, '#4a220a']]);
    ctx.fillStyle = brass; ctx.fillRect(-3, 0, 6, 24);
    ctx.beginPath(); ctx.moveTo(0, 18); ctx.bezierCurveTo(30, 30, 52, 52, 56, 80); ctx.lineTo(-56, 80); ctx.bezierCurveTo(-52, 52, -30, 30, 0, 18); ctx.fill();
    // glass body (three panels)
    const panels = [['#ff2f7a', -46, -16], ['#ffb23a', -16, 16], ['#1fc7b6', 16, 46]];
    for (const [c, x0, x1] of panels) {
      ctx.beginPath(); ctx.moveTo(x0, 84); ctx.lineTo(x1, 84); ctx.lineTo(x1 * .8, 200); ctx.lineTo(x0 * .8, 200); ctx.closePath();
      ctx.fillStyle = rg((x0 + x1) / 2, 140, 4, 70, [[0, '#fff6d8'], [.35, c], [1, mixc(c, '#200010', .55)]]); ctx.fill();
    }
    ctx.strokeStyle = brass; ctx.lineWidth = 5; for (const x of [-46, -16, 16, 46]) { ctx.beginPath(); ctx.moveTo(x, 84); ctx.lineTo(x * .8, 200); ctx.stroke(); }
    // jali filigree
    ctx.strokeStyle = 'rgba(80,30,5,.7)'; ctx.lineWidth = 2;
    for (let y = 96; y < 196; y += 18) for (let x = -40; x < 42; x += 15) { ctx.beginPath(); ctx.arc(x * (1 - (y - 84) / 600), y, 5, 0, 7); ctx.stroke(); }
    ctx.fillStyle = brass; ctx.beginPath(); ctx.moveTo(-50, 196); ctx.lineTo(50, 196); ctx.bezierCurveTo(40, 230, 14, 246, 0, 252); ctx.bezierCurveTo(-14, 246, -40, 230, -50, 196); ctx.fill();
    ctx.fillRect(-58, 78, 116, 9); ctx.fillRect(-52, 194, 104, 8);
    ctx.fillStyle = '#c2185b'; ctx.beginPath(); ctx.moveTo(-6, 252); ctx.lineTo(6, 252); ctx.lineTo(12, 300); ctx.lineTo(-12, 300); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.arc(0, 254, 7, 0, 7); ctx.fill();
  });
  const LANT_SOFT = cv(220, 370, () => { ctx.filter = 'blur(4px)'; ctx.drawImage(LANT, 20, 20); });

  // carved sandstone column (rim light on the right side)
  const COL = cv(220, 1140, () => {
    const cx = 110, shade = lg(cx - 60, 0, cx + 60, 0, [[0, '#1c0614'], [.3, '#4a1630'], [.62, '#8e3448'], [.86, '#e0805a'], [1, '#ffd9a0']]);
    ctx.fillStyle = shade;
    // capital bracket + lotus bell
    ctx.beginPath(); ctx.moveTo(cx - 100, 0); ctx.lineTo(cx + 100, 0); ctx.lineTo(cx + 100, 26); ctx.bezierCurveTo(cx + 60, 34, cx + 52, 60, cx + 48, 92); ctx.lineTo(cx - 48, 92); ctx.bezierCurveTo(cx - 52, 60, cx - 60, 34, cx - 100, 26); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 48, 92); ctx.bezierCurveTo(cx - 70, 120, cx - 44, 150, cx - 38, 170); ctx.lineTo(cx + 38, 170); ctx.bezierCurveTo(cx + 44, 150, cx + 70, 120, cx + 48, 92); ctx.fill();
    // shaft
    ctx.beginPath(); ctx.moveTo(cx - 38, 170); ctx.lineTo(cx - 44, 1010); ctx.lineTo(cx + 44, 1010); ctx.lineTo(cx + 38, 170); ctx.fill();
    // base
    ctx.fillRect(cx - 62, 1010, 124, 40); ctx.fillRect(cx - 76, 1050, 152, 90);
    // flutes
    for (let k = -3; k <= 3; k++) { const x = cx + k * 11; ctx.strokeStyle = `rgba(20,0,10,${.25 + Math.abs(k) * .04})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, 260); ctx.lineTo(x * 1 + k * .8, 900); ctx.stroke(); ctx.strokeStyle = 'rgba(255,190,140,.12)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 3, 260); ctx.lineTo(x + 3 + k * .8, 900); ctx.stroke(); }
    // carved gold rings
    for (const y of [176, 240, 930, 990]) { ctx.fillStyle = lg(cx - 46, 0, cx + 46, 0, [[0, '#3a1a06'], [.6, '#c98a2e'], [.88, '#ffe6a0'], [1, '#fff6d0']]); ctx.fillRect(cx - 45, y, 90, 14); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(cx - 45, y + 14, 90, 4); }
    for (let y = 300; y < 900; y += 120) { ctx.fillStyle = 'rgba(255,200,120,.10)'; ctx.beginPath(); ctx.ellipse(cx + 18, y, 10, 22, 0, 0, 7); ctx.fill(); }
    // grain
    const r = mulberry(77); for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(${r() > .5 ? '255,210,170' : '20,0,10'},${r() * .08})`; ctx.fillRect(cx - 44 + r() * 88, 170 + r() * 840, 2, 2 + r() * 5); }
  });

  // ---------------------------------------------------------------- background: sky + distant palace + facade
  const BG = cv(LW, LH, () => {
    ctx.translate(OX, OY);
    ctx.fillStyle = lg(0, -220, 0, 1160, [[0, '#2b0634'], [.18, '#6a1650'], [.36, '#c23a5c'], [.5, '#f0703f'], [.6, '#ffae52'], [.66, '#ffd98c'], [.72, '#ffe9b4'], [.8, '#ffc77a'], [1, '#f08a4a']]);
    ctx.fillRect(-OX, -OY, LW, LH);
    // sun + haze
    ctx.fillStyle = rg(SUN[0], SUN[1], 0, 620, [[0, 'rgba(255,250,225,1)'], [.08, 'rgba(255,236,180,.95)'], [.25, 'rgba(255,190,110,.45)'], [1, 'rgba(255,140,60,0)']]); ctx.fillRect(-OX, -OY, LW, LH);
    // streaky clouds lit from below
    const r = mulberry(5);
    for (let i = 0; i < 26; i++) {
      const x = r() * 1300 - 100, y = 520 + r() * 420, w = 120 + r() * 320, hh = 6 + r() * 16;
      ctx.fillStyle = `rgba(${r() > .5 ? '255,120,110' : '170,60,110'},${.12 + r() * .18})`; ctx.beginPath(); ctx.ellipse(x, y, w, hh, 0, 0, 7); ctx.fill();
      ctx.fillStyle = `rgba(255,230,170,${.12 + r() * .15})`; ctx.beginPath(); ctx.ellipse(x, y + hh * .6, w * .8, hh * .35, 0, 0, 7); ctx.fill();
    }
    // distant palace silhouettes in haze (atmospheric perspective)
    const far = (col, base, sc, seed) => {
      const q = mulberry(seed); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200, 1160);
      for (let x = -200; x < 1300; x += 60 * sc) {
        const kind = q(); const top = base - (30 + q() * 60) * sc;
        ctx.lineTo(x, top);
        if (kind > .6) { const dw = 26 * sc; ctx.lineTo(x + 6 * sc, top); ctx.bezierCurveTo(x + 6 * sc - dw * .3, top - dw * .9, x + 30 * sc - dw * .2, top - dw * 1.5, x + 30 * sc, top - dw * 2); ctx.bezierCurveTo(x + 30 * sc + dw * .2, top - dw * 1.5, x + 54 * sc + dw * .3, top - dw * .9, x + 54 * sc, top); }
        else if (kind > .45) { ctx.lineTo(x + 24 * sc, top); ctx.lineTo(x + 24 * sc, top - 110 * sc); ctx.lineTo(x + 32 * sc, top - 122 * sc); ctx.lineTo(x + 40 * sc, top - 110 * sc); ctx.lineTo(x + 40 * sc, top); }
        ctx.lineTo(x + 60 * sc, top);
      }
      ctx.lineTo(1300, 1160); ctx.closePath(); ctx.fill();
    };
    far('rgba(244,160,110,.55)', 1010, .8, 11); far('rgba(214,110,96,.55)', 1050, 1.1, 12);
    ctx.fillStyle = lg(0, 1040, 0, 1160, [[0, 'rgba(255,200,120,0)'], [1, 'rgba(255,190,110,.6)']]); ctx.fillRect(-200, 1040, 1500, 120);
    // a glinting water channel at the horizon
    ctx.fillStyle = 'rgba(255,240,200,.75)'; ctx.fillRect(-200, 1096, 1500, 3);

    // ---- facade (drawn on a temp canvas so the great arch can be cut out)
    const FAC = cv(LW, LH, () => {
      ctx.translate(OX, OY);
      // central dome + chhatris behind the parapet
      const dome = (cx, by, w, hh) => { ctx.beginPath(); ctx.moveTo(cx - w * .5, by); ctx.bezierCurveTo(cx - w * .62, by - hh * .45, cx - w * .2, by - hh * .7, cx, by - hh); ctx.bezierCurveTo(cx + w * .2, by - hh * .7, cx + w * .62, by - hh * .45, cx + w * .5, by); ctx.closePath(); };
      ctx.fillStyle = lg(0, 120, 0, 400, [[0, '#7a2a52'], [1, '#521840']]);
      dome(540, 390, 330, 250); ctx.fill();
      ctx.fillStyle = '#ffcf7a'; ctx.fillRect(537, 110, 6, 40); ctx.beginPath(); ctx.arc(540, 150, 8, 0, 7); ctx.fill();
      ctx.save(); dome(540, 390, 330, 250); ctx.clip(); ctx.strokeStyle = 'rgba(255,200,140,.55)'; ctx.lineWidth = 8; dome(546, 394, 330, 250); ctx.stroke(); ctx.restore();
      for (const cx of [150, 930]) {
        ctx.fillStyle = '#4e1a3c'; dome(cx, 300, 150, 120); ctx.fill(); ctx.fillRect(cx - 80, 296, 160, 14);
        ctx.fillStyle = '#ffcf7a'; ctx.fillRect(cx - 2, 160, 4, 26);
        for (const px of [-60, -20, 20, 60]) { ctx.fillStyle = '#431431'; ctx.fillRect(cx + px - 6, 308, 12, 80); }
        ctx.strokeStyle = 'rgba(255,190,120,.6)'; ctx.lineWidth = 3; dome(cx, 300, 150, 120); ctx.stroke();
      }
      // main wall
      ctx.fillStyle = lg(0, 380, 0, 1160, [[0, '#7e2c4c'], [.4, '#561a3c'], [1, '#26091f']]);
      ctx.fillRect(-OX, 380, LW, 780);
      // bounce light from the courtyard around the arch
      ctx.fillStyle = rg(540, 1000, 40, 650, [[0, 'rgba(255,140,70,.4)'], [1, 'rgba(255,120,60,0)']]); ctx.fillRect(-OX, 380, LW, 780);
      ctx.fillStyle = lg(-OX, 0, W + OX, 0, [[0, 'rgba(6,30,40,.45)'], [.3, 'rgba(6,30,40,0)'], [.7, 'rgba(6,30,40,0)'], [1, 'rgba(6,30,40,.45)']]); ctx.fillRect(-OX, 380, LW, 780);
      // stone courses + texture
      for (let y = 400; y < 1160; y += 38) { ctx.fillStyle = 'rgba(30,0,20,.12)'; ctx.fillRect(-OX, y, LW, 2); }
      const q = mulberry(9); for (let i = 0; i < 5000; i++) { ctx.fillStyle = `rgba(${q() > .5 ? '255,200,170' : '20,0,10'},${q() * .07})`; ctx.fillRect(q() * LW - OX, 380 + q() * 780, 2 + q() * 4, 2); }
      // parapet with cusped merlons
      ctx.fillStyle = '#6a2444';
      for (let x = -200; x < 1300; x += 44) { ctx.beginPath(); ctx.moveTo(x, 382); ctx.lineTo(x, 362); ctx.quadraticCurveTo(x + 22, 336, x + 44 - 8, 362); ctx.lineTo(x + 36, 382); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,190,130,.5)'; ctx.fillRect(-OX, 380, LW, 4);
      // cornices
      const cornice = (y) => { ctx.fillStyle = '#8a3a56'; ctx.fillRect(-OX, y, LW, 14); ctx.fillStyle = 'rgba(255,200,150,.5)'; ctx.fillRect(-OX, y, LW, 3); ctx.fillStyle = 'rgba(20,0,15,.45)'; ctx.fillRect(-OX, y + 14, LW, 10); for (let x = -200; x < 1300; x += 26) { ctx.fillStyle = 'rgba(40,5,25,.5)'; ctx.fillRect(x, y + 14, 10, 16); } };
      cornice(470); cornice(800);
      // side arcades: two storeys
      const recess = (cx, w, y0, ys, yp, lamp) => {
        cuspArch(cx, w, y0, ys, yp, 7, .55);
        ctx.fillStyle = lg(0, yp, 0, y0, [[0, '#0d4a52'], [1, '#04191f']]); ctx.fill();
        if (lamp) { ctx.save(); ctx.clip(); ctx.fillStyle = rg(cx, y0 - (y0 - ys) * .4, 4, w * .9, [[0, 'rgba(255,190,90,.95)'], [.3, 'rgba(255,120,50,.45)'], [1, 'rgba(255,90,40,0)']]); ctx.fillRect(cx - w, yp, w * 2, y0 - yp); ctx.restore(); }
        ctx.strokeStyle = 'rgba(255,196,140,.55)'; ctx.lineWidth = 3; cuspArch(cx, w + 12, y0, ys - 4, yp - 10, 7, .55); ctx.stroke();
        ctx.strokeStyle = 'rgba(30,0,20,.5)'; ctx.lineWidth = 2; cuspArch(cx, w + 20, y0, ys - 6, yp - 16, 7, .55); ctx.stroke();
        for (const s of [-1, 1]) { const rx = cx + s * (w / 2 + 2), ry = yp + 10; ctx.fillStyle = 'rgba(255,200,110,.6)'; ctx.beginPath(); ctx.arc(rx, ry, 7, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(194,24,91,.7)'; ctx.beginPath(); ctx.arc(rx, ry, 3, 0, 7); ctx.fill(); }
      };
      for (const cx of [20, 160, 920, 1060]) { recess(cx, 92, 1160, 980, 870, true); recess(cx, 70, 770, 690, 610, cx === 160 || cx === 920); ctx.fillStyle = '#9c4560'; ctx.fillRect(cx - 54, 768, 108, 10); for (let k = -2; k <= 2; k++) { ctx.fillStyle = '#5a1d3a'; ctx.beginPath(); ctx.moveTo(cx + k * 22 - 6, 778); ctx.lineTo(cx + k * 22 + 6, 778); ctx.lineTo(cx + k * 22, 800); ctx.fill(); } }
      // jali screens between
      for (const cx of [90, 990]) { ctx.save(); ctx.translate(cx, 560); ctx.fillStyle = '#2a0a22'; ctx.fillRect(-22, -60, 44, 120); ctx.strokeStyle = 'rgba(255,170,110,.35)'; ctx.lineWidth = 1.5; for (let y = -54; y < 60; y += 12) for (let x = -16; x < 20; x += 12) { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke(); } ctx.restore(); }
      // pishtaq (frame of the great arch) with inlay border
      ctx.fillStyle = lg(300, 0, 780, 0, [[0, '#4e1634'], [.5, '#7a2a46'], [1, '#4e1634']]); ctx.fillRect(290, 470, 500, 690);
      ctx.strokeStyle = '#e8b25a'; ctx.lineWidth = 4; ctx.strokeRect(300, 482, 480, 690); ctx.strokeStyle = 'rgba(15,90,94,.9)'; ctx.lineWidth = 10; ctx.strokeRect(312, 494, 456, 690);
      ctx.strokeStyle = 'rgba(232,178,90,.7)'; ctx.lineWidth = 2; ctx.strokeRect(320, 502, 440, 690);
      for (let y = 500; y < 1150; y += 34) for (const x of [306, 774]) { ctx.fillStyle = 'rgba(255,214,120,.65)'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill(); }
      // spandrel rosettes
      for (const x of [372, 708]) { ctx.save(); ctx.translate(x, 560); for (let k = 0; k < 8; k++) { ctx.rotate(Math.PI / 4); ctx.fillStyle = k % 2 ? 'rgba(232,178,90,.8)' : 'rgba(15,110,110,.9)'; ctx.beginPath(); ctx.ellipse(0, -14, 5, 12, 0, 0, 7); ctx.fill(); } ctx.fillStyle = '#ffd77a'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill(); ctx.restore(); }
      // cut the great arch
      ctx.globalCompositeOperation = 'destination-out'; cuspArch(540, 380, 1170, 790, 560, 11, .5); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    });
    ctx.drawImage(FAC, -OX, -OY);
    // sunlit soffit (thickness of the great arch, glowing)
    ctx.save(); cuspArch(540, 380, 1170, 790, 560, 11, .5); ctx.clip();
    ctx.strokeStyle = 'rgba(255,214,150,.95)'; ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = 'rgba(255,250,230,.9)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    ctx.strokeStyle = 'rgba(232,178,90,.9)'; ctx.lineWidth = 4; cuspArch(540, 404, 1170, 786, 540, 11, .5); ctx.stroke();
    // base shadow line where the wall meets the floor
    ctx.fillStyle = lg(0, 1120, 0, 1160, [[0, 'rgba(20,0,10,0)'], [1, 'rgba(20,0,10,.5)']]); ctx.fillRect(-OX, 1120, LW, 40);
    ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = lg(0, -220, 0, 1160, [[0, 'rgba(255,140,60,.4)'], [.6, 'rgba(255,160,80,.2)'], [1, 'rgba(0,110,120,.35)']]); ctx.fillRect(-OX, -OY, LW, LH);
  });

  // ---------------------------------------------------------------- polished floor (world y 1150..2140)
  const FY0 = 1150, FH = 990;
  const FLOOR = cv(LW, FH, () => {
    ctx.translate(OX, -FY0);
    ctx.fillStyle = lg(0, FY0, 0, FY0 + FH, [[0, '#c46a5a'], [.18, '#8a3448'], [.5, '#4a1430'], [1, '#1c0612']]); ctx.fillRect(-OX, FY0, LW, FH);
    // mirrored reflection of the background (blurred)
    ctx.save(); ctx.globalAlpha = .38; ctx.filter = 'blur(7px)'; ctx.translate(0, FY0 * 2); ctx.scale(1, -1); ctx.drawImage(BG, -OX, -OY); ctx.restore();
    ctx.fillStyle = lg(0, FY0, 0, FY0 + FH, [[0, 'rgba(40,5,25,0)'], [.45, 'rgba(40,5,25,.45)'], [1, 'rgba(20,2,14,.9)']]); ctx.fillRect(-OX, FY0, LW, FH);
    // sun pool streaming through the arch toward camera
    ctx.save(); ctx.filter = 'blur(26px)'; ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lg(0, FY0, 0, FY0 + 700, [[0, 'rgba(255,200,120,.75)'], [.5, 'rgba(255,150,80,.3)'], [1, 'rgba(255,120,60,0)']]);
    ctx.beginPath(); ctx.moveTo(380, FY0); ctx.lineTo(700, FY0); ctx.lineTo(1000, FY0 + 700); ctx.lineTo(80, FY0 + 700); ctx.closePath(); ctx.fill(); ctx.restore();
    // inlay grid in perspective (vanishing point at eye level)
    const VX = 540, VY = 1000;
    ctx.lineWidth = 2;
    for (let k = -14; k <= 14; k++) { const xb = VX + k * 150; ctx.strokeStyle = `rgba(255,205,130,${.16 - Math.abs(k) * .006})`; ctx.beginPath(); ctx.moveTo(VX + (xb - VX) * (FY0 - VY) / (FY0 + FH - VY), FY0); ctx.lineTo(xb, FY0 + FH); ctx.stroke(); }
    for (let j = 0; j < 14; j++) { const y = VY + 150 * Math.pow(1.36, j); if (y > FY0 + FH) break; if (y < FY0) continue; ctx.strokeStyle = `rgba(255,205,130,${.1 + j * .012})`; ctx.lineWidth = 1 + j * .3; ctx.beginPath(); ctx.moveTo(-OX, y); ctx.lineTo(W + OX, y); ctx.stroke(); }
    // teal inlay runner
    ctx.strokeStyle = 'rgba(30,170,160,.25)'; ctx.lineWidth = 3;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(VX + s * 150 * (FY0 - VY) / (FY0 + FH - VY) * 1.5, FY0); ctx.lineTo(VX + s * 225, FY0 + FH); ctx.stroke(); }
  });

  // ---------------------------------------------------------------- foreground: proscenium arch + garlands (pre-blurred)
  const FGH = 900;
  const FG = (() => {
    const sharp = cv(LW, FGH, () => {
      ctx.translate(OX, OY);
      ctx.fillStyle = lg(0, -200, 0, 680, [[0, '#14040e'], [1, '#2a0a1c']]); ctx.fillRect(-OX, -OY, LW, FGH);
      // carved inlay on spandrels
      ctx.strokeStyle = 'rgba(232,178,90,.18)'; ctx.lineWidth = 2;
      for (let i = 0; i < 9; i++) for (const x of [80, 1000]) { ctx.beginPath(); ctx.arc(x, 60, 30 + i * 22, 0, 7); ctx.stroke(); }
      ctx.globalCompositeOperation = 'destination-out'; cuspArch(540, 1210, 1400, 720, 30, 13, .45); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
      // rim light on the inner edge
      ctx.save(); cuspArch(540, 1210, 1400, 720, 30, 13, .45); ctx.rect(-OX, -OY, LW, FGH); ctx.clip('evenodd');
      cuspArch(540, 1210, 1400, 720, 30, 13, .45); ctx.strokeStyle = 'rgba(255,190,110,.75)'; ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,200,.8)'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
      // marigold garland swags along the opening
      const flower = (x, y, r, c) => {
        ctx.fillStyle = rg(x - r * .3, y - r * .3, 1, r * 1.1, [[0, mixc(c, '#fff3b0', .45)], [.6, c], [1, mixc(c, '#401000', .55)]]);
        ctx.beginPath(); for (let k = 0; k <= 14; k++) { const a = k / 14 * 6.283, rr_ = r * (k % 2 ? .82 : 1); ctx.lineTo(x + Math.cos(a) * rr_, y + Math.sin(a) * rr_); } ctx.fill();
        ctx.strokeStyle = 'rgba(90,25,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r * .5, 0, 7); ctx.stroke();
      };
      const q = mulberry(31);
      const swag = (x0, y0, x1, y1, sag, r) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (r * 1.25)); for (let i = 0; i <= n; i++) { const u = i / n; const x = lerp(x0, x1, u), y = lerp(y0, y1, u) + Math.sin(u * Math.PI) * sag; if (i % 5 === 2) { ctx.fillStyle = '#2f7a3a'; ctx.beginPath(); ctx.ellipse(x, y + r, r * .5, r * 1.1, .4, 0, 7); ctx.fill(); } flower(x + (q() - .5) * 3, y + (q() - .5) * 3, r * (0.9 + q() * .2), q() > .45 ? '#ff8a00' : '#ffc21a'); } };
      swag(-120, 300, 230, 140, 120, 15); swag(230, 140, 540, 70, 90, 15); swag(540, 70, 850, 140, 90, 15); swag(850, 140, 1200, 300, 120, 15);
      // hanging strands (ladi)
      for (const x of [230, 850]) { for (let i = 0; i < 12; i++) flower(x, 150 + i * 24, 12, i % 2 ? '#ff8a00' : '#ffc21a'); ctx.fillStyle = '#c2185b'; ctx.beginPath(); ctx.moveTo(x - 7, 430); ctx.lineTo(x + 7, 430); ctx.lineTo(x, 470); ctx.fill(); }
    });
    return cv(LW, FGH, () => { ctx.filter = 'blur(3px)'; ctx.drawImage(sharp, 0, 0); });
  })();
  // non-empty regions of FG (canvas px): top band + side strips
  const FG_RECTS = [[0, 0, LW, OY + 300], [0, OY + 300, OX + 260, FGH - OY - 300], [LW - OX - 260, OY + 300, OX + 260, FGH - OY - 300]];

  // ---------------------------------------------------------------- god rays (two sets, cross-faded)
  const RAYS = [1, 2].map(seed => cv(LW / 2, LH / 2, () => {
    ctx.scale(.5, .5); ctx.translate(OX, OY); ctx.globalCompositeOperation = 'lighter';
    const q = mulberry(100 + seed);
    for (let i = 0; i < 18; i++) {
      const a = Math.PI / 2 + (q() - .5) * 2.1, wdt = .012 + q() * .05, len = 1500;
      const g = ctx.createRadialGradient(SUN[0], SUN[1], 0, SUN[0], SUN[1], len);
      const al = .12 + q() * .26; g.addColorStop(0, `rgba(255,236,190,${al})`); g.addColorStop(.5, `rgba(255,190,120,${al * .5})`); g.addColorStop(1, 'rgba(255,150,80,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(SUN[0], SUN[1]); ctx.arc(SUN[0], SUN[1], len, a - wdt, a + wdt); ctx.closePath(); ctx.fill();
    }
  }));
  const RAYS_B = cv(LW / 2, LH / 2, () => { ctx.filter = 'blur(10px)'; ctx.drawImage(RAYS[0], 0, 0); ctx.globalAlpha = .5; ctx.drawImage(RAYS[1], 0, 0); });
  const RY0 = OY + SUN[1] - 120;   // rays only exist below this canvas row

  // dancer's long shadow / contact shadow (soft)
  const SHADOW = cv(800, 900, () => { ctx.filter = 'blur(30px)'; ctx.fillStyle = 'rgba(15,0,10,.9)'; ctx.beginPath(); ctx.ellipse(400, 110, 290, 55, 0, 0, 7); ctx.fill(); ctx.globalAlpha = .5; ctx.beginPath(); ctx.ellipse(400, 420, 230, 330, 0, 0, 7); ctx.fill(); });

  // ---------------------------------------------------------------- scene data
  const rnd = mulberry(2024);
  const SWIRL = Array.from({ length: 70 }, (_, i) => ({ r: 180 + rnd() * 420, a: rnd() * 6.283, y: 560 + rnd() * 900, w: .35 + rnd() * .35, rise: 10 + rnd() * 30, c: Math.floor(rnd() * 4.6) % 4, s: .5 + rnd() * .55, rot: rnd() * 6, spin: (rnd() - .5) * 5, fl: rnd() * 6 }));
  const NEAR = Array.from({ length: 12 }, (_, i) => ({ x: rnd() * 1100 - 10, y: rnd() * 1400 - 100, s: 1.8 + rnd() * 2.2, c: Math.floor(rnd() * 3), rot: rnd() * 6, vx: (rnd() - .5) * 60, vy: 60 + rnd() * 70 }));
  const MOTES = Array.from({ length: 150 }, () => ({ x: rnd() * 1200 - 60, y: 300 + rnd() * 1300, z: rnd(), ph: rnd() * 100 }));
  const LANTS = [{ x: 160, y: 470, d: 1.45, s: .9, ph: 0 }, { x: 930, y: 420, d: 1.45, s: .82, ph: 2 }, { x: 330, y: 330, d: .8, s: .45, ph: 4 }, { x: 760, y: 310, d: .8, s: .42, ph: 1 }];
  const DIYAS = []; for (let i = 0; i < 9; i++) { const u = i / 8; DIYAS.push([lerp(300, 120, u) - 30 * u, lerp(1175, 1480, Math.pow(u, 1.3))], [lerp(780, 960, u) + 30 * u, lerp(1175, 1480, Math.pow(u, 1.3))]); }
  for (let i = 0; i < 7; i++) DIYAS.push([380 + i * 54, 1168]);

  // ---------------------------------------------------------------- camera
  function cam(lt) {
    const a = E.sine(P(lt, 0, DUR)), push = E.io(P(lt, 2.0, DUR));
    return { Z: lerp(1.0, 1.12, a) * lerp(1, 1.55, push), fx: lerp(540, 515, push), fy: lerp(960, 820, push) + lerp(18, -10, a), ox: lerp(-70, 95, a), roll: lerp(-.018, .012, a) };
  }
  function L(c, depth, fn) {
    ctx.save(); const z = Math.pow(c.Z, depth);
    ctx.translate(540 + c.ox * (1 - depth), 960); ctx.rotate(c.roll * depth); ctx.scale(z, z); ctx.translate(-c.fx, -c.fy); fn(z); ctx.restore();
  }
  // floor: parallax shift varies with y (true orbit look)
  function floorT(c, fn) {
    ctx.save(); ctx.translate(540, 960); ctx.rotate(c.roll); ctx.scale(c.Z, c.Z); ctx.translate(-c.fx, -c.fy);
    const s0 = c.ox * (1 - .45) / c.Z, k = -(c.ox * .55 / 270) / c.Z;   // depth .45 at FY0, 1 at 1420
    ctx.translate(s0, 0); ctx.transform(1, 0, k, 1, -k * FY0, 0); fn(); ctx.restore();
  }
  const toScreen = (c, depth, x, y) => { const z = Math.pow(c.Z, depth); let dx = (x - c.fx) * z, dy = (y - c.fy) * z; const r = c.roll * depth, cs = Math.cos(r), sn = Math.sin(r); return [540 + c.ox * (1 - depth) + dx * cs - dy * sn, 960 + dx * sn + dy * cs]; };

  // ---------------------------------------------------------------- the dancer (local coords: waist at 0,0)
  const SK = { rw: 46, Rh: 305, Hs: 335, N: 9 };
  const SUNL = [SUN[0] - DX, SUN[1] - DY];           // sun in dancer-local coords
  const toSun = (x, y) => nrm(SUNL[0] - x, SUNL[1] - y);
  function skirtPt(th, v, spin, R = SK.Rh, amp = .1, ph = 0) {
    const r = lerp(SK.rw, R, Math.pow(v, .9)) * (1 + amp * Math.pow(v, 1.6) * Math.sin(SK.N * (th - spin) + ph));
    const v2 = v * v, phi = spin * .35 + .9;
    const y = 10 + v * SK.Hs + Math.sin(th) * r * (.05 + .2 * v) + v2 * 20 * Math.sin(5 * th - spin * 1.7 + ph + 1) + v2 * 34 * Math.cos(th - phi);
    return [Math.cos(th) * r, y];
  }
  function skirtLayer(spin, R, vmax, amp, ph, colFn, alpha, K = 44, vmin = 0) {
    ctx.save(); ctx.globalAlpha *= alpha;
    const VS = [0, .15, .32, .5, .68, .84, .94, 1].map(v => lerp(vmin, vmax, v));
    for (let i = 0; i < K; i++) {
      const t0 = -0.03 + (Math.PI + .06) * i / K, t1 = -0.03 + (Math.PI + .06) * (i + 1.3) / K, tm = (t0 + t1) / 2;
      ctx.beginPath();
      VS.forEach((v, j) => { const p = skirtPt(t0, v, spin, R, amp, ph); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
      for (let j = VS.length - 1; j >= 0; j--) { const p = skirtPt(t1, VS[j], spin, R, amp, ph); ctx.lineTo(p[0], p[1]); }
      ctx.closePath(); ctx.fillStyle = colFn(tm); ctx.fill();
    }
    ctx.restore();
  }
  const SKCOL = ['#2a0219', '#560631', '#93104a', '#d42566', '#ff5f86', '#ffb27a', '#fff0c0'];
  function ramp(stops, k) { k = clamp(k) * (stops.length - 1); const i = Math.min(stops.length - 2, Math.floor(k)); return mixc(stops[i], stops[i + 1], k - i); }
  function skirtShade(spin) {
    return tm => {
      let fold = 0; for (let s = 0; s < 4; s++) fold += Math.cos(SK.N * (tm - spin + s * .03)) / 4;     // 4-sample motion blur
      const f2 = Math.sign(fold) * Math.pow(Math.abs(fold), .7);
      const edge = 1 - Math.sin(tm), lum = .26 + .2 * f2 + .5 * edge * edge * edge + .06 * Math.cos(tm * 2);
      const g = ctx.createLinearGradient(0, 0, 0, SK.Hs + 80);
      g.addColorStop(0, ramp(SKCOL, lum * .5)); g.addColorStop(.55, ramp(SKCOL, lum)); g.addColorStop(.85, ramp(SKCOL, lum + .1)); g.addColorStop(1, ramp(SKCOL, lum + .3));
      return g;
    };
  }
  function hemCurve(spin, v, a0 = 0, a1 = Math.PI, n = 40, R = SK.Rh, amp = .1, ph = 0) { const pts = []; for (let i = 0; i <= n; i++) pts.push(skirtPt(lerp(a0, a1, i / n), v, spin, R, amp, ph)); return pts; }

  function drawSkirt(spin, lite) {
    // translucent chiffon over-flare (behind), teal petticoat, main lehenga
    skirtLayer(spin * .9, SK.Rh * 1.17, 1.03, .14, 2.1, tm => `rgba(255,${70 + 90 * Math.pow(1 - Math.sin(tm), 2) | 0},${120 - 40 * (1 - Math.sin(tm)) | 0},.32)`, 1, lite ? 12 : 28, .45);
    skirtLayer(spin * .96, SK.Rh * 1.02, 1.05, .12, 1.2, tm => ramp(['#021d22', '#07484d', '#16938c', '#ffe0a0'], .2 + .75 * Math.pow(1 - Math.sin(tm), 2.5)), 1, lite ? 12 : 28, .78);
    if (!lite) { ctx.strokeStyle = 'rgba(255,207,106,.9)'; ctx.lineWidth = 3; polyline(hemCurve(spin * .96, 1.05, 0, Math.PI, 50, SK.Rh * 1.02, .12, 1.2)); ctx.stroke(); }
    ctx.beginPath(); hemCurve(spin, 1, 0, Math.PI).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.lineTo(-SK.rw, 10); ctx.lineTo(SK.rw, 10); ctx.closePath(); ctx.fillStyle = '#5a0632'; ctx.fill();
    skirtLayer(spin, SK.Rh, 1, .1, 0, skirtShade(spin), 1, lite ? 22 : 54);
    if (lite) return;
    ctx.save(); ctx.lineCap = 'round';
    // kali seams: fine gold lines rotating with the spin (motion-blurred samples)
    for (let j = 0; j < 18; j++) for (let s = 0; s < 3; s++) {
      const th = ((j / 18) * Math.PI * 2 + spin - s * .045) % (Math.PI * 2);
      if (th < .05 || th > Math.PI - .05) continue;
      const pts = [.07, .25, .45, .62, .78, .87].map(v => skirtPt(th, v, spin));
      ctx.strokeStyle = `rgba(255,${196 + s * 20},120,${(.42 - s * .13) * (.35 + .65 * Math.sin(th))})`; ctx.lineWidth = 1.8 - s * .4; polyline(pts); ctx.stroke();
    }
    // embroidered butis (gold sequins), twinkling, with short smear
    ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 30; j++) for (const v of [.34, .52, .7]) {
      const th0 = ((j / 30) * Math.PI * 2 + spin + v * 3 + .1) % (Math.PI * 2); if (th0 < .12 || th0 > Math.PI - .12) continue;
      const p = skirtPt(th0, v, spin), q2 = skirtPt(th0 - .018, v, spin);
      const tw = .5 + .5 * Math.sin(j * 7.1 + v * 20 + spin * 6);
      ctx.strokeStyle = `rgba(255,220,150,${.25 + .45 * tw})`; ctx.lineWidth = 3 + v * 1.6; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // single tier band
    { const pts = hemCurve(spin, .6, 0, Math.PI, 40);
      ctx.strokeStyle = 'rgba(40,0,20,.45)'; ctx.lineWidth = 7; polyline(pts.map(p => [p[0], p[1] + 3])); ctx.stroke();
      ctx.strokeStyle = lg(-SK.Rh, 0, SK.Rh, 0, [[0, '#fff0b8'], [.2, '#d9952e'], [.5, '#7a4410'], [.8, '#d9952e'], [1, '#fff0b8']]); ctx.lineWidth = 4.5; polyline(pts); ctx.stroke(); }
    // broad gold hem border
    const top = hemCurve(spin, .86, 0, Math.PI, 50), bot = hemCurve(spin, 1, 0, Math.PI, 50);
    ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath();
    ctx.fillStyle = lg(-SK.Rh, 0, SK.Rh, 0, [[0, '#fff3c4'], [.1, '#f2b440'], [.28, '#9a5616'], [.5, '#6a360c'], [.72, '#9a5616'], [.9, '#f2b440'], [1, '#fff3c4']]); ctx.fill();
    ctx.save(); ctx.clip();
    for (let s = 0; s < 2; s++) {
      ctx.strokeStyle = s ? 'rgba(150,8,64,.3)' : 'rgba(150,8,64,.7)'; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 130; i++) { const th = i / 130 * Math.PI, v = .93 + .045 * Math.sin((th - spin + s * .04) * 46); const p = skirtPt(th, v, spin); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    // fold shading carried into the border
    for (let i = 0; i < 40; i++) { const th = (i + .5) / 40 * Math.PI, f = Math.cos(SK.N * (th - spin)); if (f > -.2) continue; const p = skirtPt(th, .93, spin); ctx.fillStyle = `rgba(40,0,15,${-f * .35})`; ctx.beginPath(); ctx.ellipse(p[0], p[1], 9, 24, 0, 0, 7); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = '#ffe9a8'; ctx.lineWidth = 2.5; polyline(bot); ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,200,.6)'; ctx.lineWidth = 1.6; polyline(top); ctx.stroke();
    // long-exposure light trails from hem sequins + chiffon smear outside the hem
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 14; k++) {
      const th = ((k / 14) * Math.PI * 2 + spin) % (Math.PI * 2); if (th > Math.PI + .2) continue;
      for (let s = 0; s < 9; s++) {
        const a0 = th - s * .07, a1 = th - (s + 1) * .07; if (a1 < -.1) break;
        const p0 = skirtPt(a0, .965, spin), p1 = skirtPt(a1, .965, spin);
        ctx.strokeStyle = `rgba(255,236,180,${.85 * Math.pow(1 - s / 9, 1.5)})`; ctx.lineWidth = 3.6 - s * .3; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
      }
    }
    for (let k = 0; k < 5; k++) {
      const R = SK.Rh * (1.07 + k * .035), a0 = k % 2 ? 0 : Math.PI - .95, ph = k * 1.3;
      const pts = hemCurve(spin * .85, .99, a0, a0 + .95, 18, R, .06, ph);
      for (let i = 0; i < pts.length - 1; i++) { const u = i / (pts.length - 1), al = Math.sin(u * Math.PI) * (.16 - k * .02); ctx.strokeStyle = `rgba(255,${120 + k * 20},150,${al})`; ctx.lineWidth = 7 - k; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); }
    }
    ctx.restore();
    for (const s of [-1, 1]) { const p = skirtPt(s < 0 ? Math.PI : 0, .8, spin); glow(G_WARM, p[0] + s * 4, p[1], 130, .4); }
  }

  const SKIN = ['#2e0f0c', '#5e2619', '#94492f', '#c97a50', '#ffd2a0'];
  const RIM = 'rgba(255,214,150,1)';
  function arm(pts, w0, w1, lit = 1) {
    const sp = crPts(pts, 7); const { path } = tube(sp, u => lerp(w0, w1, u) * (1 - .25 * Math.pow(u, 3)));
    const a = sp[0], b = sp[sp.length - 1], m = sp[sp.length >> 1], [lx, ly] = toSun(m[0], m[1]);
    const bb = bbOf(sp, w0);
    rimP(path, lg(a[0], a[1], b[0], b[1], [[0, SKIN[1]], [.5, SKIN[2]], [1, SKIN[1]]]), lx, ly, 3.5, RIM, lit, bb);
    rimP(path, null, -lx * .3, -1, 1.6, 'rgba(255,190,130,1)', .35, bb);
    return sp;
  }
  function bangles(p, q, n, lt, seed) {
    const ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1) * .9, x = lerp(p[0], q[0], u), y = lerp(p[1], q[1], u);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.strokeStyle = i % 3 === 1 ? '#c2185b' : lg(0, -12, 0, 12, [[0, '#fff2c0'], [.5, '#d8902a'], [1, '#6a3a08']]); ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.ellipse(0, 0, 3.5, 12.5, 0, 0, 7); ctx.stroke(); ctx.restore();
    }
    const gl = Math.pow(Math.max(0, Math.sin(lt * 3.1 + seed)), 12); if (gl > .05) { const x = lerp(p[0], q[0], .4), y = lerp(p[1], q[1], .4); glow(G_GOLD, x, y - 8, 30, gl * .9); sparkle(x, y - 8, 12 * gl, '#fffbe8', lt); }
  }
  function hand(x, y, ang, s, open) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    const p = new Path2D(); p.moveTo(0, -8); p.bezierCurveTo(14, -10, 22, -8, 30, -6);
    if (open) { p.lineTo(48, -10); p.quadraticCurveTo(52, -8, 48, -6); p.lineTo(32, -2); p.lineTo(50, -1); p.quadraticCurveTo(53, 2, 49, 3); p.lineTo(31, 3); p.lineTo(45, 8); p.quadraticCurveTo(46, 11, 42, 11); p.lineTo(26, 8); }
    else { p.bezierCurveTo(42, -6, 52, -2, 54, 2); p.bezierCurveTo(50, 6, 40, 6, 28, 7); }
    p.bezierCurveTo(18, 12, 6, 10, 0, 8); p.closePath();
    rimP(p, lg(0, -10, 0, 10, [[0, SKIN[3]], [1, SKIN[1]]]), 0, -1, 2.4, RIM, 1, [-5, -15, 58, 15]);
    ctx.fillStyle = '#9a1a28'; ctx.beginPath(); ctx.ellipse(10, 0, 6, 4, 0, 0, 7); ctx.fill();   // alta (red-dyed palm edge)
    ctx.restore();
  }

  function dupatta(lt, front) {
    // long chiffon ribbon from her hand, spiralling up and behind her head
    const base = [[258, -112], [330, -150], [385, -235], [372, -340], [300, -420], [190, -470], [70, -500], [-60, -520], [-180, -545], [-300, -610]];
    const pts = crPts(base, 6).map((p, i, arr) => {
      const u = i / (arr.length - 1), A = 34 * Math.pow(u, 1.2);
      return [p[0] + Math.sin(lt * 2.6 - u * 9) * A * .6, p[1] + Math.cos(lt * 2.3 - u * 8) * A];
    });
    const n = pts.length, split = Math.floor(n * .2);
    const seg = front ? pts.slice(0, split + 1) : pts.slice(split);
    const u0 = front ? 0 : split / (n - 1);
    const wf = u => { const uu = u0 + u * (seg.length - 1) / (n - 1); return (16 + 30 * Math.sin(Math.min(1, uu * 1.6) * Math.PI / 2)) * (.25 + .75 * Math.abs(Math.cos(uu * 6.5 - lt * 1.8))); };
    const { L: Ls, R: Rs, path } = tube(seg, wf);
    ctx.save();
    ctx.fillStyle = lg(-300, -600, 380, -100, [[0, 'rgba(255,70,140,.5)'], [.5, 'rgba(255,110,40,.6)'], [1, 'rgba(255,150,40,.7)']]); ctx.fill(path);
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,160,80,.14)'; ctx.fill(path);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(255,214,120,.95)'; ctx.lineWidth = 3.5; polyline(Ls); ctx.stroke(); polyline(Rs); ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,160,.8)'; for (let i = 2; i < seg.length - 1; i += 3) { const p = seg[i]; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, 7); ctx.fill(); }
    if (!front) { const e = seg[seg.length - 1]; for (let k = -2; k <= 2; k++) { ctx.strokeStyle = '#ffcf6a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] - 26 + k * 4, e[1] - 10 + k * 8 + Math.sin(lt * 5 + k) * 4); ctx.stroke(); } }
    ctx.restore();
  }

  // static head paths (head-local coords: upright, facing left)
  const FACE = new Path2D();
  FACE.moveTo(4, -46); FACE.bezierCurveTo(-18, -48, -34, -36, -36, -16); FACE.bezierCurveTo(-37, -10, -38, -6, -40, -2);
  FACE.bezierCurveTo(-42, 4, -48, 10, -48, 14); FACE.bezierCurveTo(-48, 17, -44, 18, -41, 18); FACE.bezierCurveTo(-43, 21, -42, 23, -40, 25);
  FACE.bezierCurveTo(-41, 27, -41, 29, -38, 31); FACE.bezierCurveTo(-37, 35, -36, 38, -32, 42); FACE.bezierCurveTo(-26, 48, -14, 48, -2, 40);
  FACE.bezierCurveTo(10, 32, 18, 22, 24, 10); FACE.bezierCurveTo(34, -6, 34, -30, 22, -40); FACE.bezierCurveTo(16, -45, 10, -47, 4, -46); FACE.closePath();
  const HAIR = new Path2D();
  HAIR.moveTo(-34, -24); HAIR.bezierCurveTo(-30, -44, -8, -54, 12, -50); HAIR.bezierCurveTo(36, -44, 42, -16, 32, 8); HAIR.bezierCurveTo(26, 18, 18, 22, 12, 22); HAIR.bezierCurveTo(16, 6, 10, -8, 0, -18); HAIR.bezierCurveTo(-12, -28, -24, -28, -34, -24); HAIR.closePath();
  const BUN = new Path2D(); BUN.ellipse(30, -18, 20, 18, .3, 0, 7);
  const HEAD_POS = [-26, -262], HEAD_ROT = -.5, BB_F = [-50, -56, 44, 50];
  const HSUN = (() => { const dx = SUNL[0] - HEAD_POS[0], dy = SUNL[1] - HEAD_POS[1], c = Math.cos(-HEAD_ROT), s = Math.sin(-HEAD_ROT); return nrm(dx * c - dy * s, dx * s + dy * c); })();

  function head(lt, lite) {
    const hairCol = '#1a070d';
    if (!lite) {
      // braid streaming out behind, swinging with the spin
      const bp = crPts([[22, -16], [60, 20], [110, 44], [168, 40], [222, 18 + Math.sin(lt * 2.2) * 14], [262, 8 + Math.sin(lt * 2.2 - 1) * 22]], 6);
      for (let i = bp.length - 1; i >= 0; i--) {
        const p = bp[i], u = i / (bp.length - 1), r = 13 - u * 6;
        ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(.5 + (i % 2 ? .5 : -.5));
        ctx.fillStyle = lg(0, -r, 0, r, [[0, '#6a3420'], [.35, hairCol], [1, '#000']]); ctx.beginPath(); ctx.ellipse(0, 0, r * 1.2, r * .75, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,190,120,.6)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.2, r * .75, 0, 3.6, 5.6); ctx.stroke();
        ctx.restore();
        if (i % 7 === 3) { ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 7); ctx.fill(); }
      }
      const e = bp[bp.length - 1]; ctx.fillStyle = '#c2185b'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] + 34, e[1] + 6); ctx.lineTo(e[0] + 30, e[1] + 18); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.arc(e[0] + 33, e[1] + 12, 5, 0, 7); ctx.fill();
    }
    rimP(FACE, lg(-48, 0, 30, 0, [[0, SKIN[3]], [.3, SKIN[2]], [1, SKIN[1]]]), -.75, -.66, 2.6, RIM, .9, BB_F);
    if (lite) return;
    rimP(FACE, null, HSUN[0], HSUN[1], 2.5, RIM, .8, BB_F);
    glow(G_MAG, -24, 14, 18, .22);
    rimP(HAIR, lg(-30, -50, 30, 10, [[0, '#4a1f18'], [.3, hairCol], [1, '#050002']]), HSUN[0], HSUN[1], 3.2, 'rgba(255,196,120,1)', 1, BB_F);
    rimP(HAIR, null, -.3, -1, 2, 'rgba(255,196,120,1)', .7, BB_F);
    rimP(BUN, lg(10, -36, 50, 0, [[0, '#3a1610'], [1, '#050002']]), HSUN[0], HSUN[1], 3, 'rgba(255,196,120,1)', 1, [8, -40, 52, 4]);
    // backlit flyaway strands
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,200,130,.5)'; ctx.lineWidth = .9;
    for (let k = 0; k < 6; k++) { const a = -1.2 + k * .35, wv = Math.sin(lt * 3 + k) * 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 34, -12 + Math.sin(a) * 36); ctx.quadraticCurveTo(Math.cos(a) * 46 + wv, -14 + Math.sin(a) * 46, Math.cos(a) * 52 + wv, -10 + Math.sin(a) * 52); ctx.stroke(); }
    ctx.restore();
    for (let k = 0; k < 7; k++) { const a = -1.6 + k * .45; ctx.fillStyle = k % 2 ? '#fff6e6' : '#ffd36b'; ctx.beginPath(); ctx.arc(30 + Math.cos(a) * 21, -18 + Math.sin(a) * 19, 3.2, 0, 7); ctx.fill(); }  // gajra (jasmine)
    // ear + jhumka
    ctx.fillStyle = SKIN[1]; ctx.beginPath(); ctx.ellipse(12, 6, 6, 10, .2, 0, 7); ctx.fill();
    const sw = Math.sin(lt * 2.4) * .25 + .35;
    ctx.save(); ctx.translate(12, 16); ctx.rotate(sw);
    ctx.strokeStyle = '#ffcf6a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, 22); ctx.bezierCurveTo(-10, 10, 10, 10, 10, 22); ctx.closePath(); ctx.fillStyle = lg(-10, 0, 10, 0, [[0, '#7a4410'], [.6, '#ffd36b'], [1, '#fff6d0']]); ctx.fill();
    ctx.fillStyle = '#c2185b'; ctx.beginPath(); ctx.arc(0, 15, 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff6e6'; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.arc(k * 4.5, 25, 1.8, 0, 7); ctx.fill(); }
    ctx.restore();
    // closed eye, lashes, brow
    ctx.strokeStyle = '#140406'; ctx.lineCap = 'round';
    ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-36, -3); ctx.quadraticCurveTo(-28, 3, -19, -1); ctx.stroke();
    ctx.lineWidth = 1.4; for (let k = 0; k < 5; k++) { const x = -34 + k * 3.6, y = -1 + Math.sin(k / 4 * Math.PI) * 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 2 - k * .3, y + 5); ctx.stroke(); }
    ctx.fillStyle = 'rgba(120,20,60,.35)'; ctx.beginPath(); ctx.ellipse(-27, -5, 9, 3.5, -.1, 0, 7); ctx.fill();   // lid colour
    ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-37, -12); ctx.quadraticCurveTo(-28, -18, -16, -14); ctx.stroke();
    // lips
    ctx.fillStyle = '#a0183a'; ctx.beginPath(); ctx.moveTo(-41, 21); ctx.quadraticCurveTo(-36, 22, -33, 25); ctx.quadraticCurveTo(-37, 28, -39, 30); ctx.quadraticCurveTo(-41, 27, -41, 21); ctx.fill();
    // maang tikka
    ctx.strokeStyle = '#ffcf6a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-4, -48); ctx.quadraticCurveTo(-24, -44, -32, -30); ctx.stroke();
    ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.arc(-32, -28, 4.5, 0, 7); ctx.fill(); ctx.fillStyle = '#d0104a'; ctx.beginPath(); ctx.arc(-32, -28, 2.2, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(-33, -21, 1.8, 0, 7); ctx.fill();
    // nath (nose ring) with chain to the hair
    ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-40, 22, 9, -1.9, 1.6); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-34, 18); ctx.quadraticCurveTo(-6, 34, 10, 0); ctx.stroke();
    ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(-34, 29, 2, 0, 7); ctx.fill();
  }
  const NATH = [-36, 28], TIKKA = [-32, -28];

  function dancer(lt, spin, lite = false) {
    const br = Math.sin(lt * 2.1) * 1.5;
    if (!lite) dupatta(lt, false);
    drawSkirt(spin, lite);
    // torso
    ctx.save(); ctx.translate(0, 4); ctx.rotate(.07);
    const T1 = new Path2D();
    T1.moveTo(-40, 0); T1.bezierCurveTo(-46, -30, -50, -60, -47, -90); T1.bezierCurveTo(-56, -110, -58, -140, -60, -168 - br);
    T1.bezierCurveTo(-46, -186, -28, -190, -14, -196); T1.lineTo(12, -194); T1.bezierCurveTo(30, -188, 50, -184, 58, -170 - br);
    T1.bezierCurveTo(52, -140, 52, -112, 45, -90); T1.bezierCurveTo(44, -60, 42, -30, 40, 0); T1.closePath();
    const skinG = lg(-60, 0, 60, 0, [[0, SKIN[2]], [.35, SKIN[1]], [.75, SKIN[1]], [1, SKIN[2]]]);
    rimP(T1, skinG, .5, -.85, 3.5, RIM, 1, [-62, -200, 62, 4]); rimP(T1, null, -.8, -.6, 2.5, RIM, .7, [-62, -200, 62, 4]);
    if (!lite) {
      ctx.fillStyle = 'rgba(30,8,4,.45)'; ctx.beginPath(); ctx.ellipse(-2, -34, 2.2, 5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,190,140,.12)'; ctx.beginPath(); ctx.ellipse(-12, -50, 10, 30, .1, 0, 7); ctx.fill();
      // choli (teal + gold)
      const C1 = new Path2D();
      C1.moveTo(-58, -160 - br); C1.bezierCurveTo(-40, -176, -20, -172, -2, -164); C1.bezierCurveTo(16, -174, 38, -176, 56, -162 - br);
      C1.bezierCurveTo(56, -130, 52, -108, 46, -94); C1.bezierCurveTo(20, -86, -18, -86, -48, -94); C1.bezierCurveTo(-54, -110, -58, -136, -58, -160 - br); C1.closePath();
      rimP(C1, lg(-58, -170, 56, -90, [[0, '#0c6664'], [.5, '#042f35'], [1, '#08504d']]), .4, -.9, 3, RIM, .9, [-60, -180, 58, -86]);
      ctx.save(); ctx.clip(C1);
      ctx.fillStyle = 'rgba(255,214,120,.5)'; for (let y = -160; y < -96; y += 10) for (let x = -54; x < 54; x += 10) { ctx.beginPath(); ctx.arc(x + ((y / 10) % 2) * 5, y, 1.3, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(-24, -112, 22, 16, 0, 0, 7); ctx.ellipse(24, -112, 22, 16, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(20,0,10,.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-2, -160); ctx.quadraticCurveTo(-6, -128, -2, -100); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = lg(-50, 0, 50, 0, [[0, '#fff0b8'], [.5, '#c8841e'], [1, '#fff0b8']]); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-48, -94); ctx.bezierCurveTo(-18, -86, 20, -86, 46, -94); ctx.stroke();
      for (let k = 0; k < 3; k++) { ctx.strokeStyle = k === 1 ? '#c2185b' : '#ffcf6a'; ctx.lineWidth = 3 - k * .5; ctx.beginPath(); ctx.moveTo(-26, -188); ctx.quadraticCurveTo(-4, -158 + k * 10, 18, -186); ctx.stroke(); }
      ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.moveTo(-8, -160); ctx.lineTo(0, -148); ctx.lineTo(8, -160); ctx.lineTo(0, -168); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#0aa59a'; ctx.beginPath(); ctx.arc(0, -158, 2.5, 0, 7); ctx.fill();
    }
    ctx.restore();
    // kamarbandh (waist chain)
    ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-46, 8); ctx.quadraticCurveTo(0, 22, 46, 8); ctx.stroke();
    if (!lite) { ctx.fillStyle = '#ffcf6a'; for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.arc(k * 10, 14 + (1 - Math.abs(k) / 4) * 4, 2.6, 0, 7); ctx.fill(); } }
    // extended arm (screen right) holding the dupatta
    arm([[50, -170], [96, -178], [140, -164], [184, -146], [224, -124]], 14, 8);
    if (!lite) bangles([196, -140], [226, -124], 6, lt, 0);
    hand(226, -124, -.3 + Math.sin(lt * 1.7) * .05, 1.05, true);
    // neck
    { const { path } = tube(crPts([[-2, -186], [-10, -214], [-18, -232]], 4), u => 15 - u * 2); rimP(path, lg(-20, -230, 10, -190, [[0, SKIN[2]], [1, SKIN[1]]]), .8, -.6, 3, RIM, .9, [-36, -246, 16, -172]); rimP(path, null, -1, 0, 2, RIM, .6, [-36, -246, 16, -172]); }
    ctx.save(); ctx.translate(HEAD_POS[0], HEAD_POS[1]); ctx.rotate(HEAD_ROT); head(lt, lite); ctx.restore();
    // raised arm (screen left) arcing over the head
    arm([[-54, -170], [-96, -226], [-118, -282], [-102, -346], [-62, -392]], 15, 8);
    if (!lite) bangles([-92, -360], [-70, -386], 6, lt, 1.7);
    hand(-62, -392, -.75 + Math.sin(lt * 1.5) * .06, 1.05, false);
    for (const [x, y, a] of [[-58, -168, 1.0], [56, -166, -.2]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#073f40'; ctx.beginPath(); ctx.ellipse(0, 0, 17, 10, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#ffcf6a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 17, 10, 0, -.4, 3.5); ctx.stroke(); ctx.restore(); }
    if (!lite) dupatta(lt, true);
  }
  const headWorld = (pt) => { const c = Math.cos(HEAD_ROT), s = Math.sin(HEAD_ROT); return [DX + HEAD_POS[0] + pt[0] * c - pt[1] * s, DY + HEAD_POS[1] + pt[0] * s + pt[1] * c]; };

  // reflection buffer (low-res = natural blur)
  const RS = .35, REFL = mk(Math.round(1000 * RS), Math.round(700 * RS));
  const reflCtx = REFL.getContext('2d');
  const REFL_FADE = (() => { const g = reflCtx.createLinearGradient(0, 0, 0, REFL.height); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.12, 'rgba(0,0,0,.8)'); g.addColorStop(.45, 'rgba(0,0,0,.15)'); g.addColorStop(.7, 'rgba(0,0,0,0)'); return g; })();

  // ---------------------------------------------------------------- per-frame pieces
  function drawPetal(p, x, y, sz, rot, flip, blurIdx, a) {
    const spr = PETALS[p.c][blurIdx];
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sz * (0.25 + .75 * Math.abs(Math.cos(flip))), sz);
    ctx.drawImage(spr, -64, -64); ctx.restore();
  }
  function swirlPetals(c, lt, front) {
    for (let i = 0; i < SWIRL.length; i++) {
      const p = SWIRL[i]; const a = p.a + lt * p.w; const sn = Math.sin(a);
      if ((sn > 0) !== front) continue;
      const wx = DX + Math.cos(a) * p.r, wy = p.y - lt * p.rise + sn * p.r * .16;
      const d = 1 + sn * .35 * (p.r / 600);
      const [x, y] = toScreen(c, d, wx, wy);
      const sz = p.s * Math.pow(c.Z, d) * d * 1.15;
      const bi = d > 1.22 ? 2 : d > 1.1 ? 1 : d < .82 ? 1 : 0;
      drawPetal(p, x, y, sz, p.rot + lt * p.spin, p.fl + lt * 3, bi, front ? 1 : .85);
    }
  }
  function nearPetals(c, lt) {
    for (const p of NEAR) {
      const x0 = p.x + lt * p.vx + Math.sin(lt * 1.3 + p.rot) * 30, y0 = p.y + lt * p.vy;
      const [x, y] = toScreen(c, 2.2, x0, y0);
      if (x < 600 && y > 1560) continue;   // keep the lower-third clean
      drawPetal(p, x, y, p.s * Math.pow(c.Z, 1.6), p.rot + lt * .8, p.rot + lt * 2.2, 3, 1);
    }
  }
  function lantern(c, lt, Lt) {
    const sw = Math.sin(lt * 1.3 + Lt.ph) * .05;
    L(c, Lt.d, () => {
      ctx.save(); ctx.translate(Lt.x, Lt.y - 600); ctx.rotate(sw);
      ctx.strokeStyle = '#2a1206'; ctx.lineWidth = 3 / Lt.s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 600); ctx.stroke();
      ctx.translate(0, 600); ctx.scale(Lt.s, Lt.s);
      const fl = .85 + .15 * noise1(lt * 6 + Lt.ph * 10);
      glow(G_WARM, 0, 120, 280, .55 * fl); glow(G_GOLD, 0, 120, 110, .7 * fl);
      ctx.drawImage(Lt.d > 1 ? LANT_SOFT : LANT, Lt.d > 1 ? -110 : -90, Lt.d > 1 ? -40 : -20);
      glow(G_WHITE, 0, 130, 60, .5 * fl);
      ctx.restore();
    });
  }
  function diyas(c, lt) {
    floorT(c, () => {
      DIYAS.forEach(([x, y], i) => {
        const s = .55 + (y - 1160) / 330 * .75, fl = .8 + .2 * noise1(lt * 8 + i * 3.1);
        ctx.fillStyle = '#4a1a0a'; ctx.beginPath(); ctx.ellipse(x, y, 13 * s, 5 * s, 0, 0, Math.PI); ctx.fill();
        ctx.fillStyle = '#a0521e'; ctx.beginPath(); ctx.ellipse(x, y - 1 * s, 13 * s, 3.5 * s, 0, 0, 7); ctx.fill();
        ctx.save(); ctx.translate(x + 4 * s, y - 3 * s); ctx.scale(s, s * fl); ctx.fillStyle = '#fff4c8'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-5, -6, 0, -18 + noise1(lt * 5 + i) * 2); ctx.quadraticCurveTo(5, -6, 0, 0); ctx.fill(); ctx.restore();
        glow(G_WARM, x + 4 * s, y - 10 * s, 60 * s, .7 * fl); glow(G_GOLD, x + 4 * s, y - 10 * s, 18 * s, .9);
        glow(G_WARM, x + 4 * s, y + 24 * s, 34 * s, .25 * fl);   // reflection on marble
      });
    });
  }
  function flare(c, lt, reveal) {
    const [sx, sy] = toScreen(c, .45, SUN[0], SUN[1]);
    glow(G_GOLD, sx, sy, 330, .3 + .4 * reveal);
    glow(G_WHITE, sx, sy, 120, .25 + .6 * reveal);
    if (reveal < .02) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // anamorphic streak
    ctx.globalAlpha = .55 * reveal; ctx.fillStyle = lg(sx - 800, 0, sx + 800, 0, [[0, 'rgba(60,200,220,0)'], [.4, 'rgba(120,220,255,.35)'], [.5, 'rgba(255,250,235,.95)'], [.6, 'rgba(120,220,255,.35)'], [1, 'rgba(60,200,220,0)']]);
    ctx.fillRect(sx - 800, sy - 3, 1600, 6); ctx.globalAlpha = .25 * reveal; ctx.fillRect(sx - 800, sy - 14, 1600, 28);
    ctx.restore();
    // ghosts along the axis through frame center
    const gx = 540 - sx, gy = 900 - sy;
    [[.55, 40, G_TEAL, .25], [.9, 18, G_GOLD, .35], [1.35, 70, G_MAG, .16], [1.7, 110, G_TEAL, .12], [2.1, 30, G_GOLD, .22]].forEach(([k, r, spr, a]) => glow(spr, sx + gx * k, sy + gy * k, r, a * reveal));
  }

  // ---------------------------------------------------------------- draw
  function draw(lt) {
    const c = cam(lt);
    const spin = lt * 1.15 + .4;
    // 1. background facade + sky
    L(c, .45, () => { ctx.drawImage(BG, 0, 0, LW, OY + 1175, -OX, -OY, LW, OY + 1175); });
    // warm flicker in the arcade recesses
    L(c, .45, () => { for (const [x, y] of [[20, 1100], [160, 1100], [920, 1100], [1060, 1100], [160, 735], [920, 735]]) glow(G_WARM, x, y, 90, .35 + .15 * noise1(lt * 4 + x)); });
    // 2. god rays behind dancer
    const rk = .5 + .5 * Math.sin(lt * 1.4);
    L(c, .6, () => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .62 + .18 * rk; ctx.drawImage(RAYS_B, 0, RY0 / 2, LW / 2, (LH - RY0) / 2, -OX, RY0 - OY, LW, LH - RY0); ctx.restore(); });
    // 3. floor
    floorT(c, () => {
      ctx.drawImage(FLOOR, -OX, FY0);
      // long shadow from the backlit dancer
      ctx.save(); ctx.globalAlpha = .7; ctx.drawImage(SHADOW, DX - 400, 1330, 800, 900); ctx.restore();
    });
    // dancer reflection on the polished floor
    reflCtx.setTransform(1, 0, 0, 1, 0, 0); reflCtx.clearRect(0, 0, REFL.width, REFL.height);
    on(reflCtx, () => { ctx.setTransform(RS, 0, 0, -RS, 500 * RS, 440 * RS); dancer(lt, spin, true); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = REFL_FADE; ctx.fillRect(0, 0, REFL.width, REFL.height); ctx.globalCompositeOperation = 'source-over'; });
    floorT(c, () => {
      ctx.save(); ctx.globalAlpha = .3; ctx.drawImage(REFL, DX - 500, DY + 440, 1000, 700); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .18; ctx.drawImage(REFL, DX - 500, DY + 440, 1000, 700); ctx.restore();
    });
    // 4. columns (mid depth)
    for (const [x, d, s, flip] of [[70, .7, .85, false], [1010, .7, .85, true]]) L(c, d, () => { ctx.save(); ctx.translate(x, 1340); ctx.scale(flip ? -s : s, s); ctx.drawImage(COL, -110, -1140); ctx.restore(); });
    diyas(c, lt);
    // mid lanterns
    lantern(c, lt, LANTS[2]); lantern(c, lt, LANTS[3]);
    // 5. dust motes in the light (behind dancer)
    L(c, .8, () => {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const m of MOTES) {
        const x = m.x + noise1(m.ph + lt * .4) * 40, y = m.y + noise1(m.ph + 50 + lt * .3) * 40 - lt * 10 * m.z;
        const ang = Math.atan2(y - SUN[1], x - SUN[0]), beam = Math.max(0, 1 - Math.abs(ang - Math.PI / 2) / 1.2);
        const tw = .5 + .5 * Math.sin(lt * 3 + m.ph);
        const a = beam * (.25 + .6 * tw) * (1 - Math.min(1, Math.hypot(x - SUN[0], y - SUN[1]) / 1300));
        if (a < .03) continue;
        const r = 1.2 + m.z * 2.4; ctx.fillStyle = `rgba(255,232,180,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.restore();
    });
    swirlPetals(c, lt, false);
    // 6. dancer
    L(c, 1, () => { ctx.save(); ctx.translate(DX, DY); dancer(lt, spin); ctx.restore(); });
    // halo/rim bloom around her silhouette from the sun
    const [hx, hy] = toScreen(c, 1, ...headWorld([-4, -6]));
    const [sx, sy] = toScreen(c, .45, SUN[0], SUN[1]);
    const dist = Math.hypot(sx - hx, sy - hy) / c.Z;
    const reveal = sm(40, 120, dist);
    flare(c, lt, reveal);
    swirlPetals(c, lt, true);
    // 7. jewellery glints (shimmer cue at 2.2)
    const g1 = Math.exp(-Math.pow((lt - 2.22) / .12, 2));
    const [nx, ny] = toScreen(c, 1, ...headWorld(NATH));
    if (g1 > .02) { glow(G_GOLD, nx, ny, 160 * g1 * c.Z, .8 * g1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; sparkle(nx, ny, 70 * g1 * c.Z, 'rgba(255,250,230,.95)', lt * .8); ctx.fillStyle = `rgba(255,250,235,${.8 * g1})`; ctx.fillRect(nx - 160 * g1 * c.Z, ny - 1.5, 320 * g1 * c.Z, 3); ctx.restore(); }
    const g2 = Math.pow(Math.max(0, Math.sin(lt * 2.3 + 1)), 16); const [tx, ty] = toScreen(c, 1, ...headWorld(TIKKA));
    if (g2 > .05) { glow(G_GOLD, tx, ty, 40 * c.Z, g2 * .8); sparkle(tx, ty, 16 * g2 * c.Z, '#fffbe8', lt); }
    // 8. foreground lanterns + proscenium + near petals (DOF)
    lantern(c, lt, LANTS[0]); lantern(c, lt, LANTS[1]);
    L(c, 1.35, () => { for (const [x, y, w, hh] of FG_RECTS) ctx.drawImage(FG, x, y, w, hh, x - OX, y - OY, w, hh); });
    nearPetals(c, lt);
    // 9. grade: warm highlights / teal shadows, bloom lift
    ctx.save();
    ctx.fillStyle = lg(0, 1400, 0, 1920, [[0, 'rgba(6,26,34,0)'], [1, 'rgba(6,26,34,.6)']]); ctx.fillRect(-100, 1400, W + 200, 620);
    ctx.restore();
    // opening exposure bloom (lens-flare reveal)
    const ob = 1 - E.out(P(lt, 0, .7)); if (ob > 0) { glow(G_GOLD, sx, sy, 900, ob * .9); }
    // 10. subtitle
    const sa = E.out(P(lt, 1.15, 1.85));
    if (sa > 0) { ctx.save(); ctx.globalAlpha = sa * .6; ctx.translate(540, 1572); ctx.scale(1, .13); ctx.fillStyle = rg(0, 0, 0, 560, [[0, 'rgba(12,2,10,.85)'], [.6, 'rgba(12,2,10,.5)'], [1, 'rgba(12,2,10,0)']]); ctx.fillRect(-560, -560, 1120, 1120); ctx.restore(); }
    if (sa > 0) subtitle('“Aku akan kembali… untukmu.”', 1572 - 10 * (1 - sa), sa, { color: '#fff3dc', size: 50, shadow: { c: 'rgba(40,0,20,.75)', x: 0, y: 4 } });
  }

  STYLES_REG.bollywood = {
    label: 'GAYA BOLLYWOOD',
    cues: [[0.0, 'swell', 3.0], [1.15, 'whoosh'], [2.18, 'shimmer']],
    draw(lt, t) { draw(lt); },
  };
})();
