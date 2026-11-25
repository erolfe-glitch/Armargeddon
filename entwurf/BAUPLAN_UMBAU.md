# Bauplan großer Umbau (Etappe 3 und 4) – Stand 2026-11-25 (Fassung 2, Antworten 25.11. 06:15)

**Nur Plan, nichts gebaut.** Enrico und der Berater prüfen; **U0 erst nach Freigabe.** Je Paket ein `pa`, Stufe Mittel, Sparregeln gelten: keine Hilfs-Agenten, keine Läufe über 10 Minuten ohne Rückfrage, Zwischenstände committen. Nach jedem U-Paket kommt ein Bericht mit Bildern; Enrico schaut ihn an.

**Rückweg:** Vor dem ersten Umbau-Paket den Git-Tag `vor-umbau` setzen. Jedes Paket hat einen Schalter für die alte Fassung (`MASSSTAB_ALT`, `MODELLSCHADEN_ALT`, `MORAL_ALT`, `ENDE_ALT` …, wie heute `SCHARF_NEU`, `ENTSETZ_ALT`). **Die Schalter bleiben bis nach Enricos Spieltest drin** (Punkt 52.5).

**Was sich gegenüber Fassung 1 geändert hat:**
- Abschnitt 6: Die Fragen sind beantwortet (Punkt 52).
- Abschnitt 5 hat die neue Reihenfolge (Mittelweg), dazu Platz für das Gelände-Paket G zwischen U1 und U2 und das Scharfschützen-Paket S nach U8.
- U4 bekommt die Ordner je Fraktion (Punkt 53).
- Neu sind die Abschnitte 7–11 aus den beiden fremden Prüfungen (Punkt 54): Begriffe, Feuerkraft-Stufen, Pannen, Nachschub, Zwischenmessungen, Preise, Risiko-Anzeige, Antworten aus dem Code.

## 1. Entscheidungen, die feststehen (Punkte 48–52)

- **Maßstab E1:**
  - Linieninfanterie (Schützenkohorte, Grenadiere) **10 Figuren** je Feld, Reiter **6**, Spezialtrupps **4** (wie heute).
  - Soldat **0,52 Feldradien** (heute 0,8, also ×0,65), lockerer verteilt.
  - **MG, Geschütze, Reiter und Helden** schrumpfen im selben Verhältnis (×0,65).
  - **Kettenfahrzeuge** (Landkoloss, Sturmpanzer, Bohrkoloss) und **alle Schreiter** (auch Kreuzschreiter und Eisenknecht) schrumpfen **×0,85** (Punkt 51).
  - Probebilder: `entwurf/probe/massstab/` (E1, E1f85).
- **Klone:** zuerst **im Code** beheben. Jede Figur wird einzeln gespiegelt, leicht versetzt und leicht gedreht. Der Code nimmt **mehrere Ruheposen je Trupp** auf; die Bögen malt der Berater später.
- **Graben:** 10 Plätze entlang der Grabenlinie (`gbPlatz` liefert heute 4). Die Gräben selbst werden **vorher** neu gemacht (Paket G).
- **Ringe, Balken, Zustandsmarken und Knöpfe** bleiben bewusst gleich groß (lesbar, antippbar ≥ 40 px).
- **Gefallene Modelle bleiben liegen:** einige Runden, dann verblassen sie; mit dem Blut-Schalter abschaltbar.
- **Schlachtlänge:** kurz/mittel/lang = **12/18/24 Runden**, Auswahl im Startmenü, Zeiten im Spieltest nachmessen. Die Rundengrenze ist **je Karte anpassbar** (Grabenkarten langsamer).
- **Vorzeitiger Sieg:** alle Zielfelder **2 eigene Runden am Stück** halten (Einzelheiten in Abschnitt 9).
- **Stimmen klonen** (fehlende Sprachbefehle, `entwurf/postfach/STIMMEN_FEHLEN.md`): spätere Stufe, nicht Teil dieses Umbaus.
- **Dritte Fraktion „Fahle“:** erst nach dem Umbau. Nicht schneiden, nicht einbauen.

