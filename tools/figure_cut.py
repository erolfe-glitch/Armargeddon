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
    border = np.concatenate([rgb[3], rgb[-4], rgb[:, 3], rgb[:, -4]])   # 3 px nach innen: manche Bögen haben am Rand eine helle Schnittkante
    bunt = border[border.max(1) - border.min(1) > 100]   # nur kräftig farbige Randpixel (Magenta/Pink), keine weißen Streifen
    bg = np.median(bunt if len(bunt) > len(border) * 0.3 else border, axis=0)
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
TRUPP = {'soldat', 'sturm', 'pionier', 'schildwall', 'soldat_posen', 'sturm_posen', 'pionier_posen'}
# Zusatzposen zu einem Trupp-Bogen (2026-11-19, Animation Stufe 1): 2×2 mit Nahtschnitt, Maßstab wie der Grundbogen:
# Pose Nr. (Getroffen) = Anteil der Höhe der Bereit-Pose des Grundbogens (<fraktion>_<grund>_1 im Spiel). Freie Teile (Granate, Mündungsfeuer) fallen weg.
# Ohne Mündungsfeuer-Entfernung: die Bögen haben keins, sie würde die gelb leuchtenden Gasmasken-Augen durchsichtig machen (2026-11-20)
OHNE_BLITZ = {'sturm_posen', 'pionier_posen'}
POSEN_MASS = {'soldat_posen': ('soldat', 4, 0.97), 'sturm_posen': ('sturm', 4, 0.97), 'pionier_posen': ('pionier', 4, 0.97)}   # 2026-11-20: Sturmtrupps (Ausholen, Loslassen, Graben, Getroffen), Pioniere (Draht schneiden, Haftladung/Mine, Graben, Getroffen)
# Bögen mit Posen in einer Reihe (nebeneinander): Anzahl Posen; Teile werden über zusammenhängende Flächen gefunden
REIHE = {'reiter': 3, 'flammen': 4, 'sanitaeter': 4, 'scharfschuetze': 3, 'schwer': 4, 'banner': 3}
# Posen nebeneinander, die sich berühren (Mann und Hund): an festen Stellen (Anteil der Breite) senkrecht trennen
SPALTEN = {'melder': [0.525], 'sanitaeter': 4, 'scharfschuetze': 3, 'schwer': 4, 'pirschjaeger': 3, 'signal': 3, 'stahl': 3, 'panzerknecht': 3,
           'fernsprech': 3, 'versorgung': 3, 'gasschutz': 3, 'mineur': 3, 'eingreif': 4, 'aschenwacht_sturm': 4,
           'loewenoger': 3, 'eiserne_huenen': 3}   # 2026-11-20: Löwenoger, Eiserne Hünen (Ruhe/vorrücken, Schießen, Nahkampf)   # Schlüssel: Art oder ganzer Bogenname (geht vor)
# Waagerecht teilen (Anteil der Höhe): unten das Modell im Feld (<name>), oben ein Teil, den das Spiel eigens zeichnet (<name>_luft) – Fesselballon über der Winde
TEILUNG = {'konkordat_ballon': 0.53}   # Zahl = so viele Posen, Trennstellen automatisch (dünnste Spalten)
# Höhe der höchsten Pose in SH (Reiter mit Pferd, erhobener Waffe/Lanze); sonst 1,0
SH_REIHE = {'aschenwacht_sturm': 1.1, 'konkordat_versorgung': 1.06, 'mineur': 1.02, 'eingreif': 1.0, 'reiter': 1.75, 'banner': 1.45, 'schwer': 1.08, 'pirschjaeger': 0.85, 'signal': 1.17, 'stahl': 1.4, 'panzerknecht': 1.4, 'loewenoger': 1.5, 'eiserne_huenen': 1.85}   # Kampfanzüge: Körper ca. 1,25 Soldatenhöhen (Höhe gemessen mit Auspuff und Antenne), kleiner als Kolosse   # Pirschjäger: höchste Pose geduckt
# Bögen, die nach links blicken: spiegeln (das Spiel erwartet Blick nach rechts und spiegelt selbst je nach Blickrichtung)
SPIEGELN = {'aschenwacht_eisenknecht', 'aschenwacht_eisenknecht_neu', 'aschenwacht_saegeschreiter', 'aschenwacht_klauenschreiter'}


# Leuchtende Helmlampen, die im Bild rosa geraten sind (Magenta-Schein): in warmes Gelb umfärben
# Lange Waffe ragt unter die Nachbarpose (Spieltest 2026-11-17: Lauf des liegenden Scharfschützen fehlte im Spiel): unterhalb der
# Höhe (Anteil der Bildhöhe) gehört der Streifen der Pose rechts daneben noch zur Pose links. Schlüssel: ganzer Bogenname.
UNTEN_LINKS = {'konkordat_scharfschuetze': 0.7695}
LAMPE = {'konkordat_mineur'}
LAMPE_FARBE = np.array([255, 208, 112.])


