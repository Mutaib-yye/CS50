// SCENE: claude (6.0 s) — cinematic night desk -> a PDF is dropped into a generic "Claude" chat, the prompt types itself,
// the reply paints a Ghibli-like Majapahit preview, then the camera dives into the screen and light bursts out (handoff to bright clip).
(() => {
  // ------------------------------------------------------------------ world layout (world = frame coords at zoom 1)
  const SW = 1000, SH = 625;                       // laptop UI units
  const DX = 262, DY = 702, DW = 556, DS = DW / SW, DH = SH * DS; // display rect in world
  const DCX = DX + DW / 2, DCY = DY + DH / 2;
  const M = 160;
  const PROMPT = 'Buat video animasi sejarah Majapahit, gaya Ghibli';
  const R = mulberry(90712);

  // pre-rendered sprite in world coords (optionally pre-blurred for depth of field)
  function sprite(x0, y0, w, hh, sc, fn, blur = 0) {
    const c = mk(Math.ceil(w * sc), Math.ceil(hh * sc));
    const draw = g => on(g, () => { ctx.scale(sc, sc); ctx.translate(-x0, -y0); fn(); });
    if (blur > 0) { const tmp = mk(c.width, c.height); draw(tmp.getContext('2d')); const g = c.getContext('2d'); g.filter = `blur(${blur * sc}px)`; g.drawImage(tmp, 0, 0); }
    else draw(c.getContext('2d'));
    return { c, x0, y0, w, hh };
  }
  const put = (s, alpha = 1, mode = 'source-over') => comp(s.c, { x: s.x0, y: s.y0, w: s.w, hh: s.hh, alpha, mode });
  const blob = (x, y, r, rgb, a, mode = 'lighter') => glowBlob(x, y, r, `rgba(${rgb},1)`, a, mode);

  // ------------------------------------------------------------------ ROOM: wall + window + fairy lights (soft, far)
  const WALL = sprite(-M, -M, W + 2 * M, 1300 + M, 1, () => {
    let g = ctx.createLinearGradient(0, -M, 0, 1150);
    g.addColorStop(0, '#070a12'); g.addColorStop(.55, '#0d1320'); g.addColorStop(1, '#141a26');
    ctx.fillStyle = g; ctx.fillRect(-M, -M, W + 2 * M, 1300 + M);
    for (let i = 0; i < 220; i++) blob(-M + R() * (W + 2 * M), -M + R() * 1300, 40 + R() * 170, R() < .5 ? '40,52,76' : '0,0,0', .18, 'source-over');
    // window (top right) — night sky, moon, distant city
    const wx = 690, wy = 120, ww = 330, wh = 520;
    g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#0b1a3a'); g.addColorStop(.6, '#1b2c58'); g.addColorStop(1, '#3b3563');
    ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
    blob(wx + 240, wy + 110, 230, '150,185,255', .35); ctx.fillStyle = '#e9f0ff'; ctx.beginPath(); ctx.arc(wx + 240, wy + 110, 20, 0, 7); ctx.fill();
    for (let i = 0; i < 16; i++) { const bx = wx + i * 22 - 10, bw = 18 + R() * 26, bh = 50 + R() * 150; ctx.fillStyle = '#0a0f22'; ctx.fillRect(bx, wy + wh - bh, bw, bh);
      for (let k = 0; k < 6; k++) if (R() < .55) { ctx.fillStyle = R() < .7 ? 'rgba(255,200,120,.8)' : 'rgba(170,200,255,.7)'; ctx.fillRect(bx + 3 + R() * (bw - 8), wy + wh - bh + 6 + R() * (bh - 12), 3, 4); } }
    ctx.strokeStyle = '#06080e'; ctx.lineWidth = 22; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .45); ctx.lineTo(wx + ww, wy + wh * .45); ctx.stroke();
    ctx.fillStyle = '#10141e'; ctx.fillRect(wx - 30, wy + wh + 8, ww + 60, 22);
    blob(wx + ww / 2, wy + wh + 120, 380, '90,120,200', .10);
    // lamp wash on wall
    blob(250, 560, 820, '255,150,70', .30); blob(230, 520, 320, '255,190,120', .22);
    // fairy-light wire
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = -M; x <= 660; x += 10) { const y = 200 + 130 * Math.sin(P(x, -M, 660) * Math.PI) - x * .04; x === -M ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  }, 7);
  // bokeh discs (fairy lights + city), drawn sharp-ish on top of the blurred wall
  const BOKEH = sprite(-M, -M, W + 2 * M, 1000, 1, () => {
    for (let i = 0; i < 17; i++) {
      const x = -M + i * 48 + 10, y = 200 + 130 * Math.sin(P(x, -M, 660) * Math.PI) - x * .04 + 14, r = 15 + h(i) * 9;
      blob(x, y, r * 3.2, '255,170,80', .16);
      ctx.fillStyle = `rgba(255,${185 + h(i + 3) * 40 | 0},${110 + h(i + 5) * 40 | 0},${.28 + h(i + 7) * .2})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(255,225,170,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    for (let i = 0; i < 12; i++) { const x = 700 + R() * 310, y = 470 + R() * 160, r = 6 + R() * 12;
      ctx.fillStyle = R() < .6 ? 'rgba(255,190,120,.22)' : 'rgba(150,190,255,.2)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  }, 1.2);

  // ------------------------------------------------------------------ DESK (wood, perspective grain, lamp pool, contact shadows)
  const DESK = sprite(-M, 990, W + 2 * M, 930, 1, () => {
    const top = 1000, front = 1830, VX = 540, VY = -1100;
    let g = ctx.createLinearGradient(0, top, 0, front);
    g.addColorStop(0, '#1e120a'); g.addColorStop(.35, '#3a2313'); g.addColorStop(1, '#24150b');
    ctx.fillStyle = g; ctx.fillRect(-M, top, W + 2 * M, front - top);
    const xAt = (xf, y) => VX + (xf - VX) * (y - VY) / (front - VY);
    for (let i = 0; i < 260; i++) {
      const xf = -900 + R() * 2900, dark = R() < .55, seed = R() * 100;
      ctx.strokeStyle = dark ? `rgba(10,5,2,${.08 + R() * .18})` : `rgba(150,95,50,${.05 + R() * .1})`; ctx.lineWidth = .6 + R() * 2.2;
      ctx.beginPath(); for (let y = top; y <= front; y += 20) { const x = xAt(xf + noise1(y * .004 + seed) * 22, y); y === top ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    }
    for (let k = -6; k <= 8; k++) { const xf = 540 + k * 230; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xAt(xf, top), top); ctx.lineTo(xAt(xf, front), front); ctx.stroke(); }
    // lamp pool + screen pool
    blob(330, 1230, 620, '255,150,70', .42); blob(330, 1220, 260, '255,205,140', .3);
    blob(560, 1300, 420, '110,140,230', .10);
    // back edge contact shadow, laptop shadow
    g = ctx.createLinearGradient(0, top, 0, top + 70); g.addColorStop(0, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-M, top, W + 2 * M, 70);
    ctx.save(); ctx.filter = 'blur(14px)'; ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.beginPath(); ctx.ellipse(545, 1250, 430, 26, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(150, 1210, 120, 22, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(975, 1240, 100, 18, 0, 0, 7); ctx.fill(); ctx.restore();
    // vignette toward front corners
    g = ctx.createLinearGradient(0, 1500, 0, front); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = g; ctx.fillRect(-M, 1500, W + 2 * M, front - 1500);
    // front edge
    g = ctx.createLinearGradient(0, front, 0, front + 50); g.addColorStop(0, '#5a3a22'); g.addColorStop(.15, '#2a180c'); g.addColorStop(1, '#0b0603');
    ctx.fillStyle = g; ctx.fillRect(-M, front, W + 2 * M, 50); ctx.fillStyle = '#030201'; ctx.fillRect(-M, front + 50, W + 2 * M, 100);
  }, 1);

  // ------------------------------------------------------------------ LAMP (architect lamp, left) + its volumetric cone
  const SHADE_C = [300, 600], AX = [.19, .98], NX = [.98, -.19];
  const LAMP = sprite(-60, 380, 520, 900, 1.4, () => {
    const rod = (x0, y0, x1, y1) => {
      ctx.lineCap = 'round'; ctx.strokeStyle = '#0d0b0a'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,170,100,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 4, y0); ctx.lineTo(x1 + 4, y1); ctx.stroke();
      // spring
      ctx.strokeStyle = 'rgba(120,100,90,.7)'; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let k = 0; k <= 30; k++) { const u = .2 + k / 30 * .6, x = lerp(x0, x1, u) - 12, y = lerp(y0, y1, u) + (k % 2 ? -4 : 4); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    };
    // base
    let g = ctx.createLinearGradient(40, 0, 240, 0); g.addColorStop(0, '#3a2a20'); g.addColorStop(.4, '#141110'); g.addColorStop(1, '#080706');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(140, 1203, 96, 24, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,180,110,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(140, 1199, 94, 22, 0, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
    rod(150, 1185, 70, 800); rod(70, 800, 262, 515);
    for (const [x, y] of [[150, 1185], [70, 800], [262, 515]]) { ctx.fillStyle = '#0d0b0a'; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,170,100,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10, Math.PI, Math.PI * 1.6); ctx.stroke(); }
    // shade (cone pointing down)
    const [cx, cy] = SHADE_C, bx = cx - AX[0] * 95, by = cy - AX[1] * 95;
    ctx.beginPath(); ctx.moveTo(bx - NX[0] * 22, by - NX[1] * 22); ctx.lineTo(cx - NX[0] * 80, cy - NX[1] * 80); ctx.lineTo(cx + NX[0] * 80, cy + NX[1] * 80); ctx.lineTo(bx + NX[0] * 22, by + NX[1] * 22); ctx.closePath();
    g = ctx.createLinearGradient(cx - 80, 0, cx + 80, 0); g.addColorStop(0, '#5a3b26'); g.addColorStop(.25, '#24170f'); g.addColorStop(1, '#0a0706');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,190,120,.55)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx - NX[0] * 22, by - NX[1] * 22); ctx.lineTo(cx - NX[0] * 80, cy - NX[1] * 80); ctx.stroke();
    ctx.fillStyle = '#0d0a08'; ctx.beginPath(); ctx.ellipse(bx, by, 24, 10, Math.atan2(NX[1], NX[0]), 0, 7); ctx.fill();
    // glowing opening
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(NX[1], NX[0]));
    g = ctx.createRadialGradient(0, 0, 4, 0, 0, 80); g.addColorStop(0, '#fffaf0'); g.addColorStop(.5, '#ffe2a8'); g.addColorStop(1, '#ffb560');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 80, 20, 0, 0, 7); ctx.fill(); ctx.restore();
    blob(cx, cy + 6, 120, '255,200,130', .6);
  }, .8);
  const CONE = sprite(60, 480, 760, 860, .5, () => {
    const [cx, cy] = SHADE_C, ex = 430, ey = 1250, len = Math.hypot(ex - cx, ey - cy);
    for (const [wid, a] of [[340, .22], [210, .16], [110, .14]]) {
      const g = ctx.createLinearGradient(cx, cy, ex, ey); g.addColorStop(0, `rgba(255,205,140,${a * 1.6})`); g.addColorStop(.6, `rgba(255,180,110,${a * .6})`); g.addColorStop(1, `rgba(255,170,100,${a * .25})`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - NX[0] * 70, cy - NX[1] * 70); ctx.lineTo(ex - NX[0] * wid, ey - NX[1] * wid); ctx.lineTo(ex + NX[0] * wid, ey + NX[1] * wid); ctx.lineTo(cx + NX[0] * 70, cy + NX[1] * 70); ctx.closePath(); ctx.fill();
    }
    void len;
  }, 16);
  const inCone = (x, y) => { const vx = x - SHADE_C[0], vy = y - SHADE_C[1], along = vx * AX[0] + vy * AX[1], across = Math.abs(vx * NX[0] + vy * NX[1]); if (along < 0) return 0; const hw = 70 + along * .42; return clamp(1 - across / hw) * clamp(1 - along / 760); };

  // ------------------------------------------------------------------ PLANT (right, slightly soft)
  const PLANT = sprite(720, 520, 460, 760, 1, () => {
    const px = 962, py = 1092;
    for (let k = 0; k < 13; k++) {
      const a = -Math.PI / 2 + (k / 12 - .5) * 2.3 + (h(k) - .5) * .25, L = 260 + h(k + 9) * 240, bend = (k / 12 - .5) * 1.1;
      const tx = px + Math.cos(a) * L, ty = py + Math.sin(a) * L * .95, mx = px + Math.cos(a) * L * .5 + bend * 40, my = py + Math.sin(a) * L * .55 - 60;
      const ex = tx + bend * 90, ey = ty + Math.abs(bend) * 140;
      const wdt = 18 + h(k + 4) * 16, nx = -(ey - py) / L, ny = (ex - px) / L;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(mx + nx * wdt * 1.4, my + ny * wdt * 1.4, ex, ey); ctx.quadraticCurveTo(mx - nx * wdt * 1.4, my - ny * wdt * 1.4, px, py);
      const g = ctx.createLinearGradient(px, py, ex, ey); g.addColorStop(0, '#08130c'); g.addColorStop(1, k % 3 ? '#1b3524' : '#244330');
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = k % 2 ? 'rgba(140,170,255,.35)' : 'rgba(255,180,110,.25)'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.strokeStyle = 'rgba(160,200,150,.18)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
    }
    // pot
    let g = ctx.createLinearGradient(890, 0, 1035, 0); g.addColorStop(0, '#36575c'); g.addColorStop(.25, '#1d3438'); g.addColorStop(1, '#070d0e');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(888, 1092); ctx.lineTo(1036, 1092); ctx.lineTo(1022, 1240); ctx.quadraticCurveTo(962, 1252, 902, 1240); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0d1a1b'; ctx.beginPath(); ctx.ellipse(962, 1092, 74, 13, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#120c08'; ctx.beginPath(); ctx.ellipse(962, 1094, 64, 9, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(150,180,255,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(890, 1096); ctx.lineTo(903, 1236); ctx.stroke();
  }, 1.6);

  // ------------------------------------------------------------------ FOREGROUND: mug (very soft) + notebook (soft)
  const MUG = sprite(-90, 1300, 460, 480, .6, () => {
    ctx.save(); ctx.filter = 'blur(10px)'; ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.beginPath(); ctx.ellipse(150, 1668, 130, 24, 0, 0, 7); ctx.fill(); ctx.restore();
    let g = ctx.createLinearGradient(40, 0, 240, 0); g.addColorStop(0, '#f6dfbf'); g.addColorStop(.35, '#c9ac8a'); g.addColorStop(1, '#2c2119');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(40, 1460); ctx.lineTo(40, 1640); ctx.quadraticCurveTo(140, 1690, 240, 1640); ctx.lineTo(240, 1460); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#3a2c22'; ctx.lineWidth = 22; ctx.beginPath(); ctx.ellipse(262, 1548, 46, 58, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = '#e8d2b4'; ctx.beginPath(); ctx.ellipse(140, 1460, 100, 26, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#24140a'; ctx.beginPath(); ctx.ellipse(140, 1462, 88, 20, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,220,170,.35)'; ctx.beginPath(); ctx.ellipse(110, 1458, 30, 6, 0, 0, 7); ctx.fill();
  }, 9);
  const BOOK = sprite(640, 1320, 480, 300, 1, () => {
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.moveTo(705, 1415); ctx.lineTo(1050, 1385); ctx.lineTo(1095, 1560); ctx.lineTo(735, 1598); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e9e0cc'; ctx.beginPath(); ctx.moveTo(700, 1398); ctx.lineTo(1042, 1368); ctx.lineTo(1084, 1540); ctx.lineTo(730, 1578); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(700, 1380, 1080, 1560); g.addColorStop(0, '#4a2f22'); g.addColorStop(1, '#1a100b');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(700, 1390); ctx.lineTo(1042, 1360); ctx.lineTo(1084, 1532); ctx.lineTo(730, 1570); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#0b0705'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(990, 1365); ctx.lineTo(1030, 1537); ctx.stroke();
    ctx.strokeStyle = '#c9a36a'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(760, 1470); ctx.lineTo(960, 1430); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,230,190,.7)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(765, 1466); ctx.lineTo(955, 1427); ctx.stroke();
  }, 3.5);

  // ------------------------------------------------------------------ LAPTOP (sharp, 2x)
  const BT = 1076, BF = 1240, XL0 = 238, XR0 = 842, XL1 = 166, XR1 = 914;
  const LAPTOP = sprite(150, 660, 780, 620, 2, () => {
    rr(244, 684, 592, 384, 22); ctx.fillStyle = '#2b2c32'; ctx.fill();
    rr(249, 689, 582, 376, 18); ctx.fillStyle = '#09090b'; ctx.fill();
    let g = ctx.createLinearGradient(244, 0, 836, 0); g.addColorStop(0, 'rgba(255,190,130,.7)'); g.addColorStop(.35, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(150,170,255,.35)');
    ctx.strokeStyle = g; ctx.lineWidth = 2; rr(244.5, 684.5, 591, 383, 22); ctx.stroke();
    ctx.fillStyle = '#1c1d22'; ctx.beginPath(); ctx.arc(540, 695, 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#000'; ctx.fillRect(DX, DY, DW, DH);
    g = ctx.createLinearGradient(0, 1064, 0, 1077); g.addColorStop(0, '#111114'); g.addColorStop(1, '#34353c'); ctx.fillStyle = g; ctx.fillRect(250, 1064, 580, 13);
    // deck
    const yv = v => lerp(BT, BF, v), xl = v => lerp(XL0, XL1, v), xr = v => lerp(XR0, XR1, v);
    g = ctx.createLinearGradient(0, BT, 0, BF); g.addColorStop(0, '#2c2e35'); g.addColorStop(1, '#474a53');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(XL0, BT); ctx.lineTo(XR0, BT); ctx.lineTo(XR1, BF); ctx.lineTo(XL1, BF); ctx.closePath(); ctx.fill();
    g = ctx.createLinearGradient(XL1, 0, XR1, 0); g.addColorStop(0, 'rgba(255,170,100,.22)'); g.addColorStop(.5, 'rgba(255,170,100,0)'); ctx.fillStyle = g; ctx.fill();
    // keys
    for (let j = 0; j < 6; j++) {
      const v0 = .07 + j * .098, v1 = v0 + .078, n = j === 0 ? 15 : 14;
      const quad = (u0, u1) => { const p = [[lerp(xl(v0) + 34, xr(v0) - 34, u0), yv(v0)], [lerp(xl(v0) + 34, xr(v0) - 34, u1), yv(v0)], [lerp(xl(v1) + 40, xr(v1) - 40, u1), yv(v1)], [lerp(xl(v1) + 40, xr(v1) - 40, u0), yv(v1)]];
        ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = '#111215'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); ctx.stroke(); };
      if (j === 5) { const cuts = [0, .07, .14, .22, .3, .7, .78, .86, .93, 1]; for (let i = 0; i < cuts.length - 1; i++) quad(cuts[i] + .004, cuts[i + 1] - .004); }
      else for (let i = 0; i < n; i++) quad(i / n + .005, (i + 1) / n - .005);
    }
    // trackpad
    const t0 = .7, t1 = .95, tw0 = .17, tw1 = .19;
    ctx.beginPath(); ctx.moveTo(540 - (xr(t0) - xl(t0)) * tw0, yv(t0)); ctx.lineTo(540 + (xr(t0) - xl(t0)) * tw0, yv(t0)); ctx.lineTo(540 + (xr(t1) - xl(t1)) * tw1, yv(t1)); ctx.lineTo(540 - (xr(t1) - xl(t1)) * tw1, yv(t1)); ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 1; ctx.stroke();
    // front edge
    g = ctx.createLinearGradient(0, BF, 0, BF + 14); g.addColorStop(0, '#6d707b'); g.addColorStop(.3, '#3a3c44'); g.addColorStop(1, '#111216');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(XL1, BF); ctx.lineTo(XR1, BF); ctx.lineTo(XR1 - 7, BF + 14); ctx.lineTo(XL1 + 7, BF + 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#16171b'; ctx.beginPath(); ctx.ellipse(540, BF + 1, 40, 4, 0, 0, Math.PI); ctx.fill();
  });

  // ------------------------------------------------------------------ THE PAINTING (Ghibli-like Majapahit vista), design space 1600x1000
  const PW = 1600, PH = 1000, PR = 1.25;
  const pcan = fn => { const c = mk(PW * PR, PH * PR); on(c.getContext('2d'), () => { ctx.scale(PR, PR); fn(); }); return c; };
  const ridge = (x, base, amp, f, s) => base + amp * fbm2(x * f + s, s * 1.37, 3);
  function wash(pathFn, fill, o = {}) {
    const { edge = 'rgba(30,40,70,.28)', ew = 12, seed = 1, tex = .1 } = o; const r = mulberry(seed);
    ctx.save(); pathFn(); ctx.fillStyle = fill; ctx.fill(); pathFn(); ctx.clip();
    for (let i = 0; i < 46; i++) blob(r() * PW, r() * PH, 50 + r() * 220, r() < .5 ? '255,255,240' : '20,30,60', .07, 'source-over');
    pathFn(); ctx.strokeStyle = edge; ctx.lineWidth = ew; ctx.filter = 'blur(4px)'; ctx.stroke(); ctx.filter = 'none';
    ctx.globalAlpha = tex; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = TOOTHPAT; ctx.fillRect(0, 0, PW, PH);
    ctx.restore();
  }
  const hill = (base, amp, f, s, bump = () => 0) => () => { ctx.beginPath(); ctx.moveTo(-20, PH + 20); for (let x = -20; x <= PW + 20; x += 8) ctx.lineTo(x, ridge(x, base, amp, f, s) + bump(x)); ctx.lineTo(PW + 20, PH + 20); ctx.closePath(); };
  const vgrad = (y0, y1, stops) => { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const SUN = [800, 455];
  const PL = {};
  PL.sky = pcan(() => {
    ctx.fillStyle = vgrad(0, PH, [[0, '#3d84c8'], [.32, '#79b3df'], [.55, '#c6e2ee'], [.66, '#ffe6bd'], [1, '#ffd49a']]); ctx.fillRect(0, 0, PW, PH);
    const r = mulberry(5); for (let i = 0; i < 60; i++) blob(r() * PW, r() * 600, 60 + r() * 200, r() < .5 ? '255,255,255' : '40,90,160', .06, 'source-over');
    for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 6 + r() * 10; ctx.lineCap = 'round'; const y = 120 + r() * 260, x = r() * PW; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 120, y - 10, x + 260 + r() * 200, y + 6); ctx.stroke(); }
    blob(SUN[0], SUN[1], 560, '255,225,170', .55); blob(SUN[0], SUN[1], 200, '255,245,215', .8);
    ctx.fillStyle = '#fffbef'; ctx.beginPath(); ctx.arc(SUN[0], SUN[1], 44, 0, 7); ctx.fill();
    ctx.globalAlpha = .08; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = TOOTHPAT; ctx.fillRect(0, 0, PW, PH);
  });
  function cloud(cx, cy, s, seed) {
    const r = mulberry(seed), tmp = mk(700, 420), g = tmp.getContext('2d');
    on(g, () => {
      ctx.translate(350, 260); ctx.fillStyle = '#fff';
      for (let i = 0; i < 9; i++) { const x = (i - 4) * 52 * s * (1 + r() * .2), rad = (50 + r() * 40) * s * (1 - Math.abs(i - 4) * .09); ctx.beginPath(); ctx.arc(x, -rad * .35, rad, 0, 7); ctx.fill(); }
      for (let i = 0; i < 4; i++) { const x = (i - 1.5) * 70 * s + (r() - .5) * 30, rad = (70 + r() * 40) * s; ctx.beginPath(); ctx.arc(x, -rad * .9 - 30 * s, rad, 0, 7); ctx.fill(); }
      ctx.fillRect(-230 * s, -30 * s, 460 * s, 34 * s);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = vgrad(-200 * s, 10 * s, [[0, '#fffaf0'], [.45, '#ffffff'], [.8, '#dcd8ec'], [1, '#bdb6d6']]); ctx.fillRect(-350, -260, 700, 420);
      blob(cx < SUN[0] ? 220 : -220, -30, 220 * s, '255,215,160', .45, 'source-atop');
    });
    ctx.save(); ctx.filter = 'blur(2px)'; ctx.drawImage(tmp, cx - 350, cy - 260); ctx.restore();
  }
  PL.clouds = pcan(() => { cloud(330, 280, 1.35, 11); cloud(1270, 240, 1.25, 12); cloud(620, 340, .55, 13); cloud(1010, 150, .7, 14); cloud(160, 120, .5, 15); });
  PL.far = pcan(() => {
    wash(hill(560, 70, .0028, 3), vgrad(470, 700, [[0, '#9db4d6'], [1, '#c7d3e4']]), { seed: 21, edge: 'rgba(60,80,140,.25)' });
    ctx.fillStyle = vgrad(520, 720, [[0, 'rgba(255,230,190,0)'], [1, 'rgba(255,230,190,.45)']]); ctx.fillRect(0, 500, PW, 300);
  });
  const midBump = x => -70 * Math.exp(-Math.pow((x - 800) / 240, 2));
  const midY = x => ridge(x, 680, 60, .0035, 7) + midBump(x);
  PL.mid = pcan(() => {
    wash(hill(680, 60, .0035, 7, midBump), vgrad(590, 900, [[0, '#a9cf7c'], [.35, '#77a95a'], [1, '#4f8445']]), { seed: 22, edge: 'rgba(30,70,40,.3)' });
    const r = mulberry(31);
    for (let i = 0; i < 26; i++) { const x = r() * PW; if (Math.abs(x - 800) < 170) continue; const y = midY(x) + 10 + r() * 20, s = 10 + r() * 16;
      ctx.fillStyle = '#3f6e3c'; ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.arc(x + s * .8, y + 3, s * .8, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(210,235,140,.5)'; ctx.beginPath(); ctx.arc(x - s * .2, y - s * .4, s * .5, 0, 7); ctx.fill(); }
  });
  // candi bentar (split gate) on the central rise, sun shining through the gap
  const CB = midY(800) + 14;
  PL.candi = pcan(() => {
    const tiers = [[0, 150, 22], [22, 126, 92], [114, 138, 10], [124, 112, 22], [146, 120, 6], [152, 94, 20], [172, 102, 6], [178, 76, 18], [196, 84, 5], [201, 56, 17], [218, 62, 5], [223, 38, 15], [238, 16, 16]];
    const half = side => { ctx.beginPath(); const gx = 800 + side * 26; ctx.moveTo(gx, CB);
      for (const [y0, w, hh] of tiers) { ctx.lineTo(gx + side * w, CB - y0); ctx.lineTo(gx + side * w, CB - y0 - hh); }
      ctx.lineTo(gx + side * 6, CB - 262); ctx.lineTo(gx, CB - 258); ctx.closePath(); };
    for (const side of [-1, 1]) {
      wash(() => half(side), vgrad(CB - 260, CB, [[0, '#9a4a35'], [1, '#6e2f22']]), { seed: 40 + side, edge: 'rgba(60,20,10,.4)', ew: 8, tex: .18 });
      ctx.save(); half(side); ctx.clip(); ctx.strokeStyle = 'rgba(40,10,5,.22)'; ctx.lineWidth = 1.5;
      for (let y = CB; y > CB - 262; y -= 9) { ctx.beginPath(); ctx.moveTo(800 - 200, y); ctx.lineTo(1000, y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(30,8,4,.35)'; ctx.fillRect(800 + side * 26 + (side > 0 ? 0 : -150), CB - 116, 150, 6);
      ctx.fillStyle = 'rgba(40,10,6,.3)'; ctx.fillRect(side > 0 ? 800 + 26 + 30 : 800 - 26 - 30 - 66, CB - 96, 66, 56); ctx.strokeStyle = 'rgba(255,200,150,.25)'; ctx.lineWidth = 2; ctx.strokeRect(side > 0 ? 800 + 26 + 30 : 800 - 26 - 30 - 66, CB - 96, 66, 56);
      ctx.restore();
      // rim light on the inner (sun-facing) edge
      ctx.strokeStyle = 'rgba(255,215,150,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(800 + side * 27, CB - 4); ctx.lineTo(800 + side * 27, CB - 256); ctx.stroke();
    }
    ctx.fillStyle = '#6e3a2a'; for (let k = 0; k < 4; k++) ctx.fillRect(800 - 40 + k * 4, CB - 4 + k * 7, 80 - k * 8 + 8 * k, 7);
  });
  const nearY = x => ridge(x, 790, 30, .004, 13) + Math.pow((x - 800) / 800, 2) * -60;
  PL.near = pcan(() => {
    const nearPath = () => { ctx.beginPath(); ctx.moveTo(-20, PH + 20); for (let x = -20; x <= PW + 20; x += 8) ctx.lineTo(x, nearY(x)); ctx.lineTo(PW + 20, PH + 20); ctx.closePath(); };
    wash(nearPath, vgrad(700, PH, [[0, '#86b85d'], [1, '#3f7a3a']]), { seed: 23, edge: 'rgba(20,60,30,.35)' });
    ctx.save(); nearPath(); ctx.clip();
    for (let j = 0; j < 9; j++) {
      const off = 18 + j * 14 + j * j * 5.5, yf = x => nearY(x) + off + Math.sin(x * .004 + j * 1.7) * (8 + j * 2);
      if (j % 3 === 1) { ctx.fillStyle = 'rgba(205,232,240,.33)'; ctx.beginPath(); for (let x = -20; x <= PW + 20; x += 16) ctx.lineTo(x, yf(x)); for (let x = PW + 20; x >= -20; x -= 16) ctx.lineTo(x, yf(x) + 6 + j * 2.5); ctx.closePath(); ctx.fill(); }
      ctx.strokeStyle = `rgba(215,240,150,${.55 - j * .03})`; ctx.lineWidth = 2 + j * .5; ctx.beginPath(); for (let x = -20; x <= PW + 20; x += 16) ctx.lineTo(x, yf(x)); ctx.stroke();
    }
    ctx.restore();
    // trees: soft round canopies and palms on the sides
    const tree = (x, y, s, seed) => { const r = mulberry(seed);
      ctx.strokeStyle = '#3b2a1f'; ctx.lineWidth = 10 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4 * s, y - 110 * s); ctx.stroke();
      const cs = []; for (let i = 0; i < 16; i++) { const a = r() * 6.28, d = r() * 70 * s; cs.push([x + Math.cos(a) * d * 1.25, y - 150 * s + Math.sin(a) * d * .75, (30 + r() * 28) * s]); }
      for (const [col, dx, dy, k] of [['#1d4329', 0, 0, 1], ['#3c7339', -5, -9, .78], ['#6fa24f', -10, -18, .5], ['#b5d986', -13, -24, .22]]) {
        ctx.fillStyle = col; for (const [cx, cy, rad] of cs) { if (k < .3 && cy > y - 150 * s) continue; ctx.beginPath(); ctx.arc(cx + dx * s, cy + dy * s, rad * k, 0, 7); ctx.fill(); } } };
    const palm = (x, y, lean, s, seed) => { const r = mulberry(seed), tx = x + lean * 120 * s, ty = y - 420 * s;
      ctx.strokeStyle = '#5a4637'; ctx.lineCap = 'round'; ctx.lineWidth = 14 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * 10, y - 240 * s, tx, ty); ctx.stroke();
      for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i / 8 - .5) * 3.6 + (r() - .5) * .2, L = (150 + r() * 50) * s, ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .6 + L * .35;
        ctx.strokeStyle = i % 2 ? '#2f6a37' : '#3f7d3e'; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a) * 10, ty + Math.sin(a) * L * .4 - 40 * s, ex, ey); ctx.stroke();
        ctx.lineWidth = 2.2 * s; for (let k = 1; k < 9; k++) { const u = k / 9, qx = lerp(tx, ex, u), qy = lerp(ty, ey, u) - Math.sin(u * Math.PI) * 30 * s; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(qx + 12 * s, qy + 22 * s); ctx.moveTo(qx, qy); ctx.lineTo(qx - 12 * s, qy + 22 * s); ctx.stroke(); } }
      ctx.fillStyle = 'rgba(255,220,150,.5)'; ctx.beginPath(); ctx.arc(tx + 4, ty - 4, 6 * s, 0, 7); ctx.fill(); };
    palm(230, 900, .5, 1.1, 51); palm(110, 960, -.3, 1.25, 52); tree(390, 860, 1, 53);
    palm(1400, 900, -.55, 1.15, 54); tree(1230, 870, .9, 55); tree(1540, 940, 1.2, 56);
  });
  // half-res copies for the per-frame reveal
  const RW = 800, RH = 500;
  const half = c => { const o = mk(RW, RH); o.getContext('2d').drawImage(c, 0, 0, RW, RH); return o; };
  const PH2 = {}; for (const k of Object.keys(PL)) PH2[k] = half(PL[k]);
  const P_REST = pcan(() => { for (const k of ['far', 'mid', 'candi', 'near']) ctx.drawImage(PL[k], 0, 0, PW, PH); });
  const REV = mk(RW, RH), RV = REV.getContext('2d'), MSK = mk(RW, RH), MS = MSK.getContext('2d');
  // z-order + paint schedule (local seconds). Regions in design coords.
  const PAINT = [
    { k: 'sky', t0: 3.12, t1: 3.50, y0: 0, y1: 800, n: 5, s: 1 },
    { k: 'clouds', t0: 3.66, t1: 3.98, y0: 60, y1: 430, n: 3, s: 2 },
    { k: 'far', t0: 3.34, t1: 3.62, y0: 470, y1: 730, n: 3, s: 3 },
    { k: 'mid', t0: 3.48, t1: 3.80, y0: 560, y1: 900, n: 3, s: 4 },
    { k: 'candi', t0: 3.96, t1: 4.28, y0: 380, y1: 690, n: 4, s: 5, x0: 600, x1: 1000 },
    { k: 'near', t0: 3.78, t1: 4.12, y0: 360, y1: 1000, n: 5, s: 6 },
  ];
  function buildREV(lt) {
    RV.globalCompositeOperation = 'source-over'; RV.globalAlpha = 1; RV.clearRect(0, 0, RW, RH);
    const tips = [];
    for (const L of PAINT) {
      const p = P(lt, L.t0, L.t1); if (p <= 0) continue;
      if (p >= 1) { RV.drawImage(PH2[L.k], 0, 0); continue; }
      MS.globalCompositeOperation = 'source-over'; MS.clearRect(0, 0, RW, RH); MS.lineCap = 'round'; MS.lineJoin = 'round';
      const xa = (L.x0 ?? 150) / 2, xb = (L.x1 ?? 1450) / 2, ya = L.y0 / 2, yb = L.y1 / 2, bh = (yb - ya) / L.n;
      for (let k = 0; k < L.n; k++) {
        const s0 = k / L.n * .62, sp = E.sine(P(p, s0, s0 + .38)); if (sp <= 0) continue;
        const dir = k % 2 ? -1 : 1, xs = dir > 0 ? xa - 30 : xb + 30, xe = lerp(xs, dir > 0 ? xb + 30 : xa - 30, sp), y = ya + bh * (k + .5);
        const yy = x => y + noise1(x * .02 + k * 13 + L.s * 7) * bh * .3;
        MS.beginPath(); for (let x = xs; dir > 0 ? x <= xe : x >= xe; x += 10 * dir) MS.lineTo(x, yy(x)); MS.lineTo(xe, yy(xe));
        MS.strokeStyle = 'rgba(0,0,0,.35)'; MS.lineWidth = bh * 1.9; MS.stroke(); MS.strokeStyle = '#000'; MS.lineWidth = bh * 1.2; MS.stroke();
        // dry-brush bristles: thin streaks that lead/lag the stroke for a painterly edge
        for (let b = 0; b < 9; b++) { const o = (b / 8 - .5) * bh * 1.9, lag = (h(b * 3.7 + k + L.s) - .3) * 60, xe2 = xe - dir * lag;
          if (dir > 0 ? xe2 <= xs : xe2 >= xs) continue;
          MS.beginPath(); for (let x = xs; dir > 0 ? x <= xe2 : x >= xe2; x += 14 * dir) MS.lineTo(x, yy(x) + o + noise1(x * .05 + b) * 3); MS.lineTo(xe2, yy(xe2) + o);
          MS.strokeStyle = `rgba(0,0,0,${.5 + h(b + k) * .5})`; MS.lineWidth = bh * (.12 + h(b * 1.3 + L.s) * .2); MS.stroke(); }
        if (sp < 1) tips.push([xe, yy(xe)]);
      }
      MS.globalCompositeOperation = 'source-in'; MS.drawImage(PH2[L.k], 0, 0);
      RV.drawImage(MSK, 0, 0);
    }
    RV.globalCompositeOperation = 'lighter';
    for (const [x, y] of tips) { const g = RV.createRadialGradient(x, y, 0, x, y, 16); g.addColorStop(0, 'rgba(255,245,220,.95)'); g.addColorStop(1, 'rgba(255,200,120,0)'); RV.fillStyle = g; RV.fillRect(x - 16, y - 16, 32, 32); }
    RV.globalCompositeOperation = 'source-over';
  }

  // light rays texture for the burst
  const RAYS = (() => { const c = mk(1000, 1000), g = c.getContext('2d'); on(g, () => {
    ctx.translate(500, 500); const r = mulberry(77);
    for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283 + r() * .15, w = .025 + r() * .06, L = 300 + r() * 200;
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, L); gr.addColorStop(0, 'rgba(255,240,205,.9)'); gr.addColorStop(1, 'rgba(255,220,160,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, L, a - w, a + w); ctx.closePath(); ctx.fill(); }
  }); const o = mk(1000, 1000), go = o.getContext('2d'); go.filter = 'blur(6px)'; go.drawImage(c, 0, 0); return o; })();

  // ------------------------------------------------------------------ UI helpers (screen units)
  const C = { bg: '#262624', side: '#1d1c1a', bar: '#191817', line: '#3a3935', text: '#ECE9E1', mute: '#9a958b', field: '#30302d' };
  function mark(x, y, r, rot = 0, col = CORAL) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col;
    for (let k = 0; k < 12; k++) { ctx.save(); ctx.rotate(k * Math.PI / 6); const L = k % 2 ? r * .72 : r, w = r * .2; rr(-w / 2, -L, w, L, w / 2); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  function pdfIcon(x, y, s, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#f3efe6'; ctx.beginPath(); ctx.moveTo(-40, -52); ctx.lineTo(18, -52); ctx.lineTo(40, -30); ctx.lineTo(40, 52); ctx.lineTo(-40, 52); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#cfc8ba'; ctx.beginPath(); ctx.moveTo(18, -52); ctx.lineTo(18, -30); ctx.lineTo(40, -30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c9c2b4'; for (let i = 0; i < 4; i++) ctx.fillRect(-28, -34 + i * 12, i === 3 ? 30 : 50, 5);
    ctx.fillStyle = '#e5484d'; rr(-30, 16, 60, 26, 5); ctx.fill();
    T('PDF', 0, 30, { size: 18, weight: 800, color: '#fff' });
    ctx.restore();
  }
  function pointer(x, y, s = 1, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * 1.25, s * 1.25);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(9, 26); ctx.lineTo(15, 40); ctx.lineTo(21, 37); ctx.lineTo(15, 24); ctx.lineTo(27, 24); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3; ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  }
  function chip(x, y, w, sc = 1, a = 1, small = false) {
    if (sc <= .001 || a <= 0) return; const hh = small ? 50 : 66;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + hh / 2); ctx.scale(sc, sc); ctx.translate(0, -hh / 2);
    rr(0, 0, w, hh, 14); ctx.fillStyle = '#3a3834'; ctx.fill(); ctx.strokeStyle = '#4c4a45'; ctx.lineWidth = 1.5; ctx.stroke();
    const s = small ? 36 : 46; rr(10, (hh - s) / 2, s, s, 9); ctx.fillStyle = '#e5484d'; ctx.fill();
    T('PDF', 10 + s / 2, hh / 2 + 1, { size: small ? 11 : 14, weight: 800, color: '#fff' });
    if (small) T('Prompt-Pack.pdf', 56, hh / 2 + 1, { size: 20, weight: 700, color: C.text, align: 'left' });
    else { T('Prompt-Pack.pdf', 68, 24, { size: 24, weight: 700, color: C.text, align: 'left' }); T('PDF · 2,4 MB', 68, 48, { size: 17, weight: 600, color: C.mute, align: 'left' }); }
    ctx.restore();
  }
  const sendBtn = (x, y, r, on_, sc = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = on_ ? CORAL : '#4a3a33'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.strokeStyle = on_ ? '#fff' : '#8a7a70'; ctx.lineWidth = r * .14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(0, r * .45); ctx.lineTo(0, -r * .4); ctx.moveTo(-r * .38, -r * .02); ctx.lineTo(0, -r * .42); ctx.lineTo(r * .38, -r * .02); ctx.stroke(); ctx.restore(); };
  const clip_ = (x, y) => { ctx.save(); ctx.strokeStyle = C.mute; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.translate(x, y); ctx.rotate(.6); ctx.beginPath(); ctx.moveTo(-5, 10); ctx.lineTo(-5, -8); ctx.arc(0, -8, 5, Math.PI, 0); ctx.lineTo(5, 12); ctx.arc(-1, 12, 6, 0, Math.PI); ctx.lineTo(-7, -4); ctx.stroke(); ctx.restore(); };
  // typing schedule (deterministic, slightly irregular rhythm)
  const TY0 = 1.45, TY1 = 2.58;
  const CT = (() => { const a = [0]; let s = 0; for (let i = 0; i < PROMPT.length; i++) { s += .7 + h(i * 3.1 + 1) * .9 + (PROMPT[i] === ' ' ? .5 : 0) + (PROMPT[i - 1] === ',' ? 2.2 : 0); a.push(s); } return a.map(v => v / s); })();
  const typed = lt => { const p = P(lt, TY0, TY1); let n = 0; while (n < PROMPT.length && CT[n + 1] <= p) n++; return n; };
  const BX = 220, BW = 740, BB = 600;
  const chipK = lt => E.out(P(lt, 1.12, 1.4));
  const boxTop = lt => BB - (186 + 80 * chipK(lt));
  const DROP = [330, 455];

  function drawUI(lt, st) {
    const kA = E.in(P(lt, 2.78, 2.9)), kAB = E.out(P(lt, 2.86, 3.0)), kSide = E.io(P(lt, 2.82, 3.2)), kEx = E.io(P(lt, 4.36, 4.86)), uiA = 1 - P(lt, 4.36, 4.62);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, SW, SH);
    if (uiA > 0) {
      ctx.save(); ctx.globalAlpha = uiA;
      const sx = -190 * kSide;
      // sidebar
      ctx.fillStyle = C.side; ctx.fillRect(sx, 0, 180, SH);
      rr(sx + 22, 64, 136, 40, 12); ctx.fillStyle = '#2d2c2a'; ctx.fill(); T('+  Chat baru', sx + 38, 85, { size: 18, weight: 700, color: C.text, align: 'left' });
      for (let i = 0; i < 6; i++) { rr(sx + 26, 140 + i * 42, 70 + h(i + 2) * 60, 12, 6); ctx.fillStyle = i === 0 ? '#4a4844' : '#34332f'; ctx.fill(); }
      // top bar
      ctx.fillStyle = C.bar; ctx.fillRect(0, 0, SW, 40);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.globalAlpha = uiA * .75; ctx.beginPath(); ctx.arc(22 + i * 22, 20, 6.5, 0, 7); ctx.fill(); });
      ctx.globalAlpha = uiA;
      // header brand
      const hx = lerp(212, 30, kSide);
      mark(hx + 14, 72, 15, lt * .25); T('Claude', hx + 38, 74, { size: 30, weight: 800, color: C.text, align: 'left' });
      ctx.fillStyle = '#3d3b37'; ctx.beginPath(); ctx.arc(960, 72, 16, 0, 7); ctx.fill();
      ctx.fillStyle = C.line; ctx.fillRect(Math.max(0, sx + 180), 104, SW, 1.5);

      // ---------- layout A: greeting + big input
      if (kA < 1) {
        ctx.save(); ctx.globalAlpha *= 1 - kA; ctx.translate(0, -40 * kA);
        const top = boxTop(lt), dragA = E.io(P(lt, .62, .8)) * (1 - P(lt, 1.08, 1.2));
        const gy = lerp(250, 205, chipK(lt));
        mark(354, gy, 22, .3 + lt * .2); T('Mau bikin apa hari ini?', 384, gy + 2, { size: 44, font: 'Playfair', weight: 'italic 700', color: C.text, align: 'left' });
        // drop zone overlay
        if (dragA > 0) { ctx.save(); ctx.globalAlpha *= dragA; rr(200, 124, 780, 482, 22); ctx.fillStyle = 'rgba(217,119,87,.08)'; ctx.fill(); ctx.setLineDash([14, 10]); ctx.lineDashOffset = -lt * 60; ctx.strokeStyle = CORAL; ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]);
          T('Lepaskan file di sini', 590, 170, { size: 22, weight: 700, color: '#f0b9a6' }); ctx.restore(); }
        // input box
        rr(BX, top, BW, BB - top, 26); ctx.fillStyle = C.field; ctx.fill(); ctx.strokeStyle = lt > 1.4 && lt < 2.8 ? 'rgba(217,119,87,.55)' : '#45433e'; ctx.lineWidth = 2; ctx.stroke();
        const ck = chipK(lt);
        if (ck > 0) chip(BX + 20, top + 18, 330, .7 + .3 * E.back(P(lt, 1.12, 1.42)), P(lt, 1.12, 1.2));
        const tx = BX + 30, ty = top + 18 + 80 * ck + 30, n = typed(lt);
        if (n === 0) T('Tulis pesan untuk Claude…', tx, ty, { size: 36, weight: 600, color: '#77736b', align: 'left', alpha: 1 - P(lt, 1.0, 1.1) + P(lt, 1.3, 1.42) });
        else { const lines = wrap(PROMPT.slice(0, n), BW - 70, 40, 'Mont', 600); lines.forEach((l, i) => T(l, tx, ty + i * 52, { size: 40, weight: 600, color: C.text, align: 'left' }));
          const last = lines[lines.length - 1], cx = tx + TW(last, 40, 'Mont', 600) + 4, blink = n < PROMPT.length || (lt * 2.2 % 1) < .55;
          if (blink && lt < 2.74) { ctx.fillStyle = CORAL; ctx.fillRect(cx, ty + (lines.length - 1) * 52 - 22, 3.5, 44); } }
        if (n === 0 && lt > 1.3 && lt < TY0 && (lt * 2.2 % 1) < .55) { ctx.fillStyle = CORAL; ctx.fillRect(tx - 6, ty - 22, 3.5, 44); }
        clip_(BX + 40, BB - 36);
        const press = 1 - .16 * Math.sin(Math.PI * P(lt, 2.7, 2.84));
        sendBtn(BX + BW - 44, BB - 38, 25, n > 0, press);
        const rp = P(lt, 2.72, 3.0); if (rp > 0 && rp < 1) { ctx.strokeStyle = `rgba(217,119,87,${1 - rp})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(BX + BW - 44, BB - 38, 25 + rp * 40, 0, 7); ctx.stroke(); }
        ctx.restore();
      }
      // ---------- layout B: conversation + artifact panel
      if (kAB > 0) {
        ctx.save(); ctx.globalAlpha *= kAB;
        const bIn = E.out(P(lt, 2.84, 3.12)), by = 124 + 90 * (1 - bIn);
        const lines = wrap(PROMPT, 330, 26, 'Mont', 600), bh = 24 + 50 + 12 + lines.length * 34;
        rr(120, by, 360, bh, 22); ctx.fillStyle = '#3a3633'; ctx.fill();
        chip(136, by + 14, 250, 1, 1, true);
        lines.forEach((l, i) => T(l, 140, by + 92 + i * 34, { size: 26, weight: 600, color: C.text, align: 'left' }));
        // Claude reply
        const ry = by + bh + 34, rA = P(lt, 3.0, 3.12), gen = lt < 4.3;
        if (rA > 0) {
          ctx.save(); ctx.globalAlpha *= rA;
          mark(44, ry, 16, gen ? lt * 5 : 4.3 * 5, CORAL);
          const msg = 'Siap! Aku lukis videonya:', nm = Math.floor(msg.length * P(lt, 3.04, 3.3));
          T(msg.slice(0, nm), 72, ry + 1, { size: 25, weight: 700, color: C.text, align: 'left' });
          const items = [['Langit & awan', 3.12, 3.98], ['Bukit & sawah', 3.34, 4.12], ['Candi Majapahit', 3.96, 4.28]];
          items.forEach(([s, a, b], i) => { const ia = fi(lt, a - .02, .12); if (ia <= 0) return; const yy = ry + 48 + i * 40;
            ctx.save(); ctx.globalAlpha *= ia;
            if (lt < b) { ctx.strokeStyle = CORAL; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(84, yy, 10, lt * 9, lt * 9 + 4.2); ctx.stroke(); }
            else check(84, yy, 12, pop(lt, b, .25));
            T(s, 106, yy + 1, { size: 23, weight: 600, color: lt < b ? C.mute : C.text, align: 'left' }); ctx.restore(); });
          ctx.restore();
        }
        // small reply box
        rr(30, 532, 450, 70, 20); ctx.fillStyle = C.field; ctx.fill(); ctx.strokeStyle = '#45433e'; ctx.lineWidth = 1.5; ctx.stroke();
        T('Balas Claude…', 54, 568, { size: 23, weight: 600, color: '#77736b', align: 'left' }); sendBtn(446, 567, 18, false);
        // artifact panel
        const pk = E.quint(P(lt, 2.96, 3.36)), px = 500 + 520 * (1 - pk);
        ctx.save(); ctx.translate(px, 0);
        ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; rr(0, 52, 486, 562, 20); ctx.fillStyle = '#1b1a19'; ctx.fill(); ctx.shadowColor = 'transparent';
        ctx.strokeStyle = C.line; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = CORAL; ctx.beginPath(); ctx.moveTo(22, 70); ctx.lineTo(38, 80); ctx.lineTo(22, 90); ctx.closePath(); ctx.fill();
        T('Majapahit · Ghibli', 50, 81, { size: 22, weight: 800, color: C.text, align: 'left' });
        rr(390, 66, 78, 30, 15); ctx.fillStyle = '#2d2c2a'; ctx.fill(); T('Video', 429, 82, { size: 16, weight: 700, color: C.mute });
        // progress
        const prog = clamp(E.io(P(lt, 3.1, 4.3)) * .97 + .03 * P(lt, 4.2, 4.3)), done = lt >= 4.3;
        rr(16, 578, 454, 8, 4); ctx.fillStyle = '#34322f'; ctx.fill();
        if (prog > 0) { rr(16, 578, 454 * prog, 8, 4); const g = ctx.createLinearGradient(16, 0, 470, 0); g.addColorStop(0, '#c4603f'); g.addColorStop(1, '#f0a07f'); ctx.fillStyle = g; ctx.fill();
          if (!done) { const sx2 = 16 + ((lt * 1.6) % 1) * 454 * prog; const g2 = ctx.createLinearGradient(sx2 - 50, 0, sx2 + 50, 0); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(.5, 'rgba(255,255,255,.8)'); g2.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g2; rr(16, 578, 454 * prog, 8, 4); ctx.fill(); } }
        T(done ? 'Selesai' : 'Melukis adegan…', 16, 604, { size: 18, weight: 700, color: done ? '#7fd49a' : C.mute, align: 'left' });
        T(Math.round(prog * 100) + '%', 470, 604, { size: 18, weight: 800, color: C.text, align: 'right' });
        ctx.restore();
        st.vid = [px + 16, 108, 454, 458];
        ctx.restore();
      }
      ctx.restore();
    }
    // ---------- video area (painting) — expands to fullscreen at the end
    if (lt > 2.9) {
      const v = st.vid || [516, 108, 454, 458], k = kEx;
      const rx = lerp(v[0], 0, k), ry = lerp(v[1], 0, k), rw = lerp(v[2], SW, k), rh = lerp(v[3], SH, k), rad = lerp(12, 0, k);
      ctx.save(); ctx.globalAlpha = kEx > 0 ? 1 : E.out(P(lt, 2.96, 3.2)); rr(rx, ry, rw, rh, rad); ctx.clip();
      ctx.fillStyle = '#121211'; ctx.fillRect(rx, ry, rw, rh);
      const sc = Math.max(rw / PW, rh / PH), ox = rx + (rw - PW * sc) / 2, oy = ry + (rh - PH * sc) / 2;
      ctx.save(); ctx.translate(ox, oy); ctx.scale(sc, sc);
      if (lt < 4.3) { buildREV(lt); ctx.drawImage(REV, 0, 0, PW, PH); }
      else {
        const lk = lt - 4.3;
        ctx.drawImage(PL.sky, 0, 0, PW, PH);
        blob(SUN[0], SUN[1], 260 + 40 * Math.sin(lt * 3), '255,240,200', .35 + .5 * P(lt, 4.5, 5.4));
        ctx.drawImage(PL.clouds, -lk * 26, 0, PW, PH);
        ctx.drawImage(P_REST, 0, 0, PW, PH);
        ctx.strokeStyle = 'rgba(50,40,60,.85)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) { const bx = 1000 - lk * 70 - i * 34 - h(i) * 20, byy = 330 + i * 16 + Math.sin(lk * 2 + i) * 6, f = Math.sin(lk * 16 + i * 1.7) * 7;
          ctx.beginPath(); ctx.moveTo(bx - 11, byy - f); ctx.quadraticCurveTo(bx - 4, byy - 4, bx, byy); ctx.quadraticCurveTo(bx + 4, byy - 4, bx + 11, byy - f); ctx.stroke(); }
      }
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .16; ctx.drawImage(PAPER, 0, 0, PW, PH); ctx.restore();
      const m = ctx.getTransform(); st.sun = m.transformPoint(new DOMPoint(SUN[0], SUN[1]));
      ctx.restore();
      // generating shimmer sweep over the preview
      const gk = P(lt, 2.98, 3.1) * (1 - P(lt, 4.2, 4.32));
      if (gk > 0) { const u = ((lt - 2.98) / .7) % 1, sx3 = rx - 200 + u * (rw + 400);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = gk * .2; const g = ctx.createLinearGradient(sx3 - 120, ry, sx3 + 120, ry + rh * .3);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(rx, ry, rw, rh); ctx.restore(); }
      // play badge when done
      const pb = pop(lt, 4.26, .25) * (1 - P(lt, 4.45, 4.6));
      if (pb > 0) { ctx.save(); ctx.translate(rx + rw / 2, ry + rh / 2); ctx.scale(pb, pb); ctx.fillStyle = 'rgba(255,255,255,.88)'; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.fill();
        ctx.fillStyle = CORAL; ctx.beginPath(); ctx.moveTo(-12, -18); ctx.lineTo(20, 0); ctx.lineTo(-12, 18); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
    // ---------- dragged PDF + pointer
    if (lt > .55 && lt < 1.34) {
      const e = E.io(P(lt, .6, 1.1)), pos = k => [lerp(1090, DROP[0], k), lerp(560, DROP[1], k) - 90 * Math.sin(Math.PI * k)];
      const settle = P(lt, 1.1, 1.3), [x, y] = pos(e);
      const tgt = [BX + 20 + 33, boxTop(lt) + 18 + 33];
      const fx = lerp(x, tgt[0], E.io(settle)), fy = lerp(y, tgt[1], E.io(settle)), s = lerp(1, .5, E.io(settle)), a = 1 - P(lt, 1.18, 1.3);
      const rot = .22 * Math.sin(Math.PI * e) - .1 * Math.exp(-settle * 6) * Math.sin(settle * 18) * (settle > 0 ? 1 : 0);
      for (let k = 4; k >= 1; k--) { const [tx, ty] = pos(E.io(P(lt - k * .009, .6, 1.1))); ctx.save(); ctx.translate(tx, ty); ctx.rotate(rot); pdfIcon(0, 0, 1, a * .07 * (5 - k) * (e < .98 ? 1 : 0)); ctx.restore(); }
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(rot * (1 - settle));
      ctx.save(); ctx.globalAlpha = a * .4 * (1 - settle); ctx.fillStyle = '#000'; ctx.filter = 'blur(8px)'; ctx.fillRect(-30, -36, 84, 112); ctx.restore();
      pdfIcon(0, 0, s, a); if (settle <= 0) T('Prompt-Pack.pdf', 0, 76, { size: 18, weight: 700, color: C.text });
      ctx.restore();
      pointer(x + 18 + 40 * settle, y + 30 + 30 * settle, 1, 1 - P(lt, 1.15, 1.32));
    }
    if (lt > 2.4 && lt < 3.0) {
      const k = E.io(P(lt, 2.42, 2.7)), x = lerp(760, BX + BW - 52, k), y = lerp(560, BB - 46, k);
      pointer(x, y, 1 - .12 * Math.sin(Math.PI * P(lt, 2.7, 2.82)), fi(lt, 2.4, .1) * (1 - P(lt, 2.85, 3.0)));
    }
    // glass: subtle sheen
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createLinearGradient(0, 0, SW, SH);
    gg.addColorStop(0, 'rgba(255,220,180,.05)'); gg.addColorStop(.4, 'rgba(255,255,255,0)'); gg.addColorStop(.62, 'rgba(255,255,255,.025)'); gg.addColorStop(.7, 'rgba(255,255,255,0)');
    ctx.globalAlpha = 1 - kEx; ctx.fillStyle = gg; ctx.fillRect(0, 0, SW, SH); ctx.restore();
  }

  // ------------------------------------------------------------------ camera
  function camAt(lt) {
    let z = lerp(1.0, 1.1, E.sine(P(lt, 0, 1.0))), x = 540, y = 985;
    const k1 = E.io(P(lt, .5, 1.55)); z = lerp(z, 1.95, k1); y = lerp(y, 935, k1);
    z *= 1 + .035 * E.sine(P(lt, 1.55, 2.78));
    const k2 = E.io(P(lt, 2.78, 3.3)); z = lerp(z, 1.76, k2); x = lerp(x, 548, k2); y = lerp(y, 882, k2);
    const k3 = E.sine(P(lt, 3.3, 4.4)); z = lerp(z, 1.84, k3); x = lerp(x, 566, k3);
    const k4 = E.io(P(lt, 4.36, 5.7)), kp = E.io(P(lt, 4.36, 5.0)); z = z * Math.pow(6.2 / z, k4); x = lerp(x, DCX, kp); y = lerp(y, DCY, kp);
    x += noise1(lt * .7 + 3) * 2.5; y += noise1(lt * .6 + 9) * 2.5;
    const r = lerp(-.03, -.006, E.io(P(lt, 0, 1.7))) + noise1(lt * .5) * .003 + .03 * E.in(P(lt, 4.5, 5.9));
    return { z, x, y, r };
  }
  function cam(c, d, fn) {
    const z = Math.pow(c.z, d);
    ctx.save(); ctx.translate(540, 960); ctx.rotate(c.r * d); ctx.scale(z, z); ctx.translate(-(540 + (c.x - 540) * d), -(960 + (c.y - 960) * d)); fn(); ctx.restore();
  }

  SCENES_REG.claude = {
    cues: [[1.12, 'pop'], [TY0, 'type', TY1 - TY0 + .05], [2.72, 'notif'], [3.08, 'shimmer'], [4.0, 'riser', 1.35], [4.42, 'whoosh_in'], [5.35, 'impact_big']],
    draw(lt) {
      const c = camAt(lt), st = {};
      // screen light: dim cool UI -> warm painting -> blinding
      const paintK = P(lt, 3.1, 4.3), burst = E.in(P(lt, 4.5, 6.0));
      const sl = .55 + .35 * paintK + 3 * burst;
      const scol = paintK > .5 ? '255,205,150' : '135,160,255';
      bgFill('#04060b');
      const covered = lt > 5 && DH * c.z / 2 > 960 + 540 * Math.abs(c.r) + 30 && DW * c.z / 2 > 540 + 960 * Math.abs(c.r) + 30;
      if (!covered) {
      cam(c, .72, () => { put(WALL); put(BOKEH, .9 + .1 * noise1(lt * 1.3)); blob(DCX, DCY - 20, 760, scol, .16 * Math.min(sl, 1.6)); });
      cam(c, .95, () => put(CONE, .85 + .1 * noise1(lt * 1.7), 'lighter'));
      cam(c, 1, () => { put(DESK); blob(DCX, 1270, 560, scol, .22 * Math.min(sl, 2)); });
      cam(c, .96, () => put(LAMP));
      cam(c, 1.04, () => { ctx.translate(962, 1240); ctx.rotate(noise1(lt * .4) * .006); ctx.translate(-962, -1240); put(PLANT); });
      cam(c, 1, () => {
        put(LAPTOP);
        ctx.save(); ctx.translate(DX, DY); ctx.scale(DS, DS); ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.clip(); drawUI(lt, st); ctx.restore();
        // keyboard + bezel light from the screen
        ctx.save(); ctx.beginPath(); ctx.moveTo(XL0, BT); ctx.lineTo(XR0, BT); ctx.lineTo(XR1, BF + 14); ctx.lineTo(XL1, BF + 14); ctx.closePath(); ctx.clip();
        blob(DCX, BT - 30, 380, scol, .22 * Math.min(sl, 2.5)); ctx.restore();
        blob(DCX, DCY, 420, scol, .06 * Math.min(sl, 2));
      });
      } else cam(c, 1, () => { ctx.save(); ctx.translate(DX, DY); ctx.scale(DS, DS); ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.clip(); drawUI(lt, st); ctx.restore(); });
      if (!covered) {
      // dust motes in the lamp beam
      cam(c, .97, () => {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 90; i++) {
          const x = 120 + h(i * 1.3) * 560 + noise1(lt * .35 + i) * 26 + lt * 5, y = 560 + h(i * 2.7) * 700 + noise1(lt * .3 + i * 3) * 26 - lt * 7;
          const m = inCone(x, y) * (y > DY - 30 && y < BF ? clamp((DX + 30 - x) / 110) : 1); if (m <= .02) continue;
          const z = h(i * 4.1), r = .8 + z * 2.6, a = m * (.35 + .65 * (.5 + .5 * Math.sin(lt * 2 + i)));
          ctx.fillStyle = `rgba(255,${200 + z * 40 | 0},150,${a * .8})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        }
        ctx.restore();
      });
      // foreground
      cam(c, 1.12, () => put(BOOK));
      cam(c, 1.3, () => {
        put(MUG);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) for (const [lw, a] of [[26, .025], [10, .04]]) {
          ctx.strokeStyle = `rgba(255,225,190,${a})`; ctx.lineWidth = lw; ctx.beginPath();
          for (let k = 0; k <= 16; k++) { const u = k / 16, yy = 1450 - u * 300, xx = 120 + i * 22 + noise1(u * 2.2 - lt * .9 + i * 5) * 40 * u + Math.sin(u * 5 + lt + i) * 8 * u; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
          ctx.stroke();
        }
        ctx.restore();
      });
      }
      // tiny overlay line while the prompt types
      const ov = fi(lt, 1.6, .3) * (1 - P(lt, 2.6, 2.85)); if (ov > 0) subtitle('Cukup ketik.', 1650, ov, { size: 52 });
      // ---------- burst: light & colour pour out of the screen
      const kb = P(lt, 4.55, 6.0);
      if (kb > 0) {
        const sp = st.sun || { x: 540, y: 900 }, sx = clamp(sp.x, -200, W + 200), sy = clamp(sp.y, -200, H + 200), eb = E.in(kb);
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(lt * .18); const rs = 1.2 + 3.2 * eb; ctx.scale(rs, rs); ctx.globalAlpha = clamp(eb * 1.4); ctx.drawImage(RAYS, -500, -500); ctx.rotate(-lt * .4); ctx.globalAlpha = clamp(eb); ctx.drawImage(RAYS, -500, -500); ctx.restore();
        blob(sx, sy, 260 + 1500 * eb, '255,232,185', .25 + .9 * eb);
        // anamorphic streak
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, .035); blob(0, 0, 1100, '190,215,255', .5 * Math.sin(Math.PI * clamp(kb * 1.2))); ctx.restore();
        // particles: sparks, petals, leaves flying toward camera
        const pk = P(lt, 4.6, 5.0);
        for (let i = 0; i < 80; i++) {
          const rate = .55 + h(i * 3.3) * .7, u = ((lt - 4.6) * rate + h(i * 7.7)) % 1; if (lt < 4.6 + (1 - h(i * 7.7)) / rate * 0 || pk <= 0) continue;
          const a = h(i * 1.9) * 6.283, d = 30 + Math.pow(u, 2.3) * 1500, d0 = 30 + Math.pow(Math.max(0, u - .018), 2.3) * 1500;
          const x = sx + Math.cos(a) * d, y = sy + Math.sin(a) * d * 1.1, x0 = sx + Math.cos(a) * d0, y0 = sy + Math.sin(a) * d0 * 1.1;
          const al = Math.sin(Math.PI * u) * pk, typ = i % 5, sz = 2 + u * u * (typ < 3 ? 10 : 22);
          if (typ < 3) { const col = typ === 0 ? '255,240,210' : typ === 1 ? '255,200,120' : '255,170,190';
            ctx.strokeStyle = `rgba(${col},${al * .22})`; ctx.lineWidth = sz * .7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
            blob(x, y, sz * 2.2, col, al * .9); }
          else { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = al * .9; ctx.translate(x, y); ctx.rotate(lt * 3 + i); ctx.fillStyle = typ === 3 ? '#ffc6d4' : '#b9e08f';
            ctx.beginPath(); ctx.ellipse(0, 0, sz, sz * .45, 0, 0, 7); ctx.fill(); ctx.restore(); }
        }
        ctx.restore();
        // warm white wash -> handoff
        const ww = E.in(P(lt, 5.15, 5.97));
        if (ww > 0) { ctx.save(); ctx.globalAlpha = ww; radial(sx, sy, 1700, '#fffdf6', '#ffe9c8'); ctx.restore(); }
      }
      // fade up from darkness
      const fd = 1 - E.out(P(lt, 0, .75)); if (fd > 0) { ctx.fillStyle = `rgba(0,0,0,${fd})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
    },
  };
})();
