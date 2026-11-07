"""Original score + motion sound effects for the AiiDell ad (no voice).
Pure numpy synthesis -> audio/soundtrack.wav (48 kHz stereo, 50 s)."""
import numpy as np
import wave, os

SR = 48000
DUR = 50.0
N = int(SR * DUR)
BPM = 96.0
BEAT = 60.0 / BPM          # 0.625 s
BAR = BEAT * 4             # 2.5 s
rs = np.random.RandomState(7)

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    a = max(a, 1); r = max(r, 1)
    e = np.ones(n) * s
    e[:min(a, n)] = np.linspace(0, 1, a)[:min(a, n)]
    if a < n:
        dd = min(d, n - a)
        e[a:a + dd] = np.linspace(1, s, max(d, 1))[:dd]
    if r < n:
        e[-r:] *= np.linspace(1, 0, r)
    return e


def place(buf, sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
        st = np.stack([sig * l, sig * r], 1) * 1.4142
    else:
        st = sig
    j0 = max(0, -i); i0 = max(i, 0)
    n = min(len(st) - j0, N - i0)
    buf[i0:i0 + n] += st[j0:j0 + n] * gain


def fft_filter(x, lo, hi, sr=SR):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / sr)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))


# ---------------------------------------------------------------- instruments
def additive(f, dur, partials, decays, amps, attack=0.004, release=0.05, detune=0.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    y = np.zeros(n)
    for p, d, a in zip(partials, decays, amps):
        ff = f * p
        if ff > SR / 2.2: continue
        y += a * np.sin(2 * np.pi * ff * tt * (1 + detune) + rs.rand() * 6.28) * np.exp(-tt * d)
    e = np.ones(n)
    na = max(1, int(attack * SR)); e[:na] = np.linspace(0, 1, na)
    nr = max(1, int(release * SR)); e[-nr:] *= np.linspace(1, 0, nr)
    return y * e


def pluck(f, dur=0.6):
    k = np.arange(1, 10)
    return additive(f, dur, k, 3 + k * 2.5, 1 / k ** 1.3, 0.003, 0.05)


def marimba(f, dur=0.5):
    return additive(f, dur, [1, 3.93, 9.2], [7, 22, 40], [1, 0.35, 0.12], 0.002, 0.04)


def bell(f, dur=2.0):
    return additive(f, dur, [1, 2.0, 2.76, 4.07, 5.4], [1.6, 2.4, 3.2, 4.5, 6], [1, 0.4, 0.3, 0.15, 0.08], 0.002, 0.2)


def celesta(f, dur=1.4):
    return additive(f, dur, [1, 2, 3, 4], [2.5, 5, 9, 14], [1, 0.25, 0.08, 0.03], 0.002, 0.15)


def harp(f, dur=1.4):
    k = np.arange(1, 7)
    return additive(f, dur, k, 1.2 + k * 1.1, 1 / k ** 1.8, 0.004, 0.2)


def piano(f, dur=1.6):
    k = np.arange(1, 11)
    y = additive(f, dur, k, 0.9 + k * 0.7, 1 / k ** 1.25, 0.003, 0.25)
    y += additive(f, dur, k[:4], 1.2 + k[:4], 0.3 / k[:4] ** 1.4, 0.003, 0.25, detune=0.0015)
    n = int(0.02 * SR)
    y[:n] += fft_filter(rs.randn(n), 800, 5000) * np.linspace(0.12, 0, n)
    return y


def saw_stack(f, n, bright=1.4, detunes=(-0.006, 0.0, 0.0065)):
    tt = np.arange(n) / SR
    y = np.zeros(n)
    for dt in detunes:
        ph = rs.rand() * 6.28
        for k in range(1, 14):
            if f * k > 9000: break
            y += np.sin(2 * np.pi * f * (1 + dt) * k * tt + ph * k) / k ** bright
    return y / len(detunes)


def pad(freqs, dur, attack=0.8, release=1.0, bright=1.7, gain=1.0):
    n = int(dur * SR)
    y = np.zeros(n)
    for f in freqs:
        y += saw_stack(f, n, bright)
    tt = np.arange(n) / SR
    y *= 1 + 0.06 * np.sin(2 * np.pi * 0.25 * tt)
    return y * env_adsr(n, attack, 0.5, 0.85, release) * gain / max(1, len(freqs))


def strings(freqs, dur, attack=1.2, release=1.2, gain=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    y = np.zeros(n)
    for f in freqs:
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * tt + rs.rand() * 6)
        for dt in (-0.004, 0.0, 0.005):
            ph = np.cumsum(f * (1 + dt) * vib) / SR * 2 * np.pi
            for k in range(1, 10):
                y += np.sin(k * ph) / k ** 1.5
    return y * env_adsr(n, attack, 0.3, 1.0, release) * gain / (3 * max(1, len(freqs)))


def bass(f, dur, kind='pizz'):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt) + 0.12 * np.sin(6 * np.pi * f * tt)
    if kind == 'pizz':
        e = np.exp(-tt * 5.5)
    else:
        e = env_adsr(n, 0.01, 0.2, 0.7, 0.12)
    na = int(0.004 * SR); e[:na] *= np.linspace(0, 1, na)
    nr = int(0.03 * SR); e[-nr:] *= np.linspace(1, 0, nr)
    return y * e


