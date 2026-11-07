// SHOWCASE DRIVER: sequences the style clips registered in STYLES_REG, adds a small lower-third label,
// a fast montage at the end, and offsets each style's cues.
(() => {
  const SEQ = [['ghibli', 3.4], ['bollywood', 3.2], ['history', 3.4], ['manga', 3.0], ['crayon', 3.0]];
  const MONT = 1.5;
  const starts = []; { let t = 0; for (const [n, d] of SEQ) { starts.push(t); t += d; } }
  const MONT0 = starts[starts.length - 1] + SEQ[SEQ.length - 1][1];
  window.SHOWCASE_SEQ = SEQ.map(([n, d], i) => ({ name: n, start: starts[i], dur: d }));
  function label(name, l, dur) {
    const a = E.out(P(l, .15, .5)) * (1 - P(l, dur - .25, dur));
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const x = 70, y = 1700, w = TW(name, 34, 'Mont', 800, 8);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(x, y - 30, 4, 60);
    T(name, x + 26, y - 6, { size: 34, weight: 800, align: 'left', ls: 8, shadow: { c: 'rgba(0,0,0,.6)', x: 0, y: 3 } });
    T('✦ dibuat dengan Claude', x + 26, y + 30, { size: 24, weight: 700, align: 'left', color: 'rgba(255,255,255,.75)', shadow: { c: 'rgba(0,0,0,.6)', x: 0, y: 2 } });
    ctx.restore();
  }
  const cues = [];
  SEQ.forEach(([n, d], i) => { cues.push([starts[i], i ? 'whoosh_in' : 'impact_big']); for (const c of (STYLES_REG[n].cues || [])) if (c[0] < d) cues.push([starts[i] + c[0], ...c.slice(1)]); });
  cues.push([MONT0, 'impact'], [MONT0, 'cuts', MONT], [MONT0 + MONT * .5, 'impact']);
  SCENES_REG.showcase = {
    cues,
    draw(lt, t) {
      if (lt < MONT0) {
        let i = 0; while (i < SEQ.length - 1 && lt >= starts[i + 1]) i++;
        const l = lt - starts[i], [n, d] = SEQ[i];
        ctx.save(); STYLES_REG[n].draw(l, t); ctx.restore();
        // quick white-ish cut flash at each cut
        const fl = 1 - P(l, 0, .12); if (fl > 0 && i > 0) { ctx.fillStyle = `rgba(255,255,255,${fl * .35})`; ctx.fillRect(0, 0, W, H); }
        label(STYLES_REG[n].label, l, d);
      } else {
        const k = Math.floor((lt - MONT0) / .12), i = k % SEQ.length, [n, d] = SEQ[i];
        ctx.save(); STYLES_REG[n].draw(d * .55 + ((lt - MONT0) % .12), t); ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(0, 0, W, H);
        const half = lt < MONT0 + MONT * .5;
        T(half ? 'Semua gaya.' : 'Satu AI.', 540, 960, { size: 150, font: 'Playfair', weight: 'italic 900', color: '#fff', shadow: { c: 'rgba(0,0,0,.6)', x: 0, y: 8 }, sc: pop(lt, half ? MONT0 : MONT0 + MONT * .5, .25) });
      }
    },
  };
})();
