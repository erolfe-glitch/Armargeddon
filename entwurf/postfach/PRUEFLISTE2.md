# Prüfliste 2 (Prüfrunde 2026-11-21 abends / 2026-11-22)

Nur geprüft, nichts umgebaut, nichts gebaut. Stand: Commit `0fa7ebc` (F87 ist drin; `src/` und `index.html` vom 21.11. 19:27).
Jeder Fund: Nummer, Ort, Schwere, was genau, Vorschlag. Sortiert nach Schwere.

**Kurzfassung**
- Keine Konsolenfehler: zwei komplette KI-gegen-KI-Partien im Browser (Grauwall 12 Runden, Sankt Ruß 13 Runden), Partietest, eigene Helden-Probe.
- **Ein dritter Fehler „Kommentar verschluckt Code“** gefunden (H1). `test_kommentare.js` sieht ihn nicht.
- **Die Datei ist wieder 59,7 MB groß, der Git-Ordner 3,5 GB** (H2).
- Helden: Regeln rechnen richtig, zwei Helden auf dem Feld sind nicht möglich. Die Funde sind Texte, Anzeige, Ton und KI (M1–M9).
- F83, F84, F85, F86, F87: behoben bzw. gebaut wie beschrieben. Eine verwandte Stelle mit falscher Richtung bleibt (M7).

**Messgrundlage:** unsichtbarer Chrome 1920×1080 auf Enricos Rechner, Vorschau-Server lokal. Die Grauwall-Partie und die erste Sankt-Ruß-Messung liefen am 21.11., **während Enrico spielte**; Sankt Ruß lief am 22.11. noch einmal allein, mit praktisch gleichen Zahlen. Tonpegel: lautestes 0,4-s-Fenster der dekodierten Töne aus `src/sound.js`, dazu die Lautstärke aus `ui.js`.

---

## Hoch

| Nr. | Ort | Was genau | Vorschlag |
|---|---|---|---|
| H1 | `src/ui.js` Zeile 3853 (`startGame`), seit `8a58a6b` vom 20.11. | **Dritter „Kommentar verschluckt Code“:** `siegGemeldet = { A: 0, D: 0 };` steht hinter einem `//` und wird nie ausgeführt. Folge: Spielt man ohne Neuladen eine zweite Schlacht, fehlt die Warnung vor dem Sieg (F41: „Der Sieg rückt näher“, „Niederlage droht“), sobald sie in der ersten Schlacht schon angesagt war. | Zuweisung vor den Kommentar setzen. Test erweitern, siehe K1. |
| H2 | `index.html`, `.git` | **Größe.** `index.html` hat **59,7 MB** – mehr als bei Prüfliste 1 (58,8 MB); nach Paket G waren es 53,5 MB. Zuwachs: `figs.js` jetzt 13,0 MB (Posen Runde 2, Helden), `sound.js` 29,0 MB, Plastik-Karten 2,6 MB. GitHub warnt ab 50 MB und sperrt ab 100 MB. Dazu: **Der Git-Ordner ist lokal 3,5 GB groß** (1,05 GiB gepackt, 2,39 GiB noch ungepackt). `index.html` wurde 222-mal eingecheckt, allein am 21.11. 28-mal. | 1. Auswahl-Töne auslagern (M9, −6,5 MB). 2. Lokal einmal `git gc` laufen lassen und die Größe danach ansehen. 3. Überlegen, `index.html` nicht bei jedem Teilschritt einzuchecken, sondern nur am Ende eines Pakets – oder Töne und Bilder als eigene Dateien laden, damit unveränderte Daten nicht jedes Mal neu ins Archiv gehen. |

## Mittel