def wert(tab, name, kind, std=None):
    """Eintrag für den ganzen Bogennamen, sonst für die Art (konkordat_sturm 2×2, aschenwacht_sturm in einer Reihe)."""
    return tab[name] if name in tab else tab.get(kind, std)


def lampe_gelb(k):
    """Rosa/magenta Leuchten (auch halbtransparenter Schein am Rand) → warmes Gelb, Helligkeit bleibt."""
    r, g, b, al = [k[..., i].astype(float) for i in range(4)]
    lum = 0.3 * r + 0.59 * g + 0.11 * b
    hell = ndimage.binary_dilation((lum > 190) & (al > 200), iterations=14)   # nur um leuchtende Stellen (Lampe), nicht am roten Rock
    rosa = (al > 8) & (r > 140) & (b > 100) & (np.minimum(r, b) - g > 25)
    rosa |= hell & (al > 8) & (r - g > 8) & (b - g > -3) & (lum > 100)   # blasser rosa Schein (halbtransparent)
    v = np.clip(np.maximum(r, b) / 255, 0.5, 1.0)[..., None]
    q = k.astype(float).copy(); q[rosa, :3] = (LAMPE_FARBE * v)[rosa]
    print(f'  Helmlampe gelb: {int(rosa.sum())} px')
    return q


# Gezeichnete Bodenschatten unter den Füßen entfernen (dunkles Magenta/Pink unten an den Posen)
OHNE_SCHATTEN = {'konkordat_flammen', 'aschenwacht_flammen'}
# Einzelmodelle: Höhe des freigestellten Bilds in Soldatenhöhen (SH, 1 SH = stehender Soldat). Panzer nach STYLE.md 1,3–1,5 SH,
# Breite nach Bild (darf etwas über den Feldrand ragen, ui.js FIGW_VEH als Sicherheitsgrenze).
SH_SINGLE = {'mg': 1.13, 'mg_marsch': 1.21, 'geschuetz': 1.38, 'geschuetz_marsch': 1.4, 'hauptmann': 1.2, 'koloss': 1.62, 'panzer': 1.5, 'bohrkoloss': 1.5,
             'moerser': 0.95, 'minenwerfer': 1.0, 'rauchwerfer': 1.02, 'panzerbuechse': 0.82, 'general': 1.5, 'ballon': 1.15, 'feldkanone': 1.05,
             'turmschreiter': 1.9, 'ordensschreiter': 1.9, 'kreuzschreiter': 1.9, 'eisenknecht': 1.9, 'kreuzschreiter_neu': 2.3, 'eisenknecht_neu': 2.45, 'saegeschreiter': 1.9, 'klauenschreiter': 1.9}   # Schreiter (2026-11-17): knapp 2 SH, größer als Kampfanzüge   # Trupps mit Gerät: höchste Figur; General mit Fahnenträger (Fahne ragt über den Kopf)   # 2026-11-16: MG 1,15× (beide Zustände), Geschütz 1,38, Gespann am Reiter gemessen 1,4 SH, Fahrzeuge 1,5 SH
# Aschenwacht: Schwarz-Weiß-Rot (echte Reichsfarben) → eigene Farben Aschgrau / Schwarz / Knochenweiß. Allgemeine Regel für ALLE
# aschenwacht_*-Bögen (2026-11-17): Fahnen, Wimpel, Streifen werden automatisch gefunden (kräftiges Rot, Weiß und Schwarz dicht beieinander);
# dort wird Rot → Knochenweiß und Weiß neben Rot → Aschgrau, Schwarz bleibt. Rost, Blut, Ledergürtel und Lichter bleiben unberührt.
# FAHNE: zusätzliche feste Bereiche (Anteile x0, y0, x1, y1), wo die Erkennung nicht reicht (dunkles Weinrot der Banner, Panzerstreifen).
FAHNE = {'aschenwacht_banner': (0, 0, 1, 0.5), 'aschenwacht_bohrkoloss': (0.18, 0.0, 0.42, 0.23), 'aschenwacht_panzer': (0.66, 0.26, 0.99, 0.87)}
ASCHGRAU, KNOCHEN = np.array([108, 106, 100.]), np.array([222, 212, 186.])


