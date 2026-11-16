// Misst Länge und Lautstärke aller Dateien in sound-quelle/ (headless Chrome, stumm)
// und schreibt entwurf/sound-daten.js für den Sound-Sortierer.
// Aufruf: node tools/sound_messen.js
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'sound-quelle');
const OUT = path.join(ROOT, 'entwurf', 'sound-daten.js');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));

function walk(d, rel = '') {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rp = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) r = r.concat(walk(path.join(d, e.name), rp));
    else r.push(rp);
  }
  return r;
}
const files = walk(SRC).sort((a, b) => a.localeCompare(b, 'de'));

// kleiner Dateiserver nur für sound-quelle
const srv = http.createServer((q, s) => {
  const p = path.join(SRC, decodeURIComponent(q.url.split('?')[0]));
  if (!p.startsWith(SRC) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { s.writeHead(q.url === '/' ? 200 : 404); return s.end(''); }
  s.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  fs.createReadStream(p).pipe(s);
});

// Messung im Browser: dekodieren, Spitze, RMS, Länge, Anlauf bis zum ersten Ton
const MEASURE = async (f, base) => {
  const ac = window.__ac || (window.__ac = new OfflineAudioContext(1, 1, 44100));
  try {
    const buf = await (await fetch(base + '/' + f.split('/').map(encodeURIComponent).join('/'))).arrayBuffer();
    const a = await ac.decodeAudioData(buf);
    let peak = 0, sum = 0, n = 0, first = -1, lastLoud = 0;
    const win = Math.max(1, Math.round(a.sampleRate * 0.05));
    const ch = []; for (let c = 0; c < a.numberOfChannels; c++) ch.push(a.getChannelData(c));
    let wmax = 0; // lautestes 50-ms-Fenster (RMS)
    for (let i = 0; i < a.length; i += win) {
      let ws = 0, wn = 0;
      for (let j = i; j < Math.min(a.length, i + win); j++) {
        for (const d of ch) { const v = d[j]; const av = v < 0 ? -v : v; if (av > peak) peak = av; ws += v * v; wn++; }
      }
      sum += ws; n += wn;
      const wr = Math.sqrt(ws / Math.max(1, wn));
      if (wr > wmax) wmax = wr;
      if (wr > 0.01) { if (first < 0) first = i / a.sampleRate; lastLoud = (i + win) / a.sampleRate; }
    }
    const db = v => v > 0 ? Math.round(20 * Math.log10(v) * 10) / 10 : -99;
    return { ok: true, dur: Math.round(a.duration * 100) / 100, sr: a.sampleRate, ch: a.numberOfChannels,
      peak: db(peak), rms: db(Math.sqrt(sum / Math.max(1, n))), loud: db(wmax),
      start: Math.round(Math.max(0, first) * 100) / 100, end: Math.round(lastLoud * 100) / 100 };
  } catch (e) { return { ok: false, err: String(e && e.message || e) }; }
};

// Fallback für Dateien, die Chrome nicht dekodiert (AIFF): Kopf lesen
function aiffInfo(p) {
  const b = fs.readFileSync(p);
  let o = 12;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), sz = b.readUInt32BE(o + 4);
    if (id === 'COMM') {
      const ch = b.readUInt16BE(o + 8), frames = b.readUInt32BE(o + 10);
      // 80-bit-Gleitkomma Abtastrate
      const e = b.readUInt16BE(o + 16) & 0x7fff, m = b.readUInt32BE(o + 18);
      const sr = Math.round(m * Math.pow(2, e - 16383 - 31));
      return { ok: true, dur: Math.round(frames / sr * 100) / 100, sr, ch, peak: null, rms: null, loud: null, start: null, end: null, note: 'nur Kopf gelesen (AIFF)' };
    }
    o += 8 + sz + (sz & 1);
  }
  return { ok: false, err: 'AIFF ohne COMM' };
}

async function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map();
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  return { send: (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }), close: () => ws.close() };
}

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const port = srv.address().port;
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'sndmess-'));
  const ch = spawn(CHROME, ['--headless=new', '--mute-audio', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', '--user-data-dir=' + prof, `http://127.0.0.1:${port}/`], { stdio: 'ignore' });
  let dport;
  for (let i = 0; i < 100 && !dport; i++) {
    await new Promise(r => setTimeout(r, 200));
    try { dport = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch (e) {}
  }
  let tgt;
  for (let i = 0; i < 50 && !tgt; i++) {
    const l = await (await fetch(`http://127.0.0.1:${dport}/json/list`)).json();
    tgt = l.find(t => t.type === 'page');
    if (!tgt) await new Promise(r => setTimeout(r, 200));
  }
  const c = await cdp(tgt.webSocketDebuggerUrl);
  await c.send('Page.navigate', { url: `http://127.0.0.1:${port}/` }); await new Promise(r => setTimeout(r, 800));
  await c.send('Runtime.evaluate', { expression: 'window.__measure = ' + MEASURE.toString() });
  const res = {};
  for (const f of files) {
    const r = await c.send('Runtime.evaluate', { expression: `__measure(${JSON.stringify(f)}, "http://127.0.0.1:${port}")`, awaitPromise: true, returnByValue: true });
    let v = r.result && r.result.result && r.result.result.value || { ok: false, err: 'keine Antwort' };
    if (!v.ok && /\.aiff?$/i.test(f)) v = aiffInfo(path.join(SRC, f));
    v.size = fs.statSync(path.join(SRC, f)).size;
    res[f] = v;
    process.stdout.write((v.ok ? '.' : 'x'));
  }
  console.log();
  c.close(); ch.kill(); srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {} }, 1500);
  fs.writeFileSync(OUT, '// erzeugt von tools/sound_messen.js – nicht von Hand ändern\nwindow.SOUND_MESS = ' + JSON.stringify(res, null, 0).replace(/},"/g, '},\n"') + ';\n');
  const bad = Object.entries(res).filter(([, v]) => !v.ok);
  console.log(files.length, 'Dateien gemessen,', bad.length, 'Fehler'); bad.slice(0,5).forEach(([f, v]) => console.log(' ', f, v.err));
})();
