// ===== Props, environments, UI screens, products, map, logo =====
const BRAND = { pink: '#ff4f8b', purple: '#8b5cf6', gold: '#f5c46b', cream: '#fff7ef', lav: '#cdb8ff', ink: '#2a1f4a' };

function brandGrad(c, x0, y0, x1, y1) {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, '#ff5f97'); g.addColorStop(1, '#8b5cf6');
  return g;
}

// ---------------- LOGO ----------------
function drawLogoIcon(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.shadowColor = 'rgba(139,92,246,0.5)'; c.shadowBlur = 24; c.shadowOffsetY = 6;
  c.fillStyle = brandGrad(c, -50, -50, 50, 50);
  rr(c, -50, -50, 100, 100, 28); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  // gloss
  const gl = c.createLinearGradient(0, -50, 0, 10);
  gl.addColorStop(0, 'rgba(255,255,255,0.45)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = gl; rr(c, -46, -46, 92, 50, 24); c.fill();
  // gift box with heart
  c.fillStyle = '#fff';
  rr(c, -26, -6, 52, 36, 6); c.fill();
  rr(c, -31, -18, 62, 14, 5); c.fill();
  c.fillStyle = '#ff5f97';
  c.fillRect(-5, -18, 10, 48);
  heartPath(c, -12, -38, 22); c.fill();
  heartPath(c, 12, -38, 22); c.fill();
  c.restore();
}
function drawLogo(c, x, y, s, alpha = 1, t = 0, dark = false) {
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha;
  c.translate(x, y); c.scale(s, s);
  drawLogoIcon(c, -190, 0, 1, t);
  c.font = '700 96px Fredoka';
  c.textBaseline = 'middle'; c.textAlign = 'left';
  const g = brandGrad(c, -120, -40, 260, 40);
  c.fillStyle = dark ? '#fff' : g;
  c.shadowColor = dark ? 'rgba(255,95,151,0.6)' : 'rgba(139,92,246,0.25)'; c.shadowBlur = 18;
  c.fillText('AiiDell', -120, 4);
  const w = c.measureText('AiiDell').width;
  c.font = '600 56px Fredoka';
  c.fillStyle = dark ? '#ffd9e8' : '#b58cf5';
  c.fillText('.com', -120 + w + 4, 18);
  c.restore();
}

// ---------------- ENVIRONMENTS ----------------
function drawRoomLeft(c, t, gloom, x0 = 0, x1 = 960) {
  const wg = c.createLinearGradient(0, 0, 0, 1080);
  wg.addColorStop(0, mixHex('#3a4170', '#262a48', gloom * 0.6));
  wg.addColorStop(1, mixHex('#2a2d4e', '#17192e', gloom * 0.6));
  c.fillStyle = wg; c.fillRect(x0, 0, x1 - x0, 1080);
  // wallpaper stripes
  c.fillStyle = 'rgba(255,255,255,0.025)';
  for (let x = x0 - (x0 % 60); x < x1; x += 60) c.fillRect(x, 0, 24, 1080);
  // window (night)
  c.save();
  const wx = 70, wy = 110, ww = 270, wh = 300;
  c.fillStyle = '#4a5280'; rr(c, wx - 14, wy - 14, ww + 28, wh + 28, 10); c.fill();
  const sky = c.createLinearGradient(0, wy, 0, wy + wh);
  sky.addColorStop(0, '#141a3d'); sky.addColorStop(1, '#3a3b78');
  c.fillStyle = sky; c.fillRect(wx, wy, ww, wh);
  const R = rng(5);
  for (let i = 0; i < 26; i++) {
    const sx = wx + R() * ww, sy = wy + R() * wh * 0.7, tw = 0.5 + 0.5 * Math.sin(t * 3 + i);
    c.fillStyle = `rgba(255,255,240,${0.3 + tw * 0.6})`; c.beginPath(); c.arc(sx, sy, 1.2 + R() * 1.3, 0, TAU); c.fill();
  }
  glowDot(c, wx + 200, wy + 70, 70, 'rgba(220,230,255,0.5)');
  c.fillStyle = '#eef1ff'; c.beginPath(); c.arc(wx + 200, wy + 70, 26, 0, TAU); c.fill();
  c.fillStyle = '#3a3b78'; c.beginPath(); c.arc(wx + 212, wy + 62, 24, 0, TAU); c.fill();
  // city silhouette
  c.fillStyle = '#1a1c3a';
  for (let i = 0; i < 9; i++) { const bh = 40 + hash(i) * 90; c.fillRect(wx + i * 31, wy + wh - bh, 28, bh); }
  c.fillStyle = 'rgba(255,214,120,0.7)';
  for (let i = 0; i < 30; i++) { const bx = wx + (i % 9) * 31 + 6 + ((i * 7) % 3) * 7, by = wy + wh - 20 - Math.floor(i / 9) * 18; if (hash(i * 3.1) > 0.4) c.fillRect(bx, by, 4, 6); }
  c.strokeStyle = '#4a5280'; c.lineWidth = 10;
  c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2); c.stroke();
  c.restore();
  // shelf
  c.fillStyle = '#4b4369'; c.fillRect(560, 400, 340, 16);
  [[580, 330, 60, 70, '#6f6290'], [650, 350, 40, 50, '#806aa8'], [700, 316, 26, 84, '#5d7aa8'], [730, 320, 22, 80, '#8a6aa8'], [760, 340, 70, 60, '#5d5880']].forEach(([x, y, w, h, col]) => { c.fillStyle = col; c.fillRect(x, y, w, h); });
  // sticky notes
  [['?', 600, 470, -0.12, '#ffe27a'], ['Customs?', 700, 500, 0.08, '#ffb0b0'], ['Courier??', 820, 460, -0.05, '#a8e6ff'], ['Tax?', 860, 560, 0.12, '#ffe27a']].forEach(([s, x, y, r, col], i) => {
    c.save(); c.translate(x, y + Math.sin(t * 2 + i) * 1.5); c.rotate(r);
    c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
    c.fillStyle = col; c.fillRect(-46, -40, 92, 80); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    txt(c, s, 0, 2, { size: s.length > 3 ? 18 : 40, color: '#4a3a5a', font: 'Fredoka', weight: 600 });
    c.restore();
  });
  // wall clock
  const cx = 760, cy = 200, cr = 72;
  c.save();
  c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
  c.fillStyle = '#e9e4f5'; c.beginPath(); c.arc(cx, cy, cr, 0, TAU); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.strokeStyle = '#6a5f8a'; c.lineWidth = 9; c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.strokeStyle = '#6a5f8a'; c.lineWidth = i % 3 ? 2 : 4; c.beginPath(); c.moveTo(cx + Math.cos(a) * (cr - 10), cy + Math.sin(a) * (cr - 10)); c.lineTo(cx + Math.cos(a) * (cr - 20), cy + Math.sin(a) * (cr - 20)); c.stroke(); }
  const spin = t * 0.6 + Math.max(0, t - 5) * Math.max(0, t - 5) * 0.35 * (gloom > 0.05 ? 1 : 0);
  const mA = spin * 2.4 - Math.PI / 2, hA = spin * 0.2 - Math.PI / 2;
  c.lineCap = 'round';
  c.strokeStyle = '#3a2f5a'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(hA) * 36, cy + Math.sin(hA) * 36); c.stroke();
  c.strokeStyle = '#ff5f6f'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(mA) * 56, cy + Math.sin(mA) * 56); c.stroke();
  c.fillStyle = '#3a2f5a'; c.beginPath(); c.arc(cx, cy, 7, 0, TAU); c.fill();
  if (gloom > 0.2) { // motion lines
    c.strokeStyle = `rgba(255,255,255,${0.35 * gloom})`; c.lineWidth = 3;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(cx, cy, cr + 14 + k * 9, mA - 0.9, mA - 0.2); c.stroke(); }
  }
  c.restore();
  // lamp glow
  glowDot(c, 150, 760, 260, 'rgba(255,190,110,0.28)');
}
function drawChairLeft(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const g = c.createLinearGradient(-220, 0, 220, 0);
  g.addColorStop(0, '#2b2f48'); g.addColorStop(0.5, '#404665'); g.addColorStop(1, '#23263d');
  c.fillStyle = g;
  rr(c, -230, -230, 460, 900, 80); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = 6;
  rr(c, -200, -200, 400, 860, 64); c.stroke();
  c.restore();
}
function drawDeskLeft(c, t, papers, x0 = 0, x1 = 960) {
  // desk top
  const dg = c.createLinearGradient(0, 960, 0, 1080);
  dg.addColorStop(0, '#5b4a6e'); dg.addColorStop(1, '#3a2f4c');
  c.fillStyle = dg; c.fillRect(x0, 975, x1 - x0, 105);
  c.fillStyle = '#6e5c84'; c.fillRect(x0, 968, x1 - x0, 10);
  // lamp
  c.save();
  c.fillStyle = '#2d2a40';
  c.beginPath(); c.ellipse(110, 975, 60, 12, 0, 0, TAU); c.fill();
  c.strokeStyle = '#2d2a40'; c.lineWidth = 10; c.beginPath(); c.moveTo(110, 970); c.lineTo(80, 830); c.lineTo(150, 760); c.stroke();
  c.fillStyle = '#ffb46b';
  c.beginPath(); c.moveTo(120, 730); c.lineTo(200, 770); c.lineTo(170, 800); c.closePath(); c.fill();
  c.restore();
  // coffee mugs
  [[820, 968], [880, 968]].forEach(([mx, my], i) => {
    c.fillStyle = i ? '#c9c2da' : '#e8e2f2'; rr(c, mx - 22, my - 52, 44, 52, 8); c.fill();
    c.strokeStyle = i ? '#c9c2da' : '#e8e2f2'; c.lineWidth = 6; c.beginPath(); c.arc(mx + 26, my - 28, 12, -1.3, 1.3); c.stroke();
    c.fillStyle = '#3b2418'; c.beginPath(); c.ellipse(mx, my - 50, 18, 4, 0, 0, TAU); c.fill();
  });
  // paper stacks grow with 'papers' 0..1
  const stacks = [[600, 1], [700, 0.8], [210, 0.6]];
  stacks.forEach(([px, k], si) => {
    const n = Math.floor(papers * 26 * k);
    for (let i = 0; i < n; i++) {
      const jx = Math.sin(i * 12.9 + si) * 10, r = Math.sin(i * 4.1 + si) * 0.06;
      c.save(); c.translate(px + jx, 968 - i * 7); c.rotate(r);
      c.fillStyle = i % 4 === 0 ? '#f3efe6' : '#ffffff';
      c.shadowColor = 'rgba(0,0,0,0.18)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
      c.fillRect(-70, -7, 140, 7);
      c.restore();
    }
    if (n > 3) {
      c.save(); c.translate(px, 968 - n * 7 - 4); c.rotate(Math.sin(si * 3) * 0.08);
      c.fillStyle = '#fff'; c.fillRect(-70, -6, 140, 8);
      c.fillStyle = '#e24a5a'; c.fillRect(-60, -4, 50, 3);
      c.restore();
    }
  });
}