| Nr. | Ort | Was genau | Vorschlag |
|---|---|---|---|
| M1 | `src/ai.js` `buy` (Zeile 478–498) | **Die KI-Wunschliste bleibt am Helden hängen.** Ist die Liste einmal durch (14 bzw. 15 Einträge), kommt als dritter Wunsch wieder der Held. Den darf sie nie mehr kaufen, die Schleife bricht ab – und danach kauft die KI **gar nichts mehr**. Nachgewiesen mit 150 Punkten extra je Runde: letzter Kauf in Runde 5 bzw. 6, am Ende 1350–1980 Punkte ungenutzt. In normalen KI-Partien (Ø 15 Runden, 5–8 Käufe) wird die Stelle nicht erreicht (in 200 Schlachten nie); sie trifft lange Schlachten. Mit Kampfmaschinen gilt dasselbe für den Eisenknecht. | In `buy`: Wünsche, die wegen „höchstens einer“ nie mehr gehen (Held, Stufe 3), überspringen (`_wish++; continue`). |
| M2 | `src/ui.js` `armyWarum` (Zeile 3759) | **Armee-Auswahl: Der Held lässt sich zweimal dazunehmen.** Im Browser: mit 240 freien Punkten steht der Zähler auf 2. Danach ist „Übernehmen“ grau, die Meldung sagt nur „Noch 20 Punkte frei.“ – kein Grund. Starten kann man so nicht (die Regel greift), aber man sieht nicht, warum. | In `armyWarum` eine Zeile wie bei Stufe 3: „Held: höchstens einer je Armee.“ |
| M3 | `src/ui.js` `MUZ` (Zeile 410), Zeichenweg Zeile 1570 / 1602 | **Die gemessenen Mündungen der Helden- und General-Posen werden nie benutzt.** `konkordat_held_posen2_1` (Revolver), `konkordat_general_posen_3`, `aschenwacht_general_posen2_1` stehen in `MUZ`. `MUZ` liest nur der Zeichenweg für MG, Geschütze und Fahrzeuge; Helden, Generäle und Hauptleute laufen über den Trupp-Zeichenweg, der nur `MUZ_FIG` liest. Im Browser bestätigt: keine Mündung bei Faust, beiden Generälen und Hauptmann; das Mündungsfeuer sitzt an der Bildkante auf fester Höhe. Panzerbüchse, Hünen, Bannerträger sind richtig. | Die drei Einträge nach `MUZ_FIG` verschieben (oder in Zeile 1602 auch `MUZ` lesen). Hauptmann-Pistole dabei mitmessen. |
| M4 | `src/ui.js` Zeile 2497, 4137, 302 | **Der Kürassier „bleibt stecken“ wie ein Fahrzeug:** Ton `crash` (Auto-Unfall) und Schlammschritte, Schlammspritzer, Kopfzeichen Panne, Meldung „… steckt im Schlamm fest“, Zustandstext „Im Schlamm stecken geblieben“ – auch im Graben. Im Browser gehört und gezählt. | Eigener Zweig für `T.stecken`: Text „hängt im Graben/Schlamm fest“, Rüstungs- oder Metallton statt `crash`. |
| M5 | `src/ui.js` `abilKurz` (Zeile 3171), Einheitentexte in `engine.js` | **„N Runden Pause“ stimmt nicht mit der Regel.** Gemessen: Durchbruch in Runde 1 benutzt, Runde 2 gesperrt, **Runde 3 wieder frei** – also eine Runde Pause, der Text sagt „2 Runden Pause“. Hinrichtung („3 Runden Pause“) ist 2 Runden gesperrt. Gilt für alle Fähigkeiten mit Abklingzeit (Sturmrollen, Sprung, Sanitäter, Gas). Beim Löwenoger steht es richtig: „alle 2 Runden“. | Enrico entscheidet, was gemeint ist. Entweder Texte auf „alle N Runden“, oder die Regel um eine Runde verlängern (dann neu simulieren). |
| M6 | `src/ai.js` (kein Zugriff auf `stecken`), Simulation | **Die KI spielt den Kürassier schwach, und der Fall eines Helden ist ungetestet.** In 60 Sankt-Ruß-Schlachten: 96 Züge, 11-mal stecken geblieben (11 %), 9 Hinrichtungen. Auf dem Grauwall: in 14 von 60 Schlachten gekauft, 7 Züge insgesamt, keine Hinrichtung – er kommt dort praktisch nie an die Front. **In 120 KI-Schlachten fiel kein einziger Held.** Der Moralverlust beim Fall kommt in der Simulation also nie vor (von Hand im Browser ausgelöst: funktioniert, Moral im Mittel 71 → 61, Horn, Schild). | Gefahr-Gewicht für Graben und Schlamm beim Kürassier. Auf dem Grauwall früher kaufen oder am Zielfeld aufstellen. Den Fall einmal gezielt simulieren (Held mit wenig Stärke starten lassen). |
| M7 | `src/ui.js` Zeile 2345, 2407, 2424, 2436 | **Getroffen-Richtung hängt an der eigenen Blickrichtung, nicht am Angreifer.** Nur im Nahkampf dreht sich das Ziel zum Angreifer (Zeile 2262). Bei Beschuss, Durchbruch, Sturmrollen und Hinrichtung nicht. Steht das Ziel mit dem Rücken zum Angreifer, kippt die Getroffen-Pose auf ihn zu. Im Browser: Rote Faust kommt von links, Grenadiere blicken nach rechts – die Pose taumelt nach links zum Helden, der Stoß geht nach rechts. | Bei „getroffen“ Spiegelung und Bewegung aus der Richtung zum Angreifer ableiten (bei Schüssen aus dem letzten Schuss-Ereignis). |
| M8 | `tools/tonpult_bau.mjs` Zeile 138, 93, 169–171 | **Ton-Pult und Spiel stimmen bei den Helden nicht überein.** Spiel, normaler Nahkampf: Faust `held_aufladen` 0,5 → `held_faustboom` 0,65 + `held_dampfstoss` 0,35; Kürassier `held_saege_start` 0,55 + `held_ritter_schrei` 0,45 → `held_saege_schnitt` 0,65. Das Pult zeigt in der Nahkampf-Zeile beider Helden **`sword` 0,55** (Regel für Kampfanzüge) und die Helden-Töne nur unter den Fähigkeiten, mit anderen Lautstärken (0,6 / 0,8 / 0,5 / 0,75). Ziehen: Das Pult zeigt für beide „Schritte“ 0,5; im Spiel spielt der Kürassier keine normalen Schritte, die Faust `schritte` 0,4 und manchmal einen leisen Dampfstoß. Eine Änderung an diesen Pult-Zeilen hätte im Spiel keine Wirkung. | `slotsVon` für `T.held` nachziehen: eigene Nahkampf-Zeilen (Ausholen, Schlag), Ziehen wie im Spiel. |
| M9 | `src/sound.js`, `tools/sound_bau.json` | **6,5 MB Töne, die das Spiel nie abspielt** (46 Plätze, 182 Töne, nur Auswahl im Ton-Pult). Punkt 1.2 der ersten Liste ist offen und gewachsen: neu dabei `neu3_gore`, `neu3_aufprall`, `neu3_loewe2`, `held_faustschlag`, `held_kolben` und `ballon_brenner`. **`ballon_brenner`** wurde als neuer Ton gemeldet, wird im Spiel aber nirgends gespielt. | Wie in Liste 1: Auswahl-Töne in eine zweite Datei nur für Pult und Tonprobe. Brenner-Ton beim Aufsteigen einbauen oder aus der Meldung streichen. |

