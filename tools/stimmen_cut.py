"""Eigene Sprachaufnahmen (Suno Sprachausgabe, Suno Pro) für die Auswahl-Sprüche aufbereiten – Hörprobe, noch nicht im Spiel (2026-11-17).

1. Einsortieren: sound-quelle/Voices/<Suno-Name>.wav → sound-quelle/Voices/eigene/<fraktion>_stimme_<n>.wav (Dubletten nach dubletten/).
2. Schneiden: an Pausen (≥ 0,25 s unter −35 dB der Spitze) in einzelne Sprüche; doppelte Sprüche (gleicher Spruch: Spektrogramm ≥ 0,85 ähnlich; gleiche Aufnahme: Wellenform-Kreuzkorrelation ≥ 0,6) werden ausgelassen, derselbe Spruch in einer anderen Stimme bleibt (vermerkt)
   werden ausgelassen. Auffälligkeiten nach Klang (abgeschnitten, übersteuert, sehr kurz/lang) stehen in der Liste.
3. Gasmasken-Effekt in drei Stärken: Bandpass, leichte Verzerrung (tanh), sehr kurzer kleiner Raumhall; dazu ein kurzer Atemzug
   (Gas smoke/256519 mask-breathing) zum Voranstellen.
Ausgabe: WAV-Zwischenstände in <scratch>/stimmen und stimmen_liste.json; tools/stimmen_aac.mjs kodiert sie für entwurf/probe/stimmen/.
Aufruf: python tools/stimmen_cut.py <Zielordner für WAV>
"""
import json, shutil, sys, warnings
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

warnings.filterwarnings('ignore')
ROOT = Path(__file__).resolve().parent.parent
V = ROOT / 'sound-quelle' / 'Voices'
EIG = V / 'eigene'
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'build_stimmen'
SR = 48000

# Quelle → neuer Name; Dubletten (gleiche Datei bzw. gleicher Inhalt) gehen nach eigene/dubletten/
ZUORDNUNG = [
    ('On Your Word.wav', 'konkordat_stimme_1.wav'), ('On Your Word (1).wav', 'konkordat_stimme_2.wav'), ('On Your Word (2).wav', 'konkordat_stimme_3.wav'),
    ('On Your Word (4).wav', 'konkordat_stimme_4.wav'), ('On Your Word (5).wav', 'konkordat_stimme_5.wav'),
    ('Zu Befehl.wav', 'aschenwacht_stimme_1.wav'), ('Zu Befehl (1).wav', 'aschenwacht_stimme_2.wav'),
    ('Zu Befehl (Remastered).wav', 'aschenwacht_stimme_3.wav'), ('Zu Befehl (Remastered) (1).wav', 'aschenwacht_stimme_4.wav'),
]
DUBLETTEN = [('On Your Word (3).wav', 'konkordat_stimme_3_dublette.wav')]   # byte-gleich mit On Your Word (2)
# Weitere Gruppen (2026-11-17, Suno Pro): Panzerbesatzung (Landkoloss, Sturmpanzer, Bohrkoloss) mit Bordfunk, Schreiter/Eisenknecht als Maschine
ZUSATZ = [
    ('Panzer Konkordat.wav', 'panzer_konkordat_stimme_1.wav', 'funk'), ('Panzer Konkordat (2).wav', 'panzer_konkordat_stimme_2.wav', 'funk'),
    ('Panzer Aschenwacht.wav', 'panzer_aschenwacht_stimme_1.wav', 'funk'), ('Panzer Aschenwacht (2).wav', 'panzer_aschenwacht_stimme_2.wav', 'funk'),
    ('Schreiter Konkordat.wav', 'schreiter_konkordat_stimme_1.wav', 'roboter'), ('Schreiter Konkordat (2).wav', 'schreiter_konkordat_stimme_2.wav', 'roboter'),
    ('Schreiter Aschenwacht.wav', 'schreiter_aschenwacht_stimme_1.wav', 'roboter'), ('Schreiter Aschenwacht (2).wav', 'schreiter_aschenwacht_stimme_2.wav', 'roboter'),
]
# Bordfunk/Sprechanlage: Bandpass, Rauschen (dB unter dem Signal), Knistern (je Sekunde), Verzerrung, Motorbrummen darunter (dB), Funkklick am Anfang/Ende
FUNK = {
    'leicht': dict(bp=(400, 3000), rausch=-38, knister=3, drive=1.6, motor=-27, klick=False),
    'mittel': dict(bp=(500, 2500), rausch=-31, knister=8, drive=2.6, motor=-22, klick=True),
    'stark':  dict(bp=(600, 2300), rausch=-34, knister=4, drive=3.0, motor=-18, klick=True, kn_lp=2500),   # Tonprobe 2026-11-18: Knistern kratzte (vorher rausch −25, knister 16, drive 4,2, bp 650–2100)
}
# Maschine: Tonhöhe tiefer (durch langsameres Abspielen auch langsamer und schwerer), Ringmodulation, Kammfilter, kurzer metallischer Hall
ROBOTER = {
    'leicht': dict(tief=0.92, ring=(32, 0.25), kamm=(0.004, 0.45), hall=(0.10, 0.12)),
    'mittel': dict(tief=0.85, ring=(48, 0.45), kamm=(0.006, 0.62), hall=(0.14, 0.20)),
    'stark':  dict(tief=0.78, ring=(70, 0.65), kamm=(0.008, 0.75), hall=(0.18, 0.28)),
    # wie mittel, aber kurzer Nachhall (Tonprobe 2026-11-18, Schreiter Aschenwacht): kurzer Hall, schwächere Rückkopplung, Ausklang über ein Abwärts-Expander gekürzt
    'kurz':   dict(tief=0.85, ring=(48, 0.45), kamm=(0.006, 0.45), hall=(0.05, 0.08), gate=-22),
}

