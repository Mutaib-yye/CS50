// SCENE: wall — (7.0 s) pull back from the phone into a huge tilted wall of viral animated YouTube videos,
// tiles fall away into a dark earnings dashboard (line chart + Rp100.000.000 / bulan), push into darkness.
// Also owns the shared YouTube thumbnails + card meta used by hook.js (window.HW).
(() => {
  const HW = window.HW = window.HW || {};
  const TWD = 640, THT = 360;           // thumbnail canvas size (16:9)
  const MW = 640, MH = 124;             // meta strip (scaled copy of the phone card meta, 1080x210 -> 640x124)
  const MS = MW / 1080;

  // ------------------------------------------------------------------ video catalogue (all original)
  const VIDS = [
    { id: 'ships', title: ['Pertempuran Laut Terbesar 1588', 'Diceritakan Ulang | Animasi Sejarah'], ch: 'Sejarah Animasi', v: '103 jt', age: '8 bulan lalu', dur: '22:10', av: ['#c98a2b', '#5a2a08'], ini: 'SA' },
    { id: 'soft3d', title: ['Momo Kehilangan Kue Terakhir!', 'Episode 12 | Kartun 3D'], ch: 'Toon Ceria 3D', v: '54 jt', age: '3 bulan lalu', dur: '9:05', av: ['#ffb347', '#ff5e3a'], ini: 'TC' },
    { id: 'horror', title: ['Rumah Nomor 13: Jangan Pernah', 'Buka Pintu Ini | Animasi Horor'], ch: 'Kisah Seram Malam', v: '61 jt', age: '1 tahun lalu', dur: '14:33', av: ['#8a1222', '#16030a'], ini: 'KM' },
    { id: 'pastoral', title: ['Desa Kecil di Balik Awan |', 'Animasi Pendek yang Menenangkan'], ch: 'Kisah Senja', v: '87 jt', age: '5 bulan lalu', dur: '18:20', av: ['#8fd16f', '#2f6e3a'], ini: 'KS' },
    { id: 'space', title: ['Apa yang Ada di Planet X?', 'Perjalanan ke Ujung Galaksi'], ch: 'Semesta Kartun', v: '96 jt', age: '4 bulan lalu', dur: '11:48', av: ['#7b5cff', '#1a0f4a'], ini: 'SK' },
    { id: 'kids', title: ['Belajar Warna Bersama Teman', 'Hewan | Lagu Anak Indonesia'], ch: 'Lagu Anak Ceria', v: '72 jt', age: '1 tahun lalu', dur: '31:02', av: ['#ffd23f', '#ff7a00'], ini: 'LA' },
    { id: 'manga', title: ['Dia Bangkit Lagi... Bab Terakhir', '| Manga Animasi'], ch: 'Manga Nusantara', v: '45 jt', age: '6 bulan lalu', dur: '16:27', av: ['#ffffff', '#222222'], ini: 'MN' },
    { id: 'palace', title: ['Sang Putri dan Istana Emas |', 'Drama Animasi Penuh Air Mata'], ch: 'Drama Istana', v: '79 jt', age: '7 bulan lalu', dur: '25:40', av: ['#ff4fa3', '#7a0b4a'], ini: 'DI' },
    { id: 'dino', title: ['65 Juta Tahun Lalu: Hari', 'Terakhir Para Dinosaurus'], ch: 'Fakta Purba', v: '112 jt', age: '1 tahun lalu', dur: '13:55', av: ['#ff8a3d', '#5a1a00'], ini: 'FP' },
    { id: 'crayon', title: ['Aku dan Ayah: Cerita Krayon', 'yang Bikin Nangis'], ch: 'Coretan Kecil', v: '38 jt', age: '9 bulan lalu', dur: '6:12', av: ['#ffe08a', '#e0663a'], ini: 'CK' },
    { id: 'ocean', title: ['Monster di Dasar Laut Ini', 'Benar-Benar Ada?!'], ch: 'Misteri Samudra', v: '67 jt', age: '2 minggu lalu', dur: '10:31', av: ['#22d3c5', '#053a4a'], ini: 'MS' },
    { id: 'lofi', title: ['Hujan Malam di Kota | Lofi', 'Animasi untuk Belajar & Tidur'], ch: 'Kamar Lofi', v: '58 jt', age: '1 tahun lalu', dur: '2:14:08', av: ['#a78bfa', '#2e1065'], ini: 'KL' },
  ];
  const HERO = { id: 'hero', title: ['Pengembara di Atas Awan |', 'Film Animasi Pendek'], ch: 'Dunia Awan', v: '128 jt', age: '2 bulan lalu', dur: '12:47', av: ['#ffb36b', '#c2412d'], ini: 'DA' };
  HW.VIDS = VIDS; HW.HERO = HERO;

  // ------------------------------------------------------------------ small drawing kit (works on current ctx)
  const lg = (x0, y0, x1, y1, st) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(s => g.addColorStop(s[0], s[1])); return g; };
  const rg = (x, y, r, st, r0 = 0) => { const g = ctx.createRadialGradient(x, y, r0, x, y, r); st.forEach(s => g.addColorStop(s[0], s[1])); return g; };
  const full = f => { ctx.fillStyle = f; ctx.fillRect(0, 0, TWD, THT); };
  const circ = (x, y, r, f) => { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const ell = (x, y, rx, ry, f, rot = 0) => { ctx.fillStyle = f; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 7); ctx.fill(); };
  const poly = (pts, f) => { ctx.fillStyle = f; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); };
  const soft = (x, y, r, c, a = 1) => glowBlob(x, y, r, c, a, 'source-over');
  const add = (x, y, r, c, a = 1) => glowBlob(x, y, r, c, a, 'lighter');
  const big = (s, x, y, o = {}) => { const size = o.size || 80; T(s, x, y, { font: 'Anton', size, color: '#fff', stroke: '#000', sw: size * .2, shadow: { c: 'rgba(0,0,0,.55)', x: 4, y: 7 }, ...o }); };
  function arrow(x0, y0, cx, cy, x1, y1, col = '#ff1f1f', w = 15) {
    const a = Math.atan2(y1 - cy, x1 - cx), hl = w * 2.6;
    const ex = x1 - Math.cos(a) * hl * .7, ey = y1 - Math.sin(a) * hl * .7;
    const path = () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, ex, ey); };
    const head = () => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - .55) * hl, y1 - Math.sin(a - .55) * hl); ctx.lineTo(x1 - Math.cos(a + .55) * hl, y1 - Math.sin(a + .55) * hl); ctx.closePath(); };
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = w + 10; path(); ctx.stroke(); head(); ctx.lineWidth = 10; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = col; ctx.lineWidth = w; path(); ctx.stroke(); head(); ctx.fillStyle = col; ctx.fill();
    ctx.restore();
  }
  function ring(x, y, rx, ry, rot = -.15, col = '#ff1f1f') {
    ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
    ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, .2, Math.PI * 2 + .35); ctx.stroke();
    ctx.restore();
  }
  function durBadge(s) { const w = TW(s, 22, 'Mont', 800) + 18; ctx.fillStyle = 'rgba(0,0,0,.82)'; rr(TWD - w - 12, THT - 44, w, 32, 6); ctx.fill(); T(s, TWD - 12 - w / 2, THT - 27, { size: 22, weight: 800 }); }
  // painterly soft cloud
  function cloud(x, y, s, lit = '#ffffff', shade = '#a9b8d6') {
    const R = mulberry(Math.floor(x * 7 + y * 13));
    for (let i = 0; i < 14; i++) {
      const a = R() * Math.PI, d = R() * 1.1, px = x + Math.cos(a) * d * s * 1.3 - s * .1, py = y - Math.sin(a) * d * s * .55, r = s * (.35 + R() * .35);
      ctx.fillStyle = rg(px - r * .3, py - r * .4, r * 1.3, [[0, lit], [.6, mixc(lit.length === 7 ? lit : '#ffffff', shade.length === 7 ? shade : '#a9b8d6', .35)], [1, shade]]);
      ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }
  }
  function stars(n, seed, y1 = THT, a = .9) { const R = mulberry(seed); for (let i = 0; i < n; i++) { const s = R() * 1.8 + .3; ctx.fillStyle = `rgba(255,255,255,${R() * a})`; ctx.fillRect(R() * TWD, R() * y1, s, s); } }

  // ------------------------------------------------------------------ the 12 thumbnails (each clearly different)
  const PAINT = {
    ships() { // epic naval battle at dusk, golden "1588"
      full(lg(0, 0, 0, THT, [[0, '#1c0f1e'], [.35, '#6b2117'], [.6, '#e0661f'], [.72, '#ffb347'], [1, '#2a1208']]));
      add(430, 230, 260, 'rgba(255,170,60,.7)');
      // smoke banks
      ctx.save(); ctx.filter = 'blur(6px)'; for (let i = 0; i < 26; i++) { const R = h(i * 3.1); circ(250 + R * 380, 120 + h(i * 7.7) * 120, 30 + h(i * 1.9) * 50, `rgba(${40 + h(i) * 50},${25 + h(i) * 20},${25},.55)`); } ctx.restore();
      // sea
      ctx.fillStyle = lg(0, 255, 0, THT, [[0, '#3a2a2a'], [1, '#07141a']]); ctx.fillRect(0, 255, TWD, 110);
      for (let i = 0; i < 40; i++) { ctx.strokeStyle = `rgba(255,${150 + h(i) * 80},90,${.15 + h(i + 2) * .35})`; ctx.lineWidth = 2; const y = 262 + h(i * 2.2) * 90, x = h(i * 5.5) * TWD; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 20, y - 5, x + 50 + h(i) * 40, y); ctx.stroke(); }
      function ship(x, y, s, lit) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        poly([[-120, 0], [120, -10], [100, 34], [-95, 38]], '#1a0d08');
        poly([[60, -10], [128, -40], [124, -6]], '#1a0d08');
        ctx.fillStyle = '#120806'; for (const mx of [-60, 5, 65]) ctx.fillRect(mx - 3, -190, 6, 190);
        for (const [mx, top, wd] of [[-60, -170, 46], [5, -190, 56], [65, -160, 44]]) for (let k = 0; k < 2; k++) {
          const y0 = top + k * 75, y1 = y0 + 62;
          ctx.fillStyle = lg(mx - wd, y0, mx + wd, y1, [[0, lit ? '#ffe1a8' : '#c7a77a'], [1, lit ? '#b8642c' : '#5a3b28']]);
          ctx.beginPath(); ctx.moveTo(mx - wd, y0); ctx.quadraticCurveTo(mx, y0 + 12, mx + wd, y0); ctx.quadraticCurveTo(mx + wd + 10, y0 + 30, mx + wd, y1); ctx.quadraticCurveTo(mx, y1 + 10, mx - wd, y1); ctx.quadraticCurveTo(mx - wd + 8, y0 + 30, mx - wd, y0); ctx.fill();
        }
        poly([[5, -190], [5, -225], [40, -212]], '#d4202a');
        ctx.restore();
      }
      ship(470, 262, .95, true); ship(250, 250, .55, false);
      // cannon fire flashes
      add(372, 248, 70, 'rgba(255,230,150,1)'); add(560, 252, 50, 'rgba(255,220,140,.9)'); add(320, 244, 40, 'rgba(255,200,120,.8)');
      ctx.save(); ctx.filter = 'blur(3px)'; for (let i = 0; i < 9; i++) circ(380 - i * 14, 246 - i * 4, 14 + i * 2.5, `rgba(200,170,150,${.5 - i * .04})`); ctx.restore();
      // embers
      for (let i = 0; i < 40; i++) circ(h(i * 9.1) * TWD, h(i * 4.3) * 260, h(i) * 2 + .6, `rgba(255,${180 + h(i + 1) * 70},80,${.5 + h(i + 3) * .5})`);
      big('1588', 150, 120, { size: 128, grad: ['#fff6c8', '#ffcf4a', '#e08a12'], stroke: '#1a0a00', sw: 18, rot: -.04 });
      big('PERANG LAUT', 150, 215, { size: 40, color: '#fff', sw: 9 });
      durBadge('22:10');
    },
    soft3d() { // 3D-ish cute round character, shocked, empty plate circled
      full(rg(320, 160, 520, [[0, '#9fe7ff'], [.5, '#3aa0ff'], [1, '#2a2cb8']]));
      for (let i = 0; i < 14; i++) soft(h(i * 3.3) * TWD, h(i * 5.1) * THT, 20 + h(i) * 40, 'rgba(255,255,255,.35)', .8);
      // floor shadow
      ell(205, 338, 150, 26, 'rgba(10,20,90,.45)');
      // body (3D shaded)
      ctx.fillStyle = rg(160, 150, 210, [[0, '#fff3dd'], [.35, '#ffc27a'], [.8, '#f08a3a'], [1, '#b85a1c']], 10);
      ctx.beginPath(); ctx.ellipse(205, 220, 150, 135, 0, 0, 7); ctx.fill();
      // ears
      for (const s of [-1, 1]) { ctx.fillStyle = rg(205 + s * 95, 90, 60, [[0, '#ffd59a'], [1, '#d9752c']]); ctx.beginPath(); ctx.ellipse(205 + s * 100, 100, 40, 48, s * .5, 0, 7); ctx.fill(); ell(205 + s * 100, 104, 20, 26, '#ff9fb2', s * .5); }
      // rim light
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(140,230,255,.7)'; ctx.lineWidth = 7; ctx.filter = 'blur(3px)'; ctx.beginPath(); ctx.ellipse(205, 220, 146, 131, 0, -1.2, .7); ctx.stroke(); ctx.restore();
      // eyes
      for (const s of [-1, 1]) {
        const ex = 205 + s * 55, ey = 195;
        ell(ex, ey, 40, 48, '#fff');
        ctx.fillStyle = rg(ex, ey + 6, 34, [[0, '#6b3a1a'], [.7, '#2a1206'], [1, '#120600']]); ctx.beginPath(); ctx.ellipse(ex, ey + 6, 27, 33, 0, 0, 7); ctx.fill();
        circ(ex - 9, ey - 8, 10, '#fff'); circ(ex + 10, ey + 18, 4.5, 'rgba(255,255,255,.85)');
        ctx.strokeStyle = '#5a2a0e'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 30 * s * -1 - 0, ey - 70); ctx.quadraticCurveTo(ex, ey - 86, ex + 28 * s, ey - 74); ctx.stroke();
      }
      // shocked mouth
      ctx.fillStyle = rg(205, 290, 40, [[0, '#ff6b6b'], [.5, '#a3122a'], [1, '#4a0410']]); ctx.beginPath(); ctx.ellipse(205, 288, 24, 32, 0, 0, 7); ctx.fill();
      ell(205, 304, 14, 9, '#ff8fa0');
      ell(130, 262, 22, 12, 'rgba(255,90,110,.45)'); ell(280, 262, 22, 12, 'rgba(255,90,110,.45)');
      // paws on cheeks
      for (const s of [-1, 1]) { ctx.fillStyle = rg(205 + s * 128, 268, 40, [[0, '#ffe7c2'], [1, '#e08a40']]); ctx.beginPath(); ctx.ellipse(205 + s * 125, 270, 30, 36, s * -.3, 0, 7); ctx.fill(); }
      // empty plate with crumbs
      ell(530, 305, 70, 20, 'rgba(0,0,40,.35)');
      ctx.fillStyle = lg(460, 280, 600, 310, [[0, '#ffffff'], [1, '#c9d6ff']]); ctx.beginPath(); ctx.ellipse(530, 295, 66, 20, 0, 0, 7); ctx.fill();
      for (let i = 0; i < 6; i++) circ(505 + i * 9, 292 + h(i) * 6, 3, '#b8742c');
      ring(530, 292, 92, 42, -.1);
      big('KUENYA', 500, 72, { size: 66, sw: 13 });
      big('HILANG?!', 500, 150, { size: 84, color: '#ffe23a', sw: 16, rot: -.05 });
      arrow(470, 200, 430, 250, 470, 280, '#ff1f1f', 13);
      durBadge('9:05');
    },
    horror() { // haunted house, red moon, glowing window circled
      full(lg(0, 0, 0, THT, [[0, '#05040b'], [.6, '#1a0a1c'], [1, '#050306']]));
      add(470, 90, 200, 'rgba(200,20,30,.55)'); circ(470, 90, 58, rg(470, 90, 58, [[0, '#ff6a5a'], [.8, '#c0121c'], [1, '#7a0a10']]));
      stars(50, 9, 200, .6);
      // fog layers
      ctx.save(); ctx.filter = 'blur(10px)'; for (let i = 0; i < 12; i++) ell(h(i * 2.7) * TWD, 300 + h(i) * 50, 120, 26, 'rgba(120,110,140,.35)'); ctx.restore();
      // house silhouette
      const hx = 360, hy = 300;
      poly([[hx - 150, hy], [hx - 150, hy - 120], [hx - 175, hy - 120], [hx - 70, hy - 205], [hx + 30, hy - 120], [hx + 10, hy - 120], [hx + 10, hy - 150], [hx + 70, hy - 230], [hx + 140, hy - 150], [hx + 130, hy - 150], [hx + 130, hy]], '#07050a');
      ctx.fillStyle = '#07050a'; ctx.fillRect(hx + 90, hy - 260, 18, 50);
      // windows
      const wins = [[hx - 105, hy - 90, false], [hx - 40, hy - 90, false], [hx + 70, hy - 175, true], [hx + 50, hy - 80, false]];
      for (const [x, y, glow] of wins) {
        if (glow) { add(x, y, 90, 'rgba(255,200,80,.6)'); ctx.fillStyle = lg(0, y - 22, 0, y + 22, [[0, '#ffe9a0'], [1, '#ff9a2a']]); ctx.fillRect(x - 16, y - 24, 32, 46);
          // figure with red eyes
          ell(x, y - 6, 9, 11, '#120508'); ctx.fillStyle = '#120508'; ctx.fillRect(x - 13, y + 4, 26, 20); circ(x - 3, y - 7, 1.8, '#ff2020'); circ(x + 3, y - 7, 1.8, '#ff2020');
        } else { ctx.fillStyle = 'rgba(90,60,40,.5)'; ctx.fillRect(x - 13, y - 18, 26, 36); }
        ctx.fillStyle = '#07050a'; ctx.fillRect(x - 1.5, y - 24, 3, 46); ctx.fillRect(x - 16, y - 2, 32, 3);
      }
      // dead trees
      ctx.strokeStyle = '#030204'; ctx.lineCap = 'round';
      function br(x, y, a, l, w, d) { if (d > 6 || l < 4) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); br(x2, y2, a - .45 + h(d * 3 + x) * .2, l * .72, w * .65, d + 1); br(x2, y2, a + .4 - h(d + y) * .2, l * .7, w * .65, d + 1); }
      br(70, 360, -1.5, 80, 12, 0); br(600, 360, -1.7, 70, 10, 0);
      ctx.fillStyle = '#030204'; ctx.fillRect(0, 330, TWD, 30);
      ring(hx + 70, hy - 175, 48, 52, 0);
      big('JANGAN', 150, 70, { size: 62, sw: 12 });
      big('BUKA!', 150, 148, { size: 92, color: '#ff2a2a', sw: 16, rot: -.04 });
      durBadge('14:33');
    },
    pastoral() { // painterly countryside, big cumulus, girl in straw hat
      full(lg(0, 0, 0, THT, [[0, '#3f8fd8'], [.55, '#9fd3f5'], [1, '#e9f6ff']]));
      cloud(430, 120, 95, '#ffffff', '#9fb2d8'); cloud(150, 95, 60, '#ffffff', '#a8bde0'); cloud(600, 60, 50);
      add(560, 40, 160, 'rgba(255,250,220,.5)');
      // hills
      const hill = (y0, amp, f, ph, c1, c2) => { ctx.fillStyle = lg(0, y0 - amp, 0, THT, [[0, c1], [1, c2]]); ctx.beginPath(); ctx.moveTo(0, THT); for (let x = 0; x <= TWD; x += 8) ctx.lineTo(x, y0 - Math.sin(x * f + ph) * amp - Math.sin(x * f * 2.3 + ph) * amp * .3); ctx.lineTo(TWD, THT); ctx.fill(); };
      hill(230, 22, .008, 1, '#a9d79a', '#7fbf7a'); hill(262, 26, .006, 3, '#7cc46a', '#4f9a4a');
      // house on mid hill
      ctx.fillStyle = '#f5ead2'; ctx.fillRect(450, 212, 46, 30); poly([[444, 214], [473, 192], [502, 214]], '#d2442e'); ctx.fillStyle = '#5a3a2a'; ctx.fillRect(466, 226, 10, 16);
      hill(310, 20, .005, 5, '#58a84f', '#2f6e34');
      // tree
      ctx.fillStyle = '#4a3020'; ctx.fillRect(560, 210, 12, 100);
      for (let i = 0; i < 9; i++) circ(566 + (h(i) - .5) * 80, 190 + (h(i + 4) - .5) * 60, 30 + h(i + 2) * 16, i % 3 ? '#3f8a3f' : '#5aa850');
      soft(580, 170, 60, 'rgba(200,255,160,.35)');
      // flowers
      for (let i = 0; i < 90; i++) circ(h(i * 1.7) * TWD, 300 + h(i * 3.9) * 60, 1.6 + h(i) * 1.4, ['#fff6a0', '#ffffff', '#ffb0c8'][i % 3]);
      // girl (back view, straw hat, white dress, red ribbon)
      ctx.save(); ctx.translate(200, 330);
      poly([[-16, -8], [16, -8], [24, -60], [-24, -60]], '#ffffff'); poly([[-24, -60], [24, -60], [14, -92], [-14, -92]], '#f2f2f2');
      ctx.fillStyle = '#ffe0c0'; ctx.fillRect(-12, -8, 6, 10); ctx.fillRect(6, -8, 6, 10);
      circ(0, -104, 15, '#4a2a1a');
      ell(0, -112, 32, 8, '#f3d27a'); ell(0, -120, 15, 12, '#f3d27a'); ctx.fillStyle = '#d6202a'; ctx.fillRect(-15, -116, 30, 5);
      ctx.strokeStyle = '#d6202a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(14, -114); ctx.quadraticCurveTo(30, -110, 40, -100); ctx.stroke();
      ctx.restore();
      T('Desa di Balik Awan', 30, 46, { size: 34, font: 'Playfair', weight: 'italic 700', align: 'left', color: '#fff', shadow: { c: 'rgba(0,40,80,.45)', x: 0, y: 3 } });
      durBadge('18:20');
    },
    space() { // astronaut + ringed planet, "PLANET X?!"
      full(rg(420, 140, 560, [[0, '#4b1d8f'], [.45, '#1a0f4a'], [1, '#04030f']]));
      add(160, 80, 220, 'rgba(255,60,170,.35)'); add(520, 300, 220, 'rgba(40,200,255,.3)');
      stars(160, 77);
      // planet
      const px = 450, py = 170;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-.35);
      ctx.strokeStyle = 'rgba(255,220,170,.55)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(0, 0, 190, 42, 0, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = rg(-40, -40, 140, [[0, '#ffd59a'], [.5, '#f07a3a'], [1, '#5a1236']]); ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.clip(); for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(120,30,40,${.12 + h(i) * .15})`; ctx.fillRect(-120, -80 + i * 30, 240, 10 + h(i + 3) * 8); } ctx.restore();
      ctx.strokeStyle = 'rgba(255,230,190,.8)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(0, 0, 190, 42, 0, 0, Math.PI); ctx.stroke();
      ctx.restore();
      // astronaut
      ctx.save(); ctx.translate(170, 230); ctx.rotate(-.25);
      ctx.fillStyle = rg(-10, -10, 70, [[0, '#ffffff'], [1, '#9aa4c4']]); rr(-40, -10, 80, 90, 30); ctx.fill();
      ctx.fillStyle = '#c8d0e8'; rr(-58, 0, 22, 70, 11); ctx.fill(); rr(36, -6, 22, 66, 11); ctx.fill();
      circ(0, -40, 50, rg(-15, -55, 60, [[0, '#ffffff'], [1, '#a8b2d0']]));
      ctx.fillStyle = lg(-30, -60, 30, -20, [[0, '#ffb36b'], [.5, '#3a1a6a'], [1, '#0a0620']]); ctx.beginPath(); ctx.ellipse(0, -40, 34, 28, 0, 0, 7); ctx.fill();
      ell(-12, -52, 10, 5, 'rgba(255,255,255,.8)', -.4);
      ctx.restore();
      add(600, 60, 30, 'rgba(120,255,255,1)'); circ(600, 60, 4, '#fff');
      big('PLANET X?!', 330, 300, { size: 76, grad: ['#e6fdff', '#6ff0ff', '#1fb6ff'], stroke: '#06021a', sw: 15, rot: -.03 });
      arrow(470, 230, 560, 160, 588, 76, '#ff1f1f', 12);
      durBadge('11:48');
    },
    kids() { // bright kids cartoon, cute animals, colorful letters
      full(lg(0, 0, 0, THT, [[0, '#4fd2ff'], [1, '#bff1ff']]));
      ctx.save(); ctx.translate(560, 40); for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 700, 0, .2); ctx.fill(); } ctx.restore();
      circ(560, 40, 50, '#ffe14a');
      ctx.fillStyle = '#6fd64a'; ctx.beginPath(); ctx.ellipse(320, 410, 520, 130, 0, 0, 7); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = '#1b1b3a'; ctx.lineJoin = 'round';
      const charac = (x, y, r, col, ears) => {
        ctx.fillStyle = col;
        if (ears === 'bunny') { for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * r * .38, y - r * 1.25, r * .2, r * .55, s * .15, 0, 7); ctx.fill(); ctx.stroke(); } }
        if (ears === 'bear') { for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s * r * .72, y - r * .72, r * .3, 0, 7); ctx.fill(); ctx.stroke(); } }
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
        circ(x - r * .32, y - r * .1, r * .13, '#1b1b3a'); circ(x + r * .32, y - r * .1, r * .13, '#1b1b3a');
        circ(x - r * .28, y - r * .15, r * .045, '#fff'); circ(x + r * .36, y - r * .15, r * .045, '#fff');
        ell(x - r * .55, y + r * .2, r * .14, r * .08, 'rgba(255,90,120,.6)'); ell(x + r * .55, y + r * .2, r * .14, r * .08, 'rgba(255,90,120,.6)');
        ctx.beginPath(); ctx.arc(x, y + r * .15, r * .28, .2, Math.PI - .2); ctx.stroke();
      };
      charac(130, 270, 62, '#ffd23f', null); charac(270, 285, 52, '#ff8fc8', 'bunny'); charac(400, 275, 58, '#7c8cff', 'bear');
      const L = [['A', '#ff3b3b'], ['B', '#ffb000'], ['C', '#2bb24c'], ['D', '#3b7bff']];
      L.forEach(([s, c], i) => { ctx.save(); ctx.translate(500 + (i % 2) * 64, 210 + Math.floor(i / 2) * 64); ctx.rotate((h(i) - .5) * .4); ctx.fillStyle = c; rr(-28, -28, 56, 56, 10); ctx.fill(); ctx.stroke(); T(s, 0, 3, { size: 40, font: 'Bangers', color: '#fff' }); ctx.restore(); });
      const W1 = 'BELAJAR'.split(''); const cols = ['#ff3b3b', '#ff9a00', '#ffd400', '#2bb24c', '#00b3ff', '#7a5cff', '#ff4fa3'];
      W1.forEach((c, i) => T(c, 60 + i * 50, 70 + Math.sin(i) * 6, { size: 74, font: 'Bangers', color: cols[i], stroke: '#fff', sw: 12, shadow: { c: 'rgba(0,0,80,.35)', x: 3, y: 5 } }));
      T('WARNA!', 220, 140, { size: 64, font: 'Bangers', color: '#fff', stroke: '#1b1b3a', sw: 12, shadow: { c: 'rgba(0,0,80,.35)', x: 3, y: 5 } });
      durBadge('31:02');
    },
    manga() { // B/W manga close-up, screentone, red accent
      full('#f4f1ea');
      ctx.save(); ctx.translate(250, 180); for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2 + h(i) * .05; ctx.strokeStyle = `rgba(0,0,0,${.35 + h(i) * .5})`; ctx.lineWidth = 1 + h(i + 2) * 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (150 + h(i) * 60), Math.sin(a) * (150 + h(i) * 60)); ctx.lineTo(Math.cos(a) * 700, Math.sin(a) * 700); ctx.stroke(); } ctx.restore();
      // red slash bg
      poly([[380, 0], [640, 0], [640, 360], [470, 360]], '#d4121e');
      // face (3/4), hair spikes
      ctx.save(); ctx.translate(250, 200);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-110, -60); ctx.quadraticCurveTo(-120, 70, -20, 150); ctx.quadraticCurveTo(60, 120, 110, 30); ctx.lineTo(120, -70); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.clip(); ctx.globalAlpha = .55; ctx.fillStyle = HALFPAT; ctx.fillRect(40, -80, 120, 260); ctx.restore();
      // eye
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-20, -40, 40, -8); ctx.quadraticCurveTo(-10, 18, -70, 0); ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-20, -40, 40, -8); ctx.quadraticCurveTo(-10, 18, -70, 0); ctx.clip();
      circ(-12, -6, 22, '#111'); circ(-12, -6, 12, '#d4121e'); circ(-12, -6, 6, '#000'); circ(-20, -14, 6, '#fff'); ctx.restore();
      ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-80, -40); ctx.quadraticCurveTo(-20, -70, 50, -40); ctx.stroke();
      // hair
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-150, -40); for (let i = 0; i < 9; i++) { const x = -150 + i * 38; ctx.lineTo(x + 18, -170 - h(i) * 60); ctx.lineTo(x + 38, -70 + (i % 2) * 20); } ctx.lineTo(160, -120); ctx.lineTo(140, -60); ctx.lineTo(-130, 30); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-100 + i * 40, -110); ctx.lineTo(-90 + i * 40, -80); ctx.stroke(); }
      ctx.strokeStyle = '#111'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 90); ctx.lineTo(60, 80); ctx.stroke();
      ctx.restore();
      T('BANGKIT!', 520, 150, { size: 88, font: 'Bangers', color: '#fff', stroke: '#111', sw: 14, rot: -.12, shadow: { c: '#111', x: 6, y: 6 } });
      T('BAB TERAKHIR', 520, 240, { size: 30, font: 'Mont', weight: 900, color: '#111', rot: -.12, ls: 2 });
      durBadge('16:27');
    },
    palace() { // dramatic palace at sunset, dancer silhouette, gold title
      full(lg(0, 0, 0, THT, [[0, '#3a0a4a'], [.4, '#c2185b'], [.7, '#ff8a3d'], [1, '#ffd27a']]));
      add(320, 230, 260, 'rgba(255,220,120,.8)'); circ(320, 230, 70, rg(320, 230, 70, [[0, '#fffbe6'], [1, '#ffcf6a']]));
      // palace silhouette
      const S = '#2a0630';
      ctx.fillStyle = S; ctx.fillRect(130, 230, 380, 90);
      const dome = (cx, by, w, hh) => { ctx.beginPath(); ctx.moveTo(cx - w, by); ctx.bezierCurveTo(cx - w * 1.3, by - hh * .5, cx - w * .2, by - hh * .72, cx, by - hh); ctx.bezierCurveTo(cx + w * .2, by - hh * .72, cx + w * 1.3, by - hh * .5, cx + w, by); ctx.closePath(); ctx.fillStyle = S; ctx.fill(); };
      dome(320, 232, 70, 130); dome(190, 240, 32, 70); dome(450, 240, 32, 70);
      for (const x of [120, 520]) { ctx.fillStyle = S; ctx.fillRect(x - 10, 140, 20, 180); dome(x, 142, 16, 40); }
      ctx.fillStyle = 'rgba(255,200,120,.75)'; for (let i = 0; i < 7; i++) { rr(170 + i * 48, 262, 16, 28, [8, 8, 0, 0]); ctx.fill(); }
      // water reflection
      ctx.fillStyle = lg(0, 320, 0, THT, [[0, '#7a1450'], [1, '#2a0630']]); ctx.fillRect(0, 318, TWD, 42);
      for (let i = 0; i < 14; i++) { ctx.fillStyle = `rgba(255,210,120,${.2 + h(i) * .4})`; ctx.fillRect(280 + (h(i * 3) - .5) * 120, 324 + i * 2.5, 30 + h(i) * 50, 2); }
      // dancer
      ctx.save(); ctx.translate(540, 318); ctx.fillStyle = '#1a0420';
      circ(0, -150, 13, '#1a0420'); poly([[-10, -136], [10, -136], [16, -90], [-14, -90]], '#1a0420');
      ctx.beginPath(); ctx.moveTo(-14, -92); ctx.quadraticCurveTo(-60, -20, -50, 0); ctx.lineTo(50, 0); ctx.quadraticCurveTo(40, -40, 16, -92); ctx.fill();
      ctx.strokeStyle = '#1a0420'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-8, -128); ctx.lineTo(-40, -170); ctx.moveTo(8, -128); ctx.lineTo(40, -150); ctx.stroke();
      ctx.strokeStyle = '#ffcf4a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-40, -170); ctx.bezierCurveTo(-120, -200, -110, -80, -160, -60); ctx.stroke();
      ctx.restore();
      for (let i = 0; i < 30; i++) ell(h(i * 4.1) * TWD, h(i * 2.3) * 300, 4, 2.4, ['#ffb0d0', '#ffd27a'][i % 2], h(i) * 3);
      T('SANG PUTRI', 300, 70, { size: 70, font: 'Playfair', weight: 900, grad: ['#fff6d0', '#ffd25a', '#c98a12'], stroke: '#3a0a2a', sw: 10, shadow: { c: 'rgba(0,0,0,.5)', x: 3, y: 6 } });
      durBadge('25:40');
    },
    dino() { // volcano + T-rex silhouette, "65 JUTA TAHUN"
      full(lg(0, 0, 0, THT, [[0, '#2a0a05'], [.5, '#a8320c'], [.8, '#ff8a2a'], [1, '#ffcf6a']]));
      add(470, 150, 240, 'rgba(255,120,30,.7)');
      poly([[300, 300], [420, 150], [470, 160], [520, 150], [640, 300]], '#3a1208');
      add(470, 150, 80, 'rgba(255,230,120,1)');
      ctx.save(); ctx.filter = 'blur(5px)'; for (let i = 0; i < 14; i++) circ(470 + (h(i) - .5) * 60 - i * 5, 140 - i * 12, 20 + i * 4, `rgba(60,20,15,${.6 - i * .03})`); ctx.restore();
      // meteor
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = lg(560, 20, 630, -40, [[0, 'rgba(255,240,180,1)'], [1, 'rgba(255,120,40,0)']]); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(560, 70); ctx.lineTo(650, -10); ctx.stroke(); ctx.restore(); circ(560, 70, 8, '#fff6d0');
      ctx.fillStyle = '#140604'; ctx.fillRect(0, 300, TWD, 60); for (let i = 0; i < 12; i++) poly([[i * 60, 300], [i * 60 + 30, 280 - h(i) * 30], [i * 60 + 60, 300]], '#140604');
      // T-rex roaring (silhouette)
      ctx.save(); ctx.translate(190, 300); ctx.fillStyle = '#0d0403';
      ctx.beginPath(); ctx.moveTo(-150, -60); ctx.quadraticCurveTo(-60, -120, 20, -130); ctx.lineTo(70, -190); ctx.quadraticCurveTo(110, -215, 150, -190); ctx.lineTo(160, -175); ctx.lineTo(110, -168); ctx.lineTo(140, -150); ctx.lineTo(100, -145); ctx.quadraticCurveTo(80, -110, 60, -100); ctx.quadraticCurveTo(70, -60, 40, -30); ctx.lineTo(50, 0); ctx.lineTo(20, 0); ctx.lineTo(10, -40); ctx.lineTo(-20, -40); ctx.lineTo(-10, 0); ctx.lineTo(-40, 0); ctx.lineTo(-50, -50); ctx.quadraticCurveTo(-110, -55, -150, -60); ctx.fill();
      ctx.strokeStyle = '#0d0403'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(70, -110); ctx.lineTo(95, -95); ctx.stroke();
      circ(118, -192, 3, '#ffcf4a');
      ctx.restore();
      big('65 JUTA', 450, 245, { size: 78, color: '#fff', sw: 15, rot: -.03 });
      big('TAHUN LALU', 450, 312, { size: 48, color: '#ffd23a', sw: 11, rot: -.03 });
      ring(560, 70, 34, 30, 0, '#ff2020');
      durBadge('13:55');
    },
    crayon() { // crayon drawing on paper
      ctx.drawImage(PAPER, 0, 0, 640, 1138, 0, 0, TWD, THT * 1.0);
      const scrib = (x0, y0, x1, y1, col, w, n, seed) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { ctx.globalAlpha = .5 + h(seed + i) * .4; const y = lerp(y0, y1, i / n) + (h(seed + i * 2) - .5) * 6; ctx.beginPath(); ctx.moveTo(x0 + h(i + seed) * 12, y); ctx.lineTo(x1 - h(i * 3 + seed) * 12, y + (h(i + 7) - .5) * 10); ctx.stroke(); } ctx.globalAlpha = 1; };
      scrib(0, 0, 640, 200, '#8fd0ff', 9, 40, 1);
      scrib(0, 260, 640, 360, '#6cc24a', 10, 26, 7);
      ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = .25; ctx.fillStyle = TOOTHPAT; ctx.fillRect(0, 0, TWD, THT); ctx.restore();
      // sun
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; ctx.strokeStyle = '#ffb000'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(560 + Math.cos(a) * 52, 70 + Math.sin(a) * 52); ctx.lineTo(560 + Math.cos(a) * 80, 70 + Math.sin(a) * 80); ctx.stroke(); }
      circ(560, 70, 42, '#ffd23a');
      // house
      ctx.lineWidth = 6; ctx.strokeStyle = '#c0392b'; ctx.fillStyle = 'rgba(255,120,90,.5)'; ctx.beginPath(); ctx.rect(80, 190, 120, 90); ctx.fill(); ctx.stroke();
      poly([[66, 196], [140, 130], [214, 196]], 'rgba(200,40,40,.75)');
      // dad & kid holding hands
      const fig = (x, y, s, col) => { ctx.strokeStyle = '#2b2b5a'; ctx.lineWidth = 6 * s; ctx.lineCap = 'round'; circ(x, y - 110 * s, 22 * s, '#ffcf9e'); ctx.beginPath(); ctx.arc(x, y - 110 * s, 22 * s, 0, 7); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 24 * s, y - 40 * s); ctx.lineTo(x, y - 88 * s); ctx.lineTo(x + 24 * s, y - 40 * s); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 10 * s, y - 40 * s); ctx.lineTo(x - 14 * s, y); ctx.moveTo(x + 10 * s, y - 40 * s); ctx.lineTo(x + 14 * s, y); ctx.stroke(); circ(x - 7 * s, y - 114 * s, 2.5 * s, '#2b2b5a'); circ(x + 7 * s, y - 114 * s, 2.5 * s, '#2b2b5a'); ctx.beginPath(); ctx.arc(x, y - 106 * s, 9 * s, .3, 2.8); ctx.stroke(); };
      fig(330, 320, 1.15, '#3b7bff'); fig(420, 320, .75, '#ff4f6a');
      ctx.strokeStyle = '#2b2b5a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(352, 240); ctx.lineTo(405, 262); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(432, 250); ctx.quadraticCurveTo(470, 200, 480, 150); ctx.stroke();
      ell(484, 118, 30, 36, '#ff2a3a'); ell(474, 106, 8, 12, 'rgba(255,255,255,.6)');
      T('Aku & Ayah', 210, 70, { size: 72, font: 'Caveat', weight: 700, color: '#e0663a', rot: -.05, stroke: '#fff', sw: 8 });
      big('♥', 395, 120, { size: 44, color: '#ff3a5a', sw: 0, shadow: null, font: 'Mont' });
      durBadge('6:12');
    },
    ocean() { // deep sea monster with glowing lure + diver
      full(lg(0, 0, 0, THT, [[0, '#0b5f7a'], [.45, '#063247'], [1, '#010a12']]));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(120,230,255,${.05 + h(i) * .05})`; ctx.beginPath(); ctx.moveTo(80 + i * 100, 0); ctx.lineTo(140 + i * 100, 0); ctx.lineTo(60 + i * 110, 360); ctx.lineTo(i * 110, 360); ctx.fill(); } ctx.restore();
      for (let i = 0; i < 40; i++) circ(h(i * 2.2) * TWD, h(i * 6.1) * THT, h(i) * 2 + .5, 'rgba(180,240,255,.5)');
      // anglerfish
      ctx.save(); ctx.translate(300, 220);
      ctx.fillStyle = rg(-30, -40, 190, [[0, '#2a4a5a'], [.6, '#10232c'], [1, '#03080b']]);
      ctx.beginPath(); ctx.moveTo(-170, -10); ctx.quadraticCurveTo(-120, -140, 40, -120); ctx.quadraticCurveTo(170, -90, 190, 10); ctx.quadraticCurveTo(170, 120, 20, 120); ctx.quadraticCurveTo(-120, 120, -170, -10); ctx.fill();
      // jaw + teeth
      ctx.fillStyle = '#05090c'; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, 30, 160, 30); ctx.quadraticCurveTo(10, 100, -150, 0); ctx.fill();
      ctx.fillStyle = '#e8f4f0'; for (let i = 0; i < 12; i++) { const x = -130 + i * 24, y = 8 + i * 2; poly([[x, y], [x + 8, y + 22 + h(i) * 10], [x + 14, y]], '#e8f4f0'); poly([[x + 6, y + 56 - i * 2], [x + 12, y + 34 - i * 2], [x + 18, y + 56 - i * 2]], '#d8e8e4'); }
      // eye
      circ(60, -60, 20, '#d8f5c0'); circ(64, -58, 9, '#000'); circ(58, -64, 4, '#fff');
      // lure
      ctx.strokeStyle = '#1a3440'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(20, -118); ctx.quadraticCurveTo(80, -220, 180, -160); ctx.stroke();
      ctx.restore();
      add(480, 60, 110, 'rgba(120,255,220,.9)'); circ(480, 60, 10, '#f0fff8');
      // tiny diver with torch
      ctx.save(); ctx.translate(560, 270); ctx.rotate(-.4); ctx.fillStyle = '#ffcf4a'; rr(-12, -30, 24, 50, 10); ctx.fill(); circ(0, -38, 11, '#ffcf4a'); circ(0, -38, 7, '#1a2a3a'); ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(255,240,180,.18)'; ctx.beginPath(); ctx.moveTo(548, 252); ctx.lineTo(380, 180); ctx.lineTo(420, 300); ctx.fill(); ctx.restore();
      big('MONSTER', 150, 60, { size: 64, color: '#fff', sw: 13 });
      big('LAUT?!', 150, 130, { size: 76, color: '#ffe23a', sw: 15, rot: -.04 });
      ring(480, 62, 40, 36, 0);
      durBadge('10:31');
    },
    lofi() { // anime-ish girl at window at night, rain, warm lamp
      full(lg(0, 0, 0, THT, [[0, '#1a1240'], [1, '#3b2a6a']]));
      // window with city
      ctx.fillStyle = lg(0, 30, 0, 260, [[0, '#2a2a6a'], [1, '#6a4aa0']]); ctx.fillRect(300, 30, 300, 220);
      for (let i = 0; i < 18; i++) { const x = 300 + h(i) * 280, w = 20 + h(i + 1) * 30, hh = 60 + h(i + 2) * 120; ctx.fillStyle = '#17123a'; ctx.fillRect(x, 250 - hh, w, hh); for (let k = 0; k < 8; k++) if (h(i * 9 + k) > .5) { ctx.fillStyle = 'rgba(255,210,120,.8)'; ctx.fillRect(x + 4 + (k % 2) * 9, 250 - hh + 10 + Math.floor(k / 2) * 14, 4, 5); } }
      ctx.strokeStyle = 'rgba(200,210,255,.35)'; ctx.lineWidth = 1.5; for (let i = 0; i < 50; i++) { const x = 300 + h(i * 3.3) * 300, y = 30 + h(i * 1.7) * 210; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 14); ctx.stroke(); }
      ctx.strokeStyle = '#120c2a'; ctx.lineWidth = 10; ctx.strokeRect(300, 30, 300, 220); ctx.beginPath(); ctx.moveTo(450, 30); ctx.lineTo(450, 250); ctx.stroke();
      // lamp glow + desk
      add(170, 170, 230, 'rgba(255,170,90,.55)');
      ctx.fillStyle = '#2a1830'; ctx.fillRect(0, 270, TWD, 90);
      ctx.fillStyle = '#ffcf8a'; poly([[130, 130], [210, 130], [190, 95], [150, 95]], '#ffb35a'); ctx.fillStyle = '#3a2440'; ctx.fillRect(166, 130, 6, 140);
      // girl (side) with headphones
      ctx.save(); ctx.translate(300, 270);
      ctx.fillStyle = '#ffd7c0'; ctx.beginPath(); ctx.ellipse(0, -110, 36, 40, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#2a1a3a'; ctx.beginPath(); ctx.moveTo(-40, -110); ctx.quadraticCurveTo(-30, -170, 20, -152); ctx.quadraticCurveTo(50, -140, 38, -100); ctx.quadraticCurveTo(10, -130, -30, -100); ctx.lineTo(-50, -20); ctx.lineTo(-60, -60); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#ff7aa8'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -118, 44, Math.PI * 1.1, Math.PI * 1.95); ctx.stroke(); ell(-40, -108, 10, 16, '#ff7aa8');
      ctx.fillStyle = '#e0e7ff'; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(-60, -70, -10, -70); ctx.quadraticCurveTo(40, -70, 50, 0); ctx.fill();
      ctx.strokeStyle = '#2a1a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(14, -108, 6, .2, 2.9); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#5a3a6a'; rr(330, 255, 90, 12, 3); ctx.fill(); ctx.fillStyle = '#ff9fbf'; rr(250, 258, 40, 14, 4); ctx.fill();
      T('lofi', 120, 60, { size: 54, font: 'Playfair', weight: 'italic 700', color: '#ffd6f0', glow: 'rgba(255,120,200,.8)', gb: 20 });
      ctx.fillStyle = '#ff2a2a'; rr(16, 16, 76, 28, 5); ctx.fill(); T('LIVE', 54, 31, { size: 18, weight: 900 });
      durBadge('2:14:08');
    },
  };

  // ------------------------------------------------------------------ YouTube card meta (phone-space units: 1080 wide, 210 tall)
  function avatar(info, x, y, r) {
    ctx.fillStyle = rg(x - r * .3, y - r * .4, r * 1.3, [[0, info.av[0]], [1, info.av[1]]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    T(info.ini, x, y + 2, { size: r * .78, weight: 900, color: info.av[0] === '#ffffff' ? '#fff' : '#fff', shadow: { c: 'rgba(0,0,0,.35)', x: 0, y: 2 } });
  }
  // views: optional override text; vk: highlight amount (0..1)
  function cardMeta(info, views, vk = 0) {
    avatar(info, 66, 64, 40);
    T(info.title[0], 132, 46, { size: 38, weight: 700, color: '#f1f1f1', align: 'left', maxW: 830 });
    T(info.title[1], 132, 96, { size: 38, weight: 700, color: '#f1f1f1', align: 'left', maxW: 830 });
    const a = info.ch + '  •  ', b = (views || info.v) + ' x ditonton', c = '  •  ' + info.age;
    const wa = TW(a, 30, 'Mont', 600), wb = TW(b, 30, 'Mont', 700);
    T(a, 132, 148, { size: 30, weight: 600, color: '#aaaaaa', align: 'left' });
    if (vk > 0) { ctx.save(); ctx.globalAlpha *= vk; ctx.fillStyle = 'rgba(255,255,255,.12)'; rr(132 + wa - 10, 126, wb + 20, 46, 10); ctx.fill(); ctx.restore(); }
    T(b, 132 + wa, 148, { size: 30, weight: 700, color: vk > 0 ? mixc('#aaaaaa', '#ffffff', vk) : '#aaaaaa', align: 'left' });
    T(c, 132 + wa + wb, 148, { size: 30, weight: 600, color: '#aaaaaa', align: 'left' });
    for (let k = 0; k < 3; k++) { ctx.fillStyle = '#f1f1f1'; ctx.beginPath(); ctx.arc(1040, 30 + k * 13, 4.5, 0, 7); ctx.fill(); }
    return { x: 132 + wa, y: 148, w: wb };
  }
  HW.cardMeta = cardMeta; HW.avatar = avatar;

  // ------------------------------------------------------------------ lazy init (needs fonts -> first draw, after core loaded them)
  let INIT = false;
  const TH = {}; // id -> {img:[sharp, mid, far], meta:[...]}
  function blurCopy(src, w, hh, px) { const c = mk(w, hh); const g = c.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(src, -px * 0, 0, w, hh); return c; }
  function init() {
    if (INIT) return; INIT = true;
    for (const v of VIDS) {
      const c = mk(TWD, THT); on(c.getContext('2d'), () => { ctx.save(); PAINT[v.id](); ctx.restore(); });
      const m = mk(MW, MH); on(m.getContext('2d'), () => { ctx.fillStyle = '#0f0f0f'; ctx.fillRect(0, 0, MW, MH); ctx.save(); ctx.scale(MS, MS); cardMeta(v); ctx.restore(); });
      TH[v.id] = { img: [c, blurCopy(c, 320, 180, 3), blurCopy(c, 160, 90, 4)], meta: [m, blurCopy(m, 320, 62, 2), blurCopy(m, 160, 31, 3)] };
      v.thumb = c;
    }
    const hm = mk(MW, MH); on(hm.getContext('2d'), () => { ctx.fillStyle = '#0f0f0f'; ctx.fillRect(0, 0, MW, MH); ctx.save(); ctx.scale(MS, MS); cardMeta(HERO); ctx.restore(); });
    HERO.meta = hm;
  }
  HW.init = init; HW.TH = TH;

  // ------------------------------------------------------------------ WALL geometry
  // Plane units: a tile = thumbnail 640x360 centred at (0,0) + meta strip 640x124 below. Hero tile = (0,0).
  const PX = 640 + 46, PY = THT + MH + 58;
  const COLS = 7, ROWS = 7;
  // camera of the wall at wall-time wt (hook uses wt = lt - 4)
  const S0 = HW.S0 = .40 * 1080 / 640;   // tile scale matching the phone (z=.40) at the hook/wall seam
  const S1 = .30;
  function wallCam(wt) {
    const k = 1 - Math.pow(1 - clamp(wt / 3.5), 2.6);
    const s = Math.exp(lerp(Math.log(S0), Math.log(S1), k)) * (wt < 0 ? Math.exp(-wt * .22) : 1);
    const e = HW.hookEnd ? HW.hookEnd() : { ox: 540, oy: 900, roll: -.06 };
    const kk = E.sine(clamp(wt / 3.4));
    return { s, ox: lerp(e.ox, 560, kk), oy: lerp(e.oy, 820, kk), roll: lerp(e.roll, -.11, kk) - .015 * Math.max(0, wt - 3.4), kp: lerp(.00005, .00034, E.io(clamp((wt + .5) / 3.6))) };
  }
  HW.wallCam = wallCam;
  function tileIdx(c, r) { return ((c * 5 + r * 3) % 12 + 12 * 5) % 12; }
  // returns screen placement of plane point (u,v)
  function proj(cam, u, v) {
    const g = 1 / Math.max(.25, 1 - cam.kp * v);
    const x = u * g * cam.s, y = v * g * cam.s;
    const cs = Math.cos(cam.roll), sn = Math.sin(cam.roll);
    return { x: cam.ox + x * cs - y * sn, y: cam.oy + x * sn + y * cs, sc: g * cam.s };
  }
  HW.proj = proj;
  function drift(r, wt) { if (r === 0) return 0; const sp = (r % 2 ? 1 : -1) * (26 + Math.abs(r) * 9); return sp * (wt + 2.6) * (1 + .4 * Math.max(0, wt)); }

  // draw one tile; lvl: blur level (fractional crossfades)
  function tile(id, x, y, sc, roll, lvl, alpha, wt, seed, heroCanvas) {
    if (alpha <= .01) return;
    const w = TWD * sc, th = THT * sc, mh = MH * sc;
    if (x + w < -150 || x - w > W + 150 || y + th + mh < -150 || y - th > H + 150) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(roll); ctx.globalAlpha *= alpha;
    // drop shadow (cheap)
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-w / 2 + 6 * sc, -th / 2 + 14 * sc, w, th + mh);
    const L0 = Math.floor(clamp(lvl, 0, 2)), L1 = Math.min(2, L0 + 1), f = clamp(lvl, 0, 2) - L0;
    // gentle ken-burns inside each thumbnail
    const zz = 1.06 + .04 * Math.sin(wt * .7 + seed * 3.1), pxo = Math.sin(wt * .5 + seed * 5.3) * .02, pyo = Math.cos(wt * .4 + seed) * .015;
    const drawSet = (L, a) => {
      if (a <= .01) return;
      ctx.save(); ctx.globalAlpha *= a;
      if (heroCanvas) { ctx.drawImage(heroCanvas.c, heroCanvas.sx, heroCanvas.sy, heroCanvas.sw, heroCanvas.sh, -w / 2, -th / 2, w, th); ctx.drawImage(HERO.meta, -w / 2, th / 2, w, mh); }
      else {
        const im = TH[id].img[L], iw = im.width, ih = im.height, cw = iw / zz, ch = ih / zz;
        ctx.drawImage(im, (iw - cw) / 2 + pxo * iw, (ih - ch) / 2 + pyo * ih, cw, ch, -w / 2, -th / 2, w, th);
        ctx.drawImage(TH[id].meta[L], -w / 2, th / 2, w, mh);
      }
      ctx.restore();
    };
    drawSet(L0, 1); if (f > .02 && L1 !== L0) drawSet(L1, f);
    // fine edge light
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2, -th / 2, w, th + mh);
    ctx.restore();
  }

  // the wall at wall-time wt. o: {blurBoost, dim, heroCanvas, fallT}
  function drawWall(wt, o = {}) {
    init();
    const cam = wallCam(wt);
    const list = [];
    for (let r = -ROWS; r <= 4; r++) {
      const v = r * PY; if (1 - cam.kp * v < .35) continue;
      const d = drift(r, wt);
      const cMin = Math.floor((-d) / PX) - COLS, cMax = Math.ceil((-d) / PX) + COLS;
      for (let c = cMin; c <= cMax; c++) {
        const u = c * PX + d;
        const p = proj(cam, u, v);
        if (p.x < -700 * p.sc - 200 || p.x > W + 700 * p.sc + 200 || p.y < -500 * p.sc - 200 || p.y > H + 600 * p.sc + 200) continue;
        list.push({ c, r, p });
      }
    }
    // far rows first
    list.sort((a, b) => a.r - b.r);
    for (const it of list) {
      const { c, r, p } = it; const hero = c === 0 && r === 0;
      // depth of field: focus on rows -1..1 once the rack-focus is done
      const focus = E.io(P(wt, .2, 1.6));
      const dofL = r <= -4 ? 2 : r <= -3 ? 1.4 : r === -2 ? .8 : r >= 3 ? 1.6 : r === 2 ? .7 : 0;
      let lvl = lerp(2, dofL, focus) + (o.blurBoost || 0); if (hero) lvl = 0;
      let x = p.x, y = p.y, sc = p.sc, rot = cam.roll, a = 1;
      if (o.fallT != null) {
        const fs = 3.45 + .38 * h2(c + 40, r + 40) + .05 * Math.hypot(c, r) + (hero ? .25 : 0);
        const tau = Math.max(0, wt - fs);
        y += 2600 * tau * tau * (0.6 + .4 * h2(c, r)); x += (h2(r, c) - .5) * 500 * tau;
        rot += (h2(c * 3, r) - .5) * 2.2 * tau; sc *= 1 - .35 * clamp(tau * 1.4); a = 1 - P(tau, .18, .55);
      }
      // hero tile on wall: live video when a canvas is given, hidden while the phone covers it
      if (hero && o.hideHero) continue;
      const dim = (o.dim || 0);
      tile(VIDS[tileIdx(c, r)].id, x, y, sc, rot, lvl, a * (1 - dim), wt, h2(c, r), hero ? o.heroCanvas : null);
    }
    return cam;
  }
  HW.drawWall = drawWall;

  // ------------------------------------------------------------------ DASHBOARD
  const N = 40;
  const DATA = []; { const R = mulberry(77); for (let i = 0; i < N; i++) { const k = i / (N - 1); DATA.push(.06 + .86 * Math.pow(k, 1.9) + (R() - .5) * .07 * (0.4 + k)); } DATA[N - 1] = .95; }
  const CX0 = 140, CX1 = 940, CY0 = 1330, CY1 = 900;
  const ptX = i => lerp(CX0, CX1, i / (N - 1)), ptY = i => lerp(CY0, CY1, DATA[i]);
  let CARD = null;
  function cardCanvas() {
    if (CARD) return CARD;
    CARD = mk(W, H);
    on(CARD.getContext('2d'), () => {
      // glass card
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30;
      ctx.fillStyle = lg(0, 470, 0, 1500, [[0, 'rgba(30,36,48,.92)'], [1, 'rgba(12,14,20,.95)']]); rr(70, 470, 940, 1040, 48); ctx.fill(); ctx.restore();
      ctx.strokeStyle = lg(0, 470, 0, 1500, [[0, 'rgba(255,255,255,.22)'], [.4, 'rgba(255,255,255,.06)'], [1, 'rgba(255,255,255,.1)']]); ctx.lineWidth = 2; rr(70, 470, 940, 1040, 48); ctx.stroke();
      // header
      circ(146, 560, 10, '#2ee6a6'); glowBlob(146, 560, 30, 'rgba(46,230,166,.6)', 1, 'lighter');
      T('Pendapatan', 172, 562, { size: 34, weight: 700, color: '#aeb6c6', align: 'left' });
      ctx.fillStyle = 'rgba(255,255,255,.07)'; rr(770, 532, 190, 58, 29); ctx.fill(); T('Bulan ini', 865, 562, { size: 26, weight: 700, color: '#cfd5e0' });
      // grid
      for (let k = 0; k <= 4; k++) { const y = lerp(CY0, CY1 - 40, k / 4); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 2; ctx.setLineDash([4, 10]); ctx.beginPath(); ctx.moveTo(CX0, y); ctx.lineTo(CX1, y); ctx.stroke(); }
      ctx.setLineDash([]);
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].forEach((m, i) => T(m, lerp(CX0 + 20, CX1 - 20, i / 5), 1395, { size: 26, weight: 700, color: 'rgba(200,208,224,.45)' }));
      T('*ilustrasi', 950, 1460, { size: 24, weight: 600, color: 'rgba(200,208,224,.5)', align: 'right' });
    });
    return CARD;
  }
  // continuous line path up to progress k (0..1)
  function linePts(k) { const n = k * (N - 1), out = []; for (let i = 0; i <= Math.floor(n); i++) out.push([ptX(i), ptY(i)]); const f = n - Math.floor(n), i0 = Math.floor(n); if (i0 < N - 1 && f > 0) out.push([lerp(ptX(i0), ptX(i0 + 1), f), lerp(ptY(i0), ptY(i0 + 1), f)]); return out; }
  function smoothPath(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); }

  function dashboard(lt, a) {
    const enter = E.expo(P(lt, 3.75, 4.6));
    // background
    bgGrad([[0, '#05060b'], [.5, '#070a10'], [1, '#030407']]);
    glowBlob(540, 1150, 1000, 'rgba(30,140,120,.22)', a * enter);
    glowBlob(820, 700, 700, 'rgba(255,180,80,.10)', a * enter);
    if (enter <= 0) return;
    const camZ = lt > 6.5 ? 1 + 2.4 * E.expoIn(P(lt, 6.5, 7.0)) : 1 + .03 * P(lt, 4.6, 6.5);
    const k = E.io(P(lt, 4.15, 5.75));
    const pts = linePts(Math.max(.002, k)); const head = pts[pts.length - 1];
    const fx = lt > 6.5 ? lerp(540, head[0], E.io(P(lt, 6.5, 6.95))) : 540, fy = lt > 6.5 ? lerp(960, head[1], E.io(P(lt, 6.5, 6.95))) : 960;
    ctx.save(); ctx.globalAlpha *= a;
    camera(fx, fy, camZ, () => {
      const blur = (1 - enter) * 14;
      ctx.save(); ctx.translate(540, 990); ctx.scale(lerp(.9, 1, enter), lerp(.9, 1, enter)); ctx.translate(-540, -990 + (1 - enter) * 120);
      comp(cardCanvas(), { blur, alpha: enter });
      // area fill
      if (pts.length > 1) {
        ctx.save(); smoothPath(pts); ctx.lineTo(head[0], CY0 + 10); ctx.lineTo(CX0, CY0 + 10); ctx.closePath();
        ctx.fillStyle = lg(0, CY1 - 60, 0, CY0, [[0, 'rgba(46,230,166,.32)'], [1, 'rgba(46,230,166,0)']]); ctx.fill(); ctx.restore();
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = lg(CX0, 0, CX1, 0, [[0, '#1fae86'], [.6, '#2ee6a6'], [1, '#ffe08a']]);
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= .35; ctx.lineWidth = 22; ctx.filter = 'blur(10px)'; smoothPath(pts); ctx.stroke();
        ctx.filter = 'none'; ctx.globalAlpha /= .35; ctx.globalCompositeOperation = 'source-over'; ctx.lineWidth = 7; smoothPath(pts); ctx.stroke();
        ctx.restore();
        // head
        const pulse = .5 + .5 * Math.sin(lt * 9);
        glowBlob(head[0], head[1], 90 + 30 * pulse, 'rgba(255,224,138,.55)', enter);
        ctx.fillStyle = '#fff8e0'; ctx.beginPath(); ctx.arc(head[0], head[1], 11, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(255,224,138,${.6 * (1 - pulse)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(head[0], head[1], 16 + 26 * pulse, 0, 7); ctx.stroke();
        // vertical guide at head
        ctx.strokeStyle = 'rgba(255,224,138,.18)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(head[0], head[1] + 20); ctx.lineTo(head[0], CY0); ctx.stroke(); ctx.setLineDash([]);
      }
      // revenue number
      const land = 5.75, vk = E.expo(P(lt, 4.25, land)) * .985 + .015 * P(lt, land - .25, land);
      const val = lt >= land ? 1e8 : Math.round(1e8 * vk / 1e5) * 1e5;
      const landed = lt >= land, lk = landed ? 1 - P(lt, land, land + .5) : 0;
      const numS = 'Rp' + idn(val);
      const sc = landed ? 1 + .08 * lk * Math.sin(P(lt, land, land + .5) * Math.PI) : 1;
      ctx.save(); ctx.translate(132, 715); ctx.scale(sc, sc);
      if (landed) glowBlob(380, 0, 520, 'rgba(255,200,90,.22)', 1);
      T(numS, 0, 0, { size: 108, weight: 900, align: 'left', ls: -2, maxW: 820, grad: landed ? ['#fffbe8', '#ffe08a', '#f0a83a'] : ['#ffffff', '#e8ecf4', '#c8d0de'], glow: landed ? 'rgba(255,190,80,.55)' : null, gb: 30, alpha: fi(lt, 4.15, .3) });
      ctx.restore();
      // light sweep on the number
      if (lt > land + .1 && lt < land + .9) {
        const sk = P(lt, land + .1, land + .9);
        ctx.save(); ctx.beginPath(); ctx.rect(120, 650, 860, 130); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
        const sx = lerp(80, 1050, E.io(sk)); ctx.fillStyle = lg(sx - 80, 0, sx + 80, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,245,220,.35)'], [1, 'rgba(255,255,255,0)']]);
        ctx.translate(sx, 715); ctx.rotate(.3); ctx.fillRect(-80, -140, 160, 280); ctx.restore();
      }
      T('/ bulan', 134, 808, { size: 42, weight: 700, color: '#aeb6c6', align: 'left', alpha: fi(lt, 4.4, .3) });
      const pk = pop(lt, land + .05, .4);
      if (pk > 0) { ctx.save(); ctx.translate(390, 808); ctx.scale(pk, pk); ctx.fillStyle = 'rgba(46,230,166,.16)'; rr(0, -27, 160, 54, 27); ctx.fill(); T('▲ 312%', 80, 1, { size: 28, weight: 800, color: '#2ee6a6' }); ctx.restore(); }
      ctx.restore();
      // sparks rising from the head after landing
      if (lt > land) for (let i = 0; i < 26; i++) {
        const tt = (lt - land) * (0.6 + h(i) * .8) + h(i + 3) * .6; const life = tt % 1.4;
        const x = head[0] + (h(i * 7) - .5) * 160 + Math.sin(lt * 2 + i) * 10, y = head[1] - life * (180 + h(i + 9) * 220);
        const al = (1 - life / 1.4) * P(lt, land, land + .2);
        glowBlob(x, y, 10 + h(i) * 12, `rgba(255,${200 + h(i) * 40},120,.9)`, al);
      }
    });
    ctx.restore();
  }

  // ------------------------------------------------------------------ SCENE
  SCENES_REG.wall = {
    cues: [[0, 'whoosh'], [.9, 'shimmer'], [3.5, 'whoosh_in'], [4.25, 'ticks', 1.45], [4.3, 'riser', 1.4], [5.75, 'impact'], [5.78, 'cash'], [6.5, 'whoosh']],
    draw(lt, t) {
      init();
      // backdrop
      bgGrad([[0, '#07070d'], [1, '#030306']]);
      const wallA = 1 - P(lt, 4.3, 4.6);
      if (lt >= 3.7) dashboard(lt, 1);
      if (wallA > 0) {
        // live hero video for the hero tile
        const shot = HW.shot ? HW.shot(4 + lt) : null;
        const heroCanvas = shot ? { c: shot, sx: 0, sy: HW.BAND_Y, sw: 1080, sh: 608 } : null;
        ctx.save();
        if (lt < 3.7) { glowBlob(540, 900, 1100, 'rgba(255,170,90,.10)', 1); }
        const cam = drawWall(lt, { heroCanvas, fallT: lt > 3.4 ? lt : null, hideHero: false });
        ctx.restore();
        // the phone dissolving into the hero tile
        if (lt < 1.5 && HW.phoneOnWall) HW.phoneOnWall(lt, cam);
        // the hero number from the hook drifts away
        if (lt < .8 && HW.hero) HW.hero(4 + lt, 1 - E.out(P(lt, 0, .7)));
        // atmosphere: warm light sweep across the wall + soft foreground bokeh
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const sx = lerp(-400, 1500, P(lt, .6, 3.4));
        ctx.globalAlpha = .10 * Math.sin(Math.PI * P(lt, .6, 3.4)); ctx.translate(sx, 960); ctx.rotate(.5);
        ctx.fillStyle = lg(-260, 0, 260, 0, [[0, 'rgba(255,220,170,0)'], [.5, 'rgba(255,220,170,1)'], [1, 'rgba(255,220,170,0)']]); ctx.fillRect(-260, -1600, 520, 3200);
        ctx.restore();
        for (let i = 0; i < 7; i++) {
          const x = ((h(i * 3.1) * 1400 + lt * (60 + h(i) * 90)) % 1400) - 160, y = h(i * 7.3) * 1900;
          glowBlob(x, y, 40 + h(i + 1) * 70, `rgba(255,${190 + h(i) * 50},150,.10)`, wallA * P(lt, .3, 1.2));
        }
        // top/bottom depth gradient
        ctx.save(); ctx.globalAlpha = wallA;
        ctx.fillStyle = lg(0, 0, 0, 520, [[0, 'rgba(3,3,6,.85)'], [1, 'rgba(3,3,6,0)']]); ctx.fillRect(-100, -100, W + 200, 620);
        ctx.fillStyle = lg(0, 1500, 0, H, [[0, 'rgba(3,3,6,0)'], [1, 'rgba(3,3,6,.75)']]); ctx.fillRect(-100, 1500, W + 200, 520);
        ctx.restore();
        // one quiet line
        const la = fi(lt, 1.7, .5) * (1 - P(lt, 3.2, 3.5));
        if (la > 0) T('Semua ini video animasi.', 540, 1660, { size: 54, font: 'Playfair', weight: 'italic 700', color: '#fff', alpha: la, shadow: { c: 'rgba(0,0,0,.7)', x: 0, y: 4 }, ls: lerp(6, 1, E.out(P(lt, 1.7, 2.6))) });
      }
      // push into darkness
      const dk = P(lt, 6.55, 6.97); if (dk > 0) { ctx.fillStyle = `rgba(0,0,0,${E.in(dk) * .4 + E.io(dk) * .6})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
    },
  };
})();