## 2. Was skaliert von selbst, was muss nachgezogen werden (Punkt 48)

Aufwand: **S** bis 1 Stunde · **M** halber Tag (etwa ein kleines Paket) · **L** ein ganzes Paket.

| Bereich | Heute | Folge bei E1 | Aufwand | Paket |
|---|---|---|---|---|
| Figurengröße Trupps | `FIG_SH` × `nf.sc` | **ein Faktor** (in der Probe schon so gemacht) | S | U1 |
| Figurengröße Modelle mit Tiefe (MG, Geschütze, Fahrzeuge, Schreiter) | eigene Formel ohne `nf.sc` | eigenen Faktor einführen (in der Probe: `tiefSc`) | S | U1 |
| Figurenzahl je Trupp | `FIGMAP` `max`, Figur verschwindet je 10 % Stärke | **von selbst**: 10 Figuren heißt eine je 10 % Stärke | S | U1 |
| Plätze im Feld | `FIG_SLOTS4` bzw. `slots` je Typ | neue Sätze für 10 / 6 / 4, locker verteilt (Probe `SL(n, weit)`) | S | U1 |
| Klone | ganzer Trupp gemeinsam gespiegelt | Spiegeln/Versatz/Drehung je Figur, Ruheposen als Liste | M | U2 |
| Grabenplätze | `gbPlatz` mit 4 Punkten, feste Reihenfolge `[1,2,0,3]` | 10 Punkte entlang der Linie, Tiefensortierung je Figur (FIGQ) prüfen | M | U2 |
| Absenken im Graben, Eingraben | `pl.sink × FIG_SH × s`, nicht mit `sc` | mit dem Figurenfaktor rechnen, sonst versinken kleine Figuren | S | U1 |
| Mündungen `MUZ`, `MUZ2` | Anteil am Bild | **von selbst** | – | – |
| Trefferpunkt `bodyPos`, Kopfzeichen, Schadenszahlen | aus den Figurenkästen `d.fbx` bzw. `headPos` | **von selbst** | – | – |
| Klickfläche (`UBOX`, pick) | Figurenkästen | **von selbst**, aber kleinere Ziele; prüfen, ob Antippen auf dem Board reicht (sonst Klick auf das ganze Feld) | S | U3 |
| Effektgrößen `FX_SZ` (Einschlag, Rauch, Feuer) | in Feldradien | bleiben feldgroß. **Mündungsfeuer und Treffer-Spritzer an Figuren** bekommen einen Figurenfaktor | M | U3 |
| Mündungsfeuer je Figur (Salve, `figN`) | je Figur, bis 4 | bei 10 Figuren nicht jede blitzen lassen (Auswahl), Takt anpassen | S | U3 |
| Posen-Versatz `POSE_VERSATZ` | 60 ms je Figur | bei 10 Figuren 600 ms – auf etwa 25 ms senken oder zufällig streuen | S | U1 |
| Leuchtspuren | ab Mündung, Länge nach Flugstrecke | **von selbst** | – | – |
| Blut, Bodenspuren `gmark` | in Feldradien | Blutflecken kleiner, dafür mehr | S | U6 |
| Schatten unter Figuren | je Figur mit Größe | **von selbst** | – | – |
| Kampfszene/Kamerafahrt (F48), Zoom | Ziel- und Zoomwerte | Nahzoom etwa ×1,2 | S | U3 |
| Fesselballon, Helden-Auftritt (Glut, Ringe) | eigene Größen | Helden-Effekte mit dem Faktor, Ballon prüfen | S | U3 |
| Ringe, Balken, Marken, Deckungsschilde | feste Größen | **bleiben bewusst gleich** | – | – |
| Leistung | gemessen: E1 wie heute (Median 5,6–6,2 ms je Bild) | kein Grafikumbau nötig | – | – |

