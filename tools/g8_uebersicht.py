"""G8 (Punkt 153): Gruppen im Graben vorher/nachher, Graben in die Tiefe und quer. Aufruf: python tools/g8_uebersicht.py"""
from PIL import Image, ImageDraw
from pathlib import Path
D = Path(__file__).resolve().parent.parent / 'entwurf/probe/g8'; T = ['buechse', 'munition', 'feldscher', 'mahlwerk', 'hauptA']; W, H = 420, 320
o = Image.new('RGB', (100 + 4 * (W + 6), 28 + len(T) * (H + 6)), (24, 20, 18)); d = ImageDraw.Draw(o)
K = [('vorher', 'graben'), ('nachher', 'graben'), ('vorher', 'graben_quer'), ('nachher', 'graben_quer')]
for i, (v, g) in enumerate(K): d.text((100 + i * (W + 6) + 4, 8), f'{v} {"Tiefe" if g == "graben" else "quer"}', fill=(240, 230, 200))
for j, t in enumerate(T):
    d.text((6, 28 + j * (H + 6) + H // 2), t, fill=(240, 230, 200))
    for i, (v, g) in enumerate(K):
        p = D / v / f'{t}_{g}.jpg'
        if p.exists(): im = Image.open(p); cx, cy = im.width // 2, im.height // 2 - 40; o.paste(im.crop((cx - 440, cy - 330, cx + 440, cy + 340)).resize((W, H)), (100 + i * (W + 6), 28 + j * (H + 6)))
o.save(D / 'uebersicht.jpg', quality=86); print(D / 'uebersicht.jpg')
