// R3-Bilder (2026-11-26): Deckung an Feldkanten je Karte, nah, dazu der Geländehinweis als Text. Vorschau-Server auf 127.0.0.1:8765.
// Aufruf: node tools/kanten_bilder.mjs → entwurf/probe/r3/<karte>_<c>_<r>.jpg, hinweise.json
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.env.OUT || 'entwurf/probe/r3', sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
mkdirSync(OUT, { recursive: true });
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armr3-'))}`, '--no-first-run', '--mute-audio', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = []; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push(m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bild = async n => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, n + '.jpg'), Buffer.from(r.result.data, 'base64')); };
const hell = () => ev("(() => { const c = document.getElementById('map'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 997) { s += d[i] + d[i + 1] + d[i + 2]; n++; } return s / n / 3; })()");


const hinweise = {};
for (const karte of ['grauwall', 'sanktruss', 'winterdorf']) {
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); const rb = document.querySelector('input[name=map][value=${karte}]'); if (rb) { rb.click(); rb.dispatchEvent(new Event('change', { bubbles: true })); await W(400); }
    for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
  await sleep(2500); for (let i = 0; i < 40 && (await hell()) < 12; i++) await sleep(500);
  const liste = await ev(`E.KANTEN_KARTE['${karte}'] || []`);
  for (const [c, r, seite, art] of liste) {
    const m = await ev(`__dbg.mitte(${c}, ${r})`); await ev(`(() => { __dbg.camSetzen(${m[0]}, ${m[1]} - 20, 2.4); return true; })()`); await sleep(1400); await bild(`${karte}_${c}_${r}_${art}`);
    hinweise[`${karte} ${c},${r}`] = await ev(`(() => { const u = __dbg.G.units.find(u => u.type === 'kohorte') || __dbg.G.units[0]; return (__dbg.feldWirkung ? __dbg.feldWirkung(u, ${c}, ${r}) : []).map(x => (x.gut ? '▲ ' : '▼ ') + x.kurz + ' – ' + x.lang); })()`);
  }
  await ev(`(() => { __dbg.camSetzen(${(await ev('__dbg.mitte(8, 5)'))[0]}, ${(await ev('__dbg.mitte(8, 5)'))[1]}, 0.6); return true; })()`); await sleep(1500); await bild(`${karte}_uebersicht`);
  console.log(karte, liste.length, 'Kanten');
}
writeFileSync(join(OUT, 'hinweise.json'), JSON.stringify(hinweise, null, 1));
console.log(fehler.length ? 'Fehler: ' + [...new Set(fehler)].slice(0, 5).join(' | ') : 'keine Seitenfehler'); ws.close(); ch.kill(); process.exit(0);
