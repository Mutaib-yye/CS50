// ===== Characters: Disney-inspired stylised 3D-look people drawn with layered gradients =====
const PAL = {
  L: { // Rahul – the hard way: hoodie, messy curls, stubble
    skin: '#b97752', light: '#dca07a', dark: '#87502f', lip: '#8e4a3a',
    hair: '#1c1312', hairHi: '#4a3530', iris: '#5b3518', irisHi: '#b07a3e',
    top: '#5a6a8c', topDark: '#3c4866', topHi: '#7d8fb3', inner: '#d9d3c6',
    phone: '#2b2f3a', style: 'curly', beard: 'stubble', outfit: 'hoodie',
  },
  R: { // Arjun – the AiiDell way: blazer, quiff, groomed beard
    skin: '#c48a5f', light: '#e8b38a', dark: '#94603c', lip: '#9a5143',
    hair: '#17100d', hairHi: '#5a4034', iris: '#4e2c14', irisHi: '#c08a4a',
    top: '#2d3b66', topDark: '#1d2747', topHi: '#4a5c94', inner: '#f6f2fc',
    phone: '#f1c9b5', style: 'quiff', beard: 'full', outfit: 'blazer', accent: '#ff6b9e',
  },
  T: { // AiiDell Indonesia team member
    skin: '#b47a4f', light: '#d9a074', dark: '#83532f', lip: '#8e4a3a',
    hair: '#1a1210', hairHi: '#4a3530', iris: '#4b2b15', irisHi: '#a8763e',
    top: '#ff5f97', topDark: '#d83e78', topHi: '#ff9cc0', inner: '#ffffff',
    phone: '#333', style: 'short', beard: 'none', outfit: 'polo', headset: true,
  },
};
const WPAL = {
  P: { // Putri – the girlfriend in Indonesia
    skin: '#c99068', light: '#ecb995', dark: '#9b6443', lip: '#d4566e',
    hair: '#1b1210', hairHi: '#5b3e33', iris: '#4a2a14', irisHi: '#b5813f',
    top: '#ffb3cf', topDark: '#f08bb0', topHi: '#ffd6e6', flower: true,
  },
  H: { // team member with hijab
    skin: '#c08860', light: '#e4ad86', dark: '#8f5c3a', lip: '#c0566a',
    hair: '#1b1210', hairHi: '#5b3e33', iris: '#4a2a14', irisHi: '#b5813f',
    top: '#ff5f97', topDark: '#d83e78', topHi: '#ff9cc0', hijab: '#b9a4ff', hijabDark: '#8d76e6', headset: true,
  },
};

// mood -> facial parameters
function faceParams(o) {
  const m = Object.assign({ stress: 0, happy: 0, surprise: 0, tired: 0 }, o.mood || {});
  const b = o.blink || 0;
  return {
    open: clamp(0.86 - m.tired * 0.45 + m.surprise * 0.24 - m.happy * 0.08 - b, 0, 1.12),
    squint: clamp(m.happy * 0.5 - m.surprise * 0.4 + (o.extraSquint || 0)),
    raise: m.surprise * 1.1 + m.happy * 0.35 - m.tired * 0.35,
    worry: clamp(m.stress * 1 + m.tired * 0.4),
    smile: clamp(m.happy * 1.05 - m.stress * 0.75 - m.tired * 0.35, -1, 1),
    mopen: clamp(m.surprise * 0.75 + m.happy * 0.32 + m.stress * 0.12, 0, 1),
    mw: 25 + m.happy * 9 + m.surprise * -6,
    blush: clamp(m.happy * 0.9),
    sweat: clamp((m.stress - 0.45) * 2),
    bags: clamp(m.tired * 1 + m.stress * 0.4),
    pupil: 1 + m.surprise * -0.18 + m.happy * 0.1,
  };
}

// --- 2 bone IK: shoulder S, hand Hn, returns elbow
function ik(S, Hn, L1, L2, bendSign) {
  const dx = Hn[0] - S[0], dy = Hn[1] - S[1];
  let d = Math.hypot(dx, dy);
  d = Math.min(d, L1 + L2 - 0.5);
  const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const th = Math.atan2(dy, dx);
  return [S[0] + Math.cos(th + bendSign * a) * L1, S[1] + Math.sin(th + bendSign * a) * L1];
}

function skinGrad(c, P, cx, cy, r) {
  const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r * 1.15);
  g.addColorStop(0, P.light); g.addColorStop(0.55, P.skin); g.addColorStop(1, P.dark);
  return g;
}

