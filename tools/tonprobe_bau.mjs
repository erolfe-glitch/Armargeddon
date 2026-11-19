// Baut tonprobe.html (Hauptordner, über GitHub Pages online): alle Töne, die das Spiel nutzt, nach Gruppen, mit Dateinamen,
// Spiel-Lautstärken und Stimmfiltern wie im Spiel, dazu Mischproben und die Regler Musik/Effekte (gleiche Speicherplätze wie das Spiel).
// Die Töne selbst lädt die Seite aus src/sound.js (wird nicht kopiert).
// Aufruf: node tools/tonprobe_bau.mjs   – nach jedem Lauf von tools/sound_bau.mjs neu bauen.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const E = require(join(ROOT, 'src', 'engine.js'));

// Töne und Plätze aus src/sound.js (ohne Daten), Kopfkommentar für die älteren Töne
const src = readFileSync(join(ROOT, 'src', 'sound.js'), 'utf8');
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx);
const POOLS = ctx.SOUND_POOLS, KEYS = new Set(Object.keys(ctx.SOUNDS));
const kopf = src.slice(0, src.indexOf('(function (root)'));
const rows = JSON.parse(readFileSync(join(ROOT, 'entwurf', 'tonplaetze.json'), 'utf8'));
const info = {}; for (const r of rows) if (r.key && r.key !== '–' && !info[r.key]) info[r.key] = r;
const altBeschr = k => { const m = kopf.match(new RegExp('(?:^|[\\s·,(])' + k + '(?: =)? ([^·,\\n(]{3,60})', 'm')); return m ? m[1].trim() : ''; };
const datei = k => { const r = info[k]; if (r && r.f && !r.f.startsWith('(')) return r.f; return `älterer Ton „${k}“${altBeschr(k) ? ' – ' + altBeschr(k) : ''} (vor 2026-11-16 eingebettet)`; };

// Spiel-Lautstärken je Platz (aus src/ui.js: playSound-Aufrufe, selectVoice, motorRev, Kulisse, Musik)
const VOL = { rifle: 0.3, rifle2: 0.3, rifle3: 0.3, rifle4: 0.3, sniper: 0.6, pistol: 0.6, semi: 0.6, mg: 0.55, minigun: 0.55, buechse: 0.6, cannon: 0.6, kolosskanone: 0.6, panzerkanone: 0.6,
  cannonH: 0.8, launch: 0.42, flame: 0.6, werfer: 0.55, flinte: 0.5, grenade: 0.6, grenade2: 0.6, nahA: 0.45, nahD: 0.45, saebel: 0.55, sword: 0.55, axe: 0.55, slash: 0.55, smash: 0.55, heavy: 0.7,
  boomH: 0.5, einschlagH: 0.8, barrage: 0.7, gas: 0.7, boom: 0.45, boom2: 0.75, blast: 0.8, wasser: 0.6, rauch: 0.5, vorbei: 0.35, einschlag: 0.35, einsturz: 0.7, impact: 0.7, armor: 0.6, feuer: 0.35,
  tank: 0.3, mech: 0.5, crash: 0.65, ueberrollen: 0.5, holzknacken: 0.5, drahtlatch: 0.5, drahtwackeln: 0.4, motor_auswahl: 0.13, snarl: 0.4, tiger: 0.4, gespann: 0.5, wagenknarren: 0.3,
  schritte: 0.5, steps: 0.5, stepsWald: 0.5, marschtritt: 0.38, dog: 0.5, gallop2: 0.55, pferd_auswahl: 0.26, pferd_unruhe: 0.5, neigh: 0.35, cut: 0.7, clank: 0.6, mgsetup: 0.5, bauen: 0.35,
  heal: 0.5, reparieren: 0.6, nachladen: 0.55, gasmaske: 0.5, klick: 0.3, ui: 0.3, tick: 0.45, zug_eigen: 0.35, zug_gegner: 0.35, erobert: 0.55, verloren: 0.55, whistle: 0.4, march: 0.45,
  generalhorn: 0.5, horn: 0.5, win: 0.6, pain: 0.45, medic: 0.45, forward: 0.45, stand: 0.45, roar: 0.45, cry: 0.4, scream: 0.4, panic: 0.4, charge: 0.6, comeon: 0.45, husten: 0.4, grunzen: 0.4,
  robot: 0.5, ambient: 0.22, wetter: 0.12, musik_titel: 0.34, musik_schlacht: 0.13, musikNiederlage: 0.32, abprotzen: 0.6, schaufel: 0.4, atmen: 0.3, getuemmel: 0.3, mgladen: 0.45, leuchtschuss: 0.5, leuchtbrand: 0.22, loewe: 0.6,
  glocke: 0.42, glocke_fern: 0.1, glocke_fall: 0.6, kraehe: 0.14, wind: 0.1 };   // Sankt Ruß (2026-11-19, ui.js ORT_KULISSE/ORT_GLOCKE)
