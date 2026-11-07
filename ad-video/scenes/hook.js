// SCENE: hook — (4.0 s) breathtaking full-bleed shot (traveler with red scarf above a sea of clouds at golden hour)
// pulls back: it is the autoplaying first video in a dark-mode YouTube feed on a phone; views roll to 128 jt,
// the number lifts off into a big kinetic "128.000.000 x ditonton". Ends handing the phone to the wall scene.
(() => {
  const HW = window.HW = window.HW || {};
  const M = 100;                       // overscan margin of the pre-rendered shot layers
  const LW = W + 2 * M, LH = H + 2 * M;
  const SUN = { x: 705, y: 952 };
  // phone-space layout (screen 1080 x 2340, origin at screen centre)
  const SW = 1080, SH = 2340, BEZ = 26, FR = 12, RAD = 150;
  const BW = SW + 2 * (BEZ + FR), BH = SH + 2 * (BEZ + FR);
  const CARD_T = -870, CARD_B = -262, CARD_C = (CARD_T + CARD_B) / 2;  // hero card thumbnail band
  const BAND_Y = HW.BAND_Y = 760;      // shot y that sits at the top of the card thumbnail
  const OY = CARD_T - BAND_Y;          // shot (x,y) -> phone (x-540, y+OY)

  // =================================================================== PRE-RENDERED SHOT LAYERS
  const R = mulberry(4242);
  const L = (w = LW, hh = LH) => mk(w, hh);
  const g2 = c => c.getContext('2d');
  const lgr = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach(s => q.addColorStop(s[0], s[1])); return q; };
  const rgr = (g, x, y, r, st, r0 = 0) => { const q = g.createRadialGradient(x, y, r0, x, y, r); st.forEach(s => q.addColorStop(s[0], s[1])); return q; };
  const sx = SUN.x + M, sy = SUN.y + M; // sun in layer coords

  // sky
  const SKY = L(); { const g = g2(SKY);
    g.fillStyle = lgr(g, 0, 0, 0, LH, [[0, '#0e1a36'], [.16, '#22325e'], [.3, '#5a4a7e'], [.4, '#b46a7e'], [.47, '#ee9a6a'], [.515, '#ffc983'], [.56, '#ffdca0'], [1, '#f2b48c']]);
    g.fillRect(0, 0, LW, LH);
    // high cirrus streaks lit pink/gold
    g.save(); g.filter = 'blur(5px)';
    for (let i = 0; i < 70; i++) { const y = 260 + R() * 560, x = R() * LW, l = 120 + R() * 380, th = 4 + R() * 12, warm = (y - 260) / 560;
      g.fillStyle = `rgba(255,${Math.round(150 + warm * 70)},${Math.round(150 + warm * 20)},${.08 + R() * .2})`; g.beginPath(); g.ellipse(x, y, l, th, -.05 + R() * .04, 0, 7); g.fill(); }
    g.restore();
    // a couple of towering lit cumulus on the left horizon
    g.save(); g.filter = 'blur(2px)';
    for (let i = 0; i < 70; i++) { const a = R(), x = 60 + R() * 300, y = 760 + R() * 260 - a * 200, r = 40 + R() * 70;
      g.fillStyle = rgr(g, x + r * .5, y - r * .4, r * 1.3, [[0, '#ffe2b4'], [.5, '#e7a48e'], [1, 'rgba(150,110,150,.9)']]); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.restore();
    g.fillStyle = lgr(g, 0, 700, 0, 1100, [[0, 'rgba(255,200,150,0)'], [1, 'rgba(255,214,160,.55)']]); g.fillRect(0, 700, LW, 400);
  }
  // far mountains
  const MTN = L(); { const g = g2(MTN);
    const ridge = (base, peaks, col, haze, seed) => {
      g.beginPath(); g.moveTo(0, LH);
      for (let x = 0; x <= LW; x += 4) { let y = base; for (const [px, ph, pw] of peaks) y -= ph * Math.exp(-Math.pow((x - px) / pw, 2)); y += fbm2(x * .012, seed, 4) * 22; g.lineTo(x, y); }
      g.lineTo(LW, LH); g.closePath(); g.fillStyle = lgr(g, 0, base - 260, 0, base + 60, [[0, col], [1, haze]]); g.fill();
    };
    ridge(1090, [[160, 210, 110], [330, 120, 130], [1020, 150, 120], [1180, 80, 90]], '#7d6c9e', '#e2a796', 3);
    ridge(1125, [[40, 120, 120], [880, 110, 100], [1240, 160, 110]], '#5e4f80', '#d7978e', 9);
    // warm rim on sun-facing slopes
    g.save(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgr(g, sx, sy, 700, [[0, 'rgba(255,200,140,.55)'], [1, 'rgba(255,200,140,0)']]); g.fillRect(0, 0, LW, LH); g.restore();
  }
  // cloud sea bands
  function cloudBand(w, y0, y1, rMin, rMax, rows, perRow, seed, haze) {
    const c = mk(w, LH), g = g2(c), Rr = mulberry(seed);
    for (let row = 0; row < rows; row++) {
      const k = row / Math.max(1, rows - 1), yy = lerp(y0, y1, k), r0 = lerp(rMin, rMax, k);
      for (let i = 0; i < perRow; i++) {
        const x = Rr() * w, y = yy + (Rr() - .5) * r0 * .7, r = r0 * (.6 + Rr() * .7);
        const ds = Math.hypot(x - 200 - sx, y - sy), near = clamp(1 - ds / 900);
        const lit = mixc('#f6b48e', '#fff2cc', near), body = mixc('#d99a90', '#f8c6a0', near * .7), shade = mixc('#7e6898', '#b88aa0', haze);
        const dx = clamp((sx - (x - 200)) / 900, -1, 1);
        g.fillStyle = rgr(g, x + dx * r * .35, y - r * .55, r * 1.35, [[0, lit], [.45, body], [1, shade]]);
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      }
      // haze veil between rows
      g.fillStyle = `rgba(255,205,160,${.10 * haze})`; g.fillRect(0, yy - r0 * 1.2, w, r0 * 2.2);
    }
    const out = mk(w, LH), o = g2(out); o.filter = 'blur(1.6px)'; o.drawImage(c, 0, 0); return out;
  }
  const CLW = LW + 400;
  const CFAR = cloudBand(CLW, 1065, 1210, 20, 46, 7, 90, 11, 1);
  const CMID = cloudBand(CLW, 1190, 1470, 50, 110, 6, 40, 23, .55);
  const CNEAR = cloudBand(CLW, 1480, 2050, 110, 210, 5, 22, 37, .2);
  // light rays fan
  const RAYS = mk(1800, 1800); { const g = g2(RAYS); g.translate(900, 900); g.filter = 'blur(18px)';
    for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2 + R() * .2, w = .03 + R() * .06; g.fillStyle = `rgba(255,${200 + R() * 40},150,${.10 + R() * .16})`; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 900, a, a + w); g.closePath(); g.fill(); } }
  // cliff
  const EDGE = [[-120, 1170], [-20, 1182], [80, 1200], [170, 1228], [250, 1250], [330, 1263], [410, 1270], [480, 1276], [545, 1280], [600, 1288], [640, 1300]];
  const FACE = [[640, 1300], [666, 1336], [652, 1410], [690, 1480], [676, 1560], [720, 1650], [706, 1760], [770, 1900], [790, 2100]];
  const edgeY = x => { for (let i = 0; i < EDGE.length - 1; i++) if (x >= EDGE[i][0] && x <= EDGE[i + 1][0]) return lerp(EDGE[i][1], EDGE[i + 1][1], (x - EDGE[i][0]) / (EDGE[i + 1][0] - EDGE[i][0])); return 1300; };
  const CLIFF = L(); { const g = g2(CLIFF); g.translate(M, M);
    const path = () => { g.beginPath(); g.moveTo(-120, 2100); EDGE.forEach(p => g.lineTo(p[0], p[1])); FACE.forEach(p => g.lineTo(p[0] + fbm2(p[1] * .01, 2) * 12, p[1])); g.lineTo(-120, 2100); g.closePath(); };
    path(); g.fillStyle = lgr(g, 0, 1170, 0, 2000, [[0, '#3a2532'], [.25, '#24161f'], [1, '#120a10']]); g.fill();
    g.save(); path(); g.clip();
    // rock strata + cracks
    for (let i = 0; i < 260; i++) { const x = R() * 760 - 100, y = 1200 + R() * 800, l = 20 + R() * 80; g.strokeStyle = `rgba(${R() > .5 ? '255,190,140' : '0,0,0'},${.04 + R() * .08})`; g.lineWidth = 1 + R() * 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (R() - .3) * 20); g.stroke(); }
    // warm light on the top surface and on the sun-facing face
    g.fillStyle = lgr(g, 0, 1170, 0, 1330, [[0, 'rgba(255,170,100,.55)'], [1, 'rgba(255,170,100,0)']]); g.fillRect(-120, 1150, 900, 200);
    g.fillStyle = lgr(g, 760, 0, 520, 0, [[0, 'rgba(255,170,110,.5)'], [1, 'rgba(255,170,110,0)']]); g.fillRect(500, 1280, 300, 820);
    g.restore();
    // rim line along the edge
    g.strokeStyle = 'rgba(255,205,140,.9)'; g.lineWidth = 3; g.beginPath(); EDGE.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
    g.strokeStyle = 'rgba(255,190,120,.6)'; g.lineWidth = 4; g.beginPath(); FACE.forEach((p, i) => i ? g.lineTo(p[0] + fbm2(p[1] * .01, 2) * 12, p[1]) : g.moveTo(p[0], p[1])); g.stroke();
  }
  // soft foreground wisps (pre-blurred)
  const WISP = mk(1800, 700); { const g = g2(WISP); g.filter = 'blur(22px)'; for (let i = 0; i < 26; i++) { const x = R() * 1800, y = 250 + R() * 300, r = 60 + R() * 140; g.fillStyle = rgr(g, x, y - r * .3, r, [[0, 'rgba(255,225,200,.7)'], [1, 'rgba(220,170,170,0)']]); g.beginPath(); g.ellipse(x, y, r * 1.8, r * .6, 0, 0, 7); g.fill(); } }
  const DOT = mk(64, 64); { const g = g2(DOT); g.fillStyle = rgr(g, 32, 32, 32, [[0, 'rgba(255,240,200,1)'], [.3, 'rgba(255,210,140,.6)'], [1, 'rgba(255,200,120,0)']]); g.fillRect(0, 0, 64, 64); }

  // =================================================================== LIVE SHOT
  function traveler(t) {
    const gust = .5 + .5 * noise1(t * 1.1 + 3);
    const flap = Math.sin(t * 7.5) * 6 + noise1(t * 3) * 6 + gust * 10;
    const body = (col, ox, oy) => {
      ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // legs + boots
      ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-6, 0); ctx.lineTo(-3, -120); ctx.lineTo(-24, -120); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(22, -1); ctx.lineTo(20, -120); ctx.lineTo(0, -120); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-12, -3, 16, 6, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(16, -3, 16, 6, 0, 0, 7); ctx.fill();
      // coat with fluttering hem
      ctx.beginPath(); ctx.moveTo(-30, -222); ctx.quadraticCurveTo(0, -232, 32, -222); ctx.quadraticCurveTo(44, -170, 46 + flap * .4, -130);
      ctx.quadraticCurveTo(60 + flap, -104 - flap * .3, 74 + flap * 1.6, -96 - flap * .6);
      ctx.quadraticCurveTo(30, -84 + Math.sin(t * 9) * 3, -6, -86); ctx.quadraticCurveTo(-30, -88, -44 + flap * .15, -84);
      ctx.quadraticCurveTo(-46, -150, -36, -200); ctx.closePath(); ctx.fill();
      // arms + staff
      ctx.lineWidth = 15; ctx.beginPath(); ctx.moveTo(-34, -206); ctx.quadraticCurveTo(-48, -170, -44, -136); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(32, -206); ctx.quadraticCurveTo(52, -180, 62, -150); ctx.stroke();
      ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(70, -300); ctx.lineTo(76, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(70, -302, 6, 0, 7); ctx.fill();
      // backpack + bedroll
      rr(-30, -236, 60, 104, 18); ctx.fill(); rr(-40, -258, 80, 26, 13); ctx.fill();
      // head, hat
      ctx.beginPath(); ctx.arc(3, -262, 19, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(3, -272, 42, 8.5, -.06, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-20, -272); ctx.quadraticCurveTo(-18, -302, 4, -303); ctx.quadraticCurveTo(26, -302, 26, -274); ctx.closePath(); ctx.fill();
      // hair strands in wind
      ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { const w = Math.sin(t * 8 + i) * 4; ctx.beginPath(); ctx.moveTo(14, -262 + i * 4); ctx.quadraticCurveTo(30, -266 + i * 4 + w, 44 + gust * 8, -262 + i * 5 - w); ctx.stroke(); }
      ctx.restore();
    };
    body('#ffcf8a', 2.6, -1.6);
    body('#ff9a50', 1.2, -.6);
    body('#22141d', 0, 0);
    // subtle coat fold highlight
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,160,90,.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, -200); ctx.quadraticCurveTo(30, -150, 40 + flap * .3, -110); ctx.stroke(); ctx.restore();
    // red scarf (two tails, travelling waves)
    const tail = (ax, ay, n, seg, w0, ph, col1, col2) => {
      const pts = []; let x = ax, y = ay;
      for (let i = 0; i <= n; i++) {
        pts.push([x, y]);
        const k = i / n, a = -.16 - gust * .08 + Math.sin(t * 7.2 - i * .62 + ph) * (.12 + .42 * k) + noise1(t * 2.3 + i * .25 + ph) * .14 * k;
        x += Math.cos(a) * seg; y += Math.sin(a) * seg;
      }
      const lft = [], rgt = [];
      for (let i = 0; i <= n; i++) {
        const p = pts[i], q = pts[Math.min(n, i + 1)], o = pts[Math.max(0, i - 1)], dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1;
        const w = w0 * (1 - .45 * i / n) * (1 + .25 * Math.sin(t * 7.2 - i * .62 + ph + 1.3));
        lft.push([p[0] - dy / d * w, p[1] + dx / d * w]); rgt.push([p[0] + dy / d * w, p[1] - dx / d * w]);
      }
      ctx.beginPath(); lft.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = n; i >= 0; i--) ctx.lineTo(rgt[i][0], rgt[i][1]); ctx.closePath();
      ctx.fillStyle = lgr(ctx, ax, ay - 20, ax + n * seg, ay + 30, [[0, col1], [1, col2]]); ctx.fill();
      // backlit glow edge
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(255,120,80,.55)'; ctx.lineWidth = 2.5; ctx.beginPath(); rgt.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
      // fringe at the end
      const e = pts[n]; ctx.strokeStyle = col2; ctx.lineWidth = 2; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(e[0], e[1] + k * 4); ctx.lineTo(e[0] + 10 + Math.sin(t * 20 + k) * 3, e[1] + k * 5 + 3); ctx.stroke(); }
    };
    tail(10, -236, 16, 15.5, 9.5, 0, '#ff4a3a', '#d4162c');
    tail(8, -230, 11, 14, 7.5, 1.7, '#e0283a', '#a80f22');
    // knot
    ctx.fillStyle = '#ff3b30'; ctx.beginPath(); ctx.ellipse(4, -238, 22, 9, -.1, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,140,.6)'; ctx.beginPath(); ctx.ellipse(10, -241, 10, 3, -.1, 0, 7); ctx.fill();
  }

  // paints the full-bleed shot (frame coords) into a layer and returns its canvas
  function shot(t) {
    return paint('hw_shot', () => {
      const cr = 1 - E.out(clamp(t / 2.2));
      const zs = 1.04 + .012 * t + .05 * cr;
      const camX = -36 + 16 * t, camY = -150 * cr;
      const lay = (c, depth, dx = 0) => ctx.drawImage(c, -M + camX * depth + dx, -M + camY * depth);
      ctx.save(); ctx.translate(540, 1080); ctx.scale(zs, zs); ctx.translate(-540, -1080);
      lay(SKY, .05);
      // sun disc + core glow (behind far clouds)
      const sX = SUN.x + camX * .1, sY = SUN.y + camY * .1;
      glowBlob(sX, sY, 520, 'rgba(255,190,110,.55)', 1); glowBlob(sX, sY, 170, 'rgba(255,236,190,.95)', 1);
      ctx.fillStyle = '#fff7e0'; ctx.beginPath(); ctx.arc(sX, sY, 44, 0, 7); ctx.fill();
      lay(MTN, .15);
      ctx.drawImage(CFAR, -M - 200 + camX * .25 + t * 9, -M + camY * .25);
      // birds (distant)
      ctx.save(); ctx.strokeStyle = 'rgba(60,35,55,.85)'; ctx.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const s = 7 + h(i) * 9, bx = 170 + i * 46 + h(i + 3) * 40 + t * (34 + h(i) * 10) + camX * .3, by = 640 + h(i + 5) * 170 - i * 14 + Math.sin(t * 1.3 + i) * 8 + camY * .3;
        const f = Math.sin(t * 10 + i * 1.7); ctx.lineWidth = 1.6 + s * .12;
        ctx.beginPath(); ctx.moveTo(bx - s, by - s * .5 * f); ctx.quadraticCurveTo(bx - s * .4, by - s * .25 - s * .3 * f, bx, by); ctx.quadraticCurveTo(bx + s * .4, by - s * .25 - s * .3 * f, bx + s, by - s * .5 * f); ctx.stroke();
      }
      ctx.restore();
      ctx.drawImage(CMID, -M - 200 + camX * .45 + t * 18, -M + camY * .45);
      // volumetric rays + atmospheric bloom
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .55 + .1 * Math.sin(t * 1.7);
      ctx.translate(sX, sY); ctx.rotate(t * .025); ctx.drawImage(RAYS, -900, -900); ctx.restore();
      glowBlob(sX, sY, 900, 'rgba(255,170,100,.22)', 1);
      ctx.drawImage(CNEAR, -M - 200 + camX * .7 + t * 32, -M + camY * .7);
      // cliff + grass + traveler (depth 1)
      ctx.save(); ctx.translate(camX, camY);
      ctx.drawImage(CLIFF, -M, -M);
      ctx.lineCap = 'round';
      for (let i = 0; i < 90; i++) {
        const x = -60 + i * 7.7 + h(i) * 5, y = edgeY(x) + 2, hh = 10 + h(i + 1) * 22, sway = noise2(x * .01 - t * 1.4, i * .1) * 10 + 6;
        ctx.strokeStyle = h(i + 2) > .5 ? '#3a2a20' : '#4a3424'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway * .3, y - hh * .6, x + sway, y - hh); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,200,120,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + sway * .5 + .8, y - hh * .7); ctx.lineTo(x + sway + .8, y - hh); ctx.stroke();
      }
      ctx.save(); ctx.translate(505, 1279); traveler(t); ctx.restore();
      ctx.restore();
      // motes in the wind
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 46; i++) {
        const d = .3 + h(i * 1.3) * 1.2, x = ((h(i) * 1400 + t * (50 + 90 * d)) % 1400) - 160 + camX * d, y = 500 + h(i * 2.9) * 1100 + Math.sin(t * 1.5 + i) * 20 * d + camY * d;
        const s = 6 + 16 * d; ctx.globalAlpha = .25 + .45 * h(i + 7); ctx.drawImage(DOT, x - s / 2, y - s / 2, s, s);
      }
      ctx.restore();
      // foreground wisps (out of focus)
      ctx.save(); ctx.globalAlpha = .55; ctx.drawImage(WISP, -500 + ((t * 120) % 600) + camX * 1.4, 1460 + camY * 1.4); ctx.restore();
      ctx.restore();
      // grade: deep top, warm lift, flare ghosts
      ctx.fillStyle = lgr(ctx, 0, 0, 0, 700, [[0, 'rgba(8,10,30,.55)'], [1, 'rgba(8,10,30,0)']]); ctx.fillRect(0, 0, W, 700);
      ctx.fillStyle = lgr(ctx, 0, 1500, 0, H, [[0, 'rgba(10,4,10,0)'], [1, 'rgba(10,4,10,.55)']]); ctx.fillRect(0, 1500, W, 420);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const fx = SUN.x + camX * .1, fy = SUN.y + camY * .1, vx = 540 - fx, vy = 960 - fy;
      [[.5, 40, .10], [.9, 22, .12], [1.4, 70, .06], [1.8, 14, .14]].forEach(([k, r, a]) => glowBlob(fx + vx * k * 1.6, fy + vy * k * 1.6, r, 'rgba(255,200,140,1)', a));
      ctx.restore();
    });
  }
  HW.shot = shot;

  // =================================================================== PHONE + YOUTUBE UI
  const PSHADOW = mk(700, 1300); { const g = g2(PSHADOW); g.filter = 'blur(40px)'; g.fillStyle = 'rgba(0,0,0,1)'; g.beginPath(); g.roundRect(110, 110, 480, 1080, 90); g.fill(); }
  function ic(fn, lw = 5, col = '#f1f1f1') { ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; fn(); ctx.restore(); }
  function statusBar() {
    T('19:42', -410, -1112, { size: 38, weight: 700, color: '#fff' });
    ic(() => { for (let i = 0; i < 4; i++) { ctx.fillRect(330 + i * 12, -1100 - i * 7, 8, 10 + i * 7); } });
    ic(() => { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(408, -1092, 8 + i * 9, -Math.PI * .75, -Math.PI * .25); ctx.stroke(); } }, 4.5);
    ic(() => { ctx.lineWidth = 3; rr(436, -1124, 50, 26, 7); ctx.stroke(); ctx.fillRect(441, -1119, 34, 16); ctx.fillRect(488, -1115, 4, 9); });
    ctx.fillStyle = '#000'; rr(-125, -1150, 250, 72, 36); ctx.fill();
  }
  function header() {
    ctx.fillStyle = '#ff0033'; rr(-506, -1046, 86, 60, 17); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-472, -1030); ctx.lineTo(-444, -1016); ctx.lineTo(-472, -1002); ctx.closePath(); ctx.fill();
    T('YouTube', -410, -1014, { size: 56, weight: 800, color: '#fff', align: 'left', ls: -2.5 });
    // cast, bell, search
    ic(() => { rr(234, -1040, 54, 42, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(236, -994, 16, -Math.PI / 2, 0); ctx.stroke(); }, 4.5);
    ic(() => { ctx.beginPath(); ctx.moveTo(338, -990); ctx.lineTo(392, -990); ctx.quadraticCurveTo(380, -1000, 381, -1018); ctx.quadraticCurveTo(380, -1046, 365, -1046); ctx.quadraticCurveTo(350, -1046, 349, -1018); ctx.quadraticCurveTo(350, -1000, 338, -990); ctx.stroke(); ctx.beginPath(); ctx.arc(365, -984, 6, 0, Math.PI); ctx.stroke(); }, 4.5);
    ctx.fillStyle = '#ff0033'; rr(372, -1062, 48, 32, 16); ctx.fill(); T('9+', 396, -1045, { size: 22, weight: 800 });
    ic(() => { ctx.beginPath(); ctx.arc(462, -1022, 19, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(476, -1008); ctx.lineTo(494, -990); ctx.stroke(); }, 5);
  }
  function chips() {
    let x = -514; const y = -962;
    ctx.fillStyle = '#272727'; rr(x, y, 84, 64, 12); ctx.fill(); ic(() => { ctx.beginPath(); ctx.arc(x + 42, y + 32, 16, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 50, y + 24); ctx.lineTo(x + 46, y + 36); ctx.lineTo(x + 34, y + 40); ctx.lineTo(x + 38, y + 28); ctx.closePath(); ctx.fill(); }, 3.5);
    x += 104;
    ['Semua', 'Animasi', 'Sejarah', 'Shorts', 'Musik', 'Kartun'].forEach((s, i) => {
      const w = TW(s, 30, 'Mont', 700) + 48; ctx.fillStyle = i === 0 ? '#f1f1f1' : '#272727'; rr(x, y, w, 64, 12); ctx.fill();
      T(s, x + w / 2, y + 33, { size: 30, weight: 700, color: i === 0 ? '#0f0f0f' : '#f1f1f1' }); x += w + 18;
    });
  }
  function navBar() {
    ctx.fillStyle = '#0f0f0f'; ctx.fillRect(-540, 1010, 1080, 160); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-540, 1010, 1080, 2);
    const xs = [-432, -216, 0, 216, 432], labels = ['Beranda', 'Shorts', '', 'Subscription', 'Anda'];
    ic(() => { ctx.beginPath(); ctx.moveTo(xs[0] - 26, 1052); ctx.lineTo(xs[0], 1030); ctx.lineTo(xs[0] + 26, 1052); ctx.lineTo(xs[0] + 26, 1080); ctx.lineTo(xs[0] - 26, 1080); ctx.closePath(); ctx.fill(); });
    ic(() => { rr(xs[1] - 20, 1028, 40, 54, 14); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xs[1] - 6, 1043); ctx.lineTo(xs[1] + 10, 1055); ctx.lineTo(xs[1] - 6, 1067); ctx.closePath(); ctx.fill(); }, 4.5);
    ic(() => { ctx.beginPath(); ctx.arc(0, 1062, 36, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-15, 1062); ctx.lineTo(15, 1062); ctx.moveTo(0, 1047); ctx.lineTo(0, 1077); ctx.stroke(); }, 4);
    ic(() => { rr(xs[3] - 26, 1040, 52, 40, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xs[3] - 18, 1031); ctx.lineTo(xs[3] + 18, 1031); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xs[3] - 6, 1051); ctx.lineTo(xs[3] + 8, 1060); ctx.lineTo(xs[3] - 6, 1069); ctx.closePath(); ctx.fill(); }, 4.5);
    ctx.fillStyle = 'radial-gradient'; ctx.fillStyle = '#5c7cfa'; ctx.beginPath(); ctx.arc(xs[4], 1056, 26, 0, 7); ctx.fill(); T('R', xs[4], 1058, { size: 26, weight: 900 });
    labels.forEach((s, i) => s && T(s, xs[i], 1112, { size: 24, weight: i === 0 ? 700 : 600, color: '#f1f1f1' }));
    ctx.fillStyle = '#f1f1f1'; rr(-140, 1146, 280, 9, 5); ctx.fill();
  }
  function thumbAt(v, y) { // other feed cards (pre-rendered thumbnails)
    if (!v.thumb) return;
    ctx.drawImage(v.thumb, -540, y, 1080, 608);
    ctx.save(); ctx.translate(-540, y + 608); HW.cardMeta(v); ctx.restore();
  }
  const viewsText = lt => { const v = lerp(1.2, 128, E.expo(P(lt, 1.75, 2.5))); return (v < 10 ? v.toFixed(1).replace('.', ',') : Math.floor(v)) + ' jt'; };
  // screen contents in phone space; o.mk: 0 = shot full bleed, 1 = shot collapsed into the card
  function screen(o) {
    ctx.fillStyle = '#0f0f0f'; ctx.fillRect(-540, -1170, 1080, 2340);
    statusBar(); header(); chips();
    ctx.save(); ctx.translate(-540, CARD_B); const vp = HW.cardMeta(HW.HERO, o.views, o.vk); ctx.restore();
    o.viewsPos = { x: -540 + vp.x + vp.w / 2, y: CARD_B + vp.y, w: vp.w };
    thumbAt(HW.VIDS[0], -30); thumbAt(HW.VIDS[1], 810);
    navBar();
    // the hero video (masked: full bleed -> card)
    const mk_ = o.mk, top = lerp(OY, CARD_T, mk_), bot = lerp(OY + H, CARD_B, mk_);
    ctx.save(); ctx.beginPath(); ctx.rect(-540, top, 1080, bot - top); ctx.clip();
    const s0 = Math.max(0, top - OY), s1 = Math.min(H, bot - OY);
    ctx.drawImage(o.shot, 0, s0, 1080, s1 - s0, -540, OY + s0, 1080, s1 - s0);
    // autoplay chrome
    const ua = P(mk_, .7, 1);
    if (ua > 0) {
      ctx.globalAlpha = ua;
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.arc(470, CARD_T + 66, 34, 0, 7); ctx.fill();
      ic(() => { ctx.beginPath(); ctx.moveTo(452, CARD_T + 58); ctx.lineTo(462, CARD_T + 58); ctx.lineTo(474, CARD_T + 48); ctx.lineTo(474, CARD_T + 84); ctx.lineTo(462, CARD_T + 74); ctx.lineTo(452, CARD_T + 74); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(482, CARD_T + 56); ctx.lineTo(494, CARD_T + 76); ctx.moveTo(494, CARD_T + 56); ctx.lineTo(482, CARD_T + 76); ctx.stroke(); }, 3.5);
      const dw = TW('12:47', 26, 'Mont', 800) + 20; ctx.fillStyle = 'rgba(0,0,0,.8)'; rr(520 - dw, CARD_B - 56, dw, 38, 7); ctx.fill(); T('12:47', 520 - dw / 2, CARD_B - 36, { size: 26, weight: 800 });
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-540, CARD_B - 7, 1080, 7);
      ctx.fillStyle = '#ff0033'; ctx.fillRect(-540, CARD_B - 7, 1080 * (.04 + .05 * o.lt), 7);
    }
    ctx.restore();
  }
  // full phone at phone-space origin (body, glass, buttons)
  function phoneBody(o) {
    ctx.save();
    const x0 = -BW / 2, y0 = -BH / 2;
    ctx.fillStyle = lgr(ctx, x0, 0, -x0, 0, [[0, '#121317'], [.012, '#7c7f88'], [.03, '#2c2e34'], [.5, '#1b1c20'], [.97, '#2c2e34'], [.988, '#8a8d96'], [1, '#121317']]);
    rr(x0, y0, BW, BH, RAD + BEZ + FR); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#030304'; rr(x0 + FR, y0 + FR, BW - 2 * FR, BH - 2 * FR, RAD + BEZ); ctx.fill();
    // side buttons
    ctx.fillStyle = '#3a3c42'; rr(x0 - 8, -760, 10, 150, 4); ctx.fill(); rr(x0 - 8, -560, 10, 150, 4); ctx.fill(); rr(-x0 - 2, -640, 10, 230, 4); ctx.fill();
    ctx.save(); rr(-SW / 2, -SH / 2, SW, SH, RAD); ctx.clip(); screen(o);
    // glass: diagonal sheen + edge vignette
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = lgr(ctx, -540, -1170, 300, 400, [[0, 'rgba(255,255,255,.10)'], [.38, 'rgba(255,255,255,.03)'], [.4, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-540, -1170, 1080, 2340);
    ctx.restore();
    ctx.restore();
  }
  const PQ = .62, PLW = Math.ceil(BW * PQ) + 24, PLH = Math.ceil(BH * PQ) + 24;
  // draws the phone; o: {cx,cy,z,roll,yaw,mk,lt,shot,views,vk,alpha}
  function drawPhone(o) {
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
    ctx.translate(o.cx, o.cy); ctx.rotate(o.roll || 0);
    if (o.mk > .05) { // drop shadow + light spill
      const a = P(o.mk, .05, .6);
      ctx.save(); ctx.globalAlpha *= .75 * a; ctx.drawImage(PSHADOW, -350 * o.z * BW / 480 * .5 * 1.0 + 60 * o.z, -650 * o.z * BH / 1080 * .5 + 120 * o.z, 700 * o.z * BW / 480 * .5, 1300 * o.z * BH / 1080 * .5); ctx.restore();
      glowBlob(0, CARD_C * o.z, 1100 * o.z, 'rgba(255,170,100,.18)', a);
    }
    const yaw = o.yaw || 0;
    if (Math.abs(yaw) < .004) {
      ctx.scale(o.z, o.z); phoneBody(o);
    } else {
      const lay = paint('hw_phone', () => { ctx.translate(PLW / 2, PLH / 2); ctx.scale(PQ, PQ); phoneBody(o); }, PLW, PLH);
      const n = 56, f = 2.4 * PLW, k = o.z / PQ;
      for (let i = 0; i < n; i++) {
        const xa = i * PLW / n, xb = (i + 1) * PLW / n;
        const pj = x => { const X = x - PLW / 2, zz = X * Math.sin(yaw), s = f / (f + zz); return [X * Math.cos(yaw) * s, s]; };
        const [a0, s0] = pj(xa), [a1, s1] = pj(xb), sm = (s0 + s1) / 2, dh = PLH * sm;
        ctx.drawImage(lay, xa, 0, PLW / n + .6, PLH, a0 * k, -dh / 2 * k, (a1 - a0) * k + .9, dh * k);
      }
    }
    ctx.restore();
  }
  HW.drawPhone = drawPhone;

  // =================================================================== CAMERA
  // focal point F = screen position of the hero card centre
  function cam(lt) {
    const kB = E.io(P(lt, 1.32, 2.6));
    const kC = Math.pow(P(lt, 2.6, 4.0), 2.5);
    const z = Math.exp(Math.log(.56) * kB + Math.log(.40 / .56) * kC);
    const fy = lerp(lerp(1630 + CARD_C, 683, kB), 960, E.quint(P(lt, 2.45, 3.6)));
    const fx = 540;
    const roll = lerp(0, -.035, kB) + lerp(0, -.025, E.io(P(lt, 2.6, 4)));
    const yaw = .23 * E.io(P(lt, 2.55, 3.35)) - .11 * E.in(P(lt, 3.4, 4.0));
    const mk_ = E.io(P(lt, 1.38, 2.42));
    const cx = fx + Math.sin(roll) * CARD_C * z, cy = fy - Math.cos(roll) * CARD_C * z;
    return { cx, cy, z, roll, yaw, mk: mk_, fx, fy };
  }
  HW.hookEnd = () => { const c = cam(4); return { ox: c.fx, oy: c.fy, roll: c.roll, yaw: c.yaw }; };
  const HY = 430;
  // phone in the wall scene: locked to the wall's hero tile, body dissolving
  HW.phoneOnWall = (wt, wc) => {
    const z = wc.s * 640 / 1080, roll = wc.roll, e = HW.hookEnd();
    const a = 1 - E.io(P(wt, .3, 1.3)); if (a <= 0) return;
    const shot_ = HW._lastShot || shot(4 + wt);
    drawPhone({ cx: wc.ox + Math.sin(roll) * CARD_C * z, cy: wc.oy - Math.cos(roll) * CARD_C * z, z, roll, yaw: e.yaw * (1 - E.out(P(wt, 0, .8))), mk: 1, lt: 4 + wt, shot: shot_, views: '128 jt', vk: 1 - P(wt, 0, .6), alpha: a });
  };

  // =================================================================== HERO NUMBER
  const NUM = '128.000.000', NSIZE = 168, NFONT = 'Playfair', NW = '900';
  let LAYOUT = null;
  function layout() { if (LAYOUT) return LAYOUT; const ws = [...NUM].map(ch => TW(ch, NSIZE, NFONT, NW)); const tot = ws.reduce((a, b) => a + b, 0); let x = -tot / 2; LAYOUT = ws.map(w => { const c = x + w / 2; x += w; return c; }); LAYOUT.tot = tot; return LAYOUT; }
  function hero(lt, alpha = 1) {
    if (lt < 2.45 || alpha <= .01) return;
    const lay = layout();
    const c = cam(lt);
    // 1) flying copy from the phone meta line
    const fk = P(lt, 2.48, 2.86);
    if (fk > 0 && fk < 1) {
      const vx = -540 + 132 + 300, vy = CARD_B + 148; // approx centre of the views text in phone space
      const px = c.cx + (vx * Math.cos(c.roll) - vy * Math.sin(c.roll)) * c.z, py = c.cy + (vx * Math.sin(c.roll) + vy * Math.cos(c.roll)) * c.z;
      const e = E.expo(fk), x = lerp(px, 540, e), y = lerp(py, HY, e), s = lerp(30 * c.z, 92, e);
      for (let k = 0; k < 4; k++) { const ek = E.expo(Math.max(0, fk - k * .05)); T('128 jt x ditonton', lerp(px, 540, ek), lerp(py, HY, ek), { size: lerp(30 * c.z, 92, ek), weight: 800, color: '#fff', alpha: (1 - P(fk, .55, 1)) * (k ? .22 : 1) * alpha }); }
    }
    // 2) rolling digits
    const base = 2.68, sc = (1.12 - .12 * E.expo(P(lt, 2.68, 3.3))) * (1 - .1 * E.in(P(lt, 3.55, 4.8)));
    const yy = HY - 60 * E.in(P(lt, 3.55, 4.8));
    const cvs = paint('hw_num', () => {
      ctx.translate(540, 260);
      const lh = NSIZE * 1.05;
      [...NUM].forEach((ch, i) => {
        const t0 = base + i * .032, k = P(lt, t0, t0 + .5); if (lt < t0) return;
        const x = lay[i];
        if (ch === '.') { T('.', x, 0, { size: NSIZE, font: NFONT, weight: NW, alpha: fi(lt, t0 + .25, .15) }); return; }
        const d = +ch, spin = 9 + i * 1.3, p = d + spin * (1 - E.quint(k));
        const f0 = Math.floor(p), fr = p - f0;
        const vel = spin * (1 - k) * 2.4;
        for (let j = -1; j <= 1; j++) {
          const dj = ((f0 + j) % 10 + 10) % 10, y = (j - fr) * lh;
          T(String(dj), x, y, { size: NSIZE, font: NFONT, weight: NW, alpha: k < 1 ? 1 : (j === 0 ? 1 : 0) });
          if (vel > .6) for (let m = 1; m <= 2; m++) T(String(dj), x, y - m * Math.min(30, vel * 4), { size: NSIZE, font: NFONT, weight: NW, alpha: .18 });
        }
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // fade the roll band top/bottom, then gold
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = lgr(ctx, 0, 260 - NSIZE * .95, 0, 260 + NSIZE * .95, [[0, 'rgba(0,0,0,0)'], [.3, '#000'], [.7, '#000'], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(0, 0, W, 520);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = lgr(ctx, 0, 260 - NSIZE * .45, 0, 260 + NSIZE * .4, [[0, '#fffdf4'], [.45, '#ffe6a8'], [1, '#e7a446']]); ctx.fillRect(0, 0, W, 520);
      // light sweep
      const sk = P(lt, 3.12, 3.75);
      if (sk > 0 && sk < 1) { const sx = lerp(-200, 1300, E.io(sk)); ctx.save(); ctx.translate(sx, 260); ctx.rotate(.35); ctx.fillStyle = lgr(ctx, -70, 0, 70, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,1)'], [1, 'rgba(255,255,255,0)']]); ctx.fillRect(-70, -300, 140, 600); ctx.restore(); }
    }, W, 520);
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.translate(540, yy); ctx.scale(sc, sc); ctx.translate(-540, -260);
    // warm halo behind the number
    glowBlob(540, 260, 620, 'rgba(255,170,80,.20)', fi(lt, 2.7, .3));
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.drawImage(cvs, 0, 0); ctx.restore();
    comp(cvs, { blur: 16, alpha: .55 + .35 * (1 - P(lt, 2.8, 3.4)), mode: 'lighter' });
    // "x ditonton"
    const dk = E.expo(P(lt, 2.98, 3.6));
    T('x ditonton', 540, 260 + NSIZE * .78, { size: 70, font: 'Playfair', weight: 'italic 700', color: '#fff4e0', alpha: dk, ls: lerp(24, 4, dk), shadow: { c: 'rgba(0,0,0,.5)', x: 0, y: 5 } });
    // thin rule
    ctx.fillStyle = `rgba(255,220,160,${.5 * dk})`; const rw = 240 * dk; ctx.fillRect(540 - rw / 2, 260 - NSIZE * .78, rw, 2);
    ctx.restore();
    // spark motes around the number
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) { const tt = lt - 2.75 - h(i) * .3; if (tt < 0) continue; const a = Math.min(1, tt * 4) * (1 - P(tt, .6, 1.4)) * alpha; const x = 540 + (h(i * 3) - .5) * 900, y = yy - 40 + (h(i * 7) - .5) * 300 - tt * (40 + h(i) * 80); const s = 8 + h(i + 2) * 18; ctx.globalAlpha = a; ctx.drawImage(DOT, x - s / 2, y - s / 2, s, s); }
    ctx.restore();
  }
  HW.hero = hero;

  // =================================================================== SCENE
  SCENES_REG.hook = {
    cues: [[0, 'swell', 1.8], [1.3, 'whoosh'], [1.75, 'ticks', .75], [2.5, 'whoosh_in'], [2.78, 'impact_big'], [3.12, 'shimmer']],
    draw(lt, t) {
      if (HW.init) HW.init();
      const c = cam(lt);
      const sh = shot(lt); HW._lastShot = null;
      if (c.mk < .001) { ctx.drawImage(sh, 0, 0); return; }
      // backdrop: the (blurred, dim) wall of videos far behind
      bgGrad([[0, '#0a0910'], [1, '#040406']]);
      if (HW.drawWall) { ctx.save(); ctx.globalAlpha = P(c.mk, .2, 1) * .55; HW.drawWall(lt - 4, { hideHero: true }); ctx.restore(); }
      glowBlob(540, c.fy, 900, 'rgba(255,160,90,.14)', c.mk);
      drawPhone({ ...c, lt, shot: sh, views: viewsText(lt), vk: E.out(P(lt, 2.3, 2.55)) });
      hero(lt, 1);
    },
  };
})();
