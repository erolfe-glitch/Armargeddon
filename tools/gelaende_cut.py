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


def quelle(name):   # G2b (2026-11-25): neue Bögen des Beraters liegen in ui-quelle/gelaende/neu_g/
    p = SRC / f'{name}.png'
    if p.exists(): return p
    for d in ('neu_g', 'neu_draht', 'neu_poi', 'neu_g7', 'neu_g7h'):   # G7b-Test (2026-11-25): Erdlippe und Innenwand in neu_g7/   # G6 (2026-11-25): besondere Orte und gesprengte Sperren in neu_poi/   # G5b (2026-11-25): Drahtgürtel des Beraters in neu_draht/
        if (SRC / d / f'{name}.png').exists(): return SRC / d / f'{name}.png'
    return SRC / 'neu_g' / f'{name}.png'

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
    'draht_stuecke':       ('bogen', ('gemeinsam', 0.8)),
    # Festung 3×3: 1 Mauer mit Zinnen, 2 Ecke, 3 Mauer glatt, 4 Tor klein, 5 Tor groß, 6 Tor zerstört, 7 Bunker heil, 8 Bunker zerstört, 9 Turm
    'festung':             ('bogen', ('gemeinsam', 1.6, 3)),   # Mauer damit ca. 1,4 SH     # ganze Drahtverhau-Stücke (seit 2026-11-16 der einzige Draht im Spiel)
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
    # Ruhige Fassungen (2026-11-16) ersetzen die bisherigen Böden; gespeichert unter dem alten Namen (Wasser bleibt)
    'boden_schlamm_ruhig':   ('textur', 'boden_schlamm'),
    'boden_gras_ruhig':      ('textur', 'boden_gras'),
    'boden_waldboden_ruhig': ('textur', 'boden_waldboden'),
    'boden_truemmer_ruhig':  ('textur', 'boden_truemmer'),
    'boden_sumpf_ruhig':     ('textur', 'boden_sumpf'),
    'boden_kopfstein_ruhig': ('textur', 'boden_kopfstein'),
    # Sankt Ruß (2026-11-19, G15–G21, alle aus JPG mit Magenta). Optionen: schnitt = Kachel genau zwischen zwei Quellspalten (dort beginnt und
    # endet sie, kurz überblendet), breite = Faktor auf die Kachellänge (gestaucht: niedriger als gemalt, Steine bleiben lang)
    'kirche_hinten':       ('wand', 1.6, {'schnitt': (84, 2471)}),   # beide Enden mitten durch den Strebepfeiler: gekachelt ein Pfeiler statt zwei; höher als 1,2 SH gewollt (durchsichtig beim Verdecken)
    'kirche_vorn':         ('wand', 0.5, {'breite': 1.25}),
    'mauer_niedrig':       ('wand', 0.5, {'breite': 1.4}),
    'kirchturm':           ('bogen', ('gemeinsam', 3.5)),            # 1 heil, 2 eingestürzt (gleicher Maßstab)
    'kirche_innen':        ('bogen', ('gemeinsam', 0.8)),            # Bänke, Altar, Glocke, Säulenstumpf
    'friedhof':            ('bogen', [0.6, 0.5, 0.45, 1.0]),         # Kreuze, Grabsteine, Grabplatte, Heiligenfigur
    'dorf_aufsteller':     ('bogen', [1.15, 1.25, 0.65, 1.6]),       # Brunnen, Wegkreuz, Karren, Laterne
    'zaun':                ('wand', 1.0, {'fuss': 0.2}),            # G22 zerschossener Gartenzaun, nur hinten (Lücken zwischen den Latten durchsichtig; Fußlinie bei 20 % Deckung)
    # Krähenfurt (2026-11-22, fal.ai Flux 3 Image Edit): Hintergrund kein reines Magenta (key_any findet ihn), weiche rosa Säume → ENTROSA.
    # Optionen: namen = Dateinamen je Teil (statt <bogen>_k), spiegeln = Teilnummern waagrecht spiegeln, quelle = (Bogen, Kasten x0, y0, x1, y1) aus einem
    # gemeinsamen Bogen, weich_unten = unterste Zeilen weich ausblenden (gemalter Schneeboden unter Streifen), furchen = Streifen waagrecht drehen,
    # nur = 'senkrecht' (nur oben/unten nahtlos: Straße wird quer über den Weg gelegt)
    'haus_heil_bogen':     ('bogen', ('gemeinsam', 2.0), {'namen': ['haus_heil_1', 'haus_heil_2', 'haus_heil_3', 'haus_heil_4'], 'spiegeln': [2]}),   # Haus 2 steht andersherum
    'kapelle_ruinen_bogen': ('bogen', ('gemeinsam', 3.0), {'namen': ['kapelle', 'kapelle_ruine', 'haus_ruine_schnee_1', 'haus_ruine_schnee_2']}),
    'baeume_schnee_bogen': ('bogen', ('gemeinsam', 2.6), {'namen': ['tanne_schnee_1', 'tanne_schnee_2', 'tanne_schnee_3', 'tanne_schnee_4', 'baum_tot_schnee_1', 'baum_tot_schnee_2']}),
    'dorf_objekte_schnee_bogen': ('bogen', ('gemeinsam', 1.2), {'namen': ['bruecke_stein', 'brunnen_schnee', 'holzstapel_1', 'holzstapel_2', 'karren_schnee', 'schilf']}),
    'boden_schnee':        ('textur', None, {'quelle': ('boden_schnee_bogen', (14, 12, 1010, 1008)), 'weich': True}),
    # Reine Schneeflächen (Enrico 19:15): Grundboden der offenen Felder, 4 Fassungen je Feld gemischt; Helligkeit gedämpft und leicht bläulich (hell = Ziel-Mittelwert),
    # damit der Schnee Figuren und Markierungen nicht überstrahlt (im Spiel kommt noch die Bodenaufhellung dazu)
    'boden_schnee_rein_1': ('textur', None, {'quelle': ('boden_schnee_rein_bogen', (10, 8, 1008, 1010)), 'weich': True, 'hell': 0.6}),
    'boden_schnee_rein_2': ('textur', None, {'quelle': ('boden_schnee_rein_bogen', (1036, 8, 2038, 1010)), 'weich': True, 'hell': 0.6}),
    'boden_schnee_rein_3': ('textur', None, {'quelle': ('boden_schnee_rein_bogen', (10, 1036, 1008, 2036)), 'weich': True, 'hell': 0.6}),
    'boden_schnee_rein_4': ('textur', None, {'quelle': ('boden_schnee_rein_bogen', (1036, 1036, 2038, 2036)), 'weich': True, 'hell': 0.6}),
    'boden_acker_schnee':  ('textur', None, {'quelle': ('boden_schnee_bogen', (1040, 12, 2036, 1008)), 'furchen': True}),
    'strasse_matsch':      ('textur', None, {'quelle': ('boden_schnee_bogen', (14, 1038, 1010, 2034)), 'nur': 'senkrecht', 'weich': True}),
    'boden_eis':           ('textur', None, {'quelle': ('boden_schnee_bogen', (1040, 1038, 2036, 2034)), 'weich': True}),
    # Furt und Bodenspuren (Enrico 18:35): Furt-Kachel deckend (roh, Fluss läuft waagrecht), Trichter/Brandfleck als Aufkleber (größte Seite px, für gmark wie die Effekte)
    'furt_schnee':         ('roh', 2.3, {'quelle': ('furt_krater_schnee_bogen', (8, 8, 1016, 1016))}),
    'krater_schnee_1':     ('aufkleber', 320, {'quelle': ('furt_krater_schnee_bogen', (1032, 8, 2040, 1016))}),
    'krater_schnee_2':     ('aufkleber', 250, {'quelle': ('furt_krater_schnee_bogen', (8, 1032, 1016, 2040))}),
    'brand_schnee':        ('aufkleber', 300, {'quelle': ('furt_krater_schnee_bogen', (1032, 1032, 2040, 2040))}),
    # Spuren im Schnee (Enrico 19:40, nur die ausgewählten Felder): alle so gedreht, dass die Fahrtrichtung nach rechts (+x) zeigt; Bogen b sind ganze Kacheln → maske
    'spur_schnee_1':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_a', (1678, 4, 2507, 828)), 'angleichen': 'boden_schnee_rein_1'}),                      # Räder mit Hufen (Geschütz, Wagen)
    'spur_schnee_2':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_a', (841, 836, 1670, 1660)), 'angleichen': 'boden_schnee_rein_1'}),                      # Schreiter-Fußabdrücke
    'spur_schnee_3':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_b', (853, 16, 1658, 816)), 'maske': True, 'drehen': 1, 'nur_dunkel': True}),   # Ketten geradeaus
    'spur_schnee_4':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_b', (1690, 16, 2495, 816)), 'maske': True, 'drehen': 1, 'nur_dunkel': True}),   # Ketten gebogen (Fahrzeug dreht)
    'spur_schnee_5':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_b', (16, 848, 821, 1648)), 'maske': True, 'drehen': 1, 'nur_dunkel': True}),   # Hufe (Reiter)
    'spur_schnee_6':       ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_b', (853, 848, 1658, 1648)), 'maske': True, 'entblut': True, 'nur_dunkel': True}),   # zertrampelt nach Nahkampf (roter Fleck → Matsch)
    'eisloch_schnee':      ('aufkleber', 320, {'quelle': ('spuren_schnee_bogen_a', (1678, 836, 2507, 1660)), 'angleichen': 'boden_eis'}),                      # Eisloch (bereitgelegt, Regel offen)
    # Uferkante flach (Enrico 19:45): Draufsicht, oben Schnee, Mitte Uferlinie, unten Eis; Mittelteil, waagrecht nahtlos, oben/unten weich
    'ufer_flach_1':        ('uferstreifen', None, {'quelle': ('ufer_schnee_flach_bogen', (240, 10, 2320, 548))}),
    'ufer_flach_2':        ('uferstreifen', None, {'quelle': ('ufer_schnee_flach_bogen', (240, 577, 2320, 1107))}),
    'ufer_flach_3':        ('uferstreifen', None, {'quelle': ('ufer_schnee_flach_bogen', (240, 1137, 2320, 1655))}),   # steinig (seltener)
    'zaun_schnee':         ('wand', 0.8, {'quelle': ('streifen_schnee_bogen', (0, 103, 2896, 355)), 'weich_unten': 30}),
    'ufer_schnee':         ('wand', 0.4, {'quelle': ('streifen_schnee_bogen', (0, 640, 2896, 845)), 'weich_unten': 6}),
    'unterholz_schnee':    ('wand', 0.45, {'quelle': ('streifen_schnee_bogen', (0, 1104, 2896, 1300)), 'weich_unten': 60}),
    # G2b/G3b (2026-11-25, Berater, ComfyUI Qwen Image Edit, ui-quelle/gelaende/neu_g/): Grabenteile und Feldteile (Plan GELAENDE_G_PLAN.md Abschnitt 3)
    'graben_querwand_a':   ('bogen', ('gemeinsam', 0.5), {'namen': ['graben_querwand_1', 'graben_querwand_2', 'graben_querwand_3']}),   # G-1 Querwand (Traverse), von vorn
    'graben_querwand_b':   ('bogen', ('gemeinsam', 0.5), {'namen': ['graben_querwand_4', 'graben_querwand_5', 'graben_querwand_6']}),
    'graben_brustwehr':    ('wand', 0.4),                                       # G-2 Brustwehr Feindseite, Erde + Sandsäcke
    'graben_rueckwall':    ('wand', 0.22),                                      # G-3 niedriger Erdwall der Rückseite
    'graben_ecken':        ('bogen', ('gemeinsam', 0.42), {'namen': ['graben_ecke_1', 'graben_ecke_2', 'graben_ecke_3', 'graben_ecke_4']}),   # G-4: eher Stirnseiten → Rückseite der Buchten
    'graben_sohle_rost':   ('flach', [0.8, 0.75, 0.75, 0.8]),                   # G-5 Lattenroste einzeln
    'graben_pfuetze':      ('flach', [0.5, 0.45, 0.4]),                         # G-6
    'graben_leiter':       ('bogen', ('gemeinsam', 0.5), {'namen': ['graben_leiter_1', 'graben_leiter_2']}),   # G-7
    'graben_unterstand':   ('einzel', 0.55),                                    # G-8 (kleines Holzstück davor fällt weg)
    'graben_stahlschild':  ('bogen', ('gemeinsam', 0.28), {'namen': ['graben_stahlschild_1', 'graben_stahlschild_2']}),   # G-9
    'panzersperren_gesprengt': ('bogen', ('gemeinsam', 0.7), {'namen': ['sperre_weg_1', 'sperre_weg_2', 'sperre_weg_3', 'sperre_weg_4']}),   # G6: gleiche Anordnung wie panzersperren_1–4, gesprengt
    'windmuehle_bogen':    ('bogen', ('gemeinsam', 2.2), {'namen': ['muehle_heil', 'muehle_kaputt', 'muehle_heil_schnee', 'muehle_kaputt_schnee']}),   # G6: Windmühle beschädigt / zerstört, Schlamm / Schnee
    'koloss_wrack_bogen':  ('bogen', ('gemeinsam', 1.3), {'namen': ['wrack_1', 'wrack_2', 'wrack_schnee_1', 'wrack_schnee_2']}),   # G6: ausgebrannter Landkoloss, von vorn links / hinten rechts
    # G5b (2026-11-25): Drahtgürtel des Beraters (neu_draht/), je Stück ein fester Ausschnitt, gemeinsamer Maßstab 0,7 (Tiefenstück ≈ 560 px)
    'drahtguertel_schraeg_1': ('stueck', 0.7, {'quelle': ('drahtguertel_a', (30, 50, 1000, 760))}),     # schräg, links unten → rechts oben
    'drahtguertel_kaputt':    ('stueck', 0.7, {'quelle': ('drahtguertel_a', (1030, 170, 1670, 730))}),   # kurz, beschädigt
    'drahtguertel_tiefe':     ('stueck', 0.7, {'quelle': ('drahtguertel_a', (1600, 140, 2020, 1010))}),  # in die Tiefe
    'drahtguertel_schraeg_2': ('stueck', 0.7, {'quelle': ('drahtguertel_a', (20, 1090, 1010, 1870))}),
    'drahtguertel_schraeg_3': ('stueck', 0.7, {'quelle': ('drahtguertel_a', (670, 1180, 1570, 1990))}),
    'drahtguertel_ende':      ('stueck', 0.7, {'quelle': ('drahtguertel_a', (1390, 1410, 1950, 1930))}),  # Endstück mit loser Rolle
    'drahtguertel_quer_1':    ('stueck', 0.7, {'quelle': ('drahtguertel_b', (0, 30, 2048, 480))}),     # quer, heil
    'drahtguertel_quer_2':    ('stueck', 0.7, {'quelle': ('drahtguertel_b', (0, 490, 2048, 940))}),    # quer, beschädigt
    'graben_kram':         ('bogen', ('gemeinsam', 0.32), {'namen': ['graben_kiste', 'graben_kisten', 'graben_kanister', 'graben_balken', 'graben_drahtrolle', 'graben_einsturz', 'graben_eimer', 'graben_spaten']}),   # G-10
    'hecke_schnee_1':      ('wand', 0.6, {'quelle': ('hecke_schnee', (0, 740, 2496, 990)), 'weich_unten': 14}),    # F-3: nur die zwei Streifen unten (oben Brücke/Brunnen/Holz aus der Vorlage)
    'hecke_schnee_2':      ('wand', 0.6, {'quelle': ('hecke_schnee', (0, 1212, 2496, 1464)), 'weich_unten': 14}),
    'heuhaufen_schnee':    ('bogen', ('gemeinsam', 0.75), {'namen': ['heuhaufen_schnee_1', 'heuhaufen_pilz', 'heuhaufen_schnee_2', 'heuhaufen_schnee_3', 'heuhaufen_schnee_4', 'heuhaufen_schnee_5']}),   # F-4 (Pilz auf der Stange nicht benutzt)
    'vogelscheuche_schnee': ('einzel', 1.1),                                    # F-5
    'pflug_schnee':        ('einzel', 0.55),                                    # F-6 mit gemaltem Schneefleck
    # G7b-Test (2026-11-25): Bögen des Beraters (neu_g7/, je drei Streifen untereinander, Zeilen laut LIESMICH.md); Lippe liegt flach, Höhe hier nur Auflösung
    'graben_lippe_1':      ('wand', 0.6, {'quelle': ('graben_lippe_bogen', (0, 46, 2752, 498))}),         # trocken, krümelig
    'graben_lippe_2':      ('wand', 0.6, {'quelle': ('graben_lippe_bogen', (0, 553, 2752, 1008))}),       # nasser Schlamm
    'graben_lippe_3':      ('wand', 0.6, {'quelle': ('graben_lippe_bogen', (0, 1064, 2752, 1528))}),      # Wurzeln, Splitter (selten)
    'graben_wand_innen_1': ('wand', 0.5, {'quelle': ('graben_wand_innen_bogen', (0, 45, 2752, 492))}),    # Bretter
    'graben_wand_innen_2': ('wand', 0.5, {'quelle': ('graben_wand_innen_bogen', (0, 561, 2752, 1016))}),  # Flechtwerk
    'graben_wand_innen_3': ('wand', 0.5, {'quelle': ('graben_wand_innen_bogen', (0, 1082, 2752, 1532))}), # Sandsäcke
    # G7b voll (2026-11-25): G7-3 Seitenwand, G7-4 Brustwehr-Wall, G7-5 Lippen-Ecken, G7-6 Querwand (LIESMICH in neu_g7/)
    'graben_wand_seite_1': ('wand', 0.6, {'quelle': ('graben_wand_seite_bogen', (0, 46, 2752, 505))}),     # Bretter
    'graben_wand_seite_2': ('wand', 0.6, {'quelle': ('graben_wand_seite_bogen', (0, 554, 2752, 1010))}),   # Flechtwerk
    'graben_wand_seite_3': ('wand', 0.6, {'quelle': ('graben_wand_seite_bogen', (0, 1064, 2752, 1528))}),  # nackte Erde, Wurzeln
    'graben_brustwehr_wall_1': ('wand', 0.6, {'quelle': ('graben_brustwehr_wall_bogen', (0, 58, 2752, 494))}),   # ordentlich
    'graben_brustwehr_wall_2': ('wand', 0.6, {'quelle': ('graben_brustwehr_wall_bogen', (0, 529, 2752, 986))}),  # abgesackt
    'graben_lippe_ecke_1': ('stueck', 0.42, {'quelle': ('graben_lippe_ecken_bogen', (146, 50, 1316, 743))}),     # oben links
    'graben_lippe_ecke_2': ('stueck', 0.42, {'quelle': ('graben_lippe_ecken_bogen', (1467, 46, 2622, 743))}),    # oben rechts
    'graben_lippe_ecke_3': ('stueck', 0.42, {'quelle': ('graben_lippe_ecken_bogen', (144, 804, 1314, 1516))}),   # unten links
    'graben_lippe_ecke_4': ('stueck', 0.42, {'quelle': ('graben_lippe_ecken_bogen', (1501, 816, 2622, 1527))}),  # unten rechts
    # G7h (2026-11-26): breite Seitenwand ohne Pfosten (G7-3b), Querwand als Erdblock (G7-6b), neu_g7h/
    'graben_wand_seite_breit_1': ('wand', 0.6, {'quelle': ('graben_wand_seite_breit_bogen', (0, 42, 2752, 524))}),     # Bretter waagerecht
    'graben_wand_seite_breit_2': ('wand', 0.6, {'quelle': ('graben_wand_seite_breit_bogen', (0, 554, 2752, 1041))}),   # Flechtwerk
    'graben_wand_seite_breit_3': ('wand', 0.6, {'quelle': ('graben_wand_seite_breit_bogen', (0, 1065, 2752, 1536))}),  # Erde mit Wurzeln
    'graben_querwand_block_1': ('stueck', 0.3, {'quelle': ('graben_querwand_block_bogen', (102, 124, 1327, 741))}),    # Bretter
    'graben_querwand_block_2': ('stueck', 0.3, {'quelle': ('graben_querwand_block_bogen', (1436, 124, 2652, 740))}),   # Flechtwerk
    'graben_querwand_block_3': ('stueck', 0.3, {'quelle': ('graben_querwand_block_bogen', (96, 801, 1336, 1406))}),    # Bretter, Variante
    'graben_querwand_block_4': ('stueck', 0.3, {'quelle': ('graben_querwand_block_bogen', (1433, 790, 2666, 1423))}),  # zerschossen
    'graben_querwand_tief_1': ('stueck', 0.3, {'quelle': ('graben_querwand_tief_bogen', (29, 76, 924, 1498))}),   # Bretter
    'graben_querwand_tief_2': ('stueck', 0.3, {'quelle': ('graben_querwand_tief_bogen', (957, 76, 1824, 1498))}), # Flechtwerk
    'graben_querwand_tief_3': ('stueck', 0.3, {'quelle': ('graben_querwand_tief_bogen', (1877, 76, 2722, 1498))}),# beschädigt
    # G7h-2 (2026-11-26): gerade Lattenroste, Drahtgürtel-Module (Querschnitt, Punkt 88.2), ganze Hausruinen (Punkt 88.1), neu_g7h/
    'graben_laufsteg_1': ('wand', 0.5, {'quelle': ('graben_laufsteg_bogen', (0, 41, 2752, 369))}),      # sauber
    'graben_laufsteg_2': ('wand', 0.5, {'quelle': ('graben_laufsteg_bogen', (0, 423, 2752, 752))}),     # schlammig
    'graben_laufsteg_3': ('wand', 0.5, {'quelle': ('graben_laufsteg_bogen', (0, 806, 2752, 1131))}),    # mit Pfütze
    'graben_laufsteg_4': ('wand', 0.5, {'quelle': ('graben_laufsteg_bogen', (0, 1186, 2752, 1511))}),   # zwei Latten fehlen
    'draht_modul_1': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (45, 80, 874, 537))}),
    'draht_modul_2': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (960, 80, 1790, 537))}),
    'draht_modul_3': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (1876, 82, 2707, 537))}),
    'draht_modul_4': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (44, 1004, 875, 1458))}),
    'draht_modul_kaputt': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (968, 1004, 1791, 1489))}),
    'draht_modul_reste': ('stueck', 0.36, {'quelle': ('drahtguertel_tiefe_module_bogen', (1899, 1003, 2703, 1492))}),
    'ruine_haus_1': ('stueck', 0.4, {'quelle': ('ruinen_haus_bogen', (182, 6, 1251, 784))}),
    'ruine_haus_2': ('stueck', 0.4, {'quelle': ('ruinen_haus_bogen', (1476, 87, 2582, 779))}),
    'ruine_haus_3': ('stueck', 0.4, {'quelle': ('ruinen_haus_bogen', (161, 784, 1254, 1522))}),
    'ruine_haus_4': ('stueck', 0.4, {'quelle': ('ruinen_haus_bogen', (1480, 921, 2586, 1514))}),
}
TEX_PX, TEX_PROBE = 1024, 768


