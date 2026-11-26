# G7h – Bilder, die der Berater neu malen soll (Stand G7g, 2026-11-26)

Machart wie G7-1 bis G7-6: Magenta-Hintergrund, 2752 × 1536, Licht von links oben, Blick etwa 40° von oben, Tuschekonturen, Farben wie `graben_lippe_bogen.png` Streifen 1 (trocken, erdig). Keine gemalten Schatten außerhalb des Teils.

Der Graben ist jetzt **0,95 Feldradien breit** (vorher 0,6). Die Buchten springen nur noch um 0,45 R, ein Erdblock kommt etwa alle zwei Felder.

| # | Name | Inhalt | Maße im Spiel | Ansicht / Hinweise |
|---|---|---|---|---|
| G7-3b | `graben_wand_seite_breit` | Seitenwand für Gräben, die in die Tiefe laufen: oben ein schmaler Streifen Bodenkante mit Krümeln, darunter die Wand **schräg nach innen abfallend**, unten dunkel in die Sohle übergehend. 3 Fassungen: Flechtwerk, Bretter, nackte Erde. Nahtlos kachelbar. | Streifen 0,22 R breit (Boden 0,08 R + Wand 0,14 R) | Von oben in den Graben gesehen, **ohne senkrechte Pfosten** (die wirkten an der Längskante wie Säulen). Waagerecht kachelbar, im Spiel um 90° gedreht. |
| G7-6b | `graben_querwand_block` | Querwand als **Erdblock mit sichtbarer Oberseite**: oben flache Erde mit 1–2 Lagen Sandsäcken quer über den Graben, die vordere Seite fällt kurz und dunkel in den Graben (Flechtwerk oder Bretter). 3 Fassungen. | 0,95 R breit (Grabenbreite), Oberseite 0,35 R tief, Vorderseite etwa 0,25 SH hoch | Von oben, Oberseite deutlich sichtbar, damit der Block nicht wie eine Kiste aussieht. Seiten schließen gerade an die Grabenwände an. |
| G7-1b | `graben_lippe_schmal` (wünschenswert) | Erdlippe wie G7-1, aber schmaler und erdiger, die Bruchkante kräftig dunkel, außen einzelne helle Erdklumpen. 2 Fassungen. | Streifen 0,24 R | Wie G7-1; nur, wenn die heutigen Streifen nach G7g noch zu breit/hell wirken. |

Nicht nötig: Innenwand G7-2, Sandsackwall G7-4 und die Lippen-Ecken G7-5 bleiben (die Ecken sind ausgeschaltet, die Streifen überlappen).

## Heutige Ruinen-Teile (Punkt 88.1, G7h-2, 2026-11-26)
Bis G7h-1 hat GBau jede Ruine (Feldart `village`) aus diesen Teilen zusammengesetzt. Seit G7h-2 gilt nur noch das ganze Modell `ruine_haus_1–4`; der Rückweg ist `window.RUINE_ALT`.

| Teil | Quelle | Maß | Wie GBau es aufstellt | Gekippt? |
|---|---|---|---|---|
| `ruine_hinten` | Wandstreifen (`wand`), nahtlos | 1,2 SH hoch | Durchgehende Wand über die hinteren Kanten 3–4–5 des Feldes (Faktor 0,86 zur Ecke) | ja, über `wall(…, { mitte })` → `kippen`: die Oberkante der in die Tiefe laufenden Stücke kippt nach außen, höchstens `KIPP_MAX` 0,26 R |
| `ruine_vorn` | Wandstreifen | 0,45 SH | Kante 2→1 und ein halbes Stück 3→2, weiter innen (Faktor 0,66), abgedunkelt | ja, wie oben |
| `ruine_ecken_1–4` | Bogen, Einzelteile | 1,2 / 0,8 / 0,45 / 1,4 SH | Aufsteller auf den Stößen (Ecken 3, 4 oder 5, 0, 1) | nein (Aufsteller stehen senkrecht) |

**Ergebnis mit `window.NOKIPP`** (`entwurf/probe/gelaende_g7h2/vergleich_ruine_kippen.jpg`, links wie im Spiel, rechts ohne Kippen): Das Kippen macht das Auffächern stärker, ist aber nicht die einzige Ursache. Auch ohne Kippen stehen die Wandstreifen als flache Bänder auf den Sechseckkanten, und an den schrägen Kanten wirken sie wie aufgestellte Pappen. Deshalb gibt es jetzt das ganze Modell je Feld.

## Neu in G7h-2: Bauweise
- **Laufsteg:** `graben_laufsteg_1–4` (Lattenroste). 0,35 R breit, entlang der Mittellinie jedes Grabenabschnitts gekachelt, nur gedreht, vorgefiltert dunkel. Streifen 4 (fehlende Latten) erscheint in etwa 7 % der Kacheln. Rückweg `window.STEG_ALT` (Code-Steg aus G7h-1).
- **Drahtgürtel in die Tiefe:** `draht_modul_1–4`, `_kaputt`, `_reste`. Je Feld 3 Module hintereinander (Abstand 0,6 R, Breite 0,82 R), dazwischen eine im Code gezogene Drahtlinie von Pfahlkopf zu Pfahlkopf. Etwa 8 % sind kaputt, 5 % lose Reste. Rückweg `window.MODUL_ALT`. Die Stücke `_schraeg_1–3`, `_quer_1/2` und `_ende` haben **kein** Fluchtpunktproblem (Pfahlreihen parallel), sie bleiben.
- **Hausruinen:** `ruine_haus_1–4`. Ein ganzes Modell je Dorffeld, 1,62 R breit, nicht gespiegelt (Licht von links), leicht abgedunkelt. Für die Reihenfolge beim Zeichnen gilt es als 0,15 R hinter der Feldmitte, damit die Figuren im eigenen Feld davor stehen.
