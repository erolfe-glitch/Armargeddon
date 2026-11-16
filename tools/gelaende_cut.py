# Gelände-Bausteine freistellen (STYLE.md „Gelände-Bausteine“, Prompts G1–G14 in entwurf/GEMINI_PROMPTS.md).
# Quelle: ui-quelle/gelaende/<name>.png (Magenta- oder weißer Hintergrund).
# Ziel:   ui-quelle/teile/gelaende/<name>[_n].png (volle Auflösung, Maßstab 320 px = 1 SH)
#         entwurf/probe/gelaende/g_<name>[_n].webp (für die Probe entwurf/probe/gelaende.html)
# Arten:
#   wand  – waagrecht kachelbarer Streifen (Wandstück): Unterkante = Fußlinie, links/rechts nahtlos gemacht, Höhe = SH × 320 px
#   sohle – waagrecht kachelbarer Streifen von oben (Grabensohle): nahtlos, Höhe = Grabenbreite 1,0 R = 400 px
#   bogen – mehrere Aufsteller auf einem Bogen: jedes Teil einzeln, Fuß = unterste Zeile; Höhe je Teil in SH (Liste)
#           oder ('gemeinsam', H): ein Maßstab für den ganzen Bogen, das höchste Teil wird H SH hoch (Größenverhältnisse bleiben)
#   einzel – ein Aufsteller, Höhe in SH
#   flach – Bogen mit flachen Details (von oben): größte Ausdehnung je Teil in Feldradien R
#   textur – Bodentextur, an allen vier Seiten nahtlos gemacht, 1 Kachel = 2 R (eine Feldbreite)
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
    'ruine_paar_aufsteller': ('bogen', [1.3, 0.9]),           # Extra (Deko, nicht verwenden)
    'ruinen_test_weiss':   ('bogen', [1.2, 1.2, 0.8, 1.3]),    # Extra, weißer Hintergrund, nicht verwenden
    'draht':               ('wand', 0.6),
    'barrikade':           ('wand', 0.55),
    'wald_unterholz':      ('wand', 0.3),
    'bunker':              ('bogen', ('gemeinsam', 1.15)),     # 1 heil, 2 beschädigt
    'wald_staemme':        ('bogen', ('gemeinsam', 1.8)),
    'wald_staemme_b':      ('bogen', ('gemeinsam', 1.8)),
    'wald_stamm_1':        ('einzel', 1.9),                    # dicker, Reserve
    'wald_stamm_2':        ('einzel', 1.9),
    'wald_stamm_3':        ('einzel', 1.9),
    'stuempfe':            ('bogen', ('gemeinsam', 0.9)),
    'stuempfe_b':          ('bogen', ('gemeinsam', 0.9)),
    'stuempfe_c':          ('bogen', ('gemeinsam', 0.9)),
    'truemmer':            ('bogen', ('gemeinsam', 0.6)),
    'truemmer_b':          ('bogen', ('gemeinsam', 0.6)),
    'truemmer_c':          ('bogen', ('gemeinsam', 0.6)),
    'truemmer_d':          ('bogen', ('gemeinsam', 0.6)),
    # Trichter klein/groß, Pfütze, lange Pfütze, Bretter, Laufrost, Trümmerstreu, Spuren
    'flach_details':       ('flach', [0.65, 1.25, 0.6, 1.0, 0.6, 0.6, 1.0, 1.0]),
    'panzersperren':       ('bogen', ('gemeinsam', 0.75)),    # Tschechenigel, Höckerlinie, Igel mit Draht, Pfahlreihe
    'panzersperren_b':     ('bogen', ('gemeinsam', 0.95)),    # wie oben, Pfähle länger
    'trichter_gross':      ('flach', [1.5]),
    # Schwarzer Hintergrund (trichter_schwarz_a/b/c, details_schwarz): Versuch 2026-11-16 nicht sauber – dunkle Trichter, Wasser und
    # Schatten gehen in den Hintergrund über und werden löchrig. Nicht verwenden; bei Bedarf neu mit Magenta-Hintergrund erzeugen.
    # Zum erneuten Ausprobieren: python tools/gelaende_cut.py --schwarz trichter_schwarz_a (Ergebnis nur ansehen, nicht einbauen).
    'boden_schlamm':       ('textur', None),
    'boden_gras':          ('textur', None),
    'boden_waldboden':     ('textur', None),
    'boden_truemmer':      ('textur', None),
    'boden_sumpf':         ('textur', None),
    'boden_wasser':        ('textur', None),
    'boden_kopfstein':     ('textur', None),
}
TEX_PX, TEX_PROBE = 1024, 768


