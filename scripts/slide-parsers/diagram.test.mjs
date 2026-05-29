import { describe, it, expect } from 'vitest';
import { renderDiagram } from './diagram.mjs';

describe('diagram parser', () => {
  it('uses explicit id when present and existing PNG', () => {
    const fakeExists = () => true;
    const node = { attributes: [{ name: 'id', value: 'marketing-mix-4p' }, { name: 'caption', value: 'Las 4P' }] };
    const md = renderDiagram(node, { asignatura: 'edmn-2bach', unitSlug: '06-funcion-comercial-marketing', positionalIndex: 0, existsFn: fakeExists });
    expect(md).toMatch(/marketing-mix-4p\.png/);
    expect(md).toMatch(/Las 4P/);
  });

  it('falls back to positional name when no id', () => {
    const node = { attributes: [{ name: 'caption', value: 'sin id' }] };
    const md = renderDiagram(node, { asignatura: 'edmn-2bach', unitSlug: '06-funcion-comercial-marketing', positionalIndex: 2, existsFn: () => true });
    expect(md).toMatch(/diagram-03\.png/);
  });

  it('returns null if the asset is missing', () => {
    const node = { attributes: [{ name: 'caption', value: 'X' }] };
    const md = renderDiagram(node, { asignatura: 'x', unitSlug: 'y', positionalIndex: 0, existsFn: () => false });
    expect(md).toBeNull();
  });
});
