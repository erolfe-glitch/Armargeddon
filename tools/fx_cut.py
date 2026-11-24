"""Effektbögen aus ui-quelle/effekte/ für das Spiel aufbereiten (2026-11-17).

Aufruf:  python tools/fx_cut.py            (alle Bögen)   python tools/fx_cut.py fx_rauch fx_gas
Ergebnis: ui-quelle/teile/effekte/<bogen>_<n>.png (Einzelteile) und src/fxneu.js (window.FXNEU, Datendatei, nicht lesen).

- Schwarzer Hintergrund (leuchtende Effekte): nicht freistellen. Grundrauschen unter 4 % wird reines Schwarz, Alpha nur als Maske
  (damit die WebP-Kompression kein Rauschen ins Schwarz bringt). Im Spiel aufhellend zeichnen ('lighter').
- Magenta-Hintergrund: freistellen wie die Figuren (figure_cut.key_any, Kanten entmischt), danach rosa angehauchte Flächen
  (Rauchfahnen, Einschlagflecken) in Grau/Braun umfärben.
- Varianten trennen: Naht-Methode (figure_cut.seam) – erst waagerecht zwischen den Zeilen, dann senkrecht je Zeile;
  Bögen mit Teilen über mehrere Zeilen (Rauchsäule) über zusammenhängende Flächen. Abgeschnittene Teile am Bildrand fallen weg.
- Gleicher Maßstab innerhalb eines Bogens: das größte Teil misst 320 px (längste Seite), die übrigen behalten ihre Größe dazu.
"""
import base64, io, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
import figure_cut as fc

SRC = ROOT / 'ui-quelle' / 'effekte'
OUT = ROOT / 'ui-quelle' / 'teile' / 'effekte'
MAXPX = 320

