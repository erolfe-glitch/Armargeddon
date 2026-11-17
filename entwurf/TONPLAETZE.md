# Tonplätze

Welcher Tonplatz welche Datei spielt (Stand 2026-11-16, erzeugt aus `entwurf/tonplaetze.json` von `tools/sound_bau.mjs`). Bei mehreren Tönen je Platz wird zufällig gewählt; Töne mit Seite spielen nur, wenn eine Einheit dieser Seite handelt. „vorhanden“ = Ton war schon im Spiel.


## Grundklang je Fraktion (2026-11-17)

Jede Seite ist am Klang zu erkennen. Alle Einheiten nutzen den Grundklang ihrer Fraktion, außer den Einheiten mit eigenem Ton (unten).

| | Konkordat | Aschenwacht |
|---|---|---|
| Hauptgewehr (Platz `rifle`) | Enfield (Freesound 410442): hell, mit Nachhall | battle-rifle (`rifle2`): trockener (Ausklang −40 dB nach 0,76 s statt 1,1 s), dunkler (ca. 2,0 statt 2,7 kHz) |
| Nahkampf (`nahA` / `nahD`) | Klingen/Bajonett (swords-collide), Keule (trench-club), Fausthiebe (punch 1–3) | Spaten und Metall: heavy-sword-smashes-metal, massive-axe-impact, giant-axe-strike-wood |
| Kampfschrei (`cry` / `scream`) | cry, middle-ages war cry | scream, Crowd-Charge (763940) |
| Befehle | `forward`, `stand` | `roar`, Generalhorn |

**Eigene Töne statt Grundklang:** Scharfschütze und Pirschjäger `sniper` · Panzerbüchse `buechse` · Hauptmann und General `pistol` · Kampfanzüge `semi` (Schuss), `sword` (Nahkampf) · Grabenräumer `axe` + `flinte` · Sturmbrecher Handgranate + `flinte` · Kolosse und Schreiter `cannon`/`panzerkanone`, `heavy`/`impact` · MG `mg` je Seite.

## Alle Tonplätze