// Stimmen lauter wie im Spiel (ui.js STIMM_PL/STIMM_VOL, Tonprobe 2026-11-18); Fahrzeuge werden unter einer Stimme auf DUCK_F abgesenkt
const STIMM_VOL = 1.45, DUCK_F = 0.4, SPRUCH = +(0.34 * STIMM_VOL).toFixed(2), zahlN = v => String(v).replace(".", ",");
for (const k of ['loewe', 'atmen', 'pain', 'medic', 'cry', 'scream', 'roar', 'panic', 'forward', 'stand', 'charge', 'comeon', 'robot', 'husten', 'grunzen']) VOL[k] = Math.min(1, +(VOL[k] * STIMM_VOL).toFixed(2));
const MUSIK = ['musik_titel', 'musik_schlacht', 'musikNiederlage'], SCHLEIFE = ['ambient', 'wetter', 'wind', ...MUSIK];
const NAME = { rifle: 'Hauptgewehr (Salve)', rifle2: 'Gewehr 2', rifle3: 'Gewehr 3', rifle4: 'Gewehr 4', sniper: 'Scharfschütze', pistol: 'Pistole (Anführer)', semi: 'Halbautomat (Kampfanzüge)', mg: 'Maschinengewehr',
  minigun: 'Drehlauf (Eisenknecht)', buechse: 'Panzerbüchse', cannon: 'Kanone', kolosskanone: 'Koloss-/Schreiterkanone', panzerkanone: 'Sturmpanzer-Kanone', cannonH: 'Abschuss schwere Artillerie',
  launch: 'Abschuss Mörser/Minenwerfer', flame: 'Flammenwerfer', werfer: 'Werfer', flinte: 'Flinte', grenade: 'Handgranate', grenade2: 'Handgranate 2', nahA: 'Nahkampf Konkordat', nahD: 'Nahkampf Aschenwacht',
  saebel: 'Säbel (Reiter)', sword: 'Klinge (Kampfanzüge)', axe: 'Axt (Räumer)', slash: 'Klinge', smash: 'Bohrkoloss schlägt', heavy: 'Schwerer Treffer (Kampfmaschinen)', boomH: 'Einschlag schwere Artillerie (boomH_1 auch Granateinschlag)',
  einschlagH: 'Einschlag Einzelschuss Artillerie', barrage: 'Sperrfeuer', gas: 'Gas- und Rauchgeschoss', boom: 'Granateinschlag', boom2: 'Gerät zerstört', blast: 'Sprengung', wasser: 'Einschlag im Wasser', rauch: 'Gas-/Nebelhandgranate (noch nicht im Spiel)',
  vorbei: 'Kugel vorbei', einschlag: 'Kugeleinschlag', einsturz: 'Einsturz', impact: 'Treffer auf Gebäude/Stein', armor: 'Treffer auf Panzerung', feuer: 'Brennendes Feld (Schleife)', tank: 'Kettenrollen',
  mech: 'Maschinenschritte (Schreiter)', crash: 'Panne/Festfahren', ueberrollen: 'Überrollen', holzknacken: 'Holzknacken (Wald)', drahtlatch: 'Draht klirrt', drahtwackeln: 'Draht wackelt',
  motor_auswahl: 'Motor beim Anklicken', tiger: 'Brüllen (Klauenschreiter)', gespann: 'Gespann', wagenknarren: 'Wagen knarrt', schritte: 'Schritte', steps: 'Schlammschritte',
  stepsWald: 'Schritte im Wald', marschtritt: 'Marschtritt', dog: 'Hund (Meldegänger)', gallop2: 'Galopp', pferd_auswahl: 'Pferd beim Anklicken', pferd_unruhe: 'Pferd unruhig', neigh: 'Wiehern',
  cut: 'Draht schneiden', clank: 'Aufprotzen', schaufel: 'Schaufel (Eingraben)', atmen: 'Schweres Atmen (Eingraben)', getuemmel: 'Nahkampf-Getümmel (Schleife)', mgladen: 'MG aufstellen (Verschluss)', leuchtschuss: 'Leuchtpistole (Ziel markieren)', leuchtbrand: 'Leuchtkugel brennt (leise, blendet aus)', loewe: 'Löwengebrüll Kreuzschreiter (Test)', abprotzen: 'Abprotzen (Platzhalter)', mgsetup: 'MG aufbauen', bauen: 'Bauen/Eingraben', heal: 'Sanitäter', reparieren: 'Reparieren', nachladen: 'Nachladen', gasmaske: 'Gasmaske (_1 Atmen beim Entgiften, _2 Laut bei Treffer)',
  klick: 'Klick (Nächste Einheit, Erledigt)', ui: 'Knopf', tick: 'Tick', zug_eigen: 'Rundenschild: eigener Zug', zug_gegner: 'Rundenschild: Gegnerzug', erobert: 'Zielfeld erobert', verloren: 'Zielfeld verloren',
  whistle: 'Pfeife', march: 'Marsch/Verstärkung', generalhorn: 'Horn Generalangriff', horn: 'Signalhorn', win: 'Sieg', pain: 'Schmerz', medic: '„Sanitäter!“', forward: 'Befehl „Vorwärts“', stand: 'Befehl „Haltet stand“',
  roar: 'Kampfschrei/Befehl Aschenwacht', cry: 'Schrei', scream: 'Kampfschrei', panic: 'Panik/Flucht', charge: 'Gegenstoß', comeon: 'Befehl überbringen', husten: 'Husten (Gas)', grunzen: 'Grunzen (leichte Verletzung)',
  robot: 'Maschine getroffen', ambient: 'Gefechtslärm (Schleife)', wetter: 'Wetter (Schleife)', musik_titel: 'Titelmusik', musik_schlacht: 'Schlachtmusik', musikNiederlage: 'Niederlage',
  glocke: 'Kirchenglocke zum Rundenbeginn (Sankt Ruß)', glocke_fern: 'Ferne Glocke (Kulisse Sankt Ruß, ganz selten)', glocke_fall: 'Glocke schlägt beim Einsturz auf', kraehe: 'Krähen (Kulisse Sankt Ruß)', wind: 'Wind in den Ruinen (Schleife, Sankt Ruß)' };
