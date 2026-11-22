// M9 / H2 (2026-11-22): Töne, die das Spiel nie abspielt (nur Auswahl im Ton-Pult und in der Tonprobe), aus src/sound.js in src/sound_pult.js auslagern.
// Das Spiel (index.html) bettet nur src/sound.js ein; tonpult.html und tonprobe.html laden beide Dateien.
// „Vom Spiel benutzt“: Platz oder Schlüssel steht als Zeichenkette in src/ui.js, ist über SND_VAR oder die Ton-Pult-Wahl (TONWAHL) erreichbar,
// ist ein Spruch (sv_…), ein Ton der Kulisse, oder eine Filter-Variante (_gm/_gs/_bf/_mr) eines benutzten Platzes. Im Zweifel bleibt ein Ton im Spiel.
// Wiederholbar: liest beide Dateien, führt sie zusammen und teilt neu. Aufruf: node tools/ton_teilen.mjs  (sound_bau.mjs ruft es am Ende selbst auf)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FS = join(ROOT, 'src', 'sound.js'), FP = join(ROOT, 'src', 'sound_pult.js');
const src = readFileSync(FS, 'utf8'), pult = existsSync(FP) ? readFileSync(FP, 'utf8') : '';
const head = src.slice(0, src.indexOf('(function (root)'));
const SND = {}; for (const t of [src, pult]) for (const m of t.matchAll(/^  ([A-Za-z0-9_]+): '(data:audio\/[^']+)',?$/gm)) SND[m[1]] = m[2];
const poolsAus = t => { const m = t.match(/root\.SOUND_POOLS = (\{.*\});/) || t.match(/Object\.assign\(root\.SOUND_POOLS(?: \|\| \{\})?, (\{.*\})\);/); return m ? JSON.parse(m[1]) : {}; };
const POOLS = { ...poolsAus(src), ...poolsAus(pult) };
const ui = readFileSync(join(ROOT, 'src', 'ui.js'), 'utf8');
const lit = new Set([...ui.matchAll(/'([A-Za-z0-9_]+)'/g)].map(m => m[1]));
const varM = ui.match(/const SND_VAR = (\{[^;]*\});/); const SND_VAR = varM ? Function('return ' + varM[1])() : {};
const twM = ui.match(/const TONWAHL = (\{.*\});/); const TW = twM ? JSON.parse(twM[1]) : {};
const benutzt = new Set(), keys = new Set();
const besucht = new Set(), nimm = p => { if (besucht.has(p)) return; besucht.add(p); if (SND_VAR[p]) for (const q of SND_VAR[p]) nimm(q); if (POOLS[p]) benutzt.add(p); };   // SND_VAR darf auf sich selbst zeigen (cry → cry, scream)
for (const p of Object.keys(POOLS)) {
  const basis = p.replace(/_(gm|gs|bf|mr)$/, '');
  if (lit.has(p) || lit.has(basis) || p.startsWith('sv_') || /^(ambient|musik|kulisse|wind|kraehe|glocke)/.test(p)) nimm(p);
}
for (const p of Object.keys(SND_VAR)) if (lit.has(p)) nimm(p);
for (const o of Object.values(TW)) for (const w of Object.values(o)) { if (w.p) nimm(w.p); if (w.k) keys.add(w.k); }
for (const p of [...benutzt]) for (const v of ['gm', 'gs', 'bf', 'mr']) if (POOLS[p + '_' + v]) benutzt.add(p + '_' + v);
for (const p of benutzt) for (const [k] of POOLS[p]) keys.add(k);
for (const k of Object.keys(SND)) if (lit.has(k)) keys.add(k);   // direkt im Code genannte Töne
const spielK = Object.keys(SND).filter(k => keys.has(k)), pultK = Object.keys(SND).filter(k => !keys.has(k));
const spielP = Object.fromEntries(Object.entries(POOLS).filter(([p]) => benutzt.has(p))), pultP = Object.fromEntries(Object.entries(POOLS).filter(([p]) => !benutzt.has(p)));
const kb = ks => Math.round(ks.reduce((n, k) => n + SND[k].length, 0) / 1024);
writeFileSync(FS, [head.trimEnd(), '// Spieltöne. Nur im Ton-Pult/in der Tonprobe wählbare Töne liegen in src/sound_pult.js (tools/ton_teilen.mjs, M9 2026-11-22).',
  '(function (root) {', "'use strict';", 'root.SOUNDS = Object.assign(root.SOUNDS || {}, {', ...spielK.map(k => `  ${k}: '${SND[k]}',`), '});', 'root.SOUND_POOLS = Object.assign(root.SOUND_POOLS || {}, ' + JSON.stringify(spielP) + ');', '})(this);', ''].join('\n'));
writeFileSync(FP, ['// ===== ARMARGEDDON TÖNE NUR FÜR TON-PULT UND TONPROBE =====', '// Erzeugt mit tools/ton_teilen.mjs aus src/sound.js: Töne und Plätze, die das Spiel nicht abspielt. Nach src/sound.js laden.',
  '(function (root) {', "'use strict';", 'root.SOUNDS = root.SOUNDS || {}; root.SOUND_POOLS = root.SOUND_POOLS || {};', 'Object.assign(root.SOUNDS, {', ...pultK.map(k => `  ${k}: '${SND[k]}',`), '});',
  'Object.assign(root.SOUND_POOLS, ' + JSON.stringify(pultP) + ');', '})(this);', ''].join('\n'));
console.log(`Spiel: ${spielK.length} Töne, ${Object.keys(spielP).length} Plätze, ${kb(spielK)} KB · nur Pult: ${pultK.length} Töne, ${Object.keys(pultP).length} Plätze, ${kb(pultK)} KB`);
console.log('Nur Pult:', Object.keys(pultP).join(', '));
