# AI Motion Cuan — 68s vertical video ad (Bahasa Indonesia)

**Final video:** `AI_Motion_Cuan_Ad_9x16.mp4` (1080x1920, 30fps, H.264 + AAC, 68s). Made for Reels, Shorts and TikTok.

Every frame is drawn in code (`ad.js`, HTML canvas). The soundtrack is original and made with `music.py` (numpy), so there are no stock or copyrighted assets.

## Rebuild after editing
```bash
python3 music.py          # -> out/audio.wav
node render.js            # -> out/video.mp4  (Playwright + ffmpeg, ~2 min)
ffmpeg -y -i out/video.mp4 -i out/audio.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart AI_Motion_Cuan_Ad_9x16.mp4
```
Preview stills: `STILLS=5,24,66 node render.js`. To watch it live, open `ad.html` in a browser.

- Timeline and sound cues: `cues.js`
- Scenes: `sHook`, `sFeed`, `sMoney`, `sTwist`, `sShowcase` (6 styles), `sCourse`, `sHow`, `sOffer` in `ad.js`
- Voice-over script: `VOICEOVER_SCRIPT.md`
