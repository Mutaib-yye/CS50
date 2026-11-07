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

// ---------------------------------------------------------------- LEFT PANEL
function leftMan(t, panelT) {
  const x = kf(t, [[0, 480], [4.4, 480], [5.4, 300]]);
  const stress = kf(t, [[0, 0], [5, 0], [6.5, 0.25], [9, 0.5], [12, 0.75], [15, 1], [18, 0.85], [28, 0.95], [40, 0.7]]);
  const happy = kf(t, [[0, 0.25], [1.2, 0.45], [3.2, 0.35], [4.8, 0.1], [5.6, 0]]);
  const tired = kf(t, [[0, 0], [17, 0], [22, 0.45], [27, 0.6], [39.5, 0.9], [44, 1]]);
  // look: phone (down) vs card (right) vs dreamy (up)
  let lx = kf(t, [[0, 0], [1.0, 0.1], [1.4, 0.45], [3.0, 0.45], [3.4, 0], [5.4, 0], [5.8, 0.85], [7.6, 0.85], [7.9, 0.1], [8.4, 0.85], [10.6, 0.85], [10.9, 0], [11.4, 0.9], [14, 0.9], [14.4, 0.3], [18, 0.3], [18.4, 0.85], [28, 0.85], [39.6, -0.2]]);
  let ly = kf(t, [[0, 0.8], [1.0, 0.8], [1.4, -0.7], [3.0, -0.7], [3.4, 0.8], [5.4, 0.8], [5.8, -0.1], [7.6, -0.1], [7.9, 0.85], [8.4, -0.1], [10.6, -0.1], [10.9, 0.85], [11.4, -0.1], [14, -0.1], [14.4, 0.6], [18, 0.6], [18.4, 0], [28, 0], [39.6, 0.6]]);
  const shake = stress > 0.7 ? Math.sin(t * 23) * 0.012 * (stress - 0.7) * 3 : 0;
  const tilt = kf(t, [[0, 0], [1.4, -0.06], [3.0, -0.06], [3.4, 0], [15, 0.05], [18, -0.03], [28, 0.04], [39.6, -0.13]]) + shake + sn(t * 0.7, 2) * 0.02;
  return {
    x, y: 650, s: 1.1, who: 'L', t,
    mood: { stress, happy, tired, surprise: 0 },
    look: { x: lx, y: ly }, tilt, blink: blink(t, 1),
    rim: '#7fa6ff', rimSide: -1, screenGlow: '#a9d4ff',
    slump: kf(t, [[0, 0], [38, 0], [40, 28]]),
    pose: { phoneY: kf(t, [[0, 215], [39.5, 215], [40.5, 250]]), phoneA: sn(t * 0.5, 4) * 0.05 },
  };
}

function cardSlot(c, t, a, b, fn) {
  if (t < a || t > b) return;
  const ain = E.outBack(seg(t, a, a + 0.45)), aout = E.in(seg(t, b - 0.35, b));
  c.save();
  const cx = 760, cy = 420;
  c.translate(cx + aout * 120, cy - aout * 160);
  c.rotate(-aout * 0.25 + (1 - ain) * 0.1);
  const k = lerp(0.8, 1, ain) * (1 - aout * 0.3);
  c.scale(k, k);
  c.globalAlpha *= clamp(seg(t, a, a + 0.2)) * (1 - aout);
  c.translate(-cx, -cy);
  fn(c, t - a);
  c.restore();
}

