// Shared timeline of sound effects / camera hits. Read by ad.js (shake + flash) and music.py (SFX).
// [time_seconds, type, optional_duration]
window.CUES = [
  [0.0, "impact_big"], [0.0, "glitch", 0.3], [0.9, "whoosh"], [0.9, "pop"], [1.2, "pop"], [1.6, "impact"],
  [2.0, "pop"], [3.2, "whoosh"],
  [3.5, "whoosh"], [4.0, "pop"],
  [7.3, "riser", 0.7], [8.2, "impact_big"], [8.25, "ticks", 1.55], [8.9, "pop"], [9.1, "pop"], [9.3, "pop"], [9.5, "pop"],
  [9.8, "cash"], [9.9, "pop"],
  [11.0, "whoosh"], [11.2, "pop"], [11.55, "pop"], [12.4, "whoosh"], [12.4, "ticks", 1.4], [13.9, "stamp"], [13.9, "cash"],
  [14.6, "pop"], [14.65, "ticks", 1.0], [15.7, "cash"], [16.0, "pop"],
  [17.5, "glitch", 0.5], [17.5, "impact"], [18.0, "pop"],
  [18.7, "pop"], [18.9, "buzz"], [19.15, "pop"], [19.35, "buzz"], [19.6, "pop"], [19.8, "buzz"],
  [20.2, "whoosh"], [20.7, "impact_big"], [21.2, "pop"], [21.9, "riser", 1.3], [22.6, "pop"],
  [23.2, "impact_big"],
  [26.05, "whoosh"], [26.2, "impact"], [26.3, "spray", 1.4], [27.8, "pop"], [27.8, "spray", 0.35],
  [29.05, "whoosh"], [29.2, "slam"], [29.8, "slam"], [30.3, "slam"], [30.9, "slam"],
  [32.05, "whoosh"], [32.2, "impact"], [32.5, "ding"],
  [35.05, "whoosh"], [35.2, "impact"], [35.7, "coin"], [36.1, "coin"], [36.4, "jump"], [36.7, "coin"], [37.1, "levelup"], [37.5, "coin"],
  [38.05, "whoosh"], [38.2, "impact"], [38.4, "glitch", 0.25],
  [41.2, "impact"], [41.2, "cuts", 1.8], [42.1, "impact"],
  [43.0, "whoosh"], [43.6, "impact"], [44.4, "whoosh"],
  [45.2, "ding"], [46.2, "ding"], [47.2, "ding"], [48.2, "ding"], [49.2, "ding"], [50.2, "cash"],
  [52.0, "whoosh"], [52.2, "impact"], [52.5, "pop"], [52.7, "whoosh"], [53.4, "pop"], [53.6, "ding"],
  [53.8, "pop"], [54.0, "ticks", 1.2], [55.0, "pop"], [55.8, "stamp"], [55.8, "cash"],
  [56.5, "whoosh"], [56.8, "ding"], [57.4, "ding"], [57.4, "cash"], [58.0, "ding"], [58.6, "ding"],
  [60.0, "impact_big"], [61.3, "impact_big"], [61.3, "cash"], [62.8, "whoosh"], [63.0, "impact"],
  [63.3, "pop"], [63.6, "pop"], [63.9, "pop"], [64.2, "pop"], [64.6, "pop"], [65.1, "impact"],
  [65.8, "clock"], [66.8, "clock"], [67.2, "impact_big"]
];
