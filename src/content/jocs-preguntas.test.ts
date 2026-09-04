import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Guard for the multiplayer game's question bank.
 *
 * The content schema validates each file on its own — id shape, category, and
 * `correcta` inside `opciones`. It cannot see across files, and it does not look
 * at the body at all, so four things break silently:
 *
 *  - two files claiming the same id (the second one wins in the compiled bank
 *    and the first question simply disappears);
 *  - a filename that no longer matches its id, which makes a question
 *    unfindable when someone goes looking for it;
 *  - two identical options, where the "wrong" answer is also right;
 *  - an empty body, which ships a question with no prompt.
 */
const DIR = 'src/content/jocs-economics/preguntas';

interface Pregunta {
  file: string;
  id: string;
  opciones: string[];
  correcta: number;
  enunciado: string;
}

const preguntas: Pregunta[] = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const text = readFileSync(join(DIR, file), 'utf8');
    const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
    if (!m) throw new Error(`${file}: no frontmatter`);
    const fm = parseYaml(m[1]) as { id: string; opciones: string[]; correcta: number };
    return { file, id: fm.id, opciones: fm.opciones, correcta: fm.correcta, enunciado: m[2].trim() };
  });

describe('game question bank', () => {
  it('has questions to check', () => {
    expect(preguntas.length).toBeGreaterThan(0);
  });

  it('gives every question a unique id', () => {
    const seen = new Map<string, string[]>();
    for (const p of preguntas) seen.set(p.id, [...(seen.get(p.id) ?? []), p.file]);
    const dupes = [...seen].filter(([, files]) => files.length > 1);
    expect(dupes.map(([id, files]) => `${id}: ${files.join(', ')}`)).toEqual([]);
  });

  it('names every file after its id', () => {
    const off = preguntas.filter((p) => p.file !== `${p.id}.md`);
    expect(off.map((p) => `${p.file} declares id ${p.id}`)).toEqual([]);
  });

  it('never repeats an option inside a question', () => {
    const off = preguntas.filter((p) => new Set(p.opciones).size !== p.opciones.length);
    expect(off.map((p) => p.id)).toEqual([]);
  });

  it('points `correcta` at a real option', () => {
    const off = preguntas.filter(
      (p) => !Number.isInteger(p.correcta) || p.correcta < 0 || p.correcta >= p.opciones.length,
    );
    expect(off.map((p) => `${p.id}: correcta ${p.correcta} of ${p.opciones.length}`)).toEqual([]);
  });

  it('always ships a prompt', () => {
    expect(preguntas.filter((p) => p.enunciado.length === 0).map((p) => p.id)).toEqual([]);
  });
});