## 3. Etappe 4: Schaden, Moral, Schlachtende

### 3a Schaden über Modelle (U5)
- Ein Trupp hat Modelle (10 / 6 / 4 / Fahrzeug 1). Die Stärke `str` bleibt die Rechengröße; jedes verlorene Modell (10 % Stärke) **fällt sichtbar und bleibt liegen** (verblasst nach einigen Runden).
- **Feuerkraft in weichen Stufen statt linear** (Abschnitt 8), gegen die Abwärtsspirale.
- **Schwere Waffen** töten mehrere Modelle auf einmal (Splitter): Artillerie, Minenwerfer, Löwenmaul-Kanone, Flammenwerfer.
- **Deckung** entscheidet stärker als heute: Im Offenen sind Treffer tödlich, im Graben weniger. Eine Gewehrsalve auf einen ungedeckten Trupp muss sichtbar wirken.
- **Teil davon:** Punkt 43 (Löwenmaul-Kanone und Furcht-Aura passend zur Inszenierung; die erste Prüfung schlägt für die Kanone 12–18 Schaden gegen schwere Panzerung vor – messen, nicht raten).
- **Nicht** in U5: die neue Scharfschützen-Regel (Paket S nach U8).

### 3b Mehr Blut, abschaltbar (U6)
Treffer- und Fall-Spritzer, Blutflecken unter gefallenen Modellen, im Winter dunkler. Alles über den vorhandenen Blut-Schalter.

### 3c Moral schrittweise (U7)
- **Vorbild Radious:**
  - Moral sinkt in Stufen: wankt → niedergehalten → weicht zurück → flieht.
  - Sammeln ist mehrmals möglich, eine Armee bricht erst spät.
  - Kein Massen-Weglaufen.
- **Punkt 45b:** Die Furcht-Aura des Kürassiers und das Löwengebrüll laufen über den **Entsetzenstest** (eigener Grundwert, gleiche Einflüsse, gleiche Anzeige).
- Festlegen: **höchstens ein Entsetzenstest je Einheit und gegnerischer Runde.** Heute testet jeder Schadenstreffer eines Fahrzeugs oder Schreiters, auch Fernkampf, Seiten-MG und Sturmrollen.

### 3d Schlachtende (U8)
- **Sieg** durch eines von dreien:
  1. **Zusammenbruch** (Abschnitt 11, Frage 2);
  2. **alle Zielfelder 2 eigene Runden am Stück** (Abschnitt 9);
  3. **Rundengrenze** 12/18/24 (je Karte anpassbar) → Siegpunkte entscheiden.
- Die Siegpunkt-Schwelle `G.goal` (heute: vorzeitiger Sieg mitten in der Schlacht) entfällt. Der Siegbildschirm sagt, **wodurch** gewonnen wurde.

## 4. Modelle und Figurenbögen (U4)
- **Ordner je Fraktion (Punkt 53):** `ui-quelle/figuren/` aufteilen in `konkordat/`, `aschenwacht/`, `blaue_legion/`, `fahle/`. Die Fahlen sind nur Stil-Entwürfe – nicht schneiden, nicht einbauen.
  - Die Dateinamen bleiben gleich.
  - Werkzeuge und Listen mit Pfaden anpassen: `figure_cut.py`, `figur_plastik.py`, `panel_assets.py`, Porträts, `entwurf/probe/figuren.html`, MODELL_LISTE, PORTRAETS.
  - **Prüfung:** `figure_cut.py --game` erzeugt vorher und nachher dieselben `figs.js`-Einträge (Vergleich der Schlüssel und Prüfsummen); danach muss der Partietest ok sein.
  - **Zuerst** umziehen, dann neue Bögen schneiden.
