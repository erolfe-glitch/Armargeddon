// Test für das Ton-Pult (tonpult.html), Ton-Pult 3 (drei Schritte, Abstellkammer, Umsortieren, Mischtöne; Aufnahmen nach entwurf/probe/tonpult3/) und Ton-Pult 2 (Experten-Ansicht): bedient die Seite im unsichtbaren Chrome mit echten Klicks, prüft Mehrfach-Zuweisung, Rückgängig,
// Lautstärke für mehrere, „Vom Ton aus“ und den Export, macht Aufnahmen nach entwurf/probe/tonpult2/ und prüft den Export mit tools/tonwahl_bau.mjs
// (src/ui.js wird dafür kurz geändert und danach wieder genau so hergestellt, wie es war).
// Aufruf: node tools/tonpult_test.mjs   (vorher node tools/tonpult_bau.mjs; kein Vorschau-Server nötig, die Seite wird als Datei geladen)
import { spawn, execFileSync } from 'node:child_process'; import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), AUS = join(ROOT, 'entwurf', 'probe', 'tonpult2'), URL_ = pathToFileURL(join(ROOT, 'tonpult.html')).href;
mkdirSync(AUS, { recursive: true }); const AUS3 = join(ROOT, 'entwurf', 'probe', 'tonpult3'); mkdirSync(AUS3, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms)), port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', ...(process.env.OHNE_GPU ? ['--disable-gpu', '--use-angle=swiftshader'] : []), `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'armpult2-'))}`, '--no-first-run', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
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
const bild3 = async name => { await sleep(300); const r = await cmd('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(AUS3, name), Buffer.from(r.result.data, 'base64')); console.log('  Bild', 'entwurf/probe/tonpult3/' + name); };
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

  // ================= Ton-Pult 3 (Enrico 2026-11-23) =================
  console.log('Ton-Pult 3: Wer? – Wann? – Welcher Ton?');
  pruef('Startansicht „Töne einstellen“ mit drei Spalten', await ev("ansicht === 'einfach' && !document.getElementById('vEinfach').hidden && ['e3wer', 'e3wann', 'e3ton'].every(id => document.getElementById(id))"));
  pruef('Einheitenbilder groß und antippbar (mindestens 40 px)', await ev("[...document.querySelectorAll('.e3k')].length > 20 && [...document.querySelectorAll('#vEinfach button')].every(b => !b.offsetParent || (b.offsetHeight >= 40 && b.offsetWidth >= 40))"), await ev("[...document.querySelectorAll('#vEinfach button')].filter(b => b.offsetParent && (b.offsetHeight < 40 || b.offsetWidth < 40)).map(b => b.className + ' ' + b.offsetWidth + 'x' + b.offsetHeight).slice(0, 5).join(', ')"));
  await ev("document.querySelector('.e3k[data-t=\"kohorte\"]').click()"); await sleep(150);
  await bild3('01_drei_schritte_1920.png');
  const voll = JSON.parse(await ev("JSON.stringify((() => { const falsch = []; for (const u of D.einheiten) { e3Wahl([u.t], false); const ids = []; for (const b of document.querySelectorAll('.e3m[data-ab]')) { b.click(); const b2 = document.querySelector('.e3m[data-ab=\"' + b.dataset.ab + '\"]'); if (!b2 || !b2.classList.contains('an')) { falsch.push(u.t + ': Moment ' + b.dataset.ab + ' öffnet nicht'); continue; } for (const r of document.querySelectorAll('.e3sl .e3s1')) ids.push(r.dataset.id); } const soll = u.slots.map(s => s.id).sort().join(','), ist = ids.sort().join(','); if (soll !== ist) falsch.push(u.t + ': Kacheln ' + ist + ' ≠ Plätze ' + soll); const mo = [...document.querySelectorAll('.e3m[data-ab]')].map(b => b.dataset.ab).sort().join(','), ms = [...new Set(u.slots.map(s => s.ab))].sort().join(','); if (mo !== ms) falsch.push(u.t + ': Momente ' + mo + ' ≠ ' + ms); } return { n: D.einheiten.length, falsch }; })())"));
  pruef('je Einheit: Kacheln im Pult == Tonplätze der Einheit (nichts fehlt, nichts zu viel)', voll.falsch.length === 0, voll.n + ' Einheiten' + (voll.falsch.length ? ', abweichend: ' + voll.falsch.slice(0, 4).join(' | ') : ''));
  const ohneSchuss = await ev("(D.einheiten.find(u => echt(u) && !u.slots.some(s => s.ab === 'schuss')) || {}).t || ''");
  // Spiel == Pult (Ton-Spur aus dem laufenden Spiel: node tools/ton_spur.mjs; Vergleich: node tools/test_tonplaetze.mjs)
  { let aus = '', gut = true; try { aus = execFileSync(process.execPath, [join(ROOT, 'tools', 'test_tonplaetze.mjs')], { encoding: 'utf8', env: { ...process.env, KURZ: '1' } }); } catch (e) { gut = false; aus = String(e.stdout || e.message); }
    const z = aus.trim().split(String.fromCharCode(10)); pruef('je Einheit: im Spiel mögliche Tonplätze == Zeilen im Pult (Ton-Spur aus dem Spiel)', gut, z.slice(-2).join(' ').slice(0, 260) + (aus.includes('WARNUNG') ? ' – Achtung: Spur älter als src/ui.js' : '')); }
  if (ohneSchuss) { await ev("e3Wahl(['" + ohneSchuss + "'], false)"); pruef('Einheit ohne Schuss (' + ohneSchuss + ') hat keine Kachel „Schießen“', await ev("!document.querySelector('.e3m[data-ab=\"schuss\"]') && document.querySelectorAll('.e3m[data-ab]').length > 2")); }
  await ev("e3Wahl(['kohorte'], false); document.querySelector('.e3m[data-ab=\"zug\"]').click()"); await sleep(100); await ev("document.querySelector('.e3s1[data-id=\"ziehen\"]').click()"); await sleep(100);
  pruef('Schritt 3 zeigt nur passende Töne (Laufen → Rubrik Schritte, keine Waffen)', await ev("(() => { const ids = [...document.querySelectorAll('#e3ton .t3')].map(r => r.dataset.id); return ids.includes('p:schnee_gruppe') && ids.includes('p:schritte') && !ids.some(id => /rifle|mg|cannon|boom/.test(id)); })()"), await ev("[...document.querySelectorAll('#e3ton .e3g')].map(b => b.textContent.trim()).join(' · ')"));
  const f0 = await ev("fortschritt([U.kohorte]).n");
  await ev("document.querySelector('#e3ton .t3[data-id=\"p:schnee_gruppe\"]').click()"); await sleep(250);
  pruef('Antippen = gewählt: Schritte im Schnee bei der Schützenkohorte, Stelle hat einen Haken', await ev("AEND.kohorte.ziehen.w === 'p:schnee_gruppe' && document.querySelector('.e3s1[data-id=\"ziehen\"]').classList.contains('fertig')"));
  await bild3('02_ton_gewaehlt.png');
  await ev("document.querySelector('.e3s1[data-id=\"marsch\"]').click()"); await sleep(100); await ev("document.getElementById('e3passt').click()"); await sleep(150);
  pruef('„Passt so“ hakt die Stelle ab, ohne den Ton zu ändern, und springt zur nächsten offenen', await ev("FERTIG.kohorte.marsch === 1 && !AEND.kohorte.marsch && E3.slot !== 'marsch' && JSON.parse(localStorage.getItem('arm.tonpult.fertig')).kohorte.marsch === 1"), await ev("E3.ab + '/' + E3.slot"));
  await ev("[...document.querySelectorAll('#e3wann .e3kn button')].find(b => /Alles Übrige/.test(b.textContent)).click()"); await sleep(200);
  const f1 = JSON.parse(await ev("JSON.stringify(fortschritt([U.kohorte]))"));
  pruef('Fortschritt: Einheit einmal durchgegangen = fertig', f1.n === f1.von && f1.von >= 7 && f0 < f1.n && await ev("document.querySelector('.e3k[data-t=\"kohorte\"]').classList.contains('fertig') && /fertig/.test(document.querySelector('.e3fort').textContent) && /✓ fertig/.test(document.querySelector('.e3k[data-t=\"kohorte\"] .fs').textContent)"), f1.n + ' von ' + f1.von + ' Momenten');
  await bild3('03_einheit_fertig.png');
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig nimmt „Alles Übrige passt so“ zurück', await ev("fortschritt([U.kohorte]).n < " + f1.von + " && FERTIG.kohorte.marsch === 1 && AEND.kohorte.ziehen.w === 'p:schnee_gruppe'"));
  await ev("document.getElementById('undo').click(); document.getElementById('undo').click()"); pruef('Rückgängig bis zum Anfang', await ev("Object.keys(AEND).length === 0 && Object.keys(FERTIG).length === 0"));
  await ev("[...document.querySelectorAll('.e3chips .chip')].find(b => b.textContent === 'Fußtruppen').click()"); await sleep(150);
  const mehr = await ev("E3.wer.length"); await ev("document.querySelector('.e3m[data-ab=\"zug\"]').click()"); await sleep(80); await ev("document.querySelector('.e3s1[data-id=\"ziehen\"]').click()"); await sleep(80);
  await ev("document.querySelector('#e3ton .t3[data-id=\"p:schnee_gruppe\"]').click()"); await sleep(250);
  pruef('Gruppenknopf „Fußtruppen“ wählt mehrere; ein Antippen stellt alle ein', mehr > 5 && await ev("E3.wer.every(t => !U[t].slots.some(s => s.id === 'ziehen') || AEND[t].ziehen.w === 'p:schnee_gruppe') && Object.keys(AEND).length > 5"), mehr + ' Einheiten');
  await bild3('04_mehrere_einheiten.png');
  await ev("document.getElementById('undo').click(); e3Wahl(['kohorte'], false)");
  await ev("document.getElementById('e3alle').click()"); await sleep(200);
  pruef('„Alle Töne ansehen“ öffnet die ganze Bibliothek', await ev("!!document.getElementById('bibDlg') && document.querySelectorAll('#bibDlg .bibnav button').length >= 15 && document.querySelectorAll('#bibDlg .t3').length > 3"));
  await bild3('05_alle_toene_dialog.png'); await ev("document.querySelector('#bibDlg .akopf .x').click()");

  console.log('Ton-Pult 3: Bibliothek nach Gehör, Umsortieren, Herkunft');
  pruef('neue Rubrik „Graben und Schanzen“ mit Schaufeln, Atmen, Sandsäcken, Draht', await ev("['schaufel', 'atmen', 'sandsaecke', 'draht_schneiden', 'drahtwackeln'].every(p => PLATZKAT[p] === 'graben') && BIBKAT.graben.titel === 'Graben und Schanzen' && !!BIBKAT.handgriffe"));
  pruef('unsichere Einsortierungen tragen ein „?“', await ev("D.unsicher.length >= 5") && (await ev("(() => { ansicht = 'alle'; B3.rub = 'stimmen'; B3.suche = ''; zeichne(); return !!document.querySelector('#vAlle .t3[data-id=\"p:charge\"] .mk.frage'); })()")), await ev("D.unsicher.join(', ')"));
  pruef('jede Stimme zeigt ihre Herkunft (Suno, ElevenLabs, Helden, Freesound u. a.)', await ev("herk3(D.pools.sv_inf_A1[0][0]) === 'suno' && herk3(D.pools.stimmen_paket[0][0]) === 'el' && herk3(D.pools.hst_faust_tod[0][0]) === 'helden' && herk3(D.pools.pain[1][0]) === 'sonst' && !!document.querySelector('#vAlle .t3 .mk.hk-el')"));
  await bild3('06_alle_toene_stimmen.png');
  await ev("B3.rub = 'graben'; zeichne()"); await sleep(100); await bild3('07_rubrik_graben_und_schanzen.png');
  await ev("document.querySelector('#vAlle .t3[data-id=\"p:atmen\"] .kl3.rub').click()"); await ev("(() => { const s = document.querySelector('#vAlle .t3[data-id=\"p:atmen\"] select'); s.value = 'stimmen|Husten, Atmen, Maske'; s.dispatchEvent(new Event('change', { bubbles: true })); })()"); await sleep(150);
  pruef('Umsortieren: „Schweres Atmen“ nach Stimmen verschoben, gespeichert', await ev("PLATZKAT.atmen === 'stimmen' && RUBRIK['p:atmen'] === 'stimmen|Husten, Atmen, Maske' && JSON.parse(localStorage.getItem('arm.tonpult.rubrik'))['p:atmen'] && !document.querySelector('#vAlle .t3[data-id=\"p:atmen\"]')"));
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig stellt die Rubrik wieder her', await ev("PLATZKAT.atmen === 'graben' && !RUBRIK['p:atmen']"));
  await ev("B3.herk = 'suno'; zeichne()"); pruef('Filter je Herkunft: nur Suno-Sprüche', await ev("document.querySelectorAll('#vAlle .t3').length > 20 && [...document.querySelectorAll('#vAlle .t3')].every(r => /^p:sv_/.test(r.dataset.id))")); await ev("B3.herk = null; true");

  console.log('Ton-Pult 3: Abstellkammer');
  const k0 = await ev("D.pools.schritte[0][0]");
  await ev("ansicht = 'einfach'; e3Wahl(['kohorte'], false); E3.ab = 'zug'; E3.slot = 'ziehen'; zeichne(); e3Offen.add('p:schritte'); zeichneTon(); document.querySelector('#e3ton .t3[data-id=\"k:" + k0 + "\"] .raus').click()"); await sleep(200);
  pruef('Aussortieren: Ton verschwindet aus der Auswahl und aus der Zufallsgruppe, liegt in der Abstellkammer', await ev("AUS.toene.includes('k:" + k0 + "') && AUS_K.has('" + k0 + "') && !kandidaten('schritte', 'A', null).some(c => c.k === '" + k0 + "') && kandidaten('schritte', 'A', null).length >= 1 && !document.querySelector('#e3ton .t3[data-id=\"k:" + k0 + "\"]') && !!SND['" + k0 + "']"));
  await ev("document.querySelector('#ansichten [data-a=\"kammer\"]').click()"); await sleep(150);
  pruef('Abstellkammer zeigt den Ton mit „Zurückholen“', await ev("!!document.querySelector('#vKammer .t3[data-id=\"k:" + k0 + "\"] .gold')"));
  const einzig = JSON.parse(await ev("JSON.stringify((() => { for (const u of D.einheiten) if (echt(u)) for (const s of u.slots) if (s.mode !== 'ruf' && s.platz !== '-' && D.pools[s.platz] && D.pools[s.platz].length === 1 && kandidaten(s.platz, s.sd, s.v).length === 1) return { t: u.t, id: s.id, p: s.platz }; })())"));
  await ev("aussortieren('p:" + einzig.p + "')"); await sleep(150);
  pruef('einziger Ton einer Stelle bleibt im Spiel und ist markiert „⚠ aussortiert, bitte Ersatz wählen“', await ev("brauchtErsatz(U['" + einzig.t + "'], U['" + einzig.t + "'].slots.find(s => s.id === '" + einzig.id + "')) && kandidaten('" + einzig.p + "', U['" + einzig.t + "'].sd, null).length === 1 && /Bitte Ersatz wählen/.test(document.getElementById('vKammer').textContent)"), einzig.t + ' · ' + einzig.id + ' (' + einzig.p + ')');
  await bild3('08_abstellkammer.png');
  await ev("springZu(U['" + einzig.t + "'], U['" + einzig.t + "'].slots.find(s => s.id === '" + einzig.id + "'))"); await sleep(150);
  pruef('die Stelle zeigt die Warnung im Pult', await ev("/aussortiert, bitte Ersatz wählen/.test((document.querySelector('#e3ton .e3warn') || {}).textContent || '') && !!document.querySelector('.e3s1.an .st.warn')")); await bild3('09_ersatz_waehlen.png');
  await ev("ansicht = 'kammer'; zeichne(); document.querySelector('#vKammer .schalter[data-b=\"h:el\"]').click()"); await sleep(200);
  pruef('ganzer Bereich „ElevenLabs (Stimmen)“ abgeschaltet – Heldenstimmen bleiben unberührt', await ev("AUS.bereiche.includes('h:el') && D.pools.stimmen_paket.every(x => AUS_K.has(x[0])) && D.pools.sst_auswahl.every(x => AUS_K.has(x[0])) && !D.pools.hst_faust_tod.some(x => AUS_K.has(x[0])) && !D.pools.hst_kuerass_tod.some(x => AUS_K.has(x[0])) && document.querySelector('#vKammer .schalter[data-b=\"h:el\"]').classList.contains('aus')"));
  await ev("document.querySelector('#vKammer .schalter[data-b=\"s:sv_inf_A2\"]').click()"); await sleep(150);
  pruef('Sprechergruppe abschaltbar (Fußtruppen Konkordat, Stimme 2)', await ev("D.pools.sv_inf_A2.every(x => AUS_K.has(x[0])) && !D.pools.sv_inf_A1.some(x => AUS_K.has(x[0])) && !kandidaten('sv_inf_A', 'A', null).some(c => D.pools.sv_inf_A2.some(x => x[0] === c.k))"));
  await bild3('10_bereiche_abgeschaltet.png');
  await ev("document.querySelector('#vKammer .schalter[data-b=\"h:el\"]').click()"); await sleep(120); await ev("document.querySelector('#vKammer .t3[data-id=\"k:" + k0 + "\"] .gold').click()"); await sleep(150);
  pruef('Zurückholen und wieder einschalten mit einem Klick', await ev("!AUS.toene.includes('k:" + k0 + "') && !AUS_K.has('" + k0 + "') && !AUS.bereiche.includes('h:el') && !D.pools.stimmen_paket.some(x => AUS_K.has(x[0]))"));

  console.log('Ton-Pult 3: Mischton bauen');
  await ev("document.querySelector('#ansichten [data-a=\"misch\"]').click()"); await sleep(120);
  pruef('bestehende Mischtöne aus sound_bau.json lassen sich als Vorlage öffnen', await ev("D.mixe.length >= 5 && (() => { [...document.querySelectorAll('#vMisch .m3l .m3e button')].find(b => b.textContent === 'Als Vorlage öffnen').click(); return M3.spuren.length >= 1 && /neu$/.test(M3.name); })()"), await ev("M3.name + ': ' + M3.spuren.map(s => s.k).join(' + ')"));
  await ev("M3 = { key: null, name: 'Test Einschlag mit Erdregen', rubrik: '', spuren: [{ k: D.pools.einschlagH[0][0], vol: 1, ms: 0, ton: 1 }, { k: D.pools.neu2_einschlag[0][0], vol: 0.6, ms: 180, ton: 0.9 }] }; zeichneMisch()"); await sleep(100);
  await ev("(() => { const r = document.querySelectorAll('#vMisch .m3s')[1].querySelectorAll('input[type=range]')[1]; r.value = 250; r.dispatchEvent(new Event('input', { bubbles: true })); })()");
  pruef('Spur-Regler: Lautstärke, Startversatz (ms), Tonhöhe je Spur', await ev("M3.spuren[1].ms === 250 && document.querySelectorAll('#vMisch .m3s').length === 2 && document.querySelectorAll('#vMisch .m3s input[type=range]').length === 6"));
  const hoer = await ev("(async () => { document.getElementById('m3hoer').click(); await new Promise(r => setTimeout(r, 700)); return [laufend.size, Object.keys(MIX_BUF).length, MIX_AC ? MIX_AC.state : '-'].join('/'); })()");
  pruef('▶ spielt die Mischung sofort (WebAudio, beide Spuren dekodiert)', /^\d+\/2\//.test(hoer), hoer);
  await bild3('11_mischton_bauen.png');
  await ev("stoppAlles(); document.getElementById('m3speichern').click()"); await sleep(200);
  const mk = await ev("Object.keys(MISCH)[0] || ''");
  pruef('Speichern unter eigenem Namen: steht in der Bibliothek und ist zuweisbar', mk === 'mix_test_einschlag_mit_erdregen' && await ev("zuweisbar('k:" + mk + "') && bibListe(rubrikVon('k:" + mk + "')[0]).some(it => it.id === 'k:" + mk + "') && D.dauer['" + mk + "'] > 1 && JSON.parse(localStorage.getItem('arm.tonpult.misch'))['" + mk + "'].spuren.length === 2"), mk);
  await ev("ansicht = 'einfach'; e3Wahl(['haubitze'], false); E3.ab = 'ziel'; E3.slot = 'ziel'; zeichne()"); await sleep(120);
  const hatMix = await ev("!!document.querySelector('#e3ton .t3[data-id=\"k:" + mk + "\"]')"); if (hatMix) await ev("document.querySelector('#e3ton .t3[data-id=\"k:" + mk + "\"]').click()"); await sleep(250);
  pruef('Mischton erscheint bei den passenden Tönen (Einschlag) und lässt sich zuweisen', hatMix && await ev("AEND.haubitze.ziel.w === 'k:" + mk + "' && /Test Einschlag/.test(document.querySelector('.e3jetzt').textContent)"));
  await bild3('12_mischton_zugewiesen.png');

  console.log('Ton-Pult 3: Eigenes Paket (Punkt 25)');
  const PK = JSON.parse(await ev(`JSON.stringify((() => { ansicht = 'einfach'; e3Wahl(['kohorte', 'grenadier'], true); E3.ab = 'zug'; E3.slot = 'ziehen'; zeichne();
    const ent = slotsGemeinsam(werListe(), 'zug').get('ziehen'), kE = D.pools.einschlagH[0][0], kS = (D.pools.schritte || [])[0][0];
    return { gemeinsam: ent ? ent.ziele.length : 0, kE, kS, rE: rubrikVon(idVon('einschlagH'))[0], rS: rubrikVon(idVon('schritte'))[0], rM: rubrikVon('k:${mk}')[0] }; })())`));
  pruef('Mehrere wählen: Stelle „Ziehen“ gilt für beide Einheiten', PK.gemeinsam === 2, PK.gemeinsam + ' Einheiten');
  await ev(`(() => { const z = slotsGemeinsam(werListe(), 'zug').get('ziehen').ziele; waehle3(z, 'k:${PK.kS}', 'Ziehen'); stoppAlles(); return true; })()`); await sleep(100);   // Start mit einem einzelnen Ton: er wird der erste im Paket
  const kreuz = async (sel, k) => ev(`(() => { const r = [...document.querySelectorAll('${sel} .t3')].find(r => r.dataset.id === 'k:${k}' || (r.dataset.id.startsWith('p:') && platzKeys(r.dataset.id.slice(2)).length === 1 && platzKeys(r.dataset.id.slice(2))[0][0] === '${k}')); if (!r) return 'Zeile fehlt'; const cb = r.querySelector('.pk3 input'); if (!cb) return 'kein Ankreuzfeld'; cb.click(); return 'ok'; })()`);
  const such = async q => ev(`(() => { const i = document.querySelector('#bibDlg input[type=search]'); i.value = ${JSON.stringify(q)}; i.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
  await ev("document.getElementById('e3alle').click()"); await sleep(150);
  await such(mk); await sleep(100); const k1 = await kreuz('#bibDlg', mk);
  await such(PK.kE); await sleep(100); const k2 = await kreuz('#bibDlg', PK.kE);
  pruef('„Alle Töne ansehen“: Ankreuzen nimmt Töne ins Paket, das Fenster bleibt offen', k1 === 'ok' && k2 === 'ok' && await ev("!!document.getElementById('bibDlg')"), k1 + ' / ' + k2);
  await bild3('14_eigenes_paket_alle_toene.png');
  await ev("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); e3Offen.add('p:schritte'); zeichneTon()"); await sleep(120);
  const k3 = 'ok';
  const pk3 = JSON.parse(await ev("JSON.stringify([AEND.kohorte.ziehen.w, AEND.grenadier.ziehen.w])"));
  pruef('Einzelner Ton + 2 angekreuzte: Paket aus 3 Tönen dreier Rubriken (mit eigenem Mischton) für beide gewählten Einheiten', k3 === 'ok' && pk3[0] === pk3[1] && /^pk:/.test(pk3[0]) && JSON.parse(pk3[0].slice(3)).length === 3 && JSON.parse(pk3[0].slice(3)).includes(mk) && new Set([PK.rE, PK.rS, PK.rM]).size >= 2, pk3[0] + ' · Rubriken ' + [PK.rE, PK.rS, PK.rM].join(', '));
  pruef('Anzeige „Eigenes Paket · 3 Töne“ mit ▶ und ✕ je Ton', await ev("/Eigenes Paket · 3 Töne/.test(document.getElementById('e3pkkopf').textContent) && document.querySelectorAll('#e3ton .e3pk .t3').length === 3 && document.querySelectorAll('#e3ton .e3pk .t3 .play').length === 3 && document.querySelectorAll('#e3ton .e3pk .pkx').length === 3 && /Eigenes Paket/.test(document.querySelector('.e3jetzt').textContent)"));
  pruef('Ankreuzfelder sind fingergroß (mindestens 40 px)', await ev("[...document.querySelectorAll('#e3ton .pk3')].filter(l => l.offsetParent).every(l => l.offsetHeight >= 40)"));
  await bild3('15_eigenes_paket.png');
  const aus0 = await ev("AUS.toene.length"); await ev("document.querySelector('#e3ton .e3pk .pkx').click()"); await sleep(120);
  pruef('✕ nimmt den Ton nur aus diesem Paket (nicht aussortiert)', await ev("JSON.parse(AEND.kohorte.ziehen.w.slice(3)).length === 2 && AEND.grenadier.ziehen.w === AEND.kohorte.ziehen.w && AUS.toene.length === " + aus0 + " && /· 2 Töne/.test(document.getElementById('e3pkkopf').textContent)"));
  const PB = JSON.parse(await ev(`JSON.stringify((() => { const u = D.einheiten.find(u => !['kohorte', 'grenadier'].includes(u.t) && u.slots.some(s => s.id === 'ziehen' && !geaendert(u, s) && kandidaten(s.platz, s.sd, s.v).length > 2)); if (!u) return {}; const s = u.slots.find(s => s.id === 'ziehen');
    e3Wahl([u.t], false); E3.ab = s.ab; E3.slot = 'ziehen'; zeichne(); const n0 = kandidaten(s.platz, s.sd, s.v).filter(c => !AUS_K.has(c.k)).length, kx = D.pools.einschlagH[0][0];
    const pkO = paketOpt(slotsGemeinsam([u], s.ab).get('ziehen').ziele, s.titel); pkO.um([kx]); const w29 = AEND[u.t].ziehen.w; document.getElementById('undo').click();   /* Punkt 29: erstes Kreuz bei Werks-Paket */
    const b = document.getElementById('e3pkbearb'); if (!b) return { t: u.t, knopf: false }; b.click(); const w = AEND[u.t].ziehen.w, n = kandidaten(s.platz, s.sd, s.v).filter(c => !AUS_K.has(c.k)).length;
    const alle = [...document.querySelectorAll('#e3ton .t3')].filter(r => r.dataset.id === 'p:' + s.platz).every(r => r.querySelector('.pk3 input').checked); return { t: u.t, knopf: true, w, n, alle, w29, n0, kx }; })())`));
  pruef('Punkt 29: erstes „+ ins Paket“ bei Werks-Paket nimmt alle seine Töne mit, der neue kommt dazu', /^pk:/.test(PB.w29 || '') && JSON.parse(PB.w29.slice(3)).length === PB.n0 + 1 && JSON.parse(PB.w29.slice(3)).includes(PB.kx), (PB.t || '-') + ': ' + (PB.w29 ? JSON.parse(PB.w29.slice(3)).length : 0) + ' Töne (Werks-Paket ' + PB.n0 + ' + 1)');
  pruef('„Paket bearbeiten“: vorhandenes Paket als Start, alle seine Töne angekreuzt', PB.knopf && /^pk:/.test(PB.w) && JSON.parse(PB.w.slice(3)).length === PB.n && PB.alle, (PB.t || '-') + ': ' + (PB.n || 0) + ' Töne übernommen');
  await ev("document.getElementById('undo').click()"); await sleep(80);
  pruef('„↶ Rückgängig“ nimmt „Paket bearbeiten“ zurück', await ev("!geaendert(U['" + PB.t + "'], U['" + PB.t + "'].slots.find(s => s.id === 'ziehen'))"));

  console.log('Ton-Pult 3: Export, Import, Einbau ins Spiel');
  await ev("aussortieren('k:" + k0 + "')"); await sleep(100);
  const exp3 = JSON.parse(await ev('JSON.stringify(exportDaten())'));
  pruef('Export: altes Format plus Abstellkammer, Rubriken, Mischtöne (Rezept), „passt so“', Array.isArray(exp3.aenderungen) && !!exp3.roh && exp3.pult3 === 1 && exp3.aussortiert.toene.includes('k:' + k0) && exp3.aussortiert.schluessel.includes(k0) && exp3.aussortiert.bereiche.includes('s:sv_inf_A2') && exp3.mischtoene.length === 1 && exp3.mischtoene[0].spuren.length === 2 && exp3.aenderungen.some(a => a.wahl === 'k:' + mk), exp3.aenderungen.length + ' Änderungen, ' + exp3.aussortiert.schluessel.length + ' aussortierte Schlüssel');
  pruef('Export: eigenes Paket als Wahl pk:[…] mit Schlüsselliste', exp3.aenderungen.some(a => a.einheit === 'kohorte' && /^pk:\[/.test(a.wahl) && Array.isArray(a.paket) && a.paket.length === 2) && /pk:/.test(exp3.hinweis));
  writeFileSync(join(AUS3, 'export_test.json'), JSON.stringify(exp3, null, 1));
  await ev("(() => { for (const k of ['arm.tonpult', 'arm.tonpult.fertig', 'arm.tonpult.aus', 'arm.tonpult.rubrik', 'arm.tonpult.misch']) localStorage.removeItem(k); AEND = {}; zusatzSetzen(JSON.stringify({})); zeichne(); return Object.keys(MISCH).length + AUS.toene.length; })()");
  await ev("document.getElementById('import').click(); document.getElementById('dlgFeld').value = " + JSON.stringify(JSON.stringify(exp3)) + "; [...document.querySelectorAll('#dlgKnoepfe button')].find(b => b.textContent === 'Übernehmen').click(); true"); await sleep(250);
  pruef('Import stellt alles wieder her (Wahl, Abstellkammer, Mischton, eigenes Paket)', await ev("AEND.haubitze.ziel.w === 'k:" + mk + "' && /^pk:/.test(AEND.kohorte.ziehen.w) && AUS.toene.includes('k:" + k0 + "') && AUS_K.has('" + k0 + "') && AUS.bereiche.includes('s:sv_inf_A2') && !!MISCH['" + mk + "'] && MISCH['" + mk + "'].spuren[1].ms === 250"));
  if (process.env.OHNE_EINBAU) console.log('  (Einbau-Probe mit tonwahl_bau übersprungen: OHNE_EINBAU)'); else {
    const UI3 = join(ROOT, 'src', 'ui.js'), vor3 = readFileSync(UI3), TMP3 = join(ROOT, 'entwurf', 'postfach', 'tonpult_test_tonpult3.json');
    try { writeFileSync(TMP3, JSON.stringify(exp3)); const aus = execFileSync(process.execPath, [join(ROOT, 'tools', 'tonwahl_bau.mjs')], { encoding: 'utf8' }); console.log('  ' + aus.trim().split('\n')[0]);
      const u3 = readFileSync(UI3, 'utf8'), ta = JSON.parse(/const TON_AUS = new Set\((\[.*?\])\);/.exec(u3)[1]), mt = JSON.parse(/const MISCHTON = (\{.*?\});/.exec(u3)[1]), i = u3.indexOf('const TONWAHL = ') + 16, TW = JSON.parse(u3.slice(i, u3.indexOf(';\n', i)));
      pruef('tonwahl_bau: Abstellkammer als TON_AUS im Spiel', ta.includes(k0) && ta.length === exp3.aussortiert.schluessel.length, ta.length + ' Schlüssel');
      const pkW = TW.kohorte && Object.values(TW.kohorte).find(w => w.pk); pruef('tonwahl_bau: eigenes Paket als pk im Spiel (mit Mischton als Mitglied)', !!pkW && pkW.pk.length === 2 && JSON.stringify(TW.grenadier && Object.values(TW.grenadier).find(w => w.pk)) === JSON.stringify(pkW), JSON.stringify(pkW));
      pruef('tonwahl_bau: Mischton als Rezept MISCHTON im Spiel, Wahl zeigt darauf', Array.isArray(mt[mk]) && mt[mk].length === 2 && mt[mk][1][2] === 250 && TW.haubitze && Object.values(TW.haubitze).some(w => w.k === mk), JSON.stringify(mt[mk]));
      execFileSync(process.execPath, ['--check', UI3]); pruef('src/ui.js bleibt gültiges JavaScript', true);
    } finally { writeFileSync(UI3, vor3); if (existsSync(TMP3)) unlinkSync(TMP3); }
    pruef('src/ui.js wieder unverändert (Ton-Pult 3)', readFileSync(UI3).equals(vor3)); }
  await ev("(() => { for (const k of ['arm.tonpult', 'arm.tonpult.fertig', 'arm.tonpult.aus', 'arm.tonpult.rubrik', 'arm.tonpult.misch']) localStorage.removeItem(k); AEND = {}; zusatzSetzen(JSON.stringify({})); UNDO.length = 0; return true; })()");
  const e22 = readFileSync(join(ROOT, 'entwurf', 'postfach', 'tonpult_export_2026-11-22_2052.json'), 'utf8');
  await ev("document.getElementById('import').click(); document.getElementById('dlgFeld').value = " + JSON.stringify(e22) + "; [...document.querySelectorAll('#dlgKnoepfe button')].find(b => b.textContent === 'Übernehmen').click(); true"); await sleep(300);
  const i22 = JSON.parse(await ev("(() => { const o = " + e22 + ", r = o.roh || {}; let n = 0, gut = 0, fehlt = [], ohne = []; for (const t in r) for (const id in r[t]) { if (!U[t]) continue; n++; const s = U[t] && U[t].slots.find(x => x.id === id); if (!s) { if (JSON.stringify((AEND[t] || {})[id]) === JSON.stringify(r[t][id])) { gut++; ohne.push(t + '.' + id); } else if (t === 'mineur' && id === 'stollenboom' && JSON.stringify((AEND.gelaende || {})[id]) === JSON.stringify(r[t][id])) { gut++; ohne.push(t + '.' + id + ' (umgezogen nach Gelände und Gebäude)'); } else fehlt.push(t + '.' + id + ' (Zeile fehlt, Wahl verloren)'); continue; } const w = wert(U[t], s), e = r[t][id], g = grund(s); if (w.w === (e.w != null ? e.w : g.w) && Math.abs(w.vol - (e.vol != null ? e.vol : g.vol)) < 1e-6 && Math.abs(w.ton - (e.ton != null ? e.ton : 1)) < 1e-6) gut++; else fehlt.push(t + '.' + id); } return JSON.stringify({ n, gut, fehlt, ohne, einh: Object.keys(r).length, fertig: D.einheiten.filter(u => { const f = fortschritt([u]); return f.n === f.von; }).length }); })()"));
  pruef('Enricos Export vom 22.11. (20:52) ist vollständig einlesbar', i22.n >= 120 && i22.gut === i22.n, i22.gut + ' von ' + i22.n + ' Einträgen, ' + i22.einh + ' Einheiten' + (i22.ohne.length ? '; ohne Zeile im Pult, aber bewahrt: ' + i22.ohne.join(', ') : '') + (i22.fehlt.length ? ', abweichend: ' + i22.fehlt.slice(0, 8).join(', ') : ''));
  await ev("ansicht = 'einfach'; e3Wahl(['grenadier'], false)"); await sleep(150); await bild3('13_export_2211_eingelesen.png');
  for (const [w, hh] of [[1280, 720], [2560, 1440]]) { await groesse(w, hh); await sleep(350); pruef('Ton-Pult 3 bei ' + w + ' px: nichts läuft über den Rand', await ev("document.querySelector('header').scrollWidth <= document.documentElement.clientWidth && document.documentElement.scrollWidth <= window.innerWidth && [...document.querySelectorAll('.e3s')].every(e => e.getBoundingClientRect().right <= window.innerWidth + 1)")); await bild3('14_drei_schritte_' + w + '.png'); }
  await groesse(1920, 1080); await sleep(200);
  await ev("document.getElementById('undo').click()"); pruef('Rückgängig nimmt den Import zurück', await ev("Object.keys(AEND).length === 0"));
  // ---- ab hier Ton-Pult 2 (Experten-Ansicht) wie bisher ----
  await ev("document.getElementById('expKnopf').click(); document.querySelector('#expTabs [data-a=\"tabelle\"]').click()"); await sleep(200);
  pruef('Ton-Pult 2 bleibt als Experten-Ansicht erreichbar', await ev("!document.getElementById('expTabs').hidden && ansicht === 'tabelle'"));

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