// ---------- eyes ----------
function drawEye(c, x, y, side, F, o, P, size = 1, female = false) {
  const rx = 23 * size, ry = 27 * size;
  // socket shadow
  c.save();
  const sock = c.createRadialGradient(x, y, ry * 0.6, x, y, ry + 12);
  sock.addColorStop(0, hexA(P.dark, 0.18 + F.bags * 0.12)); sock.addColorStop(1, hexA(P.dark, 0));
  c.fillStyle = sock;
  c.beginPath(); c.ellipse(x, y + 2, rx + 12, ry + 12, 0, 0, TAU); c.fill();
  c.restore();

  c.save();
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU);
  const sg = c.createRadialGradient(x - 4, y - 6, 2, x, y, ry * 1.1);
  sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.75, '#f3eef4'); sg.addColorStop(1, '#d9cfdc');
  c.fillStyle = sg; c.fill();
  c.clip();
  // iris
  const lx = (o.look ? o.look.x : 0), ly = (o.look ? o.look.y : 0);
  const ix = x + lx * 8 * size, iy = y + ly * 7 * size + 3 * size;
  const ir = 16.5 * size;
  const ig = c.createRadialGradient(ix, iy + ir * 0.35, 1, ix, iy, ir);
  ig.addColorStop(0, P.irisHi); ig.addColorStop(0.55, P.iris); ig.addColorStop(1, '#1a0d06');
  c.fillStyle = ig;
  c.beginPath(); c.ellipse(ix, iy, ir, ir * 1.08, 0, 0, TAU); c.fill();
  // iris fibres
  c.strokeStyle = hexA(P.irisHi, 0.35); c.lineWidth = 1;
  for (let k = 0; k < 14; k++) {
    const a = k / 14 * TAU;
    c.beginPath(); c.moveTo(ix + Math.cos(a) * ir * 0.45, iy + Math.sin(a) * ir * 0.45);
    c.lineTo(ix + Math.cos(a) * ir * 0.85, iy + Math.sin(a) * ir * 0.85); c.stroke();
  }
  // pupil
  c.fillStyle = '#0b0605';
  c.beginPath(); c.ellipse(ix, iy, 7.8 * size * F.pupil, 8.4 * size * F.pupil, 0, 0, TAU); c.fill();
  // top lid shadow on eyeball
  const ls = c.createLinearGradient(0, y - ry, 0, y - ry * 0.25);
  ls.addColorStop(0, 'rgba(60,20,30,0.35)'); ls.addColorStop(1, 'rgba(60,20,30,0)');
  c.fillStyle = ls; c.fillRect(x - rx, y - ry, rx * 2, ry);
  // highlights
  c.fillStyle = '#fff';
  c.beginPath(); c.ellipse(ix - 6 * size, iy - 7 * size, 5.6 * size, 6.4 * size, -0.4, 0, TAU); c.fill();
  c.globalAlpha = 0.85;
  c.beginPath(); c.arc(ix + 6 * size, iy + 6 * size, 2.6 * size, 0, TAU); c.fill();
  c.globalAlpha = 1;

  // upper eyelid (skin) – edge goes from top arc (open) to bottom arc (closed)
  const f = clamp(2 * F.open - 1, -0.92, 1.1);
  const lid = [];
  for (let i = 0; i <= 16; i++) {
    const u = -1 + 2 * i / 16;
    lid.push([x + u * (rx + 1), y - ry * Math.sqrt(Math.max(0, 1 - u * u)) * f]);
  }
  c.fillStyle = o._fg || P.skin;
  c.beginPath(); c.moveTo(x - rx - 4, y - ry - 10);
  c.lineTo(x + rx + 4, y - ry - 10);
  for (let i = lid.length - 1; i >= 0; i--) c.lineTo(lid[i][0], lid[i][1]);
  c.closePath(); c.fill();
  // lower lid (smile squint)
  const sq = F.squint;
  if (sq > 0.01) {
    c.beginPath(); c.moveTo(x - rx - 4, y + ry + 10);
    for (let i = 0; i <= 16; i++) {
      const u = -1 + 2 * i / 16;
      c.lineTo(x + u * (rx + 1), y + ry * Math.sqrt(Math.max(0, 1 - u * u)) * (1 - sq * 1.45));
    }
    c.lineTo(x + rx + 4, y + ry + 10); c.closePath();
    c.fillStyle = o._fg || P.skin; c.fill();
  }
  c.restore();

  // lash line
  c.save();
  c.strokeStyle = '#1a0f0c'; c.lineCap = 'round'; c.lineJoin = 'round';
  c.lineWidth = (female ? 5.5 : 4.2) * size;
  c.beginPath();
  lid.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
  c.stroke();
  // outer corner flick
  const oc = side > 0 ? lid[lid.length - 1] : lid[0];
  c.lineWidth = (female ? 4.5 : 3) * size;
  c.beginPath(); c.moveTo(oc[0], oc[1]);
  c.quadraticCurveTo(oc[0] + side * 7 * size, oc[1] - 3 * size, oc[0] + side * (female ? 13 : 9) * size, oc[1] - (female ? 9 : 5) * size);
  c.stroke();
  if (female && F.open > 0.3) {
    c.lineWidth = 2.6 * size;
    for (let k = 0; k < 3; k++) {
      const p = lid[side > 0 ? 11 + k * 2 : 5 - k * 2];
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + side * (3 + k * 2) * size, p[1] - (6 + k) * size); c.stroke();
    }
  }
  // crease
  c.strokeStyle = hexA(P.dark, 0.55); c.lineWidth = 2 * size;
  c.beginPath(); c.ellipse(x, y - 2, rx + 3, ry + 4, 0, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
  // under-eye bags
  if (F.bags > 0.05) {
    c.strokeStyle = hexA('#5a3a5a', 0.35 * F.bags); c.lineWidth = 2.5 * size;
    c.beginPath(); c.ellipse(x, y + 6, rx - 2, ry - 2, 0, Math.PI * 0.2, Math.PI * 0.8); c.stroke();
  }
  c.restore();
}

function drawBrow(c, side, F, P, base = -214, thick = 1) {
  const yi = base - F.raise * 11 - F.worry * 15;
  const yo = base - F.raise * 9 + F.worry * 9;
  const ya = (yi + yo) / 2 - 7 - F.raise * 4 + F.worry * 2;
  c.save();
  c.fillStyle = P.hair;
  c.beginPath();
  c.moveTo(side * 13, yi + 6 * thick);
  c.lineTo(side * 12, yi - 6 * thick);
  c.quadraticCurveTo(side * 36, ya - 9 * thick, side * 62, yo + 1);
  c.quadraticCurveTo(side * 38, ya + 3 * thick, side * 13, yi + 6 * thick);
  c.closePath(); c.fill();
  c.strokeStyle = hexA(P.hairHi, 0.6); c.lineWidth = 1.2;
  for (let k = 0; k < 6; k++) {
    const u = 0.15 + k * 0.13;
    const px = side * lerp(14, 58, u), py = lerp(yi, yo, u) - 2 - Math.sin(u * Math.PI) * 6;
    c.beginPath(); c.moveTo(px, py + 3); c.lineTo(px + side * 7, py - 3); c.stroke();
  }
  c.restore();
}

