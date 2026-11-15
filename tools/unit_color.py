"""Farbkorrektur für Einheitenbilder in src/art.js (Bildregeln STYLE.md: Sättigung 0,25–0,40, Helligkeit 0,18–0,25).

Aufruf:  python tools/unit_color.py [--dry] <schlüssel>=<sätt>[,<wärme>[,<hell>]] ...
  sätt   Ziel-Mittelwert der Sättigung (z. B. 0.36)
  wärme  Ziel-Mittelwert R−B (z. B. 0.07); weglassen = unverändert
  hell   Ziel-Mittelwert der Helligkeit (z. B. 0.23); weglassen = unverändert
  --dry  nur messen und anzeigen, nichts schreiben
Ohne Ziel (nur <schlüssel>) wird nur gemessen. Gemessen wird über die deckenden Pixel (Alpha > 0,5).
Methode: Weißabgleich (R×(1+w), B×(1−w)) für die Wärme, Farbanteil um die Helligkeit skaliert für die Sättigung,
Helligkeit per Gamma; die Faktoren werden mit Halbierungssuche bestimmt. Konturen bleiben dunkel, Alpha unverändert.
"""
import base64, io, json, sys
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / 'src' / 'art.js'
LW = np.array([0.299, 0.587, 0.114])


def stats(rgb, m):
    l = rgb @ LW
    mx, mn = rgb.max(2), rgb.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    return {'hell': l[m].mean(), 'sätt': sat[m].mean(), 'wärme': (rgb[..., 0] - rgb[..., 2])[m].mean()}


def solve(f, target, lo, hi):   # f steigend
    for _ in range(40):
        mid = (lo + hi) / 2
        if f(mid) < target: lo = mid
        else: hi = mid
    return (lo + hi) / 2


def warm(rgb, w):
    out = rgb * np.array([1 + w, 1, 1 - w])
    l0, l1 = rgb @ LW, out @ LW
    return np.clip(out * (l0 / np.maximum(l1, 1e-6))[..., None], 0, 1)


def satur(rgb, k):
    l = (rgb @ LW)[..., None]
    return np.clip(l + (rgb - l) * k, 0, 1)


def bright(rgb, g):   # g > 1 heller
    return np.clip(rgb, 0, 1) ** (1 / g)


def correct(rgb, m, sat=None, wa=None, he=None):
    if he is not None:
        g = solve(lambda g: stats(bright(rgb, g), m)['hell'], he, 0.3, 3)
        rgb = bright(rgb, g)
    if wa is not None:
        w = solve(lambda w: stats(warm(rgb, w), m)['wärme'], wa, -0.6, 0.6)
        rgb = warm(rgb, w)
    if sat is not None:
        k = solve(lambda k: stats(satur(rgb, k), m)['sätt'], sat, 0, 3)
        rgb = satur(rgb, k)
    return rgb


def main(args):
    sys.stdout.reconfigure(encoding='utf-8')
    dry = '--dry' in args
    args = [a for a in args if a != '--dry']
    s = ART.read_text(encoding='utf-8')
    i = s.index('const ART = ') + len('const ART = ')
    j = s.index('};\nif (root.FIG', i) + 1
    art = json.loads(s[i:j])
    for a in args:
        key, _, tg = a.partition('=')
        vals = [float(v) if v else None for v in tg.split(',')] if tg else []
        vals += [None] * (3 - len(vals))
        im = Image.open(io.BytesIO(base64.b64decode(art[key]['src'].split(',', 1)[1]))).convert('RGBA')
        px = np.asarray(im).astype(np.float64) / 255
        rgb, al = px[..., :3], px[..., 3]
        m = al > 0.5
        before = stats(rgb, m)
        line = f"{key:11s} vorher " + ' '.join(f"{k} {v:.3f}" for k, v in before.items())
        if any(v is not None for v in vals):
            rgb = correct(rgb, m, *vals)
            after = stats(rgb, m)
            line += '  ->  ' + ' '.join(f"{k} {v:.3f}" for k, v in after.items())
            if not dry:
                out = Image.fromarray(np.dstack([rgb, al]).__mul__(255).round().clip(0, 255).astype(np.uint8), 'RGBA')
                buf = io.BytesIO()
                out.save(buf, 'WEBP', quality=88, method=6)
                art[key]['src'] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
        print(line)
    if not dry:
        ART.write_text(s[:i] + json.dumps(art) + s[j:], encoding='utf-8', newline='')


if __name__ == '__main__':
    main(sys.argv[1:])
