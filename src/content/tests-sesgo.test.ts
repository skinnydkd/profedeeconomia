import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/**
 * Answer-key bias in the self-assessment tests.
 *
 * A student who learns that the longest option is the right one, or that a
 * true/false statement is nearly always false, passes without reading. Neither
 * can be judged question by question, so the guard is per subject and language:
 * the share of questions whose right option is clearly the longest, and the
 * share of false statements.
 */
const ASIGNATURAS = 'src/content/asignaturas';
/** Right option more than 25 % longer than every distractor. */
const MAX_CLARAMENTE_MAS_LARGA = 0.15;
/** False statements among the true/false questions of a subject. */
const MAX_FALSAS = 0.7;
const MIN_FALSAS = 0.3;

type Pregunta = { tipo?: string; opciones?: unknown[]; correcta?: unknown };

function medir(dir: string, ca: boolean) {
  let mc = 0, larga = 0, vf = 0, falsas = 0;
  for (const f of readdirSync(dir).filter((x) => /\.mdx?$/.test(x) && /\.ca\.mdx?$/.test(x) === ca)) {
    const preguntas = (matter(readFileSync(join(dir, f), 'utf8')).data.preguntas ?? []) as Pregunta[];
    for (const q of preguntas) {
      if (Array.isArray(q.opciones) && typeof q.correcta === 'number') {
        const lens = q.opciones.map((o) => String(o).length);
        const otras = lens.filter((_, i) => i !== q.correcta);
        mc++;
        if (lens[q.correcta] > 1.25 * Math.max(...otras)) larga++;
      } else if (q.tipo === 'verdadero-falso') {
        vf++;
        if (q.correcta === false) falsas++;
      }
    }
  }
  return { mc, larga, vf, falsas };
}

describe('test answer keys', () => {
  for (const asig of readdirSync(ASIGNATURAS)) {
    const dir = join(ASIGNATURAS, asig, 'tests');
    if (!existsSync(dir)) continue;
    for (const ca of [false, true]) {
      const m = medir(dir, ca);
      const lengua = ca ? 'ca' : 'es';
      it(`${asig} (${lengua}): the right option is not recognisable by its length`, () => {
        if (m.mc === 0) return;
        expect(m.larga / m.mc, `${m.larga} of ${m.mc} questions`).toBeLessThanOrEqual(MAX_CLARAMENTE_MAS_LARGA);
      });
      it(`${asig} (${lengua}): true/false statements are not nearly all false or all true`, () => {
        if (m.vf < 8) return;
        const parte = m.falsas / m.vf;
        expect(parte, `${m.falsas} false of ${m.vf}`).toBeLessThanOrEqual(MAX_FALSAS);
        expect(parte, `${m.falsas} false of ${m.vf}`).toBeGreaterThanOrEqual(MIN_FALSAS);
      });
    }
  }
});
