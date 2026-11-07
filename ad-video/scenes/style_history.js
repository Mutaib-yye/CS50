// SHOWCASE STYLE: history — "Majapahit, 1293".
// 0.0–1.0 s: an aged portolan-style map of Java; a red ink route carries a tiny ink jong east while the camera dives
//            onto it, then ink bleeds outward from the ship and the live world appears inside it (match cut).
// 1.0–3.4 s: low camera skimming a dawn sea: a fleet of jong with tanja sails and red-white banners, backlit by a
//            low sun through cloud banks and god rays, a hazy coastline with a candi and volcanoes, mist, birds.
// Title: small caps "MAJAPAHIT" + Playfair "1293" with a light sweep; one cinema subtitle line.
(() => {
  const R = mulberry(1293);
  const YH = 1080;                   // horizon (sea coords)
  const SUN = { x: 330, y: 1036 };   // low dawn sun
  const FOCUS = { x: 690, y: 1060 }; // camera / match-cut point (hero jong sails)
  const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  function ramp(stops, u) {
    if (u <= stops[0][0]) return hex(stops[0][1]);
    for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) {
      const k = (u - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]), a = hex(stops[i - 1][1]), b = hex(stops[i][1]);
      return a.map((v, j) => v + (b[j] - v) * k);
    }
    return hex(stops[stops.length - 1][1]);
  }
  const mixv = (a, b, k) => a.map((v, j) => v + (b[j] - v) * k);
  const css = (v, a = 1) => `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${a})`;

  // =====================================================================
  //  PRE-RENDERED ART (load time)
  // =====================================================================
  const SKY = mk(W + 400, YH + 60);
  on(SKY.getContext('2d'), () => {
    ctx.translate(200, 0);
    const g = ctx.createLinearGradient(0, 0, 0, YH + 60);
    [[0, '#071621'], [.2, '#0f2b3a'], [.42, '#264456'], [.6, '#5d5d6b'], [.76, '#a8735f'], [.88, '#e29c63'], [.96, '#ffcf92'], [1, '#ffe2b0']].forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g; ctx.fillRect(-200, 0, W + 400, YH + 60);
    glowBlob(SUN.x, SUN.y, 950, 'rgba(255,160,90,0.45)', 1, 'lighter');
    glowBlob(SUN.x, SUN.y, 360, 'rgba(255,214,150,0.55)', 1, 'lighter');
    for (let i = 0; i < 110; i++) { const y = R() * 460, a = (1 - y / 460) * (.12 + R() * .45); ctx.fillStyle = `rgba(220,235,255,${a})`; const s = R() < .1 ? 2.4 : 1.5; ctx.fillRect(-200 + R() * (W + 400), y, s, s); }
  });

  // ---------- clouds (fbm, underside lit by the low sun)
  function cloudLayer(w, hh, sx0, sy0, scale, o) {
    const lw = Math.ceil(w / scale), lh = Math.ceil(hh / scale);
    const lo = mk(lw, lh), lg = lo.getContext('2d'), id = lg.createImageData(lw, lh);
    const dens = (px, py) => fbm2(px * o.fx + fbm2(px * .003 + 7, py * .006, 3) * o.warp, py * o.fy + o.seed, 5);
    const sh = hex(o.shade), lc = hex(o.litCol), hot = hex('#fff0c8');
    for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
      const sx = sx0 + x * scale, sy = sy0 + y * scale;
      const d = dens(sx, sy);
      const a = smooth(o.th0, o.th1, d) * o.band(sy);
      if (a <= 0.003) continue;
      const d2 = dens(sx + (SUN.x - sx) * .02, sy + o.lit);
      const sunK = Math.exp(-Math.pow((sx - SUN.x) / o.sunW, 2) - Math.pow((sy - SUN.y) / (o.sunW * 1.2), 2));
      const lit = clamp((d - d2) * o.litK + .18 + sunK * .7);
      const c = mixv(sh, mixv(lc, hot, sunK), lit);
      const i4 = (y * lw + x) * 4; id.data[i4] = c[0]; id.data[i4 + 1] = c[1]; id.data[i4 + 2] = c[2]; id.data[i4 + 3] = clamp(a * o.alpha) * 255;
    }
    lg.putImageData(id, 0, 0);
    const out = mk(w, hh), og = out.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(lo, 0, 0, w, hh);
    return out;
  }
  const CLOUD_HI = cloudLayer(W + 400, 800, -200, 0, 4, {
    fx: .0022, fy: .011, warp: 1.8, seed: 3.3, lit: 16, litK: 5, th0: .0, th1: .45, alpha: .92, sunW: 560,
    band: y => smooth(40, 240, y) * (1 - smooth(600, 790, y)),
    shade: '#2b3a50', litCol: '#d98c74',
  });
  const CLOUD_LO = cloudLayer(W + 400, 330, -200, 760, 3, {
    fx: .003, fy: .028, warp: 1.3, seed: 9.1, lit: 9, litK: 7, th0: -.02, th1: .3, alpha: .96, sunW: 240,
    band: y => smooth(790, 900, y) * (1 - smooth(1010, 1075, y)),
    shade: '#463342', litCol: '#ffae5c',
  });

  // ---------- god rays
  const RAYS = mk(W + 400, YH + 60);
  {
    const tmp = mk(W + 400, YH + 60);
    on(tmp.getContext('2d'), () => {
      ctx.translate(200, 0);
      for (let i = 0; i < 52; i++) {
        const a = -Math.PI * (.04 + .92 * R()), w = .006 + .028 * R(), al = .05 + .17 * R();
        const g = ctx.createRadialGradient(SUN.x, SUN.y, 0, SUN.x, SUN.y, 1500);
        g.addColorStop(0, `rgba(255,214,160,${al})`); g.addColorStop(.45, `rgba(255,190,140,${al * .45})`); g.addColorStop(1, 'rgba(255,190,140,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(SUN.x, SUN.y);
        ctx.lineTo(SUN.x + Math.cos(a - w) * 1800, SUN.y + Math.sin(a - w) * 1800); ctx.lineTo(SUN.x + Math.cos(a + w) * 1800, SUN.y + Math.sin(a + w) * 1800); ctx.fill();
      }
    });
    const rg = RAYS.getContext('2d'); rg.filter = 'blur(5px)'; rg.drawImage(tmp, 0, 0);
  }

  // ---------- distant coast
  function candi(x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
    ctx.rect(-44, -12, 88, 12); ctx.rect(-36, -24, 72, 12); ctx.rect(-12, -40, 24, 16);   // terraces + stair
    ctx.rect(-24, -78, 48, 54);                                                            // body
    const tiers = [[-29, -78, 58, 9], [-25, -92, 50, 15], [-21, -105, 42, 13], [-17, -117, 34, 12], [-13, -128, 26, 11], [-9, -138, 18, 10]];
    for (const [tx, ty, tw, th] of tiers) ctx.rect(tx, ty - th + 9, tw, th);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(-5, -138); ctx.lineTo(0, -162); ctx.lineTo(5, -138); ctx.fill();
    for (const [tx, ty] of [[-28, -84], [23, -84], [-24, -98], [19, -98], [-20, -111], [15, -111], [-16, -123], [11, -123]]) { ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + 2.5, ty - 10); ctx.lineTo(tx + 5, ty); ctx.fill(); }
    ctx.restore();
  }
  function gate(x, y, s, col) { // candi bentar (split gate)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sg * 8, 0);
      for (const [px, py] of [[8, -40], [10, -40], [10, -52], [12, -52], [12, -62], [13, -72], [13, -86]]) ctx.lineTo(sg * px, py);
      ctx.lineTo(sg * 15, -94); ctx.lineTo(sg * 22, -72); ctx.lineTo(sg * 26, -52); ctx.lineTo(sg * 32, -30); ctx.lineTo(sg * 38, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function palm(x, y, hgt, lean, col, seed) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round';
    const tx = x + lean * hgt, ty = y - hgt;
    ctx.lineWidth = Math.max(1.2, hgt * .045); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * hgt * .2, y - hgt * .6, tx, ty); ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * .48 + (h(seed + i) - .5) * .3, L = hgt * (.38 + h(seed * 3 + i) * .14);
      ctx.lineWidth = Math.max(1, hgt * .03); ctx.beginPath(); ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(tx + Math.cos(a) * L * .6, ty + Math.sin(a) * L * .6 - L * .12, tx + Math.cos(a) * L, ty + Math.sin(a) * L * .55 + L * .32); ctx.stroke();
    }
    ctx.restore();
  }
  const COAST = mk(W + 400, YH + 20);
  on(COAST.getContext('2d'), () => {
    ctx.translate(200, 0);
    const vol = (cx, hgt, hw, col) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - hw * 1.4, YH + 2);
      for (let x = -hw * 1.4; x <= hw * 1.4; x += 4) { const k = Math.abs(x) / hw; ctx.lineTo(cx + x, YH - hgt * Math.pow(Math.max(0, 1 - k * .82), 1.9) + fbm2(x * .02, cx) * 4 + (Math.abs(x) < hw * .05 ? 5 : 0)); }
      ctx.lineTo(cx + hw * 1.4, YH + 2); ctx.fill();
    };
    vol(860, 270, 430, 'rgba(146,112,130,0.45)');
    vol(1180, 200, 330, 'rgba(146,112,130,0.38)');
    vol(40, 150, 300, 'rgba(170,120,120,0.32)');
    ctx.fillStyle = 'rgba(110,84,104,0.85)'; ctx.beginPath(); ctx.moveTo(560, YH + 2);
    for (let x = 560; x <= 1290; x += 4) ctx.lineTo(x, YH - 6 - 30 * smooth(560, 700, x) * (.55 + .45 * fbm2(x * .006, 2.2)) - 7 * fbm2(x * .03, 5));
    ctx.lineTo(1290, YH + 2); ctx.fill();
    const cr = 'rgba(82,60,78,0.92)';
    ctx.fillStyle = cr; ctx.beginPath(); ctx.moveTo(680, YH + 2);
    for (let x = 680; x <= 1290; x += 4) ctx.lineTo(x, YH - 3 - 10 * smooth(680, 760, x) * (.6 + .4 * fbm2(x * .01, 8)));
    ctx.lineTo(1290, YH + 2); ctx.fill();
    for (const [px, ph, pl] of [[770, 34, .15], [800, 46, -.1], [880, 40, .2], [1010, 52, -.15], [1060, 42, .12], [1150, 50, -.08], [1230, 38, .2]]) palm(px, YH - 6, ph, pl, cr, px);
    const cl = 'rgba(52,32,42,0.96)';
    ctx.fillStyle = cl; ctx.beginPath(); ctx.moveTo(-200, YH + 2);
    for (let x = -200; x <= 300; x += 4) ctx.lineTo(x, YH - 4 - 26 * (1 - smooth(170, 300, x)) * (.6 + .4 * fbm2(x * .012, 3)));
    ctx.lineTo(300, YH + 2); ctx.fill();
    candi(150, YH - 20, 1.0, cl);
    gate(252, YH - 12, .6, cl);
    for (const [px, ph, pl] of [[-150, 48, .1], [-90, 66, -.12], [-30, 52, .18], [40, 72, -.1], [72, 50, .16], [225, 40, .2]]) palm(px, YH - 14, ph, pl, cl, px);
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
  const MIST_FAR = mistLayer(2400, 240, 1.7, '#ffd3a8', .8);
  const MIST_NEAR = mistLayer(2400, 420, 5.3, '#cfe0e0', .35);

  const SEA = mk(W + 400, H - YH + 300);
  on(SEA.getContext('2d'), () => {
    ctx.translate(200, -YH);
    bgGrad([[0, '#f0b07e'], [.04, '#a07a7a'], [.16, '#3d5462'], [.45, '#123341'], [1, '#05151c']], YH, H + 200);
  });
  const MOTE = mk(48, 48); on(MOTE.getContext('2d'), () => glowBlob(24, 24, 24, 'rgba(255,220,160,1)', 1, 'source-over'));

  // ---------- parchment map (1.5x for the dive) — built lazily (fonts must be loaded)
  const MS = 1.5;
  let MAP = null;
  const INK = '#3a2213', RED = '#9c2a1c';
  const javaTop = x => 1100 + (x - 500) * .05 - (70 + 22 * Math.sin(x * .011 + 1)) * Math.pow(clamp((960 - x) / 140), .55) + 20 * fbm2(x * .011, 1.3) + 6 * fbm2(x * .06, 3.1);
  const javaBot = x => 1100 + (x - 500) * .05 + (78 + 18 * Math.sin(x * .009)) * Math.pow(clamp((960 - x) / 140), .55) + 16 * fbm2(x * .012, 7.7) + 5 * fbm2(x * .07, 9.9);
  const ROUTE = [[-60, 925], [90, 958], [230, 948], [360, 915], [470, 930], [570, 962], [640, 975]];
  function islandPath(cx, cy, rx, ry, seed) {
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, r = 1 + .28 * fbm2(Math.cos(a) * 1.4 + seed, Math.sin(a) * 1.4 + seed, 4); const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath();
  }
  const LANDS = [
    () => { ctx.beginPath(); ctx.moveTo(-160, javaTop(-160)); for (let x = -160; x <= 962; x += 3) ctx.lineTo(x, javaTop(x)); for (let x = 962; x >= -160; x -= 3) ctx.lineTo(x, javaBot(x)); ctx.closePath(); },
    () => { ctx.beginPath(); ctx.moveTo(-160, -160); for (let x = -160; x <= 1240; x += 3) ctx.lineTo(x, 330 + 70 * Math.sin(x * .004 + 1.2) + 50 * fbm2(x * .008, 4.4) + 14 * fbm2(x * .05, 2) - 90 * Math.exp(-Math.pow((x - 520) / 90, 2))); ctx.lineTo(1240, -160); ctx.closePath(); },
    () => islandPath(770, 978, 125, 24, 2.2),
    () => islandPath(1035, 1150, 48, 34, 5.5),
    () => islandPath(425, 780, 22, 10, 8.1),
    () => islandPath(462, 798, 12, 7, 3.7),
    () => islandPath(650, 640, 26, 20, 6.6),
    () => islandPath(140, 1500, 60, 22, 1.1),
  ];
  function buildMap() {
    const RM = mulberry(77);
    MAP = mk(W * MS, H * MS);
    on(MAP.getContext('2d'), () => {
      ctx.scale(MS, MS);
      ctx.drawImage(PAPER, 0, 0, W, H);
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#dcb47c'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const x = RM() * W, y = RM() * H, r = 80 + RM() * 260; glowBlob(x, y, r, `rgba(150,100,45,${.12 + RM() * .18})`, 1, 'multiply'); }
      ctx.restore();
      ctx.save(); ctx.lineWidth = 1.2;
      for (const [cx, cy] of [[860, 560], [180, 1380]]) for (let i = 0; i < 32; i++) {
        const a = i * Math.PI / 16; ctx.strokeStyle = i % 4 === 0 ? 'rgba(156,42,28,0.30)' : i % 2 ? 'rgba(58,34,19,0.13)' : 'rgba(70,90,60,0.2)';
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 2400, cy + Math.sin(a) * 2400); ctx.stroke();
      }
      ctx.restore();
      const ring = mk(W, H);
      on(ring.getContext('2d'), () => {
        for (let k = 5; k >= 1; k--) {
          for (const p of LANDS) { p(); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = `rgba(58,34,19,${.38 - k * .05})`; ctx.lineWidth = k * 15; ctx.lineJoin = 'round'; ctx.stroke(); }
          for (const p of LANDS) { p(); ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = k * 15 - 2.4; ctx.strokeStyle = '#000'; ctx.stroke(); }
        }
      });
      ctx.drawImage(ring, 0, 0);
      for (const p of LANDS) {
        p(); ctx.save(); ctx.fillStyle = 'rgba(176,128,66,0.42)'; ctx.fill(); ctx.clip();
        ctx.strokeStyle = 'rgba(58,34,19,0.16)'; ctx.lineWidth = 1.4;
        for (let x = -200; x < 1300; x += 9) { ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x + 900, 2100); ctx.stroke(); }
        ctx.restore();
        p(); ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.stroke();
      }
      for (const [x, s] of [[40, .8], [190, 1], [520, 1.1], [600, .9], [830, .9], [905, .75]]) {
        const y = (javaTop(x) + javaBot(x)) / 2 + 4; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.fillStyle = 'rgba(120,70,30,0.35)'; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-4, -22); ctx.lineTo(4, -22); ctx.lineTo(26, 10); ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-4, -22); ctx.lineTo(4, -22); ctx.lineTo(26, 10); ctx.stroke();
        ctx.lineWidth = 1.2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(4 + k * 3, -18 + k * 5); ctx.lineTo(10 + k * 3, 8); ctx.stroke(); }
        ctx.restore();
      }
      ctx.save(); ctx.translate(705, 1100); ctx.fillStyle = RED; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.lineTo(12, -10); ctx.lineTo(8, -10); ctx.lineTo(6, -24); ctx.lineTo(3, -24); ctx.lineTo(0, -36); ctx.lineTo(-3, -24); ctx.lineTo(-6, -24); ctx.lineTo(-8, -10); ctx.lineTo(-12, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      T('Majapahit', 705, 1128, { size: 30, font: 'Playfair', weight: 'italic 700', color: INK });
      T('J A W A', 360, 1112, { size: 44, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.8)' });
      T('Laut Jawa', 300, 760, { size: 34, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.65)', rot: -.04 });
      T('Samudra Hindia', 560, 1560, { size: 40, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.6)', ls: 4 });
      T('Madura', 790, 935, { size: 24, font: 'Playfair', weight: 'italic 400', color: 'rgba(58,34,19,0.75)' });
      ctx.save(); ctx.translate(860, 560);
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(0, 0, 96, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 88, 0, 7); ctx.stroke();
      for (let i = 0; i < 64; i++) { const a = i * Math.PI / 32, r2 = i % 4 ? 92 : 96; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 88, Math.sin(a) * 88); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke(); }
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
      ctx.strokeStyle = 'rgba(58,34,19,0.35)'; ctx.lineWidth = 1.6;
      for (let i = 0; i < 26; i++) {
        const x = 80 + RM() * 920, y = 480 + RM() * 1250; if (y > 820 && y < 1260) continue;
        ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(x + k * 18, y); ctx.quadraticCurveTo(x + k * 18 + 5, y - 6, x + k * 18 + 10, y); } ctx.stroke();
      }
      const eg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1200); eg.addColorStop(0, 'rgba(70,35,10,0)'); eg.addColorStop(1, 'rgba(50,22,6,0.72)');
      ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);
    });
  }

  // ---------- title art (lazy: needs fonts)
  let YEAR = null, YEAR_GLOW = null, YEAR_SH = null;
  function buildTitle() {
    YEAR = mk(W, 400);
    on(YEAR.getContext('2d'), () => T('1293', 540, 200, { size: 250, font: 'Playfair', weight: 900, grad: ['#fff3d6', '#f4c983', '#b7793a'], ls: 10 }));
    YEAR_GLOW = mk(W, 400); { const g = YEAR_GLOW.getContext('2d'); g.filter = 'blur(22px)'; g.drawImage(YEAR, 0, 0); }
    YEAR_SH = mk(W, 400); { const g = YEAR_SH.getContext('2d'); g.filter = 'blur(26px)'; g.drawImage(YEAR, 0, 10); g.filter = 'none'; g.globalCompositeOperation = 'source-in'; g.fillStyle = 'rgba(2,8,14,0.8)'; g.fillRect(0, 0, W, 400); }
  }

  // =====================================================================
  //  SHIPS — jong facing right; local units at hero scale, origin = waterline centre
  // =====================================================================
  const MASTS = [[-175, 430, .55], [-35, 520, .25], [105, 470, 0]];
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
  function sailGrad(sunL, r) {
    const g = ctx.createRadialGradient(sunL.x, sunL.y, 0, sunL.x, sunL.y, r);
    g.addColorStop(0, '#ffe0a0'); g.addColorStop(.2, '#f0a85e'); g.addColorStop(.42, '#b06632'); g.addColorStop(.66, '#62321b'); g.addColorStop(1, '#2a140c');
    return g;
  }
  // tanja: canted rectangular mat sail, leaning forward, spars sloping down toward the bow
  function sail(mx, mh, sc, t, seed, sunL, detail, shade) {
    const w = mh * .64, sh = mh * .7, base = 100, lean = .36, slope = -.14;
    const P = (u, v) => [mx + u * w + v * sh * lean, -(base + v * sh + (u + .3) * w * slope)];
    const fl = noise1(t * 1.3 + seed) * .5 + .5;
    const belly = w * (.06 + .04 * fl);
    const q = [P(-.3, 1), P(.7, 1), P(.7, 0), P(-.3, 0)];
    const front = k => [lerp(q[1][0], q[2][0], k) + Math.sin(k * Math.PI) * belly, lerp(q[1][1], q[2][1], k)];
    const back = k => [lerp(q[0][0], q[3][0], k) + Math.sin(k * Math.PI) * belly * .3, lerp(q[0][1], q[3][1], k)];
    const path = () => {
      ctx.beginPath(); ctx.moveTo(...q[0]); ctx.lineTo(...q[1]);
      for (let k = .1; k <= 1.001; k += .1) ctx.lineTo(...front(k));
      ctx.lineTo(...q[3]);
      for (let k = .9; k >= -.001; k -= .1) ctx.lineTo(...back(k));
      ctx.closePath();
    };
    path(); ctx.fillStyle = sailGrad(sunL, 820); ctx.fill();
    if (detail) {
      ctx.save(); ctx.clip();
      if (shade > 0) { ctx.fillStyle = `rgba(28,10,6,${shade})`; ctx.fill(); }
      const sg = ctx.createLinearGradient(q[1][0] - w * .45, 0, q[1][0] + belly, 0); sg.addColorStop(0, 'rgba(20,8,4,0)'); sg.addColorStop(1, 'rgba(20,8,4,0.45)');
      ctx.fillStyle = sg; ctx.fill();
      ctx.strokeStyle = 'rgba(50,20,8,0.32)'; ctx.lineWidth = 1.5 / sc;
      ctx.beginPath();
      for (let k = .055; k < 1; k += .055) { const a = back(k), b = front(k); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + belly * .5, (a[1] + b[1]) / 2, ...b); }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,220,170,0.10)'; ctx.lineWidth = 1 / sc; ctx.beginPath();
      for (let k = .0275; k < 1; k += .055) { const a = back(k), b = front(k); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + belly * .5, (a[1] + b[1]) / 2, ...b); }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(36,14,6,0.55)'; ctx.lineWidth = 3 / sc; ctx.beginPath();
      for (const u of [.33, .66]) { const a = [lerp(q[0][0], q[1][0], u), lerp(q[0][1], q[1][1], u)], b = [lerp(q[3][0], q[2][0], u), lerp(q[3][1], q[2][1], u)]; ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2 + belly * (.4 + u * .6), (a[1] + b[1]) / 2, ...b); }
      ctx.stroke();
      ctx.restore();
      path(); ctx.strokeStyle = 'rgba(30,12,6,0.7)'; ctx.lineWidth = 1.6 / sc; ctx.stroke();
    }
    ctx.strokeStyle = '#170c07'; ctx.lineCap = 'round'; ctx.lineWidth = 5.5 / Math.sqrt(sc);
    ctx.beginPath(); ctx.moveTo(...P(-.36, 1)); ctx.lineTo(...P(.76, 1)); ctx.moveTo(...P(-.36, 0)); ctx.lineTo(...P(.76, 0)); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,214,150,0.8)'; ctx.lineWidth = 1.8 / sc;
    ctx.beginPath(); ctx.moveTo(...q[0]); for (let k = .1; k <= 1.001; k += .1) ctx.lineTo(...back(k)); ctx.stroke();
  }
  function pennant(x, y, len, wid, t, seed) {
    const n = 14, top = [], bot = [], mid = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n, px = x + k * len, amp = (2 + k * len * .15), ph = k * 6 - t * 9 + seed;
      const py = y + Math.sin(ph) * amp + noise1(t * 2 + seed + k) * len * .06 * k + k * len * .1;
      const ww = wid * (1 - k * .8);
      top.push([px, py - ww / 2]); bot.push([px, py + ww / 2]); mid.push([px, py, Math.cos(ph)]);
    }
    ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); for (let i = n; i >= 0; i--) ctx.lineTo(mid[i][0], mid[i][1]); ctx.closePath(); ctx.fillStyle = '#c8261c'; ctx.fill();
    ctx.beginPath(); mid.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = n; i >= 0; i--) ctx.lineTo(...bot[i]); ctx.closePath(); ctx.fillStyle = '#efe2cf'; ctx.fill();
    ctx.save(); ctx.globalAlpha *= .4; ctx.strokeStyle = '#3a0c06'; ctx.lineWidth = wid * .9; ctx.beginPath();
    for (let i = 1; i < n; i++) if (mid[i][2] < -.3) { ctx.moveTo(mid[i - 1][0], mid[i - 1][1]); ctx.lineTo(mid[i][0], mid[i][1]); }
    ctx.stroke(); ctx.restore();
  }
  function umbul(x, y, hgt, t, sc) {
    const pts = []; for (let i = 0; i <= 16; i++) { const k = i / 16; pts.push([x - 34 * k * k + Math.sin(t * 1.4) * 4 * k, y - hgt * k]); }
    ctx.strokeStyle = '#170c07'; ctx.lineWidth = 3.5 / Math.sqrt(sc); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
    const n = 16, L = []; for (let i = 0; i <= n; i++) { const k = i / n, p = pts[Math.round(4 + k * 12)]; const off = 8 + k * 40; const wv = Math.sin(k * 7 - t * 7) * (3 + k * 10); L.push([p[0] + off + wv * .2, p[1] + 10 + k * 18 + wv]); }
    for (const [c, a, b] of [['#c8261c', 0, .5], ['#efe2cf', .5, 1]]) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const p = pts[Math.round(4 + (i / n) * 12)], q = L[i]; const ax = lerp(p[0], q[0], a), ay = lerp(p[1], q[1], a); i ? ctx.lineTo(ax, ay) : ctx.moveTo(ax, ay); }
      for (let i = n; i >= 0; i--) { const p = pts[Math.round(4 + (i / n) * 12)], q = L[i]; ctx.lineTo(lerp(p[0], q[0], b), lerp(p[1], q[1], b)); }
      ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    }
  }
  function crew(x, y, s) { ctx.beginPath(); ctx.arc(x, y - 30 * s, 5.5 * s, 0, 7); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 5 * s, y - 24 * s); ctx.lineTo(x + 5 * s, y - 24 * s); ctx.lineTo(x + 7 * s, y); ctx.fill(); }

  function jong(x, y, s, rot, t, seed, detail) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    const dx = (SUN.x - x) / s, dy = (SUN.y - y) / s, cr = Math.cos(-rot), sr = Math.sin(-rot);
    const sunL = { x: dx * cr - dy * sr, y: dx * sr + dy * cr };
    ctx.strokeStyle = 'rgba(25,14,9,0.75)'; ctx.lineWidth = 1.4 / s; ctx.beginPath();
    for (const [mx, mh] of MASTS) { ctx.moveTo(mx, -mh); ctx.lineTo(-290, -170); ctx.moveTo(mx, -mh); ctx.lineTo(330, -140); }
    ctx.moveTo(105, -470); ctx.lineTo(440, -188); ctx.stroke();
    umbul(-300, -172, 330, t + seed, s);
    MASTS.forEach(([mx, mh, shade], i) => {
      ctx.strokeStyle = '#170c07'; ctx.lineWidth = 7 / Math.sqrt(s);
      ctx.beginPath(); ctx.moveTo(mx - 10, -80); ctx.lineTo(mx, -mh - 10); ctx.lineTo(mx + 10, -80); ctx.stroke();
      sail(mx, mh, s, t, seed + i * 3.1, sunL, detail, shade);
      pennant(mx, -mh - 8, 150, 18, t, seed + i * 1.7);
    });
    ctx.strokeStyle = '#170c07'; ctx.lineWidth = 5 / Math.sqrt(s); ctx.beginPath(); ctx.moveTo(280, -118); ctx.lineTo(440, -188); ctx.stroke();
    {
      const fl = noise1(t * 1.5 + seed + 9) * 8;
      ctx.fillStyle = sailGrad(sunL, 820); ctx.beginPath(); ctx.moveTo(298, -300); ctx.lineTo(408, -250); ctx.quadraticCurveTo(440 + fl, -210, 424, -180); ctx.lineTo(300, -128); ctx.quadraticCurveTo(318, -220, 298, -300); ctx.fill();
      ctx.strokeStyle = '#170c07'; ctx.lineWidth = 3.5 / Math.sqrt(s); ctx.beginPath(); ctx.moveTo(294, -304); ctx.lineTo(412, -248); ctx.stroke();
    }
    hullPath();
    const hg = ctx.createLinearGradient(0, -170, 0, 40); hg.addColorStop(0, '#2c1a10'); hg.addColorStop(.5, '#160d08'); hg.addColorStop(1, '#070404');
    ctx.fillStyle = hg; ctx.fill();
    if (detail) {
      ctx.save(); hullPath(); ctx.clip();
      ctx.strokeStyle = 'rgba(140,100,70,0.18)'; ctx.lineWidth = 2; for (const dy of [28, 46, 64, 84, 106]) { sheer(dy); ctx.stroke(); }
      ctx.strokeStyle = '#5e1a10'; ctx.lineWidth = 10; sheer(12); ctx.stroke();
      ctx.fillStyle = 'rgba(240,200,120,0.6)'; ctx.beginPath();
      for (let k = -270; k < 320; k += 22) { const yy = k < -120 ? lerp(-150, -68, (k + 270) / 150) : k < 250 ? -68 + (k + 120) * (-.02) - Math.pow((k - 60) / 260, 2) * 6 + 4 : -96; ctx.moveTo(k + 2, yy); ctx.arc(k, yy, 2, 0, 7); }
      ctx.fill();
      const ag = ctx.createLinearGradient(-320, 0, 340, 0); ag.addColorStop(0, 'rgba(255,160,80,0.3)'); ag.addColorStop(.35, 'rgba(0,0,0,0)'); ag.addColorStop(1, 'rgba(70,130,140,0.16)');
      ctx.fillStyle = ag; ctx.fillRect(-340, -200, 700, 260);
      const lg = ctx.createLinearGradient(0, -20, 0, 34); lg.addColorStop(0, 'rgba(90,150,150,0)'); lg.addColorStop(1, 'rgba(90,150,150,0.25)');
      ctx.fillStyle = lg; ctx.fillRect(-340, -20, 700, 60);
      ctx.restore();
      ctx.strokeStyle = '#140b07'; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let k = -230; k < 290; k += 15) { const y0 = k < -120 ? lerp(-128, -80, (k + 230) / 110) : -80 + (k + 120) * .045 - Math.max(0, k - 200) * .5; ctx.moveTo(k, y0); ctx.lineTo(k, y0 - 16); }
      ctx.stroke();
      sheer(-16); ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#110906'; crew(-80, -78, 1); crew(30, -74, .95); crew(190, -88, 1.05); crew(-40, -79, .9);
    }
    ctx.fillStyle = '#1a0f09';
    ctx.beginPath(); ctx.moveTo(-292, -168); ctx.lineTo(-292, -214); ctx.lineTo(-190, -206); ctx.lineTo(-180, -110); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-312, -210); ctx.quadraticCurveTo(-240, -262, -170, -206); ctx.quadraticCurveTo(-240, -226, -312, -210); ctx.fill();
    ctx.strokeStyle = '#100805'; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-246, -150); ctx.lineTo(-300, 36); ctx.stroke();
    ctx.save(); if (detail) { ctx.shadowColor = 'rgba(255,180,100,0.9)'; ctx.shadowBlur = 8; }
    ctx.strokeStyle = 'rgba(255,214,150,0.95)'; ctx.lineWidth = 2.6 / Math.sqrt(s);
    sheer(0); ctx.moveTo(-300, -168); ctx.quadraticCurveTo(-322, -122, -312, -62); ctx.moveTo(-312, -210); ctx.quadraticCurveTo(-240, -262, -170, -206); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  // =====================================================================
  //  SEA
  // =====================================================================
  const NR = 50, ROWS = [];
  for (let k = 1; k <= NR; k++) ROWS.push(2 + 1000 * Math.pow(k / NR, 1.9));
  const amp = d => .085 * d + 6e-5 * d * d + .4;
  function waveH(xw, zw, t, u) {
    const a = .55 * Math.sin(.6 * xw + 3.2 * zw - 1.7 * t + 1.4 * noise2(xw * .1, zw * .35));
    const b = .28 * Math.sin(1.3 * xw - 2.1 * zw - 2.3 * t + 2.0);
    const c = .35 * noise2(xw * .7 + t * .25, zw * 1.6 - t * .8);
    return a + b * (.5 + .5 * u) + c * (.4 + .6 * u);
  }
  const XW = (x, d, camW) => (x - 540) / d * 14 + camW;
  const ZW = d => 1000 / d;
  const CRR = [[0, '#f6c08e'], [.025, '#c99a86'], [.09, '#76868e'], [.3, '#3a7676'], [1, '#2c6f6c']];
  const TRR = [[0, '#d39a7e'], [.025, '#8f7478'], [.09, '#33475a'], [.3, '#10303a'], [1, '#092129']];
  const BDR = [[0, '#b88a7c'], [.025, '#6a5a66'], [.09, '#1f303d'], [.3, '#081d26'], [1, '#03111a']];
  const GOLD = hex('#ffcf8a');

  const BIRDS = []; for (let i = 0; i < 10; i++) BIRDS.push({ x: 330 + R() * 330, y: 690 + R() * 170, s: 6 + R() * 6, ph: R() * 6, sp: 9 + R() * 3 });
  BIRDS.push({ x: 860, y: 600, s: 15, ph: 1, sp: 7 }, { x: 905, y: 628, s: 12, ph: 2.5, sp: 7.5 });
  const MOTES = []; for (let i = 0; i < 56; i++) MOTES.push({ x: R() * 1300 - 100, y: 520 + R() * 1250, z: R(), ph: R() * 10 });
  const FARSHIPS = [[95, YH + 22, .11, 4.4], [520, YH + 9, .06, 2.2], [880, YH + 15, .08, 7.7], [1010, YH + 8, .05, 1.9]];

  function seaShot(lt) {
    const camW = lt * 1.2, T = lt;
    ctx.drawImage(SKY, -200 - lt * 4, 0);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .6 + .15 * Math.sin(lt * 1.7);
    ctx.translate(SUN.x, SUN.y); ctx.rotate(Math.sin(lt * .4) * .015); ctx.translate(-SUN.x, -SUN.y); ctx.drawImage(RAYS, -200, 0); ctx.restore();
    ctx.drawImage(CLOUD_HI, -200 - lt * 10, -20);
    glowBlob(SUN.x, SUN.y, 160, 'rgba(255,236,190,0.9)', 1, 'lighter');
    ctx.fillStyle = '#fff6de'; ctx.beginPath(); ctx.arc(SUN.x, SUN.y + 4, 38, 0, 7); ctx.fill();
    ctx.drawImage(CLOUD_LO, -200 - lt * 16, 760);
    glowBlob(SUN.x, SUN.y, 460, 'rgba(255,190,110,0.42)', 1, 'lighter');
    ctx.save(); ctx.strokeStyle = '#1b1215'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const b of BIRDS) {
      const bx = b.x + lt * b.sp * 3, by = b.y - lt * 6 + Math.sin(lt * 2 + b.ph) * 4, f = Math.sin(lt * b.sp + b.ph), s = b.s;
      ctx.lineWidth = s * .2; ctx.beginPath(); ctx.moveTo(bx - s, by - f * s * .6); ctx.quadraticCurveTo(bx - s * .45, by - s * .35 - f * s * .2, bx, by); ctx.quadraticCurveTo(bx + s * .45, by - s * .35 - f * s * .2, bx + s, by - f * s * .6); ctx.stroke();
    }
    ctx.restore();
    ctx.drawImage(COAST, -200 - lt * 9, 0);
    ctx.drawImage(SEA, -200, YH);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .75; ctx.drawImage(MIST_FAR, -300 - (lt * 40) % 600, YH - 150); ctx.restore();

    const heroX = 700 + 22 * E.sine(P(lt, 0, 3.4));
    const sway = sp => {
      const u = sp.d / 1000, xw = XW(sp.x, sp.d, camW), zw = ZW(sp.d), off = 300 / sp.d * 14 * sp.s;
      const hb = waveH(xw + off, zw, T, u), hs = waveH(xw - off, zw, T, u), hc = waveH(xw, zw, T, u);
      sp.bob = -amp(sp.d) * hc * .5; sp.rot = clamp(-(hb - hs) * amp(sp.d) * .4 / (600 * sp.s), -.045, .045) + Math.sin(lt * 1.1 + sp.sd) * .008;
    };
    const ships = [{ far: true, d: 26 }, { x: 470 + lt * 10, y: YH + 64, s: .27, sd: 3.3, d: 64, detail: true }, { x: heroX, y: YH + 236, s: .82, sd: 0, d: 236, detail: true, hero: true }];
    ships.forEach(sp => { if (!sp.far) sway(sp); });
    let si = 0;
    const drawShip = sp => {
      if (sp.far) {
        const L = paint('hist_far', () => {
          ctx.translate(0, -(YH - 300));
          for (const [x, y, s, sd] of FARSHIPS) { const f = { x: x + lt * 40 * s, y, s, sd, d: y - YH }; sway(f); jong(f.x, f.y + f.bob * .4, s, f.rot * .5, T, sd, false); }
          ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = 'rgba(190,136,130,0.5)'; ctx.fillRect(0, 0, W + 200, 340);
        }, W + 200, 340);
        comp(L, { blur: 1, alpha: .95, y: YH - 300 });
        return;
      }
      jong(sp.x, sp.y + sp.bob, sp.s, sp.rot, T, sp.sd, true);
      if (!sp.hero) glowBlob(sp.x, sp.y - 60, 140, 'rgba(240,170,130,0.18)', 1, 'screen');
      wash(sp, lt);
    };

    const foamA = [.22, .45, .75];
    for (let k = 0; k < NR; k++) {
      const d = ROWS[k];
      while (si < ships.length && ships[si].d < d) drawShip(ships[si++]);
      const u = clamp(d / 1000), A = amp(d), zw = ZW(d);
      const dn = k + 1 < NR ? ROWS[k + 1] : 1300, yb = Math.min(YH + dn + amp(dn) * 1.3 + 4, H + 160);
      const st = d > 300 ? 24 : 18;
      const pts = [];
      for (let x = -140; x <= 1240; x += st) { const hh = waveH(XW(x, d, camW), zw, T, u); pts.push([x, YH + d - A * hh, hh]); }
      const crest = new Path2D(); crest.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) crest.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
      crest.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
      const body = new Path2D(crest); body.lineTo(1240, yb); body.lineTo(-140, yb); body.closePath();
      const cc = ramp(CRR, u), tc = ramp(TRR, u), bc = ramp(BDR, u), sw = 40 + d * .6;
      const hg = ctx.createLinearGradient(-140, 0, 1240, 0);
      for (let i = 0; i < pts.length; i += 2) {
        const [x, , hh] = pts[i], col = Math.exp(-Math.pow((x - SUN.x) / sw, 2));
        let c = mixv(tc, cc, smooth(-.3, .9, hh)); c = mixv(c, GOLD, col * (.25 + .5 * smooth(0, .9, hh)) * (1 - u * .5));
        hg.addColorStop((x + 140) / 1380, css(c));
      }
      ctx.fillStyle = hg; ctx.fill(body);
      const yTop = YH + d - A * .9;
      const vg = ctx.createLinearGradient(0, yTop, 0, yTop + A * 1.8 + 3 + (dn - d) * .6);
      vg.addColorStop(0, css(bc, 0)); vg.addColorStop(1, css(bc, 1));
      ctx.fillStyle = vg; ctx.fill(body);
      const hl = new Path2D(); let on_ = false;
      for (let i = 1; i < pts.length; i++) {
        const hh = (pts[i][2] + pts[i - 1][2]) / 2;
        if (hh > .15) { if (!on_) hl.moveTo(pts[i - 1][0], pts[i - 1][1]); hl.lineTo(pts[i][0], pts[i][1]); on_ = true; } else on_ = false;
      }
      ctx.save();
      ctx.lineWidth = .8 + u * 2.6; ctx.lineCap = 'round';
      ctx.strokeStyle = u < .08 ? `rgba(255,214,170,${.3 * (1 - u * 10)})` : `rgba(170,220,215,${.05 + u * .14})`; ctx.stroke(hl);
      const sg = ctx.createLinearGradient(SUN.x - sw * 1.4, 0, SUN.x + sw * 1.4, 0);
      sg.addColorStop(0, 'rgba(255,210,140,0)'); sg.addColorStop(.5, `rgba(255,224,165,${.9 - u * .4})`); sg.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = sg; ctx.lineWidth = 1 + u * 3.5; ctx.stroke(hl);
      const g1 = new Path2D(), g2 = new Path2D();
      for (let i = 0; i < pts.length; i++) {
        const [x, y, hh] = pts[i]; const col = Math.exp(-Math.pow((x - SUN.x) / (sw * 1.2), 2));
        const n = noise1(lt * 7 + i * 1.73 + k * 13.1); const thr = .15 + (1 - col) * .6;
        if (n > thr && hh > -.2) {
          const rx = (1.5 + u * 18) * (.5 + n), ry = .7 + u * 2.2, gx = x + (h2(i, k) - .5) * st, gy = y + 1 + u * 4;
          const P2 = col > .3 ? g1 : g2; P2.moveTo(gx + rx, gy); P2.ellipse(gx, gy, rx, ry, 0, 0, 7);
        }
      }
      ctx.fillStyle = `rgba(255,236,196,${.85 - u * .3})`; ctx.fill(g1);
      ctx.fillStyle = `rgba(210,235,235,${.18 + u * .2})`; ctx.fill(g2);
      ctx.restore();
      if (u > .2) {
        const fb = [new Path2D(), new Path2D(), new Path2D()];
        for (let i = 1; i < pts.length; i++) {
          const hh = (pts[i][2] + pts[i - 1][2]) / 2; if (hh < .45) continue;
          const b = Math.min(2, Math.floor((hh - .45) * 6));
          fb[b].moveTo(pts[i - 1][0], pts[i - 1][1] + 1); fb[b].lineTo(pts[i][0], pts[i][1] + 1);
          for (let m = 0; m < 3; m++) { const r = h2(i * 3 + m, k), ex = pts[i][0] - r * st, ey = pts[i][1] + 5 + r * A * .8, rx = 2 + u * 10 * r, bb = Math.max(0, b - 1); fb[bb].moveTo(ex + rx, ey); fb[bb].ellipse(ex, ey, rx, 1 + u * 2.2, 0, 0, 7); }
        }
        ctx.save(); ctx.lineCap = 'round';
        fb.forEach((p, b) => { ctx.strokeStyle = `rgba(232,242,236,${foamA[b]})`; ctx.fillStyle = `rgba(220,236,232,${foamA[b] * .5})`; ctx.lineWidth = 1.5 + u * (3 + b * 3); ctx.stroke(p); ctx.fill(p); });
        ctx.restore();
      }
    }
    while (si < ships.length) drawShip(ships[si++]);

    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .35; ctx.drawImage(MIST_NEAR, -600 + (lt * 70) % 600, YH + 140); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const m of MOTES) {
      const x = ((m.x - lt * (20 + m.z * 90) + 1400) % 1400) - 150, y = m.y + Math.sin(lt * 1.3 + m.ph) * 12 - lt * 8 * m.z;
      const r = (2 + m.z * 9);
      ctx.globalAlpha = (.2 + .45 * m.z) * (.6 + .4 * Math.sin(lt * 3 + m.ph)); ctx.drawImage(MOTE, x - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  function wash(sp, lt) {
    const s = sp.s, x = sp.x, y = sp.y + sp.bob;
    ctx.save(); ctx.translate(x, y); ctx.rotate(sp.rot); ctx.scale(s, s);
    const a = new Path2D(), b = new Path2D(), c = new Path2D();
    for (let i = 0; i < 26; i++) {
      const k = i / 25, px = lerp(250, -300, k) + Math.sin(lt * 6 + i) * 4, py = 24 + Math.sin(k * 9 + lt * 5) * 4, rx = 26 - k * 10, P2 = k < .5 ? a : b;
      P2.moveTo(px + rx, py); P2.ellipse(px, py, rx, 5 + h(i) * 4, 0, 0, 7);
    }
    for (let i = 0; i < 30; i++) {
      const k = i / 29, px = -310 - k * 520, py = 36 + k * 30 + Math.sin(k * 12 - lt * 3) * 5, rx = 34 + k * 30, P2 = k < .4 ? b : c;
      P2.moveTo(px + rx, py); P2.ellipse(px, py, rx, 4 + k * 3, 0, 0, 7);
    }
    const sp1 = new Path2D(), sp2 = new Path2D();
    for (let i = 0; i < 80; i++) {
      const age = ((lt * 1.1 + h(i * 3.3)) % 1) * .9;
      const vx = 60 + h(i * 1.9) * 280, vy = -(120 + h(i * 2.7) * 280);
      const px = 255 + vx * age * .9, py = 14 + vy * age + 440 * age * age; if (py > 40) continue;
      const r = (1.5 + h(i * 5.5) * 4) * (1 + age), P2 = age < .45 ? sp1 : sp2;
      P2.moveTo(px + r, py); P2.arc(px, py, r, 0, 7);
    }
    ctx.fillStyle = 'rgba(236,242,234,0.6)'; ctx.fill(a);
    ctx.fillStyle = 'rgba(226,238,232,0.4)'; ctx.fill(b);
    ctx.fillStyle = 'rgba(210,230,228,0.2)'; ctx.fill(c);
    ctx.fillStyle = 'rgba(245,248,240,0.65)'; ctx.fill(sp1);
    ctx.fillStyle = 'rgba(245,248,240,0.3)'; ctx.fill(sp2);
    ctx.restore();
  }

  // =====================================================================
  //  MAP SHOT
  // =====================================================================
  function routeAt(k) {
    const segs = ROUTE.length - 1, p = clamp(k) * segs, i = Math.min(Math.floor(p), segs - 1), f = p - i;
    return [lerp(ROUTE[i][0], ROUTE[i + 1][0], f), lerp(ROUTE[i][1], ROUTE[i + 1][1], f), Math.atan2(ROUTE[i + 1][1] - ROUTE[i][1], ROUTE[i + 1][0] - ROUTE[i][0])];
  }
  function mapShot(lt) {
    if (!MAP) buildMap();
    const kr = E.io(P(lt, 0, .8)), k0 = .45 + .55 * kr, g = routeAt(k0);
    const z = 1.05 + .3 * P(lt, 0, .5) + 2.4 * E.expoIn(P(lt, .4, 1.05));
    const kk = E.io(P(lt, 0, .7)), sx = lerp(g[0], FOCUS.x, kk), sy = lerp(g[1], FOCUS.y, kk), rot = lerp(-.05, 0, E.out(P(lt, 0, 1)));
    ctx.save();
    ctx.translate(sx, sy); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-g[0], -g[1]);
    ctx.drawImage(MAP, 0, 0, W, H);
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(...ROUTE[0]);
    const segs = ROUTE.length - 1, p = k0 * segs;
    for (let i = 1; i <= segs; i++) { if (i <= p) ctx.lineTo(...ROUTE[i]); else { ctx.lineTo(g[0], g[1]); break; } }
    ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(g[0], g[1] + Math.sin(lt * 7) * 1.2); ctx.rotate(g[2] * .5);
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-24, -6); ctx.quadraticCurveTo(0, 0, 26, -8); ctx.lineTo(18, 4); ctx.lineTo(-18, 4); ctx.closePath(); ctx.fill();
    for (const [mx, mh] of [[-8, 30], [6, 34]]) {
      ctx.beginPath(); ctx.moveTo(mx, -4); ctx.lineTo(mx, -mh); ctx.stroke();
      ctx.fillStyle = 'rgba(205,160,90,0.9)'; ctx.beginPath(); ctx.moveTo(mx - 4, -mh + 2); ctx.lineTo(mx + 13, -mh + 8); ctx.lineTo(mx + 9, -9); ctx.lineTo(mx - 6, -11); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = RED; ctx.fillRect(6, -40, 12, 3); ctx.fillStyle = '#f4e9da'; ctx.fillRect(6, -37, 12, 3);
    ctx.restore();
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .6;
    radial(FOCUS.x, FOCUS.y, 900, 'rgba(255,200,120,1)', 'rgba(40,20,10,1)'); ctx.restore();
    const fr = Math.floor(lt * 24); ctx.fillStyle = `rgba(30,15,5,${h(fr) * .06})`; ctx.fillRect(-100, -100, W + 200, H + 200);
  }

  function blobPath(r, lt, seed, wob = .2) {
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const a = i / 120 * Math.PI * 2;
      const n = fbm2(Math.cos(a) * 1.6 + seed, Math.sin(a) * 1.6 + lt * .6, 3) + .35 * Math.pow(Math.max(0, Math.sin(a * 7 + seed)), 6);
      const rr_ = r * (1 + wob * n);
      const x = FOCUS.x + Math.cos(a) * rr_, y = FOCUS.y + Math.sin(a) * rr_ * 1.1;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }

  // =====================================================================
  //  TITLE
  // =====================================================================
  function title(lt) {
    if (lt < 1.05) return;
    if (!YEAR) buildTitle();
    const cx = 540;
    ctx.save(); ctx.globalAlpha = E.out(P(lt, 1.05, 1.6)) * .6;
    const tg = ctx.createRadialGradient(cx, 400, 0, cx, 400, 560); tg.addColorStop(0, 'rgba(4,14,22,0.75)'); tg.addColorStop(1, 'rgba(4,14,22,0)');
    ctx.fillStyle = tg; ctx.fillRect(-100, -100, W + 200, 1100); ctx.restore();
    const word = 'MAJAPAHIT', size = 46, ls = 22, ty = 286;
    const ws = [...word].map(ch => TW(ch, size, 'Playfair', 700, 0));
    const tot = ws.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
    let x = cx - tot / 2;
    [...word].forEach((ch, i) => {
      const k = E.out(P(lt, 1.12 + i * .045, 1.62 + i * .045));
      T(ch, x + ws[i] / 2, ty + (1 - k) * 18, { size, font: 'Playfair', weight: 700, color: '#f3d9a2', alpha: k, glow: 'rgba(255,190,110,0.5)', gb: 16 });
      x += ws[i] + ls;
    });
    const rk = E.expo(P(lt, 1.35, 2.1));
    if (rk > 0) {
      ctx.save(); ctx.strokeStyle = 'rgba(243,217,162,0.8)'; ctx.lineWidth = 2; ctx.beginPath();
      for (const sg of [-1, 1]) { ctx.moveTo(cx + sg * (tot / 2 + 26), ty + 2); ctx.lineTo(cx + sg * (tot / 2 + 26 + 90 * rk), ty + 2); }
      ctx.stroke();
      for (const sg of [-1, 1]) sparkle(cx + sg * (tot / 2 + 26 + 90 * rk + 10), ty + 2, 7 * rk, 'rgba(243,217,162,0.9)', Math.PI / 4);
      ctx.restore();
    }
    const yk = E.expo(P(lt, 1.38, 2.0)), ya = E.out(P(lt, 1.38, 1.7));
    if (ya > 0) {
      const L = paint('hist_title', () => {
        ctx.drawImage(YEAR, 0, 0);
        const sx = lerp(-300, 1400, E.io(P(lt, 1.5, 2.5)));
        ctx.globalCompositeOperation = 'source-atop';
        const g = ctx.createLinearGradient(sx - 110, 0, sx + 110, 70); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,240,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, 400);
      }, W, 400);
      const sc = lerp(1.14, 1, yk);
      ctx.save(); ctx.translate(cx, 450); ctx.scale(sc, sc); ctx.translate(-cx, -200);
      ctx.globalAlpha = ya; ctx.drawImage(YEAR_SH, 0, 0); ctx.drawImage(L, 0, 0);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = ya * (.35 + .4 * Math.exp(-Math.pow((lt - 1.95) / .3, 2))); ctx.drawImage(YEAR_GLOW, 0, 0);
      ctx.restore();
    }
    const sa = E.out(P(lt, 2.0, 2.45));
    if (sa > 0) {
      ctx.save(); ctx.globalAlpha = sa * .7; const bg = ctx.createLinearGradient(0, 1490, 0, 1650); bg.addColorStop(0, 'rgba(3,12,18,0)'); bg.addColorStop(.5, 'rgba(3,12,18,0.55)'); bg.addColorStop(1, 'rgba(3,12,18,0)'); ctx.fillStyle = bg; ctx.fillRect(0, 1490, W, 160); ctx.restore();
      subtitle('“Tahun 1293, sebuah kerajaan besar lahir…”', 1570 + (1 - sa) * 10, sa, { size: 44, color: '#f6ead2' });
    }
  }

  // =====================================================================
  //  DRAW
  // =====================================================================
  function seaWithCam(lt) {
    const dive = 1 - E.expo(P(lt, .5, 1.7));
    const z = 1.04 + .55 * dive + .07 * E.sine(P(lt, 1, 3.4));
    const roll = Math.sin(lt * 1.2) * .006 + dive * .035;
    const bob = Math.sin(lt * 1.6) * 5;
    ctx.save();
    ctx.translate(FOCUS.x, FOCUS.y); ctx.rotate(roll); ctx.scale(z, z); ctx.translate(-FOCUS.x, -FOCUS.y + bob);
    seaShot(lt);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light';
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(30,110,130,0.55)'); g.addColorStop(.52, 'rgba(255,170,90,0.3)'); g.addColorStop(1, 'rgba(20,90,110,0.55)');
    ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore();
    ctx.save(); const bg = ctx.createLinearGradient(0, 1480, 0, 1920); bg.addColorStop(0, 'rgba(2,10,14,0)'); bg.addColorStop(1, 'rgba(2,10,14,0.6)'); ctx.fillStyle = bg; ctx.fillRect(-100, 1480, W + 200, 540); ctx.restore();
  }

  STYLES_REG.history = {
    label: 'VIDEO SEJARAH',
    cues: [[0.02, 'swell', 3.2], [0.5, 'whoosh'], [1.42, 'impact'], [1.6, 'shimmer']],
    draw(lt, t) {
      const pr = P(lt, .5, 1.05), r = 1750 * Math.pow(pr, 2.2);
      if (lt < 1.05) mapShot(lt);
      if (r > 1) {
        if (lt < 1.05) {
          ctx.save(); blobPath(r * 1.05 + 70 * (1 - pr) + 20, lt, 3, .28); ctx.fillStyle = 'rgba(42,20,8,0.5)'; ctx.fill();
          blobPath(r + 18, lt, 3); ctx.fillStyle = 'rgba(28,12,4,0.85)'; ctx.fill(); ctx.restore();
          ctx.save(); blobPath(r, lt, 3); ctx.clip(); seaWithCam(lt);
          blobPath(r, lt, 3); ctx.strokeStyle = 'rgba(20,8,2,0.55)'; ctx.lineWidth = 60; ctx.filter = 'blur(14px)'; ctx.stroke(); ctx.filter = 'none';
          ctx.restore();
          ctx.save(); blobPath(r, lt, 3); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,186,100,0.55)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        } else seaWithCam(lt);
      }
      title(lt);
    },
  };
})();