- **Löwenoger (Punkt 26):** neuer Bogen `konkordat_loewenoger_neu3.png` (Hintergrund dunkleres Pink ≈ 199/20/172 – beim Schneiden beachten). SPALTEN 3, POSE_SETS, Farbe angleichen, `figur_plastik.py`. Größe SH 1,25 vor E1. **3 oder 4 Modelle je Trupp: Enrico entscheidet am Probebild in U4.**
- **Abgenommene Bögen aus `MODELL_LISTE.md`:**
  - Sanitäter Konkordat (Grund + Posen);
  - Flammen beider Seiten (Grund + Posen);
  - Panzerknechte;
  - Konkordat-Reiter.

  Noch offen (erst einbauen, wenn abgenommen): Gasschutz-Grundbogen, Reiter-Gasmaske, Ordensschreiter.
- **Plastischere Bögen (Weg A):** nach und nach, ohne gemalten Bodenschatten; jeweils dann, wenn ein Bogen fertig ist.

## 5. Reihenfolge in Paketen (Mittelweg, Punkt 52.6)

**U0 → U1 → [G Gelände] → U2 → U5 → U3 → U4 → U6 → U7 → U8 → [S Scharfschützen] → U9**

| Paket | Inhalt | hängt ab von | Messung | Aufwand |
|---|---|---|---|---|
| **U0** | Git-Tag `vor-umbau`; Probe-Werkzeug `massstab_bilder.mjs` bleibt als Vergleich | Freigabe | – | S |
| **U1 Maßstab** | Figurenfaktor E1 (Trupps, Modelle mit Tiefe, Fahrzeuge/Schreiter ×0,85), Plätze 10/6/4, Absenken, Posen-Versatz, `MASSSTAB_ALT` | U0 | Bilder, Leistung, Partietest | M |
| **G Gelände** (eigenes Paket, schreibt der Berater) | Gräben Grauwall neu, Felder Krähenfurt neu – nach Klärung mit Enrico | U1 (neue Figurengröße zum Beurteilen) | Bilder, `test_draht`, Partietest | M–L |
| **U2 Klone und Graben** | Spiegeln/Versatz je Figur, Ruheposen als Liste, **10 Grabenplätze auf den neuen Gräben** + Tiefensortierung | U1, **G** | Bilder Grauwall/Sankt Ruß (Graben, Ruine), Partietest | M |
| **U5 Schaden über Modelle** | Modelle fallen und bleiben liegen, Feuerkraft in weichen Stufen (Abschnitt 8), Splitter, Deckung stärker, Punkt 43, Pannen kürzer (Abschnitt 8), `MODELLSCHADEN_ALT` | U1, U2 | **Zwischenmessung** (Abschnitt 10) | L (eventuell zwei Pakete) |
| **U3 Figurennahe Effekte** | Mündungsfeuer-Auswahl und Takt, Treffer-Spritzer **abgestimmt auf fallende Modelle**, Helden-Effekte, Nahzoom, Klickflächen | U5 | Bilder, Partietest | S–M |
| **U4 Bögen** | Ordner je Fraktion (zuerst), Löwenoger (Probebild 3/4 Modelle), abgenommene Bögen | U1 (Größen) | Bilder; `figs.js`-Vergleich; Löwenoger mit sim | M |
| **U6 Mehr Blut** | Spritzer, Fallblut, Flecken, Winter dunkler, Schalter | U5 | Bilder Schlamm/Schnee | S |
| **U7 Moral** | Stufen, mehrfaches Sammeln, spätes Brechen, Punkt 45b, höchstens ein Entsetzenstest je Runde, KI | U5 | **Zwischenmessung** | L |
| **U8 Schlachtende** | Rundengrenze 12/18/24 je Karte, Halten 2 Runden, Zusammenbruch neu; Startmenü; Siegbild mit Grund; Risiko-Anzeige (Abschnitt 9) | U7 | **Zwischenmessung** | M |
| **S Scharfschützen** | `SCHARF_NEU` allein gegen die alte Regel messen, dann entscheiden (Punkt 44) | U8 | sim alle drei Karten | S–M |
| **U9 Karten und Preise abgleichen** | Grauwall, Sankt Ruß, Krähenfurt: Armeen/KI-Gewichte; Preise nach Abschnitt 10b; Nachschub nach Abschnitt 8 | U5–S | sim je Karte 4 Startwerte (Rückfrage, falls über 10 min) | M |

