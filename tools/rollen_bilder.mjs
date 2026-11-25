// F103 (2026-11-22): Vorher/Nachher-Bilder der Rollen-Zeilen im unsichtbaren Chrome: Nachschub-Menü mit Details, Einheitenkarte (kurz und ausführlich), Info-Fenster.
// „Vorher“ = dieselbe Seite mit abgeschalteten Rollen (window.ROLLEN = null). Aufruf: node tools/rollen_bilder.mjs [ordner=entwurf/probe/rollen] (Vorschau-Server nötig)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', OUT = process.argv[2] || 'entwurf/probe/rollen';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.MIT_GPU ? [] : ['--disable-gpu', '--use-angle=swiftshader']), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armrolle-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
const bild = async (name, clip) => { const r = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 88, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); writeFileSync(join(OUT, name + '.jpg'), Buffer.from(r.result.data, 'base64')); };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0');localStorage.removeItem('arm.shoppos')}catch(e){}" });
await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await cmd('Page.navigate', { url: URL }); await sleep(5000);
await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
  click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
const ROLLEN = await ev('JSON.stringify(Object.keys(window.ROLLEN || {}))'); console.log('ROLLEN', ROLLEN);
await ev('window.__ROLLEN = window.ROLLEN');
for (const [tag, an] of [['vorher', false], ['nachher', true]]) {
  await ev(`window.ROLLEN = ${an} ? window.__ROLLEN : null`);
  // Nachschub-Menü: Karten + Details zur ersten Karte
  const box = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); __dbg.openShop(); await W(900);
    const el = document.querySelector('#shopNeu .sn-k'); if (!el) return null; el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: true })); await W(400);
    const a = document.getElementById('shopNeu').getBoundingClientRect(), d = document.getElementById('shopDet').getBoundingClientRect();
    const x0 = Math.max(0, Math.min(a.left, d.left) - 10), y0 = Math.max(0, Math.min(a.top, d.top) - 10), x1 = Math.min(1920, Math.max(a.right, d.right) + 10), y1 = Math.min(1080, Math.max(a.bottom, d.bottom) + 10);
    return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }; })()`);
  if (box && box.width) await bild(`kaufmenue_${tag}`, box); else console.log('kein Nachschub-Menü', box);
  await ev(`(() => { const s = document.getElementById('shop'); if (s) s.hidden = true; document.querySelectorAll('.overlay:not([hidden])').forEach(o => o.hidden = true); document.getElementById('shopDet').classList.remove('zeigen'); })()`);
  // Einheitenkarte kurz und ausführlich (erste eigene Kohorte)
  const kb = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const GG = __dbg.G, u = GG.units.find(x => x.side === "A" && x.type === "kohorte") || GG.units.find(x => x.side === "A"); __dbg.pick(u.id); await W(700);
    try { localStorage.setItem('arm.kartelang', '0'); } catch (e) {} const c = document.querySelector('#hud .up-unit').getBoundingClientRect(); return { x: Math.max(0, c.left - 6), y: Math.max(0, c.top - 6), width: c.width + 12, height: c.height + 12 }; })()`);
  if (typeof kb === "string") { console.log(kb); break; } await bild(`karte_kurz_${tag}`, kb);
  const kl = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const b = document.getElementById('btnMehr'); if (b) b.click(); await W(600);
    const c = document.querySelector('#hud .up-unit').getBoundingClientRect(); return { x: Math.max(0, c.left - 6), y: Math.max(0, c.top - 6), width: c.width + 12, height: Math.min(1080 - c.top + 6, c.height + 12) }; })()`);
  await bild(`karte_ausfuehrlich_${tag}`, kl);
  await ev(`(async () => { const b = document.getElementById('btnMehr'); if (b) b.click(); })()`);
  // Info-Fenster
  const ib = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); document.getElementById('btnInfo').click(); await W(700);
    const o = [...document.querySelectorAll('#detail .sheet, #detail')].find(e => e.offsetParent || e.getClientRects().length); if (!o) return null; const c = o.getBoundingClientRect(); return { x: Math.max(0, c.left), y: Math.max(0, c.top), width: Math.min(1920, c.width), height: Math.min(1080, c.height) }; })()`);
  if (ib && ib.width) await bild(`info_${tag}`, ib); else console.log('kein Info-Fenster', ib);
  await ev(`(() => { const d = document.getElementById('detail'); if (d) d.hidden = true; })()`);
}
console.log(fehler.length ? 'Fehler: ' + fehler.join(' | ') : 'keine Seitenfehler');
ws.close(); ch.kill();
