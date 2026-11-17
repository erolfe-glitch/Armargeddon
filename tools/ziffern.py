"""Eigene kantige Ziffernschriften für Armargeddon (Paket 2, 2026-11-17) – ohne fremde Schriftdateien.

Ziffern 0–9 und die Zeichen % + − - × / : , . (Leerzeichen) werden aus geraden Strichen auf einem Raster (Breite 4, Höhe 7)
gebaut und als TrueType gespeichert: ui-quelle/schriften/ArmZiffern-<Stil>.ttf. Drei Stile zum Vergleich (entwurf/probe/ziffern.html):
  Gebrochen  – blackletter-nah: dicke Senkrechten, dünne Waagerechten, Rautenköpfe an freien Enden, schräge Brüche an den Ecken
  Schablone  – gleich dicke Striche, an jeder Ecke ein Steg (Lücke) wie gesprühte Schablonenziffern
  Kantig     – schmal, achteckig, gleich dick, harte Ecken
Aufruf: python tools/ziffern.py   (danach tools/fonts.py, tools/build.py)
"""
import math
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'ui-quelle' / 'schriften'

# Linienzüge je Zeichen (x 0–4, y 0–7, y nach oben)
O8 = [(1, 0), (3, 0), (4, 1), (4, 6), (3, 7), (1, 7), (0, 6), (0, 1), (1, 0)]
SK = {
    '0': [O8],
    '1': [[(0.9, 5.6), (2.4, 7), (2.4, 0)], [(1.0, 0), (3.8, 0)]],
    '2': [[(0, 6), (1, 7), (3, 7), (4, 6), (4, 4.6), (0, 0.6), (0, 0), (4, 0)]],
    '3': [[(0, 6), (1, 7), (3, 7), (4, 6), (4, 4.6), (3, 3.6), (1.4, 3.6)], [(3, 3.6), (4, 2.6), (4, 1), (3, 0), (1, 0), (0, 1)]],
    '4': [[(2.9, 0), (2.9, 7), (0, 2.3), (0, 1.8), (4, 1.8)]],
    '5': [[(4, 7), (0.3, 7), (0, 3.7), (3, 4.1), (4, 3.1), (4, 1), (3, 0), (1, 0), (0, 1)]],
    '6': [[(3.8, 6.4), (3, 7), (1, 7), (0, 6), (0, 1), (1, 0), (3, 0), (4, 1), (4, 3), (3, 4), (0, 4)]],
    '7': [[(0, 6), (0, 7), (4, 7), (4, 6), (1.6, 0)]],
    '8': [[(1, 3.6), (0, 4.6), (0, 6), (1, 7), (3, 7), (4, 6), (4, 4.6), (3, 3.6), (1, 3.6), (0, 2.6), (0, 1), (1, 0), (3, 0), (4, 1), (4, 2.6), (3, 3.6)]],
    '9': [[(0.2, 0.6), (1, 0), (3, 0), (4, 1), (4, 6), (3, 7), (1, 7), (0, 6), (0, 4), (1, 3), (4, 3)]],
    '%': [[(0.6, 6.6), (0.6, 5.4)], [(3.4, 1.6), (3.4, 0.4)], [(0.6, 0), (3.4, 7)]],
    '+': [[(0.4, 3.5), (3.6, 3.5)], [(2, 1.9), (2, 5.1)]],
    '−': [[(0.5, 3.5), (3.5, 3.5)]],
    '-': [[(0.8, 3.3), (3.2, 3.3)]],
    '×': [[(0.8, 2.1), (3.2, 4.9)], [(0.8, 4.9), (3.2, 2.1)]],
    '/': [[(0.5, -0.2), (3.5, 7.2)]],
    ':': [[(2, 1.0), (2, 1.6)], [(2, 4.6), (2, 5.2)]],
    '.': [[(2, 0.05), (2, 0.65)]],
    ',': [[(2.3, 0.7), (1.6, -1.0)]],
}
WIDTH = {':': 2.2, '.': 2.0, ',': 2.0, '1': 4}   # schmale Zeichen (Rasterbreite)
NAMES = {'0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
         '%': 'percent', '+': 'plus', '−': 'minus', '-': 'hyphen', '×': 'multiply', '/': 'slash', ':': 'colon', '.': 'period', ',': 'comma', ' ': 'space'}


def quad(p, q, t, cap):
    (x1, y1), (x2, y2) = p, q; dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1e-6; ux, uy = dx / L, dy / L; nx, ny = -uy * t / 2, ux * t / 2
    x1 -= ux * cap; y1 -= uy * cap; x2 += ux * cap; y2 += uy * cap
    return [(x1 + nx, y1 + ny), (x2 + nx, y2 + ny), (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)]


