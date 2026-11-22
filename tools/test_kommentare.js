// Prüfer gegen „Kommentar verschluckt Code“ (Paket G, 2026-11-21): mehrfach ist ein // mitten in eine Zeile geraten und hat den Rest
// der Zeile (Code!) auskommentiert – so fehlten z. B. die lauf-Pose, animPath und break beim Ziehen. Meldet Zeilenkommentare, deren Text
// wie Code aussieht. Aufruf: node tools/test_kommentare.js
// K1 (2026-11-22, nach H1 „siegGemeldet = …“ hinter dem //): auch einfache Zuweisungen, beliebige Aufrufe mit Semikolon, return/continue;
// ganze Kommentarzeilen werden mitgeprüft (strenger, mit Ausnahmeliste); dazu Prüfung auf stillen Durchlauf von case zu case; auch tools/*.js|mjs.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DATEIEN = ['src/ui.js', 'src/ai.js', 'src/engine.js', 'src/gelaende_bau.js', 'src/figures.js',
  ...fs.readdirSync(__dirname).filter(f => /\.(m?js)$/.test(f) && f !== 'test_kommentare.js').map(f => 'tools/' + f)];
// Code-Muster im Rest einer Zeile hinter dem //
const CODE = [/\bbreak;/, /\bcontinue;/, /\breturn\b[^;]{0,60};/, /\bawait [a-zA-Z_.]+\(/,
  /\b[a-zA-Z_$][\w$.]*\([^()]*(\([^()]*\)[^()]*)*\);/,            // beliebiger Aufruf mit Semikolon
  /\b[a-z][a-zA-Z]*\.[a-zA-Z]+ = [^=]/,                          // a.b = …
  /(^|[;{]\s*|\s)[a-zA-Z_$][\w$]* = [^=>][^;]{0,80};/,            // x = …;
  /\b(if|for) \([^)]*\) [a-zA-Z_]+\(/];
// ganze Kommentarzeilen: nur deutliche Code-Zeilen (Aufruf bzw. Zuweisung mit Semikolon am Ende)
const CODE_ZEILE = [/^\s*(const|let|var) [\w$]+ = .*;\s*$/, /^\s*[a-zA-Z_$][\w$.]*\([^]*\);\s*$/, /^\s*[a-zA-Z_$][\w$.]* = [^=][^]*;\s*$/, /^\s*(break|continue);\s*$/];
// bewusste Beispiele in Kommentaren (Datei, Textanfang)
const AUSNAHME = [
  ['src/ui.js', 'tempo = gewählte Stufe'], ['src/ui.js', 'Breite bw = gefüllter Anteil'], ['src/ui.js', 'Paket G (Enrico 2026-11-21): Löwenoger leicht'],
  ['src/gelaende_bau.js', 'flags(c, r).deko'], ['tools/sound_bau.mjs', 'key = fester Schlüssel']];
const ausgenommen = (f, t) => AUSNAHME.some(([af, at]) => af === f && t.trim().startsWith(at));
// Position des ersten // außerhalb von Zeichenketten, /* */ und Regex-Literalen (grob)
function kommentarPos(z) {
  let q = null;
  for (let j = 0; j < z.length - 1; j++) { const c = z[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '/' && z[j + 1] === '*') { const e = z.indexOf('*/', j + 2); if (e < 0) return -1; j = e + 1; continue; }
    if (c === '/' && z[j + 1] === '/' && z[j - 1] !== ':') return j;
    if (c === '/' && z[j + 1] !== '/' && /[(,=:[!&|?{};]\s*$/.test(z.slice(0, j))) { const e = z.indexOf('/', j + 1); if (e > j) { j = e; continue; } }
  }
  return -1;
}
let n = 0, nd = 0;
const melde = (f, i, t) => { n++; console.log(`${f}:${i + 1}: …${t.slice(0, 160)}`); };
for (const f of DATEIEN) {
  const zeilen = fs.readFileSync(path.join(ROOT, f), 'utf8').split(/\r?\n/);
  const code = [];   // Code-Teil je Zeile (ohne Kommentar)
  zeilen.forEach((z, i) => {
    const k = kommentarPos(z); code[i] = k < 0 ? z : z.slice(0, k);
    if (k < 0) return; const rest = z.slice(k + 2);
    if (ausgenommen(f, rest)) return;
    if (k === z.search(/\S/)) { if (CODE_ZEILE.some(r => r.test(rest)) && !/[äöüßÄÖÜ–„“]|\b(und|oder|der|die|das|wenn|nicht)\b/.test(rest)) melde(f, i, rest); return; }   // ganze Kommentarzeile
    if (CODE.some(r => r.test(rest))) melde(f, i, rest);
  });
  // stiller Durchlauf: Zeile beginnt mit case/default, die vorige Code-Zeile beendet den Fall nicht
  for (let i = 1; i < code.length; i++) {
    if (!/^\s*(case\b.*:|default\s*:)/.test(code[i])) continue;
    let j = i - 1; while (j >= 0 && !code[j].trim()) j--; if (j < 0) continue;
    const v = code[j].trim();
    if (/\bswitch\s*\(.*\)\s*\{$/.test(v)) continue;                                   // erster Fall
    if (/^(case\b[^:]*|default\s*):\s*$/.test(v)) continue;                            // gestapelte Fälle ohne Körper
    const endet = t => /\b(break|return|continue|throw)\b[^;]*;?\s*\}*\s*;?\s*$/.test(t);
    if (endet(v)) continue;  // Fall endet sauber
    if (/^\}+;?$/.test(v)) { let m = j - 1; while (m >= 0 && !code[m].trim()) m--; if (m >= 0 && endet(code[m].trim())) continue; }   // Block-Ende in eigener Zeile
    if (/(durchlauf|fallthrough|fällt durch)/i.test(zeilen[j] + zeilen[i])) continue;   // gewollt, im Kommentar vermerkt
    nd++; console.log(`${f}:${i + 1}: Durchlauf? vorher: ${v.slice(-120)}`);
  }
}
if (n || nd) { console.log(`\n${n} verdächtige Kommentare, ${nd} mögliche Durchläufe – prüfen.`); process.exit(1); }
console.log('Keine verschluckten Code-Reste, kein stiller Durchlauf gefunden.');
