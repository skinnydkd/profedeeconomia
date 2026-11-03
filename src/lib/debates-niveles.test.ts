import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CRITERIOS_CON_NIVELES, nivelesDe } from './debates-niveles';

const DIR = join(process.cwd(), 'src/content/debates');

/** Every debate file with its locale and the criterion names of its rubric. */
function debates() {
  const out: { file: string; locale: 'es' | 'ca'; criterios: string[] }[] = [];
  for (const familia of readdirSync(DIR)) {
    for (const f of readdirSync(join(DIR, familia)).filter((x) => x.endsWith('.mdx'))) {
      const src = readFileSync(join(DIR, familia, f), 'utf8');
      const rubrica = src.split('\nrubrica:')[1]?.split(/\n[a-z_]+:/)[0] ?? '';
      const criterios = [...rubrica.matchAll(/criterio:\s*"([^"]+)"/g)].map((m) => m[1]);
      out.push({ file: `${familia}/${f}`, locale: f.endsWith('.ca.mdx') ? 'ca' : 'es', criterios });
    }
  }
  return out;
}

describe('debate rubric level descriptors', () => {
  it('has four non-empty descriptors per criterion in both languages', () => {
    for (const c of CRITERIOS_CON_NIVELES) {
      for (const locale of ['es', 'ca'] as const) {
        const n = nivelesDe(c, locale);
        expect(n, `${c} (${locale})`).toBeDefined();
        expect(n!.length).toBe(4);
        for (const d of n!) expect(d.trim().length, `${c} (${locale})`).toBeGreaterThan(20);
      }
    }
  });

  it('reaches the shared criteria as the debates spell them, in both languages', () => {
    const all = debates();
    const withLevels = all.filter((d) => d.criterios.some((c) => nivelesDe(c, d.locale)));
    // 16 debates share at least one of the four criteria, in ES and in CA.
    expect(withLevels.filter((d) => d.locale === 'es').length).toBeGreaterThanOrEqual(16);
    expect(withLevels.filter((d) => d.locale === 'ca').length).toBeGreaterThanOrEqual(16);
    // A Valencian file must find its descriptors under its Valencian names.
    for (const d of all.filter((x) => x.locale === 'ca')) {
      const es = all.find((x) => x.file === d.file.replace('.ca.mdx', '.mdx'));
      if (!es) continue;
      const esCount = es.criterios.filter((c) => nivelesDe(c, 'es')).length;
      const caCount = d.criterios.filter((c) => nivelesDe(c, 'ca')).length;
      expect(caCount, d.file).toBe(esCount);
    }
  });
});