## Klein

| Nr. | Ort | Was genau | Vorschlag |
|---|---|---|---|
| K1 | `tools/test_kommentare.js` | **Lücken des Tests** (deshalb blieb H1 unentdeckt): 1. Ganze Kommentarzeilen überspringt er – genau der Fall „Kommentar stand vor dem Code“. 2. Er kennt nur bestimmte Aufrufnamen, `break;`, `await` und Zuweisungen mit Punkt (`a.b = …`); nicht einfache Zuweisungen (`x = …`), `return`, `continue`, beliebige Aufrufe. 3. Er prüft nicht, ob ein `case` ohne `break` in den nächsten durchläuft. 4. `tools/` prüft er nicht. Ich habe mit einem breiteren Scanner alle Kommentare und alle `switch`-Fälle in `ui.js`, `ai.js`, `engine.js`, `gelaende_bau.js`, `figures.js` und den Werkzeugen durchgesehen: **nur die eine Stelle (H1), kein stiller Durchlauf.** | Muster um einfache Zuweisungen und allgemeine Aufrufe mit `;` erweitern, ganze Kommentarzeilen mitprüfen (mit Ausnahmeliste), Durchlauf-Prüfung ergänzen. |
| K2 | `engine.js` TYPES `faust`, `ui.js` `ABIL_KURZ`, `ABIL_KEIN` | **Durchbruch-Texte.** „Nur aus dem Stand“ und der Knopf-Grund „oder schon bewegt“: Nur der Anlauf über 2 Felder verlangt den Stand; ein Ziel direkt daneben geht auch nach dem Ziehen (gemessen). Der Knopftext sagt nicht „kostet die Aktion und alle Bewegung“ (beim Sturmrollen steht es). „26 Schaden“ ist der Höchstwert: gemessen 22–29 gegen Grenadiere, General, MG; nur 7–9 gegen Kürassier und Hünen. | Texte anpassen: „Anlauf nur aus dem Stand“, „bis 26 Schaden, gegen Gepanzerte weniger“, Kosten nennen. |
| K3 | `engine.js` Zeile 1096, 1419 | **Auren.** Standhaft wirkt auch auf die Rote Faust selbst (Moralverlust je Schaden 0,4 statt 0,8; Text: „Einheiten neben ihm“). Furcht nimmt Fahrzeuge und Schreiter aus – steht in keinem Text. Furcht senkt die Moral höchstens bis 5 und löst allein keine Flucht aus. | In den Text aufnehmen oder die Faust ausnehmen. |
| K4 | `engine.js` `useAbil` (`durchbruch`, `rollen`) | **Der Anlauf überspringt die Zugregeln.** Eine Mine im Anlauffeld löst nicht aus (gemessen), es gibt kein Sperrfeuer, keine Feuerbereitschaft, keinen Freischlag, keinen Feuer- oder Gasschaden. Auch das zurückgeschleuderte Ziel löst keine Mine aus; ein aufgebautes MG bleibt nach dem Rückstoß aufgebaut. Gilt ebenso fürs Sturmrollen. | Gewollt lassen oder den Anlauf über `moveUnit` führen. Nur entscheiden. |
| K5 | `ui.js` Zeile 3266 | Nachschub-Menü: Als Grund für den gesperrten Helden (und den Stufe-3-Schreiter) steht nur „Gerade nicht möglich.“ | „Held: nur einer je Schlacht, auch nach seinem Fall.“ |
| K6 | `ui.js` Zeile 2463 | Nach Durchbruch und Sturmrollen spielt „niedergehalten“ den Ton **„Kugel vorbei“** (`vorbei`), obwohl kein Schuss fiel (im Browser gezählt). | `vorbei` nur, wenn ein Schuss vorausging. |
| K7 | `ui.js` `FLUG` (Zeile 2429, 3619), `AURA_PULS` (3607) | Der Merker „Ziel fliegt“ bleibt stehen, wenn das Ziel nicht zurückgeschleudert wird (Wand, Zurückweichen). Beim nächsten Sturmrollen gegen dieselbe Einheit fliegt sie dann im Bogen. `FLUG` und `AURA_PULS` werden beim Schlachtstart nicht geleert; der Aura-Puls kann in einer zweiten Schlacht ausbleiben. | Nach dem Ereignis löschen; in `startGame` leeren. |
| K8 | `tools/sound_bau.json` `held_schritt_ritter`, `ui.js` Zeile 2084 | **Kürassier-Schritte sehr leise:** Datei −24 dB, im Spiel etwa −30 dB. Maschinenschritte der Hünen und Schreiter liegen bei −18 dB, normale Schritte bei −23 bis −29 dB. Der „schwere Ritter-Gang“ ist der leiseste Schritt im Spiel. Die übrigen Helden-Töne passen: Faustschlag −16 bis −18 dB, Säge −18 dB, Horn −19 dB (Schreiter-Hieb −13 bis −17 dB, Kampfanzug-Hieb −21 bis −23 dB). | Um etwa 8 dB anheben, etwas Bass dazu. |
| K9 | `ui.js` FIGMAP, `figure_cut.py` | **Größe der Helden.** Bild 1,5 Soldatenhöhen, im Spiel 119–120 px bei 77 px für die Kohorte – stimmt. Aber: gleich hoch wie der Löwenoger (1,50) und nur 6 % höher als Stahlgänger und Panzerknechte (1,40). Die Eisernen Hünen (1,85; 148 px) überragen den „riesigen“ Kürassier um ein Viertel. Punkt 4.3 der ersten Liste (Hünen fast so hoch wie Schreiter) ist offen. | Enrico ansehen. Möglich: Helden 1,65, Hünen 1,7. |
| K10 | `ui.js` `newFigs` (Zeile 1374), `portraitKey` | Mit dem Bilderset Blaue Legion erscheint die Rote Faust als altes Kampfanzug-Truppbild, ohne Posen und ohne Helden-Porträt. | Für Helden auch bei der Legion den neuen Bogen nehmen. |
| K11 | `engine.js` `cost` (Zeile 707) | Helden dürfen ins Kirchenschiff und auf den Turm (Klasse Sturm). Der Kürassier bleibt in Gräben stecken, steigt aber auf den Kirchturm. | Gewollt? Sonst Helden wie Reiter aussperren. |
| K12 | `ui.js` `MUZ_FIG`, `MUZ` | Schuss-Posen ohne gemessene Mündung: Pioniere (`pionier_posen2_1/2`), Gasschutz (`gasschutz_posen_1/3`); dazu weiter Soldat, Kampfanzug, Schildwall, Scharfschütze, Pirschjäger, Flammentrupp (Liste 1 Nr. 4.2) und Ordensschreiter, Geschütz, Feldkanone, Mörser, Minenwerfer (4.1). | Nachmessen, zuerst Pioniere und Soldat. |
| K13 | `src/figs.js` | Weiter 10 Posenbilder ohne Verwendung (210 KB): `*_melder_posen_3`, `*_sanitaeter_posen_1`, `aschenwacht_schwer_posen_2`, `konkordat_schildwall_posen2_1/2`, `konkordat_schildwall_posen_3`, `konkordat_versorgung_posen2_3/4`. Alle anderen Bilder und alle Posen-Arten werden benutzt. | Zuordnen oder nicht mehr einbetten. |
| K14 | `tools/sound_bau.json` | Töne im Einzelnen: `mg3` bricht ab (Ende nur 8 dB unter dem Pegel). `kolosskanone_1` ist weiter nur 0,37 s lang (Liste 1 Nr. 3.5). Im Platz `boomH` liegen zwei Varianten 6 dB auseinander (`boomH` −7,5 dB, `boomH_1` −13,7 dB). `schritte_3` hat eine einzelne Spitze über Vollaussteuerung bei sonst sehr leisem Ton. `held_aufladen` endet hart – gewollt, der Schlag deckt es. Von den rund 95 gemessenen Tönen (Helden, neue Töne, Waffen zum Vergleich) beginnt keiner mit einem Knacks. | `mg3` und `kolosskanone_1` mit Ausklang neu bauen, `boomH` angleichen. |
| K15 | `src/index.html` Zeile 1224 | Regeln-Fenster „Stark und schwach“: Es fehlt, dass normaler Nahkampf (Klinge, Kolben) gegen Kampfanzüge und Panzer nur ×0,5 wirkt und Schrot an Panzern wirkungslos ist. Die Helden fehlen beim „schweren Nahkampf“. | Zwei Halbsätze. |
| K16 | `CLAUDE.md` | Veraltet: `P.BALLON_SICHT_UNTEN 2` (ist 4, das Regeln-Fenster sagt richtig 4); „Hauptmann (Befehl alle 2 Runden, 2 Felder …), General (jede Runde, 3 Felder …)“ (Liste 1 Nr. 5.11). | Berichtigen. |
| K17 | `src/index.html` Zeile 1061; `engine.js` Zeile 1245 | Aus Liste 1 noch offen: Medaillen 35 px statt 40 px (2.18). Ein MG-Trupp dreht sich nach einem Nahkampf zum Angreifer, sein Schussfächer zeigt danach dorthin (4.7) – Frage, ob gewollt. | Entscheiden. |
| K18 | `ui.js` Zeile 2614; `engine.js` Exporte | Reste nach dem Kartenausbau: Beim Ziehen der Karte merkt sich der Code noch `board.scrollLeft/scrollTop` (Brett-Scrollen gibt es nicht mehr). Exporte ohne Nutzer: `totalPts`, `cutCost`. Die 14 Handy-Blöcke im Stylesheet bleiben wie vereinbart liegen. Sonst nichts: keine tote Funktion, keine ungelesene P-Konstante, kein ungelesener Typ-Schalter, keine alten Kartennamen, kein `VIEW.tilt`. | Bei Gelegenheit streichen. |
| K19 | `tools/test_draht.js` | Meldet weiter 1 Fehler (Straßenzeile Sankt Ruß). Bekannter Fehlalarm, steht in IDEEN.md. | Test berichtigen. |

