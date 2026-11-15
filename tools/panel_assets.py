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
}
SYMBOLS = {
    'bogen3b_symbole': ['zielen', 'nahkampf', 'marsch', 'fahne', 'gas', 'granate_artillerie', 'sanitaeter',
                        'blitz', 'handgranate', 'gewehr', 'pferd', 'sanduhr'],
    'bogen4a_symbole': ['drahtschere', 'drahtrolle', 'auge', 'haken', 'drehpfeil', 'mg_dreibein', 'sperrfeuer',
                        'lafette', 'flamme'],
    'bogen4b_symbole': ['meldehund', 'schraubenschluessel', 'nebel', 'spitzhacke', 'sprengladung', 'tellermine',
                        'scheinwerfer', 'gasmaske', 'munitionskiste'],
}
for sheet, names in SYMBOLS.items():
    for n in names:
        PARTS['s_' + n] = (f'{sheet}/s_{n}', SYM)


def data_url(key, edge):
    im = Image.open(TEILE / f'{key}.png').convert('RGBA')
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
    for k, (src, edge) in PARTS.items():
        u = data_url(src, edge)
        total += len(u)
        lines.append(f'"{k}": "{u}",')
    lines.append('};')
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8', newline='\n')
    print(OUT, len(PARTS), 'Teile,', round(total / 1024), 'KB')


if __name__ == '__main__':
    main()