STUFEN = {   # Bandpass (Hz), Verzerrung, Hall (Länge s, Anteil), Ausgangspegel
    'leicht': dict(bp=(250, 3500), drive=1.4, hall=(0.06, 0.10)),
    'mittel': dict(bp=(300, 3000), drive=2.4, hall=(0.08, 0.16)),
    'stark':  dict(bp=(400, 2400), drive=4.0, hall=(0.10, 0.24)),
}


def lade(p):
    sr, a = wavfile.read(p); a = a.astype(np.float64)
    if a.ndim > 1: a = a.mean(1)
    a /= np.abs(a).max() or 1
    if sr != SR: a = signal.resample_poly(a, SR, sr)
    return a


def speichern(p, a):
    a = a / (np.abs(a).max() or 1) * 0.89
    wavfile.write(p, SR, (a * 32767).astype(np.int16))


def schneiden(a):
    w = int(SR * 0.02); n = len(a) // w; e = np.sqrt((a[:n * w].reshape(n, w) ** 2).mean(1)); thr = e.max() * 10 ** (-35 / 20)
    laut = e > thr; teile, i = [], 0
    while i < n:
        if not laut[i]: i += 1; continue
        j = i; still = 0
        while j < n and still < int(0.25 / 0.02):
            still = 0 if laut[j] else still + 1; j += 1
        ende = j - still
        if (ende - i) * 0.02 >= 0.25: teile.append((max(0, i * w - int(SR * 0.06)), min(len(a), ende * w + int(SR * 0.08))))
        i = j
    return teile


def merkmale(a, s, e):
    x = a[s:e]; d = (e - s) / SR; k = int(SR * 0.05)
    end_rms = np.sqrt((x[-k:] ** 2).mean()); rms = np.sqrt((x ** 2).mean())
    flags = []
    if d < 0.45: flags.append('sehr kurz')
    if d > 3.2: flags.append('sehr lang (mehrere Wörter ohne Pause?)')
    if end_rms > rms * 0.6: flags.append('Ende abgeschnitten?')
    if (np.abs(x) > 0.985).mean() > 0.0005: flags.append('übersteuert')
    return d, flags