# Bögen aus JPG (Sankt Ruß): rosa Reste in Glasscherben und Säumen (Magenta schimmert durch) → neutrales Grau
ENTROSA = {'zaun', 'kirche_hinten', 'kirche_vorn', 'mauer_niedrig', 'kirchturm', 'kirche_innen', 'friedhof', 'dorf_aufsteller',
           'haus_heil_bogen', 'kapelle_ruinen_bogen', 'baeume_schnee_bogen', 'dorf_objekte_schnee_bogen', 'streifen_schnee_bogen', 'furt_krater_schnee_bogen',
           'hecke_schnee', 'heuhaufen_schnee', 'vogelscheuche_schnee', 'pflug_schnee',
           'graben_querwand_a', 'graben_querwand_b', 'graben_brustwehr', 'graben_rueckwall', 'graben_ecken', 'graben_sohle_rost', 'graben_pfuetze', 'graben_leiter', 'graben_unterstand', 'graben_stahlschild', 'graben_kram', 'drahtguertel_a', 'drahtguertel_b', 'graben_lippe_bogen', 'graben_wand_innen_bogen', 'graben_wand_seite_bogen', 'graben_brustwehr_wall_bogen', 'graben_lippe_ecken_bogen', 'graben_querwand_tief_bogen', 'panzersperren_gesprengt', 'windmuehle_bogen', 'koloss_wrack_bogen', 'graben_wand_seite_breit_bogen', 'graben_querwand_block_bogen', 'graben_laufsteg_bogen', 'drahtguertel_tiefe_module_bogen', 'ruinen_haus_bogen'} | {n for n in ('schraeg_1', 'kaputt', 'tiefe', 'schraeg_2', 'schraeg_3', 'ende', 'quer_1', 'quer_2') for n in ['drahtguertel_' + n]}   # Krähenfurt (Flux)


