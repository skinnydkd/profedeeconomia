/**
 * Resolves the asset imports declared at the top of an MDX unit so a
 * <Figure src={photo} /> can be rewritten to an absolute file:// URL that
 * Marp can embed via --allow-local-files.
 */
import { resolve, dirname, extname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

/**
 * Returns a data: URI for the given absolute image path so Marp can render
 * it in any output mode (HTML / PDF / images) without `--allow-local-files`
 * caveats. Returns null if the file can't be read.
 */
export function dataUri(absPath) {
  if (!absPath || !existsSync(absPath)) return null;
  const mime = MIME[extname(absPath).toLowerCase()] || 'application/octet-stream';
  const buf = readFileSync(absPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}
