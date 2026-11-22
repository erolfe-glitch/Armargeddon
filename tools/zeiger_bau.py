"""Gemalte Mauszeiger (Enrico 2026-11-22 15:53): aus ui-quelle/teile/bogen_zeiger/z_*.png (ui_cut.py) 32-px-Zeiger mit 64-px-Fassung
für hochauflösende Bildschirme bauen, Klickpunkt je Zeiger bestimmen und als src/zeiger.js einbetten (window.ZEIGER).

- 32 px ist die sichere Größe: Windows zeigt größere CSS-Zeiger nicht überall an; über image-set wird auf 2×-Bildschirmen die 64-px-Fassung genommen.
- Sperrkreis waagerecht gespiegelt (Balken von oben links nach unten rechts).
- Drahtschere: nur die großen zusammenhängenden Teile (das kleine Fremdteil rechts fällt weg).
- Feld-Zielring: Gemini malte ein Siebeneck; maskiert auf ein Sechseck mit Spitzen links und rechts wie unsere Felder, Rand nachgezogen.
Aufruf: python tools/zeiger_bau.py   (danach tools/build.py)
"""
import base64, io, json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle' / 'teile' / 'bogen_zeiger'
OUT = ROOT / 'src' / 'zeiger.js'
PROBE = ROOT / 'entwurf' / 'probe' / 'zeiger'
# Name im Spiel: (Datei, Klickpunkt)  ol = oben links, ul = unten links, mitte
ZEIGER = {
    'pfeil': ('z_pfeil', 'ol'), 'hand': ('z_hand', 'ol'), 'stiefel': ('z_stiefel', 'ul'), 'ziel': ('z_ziel', 'mitte'),
    'saebel': ('z_saebel', 'ol'), 'nein': ('z_nein', 'mitte'), 'feld': ('z_feld', 'mitte'), 'schere': ('z_schere', 'ol'),
}


def nur_grosse_teile(im, anteil=0.08):
    a = np.array(im)[..., 3] > 30
    lab, n = ndimage.label(a)
    if n <= 1:
        return im
    groesse = ndimage.sum(a, lab, range(1, n + 1))
    behalten = [i + 1 for i, g in enumerate(groesse) if g >= groesse.max() * anteil]
    m = np.isin(lab, behalten)
    arr = np.array(im)
    arr[..., 3] = np.where(m, arr[..., 3], 0)
    return Image.fromarray(arr)


def sechseck(im):
    w, h = im.size
    cx, cy, r = w / 2, h / 2, min(w, h) * 0.5
    pts = [(cx + r * np.cos(np.pi / 3 * i), cy + r * 0.9 * np.sin(np.pi / 3 * i)) for i in range(6)]
    maske = Image.new('L', im.size, 0)
    ImageDraw.Draw(maske).polygon(pts, fill=255)
    arr = np.array(im)
    arr[..., 3] = np.minimum(arr[..., 3], np.array(maske))
    out = Image.fromarray(arr)
    ImageDraw.Draw(out).line(pts + [pts[0]], fill=(18, 13, 11, 255), width=max(4, int(min(w, h) * 0.025)))   # Rand nachziehen
    return out


def einpassen(im, n):
    bb = im.getbbox()
    im = im.crop(bb)
    rand = max(1, round(n * 0.04))
    k = (n - 2 * rand) / max(im.size)
    neu = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    c = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    c.alpha_composite(neu, ((n - neu.width) // 2, (n - neu.height) // 2))
    return c


def klickpunkt(im, art):
    a = np.array(im)[..., 3] > 128
    ys, xs = np.nonzero(a)
    if art == 'mitte':
        return int(round((xs.min() + xs.max()) / 2)), int(round((ys.min() + ys.max()) / 2))
    i = np.argmin(xs + ys) if art == 'ol' else np.argmin(xs + (im.height - ys))
    return int(xs[i]), int(ys[i])


def daten(im):
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def main():
    PROBE.mkdir(parents=True, exist_ok=True)
    out = {}
    for name, (datei, art) in ZEIGER.items():
        im = Image.open(SRC / (datei + '.png')).convert('RGBA')
        if name == 'nein':
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        if name == 'schere':
            im = nur_grosse_teile(im)
        if name == 'feld':
            im = sechseck(im)
        z1, z2 = einpassen(im, 32), einpassen(im, 64)
        x, y = klickpunkt(z1, art)
        out[name] = {'a': daten(z1), 'b': daten(z2), 'x': x, 'y': y}
        z2.save(PROBE / f'{name}_64.png')
        print(f'{name:8s} Klickpunkt {x},{y} ({art})')
    kopf = '// Gemalte Mauszeiger (erzeugt mit tools/zeiger_bau.py aus ui-quelle/bogen_zeiger.png – nicht von Hand ändern)\n'
    OUT.write_text(kopf + 'window.ZEIGER = ' + json.dumps(out) + ';\n', encoding='utf-8', newline='\n')
    print(OUT, round(OUT.stat().st_size / 1024), 'KB')


if __name__ == '__main__':
    main()
