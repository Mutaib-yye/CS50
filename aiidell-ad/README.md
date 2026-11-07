# AiiDell.com – Cinematic Ad: "Send Gifts from India to Indonesia"

A 50-second, **vertical 1080×1920 (9:16)**, 30 fps motion-graphics advertisement for TikTok, Instagram Reels and Stories, and YouTube Shorts, in a Disney-inspired, cute, premium style.
It uses a stacked split-screen comparison: **the hard way** (top) vs. **the AiiDell way** (bottom). Key text is kept clear of TikTok's on-screen buttons.

The characters have fair skin. Rahul and Arjun are distinctly Indian men. Putri, in a pastel kebaya with a batik accent and a frangipani, and the AiiDell Jakarta team (one member in a hijab) are distinctly Indonesian. Hands have jointed fingers and thumbs, arms have elbows that bend out and down, and no arm, hand or prop ever crosses a face.

* `AiiDell_India_to_Indonesia_Ad.mp4` – the final video (H.264 + AAC, music and SFX only, **no voice**)
* `VOICEOVER_SCRIPT.md` – an optional, timed voice-over script for recording your own voice
* `audio/soundtrack.wav` – the original music score and synced sound effects (48 kHz stereo)

## Storyboard (as rendered)
| Time | Scene |
|---|---|
| 0–5 s | Opening hook: two young Indian men side by side, each dreaming of a surprise for Indonesia. Headline "WANT TO SEND A GIFT TO INDONESIA?" with "THE HARD WAY" vs "THE AiiDELL WAY" |
| 5–18 s | Left: search results → asking travellers in a group chat (seen, no reply) → a courier quote with customs, tax and fees plus a "Documents Required" stamp → flying paperwork, a spinning clock and question marks. Right: types www.aiidell.com → browses → adds a bouquet to the cart → enters recipient details (Putri, Jakarta) → checks out → "Order Confirmed!" with confetti → "Wait… that's it? So easy!" |
| 18–28 s | Left: on hold with the courier helpline, bills piling up. Right: the AiiDell team in Jakarta receives and prepares the order → a gift box travels along a glowing India → Indonesia route → Putri receives and opens her surprise (flowers, cake, snacks, food), with the sender smiling in picture-in-picture |
| 28–39.5 s | Product showcase: Flowers, Gifts, Food, Snacks, Cakes, followed by the delivery notes (same-day delivery may be available depending on the location; other options depending on the area and service) |
| 39.5–45 s | Final comparison: an exhausted man buried in paperwork vs. a happy video call. The left side fades and the right side expands |
| 45–50 s | Magical India → Indonesia connection, "Different countries. One simple way to make someone smile.", the AiiDell.com logo, "Why make it complicated…", and "VISIT US NOW: www.aiidell.com" |

## Re-rendering
Everything is generated from code, so you can edit text, colours or timing and render again:
```bash
python3 audio/make_audio.py                      # music + SFX -> audio/soundtrack.wav
node render.js stills out/stills 3 10 26 46      # preview frames (PNG)
node render.js video out/video.mp4 0 50          # silent video (or render segments in parallel)
ffmpeg -i out/video.mp4 -i audio/soundtrack.wav -c:v copy -c:a aac -b:a 256k -shortest AiiDell_India_to_Indonesia_Ad.mp4
```
You need Node with Playwright (Chromium), Python 3 with numpy, and ffmpeg.

Character test sheet: `node test/shot.js test/out` (it renders `test/chars.html`).

Source layout: `src/core.js` (easing and drawing helpers), `src/characters.js` (the men, the women, faces and expressions), `src/props.js` (rooms, phone UI, products, map, logo), and `src/scenes.js` (the scene timeline).

The logo is a stylised wordmark created for this ad. To use your official logo, replace `drawLogo` and `drawLogoIcon` in `src/props.js`.
