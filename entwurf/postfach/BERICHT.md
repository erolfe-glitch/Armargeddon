# Berichte von Claude Code (neuester oben)

## 2026-11-20 20:51 – Paket F (KI, Gegnerarmee): F43 erledigt, F44 Vorschlag – Entscheidung nötig

**Commits:** `968e0ae` F43 aktive KI (gepusht). Werkzeug neu: `tools/ki_aktiv.js` (misst Vorrücken, Angriffe, Rückzüge, Zielfelder; `HALTEN=1` = Gegner hält nur wie ein vorsichtiger Spieler).

### F43 – KI zu passiv: Ursache und Lösung
- **Ursache:** Die KI rechnet für jedes Feld die „Bedrohung“ zusammen – und zählt dabei jeden Gegner voll, der das Feld erreichen könnte, als würden alle zugleich auf diesen einen Trupp schießen. Vor einer gegnerischen Linie ergibt das −12 bis −19 Punkte, ein Feld Vorrücken bringt nur +0,8. Ergebnis: Die Aschenwacht blieb vor dem eigenen Graben stehen (Grauwall: vordere Trupps ab Runde 2 bei Spalte ~5,7 von ihrer Kante) und 23 % ihrer Züge gingen nach hinten.
- **Lösung (nur für die Seite, die gegen dich spielt):** Bedrohung über 1,5 zählt nur noch zu einem Drittel; muss die KI angreifen (du hältst mindestens so viele Fahnen oder führst), zählen Vorrücken und Fahnen ×1,5; gesunde Trupps (Stärke ab 50, nicht auf der Flucht) ziehen nicht mehr grundlos zurück.
- **Messung Grauwall:** vordere Trupps bis Spalte 8 statt 6,8; Rückzug 10 % statt 23 % der Züge; gegen einen Gegner, der ab Runde 5 nur noch hält, gewinnt die KI 28 von 30 Schlachten (vorher kaum Druck).
- **Warum nur die Computerseite:** Für beide KI-Seiten zugleich verschob es die Balance stark (Grauwall Konkordat 51 % → 16 %, Sankt Ruß 47 % → 70 %), weil dann auch die KI-Konkordat in die MG-Linie läuft. Die Balance-Simulation misst deshalb weiter mit gleich spielenden Seiten – **Balance unverändert** (geprüft: bitgleich mit vorher, Grauwall 59 %, Sankt Ruß 48 % bei 200 Schlachten).
- **Wichtig für deinen nächsten Spieltest:** Die KI ist jetzt deutlich stärker als vorher. Wenn sie dir zu hart wird, ist das ein Regler (drei Zahlen in `ai.js`, `AKTIV`).

### F44 – Gegnerarmee: Vorschlag (noch nichts gebaut)
Heute auf dem Grauwall: Aschenwacht startet mit 675 Punkten, in Runde 7 kommt eine Welle (3 Sturmtrupps, 2 Brandtrupps, 1 Geschütz = 450 Punkte) am Rand. Gemessen (200 Schlachten, KI gegen KI, Anteil Siege Konkordat):

| Variante | Konkordat |
|---|---|
| heute (Welle Runde 7) | 59 % |
| **A** ganze Welle von Anfang an in der Startarmee | 15 % (viel zu stark) |
| **A2** zwei Drittel der Welle von Anfang an | 68 % |
| **B** keine Welle, Nachschub-Einkommen 40 statt 10 je Runde | 82 % |
| **B2** keine Welle, Einkommen 60 | 76 % |

**Empfehlung: Variante A** – keine Welle mehr, dafür von Anfang an etwa drei Viertel der Welle in der Startarmee (z. B. 3 Sturm, 1 Brand, 1 Geschütz zusätzlich), über die ganze Breite verteilt; genaue Menge per Simulation auf ~50 %. Gründe: Du siehst den Gegner von Anfang an, nichts kommt überraschend; frühe Einheiten zählen viel mehr als späte (darum ist die volle Welle von Anfang an viel zu stark). Variante B wirkt kaum, weil die KI ihr Geld nur am Rand und ohne Plan ausgibt – das müsste ich erst verbessern. Gilt für alle Karten mit Welle (alle außer Sankt Ruß).