function drawMouth(c, F, P, y = -101, beard = false, female = false) {
  const w = F.mw, s = F.smile, op = F.mopen;
  const cy = y - s * 9;
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';
  if (op < 0.07) {
    c.strokeStyle = female ? '#9c3346' : '#5a2a22'; c.lineWidth = 4.5;
    c.beginPath(); c.moveTo(-w, cy);
    c.quadraticCurveTo(0, y + s * 15, w, cy); c.stroke();
    // smile dimples
    if (s > 0.3) {
      c.lineWidth = 2.5; c.strokeStyle = hexA(P.dark, 0.6);
      [-1, 1].forEach(k => { c.beginPath(); c.arc(k * (w + 3), cy + 2, 5, k > 0 ? -1.2 : Math.PI + 1.2 - 0.0, k > 0 ? 0.6 : Math.PI - 0.6, k < 0); c.stroke(); });
    }
    if (female) { // lips
      c.fillStyle = hexA(P.lip, 0.9);
      c.beginPath(); c.moveTo(-w * 0.8, cy + 1); c.quadraticCurveTo(0, y + s * 15 + 11, w * 0.8, cy + 1); c.quadraticCurveTo(0, y + s * 15 + 2, -w * 0.8, cy + 1); c.fill();
    }
  } else {
    const top = y - s * 2 - op * 3;
    const bot = y + 6 + op * 30 + Math.max(s, 0) * 9;
    c.beginPath();
    c.moveTo(-w, cy);
    c.bezierCurveTo(-w * 0.5, top - 2, w * 0.5, top - 2, w, cy);
    c.bezierCurveTo(w * 0.6, bot, -w * 0.6, bot, -w, cy);
    c.closePath();
    c.fillStyle = '#4a1420'; c.fill();
    c.save(); c.clip();
    if (s > -0.2) { // teeth
      c.fillStyle = '#fbf7f2';
      c.beginPath(); c.ellipse(0, top + 2, w * 0.85, 9 + op * 2, 0, 0, TAU); c.fill();
    }
    c.fillStyle = '#e0607a';
    c.beginPath(); c.ellipse(0, bot + 2, w * 0.6, 12 + op * 6, 0, 0, TAU); c.fill();
    c.restore();
    c.strokeStyle = female ? '#a23a50' : '#5a2a22'; c.lineWidth = 3.5;
    c.beginPath();
    c.moveTo(-w, cy);
    c.bezierCurveTo(-w * 0.5, top - 2, w * 0.5, top - 2, w, cy);
    c.bezierCurveTo(w * 0.6, bot, -w * 0.6, bot, -w, cy);
    c.stroke();
    if (female) { c.strokeStyle = hexA(P.lip, 0.8); c.lineWidth = 5; c.beginPath(); c.moveTo(-w * 0.7, bot - 6 + 2); c.quadraticCurveTo(0, bot + 6, w * 0.7, bot - 6 + 2); c.stroke(); }
  }
  // lower lip highlight
  c.fillStyle = hexA(P.light, 0.35);
  c.beginPath(); c.ellipse(0, y + 14 + op * 30, 11, 3.5, 0, 0, TAU); c.fill();
  c.restore();
}

function facePath(c, female = false) {
  c.beginPath();
  if (!female) {
    c.moveTo(0, -288);
    c.bezierCurveTo(72, -288, 102, -244, 102, -186);
    c.bezierCurveTo(102, -122, 88, -82, 58, -58);
    c.bezierCurveTo(32, -38, -32, -38, -58, -58);
    c.bezierCurveTo(-88, -82, -102, -122, -102, -186);
    c.bezierCurveTo(-102, -244, -72, -288, 0, -288);
  } else {
    c.moveTo(0, -286);
    c.bezierCurveTo(70, -286, 98, -242, 98, -188);
    c.bezierCurveTo(98, -130, 82, -88, 50, -62);
    c.bezierCurveTo(26, -44, -26, -44, -50, -62);
    c.bezierCurveTo(-82, -88, -98, -130, -98, -188);
    c.bezierCurveTo(-98, -242, -70, -286, 0, -286);
  }
  c.closePath();
}

function faceShade(c, P) {
  // hairline occlusion
  const ao = c.createLinearGradient(0, -262, 0, -215);
  ao.addColorStop(0, hexA('#2a120c', 0.45)); ao.addColorStop(1, hexA('#2a120c', 0));
  c.fillStyle = ao; c.fillRect(-110, -270, 220, 60);
  // side falloff (roundness)
  [-1, 1].forEach(s => {
    const sg = c.createLinearGradient(s * 102, 0, s * 70, 0);
    sg.addColorStop(0, hexA(P.dark, 0.55)); sg.addColorStop(1, hexA(P.dark, 0));
    c.fillStyle = sg; c.fillRect(s > 0 ? 70 : -105, -290, 35, 260);
  });
  // forehead & cheekbone highlights
  glowDot(c, -18, -236, 46, hexA('#fff1e0', 0.35), 1);
  [-1, 1].forEach(s => glowDot(c, s * 64, -124, 22, hexA('#fff1e0', 0.18), 1));
  // nose bridge highlight
  c.fillStyle = hexA('#fff1e0', 0.25);
  c.beginPath(); c.ellipse(-1, -160, 5, 18, 0, 0, TAU); c.fill();
}

