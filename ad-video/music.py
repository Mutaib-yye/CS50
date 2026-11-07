"""Synthesises the ad soundtrack (music bed + SFX) with numpy only -> out/audio.wav
Music is original, generated from scratch (royalty-free). SFX timings come from cues.js."""
import json, re, wave, os
import numpy as np

SR = 44100
DUR = 68.0
N = int(SR * (DUR + 1))
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(42)

cues_src = open(os.path.join(HERE, 'cues.js')).read()
CUES = json.loads(re.search(r'window\.CUES\s*=\s*(\[.*\]);', cues_src, re.S).group(1))

def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.uniform(-1, 1, int(d * SR))
def spec_filter(sig, fn):
    n = len(sig); F = np.fft.rfft(sig); f = np.fft.rfftfreq(n, 1 / SR); return np.fft.irfft(F * fn(f), n)
def lp(sig, fc, order=2): return spec_filter(sig, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))
def hp(sig, fc, order=2): return spec_filter(sig, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1)) ** (2 * order)))
def bp(sig, f0, q=2.0): return spec_filter(sig, lambda f: 1 / np.sqrt(1 + (q * (f / f0 - f0 / np.maximum(f, 1))) ** 2))
def saw(freq, t): return 2 * ((t * freq) % 1) - 1
def add(buf, t, sig, g=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    s = sig[:len(buf) - i]; buf[i:i + len(s)] += s * g
def sweep_filter(sig, f_start, f_end, q=3.0, chunk=1024):
    out = np.zeros_like(sig); n = len(sig); win = np.hanning(chunk * 2)
    for s in range(0, n, chunk):
        seg = sig[s:s + chunk * 2]
        if len(seg) < 8: break
        k = s / max(n - 1, 1); fc = f_start * (f_end / f_start) ** k
        y = bp(seg, fc, q) * win[:len(seg)]; out[s:s + len(seg)] += y
    return out

# ---------------- instruments
def kick():
    t = tt(.5); f = 42 + 120 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 6.5) + noise(.5) * np.exp(-t * 250) * .25
    return np.tanh(s * 1.8) * .9
def clap():
    t = tt(.3); n = bp(noise(.3), 1400, 1.2)
    env = np.exp(-t * 22) + .6 * (np.exp(-np.maximum(t - .012, 0) * 120) * (t > .012)) + .5 * (np.exp(-np.maximum(t - .024, 0) * 120) * (t > .024))
    return n * env * 1.6
def hat(open_=False):
    d = .35 if open_ else .06; t = tt(d); return hp(noise(d), 7000) * np.exp(-t * (11 if open_ else 70)) * .5
def snare():
    t = tt(.22); return (bp(noise(.22), 2500, .8) * 1.2 + np.sin(2 * np.pi * 190 * t) * .5) * np.exp(-t * 20)
KICK, CLAP, HAT, OHAT, SNARE = kick(), clap(), hat(), hat(True), snare()

def bass_note(f, d):
    t = tt(d); s = saw(f, t) * .6 + np.sin(2 * np.pi * f * t) * .8 + np.sin(np.pi * f * t) * .5
    env = np.minimum(t / .005, 1) * np.exp(-t * 3.5) * np.clip((d - t) / .02, 0, 1)
    return lp(s, 420) * env
def supersaw(freqs, d, fc=2600, dec=5.0, att=.004):
    t = tt(d); s = np.zeros_like(t)
    for f in freqs:
        for det in (-.006, -.003, 0, .003, .006): s += saw(f * (1 + det), t + rng.uniform(0, 1))
    s /= (len(freqs) * 5) ** .5
    env = np.minimum(t / att, 1) * np.exp(-t * dec) * np.clip((d - t) / .03, 0, 1)
    return lp(s, fc) * env
def pad(freqs, d, fc=900):
    t = tt(d); s = np.zeros_like(t)
    for f in freqs:
        for det in (-.004, 0, .004): s += saw(f * (1 + det), t + rng.uniform(0, 1))
    s = lp(s / (len(freqs) * 3) ** .5, fc)
    env = np.minimum(t / .25, 1) * np.clip((d - t) / .3, 0, 1)
    return s * env