def kick(gain=1.0):
    n = int(0.45 * SR)
    tt = np.arange(n) / SR
    f = 48 + 110 * np.exp(-tt * 28)
    ph = np.cumsum(f) / SR * 2 * np.pi
    y = np.sin(ph) * np.exp(-tt * 7)
    y[:200] += rs.randn(200) * 0.15 * np.linspace(1, 0, 200)
    return y * gain


def snap(gain=1.0):
    n = int(0.18 * SR)
    tt = np.arange(n) / SR
    y = fft_filter(rs.randn(n), 1200, 6000) * np.exp(-tt * 35)
    return y * gain * 0.8


def clap(gain=1.0):
    n = int(0.3 * SR)
    tt = np.arange(n) / SR
    nz = fft_filter(rs.randn(n), 900, 5000)
    e = np.zeros(n)
    for off in (0, 0.011, 0.022):
        k = int(off * SR)
        e[k:] += np.exp(-(tt[:n - k]) * 60)
    e += 0.4 * np.exp(-tt * 12)
    return nz * e * gain * 0.5


def hat(gain=1.0, open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    tt = np.arange(n) / SR
    return fft_filter(rs.randn(n), 7000, 16000) * np.exp(-tt * (12 if open_ else 70)) * gain * 0.5


def shaker(gain=1.0):
    n = int(0.09 * SR)
    tt = np.arange(n) / SR
    e = np.minimum(tt / 0.02, 1) * np.exp(-tt * 40)
    return fft_filter(rs.randn(n), 5000, 14000) * e * gain * 0.45


def sweep_noise(dur, f0, f1, q=0.6, gain=1.0, shape='rise'):
    n = int(dur * SR)
    out = np.zeros(n)
    hop = 1024
    win = np.hanning(hop * 2)
    nz = rs.randn(n + hop * 2)
    for s in range(0, n, hop):
        p = s / n
        fc = f0 * (f1 / f0) ** p
        seg_ = nz[s:s + hop * 2] * win
        X = np.fft.rfft(seg_)
        fr = np.fft.rfftfreq(hop * 2, 1 / SR)
        bw = fc * q
        m = np.exp(-((fr - fc) / bw) ** 2)
        y = np.fft.irfft(X * m, hop * 2)
        e = min(s + hop * 2, n) - s
        out[s:s + e] += y[:e]
    tt = np.linspace(0, 1, n)
    if shape == 'rise': env = tt ** 2
    elif shape == 'whoosh': env = np.sin(np.pi * tt) ** 1.5
    else: env = (1 - tt) ** 2
    out *= env
    return out / (np.max(np.abs(out)) + 1e-9) * gain


def riser(dur, gain=1.0):
    y = sweep_noise(dur, 300, 6000, 0.5, 1.0, 'rise')
    n = len(y)
    tt = np.arange(n) / SR
    f = 200 * (8 ** (tt / dur))
    ph = np.cumsum(f) / SR * 2 * np.pi
    y += 0.25 * np.sin(ph) * (tt / dur) ** 2
    return y * gain


def whoosh(dur=0.6, f0=500, f1=3000, gain=1.0):
    return sweep_noise(dur, f0, f1, 0.7, gain, 'whoosh')


def pop(f0=900, f1=300, dur=0.09, gain=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 40)
    y = np.sin(np.cumsum(f) / SR * 2 * np.pi) * np.exp(-tt * 30)
    y[:30] *= np.linspace(0, 1, 30)
    return y * gain


def click(gain=1.0):
    n = int(0.03 * SR)
    tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * 2800 * tt) * np.exp(-tt * 300) + fft_filter(rs.randn(n), 2000, 9000) * np.exp(-tt * 400) * 0.5
    return y * gain


