// F92 Schärfe (2026-11-22): Vergleichsbilder und Messung für die Schalterstufen __dbg.schaerfe(0|1|2) im unsichtbaren Chrome.
// Je Bildschirmdichte (DPR 1 und 1,5) und Zoom (ganz heraus, mittel) ein Bild je Stufe, dazu
//  Flimmern = mittlere Pixeländerung zwischen zwei Bildern bei 1 Weltpixel Kameraverschiebung (kleiner = ruhiger),
//  Bildzeit = mittlere Zeit je Frame (ms).
// Aufruf: node tools/schaerfe_bilder.mjs [ordner=entwurf/probe/schaerfe]   (Vorschau-Server auf 127.0.0.1:8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL = process.env.URL || 'http://127.0.0.1:8765/index.html', OUT = process.argv[2] || 'entwurf/probe/schaerfe';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armscharf-'))}`, '--no-first-run', '--mute-audio', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'ERR ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await cmd('Runtime.enable'); await cmd('Page.enable');
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','0')}catch(e){}" });
const ergebnis = [];
for (const dpr of [1, 1.5]) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: dpr, mobile: false });
  await cmd('Page.navigate', { url: URL }); await sleep(5000);
  await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)); const click = t => { const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && b.textContent.trim().toLowerCase().includes(t)); if (b) b.click(); return !!b; };
    click('neue schlacht'); await W(700); for (const t of ['weiter', 'weiter', 'die schlacht']) { click(t); await W(700); } await W(2500); click('schlacht beginnen'); await W(4000); })()`);
  for (const [zname, zf] of [['ganz', 0], ['mittel', 0.5]]) {
    for (const n of [0, 1, 2]) {
      const r = await ev(`(async () => { const W = ms => new Promise(r => setTimeout(r, ms)), D = __dbg, c = document.getElementById('map');
        const z = D.ZFIT + (1 - D.ZFIT) * ${zf}, x0 = D.CAM.x, y0 = D.CAM.y; D.schaerfe(${n}); D.camSetzen(x0, y0, z); await W(600);
        const t0 = performance.now(); let f = 0; await new Promise(res => { const st = () => { f++; if (performance.now() - t0 < 1500) requestAnimationFrame(st); else res(); }; requestAnimationFrame(st); });
        const ms = (performance.now() - t0) / f;
        const g = c.getContext('2d'), probe = () => g.getImageData(0, Math.round(c.height * 0.15), c.width, Math.round(c.height * 0.5)).data;
        const a = probe(); D.camSetzen(D.CAM.x + 1, D.CAM.y + 0.7, z); await W(120); const b = probe(); D.camSetzen(D.CAM.x - 1, D.CAM.y - 0.7, z); await W(200);
        let s = 0; for (let i = 0; i < a.length; i += 4) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
        return { ms: +ms.toFixed(1), flimmern: +(s / (a.length / 4) / 3).toFixed(2) }; })()`);
      const sh = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
      writeFileSync(join(OUT, `dpr${dpr}_${zname}_stufe${n}.jpg`), Buffer.from(sh.result.data, 'base64'));
      ergebnis.push({ dpr, zoom: zname, stufe: n, ...r }); console.log(JSON.stringify(ergebnis.at(-1)));
    }
  }
}
writeFileSync(join(OUT, 'messung.json'), JSON.stringify(ergebnis, null, 1));
ws.close(); ch.kill();