**Abhängigkeiten in Kurzform:**
- U1 ist die Grundlage.
- G kommt vor U2, weil die Grabenplätze an der Grabenform hängen.
- U5 steht auf fertigen Figuren und Gräben, deshalb nichts doppelt.
- U3 kommt nach U5, weil Spritzer und Mündungsfeuer zu den fallenden Modellen passen müssen.
- U4 ist unabhängig von den Regeln.
- U6 braucht fallende Modelle.
- U7 → U8 → S → U9.

**Tests in jedem Paket:** `test_kommentare.js`, `test_regeln.js` (bei Regeländerungen; neue P-Schlüssel mit `--neu`), `test_partie.mjs` (**nicht nebenher spielen** – die Grafikkarte macht sonst schwarze Bilder), `tonpult_test.mjs`, sobald Tonstellen betroffen sind.

## 6. Antworten zu den Fragen aus Fassung 1 (Punkt 52)
1. Löwenoger 3 oder 4 Modelle: Enrico entscheidet am Probebild in U4.
2. Gefallene Modelle **bleiben liegen**, verblassen nach einigen Runden, abschaltbar mit dem Blut-Schalter.
3. Schlachtlänge **12/18/24 Runden**, Auswahl im Startmenü; Zeiten im Spieltest nachmessen.
4. Halten aller Zielfelder: **2 eigene Runden am Stück**.
5. Rückweg-Schalter **bleiben bis nach Enricos Spieltest**.
6. Reihenfolge **Mittelweg** (Abschnitt 5).

## 7. Klare Begriffe (Punkt 54.3)

Verbindliche Begriffe, wie sie künftig in Regeln, Texten und Anzeige heißen.

| Begriff | Bedeutung | Grenze |
|---|---|---|
| **Bewegungspunkte (BP)** | Ziehen nach Geländekosten; Basis ist der Bewegungswert, Reiter/Fahrzeuge/Schreiter +1 | verfallen bei Draht, Feindberührung, Schlamm, Mine |
| **Hauptaktion** | genau eine je Runde: Schießen, Nahkampf, Befehl, Fähigkeit mit Aktion, Marsch, Draht schneiden | 1 je Runde (Generalangriff +1) |
| **Hauptangriff** | eine Hauptaktion, die Schaden macht (Schuss, Nahkampf, Angriffs-Fähigkeit) | **höchstens 1 je Runde** |
| **Mehrfach-Angriff** | ein Hauptangriff mit mehreren Schüssen: Breitseite (2 Ziele ×0,6), Faustsalve (2 Ziele), Dauerfeuer (zweite Salve, danach eine Runde Kühlen) | zählt als **ein** Hauptangriff |
| **Zusatzwaffe** | Seiten-MG, Turm-MG, Unterarm-Kanone, Bord-MG, Flammenstoß | **1 je Runde**, ×0,5, kostet nichts, nicht gegen Kolosse |
| **Reaktion** | im gegnerischen Zug: Feuerbereitschaft (1 Schuss ×0,8), MG-Sperrfeuer (bis 2 Schüsse), Gegenstoß des Eingreiftrupps (1 je gegnerische Runde), Freischlag beim Lösen | je Art eigene Grenze (so bleibt es); Freischlag ist **keine** Aktion der Einheit, sondern eine Folge der Bewegung des Gegners |
| **Kostenlose Fähigkeit** | kostet keine Aktion: Löwengebrüll (1 je Schlacht), Aufsteigen des Ballons (alle BP), MG auf-/abbauen (BP) | eigene Grenze je Fähigkeit |
| **Befehl** | Hauptaktion eines Anführers: Sammeln, Feuer frei, Sturmbefehl | höchstens 3 je Anführer und Schlacht, Abklingzeit |
| **Großer Befehl** | General, 1 je Schlacht: Halten um jeden Preis / Generalangriff | Generalangriff: +1 Aktion und +2 BP. **Er setzt bereits verbrauchte Zusatzwaffen nicht zurück** (festlegen) |

