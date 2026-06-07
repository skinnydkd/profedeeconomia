// src/components/retos/parse-reto.test.ts
import { describe, it, expect } from 'vitest';
import { parseRetoFromMdxBody } from './parse-reto';

const VALID = `Intro text.

\`\`\`json
{
  "intro": { "kicker": "Reto", "titulo": "Escasez", "contexto": "<p>Contexto</p>" },
  "pasos": [
    {
      "titulo": "Paso 1",
      "escenario": "<p>Datos</p>",
      "items": [
        { "tipo": "opcion-multiple", "enunciado": "2+2?", "opciones": ["3", "4"], "correcta": 1, "explicacion": "Suma" },
        { "tipo": "ordenar", "enunciado": "Ordena", "elementos": ["a", "b", "c"] },
        { "tipo": "abierta", "enunciado": "Explica", "modelo": "<p>Modelo</p>" }
      ]
    }
  ]
}
\`\`\`
`;

describe('parseRetoFromMdxBody', () => {
  it('parses and validates a reto JSON block', () => {
    const reto = parseRetoFromMdxBody(VALID);
    expect(reto.intro.titulo).toBe('Escasez');
    expect(reto.pasos).toHaveLength(1);
    expect(reto.pasos[0].items).toHaveLength(3);
    expect(reto.pasos[0].items[0].tipo).toBe('opcion-multiple');
  });

  it('throws when there is no JSON block', () => {
    expect(() => parseRetoFromMdxBody('no json here')).toThrow(/no JSON block/);
  });

  it('throws on a schema violation (missing intro.titulo)', () => {
    const bad = '```json\n{ "pasos": [] }\n```';
    expect(() => parseRetoFromMdxBody(bad)).toThrow();
  });

  it('throws on an unknown item tipo', () => {
    const bad = '```json\n{ "intro": { "titulo": "x", "contexto": "y" }, "pasos": [ { "titulo": "p", "items": [ { "tipo": "loquesea", "enunciado": "z" } ] } ] }\n```';
    expect(() => parseRetoFromMdxBody(bad)).toThrow();
  });
});