function drawRoomRight(c, t, x0 = 0, x1 = 960) {
  const wg = c.createLinearGradient(0, 0, 0, 1080);
  wg.addColorStop(0, '#fff1f6'); wg.addColorStop(1, '#f9d5e4');
  c.fillStyle = wg; c.fillRect(x0, 0, x1 - x0, 1080);
  // subtle heart pattern
  c.save(); c.globalAlpha = 0.07;
  for (let y = 40; y < 1080; y += 90) for (let x = x0 - (x0 % 90) + ((y / 90) % 2) * 45; x < x1; x += 90) drawHeart(c, x, y, 14, '#ff8fb5', 1, false);
  c.restore();
  // big window (golden hour)
  const wx = 540, wy = 90, ww = 360, wh = 470;
  c.save();
  c.fillStyle = '#ffffff'; rr(c, wx - 16, wy - 16, ww + 32, wh + 32, 18); c.fill();
  const sky = c.createLinearGradient(0, wy, 0, wy + wh);
  sky.addColorStop(0, '#c7b6ff'); sky.addColorStop(0.45, '#ffb6cf'); sky.addColorStop(0.8, '#ffd3a1'); sky.addColorStop(1, '#ffe7b8');
  c.fillStyle = sky; c.fillRect(wx, wy, ww, wh);
  glowDot(c, wx + 250, wy + 360, 190, 'rgba(255,240,200,0.9)');
  c.fillStyle = '#fff6df'; c.beginPath(); c.arc(wx + 250, wy + 360, 42, 0, TAU); c.fill();
  // clouds
  [[wx + 90 + Math.sin(t * 0.2) * 10, wy + 120], [wx + 260 + Math.sin(t * 0.15 + 1) * 12, wy + 200]].forEach(([cx, cy]) => {
    c.fillStyle = 'rgba(255,255,255,0.75)';
    [[0, 0, 34], [32, -10, 28], [60, 4, 24], [-30, 6, 22]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(cx + dx, cy + dy, r, 0, TAU); c.fill(); });
  });
  // skyline
  c.fillStyle = 'rgba(190,140,190,0.55)';
  for (let i = 0; i < 12; i++) { const bh = 30 + hash(i + 9) * 80; c.fillRect(wx + i * 30, wy + wh - bh, 26, bh); }
  c.strokeStyle = '#ffffff'; c.lineWidth = 12;
  c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.stroke();
  c.restore();
  // sheer curtains
  [[wx - 40, 1], [wx + ww + 40, -1]].forEach(([cx, d]) => {
    c.save();
    const cg = c.createLinearGradient(cx - 60, 0, cx + 60, 0);
    cg.addColorStop(0, 'rgba(255,255,255,0.15)'); cg.addColorStop(0.5, 'rgba(255,255,255,0.7)'); cg.addColorStop(1, 'rgba(255,255,255,0.15)');
    c.fillStyle = cg;
    c.beginPath(); c.moveTo(cx - 60, 60);
    for (let y = 60; y <= 640; y += 20) c.lineTo(cx - 60 + Math.sin(y * 0.03 + t * 0.8) * 8 + (y > 450 ? d * (y - 450) * 0.15 : 0), y);
    for (let y = 640; y >= 60; y -= 20) c.lineTo(cx + 60 + Math.sin(y * 0.03 + t * 0.8 + 1) * 8 + (y > 450 ? d * (y - 450) * 0.15 : 0), y);
    c.fill();
    c.restore();
  });
  c.fillStyle = '#e7c48a'; c.fillRect(wx - 120, 52, ww + 240, 10);
  // fairy lights
  c.save();
  c.strokeStyle = 'rgba(120,90,110,0.6)'; c.lineWidth = 2;
  c.beginPath();
  for (let x = x0; x <= x1; x += 10) { const y = 40 + Math.abs(Math.sin((x - x0) / 240 * Math.PI)) * 60; x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.stroke();
  for (let x = x0 + 30; x <= x1; x += 60) {
    const y = 40 + Math.abs(Math.sin((x - x0) / 240 * Math.PI)) * 60 + 8;
    const tw = 0.6 + 0.4 * Math.sin(t * 3 + x * 0.05);
    const col = ['#ffd27a', '#ff9cc0', '#c7b0ff'][((Math.floor(x / 60) % 3) + 3) % 3];
    glowDot(c, x, y, 26, hexA(col, 0.6 * tw));
    c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 5, 7, 0, 0, TAU); c.fill();
  }
  c.restore();
  // framed photo
  c.save(); c.translate(150, 250); c.rotate(-0.04);
  c.shadowColor = 'rgba(120,60,90,0.3)'; c.shadowBlur = 14; c.shadowOffsetY = 6;
  c.fillStyle = '#f5c46b'; rr(c, -80, -70, 160, 140, 8); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  const pg = c.createLinearGradient(0, -56, 0, 56); pg.addColorStop(0, '#ffd6e6'); pg.addColorStop(1, '#c9b6ff');
  c.fillStyle = pg; c.fillRect(-66, -56, 132, 112);
  drawHeart(c, 0, 6, 54, '#ff4f8b', 1, false);
  c.restore();
  // plant
  drawPlant(c, 70, 1000, 1, t);
}
function drawPlant(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const leaves = [[-0.9, 260], [-0.45, 300], [0, 330], [0.45, 290], [0.9, 250], [-0.2, 220], [0.25, 230]];
  leaves.forEach(([a, len], i) => {
    const sw = Math.sin(t * 1.2 + i) * 0.04;
    c.save(); c.translate(0, -110); c.rotate(a * 0.9 + sw);
    c.strokeStyle = '#3e8e5a'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -len * 0.6); c.stroke();
    const lg = c.createLinearGradient(-50, -len, 50, -len * 0.4);
    lg.addColorStop(0, '#7fd39a'); lg.addColorStop(1, '#2f7d4e');
    c.fillStyle = lg;
    c.beginPath(); c.ellipse(0, -len * 0.75, 52, len * 0.3, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -len * 0.48); c.lineTo(0, -len * 1.02); c.stroke();
    c.restore();
  });
  const pg = c.createLinearGradient(-70, 0, 70, 0);
  pg.addColorStop(0, '#f4b9cf'); pg.addColorStop(0.5, '#ffd9e7'); pg.addColorStop(1, '#e79bb8');
  c.fillStyle = pg;
  c.beginPath(); c.moveTo(-75, -120); c.lineTo(75, -120); c.lineTo(58, 0); c.lineTo(-58, 0); c.closePath(); c.fill();
  c.fillStyle = '#f5c46b'; c.fillRect(-78, -128, 156, 14);
  c.restore();
}
function drawSofaRight(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const g = c.createLinearGradient(0, -250, 0, 400);
  g.addColorStop(0, '#d8c6ff'); g.addColorStop(1, '#a98be8');
  c.fillStyle = g;
  rr(c, -420, -250, 840, 800, 110); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 5;
  for (let k = -1; k <= 1; k += 2) { c.beginPath(); c.moveTo(k * 140, -220); c.quadraticCurveTo(k * 150, 0, k * 140, 300); c.stroke(); }
  // cushion
  c.save(); c.translate(-300, -60); c.rotate(-0.2);
  const cg = c.createRadialGradient(-20, -20, 10, 0, 0, 110);
  cg.addColorStop(0, '#ffe0ec'); cg.addColorStop(1, '#ff9ebf');
  c.fillStyle = cg; rr(c, -95, -95, 190, 190, 50); c.fill();
  drawHeart(c, 0, 4, 60, '#ff5f97', 0.8, false);
  c.restore();
  c.restore();
}
function godRays(c, t, x, y, alpha = 1) {
  c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = alpha;
  for (let i = 0; i < 6; i++) {
    const a = 2.1 + i * 0.13 + Math.sin(t * 0.3 + i) * 0.02;
    const g = c.createLinearGradient(x, y, x + Math.cos(a) * 900, y + Math.sin(a) * 900);
    g.addColorStop(0, 'rgba(255,236,200,0.28)'); g.addColorStop(1, 'rgba(255,236,200,0)');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(x, y);
    c.lineTo(x + Math.cos(a - 0.04) * 1000, y + Math.sin(a - 0.04) * 1000);
    c.lineTo(x + Math.cos(a + 0.04) * 1000, y + Math.sin(a + 0.04) * 1000);
    c.fill();
  }
  c.restore();
}
function dustMotes(c, t, x0, x1, col = 'rgba(255,240,210,0.8)', n = 30, seed = 3, hh = 1080) {
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const bx = x0 + R() * (x1 - x0), by = R() * hh, sp = 10 + R() * 25, ph = R() * TAU;
    const x = bx + Math.sin(t * 0.5 + ph) * 30, y = (by - t * sp + hh * 4) % hh;
    glowDot(c, x, y, 3 + R() * 5, col, 0.5 + 0.5 * Math.sin(t * 2 + ph));
  }
}

