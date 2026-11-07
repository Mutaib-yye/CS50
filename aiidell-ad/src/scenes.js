// ===== Scene timeline (50 s, vertical 9:16, soft-sell story) =====
// ===== Scene timeline (50 seconds) =====
// keyframe helper: [[t,v],...] smooth interpolation
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t < t1) return lerp(v0, v1, E.inOutSine((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

function onHoldScreen(c, x, y, w, h, u, t) {
  card(c, x, y, w, h, { fill: '#f4f5fa' });
  c.save(); rr(c, x, y, w, h, 24); c.clip();
  c.fillStyle = '#41507e'; c.fillRect(x, y, w, 80);
  txt(c, 'Courier Helpline', x + 24, y + 30, { size: 19, align: 'left', color: '#fff', weight: 600 });
  txt(c, 'Calling…', x + 24, y + 56, { size: 13, align: 'left', color: '#dfe5ff', weight: 400 });
  txt(c, 'ON HOLD', x + w / 2, y + 140, { size: 22, color: '#c2334a', font: 'Fredoka', weight: 700, ls: 4 });
  const secs = 47 * 60 + 12 + Math.floor(u * 37);
  const hh = String(Math.floor(secs / 3600)).padStart(2, '0'), mm = String(Math.floor((secs % 3600) / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  txt(c, `${hh}:${mm}:${ss}`, x + w / 2, y + 196, { size: 46, color: '#1a1f33', weight: 700 });
  // waveform
  for (let i = 0; i < 18; i++) {
    const bh = 10 + Math.abs(Math.sin(t * 6 + i * 0.7)) * 40;
    c.fillStyle = '#9aa6d0'; rr(c, x + 36 + i * 15, y + 280 - bh / 2, 8, bh, 4); c.fill();
  }
  txt(c, '"Your call is important to us"', x + w / 2, y + 345, { size: 15, color: '#666c80', weight: 400 });
  txt(c, 'Position in queue: 38', x + w / 2, y + 380, { size: 15, color: '#666c80', weight: 600 });
  c.fillStyle = '#e24a5a'; c.beginPath(); c.arc(x + w / 2, y + 440, 28, 0, TAU); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(x + w / 2, y + 448, 14, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
  c.restore();
  // floating music notes
  for (let k = 0; k < 4; k++) {
    const p = (u * 0.5 + k / 4) % 1;
    txt(c, k % 2 ? '♪' : '♫', x + w + 10 + Math.sin(p * 6 + k) * 16, y + 300 - p * 220, { size: 34, color: '#c9d2ff', alpha: Math.sin(p * Math.PI), font: 'DejaVu Sans', weight: 400 });
  }
}

function pillTag(c, x, y, s, a, col, bg) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= clamp(a * 1.4); c.translate(x, y); const k = E.outBack(clamp(a)); c.scale(k, k);
  c.font = '700 30px Fredoka';
  const w = c.measureText(s).width + 60;
  c.shadowColor = 'rgba(30,10,50,0.3)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
  c.fillStyle = bg; rr(c, -w / 2, -30, w, 60, 30); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  txt(c, s, 0, 2, { size: 30, color: col, font: 'Fredoka', weight: 700 });
  c.restore();
}

function teamScene(c, t, u) {
  // pastel office in Jakarta
  const bg = c.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, '#fff3f8'); bg.addColorStop(1, '#efe4ff');
  c.fillStyle = bg; c.fillRect(-300, -450, 1560, 2000);
  // wall sign
  c.save();
  c.shadowColor = 'rgba(139,92,246,0.3)'; c.shadowBlur = 20;
  c.fillStyle = '#fff'; rr(c, 300, 110, 520, 110, 26); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  drawLogoIcon(c, 368, 165, 0.6);
  txt(c, 'AiiDell Team', 420, 148, { size: 34, align: 'left', font: 'Fredoka', weight: 700, color: '#ff4f8b' });
  txt(c, 'Jakarta · Indonesia', 420, 188, { size: 20, align: 'left', weight: 600, color: '#8a6ab8' });
  idFlag(c, 750, 175, 50);
  c.restore();
  // shelves with gifts
  [[60, 320], [820, 320]].forEach(([sx, sy], i) => {
    c.fillStyle = '#e5d6ff'; c.fillRect(sx - 60, sy + 70, 200, 12);
    drawGiftBox(c, sx + 20, sy + 70, 0.32, t);
    if (i) drawCake(c, sx + 40, sy + 260, 0.0001, t);
  });
  drawPlant(c, 900, 900, 0.7, t);
  // team members
  drawWoman(c, { x: 280, y: 770, s: 0.82, who: 'H', t, mood: { happy: 0.7 }, look: { x: 0.5, y: -0.1 }, blink: blink(t, 8), tilt: Math.sin(t * 1.4) * 0.03,
    pose: { lh: [-70, 200], rh: [70, 200], prop: c2 => drawBouquet(c2, 0, 200, 0.32, t) } });
  drawMan(c, { x: 690, y: 780, s: 0.82, who: 'T', t, mood: { happy: 0.85 }, look: { x: -0.5, y: -0.1 }, blink: blink(t, 9), tilt: Math.sin(t * 1.2 + 1) * 0.03,
    pose: { phone: false, lh: [-70, 210], rh: [70, 210], prop: c2 => drawGiftBox(c2, 6, 250, 0.42, t) } });
  // desk
  const dg = c.createLinearGradient(0, 940, 0, 1080); dg.addColorStop(0, '#ffffff'); dg.addColorStop(1, '#e8dcfa');
  c.fillStyle = dg; c.fillRect(-300, 950, 1560, 700);
  c.fillStyle = '#d9c6ff'; c.fillRect(-300, 944, 1560, 8);
  // order ticket
  const tk = E.outBack(clamp((u - 0.5) / 0.5));
  if (tk > 0) {
    c.save(); c.translate(480, 350); c.scale(tk * 0.85, tk * 0.85); c.rotate(Math.sin(t * 1.5) * 0.01);
    c.shadowColor = 'rgba(139,92,246,0.35)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
    c.fillStyle = '#fff'; rr(c, -230, -110, 460, 250, 26); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    c.fillStyle = brandGrad(c, -230, 0, 230, 0); rr(c, -230, -110, 460, 56, 26); c.fill(); c.fillRect(-230, -80, 460, 26);
    txt(c, 'NEW ORDER  #ID-2048', 0, -82, { size: 22, color: '#fff', font: 'Fredoka', weight: 700, ls: 1 });
    txt(c, 'Blush Rose Bouquet  →  Putri, Jakarta', 0, -26, { size: 17, color: '#2a1f4a', weight: 600 });
    const steps = ['Order received', 'Gift prepared', 'Out for delivery'];
    steps.forEach((s, i) => {
      const p = clamp((u - 1.0 - i * 0.55) * 4);
      const yy = 18 + i * 38;
      c.fillStyle = p > 0 ? '#2fb36a' : '#e6dcf0'; c.beginPath(); c.arc(-170, yy, 13, 0, TAU); c.fill();
      if (p > 0) { c.strokeStyle = '#fff'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-176, yy); c.lineTo(-171, yy + 5); c.lineTo(-163, yy - 5); c.stroke(); }
      txt(c, s, -146, yy, { size: 17, align: 'left', color: p > 0 ? '#2a1f4a' : '#b9a9cf', weight: 600 });
      if (p > 0 && p < 1) sparkle(c, -170, yy, 18 * p, '#6ee7a0', 1 - p);
    });
    c.restore();
  }
}

function journeyScene(c, t, u, pw = 960) {
  const bg = c.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, '#2a1a5e'); bg.addColorStop(0.6, '#6b3a8e'); bg.addColorStop(1, '#ff8fb5');
  c.fillStyle = bg; c.fillRect(-300, -450, 1560, 2000);
  const R = rng(31);
  for (let i = 0; i < 70; i++) { const sx = -100 + R() * 1160, sy = R() * 700; glowDot(c, sx, sy, 3 + R() * 4, 'rgba(255,255,255,0.9)', 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))); }
  const z = kf(u, [[0, 1.0], [3.2, 1.08]]);
  c.save(); c.translate(480, 560); c.scale(z, z); c.translate(-480, -560);
  const m = { x: -20, y: 380, w: 1000, h: 634, lon0: 64, lon1: 146, lat0: -14, lat1: 38 };
  drawMap(c, m, t, { labelSize: 30 });
  const p = E.inOut(clamp((u - 0.3) / 2.2));
  drawRoute(c, m, p, t, { lw: 7 });
  if (p > 0 && p < 1) {
    const [gx, gy] = routePoint(m, p);
    for (let k = 1; k < 14; k++) { const [tx, ty] = routePoint(m, Math.max(0, p - k * 0.012)); sparkle(c, tx + Math.sin(k * 3 + t * 5) * 8, ty + Math.cos(k * 2 + t * 5) * 8, 9 - k * 0.5, k % 2 ? '#ffd27a' : '#ffb3cf', 1 - k / 14, t * 2 + k); }
    glowDot(c, gx, gy, 80, 'rgba(255,220,150,0.6)');
    drawGiftBox(c, gx, gy + 40, 0.38, t);
  }
  if (u > 2.5) { // arrival burst
    const [ , , , , bx, by] = routePoint(m, 1);
    const bp = clamp((u - 2.5) / 1.0);
    for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; drawHeart(c, bx + Math.cos(a) * bp * 120, by + Math.sin(a) * bp * 90 - bp * 30, 26, '#ff6f9f', 1 - bp); }
    drawGiftBox(c, bx, by + 30 - E.outBack(clamp((u - 2.5) * 3)) * 10, 0.38 * (1 + Math.sin(clamp((u - 2.5) * 3) * Math.PI) * 0.2), t);
  }
  c.restore();
  txt(c, 'Delivered with love', 480, 190, { size: 40, font: 'Fredoka', weight: 700, color: '#fff', shadow: 'rgba(80,20,60,0.6)', blur: 12, alpha: win(u, 0.4, 3.3, 0.4, 0.3) });
}