def pluck(f, d=.25):
    t = tt(d); s = (saw(f, t) * .5 + np.sign(np.sin(2 * np.pi * f * t)) * .3)
    return lp(s, 3200) * np.exp(-t * 14)
def bell(f, d=1.2):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.01 * t) + .15 * np.sin(2 * np.pi * f * 3.98 * t)) * np.exp(-t * 3.2)

# ---------------- SFX
def sfx_whoosh(d=.45):
    t = tt(d); s = sweep_filter(noise(d), 400, 5000, 1.5); env = np.sin(np.pi * t / d) ** 2
    return s * env * 1.4
def sfx_impact(big=False):
    d = 1.8 if big else 1.0; t = tt(d); f = 30 + 70 * np.exp(-t * 12)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (2.2 if big else 4))
    crack = lp(noise(d), 2500) * np.exp(-t * 14) * .8
    return np.tanh((boom * 1.4 + crack) * (1.6 if big else 1.2)) * (1.0 if big else .75)
def sfx_pop():
    t = tt(.09); f = 500 + 900 * (t / .09); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * .5
def sfx_tick():
    t = tt(.02); return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 300) * .35
def sfx_cash():
    out = np.zeros(int(.9 * SR)); t = tt(.8)
    ring = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((2093, .5), (2637, .4), (3136, .35), (4186, .2))) * np.exp(-t * 5)
    cha = hp(noise(.08), 3000) * np.exp(-tt(.08) * 50)
    add(out, 0, cha * .6); add(out, .1, cha * .5); add(out, .1, ring * .45)
    return out
def sfx_buzz():
    t = tt(.32); return lp(saw(110, t) + saw(117, t), 1800) * .35 * np.clip((.32 - t) / .03, 0, 1) * np.minimum(t / .005, 1)
def sfx_ding():
    return bell(1568, .8) * .35 + np.pad(bell(2349, .6), (0, int(.8 * SR) - int(.6 * SR))) * .12
def sfx_glitch(d):
    n = int(d * SR); s = np.zeros(n); blk = int(.018 * SR)
    for i in range(0, n, blk):
        if rng.random() < .65:
            seg = np.sign(rng.uniform(-1, 1, min(blk, n - i))) * rng.uniform(.2, .6)
            s[i:i + len(seg)] = np.repeat(seg[::8], 8)[:len(seg)]
    return lp(s, 6000) * .5
def sfx_spray(d):
    t = tt(d); s = hp(noise(d), 2500) * (.8 + .2 * np.sin(2 * np.pi * 9 * t)); env = np.minimum(t / .05, 1) * np.clip((d - t) / .08, 0, 1)
    return s * env * .35
def sfx_riser(d):
    t = tt(d); s = sweep_filter(noise(d), 300, 9000, 2.0) * (t / d) ** 2 * 1.5
    f = 150 + 1000 * (t / d) ** 2; s += np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 2 * .25
    return s
def sfx_coin():
    out = np.zeros(int(.3 * SR)); t1 = tt(.06); t2 = tt(.22)
    sq = lambda f, t: np.sign(np.sin(2 * np.pi * f * t))
    add(out, 0, sq(1047, t1) * .18); add(out, .06, sq(1568, t2) * np.exp(-t2 * 12) * .18)
    return out
def sfx_jump():
    t = tt(.18); f = 300 + 700 * (t / .18); return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 10) * .12
def sfx_levelup():
    out = np.zeros(int(.7 * SR)); sq = lambda f, t: np.sign(np.sin(2 * np.pi * f * t))
    for i, f in enumerate((523, 659, 784, 1047, 1319)):
        t = tt(.12 if i < 4 else .3); add(out, i * .07, sq(f, t) * np.exp(-t * 8) * .15)
    return out
