"""Auswahl-Sprüche einzelner Sprechergruppen mit geändertem Filter neu rechnen (Tonprobe 2026-11-18).

Schneidet die Suno-Aufnahmen in sound-quelle/Voices/eigene/ genau wie tools/stimmen_cut.py (gleiche Namen <gruppe>_s<stimme>_<nr>)
und überschreibt nur die Sprüche, die schon in Voices/eigene/sprueche/ liegen (Auswahl aus tools/stimmen_auswahl.json).
Dateinamen bleiben gleich (Endung = bisherige Stärke), damit tools/sound_bau.json unverändert gilt.
  Panzerbesatzung: Bordfunk „stark“ mit weniger Knistern/Rauschen (FUNK['stark'] in stimmen_cut.py)
  Schreiter Aschenwacht: Maschine „kurz“ (kurzer Hall, Ausklang gekürzt) statt „mittel“
Aufruf: python tools/sprueche_neu.py   → danach python tools/stimmfilter.py (für panic_bf), node tools/sound_bau.mjs, python tools/build.py
"""
from pathlib import Path
import numpy as np
from stimmen_cut import lade, speichern, schneiden, funk, roboter, FUNK, ROBOTER, EIG, SR

SPR = EIG / 'sprueche'
GRUPPEN = {   # Gruppe → (Effekt, Stärke, Endung der vorhandenen Dateien)
    'panzer_konkordat': (funk, FUNK['stark'], 'stark'),
    'panzer_aschenwacht': (funk, FUNK['stark'], 'stark'),
    'schreiter_aschenwacht': (roboter, ROBOTER['kurz'], 'mittel'),
}


def main():
    rng = np.random.default_rng(23); n = 0
    for gr, (fn, st, end) in GRUPPEN.items():
        for q in sorted(EIG.glob(f'{gr}_stimme_*.wav')):
            stimme = int(q.stem.split('_stimme_')[1]); a = lade(q)
            for k, (s, e) in enumerate(schneiden(a), 1):
                ziel = SPR / f'{gr}_s{stimme}_{k:02d}_{end}.wav'
                if not ziel.exists(): continue
                y = fn(a[s:e], st, rng); alt = len(np.frombuffer(ziel.read_bytes()[44:], np.int16)) / SR
                if abs(len(y) / SR - alt) > 0.3: print('  Länge weicht ab:', ziel.name, round(alt, 2), '→', round(len(y) / SR, 2))
                speichern(ziel, y); n += 1
    print(n, 'Sprüche neu gerechnet')


if __name__ == '__main__':
    main()