function recipientScene(c, t, u) {
  // Jakarta home exterior at golden hour
  const sky = c.createLinearGradient(0, 0, 0, 700);
  sky.addColorStop(0, '#ffb3cf'); sky.addColorStop(1, '#ffe2b8');
  c.fillStyle = sky; c.fillRect(-300, -450, 1560, 2000);
  // palm trees
  [[90, 1.0], [880, 0.9]].forEach(([px, s], i) => {
    c.save(); c.translate(px, 1000); c.scale(s, s);
    c.strokeStyle = '#8a5a3a'; c.lineWidth = 26; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(i ? -40 : 40, -300, i ? -20 : 20, -620); c.stroke();
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.5 + Math.sin(t * 1.2 + k) * 0.04;
      c.save(); c.translate(i ? -20 : 20, -620); c.rotate(a);
      const lg = c.createLinearGradient(0, 0, 200, 0); lg.addColorStop(0, '#3a9a5a'); lg.addColorStop(1, '#8fdc9f');
      c.fillStyle = lg; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(110, -50, 230, 30); c.quadraticCurveTo(110, -10, 0, 0); c.fill();
      c.restore();
    }
    c.restore();
  });
  // house wall & arched door
  c.fillStyle = '#fff3e4'; c.fillRect(160, 250, 640, 830);
  c.fillStyle = '#c8653a';
  c.beginPath(); c.moveTo(130, 260); c.lineTo(480, 120); c.lineTo(830, 260); c.closePath(); c.fill();
  const dg = c.createLinearGradient(330, 380, 630, 1000); dg.addColorStop(0, '#a8643a'); dg.addColorStop(1, '#6e3a1e');
  c.fillStyle = '#e9d2b8'; c.beginPath(); c.moveTo(310, 1080); c.lineTo(310, 520); c.arc(480, 520, 170, Math.PI, 0); c.lineTo(650, 1080); c.fill();
  c.fillStyle = dg; c.beginPath(); c.moveTo(330, 1080); c.lineTo(330, 520); c.arc(480, 520, 150, Math.PI, 0); c.lineTo(630, 1080); c.fill();
  // garden lawn + stone path below the house (visible in tall framing)
  const lg = c.createLinearGradient(0, 1070, 0, 1500); lg.addColorStop(0, '#8fd49a'); lg.addColorStop(1, '#4f9e62');
  c.fillStyle = lg; c.fillRect(-300, 1078, 1560, 600);
  c.fillStyle = '#efe0c8';
  for (let k = 0; k < 5; k++) { c.beginPath(); c.ellipse(480 + Math.sin(k * 1.7) * 20, 1120 + k * 70, 90 - k * 4, 22, 0, 0, TAU); c.fill(); }
  // warm interior light spill
  glowDot(c, 480, 600, 330, 'rgba(255,220,160,0.45)');
  // lanterns
  [[230, 380], [730, 380]].forEach(([lx, ly], i) => {
    glowDot(c, lx, ly + 40, 70, 'rgba(255,200,120,0.7)');
    c.strokeStyle = '#7a4a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(lx, ly - 20); c.lineTo(lx, ly + 10); c.stroke();
    c.fillStyle = '#ff9a5a'; rr(c, lx - 22, ly + 10, 44, 60, 16); c.fill();
  });
  // frangipani bush
  [[200, 960], [760, 980]].forEach(([bx, by]) => {
    c.fillStyle = '#4a9a5a'; c.beginPath(); c.ellipse(bx, by, 110, 70, 0, 0, TAU); c.fill();
    for (let k = 0; k < 7; k++) { const fx = bx - 80 + k * 26, fy = by - 30 + Math.sin(k * 2) * 26; c.fillStyle = '#fff'; for (let p = 0; p < 5; p++) { c.beginPath(); c.ellipse(fx + Math.cos(p * 1.26) * 7, fy + Math.sin(p * 1.26) * 7, 6, 4, p * 1.26, 0, TAU); c.fill(); } c.fillStyle = '#ffd34d'; c.beginPath(); c.arc(fx, fy, 3, 0, TAU); c.fill(); }
  });
  // box descends into her hands
  const land = E.out(clamp((u - 0.3) / 0.9));
  const open = E.outBack(clamp((u - 1.6) / 0.6));
  const hold = clamp((u - 1.2) * 4);
  const happy = kf(u, [[0, 0.5], [1.2, 0.8], [1.7, 1]]);
  const surprise = kf(u, [[0, 0], [0.4, 0.8], [1.1, 0.6], [1.7, 0.2], [2.4, 0]]);
  drawWoman(c, {
    x: 480, y: 740, s: 0.95, who: 'P', t, mood: { happy, surprise }, look: { x: 0, y: kf(u, [[0, -0.8], [1.0, 0.6], [1.7, 0.2], [2.4, 0]]) },
    blink: blink(t, 12), tilt: Math.sin(t * 1.3) * 0.04 + kf(u, [[1.6, 0], [2.2, 0.08]]),
    pose: {
      lh: [-92, 205], rh: [92, 205],
      prop: c2 => { if (hold > 0) drawGiftBox(c2, 6, 225, 0.5, t, open); },
    },
  });
  if (hold <= 0) {
    const bxOf = l => 486 + 330 * (1 - E.inOut(clamp((l - 0.75) / 0.25)));
    const by = lerp(-150, 740 + 225 * 0.95, land), bx = bxOf(land);
    for (let k = 1; k < 9; k++) { const lk = Math.max(0, land - k * 0.035); sparkle(c, bxOf(lk), lerp(-150, 953, lk) - 60, 11 - k, '#fff6d8', 1 - k / 9, t + k); }
    drawGiftBox(c, bx, by, 0.5 * 0.95, t, 0);
  }
  // burst from open box
  if (u > 1.7) {
    const bp = clamp((u - 1.7) / 1.4);
    const ox = 480, oy = 740 + 150;
    for (let k = 0; k < 14; k++) {
      const sideK = k % 2 ? 1 : -1; const a = -Math.PI / 2 + sideK * (0.75 + (k >> 1) * 0.16);
      const d = E.out(bp) * (240 + (k % 3) * 60);
      drawHeart(c, ox + Math.cos(a) * d, oy + Math.sin(a) * d * 0.9 - bp * 60, 22 + (k % 3) * 8, k % 2 ? '#ff6f9f' : '#ff9cc0', 1 - E.in(bp));
    }
    // showcase items orbiting to the sides (never over her face)
    const items = [[drawBouquet, -330, -40, 0.34], [drawCake, 330, -20, 0.36], [drawSnacks, -300, 260, 0.36], [drawFood, 300, 270, 0.34]];
    items.forEach(([fn, dx, dy, s], i) => {
      const ip = E.outBack(clamp((u - 1.9 - i * 0.15) / 0.5));
      if (ip <= 0) return;
      const x = ox + dx * ip, y = 600 + dy * ip + Math.sin(t * 2 + i) * 8;
      glowDot(c, x, y - 60, 120, 'rgba(255,255,255,0.75)', ip);
      fn(c, x, y, s * ip, t);
    });
  }
  txt(c, 'Surprise delivered!', 520, 150, { size: 46, font: 'Fredoka', weight: 700, color: '#fff', stroke: '#ff4f8b', sw: 10, alpha: win(u, 1.8, 4, 0.3, 0.3) });
}

function pipMan(c, t, x, y, r, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a;
  const k = E.outBack(clamp(a));
  c.translate(x, y); c.scale(k, k);
  c.shadowColor = 'rgba(120,40,110,0.5)'; c.shadowBlur = 30;
  c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r + 10, 0, TAU); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
  const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#ffe6f0'); g.addColorStop(1, '#f7c6da');
  c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2);
  drawMan(c, { x: 0, y: 105, s: 0.62, who: 'R', t, mood: { happy: 1 }, look: { x: 0, y: 0.1 }, tilt: Math.sin(t * 2) * 0.05, blink: blink(t, 4), pose: { phoneY: 215 } });
  c.restore();
  c.strokeStyle = brandGrad(c, -r, 0, r, 0); c.lineWidth = 8; c.beginPath(); c.arc(0, 0, r + 4, 0, TAU); c.stroke();
  for (let i = 0; i < 3; i++) { const p = (t * 0.6 + i / 3) % 1; drawHeart(c, r * 0.7 + Math.sin(p * 6) * 10, -r * 0.6 - p * 90, 22, '#ff4f8b', Math.sin(p * Math.PI)); }
  c.restore();
}