function onHoldScreen(c, x, y, w, h, u, t) {
  card(c, x, y, w, h, { fill: '#f4f5fa' });
  c.save(); rr(c, x, y, w, h, 24); c.clip();
  c.fillStyle = '#41507e'; c.fillRect(x, y, w, 80);
  txt(c, 'Courier Helpline', x + 24, y + 30, { size: 19, align: 'left', color: '#fff', weight: 600 });
  txt(c, 'Calling…', x + 24, y + 56, { size: 13, align: 'left', color: '#dfe5ff', weight: 400 });
  txt(c, 'ON HOLD', x + w / 2, y + 140, { size: 22, color: '#c2334a', font: 'Fredoka', weight: 700, ls: 4 });
  const secs = 47 * 60 + 12 + Math.floor(u * 37);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  txt(c, `00:${mm}:${ss}`, x + w / 2, y + 196, { size: 46, color: '#1a1f33', weight: 700 });
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

function drawLeftPanel(c, t, pw = 960) {
  const gloom = kf(t, [[0, 0], [5, 0], [18, 0.7], [40, 1]]);
  drawRoomLeft(c, t, gloom, -200, pw + 200);
  const m = leftMan(t);
  drawChairLeft(c, m.x, 780, 1.0);
  drawMan(c, m);
  const papers = kf(t, [[0, 0], [13.8, 0], [18, 0.55], [28, 0.85], [40, 1]]);
  drawDeskLeft(c, t, papers, -200, pw + 200);

  // S1 thought bubble (dreaming of her)
  const tb = win(t, 1.2, 4.3, 0.5, 0.4);
  if (tb > 0) {
    thoughtBubble(c, 740, 340, 240, 150, [], tb, { tail: [-1, 1] });
    c.save(); c.globalAlpha *= clamp(tb * 1.5);
    drawHeart(c, 700, 340, 64 * E.outBack(tb), '#ff4f8b');
    idFlag(c, 752, 320, 56);
    c.restore();
  }
  // S2 cards
  cardSlot(c, t, 5.2, 8.6, (c, u) => searchScreen(c, 590, 170, 340, 500, u, t));
  cardSlot(c, t, 8.5, 11.9, (c, u) => chatScreen(c, 590, 170, 340, 500, u, t));
  cardSlot(c, t, 11.8, 15.2, (c, u) => quoteScreen(c, 590, 170, 340, 500, u, t));
  cardSlot(c, t, 18.3, 39.4, (c, u) => onHoldScreen(c, 590, 170, 340, 500, u, t));

  // forms & bills flying into the stack (14.4 - 18)
  const flyers = [[14.4, 'CUSTOMS FORM', 0], [14.8, 'INVOICE', 1], [15.2, 'DECLARATION', 0], [15.6, 'ID PROOF', 1], [16.0, 'FORM 7B', 0], [16.4, 'PERMIT', 1], [16.8, 'TAX SLIP', 0]];
  flyers.forEach(([at, lab, kind], i) => {
    const p = seg(t, at, at + 0.8);
    if (p <= 0 || p >= 1) return;
    const e = E.inOut(p);
    const sx = 1000, sy = 200 + i * 40, ex = i % 2 ? 700 : 600, ey = 900 - i * 6;
    const x = lerp(sx, ex, e), y = lerp(sy, ey, e) - Math.sin(e * Math.PI) * 160;
    if (kind) bill(c, x, y, e * 6 + i, lerp(1, 0.6, e), lab, ['₹2,150', '₹940', '₹650', '₹1,120'][i % 4]);
    else formSheet(c, x, y, e * 5 + i, lerp(1, 0.6, e), lab);
  });
  // floating question marks around (not over) his face
  if (t > 6.2 && t < 44) {
    for (let k = 0; k < 14; k++) {
      const born = 6.2 + k * 0.9;
      const life = (t - born);
      if (life < 0) continue;
      const lp = (life % 3.6) / 3.6;
      const side = k % 2 ? 1 : -1;
      const hx = m.x + side * (150 + (k * 37) % 70);
      const hy = 400 - lp * 260;
      const intensity = clamp((m.mood.stress - 0.2) * 1.6);
      questionMark(c, hx + Math.sin(lp * 6 + k) * 14, hy, 44 + (k % 3) * 14, Math.sin(lp * Math.PI) * intensity, Math.sin(t * 2 + k) * 0.3);
    }
  }
  // unanswered message badges
  [['No reply', 9.4, 470, 560], ['Seen 2h ago', 10.0, 150, 520], ['No reply', 10.6, 480, 470], ['Unread: 0', 19.5, 160, 560], ['Seen', 21, 470, 600]].forEach(([s, at, x, y], i) => {
    const a = win(t, at, at + 3.4 + (i > 2 ? 18 : 0), 0.3, 0.4);
    msgBadge(c, x, y + Math.sin(t * 2 + i) * 5, E.outBack(clamp((t - at) * 3)), a, s);
  });
  // expensive bills taped around in S3
  [[22.0, 140, 200, -0.2, 'SHIPPING', '₹6,800'], [23.0, 470, 150, 0.15, 'CUSTOMS', '₹2,150']].forEach(([at, x, y, r, l, a]) => {
    const p = E.outBack(clamp((t - at) * 2.5));
    if (p > 0 && t < 44) bill(c, x, y, r + Math.sin(t * 1.5) * 0.03, 0.9 * p, l, a);
  });
  // thought bubble: why so difficult
  const wb = win(t, 15.6, 18.6, 0.5, 0.4);
  thoughtBubble(c, 720, 330, 330, 190, ['Why is it so', 'difficult to send', 'one simple gift?'], wb, { size: 27, lh: 38, tail: [-1, 1] });
  // S5 caption
  const cap = win(t, 40.6, 44.2, 0.5, 0.4);
  if (cap > 0) pillTag(c, 760, 300, 'Still waiting…', cap, '#4a5378', '#e9ecf8');

  // cool vignette
  const v = c.createRadialGradient(480, 520, 300, 480, 540, 900);
  v.addColorStop(0, 'rgba(10,10,40,0)'); v.addColorStop(1, `rgba(10,10,40,${0.35 + gloom * 0.25})`);
  c.fillStyle = v; c.fillRect(-200, 0, pw + 400, 1080);
}

// ---------------------------------------------------------------- RIGHT PANEL
function rightMan(t) {
  const x = kf(t, [[0, 480], [4.4, 480], [5.4, 660]]);
  const surprise = kf(t, [[0, 0], [15.25, 0], [15.45, 1], [16.1, 0.9], [16.6, 0]]);
  const happy = kf(t, [[0, 0.35], [1.2, 0.6], [3.2, 0.5], [5, 0.3], [9, 0.45], [15.3, 0.4], [16.3, 1], [18, 0.9], [28, 1], [40, 1]]);
  const lx = kf(t, [[0, 0], [1.0, -0.1], [1.4, -0.45], [3.0, -0.45], [3.4, 0], [5.4, 0], [5.8, -0.85], [15.3, -0.85], [15.5, 0], [16.6, 0], [17, -0.8], [18, -0.8], [39.6, -0.85]]);
  const ly = kf(t, [[0, 0.8], [1.0, 0.8], [1.4, -0.7], [3.0, -0.7], [3.4, 0.8], [5.4, 0.8], [5.8, -0.05], [15.3, -0.05], [15.5, -0.2], [16.6, -0.2], [17, 0], [18, 0], [39.6, -0.05]]);
  const fist = win(t, 16.2, 17.6, 0.25, 0.35);
  const tilt = kf(t, [[0, 0], [1.4, 0.06], [3.0, 0.06], [3.4, 0], [15.3, 0], [15.5, -0.04], [16.4, 0.07], [17.4, 0.02], [40, 0.06]]) + sn(t * 0.6, 7) * 0.015;
  const pose = { phoneY: 215, phoneA: 0 };
  if (fist > 0.01) {
    pose.phoneX = lerp(0, -40, fist);
    pose.lh = [lerp(-52, -88, fist), 233];
    pose.rh = [lerp(52, 110, fist), lerp(233, 120 + Math.sin(t * 14) * 8 * fist, fist)];
    pose.rFist = fist > 0.5;
  }
  if (t > 39.4) pose.phoneY = 190;
  return { x, y: 650, s: 1.1, who: 'R', t, mood: { happy, surprise }, look: { x: lx, y: ly }, tilt, blink: blink(t, 4, 3.2), rim: '#ffc79a', rimSide: 1, screenGlow: '#ffd2e4', pose };
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
  c.fillStyle = bg; c.fillRect(-300, 0, 1560, 1080);
  // wall sign
  c.save();
  c.shadowColor = 'rgba(139,92,246,0.3)'; c.shadowBlur = 20;
  c.fillStyle = '#fff'; rr(c, 200, 70, 560, 110, 26); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  drawLogoIcon(c, 268, 125, 0.6);
  txt(c, 'AiiDell Team', 320, 108, { size: 34, align: 'left', font: 'Fredoka', weight: 700, color: '#ff4f8b' });
  txt(c, 'Jakarta · Indonesia', 320, 148, { size: 20, align: 'left', weight: 600, color: '#8a6ab8' });
  idFlag(c, 660, 135, 50);
  c.restore();
  // shelves with gifts
  [[60, 320], [820, 320]].forEach(([sx, sy], i) => {
    c.fillStyle = '#e5d6ff'; c.fillRect(sx - 60, sy + 70, 200, 12);
    drawGiftBox(c, sx + 20, sy + 70, 0.32, t);
    if (i) drawCake(c, sx + 40, sy + 260, 0.0001, t);
  });
  drawPlant(c, 900, 900, 0.7, t);
  // team members
  drawWoman(c, { x: 280, y: 690, s: 0.82, who: 'H', t, mood: { happy: 0.7 }, look: { x: 0.5, y: -0.1 }, blink: blink(t, 8), tilt: Math.sin(t * 1.4) * 0.03,
    pose: { lh: [-70, 200], rh: [70, 200], prop: c2 => drawBouquet(c2, 0, 200, 0.32, t) } });
  drawMan(c, { x: 690, y: 700, s: 0.82, who: 'T', t, mood: { happy: 0.85 }, look: { x: -0.5, y: -0.1 }, blink: blink(t, 9), tilt: Math.sin(t * 1.2 + 1) * 0.03,
    pose: { phone: false, lh: [-70, 210], rh: [70, 210], prop: c2 => drawGiftBox(c2, 6, 250, 0.42, t) } });
  // desk
  const dg = c.createLinearGradient(0, 940, 0, 1080); dg.addColorStop(0, '#ffffff'); dg.addColorStop(1, '#e8dcfa');
  c.fillStyle = dg; c.fillRect(-300, 950, 1560, 130);
  c.fillStyle = '#d9c6ff'; c.fillRect(-300, 944, 1560, 8);
  // order ticket
  const tk = E.outBack(clamp((u - 0.5) / 0.5));
  if (tk > 0) {
    c.save(); c.translate(480, 360); c.scale(tk, tk); c.rotate(Math.sin(t * 1.5) * 0.01);
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
  c.fillStyle = bg; c.fillRect(-300, 0, 1560, 1080);
  const R = rng(31);
  for (let i = 0; i < 70; i++) { const sx = -100 + R() * 1160, sy = R() * 700; glowDot(c, sx, sy, 3 + R() * 4, 'rgba(255,255,255,0.9)', 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))); }
  const z = kf(u, [[0, 1.0], [3.2, 1.08]]);
  c.save(); c.translate(480, 560); c.scale(z, z); c.translate(-480, -560);
  const m = { x: -20, y: 250, w: 1000, h: 634, lon0: 64, lon1: 146, lat0: -14, lat1: 38 };
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
  txt(c, 'Delivered with love', 480, 1000, { size: 40, font: 'Fredoka', weight: 700, color: '#fff', shadow: 'rgba(80,20,60,0.6)', blur: 12, alpha: win(u, 0.4, 3.3, 0.4, 0.3) });
}

