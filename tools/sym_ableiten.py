"""Abgeleitete Symbole für das Einheiten-Panel (Paket 2, 2026-11-17) → ui-quelle/teile/abgeleitet/, danach tools/panel_assets.py.

- s_stiefel: Stiefel ohne Flügel (normales Ziehen) aus s_marsch (Stiefel mit Flügeln = Marsch/Sprint). Flügel = helle, ungesättigte
  Federn links oben; werden ausgeblendet, der Stiefel bleibt.
- s_garbe: MG-Sperrfeuer als Garbe von Leuchtspuren: drei MG-Leuchtspur-Striche (fx_leuchtspur_2) gefächert aus einem
  Mündungsstern (fx_drehlauf_2). Leuchtende Teile (Schwarzgrund) werden über die Helligkeit deckend gemacht, dazu eine dunkle Tuschekante
  wie bei den übrigen Symbolen.
Aufruf: python tools/sym_ableiten.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
T = ROOT / 'ui-quelle' / 'teile'
OUT = T / 'abgeleitet'


def stiefel():
    im = Image.open(T / 'bogen3b_symbole' / 's_marsch.png').convert('RGBA'); a = np.asarray(im).astype(np.float64)
    rgb, al = a[..., :3], a[..., 3]; H, W = al.shape
    mx, mn = rgb.max(2), rgb.min(2); lum = rgb @ [0.299, 0.587, 0.114]
    feder = (al > 30) & (lum > 95) & ((mx - mn) < 40)
    yy, xx = np.mgrid[0:H, 0:W]
    feder &= (xx < W * 0.62) & (yy < H * 0.72)   # Flügel sitzt links oben am Schaft
    lab, n = ndimage.label(ndimage.binary_dilation(feder, iterations=3))
    if n:
        sz = ndimage.sum(feder, lab, range(1, n + 1)); big = 1 + int(np.argmax(sz))
        wing = ndimage.binary_dilation(lab == big, iterations=2)
        # Flügelfläche ganz: auch die dunklen Federkonturen dazwischen (alles links vom Schaft innerhalb der Flügelhülle)
        hull = ndimage.binary_closing(wing, iterations=6) & ndimage.binary_fill_holes(ndimage.binary_closing(wing, iterations=6))
        boot = (al > 30) & ~hull
        lab2, n2 = ndimage.label(boot); sz2 = ndimage.sum(boot, lab2, range(1, n2 + 1)); keep = lab2 == (1 + int(np.argmax(sz2)))
        al = np.where(keep, al, 0)
    out = np.dstack([rgb, al]).astype(np.uint8); ys, xs = np.nonzero(out[..., 3] > 20)
    out = out[max(0, ys.min() - 4):ys.max() + 5, max(0, xs.min() - 4):xs.max() + 5]
    Image.fromarray(out, 'RGBA').save(OUT / 's_stiefel.png'); print('s_stiefel', out.shape[1], '×', out.shape[0])


def leucht(im):   # Schwarzgrund → deckend: Alpha aus der Helligkeit, Farbe entmischt
    a = np.asarray(im.convert('RGB')).astype(np.float64); al = np.clip(a.max(2) * 1.25, 0, 255)
    rgb = np.clip(a / np.maximum(al[..., None] / 255, 1e-3), 0, 255)
    return Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), 'RGBA')


def garbe():
    E = T / 'effekte'
    spur, stern = leucht(Image.open(E / 'fx_leuchtspur_2.png')), leucht(Image.open(E / 'fx_drehlauf_2.png'))
    W, H = 380, 300; c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ox, oy = 95, H // 2   # Mündung
    L = 250; sp = spur.resize((L, max(1, round(spur.height * L / spur.width * 1.6))), Image.LANCZOS)   # etwas dicker
    import math
    for ang in (22, 0, -22):
        r = sp.rotate(ang, expand=True, resample=Image.BICUBIC); cx, cy = ox + 40 + math.cos(math.radians(ang)) * L / 2, oy - math.sin(math.radians(ang)) * L / 2
        c.alpha_composite(r, (round(cx - r.width / 2), round(cy - r.height / 2)))
    st = stern.resize((170, round(stern.height * 170 / stern.width)), Image.LANCZOS); c.alpha_composite(st, (ox - 85, oy - st.height // 2))
    q = np.asarray(c).astype(np.float64); keep = ndimage.binary_opening(q[..., 3] > 90, iterations=2)
    lab, n = ndimage.label(ndimage.binary_dilation(keep, iterations=4)); sz = ndimage.sum(keep, lab, range(1, n + 1))
    keep &= np.isin(lab, [i + 1 for i in range(n) if sz[i] > keep.sum() * 0.02])   # Krümel weg
    q[..., 3] = np.where(keep, np.maximum(q[..., 3], 200), 0); c = Image.fromarray(q.astype(np.uint8), 'RGBA')
    al = c.getchannel('A'); ink = Image.new('RGBA', c.size, (18, 13, 11, 255)); ink.putalpha(al.filter(ImageFilter.MaxFilter(7)).point(lambda v: 255 if v > 60 else 0))
    out = Image.alpha_composite(ink, c); out = out.crop(out.getbbox())
    out.save(OUT / 's_garbe.png'); print('s_garbe', out.size)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True); stiefel(); garbe()