function videoCallScreen(c, w, h, t) {
  const bg = c.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#ffe2b8'); bg.addColorStop(1, '#ffb3cf');
  c.fillStyle = bg; c.fillRect(0, 0, w, h);
  glowDot(c, w * 0.7, h * 0.25, 200, 'rgba(255,255,255,0.6)');
  drawWoman(c, { x: w / 2, y: h * 0.62, s: 0.95, who: 'P', t, mood: { happy: 1 }, look: { x: 0, y: 0 }, blink: blink(t, 13), tilt: Math.sin(t * 1.6) * 0.05,
    pose: { lh: [-70, 200], rh: [70, 200], prop: c2 => drawBouquet(c2, 0, 200, 0.42, t) } });
  // UI
  const tg = c.createLinearGradient(0, 0, 0, 150); tg.addColorStop(0, 'rgba(0,0,0,0.35)'); tg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = tg; c.fillRect(0, 0, w, 150);
  txt(c, 'Putri', w / 2, 82, { size: 26, color: '#fff', weight: 700 });
  drawHeart(c, w / 2 + 52, 84, 20, '#ff4f8b', 1, false);
  txt(c, 'Video call · 02:14', w / 2, 114, { size: 15, color: '#fff', weight: 400 });
  // self view
  c.save(); rr(c, w - 128, 140, 104, 150, 18); c.clip();
  c.fillStyle = '#fbe0ec'; c.fillRect(w - 128, 140, 104, 150);
  drawMan(c, { x: w - 76, y: 310, s: 0.4, who: 'R', t, mood: { happy: 1 }, look: { x: 0, y: 0 }, blink: blink(t, 4), pose: { phone: false, lh: [-60, 300], rh: [60, 300] } });
  c.restore();
  c.strokeStyle = '#fff'; c.lineWidth = 3; rr(c, w - 128, 140, 104, 150, 18); c.stroke();
  // buttons
  [['#ffffff55', -110], ['#e24a5a', 0], ['#ffffff55', 110]].forEach(([col, dx], i) => {
    c.fillStyle = col; c.beginPath(); c.arc(w / 2 + dx, h - 90, 34, 0, TAU); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 4; c.lineCap = 'round';
    if (i === 1) { c.beginPath(); c.arc(w / 2, h - 82, 16, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    else if (i === 0) { rr(c, w / 2 + dx - 7, h - 106, 14, 24, 7); c.stroke(); c.beginPath(); c.moveTo(w / 2 + dx, h - 78); c.lineTo(w / 2 + dx, h - 72); c.stroke(); }
    else { rr(c, w / 2 + dx - 14, h - 100, 20, 20, 4); c.stroke(); c.beginPath(); c.moveTo(w / 2 + dx + 8, h - 94); c.lineTo(w / 2 + dx + 16, h - 99); c.lineTo(w / 2 + dx + 16, h - 81); c.lineTo(w / 2 + dx + 8, h - 86); c.stroke(); }
  });
}

function wrapLines(c, s, maxW) {
  const words = s.split(' '); const lines = []; let cur = '';
  words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (c.measureText(tst).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tst; });
  if (cur) lines.push(cur);
  return lines;
}
// ---------------------------------------------------------------- SHOWCASE (S4)
const SHOW = [
  ['FLOWERS', 'Beautiful bouquets to make someone\'s day.', drawBouquet, 0.95],
  ['GIFTS', 'Thoughtful surprises for special occasions.', drawGiftBox, 1.15],
  ['FOOD', 'Delicious meals delivered to loved ones.', drawFood, 1.05],
  ['SNACKS', 'Send Indian snacks and treats.', drawSnacks, 1.05],
  ['CAKES', 'Celebrate birthdays and special moments from miles away.', drawCake, 1.0],
];
function showcase(c, t) {
  const u = t - 28.0;
  const bg = c.createRadialGradient(540, 1000, 100, 540, 960, 1300);
  bg.addColorStop(0, '#fff8f2'); bg.addColorStop(0.5, '#ffe3ee'); bg.addColorStop(1, '#d9c6ff');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const R = rng(99);
  for (let i = 0; i < 30; i++) {
    const bx = R() * W, by = R() * H, br = 30 + R() * 90, ph = R() * TAU;
    const col = ['rgba(255,170,200,0.25)', 'rgba(200,170,255,0.25)', 'rgba(255,220,150,0.25)'][i % 3];
    glowDot(c, bx + Math.sin(t * 0.4 + ph) * 30, by + Math.cos(t * 0.3 + ph) * 20, br, col);
  }
  dustMotes(c, t, 0, W, 'rgba(255,215,140,0.9)', 46, 8, H);
  // title
  const ta = E.out(seg(u, 0.1, 0.8));
  c.save(); c.globalAlpha = ta; c.translate(0, (1 - ta) * -30);
  c.font = '700 92px Playfair'; c.letterSpacing = '10px';
  const tg = c.createLinearGradient(240, 0, 840, 0); tg.addColorStop(0, '#c98a2a'); tg.addColorStop(0.5, '#f5c46b'); tg.addColorStop(1, '#c98a2a');
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(200,140,60,0.35)'; c.shadowBlur = 14;
  c.fillStyle = tg; c.fillText('WHAT YOU', 545, 270); c.fillText('CAN SEND', 545, 375);
  c.restore();
  txt(c, 'From India to your loved ones in Indonesia', 540, 460, { size: 30, weight: 400, color: '#7a5a9a', alpha: ta });
  c.fillStyle = hexA('#f5c46b', ta); c.fillRect(540 - 160 * ta, 500, 320 * ta, 3);

  const START = 28.4, DUR = 1.5;
  const rowP = E.inOut(seg(t, 35.9, 36.6));
  const f = clamp((t - START) / DUR, 0, 4);
  const step = Math.min(4, Math.floor(f));
  const fr = f - step;
  const cur = step + (step < 4 ? E.inOut(clamp((fr - 0.74) / 0.26)) : 0);
  const CY = 1130;
  const pa = 1 - rowP;
  if (pa > 0) {
    c.save(); c.globalAlpha = pa;
    glowDot(c, 540, CY - 160, 460, 'rgba(255,255,255,0.9)');
    const pg = c.createLinearGradient(240, CY, 840, CY + 80); pg.addColorStop(0, '#fff6ea'); pg.addColorStop(0.5, '#ffffff'); pg.addColorStop(1, '#f2dcc8');
    c.fillStyle = '#e8c9a8'; c.beginPath(); c.ellipse(540, CY + 50, 300, 58, 0, 0, TAU); c.fill();
    c.fillStyle = pg; c.beginPath(); c.ellipse(540, CY + 30, 300, 58, 0, 0, TAU); c.fill();
    c.strokeStyle = '#f5c46b'; c.lineWidth = 4; c.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * 0.8; sparkle(c, 540 + Math.cos(a) * 320, CY + 30 + Math.sin(a) * 64, 6, '#ffd27a', 0.4 + 0.6 * (Math.sin(a) > 0 ? 1 : 0.3)); }
    c.restore();
  }
  SHOW.forEach(([name, desc, fn, sc], i) => {
    const pos = i - cur;
    let x = 540 + pos * 470, y = CY + 20, s = sc * 1.12 * (1 - Math.min(Math.abs(pos), 1.6) * 0.45), a = clamp(1.8 - Math.abs(pos));
    if (u < 0.6) a *= E.out(seg(u, 0.1, 0.6));
    const rx = i < 3 ? 540 + (i - 1) * 330 : 540 + (i - 3.5) * 330;
    const ry = i < 3 ? 790 : 1110, rs = sc * 0.68;
    x = lerp(x, rx, rowP); y = lerp(y, ry, rowP); s = lerp(s, rs, rowP); a = lerp(a, 1, rowP);
    if (a <= 0.01) return;
    const bob = Math.sin(t * 1.8 + i) * 6;
    c.save(); c.globalAlpha = a;
    if (Math.abs(pos) < 0.5 && rowP < 0.5) { const ang = Math.sin(t * 1.2) * 0.04; c.translate(x, y + bob); c.rotate(ang); c.translate(-x, -(y + bob)); }
    fn(c, x, y + bob, s, t);
    c.restore();
    if (rowP > 0) txt(c, name, rx, ry + 105, { size: 34, font: 'Playfair', weight: 700, color: '#b07a2a', alpha: rowP, ls: 4 });
  });
  if (rowP < 1) {
    const [name, desc] = SHOW[step];
    const la = (step === 0 ? E.out(clamp((t - 28.3) / 0.4)) : E.out(clamp(fr / 0.22))) * (step < 4 ? 1 - E.in(clamp((fr - 0.7) / 0.12)) : 1) * (1 - rowP);
    c.save(); c.globalAlpha = la; c.translate(0, (1 - la) * 20);
    c.font = '800 110px Playfair'; c.letterSpacing = '12px'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const ng = c.createLinearGradient(240, 1290, 840, 1360); ng.addColorStop(0, '#ff4f8b'); ng.addColorStop(1, '#8b5cf6');
    c.shadowColor = 'rgba(139,92,246,0.3)'; c.shadowBlur = 16;
    c.fillStyle = ng; c.fillText(name, 546, 1310);
    c.restore();
    c.save(); c.font = '400 34px Poppins';
    const lines = wrapLines(c, desc, 900);
    c.restore();
    lines.forEach((ln, k) => txt(c, ln, 540, 1405 + k * 48, { size: 34, weight: 400, color: '#5a4a7a', alpha: la }));
    [-1, 1].forEach(s => { c.save(); c.globalAlpha = la; sparkle(c, 540 + s * 420, 1310, 12, '#f5c46b', la); c.restore(); });
  }
  if (rowP > 0) {
    const d1 = E.out(seg(t, 36.3, 36.8)), d2 = E.out(seg(t, 36.7, 37.2));
    [[d1, 'Same-day delivery may be available depending on the location.', 1330, 'clock'], [d2, 'Other delivery options are available depending on the area and service.', 1490, 'truck']].forEach(([a, s, y, ic]) => {
      if (a <= 0) return;
      c.save(); c.globalAlpha = a; c.translate((1 - a) * 40, 0);
      c.font = '600 32px Poppins';
      const lines = wrapLines(c, s, 760);
      const bw = 980, bh = 50 + lines.length * 44;
      c.shadowColor = 'rgba(139,92,246,0.2)'; c.shadowBlur = 20; c.shadowOffsetY = 6;
      c.fillStyle = 'rgba(255,255,255,0.93)'; rr(c, 50, y - bh / 2, bw, bh, 36); c.fill();
      c.shadowColor = 'transparent';
      const ix = 115;
      c.fillStyle = brandGrad(c, ix - 28, y - 28, ix + 28, y + 28); c.beginPath(); c.arc(ix, y, 28, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 3.5; c.lineCap = 'round';
      if (ic === 'clock') { c.beginPath(); c.arc(ix, y, 13, 0, TAU); c.moveTo(ix, y); c.lineTo(ix, y - 8); c.moveTo(ix, y); c.lineTo(ix + 6, y + 3); c.stroke(); }
      else { c.strokeRect(ix - 13, y - 8, 15, 13); c.beginPath(); c.moveTo(ix + 2, y - 4); c.lineTo(ix + 9, y - 4); c.lineTo(ix + 13, y + 1); c.lineTo(ix + 13, y + 5); c.lineTo(ix + 2, y + 5); c.stroke(); c.beginPath(); c.arc(ix - 7, y + 8, 3, 0, TAU); c.arc(ix + 8, y + 8, 3, 0, TAU); c.stroke(); }
      lines.forEach((ln, k) => txt(c, ln, 170, y + (k - (lines.length - 1) / 2) * 44 + 2, { size: 32, align: 'left', weight: 600, color: '#4a3a6a' }));
      c.restore();
    });
  }
}

// ---------------------------------------------------------------- END CARD
function endCard(c, t) {
  const u = t - 44.9;
  const bg = c.createLinearGradient(0, 0, W * 0.6, H);
  bg.addColorStop(0, '#2b1a63'); bg.addColorStop(0.5, '#7a3a9e'); bg.addColorStop(1, '#ff8fb5');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const R = rng(55);
  for (let i = 0; i < 150; i++) { const sx = R() * W, sy = R() * H; glowDot(c, sx, sy, 2 + R() * 4, 'rgba(255,255,255,0.9)', 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + i))); }
  const dim = E.inOut(seg(u, 1.6, 2.3));
  const ms = lerp(1, 0.85, dim);
  c.save();
  c.globalAlpha = lerp(1, 0.35, dim) * E.out(seg(u, 0, 0.6));
  c.translate(540, 880); c.scale(ms, ms); c.translate(-540, -880);
  const m = { x: 20, y: 580, w: 1040, h: 626, lon0: 62, lon1: 150, lat0: -14, lat1: 39 };
  drawMap(c, m, t, { labelSize: 32, labels: dim < 0.5 });
  const p = E.inOut(seg(u, 0.3, 1.4));
  drawRoute(c, m, p, t, { lw: 8, citySize: 24, cityLabels: dim < 0.5 });
  if (p > 0 && p < 1) {
    const [gx, gy] = routePoint(m, p);
    for (let k = 1; k < 16; k++) { const [tx, ty] = routePoint(m, Math.max(0, p - k * 0.012)); sparkle(c, tx, ty, 12 - k * 0.6, k % 2 ? '#ffd27a' : '#ffb3cf', 1 - k / 16, t + k); }
    drawHeart(c, gx, gy, 54, '#ff4f8b');
  }
  if (u > 1.4) { const [, , , , bx, by] = routePoint(m, 1); const bp = clamp((u - 1.4) / 1.2); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; drawHeart(c, bx + Math.cos(a) * bp * 160, by + Math.sin(a) * bp * 110, 30, '#ff6f9f', 1 - bp); } }
  c.restore();
  const h1 = E.out(seg(u, 0.5, 1.1)), h2 = E.out(seg(u, 0.9, 1.5));
  txt(c, 'Different countries.', 540, 300 + (1 - h1) * 20, { size: 76, font: 'Fredoka', weight: 700, color: '#ffffff', alpha: h1, shadow: 'rgba(40,10,60,0.6)', blur: 20 });
  txt(c, 'One simple way to', 540, 400 + (1 - h2) * 20, { size: 58, font: 'Fredoka', weight: 600, color: '#ffe0ec', alpha: h2, shadow: 'rgba(40,10,60,0.6)', blur: 20 });
  txt(c, 'make someone smile.', 540, 470 + (1 - h2) * 20, { size: 58, font: 'Fredoka', weight: 600, color: '#ffe0ec', alpha: h2, shadow: 'rgba(40,10,60,0.6)', blur: 20 });
  const LY = 960;
  const la = E.outBack(seg(u, 1.9, 2.6));
  if (la > 0) {
    c.save();
    glowDot(c, 540, LY, 520 * la, 'rgba(255,255,255,0.5)');
    c.save(); c.translate(540, LY); c.scale(la, la);
    c.shadowColor = 'rgba(40,10,60,0.4)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
    c.fillStyle = 'rgba(255,255,255,0.97)'; rr(c, -440, -120, 880, 240, 120); c.fill();
    c.restore();
    drawLogo(c, 540 + 30 * la, LY, 1.3 * la, 1, t);
    const sw = seg(u, 2.6, 3.4);
    if (sw > 0 && sw < 1) {
      c.save(); c.beginPath(); rr(c, 100, LY - 120, 880, 240, 120); c.clip();
      const sx = lerp(0, 1080, sw);
      const sg = c.createLinearGradient(sx - 80, 0, sx + 80, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.8)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sg; c.fillRect(sx - 80, LY - 120, 160, 240);
      c.restore();
    }
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 0.5; sparkle(c, 540 + Math.cos(a) * 480, LY + Math.sin(a) * 170, 9 + (i % 3) * 4, '#fff6d8', la * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))), t); }
    c.restore();
  }
  const ga = E.out(seg(u, 2.8, 3.5));
  if (ga > 0) {
    c.save(); c.globalAlpha = ga; c.translate(0, (1 - ga) * 24);
    c.shadowColor = 'rgba(40,10,60,0.35)'; c.shadowBlur = 30; c.shadowOffsetY = 8;
    c.fillStyle = 'rgba(255,255,255,0.16)'; rr(c, 120, 1130, 840, 190, 95); c.fill();
    c.shadowColor = 'transparent';
    c.strokeStyle = 'rgba(255,230,190,0.7)'; c.lineWidth = 3; rr(c, 120, 1130, 840, 190, 95); c.stroke();
    txt(c, 'Send love the easy way', 540, 1198, { size: 54, font: 'Fredoka', weight: 700, color: '#ffffff', shadow: 'rgba(40,10,60,0.5)', blur: 12 });
    txt(c, 'www.aiidell.com', 540, 1266, { size: 40, font: 'Fredoka', weight: 600, color: '#ffe0a8', ls: 1 });
    c.restore();
    const sw2 = seg(u, 3.6, 4.4);
    if (sw2 > 0 && sw2 < 1) { c.save(); rr(c, 120, 1130, 840, 190, 95); c.clip(); const sx = lerp(0, 1080, sw2); const sg = c.createLinearGradient(sx - 90, 0, sx + 90, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.45)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sg; c.fillRect(sx - 90, 1130, 180, 190); c.restore(); }
  }
  const sm = E.out(seg(u, 3.4, 4.0));
  txt(c, 'Flowers · Gifts · Food · Snacks · Cakes', 540, 1400, { size: 32, weight: 600, color: '#ffe0ec', alpha: sm, ls: 1 });
}

