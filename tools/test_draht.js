// Test „Bild = Regel“ beim Stacheldraht (Regelteil): Jeder Weg, auf dem Draht entfernt wird, muss das Feld spielerisch
// zu Nicht-Draht machen UND ein Ereignis liefern, nach dem die Anzeige das Gelände neu zeichnet (cut, crush, terrain).
// Aufruf: node tools/test_draht.js   (Bildteil im Browser: node tools/test_draht_bild.mjs, Vorschau-Server muss laufen)
'use strict';
const E = require('../src/engine.js');
let fail = 0;
const ok = (name, cond, info) => { console.log((cond ? 'ok    ' : 'FEHLER') + ' ' + name + (info ? '  ' + info : '')); if (!cond) fail++; };
const REDRAW = ['cut', 'crush', 'terrain'];   // Ereignisse, bei denen ui.js renderTerrain() aufruft
const redraws = (ev, c, r) => ev.some(e => REDRAW.includes(e.t) && (e.c == null || (e.c === c && e.r === r)));
function game(side = 'A') { const G = E.newGame({ seed: 4242 }); G.side = side; E.startTurn(G); return G; }
// Zielfeld für Artillerie: geradeaus n Felder, ausgeleuchtet (gilt als gesehen)
function target(G, a, n) { for (let f = 0; f < 6; f++) { let p = [a.c, a.r]; for (let i = 0; i < n; i++) p = E.step ? E.step(p[0], p[1], f) : p; if (!E.inMap(p[0], p[1])) continue; G.lit.push({ c: p[0], r: p[1], side: a.side }); if (E.canShell(G, a, p[0], p[1], 'he')) return { c: p[0], r: p[1] }; } return null; }
function freeNear(G, u) { return E.neighbors(u.c, u.r).find(([c, r]) => E.inMap(c, r) && !E.unitAt(G, c, r)); }

{ // Draht schneiden
  const G = game(), u = G.units.find(x => x.side === 'A' && x.type === 'kohorte'); E.hex(G, u.c, u.r).t = 'wire'; u.ap = 2; u.attacked = false;
  const ev = E.cutWire(G, u); ok('Schneiden', E.hex(G, u.c, u.r).t !== 'wire' && redraws(ev, u.c, u.r), JSON.stringify(ev.map(e => e.t)));
}
{ // Koloss walzt
  const G = game(), u = G.units.find(x => x.side === 'A' && x.type === 'koloss'); u.ap = 2; u.mvd = 0; const [c, r] = freeNear(G, u); E.hex(G, c, r).t = 'wire';
  const ev = E.moveUnit(G, u, c, r); ok('Koloss walzt', E.hex(G, c, r).t !== 'wire' && redraws(ev, c, r), JSON.stringify(ev.map(e => e.t)));
}
{ // Sprenggranate (Zufall 50 %): Wenn das Feld nicht mehr Draht ist, muss es ein Ereignis geben – und umgekehrt
  let n = 0, bad = 0;
  for (let s = 0; s < 40; s++) {
    const G = E.newGame({ seed: 100 + s }); E.startTurn(G); const a = G.units.find(x => x.side === 'A' && x.type === 'haubitze'); a.ap = 2; a.attacked = false; a.limbered = false;
    const d = target(G, a, 4); if (!d) continue; E.hex(G, d.c, d.r).t = 'wire'; G.marks.push({ c: d.c, r: d.r, side: 'A' });   // markiert: keine Streuung
    const ev = E.shell(G, a, d.c, d.r, 'he'), gone = E.hex(G, d.c, d.r).t !== 'wire'; n++; if (gone !== redraws(ev, d.c, d.r)) bad++;
  }
  ok('Sprenggranate', n > 0 && bad === 0, `${n} Schüsse, ${bad} ohne passendes Ereignis`);
}
{ // Minenwerfer räumt Draht immer
  const G = game('D'), a = G.units.find(x => x.side === 'D' && x.type === 'grenadier'); a.type = 'minenwerfer'; a.ap = 2; a.attacked = false; a.mvd = 0;
  const d = target(G, a, 3);
  if (d) { E.hex(G, d.c, d.r).t = 'wire'; G.marks.push({ c: d.c, r: d.r, side: 'D' }); const ev = E.shell(G, a, d.c, d.r, 'he'); ok('Minenwerfer', E.hex(G, d.c, d.r).t !== 'wire' && redraws(ev, d.c, d.r), JSON.stringify(ev.map(e => e.t))); }
  else ok('Minenwerfer', false, 'kein Ziel');
}
{ // Sprengladung auf leeres Drahtfeld
  const G = game(), u = G.units.find(x => x.side === 'A' && x.type === 'kohorte'); u.type = 'spreng'; u.ap = 2; u.attacked = false; u.cdA = 0;
  const [c, r] = freeNear(G, u); E.hex(G, c, r).t = 'wire'; const ev = E.useAbil(G, u, c, r);
  ok('Sprengladung', E.hex(G, c, r).t !== 'wire' && redraws(ev, c, r), JSON.stringify(ev.map(e => e.t)));
}
{ // Flammenstrahl: Draht verbrennt
  const G = game(), d = G.units.find(x => x.side === 'D' && x.type === 'grenadier'), f = G.units.find(x => x.side === 'A' && x.type === 'kohorte'); f.type = 'flammen';
  const [c, r] = freeNear(G, d); f.c = c; f.r = r; f.ap = 2; f.attacked = false; E.hex(G, d.c, d.r).t = 'wire';
  const ev = E.fire(G, f, d); ok('Flammenstrahl', E.hex(G, d.c, d.r).t !== 'wire' && redraws(ev, d.c, d.r), JSON.stringify(ev.map(e => e.t)));
}
{ // Draht ziehen (Drahtpioniere): neues Drahtfeld muss ebenfalls neu gezeichnet werden
  const G = game('D'), u = G.units.find(x => x.side === 'D' && x.type === 'grenadier'); u.type = 'pionierD'; u.ap = 2; u.attacked = false;
  for (let f = 0; f < 6 && !E.canLay(G, u); f++) u.face = f;   // Blick auf ein freies Feld
  if (E.canLay(G, u)) { const [c, r] = E.layTarget(G, u); const ev = E.layWire(G, u); ok('Draht ziehen', E.hex(G, c, r).t === 'wire' && redraws(ev, c, r), JSON.stringify(ev.map(e => e.t))); }
  else ok('Draht ziehen', true, '(kein freies Feld vor dem Trupp – übersprungen)');
}
// Kein anderer Weg im Regelwerk darf Draht still entfernen: alle Stellen, an denen .t = 'open' oder 'crater' gesetzt wird, haben ein Ereignis
{ const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'src', 'engine.js'), 'utf8').split('\n');
  const near = i => src.slice(i, i + 3).join(' ');   // Ereignis in derselben oder den zwei folgenden Zeilen
  const silent = src.map((l, i) => [i + 1, l, near(i)]).filter(([, l, w]) => /\.t = '(open|crater)'/.test(l) && !/ev\.push|return \[\{ t: 'cut'/.test(w));
  ok('keine stillen Geländeänderungen', silent.length === 0, silent.map(([n, l, w]) => `Zeile ${n}: ${l.trim().slice(0, 80)}`).join(' | '));
}
console.log(fail ? `\n${fail} Fehler` : '\nalle Prüfungen bestanden');
process.exit(fail ? 1 : 0);
