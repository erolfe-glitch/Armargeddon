// Fix F1 (Punkt 127, 2026-11-27): Nachschub-Menü bei 1280/1920/2560 px, normal und mit verschobener gespeicherter Lage (arm.shoppos); misst Lage von Fenster, Titel, Reitern gegen die obere Leiste.
// Aufruf: node tools/f1_shop.mjs [ordner=entwurf/probe/f1/nachher]   (Vorschau-Server)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const OUT = process.argv[2] || 'entwurf/probe/f1/nachher'; mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armfx-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank']);
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const bild = async name => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); console.log('  Bild', name); };
await cmd('Runtime.enable'); await cmd('Page.enable'); await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
const messen = () => ev(`(() => { const r = el => { const b = el && el.getBoundingClientRect(); return b ? [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)] : null; };
  const sh = document.querySelector('#shop .sheet'), tb = getComputedStyle(document.body).getPropertyValue('--tb-unten');
  return JSON.stringify({ fenster: [innerWidth, innerHeight], leisteUnten: tb, sheet: r(sh), titel: r(document.querySelector('#shopNeu .sn-titel')), reiter: r(document.querySelector('#shopNeu .sn-reiter')), liste: r(document.querySelector('#shopNeu .sn-liste')), fuss: r(document.querySelector('#shopNeu .sn-fuss')) }); })()`);
for (const [w, h] of [[1280, 720], [1280, 800], [1920, 1080], [2560, 1440]]) {
  for (const lage of [null, [0, -600], [900, 500]]) {
    await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('arm.shoppos', ${JSON.stringify(JSON.stringify(lage || [0, 0]))})}catch(e){}` });
    await cmd('Page.navigate', { url: process.env.URL || 'http://127.0.0.1:8765/index.html' }); await sleep(5000);
    await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
      click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(3500); __dbg.openShop(); await W(900); return true; })()`);
    const name = `shop_${w}x${h}` + (lage ? `_lage${lage.join('_')}` : ''); await bild(name); console.log(name, await messen());
  }
}
console.log(fehler.length ? 'Fehler: ' + fehler.slice(0, 3).join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
