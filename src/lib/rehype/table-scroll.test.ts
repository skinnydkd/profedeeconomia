import { describe, expect, it } from 'vitest';
import rehypeTableScroll from './table-scroll.mjs';

type Props = Record<string, unknown>;
type HNode = { type: string; tagName?: string; value?: string; properties?: Props; children?: HNode[] };

const text = (value: string): HNode => ({ type: 'text', value });
const el = (tagName: string, children: HNode[] = [], properties: Props = {}): HNode => ({ type: 'element', tagName, properties, children });
const table = (heads: string[]): HNode =>
  el('table', [el('thead', [el('tr', heads.map((h) => el('th', h ? [text(h)] : [])))]), el('tbody', [])]);

function run(children: HNode[], path = '/repo/src/content/asignaturas/x/libro/01-u.mdx'): HNode {
  const tree: HNode = { type: 'root', children };
  rehypeTableScroll()(tree, { path });
  return tree;
}

describe('rehypeTableScroll', () => {
  it('wraps a table in a focusable, labelled region that can scroll', () => {
    const tree = run([table(['Concepto', 'Importe'])]);
    const wrap = tree.children![0];
    expect(wrap.tagName).toBe('div');
    expect(wrap.properties).toMatchObject({ className: ['tabla-scroll'], role: 'region', tabIndex: 0, ariaLabel: 'Tabla: Concepto, Importe' });
    expect(wrap.children![0].tagName).toBe('table');
  });

  it('labels Valencian twins in Valencian', () => {
    const tree = run([table(['Concepte', 'Import'])], '/repo/src/content/asignaturas/x/libro/01-u.ca.mdx');
    expect(tree.children![0].properties!.ariaLabel).toBe('Taula: Concepte, Import');
  });

  it('skips an empty corner cell and names three columns at most', () => {
    const tree = run([table(['', 'A', 'B', 'C', 'D'])]);
    expect(tree.children![0].properties!.ariaLabel).toBe('Tabla: A, B, C…');
  });

  it('falls back to a bare label when the table has no header text', () => {
    const tree = run([el('table', [el('tbody', [])])]);
    expect(tree.children![0].properties!.ariaLabel).toBe('Tabla');
  });

  it('also wraps tables nested inside components', () => {
    const tree = run([{ type: 'mdxJsxFlowElement', children: [el('p'), table(['X'])] }]);
    expect(tree.children![0].children![1].properties!.className).toEqual(['tabla-scroll']);
  });

  it('keeps a figure and its € or % on the same line', () => {
    const cell = el('td', [text('25.000 € y un 15 %')]);
    run([el('table', [el('tbody', [el('tr', [cell])])])]);
    expect(cell.children![0].value).toBe('25.000\u00a0€ y un 15\u00a0%');
  });

  it('does not wrap a table twice', () => {
    const tree = run([table(['X'])]);
    rehypeTableScroll()(tree, { path: 'a.mdx' });
    expect(tree.children![0].children![0].tagName).toBe('table');
  });

  it('keeps units and spaced thousands together in running text, but not in code', () => {
    const tree = run([el('p', [text('De 42 000 a 1 250 000 unidades, un 7 % más; en 2024 hubo 30 casos.')]), el('pre', [el('code', [text('10 000 €')])])]);
    expect(tree.children![0].children![0].value).toBe('De 42\u00a0000 a 1\u00a0250\u00a0000 unidades, un 7\u00a0% más; en 2024 hubo 30 casos.');
    expect(tree.children![1].children![0].children![0].value).toBe('10 000 €');
  });
});