// =====================================================================================
// SOFT-SELL STORY — vertical 9:16, LEFT = Rahul (the hard way), RIGHT = Arjun (AiiDell)
// Panels are 540 x 1920 each; their content is authored directly in panel pixels.
// =====================================================================================
const PW = 540;
const MAN_Y = 1300, MAN_S = 0.92;

// ---------- narration captions (soft, story-like) ----------
const CAPS = [
  [0.6, 3.1, 'Meet Rahul and Arjun.'],
  [3.2, 6.0, 'Both want to surprise someone special in Indonesia.'],
  [6.1, 8.3, 'But look at Rahul…'],
  [8.4, 10.6, 'Hours searching for the best shop, the best courier…'],
  [10.7, 13.0, '…and sending it directly is so expensive.'],
  [13.1, 15.0, 'And Arjun?'],
  [15.1, 19.8, 'Just a few clicks on AiiDell.com…'],
  [20.3, 24.3, 'Our team in Indonesia takes care of everything…'],
  [24.6, 27.8, '…right to her door.'],
  [38.2, 40.8, 'One is still searching…'],
  [40.9, 43.5, '…the other is already smiling.'],
];
function captions(c, t) {
  CAPS.forEach(([a, b, s]) => {
    const al = win(t, a, b, 0.35, 0.3);
    if (al <= 0) return;
    c.save();
    c.font = '600 50px Fredoka';
    const lines = wrapLines(c, s, 860);
    const lw = Math.max(...lines.map(l => c.measureText(l).width));
    const bw = lw + 90, bh = 40 + lines.length * 62;
    const y = 250;
    c.globalAlpha = al;
    c.translate(540, y + (1 - E.out(seg(t, a, a + 0.4))) * 26);
    c.shadowColor = 'rgba(40,15,70,0.28)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
    c.fillStyle = 'rgba(255,255,255,0.94)'; rr(c, -bw / 2, -bh / 2, bw, bh, 44); c.fill();
    c.shadowColor = 'transparent';
    c.strokeStyle = 'rgba(245,196,107,0.8)'; c.lineWidth = 3; rr(c, -bw / 2, -bh / 2, bw, bh, 44); c.stroke();
    // word-by-word reveal
    const words = s.split(' ').length;
    const shown = Math.ceil(clamp((t - a) / Math.min(1.2, (b - a) * 0.45)) * words);
    let cnt = 0;
    lines.forEach((ln, i) => {
      const ws = ln.split(' ');
      const vis = ws.slice(0, Math.max(0, shown - cnt)).join(' ');
      cnt += ws.length;
      const lx = -c.measureText(ln).width / 2;
      const hl = s.includes('AiiDell') ? true : false;
      txt(c, vis, lx, (i - (lines.length - 1) / 2) * 62 + 2, { size: 50, font: 'Fredoka', weight: 600, color: '#3a2a5a', align: 'left' });
      if (hl && vis.includes('AiiDell.com')) {
        const pre = vis.slice(0, vis.indexOf('AiiDell.com'));
        c.font = '600 50px Fredoka';
        txt(c, 'AiiDell.com', lx + c.measureText(pre).width, (i - (lines.length - 1) / 2) * 62 + 2, { size: 50, font: 'Fredoka', weight: 700, color: '#ff4f8b', align: 'left' });
      }
    });
    c.restore();
  });
}

