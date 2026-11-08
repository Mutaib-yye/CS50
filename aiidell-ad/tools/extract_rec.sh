#!/usr/bin/env bash
# Extract the AiiDell.com screen-recording frames used by the women's version ending.
set -e
cd "$(dirname "$0")/.."
mkdir -p out/rec
ffmpeg -loglevel error -y -ss 0.5 -t 9.0 -i assets/aiidell_screen_recording.mov -vf fps=30,scale=590:1280 -q:v 3 out/rec/a_%04d.jpg
ffmpeg -loglevel error -y -ss 15.5 -t 6.5 -i assets/aiidell_screen_recording.mov -vf fps=30,scale=590:1280 -q:v 3 out/rec/b_%04d.jpg
echo "frames: $(ls out/rec/a_*.jpg | wc -l) + $(ls out/rec/b_*.jpg | wc -l)"