// ---------------- FLOATING UI ----------------
function card(c, x, y, w, h, o = {}) {
  c.save();
  c.shadowColor = o.shadow || 'rgba(20,10,40,0.35)'; c.shadowBlur = 30; c.shadowOffsetY = 12;
  c.fillStyle = o.fill || '#ffffff';
  rr(c, x, y, w, h, o.r || 24); c.fill();
  c.restore();
}
function thoughtBubble(c, x, y, w, h, lines, a, o = {}) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= clamp(a * 1.5);
  const k = E.outBack(clamp(a));
  c.translate(x, y); c.scale(k, k);
  c.shadowColor = 'rgba(20,10,40,0.3)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
  c.fillStyle = o.fill || '#fff';
  // cloud body
  c.beginPath();
  const bumps = 10;
  for (let i = 0; i <= bumps; i++) {
    const ang = i / bumps * TAU;
    const bx = Math.cos(ang) * w / 2, by = Math.sin(ang) * h / 2;
    c.moveTo(bx + 40, by); c.arc(bx, by, 40, 0, TAU);
  }
  c.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU);
  c.fill();
  // tail dots
  const td = o.tail || [-1, 1];
  [[td[0] * (w * 0.32), td[1] * (h * 0.62), 18], [td[0] * (w * 0.42), td[1] * (h * 0.85), 11]].forEach(([dx, dy, r]) => { c.beginPath(); c.arc(dx, dy, r, 0, TAU); c.fill(); });
  c.shadowColor = 'transparent'; c.shadowBlur = 0;
  lines.forEach((ln, i) => txt(c, ln, 0, (i - (lines.length - 1) / 2) * (o.lh || 40), { size: o.size || 30, color: o.color || BRAND.ink, font: 'Fredoka', weight: 600 }));
  c.restore();
}
function questionMark(c, x, y, s, a, rot) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  txt(c, '?', 0, 0, { size: s, font: 'Fredoka', weight: 700, color: '#ffd166', stroke: '#5a3a8a', sw: s * 0.12, shadow: 'rgba(0,0,0,0.3)', blur: 10 });
  c.restore();
}

// Left (hard way) screens – generic, cluttered
function searchScreen(c, x, y, w, h, u, t) {
  card(c, x, y, w, h, { fill: '#f7f8fb' });
  c.save(); rr(c, x, y, w, h, 24); c.clip();
  c.fillStyle = '#e6e9f2'; c.fillRect(x, y, w, 70);
  txt(c, 'Search', x + 24, y + 36, { size: 24, align: 'left', color: '#4a5a8a', font: 'Fredoka', weight: 600 });
  // search bar
  c.fillStyle = '#fff'; rr(c, x + 16, y + 86, w - 32, 54, 27); c.fill();
  c.strokeStyle = '#cfd5e6'; c.lineWidth = 2; c.stroke();
  const q = 'how to send gift to indonesia';
  const n = Math.floor(clamp(u / 1.1) * q.length);
  txt(c, q.slice(0, n) + (Math.floor(t * 3) % 2 && n < q.length ? '|' : ''), x + 40, y + 113, { size: 17, align: 'left', color: '#333', font: 'Poppins', weight: 400 });
  c.strokeStyle = '#7a8ab8'; c.lineWidth = 3; c.beginPath(); c.arc(x + w - 46, y + 110, 9, 0, TAU); c.moveTo(x + w - 39, y + 117); c.lineTo(x + w - 32, y + 124); c.stroke();
  const res = [['International shipping rules 2026', 'Restrictions, prohibited items, permits...'],
    ['Customs duty calculator – Indonesia', 'Import tax, VAT, handling and clearance fees'],
    ['Find travellers to carry parcels', 'Forum · 312 replies · "anyone going?"'],
    ['Courier rates India → Indonesia', 'Rates vary. Contact for a quote...'],
    ['Documents required for gift parcels', 'Invoice, declaration, ID proof, form...'],
    ['Is it safe to send food abroad?', 'Perishables may be held at customs...']];
  const scroll = Math.max(0, u - 1.4) * 120;
  if (u > 1.2) {
    txt(c, 'About 1,240,000 results', x + 24, y + 166, { size: 14, align: 'left', color: '#8a90a8', weight: 400, alpha: clamp((u - 1.2) * 3) });
    c.save(); c.beginPath(); c.rect(x, y + 180, w, h - 180); c.clip();
    res.concat(res).forEach(([a, b], i) => {
      const ry = y + 200 + i * 92 - scroll;
      const ap = clamp((u - 1.2 - i * 0.12) * 4);
      c.globalAlpha = ap;
      txt(c, a.length > 30 ? a.slice(0, 29) + '…' : a, x + 24, ry, { size: 16, align: 'left', color: '#2a4ad8', weight: 600 });
      txt(c, b.length > 38 ? b.slice(0, 37) + '…' : b, x + 24, ry + 28, { size: 13, align: 'left', color: '#666c80', weight: 400 });
      c.fillStyle = '#e3e6ef'; c.fillRect(x + 24, ry + 54, w - 48, 2);
    });
    c.restore();
  }
  c.restore();
}
function chatScreen(c, x, y, w, h, u, t) {
  card(c, x, y, w, h, { fill: '#eef0f6' });
  c.save(); rr(c, x, y, w, h, 24); c.clip();
  c.fillStyle = '#5b6b9a'; c.fillRect(x, y, w, 80);
  c.fillStyle = '#c9d2f0'; c.beginPath(); c.arc(x + 44, y + 40, 22, 0, TAU); c.fill();
  txt(c, 'Travel Group', x + 78, y + 30, { size: 19, align: 'left', color: '#fff', weight: 600 });
  txt(c, 'India → Indonesia · 248 members', x + 78, y + 54, { size: 13, align: 'left', color: '#dfe5ff', weight: 400 });
  const msgs = [
    ['me', 'Anyone flying to Indonesia this week?', 0.2],
    ['me', 'Can you carry a small gift? Please!', 0.9],
    ['them', 'Sorry bro, my bag is already full', 1.5],
    ['me', 'Anyone else?? Will pay!', 2.1],
    ['me', 'Hello???', 2.6],
  ];
  let yy = y + 110;
  msgs.forEach(([who, s, at]) => {
    const a = clamp((u - at) * 5);
    if (a <= 0) return;
    c.save(); c.font = '400 15px Poppins';
    const tw = Math.min(c.measureText(s).width + 32, w - 70);
    const bx = who === 'me' ? x + w - 18 - tw : x + 18;
    c.globalAlpha = a;
    c.translate(0, (1 - a) * 20);
    c.fillStyle = who === 'me' ? '#d6f5c8' : '#ffffff';
    c.shadowColor = 'rgba(0,0,0,0.08)'; c.shadowBlur = 4; c.shadowOffsetY = 2;
    rr(c, bx, yy, tw, 46, 16); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    txt(c, s, bx + 16, yy + 23, { size: 15, align: 'left', color: '#2a2a2a', weight: 400 });
    if (who === 'me') txt(c, 'Seen', bx + tw - 4, yy + 60, { size: 12, align: 'right', color: '#8a90a8', weight: 400 });
    c.restore();
    yy += who === 'me' ? 78 : 62;
  });
  if (u > 2.9) { // typing dots that vanish
    const a = win(u, 2.9, 3.4, 0.1, 0.15);
    c.globalAlpha = a;
    c.fillStyle = '#fff'; rr(c, x + 18, yy, 70, 38, 16); c.fill();
    for (let k = 0; k < 3; k++) { c.fillStyle = '#9aa0b8'; c.beginPath(); c.arc(x + 38 + k * 15, yy + 19 + Math.sin(t * 10 + k) * 3, 4.5, 0, TAU); c.fill(); }
    c.globalAlpha = 1;
  }
  c.restore();
}
function quoteScreen(c, x, y, w, h, u, t) {
  card(c, x, y, w, h, { fill: '#ffffff' });
  c.save(); rr(c, x, y, w, h, 24); c.clip();
  c.fillStyle = '#41507e'; c.fillRect(x, y, w, 80);
  txt(c, 'Express Intl. Courier', x + 24, y + 30, { size: 19, align: 'left', color: '#fff', weight: 600 });
  txt(c, 'Shipping Quote · India → Indonesia', x + 24, y + 56, { size: 13, align: 'left', color: '#dfe5ff', weight: 400 });
  const rows = [['Shipping (express)', '₹6,800'], ['Customs duty', '₹2,150'], ['Import tax / VAT', '₹1,120'], ['Handling & fuel', '₹ 940'], ['Documentation fee', '₹ 650']];
  rows.forEach(([a, b], i) => {
    const ap = clamp((u - 0.2 - i * 0.28) * 5);
    const ry = y + 120 + i * 50;
    c.globalAlpha = ap;
    txt(c, a, x + 24, ry, { size: 16, align: 'left', color: '#333a50', weight: 400 });
    txt(c, b, x + w - 24, ry, { size: 16, align: 'right', color: '#c2334a', weight: 600 });
    c.fillStyle = '#eceef5'; c.fillRect(x + 24, ry + 22, w - 48, 2);
  });
  c.globalAlpha = clamp((u - 1.8) * 4);
  txt(c, 'TOTAL', x + 24, y + 392, { size: 20, align: 'left', color: '#1a1f33', weight: 700 });
  txt(c, '₹11,660', x + w - 24, y + 392, { size: 26, align: 'right', color: '#d61f3c', weight: 700 });
  txt(c, 'Delivery: 7–14 business days', x + 24, y + 432, { size: 14, align: 'left', color: '#666c80', weight: 400 });
  txt(c, 'Food items: not allowed', x + 24, y + 456, { size: 14, align: 'left', color: '#c2334a', weight: 600 });
  c.globalAlpha = 1;
  // stamp
  const sp = clamp((u - 2.3) * 5);
  if (sp > 0) {
    c.save(); c.translate(x + w / 2 + 30, y + 250); c.rotate(-0.25); const k = 1 + (1 - E.out(sp)) * 1.5; c.scale(k, k);
    c.globalAlpha = sp * 0.85;
    c.strokeStyle = '#e0283f'; c.lineWidth = 6; rr(c, -120, -36, 240, 72, 10); c.stroke();
    txt(c, 'DOCUMENTS', 0, -10, { size: 26, color: '#e0283f', font: 'Fredoka', weight: 700 });
    txt(c, 'REQUIRED', 0, 20, { size: 22, color: '#e0283f', font: 'Fredoka', weight: 700 });
    c.restore();
  }
  c.restore();
}
function bill(c, x, y, r, s, label, amt) {
  c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
  c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
  c.fillStyle = '#fffdf6';
  c.beginPath(); c.moveTo(-60, -80); c.lineTo(60, -80); c.lineTo(60, 70);
  for (let i = 0; i < 6; i++) c.lineTo(60 - i * 20 - 10, i % 2 ? 70 : 80);
  c.lineTo(-60, 70); c.closePath(); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  txt(c, label, 0, -55, { size: 14, color: '#555', weight: 700 });
  c.fillStyle = '#ddd'; for (let i = 0; i < 4; i++) c.fillRect(-44, -32 + i * 16, 88 - (i % 2) * 24, 5);
  txt(c, amt, 0, 48, { size: 20, color: '#d61f3c', weight: 700 });
  c.restore();
}
function formSheet(c, x, y, r, s, title) {
  c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s);
  c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
  c.fillStyle = '#ffffff'; c.fillRect(-70, -95, 140, 190); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.fillStyle = '#e24a5a'; c.fillRect(-70, -95, 140, 26);
  txt(c, title, 0, -82, { size: 12, color: '#fff', weight: 700 });
  c.strokeStyle = '#c9cdd9'; c.lineWidth = 2;
  for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-56, -50 + i * 18); c.lineTo(56, -50 + i * 18); c.stroke(); }
  for (let i = 0; i < 3; i++) { c.strokeRect(-56, -54 + i * 36, 10, 10); }
  c.restore();
}
function msgBadge(c, x, y, s, a, txtS) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 10;
  c.fillStyle = '#ffffff'; rr(c, -80, -26, 160, 52, 26); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.fillStyle = '#7a86b0'; c.beginPath(); c.moveTo(-60, 20); c.lineTo(-70, 40); c.lineTo(-44, 24); c.fill();
  txt(c, txtS, 0, 1, { size: 17, color: '#4a5378', weight: 600 });
  c.restore();
}