// ---------- hair styles ----------
function hairBack(c, P, style) {
  c.save();
  c.fillStyle = P.hair;
  if (style === 'curly') {
    c.beginPath(); c.ellipse(0, -215, 118, 100, 0, 0, TAU); c.fill();
  } else if (style === 'quiff' || style === 'short') {
    c.beginPath(); c.ellipse(0, -218, 108, 86, 0, 0, TAU); c.fill();
  }
  c.restore();
}
function hairFront(c, P, style, t) {
  c.save();
  if (style === 'curly') {
    const blobs = [];
    const R = rng(42);
    for (let i = 0; i < 17; i++) {
      const a = Math.PI * (1.02 + i / 16 * 0.96);
      const rr_ = 96 + R() * 12;
      blobs.push([Math.cos(a) * rr_, -212 + Math.sin(a) * rr_ * 0.95, 30 + R() * 14]);
    }
    // base cap
    const g = c.createLinearGradient(0, -330, 0, -190);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.35, P.hair); g.addColorStop(1, P.hair);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-104, -175);
    c.bezierCurveTo(-112, -300, 112, -300, 104, -175);
    c.bezierCurveTo(90, -222, 40, -244, 0, -240);
    c.bezierCurveTo(-40, -244, -90, -222, -104, -175);
    c.fill();
    blobs.forEach(([bx, by, br], i) => {
      const sway = Math.sin(t * 1.3 + i) * 1.2;
      const bg = c.createRadialGradient(bx - br * 0.3 + sway, by - br * 0.4, 2, bx, by, br);
      bg.addColorStop(0, P.hairHi); bg.addColorStop(0.6, P.hair); bg.addColorStop(1, '#0d0807');
      c.fillStyle = bg;
      c.beginPath(); c.arc(bx + sway, by, br, 0, TAU); c.fill();
    });
    // fringe curls
    [[-58, -238, 1], [-18, -246, -1], [26, -244, 1], [64, -232, -1]].forEach(([fx, fy, d], i) => {
      const sw = Math.sin(t * 1.7 + i * 2) * 1.5;
      c.fillStyle = P.hair;
      c.beginPath();
      c.moveTo(fx - 18, fy - 14);
      c.quadraticCurveTo(fx + d * 30 + sw, fy - 4, fx + d * 6 + sw, fy + 26);
      c.quadraticCurveTo(fx + d * 14, fy + 4, fx + 18, fy - 14);
      c.fill();
    });
    c.strokeStyle = hexA('#8a6a60', 0.55); c.lineWidth = 2.2; c.lineCap = 'round';
    blobs.forEach(([bx, by, br], i) => { if (i % 2) return; c.beginPath(); c.arc(bx, by, br * 0.6, Math.PI * 1.1, Math.PI * 1.6); c.stroke(); });
    // sideburns
    c.fillStyle = P.hair;
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 103, -200); c.lineTo(s * 92, -200); c.lineTo(s * 94, -150); c.lineTo(s * 101, -150); c.fill(); });
  } else if (style === 'quiff') {
    const g = c.createLinearGradient(-60, -340, 60, -200);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.3, P.hair); g.addColorStop(1, '#0b0706');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-103, -168);
    c.bezierCurveTo(-112, -230, -100, -292, -50, -312);
    c.bezierCurveTo(-10, -332, 40, -352, 82, -322);
    c.bezierCurveTo(110, -300, 112, -260, 104, -230);
    c.lineTo(102, -168);
    c.bezierCurveTo(96, -200, 84, -224, 60, -236);
    c.bezierCurveTo(30, -228, 10, -246, -20, -244);
    c.bezierCurveTo(-60, -240, -90, -220, -103, -168);
    c.fill();
    // sheen strands
    c.lineCap = 'round';
    for (let k = 0; k < 9; k++) {
      c.strokeStyle = hexA('#9a7a6a', 0.18 + (k % 3) * 0.08);
      c.lineWidth = 2 + (k % 2);
      c.beginPath();
      c.moveTo(-80 + k * 8, -230 - k * 2);
      c.bezierCurveTo(-60 + k * 10, -300 - k * 3, 20 + k * 6, -330, 70 + k * 3, -310 + k * 4);
      c.stroke();
    }
    // side fade
    c.fillStyle = hexA(P.hair, 0.55);
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 104, -230); c.lineTo(s * 94, -226); c.lineTo(s * 92, -160); c.lineTo(s * 102, -158); c.fill(); });
  } else if (style === 'short') {
    const g = c.createLinearGradient(0, -320, 0, -200);
    g.addColorStop(0, P.hairHi); g.addColorStop(0.4, P.hair); g.addColorStop(1, P.hair);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-103, -175);
    c.bezierCurveTo(-110, -290, 110, -312, 103, -175);
    c.bezierCurveTo(92, -215, 60, -240, 10, -238);
    c.bezierCurveTo(-30, -236, -80, -226, -103, -175);
    c.fill();
    c.strokeStyle = hexA('#8a6a60', 0.4); c.lineWidth = 2;
    for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(-60 + k * 22, -250); c.quadraticCurveTo(-50 + k * 22, -285, -20 + k * 22, -292); c.stroke(); }
  }
  c.restore();
}

function beardDraw(c, P, kind) {
  if (kind === 'none') return;
  c.save();
  facePath(c); c.clip();
  const full = kind === 'full';
  c.fillStyle = full ? hexA(P.hair, 0.86) : hexA(P.hair, 0.13);
  if (full) { c.shadowColor = P.hair; c.shadowBlur = 6; }
  c.beginPath();
  c.moveTo(-104, -160);
  c.lineTo(-96, -160);
  c.bezierCurveTo(-90, -126, -76, -104, -48, -98);
  c.bezierCurveTo(-30, -84, 30, -84, 48, -98);
  c.bezierCurveTo(76, -104, 90, -126, 96, -160);
  c.lineTo(104, -160);
  c.lineTo(104, -20); c.lineTo(-104, -20);
  c.closePath(); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0;
  // texture
  const R = rng(full ? 7 : 9);
  c.fillStyle = full ? hexA('#6a4a3e', 0.5) : hexA(P.hair, 0.35);
  for (let i = 0; i < (full ? 220 : 380); i++) {
    const x = (R() * 2 - 1) * 100, y = -158 + R() * 118;
    const inCheek = !(Math.abs(x) < 80 && y < -100) && !(Math.abs(x) < 46 && y < -80);
    if (!inCheek) continue;
    if (full) { c.fillRect(x, y, 1.2, 3.5); } else { c.fillRect(x, y, 0.9, 0.9); }
  }
  c.restore();
  // moustache
  c.save();
  c.fillStyle = full ? P.hair : hexA(P.hair, 0.22);
  c.beginPath();
  c.moveTo(-36, -108);
  c.bezierCurveTo(-26, -126, -8, -124, 0, -120);
  c.bezierCurveTo(8, -124, 26, -126, 36, -108);
  c.bezierCurveTo(22, -114, 8, -114, 0, -112);
  c.bezierCurveTo(-8, -114, -22, -114, -36, -108);
  c.fill();
  c.restore();
}

