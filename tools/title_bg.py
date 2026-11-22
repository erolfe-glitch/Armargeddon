# Erzeugt src/titlebg.js aus ui-quelle/titelbild_neu.png (seit 2026-11-17, 1680 px; vorher Titelbild.webp mit 1024 px): Hintergrund des Startmenüs.
# Lanczos auf 2560 px, danach leicht schärfen (Faktor nur noch 1,5, daher schwächer als beim alten Bild). Seitenverhältnis bleibt,
# das Zuschneiden auf den Bildschirm macht CSS (background-size: cover).
import base64, io, pathlib
from PIL import Image, ImageFilter

root = pathlib.Path(__file__).resolve().parent.parent
QUELLE = 'titelbild_neu.png'
im = Image.open(root / 'ui-quelle' / QUELLE).convert('RGB')
W = 2560
H = round(im.height * W / im.width)
big = im.resize((W, H), Image.LANCZOS)
if im.width < W:   # nur beim Hochskalieren nachschärfen (Flux-Bild vom 2026-11-22 ist 2736 px breit: wird nur verkleinert)
    big = big.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))   # Kanten nach dem Hochskalieren wieder fassen
buf = io.BytesIO()
big.save(buf, 'WEBP', quality=92, method=6)   # feine Tuschlinien nicht verschmieren
data = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
out = root / 'src' / 'titlebg.js'
out.write_text('// ===== ARMARGEDDON TITELBILD =====\n// Erzeugt von tools/title_bg.py aus ui-quelle/' + QUELLE + '. Datendatei, nicht von Hand ändern, nicht komplett lesen.\n'
               f'window.TITLEBG = "{data}";\n', encoding='utf8', newline='\n')
print(out.name, W, 'x', H, len(data) // 1024, 'KB')
