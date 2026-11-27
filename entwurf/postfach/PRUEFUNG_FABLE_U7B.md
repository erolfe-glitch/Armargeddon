# Prüfung U7b Teil 2 – Ergebnis (27.11.2026)

Geprüft: Commit `7d3d59c` am Code (`src/engine.js`, `src/ai.js`, `src/ui.js`), ohne Simulation und ohne Browser. Alle Aussagen zur Wirkung sind aus dem Code abgeleitet, nicht gemessen.

## Urteil
Die Regelstellen (Nr. 4, 5, 6) und alle vier Rückweg-Schalter sind in Ordnung: nichts stürzt ab, nichts wird doppelt gezählt.
Nachbessern sollte man drei Stellen in der KI (Fehler 1 bis 3), der Rest ist klein.

## Fehler, nach Schwere

### Mittel
1. **„Wankende ziehen in Deckung“ misst die Feindnähe am Zielfeld statt am Trupp** (`ai.js:55–56`, `wanktDeckung`).
   - Der Zuschlag gilt nur für Felder, die höchstens 5 Felder vom Gegner liegen. Ein wankender Trupp, der 6 oder 7 Felder entfernt steht, bekommt für sein eigenes Feld 0 und für einen Graben näher am Gegner +2. Er wird also nach vorn gezogen.
   - Umgekehrt zählt Deckung weiter hinten (über 5 Felder) nichts.
   - Behebung: die Bedingung auf den Standort des Trupps legen, `nearestEnemyDist(G, u.side, u.c, u.r) > 5`.
2. **Derselbe Zuschlag kann einen Trupp vom Zielfeld abziehen** (`ai.js:55–56` gegen `ai.js:311`).
   - Ein Zielfeld zählt 1 + 0,4 × Punkte, also 1,4 bei einem Punkt und 1,8 bei zwei. Der Zuschlag für Graben, Bunker, Gebäude oder Fabrik nebenan ist 2 und kommt zum normalen Deckungswert dazu.
   - Betroffen sind nur Zielfelder im Offenen oder in leichter Deckung (Dorf, Wald: dort +1). Liegt das Zielfeld selbst im Graben oder Gebäude, bekommt es den Zuschlag auch, dann bleibt der Trupp.
   - Der Besitz bleibt zwar, aber das Feld ist frei, und der Gegner kann hineinziehen.
   - Behebung: in `wanktDeckung` 0 zurückgeben, wenn der Trupp auf einem Zielfeld steht und ein anderes Feld bewertet wird.
   - Pendeln innerhalb einer Runde gibt es nicht, die Bewertung ist für beide Felder dieselbe. Über mehrere Runden ist ein Wechsel möglich (in Deckung erholt, wieder vor, wieder getroffen). Das ist vertretbar.
3. **Der Faktor ×0,3 für Zerschlagene wirkt nur im normalen Schuss und Nahkampf** (`attackValue`, `ai.js:362`, samt Reiter-Bonus `ai.js:381`). An diesen Stellen wählt die KI Ziele ohne ihn:
   - Zweitwaffe (`ai.js:596–598` und `722–725`) und zweiter Schuss der Breitseite (`ai.js:663–665`): sortiert nach der geringsten Stärke, Zerschlagene stehen damit vorn.
   - Dauerfeuer der Hünen (`ai.js:669–673`) und zweites Ziel der Faustsalve (`ai.js:763–766`): +3 für „Ziel wird vernichtet“, das erreichen Zerschlagene fast immer. Das Dauerfeuer kostet danach eine Runde Abkühlen, die Faustsalve gibt es nur einmal je Schlacht.
   - Fähigkeiten in `abilPlan` (`ai.js:148`, `foe` nimmt auch Fliehende): Hinrichtung (Wert 6 und mehr), Sprungangriff, Durchbruch, Sturmrollen, Panzergranate, Handgranate.
   - Behebung: eine kleine Hilfsfunktion „Ziel ist zerschlagen“. In `foe` solche Ziele auslassen, bei Zweitwaffe und Breitseite ans Ende sortieren, in den beiden `wert`-Funktionen ×`W_ZERSCHLAGEN` ohne die +3.
   - Nicht betroffen: Geschütze, Mörser und Artillerie-Sperrfeuer (`planArt` nimmt nur Einheiten, die nicht fliehen) und das MG-Sperrfeuer (Fliehende lösen es nicht aus).

### Klein
4. **Zurückweichen in Draht, Gas und Feuer ist möglich** (`engine.js:1426–1441`, `retreatHex`).
   - Draht hat nur einen Abzug von 2, Gaswolken und brennende Felder werden gar nicht geprüft. Schaden gibt es beim Hineinweichen nicht, Gas und Feuer wirken dann zu Beginn der eigenen Runde. Minen lösen nicht aus.
   - Das war schon vorher so. Mit Nr. 6 wird 40–80 % öfter gewichen, also fällt es öfter auf.
   - Behebung: Felder mit Gas (`cloudAt`) oder Feuer (`fireAt`) mit −4 bewerten, Draht mit −4 statt −2 (außer `wireProof`).
   - Besetzte Felder sind ausgeschlossen (`unitAt` zählt auch Fliehende). Zweimal je gegnerischer Runde weicht niemand (`gewichenIn`, `engine.js:1445`).