const GRUPPEN = [
  ['waffen', 'Waffen', ['rifle', 'rifle2', 'rifle3', 'rifle4', 'sniper', 'pistol', 'semi', 'mg', 'minigun', 'buechse', 'flinte', 'cannon', 'kolosskanone', 'panzerkanone', 'cannonH', 'launch', 'flame', 'werfer', 'grenade', 'grenade2', 'nahA', 'nahD', 'getuemmel', 'saebel', 'sword', 'axe', 'slash', 'smash', 'heavy']],
  ['einschlaege', 'Einschläge', ['einschlag', 'vorbei', 'boom', 'boomH', 'einschlagH', 'barrage', 'gas', 'rauch', 'boom2', 'blast', 'wasser', 'einsturz', 'glocke_fall', 'impact', 'armor', 'feuer']],
  ['fahrzeuge', 'Fahrzeuge und Schreiter', ['tank', 'motor_auswahl', 'mech', 'crash', 'ueberrollen', 'drahtlatch', 'drahtwackeln', 'tiger']],
  ['truppen', 'Truppen, Pferde, Handgriffe', ['schritte', 'steps', 'stepsWald', 'holzknacken', 'marschtritt', 'dog', 'gallop2', 'pferd_auswahl', 'pferd_unruhe', 'neigh', 'gespann', 'wagenknarren', 'cut', 'clank', 'abprotzen', 'mgsetup', 'mgladen', 'schaufel', 'bauen', 'heal', 'reparieren', 'nachladen', 'gasmaske']],
  ['oberflaeche', 'Oberfläche und Knöpfe', ['klick', 'ui', 'leuchtschuss', 'leuchtbrand', 'tick', 'zug_eigen', 'zug_gegner', 'erobert', 'verloren', 'whistle', 'march', 'generalhorn', 'horn', 'win']],
  ['musik', 'Musik und Kulisse', ['musik_titel', 'musik_schlacht', 'musikNiederlage', 'ambient', 'wetter']],
  ['sanktruss', 'Sankt Ruß', ['glocke', 'glocke_fern', 'kraehe', 'wind']]];
// Platz → Schlüssel mit Seite; ältere Einzeltöne ohne Platz als eigener Platz
const eintraege = p => POOLS[p] ? POOLS[p].map(([k, s, w]) => ({ k, s: s || '', w: w || 1, f: datei(k) })) : KEYS.has(p) ? [{ k: p, s: '', w: 1, f: datei(p) }] : [];
const platz = p => ({ p, name: NAME[p.replace(/_(gm|gs|bf|mr)$/, '')] || p, vol: VOL[p.replace(/_(gm|gs|bf|mr)$/, '')] ?? 0.6, loop: SCHLEIFE.includes(p), musik: MUSIK.includes(p), t: eintraege(p) });
const gruppen = GRUPPEN.map(([id, titel, ps]) => ({ id, titel, plaetze: ps.map(platz).filter(x => x.t.length) }));
// Stimmen: Sprüche beim Anklicken je Sprecher-Gruppe und Seite (feste Stimme je Einheit), Rufe je Stimmfilter
const PANZER = ['koloss', 'sturmpz', 'bohrer'];
const satzVon = t => { const T = E.TYPES[t]; return PANZER.includes(t) ? 'panzer' : T.cls === 'walker' ? 'schreiter' : T.suit ? 'anzug' : T.cmd ? 'fuehrer' : 'inf'; };
const SATZ = { inf: 'Fußtruppen, Reiter, Geschütze – Gasmaske leicht', anzug: 'Kampfanzüge – Gasmaske mittel', fuehrer: 'Hauptmann und General – ohne Filter', panzer: 'Panzerbesatzung – Bordfunk stark', schreiter: 'Schreiter und Eisenknecht – Maschine mittel (Aschenwacht: kurzer Nachhall)' };
const stimmen = ['A', 'D'].map(sd => ({ sd, seite: sd === 'A' ? 'Konkordat' : 'Aschenwacht', saetze: Object.keys(SATZ).map(satz => {
  const einheiten = E.ROSTER[sd].filter(t => satzVon(t) === satz).map(t => E.TYPES[t].name + (E.isMech && E.isMech(t) ? ' (Kampfmaschine)' : ''));
  const st = []; for (let n = 1; POOLS[`sv_${satz}_${sd}${n}`]; n++) st.push({ n, p: `sv_${satz}_${sd}${n}`, t: eintraege(`sv_${satz}_${sd}${n}`) });
  return { satz, titel: SATZ[satz], einheiten, stimmen: st }; }).filter(x => x.stimmen.length) }));
const RUFE = ['loewe', 'atmen', 'pain', 'medic', 'cry', 'scream', 'panic', 'forward', 'stand', 'roar', 'charge', 'comeon', 'husten', 'grunzen', 'robot'];
const rufe = [['', 'Anführer – ohne Filter'], ['gm', 'Fußtruppen – Gasmaske leicht'], ['gs', 'Kampfanzüge – Gasmaske mittel'], ['bf', 'Panzerbesatzung – Bordfunk stark'], ['mr', 'Schreiter, Eisenknecht – Maschine mittel']]
  .map(([v, titel]) => ({ v, titel, plaetze: RUFE.map(r => v ? (POOLS[r + '_' + v] ? platz(r + '_' + v) : null) : (r !== 'robot' && r !== 'loewe' && r !== 'grunzen' && r !== 'husten' && r !== 'atmen' ? platz(r) : null)).filter(x => x && x.t.length) })).filter(x => x.plaetze.length);
