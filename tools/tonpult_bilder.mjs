// Holt die Einheiten-Porträts für das Ton-Pult aus dem Spiel selbst (Armee-Auswahl, Reiter „Alle“, Kampfmaschinen an)
// und schreibt sie klein als WebP nach tools/tonpult_bilder.json. Vorschau-Server nötig (http://127.0.0.1:8765).
// Aufruf: node tools/tonpult_bilder.mjs   – danach node tools/tonpult_bau.mjs
import { spawn } from 'node:child_process'; import { mkdtempSync, writeFileSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), URL = process.env.URL || 'http://127.0.0.1:8765/index.html';
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpult-'))}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description); return r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
const bilder = {};
for (const side of ['A', 'D']) {
  await cmd('Page.navigate', { url: URL }); await sleep(5000);
  const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms));
    const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(800);
    const rd = document.querySelector('input[name=side][value=${side}]'); if (rd) { rd.click(); rd.dispatchEvent(new Event('change', { bubbles: true })); }
    const m = document.getElementById('optMechs'); if (m && !m.checked) { m.checked = true; m.dispatchEvent(new Event('change', { bubbles: true })); }
    for (let i = 0; i < 4 && !document.querySelector('#armyNeu canvas[data-t]'); i++) {
      const a = [...document.querySelectorAll('button')].find(b => b.offsetParent && /armee/i.test(b.textContent)); if (a) a.click(); else click('weiter'); await W(900);
      if (m && !m.checked) { m.checked = true; m.dispatchEvent(new Event('change', { bubbles: true })); } }
    const alle = [...document.querySelectorAll('#armyNeu button, #armyNeu [data-kat]')].find(b => /^alle/i.test(b.textContent.trim())); if (alle) alle.click(); await W(1200);
    const out = {}; for (const c of document.querySelectorAll('#armyNeu canvas[data-t]')) { const k = document.createElement('canvas'); k.width = k.height = 96;
      const g = k.getContext('2d'), s = Math.min(96 / c.width, 96 / c.height); g.drawImage(c, (96 - c.width * s) / 2, (96 - c.height * s) / 2, c.width * s, c.height * s); out[c.dataset.t] = k.toDataURL('image/webp', 0.82); }
    return out; })()`);
  Object.assign(bilder, r); console.log(side, Object.keys(r).length, 'Bilder');
}
writeFileSync(join(ROOT, 'tools', 'tonpult_bilder.json'), JSON.stringify(bilder));
console.log('tools/tonpult_bilder.json', Math.round(JSON.stringify(bilder).length / 1024), 'KB');
ws.close(); ch.kill();