def sfx_stamp(): return sfx_impact(False) * .7 + np.pad(CLAP, (0, int(1.0 * SR) - len(CLAP))) * .5
def sfx_clock():
    t = tt(.08); return (np.sin(2 * np.pi * 1800 * t) + .6 * np.sin(2 * np.pi * 1200 * t)) * np.exp(-t * 80) * .45

# ---------------- music arrangement
B0 = 3.5; BEAT = 19.7 / 42; BAR = BEAT * 4
CH = [  # Am, F, C, G  (bass root, chord tones)
    (110.00, [220.00, 261.63, 329.63]),
    (87.31, [174.61, 220.00, 261.63]),
    (130.81, [196.00, 261.63, 329.63]),
    (98.00, [196.00, 246.94, 293.66]),
]
def section(t):
    if t < 3.5: return 'intro'
    if t < 17.5: return 'groove'
    if t < 20.6: return 'break'
    if t < 23.15: return 'build'
    if t < 43.0: return 'drop'
    if t < 56.4: return 'groove2'
    if t < 59.95: return 'sleep'
    if t < 67.2: return 'drop'
    return 'end'

drums = np.zeros(N); synth = np.zeros(N); sfx = np.zeros(N); send = np.zeros(N)
kicks = []
# intro drone + heartbeat
d = 3.5; t = tt(d); drone = (np.sin(2 * np.pi * 55 * t) * .5 + lp(saw(55, t) + saw(55.4, t), 300) * .3) * np.minimum(t / 1.0, 1)
add(synth, 0, drone * .6)
add(synth, 0, pad([220, 261.63, 329.63], 3.5, 600) * .35)