- **Sturmrollen** ist eine Fähigkeit mit Aktion, also ein Hauptangriff.
- **Panzergranate, Handgranaten, Kopf runter!** sind Hauptangriffe.
- **Anzeige:** Die heutige Vorschau zeigt Schaden und Moral schon vorab. Daraus wird eine **Kampfprognose vor dem Angriff**: erwartete Modellverluste beider Seiten, Chance auf Niederhalten/Entsetzen, Gegenschlag ja/nein und welche Reaktionen drohen (Feuerbereitschaft/Sperrfeuer im Ziel- oder Wegfeld). Dazu ein Symbol für „das ist eine Zusatzwaffe / Reaktion“. Bau in U8 (zusammen mit der Risiko-Anzeige).

## 8. Schaden, Pannen, Nachschub (Punkte 54.1 und 54.5)
- **Feuerkraft in weichen Stufen** (gegen die Abwärtsspirale nach Lanchester):
  - Ausgangsvorschlag aus der ersten Prüfung: 100–70 Stärke volle Kraft, 69–40 → 75 %, unter 40 → 50 %.
  - **Ohne harte Knicke** (zweite Prüfung): als weiche Kurve, z. B. Feuerkraft = 0,5 + 0,5 × Anteil lebender Modelle, oben gedeckelt. Oder an **Waffenträger** gekoppelt: Fällt das MG-Modell, sinkt die Kraft spürbar; fallen Schützen, nur wenig.
  - In U5 zwei Fassungen messen, die nachvollziehbarere nehmen. Im Info-Fenster steht die Kurve.
- **Pannen und Festfahren kürzer:** heute `P.PANNE_RUNDEN` 3 eigene Runden aus. Neu: **1 Runde**, schwere Panne (seltener Wurf) **2 Runden** – bei 12–24 Runden Schlachtlänge sind 3 Runden zu hart. Der Wurf bleibt beim Ziehen (Panne) bzw. beim Betreten von Schlamm/Sumpf (Festfahren). Er stapelt sich mit Niederhalten (unabhängige Zustände).
- **Nachschub-Schneeball messen:** heute 10 je Runde, **20 je Abschuss**, **10 je Zielfeld**; Nachschub darf an eigenen Zielfeldern erscheinen.
  - In der Zwischenmessung nach U5 die Punkte je Seite über die Runden mitschreiben.
  - Wenn der Führende davonzieht: Abschuss auf 10–15 senken, Nachschub nicht auf umkämpften Zielfeldern (Gegner daneben).
  - Entscheidung in U9.

## 9. Halten der Zielfelder und Risiko-Anzeige (Punkte 54.6 und 54.7)
- **Halten über 2 eigene Runden:**
  - Der Zähler läuft, solange eine Seite **alle** Zielfelder hält.
  - Steht ein Gegner auf oder neben einem Zielfeld (umkämpft), **hält der Zähler an** (zählt nicht weiter, setzt aber nicht zurück).
  - Wechselt ein Feld den Besitzer, **setzt er zurück**.
  - Haupt- und Nebenziele: vorerst nicht, erst messen. Falls „Überraschungssiege“ durch ein kurz leeres Feld auftreten, nur Hauptziele zählen (Kirchenfahne, Brücke).
- **Risiko-Anzeige vor dem Zug:** Die Zugvorschau (`feldWirkung`/`pathHazard`) warnt zusätzlich vor
  - **Freischlag** (beim Lösen aus der Feindberührung, mit erwartetem Schaden);
  - **Entsetzenstest** (Chance in %, wenn ein Fahrzeug/Schreiter angreifen kann);
  - **Panne/Festfahren** (Chance in % auf dem Weg).

  Bau in U8.

