"""F3: zeichnet den berechneten Mündungspunkt (punkte.json aus tools/f3_muendung.mjs) rot in die Standbilder und legt Ausschnitte als Übersicht ab.
Aufruf: python tools/f3_punkt.py <ordner> <ziel.jpg>"""
import sys, json
from pathlib import Path
from PIL import Image, ImageDraw
o = Path(sys.argv[1]); P = json.loads((o / 'punkte.json').read_text()); K = []
for n, p in P.items():
    if not p: continue
    im = Image.open(o / f'{n}.jpg').convert('RGB'); x, y = p
    c = im.crop((int(x) - 150, int(y) - 110, int(x) + 150, int(y) + 110)).resize((600, 440)); d = ImageDraw.Draw(c)
    d.ellipse([294, 214, 306, 226], outline=(255, 30, 30), width=2); d.line([300, 205, 300, 235], fill=(255, 30, 30)); d.line([285, 220, 315, 220], fill=(255, 30, 30)); d.text((6, 6), n, fill=(255, 255, 0)); K.append(c)
sp = 3; z = (len(K) + sp - 1) // sp; B = Image.new('RGB', (sp * 604, z * 444))
for i, c in enumerate(K): B.paste(c, ((i % sp) * 604, (i // sp) * 444))
B.save(sys.argv[2], quality=88); print(len(K), 'Ausschnitte')
