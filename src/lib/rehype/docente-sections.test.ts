import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import rehypeDocenteSections, { esSeccionDocente } from './docente-sections.mjs';

type Props = Record<string, unknown>;
type HNode = { type: string; tagName?: string; value?: string; properties?: Props; children?: HNode[] };

const text = (value: string): HNode => ({ type: 'text', value });
const el = (tagName: string, children: HNode[] = [], properties: Props = {}): HNode => ({ type: 'element', tagName, properties, children });
const h2 = (t: string) => el('h2', [text(t)]);
const p = (t: string) => el('p', [text(t)]);

function run(children: HNode[]): HNode {
  const tree: HNode = { type: 'root', children };
  rehypeDocenteSections()(tree);
  return tree;
}

describe('rehypeDocenteSections', () => {
  it('wraps a teacher-only section, up to the next h2, in a marked element', () => {
    const tree = run([h2('Pasos'), p('a'), h2('Solución orientativa para el profesor'), p('42'), el('pre', [text('x')]), h2('Variantes y extensiones'), p('b')]);
    const tags = tree.children!.map((n) => n.tagName);
    expect(tags).toEqual(['h2', 'p', 'section', 'h2', 'p']);
    const sec = tree.children![2];
    expect(sec.properties).toMatchObject({ dataDocente: '' });
    expect(sec.children!.map((n) => n.tagName)).toEqual(['h2', 'p', 'pre']);
  });

  it('wraps a teacher section that runs to the end of the document', () => {
    const tree = run([h2('Pasos'), p('a'), h2('Notes per al docent'), p('b')]);
    expect(tree.children!.map((n) => n.tagName)).toEqual(['h2', 'p', 'section']);
    expect(tree.children![2].children).toHaveLength(2);
  });

  it('leaves a document with no teacher section untouched', () => {
    const tree = run([h2('Planteamiento'), p('a'), h2('Hoja de respuestas'), p('b')]);
    expect(tree.children!.map((n) => n.tagName)).toEqual(['h2', 'p', 'h2', 'p']);
  });
});

describe('esSeccionDocente', () => {
  it.each([
    'Para el profesorado',
    'Notas para el docente',
    'Solución (para corrección)',
    'Pistas para la corrección',
    'Soluciones de referencia',
    'Resultados esperados (orientativos)',
    'Respuesta de referencia (no es la única correcta)',
    'Índice de cotización 2035 (lo proyecta el profesor al final)',
    'Per al professorat',
    'Solució de referència',
    'Resultats esperats (orientatius)',
    "Resposta de referència (no és l'única correcta)",
    'Avís per al professorat · tema sensible',
  ])('teacher only: %s', (t) => expect(esSeccionDocente(t)).toBe(true));

  it.each([
    'Planteamiento',
    'Pasos',
    'Criterios de evaluación',
    'Hoja de respuestas',
    'Ficha de resultados',
    'DAFO de referencia (caso: técnico/a de FP en su primer año)',
    'Tabla resumen de referencia (fotocopiable, datos didácticos)',
    'Materiales del caso (fotocopiables, datos de referencia 2026)',
    'Plantilla del proyecto profesional (3-5 páginas)',
    'Plantilla del projecte professional (3-5 pàgines)',
  ])('for students: %s', (t) => expect(esSeccionDocente(t)).toBe(false));
});

/**
 * The student workbook hides whatever the plugin marks, so a solution written
 * under a heading the plugin does not recognise leaks. Headings that mention
 * an answer or a solution must therefore be either recognised or listed here
 * as student material (blank answer sheets, case data).
 */
describe('activity headings', () => {
  const PARA_ALUMNADO = /^(Hoja|Ficha|Full|Fitxa) de (respuestas|resultados|respostes|resultats)$|^DAFO de refer|^(Tabla|Taula) resum|^Materiale?s del cas/;
  const SOSPECHOSO = /soluci|respuesta|resposta|resultados? |resultats? |referencia|referència|orientati/i;

  it('every heading that sounds like an answer is teacher-only or known student material', () => {
    const root = 'src/content/asignaturas';
    const dudosos: string[] = [];
    for (const asig of readdirSync(root)) {
      const dir = join(root, asig, 'actividades');
      let files: string[] = [];
      try { files = readdirSync(dir); } catch { continue; }
      for (const f of files.filter((x) => /\.mdx?$/.test(x))) {
        for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/^## (.+?)\s*$/gm)) {
          const t = m[1];
          if (SOSPECHOSO.test(t) && !esSeccionDocente(t) && !PARA_ALUMNADO.test(t)) dudosos.push(`${asig}/${f}: ${t}`);
        }
      }
    }
    expect(dudosos).toEqual([]);
  });
});
