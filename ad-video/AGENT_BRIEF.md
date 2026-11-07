# Brief for scene agents — "AI MOTION CUAN" premium ad (v3)

## What we are making
A ~64 s vertical (1080x1920, 30 fps) social ad for **Indonesian** viewers (Reels / Shorts / TikTok).
Product: an online course that teaches people to make animated videos with **Claude** (AI) and earn from them:
views on YouTube/IG/TikTok **and TikTok affiliate selling** (an animated character sells products for you; no face, no stock).
The ad ends with "Komen MOTION" (comment MOTION and we DM you the details). Nothing is sold in the ad itself.

The client said v2 looked **cheap** and **told too much with text**. v3 must feel **premium and cinematic**, and must
**SHOW, not tell**: the visuals carry the story. On-screen text: Bahasa Indonesia, at most one short line (ideally ≤ 4 words)
per beat, often none. UI text that belongs to a mock phone/laptop screen is fine but keep it small and believable.

## Quality bar (read twice)
Think high-end motion design / animated film title sequence, not clip-art. Concretely:
- **Depth**: 3–6 parallax layers, atmospheric perspective (far = lighter/bluer/less contrast), depth of field (blur far/near layers with `comp(canvas,{blur})`).
- **Light**: rich multi-stop gradients, volumetric light shafts and glow (`glowBlob`, 'lighter' blending), bloom on bright parts (`bloom`), rim light on characters, soft shadows (`ctx.shadowBlur`), a deliberate colour grade.
- **Motion**: every shot has a slow camera move (push / drift / parallax); eased everything (`E.expo`, `E.quint`, `E.back` for overshoot); anticipation + follow-through; secondary motion (hair, cloth, grass, particles) driven by `noise1/noise2`; motion blur on fast objects (draw a few trailing copies with falling alpha).
- **Detail & texture**: no large flat single-colour areas; add subtle texture (grain is global), highlights, small particles (dust motes, petals, sparks) with depth (size/blur/speed by depth).
- **Characters**: original designs, appealing proportions, smooth shapes (bezier curves, not boxes), shading (gradient + rim light), idle motion (breathing, blinking, hair sway).
- Avoid: thick uniform black outlines (unless the style needs ink), emoji as the main visual, stiff linear motion, centered-everything layouts, big paragraphs of text.

## Technical contract
- Edit **only your own file(s)** in `ad-video/scenes/`. Wrap everything in an IIFE `(() => { ... })();` so names don't collide.
  Register exactly as the placeholder does:
  - Scenes: `SCENES_REG.<name> = { cues: [...], draw(lt, t) { ... } }`
  - Showcase styles: `STYLES_REG.<name> = { label: 'GAYA GHIBLI', cues: [...], draw(lt, t) { ... } }`
  `lt` = local seconds since your scene/clip starts, `t` = global seconds. Draw the **full frame** (bg included; overscan to -100..W+100 since camera shake can move the frame).
- **Deterministic**: a frame must be a pure function of time. No `Math.random()`, no `Date`, no state carried between frames
  (frames are rendered out of order by 4 parallel workers). Use `h(n)`, `h2(a,b)`, `noise1`, `noise2`, `fbm2`, or `mulberry(seed)` **only at load time**.
- **Performance**: typical frame < ~150 ms, never > 300 ms (the stills tool prints ms). Pre-render static art once at load
  into offscreen canvases (`mk(w,h)` / `paint(name, fn)`), including pre-blurred versions; per-frame `ctx.filter = 'blur()'` on a full-frame layer is OK at most ~2 times per frame.
- Leave `ctx` clean: always `ctx.save()/ctx.restore()` around transforms, filters, alpha, composite modes.
- Safe area: keep key content inside x 60–1020, y 170–1750 (platform UI covers the edges).
- **IP rules**: original characters/designs only. "Ghibli-style"/"Bollywood-style" means the *feel* (painterly, pastoral / dramatic, colourful), never copying real films, characters or scenes.
  No real logos (TikTok, YouTube, Instagram, Claude/Anthropic). Platform names as plain text are OK; Claude can be shown as the word "Claude" with a generic coral (#D97757) sparkle.
- Money/earnings numbers must carry a small "*ilustrasi" note when shown.

## Toolkit (globals from `core.js`; read it for details)
`W=1080, H=1920`, `ctx` (current context; `on(otherCtx, fn)` temporarily redirects all helpers), `CORAL`, `YEL`.
Math: `clamp, lerp, P(t,a,b)` (0..1 progress), `E.out/in/io/back/expo/expoIn/sine/quint`, `pop(t,t0,d)` (overshoot 0→1), `fi(t,t0,d)` (fade-in), `h, h2, mulberry, noise1, noise2, fbm2, mixc(hex,hex,k)`.
Drawing: `T(text,x,y,{size,font,weight,color,stroke,sw,align,base,glow,gb,alpha,rot,sc,ls,shadow:{c,x,y},maxW,grad:[...]})`,
`TW(text,size,font,weight,ls)`, `rich([[text,color],...],x,y,opts)`, `pill`, `rr(x,y,w,h,r)` (path), `bgFill, bgGrad([[stop,color]],y0,y1), radial`, `rays`, `sparkle(x,y,r,color,rot)`, `check`, `chevron`, `camera(cx,cy,zoom,fn)`, `glitchT`.
Layers: `mk(w,h)`, `layer(name)`, `paint(name, fn) -> canvas`, `comp(canvas,{blur,alpha,mode,x,y,w,hh})`, `bloom(canvas,px,alpha)`, `glowBlob(x,y,r,color,alpha,mode)`, `letterbox(k)`, `subtitle(text,y,alpha)` (Playfair italic, cinema style).
Textures: `PAPER` (W×H paper), `TOOTHPAT` (crayon tooth pattern), `HALFPAT`/`HALFDPAT` (screentone), `GRAINPAT`, `BRICK`.
Fonts: `Mont` (600–900, clean sans), `Anton` (condensed display), `Playfair` (700/900 normal, 400/700/900 italic: elegant serif), `Bangers` (comic), `Marker` (graffiti), `Caveat` (crayon/handwriting), `Pixel`, `IPAGothic` (Japanese), `Noto Color Emoji` (fallback). In `T()` use e.g. `{font:'Playfair', weight:'italic 700'}`.
Global post (don't redo): vignette, film grain, camera shake + white flash on `impact`/`impact_big`/`slam`/`stamp` cues.

## Sound cues
`cues: [[localTime, type, optionalDuration], ...]` drive sound effects (and shake/flash for the hit types above; use hits sparingly: ≤ 2–3 per scene).
Types: `impact, impact_big, whoosh, whoosh_in, pop, cash, ding, notif, buzz, glitch(d), spray(d), riser(d), coin, jump, levelup, slam, stamp, clock, ticks(d), cuts(d), type(d)` (keyboard typing), `shimmer` (magic sparkle), `swell(d)` (soft cinematic swell).
Music bed is separate; you only list SFX.

## How to check your work (do this repeatedly)
```
cd /home/user/CS50/ad-video
node tools/stills.js --scene <name> --times 0.2,0.8,1.5,2.5,3.5 --out <your scratch dir>
node tools/stills.js --style <name> --times 0.2,1,2,3 --out <your scratch dir>
```
Then open the printed `*_sheet.jpg` with the Read tool and **critique it like a demanding art director**: does it look premium? is it readable?
is there too much text? would a viewer understand the beat with the sound off? Iterate (at least 3 critique→improve rounds). Check for PAGE ERRORS in the output.
Do not run `node render.js` (full render) — the integrator does that. Do not commit.
