"""
Sound design for the GIDZET reel, synthesised from scratch with numpy (no samples, so
it's fully original and royalty-free). Every hit is timed to the GSAP timeline in
reel.html.

    python3 motion/sfx.py public/motion/gidzet-reel-sfx.wav

Layers: an evolving ambient pad (A maj9 → F#m9 → A maj9), whooshes, risers, letter
thuds, keyboard clicks, bubble pops, a sub-bass impact on the logo, shimmer and a UI
chime, all sent through a synthetic stereo reverb and a soft-clipping master.
"""

import sys
import wave

import numpy as np

SR = 48_000
DUR = 18.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

dry = np.zeros((N, 2))  # direct signal
send = np.zeros((N, 2))  # reverb send


# ─── helpers ──────────────────────────────────────────────────────────────
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def place(sig, at, gain=1.0, pan=0.0, verb=0.25):
    """Mix a mono (or stereo) signal in at `at` seconds with equal-power pan."""
    sig = np.asarray(sig)
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1)
    i = int(at * SR)
    if i >= N:
        return
    seg = sig[: N - i] * gain
    dry[i : i + len(seg)] += seg
    send[i : i + len(seg)] += seg * verb


def env_ad(n, attack, decay_curve=5.0):
    """Attack/decay envelope; attack is a 0–1 fraction of the length."""
    x = np.linspace(0, 1, n)
    a = max(attack, 1e-4)
    return np.where(x < a, (x / a) ** 2, np.exp(-decay_curve * (x - a) / (1 - a + 1e-9)))


def biquad_bp(x, f, q):
    """Band-pass with a per-sample centre frequency (array), RBJ cookbook."""
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for n in range(len(x)):
        w = 2 * np.pi * f[n] / SR
        alpha = np.sin(w) / (2 * q)
        cw = np.cos(w)
        a0 = 1 + alpha
        b0, b2 = alpha / a0, -alpha / a0
        a1, a2 = -2 * cw / a0, (1 - alpha) / a0
        yn = b0 * x[n] + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, x[n], y1, yn
        y[n] = yn
    return y


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def highpass(x, fc):
    return x - onepole_lp(x, fc)


def note(name):
    names = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[pitch] + 12 * (octave - 4)) / 12)


# ─── sound sources ─────────────────────────────────────────────────────────
def whoosh(at, dur, f0, f1, gain=0.5, pan0=-0.6, pan1=0.6, peak=0.65, q=1.4):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    f = f0 * (f1 / f0) ** np.linspace(0, 1, n)
    sig = biquad_bp(noise, f, q)
    x = np.linspace(0, 1, n)
    env = np.where(x < peak, (x / peak) ** 2.2, ((1 - x) / (1 - peak)) ** 1.6)
    sig *= env
    pans = np.linspace(pan0, pan1, n)
    a = (pans + 1) * np.pi / 4
    place(np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1), at, gain * 2.6, verb=0.35)


def riser(at, dur, f0=180, f1=1400, gain=0.25):
    t = t_axis(dur)
    f = f0 * (f1 / f0) ** (t / dur) ** 1.6
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(ph * k + d) / k for k, d in [(1, 0), (2, 0.3), (3, 1.1)])
    detune = np.sin(ph * 1.007)
    noise = highpass(rng.standard_normal(len(t)), 2500) * 0.35
    env = (t / dur) ** 2.4
    place((tone * 0.5 + detune * 0.3 + noise) * env, at, gain, pan=0, verb=0.5)


def impact(at, gain=1.0):
    t = t_axis(2.4)
    f = 32 + 48 * np.exp(-t * 9)  # sub pitch drop
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    thump = np.sin(2 * np.pi * 115 * t) * np.exp(-t * 22)
    crack = highpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 38) * 0.6
    body = onepole_lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 6) * 0.9
    sig = np.tanh((sub * 1.2 + thump * 0.8 + crack + body) * 1.6)
    place(sig, at, gain * 0.8, verb=0.15)
    # wide tail only into the reverb
    tail = highpass(rng.standard_normal(len(t)), 400) * np.exp(-t * 3) * 0.25
    send[int(at * SR) : int(at * SR) + len(t)] += np.stack([tail, np.roll(tail, 331)], axis=1)[: N - int(at * SR)] * gain


