# V3 (Punkt 111, 2026-11-26): Filter „Schlachtfunk“ für die neuen Sprüche (Kette aus Punkt 109.5, Vorlage: WebAudio-Hörprobe des Beraters).
# Quelle: sound-quelle/Voices/eigene/el/wav/<id>.wav (tools/el_wav.mjs). Ziel: sound-quelle/Voices/eigene/el/filter/<id>.wav,
# Eiserne Hünen zusätzlich <id>_mx.wav (Maschine) für die geteilten A_sturm_*-Zeilen. Ruhe vorn/hinten abgeschnitten, Lautstärke angeglichen.
# Arten (Spalte filter in entwurf/stimmen_texte.csv):
#   funk     = Schlachtfunk
#   bordfunk = Schlachtfunk + mehr Rauschen (Panzer/Kolosse)
#   maschine = Maschine (wie _mr, tools/stimmen_cut.py roboter 'mittel') + leichter Schlachtfunk (Schreiter, Hünen)
#   helm     = Schlachtfunk mit weniger Kamm, dafür hohler Helmklang (Helden)
# Aufruf: python tools/schlachtfunk.py [--probe ordner] [id …]
import csv, sys
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d
sys.path.insert(0, str(Path(__file__).parent))
from stimmen_cut import roboter, ROBOTER

ROOT = Path(__file__).resolve().parent.parent
EL = ROOT / 'sound-quelle' / 'Voices' / 'eigene' / 'el'
SR = 48000
HUENEN = 'A_sturm_'   # diese Zeilen sprechen auch die Hünen → zusätzlich _mx (Maschine)
ZIEL_RMS_DB = -17.0   # Lautstärke: RMS des gesprochenen Teils


def biquad(typ, f0, q=0.7071, gain_db=0.0):   # RBJ-Kochbuch
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / SR; c, s = np.cos(w), np.sin(w); al = s / (2 * q)
    if typ == 'hp': b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]; a = [1 + al, -2 * c, 1 - al]
    elif typ == 'lp': b = [(1 - c) / 2, 1 - c, (1 - c) / 2]; a = [1 + al, -2 * c, 1 - al]
    elif typ == 'bp': b = [al, 0, -al]; a = [1 + al, -2 * c, 1 - al]
    elif typ == 'peak': b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
    elif typ == 'lowshelf':
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * c + sq), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sq)]
        a = [(A + 1) + (A - 1) * c + sq, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sq]
    return np.array(b) / a[0], np.array(a) / a[0]


def bq(x, *arg): b, a = biquad(*arg); return signal.lfilter(b, a, x)


def kamm(x, ms, fb, mix):   # Kammfilter mit Rückkopplung
    D = max(1, int(SR * ms / 1000)); den = np.zeros(D + 1); den[0] = 1; den[D] = -fb
    w = signal.lfilter([1.0], den, x); w *= (np.abs(x).max() or 1) / (np.abs(w).max() or 1)
    return (1 - mix) * x + mix * w


def kompressor(x, thr_db=-28, ratio=8, att_ms=3, rel_ms=120):   # Spitzenhüllkurve: schnell hoch (Attack), langsam runter (Release)
    env = maximum_filter1d(np.abs(x), size=max(1, int(SR * att_ms / 1000)))
    a = np.exp(-1 / (SR * rel_ms / 1000)); env = signal.lfilter([1 - a], [1, -a], env); env = np.maximum(env, maximum_filter1d(np.abs(x), 3) * 0.5)
    lv = 20 * np.log10(env + 1e-9); over = np.maximum(0, lv - thr_db); g = 10 ** (-over * (1 - 1 / ratio) / 20)
    return x * g


def rauschen(n, rng, db, klick_db):   # Funkrauschen (Bandpass 2200 Hz) über die ganze Länge + Klick 60 ms am Anfang
    z = bq(rng.standard_normal(n), 'bp', 2200, 0.9); z /= np.abs(z).max() or 1
    y = z * 10 ** (db / 20); k = int(SR * 0.06); y[:k] += z[:k] * 10 ** (klick_db / 20) * np.linspace(1, 0.2, k)
    return y


