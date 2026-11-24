// Ton-Pult 3 im Spiel (2026-11-23): Abstellkammer (TON_AUS) und eigene Mischtöne (MISCHTON) wirken beim Abspielen.
// Lädt index.html im unsichtbaren Chrome (Datei, kein Vorschau-Server nötig), trägt zur Probe Einträge in TON_AUS/MISCHTON ein und prüft:
// aussortierte Fassungen fallen aus der Zufallsauswahl (sndPick), der letzte Ton eines Platzes bleibt, aussortierte Sprecher werden übersprungen,
// ein Mischton spielt alle Spuren mit Versatz, Lautstärke und Tonhöhe. Aufruf: node tools/test_tonpult3_spiel.mjs   (vorher python tools/build.py)
import { spawn } from 'node:child_process'; import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), URL_ = process.env.URL || pathToFileURL(join(ROOT, 'index.html')).href;
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armp3-'))}`, '--no-first-run', '--mute-audio', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files', '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200)); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
let ok = 0, nicht = 0; const pruef = (was, gut, mehr = '') => { if (gut) ok++; else nicht++; console.log((gut ? '  ok    ' : '  FEHLER ') + was + (mehr ? ' – ' + mehr : '')); };
try {
  await cmd('Runtime.enable'); await cmd('Page.enable');
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('arm.ton','1')}catch(e){}" });
  await cmd('Page.navigate', { url: URL_ });
  let da = false; for (let i = 0; i < 80 && !da; i++) { await sleep(500); try { da = await ev("!!(window.__dbg && window.SOUNDS && window.SOUND_POOLS && __dbg.sndPick && Object.keys(window.SOUNDS).length > 100)"); } catch { } }
  pruef('Spiel und Töne geladen', da, await ev("Object.keys(window.SOUNDS || {}).length + ' Töne'"));
  pruef('TON_AUS und MISCHTON sind im Spiel vorhanden', await ev("__dbg.TON_AUS instanceof Set && typeof __dbg.MISCHTON === 'object'"), await ev("__dbg.TON_AUS.size + ' aussortierte Töne, ' + Object.keys(__dbg.MISCHTON).length + ' Mischtöne eingebaut'"));
  // 1. Zufallsgruppe: eine Fassung aussortieren
  const r1 = JSON.parse(await ev(`JSON.stringify((() => { const P = window.SOUND_POOLS, p = Object.keys(P).find(n => !/^sv_/.test(n) && P[n].length >= 3 && P[n].every(e => !e[1])), keys = P[p].map(e => e[0]), raus = keys[0], vorher = new Set(), nachher = new Set();
    for (let i = 0; i < 300; i++) vorher.add(__dbg.sndPick(p)); __dbg.TON_AUS.add(raus); for (let i = 0; i < 300; i++) nachher.add(__dbg.sndPick(p));
    for (const k of keys.slice(1)) __dbg.TON_AUS.add(k); const alleRaus = new Set(); for (let i = 0; i < 100; i++) alleRaus.add(__dbg.sndPick(p)); for (const k of keys) __dbg.TON_AUS.delete(k);
    return { p, n: keys.length, raus, vorher: [...vorher], nachher: [...nachher], alleRaus: [...alleRaus] }; })())`));
  pruef('aussortierte Fassung fällt aus der Zufallsauswahl, die anderen spielen weiter', r1.vorher.includes(r1.raus) && !r1.nachher.includes(r1.raus) && r1.nachher.length === r1.n - 1, `Platz ${r1.p}: vorher ${r1.vorher.length} Fassungen, danach ${r1.nachher.length} (ohne ${r1.raus})`);
  pruef('sind alle Fassungen eines Platzes aussortiert, bleibt der Ton (bis Ersatz gewählt ist)', r1.alleRaus.length >= 1 && r1.alleRaus.every(k => k), r1.alleRaus.length + ' Fassungen spielen weiter');
  // 2. Sprecher: ganze Stimme aussortiert → wird bei neuen Einheiten übersprungen; einzelner Spruch aussortiert → kommt nicht mehr
  const r2 = JSON.parse(await ev(`JSON.stringify((() => { const P = window.SOUND_POOLS, raus = P.sv_inf_A2.map(e => e[0]); for (const k of raus) __dbg.TON_AUS.add(k);
    const pools = new Set(); for (let i = 0; i < 12; i++) pools.add(__dbg.stimmPool({ id: 'p3test' + i, type: 'kohorte', side: 'A' }));
    const k1 = P.sv_inf_A1[0][0]; __dbg.TON_AUS.add(k1); const gez = new Set(); for (let i = 0; i < 80; i++) gez.add(__dbg.stimmZiehen('sv_inf_A1')); for (const k of [...raus, k1]) __dbg.TON_AUS.delete(k);
    return { pools: [...pools], k1, gez: [...gez], n1: P.sv_inf_A1.length }; })())`));
  pruef('aussortierte Sprechergruppe wird übersprungen', r2.pools.length >= 2 && !r2.pools.includes('sv_inf_A2'), r2.pools.join(', '));
  pruef('aussortierter Spruch kommt nicht mehr, die übrigen der Stimme schon', !r2.gez.includes(r2.k1) && r2.gez.length === r2.n1 - 1, r2.gez.length + ' von ' + r2.n1 + ' Sprüchen');
  // 3. Mischton: zwei Spuren mit Versatz, Lautstärke, Tonhöhe
  const r3 = JSON.parse(await ev(`(async () => { const S = __dbg.SND, P = window.SOUND_POOLS, a = P.einschlagH[0][0], b = P.einschlag[0][0]; __dbg.setSound(true);
    __dbg.MISCHTON.mix_p3test = [[a, 1, 0, 1], [b, 0.5, 220, 0.8]]; const spuren = [], alt = window.Audio; const t0 = performance.now();
    const fang = k => { const o = S[k], c = o.cloneNode.bind(o); o.cloneNode = () => { const x = c(); const p = x.play.bind(x); x.play = () => { spuren.push({ k, t: Math.round(performance.now() - t0), vol: +x.volume.toFixed(3), rate: +x.playbackRate.toFixed(3) }); return p(); }; return x; }; };
    fang(a); fang(b); __dbg.playSound('mix_p3test', 0.6, null, { noGap: true, rate: 1 }); await new Promise(r => setTimeout(r, 700)); delete __dbg.MISCHTON.mix_p3test;
    return JSON.stringify({ a, b, spuren }); })()`));
  const sa = r3.spuren.find(x => x.k === r3.a), sb = r3.spuren.find(x => x.k === r3.b);
  pruef('Mischton: beide Spuren spielen', r3.spuren.length === 2 && !!sa && !!sb, JSON.stringify(r3.spuren));
  pruef('Mischton: Startversatz der zweiten Spur (ca. 220 ms)', !!sa && !!sb && sb.t - sa.t > 150 && sb.t - sa.t < 400, sa && sb ? (sb.t - sa.t) + ' ms' : '');
  pruef('Mischton: Lautstärke und Tonhöhe je Spur', !!sa && !!sb && sb.vol < sa.vol * 0.62 && sb.vol > sa.vol * 0.38 && Math.abs(sb.rate - 0.8) < 0.02 && Math.abs(sa.rate - 1) < 0.02, sa && sb ? `Lautstärke ${sa.vol} / ${sb.vol}, Tonhöhe ${sa.rate} / ${sb.rate}` : '');
  // 4. Pult-Wahl greift dort, wo sie bis 2026-11-23 nie ankam: Waffenton (Marke aus waffenTon), Ton ohne playSound (tonPick), Rolle Handelnde/Getroffene
  const r4 = JSON.parse(await ev(`(async () => { const S = __dbg.SND, P = window.SOUND_POOLS, T = __dbg.TONWAHL, u = { id: 99001, type: 'kohorte', side: 'A' }, gespielt = [], ziel = P.einschlagH[0][0], alt = T.kohorte;
    const o = S[ziel], c = o.cloneNode.bind(o); o.cloneNode = () => { gespielt.push(ziel); return c(); }; __dbg.setSound(true);
    T.kohorte = { rifle: { k: ziel, r: 'a' } }; __dbg.playSound(__dbg.waffenTon('rifle', u), 0.3, 'A', { noGap: true }); const mitWahl = gespielt.length;
    T.kohorte = { rifle: { k: ziel, r: 'z' } }; gespielt.length = 0; __dbg.playSound(__dbg.waffenTon('rifle', u), 0.3, 'A', { noGap: true }); const falscheRolle = gespielt.length;
    T.kohorte = { flame: { k: ziel, r: 'a' } }; const pick = __dbg.tonPick('flame', u);
    T.kohorte = { heavy: { k: 'x', r: 'a' }, 'heavy#z': { k: ziel, r: 'z' } }; gespielt.length = 0; __dbg.playSound('heavy', 0.3, null, { noGap: true, an: u }); const zweite = gespielt.length;
    if (alt) T.kohorte = alt; else delete T.kohorte; gespielt.length = 0; __dbg.playSound(__dbg.waffenTon('rifle', u), 0.3, 'A', { noGap: true }); const ohne = gespielt.length;
    return JSON.stringify({ ziel, mitWahl, falscheRolle, pick, zweite, ohne }); })()`));
  pruef('Pult-Wahl greift beim Waffenton der Einheit (Gewehrsalve)', r4.mitWahl === 1 && r4.ohne === 0, 'gewählter Ton ' + r4.ziel + ' gespielt: ' + r4.mitWahl + '×, ohne Wahl: ' + r4.ohne + '×');
  pruef('Wahl einer Getroffen-Zeile gilt nicht für den Schuss derselben Einheit', r4.falscheRolle === 0);
  pruef('Pult-Wahl greift bei Tönen ohne playSound (Flammenschleife, Motor, Sperrfeuer-Abschuss)', r4.pick === r4.ziel, String(r4.pick));
  pruef('derselbe Platz in Handeln- und Getroffen-Zeile: die Getroffen-Wahl klingt, wenn die Einheit getroffen wird', r4.zweite === 1);
  // 5. Eigenes Paket (Punkt 25, 2026-11-24): drei Töne aus zwei Rubriken (Einschläge, Treffer auf Stein), im Spiel abwechselnd, nie zweimal hintereinander derselbe
  const r5 = JSON.parse(await ev(`(async () => { const S = __dbg.SND, P = window.SOUND_POOLS, T = __dbg.TONWAHL, u = { id: 99002, type: 'kohorte', side: 'A' }, alt = T.kohorte, folge = [];
    const pk = [P.einschlagH[0][0], P.einschlagH[1][0], S.impact ? 'impact' : P.impact[0][0]];
    for (const k of pk) { const o = S[k], c = o.cloneNode.bind(o); o.cloneNode = () => { folge.push(k); return c(); }; } __dbg.setSound(true);
    T.kohorte = { rifle: { pk, r: 'a' } }; for (let i = 0; i < 40; i++) __dbg.playSound(__dbg.waffenTon('rifle', u), 0.2, 'A', { noGap: true });
    const zweiMal = folge.filter((k, i) => i && k === folge[i - 1]).length; const n = folge.length, arten = [...new Set(folge)].length, vert = pk.map(k => folge.filter(x => x === k).length);
    T.kohorte = { rifle: { pk: [pk[0], 'gibt_es_nicht'], r: 'a' } }; folge.length = 0; for (let i = 0; i < 5; i++) __dbg.playSound(__dbg.waffenTon('rifle', u), 0.2, 'A', { noGap: true });
    const nurEchte = folge.every(k => k === pk[0]) && folge.length === 5;
    if (alt) T.kohorte = alt; else delete T.kohorte; return JSON.stringify({ pk, n, arten, zweiMal, nurEchte, vert }); })()`));
  pruef('eigenes Paket: alle drei Töne (zwei Rubriken) klingen abwechselnd', r5.arten === 3, 'Verteilung ' + r5.vert.join(' / ') + ' (' + r5.pk.join(', ') + ')');
  pruef('eigenes Paket: nie zweimal hintereinander derselbe Ton', r5.zweiMal === 0, r5.zweiMal + '× doppelt');
  pruef('eigenes Paket: fehlende Töne im Paket werden übergangen', r5.nurEchte);
  pruef('keine Fehler in der Konsole', fehler.length === 0, fehler.slice(0, 4).join(' | '));
} finally { ws.close(); ch.kill(); }
console.log(`\n${ok} Prüfungen bestanden, ${nicht} fehlgeschlagen.`); process.exit(nicht ? 1 : 0);