def entrosa(q):
    r, g, b = q[..., 0], q[..., 1], q[..., 2]
    m = np.clip((np.minimum(r - g, b - g) - 4) / 14, 0, 1) * (q[..., 3] > 0)
    lum = 0.3 * r + 0.59 * g + 0.11 * b
    for i, k in enumerate((0.97, 1.0, 1.04)): q[..., i] = q[..., i] * (1 - m) + lum * k * m
    print(f'  rosa entfärbt: {(m > 0.5).sum()} px')
    return q


def freistellen(path):
    if path.stem in ENTROSA: return entrosa(freistellen0(path))
    return freistellen0(path)


def freistellen0(path, a=None):
    if a is None: a = np.asarray(Image.open(path).convert('RGB'))
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


def streifen(name, art, sh, opt=None):
    opt = opt or {}
    if 'quelle' in opt:   # Ausschnitt aus einem gemeinsamen Bogen (Krähenfurt: drei Streifen untereinander)
        b, (x0, y0, x1, y1) = opt['quelle']
        q = freistellen(quelle(b))[y0:y1, x0:x1].copy()
    else:
        q = freistellen(quelle(name))
    if opt.get('weich_unten'):   # gemalter Boden unter dem Streifen: nur der aufrechte Teil bleibt, die untersten Zeilen laufen weich aus
        n = opt['weich_unten']; q[-n:, :, 3] *= np.linspace(1, 0, n)[:, None] ** 1.5
    if 'schnitt' in opt:   # Kachel von Hand: genau von x0 bis x1, die nächsten ow Spalten hinter x1 werden in den Anfang überblendet
        x0, x1 = opt['schnitt']; ow = 30
        q = zeilen(q[:, x0:x1 + ow])
        if art == 'wand':
            cov = (q[..., 3] > 128).mean(axis=1); q = q[:np.where(cov > 0.6)[0].max() + 1]
        q = nahtlos(q, ow)
        print(f'  Kachel von Hand {x0}–{x1}, Naht {naht(q):.1f}×')
        h = PX_SH * sh; speichern(q, name, h, q.shape[1] * h / q.shape[0] * opt.get('breite', 1))
        return
    q = zeilen(q)
    cc = (q[..., 3] > 128).mean(axis=0); xs = np.where(cc > cc.max() * 0.3)[0]   # schmalen Magenta-Rand links/rechts abschneiden
    q = q[:, xs.min():xs.max() + 1]
    rand = (q[:, :4, 3] > 128).mean(), (q[:, -4:, 3] > 128).mean()
    if min(rand) < 0.15:
        print(f'  WARNUNG: Streifen reicht nicht bis an den Bildrand (Deckung links {rand[0]:.2f}, rechts {rand[1]:.2f})')
    if art == 'wand':   # Fußlinie: unterste Zeile, die über die Breite zu 60 % gedeckt ist; darunter abschneiden
        cov = (q[..., 3] > 128).mean(axis=1)
        foot = np.where(cov > opt.get('fuss', 0.6))[0].max()
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
    h = PX_SH * sh if art == 'wand' else PX_R
    speichern(q, name, h, q.shape[1] * h / q.shape[0] * opt.get('breite', 1))


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


