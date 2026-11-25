# Bildwirkung der Figuren (2026-11-19): Plastizität einmal beim Bauen vorberechnen, nicht pro Bild im Spiel.
# Für jedes Spielbild aus ui-quelle/teile/figuren/ entsteht eine Helligkeits-Korrekturkarte (Graustufen, 128 = unverändert):
#   - Klarheit: lokaler Kontrast auf zwei Größen (feine Zeichnung und mittlere Formen), Mittelwert nur über die Figur (Alpha-gewichtet),
#     damit der freie Rand keinen hellen oder dunklen Saum bekommt;
#   - Glanzlichter: helle, wenig farbige Flächen (Metall: Helme, Läufe, Bajonette, Rüstungsplatten) etwas heller, örtliche Spitzlichter stärker.
# Die Karte gilt für die Stufe „stark“; das Spiel mischt sie für „leicht“ zur Hälfte bei (ui.js Abschnitt „Bildwirkung“), Farbe und Sättigung
# bleiben dort. Ergebnis: src/figsplastik.js (window.FIGSP, Datendatei, nicht komplett lesen).
# Aufruf: python tools/figur_plastik.py [schlüssel …] [--probe ordner]   (--probe: Vorher/Nachher-Bilder statt Datendatei)
import sys, io, base64
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, maximum_filter

ROOT = Path(__file__).resolve().parent.parent
GAME = ROOT / 'ui-quelle' / 'teile' / 'figuren'
# Gelände-Bausteine (seit 2026-11-19, Sankt Ruß): nur die neuen Teile, damit der Grauwall unverändert bleibt. Schlüssel „gel_<name>“,
# im Spiel in ui.js gbBereit eingerechnet (nur die Karte, ohne Farbänderung). Wandstücke (Kachelstreifen) werden waagrecht umlaufend gefiltert.
GELAENDE = ROOT / 'ui-quelle' / 'teile' / 'gelaende'
GEL_TEILE = ('zaun', 'kirche_hinten', 'kirche_vorn', 'mauer_niedrig', 'kirchturm_', 'kirche_innen_', 'friedhof_', 'dorf_aufsteller_',
             'haus_heil_', 'kapelle', 'haus_ruine_schnee_', 'tanne_schnee_', 'baum_tot_schnee_', 'bruecke_stein_', 'brunnen_schnee', 'holzstapel_',
             'karren_schnee', 'schilf', 'ufer_schnee', 'unterholz_schnee',
             'graben_querwand_', 'graben_brustwehr', 'graben_rueckwall', 'graben_ecke_', 'graben_leiter_', 'graben_unterstand', 'graben_stahlschild_',
             'graben_kiste', 'graben_kanister', 'graben_balken', 'graben_drahtrolle', 'graben_einsturz', 'graben_eimer', 'graben_spaten',
             'hecke_schnee_', 'heuhaufen_schnee_', 'vogelscheuche_schnee', 'pflug_schnee', 'drahtguertel_')   # G2b/G3b (2026-11-25): neue Graben- und Feldteile   # Krähenfurt (2026-11-22, Flux); zaun deckt zaun_schnee mit ab
GEL_WAND = {'zaun', 'kirche_hinten', 'kirche_vorn', 'mauer_niedrig', 'zaun_schnee', 'ufer_schnee', 'unterholz_schnee', 'graben_brustwehr', 'graben_rueckwall', 'hecke_schnee_1', 'hecke_schnee_2'}
SKALA = 510   # Grauwert = 128 + Δ · SKALA  (Δ höchstens ±0,25)
# Stärken für „stark“ (Bildhöhe 320 px = 1 Soldat; Radien in px dieser Größe, bei größeren Bildern mit der Bildhöhe/320 skaliert)
FEIN, FEIN_A = 1.6, 0.45      # feine Zeichnung (Nähte, Riemen, Kanten)
MITTEL, MITTEL_A = 6.0, 0.7   # mittlere Formen (Falten, Volumen von Helm, Mantel, Rumpf)
GROSS, GROSS_A = 16.0, 0.3    # große Formen (Licht und Schatten über die ganze Figur)
GLANZ_A, SPITZ_A = 0.22, 0.18


def blur_maskiert(v, a, sig, mode='reflect'):
    """Alpha-gewichtete Unschärfe: der transparente Rand zählt nicht mit."""
    num, den = gaussian_filter(v * a, sig, mode=mode), gaussian_filter(a, sig, mode=mode)
    return np.where(den > 1e-3, num / np.maximum(den, 1e-3), v)