# rows: Anzahl Varianten je Zeile (Naht-Methode); teile: zusammenhängende Flächen; weg: Nummern (nach Lesereihenfolge) weglassen
CFG = {
    'fx_muendung':    dict(bg='schwarz', rows=[3, 3]),   # 1 Gewehr, 2 MG, 3 Pistole, 4 Kanone, 5 Mörser (nach oben), 6 lang und dünn
    'fx_explosion':   dict(bg='schwarz', rows=[4, 2]),   # 1–4 Stufen nacheinander, 5–6 eigene Varianten
    'fx_feuer':       dict(bg='schwarz', rows=[3, 3]),
    'fx_funken':      dict(bg='schwarz', rows=[3, 3]),
    'fx_leuchtkugel': dict(bg='schwarz', rows=[3, 3]),   # 1 steigt, 2 platzt, 3 am Schirm, 4–6 Glühen
    'fx_erdfontaene': dict(bg='magenta', rows=[3, 3]),
    'fx_rauch':       dict(bg='magenta', teile=7, weg=[4]),       # hohe Säule über beide Zeilen; Fahne oben rechts am Rand abgeschnitten → fällt weg
    'fx_nebel':       dict(bg='magenta', rows=[2, 2, 2]),
    'fx_gas':         dict(bg='magenta', rows=[3, 3], weg=[3]),   # oben rechts am Bildrand abgeschnitten
    'fx_blut':        dict(bg='magenta', rows=[3, 3], rosa=False),   # 1–3 Spritzer in der Luft, 4–6 Flecken am Boden
    'fx_blut2':       dict(bg='magenta', rows=[3, 3], rosa=False, blutsaum=True),   # schweres Blut (2026-11-21): 1–3 große Stöße in der Luft nach rechts (Fächer, Schlieren, Spritzer), 4–6 Bodenflecken (Spritzer, Schleifspur, Lache)
    'fx_truemmer':    dict(bg='magenta', rows=[3, 3]),   # 1 Mauer/Ziegel, 2 Holz, 3 Schrittstaub, 4 Bohrgrus, 5 Sandsack, 6 Staubring
    'fx_bodenspuren': dict(bg='magenta', rows=[3, 3]),   # 1 Brandfleck, 2 Einschlag, 3 Öl, 4 Drahtreste, 5 Kettenspuren, 6 kleiner Trichter
    # Nachtrag 2026-11-17
    'fx_geschosse':   dict(bg='magenta', rows=[3, 3], rosa=False),   # 1 Granate, 2 Mörsermine, 3 Stielhandgranate, 4 Handgranate, 5 Rauchtopf, 6 Gasgranate
    'fx_leuchtspur':  dict(bg='schwarz', rows=[2, 2, 2], kruemel=False),   # 1 Gewehr, 2 MG-Striche, 3 Granatschweif, 4 Mörserbogen, 5 Zündschnur, 6 Panzerbüchse
    'fx_flammenstrahl': dict(bg='schwarz', rows=[2, 2, 2]),   # 1 kurz, 2 lang mit Wolke, 3 lang mit großer Wolke, 4 Aufprall an Deckung, 5 tropfend, 6 züngelnd
    'fx_drehlauf':    dict(bg='schwarz', rows=[3, 3], lauf_weg=True),   # 1–3 Feuerstern, 4–6 Garbe mit Hülsen; gemalte Läufe entfernt
    'fx_nahkampf':    dict(bg='schwarz', rows=[3, 3]),   # 1 Schwung, 2 Kreuzhieb, 3 Aufprallstern, 4 Stich, 5 Funkenstern, 6 Bodenschlag
    'fx_heldenfunken': dict(bg='magenta', rows=[3, 3]),
    'fx_faehigkeiten': dict(bg='magenta', rows=[3, 3], leeren=[(0, 350, 75, 500), (0, 1150, 112, 1360)]),   # Paket D (2026-11-24): 1 Gebrüll-Kegel (Düse weg), 2 Gebrüll-Ringe von oben, 3 Boden-Druckwelle, 4 Dampfstoß (Düse weg), 5 Furcht-Ring mit Rauchklauen, 6 Funken und Metallsplitter
    'fx_winter_schnee': dict(bg='magenta', rows=[3, 3], rosa='grau'),   # Krähenfurt (Flux, 2026-11-22): 1 großer Schnee-Einschlag, 2 derselbe fällt zusammen, 3 kleiner Einschlag, 4–5 Pulverschnee (flach), 6 Eissplitter; rosa Säume → Grau (Schnee)   # Helden (Enrico 2026-11-22): 1 blauer Funkenstrich, 2 blau-weißer Einschlag, 3 kaltes Leuchten (Kürassier); 4 orangener Einschlag, 5 orangener Funkenstrich, 6 Glutsprenkel (Rote Faust)
}


def lauf_weg(a):
    """Drehlauf-Bögen: mitgemalte Waffenläufe (graues, ungesättigtes Metall) auf Schwarz setzen; Feuer, Leuchtspuren und
    messingfarbene Hülsen (gesättigt) bleiben. Dunkle Tusche wird ohnehin Schwarz."""
    rgb = a.astype(np.float64); mx, mn = rgb.max(2), rgb.min(2)
    metall = ((mx - mn) < 0.42 * mx) & (mx < 200)
    metall = ndimage.binary_opening(metall, iterations=1)
    out = a.copy(); out[metall] = 0
    return out


def schwarz(a):
    rgb = a.astype(np.float64); mx = rgb.max(2)
    on = mx >= 255 * 0.04
    rgb[~on] = 0
    al = ndimage.binary_dilation(on, iterations=1)
    return np.dstack([rgb, al * 255.0])


