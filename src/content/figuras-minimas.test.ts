import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Floor of figures per book unit and per Olimpiada ficha.
 *
 * The content standard (docs/graficos-contenido.md) says every model the text
 * explains is drawn. A test cannot tell whether a paragraph explains a model,
 * but it can stop the two ways a unit goes bare again: a new unit shipped as
 * plain text, and a Valencian twin that drops figures its Spanish sibling has.
 */
const ASIGNATURAS = 'src/content/asignaturas';
const FICHAS = 'src/content/olimpiada/fichas';

/** Every published unit has at least this many; the barest one today has 2. */
const MIN_UNIDAD = 2;
/** Olimpiada fichas are short; one figure is the floor. */
const MIN_FICHA = 1;

const figuras = (text: string) => (text.match(/<(Diagram|Figure|HerramientaIsland)[\s>]/g) ?? []).length;
const publicado = (text: string) => /^estado:\s*['"]?publicado/m.test(text);

function castellanos(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.mdx') && !f.endsWith('.ca.mdx')).map((f) => join(dir, f));
}

const grupos: [string, string[], number][] = [
  ...readdirSync(ASIGNATURAS).map((s): [string, string[], number] => [s, castellanos(join(ASIGNATURAS, s, 'libro')), MIN_UNIDAD]),
  ['olimpiada', castellanos(FICHAS), MIN_FICHA],
];

describe('figures per unit', () => {
  for (const [nombre, archivos, minimo] of grupos) {
    it(`${nombre}: every published unit has at least ${minimo} and its twin has as many`, () => {
      const pobres: string[] = [];
      for (const es of archivos) {
        const texto = readFileSync(es, 'utf8');
        if (!publicado(texto)) continue;
        const n = figuras(texto);
        if (n < minimo) pobres.push(`${es}: ${n} figure(s), needs ${minimo}`);
        const ca = es.replace(/\.mdx$/, '.ca.mdx');
        if (existsSync(ca)) {
          const m = figuras(readFileSync(ca, 'utf8'));
          if (m !== n) pobres.push(`${ca}: ${m} figure(s), the Spanish unit has ${n}`);
        }
      }
      expect(pobres).toEqual([]);
    });
  }
});
