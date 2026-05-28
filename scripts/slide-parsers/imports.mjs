/**
 * Resolves the asset imports declared at the top of an MDX unit so a
 * <Figure src={photo} /> can be rewritten to an absolute file:// URL that
 * Marp can embed via --allow-local-files.
 */
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
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