// ---------------- AiiDell PHONE (right side) ----------------
function phoneFrame(c, x, y, w, h, scale, drawScreen) {
  c.save(); c.translate(x, y); c.scale(scale, scale);
  c.shadowColor = 'rgba(120,40,110,0.4)'; c.shadowBlur = 50; c.shadowOffsetY = 20;
  const fg = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  fg.addColorStop(0, '#fbe3d6'); fg.addColorStop(0.5, '#e7b9a5'); fg.addColorStop(1, '#f6d6c6');
  c.fillStyle = fg;
  rr(c, -w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 62); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.fillStyle = '#111'; rr(c, -w / 2 - 6, -h / 2 - 6, w + 12, h + 12, 56); c.fill();
  c.save(); rr(c, -w / 2, -h / 2, w, h, 50); c.clip();
  c.translate(-w / 2, -h / 2);
  drawScreen(c, w, h);
  c.restore();
  // dynamic island
  c.fillStyle = '#000'; rr(c, -60, -h / 2 + 14, 120, 32, 16); c.fill();
  // glass reflection
  c.save(); rr(c, -w / 2, -h / 2, w, h, 50); c.clip();
  const gl = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gl.addColorStop(0, 'rgba(255,255,255,0.12)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(255,255,255,0.05)');
  c.fillStyle = gl; c.fillRect(-w / 2, -h / 2, w, h);
  c.restore();
  c.restore();
}
function tapRipple(c, x, y, p) {
  if (p <= 0 || p >= 1) return;
  c.save();
  c.strokeStyle = `rgba(255,95,151,${1 - p})`; c.lineWidth = 4;
  c.beginPath(); c.arc(x, y, 10 + p * 50, 0, TAU); c.stroke();
  c.fillStyle = `rgba(255,95,151,${0.3 * (1 - p)})`; c.beginPath(); c.arc(x, y, 10 + p * 30, 0, TAU); c.fill();
  c.restore();
}
function fingerCursor(c, x, y, press = 0, a = 1) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(1 - press * 0.12, 1 - press * 0.12);
  c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
  c.fillStyle = 'rgba(255,255,255,0.95)';
  c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.strokeStyle = '#ff5f97'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.stroke();
  c.restore();
}
function addressBar(c, w, s, cur) {
  c.fillStyle = '#f3eef8'; rr(c, 18, 58, w - 36, 44, 22); c.fill();
  c.fillStyle = '#7bd389'; c.beginPath(); c.arc(42, 80, 6, 0, TAU); c.fill(); // lock
  txt(c, s + (cur ? '|' : ''), 58, 81, { size: 16, align: 'left', color: '#3a2f5a', weight: 600 });
}
function siteHeader(c, w, cart = 0, bump = 0) {
  c.fillStyle = '#fff'; c.fillRect(0, 110, w, 64);
  drawLogoIcon(c, 40, 142, 0.34);
  txt(c, 'AiiDell', 64, 143, { size: 24, align: 'left', font: 'Fredoka', weight: 700, color: '#ff4f8b' });
  // cart icon
  c.save(); c.translate(w - 44, 142); const k = 1 + bump * 0.35; c.scale(k, k);
  c.strokeStyle = '#3a2f5a'; c.lineWidth = 3; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-16, -12); c.lineTo(-10, -12); c.lineTo(-5, 8); c.lineTo(14, 8); c.lineTo(17, -6); c.lineTo(-8, -6); c.stroke();
  c.fillStyle = '#3a2f5a'; c.beginPath(); c.arc(-2, 14, 3, 0, TAU); c.arc(11, 14, 3, 0, TAU); c.fill();
  if (cart > 0) { c.fillStyle = '#ff4f8b'; c.beginPath(); c.arc(14, -14, 10, 0, TAU); c.fill(); txt(c, String(cart), 14, -13, { size: 13, color: '#fff', weight: 700 }); }
  c.restore();
}
function idFlag(c, x, y, w) {
  c.save(); c.fillStyle = '#e8112d'; rr(c, x, y, w, w * 0.33, 3); c.fill();
  c.fillStyle = '#fff'; c.fillRect(x, y + w * 0.33, w, w * 0.33);
  c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = 1; c.strokeRect(x, y, w, w * 0.66);
  c.restore();
}
function inFlag(c, x, y, w) {
  c.save();
  c.fillStyle = '#ff9933'; c.fillRect(x, y, w, w * 0.22);
  c.fillStyle = '#fff'; c.fillRect(x, y + w * 0.22, w, w * 0.22);
  c.fillStyle = '#138808'; c.fillRect(x, y + w * 0.44, w, w * 0.22);
  c.strokeStyle = '#000080'; c.lineWidth = 1; c.beginPath(); c.arc(x + w / 2, y + w * 0.33, w * 0.08, 0, TAU); c.stroke();
  c.restore();
}

