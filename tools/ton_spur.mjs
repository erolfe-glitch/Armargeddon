// Ton-Spur (2026-11-23, Ton-Pult 3): gewinnt aus dem laufenden Spiel, welche Tonplätze je Einheitentyp klingen können.
// Unsichtbarer Chrome (stumm, Ton im Spiel AN), eigener kleiner Webserver. Für jeden Typ aus E.ROSTER (Kampfmaschinen an) werden Szenen
// mit echten Regel-Aufrufen (E.moveUnit, E.fire, E.melee, E.shell, E.useAbil …) durchgespielt; die Ereignisse laufen durch die UI (__dbg.spiel).
// Der Spion in src/ui.js (window.__tonSpur in playSound, sndPick, ruf, schreiterRuf, heldRuf, selectVoice) meldet jeden Platz VOR Pult-Wahl,
// Abklingzeiten und Zufall. Ergebnis: tools/ton_spur.json; Vergleich mit dem Pult: node tools/test_tonplaetze.mjs
// Aufruf: node tools/ton_spur.mjs [typ …]     (vorher python tools/build.py; ohne Typen = alle; NUR=grauwall|winterdorf; TEMPO=12; BLOCK=6 Typen je Seitenladung; ZEIG=1 druckt Szenen)
// Dauer: etwa 20 Minuten für alle 54 Einheiten auf beiden Karten (je Typ 12–20 s auf Grauwall, 4–8 s auf der Winterkarte).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const HP = 8800 + Math.floor(Math.random() * 150), port = 9500 + Math.floor(Math.random() * 300), TEMPO = +(process.env.TEMPO || 12), BLOCK = +(process.env.BLOCK || 6);
const PY = join(process.env.LOCALAPPDATA || '', 'Programs', 'Python', 'Python312', 'python.exe');
const srv = spawn(PY, ['-m', 'http.server', String(HP), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.MIT_GPU ? [] : ['--disable-gpu', '--use-angle=swiftshader']), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armspur-'))}`, '--no-first-run', '--mute-audio', '--autoplay-policy=no-user-gesture-required', '--window-size=1600,900', 'about:blank'], { stdio: 'ignore' });
const ende = code => { try { ch.kill(); } catch (e) {} try { srv.kill(); } catch (e) {} process.exit(code); };
let tabs; for (let i = 0; i < 60; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const SEITE = readFileSync(join(ROOT, 'tools', 'ton_spur_seite.js'), 'utf8');

async function karteStarten(karte) {
  try { await ev('window.__alt = 1'); } catch { }
  await cmd('Page.navigate', { url: `http://127.0.0.1:${HP}/index.html` });
  let da = false; for (let i = 0; i < 150 && !da; i++) { await sleep(400); try { da = await ev("!!(!window.__alt && window.__dbg && window.SOUNDS && document.getElementById('smNeu'))"); } catch { } }
  if (!da) throw new Error('Spiel oder Töne nicht geladen');
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), kl = s => { const b = document.querySelector(s); if (b) b.click(); return !!b; };
    kl('#smNeu'); await W(500); const hot = document.querySelector('input[name=opp][value=hot]'); if (hot) { hot.checked = true; hot.dispatchEvent(new Event('change', { bubbles: true })); }
    kl('button[data-go=map]'); await W(500); const m = document.querySelector('input[name=map][value=${karte}]'); if (m) { m.checked = true; m.dispatchEvent(new Event('change', { bubbles: true })); } await W(300);
    kl('button[data-go=setup]'); await W(500); const me = document.getElementById('optMechs'); if (me && !me.checked) me.click(); await W(200);
    kl('#startBtn'); await W(2500); __dbg.aufstellFertig(); await W(400); __dbg.aufstellFertig(); await W(1500);
    for (const q of ['#handover button', '#handover']) { const b = document.querySelector(q); if (b && b.offsetParent) b.click(); } await W(600); })()`);
  const ok = await ev(`JSON.stringify({ g: !!__dbg.G, karte: __dbg.G && __dbg.E.MAP.id, auf: __dbg.G && __dbg.G.aufstellung, mechs: __dbg.G && __dbg.G.mechs, n: __dbg.G && __dbg.G.units.length, side: __dbg.G && __dbg.G.side })`);
  const o = JSON.parse(ok); if (!o.g || o.karte !== karte || o.auf || !o.mechs) throw new Error('Spielstart fehlgeschlagen: ' + ok);
  await ev(SEITE); await ev(`TS.start(${TEMPO})`);
  return o;
}

try {
  await cmd('Runtime.enable'); await cmd('Page.enable');
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','1');localStorage.setItem('arm.kampfszene','aus');localStorage.setItem('arm.meldungen','aus')}catch(e){}" });
  const nurTypen = process.argv.slice(2), nur = process.env.NUR || '', t0 = Date.now();
  if (process.env.EVAL) { await karteStarten(process.env.NUR || 'grauwall'); console.log(await ev(readFileSync(process.env.EVAL, 'utf8'))); if (fehler.length) console.log('Fehler:', [...new Set(fehler)].slice(0, 20).join('\n')); ende(0); }
  const aus = { erzeugt: new Date().toISOString(), ui_hash: createHash('sha1').update((u => { const a = u.indexOf('// TONWAHL-ANFANG'), b = u.indexOf('// TONWAHL-ENDE'); return a >= 0 && b > a ? u.slice(0, a) + u.slice(b) : u; })(readFileSync(join(ROOT, 'src', 'ui.js'), 'utf8'))).digest('hex'), tempo: TEMPO, hinweis: 'a = Einheit handelt, z = Einheit ist Getroffene; wahl = wie die Pult-Wahl (TONWAHL) die Einheit an dieser Stelle sieht: sp Sprecher, a/z im Ereignis (nicht Ziel/Ziel), ok = nicht im Ereignis, fest = Ton als fester Schlüssel gezogen (Wahl greift nicht)', typen: {}, winter: {}, allgemein: {} };
  for (const karte of ['grauwall', 'winterdorf']) { if (nur && nur !== karte) continue;
    await karteStarten(karte);
    const typen = JSON.parse(await ev('JSON.stringify([...__dbg.E.ROSTER.A, ...__dbg.E.ROSTER.D])')).filter(t => !nurTypen.length || nurTypen.includes(t));
    let i = 0; for (const t of typen) { const z0 = Date.now(); if (i && i % BLOCK === 0) await karteStarten(karte); i++;   // Seite regelmäßig neu laden: sonst sammeln sich Tausende Audio-Knoten, der Lauf wird immer langsamer
      const r = JSON.parse(await ev(`TS.typ(${JSON.stringify(t)}).then(JSON.stringify)`));
      if (karte === 'grauwall') aus.typen[t] = r.erg;
      else { const g = aus.typen[t], schon = p => !!(g && (g.a[p] || g.z[p])), nurNeu = o => Object.fromEntries(Object.entries(o).filter(([p]) => !schon(p)));   // Winter: nur, was auf der Winterkarte zusätzlich klingt
        aus.winter[t] = { a: nurNeu(r.erg.a), z: nurNeu(r.erg.z), wahl: nurNeu(r.erg.wahl), nicht_ausgeloest: r.erg.nicht_ausgeloest }; }
      for (const [p, s] of Object.entries(r.allgemein)) (aus.allgemein[p] = aus.allgemein[p] || []).push(...s.filter(x => !(aus.allgemein[p] || []).includes(x)).slice(0, 3));
      console.log(`${karte} ${t}: ${Object.keys(r.erg.a).length} a, ${Object.keys(r.erg.z).length} z, ${Object.keys(r.erg.stimmen).length} Stimmen, ${r.erg.nicht_ausgeloest.length} nicht ausgelöst, ${((Date.now() - z0) / 1000).toFixed(1)} s`);
      if (process.env.ZEIG) console.log(JSON.stringify(r.erg, null, 1)); }
  }
  // Töne ohne Bezug zu einer Einheit (Kulisse, Oberfläche, Rundenschild) aus den Einheiten herausnehmen und unter „allgemein“ sammeln
  const ALLG = ['klick', 'ui', 'erobert', 'verloren', 'kraehe', 'wind', 'winterwind', 'winterwind_stark', 'glocke', 'glocke_fern', 'zug_eigen', 'zug_gegner', 'horn', 'getuemmel', 'ambient', 'wetter'];
  for (const [bereich, karte] of [['typen', 'grauwall'], ['winter', 'winterdorf']]) for (const [t, e] of Object.entries(aus[bereich])) for (const p of ALLG) { const sz = [...((e.a || {})[p] || []), ...((e.z || {})[p] || [])];
    if (!sz.length) continue; const l = aus.allgemein[p] = aus.allgemein[p] || []; for (const x of sz) { const k = karte + ': ' + x.replace(/:.*/, ''); if (!l.includes(k) && l.length < 8) l.push(k); }
    for (const k of ['a', 'z', 'wahl']) if (e[k]) delete e[k][p]; }
  if (!nurTypen.length && !nur) writeFileSync(join(ROOT, 'tools', 'ton_spur.json'), JSON.stringify(aus, null, 1)); else writeFileSync(join(ROOT, 'tools', 'ton_spur_teil.json'), JSON.stringify(aus, null, 1));
  console.log(`fertig in ${Math.round((Date.now() - t0) / 1000)} s → tools/${!nurTypen.length && !nur ? 'ton_spur.json' : 'ton_spur_teil.json (Teil-Lauf, ton_spur.json unverändert)'}`);
  const f = [...new Set(fehler)]; if (f.length) { console.log(f.length + ' Konsolenfehler:'); for (const x of f.slice(0, 25)) console.log('  ' + x); }
  ende(0);
} catch (e) { console.error('ton_spur:', e.message); if (fehler.length) console.error([...new Set(fehler)].slice(0, 10).join('\n')); ende(1); }
