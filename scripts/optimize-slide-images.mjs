#!/usr/bin/env node
/**
 * Pre-resize and recompress every image used by the libros so slide
 * generation can embed them as small base64 blobs.
 *
 * Walks src/assets/libro/** and emits a resized JPEG (max 1920px) to
 * tmp/slides-image-cache/<sha1(path|mtime|v2)>.jpg. The slide parsers
 * (imports.mjs) look up cached variants by the same key.
 *
 * Cost saving example: a 9.4 MB Wikipedia photo becomes ~300 KB without
 * visible quality loss at slide resolution.
 *
 * Usage:
 *   node scripts/optimize-slide-images.mjs              # all images
 *   node scripts/optimize-slide-images.mjs eco-1bach    # one book
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cacheDir = resolve(root, 'tmp/slides-image-cache');
mkdirSync(cacheDir, { recursive: true });

const filter = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const assetsRoot = resolve(root, 'src/assets/libro');
if (!existsSync(assetsRoot)) {
  console.error(`✖ ${assetsRoot} not found`);
  process.exit(1);
}

const bookDirs = readdirSync(assetsRoot).filter((slug) => {
  if (filter.length && !filter.includes(slug)) return false;
  return statSync(resolve(assetsRoot, slug)).isDirectory();
});

let processed = 0, cached = 0, savedBytes = 0;

for (const slug of bookDirs) {
  const all = walk(resolve(assetsRoot, slug));
  for (const abs of all) {
    const ext = extname(abs).toLowerCase();
    if (!RASTER.has(ext)) continue;
    const stat = statSync(abs);
    const key = createHash('sha1').update(`${abs}|${stat.mtimeMs}|v2`).digest('hex').slice(0, 16);
    const cachePath = resolve(cacheDir, `${key}.jpg`);
    if (existsSync(cachePath)) {
      cached++;
      continue;
    }
    try {
      const info = await sharp(abs)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(cachePath);
      const before = stat.size;
      const after = info.size;
      savedBytes += Math.max(0, before - after);
      processed++;
      const ratio = ((before - after) / before * 100).toFixed(0);
      console.log(`  ✓ ${slug}/${basename(abs)} — ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB (-${ratio}%)`);
    } catch (err) {
      console.warn(`  ! ${abs}: ${err.message}`);
    }
  }
}

const mb = (savedBytes / 1024 / 1024).toFixed(1);
console.log(`\n✓ Processed ${processed}, cached ${cached}. Saved ${mb} MB.`);