def spektrum(x):   # zeitlicher Verlauf: Spektrogramm in 24 Bändern × 40 Zeitschritten (gleich lange Sprüche vergleichbar, verschiedene Wörter nicht)
    f, t, S = signal.stft(x, SR, nperseg=1024); S = np.log1p(np.abs(S))
    bands = np.array_split(S[(f >= 100) & (f <= 6000)], 24); S = np.array([b.mean(0) for b in bands])
    S = signal.resample(S, 40, axis=1); S -= S.mean(); return S.ravel()


def gleiche_aufnahme(x, y):   # normierte Kreuzkorrelation der Wellenform (Maximum über den Versatz): gleiche Aufnahme ≥ 0,7, gleicher Spruch anderer Stimme ≤ 0,4
    x = (x - x.mean()) / (x.std() * len(x) ** .5); y = (y - y.mean()) / (y.std() * len(y) ** .5)
    return float(np.abs(signal.fftconvolve(x, y[::-1])).max())


def maske(x, st, rng):
    b, a = signal.butter(4, [st['bp'][0] / (SR / 2), st['bp'][1] / (SR / 2)], 'band'); y = signal.lfilter(b, a, x)
    y = y / (np.abs(y).max() or 1); y = np.tanh(y * st['drive']) / np.tanh(st['drive'])   # leichte Verzerrung
    L, mix = st['hall']; n = int(SR * L); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (L / 4)); ir[0] = 0; ir /= np.abs(ir).sum() or 1   # sehr kurzer, kleiner Raum
    nass = np.convolve(y, ir)[:len(y)] * 6
    return (1 - mix) * y + mix * nass


def motor(n, rng):   # leises Motorbrummen (synthetisch): tiefe Grundschwingung mit Obertönen, im Zündtakt moduliert, dazu tiefes Rauschen
    t = np.arange(n) / SR; f0 = 34 + 2 * np.sin(2 * np.pi * 0.3 * t)
    ph = 2 * np.pi * np.cumsum(f0) / SR; y = sum(np.sin(k * ph) / k for k in (1, 2, 3, 4, 6))
    y *= 0.75 + 0.25 * np.sin(2 * np.pi * 8.5 * t)
    b, a = signal.butter(2, 180 / (SR / 2)); y += signal.lfilter(b, a, rng.standard_normal(n)) * 3
    return y / (np.abs(y).max() or 1)


def funk(x, st, rng):
    b, a = signal.butter(4, [st['bp'][0] / (SR / 2), st['bp'][1] / (SR / 2)], 'band'); y = signal.lfilter(b, a, x)
    y = y / (np.abs(y).max() or 1); y = np.tanh(y * st['drive']) / np.tanh(st['drive'])
    rms = np.sqrt((y ** 2).mean()) or 1e-3; n = len(y)
    rausch = signal.lfilter(b, a, rng.standard_normal(n)); rausch *= rms * 10 ** (st['rausch'] / 20) / (np.sqrt((rausch ** 2).mean()) or 1)
    kn = np.zeros(n); k = rng.poisson(st['knister'] * n / SR)
    for p in rng.integers(0, n, k): L = int(rng.integers(20, 160)); kn[p:p + L] += rng.standard_normal(min(L, n - p)) * rms * rng.uniform(0.3, 1.2)
    if st.get('kn_lp'): bl, al = signal.butter(2, st['kn_lp'] / (SR / 2)); kn = signal.lfilter(bl, al, kn)   # Knistern ohne scharfe Höhen
    y = y + rausch + kn + motor(n, rng) * rms * 10 ** (st['motor'] / 20) * 3
    if st['klick']:   # Sprechtaste: kurzer Rausch-Klick davor und danach
        kl = lambda: signal.lfilter(b, a, rng.standard_normal(int(SR * 0.045))) * rms * 1.2 * np.linspace(1, 0, int(SR * 0.045))
        y = np.concatenate([kl(), np.zeros(int(SR * 0.04)), y, np.zeros(int(SR * 0.03)), kl()])
    return y


