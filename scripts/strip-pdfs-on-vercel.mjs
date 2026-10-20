/**
 * postbuild: on Vercel only, delete the Blob-served PDFs from the build output
 * so the deployment does not store them (vercel.json redirects them to Blob).
 * Locally it does nothing — the build-*-pdf scripts and the existsSync checks
 * in the pages still see the files in public/ and dist/.
 */
import { stat, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { findBlobPdfs } from './lib/blob-pdfs.mjs';

if (!process.env.VERCEL) {
  console.log('[strip-pdfs] not on Vercel, skipping');
  process.exit(0);
}

for (const root of ['.vercel/output/static', 'dist/client']) {
  if (!existsSync(root)) continue;
  let count = 0;
  let bytes = 0;
  for (const rel of await findBlobPdfs(root)) {
    const file = path.join(root, rel);
    bytes += (await stat(file)).size;
    await unlink(file);
    count++;
  }
  console.log(`[strip-pdfs] ${root}: removed ${count} PDFs (${(bytes / 1e6).toFixed(0)} MB)`);
}
