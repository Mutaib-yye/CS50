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
with open(os.path.join(out, 'lines.txt'), 'w') as f:
    for i, (t0, text, sp) in enumerate(LINES):
        samples, sr = k.create(text, voice=voice, speed=sp, lang='en-us')
        samples = np.asarray(samples, dtype=np.float32)
        # trim leading/trailing silence
        nz = np.where(np.abs(samples) > 0.01)[0]
        if len(nz):
            samples = samples[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.08 * sr)]
        path = os.path.join(out, f'{i:02d}.wav')
        sf.write(path, samples, sr)
        dur = len(samples) / sr
        f.write(f'{i:02d}\t{t0:.2f}\t{dur:.2f}\t{text}\n')
        print(f'{i:02d} start {t0:6.2f}  dur {dur:4.2f}  end {t0 + dur:6.2f}  {text}')
