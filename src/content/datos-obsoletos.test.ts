import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard for reference figures and rules that have been replaced.
 *
 * When a figure changes, the book unit gets updated but the pieces derived
 * from it (tests, activities, dynamics, refuerzo, diagrams, calculators) keep
 * the old value, and nothing notices: in September 2026 Eco 4ESO still quoted
 * the 2025 minimum wage in eleven files, and three different worker
 * contribution rates coexisted. Each entry below is a figure known to be out
 * of date, with the one that replaces it and an example it must catch.
 *
 * Keep the list current: the SMI changes every February (Real Decreto) and
 * the contribution rates every January (Orden de cotización). A historical
 * mention that says so explicitly can go in `permitido` with its reason.
 */
const ROOTS = ['src/content', 'src/components', 'src/lib', 'src/pages', 'src/i18n'];

interface Obsoleto {
  patron: RegExp;
  motivo: string;
  /** A sentence the pattern has to flag, so a typo cannot disarm it. */
  ejemplo: string;
  /** Files (relative paths) where the old figure is quoted on purpose. */
  permitido?: string[];
}

const OBSOLETOS: Obsoleto[] = [
  {
    patron: /\b1\.184\s?€/,
    motivo: 'SMI de 2025. En 2026 son 1.221 € al mes en 14 pagas (RD 126/2026)',
    ejemplo: 'El SMI es de 1.184 € al mes en 14 pagas.',
  },
  {
    patron: /\b16\.576\s?€/,
    motivo: 'SMI anual de 2025. En 2026 son 17.094 € (RD 126/2026)',
    ejemplo: 'Son 16.576 € brutos al año.',
  },
  {
    patron: /\b(?:RD|Real Decreto|Reial Decret) 87\/2025/,
    motivo: 'Decreto del SMI de 2025. El vigente es el RD 126/2026',
    ejemplo: '(Reial Decret 87/2025)',
  },
  {
    patron: /\b6,35\s?%|\b0[.,]0635\b|\b6,48\s?%/,
    motivo: 'Cotización del trabajador sin el MEI o incompleta. En 2026 es un 6,50 % (4,70 + 1,55 + 0,10 + 0,15)',
    ejemplo: 'El trabajador cotiza un 6,35 % de la base.',
  },
  {
    // Present tense only: «exigía», «hacía falta» and «calia» tell the history.
    patron:
      /\b(?:exige|requiere|pide|hace falta|exigix|exigeix|requerix|requereix|demana|cal)\b[^.\n]{0,30}capital (?:social )?m[ií]nim[oa]? de 3\.000/i,
    motivo: 'La SL se constituye con 1 € desde la Ley 18/2022; 3.000 € solo marca el fin de la reserva legal reforzada',
    ejemplo: 'SL: exige un capital mínimo de 3.000 €.',
  },
  {
    patron: /capital < 3\.000 €\?/,
    motivo: 'Pregunta antigua del árbol de forma jurídica. Ahora es «¿Poco riesgo de deudas?»',
    ejemplo: '«¿vas solo? → sí; ¿capital < 3.000 €? → sí»',
  },
  {
    patron: /(?:no aparecen|no apareixen) en la n[óò]mina/i,
    motivo: 'Las cuotas patronales sí figuran en la nómina (aportación de la empresa); lo que no hacen es descontarse del sueldo',
    ejemplo: 'Las cuotas patronales NO aparecen en la nómina.',
  },
];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    if (/\.test\.tsx?$/.test(d.name)) return [];
    return /\.(mdx?|astro|tsx?|json|ya?ml)$/.test(d.name) ? [p] : [];
  });
}

const FILES = ROOTS.flatMap((r) => walk(r)).map((p) => ({ p, text: readFileSync(p, 'utf8') }));

describe('reference figures that have been replaced', () => {
  it('scans the content and the code', () => {
    expect(FILES.length).toBeGreaterThan(500);
  });

  for (const o of OBSOLETOS) {
    it(`no file quotes ${o.patron.source}`, () => {
      expect(o.patron.test(o.ejemplo), `the pattern misses its own example: ${o.ejemplo}`).toBe(true);
      const hits = FILES.filter(({ p, text }) => !o.permitido?.includes(p) && o.patron.test(text)).map(({ p, text }) => {
        const line = text.split('\n').findIndex((l) => o.patron.test(l)) + 1;
        return `${p}:${line}`;
      });
      expect(hits, `${o.motivo}. Found in:\n${hits.join('\n')}`).toEqual([]);
    });
  }
});
