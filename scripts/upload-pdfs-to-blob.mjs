/**
 * Upload the PDFs in public/{downloads,slides,ebau-examenes,olimpiada} to
 * Vercel Blob under the same path, skipping the ones already up to date.
 * Run after regenerating PDFs:  npm run upload:pdfs
 * Needs BLOB_READ_WRITE_TOKEN in .env.
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';
import { BLOB_PDF_DIRS, findBlobPdfs, needsUpload } from './lib/blob-pdfs.mjs';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('[upload-pdfs] BLOB_READ_WRITE_TOKEN missing — add it to .env');
  process.exit(1);
}

const remote = new Map();
for (const prefix of BLOB_PDF_DIRS) {
  let cursor;
  do {
    const page = await list({ prefix: `${prefix}/`, cursor, limit: 1000 });
    for (const b of page.blobs) remote.set(b.pathname, b);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}

const files = await findBlobPdfs('public');
let uploaded = 0;
let failed = 0;
for (const rel of files) {
  const file = path.join('public', rel);
  const local = await stat(file);
  if (!needsUpload(local, remote.get(rel))) continue;
  try {
    await put(rel, await readFile(file), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/pdf',
    });
    uploaded++;
    console.log(`[upload-pdfs] ${rel}`);
  } catch (err) {
    failed++;
    console.error(`[upload-pdfs] FAILED ${rel}: ${err.message}`);
  }
}

console.log(
  `[upload-pdfs] ${files.length} PDFs, ${uploaded} uploaded, ${files.length - uploaded - failed} up to date, ${failed} failed`,
);
if (failed) process.exit(1);
