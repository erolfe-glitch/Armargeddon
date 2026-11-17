# Vorhandene Stimm-Töne aus dem Spiel (WAV von tools/spielstimmen_wav.mjs) mit dem Gasmasken-Effekt aus tools/stimmen_cut.py in drei Stärken,
# als Gruppe „spiel“ für die Hörprobe entwurf/probe/stimmen.html (Vergleich, noch nicht im Spiel).
# Aufruf: python tools/stimmen_spiel.py <ordner mit <schlüssel>.wav> <zielordner>   → danach node tools/stimmen_aac.mjs <zielordner>
import json, shutil, sys
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).parent))
from stimmen_cut import lade, speichern, maske, STUFEN, SR, ROOT

TITEL = {   # Schlüssel im Spiel → (Seite, Beschreibung)
    'cry': ('A', 'Schlachtruf Konkordat (cry)'), 'cry_1': ('A', 'Kriegsruf beim Sturmangriff (cry)'), 'scream_1': ('D', 'Schlachtruf Aschenwacht, Menge (scream)'),
    'pain': ('', 'Schmerzschrei (pain)'), 'pain_2': ('A', 'Schmerzschrei (pain)'), 'medic': ('', '„I need a medic“ (medic)'),
    'forward': ('A', '„Forward march“ (forward, Sturmbefehl)'), 'stand': ('A', '„Stand your ground“ (stand, Sammeln)'),
    'panic': ('', 'Fluchtschrei (panic)'), 'panic_1': ('', 'Fluchtschreie, Gruppe (panic)'), 'husten_1': ('', 'Husten bei Gas (husten)'), 'husten_2': ('', 'Husten bei Gas (husten)'),
}


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    liste = [e for e in json.loads((ROOT / 'entwurf/probe/stimmen/stimmen_liste.json').read_text(encoding='utf8')) if e.get('gruppe') != 'spiel']
    rng = np.random.default_rng(13)
    for k, (s, titel) in TITEL.items():
        x = lade(src / f'{k}.wav'); name = f'spiel_s1_{k}'
        speichern(out / f'{name}_roh.wav', x)
        for stn, st in STUFEN.items(): speichern(out / f'{name}_{stn}.wav', maske(x, st, rng))
        liste.append(dict(name=name, gruppe='spiel', effekt='maske', fraktion={'A': 'konkordat', 'D': 'aschenwacht'}.get(s, 'beide'), stimme=1, nr=len(liste), schluessel=k,
                          titel=titel, dauer=round(len(x) / SR, 2), auffaellig=[], dublette_von=None, gleicher_spruch_wie=None))
    (out / 'stimmen_liste.json').write_text(json.dumps(liste, ensure_ascii=False, indent=1), encoding='utf8')
    print(len(TITEL), 'Töne je 4 Fassungen nach', out)


if __name__ == '__main__':
    main()
