import { describe, it, expect } from 'vitest';
import { parseMdx } from './ast';
import { extractAuthoredYaml, MAX_AUTHORED_SLIDES, parseAuthoredSlides } from './authored';
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
  it('caps the deck at MAX_AUTHORED_SLIDES', () => {
    const over = MAX_AUTHORED_SLIDES + 1;
    const y = Array.from({ length: over }, (_, i) => `- tipo: concept\n  title: S${i}\n`).join('');
    expect(one(y)).toThrow(new RegExp(`máximo autorado es ${MAX_AUTHORED_SLIDES}`));
  });
  it('accepts a deck exactly at the cap', () => {
    const y = Array.from({ length: MAX_AUTHORED_SLIDES }, (_, i) => `- tipo: concept\n  title: S${i}\n`).join('');
    expect(one(y)).not.toThrow();
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

/* ── Second authored wave ─────────────────────────────────────────────────
   Five archetypes added so a slide can be a formula, a chronology, a case,
   a revision checklist or the unit's curricular frame instead of prose. */

const wave2 = (yaml: string) => parseAuthoredSlides(yaml);

describe('formula slides', () => {
  it('keeps the expression, its legend and a worked example', () => {
    const [s] = wave2(`
- tipo: formula
  title: La tasa de paro
  formula: Tasa de paro = (parados / población activa) × 100
  terminos:
    - s: parados
      d: Personas sin empleo que buscan activamente.
    - s: población activa
      d: Ocupados más parados.
  ejemplo: Con 1.400 parados y 11.000 activos, la tasa es del 12,7 %.
`) as any[];
    expect(s.tipo).toBe('formula');
    expect(s.formula).toContain('población activa');
    expect(s.terminos).toHaveLength(2);
    expect(s.ejemplo).toContain('12,7');
  });

  it('allows a bare formula with no legend', () => {
    const [s] = wave2('- tipo: formula\n  formula: Q* = CF / (P − CVu)\n') as any[];
    expect(s.terminos).toBeUndefined();
  });

  it('rejects a legend with a single symbol', () => {
    expect(() => wave2('- tipo: formula\n  formula: a = b\n  terminos:\n    - s: a\n      d: Sola.\n'))
      .toThrow(/entre 2 y 5 símbolos/);
  });

  it('rejects a missing formula', () => {
    expect(() => wave2('- tipo: formula\n  title: Sin nada\n')).toThrow(/falta "formula"/);
  });
});

describe('timeline slides', () => {
  it('keeps milestones in the authored order', () => {
    const [s] = wave2(`
- tipo: timeline
  title: Del patrón oro al euro
  hitos:
    - fecha: "1944"
      hito: Bretton Woods
      detalle: El dólar queda ligado al oro.
    - fecha: "1971"
      hito: Nixon cierra la ventanilla del oro
    - fecha: "1999"
      hito: Nace el euro
`) as any[];
    expect(s.hitos.map((h: any) => h.fecha)).toEqual(['1944', '1971', '1999']);
    expect(s.hitos[1].detalle).toBeUndefined();
  });

  it('rejects fewer than three milestones', () => {
    expect(() => wave2('- tipo: timeline\n  hitos:\n    - fecha: "1"\n      hito: Uno\n    - fecha: "2"\n      hito: Dos\n'))
      .toThrow(/entre 3 y 6 entradas/);
  });
});

describe('caso slides', () => {
  it('carries context, figures and the question', () => {
    const [s] = wave2(`
- tipo: caso
  title: Paro juvenil y vacantes sin cubrir
  contexto: España tenía un paro juvenil del 26 % con 150.000 vacantes sin cubrir.
  datos:
    - Paro juvenil 26 %
    - 150.000 vacantes
  pregunta: ¿Por qué no se encuentran unos con otros?
`) as any[];
    expect(s.eyebrow).toBeUndefined(); // the renderer falls back to "El caso"
    expect(s.datos).toHaveLength(2);
    expect(s.pregunta).toMatch(/^¿/);
  });

  it('requires the question', () => {
    expect(() => wave2('- tipo: caso\n  title: T\n  contexto: C\n')).toThrow(/falta "pregunta"/);
  });
});

describe('recap slides', () => {
  it('takes three to six retrieval prompts', () => {
    const [s] = wave2('- tipo: recap\n  items:\n    - Uno\n    - Dos\n    - Tres\n') as any[];
    expect(s.items).toHaveLength(3);
  });

  it('rejects two prompts', () => {
    expect(() => wave2('- tipo: recap\n  items:\n    - Uno\n    - Dos\n')).toThrow(/entre 3 y 6/);
  });
});

describe('curriculum slides', () => {
  it('keeps saberes and competencias, with optional criterios', () => {
    const [s] = wave2(`
- tipo: curriculum
  saberes:
    - El mercado de trabajo y sus tasas
  competencias:
    - CE3 · Analizar datos económicos reales
  criterios:
    - 3.1 Interpreta las tasas de la EPA
`) as any[];
    expect(s.saberes).toHaveLength(1);
    expect(s.competencias).toHaveLength(1);
    expect(s.criterios).toHaveLength(1);
  });

  it('works without criterios', () => {
    const [s] = wave2('- tipo: curriculum\n  saberes:\n    - A\n  competencias:\n    - B\n') as any[];
    expect(s.criterios).toBeUndefined();
  });

  it('requires at least one competencia', () => {
    expect(() => wave2('- tipo: curriculum\n  saberes:\n    - A\n  competencias: []\n'))
      .toThrow(/"competencias" debe tener entre 1 y 4/);
  });
});
