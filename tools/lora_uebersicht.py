"""W2a (Punkt 147): Übersicht Mühle – mit LoRA – ohne LoRA – bisheriger Baustein je Probe. Aufruf: python tools/lora_uebersicht.py → entwurf/probe/stil/lora_gelaende.jpg"""
from PIL import Image, ImageDraw
from pathlib import Path
R = Path(__file__).resolve().parent.parent; S = R / 'entwurf/probe/stil'; G = R / 'ui-quelle/teile/gelaende'
ZEILEN = [('Laubbaum', 'laubbaum', 'wald_stamm_1.png'), ('Tanne', 'tanne', 'tanne_schnee_1.png'), ('Totholz', 'totholz', 'baum_tot_schnee_1.png'), ('Haus', 'haus', 'haus_heil_1.png'), ('Zaun', 'zaun', 'zaun.png')]
Z = 300
def kachel(p):
    k = Image.new('RGB', (Z, Z), (40, 34, 30))
    if p and Path(p).exists():
        im = Image.open(p).convert('RGBA'); im.thumbnail((Z - 10, Z - 10)); b = Image.new('RGBA', (Z, Z), (40, 34, 30, 255)); b.alpha_composite(im, ((Z - im.width) // 2, (Z - im.height) // 2)); k = b.convert('RGB')
    return k
kopf = ['Mühle (Vorbild)', 'mit LoRA', 'ohne LoRA (Nano Banana)', 'bisheriger Baustein']
o = Image.new('RGB', (4 * (Z + 8) + 120, 40 + len(ZEILEN) * (Z + 8)), (24, 20, 18)); d = ImageDraw.Draw(o)
for i, t in enumerate(kopf): d.text((120 + i * (Z + 8) + 6, 12), t, fill=(240, 230, 200))
for j, (n, k, alt) in enumerate(ZEILEN):
    y = 40 + j * (Z + 8); d.text((8, y + Z // 2), n, fill=(240, 230, 200))
    for i, p in enumerate([R / 'entwurf/lora_gelaende/K01.png', S / f'mit_{k}.png', S / f'ohne_{k}.png', G / alt]):
        o.paste(kachel(p), (120 + i * (Z + 8), y))
o.save(S / 'lora_gelaende.jpg', quality=88); print(S / 'lora_gelaende.jpg')
