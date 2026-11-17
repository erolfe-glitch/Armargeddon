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

SYM = 192   # Fähigkeiten-Knopf bis 84 px, Symbol ~64 px: reicht bis devicePixelRatio 3
# Schlüssel im Spiel -> (Teil, größte Kante in px)
PARTS = {
    'leiste': ('bogen1_rahmen/leiste_holz', 1951),   # volle Quellgröße: Panel 1920 px breit, nie hochskalieren (border-image-slice in index.html passt dazu)
    'rahmen': ('bogen1_rahmen/rahmen_quadrat', 524),
    'tafel': ('bogen1_rahmen/tafel_messing', 542),
    'perg': ('bogen1_rahmen/pergament_klein', 507),
    'knopf': ('bogen2_buttons/knopf_rost_1', 293),
    'knopfAn': ('bogen2_buttons/knopf_rost_1_gewaehlt', 293),
    'knopfAus': ('bogen2_buttons/knopf_rost_1_gesperrt', 293),
    'balken': ('bogen2_buttons/balken_1', 825),
    'punkt': ('bogen2_buttons/punkt_voll', 56),
    'punktLeer': ('bogen2_buttons/punkt_leer_1', 56),
    'platte': ('bogen2_buttons/platte_1', 200),
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
    # Stellungswechsel: MG auf-/abbauen, Auf-/Abprotzen (Knöpfe und Zustandsmarken)
    'bogen6_stellung': ['mg_auf', 'mg_ab', 'aufprotzen', 'abprotzen'],
    # abgeleitet (tools/sym_ableiten.py, 2026-11-17): Stiefel ohne Flügel = normales Ziehen, Garbe = MG-Sperrfeuer
    'abgeleitet': ['stiefel', 'garbe'],
}
# Kartenmarken (ui-quelle/kartenmarken.png): heile Deckungsschilde, Anführer-Orden, Aktionspunkt-Münzen
PARTS.update({
    'cov1': ('kartenmarken/schild_bronze', 96), 'cov2': ('kartenmarken/schild_silber', 96), 'cov3': ('kartenmarken/schild_gold', 96),
    'orden': ('kartenmarken/orden', 96), 'muenze': ('kartenmarken/muenze_voll', 64), 'muenzeLeer': ('kartenmarken/muenze_leer', 64),
})
# Kachelbare Flächen und Rahmen für 9-Slice (tools/ui_textures.py): Flächen immer gekachelt in Originalgröße, nie gestreckt
PARTS.update({
    'txBronze': ('texturen/bronze', 496), 'txEisen': ('texturen/eisen', 496), 'txHolz': ('texturen/holz', 496), 'txPerg': ('texturen/pergament', 496),
    'r9': ('texturen/rahmen9', 524), 't9': ('texturen/tafel9', 542), 'l9': ('texturen/leiste9', 1951), 'p9': ('texturen/perg9', 507),
})
for sheet, names in SYMBOLS.items():
    for n in names:
        PARTS['s_' + n] = (f'{sheet}/s_{n}', SYM)


def data_url(key, edge, keep=1.0):
    im = Image.open(TEILE / f'{key}.png').convert('RGBA')
    if keep < 1:
        im = im.crop((0, 0, im.width, round(im.height * keep)))
    k = edge / max(im.size)
    if k < 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=88, method=6)
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
