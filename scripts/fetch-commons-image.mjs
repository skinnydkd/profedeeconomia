#!/usr/bin/env node
/**
 * Fetch a freely-licensed image from Wikimedia Commons and save it locally,
 * printing a VERIFIED attribution string built from the Commons API metadata
 * (never hand-typed, so the credit is accurate).
 *
 * Usage:
 *   node scripts/fetch-commons-image.mjs "<search query>" <output-path> [--min-width=800]
 *
 * On success prints a JSON line:
 *   {"ok":true,"file":"...","title":"File:...","author":"...","license":"CC BY-SA 4.0",
 *    "credit":"Foto: ..., CC BY-SA 4.0 vía Wikimedia Commons","width":..,"height":..}
 * On failure prints {"ok":false,"reason":"..."} and exits 1.
 *
 * Only accepts CC0 / Public Domain / CC BY / CC BY-SA licenses (no NC/ND, no
 * "fair use"). Skips non-raster and tiny images.
 */
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const [query, outPath, ...rest] = process.argv.slice(2);
const minWidth = Number((rest.find((a) => a.startsWith('--min-width=')) || '--min-width=800').split('=')[1]);

if (!query || !outPath) {
  console.log(JSON.stringify({ ok: false, reason: 'usage: <query> <output-path> [--min-width=N]' }));
  process.exit(1);
}

const ACCEPTED = [/^cc0/i, /public domain/i, /^cc by(?!.*nc)(?!.*nd)/i]; // CC0, PD, CC BY / CC BY-SA (no NC, no ND)
const stripHtml = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function licenseOk(lic) {
  if (!lic) return false;
  return ACCEPTED.some((re) => re.test(lic));
}

async function api(params) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams(params).toString();
  const res = await fetch(url, { headers: { 'User-Agent': 'profedeeconomia-book-builder/1.0 (educational)' } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

try {
  const data = await api({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6', // File:
    gsrlimit: '15',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    format: 'json',
  });

  const pages = Object.values(data?.query?.pages || {});
  // Keep deterministic order by search index.
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  let chosen = null;
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const mime = ii.mime || ii.extmetadata?.MimeType?.value || '';
    if (!/image\/(jpeg|png)/i.test(mime) && !/\.(jpe?g|png)$/i.test(ii.url || '')) continue;
    const lic = stripHtml(ii.extmetadata?.LicenseShortName?.value);
    if (!licenseOk(lic)) continue;
    if ((ii.width || 0) < minWidth) continue;
    const author = stripHtml(ii.extmetadata?.Artist?.value) || 'Autor desconocido';
    chosen = { title: p.title, url: ii.url, author, license: lic, width: ii.width, height: ii.height };
    break;
  }

  if (!chosen) {
    console.log(JSON.stringify({ ok: false, reason: 'no acceptable CC image found', query }));
    process.exit(1);
  }

  // Download
  const imgRes = await fetch(chosen.url, { headers: { 'User-Agent': 'profedeeconomia-book-builder/1.0 (educational)' } });
  if (!imgRes.ok) throw new Error(`download ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());

  // Validate it's really an image by magic bytes.
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  if (!isJpeg && !isPng) {
    console.log(JSON.stringify({ ok: false, reason: 'downloaded file is not a JPEG/PNG', url: chosen.url }));
    process.exit(1);
  }
  if (buf.length < 30000) {
    console.log(JSON.stringify({ ok: false, reason: `file too small (${buf.length} bytes)`, url: chosen.url }));
    process.exit(1);
  }

  // Normalise the extension to the real format so the MDX import is honest.
  const wantExt = isPng ? '.png' : '.jpg';
  const finalPath = outPath.replace(/\.(jpe?g|png)$/i, '') + wantExt;

  mkdirSync(dirname(finalPath), { recursive: true });
  writeFileSync(finalPath, buf);

  const credit = `Foto: ${chosen.author}, ${chosen.license} vía Wikimedia Commons`;
  console.log(JSON.stringify({
    ok: true,
    file: finalPath,
    bytes: statSync(finalPath).size,
    title: chosen.title,
    author: chosen.author,
    license: chosen.license,
    credit,
    width: chosen.width,
    height: chosen.height,
  }));
} catch (e) {
  console.log(JSON.stringify({ ok: false, reason: e.message }));
  process.exit(1);
}
