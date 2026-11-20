"""Schneidet die UI-Bögen des Nutzers (Magenta-Hintergrund, JPG) in einzelne PNG-Teile.

Aufruf:  python tools/ui_cut.py [bogen ...]  -> nur die genannten Bögen (ohne Angabe alle); schreibt ui-quelle/teile/<bogen>/<name>.png und teile/uebersicht.png
Magenta wird weich freigestellt (Alpha aus dem Magenta-Anteil), Farbsäume werden entfärbt.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'ui-quelle'
OUT = SRC / 'teile'

# Namen je Bogen in Leserichtung (Zeilen von oben, innerhalb einer Zeile von links).
NAMES = {
    'bogen1_rahmen': ['rahmen_breit', 'rahmen_quadrat', 'pergament_klein', 'rahmen_klein',
                      'rahmen_draht', 'pergament_gross', 'stoffbanner',
                      'leiste_holz', 'tafel_messing'],
    'bogen2_buttons': ['knopf_rost_1', 'knopf_rost_1_gewaehlt', 'knopf_rost_1_gesperrt',
                       'knopf_rost_2', 'knopf_rost_2_gewaehlt', 'knopf_rost_2_gesperrt',
                       'knopf_rost_3', 'knopf_rost_3_gewaehlt', 'knopf_rost_3_gesperrt',
                       'rund_1', 'rund_2', 'rund_3', 'rund_4',
                       'platte_1', 'platte_2', 'platte_3', 'platte_4',
                       'balken_1', 'balken_2', 'balken_3',
                       'punkt_voll', 'punkt_leer_1', 'punkt_leer_2', 'punkt_leer_3', 'punkt_leer_4'],
    'bogen3c_symbole': [   # Symbolbogen (2026-11-18, ersetzt bogen3/bogen3b mit gleicher Anordnung)
                       's_zielen', 's_nahkampf', 's_marsch', 's_fahne',
                       's_totenkopf', 's_schild', 's_gas', 's_granate_artillerie',
                       's_zahnrad', 's_sanitaeter', 's_blitz', 's_handgranate',
                       's_gewehr', 's_pferd', 's_fernglas', 's_sanduhr'],
}
NAMES['bogen4a_symbole'] = ['s_drahtschere', 's_drahtrolle', 's_auge', 's_haken', 's_drehpfeil', 's_mg_dreibein',
                            's_sperrfeuer', 's_lafette', 's_flamme']
NAMES['bogen4b_symbole'] = ['s_meldehund', 's_schraubenschluessel', 's_nebel', 's_spitzhacke', 's_sprengladung',
                            's_tellermine', 's_scheinwerfer', 's_gasmaske', 's_munitionskiste']
NAMES['bogen4c_symbole'] = ['s_panzerbrecher', 's_durchsickern', 's_niedergehalten', 's_flucht', 's_gebrochen',
                            's_festgefahren', 's_walze']
# Stellungswechsel (2026-11-16): MG aufbauen, MG abbauen, Aufprotzen, Abprotzen (2×2, Pfeile gehören zum Symbol)
NAMES['bogen6_stellung'] = ['s_mg_auf', 's_mg_ab', 's_aufprotzen', 's_abprotzen']
# Zustandszeichen über den Köpfen (2026-11-19, 4×4, Nahtschnitt): ersetzen die Code-Platzhalter in ui.js (kzMalen); k_reserve nur abgelegt
NAMES['bogen7_zustandszeichen'] = ['k_blitze', 'k_tropfen', 'k_schweiss', 'k_angst', 'k_gas', 'k_gift', 'k_feuer', 'k_panne',
                                   'k_klingen', 'k_wut', 'k_auge', 'k_pfeil', 'k_garbe', 'k_funkeln', 'k_kreuz', 'k_reserve']
# Einzelsymbol Schaufel (2026-11-18): Eingraben (Knopf und Zustandsmarke), ersetzt dort die Spitzhacke
NAMES['symbol_schaufel'] = ['s_schaufel']
# Fraktionswappen: links Emblem vor Flagge, rechts Emblem allein
NAMES['wappen_konkordat'] = ['w_flagge', 'w_emblem']
NAMES['wappen_aschenwacht'] = ['w_flagge', 'w_emblem']
NAMES['wappen_legion'] = ['w_flagge', 'w_emblem']
# Neue Fraktionsbanner (2026-11-20, ui-quelle/banner/): links Banner an der Querstange, rechts Wappen allein.
# Ersetzen die alten Flaggen-Fassungen (w_flagge mit Union-Jack-, Trikolore- und Schwarz-Weiß-Rot-Tuch) im Startmenü.
for _b in ['banner_konkordat', 'banner_aschenwacht', 'banner_blaue_legion']:
    NAMES[_b] = ['b_banner', 'b_wappen']
# Wimpel der Zielmarken (obere Leiste), mit Stange und Messingknauf: Konkordat, Aschenwacht, Blaue Legion
NAMES['wimpel_fraktionen'] = ['wimpel_konkordat', 'wimpel_aschenwacht', 'wimpel_legion']
# Kartenmarken (Einheiten auf der Karte): heile Deckungsschilde, Anführer-Orden, Aktionspunkt-Münzen
NAMES['kartenmarken'] = ['schild_bronze', 'schild_silber', 'schild_gold', 'orden', 'muenze_voll', 'muenze_leer']
MERGE = {'bogen1_rahmen': 18, 'bogen2_buttons': 6}
# Bögen mit festem Raster (Spalten, Zeilen): Stücke werden nach ihrer Mitte der Rasterzelle zugeordnet,
# so bleiben Funken und Splitter beim Symbol, auch wenn die Symbole eng stehen.
GRID = {'bogen4a_symbole': (3, 3), 'bogen4b_symbole': (3, 3), 'bogen4c_symbole': (3, 3),
        'wappen_konkordat': (2, 1), 'wappen_aschenwacht': (2, 1), 'wappen_legion': (2, 1),
        'wimpel_fraktionen': (3, 1), 'kartenmarken': (3, 2), 'bogen6_stellung': (2, 2), 'symbol_schaufel': (1, 1),
        'banner_konkordat': (2, 1), 'banner_aschenwacht': (2, 1), 'banner_blaue_legion': (2, 1)}
# Bögen mit Nahtschnitt (wie figure_cut): je Rasterlinie eine Naht durch den freien Hintergrund (geringste Deckung),
# die Zellen dazwischen sind die Teile. Splitter und Funken bleiben so sicher beim eigenen Symbol.
# bogen3c_symbole (2026-11-18): neue Fassung von bogen3b, gleiche Anordnung, ersetzt sie im Spiel.
SEAM = {'bogen3c_symbole': (4, 4), 'bogen7_zustandszeichen': (4, 4)}


def naht(cost, pos, band):
    """Senkrechte Naht von oben nach unten (je Zeile höchstens 1 px seitlich) im Streifen pos±band; liefert x je Zeile."""
    h, w = cost.shape
    x0, x1 = max(0, pos - band), min(w, pos + band)
    c = cost[:, x0:x1] + np.abs(np.arange(x0, x1) - pos)[None, :] * 1e-3   # bei Gleichstand nahe der Rasterlinie
    acc = c.copy(); back = np.zeros(c.shape, dtype=np.int8)
    for y in range(1, h):
        prev = acc[y - 1]
        cand = np.stack([np.r_[np.inf, prev[:-1]], prev, np.r_[prev[1:], np.inf]])
        k = cand.argmin(0); acc[y] += cand[k, np.arange(len(prev))]; back[y] = k - 1
    xs = np.zeros(h, dtype=int); xs[-1] = int(acc[-1].argmin())
    for y in range(h - 1, 0, -1):
        xs[y - 1] = xs[y] + back[y, xs[y]]
    return xs + x0


def seam_parts(rgba, cols, rows):
    a = rgba[..., 3].astype(np.float64) / 255
    cost = a * 1000 + 1
    h, w = a.shape
    vs = [naht(cost, round(i * w / cols), round(w / cols * 0.3)) for i in range(1, cols)]        # x je Zeile
    hs = [naht(cost.T, round(i * h / rows), round(h / rows * 0.3)) for i in range(1, rows)]      # y je Spalte
    for v in vs:   # Prüfung: eine Naht soll nur durch Hintergrund laufen
        if a[np.arange(h), v].max() > 0.1: print(f'  senkrechte Naht schneidet Deckung {a[np.arange(h), v].max():.2f}', file=sys.stderr)
    for hh in hs:
        if a[hh, np.arange(w)].max() > 0.1: print(f'  waagerechte Naht schneidet Deckung {a[hh, np.arange(w)].max():.2f}', file=sys.stderr)
    yy, xx = np.mgrid[0:h, 0:w]
    col = sum((xx >= v[:, None]).astype(int) for v in vs)
    row = sum((yy >= hh[None, :]).astype(int) for hh in hs)
    out = []
    for r in range(rows):
        for c in range(cols):
            mask = (row == r) & (col == c) & (a > 0.03)
            lab, n = ndimage.label(mask)
            if n:   # Einzelpixel-Rauschen weg, Splitter (ab 20 px) bleiben
                size = ndimage.sum(mask, lab, range(1, n + 1))
                mask = np.isin(lab, 1 + np.nonzero(size >= 20)[0])
            ys, xs = np.nonzero(mask)
            out.append([xs.min(), ys.min(), xs.max() + 1, ys.max() + 1, mask])
    return out


def grid_parts(rgba, cols, rows):
    solid = rgba[..., 3] > 128
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=2))
    h, w = solid.shape
    cells = {}
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        own = lab[sl] == i
        if own.sum() < 40:
            continue
        cy, cx = ndimage.center_of_mass(own)
        c = (min(rows - 1, int((sl[0].start + cy) / h * rows)), min(cols - 1, int((sl[1].start + cx) / w * cols)))
        cells.setdefault(c, []).append((sl, i))
    out = []
    for c in sorted(cells):
        mask = np.zeros_like(solid)
        for sl, i in cells[c]:
            mask[sl] |= lab[sl] == i
        ys, xs = np.nonzero(mask)
        out.append([xs.min(), ys.min(), xs.max() + 1, ys.max() + 1, mask])
    return out  # Pixel: kleine Stücke (Draht, Funken) zusammenfassen


def key(img):
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g                     # Magenta-Anteil
    bgmask = m > 150
    M = np.median(a[bgmask], axis=0)             # tatsächliche Hintergrundfarbe
    mb = np.median(m[bgmask])
    alpha = 1.0 - np.clip(m / mb, 0, 1)
    alpha = np.clip((alpha - 0.08) / 0.84, 0, 1)  # JPG-Rauschen abschneiden
    # Hintergrundanteil herausrechnen (Unpremultiply)
    aa = np.maximum(alpha, 1e-3)[..., None]
    fg = (a - (1 - aa) * M) / aa
    fg = np.clip(fg, 0, 255)
    # Restlichen Magenta-Stich entfernen: R und B nicht über G + Spielraum, wo Magenta dominiert
    r2, g2, b2 = fg[..., 0], fg[..., 1], fg[..., 2]
    spill = np.minimum(r2, b2) - g2
    lim = np.where(spill > 4, spill - 4, 0)       # Bögen enthalten kein echtes Magenta/Violett
    fg[..., 0] -= lim; fg[..., 2] -= lim
    fg = np.where(alpha[..., None] > 0, fg, 0)
    # Ganz dünne Saum-Pixel leicht zurücknehmen
    alpha = ndimage.grey_erosion(alpha, size=2) * 0.35 + alpha * 0.65
    return np.dstack([fg, alpha * 255]).clip(0, 255).astype(np.uint8)


def parts(rgba, merge):
    solid = rgba[..., 3] > 128
    grown = ndimage.binary_dilation(solid, iterations=merge)
    lab, n = ndimage.label(grown)
    boxes = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        ys, xs = sl
        area = (lab[sl] == i).sum()
        if area < 3000:
            continue
        own = (lab == i)
        y0, y1 = ys.start + merge, ys.stop - merge
        x0, x1 = xs.start + merge, xs.stop - merge
        boxes.append([x0, y0, x1, y1, own])
    # Zeilen bilden: sortiert nach Mitte y, Zeilenbruch wenn Abstand > halbe Höhe
    boxes.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows, cur = [], []
    for b in boxes:
        cy = (b[1] + b[3]) / 2
        if cur and cy - (cur[-1][1] + cur[-1][3]) / 2 > 0.35 * (cur[-1][3] - cur[-1][1]):
            # Neue Zeile nur, wenn der Teil nicht mit der aktuellen Zeile überlappt
            if b[1] > min(c[3] for c in cur) - 10:
                rows.append(cur); cur = []
        cur.append(b)
    if cur:
        rows.append(cur)
    return [b for r in rows for b in sorted(r, key=lambda b: b[0])]


def main():
    OUT.mkdir(exist_ok=True)
    only = set(sys.argv[1:])
    idx = OUT / 'teile.json'
    index = json.loads(idx.read_text(encoding='utf-8')) if only and idx.exists() else {}
    for sheet, names in NAMES.items():
        if only and sheet not in only:
            continue
        src = next(SRC.glob(sheet + '*'), None) or next((SRC / 'banner').glob(sheet + '*'))   # Banner liegen im Unterordner banner/
        rgba = key(Image.open(src))
        ps = seam_parts(rgba, *SEAM[sheet]) if sheet in SEAM else grid_parts(rgba, *GRID[sheet]) if sheet in GRID else parts(rgba, MERGE[sheet])
        if len(ps) != len(names):
            print(f'{sheet}: {len(ps)} Teile gefunden, {len(names)} Namen erwartet', file=sys.stderr)
        d = OUT / sheet
        d.mkdir(exist_ok=True)
        for old in d.glob('*.png'):
            old.unlink()
        for j, (x0, y0, x1, y1, own) in enumerate(ps):
            name = names[j] if j < len(names) else f'teil_{j + 1}'
            pad = 3
            x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
            x1, y1 = min(rgba.shape[1], x1 + pad), min(rgba.shape[0], y1 + pad)
            crop = rgba[y0:y1, x0:x1].copy()
            crop[..., 3] = np.where(own[y0:y1, x0:x1], crop[..., 3], 0)  # Nachbarteile ausblenden
            Image.fromarray(crop).save(d / f'{name}.png', optimize=True)
            index[f'{sheet}/{name}'] = [int(x1 - x0), int(y1 - y0)]
            print(f'{sheet}/{name}: {x1 - x0}x{y1 - y0}')
    (OUT / 'teile.json').write_text(json.dumps(index, indent=1), encoding='utf-8')
    overview(index)


def overview(index):
    """Kontaktbogen aller Teile auf Schachbrett (zeigt Transparenz), mit Namen."""
    from PIL import ImageDraw, ImageFont
    cell, cols, lab = 210, 8, 22
    keys = list(index)
    rows = (len(keys) + cols - 1) // cols
    W, H = cols * cell, rows * (cell + lab)
    sheet = Image.new('RGBA', (W, H), (40, 34, 30, 255))
    chk = Image.new('RGBA', (cell - 10, cell - 10))
    cd = ImageDraw.Draw(chk)
    for y in range(0, cell, 12):
        for x in range(0, cell, 12):
            cd.rectangle([x, y, x + 11, y + 11], fill=(150, 150, 150, 255) if (x + y) // 12 % 2 else (205, 205, 205, 255))
    try:
        font = ImageFont.truetype('segoeui.ttf', 15)
    except OSError:
        font = ImageFont.load_default()
    d = ImageDraw.Draw(sheet)
    for i, k in enumerate(keys):
        cx, cy = (i % cols) * cell, (i // cols) * (cell + lab)
        sheet.paste(chk, (cx + 5, cy + 5))
        im = Image.open(OUT / f'{k}.png')
        im.thumbnail((cell - 20, cell - 20))
        sheet.alpha_composite(im, (cx + (cell - im.width) // 2, cy + (cell - im.height) // 2))
        d.text((cx + 6, cy + cell - 2), k.split('/')[1], fill=(240, 237, 225, 255), font=font)
    sheet.convert('RGB').save(OUT / 'uebersicht.png')


if __name__ == '__main__':
    main()