## 10. Messen und Preise (Punkte 54.2 und 54.4)

### 10a Zwischenmessungen nach U5, U7 und U8
- **Grob:** 100 Schlachten, 2 Startwerte, alle drei Karten, je fest und gemischt.
- **Werte:**
  - Ø Runden;
  - Siegquote je Seite;
  - Schaden je Typ;
  - Überleben je Punkt;
  - Anteil Einheiten, die sinnvoll handeln (nicht nur warten);
  - Häufigkeit Flucht, Panne und Kontrollverlust;
  - **Anteil Siege je Art** (Zusammenbruch/Ziele/Rundengrenze);
  - Nachschubpunkte je Seite über die Runden.
- **Gespiegelte Läufe** (gleicher Startwert, getauschte Seiten), wo die Karte es erlaubt.
- **Statistik:** 200 Schlachten ≈ ±7 Punkte Unsicherheit, 100 ≈ ±10. **Nicht an Unterschieden unter etwa 7 Punkten feilen.** Grob messen nur für die Richtung, genau erst in U9.
- `sim.js` bekommt dafür die fehlenden Zähler (Siegart, Nachschub-Verlauf, „handelt sinnvoll“).

### 10b Preise in U9
- **Zu prüfende Paare und Einzelfälle:**
  - Spiegel-Einheiten: Kohorte 40 / Grenadiere 30, Mahlwerk 35 / Sensenwerk 40, Lanzenreiter 30 / Sprenglanzen 25, Flammentrupp 45 / Brandwerfer 50;
  - Signaltrupp 15, Fernsprechtrupp 20;
  - Generalangriff (+1 Aktion);
  - aus der ersten Prüfung zusätzlich Löwenoger, Eiserne Hünen, Eisenknecht, Meldegänger, Sturmbrecher, Eingreiftrupp, Kürassier, Kreuzschreiter.
- **Vorgehen:**
  - Mit `costcheck` bzw. `MISCHEN=1`-Tausch messen; Unterschiede nur dort ändern, **wo die Messung sie trägt**.
  - Jeder Preis bleibt im Info-Fenster nachvollziehbar (Kostenrechnung).
  - Für Einheiten ab etwa 150 Punkten taugt `costcheck` kaum (Sättigung) – dort mit Szenarien messen.
- **Rollen-Überschneidungen** (Schildwall/Grabenwacht, Stahlgänger/Panzerknechte, mittlere Schreiter, vier Panzerabwehr-Konzepte): nicht im Umbau, als Liste für danach in IDEEN.md.

## 11. Antworten aus dem Code (Punkt 54.8, Stand heute)
1. **„Befehle eine Runde früher“ (Signal-/Fernsprechtrupp):**
   - Befehle haben **beides**: eine Abklingzeit **und** höchstens 3 je Anführer und Schlacht (`P.ORDER_MAX`).
   - Abklingzeit Sammeln 3 Runden, Feuer frei/Sturmbefehl 2 (`P.RALLY_CD`/`P.STORM_CD`).
   - Steht ein Relais-Trupp (`relay`: Signal, Fernsprech, Ballon) bis 3 Felder neben dem Anführer, ist die Abklingzeit 1 kürzer, ebenso beim General; mindestens 1 (`orderCd`).
   - Das Relais macht die 3 Befehle also **schneller verfügbar**, aber nicht **zahlreicher**.
2. **Zusammenbruch:**
   - `losses()` zählt **alle Einheiten der Seite, die gerade im Spiel sind oder waren, einschließlich gekaufter Verstärkungen**: Jede zählt 10, Verlust = fehlende Stärke, vernichtete/geflohene voll.
   - Gekaufter Nachschub erhöht also den Nenner und schiebt den Zusammenbruch hinaus.
   - Die Schwellen 0,55 (Konkordat) und 0,64 (Aschenwacht) sind **Abgleichwerte**: Die Aschenwacht greift an und verliert mehr, deshalb bricht sie später (Kommentar: „seit Aktionspunkten und Marsch“).
   - **Vorschlag U8:** Zusammenbruch über die **Startarmee plus Verstärkungen** wie heute, aber als **gleiche Schwelle** für beide Seiten. Die Asymmetrie gleichen wir über Armeen und KI in U9 aus, damit die Regel lesbar bleibt.
