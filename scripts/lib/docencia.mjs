import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { filePatterns } = require('../../src/lib/situaciones-forbidden.json');
const FORBIDDEN = filePatterns.map((p) => new RegExp(p, 'i'));

export const MATERIAS = { 'economia-4eso': 'eco-4eso', 'economia-1bat': 'eco-1bach' };
const PUBLISHABLE_DIRS = new Set(['unitats', 'activitats', 'avaluacio']);
const PRUNABLE = ['public/situaciones/', 'public/downloads/situaciones/', 'src/content/asignaturas/'];
const GUIA_RE = /-(GUIA|SOLUCIONARI)\.md$/;

export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/** `ud01-02-x` -> [1, 2]; `ud01-x` -> [1]. Without a filename prefix, falls back to the parent dir under `unitats/`. */
export function unidadesDe(relPath) {
  const parts = relPath.split('\\').join('/').split('/');
  const re = /^ud(\d+)(?:-(\d+)(?=-|\.|$))?/;
  const m = parts.at(-1).match(re) ?? (parts[0] === 'unitats' && parts.length >= 3 ? parts[1].match(re) : null);
  return m ? [m[1], m[2]].filter(Boolean).map(Number) : [];
}

/** relPath is relative to the subject dir (e.g. `unitats/ud01-x/a.html`). */
export function isPublishable(relPath) {
  const p = relPath.split('\\').join('/');
  return PUBLISHABLE_DIRS.has(p.split('/')[0]) && !FORBIDDEN.some((re) => re.test(p));
}

export function guiaTipo(fileName) {
  const m = fileName.match(GUIA_RE);
  return m ? (m[1] === 'GUIA' ? 'guia' : 'solucionario') : null;
}

export function materialId(fileName) {
  return path.posix.basename(fileName.split('\\').join('/')).replace(/-(GUIA|SOLUCIONARI)(?=\.md$)/, '').replace(/\.[^.]+$/, '');
}

export function groupMaterials(relPaths) {
  const groups = new Map();
  for (const rel of relPaths) {
    const ext = path.posix.extname(rel).toLowerCase();
    const kind = guiaTipo(rel) ? 'guia' : ext === '.html' ? 'html' : ext === '.pdf' ? 'pdf' : null;
    if (!kind) continue;
    const id = materialId(rel);
    if (!groups.has(id)) groups.set(id, { guias: [], unidades: unidadesDe(rel) });
    const g = groups.get(id);
    const clash = kind === 'guia' ? g.guias.find((o) => guiaTipo(o) === guiaTipo(rel)) : g[kind];
    if (clash) throw new Error(`Material id collision "${id}": ${clash} and ${rel}`);
    if (kind === 'guia') g.guias.push(rel);
    else g[kind] = rel;
  }
  return new Map([...groups].map(([id, g]) => [id, { ...(g.html && { html: g.html }), ...(g.pdf && { pdf: g.pdf }), guias: g.guias.sort(), unidades: g.unidades }]));
}

// Git mode reads HEAD (list and content), so only committed work is imported.
const readSource = (dir, rel, noGit) =>
  noGit
    ? fs.readFileSync(path.join(dir, rel))
    : execFileSync('git', ['-C', dir, 'show', `HEAD:./${rel}`], { maxBuffer: 1 << 28 });

function listFiles(dir, noGit) {
  if (!noGit) {
    return execFileSync('git', ['-C', dir, 'ls-tree', '-r', '-z', '--name-only', 'HEAD'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  }
  const walk = (d, pre) =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name), `${pre}${e.name}/`) : [`${pre}${e.name}`],
    );
  return walk(dir, '');
}

