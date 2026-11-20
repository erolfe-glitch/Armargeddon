# Berichte von Claude Code (neuester oben)

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


