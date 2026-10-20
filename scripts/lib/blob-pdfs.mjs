/**
 * PDFs served from Vercel Blob instead of the deployment.
 *
 * They live in these public/ folders and are uploaded to Blob under the same
 * path; vercel.json redirects /<folder>/*.pdf to the store, and
 * strip-pdfs-on-vercel.mjs drops them from the build output so every
 * deployment stops storing its own ~1.4 GB copy.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const BLOB_PDF_DIRS = ['downloads', 'slides', 'ebau-examenes', 'olimpiada'];

/** True for a path (relative to public/ or the output root) that is served from Blob. */
export function isBlobPdf(relPath) {
  const p = relPath.replaceAll('\\', '/');
  return p.endsWith('.pdf') && BLOB_PDF_DIRS.some((dir) => p.startsWith(`${dir}/`));
}

/**
 * Whether a local file must be (re)uploaded.
 * ponytail: size + mtime, not a content hash — a same-size edit with an older
 * mtime would be skipped; hash the files if that ever happens.
 */
export function needsUpload(local, remote) {
  if (!remote) return true;
  if (remote.size !== local.size) return true;
  return local.mtimeMs > new Date(remote.uploadedAt).getTime();
}

/** Every Blob-served PDF under `root`, as paths relative to it with forward slashes. */
export async function findBlobPdfs(root) {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => path.relative(root, path.join(e.parentPath, e.name)).replaceAll('\\', '/'))
    .filter(isBlobPdf);
}