function recipientScene(c, t, u) {
  // Jakarta home exterior at golden hour
  const sky = c.createLinearGradient(0, 0, 0, 700);
  sky.addColorStop(0, '#ffb3cf'); sky.addColorStop(1, '#ffe2b8');
  c.fillStyle = sky; c.fillRect(-300, 0, 1560, 1080);
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
  const hold = clamp((u - 1.0) * 4);
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
    const by = lerp(-200, 740 + 225 * 0.95, land);
    for (let k = 0; k < 8; k++) sparkle(c, 480 + Math.sin(t * 4 + k) * 70, by - 120 - k * 30, 10 - k, '#fff6d8', 1 - k / 8, t + k);
    drawGiftBox(c, 486, by, 0.5 * 0.95, t, 0);
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
  txt(c, 'Surprise delivered!', 400, 170, { size: 46, font: 'Fredoka', weight: 700, color: '#fff', stroke: '#ff4f8b', sw: 10, alpha: win(u, 1.8, 4, 0.3, 0.3) });
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

function drawRightPanel(c, t, pw = 960, offX = 0) {
  // base room with Arjun
  const inS3 = t > 18.0 && t < 28.6;
  const s3 = t - 18;
  // which sub-scene of S3
  const roomVisible = !(inS3 && s3 > 0.55);
  if (roomVisible) {
    drawRoomRight(c, t, -1000, pw + 1000);
    godRays(c, t, 760, 160, 0.9);
    const m = rightMan(t);
    drawSofaRight(c, m.x, 760, 1.0);
    drawMan(c, m);
    dustMotes(c, t, -200, pw + 200);
    // big AiiDell phone screen during S2
    const ph = t >= 5.0 && t < 18.6;
    if (ph) {
      const u = t - 5.0;
      const pin = spring(t, 5.0, 1.6, 6.5), pout = E.in(seg(t, 18.0, 18.55));
      const sc = 0.66 * clamp(pin, 0, 1.2) * (1 - pout * 0.2);
      const px = lerp(m.x, 240, clamp(pin)), py = lerp(880, 470, clamp(pin));
      c.save(); c.globalAlpha = clamp(pin * 2) * (1 - pout);
      glowDot(c, px, py, 380, 'rgba(255,170,210,0.45)');
      phoneFrame(c, px, py, 400, 820, sc, (c2, w, h) => aiiScreen(c2, w, h, u, t));
      c.restore();
    }
    // S1 thought bubble
    const tb = win(t, 1.2, 4.3, 0.5, 0.4);
    if (tb > 0) {
      thoughtBubble(c, 220, 340, 240, 150, [], tb, { tail: [1, 1] });
      c.save(); c.globalAlpha *= clamp(tb * 1.5);
      drawGiftBox(c, 185, 385, 0.32 * E.outBack(tb), t);
      idFlag(c, 238, 320, 56);
      c.restore();
    }
    // reaction bubble
    const rb = win(t, 15.9, 18.3, 0.45, 0.35);
    thoughtBubble(c, 300, 140, 300, 150, ['Wait… that\'s it?', 'So easy!'], rb, { size: 30, lh: 42, tail: [1, 1], color: '#ff4f8b' });
    // S5 video call
    if (t > 39.4) {
      const a = spring(t, 39.8, 1.4, 6);
      c.save(); c.globalAlpha = clamp(a * 2);
      glowDot(c, 240, 470, 380, 'rgba(255,170,210,0.5)');
      phoneFrame(c, 240, 470, 400, 820, 0.66 * clamp(a, 0, 1.15), (c2, w, h) => videoCallScreen(c2, w, h, t));
      c.restore();
      for (let i = 0; i < 7; i++) { const p = ((t - 39.8) * 0.45 + i / 7) % 1; if (t > 40.2) drawHeart(c, 240 + Math.sin(p * 7 + i) * 150, 760 - p * 700, 22 + (i % 3) * 10, i % 2 ? '#ff4f8b' : '#ff9cc0', Math.sin(p * Math.PI) * 0.9); }
      pillTag(c, 660, 1010, 'Already smiling!', win(t, 40.6, 44.2, 0.5, 0.4), '#ff4f8b', '#ffffff');
    }
  }
  if (inS3) {
    // iris transition into S3 sub-scenes
    const ir = E.inOut(seg(t, 18.0, 18.6));
    c.save();
    if (ir < 1) { c.beginPath(); c.arc(240, 470, ir * 1200, 0, TAU); c.clip(); }
    if (s3 < 3.7) teamScene(c, t, s3);
    else if (s3 < 6.6) journeyScene(c, t, s3 - 3.7, pw);
    else recipientScene(c, t, s3 - 6.6);
    // crossfades between sub-scenes
    const f1 = 1 - Math.abs(clamp((s3 - 3.7) / 0.25 + 1, 0, 2) - 1); // flash near 3.7
    const f2 = 1 - Math.abs(clamp((s3 - 6.6) / 0.25 + 1, 0, 2) - 1);
    const fl = Math.max(f1, f2);
    if (fl > 0) { c.fillStyle = `rgba(255,240,248,${fl})`; c.fillRect(-300, 0, pw + 600, 1080); }
    c.restore();
    if (ir > 0 && ir < 1) { c.save(); c.strokeStyle = 'rgba(255,220,150,0.9)'; c.lineWidth = 10; c.shadowColor = '#ffd27a'; c.shadowBlur = 30; c.beginPath(); c.arc(240, 470, ir * 1200, 0, TAU); c.stroke(); c.restore(); }
    pipMan(c, t, 790, 330, 110, win(t, 25.1, 28.8, 0.5, 0.3));
  }
  // warm grade
  const v = c.createRadialGradient(480, 500, 350, 480, 540, 950);
  v.addColorStop(0, 'rgba(255,200,220,0)'); v.addColorStop(1, 'rgba(160,60,120,0.18)');
  c.fillStyle = v; c.fillRect(-300, 0, pw + 600, 1080);
}

// ---------------------------------------------------------------- SPLIT
function drawSplit(c, t, splitX = 960, leftFade = 0, rightOff = 0, rightZoom = 1) {
  // slide-in at start
  const sIn = E.out5(seg(t, 0, 0.9));
  const lOff = (1 - sIn) * -960, rOff = (1 - sIn) * 960;
  // left
  if (splitX > 0) {
    c.save(); c.beginPath(); c.rect(0, 0, splitX, H); c.clip();
    c.translate(lOff - (960 - splitX) * 0.5, 0);
    drawLeftPanel(c, t);
    c.restore();
    if (leftFade > 0) { c.fillStyle = `rgba(12,8,30,${leftFade})`; c.fillRect(0, 0, splitX, H); }
  }
  // right
  c.save(); c.beginPath(); c.rect(splitX, 0, W - splitX, H); c.clip();
  const rw = W - splitX;
  c.translate(splitX + rOff + (rw - 960) / 2, 0);
  if (rightZoom !== 1) { c.translate(480, 560); c.scale(rightZoom, rightZoom); c.translate(-480, -560); }
  drawRightPanel(c, t, 960);
  c.restore();
  // divider
  if (splitX > 0 && splitX < W) {
    c.save();
    c.shadowColor = '#ffd27a'; c.shadowBlur = 24;
    const dg = c.createLinearGradient(0, 0, 0, H); dg.addColorStop(0, '#fff3c9'); dg.addColorStop(0.5, '#f5c46b'); dg.addColorStop(1, '#fff3c9');
    c.fillStyle = dg;
    const dh = H * E.out(seg(t, 0.2, 1.0));
    c.fillRect(splitX - 4, (H - dh) / 2, 8, dh);
    c.restore();
    for (let i = 0; i < 6; i++) { const p = (t * 0.25 + i / 6) % 1; sparkle(c, splitX + Math.sin(p * 9 + i) * 8, p * H, 7 + (i % 3) * 3, '#fff6d8', Math.sin(p * Math.PI)); }
    // VS medallion
    const vs = E.outBack(seg(t, 2.4, 2.9)) * (1 - seg(t, 17.6, 18.0)) + (t > 39.8 && t < 43.4 ? E.outBack(seg(t, 39.8, 40.3)) : 0);
    if (vs > 0) {
      c.save(); c.translate(splitX, 985); c.scale(vs, vs);
      c.shadowColor = 'rgba(80,20,80,0.5)'; c.shadowBlur = 20;
      c.fillStyle = brandGrad(c, -46, -46, 46, 46); c.beginPath(); c.arc(0, 0, 46, 0, TAU); c.fill();
      c.shadowColor = 'transparent'; c.shadowBlur = 0; c.strokeStyle = '#fff3c9'; c.lineWidth = 5; c.stroke();
      txt(c, 'VS', 0, 3, { size: 34, font: 'Fredoka', weight: 700, color: '#fff' });
      c.restore();
    }
  }
}

function sideLabels(c, t) {
  // big labels in S1, small tags afterwards
  const a = E.outBack(seg(t, 2.6, 3.1));
  if (a <= 0) return;
  const shrink = E.inOut(seg(t, 4.4, 5.2));
  const out = t > 39.0 && t < 39.6 ? 0 : 1;
  const leftA = (t < 18.4 || (t > 39.7 && t < 43.5)) ? 1 : (t < 28 ? 1 : 0);
  const show = (t < 27.8 || (t > 39.7 && t < 43.6)) ? 1 : 0;
  if (!show) return;
  const k = lerp(1, 0.62, shrink);
  const y = lerp(965, 60, shrink);
  const xs = [lerp(480, 170, shrink), lerp(1440, 1750, shrink)];
  [['THE HARD WAY', '#ffffff', '#4a5378', '#7d89b8'], ['THE AiiDELL WAY', '#ffffff', '#ff4f8b', '#a855f7']].forEach(([s, col, b1, b2], i) => {
    c.save(); c.translate(xs[i], y); c.scale(a * k, a * k);
    c.font = '700 44px Fredoka'; c.letterSpacing = '2px';
    const w = c.measureText(s).width + 80;
    c.shadowColor = 'rgba(30,10,50,0.4)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
    const g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, b1); g.addColorStop(1, b2);
    c.fillStyle = g; rr(c, -w / 2, -40, w, 80, 40); c.fill();
    c.shadowColor = 'transparent'; c.shadowBlur = 0; c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 3; c.stroke();
    txt(c, s, 0, 3, { size: 44, font: 'Fredoka', weight: 700, color: col, ls: 2 });
    c.restore();
  });
}