| Tonplatz | Wann | Seite | Datei (Ausschnitt) |
|---|---|---|---|
| **rifle** | Hauptgewehr je Seite. Gewehrinfanterie feuert eine Salve: je lebende Figur ein Schuss (1–4), alle aus **derselben** Datei, versetzt innerhalb 0,4 s, leicht andere Tonhöhe und Lautstärke | Konkordat | Infantry Guns/410442__superphat__enfieldrifle.wav (1.6 s ab 0 s) |
|  |  | Aschenwacht | vorhanden (rifle2 = battle-rifle) |
| **rifle2** | (nur noch Quelle des Aschenwacht-Gewehrs) | – | vorhanden (rifle2) |
| **rifle3** | (nicht mehr für Gewehrinfanterie: AK-47 klingt zu modern) | Aschenwacht | vorhanden (rifle3) |
|  |  | beide | 855843__serutonin-deprivd__an-ak-47-being-shot-has-distinctive-metallic-kalashnikov-esque-report-punchy-sounding-w-distant-trailing-reverb.wav (1.8 s ab 0 s) |
| **rifle4** | (nicht mehr für Gewehrinfanterie) | beide | 337773__lubini__street-battle-lviv-ukraine-ww1-reconstruction.wav (1.6 s ab 0.3 s) |
| **sniper** | Scharfschütze, Pirschjäger | beide | vorhanden (sniper) |
|  |  | beide | Infantry Guns/182435__qubodup__sniper-shots-dod-56706-dod-146324.flac (1.46 s ab 1 s) |
|  |  | Konkordat | 816114__qubodup__fps-sniper-shot.wav (1.46 s ab 0 s) |
| **pistol** | Hauptmann, General (Stab) | Aschenwacht | vorhanden (pistol) |
|  |  | Konkordat | 581773__hz37__shoot-1-hza-01-08-2021.wav (1.2 s ab 0.09 s) |
|  |  | Konkordat | dragon-studio-gunshot-511311.mp3 (1.2 s ab 0.03 s) |
|  |  | Konkordat | Infantry Guns/freesound_community-darkscape-1911-a1-101298.mp3 (0.9 s ab 0.06 s) |
| **semi** | Kampfanzüge (Stahlgänger, Panzerknechte) | beide | vorhanden (semi) |
|  |  | Konkordat | 417148__superphat__slowfiringheavyweapon.wav (1.6 s ab 0.05 s) |
| **mg** | MG schießt (Mahlwerk Konkordat / Sensenwerk Aschenwacht) | Konkordat | Infantry Guns/freesound_community-1866-ww1-machine-gun-free-sound-fx-cinematic-sound-effects-94651.mp3 (2.4 s ab 2.6 s) |
|  |  | Konkordat | 417688__superphat__lightmachinegun1.wav (2.12 s ab 1.99 s) |
|  |  | Aschenwacht | vorhanden (mg3) |
|  |  | Aschenwacht | vorhanden (mg2) |
|  |  | Aschenwacht | Infantry Guns/kave_msri-machine-gun-sfx-320986.mp3 (2 s ab 0.06 s) |
| **huelsen** | leise Patronenhülsen nach einer MG-Salve | beide | Infantry Guns/freesound_community-shells-hitting-ground-40-39791.mp3 (1.4 s ab 0.12 s) |
| **buechse** | Panzerbüchsen-Trupp schießt | Aschenwacht | 721431__the_epic1357__new-barrett.mp3 (2.2 s ab 0.04 s) |
| **cannon** | Kanone: Landkoloss, Feldkanone (Konkordat); Abschuss Grabengeschütz (Aschenwacht, mit cannonH gemischt) | Konkordat | vorhanden (cannon) |
|  |  | Konkordat | 850499__vulkanbruder__little-cannon.wav (0.36 s ab 0 s) |
|  |  | Aschenwacht | Heavy firing sounds/239137__qubodup__artillery-gunfire.flac (2.96 s ab 0 s) |
|  |  | Konkordat | Heavy firing sounds/freesound_community-cannon-shot-14799.mp3 (1.55 s ab 0.02 s) |
| **panzerkanone** | Kanone der Aschenwacht-Fahrzeuge (Eisenknecht u. a.) | Aschenwacht | 457044__gerainsan__slow-motion-gun-shot.wav (3 s ab 0.34 s) |
| **cannonH** | Abschuss schwere Artillerie | beide | vorhanden (cannonH) |
|  |  | beide | Water/212689__tb0y298__water-explosion-1.wav (2.5 s ab 0 s) |
| **boomH** | Einschlag schwere Artillerie | beide | vorhanden (boomH) |
|  |  | beide | 511884__audiopapkin__impact-sfx-016.wav (2.2 s ab 0 s) |
| **barrage** | Sperrfeuer der Artillerie | beide | vorhanden (barrage) |
|  |  | beide | Heavy firing sounds/210901__originalmaja__three-cannon-shots.mp3 (4.5 s ab 0.11 s) |
| **launch** | Abschuss Mörser/Minenwerfer | beide | vorhanden (launch) |
|  |  | beide | freesound_community-mortar-96223.mp3 (2.5 s ab 0.04 s) |
| **boom2** | Gerät/Koloss zerstört | beide | vorhanden (boom2) |
|  |  | beide | Canon explode.wav (3 s ab 0 s) |
| **grenade2** | Handgranate, Explosion | beide | vorhanden (grenade2) |
|  |  | Aschenwacht | 609587__unfa__grenade-explosion-sfx-medium-sized-meaty-realistic.flac (1.78 s ab 0 s) |
| **blast** | Sprengladung, Stollen fliegt hoch | beide | Explosionssound.mp3 (3 s ab 0.06 s) |
|  |  | beide | magiaz-grenade_explosion-416962.mp3 (2.32 s ab 2.87 s) |
| **wasser** | Granate schlägt in Kanal, Fluss, Sumpf, Furt ein | beide | Water/519008__sheyvan__water-explosion.wav (2 s ab 0 s) |
| **minigun** | Drehlauf-Waffen | beide | vorhanden (minigun) |
| **flame** | Flammenwerfer | beide | vorhanden (flame) |
|  |  | beide | freesound_community-gas-torch-burn-74271.mp3 (2.5 s ab 0.09 s) |
| **feuer** | Koloss/Kampfmaschine zerstört: brennt | beide | Fire/563765__florianreichelt__fire-auto-car-on-fire.mp3 (5 s ab 0.02 s) |
| **gas** | Gasgranate | beide | vorhanden (gas) |
|  |  | beide | 808013__artninja__tmnt_2012_inspired_smokebomb_sounds_05202025.wav (2.04 s ab 0.12 s) |
| **rauch** | Nebelwand (Rauchwerfer) | beide | 583262__pfranzen__dropping-a-smoke-bomb-on-the-ground.ogg (3 s ab 0 s) |
| **werfer** | Abschuss Rauchwerfer | beide | Heavy firing sounds/49053354-rocket-launcher-307512.mp3 (1.29 s ab 0.13 s) |
| **flinte** | Nahkampf Grabenräumer/Sturmbrecher (kurzer Schuss) | beide | Infantry Guns/freesound_community-shotgun-shooting-things-105837.mp3 (0.8 s ab 0.1 s) |
| **vorbei** | Kugel pfeift vorbei (kaum Wirkung, niedergehalten) | beide | Impacts/dennish18-bullet-passing-by-fast-146492.mp3 (0.8 s ab 0.13 s) |
| **einschlag** | Kugeleinschlag bei Treffer (Gewehr, MG) | beide | Impacts/u_68csiaifb5-bulletimpact1-442717.mp3 (0.6 s ab 0.06 s) |
|  |  | beide | Impacts/u_68csiaifb5-bulletimpact2-442718.mp3 (0.58 s ab 0.09 s) |
| **einsturz** | Gebäude, Bunker, Ruine zerstört | beide | Explosion/shrek_30-building-demolished-472876.mp3 (3.5 s ab 11.9 s) |
|  |  | beide | Explosion/magiazzz-massive-building-548236.mp3 (3.5 s ab 0.01 s) |
| **gasmaske** | Entgiften (Gasschutz-Trupp) | beide | 256519__kodack__mask-breathing-sound.wav (2.5 s ab 0.05 s) |
|  |  | beide | 536372__hoggington__mask-grunt-sound.ogg (0.58 s ab 0.05 s) |
| **selGas** | Gasschutz-Trupp angewählt | beide | 543010__awesometrainmaster1__mask-breathing-for-killer-or-other.ogg (1.8 s ab 0 s) |
| **pain** | Schmerz bei schweren Treffern | beide | vorhanden (pain) |
|  |  | Konkordat | Pain death/131710__oldedgar__male-being-impaledbeaten-ac.wav (1.3 s ab 0.67 s) |
|  |  | Konkordat | Voices/338146__artordie__scream-augh.wav (1.45 s ab 0.01 s) |
|  |  | beide | 559975__starkvind__man-dies.wav (0.65 s ab 0.06 s) |
|  |  | Aschenwacht | 695389__fmaudio__male-death-cry-6.wav (0.93 s ab 0.01 s) |
|  |  | Konkordat | applehillstudios-hurt-amp-death-pain-groin-5-543683.mp3 (1.6 s ab 0.11 s) |
| **medic** | „I need a medic“ bei schweren Treffern | beide | vorhanden (medic) |
| **panic** | Einheit flieht | beide | vorhanden (panic) |
|  |  | beide | freesound_community-033205_human-male-scream-small-crowd-panic-fearmp3-76274.mp3 (2.5 s ab 0.12 s) |
| **charge** | Gegenstoß der Aschenwacht (Ruf) | Aschenwacht | Moving tanks/233068__newciv1__loud-tiger-ii-audio-test.wav (2.4 s ab 0.04 s) |
| **forward** | Sturmbefehl (Konkordat) | Konkordat | vorhanden (forward) |
|  |  | Konkordat | applehillstudios-combat-voice-charge-2-543675.mp3 (0.67 s ab 0.06 s) |
| **stand** | Sammeln (Konkordat) | Konkordat | vorhanden (stand) |
|  |  | Konkordat | 458070__theuncertainman__form-ranks-british-warrior.wav (1.01 s ab 0.47 s) |
| **comeon** | Befehl überbringen (Meldegänger) | beide | vorhanden (comeon) |
| **select** | Einheit angewählt (Stimme je Seite; nur etwa jedes 3. Mal, mind. 8 s Pause, leiser) | Konkordat | 402019__theuncertainman__yes-british-male.wav (0.55 s ab 0.5 s) |
|  |  | Aschenwacht | 338147__artordie__talking-to-me.wav (1.1 s ab 0.01 s) |
| **roar** | Kampfschrei (Nahkampf, Befehl der Aschenwacht) | beide | vorhanden (roar) |
|  |  | beide | jesuschristisgod-army-of-soldiers-battle-cry-322709.mp3 (3 s ab 0.54 s) |
|  |  | Konkordat | 764158__shangusburger__crwdbatl_crowd-yells-charge-continues_shanevincent_gsc24_msdec-mkh435-spirit.wav (2.6 s ab 0.51 s) |
| **scream** | Kampfschrei Aschenwacht (Nahkampf) | Aschenwacht | vorhanden (scream) |
|  |  | Aschenwacht | 763940__shangusburger__crwdbatl_crowd-yells-charge-continues_shanevincent_gsc24_bin-ambeovr.wav (2.6 s ab 0.51 s) |
| **cry** | Kampfschrei Konkordat (Nahkampf, Sturmangriff) | Konkordat | vorhanden (cry) |
|  |  | beide | Voices/freesound_community-middle-ages-war-crywav-14780.mp3 (1.18 s ab 0.12 s) |
| **marschtritt** | Befehl „Marsch“ | beide | Ereignisse/naeftali-march2-137357.mp3 (3 s ab 0.02 s) |
| **generalhorn** | Aschenwacht „Generalangriff“ | Aschenwacht | Ereignisse/trading_nation-low-horn-185556.mp3 (4 s ab 0.67 s) |
| **march** | Schlachtbeginn, Verstärkung (Pfeife Konkordat, Horn Aschenwacht) | beide | vorhanden (march) |
|  |  | Konkordat | 324539__deleted_user_2104797__whistle-army-old.wav (3 s ab 0.28 s) |
|  |  | Aschenwacht | freesound_community-horn-a-37752.mp3 (3 s ab 0.16 s) |
|  |  | beide | alex_jauk-whistle-sound-600668.mp3 (0.96 s ab 0.03 s) |
| **erobert** | Zielfeld erobert | Aschenwacht | 405513__zagi2__warfare-snare-drum.wav (3 s ab 0.12 s) |
|  |  | Konkordat | Win Point 2.wav (1.32 s ab 0 s) |
| **verloren** | eigenes Zielfeld verloren (gegen die KI) | beide | Lost Point.wav (2.61 s ab 0 s) |
| **dog** | Meldegänger mit Hund zieht | beide | vorhanden (dog) |
|  |  | beide | Animals/audiopapkin-german-shepherd-barking-302356.mp3 (1.3 s ab 0.04 s) |
|  |  | beide | Animals/spinopel-german-shepherd-barking-321489.mp3 (1.3 s ab 0.19 s) |
| **gallop2** | Reiter ziehen | beide | vorhanden (gallop2) |
|  |  | beide | Pferdegalopp.mp3 (3 s ab 0.25 s) |
| **steps** | Fußtruppen im Schlamm | beide | vorhanden (steps) |
|  |  | beide | freesound_community-footsteps-mud-68694.mp3 (2.5 s ab 0.17 s) |
| **stepsWald** | Fußtruppen im Wald und Gebüsch | beide | 478389__elonen__pine-forest-ww2-soldier-walk-twigs.wav (2.5 s ab 0 s) |
| **mech** | Kampfmaschinen ziehen | beide | vorhanden (mech) |
| **tank** | Landkoloss fährt | beide | vorhanden (tank) |
|  |  | beide | vorhanden (tankmove) |
|  |  | beide | Moving tanks/freesound_community-driving-tank-engine-88503.mp3 (3 s ab 0.04 s) |
| **crash** | Panne, Festfahren | Aschenwacht | vorhanden (crash) |
|  |  | Konkordat | 423116__ogsoundfx__guns-explosions-album-heavy-object-impact-4.wav (1.38 s ab 0 s) |
|  |  | beide | freesound_community-crashing-6429.mp3 (2.5 s ab 0.15 s) |
| **smash** | Bohrkoloss schlägt zu | beide | vorhanden (smash) |
|  |  | Aschenwacht | 509004__audiopapkin__mechanical-sfx_m023.wav (2.5 s ab 0 s) |
| **heavy** | Nahkampf der Kampfmaschinen | beide | vorhanden (heavy1) |
|  |  | beide | vorhanden (heavy2) |
|  |  | beide | vorhanden (heavy3) |
|  |  | beide | mixkit-heavy-sword-smashes-metal-2795.wav (1.07 s ab 0.07 s) |
|  |  | Aschenwacht | 509007__audiopapkin__mechanical-sfx_m013.wav (2.5 s ab 0 s) |
| **armor** | Treffer auf Panzerung | beide | vorhanden (armor) |
|  |  | beide | mixkit-metallic-sword-strike-2160.wav (0.66 s ab 0.01 s) |
|  |  | beide | daviddumaisaudio-grenade-explosion-14-190266.mp3 (1.8 s ab 0.02 s) |
| **impact** | Koloss im Nahkampf | Konkordat | vorhanden (impact) |
| **slash** | Klinge (Räumer, Grabenkämpfer, Reiter) | Aschenwacht | vorhanden (slash) |
| **sword** | Kampfanzüge im Nahkampf (Stahlgänger, Panzerknechte) | beide | vorhanden (sword) |
|  |  | beide | yodguard-giant-axe-strike-hitting-solid-wood-2-450250.mp3 (0.58 s ab 0.01 s) |
|  |  | Konkordat | universfield-punch-with-male-scream-121575.mp3 (0.55 s ab 0.29 s) |
| **axe** | Grabenräumer (dazu Flinte) | beide | vorhanden (axe) |
|  |  | beide | 392973__morganpurkis__trench-club-2.wav (0.92 s ab 0 s) |
| **robot** | Kampfmaschine getroffen | Konkordat | vorhanden (robot) |
| **heal** | Sanitäter versorgen | beide | vorhanden (heal) |
|  |  | beide | floraphonic-duct-tape-3-183995.mp3 (2 s ab 0.07 s) |
| **reparieren** | Bergen, Instandsetzen (Werkstatt, Pioniere) | Aschenwacht | 492434__firetie__ppsh-weapon-bolt-carrier-loading-4.ogg (0.73 s ab 0.11 s) |
|  |  | Konkordat | 591529__rudmer_rotteveel__ratchet-wrench-fast-multiple.wav (2 s ab 0 s) |
| **nachladen** | Nachladen (Munitionsträger) | Konkordat | Repair reload heal etc/847367__adrian_sommer__gun-reloading-walther-p99.wav (0.58 s ab 1.82 s) |
|  |  | Aschenwacht | Repair reload heal etc/u_azd0z4ksl5-kar98_rechamber-506178.mp3 (0.58 s ab 0.35 s) |
| **husten** | Gasschaden: 1–2 Figuren husten (Dateien folgen) | beide | (noch leer) |
| **drahtwackeln** | Draht wackelt beim Betreten | beide | Repair reload heal etc/freesound_community-shaking-chain-link-fence-vibration-94438.mp3 (1.2 s ab 0.12 s) |
| **drahtlatch** | Einheit läuft in Stacheldraht | beide | Repair reload heal etc/freesound_community-latch-metallic-43692.mp3 (0.7 s ab 0.04 s) |
| **cut** | Draht schneiden | beide | vorhanden (cut) |
|  |  | beide | freesound_community-cutting-clipping-wire-copper-80373.mp3 (0.18 s ab 1.45 s) |
| **clank** | Aufprotzen, MG aufbauen/abbauen | beide | vorhanden (clank) |
|  |  | beide | freesound_community-tank-reload-47828.mp3 (0.47 s ab 0.09 s) |
| **mgsetup** | MG aufbauen (Ruf, Konkordat) | Konkordat | 800863__tyranttim__soldier-guns_up.wav (0.71 s ab 0.11 s) |
| **tick** | Sprengsatz/Stollen/Mine legen (Ticken) | beide | Ereignisse/320862__urupin__old-watch-in-a-small-antique-shop.flac (1.6 s ab 1.17 s) |
| **bauen** | Befestigung bauen: Draht ziehen, Stollen, Mine (leise) | beide | 675138__craigsmith__s17-03-hand-to-hand-battle-with-yelling-and-armor-noise-many-voices.wav (2.5 s ab 1.5 s) |
| **ui** | Klick auf Knöpfe | beide | 488534__ranner__ui-click.wav (0.35 s ab 0.21 s) |
|  |  | beide | 677861__el_boss__ui-button-click.wav (0.05 s ab 0 s) |
|  |  | beide | 117651__jppi_stu__sw_switchoffon.wav (0.6 s ab 0.3 s) |
| **ambient** | Hintergrund (Schleife, zufällig eine) | beide | vorhanden (ambient) |
|  |  | beide | armed_unit-distant-war-377958.mp3 (45 s ab 14.04 s) |
| **wetter** | Regen und Donner (Schleife, leise) | beide | Ambience/447809__florianreichelt__light-rain-and-thunder.wav (30 s ab 0 s) |
| **musikTitel** | Startmenü (Schleife) | beide | 744062__xloenp__heroic-war-march-symphony-loop-2.flac (104.73 s ab 0 s) |
| **musikNiederlage** | nach einer verlorenen Schlacht | beide | 693767__composingatnight__taps-for-the-fallen.wav (62.19 s ab 0.11 s) |
