import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a dist-relative HTML path for a per-activity print route. Returns the
 * asignatura/slug, the (slash-joined) route path and the output PDF filename,
 * or null when the path is not an activity `.../actividades/<slug>/imprimir/index.html`.
 *
 * The whole-subject cuaderno lives at `<asig>/actividades/imprimir/<modo>/` and
 * must not match: its `imprimir` segment sits where the slug would be.
 */
export function parseActividadPrintPath(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  // expected: <asignatura> / actividades / <slug> / imprimir / index.html
  if (parts.length !== 5) return null;
  const [asignatura, section, slug, leaf, file] = parts;
  if (section !== 'actividades' || leaf !== 'imprimir' || file !== 'index.html') return null;
  if (slug === 'imprimir') return null;
  return {
    asignatura,
    slug,
    route: `${asignatura}/actividades/${slug}/imprimir`,
    out: `actividad-${asignatura}-${slug}.pdf`,
  };
}

/**
 * Walk distDir/<asignatura>/actividades and return one job per activity print
 * route, sorted by route for determinism. `subjects` narrows the scan to those
 * slugs; an empty list means every subject folder found in dist.
 */
export function findActividadPrintJobs(distDir, subjects = []) {
  const jobs = [];
  let dirs;
  try {
    dirs = readdirSync(distDir).filter((n) => statSync(join(distDir, n)).isDirectory());
  } catch {
    return jobs;
  }
  for (const asignatura of dirs) {
    if (subjects.length && !subjects.includes(asignatura)) continue;
    const base = join(distDir, asignatura, 'actividades');
    if (!existsSync(base)) continue;
    for (const slug of readdirSync(base)) {
      const html = join(base, slug, 'imprimir', 'index.html');
      if (!existsSync(html)) continue;
      const job = parseActividadPrintPath(`${asignatura}/actividades/${slug}/imprimir/index.html`);
      if (job) jobs.push(job);
    }
  }
  return jobs.sort((a, b) => a.route.localeCompare(b.route));
}

/**
 * Subjects that already carry at least one activity PDF in `downloadsDir`.
 * The generator defaults to these so `build:all` keeps a subject's sheets
 * fresh without silently adding hundreds of PDFs for subjects nobody opted in.
 */
export function subjectsWithActividadPdfs(downloadsDir, knownSubjects) {
  let files;
  try {
    files = readdirSync(downloadsDir);
  } catch {
    return [];
  }
  return knownSubjects.filter((s) => files.some((f) => f.startsWith(`actividad-${s}-`) && f.endsWith('.pdf')));
}