def fahnen_finden(a, alpha):
    """Maske der Schwarz-Weiß-Rot-Stellen: in einem Fenster (2,2 % der Bildgröße) kräftiges Rot, Weiß und Schwarz zugleich."""
    H, W = a.shape[:2]; inner = ndimage.binary_erosion(alpha > 200, iterations=2)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; mx, mn = a.max(-1), a.min(-1); lum = 0.3 * r + 0.59 * g + 0.11 * b
    red = (np.minimum(r - g, r - b) > 60) & (r > 90) & inner; white = (lum > 150) & ((mx - mn) < 40) & inner; dark = (lum < 55) & inner
    R = max(8, int(min(H, W) * 0.022)); f = lambda m: ndimage.uniform_filter(m.astype(float), R)
    cand = (f(red) > 0.08) & (f(white) > 0.08) & (f(dark) > 0.06)
    lab, n = ndimage.label(cand); sz = ndimage.sum(cand, lab, range(1, n + 1))
    m = np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= R * R * 0.2])
    return ndimage.binary_dilation(m, iterations=R // 2) & (alpha > 20)


def fahne_umfaerben(a, name, alpha):
    """Weiß → Aschgrau, Rot → Knochenweiß (Schattierung bleibt), Schwarz bleibt; weiche Masken gegen harte Kanten.
    In den festen FAHNE-Bereichen alles Rot/Weiß, in den gefundenen Stellen nur kräftiges Rot und Weiß direkt neben Rot."""
    a = a.astype(np.float64); H, W = a.shape[:2]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; mx, mn = a.max(-1), a.min(-1); lum = 0.3 * r + 0.59 * g + 0.11 * b
    rot = np.clip((np.minimum(r - g, r - b) - 30) / 25, 0, 1)
    weiss = np.clip((lum - 135) / 30, 0, 1) * np.clip((45 - (mx - mn)) / 20, 0, 1)
    box = np.zeros((H, W), bool)
    if name in FAHNE:
        x0, y0, x1, y1 = FAHNE[name]; box[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = True
    auto = fahnen_finden(a, alpha) & ~box
    # ganze rote Bahnen, die eine gefundene Stelle berühren (flächig, kein Blut/Rost), und Weiß direkt daneben
    al = alpha > 160; rv = np.clip((np.minimum(r - g, r - b) - 45) / 20, 0, 1) * al * ~box
    lab, n = ndimage.label(ndimage.binary_closing(rv > 0, iterations=1)); hit = ndimage.sum((rv > 0) & auto, lab, range(1, n + 1))   # rotes Stück innerhalb der gefundenen Stelle
    rot_a = rv * np.isin(lab, [i + 1 for i in range(n) if hit[i] >= H * W * 2.5e-4])
    nah = ndimage.binary_dilation(rot_a > 0.5, iterations=max(3, int(min(H, W) * 0.012)))
    weiss_f = np.clip((lum - 120) / 30, 0, 1) * np.clip((70 - (mx - mn)) / 20, 0, 1)   # Fahnenweiß darf cremig sein
    wm = (weiss_f > 0.3) & al; wl, wn = ndimage.label(wm); wt = ndimage.maximum(nah, wl, range(1, wn + 1))
    nah = nah | np.isin(wl, [i + 1 for i in range(wn) if wt[i]]) & ndimage.binary_dilation(rot_a > 0.5, iterations=max(6, int(min(H, W) * 0.08)))
    auto = auto | nah
    rot = rot * box + rot_a; weiss = weiss * box + weiss_f * (auto & nah & ~box)
    v_rot = np.clip(mx / 160, 0.35, 1.05)[..., None]; v_w = np.clip(lum / 205, 0.5, 1.08)[..., None]
    a = a * (1 - rot[..., None]) + KNOCHEN * v_rot * rot[..., None]
    a = a * (1 - weiss[..., None]) + ASCHGRAU * v_w * weiss[..., None]
    if (rot > 0.5).sum() + (weiss > 0.5).sum():
        print(f'  Schwarz-Weiß-Rot umgefärbt: rot {int((rot > 0.5).sum())} px, weiß {int((weiss > 0.5).sum())} px (fest {int(box.sum())}, gefunden {int(auto.sum())})')
    return np.clip(a, 0, 255).astype(np.uint8)


# Eiserne Kreuze als Abzeichen übermalen (2026-11-17; kreuzförmige Visiere bleiben). Koordinaten in Pixeln der Quelle:
#   platte (cx, cy, r): Kreuz im Kreis r finden und mit der umgebenden Platte füllen (Ausgleich + Körnung von daneben)
#   orden (cx, cy, r, sx, sy, sr): Kreuz übermalen und runde Medaille von (sx, sy) einsetzen
#   spitze (x0, y0, x1, y1, px0, px1, sy): Kreuz an der Fahnenspitze durch Stangenstück ersetzen (Rest Hintergrund)
ABZEICHEN = {
    'aschenwacht_panzerknecht': [('platte', 106, 236, 50), ('platte', 619, 264, 46), ('platte', 1205, 294, 52)],
    'aschenwacht_general': [('spitze', 104, 64, 186, 146, 138, 152, 300), ('orden', 630, 505, 22, 601, 549, 15), ('orden', 620, 584, 22, 601, 549, 15)],
    'aschenwacht_bohrkoloss': [('platte', 468, 579, 27)],
    # Posenbögen 2026-11-20: Adler auf den Pickelhauben (Pflicht: keine Adler im Spiel)
    'aschenwacht_sanitaeter_posen': [('platte', 496, 137, 34), ('platte', 2424, 160, 32), ('platte', 1895, 261, 32), ('platte', 1169, 604, 32)],
    'aschenwacht_melder_posen': [('platte', 669, 934, 30), ('platte', 2335, 745, 34), ('platte', 301, 81, 26)],
    'aschenwacht_flammen_posen': [('platte', 1845, 150, 26), ('platte', 1738, 935, 26), ('platte', 705, 150, 26), ('platte', 785, 960, 26)],
}


def _diffus(a, m, n=300, aus=None):
    """Loch m aus dem Rand auffüllen (wiederholtes Mitteln, nur glatte Farbe); gerechnet nur im Ausschnitt um m."""
    ys, xs = np.nonzero(m); y0, y1, x0, x1 = max(0, ys.min() - 4), ys.max() + 5, max(0, xs.min() - 4), xs.max() + 5
    out = a.copy(); out[y0:y1, x0:x1] = _diffus_roh(a[y0:y1, x0:x1], m[y0:y1, x0:x1], n, None if aus is None else aus[y0:y1, x0:x1]); return out


def _diffus_roh(a, m, n, aus=None):   # aus = Hintergrund: weder Quelle noch Ziel
    q = a.copy(); q[m] = 0; w = (~m).astype(float)
    if aus is not None: q[aus] = 0; w[aus] = 0; acc = q * w[..., None]
    for _ in range(n):
        acc2 = ndimage.uniform_filter(acc, (3, 3, 1)); w2 = ndimage.uniform_filter(w, 3)
        fill = acc2 / np.maximum(w2, 1e-6)[..., None]; q[m] = fill[m]; nw = np.maximum(w, (w2 > 0).astype(float))
        if aus is not None: nw[aus] = 0
        w = nw; acc = q * w[..., None]
    return q


def abzeichen_uebermalen(a, name):
    if name not in ABZEICHEN: return a
    a = a.astype(np.float64); H, W = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    lum = a @ [0.3, 0.59, 0.11]; bgc = a[2, 2].copy()
    bg = ndimage.binary_dilation(np.abs(a - bgc).sum(-1) < 160, iterations=2)   # mit Saum
    for op in ABZEICHEN[name]:
        if op[0] in ('platte', 'orden'):
            cx, cy, r = op[1:4]; disk = (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r
            # Kreuz = dunkle Füllung + helle Umrandung, zusammenhängend um die Mitte
            sm = ndimage.gaussian_filter(lum, 1.2); hf = np.abs(lum - ndimage.gaussian_filter(lum, 6))
            k = disk & ~bg & ((sm < np.percentile(sm[disk & ~bg], 35)) | (sm > np.percentile(sm[disk & ~bg], 88)) | (hf > 28))
            k = ndimage.binary_closing(k, iterations=3); k = ndimage.binary_fill_holes(k)
            lab, n = ndimage.label(k); c = lab[cy, cx] or (np.bincount(lab[disk].ravel(), minlength=n + 1)[1:].argmax() + 1)
            m = ndimage.binary_dilation(lab == c, iterations=3) & disk & ~bg
            f = _diffus(a, m, aus=bg)
            # Körnung: Feinstruktur von versetzten Stellen der Platte (nicht Kreuz, nicht Hintergrund)
            det = a - ndimage.gaussian_filter(a, (3, 3, 0)); out = f.copy(); done = np.zeros_like(m)
            for dx, dy in ((int(r * 1.1), 0), (-int(r * 1.1), 0), (0, int(r * 1.1)), (0, -int(r * 1.1)), (int(r * .8), int(r * .8)), (-int(r * .8), int(r * .8))):
                sy_, sx_ = np.clip(yy + dy, 0, H - 1), np.clip(xx + dx, 0, W - 1)
                ok = m & ~done & ~m[sy_, sx_] & ~bg[sy_, sx_]; out[ok] = f[ok] + det[sy_[ok], sx_[ok]] * 0.9; done |= ok
            soft = ndimage.gaussian_filter(m.astype(float), 1.0)[..., None]; a = a * (1 - soft) + out * soft
            if op[0] == 'orden':   # runde Medaille einsetzen
                sx, sy, sr = op[4:7]; md = (xx - sx) ** 2 + (yy - sy) ** 2 <= sr * sr
                ys, xs = np.nonzero(md); ty, tx = ys - sy + cy, xs - sx + cx; okk = (ty >= 0) & (ty < H) & (tx >= 0) & (tx < W)
                a[ty[okk], tx[okk]] = a[ys[okk], xs[okk]]
            print(f'  Abzeichen übermalt bei {cx},{cy}: {int(m.sum())} px')
        elif op[0] == 'spitze':
            x0, y0, x1, y1, px0, px1, sy = op[1:]
            box = (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
            ring = (xx >= x0 - 8) & (xx < x1 + 8) & (yy >= y0 - 8) & (yy < y1 + 8) & ~box & bg
            a[box] = np.median(a[ring], 0) if ring.any() else bgc   # Kreuz weg (Hintergrundfarbe von nebenan)
            for y in range(y0, y1):   # Stange durchziehen
                a[y, px0:px1] = a[sy + (y - y0) % 40, px0:px1]
            print(f'  Fahnenspitze ohne Kreuz: {int(box.sum())} px')
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


def seam(op, x0, w):
    """Senkrechte Trennnaht (je Zeile eine Spalte) im Bereich x0±w mit möglichst wenig deckenden Pixeln (dynamische Programmierung)."""
    H, W = op.shape; a, b = max(1, x0 - w), min(W - 1, x0 + w)
    cost = 1 + op[:, a:b].astype(np.float64) * 1000; n = b - a
    M = cost.copy(); back = np.zeros((H, n), np.int64)
    for y in range(1, H):
        prev = M[y - 1]; l = np.r_[np.inf, prev[:-1]]; r = np.r_[prev[1:], np.inf]; st = np.stack([l, prev, r]); i = st.argmin(0)
        M[y] += st[i, np.arange(n)]; back[y] = i - 1
    xs = np.zeros(H, np.int64); xs[-1] = int(M[-1].argmin())
    for y in range(H - 1, 0, -1): xs[y - 1] = min(n - 1, max(0, xs[y] + back[y, xs[y]]))
    return xs + a


# Leichter Farbabgleich statt angleichen (2026-11-17, neuer Landkoloss-Bogen): nicht abdunkeln, Glanzlichter lassen – nur der Kontrast
# um die mittlere Helligkeit wird etwas angehoben (Faktor), Farbton und Sättigung bleiben. Bild mit Fahne: SH_SINGLE koloss 1,62,
# damit der Rumpf so hoch wie beim Sturmpanzer (1,5 SH ohne Fahne) wird.
KONTRAST = {'konkordat_koloss': 1.15}


def kontrast(q, f):
    rgb, al = q[..., :3], q[..., 3] > 128
    L = rgb @ np.array([0.299, 0.587, 0.114]); Lm = L[al].mean()
    k = np.where(L > 1, (Lm + (L - Lm) * f) / np.maximum(L, 1), 1.0)
    q = q.copy(); q[..., :3] = np.clip(rgb * k[..., None], 0, 255); return q


# Gemalter Rauch über Auspuffrohren (Stufe-3-Schreiter, 2026-11-19): den Rauch macht im Spiel der Effekt. Kästen in Quellkoordinaten (vor dem Spiegeln)
# über den Rohröffnungen; darin werden helle, ungesättigte Flächen (Rauch) samt ihrer dunklen Kontur zur Hintergrundfarbe – die dunkelgraue
# Fahne und die Rohre bleiben (zu dunkel bzw. unterhalb der Kästen).
RAUCH = {'aschenwacht_eisenknecht_neu': [(1370, 195, 1512, 326), (1480, 185, 1615, 306), (1830, 160, 2045, 268), (1950, 222, 2100, 323)]}


def rauch_weg(a, name):
    if name not in RAUCH: return a
    a = a.copy(); bg = np.median(np.concatenate([a[3], a[-4]]), axis=0)
    for x0, y0, x1, y1 in RAUCH[name]:
        q = a[y0:y1, x0:x1].astype(np.float64); L = q.mean(2); S = q.max(2) - q.min(2)
        mag = (q[..., 0] - q[..., 1] > 110) & (q[..., 2] - q[..., 1] > 110)
        rauch = (L > 125) & (S < 70) & ~mag
        rauch = ndimage.binary_closing(rauch, iterations=2)
        kontur = ndimage.binary_dilation(rauch, iterations=7) & ndimage.binary_dilation(mag, iterations=5) & ~mag
        weg = ndimage.binary_fill_holes(rauch | kontur)
        frei = ~mag & ~weg; linie = frei & ~ndimage.binary_opening(frei, iterations=3)   # übrige dünne Konturlinien (Fahne, Rohre sind dicker)
        weg |= linie & ndimage.binary_dilation(weg, iterations=12)
        weg |= np.minimum(q[..., 0], q[..., 2]) - q[..., 1] > 45   # dunkelrosa Kantenpixel (Kontur mit Magenta gemischt) würden sonst deckend
        a[y0:y1, x0:x1][weg] = bg
    return a


# Magenta-Reste in Lücken (Kettenhemd) bei JPG-Bögen: Rot und Blau nicht über Grün hinaus (Überschuss abziehen), Ochsenblut bleibt (wenig Blau)
ENTROSA = {'konkordat_kreuzschreiter_neu', 'aschenwacht_eisenknecht_neu', 'konkordat_loewenoger', 'aschenwacht_eiserne_huenen'}


def entrosa(q):
    q = q.copy(); ex = np.clip(np.minimum(q[..., 0], q[..., 2]) - q[..., 1], 0, None); q[..., 0] -= ex; q[..., 2] -= ex; return q


# Posenbögen mit frei verteilten Figuren (2026-11-20, Spieltest Runde 4): die n größten Figuren des Bogens in Lesereihenfolge (reihen = Anzahl
# Bildzeilen), Maßstab wie der Grundbogen (höchste Pose = höchste Pose des Grundbogens × f). Ausgabe <name>_<i>. Optionen:
#   nimm: nur diese Nummern speichern (andere unbrauchbar, z. B. abgeschnittene Beine); spiegeln: Nummern, die nach links blicken
#   helm: goldene Abzeichen/Adler auf dem Helm übermalen (oberster Kopfbereich, Gold ohne die hellen Gasmasken-Augen)
#   tuch: (Nummer, Farbe) helles Fahnentuch umfärben (Konkordat: weiße Flagge sah nach Kapitulation aus)
#   rauch: halbdurchsichtige, wenig farbige Schlieren (Rauch, Bewegungsunschärfe) entfernen
FIGUREN_POSEN = {
    'konkordat_sanitaeter_posen': dict(n=3, reihen=1, grund='sanitaeter', trenne=[3]),   # Laufen und Getroffen berühren sich
    'aschenwacht_sanitaeter_posen': dict(n=4, reihen=1, grund='sanitaeter'),   # Adler über ABZEICHEN
    'konkordat_flammen_posen': dict(n=4, reihen=1, grund='flammen', schatten=True),
    'aschenwacht_flammen_posen': dict(n=4, reihen=2, grund='flammen'),   # Helmplakette über ABZEICHEN
    'konkordat_kampfanzug_posen': dict(n=4, reihen=2, grund='stahl', rauch=True, eins=True),
    'aschenwacht_kampfanzug_posen': dict(n=4, reihen=2, grund='panzerknecht', rauch=True, eins=True),   # eins: nur das größte Teil (deckend gemalte Rauchwolke neben Pose 3)
    'konkordat_versorgung_posen': dict(n=4, reihen=2, grund='versorgung', nimm=[1, 3, 4]),   # 2 (Hämmern) unten abgeschnitten
    'konkordat_versorgung_posen2': dict(n=4, reihen=2, grund='versorgung', nimm=[1, 3, 4]),   # 2 (Kette) Beine abgeschnitten
    'aschenwacht_versorgung_posen': dict(n=4, reihen=2, grund='versorgung', gross={3: 1.6}),   # 3 (kniend mit Schlüssel) kleiner gezeichnet
    'konkordat_schildwall_posen': dict(n=4, reihen=2, grund='schildwall'),
    'konkordat_schildwall_posen2': dict(n=4, reihen=2, grund='schildwall'),
    'aschenwacht_schwer_posen': dict(n=4, reihen=2, grund='schwer'),
    'konkordat_scharfschuetze_posen': dict(n=3, reihen=2, grund='scharfschuetze', trenne=[3]),   # Kniend und Fallend berühren sich
    'aschenwacht_pirschjaeger_posen': dict(n=4, reihen=2, grund='pirschjaeger'),
    'konkordat_melder_posen': dict(n=4, reihen=1, grund='fernsprech', tuch=(3, (142, 43, 34))),
    'aschenwacht_melder_posen': dict(n=4, reihen=2, grund='signal', spiegeln=[1]),   # Adler über ABZEICHEN
    'konkordat_mineur_posen': dict(n=4, reihen=2, grund='mineur', lampe=True),
    'konkordat_hauptmann_posen': dict(n=4, reihen=2, grund='hauptmann'),
    'aschenwacht_hauptmann_posen': dict(n=4, reihen=2, grund='hauptmann'),
}


def helm_gold_weg(q, hmax):
    """Goldenes Helmabzeichen (Adler) übermalen: im obersten Bereich der Figur Gold/Messing, ohne helle Augenlinsen."""
    a = q[..., :3].astype(np.float64); al = q[..., 3] > 128
    ys = np.nonzero(al.any(1))[0];
    if not len(ys): return q
    top = ys.min(); band = np.zeros(al.shape, bool); band[top:top + int(hmax * 0.11)] = True
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; lum = a @ [0.3, 0.59, 0.11]
    gold = band & al & (r - b > 45) & (g - b > 20) & (r > 100) & (lum < 205)
    gold = ndimage.binary_opening(gold, iterations=1); gold = ndimage.binary_dilation(gold, iterations=3) & band & al
    if gold.sum() < 20: return q
    f = _diffus(a, gold, n=200, aus=~al); q = q.copy(); q[..., :3] = np.where(gold[..., None], f, a)
    print(f'  Helmabzeichen übermalt: {int(gold.sum())} px'); return q


def figuren_posen(name, out):
    o = FIGUREN_POSEN[name]; a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB')); H, W = a.shape[:2]
    a = abzeichen_uebermalen(a, name)
    k = keyed(a)
    if name.startswith('aschenwacht_'): a = fahne_umfaerben(a, name, k[..., 3]); k = keyed(a)
    if o.get('lampe'): k = lampe_gelb(k)
    if o.get('schatten'):   # gemalter Schatten = abgedunkelte Hintergrundfarbe
        r_, g_, b_ = [a[..., i].astype(int) for i in range(3)]; sch = (np.minimum(r_, b_) - g_ > 28) & ((r_ + g_ + b_) < 560); k = k.copy(); k[ndimage.binary_dilation(sch, iterations=1), 3] = 0
    if o.get('rauch'):   # Schlieren: halbdurchsichtig nach dem Freistellen oder blass-grau-lila
        a_ = a.astype(int); sat = a_.max(2) - a_.min(2); k = k.copy(); k[(k[..., 3] < 200) | ((sat < 40) & (a_.mean(2) > 120) & (np.minimum(a_[..., 0], a_[..., 2]) - a_[..., 1] > 10)) | (np.minimum(a_[..., 0], a_[..., 2]) - a_[..., 1] > 12), 3] = 0   # auch deckend gemalte rosa Rauchwolken
    al = ndimage.binary_closing(k[..., 3] > 60, iterations=4); lab, n = ndimage.label(al)
    sizes = ndimage.sum(al, lab, range(1, n + 1)); big = sorted(range(1, n + 1), key=lambda i: -sizes[i - 1])[:o['n']]
    fo = ndimage.find_objects(lab); zh = H / o['reihen']
    big.sort(key=lambda i: (int(((fo[i - 1][0].start + fo[i - 1][0].stop) / 2) // zh), fo[i - 1][1].start))
    figs = []
    for i in big:
        sl = fo[i - 1]; t = k[sl].copy(); t[~ndimage.binary_dilation(lab[sl] == i, iterations=2), 3] = 0; figs.append(keep_parts(t, not o.get('eins'), 0.15))
    for j in sorted(o.get('trenne', []), reverse=True):   # zwei sich berührende Figuren: Naht durch die dünnste Stelle
        f = figs[j - 1]; op = f[..., 3] > 40; xs = seam(op, f.shape[1] // 2, int(f.shape[1] * 0.25)); cols = np.arange(f.shape[1])[None, :]
        l = f.copy(); l[cols >= xs[:, None], 3] = 0; rr = f.copy(); rr[cols < xs[:, None], 3] = 0; figs[j - 1:j] = [keep_parts(l, True, 0.15), keep_parts(rr, True, 0.15)]
    hmax = max(f.shape[0] for f in figs)
    grund = sorted(GAME.glob(f"{name.split('_', 1)[0]}_{o['grund']}*.png")); grund = [g for g in grund if '_posen' not in g.stem]
    ref = max(Image.open(g).height for g in grund) if grund else H_OUT
    s = ref * o.get('f', 1.0) / hmax; out.mkdir(parents=True, exist_ok=True)
    for j, q in enumerate(figs, 1):
        if o.get('nimm') and j not in o['nimm']: print(f'{name}_{j}: ausgelassen'); continue
        q = entrosa(q.astype(np.float64))
        if o.get('helm'): q = helm_gold_weg(q, hmax)
        if o.get('tuch') and o['tuch'][0] == j:
            rgb = q[..., :3]; lum = rgb @ [0.3, 0.59, 0.11]; sat = rgb.max(2) - rgb.min(2); m = (q[..., 3] > 100) & (lum > 120) & (sat < 60)
            m[int(q.shape[0] * 0.55):] = False; col = np.array(o['tuch'][1], float)
            q = q.copy(); q[m, :3] = col * np.clip(lum[m] / 170, 0.35, 1.25)[:, None]; print(f'  Fahnentuch umgefärbt: {int(m.sum())} px')
        if o.get('spiegeln') and j in o['spiegeln']: q = q[:, ::-1]
        sj = s * o.get('gross', {}).get(j, 1.0)
        im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA'); im = im.resize((max(1, round(im.width * sj)), max(1, round(im.height * sj))), Image.LANCZOS)
        im.save(out / f'{name}_{j}.png'); print(f'{name}_{j}: {im.width}×{im.height}')


def cut(name, out=OUT):
    if name in FIGUREN_POSEN: return figuren_posen(name, out)
    a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB'))
    a = rauch_weg(a, name)
    a = abzeichen_uebermalen(a, name)
    if name in SPIEGELN: a = np.ascontiguousarray(a[:, ::-1])
    H, W = a.shape[:2]
    k = keyed(a)
    if name.startswith('aschenwacht_'):   # allgemeine Regel: Reichsfarben → Aschenwacht-Farben, danach neu freistellen
        a = fahne_umfaerben(a, name, k[..., 3]); k = keyed(a)
    kind = kind_of(name)
    if name in TEILUNG:   # unten Winde mit Mann, oben Ballon mit Korb; gleicher Maßstab, Seil zeichnet das Spiel
        y = int(H * TEILUNG[name]); lo = k.copy(); lo[:y, :, 3] = 0; hi = k.copy(); hi[y:, :, 3] = 0
        lo = keep_parts(lo, True); hi = keep_parts(hi, True); s = H_OUT * SH_SINGLE.get(kind, 1.0) / lo.shape[0]; out.mkdir(parents=True, exist_ok=True)
        for q, nm in ((lo, name), (hi, name + '_luft')):
            im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA'); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            im.save(out / f'{nm}.png'); print(f'{nm}: {im.width}×{im.height}')
        return
    if name in LAMPE: k = lampe_gelb(k)
    if wert(SPALTEN, name, kind) is not None:   # Posen an festen Stellen getrennt, je Streifen alle großen Teile (Mann + Hund)
        sp = wert(SPALTEN, name, kind)
        if isinstance(sp, int):   # automatisch: je Trennstelle die Spalte mit der wenigsten Deckung nahe der gleichmäßigen Teilung
            prof = ndimage.uniform_filter1d((k[..., 3] > 60).sum(0).astype(float), 15); cols = np.nonzero(prof > 0)[0]; xa, xb = cols.min(), cols.max(); L = xb - xa
            sp = [(xa + int(np.argmin(prof[int(xa + L * (i / sp - 0.1)):int(xa + L * (i / sp + 0.1))])) + int(L * (i / sp - 0.1))) / W for i in range(1, sp)]
        # Trennnaht statt gerader Linie (2026-11-17): der Schnitt sucht sich von oben nach unten den Weg durch den freien Hintergrund
        # und geht um lange Waffen herum, die in die Spalte der Nachbarpose ragen (Gewehrlauf des liegenden Scharfschützen)
        seams = [seam(k[..., 3] > 40, int(f * W), int(W * 0.14)) for f in sp]
        cols = np.arange(W)[None, :]; poses = []
        for j in range(len(seams) + 1):
            m = np.ones((H, W), bool)
            if j > 0: m &= cols >= seams[j - 1][:, None]
            if j < len(seams): m &= cols < seams[j][:, None]
            if name in UNTEN_LINKS:   # Waffe unter der rechten Nachbarpose: dort unten zur linken Pose
                yb = int(H * UNTEN_LINKS[name]); rows = np.arange(H)[:, None] >= yb
                if j == 0 and len(seams) > 1: m |= rows & (cols >= seams[0][:, None]) & (cols < seams[1][:, None])
                if j == 1: m &= ~rows
            t = k.copy(); t[~m, 3] = 0; poses.append(keep_parts(t, True, 0.12))   # Krümel der Nachbarpose weg
        s = H_OUT * wert(SH_REIHE, name, kind, 1.0) / max(q.shape[0] for q in poses); out.mkdir(parents=True, exist_ok=True)
        for j, q in enumerate(poses, 1):
            im = Image.fromarray(np.clip(q + 0.5, 0, 255).astype(np.uint8), 'RGBA')
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            im.save(out / f'{name}_{j}.png'); print(f'{name}_{j}: {im.width}×{im.height}')
        return
    if kind not in TRUPP and kind not in REIHE:   # Einzelmodell
        q, fl = k, 0   # Einzelmodelle: nur Magenta weg (Kisten, Fahnen, Messing, Flamme gehören zum Modell)
        q = keep_parts(q, True)
        if name in ENTROSA: q = entrosa(q)
        if name in KONTRAST: q = kontrast(q, KONTRAST[name])
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
    if kind in POSEN_MASS:   # Nahtschnitt 2×2: waagerechte Naht, dann je Hälfte eine senkrechte (durch den freien Hintergrund)
        op = k[..., 3] > 40; hz = seam(op.T, H // 2, int(H * 0.12)); rows = np.arange(H)[:, None] < hz[None, :]
        cols = np.arange(W)[None, :]; zellen = []
        for oben in (True, False):
            hm = rows if oben else ~rows; vs = seam(op & hm, W // 2, int(W * 0.12))
            for links in (True, False): zellen.append(hm & ((cols < vs[:, None]) if links else (cols >= vs[:, None])))
        for i, m in enumerate(zellen, 1):
            t = k.copy(); t[~m, 3] = 0
            q, fl = (t, 0) if kind in OHNE_BLITZ else remove_flash(t); q = keep_parts(q, False); poses.append((i, q, fl))
    else:
        for i, (y0, x0) in enumerate([(0, 0), (0, W // 2), (H // 2, 0), (H // 2, W // 2)], 1):
            q = k[y0:y0 + H // 2, x0:x0 + W // 2]
            q, fl = remove_flash(q)
            q = keep_parts(q, False)
            poses.append((i, q, fl))
    hmax = max(p[1].shape[0] for p in poses)   # stehende Pose = höchste
    s = H_OUT / hmax
    if kind in POSEN_MASS:   # gleicher Maßstab wie der Grundbogen
        grund, nr, f = POSEN_MASS[kind]; ref = Image.open(GAME / f"{name.split('_', 1)[0]}_{grund}_1.png").height
        s = ref * f / poses[nr - 1][1].shape[0]
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