def thud(at, f=95, gain=0.5, pan=0.0):
    t = t_axis(0.35)
    sig = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 40))) / SR) * np.exp(-t * 14)
    click = highpass(rng.standard_normal(len(t)), 3000) * np.exp(-t * 180) * 0.4
    place(np.tanh((sig + click) * 1.3), at, gain, pan, verb=0.2)


def pop(at, f=660, gain=0.35, pan=0.0):
    t = t_axis(0.25)
    fr = f * (1 + 1.2 * np.exp(-t * 60))  # quick upward-settling blip
    sig = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 18)
    sig += 0.3 * np.sin(2 * np.pi * np.cumsum(fr * 2) / SR) * np.exp(-t * 30)
    place(sig, at, gain, pan, verb=0.35)


def boing(at, f=330, gain=0.18, pan=0.0):
    t = t_axis(0.6)
    fr = f * (1 + 0.08 * np.sin(2 * np.pi * 11 * t) * np.exp(-t * 5))
    sig = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 7)
    place(sig, at, gain, pan, verb=0.3)


def key_click(at, gain=0.34, pan=0.0):
    t = t_axis(0.05)
    c = rng.uniform(0.85, 1.2)
    sig = biquad_bp(rng.standard_normal(len(t)), np.full(len(t), 4200 * c), 2.2) * np.exp(-t * 260)
    sig += np.sin(2 * np.pi * 1700 * c * t) * np.exp(-t * 500) * 0.4
    place(sig, at, gain * rng.uniform(0.8, 1.1), pan, verb=0.12)


def tick(at, f=2400, gain=0.12, pan=0.0):
    t = t_axis(0.08)
    place(np.sin(2 * np.pi * f * t) * np.exp(-t * 90), at, gain, pan, verb=0.3)


def shimmer(at, dur, gain=0.16, pan0=-0.7, pan1=0.7, density=26):
    freqs = [note(n) for n in ["A5", "C#6", "E6", "G#6", "B6", "C#7", "E7", "A7"]]
    for k in range(density):
        start = at + dur * (k / density) ** 1.2 + rng.uniform(0, 0.03)
        f = freqs[rng.integers(len(freqs))]
        t = t_axis(1.2)
        sig = np.sin(2 * np.pi * f * t) * np.exp(-t * rng.uniform(4, 7)) * env_ad(len(t), 0.004, 1)
        sig += 0.25 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 9)
        place(sig, start, gain * rng.uniform(0.5, 1), pan0 + (pan1 - pan0) * k / density, verb=0.7)


def bell(at, f, gain=0.25, pan=0.0, length=2.0):
    """FM bell: carrier f, modulator 3.5f, decaying index."""
    t = t_axis(length)
    idx = 2.2 * np.exp(-t * 3)
    sig = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t * 2.4)
    sig *= env_ad(len(t), 0.002, 1)
    place(sig, at, gain, pan, verb=0.6)


def data_tone(at, dur, f0=320, f1=1250, gain=0.08):
    """Soft glide that follows the drawn easing curve (power2.inOut)."""
    t = t_axis(dur)
    x = t / dur
    e = np.where(x < 0.5, 2 * x * x, 1 - (-2 * x + 2) ** 2 / 2)
    f = f0 * (f1 / f0) ** e
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = (np.sin(ph) + 0.35 * np.sin(ph * 2.003)) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t))
    sig *= np.sin(np.pi * x) ** 0.6
    pans = -0.5 + e
    a = (pans + 1) * np.pi / 4
    place(np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1), at, gain, verb=0.45)


