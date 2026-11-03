import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  unidadesDe,
  isPublishable,
  materialId,
  guiaTipo,
  groupMaterials,
  importDocencia,
} from './docencia.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '__fixtures__', 'docencia');
const SCRIPT = path.join(__dirname, '..', 'importar-docencia.mjs');
const MANIFEST = 'src/content/asignaturas/eco-4eso/situaciones/_import.json';

describe('helpers', () => {
  it('unidadesDe', () => {
    expect(unidadesDe('ud01-02-repas.html')).toEqual([1, 2]);
    expect(unidadesDe('ud01-x.html')).toEqual([1]);
    expect(unidadesDe('examen.html')).toEqual([]);
    expect(unidadesDe('unitats/ud01-economia-de-les-persones/resum-ud01.html')).toEqual([1]);
    expect(unidadesDe('unitats/ud02-produccio-renda-comerc/apunts-mercat.html')).toEqual([2]);
    expect(unidadesDe('avaluacio/examen.html')).toEqual([]);
  });
  it('isPublishable', () => {
    expect(isPublishable('unitats/ud02-x/video-cooperativa-classe-privat.mp4')).toBe(false);
    expect(isPublishable('avaluacio/llibreta-ud01-02.html')).toBe(false);
    expect(isPublishable('activitats/ud01-cas-concorde.html')).toBe(true);
    expect(isPublishable('activitats/ud00-intro.html')).toBe(false);
    expect(isPublishable('activitats/x.docx')).toBe(false);
    // Exams and mock exams stay private until Pau decides to publish them as «modelo de examen»
    expect(isPublishable('avaluacio/ud01-02-examen.html')).toBe(false);
    expect(isPublishable('avaluacio/ud01-02-simulacre.pdf')).toBe(false);
    expect(isPublishable('avaluacio/ud01-02-control-SOLUCIONARI.md')).toBe(false);
    expect(isPublishable('avaluacio/ud01-02-SOLUCIONARI.md')).toBe(false);
    expect(isPublishable('avaluacio/ud01-questionari-SOLUCIONARI.md')).toBe(true);
    expect(isPublishable('activitats/ud01-02-repas-SOLUCIONARI.md')).toBe(true);
    expect(isPublishable('altres/ud01-x.html')).toBe(false);
  });
  it('materialId / guiaTipo', () => {
    expect(materialId('ud01-cas-concorde-GUIA.md')).toBe('ud01-cas-concorde');
    expect(materialId('ud01-cas-SOLUCIONARI.md')).toBe('ud01-cas');
    expect(materialId('unitats/ud01/ud01-cas.html')).toBe('ud01-cas');
    expect(guiaTipo('a-GUIA.md')).toBe('guia');
    expect(guiaTipo('a-SOLUCIONARI.md')).toBe('solucionario');
    expect(guiaTipo('a.html')).toBeNull();
  });
  it('groupMaterials pairs html, pdf and guides of one id', () => {
    const g = groupMaterials(['u/ud01-02-a.html', 'u/ud01-02-a.pdf', 'u/ud01-02-a-GUIA.md', 'u/ud01-02-a-SOLUCIONARI.md']);
    expect([...g.keys()]).toEqual(['ud01-02-a']);
    expect(g.get('ud01-02-a')).toEqual({
      html: 'u/ud01-02-a.html',
      pdf: 'u/ud01-02-a.pdf',
      guias: ['u/ud01-02-a-GUIA.md', 'u/ud01-02-a-SOLUCIONARI.md'],
      unidades: [1, 2],
    });
  });
  it('groupMaterials throws when two dirs share an id and extension', () => {
    expect(() => groupMaterials(['a/ud01-x.html', 'b/ud01-x.html'])).toThrow(/collision/);
    expect(() => groupMaterials(['a/ud01-x-GUIA.md', 'b/ud01-x-GUIA.md'])).toThrow(/collision/);
    expect(() => groupMaterials(['a/ud01-x.html', 'b/ud01-x.pdf'])).not.toThrow();
  });
});

