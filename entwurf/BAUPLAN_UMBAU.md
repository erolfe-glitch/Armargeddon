# Bauplan großer Umbau (Etappe 3 und 4) – Stand 2026-11-24

**Nur Plan, nichts gebaut.** Enrico und der Berater prüfen, dann wird paketweise gebaut. Je Paket ein `pa`, Sparregeln gelten: keine Hilfs-Agenten, keine Läufe über 10 Minuten ohne Rückfrage, Zwischenstände committen.

**Rückweg:** Vor dem ersten Umbau-Paket Git-Tag `vor-umbau` setzen. Jedes Paket hat außerdem einen Schalter für die alte Fassung, solange das möglich ist (wie `SCHARF_NEU`, `ENTSETZ_ALT`). Die Schalter fliegen erst raus, wenn Enrico abgenommen hat.

## 1. Entscheidungen, die feststehen (Punkte 48–51)

- **Maßstab E1:**
  - Linieninfanterie (Schützenkohorte, Grenadiere) **10 Figuren** je Feld, Reiter **6**, Spezialtrupps **4** (wie heute).
  - Soldat **0,52 Feldradien** (heute 0,8, also ×0,65), lockerer verteilt.
  - **MG, Geschütze, Reiter und Helden** schrumpfen im selben Verhältnis (×0,65).
  - **Kettenfahrzeuge** (Landkoloss, Sturmpanzer, Bohrkoloss) und **alle Schreiter** (auch Kreuzschreiter und Eisenknecht) schrumpfen **×0,85** (Punkt 51).
  - Probebilder: `entwurf/probe/massstab/` (E1, E1f85).
- **Klone:** zuerst **im Code** beheben. Jede Figur wird einzeln gespiegelt, leicht versetzt und leicht gedreht; heute spiegelt `drawNewFigs` den ganzen Trupp gemeinsam. Der Code nimmt **mehrere Ruheposen je Trupp** auf (Liste statt einem Bild `bereit`), damit die Bögen, die der Berater nach und nach malt, einfach dazukommen.
- **Graben:** 10 Plätze entlang der Grabenlinie (`gbPlatz` liefert heute 4).
- **Ringe, Balken, Zustandsmarken und Knöpfe** bleiben bewusst gleich groß (lesbar, antippbar ≥ 40 px).
- **Stimmen klonen** (fehlende Sprachbefehle, `entwurf/postfach/STIMMEN_FEHLEN.md`): spätere Stufe, nicht Teil dieses Umbaus.

## 2. Was skaliert von selbst, was muss nachgezogen werden (Punkt 48)

Aufwand: **S** bis 1 Stunde · **M** halber Tag (etwa ein kleines Paket) · **L** ein ganzes Paket.

| Bereich | Heute | Folge bei E1 | Aufwand |
|---|---|---|---|
| Figurengröße Trupps | `FIG_SH` × `nf.sc` | **ein Faktor** (in der Probe schon so gemacht) | S |
| Figurengröße Modelle mit Tiefe (MG, Geschütze, Fahrzeuge, Schreiter) | eigene Formel ohne `nf.sc` | eigenen Faktor einführen (in der Probe: `tiefSc`) | S |
| Figurenzahl je Trupp | `FIGMAP` `max`, Figur verschwindet je 10 % Stärke | **von selbst**: 10 Figuren heißt eine je 10 % Stärke | S |
| Plätze im Feld | `FIG_SLOTS4` bzw. `slots` je Typ | neue Sätze für 10 / 6 / 4, locker verteilt (Probe `SL(n, weit)`) | S |
| Klone | ganzer Trupp gemeinsam gespiegelt | Spiegeln/Versatz/Drehung je Figur, Ruheposen als Liste | M |
| Grabenplätze | `gbPlatz` mit 4 Punkten, feste Reihenfolge `[1,2,0,3]` | 10 Punkte entlang der Linie, Tiefensortierung je Figur (FIGQ) prüfen | M |
| Absenken im Graben, Eingraben | `pl.sink × FIG_SH × s`, nicht mit `sc` | mit dem Figurenfaktor rechnen, sonst versinken kleine Figuren | S |
| Mündungen `MUZ`, `MUZ2` | Anteil am Bild | **von selbst** | – |
| Trefferpunkt `bodyPos`, Kopfzeichen, Schadenszahlen | aus den Figurenkästen `d.fbx` bzw. `headPos` | **von selbst** | – |
| Klickfläche (`UBOX`, pick) | Figurenkästen | **von selbst**, aber kleinere Ziele; prüfen, ob Antippen auf dem Board reicht (sonst Klick auf das ganze Feld) | S |
| Effektgrößen `FX_SZ` (Einschlag, Rauch, Feuer) | in Feldradien | bleiben feldgroß. Einschläge passen, **Mündungsfeuer und Treffer-Spritzer an Figuren wirken zu groß**: Faktor für figurennahe Effekte (`fxMuzzle`, `trefferSpritzer`, Blut) | M |
| Mündungsfeuer je Figur (Salve, `figN` bei Scharfschützen) | je Figur, bis 4 | bei 10 Figuren nicht jede Figur blitzen lassen (Auswahl, sonst Lichtteppich); Takt anpassen | S |
| Posen-Versatz `POSE_VERSATZ` | 60 ms je Figur | bei 10 Figuren 600 ms – auf etwa 25 ms senken oder zufällig streuen | S |
| Leuchtspuren | ab Mündung, Länge nach Flugstrecke | **von selbst** | – |
| Blut, Bodenspuren `gmark` | in Feldradien | Blutflecken kleiner, dafür mehr (siehe Mehr Blut) | S |
| Schatten unter Figuren | je Figur mit Größe | **von selbst** | – |
| Kampfszene/Kamerafahrt (F48), Zoom | Ziel- und Zoomwerte | Nahzoom etwa ×1,2, damit Figuren nah wirken | S |
| Fesselballon, Helden-Auftritt (Glut, Ringe) | eigene Größen | Helden-Effekte mit dem Faktor, Ballon prüfen | S |
| Ringe, Balken, Marken, Deckungsschilde | feste Größen | **bleiben bewusst gleich** | – |
| Porträts, Info-Fenster, Kaufmenü | eigene Bilder | nicht betroffen | – |
| Leistung | gemessen: E1 wie heute (Median 5,6–6,2 ms je Bild) | kein Grafikumbau nötig | – |