5. **Durchgefallener Entsetzenstest wirft jetzt auch starke Trupps zurück** (`engine.js:1391–1393`).
   - Der Test zieht Moral ab und hält nieder. Fällt die Moral dadurch unter die Schwelle, greift danach Nr. 6, auch bei 60 Stärke und mehr. Vorher blieb der Trupp liegen.
   - Das passt zum Wortlaut von Nr. 6, steht aber nicht im Bericht. Wenn es nicht gewollt ist: `morVor` erst nach `entsetzen` vergleichen.
6. **Feuerschlag bekommt „wankt ×0,85“ nicht** (`engine.js:2083–2085`): Die Hilfs-Batterie `bat` hat keinen Status, `wankt(bat)` ist immer falsch. Bericht und Kommentar in `engine.js:1661` nennen den Feuerschlag trotzdem. Behebung: Kommentar berichtigen (siehe Frage 2).
7. **KI übersieht den neuen Gewinn bei Panik-Zielen** (`ai.js:355`, `if (flieht) {}`): Ein Schuss, der einen Panik-Trupp unter 15 Stärke drückt, bringt jetzt sofort die Punkte und macht ihn endgültig. Behebung: für Panik-Ziele mit `strAfter < P.ROUT_STR` einen Zuschlag geben (Vorschlag 1,5).
8. **Vierte Deckungs-Liste übrig** (`engine.js:1436`, `retreatHex`): kennt Haus, Kapelle und Mühle nicht. Behebung: `erholFeld(t)` nehmen.
9. **Faustsalve, Werte:** `fxFaust` (`ui.js:212–215`) nimmt für die vordere Faust 0,962 / 0,51. `MUZ_FIG` und `MUZ2` haben für dieselbe Pose 0,984 als Laufspitze (`ui.js:538`, `546`). Am Bild `entwurf/probe/u7b/4_faustsalve_punkte.jpg` gegenprüfen.

## Geprüft und in Ordnung
- **Nr. 3, zweiter Sammeln-Check** (`ai.js:676–680`): richtig eingehängt. Er läuft erst, wenn alle Einheiten gezogen haben, und danach bei jedem weiteren Schritt des zweiten Durchgangs. Die Seite prüft `canOrderKind`, die Marke `o2` wird erst beim Befehl gesetzt, eine Schleife ist nicht möglich.
- **Nr. 4, Rand:** Sammelt sich der Trupp, zählt nichts. Sonst zählt `killUnit` genau einmal. Zerschlagene haben Chance 0 und sind wie vorher fort.
- **Nr. 4, zerschlagen auf der Flucht:** `credit` ist durch `u.credited` gesperrt, auch bei späterer Vernichtung oder am Rand. Die Prüfung sitzt an allen Schadenswegen für Fliehende (Treffer, Feuer, Gas, Vergiftung). Der Verlust zählt sofort voll.
- **Nr. 4, Deckungs-Funktion:** an allen drei Stellen richtig. Schwelle und halber Moralverlust sind unverändert, die Erholung hat Haus, Kapelle und Mühle dazubekommen.
- **Nr. 4, wankt in `shellDmg`:** nicht doppelt. `preview` und `shellDmg` sind getrennte Wege, Geschütze schießen nur über `shell`.
- **Nr. 5/6, Zielfeld:** Der Besitz bleibt beim Zurückweichen. Das Feld wird aber in derselben gegnerischen Runde frei (erst schießen, dann hineinziehen). In Graben, Bunker und Gebäude schützen Schwelle 20 und halber Moralverlust, im Offenen nicht. Siehe Frage 1.
- **Rückwege:** `KI_U7B_ALT`, `U7B4_ALT`, `HALTEWEICH_ALT` und `WEICHEN_ALT` stellen je ihren Teil vollständig wieder her. Nicht schaltbar sind nur Texte und die Mündungspunkte.
- **Faustsalve, Spiegelung:** richtig, dieselbe Rechnung wie `fxMuzzle`. Die Pose ist beim Aufruf schon gezeichnet.

## Fragen an Enrico
1. **Soll ein Trupp auf einem eigenen Zielfeld standhafter sein, also erst unter 20 weichen wie in Deckung?** Empfehlung: vorerst nein, im Spieltest beobachten. „Halten um jeden Preis“ und das Banner sind dafür da, und die Siegquoten liegen in der Streuung.
2. **Soll ein wankender Fernsprechtrupp einen schwächeren Feuerschlag rufen (×0,85)?** Empfehlung: nein, die Batterie steht hinter der Front. Dann nur den Kommentar berichtigen.
