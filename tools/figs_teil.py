"""Ersetzt in src/figs.js nur die genannten Schlüssel (WebP wie figure_cut.embed), statt alle Bilder neu zu kodieren (embed dauert über 8 min).
Aufruf: python tools/figs_teil.py <schlüssel> …   (Schlüssel = Dateiname in ui-quelle/teile/figuren/ ohne .png; neue Schlüssel werden angehängt)"""
import sys, io, base64, re
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent; GAME = ROOT / 'ui-quelle' / 'teile' / 'figuren'; P = ROOT / 'src' / 'figs.js'
L = P.read_text(encoding='utf8').split('\n')
idx = {m.group(1): i for i, l in enumerate(L) if (m := re.match(r'"([^"]+)": "', l))}
for k in sys.argv[1:]:
    buf = io.BytesIO(); Image.open(GAME / f'{k}.png').save(buf, 'WEBP', quality=86, method=6)
    zeile = f'"{k}": "data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode() + '",'
    if k in idx: L[idx[k]] = zeile; print('ersetzt', k)
    else: e = L.index('};'); L.insert(e, zeile); print('neu', k)
P.write_text('\n'.join(L), encoding='utf8', newline='\n')