function headline(c, t) {
  const a = seg(t, 0.5, 2.0);
  if (a <= 0 || t > 5) return;
  const out = E.in(seg(t, 4.3, 4.9));
  c.save();
  c.translate(0, -out * 220);
  c.globalAlpha = 1 - out;
  // ribbon backdrop
  const bw = 1500 * E.out(seg(t, 0.4, 1.0));
  c.save();
  c.shadowColor = 'rgba(60,20,80,0.45)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
  c.fillStyle = brandGrad(c, 960 - bw / 2, 0, 960 + bw / 2, 0);
  rr(c, 960 - bw / 2, 92, bw, 130, 65); c.fill();
  c.restore();
  popText(c, 'WANT TO SEND A GIFT TO INDONESIA?', 960, 160, a, { size: 72, font: 'Fredoka', weight: 700, color: '#ffffff', stroke: '#7a2fbf', sw: 6, ls: 1 });
  for (let i = 0; i < 8; i++) sparkle(c, 960 - 700 + i * 200, 100 + (i % 2) * 120, 10 + (i % 3) * 4, '#fff6d8', Math.abs(Math.sin(t * 3 + i)) * a, t);
  c.restore();
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
  const u = t - 28.2;
  const bg = c.createRadialGradient(960, 560, 100, 960, 540, 1200);
  bg.addColorStop(0, '#fff8f2'); bg.addColorStop(0.5, '#ffe3ee'); bg.addColorStop(1, '#d9c6ff');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  // bokeh
  const R = rng(99);
  for (let i = 0; i < 26; i++) {
    const bx = R() * W, by = R() * H, br = 30 + R() * 90, ph = R() * TAU;
    const col = ['rgba(255,170,200,0.25)', 'rgba(200,170,255,0.25)', 'rgba(255,220,150,0.25)'][i % 3];
    glowDot(c, bx + Math.sin(t * 0.4 + ph) * 30, by + Math.cos(t * 0.3 + ph) * 20, br, col);
  }
  dustMotes(c, t, 0, W, 'rgba(255,215,140,0.9)', 40, 8);
  // title
  const ta = E.out(seg(u, 0.1, 0.8));
  c.save(); c.globalAlpha = ta; c.translate(0, (1 - ta) * -30);
  c.font = '700 70px Playfair'; c.letterSpacing = '10px';
  const tg = c.createLinearGradient(600, 0, 1320, 0); tg.addColorStop(0, '#c98a2a'); tg.addColorStop(0.5, '#f5c46b'); tg.addColorStop(1, '#c98a2a');
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.shadowColor = 'rgba(200,140,60,0.35)'; c.shadowBlur = 14;
  c.fillStyle = tg; c.fillText('WHAT YOU CAN SEND', 960, 110);
  c.restore();
  txt(c, 'From India to your loved ones in Indonesia', 960, 180, { size: 28, weight: 400, color: '#7a5a9a', alpha: ta });
  // shimmer line
  c.fillStyle = hexA('#f5c46b', ta); c.fillRect(960 - 160 * ta, 214, 320 * ta, 3);

  const START = 28.6, DUR = 1.7;
  const rowP = E.inOut(seg(t, 37.1, 37.8));
  const f = clamp((t - START) / DUR, 0, 4);
  const step = Math.min(4, Math.floor(f));
  const fr = f - step;
  const cur = step + (step < 4 ? E.inOut(clamp((fr - 0.74) / 0.26)) : 0);
  // pedestal
  const pa = 1 - rowP;
  if (pa > 0) {
    c.save(); c.globalAlpha = pa;
    glowDot(c, 960, 620, 420, 'rgba(255,255,255,0.9)');
    const pg = c.createLinearGradient(700, 780, 1220, 860); pg.addColorStop(0, '#fff6ea'); pg.addColorStop(0.5, '#ffffff'); pg.addColorStop(1, '#f2dcc8');
    c.fillStyle = '#e8c9a8'; c.beginPath(); c.ellipse(960, 830, 260, 52, 0, 0, TAU); c.fill();
    c.fillStyle = pg; c.beginPath(); c.ellipse(960, 812, 260, 52, 0, 0, TAU); c.fill();
    c.strokeStyle = '#f5c46b'; c.lineWidth = 4; c.stroke();
    // rotating light ring
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * 0.8; sparkle(c, 960 + Math.cos(a) * 280, 812 + Math.sin(a) * 58, 6, '#ffd27a', 0.4 + 0.6 * (Math.sin(a) > 0 ? 1 : 0.3)); }
    c.restore();
  }
  SHOW.forEach(([name, desc, fn, sc], i) => {
    const pos = i - cur;
    // carousel position
    let x = 960 + pos * 600, y = 800, s = sc * (1 - Math.min(Math.abs(pos), 1.6) * 0.42), a = clamp(1.8 - Math.abs(pos));
    if (u < 0.4 + i * 0) a *= E.out(seg(u, 0.1, 0.6));
    // row layout at end
    const rx = 960 + (i - 2) * 340, ry = 560, rs = sc * 0.5;
    x = lerp(x, rx, rowP); y = lerp(y, ry, rowP); s = lerp(s, rs, rowP); a = lerp(a, 1, rowP);
    if (a <= 0.01) return;
    const bob = Math.sin(t * 1.8 + i) * 6;
    c.save(); c.globalAlpha = a;
    if (Math.abs(pos) < 0.5 && rowP < 0.5) { const ang = Math.sin(t * 1.2) * 0.04; c.translate(x, y + bob); c.rotate(ang); c.translate(-x, -(y + bob)); }
    fn(c, x, y + bob - (rowP > 0 ? 0 : 20), s, t);
    c.restore();
    if (rowP > 0) {
      txt(c, name, rx, 660, { size: 34, font: 'Playfair', weight: 700, color: '#b07a2a', alpha: rowP, ls: 4 });
    }
  });
  // label for current
  if (rowP < 1) {
    const [name, desc] = SHOW[step];
    const la = (step === 0 ? E.out(clamp((t - 28.5) / 0.4)) : E.out(clamp(fr / 0.22))) * (step < 4 ? 1 - E.in(clamp((fr - 0.7) / 0.12)) : 1) * (1 - rowP);
    c.save(); c.globalAlpha = la; c.translate(0, (1 - la) * 20);
    c.font = '800 96px Playfair'; c.letterSpacing = '14px'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const ng = c.createLinearGradient(700, 900, 1220, 980); ng.addColorStop(0, '#ff4f8b'); ng.addColorStop(1, '#8b5cf6');
    c.shadowColor = 'rgba(139,92,246,0.3)'; c.shadowBlur = 16;
    c.fillStyle = ng; c.fillText(name, 960, 930);
    c.restore();
    txt(c, desc, 960, 1012, { size: 32, weight: 400, color: '#5a4a7a', alpha: la });
    // side ornaments
    [-1, 1].forEach(s => { c.save(); c.globalAlpha = la; c.fillStyle = '#f5c46b'; c.fillRect(960 + s * 330 - (s > 0 ? 0 : 120), 928, 120, 3); sparkle(c, 960 + s * 470, 930, 10, '#f5c46b', la); c.restore(); });
  }
  // disclaimers
  if (rowP > 0) {
    const d1 = E.out(seg(t, 37.6, 38.1)), d2 = E.out(seg(t, 38.0, 38.5));
    [[d1, 'Same-day delivery may be available depending on the location.', 800, 'clock'], [d2, 'Other delivery options are available depending on the area and service.', 880, 'truck']].forEach(([a, s, y, ic]) => {
      if (a <= 0) return;
      c.save(); c.globalAlpha = a; c.translate((1 - a) * 40, 0);
      c.font = '600 32px Poppins';
      const w = c.measureText(s).width + 130;
      c.shadowColor = 'rgba(139,92,246,0.2)'; c.shadowBlur = 20; c.shadowOffsetY = 6;
      c.fillStyle = 'rgba(255,255,255,0.92)'; rr(c, 960 - w / 2, y - 38, w, 76, 38); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
      const ix = 960 - w / 2 + 50;
      c.fillStyle = brandGrad(c, ix - 24, y - 24, ix + 24, y + 24); c.beginPath(); c.arc(ix, y, 24, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 3.5; c.lineCap = 'round';
      if (ic === 'clock') { c.beginPath(); c.arc(ix, y, 12, 0, TAU); c.moveTo(ix, y); c.lineTo(ix, y - 8); c.moveTo(ix, y); c.lineTo(ix + 6, y + 3); c.stroke(); }
      else { c.strokeRect(ix - 13, y - 8, 15, 13); c.beginPath(); c.moveTo(ix + 2, y - 4); c.lineTo(ix + 9, y - 4); c.lineTo(ix + 13, y + 1); c.lineTo(ix + 13, y + 5); c.lineTo(ix + 2, y + 5); c.stroke(); c.beginPath(); c.arc(ix - 7, y + 8, 3, 0, TAU); c.arc(ix + 8, y + 8, 3, 0, TAU); c.stroke(); }
      txt(c, s, ix + 40, y + 2, { size: 32, align: 'left', weight: 600, color: '#4a3a6a' });
      c.restore();
    });
  }
}

