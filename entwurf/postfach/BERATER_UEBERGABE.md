# Übergabe für den Berater-Chat (Claude im Chat, nicht Claude Code)

Stand: 2026-11-20 abends. Neuer Chat liest diese Datei zuerst.

## Rollen
- **Enrico**: entwickelt „Armargeddon“ (Grimdark-WW1-Fantasy, Hex-Strategie, HTML/JS, Einzeldatei-Build index.html ~50 MB).
- **Claude Code** (Desktop-App, Ordner `C:\Projekte\Armargeddon`): setzt um.
- **Berater (dieser Chat)**: plant, schreibt Aufträge ins Postfach, schreibt Gemini-/Suno-Prompts, prüft Bilder/Berichte, legt Bilder/Töne per Geräte-Brücke ins Projekt.

## Wie Enrico arbeiten will
- Deutsch. Technisch immer nur den **nächsten** Schritt geben.
- Entscheidungen als anklickbare Fragen.
- Bei Claude-Code-Arbeit das Modell nennen: Opus Standard, Sonnet für Routine, **Fable nur für schwere Probleme / Gesamtprüfung** (geplant: nach Paket E eine reine Prüf-Runde mit Fable – nur Liste ins Postfach, nichts umbauen; Leistung/50 MB, Widersprüche Regeln/Texte/KI, Tonmischung, Figuren-Maßstab/Mündungspunkte).
- Wenig tippen. Kürzel:
  - **pa** (an Claude Code): neuer Auftrag im Postfach
  - **pw** (an Claude Code): weiter
  - **pb** (an Berater): Bericht ist da → `entwurf/postfach/BERICHT.md` selbst lesen, kurz zusammenfassen, Fragen anklickbar stellen, Antworten unter „Antworten von Enrico“ in `AUFTRAG.md` eintragen.

## Postfach
`C:\Projekte\Armargeddon\entwurf\postfach\` – `LIESMICH.md` (Regeln), `AUFTRAG.md` (schreibt nur der Berater), `BERICHT.md` (schreibt Claude Code, neuester oben).

## Stand der Arbeit
- Spieltest Runde 4: Funde F1–F48 in `entwurf/SPIELTEST_LISTE.md` und `AUFTRAG.md`. Pakete: A erledigt, F erledigt (F43 aktive KI; F44 = Variante A: größere Startarmee statt Welle, wird nach Paket B gebaut; KI-Schalter ruhig/angriffslustig in Paket D). Läuft gerade: **Paket B (Ton)**, danach C (Effekte, Posen, F47 Mündung Hünen, F48 Darkest-Dungeon-Kampfszene, Schadenszahlen 3 Farbstufen), D (Bedienung), E (Regeln).
- **Posenbögen fertig** für alle 12 Einheitentypen aus `entwurf/POSEN_PROMPTS.md`, liegen in `ui-quelle/figuren/*_posen*.png`; Nacharbeiten (Adler übermalen, Flagge umfärben usw.) stehen in `AUFTRAG.md`.
- Später: Fraktionsnamen, Löwenoger-KI vorsichtiger, Titan Stufe 4 Aschenwacht, alter OneDrive-Ordner löschen, wenn nichts fehlt; GitHub-Pages-Seite prüfen.

## Technische Fallen (Geräte-Brücke)
- `device_commit_files` merkt sich Dateien nach Pfad: **jede Ausgabe unter neuem, eindeutigem Dateinamen** in outputs schreiben (z. B. `AUFTRAG_pf19.md`), sonst wird eine alte Fassung geschrieben.
- Vor jeder Änderung an `AUFTRAG.md` frisch einlesen (stage) und `expectedMtimeMs` mitgeben.
- Projekt liegt **nicht** mehr in OneDrive. Alten OneDrive-Ordner und alte Claude-Code-Sitzung dort nicht benutzen.
- Sicherungsregel: `sound-quelle\` und `ui-quelle\konzept\sammlung\` per robocopy /E nach `C:\Users\erolf\OneDrive\Armargeddon-Sicherung\` (kein /MIR, kein /PURGE).

## Gemini-Bilder (Regeln)
- Magenta #FF00FF, Dreiviertelansicht nach rechts, Figuren vollständig, keine Überlappung.
- **Keine echten Abzeichen**: keine Flaggen, Adler, Eisernen Kreuze, geflügelten Totenköpfe, keine Franchise-Namen. Aschenwacht-Helme bekommen von Gemini gern Adler → Satz „IMPORTANT: the spiked helmet is completely plain metal – no eagle, no emblem…“ an den **Anfang** des Prompts.
- Keine Schrift, keine Geisterfiguren, kein Rauch/Mündungsfeuer im Bild.
- Original über „Herunterladen“ holen (Vorschau-Dateien sind zu klein). Für Korrekturen neuen Gemini-Chat.
- Gelände: nur Stilvorlage anhängen, nicht den Soldatenbogen.

## Suno
Create → Custom → Sounds, One Shot für Effekte.