// ---------- tall rooms ----------
function drawClock(c, t, cx, cy, cr, gloom, spin) {
  c.save();
  c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
  c.fillStyle = '#e9e4f5'; c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.fill();
  c.shadowColor = 'transparent';
  c.strokeStyle = '#6a5f8a'; c.lineWidth = 8; c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.lineWidth = i % 3 ? 2 : 4; c.beginPath(); c.moveTo(cx + Math.cos(a) * (cr - 9), cy + Math.sin(a) * (cr - 9)); c.lineTo(cx + Math.cos(a) * (cr - 18), cy + Math.sin(a) * (cr - 18)); c.stroke(); }
  const mA = spin * 2.4 - Math.PI / 2, hA = spin * 0.2 - Math.PI / 2;
  c.lineCap = 'round';
  c.strokeStyle = '#3a2f5a'; c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(hA) * cr * 0.5, cy + Math.sin(hA) * cr * 0.5); c.stroke();
  c.strokeStyle = '#ff5f6f'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(mA) * cr * 0.78, cy + Math.sin(mA) * cr * 0.78); c.stroke();
  c.fillStyle = '#3a2f5a'; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
  if (gloom > 0.2) { c.strokeStyle = `rgba(255,255,255,${0.35 * gloom})`; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(cx, cy, cr + 12 + k * 8, mA - 0.9, mA - 0.2); c.stroke(); } }
  c.restore();
}
function drawRoomLeftTall(c, t, gloom) {
  const wg = c.createLinearGradient(0, 0, 0, 1920);
  wg.addColorStop(0, mixHex('#3a4170', '#262a48', gloom * 0.6)); wg.addColorStop(1, mixHex('#2a2d4e', '#17192e', gloom * 0.6));
  c.fillStyle = wg; c.fillRect(-300, 0, PW + 600, 1920);
  c.fillStyle = 'rgba(255,255,255,0.025)'; for (let x = -300; x < PW + 300; x += 60) c.fillRect(x, 0, 24, 1920);
  // night window
  const wx = 40, wy = 420, ww = 240, wh = 330;
  c.fillStyle = '#4a5280'; rr(c, wx - 14, wy - 14, ww + 28, wh + 28, 10); c.fill();
  const sky = c.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, '#141a3d'); sky.addColorStop(1, '#3a3b78');
  c.fillStyle = sky; c.fillRect(wx, wy, ww, wh);
  const R = rng(5);
  for (let i = 0; i < 24; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 3 + i); c.fillStyle = `rgba(255,255,240,${0.3 + tw * 0.6})`; c.beginPath(); c.arc(wx + R() * ww, wy + R() * wh * 0.65, 1.2 + R() * 1.3, 0, TAU); c.fill(); }
  glowDot(c, wx + 170, wy + 80, 70, 'rgba(220,230,255,0.5)');
  c.fillStyle = '#eef1ff'; c.beginPath(); c.arc(wx + 170, wy + 80, 26, 0, TAU); c.fill();
  c.fillStyle = '#3a3b78'; c.beginPath(); c.arc(wx + 182, wy + 72, 24, 0, TAU); c.fill();
  c.fillStyle = '#1a1c3a'; for (let i = 0; i < 8; i++) { const bh = 40 + hash(i) * 100; c.fillRect(wx + i * 30, wy + wh - bh, 27, bh); }
  c.fillStyle = 'rgba(255,214,120,0.7)'; for (let i = 0; i < 26; i++) if (hash(i * 3.1) > 0.4) c.fillRect(wx + (i % 8) * 30 + 8, wy + wh - 20 - Math.floor(i / 8) * 18, 4, 6);
  c.strokeStyle = '#4a5280'; c.lineWidth = 9; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2); c.stroke();
  // clock (spins faster with stress)
  const spin = t * 0.6 + Math.max(0, t - 6) * Math.max(0, t - 6) * 0.3 * (gloom > 0.05 ? 1 : 0);
  drawClock(c, t, 420, 520, 62, gloom, spin);
  // shelf + sticky notes
  c.fillStyle = '#4b4369'; c.fillRect(320, 820, 220, 14);
  [[335, 750, 50, 70, '#6f6290'], [392, 770, 36, 50, '#806aa8'], [434, 736, 24, 84, '#5d7aa8'], [462, 760, 58, 60, '#5d5880']].forEach(([x, y, w, h, col]) => { c.fillStyle = col; c.fillRect(x, y, w, h); });
  [['?', 360, 900, -0.12, '#ffe27a'], ['Customs?', 470, 930, 0.08, '#ffb0b0'], ['Courier??', 90, 860, -0.05, '#a8e6ff'], ['Tax?', 200, 900, 0.12, '#ffe27a']].forEach(([s, x, y, r, col], i) => {
    c.save(); c.translate(x, y + Math.sin(t * 2 + i) * 1.5); c.rotate(r);
    c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
    c.fillStyle = col; c.fillRect(-44, -38, 88, 76); c.shadowColor = 'transparent';
    txt(c, s, 0, 2, { size: s.length > 3 ? 17 : 38, color: '#4a3a5a', font: 'Fredoka', weight: 600 });
    c.restore();
  });
  glowDot(c, 70, 1600, 280, 'rgba(255,190,110,0.25)');
}
function drawDeskLeftTall(c, t, papers) {
  const dg = c.createLinearGradient(0, 1790, 0, 1920); dg.addColorStop(0, '#5b4a6e'); dg.addColorStop(1, '#3a2f4c');
  c.fillStyle = dg; c.fillRect(-300, 1795, PW + 600, 130);
  c.fillStyle = '#6e5c84'; c.fillRect(-300, 1788, PW + 600, 10);
  // lamp
  c.fillStyle = '#2d2a40'; c.beginPath(); c.ellipse(58, 1795, 48, 10, 0, 0, TAU); c.fill();
  c.strokeStyle = '#2d2a40'; c.lineWidth = 9; c.beginPath(); c.moveTo(58, 1790); c.lineTo(36, 1660); c.lineTo(92, 1600); c.stroke();
  c.fillStyle = '#ffb46b'; c.beginPath(); c.moveTo(70, 1574); c.lineTo(136, 1606); c.lineTo(112, 1632); c.closePath(); c.fill();
  glowDot(c, 120, 1640, 160, 'rgba(255,190,110,0.3)');
  // mug
  c.fillStyle = '#e8e2f2'; rr(c, 470, 1740, 40, 48, 8); c.fill();
  c.strokeStyle = '#e8e2f2'; c.lineWidth = 6; c.beginPath(); c.arc(514, 1764, 11, -1.3, 1.3); c.stroke();
  // paper stacks
  [[490, 1], [62, 0.7]].forEach(([px, k], si) => {
    const n = Math.floor(papers * 30 * k);
    for (let i = 0; i < n; i++) {
      c.save(); c.translate(px + Math.sin(i * 12.9 + si) * 8, 1788 - i * 7); c.rotate(Math.sin(i * 4.1 + si) * 0.06);
      c.fillStyle = i % 4 === 0 ? '#f3efe6' : '#ffffff';
      c.shadowColor = 'rgba(0,0,0,0.18)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
      c.fillRect(-62, -7, 124, 7); c.restore();
    }
    if (n > 3) { c.save(); c.translate(px, 1788 - n * 7 - 4); c.fillStyle = '#fff'; c.fillRect(-62, -6, 124, 8); c.fillStyle = '#e24a5a'; c.fillRect(-52, -4, 44, 3); c.restore(); }
  });
}
function drawRoomRightTall(c, t) {
  const wg = c.createLinearGradient(0, 0, 0, 1920); wg.addColorStop(0, '#fff1f6'); wg.addColorStop(1, '#f9d5e4');
  c.fillStyle = wg; c.fillRect(-300, 0, PW + 600, 1920);
  c.save(); c.globalAlpha = 0.07;
  for (let y = 40; y < 1920; y += 90) for (let x = -270 + ((y / 90) % 2) * 45; x < PW + 300; x += 90) drawHeart(c, x, y, 14, '#ff8fb5', 1, false);
  c.restore();
  // golden-hour window
  const wx = 270, wy = 400, ww = 240, wh = 520;
  c.fillStyle = '#ffffff'; rr(c, wx - 14, wy - 14, ww + 28, wh + 28, 16); c.fill();
  const sky = c.createLinearGradient(0, wy, 0, wy + wh);
  sky.addColorStop(0, '#c7b6ff'); sky.addColorStop(0.45, '#ffb6cf'); sky.addColorStop(0.8, '#ffd3a1'); sky.addColorStop(1, '#ffe7b8');
  c.fillStyle = sky; c.fillRect(wx, wy, ww, wh);
  glowDot(c, wx + 160, wy + 400, 170, 'rgba(255,240,200,0.9)');
  c.fillStyle = '#fff6df'; c.beginPath(); c.arc(wx + 160, wy + 400, 38, 0, TAU); c.fill();
  [[wx + 70 + Math.sin(t * 0.2) * 8, wy + 130], [wx + 170 + Math.sin(t * 0.15 + 1) * 10, wy + 230]].forEach(([cx, cy]) => {
    c.fillStyle = 'rgba(255,255,255,0.75)';
    [[0, 0, 30], [28, -9, 24], [52, 4, 20], [-26, 6, 19]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(cx + dx, cy + dy, r, 0, TAU); c.fill(); });
  });
  c.fillStyle = 'rgba(190,140,190,0.55)'; for (let i = 0; i < 8; i++) { const bh = 30 + hash(i + 9) * 90; c.fillRect(wx + i * 30, wy + wh - bh, 26, bh); }
  c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.stroke();
  // sheer curtain
  c.save();
  const cg = c.createLinearGradient(wx - 70, 0, wx + 30, 0); cg.addColorStop(0, 'rgba(255,255,255,0.15)'); cg.addColorStop(0.5, 'rgba(255,255,255,0.7)'); cg.addColorStop(1, 'rgba(255,255,255,0.15)');
  c.fillStyle = cg; c.beginPath(); c.moveTo(wx - 60, 370);
  for (let y = 370; y <= 1010; y += 20) c.lineTo(wx - 60 + Math.sin(y * 0.03 + t * 0.8) * 8, y);
  for (let y = 1010; y >= 370; y -= 20) c.lineTo(wx + 20 + Math.sin(y * 0.03 + t * 0.8 + 1) * 8 + (y > 800 ? (y - 800) * 0.12 : 0), y);
  c.fill(); c.restore();
  c.fillStyle = '#e7c48a'; c.fillRect(wx - 90, 362, ww + 120, 9);
  // fairy lights
  c.strokeStyle = 'rgba(120,90,110,0.6)'; c.lineWidth = 2; c.beginPath();
  for (let x = -40; x <= PW + 40; x += 10) { const y = 340 + Math.abs(Math.sin((x + 40) / 200 * Math.PI)) * 50; x === -40 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.stroke();
  for (let x = -10, k = 0; x <= PW + 40; x += 56, k++) {
    const y = 340 + Math.abs(Math.sin((x + 40) / 200 * Math.PI)) * 50 + 8, tw = 0.6 + 0.4 * Math.sin(t * 3 + x * 0.05);
    const col = ['#ffd27a', '#ff9cc0', '#c7b0ff'][k % 3];
    glowDot(c, x, y, 24, hexA(col, 0.6 * tw)); c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 5, 7, 0, 0, TAU); c.fill();
  }
  // framed photo
  c.save(); c.translate(120, 560); c.rotate(-0.04);
  c.shadowColor = 'rgba(120,60,90,0.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6;
  c.fillStyle = '#f5c46b'; rr(c, -72, -64, 144, 128, 8); c.fill(); c.shadowColor = 'transparent';
  const pg = c.createLinearGradient(0, -50, 0, 50); pg.addColorStop(0, '#ffd6e6'); pg.addColorStop(1, '#c9b6ff');
  c.fillStyle = pg; c.fillRect(-60, -52, 120, 104); drawHeart(c, 0, 6, 50, '#ff4f8b', 1, false);
  c.restore();
  drawPlant(c, 60, 1180, 0.7, t);
}

