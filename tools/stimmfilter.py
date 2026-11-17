# Einheitlicher Stimmfilter je Sprecher (2026-11-17, Stärken gewählt auf entwurf/probe/stimmen.html):
# rechnet zu den Stimm-Tonplätzen Varianten <platz>_<v> und trägt sie in tools/sound_bau.json ein. Im Spiel wählt ui.js stimmVar(u) die Variante.
#   gm = Gasmaske leicht (Infanterie, Sturmtruppen, Pioniere, Sanitäter, Reiter …)   gs = Gasmaske mittel (Kampfanzüge: Stahlgänger, Panzerknechte)
#   bf = Bordfunk stark (Panzerbesatzung: Landkoloss, Sturmpanzer, Bohrkoloss)       mr = Maschine mittel (Schreiter, Eisenknecht; auch robot)
#   Hauptmann und General: ohne Filter (der bisherige Platz).
# Quelle sind die Töne, wie sie jetzt im Spiel stehen (src/sound.js, dekodiert mit tools/spielstimmen_wav.mjs), Lautstärke wie das Original.
# Aufruf: python tools/stimmfilter.py   → danach node tools/sound_bau.mjs (Vorschau-Server) und python tools/build.py
import json, re, subprocess, sys
from pathlib import Path
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, str(Path(__file__).parent))
from stimmen_cut import lade, speichern, maske, funk, roboter, STUFEN, FUNK, ROBOTER, SR, ROOT

VAR = {'gm': lambda x, r: maske(x, STUFEN['leicht'], r), 'gs': lambda x, r: maske(x, STUFEN['mittel'], r),
       'bf': lambda x, r: funk(x, FUNK['stark'], r), 'mr': lambda x, r: roboter(x, ROBOTER['mittel'], r)}
NAME = {'gm': 'Gasmaske leicht', 'gs': 'Gasmaske mittel (Kampfanzug)', 'bf': 'Bordfunk stark (Panzer)', 'mr': 'Maschine mittel (Schreiter/Eisenknecht)'}
# Welche Sprecher einen Platz rufen können (siehe ui.js): nur diese Varianten werden gerechnet
PLAN = {
    'pain': ['gm', 'gs'], 'medic': ['gm', 'gs'], 'cry': ['gm', 'gs'], 'scream': ['gm', 'gs'],   # Treffer/Nahkampf: nur Fußtruppen
    'panic': ['gm', 'gs', 'bf', 'mr'],                                                          # Flucht: jede Einheit
    'forward': ['gm', 'gs'], 'roar': ['gm', 'gs'], 'stand': ['gm'], 'charge': ['gm', 'gs'],     # Sturmlauf, Gegenstoß; Befehle der Offiziere bleiben ohne Filter
    'comeon': ['gm'], 'husten': ['gm'], 'robot': ['mr'],
}
OHNE = {'panic_1'}   # Fluchtschreie einer Menge: in der Hörprobe nicht gewählt, bleibt nur ungefiltert
BEIDE = {'robot'}    # bisher nur Konkordat: gefiltert für beide Seiten (Eisenknecht der Aschenwacht)
DIR = ROOT / 'sound-quelle' / 'Voices' / 'eigene' / 'filter'


def r90_db(x):   # wie tools/sound_bau.mjs: 90-%-Wert der 50-ms-RMS-Fenster
    w = int(SR * 0.05); n = len(x) // w
    r = np.sort(np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1))) if n else np.array([0.1])
    return 20 * np.log10(r[int(len(r) * 0.9)] or 1e-6)


def main():
    pools = json.loads(re.search(r'root\.SOUND_POOLS = (\{.*\});', (ROOT / 'src/sound.js').read_text(encoding='utf8')).group(1))
    keys = {p: [(k, s) for k, s, *_ in pools[p] if k not in OHNE] for p in PLAN}
    roh = DIR / 'roh'; roh.mkdir(parents=True, exist_ok=True)
    alle = sorted({k for v in keys.values() for k, _ in v})
    subprocess.run(['node', str(ROOT / 'tools/spielstimmen_wav.mjs'), str(roh), *alle], check=True, stdout=subprocess.DEVNULL)
    rng = np.random.default_rng(17); zeilen = []
    for p, vs in PLAN.items():
        for v in vs:
            for i, (k, s) in enumerate(keys[p]):
                x = lade(roh / f'{k}.wav')   # auf Spitze 1 normiert
                orig = wavfile.read(roh / f'{k}.wav')[1].astype(np.float64) / 32767   # Pegel des Originals aus der Rohdatei (16 bit)
                y = VAR[v](x, rng); f = f'{k}_{v}.wav'; speichern(DIR / f, y)
                e = {'pool': f'{p}_{v}', 'f': f'Voices/eigene/filter/{f}', 's': None if p in BEIDE else s, 'max': round(len(y) / SR + 0.3, 1), 'lvl': round(float(r90_db(orig)), 1)}
                if i == 0: e['note'] = f'{NAME[v]}: {p} gefiltert (tools/stimmfilter.py, 2026-11-17)'
                zeilen.append('    ' + json.dumps(e, ensure_ascii=False).replace('{"', '{ "').replace('}', ' }') + ',')
    p = ROOT / 'tools/sound_bau.json'; t = p.read_text(encoding='utf8').split('\n')
    t = [l for l in t if not re.search(r'"pool": "[a-z]+_(gm|gs|bf|mr)"', l)]
    i = max(k for k, l in enumerate(t) if '"pool": "husten"' in l) + 1   # hinter den Husten-Einträgen
    t[i:i] = zeilen
    p.write_text('\n'.join(t), encoding='utf8'); json.loads(p.read_text(encoding='utf8'))
    print(len(zeilen), 'gefilterte Töne in', len({z.split('"pool": "')[1].split('"')[0] for z in zeilen}), 'Plätzen')


if __name__ == '__main__':
    main()