---

## Gegenprüfung F83–F87

| Punkt | Ergebnis |
|---|---|
| F83 Blickrichtung beim Start | **Behoben.** Im Bild richtig: Grauwall 31 von 31 (eigene Probe) und 34 von 34 (Partietest), Sankt Ruß 35 von 35 – in Graben, Dorf, Wald und im Freien. |
| F85 Drehen | **Behoben.** 3× rechts dreht das Bild um, 3× links zurück (Partietest). |
| F84 Ofen-Glut | **Behoben.** Im Bild steigen gelb-orange Funken aus dem Schornstein. |
| F86 / F87 Auftritt | **Gebaut wie beschrieben.** Der Titel steht 1,0 s allein, erst danach kommen Ausholen und Schlag. Ablauf bei Tempo 1×: Durchbruch 3,4 s, Hinrichtung 3,5 s, Fall eines Helden 4,4 s. Töne in der richtigen Reihenfolge. |
| Weitere Stellen mit falscher Richtung oder Spiegelung | Der Fehler von F83 (Zahl gegen Wahrheitswert) kommt nicht noch einmal vor. Offen ist M7 (Getroffen-Richtung bei Beschuss und Spezialschlägen). Einzelmodelle (Helden, Hauptmann, General, Panzerbüchse) nutzen die Getroffen-Spiegelliste nicht; ihre Bilder sind beim Schneiden richtig gedreht. |