// ---------- characters ----------
function leftMan(t) {
  const stress = kf(t, [[0, 0], [6, 0], [7.5, 0.3], [9.5, 0.6], [11.5, 0.85], [13, 1], [20, 0.9], [38, 0.75]]);
  const happy = kf(t, [[0, 0.3], [1.2, 0.5], [4.5, 0.45], [5.8, 0.1], [6.5, 0]]);
  const tired = kf(t, [[0, 0], [14, 0], [19, 0.45], [37, 0.8], [40, 1]]);
  const lx = kf(t, [[0, 0], [1.2, 0.15], [1.6, 0.3], [4.8, 0.3], [5.2, 0], [6.6, 0], [7, 0.05]]);
  const ly = kf(t, [[0, 0.8], [1.2, 0.8], [1.6, -0.75], [4.8, -0.75], [5.2, 0.8], [6.4, 0.8], [6.8, -0.75], [13.2, -0.75], [13.6, 0.7], [37.5, 0.7], [39, 0.55]]);
  const shake = stress > 0.7 ? sn(t * 4, 11) * 0.03 * (stress - 0.7) * 3 : 0;
  const tilt = kf(t, [[0, 0], [1.6, -0.06], [4.8, -0.06], [5.2, 0], [12, 0.05], [15, -0.03], [37.5, 0.02], [39.5, -0.13]]) + shake + sn(t * 0.7, 2) * 0.02;
  return {
    x: 270, y: MAN_Y, s: MAN_S, who: 'L', t, mood: { stress, happy, tired, surprise: 0 }, look: { x: lx, y: ly }, tilt, blink: blink(t, 1),
    rim: '#7fa6ff', rimSide: -1, screenGlow: '#a9d4ff', slump: kf(t, [[0, 0], [37.5, 0], [39.5, 26]]),
    pose: { phoneY: kf(t, [[0, 215], [37.5, 215], [39.5, 245]]), phoneA: sn(t * 0.5, 4) * 0.05 },
  };
}
function rightMan(t) {
  const surprise = kf(t, [[0, 0], [19.0, 0], [19.2, 1], [19.6, 0.8], [20.0, 0]]);
  const happy = kf(t, [[0, 0.4], [1.2, 0.6], [4.5, 0.55], [6, 0.4], [13.5, 0.45], [19.1, 0.5], [19.6, 1], [40, 1]]);
  const lx = kf(t, [[0, 0], [1.2, -0.15], [1.6, -0.3], [4.8, -0.3], [5.2, 0], [13.6, 0], [14.0, 0], [19.2, 0], [19.4, -0.2]]);
  const ly = kf(t, [[0, 0.8], [1.2, 0.8], [1.6, -0.75], [4.8, -0.75], [5.2, 0.8], [13.6, 0.8], [14.0, -0.75], [19.2, -0.75], [19.4, -0.1], [37.5, -0.1], [38.6, -0.7]]);
  const fist = win(t, 19.35, 20.6, 0.25, 0.3);
  const tilt = kf(t, [[0, 0], [1.6, 0.06], [4.8, 0.06], [5.2, 0], [19.2, -0.04], [19.7, 0.07], [38, 0.04]]) + sn(t * 0.6, 7) * 0.015;
  const pose = { phoneY: 215, phoneA: 0 };
  if (fist > 0.01) {
    pose.phoneX = lerp(0, -40, fist);
    pose.lh = [lerp(-52, -88, fist), 233];
    pose.rh = [lerp(52, 70, fist), lerp(233, 125 + 26 * Math.abs(Math.sin((t - 19.35) * 7)), fist)];
    pose.rFist = fist;
  }
  return { x: 270, y: MAN_Y, s: MAN_S, who: 'R', t, mood: { happy, surprise }, look: { x: lx, y: ly }, tilt, blink: blink(t, 4, 3.2), rim: '#ffc79a', rimSide: 1, screenGlow: '#ffd2e4', pose };
}

