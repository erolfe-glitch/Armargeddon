# Vorschlag: Bewegungspunkte (BP) und Aktionspunkte (AP) trennen

Fahrplan Punkt 2, Stand 2026-11-17. **Noch nicht gebaut** – erst nach Entscheidung.

## Heute (zur Erinnerung)

- Jede Einheit hat 2 Aktionspunkte. Ziehen kostet 1 AP (bis zur Zugweite `mv` in Geländepunkten), ein zweiter Zug noch einmal 1 AP mit halber Weite.
- Schießen kostet 1 AP, Nahkampf alle AP, Befehle/Fähigkeiten 1–2 AP. Marsch = beide AP für doppelte Weite, danach nichts mehr.
- Problem: „Ziehen“ und „Handeln“ teilen sich denselben Topf. Kurze Wege kosten so viel wie lange; wer 1 Feld vorrückt, hat schon die Hälfte verbraucht.

## Vorschlag

Jede Einheit hat **Bewegungspunkte (BP)** für den Weg und **1 Aktion (AP)** für das, was sie tut. Beides ist frei kombinierbar: erst ziehen, dann handeln, oder umgekehrt, oder ziehen – handeln – mit Rest-BP weiterziehen.

| Klasse | BP | AP | Hinweis |
|---|---|---|---|
| Infanterie (Schützen, Pioniere, Sanitäter, Melder …) | 3 | 1 | Melder mit Hund 5 BP |
| Sturmtruppen, Flammentrupps | 3 (Flamme 2) | 1 | |
| MG-Trupp | 2 | 1 | aufgebaut: 0 BP (erst abbauen) |
| Reiter | 5 | 1 | |
| Kampfanzug (Stahlgänger, Panzerknechte) | 3 | 1 | |
| Fahrzeug (Landkoloss, Sturmpanzer, Bohrkoloss) | 3 | 1 (+1 Zweitwaffe) | Drehen kostet BP statt AP |
| Schreiter, Eisenknecht | 3 | 1 (+1 Zweitwaffe) | Drehen kostet BP |
| Geschütz (abgeprotzt / aufgeprotzt) | 0 / 3 | 1 | Mörser: 2 BP, schießt nach dem Ziehen |

### Geländekosten in BP je Klasse

| Gelände | Infanterie / Anzug / Sturm | Reiter | Fahrzeug | Schreiter | Geschütz (aufgeprotzt) |
|---|---|---|---|---|---|
| Offen, Straße, Dorf, Kirche, Bunker, Bahn | 1 | 1 | 1 | 1 | 1 |
| Graben | 1 | 3 | 2 | 2 | 2 |
| Trichter | 2 | 3 | 1 | 2 | 2 |
| Schlamm | 2 | 2 | 2 (Festfahren möglich) | 2 | 3 |
| Wald / Totholz | 2 / 3 | – | – | 3 | – |
| Stacheldraht | 1, Halt und Schaden (Anzug ohne) | – | walzt nieder, 1 | walzt nieder, 1 | – |
| Furt, Sumpf | 3 | 3 | 3 | 3 | – |
| Barrikade, Fabrik | 2 | – | 2 | 2 | – |

(„–“ = nicht befahrbar. Die meisten Werte sind die heutigen; neu sind die Unterschiede für Fahrzeuge und Schreiter im Graben/Trichter.)

### Was kostet was

| Handlung | Kosten |
|---|---|
| Ziehen | BP nach Gelände; Feindberührung beendet die Bewegung (wie heute) |
| Marsch | AP statt Handlung: +50 % BP (Infanterie 3 → 4,5, abgerundet 4), danach keine Aktion; nicht neben den Feind |
| Sturmlauf | die Aktion: fester Weg bis 3 Felder, danach Nahkampf ohne weitere Kosten |
| Schießen, Nahkampf, Befehl, Fähigkeit, Draht schneiden | die Aktion (1 AP) |
| MG aufbauen / abbauen | 1 BP (aufbauen nimmt alle restlichen BP) |
| Drehen auf der Stelle | Infanterie frei; Fahrzeug/Schreiter 1 BP je 60° |
| Zweitwaffe | eigene kleine Aktion, einmal je Runde |
| Abprotzen / Aufprotzen | Abprotzen alle BP, Aufprotzen 1 BP |

### Anzeige im Panel

- Statt der zwei Messingmünzen: **Stiefel mit Zahl** (BP, z. B. „3“, wird beim Ziehen weniger) und **eine Münze** für die Aktion (voll/leer). Zweitwaffe als kleine zweite Münze bei Fahrzeugen.
- Unter der Figur: dünner Streifen mit BP-Punkten, darunter die Aktionsmünze.
- Zugfelder: hell = mit den BP erreichbar, gelb gestrichelt = nur mit Marsch. Pfadvorschau zeigt die Rest-BP am Zielfeld.
- Knöpfe zeigen „Aktion“ statt „1 ●“; Drehen bei Fahrzeugen „1 BP“.

## Einschätzung

**Balance**
- Infanterie wird beweglicher (ziehen + schießen ist dann der Normalfall); Feuerkraft je Runde bleibt gleich, weil es weiter nur eine Aktion gibt. Der Angreifer (Konkordat) profitiert etwas mehr, weil er weiter laufen muss – Siegquote vermutlich +5 bis +10 Punkte, danach mit Kosten/Werten ausgleichen.
- Nahkampf wird stärker: heute „alle Punkte“, künftig ziehen bis daneben und dann zuschlagen. Abhilfe: Nahkampf nur, wenn höchstens die Hälfte der BP verbraucht ist, oder Gegenschlag stärker.
- Fahrzeuge werden langsamer im Graben/Trichter-Gelände, dafür flexibler beim Drehen. Mit den neuen Schusswinkeln fühlt sich das logischer an.
- Generalangriff (+1 AP) müsste zu „+2 BP und +1 Aktion“ werden; Meldegänger gibt +2 BP statt +1 AP.

**KI**
- Größter Umbau: Die KI plant heute in Schritten zu je 1 AP. Neu: erst Zielfeld nach Rest-BP, dann eine Aktion; die bestehende Bewertung (posValue, bestAttackFrom) bleibt nutzbar, nur die Schrittfolge und `reachable` (BP statt AP) ändern sich.
- Aufwand grob: Regeln 1–2 Tage, KI 1 Tag, Anzeige 1 Tag, danach `sim.js` und Balance.

**Empfehlung:** BP/AP wie oben, aber in zwei Schritten bauen – erst Regeln und Anzeige mit gleicher KI-Logik (KI behandelt „ziehen“ und „handeln“ als zwei Schritte), dann die KI verfeinern.
