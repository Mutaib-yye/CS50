// SHOWCASE STYLE: history — "Majapahit, 1293".
// 0.0–1.0 s: an aged portolan-style map of Java; a red ink route carries a tiny ink jong east while the camera dives
//            onto it, then ink bleeds outward from the ship and the live world appears inside it (match cut).
// 1.0–3.4 s: low camera skimming a dawn sea: a fleet of jong with tanja sails and red-white banners, backlit by a
//            low sun through cloud banks and god rays, a hazy coastline with a candi and volcanoes, mist, birds.
// Title: small caps "MAJAPAHIT" + Playfair "1293" with a light sweep; one cinema subtitle line.
(() => {
  const R = mulberry(1293);
  const YH = 1040;                 // horizon (sea coords)
  const SUN = { x: 300, y: 1004 };  // low dawn sun
  const FOCUS = { x: 560, y: 950 }; // camera / match-cut point (hero jong)
  const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const rgba = (c, a = 1) => { const v = hex(c); return `rgba(${v[0]},${v[1]},${v[2]},${a})`; };
  // piecewise colour ramp: stops [[u, '#hex'], ...]
  function ramp(stops, u) {
    if (u <= stops[0][0]) return hex(stops[0][1]);
    for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) {
      const k = (u - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]), a = hex(stops[i - 1][1]), b = hex(stops[i][1]);
      return a.map((v, j) => v + (b[j] - v) * k);
    }
    return hex(stops[stops.length - 1][1]);
  }
  const css = (v, a = 1) => `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${a})`;

  // =====================================================================
  //  PRE-RENDERED ART (load time)
  // =====================================================================
  // ---------- sky
  const SKY = mk(W + 400, YH + 60);
  on(SKY.getContext('2d'), () => {
    ctx.translate(200, 0);
    const g = ctx.createLinearGradient(0, 0, 0, YH + 60);
    [[0, '#081925'], [.22, '#12303f'], [.45, '#2f4655'], [.62, '#6b5f6a'], [.78, '#b77a64'], [.9, '#eaa56c'], [.97, '#ffd49a'], [1, '#ffe2b0']].forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g; ctx.fillRect(-200, 0, W + 400, YH + 60);
    glowBlob(SUN.x, SUN.y, 900, 'rgba(255,170,95,0.55)', 1, 'lighter');
    glowBlob(SUN.x, SUN.y, 380, 'rgba(255,214,150,0.6)', 1, 'lighter');
    // faint stars high up, fading into dawn
    for (let i = 0; i < 90; i++) { const y = R() * 420, a = (1 - y / 420) * (.15 + R() * .4); ctx.fillStyle = `rgba(220,235,255,${a})`; ctx.fillRect(-200 + R() * (W + 400), y, 1.6, 1.6); }
  });

  // ---------- clouds (fbm, underside lit by the low sun)
  function cloudLayer(w, hh, sx0, sy0, scale, opts) {
    const lw = Math.ceil(w / scale), lh = Math.ceil(hh / scale);
    const lo = mk(lw, lh), lg = lo.getContext('2d'), id = lg.createImageData(lw, lh);
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const sx = sx0 + x * scale, sy = sy0 + y * scale;
      const dens = (px, py) => {
        const wx = fbm2(px * .003 + 7, py * .006, 3) * opts.warp;
        return fbm2(px * opts.fx + wx, py * opts.fy + opts.seed, 5);
      };
      const d = dens(sx, sy), d2 = dens(sx, sy + opts.lit);
      const band = opts.band(sy);
      const a = smooth(opts.th0, opts.th1, d) * band;
      if (a <= 0.003) continue;
      const sunK = Math.exp(-Math.pow((sx - SUN.x) / opts.sunW, 2)) * Math.exp(-Math.pow((sy - SUN.y) / (opts.sunW * 1.3), 2));
      const lit = clamp((d - d2) * opts.litK + .25 + sunK * .6);
      const base = ramp(opts.shade, clamp(1 - (sy - sy0) / hh * .0 + 0)), litc = ramp([[0, opts.litCol], [1, '#fff2cf']], sunK);
      const c = base.map((v, j) => v + (litc[j] - v) * lit);
      const i4 = (y * lw + x) * 4; id.data[i4] = c[0]; id.data[i4 + 1] = c[1]; id.data[i4 + 2] = c[2]; id.data[i4 + 3] = clamp(a * opts.alpha) * 255;
    }
    lg.putImageData(id, 0, 0);
    const out = mk(w, hh), og = out.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(lo, 0, 0, w, hh);
    return out;
  }
  const CLOUD_HI = cloudLayer(W + 400, 760, -200, 0, 4, {
    fx: .0024, fy: .014, warp: 1.6, seed: 3.3, lit: 14, litK: 5, th0: .02, th1: .42, alpha: .9, sunW: 520,
    band: y => smooth(60, 260, y) * (1 - smooth(560, 740, y)),
    shade: [[0, '#2e3f55'], [1, '#2e3f55']], litCol: '#e0937a',
  });
  const CLOUD_LO = cloudLayer(W + 400, 360, -200, 720, 3, {
    fx: .0032, fy: .03, warp: 1.2, seed: 9.1, lit: 8, litK: 7, th0: .0, th1: .3, alpha: .95, sunW: 260,
    band: y => smooth(740, 860, y) * (1 - smooth(980, 1040, y)),
    shade: [[0, '#4a3646'], [1, '#4a3646']], litCol: '#ffb15e',
  });

  // ---------- god rays fan from the sun
  const RAYS = mk(W + 400, YH + 60);
  {
    const tmp = mk(W + 400, YH + 60);
    on(tmp.getContext('2d'), () => {
      ctx.translate(200, 0);
      for (let i = 0; i < 46; i++) {
        const a = -Math.PI * (.06 + .88 * R()), w = .008 + .03 * R(), al = .05 + .16 * R();
        const g = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 1500);
        g.addColorStop(0, `rgba(255,214,160,${al})`); g.addColorStop(.5, `rgba(255,190,140,${al * .45})`); g.addColorStop(1, 'rgba(255,190,140,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(SUN.x, SUN.y);
        ctx.lineTo(SUN.x + Math.cos(a - w) * 1800, SUN.y + Math.sin(a - w) * 1800); ctx.lineTo(SUN.x + Math.cos(a + w) * 1800, SUN.y + Math.sin(a + w) * 1800); ctx.fill();
      }
    });
    const rg = RAYS.getContext('2d'); rg.filter = 'blur(5px)'; rg.drawImage(tmp, 0, 0);
  }

  // ---------- distant coast: volcanoes, ridge, candi, gate, palms (hazy silhouettes)
  function candi(x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
    ctx.rect(-40, -12, 80, 12); ctx.rect(-32, -22, 64, 10);          // terraces
    ctx.rect(-22, -70, 44, 48);                                       // body
    const tiers = [[-27, -70, 54, 8], [-23, -84, 46, 14], [-19, -96, 38, 12], [-15, -107, 30, 11], [-11, -117, 22, 10], [-7, -126, 14, 9]];
    for (const [tx, ty, tw, th] of tiers) ctx.rect(tx, ty - th + 8, tw, th);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, -126); ctx.lineTo(0, -146); ctx.lineTo(4, -126); ctx.fill();
    for (const [tx, ty] of [[-25, -76], [21, -76], [-21, -90], [17, -90], [-17, -102], [13, -102]]) { ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + 2, ty - 9); ctx.lineTo(tx + 4, ty); ctx.fill(); }
    ctx.restore();
  }
  function gate(x, y, s, col) { // candi bentar (split gate)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sg * 8, 0);
      const steps = [[8, -40], [10, -40], [10, -52], [12, -52], [12, -62], [13, -72], [13, -86]];
      for (const [px, py] of steps) ctx.lineTo(sg * px, py);
      ctx.lineTo(sg * 15, -92); ctx.lineTo(sg * 22, -70); ctx.lineTo(sg * 26, -50); ctx.lineTo(sg * 32, -30); ctx.lineTo(sg * 38, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function palm(x, y, hgt, lean, col, seed) {
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round';
    const tx = x + lean * hgt, ty = y - hgt;
    ctx.lineWidth = Math.max(1.2, hgt * .045); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * hgt * .2, y - hgt * .6, tx, ty); ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * .48 + (h(seed + i) - .5) * .3, L = hgt * (.38 + h(seed * 3 + i) * .14);
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .55 + L * .32;
      ctx.lineWidth = Math.max(1, hgt * .03); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * .6, ty + Math.sin(a) * L * .6 - L * .12, ex, ey); ctx.stroke();
    }
    ctx.restore();
  }
  const COAST = mk(W + 400, YH + 20);
  on(COAST.getContext('2d'), () => {
    ctx.translate(200, 0);
    // volcano cones far away (very faint)
    const vol = (cx, hgt, hw, col) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - hw * 1.4, YH + 2);
      for (let x = -hw * 1.4; x <= hw * 1.4; x += 4) { const k = Math.abs(x) / hw; const y = YH - hgt * Math.pow(Math.max(0, 1 - k * .82), 1.9) + fbm2(x * .02, cx) * 4 - (Math.abs(x) < hw * .05 ? -4 : 0); ctx.lineTo(cx + x, y); }
      ctx.lineTo(cx + hw * 1.4, YH + 2); ctx.fill();
    };
    vol(860, 250, 420, 'rgba(150,118,132,0.42)');
    vol(1140, 190, 330, 'rgba(150,118,132,0.36)');
    vol(-120, 120, 260, 'rgba(160,120,120,0.3)');
    // ridge
    ctx.fillStyle = 'rgba(112,86,104,0.85)'; ctx.beginPath(); ctx.moveTo(420, YH + 2);
    for (let x = 420; x <= 1290; x += 4) ctx.lineTo(x, YH - 6 - 34 * smooth(420, 560, x) * (.55 + .45 * fbm2(x * .006, 2.2)) - 8 * fbm2(x * .03, 5));
    ctx.lineTo(1290, YH + 2); ctx.fill();
    // near coast strip + monuments + palms
    const cc = 'rgba(70,50,66,0.95)';
    ctx.fillStyle = cc; ctx.beginPath(); ctx.moveTo(560, YH + 2);
    for (let x = 560; x <= 1290; x += 4) ctx.lineTo(x, YH - 4 - 12 * smooth(560, 640, x) * (.6 + .4 * fbm2(x * .01, 8)));
    ctx.lineTo(1290, YH + 2); ctx.fill();
    candi(900, YH - 12, .78, cc);
    gate(790, YH - 10, .55, cc);
    for (const [px, ph, pl] of [[640, 38, .15], [668, 52, -.1], [712, 44, .2], [838, 60, -.18], [960, 48, .12], [1000, 62, -.08], [1060, 40, .2], [1120, 54, -.15], [1190, 46, .1]]) palm(px, YH - 8, ph, pl, cc, px);
    // left headland (behind the sun line)
    ctx.fillStyle = 'rgba(92,62,70,0.9)'; ctx.beginPath(); ctx.moveTo(-200, YH + 2);
    for (let x = -200; x <= 170; x += 4) ctx.lineTo(x, YH - 4 - 22 * (1 - smooth(60, 170, x)) * (.6 + .4 * fbm2(x * .012, 3)));
    ctx.lineTo(170, YH + 2); ctx.fill();
    for (const [px, ph, pl] of [[-120, 40, .1], [-60, 54, -.12], [10, 46, .18], [60, 36, -.1]]) palm(px, YH - 10, ph, pl, 'rgba(92,62,70,0.9)', px);
  });

  // ---------- mist
  function mistLayer(w, hh, seed, col, a) {
    const s = 4, lw = w / s, lh = hh / s, lo = mk(lw, lh), lg = lo.getContext('2d'), id = lg.createImageData(lw, lh); const c = hex(col);
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const v = fbm2(x * .018 + seed, y * .09, 4), vy = Math.sin(Math.PI * y / lh);
      const al = smooth(-.15, .45, v) * vy * vy * a; const i4 = (y * lw + x) * 4;
      id.data[i4] = c[0]; id.data[i4 + 1] = c[1]; id.data[i4 + 2] = c[2]; id.data[i4 + 3] = al * 255;
    }
    lg.putImageData(id, 0, 0); const out = mk(w, hh); out.getContext('2d').drawImage(lo, 0, 0, w, hh); return out;
  }
  const MIST_FAR = mistLayer(2400, 240, 1.7, '#ffd3a8', .75);
  const MIST_NEAR = mistLayer(2400, 420, 5.3, '#cfe0e0', .35);

  // ---------- sea base (behind the wave rows)
  const SEA = mk(W + 400, H - YH + 300);
  on(SEA.getContext('2d'), () => {
    ctx.translate(200, -YH);
    bgGrad([[0, '#f0b07e'], [.04, '#a07a7a'], [.16, '#3d5462'], [.45, '#123341'], [1, '#05151c']], YH, H + 200);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(SUN.x, YH, 0, SUN.x, YH, 700); g.addColorStop(0, 'rgba(255,190,110,0.55)'); g.addColorStop(1, 'rgba(255,150,80,0)');
    ctx.fillStyle = g; ctx.save(); ctx.translate(SUN.x, YH); ctx.scale(.55, 1.2); ctx.translate(-SUN.x, -YH); ctx.fillRect(-500, YH, 2200, 1200); ctx.restore();
    ctx.restore();
  });

  // ---------- parchment map (1.5x for the dive)
  const MS = 1.5;
  const MAP = mk(W * MS, H * MS);
  const INK = '#3a2213', RED = '#9c2a1c';
  const javaTop = x => 1100 + (x - 500) * .05 - (70 + 22 * Math.sin(x * .011 + 1)) * Math.pow(clamp((960 - x) / 140), .55) + 20 * fbm2(x * .011, 1.3) + 6 * fbm2(x * .06, 3.1);
  const javaBot = x => 1100 + (x - 500) * .05 + (78 + 18 * Math.sin(x * .009)) * Math.pow(clamp((960 - x) / 140), .55) + 16 * fbm2(x * .012, 7.7) + 5 * fbm2(x * .07, 9.9);
  const ROUTE = [[-60, 925], [90, 958], [230, 948], [360, 915], [470, 930], [570, 962], [640, 975]];
  function islandPath(cx, cy, rx, ry, seed) {
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, r = 1 + .28 * fbm2(Math.cos(a) * 1.4 + seed, Math.sin(a) * 1.4 + seed, 4); const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath();
  }
  function landPaths() {
    const paths = [];
    paths.push(() => { ctx.beginPath(); ctx.moveTo(-160, javaTop(-160)); for (let x = -160; x <= 962; x += 3) ctx.lineTo(x, javaTop(x)); for (let x = 962; x >= -160; x -= 3) ctx.lineTo(x, javaBot(x)); ctx.closePath(); });
    paths.push(() => { ctx.beginPath(); ctx.moveTo(-160, -160); for (let x = -160; x <= 1240; x += 3) ctx.lineTo(x, 330 + 70 * Math.sin(x * .004 + 1.2) + 50 * fbm2(x * .008, 4.4) + 14 * fbm2(x * .05, 2) - 90 * Math.exp(-Math.pow((x - 520) / 90, 2))); ctx.lineTo(1240, -160); ctx.closePath(); });
    paths.push(() => islandPath(770, 978, 125, 24, 2.2));    // Madura
    paths.push(() => islandPath(1035, 1150, 48, 34, 5.5));   // Bali
    paths.push(() => islandPath(425, 780, 22, 10, 8.1));
    paths.push(() => islandPath(462, 798, 12, 7, 3.7));
    paths.push(() => islandPath(650, 640, 26, 20, 6.6));     // Bawean
    paths.push(() => islandPath(140, 1500, 60, 22, 1.1));
    return paths;
  }
  on(MAP.getContext('2d'), () => {
    ctx.scale(MS, MS);
    ctx.drawImage(PAPER, 0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#dcb47c'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { const x = R() * W, y = R() * H, r = 80 + R() * 260; glowBlob(x, y, r, `rgba(150,100,45,${.12 + R() * .18})`, 1, 'multiply'); }
    ctx.restore();
    // portolan rhumb lines
    ctx.save(); ctx.lineWidth = 1.2;
    for (const [cx, cy] of [[860, 560], [180, 1380]]) for (let i = 0; i < 32; i++) {
      const a = i * Math.PI / 16; ctx.strokeStyle = i % 4 === 0 ? 'rgba(156,42,28,0.30)' : i % 2 ? 'rgba(58,34,19,0.13)' : 'rgba(70,90,60,0.2)';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 2400, cy + Math.sin(a) * 2400); ctx.stroke();
    }
    ctx.restore();
    const paths = landPaths();
    // coastal ripple lines (old-map water lines) via a ring layer
    const ring = mk(W, H);
    on(ring.getContext('2d'), () => {
      for (let k = 5; k >= 1; k--) {
        for (const p of paths) { p(); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = `rgba(58,34,19,${.36 - k * .05})`; ctx.lineWidth = k * 15; ctx.lineJoin = 'round'; ctx.stroke(); }
        for (const p of paths) { p(); ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = k * 15 - 2.4; ctx.strokeStyle = '#000'; ctx.stroke(); }
      }
    });
    ctx.drawImage(ring, 0, 0);
    // land fill + hachures + coast ink
    for (const p of paths) {
      p(); ctx.save(); ctx.fillStyle = 'rgba(176,128,66,0.42)'; ctx.fill(); ctx.clip();
      ctx.strokeStyle = 'rgba(58,34,19,0.16)'; ctx.lineWidth = 1.4;
      for (let x = -200; x < 1300; x += 9) { ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x + 900, 2100); ctx.stroke(); }
      ctx.restore();
      p(); ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.stroke();
    }
    // volcano glyphs along Java
    for (const [x, s] of [[30, .8], [150, 1], [300, .9], [430, 1.1], [560, 1], [690, 1.2], [820, .9], [905, .8]]) {
      const y = (javaTop(x) + javaBot(x)) / 2 + 8; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(120,70,30,0.35)'; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-4, -22); ctx.lineTo(4, -22); ctx.lineTo(26, 10); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-4, -22); ctx.lineTo(4, -22); ctx.lineTo(26, 10); ctx.stroke();
      ctx.lineWidth = 1.2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(4 + k * 3, -18 + k * 5); ctx.lineTo(10 + k * 3, 8); ctx.stroke(); }
      ctx.restore();
    }
    // Majapahit seat: temple glyph + label
    ctx.save(); ctx.translate(705, 1112); ctx.fillStyle = RED; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.lineTo(12, -10); ctx.lineTo(8, -10); ctx.lineTo(6, -24); ctx.lineTo(3, -24); ctx.lineTo(0, -36); ctx.lineTo(-3, -24); ctx.lineTo(-6, -24); ctx.lineTo(-8, -10); ctx.lineTo(-12, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    T('Majapahit', 705, 1142, { size: 30, font: 'Playfair', weight: 'italic 700', color: INK });
    T('J A W A', 330, 1112, { size: 44, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.8)' });
    T('Laut Jawa', 300, 760, { size: 34, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.65)', rot: -.04 });
    T('Samudra Hindia', 560, 1560, { size: 40, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.6)', ls: 4 });
    T('Madura', 790, 935, { size: 24, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.75)' });
    // compass rose
    ctx.save(); ctx.translate(860, 560);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 96, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 88, 0, 7); ctx.stroke();
    for (let i = 0; i < 64; i++) { const a = i * Math.PI / 32; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 88, Math.sin(a) * 88); ctx.lineTo(Math.cos(a) * (i % 4 ? 92 : 96), Math.sin(a) * (i % 4 ? 92 : 96)); ctx.stroke(); }
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8 - Math.PI / 2, L = i % 4 === 0 ? 120 : i % 2 ? 52 : 80, w = i % 4 === 0 ? 14 : 8;
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); ctx.lineTo(Math.cos(a + sd * Math.PI / 2) * w, Math.sin(a + sd * Math.PI / 2) * w); ctx.closePath();
        ctx.fillStyle = sd > 0 ? (i % 4 === 0 ? RED : '#c79a52') : (i % 4 === 0 ? '#5a1810' : INK); ctx.fill(); ctx.stroke();
      }
    }
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fillStyle = '#e8cf98'; ctx.fill(); ctx.stroke();
    ctx.restore();
    T('U', 860, 418, { size: 34, font: 'Playfair', weight: 700, color: INK });
    // sea hatch waves
    ctx.strokeStyle = 'rgba(58,34,19,0.35)'; ctx.lineWidth = 1.6;
    for (let i = 0; i < 26; i++) {
      const x = 80 + R() * 920, y = 480 + R() * 1250; if (y > 820 && y < 1260) continue;
      ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(x + k * 18, y); ctx.quadraticCurveTo(x + k * 18 + 5, y - 6, x + k * 18 + 10, y); } ctx.stroke();
    }
    // burnt / darkened edges
    const eg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1200); eg.addColorStop(0, 'rgba(70,35,10,0)'); eg.addColorStop(1, 'rgba(50,22,6,0.72)');
    ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);
  });

  // =====================================================================
  //  SHIPS
  // =====================================================================
  // jong facing right. local units: hero scale (hull ~650 long), origin at waterline centre.
  const MASTS = [[-175, 430], [-35, 520], [105, 470]];
  function hullPath() {
    ctx.beginPath();
    ctx.moveTo(-300, -168);
    ctx.quadraticCurveTo(-245, -96, -120, -80);
    ctx.quadraticCurveTo(110, -66, 250, -100);
    ctx.quadraticCurveTo(300, -114, 338, -146);
    ctx.lineTo(334, -128);
    ctx.quadraticCurveTo(306, -40, 236, 24);
    ctx.lineTo(-226, 34);
    ctx.quadraticCurveTo(-292, 12, -312, -62);
    ctx.quadraticCurveTo(-322, -122, -300, -168);
    ctx.closePath();
  }
  function sheer(dy) { ctx.beginPath(); ctx.moveTo(-300, -168 + dy); ctx.quadraticCurveTo(-245, -96 + dy, -120, -80 + dy); ctx.quadraticCurveTo(110, -66 + dy, 250, -100 + dy); ctx.quadraticCurveTo(300, -114 + dy, 336, -144 + dy); }
  // tanja sail as a canted quad on a mast; returns nothing. sun = local sun pos for backlight gradient
  function sail(mx, mh, sc, t, seed, sunL, detail) {
    const w = mh * .62, sh = mh * .72, base = 92;
    const lean = .3, rise = .2;
    const P = (u, v) => [mx + u * w + v * sh * lean, -(base + v * sh + (u + .35) * w * rise)];
    const fl = noise1(t * 1.3 + seed) * .5 + .5;
    const belly = w * (.07 + .03 * fl);
    const q = [P(-.32, 1), P(.68, 1), P(.68, 0), P(-.32, 0)];
    const g = ctx.createRadialGradient(sunL.x, sunL.y, 0, sunL.x, sunL.y, 900 / sc * .0 + 1000);
    g.addColorStop(0, '#ffe2a0'); g.addColorStop(.28, '#f2a456'); g.addColorStop(.55, '#a65a2c'); g.addColorStop(.8, '#5a2a18'); g.addColorStop(1, '#2e140c');
    const front = (k) => { const a = q[1], b = q[2]; return [lerp(a[0], b[0], k) + Math.sin(k * Math.PI) * belly, lerp(a[1], b[1], k)]; };
    const back = (k) => { const a = q[0], b = q[3]; return [lerp(a[0], b[0], k) + Math.sin(k * Math.PI) * belly * .35, lerp(a[1], b[1], k)]; };
    ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]);
    for (let k = .1; k <= 1.001; k += .1) ctx.lineTo(...front(k));
    ctx.lineTo(...q[3]);
    for (let k = .9; k >= -.001; k -= .1) ctx.lineTo(...back(k));
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    if (detail) {
      ctx.save(); ctx.clip();
      // woven mat stripes (parallel to spars)
      ctx.strokeStyle = 'rgba(60,24,10,0.28)'; ctx.lineWidth = 1.6 / sc;
      for (let k = .06; k < 1; k += .06) { const a = back(k), b = front(k); ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + belly * .5, (a[1] + b[1]) / 2, ...b); ctx.stroke(); }
      // bamboo battens
      ctx.strokeStyle = 'rgba(40,16,8,0.55)'; ctx.lineWidth = 3 / sc;
      for (let u = 0; u <= 1.001; u += .2) { const a = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)], b = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)]; ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + belly * (.4 + u * .6), (a[1] + b[1]) / 2, ...b); ctx.stroke(); }
      // translucent hot spot
      ctx.globalCompositeOperation = 'lighter';
      const hg = ctx.createRadialGradient(sunL.x, sunL.y, 0, sunL.x, sunL.y, 520); hg.addColorStop(0, 'rgba(255,200,120,0.35)'); hg.addColorStop(1, 'rgba(255,160,80,0)');
      ctx.fillStyle = hg; ctx.fillRect(-600, -1000, 1400, 1200);
      ctx.restore();
    }
    // spars
    ctx.strokeStyle = '#1c0f09'; ctx.lineCap = 'round';
    ctx.lineWidth = 5 / Math.sqrt(sc); ctx.beginPath(); ctx.moveTo(...P(-.38, 1)); ctx.lineTo(...P(.74, 1)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...P(-.38, 0)); ctx.lineTo(...P(.74, 0)); ctx.stroke();
    // rim light on top spar & back edge
    ctx.strokeStyle = 'rgba(255,214,150,0.85)'; ctx.lineWidth = 1.8 / sc;
    ctx.beginPath(); ctx.moveTo(...q[0]); for (let k = .1; k <= 1.001; k += .1) ctx.lineTo(...back(k)); ctx.stroke();
  }
  function pennant(x, y, len, wid, t, seed, sc, dir = 1) {
    const n = 14, top = [], bot = [], mid = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n, px = x + dir * k * len, amp = (2 + k * len * .16), ph = k * 6 - t * 9 + seed;
      const py = y + Math.sin(ph) * amp + noise1(t * 2 + seed + k) * len * .06 * k + k * len * .12;
      const ww = wid * (1 - k * .8);
      top.push([px, py - ww / 2]); bot.push([px, py + ww / 2]); mid.push([px, py, Math.cos(ph)]);
    }
    ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); for (let i = n; i >= 0; i--) ctx.lineTo(mid[i][0], mid[i][1]); ctx.closePath(); ctx.fillStyle = '#d02a1e'; ctx.fill();
    ctx.beginPath(); mid.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = n; i >= 0; i--) ctx.lineTo(...bot[i]); ctx.closePath(); ctx.fillStyle = '#f4e9da'; ctx.fill();
    // fold shading
    ctx.save(); ctx.globalAlpha *= .35; ctx.strokeStyle = '#3a0c06'; ctx.lineWidth = wid * .9;
    for (let i = 1; i < n; i++) if (mid[i][2] < -.3) { ctx.beginPath(); ctx.moveTo(mid[i - 1][0], mid[i - 1][1]); ctx.lineTo(mid[i][0], mid[i][1]); ctx.stroke(); }
    ctx.restore();
  }
  function umbul(x, y, hgt, t, sc) { // tall curved stern pole with a long red-white banner
    const pts = []; for (let i = 0; i <= 16; i++) { const k = i / 16; pts.push([x - 30 * k * k + Math.sin(t * 1.4) * 4 * k, y - hgt * k]); }
    ctx.strokeStyle = '#1c0f09'; ctx.lineWidth = 3.5 / Math.sqrt(sc); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
    const n = 16, L = []; for (let i = 0; i <= n; i++) { const k = i / n, p = pts[Math.round(4 + k * 12)]; const off = 8 + k * 40; const wv = Math.sin(k * 7 - t * 7) * (3 + k * 10); L.push([p[0] + off + wv * .2, p[1] + 10 + k * 18 + wv, k]); }
    for (const [c, a, b] of [['#d02a1e', 0, .5], ['#f4e9da', .5, 1]]) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const p = pts[Math.round(4 + (i / n) * 12)]; const q = L[i]; const ax = lerp(p[0], q[0], a), ay = lerp(p[1], q[1], a); i ? ctx.lineTo(ax, ay) : ctx.moveTo(ax, ay); }
      for (let i = n; i >= 0; i--) { const p = pts[Math.round(4 + (i / n) * 12)]; const q = L[i]; ctx.lineTo(lerp(p[0], q[0], b), lerp(p[1], q[1], b)); }
      ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    }
  }
  function crew(x, y, s) { ctx.fillStyle = '#140b07'; ctx.beginPath(); ctx.arc(x, y - 30 * s, 5.5 * s, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 5 * s, y - 24 * s); ctx.lineTo(x + 5 * s, y - 24 * s); ctx.lineTo(x + 7 * s, y); ctx.fill(); }

  // draw a jong. x,y = waterline centre in sea coords. s = scale. haze 0..1 toward horizon colour.
  function jong(x, y, s, rot, t, seed, detail) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    // local sun position for backlit gradients
    const dx = (SUN.x - x) / s, dy = (SUN.y - y) / s, cr = Math.cos(-rot), sr = Math.sin(-rot);
    const sunL = { x: dx * cr - dy * sr, y: dx * sr + dy * cr };
    // rigging behind
    ctx.strokeStyle = 'rgba(25,14,9,0.75)'; ctx.lineWidth = 1.4 / s;
    for (const [mx, mh] of MASTS) { ctx.beginPath(); ctx.moveTo(mx, -mh); ctx.lineTo(-290, -170); ctx.moveTo(mx, -mh); ctx.lineTo(330, -140); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(105, -470); ctx.lineTo(430, -186); ctx.stroke();
    // umbul-umbul at stern
    umbul(-300, -172, 330, t + seed, s);
    // masts + sails (back to front)
    MASTS.forEach(([mx, mh], i) => {
      ctx.strokeStyle = '#1c0f09'; ctx.lineWidth = 7 / Math.sqrt(s);
      ctx.beginPath(); ctx.moveTo(mx - 9, -80); ctx.lineTo(mx, -mh - 10); ctx.lineTo(mx + 9, -80); ctx.stroke();
      sail(mx, mh, s, t, seed + i * 3.1, sunL, detail);
      pennant(mx, -mh - 8, 150, 18, t, seed + i * 1.7, s);
    });
    // bowsprit + foresail
    ctx.strokeStyle = '#1c0f09'; ctx.lineWidth = 5 / Math.sqrt(s); ctx.beginPath(); ctx.moveTo(280, -118); ctx.lineTo(440, -188); ctx.stroke();
    {
      const fl = noise1(t * 1.5 + seed + 9) * 8;
      const g = ctx.createRadialGradient(sunL.x, sunL.y, 0, sunL.x, sunL.y, 1000); g.addColorStop(0, '#ffe2a0'); g.addColorStop(.3, '#f2a456'); g.addColorStop(.6, '#9a5028'); g.addColorStop(1, '#2e140c');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(300, -300); ctx.lineTo(408, -246); ctx.quadraticCurveTo(440 + fl, -205, 420, -176); ctx.lineTo(300, -130); ctx.quadraticCurveTo(318, -220, 300, -300); ctx.fill();
      ctx.strokeStyle = '#1c0f09'; ctx.lineWidth = 3.5 / Math.sqrt(s); ctx.beginPath(); ctx.moveTo(296, -304); ctx.lineTo(412, -244); ctx.stroke();
    }
    // hull
    hullPath();
    const hg = ctx.createLinearGradient(0, -170, 0, 40); hg.addColorStop(0, '#3c2519'); hg.addColorStop(.5, '#22140d'); hg.addColorStop(1, '#0d0806');
    ctx.fillStyle = hg; ctx.fill();
    if (detail) {
      ctx.save(); hullPath(); ctx.clip();
      ctx.strokeStyle = 'rgba(120,80,50,0.25)'; ctx.lineWidth = 2; for (const dy of [26, 44, 62, 82, 104]) { sheer(dy); ctx.stroke(); }
      ctx.strokeStyle = '#7a2216'; ctx.lineWidth = 10; sheer(12); ctx.stroke();
      ctx.fillStyle = 'rgba(240,200,120,0.75)'; for (let k = -280; k < 320; k += 22) { const yy = k < -120 ? lerp(-150, -68, (k + 280) / 160) : k < 250 ? -68 + (k + 120) * (-.02) - Math.pow((k - 60) / 260, 2) * 6 + 4 : -96; ctx.beginPath(); ctx.arc(k, yy, 2.2, 0, 7); ctx.fill(); }
      // teal ambient from the sky on the near side, gold rim at the back
      const ag = ctx.createLinearGradient(-320, 0, 340, 0); ag.addColorStop(0, 'rgba(255,170,90,0.35)'); ag.addColorStop(.35, 'rgba(0,0,0,0)'); ag.addColorStop(1, 'rgba(60,120,130,0.18)');
      ctx.fillStyle = ag; ctx.fillRect(-340, -200, 700, 260);
      ctx.restore();
      // railing posts
      ctx.strokeStyle = '#1a0e08'; ctx.lineWidth = 2.4;
      for (let k = -230; k < 290; k += 15) { const y0 = k < -120 ? lerp(-128, -80, (k + 230) / 110) : -80 + (k + 120) * .045 - Math.max(0, k - 200) * .5; ctx.beginPath(); ctx.moveTo(k, y0); ctx.lineTo(k, y0 - 16); ctx.stroke(); }
      sheer(-16); ctx.lineWidth = 3; ctx.stroke();
      // crew
      crew(-80, -78, 1); crew(30, -74, .95); crew(190, -88, 1.05); crew(-40, -79, .9);
    }
    // stern castle
    ctx.fillStyle = '#20120b';
    ctx.beginPath(); ctx.moveTo(-292, -168); ctx.lineTo(-292, -214); ctx.lineTo(-190, -206); ctx.lineTo(-180, -110); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-312, -210); ctx.quadraticCurveTo(-240, -262, -170, -206); ctx.quadraticCurveTo(-240, -226, -312, -210); ctx.fill();
    // quarter rudder
    ctx.strokeStyle = '#140b07'; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-246, -150); ctx.lineTo(-300, 36); ctx.stroke();
    // rim light along sheer + stern
    ctx.save(); ctx.shadowColor = 'rgba(255,190,110,0.9)'; ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(255,214,150,0.95)'; ctx.lineWidth = 2.6 / Math.sqrt(s); sheer(0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-300, -168); ctx.quadraticCurveTo(-322, -122, -312, -62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-312, -210); ctx.quadraticCurveTo(-240, -262, -170, -206); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  // =====================================================================
  //  SEA
  // =====================================================================
  const NR = 46, ROWS = [];
  for (let k = 1; k <= NR; k++) ROWS.push(2.5 + 1060 * Math.pow(k / NR, 1.85));
  const amp = d => .1 * d + .5;
  function waveH(xw, zw, t, u) {
    const a = .55 * Math.sin(.6 * xw + .8 * zw - 1.6 * t + 1.3 * noise2(xw * .12, zw * .12));
    const b = .25 * Math.sin(1.45 * xw - .5 * zw - 2.4 * t + 2.0);
    const c = .32 * noise2(xw * .8 + t * .3, zw * .8 - t * .9);
    return a + b * (.5 + .5 * u) + c * (.35 + .65 * u);
  }
  const TOPR = [[0, '#f2b585'], [.02, '#c4907e'], [.08, '#6f7584'], [.3, '#2b6066'], [1, '#1d565c']];
  const BOTR = [[0, '#c69078'], [.02, '#8a6e72'], [.08, '#2c3f4f'], [.3, '#0b2630'], [1, '#03121a']];

  // =====================================================================
  //  SEA SHOT
  // =====================================================================
  const BIRDS = []; for (let i = 0; i < 9; i++) BIRDS.push({ x: 120 + R() * 360, y: 640 + R() * 200, s: 7 + R() * 7, ph: R() * 6, sp: 9 + R() * 3 });
  BIRDS.push({ x: 820, y: 520, s: 18, ph: 1, sp: 7 });
  const MOTES = []; for (let i = 0; i < 60; i++) MOTES.push({ x: R() * 1300 - 100, y: 500 + R() * 1300, z: R(), ph: R() * 10 });
  const FARSHIPS = [[60, 1068, .2, 4.4], [420, 1053, .1, 2.2], [790, 1050, .085, 7.7], [985, 1046, .07, 1.9]];

  function seaShot(lt, t) {
    const camW = lt * 1.2;            // lateral world drift (fleet sails right)
    const T = lt;
    // sky
    ctx.drawImage(SKY, -200 - lt * 4, 0);
    // god rays (behind low clouds)
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .55 + .15 * Math.sin(lt * 1.7);
    ctx.translate(SUN.x, SUN.y); ctx.rotate(Math.sin(lt * .4) * .015); ctx.translate(-SUN.x, -SUN.y); ctx.drawImage(RAYS, -200, 0); ctx.restore();
    ctx.drawImage(CLOUD_HI, -200 - lt * 10, -20);
    // sun disc
    glowBlob(SUN.x, SUN.y, 150, 'rgba(255,236,190,0.9)', 1, 'lighter');
    ctx.save(); ctx.fillStyle = '#fff4d8'; ctx.beginPath(); ctx.arc(SUN.x, SUN.y + 6, 40, 0, 7); ctx.fill(); ctx.restore();
    ctx.drawImage(CLOUD_LO, -200 - lt * 16, 720);
    glowBlob(SUN.x, SUN.y, 420, 'rgba(255,190,110,0.45)', 1, 'lighter');
    // birds (far flock)
    ctx.save(); ctx.fillStyle = '#1d1416'; ctx.strokeStyle = '#1d1416'; ctx.lineCap = 'round';
    for (const b of BIRDS) {
      const bx = b.x + lt * b.sp * 3, by = b.y - lt * 6 + Math.sin(lt * 2 + b.ph) * 4, f = Math.sin(lt * b.sp + b.ph), s = b.s;
      ctx.lineWidth = s * .2; ctx.beginPath(); ctx.moveTo(bx - s, by - f * s * .6); ctx.quadraticCurveTo(bx - s * .45, by - s * .35 - f * s * .2, bx, by); ctx.quadraticCurveTo(bx + s * .45, by - s * .35 - f * s * .2, bx + s, by - f * s * .6); ctx.stroke();
    }
    ctx.restore();
    // coast
    ctx.drawImage(COAST, -200 - lt * 9, 0);
    // sea base
    ctx.drawImage(SEA, -200, YH);
    // horizon mist
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .7;
    ctx.drawImage(MIST_FAR, -300 - (lt * 40) % 600, YH - 150); ctx.restore();

    // ships list sorted by depth (d = y - YH)
    const heroX = 560 + 24 * E.sine(P(lt, 0, 3.4));
    const ships = [];
    ships.push({ far: true, d: 28 });
    ships.push({ x: 160 + lt * 10, y: YH + 92, s: .42, sd: 3.3, d: 92, detail: true, mid: true });
    ships.push({ x: heroX, y: YH + 196, s: 1, sd: 0, d: 196, detail: true, hero: true });
    const sway = sp => {
      const u = sp.d / 1000, xw = (sp.x - 540) / sp.d * 14 + camW, zw = 1000 / sp.d, off = 300 / sp.d * 14 * sp.s;
      const hb = waveH(xw + off, zw, T, u), hs = waveH(xw - off, zw, T, u), hc = waveH(xw, zw, T, u);
      sp.bob = -amp(sp.d) * hc * .55; sp.rot = clamp(-(hb - hs) * amp(sp.d) * .45 / (600 * sp.s), -.05, .05) + Math.sin(lt * 1.1 + sp.sd) * .008;
    };
    ships.forEach(sp => { if (!sp.far) sway(sp); });
    let si = 0;
    const drawShip = sp => {
      if (sp.far) {
        const L = paint('hist_far', () => {
          for (const [x, y, s, sd] of FARSHIPS) { const f = { x: x + lt * 40 * s, y, s, sd, d: y - YH }; sway(f); jong(f.x, f.y + f.bob * .5, s, f.rot, T, sd, false); }
          ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = 'rgba(196,140,132,0.5)'; ctx.fillRect(0, 0, W, H);
        });
        comp(L, { blur: 1.2, alpha: .92 });
        return;
      }
      jong(sp.x, sp.y + sp.bob, sp.s, sp.rot, T, sp.sd, true);
      if (sp.mid) { /* atmospheric haze handled by mist pass */ }
      wash(sp, lt);
    };

    // wave rows far -> near
    for (let k = 0; k < NR; k++) {
      const d = ROWS[k];
      while (si < ships.length && ships[si].d < d) drawShip(ships[si++]);
      const u = clamp(d / 1000), A = amp(d);
      const dn = k + 1 < NR ? ROWS[k + 1] : 1400, yb = Math.min(YH + dn + amp(dn) * 1.3 + 4, H + 140);
      const st = d > 300 ? 22 : d > 60 ? 16 : 20;
      const pts = [];
      for (let x = -140; x <= 1240; x += st) {
        const xw = (x - 540) / d * 14 + camW, zw = 1000 / d;
        const hh = waveH(xw, zw, T, u);
        pts.push([x, YH + d - A * hh, hh]);
      }
      const yTop = YH + d - A * 1.2;
      const tc = ramp(TOPR, u), bc = ramp(BOTR, u);
      const g = ctx.createLinearGradient(0, yTop, 0, yTop + Math.max(4, A * 2.6 + (yb - YH - d) * .4));
      g.addColorStop(0, css(tc)); g.addColorStop(1, css(bc));
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
      ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      ctx.lineTo(1240, yb); ctx.lineTo(-140, yb); ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
      // crest highlights: sky sheen everywhere, gold in the sun's glitter column
      const sw = 50 + d * .75;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
      ctx.lineWidth = .8 + u * 3.2;
      ctx.strokeStyle = u < .1 ? `rgba(255,214,170,${.25 * (1 - u * 8)})` : `rgba(170,215,215,${.08 + u * .16})`; ctx.stroke();
      const hg = ctx.createLinearGradient(SUN.x - sw, 0, SUN.x + sw, 0);
      hg.addColorStop(0, 'rgba(255,210,140,0)'); hg.addColorStop(.5, `rgba(255,222,160,${.95 - u * .35})`); hg.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = hg; ctx.lineWidth = 1 + u * 4; ctx.stroke();
      // glints
      for (let i = 0; i < pts.length; i++) {
        const [x, y, hh] = pts[i]; const col = Math.exp(-Math.pow((x - SUN.x) / (sw * 1.1), 2));
        const n = noise1(lt * 7 + i * 1.73 + k * 13.1);
        const thr = .2 + (1 - col) * .55;
        if (n > thr) {
          const a = (n - thr) * 2.4 * (col * .9 + .12), rx = 2 + u * 22, ry = .8 + u * 2.5;
          ctx.fillStyle = `rgba(255,236,196,${clamp(a)})`; ctx.beginPath(); ctx.ellipse(x + (h2(i, k) - .5) * st, y + 1 + u * 3, rx, ry, 0, 0, 7); ctx.fill();
        }
      }
      ctx.restore();
      // foam on near crests
      if (u > .22) {
        ctx.save(); ctx.lineCap = 'round';
        for (let i = 1; i < pts.length; i++) {
          const hh = (pts[i][2] + pts[i - 1][2]) / 2; if (hh < .42) continue;
          const a = clamp((hh - .42) * 2.2) * .75;
          ctx.strokeStyle = `rgba(232,242,236,${a})`; ctx.lineWidth = 1.5 + u * 7 * clamp((hh - .4) * 2);
          ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1] + 1); ctx.lineTo(pts[i][0], pts[i][1] + 1); ctx.stroke();
          // lace below crest
          ctx.fillStyle = `rgba(220,236,232,${a * .45})`;
          for (let m = 0; m < 3; m++) { const r = h2(i * 3 + m, k); ctx.beginPath(); ctx.ellipse(pts[i][0] - r * st, pts[i][1] + 6 + r * A * .9, 2 + u * 9 * r, 1 + u * 2, 0, 0, 7); ctx.fill(); }
        }
        ctx.restore();
      }
    }
    while (si < ships.length) drawShip(ships[si++]);

    // near mist
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .4; ctx.drawImage(MIST_NEAR, -600 + (lt * 70) % 600, YH + 120); ctx.restore();
    // golden motes / spray specks
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const m of MOTES) {
      const x = ((m.x - lt * (20 + m.z * 90) + 1400) % 1400) - 150, y = m.y + Math.sin(lt * 1.3 + m.ph) * 12 - lt * 8 * m.z;
      const r = 1 + m.z * 4, a = (.25 + .5 * m.z) * (.6 + .4 * Math.sin(lt * 3 + m.ph));
      glowBlob(x, y, r * 3, `rgba(255,214,150,${a})`, 1, 'lighter');
    }
    ctx.restore();
  }

  // bow wash, wake and spray for detailed ships
  function wash(sp, lt) {
    const s = sp.s, x = sp.x, y = sp.y + sp.bob;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sp.rot); ctx.scale(s, s);
    ctx.lineCap = 'round';
    // white water along waterline
    for (let i = 0; i < 26; i++) {
      const k = i / 25, px = lerp(250, -300, k) + Math.sin(lt * 6 + i) * 4, py = 22 + Math.sin(k * 9 + lt * 5) * 4 + (k > .9 ? (k - .9) * 60 : 0);
      ctx.fillStyle = `rgba(235,240,232,${.55 * (1 - k * .5)})`; ctx.beginPath(); ctx.ellipse(px, py, 26 - k * 10, 5 + h(i) * 4, 0, 0, 7); ctx.fill();
    }
    // wake trailing back-left
    for (let i = 0; i < 30; i++) {
      const k = i / 29, px = -310 - k * 520, py = 34 + k * 30 + Math.sin(k * 12 - lt * 3) * 5;
      ctx.fillStyle = `rgba(220,236,232,${.4 * (1 - k)})`; ctx.beginPath(); ctx.ellipse(px, py, 34 + k * 30, 4 + k * 3, 0, 0, 7); ctx.fill();
    }
    // bow spray (ballistic particles, cycling)
    for (let i = 0; i < 70; i++) {
      const life = .9, age = ((lt * 1.1 + h(i * 3.3)) % 1) * life, a0 = h(i * 7.1);
      const vx = 80 + h(i * 1.9) * 260, vy = -(140 + h(i * 2.7) * 260);
      const px = 250 + vx * age * .9, py = 10 + vy * age + 420 * age * age;
      const al = (1 - age / life) * .7 * (.3 + a0 * .7); if (py > 40) continue;
      const r = 1.5 + h(i * 5.5) * 4;
      ctx.fillStyle = `rgba(240,246,240,${al})`; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  // =====================================================================
  //  MAP SHOT
  // =====================================================================
  function routeAt(k) { // point along ROUTE by fraction
    const segs = ROUTE.length - 1, p = clamp(k) * segs, i = Math.min(Math.floor(p), segs - 1), f = p - i;
    return [lerp(ROUTE[i][0], ROUTE[i + 1][0], f), lerp(ROUTE[i][1], ROUTE[i + 1][1], f), Math.atan2(ROUTE[i + 1][1] - ROUTE[i][1], ROUTE[i + 1][0] - ROUTE[i][0])];
  }
  function mapCam(lt) {
    const kr = E.io(P(lt, 0, .8));
    const g = routeAt(.45 + .55 * kr);
    const z = 1.05 + .3 * P(lt, 0, .5) + 2.4 * E.expoIn(P(lt, .4, 1.05));
    const kk = E.io(P(lt, 0, .7));
    const sx = lerp(g[0], FOCUS.x, kk), sy = lerp(g[1], FOCUS.y, kk);
    return { g, z, sx, sy, kr, rot: lerp(-.05, 0, E.out(P(lt, 0, 1))) };
  }
  function mapShot(lt) {
    const c = mapCam(lt);
    ctx.save();
    ctx.translate(c.sx, c.sy); ctx.rotate(c.rot); ctx.scale(c.z, c.z); ctx.translate(-c.g[0], -c.g[1]);
    ctx.drawImage(MAP, 0, 0, W, H);
    // route ink (dashed, drawn up to the ship)
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.lineCap = 'round';
    const k0 = .45 + .55 * c.kr;
    ctx.beginPath(); ctx.moveTo(...ROUTE[0]);
    const segs = ROUTE.length - 1, p = k0 * segs;
    for (let i = 1; i <= segs; i++) { if (i <= p) ctx.lineTo(...ROUTE[i]); else { const q = routeAt(k0); ctx.lineTo(q[0], q[1]); break; } }
    ctx.stroke(); ctx.restore();
    // ink jong glyph
    ctx.save(); ctx.translate(c.g[0], c.g[1] + Math.sin(lt * 7) * 1.2); ctx.rotate(c.g[2] * .5);
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-24, -6); ctx.quadraticCurveTo(0, 0, 26, -8); ctx.lineTo(18, 4); ctx.lineTo(-18, 4); ctx.closePath(); ctx.fill();
    for (const [mx, mh] of [[-8, 30], [6, 34]]) {
      ctx.beginPath(); ctx.moveTo(mx, -4); ctx.lineTo(mx, -mh); ctx.stroke();
      ctx.fillStyle = 'rgba(205,160,90,0.9)'; ctx.beginPath(); ctx.moveTo(mx - 4, -mh + 2); ctx.lineTo(mx + 13, -mh + 8); ctx.lineTo(mx + 9, -9); ctx.lineTo(mx - 6, -11); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = RED; ctx.fillRect(6, -40, 12, 3); ctx.fillStyle = '#f4e9da'; ctx.fillRect(6, -37, 12, 3);
    ctx.restore();
    ctx.restore();
    // warm candle light + flicker
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .6;
    radial(FOCUS.x, FOCUS.y, 900, 'rgba(255,200,120,1)', 'rgba(40,20,10,1)'); ctx.restore();
    const fr = Math.floor(lt * 24); ctx.fillStyle = `rgba(30,15,5,${h(fr) * .06})`; ctx.fillRect(-100, -100, W + 200, H + 200);
  }

  // ink-bleed blob path around the match-cut point
  function blobPath(r, lt, seed) {
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      const a = i / 90 * Math.PI * 2, n = fbm2(Math.cos(a) * 1.8 + seed, Math.sin(a) * 1.8 + lt * .8, 4);
      const rr_ = r * (1 + .22 * n) + (h(Math.floor(i / 3) + seed) > .85 ? r * .08 : 0);
      const x = FOCUS.x + Math.cos(a) * rr_, y = FOCUS.y + Math.sin(a) * rr_ * 1.08;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }

  // =====================================================================
  //  TITLE
  // =====================================================================
  function title(lt) {
    if (lt < 1.05) return;
    const cx = 540;
    // soft darkening behind title for legibility
    ctx.save(); ctx.globalAlpha = E.out(P(lt, 1.05, 1.6)) * .55;
    const tg = ctx.createRadialGradient(cx, 420, 0, cx, 420, 520); tg.addColorStop(0, 'rgba(5,16,24,0.7)'); tg.addColorStop(1, 'rgba(5,16,24,0)');
    ctx.fillStyle = tg; ctx.fillRect(0, 0, W, 1000); ctx.restore();
    // MAJAPAHIT small caps, staggered
    const word = 'MAJAPAHIT', size = 46, ls = 22;
    const ws = [...word].map(ch => TW(ch, size, 'Playfair', 700, 0));
    const tot = ws.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
    let x = cx - tot / 2;
    [...word].forEach((ch, i) => {
      const k = E.out(P(lt, 1.12 + i * .045, 1.62 + i * .045));
      T(ch, x + ws[i] / 2, 300 + (1 - k) * 18, { size, font: 'Playfair', weight: 700, color: '#f3d9a2', alpha: k, glow: 'rgba(255,190,110,0.5)', gb: 18 });
      x += ws[i] + ls;
    });
    // flanking rules
    const rk = E.expo(P(lt, 1.35, 2.1));
    ctx.save(); ctx.strokeStyle = 'rgba(243,217,162,0.8)'; ctx.lineWidth = 2;
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + sg * (tot / 2 + 28), 302); ctx.lineTo(cx + sg * (tot / 2 + 28 + 90 * rk), 302); ctx.stroke(); }
    ctx.fillStyle = 'rgba(243,217,162,0.9)'; for (const sg of [-1, 1]) sparkle(cx + sg * (tot / 2 + 28 + 90 * rk + 10), 302, 7 * rk, 'rgba(243,217,162,0.9)', Math.PI / 4);
    ctx.restore();
    // 1293 with light sweep
    const yk = E.expo(P(lt, 1.38, 2.0));
    if (yk > 0) {
      const L = paint('hist_title', () => {
        T('1293', cx, 200, { size: 250, font: 'Playfair', weight: 900, grad: ['#fff1cf', '#f2c77c', '#b77a3a'], ls: 8 + (1 - yk) * 40 });
        const sx = lerp(-300, 1400, E.io(P(lt, 1.55, 2.6)));
        ctx.globalCompositeOperation = 'source-atop';
        const g = ctx.createLinearGradient(sx - 120, 0, sx + 120, 60); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,240,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, 400);
      }, W, 400);
      ctx.save(); ctx.translate(cx, 470); ctx.scale(lerp(1.12, 1, yk), lerp(1.12, 1, yk)); ctx.translate(-cx, -200 - 0);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; ctx.globalAlpha = yk; ctx.drawImage(L, 0, 0); ctx.restore();
      comp(L, { blur: 18, alpha: .45 * yk, mode: 'lighter' });
      ctx.restore();
    }
    // subtitle
    const sa = E.out(P(lt, 2.0, 2.45));
    if (sa > 0) {
      ctx.save(); ctx.globalAlpha = sa * .6; const bg = ctx.createLinearGradient(0, 1440, 0, 1640); bg.addColorStop(0, 'rgba(3,12,18,0)'); bg.addColorStop(.5, 'rgba(3,12,18,0.6)'); bg.addColorStop(1, 'rgba(3,12,18,0)'); ctx.fillStyle = bg; ctx.fillRect(0, 1440, W, 200); ctx.restore();
      subtitle('“Tahun 1293, sebuah kerajaan besar lahir…”', 1560 + (1 - sa) * 10, sa, { size: 44, color: '#f6ead2' });
    }
  }

  // =====================================================================
  //  DRAW
  // =====================================================================
  function seaWithCam(lt, t) {
    const dive = 1 - E.expo(P(lt, .5, 1.7));
    const z = 1.05 + .5 * dive + .06 * E.sine(P(lt, 1, 3.4));
    const roll = Math.sin(lt * 1.2) * .006 + dive * .03;
    const bob = Math.sin(lt * 1.6) * 5;
    ctx.save();
    ctx.translate(FOCUS.x, FOCUS.y); ctx.rotate(roll); ctx.scale(z, z); ctx.translate(-FOCUS.x, -FOCUS.y + bob);
    seaShot(lt, t);
    ctx.restore();
    // grade: teal shadows / gold highlights
    ctx.save(); ctx.globalCompositeOperation = 'soft-light';
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(30,110,130,0.6)'); g.addColorStop(.5, 'rgba(255,170,90,0.45)'); g.addColorStop(1, 'rgba(20,90,110,0.6)');
    ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore();
    // calm bottom-left for the lower-third label
    ctx.save(); const bg = ctx.createLinearGradient(0, 1500, 0, 1920); bg.addColorStop(0, 'rgba(2,10,14,0)'); bg.addColorStop(1, 'rgba(2,10,14,0.55)'); ctx.fillStyle = bg; ctx.fillRect(-100, 1500, W + 200, 520); ctx.restore();
  }

  STYLES_REG.history = {
    label: 'VIDEO SEJARAH',
    cues: [[0.02, 'swell', 3.2], [0.5, 'whoosh'], [1.42, 'impact'], [1.6, 'shimmer']],
    draw(lt, t) {
      const r = 1700 * Math.pow(P(lt, .52, 1.05), 2.1);
      if (lt < 1.05) mapShot(lt);
      if (r > 1) {
        if (lt < 1.05) {
          // wet ink halo spreading ahead of the reveal
          ctx.save(); blobPath(r + 40 + 30 * (1 - P(lt, .52, 1.05)), lt, 3); ctx.fillStyle = 'rgba(30,14,6,0.75)'; ctx.shadowColor = 'rgba(30,14,6,0.9)'; ctx.shadowBlur = 40; ctx.fill(); ctx.restore();
          ctx.save(); blobPath(r, lt, 3); ctx.clip(); seaWithCam(lt, t); ctx.restore();
          ctx.save(); blobPath(r, lt, 3); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,190,110,0.8)'; ctx.lineWidth = 5; ctx.shadowColor = '#ffb060'; ctx.shadowBlur = 24; ctx.stroke(); ctx.restore();
        } else seaWithCam(lt, t);
      }
      title(lt);
    },
  };
})();
