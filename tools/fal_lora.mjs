// W2a (Punkt 147, 2026-11-27): LoRA über fal anlernen und Probebilder damit malen – nur Probe, nichts wird eingebaut.
// Aufruf:
//   node tools/fal_lora.mjs start <zip> <name> [schritte=1000] [art=style]   → Training in die Warteschlange (fal-ai/z-image-trainer), wartet NICHT; Merkzettel entwurf/probe/stil/<name>.json
//   node tools/fal_lora.mjs status <name>                                    → fragt einmal nach; ist es fertig, steht die LoRA-Adresse im Merkzettel
//   node tools/fal_lora.mjs probe <name> <auftrag.json> [stärke=1]           → je Eintrag { name, prompt, ordner? } ein Bild mit der LoRA (fal-ai/z-image/turbo/lora), PNG in ordner (Standard entwurf/probe/stil)
// Schlüssel nur aus der Umgebung (FAL_KEY, tools/fal_lib.mjs), wird nie ausgegeben oder gespeichert. Die LoRA-Datei bleibt bei fal (nur die Adresse im Merkzettel).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { keyOderEnde, hochladen, falLauf, laden } from './fal_lib.mjs';
const [cmd, a1, a2, a3, a4] = process.argv.slice(2), key = keyOderEnde(), H = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };
const zettel = n => join('entwurf/probe/stil', n + '.json'), TRAINER = 'fal-ai/z-image-trainer';
const lies = n => JSON.parse(readFileSync(zettel(n), 'utf8')), schreib = (n, o) => writeFileSync(zettel(n), JSON.stringify(o, null, 1));
if (cmd === 'start') {
  if (existsSync(zettel(a2))) { console.log(`Merkzettel ${zettel(a2)} gibt es schon – nicht noch einmal starten.`); process.exit(0); }
  const url = await hochladen(a1, key); if (url.startsWith('data:')) { console.log('ZIP konnte nicht in den fal-Speicher – Abbruch (Daten-URL wäre zu groß).'); process.exit(1); }
  const eingabe = { image_data_url: url, steps: +(a3 || 1000), training_type: a4 || 'style', default_caption: 'armgelaende, hand-drawn grimdark ink illustration, isometric game terrain piece, flat magenta background' };
  const r = await fetch(`https://queue.fal.run/${TRAINER}`, { method: 'POST', headers: H, body: JSON.stringify(eingabe) });
  const q = await r.json(); if (!r.ok) { console.log('Fehler', r.status, JSON.stringify(q).split(key).join('***').slice(0, 400)); process.exit(1); }
  schreib(a2, { trainer: TRAINER, schritte: eingabe.steps, art: eingabe.training_type, start: new Date().toISOString(), request_id: q.request_id, status_url: q.status_url, response_url: q.response_url });
  console.log(`gestartet: ${q.request_id} (${eingabe.steps} Schritte, ${eingabe.training_type})`);
} else if (cmd === 'status') {
  const z = lies(a1); if (z.lora) { console.log('fertig:', z.lora); process.exit(0); }
  const s = await (await fetch(z.status_url, { headers: H })).json(); console.log('Status:', s.status, s.queue_position != null ? 'Platz ' + s.queue_position : '');
  if (s.status === 'COMPLETED') { const e = await (await fetch(z.response_url, { headers: H })).json(); z.lora = e.diffusers_lora_file && e.diffusers_lora_file.url; z.config = e.config_file && e.config_file.url; z.ende = new Date().toISOString(); schreib(a1, z); console.log('fertig:', z.lora); }
} else if (cmd === 'probe') {
  const z = lies(a1); if (!z.lora) { console.log('LoRA noch nicht fertig'); process.exit(1); }
  for (const e of JSON.parse(readFileSync(a2, 'utf8'))) {
    const ordner = e.ordner || 'entwurf/probe/stil'; mkdirSync(ordner, { recursive: true }); const ziel = join(ordner, e.name + '.png'); if (existsSync(ziel)) { console.log(e.name, 'gibt es schon'); continue; }
    try { const { ergebnis, sekunden } = await falLauf('fal-ai/z-image/turbo/lora', { prompt: e.prompt, loras: [{ path: z.lora, scale: +(a3 || 1) }], image_size: 'square_hd', num_images: 1, output_format: 'png' }, key);
      await laden(ergebnis.images[0].url, ziel); console.log(`${e.name}: ${ziel}, ${sekunden} s`); } catch (err) { console.log(`${e.name}: FEHLER ${err.message}`); }
  }
} else console.log('Aufruf: start <zip> <name> [schritte] [art] | status <name> | probe <name> <auftrag.json> [stärke]');