def roboter(x, st, rng):
    y = signal.resample(x, int(len(x) / st['tief']))   # tiefer und langsamer
    t = np.arange(len(y)) / SR; f, m = st['ring']; y = (1 - m) * y + m * y * np.sin(2 * np.pi * f * t)   # Ringmodulation (metallisch)
    d, g = st['kamm']; D = int(SR * d); den = np.zeros(D + 1); den[0] = 1; den[D] = -g; z = signal.lfilter([1.0], den, y)   # Kammfilter mit Rückkopplung
    z = z / (np.abs(z).max() or 1)
    L, mix = st['hall']; n = int(SR * L); ir = np.zeros(n)   # kurzer metallischer Hall: dichte, rasch abklingende Reflexionen
    for p in rng.integers(1, n, 40): ir[p] += rng.uniform(-1, 1) * np.exp(-p / (n / 3))
    nass = np.convolve(z, ir)[:len(z)]; nass /= np.abs(nass).max() or 1
    b, a = signal.butter(2, [90 / (SR / 2), 5000 / (SR / 2)], 'band')
    y = signal.lfilter(b, a, (1 - mix) * z + mix * nass)
    return nachhall_kuerzen(y, st['gate']) if st.get('gate') else y


def nachhall_kuerzen(y, thr_db):   # Abwärts-Expander: unter thr_db (relativ zur Spitze der 10-ms-Hüllkurve) steil leiser – kürzt Hallfahnen und Ausklang, Sprache bleibt
    w = int(SR * 0.01); n = len(y) // w + 1; yp = np.pad(y, (0, n * w - len(y)))
    e = np.sqrt((yp.reshape(n, w) ** 2).mean(1)); e /= e.max() or 1; thr = 10 ** (thr_db / 20)
    g = np.minimum(1, (e / thr) ** 3)
    for i in range(1, n): g[i] = max(g[i], g[i - 1] * 0.7)   # Rückgang über ca. 30 ms, kein Flattern
    for i in range(n - 2, -1, -1): g[i] = max(g[i], g[i + 1] * 0.5)   # Einsatz vorgezogen, nichts abgeschnitten
    return y * np.repeat(g, w)[:len(y)]


EFFEKT = {'funk': (FUNK, funk), 'roboter': (ROBOTER, roboter)}