const firstHeading = (body) => body.match(/^# +(.+?)\s*$/m)?.[1];

function guideFile(asig, id, tipo, text) {
  let body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').replace(/^\s+/, '');
  const title = firstHeading(body) ?? id;
  // The page renders the title as <h1>: drop the leading heading so it is not shown twice.
  body = body.replace(/^# +.*\r?\n(\s*\r?\n)*/, '');
  const stem = `${id}-${tipo}.ca`;
  const fm = [
    '---',
    `asignatura: ${asig}`,
    `material: ${id}`,
    `title: ${JSON.stringify(title)}`,
    `tipo: ${tipo}`,
    'lang: ca',
    'estado: publicado',
    `slug: "asignaturas/${asig}/situaciones/guias/${stem}"`,
    '---',
    '',
  ].join('\n');
  return `${fm}\n${body}`;
}

const esTwinOf = (target) => target.replace(/\.ca\.(?=[^.]+$)/, '.');
const sortKeys = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

/** Import tracked, publishable CA files from docencia into the web layout. Never writes ES files. */
export function importDocencia({ sourceDir, outDir, noGit = false, prune = false }) {
  const report = { nuevos: [], cambiados: [], sinCambios: 0, restaurados: [], traduccionPendiente: [], eliminados: [] };
  const files = listFiles(sourceDir, noGit);

  for (const [materia, asig] of Object.entries(MATERIAS)) {
    const prefix = `${materia}/`;
    const rels = files.filter((f) => f.startsWith(prefix)).map((f) => f.slice(prefix.length)).filter(isPublishable);
    const manifestPath = path.join(outDir, 'src/content/asignaturas', asig, 'situaciones/_import.json');
    const old = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
    const next = {};

    const write = (target, data) => {
      const abs = path.join(outDir, target);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, data);
    };

    for (const [id, g] of groupMaterials(rels)) {
      const items = [];
      if (g.html) items.push([g.html, `public/situaciones/${asig}/${id}.ca.html`]);
      if (g.pdf) items.push([g.pdf, `public/downloads/situaciones/${asig}/${id}.ca.pdf`]);
      for (const gu of g.guias) {
        const tipo = guiaTipo(gu);
        items.push([gu, `src/content/asignaturas/${asig}/situaciones/guias/${id}-${tipo}.ca.md`, tipo]);
      }
      for (const [rel, target, tipo] of items) {
        const key = prefix + rel;
        const buf = readSource(sourceDir, key, noGit);
        const hash = sha256(buf); // hash of source bytes (guides get frontmatter added on copy)
        const prev = old[key];
        const unchanged = prev?.sha256 === hash && fs.existsSync(path.join(outDir, target));
        // Targets are anonymised in place after import: never overwrite an unchanged one.
        if (!unchanged) write(target, tipo ? guideFile(asig, id, tipo, buf.toString('utf8')) : buf);
        next[key] = { sha256: hash, targets: [target], esHashOfSource: prev?.esHashOfSource ?? null };
        if (!prev) report.nuevos.push(key);
        else if (prev.sha256 !== hash) report.cambiados.push(key);
        else if (unchanged) report.sinCambios++;
        else report.restaurados.push(target); // missing on disk, rewritten from raw source: needs re-anonymising
        const esTwin = esTwinOf(target);
        if (!fs.existsSync(path.join(outDir, esTwin)) || next[key].esHashOfSource !== hash) {
          report.traduccionPendiente.push(target);
        }
      }
    }
    for (const key of Object.keys(old).sort()) {
      if (next[key]) continue;
      const targets = [...old[key].targets].sort();
      const esTwins = targets.map(esTwinOf).filter((t) => fs.existsSync(path.join(outDir, t)));
      report.eliminados.push({ source: key, targets, esTwins });
      if (!prune) next[key] = old[key]; // keep reporting until pruned
      if (prune) {
        for (const t of [...targets, ...esTwins]) {
          if (!PRUNABLE.some((p) => t.split('\\').join('/').startsWith(p))) throw new Error(`Refusing to prune outside the import layout: ${t}`);
        }
        for (const t of [...targets, ...esTwins]) fs.rmSync(path.join(outDir, t), { force: true });
      }
    }
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify(sortKeys(next), null, 2) + '\n');
  }
  report.restaurados.sort();
  return report;
}