def freistellen(path):
    a = np.asarray(Image.open(path).convert('RGB'))
    rand_px = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]).astype(float)
    if np.median(rand_px, axis=0).max() < 30:   # schwarzer Hintergrund: Deckung nach Helligkeit, Farben nicht entmischen (dunkler Saum = Schatten)
        lum = a.astype(float).mean(axis=2)
        al = np.clip((lum - 14) / 26, 0, 1)
        lab, _ = ndimage.label(al < 0.5)
        rand = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        innen = (lab > 0) & ~np.isin(lab, list(rand))
        al[innen] = 1   # eingeschlossenes Dunkel (Wasser im Trichter) bleibt deckend
        al = ndimage.gaussian_filter(al, 1.0)
        print('  Hintergrund schwarz (Versuch)')
        return np.dstack([a.astype(float), al * 255])
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


def speichern(q, name, h_px, w_px=None):
    im = Image.fromarray(np.clip(q, 0, 255).astype(np.uint8), 'RGBA')
    w = round(w_px) if w_px else round(im.width * h_px / im.height)
    im = im.resize((max(1, w), max(1, round(h_px))), Image.LANCZOS)
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


def pfaehle_ausduennen(name, jede=2):
    """Drahtstreifen: jeden zweiten Pfahl herausschneiden (Wunsch 2026-11-16: weniger Pfähle, mehr Draht dazwischen).
    Pfähle = Spalten, die über 60 % der Höhe gedeckt sind; geschnitten wird mit 4 px Rand, die Drahtwirbel stoßen dann aneinander."""
    im = np.asarray(Image.open(OUT / f'{name}.png')).copy()
    cov = (im[..., 3] > 128).mean(axis=0); idx = np.where(cov > 0.6)[0]
    grp = []
    for i in idx:
        if grp and i - grp[-1][1] <= 3: grp[-1][1] = i
        else: grp.append([i, i])
    # Einzelne Pfähle als Aufsteller (draht_pfahl_k): der Draht wird im Spiel als gespannte Linien zwischen den Pfählen gezeichnet
    for k, (a, b) in enumerate(grp, 1):
        t = im[:, max(0, a - 3):b + 4].copy()
        core = (t[..., 3] > 128).sum(axis=1) >= (b - a + 1) * 0.5   # Zeilen, in denen der Pfahl selbst steht
        rows = np.where(core)[0]
        t = t[rows.min():rows.max() + 1]
        t[(t[..., 3] < 140), 3] = 0   # halbdurchsichtige Reste (Drahtsaum) weg
        out = Image.fromarray(t, 'RGBA'); out.save(OUT / f'draht_pfahl_{k}.png'); out.save(PROBE / f'g_draht_pfahl_{k}.webp', quality=90, method=6)
        print(f'  → draht_pfahl_{k}: {t.shape[1]}×{t.shape[0]}')
    weg = np.zeros(im.shape[1], bool)
    for k, (a, b) in enumerate(grp):
        if k % jede: weg[max(0, a - 4):b + 5] = True
    q = im[:, ~weg].astype(np.float64)
    # Drahtlinien verdicken (im Spiel wird der Streifen auf ca. ein Drittel verkleinert, feine Linien verschwinden sonst):
    # deckende Drahtpixel um 1 px ausbreiten, neu gedeckte Pixel rostbraun; Pfähle bleiben unverändert
    pf = np.zeros(q.shape[1], bool); cov2 = (q[..., 3] > 128).mean(axis=0); pf[ndimage.binary_dilation(cov2 > 0.6, iterations=5)] = True
    draht = q[..., 3] > 150
    neu = ndimage.binary_dilation(draht, structure=np.ones((3, 3), bool)) & ~draht
    neu[:, pf] = False
    q[neu, 3] = np.maximum(q[neu, 3], 220); q[neu, :3] = [70, 46, 32]
    # kein Schleier: halbdurchsichtige Reste zwischen den Drähten ganz weg, Draht und Pfähle voll deckend
    q[..., 3] = np.where(q[..., 3] < 140, 0, 255)
    # rostiger Glanz: Drahtpixel mit freier Oberseite (Licht von oben links) bekommen eine helle Rostkante, alle Drähte etwas rostiger
    d = q[..., 3] > 0; d[:, pf] = False
    oben = d & ~np.roll(d, 1, axis=0) | d & ~np.roll(np.roll(d, 1, axis=0), 1, axis=1)
    q[d, :3] = q[d, :3] * 0.7 + np.array([118, 74, 46]) * 0.3
    q[oben, :3] = q[oben, :3] * 0.45 + np.array([190, 124, 76]) * 0.55
    q = np.clip(q, 0, 255).astype(np.uint8)
    print(f'  {len(grp)} Pfähle, {sum(1 for k in range(len(grp)) if k % jede)} entfernt → Breite {q.shape[1]} px')
    out = Image.fromarray(q, 'RGBA'); out.save(OUT / f'{name}.png'); out.save(PROBE / f'g_{name}.webp', quality=88, method=6)