const DATA = { gruppen, stimmen, rufe, pools: POOLS, stand: new Date().toISOString().slice(0, 10) };

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Armargeddon – Tonprobe</title>
<style>
:root { --bg: #221B18; --panel: #322923; --rust: #66483A; --text: #F0EDE1; --parch: #BBA583; --brass: #C2A461; --life: #8E2B22; --friend: #7D8471; --ink: #120D0B; --dim: #b9ad97; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 17px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; }
header { background: var(--panel); border-bottom: 3px solid var(--rust); padding: 10px 16px; box-shadow: 0 3px 0 var(--ink); }
h1 { margin: 0 0 4px; font: 700 22px Georgia, "Times New Roman", serif; letter-spacing: .06em; text-transform: uppercase; }
#status { font-size: 15px; color: var(--dim); }
.regler { display: grid; grid-template-columns: auto 1fr 3.2em; gap: 6px 10px; align-items: center; margin-top: 8px; }
.regler input { width: 100%; height: 40px; accent-color: var(--brass); }
.regler b { text-align: right; font-variant-numeric: tabular-nums; }
.leiste { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
main { padding: 8px 16px 80px; max-width: 980px; margin: 0 auto; }
details { background: var(--panel); border: 2px solid var(--rust); border-radius: 6px; margin: 12px 0; box-shadow: 0 3px 0 var(--ink); }
summary { cursor: pointer; padding: 14px 16px; font: 700 19px Georgia, serif; letter-spacing: .04em; min-height: 52px; list-style-position: inside; }
details details { margin: 8px 0; background: #2a221d; }
details details summary { font-size: 17px; padding: 12px 14px; min-height: 48px; }
.inhalt { padding: 4px 10px 12px; }
@media (max-width: 600px) { main { padding: 8px 8px 90px; } .inhalt { padding: 4px 6px 10px; } summary { padding: 12px 10px; } }
.platz { margin: 12px 0 4px; font-weight: 700; color: var(--parch); }
.platz small { font-weight: 400; color: var(--dim); }
.hinweis { color: var(--dim); font-size: 15px; margin: 4px 0 8px; }
button { font: inherit; color: var(--text); background: #3d322a; border: 2px solid var(--rust); border-radius: 6px; padding: 10px 14px; min-height: 52px; cursor: pointer; text-align: left; box-shadow: 0 2px 0 var(--ink); }
button:active, button.an { background: #5a4630; border-color: var(--brass); }
button:disabled { opacity: .45; }
.knopf { display: grid; grid-template-columns: 28px 1fr; gap: 0 10px; align-items: center; width: 100%; margin: 6px 0; }
.knopf .sym { grid-row: span 2; font-size: 24px; text-align: center; color: var(--brass); }
.knopf .titel { font-weight: 700; }
.knopf .datei { font-size: 14px; color: var(--dim); overflow-wrap: anywhere; font-family: ui-monospace, Consolas, monospace; }
.seite { display: inline-block; font-size: 13px; font-weight: 700; padding: 1px 7px; border-radius: 3px; margin-left: 6px; vertical-align: 2px; color: var(--text); }
.seite.A { background: var(--life); } .seite.D { background: var(--friend); color: var(--ink); } .seite.b { background: #4b4038; }
.misch { display: grid; gap: 8px; }
.misch button { width: 100%; font-weight: 700; }
.misch button small { display: block; font-weight: 400; color: var(--dim); font-size: 14px; }
.haupt { background: var(--brass); color: var(--ink); border-color: var(--ink); font-weight: 700; }
#stopp { position: fixed; right: 16px; bottom: 16px; z-index: 9; min-height: 60px; padding: 12px 20px; font-size: 18px; box-shadow: 0 3px 0 var(--ink), 0 0 0 3px rgba(18,13,11,.6); }
@media (min-width: 760px) { .reihe { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; } .misch { grid-template-columns: 1fr 1fr; } }
</style></head>
<body>
<header>
  <h1>Armargeddon · Tonprobe</h1>
  <div id="status">Töne werden geladen (ca. 21 MB) …</div>
  <div class="regler">
    <label for="volMusik">Musik</label><input id="volMusik" type="range" min="0" max="100" step="1"><b id="volMusikW"></b>
    <label for="volEffekte">Effekte</label><input id="volEffekte" type="range" min="0" max="100" step="1"><b id="volEffekteW"></b>
  </div>
  <div class="leiste"><button id="streuung" class="an">Tonhöhe streuen wie im Spiel</button></div>
</header>
<button id="stopp" class="haupt">■ Stopp</button>
<main id="main"></main>
<script>
const D = ${JSON.stringify(DATA)};
// ---- Abspielen wie im Spiel (src/ui.js: playSound, sndPick, motorRev, setMusik) ----
let SND = null, musikVol = 0.8, effektVol = 1, streuen = true; const laufend = new Set();
try { const m = localStorage.getItem('arm.musikvol'), f = localStorage.getItem('arm.effektvol'); if (m != null && m !== '') musikVol = +m; if (f != null && f !== '') effektVol = +f; } catch (e) {}
const SND_VAR = { cry: ['cry', 'scream'], grenade: ['grenade2'], axe: ['axe', 'slash'], punch: ['punch1', 'punch2', 'punch3', 'swords'], artD: ['cannonH', 'cannon'], boom: ['boomH_1'] };
const DUCK_F = ${DUCK_F}, SPRUCH = ${SPRUCH}, VOL_ATMEN = ${VOL.atmen}, VOL_CRY = ${VOL.cry};
function duck(fz, a) { if (!fz || !a) return; const ein = () => { const d = isFinite(a.duration) && a.duration > 0 ? a.duration * 1000 : 1800; fz.volume = Math.min(1, fz._vol * effektVol * DUCK_F); nach(d + 150, () => { try { fz.volume = Math.min(1, fz._vol * effektVol); } catch (e) {} }); }; if (a.readyState >= 1) ein(); else a.addEventListener('loadedmetadata', ein, { once: true }); }
function pick(name, side, v) {   // wie sndPick im Spiel: Gruppe, Stimmfilter-Variante, Seite
  const cand = [], add = (n, deep) => { if (!deep && SND_VAR[n]) { for (const m of SND_VAR[n]) add(m, true); return; } if (v && D.pools[n + '_' + v]) n += '_' + v;
    if (D.pools[n]) for (const [k, sd, w] of D.pools[n]) { if (SND[k]) for (let i = 0; i < (w || 1); i++) cand.push([k, sd]); } else if (SND[n]) cand.push([n, null]); };
  add(name); const own = cand.filter(c => !c[1] || c[1] === side), list = own.length ? own : cand.filter(c => !c[1]);
  return list.length ? list[Math.floor(Math.random() * list.length)][0] : null; }
function spiel(k, vol, o = {}) {   // vol = Spiel-Lautstärke vor dem Regler
  if (!SND || !SND[k]) return null; const a = new Audio(SND[k]); a.preservesPitch = false;
  const regler = o.musik ? musikVol : effektVol; a._vol = vol; a._musik = !!o.musik; a.volume = Math.min(1, vol * regler);
  a.playbackRate = o.rate || (streuen && !o.musik && !o.loop ? 0.94 + Math.random() * 0.12 : 1); a.loop = !!o.loop;
  laufend.add(a); a.addEventListener('ended', () => laufend.delete(a)); a.play().catch(() => {});
  if (o.dur) { let n = 0; setTimeout(function aus() { n++; try { a.volume = Math.max(0, a.volume * (1 - n / 5)); } catch (e) {} if (n < 5) setTimeout(aus, 12); else { a.pause(); laufend.delete(a); } }, o.dur); }
  return a; }
function platzSpiel(p, vol, side, o) { const k = pick(p, side, o && o.v); return k ? spiel(k, vol, o) : null; }
function motorRev(k, V, Dauer) {   // Motor kurz aufheulen wie im Spiel: ein-/ausblenden, Tonhöhe 0,8 → 1,2
  if (!SND[k]) return; const a = new Audio(SND[k]); a.preservesPitch = false; a.volume = 0; a.playbackRate = 0.8; laufend.add(a); a.play().catch(() => {}); const t0 = performance.now();
  (function tick() { const t = (performance.now() - t0) / 1000; if (t > Dauer || !laufend.has(a)) { a.pause(); laufend.delete(a); return; }
    try { a.volume = Math.min(1, V * effektVol * Math.min(1, t / 0.08) * Math.min(1, Math.max(0, (Dauer - t) / (Dauer * 0.36)))); a.playbackRate = 0.8 + 0.4 * Math.min(1, t / (Dauer * 0.4)); } catch (e) {}
    setTimeout(tick, 30); })(); }
const nach = (ms, f) => { const id = setTimeout(f, ms); zeiten.push(id); }; let zeiten = [];
function stoppAlles() { for (const a of laufend) try { a.pause(); } catch (e) {} laufend.clear(); zeiten.forEach(clearTimeout); zeiten = []; if (gefecht) { clearInterval(gefecht); gefecht = null; } document.querySelectorAll('button.an[data-schleife]').forEach(b => b.classList.remove('an')); }
// ---- Mischproben (Abläufe und Lautstärken wie in src/ui.js) ----
const stimme = (satz, sd) => { const n = Object.keys(D.pools).filter(p => p.startsWith('sv_' + satz + '_' + sd)).length; const p = 'sv_' + satz + '_' + sd + (1 + Math.floor(Math.random() * n)); const l = D.pools[p]; return l[Math.floor(Math.random() * l.length)][0]; };
const salve = (sd, n = 4) => { const k = pick('rifle', sd); let t = 0; for (let q = 0; q < n; q++) { if (q) t += Math.random() < 0.3 ? Math.random() * 40 : Math.random() * 250; const last = q === n - 1;
  nach(t, () => spiel(k, 0.3 * (0.8 + Math.random() * 0.4), { rate: 0.94 + Math.random() * 0.12, dur: last ? 0 : 170 + Math.random() * 60 })); } return t; };
const sperrfeuer = (sd, mob) => { const k = pick(mob ? 'launch' : sd === 'D' ? 'artD' : 'cannonH', sd), n = mob ? 3 : 4, shots = []; let t = 0; for (let q = 0; q < n; q++) { if (q) t += 220 + Math.random() * 140; shots.push(t); }
  shots.forEach(t => nach(t, () => spiel(k, (mob ? 0.42 : 0.75) * (0.85 + Math.random() * 0.25), { rate: 0.9 + Math.random() * 0.15 })));
  const flug = 34 * 16.667, felder = 7; for (let i = 0; i < felder; i++) { const tt = i < n ? shots[i] : shots[n - 1] + (i - n + 1) * (140 + Math.random() * 120); nach(flug + tt, () => platzSpiel(mob ? 'boom' : 'boomH', 0.5 * (0.8 + Math.random() * 0.3))); } };
let gefecht = null;
const MISCH = [
  ['Panzerkommandant beim Anklicken – Konkordat', 'motor_auswahl 0,13 (kurz aufheulen) + Spruch sv_panzer ${zahlN(SPRUCH)}, Motor unter der Stimme leiser', () => { motorRev(pick("motor_auswahl", "A"), 0.13 * DUCK_F, 0.7); spiel(stimme('panzer', 'A'), SPRUCH, { rate: 1 }); }],
  ['Panzerkommandant beim Anklicken – Aschenwacht', 'wie oben, Aschenwacht-Motor und -Stimme', () => { motorRev(pick("motor_auswahl", "D"), 0.13 * DUCK_F, 0.7); spiel(stimme('panzer', 'D'), SPRUCH, { rate: 1 }); }],
  ['Panzerkommandant über fahrendem Panzer', 'Kettenrollen tank 0,3 + Spruch sv_panzer ${zahlN(SPRUCH)} nach 0,6 s, Kettenrollen unter der Stimme auf ${zahlN(DUCK_F)}', () => { const fz = platzSpiel('tank', 0.3, 'A'); nach(600, () => duck(fz, spiel(stimme('panzer', 'A'), SPRUCH, { rate: 1 }))); }],
  ['Schreiter-Stimme über Schritten – Konkordat', 'mech 0,5 + Spruch sv_schreiter ${zahlN(SPRUCH)} nach 0,4 s, Schritte unter der Stimme leiser', () => { const fz = platzSpiel('mech', 0.5, 'A'); nach(400, () => duck(fz, spiel(stimme('schreiter', 'A'), SPRUCH, { rate: 1 }))); }],
  ['Schreiter-Stimme über Schritten – Aschenwacht', 'wie oben, Aschenwacht', () => { const fz = platzSpiel('mech', 0.5, 'D'); nach(400, () => duck(fz, spiel(stimme('schreiter', 'D'), SPRUCH, { rate: 1 }))); }],
  ['MG-Salve + Einschläge – Konkordat', 'mg 0,55, Treffer nach 0,45 s: einschlag 0,35', () => { platzSpiel('mg', 0.55, 'A'); nach(450, () => platzSpiel('einschlag', 0.35)); nach(650, () => platzSpiel('vorbei', 0.35)); }],
  ['MG-Salve + Einschläge – Aschenwacht', 'mg 0,55 (Aschenwacht), Treffer 0,35', () => { platzSpiel('mg', 0.55, 'D'); nach(450, () => platzSpiel('einschlag', 0.35)); nach(650, () => platzSpiel('vorbei', 0.35)); }],
  ['Gewehrsalve + Treffer – Konkordat', '4 Schüsse 0,3, unregelmäßig wie im Spiel, Treffer 0,35', () => { const t = salve('A'); nach(t + 250, () => platzSpiel('einschlag', 0.35)); }],
  ['Gewehrsalve + Treffer – Aschenwacht', 'wie oben, Aschenwacht-Gewehr', () => { const t = salve('D'); nach(t + 250, () => platzSpiel('einschlag', 0.35)); }],
  ['Artillerie-Sperrfeuer – Konkordat', '4 Abschüsse cannonH 0,75, Einschläge boomH 0,5 über 7 Felder', () => sperrfeuer('A')],
  ['Artillerie-Sperrfeuer – Aschenwacht', '4 Abschüsse (cannonH/cannon) 0,75, Einschläge boomH 0,5', () => sperrfeuer('D')],
  ['Mörser-Sperrfeuer', '3 Abschüsse launch 0,42, Einschläge boom (= boomH_1) 0,5', () => sperrfeuer('A', true)],
  ['Eingraben', 'schaufel 0,4 + schweres Atmen (Gasmaske leicht) 0,3 × 1,45 nach 0,25 s', () => { platzSpiel('schaufel', 0.4); nach(250, () => platzSpiel('atmen', VOL_ATMEN, null, { v: 'gm' })); }],
  ['Nahkampf mit Getümmel', 'Getümmel-Schleife 0,3, darüber Schläge nahA/nahD 0,55 und ein Schrei', () => { const g = platzSpiel('getuemmel', 0.3, null, { loop: true }); [0, 500, 1100, 1600, 2300].forEach((t, i) => nach(t, () => platzSpiel(i % 2 ? 'nahD' : 'nahA', 0.55, i % 2 ? 'D' : 'A'))); nach(800, () => platzSpiel('cry', VOL_CRY, 'A', { v: 'gm' })); nach(4500, () => { if (g) { g.pause(); laufend.delete(g); } }); }],
  ['Leuchtkugel', 'Leuchtpistole leuchtschuss 0,5, nach 0,45 s Brennen leuchtbrand 0,22 (blendet aus), nach 1,4 s ein Spruch sv_inf ${zahlN(SPRUCH)}, Brennen darunter auf ${zahlN(DUCK_F)}', () => { platzSpiel('leuchtschuss', 0.5); nach(450, () => { const b = platzSpiel('leuchtbrand', 0.22); nach(950, () => duck(b, spiel(stimme('inf', 'A'), SPRUCH, { rate: 1 }))); }); }],
  ['Artillerie-Einzelschuss', 'Abschuss cannonH 0,8, Einschlag einschlagH 0,8 nach Flugzeit', () => { platzSpiel('cannonH', 0.8, 'A'); nach(34 * 16.667, () => platzSpiel('einschlagH', 0.8)); }],
  ['Kirche stürzt ein', 'einsturz 0,95 (rollt 1,2 s an, dann Krachen und Schutt), boomH 0,45 beim Krachen, nach 2,7 s Glocke schlägt auf glocke_fall 0,6', () => { platzSpiel('einsturz', 0.95, null, { rate: 1 }); nach(1270, () => platzSpiel('boomH', 0.45)); nach(2650, () => platzSpiel('glocke_fall', 0.6, null, { rate: 1 })); }],
];
// Sankt Ruß Kulisse (2026-11-19): wie in der Schlacht auf Sankt Ruß – Schlachtmusik, Gefechtslärm, Wind, Rundenglocke; Krähen hier öfter als im Spiel (alle 6–14 s statt 22–60 s), dazu ein Spruch und eine Salve zum Vergleich
function kulisseSR(btn) {
  if (gefecht) { stoppAlles(); return; }
  stoppAlles(); btn.classList.add('an');
  platzSpiel('musik_schlacht', 0.13, null, { musik: true, loop: true }); platzSpiel('ambient', 0.22, null, { loop: true }); platzSpiel('wetter', 0.12, null, { loop: true }); platzSpiel('wind', 0.1, null, { loop: true });
  nach(600, () => platzSpiel('glocke', 0.42, null, { rate: 1 }));
  nach(7000, () => spiel(stimme('inf', 'A'), SPRUCH, { rate: 1 })); nach(11000, () => salve('D', 3)); nach(16000, () => spiel(stimme('inf', 'D'), SPRUCH, { rate: 1 }));
  const kr = () => { platzSpiel('kraehe', 0.14, null, { rate: 0.9 + Math.random() * 0.15 }); }; nach(3000, kr);
  gefecht = setInterval(kr, 6000 + Math.random() * 8000); }
function gefechtAn(btn) {   // Schlachtmusik + Kulisse wie in der Schlacht, dazu ab und zu Gefechtslärm in Spiel-Lautstärke
  if (gefecht) { stoppAlles(); return; }
  stoppAlles(); btn.classList.add('an');
  platzSpiel('musik_schlacht', 0.13, null, { musik: true, loop: true }); platzSpiel('ambient', 0.22, null, { loop: true }); platzSpiel('wetter', 0.12, null, { loop: true });
  const runde = () => { const sd = Math.random() < 0.5 ? 'A' : 'D', r = Math.random();
    if (r < 0.4) salve(sd, 2 + Math.floor(Math.random() * 3)); else if (r < 0.6) { platzSpiel('mg', 0.55, sd); nach(450, () => platzSpiel('einschlag', 0.35)); }
    else if (r < 0.8) { platzSpiel('cannonH', 0.8, sd); nach(560, () => platzSpiel('einschlagH', 0.8)); } else sperrfeuer(sd, Math.random() < 0.4); };
  nach(1500, runde); gefecht = setInterval(runde, 3500); }
// ---- Seite aufbauen ----
const h = (t, a = {}, ...k) => { const e = document.createElement(t); for (const [x, y] of Object.entries(a)) if (x === 'on') e.onclick = y; else if (x === 'html') e.innerHTML = y; else e.setAttribute(x, y); for (const c of k) if (c != null) e.append(c); return e; };
const seiteTag = s => h('span', { class: 'seite ' + (s || 'b') }, s === 'A' ? 'Konkordat' : s === 'D' ? 'Aschenwacht' : 'beide');
const zahl = v => String(v).replace('.', ',');
function knopf(p, t, i, o) {
  const b = h('button', { class: 'knopf', title: t.f }, h('span', { class: 'sym' }, p.loop ? '⟳' : '▶'), h('span', { class: 'titel' }, t.k, seiteTag(t.s), t.w > 1 ? ' ×' + t.w : ''), h('span', { class: 'datei', html: t.f.replace(/&/g, '&amp;').replace(/</g, '&lt;').split('/').join('/<wbr>') }));
  b.onclick = () => { if (p.loop) { if (b.classList.contains('an')) { for (const a of laufend) if (a._knopf === b) { a.pause(); laufend.delete(a); } b.classList.remove('an'); return; }
      const a = spiel(t.k, p.vol, { musik: p.musik, loop: true }); if (a) { a._knopf = b; b.classList.add('an'); b.dataset.schleife = 1; } return; }
    spiel(t.k, p.vol, o); };
  return b; }
function platzBlock(p) { return h('div', {}, h('div', { class: 'platz' }, p.name + ' ', h('small', {}, '· Platz ' + p.p + ' · Spiel-Lautstärke ' + zahl(p.vol) + (p.musik ? ' × Musik' : ' × Effekte'))), h('div', { class: 'reihe' }, ...p.t.map((t, i) => knopf(p, t, i)))); }
const main = document.getElementById('main');
main.append(h('details', { open: '' }, h('summary', {}, 'Mischproben wie im Spiel'), h('div', { class: 'inhalt' },
  h('p', { class: 'hinweis' }, 'Gleiche Abläufe, Abstände und Lautstärken wie im Spiel. Zufällige Auswahl je Tonplatz wie im Spiel – mehrmals antippen.'),
  h('div', { class: 'misch' }, ...MISCH.map(([n, s, f]) => h('button', { on: () => f() }, n, h('small', {}, s))),
    h('button', { on: e => gefechtAn(e.currentTarget) }, 'Schlachtmusik + Gefechtslärm (an/aus)', h('small', {}, 'musik_schlacht 0,13 × Musik, ambient 0,22 und wetter 0,12 × Effekte, dazu Schüsse und Einschläge')),
    h('button', { on: e => kulisseSR(e.currentTarget) }, 'Sankt Ruß Kulisse (an/aus)', h('small', {}, 'wie oben ohne Gefechtslärm, dazu Wind 0,1, Rundenglocke 0,42, Krähen 0,14 (hier öfter als im Spiel), Sprüche und eine Salve zum Vergleich'))))));
// Stimmen
{ const st = h('details', {}, h('summary', {}, 'Stimmen (mit Filter wie im Spiel)'));
  const inh = h('div', { class: 'inhalt' }, h('p', { class: 'hinweis' }, 'Sprüche beim Anklicken: jede Einheit hat im Spiel eine feste Stimme (reihum vergeben), Lautstärke 0,34. Die Dateien sind schon gefiltert (Gasmaske, Bordfunk, Maschine).'));
  for (const s of D.stimmen) for (const g of s.saetze) { const d = h('details', {}, h('summary', {}, s.seite + ': ' + g.titel));
    const i2 = h('div', { class: 'inhalt' }, h('p', { class: 'hinweis' }, 'Einheiten: ' + g.einheiten.join(', ')));
    for (const v of g.stimmen) i2.append(platzBlock({ p: v.p, name: 'Stimme ' + v.n, vol: SPRUCH, t: v.t }));
    d.append(i2); inh.append(d); }
  const r = h('details', {}, h('summary', {}, 'Rufe: Schmerz, Schreie, Befehle, Husten …')); const ri = h('div', { class: 'inhalt' }, h('p', { class: 'hinweis' }, 'Je Sprecher mit dem passenden Filter, wie im Spiel gewählt (Hauptmann/General ohne Filter).'));
  for (const g of D.rufe) { const d = h('details', {}, h('summary', {}, g.titel)); d.append(h('div', { class: 'inhalt' }, ...g.plaetze.map(platzBlock))); ri.append(d); }
  r.append(ri); inh.append(r); st.append(inh); main.append(st); }
for (const g of D.gruppen) main.append(h('details', {}, h('summary', {}, g.titel), h('div', { class: 'inhalt' }, ...g.plaetze.map(platzBlock))));
main.append(h('p', { class: 'hinweis' }, 'Stand der Töne: ' + D.stand + ' · Schlüssel = Name des Tons im Spiel (src/sound.js), darunter die Quelldatei aus sound-quelle/. Lizenzen: CREDITS.md.'));
// Regler wie im Spiel (gleiche Speicherplätze arm.musikvol / arm.effektvol)
const rM = document.getElementById('volMusik'), rE = document.getElementById('volEffekte');
const zeig = () => { document.getElementById('volMusikW').textContent = Math.round(musikVol * 100); document.getElementById('volEffekteW').textContent = Math.round(effektVol * 100); };
rM.value = Math.round(musikVol * 100); rE.value = Math.round(effektVol * 100); zeig();
const nachfuehren = () => { for (const a of laufend) if (a._vol != null) try { a.volume = Math.min(1, a._vol * (a._musik ? musikVol : effektVol)); } catch (e) {} };
rM.oninput = () => { musikVol = rM.value / 100; try { localStorage.setItem('arm.musikvol', musikVol); } catch (e) {} zeig(); nachfuehren(); };
rE.oninput = () => { effektVol = rE.value / 100; try { localStorage.setItem('arm.effektvol', effektVol); } catch (e) {} zeig(); nachfuehren(); };
document.getElementById('stopp').onclick = stoppAlles;
document.getElementById('streuung').onclick = e => { streuen = !streuen; e.currentTarget.classList.toggle('an', streuen); };
// Töne nachladen (nach dem Aufbau der Seite)
const knoepfe = () => document.querySelectorAll('main button'); knoepfe().forEach(b => b.disabled = true);
const sc = document.createElement('script'); sc.src = 'src/sound.js';
sc.onload = () => { SND = window.SOUNDS || {}; knoepfe().forEach(b => b.disabled = false); document.getElementById('status').textContent = Object.keys(SND).length + ' Töne geladen – antippen zum Abspielen.'; };
sc.onerror = () => { document.getElementById('status').textContent = 'Töne konnten nicht geladen werden (src/sound.js).'; };
document.body.append(sc);
</script>
</body></html>
`;
writeFileSync(join(ROOT, 'tonprobe.html'), html);
const n = gruppen.reduce((s, g) => s + g.plaetze.reduce((a, p) => a + p.t.length, 0), 0) + stimmen.reduce((s, x) => s + x.saetze.reduce((a, g) => a + g.stimmen.reduce((b, v) => b + v.t.length, 0), 0), 0) + rufe.reduce((s, g) => s + g.plaetze.reduce((a, p) => a + p.t.length, 0), 0);
console.log('tonprobe.html', Math.round(html.length / 1024), 'KB,', n, 'Tonknöpfe');