def main():
    EIG.mkdir(exist_ok=True); (EIG / 'dubletten').mkdir(exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)
    for alt, neu in ZUORDNUNG:
        if (V / alt).exists(): shutil.move(str(V / alt), str(EIG / neu))
    for alt, neu in DUBLETTEN:
        if (V / alt).exists(): shutil.move(str(V / alt), str(EIG / 'dubletten' / neu))
    rng = np.random.default_rng(7); liste = []; gesehen = {'konkordat': [], 'aschenwacht': []}
    for _, neu in ZUORDNUNG:
        fr, stimme = neu.split('_stimme_')[0], int(neu.split('_stimme_')[1].split('.')[0]); a = lade(EIG / neu)
        for k, (s, e) in enumerate(schneiden(a), 1):
            x = a[s:e]; d, flags = merkmale(a, s, e); sp = spektrum(x)
            aehnlich = [g for g in gesehen[fr] if abs(g['dur'] - d) < 0.15 and np.corrcoef(g['sp'], sp)[0, 1] > 0.85]   # gleicher Spruch
            dup = next((g for g in aehnlich if gleiche_aufnahme(g['x'], x) > 0.6), None)   # … und gleiche Aufnahme = Dublette
            gleich = next((g['name'] for g in aehnlich if g is not dup), None)
            name = f'{fr}_s{stimme}_{k:02d}'
            eintrag = dict(name=name, gruppe=fr, effekt='maske', fraktion=fr, stimme=stimme, nr=k, start=round(s / SR, 2), dauer=round(d, 2), auffaellig=flags, dublette_von=dup['name'] if dup else None, gleicher_spruch_wie=None if dup else gleich)
            liste.append(eintrag)
            if dup: continue
            gesehen[fr].append(dict(name=name, dur=d, sp=sp, x=x))
            speichern(OUT / f'{name}_roh.wav', x)
            for stn, st in STUFEN.items(): speichern(OUT / f'{name}_{stn}.wav', maske(x, st, rng))
    # Atemzug (Maske) zum Voranstellen
    atem = lade(V.parent / 'Gas smoke' / '256519__kodack__mask-breathing-sound.wav')
    w = int(SR * 0.02); n = len(atem) // w; e = np.sqrt((atem[:n * w].reshape(n, w) ** 2).mean(1)); i = int(np.argmax(e > e.max() * 0.15)) * w
    x = atem[max(0, i - int(SR * 0.05)): i + int(SR * 0.75)]; f = np.linspace(0, 1, len(x)); x = x * np.minimum(1, f * 8) * np.minimum(1, (1 - f) * 5)
    speichern(OUT / 'atem.wav', maske(x, STUFEN['leicht'], rng) * 0.6)
    # Weitere Gruppen (eigener Zufall, damit die Masken-Sprüche oben unverändert bleiben)
    for alt, neu, _ in ZUSATZ:
        if (V / alt).exists(): shutil.move(str(V / alt), str(EIG / neu))
    rng2 = np.random.default_rng(11)
    for _, neu, eff in ZUSATZ:
        gr, stimme = neu.split('_stimme_')[0], int(neu.split('_stimme_')[1].split('.')[0]); a = lade(EIG / neu); gesehen.setdefault(gr, [])
        stufen, fn = EFFEKT[eff]
        for k, (s, e) in enumerate(schneiden(a), 1):
            x = a[s:e]; d, flags = merkmale(a, s, e); sp = spektrum(x)
            aehnlich = [g for g in gesehen[gr] if abs(g['dur'] - d) < 0.15 and np.corrcoef(g['sp'], sp)[0, 1] > 0.85]
            dup = next((g for g in aehnlich if gleiche_aufnahme(g['x'], x) > 0.6), None)
            gleich = next((g['name'] for g in aehnlich if g is not dup), None)
            name = f'{gr}_s{stimme}_{k:02d}'
            liste.append(dict(name=name, gruppe=gr, effekt=eff, fraktion=gr.split('_')[1], stimme=stimme, nr=k, start=round(s / SR, 2), dauer=round(d, 2), auffaellig=flags,
                              dublette_von=dup['name'] if dup else None, gleicher_spruch_wie=None if dup else gleich))
            if d > 8: liste[-1]['aussortiert'] = 'Dauerklang ohne Pausen, kein einzelner Spruch'; continue   # misslungener Teil der Aufnahme
            if dup: continue
            gesehen[gr].append(dict(name=name, dur=d, sp=sp, x=x))
            speichern(OUT / f'{name}_roh.wav', x)
            for stn, st in stufen.items(): speichern(OUT / f'{name}_{stn}.wav', fn(x, st, rng2))
    json.dump(liste, open(OUT / 'stimmen_liste.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    gut = [e for e in liste if not e['dublette_von'] and not e.get('aussortiert')]
    for e in liste:
        if e.get('aussortiert'): print('aussortiert:', e['name'], e['dauer'], 's –', e['aussortiert'])
    print(f'{len(liste)} Sprüche geschnitten, {len(liste) - len(gut)} Dubletten ausgelassen, {sum(1 for e in gut if e["auffaellig"])} auffällig')
    for e in liste: print(e['name'], e['dauer'], 's', ('Dublette von ' + e['dublette_von']) if e['dublette_von'] else '', ', '.join(e['auffaellig']))


if __name__ == '__main__':
    main()
