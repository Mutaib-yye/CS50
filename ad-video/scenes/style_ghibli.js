// SHOWCASE STYLE: ghibli — "hand-painted pastoral summer" (original scene; the feel only, no real film/character).
// A girl in a white summer dress & straw hat on a grassy hill; a towering sunlit cumulus, a lone tree,
// a tiny far-away house. A gust rolls through the tall grass, lifts her hair, hat ribbon, sash and hem.
// Static art is painted ONCE at load: clouds/tree are sculpted height-fields (union of spheres, smoothed,
// self-shadowed toward the sun) shaded per pixel, then overpainted with thousands of smear-dabs.
// Per frame: layer compositing with a slow push-in + crane (6 parallax depths), wind grass, the girl, particles.
(() => {
  const DUR = 3.4;
  const R = mulberry(77031);
  const SUN = { x: 884, y: 300 };
  const LV = (() => { const v = [0.52, -0.6, 0.6]; const l = Math.hypot(...v); return v.map(a => a / l); })();
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mix3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const ramp = stops => {
    const S = stops.map(([k, c]) => [k, hex(c)]);
    return s => {
      if (s <= S[0][0]) return S[0][1];
      for (let i = 1; i < S.length; i++) if (s <= S[i][0]) { const a = S[i - 1], b = S[i]; return mix3(a[1], b[1], (s - a[0]) / (b[0] - a[0])); }
      return S[S.length - 1][1];
    };
  };
  const GP = (k, fn) => { if (!window.__GP) return fn(); const a = performance.now(); const r = fn(); window.__GP[k] = (window.__GP[k] || 0) + performance.now() - a; return r; };
  // world-space offscreen layer
  const L = (x, y, w, hh) => { const c = mk(w, hh); return { c, g: c.getContext('2d'), x, y, w, hh }; };
  const drawL = (l, o = {}) => comp(l.c, { x: l.x, y: l.y, ...o });

  // ---- painterly helpers (load time only) ---------------------------------------------------
  // smear-dab pass: sample colour at p, lay an oriented dab nearby (keeps silhouette with source-atop)
  function brushify(c, n, o) {
    const g = c.getContext('2d'), w = c.width, hh = c.height, D = g.getImageData(0, 0, w, hh).data, r = mulberry(o.seed || 9);
    g.save(); g.globalCompositeOperation = o.over ? 'source-over' : 'source-atop';
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * hh, p = ((y | 0) * w + (x | 0)) * 4;
      if (D[p + 3] < (o.minA ?? 160)) continue;
      const sz = lerp(o.s0, o.s1, r() * r()), j = (r() - .5) * (o.jit ?? 10), sm = o.smear ?? .8;
      g.fillStyle = `rgba(${clamp(D[p] + j, 0, 255) | 0},${clamp(D[p + 1] + j, 0, 255) | 0},${clamp(D[p + 2] + j * 1.1, 0, 255) | 0},${o.a ?? .5})`;
      const ang = (o.ang ?? 0) + (r() - .5) * (o.angJ ?? 3);
      g.beginPath(); g.ellipse(x + (r() - .5) * sz * sm * 2, y + (r() - .5) * sz * sm, sz, sz * (o.asp ?? .45), ang, 0, 7); g.fill();
    }
    g.restore();
  }
  function noiseGrid(w, hh, cell, f, off) {
    const gw = Math.ceil(w / cell) + 2, gh = Math.ceil(hh / cell) + 2, G = new Float32Array(gw * gh);
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) G[j * gw + i] = fbm2(i * cell * f + off, j * cell * f - off * .7, 4);
    return (x, y) => { const fx = x / cell, fy = y / cell, i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, k = j * gw + i; return lerp(lerp(G[k], G[k + 1], u), lerp(G[k + gw], G[k + gw + 1], u), v); };
  }
  function boxBlur(A, w, hh, r) {
    const T = new Float32Array(A.length), n = 2 * r + 1;
    for (let y = 0; y < hh; y++) { const o = y * w; let s = 0; for (let x = -r; x <= r; x++) s += A[o + clamp(x, 0, w - 1)]; for (let x = 0; x < w; x++) { T[o + x] = s / n; s += A[o + Math.min(w - 1, x + r + 1)] - A[o + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += T[clamp(y, 0, hh - 1) * w + x]; for (let y = 0; y < hh; y++) { A[y * w + x] = s / n; s += T[Math.min(hh - 1, y + r + 1) * w + x] - T[Math.max(0, y - r) * w + x]; } }
  }
  // Sculpted volume: union-of-spheres height-field, smoothed (forms merge like real cumulus/foliage),
  // per-pixel normal + height-field shadow marched toward the sun. shade(x,y,nx,ny,nz,shadow,cov,out) -> lit
  function sculpt(w, hh, lobes, o, shade) {
    const N = w * hh, Hf = new Float32Array(N), CV = new Float32Array(N);
    for (const b of lobes) {
      const r = b.r, r2 = r * r, x0 = Math.max(0, Math.floor(b.x - r)), x1 = Math.min(w - 1, Math.ceil(b.x + r)), y0 = Math.max(0, Math.floor(b.y - r)), y1 = Math.min(hh - 1, Math.ceil(b.y + r));
      for (let y = y0; y <= y1; y++) {
        const dy = y + .5 - b.y, row = y * w;
        for (let x = x0; x <= x1; x++) {
          const dx = x + .5 - b.x, d2 = dx * dx + dy * dy; if (d2 >= r2) continue;
          const i = row + x, Z = Math.sqrt(r2 - d2) + b.z, cv = (r - Math.sqrt(d2)) * .9;
          if (cv > CV[i]) CV[i] = cv > 1 ? 1 : cv;
          if (Z > Hf[i]) Hf[i] = Z;
        }
      }
    }
    boxBlur(Hf, w, hh, o.blur); boxBlur(Hf, w, hh, o.blur);
    const pl = Math.hypot(LV[0], LV[1]), sdx = LV[0] / pl, sdy = LV[1] / pl, rise = LV[2] / pl, st = o.step || 10, steps = o.steps || 12;
    const c = mk(w, hh), g = c.getContext('2d'), id = g.createImageData(w, hh), D = id.data, out = [0, 0, 0, 0];
    let bc = null, bid = null, BD = null; if (o.bright) { bc = mk(w, hh); bid = bc.getContext('2d').createImageData(w, hh); BD = bid.data; }
    for (let y = 1; y < hh - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x; if (CV[i] <= 0) continue;
      let nx = -(Hf[i + 1] - Hf[i - 1]) * .5, ny = -(Hf[i + w] - Hf[i - w]) * .5; const nl = Math.hypot(nx, ny, 1); nx /= nl; ny /= nl; const nz = 1 / nl;
      const h0 = Hf[i]; let m = 0;
      for (let k = 1; k <= steps; k++) { const sx = (x + sdx * k * st) | 0, sy = (y + sdy * k * st) | 0; if (sx < 0 || sy < 0 || sx >= w || sy >= hh) break; const d = Hf[sy * w + sx] - h0 - k * st * rise; if (d > m) m = d; }
      const lit = shade(x, y, nx, ny, nz, clamp(m / (o.soft || 25)), CV[i], out); const p = i * 4;
      D[p] = out[0]; D[p + 1] = out[1]; D[p + 2] = out[2]; D[p + 3] = out[3];
      if (BD) { BD[p] = 255; BD[p + 1] = 238; BD[p + 2] = 205; BD[p + 3] = clamp((lit - o.bright) * 4) * out[3]; }
    }
    g.putImageData(id, 0, 0); if (bc) bc.getContext('2d').putImageData(bid, 0, 0);
    return { c, bright: bc };
  }
  function addKids(r, parents, n, k0, k1, a0, a1, maxY, out) {
    for (const p of parents) for (let k = 0; k < n; k++) {
      const a = lerp(a0, a1, r()), rho = p.r * (.7 + .27 * r()), x = p.x + Math.cos(a) * rho, y = p.y + Math.sin(a) * rho;
      if (y > maxY) continue;
      const cr = p.r * lerp(k0, k1, r());
      out.push({ x, y, r: cr, z: Math.max(0, p.z + Math.sqrt(Math.max(0, p.r * p.r - rho * rho)) - cr * .55) });
    }
  }
  const blurInto = (src, px, sc = 1) => { const c = mk(Math.ceil(src.width * sc), Math.ceil(src.height * sc)), g = c.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(src, 0, 0, c.width, c.height); return c; };

  // ---- SKY (+ baked sun glow) ----------------------------------------------------------------
  const SKYC = hex('#a6d0ec');
  const sky = L(-170, -170, 1420, 1560);
  GP('load_sky', () => {
    const g = sky.g; g.translate(-sky.x, -sky.y);
    const gr = g.createLinearGradient(0, -170, 0, 1390);
    [[0, '#14489a'], [.18, '#1f5fb5'], [.42, '#3f86d3'], [.62, '#78b4e6'], [.8, '#b4d9f0'], [.92, '#dcecf0'], [1, '#f1f0e2']].forEach(([k, c]) => gr.addColorStop(k, c));
    g.fillStyle = gr; g.fillRect(-170, -170, 1420, 1560);
    // big painted washes
    for (let i = 0; i < 70; i++) { const x = -170 + R() * 1420, y = -170 + R() * 1200, r = 90 + R() * 260; const c = R() < .5 ? 'rgba(255,255,255,' : 'rgba(20,70,170,'; const w = g.createRadialGradient(x, y, 0, x, y, r); w.addColorStop(0, c + (.03 + R() * .035) + ')'); w.addColorStop(1, c + '0)'); g.fillStyle = w; g.beginPath(); g.ellipse(x, y, r * 1.7, r, -.1, 0, 7); g.fill(); }
    // a few faint high wisps
    for (let i = 0; i < 26; i++) { const x = -100 + R() * 1200, y = 90 + R() * 300, l = 80 + R() * 200; for (let k = 0; k < 8; k++) { g.fillStyle = `rgba(255,255,255,${.02 + R() * .035})`; g.beginPath(); g.ellipse(x + k * l * .18, y + k * 3 + R() * 4, l * (.3 + R() * .4), 2 + R() * 4, -.12, 0, 7); g.fill(); } }
    const rg = g.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 1000); rg.addColorStop(0, 'rgba(255,246,222,.75)'); rg.addColorStop(.12, 'rgba(255,240,210,.4)'); rg.addColorStop(.45, 'rgba(255,236,200,.1)'); rg.addColorStop(1, 'rgba(255,236,200,0)');
    g.fillStyle = rg; g.fillRect(-170, -170, 1420, 1560);
    g.setTransform(1, 0, 0, 1, 0, 0);
    brushify(sky.c, 12000, { s0: 8, s1: 34, a: .3, jit: 5, ang: -.1, angJ: .9, asp: .4, seed: 3 });
    g.translate(-sky.x, -sky.y);
    const sg = g.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 90); sg.addColorStop(0, 'rgba(255,255,250,1)'); sg.addColorStop(.45, 'rgba(255,253,240,1)'); sg.addColorStop(1, 'rgba(255,250,230,0)'); g.fillStyle = sg; g.fillRect(SUN.x - 100, SUN.y - 100, 200, 200);
  });

  // ---- CLOUDS --------------------------------------------------------------------------------
  const cloudRamp = ramp([[0, '#6276a9'], [.2, '#7b8fbf'], [.38, '#9fb0d4'], [.52, '#c8d3e6'], [.64, '#eceef2'], [.78, '#fffaf0'], [1, '#ffffff']]);
  function paintCloud(l, lobes, baseY, topY, o = {}) {
    const ng = noiseGrid(l.w, l.hh, 6, .014, o.seed || 1.7), ng2 = noiseGrid(l.w, l.hh, 10, .004, (o.seed || 1.7) + 30);
    const haze = o.haze || 0, warm = hex('#fff0d8');
    const res = sculpt(l.w, l.hh, lobes, { blur: o.blur || 5, soft: 22, step: 9, steps: 16, bright: o.bright ?? .8 }, (x, y, nx, ny, nz, sh, cv, out) => {
      const hf = clamp((baseY - y) / (baseY - topY));
      const lam = nx * LV[0] + ny * LV[1] + nz * LV[2];
      let s = clamp((lam + .12) / 1.12);
      s *= 1 - .62 * sh;
      s *= lerp(.52, 1, sstep(0, .45, hf + ng2(x, y) * .2));
      s += ng(x, y) * .08 + .04;
      s = clamp(s + (Math.round(s * 6) / 6 - s) * .5);   // painterly tone grouping
      let c = cloudRamp(s);
      if (s > .7) c = mix3(c, warm, (s - .7) * 1.2 * hf);
      if (haze) c = mix3(c, SKYC, haze * (1 - s * .4));
      const bf = sstep(baseY + 10, baseY - 42 + ng2(x * 1.7, y) * 26, y);
      out[0] = c[0]; out[1] = c[1]; out[2] = c[2]; out[3] = 255 * cv * bf;
      return s;
    });
    l.g.drawImage(res.c, 0, 0);
    brushify(l.c, o.dabs || 30000, { s0: 2.5, s1: 12, a: .5, jit: 6, ang: -.4, angJ: 2, asp: .5, smear: 1, seed: o.seed * 7 | 0 });
    brushify(l.c, o.edge || 9000, { s0: 2, s1: 6, a: .32, jit: 3, minA: 90, smear: 2, over: true, seed: o.seed * 11 | 0 });
    if (res.bright) { const b = blurInto(res.bright, 9, .25); l.g.save(); l.g.globalCompositeOperation = 'screen'; l.g.globalAlpha = .5; l.g.drawImage(b, 0, 0, l.w, l.hh); l.g.restore(); }
  }
  // hero tower (left/centre), far mass (right), horizon bank
  const cloudA = L(-170, 90, 1440, 1000), cloudR = L(-170, 560, 1440, 560), cloudB = L(-170, 900, 1440, 330);
  GP('load_cloudA', () => {
    const r = R, cx = 400 + 170, baseY = 985 - 90, topY = 230 - 90, big = [];
    const prof = u => 1 - .5 * u + .14 * Math.sin(u * 7.5 + 1);   // bulging silhouette
    for (let i = 0; i < 40; i++) {
      const u = Math.pow(r(), .85), hw = 380 * prof(u), rad = lerp(160, 105, u) * (.75 + .45 * r());
      const y = baseY - rad * .45 - u * (baseY - topY - rad * 1.05), x = cx + 70 * u + (r() * 2 - 1) * Math.max(10, hw - rad * .6);
      big.push({ x, y, r: rad, z: 60 + r() * 60 - u * 20 });
    }
    big.push({ x: cx + 40, y: topY + 110, r: 112, z: 70 }, { x: cx + 150, y: topY + 160, r: 92, z: 60 }, { x: cx - 70, y: topY + 160, r: 96, z: 50 });
    big.push({ x: cx - 330, y: baseY - 190, r: 125, z: 40 }, { x: cx + 330, y: baseY - 250, r: 120, z: 40 }, { x: cx - 250, y: baseY - 400, r: 100, z: 40 }, { x: cx + 250, y: baseY - 430, r: 104, z: 50 });
    const kids = []; addKids(r, big, 4, .25, .42, -Math.PI * 1.1, Math.PI * .1, baseY - 40, kids);
    const gk = []; addKids(r, kids, 3, .3, .48, -Math.PI * 1.15, Math.PI * .15, baseY - 40, gk);
    paintCloud(cloudA, [...big, ...kids, ...gk], baseY, topY, { seed: 2.3, dabs: 40000, edge: 12000, blur: 5 });
  });
  GP('load_cloudR', () => {
    const r = R, baseY = 1070 - 560, topY = 720 - 560, big = [];
    for (let i = 0; i < 20; i++) { const u = Math.pow(r(), .9), rad = lerp(110, 70, u) * (.75 + .45 * r()); big.push({ x: 1200 + (r() * 2 - 1) * (300 - u * 150), y: baseY - rad * .45 - u * (baseY - topY - rad), r: rad, z: 40 + r() * 40 }); }
    const k = []; addKids(r, big, 4, .26, .44, -Math.PI * 1.1, Math.PI * .1, baseY - 30, k); const gk = []; addKids(r, k, 3, .3, .5, -Math.PI, 0, baseY - 30, gk);
    paintCloud(cloudR, [...big, ...k, ...gk], baseY, topY, { seed: 3.7, haze: .16, dabs: 14000, edge: 5000, blur: 4 });
  });
  GP('load_cloudB', () => {
    const r = R, baseY = 300, big = [];
    for (let i = 0; i < 40; i++) { const x = r() * 1440, rad = 26 + r() * 50 * (.5 + .7 * Math.abs(noise1(x * .006))); big.push({ x, y: baseY - rad * .35 - r() * 50, r: rad, z: 20 + r() * 20 }); }
    const k = []; addKids(r, big, 3, .3, .5, -Math.PI, 0, baseY - 10, k);
    paintCloud(cloudB, [...big, ...k], baseY, 150, { seed: 5.1, haze: .42, dabs: 8000, edge: 2500, bright: 2, blur: 3 });
  });

  // ---- LIGHT SHAFTS -------------------------------------------------------------------------
  const SH_SC = .5, shafts = L(-170, 100, 1440, 1500);
  GP('load_shafts', () => {
    const c = mk(720, 750), g = c.getContext('2d'), sx = (SUN.x + 170) * SH_SC, sy = (SUN.y - 100) * SH_SC;
    for (let i = 0; i < 10; i++) {
      const a = lerp(1.78, 2.7, i / 9 + (R() - .5) * .05), wdt = .012 + R() * .03, len = 900;
      const gr = g.createRadialGradient(sx, sy, 20, sx, sy, len); gr.addColorStop(0, `rgba(255,246,220,${.5 + R() * .3})`); gr.addColorStop(.45, 'rgba(255,240,210,.16)'); gr.addColorStop(1, 'rgba(255,240,210,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a - wdt) * len, sy + Math.sin(a - wdt) * len); g.lineTo(sx + Math.cos(a + wdt) * len, sy + Math.sin(a + wdt) * len); g.closePath(); g.fill();
    }
    shafts.c = blurInto(c, 6);
  });

  // ---- MOUNTAINS / FAR HILLS / HOUSE / MID HILL --------------------------------------------
  const mtnY = x => 1188 - 52 * Math.max(0, noise1(x * .0032 + 1.3)) - 20 * noise1(x * .009 + 4) - 7 * noise1(x * .03);
  const far1 = x => 1216 + noise1(x * .004 + 3) * 15 + noise1(x * .013) * 5;
  const far2 = x => 1242 + noise1(x * .0045 + 9) * 10 + noise1(x * .016 + 2) * 4 + (x < 400 ? -(400 - x) * .02 : 0);
  const midY = x => 1262 + 30 * (1 - Math.exp(-Math.pow((x - 850) / 330, 2))) + noise1(x * .012) * 4;
  const mtn = L(-170, 1080, 1440, 260), farH = L(-170, 1160, 1440, 320), midH = L(-170, 1220, 1440, 300);
  GP('load_land', () => {
    { // mountains
      const g = mtn.g; g.translate(-mtn.x, -mtn.y);
      g.beginPath(); g.moveTo(-170, 1340); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, mtnY(x)); g.lineTo(1270, 1340); g.closePath();
      const gr = g.createLinearGradient(0, 1120, 0, 1250); gr.addColorStop(0, '#86a6c8'); gr.addColorStop(1, '#bdd2df'); g.fillStyle = gr; g.fill();
      g.save(); g.clip();
      for (let x = -170; x <= 1270; x += 3) { const sl = mtnY(x + 3) - mtnY(x - 3); if (sl > .4) { g.fillStyle = `rgba(232,240,240,${clamp(sl * .12) * .5})`; g.fillRect(x, mtnY(x), 3, 40 + R() * 30); } }
      g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
      brushify(mtn.c, 5000, { s0: 2, s1: 9, a: .5, jit: 6, ang: 1.2, angJ: .8, seed: 21 });
    }
    { // far hills + the little house
      const g = farH.g; g.translate(-farH.x, -farH.y);
      const hill = (fy, c0, c1) => { g.beginPath(); g.moveTo(-170, 1480); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, fy(x)); g.lineTo(1270, 1480); g.closePath(); const gr = g.createLinearGradient(0, 1200, 0, 1330); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill(); };
      hill(far1, '#a3c2b6', '#95b6a6');
      for (let i = 0; i < 300; i++) { const x = -170 + R() * 1440, y = far1(x) + 2 + R() * 14; g.fillStyle = `rgba(${84 + R() * 20},${124 + R() * 20},${122 + R() * 16},.7)`; g.beginPath(); g.ellipse(x, y, 3 + R() * 5, 2 + R() * 4, 0, 0, 7); g.fill(); }
      hill(far2, '#a0c491', '#86ae7c');
      g.save(); g.beginPath(); g.moveTo(-170, 1480); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, far2(x)); g.lineTo(1270, 1480); g.clip();
      for (let i = 0; i < 30; i++) { const x = -170 + R() * 1440, y = far2(x) + 8 + R() * 50; g.fillStyle = R() < .5 ? 'rgba(220,228,150,.3)' : 'rgba(90,130,90,.22)'; g.beginPath(); g.ellipse(x, y, 40 + R() * 90, 4 + R() * 7, (R() - .5) * .1, 0, 7); g.fill(); }
      for (let k = 0; k < 7; k++) { let x = -170 + R() * 1440, y = far2(x) + 10 + R() * 40; const dy = (R() - .5) * .8; for (let j = 0; j < 44; j++) { g.fillStyle = 'rgba(72,112,84,.55)'; g.beginPath(); g.arc(x, y, 1.8 + R() * 2, 0, 7); g.fill(); x += 4 + R() * 2; y += dy; } }
      g.restore();
      const hx = 176, hy = far2(176) + 6;
      const tree = (x, y, s, c) => { for (let i = 0; i < 16; i++) { g.fillStyle = i < 10 ? c : 'rgba(176,206,146,.55)'; g.beginPath(); g.arc(x + (R() - .5) * 14 * s + (i < 10 ? 0 : 3 * s), y - 16 * s + (R() - .5) * 14 * s - (i < 10 ? 0 : 5 * s), (5 + R() * 4) * s, 0, 7); g.fill(); } g.fillStyle = '#5e4c44'; g.fillRect(x - 1, y - 6 * s, 2, 7 * s); };
      tree(hx - 48, hy + 2, 1.7, '#557e69'); tree(hx - 30, hy, 1.1, '#5f8a6f');
      g.fillStyle = 'rgba(60,90,70,.35)'; g.beginPath(); g.ellipse(hx + 2, hy + 3, 44, 4, 0, 0, 7); g.fill();
      g.fillStyle = '#e6decb'; g.fillRect(hx - 22, hy - 22, 40, 24); g.fillStyle = '#fbf5e6'; g.fillRect(hx + 18, hy - 22, 16, 24);
      g.fillStyle = '#c0bcb8'; g.fillRect(hx - 22, hy - 22, 40, 5);
      g.fillStyle = '#56667a'; g.fillRect(hx - 14, hy - 13, 6, 7); g.fillRect(hx + 2, hy - 13, 6, 7); g.fillStyle = '#7a5a48'; g.fillRect(hx + 23, hy - 12, 6, 14);
      g.fillStyle = '#b4503b'; g.beginPath(); g.moveTo(hx - 27, hy - 21); g.lineTo(hx - 14, hy - 40); g.lineTo(hx + 26, hy - 40); g.lineTo(hx + 22, hy - 21); g.closePath(); g.fill();
      g.fillStyle = '#dc7e58'; g.beginPath(); g.moveTo(hx + 22, hy - 21); g.lineTo(hx + 26, hy - 40); g.lineTo(hx + 38, hy - 21); g.closePath(); g.fill();
      g.fillStyle = '#eaa27a'; g.fillRect(hx - 14, hy - 41, 40, 3);
      g.fillStyle = '#8d4a3a'; g.fillRect(hx + 8, hy - 50, 5, 11);
      tree(hx + 56, hy + 3, 1.3, '#5a846c');
      // a dirt path winding away from the house
      g.strokeStyle = 'rgba(226,214,170,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(hx + 30, hy + 2); g.quadraticCurveTo(hx + 90, hy + 18, hx + 60, hy + 40); g.stroke();
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
      const hz = g.createLinearGradient(0, 0, 0, 200); hz.addColorStop(0, 'rgba(196,220,232,.42)'); hz.addColorStop(1, 'rgba(196,220,232,.1)'); g.fillStyle = hz; g.fillRect(0, 0, 1440, 320);
      g.globalCompositeOperation = 'source-over';
      brushify(farH.c, 6000, { s0: 2, s1: 7, a: .45, jit: 6, ang: 0, angJ: .6, seed: 31 });
    }
    { // mid hill (the tree's hill)
      const g = midH.g; g.translate(-midH.x, -midH.y);
      g.beginPath(); g.moveTo(-170, 1520); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, midY(x)); g.lineTo(1270, 1520); g.closePath();
      const gr = g.createLinearGradient(0, 1258, 0, 1420); gr.addColorStop(0, '#a9c56c'); gr.addColorStop(.25, '#86ab58'); gr.addColorStop(1, '#5f8a48'); g.fillStyle = gr; g.fill();
      g.save(); g.clip();
      for (let i = 0; i < 80; i++) { const x = -170 + R() * 1440, y = midY(x) + R() * 160; g.fillStyle = R() < .5 ? 'rgba(220,230,140,.18)' : 'rgba(50,90,60,.16)'; g.beginPath(); g.ellipse(x, y, 30 + R() * 80, 3 + R() * 8, 0, 0, 7); g.fill(); }
      const sg = g.createRadialGradient(0, 0, 0, 0, 0, 130); sg.addColorStop(0, 'rgba(36,64,52,.55)'); sg.addColorStop(1, 'rgba(36,64,52,0)'); g.fillStyle = sg; g.save(); g.translate(808, 1266); g.scale(1, .09); g.fillRect(-140, -140, 280, 280); g.restore();
      g.restore();
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(190,215,225,.14)'; g.fillRect(0, 0, 1440, 300); g.globalCompositeOperation = 'source-over';
      brushify(midH.c, 9000, { s0: 2, s1: 9, a: .5, jit: 8, ang: -1.45, angJ: .6, asp: .3, seed: 41 });
    }
  });

  // ---- THE LONE TREE (trunk + sculpted canopy; canopy sways) ---------------------------------
  const TB = { x: 846, y: 1264 };
  const trunk = L(TB.x - 180, TB.y - 300, 360, 310), canopy = L(TB.x - 180, TB.y - 300, 360, 270);
  GP('load_tree', () => {
    const g = trunk.g, bx = 180, by = 300;
    const limb = (x0, y0, x1, y1, w0, w1, cx, cy) => {
      g.fillStyle = '#4a3b39'; g.beginPath(); g.moveTo(x0 - w0, y0); g.quadraticCurveTo(cx - (w0 + w1) / 2, cy, x1 - w1, y1); g.lineTo(x1 + w1, y1); g.quadraticCurveTo(cx + (w0 + w1) / 2, cy, x0 + w0, y0); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(170,138,104,.65)'; g.lineWidth = Math.max(1.2, w1 * .5); g.beginPath(); g.moveTo(x0 + w0 * .7, y0); g.quadraticCurveTo(cx + (w0 + w1) / 2 * .7, cy, x1 + w1 * .7, y1); g.stroke();
    };
    limb(bx, by, bx - 3, by - 78, 9, 6, bx + 3, by - 40);
    limb(bx - 3, by - 76, bx - 56, by - 140, 5.5, 2, bx - 24, by - 100);
    limb(bx - 2, by - 76, bx + 50, by - 150, 5.5, 2, bx + 24, by - 108);
    limb(bx - 3, by - 78, bx + 4, by - 170, 5, 2, bx - 6, by - 125);
    g.fillStyle = 'rgba(56,40,30,.55)'; g.beginPath(); g.ellipse(bx + 1, by, 17, 3.5, 0, 0, 7); g.fill();
    // canopy: 5 clumps of lobes, gaps between them, sculpted + shadowed
    const r = R, lob = [], cx = 180, cy = 128;
    const clumps = [[-62, 6, 52], [-8, -48, 60], [58, -10, 54], [8, 28, 50], [96, 30, 34], [-104, 36, 30], [30, -96, 40]];
    for (const [ox, oy, cr] of clumps) for (let i = 0; i < 7; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * cr * .55; lob.push({ x: cx + ox + Math.cos(a) * d, y: cy + oy + Math.sin(a) * d * .8, r: cr * (.42 + r() * .3), z: 20 + r() * 20 - oy * .1 }); }
    const k = []; addKids(r, lob, 4, .3, .45, -Math.PI * 1.15, Math.PI * .15, 999, k); const gk = []; addKids(r, k, 3, .32, .5, -Math.PI * 1.2, Math.PI * .2, 999, gk);
    const lr = ramp([[0, '#1d3940'], [.25, '#2a5147'], [.45, '#447447'], [.62, '#6f9a4a'], [.8, '#a9c260'], [1, '#e2e392']]), ng = noiseGrid(360, 270, 5, .035, 7.7), haze = hex('#b6d0d8');
    const res = sculpt(360, 270, [...lob, ...k, ...gk], { blur: 2, soft: 14, step: 5, steps: 12 }, (x, y, nx, ny, nz, sh, cv, out) => {
      const lam = nx * LV[0] + ny * LV[1] + nz * LV[2], hf = clamp((230 - y) / 200);
      let s = clamp((lam + .05) / 1.05) * (1 - .6 * sh); s *= lerp(.55, 1, hf); s = clamp(s + ng(x, y) * .1 + .03); s = clamp(s + (Math.round(s * 5) / 5 - s) * .5);
      const c = mix3(lr(s), haze, .16); out[0] = c[0]; out[1] = c[1]; out[2] = c[2]; out[3] = 255 * cv; return s;
    });
    canopy.g.drawImage(res.c, 0, 0);
    brushify(canopy.c, 9000, { s0: 1.5, s1: 4.5, a: .75, jit: 12, angJ: 6.3, asp: .5, smear: 1.2, seed: 61 });
    brushify(canopy.c, 4500, { s0: 1.5, s1: 3.5, a: .85, jit: 10, minA: 120, angJ: 6.3, asp: .5, smear: 2.6, over: true, seed: 62 });
  });

  // ---- NEAR HILL (girl's meadow) -------------------------------------------------------------
  const nearY = x => 1392 - 44 * Math.exp(-Math.pow((x - 320) / 420, 2)) + .045 * (x - 320) + noise1(x * .01) * 5;
  const nearPath = (() => { const p = new Path2D(); p.moveTo(-220, 2300); for (let x = -220; x <= 1320; x += 8) p.lineTo(x, nearY(x)); p.lineTo(1320, 2300); p.closePath(); return p; })();
  const nearH = L(-200, 1320, 1500, 900);
  GP('load_near', () => {
    const g = nearH.g; g.translate(-nearH.x, -nearH.y);
    const gr = g.createLinearGradient(0, 1345, 0, 2150);
    [[0, '#b0c968'], [.07, '#8db052'], [.22, '#6a9844'], [.45, '#4c7a39'], [1, '#22422a']].forEach(([k, c]) => gr.addColorStop(k, c));
    g.fillStyle = gr; g.fill(nearPath);
    g.save(); g.clip(nearPath);
    for (let i = 0; i < 520; i++) { const x = -200 + R() * 1500, y = 1340 + Math.pow(R(), 1.3) * 840, s = .4 + (y - 1300) / 500; g.fillStyle = R() < .5 ? `rgba(206,222,120,${.07 + R() * .09})` : `rgba(30,70,45,${.08 + R() * .12})`; g.beginPath(); g.ellipse(x, y, (30 + R() * 90) * s, (5 + R() * 12) * s, (R() - .5) * .2, 0, 7); g.fill(); }
    const cg = g.createLinearGradient(0, 1340, 0, 1440); cg.addColorStop(0, 'rgba(255,236,170,.35)'); cg.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = cg; g.fillRect(-200, 1300, 1500, 160);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    brushify(nearH.c, 26000, { s0: 2, s1: 14, a: .5, jit: 12, ang: -1.45, angJ: .5, asp: .22, smear: 1.2, seed: 71 });
  });
  // drifting cloud shadow over the foreground (receding during the clip: "light arrives")
  const shadowY = (x, lt) => 1626 + 38 * Math.sin(x * .0052 + .4) + 14 * Math.sin(x * .017) + lt * 26;
  const SHADOWC = (() => { const c = mk(1500, 900), g = c.getContext('2d'); g.fillStyle = 'rgba(46,78,120,1)'; g.filter = 'blur(18px)'; g.beginPath(); g.moveTo(-50, 950); for (let x = -50; x <= 1550; x += 10) g.lineTo(x, shadowY(x - 200, 0) - 1600 + 40); g.lineTo(1550, 950); g.fill(); return c; })();

  // ---- GRASS ------------------------------------------------------------------------------------
  const FEET = { x: 410, y: 1540 };
  const BL = [];
  for (let i = 0; i < 3100; i++) {
    const x = -200 + R() * 1500, rg = nearY(x), v = Math.pow(R(), 1.5), y = rg + 3 + v * (1800 - rg);
    const Ln = .42 * (y - 1196) * (.5 + .65 * R());
    BL.push({ x, y, L: Ln, w: 1.1 + Ln * .03, tone: R(), ph: R() * 6.28, lean: (R() - .5) * .34, stiff: .6 + R() * .8, curl: (R() - .3) * .5 });
  }
  for (let i = 0; i < 150; i++) {   // tall clump around her legs (drawn in front of her)
    const x = FEET.x - 95 + R() * 210, y = FEET.y + 2 + R() * 46, Ln = 110 + R() * 95;
    BL.push({ x, y, L: Ln, w: 2 + Ln * .028, tone: R(), ph: R() * 6.28, lean: (R() - .5) * .3, stiff: .6 + R() * .6, curl: (R() - .3) * .5 });
  }
  BL.sort((a, b) => a.y - b.y);
  const BANDS = [1430, FEET.y, 9999];
  const bandIdx = BANDS.map(by => { let i = 0; while (i < BL.length && BL[i].y < by) i++; return i; });
  const bandRange = k => [k ? bandIdx[k - 1] : 0, bandIdx[k]];
  const TONES = ['#2c5236', '#3d6b3a', '#53843f', '#6f9e46', '#93b955', '#bcd36c', '#e2e795'].map(hex);
  const HAZE_G = hex('#b7cfb0'), SHAD = hex('#25443f');
  const NT = TONES.length, ND = 6;
  const PAL = [];   // [depth][shadow][tone]
  for (let d = 0; d < ND; d++) { const hz = .34 * Math.pow(1 - d / (ND - 1), 1.6); PAL.push([0, 1].map(s => TONES.map((c, ti) => rgba(s ? mix3(mix3(c, SHAD, .5), hex('#3a5f78'), .12) : mix3(c, HAZE_G, hz))))); }
  const depthOf = y => Math.min(ND - 1, Math.max(0, ((y - 1350) / 330 * (ND - 1)) | 0));
  function drawBlades(k, lt, G) {
    const [i0, i1] = bandRange(k), paths = [], hl = [];
    for (let d = 0; d < ND; d++) { paths.push([[], []]); hl.push(new Path2D()); for (let s = 0; s < 2; s++) for (let ti = 0; ti < NT; ti++) paths[d][s].push(null); }
    for (let i = i0; i < i1; i++) {
      const b = BL[i], sw = .5 + .5 * Math.sin(b.x * .011 + b.y * .003 - lt * 3.6), n = noise2(b.x * .004 - lt * .8, b.y * .012);
      const bend = .12 + b.lean + G * b.stiff * (.42 * sw + .18 * n) + .05 * Math.sin(lt * 8 + b.ph) * G;
      const shd = b.y > shadowY(b.x, lt) ? 1 : 0;
      const sheen = clamp(sw * G * 1.3 - .3), tone = clamp(b.tone * .6 + sheen * .52 - shd * .1), ti = Math.min(NT - 1, (tone * NT) | 0), d = depthOf(b.y);
      const sb = Math.sin(bend), cb = Math.cos(bend), tx = b.x + b.L * sb, ty = b.y - b.L * cb, mx = b.x + b.L * (.2 * sb + b.curl * .12), my = b.y - b.L * .55;
      let p = paths[d][shd][ti]; if (!p) p = paths[d][shd][ti] = new Path2D();
      p.moveTo(b.x - b.w, b.y); p.quadraticCurveTo(mx - b.w * .4, my, tx, ty); p.quadraticCurveTo(mx + b.w * .4, my, b.x + b.w, b.y); p.closePath();
      if (!shd && ti >= 3) { const q = hl[d]; q.moveTo(lerp(b.x, mx, .7) + b.w * .3, lerp(b.y, my, .7)); q.quadraticCurveTo(mx + b.w * .3, my, tx, ty); }
    }
    for (let d = 0; d < ND; d++) {
      for (let s = 0; s < 2; s++) for (let ti = 0; ti < NT; ti++) { const p = paths[d][s][ti]; if (p) { ctx.fillStyle = PAL[d][s][ti]; ctx.fill(p); } }
      ctx.strokeStyle = `rgba(250,244,178,${.35 + d * .06})`; ctx.lineWidth = .8 + d * .35; ctx.stroke(hl[d]);
    }
  }
  const SHEEN = (() => { const per = 571, c = mk(per, 4), g = c.getContext('2d'); for (let x = 0; x < per; x++) { const v = Math.pow(.5 + .5 * Math.sin(x / per * 6.283), 3); g.fillStyle = `rgba(250,248,190,${v})`; g.fillRect(x, 0, 1, 4); } return c; })();
  const SHEENPAT = MAIN.createPattern(SHEEN, 'repeat');

  // foreground (out-of-focus) grass, drawn at half res then blurred
  const FG = [];
  for (let i = 0; i < 80; i++) {
    const side = i < 30 ? 0 : i < 46 ? 1 : 2;
    const x = side === 0 ? -170 + R() * 560 : side === 1 ? 380 + R() * 330 : 720 + R() * 560;
    const y = 1940 + R() * 160, Ln = side === 0 ? 110 + R() * 100 : side === 1 ? 150 + R() * 130 : 300 + R() * 380;
    FG.push({ x, y, L: Ln, w: 6 + R() * 9, ph: R() * 6.28, lean: (R() - .3) * .5, c: R(), seed: side === 2 && R() < .4 });
  }
  const FGC = ['#132717', '#1a3120', '#223c24', '#2d4a29'];
  const FGS = .5, fgL = mk(1500 * FGS | 0, 820 * FGS | 0), fgG = fgL.getContext('2d');

  // ---- PARTICLES -----------------------------------------------------------------------------
  const sprite = (fn, s = 48) => { const c = mk(s, s), g = c.getContext('2d'); g.translate(s / 2, s / 2); fn(g); return c; };
  const PETAL = sprite(g => { const gr = g.createLinearGradient(-12, 0, 12, 0); gr.addColorStop(0, '#ffd3de'); gr.addColorStop(1, '#fffaf6'); g.fillStyle = gr; g.beginPath(); g.moveTo(-13, 0); g.bezierCurveTo(-6, -9, 8, -8, 13, -1); g.lineTo(9, 0); g.lineTo(13, 2); g.bezierCurveTo(6, 8, -6, 8, -13, 0); g.fill(); });
  const SEED = sprite(g => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.2; for (let k = 0; k < 14; k++) { const a = -Math.PI + k / 13 * Math.PI; g.beginPath(); g.moveTo(0, 6); g.lineTo(Math.cos(a) * 15, Math.sin(a) * 13); g.stroke(); } g.fillStyle = '#e8e0c8'; g.beginPath(); g.ellipse(0, 9, 1.6, 4, 0, 0, 7); g.fill(); });
  const pad = (c, p) => { const o = mk(c.width + p * 2, c.height + p * 2); o.getContext('2d').drawImage(c, p, p); return o; };
  const PB = [PETAL, blurInto(pad(PETAL, 10), 2), blurInto(pad(PETAL, 16), 5)], SB = [SEED, blurInto(pad(SEED, 10), 2), blurInto(pad(SEED, 16), 5)];
  const PARTS = []; for (let i = 0; i < 44; i++) { const d = Math.pow(R(), 1.3); PARTS.push({ d, x0: R() * 1400, y0: 260 + R() * 1360, ph: R() * 6.28, spin: (R() - .5) * 6, seed: R() < .45, sz: .5 + d * 1.5 + R() * .3 }); }

  // ---- GRADE / TEXTURE (static, pre-rendered) ------------------------------------------------
  const GRADE = (() => { const c = mk(W, H), g = c.getContext('2d'); const wg = g.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 1500); wg.addColorStop(0, 'rgba(255,196,120,.5)'); wg.addColorStop(1, 'rgba(255,196,120,0)'); g.fillStyle = wg; g.fillRect(0, 0, W, H); return c; })();
  const TEX = (() => {  // canvas weave + paper fibres, neutral grey for 'overlay'
    const c = mk(W, H), g = c.getContext('2d'), r = mulberry(5); g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 9000; i++) { const v = 128 + (r() - .5) * 40 | 0; g.fillStyle = `rgba(${v},${v},${v},.5)`; g.beginPath(); g.ellipse(r() * W, r() * H, 4 + r() * 16, 1.5 + r() * 3, -.3 + (r() - .5) * .5, 0, 7); g.fill(); }
    for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, rr_ = 80 + r() * 220, v = r() < .5 ? 110 : 146, gr = g.createRadialGradient(x, y, 0, x, y, rr_); gr.addColorStop(0, `rgba(${v},${v},${v},.35)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`); g.fillStyle = gr; g.fillRect(x - rr_, y - rr_, rr_ * 2, rr_ * 2); }
    return c;
  })();

  // ---- GIRL -------------------------------------------------------------------------------------
  const GW = 660, GH = 900, GO = { x: 250, y: 860 }, GS = 1.75;
  const SKIN = hex('#efbf9f'), SKIN_S = hex('#c88e7d');
  function taper(pts, w0, w1, fill) {   // filled tapered ribbon along a centreline
    const n = pts.length, Lf = [], Rt = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, Math.pow(i / (n - 1), .8));
      Lf.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]); Rt.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]);
    }
    ctx.beginPath(); ctx.moveTo(Lf[0][0], Lf[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(Lf[i][0], Lf[i][1]); for (let i = n - 1; i >= 0; i--) ctx.lineTo(Rt[i][0], Rt[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function limb(x0, y0, x1, y1, w0, w1, c) { // tapered limb with rounded ends
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x0 + nx * w0, y0 + ny * w0); ctx.lineTo(x1 + nx * w1, y1 + ny * w1); ctx.arc(x1, y1, w1, Math.atan2(ny, nx), Math.atan2(-ny, -nx)); ctx.lineTo(x0 - nx * w0, y0 - ny * w0); ctx.arc(x0, y0, w0, Math.atan2(-ny, -nx), Math.atan2(ny, nx)); ctx.fill();
  }
  function ribbonTail(base, len, dir, t, w, ph, wid, c0, c1, drop) {
    let prev = null;
    for (let i = 0; i <= 16; i++) {
      const s = i / 16, x = base[0] + s * len * Math.cos(dir), y = base[1] + s * len * Math.sin(dir) + s * drop + Math.sin(s * 6.5 - t * 13 + ph) * s * (5 + 8 * w) + noise1(t * 2 + ph * 5 + s * 2) * 4 * s;
      const tw = .3 + .7 * Math.abs(Math.cos(s * 4.5 - t * 9 + ph)), hw = wid * tw * (1 - .3 * s);
      if (prev) { ctx.fillStyle = rgba(mix3(c0, c1, tw)); ctx.beginPath(); ctx.moveTo(prev[0], prev[1] - prev[2]); ctx.lineTo(x, y - hw); ctx.lineTo(x, y + hw); ctx.lineTo(prev[0], prev[1] + prev[2]); ctx.closePath(); ctx.fill(); }
      prev = [x, y, hw];
    }
    // forked tip
    ctx.fillStyle = rgba(c0); ctx.beginPath(); ctx.moveTo(prev[0], prev[1] - prev[2]); ctx.lineTo(prev[0] + 7, prev[1] - prev[2] - 2); ctx.lineTo(prev[0] + 3, prev[1]); ctx.lineTo(prev[0] + 7, prev[1] + prev[2] + 2); ctx.lineTo(prev[0], prev[1] + prev[2]); ctx.fill();
  }
  const RIB0 = hex('#7c2420'), RIB1 = hex('#f07a5e'), SASH0 = hex('#5f80b3'), SASH1 = hex('#b8d0ee');
  function girl(lt, G) {
    const t = lt, w = G;
    ctx.save(); ctx.translate(GO.x, GO.y); ctx.scale(GS, GS); ctx.rotate(.025 + .012 * w); ctx.scale(1, 1 + .004 * Math.sin(t * 2.4));
    const skin = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba(SKIN_S)); g.addColorStop(1, rgba(SKIN)); return g; };
    // legs
    limb(-8, -96, -7, -3, 4.2, 3, skin(-12, -3)); limb(9, -96, 11, -3, 4.2, 3, skin(4, 14));
    // far (right) arm, relaxed, swaying in the wind
    const sw = Math.sin(t * 2.1) * 2 + w * 3;
    limb(21, -210, 29 + sw * .3, -178, 4.2, 3.4, skin(18, 34)); limb(29 + sw * .3, -178, 35 + sw, -149, 3.4, 2.8, skin(24, 40));
    ctx.fillStyle = rgba(SKIN); ctx.beginPath(); ctx.ellipse(36 + sw, -144, 4, 5.5, .2, 0, 7); ctx.fill();
    // skirt: lining peeking under the lifted lee side, then the skirt
    const hemL = [-24 + 3 * w, -91], hemR = [50 + 24 * w + Math.sin(t * 5.3) * 3 * w, -102 - 14 * w + Math.sin(t * 7.1) * 3 * w];
    const hemPt = u => [lerp(hemL[0], hemR[0], u), lerp(hemL[1], hemR[1], u) + Math.sin(u * 9 - t * 10) * 3.2 * w * (.3 + u) + Math.sin(u * 4 + t * 4) * 1.5];
    ctx.fillStyle = '#9aa8c6'; ctx.beginPath(); ctx.moveTo(0, -150); for (let i = 3; i <= 12; i++) { const [x, y] = hemPt(i / 12); ctx.lineTo(x + 2, y + 5 + i * .3); } ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-15, -160); ctx.bezierCurveTo(-20, -135, -26 + 2 * w, -112, hemL[0], hemL[1]);
    for (let i = 1; i <= 12; i++) { const [x, y] = hemPt(i / 12); ctx.lineTo(x, y); }
    ctx.bezierCurveTo(hemR[0] - 8, hemR[1] - 18, 30 + 12 * w, -132, 16, -160); ctx.closePath();
    const dg = ctx.createLinearGradient(-30, 0, 62, 0); dg.addColorStop(0, '#aebbd7'); dg.addColorStop(.42, '#dbe1ee'); dg.addColorStop(1, '#fffaf0'); ctx.fillStyle = dg; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.lineCap = 'round';
    for (let k = 0; k < 5; k++) { const u = (k + .6) / 5.4, [fx, fy] = hemPt(u); ctx.strokeStyle = k % 2 ? 'rgba(118,134,178,.32)' : 'rgba(255,255,255,.45)'; ctx.lineWidth = k % 2 ? 3 : 2; ctx.beginPath(); ctx.moveTo(lerp(-12, 12, u), -156); ctx.quadraticCurveTo(lerp(-14, 22, u) + w * 7, -125, fx + Math.sin(t * 6 + k) * 3, fy); ctx.stroke(); }
    const tg = ctx.createLinearGradient(0, -112, 0, -88); tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, 'rgba(255,248,236,.4)'); ctx.fillStyle = tg; ctx.fillRect(-40, -115, 140, 40);
    ctx.restore();
    // bodice + puff sleeves
    ctx.beginPath(); ctx.moveTo(-15, -160); ctx.bezierCurveTo(-19, -180, -22, -200, -24, -213); ctx.quadraticCurveTo(0, -222, 24, -213); ctx.bezierCurveTo(22, -200, 19, -180, 16, -160); ctx.closePath();
    const bg = ctx.createLinearGradient(-25, 0, 25, 0); bg.addColorStop(0, '#b3bfd9'); bg.addColorStop(1, '#f8f4ec'); ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = '#c3cce0'; ctx.beginPath(); ctx.ellipse(-23, -208, 8.5, 7.5, -.4, 0, 7); ctx.fill();
    ctx.fillStyle = '#f3f0e9'; ctx.beginPath(); ctx.ellipse(23, -208, 8.5, 7.5, .4, 0, 7); ctx.fill();
    // waist sash + bow with fluttering tails
    ctx.fillStyle = '#8eaedb'; ctx.beginPath(); ctx.moveTo(-16, -168); ctx.quadraticCurveTo(0, -165, 17, -168); ctx.lineTo(16, -159); ctx.quadraticCurveTo(0, -156, -15, -159); ctx.fill();
    ribbonTail([3, -162], 46 + 22 * w, .55 - .35 * w, t + .3, w, .7, 3.4, SASH0, SASH1, 6);
    ribbonTail([1, -161], 38 + 18 * w, .8 - .35 * w, t + .1, w, 2.1, 3, SASH0, SASH1, 8);
    ctx.fillStyle = '#7c9bcc'; ctx.beginPath(); ctx.ellipse(-6, -166, 7, 4, -.5, 0, 7); ctx.ellipse(10, -166, 7, 4, .5, 0, 7); ctx.fill();
    ctx.fillStyle = '#a9c3e6'; ctx.beginPath(); ctx.ellipse(10, -167, 4.5, 2.2, .5, 0, 7); ctx.fill();
    ctx.fillStyle = '#6884b6'; ctx.beginPath(); ctx.arc(2, -165, 3, 0, 7); ctx.fill();
    // neck, ear + cheek glimpse (she looks off to the right, toward the tree & sun)
    limb(1, -216, 3, -236, 5, 4.6, skin(-4, 8));
    ctx.fillStyle = '#2f1f1b'; ctx.beginPath(); ctx.ellipse(2, -255, 20, 22, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rgba(mix3(SKIN, hex('#ffd9b8'), .3)); ctx.beginPath(); ctx.moveTo(15, -262); ctx.quadraticCurveTo(25, -256, 23, -244); ctx.quadraticCurveTo(19, -236, 12, -238); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(240,140,120,.45)'; ctx.beginPath(); ctx.ellipse(19, -246, 3.5, 2.5, 0, 0, 7); ctx.fill();
    // hair: back mass blown to the right, then flying locks in layers
    const tipX = 52 + 50 * w + Math.sin(t * 4.7) * 6, tipY = -192 - 12 * w + Math.sin(t * 6.1) * 6;
    ctx.beginPath(); ctx.moveTo(-20, -262); ctx.bezierCurveTo(-23, -236, -19, -206, -11, -186);
    ctx.quadraticCurveTo(14 + 10 * w, -184, tipX, tipY); ctx.quadraticCurveTo(26 + 12 * w, -218, 17, -262); ctx.quadraticCurveTo(2, -282, -20, -262); ctx.closePath();
    const hg = ctx.createLinearGradient(-20, -270, 50, -190); hg.addColorStop(0, '#26181a'); hg.addColorStop(.6, '#3d2722'); hg.addColorStop(1, '#5a3a2c'); ctx.fillStyle = hg; ctx.fill();
    for (let k = 0; k < 9; k++) {
      const pts = [], rx = -6 + k * 3.2, ry = -246 + k * 7, len = 46 + k * 6 + w * (36 + k * 3), ph = k * 1.37, fr = 8.5 + k * .6;
      for (let i = 0; i <= 12; i++) { const s = i / 12; pts.push([rx + s * len, ry + s * s * (8 + k * 3.2) - w * 12 * s + Math.sin(s * 5 - t * fr + ph) * s * (3.5 + 5 * w)]); }
      taper(pts, 4.6 - k * .25, .25, k % 3 === 0 ? '#4e3228' : k % 3 === 1 ? '#3a251f' : '#2c1c19');
    }
    // sun-kissed strands (rim on top of the flying hair)
    ctx.lineCap = 'round';
    for (let k = 0; k < 4; k++) {
      ctx.strokeStyle = `rgba(236,170,110,${.55 - k * .1})`; ctx.lineWidth = 1.3 - k * .2; ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const s = i / 10, len = 60 + k * 16 + w * 46, x = 8 + k * 3 + s * len, y = -258 + k * 5 + s * s * (6 + k * 3) - w * 12 * s + Math.sin(s * 5 - t * (9 + k * .5) + k) * s * (3 + 5 * w); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    // raised (near) arm reaching for the hat: anticipation dip, overshoot, settle
    const rk = clamp(E.back(P(lt, .3, 1.05))), dip = Math.sin(clamp(P(lt, .1, .35)) * Math.PI) * 3;
    const el = [lerp(-27, -50, Math.pow(rk, .7)), lerp(-178 + dip, -244, rk)], hd = [lerp(-28, -36, rk), lerp(-148 + dip, -283, rk)];
    const hold = rk > .9 ? Math.sin(t * 9) * .8 * w : 0;
    limb(-21, -209, el[0], el[1], 4.6, 3.6, skin(-60, -15)); limb(el[0], el[1], hd[0], hd[1] + hold, 3.6, 3, skin(-55, -20));
    // brim shadow on the back of the head
    ctx.fillStyle = 'rgba(20,10,10,.35)'; ctx.beginPath(); ctx.ellipse(3, -266, 20, 6, -.1, 0, 7); ctx.fill();
    // hat: brim flutters on the lee side; hat tilts with the gust until the hand catches it
    const tilt = -.1 - .08 * w * (1 - rk) + .02 * Math.sin(t * 7) * w;
    const hc = [4, -277], fl = w * (.6 + .4 * Math.sin(t * 13)) * 7;
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(tilt + .1);
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283, ex = Math.cos(a) * 53, ey = Math.sin(a) * 13.5, lift = ex > 0 ? Math.pow(ex / 53, 2) * fl : 0, x = ex * Math.cos(-.1) - ey * Math.sin(-.1), y = ex * Math.sin(-.1) + ey * Math.cos(-.1) - lift; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); const sg = ctx.createLinearGradient(-50, -8, 50, 10); sg.addColorStop(0, '#bf9a60'); sg.addColorStop(.55, '#ebd196'); sg.addColorStop(1, '#fff0c2'); ctx.fillStyle = sg; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(150,112,60,.35)'; ctx.lineWidth = .8; for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.ellipse(0, 0, 53 - k * 8, 13.5 - k * 2, -.1, 0, 7); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = 'rgba(120,88,48,.55)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(1, -5, 24, 17, -.1, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath();
    const cg = ctx.createLinearGradient(-20, -22, 30, -4); cg.addColorStop(0, '#c9a465'); cg.addColorStop(1, '#fbe8b4'); ctx.fillStyle = cg; ctx.fill();
    ctx.fillStyle = '#c4423a'; ctx.beginPath(); ctx.ellipse(1, -6, 24.5, 5, -.1, 0, Math.PI); ctx.ellipse(1, -10, 24, 4, -.1, Math.PI, 0, true); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,160,.6)'; ctx.fillRect(10, -11, 12, 1.4);
    ctx.restore();
    // hat ribbon tails
    ribbonTail([27, -283], 108 * (1 + .4 * w), .12 - .12 * w, t, w, 0, 3.8, RIB0, RIB1, 16);
    ribbonTail([26, -280], 86 * (1 + .4 * w), .22 - .12 * w, t, w, 1.9, 3.4, RIB0, RIB1, 18);
    // hand on the brim
    if (rk > .05) { ctx.fillStyle = rgba(mix3(SKIN_S, SKIN, .45)); ctx.beginPath(); ctx.ellipse(hd[0], hd[1] + hold, 5, 6.2, -.5, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  const rimC = mk(GW, GH), rimG = rimC.getContext('2d');
  function girlLayer(lt, G) {
    const gc = paint('ghibli_girl', () => {
      girl(lt, G);
      ctx.save(); ctx.globalCompositeOperation = 'source-atop';
      const lg = ctx.createLinearGradient(GO.x - 90, 0, GO.x + 130, 0); lg.addColorStop(0, 'rgba(60,80,140,.2)'); lg.addColorStop(1, 'rgba(255,220,170,.06)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, GW, GH);
      const ao = ctx.createLinearGradient(0, GO.y - 190, 0, GO.y); ao.addColorStop(0, 'rgba(40,70,40,0)'); ao.addColorStop(1, 'rgba(40,70,40,.6)'); ctx.fillStyle = ao; ctx.fillRect(0, GO.y - 190, GW, 220);
      ctx.restore();
    }, GW, GH);
    // rim light: silhouette minus a copy shifted away from the sun (upper right)
    rimG.globalCompositeOperation = 'source-over'; rimG.clearRect(0, 0, GW, GH); rimG.drawImage(gc, 0, 0);
    rimG.globalCompositeOperation = 'source-in'; rimG.fillStyle = '#ffe9bf'; rimG.fillRect(0, 0, GW, GH);
    rimG.globalCompositeOperation = 'destination-out'; rimG.drawImage(gc, -3.5, 3.5);
    return gc;
  }

  // ---- CAMERA: slow push-in + gentle crane up, per-layer parallax ---------------------------
  let CK = 0;
  function cam(depth, fn) {
    const k = CK, s = 1 + k * (.03 + .085 * depth), ax = 460, ay = 1200;
    ctx.save(); ctx.translate(ax - k * 50 * depth, ay + k * 64 * depth - k * 12); ctx.scale(s, s); ctx.translate(-ax, -ay); fn(); ctx.restore();
  }

  STYLES_REG.ghibli = {
    label: 'GAYA GHIBLI',
    cues: [[0.05, 'swell', 3.2], [1.0, 'shimmer']],
    draw(lt, t) {
      const u = clamp(lt / DUR); CK = .55 * u + .45 * E.sine(u);
      // wind: breeze -> gust arrives ~0.9 s -> eases a little at the end
      const G = .5 + .5 * sstep(.6, 1.4, lt) - .12 * sstep(2.6, 3.4, lt);
      const D = lt + .9 * sstep(.6, 2.2, lt) * (lt - .6);   // gust-accelerated drift distance for particles
      ctx.save();
      bgFill('#cfe3ef');
      GP('sky', () => cam(0, () => drawL(sky)));
      GP('clouds', () => {
        cam(.06, () => drawL(cloudB, { x: cloudB.x + lt * 9 }));
        cam(.05, () => drawL(cloudR, { x: cloudR.x + lt * 7 }));
        cam(.04, () => {
          drawL(cloudA, { x: cloudA.x + lt * 5 });
          ctx.save(); ctx.strokeStyle = 'rgba(48,60,90,.85)'; ctx.lineCap = 'round'; ctx.lineWidth = 1.7;
          for (let i = 0; i < 5; i++) {
            const bx = 150 + i * 36 + h(i) * 30 + D * 40, by = 610 + h(i + 3) * 60 + Math.sin(lt * 1.3 + i) * 6 - i * 9, s = 5 + h(i + 7) * 3, fa = Math.sin(lt * 10 + i * 1.7);
            ctx.beginPath(); ctx.moveTo(bx - s * 1.6, by - fa * s * .8); ctx.quadraticCurveTo(bx - s * .6, by - s * .4 - fa * s * .3, bx, by); ctx.quadraticCurveTo(bx + s * .6, by - s * .4 - fa * s * .3, bx + s * 1.6, by - fa * s * .8); ctx.stroke();
          }
          ctx.restore();
        });
      });
      GP('sun', () => cam(0, () => {
        glowBlob(SUN.x, SUN.y, 150, 'rgba(255,252,236,.9)', 1, 'lighter');
        glowBlob(SUN.x, SUN.y, 360, 'rgba(255,228,175,.4)', 1, 'screen');
        ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .3 + .08 * noise1(lt * 1.3);
        ctx.drawImage(shafts.c, shafts.x, shafts.y, 1440, 1500); ctx.restore();
      }));
      GP('land', () => {
        cam(.12, () => drawL(mtn));
        cam(.2, () => drawL(farH));
        cam(.15, () => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const hg = ctx.createLinearGradient(0, 1110, 0, 1290); hg.addColorStop(0, 'rgba(255,246,226,0)'); hg.addColorStop(.5, 'rgba(255,246,226,.3)'); hg.addColorStop(1, 'rgba(255,246,226,0)'); ctx.fillStyle = hg; ctx.fillRect(-200, 1110, 1500, 180); ctx.restore(); });
        cam(.38, () => {
          drawL(midH); drawL(trunk);
          const sa = .012 * Math.sin(lt * 1.7) + .02 * G * (.6 + .4 * Math.sin(lt * 3.1)), px = TB.x, py = TB.y - 70;
          ctx.save(); ctx.translate(px, py); ctx.rotate(sa); ctx.transform(1, 0, sa * .6, 1, 0, 0); ctx.translate(-px, -py); drawL(canopy); ctx.restore();
        });
      });
      GP('field', () => cam(.72, () => {
        drawL(nearH);
        ctx.save(); ctx.clip(nearPath);
        ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .55; ctx.drawImage(SHADOWC, -200, 1600 + lt * 26 - 40); ctx.restore();
        drawBlades(0, lt, G); drawBlades(1, lt, G);
        ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .5 * G; ctx.translate(lt * 327 - 30, 0); ctx.transform(1, 0, -.27, 1, 0, 0);
        ctx.fillStyle = SHEENPAT; ctx.fillRect(-1000, 1330, 3400, 300); ctx.restore();
        ctx.restore();
      }));
      GP('girl', () => {
        const gc = girlLayer(lt, G);
        cam(.74, () => {
          const gx = FEET.x - GO.x, gy = FEET.y - GO.y;
          comp(gc, { x: gx, y: gy });
          comp(rimC, { x: gx, y: gy, alpha: .85 });
          comp(rimC, { x: gx, y: gy, alpha: .35, blur: 5, mode: 'lighter' });
        });
      });
      GP('front', () => cam(.76, () => { ctx.save(); ctx.clip(nearPath); drawBlades(2, lt, G); ctx.restore(); }));
      GP('parts', () => {
        for (const p of PARTS) {
          const sp = 70 + p.d * 300, x = ((p.x0 + D * sp) % 1400) - 160, y = p.y0 + Math.sin(lt * 1.6 + p.ph) * 30 * (.5 + p.d) - lt * 18 * p.d;
          const bi = p.d < .45 ? 0 : p.d < .8 ? 1 : 2, spr = (p.seed ? SB : PB)[bi], sz = 26 * p.sz * spr.width / 48;
          ctx.save(); ctx.globalAlpha = p.d < .2 ? .7 : .95; ctx.translate(x, y); ctx.rotate(p.ph + lt * p.spin); ctx.scale(p.seed ? 1 : Math.cos(lt * 4 + p.ph) * .8 + .2, 1);
          ctx.drawImage(spr, -sz / 2, -sz / 2, sz, sz); ctx.restore();
        }
      });
      GP('fg', () => cam(1.2, () => {
        const g = fgG; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, fgL.width, fgL.height); g.filter = 'none';
        on(g, () => {
          ctx.scale(FGS, FGS); ctx.translate(200, -1380);
          const mg = ctx.createLinearGradient(0, 1730, 0, 2120); mg.addColorStop(0, 'rgba(26,48,30,0)'); mg.addColorStop(.25, '#1b3424'); mg.addColorStop(1, '#0d1a10');
          ctx.fillStyle = mg; ctx.beginPath(); ctx.moveTo(-200, 2200); for (let x = -200; x <= 1300; x += 20) ctx.lineTo(x, 1795 + Math.sin(x * .01) * 18 + (x > 720 ? -(x - 720) * .12 : 0)); ctx.lineTo(1300, 2200); ctx.fill();
          for (const b of FG) {
            const sw = .5 + .5 * Math.sin(b.x * .008 - lt * 3.4), bend = .1 + b.lean * .4 + G * (.32 * sw + .1 * noise1(lt * 1.5 + b.ph)), sb = Math.sin(bend), cb = Math.cos(bend);
            const tx = b.x + b.L * sb, ty = b.y - b.L * cb, mx = b.x + b.L * .25 * sb, my = b.y - b.L * .6;
            ctx.fillStyle = FGC[(b.c * 4) | 0]; ctx.beginPath(); ctx.moveTo(b.x - b.w, b.y); ctx.quadraticCurveTo(mx - b.w * .5, my, tx, ty); ctx.quadraticCurveTo(mx + b.w * .5, my, b.x + b.w, b.y); ctx.fill();
            ctx.strokeStyle = 'rgba(200,214,120,.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b.x + b.w * .6, b.y - b.L * .3); ctx.quadraticCurveTo(mx + b.w * .5, my, tx, ty); ctx.stroke();
            if (b.seed) { ctx.fillStyle = 'rgba(222,206,146,.9)'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(tx - sb * k * 10 + Math.sin(k) * 5, ty + cb * k * 10, 4.5, 10, bend + .3 * Math.sin(k * 2), 0, 7); ctx.fill(); } }
          }
        });
        comp(fgL, { x: -200, y: 1380, w: 1500, hh: 820, blur: 3 });
      }));
      GP('grade', () => {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light'; ctx.drawImage(GRADE, 0, 0);
        ctx.globalCompositeOperation = 'multiply'; const bgr = ctx.createLinearGradient(0, 1450, 0, H); bgr.addColorStop(0, 'rgba(70,100,130,0)'); bgr.addColorStop(1, 'rgba(60,90,120,.3)'); ctx.fillStyle = bgr; ctx.fillRect(-100, 1450, W + 200, 570);
        ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .26; ctx.drawImage(TEX, 0, 0);
        ctx.restore();
      });
      const sa = E.sine(P(lt, .5, 1.1));
      if (sa > 0) subtitle('Musim panas itu… semuanya berubah.', 1592 - 6 * (1 - sa), sa, { size: 48, shadow: { c: 'rgba(10,30,20,.55)', x: 0, y: 3 }, glow: 'rgba(0,20,10,.4)', gb: 18 });
      ctx.restore();
    },
  };
})();
