import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const base = 'src/content/asignaturas/edmn-2bach';
const dir = join(base, 'ebau-problemas');
const files = existsSync(dir) ? readdirSync(dir) : [];
const es = files.filter((f) => f.endsWith('.mdx') && !f.endsWith('.ca.mdx'));
const ca = files.filter((f) => f.endsWith('.ca.mdx'));
const count = (names: string[]) =>
  names.reduce(
    (n, f) => n + readFileSync(join(dir, f), 'utf8').split('\n').filter((l) => l.startsWith('### Problema')).length,
    0,
  );

describe('EDMN ebau-problemas families', () => {
  it('has 5 ES and 5 CA files', () => {
    expect(es).toHaveLength(5);
    expect(ca).toHaveLength(5);
  });
  it('keeps the same number of problems in ES and CA, at least 14 (the plan said 15 but the source has 14)', () => {
    expect(count(es)).toBe(count(ca));
    expect(count(es)).toBeGreaterThanOrEqual(14);
  });
  it('03-problemas-resueltos has no problems left', () => {
    for (const f of ['03-problemas-resueltos.mdx', '03-problemas-resueltos.ca.mdx']) {
      const t = readFileSync(join(base, 'ebau', f), 'utf8');
      expect(t.split('\n').some((l) => l.startsWith('### Problema'))).toBe(false);
    }
  });
});
