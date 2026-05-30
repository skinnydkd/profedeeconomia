import { describe, it, expect } from 'vitest';
import { parseTreeFromMdxBody } from './parse-tree.ts';

const sampleBody = `
Algo de prosa antes del JSON.

\`\`\`json
{
  "intro": { "kicker": "K", "titulo": "T", "contexto": "C", "kpi_inicial": { "caja": 100 } },
  "nodes": { "n1": { "titulo": "T1", "situacion": "S1", "opciones": [
    { "label": "A", "kpi_delta": { "caja": 10 }, "feedback": "F", "next": "final:exito" }
  ] } },
  "finales": { "exito": { "titulo": "Win", "resumen": "R", "lecciones_clave": ["L"] } }
}
\`\`\`

Algo más después.
`;

describe('parseTreeFromMdxBody', () => {
  it('extracts the JSON block and returns a typed tree', () => {
    const tree = parseTreeFromMdxBody(sampleBody);
    expect(tree.intro.titulo).toBe('T');
    expect(tree.nodes.n1.opciones[0].next).toBe('final:exito');
    expect(tree.finales.exito.lecciones_clave).toEqual(['L']);
  });

  it('throws a descriptive error when no JSON block exists', () => {
    expect(() => parseTreeFromMdxBody('# Just markdown')).toThrow(/no JSON block/i);
  });

  it('throws when the JSON is malformed', () => {
    const bad = '```json\n{ "intro": }\n```';
    expect(() => parseTreeFromMdxBody(bad)).toThrow(/malformed JSON/i);
  });

  it('throws when required keys are missing', () => {
    const incomplete = '```json\n{ "intro": {} }\n```';
    expect(() => parseTreeFromMdxBody(incomplete)).toThrow(/intro\.titulo/i);
  });
});
