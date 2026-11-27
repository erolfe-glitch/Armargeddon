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
    # Fraktionswappen allein (Marken, Rundenschild, Siegbild): seit 2026-11-20 aus den Banner-Bögen (Konkordat goldener Löwe);
    # die alten Embleme liegen noch in teile/wappen_*/w_emblem.png
    'wA': ('banner_konkordat/b_wappen', 192),
    'wD': ('banner_aschenwacht/b_wappen', 192),
    'wF': ('banner_blaue_legion/b_wappen', 192),      # Blaue Legion (zweites Bilderset des Konkordats)
    # Fraktionsbanner im Startmenü (2026-11-20, ui-quelle/banner/): ersetzen die alten Flaggen-Fassungen w_flagge
    # (Union-Jack-, Schwarz-Weiß-Rot- und Trikolore-Tuch); die alten Teile liegen noch in teile/wappen_*/w_flagge.png
    'fA': ('banner_konkordat/b_banner', 400),
    'fD': ('banner_aschenwacht/b_banner', 400),
    'fF': ('banner_blaue_legion/b_banner', 400),
    # Wimpel an eroberten Zielmarken (seit 2026-11-20 neuer Bogen ui-quelle/banner/wimpel.png ohne Farben echter Flaggen;
    # alte Teile in teile/wimpel_fraktionen/): Stange unten gekürzt (dritter Wert = behaltener Anteil der Höhe)
    'pA': ('wimpel/wimpel_konkordat', 192, 0.8),
    'pD': ('wimpel/wimpel_aschenwacht', 192, 0.8),
    'pF': ('wimpel/wimpel_legion', 192, 0.8),
}
SYMBOLS = {
    'bogen3c_symbole': ['zielen', 'nahkampf', 'marsch', 'fahne', 'gas', 'granate_artillerie', 'sanitaeter',
                        'blitz', 'handgranate', 'gewehr', 'pferd', 'sanduhr', 'zahnrad', 'fernglas', 'schild',
                        'totenkopf'],   # Totenkopf: Kopfzeichen „vergiftet“ (grün getönt, 2026-11-18)
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
    # Einzelsymbol (ui-quelle/symbol_schaufel.png, 2026-11-18): Eingraben
    'symbol_schaufel': ['schaufel'],
    'symbol_zwei_schlaege': ['zweischlag'],
    # Fähigkeiten (bogen8a, 2026-11-22): kein Symbol mit zwei Bedeutungen
    'bogen8b_befehle': ['sammeln', 'sturmbefehl', 'feuerfrei', 'halten', 'generalangriff', 'markieren', 'feuerschlag', 'feuerbereit'],   # Befehle (2026-11-22)
    'bogenD_symbole': ['abwehr', 'panzer_leicht', 'panzer_schwer', 'einmal', 'held', 'einzig', 'furcht', 'ansturm'],   # UI1 Teil 2 (Punkt 144)
    'bogenE_symbole': ['weit', 'ziehen_feuern', 'stecken', 'geschuetzturm', 'sicht', 'zweischlag_alt', 'kettensaege', 'schwer_nah'],   # zweischlag_alt: schwarze Fassung, ersetzt durch symbol_zwei_schlaege
    'bogenC_symbole': ['sprenglanze', 'rammen', 'gegen_panzer', 'einholen'],   # Bogen C (2026-11-22): doppelte Symbole aufgelöst (nur die gewählten Fassungen)
    'bogen8a_faehigkeiten': ['durchbruch', 'hinrichtung', 'sturmrollen', 'sturmlauf', 'sprung', 'gebruell', 'kanone_zweit', 'panzergranate', 'breitseite'],
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
# Zustandszeichen über den Köpfen (bogen7, 2026-11-19): Schlüssel k_<art> (ohne Reserve)
for n in ['blitze', 'tropfen', 'schweiss', 'angst', 'gas', 'gift', 'feuer', 'panne', 'klingen', 'wut', 'auge', 'pfeil', 'garbe', 'funkeln', 'kreuz']:
    PARTS['k_' + n] = (f'bogen7_zustandszeichen/k_{n}', SYM)
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
