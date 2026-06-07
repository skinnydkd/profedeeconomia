import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a dist-relative HTML path for a refuerzo print route. Returns the
 * asignatura/evaluacion/tipo, the (slash-joined) route path and the output PDF
 * filename, or null when the path is not a refuerzo `.../imprimir/<bloque>/index.html`.
 * Expected shape: <asignatura>/refuerzo/imprimir/eval<n>-<tipo>/index.html
 */
export function parseRefuerzoPrintPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  if (parts.length !== 5) return null;
  const [asignatura, sec, leaf, bloque, file] = parts;
  if (sec !== 'refuerzo' || leaf !== 'imprimir' || file !== 'index.html') return null;
  const m = bloque.match(/^eval([1-3])-(refuerzo|ampliacion)$/);
  if (!m) return null;
  const evaluacion = Number(m[1]);
  const tipo = m[2];
  return {
    asignatura,
    evaluacion,
    tipo,
    route: `${asignatura}/refuerzo/imprimir/${bloque}`,
    out: `${asignatura}-${tipo}-eval${evaluacion}.pdf`,
  };
}

/**
 * Walk distDir and return one job per refuerzo print route. Each job is the
 * object returned by parseRefuerzoPrintPath, sorted by route for determinism.
 */
export function findRefuerzoPrintJobs(distDir) {
  const jobs = [];
  const walk = (absDir, relDir) => {
    let entries;
    try { entries = readdirSync(absDir); } catch { return; }
    for (const name of entries) {
      const abs = join(absDir, name);
      const rel = relDir ? `${relDir}/${name}` : name;
      let isDir = false;
      try { isDir = statSync(abs).isDirectory(); } catch { continue; }
      if (isDir) { walk(abs, rel); continue; }
      if (name !== 'index.html') continue;
      const job = parseRefuerzoPrintPath(rel);
      if (job) jobs.push(job);
    }
  };
  walk(distDir, '');
  return jobs.sort((a, b) => a.route.localeCompare(b.route));
}
