# Postfach – so arbeiten Claude (Berater-Chat) und Claude Code zusammen

Enrico ist die Schaltstelle. Er tippt nur noch Kürzel:

| Kürzel | an wen | heißt |
|---|---|---|
| **pa** | Claude Code | „Neuer Auftrag im Postfach“: `entwurf/postfach/AUFTRAG.md` frisch lesen und abarbeiten |
| **pb** | Claude (Berater) | „Bericht ist da“: Claude liest `entwurf/postfach/BERICHT.md` selbst |
| **pw** | Claude Code | „weiter“: mit dem nächsten offenen Schritt aus AUFTRAG.md fortfahren |

## Dateien
- `AUFTRAG.md` – schreibt nur Claude (Berater). Der aktuelle Auftrag; ältere Aufträge stehen darunter unter „Erledigt“.
- `BERICHT.md` – schreibt nur Claude Code. Neuester Bericht oben, mit Datum/Uhrzeit, Commits und Abschnitt „Fragen an Enrico“. Ältere Berichte wandern nach `BERICHT_ARCHIV.md`, wenn BERICHT.md länger als etwa 300 Zeilen wird.

## Regeln für Claude Code
1. Bei **pa** oder **pw**: AUFTRAG.md immer frisch von der Platte lesen, nie aus dem Gedächtnis.
2. Schritte selbstständig nacheinander abarbeiten, jeden Teilschritt einzeln committen und pushen.
3. Bei echten Entscheidungen (Regeln, Balance-Richtung, Löschen, Geld, Lizenzen): Frage in BERICHT.md unter „Fragen an Enrico“ eintragen. Wenn sie den Rest blockiert, anhalten; sonst mit dem Nächsten weitermachen.
4. Zum Schluss BERICHT.md schreiben (oben einfügen) und im Chat nur kurz melden: „Bericht im Postfach – pb“.
5. AUFTRAG.md nicht verändern, außer erledigte Punkte abzuhaken.

## Regeln für Claude (Berater)
1. Bei **pb**: BERICHT.md frisch lesen, Enrico das Wichtigste in wenigen Sätzen sagen, Entscheidungen als Klickfragen stellen.
2. Neue Aufträge in AUFTRAG.md schreiben (oben), dann Enrico sagen: „Tipp bei Claude Code: pa“.
