// Paket W1 (Punkt 124, 2026-11-27): gemeinsame Hilfen für fal_bild.mjs und fal_ton.mjs.
// Schlüssel: FAL_KEY aus der Umgebung, unter Windows sonst aus der Benutzer-Umgebung (Registry HKCU\Environment) – nur im Speicher,
// nie ausgeben, nie in Dateien schreiben. Aufrufe über die fal-Warteschlange (queue.fal.run) mit fetch, ohne Zusatzpakete.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

export function falKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  if (process.platform === 'win32') {
    try { const out = execFileSync('reg', ['query', 'HKCU\\Environment', '/v', 'FAL_KEY'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const m = out.match(/FAL_KEY\s+REG_\w+\s+(\S+)/); if (m) return m[1]; } catch (e) { /* nicht gesetzt */ }
  }
  return null;
}
export function keyOderEnde() {
  const k = falKey(); if (k) return k;
  console.log('Kein FAL_KEY gefunden (weder in der Umgebung noch als Windows-Benutzervariable). Es wird nichts erzeugt.'); process.exit(3);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Fehlertext ohne Schlüssel (falls ein Dienst ihn je zurückspiegeln sollte)
const sauber = (t, key) => String(t).split(key).join('***').slice(0, 600);

// Lokale Datei in den fal-Speicher laden → öffentliche URL; URLs bleiben wie sie sind. Schlägt der Speicher fehl: Daten-URL (base64).
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
export async function hochladen(pfad, key) {
  if (/^https?:|^data:/.test(pfad)) return pfad;
  const bytes = readFileSync(pfad), typ = MIME[extname(pfad).toLowerCase()] || 'application/octet-stream';
  try {
    const r = await fetch('https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3', { method: 'POST', headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ content_type: typ, file_name: basename(pfad) }) });
    if (!r.ok) throw new Error('initiate ' + r.status);
    const { upload_url, file_url } = await r.json();
    const p = await fetch(upload_url, { method: 'PUT', headers: { 'Content-Type': typ }, body: bytes }); if (!p.ok) throw new Error('put ' + p.status);
    return file_url;
  } catch (e) { console.log(`  Hochladen in den fal-Speicher ging nicht (${e.message}) – ${basename(pfad)} als Daten-URL`); return `data:${typ};base64,${bytes.toString('base64')}`; }
}

// Auftrag in die Warteschlange, warten, Ergebnis holen. Gibt { ergebnis, sekunden } zurück.
export async function falLauf(modell, eingabe, key, { maxSek = 600 } = {}) {
  const t0 = Date.now(), H = { Authorization: `Key ${key}`, 'Content-Type': 'application/json' };
  const r = await fetch(`https://queue.fal.run/${modell}`, { method: 'POST', headers: H, body: JSON.stringify(eingabe) });
  if (!r.ok) throw new Error(`${modell}: ${r.status} ${sauber(await r.text(), key)}`);
  const q = await r.json(); let st = null;
  while ((Date.now() - t0) / 1000 < maxSek) {
    await sleep(2000);
    const s = await fetch(q.status_url, { headers: H }); if (!s.ok) continue; st = await s.json();
    if (st.status === 'COMPLETED') break;
    if (st.status && !['IN_QUEUE', 'IN_PROGRESS'].includes(st.status)) throw new Error(`${modell}: Status ${st.status}`);
  }
  if (!st || st.status !== 'COMPLETED') throw new Error(`${modell}: nach ${maxSek} s nicht fertig`);
  const e = await fetch(q.response_url, { headers: H }); const ergebnis = await e.json();
  if (!e.ok) throw new Error(`${modell}: Ergebnis ${e.status} ${sauber(JSON.stringify(ergebnis), key)}`);
  return { ergebnis, sekunden: Math.round((Date.now() - t0) / 1000), id: q.request_id };
}
export async function laden(url, ziel) {
  const r = await fetch(url); if (!r.ok) throw new Error('Laden ' + r.status);
  const { writeFileSync } = await import('node:fs'); writeFileSync(ziel, Buffer.from(await r.arrayBuffer()));
}
