"""W2c-1b (Punkt 151): Übersicht vorher/nachher je Einheit, offen und im Graben (Ausschnitt um die Bildmitte). Aufruf: python tools/w2c1b_uebersicht.py"""
from PIL import Image, ImageDraw
from pathlib import Path
D = Path(__file__).resolve().parent.parent / 'entwurf/probe/w2c1b'; T = ['mahlwerk', 'sense', 'buechse', 'moerser', 'minenwerfer', 'flammen']; W, H = 440, 330
o = Image.new('RGB', (110 + 4 * (W + 6), 30 + len(T) * (H + 6)), (24, 20, 18)); d = ImageDraw.Draw(o)
for i, t in enumerate(['vorher offen', 'nachher offen', 'vorher Graben', 'nachher Graben']): d.text((110 + i * (W + 6) + 4, 8), t, fill=(240, 230, 200))
for j, t in enumerate(T):
    d.text((6, 30 + j * (H + 6) + H // 2), t, fill=(240, 230, 200))
    for i, (v, g) in enumerate([('vorher', 'offen'), ('nachher', 'offen'), ('vorher', 'graben'), ('nachher', 'graben')]):
        p = D / v / f'{t}_{g}.jpg'
        if not p.exists(): continue
        im = Image.open(p); cx, cy = im.width // 2, im.height // 2 + 40
        o.paste(im.crop((cx - 520, cy - 390, cx + 520, cy + 390)).resize((W, H)), (110 + i * (W + 6), 30 + j * (H + 6)))
o.save(D / 'uebersicht.jpg', quality=86); print(D / 'uebersicht.jpg')
