"""W2g (Punkt 149): alter Bogen – W2f – W2g – Zielstil je Zeile; dazu Magenta-Rand und Zahl getrennter Flächen (schneidbar?).
Aufruf: python tools/stil_uebersicht2.py → entwurf/probe/stil/figuren/uebersicht2.jpg"""
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw
from pathlib import Path
R = Path(__file__).resolve().parent.parent; S = R / 'entwurf/probe/stil/figuren'; F = R / 'ui-quelle/figuren'
ZEILEN = [('Panzerbüchse AW', F / 'aschenwacht/aschenwacht_panzerbuechse_trupp.png', S / 'aschenwacht_panzerbuechse_trupp_zielstil.png', S / 'aschenwacht_panzerbuechse_trupp_zielstil2.png', F / 'aschenwacht/reskin/aschenwacht_soldat_reskin.png'),
          ('MG-Trupp KK', F / 'konkordat/konkordat_mg_trupp.png', S / 'konkordat_mg_trupp_zielstil.png', S / 'konkordat_mg_trupp_zielstil2.png', F / 'konkordat/reskin/konkordat_soldat_reskin.png')]
W, H = 520, 300
def pruef(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int); d = np.abs(a - [255, 0, 255]).max(2)
    r = np.concatenate([d[:12].ravel(), d[-12:].ravel(), d[:, :12].ravel(), d[:, -12:].ravel()])
    lab, n = ndimage.label(d > 90); g = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); gross = int((g > a.shape[0] * a.shape[1] * 0.01).sum())
    return round((r < 40).mean() * 100), gross
o = Image.new('RGB', (130 + 4 * (W + 8), 36 + len(ZEILEN) * (H + 8)), (24, 20, 18)); dr = ImageDraw.Draw(o)
for i, t in enumerate(['alter Bogen', 'W2f (mit altem Bogen)', 'W2g (ohne alten Bogen)', 'Zielstil']): dr.text((130 + i * (W + 8) + 6, 10), t, fill=(240, 230, 200))
for j, (n, *ps) in enumerate(ZEILEN):
    y = 36 + j * (H + 8); dr.text((8, y + H // 2), n, fill=(240, 230, 200))
    for i, p in enumerate(ps):
        im = Image.open(p).convert('RGB'); im.thumbnail((W, H)); o.paste(im, (130 + i * (W + 8) + (W - im.width) // 2, y + (H - im.height) // 2))
    for lbl, p in zip(['W2f', 'W2g'], ps[1:3]): m, g = pruef(p); print(n, lbl, f'Magenta-Rand {m} %, große getrennte Flächen {g}')
o.save(S / 'uebersicht2.jpg', quality=88); print(S / 'uebersicht2.jpg')
