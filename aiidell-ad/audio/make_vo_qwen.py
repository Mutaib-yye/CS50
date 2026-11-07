"""Female voice-over for the AiiDell ad with Qwen3-TTS, run on YOUR PC (GPU recommended).

Setup (once):
    pip install -U qwen-tts soundfile
    # models: a local folder or a Hugging Face id
    #   Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign  (designs the voice from a description; required)
    #   Qwen/Qwen3-TTS-12Hz-1.7B-Base         (optional: locks that voice so every line is the same person)

Run from the repo root:
    python aiidell-ad/audio/make_vo_qwen.py --design Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign --base Qwen/Qwen3-TTS-12Hz-1.7B-Base
    python aiidell-ad/audio/make_audio.py        # mixes the voice into aiidell-ad/audio/soundtrack.wav
Then either commit + push aiidell-ad/audio/vo/ (and Claude will re-mux the video), or mux yourself:
    ffmpeg -i video_silent.mp4 -i aiidell-ad/audio/soundtrack.wav -c:v copy -c:a aac -b:a 256k -shortest out.mp4

Output: aiidell-ad/audio/vo/NN.wav + lines.txt (same format as make_vo.py, so make_audio.py picks it up).
"""
import argparse, os, sys
import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from vo_lines import LINES

PERSONA = ("Young adult female voice, early twenties, bright, cheerful and playful, with a warm smile in her tone. "
           "Clear, crisp American English diction, medium-high pitch, lively storytelling energy like a friendly "
           "social-media narrator. Fun and charming but natural, not over the top, never shouting.")
REF_TEXT = "Hi there! Let me tell you a little story about two friends and one very special surprise."

ap = argparse.ArgumentParser()
ap.add_argument('--design', default='Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign')
ap.add_argument('--base', default=None, help='optional Base model: keeps one consistent voice across all lines')
ap.add_argument('--device', default='cuda:0' if torch.cuda.is_available() else 'cpu')
ap.add_argument('--persona', default=PERSONA)
ap.add_argument('--seed', type=int, default=7)
args = ap.parse_args()

dtype = torch.bfloat16 if args.device.startswith('cuda') else torch.float32
def load(name):
    kw = dict(device_map=args.device, dtype=dtype)
    try:
        return Qwen3TTSModel.from_pretrained(name, attn_implementation='flash_attention_2', **kw)
    except Exception:
        return Qwen3TTSModel.from_pretrained(name, **kw)

out = os.path.join(HERE, 'vo'); os.makedirs(out, exist_ok=True)
torch.manual_seed(args.seed)
design = load(args.design)

clone_prompt = None
if args.base:
    ref, sr = design.generate_voice_design(text=REF_TEXT, language='English', instruct=args.persona)
    sf.write(os.path.join(out, 'voice_reference.wav'), ref[0], sr)
    base = load(args.base)
    clone_prompt = base.create_voice_clone_prompt(ref_audio=(ref[0], sr), ref_text=REF_TEXT)

with open(os.path.join(out, 'lines.txt'), 'w') as f:
    for i, (t0, text, sp) in enumerate(LINES):
        torch.manual_seed(args.seed)
        if clone_prompt is not None:
            wavs, sr = base.generate_voice_clone(text=text, language='English', voice_clone_prompt=clone_prompt)
        else:
            wavs, sr = design.generate_voice_design(text=text, language='English', instruct=args.persona)
        x = np.asarray(wavs[0], dtype=np.float32)
        nz = np.where(np.abs(x) > 0.01)[0]
        if len(nz):
            x = x[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.08 * sr)]
        sf.write(os.path.join(out, f'{i:02d}.wav'), x, sr, subtype='PCM_16')
        dur = len(x) / sr
        f.write(f'{i:02d}\t{t0:.2f}\t{dur:.2f}\t{text}\n')
        print(f'{i:02d} start {t0:6.2f}  dur {dur:4.2f}  end {t0 + dur:6.2f}  {text}')
print('done ->', out, '\nCheck that each line ends before the next one starts (see VO_SHIFT in make_audio.py to nudge timings).')
