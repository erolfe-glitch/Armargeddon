"""W2c (Punkt 150): Figurenbögen im Zielstil prüfen und Übersicht alter Bogen – neuer Bogen.
Je Bogen: Zahl der großen getrennten Flächen (soll = erwartete Figuren/Gruppen), Anteil reines Magenta am Rand (soll ≥ 95 %), Figur am Bildrand?
Aufruf: python tools/stil_pruefen.py <ordner> <endung>   z. B. entwurf/probe/stil/figuren/w2c1 _w2c1  (nimmt die neueste Fassung _v2, wenn vorhanden)"""
import sys, numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw
from pathlib import Path
R = Path(__file__).resolve().parent.parent; D = R / sys.argv[1]; END = sys.argv[2]; F = R / 'ui-quelle/figuren'
BOEGEN = [('aschenwacht_panzerbuechse_trupp', 'aschenwacht', 3), ('konkordat_mg_trupp', 'konkordat', 3), ('aschenwacht_mg_trupp', 'aschenwacht', 3),
          ('konkordat_moerser', 'konkordat', 1), ('aschenwacht_minenwerfer', 'aschenwacht', 1), ('konkordat_flammen', 'konkordat', 4)]
ALT = {'konkordat_flammen': 'konkordat_flammen_neu'}
def pruef(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int); d = np.abs(a - [255, 0, 255]).max(2)
    r = np.concatenate([d[:12].ravel(), d[-12:].ravel(), d[:, :12].ravel(), d[:, -12:].ravel()])
    lab, n = ndimage.label(d > 90); g = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    rand = max((d[:, :3] > 90).mean(), (d[:, -3:] > 90).mean(), (d[:3] > 90).mean(), (d[-3:] > 90).mean())
    return int((g > d.size * 0.008).sum()), round((r < 40).mean() * 100), round(rand * 100, 1)
W, H = 560, 315; zeilen = []
for n, f, soll in BOEGEN:
    neu = sorted(D.glob(f'{n}{END}*.png'))[-1:]   # _w2c1.png < _w2c1_v2.png
    if not neu: continue
    fl, mg, rd = pruef(neu[0]); ok = fl == soll and mg >= 95 and rd < 1
    print(f'{n:32s} {neu[0].name:45s} Flächen {fl}/{soll}  Magenta {mg} %  Figur am Rand {rd} %  {"ok" if ok else "NEU MALEN"}')
    zeilen.append((n, F / f / f'{ALT.get(n, n)}.png', neu[0], fl, soll, mg, ok))
o = Image.new('RGB', (230 + 2 * (W + 8), 36 + len(zeilen) * (H + 8)), (24, 20, 18)); dr = ImageDraw.Draw(o)
dr.text((236, 10), 'alter Bogen', fill=(240, 230, 200)); dr.text((236 + W + 8, 10), 'neuer Bogen (Zielstil)', fill=(240, 230, 200))
for j, (n, alt, neu, fl, soll, mg, ok) in enumerate(zeilen):
    y = 36 + j * (H + 8); dr.text((8, y + H // 2 - 20), n, fill=(240, 230, 200)); dr.text((8, y + H // 2), f'Flächen {fl}/{soll} · Magenta {mg} % · {"ok" if ok else "prüfen"}', fill=(150, 220, 120) if ok else (240, 140, 110))
    for i, p in enumerate([alt, neu]):
        im = Image.open(p).convert('RGB'); im.thumbnail((W, H)); o.paste(im, (230 + i * (W + 8) + (W - im.width) // 2, y + (H - im.height) // 2))
o.save(D / 'uebersicht.jpg', quality=86); print(D / 'uebersicht.jpg')