describe('importDocencia', () => {
  let src, out;
  const run = () => importDocencia({ sourceDir: src, outDir: out, noGit: true });
  const read = (p) => fs.readFileSync(path.join(out, p), 'utf8');
  beforeEach(() => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docencia-'));
    src = path.join(tmp, 'src');
    out = path.join(tmp, 'out');
    fs.cpSync(FIXTURES, src, { recursive: true });
    fs.mkdirSync(out);
  });

  it('copies publishable files to the layout and skips the rest', () => {
    const r = run();
    expect(fs.existsSync(path.join(out, 'public/situaciones/eco-4eso/ud01-mercat.ca.html'))).toBe(true);
    expect(fs.existsSync(path.join(out, 'public/downloads/situaciones/eco-4eso/ud01-mercat.ca.pdf'))).toBe(true);
    expect(fs.existsSync(path.join(out, 'public/situaciones/eco-4eso/ud01-02-repas.ca.html'))).toBe(true);
    const g = read('src/content/asignaturas/eco-4eso/situaciones/guias/ud01-mercat-guia.ca.md');
    expect(g).toContain('title: "Guia del mercat"');
    expect(g).toContain('tipo: guia');
    expect(g).not.toMatch(/^# /m); // leading H1 is the page title, not repeated in the body
    expect(g).toContain('slug: "asignaturas/eco-4eso/situaciones/guias/ud01-mercat-guia.ca"');
    expect(read('src/content/asignaturas/eco-4eso/situaciones/guias/ud01-mercat-solucionario.ca.md')).toContain('title: "ud01-mercat"');
    const all = fs.readdirSync(path.join(out, 'public/situaciones/eco-4eso'));
    expect(all.some((f) => /privat|llibreta/.test(f))).toBe(false);
    expect(r.nuevos.length).toBe(5);
    expect(Object.keys(JSON.parse(read(MANIFEST))).some((k) => /privat|llibreta|docx/.test(k))).toBe(false);
  });

  it('is idempotent', () => {
    run();
    const snap = () =>
      [MANIFEST, 'public/situaciones/eco-4eso/ud01-mercat.ca.html', 'src/content/asignaturas/eco-4eso/situaciones/guias/ud01-mercat-guia.ca.md'].map(read);
    const a = snap();
    const r = run();
    expect(snap()).toEqual(a);
    expect(r).toMatchObject({ nuevos: [], cambiados: [], sinCambios: 5 });
  });

  it('marks translation pending when ES twin is missing or stale, and preserves esHashOfSource', () => {
    const first = run();
    expect(first.traduccionPendiente).toContain('public/situaciones/eco-4eso/ud01-mercat.ca.html');
    // simulate a translation made against the current source
    const esFile = path.join(out, 'public/situaciones/eco-4eso/ud01-mercat.html');
    fs.writeFileSync(esFile, '<h1>Mercado</h1>');
    const mp = path.join(out, MANIFEST);
    const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
    const key = 'economia-4eso/unitats/ud01-mercat/ud01-mercat.html';
    m[key].esHashOfSource = m[key].sha256;
    fs.writeFileSync(mp, JSON.stringify(m, null, 2) + '\n');
    expect(run().traduccionPendiente).not.toContain('public/situaciones/eco-4eso/ud01-mercat.ca.html');
    // change the source
    fs.appendFileSync(path.join(src, key), '<p>nou</p>');
    const r = run();
    expect(r.cambiados).toEqual([key]);
    expect(r.traduccionPendiente).toContain('public/situaciones/eco-4eso/ud01-mercat.ca.html');
    expect(JSON.parse(read(MANIFEST))[key].esHashOfSource).toBe(m[key].sha256);
    expect(fs.readFileSync(esFile, 'utf8')).toBe('<h1>Mercado</h1>');
  });

  it('CLI prints the report as JSON', () => {
    const stdout = execFileSync('node', [SCRIPT, '--no-git', '--src', src, '--out', out], { encoding: 'utf8' });
    expect(JSON.parse(stdout).nuevos.length).toBe(5);
  });

  it('reports orphans in eliminados, and only deletes them with --prune', () => {
    run();
    const key = 'economia-4eso/unitats/ud01-mercat/ud01-mercat.pdf';
    const pdf = 'public/downloads/situaciones/eco-4eso/ud01-mercat.ca.pdf';
    const esPdf = 'public/downloads/situaciones/eco-4eso/ud01-mercat.pdf';
    fs.writeFileSync(path.join(out, esPdf), 'es');
    fs.rmSync(path.join(src, key));
    let r = run();
    expect(r.eliminados).toEqual([{ source: key, targets: [pdf], esTwins: [esPdf] }]);
    expect(fs.existsSync(path.join(out, pdf))).toBe(true);
    expect(run().eliminados.length).toBe(1); // still reported until pruned
    r = importDocencia({ sourceDir: src, outDir: out, noGit: true, prune: true });
    expect(r.eliminados.length).toBe(1);
    expect(fs.existsSync(path.join(out, pdf))).toBe(false);
    expect(fs.existsSync(path.join(out, esPdf))).toBe(false);
    expect(JSON.parse(read(MANIFEST))[key]).toBeUndefined();
    expect(run().eliminados).toEqual([]);
  });

  it('--prune refuses targets outside the import layout', () => {
    run();
    const key = 'economia-4eso/unitats/ud01-mercat/ud01-mercat.pdf';
    const mp = path.join(out, MANIFEST);
    const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
    m[key].targets = ['../escape.txt'];
    fs.writeFileSync(mp, JSON.stringify(m));
    fs.rmSync(path.join(src, key));
    expect(() => importDocencia({ sourceDir: src, outDir: out, noGit: true, prune: true })).toThrow(/outside the import layout/);
  });

  it('reports restaurados when a target is missing but its source is unchanged', () => {
    run();
    const t = 'public/situaciones/eco-4eso/ud01-mercat.ca.html';
    fs.rmSync(path.join(out, t));
    const r = run();
    expect(r.restaurados).toEqual([t]);
    expect(r.sinCambios).toBe(4);
    expect(fs.existsSync(path.join(out, t))).toBe(true);
  });

  it('a published file renamed to -privat lands in eliminados', () => {
    run();
    const d = path.join(src, 'economia-4eso/avaluacio');
    fs.renameSync(path.join(d, 'ud01-02-repas.html'), path.join(d, 'ud01-02-repas-privat.html'));
    expect(run().eliminados.map((e) => e.source)).toEqual(['economia-4eso/avaluacio/ud01-02-repas.html']);
  });

  it('CLI without --src uses DOCENCIA_DIR and does not misread absent flags', () => {
    const stdout = execFileSync('node', [SCRIPT, '--no-git', '--out', out], {
      encoding: 'utf8',
      env: { ...process.env, DOCENCIA_DIR: src },
    });
    expect(JSON.parse(stdout).nuevos.length).toBe(5);
  });

  it('leaves targets of unchanged sources untouched, overwrites changed ones', () => {
    run();
    const t = 'public/situaciones/eco-4eso/ud01-mercat.ca.html';
    fs.writeFileSync(path.join(out, t), 'anonymised');
    expect(run().sinCambios).toBe(5);
    expect(read(t)).toBe('anonymised');
    const key = 'economia-4eso/unitats/ud01-mercat/ud01-mercat.html';
    fs.appendFileSync(path.join(src, key), '<p>nou</p>');
    expect(run().cambiados).toEqual([key]);
    expect(read(t)).toContain('nou');
  });
});

