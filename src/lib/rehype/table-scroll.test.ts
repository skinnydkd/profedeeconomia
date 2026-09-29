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

  it('does not wrap a table twice', () => {
    const tree = run([table(['X'])]);
    rehypeTableScroll()(tree, { path: 'a.mdx' });
    expect(tree.children![0].children![0].tagName).toBe('table');
  });
});
