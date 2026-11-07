// SCENE: affiliate — "Animasi yang jualan" (12.0 s)
// Shown, not told: a yellow basket lands -> a phone on a night-stand plays a TikTok-style video in which an ORIGINAL
// animated presenter sells a serum -> a viewer taps the yellow basket and buys -> orders + commission stack up ->
// pull back: it's night, the real owner sleeps on a beanbag while the phone keeps selling. No face, no stock.
(() => {
  const SW = 600, SH = 1300;                 // phone screen content resolution (px)
  const PX = 300, PY = 1062;                 // phone centre in room (world) coords; screen = 150x325 world units
  const PINK = '#fe2c55', GREEN = '#16b26b';
  const ss = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const fmt = v => 'Rp' + idn(v);
  let AS = null;                              // assets, built lazily on first draw (fonts are loaded by then)

  // ------------------------------------------------------------------ timing
  const NT = [5.45, 5.95, 6.35, 6.68, 6.93, 7.12, 7.27, 7.38];               // order notifications (close-up)
  const NAMT = [12500, 12500, 25000, 12500, 12500, 37500, 12500, 25000];
  const BUZZ = [8.55, 9.2, 9.75, 10.25, 10.62, 10.95, 11.2];                  // phone keeps buzzing (wide)
  const COMMENTS = [[1.45, 'sinta.rr', 'spill kak 😍', '#ff8fb1'], [2.0, 'dimas_id', 'mau kak!', '#7cc6ff'],
    [2.55, 'lala.co', 'checkout 🛒', '#ffc94d'], [3.1, 'ayu_', 'udah co 2 🙌', '#9be6b4']];
  const BLINKS = [0.9, 2.75, 4.3, 6.05, 7.9, 9.6, 11.05];
  const BASKET_LAND = 0.32, PHONE_IN = 0.7, PHONE_LAND = 1.06;

  // camera keys: [t, zoom, cx, cy, rot, easing]
  const CAMK = [
    [0.00, 4.9, PX, PY - 24, -0.05],
    [1.06, 4.0, PX, PY - 4, -0.022],
    [3.55, 4.14, PX + 2, PY - 2, -0.018],
    [4.05, 4.42, PX + 6, PY + 26, -0.01],
    [5.15, 4.5, PX + 6, PY + 28, -0.008],
    [5.6, 3.3, PX, PY - 31, -0.014, E.io],
    [7.45, 3.36, PX, PY - 31, -0.012],
    [8.95, 1.0, 540, 960, 0, E.io],
    [11.62, 1.045, 548, 972, 0],
    [12.0, 1.34, 540, 1010, 0, E.expoIn],
  ];
  function camAt(lt) {
    let i = 0; while (i < CAMK.length - 2 && lt > CAMK[i + 1][0]) i++;
    const a = CAMK[i], b = CAMK[i + 1], u = P(lt, a[0], b[0]), k = (b[5] || E.sine)(u);
    const z = Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), k));
    return {
      z, cx: lerp(a[2], b[2], k) + noise1(lt * .4 + 11) * 7 / z, cy: lerp(a[3], b[3], k) + noise1(lt * .37 + 4) * 7 / z,
      rot: lerp(a[4], b[4], k) + noise1(lt * .3 + 2) * .004,
    };
  }
  const applyCam = c => { ctx.translate(540, 960); ctx.rotate(c.rot); ctx.scale(c.z, c.z); ctx.translate(-c.cx, -c.cy); };
  const w2s = (c, x, y) => { const dx = (x - c.cx) * c.z, dy = (y - c.cy) * c.z, co = Math.cos(c.rot), si = Math.sin(c.rot); return [540 + dx * co - dy * si, 960 + dx * si + dy * co]; };
  const s2w = (sx, sy) => [PX - 75 + sx / 4, PY - 162.5 + sy / 4];   // phone-screen px -> world (phone at rest)

  // ------------------------------------------------------------------ small shape helpers
  function heartPath(x, y, s) {
    ctx.beginPath(); ctx.moveTo(x, y + s * .8);
    ctx.bezierCurveTo(x - s * 1.15, y + s * .05, x - s * .8, y - s * .95, x, y - s * .38);
    ctx.bezierCurveTo(x + s * .8, y - s * .95, x + s * 1.15, y + s * .05, x, y + s * .8); ctx.closePath();
  }
  function lin(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => Array.isArray(c) ? g.addColorStop(c[0], c[1]) : g.addColorStop(i / (stops.length - 1), c)); return g; }
  function rad(x, y, r0, x1, y1, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x1, y1, r1); stops.forEach((c, i) => Array.isArray(c) ? g.addColorStop(c[0], c[1]) : g.addColorStop(i / (stops.length - 1), c)); return g; }

  // ------------------------------------------------------------------ static art (built once)
  function basketBody(s) {
    ctx.beginPath(); ctx.moveTo(-.98 * s, -.22 * s); ctx.lineTo(.98 * s, -.22 * s); ctx.lineTo(.74 * s, .7 * s);
    ctx.quadraticCurveTo(.7 * s, .84 * s, .56 * s, .84 * s); ctx.lineTo(-.56 * s, .84 * s);
    ctx.quadraticCurveTo(-.7 * s, .84 * s, -.74 * s, .7 * s); ctx.closePath();
  }
  function heroBasket(s) {
    ctx.save(); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-.56 * s, -.3 * s); ctx.bezierCurveTo(-.56 * s, -1.08 * s, .56 * s, -1.08 * s, .56 * s, -.3 * s);
    ctx.strokeStyle = '#c87800'; ctx.lineWidth = s * .21; ctx.stroke();
    ctx.strokeStyle = lin(0, -s, 0, -.3 * s, ['#fff4a8', '#ffc61f']); ctx.lineWidth = s * .14; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-.5 * s, -.48 * s); ctx.bezierCurveTo(-.48 * s, -.98 * s, .18 * s, -1.02 * s, .36 * s, -.86 * s);
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = s * .035; ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.shadowColor = 'rgba(110,45,0,.55)'; ctx.shadowBlur = s * .28; ctx.shadowOffsetY = s * .14;
    basketBody(s); ctx.fillStyle = lin(0, -.22 * s, 0, .84 * s, ['#ffe75e', [.55, '#ffc21a'], [1, '#ee8a00']]); ctx.fill(); ctx.restore();
    ctx.save(); basketBody(s); ctx.clip();
    ctx.fillStyle = lin(-s, 0, s, 0, [[0, 'rgba(150,60,0,.38)'], [.3, 'rgba(150,60,0,0)'], [.72, 'rgba(150,60,0,0)'], [1, 'rgba(150,60,0,.45)']]); ctx.fillRect(-s, -s, 2 * s, 2 * s);
    for (const sx of [-.44, 0, .44]) {
      rr((sx - .085) * s, -.02 * s, .17 * s, .62 * s, .085 * s); ctx.fillStyle = lin(0, -.02 * s, 0, .6 * s, ['#7a3300', '#c86c00']); ctx.fill();
      ctx.strokeStyle = 'rgba(255,236,150,.55)'; ctx.lineWidth = s * .018; ctx.beginPath(); ctx.moveTo((sx - .06) * s, .6 * s); ctx.lineTo((sx + .06) * s, .6 * s); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.32)'; ctx.beginPath(); ctx.ellipse(-.62 * s, .2 * s, .09 * s, .42 * s, .22, 0, 7); ctx.fill();
    ctx.restore();
    rr(-1.07 * s, -.42 * s, 2.14 * s, .27 * s, .135 * s); ctx.fillStyle = lin(0, -.42 * s, 0, -.15 * s, ['#fff8c2', [.45, '#ffd534'], [1, '#e99a00']]); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = s * .025; ctx.beginPath(); ctx.moveTo(-.9 * s, -.37 * s); ctx.lineTo(.6 * s, -.37 * s); ctx.stroke();
  }
  function bottleArt() {
    const cx = 100;
    rr(cx - 30, 28, 60, 116, [30, 30, 8, 8]); ctx.fillStyle = lin(cx - 30, 0, cx + 30, 0, ['#a8355a', [.3, '#ff8db0'], [.45, '#ffb7cc'], [.75, '#e0577f'], [1, '#8f2a4b']]); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.ellipse(cx - 12, 62, 6, 20, 0, 0, 7); ctx.fill();
    rr(cx - 38, 136, 76, 46, 9); ctx.fillStyle = lin(cx - 38, 0, cx + 38, 0, ['#8a6222', [.25, '#f6dc9a'], [.4, '#fff6d8'], [.7, '#d6a752'], [1, '#7a5418']]); ctx.fill();
    ctx.strokeStyle = 'rgba(90,60,10,.35)'; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(cx - 36, 145 + i * 7); ctx.lineTo(cx + 36, 145 + i * 7); ctx.stroke(); }
    rr(cx - 46, 176, 92, 30, 12); ctx.fillStyle = lin(cx - 46, 0, cx + 46, 0, ['#c24a72', '#ffc6d6', '#e66d92']); ctx.fill();
    ctx.save(); ctx.shadowColor = 'rgba(120,20,60,.35)'; ctx.shadowBlur = 10;
    rr(cx - 72, 192, 144, 240, 38); ctx.fillStyle = lin(cx - 72, 0, cx + 72, 0, ['#b8345d', [.2, '#ff9dbb'], [.42, '#ffd6e2'], [.7, '#ff8fb1'], [1, '#a92e55']]); ctx.fill(); ctx.restore();
    ctx.save(); rr(cx - 72, 192, 144, 240, 38); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(cx - 80, 180, 160, 36);
    ctx.fillStyle = 'rgba(255,240,245,.5)'; ctx.beginPath(); ctx.ellipse(cx, 216, 72, 6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(120,10,50,.25)'; ctx.beginPath(); ctx.ellipse(cx, 432, 90, 26, 0, 0, 7); ctx.fill();
    ctx.restore();
    rr(cx - 56, 268, 112, 106, 12); ctx.fillStyle = 'rgba(255,250,246,.95)'; ctx.fill();
    T('GLOW', cx, 308, { size: 34, font: 'Playfair', weight: 900, color: '#c93c66' });
    T('SERUM · 20ML', cx, 342, { size: 12, weight: 800, color: '#b0607a', ls: 2 });
    sparkle(cx + 38, 284, 7, '#f2a1b8', 0);
    rr(cx - 60, 204, 13, 206, 7); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill();
    rr(cx + 46, 214, 6, 150, 3); ctx.fillStyle = 'rgba(255,255,255,.32)'; ctx.fill();
    rr(cx - 72, 192, 144, 240, 38); ctx.strokeStyle = 'rgba(120,20,60,.4)'; ctx.lineWidth = 2.5; ctx.stroke();
  }
  function setBgArt() {   // the pastel "studio" behind the presenter (blurred afterwards = shallow DOF)
    ctx.fillStyle = lin(0, 0, 0, SH, ['#f7cfe0', [.45, '#f3d9f0'], [1, '#e2d4fa']]); ctx.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = `rgba(255,255,255,${.05 + (i % 2) * .04})`; ctx.fillRect(i * 70 + 10, 0, 34, SH); }
    // arched window + daylight
    ctx.save(); ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 60;
    ctx.beginPath(); ctx.moveTo(10, 900); ctx.lineTo(10, 320); ctx.arc(140, 320, 130, Math.PI, 0); ctx.lineTo(270, 900); ctx.closePath();
    ctx.fillStyle = lin(0, 190, 0, 900, ['#fffef9', '#fff3f6']); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(160,210,170,.35)'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(40 + i * 35, 820 - (i % 3) * 40, 40, 70, .3 * i, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(140, 190); ctx.lineTo(140, 900); ctx.moveTo(10, 470); ctx.lineTo(270, 470); ctx.moveTo(10, 680); ctx.lineTo(270, 680); ctx.stroke();
    glowBlob(150, 520, 460, 'rgba(255,252,240,.65)', 1, 'source-over');
    // ring-light mirror
    ctx.save(); ctx.translate(478, 300);
    ctx.fillStyle = rad(-30, -30, 10, 0, 0, 125, ['#fff4fb', '#ead6f2']); ctx.beginPath(); ctx.arc(0, 0, 118, 0, 7); ctx.fill();
    ctx.shadowColor = '#ff9ccc'; ctx.shadowBlur = 40; ctx.strokeStyle = '#fff6fb'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 0, 124, 0, 7); ctx.stroke(); ctx.restore();
    // shelf with jars
    ctx.save(); ctx.shadowColor = 'rgba(150,90,140,.35)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#fbf3f6'; ctx.fillRect(360, 640, 260, 16); ctx.restore();
    [[392, 58, '#bfe8dc'], [440, 86, '#d7c8f7'], [490, 48, '#ffd2b8'], [540, 70, '#ffc2d6'], [585, 56, '#fff1b8']].forEach(([x, hh, c]) => {
      rr(x - 18, 640 - hh, 36, hh, 9); ctx.fillStyle = lin(x - 18, 0, x + 18, 0, [mixc(c, '#000000', .12), c, '#ffffff', c]); ctx.fill();
      rr(x - 14, 640 - hh - 12, 28, 14, 4); ctx.fillStyle = '#f2e6ee'; ctx.fill();
    });
    // dresser/back counter
    ctx.fillStyle = lin(0, 880, 0, 980, ['#f8e4ee', '#ecd0e0']); ctx.fillRect(0, 900, SW, 100);
    ctx.fillStyle = 'rgba(160,100,140,.18)'; ctx.fillRect(0, 900, SW, 6);
    // plant
    ctx.fillStyle = lin(40, 0, 120, 0, ['#e9b7a0', '#ffdccb', '#d99c86']); rr(40, 820, 80, 84, 14); ctx.fill();
    for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(80, 830); ctx.rotate(-1.3 + i * .32); ctx.fillStyle = i % 2 ? '#7fc4a2' : '#5fae8c'; ctx.beginPath(); ctx.ellipse(0, -70, 18, 70, 0, 0, 7); ctx.fill(); ctx.restore(); }
  }
  function setFgArt() {     // table top in front of the presenter (drawn at y = 950)
    ctx.save(); ctx.shadowColor = 'rgba(120,60,100,.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = -6;
    ctx.fillStyle = lin(0, 20, 0, 360, ['#fff9fb', [.15, '#f8e3ec'], [1, '#e2bfd0']]); ctx.fillRect(0, 20, SW, 340); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(0, 20, SW, 4);
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = `rgba(200,150,180,${.12 + (i % 3) * .05})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-20, 60 + i * 50); ctx.bezierCurveTo(150, 30 + i * 60, 350, 90 + i * 40, 640, 50 + i * 55); ctx.stroke(); }
    // little cream jar left
    ctx.save(); ctx.shadowColor = 'rgba(120,60,100,.35)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
    rr(36, 0, 92, 52, 14); ctx.fillStyle = lin(36, 0, 128, 0, ['#e7d3f7', '#ffffff', '#cdb5ec']); ctx.fill(); ctx.restore();
    rr(32, -14, 100, 22, 8); ctx.fillStyle = lin(32, 0, 132, 0, ['#c99a4a', '#fff0c8', '#b8893a']); ctx.fill();
  }
  function avatarArt() {   // presenter mini avatar for the right rail
    ctx.fillStyle = lin(0, 0, 0, 80, ['#ffd3e2', '#f3b6d0']); ctx.beginPath(); ctx.arc(40, 40, 40, 0, 7); ctx.fill();
    ctx.fillStyle = '#5a2f27'; ctx.beginPath(); ctx.arc(40, 42, 27, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffe2cf'; ctx.beginPath(); ctx.ellipse(40, 48, 20, 21, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#5a2f27'; ctx.beginPath(); ctx.ellipse(40, 30, 24, 12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#2a1630'; ctx.beginPath(); ctx.arc(32, 49, 3.6, 0, 7); ctx.arc(48, 49, 3.6, 0, 7); ctx.fill();
  }

  // ---- the night room (world coords; canvas is offset by 100 px for camera overscan)
  const BULBS = [];
  (() => {
    const strand = (x0, y0, x1, y1, sag, n, seed) => { for (let i = 0; i < n; i++) { const u = (i + .5) / n; BULBS.push({ x: lerp(x0, x1, u), y: lerp(y0, y1, u) + sag * 4 * u * (1 - u) + 6, ph: h(seed + i) * 6.28, c: h(seed + i * 3) < .75 ? '#ffcf7a' : '#ffa2c8', k: .7 + h(seed + i * 7) * .6 }); } };
    strand(-20, 905, 660, 920, 75, 15, 3);
    strand(640, 850, 1110, 870, 60, 11, 40);
  })();
  function roomArt() {
    // wall
    ctx.fillStyle = lin(0, -100, 0, 1500, ['#111230', [.5, '#1c1a3c'], [1, '#2b2040']]); ctx.fillRect(-100, -100, W + 200, H + 200);
    for (let i = -2; i < 22; i++) { ctx.fillStyle = 'rgba(255,255,255,.018)'; ctx.fillRect(i * 56, -100, 22, 1500); }
    ctx.fillStyle = rad(440, 1120, 0, 440, 1120, 760, ['rgba(255,160,80,.30)', 'rgba(255,160,80,0)']); ctx.fillRect(-100, -100, W + 200, H + 200);
    // window
    const wx0 = 150, wx1 = 690, wy0 = 255, wy1 = 815;
    ctx.save(); rr(wx0, wy0, wx1 - wx0, wy1 - wy0, 10); ctx.clip();
    ctx.fillStyle = lin(0, wy0, 0, wy1, ['#070d33', [.55, '#1d2263'], [1, '#4b3577']]); ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    const RR = mulberry(77);
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${.25 + RR() * .6})`; ctx.beginPath(); ctx.arc(wx0 + RR() * (wx1 - wx0), wy0 + RR() * 330, .6 + RR() * 1.6, 0, 7); ctx.fill(); }
    ctx.fillStyle = rad(560, 380, 0, 560, 380, 200, ['rgba(255,240,200,.55)', 'rgba(255,240,200,0)']); ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    ctx.fillStyle = rad(548, 368, 4, 560, 380, 44, ['#fffdf2', '#f3e2b8']); ctx.beginPath(); ctx.arc(560, 380, 42, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(200,180,140,.35)'; ctx.beginPath(); ctx.arc(548, 372, 8, 0, 7); ctx.arc(574, 394, 6, 0, 7); ctx.fill();
    // far + near skyline
    for (let layerI = 0; layerI < 2; layerI++) {
      let x = wx0 - 20; const base = wy1, col = layerI ? '#0c0f2c' : '#1d1f4a';
      while (x < wx1 + 20) {
        const bw = 30 + RR() * 50, bh = (layerI ? 80 : 150) + RR() * (layerI ? 120 : 140);
        ctx.fillStyle = col; ctx.fillRect(x, base - bh, bw, bh);
        for (let wy = base - bh + 10; wy < base - 8; wy += 14) for (let wxx = x + 6; wxx < x + bw - 6; wxx += 11) if (RR() < (layerI ? .22 : .12)) { ctx.fillStyle = `rgba(255,${190 + RR() * 50},${110 + RR() * 60},${layerI ? .85 : .45})`; ctx.fillRect(wxx, wy, 5, 7); }
        x += bw + 4;
      }
    }
    ctx.restore();
    ctx.strokeStyle = '#2a2448'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo((wx0 + wx1) / 2, wy0); ctx.lineTo((wx0 + wx1) / 2, wy1); ctx.moveTo(wx0, 520); ctx.lineTo(wx1, 520); ctx.stroke();
    rr(wx0, wy0, wx1 - wx0, wy1 - wy0, 10); ctx.lineWidth = 20; ctx.stroke();
    rr(wx0 - 30, wy1 + 2, wx1 - wx0 + 60, 24, 6); ctx.fillStyle = lin(0, wy1, 0, wy1 + 26, ['#4a3f6e', '#2a2346']); ctx.fill();
    // curtains
    for (const [x0, x1] of [[70, 215], [628, 770]]) {
      ctx.fillStyle = lin(x0, 0, x1, 0, ['#2c2556', '#4a3d80', '#2a2350', '#54468c', '#2c2556']);
      ctx.beginPath(); ctx.moveTo(x0, 225); ctx.lineTo(x1, 225); ctx.bezierCurveTo(x1 - 10, 600, x1 + 15, 900, x1 + 5, 1180); ctx.lineTo(x0 - 5, 1180); ctx.bezierCurveTo(x0 + 10, 800, x0 - 10, 500, x0, 225); ctx.fill();
    }
    ctx.fillStyle = '#6a5a8a'; rr(40, 214, 760, 12, 6); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .55;
    ctx.beginPath(); ctx.moveTo(210, 300); ctx.lineTo(690, 280); ctx.lineTo(1120, 1760); ctx.lineTo(520, 1820); ctx.closePath();
    ctx.fillStyle = lin(450, 300, 760, 1800, ['rgba(140,160,255,.16)', 'rgba(140,160,255,.05)', 'rgba(140,160,255,0)']); ctx.fill();
    ctx.restore();
    ctx.save(); rr(150, 255, 540, 560, 10); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    for (const [x0, w0] of [[180, 60], [270, 22], [520, 80]]) { ctx.fillStyle = 'rgba(200,210,255,.05)'; ctx.beginPath(); ctx.moveTo(x0, 815); ctx.lineTo(x0 + w0, 815); ctx.lineTo(x0 + w0 + 260, 255); ctx.lineTo(x0 + 260, 255); ctx.fill(); }
    ctx.restore();
    // framed print on the right wall
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#d9c9a8'; ctx.fillRect(820, 430, 180, 230); ctx.restore();
    ctx.fillStyle = '#f3ead8'; ctx.fillRect(834, 444, 152, 202);
    ctx.fillStyle = '#e07a5f'; ctx.beginPath(); ctx.arc(890, 520, 38, 0, 7); ctx.fill();
    ctx.fillStyle = '#3d5a80'; ctx.fillRect(850, 570, 120, 50); ctx.fillStyle = '#f2cc8f'; ctx.beginPath(); ctx.arc(940, 590, 26, Math.PI, 0); ctx.fill();
    // floor
    ctx.fillStyle = lin(0, 1380, 0, 2020, ['#3a2730', '#1c1217']); ctx.fillRect(-100, 1380, W + 200, 740);
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-100, 1380, W + 200, 8);
    for (let i = 0; i < 12; i++) { ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-100 + i * 110, 1388); ctx.lineTo(-400 + i * 160, 2020); ctx.stroke(); }
    ctx.fillStyle = rad(440, 1300, 0, 440, 1300, 560, ['rgba(255,160,80,.22)', 'rgba(255,160,80,0)']); ctx.fillRect(-100, 1300, W + 200, 720);
    // rug
    ctx.save(); ctx.translate(640, 1640); ctx.scale(1, .26);
    ctx.fillStyle = '#5c3a52'; ctx.beginPath(); ctx.arc(0, 0, 470, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,214,170,.18)'; ctx.lineWidth = 14; for (const r of [400, 300, 180]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); }
    ctx.restore();
    // plant (right, behind beanbag)
    ctx.fillStyle = lin(935, 0, 1035, 0, ['#5b3b2c', '#8a5a40', '#4a2e22']); rr(935, 1250, 100, 140, 16); ctx.fill();
    for (let i = 0; i < 13; i++) { ctx.save(); ctx.translate(985, 1260); ctx.rotate(-1.25 + i * .2); ctx.fillStyle = i % 2 ? '#2f5a48' : '#3e7058'; ctx.beginPath(); ctx.ellipse(0, -110 - (i % 3) * 25, 24, 105, 0, 0, 7); ctx.fill(); ctx.restore(); }
    // night-stand
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
    ctx.fillStyle = lin(150, 0, 470, 0, ['#4a2c20', '#6b4130', '#3f251b']); ctx.fillRect(150, 1258, 320, 200); ctx.restore();
    ctx.fillStyle = '#2a170f'; ctx.fillRect(170, 1450, 18, 70); ctx.fillRect(432, 1450, 18, 70);
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 3; ctx.strokeRect(172, 1290, 276, 70);
    ctx.fillStyle = '#d9b37a'; ctx.beginPath(); ctx.arc(310, 1325, 7, 0, 7); ctx.fill();
    rr(126, 1234, 368, 28, 8); ctx.fillStyle = lin(0, 1234, 0, 1262, ['#a06a48', '#6a4230']); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,140,.35)'; ctx.fillRect(132, 1236, 356, 3);
    // books
    [['#3d5a80', 0], ['#e07a5f', 1], ['#f2cc8f', 2]].forEach(([c, i]) => { rr(150 + i * 4, 1236 - 20 - i * 18, 70 - i * 6, 18, 3); ctx.fillStyle = c; ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(150 + i * 4 + 62 - i * 6, 1236 - 18 - i * 18, 4, 14); });
    // lamp
    ctx.fillStyle = '#c9a36a'; ctx.fillRect(437, 1140, 6, 96); ctx.beginPath(); ctx.ellipse(440, 1234, 30, 7, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(405, 1080); ctx.lineTo(475, 1080); ctx.lineTo(500, 1150); ctx.lineTo(380, 1150); ctx.closePath(); ctx.fillStyle = lin(380, 0, 500, 0, ['#f7c27a', '#ffe9c2', '#e8a35c']); ctx.fill();
    // string-light wires
    ctx.strokeStyle = 'rgba(20,16,30,.9)'; ctx.lineWidth = 2;
    for (const [x0, y0, x1, y1, sag] of [[-20, 905, 660, 920, 75], [640, 850, 1110, 870, 60]]) { ctx.beginPath(); for (let u = 0; u <= 1.001; u += .02) ctx.lineTo(lerp(x0, x1, u), lerp(y0, y1, u) + sag * 4 * u * (1 - u)); ctx.stroke(); }
    BULBS.forEach(b => { ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(b.x, b.y, 3.5, 5, 0, 0, 7); ctx.fill(); });
    // beanbag
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 25;
    ctx.fillStyle = rad(700, 1330, 20, 760, 1450, 300, ['#d9744f', '#b4532f', '#6e2a17']);
    ctx.beginPath(); ctx.moveTo(520, 1500); ctx.bezierCurveTo(470, 1380, 520, 1230, 620, 1215); ctx.bezierCurveTo(700, 1205, 740, 1290, 820, 1320);
    ctx.bezierCurveTo(930, 1330, 1010, 1380, 1000, 1480); ctx.bezierCurveTo(990, 1560, 600, 1580, 520, 1500); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(80,20,8,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(560, 1300); ctx.quadraticCurveTo(640, 1420, 600, 1530); ctx.moveTo(830, 1330); ctx.quadraticCurveTo(860, 1430, 820, 1550); ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,160,.25)'; ctx.beginPath(); ctx.ellipse(575, 1290, 30, 70, -.3, 0, 7); ctx.fill();
  }

  // ------------------------------------------------------------------ build
  function build() {
    AS = {};
    const make = (w, hh, fn) => { const c = mk(w, hh); on(c.getContext('2d'), fn); return c; };
    AS.basket = make(420, 420, () => { ctx.translate(210, 236); heroBasket(150); });
    AS.bottle = make(200, 440, bottleArt);
    const setS = make(SW, SH, setBgArt);
    AS.setbg = make(SW, SH, () => { ctx.filter = 'blur(6px)'; ctx.drawImage(setS, -14, -14, SW + 28, SH + 28); ctx.filter = 'none'; });
    AS.setfg = make(SW, 360, () => { ctx.translate(0, 14); setFgArt(); });
    AS.avatar = make(80, 80, avatarArt);
    const leafS = make(700, 900, () => {
      for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(200 + i * 34, 880); ctx.scale(.75, .75); ctx.rotate(-1.0 + i * .28); ctx.fillStyle = i % 2 ? '#1b1222' : '#24182c'; ctx.beginPath(); ctx.ellipse(0, -380 - (i % 3) * 60, 70, 360, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,170,110,.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, -380 - (i % 3) * 60, 70, 360, 0, -1.3, .2); ctx.stroke(); ctx.restore(); }
    });
    AS.leaf = make(700, 900, () => { ctx.filter = 'blur(16px)'; ctx.drawImage(leafS, 0, 0); ctx.filter = 'none'; });
    AS.room = make(W + 200, H + 200, () => { ctx.translate(100, 100); roomArt(); });
    AS.roomB = make((W + 200) / 2, (H + 200) / 2, () => { ctx.filter = 'blur(10px)'; ctx.drawImage(AS.room, -20, -20, (W + 200) / 2 + 40, (H + 200) / 2 + 40); ctx.filter = 'none'; });
  }

  // ------------------------------------------------------------------ the animated presenter (inside the phone video)
  function presenter(vt) {
    const HX = 285, HY = 520;
    const pres = ss(2.05, 2.45, vt) * (1 - ss(3.15, 3.5, vt)) + ss(5.7, 6.1, vt) * (1 - ss(6.9, 7.3, vt));     // "look at this!" moments
    const cheer = ss(4.8, 4.95, vt) * (1 - ss(5.5, 5.9, vt));
    const talk = clamp(.55 + .6 * noise1(vt * 8.7)) * clamp(.35 + .9 * (noise1(vt * 1.9 + 7) * .5 + .5)) * (1 - cheer * .3) + cheer * .55;
    const bounce = Math.abs(Math.sin(vt * 5.4)) * 5 * (.4 + talk * .6) + cheer * Math.abs(Math.sin(vt * 11)) * 10;
    const breath = Math.sin(vt * 2.3) * 3;
    const tilt = Math.sin(vt * 1.6) * .045 + noise1(vt * .8 + 3) * .04 + pres * .07;
    const sway = noise1(vt * 1.4 + 9) * 7;
    const SK1 = '#ffe8d8', SK2 = '#f2b294', HA1 = '#73402f', HA2 = '#3a1d18', CA1 = '#cdbaf6', CA2 = '#9c86de';
    ctx.save(); ctx.translate(0, -bounce + breath * .4);
    // back hair
    ctx.save(); ctx.translate(HX, HY + 120); ctx.rotate(tilt * .7); ctx.translate(-HX, -HY - 120);
    ctx.beginPath(); ctx.moveTo(HX - 150, HY - 60);
    ctx.bezierCurveTo(HX - 205, HY + 40, HX - 195, HY + 170, HX - 158 + sway, HY + 222);
    ctx.quadraticCurveTo(HX - 115, HY + 240, HX - 82, HY + 205); ctx.lineTo(HX + 82, HY + 205);
    ctx.quadraticCurveTo(HX + 115, HY + 240, HX + 158 + sway, HY + 222);
    ctx.bezierCurveTo(HX + 195, HY + 170, HX + 205, HY + 40, HX + 150, HY - 60);
    ctx.bezierCurveTo(HX + 120, HY - 195, HX - 120, HY - 195, HX - 150, HY - 60);
    ctx.fillStyle = lin(0, HY - 190, 0, HY + 230, [HA1, HA2]); ctx.fill();
    ctx.restore();
    // torso (cardigan + tee)
    ctx.save(); ctx.translate(0, breath * .5);
    ctx.beginPath(); ctx.moveTo(HX - 55, HY + 150);
    ctx.bezierCurveTo(HX - 125, HY + 158, HX - 175, HY + 182, HX - 186, HY + 262); ctx.lineTo(HX - 205, 1010); ctx.lineTo(HX + 205, 1010); ctx.lineTo(HX + 186, HY + 262);
    ctx.bezierCurveTo(HX + 175, HY + 182, HX + 125, HY + 158, HX + 55, HY + 150); ctx.closePath();
    ctx.fillStyle = rad(HX - 90, HY + 200, 20, HX, HY + 320, 330, [CA1, [.6, '#b6a1ec'], [1, CA2]]); ctx.fill();
    ctx.beginPath(); ctx.moveTo(HX - 60, HY + 150); ctx.lineTo(HX + 60, HY + 150); ctx.lineTo(HX + 72, 1010); ctx.lineTo(HX - 72, 1010); ctx.closePath();
    ctx.fillStyle = lin(0, HY + 150, 0, 1010, ['#fffaf7', '#efe4f2']); ctx.fill();
    ctx.beginPath(); ctx.moveTo(HX - 36, HY + 148); ctx.quadraticCurveTo(HX, HY + 212, HX + 36, HY + 148); ctx.fillStyle = SK2; ctx.fill();
    ctx.strokeStyle = 'rgba(110,80,180,.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(HX - 60, HY + 150); ctx.lineTo(HX - 72, 1010); ctx.moveTo(HX + 60, HY + 150); ctx.lineTo(HX + 72, 1010); ctx.stroke();
    ctx.fillStyle = '#f6f0ff'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(HX - 80, HY + 260 + i * 70, 6, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(HX + 70, HY + 156); ctx.bezierCurveTo(HX + 130, HY + 162, HX + 172, HY + 188, HX + 184, HY + 262); ctx.stroke();
    ctx.restore();
    // neck
    rr(HX - 30, HY + 100, 60, 64, 22); ctx.fillStyle = lin(0, HY + 100, 0, HY + 164, ['#d99478', SK2]); ctx.fill();
    ctx.fillStyle = rad(HX, HY + 150, 0, HX, HY + 150, 70, ['rgba(150,70,80,.35)', 'rgba(150,70,80,0)']); ctx.fillRect(HX - 80, HY + 100, 160, 110);
    // ---- left arm (viewer-left): wave / point at the bottle
    const wv = Math.sin(vt * 5.2), wave = 1 - pres;
    const hL = [lerp(HX - 228 + wv * 14, HX + 40, pres) - cheer * 10, lerp(HY + 250 + Math.cos(vt * 5.2) * 8, HY + 330, pres) - cheer * 40];
    const eL = [HX - 214 + pres * 20, HY + 420];
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(HX - 168, HY + 240); ctx.quadraticCurveTo(eL[0] - 20, eL[1], eL[0], eL[1]); ctx.quadraticCurveTo(eL[0] + 10, eL[1] - 30, hL[0], hL[1] + 40);
    ctx.strokeStyle = CA2; ctx.lineWidth = 64; ctx.stroke(); ctx.strokeStyle = CA1; ctx.lineWidth = 44; ctx.save(); ctx.translate(-6, -5); ctx.stroke(); ctx.restore();
    // ---- right arm (viewer-right) holding the bottle
    const bx = HX + 160 + Math.sin(vt * 2.1) * 6 - pres * 18, by = HY + 175 + Math.sin(vt * 2.6) * 6 - pres * 22 - cheer * 30;
    const bRot = .1 + Math.sin(vt * 1.7) * .08 - pres * .12, bSc = 1.18 + pres * .12;
    ctx.beginPath(); ctx.moveTo(HX + 168, HY + 240); ctx.quadraticCurveTo(HX + 225, HY + 330, HX + 214, HY + 410); ctx.quadraticCurveTo(HX + 200, HY + 380, bx + 6, by + 112);
    ctx.strokeStyle = CA2; ctx.lineWidth = 64; ctx.stroke(); ctx.strokeStyle = CA1; ctx.lineWidth = 44; ctx.save(); ctx.translate(-6, -5); ctx.stroke(); ctx.restore();
    // ---- head
    ctx.save(); ctx.translate(HX, HY + 120); ctx.rotate(tilt); ctx.translate(-HX, -HY - 120);
    const face = () => { ctx.beginPath(); ctx.moveTo(HX - 136, HY - 20); ctx.bezierCurveTo(HX - 142, HY + 72, HX - 80, HY + 146, HX, HY + 148); ctx.bezierCurveTo(HX + 80, HY + 146, HX + 142, HY + 72, HX + 136, HY - 20); ctx.bezierCurveTo(HX + 130, HY - 152, HX - 130, HY - 152, HX - 136, HY - 20); };
    face(); ctx.fillStyle = rad(HX - 45, HY - 30, 10, HX - 10, HY + 10, 190, [SK1, [.62, '#ffd9c3'], [1, SK2]]); ctx.fill();
    ctx.save(); face(); ctx.clip();
    ctx.fillStyle = lin(0, HY - 110, 0, HY - 30, ['rgba(170,80,70,.45)', 'rgba(170,80,70,0)']); ctx.fillRect(HX - 150, HY - 150, 300, 130);
    ctx.lineWidth = 10; ctx.strokeStyle = lin(HX - 140, 0, HX + 140, 0, [[0, 'rgba(255,255,255,0)'], [.7, 'rgba(255,255,255,0)'], [1, 'rgba(255,250,255,.75)']]); face(); ctx.stroke();
    ctx.restore();
    // blush
    for (const s of [-1, 1]) { ctx.fillStyle = rad(HX + s * 80, HY + 58, 0, HX + s * 80, HY + 58, 38, ['rgba(255,120,150,.55)', 'rgba(255,120,150,0)']); ctx.fillRect(HX + s * 80 - 40, HY + 18, 80, 80); }
    // eyes
    let bl = 0; for (const b of BLINKS) bl = Math.max(bl, 1 - Math.abs(vt - b) / .075);
    const lx = pres * 7 + noise1(vt * .9 + 1) * 2.5 + cheer * 0, ly = pres * 4 + noise1(vt * .8 + 5) * 2;
    for (const s of [-1, 1]) {
      const ex = HX + s * 56, ey = HY + 14;
      if (cheer > .5) { ctx.strokeStyle = '#2b1420'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(ex, ey + 10, 24, Math.PI + .5, -.5); ctx.stroke(); continue; }
      const open = clamp(1 - bl);
      ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, 31, 40 * Math.max(.06, open), 0, 0, 7); ctx.clip();
      ctx.fillStyle = '#fff'; ctx.fillRect(ex - 40, ey - 50, 80, 100);
      ctx.fillStyle = lin(0, ey - 34, 0, ey + 36, ['#2a1422', [.5, '#6a3a5a'], [1, '#c77a9a']]); ctx.beginPath(); ctx.ellipse(ex + lx, ey + ly + 2, 27, 36, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#1a0a14'; ctx.beginPath(); ctx.ellipse(ex + lx, ey + ly - 2, 13, 17, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,190,220,.55)'; ctx.beginPath(); ctx.ellipse(ex + lx, ey + ly + 22, 16, 9, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + lx - 10, ey + ly - 13, 10, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(ex + lx + 10, ey + ly + 12, 4.5, 0, 7); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = '#2b1420'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      const top = ey - 40 * Math.max(.06, open) + 2;
      ctx.beginPath(); ctx.moveTo(ex - 32, ey - 6 * open); ctx.quadraticCurveTo(ex, top - 10 * open, ex + 32, ey - 6 * open);
      ctx.lineTo(ex + 32 + s * 9, ey - 14 * open); ctx.stroke();
      // brows
      const br = -talk * 5 - pres * 6 - cheer * 8;
      ctx.strokeStyle = 'rgba(90,45,35,.85)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - 20, HY - 50 + br); ctx.quadraticCurveTo(ex, HY - 60 + br, ex + 20, HY - 52 + br); ctx.stroke();
    }
    // nose
    ctx.strokeStyle = 'rgba(205,120,100,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(HX, HY + 52, 6, .3, 2.6); ctx.stroke();
    // mouth
    const o = clamp(talk), mw = 20 + 9 * o + cheer * 8, y0 = HY + 84, y1 = y0 + 6 + 30 * o + cheer * 10;
    if (o < .08 && cheer < .1) { ctx.strokeStyle = '#a03548'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(HX - 20, y0); ctx.quadraticCurveTo(HX, y0 + 14, HX + 20, y0); ctx.stroke(); }
    else {
      ctx.beginPath(); ctx.moveTo(HX - mw, y0); ctx.quadraticCurveTo(HX, y0 + 5, HX + mw, y0); ctx.quadraticCurveTo(HX + mw * .9, y1, HX, y1); ctx.quadraticCurveTo(HX - mw * .9, y1, HX - mw, y0);
      ctx.fillStyle = '#8e2440'; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ff8597'; ctx.beginPath(); ctx.ellipse(HX, y1 + 2, mw * .65, 12 + 6 * o, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(HX - mw, y0 - 2, mw * 2, 6 + 2 * o); ctx.restore();
    }
    // front hair: bangs + side locks + shine
    const hairPath = () => {
      ctx.beginPath(); ctx.moveTo(HX - 152, HY - 26);
      ctx.bezierCurveTo(HX - 164, HY - 150, HX - 62, HY - 200, HX + 10, HY - 190);
      ctx.bezierCurveTo(HX + 112, HY - 184, HX + 168, HY - 120, HX + 152, HY - 20);
      ctx.quadraticCurveTo(HX + 128, HY - 74, HX + 98, HY - 38); ctx.quadraticCurveTo(HX + 84, HY - 92, HX + 48, HY - 50);
      ctx.quadraticCurveTo(HX + 22, HY - 100, HX - 4, HY - 46); ctx.quadraticCurveTo(HX - 32, HY - 100, HX - 62, HY - 50);
      ctx.quadraticCurveTo(HX - 92, HY - 92, HX - 112, HY - 36); ctx.quadraticCurveTo(HX - 132, HY - 64, HX - 152, HY - 26); ctx.closePath();
      for (const s of [-1, 1]) {
        ctx.moveTo(HX + s * 150, HY - 60);
        ctx.bezierCurveTo(HX + s * 168, HY + 30, HX + s * 164, HY + 110, HX + s * 146 + sway * .6, HY + 176);
        ctx.quadraticCurveTo(HX + s * 128, HY + 90, HX + s * 118, HY - 20); ctx.closePath();
      }
    };
    hairPath(); ctx.fillStyle = lin(0, HY - 200, 0, HY + 180, ['#8a4c38', [.4, HA1], [1, HA2]]); ctx.fill();
    ctx.save(); hairPath(); ctx.clip();
    ctx.lineCap = 'round';
    for (let k = 0; k < 6; k++) { const a0 = -2.55 + k * .3; ctx.strokeStyle = `rgba(255,225,205,${k === 2 || k === 3 ? .42 : .3})`; ctx.lineWidth = 11 - Math.abs(k - 2.5) * 2; ctx.beginPath(); ctx.arc(HX - 4, HY - 18, 132, a0, a0 + .17); ctx.stroke(); }
    ctx.lineWidth = 14; ctx.strokeStyle = lin(HX - 160, 0, HX + 160, 0, [[0, 'rgba(255,255,255,0)'], [.65, 'rgba(255,255,255,0)'], [1, 'rgba(255,235,250,.55)']]); hairPath(); ctx.stroke();
    ctx.restore();
    sparkle(HX + 104, HY - 122, 20, '#ffd84a', .3); sparkle(HX + 104, HY - 122, 8, '#fff7c2', .3);
    ctx.restore(); // head
    // ---- bottle + gripping hand
    ctx.save(); ctx.translate(bx, by); ctx.rotate(bRot); ctx.scale(bSc, bSc);
    ctx.drawImage(AS.bottle, -50, -110, 100, 220);
    // glint sweep
    const gl = ((vt * .55) % 1); if (gl < .35) { ctx.save(); rr(-36, -14, 72, 120, 19); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const gx = lerp(-80, 80, gl / .35); ctx.fillStyle = lin(gx - 20, 0, gx + 20, 0, ['rgba(255,255,255,0)', 'rgba(255,255,255,.5)', 'rgba(255,255,255,0)']); ctx.fillRect(-60, -20, 120, 140); ctx.restore(); }
    ctx.fillStyle = rad(-10, 58, 4, 0, 66, 46, ['#ffe9db', SK2]);
    ctx.beginPath(); ctx.ellipse(6, 104, 36, 28, 0, 0, 7); ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(-16, 86 + i * 13, 17, 8, 0, 0, 7); ctx.fill(); }
    ctx.strokeStyle = 'rgba(190,110,90,.5)'; ctx.lineWidth = 2.2; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(-30, 92 + i * 13); ctx.lineTo(-6, 92 + i * 13); ctx.stroke(); }
    ctx.restore();
    sparkle(bx - 54, by - 80, 14 * (.5 + .5 * Math.sin(vt * 6)), '#fff', vt);
    // ---- left hand (open palm wave / pointing)
    ctx.save(); ctx.translate(hL[0], hL[1]); ctx.rotate(lerp(-.3 + wv * .18, -1.2, pres));
    ctx.fillStyle = rad(-8, -8, 2, 0, 0, 44, ['#ffeadc', SK2]);
    ctx.beginPath(); ctx.ellipse(0, 6, 32, 36, 0, 0, 7); ctx.fill();
    const fc = 1 - pres; // fingers spread when waving, index points when presenting
    for (let i = 0; i < 4; i++) { const a = -.5 + i * .33; const L = i === 1 ? 34 : 26 * fc + 6; ctx.save(); ctx.rotate(a * (i === 1 ? 1 : fc + .2)); rr(-8, -24 - L, 16, L + 10, 8); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.rotate(-1.4); rr(-8, -36, 16, 34, 8); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#efe7ff'; rr(-30, 30, 60, 16, 8); ctx.fill();
    ctx.restore();
    ctx.restore(); // bounce
  }

  // ------------------------------------------------------------------ phone UI (inside SCR, 600x1300)
  function uiIcons(lt, liked) {
    const X = 548;
    // avatar
    ctx.save(); ctx.beginPath(); ctx.arc(X, 600, 36, 0, 7); ctx.clip(); ctx.drawImage(AS.avatar, X - 36, 564, 72, 72); ctx.restore();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(X, 600, 36, 0, 7); ctx.stroke();
    ctx.fillStyle = PINK; ctx.beginPath(); ctx.arc(X, 638, 13, 0, 7); ctx.fill(); T('+', X, 637, { size: 22, weight: 900 });
    const sh = { c: 'rgba(0,0,0,.35)', x: 0, y: 2 };
    // heart
    const lp = liked > 0 ? 1 + .35 * Math.sin(Math.min(1, liked) * Math.PI) : 1;
    ctx.save(); ctx.translate(X, 722); ctx.scale(lp, lp); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 6;
    heartPath(0, 0, 30); ctx.fillStyle = liked > 0 ? PINK : '#fff'; ctx.fill(); ctx.restore();
    T(liked > 0 ? '48,3K' : '48,2K', X, 770, { size: 19, weight: 800, shadow: sh });
    // comment bubble
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(X, 836, 29, 25, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(X - 12, 856); ctx.lineTo(X - 20, 870); ctx.lineTo(X + 2, 858); ctx.fill();
    ctx.fillStyle = '#bbb'; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(X + i * 11, 836, 3.5, 0, 7); ctx.fill(); }
    T('1.204', X, 884, { size: 19, weight: 800, shadow: sh });
    // bookmark
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(X - 19, 922); ctx.lineTo(X + 19, 922); ctx.lineTo(X + 19, 970); ctx.lineTo(X, 956); ctx.lineTo(X - 19, 970); ctx.closePath(); ctx.fill();
    T('8.921', X, 994, { size: 19, weight: 800, shadow: sh });
    // share
    ctx.save(); ctx.translate(X, 1048); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(4, -22); ctx.lineTo(28, 0); ctx.lineTo(4, 22); ctx.lineTo(4, 10); ctx.quadraticCurveTo(-18, 8, -28, 22); ctx.quadraticCurveTo(-24, -6, 4, -10); ctx.closePath(); ctx.fill(); ctx.restore();
    T('2.115', X, 1086, { size: 19, weight: 800, shadow: sh });
    // spinning disc
    ctx.save(); ctx.translate(X, 1196); ctx.rotate(lt * 2.4);
    ctx.fillStyle = rad(0, 0, 4, 0, 0, 30, ['#555', '#151515']); ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fill();
    ctx.drawImage(AS.avatar, -15, -15, 30, 30); ctx.restore();
  }
  function scrUI(lt) {
    // legibility shades
    ctx.fillStyle = lin(0, 0, 0, 200, ['rgba(0,0,0,.32)', 'rgba(0,0,0,0)']); ctx.fillRect(0, 0, SW, 200);
    ctx.fillStyle = lin(0, 880, 0, SH, ['rgba(0,0,0,0)', 'rgba(0,0,0,.5)']); ctx.fillRect(0, 880, SW, SH - 880);
    // status bar + island
    T('21:47', 70, 44, { size: 24, weight: 800 });
    ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) ctx.fillRect(452 + i * 8, 50 - 5 - i * 3, 5, 6 + i * 3);
    rr(498, 34, 44, 20, 6); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.stroke(); rr(501, 37, 30, 14, 3); ctx.fill(); ctx.fillRect(544, 40, 3, 8);
    ctx.fillStyle = '#000'; rr(SW / 2 - 64, 20, 128, 38, 19); ctx.fill();
    // tabs
    T('Mengikuti', 228, 112, { size: 25, weight: 700, color: 'rgba(255,255,255,.7)', shadow: { c: 'rgba(0,0,0,.25)', x: 0, y: 2 } });
    T('Untuk Anda', 382, 112, { size: 25, weight: 800, shadow: { c: 'rgba(0,0,0,.25)', x: 0, y: 2 } });
    ctx.fillStyle = '#fff'; rr(364, 134, 36, 4, 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(552, 108, 13, 0, 7); ctx.moveTo(561, 117); ctx.lineTo(572, 128); ctx.stroke();
    // right rail
    const liked = lt > 2.62 ? (lt - 2.62) / .3 : 0;
    uiIcons(lt, liked);
    // floating hearts
    for (let i = 0; i < 16; i++) {
      const per = 2.2, st = 1.3 + h(i * 3.1) * 2.2 + Math.floor(i / 8) * 2.4; const u = (lt - st) / per; if (u < 0 || u > 1) continue;
      const x = 488 + Math.sin(u * 7 + i) * 16 - u * 26, y = 1140 - E.out(u) * 500, s = (10 + h(i) * 9) * (u < .12 ? E.back(u / .12) : 1);
      ctx.save(); ctx.globalAlpha = 1 - ss(.6, 1, u); heartPath(x, y, s); ctx.fillStyle = ['#ff4d7d', '#ff8fb1', '#ffd34d', '#ff6b6b', '#c58bff'][i % 5]; ctx.fill(); ctx.restore();
    }
    // live-ish comments
    let stackUp = 0;
    for (let i = COMMENTS.length - 1; i >= 0; i--) {
      const [ct, name, msg, col] = COMMENTS[i]; const k = E.out(P(lt, ct, ct + .35)); if (k <= 0) continue;
      let above = 0; for (let j = i + 1; j < COMMENTS.length; j++) above += E.out(P(lt, COMMENTS[j][0], COMMENTS[j][0] + .35));
      const y = 1030 - above * 56, a = k * clamp(1 - (above - 2.2)) * (1 - ss(3.7, 3.85, lt));
      if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - k) * -60, 0);
      const tw = TW(name + '  ' + msg, 21, 'Mont', 700) + 74;
      rr(24, y - 22, tw, 44, 22); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(46, y, 14, 0, 7); ctx.fill();
      T(name, 68, y + 1, { size: 21, weight: 700, color: 'rgba(255,255,255,.7)', align: 'left' });
      T(msg, 68 + TW(name + '  ', 21, 'Mont', 700), y + 1, { size: 21, weight: 800, align: 'left' });
      ctx.restore(); stackUp++;
    }
    // yellow-basket product pill (docks at PHONE_LAND)
    const pk = E.expo(P(lt, PHONE_LAND, PHONE_LAND + .45)), pulse = lt > 2.9 && lt < 3.7 ? .5 + .5 * Math.sin((lt - 2.9) * 12) : 0;
    const pw = lerp(56, 82 + TW('Serum Glow', 21, 'Mont', 800) + 28 + TW('Rp49.000', 21, 'Mont', 900) + 4, pk);
    ctx.save(); rr(24, 1066, pw, 54, 12); ctx.fillStyle = `rgba(0,0,0,${.42 + pulse * .1})`; ctx.fill();
    if (pulse > 0) { ctx.strokeStyle = `rgba(255,214,10,${pulse * .8})`; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.clip();
    if (lt > PHONE_LAND - .02) ctx.drawImage(AS.basket, 30, 1072, 42, 42);
    ctx.globalAlpha = pk; T('Serum Glow', 82, 1094, { size: 21, weight: 800, align: 'left' });
    const tx2 = 82 + TW('Serum Glow', 21, 'Mont', 800) + 14;
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(tx2, 1081, 2, 26);
    T('Rp49.000', tx2 + 14, 1094, { size: 21, weight: 900, color: '#ffd60a', align: 'left' });
    // shine sweep
    const sw = P(lt, PHONE_LAND + .2, PHONE_LAND + .75) + P(lt, 3.0, 3.5); if (sw % 1 > 0 && sw % 1 < 1) { const gx = lerp(0, 420, sw % 1); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5; ctx.fillStyle = lin(gx - 40, 0, gx + 40, 0, ['rgba(255,255,255,0)', 'rgba(255,255,255,.6)', 'rgba(255,255,255,0)']); ctx.fillRect(gx - 40, 1066, 80, 54); }
    ctx.restore();
    // creator + caption
    T('@ruby.glowie', 26, 1160, { size: 25, weight: 900, align: 'left', shadow: { c: 'rgba(0,0,0,.3)', x: 0, y: 2 } });
    T('serum favorit aku ✨ #racunskincare', 26, 1198, { size: 21, weight: 600, align: 'left', color: 'rgba(255,255,255,.92)' });
    T('♫  suara asli - ruby.glowie', 26, 1236, { size: 19, weight: 600, align: 'left', color: 'rgba(255,255,255,.8)' });
    // progress
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(0, 1290, SW, 3); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(0, 1290, SW * ((lt * .09 + .1) % 1), 3);
  }
  // product sheet + checkout
  const SHEET_H = 690;
  function sheetK(lt) { return E.expo(P(lt, 3.8, 4.3)) * (1 - E.io(P(lt, 5.2, 5.55))); }
  function scrSheet(lt) {
    const k = sheetK(lt); if (k <= 0) return;
    ctx.fillStyle = `rgba(0,0,0,${.38 * k})`; ctx.fillRect(0, 0, SW, SH);
    const sy = SH - SHEET_H * k + 10;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 30;
    rr(0, sy, SW, SHEET_H + 20, [34, 34, 0, 0]); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
    ctx.fillStyle = '#ddd'; rr(SW / 2 - 34, sy + 14, 68, 7, 4); ctx.fill();
    const done = E.out(P(lt, 4.8, 4.98));
    ctx.save(); ctx.globalAlpha = 1 - done;
    rr(30, sy + 48, 190, 190, 22); ctx.fillStyle = lin(30, sy + 48, 220, sy + 238, ['#ffe6ee', '#f6c4d6']); ctx.fill();
    ctx.save(); ctx.translate(125, sy + 146); ctx.rotate(-.12); ctx.drawImage(AS.bottle, -38, -84, 76, 167); ctx.restore();
    T('Serum Glow 20ml', 244, sy + 76, { size: 27, weight: 800, color: '#161616', align: 'left' });
    T('Rp49.000', 244, sy + 134, { size: 46, weight: 900, color: PINK, align: 'left' });
    T('Rp89.000', 244, sy + 180, { size: 21, weight: 700, color: '#a0a0a0', align: 'left' }); ctx.fillStyle = '#a0a0a0'; ctx.fillRect(244, sy + 180, 96, 2);
    rr(352, sy + 166, 70, 30, 8); ctx.fillStyle = '#ffe3e9'; ctx.fill(); T('-45%', 387, sy + 182, { size: 18, weight: 900, color: PINK });
    T('★ 4.9  ·  12,4rb terjual', 244, sy + 222, { size: 19, weight: 700, color: '#777', align: 'left' });
    ctx.fillStyle = '#eee'; ctx.fillRect(30, sy + 268, SW - 60, 2);
    T('Ukuran', 30, sy + 306, { size: 20, weight: 700, color: '#666', align: 'left' });
    [['20 ml', 1], ['30 ml', 0]].forEach(([s, sel], i) => { rr(30 + i * 130, sy + 330, 116, 50, 12); ctx.fillStyle = sel ? '#fff0f3' : '#f4f4f4'; ctx.fill(); if (sel) { ctx.strokeStyle = PINK; ctx.lineWidth = 2.5; ctx.stroke(); } T(s, 88 + i * 130, sy + 356, { size: 20, weight: 800, color: sel ? PINK : '#555' }); });
    T('Gratis ongkir  ·  tiba 2–3 hari', 30, sy + 430, { size: 20, weight: 700, color: '#1f9d63', align: 'left' });
    // buttons
    rr(30, sy + 560, 250, 78, 39); ctx.strokeStyle = PINK; ctx.lineWidth = 3; ctx.stroke(); T('+ Keranjang', 155, sy + 600, { size: 23, weight: 800, color: PINK });
    const press = lt > 4.6 && lt < 4.78 ? Math.sin(P(lt, 4.6, 4.78) * Math.PI) : 0;
    ctx.save(); ctx.translate(437, sy + 599); ctx.scale(1 - press * .05, 1 - press * .05);
    rr(-137, -39, 274, 78, 39); ctx.fillStyle = press ? mixc(PINK, '#000000', press * .2) : lin(-137, 0, 137, 0, ['#ff4f77', PINK]); ctx.fill();
    T('Beli sekarang', 0, 1, { size: 25, weight: 900 }); ctx.restore();
    ctx.restore();
    if (done > 0) {
      ctx.save(); ctx.globalAlpha = done;
      check(SW / 2, sy + 190, 64, pop(lt, 4.82, .4));
      T('Pesanan berhasil!', SW / 2, sy + 310, { size: 32, weight: 900, color: '#161616' });
      T('Serum Glow 20ml  ·  Rp49.000', SW / 2, sy + 356, { size: 21, weight: 700, color: '#888' });
      ctx.restore();
    }
  }
  function touchAt(lt) {   // "show touches" pointer path (screen px)
    if (lt < 3.3 || lt > 5.1) return null;
    const A0 = [560, 1420], A1 = [150, 1093], A2 = [437, SH - SHEET_H + 10 + 599], A3 = [520, 1420];
    let p;
    if (lt < 3.68) { const k = E.io(P(lt, 3.3, 3.68)); p = [lerp(A0[0], A1[0], k), lerp(A0[1], A1[1], k) - Math.sin(k * Math.PI) * 60]; }
    else if (lt < 4.25) p = A1;
    else if (lt < 4.58) { const k = E.io(P(lt, 4.25, 4.58)); p = [lerp(A1[0], A2[0], k), lerp(A1[1], A2[1], k) - Math.sin(k * Math.PI) * 50]; }
    else if (lt < 4.85) p = A2;
    else { const k = E.in(P(lt, 4.85, 5.1)); p = [lerp(A2[0], A3[0], k), lerp(A2[1], A3[1], k)]; }
    const press = Math.max(Math.sin(P(lt, 3.68, 3.82) * Math.PI), Math.sin(P(lt, 4.6, 4.74) * Math.PI));
    const a = fi(lt, 3.3, .15) * (1 - P(lt, 4.9, 5.05)) * (lt > 4.1 && lt < 4.3 ? .55 : 1);
    return { x: p[0], y: p[1], press, a };
  }
  function scrTouch(lt) {
    for (const tt of [3.72, 4.64]) { const u = P(lt, tt, tt + .5); if (u <= 0 || u >= 1) continue; const p = tt < 4 ? [150, 1093] : [437, SH - SHEET_H + 10 + 599]; ctx.strokeStyle = `rgba(255,255,255,${(1 - u) * .9})`; ctx.lineWidth = 6 * (1 - u) + 1; ctx.beginPath(); ctx.arc(p[0], p[1], 30 + E.out(u) * 90, 0, 7); ctx.stroke(); }
    const t0 = touchAt(lt); if (!t0 || t0.a <= 0) return;
    ctx.save(); ctx.globalAlpha = t0.a; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    const r = 34 * (1 - t0.press * .18);
    ctx.fillStyle = `rgba(255,255,255,${.45 + t0.press * .3})`; ctx.beginPath(); ctx.arc(t0.x, t0.y, r, 0, 7); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  function scrBanner(lt) {   // wide shot: tiny in-screen order banners when the phone buzzes
    for (const bt of BUZZ) {
      const u = lt - bt; if (u < 0 || u > 1.3) continue;
      const k = E.expo(P(u, 0, .3)) * (1 - E.in(P(u, 1.0, 1.3)));
      const y = lerp(-90, 80, k);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 20; rr(20, y, SW - 40, 112, 26); ctx.fillStyle = 'rgba(250,250,252,.95)'; ctx.fill(); ctx.restore();
      ctx.drawImage(AS.basket, 40, y + 28, 56, 56);
      T('Pesanan baru', 112, y + 40, { size: 26, weight: 900, color: '#111', align: 'left' });
      T('Komisi +Rp12.500', 112, y + 78, { size: 24, weight: 800, color: GREEN, align: 'left' });
    }
  }
  function screenContent(lt) {
    ctx.drawImage(AS.setbg, 0, 0);
    presenter(lt);
    ctx.drawImage(AS.setfg, 0, 936);
    // window light + motes
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(0, 200, 420, 900, ['rgba(255,240,220,.16)', 'rgba(255,240,220,0)']); ctx.fillRect(0, 0, SW, SH);
    for (let i = 0; i < 18; i++) { const x = (h(i) * SW + lt * 14 * (h(i + 3) - .3)) % SW, y = (h(i + 9) * 900 + 140 - lt * 10 * h(i + 1) + 900) % 900 + 140; ctx.fillStyle = `rgba(255,255,255,${.2 + .3 * h(i + 5)})`; ctx.beginPath(); ctx.arc(x, y, 1.5 + h(i + 7) * 2.5, 0, 7); ctx.fill(); }
    ctx.restore();
    scrUI(lt);
    scrSheet(lt);
    scrTouch(lt);
    if (lt > 8.2) scrBanner(lt);
  }

  // ------------------------------------------------------------------ phone object (world units)
  function drawPhone(x, y, rot, z, lt) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 16 * z; ctx.shadowOffsetY = 5 * z;
    rr(-80, -167.5, 160, 335, 26); ctx.fillStyle = '#16171b'; ctx.fill(); ctx.restore();
    rr(-80, -167.5, 160, 335, 26); ctx.fillStyle = lin(-80, 0, 80, 0, [[0, '#9a9ca6'], [.03, '#3a3b42'], [.08, '#1b1c21'], [.92, '#1b1c21'], [.97, '#3a3b42'], [1, '#b0b2bb']]); ctx.fill();
    ctx.fillStyle = lin(0, -167.5, 0, 167.5, [[0, 'rgba(255,255,255,.22)'], [.12, 'rgba(255,255,255,0)'], [.85, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.3)']]); ctx.fill();
    rr(-77.5, -165, 155, 330, 23.5); ctx.fillStyle = '#030304'; ctx.fill();
    ctx.save(); rr(-75, -162.5, 150, 325, 21); ctx.clip();
    ctx.drawImage(AS.scr, -75, -162.5, 150, 325);
    const off = (lt * 6) % 60 - 30;
    ctx.fillStyle = lin(-75 + off, -162.5, 75 + off, 162.5, [[0, 'rgba(255,255,255,.13)'], [.3, 'rgba(255,255,255,.03)'], [.48, 'rgba(255,255,255,0)'], [.58, 'rgba(255,255,255,.07)'], [.66, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']]);
    ctx.fillRect(-75, -162.5, 150, 325);
    ctx.restore();
    rr(-79.4, -166.9, 158.8, 333.8, 25.4); ctx.lineWidth = .7; ctx.strokeStyle = lin(-80, -167, 80, 167, ['rgba(255,255,255,.55)', 'rgba(255,255,255,.08)', 'rgba(255,255,255,.35)']); ctx.stroke();
    ctx.fillStyle = '#2a2b31'; rr(-81.8, -112, 2.4, 20, 1); ctx.fill(); rr(-81.8, -86, 2.4, 20, 1); ctx.fill(); rr(79.4, -100, 2.4, 32, 1); ctx.fill();
    ctx.restore();
  }
  function drawStand() {
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.ellipse(PX, PY + 178, 82, 7, 0, 0, 7); ctx.fill();
    rr(PX - 60, PY + 156, 120, 22, 8); ctx.fillStyle = lin(0, PY + 156, 0, PY + 178, ['#e8d3bb', '#a88d72']); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(PX - 54, PY + 157, 108, 1.5);
  }

  // ------------------------------------------------------------------ the owner (sleeping on the beanbag)
  function drawOwner(lt) {
    const br = Math.sin(lt * 2.2), smile = ss(11.4, 11.6, lt);
    // hoodie torso
    ctx.save();
    ctx.fillStyle = rad(640, 1300, 10, 680, 1330, 170, ['#9cc2a8', '#6f9a84', '#4d7462']);
    ctx.beginPath(); ctx.moveTo(575, 1305); ctx.bezierCurveTo(610, 1268, 700, 1262, 770, 1300 - br * 2); ctx.lineTo(800, 1420); ctx.lineTo(585, 1430); ctx.closePath(); ctx.fill();
    // hood behind head
    ctx.fillStyle = '#5f8a74'; ctx.beginPath(); ctx.ellipse(588, 1262, 78, 58, -.5, 0, 7); ctx.fill();
    // hoodie strings
    ctx.strokeStyle = '#f2ece0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(640, 1300); ctx.quadraticCurveTo(648, 1325, 644, 1345); ctx.moveTo(662, 1296); ctx.quadraticCurveTo(672, 1320, 670, 1340); ctx.stroke();
    // head
    ctx.save(); ctx.translate(612, 1236 + br * 1.4); ctx.rotate(-.42);
    ctx.fillStyle = '#1e1c30'; ctx.beginPath(); ctx.ellipse(-4, -8, 62, 60, 0, 0, 7); ctx.fill();
    ctx.fillStyle = rad(-26, -2, 4, -6, 8, 64, ['#ffd9bd', '#f0b08c', '#b97a62']); ctx.beginPath(); ctx.ellipse(0, 6, 50, 53, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,120,120,.4)'; ctx.beginPath(); ctx.ellipse(-28, 26, 12, 7, 0, 0, 7); ctx.ellipse(28, 26, 12, 7, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3a2228'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 19, 8, 10, .25, Math.PI - .25); ctx.stroke(); }
    if (smile > 0) { ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 30, 10 * smile + 2, .3, Math.PI - .3); ctx.stroke(); }
    else { ctx.fillStyle = '#8a3a44'; ctx.beginPath(); ctx.ellipse(0, 36, 4.5, 3 + (br * .5 + .5) * 2.5, 0, 0, 7); ctx.fill(); }
    // fringe
    ctx.fillStyle = '#26233a'; ctx.beginPath(); ctx.moveTo(-58, -4); ctx.bezierCurveTo(-60, -70, 50, -78, 58, -6); ctx.quadraticCurveTo(40, -26, 26, -14); ctx.quadraticCurveTo(14, -34, -2, -16); ctx.quadraticCurveTo(-18, -36, -30, -14); ctx.quadraticCurveTo(-46, -30, -58, -4); ctx.fill();
    ctx.strokeStyle = 'rgba(160,170,255,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-6, -10, 50, -2.6, -1.4); ctx.stroke();
    // sleep mask pushed up
    rr(-50, -44, 100, 26, 13); ctx.fillStyle = lin(-50, 0, 50, 0, ['#e98bb0', '#ffb3cf', '#e07aa2']); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3; for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 20, -34, 8, .3, Math.PI - .3); ctx.stroke(); }
    ctx.restore();
    // blanket (breathing)
    const bt = br * 3;
    ctx.fillStyle = lin(640, 1300, 980, 1460, ['#f0c35e', '#d99f3a', '#b97c22']);
    ctx.beginPath(); ctx.moveTo(612, 1352 - bt); ctx.bezierCurveTo(680, 1312 - bt, 760, 1318 - bt, 830, 1338); ctx.bezierCurveTo(900, 1330, 960, 1352, 985, 1395);
    ctx.bezierCurveTo(995, 1440, 960, 1470, 900, 1468); ctx.lineTo(640, 1470); ctx.bezierCurveTo(600, 1450, 596, 1390, 612, 1352 - bt); ctx.fill();
    ctx.strokeStyle = 'rgba(120,70,10,.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(700, 1340 - bt); ctx.quadraticCurveTo(760, 1400, 740, 1466); ctx.moveTo(860, 1345); ctx.quadraticCurveTo(880, 1410, 870, 1466); ctx.stroke();
    ctx.fillStyle = 'rgba(255,240,200,.35)'; ctx.beginPath(); ctx.ellipse(700, 1336 - bt, 70, 8, -.2, 0, 7); ctx.fill();
    // hand resting on the blanket
    ctx.fillStyle = '#f0b08c'; ctx.beginPath(); ctx.ellipse(718, 1352 - bt, 22, 15, -.3, 0, 7); ctx.fill();
    ctx.fillStyle = '#6f9a84'; ctx.beginPath(); ctx.ellipse(686, 1360 - bt, 30, 20, -.3, 0, 7); ctx.fill();
    // socks
    for (const [x, y, r] of [[992, 1402, -.3], [985, 1440, -.1]]) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(r); rr(-14, -18, 42, 34, 16); ctx.fillStyle = '#f4efe6'; ctx.fill();
      ctx.fillStyle = '#e07a5f'; ctx.fillRect(-4, -18, 6, 34); ctx.fillRect(10, -18, 6, 34); ctx.restore();
    }
    ctx.restore();
    // Zzz
    for (let i = 0; i < 3; i++) {
      const u = ((lt - 7.6) * .45 + i / 3) % 1; if (lt < 7.6) continue;
      T('z', 650 + u * 60 + Math.sin(u * 6 + i) * 10, 1170 - u * 150, { size: 26 + u * 26 + i * 2, font: 'Playfair', weight: 'italic 900', color: '#dfe3ff', alpha: Math.sin(u * Math.PI) * .85 });
    }
  }

  // ------------------------------------------------------------------ screen-space overlays
  function notifCard(x, y, sc, a, amt) {
    if (a <= 0 || sc <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
    rr(-430, -60, 860, 120, 34); ctx.fillStyle = 'rgba(246,246,250,.93)'; ctx.fill(); ctx.restore();
    rr(-430, -60, 860, 120, 34); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.stroke();
    rr(-404, -38, 76, 76, 20); ctx.fillStyle = lin(0, -38, 0, 38, ['#2a2a30', '#0d0d10']); ctx.fill();
    ctx.drawImage(AS.basket, -398, -32, 64, 64);
    T('Pesanan baru', -306, -18, { size: 31, weight: 900, color: '#121214', align: 'left' });
    T('sekarang', 400, -18, { size: 23, weight: 700, color: '#8a8a92', align: 'right' });
    T('Komisi', -306, 22, { size: 28, weight: 700, color: '#55555c', align: 'left' });
    T('+' + fmt(amt), -306 + TW('Komisi ', 28, 'Mont', 700), 22, { size: 29, weight: 900, color: GREEN, align: 'left' });
    ctx.restore();
  }
  function notifStack(lt) {
    if (lt < NT[0] || lt > 7.95) return;
    const out = E.in(P(lt, 7.45, 7.85));
    for (let i = 0; i < NT.length; i++) {
      const t0 = NT[i]; if (lt < t0) continue;
      let idx = 0; for (let j = i + 1; j < NT.length; j++) idx += E.out(P(lt, NT[j], NT[j] + .32));
      const ink = E.back(P(lt, t0, t0 + .42));
      let y, sc, a;
      if (idx <= 2) { y = 236 + idx * 134; sc = 1; a = 1; }
      else { const d = idx - 2; y = 236 + 268 + d * 16; sc = 1 - d * .045; a = clamp(1 - (d - 1.5) * .6); }
      y = lerp(y - 150, y, clamp(ink)) - out * (360 + idx * 40);
      notifCard(540, y, sc * lerp(.9, 1, clamp(ink)), a * clamp(P(lt, t0, t0 + .16)) * (1 - out), NAMT[i]);
    }
  }
  function counterVal(lt) {
    if (lt < 7.6) return 12500 + (1180000 - 12500) * E.out(P(lt, NT[0], 7.45)) ** 1.4;
    return lerp(1180000, 2450000, E.io(P(lt, 8.3, 11.35)));
  }
  function counter(lt) {
    const a = E.out(P(lt, NT[0] - .1, NT[0] + .25)) * (1 - E.in(P(lt, 11.72, 11.98)));
    if (a <= 0) return;
    const v = Math.round(counterVal(lt) / 500) * 500;
    const gk = Math.exp(-Math.max(0, lt - 11.4) * 4) * ss(11.3, 11.42, lt);
    const sc = (.85 + .15 * E.back(P(lt, NT[0] - .1, NT[0] + .3))) * (1 + gk * .07) * (1 + E.in(P(lt, 11.72, 12)) * .25);
    ctx.save(); ctx.translate(540, 1688); ctx.scale(sc, sc); ctx.globalAlpha *= a;
    if (gk > 0) glowBlob(0, 0, 420, `rgba(60,255,150,${.45 * gk})`, 1);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
    rr(-300, -56, 600, 112, 56); ctx.fillStyle = 'rgba(16,14,28,.78)'; ctx.fill(); ctx.restore();
    rr(-300, -56, 600, 112, 56); ctx.strokeStyle = gk > 0 ? `rgba(120,255,180,${.25 + gk * .6})` : 'rgba(255,255,255,.16)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = lin(0, -36, 0, 36, ['#3ee08f', '#109b5a']); ctx.beginPath(); ctx.arc(-242, 0, 34, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-256, 12); ctx.lineTo(-242, -12); ctx.lineTo(-228, 12); ctx.moveTo(-242, -12); ctx.lineTo(-242, 16); ctx.stroke();
    T('Komisi hari ini', -190, -22, { size: 22, weight: 700, color: 'rgba(255,255,255,.6)', align: 'left' });
    T(fmt(v), -190, 16, { size: 46, weight: 900, color: gk > .05 ? mixc('#ffffff', '#7dffb6', gk) : '#fff', align: 'left', glow: gk > .05 ? 'rgba(90,255,160,.9)' : null, gb: 24 * gk });
    T('*ilustrasi', 270, 30, { size: 17, weight: 700, color: 'rgba(255,255,255,.45)', align: 'right' });
    ctx.restore();
    // final cash sparkles
    if (lt > 11.4 && lt < 12) {
      const u = P(lt, 11.42, 11.95);
      for (let i = 0; i < 18; i++) { const an = -Math.PI * (.1 + .8 * h(i * 2.7)), sp = 260 + h(i) * 340; const x = 540 + Math.cos(an) * sp * E.out(u) + (h(i + 4) - .5) * 300, y = 1688 + Math.sin(an) * sp * E.out(u) + u * u * 200; sparkle(x, y, (10 + h(i + 1) * 14) * (1 - u), i % 3 ? '#ffe27a' : '#9dffcb', u * 4 + i); }
    }
  }
  function confetti(lt, cam) {
    const u0 = 4.84; if (lt < u0 || lt > u0 + 1.6) return;
    const [ox, oy] = w2s(cam, ...s2w(437, SH - SHEET_H + 10 + 470));
    const tt = lt - u0;
    glowBlob(ox, oy, 520 * (.4 + E.out(clamp(tt * 3))), 'rgba(255,120,170,.55)', 1 - ss(0, .7, tt));
    for (let i = 0; i < 90; i++) {
      const an = -Math.PI / 2 + (h(i * 1.7) - .5) * 3.4, sp = 900 + h(i * 2.3) * 1500, drag = Math.exp(-tt * 2.6);
      const d = sp * (1 - drag) / 2.6;
      const x = ox + Math.cos(an) * d + Math.sin(tt * 5 + i) * 26 * tt, y = oy + Math.sin(an) * d + 520 * tt * tt;
      const a = 1 - ss(1.0, 1.6, tt + h(i) * .3); if (a <= 0) continue;
      const depth = .7 + h(i * 9.1) * 1.1;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(tt * (6 + h(i) * 10) + i); ctx.scale(depth, depth * Math.cos(tt * (8 + h(i + 2) * 8) + i));
      ctx.fillStyle = [PINK, '#ffd60a', '#7cf0c3', '#ffffff', '#b99bff', '#ff9f43'][i % 6];
      if (i % 5 === 0) { ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill(); } else if (i % 5 === 1) { sparkle(0, 0, 16, '#fff6c2', 0); } else ctx.fillRect(-13, -6, 26, 12);
      ctx.restore();
    }
  }
  function chip(x, y, kind, label, a, sc) {
    if (a <= 0) return;
    const w = TW(label, 30, 'Mont', 800) + 120;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= a;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    rr(-w / 2, -40, w, 80, 40); ctx.fillStyle = 'rgba(18,16,34,.72)'; ctx.fill(); ctx.restore();
    rr(-w / 2, -40, w, 80, 40); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.stroke();
    const ix = -w / 2 + 48;
    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
    if (kind === 'cam') { rr(ix - 20, -13, 30, 26, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ix + 10, -4); ctx.lineTo(ix + 22, -11); ctx.lineTo(ix + 22, 11); ctx.lineTo(ix + 10, 4); ctx.closePath(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(ix - 18, -8); ctx.lineTo(ix, -17); ctx.lineTo(ix + 18, -8); ctx.lineTo(ix + 18, 12); ctx.lineTo(ix, 20); ctx.lineTo(ix - 18, 12); ctx.closePath(); ctx.moveTo(ix - 18, -8); ctx.lineTo(ix, 1); ctx.lineTo(ix + 18, -8); ctx.moveTo(ix, 1); ctx.lineTo(ix, 20); ctx.stroke(); }
    ctx.strokeStyle = '#ff5a6e'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ix - 22, 20); ctx.lineTo(ix + 22, -20); ctx.stroke();
    T(label, ix + 38, 2, { size: 30, weight: 800, align: 'left' });
    ctx.restore();
  }
  function worldBubbles(lt) {
    BUZZ.forEach((bt, i) => {
      const u = (lt - bt) / 1.25; if (u < 0 || u > 1) return;
      const x = PX + 10 + [-40, 70, 0, -60, 60, -20, 50][i], y = PY - 205 - E.out(u) * 150;
      const a = clamp(u * 8) * (1 - ss(.6, 1, u)), sc = .5 + .5 * E.back(clamp(u * 4));
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha = a;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6;
      rr(-108, -30, 216, 60, 30); ctx.fillStyle = 'rgba(250,250,252,.95)'; ctx.fill(); ctx.restore();
      ctx.drawImage(AS.basket, -98, -22, 44, 44);
      T('+Rp12.500', 22, 2, { size: 30, weight: 900, color: GREEN });
      ctx.restore();
    });
  }
  function bokeh(lt, cam, blurK) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    BULBS.forEach((b, i) => {
      const [x, y] = w2s(cam, b.x, b.y);
      const r0 = 4 * cam.z, r = r0 + blurK * (34 + 46 * h(i * 5.1)) * Math.min(1, cam.z / 3.3);
      if (x < -r || x > W + r || y < -r || y > H + r) return;
      const tw = .78 + .22 * Math.sin(lt * 2.2 + b.ph);
      const a = (blurK > .02 ? lerp(1, .42, blurK) : 1) * tw * b.k * .8;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, b.c); g.addColorStop(.75, b.c); g.addColorStop(.9, b.c); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = a * (blurK > .02 ? .55 : 1); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.globalAlpha = a * .35; ctx.fillStyle = rad(x, y, 0, x, y, r * 2.6 + 20, [b.c, 'rgba(0,0,0,0)']); ctx.fillRect(x - r * 2.6 - 20, y - r * 2.6 - 20, r * 5.2 + 40, r * 5.2 + 40);
    });
    ctx.restore();
  }

  // ------------------------------------------------------------------ main
  SCENES_REG.affiliate = {
    cues: [
      [0.0, 'whoosh_in'], [BASKET_LAND, 'impact'], [BASKET_LAND + .02, 'shimmer'], [PHONE_IN, 'whoosh'], [PHONE_LAND, 'pop'],
      [1.45, 'pop'], [2.0, 'pop'], [2.55, 'pop'], [3.1, 'pop'],
      [3.72, 'pop'], [3.82, 'whoosh'], [4.64, 'pop'], [4.84, 'ding'], [4.86, 'shimmer'],
      [5.45, 'cash'], [5.45, 'ticks', 2.0], [5.95, 'notif'], [6.35, 'cash'], [6.68, 'notif'], [6.93, 'cash'], [7.12, 'cash'], [7.38, 'cash'],
      [7.48, 'swell', 2.5], [7.52, 'whoosh'],
      [8.55, 'buzz'], [8.58, 'cash'], [9.0, 'pop'], [9.45, 'pop'], [9.75, 'buzz'], [9.78, 'cash'], [10.62, 'cash'], [10.4, 'ticks', .9],
      [11.42, 'cash'], [11.42, 'impact'], [11.72, 'whoosh'],
    ],
    draw(lt, t) {
      if (!AS) build();
      const cam = camAt(lt);
      const blurK = 1 - ss(7.6, 8.8, lt);
      if (lt > PHONE_IN - .05) AS.scr = paint('aff_scr', () => screenContent(lt), SW, SH);
      // ---- room (world)
      ctx.save(); applyCam(cam);
      if (blurK < 1) ctx.drawImage(AS.room, -100, -100);
      if (blurK > 0) { ctx.save(); ctx.globalAlpha = blurK; ctx.drawImage(AS.roomB, -100, -100, W + 200, H + 200); ctx.restore(); }
      glowBlob(440, 1115, 260, 'rgba(255,190,110,.55)', 1);
      ctx.restore();
      bokeh(lt, cam, blurK);
      // ---- entrance darkening (punchy basket beat)
      const dark = 1 - ss(.6, 1.15, lt);
      if (dark > 0) { ctx.fillStyle = `rgba(6,4,14,${.55 * dark})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
      // ---- world foreground: owner, stand, phone
      ctx.save(); applyCam(cam);
      if (lt > 7.4 && w2s(cam, 1000, 1300)[0] > 0 && w2s(cam, 560, 1300)[0] < W) {
        if (blurK > .03) { ctx.restore(); const c = paint('aff_owner', () => { applyCam(cam); drawOwner(lt); }); comp(c, { blur: blurK * 16 }); ctx.save(); applyCam(cam); }
        else drawOwner(lt);
      }
      // phone glow on the wall
      glowBlob(PX, PY - 20, 300, `rgba(255,170,215,${.22 + (lt > 8 ? .08 : 0)})`, 1);
      if (lt > PHONE_IN) { ctx.save(); ctx.globalAlpha = fi(lt, PHONE_IN, .25); drawStand(); ctx.restore(); }
      if (lt > PHONE_IN - .05) {
        const fly = u => 260 * (1 - E.expo(P(u, PHONE_IN, PHONE_LAND)));
        const flyR = u => .3 * (1 - E.expo(P(u, PHONE_IN, PHONE_LAND)));
        let bx = 0, br = 0;
        for (const bt of BUZZ) { const u = lt - bt; if (u >= 0 && u < .5) { const e = Math.exp(-u * 7); bx += Math.sin(u * 95) * 2.2 * e; br += Math.sin(u * 95 + 1) * .012 * e; } }
        if (lt < PHONE_LAND) for (let j = 4; j >= 1; j--) { ctx.save(); ctx.globalAlpha = .16; drawPhone(PX, PY + fly(lt - j * .014), flyR(lt - j * .014), cam.z, lt); ctx.restore(); }
        drawPhone(PX + bx, PY + fly(lt), flyR(lt) + br, cam.z, lt);
        if (lt > 8.2) { const fl = BUZZ.reduce((m, bt) => Math.max(m, lt >= bt ? Math.exp(-(lt - bt) * 3) : 0), 0); glowBlob(PX, PY, 220, `rgba(255,220,240,${.25 * fl})`, 1); }
      }
      if (lt > 8.4) worldBubbles(lt);
      ctx.restore();
      // ---- near-camera foliage (depth of field); slides past the lens on the pull back
      const pb = E.io(P(lt, 7.45, 8.6));
      if (pb < 1) {
        ctx.save(); ctx.globalAlpha = (1 - pb) * .95;
        const s1 = .9 + pb * .8;
        ctx.save(); ctx.translate(-330 - pb * 500, 1180 + pb * 400); ctx.rotate(.18); ctx.scale(s1, s1); ctx.drawImage(AS.leaf, 0, 0); ctx.restore();
        ctx.save(); ctx.translate(1420 + pb * 500, 1060 + pb * 400); ctx.rotate(-.25); ctx.scale(-s1 * .8, s1 * .8); ctx.drawImage(AS.leaf, 0, 0); ctx.restore();
        ctx.restore();
      }
      // ---- screen-space overlays
      confetti(lt, cam);
      notifStack(lt);
      counter(lt);
      // near-camera bokeh dust (depth)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) { const x = (h(i * 4.1) * 1300 + lt * (20 + h(i) * 30)) % 1300 - 110, y = h(i * 7.7) * 1900 + Math.sin(lt * .5 + i) * 40; glowBlob(x, y, 60 + h(i + 2) * 90, 'rgba(255,200,170,1)', .06 + .05 * h(i + 9)); }
      ctx.restore();
      // ---- "no face, no stock" chips (wide shot)
      const c1 = pop(lt, 9.0, .45) * (1 - E.in(P(lt, 11.15, 11.4))), c2 = pop(lt, 9.45, .45) * (1 - E.in(P(lt, 11.2, 11.45)));
      chip(300, 300 + Math.sin(lt * 1.3) * 5, 'cam', 'Tanpa muka', clamp(c1 * 1.5), Math.max(0, c1));
      chip(780, 300 + Math.sin(lt * 1.3 + 1) * 5, 'box', 'Tanpa stok', clamp(c2 * 1.5), Math.max(0, c2));
      // ---- entrance: hero basket + one line
      if (lt < PHONE_LAND + .02) {
        const k = E.expo(P(lt, 0, BASKET_LAND));
        const dock = E.io(P(lt, PHONE_IN + .02, PHONE_LAND));
        const camEnd = camAt(PHONE_LAND), [tx, ty] = w2s(camEnd, ...s2w(51, 1093));
        const pos = u => { const kk = E.expo(P(u, 0, BASKET_LAND)); return [lerp(980, 540, kk), lerp(260, 880, kk)]; };
        let [x, y] = pos(lt), sc = lerp(2.8, 1, k), rot = lerp(-2.4, 0, k);
        const land = P(lt, BASKET_LAND, BASKET_LAND + .3), sq = Math.sin(land * Math.PI) * (1 - land) * .25;
        x = lerp(x, tx, dock); y = lerp(y, ty, dock) - Math.sin(dock * Math.PI) * 120; sc = lerp(sc, 42 / 330, dock); rot += Math.sin(dock * Math.PI) * .4 + Math.sin(lt * 3) * .04 * (1 - dock);
        const S = 330;
        // glow + shock ring
        if (dock < 1) glowBlob(x, y, 520 * sc, 'rgba(255,200,40,.55)', 1 - dock);
        if (land > 0 && land < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(255,230,140,${(1 - land) * .8})`; ctx.lineWidth = 10 * (1 - land) + 1; ctx.beginPath(); ctx.arc(540, 880, 170 + E.out(land) * 420, 0, 7); ctx.stroke(); ctx.restore();
          for (let i = 0; i < 12; i++) { const an = i / 12 * 6.28 + .2, d = 200 + E.out(land) * (180 + h(i) * 160); sparkle(540 + Math.cos(an) * d, 880 + Math.sin(an) * d, 18 * (1 - land) * (.6 + h(i + 3)), i % 2 ? '#fff6c2' : '#ffd23a', land * 3); } }
        // motion-blur trail while spinning in
        if (lt < BASKET_LAND) for (let j = 4; j >= 1; j--) { const u = Math.max(0, lt - j * .022), kk = E.expo(P(u, 0, BASKET_LAND)); const [px, py] = pos(u); ctx.save(); ctx.globalAlpha = .18; ctx.translate(px, py); ctx.rotate(lerp(-2.4, 0, kk)); const s2 = lerp(2.8, 1, kk); ctx.scale(s2, s2); ctx.drawImage(AS.basket, -S / 2, -S / 2, S, S); ctx.restore(); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * (1 + sq), sc * (1 - sq)); ctx.drawImage(AS.basket, -S / 2, -S / 2, S, S); ctx.restore();
        // one line
        const ta = E.out(P(lt, BASKET_LAND + .05, BASKET_LAND + .3)) * (1 - P(lt, .7, .84));
        if (ta > 0) rich([['Animasi yang ', '#ffffff'], ['jualan.', '#ffd84a']], 540, 1150 + (1 - ta) * 30, { size: 64, font: 'Playfair', weight: 'italic 700', alpha: ta, shadow: { c: 'rgba(0,0,0,.5)', x: 0, y: 4 } });
      }
      // ---- grade + exit
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = lin(0, 0, 0, H, ['rgba(70,90,255,.35)', 'rgba(255,140,80,.3)']); ctx.fillRect(-100, -100, W + 200, H + 200); ctx.restore();
      const ex = E.in(P(lt, 11.7, 12));
      if (ex > 0) { ctx.fillStyle = `rgba(7,6,11,${ex})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
    },
  };
})();
