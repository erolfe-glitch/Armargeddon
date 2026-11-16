# Gelände-Bausteine freistellen (STYLE.md „Gelände-Bausteine“, Prompts G1–G14 in entwurf/GEMINI_PROMPTS.md).
# Quelle: ui-quelle/gelaende/<name>.png (Magenta- oder weißer Hintergrund).
# Ziel:   ui-quelle/teile/gelaende/<name>[_n].png (volle Auflösung, Maßstab 320 px = 1 SH)
#         entwurf/probe/gelaende/g_<name>[_n].webp (für die Probe entwurf/probe/gelaende.html)
# Arten:
#   wand  – waagrecht kachelbarer Streifen (Wandstück): Unterkante = Fußlinie, links/rechts nahtlos gemacht, Höhe = SH × 320 px
#   sohle – waagrecht kachelbarer Streifen von oben (Grabensohle): nahtlos, Höhe = Grabenbreite 1,0 R = 400 px
#   bogen – mehrere Aufsteller auf einem Bogen: jedes Teil einzeln, Fuß = unterste Zeile, Höhe je Teil in SH
# Aufruf: python tools/gelaende_cut.py [name …]   (ohne Namen: alle in TEILE)
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from figure_cut import key_any   # Farbabstand zum Randhintergrund + Entmischen der Kanten

SRC = ROOT / 'ui-quelle' / 'gelaende'
OUT = ROOT / 'ui-quelle' / 'teile' / 'gelaende'
PROBE = ROOT / 'entwurf' / 'probe' / 'gelaende'
PX_SH, PX_R = 320, 400

# name: (Art, Höhe in SH bzw. Liste je Teil). Teile auf Bögen von oben links nach unten rechts.
TEILE = {
    'graben_sohle':        ('sohle', None),
    'graben_kante_vorn':   ('wand', 0.32),
    'graben_kante_hinten': ('wand', 0.42),
    'ruine_hinten':        ('wand', 1.2),
    'ruine_vorn':          ('wand', 0.45),
    'ruine_ecken':         ('bogen', [1.2, 0.8, 0.45, 1.4]),
    'ruine_paar_aufsteller': ('bogen', [1.3, 0.9]),           # Extra (Deko, noch nicht verwendet)
    'ruinen_test_weiss':   ('bogen', [1.2, 1.2, 0.8, 1.3]),    # Extra, weißer Hintergrund
}


def freistellen(path):
    a = np.asarray(Image.open(path).convert('RGB'))
    q, bg = key_any(a)
    if bg.min() > 200:   # weißer Hintergrund: helle Putzflächen im Bild nicht mit ausblenden – nur was mit dem Rand zusammenhängt
        lab, _ = ndimage.label(q[..., 3] < 128)
        rand = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        innen = (q[..., 3] < 255) & ~np.isin(lab, list(rand)) & (lab > 0)
        q[innen, 3] = 255; q[innen, :3] = a[innen]
        # große, rein weiße Löcher (Fensterhöhlen) sind doch Hintergrund
        weiss = innen & (a.min(axis=2) > 246)
        lw, nw = ndimage.label(weiss)
        if nw:
            gr = ndimage.sum(weiss, lw, range(1, nw + 1)); loch = np.isin(lw, [i + 1 for i, v in enumerate(gr) if v > 300])
            q[ndimage.binary_dilation(loch, iterations=2) & (a.min(axis=2) > 200), 3] = 0
    if bg[0] > 150 and bg[2] > 150 and bg[1] < 90:   # eingeschlossene Magenta-Nester (zwischen Brettern, in Ritzen): ganz ausblenden
        r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
        nest = ndimage.binary_dilation((r > 150) & (b > 150) & (g < 110) & (np.minimum(r, b) - g > 70), iterations=1)
        q[nest, 3] = 0
    print(f'  Hintergrund {bg.round().astype(int).tolist()}')
    return q


def naht(q):
    """Sprung an der Kachelnaht (letzte → erste Spalte) im Verhältnis zum üblichen Unterschied benachbarter Spalten (1,0 = unsichtbar)."""
    d = np.abs(np.diff(q, axis=1)).mean()
    return float(np.abs(q[:, 0] - q[:, -1]).mean() / max(d, 1e-6))