def schlachtfunk(x, rng, kammmix=0.5, rausch_db=-36.0, helm=False):
    y = signal.resample_poly(x, 50, 43)   # Tonhöhe ×0,86: tiefer und langsamer (50/43 ≈ 1/0,86)
    y = bq(y, 'hp', 260); y = bq(y, 'lowshelf', 300, 0.7071, 4); y = bq(y, 'peak', 1100, 1.4, 7)
    if helm: y = bq(y, 'peak', 650, 2.0, 5); y = kamm(y, 1.6, 0.55, 0.35)   # hohler Helmklang: enge Resonanz und sehr kurzer Kamm
    y = y / (np.abs(y).max() or 1); y = np.tanh(5.5 * y) / np.tanh(5.5)   # Sättigung
    y = bq(y, 'lp', 2900); y = kompressor(y); y = kamm(y, 6, 0.45, kammmix)
    y = y / (np.abs(y).max() or 1) * 0.8
    return y + rauschen(len(y), rng, rausch_db, rausch_db + 22)


def art(x, f, rng):
    if f == 'funk': return schlachtfunk(x, rng)
    if f == 'bordfunk': return schlachtfunk(x, rng, rausch_db=-29.0)
    if f == 'helm': return schlachtfunk(x, rng, kammmix=0.25, helm=True)
    if f == 'maschine':
        m = roboter(x, ROBOTER['mittel'], rng); m = m / (np.abs(m).max() or 1)
        return leicht(m, rng)
    raise ValueError(f)


def leicht(x, rng):   # leichter Schlachtfunk (über der Maschine): ohne Tonhöhe, weniger Glocke und Kamm
    y = bq(x, 'hp', 200); y = bq(y, 'peak', 1100, 1.4, 4); y = y / (np.abs(y).max() or 1); y = np.tanh(2.5 * y) / np.tanh(2.5)
    y = bq(y, 'lp', 3400); y = kamm(y, 6, 0.3, 0.25); y = y / (np.abs(y).max() or 1) * 0.8
    return y + rauschen(len(y), rng, -40.0, -20.0)


def lade(p):
    sr, a = wavfile.read(p); a = a.astype(np.float64) / 32768
    if a.ndim > 1: a = a.mean(1)
    return a if sr == SR else signal.resample_poly(a, SR, sr)


def schneiden(a, rand_ms=25):   # Ruhe vorn/hinten weg (−40 dB unter der lautesten 10-ms-Stelle), kleiner Rand bleibt
    w = int(SR * 0.01); n = len(a) // w
    if not n: return a
    e = np.sqrt((a[:n * w].reshape(n, w) ** 2).mean(1)); thr = e.max() * 10 ** (-40 / 20); on = np.nonzero(e > thr)[0]
    r = int(SR * rand_ms / 1000); i0 = max(0, on[0] * w - r); i1 = min(len(a), (on[-1] + 1) * w + r)
    y = a[i0:i1].copy(); f = int(SR * 0.008); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y


def angleichen(y):   # RMS des gesprochenen Teils auf ZIEL_RMS_DB, Spitze höchstens 0,97
    w = int(SR * 0.02); n = len(y) // w; e = np.sqrt((y[:n * w].reshape(n, w) ** 2).mean(1)) if n else np.array([1e-3])
    akt = e[e > e.max() * 0.1]; r = np.sqrt((akt ** 2).mean()) if len(akt) else 1e-3
    y = y * 10 ** (ZIEL_RMS_DB / 20) / r; p = np.abs(y).max()
    return y * (0.97 / p) if p > 0.97 else y


def speichern(p, y): p.parent.mkdir(parents=True, exist_ok=True); wavfile.write(p, SR, (np.clip(y, -1, 1) * 32767).astype(np.int16))


def zeilen():
    return list(csv.reader(open(ROOT / 'entwurf' / 'stimmen_texte.csv', encoding='utf-8-sig'), delimiter=';'))[1:]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    probe = Path(sys.argv[sys.argv.index('--probe') + 1]) if '--probe' in sys.argv else None
    if probe: args = [a for a in args if Path(a) != probe]
    out = probe or EL / 'filter'; rng = np.random.default_rng(111); n = 0
    for r in zeilen():
        id_, f = r[0], r[6]
        if args and id_ not in args: continue
        x = schneiden(lade(EL / 'wav' / f'{id_}.wav')); x = x / (np.abs(x).max() or 1)
        speichern(out / f'{id_}.wav', angleichen(schneiden(art(x, f, rng), 10))); n += 1
        if id_.startswith(HUENEN): speichern(out / f'{id_}_mx.wav', angleichen(schneiden(art(x, 'maschine', rng), 10))); n += 1
        if probe: speichern(out / f'{id_}_roh.wav', angleichen(x))
    print(out, n, 'gefilterte Sprüche')


if __name__ == '__main__':
    main()
