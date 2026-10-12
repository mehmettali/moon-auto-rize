#!/usr/bin/env python3
"""Pure-python synth: 110 BPM A-minor trap/lo-fi groove for a 9:16 reel. No external deps."""
import math, random, struct, sys
SR = 44100
BPM = 110
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 19.4
OUT = sys.argv[2] if len(sys.argv) > 2 else "track.wav"
N = int(DUR * SR)
L = [0.0] * N
R = [0.0] * N
random.seed(7)

def add(buf, start, samples, gain=1.0):
    s0 = int(start * SR)
    for i, v in enumerate(samples):
        j = s0 + i
        if j >= N: break
        if j >= 0: buf[j] += v * gain

def addst(start, samples, gain=1.0, pan=0.0):  # pan -1..1
    gl = gain * math.sqrt((1 - pan) / 2) * 1.4142
    gr = gain * math.sqrt((1 + pan) / 2) * 1.4142
    add(L, start, samples, gl); add(R, start, samples, gr)

def env_exp(n, k):
    return [math.exp(-k * i / SR) for i in range(n)]

def kick():
    n = int(0.55 * SR); out = []; ph = 0.0
    for i in range(n):
        t = i / SR
        f = 48 + 150 * math.exp(-t * 28)
        ph += 2 * math.pi * f / SR
        v = math.sin(ph) * math.exp(-t * 7.5)
        if i < 220: v += random.gauss(0, 0.5) * (1 - i / 220)
        out.append(math.tanh(v * 1.8) * 0.9)
    return out

def snare():
    n = int(0.32 * SR); out = []; lp = 0.0
    for i in range(n):
        t = i / SR
        x = random.gauss(0, 1)
        lp += 0.35 * (x - lp)
        v = lp * 0.9 * math.exp(-t * 16) + math.sin(2 * math.pi * 185 * t) * 0.6 * math.exp(-t * 30)
        out.append(math.tanh(v) * 0.7)
    return out

def hat(open_=False):
    n = int((0.35 if open_ else 0.07) * SR); out = []; prev = 0.0
    k = 10 if open_ else 70
    for i in range(n):
        x = random.gauss(0, 1)
        hp = x - prev; prev = x
        out.append(hp * 0.28 * math.exp(-k * i / SR))
    return out

def tone(freq, secs, harmonics, attack=0.01, decay_k=3.0, detune=0.0, sustain=1.0):
    n = int(secs * SR); out = []
    phs = [0.0] * len(harmonics)
    for i in range(n):
        t = i / SR
        v = 0.0
        for h, (mult, amp) in enumerate(harmonics):
            phs[h] += 2 * math.pi * freq * mult * (1 + detune * (h % 2 * 2 - 1)) / SR
            v += math.sin(phs[h]) * amp
        a = min(1.0, t / attack)
        e = a * (sustain + (1 - sustain) * math.exp(-decay_k * t))
        # release over last 40 ms
        rel = min(1.0, (n - i) / (0.04 * SR))
        out.append(v * e * rel)
    return out

def bass(freq, secs):
    s = tone(freq, secs, [(1, 1.0), (2, 0.35), (3, 0.12)], attack=0.004, decay_k=1.2, sustain=0.35)
    return [math.tanh(v * 2.2) * 0.55 for v in s]

def pad(freqs, secs):
    mix = [0.0] * int(secs * SR)
    for f in freqs:
        for det, pan_amp in ((-0.004, 1), (0.004, 1)):
            s = tone(f * (1 + det), secs, [(1, 0.5), (2, 0.25), (3, 0.12), (4, 0.07)], attack=0.03, decay_k=2.5, sustain=0.45)
            for i, v in enumerate(s): mix[i] += v
    return [v * 0.09 for v in mix]

def pluck(freq):
    s = tone(freq, 0.3, [(1, 1.0), (2, 0.3), (3, 0.15)], attack=0.002, decay_k=13, sustain=0.0)
    return [v * 0.32 for v in s]

def riser(secs):
    n = int(secs * SR); out = []; prev = 0.0
    for i in range(n):
        x = random.gauss(0, 1); hp = x - prev; prev = x
        out.append(hp * 0.25 * (i / n) ** 2.2)
    return out

KICK, SNARE, HAT, OHAT = kick(), snare(), hat(), hat(True)
NOTE = {"A1": 55.0, "F1": 43.65, "C2": 65.41, "G1": 49.0,
        "A3": 220.0, "C4": 261.63, "E4": 329.63, "F3": 174.61, "G3": 196.0, "B3": 246.94, "D4": 293.66,
        "A4": 440.0, "C5": 523.25, "E5": 659.26, "F4": 349.23, "G4": 392.0, "B4": 493.88, "D5": 587.33}
