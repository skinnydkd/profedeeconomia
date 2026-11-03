import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A project's `nivel` drives the level filter, and its `unidades_relacionadas`
 * tell the teacher where it fits in each economics subject. In September 2026
 * six projects listed ESO in `nivel` while bridging only to Bachillerato
 * units, so an ESO teacher had nowhere to place them, and a Bachillerato-only
 * project bridged to a 3.º ESO unit. Both directions are checked here: every
 * stage a project bridges to is in its `nivel`, and every school stage in its
 * `nivel` (ESO, Bachillerato) has at least one bridge. FP is left out of the
 * second check: the FP subjects on the site (IPE) are not mapped to projects.
 */
const ROOT = join('src', 'content', 'proyectos');
const STAGE: Record<string, string> = {
  'eco-4eso': 'eso',
  'fopp-4eso': 'eso',
  'taller-eco-3eso': 'eso',
  'eco-1bach': 'bach',
  'edmn-2bach': 'bach',
  'eeae-bach': 'bach',
  'gpe-bach': 'bach',
  'cjd-bach': 'bach',
  'ipe1-fp': 'fp',
  'ipe2-fp': 'fp',
};

const files = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((m) => readdirSync(join(ROOT, m.name)).filter((f) => f.endsWith('.mdx')).map((f) => join(ROOT, m.name, f)));

describe('project levels match the stages the project bridges to', () => {
  it('finds the projects', () => {
    expect(files.length).toBeGreaterThanOrEqual(36);
  });
  for (const file of files) {
    it(file, () => {
      const fm = readFileSync(file, 'utf8').split('---')[1] ?? '';
      const nivel = (fm.match(/^nivel:\s*\[([^\]]*)\]/m)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      const asignaturas = [...fm.matchAll(/asignatura:\s*"?([a-z0-9-]+)/g)].map((m) => m[1]);
      const stages = new Set(asignaturas.map((a) => STAGE[a]).filter(Boolean));
      expect([...stages].filter((s) => !nivel.includes(s)), 'bridged stage missing from nivel').toEqual([]);
      expect(nivel.filter((n) => n !== 'fp' && !stages.has(n)), 'nivel without a bridge').toEqual([]);
    });
  }
});
