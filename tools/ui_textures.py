"""Schneidet die kachelbaren UI-Texturen aus ui-quelle/texturen_ui.png (2×2, getrennt durch Magenta-Linien)
und macht sie nahtlos: oben links Bronze, oben rechts Rost-Eisen, unten links Holz, unten rechts Pergament.

Aufruf:  python tools/ui_textures.py   (Texturen und Rahmen für 9-Slice, danach tools/panel_assets.py)
Ergebnis: ui-quelle/teile/texturen/<name>.png (Prüfbild: texturen/_kachel_2x2.png) und die Einträge t_<name>
in src/uipanel.js (über tools/panel_assets.py, das die Dateien einbettet). Danach python tools/build.py.

Schritte je Textur:
1. Magenta-Rand großzügig abschneiden.
2. Große Helligkeitsflecken ausgleichen: Helligkeit durch einen sehr weichen Mittelwert teilen (nur die groben Wolken,
   feine Struktur bleibt), damit beim Wiederholen kein Muster aus hellen und dunklen Flecken entsteht.
3. Nahtlos: um eine halbe Kachel verschieben und die Kanten über einen breiten, weichen Streifen mit dem Original
   überblenden – erst waagrecht, dann senkrecht. Holz: nur waagrecht überblenden, senkrecht wird auf ein Vielfaches
   des Bretterabstands zugeschnitten (sonst doppelte Fugen).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle' / 'texturen_ui.png'
OUT = ROOT / 'ui-quelle' / 'teile' / 'texturen'
NAMES = [['bronze', 'eisen'], ['holz', 'pergament']]
# Stärke des Fleckenausgleichs (0 = aus, 1 = ganz flach) und Breite des Überblendstreifens (Anteil der Kachel)
# (Stärke, Weichheit): Weichheit = Kachelgröße / Teiler; kleinerer Teiler = nur sehr große Flecken
FLAT = {'bronze': (0.95, 14), 'eisen': (0.8, 10), 'holz': (0.5, 6), 'pergament': (0.75, 10)}
BLEND = 0.22


def magenta_mask(a):
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    return (r > 180) & (b > 180) & (g < 110)


def find_lines(a):
    m = magenta_mask(a)
    cols = np.where(m.mean(axis=0) > 0.5)[0]
    rows = np.where(m.mean(axis=1) > 0.5)[0]
    return cols, rows


def cut(a):
    cols, rows = find_lines(a)
    H, W = a.shape[:2]
    cx0, cx1 = cols.min(), cols.max()
    ry0, ry1 = rows.min(), rows.max()
    pad = 6   # Magenta-Säume und Kantenschärfe sicher wegnehmen
    boxes = {
        (0, 0): (pad, pad, cx0 - pad, ry0 - pad),
        (0, 1): (cx1 + 1 + pad, pad, W - pad, ry0 - pad),
        (1, 0): (pad, ry1 + 1 + pad, cx0 - pad, H - pad),
        (1, 1): (cx1 + 1 + pad, ry1 + 1 + pad, W - pad, H - pad),
    }
    out = {}
    for (i, j), (x0, y0, x1, y1) in boxes.items():
        t = a[y0:y1, x0:x1].astype(np.float64)
        # Restlicher Magenta-Saum an den Rändern: so lange Zeilen/Spalten weg, wie noch Magenta drin ist
        while magenta_mask(t[:1]).any(): t = t[1:]
        while magenta_mask(t[-1:]).any(): t = t[:-1]
        while magenta_mask(t[:, :1]).any(): t = t[:, 1:]
        while magenta_mask(t[:, -1:]).any(): t = t[:, :-1]
        out[NAMES[i][j]] = t
    return out


def flatten(t, kd):
    """Grobe Helligkeitswolken ausgleichen: Luminanz durch weichen Mittelwert teilen (Farbe bleibt)."""
    k, div = kd
    if k <= 0:
        return t
    lum = t @ np.array([0.299, 0.587, 0.114])
    sig = max(t.shape[:2]) / div
    low = gaussian_filter(lum, sig, mode='wrap')
    gain = (lum.mean() / np.maximum(low, 1)) ** k
    return np.clip(t * gain[..., None], 0, 255)


# Mittelgroße Flecken (auffällige Wolken, die beim Wiederholen ein Raster bilden) abschwächen; feine Körnung bleibt.
# Wert = Anteil der Fleckenstärke, der bleibt (1 = unverändert).
MID = {'bronze': 0.35, 'eisen': 0.45, 'holz': 1.0, 'pergament': 0.4}


def soften(t, keep, sig=10):
    if keep >= 1:
        return t
    base = gaussian_filter(t, (sig, sig, 0), mode='wrap')
    mean = t.reshape(-1, 3).mean(axis=0)
    return np.clip(mean + (base - mean) * keep + (t - base), 0, 255)


def ramp(n, frac):
    """Gewicht 0 an den Kanten, 1 in der Mitte, weicher Übergang über frac der Länge."""
    x = np.arange(n) + 0.5
    d = np.minimum(x, n - x) / (n * frac)
    d = np.clip(d, 0, 1)
    return d * d * (3 - 2 * d)   # smoothstep


def seamless(t, axis):
    n = t.shape[axis]
    rolled = np.roll(t, n // 2, axis=axis)
    w = ramp(n, BLEND)
    w = w[:, None, None] if axis == 0 else w[None, :, None]
    # Kante kommt aus der verschobenen Kopie (dort liegt die Kachelmitte → stetig über den Umbruch),
    # Mitte aus dem Original (dort liegt die Naht der Kopie)
    return t * w + rolled * (1 - w)


def plank_period(t):
    """Bretterabstand des Holzes über die Autokorrelation des senkrechten Helligkeitsverlaufs."""
    prof = (t @ np.array([0.299, 0.587, 0.114])).mean(axis=1)
    prof = prof - gaussian_filter(prof, 30)
    ac = np.correlate(prof, prof, 'full')[len(prof) - 1:]
    lo = 40
    return lo + int(np.argmax(ac[lo:len(prof) // 2]))


def seam_error(t):
    """Mittlerer Farbsprung über die Kachelkanten im Vergleich zum Sprung zwischen Nachbarpixeln innen."""
    inner = np.abs(np.diff(t, axis=1)).mean() + np.abs(np.diff(t, axis=0)).mean()
    edge = np.abs(t[:, 0] - t[:, -1]).mean() + np.abs(t[0] - t[-1]).mean()
    return edge / inner


def main():
    a = np.asarray(Image.open(SRC).convert('RGB'))
    tiles = cut(a)
    OUT.mkdir(parents=True, exist_ok=True)
    check = []
    for name, t in tiles.items():
        before = seam_error(t)
        if name == 'holz':
            p = plank_period(t)
            h = (t.shape[0] // p) * p
            t = t[:h]
            t = flatten(t, FLAT[name])
            t = seamless(t, 1)
            # senkrecht: schmaler Übergang, Fugen liegen dank Zuschnitt schon an gleicher Stelle
            n = t.shape[0]; w = ramp(n, 0.08)[:, None, None]
            t = t * w + np.roll(t, n // 2, axis=0) * (1 - w) if seam_error(t) > 1.6 else t
        else:
            t = soften(flatten(t, FLAT[name]), MID[name])
            t = seamless(seamless(t, 1), 0)
        after = seam_error(t)
        im = Image.fromarray(np.clip(t + 0.5, 0, 255).astype(np.uint8))
        im.save(OUT / f'{name}.png')
        print(f'{name:10s} {im.size[0]}×{im.size[1]}  Kantensprung vorher {before:.2f}, nachher {after:.2f} (1 = wie innen)')
        check.append(im)
    # Prüfbild: jede Textur 2×2 gekachelt, Nähte müssen unsichtbar sein
    W = max(i.width for i in check) * 2
    sheet = Image.new('RGB', (W * 2 + 10, sum(i.height for i in check[:2]) * 2 + 10), (255, 0, 255))
    for k, im in enumerate(check):
        tile = Image.new('RGB', (im.width * 2, im.height * 2))
        for dx in (0, 1):
            for dy in (0, 1):
                tile.paste(im, (dx * im.width, dy * im.height))
        sheet.paste(tile, ((k % 2) * (W + 10), (k // 2) * (check[0].height * 2 + 10)))
    sheet.save(OUT / '_kachel_2x2.png')




# ---------- Rahmen für 9-Slice: Rahmen und Ecken aus dem UI-Bogen, Innenfläche durchsichtig ----------
# Darunter liegt im Spiel die gekachelte Textur. (Teil, Rand in px, feste Ecke in px oder 0, weiche Kante in px)
FRAMES = {
    'rahmen9': ('bogen1_rahmen/rahmen_quadrat', 62, 0, 0),     # Menüs: Rost-Eisenrahmen mit Nieten
    'tafel9': ('bogen1_rahmen/tafel_messing', 45, 100, 0),      # Knöpfe/Tafeln: Eisenrand, Messingecken
    'leiste9': ('bogen1_rahmen/leiste_holz', 64, 0, 0),         # Panels: Eisenband mit Nieten und Mittelplatten
    'perg9': ('bogen1_rahmen/pergament_klein', 46, 0, 22),      # Tooltips: ausgefranster Rand, Mitte weich ins Gekachelte
}


def frames():
    T = ROOT / 'ui-quelle' / 'teile'
    for name, (part, band, corner, feather) in FRAMES.items():
        a = np.asarray(Image.open(T / f'{part}.png').convert('RGBA')).astype(np.float64)
        H, W = a.shape[:2]
        yy, xx = np.mgrid[0:H, 0:W]
        d = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy]).astype(np.float64)   # Abstand zum nächsten Rand
        if name == 'leiste9':   # Mittelplatten oben und unten ragen tiefer hinein: dort Band breiter
            dy = np.minimum(yy, H - 1 - yy).astype(np.float64); dx = np.minimum(xx, W - 1 - xx).astype(np.float64)
            plate = np.abs(xx - W / 2) < W * 0.2
            d = np.where(plate, np.minimum(dx, dy - 8), d)
        keep = d < band if not feather else np.clip((band + feather - d) / feather, 0, 1)
        keep = keep.astype(np.float64)
        if corner:   # Messingecken behalten: in den Eckquadraten alles, was nicht schiefergrau ist
            rgb = a[..., :3]; sat = rgb.max(axis=2) - rgb.min(axis=2); lum = rgb.mean(axis=2)
            slate = (sat < 20) & (lum > 18) & (lum < 80)
            cz = ((xx < corner) | (xx > W - 1 - corner)) & ((yy < corner) | (yy > H - 1 - corner))
            keep = np.where(cz & ~slate, 1.0, keep)
        a[..., 3] *= keep
        im = Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8), 'RGBA')
        im.save(OUT / f'{name}.png')
        print(f'{name:10s} {W}×{H}  Rand {band} px')


if __name__ == '__main__':
    main()
    frames()
