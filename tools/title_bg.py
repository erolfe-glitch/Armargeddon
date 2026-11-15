# Erzeugt src/titlebg.js aus ui-quelle/Titelbild.webp: Hintergrund des Startmenüs.
# Das Bild ist nur 1024 px breit: Lanczos auf 2560 px, danach leicht schärfen. Seitenverhältnis bleibt,
# das Zuschneiden auf den Bildschirm macht CSS (background-size: cover).
import base64, io, pathlib
from PIL import Image, ImageFilter

root = pathlib.Path(__file__).resolve().parent.parent
im = Image.open(root / 'ui-quelle' / 'Titelbild.webp').convert('RGB')
W = 2560
H = round(im.height * W / im.width)
big = im.resize((W, H), Image.LANCZOS)
big = big.filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))   # Kanten nach dem Hochskalieren wieder fassen
buf = io.BytesIO()
big.save(buf, 'WEBP', quality=82, method=6)
data = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
out = root / 'src' / 'titlebg.js'
out.write_text('// ===== ARMARGEDDON TITELBILD =====\n// Erzeugt von tools/title_bg.py aus ui-quelle/Titelbild.webp. Datendatei, nicht von Hand ändern, nicht komplett lesen.\n'
               f'window.TITLEBG = "{data}";\n', encoding='utf8', newline='\n')
print(out.name, W, 'x', H, len(data) // 1024, 'KB')
