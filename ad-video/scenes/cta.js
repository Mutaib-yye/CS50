// SCENE: cta — the ending: "Komen MOTION" -> DM (9.5 s)
//  0.00–1.25  "Mau belajar?" (elegant serif, word-by-word rise)
//  1.20–3.00  kinetic KOMEN + huge glowing MOTION slam (the hero)
//  3.00–5.85  lockup docks to the top, dark-mode comment sheet: MOTION comments pour in, viewer types + sends MOTION
//  5.85–7.00  DM notification drops in + "Kami kirim ke DM kamu 📩"
//  7.00–9.50  clean end card: Komen MOTION 👇 (pulsing) + "*Iklan ini 100% dibuat dengan Claude"
(() => {
  const lazy = f => { let v = null; return () => v || (v = f()); };
  const vgrad = (y0, y1, stops) => { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; };

  // ---------------------------------------------------------------- static art
  const BG = (() => {
    const c = mk(W + 200, H + 200), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, H + 200);
    gr.addColorStop(0, '#0d0816'); gr.addColorStop(.5, '#170b1c'); gr.addColorStop(1, '#07050b');
    g.fillStyle = gr; g.fillRect(0, 0, W + 200, H + 200);
    const n = mk(160, 284), ng = n.getContext('2d'), id = ng.createImageData(160, 284);
    for (let y = 0; y < 284; y++) for (let x = 0; x < 160; x++) {
      const v = clamp(fbm2(x / 34 + 20, y / 34, 4) * .9 + .2), i = (y * 160 + x) * 4;
      id.data[i] = 170 * v; id.data[i + 1] = 60 * v; id.data[i + 2] = 110 * v; id.data[i + 3] = 255 * v * .3;
    }
    ng.putImageData(id, 0, 0);
    g.save(); g.filter = 'blur(18px)'; g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55; g.drawImage(n, 0, 0, W + 200, H + 200); g.restore();
    return c;
  })();
  const BOKEH = (() => {
    const c = mk(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,236,210,1)'); gr.addColorStop(.55, 'rgba(255,215,170,.5)'); gr.addColorStop(1, 'rgba(255,200,160,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); return c;
  })();
  const PARTS = Array.from({ length: 60 }, (_, i) => ({ x: h(i * 4.7 + 1) * 1300 - 110, y: h(i * 6.1 + 3) * 2100 - 90, z: h(i * 2.9 + 5), ph: h(i * 8.3) * 6.28 }));
  const SPARKS = Array.from({ length: 46 }, (_, i) => ({ a: h(i * 3.3) * 6.283, v: 500 + h(i * 7.1) * 1100, r: 2 + h(i * 1.7) * 5, d: .5 + h(i * 5.5) * .7 }));

  const MOTION_TX = lazy(() => {
    const cw = 1040, ch = 380, draw = (g, fill) => { g.save(); g.font = '400 300px Anton'; g.letterSpacing = '16px'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fill; g.fillText('MOTION', cw / 2 + 8, ch / 2 + 6); g.restore(); };
    const main = mk(cw, ch), m = main.getContext('2d');
    m.save(); m.translate(0, 12); draw(m, 'rgba(50,10,0,.6)'); m.restore();
    const gg = m.createLinearGradient(0, 60, 0, 320); gg.addColorStop(0, '#fff8e2'); gg.addColorStop(.35, '#ffd985'); gg.addColorStop(.7, '#f39a4c'); gg.addColorStop(1, '#c9502f');
    draw(m, gg);
    m.save(); m.globalCompositeOperation = 'source-atop'; const hl = m.createLinearGradient(0, 50, 0, 150); hl.addColorStop(0, 'rgba(255,255,255,.6)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); m.fillStyle = hl; m.fillRect(0, 0, cw, 170); m.restore();
    const glow = mk(cw, ch), gl = glow.getContext('2d'); gl.filter = 'blur(34px)'; draw(gl, '#ff8a3c'); gl.filter = 'none';
    const glow2 = mk(cw, ch), g2 = glow2.getContext('2d'); g2.filter = 'blur(10px)'; draw(g2, '#ffd08a'); g2.filter = 'none';
    return { main, glow, glow2, cw, ch };
  });

  function drawMotion(x, y, sc, lt, glowK = 1, sweepAt = []) {
    if (sc <= 0.001) return;
    const tx = MOTION_TX();
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .62 * glowK; ctx.drawImage(tx.glow, -tx.cw / 2, -tx.ch / 2); ctx.globalAlpha = .25 * glowK; ctx.drawImage(tx.glow2, -tx.cw / 2, -tx.ch / 2); ctx.restore();
    ctx.drawImage(tx.main, -tx.cw / 2, -tx.ch / 2);
    for (const [s0, s1] of sweepAt) {
      const k = P(lt, s0, s1); if (k <= 0 || k >= 1) continue;
      const sw = paint('cta_sweep', () => {
        ctx.drawImage(tx.main, 0, 0); ctx.globalCompositeOperation = 'source-atop';
        const sx = lerp(-300, tx.cw + 300, E.io(k)), g = ctx.createLinearGradient(sx - 130, 0, sx + 130, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.setTransform(1, 0, -.35, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(-300, 0, tx.cw + 600, tx.ch);
      }, tx.cw, tx.ch);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75; ctx.drawImage(sw, -tx.cw / 2, -tx.ch / 2); ctx.restore();
    }
    ctx.restore();
  }

  function drawBG(lt, warm = 0) {
    ctx.drawImage(BG, -100, -100 - lt * 6);
    glowBlob(540, 300, 1000, 'rgba(217,119,87,.20)', 1);
    glowBlob(540, 960, 800 + warm * 200, 'rgba(255,140,80,.10)', .6 + warm * .9);
    glowBlob(1000, 1700, 800, 'rgba(90,90,255,.12)', 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; rays(540, -350, 22, lt * .03, 'rgba(255,190,140,.022)'); ctx.restore();
  }
  function drawParts(lt, near, a = 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PARTS) {
      if ((p.z > .85) !== near) continue;
      const sz = near ? 60 + p.z * 90 : 4 + p.z * 20, sp = 14 + p.z * 50;
      const x = p.x + noise1(lt * .3 + p.ph) * 30 * p.z, y = ((p.y - lt * sp) % 2100 + 2100) % 2100 - 90;
      ctx.globalAlpha = a * (near ? .06 : .1 + .4 * p.z) * (.6 + .4 * Math.sin(lt * 1.5 + p.ph));
      ctx.drawImage(BOKEH, x - sz / 2, y - sz / 2, sz, sz);
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- comment sheet
  const ROW = 122, SHEET_Y = 560, LIST_Y = 690, LIST_B = 1560;
  const AV = ['#ff7a59', '#7c5cff', '#22c1a1', '#f5b83d', '#ff4f8b', '#3fa7ff', '#a3d65c', '#e86bd6', '#5cc8ff', '#ff9966', '#9b8cff'];
  const C_OLD = [['nadia.kreatif', 'MOTION', 41], ['yoga_pratama', 'MOTION 🔥', 63], ['putri.anim', 'motion kak 🙏', 28]];
  const C_NEW = [
    [3.45, 'dinda.creates', 'MOTION 🔥', 12], [3.66, 'rizky_ptr', 'MOTION', 8], [3.84, 'ayu.lestari', 'motion kak 🙏', 5],
    [3.99, 'bagas.anim', 'MOTION!!', 3], [4.12, 'sekar.id', 'Motion 🙌', 2], [4.24, 'fajar88', 'MOTION min', 1], [4.35, 'nurul_h', 'motionnn 😍', 1],
  ];
  const T_SEND = 5.32, T_MINE = 5.4;
  const ALL = [...C_OLD.map((c, i) => [-1 - i, ...c]).reverse(), ...C_NEW, [T_MINE, 'kamu', 'MOTION', 0, true]];  // oldest first

  function avatar(x, y, r, col, seed) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
    ctx.fillStyle = vgrad(y - r, y + r, [mixc(col, '#ffffff', .25), mixc(col, '#000000', .25)]); ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(x, y - r * .18, r * .34, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y + r * .78, r * .62, r * .48, 0, 0, 7); ctx.fill();
    ctx.restore();
  }
  function heart(x, y, s, fill, stroke) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath();
    ctx.moveTo(0, 9); ctx.bezierCurveTo(-22, -6, -12, -20, 0, -10); ctx.bezierCurveTo(12, -20, 22, -6, 0, 9); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2.6 / s; ctx.stroke(); } ctx.restore();
  }
  function commentRow(c, y, lt, idx) {
    const [t0, user, text, likes, mine] = c;
    const a = t0 < 0 ? 1 : E.out(P(lt, t0, t0 + .22)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 40, 0);
    if (mine) {
      const g = .6 + .4 * Math.sin(lt * 4);
      glowBlob(540, y, 420, 'rgba(217,119,87,.18)', 1);
      ctx.fillStyle = 'rgba(217,119,87,.13)'; rr(48, y - 54, 984, 108, 26); ctx.fill();
      ctx.strokeStyle = `rgba(255,150,110,${.45 + .3 * g})`; ctx.lineWidth = 2.5; ctx.stroke();
    } else if (t0 > 0) {
      const fl = 1 - P(lt, t0, t0 + .7); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${.06 * fl})`; rr(48, y - 54, 984, 108, 26); ctx.fill(); }
    }
    avatar(118, y, 36, mine ? CORAL : AV[(idx * 7 + user.length) % AV.length]);
    if (mine) { ctx.strokeStyle = '#ffb08f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(118, y, 39, 0, 7); ctx.stroke(); }
    const tag = t0 < 0 ? '2 mnt' : (mine ? 'baru saja' : '1 dtk');
    T(user, 174, y - 22, { size: 25, weight: 700, color: mine ? '#ffb59a' : '#8f8c9c', align: 'left' });
    T('· ' + tag, 174 + TW(user, 25, 'Mont', 700) + 10, y - 22, { size: 23, weight: 600, color: '#5f5c6b', align: 'left' });
    T(text, 174, y + 20, { size: 37, weight: 800, color: '#ffffff', align: 'left' });
    const liked = mine && lt > 5.9;
    const hs = liked ? 1 + .35 * Math.max(0, 1 - Math.abs(lt - 6.0) * 5) : 1;
    heart(982, y - 8, hs * 1.15, liked ? '#ff3d6e' : null, liked ? null : 'rgba(255,255,255,.4)');
    if (likes || liked) T(String(liked ? 1 : likes), 982, y + 28, { size: 20, weight: 700, color: '#8f8c9c' });
    ctx.restore();
  }

  function drawSheet(lt) {
    const sk = E.expo(P(lt, 2.98, 3.5)); if (sk <= 0) return;
    const oy = (1 - sk) * 1400;
    ctx.save(); ctx.translate(0, oy);
    // sheet body
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = -10;
    ctx.fillStyle = '#121117'; rr(10, SHEET_Y, W - 20, H - SHEET_Y + 200, 46); ctx.fill(); ctx.restore();
    ctx.fillStyle = vgrad(SHEET_Y, SHEET_Y + 300, ['rgba(255,255,255,.05)', 'rgba(255,255,255,0)']); rr(10, SHEET_Y, W - 20, 300, 46); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2; rr(11, SHEET_Y + 1, W - 22, H, 46); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.25)'; rr(500, SHEET_Y + 16, 80, 8, 4); ctx.fill();
    const n = 1284 + C_NEW.filter(c => lt >= c[0]).length + (lt >= T_MINE ? 1 : 0);
    T(idn(n) + ' komentar', 540, SHEET_Y + 66, { size: 29, weight: 800, color: '#e6e3ee' });
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(970, SHEET_Y + 54); ctx.lineTo(994, SHEET_Y + 78); ctx.moveTo(994, SHEET_Y + 54); ctx.lineTo(970, SHEET_Y + 78); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(40, SHEET_Y + 112, W - 80, 2);
    // list: newest on top; newer comments push older ones down
    ctx.save(); ctx.beginPath(); ctx.rect(0, LIST_Y - 10, W, LIST_B - LIST_Y + 10); ctx.clip();
    const pushes = ALL.map(c => c[0] < 0 ? 1 : E.expo(P(lt, c[0], c[0] + .3)));
    for (let i = 0; i < ALL.length; i++) {
      if (ALL[i][0] > lt) continue;
      let off = 0; for (let j = i + 1; j < ALL.length; j++) off += pushes[j];
      const y = LIST_Y + 60 + (off - (1 - pushes[i])) * ROW;
      if (y > LIST_B + 70) continue;
      commentRow(ALL[i], y, lt, i);
    }
    ctx.restore();
    // fade list bottom into the input area
    ctx.fillStyle = vgrad(LIST_B - 90, LIST_B, ['rgba(18,17,23,0)', 'rgba(18,17,23,1)']); ctx.fillRect(10, LIST_B - 90, W - 20, 90);
    // input bar
    const iy = 1650, focus = E.out(P(lt, 4.5, 4.7)) * (1 - P(lt, T_SEND + .05, T_SEND + .3));
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(10, LIST_B, W - 20, 2);
    avatar(102, iy, 34, CORAL);
    ctx.fillStyle = '#211f2a'; rr(160, iy - 46, 700, 92, 46); ctx.fill();
    if (focus > 0) { ctx.strokeStyle = `rgba(255,150,110,${.8 * focus})`; ctx.lineWidth = 3; ctx.stroke(); glowBlob(510, iy, 380, 'rgba(217,119,87,.16)', focus); }
    const nch = Math.floor(P(lt, 4.68, 5.12) * 6 + .0001), typed = 'MOTION'.slice(0, nch), sent = lt >= T_SEND + .05;
    if (!typed || sent) T('Tambahkan komentar...', 200, iy + 2, { size: 31, weight: 600, color: '#6c6878', align: 'left' });
    else {
      T(typed, 200, iy + 2, { size: 38, weight: 900, color: '#fff', align: 'left' });
      if (Math.floor(lt * 5) % 2 === 0 || nch < 6) { ctx.fillStyle = CORAL; ctx.fillRect(204 + TW(typed, 38, 'Mont', 900), iy - 22, 3.5, 44); }
    }
    if (!typed && focus > 0 && !sent) { ctx.fillStyle = `rgba(217,119,87,${Math.floor(lt * 5) % 2 ? 1 : 0})`; ctx.fillRect(198, iy - 22, 3.5, 44); }
    // send button + tap ripple
    const bx = 940, active = typed && !sent;
    const press = 1 - .14 * Math.max(0, 1 - Math.abs(lt - T_SEND) * 9);
    ctx.save(); ctx.translate(bx, iy); ctx.scale(press, press);
    ctx.fillStyle = active ? vgrad(-44, 44, ['#f0906f', '#c9583a']) : '#2c2a35'; ctx.beginPath(); ctx.arc(0, 0, 46, 0, 7); ctx.fill();
    ctx.fillStyle = active ? '#fff' : '#6c6878'; ctx.beginPath(); ctx.moveTo(-17, -19); ctx.lineTo(22, 0); ctx.lineTo(-17, 19); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    for (let r = 0; r < 2; r++) {
      const k = P(lt, T_SEND + r * .08, T_SEND + .55 + r * .08); if (k <= 0 || k >= 1) continue;
      ctx.strokeStyle = `rgba(255,190,160,${(1 - k) * .9})`; ctx.lineWidth = 5 * (1 - k) + 1; ctx.beginPath(); ctx.arc(bx, iy, 46 + E.out(k) * 110, 0, 7); ctx.stroke();
    }
    // fingertip (touch indicator)
    const fa = P(lt, T_SEND - .3, T_SEND - .12) * (1 - P(lt, T_SEND + .1, T_SEND + .3));
    if (fa > 0) {
      const fy = iy + lerp(60, 0, E.out(P(lt, T_SEND - .3, T_SEND)));
      ctx.save(); ctx.globalAlpha = fa * .55; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx + 6, fy + 6, 34, 0, 7); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha = fa * .9; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx + 6, fy + 6, 34, 0, 7); ctx.stroke(); ctx.restore();
    }
    // the sent word flies from the field up to the list top
    const fk = P(lt, T_SEND + .02, T_MINE + .04);
    if (fk > 0 && fk < 1) { const e = E.io(fk); T('MOTION', lerp(200, 174, e), lerp(iy, LIST_Y + 80, e), { size: lerp(38, 37, e), weight: 900, color: '#ffd3c2', align: 'left', alpha: 1 - fk * fk, glow: 'rgba(255,140,90,.8)', gb: 20 }); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- DM notification
  function planeGlyph(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(-24, -2); ctx.lineTo(24, -20); ctx.lineTo(10, 22); ctx.lineTo(2, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.moveTo(2, 6); ctx.lineTo(24, -20); ctx.lineTo(-4, 16); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function drawDM(lt, a) {
    const k = P(lt, 5.85, 6.35); if (k <= 0 || a <= 0) return;
    const e = E.back(k), y = lerp(-220, 200, Math.min(e, 1.04));
    ctx.save(); ctx.globalAlpha *= a;
    const x = 56, w = 968, hh = 168;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 26;
    ctx.fillStyle = 'rgba(38,35,48,.96)'; rr(x, y, w, hh, 44); ctx.fill(); ctx.restore();
    ctx.fillStyle = vgrad(y, y + hh, ['rgba(255,255,255,.08)', 'rgba(255,255,255,.01)']); rr(x, y, w, hh, 44); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 2; rr(x + 1, y + 1, w - 2, hh - 2, 43); ctx.stroke();
    // app icon (generic gradient + paper plane)
    const ix = x + 30, iy = y + 34;
    const g = ctx.createLinearGradient(ix, iy, ix + 100, iy + 100); g.addColorStop(0, '#ffb07a'); g.addColorStop(.5, CORAL); g.addColorStop(1, '#b33a6b');
    ctx.fillStyle = g; rr(ix, iy, 100, 100, 26); ctx.fill();
    planeGlyph(ix + 50, iy + 50, 1.15);
    T('AI Motion Cuan', x + 156, y + 58, { size: 31, weight: 800, color: '#fff', align: 'left' });
    T('sekarang', x + w - 34, y + 58, { size: 24, weight: 600, color: '#9a96a8', align: 'right' });
    T('Halo! 👋 Ini info lengkap kelasnya…', x + 156, y + 108, { size: 31, weight: 600, color: '#e9e6f2', align: 'left', maxW: w - 190 });
    // shine pass on arrival
    const sh = P(lt, 6.15, 6.75);
    if (sh > 0 && sh < 1) { ctx.save(); rr(x, y, w, hh, 44); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const sx = lerp(x - 200, x + w + 200, E.io(sh)); const sg = ctx.createLinearGradient(sx - 120, 0, sx + 120, 0); sg.addColorStop(0, 'rgba(255,230,210,0)'); sg.addColorStop(.5, 'rgba(255,230,210,.18)'); sg.addColorStop(1, 'rgba(255,230,210,0)'); ctx.fillStyle = sg; ctx.fillRect(x, y, w, hh); ctx.restore(); }
    ctx.restore();
    const la = E.out(P(lt, 6.3, 6.65)) * a;
    if (la > 0) T('Kami kirim ke DM kamu 📩', 540, 470 + (1 - la) * 20, { size: 46, font: 'Playfair', weight: 'italic 700', color: '#fff', alpha: la, shadow: { c: 'rgba(0,0,0,.6)', x: 0, y: 4 } });
  }

  // ---------------------------------------------------------------- end card
  function drawEnd(lt, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const l = lt - 7.0;
    glowBlob(540, 930, 760, 'rgba(255,140,80,.28)', 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= .9; rays(540, 930, 26, lt * .08, 'rgba(255,200,140,.035)'); ctx.restore();
    const ks = E.expo(P(l, 0, .7));
    // "Komen" with hairlines
    const ky = 648, kw = TW('Komen', 120, 'Playfair', 'italic 900');
    T('Komen', 540, ky + (1 - ks) * 40, { size: 120, font: 'Playfair', weight: 'italic 900', color: '#fff', alpha: ks, shadow: { c: 'rgba(0,0,0,.5)', x: 0, y: 6 } });
    const hl = E.expo(P(l, .2, .9)) * 170;
    if (hl > 1) {
      ctx.save(); ctx.globalAlpha *= ks;
      for (const sgn of [-1, 1]) {
        const x0 = 540 + sgn * (kw / 2 + 36), x1 = x0 + sgn * hl, g = ctx.createLinearGradient(x0, 0, x1, 0);
        g.addColorStop(0, 'rgba(255,215,140,.9)'); g.addColorStop(1, 'rgba(255,215,140,0)'); ctx.fillStyle = g; ctx.fillRect(Math.min(x0, x1), ky + 8, Math.abs(hl), 2.5);
        sparkle(x0, ky + 9, 9, '#ffe3a6', 0);
      }
      ctx.restore();
    }
    // MOTION — pulsing hero
    const pul = 1 + .028 * Math.sin(l * Math.PI * 2 * 1.25);
    const ms = lerp(.86, 1, E.expo(P(l, 0, .6))) * pul;
    const sweeps = [[.35, 1.05], [1.55, 2.25]];
    drawMotion(540, 935, ms, lt, .85 + .35 * (pul - 1) / .028 * .5 + .15, sweeps.map(([s0, s1]) => [7 + s0, 7 + s1]));
    // pointing hand
    const bob = Math.abs(Math.sin(l * Math.PI * 1.25)) * 26;
    T('👇', 540, 1185 + bob, { size: 120, sc: pop(l, .35, .45) });
    // footnote
    const fa = fi(l, .6, .5);
    if (fa > 0) {
      const s = '*Iklan ini 100% dibuat dengan Claude', w = TW(s, 26, 'Mont', 700);
      sparkle(540 - w / 2 - 22, 1640, 11, CORAL, 0);
      T(s, 540 + 8, 1641, { size: 26, weight: 700, color: 'rgba(255,255,255,.62)', alpha: fa });
    }
    ctx.restore();
  }

  SCENES_REG.cta = {
    cues: [
      [0.0, 'whoosh_in'], [1.12, 'whoosh'], [1.3, 'pop'], [1.7, 'impact_big'], [1.74, 'shimmer'],
      [2.98, 'whoosh'], [3.45, 'notif'], [3.99, 'notif'], [4.35, 'notif'], [4.68, 'type', 0.46], [5.32, 'pop'],
      [5.88, 'notif'], [6.95, 'swell', 2.5], [7.05, 'shimmer'],
    ],
    draw(lt, t) {
      const endK = E.io(P(lt, 6.85, 7.3));
      drawBG(lt, endK);
      drawParts(lt, false);

      // ---- A: "Mau belajar?"
      if (lt < 1.35) {
        const out = E.in(P(lt, 1.02, 1.3));
        ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(540, 900 - out * 120); ctx.scale(1 + out * .25, 1 + out * .25);
        glowBlob(0, 0, 520, 'rgba(255,150,100,.22)', fi(lt, 0, .5));
        const fz = 150, wm = TW('Mau', fz, 'Playfair', 'italic 700'), wb = TW('belajar?', fz, 'Playfair', 'italic 700'), gap = 36, tw = wm + gap + wb;
        const words = [['Mau', -tw / 2 + wm / 2, .08], ['belajar?', tw / 2 - wb / 2, .3]];
        for (const [wd, x, t0] of words) {
          const k = E.expo(P(lt, t0, t0 + .6));
          if (k <= 0) continue;
          ctx.save(); ctx.globalAlpha *= clamp(k * 1.4);
          if (k < .9) T(wd, x, 40 * (1 - k), { size: 150, font: 'Playfair', weight: 'italic 700', color: '#ffd9c4', alpha: (1 - k) * .5, glow: 'rgba(255,150,100,.9)', gb: 30 });
          T(wd, x, 40 * (1 - k), { size: 150, font: 'Playfair', weight: 'italic 700', grad: ['#ffffff', '#ffe7d6'], shadow: { c: 'rgba(0,0,0,.45)', x: 0, y: 6 } });
          ctx.restore();
        }
        const ul = E.expo(P(lt, .5, 1.0));
        if (ul > 0) { const g = ctx.createLinearGradient(-260, 0, 260, 0); g.addColorStop(0, 'rgba(255,200,140,0)'); g.addColorStop(.5, 'rgba(255,200,140,.95)'); g.addColorStop(1, 'rgba(255,200,140,0)'); ctx.fillStyle = g; ctx.fillRect(-260 * ul, 110, 520 * ul, 3); sparkle(0, 111, 12 * ul, '#ffe3a6', 0); }
        ctx.restore();
      }

      // ---- B/C: KOMEN + MOTION lockup (hero, then docks to the top)
      const dock = E.io(P(lt, 2.95, 3.45));
      const lockA = (1 - E.io(P(lt, 5.8, 6.1))) * (lt < 1.2 ? 0 : 1);
      if (lockA > 0 && lt < 7.0) {
        ctx.save(); ctx.globalAlpha = lockA;
        const ky = lerp(640, 232, dock), ksz = lerp(1, .52, dock), my = lerp(925, 392, dock), msz = lerp(1.02, .56, dock);
        // impact burst behind MOTION
        const ib = P(lt, 1.7, 2.6);
        if (ib > 0 && ib < 1) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          glowBlob(540, my, 900, 'rgba(255,150,80,.38)', (1 - ib));
          rays(540, my, 28, lt * .25, `rgba(255,200,140,${.06 * (1 - ib)})`);
          const rk = P(lt, 1.7, 2.15); if (rk < 1) { const rr_ = 380 + E.out(rk) * 900; ctx.strokeStyle = `rgba(255,220,180,${(1 - rk) * .35})`; ctx.lineWidth = 3 + 6 * (1 - rk); ctx.beginPath(); ctx.ellipse(540, my, rr_, rr_ * .3, 0, 0, 7); ctx.stroke(); }
          for (const sp of SPARKS) { const k = clamp((lt - 1.7) / sp.d); if (k >= 1) continue; const d = sp.v * E.out(k); ctx.fillStyle = `rgba(255,${200 + 40 * sp.r / 7 | 0},150,${1 - k})`; ctx.beginPath(); ctx.arc(540 + Math.cos(sp.a) * d, my + Math.sin(sp.a) * d * .6 + k * k * 120, sp.r * (1 - k * .5), 0, 7); ctx.fill(); }
          ctx.restore();
        }
        if (lt > 1.7) glowBlob(540, my, 700 * msz, 'rgba(255,130,70,.22)', 1 - dock * .4);
        // KOMEN: letters rise out of a mask, staggered
        const L = 'KOMEN'.split(''), lsz = 128, lsp = 34, widths = L.map(c => TW(c, lsz, 'Mont', 900));
        const tot = widths.reduce((s, v) => s + v, 0) + lsp * (L.length - 1);
        ctx.save(); ctx.translate(540, ky); ctx.scale(ksz, ksz);
        ctx.beginPath(); ctx.rect(-600, -95, 1200, 180); ctx.clip();
        let cx = -tot / 2;
        L.forEach((c, i) => {
          const k = E.expo(P(lt, 1.22 + i * .055, 1.62 + i * .055));
          T(c, cx + widths[i] / 2, (1 - k) * 150, { size: lsz, weight: 900, color: '#fff', alpha: clamp(k * 2), shadow: { c: 'rgba(0,0,0,.4)', x: 0, y: 6 } });
          cx += widths[i] + lsp;
        });
        ctx.restore();
        // MOTION slam
        const mk_ = P(lt, 1.52, 1.72);
        if (mk_ > 0) {
          const e = E.in(mk_), s = lerp(1.5, 1, e) * msz;
          const settle = 1 + .05 * Math.sin(P(lt, 1.72, 2.1) * Math.PI) * (lt > 1.72 ? 1 : 0);
          ctx.save(); ctx.globalAlpha *= clamp(mk_ * 2.5);
          if (mk_ < 1) for (let j = 1; j <= 3; j++) { const ej = E.in(clamp(mk_ - j * .1)); ctx.save(); ctx.globalAlpha *= .2 / j; drawMotion(540, my, lerp(1.5, 1, ej) * msz, lt, .5); ctx.restore(); }
          const flashG = 1 + .9 * (1 - P(lt, 1.72, 2.4)) * (lt > 1.72 ? 1 : 0);
          drawMotion(540, my, s * settle, lt, Math.min(2, flashG) * (1 + .12 * Math.sin(lt * 3)), [[2.15, 2.85], [4.4, 5.1]]);
          ctx.restore();
        }
        ctx.restore();
      }

      // ---- C: comment sheet (recedes when the DM arrives, then leaves for the end card)
      const rec = E.io(P(lt, 5.85, 6.3)), gone = E.io(P(lt, 6.8, 7.25));
      if (lt > 2.95 && gone < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - gone;
        ctx.translate(540, 1300); const s = 1 - rec * .05; ctx.scale(s, s); ctx.translate(-540, -1300 + gone * 300);
        drawSheet(lt);
        ctx.restore();
        if (rec > 0) { ctx.fillStyle = `rgba(6,4,10,${rec * .5 * (1 - gone)})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
      }
      // ---- D: DM
      drawDM(lt, 1 - E.io(P(lt, 6.8, 7.15)));
      // ---- E: end card
      drawEnd(lt, E.io(P(lt, 7.0, 7.4)));

      drawParts(lt, true, 1);
      // fade in from the previous scene's dip
      const fin = 1 - P(lt, 0, .3); if (fin > 0) { ctx.fillStyle = `rgba(0,0,0,${fin * .55})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
    },
  };
})();
