"""Neu gemalte Einheitenbilder (Magenta-Hintergrund) in einem Schritt freistellen, normieren, farblich angleichen
und in src/art.js (Bild) und src/figures.js (SHT-Größe) eintragen. Es wird nur einmal komprimiert.

Aufruf:  python tools/unit_cut.py <schlüssel>:<sh>[:flip][:<sätt>,<wärme>,<hell>] ...
  schlüssel  Bildname in ui-quelle/einheiten_neu/<schlüssel>.png und Schlüssel in art.js (z. B. smoke_A)
  sh         Höhe des sichtbaren Inhalts in Soldatenhöhen; wird als SHT in figures.js eingetragen
  flip       Bild spiegeln (Quellbilder müssen nach rechts blicken, STYLE.md)
  sätt,wärme,hell  Farbziel (Mittelwerte über die deckenden Pixel); leere Stelle = nicht ändern, z. B. 0.30,0.056,0.23
             oder 0.30,0.045, . Ohne Angabe gilt das Ziel der Fraktion (FARBE, Endung _A/_D/_F).
Beispiel:  python tools/unit_cut.py mines_D:1 balloon_A:3:flip:0.30,0.056,0.23
Bildregeln (STYLE.md): stehender Soldat = 200 px, Füße auf der Grundlinie unten (ay), freigestellt als WebP mit Alpha.
Freistellen wie tools/ui_cut.py (weiches Alpha aus dem Magenta-Anteil, Farbsäume entfärbt), Schleier und Splitter entfernt.
Farbe wie tools/unit_color.py; der Farbverlust der WebP-Kompression wird vorab ausgeglichen (Ziel nach dem Speichern).
Prüfbild: ui-quelle/einheiten_neu/vorschau.png
"""
import base64, io, json, re, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ui_cut import key              # noqa: E402
from unit_color import correct, stats   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle' / 'einheiten_neu'
ART = ROOT / 'src' / 'art.js'
FIGS = ROOT / 'src' / 'figures.js'
SH_PX = 200
# Farbziel je Fraktion (Sättigung, Wärme R−B, Helligkeit; None = nicht ändern), gemessen am angeglichenen Bestand 11/2026
FARBE = {'A': (0.36, 0.066, None), 'D': (0.30, 0.045, None), 'F': None}
WEBP = dict(quality=88, method=6)


def encode(rgb, al):
    out = Image.fromarray((np.dstack([rgb, al]) * 255).round().clip(0, 255).astype(np.uint8), 'RGBA')
    buf = io.BytesIO()
    out.save(buf, 'WEBP', **WEBP)
    return out, buf.getvalue()


def colorize(out, target):
    """Farbe angleichen; Ziel gilt für das gespeicherte WebP (Abweichung durch Kompression wird nachgeregelt)."""
    px = np.asarray(out).astype(np.float64) / 255
    rgb, al = px[..., :3], px[..., 3]
    m = al > 0.5
    if not target or all(t is None for t in target):
        return (*encode(rgb, al), stats(rgb, m))
    names = ['sätt', 'wärme', 'hell']
    adj = list(target)
    for _ in range(4):
        args = (adj[0], adj[1], adj[2])
        im, data = encode(correct(rgb, m, *args), al)
        back = np.asarray(Image.open(io.BytesIO(data)).convert('RGBA')).astype(np.float64) / 255
        got = stats(back[..., :3], back[..., 3] > 0.5)
        err = [None if t is None else t - got[n] for t, n in zip(target, names)]
        if all(e is None or abs(e) < 0.004 for e in err):
            break
        adj = [a if e is None else a + e for a, e in zip(adj, err)]
    return im, data, got


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
    return out, {'hs': round(sh * 1.45, 3), 'ax': round(ax, 3), 'ay': round(ay, 3), 'faces': 'R'}


def set_sht(text, name, sh):
    v = f'{sh:g}'
    pat = re.compile(r'(\b' + re.escape(name) + r': )[0-9.]+')
    if pat.search(text):
        return pat.sub(lambda m: m.group(1) + v, text, count=1), True
    return text, False


def main(args):
    sys.stdout.reconfigure(encoding='utf-8')
    s = ART.read_text(encoding='utf-8')
    i = s.index('const ART = ') + len('const ART = ')
    j = s.index('};\nif (root.FIG', i) + 1
    art = json.loads(s[i:j])
    figs = FIGS.read_text(encoding='utf-8')
    prev = []
    for a in args:
        parts = a.split(':')
        name, sh = parts[0], float(parts[1])
        flip = 'flip' in parts[2:]
        col = [p for p in parts[2:] if ',' in p]
        target = tuple(float(v) if v.strip() not in ('', '.') else None for v in (col[0].split(',') + ['', '', ''])[:3]) if col \
            else FARBE.get(name.rsplit('_', 1)[-1])
        out, entry = cut(name, sh, flip)
        im, data, got = colorize(out, target)
        art[name] = {'src': 'data:image/webp;base64,' + base64.b64encode(data).decode(), **entry}
        figs, ok = set_sht(figs, name, sh)
        prev.append(im)
        print(f'{name}: {im.width}x{im.height}px, ax {entry["ax"]}, ay {entry["ay"]}, {len(data) // 1024} KB, '
              + ' '.join(f'{k} {v:.3f}' for k, v in got.items()) + ('' if ok else '  !! SHT fehlt in figures.js, bitte von Hand eintragen'))
    ART.write_text(s[:i] + json.dumps(art) + s[j:], encoding='utf-8', newline='')
    FIGS.write_text(figs, encoding='utf-8', newline='')
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
