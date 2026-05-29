/**
 * Resolves the asset imports declared at the top of an MDX unit so a
 * <Figure src={photo} /> can be rewritten to an absolute file:// URL that
 * Marp can embed via --allow-local-files.
 */
import { resolve, dirname, extname, basename } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

/** Extracts `import x from '...'` statements from the MDX body. */
export function readImports(ast) {
  const map = new Map();
  for (const node of ast.children || []) {
    if (node.type !== 'mdxjsEsm') continue;
    const code = node.value || '';
    const re = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(code))) map.set(m[1], m[2]);
  }
  return map;
}

/**
 * Resolves an MDX import path like `@assets/libro/edmn-2bach/06/x.jpg`
 * to an absolute filesystem path. Returns null if the file doesn't
 * exist on disk.
 */
export function resolveAssetPath(spec) {
  if (!spec) return null;
  let rel = spec;
  if (spec.startsWith('@assets/')) rel = spec.replace('@assets/', 'src/assets/');
  else if (spec.startsWith('@components/')) rel = spec.replace('@components/', 'src/components/');
  const abs = resolve(root, rel);
  return existsSync(abs) ? abs : null;
}

/** Builds a file:// URL Marp can load via --allow-local-files. */
export function fileUrl(absPath) {
  if (!absPath) return null;
  return 'file:///' + absPath.replace(/\\/g, '/');
}

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml',
};

const cacheDir = resolve(root, 'tmp/slides-image-cache');

/**
 * Returns a data: URI for the given absolute image path so Marp can render
 * it in any output mode (HTML / PDF / images) without `--allow-local-files`
 * caveats. Returns null if the file can't be read.
 *
 * Looks up a pre-resized variant in tmp/slides-image-cache/ (produced by
 * scripts/optimize-slide-images.mjs). If absent, falls back to the raw
 * original — slow first run, fast subsequent runs.
 *
 * SVGs are passed through untouched.
 */
export function dataUri(absPath) {
  if (!absPath || !existsSync(absPath)) return null;
  const ext = extname(absPath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  if (ext === '.svg') {
    return `data:${mime};base64,${readFileSync(absPath).toString('base64')}`;
  }

  const stat = statSync(absPath);
  const key = createHash('sha1').update(`${absPath}|${stat.mtimeMs}|v2`).digest('hex').slice(0, 16);
  const cachePath = resolve(cacheDir, `${key}.jpg`);
  if (existsSync(cachePath)) {
    return `data:image/jpeg;base64,${readFileSync(cachePath).toString('base64')}`;
  }

  // Fallback: original (large). Warn so we know to run optimize-slide-images.
  console.warn(`  ! no resized cache for ${basename(absPath)}; using raw (run optimize-slide-images)`);
  const buf = readFileSync(absPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}