def pad(chords, gain=0.05):
    """Detuned additive pad; each chord crossfades into the next."""
    out = np.zeros((N, 2))
    t = np.arange(N) / SR
    for (start, end, notes) in chords:
        n0, n1 = int(start * SR), int(min(end + 1.2, DUR) * SR)
        tt = t[n0:n1] - start
        length = (n1 - n0) / SR
        fade_in = np.clip(tt / 1.4, 0, 1) ** 2
        fade_out = np.clip((length - tt) / 1.2, 0, 1)
        env = fade_in * fade_out
        for i, nm in enumerate(notes):
            f = note(nm)
            for side, det in ((0, 0.997), (1, 1.003)):
                ph = 2 * np.pi * f * det * tt + i
                voice = sum(np.sin(ph * k) / k**1.6 for k in (1, 2, 3, 4))
                lfo = 0.75 + 0.25 * np.sin(2 * np.pi * (0.13 + 0.05 * i) * tt + i)
                out[n0:n1, side] += voice * lfo * env
    # keep it airy: low-pass the top, and clear the lows so the sub impact owns them
    out = np.stack([highpass(onepole_lp(out[:, c], 1500), 140) for c in (0, 1)], axis=1)
    return out * gain


# ─── score (times match reel.html) ─────────────────────────────────────────
pad_bus = pad([
    (0.0, 6.2, ["A2", "E3", "B3", "C#4", "G#4"]),      # A maj9
    (6.0, 10.1, ["F#2", "C#3", "A3", "E4", "G#4"]),    # F#m9
    (10.0, 18.0, ["A2", "E3", "C#4", "G#4", "B4"]),    # A maj9 resolve on the logo
])

# 1 · Psychology
riser(0.15, 0.95, 220, 1600, gain=0.16)
whoosh(0.95, 0.7, 400, 6000, gain=0.45, pan0=-0.3, pan1=0.3, peak=0.35)
thud(1.25, f=70, gain=0.35)
shimmer(1.25, 0.9, gain=0.13)
bell(1.3, note("E5"), gain=0.12, pan=-0.2)
whoosh(2.7, 0.55, 5000, 700, gain=0.4, pan0=0.4, pan1=-0.5, peak=0.55)

# 2 · × Code
whoosh(3.12, 0.35, 900, 5000, gain=0.3, pan0=-0.5, pan1=0.1, peak=0.6, q=2)
for i in range(4):
    land = 3.3 + i * 0.08 + 0.9 * 0.3636
    pan = -0.45 + i * 0.3
    thud(land, f=105 - i * 8, gain=0.55, pan=pan)
    thud(3.3 + i * 0.08 + 0.9 * 0.7273, f=120 - i * 8, gain=0.18, pan=pan)
    thud(3.3 + i * 0.08 + 0.9 * 0.9091, f=135 - i * 8, gain=0.06, pan=pan)
for k in range(1, 17):
    key_click(4.1 + k / 16, pan=rng.uniform(-0.25, 0.25))
whoosh(5.65, 0.65, 3500, 500, gain=0.42, pan0=0.3, pan1=-0.3, peak=0.6)

# 3 · Motion
pop(6.35, f=880, gain=0.22, pan=-0.35)
pop(6.45, f=1320, gain=0.2, pan=0.35)
data_tone(6.4, 1.3)
bell(7.68, note("A5"), gain=0.12, pan=0.5, length=1.2)
whoosh(7.65, 0.85, 2500, 350, gain=0.35, pan0=0.5, pan1=-0.2, peak=0.5)
for i, (nm, pan) in enumerate([("C#5", -0.55), ("E5", 0.0), ("A5", 0.55)]):
    t0 = 7.9 + i * 0.12
    whoosh(t0, 0.42, 300, 2600, gain=0.16, pan0=pan, pan1=pan, peak=0.85, q=2)
    pop(t0 + 0.45, f=note(nm), gain=0.38, pan=pan)
    boing(t0 + 0.57, f=note(nm) / 2, gain=0.14, pan=pan)
for i in range(5):
    tick(8.5 + i * 0.07, f=1800 + i * 220, gain=0.07, pan=-0.4 + i * 0.2)

# 4 · Logo
riser(9.35, 0.77, 120, 2200, gain=0.3)
whoosh(9.5, 0.62, 6000, 300, gain=0.5, pan0=-0.7, pan1=0.0, peak=0.9)
whoosh(9.5, 0.62, 6000, 300, gain=0.5, pan0=0.7, pan1=0.0, peak=0.9)
impact(10.12, gain=1.0)
pop(10.13, f=520, gain=0.3)
shimmer(10.3, 0.7, gain=0.12)
whoosh(10.9, 0.9, 500, 3200, gain=0.32, pan0=0.3, pan1=-0.4, peak=0.45)
for i in range(6):
    tick(11.2 + i * 0.06 + 0.25, f=1500 * 2 ** (i / 12 * 2), gain=0.09, pan=-0.5 + i * 0.2)