nsteps = int((DUR - B0) / (BEAT / 4)) + 1
for st in range(nsteps):
    tb = B0 + st * BEAT / 4
    if tb >= DUR: break
    sec = section(tb); s16 = st % 16; beat_in_bar = s16 // 4
    bar = int((tb - B0) // BAR); root, chord = CH[bar % 4]
    if sec in ('groove', 'groove2', 'drop'):
        if s16 % 4 == 0: add(drums, tb, KICK, 1.0); kicks.append(tb)
        if sec != 'groove' or tb > 7.5:
            if s16 in (4, 12): add(drums, tb, CLAP, .55); add(send, tb, CLAP, .25)
        if sec == 'drop':
            add(drums, tb, HAT, .55 if s16 % 2 else .3)
            if s16 % 4 == 2: add(drums, tb, OHAT, .35)
        elif s16 % 4 == 2: add(drums, tb, HAT, .55)
        # bass: off-beat 8ths in drop, 8ths in groove
        if sec == 'drop':
            if s16 % 4 == 2 or s16 % 4 == 3: add(synth, tb, bass_note(root, BEAT / 4 * .95), .55)
            if s16 % 4 == 0: add(synth, tb, bass_note(root / 2, BEAT / 4 * .9), .5)
        elif s16 % 2 == 0: add(synth, tb, bass_note(root, BEAT / 2 * .9), .5)
        # stabs in drop
        if sec == 'drop' and s16 in (0, 3, 6, 10, 12):
            st_ = supersaw([f * 2 for f in chord], BEAT * .6, 3200, 7)
            add(synth, tb, st_, .32); add(send, tb, st_, .25)
        # arp
        if sec in ('drop', 'groove2') and s16 % 2 == 1:
            notes = [chord[0] * 2, chord[1] * 2, chord[2] * 2, chord[1] * 4]
            add(synth, tb, pluck(notes[(st // 2) % 4]), .14 if sec == 'drop' else .18); add(send, tb, pluck(notes[(st // 2) % 4]), .12)
        if s16 == 0 and sec in ('groove', 'groove2'):
            p = pad(chord, BAR, 1100); add(synth, tb, p, .22); add(send, tb, p, .15)
    elif sec == 'break':
        if s16 == 0: p = pad(chord, BAR, 700); add(synth, tb, p, .35); add(send, tb, p, .3)
        if s16 % 8 == 0: add(drums, tb, HAT, .3)
    elif sec == 'build':
        k = (tb - 20.6) / (23.15 - 20.6)
        if s16 % 4 == 0: add(drums, tb, KICK, .8); kicks.append(tb)
        step = 4 if k < .4 else (2 if k < .75 else 1)
        if s16 % step == 0: add(drums, tb, SNARE, .25 + .5 * k)
        if s16 == 0: p = pad(chord, BAR, 600 + 2500 * k); add(synth, tb, p, .3)
    elif sec == 'sleep':
        if s16 == 0: p = pad(chord, BAR, 800); add(synth, tb, p, .35); add(send, tb, p, .4)
        if s16 % 4 == 0: n_ = chord[(st // 4) % 3] * 4; add(synth, tb, bell(n_, 1.0), .12); add(send, tb, bell(n_, 1.0), .2)

# final chord hit
fin = supersaw([110, 220, 261.63, 329.63, 440], 1.2, 2800, 2.0); add(synth, 67.2, fin, .45); add(send, 67.2, fin, .5)

# sidechain ducking on synths
duck = np.ones(N); L = int(.28 * SR); env = 1 - .55 * np.exp(-np.arange(L) / SR / .07)
for k in kicks:
    i = int(k * SR); seg = duck[i:i + L]; duck[i:i + L] = np.minimum(seg, env[:len(seg)])
synth *= duck

# ---------------- SFX from cues
for c in CUES:
    t0, ty = c[0], c[1]; dur = c[2] if len(c) > 2 else None
    if ty == 'impact': s, g = sfx_impact(False), .9
    elif ty == 'impact_big': s, g = sfx_impact(True), 1.0
    elif ty == 'whoosh': s, g = sfx_whoosh(), .55; t0 -= .15
    elif ty == 'pop': s, g = sfx_pop(), .5
    elif ty == 'cash': s, g = sfx_cash(), .7
    elif ty == 'buzz': s, g = sfx_buzz(), .55
    elif ty == 'ding': s, g = sfx_ding(), .7
    elif ty == 'glitch': s, g = sfx_glitch(dur or .3), .5
    elif ty == 'spray': s, g = sfx_spray(dur or 1), .8
    elif ty == 'riser': s, g = sfx_riser(dur or 1), .45; t0 -= 0
    elif ty == 'coin': s, g = sfx_coin(), .8
    elif ty == 'jump': s, g = sfx_jump(), .8
    elif ty == 'levelup': s, g = sfx_levelup(), .8
    elif ty == 'slam': s, g = sfx_stamp(), .8
    elif ty == 'stamp': s, g = sfx_stamp(), .8
    elif ty == 'clock': s, g = sfx_clock(), .8
    elif ty in ('ticks', 'cuts'):
        step = .06 if ty == 'ticks' else .15; k = 0
        while k * step < (dur or 1): add(sfx, t0 + k * step, sfx_tick() if ty == 'ticks' else sfx_pop() * .6, .7); k += 1
        continue
    else: continue
    add(sfx, t0, s, g)
    if ty in ('impact', 'impact_big', 'cash', 'ding', 'slam'): add(send, t0, s, g * .3)

# ---------------- reverb (FFT convolution with a decaying-noise IR)
irl = int(1.6 * SR); ir = rng.uniform(-1, 1, irl) * np.exp(-np.arange(irl) / SR * 3.2); ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
n2 = 1 << int(np.ceil(np.log2(N + irl)))
wet = np.fft.irfft(np.fft.rfft(send, n2) * np.fft.rfft(ir, n2), n2)[:N] * .35

mix = drums * .8 + synth * .75 + sfx * .9 + wet
mix = hp(mix, 25)
mix = np.tanh(mix * .85)
mix = mix[:int(DUR * SR)]
fade = int(.25 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= .94
st = np.stack([mix, mix], 1)
pcm = (st * 32767).astype(np.int16)
with wave.open(os.path.join(OUT, 'audio.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('audio ok', len(mix) / SR, 's')
