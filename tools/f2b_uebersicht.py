# F2b (Punkt 133): Übersichten aus den Paarbildern von tools/f2b_bilder.mjs. Aufruf: python tools/f2b_uebersicht.py [ordner]
import sys, os
from PIL import Image, ImageDraw, ImageFont
B = sys.argv[1] if len(sys.argv) > 1 else 'entwurf/probe/f2b'
FUE = ['konkordat_hauptA', 'konkordat_generalA', 'aschenwacht_hauptD', 'aschenwacht_generalD']
REST = ['konkordat_mahlwerk', 'konkordat_feldscher', 'konkordat_munition', 'konkordat_fernsprech', 'aschenwacht_sense', 'aschenwacht_buechse', 'aschenwacht_heiler', 'aschenwacht_werkstatt']
def raster(namen, ordner, sp, ziel, titel):
    ims = [Image.open(f'{B}/{ordner}/{n}.jpg') for n in namen]; w, h = ims[0].size; w2, h2 = w // 2, h // 2
    z = (len(ims) + sp - 1) // sp; c = Image.new('RGB', (w2 * sp, h2 * z + 34), (24, 20, 16)); d = ImageDraw.Draw(c)
    try: f = ImageFont.truetype('arial.ttf', 22)
    except Exception: f = ImageFont.load_default()
    d.text((10, 5), titel, fill=(236, 222, 198), font=f)
    for i, im in enumerate(ims): c.paste(im.resize((w2, h2), Image.LANCZOS), ((i % sp) * w2, 34 + (i // sp) * h2))
    c.save(ziel, quality=90); print(ziel, c.size)
for o, t in [('vorher', 'vorher'), ('nachher', 'nachher')]:
    if not os.path.isdir(f'{B}/{o}'): continue
    raster(FUE, o, 2, f'{B}/{o}_uebersicht.jpg', f'F2b Führung neben der Linie – {t}')
    raster(REST, o, 4, f'{B}/{o}_uebrige.jpg', f'F2b übrige Gruppen neben der Linie – {t}')
