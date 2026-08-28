import { describe, it, expect } from 'vitest';
import { parseMdx } from './ast';
import { extractAuthoredYaml, parseAuthoredSlides } from './authored';
import { buildDeck } from './build-deck';

const FM = `---
asignatura: fopp-4eso
unidad: 3
title: "Unidad de prueba"
lema: "Un lema."
lang: es
estado: publicado
objetivos: ["x"]
---`;

const FENCE = '```';
const BLOCK = `
## Una sección

Prosa del libro que el modo autorado debe ignorar.

${FENCE}deck
- tipo: section
  title: Primera sección
- tipo: concept
  title: Una idea
  body: Cuerpo de la idea con contenido real.
- tipo: terms
  title: Conceptos clave
  terms:
    - t: Autoconcepto
      d: Imagen que cada persona tiene de sí misma.
    - t: Autoestima
      d: Valoración emocional de ese autoconcepto.
- tipo: table
  title: Comparativa
  head: ["", "Opción A", "Opción B"]
  rows:
    - ["Coste", "Bajo", "Alto"]
    - ["Riesgo", "Alto", "Bajo"]
- tipo: split
  title: Dos caras
  left:
    h: Ventajas
    items: ["Una", "Dos"]
  right:
    h: Inconvenientes
    items: ["Tres", "Cuatro"]
- tipo: list
  title: Proceso
  ordered: true
  items: ["Paso uno", "Paso dos", "Paso tres"]
- tipo: figure
  src: fopp-4eso/05/fp-taller-metal.jpg
  alt: Taller de FP de metal
  caption: La FP también es esto.
- tipo: quiz
  pregunta: ¿Qué es el autoconcepto?
  opciones: ["La imagen de uno mismo", "Una emoción", "Un itinerario"]
  correcta: 0
  explicacion: Es la dimensión cognitiva; la autoestima es la valorativa.
- tipo: section
  title: Segunda sección
- tipo: data
  numero: "1.184 €"
  label: SMI mensual
  title: Salario mínimo
${FENCE}
`;

describe('extractAuthoredYaml', () => {
  it('finds the deck block inside a ```deck fence', () => {
    const { ast } = parseMdx(FM + BLOCK);
    expect(extractAuthoredYaml(ast)).toContain('tipo: section');
  });
  it('returns null when no block exists', () => {
    const { ast } = parseMdx(FM + '\n## Sección\n\nProsa.\n');
    expect(extractAuthoredYaml(ast)).toBeNull();
  });
  it('ignores ordinary fenced code blocks', () => {
    const { ast } = parseMdx(FM + `\n${FENCE}js\nconst x = 1;\n${FENCE}\n`);
    expect(extractAuthoredYaml(ast)).toBeNull();
  });
});

describe('parseAuthoredSlides — validation', () => {
  const one = (y: string) => () => parseAuthoredSlides(y);

  it('numbers section slides automatically', () => {
    const s = parseAuthoredSlides('- tipo: section\n  title: A\n- tipo: section\n  title: B\n');
    expect(s.map((x: any) => x.eyebrow)).toEqual(['§1', '§2']);
    expect(s.every((x) => x.tipo === 'cover')).toBe(true);
  });
  it('rejects an unknown tipo with a helpful message', () => {
    expect(one('- tipo: banana\n  title: X\n')).toThrow(/tipo desconocido/);
  });
  it('rejects an over-long body with the slide index', () => {
    expect(one(`- tipo: concept\n  title: X\n  body: "${'a'.repeat(500)}"\n`)).toThrow(/slide 1 .*supera 420/);
  });
  it('rejects a quiz whose correcta is out of range', () => {
    expect(one('- tipo: quiz\n  pregunta: ¿X?\n  opciones: ["a", "b"]\n  correcta: 5\n')).toThrow(/índice válido/);
  });
  it('rejects a ragged table row', () => {
    expect(one('- tipo: table\n  head: ["A", "B"]\n  rows:\n    - ["solo-una"]\n    - ["x", "y"]\n')).toThrow(/rows\[0\]/);
  });
  it('rejects a figure src outside the asset convention', () => {
    expect(one('- tipo: figure\n  src: ../../etc/passwd\n  alt: X\n')).toThrow(/src\/assets\/libro/);
  });
  it('rejects invalid YAML loudly', () => {
    expect(one('- tipo: concept\n  title: "unclosed\n')).toThrow(/YAML inválido/);
  });
  it('caps the deck at 30 authored slides', () => {
    const y = Array.from({ length: 31 }, (_, i) => `- tipo: concept\n  title: S${i}\n`).join('');
    expect(one(y)).toThrow(/máximo autorado es 30/);
  });
});

describe('buildDeck — authored mode', () => {
  const deck = buildDeck(FM + BLOCK, 'es');

  it('uses the authored slides instead of the auto skeleton', () => {
    // auto cover + 10 authored + auto close
    expect(deck.slides).toHaveLength(12);
    expect(deck.slides[0].tipo).toBe('cover');
    expect(deck.slides.at(-1)!.tipo).toBe('close');
    // the book prose section never becomes a slide in authored mode
    const texts = JSON.stringify(deck.slides);
    expect(texts).not.toContain('modo autorado debe ignorar');
  });
  it('carries every authored archetype through', () => {
    const tipos = deck.slides.map((s) => s.tipo);
    for (const t of ['terms', 'table', 'split', 'list', 'figure', 'quiz', 'data']) {
      expect(tipos).toContain(t);
    }
  });
  it('localizes the close chrome under ca', () => {
    const ca = buildDeck(FM + BLOCK, 'ca');
    expect((ca.slides.at(-1) as any).title).toBe('Fins ací la teoria');
  });
});

describe('buildDeck — auto mode keeps Figures now', () => {
  it('maps a book <Figure> to a figure slide instead of dropping it', () => {
    const mdx = `${FM}

## Sección

Prosa suficiente para un concepto con algo de cuerpo que contar aquí.

<Figure
  src={import('@assets/libro/fopp-4eso/05/fp-taller-metal.jpg')}
  alt="Taller de FP"
  caption="Un taller real de FP de fabricación."
/>
`;
    const deck = buildDeck(mdx, 'es');
    const fig = deck.slides.find((s) => s.tipo === 'figure') as any;
    expect(fig).toBeDefined();
    expect(fig.src).toBe('fopp-4eso/05/fp-taller-metal.jpg');
    expect(fig.alt).toBe('Taller de FP');
  });
});