## 3. Etappe 4: Schaden, Moral, Schlachtende

### 3a Schaden über Modelle
- **Grundgedanke:** Ein Trupp hat Modelle (10 / 6 / 4 / Fahrzeug 1). Die Stärke `str` bleibt die Rechengröße, wird aber in **Modelle** übersetzt: Jedes verlorene Modell fällt sichtbar.
- **Feuerkraft** hängt an den lebenden Modellen. Das tut sie heute schon über `0,4 + 0,6 × str` (abgeschwächt); künftig kommt sie stärker von der Modellzahl.
- **Schwere Waffen** töten mehrere Modelle auf einmal (Splitter): Artillerie, Minenwerfer, Löwenmaul-Kanone, Flammenwerfer.
- **Deckung** entscheidet stärker als heute: Im Offenen sind Treffer tödlich, im Graben weniger. Eine Gewehrsalve auf einen ungedeckten Trupp muss sichtbar wirken.
- **Anzeige:** Getroffene Modelle fallen (Getroffen-Pose → liegend oder ausblenden) und bleiben einige Runden als Leichen liegen (`gmark`).
- **Teil davon:** Punkt 43 (Löwenmaul-Kanone und Furcht-Aura stärker, passend zur Inszenierung). Punkt 44: Die Scharfschützen-Regel `SCHARF_NEU` neu abgleichen; sie verschob die Karten um −28 bis +20 Punkte, mit Modellschaden kann ein gezielter Schuss genau ein Modell nehmen.

### 3b Mehr Blut (abschaltbar)
Treffer- und Fall-Spritzer, Blutflecken unter gefallenen Modellen, im Winter dunkler. Alles über den vorhandenen Blut-Schalter (`BLUT_FILTER`/aus).

### 3c Moral schrittweise
- **Vorbild Radious:**
  - Moral sinkt in Stufen: wankt → niedergehalten → weicht zurück → flieht.
  - Sammeln ist mehrmals möglich, eine Armee bricht erst spät.
  - Kein Massen-Weglaufen.
- **Punkt 45b:** Die Furcht-Aura des Kürassiers und das Löwengebrüll laufen dann über denselben **Entsetzenstest** wie die Fahrzeuge, mit eigenem Grundwert, statt eines pauschalen Moralabzugs.

### 3d Schlachtende
- **Sieg** durch eines von dreien:
  - Zusammenbruch der Armee (Moral);
  - Halten aller Zielfelder über eine Zeit;
  - Punkte nach der **Rundengrenze**.
- Die Rundengrenze richtet sich nach der Schlachtgröße: kurz/mittel/lang ≈ 30/45/60 Minuten, also etwa 12/18/24 Runden (mit Spieltest-Zeiten nachmessen).
- Kein „schon gewonnen?!“ mitten in der Schlacht: Die Siegpunkt-Schwelle `G.goal` entfällt bzw. wird durch Halten-über-Zeit ersetzt.

## 4. Modelle (Etappe 3)
- **Löwenoger (Punkt 26):** neuer Bogen `ui-quelle/figuren/konkordat_loewenoger_neu3.png` (abgenommen, Hintergrund dunkleres Pink ≈ 199/20/172 – beim Schneiden beachten). Schnitt wie bisher (SPALTEN 3, POSE_SETS), danach Farbe angleichen und `figur_plastik.py`. Größe heute SH 1,5, Vorschlag 1,25, dazu ×0,65 nach E1. **3 oder 4 Modelle je Trupp** – im Probebild zeigen, Enrico entscheidet.
- **Abgenommene Bögen aus `MODELL_LISTE.md`:**
  - Sanitäter Konkordat (Grund + Posen);
  - Flammen beider Seiten (Grund + Posen);
  - Panzerknechte;
  - Konkordat-Reiter.

  Einbau: `figure_cut.py --game` und `figur_plastik.py`, Porträts prüfen. Noch offen: Gasschutz-Grundbogen, Reiter-Gasmaske, Ordensschreiter (erst einbauen, wenn abgenommen).