function aiiScreen(c, w, h, u, t) {
  // u: seconds since phone appeared
  const bg = c.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#fff7fb'); bg.addColorStop(1, '#f6efff');
  c.fillStyle = bg; c.fillRect(0, 0, w, h);
  // status bar
  txt(c, '9:41', 40, 30, { size: 15, align: 'left', color: '#222', weight: 600 });
  c.fillStyle = '#222'; rr(c, w - 62, 22, 30, 14, 4); c.fill();
  const url = 'www.aiidell.com';
  if (u < 1.6) {
    const n = Math.floor(clamp((u - 0.25) / 1.0) * url.length);
    addressBar(c, w, url.slice(0, n), Math.floor(t * 3) % 2 === 0);
    // blank page + keyboard
    c.fillStyle = '#d9d3e3'; c.fillRect(0, h - 290, w, 290);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 9 - r; k++) {
      const kx = 14 + r * 20 + k * 41, ky = h - 270 + r * 62;
      const pressed = (Math.floor(u * 12) % 23) === (r * 9 + k) % 23 && u < 1.25;
      c.fillStyle = pressed ? '#ffb6cf' : '#fff'; rr(c, kx, ky, 35, 50, 7); c.fill();
    }
    c.fillStyle = '#ff5f97'; rr(c, w - 110, h - 84, 96, 50, 10); c.fill();
    txt(c, 'Go', w - 62, h - 59, { size: 18, color: '#fff', weight: 700 });
    if (u > 1.3) tapRipple(c, w - 62, h - 59, (u - 1.3) / 0.35);
    return;
  }
  addressBar(c, w, url, false);
  // ---- page states ----
  const cart = u > 5.3 ? 1 : 0;
  const bump = Math.max(0, Math.sin(clamp((u - 5.3) / 0.35) * Math.PI));
  if (u < 3.6) { // HOME
    const load = clamp((u - 1.6) / 0.45);
    c.fillStyle = '#ff5f97'; c.fillRect(0, 106, w * load, 4);
    c.globalAlpha = E.out(clamp((u - 1.8) / 0.4));
    siteHeader(c, w, cart, bump);
    const sc = Math.max(0, u - 2.5) * 50;
    c.save(); c.translate(0, -Math.min(sc, 50));
    // hero
    const hg = brandGrad(c, 0, 190, w, 360);
    c.fillStyle = hg; rr(c, 16, 190, w - 32, 170, 22); c.fill();
    txt(c, 'Send love to', 36, 236, { size: 20, align: 'left', color: '#fff', weight: 400 });
    txt(c, 'Indonesia', 36, 268, { size: 32, align: 'left', color: '#fff', font: 'Fredoka', weight: 700 });
    idFlag(c, 196, 254, 34);
    c.fillStyle = '#fff'; rr(c, 36, 300, 118, 36, 18); c.fill();
    txt(c, 'Shop gifts', 95, 318, { size: 14, color: '#ff4f8b', weight: 700 });
    drawGiftBox(c, w - 86, 300, 0.42, t);
    for (let k = 0; k < 4; k++) sparkle(c, w - 150 + k * 30, 220 + (k % 2) * 30, 6, '#fff', 0.5 + 0.5 * Math.sin(t * 4 + k));
    // chips
    const chips = ['Flowers', 'Gifts', 'Food', 'Snacks', 'Cakes'];
    let cx = 16;
    c.font = '600 13px Poppins';
    chips.forEach((ch, i) => { const cw = c.measureText(ch).width + 26; c.fillStyle = i === 0 ? '#ff5f97' : '#fff'; rr(c, cx, 378, cw, 32, 16); c.fill(); txt(c, ch, cx + cw / 2, 394, { size: 13, color: i === 0 ? '#fff' : '#5a4a7a', weight: 600 }); cx += cw + 8; });
    // grid
    const items = [['Blush Roses', '₹1,999', drawBouquet], ['Choco Cake', '₹1,499', drawCake], ['Gift Hamper', '₹2,299', drawGiftBox], ['Indian Sweets', '₹899', drawSnacks]];
    items.forEach(([name, price, fn], i) => {
      const gx = 16 + (i % 2) * ((w - 44) / 2 + 12), gy = 428 + Math.floor(i / 2) * 210, gw = (w - 44) / 2;
      const ap = E.outBack(clamp((u - 1.9 - i * 0.1) / 0.4));
      c.save(); c.translate(gx + gw / 2, gy + 95); c.scale(ap, ap); c.translate(-(gx + gw / 2), -(gy + 95));
      c.shadowColor = 'rgba(140,80,160,0.18)'; c.shadowBlur = 12; c.shadowOffsetY = 4;
      c.fillStyle = '#fff'; rr(c, gx, gy, gw, 196, 18); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
      c.fillStyle = '#fdf0f6'; rr(c, gx + 8, gy + 8, gw - 16, 118, 14); c.fill();
      fn(c, gx + gw / 2, gy + 112, 0.36, t);
      txt(c, name, gx + 12, gy + 148, { size: 14, align: 'left', color: '#2a1f4a', weight: 600 });
      txt(c, price, gx + 12, gy + 174, { size: 15, align: 'left', color: '#ff4f8b', weight: 700 });
      c.restore();
    });
    c.restore();
    c.globalAlpha = 1;
    // finger moves to first card and taps
    const fp = E.inOut(clamp((u - 2.6) / 0.6));
    fingerCursor(c, lerp(w * 0.75, 100, fp), lerp(h * 0.85, 470, fp), u > 3.25 && u < 3.45 ? 1 : 0, clamp((u - 2.5) * 4));
    tapRipple(c, 100, 470, (u - 3.25) / 0.35);
    return;
  }
  siteHeader(c, w, cart, bump);
  if (u < 5.8) { // PRODUCT PAGE
    const sl = E.out(clamp((u - 3.6) / 0.35));
    c.save(); c.translate((1 - sl) * w, 0);
    c.fillStyle = '#fde7f0'; c.fillRect(0, 174, w, 340);
    glowDot(c, w / 2, 350, 180, 'rgba(255,255,255,0.9)');
    drawBouquet(c, w / 2, 470, 0.95, t);
    for (let k = 0; k < 6; k++) sparkle(c, 60 + k * 55, 210 + (k % 3) * 40, 7, '#fff', 0.5 + 0.5 * Math.sin(t * 5 + k * 1.3));
    txt(c, 'Blush Rose Bouquet', 24, 548, { size: 22, align: 'left', color: '#2a1f4a', font: 'Fredoka', weight: 700 });
    txt(c, '12 premium pink roses, hand-tied', 24, 578, { size: 13, align: 'left', color: '#7a6a90', weight: 400 });
    txt(c, '₹1,999', 24, 618, { size: 26, align: 'left', color: '#ff4f8b', weight: 700 });
    c.fillStyle = '#eafaf0'; rr(c, 24, 644, w - 48, 40, 12); c.fill();
    txt(c, 'Delivered anywhere in Indonesia', 44, 664, { size: 13, align: 'left', color: '#2f8a52', weight: 600 });
    const press = u > 4.7 && u < 4.9 ? 1 : 0;
    c.save(); c.translate(w / 2, 740); c.scale(1 - press * 0.05, 1 - press * 0.05);
    c.shadowColor = 'rgba(255,79,139,0.5)'; c.shadowBlur = 18 + Math.sin(t * 6) * 6; c.shadowOffsetY = 6;
    c.fillStyle = brandGrad(c, -150, 0, 150, 0); rr(c, -(w / 2 - 24), -30, w - 48, 60, 30); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    txt(c, 'Add to Cart', 0, 1, { size: 19, color: '#fff', weight: 700 });
    c.restore();
    c.restore();
    const fp = E.inOut(clamp((u - 4.0) / 0.6));
    fingerCursor(c, lerp(w * 0.8, w / 2 + 40, fp), lerp(400, 745, fp), press, clamp((u - 3.9) * 4) * (1 - clamp((u - 5.3) * 4)));
    tapRipple(c, w / 2 + 40, 745, (u - 4.7) / 0.35);
    // fly to cart
    const fl = clamp((u - 4.85) / 0.5);
    if (fl > 0 && fl < 1) {
      const e = E.inOut(fl);
      const fx = lerp(w / 2, w - 44, e), fy = lerp(470, 142, e) - Math.sin(e * Math.PI) * 120;
      drawBouquet(c, fx, fy, lerp(0.5, 0.12, e), t);
      for (let k = 0; k < 5; k++) sparkle(c, fx - (k + 1) * 14 * (1 - e), fy + k * 10, 6 - k, '#ffd27a', 1 - k * 0.18);
    }
    if (u > 5.3) for (let k = 0; k < 6; k++) { const a = k / 6 * TAU, d = clamp((u - 5.3) / 0.4) * 34; sparkle(c, w - 30 + Math.cos(a) * d, 128 + Math.sin(a) * d, 5, '#ff8fb5', 1 - clamp((u - 5.3) / 0.4)); }
    return;
  }
  if (u < 8.5) { // RECIPIENT DETAILS
    const sl = E.out(clamp((u - 5.8) / 0.35));
    c.save(); c.translate((1 - sl) * w, 0);
    txt(c, 'Recipient details', 24, 210, { size: 22, align: 'left', color: '#2a1f4a', font: 'Fredoka', weight: 700 });
    // steps
    ['Cart', 'Details', 'Pay'].forEach((s, i) => { c.fillStyle = i <= 1 ? '#ff5f97' : '#e5dcef'; rr(c, 24 + i * 120, 236, 110, 6, 3); c.fill(); txt(c, s, 24 + i * 120, 258, { size: 12, align: 'left', color: i <= 1 ? '#ff4f8b' : '#a99abd', weight: 600 }); });
    const fields = [['Name', 'Putri', 6.1], ['Country', 'Indonesia', 6.6], ['Delivery date', 'Today', 7.3], ['Gift message', 'Happy Birthday, sayang!', 7.6]];
    fields.forEach(([lab, val, at], i) => {
      const fy = 290 + i * 104;
      txt(c, lab, 24, fy, { size: 13, align: 'left', color: '#7a6a90', weight: 600 });
      const active = u > at && u < at + 0.6;
      c.fillStyle = '#fff'; c.strokeStyle = active ? '#ff5f97' : '#e6dcf0'; c.lineWidth = active ? 3 : 2;
      rr(c, 24, fy + 14, w - 48, 54, 14); c.fill(); c.stroke();
      const n = Math.floor(clamp((u - at) / 0.5) * val.length);
      txt(c, val.slice(0, n) + (active && Math.floor(t * 4) % 2 ? '|' : ''), 42, fy + 42, { size: 17, align: 'left', color: '#2a1f4a', weight: 600 });
      if (i === 1 && n === val.length) idFlag(c, w - 76, fy + 30, 30);
      if (i === 3 && n === val.length) drawHeart(c, w - 60, fy + 44, 20, '#ff4f8b', 1, false);
    });
    const press = u > 8.1 && u < 8.3 ? 1 : 0;
    c.save(); c.translate(w / 2, 740); c.scale(1 - press * 0.05, 1 - press * 0.05);
    c.shadowColor = 'rgba(255,79,139,0.5)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
    c.fillStyle = brandGrad(c, -150, 0, 150, 0); rr(c, -(w / 2 - 24), -30, w - 48, 60, 30); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    txt(c, 'Checkout  ·  ₹1,999', 0, 1, { size: 19, color: '#fff', weight: 700 });
    c.restore();
    c.restore();
    const fp = E.inOut(clamp((u - 7.7) / 0.4));
    fingerCursor(c, lerp(w * 0.8, w / 2, fp), lerp(560, 745, fp), press, clamp((u - 7.6) * 4));
    tapRipple(c, w / 2, 745, (u - 8.1) / 0.35);
    return;
  }
  if (u < 10.2) { // PAYMENT / PROCESSING
    const sl = E.out(clamp((u - 8.5) / 0.35));
    c.save(); c.translate((1 - sl) * w, 0);
    txt(c, 'Secure checkout', 24, 210, { size: 22, align: 'left', color: '#2a1f4a', font: 'Fredoka', weight: 700 });
    c.fillStyle = '#fff'; c.shadowColor = 'rgba(140,80,160,0.15)'; c.shadowBlur = 14; rr(c, 24, 240, w - 48, 220, 18); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    drawBouquet(c, 80, 330, 0.3, t);
    txt(c, 'Blush Rose Bouquet', 130, 290, { size: 15, align: 'left', color: '#2a1f4a', weight: 600 });
    txt(c, 'To: Putri · Indonesia', 130, 316, { size: 13, align: 'left', color: '#7a6a90', weight: 400 });
    c.fillStyle = '#f0e8f7'; c.fillRect(44, 370, w - 88, 2);
    txt(c, 'Delivery', 44, 396, { size: 14, align: 'left', color: '#7a6a90', weight: 400 });
    txt(c, 'Included', w - 44, 396, { size: 14, align: 'right', color: '#2f8a52', weight: 600 });
    txt(c, 'Total', 44, 432, { size: 17, align: 'left', color: '#2a1f4a', weight: 700 });
    txt(c, '₹1,999', w - 44, 432, { size: 20, align: 'right', color: '#ff4f8b', weight: 700 });
    const press = u > 9.1 && u < 9.3 ? 1 : 0;
    c.save(); c.translate(w / 2, 740); c.scale(1 - press * 0.05, 1 - press * 0.05);
    c.shadowColor = 'rgba(255,79,139,0.5)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
    c.fillStyle = brandGrad(c, -150, 0, 150, 0); rr(c, -(w / 2 - 24), -30, w - 48, 60, 30); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    if (u < 9.3) txt(c, 'Place Order', 0, 1, { size: 19, color: '#fff', weight: 700 });
    else { c.strokeStyle = '#fff'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 13, t * 10, t * 10 + 4.4); c.stroke(); }
    c.restore();
    c.restore();
    const fp = E.inOut(clamp((u - 8.7) / 0.4));
    fingerCursor(c, lerp(w * 0.8, w / 2, fp), lerp(560, 745, fp), press, clamp((u - 8.7) * 4) * (1 - clamp((u - 9.4) * 4)));
    tapRipple(c, w / 2, 745, (u - 9.1) / 0.35);
    return;
  }
  // SUCCESS
  const sp = clamp((u - 10.2) / 0.6);
  const sg = c.createLinearGradient(0, 174, 0, h);
  sg.addColorStop(0, '#fff2f8'); sg.addColorStop(1, '#efe6ff');
  c.fillStyle = sg; c.fillRect(0, 174, w, h);
  c.save(); c.translate(w / 2, 380);
  const k = E.outBack(sp);
  c.scale(k, k);
  c.shadowColor = 'rgba(76,201,120,0.6)'; c.shadowBlur = 40;
  const cg = c.createLinearGradient(-80, -80, 80, 80); cg.addColorStop(0, '#6ee7a0'); cg.addColorStop(1, '#2fb36a');
  c.fillStyle = cg; c.beginPath(); c.arc(0, 0, 86, 0, TAU); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  const cp = clamp((u - 10.5) / 0.4);
  c.strokeStyle = '#fff'; c.lineWidth = 16; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-38, 2);
  if (cp < 0.4) c.lineTo(lerp(-38, -10, cp / 0.4), lerp(2, 30, cp / 0.4));
  else { c.lineTo(-10, 30); c.lineTo(lerp(-10, 42, (cp - 0.4) / 0.6), lerp(30, -28, (cp - 0.4) / 0.6)); }
  c.stroke();
  c.restore();
  for (let r = 0; r < 3; r++) { const rp = clamp((u - 10.4 - r * 0.15) / 0.9); if (rp > 0 && rp < 1) { c.strokeStyle = `rgba(76,201,120,${0.5 * (1 - rp)})`; c.lineWidth = 3; c.beginPath(); c.arc(w / 2, 380, 90 + rp * 120, 0, TAU); c.stroke(); } }
  const ta = clamp((u - 10.7) * 3);
  txt(c, 'Order Confirmed!', w / 2, 530, { size: 30, color: '#2a1f4a', font: 'Fredoka', weight: 700, alpha: ta });
  txt(c, 'Your gift is on its way', w / 2, 572, { size: 16, color: '#7a6a90', weight: 400, alpha: ta });
  txt(c, 'to Putri in Indonesia', w / 2, 598, { size: 16, color: '#7a6a90', weight: 400, alpha: ta });
  c.globalAlpha = ta; idFlag(c, w / 2 + 92, 588, 26); c.globalAlpha = 1;
  // confetti
  const R = rng(77);
  for (let i = 0; i < 60; i++) {
    const a = -Math.PI / 2 + (R() - 0.5) * 2.6, v = 300 + R() * 500, ct = Math.max(0, u - 10.3);
    if (ct <= 0) break;
    const px = w / 2 + Math.cos(a) * v * ct, py = 380 + Math.sin(a) * v * ct + 600 * ct * ct;
    const col = ['#ff5f97', '#8b5cf6', '#f5c46b', '#6ee7a0', '#7cc3ff'][i % 5];
    c.save(); c.translate(px, py); c.rotate(ct * 8 + i); c.fillStyle = col; c.globalAlpha = clamp(2.5 - ct);
    c.fillRect(-6, -3, 12, 6); c.restore();
  }
}