def magenta(a, rosa=True):
    k, bg = fc.key_any(a)
    rgb, al = k[..., :3].copy(), k[..., 3]
    # rosa Stich (Rot und Blau über Grün): herausrechnen → Grau, leicht ins Braune
    ex = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None) * (al > 0)
    rgb[..., 0] -= ex * 0.85; rgb[..., 2] -= ex * 1.05; rgb[..., 1] += ex * 0.05
    # Reste am Saum: halbdurchsichtige Pixel mit Magenta-Farbton ganz weg
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    al = np.where((al < 200) & (r > g + 60) & (b > g + 60), 0, al)
    if rosa == 'grau':   # Schnee: rosa Stich → neutrales Grau gleicher Helligkeit (nicht braun)
        d = np.clip(np.minimum(r, b) - g, 0, None); m = np.clip((d - 4) / 14, 0, 1) * (al > 0); lum = 0.3 * r + 0.59 * g + 0.11 * b
        for c_, kk in enumerate((0.98, 1.0, 1.03)): rgb[..., c_] = rgb[..., c_] * (1 - m) + lum * kk * m
    elif rosa:   # rosa/malvenfarben (Blau nicht unter Grün bei Rotüberhang) → Braun wie die übrige Erde: Blau unter Grün, Rot etwas zurück
        d = r - g; pk = (d > 8) & (b >= g - 4) & (al > 0)
        rgb[..., 2] = np.where(pk, g - 0.6 * d, b); rgb[..., 0] = np.where(pk, r - 0.2 * d, r)
    return np.dstack([np.clip(rgb, 0, 255), al])


def mask_of(k):
    return k[..., 3] > 40


def cells_rows(k, rows):
    """Naht-Methode: waagerechte Nähte zwischen den Zeilen, senkrechte je Zeile. Liefert Masken je Zelle in Lesereihenfolge."""
    H, W = k.shape[:2]; op = mask_of(k)
    nr = len(rows)
    hs = [hseam(op, int(H * i / nr), int(H * 0.16)) for i in range(1, nr)]
    rowsY = np.arange(H)[:, None]; cols = np.arange(W)[None, :]
    out = []
    for j, n in enumerate(rows):
        m = np.ones((H, W), bool)
        if j > 0: m &= rowsY >= hs[j - 1][None, :]
        if j < nr - 1: m &= rowsY < hs[j][None, :]
        opr = op & m
        prof = ndimage.uniform_filter1d(opr.sum(0).astype(float), 15)
        xs = np.nonzero(prof > 0)[0]; xa, xb = xs.min(), xs.max(); L = xb - xa
        vs = [fc.seam(opr, int(xa + L * i / n), int(L * 0.12)) for i in range(1, n)]
        for q in range(n):
            c = m.copy()
            if q > 0: c &= cols >= vs[q - 1][:, None]
            if q < n - 1: c &= cols < vs[q][:, None]
            out.append(c)
    return out


def hseam(op, y0, w):
    xs = fc.seam(op.T.copy(), y0, w)   # Naht quer: Bild gedreht
    return xs


def cells_teile(k, n):
    op = mask_of(k); H, W = op.shape
    lab, cnt = ndimage.label(ndimage.binary_dilation(op, iterations=8))
    sz = ndimage.sum(op, lab, range(1, cnt + 1))
    big = sorted(range(1, cnt + 1), key=lambda i: -sz[i - 1])[:n]
    fo = ndimage.find_objects(lab)
    big = [i for i in big if sz[i - 1] > op.sum() * 0.02]
    big.sort(key=lambda i: ((fo[i - 1][0].start + fo[i - 1][0].stop) / 2 > H * 0.5 and fo[i - 1][0].start > H * 0.3, fo[i - 1][1].start))
    return [lab == i for i in big]