// ---------- torso outfits ----------
function torsoPath(c, wide = 1) {
  c.beginPath();
  c.moveTo(-52, -32);
  c.bezierCurveTo(-95 * wide, -14, -152 * wide, -2, -178 * wide, 40);
  c.bezierCurveTo(-202 * wide, 82, -208 * wide, 260, -214 * wide, 560);
  c.lineTo(214 * wide, 560);
  c.bezierCurveTo(208 * wide, 260, 202 * wide, 82, 178 * wide, 40);
  c.bezierCurveTo(152 * wide, -2, 95 * wide, -14, 52 * wide, -32);
  c.closePath();
}
function drawTorso(c, P, o) {
  const outfit = P.outfit;
  if (outfit === 'hoodie') {
    // hood behind neck
    const hg = c.createLinearGradient(0, -80, 0, 20);
    hg.addColorStop(0, P.topDark); hg.addColorStop(1, P.top);
    c.fillStyle = hg;
    c.beginPath(); c.ellipse(0, -18, 118, 52, 0, 0, TAU); c.fill();
  }
  // neck
  const ng = c.createLinearGradient(-40, 0, 40, 0);
  ng.addColorStop(0, P.dark); ng.addColorStop(0.5, P.skin); ng.addColorStop(1, P.dark);
  c.fillStyle = ng;
  c.beginPath(); c.moveTo(-38, -100); c.lineTo(38, -100); c.lineTo(42, 10); c.lineTo(-42, 10); c.closePath(); c.fill();
  // under-chin shadow
  const cs = c.createLinearGradient(0, -80, 0, -30);
  cs.addColorStop(0, hexA(P.dark, 0.95)); cs.addColorStop(1, hexA(P.dark, 0));
  c.fillStyle = cs; c.fillRect(-42, -90, 84, 60);

  const tg = c.createLinearGradient(-200, 0, 200, 300);
  tg.addColorStop(0, P.topHi); tg.addColorStop(0.35, P.top); tg.addColorStop(1, P.topDark);
  c.fillStyle = tg;
  torsoPath(c); c.fill();

  if (outfit === 'hoodie') {
    c.fillStyle = P.inner;
    c.beginPath(); c.moveTo(-48, -30); c.lineTo(0, 46); c.lineTo(48, -30); c.closePath(); c.fill();
    c.fillStyle = ng;
    c.beginPath(); c.moveTo(-38, -30); c.lineTo(0, 30); c.lineTo(38, -30); c.closePath(); c.fill();
    // hood rim
    c.strokeStyle = P.topDark; c.lineWidth = 16; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-70, -26); c.quadraticCurveTo(0, 70, 70, -26); c.stroke();
    // drawstrings
    c.strokeStyle = '#e8e3da'; c.lineWidth = 5;
    [-1, 1].forEach(s => {
      c.beginPath(); c.moveTo(s * 28, 20); c.quadraticCurveTo(s * 34, 80, s * 30 + Math.sin(o.t * 2 + s) * 3, 150); c.stroke();
      c.fillStyle = '#bcb6aa'; c.fillRect(s * 30 - 4 + Math.sin(o.t * 2 + s) * 3, 148, 8, 16);
    });
    // folds
    c.strokeStyle = hexA(P.topDark, 0.7); c.lineWidth = 4;
    [[-120, 120, -100, 260], [130, 140, 110, 280], [-60, 300, -20, 420]].forEach(([a, b, d, e]) => {
      c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + d) / 2 + 20, (b + e) / 2, d, e); c.stroke();
    });
  } else if (outfit === 'blazer') {
    // shirt
    const sg = c.createLinearGradient(0, -30, 0, 300);
    sg.addColorStop(0, '#ffffff'); sg.addColorStop(1, '#ddd6ee');
    c.fillStyle = sg;
    c.beginPath(); c.moveTo(-62, -30); c.lineTo(62, -30); c.lineTo(20, 560); c.lineTo(-20, 560); c.closePath(); c.fill();
    // open collar skin
    c.fillStyle = ng;
    c.beginPath(); c.moveTo(-34, -32); c.lineTo(0, 50); c.lineTo(34, -32); c.closePath(); c.fill();
    // collar wings
    c.fillStyle = '#fbf9ff'; c.strokeStyle = '#cfc6e2'; c.lineWidth = 2;
    [-1, 1].forEach(s => {
      c.beginPath(); c.moveTo(s * 36, -44); c.lineTo(s * 70, -18); c.lineTo(s * 50, 34); c.lineTo(s * 4, 52); c.closePath(); c.fill(); c.stroke();
    });
    // lapels
    [-1, 1].forEach(s => {
      const lg = c.createLinearGradient(s * 40, 0, s * 120, 200);
      lg.addColorStop(0, P.topHi); lg.addColorStop(1, P.top);
      c.fillStyle = lg;
      c.beginPath(); c.moveTo(s * 64, -26); c.lineTo(s * 108, 60); c.lineTo(s * 84, 92); c.lineTo(s * 100, 120); c.lineTo(s * 24, 330); c.lineTo(s * 58, -20); c.closePath(); c.fill();
      c.strokeStyle = hexA('#0d1430', 0.6); c.lineWidth = 2.5; c.stroke();
    });
    // pocket square
    c.fillStyle = P.accent;
    c.beginPath(); c.moveTo(120, 150); c.lineTo(132, 128); c.lineTo(142, 144); c.lineTo(152, 126); c.lineTo(160, 150); c.closePath(); c.fill();
    c.strokeStyle = hexA('#0d1430', 0.7); c.lineWidth = 3;
    c.beginPath(); c.moveTo(112, 150); c.lineTo(168, 150); c.stroke();
    // buttons
    c.fillStyle = '#c8b8f0';
    [110, 180, 250].forEach(y => { c.beginPath(); c.arc(0, y, 3.5, 0, TAU); c.fill(); });
  } else if (outfit === 'polo') {
    c.fillStyle = ng;
    c.beginPath(); c.moveTo(-30, -30); c.lineTo(0, 30); c.lineTo(30, -30); c.closePath(); c.fill();
    c.fillStyle = '#ffffff';
    [-1, 1].forEach(s => { c.beginPath(); c.moveTo(s * 30, -40); c.lineTo(s * 72, -18); c.lineTo(s * 40, 20); c.lineTo(s * 4, 32); c.closePath(); c.fill(); });
    // logo badge
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-110, 110, 20, 0, TAU); c.fill();
    drawHeart(c, -110, 112, 22, '#ff4f8b', 1, false);
  }
  // shoulder rim light
  if (o.rim) {
    c.save(); torsoPath(c); c.clip();
    const rg = c.createRadialGradient(o.rimSide * 200, 40, 10, o.rimSide * 200, 40, 180);
    rg.addColorStop(0, hexA(o.rim, 0.55)); rg.addColorStop(1, hexA(o.rim, 0));
    c.globalCompositeOperation = 'screen';
    c.fillStyle = rg; c.fillRect(-260, -60, 520, 400);
    c.restore();
  }
}

// ---------- phone (back side, as seen by viewer) ----------
function drawPhoneBack(c, x, y, a, col, glowCol) {
  c.save();
  c.translate(x, y); c.rotate(a);
  c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
  const g = c.createLinearGradient(-50, -95, 50, 95);
  g.addColorStop(0, mixHex(col, '#ffffff', 0.25)); g.addColorStop(1, mixHex(col, '#000000', 0.3));
  c.fillStyle = g;
  rr(c, -52, -98, 104, 196, 20); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.strokeStyle = mixHex(col, '#ffffff', 0.4); c.lineWidth = 2; c.stroke();
  // camera island
  c.fillStyle = mixHex(col, '#000000', 0.25);
  rr(c, -42, -88, 44, 44, 12); c.fill();
  [[-30, -76], [-14, -76], [-30, -58]].forEach(([cx, cy]) => {
    c.fillStyle = '#0c0d12'; c.beginPath(); c.arc(cx, cy, 6.5, 0, TAU); c.fill();
    c.fillStyle = 'rgba(120,160,255,0.6)'; c.beginPath(); c.arc(cx - 2, cy - 2, 2, 0, TAU); c.fill();
  });
  // logo dot
  drawHeart(c, 0, 10, 18, hexA('#ffffff', 0.4), 0.35, false);
  c.restore();
  // screen glow spill upward
  if (glowCol) glowDot(c, x, y - 120, 150, glowCol, 0.25);
}