// ---------------------------------------------------------------- END CARD
function endCard(c, t) {
  const u = t - 44.9;
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#2b1a63'); bg.addColorStop(0.5, '#7a3a9e'); bg.addColorStop(1, '#ff8fb5');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const R = rng(55);
  for (let i = 0; i < 120; i++) { const sx = R() * W, sy = R() * H; glowDot(c, sx, sy, 2 + R() * 4, 'rgba(255,255,255,0.9)', 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + i))); }
  // map
  const dim = E.inOut(seg(u, 1.6, 2.3));
  const ms = lerp(1, 0.78, dim);
  c.save();
  c.globalAlpha = lerp(1, 0.35, dim) * E.out(seg(u, 0, 0.6));
  c.translate(960, 560 + dim * 30); c.scale(ms, ms); c.translate(-960, -560);
  const m = { x: 260, y: 250, w: 1400, h: 826, lon0: 60, lon1: 150, lat0: -14, lat1: 39 };
  drawMap(c, m, t, { labelSize: 34, labels: dim < 0.5 });
  const p = E.inOut(seg(u, 0.3, 1.4));
  drawRoute(c, m, p, t, { lw: 9, citySize: 26, cityLabels: dim < 0.5 });
  if (p > 0 && p < 1) {
    const [gx, gy] = routePoint(m, p);
    for (let k = 1; k < 16; k++) { const [tx, ty] = routePoint(m, Math.max(0, p - k * 0.012)); sparkle(c, tx, ty, 12 - k * 0.6, k % 2 ? '#ffd27a' : '#ffb3cf', 1 - k / 16, t + k); }
    drawHeart(c, gx, gy, 54, '#ff4f8b');
  }
  if (u > 1.4) { const [ , , , , bx, by] = routePoint(m, 1); const bp = clamp((u - 1.4) / 1.2); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; drawHeart(c, bx + Math.cos(a) * bp * 160, by + Math.sin(a) * bp * 110, 30, '#ff6f9f', 1 - bp); } }
  c.restore();
  // headline
  const h1 = E.out(seg(u, 0.5, 1.1)), h2 = E.out(seg(u, 0.9, 1.5));
  txt(c, 'Different countries.', 960, 110 + (1 - h1) * 20, { size: 64, font: 'Fredoka', weight: 700, color: '#ffffff', alpha: h1, shadow: 'rgba(40,10,60,0.6)', blur: 20 });
  txt(c, 'One simple way to make someone smile.', 960, 190 + (1 - h2) * 20, { size: 52, font: 'Fredoka', weight: 600, color: '#ffe0ec', alpha: h2, shadow: 'rgba(40,10,60,0.6)', blur: 20 });
  // logo
  const la = E.outBack(seg(u, 1.9, 2.6));
  if (la > 0) {
    c.save();
    glowDot(c, 960, 470, 520 * la, 'rgba(255,255,255,0.5)');
    c.save(); c.translate(960, 470); c.scale(la, la);
    c.shadowColor = 'rgba(40,10,60,0.4)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
    c.fillStyle = 'rgba(255,255,255,0.97)'; rr(c, -400, -110, 800, 220, 110); c.fill();
    c.restore();
    drawLogo(c, 960 + 30 * la, 470, 1.25 * la, 1, t);
    // shimmer sweep
    const sw = seg(u, 2.6, 3.4);
    if (sw > 0 && sw < 1) {
      c.save(); c.beginPath(); rr(c, 560, 360, 800, 220, 110); c.clip();
      const sx = lerp(400, 1520, sw);
      const sg = c.createLinearGradient(sx - 80, 0, sx + 80, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.8)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sg; c.fillRect(sx - 80, 360, 160, 220);
      c.restore();
    }
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 0.5; sparkle(c, 960 + Math.cos(a) * 460, 470 + Math.sin(a) * 150, 9 + (i % 3) * 4, '#fff6d8', la * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))), t); }
    c.restore();
  }
  const l2 = E.out(seg(u, 2.7, 3.3));
  txt(c, 'Why make it complicated when you can send it with just a few clicks?', 960, 680 + (1 - l2) * 20, { size: 40, weight: 600, color: '#ffffff', alpha: l2, shadow: 'rgba(40,10,60,0.6)', blur: 16 });
  // CTA
  const ca = E.outBack(seg(u, 3.4, 3.9));
  if (ca > 0) {
    const pulse = 1 + Math.sin(t * 5) * 0.025;
    c.save(); c.translate(960, 820); c.scale(ca * pulse, ca * pulse);
    c.shadowColor = 'rgba(255,79,139,0.7)'; c.shadowBlur = 40; c.shadowOffsetY = 10;
    const g = c.createLinearGradient(-430, 0, 430, 0); g.addColorStop(0, '#ffd27a'); g.addColorStop(1, '#f5a54a');
    c.fillStyle = g; rr(c, -440, -56, 880, 112, 56); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    c.strokeStyle = '#fff6d8'; c.lineWidth = 4; c.stroke();
    txt(c, 'VISIT US NOW:', -150, 2, { size: 40, font: 'Fredoka', weight: 700, color: '#5a2a7a' });
    txt(c, 'www.aiidell.com', 175, 2, { size: 44, font: 'Fredoka', weight: 700, color: '#ffffff', stroke: '#c2337a', sw: 6 });
    c.restore();
    // cursor click
    const cp = seg(u, 4.1, 4.6);
    if (cp > 0) {
      fingerCursor(c, lerp(1500, 1180, E.out(cp)), lerp(1000, 835, E.out(cp)), u > 4.6 && u < 4.8 ? 1 : 0, 1);
      tapRipple(c, 1180, 835, (u - 4.6) / 0.4);
    }
  }
  const sm = E.out(seg(u, 3.8, 4.3));
  txt(c, 'Flowers  ·  Gifts  ·  Food  ·  Snacks  ·  Cakes', 960, 950, { size: 30, weight: 600, color: '#ffe0ec', alpha: sm, ls: 2 });
}

