"""Erzeugt src/uipanel.js: die Grafiken des Einheiten-Panels, verkleinert als WebP-Daten-URLs.

Aufruf:  python tools/panel_assets.py
Nur die Teile, die das Panel benutzt (Liste unten). Symbole auf höchstens 144 px.
Danach python tools/build.py.  src/uipanel.js ist eine Datendatei: nicht komplett lesen.
"""
import base64, io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEILE = ROOT / 'ui-quelle' / 'teile'
OUT = ROOT / 'src' / 'uipanel.js'

SYM = 144
# Schlüssel im Spiel -> (Teil, größte Kante in px)
PARTS = {
    'leiste': ('bogen1_rahmen/leiste_holz', 1400),
    'rahmen': ('bogen1_rahmen/rahmen_quadrat', 280),
    'tafel': ('bogen1_rahmen/tafel_messing', 380),
    'perg': ('bogen1_rahmen/pergament_klein', 480),
    'knopf': ('bogen2_buttons/knopf_rost_1', 150),
    'knopfAn': ('bogen2_buttons/knopf_rost_1_gewaehlt', 150),
    'knopfAus': ('bogen2_buttons/knopf_rost_1_gesperrt', 150),
    'balken': ('bogen2_buttons/balken_1', 640),
    'punkt': ('bogen2_buttons/punkt_voll', 56),
    'punktLeer': ('bogen2_buttons/punkt_leer_1', 56),
    'platte': ('bogen2_buttons/platte_1', 120),
    # Fraktionswappen: Emblem allein (Marken) und Emblem vor Flagge (Zielfelder, Startmenü)
    'wA': ('wappen_konkordat/w_emblem', 128),
    'wD': ('wappen_aschenwacht/w_emblem', 128),
    'fA': ('wappen_konkordat/w_flagge', 300),
    'fD': ('wappen_aschenwacht/w_flagge', 300),
    'wF': ('wappen_legion/w_emblem', 128),      # Blaue Legion (zweites Bilderset des Konkordats)
    'fF': ('wappen_legion/w_flagge', 300),
    # Wimpel an eroberten Zielmarken: Stange unten gekürzt (dritter Wert = behaltener Anteil der Höhe)
    'pA': ('wimpel_fraktionen/wimpel_konkordat', 160, 0.62),
    'pD': ('wimpel_fraktionen/wimpel_aschenwacht', 160, 0.62),
    'pF': ('wimpel_fraktionen/wimpel_legion', 160, 0.62),
}
SYMBOLS = {
    'bogen3b_symbole': ['zielen', 'nahkampf', 'marsch', 'fahne', 'gas', 'granate_artillerie', 'sanitaeter',
                        'blitz', 'handgranate', 'gewehr', 'pferd', 'sanduhr', 'zahnrad', 'fernglas', 'schild'],
    'bogen4a_symbole': ['drahtschere', 'drahtrolle', 'auge', 'haken', 'drehpfeil', 'mg_dreibein', 'sperrfeuer',
                        'lafette', 'flamme'],
    'bogen4b_symbole': ['meldehund', 'schraubenschluessel', 'nebel', 'spitzhacke', 'sprengladung', 'tellermine',
                        'scheinwerfer', 'gasmaske', 'munitionskiste'],
    # Zustandsmarken (Karte und Panel)
    'bogen4c_symbole': ['niedergehalten', 'flucht', 'gebrochen', 'festgefahren', 'durchsickern'],
}
# Deckungsschilde: gemaltes s_schild, per Verlaufsabbildung (Helligkeit -> Farbe) eingefärbt
COVER = {
    'cov1': [(0, '1a0e06'), (.35, '5c2c10'), (.7, 'a8592a'), (1, 'eca474')],   # Bronze
    'cov2': [(0, '15171a'), (.35, '585d64'), (.7, 'aeb3ba'), (1, 'f4f5f7')],   # Silber
    'cov3': [(0, '221604'), (.35, '7a5408'), (.7, 'd6a32a'), (1, 'fff0a0')],   # Gold
}
for sheet, names in SYMBOLS.items():
    for n in names:
        PARTS['s_' + n] = (f'{sheet}/s_{n}', SYM)
for k, stops in COVER.items():
    PARTS[k] = ('bogen3b_symbole/s_schild', 96, 1.0, stops)


def tint(im, stops):
    import numpy as np
    a = np.asarray(im).astype(float) / 255
    lum = 0.3 * a[..., 0] + 0.59 * a[..., 1] + 0.11 * a[..., 2]
    lo, hi = np.percentile(lum[a[..., 3] > 0.5], [3, 97])
    L = np.clip((lum - lo) / (hi - lo), 0, 1)
    xs = [x for x, _ in stops]
    cs = np.array([[int(c[i:i + 2], 16) for i in (0, 2, 4)] for _, c in stops]) / 255
    rgb = np.stack([np.interp(L, xs, cs[:, i]) for i in range(3)], -1)
    return Image.fromarray((np.dstack([rgb, a[..., 3]]) * 255).astype('uint8'), 'RGBA')


def data_url(key, edge, keep=1.0, stops=None):
    im = Image.open(TEILE / f'{key}.png').convert('RGBA')
    if stops:
        im = tint(im, stops)
    if keep < 1:
        im = im.crop((0, 0, im.width, round(im.height * keep)))
    k = edge / max(im.size)
    if k < 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=84, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


def main():
    lines = ['// ===== ARMARGEDDON EINHEITEN-PANEL: GRAFIKEN =====',
             '// Erzeugt von tools/panel_assets.py aus ui-quelle/teile. Datendatei, nicht von Hand ändern.',
             'window.UIPANEL = {']
    total = 0
    for k, (src, edge, *keep) in PARTS.items():
        u = data_url(src, edge, *keep)
        total += len(u)
        lines.append(f'"{k}": "{u}",')
    lines.append('};')
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8', newline='\n')
    print(OUT, len(PARTS), 'Teile,', round(total / 1024), 'KB')


if __name__ == '__main__':
    main()
