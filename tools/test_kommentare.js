// Prüfer gegen „Kommentar verschluckt Code“ (Paket G, 2026-11-21): mehrfach ist ein // mitten in eine Zeile geraten und hat den Rest
// der Zeile (Code!) auskommentiert – so fehlten z. B. die lauf-Pose, animPath und break beim Ziehen. Meldet Zeilenkommentare, deren Text
// wie Code aussieht (Aufrufe mit Semikolon, break, await, Zuweisungen an bekannte Objekte). Aufruf: node tools/test_kommentare.js
const fs = require('fs'), path = require('path');
const DATEIEN = ['src/ui.js', 'src/ai.js', 'src/engine.js', 'src/gelaende_bau.js', 'src/figures.js'];
const CODE = [/\bbreak;/, /\bawait [a-zA-Z_.]+\(/, /\b(pose|playSound|shake|fx|boom|kz|floater|logAdd|E\.[a-zA-Z]+|G\.[a-zA-Z]+)\([^)]*\);/, /\b[a-z][a-zA-Z]*\.[a-zA-Z]+ = [^=]/, /\b(if|for) \([^)]*\) [a-zA-Z_]+\(/];
let n = 0;
for (const f of DATEIEN) {
  const zeilen = fs.readFileSync(path.join(__dirname, '..', f), 'utf8').split(/\r?\n/);
  zeilen.forEach((z, i) => {
    // erstes // außerhalb von Zeichenketten und /* */ (grob: Anführungszeichen zählen)
    let q = null, k = -1;
    for (let j = 0; j < z.length - 1; j++) { const c = z[j];
      if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
      if (c === "'" || c === '"' || c === '`') { q = c; continue; }
      if (c === '/' && z[j + 1] === '*') { const e = z.indexOf('*/', j + 2); if (e < 0) break; j = e + 1; continue; }
      if (c === '/' && z[j + 1] === '/' && z[j - 1] !== ':') { k = j; break; }
      if (c === '/' && z[j + 1] !== '/' && /[(,=:[!&|?{};]\s*$/.test(z.slice(0, j))) { const e = z.indexOf('/', j + 1); if (e > j) { j = e; continue; } }   // Regex-Literal überspringen
    }
    if (k < 0 || k < z.search(/\S/) + 1) return;   // kein Kommentar oder ganze Zeile ist Kommentar
    const rest = z.slice(k + 2);
    if (CODE.some(r => r.test(rest))) { n++; console.log(`${f}:${i + 1}: …${rest.slice(0, 160)}`); }
  });
}
if (n) { console.log(`\n${n} verdächtige Kommentare – prüfen, ob dort Code auskommentiert ist.`); process.exit(1); }
console.log('Keine verschluckten Code-Reste gefunden.');