// ---------------------------------------------------------------- MASTER
function renderScene(c, t) {
  c.clearRect(0, 0, W, H);
  if (t < 28.6) {
    drawSplit(c, t);
    sideLabels(c, t);
    headline(c, t);
  }
  // S3 -> S4 iris
  if (t >= 27.8 && t < 39.9) {
    const ir = E.inOut(seg(t, 27.8, 28.6));
    c.save();
    if (ir < 1) { c.beginPath(); c.arc(1440, 560, ir * 2300, 0, TAU); c.clip(); }
    showcase(c, t);
    c.restore();
    if (ir > 0 && ir < 1) {
      c.save(); c.strokeStyle = 'rgba(255,225,160,0.95)'; c.lineWidth = 14; c.shadowColor = '#ffd27a'; c.shadowBlur = 40;
      c.beginPath(); c.arc(1440, 560, ir * 2300, 0, TAU); c.stroke(); c.restore();
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; sparkle(c, 1440 + Math.cos(a) * ir * 2300, 560 + Math.sin(a) * ir * 2300, 16, '#fff6d8', 1 - ir, t); }
    }
  }
  // S4 -> S5: split panels slide back in
  if (t >= 39.3 && t < 45.6) {
    const p = E.inOut(seg(t, 39.3, 39.9));
    const expand = E.inOut(seg(t, 43.4, 44.9));
    const splitX = lerp(960, 0, expand);
    c.save();
    if (p < 1) { c.beginPath(); c.rect(0, 0, W * p / 2, H); c.rect(W - W * p / 2, 0, W * p / 2, H); c.clip(); }
    drawSplit(c, t, splitX, kf(t, [[42.6, 0], [43.6, 0.75]]), 0, lerp(1, 1.12, expand));
    sideLabels(c, t);
    c.restore();
  }
  // end card with sparkle flash
  if (t >= 44.6) {
    const a = E.inOut(seg(t, 44.6, 45.3));
    c.save(); c.globalAlpha = a; endCard(c, t); c.restore();
    const fl = Math.sin(seg(t, 44.6, 45.4) * Math.PI);
    if (fl > 0) { c.fillStyle = `rgba(255,245,250,${fl * 0.6})`; c.fillRect(0, 0, W, H); }
  }
  // final fade out
  const fo = seg(t, 49.4, 50);
  if (fo > 0) { c.fillStyle = `rgba(0,0,0,${fo})`; c.fillRect(0, 0, W, H); }
  // fade in from black
  const fi = 1 - seg(t, 0, 0.35);
  if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
