// Scene order + durations (seconds). Loaded AFTER all scenes/*.js.
// Each scene's cues are local times; they are offset here into the global CUES list
// (used for camera shake/flash in core.js and for SFX in music.py via out/cues.json).
window.ORDER = [
  ['hook', 4.0],       // gorgeous animated shot pulls back -> phone, 128 jt views
  ['wall', 7.0],       // wall of viral animated videos -> earnings chart
  ['claude', 6.0],     // laptop: prompt typed to Claude -> animation bursts out of screen
  ['showcase', 17.5],  // ghibli, bollywood, history, manga, crayon + montage
  ['affiliate', 12.0], // animated character sells on TikTok, orders + commission
  ['course', 8.0],     // the course as a premium product
  ['cta', 9.5],        // "Komen MOTION" -> DM
];
window.TIMELINE = []; CUES = [];
{ let t = 0; for (const [name, dur] of window.ORDER) { window.TIMELINE.push({ name, start: t, dur }); for (const c of (window.SCENES_REG[name].cues || [])) CUES.push([t + c[0], ...c.slice(1)]); t += dur; } window.DURATION = t; }
CUES.sort((a, b) => a[0] - b[0]);
window.CUES = CUES;
