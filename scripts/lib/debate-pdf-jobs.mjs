import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a dist-relative HTML path for a debate print route. Returns the
 * familia/slug, the (slash-joined) route path and the output PDF filename,
 * or null when the path is not a debate `.../imprimir/index.html`.
 */
export function parseDebatePrintPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  // expected: debates / <familia> / <slug> / imprimir / index.html
  if (parts.length !== 5) return null;
  const [root, familia, slug, leaf, file] = parts;
  if (root !== 'debates' || leaf !== 'imprimir' || file !== 'index.html') return null;
  return {
    familia,
    slug,
    route: `debates/${familia}/${slug}/imprimir`,
    out: `debate-${familia}-${slug}.pdf`,
  };
}

/**
 * Walk distDir/debates and return one job per debate print route. Each job is
 * the object returned by parseDebatePrintPath, sorted by route for determinism.
 */
export function findDebatePrintJobs(distDir) {
  const base = join(distDir, 'debates');
  const jobs = [];
  const walk = (absDir, relDir) => {
    let entries;
    try { entries = readdirSync(absDir); } catch { return; }
    for (const name of entries) {
      const abs = join(absDir, name);
      const rel = relDir ? `${relDir}/${name}` : name;
      if (statSync(abs).isDirectory()) { walk(abs, rel); continue; }
      if (name !== 'index.html') continue;
      const job = parseDebatePrintPath(`debates/${rel}`);
      if (job) jobs.push(job);
    }
  };
  walk(base, '');
  return jobs.sort((a, b) => a.route.localeCompare(b.route));
}