3. **MG aufbauen und im selben Zug schießen:** **Ja.** Aufbauen kostet 1 BP und nimmt alle restlichen BP, aber **nicht die Aktion** (`setupMG`), also geht danach noch ein Schuss (im Schussfeld ±90°). Abbauen kostet 1 BP. Diese Regel soll so im Regeltext stehen.
4. **Ziehen vor und nach der Aktion:**
   - **Ja**, restliche BP dürfen nach einem Schuss noch gezogen werden (schießen und ausweichen).
   - Ausnahmen:
     - Nahkampf beendet die Bewegung;
     - Minenwerfer ziehen nach dem Feuern nicht (`noMoveFire`);
     - aufgebautes MG zieht nicht;
     - Marsch und Rückzug nehmen die Aktion;
     - Aktionen/Fähigkeiten mit „alle BP“ (Feuerschlag, Sperrfeuer, MG-Sperrfeuer, Aufsteigen) beenden die Bewegung;
     - die Feldkanone schießt nach dem Abprotzen noch.
5. **Entsetzenstest:** heute bei **jedem** Schadenstreffer eines Fahrzeugs oder Schreiters, auch Fernkampf, Zusatzwaffe und Sturmrollen, also auch mehrmals je Runde. Vorschlag in U7: höchstens einmal je Einheit und gegnerischer Runde.

## 12. Fragen aus Fassung 2 – beantwortet (Enrico 2026-11-25 06:15, Punkt 55)
**Umbau freigegeben für U0 und U1.** Nach U1 anhalten; das Gelände-Paket G schreibt der Berater.
1. **Feuerkraft:** in U5 beide Fassungen messen (weiche Kurve / Waffenträger), Enrico entscheidet am Ergebnis.
2. **Zusammenbruch: gleiche Schwelle für beide Seiten**, ausgleichen über die Armeen – U8/U9.
3. **Umkämpftes Zielfeld: Zähler anhalten**, Besitzerwechsel setzt zurück – U8.
4. **Pannen/Festfahren: 1 Runde, schwere Panne 2** – U8 (oder früher, wo es passt, z. B. U5).
5. **Kein Nachschub auf umkämpften Zielfeldern** – U8/U9.
6. **Entsetzenstest höchstens einmal je Einheit und Runde** – U7.

## 13. Stand der Pakete
- **U0 erledigt (2026-11-25):** Git-Tag `vor-umbau` auf dem Stand vor dem ersten Umbau-Commit (gepusht). Rückweg: `git checkout vor-umbau` (nur ansehen) bzw. einzelne Dateien von dort holen. Das Probe-Werkzeug `tools/massstab_bilder.mjs` bleibt als Vergleich (Varianten A–E, E1f90/E1f85).
- **U1 erledigt (2026-11-25):** Maßstab E1 im Spiel (`src/ui.js` vor `newFigs`: `MASS`, `massNF`, `massSlots`, `grabenPunkt`).
  - Faktoren: Soldaten/Reiter/Helden/MG/Geschütze ×0,65, Fahrzeuge/Schreiter ×0,85.
  - Figurenzahl: Linieninfanterie 10, Reiter 6, zwei lockere Reihen.
  - Absenken im Graben und beim Eingraben mit dem Faktor; Posen-Versatz 25 ms.
  - Grabenplätze vorläufig: über 4 Figuren gleichmäßig entlang der Grabenpunkte, abwechselnd quer versetzt; die eigentlichen 10 Grabenplätze kommen in U2.
  - Rückweg: `window.MASSSTAB_ALT = true` bzw. `__dbg.massstab(0)`.
  - Ballon unverändert.
