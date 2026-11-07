// SCENE: course — "AI MOTION CUAN" revealed as a premium product (8.0 s)
//  0.0–1.5  title lockup reveal (anamorphic flare, masked rise, gold light sweep)
//  1.5–4.9  title lifts, glass tablet floats up, 7 module cards + glowing bonus card fly in
//  4.9–8.0  bonus PDF lifts out -> visual 1-2-3 flow: PDF -> Claude chat -> finished video -> upload to platforms
(() => {
  const GOLD = ['#fff6dc', '#ffdc8e', '#e8a64a', '#a8611f'];
  const lazy = f => { let v = null; return () => v || (v = f()); };

  // ---------------------------------------------------------------- static art
  const BG = (() => {
    const c = mk(W + 200, H + 200), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, H + 200);
    gr.addColorStop(0, '#0b0918'); gr.addColorStop(.45, '#110b21'); gr.addColorStop(.8, '#0a0815'); gr.addColorStop(1, '#050409');
    g.fillStyle = gr; g.fillRect(0, 0, W + 200, H + 200);
    // soft nebula from low-res fbm, upscaled
    const n = mk(160, 284), ng = n.getContext('2d'), id = ng.createImageData(160, 284);
    for (let y = 0; y < 284; y++) for (let x = 0; x < 160; x++) {
      const v = clamp(fbm2(x / 38, y / 38, 4) * .9 + .25), w2 = clamp(fbm2(x / 30 + 9, y / 30 + 3, 3) + .1);
      const i = (y * 160 + x) * 4;
      id.data[i] = 120 * v + 90 * w2; id.data[i + 1] = 40 * v + 30 * w2; id.data[i + 2] = 150 * v + 40 * w2; id.data[i + 3] = 255 * v * .35;
    }
    ng.putImageData(id, 0, 0);
    g.save(); g.filter = 'blur(18px)'; g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55; g.drawImage(n, 0, 0, W + 200, H + 200); g.restore();
    return c;
  })();
  const BOKEH = (() => {
    const c = mk(128, 128), g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,236,210,1)'); gr.addColorStop(.55, 'rgba(255,220,180,.55)'); gr.addColorStop(.8, 'rgba(255,200,160,.25)'); gr.addColorStop(1, 'rgba(255,200,160,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); return c;
  })();
  const PARTS = Array.from({ length: 70 }, (_, i) => ({ x: h(i * 3.7) * 1300 - 110, y: h(i * 5.1 + 2) * 2100 - 90, z: h(i * 1.9 + 7), ph: h(i * 9.3) * 6.28, warm: h(i * 4.4) > .35 }));

  // tablet chassis (static, with soft shadow)
  const TBW = 860, TBH = 1150, TPAD = 120;
  const CHASSIS = (() => {
    const c = mk(TBW + TPAD * 2, TBH + TPAD * 2), g = c.getContext('2d');
    g.translate(TPAD, TPAD);
    g.save(); g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 90; g.shadowOffsetY = 50;
    g.fillStyle = '#0d0c13'; g.beginPath(); g.roundRect(0, 0, TBW, TBH, 64); g.fill(); g.restore();
    let gr = g.createLinearGradient(0, 0, TBW, TBH); gr.addColorStop(0, '#3a3746'); gr.addColorStop(.35, '#16151e'); gr.addColorStop(.7, '#121119'); gr.addColorStop(1, '#2b2836');
    g.fillStyle = gr; g.beginPath(); g.roundRect(0, 0, TBW, TBH, 64); g.fill();
    // rim light
    gr = g.createLinearGradient(0, 0, TBW * .6, TBH * .5); gr.addColorStop(0, 'rgba(255,225,200,.75)'); gr.addColorStop(.4, 'rgba(255,255,255,.08)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.strokeStyle = gr; g.lineWidth = 3; g.beginPath(); g.roundRect(1.5, 1.5, TBW - 3, TBH - 3, 63); g.stroke();
    gr = g.createLinearGradient(TBW, TBH, TBW * .5, TBH * .5); gr.addColorStop(0, 'rgba(140,170,255,.55)'); gr.addColorStop(1, 'rgba(140,170,255,0)');
    g.strokeStyle = gr; g.lineWidth = 2.5; g.beginPath(); g.roundRect(1.5, 1.5, TBW - 3, TBH - 3, 63); g.stroke();
    // screen
    gr = g.createLinearGradient(0, 18, 0, TBH - 18); gr.addColorStop(0, '#141227'); gr.addColorStop(.5, '#0e0d1b'); gr.addColorStop(1, '#0a0912');
    g.fillStyle = gr; g.beginPath(); g.roundRect(18, 18, TBW - 36, TBH - 36, 48); g.fill();
    const rg = g.createRadialGradient(TBW * .3, 120, 0, TBW * .3, 120, 700); rg.addColorStop(0, 'rgba(217,119,87,.16)'); rg.addColorStop(1, 'rgba(217,119,87,0)');
    g.fillStyle = rg; g.fillRect(18, 18, TBW - 36, TBH - 36);
    g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 2; g.beginPath(); g.roundRect(18, 18, TBW - 36, TBH - 36, 48); g.stroke();
    // camera dot
    g.fillStyle = '#05050a'; g.beginPath(); g.arc(TBW / 2, 9.5, 4, 0, 7); g.fill();
    return c;
  })();

  // title textures (lazy: fonts are ready only after load)
  const TITLE = lazy(() => {
    const top = mk(1000, 130), tg = top.getContext('2d');
    on(tg, () => {
      const s = 'AI MOTION', ls = 26, size = 74, w = TW(s, size, 'Mont', 800, ls);
      ctx.save(); ctx.font = `800 ${size}px Mont`; ctx.letterSpacing = ls + 'px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const g = ctx.createLinearGradient(0, 30, 0, 100); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfc8e4');
      ctx.fillStyle = g; ctx.fillText(s, 500 + ls / 2, 68); ctx.restore();
      const lg = (x0, x1) => { const g2 = ctx.createLinearGradient(x0, 0, x1, 0); g2.addColorStop(0, 'rgba(255,215,140,0)'); g2.addColorStop(1, 'rgba(255,215,140,.9)'); return g2; };
      const half = w / 2 + 30;
      ctx.fillStyle = lg(500 - half - 190, 500 - half); ctx.fillRect(500 - half - 190, 66, 190, 2.5);
      ctx.fillStyle = lg(500 + half + 190, 500 + half); ctx.fillRect(500 + half, 66, 190, 2.5);
      sparkle(500 - half - 4, 67, 9, '#ffe3a6', 0); sparkle(500 + half + 4, 67, 9, '#ffe3a6', 0);
    });
    const main = mk(1000, 330), mg = main.getContext('2d');
    const drawCuan = (g, fill) => { g.save(); g.font = `italic 900 270px Playfair`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.letterSpacing = '6px'; g.fillStyle = fill; g.fillText('CUAN', 503, 260); g.restore(); };
    mg.save(); mg.translate(0, 10); drawCuan(mg, 'rgba(40,10,0,.55)'); mg.restore();
    const gg = mg.createLinearGradient(0, 70, 0, 270); gg.addColorStop(0, GOLD[0]); gg.addColorStop(.38, GOLD[1]); gg.addColorStop(.7, GOLD[2]); gg.addColorStop(1, GOLD[3]);
    drawCuan(mg, gg);
    // fine top edge highlight
    mg.save(); mg.globalCompositeOperation = 'source-atop'; const hl = mg.createLinearGradient(0, 70, 0, 150); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); mg.fillStyle = hl; mg.fillRect(0, 0, 1000, 160); mg.restore();
    const glow = mk(1000, 330), gl = glow.getContext('2d');
    gl.filter = 'blur(26px)'; drawCuan(gl, '#ff9a3c'); gl.filter = 'none';
    const tglow = mk(1000, 130), tgl = tglow.getContext('2d'); tgl.filter = 'blur(14px)'; tgl.drawImage(top, 0, 0); tgl.filter = 'none';
    return { top, main, glow, tglow };
  });

  // ---------------------------------------------------------------- small drawing helpers
  function cloud(x, y, r, c1 = '#ffffff', c2 = '#dfe8f4') {
    ctx.fillStyle = c2;
    for (const [dx, dy, k] of [[0, .18, 1], [-.95, .4, .7], [.95, .38, .74]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, k * r, 0, 7); ctx.fill(); }
    ctx.fillStyle = c1;
    for (const [dx, dy, k] of [[0, 0, 1], [-.9, .25, .68], [.9, .22, .72], [.35, -.45, .7]]) { ctx.beginPath(); ctx.arc(x + dx * r, y + dy * r, k * r, 0, 7); ctx.fill(); }
  }
  function ridge(w, hh, base, amp, freq, seed, fill) {
    ctx.beginPath(); ctx.moveTo(-5, hh + 5);
    for (let x = -5; x <= w + 10; x += 10) ctx.lineTo(x, base + noise1(x * freq + seed) * amp);
    ctx.lineTo(w + 10, hh + 5); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function vgrad(y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }

  // PDF document icon, centered at (x,y), 160x210 at s=1
  function docIcon(x, y, s, rot = 0, a = 1) {
    if (a <= 0 || s <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12;
    ctx.fillStyle = vgrad(-105, 105, ['#ffffff', '#efe9dd']);
    ctx.beginPath(); ctx.moveTo(-80, -105); ctx.lineTo(40, -105); ctx.lineTo(80, -65); ctx.lineTo(80, 105); ctx.quadraticCurveTo(80, 105, 70, 105); ctx.lineTo(-70, 105); ctx.quadraticCurveTo(-80, 105, -80, 95); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#d9d0bf'; ctx.beginPath(); ctx.moveTo(40, -105); ctx.lineTo(40, -65); ctx.lineTo(80, -65); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d8d2c6'; for (let i = 0; i < 4; i++) { rr(-56, -70 + i * 22, i === 3 ? 60 : 100 - i * 8, 8, 4); ctx.fill(); }
    ctx.fillStyle = vgrad(18, 70, ['#ff4d5e', '#c81e3a']); rr(-98, 22, 132, 54, 10); ctx.fill();
    T('PDF', -32, 51, { size: 38, font: 'Anton', color: '#fff', ls: 2 });
    sparkle(52, 72, 14, '#e9a94b', .3);
    ctx.restore();
  }
  function uploadGlyph(x, y, r, c = '#fff') {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = c; ctx.lineWidth = r * .16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(0, r * .3); ctx.lineTo(0, -r * .45); ctx.moveTo(-r * .32, -r * .15); ctx.lineTo(0, -r * .47); ctx.lineTo(r * .32, -r * .15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * .5, r * .2); ctx.lineTo(-r * .5, r * .5); ctx.lineTo(r * .5, r * .5); ctx.lineTo(r * .5, r * .2); ctx.stroke(); ctx.restore();
  }


  // small original character for the 'finished video' (girl flying a kite on a windy hill)
  function heroGirl(w, hh, t) {
    const u = hh / 450, fx = w * .3, fy = hh * .86 + 4 * u;
    const kx = w * .66 + noise1(t * .7) * 30 * u, ky = hh * .2 + noise1(t * .9 + 5) * 18 * u, hx = fx + 24 * u, hy = fy - 92 * u;
    // string + kite
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.4 * u; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(lerp(hx, kx, .5), lerp(hy, ky, .5) + 50 * u, kx, ky); ctx.stroke();
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(.25 + noise1(t * 1.3) * .15);
    ctx.fillStyle = CORAL; ctx.beginPath(); ctx.moveTo(0, -30 * u); ctx.lineTo(22 * u, 0); ctx.lineTo(0, 40 * u); ctx.lineTo(-22 * u, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd36b'; ctx.beginPath(); ctx.moveTo(0, -30 * u); ctx.lineTo(22 * u, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(0, 40 * u);
    for (let k = 1; k <= 8; k++) ctx.lineTo(Math.sin(t * 6 + k * .9) * 7 * u - k * 3 * u, 40 * u + k * 9 * u); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(fx, fy);
    // legs
    ctx.strokeStyle = '#3a2a24'; ctx.lineWidth = 5 * u; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6 * u, -30 * u); ctx.lineTo(-8 * u, 0); ctx.moveTo(6 * u, -30 * u); ctx.lineTo(8 * u, 0); ctx.stroke();
    // scarf trailing in the wind
    ctx.fillStyle = '#d8423a'; ctx.beginPath(); ctx.moveTo(-6 * u, -84 * u);
    for (let k = 0; k <= 6; k++) ctx.lineTo(-6 * u - k * 9 * u, -84 * u + Math.sin(t * 7 - k * .9) * 4 * u * k * .5 + k * 1.5 * u);
    for (let k = 6; k >= 0; k--) ctx.lineTo(-6 * u - k * 9 * u, -76 * u + Math.sin(t * 7 - k * .9) * 4 * u * k * .5 + k * 1.5 * u);
    ctx.closePath(); ctx.fill();
    // dress
    const fl = Math.sin(t * 5) * 4 * u;
    ctx.fillStyle = vgrad(-80 * u, -26 * u, ['#ffffff', '#cfdcf0']);
    ctx.beginPath(); ctx.moveTo(-9 * u, -82 * u); ctx.lineTo(9 * u, -82 * u); ctx.quadraticCurveTo(16 * u, -50 * u, 22 * u + fl * .3, -26 * u); ctx.quadraticCurveTo(0, -22 * u + fl, -26 * u + fl, -28 * u); ctx.quadraticCurveTo(-16 * u, -50 * u, -9 * u, -82 * u); ctx.fill();
    // raised arm
    ctx.strokeStyle = '#f0c6a2'; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(6 * u, -78 * u); ctx.quadraticCurveTo(20 * u, -84 * u, 24 * u, -92 * u); ctx.stroke();
    // head + hair blowing
    ctx.fillStyle = '#3b2418'; ctx.beginPath(); ctx.moveTo(-2 * u, -112 * u);
    for (let k = 0; k <= 5; k++) ctx.lineTo(-10 * u - k * 5 * u, -108 * u + k * 4 * u + Math.sin(t * 8 - k) * 2.5 * u);
    ctx.lineTo(-6 * u, -88 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2c9a5'; ctx.beginPath(); ctx.arc(2 * u, -98 * u, 11 * u, 0, 7); ctx.fill();
    ctx.fillStyle = '#3b2418'; ctx.beginPath(); ctx.arc(0, -101 * u, 12 * u, Math.PI * .9, Math.PI * 2.05); ctx.fill();
    ctx.strokeStyle = 'rgba(255,236,190,.9)'; ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.arc(2 * u, -98 * u, 11 * u, -1.2, .6); ctx.stroke();
    ctx.restore();
  }

  // ---------------------------------------------------------------- animated thumbnails (local 0..w, 0..hh)
  const TH = {
    ghibli(w, hh, t, hero) {
      const s = hh / 160, gs = hero ? s * .55 : s;
      ctx.fillStyle = vgrad(0, hh, ['#5fa8e3', '#a9d6ef', '#f6e1b9']); ctx.fillRect(0, 0, w, hh);
      glowBlob(w * .8, hh * .2, 110 * gs, 'rgba(255,244,214,.95)', .9);
      const nc = hero ? 6 : 4;
      for (let i = 0; i < nc; i++) { const sp = (6 + i * 3) * gs, span = w + 160 * gs; const cx = ((((i + .5) / nc + h(i * 3.1) * .15) * span + t * sp) % span) - 70 * gs; cloud(cx, hh * (.12 + h(i + 7) * .22), (13 + h(i + 2) * 10) * gs); }
      ridge(w, hh, hh * .56, 10 * s, .006 / s, 3, '#9cc7b4');
      ridge(w, hh, hh * .68, 12 * s, .008 / s, 11, vgrad(hh * .6, hh, ['#7fbf6a', '#4f9447']));
      // house + tree on the mid hill
      const hx = w * .64, hy = hh * .66 + noise1(hx * .008 / s + 11) * 12 * s;
      ctx.fillStyle = '#f7f1e3'; ctx.fillRect(hx - 9 * s, hy - 12 * s, 18 * s, 12 * s);
      ctx.fillStyle = '#c8473b'; ctx.beginPath(); ctx.moveTo(hx - 12 * s, hy - 11 * s); ctx.lineTo(hx, hy - 21 * s); ctx.lineTo(hx + 12 * s, hy - 11 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2f6b35'; for (const [dx, dy, r] of [[-26, -14, 9], [-33, -8, 7], [-20, -6, 7]]) { ctx.beginPath(); ctx.arc(hx + dx * s, hy + dy * s, r * s, 0, 7); ctx.fill(); }
      ridge(w, hh, hh * .84, 9 * s, .01 / s, 21, vgrad(hh * .78, hh, ['#4a9a3e', '#2c6a2a']));
      if (hero) heroGirl(w, hh, t);
      ctx.strokeStyle = 'rgba(160,220,120,.8)'; ctx.lineWidth = 1.4 * gs; ctx.lineCap = 'round';
      const ng = hero ? 90 : 26;
      for (let i = 0; i < ng; i++) { const x = i / (ng - 1) * w, b = hh * .84 + noise1(x * .01 / s + 21) * 9 * s + 3 * s, sw = noise2(i * .7, t * .9) * 6 * gs; ctx.beginPath(); ctx.moveTo(x, b + 4 * gs); ctx.quadraticCurveTo(x + sw * .3, b - 6 * gs, x + sw, b - 12 * gs - h(i) * 6 * gs); ctx.stroke(); }
    },
    bolly(w, hh, t) {
      const s = hh / 160, cx = w * .5, by = hh * .98;
      const g = ctx.createRadialGradient(cx, by, 0, cx, by, w * .75); g.addColorStop(0, '#ffe07a'); g.addColorStop(.3, '#ff8a3d'); g.addColorStop(.65, '#d81f6a'); g.addColorStop(1, '#4b0a3c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hh);
      rays(cx, by, 18, t * .35, 'rgba(255,235,170,.13)');
      for (let i = 0; i < 12; i++) { const tw = .5 + .5 * Math.sin(t * 4 + i * 2.3); sparkle(h(i * 2.2) * w, h(i * 3.3) * hh * .7, (3 + h(i) * 5) * s * tw, '#fff1b8', i); }
      // garlands
      for (let gi = 0; gi < 2; gi++) for (let i = 0; i <= 16; i++) { const x = i / 16 * w, y = (gi ? 18 : 6) * s + Math.sin(i / 16 * Math.PI) * (16 + gi * 8) * s; ctx.fillStyle = i % 2 ? '#ffb11c' : '#ff7a1a'; ctx.beginPath(); ctx.arc(x, y, 4.6 * s, 0, 7); ctx.fill(); }
      // dancer silhouette (twirl)
      const tw = Math.sin(t * 5), sk = (40 + 9 * tw) * s, bob = Math.abs(Math.sin(t * 5)) * 2 * s;
      ctx.save(); ctx.translate(cx, by - bob);
      ctx.fillStyle = '#3a0a2b';
      ctx.beginPath(); ctx.moveTo(-8 * s, -62 * s); ctx.bezierCurveTo(-20 * s, -40 * s, -sk, -18 * s, -sk - 4 * s, -4 * s); ctx.quadraticCurveTo(0, 4 * s * tw, sk + 4 * s, -4 * s); ctx.bezierCurveTo(sk, -18 * s, 20 * s, -40 * s, 8 * s, -62 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,120,.85)'; ctx.lineWidth = 1.6 * s; ctx.beginPath(); ctx.moveTo(-sk - 4 * s, -4 * s); ctx.quadraticCurveTo(0, 4 * s * tw, sk + 4 * s, -4 * s); ctx.stroke();
      ctx.fillStyle = '#3a0a2b'; rr(-9 * s, -92 * s, 18 * s, 34 * s, 8 * s); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -102 * s, 10 * s, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(7 * s, -110 * s, 6 * s, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a0a2b'; ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
      const a1 = Math.sin(t * 5 + 1) * 6 * s;
      ctx.beginPath(); ctx.moveTo(6 * s, -86 * s); ctx.quadraticCurveTo(26 * s, -100 * s, 22 * s + a1, -132 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-6 * s, -86 * s); ctx.quadraticCurveTo(-30 * s, -84 * s, -46 * s, -100 * s - a1); ctx.stroke();
      // dupatta
      ctx.strokeStyle = 'rgba(255,200,90,.75)'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(-8 * s, -88 * s);
      ctx.bezierCurveTo(-40 * s, -70 * s + noise1(t * 2) * 10 * s, -60 * s, -40 * s, -78 * s + tw * 8 * s, -30 * s); ctx.stroke();
      ctx.restore();
    },
    sejarah(w, hh, t) {
      const s = hh / 160, px = -t * 5 * s;
      ctx.fillStyle = vgrad(0, hh, ['#f7e2b0', '#e8b774', '#b06a35']); ctx.fillRect(0, 0, w, hh);
      glowBlob(w * .7, hh * .55, 90 * s, 'rgba(255,248,220,.9)', .9);
      ctx.fillStyle = '#fff3d2'; ctx.beginPath(); ctx.arc(w * .7, hh * .55, 26 * s, 0, 7); ctx.fill();
      ridge(w, hh, hh * .7, 14 * s, .007 / s, 40 + t * .02, 'rgba(176,110,62,.55)');
      // stepped temple
      ctx.save(); ctx.translate(w * .36 + px, hh * .9); ctx.fillStyle = '#5b3419';
      const tiers = [[150, 14], [124, 14], [100, 14], [76, 13], [52, 12]]; let y = 0;
      for (const [tw, th] of tiers) { ctx.fillRect(-tw / 2 * s, (y - th) * s, tw * s, th * s); y -= th; }
      ctx.beginPath(); ctx.arc(0, (y - 9) * s, 14 * s, Math.PI, 0); ctx.fill(); ctx.fillRect(-2.5 * s, (y - 36) * s, 5 * s, 16 * s);
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 22 * s, -46 * s, 5 * s, Math.PI, 0); ctx.fill(); }
      ctx.restore();
      // palms
      for (const [px0, sc] of [[.08, 1], [.88, .85], [.97, .7]]) {
        const x = w * px0 + px * .6, b = hh * .95, sz = 60 * s * sc;
        ctx.strokeStyle = '#4a2914'; ctx.lineWidth = 4 * s * sc; ctx.beginPath(); ctx.moveTo(x, b); ctx.quadraticCurveTo(x + 8 * s, b - sz * .6, x + 4 * s, b - sz); ctx.stroke();
        ctx.fillStyle = '#4a2914';
        for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .6 + noise1(t + k) * .05; ctx.save(); ctx.translate(x + 4 * s, b - sz); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(sz * .32, 0, sz * .34, 4 * s * sc, .3, 0, 7); ctx.fill(); ctx.restore(); }
      }
      ctx.fillStyle = '#4a2914'; ctx.fillRect(0, hh * .94, w, hh * .1);
      ctx.strokeStyle = 'rgba(70,40,20,.8)'; ctx.lineWidth = 1.5 * s;
      for (let i = 0; i < 3; i++) { const bx = ((t * 22 + i * 60) * s) % (w + 40 * s) - 20 * s, byy = hh * (.22 + i * .07), f = Math.sin(t * 9 + i) * 3 * s; ctx.beginPath(); ctx.moveTo(bx - 6 * s, byy - f); ctx.lineTo(bx, byy); ctx.lineTo(bx + 6 * s, byy - f); ctx.stroke(); }
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45; ctx.drawImage(PAPER, 0, 0, w, hh); ctx.restore();
    },
    mangacrayon(w, hh, t) {
      const s = hh / 160, boil = Math.floor(t * 8);
      // crayon half
      ctx.drawImage(PAPER, 0, 0, w, hh);
      const R2 = mulberry(boil * 7 + 3);
      const scrib = (fn, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw * s; ctx.lineCap = 'round'; ctx.beginPath(); fn(R2); ctx.stroke(); };
      const sx = w * .8, sy = hh * .32;
      scrib(r => { for (let k = 0; k < 3; k++) { for (let a = 0; a <= 6.4; a += .4) { const rr2 = (20 + r() * 3) * s; ctx.lineTo(sx + Math.cos(a) * rr2, sy + Math.sin(a) * rr2); } } }, '#ffb300', 5);
      scrib(r => { for (let k = 0; k < 9; k++) { const a = k / 9 * 6.28 + t * .6; ctx.moveTo(sx + Math.cos(a) * 28 * s, sy + Math.sin(a) * 28 * s); ctx.lineTo(sx + Math.cos(a) * (40 + r() * 4) * s, sy + Math.sin(a) * (40 + r() * 4) * s); } }, '#ff8f00', 4);
      const hx = w * .74, hy = hh * .86;
      scrib(r => { for (let k = 0; k < 7; k++) { const y = hy - 34 * s + k * 5 * s + r() * 2 * s; ctx.moveTo(hx - 22 * s, y); ctx.lineTo(hx + 22 * s, y + r() * 3 * s); } }, '#e53935', 5);
      scrib(r => { ctx.moveTo(hx - 28 * s, hy - 34 * s); ctx.lineTo(hx, hy - 58 * s + r() * 3 * s); ctx.lineTo(hx + 28 * s, hy - 34 * s); }, '#1e63d6', 5);
      scrib(r => { ctx.moveTo(w * .5, hh * .97); for (let x = w * .5; x < w; x += 8 * s) ctx.lineTo(x, hh * .97 - (x / (8 * s) % 2 ? 10 : 0) * s - r() * 3 * s); }, '#2e9d3a', 4);
      ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = .18; ctx.fillStyle = TOOTHPAT; ctx.fillRect(0, 0, w, hh); ctx.restore();
      // manga half (diagonal)
      ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * .58, 0); ctx.lineTo(w * .42, hh); ctx.lineTo(0, hh); ctx.closePath(); ctx.clip();
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, hh);
      const fx = w * .24, fy = hh * .5, R3 = mulberry(Math.floor(t * 12) + 11);
      ctx.fillStyle = '#111';
      for (let k = 0; k < 64; k++) { const a = k / 64 * 6.283 + R3() * .05, wd = .012 + R3() * .03, r0 = (34 + R3() * 26) * s; ctx.beginPath(); ctx.moveTo(fx + Math.cos(a) * r0, fy + Math.sin(a) * r0); ctx.lineTo(fx + Math.cos(a - wd) * 400 * s, fy + Math.sin(a - wd) * 400 * s); ctx.lineTo(fx + Math.cos(a + wd) * 400 * s, fy + Math.sin(a + wd) * 400 * s); ctx.closePath(); ctx.fill(); }
      ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = HALFPAT; ctx.fillRect(0, hh * .72, w, hh); ctx.restore();
      const pz = 1 + .06 * Math.max(0, Math.sin(t * 6));
      T('ドン', fx, fy, { size: 46 * s, font: 'IPAGothic', weight: 900, color: '#111', stroke: '#fff', sw: 7 * s, sc: pz, rot: -.12 });
      ctx.restore();
      ctx.strokeStyle = '#111'; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(w * .58, 0); ctx.lineTo(w * .42, hh); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5 * s; ctx.stroke();
    },
    story(w, hh, t) {
      const s = hh / 160, cx = w * .5, by = hh * .9;
      ctx.fillStyle = vgrad(0, hh, ['#0c1540', '#2c2668', '#6a3f86']); ctx.fillRect(0, 0, w, hh);
      for (let i = 0; i < 22; i++) { const tw = .4 + .6 * (.5 + .5 * Math.sin(t * 3 + i * 1.7)); ctx.fillStyle = `rgba(255,255,255,${tw * .8})`; ctx.beginPath(); ctx.arc(h(i * 1.3) * w, h(i * 2.9) * hh * .6, (.8 + h(i) * 1.4) * s, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#ffeec2'; ctx.beginPath(); ctx.arc(w * .82, hh * .22, 14 * s, 0, 7); ctx.fill(); ctx.fillStyle = '#2a2565'; ctx.beginPath(); ctx.arc(w * .82 + 6 * s, hh * .22 - 4 * s, 12 * s, 0, 7); ctx.fill();
      glowBlob(cx, by - 30 * s, 90 * s, 'rgba(255,200,120,.9)', .85);
      // castle silhouette in the glow
      ctx.fillStyle = 'rgba(255,225,170,.55)'; ctx.save(); ctx.translate(cx, by - 40 * s - 6 * s * Math.sin(t * 1.5));
      ctx.fillRect(-26 * s, -20 * s, 52 * s, 20 * s); ctx.fillRect(-26 * s, -36 * s, 10 * s, 16 * s); ctx.fillRect(16 * s, -36 * s, 10 * s, 16 * s); ctx.fillRect(-6 * s, -46 * s, 12 * s, 26 * s);
      ctx.beginPath(); ctx.moveTo(-8 * s, -46 * s); ctx.lineTo(0, -58 * s); ctx.lineTo(8 * s, -46 * s); ctx.fill(); ctx.restore();
      // open book
      ctx.fillStyle = '#e9dcbc';
      ctx.beginPath(); ctx.moveTo(cx, by - 12 * s); ctx.quadraticCurveTo(cx - 40 * s, by - 26 * s, cx - 80 * s, by - 16 * s); ctx.lineTo(cx - 80 * s, by + 6 * s); ctx.quadraticCurveTo(cx - 40 * s, by - 4 * s, cx, by + 8 * s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, by - 12 * s); ctx.quadraticCurveTo(cx + 40 * s, by - 26 * s, cx + 80 * s, by - 16 * s); ctx.lineTo(cx + 80 * s, by + 6 * s); ctx.quadraticCurveTo(cx + 40 * s, by - 4 * s, cx, by + 8 * s); ctx.closePath(); ctx.fill();
      const ph = (t * .8) % 1, fl = Math.cos(ph * Math.PI);  // flipping page
      ctx.fillStyle = '#fff6dd'; ctx.beginPath(); ctx.moveTo(cx, by - 12 * s); ctx.quadraticCurveTo(cx + 40 * s * fl, by - 30 * s - 14 * s * Math.sin(ph * Math.PI), cx + 78 * s * fl, by - 18 * s); ctx.lineTo(cx + 78 * s * fl, by + 4 * s); ctx.quadraticCurveTo(cx + 40 * s * fl, by - 6 * s, cx, by + 8 * s); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 10; i++) { const k = (t * .5 + h(i * 4.1)) % 1, x = cx + (h(i * 2.7) - .5) * 110 * s + Math.sin(t * 2 + i) * 6 * s, y = by - 10 * s - k * 120 * s; sparkle(x, y, (2 + h(i) * 3) * s * (1 - k), '#ffe7b0', t + i); }
    },
    affiliate(w, hh, t) {
      const s = hh / 160;
      ctx.fillStyle = vgrad(0, hh, ['#ffd9c9', '#ffc0cf', '#f59ab9']); ctx.fillRect(0, 0, w, hh);
      glowBlob(w * .62, hh * .55, 80 * s, 'rgba(255,255,255,.8)', .7);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(w * .62, hh * .9, 54 * s, 12 * s, 0, 0, 7); ctx.fill();
      // product bottle
      const bb = Math.sin(t * 2.4) * 3 * s; ctx.save(); ctx.translate(w * .62, hh * .86 + bb);
      ctx.fillStyle = vgrad(-90 * s, 0, ['#38d6c4', '#0f8f86']); rr(-22 * s, -78 * s, 44 * s, 78 * s, 12 * s); ctx.fill();
      ctx.fillStyle = '#1a1a2e'; rr(-12 * s, -96 * s, 24 * s, 20 * s, 5 * s); ctx.fill();
      ctx.fillStyle = '#fff'; rr(-22 * s, -50 * s, 44 * s, 20 * s, 2 * s); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.5)'; rr(-16 * s, -72 * s, 6 * s, 60 * s, 3 * s); ctx.fill(); ctx.restore();
      // cute original mascot
      const br = 1 + Math.sin(t * 3) * .03, cx = w * .25, cy = hh * .74;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, br);
      ctx.fillStyle = vgrad(-40 * s, 40 * s, ['#ffa07f', CORAL, '#b9573a']); ctx.beginPath(); ctx.ellipse(0, 0, 36 * s, 40 * s, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = CORAL; ctx.lineWidth = 7 * s; ctx.lineCap = 'round'; const pt = Math.sin(t * 4) * 4 * s;
      ctx.beginPath(); ctx.moveTo(30 * s, 0); ctx.quadraticCurveTo(52 * s, -6 * s, 64 * s + pt, -18 * s); ctx.stroke();
      const bl = (t % 3) > 2.85 ? .15 : 1;
      for (const ex of [-12, 12]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex * s, -10 * s, 7 * s, 9 * s * bl, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#22142a'; ctx.beginPath(); ctx.arc(ex * s + 2 * s, -9 * s, 4 * s * bl, 0, 7); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,110,120,.6)'; ctx.beginPath(); ctx.arc(-22 * s, 6 * s, 5 * s, 0, 7); ctx.arc(22 * s, 6 * s, 5 * s, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a1a1a'; ctx.lineWidth = 2.4 * s; ctx.beginPath(); ctx.arc(0, 4 * s, 7 * s, .2, Math.PI - .2); ctx.stroke();
      ctx.restore();
      // cart bubble +1
      const ph = (t % 1.4) / 1.4, pp = E.back(clamp(ph * 4)), fade = 1 - P(ph, .7, 1);
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(w * .86, hh * .26 - ph * 10 * s); ctx.scale(pp, pp);
      ctx.fillStyle = '#ff2f6d'; rr(-30 * s, -18 * s, 60 * s, 36 * s, 18 * s); ctx.fill();
      T('+1', 0, 1 * s, { size: 22 * s, weight: 900, color: '#fff' }); ctx.restore();
      for (let i = 0; i < 5; i++) { const k = (t * .7 + i / 5) % 1; ctx.fillStyle = `rgba(255,214,90,${1 - k})`; ctx.beginPath(); ctx.arc(w * (.45 + h(i) * .4), hh * (.8 - k * .7), 4 * s, 0, 7); ctx.fill(); }
    },
    money(w, hh, t) {
      const s = hh / 160;
      ctx.fillStyle = vgrad(0, hh, ['#052a22', '#0b3d30', '#071f19']); ctx.fillRect(0, 0, w, hh);
      ctx.strokeStyle = 'rgba(120,255,200,.07)'; ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24 * s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, hh); ctx.stroke(); }
      for (let y = 0; y < hh; y += 24 * s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      const n = 14, k = E.out(clamp(((t % 3.2) / 3.2) * 1.7)), pts = [];
      for (let i = 0; i < n; i++) { const u = i / (n - 1); pts.push([w * (.06 + .86 * u), hh * (.86 - .68 * Math.pow(u, 1.5) + (h(i * 5.3) - .5) * .1 * (1 - u))]); }
      const m = 1 + k * (n - 2), mi = Math.floor(m), mf = m - mi;
      const vis = pts.slice(0, mi + 1); if (mi < n - 1) vis.push([lerp(pts[mi][0], pts[mi + 1][0], mf), lerp(pts[mi][1], pts[mi + 1][1], mf)]);
      ctx.beginPath(); ctx.moveTo(vis[0][0], hh); vis.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(vis[vis.length - 1][0], hh); ctx.closePath();
      ctx.fillStyle = vgrad(hh * .2, hh, ['rgba(80,240,170,.45)', 'rgba(80,240,170,0)']); ctx.fill();
      ctx.beginPath(); vis.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = 'rgba(90,255,180,.35)'; ctx.lineWidth = 9 * s; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.strokeStyle = '#8affc8'; ctx.lineWidth = 3.2 * s; ctx.stroke();
      const e = vis[vis.length - 1]; glowBlob(e[0], e[1], 26 * s, 'rgba(160,255,210,.9)', 1); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(e[0], e[1], 4 * s, 0, 7); ctx.fill();
      for (let i = 0; i < 6; i++) {
        const u = (t * .55 + h(i * 3.9)) % 1, x = w * (.1 + h(i * 7.7) * .8), y = hh * (1.1 - u * 1.1), sx = Math.cos(t * 4 + i * 2);
        ctx.save(); ctx.globalAlpha = 1 - P(u, .7, 1); ctx.translate(x, y); ctx.scale(sx, 1);
        ctx.fillStyle = '#e8a93a'; ctx.beginPath(); ctx.arc(0, 0, 9 * s, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(0, 0, 6.5 * s, 0, 7); ctx.fill(); ctx.restore();
      }
    },
    bonus(w, hh, t) {
      const s = hh / 160;
      const g = ctx.createRadialGradient(w * .5, hh * .55, 0, w * .5, hh * .55, w * .7); g.addColorStop(0, '#8a5714'); g.addColorStop(.5, '#4a2c0b'); g.addColorStop(1, '#1c1005');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, hh);
      rays(w * .5, hh * .55, 14, t * .3, 'rgba(255,215,130,.10)');
      glowBlob(w * .5, hh * .55, 80 * s, 'rgba(255,200,110,.85)', .8);
      docIcon(w * .5, hh * .55 + Math.sin(t * 2) * 3 * s, .55 * s, -.06 + Math.sin(t * 1.3) * .03);
      for (let i = 0; i < 9; i++) { const tw = .5 + .5 * Math.sin(t * 3.4 + i * 2.1); sparkle(w * (.15 + h(i * 3.1) * .7), hh * (.12 + h(i * 1.7) * .76), (3 + h(i * 2) * 5) * s * tw, '#ffe7a8', t * .5 + i); }
      ctx.fillStyle = vgrad(10 * s, 34 * s, ['#ffe6a3', '#e3a443']); rr(12 * s, 12 * s, 66 * s, 22 * s, 11 * s); ctx.fill();
      T('BONUS', 45 * s, 23.5 * s, { size: 13 * s, weight: 900, color: '#4a2a06', ls: 1.5 * s });
    },
  };

  const MODS = [
    ['Gaya Ghibli', 'ghibli'], ['Bollywood', 'bolly'], ['Sejarah', 'sejarah'], ['Manga & Crayon', 'mangacrayon'],
    ['Storytelling', 'story'], ['TikTok Affiliate', 'affiliate'], ['Monetisasi', 'money'], ['Prompt Pack PDF', 'bonus'],
  ];
  const CW = 376, CH = 237, CTH = 160;
  const cellXY = i => [44 + (i % 2) * (CW + 20), 100 + Math.floor(i / 2) * (CH + 20)];
  const T_CARD = i => i < 7 ? 1.9 + i * .17 : 3.22;

  function cardCanvas(i, lt) {
    const [label, th] = MODS[i], bonus = i === 7;
    return paint('crs_card' + i, () => {
      ctx.save(); rr(0, 0, CW, CH, 22); ctx.clip();
      ctx.fillStyle = '#15131f'; ctx.fillRect(0, 0, CW, CH);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, CW, CTH); ctx.clip(); TH[th](CW, CTH, lt + i * 1.7);
      ctx.fillStyle = vgrad(0, CTH * .5, ['rgba(255,255,255,.14)', 'rgba(255,255,255,0)']); ctx.fillRect(0, 0, CW, CTH * .5);
      ctx.restore();
      ctx.fillStyle = bonus ? vgrad(CTH, CH, ['#3d2a0e', '#1f1507']) : vgrad(CTH, CH, ['#1f1c2e', '#14121f']); ctx.fillRect(0, CTH, CW, CH - CTH);
      ctx.fillStyle = bonus ? 'rgba(255,214,130,.35)' : 'rgba(255,255,255,.08)'; ctx.fillRect(0, CTH, CW, 1.5);
      T(label, 22, CTH + (CH - CTH) / 2 + 2, { size: 29, weight: 800, align: 'left', color: bonus ? '#ffdc8e' : '#f4f1fb', maxW: CW - 80 });
      if (!bonus) T(String(i + 1).padStart(2, '0'), CW - 22, CTH + (CH - CTH) / 2 + 2, { size: 20, weight: 700, color: 'rgba(255,255,255,.3)', align: 'right' });
      else { sparkle(CW - 34, CTH + (CH - CTH) / 2, 15, '#ffdc8e', 0); sparkle(CW - 34, CTH + (CH - CTH) / 2, 6, '#fff', 0); }
      ctx.restore();
      ctx.lineWidth = bonus ? 3 : 2;
      if (bonus) { const g = ctx.createLinearGradient(0, 0, CW, CH); g.addColorStop(0, '#fff0c4'); g.addColorStop(.5, '#e2a447'); g.addColorStop(1, '#ffe3a0'); ctx.strokeStyle = g; }
      else ctx.strokeStyle = 'rgba(255,255,255,.13)';
      rr(1.5, 1.5, CW - 3, CH - 3, 21); ctx.stroke();
    }, CW, CH);
  }

  // tablet transform (center, rotation, scale) in camera space
  function tabXf(lt) {
    const k = E.expo(P(lt, 1.55, 2.4));
    return { cx: 540 + noise1(lt * .4 + 3) * 4, cy: 1125 + (1 - k) * 1250 + Math.sin(lt * 1.3) * 6, rot: -.012 + Math.sin(lt * .9) * .004 + (1 - k) * .14, sc: .9 + .1 * k };
  }
  const camZ = lt => 1 + .035 * E.sine(P(lt, 1.6, 5.2));

  function drawTitle(lt) {
    const tx = TITLE();
    const mv = E.io(P(lt, 1.3, 1.9));
    const ty = lerp(850, 245, mv), my = lerp(1010, 395, mv), sc = lerp(1, .74, mv);
    const tsc = lerp(1, .82, mv);
    // anamorphic flare across the title line
    const fl = P(lt, 0, 1.1); if (fl < 1) {
      const a = Math.sin(fl * Math.PI) * .9, wd = 200 + E.expo(fl) * 900;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.translate(540, 925); ctx.scale(1, .035);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, wd); g.addColorStop(0, 'rgba(255,240,220,1)'); g.addColorStop(.3, 'rgba(255,170,110,.6)'); g.addColorStop(1, 'rgba(255,120,80,0)');
      ctx.fillStyle = g; ctx.fillRect(-wd, -wd, wd * 2, wd * 2); ctx.restore();
      glowBlob(540, 925, 380, 'rgba(255,150,90,.35)', a);
    }
    // eyebrow
    const ea = fi(lt, .95, .4) * (1 - mv);
    T('KELAS ONLINE', 540, ty - 92 * tsc, { size: 26, weight: 800, color: CORAL, ls: 12, alpha: ea });
    // "AI MOTION" center-out mask reveal
    const rk = E.expo(P(lt, .25, 1.05));
    if (rk > 0) {
      ctx.save(); ctx.translate(540, ty); ctx.scale(tsc, tsc);
      ctx.beginPath(); ctx.rect(-500 * rk, -65, 1000 * rk, 130); ctx.clip();
      ctx.globalAlpha = clamp(rk * 1.6);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= .35; ctx.drawImage(tx.tglow, -500, -65); ctx.restore();
      ctx.drawImage(tx.top, -500, -65); ctx.restore();
    }
    // "CUAN" masked rise
    const ck = E.expo(P(lt, .45, 1.35));
    if (ck > 0) {
      ctx.save(); ctx.translate(540, my); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.rect(-520, -180, 1040, 300 + 60); ctx.clip();
      const oy = (1 - ck) * 210;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .45 + .55 * (1 - ck) + .12 * Math.sin(lt * 2.2); ctx.drawImage(tx.glow, -500, -165 + oy); ctx.restore();
      ctx.drawImage(tx.main, -500, -165 + oy);
      // gold light sweep
      for (const [s0, s1] of [[1.0, 1.75], [4.2, 4.9]]) {
        const sk = P(lt, s0, s1); if (sk <= 0 || sk >= 1) continue;
        const sw = paint('crs_sweep', () => {
          ctx.drawImage(tx.main, 0, 0); ctx.globalCompositeOperation = 'source-atop';
          const x = lerp(-250, 1250, E.io(sk)); const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0);
          g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.setTransform(1, 0, -.35, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(-200, 0, 1600, 330);
        }, 1000, 330);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.drawImage(sw, -500, -165 + oy); ctx.restore();
      }
      ctx.restore();
    }
  }

  function drawTablet(lt, hideBonus) {
    if (lt < 1.55) return;
    const X = tabXf(lt);
    ctx.save(); ctx.translate(X.cx, X.cy); ctx.rotate(X.rot); ctx.scale(X.sc, X.sc); ctx.translate(-TBW / 2, -TBH / 2);
    // under-glow
    glowBlob(TBW / 2, TBH * .55, 700, 'rgba(120,80,200,.18)', 1);
    ctx.drawImage(CHASSIS, -TPAD, -TPAD);
    // header
    const ha = fi(lt, 1.9, .4);
    if (ha > 0) {
      ctx.save(); ctx.globalAlpha = ha;
      sparkle(66, 58, 15, CORAL, lt * .8);
      T('AI Motion Cuan', 92, 59, { size: 26, weight: 800, align: 'left', color: '#efeaf8' });
      T('7 modul + bonus', TBW - 58, 59, { size: 22, weight: 700, align: 'right', color: 'rgba(255,255,255,.4)' });
      ctx.restore();
    }
    // bonus glow plate
    const bt = T_CARD(7), bk = P(lt, bt + .2, bt + .8);
    if (bk > 0 && !hideBonus) { const [x, y] = cellXY(7); glowBlob(x + CW / 2, y + CH / 2, 330, 'rgba(255,170,70,.55)', bk * (.75 + .25 * Math.sin(lt * 3))); }
    // cards
    for (let i = 0; i < 8; i++) {
      if (i === 7 && hideBonus) continue;
      const t0 = T_CARD(i), d = i === 7 ? .7 : .62; if (lt < t0) continue;
      const cv = cardCanvas(i, lt), [fx, fy] = cellXY(i), col = i % 2, row = Math.floor(i / 2);
      const st = { x: fx + (col ? 1 : -1) * 980, y: fy + 260 + row * 60, r: (col ? 1 : -1) * .45, s: 1.55 };
      if (i === 7) { st.x = fx - 120; st.y = fy + 700; st.r = -.2; st.s = 2.2; }
      const at = kk => { const e = E.expo(clamp(kk)); return { x: lerp(st.x, fx, e), y: lerp(st.y, fy, e), r: lerp(st.r, 0, e), s: lerp(st.s, 1, e), e }; };
      const k = P(lt, t0, t0 + d), cur = at(k);
      // motion-blur trail
      if (k < .6) for (let j = 3; j >= 1; j--) {
        const p = at(P(lt - j * .028, t0, t0 + d)); if (p.e <= 0) continue;
        ctx.save(); ctx.globalAlpha = .2 / j * (1 - k); ctx.translate(p.x + CW / 2, p.y + CH / 2); ctx.rotate(p.r); ctx.scale(p.s, p.s); ctx.drawImage(cv, -CW / 2, -CH / 2); ctx.restore();
      }
      ctx.save(); ctx.globalAlpha = clamp(k * 5); ctx.translate(cur.x + CW / 2, cur.y + CH / 2); ctx.rotate(cur.r); ctx.scale(cur.s, cur.s);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; ctx.fillStyle = '#000'; rr(-CW / 2 + 6, -CH / 2 + 6, CW - 12, CH - 12, 20); ctx.fill(); ctx.restore();
      ctx.drawImage(cv, -CW / 2, -CH / 2);
      // landing flash
      const lf = P(lt, t0 + d * .45, t0 + d * 1.1);
      if (lf > 0 && lf < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (1 - lf) * .55; ctx.strokeStyle = i === 7 ? '#ffd27a' : '#ffffff'; ctx.lineWidth = 6; rr(-CW / 2, -CH / 2, CW, CH, 22); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fill(); }
      ctx.restore();
    }
    // glass reflection + light sweep across the screen
    ctx.save(); rr(18, 18, TBW - 36, TBH - 36, 48); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const rg = ctx.createLinearGradient(0, 0, TBW, TBH * .6); rg.addColorStop(0, 'rgba(255,255,255,.07)'); rg.addColorStop(.35, 'rgba(255,255,255,.015)'); rg.addColorStop(.36, 'rgba(255,255,255,0)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, TBW, TBH);
    const sk = P(lt, 4.05, 4.85);
    if (sk > 0 && sk < 1) {
      const x = lerp(-500, TBW + 500, E.io(sk));
      ctx.setTransform(ctx.getTransform().multiply(new DOMMatrix([1, 0, -.5, 1, 0, 0])));
      const g = ctx.createLinearGradient(x - 160, 0, x + 160, 0); g.addColorStop(0, 'rgba(255,240,220,0)'); g.addColorStop(.5, 'rgba(255,240,220,.22)'); g.addColorStop(1, 'rgba(255,240,220,0)');
      ctx.fillStyle = g; ctx.fillRect(-800, 0, TBW + 1600, TBH);
    }
    ctx.restore();
    ctx.restore();
  }
  // screen position of a point given in tablet-local coords (for the bonus card hand-off)
  function tabToScreen(lt, lx, ly) {
    const X = tabXf(lt), z = camZ(lt);
    const dx = (lx - TBW / 2) * X.sc, dy = (ly - TBH / 2) * X.sc, c = Math.cos(X.rot), s = Math.sin(X.rot);
    const wx = X.cx + dx * c - dy * s, wy = X.cy + dx * s + dy * c;
    return [540 + (wx - 540) * z, 960 + (wy - 960) * z];
  }

  function drawBG(lt, fz) {
    const dy = -lt * 14;
    ctx.drawImage(BG, -100, -100 + dy * .3);
    glowBlob(170, 260 + dy * .2, 900, 'rgba(217,119,87,.22)', 1);
    glowBlob(980, 1650, 900, 'rgba(70,110,255,.16)', 1);
    glowBlob(540, 1000, 700, 'rgba(150,90,220,.12)', 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; rays(540, -300, 22, lt * .03, 'rgba(255,190,140,.022)'); ctx.restore();
  }
  function drawParts(lt, near) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PARTS) {
      if ((p.z > .82) !== near) continue;
      const sz = near ? 50 + p.z * 90 : 4 + p.z * 22, sp = 10 + p.z * 60;
      const x = p.x + noise1(lt * .3 + p.ph) * 30 * p.z, y = ((p.y - lt * sp) % 2100 + 2100) % 2100 - 90;
      ctx.globalAlpha = (near ? .07 : .12 + .4 * p.z) * (.6 + .4 * Math.sin(lt * 1.5 + p.ph));
      ctx.drawImage(BOKEH, x - sz / 2, y - sz / 2, sz, sz);
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 1-2-3 flow
  const CHAT = { x: 430, y: 320, w: 570, h: 400 };
  const VID = { x: 190, y: 830, w: 800, h: 450 };
  const BADGES = [['YouTube', 300], ['Instagram', 580], ['TikTok', 860]];
  const BY = 1505;
  const NODE = [290, 520];

  function glassPanel(x, y, w, hh, r, a = 1) {
    ctx.save(); ctx.globalAlpha *= a;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24; ctx.fillStyle = 'rgba(20,18,32,.92)'; rr(x, y, w, hh, r); ctx.fill(); ctx.restore();
    ctx.fillStyle = vgrad(y, y + hh, ['rgba(255,255,255,.07)', 'rgba(255,255,255,.015)']); rr(x, y, w, hh, r); ctx.fill();
    const g = ctx.createLinearGradient(x, y, x + w, y + hh); g.addColorStop(0, 'rgba(255,230,210,.45)'); g.addColorStop(.4, 'rgba(255,255,255,.08)'); g.addColorStop(1, 'rgba(150,170,255,.25)');
    ctx.strokeStyle = g; ctx.lineWidth = 2; rr(x + 1, y + 1, w - 2, hh - 2, r); ctx.stroke();
    ctx.restore();
  }
  function stepNum(n, x, y, t0, lt) {
    const s = pop(lt, t0, .4); if (s <= 0) return;
    glowBlob(x, y, 80, 'rgba(217,119,87,.5)', clamp(s));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#17141f'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fill();
    ctx.strokeStyle = CORAL; ctx.lineWidth = 3; ctx.stroke();
    T(String(n), 0, 2, { size: 30, weight: 900, color: '#fff' });
    ctx.restore();
  }
  function bez(p0, p1, p2, p3, u) { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; }

  function drawFlow(lt) {
    const fz = 1 + .03 * P(lt, 5, 8);
    camera(540, 960, fz, () => {
      // spine
      const sp1 = E.io(P(lt, 5.3, 6.45)), sp2 = E.io(P(lt, 6.6, 7.05));
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 520); ctx.lineTo(100, BY); ctx.stroke();
      const sy = lt < 6.6 ? lerp(520, 1055, sp1) : lerp(1055, BY, sp2);
      if (lt > 5.3) { const g = ctx.createLinearGradient(0, 520, 0, sy); g.addColorStop(0, 'rgba(217,119,87,.2)'); g.addColorStop(1, 'rgba(255,190,140,1)'); ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(100, 520); ctx.lineTo(100, sy); ctx.stroke(); glowBlob(100, sy, 40, 'rgba(255,190,140,.9)', 1); }
      ctx.restore();
      stepNum(1, 100, 520, 5.3, lt); stepNum(2, 100, 1055, 6.45, lt); stepNum(3, 100, BY, 7.0, lt);

      // --- chat window
      const ck = E.expo(P(lt, 5.3, 5.8));
      if (ck > 0) {
        const { x, y, w, h: hh } = CHAT;
        ctx.save(); ctx.translate(x + w / 2, y + hh / 2 + (1 - ck) * 140); ctx.scale(.9 + .1 * ck, .9 + .1 * ck); ctx.translate(-(x + w / 2), -(y + hh / 2)); ctx.globalAlpha = clamp(ck * 1.5);
        glowBlob(x + 40, y + 40, 260, 'rgba(217,119,87,.25)', 1);
        glassPanel(x, y, w, hh, 34);
        sparkle(x + 46, y + 44, 17, CORAL, lt * 1.2); sparkle(x + 46, y + 44, 7, '#ffd3c2', lt * 1.2);
        T('Claude', x + 76, y + 46, { size: 32, weight: 800, align: 'left', color: '#f6f1ff' });
        for (let d = 0; d < 3; d++) { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.arc(x + w - 40 - d * 18, y + 44, 4, 0, 7); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x + 24, y + 84, w - 48, 1.5);
        // user bubble w/ pdf chip
        const ub = pop(lt, 5.86, .35);
        if (ub > 0) {
          const bw = 300, bx = x + w - 26 - bw, byy = y + 110;
          ctx.save(); ctx.translate(bx + bw, byy + 34); ctx.scale(ub, ub); ctx.translate(-(bx + bw), -(byy + 34));
          ctx.fillStyle = 'rgba(217,119,87,.22)'; rr(bx, byy, bw, 68, 22); ctx.fill(); ctx.strokeStyle = 'rgba(217,119,87,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#e8304a'; rr(bx + 16, byy + 14, 32, 40, 6); ctx.fill(); T('PDF', bx + 32, byy + 35, { size: 12, weight: 900 });
          T('Prompt Pack.pdf', bx + 62, byy + 35, { size: 24, weight: 700, align: 'left', color: '#fff' });
          ctx.restore();
        }
        // Claude reply skeleton (writing)
        if (lt > 5.98) {
          sparkle(x + 46, y + 222, 13, CORAL, lt * 4);
          const ws = [440, 400, 300];
          ws.forEach((lw, i) => {
            const k = E.out(P(lt, 6.0 + i * .09, 6.28 + i * .09)); if (k <= 0) return;
            const lx = x + 76, ly = y + 204 + i * 30;
            ctx.fillStyle = 'rgba(255,255,255,.16)'; rr(lx, ly, lw * k, 14, 7); ctx.fill();
            const sh = ((lt * 1.6 + i * .2) % 1) * (lw + 200) - 100;
            ctx.save(); rr(lx, ly, lw * k, 14, 7); ctx.clip(); const g = ctx.createLinearGradient(lx + sh - 80, 0, lx + sh + 80, 0); g.addColorStop(0, 'rgba(255,200,170,0)'); g.addColorStop(.5, 'rgba(255,200,170,.5)'); g.addColorStop(1, 'rgba(255,200,170,0)'); ctx.fillStyle = g; ctx.fillRect(lx, ly, lw, 14); ctx.restore();
          });
        }
        // video chip (becomes the player)
        const vc = pop(lt, 6.26, .3);
        if (vc > 0) {
          const cx0 = x + 76, cy0 = y + 310;
          ctx.save(); ctx.translate(cx0, cy0 + 30); ctx.scale(vc, vc); ctx.translate(-cx0, -(cy0 + 30));
          ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(cx0, cy0, 290, 60, 18); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.save(); rr(cx0 + 8, cy0 + 8, 74, 44, 10); ctx.clip(); ctx.translate(cx0 + 8, cy0 + 8); TH.ghibli(74, 44, lt); ctx.restore();
          T('video.mp4', cx0 + 98, cy0 + 31, { size: 24, weight: 700, align: 'left', color: '#fff' });
          check(cx0 + 262, cy0 + 30, 13, pop(lt, 6.45, .3));
          ctx.restore();
        }
        ctx.restore();
      }

      // --- PDF node + mini pdf flying into the chat
      const nk = P(lt, 5.0, 5.42);
      if (lt >= 5.4) {
        const pulse = 1 + .05 * Math.max(0, 1 - Math.abs(lt - 5.62) * 6);
        glowBlob(NODE[0], NODE[1], 230, 'rgba(255,170,70,.45)', .8 + .2 * Math.sin(lt * 3));
        docIcon(NODE[0], NODE[1] + Math.sin(lt * 2) * 5, .95 * pulse, -.06 + Math.sin(lt * 1.2) * .02);
      }
      const fk = P(lt, 5.58, 5.88);
      if (fk > 0 && fk < 1) {
        const e = E.io(fk), tx = CHAT.x + CHAT.w - 26 - 300 + 32, ty = CHAT.y + 144;
        const x = lerp(NODE[0], tx, e), y = lerp(NODE[1], ty, e) - Math.sin(e * Math.PI) * 120;
        for (let j = 3; j >= 0; j--) { const ej = E.io(clamp(fk - j * .06)); docIcon(lerp(NODE[0], tx, ej), lerp(NODE[1], ty, ej) - Math.sin(ej * Math.PI) * 120, lerp(.6, .2, ej), ej * 1.2, j ? .18 / j : 1); }
        glowBlob(x, y, 90, 'rgba(255,190,120,.7)', 1);
      }

      // --- video player (morphs out of the chip)
      const vk = E.expo(P(lt, 6.36, 6.9));
      if (vk > 0) {
        const c0 = { x: CHAT.x + 76 + 8, y: CHAT.y + 318, w: 74, h: 44 };
        const r = { x: lerp(c0.x, VID.x, vk), y: lerp(c0.y, VID.y, vk), w: lerp(c0.w, VID.w, vk), h: lerp(c0.h, VID.h, vk) };
        glowBlob(r.x + r.w / 2, r.y + r.h / 2, r.w * .75, 'rgba(255,170,110,.22)', vk);
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 30; ctx.fillStyle = '#000'; rr(r.x, r.y, r.w, r.h, 10 + 18 * vk); ctx.fill(); ctx.restore();
        ctx.save(); rr(r.x, r.y, r.w, r.h, 10 + 18 * vk); ctx.clip(); ctx.translate(r.x, r.y); ctx.scale(r.w / VID.w, r.h / VID.h);
        const kb = 1 + .06 * P(lt, 6.4, 8); ctx.save(); ctx.translate(VID.w / 2, VID.h * .6); ctx.scale(kb, kb); ctx.translate(-VID.w / 2, -VID.h * .6); TH.ghibli(VID.w, VID.h, lt * 1.5 + 4, true); ctx.restore();
        ctx.fillStyle = vgrad(VID.h * .7, VID.h, ['rgba(0,0,0,0)', 'rgba(0,0,0,.55)']); ctx.fillRect(0, VID.h * .7, VID.w, VID.h * .3);
        const pr = P(lt, 6.6, 8.6);
        ctx.fillStyle = 'rgba(255,255,255,.3)'; rr(28, VID.h - 30, VID.w - 56, 6, 3); ctx.fill();
        ctx.fillStyle = CORAL; rr(28, VID.h - 30, (VID.w - 56) * pr, 6, 3); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(28 + (VID.w - 56) * pr, VID.h - 27, 9, 0, 7); ctx.fill();
        const pa = 1 - P(lt, 6.75, 7.05);
        if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; ctx.translate(VID.w / 2, VID.h / 2); ctx.scale(1 + (1 - pa) * .4, 1 + (1 - pa) * .4); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.arc(0, 0, 56, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-16, -24); ctx.lineTo(26, 0); ctx.lineTo(-16, 24); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.restore();
        ctx.strokeStyle = `rgba(255,255,255,${.25 * vk})`; ctx.lineWidth = 2; rr(r.x + 1, r.y + 1, r.w - 2, r.h - 2, 10 + 18 * vk); ctx.stroke();
      }

      // --- upload: comets from the video to the platform badges
      BADGES.forEach(([name, bx], i) => {
        const t0 = 6.88 + i * .07, k = P(lt, t0, t0 + .32);
        const p0 = [VID.x + VID.w / 2 + (i - 1) * 120, VID.y + VID.h], p3 = [bx, BY - 52], p1 = [p0[0], p0[1] + 90], p2 = [p3[0], p3[1] - 90];
        if (k > 0) {
          ctx.save(); ctx.strokeStyle = `rgba(255,200,160,${.28 * (1 - P(lt, 7.6, 8))})`; ctx.lineWidth = 2; ctx.setLineDash([3, 10]); ctx.beginPath();
          for (let u = 0; u <= k + .001; u += .05) { const p = bez(p0, p1, p2, p3, Math.min(u, k)); u ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
          if (k < 1) { for (let j = 0; j < 6; j++) { const p = bez(p0, p1, p2, p3, clamp(E.io(k) - j * .03)); glowBlob(p[0], p[1], 34 - j * 4, 'rgba(255,200,150,.9)', 1 - j / 6); } }
        }
        const bs = pop(lt, t0 + .26, .4); if (bs <= 0) return;
        const bw = 262, bh = 100;
        ctx.save(); ctx.translate(bx, BY); ctx.scale(bs, bs);
        glowBlob(0, 0, 170, 'rgba(217,119,87,.3)', clamp(bs) * (1 - P(lt, t0 + .3, t0 + 1.1) * .6));
        ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 12; ctx.fillStyle = 'rgba(24,21,36,.95)'; rr(-bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fill(); ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 2; rr(-bw / 2, -bh / 2, bw, bh, bh / 2); ctx.stroke();
        ctx.fillStyle = vgrad(-30, 30, ['#ef9172', '#c2593a']); ctx.beginPath(); ctx.arc(-bw / 2 + 46, 0, 30, 0, 7); ctx.fill();
        const ab = Math.sin(lt * 7 + i) * 2.5; uploadGlyph(-bw / 2 + 46, ab, 34);
        T(name, -bw / 2 + 90, 2, { size: 31, weight: 800, align: 'left', color: '#fff', maxW: bw - 104 });
        check(bw / 2 - 10, -bh / 2 + 6, 17, pop(lt, t0 + .45, .3));
        ctx.restore();
      });
    });
  }

  SCENES_REG.course = {
    cues: [
      [0.0, 'swell', 1.6], [0.25, 'shimmer'], [1.45, 'whoosh'],
      [2.05, 'pop'], [2.4, 'pop'], [2.75, 'pop'], [3.1, 'pop'], [3.42, 'ding'], [3.45, 'shimmer'],
      [4.95, 'whoosh'], [5.86, 'pop'], [6.4, 'whoosh_in'], [6.5, 'ding'], [7.15, 'pop'],
    ],
    draw(lt, t) {
      drawBG(lt);
      drawParts(lt, false);
      // product shot group: title + tablet (exits upward with depth blur at ~5 s)
      const xk = P(lt, 4.95, 5.38);
      if (xk < 1) {
        const grp = paint('crs_grp', () => camera(540, 960, camZ(lt), () => { drawTitle(lt); drawTablet(lt, lt >= 4.95); }));
        comp(grp, { y: -E.in(xk) * 1300, blur: xk * 22, alpha: 1 - E.in(xk) * .75 });
      }
      // bonus card lifts out of the tablet and becomes the PDF node
      if (lt >= 4.95 && lt < 5.4) {
        const [cx0, cy0] = tabToScreen(lt, cellXY(7)[0] + CW / 2, cellXY(7)[1] + CH / 2);
        const k = E.io(P(lt, 4.95, 5.4)), x = lerp(cx0, NODE[0], k), y = lerp(cy0, NODE[1], k) - Math.sin(k * Math.PI) * 160;
        const cv = cardCanvas(7, lt), s = lerp(camZ(lt), .7, k) * (1 + Math.sin(k * Math.PI) * .25), ca = 1 - P(k, .55, .95);
        glowBlob(x, y, 360, 'rgba(255,170,70,.55)', 1);
        if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; ctx.translate(x, y); ctx.rotate(-.15 * Math.sin(k * Math.PI)); ctx.scale(s, s); ctx.drawImage(cv, -CW / 2, -CH / 2); ctx.restore(); }
        docIcon(x, y, .95 * P(k, .45, 1), -.06, P(k, .45, .9));
      }
      if (lt >= 4.95) drawFlow(lt);
      drawParts(lt, true);
      // soft dip at the very end (hand-off to CTA)
      const d = P(lt, 7.75, 8.0); if (d > 0) { ctx.fillStyle = `rgba(0,0,0,${d * .55})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
    },
  };
})();
