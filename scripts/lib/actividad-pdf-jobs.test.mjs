import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseActividadPrintPath, findActividadPrintJobs, subjectsWithActividadPdfs } from './actividad-pdf-jobs.mjs';

describe('parseActividadPrintPath', () => {
  it('extracts asignatura/slug and builds route + out name from a dist html path', () => {
    const rel = 'eco-4eso/actividades/07-presupuesto-personal-plan-ahorro/imprimir/index.html';
    expect(parseActividadPrintPath(rel)).toEqual({
      asignatura: 'eco-4eso',
      slug: '07-presupuesto-personal-plan-ahorro',
      route: 'eco-4eso/actividades/07-presupuesto-personal-plan-ahorro/imprimir',
      out: 'actividad-eco-4eso-07-presupuesto-personal-plan-ahorro.pdf',
    });
  });

  it('ignores the whole-subject cuaderno routes and other sections', () => {
    expect(parseActividadPrintPath('eco-4eso/actividades/imprimir/profesor/index.html')).toBeNull();
    expect(parseActividadPrintPath('eco-4eso/actividades/07-x/index.html')).toBeNull();
    expect(parseActividadPrintPath('eco-4eso/retos/07-x/imprimir/index.html')).toBeNull();
    expect(parseActividadPrintPath('debates/mercado-estado/01-x/imprimir/index.html')).toBeNull();
  });

  it('normalizes Windows backslashes', () => {
    expect(parseActividadPrintPath('eco-4eso\\actividades\\05-nomina\\imprimir\\index.html')?.slug).toBe('05-nomina');
  });
});

describe('findActividadPrintJobs', () => {
  function fakeDist() {
    const dist = mkdtempSync(join(tmpdir(), 'dist-'));
    const touch = (...segs) => {
      mkdirSync(join(dist, ...segs.slice(0, -1)), { recursive: true });
      writeFileSync(join(dist, ...segs), '<html></html>');
    };
    touch('eco-4eso', 'actividades', '07-presupuesto', 'imprimir', 'index.html');
    touch('eco-4eso', 'actividades', '05-nomina', 'imprimir', 'index.html');
    touch('eco-4eso', 'actividades', 'imprimir', 'profesor', 'index.html');
    touch('edmn-2bach', 'actividades', '01-caso', 'imprimir', 'index.html');
    touch('juegos', 'econopoly', 'imprimir', 'index.html');
    return dist;
  }

  it('finds every per-activity print route, sorted', () => {
    const jobs = findActividadPrintJobs(fakeDist());
    expect(jobs.map((j) => j.route)).toEqual([
      'eco-4eso/actividades/05-nomina/imprimir',
      'eco-4eso/actividades/07-presupuesto/imprimir',
      'edmn-2bach/actividades/01-caso/imprimir',
    ]);
  });

  it('narrows to the requested subjects', () => {
    const jobs = findActividadPrintJobs(fakeDist(), ['edmn-2bach']);
    expect(jobs.map((j) => j.out)).toEqual(['actividad-edmn-2bach-01-caso.pdf']);
  });
});

describe('subjectsWithActividadPdfs', () => {
  it('lists the subjects that already have a sheet in downloads', () => {
    const dl = mkdtempSync(join(tmpdir(), 'dl-'));
    writeFileSync(join(dl, 'actividad-eco-4eso-07-presupuesto.pdf'), '');
    writeFileSync(join(dl, 'actividad-eco-4eso-07-presupuesto.ca.pdf'), '');
    writeFileSync(join(dl, 'eco-1bach-libro.pdf'), '');
    expect(subjectsWithActividadPdfs(dl, ['eco-1bach', 'eco-4eso', 'edmn-2bach'])).toEqual(['eco-4eso']);
  });
});
