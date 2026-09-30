import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

/**
 * The question texts of the tests and retos (statement, options, explanation)
 * are printed as text with Markdown emphasis, not as HTML, so a `<em>cobrar</em>`
 * showed its tags on the page (R6 A3). Emphasis there is written `*así*`.
 */
const HTML = /<\/?(em|strong|b|i)>/;

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

type Item = { enunciado?: string; explicacion?: string; opciones?: string[]; izquierda?: string[]; derecha?: string[]; elementos?: string[] };
const textos = (it: Item) => [it.enunciado, it.explicacion, ...(it.opciones ?? []), ...(it.izquierda ?? []), ...(it.derecha ?? []), ...(it.elementos ?? [])];

const ficheros = walk('src/content/asignaturas').filter((p) => /\/(tests|retos)\/[^/]+\.mdx?$/.test(p));

describe('question texts use Markdown emphasis, not HTML', () => {
  it('finds tests and retos', () => {
    expect(ficheros.length).toBeGreaterThan(100);
  });

  it('has no HTML tags where the players print plain text', () => {
    const conHtml: string[] = [];
    for (const f of ficheros) {
      const src = readFileSync(f, 'utf8');
      let items: Item[] = [];
      if (f.includes('/tests/')) {
        items = (parse(/^---\r?\n([\s\S]*?)\r?\n---/.exec(src)?.[1] ?? '') ?? {}).preguntas ?? [];
      } else {
        const json = /```json\s*\n([\s\S]*?)\n```/.exec(src)?.[1];
        if (json) items = (JSON.parse(json).pasos ?? []).flatMap((p: { items?: Item[] }) => p.items ?? []);
      }
      for (const it of items) if (textos(it).some((t) => typeof t === 'string' && HTML.test(t))) conHtml.push(f);
    }
    expect([...new Set(conHtml)]).toEqual([]);
  });
});
