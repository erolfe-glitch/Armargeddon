"""W2f (Punkt 148): alter Bogen – neuer Bogen – Zielstil-Referenz je Zeile, dazu Anteil reines Magenta am Rand.
Aufruf: python tools/stil_uebersicht.py → entwurf/probe/stil/figuren/uebersicht.jpg"""
import numpy as np
from PIL import Image, ImageDraw
from pathlib import Path
R = Path(__file__).resolve().parent.parent; S = R / 'entwurf/probe/stil/figuren'; F = R / 'ui-quelle/figuren'
ZEILEN = [('Panzerbüchse AW', F / 'aschenwacht/aschenwacht_panzerbuechse_trupp.png', S / 'aschenwacht_panzerbuechse_trupp_zielstil.png', F / 'aschenwacht/reskin/aschenwacht_soldat_reskin.png'),
          ('MG-Trupp KK', F / 'konkordat/konkordat_mg_trupp.png', S / 'konkordat_mg_trupp_zielstil.png', F / 'konkordat/reskin/konkordat_soldat_reskin.png'),
          ('Flammen AW', F / 'aschenwacht/aschenwacht_flammen_neu.png', S / 'aschenwacht_flammen_zielstil.png', F / 'aschenwacht/reskin/aschenwacht_soldat_reskin.png')]
W, H = 620, 350
def rand(p):
    a = np.asarray(Image.open(p).convert('RGB')).astype(int); r = np.concatenate([a[:12].reshape(-1, 3), a[-12:].reshape(-1, 3), a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
    return round((np.abs(r - [255, 0, 255]).max(1) < 40).mean() * 100)
o = Image.new('RGB', (130 + 3 * (W + 8), 36 + len(ZEILEN) * (H + 8)), (24, 20, 18)); d = ImageDraw.Draw(o)
for i, t in enumerate(['alter Bogen', 'neuer Bogen (Nano Banana, Zielstil)', 'Zielstil-Referenz']): d.text((130 + i * (W + 8) + 6, 10), t, fill=(240, 230, 200))
for j, (n, *ps) in enumerate(ZEILEN):
    y = 36 + j * (H + 8); d.text((8, y + H // 2), n, fill=(240, 230, 200))
    for i, p in enumerate(ps):
        im = Image.open(p).convert('RGB'); im.thumbnail((W, H)); o.paste(im, (130 + i * (W + 8) + (W - im.width) // 2, y + (H - im.height) // 2))
    print(n, 'Magenta am Rand: alt', rand(ps[0]), '% · neu', rand(ps[1]), '%')
o.save(S / 'uebersicht.jpg', quality=88); print(S / 'uebersicht.jpg')
