"""Neu gemalte Einheitenbilder (Magenta-Hintergrund) freistellen und in src/art.js eintragen.

Aufruf:  python tools/unit_cut.py <schlüssel>:<sh>[:flip] ...
  schlüssel  Bildname in ui-quelle/einheiten_neu/<schlüssel>.png und Schlüssel in art.js (z. B. smoke_A)
  sh         Höhe des sichtbaren Inhalts in Soldatenhöhen (gleicher Wert wie SHT in figures.js)
  flip       Bild spiegeln (Quellbilder müssen nach rechts blicken, STYLE.md)
Bildregeln (STYLE.md): stehender Soldat = 200 px, Füße auf der Grundlinie unten (ay), freigestellt als WebP mit Alpha.
Freistellen wie tools/ui_cut.py (weiches Alpha aus dem Magenta-Anteil, Farbsäume entfärbt), kleine Splitter entfernt.
Prüfbild: ui-quelle/einheiten_neu/vorschau.png
"""
import base64, io, json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ui_cut import key   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle' / 'einheiten_neu'
ART = ROOT / 'src' / 'art.js'
SH_PX = 200


def cut(name, sh, flip):
    rgba = key(Image.open(SRC / f'{name}.png'))
    # Schwachen Schleier (Rest-Schatten, Rauschen) entfernen, sonst zieht er den Zuschnitt auf
    rgba[..., 3] = np.where(rgba[..., 3] > 40, rgba[..., 3], 0)
    a = rgba[..., 3]
    # Splitter entfernen: nur Teile behalten, die mindestens 0,2 % der größten Fläche haben
    lab, n = ndimage.label(ndimage.binary_dilation(a > 40, iterations=2))
    if n > 1:
        size = ndimage.sum(a > 40, lab, range(1, n + 1))
        keep = np.isin(lab, 1 + np.nonzero(size >= size.max() * 0.002)[0])
        rgba[..., 3] = np.where(keep, a, 0)
    im = Image.fromarray(rgba, 'RGBA')
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox())
    H = round(sh * SH_PX)
    im = im.resize((max(1, round(im.width * H / im.height)), H), Image.LANCZOS)
    pad = round(H * 0.025)   # Rand wie bei den übrigen Bildern, Füße bei ay
    out = Image.new('RGBA', (im.width + 2 * pad, H + 2 * pad), (0, 0, 0, 0))
    out.alpha_composite(im, (pad, pad))
    al = np.asarray(out.getchannel('A')).astype(float)
    ys = np.nonzero(al.max(1) > 24)[0]
    y1 = ys.max() + 1
    band = al[max(0, y1 - round(H * 0.15)):y1]   # Standpunkt = Schwerpunkt der untersten 15 %
    cols = band.sum(0)
    ax = float((cols * np.arange(out.width)).sum() / cols.sum()) / out.width
    ay = y1 / out.height
    buf = io.BytesIO()
    out.save(buf, 'WEBP', quality=88, method=6)
    return out, {'src': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(),
                 'hs': round(sh * 1.45, 3), 'ax': round(ax, 3), 'ay': round(ay, 3), 'faces': 'R'}


def main(args):
    s = ART.read_text(encoding='utf-8')
    i = s.index('const ART = ') + len('const ART = ')
    j = s.index('};\nif (root.FIG', i) + 1
    art = json.loads(s[i:j])
    prev = []
    for a in args:
        parts = a.split(':')
        name, sh, flip = parts[0], float(parts[1]), 'flip' in parts[2:]
        im, entry = cut(name, sh, flip)
        art[name] = entry
        prev.append(im)
        print(f'{name}: {im.width}x{im.height}px, ax {entry["ax"]}, ay {entry["ay"]}, {len(entry["src"]) // 1024} KB')
    ART.write_text(s[:i] + json.dumps(art) + s[j:], encoding='utf-8', newline='')
    # Prüfbild auf mittelgrauem Grund
    W = sum(p.width for p in prev) + 20 * (len(prev) + 1)
    Hh = max(p.height for p in prev) + 40
    c = Image.new('RGBA', (W, Hh), (128, 120, 104, 255))
    x = 20
    for p in prev:
        c.alpha_composite(p, (x, Hh - 20 - p.height))
        x += p.width + 20
    c.convert('RGB').save(SRC / 'vorschau.png')


if __name__ == '__main__':
    main(sys.argv[1:])
