// G1-Probe Gelände (2026-11-25): Gräben Grauwall und Äcker Krähenfurt in Varianten, ohne Einheiten, nah + ganze Karte.
// Nur über window.GB_PROBE (Spiel unverändert). Aufruf: node tools/gelaende_probe.mjs   (G2=1, G2B=1 bzw. G4=1 für vorher/nachher; Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.env.G7E ? 'entwurf/probe/gelaende_g7e' : process.env.G7D ? 'entwurf/probe/gelaende_g7d' : process.env.G7C ? 'entwurf/probe/gelaende_g7c' : process.env.BODEN ? 'entwurf/probe/boden_hindernisse' : process.env.G7V ? 'entwurf/probe/gelaende_g7b' : process.env.G7BT ? 'entwurf/probe/gelaende_g7b_test' : process.env.G6B ? 'entwurf/probe/gelaende_g6b' : process.env.G6 ? 'entwurf/probe/gelaende_g6' : process.env.G7 ? 'entwurf/probe/gelaende_g7a' : process.env.G5B ? 'entwurf/probe/gelaende_g5b' : process.env.G5 ? 'entwurf/probe/gelaende_g5' : process.env.G4B ? 'entwurf/probe/gelaende_g4b' : process.env.G4 ? 'entwurf/probe/gelaende_g4' : process.env.G2B ? 'entwurf/probe/gelaende_g2b' : process.env.G2 ? 'entwurf/probe/gelaende_g2' : 'entwurf/probe/gelaende_g1', sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armgel-'))}`, '--no-first-run', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async n => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, n + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");
const ZERST = "{ const G = __dbg.G; if (G.bauten && G.bauten[0]) { G.bauten[0].kaputt = true; G.map[5][6].t = 'village'; __dbg.play([{ t: 'einsturz', bau: 0, art: 'muehle', c: 5, r: 6, felder: [[5, 6]] }]); } }";
const KARTEN = process.env.G7E ? {   // G7e (2026-11-26): Figuren nicht in den Querwänden; Ecken; heller Fleck
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { fig_vorher: { _js: 'window.QUERPLATZ_ALT = true', qpAlt: true, _einheiten: [[2, 3], [2, 4], [2, 5], [3, 6], [8, 4], [9, 4]], _nah: [2.2, 4.4, 2.6] }, fig_nachher: { _einheiten: [[2, 3], [2, 4], [2, 5], [3, 6], [8, 4], [9, 4]], _nah: [2.2, 4.4, 2.6] }, neu: null, ecke: { _nah: [2.3, 4.2, 4.2] } } },
} : process.env.G7D ? {   // G7d (2026-11-25): Standard (ohne Probe-Schalter) gegen alt (G7_ALT); figuren = Trupps im Graben
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { alt: { _js: 'window.G7_ALT = true', g7alt: true }, neu: null, ecke: { _nah: [2.3, 4.2, 4.2] }, figuren: { _einheiten: [[2, 3], [2, 4], [2, 5], [3, 6], [8, 4], [9, 4]], _nah: [2.2, 4.4, 2.6] } } },
} : process.env.G7C ? {   // G7c (2026-11-25): Nachbesserung (Querwände, Sandsackwall, Lippe); Vergleich mit gelaende_g7b
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { voll: { eingegraben: true }, ecke: { eingegraben: true, _nah: [2.3, 4.2, 4.2] } } },
} : process.env.BODEN ? {   // Punkt 79.3 (2026-11-25): Hindernisse mit Bodenkontakt, vorher = window.BODEN_ALT
  grauwall: { nah: [3, 3.3, 2.4], nah2: [5, 4, 2.4], var: { vorher: { _js: 'window.BODEN_ALT = true', bodenAlt: true }, nachher: null } },
} : process.env.G7V ? {   // G7b voll (2026-11-25): G7b-Test gegen G7b voll; ecke = ganz nah
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { test: { eingegraben: true, g7voll: false }, voll: { eingegraben: true }, ecke: { eingegraben: true, _nah: [2.3, 4.2, 4.2] } } },
} : process.env.G7BT ? {   // G7b-Test (2026-11-25): G7a-Probe gegen gemalte Lippe + Innenwand; nah2 = Ecke ganz nah
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { g7a: { eingegraben: true, g7test: false }, g7b: { eingegraben: true }, ecke: { eingegraben: true, _nah: [2.3, 4.2, 4.2] } } },
} : process.env.G6B ? {   // G6b (2026-11-25): Mühle 1,5×, Einsturzmeldung, Höcker erdig, Wrack verschneit; mit_einheiten = Figuren rund um die Mühle (Verdecken prüfen)
  grauwall: { nah: [5, 5.5, 1.6], nah2: [8, 3.5, 2.2], var: { vorher: { _js: 'window.G6B_ALT = true', g6bAlt: true }, nachher: null, mit_einheiten: { _einheiten: [[5, 5], [4, 5], [6, 5], [4, 6], [6, 6], [5, 7]] }, zerstoert: { _js: ZERST, _spaet: true } } },
  winterdorf: { nah: [6, 9.5, 1.8], var: { vorher: { _js: 'window.G6B_ALT = true', g6bAlt: true }, nachher: null } },
} : process.env.G6 ? {   // G6 (2026-11-25): vorher ohne besondere Orte (window.ORTE_ALT vor dem Start), nachher mit; dazu gesprengte Sperre und eingestürzte Mühle
  grauwall: { nah: [6, 4.5, 1.5], nah2: [3, 3, 2.2], var: { vorher: { _js: 'window.ORTE_ALT = true' }, nachher: null, gesprengt: { _gesprengt: [[8, 3], [3, 2]] }, zerstoert: { _js: "if (typeof G !== 'undefined' && G && G.bauten && G.bauten[0]) { G.bauten[0].kaputt = true; G.map[5][6].t = 'village'; __dbg.play([{ t: 'einsturz', bau: 0, art: 'muehle', c: 5, r: 6, felder: [[5, 6]] }]); }" } } },
  winterdorf: { nah: [6, 9.5, 1.8], var: { vorher: { _js: 'window.ORTE_ALT = true' }, nachher: null } },
} : process.env.G7 ? {   // G7a (2026-11-25): Probe Graben eingegraben (nur über GB_PROBE), vorher heutiger Stand
  grauwall: { nah: [2, 4.5, 2.4], nah2: [2, 4.5, 1.4], var: { vorher: null, eingegraben: { eingegraben: true } } },
} : process.env.G5B ? {   // G5b (2026-11-25): vorher Code-Draht aus G5 (window.GUERTEL_ALT), nachher gemalte Gürtelstücke
  grauwall: { nah: [5, 4.5, 1.6], var: { vorher: { _js: 'window.GUERTEL_ALT = true' }, nachher: null } },
  sanktruss: { nah: [4, 4, 1.6], var: { vorher: { _js: 'window.GUERTEL_ALT = true' }, nachher: null } },
} : process.env.G5 ? {   // G5 (2026-11-25): vorher Draht wie bisher (window.DRAHT_ALT, Bild und Lage), nachher Pfahlreihen und neue Lage
  grauwall: { nah: [5, 4.5, 1.6], var: { vorher: { _js: 'window.DRAHT_ALT = true' }, nachher: null } },
  sanktruss: { nah: [4, 4, 1.6], var: { vorher: { _js: 'window.DRAHT_ALT = true' }, nachher: null } },
} : process.env.G4B ? {   // G4b (2026-11-25): vorher Stand G4 (window.G4B_ALT), nachher unregelmäßiger Takt und Grabenboden; zweites Nahbild zeigt den Grabenboden ganz nah
  grauwall: { nah: [8.5, 4.5, 1.5], nah2: [2, 4.5, 3.2], var: { vorher: { _js: 'window.G4B_ALT = true' }, nachher: null } },
} : process.env.G4 ? {   // G4 (2026-11-25): vorher = Buchten im breiten Band (window.ZINNEN_ALT), nachher = Zinnenverlauf
  grauwall: { nah: [8.5, 4.5, 1.5], nah2: [2, 4.5, 1.5], var: { vorher: { _js: 'window.ZINNEN_ALT = true' }, nachher: null } },
} : process.env.G2B ? {   // G2b/G3b (2026-11-25): vorher = ohne die gemalten Teile (window.GTEILE_ALT), nachher = mit
  grauwall: { nah: [8.5, 4.5, 1.5], nah2: [2, 4.5, 1.5], var: { vorher: { _js: 'window.GTEILE_ALT = true' }, nachher: null, probe_zinnen: { grabenBuchten: { tief: 1.1, bucht: 0.9, quer: 0.7 } } } },
  winterdorf: { nah: null, var: { vorher: { _js: 'window.GTEILE_ALT = true' }, nachher: null } },
} : process.env.G2 ? {   // G2a/G3a (2026-11-25): vorher = alter Stand über Schalter, nachher = neuer Standard
  grauwall: { nah: [8.5, 4.5, 1.5], nah2: [2, 4.5, 1.5], var: { vorher: { _js: 'window.GRAEBEN_ALT = true' }, nachher: null } },
  winterdorf: { nah: null, var: { vorher: { _js: 'window.ACKER_C2 = true' }, nachher: null } },
} : {
  grauwall: { nah: [8.5, 4.5, 1.5], var: { vorher: null, v1_buchten: { grabenForm: 'buchten' }, v2_buchten_wall: { grabenForm: 'buchten', grabenRueckwall: true, grabenPfuetzen: true },
    v3_raster: { grabenForm: 'buchten', grabenRueckwall: true, grabenPfuetzen: true, _raster: [[8, 5, 'trench'], [9, 5, 'trench'], [3, 1, 'trench'], [10, 9, 'open']] } } },
  winterdorf: { nah: null, var: { vorher: null, acker_a: { ackerNeu: true }, acker_b: { ackerNeu: { dunkel: 1.3, abstand: 0.12, breite: 1.3, rain: 0.45, grund: 0.3 } } } },
};
const NUR_V = process.env.NUR_V ? process.env.NUR_V.split(',') : null, NUR_K = process.env.NUR_K ? process.env.NUR_K.split(',') : null;
for (const [karte, K] of Object.entries(KARTEN)) { if (NUR_K && !NUR_K.includes(karte)) continue;
  let nah = K.nah; let nahK = null;
  for (const [v, o] of Object.entries(K.var)) { if (NUR_V && !NUR_V.includes(v)) continue;   // je Variante frisch laden (mehrere Neuaufbauten in einer Seite brachten den Chrome zum Absturz)
    await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000); if (o && o._js) await ev(`(() => { ${o._js}; return true; })()`);
    await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
      click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
      for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
    for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);
    // Einheiten ausblenden (nur Probe): Gelände frei sichtbar
    if (o && o._einheiten) await ev(`(() => { const F = ${JSON.stringify((o && o._einheiten) || [])}, U = __dbg.G.units.filter(u => u.status !== 'dead'); U.forEach((u, i) => { if (i < F.length) { u.c = F[i][0]; u.r = F[i][1]; } else { u._st = u.status; u.status = 'probe'; } }); __dbg.neuDU(); return true; })()`);
    else await ev(`(() => { for (const u of __dbg.G.units) { u._st = u.status; u.status = 'probe'; } __dbg.neuDU(); return true; })()`);
    if (!nah) nah = JSON.parse(await ev(`JSON.stringify((() => { const G = __dbg.G, f = []; for (let c = 0; c < G.map.length; c++) for (let r = 0; r < G.map[0].length; r++) if ((G.map[c][r].t === 'garten' || G.map[c][r].t === 'acker')) f.push([c, r]); const c = f.reduce((a, q) => a + q[0], 0) / f.length, r = f.reduce((a, q) => a + q[1], 0) / f.length; return [Math.round(c), Math.round(r), 1.4]; })())`));
    const P = o && Object.keys(o).some(k => !k.startsWith('_')) ? Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_'))) : null;
    if (o && o._js) await ev(`(() => { ${o._js}; return true; })()`);   // nach dem Start noch einmal (der Start setzt die Seite neu auf)
    await ev(`(() => { const G = __dbg.G; if (!window.__rasterOrig) window.__rasterOrig = G.map.map(col => col.map(h => h.t)); G.map.forEach((col, c) => col.forEach((h, r) => h.t = window.__rasterOrig[c][r]));
      for (const [c, r, t] of ${JSON.stringify((o && o._raster) || [])}) G.map[c][r].t = t; for (const [c, r] of ${JSON.stringify((o && o._gesprengt) || [])}) { G.map[c][r].t = 'crater'; G.map[c][r].gesprengt = true; } __dbg.gbProbe(${JSON.stringify(P)}); return true; })()`);
    await sleep(2500); for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);   // Neuaufbau mit Plastik-Karten dauert headless länger
    if (o && o._spaet) { await ev(`(() => { ${o._js}; return true; })()`); await sleep(1700); }   // G6b: Einsturz kurz vor dem Bild, damit die Meldung noch steht
    const nn = (o && o._nah) || nah; const m = await ev(`__dbg.mitte(${nn[0]}, ${nn[1]})`); await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]}, ${nn[2]}); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_nah`);   // G7b-Test: eigener Nahpunkt je Variante (_nah)
    if (K.nah2) { const m2 = await ev(`__dbg.mitte(${K.nah2[0]}, ${K.nah2[1]})`); await ev(`(() => { __dbg.camSetzen(${m2[0]}, ${m2[1]}, ${K.nah2[2]}); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_nah2`); }
    await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]}, typeof __dbg.ZFIT === 'function' ? __dbg.ZFIT() : __dbg.ZFIT); return true; })()`); await sleep(1500); await bild(`${karte}_${v}_ganz`);
    console.log(karte, v, 'ok', 'Aufbau', await ev('window.__gbMs'), 'ms');
  }
}
console.log(fehler.length ? 'Fehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