function drawHand(c, P, x, y, a, side, fist = false) {
  c.save(); c.translate(x, y); c.rotate(a);
  c.fillStyle = skinGrad(c, P, 0, 0, 30);
  if (fist) {
    rr(c, -24, -22, 48, 44, 16); c.fill();
    c.strokeStyle = hexA(P.dark, 0.6); c.lineWidth = 2;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-14 + k * 12, -22); c.lineTo(-14 + k * 12, -8); c.stroke(); }
    c.fillStyle = P.skin; c.beginPath(); c.ellipse(side * -20, 4, 9, 16, side * 0.4, 0, TAU); c.fill();
  } else {
    c.beginPath(); c.ellipse(0, 0, 26, 30, 0, 0, TAU); c.fill();
    // fingers wrapping phone back
    for (let k = 0; k < 4; k++) {
      c.fillStyle = k % 2 ? P.skin : mixHex(P.skin, P.light, 0.3);
      c.beginPath(); c.ellipse(side * -22, -20 + k * 13, 15, 7, 0, 0, TAU); c.fill();
      c.strokeStyle = hexA(P.dark, 0.5); c.lineWidth = 1.5; c.stroke();
    }
  }
  c.restore();
}

function drawArm(c, P, S, Hn, side, sleeveCol, sleeveDark, cuffCol) {
  const El = ik(S, Hn, 240, 148, side > 0 ? -1 : 1);
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = sleeveDark; c.lineWidth = 70;
  c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(El[0], El[1]); c.lineTo(Hn[0], Hn[1]); c.stroke();
  const g = c.createLinearGradient(S[0] - 60, S[1], S[0] + 60, El[1]);
  g.addColorStop(0, mixHex(sleeveCol, '#ffffff', 0.12)); g.addColorStop(1, sleeveCol);
  c.strokeStyle = g; c.lineWidth = 60;
  c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(El[0], El[1]); c.lineTo(Hn[0], Hn[1]); c.stroke();
  // cuff
  const ang = Math.atan2(Hn[1] - El[1], Hn[0] - El[0]);
  const cx = Hn[0] - Math.cos(ang) * 30, cy = Hn[1] - Math.sin(ang) * 30;
  c.strokeStyle = cuffCol; c.lineWidth = 58;
  c.beginPath(); c.moveTo(cx - Math.cos(ang) * 6, cy - Math.sin(ang) * 6); c.lineTo(cx + Math.cos(ang) * 6, cy + Math.sin(ang) * 6); c.stroke();
  c.restore();
  return { El, ang };
}

