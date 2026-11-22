// Test für das Ton-Pult 2 (tonpult.html): bedient die Seite im unsichtbaren Chrome mit echten Klicks, prüft Mehrfach-Zuweisung, Rückgängig,
// Lautstärke für mehrere, „Vom Ton aus“ und den Export, macht Aufnahmen nach entwurf/probe/tonpult2/ und prüft den Export mit tools/tonwahl_bau.mjs
// (src/ui.js wird dafür kurz geändert und danach wieder genau so hergestellt, wie es war).
// Aufruf: node tools/tonpult_test.mjs   (vorher node tools/tonpult_bau.mjs; kein Vorschau-Server nötig, die Seite wird als Datei geladen)
import { spawn, execFileSync } from 'node:child_process'; import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), AUS = join(ROOT, 'entwurf', 'probe', 'tonpult2'), URL_ = pathToFileURL(join(ROOT, 'tonpult.html')).href;
mkdirSync(AUS, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpult2-'))}`, '--no-first-run', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}, fehler = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; }
  if (m.method === 'Runtime.exceptionThrown') fehler.push('Ausnahme: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') fehler.push('console.error: ' + m.params.args.map(a => a.value || a.description).join(' ')); };
const cmd = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await cmd('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result?.result?.value; };
const groesse = (w, h) => cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
const bild = async name => { await sleep(250); const r = await cmd('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(AUS, name), Buffer.from(r.result.data, 'base64')); console.log('  Bild', 'entwurf/probe/tonpult2/' + name); };
let ok = 0, nicht = 0; const pruef = (was, gut, mehr = '') => { if (gut) ok++; else nicht++; console.log((gut ? '  ok    ' : '  FEHLER ') + was + (mehr ? ' – ' + mehr : '')); };
// Klick-Helfer in der Seite: Knopf nach Text (innerhalb eines Bereichs), Chip, Spaltenkopf
const HELFER = `window.T = { k: (sel, text) => { const b = [...document.querySelectorAll(sel)].find(b => b.offsetParent && b.textContent.trim().startsWith(text)); if (!b) throw new Error('nicht gefunden: ' + sel + ' ' + text); b.click(); return true; },
  regler: (name, wert) => { const l = [...document.querySelectorAll('#leiste label.regler')].find(l => l.textContent.trim().startsWith(name)), r = l.querySelector('input'); r.value = wert; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); return r.value; },
  an: () => angehakt().map(u => u.t) }; true`;
try {
  await cmd('Runtime.enable'); await cmd('Page.enable'); await groesse(1920, 1080);
  await cmd('Page.navigate', { url: URL_ });
  let geladen = false; for (let i = 0; i < 120 && !geladen; i++) { await sleep(500); try { geladen = await ev("typeof SND !== 'undefined' && !!SND && /Töne geladen/.test(document.getElementById('status').textContent)"); } catch { } }
  pruef('Seite und Töne geladen', geladen, await ev("document.getElementById('status').textContent"));
  await ev(HELFER);

  console.log('Bibliothek nach Gehör');
  const bib = await ev("JSON.stringify({ kat: D.bib.map(b => b.titel + ' ' + b.e.length), rest: D.bib.some(b => b.id === 'rest'), ohneDauer: Object.keys(SND).filter(k => D.dauer[k] == null).length, oger: PLATZKAT.oger_bruell, schnee: PLATZKAT.schnee_gruppe })");
  const B = JSON.parse(bib); console.log('  Rubriken:', B.kat.join(' · '));
  pruef('alle Töne haben eine Rubrik (keine „Übrigen“)', !B.rest); pruef('jeder Ton hat eine Länge', B.ohneDauer === 0, B.ohneDauer + ' ohne'); pruef('Oger-Brüllen steht unter Stimmen und Rufe', B.oger === 'stimmen'); pruef('Schritte im Schnee stehen unter Schritte', B.schnee === 'schritte');

  console.log('Tabelle');
  pruef('Ansicht Tabelle ist offen', await ev("!document.getElementById('vTabelle').hidden && document.querySelectorAll('.tt tbody tr:not(.gr)').length > 40"), await ev("document.querySelectorAll('.tt tbody tr:not(.gr)').length + ' Zeilen, ' + document.querySelectorAll('.tt thead th.sp').length + ' Spalten'"));
  await bild('01_tabelle_1920.png');
  await ev("T.k('.schnell .chip', 'Fußtruppen'); T.k('.schnell .chip', 'ganzes Konkordat'); T.k('.tt th.sp .spk', 'Ziehen')");
  const an = await ev('T.an()'); pruef('Schnellwahl Fußtruppen + ganzes Konkordat', an.length > 8 && await ev("angehakt().every(u => u.sd === 'A' && u.art === 'fuss')"), an.length + ' Einheiten: ' + an.join(', '));
  await bild('02_schnellwahl_fusstruppen_konkordat_ziehen.png');
  await ev("T.k('#leiste button', 'Ton aus der Bibliothek')"); await sleep(200);
  pruef('Bibliothek öffnet bei „Schritte“', await ev("!!document.getElementById('bibDlg') && bibKat === 'schritte'"));
  await bild('03_bibliothek_auswahl.png');
  await ev("document.querySelector('#bibDlg .bt[data-id=\"p:schnee_gruppe\"] .gold').click()"); await sleep(300);
  const z1 = JSON.parse(await ev("JSON.stringify(T.an().map(t => [t, ((AEND[t] || {}).ziehen || {}).w]))"));
  pruef('Mehrfach-Zuweisung: Schritte im Schnee bei allen angehakten', z1.every(x => x[1] === 'p:schnee_gruppe'), z1.filter(x => x[1] === 'p:schnee_gruppe').length + ' von ' + z1.length);
  pruef('nicht angehakte bleiben unverändert', await ev("Object.keys(AEND).every(t => T.an().includes(t))"));
  pruef('Marsch hat seit 21:00 einen eigenen Spiel-Platz: kein Hinweis „Gilt im Spiel auch für“ beim Ziehen', await ev("!/Gilt im Spiel auch für/.test(document.getElementById('leiste').textContent)"), await ev("(document.querySelector('#leiste .gilt') || {}).textContent || ''"));
  await bild('04_mehrfach_zugewiesen.png');
  await ev("T.regler('Lautstärke', 120)"); await sleep(150);
  pruef('Lautstärke 120 % für alle angehakten', await ev("T.an().every(t => { const u = U[t], s = u.slots.find(x => x.id === 'ziehen'); return Math.abs(wert(u, s).vol - Math.min(1, s.vol * 1.2)) < 0.002; })"));
  await ev("T.regler('Tonhöhe', 90)"); await sleep(150);
  pruef('Tonhöhe 90 % für alle angehakten', await ev("T.an().every(t => Math.abs(AEND[t].ziehen.ton - 0.9) < 0.001)"));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig 1: Tonhöhe zurück', await ev("T.an().every(t => AEND[t].ziehen.ton == null && AEND[t].ziehen.vol != null)"));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig 2: Lautstärke zurück', await ev("T.an().every(t => AEND[t].ziehen.vol == null && AEND[t].ziehen.w === 'p:schnee_gruppe')"));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig 3: ganze Mehrfach-Zuweisung zurück', await ev("Object.keys(AEND).length === 0"));
  await ev("T.k('#leiste button', 'Ton aus der Bibliothek')"); await sleep(150); await ev("document.querySelector('#bibDlg .bt[data-id=\"p:schnee_gruppe\"] .gold').click()"); await sleep(200);
  await ev("T.regler('Lautstärke', 120)");
  pruef('Speicher arm.tonpult im alten Format', await ev("(() => { const a = JSON.parse(localStorage.getItem('arm.tonpult')); return Object.keys(a).length === T.an().length && Object.values(a).every(e => e.ziehen && e.ziehen.w === 'p:schnee_gruppe'); })()"));
  for (const [w, hh] of [[1280, 720], [2560, 1440]]) { await groesse(w, hh); await sleep(300); pruef(`Kopfleiste läuft bei ${w} px nicht über den Rand`, await ev("document.querySelector('header').scrollWidth <= document.documentElement.clientWidth && document.documentElement.scrollWidth <= window.innerWidth")); await bild(`05_tabelle_${w}.png`); }
  await groesse(1920, 1080); await sleep(200);

  console.log('Vom Ton aus (Bibliothek)');
  await ev("T.k('#leiste button', 'Kein Ton')"); pruef('„Kein Ton“ für alle angehakten', await ev("T.an().every(t => AEND[t].ziehen.w === '-')"));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig stellt Ton und Lautstärke wieder her', await ev("T.an().every(t => AEND[t].ziehen.w === 'p:schnee_gruppe' && AEND[t].ziehen.vol != null)"));
  await ev("T.k('.schnell button', 'Auswahl leeren'); T.k('#ansichten button', 'Bibliothek')"); await sleep(200);
  await ev("T.k('.bibnav button', 'MG')"); await ev("document.querySelector('#vBib .bt[data-id=\"p:neu4_mg_schwer\"] .gold').click()"); await sleep(150);
  pruef('Ton-Karte zeigt „benutzt von“', await ev("/Benutzt von/i.test(document.getElementById('karte').textContent) && document.querySelectorAll('#karte .nutzvoll div').length > 0"), await ev("document.querySelector('#karte .nutzvoll').textContent.slice(0, 140)"));
  await ev("[...document.querySelectorAll('#karte .sg .chip')].filter(b => b.classList.contains('an') && ['Anklicken','Ziehen','Schuss','Treffer am Ziel','Nahkampf','Getroffen','Tod','Fähigkeiten','Ankunft','Rufe'].includes(b.textContent)).forEach(b => b.click()); true");
  await ev("T.k('#karte .sg .chip', 'Schuss'); T.k('#karte .schnell .chip', 'MG'); T.k('#karte .schnell .chip', 'ganze Aschenwacht')"); await sleep(150);
  const mgD = await ev('T.an()'); pruef('Schnellwahl MG + ganze Aschenwacht', mgD.length >= 1 && await ev("angehakt().every(u => u.sd === 'D' && u.waffe === 'mg')"), mgD.join(', '));
  await bild('06_bibliothek_vom_ton_aus.png');
  await ev("T.k('#karte .kfuss button', 'Zuweisen')"); await sleep(250);
  pruef('Zuweisung vom Ton aus: Schuss bei allen angehakten', await ev("T.an().every(t => { const u = U[t]; return wert(u, u.slots.find(x => x.id === 'schuss')).w === 'p:neu4_mg_schwer'; })"));
  pruef('„benutzt von“ zählt die neuen Stellen mit', await ev("nutzListe('p:neu4_mg_schwer').filter(r => T.an().includes(r.u.t)).length === T.an().length"));
  await bild('07_bibliothek_nach_zuweisung.png');
  await ev("bibSuche = ''; T.k('.bibnav button', 'Stimmen und Rufe')"); await sleep(150); await bild('08_bibliothek_stimmen.png');

  console.log('Einzelne Einheit');
  await ev("T.k('#ansichten button', 'Einzelne Einheit')"); await sleep(200);
  pruef('Einzelansicht wie bisher, mit Knopf „Bibliothek …“', await ev("!document.getElementById('vEinzeln').hidden && document.querySelectorAll('#pult .p').length > 5 && document.querySelectorAll('#pult .p .alle').length > 5"));
  await ev("T.k('#kats button', 'Stimmen')"); pruef('„Winter (Karte)“ steht jetzt in der Liste', await ev("[...document.querySelectorAll('#einheiten .e')].some(b => /Winter/.test(b.textContent))"));
  await bild('09_einzelne_einheit.png');

  console.log('Export und Einbau-Probe (tools/tonwahl_bau.mjs)');
  const exp = JSON.parse(await ev('JSON.stringify(exportDaten())'));
  pruef('Export-Format wie bisher (aenderungen je Einheit und Platz, roh)', Array.isArray(exp.aenderungen) && exp.roh && exp.aenderungen.every(a => a.einheit && a.platz_id && a.wahl && 'lautstaerke' in a && 'tonhoehe' in a), exp.aenderungen.length + ' Einträge');
  writeFileSync(join(AUS, 'export_test.json'), JSON.stringify(exp, null, 1));
  const UI = join(ROOT, 'src', 'ui.js'), vorher = readFileSync(UI), TMP = join(ROOT, 'entwurf', 'postfach', 'tonpult_test_tonpult2.json');
  try { writeFileSync(TMP, JSON.stringify(exp)); const aus = execFileSync(process.execPath, [join(ROOT, 'tools', 'tonwahl_bau.mjs')], { encoding: 'utf8' }); console.log('  ' + aus.trim().split('\n')[0]);
    const s = readFileSync(UI, 'utf8'), i = s.indexOf('const TONWAHL = ') + 16, TW = JSON.parse(s.slice(i, s.indexOf(';\n', i)));
    const fuss = exp.aenderungen.filter(a => a.platz_id === 'ziehen'), mg = exp.aenderungen.filter(a => a.platz_id === 'schuss');
    const f1 = fuss.filter(a => { const w = (TW[a.einheit] || {})[a.platz_spiel]; return w && w.p === 'schnee_gruppe' && Math.abs(w.vf - 1.2) < 0.02; });
    pruef('TONWAHL: Schritte im Schnee (Lautstärke ×1,2) bei allen Fußtruppen des Konkordats', f1.length === fuss.length && fuss.length === an.length, f1.length + ' von ' + fuss.length + ': ' + fuss.map(a => a.einheit + '.' + a.platz_spiel).join(', '));
    const m1 = mg.filter(a => { const w = (TW[a.einheit] || {})[a.platz_spiel]; return w && (w.p === 'neu4_mg_schwer' || (a.platz_spiel === 'neu4_mg_schwer' && !w.p)); });
    pruef('TONWAHL: schweres MG bei den MG-Einheiten der Aschenwacht (wer es schon als Standard hat, braucht keinen Eintrag)', m1.length === mg.length && mg.length >= 1, m1.length + ' von ' + mg.length + ': ' + mg.map(a => a.einheit + '.' + a.platz_spiel).join(', '));
  } finally { writeFileSync(UI, vorher); if (existsSync(TMP)) unlinkSync(TMP); }
  pruef('src/ui.js wieder unverändert', readFileSync(UI).equals(vorher));

  console.log('Fähigkeiten, Rufe, Suche, Favoriten, alter Export');
  await ev("T.k('#ansichten button', 'Tabelle'); T.k('.schnell button', 'Auswahl leeren'); T.k('.schnell .chip', 'MG'); T.k('.tt th.sp .spk', 'Fähigkeiten')"); await sleep(150);
  pruef('Fähigkeiten ohne gewählte Zeile: nichts zuweisbar', await ev("[...document.querySelectorAll('#leiste button')].find(b => b.textContent.startsWith('Ton aus')).disabled"));
  await ev("(() => { const s = [...document.querySelectorAll('.tt th.sp')].find(t => t.textContent.startsWith('Fähigkeiten')).querySelector('select'); s.value = 'mgauf'; s.dispatchEvent(new Event('change', { bubbles: true })); })()"); await sleep(150);
  await ev("T.k('#leiste button', 'Ton aus der Bibliothek')"); await sleep(150);
  pruef('Bibliothek öffnet für „MG aufstellen“ bei Handgriffe und Gerät', await ev("bibKat === 'handgriffe'"));
  await ev("document.querySelector('#bibDlg input[type=search]').value = 'mgsetup'; document.querySelector('#bibDlg input[type=search]').dispatchEvent(new Event('input', { bubbles: true }))"); await sleep(100);
  pruef('Suche nach Schlüssel findet den Ton', await ev("document.querySelectorAll('#bibDlg .bt').length >= 1 && !!document.querySelector('#bibDlg .bt[data-id=\"p:mgsetup\"]')"));
  await ev("document.querySelector('#bibDlg .bt[data-id=\"p:mgsetup\"] .stern').click()"); pruef('Favorit gemerkt (arm.tonpult.fav)', await ev("JSON.parse(localStorage.getItem('arm.tonpult.fav')).includes('p:mgsetup')"));
  await ev("document.querySelector('#bibDlg .bt[data-id=\"p:mgsetup\"] .gold').click()"); await sleep(200);
  pruef('Fähigkeit „MG aufstellen“ bei den MG-Trupps beider Seiten', await ev("['mahlwerk', 'sense'].every(t => AEND[t].mgauf.w === 'p:mgsetup') && T.an().filter(t => (AEND[t] || {}).mgauf).length === 2"), await ev("T.an().join(', ')"));
  await ev("document.querySelector('.tfilt input[type=checkbox]').click()"); await sleep(150);
  pruef('Spalten Ankunft und Rufe und Zeilen „Stimmen und Karte“ einblendbar', await ev("document.querySelectorAll('.tt thead th.sp').length === 10 && [...document.querySelectorAll('.tt .nm')].some(n => /Winter/.test(n.textContent))"));
  await bild('10_tabelle_mit_rufen.png');
  const vorImport = await ev('JSON.stringify(AEND)');
  const alt = readFileSync(join(ROOT, 'entwurf', 'postfach', 'tonpult_export_1002_2026-11-21.json'), 'utf8');
  await ev("document.getElementById('import').click(); document.getElementById('dlgFeld').value = " + JSON.stringify(alt) + "; [...document.querySelectorAll('#dlgKnoepfe button')].find(b => b.textContent === 'Übernehmen').click(); true"); await sleep(250);
  const imp = JSON.parse(await ev("(() => { const o = " + alt + ", r = o.roh || {}; let n = 0, gut = 0, fehlt = []; for (const t in r) { if (!U[t]) continue; for (const id in r[t]) { const s = U[t].slots.find(x => x.id === id); if (!s) continue; n++; const w = wert(U[t], s), e = r[t][id], g = grund(s); if (w.w === (e.w != null ? e.w : g.w) && Math.abs(w.vol - (e.vol != null ? e.vol : g.vol)) < 1e-6 && Math.abs(w.ton - (e.ton != null ? e.ton : 1)) < 1e-6) gut++; else fehlt.push(t + '.' + id); } } return JSON.stringify({ n, gut, fehlt }); })()"));
  pruef('Enricos älterer Export (21.11.) lässt sich unverändert einlesen', imp.n > 0 && imp.gut === imp.n, imp.gut + ' von ' + imp.n + ' Plätzen' + (imp.fehlt.length ? ', abweichend: ' + imp.fehlt.join(', ') : ''));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig nimmt den ganzen Import zurück', await ev('JSON.stringify(AEND)') === vorImport);
  pruef('keine Fehler in der Konsole', fehler.length === 0, fehler.slice(0, 5).join(' | '));
} finally { ws.close(); ch.kill(); }
console.log(`\n${ok} Prüfungen bestanden, ${nicht} fehlgeschlagen.`); process.exit(nicht ? 1 : 0);