def tick(gain=1.0):
    n = int(0.02 * SR)
    tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 4200 * tt) * np.exp(-tt * 500)) * gain


def chime_arp(t0, notes, step=0.07, gain=1.0, pan=0.0, inst=bell, dur=1.6):
    for i, m in enumerate(notes):
        place(sfx, inst(mtof(m), dur), t0 + i * step, pan + (i % 2 - 0.5) * 0.3, gain)


def sparkle_cloud(t0, dur, density=18, gain=0.25, lo=88, hi=100):
    k = int(dur * density)
    for i in range(k):
        m = [86, 88, 90, 93, 95, 98, 100][rs.randint(7)]
        m = min(hi, max(lo, m))
        place(sfx, celesta(mtof(m), 0.6), t0 + rs.rand() * dur, rs.rand() * 1.6 - 0.8, gain * (0.5 + rs.rand() * 0.5))


def boom(gain=1.0):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    f = 38 + 60 * np.exp(-tt * 6)
    y = np.sin(np.cumsum(f) / SR * 2 * np.pi) * np.exp(-tt * 2.2)
    y += fft_filter(rs.randn(n), 3000, 14000) * np.exp(-tt * 3) * 0.25
    return y * gain


def stamp(gain=1.0):
    n = int(0.25 * SR)
    tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * (70 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
    y += fft_filter(rs.randn(n), 200, 2500) * np.exp(-tt * 40) * 0.7
    return y * gain


def paper(dur=0.35, gain=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    crack = (rs.rand(n) < 0.02) * rs.randn(n)
    y = fft_filter(rs.randn(n) * 0.3 + crack * 3, 1500, 9000)
    return y * np.sin(np.pi * tt / dur) * gain * 0.4


def buzz(dur=0.5, gain=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    y = np.sign(np.sin(2 * np.pi * 150 * tt)) * 0.5 + np.sin(2 * np.pi * 300 * tt) * 0.3
    gate = (np.sin(2 * np.pi * 8 * tt) > -0.2).astype(float)
    y = fft_filter(y * gate, 100, 1200)
    return y * env_adsr(n, 0.01, 0.1, 1, 0.05) * gain


def wah(t0, gain=1.0):
    # gentle comedic "wah-wah" (muted brass-ish), descending
    for i, (m, d) in enumerate([(62, 0.38), (61, 0.38), (60, 0.38), (59, 0.9)]):
        n = int(d * SR)
        tt = np.arange(n) / SR
        f = mtof(m) * (1 + 0.012 * np.sin(2 * np.pi * 6 * tt) * (tt / d))
        ph = np.cumsum(f) / SR * 2 * np.pi
        y = sum(np.sin(k * ph) / k ** (1.0 + 1.2 * (0.5 + 0.5 * np.cos(2 * np.pi * 2.5 * tt))) for k in range(1, 12))
        y *= env_adsr(n, 0.03, 0.1, 0.9, 0.12)
        place(sfx, y, t0 + i * 0.4, -0.5, gain * 0.25)


# ---------------------------------------------------------------- harmony
CH = {  # pad voicing, bass midi
    'D': ([62, 66, 69, 73], 38), 'Bm': ([59, 62, 66, 69], 47 - 12), 'G': ([59, 62, 66, 67], 43 - 12 + 12), 'A': ([57, 61, 64, 69], 45 - 12 + 12),
}
CH['G'] = ([55, 59, 62, 66], 31 + 12)
CH['A'] = ([57, 61, 64, 68 + 1], 33 + 12)
CYCLE = ['D', 'Bm', 'G', 'A']


def chord_at(bar):
    if bar == 18: return 'G'
    if bar == 19: return 'D'
    return CYCLE[bar % 4]


def bt(bar, beat):
    return bar * BAR + beat * BEAT


# ---- PAD bed across everything
for b in range(20):
    name = chord_at(b)
    notes = CH[name][0]
    g = 0.16
    if b < 2: g = 0.13
    if 7 <= b <= 10: g = 0.2
    if b >= 16: g = 0.22
    if b == 18:
        place(music, pad([mtof(m) for m in CH['G'][0]], BAR * 0.5 + 1.0, 0.3, 0.8), bt(b, 0), 0, g)
        place(music, pad([mtof(m) for m in CH['A'][0]], BAR * 0.5 + 1.0, 0.3, 0.8), bt(b, 2), 0, g)
        continue
    dur = BAR + 1.2 if b < 19 else 6.0
    place(music, pad([mtof(m) for m in notes], dur, 0.6, 1.2 if b < 19 else 3.5), bt(b, 0), 0, g)

# ---- INTRO (bars 0-1): music box arpeggio
intro = [[62, 66, 69, 73, 76, 73, 69, 66], [61, 64, 69, 73, 76, 73, 69, 64]]
for b in range(2):
    for i, m in enumerate(intro[b]):
        place(music, celesta(mtof(m + 12), 1.2), bt(b, i * 0.5), (i % 2 - 0.5) * 0.6, 0.16)

# ---- PLAYFUL (bars 2-6): marimba + pizz bass + light drums
mel_pat = [0, 2, 3, 5, 6]
for b in range(2, 7):
    name = chord_at(b)
    notes = CH[name][0]
    top = [n + 12 for n in notes]
    seq = [top[2], top[1], top[2], top[3], top[1]] if b % 2 == 0 else [top[3], top[2], top[1], top[2], top[0]]
    for k, step in enumerate(mel_pat):
        place(music, marimba(mtof(seq[k]), 0.5), bt(b, step * 0.5), 0.25, 0.22)
    # bass pizz: root on 1, fifth on 2.5, root on 3
    r = CH[name][1]
    for beat, m in [(0, r), (1.5, r + 7), (2, r), (3.5, r + 12)]:
        place(music, bass(mtof(m), 0.5, 'pizz'), bt(b, beat), 0, 0.42)
    for beat in range(4):
        if beat % 2 == 0: place(music, kick(), bt(b, beat), 0, 0.42)
        else: place(music, snap(), bt(b, beat), 0.15, 0.38)
    for e8 in range(8):
        place(music, shaker(), bt(b, e8 * 0.5), -0.3, 0.22 if e8 % 2 else 0.12)
    # pluck chord stabs on off-beats
    for beat in (0.5, 2.5):
        for m in notes:
            place(music, pluck(mtof(m), 0.4), bt(b, beat), 0.4, 0.05)

# ---- MAGIC (bars 7-10): harp arpeggios, bells, warm bass
for b in range(7, 11):
    name = chord_at(b)
    notes = CH[name][0]
    arp = notes + [n + 12 for n in notes]
    for i in range(16):
        idx = i if i < 8 else 15 - i
        if b == 7 and i < 4: continue
        place(music, harp(mtof(arp[idx % 8] + 12), 1.2), bt(b, i * 0.25), (idx / 8 - 0.5) * 0.9, 0.11)
    place(music, bass(mtof(CH[name][1]), BAR, 'sus'), bt(b, 0), 0, 0.34)
    place(music, strings([mtof(m) for m in notes], BAR + 0.8, 0.9, 0.9), bt(b, 0), 0, 0.18)
    if b >= 8:
        place(music, kick(0.8), bt(b, 0), 0, 0.35)
        place(music, kick(0.6), bt(b, 2), 0, 0.3)
        for s16 in range(16):
            place(music, shaker(0.6), bt(b, s16 * 0.25), 0.3, 0.1 if s16 % 2 else 0.05)
    # bell counter melody
    bm = {7: [(0, 76), (1.5, 78), (2, 81)], 8: [(0, 78), (2, 81), (3, 83)], 9: [(0, 81), (1, 78), (2, 74)], 10: [(0, 79), (1.5, 78), (2, 76), (3, 74)]}[b]
    for beat, m in bm:
        place(music, bell(mtof(m), 2.0), bt(b, beat), -0.2, 0.09)

# ---- ELEGANT GROOVE (bars 11-15) + EMOTIONAL (16-17) + FINALE
melody = {
    11: [(0, 76, 1.5), (1.5, 73, .5), (2, 69, 1), (3, 73, 1)],
    12: [(0, 78, 1.5), (1.5, 76, .5), (2, 74, 1), (3, 76, 1)],
    13: [(0, 74, 1.5), (1.5, 73, .5), (2, 71, 1), (3, 74, 1)],
    14: [(0, 79, 1.5), (1.5, 78, .5), (2, 74, 1), (3, 71, 1)],
    15: [(0, 76, 1.5), (1.5, 78, .5), (2, 81, 1.5), (3.5, 79, .5)],
    16: [(0, 78, 2), (2, 81, 1), (3, 86, 1)],
    17: [(0, 83, 2), (2, 78, 2)],
    18: [(0, 79, 1), (1, 78, 1), (2, 76, 1), (3, 73, 1)],
}
for b in range(11, 18):
    name = chord_at(b)
    notes = CH[name][0]
    start_beat = 1.0 if b == 11 else 0   # bar 11 starts after the iris transition
    # piano chords
    for beat in ([0, 1.5, 2.5] if b < 16 else [0, 2]):
        if beat < start_beat: continue
        for m in notes:
            place(music, piano(mtof(m), 1.4), bt(b, beat), 0.1, 0.075)
    # melody (bell + piano octave)
    for beat, m, d in melody[b]:
        if beat < start_beat: continue
        place(music, bell(mtof(m), 2.2), bt(b, beat), -0.15, 0.1)
        place(music, piano(mtof(m), d * BEAT + 0.6), bt(b, beat), -0.1, 0.11)
    r = CH[name][1]
    if b < 16:
        for e8 in range(8):
            if e8 * 0.5 < start_beat: continue
            m = r + (12 if e8 % 2 else 0)
            place(music, bass(mtof(m), 0.32, 'pizz'), bt(b, e8 * 0.5), 0, 0.36)
            if e8 % 2 == 0: place(music, kick(0.85), bt(b, e8 * 0.5), 0, 0.36)
            else: place(music, hat(0.8), bt(b, e8 * 0.5), 0.35, 0.22)
        for beat in (1, 3):
            place(music, clap(), bt(b, beat), 0, 0.32)
    else:
        place(music, bass(mtof(r), BAR, 'sus'), bt(b, 0), 0, 0.34)
        place(music, kick(0.7), bt(b, 0), 0, 0.3)
        place(music, clap(0.8), bt(b, 2), 0, 0.22)
        place(music, strings([mtof(m) for m in notes] + [mtof(notes[0] + 12)], BAR + 1.0, 0.6, 1.0), bt(b, 0), 0, 0.22)

# bar 18: build into end card (G -> A) with snare roll
for beat, m, d in melody[18]:
    place(music, bell(mtof(m), 2.0), bt(18, beat), -0.15, 0.1)
    place(music, piano(mtof(m), d * BEAT + 0.5), bt(18, beat), -0.1, 0.1)
place(music, strings([mtof(m) for m in CH['G'][0]], BAR / 2 + 0.6, 0.3, 0.6), bt(18, 0), 0, 0.22)
place(music, strings([mtof(m) for m in CH['A'][0]], BAR / 2 + 0.6, 0.3, 0.6), bt(18, 2), 0, 0.24)
for i in range(16):
    place(music, snap(0.4 + i / 20), bt(17, 2) + i * (BEAT * 6 / 16) * 0.5 + 1.0, 0, 0.12 + i * 0.012)

# bar 19+: finale chord at 45.0 and logo sting at ~46.8
place(music, boom(), 45.0, 0, 0.55)
place(music, kick(1.0), 45.0, 0, 0.45)
place(music, hat(1, True), 45.0, 0.2, 0.3)
fin = [50, 57, 62, 66, 69, 74, 78]
for m in fin:
    place(music, piano(mtof(m), 5.0), 45.0, 0, 0.07)
place(music, strings([mtof(m) for m in [62, 66, 69, 74]], 5.0, 0.4, 2.5), 45.0, 0, 0.24)
for i, m in enumerate([74, 78, 81, 86, 90, 93]):
    place(music, celesta(mtof(m), 2.4), 45.3 + i * 0.12, (i - 2.5) * 0.25, 0.12)

# ---------------------------------------------------------------- SFX (synced to picture: soft-sell story)
def ph(u):  # AiiDell phone-flow time -> video time
    return 13.5 + (u - 0.3) / 1.75

# captions: a soft, warm "pop" + tiny chime as each narration line appears
for i, ca in enumerate([0.6, 3.2, 6.1, 8.4, 10.7, 13.1, 15.1, 20.3, 24.6, 38.2, 40.9]):
    place(sfx, pop(700, 1100, 0.07), ca, 0, 0.12)
    place(sfx, celesta(mtof(86 + (i % 3) * 2), 0.8), ca + 0.02, 0, 0.06)

# S1 – meet Rahul and Arjun
place(sfx, whoosh(0.9, 300, 2500), 0.0, -0.6, 0.35)
place(sfx, whoosh(0.9, 300, 2500), 0.05, 0.6, 0.35)
sparkle_cloud(0.3, 0.9, 12, 0.16)
place(sfx, pop(600, 1200, 0.1), 1.0, 0, 0.22)                     # heart medallion
place(sfx, pop(800, 400, 0.08), 1.1, -0.5, 0.2); place(sfx, pop(850, 420, 0.08), 1.15, 0.5, 0.2)  # name tags
place(sfx, pop(700, 260), 1.35, -0.5, 0.3); place(sfx, pop(760, 280), 1.4, 0.5, 0.3)              # thought bubbles
chime_arp(1.5, [81, 86], 0.08, 0.08, 0)

# S2 – "But look at Rahul…" (left)
place(sfx, whoosh(0.6, 900, 300), 6.05, -0.5, 0.25)
place(sfx, pop(500, 250, 0.1), 6.35, -0.5, 0.2)
for k in range(28):
    place(sfx, tick(0.4), 6.35 + k * 0.03, -0.5, 0.1)
place(sfx, whoosh(0.4, 1200, 4000), 8.5, -0.5, 0.15)
for i, a_ in enumerate([8.64, 9.14, 9.57, 10.0, 10.36]):
    place(sfx, pop(800 if i != 2 else 500, 400, 0.08), a_, -0.5, 0.18)
place(sfx, buzz(0.4), 9.14, -0.5, 0.1); place(sfx, buzz(0.4), 10.0, -0.5, 0.1)
for a_ in (9.4, 9.9, 10.4):
    place(sfx, pop(420, 220, 0.09), a_, -0.4, 0.12)
place(sfx, whoosh(0.4, 1200, 4000), 10.7, -0.5, 0.15)
for i in range(5):
    place(sfx, tick(0.8), 10.87 + i * 0.245, -0.5, 0.18)
place(sfx, pop(300, 120, 0.15), 12.27, -0.5, 0.25)
place(sfx, stamp(), 12.7, -0.5, 0.45)
for i in range(6):
    place(sfx, paper(0.4), 12.0 + i * 0.4, -0.4, 0.28)
    place(sfx, whoosh(0.4, 1500, 600), 12.0 + i * 0.4, -0.3, 0.06)
wah(12.85, 0.9)
tt_ = 6.0
while tt_ < 13.0:
    place(sfx, tick(0.5), tt_, -0.7, 0.07)
    tt_ += max(0.12, 0.6 - (tt_ - 6) * 0.06)
for k in range(9):
    place(sfx, pop(1000, 600, 0.05), 6.8 + k * 0.8 + 0.3, -0.6, 0.05)

# S3 – "And Arjun?" (right) – a few clicks on AiiDell.com
place(sfx, whoosh(0.6, 300, 900), 13.05, 0.5, 0.25)
place(sfx, whoosh(0.5, 900, 5000), 13.4, 0.5, 0.3)
chime_arp(13.45, [86, 90], 0.08, 0.1, 0.5)
for k in range(15):
    place(sfx, tick(0.6), ph(0.27) + k * 0.038, 0.5, 0.2)
place(sfx, click(), ph(1.3), 0.5, 0.35)
for k in range(4):
    place(sfx, pop(1400, 900, 0.05), ph(1.9) + k * 0.06, 0.5, 0.08)
place(sfx, click(), ph(3.25), 0.5, 0.35)
place(sfx, whoosh(0.3, 1200, 5000), ph(3.6), 0.5, 0.15)
place(sfx, click(), ph(4.7), 0.5, 0.35)
place(sfx, whoosh(0.4, 800, 4000), ph(4.85), 0.5, 0.18)
chime_arp(ph(5.3), [93, 97], 0.05, 0.16, 0.6)
place(sfx, pop(900, 1500, 0.08), ph(5.3), 0.6, 0.25)
place(sfx, whoosh(0.3, 1200, 5000), ph(5.8), 0.5, 0.15)
for (a_, n) in [(6.1, 5), (6.6, 18), (7.3, 5), (7.6, 22)]:
    for k in range(n):
        place(sfx, tick(0.5), ph(a_) + k * (0.29 / n), 0.5, 0.16)
place(sfx, click(), ph(8.1), 0.5, 0.35)
place(sfx, whoosh(0.3, 1200, 5000), ph(8.5), 0.5, 0.15)
place(sfx, click(), ph(9.1), 0.5, 0.35)
chime_arp(ph(10.2), [81, 85, 88, 93], 0.07, 0.2, 0.5)
place(sfx, pop(600, 1400, 0.12), ph(10.2), 0.5, 0.25)
for k in range(10):
    place(sfx, pop(1500 + rs.rand() * 1500, 2500, 0.05), ph(10.3) + rs.rand() * 0.6, 0.3 + rs.rand() * 0.6, 0.08)
sparkle_cloud(ph(10.3), 0.9, 14, 0.14)
place(sfx, whoosh(0.4, 500, 2500), 19.35, 0.5, 0.18)

# S4 – delivered right to her door (full screen)
place(sfx, whoosh(0.8, 300, 4000), 19.95, 0.3, 0.35)
sparkle_cloud(20.0, 0.8, 22, 0.18)
place(sfx, pop(600, 1200, 0.1), 20.4, 0, 0.25)
for i, a_ in enumerate([20.9, 21.45, 22.0]):
    chime_arp(a_, [86 + i * 2, 93 + i * 2], 0.05, 0.12, 0.2)
place(sfx, pop(380, 200, 0.12), 20.8, -0.6, 0.14)
place(sfx, whoosh(0.5, 800, 5000), 22.4, 0, 0.25)
sparkle_cloud(22.8, 2.2, 10, 0.12)
place(sfx, whoosh(2.2, 300, 1800), 22.8, 0.3, 0.12)
chime_arp(25.0, [81, 86, 90, 93], 0.06, 0.18, 0.4)
place(sfx, whoosh(0.5, 800, 5000), 25.1, 0, 0.22)
place(sfx, pop(700, 1200, 0.1), 25.6, 0.6, 0.18)
sparkle_cloud(25.5, 0.9, 16, 0.14)
place(sfx, pop(400, 200, 0.12), 26.4, 0, 0.2)
place(sfx, pop(500, 1600, 0.14), 26.8, 0, 0.3)
chime_arp(26.85, [74, 78, 81, 86, 90], 0.06, 0.2, 0, celesta, 1.5)
for i in range(4):
    place(sfx, pop(900 + i * 150, 1400, 0.08), 27.1 + i * 0.15, -0.3 + i * 0.2, 0.18)
place(sfx, riser(0.9, 1.0), 26.9, 0, 0.14)
place(sfx, whoosh(0.9, 250, 5000), 27.75, 0, 0.42)
sparkle_cloud(27.8, 0.9, 26, 0.2)

# S5 – what you can send
for k in range(4):
    place(sfx, whoosh(0.5, 600, 2800), 28.4 + k * 1.5 + 1.11 - 0.05, (k % 2 - 0.5), 0.18)
for k in range(5):
    chime_arp(28.4 + k * 1.5 + (0.05 if k == 0 else 0), [81 + (k % 3) * 2, 88 + (k % 3) * 2], 0.05, 0.1, 0)
place(sfx, whoosh(0.7, 400, 3000), 35.85, 0, 0.25)
place(sfx, pop(700, 1100, 0.08), 36.3, -0.2, 0.18)
place(sfx, pop(700, 1100, 0.08), 36.7, 0.2, 0.18)

# S6 – one still searching, the other already smiling
place(sfx, whoosh(0.7, 300, 2600), 37.35, -0.6, 0.3)
place(sfx, whoosh(0.7, 300, 2600), 37.4, 0.6, 0.3)
chime_arp(38.2, [86, 90, 86, 90], 0.12, 0.1, 0.5)
place(sfx, pop(420, 220, 0.09), 39.0, -0.5, 0.12)
place(sfx, pop(420, 220, 0.09), 39.5, -0.5, 0.12)
place(sfx, whoosh(0.6, 900, 300), 40.85, 0.4, 0.15)
for k in range(8):
    place(sfx, pop(1200, 1700, 0.05), 38.8 + k * 0.5, 0.5, 0.05)
place(sfx, whoosh(1.4, 250, 3000), 43.4, 0.4, 0.3)
place(sfx, riser(1.3, 1.0), 43.4, 0, 0.18)
sparkle_cloud(44.6, 1.0, 30, 0.2)

# end card – soft close
place(sfx, whoosh(1.1, 300, 1600), 45.25, 0, 0.15)
chime_arp(46.3, [86, 90, 93], 0.06, 0.16, 0.6)
place(sfx, whoosh(0.5, 700, 5000), 46.65, 0, 0.3)
chime_arp(46.8, [74, 81, 86, 90, 93, 98], 0.05, 0.22, 0, bell, 2.5)
place(sfx, boom(0.6), 46.8, 0, 0.22)
chime_arp(47.75, [81, 86, 90], 0.08, 0.12, 0, celesta, 1.6)
sparkle_cloud(48.5, 0.8, 14, 0.12)


# ---------------------------------------------------------------- mix & master
def reverb(x, secs=2.2, wet=0.25, seed=3):
    r = np.random.RandomState(seed)
    n = int(secs * SR)
    tt = np.arange(n) / SR
    irL = r.randn(n) * np.exp(-tt * 6.9 / secs)
    irR = r.randn(n) * np.exp(-tt * 6.9 / secs)
    irL[:int(0.012 * SR)] = 0; irR[:int(0.017 * SR)] = 0
    irL = fft_filter(irL, 150, 7000); irR = fft_filter(irR, 150, 7000)
    irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
    L = len(x) + n
    nf = 1 << (L - 1).bit_length()
    out = np.zeros((len(x), 2))
    for ch, ir in enumerate((irL, irR)):
        y = np.fft.irfft(np.fft.rfft(x[:, ch], nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
        out[:, ch] = y
    return x * (1 - wet * 0.4) + out * wet


music_r = reverb(music, 2.4, 0.32)
sfx_r = reverb(sfx, 1.3, 0.16, 5)

# gentle ducking of music under key sfx moments
mix = music_r * 0.95 + sfx_r * 1.0
for ch in range(2):
    mix[:, ch] = fft_filter(mix[:, ch], 32, None)
tt = np.arange(N) / SR
fade = np.clip((50.0 - tt) / 1.4, 0, 1) ** 1.5
fade_in = np.clip(tt / 0.08, 0, 1)
mix *= (fade * fade_in)[:, None]
# simple bus compression + soft clip limiter
rms = np.sqrt(np.convolve(np.mean(mix ** 2, 1), np.ones(2400) / 2400, mode='same')) + 1e-6
target = 0.18
gain = np.minimum(1.0, (target / rms) ** 0.35)
mix *= gain[:, None]
peak = np.max(np.abs(mix))
mix = mix / peak * 1.25
mix = np.tanh(mix) / np.tanh(1.25) * 0.66  # ~ -14 LUFS, peaks well below 0 dBFS

out = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'soundtrack.wav')
with wave.open(path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(out.tobytes())
print('wrote', path, out.shape)
