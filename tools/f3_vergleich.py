"""F3: Standbilder vorher/nachher im Moment des Schusses (Turm-MG), je Blickrichtung drei Zeitpunkte. Aufruf: python tools/f3_vergleich.py"""
import json
from PIL import Image, ImageDraw
for art in ['vorher', 'nachher']:
    P = json.load(open(f'entwurf/probe/f3/{art}/punkte.json')); K = []
    for n in ['sturmpz_zweit_rechts', 'sturmpz_zweit_links']:
        x, y = P[n]
        for s in ['_a', '_b', '_c']: K.append(Image.open(f'entwurf/probe/f3/{art}/{n}{s}.jpg').crop((int(x) - 250, int(y) - 180, int(x) + 250, int(y) + 120)))
    o = Image.new('RGB', (1500, 600))
    for i, im in enumerate(K): o.paste(im, ((i % 3) * 500, (i // 3) * 300))
    ImageDraw.Draw(o).text((8, 8), art, fill=(255, 255, 0)); o.save(f'entwurf/probe/f3/turm_mg_{art}.jpg', quality=88)