### Fragen an Enrico
- **F44:** Variante A (mehr Einheiten von Anfang an, ich stimme die Menge per Simulation ab) – einverstanden? Oder B (Nachschub über Fahnen wie bei dir; dann zuerst die Kauf-KI verbessern)?
- **F43:** Soll die aktive KI später als Einstellung „KI: ruhig / angriffslustig“ wählbar sein?

Weiter geht es jetzt mit Paket B (Ton); F44 setze ich nach deiner Entscheidung um.


## 2026-11-20 20:16 – Paket A (Fehler, Lesbarkeit, Menüs) erledigt

**Commits:** `eb75779` Postfach-Regel in CLAUDE.md · `678cd04` Paket A · `429d231` Auftrag + POSEN_PROMPTS.md (Enricos Dateien) – alles gepusht.
**Screenshots:** `entwurf/probe/spieltest4_paketA/`

| Punkt | Ergebnis |
|---|---|
| F12 Drahtschneiden | Ursache: (1) Nach jedem Schnitt wurde die ganze Geländewelt neu gebaut (0,4–0,6 s) → das Stocken. (2) Die „Kugeln“ waren alte Funken-Partikel, die in der neuen Ansicht als flache Farbkreise erscheinen. Jetzt: nur die Drahtstücke des Felds verschwinden (kein Neuaufbau, gilt auch für Niederwalzen/Zerschießen), dazu eine Staubwolke. Bild: `f12_draht_vorher_nachher.jpg`, `f12_staub_statt_kugeln.jpg` |
| F1 | Bildwirkung startet auf „stark“ (auch bei dir, die alte Einstellung wird nicht übernommen) |
| F2 | Menü im Spiel: „Zurück zum Spiel“ oben, „Beenden“ unten; Beenden fragt einmal („Wirklich beenden?“), dann Startbildschirm. `f2_spielmenue.jpg` |
| F3 + F7 | Tooltips, Pergament-Details, Nachschub, Armee-Auswahl: Schrift 16–21 px statt 12–14, dunkle Tinte. 21 lange Einheitentexte gekürzt (Ø 234 → 195 Zeichen). 1280 px geprüft (Namen umbrechen, nichts überlappt). `f3_*.jpg` |
| F19 | Fähigkeitsknöpfe zeigten bisher die ganze Einheitenbeschreibung. Jetzt eigener Kurztext je Fähigkeit, Zahlen direkt aus den Regeln. Abweichung gefunden: „Draht schneiden – danach noch Angriff“ stimmte nicht (es kostet die Aktion); Text korrigiert. Haftladung: 50 % Panne bei Kolossen fehlte im Text. |
| F42 | Auswertung: Werte hell auf den dunklen Kacheln, Fragen dunkel auf dem Pergament, größer. `f42_*.jpg` |
| F10 | Geländehinweis beim Ziehen kleiner |
| F15 | Optionen → „Meldungen: Text / Symbole / aus“. Schadenszahlen, Punkte, „fällt“, „aufgerieben“, große Befehle bleiben immer. |
| F18 | Lautsprecher bei Ton aus rot durchgestrichen, kurzer Hinweis; neu: Taste M |
| F22 / F23 | Niedergehalten: kleine dunkle Plakette, kein Leuchtkreis. Zahnrad (Panne) heller, deckend, dunkle Kontur. `f22_f23_marken.jpg` |
| F13 | „Runde beenden“ pulsiert langsam, wenn alle Einheiten fertig/abgehakt sind |

**Tests:** Partietest 4 Runden ohne Konsolenfehler; Draht Bild = Regel ok. `test_draht.js` meldet einen Fehler (Straßenbau Zeile 504) – der war schon vor Paket A da, nicht von mir; schaue ich mir bei Gelegenheit an. Keine Regeländerung → keine Simulation nötig.

**Offen / Hinweise:** Gegenüber der Liste nicht verändert: die Kurztexte der Schlagwort-Chips (z. B. „Draht schneiden (Nachbarfeld, 1 Punkt)“ – „Punkt“ ist noch die alte Sprache); nehme ich mit, wenn F17/F11 die Bedienung umbauen.

### Fragen an Enrico
- F15: Reichen „Text / Symbole / aus“ so, oder sollen Schadenszahlen auch abschaltbar sein?
- F3/F7: Ist die neue Schriftgröße so richtig, oder noch größer (bei 1280 px wird es dann eng)?