## Geprüft und in Ordnung

- **Zwei Helden sind nicht möglich:** Die Armee-Prüfung lehnt 2 ab; eine ungültige Armee fällt auf die Standardarmee zurück. Nachschub gesperrt mit Held auf dem Feld, nach seinem Fall und nach seiner Flucht vom Feld. Die KI kauft je Seite höchstens einen. Einen Speicherstand gibt es nicht; ein Neustart beginnt sauber.
- **Hinrichtung:** Grenze genau unter 40 (39 ja, 40 nein). Das Ziel fällt immer, auch eingegraben im Graben und unter „Halten um jeden Preis“. Nicht gegen Fahrzeuge und Schreiter. Die Rote Faust selbst kann hingerichtet werden (löst den Fall aus).
- **Durchbruch:** 2 Felder nur aus dem Stand, nicht niedergehalten, nicht gegen Fahrzeuge; Rückstoß um ein Feld, an der Wand mehr Schaden statt Rückstoß.
- **Fall eines Helden:** alle eigenen Einheiten −10 Moral, niemand flieht dadurch sofort.
- **Steckenbleiben:** eine eigene Runde fest, dann frei.
- **Texte, Preise, Medaillen der Helden** stimmen mit der Tabelle (beide 110, leicht gepanzert, Nahkampf Gold; Faust Fernkampf Silber gegen Infanterie).
- **Zugvorschau (F60)** kennt jetzt Fähigkeiten; Einschlag-Ton nutzt die Tabelle; „Kugel vorbei“ doppelt nicht mehr mit dem Einschlag (Liste 1 Nr. 2.15, 2.16, 3.4 erledigt).
- **Töne:** Jeder im Spiel benutzte Name hat einen Ton; kein Platz zeigt auf einen fehlenden Ton.
- **Bilder:** keine Magenta- oder Rosa-Reste in 285 Figurenbildern und 106 Effektbildern (höchstens 4 Pixel je Bild). Alle Figuren haben eine Plastik-Karte, alle stehen mit den Füßen am unteren Bildrand. Posen und Grundbild der Helden sind gleich groß.
- **Speicherschlüssel:** nur die bekannten; die drei alten werden beim Start gelöscht.
- **Tests:** `test_regeln` in Ordnung (135 Konstanten, 2916 Vorschauen, 54 Einheiten), `test_belegung` in Ordnung, `test_partie` ohne Fehler bei 1280, 1920 und 2560 px.

