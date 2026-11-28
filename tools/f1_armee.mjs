import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/w2c1b/funde/armee'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
// Fund 1 (Punkt 151): Armee-Auswahl – Zähler −/+ dürfen keine Plakette verdecken. Misst Überlappungen und macht je Breite ein Bild.
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" + (process.env.INIT || '') });
for (const [bw, bh] of [[1280, 800], [1920, 1080], [2560, 1440]]) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: bw, height: bh, deviceScaleFactor: 1, mobile: false });
  await cmd('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
  const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(800); for (let i = 0; i < 4 && !document.querySelector('#armyNeu .sn-k'); i++) { click('weiter'); await W(800); if (!document.querySelector('#armyNeu .sn-k')) click('armee'); await W(600); }
    const ks = [...document.querySelectorAll('#armyNeu .sn-k')].filter(k => k.offsetParent); let ueber = 0;
    for (const k of ks) { const st = k.querySelector('.stepper'); if (!st) continue; const a = st.getBoundingClientRect(); for (const p of k.querySelectorAll('.u1-p, .u1s-w')) { const b = p.getBoundingClientRect(); if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) ueber++; } }
    return JSON.stringify({ karten: ks.length, ueberlappungen: ueber }); })()`);
  console.log(bw, r); await bild(`armee_${bw}`);
}
ws.close(); ch.kill();
