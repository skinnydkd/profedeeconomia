import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A debate's `nivel` drives the level filter, and its `unidades_relacionadas`
 * say where it fits in each subject. When a debate bridges to an ESO unit but
 * its `nivel` leaves out `eso`, the ESO teacher filtering by level never finds
 * it (five debates were in that state in September 2026). Every stage a debate
 * bridges to must be in its `nivel`. The reverse (a level with no bridge yet)
 * is allowed: it is an editorial choice, not an inconsistency.
 */
const ROOT = join('src', 'content', 'debates');
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
  .flatMap((fam) => readdirSync(join(ROOT, fam.name)).filter((f) => f.endsWith('.mdx')).map((f) => join(ROOT, fam.name, f)));

describe('debate levels cover every stage the debate bridges to', () => {
  it('finds the debates', () => {
    expect(files.length).toBeGreaterThan(20);
  });
  for (const file of files) {
    it(file, () => {
      const fm = readFileSync(file, 'utf8').split('---')[1] ?? '';
      const nivel = (fm.match(/^nivel:\s*\[([^\]]*)\]/m)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      const asignaturas = [...fm.matchAll(/asignatura:\s*"?([a-z0-9-]+)/g)].map((m) => m[1]);
      const stages = [...new Set(asignaturas.map((a) => STAGE[a]).filter(Boolean))];
      expect(stages.filter((s) => !nivel.includes(s)), `nivel: [${nivel.join(', ')}]`).toEqual([]);
    });
  }
});