## Messwerte

| Was | Wert |
|---|---|
| Simulation Grauwall, 200 Schlachten | Konkordat 53 %, 0 Fehler, Ø 15,0 Runden |
| Simulation Sankt Ruß, 200 Schlachten | Konkordat 53 %, 0 Fehler, Ø 14,4 Runden |
| Rote Faust gekauft / Durchbruch je Schlacht | Grauwall 0,91 / 0,46 · Sankt Ruß 0,93 / 0,83 |
| Kürassier gekauft / Hinrichtung je Schlacht | Grauwall 0,24 / 0,01 · Sankt Ruß 0,82 / 0,10 |
| Bildzeit Grauwall, 3 Runden Tempo 1× | Mittel 5,8–6,4 ms, 95 % unter 10 ms, längstes Bild 32 ms |
| Bildzeit Sankt Ruß, 3 Runden Tempo 1× | Mittel 7,0–9,8 ms, 95 % unter 14 ms, längstes Bild 32 ms |
| Bilder über 50 ms | keines |
| Speicher | Startmenü 117–120 MB, Schlacht 125–153 MB |
| Ladezeit lokal | Startmenü bedienbar nach 0,4–1,1 s |
| `index.html` | 59,7 MB |

Die Bildrate ist unkritisch. Gemessen im unsichtbaren Chrome; ein Digitalboard mit schwacher Grafik bleibt von Hand zu prüfen.

## Nicht geprüft

- Töne nach Gehör – nur Pegel, Länge und Enden gemessen.
- Die Seite `tonpult.html` selbst im Browser – nur ihr Bauskript gegen `ui.js` gelesen.
- Die Größe des Archivs bei GitHub – nur der lokale Ordner.
- Ein Digitalboard und echte Finger-Bedienung.

## Empfohlene Reihenfolge

1. H1 (eine Zeile) und K1 (Test erweitern).
2. M1 (KI kauft nicht mehr) und M2 (Armee-Auswahl): kleine, sichere Änderungen ohne Regelwirkung.
3. M3, M4, M7, K6, K7: Anzeige und Ton der Helden.
4. M5 entscheiden (Text oder Regel), dann K2, K3, K5, K15 in einem Text-Durchgang.
5. H2 mit M9: Größe.
6. M6 (KI und Kürassier), M8 (Ton-Pult), K8 (Schritte).
