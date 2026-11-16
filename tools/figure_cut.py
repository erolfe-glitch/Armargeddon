"""Stellt Figurenbögen frei: 2×2 Posen auf Magenta (ui-quelle/figuren/<name>.png) → entwurf/probe/fig/<name>_<n>.png.

Aufruf:  python tools/figure_cut.py [name ...] [--game]   (ohne Namen: alle Bögen in ui-quelle/figuren/;
         --game: Spielbilder nach ui-quelle/teile/figuren/ und eingebettet in src/figs.js, sonst Probebild entwurf/probe/fig/)
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
sys.stdout.reconfigure(encoding='utf-8')

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


def key_any(a):
    """Hintergrund in anderer Farbe (z. B. Pink 224,0,122): Farbe vom Bildrand nehmen, nach Farbabstand ausblenden
    und die Kantenfarben entmischen (Anteil des Hintergrunds herausrechnen), damit kein farbiger Saum bleibt."""
    rgb = a[..., :3].astype(np.float64)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    d = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    alpha = np.clip((d - 35) / 75, 0, 1)
    al = np.maximum(alpha, 1e-3)[..., None]
    fg = np.clip((rgb - (1 - alpha[..., None]) * bg) / al, 0, 255)
    out = np.where(alpha[..., None] > 0, fg, rgb)
    # Farbstich an den Rändern: Tinte + Hintergrund ergibt dunkles Lila/Pink. Nur nahe der Kante: Rot und Blau nicht über Grün
    # hinaus anheben (Überschuss abziehen) – echte Farben wie Ochsenblut (wenig Blau) bleiben unberührt.
    edge = ndimage.binary_dilation(alpha < 0.98, iterations=5)
    if bg[0] > 150 and bg[2] > 90 and bg[1] < 80:
        ex = np.clip(np.minimum(out[..., 0], out[..., 2]) - out[..., 1], 0, None) * edge
        out[..., 0] -= ex; out[..., 2] -= ex
    return np.dstack([np.clip(out, 0, 255), alpha * 255]), bg


def keyed(a):
    """Freistellen: Hintergrundfarbe vom Bildrand (Magenta, Pink …), Farbabstand + Entmischen der Kanten (key_any).
    Seit 2026-11-16 für alle Bögen; das ältere reine Magenta-Verfahren (key) ließ in Haaren und Mähnen lila Reste."""
    k, bg = key_any(a)
    print(f'  Hintergrund {bg.round().astype(int).tolist()}')
    return k


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


# Bögen mit 4 Posen im 2×2-Raster (Trupps); alle anderen sind Einzelmodelle (ein Bild, alle Teile behalten).
TRUPP = {'soldat', 'sturm', 'pionier', 'schildwall'}
# Bögen mit Posen in einer Reihe (nebeneinander): Anzahl Posen; Teile werden über zusammenhängende Flächen gefunden
REIHE = {'reiter': 3, 'flammen': 4, 'sanitaeter': 4, 'scharfschuetze': 3, 'schwer': 4, 'banner': 3}
# Posen nebeneinander, die sich berühren (Mann und Hund): an festen Stellen (Anteil der Breite) senkrecht trennen
SPALTEN = {'melder': [0.525], 'sanitaeter': 4, 'scharfschuetze': 3, 'schwer': 4, 'pirschjaeger': 3}   # Zahl = so viele Posen, Trennstellen automatisch (dünnste Spalten)
# Höhe der höchsten Pose in SH (Reiter mit Pferd, erhobener Waffe/Lanze); sonst 1,0
SH_REIHE = {'reiter': 1.75, 'banner': 1.45, 'schwer': 1.08, 'pirschjaeger': 0.85}   # Pirschjäger: höchste Pose geduckt
# Gezeichnete Bodenschatten unter den Füßen entfernen (dunkles Magenta/Pink unten an den Posen)
OHNE_SCHATTEN = {'konkordat_flammen', 'aschenwacht_flammen'}
# Einzelmodelle: Höhe des freigestellten Bilds in Soldatenhöhen (SH, 1 SH = stehender Soldat). Panzer nach STYLE.md 1,3–1,5 SH,
# Breite nach Bild (darf etwas über den Feldrand ragen, ui.js FIGW_VEH als Sicherheitsgrenze).
SH_SINGLE = {'mg': 1.13, 'mg_marsch': 1.21, 'geschuetz': 1.38, 'geschuetz_marsch': 1.4, 'hauptmann': 1.2, 'koloss': 1.5, 'panzer': 1.5, 'bohrkoloss': 1.5,
             'moerser': 0.95, 'minenwerfer': 1.0, 'rauchwerfer': 1.02, 'panzerbuechse': 0.82, 'general': 1.5}   # Trupps mit Gerät: höchste Figur; General mit Fahnenträger (Fahne ragt über den Kopf)   # 2026-11-16: MG 1,15× (beide Zustände), Geschütz 1,38, Gespann am Reiter gemessen 1,4 SH, Fahrzeuge 1,5 SH
# Aschenwacht-Fahnen: Schwarz-Weiß-Rot (echte Flagge) → eigene Farben Aschgrau / Schwarz / Knochenweiß, nur im Fahnenbereich (Anteile x0, y0, x1, y1)
FAHNE = {'aschenwacht_banner': (0, 0, 1, 0.5), 'aschenwacht_bohrkoloss': (0.18, 0.0, 0.42, 0.23), 'aschenwacht_panzer': (0.66, 0.26, 0.99, 0.87)}
ASCHGRAU, KNOCHEN = np.array([108, 106, 100.]), np.array([222, 212, 186.])


def fahne_umfaerben(a, box):
    """Weiß → Aschgrau, Rot → Knochenweiß (Schattierung bleibt), Schwarz bleibt; weiche Masken gegen harte Kanten."""
    a = a.astype(np.float64); H, W = a.shape[:2]; x0, y0, x1, y1 = box
    sl = (slice(int(y0 * H), int(y1 * H)), slice(int(x0 * W), int(x1 * W))); q = a[sl]
    r, g, b = q[..., 0], q[..., 1], q[..., 2]; mx, mn = q.max(-1), q.min(-1); lum = 0.3 * r + 0.59 * g + 0.11 * b
    rot = np.clip((np.minimum(r - g, r - b) - 30) / 25, 0, 1)
    weiss = np.clip((lum - 135) / 30, 0, 1) * np.clip((45 - (mx - mn)) / 20, 0, 1)
    v_rot = np.clip(mx / 160, 0.35, 1.05)[..., None]; v_w = np.clip(lum / 205, 0.5, 1.08)[..., None]
    q[:] = q * (1 - rot[..., None]) + KNOCHEN * v_rot * rot[..., None]
    q[:] = q * (1 - weiss[..., None]) + ASCHGRAU * v_w * weiss[..., None]
    print(f'  Fahne umgefärbt: rot {int((rot > 0.5).sum())} px, weiß {int((weiss > 0.5).sum())} px')
    return np.clip(a, 0, 255).astype(np.uint8)


GAME = ROOT / 'ui-quelle' / 'teile' / 'figuren'   # Bilder fürs Spiel (eingebettet in src/figs.js)


def kind_of(name):
    return name.split('_', 1)[1]


def keep_parts(q, single, frac=0.02):
    """Krümel weg: Trupp-Pose nur die größte Figur, Einzelmodell alle großen Teile (Kisten, Sandsäcke, zweite Figur)."""
    al = q[..., 3] > 40
    lab, n = ndimage.label(al)
    if not n:
        return q
    sizes = ndimage.sum(al, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v >= (sizes.max() * frac if single else sizes.max())])
    keep = ndimage.binary_dilation(keep, iterations=2)
    q = q.copy(); q[~keep, 3] = 0
    ys, xs = np.where(q[..., 3] > 40)
    return q[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def cut(name, out=OUT):
    a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB'))
    if name in FAHNE: a = fahne_umfaerben(a, FAHNE[name])
    H, W = a.shape[:2]
    k = keyed(a)
    kind = kind_of(name)
    if kind in SPALTEN:   # Posen an festen Stellen getrennt, je Streifen alle großen Teile (Mann + Hund)
        sp = SPALTEN[kind]
        if isinstance(sp, int):   # automatisch: je Trennstelle die Spalte mit der wenigsten Deckung nahe der gleichmäßigen Teilung
            prof = ndimage.uniform_filter1d((k[..., 3] > 60).sum(0).astype(float), 15); cols = np.nonzero(prof > 0)[0]; xa, xb = cols.min(), cols.max(); L = xb - xa
            sp = [(xa + int(np.argmin(prof[int(xa + L * (i / sp - 0.1)):int(xa + L * (i / sp + 0.1))])) + int(L * (i / sp - 0.1))) / W for i in range(1, sp)]
        xs = [0] + [int(f * W) for f in sp] + [W]; poses = []
        for j in range(len(xs) - 1):
            t = k.copy(); t[:, :xs[j], 3] = 0; t[:, xs[j + 1]:, 3] = 0; poses.append(keep_parts(t, True, 0.12))   # abgeschnittene Waffenstücke der Nachbarpose weg
        s = H_OUT * SH_REIHE.get(kind, 1.0) / max(q.shape[0] for q in poses); out.mkdir(parents=True, exist_ok=True)
        for j, q in enumerate(poses, 1):
            im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            im.save(out / f'{name}_{j}.png'); print(f'{name}_{j}: {im.width}×{im.height}')
        return
    if kind not in TRUPP and kind not in REIHE:   # Einzelmodell
        q, fl = k, 0   # Einzelmodelle: nur Magenta weg (Kisten, Fahnen, Messing, Flamme gehören zum Modell)
        q = keep_parts(q, True)
        s = H_OUT * SH_SINGLE.get(kind, 1.0) / q.shape[0]
        out.mkdir(parents=True, exist_ok=True)
        im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im.save(out / f'{name}.png')
        print(f'{name}: {im.width}×{im.height} ({SH_SINGLE.get(kind, 1.0)} SH, Breite/Höhe {im.width / im.height:.2f})' + (f'  (Mündungsfeuer entfernt: {fl} px)' if fl else ''))
        return
    poses = []
    if kind in REIHE:   # Posen nebeneinander: größte zusammenhängende Teile, von links nach rechts
        if name in OHNE_SCHATTEN:   # gemalter Schatten = Hintergrundfarbe abgedunkelt: rot/blau deutlich über grün, nicht hell
            r, g, b = [a[..., i].astype(int) for i in range(3)]
            sch = (np.minimum(r, b) - g > 28) & ((r + g + b) < 560)
            k = k.copy(); k[ndimage.binary_dilation(sch, iterations=1), 3] = 0
        al = ndimage.binary_closing(k[..., 3] > 60, iterations=4); lab, n = ndimage.label(al)
        sizes = ndimage.sum(al, lab, range(1, n + 1)); big = sorted(range(1, n + 1), key=lambda i: -sizes[i - 1])[:REIHE[kind]]
        fo = ndimage.find_objects(lab); big.sort(key=lambda i: fo[i - 1][1].start)
        for j, i in enumerate(big, 1):
            sl = fo[i - 1]; t = k[sl].copy(); t[~ndimage.binary_dilation(lab[sl] == i, iterations=2), 3] = 0
            poses.append((j, keep_parts(t, True), 0))
        hmax = max(p[1].shape[0] for p in poses); s = H_OUT * SH_REIHE.get(kind, 1.0) / hmax
        out.mkdir(parents=True, exist_ok=True)
        for i, q, fl in poses:
            im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            im.save(out / f'{name}_{i}.png'); print(f'{name}_{i}: {im.width}×{im.height}')
        return
    for i, (y0, x0) in enumerate([(0, 0), (0, W // 2), (H // 2, 0), (H // 2, W // 2)], 1):
        q = k[y0:y0 + H // 2, x0:x0 + W // 2]
        q, fl = remove_flash(q)
        q = keep_parts(q, False)
        poses.append((i, q, fl))
    hmax = max(p[1].shape[0] for p in poses)   # stehende Pose = höchste
    s = H_OUT / hmax
    out.mkdir(parents=True, exist_ok=True)
    for i, q, fl in poses:
        im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im.save(out / f'{name}_{i}.png')
        print(f'{name}_{i}: {im.width}×{im.height}' + (f'  (Mündungsfeuer entfernt: {fl} px)' if fl else ''))


def angleichen(names):
    """Farbe/Helligkeit neuer Bilder an die vorhandenen Figuren der Fraktion angleichen (Mittel der Soldaten- und Sturmbögen):
    Sättigung, Wärme (R−B) und Helligkeit über die deckenden Pixel, Verfahren aus tools/unit_color.py."""
    sys.path.insert(0, str(ROOT / 'tools'))
    import unit_color as uc
    for fr in ('konkordat', 'aschenwacht'):
        ref = [f for f in GAME.glob(f'{fr}_*.png') if any(t in f.stem for t in ('_soldat_', '_sturm_'))]
        st = [uc.stats(np.asarray(Image.open(f).convert('RGBA'))[..., :3] / 255, np.asarray(Image.open(f).convert('RGBA'))[..., 3] > 128) for f in ref]
        ziel = {k: float(np.mean([x[k] for x in st])) for k in ('sätt', 'wärme', 'hell')}
        for f in sorted(GAME.glob(f'{fr}_*.png')):
            if not any(f.stem == n or f.stem.startswith(n + '_') for n in names if n.startswith(fr)): continue
            a = np.asarray(Image.open(f).convert('RGBA')).astype(np.float64); rgb, m = a[..., :3] / 255, a[..., 3] > 128
            vor = uc.stats(rgb, m); rgb = uc.correct(rgb, m, ziel['sätt'], ziel['wärme'], ziel['hell'])
            a[..., :3] = rgb * 255; Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8), 'RGBA').save(f)
            print(f"  {f.stem}: hell {vor['hell']:.2f}→{ziel['hell']:.2f}, sätt {vor['sätt']:.2f}→{ziel['sätt']:.2f}, wärme {vor['wärme']:.3f}→{ziel['wärme']:.3f}")


def embed():
    """Alle Spielbilder als WebP in src/figs.js (window.FIGS: Schlüssel → Daten-URL). 320 px Bildhöhe = 1 Soldatenhöhe."""
    import base64, io
    lines = ['// ===== ARMARGEDDON FIGUREN (neue Ansicht) =====',
             '// Erzeugt von tools/figure_cut.py --game aus ui-quelle/figuren/. Datendatei, nicht von Hand ändern, nicht komplett lesen.',
             '// Schlüssel <fraktion>_<bogen>[_<pose>]; 320 px Bildhöhe = 1 Soldatenhöhe, Füße am unteren Bildrand.',
             'window.FIGS = {']
    total = 0
    for f in sorted(GAME.glob('*.png')):
        buf = io.BytesIO(); Image.open(f).save(buf, 'WEBP', quality=86, method=6)
        u = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(); total += len(u)
        lines.append(f'"{f.stem}": "{u}",')
    lines.append('};')
    (ROOT / 'src' / 'figs.js').write_text('\n'.join(lines) + '\n', encoding='utf8', newline='\n')
    print('src/figs.js', total // 1024, 'KB')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    game = '--game' in sys.argv   # Spielbilder nach ui-quelle/teile/figuren/ und src/figs.js
    names = args or sorted(p.stem for p in SRC.glob('*.png'))
    for n in names:
        cut(n, GAME if game else OUT)
    if game and '--angleichen' in sys.argv:
        angleichen(names)
    if game:
        embed()
