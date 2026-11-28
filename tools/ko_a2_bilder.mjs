// KO-A2 (Punkt 155): Knopfleiste des Kommandanten mit Abklingzeiten und gesperrten Befehlen (Stufe 5 und Stufe 2), Tooltip „ab Stufe n“, Stufenwahl in der Armee-Auswahl. Aufruf: node tools/ko_a2_bilder.mjs <ordner>
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/ko_a2'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', ...(process.env.OHNE_GPU ? ['--disable-gpu'] : []), 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 380, y: 300, width: 1160, height: 440, scale: 1 } }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
const voll = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const leiste = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 0, y: 640, width: 1920, height: 440, scale: 1 } }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
const start = async stufe => {
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('arm.kommstufe', '{"A":${stufe},"D":5}')}catch(e){}` });
  await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); return true; })()`);
};
const knoepfe = () => ev(`JSON.stringify([...document.querySelectorAll('#hud .up-ab')].map(b => [b.dataset.act, b.classList.contains('off') ? 'aus' : 'an', (b.querySelector('.cdn') || {}).textContent || '', ((b.querySelector('.why') || {}).textContent || '')]))`);
const hover = async act => { const p = await ev(`(() => { const b = document.querySelector('#hud .up-ab[data-act="${act}"]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`); if (!p) return; await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] }); await sleep(900); };
const waehle = () => ev(`(async () => { const D = __dbg, G = D.G, k = G.units.find(u => u.type === 'generalA'); D.pick(k.id); await new Promise(r => setTimeout(r, 900)); return k.kStufe; })()`);
const befehl = kind => ev(`(async () => { await __dbg.panelAct('o-${kind}'); await new Promise(r => setTimeout(r, 2500)); const D = __dbg, G = D.G, k = G.units.find(u => u.type === 'generalA'); D.pick(k.id); await new Promise(r => setTimeout(r, 900)); return true; })()`);
// Stufe 5: frisch, dann nach „Sammeln“ (Abklingzeit, zweiter Befehl ohne Aktion)
await start(5); console.log('Stufe', await waehle()); console.log(' frisch', await knoepfe()); await leiste('stufe5_frisch');
await befehl('rally'); console.log(' nach Sammeln', await knoepfe()); await hover('o-rally'); await leiste('stufe5_nach_sammeln_tooltip');
await befehl('fire'); console.log(' nach Feuer frei', await knoepfe()); await leiste('stufe5_nach_zwei_befehlen');
// Stufe 2: großer Befehl gesperrt, nur ein Befehl je Runde
await start(2); console.log('Stufe', await waehle()); console.log(' frisch', await knoepfe()); await hover('big'); await leiste('stufe2_grosser_befehl_gesperrt');
await befehl('rally'); console.log(' nach Sammeln', await knoepfe()); await hover('o-fire'); await leiste('stufe2_zweiter_befehl_gesperrt');
// Armee-Auswahl mit Stufenwahl
await ev(`(async () => { document.getElementById('btnArmy') && document.getElementById('btnArmy').click(); await new Promise(r => setTimeout(r, 1500)); return true; })()`);
const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 85 }); writeFileSync(join(OUT, 'armee_auswahl_stufe.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild armee_auswahl_stufe', await ev(`(() => { const w = document.getElementById('armyKomm'); return w ? (w.hidden ? 'versteckt' : 'sichtbar ' + JSON.stringify(w.getBoundingClientRect())) : 'fehlt'; })()`));
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
