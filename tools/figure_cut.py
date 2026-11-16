"""Stellt Figurenbögen frei: 2×2 Posen auf Magenta (ui-quelle/figuren/<name>.png) → entwurf/probe/fig/<name>_<n>.png.

Aufruf:  python tools/figure_cut.py [name ...]     (ohne Namen: alle Bögen in ui-quelle/figuren/)
- Magenta wird über den Abstand zur Schlüsselfarbe weich ausgeblendet, der Magenta-Saum an der Kante entfärbt (despill).
- Jede Pose wird auf ihren Inhalt zugeschnitten, Füße unten bündig (gleiche Grundlinie), höchste Kante = 1 Soldatenhöhe.
- Mündungsfeuer im Bild wird entfernt (helle Gelb-/Orangetöne vor der Laufmündung), Effekte kommen später aus dem Spiel.
Nummerierung der Posen: 1 oben links, 2 oben rechts, 3 unten links, 4 unten rechts.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle' / 'figuren'
OUT = ROOT / 'entwurf' / 'probe' / 'fig'
H_OUT = 320   # Höhe der stehenden Pose in px (Probebild; im Spiel später nach STYLE.md)


def key(a):
    rgb = a[..., :3].astype(np.float64)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    # Magenta-Anteil: viel Rot und Blau, wenig Grün
    m = np.clip((np.minimum(r, b) - g - 60) / 90, 0, 1)
    alpha = 1 - m
    # Saum entfärben: wo noch Magenta drinsteckt, Rot/Blau auf Grün-Niveau ziehen
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (1 - alpha * 0.3)
    k = np.clip(spill / 255, 0, 1)
    rgb[..., 0] -= spill * 0.55 * k * 2
    rgb[..., 2] -= spill * 0.75 * k * 2
    out = np.dstack([np.clip(rgb, 0, 255), alpha * 255])
    return out


def remove_flash(q):
    """Mündungsfeuer: sehr helle, gelb-orange Pixel (und ihr Schein) entfernen."""
    rgb = q[..., :3]; r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    hot = (r > 200) & (g > 110) & (b < 170) & (r - b > 70)
    if hot.sum() < 30:
        return q, 0
    lab, n = ndimage.label(ndimage.binary_dilation(hot, iterations=3))
    sizes = ndimage.sum(hot, lab, range(1, n + 1))
    big = 1 + int(np.argmax(sizes))
    if sizes[big - 1] < 250:   # kleine helle Stellen sind die Gläser der Gasmaske, kein Mündungsfeuer
        return q, 0
    zone = ndimage.binary_dilation(lab == big, iterations=6)
    # nur heller Schein und Flamme weg, dunkle Laufkontur bleibt
    lum = rgb.mean(axis=2)
    kill = zone & ((lum > 95) | hot)
    q = q.copy(); q[kill, 3] = 0
    return q, int(kill.sum())


def cut(name):
    a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB'))
    H, W = a.shape[:2]
    k = key(a)
    poses = []
    for i, (y0, x0) in enumerate([(0, 0), (0, W // 2), (H // 2, 0), (H // 2, W // 2)], 1):
        q = k[y0:y0 + H // 2, x0:x0 + W // 2]
        q, fl = remove_flash(q)
        al = q[..., 3] > 40
        lab, n = ndimage.label(al)
        if n:   # nur die größte Figur behalten (Krümel und Reste weg)
            sizes = ndimage.sum(al, lab, range(1, n + 1)); keep = lab == (1 + int(np.argmax(sizes)))
            keep = ndimage.binary_dilation(keep, iterations=2)
            q[~keep, 3] = 0
        ys, xs = np.where(q[..., 3] > 40)
        q = q[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        poses.append((i, q, fl))
    hmax = max(p[1].shape[0] for p in poses)   # stehende Pose = höchste
    s = H_OUT / hmax
    OUT.mkdir(parents=True, exist_ok=True)
    for i, q, fl in poses:
        im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im.save(OUT / f'{name}_{i}.png')
        print(f'{name}_{i}: {im.width}×{im.height}' + (f'  (Mündungsfeuer entfernt: {fl} px)' if fl else ''))


if __name__ == '__main__':
    names = sys.argv[1:] or [p.stem for p in SRC.glob('*.png')]
    for n in names:
        cut(n)