def achteck(p, r):   # Gelenk an Ecken: kantig geschlossen, ohne überstehende Spitzen
    x, y = p; k = r * 0.414; return [(x - k, y + r), (x + k, y + r), (x + r, y + k), (x + r, y - k), (x + k, y - r), (x - k, y - r), (x - r, y - k), (x - r, y + k)]


def raute(p, r):
    x, y = p; return [(x, y + r), (x + r * 0.8, y), (x, y - r), (x - r * 0.8, y)]


def stil_gebrochen(lines):
    polys = []
    for ln in lines:
        closed = ln[0] == ln[-1]
        for i in range(len(ln) - 1):
            p, q = ln[i], ln[i + 1]; dx, dy = abs(q[0] - p[0]), abs(q[1] - p[1])
            t = 1.4 if dy > dx * 1.6 else 0.6 if dx > dy * 1.6 else 1.0   # Senkrechte dick, Waagerechte dünn, Schräge mittel
            polys.append(quad(p, q, t, 0))
            if i < len(ln) - 2 or closed: polys.append(achteck(q, 0.5))
        if not closed:   # freie Enden: Rautenkopf wie Federansatz
            for e in (ln[0], ln[-1]): polys.append(raute(e, 0.75))
    return polys


def stil_schablone(lines):
    polys = []
    for ln in lines:
        n = len(ln) - 1
        for i in range(n):
            p, q = ln[i], ln[i + 1]; dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L
            g1 = 0.36 if i > 0 or ln[0] == ln[-1] else -0.3; g2 = 0.36 if i < n - 1 or ln[0] == ln[-1] else -0.3   # Steg an Ecken, freie Enden voll
            if L - g1 - g2 < 0.3: g1 = g2 = max(0, (L - 0.3) / 2)
            polys.append(quad((p[0] + ux * g1, p[1] + uy * g1), (q[0] - ux * g2, q[1] - uy * g2), 1.3, 0))
    return polys


def stil_kantig(lines):
    polys = []
    for ln in lines:
        for i in range(len(ln) - 1):
            polys.append(quad(ln[i], ln[i + 1], 1.15, 0))
        for v in ln: polys.append(achteck(v, 0.575))
    return polys


def clockwise(poly):   # TrueType: Außenkonturen im Uhrzeigersinn (y nach oben → negative Fläche)
    a = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))
    return poly if a < 0 else poly[::-1]


def bauen(stil, fn, sx, unit=100, rand=70):
    order = ['.notdef'] + [NAMES[c] for c in NAMES]
    glyphs, metrics, cmap = {}, {}, {}
    pen = TTGlyphPen(None); glyphs['.notdef'] = pen.glyph(); metrics['.notdef'] = (500, 0)
    for ch, nm in NAMES.items():
        pen = TTGlyphPen(None)
        if ch != ' ':
            for poly in (stil_kantig(SK[ch]) if fn is stil_gebrochen and ch in '%−-+×:.,' else fn(SK[ch])):   # Rechen-/Satzzeichen schlicht
                pts = clockwise([(round(rand + x * unit * sx + 50), round(y * unit)) for x, y in poly])
                pen.moveTo(pts[0]); [pen.lineTo(p) for p in pts[1:]]; pen.closePath()
        glyphs[nm] = pen.glyph()
        w = WIDTH.get(ch, 4) * unit * sx + 100 + 2 * rand if ch != ' ' else 300
        metrics[nm] = (round(w), 0); cmap[ord(ch)] = nm
    fb = FontBuilder(1000, isTTF=True); fb.setupGlyphOrder(order); fb.setupCharacterMap(cmap); fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics); fb.setupHorizontalHeader(ascent=850, descent=-200)
    fb.setupNameTable({'familyName': f'Arm Ziffern {stil}', 'styleName': 'Regular'}); fb.setupOS2(sTypoAscender=850, sTypoDescender=-200, usWinAscent=900, usWinDescent=250); fb.setupPost()
    path = OUT / f'ArmZiffern-{stil}.ttf'; fb.save(str(path)); print(path.name, path.stat().st_size, 'Bytes')
    # WOFF2 für die Testseite entwurf/probe/ziffern.html (wie tools/fonts.py über den Subsetter, den der Browser sicher annimmt)
    from fontTools import subset
    from fontTools.ttLib import TTFont
    f = TTFont(str(path)); opt = subset.Options(); opt.flavor = 'woff2'; opt.name_IDs = ['*']; sub = subset.Subsetter(opt); sub.populate(unicodes=list(cmap)); sub.subset(f)
    f.flavor = 'woff2'; f.save(str(ROOT / 'entwurf' / 'probe' / f'ziffern-{stil.lower()}.woff2'))


if __name__ == '__main__':
    bauen('Gebrochen', stil_gebrochen, 0.95)
    bauen('Schablone', stil_schablone, 1.0)
    bauen('Kantig', stil_kantig, 0.8)
