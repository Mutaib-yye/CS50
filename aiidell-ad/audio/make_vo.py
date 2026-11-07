"""Female voice-over (fun, warm, clear) for the AiiDell ad, using Kokoro neural TTS.
Needs: pip install kokoro-onnx soundfile ; model files kokoro-v1.0.onnx + voices-v1.0.bin
Usage: python make_vo.py <model_dir>   -> writes audio/vo/NN.wav (24 kHz) + audio/vo/lines.txt"""
import sys, os
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

model_dir = sys.argv[1]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vo')
os.makedirs(out, exist_ok=True)
k = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))
# blend: warm + clear (heart) with bright, playful energy (bella)
voice = k.get_voice_style('af_heart') * 0.6 + k.get_voice_style('af_bella') * 0.4

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vo_lines import LINES
def synth(text, sp):
    x, sr = k.create(text, voice=voice, speed=float(sp), lang='en-us')
    x = np.asarray(x, dtype=np.float32)
    nz = np.where(np.abs(x) > 0.01)[0]
    if len(nz):
        x = x[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
    return x, sr

for old in os.listdir(out):
    if old.endswith('.wav'): os.remove(os.path.join(out, old))
with open(os.path.join(out, 'lines.txt'), 'w') as f:
    for i, (t0, t1, text) in enumerate(LINES):
        target = (t1 - t0) - 0.05
        sp = 1.05
        for _ in range(3):  # fit the line to fill its window (cheerful pace, no silent gaps)
            x, sr = synth(text, sp)
            dur = len(x) / sr
            sp = float(np.clip(sp * dur / target, 0.9, 1.35))
            if abs(dur - target) < 0.12: break
        x, sr = synth(text, sp) if abs(len(x) / sr - target) >= 0.12 else (x, sr)
        dur = len(x) / sr
        sf.write(os.path.join(out, f'{i:02d}.wav'), x, sr)
        f.write(f'{i:02d}\t{t0:.2f}\t{dur:.2f}\t{text}\n')
        print(f'{i:02d} {t0:6.2f}-{t0 + dur:6.2f} (window to {t1:5.2f}) speed {sp:.2f}  {text[:60]}')
