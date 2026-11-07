# AiiDell.com – Cinematic Ad: "Send Gifts from India to Indonesia"

A 50-second, **vertical 1080×1920 (9:16)**, 30 fps motion-graphics advertisement for TikTok, Instagram Reels and Stories, and YouTube Shorts, in a Disney-inspired, cute, premium style.
It tells a **soft-sell story** in a left/right split screen: **Rahul** (left) does it the hard way and **Arjun** (right) does it the AiiDell way. Gentle narration captions carry the story; there is no hard-sell headline. Key text is kept clear of TikTok's on-screen buttons.

The characters have fair skin. Rahul and Arjun are distinctly Indian men. Putri, in a pastel kebaya with a batik accent and a frangipani, and the AiiDell team in Indonesia (one member in a hijab) are distinctly Indonesian, with fair, light skin and a yellow undertone. Hands have jointed fingers and thumbs, arms have elbows that bend out and down, and no arm, hand or prop ever crosses a face.

* `AiiDell_India_to_Indonesia_Ad.mp4` – the final video (H.264 + AAC): music, SFX and a **fun, friendly female voice-over** reading the story (Kokoro neural TTS; the music dips under her voice)
* `AiiDell_India_to_Indonesia_Ad_MaleVoice.mp4` – the same video with a cheerful male narrator (Kokoro "am_michael" + "am_puck" blend; `audio/vo_male/`, `audio/soundtrack_male.wav`)
* `VOICEOVER_SCRIPT.md` – an optional, timed voice-over script for recording your own voice
* `audio/soundtrack.wav` – the original music score and synced sound effects (48 kHz stereo)

## Storyboard (as rendered)
| Time | Scene |
|---|---|
| 0–6 s | "Meet Rahul and Arjun." / "Both want to surprise someone special in Indonesia." Both men, side by side, dream of a surprise. |
| 6–13 s | "But look at Rahul…" (the left side is in the spotlight): searching for the best shop and courier, asking travellers (seen, no reply), an expensive courier quote with customs, flying paperwork and a spinning clock. |
| 13–20 s | "And Arjun?" / "Just a few clicks on AiiDell.com…" (the right side is in the spotlight): aiidell.com → bouquet → her details → order confirmed → a happy fist pump. |
| 20–28 s | Full screen: "Our team in Indonesia takes care of everything…" / "…right to her door." The AiiDell team in Indonesia, the India → Indonesia route, and Putri opening her surprise. Small insets show Rahul still on hold and Arjun smiling. |
| 28–37.5 s | What you can send: Flowers, Gifts, Food, Snacks, Cakes, plus the delivery notes. |
| 37.5–44.5 s | "One is still searching…" / "…the other is already smiling." Rahul is exhausted; Arjun is on a video call with Putri. |
| 44.5–50 s | India → Indonesia connection, "Different countries. One simple way to make someone smile.", the AiiDell.com logo, and "Send love the easy way · www.aiidell.com". |

## Voice-over
* `audio/vo_lines.py` – the voice lines and their start times (shared by both generators).
* `audio/make_vo.py <kokoro_model_dir> [female|male]` – the Kokoro voices (male: `VO_DIR=vo_male OUT_WAV=soundtrack_male.wav python3 audio/make_audio.py`). The female voice is (Kokoro "af_heart" + "af_bella" blend). It writes `audio/vo/`.
* `audio/make_vo_qwen.py` – the same lines with **Qwen3-TTS** on your own PC. The VoiceDesign model creates the voice from a description, and the optional Base model keeps it consistent across lines. Run it, then `python aiidell-ad/audio/make_audio.py`, then push `audio/vo/` (or mux it yourself with ffmpeg).

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