PROG = [  # (bass root, pad chord, arp notes)
    ("A1", ["A3", "C4", "E4"], ["A4", "C5", "E5", "C5"]),
    ("F1", ["F3", "A3", "C4"], ["F4", "A4", "C5", "A4"]),
    ("C2", ["G3", "C4", "E4"], ["C5", "E5", "G4", "E5"]),
    ("G1", ["G3", "B3", "D4"], ["G4", "B4", "D5", "B4"]),
]
pad_cache = {}; bass_cache = {}; pluck_cache = {}
bars = int(math.ceil(DUR / BAR))
kick_times = []
for b in range(bars):
    t0 = b * BAR
    root, chord, arp = PROG[b % 4]
    # drums
    for kb in (0, 1.5, 2, 3.5):          # trap-ish kick pattern
        kick_times.append(t0 + kb * BEAT)
    for sb in (1, 3):
        addst(t0 + sb * BEAT, SNARE, 0.9)
    for e in range(8):
        tt = t0 + e * BEAT / 2
        if e in (3, 7):
            addst(tt, OHAT, 0.7, pan=0.25)
        else:
            addst(tt, HAT, 0.8 if e % 2 == 0 else 0.5, pan=-0.2)
    if b % 4 == 3:  # hat roll at end of 4-bar phrase
        for r in range(4):
            addst(t0 + 3.5 * BEAT + r * BEAT / 8, HAT, 0.5 + 0.1 * r, pan=0.1 * r)
        addst(t0 + 3.0 * BEAT, riser(BEAT), 0.9)
    # bass
    key = root
    if key not in bass_cache:
        bass_cache[key] = (bass(NOTE[key], BEAT * 1.4), bass(NOTE[key], BEAT * 0.45))
    long_b, short_b = bass_cache[key]
    addst(t0, long_b, 1.0)
    addst(t0 + 1.5 * BEAT, short_b, 0.9)
    addst(t0 + 2 * BEAT, short_b, 0.8)
    addst(t0 + 3.5 * BEAT, short_b, 0.9)
    # pad (whole bar)
    ck = tuple(chord)
    if ck not in pad_cache: pad_cache[ck] = pad([NOTE[n] for n in chord], BAR)
    addst(t0, pad_cache[ck], 1.0)
    # arp 16ths with ping-pong echo
    for s in range(16):
        nm = arp[s % 4]
        if nm not in pluck_cache: pluck_cache[nm] = pluck(NOTE[nm])
        tt = t0 + s * BEAT / 4
        vel = 1.0 if s % 4 == 0 else 0.75
        addst(tt, pluck_cache[nm], vel, pan=-0.35)
        addst(tt + 3 * BEAT / 4, pluck_cache[nm], vel * 0.38, pan=0.5)
        addst(tt + 6 * BEAT / 4, pluck_cache[nm], vel * 0.16, pan=-0.5)

# sidechain duck of pad/arp/bass by kick, then add kicks on top
duck = [1.0] * N
for kt in kick_times:
    s0 = int(kt * SR)
    for i in range(int(0.28 * SR)):
        j = s0 + i
        if j >= N: break
        duck[j] = min(duck[j], 1 - 0.65 * math.exp(-i / SR * 14))
for i in range(N):
    L[i] *= duck[i]; R[i] *= duck[i]
for kt in kick_times:
    addst(kt, KICK, 1.0)

# master: fade in 30 ms, fade out last 1.3 s, soft clip, normalize
fo = int(1.3 * SR)
for i in range(N):
    g = min(1.0, i / (0.03 * SR)) * (min(1.0, (N - i) / fo))
    L[i] = math.tanh(L[i] * 1.25 * g); R[i] = math.tanh(R[i] * 1.25 * g)
peak = max(max(abs(v) for v in L), max(abs(v) for v in R)) or 1.0
k = 0.95 / peak
with open(OUT, "wb") as f:
    data = bytearray()
    for i in range(N):
        data += struct.pack("<hh", int(L[i] * k * 32767), int(R[i] * k * 32767))
    f.write(b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVE")
    f.write(b"fmt " + struct.pack("<IHHIIHH", 16, 1, 2, SR, SR * 4, 4, 16))
    f.write(b"data" + struct.pack("<I", len(data)) + data)
print("wrote", OUT, N / SR, "s")