def schnitt(q, band=10):
    """Beste Kachellänge: Spalte x im letzten Viertel, deren Umgebung dem Bildanfang am ähnlichsten ist (Streifen wiederholt sich dort)."""
    w = q.shape[1]; pm = np.concatenate([q[..., :3] * q[..., 3:] / 255, q[..., 3:]], axis=2)   # vormultipliziert: Farbe zählt nur, wo Bild ist
    ref = pm[:, :band]
    best, bx = 1e9, w
    for x in range(int(w * 0.72), w - band + 1):
        d = np.abs(pm[:, x:x + band] - ref).mean()
        if d < best: best, bx = d, x
    return bx


def nahtlos(q, ow):
    """Rechtes Ende über die ersten ow Spalten in den Anfang überblenden; Ergebnis ist ow Spalten schmaler und kachelt nahtlos."""
    w = q.shape[1]
    t = np.linspace(0, 1, ow)[None, :, None]
    head = q[:, :ow] * t + q[:, w - ow:] * (1 - t)
    return np.concatenate([head, q[:, ow:w - ow]], axis=1)


def zeilen(q, thr=40):
    ys = np.where((q[..., 3] > thr).any(axis=1))[0]
    return q[ys.min():ys.max() + 1]


def speichern(q, name, h_px):
    im = Image.fromarray(np.clip(q, 0, 255).astype(np.uint8), 'RGBA')
    w = round(im.width * h_px / im.height)
    im = im.resize((w, round(h_px)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True); PROBE.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f'{name}.png')
    im.save(PROBE / f'g_{name}.webp', quality=88, method=6)
    print(f'  → {name}: {im.width}×{im.height}')


def streifen(name, art, sh):
    q = zeilen(freistellen(SRC / f'{name}.png'))
    cc = (q[..., 3] > 128).mean(axis=0); xs = np.where(cc > cc.max() * 0.3)[0]   # schmalen Magenta-Rand links/rechts abschneiden
    q = q[:, xs.min():xs.max() + 1]
    rand = (q[:, :4, 3] > 128).mean(), (q[:, -4:, 3] > 128).mean()
    if min(rand) < 0.15:
        print(f'  WARNUNG: Streifen reicht nicht bis an den Bildrand (Deckung links {rand[0]:.2f}, rechts {rand[1]:.2f})')
    if art == 'wand':   # Fußlinie: unterste Zeile, die über die Breite zu 60 % gedeckt ist; darunter abschneiden
        cov = (q[..., 3] > 128).mean(axis=1)
        foot = np.where(cov > 0.6)[0].max()
        q = q[:foot + 1]
    vor = naht(q)
    ow = max(24, q.shape[1] // 14)
    if vor > 1.4:   # nicht nahtlos: an der Stelle schneiden, wo sich der Streifen wiederholt, Rest kurz überblenden (kurz = keine Geisterbilder)
        x = schnitt(q); q = q[:, :x]; ow = 20
        if naht(q) > 1.4: q = nahtlos(q, ow)
        else: ow = 0
        print(f'  Kachel bei Spalte {x} geschnitten')
    else: ow = 0
    print(f'  Naht vorher {vor:.1f}×, nachher {naht(q):.1f}× des üblichen Spaltenunterschieds (Überblendung {ow} px)')
    speichern(q, name, PX_SH * sh if art == 'wand' else PX_R)


def bogen(name, hoehen):
    q = freistellen(SRC / f'{name}.png')
    al = ndimage.binary_closing(q[..., 3] > 60, iterations=6)
    lab, n = ndimage.label(al)
    sizes = ndimage.sum(al, lab, range(1, n + 1))
    teile = [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * 0.08]
    fo = ndimage.find_objects(lab); boxes = [fo[i - 1] for i in teile]
    # Reihenfolge: zeilenweise von oben links (Zeile = Mittelpunkt in oberer/unterer Hälfte)
    H = q.shape[0]
    boxes.sort(key=lambda b: (((b[0].start + b[0].stop) / 2) > H / 2, b[1].start))
    if len(boxes) != len(hoehen):
        print(f'  WARNUNG: {len(boxes)} Teile gefunden, {len(hoehen)} erwartet')
    for k, (b, h) in enumerate(zip(boxes, hoehen), 1):
        t = q[b].copy()
        maske = ndimage.binary_dilation((lab[b] > 0) & np.isin(lab[b], teile), iterations=3)
        t[~maske, 3] = 0
        speichern(zeilen(t), f'{name}_{k}', PX_SH * h)


if __name__ == '__main__':
    for name in sys.argv[1:] or TEILE:
        art, h = TEILE[name]
        print(name)
        if art == 'bogen':
            bogen(name, h)
        else:
            streifen(name, art, h)
