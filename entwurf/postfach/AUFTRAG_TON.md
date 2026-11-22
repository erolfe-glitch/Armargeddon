# Auftrag Ton-Pult 2 (für den zweiten Claude Code) – Enrico 2026-11-22 19:10

## Kürzel für dich
- **ta** = diese Datei (`C:\Projekte\Armargeddon\entwurf\postfach\AUFTRAG_TON.md`) frisch lesen und abarbeiten
- **tw** = mit dem nächsten offenen Schritt weitermachen
- Am Ende im Chat nur: „Ton-Bericht im Postfach – tb“ (ganz unten)

## Einrichtung (einmalig, Schritt 0)
1. Im Hauptordner `C:\Projekte\Armargeddon` arbeitet gleichzeitig ein **anderer Claude Code** auf `main`. Dort **nichts ändern, nichts committen, nicht `git checkout`/`switch`/`reset`** – nur lesen.
2. Warten, bis der Haupt-Claude-Code den Abschnitt 18:45 (Feldkanone-Ton in `tools/tonpult_bau.mjs`) gepusht hat: `git fetch` und im Log von `origin/main` nachsehen. Ist er nach 30 Minuten nicht da, trotzdem anfangen und es im Bericht sagen.
3. Arbeitsordner anlegen: `git worktree add C:\Projekte\Armargeddon-ton -b tonpult2 origin/main` – **ab dann nur noch dort arbeiten**.
4. Ton-Quellen (`sound-quelle/`) sind nicht in git; das Pult braucht nur `src/sound.js` (eingecheckt). Falls du für Tests Dateien aus dem Hauptordner brauchst: nur lesen. Vorschau-Server, falls nötig, auf einem anderen Port als der Haupt-Claude-Code.
5. **Nur diese Dateien ändern:** `tools/tonpult_seite.js`, `tools/tonpult_seite.css`, `tools/tonpult_bau.mjs`, `tonpult.html` (erzeugt), neue Test-/Hilfsdateien unter `tools/tonpult_*`. **Nicht** `src/`, nicht `index.html`, nicht `tools/build.py`, nicht `CLAUDE.md`, nicht `AUFTRAG.md`/`BERICHT.md`. Wenn im Spiel (`src/ui.js`) etwas geändert werden müsste: als Frage in den Bericht, nicht selbst machen.
6. Commits im Zweig `tonpult2`, als „Claude <noreply@anthropic.com>“, pushen mit `git push -u origin tonpult2`. **Nicht nach main pushen, nicht mergen** – das macht später der Haupt-Claude-Code.
7. Bericht: `entwurf/postfach/BERICHT_TON.md` **im Arbeitsordner** (`C:\Projekte\Armargeddon-ton\…`), neuester oben, mit Commits, Screenshot-Pfaden (Screenshots unter `entwurf/probe/tonpult2/` im Arbeitsordner) und „Fragen an Enrico“. Diese Datei (AUFTRAG_TON.md) nur abhaken, nicht ändern.

## Auftrag: Ton-Pult 2 – leichter verteilen, logisch sortiert
**Warum:** Enrico ist unzufrieden: Die Auswahl je Platz ist „unpassend sortiert und unlogisch zugeteilt“ (Gruppen wie `gespann`, `held`, `fahrzeug`, `handgriff` sind nach Code sortiert, nicht nach Gehör; z. B. Oger-Brüllen in Gruppe `fahrzeug`). Man kann immer nur eine Einheit auf einmal ändern. Er will Töne leicht verteilen, auch auf mehrere Einheiten gleichzeitig.

**Entscheidungen von Enrico:**
1. **Zwei Wege, gleiches Ergebnis:**
   - **Tabelle:** Zeilen = Einheiten (beide Seiten), Spalten = Ereignisse (Anklicken, Ziehen, Schuss, Treffer am Ziel, Nahkampf, Getroffen, Tod, Fähigkeiten). Zelle zeigt den gewählten Ton kurz (Name, ▶ zum Hören). Mehrere Zeilen anhaken → Spalte wählen → Ton aus der Bibliothek → gilt für alle angehakten. Zellen ohne passenden Platz bleiben leer/grau.
   - **Vom Ton aus:** Ton in der Bibliothek wählen → Häkchen setzen, bei welchen Einheiten und Ereignissen er spielen soll (gleiche Schnellwahl wie unten). Anzeige „benutzt von …“ an jedem Ton.
2. **Bibliothek nach dem, was man hört:** Stimmen und Rufe · Schritte · Pferde · Motoren und Ketten · Schreiter und Maschinen · Gewehre · MG · Kanonen und Artillerie · Einschläge · Nahkampf · Feuer, Gas, Rauch · Natur, Kulisse und Winter · Oberfläche. Jeder Ton mit lesbarem Namen (nicht nur Schlüssel), Länge, Seite (falls nur für eine), Quelldatei klein. Suchfeld, ▶ Vorhören, Favoriten-Stern. Diese Sortierung ersetzt in der Auswahl die alten Code-Gruppen (die Code-Gruppen dürfen intern bleiben).
3. **Schnellauswahl für mehrere Einheiten (alle vier):**
   - nach Art: alle Fußtruppen, Fahrzeuge, Schreiter, Reiter, Geschütze, Helden, Anführer
   - nach Seite: ganzes Konkordat, ganze Aschenwacht
   - nach Waffe: alle mit Gewehr, MG, Kanone, Flammenwerfer
   - frei anhaken (einzelne Häkchen); Schnellwahl und Häkchen lassen sich kombinieren
4. **Wichtig, nichts kaputt machen:**
   - Speicher (`arm.tonpult`), Verlauf und Export-Format bleiben gleich (`aenderungen` je Einheit und Platz), damit `tools/tonwahl_bau.mjs` und Enricos bisherige Auswahl weiter gelten. Mehrfach-Zuweisung schreibt einfach je Einheit einen Eintrag.
   - Schlüssel nie umbenennen.
   - Teilen sich Einheiten im Spiel einen Platz, das deutlich anzeigen („gilt auch für …“) statt still mitzuändern.
   - Rückgängig-Knopf (letzte Zuweisung zurück, auch bei Mehrfach-Zuweisung).
   - Lautstärke und Tonhöhe auch für mehrere angehakte gleichzeitig einstellbar.
5. Bedienung groß genug für Digitalboard (Knöpfe ≥ 40 px), Deutsch, Stil wie bisher.
6. **Bericht:** Screenshots von Tabelle, Bibliothek und einer Mehrfach-Zuweisung (z. B. „alle Fußtruppen Konkordat → Schritte im Schnee beim Ziehen“), plus Test: Export → `tonwahl_bau.mjs` im Arbeitsordner (nur zum Prüfen, Änderung an `src/ui.js` danach wieder verwerfen) → richtige Einträge für alle gewählten Einheiten.

## Fortschritt (nur abhaken)
- [x] Schritt 0 Einrichtung
- [x] Bibliothek nach Gehör
- [x] Tabelle mit Mehrfachwahl
- [x] Vom Ton aus
- [x] Rückgängig, „gilt auch für“, Lautstärke für mehrere
- [x] Tests und Bericht
