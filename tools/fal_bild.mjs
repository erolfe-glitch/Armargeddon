// Paket W1 (Punkt 124, 2026-11-27): Bilder direkt aus CC über fal (Nano Banana 2).
// Aufruf: node tools/fal_bild.mjs <auftrag.json>
//   auftrag.json = [ { "name": "konkordat_x", "ordner": "ui-quelle/figuren/konkordat", "prompt": "…", "refs": ["pfad/oder/url.png"], "aspect": "16:9", "res": "2K" }, … ]
//   mit refs → fal-ai/nano-banana-2/edit (lokale Referenzen werden in den fal-Speicher geladen), ohne → fal-ai/nano-banana-2.
// Ergebnis: <ordner>/<name>.png, Liste mit Dauer und geschätzten Kosten, Übersicht entwurf/probe/fal/<datum>_uebersicht.jpg (für den Berater).
// Ohne FAL_KEY: Meldung, nichts tun. Der Schlüssel wird nie ausgegeben oder gespeichert (tools/fal_lib.mjs).
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { keyOderEnde, hochladen, falLauf, laden } from './fal_lib.mjs';

const datei = process.argv[2]; if (!datei) { console.log('Aufruf: node tools/fal_bild.mjs <auftrag.json>'); process.exit(1); }
const auftrag = JSON.parse(readFileSync(datei, 'utf8')); const liste = Array.isArray(auftrag) ? auftrag : [auftrag];
const key = keyOderEnde();
const PREIS = { '1K': 0.08, '2K': 0.12, '4K': 0.16 };   // Schätzung je Bild in $ (fal-Preisliste kann sich ändern; maßgeblich ist die fal-Abrechnung)
const fertig = []; let summe = 0;
for (const e of liste) {
  const ordner = e.ordner || 'entwurf/probe/fal'; mkdirSync(ordner, { recursive: true });
  const ziel = join(ordner, e.name + '.png'); if (existsSync(ziel) && !e.ueberschreiben) { console.log(`${e.name}: ${ziel} gibt es schon – übersprungen (\"ueberschreiben\": true zum Ersetzen)`); continue; }
  const refs = []; for (const r of e.refs || []) refs.push(await hochladen(r, key));
  const modell = refs.length ? 'fal-ai/nano-banana-2/edit' : 'fal-ai/nano-banana-2', res = e.res || '2K';
  const eingabe = { prompt: e.prompt, num_images: 1, aspect_ratio: e.aspect || '16:9', resolution: res, output_format: 'png', ...(refs.length ? { image_urls: refs } : {}) };
  try {
    const { ergebnis, sekunden } = await falLauf(modell, eingabe, key);
    const url = ergebnis.images && ergebnis.images[0] && ergebnis.images[0].url; if (!url) throw new Error('keine Bild-URL in der Antwort');
    await laden(url, ziel); const preis = PREIS[res] ?? null; if (preis) summe += preis;
    console.log(`${e.name}: ${ziel}, ${sekunden} s, ${modell}, ${res}, ca. ${preis ?? '?'} $`); fertig.push(ziel);
  } catch (err) { console.log(`${e.name}: FEHLER ${err.message}`); }
}
console.log(`Fertig: ${fertig.length} von ${liste.length}, geschätzt ${summe.toFixed(2)} $`);
if (fertig.length) {   // Übersicht für den Berater (Pillow)
  const tag = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, (c) => c === 'T' ? '_' : ''), ueb = resolve(`entwurf/probe/fal/${tag}_uebersicht.jpg`); mkdirSync('entwurf/probe/fal', { recursive: true });
  const py = process.env.LOCALAPPDATA + '/Programs/Python/Python312/python.exe';
  const code = 'import sys\nfrom PIL import Image, ImageDraw\nfs=sys.argv[2:]\nims=[Image.open(f).convert("RGB") for f in fs]\nfor i in ims: i.thumbnail((640,640))\nW=sum(i.width for i in ims)+10*(len(ims)+1); H=max(i.height for i in ims)+40\nS=Image.new("RGB",(W,H),(40,40,40)); d=ImageDraw.Draw(S); x=10\nfor f,i in zip(fs,ims):\n  S.paste(i,(x,30)); d.text((x,8),f.replace(chr(92),"/").split("/")[-1],fill=(255,255,255)); x+=i.width+10\nS.save(sys.argv[1],quality=85)';
  try { execFileSync(py, ['-c', code, ueb, ...fertig.map(f => resolve(f))]); console.log('Übersicht', ueb); } catch (e) { console.log('Übersicht ging nicht:', e.message.split('\n')[0]); }
}