whoosh(11.6, 0.6, 1200, 5200, gain=0.14, pan0=-0.3, pan1=0.3, peak=0.5)
shimmer(12.0, 1.1, gain=0.15, pan0=-0.8, pan1=0.8, density=30)
bell(12.3, note("E6"), gain=0.17, pan=-0.15)
bell(12.42, note("A6"), gain=0.15, pan=0.15)

# 5 · Contact card
whoosh(13.35, 0.5, 4200, 900, gain=0.22, pan0=0.2, pan1=-0.2, peak=0.5)
whoosh(13.5, 0.95, 350, 2800, gain=0.3, pan0=-0.2, pan1=0.2, peak=0.55)
riser(13.45, 0.5, 300, 1800, gain=0.1)
thud(13.98, f=78, gain=0.32)
shimmer(13.98, 0.5, gain=0.08, density=14)
# portrait reveal: soft shutter, a rounded pop and a bell
key_click(14.0, gain=0.22, pan=-0.1)
key_click(14.05, gain=0.16, pan=0.1)
pop(14.06, f=note("C#5"), gain=0.34)
shimmer(14.08, 0.6, gain=0.07, density=12)
bell(14.24, note("C#6"), gain=0.12, pan=-0.2, length=1.6)
for i, (nm, pan) in enumerate([("E5", -0.3), ("A5", 0.3)]):
    t0 = 14.55 + i * 0.22
    pop(t0 + 0.08, f=note(nm), gain=0.3, pan=pan)
    whoosh(t0 - 0.05, 0.35, 600, 3600, gain=0.1, pan0=-0.5, pan1=pan, peak=0.7, q=2)
    for k in range(6):
        key_click(t0 + 0.12 + k * 0.045, gain=0.16, pan=pan)
shimmer(15.6, 1.3, gain=0.12, pan0=-0.8, pan1=0.8, density=22)
bell(16.0, note("A5"), gain=0.12, pan=-0.1, length=2.0)
bell(16.12, note("E6"), gain=0.1, pan=0.1, length=2.0)


# ─── reverb, ducking and master ────────────────────────────────────────────
def reverb_ir(seconds=2.6):
    t = t_axis(seconds)
    ir = rng.standard_normal((len(t), 2)) * np.exp(-t * 2.6)[:, None]
    ir[:, 0] = onepole_lp(ir[:, 0], 6500)
    ir[:, 1] = onepole_lp(ir[:, 1], 6000)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt((ir**2).sum())


def fft_convolve(x, h):
    n = len(x) + len(h) - 1
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(h, size), size)[: len(x)]


ir = reverb_ir()
wet = np.stack([fft_convolve(send[:, c], ir[:, c]) for c in (0, 1)], axis=1) * 0.9

# duck the pad under the impact for punch
t = np.arange(N) / SR
duck = 1 - 0.75 * np.exp(-np.clip(t - 10.12, 0, None) * 2.2) * (t >= 10.1)
mix = dry + wet + pad_bus * duck[:, None]

# fade in/out so the reel loops cleanly
fade = np.clip(t / 0.08, 0, 1) * np.clip((DUR - t) / 0.7, 0, 1)
mix *= fade[:, None]

# DC/rumble cleanup, light glue, then peak-normalise to -1 dBFS (loudness is set in ffmpeg)
mix = np.stack([highpass(mix[:, c], 24) for c in (0, 1)], axis=1)
mix = np.tanh(mix * 1.05) / np.tanh(1.05)
mix *= 10 ** (-1 / 20) / np.abs(mix).max()

out = sys.argv[1] if len(sys.argv) > 1 else "gidzet-reel-sfx.wav"
pcm = (mix * 32767).astype("<i2")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {out} ({DUR:.0f}s, {SR} Hz stereo)")