def karte(im, wrap=False):
    a = np.asarray(im.convert('RGBA')).astype(np.float64) / 255
    rgb, al = a[..., :3], a[..., 3]
    k = max(1.0, im.height / 320)   # Schreiter, Panzer: Bild höher als ein Soldat → Radien mitwachsen lassen (Maßstab 320 px je Soldat)
    k = min(k, 2.2)
    L = rgb @ np.array([0.299, 0.587, 0.114])
    m = (al > 0.5).astype(np.float64)
    md = ('reflect', 'wrap') if wrap else 'reflect'
    d = FEIN_A * (L - blur_maskiert(L, m, FEIN * k, md)) + MITTEL_A * (L - blur_maskiert(L, m, MITTEL * k, md)) + GROSS_A * (L - blur_maskiert(L, m, GROSS * k, md))
    # Metall: hell und wenig farbig
    mx, mn = rgb.max(-1), rgb.min(-1); sat = (mx - mn) / np.maximum(mx, 1e-3)
    metall = np.clip((L - 0.42) / 0.3, 0, 1) * np.clip((0.32 - sat) / 0.2, 0, 1)
    metall = gaussian_filter(metall, 0.8)
    spitz = np.clip(L - gaussian_filter(L, 2.5 * k, mode=md), 0, None) * (L >= maximum_filter(L, 3) - 0.02)
    d += GLANZ_A * metall * np.clip(L - 0.4, 0, 1) + SPITZ_A * metall * spitz * 4
    d = np.clip(d, -0.25, 0.25) * m
    return d, rgb, al


def anwenden(rgb, d, f):
    return np.clip(rgb + d[..., None] * f, 0, 1)


def main():
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    probe = sys.argv[sys.argv.index('--probe') + 1] if '--probe' in sys.argv else None
    if probe: args = [x for x in args if x != probe]
    files = [f for f in sorted(GAME.glob('*.png')) if f.stem not in ('aschenwacht_eisenknecht', 'konkordat_kreuzschreiter')] + sorted(f for f in GELAENDE.glob('*.png') if f.stem.startswith(GEL_TEILE))
    if args and not probe: sys.exit('Mit Namen nur zusammen mit --probe (die Datendatei enthält immer alle Bilder).')
    if args: files = [f for f in files if f.stem in args]
    lines = ['// ===== ARMARGEDDON BILDWIRKUNG DER FIGUREN =====',
             '// Erzeugt von tools/figur_plastik.py aus ui-quelle/teile/figuren/. Datendatei, nicht von Hand ändern, nicht komplett lesen.',
             f'// Je Figurenbild eine Helligkeits-Korrekturkarte in halber Auflösung (Graustufen-WebP, 128 = unverändert, Δ = (Grau − 128) / {SKALA}), Stufe „stark“.',
             'window.FIGSP = {']
    total = 0
    for f in files:
        gel = f.parent == GELAENDE
        im = Image.open(f); d, rgb, al = karte(im, wrap=gel and f.stem in GEL_WAND)
        if probe:
            out = Path(probe); out.mkdir(parents=True, exist_ok=True)
            row = [np.dstack([anwenden(rgb, d, x), al]) for x in (0, 0.5, 1)]
            bg = np.ones_like(row[0]); bg[..., :3] = [0.36, 0.33, 0.27]
            row = [r[..., :3] * r[..., 3:] + bg[..., :3] * (1 - r[..., 3:]) for r in row]
            Image.fromarray((np.hstack(row) * 255 + 0.5).astype(np.uint8)).save(out / (f.stem + '.png'))
            continue
        g = np.clip(128 + d * SKALA + 0.5, 0, 255).astype(np.uint8)
        gi = Image.fromarray(g, "L"); gi = gi.resize((max(1, gi.width // 2), max(1, gi.height // 2)), Image.BOX)   # halbe Auflösung: im Spiel erscheinen die Figuren ohnehin kleiner als die Hälfte
        buf = io.BytesIO(); gi.convert("RGB").save(buf, "WEBP", quality=70, method=6)
        u = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(); total += len(u)
        lines.append(f'"{"gel_" if gel else ""}{f.stem}": "{u}",')
    if probe: print('Probe in', probe); return
    lines.append('};')
    (ROOT / 'src' / 'figsplastik.js').write_text('\n'.join(lines) + '\n', encoding='utf8', newline='\n')
    print('src/figsplastik.js', total // 1024, 'KB,', len(files), 'Bilder')


if __name__ == '__main__':
    main()
