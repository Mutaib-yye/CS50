// SHOWCASE STYLE: ghibli — "hand-painted pastoral summer" (original scene, feel only).
// A girl in a white summer dress & straw hat on a grassy hill; a towering sunlit cumulus,
// a lone tree, a tiny far-away house. Wind gust rolls through the grass, lifts hair, ribbon, hem.
// All static art is painted ONCE at load (sphere-union lit clouds + brush-dab passes); per frame
// we only composite layers with a slow push-in / crane, draw wind-driven grass, the girl, particles.
(() => {
  const DUR = 3.4;
  const R = mulberry(77031);
  const SUN = { x: 872, y: 342 };
  const LV = (() => { const v = [0.5, -0.58, 0.64]; const l = Math.hypot(...v); return v.map(a => a / l); })();
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
  // union-of-spheres renderer: per-pixel visible-sphere normal -> shade(x,y,nx,ny,nz,cov) => [r,g,b,a]
  function sphereShade(w, hh, lobes, shade, bright) {
    const N = w * hh, ZB = new Float32Array(N).fill(-1e9), NX = new Float32Array(N), NY = new Float32Array(N), NZ = new Float32Array(N), CV = new Float32Array(N);
    for (const b of lobes) {
      const r = b.r, r2 = r * r, x0 = Math.max(0, Math.floor(b.x - r)), x1 = Math.min(w - 1, Math.ceil(b.x + r)), y0 = Math.max(0, Math.floor(b.y - r)), y1 = Math.min(hh - 1, Math.ceil(b.y + r));
      for (let y = y0; y <= y1; y++) {
        const dy = y + .5 - b.y, row = y * w;
        for (let x = x0; x <= x1; x++) {
          const dx = x + .5 - b.x, d2 = dx * dx + dy * dy; if (d2 >= r2) continue;
          const i = row + x, zz = Math.sqrt(r2 - d2), cv = (r - Math.sqrt(d2)) * .9;
          if (cv > CV[i]) CV[i] = cv > 1 ? 1 : cv;
          const Z = zz + b.z; if (Z > ZB[i]) { ZB[i] = Z; NX[i] = dx / r; NY[i] = dy / r; NZ[i] = zz / r; }
        }
      }
    }
    const c = mk(w, hh), g = c.getContext('2d'), id = g.createImageData(w, hh), D = id.data, out = [0, 0, 0, 0];
    let bc = null, bid = null, BD = null; if (bright) { bc = mk(w, hh); bid = bc.getContext('2d').createImageData(w, hh); BD = bid.data; }
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (CV[i] <= 0) continue;
      const lit = shade(x, y, NX[i], NY[i], NZ[i], CV[i], out); const p = i * 4;
      D[p] = out[0]; D[p + 1] = out[1]; D[p + 2] = out[2]; D[p + 3] = out[3];
      if (BD) { const b = clamp((lit - bright) * 3.5) * out[3]; BD[p] = 255; BD[p + 1] = 236; BD[p + 2] = 200; BD[p + 3] = b; }
    }
    g.putImageData(id, 0, 0); if (bc) bc.getContext('2d').putImageData(bid, 0, 0);
    return { c, bright: bc };
  }
  function addKids(r, parents, n, k0, k1, a0, a1, maxY, out) {
    for (const p of parents) for (let k = 0; k < n; k++) {
      const a = lerp(a0, a1, r()), rho = p.r * (.7 + .27 * r()), x = p.x + Math.cos(a) * rho, y = p.y + Math.sin(a) * rho;
      if (y > maxY) continue;
      const cr = p.r * lerp(k0, k1, r());
      out.push({ x, y, r: cr, z: p.z + Math.sqrt(Math.max(0, p.r * p.r - rho * rho)) - cr * .5 });
    }
  }
  const blurInto = (src, px, sc = 1) => { const c = mk(Math.ceil(src.width * sc), Math.ceil(src.height * sc)), g = c.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(src, 0, 0, c.width, c.height); return c; };

  // ---- SKY ---------------------------------------------------------------------------------
  const SKYC = hex('#9fcbea');
  const sky = L(-170, -170, 1420, 1560);
  (() => {
    const g = sky.g; g.translate(-sky.x, -sky.y);
    const gr = g.createLinearGradient(0, -170, 0, 1390);
    [[0, '#1c56a6'], [.2, '#2a6cbf'], [.45, '#4f92d9'], [.66, '#86bde8'], [.82, '#bcdcf0'], [.93, '#e2eeee'], [1, '#f3f1e2']].forEach(([k, c]) => gr.addColorStop(k, c));
    g.fillStyle = gr; g.fillRect(-170, -170, 1420, 1560);
    // warm sun-side air
    const rg = g.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 900); rg.addColorStop(0, 'rgba(255,244,214,.55)'); rg.addColorStop(.35, 'rgba(255,236,200,.18)'); rg.addColorStop(1, 'rgba(255,236,200,0)');
    g.fillStyle = rg; g.fillRect(-170, -170, 1420, 1560);
    // soft painted variation (large, low-alpha washes)
    for (let i = 0; i < 90; i++) { const x = -170 + R() * 1420, y = -170 + R() * 1300, r = 80 + R() * 260; const c = R() < .5 ? 'rgba(255,255,255,' : 'rgba(30,80,170,'; const w = g.createRadialGradient(x, y, 0, x, y, r); w.addColorStop(0, c + (.035 + R() * .04) + ')'); w.addColorStop(1, c + '0)'); g.fillStyle = w; g.beginPath(); g.ellipse(x, y, r * 1.8, r, -.1, 0, 7); g.fill(); }
    // high wisps of cirrus
    for (let i = 0; i < 220; i++) { const x = -100 + R() * 1300, y = 60 + R() * 520, l = 40 + R() * 160; g.fillStyle = `rgba(255,255,255,${.03 + R() * .06})`; g.beginPath(); g.ellipse(x, y + noise1(x * .004) * 60, l, 3 + R() * 6, -.18 + R() * .08, 0, 7); g.fill(); }
    g.setTransform(1, 0, 0, 1, 0, 0);
    brushify(sky.c, 16000, { s0: 6, s1: 30, a: .35, jit: 7, ang: -.12, angJ: .4, asp: .35, seed: 3 });
  })();

  // ---- CLOUDS (sphere-union cumulus) -------------------------------------------------------
  const cloudRamp = ramp([[0, '#6a7fae'], [.22, '#8597c1'], [.42, '#aebcd9'], [.58, '#d8dfec'], [.72, '#f3efe8'], [.86, '#fff6e6'], [1, '#fffdf7']]);
  function paintCloud(l, lobes, baseY, topY, o = {}) {
    const ng = noiseGrid(l.w, l.hh, 6, .012, o.seed || 1.7), ng2 = noiseGrid(l.w, l.hh, 10, .004, (o.seed || 1.7) + 30);
    const haze = o.haze || 0, warm = hex('#ffe2bf');
    const res = sphereShade(l.w, l.hh, lobes, (x, y, nx, ny, nz, cv, out) => {
      const hf = clamp((baseY - y) / (baseY - topY));
      const lam = nx * LV[0] + ny * LV[1] + nz * LV[2];
      let s = clamp(lam) * .78 + .1 + .2 * hf;
      s *= lerp(.5, 1, sstep(0, .5, hf + ng2(x, y) * .25));
      s += ng(x, y) * .09;
      s = s + (Math.round(s * 6) / 6 - s) * .45;   // painterly tone grouping
      s = clamp(s);
      let c = cloudRamp(s);
      if (s > .6) c = mix3(c, warm, (s - .6) * .55 * hf);
      if (haze) c = mix3(c, SKYC, haze * (1 - s * .5));
      const bf = sstep(baseY + 14, baseY - 48 + ng2(x * 1.5, y) * 30, y);
      out[0] = c[0]; out[1] = c[1]; out[2] = c[2]; out[3] = 255 * cv * bf;
      return s;
    }, o.bright ?? .82);
    l.g.drawImage(res.c, 0, 0);
    brushify(l.c, o.dabs || 30000, { s0: 2.5, s1: 11, a: .55, jit: 7, ang: -.3, angJ: 2.5, asp: .55, smear: 1, seed: o.seed * 7 | 0 });
    // ragged painted edges: dabs that spill slightly outside the silhouette
    brushify(l.c, o.edge || 9000, { s0: 2, s1: 6, a: .35, jit: 4, minA: 90, smear: 2.2, over: true, seed: o.seed * 11 | 0 });
    return res.bright ? blurInto(res.bright, 10, .25) : null;
  }
  // hero tower
  const cloudA = L(-170, 110, 1440, 1010);
  const bloomA = (() => {
    const lob = [], cx = 380 + 170, baseY = 1010 - 110, topY = 250 - 110, r = R;
    const big = [];
    for (let i = 0; i < 64; i++) {
      const u = Math.pow(r(), .8), hw = 440 * (1 - .56 * u) * (.85 + .3 * noise1(u * 6 + 2));
      const rad = lerp(150, 92, u) * (.72 + .5 * r());
      const y = baseY - rad * .5 - u * (baseY - topY - rad * 1.1);
      const x = cx + 90 * u + (r() * 2 - 1) * Math.max(10, hw - rad * .55);
      big.push({ x, y, r: rad, z: r() * 50 + (1 - u) * 30 });
    }
    big.push({ x: cx + 60, y: topY + 95, r: 105, z: 40 }, { x: cx + 160, y: topY + 130, r: 90, z: 30 }, { x: cx - 40, y: topY + 140, r: 92, z: 30 });
    // side bulges
    big.push({ x: cx - 330, y: baseY - 210, r: 120, z: 10 }, { x: cx + 380, y: baseY - 300, r: 115, z: 0 }, { x: cx + 300, y: baseY - 470, r: 100, z: 10 }, { x: cx - 260, y: baseY - 420, r: 95, z: 0 });
    lob.push(...big);
    const kids = []; addKids(r, big, 4, .26, .44, -Math.PI * 1.08, Math.PI * .08, baseY - 30, kids); lob.push(...kids);
    const gk = []; addKids(r, kids, 3, .32, .5, -Math.PI * 1.1, Math.PI * .1, baseY - 30, gk); lob.push(...gk);
    // second, farther mass on the right (lower, behind)
    const big2 = [];
    for (let i = 0; i < 24; i++) { const u = Math.pow(r(), .9); const rad = lerp(105, 62, u) * (.75 + .45 * r()); big2.push({ x: 1180 + (r() * 2 - 1) * (260 - u * 130), y: 1060 - 110 - rad * .45 - u * 320, r: rad, z: -260 + r() * 30 }); }
    lob.push(...big2); const k2 = []; addKids(r, big2, 4, .28, .46, -Math.PI * 1.05, Math.PI * .05, 1060 - 140, k2); lob.push(...k2); const g2 = []; addKids(r, k2, 2, .35, .5, -Math.PI, 0, 1060 - 140, g2); lob.push(...g2);
    return paintCloud(cloudA, lob, baseY, topY, { seed: 2.3, dabs: 42000, edge: 12000 });
  })();
  // low distant cloud bank on the horizon
  const cloudB = L(-170, 900, 1440, 330);
  (() => {
    const lob = [], baseY = 300, r = R, big = [];
    for (let i = 0; i < 46; i++) { const x = r() * 1440, rad = 30 + r() * 62 * (.6 + .6 * Math.abs(noise1(x * .006))); big.push({ x, y: baseY - rad * .4 - r() * 60, r: rad, z: r() * 20 }); }
    lob.push(...big); const k = []; addKids(r, big, 3, .3, .5, -Math.PI, 0, baseY - 10, k); lob.push(...k);
    paintCloud(cloudB, lob, baseY, 120, { seed: 5.1, haze: .38, dabs: 9000, edge: 3000, bright: 2 });
  })();

  // ---- LIGHT SHAFTS -------------------------------------------------------------------------
  const shafts = (() => {
    const c = mk(700, 1000), g = c.getContext('2d'), sx = SUN.x / 2 + 85, sy = SUN.y / 2 + 85;
    for (let i = 0; i < 9; i++) {
      const a = lerp(1.75, 2.75, i / 8 + (R() - .5) * .06), wdt = .015 + R() * .035, len = 900;
      const gr = g.createRadialGradient(sx, sy, 0, sx, sy, len); gr.addColorStop(0, `rgba(255,246,220,${.55 + R() * .3})`); gr.addColorStop(.5, 'rgba(255,240,210,.18)'); gr.addColorStop(1, 'rgba(255,240,210,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a - wdt) * len, sy + Math.sin(a - wdt) * len); g.lineTo(sx + Math.cos(a + wdt) * len, sy + Math.sin(a + wdt) * len); g.closePath(); g.fill();
    }
    return blurInto(c, 7);
  })();

  // ---- MOUNTAINS / FAR HILLS / HOUSE -------------------------------------------------------
  const mtnY = x => 1186 - 55 * Math.max(0, noise1(x * .0032 + 1.3)) - 22 * noise1(x * .009 + 4) - 8 * noise1(x * .03);
  const far1 = x => 1214 + noise1(x * .004 + 3) * 16 + noise1(x * .013) * 5;
  const far2 = x => 1240 + noise1(x * .0045 + 9) * 12 + noise1(x * .016 + 2) * 4 + (x < 400 ? -(400 - x) * .02 : 0);
  const mtn = L(-170, 1080, 1440, 240);
  (() => {
    const g = mtn.g; g.translate(-mtn.x, -mtn.y);
    g.beginPath(); g.moveTo(-170, 1320); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, mtnY(x)); g.lineTo(1270, 1320); g.closePath();
    const gr = g.createLinearGradient(0, 1120, 0, 1260); gr.addColorStop(0, '#89a9c9'); gr.addColorStop(1, '#bcd2df'); g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    for (let x = -170; x <= 1270; x += 3) { const sl = mtnY(x + 3) - mtnY(x - 3); if (sl > .4) { g.fillStyle = `rgba(232,240,240,${clamp(sl * .12) * .5})`; g.fillRect(x, mtnY(x), 3, 40 + R() * 30); } }
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    brushify(mtn.c, 5000, { s0: 2, s1: 9, a: .5, jit: 6, ang: 1.2, angJ: .8, seed: 21 });
  })();
  const farH = L(-170, 1160, 1440, 200);
  (() => {
    const g = farH.g; g.translate(-farH.x, -farH.y);
    const hill = (fy, c0, c1) => { g.beginPath(); g.moveTo(-170, 1360); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, fy(x)); g.lineTo(1270, 1360); g.closePath(); const gr = g.createLinearGradient(0, 1200, 0, 1330); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill(); };
    hill(far1, '#a2c3b4', '#94b7a2');
    // tree lines on back hill
    for (let i = 0; i < 260; i++) { const x = -170 + R() * 1440, y = far1(x) + 2 + R() * 14; g.fillStyle = `rgba(${88 + R() * 20},${128 + R() * 20},${122 + R() * 16},.75)`; g.beginPath(); g.ellipse(x, y, 3 + R() * 5, 2 + R() * 4, 0, 0, 7); g.fill(); }
    hill(far2, '#9cc28e', '#86b07a');
    g.save(); g.beginPath(); g.moveTo(-170, 1360); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, far2(x)); g.lineTo(1270, 1360); g.clip();
    // patchwork fields
    for (let i = 0; i < 26; i++) { const x = -170 + R() * 1440, y = far2(x) + 8 + R() * 50; g.fillStyle = R() < .5 ? 'rgba(214,224,150,.28)' : 'rgba(90,130,90,.22)'; g.beginPath(); g.ellipse(x, y, 40 + R() * 90, 5 + R() * 8, (R() - .5) * .12, 0, 7); g.fill(); }
    // hedgerows
    for (let k = 0; k < 6; k++) { let x = -170 + R() * 1440, y = far2(x) + 10 + R() * 40; const dx = (R() - .5) * 2.5; for (let j = 0; j < 40; j++) { g.fillStyle = 'rgba(70,110,80,.55)'; g.beginPath(); g.arc(x, y, 2 + R() * 2, 0, 7); g.fill(); x += 4 + R() * 2; y += dx * .3; } }
    g.restore();
    // the little house far away (left), with two trees
    const hx = 176, hy = far2(176) + 6;
    const tree = (x, y, s, c) => { for (let i = 0; i < 14; i++) { g.fillStyle = i < 9 ? c : 'rgba(170,200,140,.6)'; g.beginPath(); g.arc(x + (R() - .5) * 14 * s, y - 16 * s + (R() - .5) * 14 * s - (i < 9 ? 0 : 5 * s), (5 + R() * 4) * s, 0, 7); g.fill(); } };
    tree(hx - 46, hy + 2, 1.6, '#567f68'); tree(hx - 30, hy, 1.1, '#5f8a6f');
    g.fillStyle = 'rgba(60,90,70,.35)'; g.beginPath(); g.ellipse(hx + 6, hy + 4, 46, 5, 0, 0, 7); g.fill();
    // walls (lit right face, shadow front)
    g.fillStyle = '#e9e1cf'; g.fillRect(hx - 22, hy - 22, 40, 24); g.fillStyle = '#f7f1e2'; g.fillRect(hx + 18, hy - 22, 16, 24);
    g.fillStyle = '#c8c3bd'; g.fillRect(hx - 22, hy - 22, 40, 5);
    g.fillStyle = '#5b6a7c'; g.fillRect(hx - 14, hy - 13, 6, 7); g.fillRect(hx + 2, hy - 13, 6, 7); g.fillStyle = '#7a5a48'; g.fillRect(hx + 23, hy - 12, 6, 14);
    // roof
    g.fillStyle = '#b8513b'; g.beginPath(); g.moveTo(hx - 27, hy - 21); g.lineTo(hx - 14, hy - 40); g.lineTo(hx + 26, hy - 40); g.lineTo(hx + 22, hy - 21); g.closePath(); g.fill();
    g.fillStyle = '#d87a55'; g.beginPath(); g.moveTo(hx + 22, hy - 21); g.lineTo(hx + 26, hy - 40); g.lineTo(hx + 38, hy - 21); g.closePath(); g.fill();
    g.fillStyle = '#e39a72'; g.fillRect(hx - 14, hy - 41, 40, 3);
    g.fillStyle = '#8d4a3a'; g.fillRect(hx + 8, hy - 50, 5, 11);
    tree(hx + 56, hy + 3, 1.3, '#5a846c');
    // haze over everything
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
    const hz = g.createLinearGradient(0, 0, 0, 200); hz.addColorStop(0, 'rgba(196,220,232,.42)'); hz.addColorStop(1, 'rgba(196,220,232,.12)'); g.fillStyle = hz; g.fillRect(0, 0, 1440, 200);
    g.globalCompositeOperation = 'source-over';
    brushify(farH.c, 6000, { s0: 2, s1: 7, a: .45, jit: 6, ang: 0, angJ: .6, seed: 31 });
  })();
  // mid hill with the lone tree (right)
  const midY = x => 1264 + Math.pow((x - 860) / 300, 2) * 24 + noise1(x * .012) * 4;
  const midH = L(-170, 1220, 1440, 220);
  (() => {
    const g = midH.g; g.translate(-midH.x, -midH.y);
    g.beginPath(); g.moveTo(-170, 1440); for (let x = -170; x <= 1270; x += 4) g.lineTo(x, midY(x)); g.lineTo(1270, 1440); g.closePath();
    const gr = g.createLinearGradient(0, 1255, 0, 1420); gr.addColorStop(0, '#a6c66a'); gr.addColorStop(.25, '#83ac55'); gr.addColorStop(1, '#5e8c45'); g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    for (let i = 0; i < 70; i++) { const x = -170 + R() * 1440, y = midY(x) + R() * 150; g.fillStyle = R() < .5 ? 'rgba(220,230,140,.18)' : 'rgba(50,90,60,.16)'; g.beginPath(); g.ellipse(x, y, 30 + R() * 80, 4 + R() * 10, 0, 0, 7); g.fill(); }
    // tree shadow (sun is upper right & behind -> shadow toward camera-left)
    const sg = g.createRadialGradient(812, 1274, 0, 812, 1274, 150); sg.addColorStop(0, 'rgba(40,70,50,.5)'); sg.addColorStop(1, 'rgba(40,70,50,0)'); g.fillStyle = sg; g.save(); g.translate(812, 1274); g.scale(1, .1); g.translate(-812, -1274); g.fillRect(600, 1100, 450, 400); g.restore();
    g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(190,215,225,.12)'; g.fillRect(0, 0, 1440, 220); g.globalCompositeOperation = 'source-over';
    brushify(midH.c, 9000, { s0: 2, s1: 9, a: .5, jit: 8, ang: -1.45, angJ: .6, asp: .3, seed: 41 });
  })();
  // the lone tree: trunk + sphere-shaded canopy, painted separately so the canopy can sway
  const TB = { x: 850, y: 1266 };   // trunk base (world)
  const trunk = L(TB.x - 240, TB.y - 400, 480, 410), canopy = L(TB.x - 240, TB.y - 420, 480, 380);
  (() => {
    const g = trunk.g, bx = 240, by = 400;
    const limb = (x0, y0, x1, y1, w0, w1, cx, cy) => {
      g.fillStyle = '#4b3a36'; g.beginPath(); g.moveTo(x0 - w0, y0); g.quadraticCurveTo(cx - (w0 + w1) / 2, cy, x1 - w1, y1); g.lineTo(x1 + w1, y1); g.quadraticCurveTo(cx + (w0 + w1) / 2, cy, x0 + w0, y0); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(176,140,100,.7)'; g.lineWidth = Math.max(1.5, w1 * .5); g.beginPath(); g.moveTo(x0 + w0 * .7, y0); g.quadraticCurveTo(cx + (w0 + w1) / 2 * .7, cy, x1 + w1 * .7, y1); g.stroke();
    };
    limb(bx, by, bx - 4, by - 110, 13, 9, bx + 4, by - 60);
    limb(bx - 4, by - 108, bx - 70, by - 190, 8, 3, bx - 30, by - 140);
    limb(bx - 2, by - 108, bx + 62, by - 200, 8, 3, bx + 30, by - 150);
    limb(bx - 4, by - 110, bx + 6, by - 230, 7, 3, bx - 8, by - 170);
    g.fillStyle = 'rgba(60,40,30,.6)'; g.beginPath(); g.ellipse(bx + 2, by, 24, 5, 0, 0, 7); g.fill();
  })();
  (() => {
    const lob = [], r = R, cx = 240, cy = 170, big = [];
    for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = Math.sqrt(r()); big.push({ x: cx + Math.cos(a) * d * 150, y: cy + Math.sin(a) * d * 85 - (1 - d) * 10, r: 42 + r() * 34, z: r() * 30 }); }
    big.push({ x: cx - 20, y: cy - 60, r: 70, z: 20 }, { x: cx + 60, y: cy - 40, r: 64, z: 10 });
    lob.push(...big); const k = []; addKids(r, big, 5, .3, .45, -Math.PI * 1.15, Math.PI * .15, 999, k); lob.push(...k); const gk = []; addKids(r, k, 3, .32, .5, -Math.PI * 1.2, Math.PI * .2, 999, gk); lob.push(...gk);
    const lr = ramp([[0, '#203d3d'], [.3, '#2f5844'], [.5, '#4a7a48'], [.68, '#79a24f'], [.84, '#b4c766'], [1, '#e4e494']]), ng = noiseGrid(480, 380, 5, .03, 7.7), haze = hex('#b8d2d6');
    const res = sphereShade(480, 380, lob, (x, y, nx, ny, nz, cv, out) => {
      const lam = nx * LV[0] + ny * LV[1] + nz * LV[2], hf = clamp((300 - y) / 260);
      let s = clamp(lam) * .8 + .05 + .15 * hf + ng(x, y) * .1; s *= lerp(.6, 1, hf); s = clamp(s + (Math.round(s * 5) / 5 - s) * .5);
      const c = mix3(lr(s), haze, .14); out[0] = c[0]; out[1] = c[1]; out[2] = c[2]; out[3] = 255 * cv; return s;
    });
    canopy.g.drawImage(res.c, 0, 0);
    brushify(canopy.c, 14000, { s0: 2, s1: 6, a: .7, jit: 12, angJ: 6.3, asp: .5, smear: 1.2, seed: 61 });
    brushify(canopy.c, 6000, { s0: 2, s1: 5, a: .8, jit: 10, minA: 120, angJ: 6.3, asp: .5, smear: 2.6, over: true, seed: 62 });
  })();

  // ---- NEAR HILL (girl's field) ------------------------------------------------------------
  const nearY = x => 1395 - 45 * Math.exp(-Math.pow((x - 320) / 420, 2)) + .045 * (x - 320) + noise1(x * .01) * 5;
  const nearPath = (() => { const p = new Path2D(); p.moveTo(-200, 2200); for (let x = -200; x <= 1300; x += 8) p.lineTo(x, nearY(x)); p.lineTo(1300, 2200); p.closePath(); return p; })();
  const nearH = L(-180, 1320, 1460, 860);
  (() => {
    const g = nearH.g; g.translate(-nearH.x, -nearH.y);
    const gr = g.createLinearGradient(0, 1345, 0, 2150);
    [[0, '#b2cc68'], [.08, '#8fb352'], [.25, '#6b9a43'], [.5, '#4c7b37'], [1, '#24472a']].forEach(([k, c]) => gr.addColorStop(k, c));
    g.fillStyle = gr; g.fill(nearPath);
    g.save(); g.clip(nearPath);
    for (let i = 0; i < 500; i++) { const x = -180 + R() * 1460, y = 1340 + Math.pow(R(), 1.3) * 820, s = .4 + (y - 1300) / 500; g.fillStyle = R() < .5 ? `rgba(206,222,120,${.08 + R() * .1})` : `rgba(30,70,45,${.08 + R() * .12})`; g.beginPath(); g.ellipse(x, y, (30 + R() * 90) * s, (5 + R() * 12) * s, (R() - .5) * .2, 0, 7); g.fill(); }
    // warm light catching the crest
    const cg = g.createLinearGradient(0, 1340, 0, 1440); cg.addColorStop(0, 'rgba(255,236,170,.35)'); cg.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = cg; g.fillRect(-180, 1300, 1460, 160);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    brushify(nearH.c, 26000, { s0: 2, s1: 14, a: .5, jit: 12, ang: -1.45, angJ: .5, asp: .22, smear: 1.2, seed: 71 });
  })();

  // grass blades (generated once, bent per frame)
  const FEET = { x: 420, y: 1505 };
  const BL = [];
  for (let i = 0; i < 3000; i++) {
    const x = -180 + R() * 1460, rg = nearY(x), v = Math.pow(R(), 1.55), y = rg + 3 + v * (1790 - rg);
    const Ln = .42 * (y - 1196) * (.5 + .65 * R());
    BL.push({ x, y, L: Ln, w: 1.1 + Ln * .032, tone: R(), ph: R() * 6.28, lean: (R() - .5) * .3 });
  }
  BL.sort((a, b) => a.y - b.y);
  const BANDS = [1420, FEET.y, 1600, 1700, 9999];
  const TONES = ['#30573a', '#43733c', '#5a8c41', '#78a649', '#a2c25c', '#d4e08c'].map(hex);
  const HAZE_G = hex('#b9d0b0'), DARK = hex('#1e3a26');
  const PAL = [.32, .16, .05, 0, 0].map((hz, b) => TONES.map(c => rgba(mix3(mix3(c, HAZE_G, hz), DARK, b === 4 ? .18 : b === 3 ? .08 : 0))));
  const bandIdx = []; { let b = 0; BL.forEach((bl, i) => { while (bl.y >= BANDS[b]) { bandIdx.push(i); b++; } }); while (bandIdx.length < BANDS.length) bandIdx.push(BL.length); }
  // bandIdx[k] = first blade index with y >= BANDS[k]
  const bandRange = k => [k ? bandIdx[k - 1] : 0, bandIdx[k]];
  function drawBlades(k, lt, G) {
    const [i0, i1] = bandRange(k), paths = TONES.map(() => new Path2D());
    for (let i = i0; i < i1; i++) {
      const b = BL[i], sw = .5 + .5 * Math.sin(b.x * .011 + b.y * .003 - lt * 3.6), n = noise2(b.x * .004 - lt * .8, b.y * .012);
      const bend = .14 + b.lean + G * (.4 * sw + .18 * n) + .05 * Math.sin(lt * 8 + b.ph) * G;
      const sheen = clamp(sw * G * 1.3 - .3), tone = clamp(b.tone * .62 + sheen * .5), ti = Math.min(5, (tone * 6) | 0);
      const sb = Math.sin(bend), cb = Math.cos(bend), tx = b.x + b.L * sb, ty = b.y - b.L * cb, mx = b.x + b.L * .2 * sb, my = b.y - b.L * .55;
      const p = paths[ti]; p.moveTo(b.x - b.w, b.y); p.quadraticCurveTo(mx - b.w * .4, my, tx, ty); p.quadraticCurveTo(mx + b.w * .4, my, b.x + b.w, b.y); p.closePath();
    }
    for (let i = 0; i < paths.length; i++) { ctx.fillStyle = PAL[k][i]; ctx.fill(paths[i]); }
  }
  // sheen strip (wind waves catching light), drawn as a moving pattern clipped to the field
  const SHEEN = (() => { const per = 571, c = mk(per, 4), g = c.getContext('2d'); for (let x = 0; x < per; x++) { const v = Math.pow(.5 + .5 * Math.sin(x / per * 6.283), 3); g.fillStyle = `rgba(250,248,190,${v})`; g.fillRect(x, 0, 1, 4); } return c; })();
  const SHEENPAT = MAIN.createPattern(SHEEN, 'repeat');

  // foreground (out-of-focus) grass
  const FG = [];
  for (let i = 0; i < 90; i++) {
    const side = i < 34 ? 0 : i < 52 ? 1 : 2;
    const x = side === 0 ? -170 + R() * 560 : side === 1 ? 380 + R() * 330 : 700 + R() * 560;
    const y = 1930 + R() * 170, Ln = side === 0 ? 120 + R() * 110 : side === 1 ? 150 + R() * 140 : 280 + R() * 380;
    FG.push({ x, y, L: Ln, w: 6 + R() * 9, ph: R() * 6.28, lean: (R() - .3) * .5, c: R(), seed: side === 2 && R() < .35 });
  }
  const FGC = ['#18301c', '#213d22', '#2c4b27', '#3a5c2c'];

  // ---- PARTICLES -----------------------------------------------------------------------------
  const sprite = (fn, s = 48) => { const c = mk(s, s), g = c.getContext('2d'); g.translate(s / 2, s / 2); fn(g); return c; };
  const PETAL = sprite(g => { const gr = g.createLinearGradient(-12, 0, 12, 0); gr.addColorStop(0, '#ffd9e2'); gr.addColorStop(1, '#fffaf6'); g.fillStyle = gr; g.beginPath(); g.moveTo(-13, 0); g.bezierCurveTo(-6, -9, 8, -8, 13, -1); g.lineTo(9, 0); g.lineTo(13, 2); g.bezierCurveTo(6, 8, -6, 8, -13, 0); g.fill(); });
  const SEED = sprite(g => { g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.2; for (let k = 0; k < 14; k++) { const a = -Math.PI + k / 13 * Math.PI; g.beginPath(); g.moveTo(0, 6); g.lineTo(Math.cos(a) * 15, Math.sin(a) * 13); g.stroke(); } g.fillStyle = '#e8e0c8'; g.beginPath(); g.ellipse(0, 9, 1.6, 4, 0, 0, 7); g.fill(); });
  const PB = [PETAL, blurInto(PETAL, 2), blurInto(PETAL, 5)], SB = [SEED, blurInto(SEED, 2), blurInto(SEED, 5)];
  const PARTS = []; for (let i = 0; i < 46; i++) { const d = Math.pow(R(), 1.4); PARTS.push({ d, x0: R() * 1400, y0: 200 + R() * 1500, ph: R() * 6.28, spin: (R() - .5) * 6, seed: R() < .45, sz: .5 + d * 1.6 + R() * .3 }); }

  // ---- PAPER / GRADE --------------------------------------------------------------------------
  const CANVAS = (() => { const c = mk(W, H), g = c.getContext('2d'), r = mulberry(5); g.fillStyle = '#808080'; g.fillRect(0, 0, W, H); for (let i = 0; i < 9000; i++) { const v = 128 + (r() - .5) * 40 | 0; g.fillStyle = `rgba(${v},${v},${v},.5)`; g.beginPath(); g.ellipse(r() * W, r() * H, 4 + r() * 16, 1.5 + r() * 3, -.3 + (r() - .5) * .5, 0, 7); g.fill(); } return c; })();

  // ---- GIRL -------------------------------------------------------------------------------------
  const GW = 620, GH = 780, GO = { x: 250, y: 740 }, GS = 1.5;
  const SKIN = hex('#e9b598'), SKIN_S = hex('#c58d7b');
  function taper(pts, w0, w1, fill) {   // filled tapered ribbon along a centreline
    const n = pts.length, Lft = [], Rgt = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / (n - 1));
      Lft.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]); Rgt.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]);
    }
    ctx.beginPath(); ctx.moveTo(Lft[0][0], Lft[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(Lft[i][0], Lft[i][1]); for (let i = n - 1; i >= 0; i--) ctx.lineTo(Rgt[i][0], Rgt[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function limb(x0, y0, x1, y1, w, c) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  function girl(lt, G) {
    const t = lt, w = G;
    ctx.save(); ctx.translate(GO.x, GO.y); ctx.scale(GS, GS); ctx.rotate(.02 + .01 * w); ctx.scale(1, 1 + .004 * Math.sin(t * 2.4));
    const skin = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba(SKIN_S)); g.addColorStop(1, rgba(SKIN)); return g; };
    // legs
    limb(-8, -96, -8, -4, 7.5, skin(-12, -3)); limb(9, -96, 12, -4, 7.5, skin(4, 14));
    // far (right) arm hanging, swaying
    const sw = Math.sin(t * 2.1) * 2 + w * 3;
    limb(21, -211, 29 + sw * .3, -179, 7.5, skin(18, 34)); limb(29 + sw * .3, -179, 34 + sw, -148, 6.5, skin(24, 40));
    ctx.fillStyle = rgba(SKIN); ctx.beginPath(); ctx.ellipse(35 + sw, -143, 4.5, 6, .2, 0, 7); ctx.fill();
    // skirt
    const hemN = 12, hemL = [-25 + 3 * w, -91], hemR = [50 + 24 * w + Math.sin(t * 5.3) * 3 * w, -101 - 13 * w + Math.sin(t * 7.1) * 3 * w];
    ctx.beginPath(); ctx.moveTo(-15, -160);
    ctx.bezierCurveTo(-20, -135, -26 + 2 * w, -112, hemL[0], hemL[1]);
    for (let i = 1; i <= hemN; i++) { const u = i / hemN, x = lerp(hemL[0], hemR[0], u), y = lerp(hemL[1], hemR[1], u) + Math.sin(u * 9 - t * 10) * 3.2 * w * (.3 + u) + Math.sin(u * 4 + t * 4) * 1.5; ctx.lineTo(x, y); }
    ctx.bezierCurveTo(hemR[0] - 8, hemR[1] - 18, 30 + 12 * w, -132, 16, -160); ctx.closePath();
    const dg = ctx.createLinearGradient(-30, 0, 60, 0); dg.addColorStop(0, '#b4c0da'); dg.addColorStop(.45, '#dde3ee'); dg.addColorStop(1, '#fbf6ec'); ctx.fillStyle = dg; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(120,135,175,.35)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let k = 0; k < 4; k++) { const u = (k + .7) / 4.5, fx = lerp(hemL[0], hemR[0], u), fy = lerp(hemL[1], hemR[1], u); ctx.beginPath(); ctx.moveTo(lerp(-12, 12, u), -156); ctx.quadraticCurveTo(lerp(-14, 20, u) + w * 6, -125, fx + Math.sin(t * 6 + k) * 3, fy); ctx.stroke(); }
    // thin translucent hem: legs faintly show through
    const tg = ctx.createLinearGradient(0, -110, 0, -88); tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, 'rgba(255,250,240,.35)'); ctx.fillStyle = tg; ctx.fillRect(-40, -115, 140, 40);
    ctx.restore();
    // bodice + sleeves
    ctx.beginPath(); ctx.moveTo(-15, -160); ctx.bezierCurveTo(-19, -180, -22, -200, -24, -213); ctx.quadraticCurveTo(0, -222, 24, -213); ctx.bezierCurveTo(22, -200, 19, -180, 16, -160); ctx.closePath();
    const bg = ctx.createLinearGradient(-25, 0, 25, 0); bg.addColorStop(0, '#b9c4dc'); bg.addColorStop(1, '#f6f2ea'); ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = 'rgba(120,135,175,.35)'; ctx.fillRect(-15, -164, 31, 4);   // waist seam
    ctx.fillStyle = '#c9d1e3'; ctx.beginPath(); ctx.ellipse(-23, -209, 8, 7, -.4, 0, 7); ctx.fill();
    ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.ellipse(23, -209, 8, 7, .4, 0, 7); ctx.fill();
    // neck + head
    limb(1, -216, 2, -236, 10, skin(-4, 8));
    ctx.fillStyle = '#3b2722'; ctx.beginPath(); ctx.ellipse(2, -255, 20, 22, 0, 0, 7); ctx.fill();
    // hair: main mass sweeping right
    const tipX = 46 + 48 * w + Math.sin(t * 4.7) * 6, tipY = -196 - 12 * w + Math.sin(t * 6.1) * 6;
    ctx.beginPath(); ctx.moveTo(-19, -262); ctx.bezierCurveTo(-21, -238, -17, -214, -10, -196);
    ctx.quadraticCurveTo(15 + 10 * w, -192, tipX, tipY); ctx.quadraticCurveTo(28 + 10 * w, -222, 21, -266); ctx.quadraticCurveTo(2, -282, -19, -262); ctx.closePath();
    const hg = ctx.createLinearGradient(-20, -270, 40, -200); hg.addColorStop(0, '#2c1d1a'); hg.addColorStop(1, '#4a2f25'); ctx.fillStyle = hg; ctx.fill();
    // flying locks
    for (let k = 0; k < 6; k++) {
      const pts = [], rx = 6 + k * 3, ry = -258 + k * 9, len = 52 + k * 9 + w * 40, ph = k * 1.3;
      for (let i = 0; i <= 10; i++) { const s = i / 10; pts.push([rx + s * len, ry + s * s * (10 + k * 3) - w * 10 * s + Math.sin(s * 5.5 - t * (9 + k) + ph) * s * (4 + 5 * w)]); }
      taper(pts, 3.2 - k * .2, .3, k % 2 ? '#3a2620' : '#4c3027');
    }
    // hair highlight (sunlit sheen on top of the sweep)
    ctx.strokeStyle = 'rgba(214,150,100,.55)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(14, -262); ctx.quadraticCurveTo(30 + 8 * w, -230, tipX - 6, tipY - 2); ctx.stroke();
    // raised (near) arm reaching for the hat — anticipation, overshoot, settle
    const rk = clamp(E.back(P(lt, .25, 1.05)) * 1);
    const el = [lerp(-28, -50, Math.pow(rk, .7)), lerp(-180, -244, rk)], hd = [lerp(-28, -35, rk), lerp(-148, -283, rk)];
    const hold = rk > .9 ? Math.sin(t * 9) * .8 * w : 0;
    limb(-21, -210, el[0], el[1], 8, skin(-60, -20)); limb(el[0], el[1], hd[0], hd[1] + hold, 7, skin(-55, -25));
    // hat brim (flutters on the lee side)
    const hc = [4, -277], fl = w * (.6 + .4 * Math.sin(t * 13)) * 7;
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283, ex = Math.cos(a) * 52, ey = Math.sin(a) * 13; const lift = ex > 0 ? Math.pow(ex / 52, 2) * fl : 0; const x = hc[0] + ex * Math.cos(-.1) - ey * Math.sin(-.1), y = hc[1] + ex * Math.sin(-.1) + ey * Math.cos(-.1) - lift; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); const sg = ctx.createLinearGradient(-50, -285, 50, -265); sg.addColorStop(0, '#c49f63'); sg.addColorStop(.6, '#ecd296'); sg.addColorStop(1, '#fbe9b8'); ctx.fillStyle = sg; ctx.fill();
    ctx.strokeStyle = 'rgba(120,90,50,.5)'; ctx.lineWidth = 1; ctx.stroke();
    // crown + red ribbon band
    ctx.beginPath(); ctx.ellipse(5, -282, 24, 17, -.1, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath();
    const cg = ctx.createLinearGradient(-20, -300, 30, -280); cg.addColorStop(0, '#cfab6c'); cg.addColorStop(1, '#f8e4ae'); ctx.fillStyle = cg; ctx.fill();
    ctx.fillStyle = '#c7443a'; ctx.beginPath(); ctx.ellipse(5, -283, 24.5, 5, -.1, 0, Math.PI); ctx.ellipse(5, -287, 24, 4, -.1, Math.PI, 0, true); ctx.fill();
    // ribbon tails: travelling wave + twist shading
    for (let k = 0; k < 2; k++) {
      const len = (k ? 82 : 104) * (1 + .4 * w), base = [27, -283 + k * 3], ph = k * 1.9, segs = 16;
      let prev = null;
      for (let i = 0; i <= segs; i++) {
        const s = i / segs, x = base[0] + s * len, y = base[1] + s * (18 - 14 * w) + Math.sin(s * 6.5 - t * 13 + ph) * s * (6 + 8 * w) + noise1(t * 2 + k * 5 + s * 2) * 4 * s;
        const tw = .3 + .7 * Math.abs(Math.cos(s * 4.5 - t * 9 + ph)), hw = 3.6 * tw * (1 - .35 * s);
        if (prev) { ctx.fillStyle = rgba(mix3(hex('#7e2621'), hex('#ee7a5f'), tw)); ctx.beginPath(); ctx.moveTo(prev[0], prev[1] - prev[2]); ctx.lineTo(x, y - hw); ctx.lineTo(x, y + hw); ctx.lineTo(prev[0], prev[1] + prev[2]); ctx.closePath(); ctx.fill(); }
        prev = [x, y, hw];
      }
    }
    // hand on the brim
    if (rk > .05) { ctx.fillStyle = rgba(mix3(SKIN_S, SKIN, .4)); ctx.beginPath(); ctx.ellipse(hd[0], hd[1] + hold, 5.5, 6.5, -.5, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  const rimC = mk(GW, GH), rimG = rimC.getContext('2d');
  function girlLayer(lt, G) {
    const gc = paint('ghibli_girl', () => {
      girl(lt, G);
      // unify lighting: cool shadow side, warm sun side, grass occlusion at the feet
      ctx.save(); ctx.globalCompositeOperation = 'source-atop';
      const lg = ctx.createLinearGradient(GO.x - 80, 0, GO.x + 120, 0); lg.addColorStop(0, 'rgba(60,80,140,.22)'); lg.addColorStop(1, 'rgba(255,220,170,.08)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, GW, GH);
      const ao = ctx.createLinearGradient(0, GO.y - 170, 0, GO.y); ao.addColorStop(0, 'rgba(40,70,40,0)'); ao.addColorStop(1, 'rgba(40,70,40,.55)'); ctx.fillStyle = ao; ctx.fillRect(0, GO.y - 170, GW, 200);
      ctx.restore();
    }, GW, GH);
    // rim light: silhouette minus a copy shifted away from the sun
    rimG.globalCompositeOperation = 'source-over'; rimG.clearRect(0, 0, GW, GH); rimG.drawImage(gc, 0, 0);
    rimG.globalCompositeOperation = 'source-in'; rimG.fillStyle = '#fff0cc'; rimG.fillRect(0, 0, GW, GH);
    rimG.globalCompositeOperation = 'destination-out'; rimG.drawImage(gc, -5, 5);
    return gc;
  }

  // ---- CAMERA -------------------------------------------------------------------------------------
  let CK = 0;
  function cam(depth, fn) {
    const k = CK, s = 1 + k * (.03 + .085 * depth), ax = 470, ay = 1180;
    ctx.save(); ctx.translate(ax - k * 55 * depth, ay + k * 70 * depth - k * 12); ctx.scale(s, s); ctx.translate(-ax, -ay); fn(); ctx.restore();
  }

  STYLES_REG.ghibli = {
    label: 'GAYA GHIBLI',
    cues: [[0.05, 'swell', 3.2], [1.0, 'shimmer']],
    draw(lt, t) {
      const u = clamp(lt / DUR); CK = .55 * u + .45 * E.sine(u);
      // wind gust envelope: breeze -> gust arrives ~0.9s -> eases
      const G = .5 + .5 * sstep(.6, 1.4, lt) - .12 * sstep(2.6, 3.4, lt);
      const D = lt + .9 * sstep(.6, 2.2, lt) * (lt - .6);   // gust-accelerated drift for particles
      ctx.save();
      bgFill('#cfe3ef');
      // sky + sun
      cam(0, () => {
        drawL(sky);
        glowBlob(SUN.x, SUN.y, 420, 'rgba(255,240,205,.55)', 1, 'screen');
        glowBlob(SUN.x, SUN.y, 70, 'rgba(255,255,248,1)', 1, 'source-over');
      });
      // horizon bank, hero cumulus (slow drift)
      cam(.06, () => { drawL(cloudB, { x: cloudB.x + lt * 9 }); });
      cam(.04, () => {
        drawL(cloudA, { x: cloudA.x + lt * 5 });
        comp(bloomA, { x: cloudA.x + lt * 5, y: cloudA.y, w: cloudA.w, hh: cloudA.hh, mode: 'screen', alpha: .45 });
        // birds far away, in front of the cloud
        ctx.save(); ctx.fillStyle = 'rgba(52,64,92,.85)'; ctx.strokeStyle = 'rgba(52,64,92,.85)'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < 5; i++) {
          const bx = 140 + i * 38 + h(i) * 30 + D * 42, by = 640 + h(i + 3) * 60 + Math.sin(lt * 1.3 + i) * 6 - i * 8, s = 5 + h(i + 7) * 3, fa = Math.sin(lt * 10 + i * 1.7);
          ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx - s * 1.6, by - fa * s * .8); ctx.quadraticCurveTo(bx - s * .6, by - s * .4 - fa * s * .3, bx, by); ctx.quadraticCurveTo(bx + s * .6, by - s * .4 - fa * s * .3, bx + s * 1.6, by - fa * s * .8); ctx.stroke();
        }
        ctx.restore();
      });
      // sun glare over cloud edges + god rays
      cam(0, () => {
        glowBlob(SUN.x, SUN.y, 130, 'rgba(255,252,236,.95)', 1, 'lighter');
        glowBlob(SUN.x, SUN.y, 320, 'rgba(255,226,170,.45)', 1, 'screen');
        ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .32 + .08 * noise1(lt * 1.3);
        ctx.translate(SUN.x, SUN.y); ctx.rotate(.015 * Math.sin(lt * .6)); ctx.translate(-SUN.x - 170, -SUN.y - 170);
        ctx.drawImage(shafts, 0, 0, 1400, 2000); ctx.restore();
        // anamorphic streak
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(SUN.x, SUN.y); ctx.scale(1, .025); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 520); sg.addColorStop(0, 'rgba(255,240,210,.5)'); sg.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = sg; ctx.fillRect(-520, -520, 1040, 1040); ctx.restore();
      });
      cam(.12, () => drawL(mtn));
      cam(.2, () => drawL(farH));
      // horizon glow (air light)
      cam(.15, () => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const hg = ctx.createLinearGradient(0, 1100, 0, 1300); hg.addColorStop(0, 'rgba(255,246,226,0)'); hg.addColorStop(.5, 'rgba(255,246,226,.35)'); hg.addColorStop(1, 'rgba(255,246,226,0)'); ctx.fillStyle = hg; ctx.fillRect(-200, 1100, 1500, 200); ctx.restore(); });
      cam(.38, () => {
        drawL(midH); drawL(trunk);
        const sa = .012 * Math.sin(lt * 1.7) + .018 * G * (.6 + .4 * Math.sin(lt * 3.1)), px = TB.x, py = TB.y - 150;
        ctx.save(); ctx.translate(px, py); ctx.rotate(sa); ctx.transform(1, 0, sa * .6, 1, 0, 0); ctx.translate(-px, -py); drawL(canopy); ctx.restore();
      });
      // near field
      cam(.72, () => {
        drawL(nearH);
        ctx.save(); ctx.clip(nearPath);
        // drifting cloud shadows
        for (let i = 0; i < 3; i++) { const cx = ((i * 520 + 160 + lt * 46) % 1560) - 200, cy = 1440 + i * 120; ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .22); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 340); g.addColorStop(0, 'rgba(40,70,110,.32)'); g.addColorStop(1, 'rgba(40,70,110,0)'); ctx.fillStyle = g; ctx.globalCompositeOperation = 'multiply'; ctx.fillRect(-340, -340, 680, 680); ctx.restore(); }
        drawBlades(0, lt, G); drawBlades(1, lt, G);
        // wind sheen bands moving across
        ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .55 * G; ctx.translate(lt * 327 - 30, 0); ctx.transform(1, 0, -.27, 1, 0, 0);
        ctx.fillStyle = SHEENPAT; ctx.fillRect(-1200, 1300, 3600, 520); ctx.restore();
        ctx.restore();
      });
      // the girl (with rim light + glow)
      const gc = girlLayer(lt, G);
      cam(.74, () => {
        const gx = FEET.x - GO.x, gy = FEET.y - GO.y;
        comp(gc, { x: gx, y: gy });
        comp(rimC, { x: gx, y: gy, alpha: .9 });
        comp(rimC, { x: gx, y: gy, alpha: .7, blur: 5, mode: 'lighter' });
      });
      cam(.76, () => { ctx.save(); ctx.clip(nearPath); drawBlades(2, lt, G); drawBlades(3, lt, G); drawBlades(4, lt, G); ctx.restore(); });
      // particles (petals & seeds) with depth
      for (const p of PARTS) {
        const sp = 70 + p.d * 300, x = ((p.x0 + D * sp) % 1400) - 160, y = p.y0 + Math.sin(lt * 1.6 + p.ph) * 30 * (.5 + p.d) - lt * 18 * p.d;
        const bi = p.d < .45 ? 0 : p.d < .8 ? 1 : 2, spr = (p.seed ? SB : PB)[bi], sz = 26 * p.sz * (bi ? 1.3 : 1);
        ctx.save(); ctx.globalAlpha = p.d < .2 ? .7 : .95; ctx.translate(x, y); ctx.rotate(p.ph + lt * p.spin); ctx.scale(p.seed ? 1 : Math.cos(lt * 4 + p.ph) * .8 + .2, 1);
        ctx.drawImage(spr, -sz / 2, -sz / 2, sz, sz); ctx.restore();
      }
      // foreground DOF grass
      cam(1.2, () => {
        const fg = paint('ghibli_fg', () => {
          ctx.translate(180, -1360);
          const mg = ctx.createLinearGradient(0, 1740, 0, 2100); mg.addColorStop(0, 'rgba(34,62,34,0)'); mg.addColorStop(.25, '#22402a'); mg.addColorStop(1, '#10200f');
          ctx.fillStyle = mg; ctx.beginPath(); ctx.moveTo(-180, 2120); for (let x = -180; x <= 1280; x += 20) ctx.lineTo(x, 1800 + Math.sin(x * .01) * 20 + (x > 700 ? -(x - 700) * .12 : 0)); ctx.lineTo(1280, 2120); ctx.fill();
          for (const b of FG) {
            const sw = .5 + .5 * Math.sin(b.x * .008 - lt * 3.4), bend = .1 + b.lean * .4 + G * (.32 * sw + .1 * noise1(lt * 1.5 + b.ph)), sb = Math.sin(bend), cb = Math.cos(bend);
            const tx = b.x + b.L * sb, ty = b.y - b.L * cb, mx = b.x + b.L * .25 * sb, my = b.y - b.L * .6;
            ctx.fillStyle = FGC[(b.c * 4) | 0]; ctx.beginPath(); ctx.moveTo(b.x - b.w, b.y); ctx.quadraticCurveTo(mx - b.w * .5, my, tx, ty); ctx.quadraticCurveTo(mx + b.w * .5, my, b.x + b.w, b.y); ctx.fill();
            ctx.strokeStyle = 'rgba(190,210,110,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x + b.w * .6, b.y - b.L * .2); ctx.quadraticCurveTo(mx + b.w * .5, my, tx, ty); ctx.stroke();
            if (b.seed) { ctx.fillStyle = 'rgba(214,200,140,.9)'; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.ellipse(tx - sb * k * 9 + Math.sin(k) * 4, ty + cb * k * 9, 4, 9, bend + .3 * Math.sin(k * 2), 0, 7); ctx.fill(); } }
          }
        }, 1460, 780);
        comp(fg, { x: -180, y: 1360, blur: 7 });
      });
      // grade: warm light from the sun side, cool depth at the bottom, painted canvas texture
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light'; const wg = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 1500); wg.addColorStop(0, 'rgba(255,190,110,.55)'); wg.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = wg; ctx.fillRect(-100, -100, W + 200, H + 200);
      ctx.globalCompositeOperation = 'multiply'; const bgr = ctx.createLinearGradient(0, 1400, 0, H); bgr.addColorStop(0, 'rgba(70,100,130,0)'); bgr.addColorStop(1, 'rgba(70,100,130,.25)'); ctx.fillStyle = bgr; ctx.fillRect(-100, 1400, W + 200, 620);
      ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .22; ctx.drawImage(CANVAS, 0, 0);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .12; ctx.drawImage(PAPER, 0, 0);
      ctx.restore();
      // subtitle
      const sa = E.sine(P(lt, .5, 1.1));
      if (sa > 0) subtitle('Musim panas itu… semuanya berubah.', 1592 - 6 * (1 - sa), sa, { size: 48, shadow: { c: 'rgba(10,30,20,.55)', x: 0, y: 3 }, glow: 'rgba(0,20,10,.35)', gb: 18 });
      ctx.restore();
    },
  };
})();