const hasGit = (() => {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe.skipIf(!hasGit)('importDocencia in git mode', () => {
  it('reads committed files and content from HEAD, ignoring the working tree', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docencia-git-'));
    const repo = path.join(tmp, 'repo');
    const out = path.join(tmp, 'out');
    const d = path.join(repo, 'economia-4eso/activitats');
    fs.mkdirSync(d, { recursive: true });
    fs.mkdirSync(out);
    const git = (...a) => execFileSync('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { stdio: 'ignore' });
    git('init', '-q');
    fs.writeFileSync(path.join(d, 'ud01-a.html'), 'committed');
    fs.writeFileSync(path.join(d, 'ud01-b.html'), 'committed-b');
    git('add', '-A');
    git('commit', '-qm', 'init');
    fs.rmSync(path.join(d, 'ud01-a.html')); // uncommitted deletion
    fs.writeFileSync(path.join(d, 'ud01-b.html'), 'edited'); // uncommitted edit
    fs.writeFileSync(path.join(d, 'ud01-c.html'), 'new'); // untracked
    const r = importDocencia({ sourceDir: repo, outDir: out });
    expect(r.nuevos.sort()).toEqual(['economia-4eso/activitats/ud01-a.html', 'economia-4eso/activitats/ud01-b.html']);
    const f = (n) => fs.readFileSync(path.join(out, 'public/situaciones/eco-4eso', n), 'utf8');
    expect(f('ud01-a.ca.html')).toBe('committed');
    expect(f('ud01-b.ca.html')).toBe('committed-b');
    expect(fs.existsSync(path.join(out, 'public/situaciones/eco-4eso/ud01-c.ca.html'))).toBe(false);
  });
});