def textur(name):
    a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB')).astype(np.float64)
    h, w = a.shape[:2]
    nx, ny = naht(a), naht(a.transpose(1, 0, 2))
    if max(nx, ny) > 1.4:   # Hälfte verschieben (Naht liegt dann in der Mitte) und mit dem Original überblenden: Ränder aus der verschobenen Fassung, Mitte aus dem Original
        rl = np.roll(a, (h // 2, w // 2), axis=(0, 1))
        y = np.minimum(np.arange(h), h - 1 - np.arange(h))[:, None]; x = np.minimum(np.arange(w), w - 1 - np.arange(w))[None, :]
        ramp = 0.16
        t = np.clip(np.minimum(y / (h * ramp), x / (w * ramp)), 0, 1); t = t * t * (3 - 2 * t)
        a = a * t[..., None] + rl * (1 - t[..., None])
    hell = a.mean() / 255
    print(f'  Naht waagrecht {nx:.1f}×, senkrecht {ny:.1f}× → {naht(a):.1f}×, {naht(a.transpose(1, 0, 2)):.1f}×; Helligkeit {hell:.2f}')
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')
    OUT.mkdir(parents=True, exist_ok=True); PROBE.mkdir(parents=True, exist_ok=True)
    im.resize((TEX_PX, TEX_PX), Image.LANCZOS).save(OUT / f'{name}.png')
    im.resize((TEX_PROBE, TEX_PROBE), Image.LANCZOS).save(PROBE / f'g_{name}.webp', quality=86, method=6)
    print(f'  → {name}: {TEX_PX}×{TEX_PX}')


def teile_finden(q, n_min=0.08):
    al = ndimage.binary_closing(q[..., 3] > 60, iterations=6)
    lab, n = ndimage.label(al)
    sizes = ndimage.sum(al, lab, range(1, n + 1))
    teile = [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * n_min]
    fo = ndimage.find_objects(lab); boxes = [fo[i - 1] for i in teile]
    H = q.shape[0]
    boxes.sort(key=lambda b: (((b[0].start + b[0].stop) / 2) > H / 2, b[1].start))
    out = []
    for b in boxes:
        t = q[b].copy(); maske = ndimage.binary_dilation((lab[b] > 0) & np.isin(lab[b], teile), iterations=3); t[~maske, 3] = 0
        ys, xs = np.where(t[..., 3] > 40); out.append(t[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
    return out


def flach(name, groessen):
    stuecke = teile_finden(freistellen(SRC / f'{name}.png'), 0.05)
    if len(stuecke) != len(groessen):
        print(f'  WARNUNG: {len(stuecke)} Teile gefunden, {len(groessen)} erwartet')
    for k, (t, g) in enumerate(zip(stuecke, groessen), 1):
        f = g * PX_R / max(t.shape[:2])
        speichern(t, f'{name}_{k}', t.shape[0] * f, t.shape[1] * f)


def einzel(name, h):
    t = teile_finden(freistellen(SRC / f'{name}.png'))[0]
    speichern(t, name, PX_SH * h)


def bogen(name, hoehen):
    if isinstance(hoehen, tuple):   # ein Maßstab für den ganzen Bogen
        stuecke = teile_finden(freistellen(SRC / f'{name}.png'))
        f = hoehen[1] * PX_SH / max(t.shape[0] for t in stuecke)
        for k, t in enumerate(stuecke, 1):
            speichern(t, f'{name}_{k}', t.shape[0] * f)
        print(f'  {len(stuecke)} Teile, gemeinsamer Maßstab')
        return
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
    args = [x for x in sys.argv[1:] if x != '--schwarz']
    if '--schwarz' in sys.argv:
        for name in args: TEILE[name] = ('flach', [0.9] * 8)
    for name in args or TEILE:
        art, h = TEILE[name]
        print(name)
        if art == 'bogen':
            bogen(name, h)
        elif art == 'flach':
            flach(name, h)
        elif art == 'einzel':
            einzel(name, h)
        elif art == 'textur':
            textur(name)
        else:
            streifen(name, art, h)
            if name == 'draht': pfaehle_ausduennen(name)