- **Plastischere Bögen (Weg A):** nach und nach, ohne gemalten Bodenschatten. Kein eigenes Paket; jeweils dann, wenn ein Bogen fertig ist.

## 5. Reihenfolge in Paketen

| Paket | Inhalt | hängt ab von | Messung | Aufwand |
|---|---|---|---|---|
| **U0** | Git-Tag `vor-umbau`. Probe-Werkzeug `massstab_bilder.mjs` bleibt als Vergleich | – | – | S |
| **U1 Maßstab** | Figurenfaktor E1 (Trupps, Modelle mit Tiefe, Fahrzeuge ×0,85), Plätze 10/6/4, Absenken im Graben, Posen-Versatz, Mündungsfeuer-Auswahl, Schalter `MASSSTAB_ALT` | U0 | nur Bild und Leistung, Partietest | M |
| **U2 Klone und Graben** | Spiegeln/Versatz je Figur, Ruheposen als Liste, 10 Grabenplätze + Tiefensortierung | U1 | Bilder Grauwall/Sankt Ruß (Graben, Ruine), Partietest | M |
| **U3 Figurennahe Effekte** | Faktor für Mündungsfeuer, Treffer-Spritzer, Helden-Effekte; Nahzoom; Klickflächen prüfen | U1 | Bilder, Partietest | S–M |
| **U4 Neue Bögen** | Löwenoger neu (3 oder 4 Modelle – Probebild), abgenommene Bögen aus MODELL_LISTE | U1 (Größen) | Bilder; Löwenoger mit sim (Preis/Anzahl) | M |
| **U5 Schaden über Modelle** | Modelle als Rechengröße, Splitter für schwere Waffen, Deckung stärker, fallende Modelle + Leichen, Punkt 43, Punkt 44 (`SCHARF_NEU`), Schalter `MODELLSCHADEN_ALT` | U1, U2 (Figuren fallen sichtbar) | **sim alle drei Karten** (Grauwall, Sankt Ruß, Krähenfurt), je 100 Schlachten und 2 Startwerte, Verluste je Typ, costcheck für Typen mit großer Änderung | L (eventuell zwei Pakete) |
| **U6 Mehr Blut** | Spritzer, Fallblut, Flecken, Winter dunkler, Schalter | U5 (Modelle fallen) | Bilder Schlamm/Schnee | S |
| **U7 Moral schrittweise** | Stufen, mehrfaches Sammeln, spätes Brechen, Punkt 45b (Furcht/Gebrüll über den Entsetzenstest), KI anpassen | U5 | **sim alle drei Karten**, Dauer und Fluchtzahlen | L |
| **U8 Schlachtende** | Rundengrenze nach Größe, Halten über Zeit, Zusammenbruch; Startmenü-Auswahl kurz/mittel/lang; Siegbild | U7 | sim: Siegquote, Runden Ø, Anteil Siege je Art | M |
| **U9 Karten neu abgleichen** | Grauwall, Sankt Ruß, Krähenfurt: Armeen/KI-Gewichte (`MAP.ki`), Ziel ±5 Punkte um 50 % | U5–U8 | sim je Karte 4 Startwerte (Rückfrage, falls über 10 min) | M |

**Abhängigkeiten in Kurzform:** U1 zuerst, darauf U2 und U3; U4 kann parallel zu U5 laufen. U5 → U6/U7 → U8 → U9. Die Regeländerungen (U5, U7, U8) verschieben die Siegquoten stark; deshalb erst ganz am Ende **einmal** abgleichen (U9), dazwischen nur grob messen (100 Schlachten, ein Startwert).

**Tests in jedem Paket:** `test_kommentare.js`, `test_regeln.js` (bei Regeländerungen; neue P-Schlüssel mit `--neu`), `test_partie.mjs` (nicht nebenher spielen – Grafikkarte!), `tonpult_test.mjs`, sobald Tonstellen betroffen sind.

## 6. Offene Fragen an Enrico
1. **Löwenoger:** 3 oder 4 Modelle je Trupp? (Probebild kommt in U4.)
2. **Modellschaden:** Sollen gefallene Modelle **liegen bleiben** (Leichen, einige Runden) oder nur ausblenden?
3. **Schlachtlänge:** Passen kurz/mittel/lang = etwa 12/18/24 Runden? Oder lieber nach Uhrzeit?
4. **„Halten aller Zielfelder über eine Zeit“:** Wie viele eigene Runden am Stück – 2 oder 3?
5. **Rückweg-Schalter:** Bleiben die alten Fassungen (`MASSSTAB_ALT`, `MODELLSCHADEN_ALT`) bis nach dem Spieltest drin, oder sofort entfernen, sobald ein Paket abgenommen ist?
6. **Reihenfolge:** Erst alles Sichtbare (U1–U4), dann die Regeln (U5–U9) – so wie hier vorgeschlagen? Oder Schaden über Modelle früher, damit sich der Spieltest lohnt?