// ---------- left panel (Rahul) ----------
function cardSlotL(c, t, a, b, fn) {
  if (t < a || t > b) return;
  const ain = E.outBack(seg(t, a, a + 0.45)), aout = E.in(seg(t, b - 0.35, b));
  c.save();
  const cx = 270, cy = 650, K = 1.18;
  c.translate(cx - aout * 80, cy - aout * 140);
  c.rotate(aout * 0.25 + (1 - ain) * -0.1);
  const k = K * lerp(0.8, 1, ain) * (1 - aout * 0.3);
  c.scale(k, k);
  c.globalAlpha *= clamp(seg(t, a, a + 0.2)) * (1 - aout);
  c.translate(-cx, -cy);
  fn(c, t - a);
  c.restore();
}
function drawLeftPanel(c, t) {
  const gloom = kf(t, [[0, 0], [6, 0], [13, 0.6], [38, 1]]);
  drawRoomLeftTall(c, t, gloom);
  const m = leftMan(t);
  drawChairLeft(c, 270, 1440, 0.82);
  drawMan(c, m);
  drawDeskLeftTall(c, t, kf(t, [[0, 0], [11.5, 0], [14, 0.5], [38, 1]]));
  // S1: dreaming of her
  const tb = win(t, 1.3, 5.6, 0.5, 0.4);
  if (tb > 0) {
    thoughtBubble(c, 270, 730, 250, 150, [], tb, { tail: [0.15, 1] });
    c.save(); c.globalAlpha *= clamp(tb * 1.5);
    drawHeart(c, 228, 730, 62 * E.outBack(tb), '#ff4f8b'); idFlag(c, 282, 710, 54);
    c.restore();
  }
  // S2: the struggle
  cardSlotL(c, t, 6.3, 8.6, (c, u) => searchScreen(c, 100, 400, 340, 500, u * 1.25, t));
  cardSlotL(c, t, 8.5, 10.8, (c, u) => chatScreen(c, 100, 400, 340, 500, u * 1.4, t));
  cardSlotL(c, t, 10.7, 13.3, (c, u) => quoteScreen(c, 100, 400, 340, 500, u * 1.15, t));
  cardSlotL(c, t, 13.4, 37.2, (c, u) => onHoldScreen(c, 100, 400, 340, 500, u, t));
  cardSlotL(c, t, 38.0, 44.0, (c, u) => onHoldScreen(c, 100, 400, 340, 500, u + 30, t));
  // forms & bills flying onto the desk
  [[12.0, 'CUSTOMS FORM', 0], [12.4, 'INVOICE', 1], [12.8, 'DECLARATION', 0], [13.2, 'ID PROOF', 1], [13.6, 'FORM 7B', 0], [14.0, 'TAX SLIP', 1]].forEach(([at, lab, kind], i) => {
    const p = seg(t, at, at + 0.8);
    if (p <= 0 || p >= 1) return;
    const e = E.inOut(p);
    const x = lerp(560, i % 2 ? 490 : 62, e), y = lerp(500 + i * 40, 1720 - i * 6, e) - Math.sin(e * Math.PI) * 140;
    if (kind) bill(c, x, y, e * 6 + i, lerp(0.9, 0.55, e), lab, ['₹2,150', '₹940', '₹650'][i % 3]);
    else formSheet(c, x, y, e * 5 + i, lerp(0.9, 0.55, e), lab);
  });
  // question marks around (never over) his face
  if (t > 6.8 && t < 45) {
    const hx0 = 270, hy0 = MAN_Y - 165 * MAN_S;
    for (let k = 0; k < 12; k++) {
      const born = 6.8 + k * 0.8, life = t - born;
      if (life < 0) continue;
      const lp = (life % 3.4) / 3.4, side = k % 2 ? 1 : -1;
      const intensity = clamp((m.mood.stress - 0.2) * 1.6);
      questionMark(c, hx0 + side * (170 + (k * 23) % 40) + Math.sin(lp * 6 + k) * 10, hy0 + 40 - lp * 230, 40 + (k % 3) * 12, Math.sin(lp * Math.PI) * intensity, Math.sin(t * 2 + k) * 0.3);
    }
  }
  // unanswered messages (below the chin)
  [['No reply', 9.4, 400, 1420], ['Seen 2h ago', 9.9, 140, 1450], ['No reply', 10.4, 410, 1530]].forEach(([s, at, x, y], i) => {
    msgBadge(c, x, y + Math.sin(t * 2 + i) * 5, E.outBack(clamp((t - at) * 3)) * 0.9, win(t, at, at + 3.0, 0.3, 0.4), s);
  });
  [[39.0, 'Seen', 410, 1430], [39.5, 'No reply', 140, 1480]].forEach(([at, s, x, y], i) => msgBadge(c, x, y, 0.9 * E.outBack(clamp((t - at) * 3)), win(t, at, 44, 0.3, 0.3), s));
  // cool vignette
  const v = c.createRadialGradient(270, 1100, 300, 270, 1000, 1200);
  v.addColorStop(0, 'rgba(10,10,40,0)'); v.addColorStop(1, `rgba(10,10,40,${0.35 + gloom * 0.25})`);
  c.fillStyle = v; c.fillRect(-300, 0, PW + 600, 1920);
}

// ---------- right panel (Arjun) ----------
function drawRightPanel(c, t) {
  drawRoomRightTall(c, t);
  godRays(c, t, 470, 520, 0.9);
  const m = rightMan(t);
  drawSofaRight(c, 270, 1430, 0.8);
  drawMan(c, m);
  dustMotes(c, t, -100, PW + 100, 'rgba(255,240,210,0.8)', 26, 3, 1920);
  const tb = win(t, 1.3, 5.6, 0.5, 0.4);
  if (tb > 0) {
    thoughtBubble(c, 270, 730, 250, 150, [], tb, { tail: [-0.15, 1] });
    c.save(); c.globalAlpha *= clamp(tb * 1.5);
    drawGiftBox(c, 232, 770, 0.3 * E.outBack(tb), t); idFlag(c, 282, 710, 54);
    c.restore();
  }
  // AiiDell phone flow (13.4 - 20.6)
  if (t >= 13.4 && t < 20.7) {
    const u = Math.max(0, 0.3 + (t - 13.5) * 1.75);
    const pin = spring(t, 13.4, 1.6, 6.5);
    const sc = 0.66 * clamp(pin, 0, 1.2);
    const px = 270, py = lerp(1500, 660, clamp(pin));
    c.save(); c.globalAlpha = clamp(pin * 2);
    glowDot(c, px, py, 360, 'rgba(255,170,210,0.45)');
    phoneFrame(c, px, py, 400, 820, sc, (c2, w, h) => aiiScreen(c2, w, h, u, t));
    c.restore();
  }
  // S6: video call with Putri, hearts rising beside the phone
  if (t > 37.4) {
    const a = spring(t, 38.2, 1.4, 6);
    for (let i = 0; i < 8; i++) { const p = ((t - 38.2) * 0.45 + i / 8) % 1, sd = i % 2 ? 1 : -1; if (t > 38.6) drawHeart(c, 270 + sd * (180 + Math.sin(p * 7 + i) * 16), 960 - p * 600, 20 + (i % 3) * 8, i % 2 ? '#ff4f8b' : '#ff9cc0', Math.sin(p * Math.PI) * 0.9); }
    c.save(); c.globalAlpha = clamp(a * 2);
    glowDot(c, 270, 660, 360, 'rgba(255,170,210,0.5)');
    phoneFrame(c, 270, 660, 400, 820, 0.66 * clamp(a, 0, 1.15), (c2, w, h) => videoCallScreen(c2, w, h, t));
    c.restore();
  }
  const v = c.createRadialGradient(270, 1000, 350, 270, 1000, 1200);
  v.addColorStop(0, 'rgba(255,200,220,0)'); v.addColorStop(1, 'rgba(160,60,120,0.18)');
  c.fillStyle = v; c.fillRect(-300, 0, PW + 600, 1920);
}