def cut(name):
    cfg = CFG[name]
    a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB'))
    H, W = a.shape[:2]
    if cfg.get('lauf_weg'): a = lauf_weg(a)
    if cfg.get('leeren'):   # Kästen auf Hintergrundfarbe setzen (mitgemalte Düsen/Rohre, Paket D 2026-11-24)
        a = a.copy(); bg = np.median(np.concatenate([a[3], a[-4]]), axis=0)
        for x0, y0, x1, y1 in cfg['leeren']: a[y0:y1, x0:x1] = bg
    k = schwarz(a) if cfg['bg'] == 'schwarz' else magenta(a, cfg.get('rosa', True))
    if cfg.get('blutsaum'):   # trockene Pinselränder, die ins Rosa übergehen: rosa Anteil wird durchsichtig und blutrot statt grau
        k = k.astype(np.float64).copy(); r_, g_, b_ = k[..., 0], k[..., 1], k[..., 2]
        pink = np.clip(((b_ - g_) - 12) / 40, 0, 1) * np.clip(((r_ - g_) - 30) / 40, 0, 1)
        k[..., 3] *= 1 - 0.9 * pink; blut = np.array([105., 16., 12.]); k[..., :3] = k[..., :3] * (1 - pink[..., None]) + blut * pink[..., None]
    cells = cells_rows(k, cfg['rows']) if 'rows' in cfg else cells_teile(k, cfg['teile'])
    parts = []
    for i, c in enumerate(cells, 1):
        if i in cfg.get('weg', []): continue
        t = k.copy(); t[~c, 3] = 0
        if cfg['bg'] == 'schwarz': t[~c, :3] = 0
        op = t[..., 3] > 40
        # Krümel der Nachbarzelle weg: nur Flächen nahe der größten behalten
        lab, n = ndimage.label(ndimage.binary_dilation(op, iterations=14))
        if n > 1 and cfg.get('kruemel', True):
            sz = ndimage.sum(op, lab, range(1, n + 1)); keep = lab == (1 + int(np.argmax(sz)))
            t[~keep, 3] = 0
            if cfg['bg'] == 'schwarz': t[~keep, :3] = 0
        ys, xs = np.nonzero(t[..., 3] > 0)
        if not len(ys): continue
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        if cfg['bg'] == 'magenta' and (x0 <= 8 or x1 >= W - 8 or y0 <= 8 or y1 >= H - 8) and 'teile' in cfg:
            print(f'  {name}: Teil {i} am Bildrand abgeschnitten, weggelassen'); continue
        pad = 4
        y0, x0 = max(0, y0 - pad), max(0, x0 - pad); y1, x1 = min(H, y1 + pad), min(W, x1 + pad)
        parts.append(t[y0:y1, x0:x1])
    s = MAXPX / max(max(p.shape[:2]) for p in parts)
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob(f'{name}_*.png'): f.unlink()
    res = []
    for j, p in enumerate(parts, 1):
        im = Image.fromarray(np.clip(p + 0.5, 0, 255).astype(np.uint8), 'RGBA')
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        if cfg['bg'] == 'schwarz':   # nach dem Verkleinern: Schwarz wieder rein, Alpha nur Maske
            q = np.asarray(im).astype(np.float64); mx = q[..., :3].max(2); q[mx < 10, :3] = 0
            q[..., 3] = np.where(ndimage.binary_dilation(mx >= 10, iterations=1), 255, 0); im = Image.fromarray(q.astype(np.uint8), 'RGBA')
        im.save(OUT / f'{name}_{j}.png'); res.append(f'{im.width}×{im.height}')
    print(f'{name}: {len(parts)} Varianten ({", ".join(res)})')


def embed():
    lines = ['// ===== ARMARGEDDON EFFEKTE (neue Effektbögen) =====',
             '// Erzeugt von tools/fx_cut.py aus ui-quelle/effekte/. Datendatei, nicht von Hand ändern, nicht komplett lesen.',
             '// Schlüssel <bogen>_<n> (ohne „fx_“), alle Teile eines Bogens im gleichen Maßstab (größtes Teil 320 px).',
             '// Leuchtende Bögen (muendung, explosion, feuer, funken, leuchtkugel): Schwarzgrund, im Spiel mit „lighter“ zeichnen.',
             'window.FXNEU = {']
    total = 0
    for f in sorted(OUT.glob('fx_*.png')):
        buf = io.BytesIO(); Image.open(f).save(buf, 'WEBP', quality=84, method=6, alpha_quality=100)
        u = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(); total += len(u)
        lines.append(f'"{f.stem[3:]}": "{u}",')
    lines.append('};')
    (ROOT / 'src' / 'fxneu.js').write_text('\n'.join(lines) + '\n', encoding='utf8', newline='\n')
    print('src/fxneu.js', total // 1024, 'KB')


if __name__ == '__main__':
    names = [a for a in sys.argv[1:] if not a.startswith('--')] or list(CFG)
    for n in names: cut(n)
    embed()
