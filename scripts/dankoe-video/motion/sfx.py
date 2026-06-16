#!/usr/bin/env python
"""Kit de SFX sintetizados por codigo (numpy) — identidad sonora de marca.

Genera whoosh, impacto sub-grave, riser y shimmer 'tech', y arma la pista de
audio del insert sincronizada a la animacion. Sin librerias externas ni licencias.

Uso:
    python sfx.py <salida.wav> [--dur 4.0]   # arma la pista del insert IA
"""
import sys, argparse
import numpy as np
from scipy.io import wavfile

SR = 48000

def env(n, attack, decay, sustain=0.0, hold=0.0):
    """Envelope AD(SR) simple en samples."""
    a = int(attack*SR); h = int(hold*SR); d = int(decay*SR)
    out = np.zeros(n)
    i = 0
    a = min(a, n); out[:a] = np.linspace(0,1,a); i = a
    h = min(h, n-i); out[i:i+h] = 1.0; i += h
    d = min(d, n-i); out[i:i+d] = np.linspace(1,sustain,d) if d>0 else out[i:i+d]
    return out

def one_pole_lp_sweep(x, c0, c1):
    """Lowpass de un polo con cutoff normalizado variando c0->c1 (0..1)."""
    n = len(x); y = np.zeros(n); cs = np.linspace(c0, c1, n); prev = 0.0
    for i in range(n):
        a = cs[i]
        prev = prev + a*(x[i]-prev); y[i] = prev
    return y

def whoosh(dur=0.55, up=True):
    n = int(dur*SR)
    noise = np.random.randn(n)
    sweep = (0.02, 0.5) if up else (0.5, 0.02)
    f = one_pole_lp_sweep(noise, *sweep)
    f -= one_pole_lp_sweep(f, 0.002, 0.002)  # quitar sub-graves (highpass aprox)
    e = env(n, 0.12, dur-0.12, 0.0)
    return f*e*0.5

def boom(dur=0.9, f_start=110, f_end=42):
    """Impacto sub-grave con cuerpo. Fundamental + armonico 2x para que tambien
    se perciba en parlantes de celular (que no reproducen <80 Hz)."""
    n = int(dur*SR); t = np.arange(n)/SR
    inst = np.linspace(f_start, f_end, n)
    phase = 2*np.pi*np.cumsum(inst)/SR
    e = env(n, 0.004, dur-0.004, 0.0)
    sub = np.sin(phase)                         # fundamental (cuerpo en audifonos)
    harm = 0.35*np.sin(2*phase)                 # armonico (audible en celular)
    s = (sub + harm) * e
    s = np.tanh(s*1.3)                          # saturacion leve -> mas presencia
    return s*0.95

def riser(dur=0.9):
    n = int(dur*SR); t = np.arange(n)/SR
    noise = np.random.randn(n)
    f = one_pole_lp_sweep(noise, 0.01, 0.45)
    tone = np.sin(2*np.pi*np.cumsum(np.linspace(200,800,n))/SR)*0.3
    amp = np.linspace(0,1,n)**2
    return (f*0.5 + tone)*amp*0.5

def finale_boom(dur=3.0):
    """Sub-bass boom de cierre: golpe grave fuerte que se SIENTE y se prolonga 3s.
    Fundamental 44 Hz (sub) + armonicos 88/132 Hz (cuerpo audible en celular) +
    transient de ataque (punch) + saturacion. Pensado para sonar al maximo."""
    n = int(dur*SR); t = np.arange(n)/SR
    head = int(0.22*SR)
    inst = np.concatenate([np.linspace(66, 44, head), np.full(n-head, 44)])
    phase = 2*np.pi*np.cumsum(inst)/SR
    sub  = np.sin(phase)
    h2   = 0.55*np.sin(2*phase)       # 88 Hz — se oye en parlante de celular
    h3   = 0.28*np.sin(3*phase)       # 132 Hz — define el "boom"
    body = sub + h2 + h3
    e = np.exp(-t*0.8)                # decaimiento lento -> se prolonga ~3s
    a = int(0.004*SR); env_a = np.ones(n); env_a[:a] = np.linspace(0, 1, a)
    s = body * e * env_a
    # transient de ataque (click corto de ruido filtrado) para el "punch"
    cl = int(0.05*SR); click = np.random.randn(cl) * np.exp(-np.arange(cl)/ (0.012*SR))
    s[:cl] += click*0.5
    s = np.tanh(s*1.9)                # saturacion fuerte -> presencia
    return s*0.99

def shimmer(dur=0.8):
    n = int(dur*SR); t = np.arange(n)/SR
    s = np.zeros(n)
    for fr in (3200, 4300, 5600, 7100):
        s += np.sin(2*np.pi*fr*t + np.random.rand())
    s *= (0.5+0.5*np.sin(2*np.pi*16*t))      # tremolo
    e = env(n, 0.02, dur-0.02, 0.0)
    return s/4*e*0.25

def place(track, sig, at):
    i = int(at*SR); j = min(len(track), i+len(sig))
    track[i:j] += sig[:j-i]

def wr(path, sig):
    sig = sig / max(1e-6, np.max(np.abs(sig))) * 0.85
    wavfile.write(path, SR, (np.stack([sig, sig], 1)*32767).astype(np.int16))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--dur", type=float, default=4.0)
    ap.add_argument("--emit", help="directorio: emite SFX individuales del kit")
    a = ap.parse_args()

    if a.emit:
        import os; os.makedirs(a.emit, exist_ok=True)
        wr(f"{a.emit}/whoosh_up.wav",   whoosh(0.55, up=True))
        wr(f"{a.emit}/whoosh_down.wav", whoosh(0.45, up=False))
        wr(f"{a.emit}/boom.wav",        boom(0.7))
        wr(f"{a.emit}/riser.wav",       riser(0.9))
        wr(f"{a.emit}/shimmer.wav",     shimmer(0.8))
        wr(f"{a.emit}/finale_boom.wav", finale_boom(3.0))
        print(f"OK kit individual -> {a.emit}")
        return

    n = int(a.dur*SR); track = np.zeros(n)

    place(track, riser(0.9),  0.0)    # build hacia el titulo
    place(track, whoosh(0.55, up=True), 0.0)   # entrada del orbe
    place(track, boom(0.7),   0.87)   # aterriza el titulo
    place(track, shimmer(0.8), 1.5)   # ecualizador / sub dorado
    place(track, whoosh(0.4, up=False)*0.6, 3.4)  # salida suave

    track /= max(1e-6, np.max(np.abs(track))) ; track *= 0.85   # normaliza
    stereo = np.stack([track, track], axis=1)
    wavfile.write(a.out, SR, (stereo*32767).astype(np.int16))
    print(f"OK SFX -> {a.out} ({a.dur}s)")

if __name__ == "__main__":
    main()