def furchen_waagrecht(a):
    """Acker: Furchen per Strukturtensor messen, waagrecht drehen, Quadrat innen ausschneiden und die Höhe auf ganze Furchen kürzen (kachelt dann oben/unten)."""
    lum = a.mean(axis=2); gy, gx = np.gradient(ndimage.gaussian_filter(lum, 2))
    jxx, jyy, jxy = (gx * gx).mean(), (gy * gy).mean(), (gx * gy).mean()
    winkel = 0.5 * np.degrees(np.arctan2(2 * jxy, jxx - jyy))   # Richtung des stärksten Anstiegs = quer zu den Furchen
    dreh = winkel - 90 if winkel > 0 else winkel + 90
    src = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    def schaerfe(d):   # Furchen genau waagrecht = Zeilenmittel schwanken am stärksten
        b = np.asarray(src.rotate(d, resample=Image.BILINEAR)).astype(np.float64); n = a.shape[0] // 4
        return b[n:-n, n:-n].mean(axis=(1, 2)).var()
    for schritt in (1.0, 0.25, 0.0625):
        dreh = max((dreh + k * schritt for k in range(-4, 5)), key=schaerfe)
    im = src.rotate(dreh, resample=Image.BICUBIC)
    s = int(a.shape[0] / (abs(np.cos(np.radians(dreh))) + abs(np.sin(np.radians(dreh))))) - 8
    cx, cy = im.width // 2, im.height // 2; b = np.asarray(im.crop((cx - s // 2, cy - s // 2, cx + s // 2, cy + s // 2))).astype(np.float64)
    # Furchen sind gemalt leicht gebogen: je Spaltenblock die senkrechte Verschiebung gegen die Mitte messen und gerade ziehen
    lum = b.mean(axis=2); H, W = lum.shape; ref = lum[:, W // 2 - 24:W // 2 + 24].mean(axis=1); ref = ref - ref.mean()
    zm = ref; ac = np.correlate(zm, zm, 'full')[len(zm) - 1:]
    per = next(i for i in range(4, len(ac) - 1) if ac[i] > ac[i - 1] and ac[i] >= ac[i + 1] and ac[i] > 0.2 * ac[0])
    xs, vs = [], []
    for x0 in range(0, W - 24, 24):
        p = lum[:, x0:x0 + 24].mean(axis=1); p = p - p.mean()
        best = max(range(-per // 2, per // 2 + 1), key=lambda d: (np.roll(p, -d)[per:-per] * ref[per:-per]).sum())
        xs.append(x0 + 12); vs.append(best)
    vs = np.unwrap(np.array(vs, float) * 2 * np.pi / per) * per / (2 * np.pi)   # über die Breite stetig
    versatz = ndimage.gaussian_filter1d(np.interp(np.arange(W), xs, vs), 20)
    for x in range(W): b[:, x] = ndimage.shift(b[:, x], (-versatz[x], 0), order=1, mode='wrap')
    n = int(b.shape[0] * 0.9 // per); h = n * per; b = b[(H - h) // 2:(H - h) // 2 + h, :]
    print(f'  Furchen um {dreh:.2f}° gedreht, Biegung bis {np.ptp(versatz):.0f} px gerade gezogen, Abstand {per} px, {n} Furchen → {W}×{h}')
    return b


def textur(name, ziel=None, opt=None):
    opt = opt or {}
    if 'quelle' in opt:
        bq, box = opt['quelle']; a = np.asarray(Image.open(SRC / f'{bq}.png').convert('RGB').crop(box)).astype(np.float64)
    else:
        a = np.asarray(Image.open(SRC / f'{name}.png').convert('RGB')).astype(np.float64)
    if opt.get('furchen'): a = furchen_waagrecht(a)
    name_q, name = name, ziel or name
    h, w = a.shape[:2]
    nx, ny = naht(a), naht(a.transpose(1, 0, 2))
    if opt.get('weich'):   # Krähenfurt: weiche Überblendung über die ganze Kachel (sin²-Fenster) mit erhaltenem Kontrast – kein sichtbarer Rahmen wie bei der schmalen Rampe
        # nacheinander je Richtung (erst waagrecht, dann senkrecht): ein Fenster in beiden Richtungen zugleich lässt die Naht der verschobenen Fassung in der Kachelmitte stehen
        mu = a.mean(axis=(0, 1))
        for ax in ((0,) if opt.get('nur') == 'senkrecht' else (1, 0)):
            n = a.shape[ax]; T = np.sin(np.pi * (np.arange(n) + 0.5) / n) ** 2
            T = (T[None, :, None] if ax == 1 else T[:, None, None]); rl = np.roll(a, n // 2, axis=ax)
            a = mu + ((a - mu) * T + (rl - mu) * (1 - T)) / np.sqrt(T ** 2 + (1 - T) ** 2)
    elif opt.get('furchen'): pass   # Acker wird im Spiel je Feld einmal gelegt (kein Kacheln, Felder wie ein Flickenteppich): gerade gezogen, sonst unverändert
    elif opt.get('nur') == 'senkrecht':   # nur in einer Richtung überblenden (Furchen laufen waagrecht durch; Straße wird quer gelegt)
        rl = np.roll(a, (h // 2, 0) if opt.get('nur') else (0, w // 2), axis=(0, 1))   # Furchen: gerade gezogen, Höhe = ganze Furchen; nur links/rechts überblenden
        y = np.minimum(np.arange(h), h - 1 - np.arange(h))[:, None]; x = np.minimum(np.arange(w), w - 1 - np.arange(w))[None, :]
        t = np.clip(y / (h * 0.16), 0, 1) if opt.get('nur') else np.clip(x / (w * 0.16), 0, 1)
        t = (t * t * (3 - 2 * t)) * np.ones((h, w)); a = a * t[..., None] + rl * (1 - t[..., None])
    elif max(nx, ny) > 1.4:   # Hälfte verschieben (Naht liegt dann in der Mitte) und mit dem Original überblenden: Ränder aus der verschobenen Fassung, Mitte aus dem Original
        rl = np.roll(a, (h // 2, w // 2), axis=(0, 1))
        y = np.minimum(np.arange(h), h - 1 - np.arange(h))[:, None]; x = np.minimum(np.arange(w), w - 1 - np.arange(w))[None, :]
        ramp = 0.16
        t = np.clip(np.minimum(y / (h * ramp), x / (w * ramp)), 0, 1); t = t * t * (3 - 2 * t)
        a = a * t[..., None] + rl * (1 - t[..., None])
    if opt.get('hell'):   # auf Ziel-Mittelwert dämpfen, Schatten etwas bläulich (Schnee)
        a = a * (opt['hell'] * 255 / a.mean()); a = a * np.array([0.96, 0.99, 1.05])
    hell = a.mean() / 255
    print(f'  Naht waagrecht {nx:.1f}×, senkrecht {ny:.1f}× → {naht(a):.1f}×, {naht(a.transpose(1, 0, 2)):.1f}×; Helligkeit {hell:.2f}')
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')
    OUT.mkdir(parents=True, exist_ok=True); PROBE.mkdir(parents=True, exist_ok=True)
    im.resize((TEX_PX, TEX_PX), Image.LANCZOS).save(OUT / f'{name}.png')
    im.resize((TEX_PROBE, TEX_PROBE), Image.LANCZOS).save(PROBE / f'g_{name}.webp', quality=86, method=6)
    print(f'  → {name}: {TEX_PX}×{TEX_PX}')


def teile_finden(q, n_min=0.08, reihen=2):
    al = ndimage.binary_closing(q[..., 3] > 60, iterations=6)
    lab, n = ndimage.label(al)
    sizes = ndimage.sum(al, lab, range(1, n + 1))
    teile = [i + 1 for i, v in enumerate(sizes) if v > sizes.max() * n_min]
    fo = ndimage.find_objects(lab); boxes = [fo[i - 1] for i in teile]
    H = q.shape[0]
    boxes.sort(key=lambda b: (int((b[0].start + b[0].stop) / 2 / (H / reihen)), b[1].start))
    out = []
    for b in boxes:
        t = q[b].copy(); maske = ndimage.binary_dilation((lab[b] > 0) & np.isin(lab[b], teile), iterations=3); t[~maske, 3] = 0
        ys, xs = np.where(t[..., 3] > 40); out.append(t[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
    return out


def flach(name, groessen):
    stuecke = teile_finden(freistellen(quelle(name)), 0.05)
    if len(stuecke) != len(groessen):
        print(f'  WARNUNG: {len(stuecke)} Teile gefunden, {len(groessen)} erwartet')
    for k, (t, g) in enumerate(zip(stuecke, groessen), 1):
        f = g * PX_R / max(t.shape[:2])
        speichern(t, f'{name}_{k}', t.shape[0] * f, t.shape[1] * f)


def stueck(name, k, opt):   # G5b (2026-11-25): ein Teil per festem Ausschnitt aus einem Bogen; nur das größte Teil samt anhängenden Resten in seinem Umriss, Maßstab k (Ausgabe-px je Quell-px)
    b, (x0, y0, x1, y1) = opt['quelle']
    q = freistellen(quelle(b))[y0:y1, x0:x1].copy()
    al = ndimage.binary_closing(q[..., 3] > 60, iterations=4)
    lab, n = ndimage.label(al); sizes = ndimage.sum(al, lab, range(1, n + 1)); g = int(np.argmax(sizes)) + 1
    fo = ndimage.find_objects(lab)[g - 1]; keep = np.zeros(n + 1, bool); keep[g] = True
    nah = ndimage.binary_dilation(lab == g, iterations=25)   # Reste (lose Drahtenden) nur, wenn sie das Hauptteil fast berühren (höchstens 25 px)
    for i in set(np.unique(lab[nah])) - {0, g}: keep[i] = True
    m = ndimage.binary_dilation(keep[lab], iterations=3); q[~m, 3] = 0
    ys, xs = np.nonzero(q[..., 3] > 8); q = q[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    if opt.get('spiegeln'): q = q[:, ::-1].copy()
    speichern(q, name, q.shape[0] * k)


def einzel(name, h):
    t = teile_finden(freistellen(quelle(name)))[0]
    speichern(t, name, PX_SH * h)


def bogen(name, hoehen, opt=None):
    opt = opt or {}
    if isinstance(hoehen, tuple):   # ein Maßstab für den ganzen Bogen
        stuecke = teile_finden(freistellen(quelle(name)), reihen=hoehen[2] if len(hoehen) > 2 else 2)
        f = hoehen[1] * PX_SH / max(t.shape[0] for t in stuecke)
        namen = opt.get('namen') or [f'{name}_{k}' for k in range(1, len(stuecke) + 1)]
        if len(namen) != len(stuecke): print(f'  WARNUNG: {len(stuecke)} Teile gefunden, {len(namen)} erwartet')
        for k, (t, n) in enumerate(zip(stuecke, namen), 1):
            if k in opt.get('spiegeln', []): t = t[:, ::-1].copy(); print(f'  {n} gespiegelt')
            speichern(t, n, t.shape[0] * f)
        print(f'  {len(stuecke)} Teile, gemeinsamer Maßstab')
        return
    q = freistellen(quelle(name))
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


# Steinbrücke (Krähenfurt): in hinten (hintere Brüstung + Fahrbahn) und vorn (vordere Brüstung, Bogen, Pfeiler) teilen, damit Figuren auf der Fahrbahn
# zwischen beiden stehen; der gemalte Schneesockel und der Boden unter dem Bogen fallen weg (darunter liegt im Spiel das Eis).
# Vielecke von Hand in Bildpunkten von bruecke_stein.png (618×295, Ausschnitt aus dorf_objekte_schnee_bogen bei gemeinsamem Maßstab 1,2 SH).
BRUECKE_HINTEN = [(146, 0), (200, 0), (300, 0), (380, 18), (440, 44), (500, 84), (556, 94), (558, 170), (452, 164), (395, 157), (350, 120),
                  (300, 90), (230, 62), (150, 55), (92, 52), (146, 52)]
BRUECKE_VORN = [(34, 38), (92, 42), (150, 46), (230, 53), (300, 81), (350, 111), (395, 148), (455, 153), (455, 247), (395, 248), (330, 240), (318, 234),
                (310, 210), (295, 170), (270, 140), (245, 125), (210, 119), (175, 125), (150, 145), (140, 176), (75, 146), (34, 118)]


def bruecke_teilen():
    from PIL import ImageDraw, ImageFilter
    im = Image.open(OUT / 'bruecke_stein.png').convert('RGBA')
    for teil, poly in (('hinten', BRUECKE_HINTEN), ('vorn', BRUECKE_VORN)):
        m = Image.new('L', im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255); m = m.filter(ImageFilter.GaussianBlur(0.8))
        t = np.asarray(im).astype(np.float64); t[..., 3] *= np.asarray(m) / 255
        out = Image.fromarray(np.clip(t, 0, 255).astype(np.uint8), 'RGBA')   # gleiche Leinwand wie das Ganze: beide Teile haben denselben Fußpunkt
        out.save(OUT / f'bruecke_stein_{teil}.png'); out.save(PROBE / f'g_bruecke_stein_{teil}.webp', quality=88, method=6)
        print(f'  → bruecke_stein_{teil}: {out.width}×{out.height}')


def roh(name, groesse, opt):   # deckendes Stück (Furt-Kachel): nur ausschneiden und auf groesse Feldradien bringen
    b, box = opt['quelle']; im = Image.open(SRC / f'{b}.png').convert('RGB').crop(box)
    a = np.dstack([np.asarray(im).astype(np.float64), np.full(im.size[::-1], 255.0)])
    speichern(a, name, groesse * PX_R, groesse * PX_R)


def aufkleber(name, px, opt):   # Aufkleber aus einem Feld eines Bogens: freistellen (Hintergrund aus dem Feldrand), rosa Säume entfärben, größte Seite px
    b, box = opt['quelle']; a = np.asarray(Image.open(SRC / f'{b}.png').convert('RGB').crop(box))
    if opt.get('maske'):   # ganze Kachel ohne Hintergrund: Rand weich auslaufen lassen (abgerundetes Rechteck), damit die Spur auf dem reinen Schnee liegt
        h, w = a.shape[:2]; y = np.minimum(np.arange(h), h - 1 - np.arange(h))[:, None] / (h * 0.22); x = np.minimum(np.arange(w), w - 1 - np.arange(w))[None, :] / (w * 0.22)
        t = np.clip(np.minimum(x, y), 0, 1); t = t * t * (3 - 2 * t); q = np.dstack([a.astype(np.float64), t * 255])
    else:
        q = entrosa(freistellen0(None, a))
    if opt.get('entblut'):   # roter Blutfleck → Matschbraun
        r_, g_, b_ = q[..., 0], q[..., 1], q[..., 2]; m = ndimage.gaussian_filter(np.clip((r_ - np.maximum(g_, b_) - 4) / 14, 0, 1), 2.0)
        lum = 0.3 * r_ + 0.59 * g_ + 0.11 * b_
        for c_, kk in enumerate((1.05, 0.98, 0.85)): q[..., c_] = q[..., c_] * (1 - m) + lum * kk * m
        print(f'  Blut entfernt: {(m > 0.5).sum()} px')
    if opt.get('nur_dunkel'):   # gemalter Schneegrund wird durchsichtig, nur die (dunkleren) Spuren bleiben – liegt dann auf dem Spielschnee ohne helles Rechteck
        lum = 0.3 * q[..., 0] + 0.59 * q[..., 1] + 0.11 * q[..., 2]; ref = np.percentile(lum[q[..., 3] > 200], 55 if opt['nur_dunkel'] is True else opt['nur_dunkel'])   # Zahl = Perzentil des Schneegrunds (heller gemalter Grund: höher)
        q[..., 3] *= np.clip((ref - lum - ref * 0.04) / (ref * 0.22), 0, 1) ** 0.8
        q[..., 3] *= np.clip(ndimage.distance_transform_edt(q[..., 3] > 20) / 16, 0, 1)   # Saum der freigestellten Fläche (rosa Linie) weich weg
    if opt.get('angleichen'):   # gemalter Schneegrund auf den Spielschnee abdunkeln (Median gleich), Rand breit weich – kein helles Rechteck
        ziel = np.asarray(Image.open(OUT / f"{opt['angleichen']}.png").convert('RGB')).astype(np.float64).reshape(-1, 3); m_ = q[..., 3] > 200
        q[..., :3] *= (np.median(ziel, axis=0) / np.median(q[..., :3][m_], axis=0))[None, None, :]
        q[..., 3] *= np.clip(ndimage.distance_transform_edt(q[..., 3] > 20) / 45, 0, 1) ** 1.5
    if opt.get('drehen'): q = np.rot90(q, opt['drehen']).copy()
    q = zeilen(q)
    xs = np.where((q[..., 3] > 40).any(axis=0))[0]; q = q[:, xs.min():xs.max() + 1]
    f = px / max(q.shape[:2]); speichern(q, name, q.shape[0] * f, q.shape[1] * f)


def uferstreifen(name, opt):   # flacher Uferstreifen: waagrecht nahtlos (Überblendung mit Kontrasterhalt), oben und unten weich auslaufend; Breite 1024 px
    b, box = opt['quelle']; a = np.asarray(Image.open(SRC / f'{b}.png').convert('RGB').crop(box)).astype(np.float64)
    h, w = a.shape[:2]; mu = a.mean(axis=(0, 1)); T = (np.sin(np.pi * (np.arange(w) + 0.5) / w) ** 2)[None, :, None]; rl = np.roll(a, w // 2, axis=1)
    a = mu + ((a - mu) * T + (rl - mu) * (1 - T)) / np.sqrt(T ** 2 + (1 - T) ** 2)
    y = np.arange(h); t = np.clip(np.minimum(y / (h * 0.2), (h - 1 - y) / (h * 0.2)), 0, 1); t = t * t * (3 - 2 * t)
    q = np.dstack([a, np.repeat(t[:, None], w, axis=1) * 255])
    print(f'  Naht {naht(q):.1f}×'); speichern(q, name, 1024 * h / w, 1024)


def einbetten():
    """Bausteine fürs Spiel in src/gelaende.js einbetten (window.GELAENDE = { name: data-URI }); nur was gelaende_bau.js lädt."""
    import base64, re
    NL = chr(10)
    js = (ROOT / 'src' / 'gelaende_bau.js').read_text(encoding='utf8')
    weg = ('drahtguertel_x_', 'heuhaufen_pilz', 'ruine_paar_aufsteller', 'ruinen_test_weiss', 'wald_stamm_', 'trichter_schwarz', 'details_schwarz')
    teile = []
    for f in sorted(PROBE.glob('g_*.webp')):
        n = f.stem[2:]
        if any(n.startswith(w) for w in weg): continue
        if n == 'draht': continue   # alter Drahtstreifen wird nicht mehr benutzt; Einzelpfähle seit G5 (2026-11-25) wieder für die Pfahlreihen
        teile.append(f'"{n}": "data:image/webp;base64,{base64.b64encode(f.read_bytes()).decode()}"')
    out = ROOT / 'src' / 'gelaende.js'
    kopf = ('// ===== ARMARGEDDON GELÄNDE-BAUSTEINE (neue Ansicht) =====' + NL +
            '// Erzeugt von tools/gelaende_cut.py --einbetten aus entwurf/probe/gelaende/g_*.webp. Datendatei, nicht von Hand ändern, nicht komplett lesen.' + NL)
    out.write_text(kopf + 'window.GELAENDE = {' + NL + (',' + NL).join(teile) + NL + '};' + NL, encoding='utf8', newline=NL)
    print(f'src/gelaende.js: {len(teile)} Bilder, {out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    if '--einbetten' in sys.argv:
        einbetten(); sys.exit(0)
    args = [x for x in sys.argv[1:] if x != '--schwarz']
    if '--schwarz' in sys.argv:
        for name in args: TEILE[name] = ('flach', [0.9] * 8)
    for name in args or TEILE:
        art, h, *opt = TEILE[name]
        print(name)
        if art == 'bogen':
            bogen(name, h, opt[0] if opt else None)
            if name == 'dorf_objekte_schnee_bogen': bruecke_teilen()
        elif art == 'stueck':
            stueck(name, h, opt[0])
        elif art == 'flach':
            flach(name, h)
        elif art == 'einzel':
            einzel(name, h)
        elif art == 'textur':
            textur(name, h, opt[0] if opt else None)
        elif art == 'uferstreifen':
            uferstreifen(name, opt[0])
        elif art == 'roh':
            roh(name, h, opt[0])
        elif art == 'aufkleber':
            aufkleber(name, h, opt[0])
        else:
            streifen(name, art, h, opt[0] if opt else None)
            if name == 'draht': pfaehle_ausduennen(name)