// ---------- split screen (left | right) ----------
function nameTag(c, x, y, s, a, col) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= clamp(a * 1.5); c.translate(x, y); const k = E.outBack(clamp(a)); c.scale(k, k);
  c.font = '700 38px Fredoka'; const w = c.measureText(s).width + 56;
  c.shadowColor = 'rgba(30,10,50,0.35)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
  c.fillStyle = col; rr(c, -w / 2, -30, w, 60, 30); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3; c.stroke();
  txt(c, s, 0, 2, { size: 38, font: 'Fredoka', weight: 700, color: '#fff' });
  c.restore();
}
function drawSplit(c, t, splitX = 540, leftFade = 0) {
  const sIn = E.out5(seg(t, 0, 0.9));
  const lOff = (1 - sIn) * -540, rOff = (1 - sIn) * 540;
  // spotlight: dim the side the story is not talking about
  const dimR = Math.max(win(t, 6.1, 13.1, 0.5, 0.5), win(t, 38.2, 40.9, 0.4, 0.4) * 0.8) * 0.5;
  const dimL = Math.max(win(t, 13.1, 20.6, 0.5, 0.3), win(t, 40.9, 46, 0.4, 0.3) * 0.9) * 0.5;
  if (splitX > 0) {
    c.save(); c.beginPath(); c.rect(0, 0, splitX, H); c.clip();
    c.translate(lOff - (540 - splitX), 0);
    drawLeftPanel(c, t);
    c.restore();
    const lf = Math.max(dimL, leftFade);
    if (lf > 0) { c.fillStyle = `rgba(14,10,34,${lf})`; c.fillRect(0, 0, splitX, H); }
  }
  const rw = W - splitX, zoom = rw / 540;
  c.save(); c.beginPath(); c.rect(splitX, 0, rw, H); c.clip();
  c.translate(splitX + rOff + rw / 2, 0);
  c.translate(0, 1100); c.scale(zoom, zoom); c.translate(-270, -1100);
  drawRightPanel(c, t);
  c.restore();
  if (dimR > 0) { c.fillStyle = `rgba(30,12,40,${dimR})`; c.fillRect(splitX, 0, rw, H); }
  if (splitX > 0 && splitX < W) {
    c.save();
    c.shadowColor = '#ffd27a'; c.shadowBlur = 24;
    const dg = c.createLinearGradient(0, 0, 0, H); dg.addColorStop(0, '#fff3c9'); dg.addColorStop(0.5, '#f5c46b'); dg.addColorStop(1, '#fff3c9');
    c.fillStyle = dg; const dh = H * E.out(seg(t, 0.2, 1.0));
    c.fillRect(splitX - 4, (H - dh) / 2, 8, dh);
    c.restore();
    for (let i = 0; i < 6; i++) { const p = (t * 0.2 + i / 6) % 1; sparkle(c, splitX + Math.sin(p * 9 + i) * 8, p * H, 7 + (i % 3) * 3, '#fff6d8', Math.sin(p * Math.PI)); }
    // heart medallion linking the two stories
    const hm = E.outBack(seg(t, 0.9, 1.4));
    if (hm > 0) {
      c.save(); c.translate(splitX, 1180); c.scale(hm, hm);
      c.shadowColor = 'rgba(80,20,80,0.45)'; c.shadowBlur = 18;
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 36, 0, TAU); c.fill(); c.shadowColor = 'transparent';
      c.strokeStyle = '#f5c46b'; c.lineWidth = 4; c.stroke();
      drawHeart(c, 0, 4, 34 * (1 + Math.sin(t * 4) * 0.06), '#ff4f8b', 1, false);
      c.restore();
    }
  }
  // spotlight glow edge on the active side
  const actL = win(t, 6.1, 13.1, 0.5, 0.5), actR = win(t, 13.1, 20.6, 0.5, 0.3);
  if (actL > 0) { c.save(); c.globalAlpha = actL * 0.8; c.strokeStyle = '#a9c4ff'; c.lineWidth = 6; c.shadowColor = '#a9c4ff'; c.shadowBlur = 30; c.strokeRect(3, 3, splitX - 6, H - 6); c.restore(); }
  if (actR > 0) { c.save(); c.globalAlpha = actR * 0.8; c.strokeStyle = '#ffb3cf'; c.lineWidth = 6; c.shadowColor = '#ff8fb5'; c.shadowBlur = 30; c.strokeRect(splitX + 3, 3, W - splitX - 6, H - 6); c.restore(); }
  // names
  const na = win(t, 1.0, 6.0, 0.4, 0.4);
  nameTag(c, splitX / 2 + lOff, 935, 'Rahul', na, '#6b78a8');
  nameTag(c, splitX + (W - splitX) / 2 + rOff, 935, 'Arjun', na, '#ff5f97');
}

// ---------- full-screen delivery story (20 - 28.6) ----------
function pipRahul(c, t, x, y, r, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a;
  const k = E.outBack(clamp(a)); c.translate(x, y); c.scale(k, k);
  c.shadowColor = 'rgba(20,10,40,0.5)'; c.shadowBlur = 26;
  c.fillStyle = '#cfd5ea'; c.beginPath(); c.arc(0, 0, r + 9, 0, TAU); c.fill(); c.shadowColor = 'transparent';
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
  const g = c.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#3a4170'); g.addColorStop(1, '#222545');
  c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2);
  drawMan(c, { x: 0, y: 110, s: 0.6, who: 'L', t, mood: { stress: 0.9, tired: 0.6 }, look: { x: 0.2, y: 0.7 }, tilt: 0.05 + sn(t, 3) * 0.03, blink: blink(t, 1), screenGlow: '#a9d4ff', pose: { phoneY: 215 } });
  c.restore();
  c.strokeStyle = '#8a96c4'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, r + 3, 0, TAU); c.stroke();
  for (let i = 0; i < 2; i++) { const p = (t * 0.5 + i / 2) % 1; questionMark(c, -r * 0.75 + i * r * 1.5, -r * 0.5 - p * 60, 30, Math.sin(p * Math.PI), 0); }
  c.restore();
  txt(c, 'Rahul: still on hold…', x, y + r + 40, { size: 26, font: 'Fredoka', weight: 600, color: '#ffffff', alpha: a, stroke: 'rgba(40,30,80,0.8)', sw: 6 });
}
function deliveryStory(c, t) {
  const s4 = t - 20.0;
  c.save();
  c.translate(0, 352); c.scale(1.125, 1.125);
  if (s4 < 2.5) teamScene(c, t, s4 + 0.1);
  else if (s4 < 5.2) journeyScene(c, t, s4 - 2.5, 960);
  else recipientScene(c, t, s4 - 5.2);
  const f1 = 1 - Math.abs(clamp((s4 - 2.5) / 0.25 + 1, 0, 2) - 1);
  const f2 = 1 - Math.abs(clamp((s4 - 5.2) / 0.25 + 1, 0, 2) - 1);
  const fl = Math.max(f1, f2);
  if (fl > 0) { c.fillStyle = `rgba(255,240,248,${fl})`; c.fillRect(-300, -450, 1560, 2000); }
  if (s4 > 5.2) pipMan(c, t, 780, 330, 105, win(t, 25.6, 28.8, 0.5, 0.3));
  c.restore();
  pipRahul(c, t, 170, 480, 105, win(t, 20.8, 28.0, 0.5, 0.3));
}

// ---------------------------------------------------------------- MASTER
function renderScene(c, t) {
  c.clearRect(0, 0, W, H);
  if (t < 20.6) drawSplit(c, t);
  if (t >= 20.0 && t < 28.6) {
    const ir = E.inOut(seg(t, 20.0, 20.6));
    const IX = 810, IY = 660;
    c.save();
    if (ir < 1) { c.beginPath(); c.arc(IX, IY, ir * 2300, 0, TAU); c.clip(); }
    deliveryStory(c, t);
    c.restore();
    if (ir > 0 && ir < 1) { c.save(); c.strokeStyle = 'rgba(255,220,150,0.9)'; c.lineWidth = 12; c.shadowColor = '#ffd27a'; c.shadowBlur = 30; c.beginPath(); c.arc(IX, IY, ir * 2300, 0, TAU); c.stroke(); c.restore(); }
  }
  if (t >= 27.8 && t < 38.0) {
    const ir = E.inOut(seg(t, 27.8, 28.6));
    const IX = 540, IY = 1250;
    c.save();
    if (ir < 1) { c.beginPath(); c.arc(IX, IY, ir * 2300, 0, TAU); c.clip(); }
    showcase(c, t);
    c.restore();
    if (ir > 0 && ir < 1) {
      c.save(); c.strokeStyle = 'rgba(255,225,160,0.95)'; c.lineWidth = 14; c.shadowColor = '#ffd27a'; c.shadowBlur = 40;
      c.beginPath(); c.arc(IX, IY, ir * 2300, 0, TAU); c.stroke(); c.restore();
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; sparkle(c, IX + Math.cos(a) * ir * 2300, IY + Math.sin(a) * ir * 2300, 16, '#fff6d8', 1 - ir, t); }
    }
  }
  if (t >= 37.4 && t < 45.6) {
    const p = E.inOut(seg(t, 37.4, 38.0));
    const expand = E.inOut(seg(t, 43.4, 44.9));
    c.save();
    if (p < 1) { c.beginPath(); c.rect(0, 0, W * p / 2, H); c.rect(W - W * p / 2, 0, W * p / 2, H); c.clip(); }
    drawSplit(c, t, lerp(540, 0, expand), kf(t, [[42.8, 0], [43.6, 0.6]]));
    c.restore();
  }
  if (t >= 44.6) {
    const a = E.inOut(seg(t, 44.6, 45.3));
    c.save(); c.globalAlpha = a; endCard(c, t); c.restore();
    const fl = Math.sin(seg(t, 44.6, 45.4) * Math.PI);
    if (fl > 0) { c.fillStyle = `rgba(255,245,250,${fl * 0.6})`; c.fillRect(0, 0, W, H); }
  }
  captions(c, t);
  const fo = seg(t, 49.4, 50);
  if (fo > 0) { c.fillStyle = `rgba(0,0,0,${fo})`; c.fillRect(0, 0, W, H); }
  const fi = 1 - seg(t, 0, 0.35);
  if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
