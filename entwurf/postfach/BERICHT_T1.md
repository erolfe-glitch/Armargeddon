# Bericht T1 – 23 neue Töne nur in die Auswahl (Punkt 126, 2026-11-27)

- Quellen: `sound-quelle/enrico_2611/` (Namen behalten), per robocopy gesichert.
- 23 neue Plätze `e26_*`, Stille geschnitten, Pegel angeglichen (lvl −15, Spitze höchstens −1 dB). Sie liegen nur in `src/sound_pult.js`; `src/sound.js` ist unverändert.
- An keiner Einheit geändert: Die Einheiten-Zeilen im Pult sind gleich wie vorher, kein `e26_` ist zugeordnet, keine TONWAHL.
- `tonpult.html` neu gebaut (mit dem Arbeitsstand von engine.js aus der laufenden U7-Sitzung; Zeilen unverändert). Pult-Test 93/93. Kein build.py, `tonprobe.html` nicht neu gebaut.

| Datei (.mp3) | Platz | Rubrik › Unterüberschrift | Länge |
|---|---|---|---|
| Riesiges Monsterbrüllen | e26_monster_bruellen | Stimmen und Rufe › Brüllen und Bestien | 3,4 s |
| schweres Monster stampfen | e26_monster_stampfen | Schritte › Schwere Schritte | 5,0 s |
| hydarulik mech schritte zischt | e26_mech_hydraulik | Schritte › Schreiter und Maschinen | 1,5 s |
| sehr schwerer faustschlag | e26_faustschlag | Nahkampf › Metall | 1,2 s |
| metallischer schlag stumpf | e26_metall_stumpf | Nahkampf › Metall | 0,6 s |
| Metall schlägt gegen metal schwer | e26_metall_schwer | Nahkampf › Metall | 1,1 s |
| schwerer streich gegen metall | e26_metall_streich | Nahkampf › Metall | 1,1 s |
| metall schebert gegen metal | e26_metall_schebern | Nahkampf › Metall | 1,7 s |
| schwerter prallen aufeinander | e26_schwerter | Nahkampf › Metall | 0,6 s |
| metallisch schild block | e26_schild_block | Nahkampf › Metall | 0,6 s |
| schnitt mit blut und hand abtrennung | e26_hand_ab | Nahkampf › Fleisch und Blut | 1,3 s |
| schwerer Körper schlägt blutig ein | e26_koerper_blutig | Nahkampf › Fleisch und Blut | 1,6 s |
| blutiger einschlag | e26_blut_einschlag | Nahkampf › Fleisch und Blut | 0,9 s |
| große blutfontäne | e26_blut_fontaene | Nahkampf › Fleisch und Blut | 1,0 s |
| zerquetschendes geräuch mit blut | e26_zerquetschen | Nahkampf › Fleisch und Blut | 1,5 s |
| schwerer einschlag auf metall | e26_pz_einschlag1 | Einschläge › Auf Panzerung und Stein | 2,9 s |
| schwerer einschlag auf metal | e26_pz_einschlag2 | Einschläge › Auf Panzerung und Stein | 2,8 s |
| mittlerer feuerball einschlag | e26_feuerball | Feuer, Gas, Rauch | 2,1 s |
| Anti Panzerkanone | e26_pak | Kanonen und Artillerie | 2,2 s |
| mittlere kanone schießt | e26_kanone_mittel1 | Kanonen und Artillerie | 1,4 s |
| mittlere kanone schießt 2 | e26_kanone_mittel2 | Kanonen und Artillerie | 1,6 s |
| Todesschuss fähigkeit zisch boom | e26_todesschuss | Kanonen und Artillerie | 4,4 s |
| Fahlen Hexen Fähigkeit | e26_fahle_hexe | Fähigkeiten (neue Rubrik) › Fahle | 3,1 s |

## Hinweise
- Neu angelegt: Unterüberschrift „Metall“ unter Nahkampf und Rubrik „Fähigkeiten“.
- Die Länge ist nur gemessen, nicht angehört. Beim Hören besonders prüfen: „schwerter prallen aufeinander“ beginnt erst bei 1,0 s der Quelle (davor nur Leises); „metallischer schlag stumpf“ und „schild block“ sind von 8 s auf 0,6 s gekürzt.
- `entwurf/tonplaetze.json` hatte schon vorher nicht eingecheckte Änderungen aus früheren Ton-Läufen; sie sind in diesem Commit mit drin.
- Der Pult-Test ändert `src/ui.js` kurz und stellt es danach wieder her (parallel zu U7). Die U7-Änderungen sind danach noch vorhanden. Eine U7-Änderung, die genau in diesen wenigen Sekunden gespeichert wurde, wäre aber überschrieben worden – die U7-Sitzung sollte ihre letzte ui.js-Änderung (Stand ca. 16:26) kurz prüfen.
- Die Bilder in `entwurf/probe/tonpult2|3/`, die der Test neu schreibt, sind nicht eingecheckt.