// ---------------- PRODUCTS ----------------
function rose(c, x, y, r, col1, col2, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot);
  const g = c.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.1, 0, 0, r);
  g.addColorStop(0, col1); g.addColorStop(1, col2);
  c.fillStyle = g;
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
  c.strokeStyle = hexA('#7a1840', 0.45); c.lineWidth = Math.max(1, r * 0.08); c.lineCap = 'round';
  for (let k = 0; k < 4; k++) {
    const rr_ = r * (0.85 - k * 0.2);
    c.beginPath(); c.arc(0, r * 0.05 * k, rr_, Math.PI * (0.15 + k * 0.4), Math.PI * (1.15 + k * 0.4)); c.stroke();
  }
  c.fillStyle = hexA('#ffffff', 0.3); c.beginPath(); c.ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.15, -0.6, 0, TAU); c.fill();
  c.restore();
}
function drawBouquet(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  // leaves
  [[-120, -230, -0.9], [120, -230, 0.9], [-80, -300, -0.4], [90, -300, 0.4], [0, -330, 0]].forEach(([lx, ly, a]) => {
    c.save(); c.translate(lx * 0.8, ly * 0.8 + 40); c.rotate(a);
    const lg = c.createLinearGradient(0, -60, 0, 60); lg.addColorStop(0, '#8fdc9f'); lg.addColorStop(1, '#2d7a4a');
    c.fillStyle = lg; c.beginPath(); c.ellipse(0, -30, 24, 62, 0, 0, TAU); c.fill(); c.restore();
  });
  // roses
  const pts = [[-70, -250], [0, -275], [70, -250], [-105, -185], [-35, -200], [35, -200], [105, -185], [-60, -135], [10, -140], [75, -130]];
  pts.forEach(([px, py], i) => rose(c, px, py + Math.sin(t * 1.5 + i) * 1.5, 42, i % 3 === 0 ? '#ffd0e0' : '#ff9cbd', i % 3 === 0 ? '#f06a99' : '#d93a74', i));
  // baby's breath
  const R = rng(11);
  for (let i = 0; i < 40; i++) { c.fillStyle = '#ffffff'; c.beginPath(); c.arc((R() - 0.5) * 260, -300 + R() * 200, 3 + R() * 3, 0, TAU); c.fill(); }
  // wrapping
  const wg = c.createLinearGradient(-150, 0, 150, 0);
  wg.addColorStop(0, '#f6c9dc'); wg.addColorStop(0.5, '#fff1f7'); wg.addColorStop(1, '#eab0c8');
  c.fillStyle = wg;
  c.beginPath(); c.moveTo(-160, -150); c.lineTo(160, -150); c.lineTo(36, 110); c.lineTo(-36, 110); c.closePath(); c.fill();
  c.fillStyle = '#ffffff'; c.globalAlpha = 0.6;
  c.beginPath(); c.moveTo(-160, -150); c.lineTo(-40, -150); c.lineTo(-18, 110); c.lineTo(-36, 110); c.closePath(); c.fill();
  c.globalAlpha = 1;
  // ribbon bow
  c.fillStyle = '#ff4f8b';
  c.fillRect(-42, 10, 84, 22);
  c.beginPath(); c.ellipse(-34, 18, 30, 16, -0.3, 0, TAU); c.ellipse(34, 18, 30, 16, 0.3, 0, TAU); c.fill();
  c.beginPath(); c.moveTo(-10, 28); c.lineTo(-30, 90); c.lineTo(-14, 84); c.lineTo(0, 30); c.moveTo(10, 28); c.lineTo(30, 90); c.lineTo(14, 84); c.lineTo(0, 30); c.fill();
  c.fillStyle = '#ff8fb5'; c.beginPath(); c.arc(0, 21, 12, 0, TAU); c.fill();
  c.restore();
}
function drawGiftBox(c, x, y, s, t = 0, lidOpen = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  groundShadow(c, 0, 4, 150, 26, 0.3);
  // front & side faces
  const fg = c.createLinearGradient(-120, -180, 60, 0); fg.addColorStop(0, '#ff8fb5'); fg.addColorStop(1, '#e8457e');
  c.fillStyle = fg; c.beginPath(); c.moveTo(-120, -160); c.lineTo(40, -160); c.lineTo(40, 0); c.lineTo(-120, 0); c.closePath(); c.fill();
  const sg = c.createLinearGradient(40, -180, 120, 0); sg.addColorStop(0, '#d93a74'); sg.addColorStop(1, '#a92359');
  c.fillStyle = sg; c.beginPath(); c.moveTo(40, -160); c.lineTo(110, -195); c.lineTo(110, -35); c.lineTo(40, 0); c.closePath(); c.fill();
  // gold pattern dots
  c.fillStyle = 'rgba(255,220,150,0.35)';
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { c.beginPath(); c.arc(-100 + i * 34, -140 + j * 38, 4, 0, TAU); c.fill(); }
  // ribbons
  c.fillStyle = '#f5c46b';
  c.fillRect(-52, -160, 26, 160);
  c.beginPath(); c.moveTo(40, -92); c.lineTo(110, -127); c.lineTo(110, -105); c.lineTo(40, -70); c.fill();
  // lid
  c.save();
  c.translate(-120, -160); c.rotate(-lidOpen * 0.95); c.translate(120 - lidOpen * 70, 160 - lidOpen * 20);
  const lg = c.createLinearGradient(0, -230, 0, -160); lg.addColorStop(0, '#ffb3cf'); lg.addColorStop(1, '#ff6f9f');
  c.fillStyle = lg; c.beginPath(); c.moveTo(-132, -160); c.lineTo(48, -160); c.lineTo(122, -197); c.lineTo(-58, -197); c.closePath(); c.fill();
  c.fillStyle = '#ff5f97'; c.fillRect(-132, -160, 180, 22);
  c.fillStyle = '#e8457e'; c.beginPath(); c.moveTo(48, -160); c.lineTo(122, -197); c.lineTo(122, -175); c.lineTo(48, -138); c.fill();
  c.fillStyle = '#f5c46b';
  c.beginPath(); c.moveTo(-52, -160); c.lineTo(-26, -160); c.lineTo(48, -197); c.lineTo(22, -197); c.fill();
  c.fillRect(-52, -160, 26, 22);
  // bow
  const bw = 1 + Math.sin(t * 3) * 0.03;
  c.save(); c.translate(-10, -180); c.scale(bw, bw);
  const bg = c.createRadialGradient(0, -20, 4, 0, -10, 60); bg.addColorStop(0, '#ffe7a8'); bg.addColorStop(1, '#e0a63e');
  c.fillStyle = bg;
  c.beginPath(); c.ellipse(-40, -22, 44, 26, -0.5, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(40, -22, 44, 26, 0.5, 0, TAU); c.fill();
  c.fillStyle = '#c98a2a'; c.beginPath(); c.ellipse(-36, -22, 18, 9, -0.5, 0, TAU); c.ellipse(36, -22, 18, 9, 0.5, 0, TAU); c.fill();
  c.fillStyle = '#f5c46b'; c.beginPath(); c.arc(0, -10, 16, 0, TAU); c.fill();
  c.restore();
  c.restore();
  // tag
  c.save(); c.translate(80, -40); c.rotate(0.2 + Math.sin(t * 2) * 0.05);
  c.fillStyle = '#fff'; rr(c, -24, 0, 48, 34, 6); c.fill();
  drawHeart(c, 0, 17, 16, '#ff4f8b', 1, false);
  c.restore();
  c.restore();
}
function drawCake(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  groundShadow(c, 0, 6, 170, 26, 0.3);
  // stand
  c.fillStyle = '#f2e6ff'; c.beginPath(); c.ellipse(0, 0, 170, 26, 0, 0, TAU); c.fill();
  c.fillStyle = '#d9c6f5'; c.fillRect(-20, 0, 40, 30);
  // bottom tier
  const t1 = c.createLinearGradient(-140, 0, 140, 0); t1.addColorStop(0, '#f7b6cf'); t1.addColorStop(0.5, '#ffe1ec'); t1.addColorStop(1, '#ee9dbd');
  c.fillStyle = t1; c.beginPath(); c.moveTo(-140, -10); c.lineTo(-140, -130); c.ellipse(0, -130, 140, 26, 0, Math.PI, 0); c.lineTo(140, -10); c.ellipse(0, -10, 140, 26, 0, 0, Math.PI); c.fill();
  c.fillStyle = '#ffe9f1'; c.beginPath(); c.ellipse(0, -130, 140, 26, 0, 0, TAU); c.fill();
  // chocolate drips on bottom tier
  c.fillStyle = '#7a3e2c';
  c.beginPath(); c.ellipse(0, -130, 140, 26, 0, 0, Math.PI); for (let i = 0; i <= 10; i++) { const dx = 140 - i * 28; c.lineTo(dx, -112 + (i % 2) * 22 + Math.sin(i) * 6); } c.fill();
  // top tier
  const t2 = c.createLinearGradient(-90, 0, 90, 0); t2.addColorStop(0, '#d9c6ff'); t2.addColorStop(0.5, '#f5edff'); t2.addColorStop(1, '#c4abf5');
  c.fillStyle = t2; c.beginPath(); c.moveTo(-92, -140); c.lineTo(-92, -235); c.ellipse(0, -235, 92, 18, 0, Math.PI, 0); c.lineTo(92, -140); c.ellipse(0, -140, 92, 18, 0, 0, Math.PI); c.fill();
  c.fillStyle = '#fbf6ff'; c.beginPath(); c.ellipse(0, -235, 92, 18, 0, 0, TAU); c.fill();
  // rosettes
  for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI; const rx = Math.cos(a) * 136, ry = -130 + Math.sin(a) * -22 * -1; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(rx, -130 + Math.abs(Math.sin(a)) * 22, 12, 0, TAU); c.fill(); }
  for (let i = 0; i < 7; i++) { const rx = -78 + i * 26; c.fillStyle = i % 2 ? '#ff9cbd' : '#ffffff'; c.beginPath(); c.arc(rx, -140 + Math.abs(rx) * 0.05 + 14, 10, 0, TAU); c.fill(); }
  // strawberries
  [[-40, -248], [10, -254], [52, -246]].forEach(([sx, sy]) => {
    const sg = c.createRadialGradient(sx - 5, sy - 6, 2, sx, sy, 18); sg.addColorStop(0, '#ff7a8a'); sg.addColorStop(1, '#c41d3a');
    c.fillStyle = sg; c.beginPath(); c.moveTo(sx, sy + 18); c.bezierCurveTo(sx - 22, sy, sx - 14, sy - 16, sx, sy - 14); c.bezierCurveTo(sx + 14, sy - 16, sx + 22, sy, sx, sy + 18); c.fill();
    c.fillStyle = '#3e9a4a'; c.beginPath(); c.ellipse(sx, sy - 15, 10, 4, 0, 0, TAU); c.fill();
  });
  // candle
  c.fillStyle = '#ffd34d'; rr(c, -7, -320, 14, 70, 4); c.fill();
  c.strokeStyle = '#ff5f97'; c.lineWidth = 3; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-7, -310 + i * 16); c.lineTo(7, -300 + i * 16); c.stroke(); }
  const fl = 1 + Math.sin(t * 18) * 0.08 + Math.sin(t * 7) * 0.05;
  glowDot(c, 0, -340, 50, 'rgba(255,200,90,0.7)');
  c.save(); c.translate(0, -322); c.scale(fl, fl);
  const fg = c.createRadialGradient(0, -14, 2, 0, -12, 18); fg.addColorStop(0, '#fffbe0'); fg.addColorStop(0.5, '#ffcf4a'); fg.addColorStop(1, '#ff7a2a');
  c.fillStyle = fg; c.beginPath(); c.moveTo(0, -36); c.bezierCurveTo(12, -18, 10, -2, 0, 0); c.bezierCurveTo(-10, -2, -12, -18, 0, -36); c.fill();
  c.restore();
  c.restore();
}
function drawSnacks(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  groundShadow(c, 0, 4, 190, 28, 0.3);
  // brass thali
  const pg = c.createRadialGradient(-40, -30, 10, 0, -10, 200); pg.addColorStop(0, '#fff0c2'); pg.addColorStop(0.6, '#e9b85a'); pg.addColorStop(1, '#b07a24');
  c.fillStyle = pg; c.beginPath(); c.ellipse(0, -20, 190, 52, 0, 0, TAU); c.fill();
  c.strokeStyle = '#a06a1a'; c.lineWidth = 4; c.stroke();
  c.fillStyle = '#f6d38a'; c.beginPath(); c.ellipse(0, -26, 160, 40, 0, 0, TAU); c.fill();
  // samosas
  [[-110, -40], [-70, -50]].forEach(([sx, sy], i) => {
    const sg = c.createLinearGradient(sx - 40, sy - 60, sx + 40, sy); sg.addColorStop(0, '#f7c46a'); sg.addColorStop(1, '#c8842e');
    c.fillStyle = sg; c.beginPath(); c.moveTo(sx - 42, sy); c.lineTo(sx, sy - 70); c.lineTo(sx + 42, sy); c.quadraticCurveTo(sx, sy + 10, sx - 42, sy); c.fill();
    c.fillStyle = 'rgba(160,90,30,0.5)'; for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(sx - 20 + (k % 4) * 13, sy - 14 - Math.floor(k / 4) * 18, 2, 0, TAU); c.fill(); }
  });
  // ladoos pyramid
  [[10, -40], [50, -40], [90, -40], [30, -72], [70, -72], [50, -104]].forEach(([lx, ly]) => {
    const lg = c.createRadialGradient(lx - 7, ly - 8, 3, lx, ly, 24); lg.addColorStop(0, '#ffd27a'); lg.addColorStop(1, '#e88a1a');
    c.fillStyle = lg; c.beginPath(); c.arc(lx, ly, 22, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,240,200,0.7)'; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(lx + Math.cos(k * 1.1) * 12, ly + Math.sin(k * 1.7) * 12, 1.6, 0, TAU); c.fill(); }
  });
  // jalebi spirals
  [[130, -48], [-10, -20]].forEach(([jx, jy]) => {
    c.strokeStyle = '#ff9a1f'; c.lineWidth = 9; c.lineCap = 'round';
    c.beginPath(); for (let a = 0; a < 5 * Math.PI; a += 0.2) { const r = 4 + a * 2.6; const px = jx + Math.cos(a) * r, py = jy + Math.sin(a) * r * 0.55; a === 0 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke();
    c.strokeStyle = 'rgba(255,240,180,0.6)'; c.lineWidth = 3; c.stroke();
  });
  // silver leaf sparkles
  for (let k = 0; k < 4; k++) sparkle(c, -60 + k * 50, -110 - (k % 2) * 20, 6, '#ffffff', 0.5 + 0.5 * Math.sin(t * 4 + k));
  c.restore();
}
function drawFood(c, x, y, s, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  groundShadow(c, 0, 4, 180, 28, 0.32);
  // copper handi
  const hg = c.createLinearGradient(-150, 0, 150, 0); hg.addColorStop(0, '#8a3e1e'); hg.addColorStop(0.4, '#e08a4a'); hg.addColorStop(1, '#7a3010');
  c.fillStyle = hg;
  c.beginPath(); c.moveTo(-150, -110); c.bezierCurveTo(-170, -20, -110, 0, 0, 0); c.bezierCurveTo(110, 0, 170, -20, 150, -110); c.closePath(); c.fill();
  c.fillStyle = '#c86a32'; c.beginPath(); c.ellipse(0, -110, 152, 30, 0, 0, TAU); c.fill();
  // rice mound
  const rg = c.createRadialGradient(-30, -170, 10, 0, -130, 150); rg.addColorStop(0, '#fff6dc'); rg.addColorStop(0.6, '#f6d27a'); rg.addColorStop(1, '#e0a440');
  c.fillStyle = rg; c.beginPath(); c.ellipse(0, -112, 138, 24, 0, 0, Math.PI, false); c.bezierCurveTo(-138, -170, -60, -200, 0, -200); c.bezierCurveTo(60, -200, 138, -170, 138, -112); c.fill();
  const R = rng(21);
  for (let i = 0; i < 160; i++) {
    const px = (R() - 0.5) * 250, py = -118 - R() * 76 * (1 - Math.abs(px) / 150);
    c.save(); c.translate(px, py); c.rotate(R() * TAU);
    c.fillStyle = R() > 0.75 ? '#f0a43a' : '#fffaf0'; c.beginPath(); c.ellipse(0, 0, 5.5, 1.8, 0, 0, TAU); c.fill(); c.restore();
  }
  // garnish
  for (let i = 0; i < 10; i++) { c.fillStyle = '#3ea44a'; c.beginPath(); c.ellipse((R() - 0.5) * 200, -140 - R() * 40, 7, 3.5, R() * 3, 0, TAU); c.fill(); }
  for (let i = 0; i < 8; i++) { c.fillStyle = '#8a4a20'; c.beginPath(); c.ellipse((R() - 0.5) * 200, -130 - R() * 50, 6, 2.5, R() * 3, 0, TAU); c.fill(); }
  // egg halves
  [[-50, -150], [60, -145]].forEach(([ex, ey]) => { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, ey, 20, 14, 0, 0, TAU); c.fill(); c.fillStyle = '#ffc93a'; c.beginPath(); c.arc(ex, ey, 8, 0, TAU); c.fill(); });
  // steam
  c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 7; c.lineCap = 'round';
  for (let k = 0; k < 3; k++) {
    const ph = t * 1.2 + k * 2;
    c.globalAlpha = 0.4 + 0.3 * Math.sin(ph);
    c.beginPath();
    for (let j = 0; j < 12; j++) { const py = -210 - j * 14, px = -50 + k * 50 + Math.sin(j * 0.6 + ph) * 12; j ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke();
  }
  c.restore();
}