// ---------- main man ----------
function drawMan(c, o) {
  const P = PAL[o.who];
  const F = faceParams(o);
  const t = o.t;
  c.save();
  c.translate(o.x, o.y);
  c.scale(o.s, o.s);
  const br = Math.sin(t * 2.0 + (o.who === 'L' ? 0 : 1.3)) * 0.012 * (o.breath || 1);
  c.translate(0, o.slump || 0);
  c.save();
  c.translate(0, 560); c.scale(1 + br * 0.4, 1 + br); c.translate(0, -560);
  drawTorso(c, P, o);
  c.restore();

  // head
  const bob = Math.sin(t * 2.0 + 0.6) * 2.5 * (o.breath || 1);
  c.save();
  c.translate(0, -60 + bob - br * 300);
  c.rotate(o.tilt || 0);
  c.translate((o.headX || 0), 60);
  // shadow on neck from head
  hairBack(c, P, P.style);
  // ears
  [-1, 1].forEach(s => {
    c.fillStyle = skinGrad(c, P, s * 100, -168, 30);
    c.beginPath(); c.ellipse(s * 100, -168, 17, 28, s * 0.15, 0, TAU); c.fill();
    c.strokeStyle = hexA(P.dark, 0.6); c.lineWidth = 3;
    c.beginPath(); c.ellipse(s * 101, -168, 8, 16, s * 0.15, s > 0 ? -1.2 : Math.PI - 1.9, s > 0 ? 1.9 : Math.PI + 1.2); c.stroke();
  });
  if (P.headset) {
    c.fillStyle = '#2b2b38';
    c.beginPath(); c.ellipse(-104, -168, 18, 26, 0, 0, TAU); c.fill();
    c.strokeStyle = '#2b2b38'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(-104, -150); c.quadraticCurveTo(-90, -100, -40, -96); c.stroke();
    c.fillStyle = '#ff5f97'; c.beginPath(); c.arc(-38, -96, 6, 0, TAU); c.fill();
  }
  // face
  facePath(c);
  o._fg = skinGrad(c, P, -10, -190, 150);
  c.fillStyle = o._fg;
  c.fill();
  c.save();
  facePath(c); c.clip();
  // cheek warmth
  [-1, 1].forEach(s => glowDot(c, s * 60, -128, 40, hexA('#e0706a', 0.25 + F.blush * 0.5), 1));
  // jaw shadow
  const jg = c.createLinearGradient(0, -110, 0, -40);
  jg.addColorStop(0, hexA(P.dark, 0)); jg.addColorStop(1, hexA(P.dark, 0.5));
  c.fillStyle = jg; c.fillRect(-110, -110, 220, 80);
  faceShade(c, P);
  // rim / screen light
  if (o.rim) {
    c.globalCompositeOperation = 'screen';
    const rg = c.createRadialGradient(o.rimSide * 150, -190, 20, o.rimSide * 150, -190, 120);
    rg.addColorStop(0, hexA(o.rim, 0.65)); rg.addColorStop(1, hexA(o.rim, 0));
    c.fillStyle = rg; c.fillRect(-110, -300, 220, 280);
  }
  if (o.screenGlow) {
    c.globalCompositeOperation = 'screen';
    const sgl = c.createLinearGradient(0, -40, 0, -200);
    sgl.addColorStop(0, hexA(o.screenGlow, 0.45)); sgl.addColorStop(1, hexA(o.screenGlow, 0));
    c.fillStyle = sgl; c.fillRect(-110, -220, 220, 200);
  }
  c.restore();

  beardDraw(c, P, P.beard);
  // nose
  c.save();
  c.strokeStyle = hexA(P.dark, 0.7); c.lineWidth = 3.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-6, -176); c.quadraticCurveTo(-12, -150, -10, -138); c.stroke();
  c.fillStyle = hexA(P.dark, 0.45);
  c.beginPath(); c.ellipse(0, -132, 17, 9, 0, 0, TAU); c.fill();
  c.fillStyle = skinGrad(c, P, 0, -140, 20);
  c.beginPath(); c.ellipse(0, -138, 14, 11, 0, 0, TAU); c.fill();
  c.fillStyle = hexA(P.light, 0.8); c.beginPath(); c.ellipse(-3, -143, 5, 3.5, 0, 0, TAU); c.fill();
  c.fillStyle = hexA('#3a1a12', 0.6);
  [-1, 1].forEach(s => { c.beginPath(); c.ellipse(s * 9, -131, 4.5, 2.5, s * 0.4, 0, TAU); c.fill(); });
  c.restore();

  drawMouth(c, F, P, -101, P.beard === 'full');
  drawEye(c, -42, -172, -1, F, o, P);
  drawEye(c, 42, -172, 1, F, o, P);
  drawBrow(c, -1, F, P);
  drawBrow(c, 1, F, P);
  hairFront(c, P, P.style, t);

  // sweat drops
  if (F.sweat > 0) {
    const sy = ((t * 0.8) % 1);
    c.save();
    c.globalAlpha = F.sweat * (1 - sy * 0.6);
    const sx = 92, syy = -250 + sy * 70;
    const g = c.createLinearGradient(sx - 8, syy - 14, sx + 8, syy + 12);
    g.addColorStop(0, '#e9f7ff'); g.addColorStop(1, '#7cc3ff');
    c.fillStyle = g;
    c.beginPath(); c.moveTo(sx, syy - 18); c.quadraticCurveTo(sx + 12, syy, sx, syy + 10); c.quadraticCurveTo(sx - 12, syy, sx, syy - 18); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(sx - 3, syy + 1, 2.5, 0, TAU); c.fill();
    // second drop
    const sy2 = ((t * 0.8 + 0.5) % 1);
    c.globalAlpha = F.sweat * (1 - sy2 * 0.6);
    const s2x = -96, s2y = -232 + sy2 * 60;
    c.fillStyle = g;
    c.beginPath(); c.moveTo(s2x, s2y - 14); c.quadraticCurveTo(s2x + 9, s2y, s2x, s2y + 8); c.quadraticCurveTo(s2x - 9, s2y, s2x, s2y - 14); c.fill();
    c.restore();
    // stress lines
    c.save(); c.strokeStyle = hexA('#7a6aa8', 0.5 * F.sweat); c.lineWidth = 3;
    for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-30 + k * 22, -270); c.lineTo(-26 + k * 22, -250); c.stroke(); }
    c.restore();
  }
  c.restore(); // head

  // arms & phone – always well below the chin (no arm crosses the face)
  const pose = o.pose || {};
  const phoneY = pose.phoneY !== undefined ? pose.phoneY : 215;
  const phoneX = pose.phoneX || 0;
  const phoneA = pose.phoneA || 0;
  const sleeve = P.outfit === 'blazer' ? P.top : P.top;
  const cuff = P.outfit === 'blazer' ? '#f4f0fb' : (P.outfit === 'polo' ? P.topDark : P.topDark);
  const lh = pose.lh || [phoneX - 52, phoneY + 18];
  const rh = pose.rh || [phoneX + 52, phoneY + 18];
  const LA = drawArm(c, P, [-160, 60], lh, -1, sleeve, P.topDark, cuff);
  const RA = drawArm(c, P, [160, 60], rh, 1, sleeve, P.topDark, cuff);
  if (pose.phone !== false) drawPhoneBack(c, phoneX, phoneY, phoneA, P.phone, o.screenGlow);
  if (pose.prop) pose.prop(c);
  drawHand(c, P, lh[0], lh[1], 0.1, -1, pose.lFist);
  drawHand(c, P, rh[0], rh[1], -0.1, 1, pose.rFist);
  if (P.outfit === 'blazer') { // smart watch
    c.save(); c.translate(lh[0] + 4, lh[1] + 30); c.fillStyle = '#20222c'; rr(c, -16, -10, 32, 22, 6); c.fill();
    c.fillStyle = '#ff7fae'; rr(c, -11, -6, 22, 14, 4); c.fill(); c.restore();
  }
  c.restore();
}