// ---------------- MAP ----------------
const GEO = {
  india: [[68.2, 23.7], [70, 20.8], [72.8, 19], [73.5, 16], [74.5, 12.8], [76.2, 9.5], [77.5, 8.1], [78.2, 8.9], [79.8, 10.3], [80.3, 13.3], [80.2, 15.8], [82.2, 16.6], [84.8, 19.2], [86.9, 20.8], [87.9, 22], [89, 21.7], [89.8, 22.3], [88.8, 24], [89.9, 25.3], [92, 25], [92.3, 23.7], [93.3, 23.5], [94.6, 25.5], [95.3, 27], [97.2, 28.2], [96, 29.4], [94.5, 29.3], [92, 27.8], [89.6, 26.8], [88.2, 27.8], [85, 28.3], [82, 29.9], [80.2, 30.6], [79, 32.5], [78.7, 34.6], [77.3, 35.6], [75, 37], [73.8, 36.8], [74.5, 34.5], [74.2, 33.3], [75.3, 32.3], [73.8, 30.5], [72, 28.3], [70.5, 27.7], [69.5, 26.3], [70.6, 25.6], [71.1, 24.4], [68.8, 24.3]],
  srilanka: [[79.9, 9.8], [80.9, 9.3], [81.8, 7.5], [81.4, 6.2], [80.3, 6], [79.8, 7.2]],
  sumatra: [[95.3, 5.6], [97.5, 5.2], [100.3, 2.3], [103.8, -0.9], [106, -3.1], [105.9, -5.8], [104.6, -5.9], [102.3, -4], [100.6, -1.7], [99, 0.5], [97.6, 2.2], [96, 3.8]],
  java: [[105.2, -6.8], [106.1, -6], [108.6, -6.7], [110.8, -6.4], [112.6, -6.9], [114.6, -7.8], [114.4, -8.7], [112, -8.4], [110, -8.1], [108.3, -7.8], [106.4, -7.4]],
  borneo: [[109, 1.8], [109.6, 2], [111.2, 2.6], [113, 3.2], [115.5, 5.4], [116.7, 6.9], [117.7, 6], [119.2, 5.3], [118, 4.3], [117.9, 1.8], [119, 0.9], [117.5, 0.2], [116.8, -1.5], [116.2, -4], [114.6, -3.4], [113, -3.1], [111.7, -3], [110.2, -2.9], [110, -1.6], [109, -0.4]],
  sulawesi: [[119.4, -5.5], [120.4, -5.5], [120.4, -3], [121, -2.6], [122.4, -4.7], [123.2, -4.6], [122.2, -3.3], [121.3, -1.9], [123.3, -0.9], [121.2, -1.2], [121, -0.4], [123.5, 0.5], [124.9, 1.5], [124.4, 0.4], [122, 0.4], [120.4, 0.7], [120, 0], [119.8, -1.2], [119, -3.5]],
  papua: [[131, -1.2], [132.4, -0.4], [134.1, -0.9], [134.5, -2.6], [135.5, -3.3], [137.6, -1.5], [141, -2.6], [144.5, -3.8], [146, -5.6], [147.6, -6.1], [147.1, -7.9], [144, -7.7], [142, -9.2], [141, -9.1], [139, -8.1], [138, -8.4], [137.8, -6.5], [135, -4.4], [133.4, -4], [132, -2.8]],
  nusa: [[115.2, -8.3], [116.5, -8.5], [118, -8.4], [120, -8.6], [122.5, -8.4], [124, -8.6], [124, -9], [122, -9], [119, -9], [116.5, -9], [115.2, -8.8]],
  indochina: [[92.5, 21], [94.3, 18.5], [94.5, 16], [97.7, 16.5], [98.4, 12], [98.7, 8.2], [100.2, 6.5], [101.3, 2.9], [103.5, 1.3], [104.2, 1.5], [103.4, 4.5], [102.3, 6.2], [100.5, 8.4], [99.2, 9.2], [99.9, 13.2], [102.5, 12.4], [104.8, 8.7], [106.8, 10.4], [109.2, 11.6], [109.3, 13.4], [108.3, 16.3], [106.5, 18.2], [106.7, 20.4], [108.1, 21.5], [104, 22.8], [101, 21.5], [98.7, 24], [97.5, 27.5], [95.3, 26], [93.4, 23.6]],
};
function mapProj(lon, lat, m) { return [m.x + (lon - m.lon0) / (m.lon1 - m.lon0) * m.w, m.y + (m.lat1 - lat) / (m.lat1 - m.lat0) * m.h]; }
function drawMap(c, m, t, o = {}) {
  // m: {x,y,w,h,lon0,lon1,lat0,lat1}
  c.save();
  // grid dots (ocean)
  c.fillStyle = o.dotCol || 'rgba(255,255,255,0.18)';
  for (let gx = m.x; gx < m.x + m.w; gx += 22) for (let gy = m.y; gy < m.y + m.h; gy += 22) { c.beginPath(); c.arc(gx, gy, 1.6, 0, TAU); c.fill(); }
  const land = (pts, fill, glow, a = 1) => {
    c.save(); c.globalAlpha *= a;
    c.beginPath(); pts.forEach(([lo, la], i) => { const [px, py] = mapProj(lo, la, m); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.closePath();
    if (glow) { c.shadowColor = glow; c.shadowBlur = 30; }
    c.fillStyle = fill; c.fill();
    c.shadowColor = 'transparent'; c.shadowBlur = 0; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.stroke();
    c.restore();
  };
  land(GEO.indochina, o.otherFill || 'rgba(255,255,255,0.25)', null, 0.9);
  const ig = c.createLinearGradient(m.x, m.y, m.x, m.y + m.h * 0.6); ig.addColorStop(0, '#ffb36b'); ig.addColorStop(1, '#ff7aa8');
  land(GEO.india, ig, 'rgba(255,150,120,0.8)');
  land(GEO.srilanka, o.otherFill || 'rgba(255,255,255,0.25)', null);
  const dg = c.createLinearGradient(m.x + m.w * 0.4, 0, m.x + m.w, 0); dg.addColorStop(0, '#ff6f9f'); dg.addColorStop(1, '#a78bfa');
  ['sumatra', 'java', 'borneo', 'sulawesi', 'papua', 'nusa'].forEach(k => land(GEO[k], dg, 'rgba(200,120,255,0.8)'));
  if (o.labels !== false) {
    const [ix, iy] = mapProj(78.5, 22, m), [dx, dy] = mapProj(113.5, -0.5, m);
    txt(c, 'INDIA', ix, iy, { size: o.labelSize || 26, font: 'Fredoka', weight: 700, color: '#fff', shadow: 'rgba(80,20,60,0.6)', blur: 8, ls: 3 });
    txt(c, 'INDONESIA', dx, dy + 10, { size: o.labelSize || 26, font: 'Fredoka', weight: 700, color: '#fff', shadow: 'rgba(80,20,60,0.6)', blur: 8, ls: 3 });
  }
  c.restore();
}
function routePoint(m, p, lift = 0.35) {
  const [ax, ay] = mapProj(77.2, 28.6, m), [bx, by] = mapProj(106.8, -6.2, m);
  const cx = (ax + bx) / 2 + (by - ay) * lift * 0.2, cy = Math.min(ay, by) - Math.abs(bx - ax) * lift;
  const q = 1 - p;
  return [q * q * ax + 2 * q * p * cx + p * p * bx, q * q * ay + 2 * q * p * cy + p * p * by, ax, ay, bx, by, cx, cy];
}
function drawRoute(c, m, p, t, o = {}) {
  if (p <= 0) return;
  const lift = o.lift || 0.35;
  c.save();
  c.lineCap = 'round';
  c.shadowColor = '#ffd27a'; c.shadowBlur = 20;
  c.strokeStyle = 'rgba(255,230,160,0.95)'; c.lineWidth = o.lw || 6;
  c.setLineDash([2, 16]); c.lineDashOffset = -t * 60;
  c.beginPath();
  for (let i = 0; i <= 60; i++) { const q = i / 60 * p; const [x, y] = routePoint(m, q, lift); i ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.stroke();
  c.setLineDash([]);
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = (o.lw || 6) * 0.4; c.stroke();
  c.restore();
  const [ , , ax, ay, bx, by] = routePoint(m, 0, lift);
  // city pins
  [[ax, ay, 'India', p > 0], [bx, by, 'Indonesia', p > 0.97]].forEach(([x, y, n, on], i) => {
    if (!on) return;
    const pulse = (t * 1.2 + i * 0.5) % 1;
    c.strokeStyle = `rgba(255,255,255,${1 - pulse})`; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 8 + pulse * 30, 0, TAU); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill();
    c.fillStyle = BRAND.pink; c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill();
    if (o.cityLabels === true) txt(c, n, x + (i ? 0 : 0), y + (i ? 34 : -26), { size: o.citySize || 20, weight: 600, color: '#fff', shadow: 'rgba(60,20,60,0.7)', blur: 6 });
  });
}