// ---------- woman ----------
function drawWoman(c, o) {
  const P = WPAL[o.who];
  const F = faceParams(o);
  F.mw *= 0.85;
  const t = o.t;
  c.save();
  c.translate(o.x, o.y);
  c.scale(o.s, o.s);
  const br = Math.sin(t * 2.1) * 0.01;
  // back hair
  if (!P.hijab) {
    const hg = c.createLinearGradient(0, -300, 0, 300);
    hg.addColorStop(0, P.hairHi); hg.addColorStop(0.3, P.hair); hg.addColorStop(1, '#0b0605');
    c.fillStyle = hg;
    const sw = Math.sin(t * 1.4) * 6;
    c.beginPath();
    c.moveTo(-108, -200);
    c.bezierCurveTo(-140, -330, 140, -330, 108, -200);
    c.bezierCurveTo(130, -60, 150 + sw, 120, 128 + sw, 260);
    c.quadraticCurveTo(0, 300, -128 - sw, 260);
    c.bezierCurveTo(-150 - sw, 120, -130, -60, -108, -200);
    c.fill();
  } else {
    const hj = c.createLinearGradient(-150, -300, 150, 200);
    hj.addColorStop(0, mixHex(P.hijab, '#ffffff', 0.25)); hj.addColorStop(1, P.hijabDark);
    c.fillStyle = hj;
    c.beginPath();
    c.moveTo(-122, -190);
    c.bezierCurveTo(-140, -340, 140, -340, 122, -190);
    c.bezierCurveTo(130, -80, 200, 0, 210, 120);
    c.lineTo(-210, 120);
    c.bezierCurveTo(-200, 0, -130, -80, -122, -190);
    c.fill();
  }
  // torso
  c.save(); c.translate(0, 560); c.scale(1 + br * 0.4, 1 + br); c.translate(0, -560);
  const ng = c.createLinearGradient(-36, 0, 36, 0);
  ng.addColorStop(0, P.dark); ng.addColorStop(0.5, P.skin); ng.addColorStop(1, P.dark);
  c.fillStyle = ng;
  c.beginPath(); c.moveTo(-32, -100); c.lineTo(32, -100); c.lineTo(36, 20); c.lineTo(-36, 20); c.fill();
  const tg = c.createLinearGradient(-180, 0, 180, 300);
  tg.addColorStop(0, P.topHi); tg.addColorStop(0.4, P.top); tg.addColorStop(1, P.topDark);
  c.fillStyle = tg;
  c.beginPath();
  c.moveTo(-60, -10);
  c.bezierCurveTo(-110, 0, -150, 10, -168, 50);
  c.bezierCurveTo(-186, 100, -186, 260, -192, 560);
  c.lineTo(192, 560);
  c.bezierCurveTo(186, 260, 186, 100, 168, 50);
  c.bezierCurveTo(150, 10, 110, 0, 60, -10);
  c.quadraticCurveTo(0, 50, -60, -10);
  c.fill();
  // neckline ruffle
  c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-60, -10); c.quadraticCurveTo(0, 50, 60, -10); c.stroke();
  // necklace
  c.strokeStyle = '#f2c66d'; c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(-34, -14); c.quadraticCurveTo(0, 30, 34, -14); c.stroke();
  drawHeart(c, 0, 22, 12, '#f2c66d', 1, false);
  if (P.hijab) {
    c.fillStyle = P.hijab;
    c.beginPath(); c.moveTo(-120, -60); c.quadraticCurveTo(0, 90, 120, -60); c.lineTo(150, 40); c.quadraticCurveTo(0, 150, -150, 40); c.closePath(); c.fill();
  }
  c.restore();

  // head
  const bob = Math.sin(t * 2.1 + 0.6) * 2.5;
  c.save();
  c.translate(0, -60 + bob - br * 300);
  c.rotate(o.tilt || 0);
  c.translate(0, 60);
  if (!P.hijab) {
    [-1, 1].forEach(s => {
      c.fillStyle = skinGrad(c, P, s * 96, -166, 26);
      c.beginPath(); c.ellipse(s * 96, -166, 15, 25, 0, 0, TAU); c.fill();
      c.fillStyle = '#f2c66d'; c.beginPath(); c.arc(s * 98, -136, 6, 0, TAU); c.fill();
      c.beginPath(); c.arc(s * 98, -122 + Math.sin(t * 3 + s) * 1.5, 4, 0, TAU); c.fill();
    });
  }
  facePath(c, true);
  o._fg = skinGrad(c, P, -10, -190, 145);
  c.fillStyle = o._fg; c.fill();
  c.save(); facePath(c, true); c.clip();
  [-1, 1].forEach(s => glowDot(c, s * 58, -126, 38, hexA('#ff6f8a', 0.3 + F.blush * 0.45), 1));
  faceShade(c, P);
  if (o.rim) {
    c.globalCompositeOperation = 'screen';
    const rg = c.createRadialGradient(o.rimSide * 150, -190, 20, o.rimSide * 150, -190, 120);
    rg.addColorStop(0, hexA(o.rim, 0.6)); rg.addColorStop(1, hexA(o.rim, 0));
    c.fillStyle = rg; c.fillRect(-110, -300, 220, 280);
  }
  c.restore();
  // nose
  c.fillStyle = hexA(P.dark, 0.4); c.beginPath(); c.ellipse(0, -134, 12, 6, 0, 0, TAU); c.fill();
  c.fillStyle = hexA(P.light, 0.8); c.beginPath(); c.ellipse(-2, -142, 4, 3, 0, 0, TAU); c.fill();
  c.fillStyle = hexA('#3a1a12', 0.5); [-1, 1].forEach(s => { c.beginPath(); c.ellipse(s * 6, -131, 3, 1.8, 0, 0, TAU); c.fill(); });
  drawMouth(c, F, P, -100, false, true);
  drawEye(c, -40, -172, -1, F, o, P, 1.08, true);
  drawEye(c, 40, -172, 1, F, o, P, 1.08, true);
  F.raise += 0.2;
  drawBrow(c, -1, F, P, -216, 0.6);
  drawBrow(c, 1, F, P, -216, 0.6);
  // front hair / hijab front
  if (!P.hijab) {
    const hg = c.createLinearGradient(-60, -330, 60, -200);
    hg.addColorStop(0, P.hairHi); hg.addColorStop(0.35, P.hair); hg.addColorStop(1, '#0b0605');
    c.fillStyle = hg;
    c.beginPath();
    c.moveTo(-104, -150);
    c.bezierCurveTo(-118, -300, -20, -330, 20, -300);
    c.bezierCurveTo(70, -320, 120, -280, 104, -150);
    c.bezierCurveTo(96, -210, 70, -240, 30, -250);
    c.bezierCurveTo(10, -230, -40, -222, -70, -232);
    c.bezierCurveTo(-92, -210, -100, -180, -104, -150);
    c.fill();
    c.strokeStyle = hexA('#a07a6a', 0.35); c.lineWidth = 2.5;
    for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(-70 + k * 25, -300 + Math.abs(k - 2.5) * 6); c.quadraticCurveTo(-60 + k * 25, -260, -80 + k * 30, -228); c.stroke(); }
    if (P.flower) { // frangipani
      c.save(); c.translate(84, -262); c.rotate(t * 0.2);
      for (let k = 0; k < 5; k++) {
        c.save(); c.rotate(k / 5 * TAU);
        const pg = c.createLinearGradient(0, 0, 0, -28);
        pg.addColorStop(0, '#ffd34d'); pg.addColorStop(0.5, '#fff8ec'); pg.addColorStop(1, '#ffffff');
        c.fillStyle = pg;
        c.beginPath(); c.ellipse(6, -14, 9, 16, 0.4, 0, TAU); c.fill();
        c.restore();
      }
      c.restore();
    }
  } else {
    c.strokeStyle = mixHex(P.hijab, '#ffffff', 0.3); c.lineWidth = 12;
    c.beginPath(); c.moveTo(-102, -150); c.bezierCurveTo(-118, -310, 118, -310, 102, -150); c.stroke();
  }
  c.restore();

  // arms (holding prop at chest)
  const pose = o.pose || {};
  const lh = pose.lh || [-62, 190], rh = pose.rh || [62, 190];
  const sl = P.hijab ? P.top : P.top;
  drawArm(c, P, [-150, 70], lh, -1, sl, P.topDark, P.top);
  drawArm(c, P, [150, 70], rh, 1, sl, P.topDark, P.top);
  if (pose.prop) pose.prop(c);
  drawHand(c, P, lh[0], lh[1], 0.2, -1, false);
  drawHand(c, P, rh[0], rh[1], -0.2, 1, false);
  c.restore();
}
