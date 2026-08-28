/**
 * Authored deck blocks — the per-unit slide convention CLAUDE.md promised.
 *
 * Each book unit MAY end with one fenced code block carrying a YAML list of
 * slides (a fence keeps YAML indentation intact, which MDX comment expressions
 * do not):
 *
 *   ```deck
 *   - tipo: concept
 *     title: …
 *     body: …
 *   ```
 *
 * The remark plugin in src/lib/remark/strip-deck-blocks.mjs removes the block
 * from the rendered book page and book PDF, so the single-source-of-truth rule
 * holds: one MDX file per unit still generates the web page, the book PDF and
 * the deck. When the block is present, buildDeck uses these slides (plus the
 * auto cover/close); when absent, it falls back to the auto-generated skeleton.
 *
 * Validation is strict and loud: every limit here exists to keep a slide
 * inside its 16:9 box — scripts/build-deck-pdf.mjs asserts no overflow as the
 * final net, but a build-time error with the slide index beats a visual QA
 * round-trip.
 */
import { parse as parseYaml } from 'yaml';
import type { MdxNode } from './ast.ts';
import type { Slide } from './types.ts';

/** Find the authored deck block's YAML source in a parsed MDX AST, if any. */
export function extractAuthoredYaml(ast: MdxNode): string | null {
  for (const node of ast.children || []) {
    if (node.type === 'code' && (node as any).lang === 'deck' && typeof node.value === 'string') {
      return node.value;
    }
  }
  return null;
}

class SlideError extends Error {
  constructor(index: number, tipo: string, msg: string) {
    super(`deck slide ${index + 1} (${tipo || 'sin tipo'}): ${msg}`);
  }
}

const req = (i: number, tipo: string, v: unknown, field: string, max: number): string => {
  if (typeof v !== 'string' || !v.trim()) throw new SlideError(i, tipo, `falta "${field}"`);
  const t = v.replace(/\s+/g, ' ').trim();
  if (t.length > max) throw new SlideError(i, tipo, `"${field}" supera ${max} caracteres (${t.length})`);
  return t;
};
const opt = (i: number, tipo: string, v: unknown, field: string, max: number): string | undefined =>
  v == null ? undefined : req(i, tipo, v, field, max);
const strList = (i: number, tipo: string, v: unknown, field: string, min: number, max: number, itemMax: number): string[] => {
  if (!Array.isArray(v) || v.length < min || v.length > max) {
    throw new SlideError(i, tipo, `"${field}" debe tener entre ${min} y ${max} elementos`);
  }
  return v.map((x, j) => req(i, tipo, x, `${field}[${j}]`, itemMax));
};

/**
 * Parse + validate the YAML slide list. `sectionStart` seeds the §-numbering
 * for `tipo: section` sugar (a section cover with automatic §n eyebrow).
 */
export function parseAuthoredSlides(yamlSrc: string): Slide[] {
  let raw: unknown;
  try {
    raw = parseYaml(yamlSrc);
  } catch (e) {
    throw new Error(`deck block: YAML inválido — ${(e as Error).message}`);
  }
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('deck block: se esperaba una lista YAML de diapositivas');
  }
  if (raw.length > 30) {
    throw new Error(`deck block: ${raw.length} diapositivas — el máximo autorado es 30`);
  }

  let sectionN = 0;
  return raw.map((s: any, i: number): Slide => {
    const tipo = typeof s?.tipo === 'string' ? s.tipo : '';
    switch (tipo) {
      case 'section': {
        sectionN += 1;
        return { tipo: 'cover', eyebrow: `§${sectionN}`, title: req(i, tipo, s.title, 'title', 80), subtitle: opt(i, tipo, s.subtitle, 'subtitle', 140) };
      }
      case 'concept':
        if (!s.title && !s.body) throw new SlideError(i, tipo, 'necesita title o body');
        return {
          tipo, eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40),
          title: opt(i, tipo, s.title, 'title', 90),
          body: opt(i, tipo, s.body, 'body', 420),
          pull: opt(i, tipo, s.pull, 'pull', 180),
        };
      case 'terms': {
        if (!Array.isArray(s.terms) || s.terms.length < 2 || s.terms.length > 4) {
          throw new SlideError(i, tipo, '"terms" debe tener entre 2 y 4 definiciones');
        }
        return {
          tipo, title: opt(i, tipo, s.title, 'title', 80), eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40),
          terms: s.terms.map((t: any, j: number) => ({
            t: req(i, tipo, t?.t, `terms[${j}].t`, 48),
            d: req(i, tipo, t?.d, `terms[${j}].d`, 175),
          })),
        };
      }
      case 'table': {
        if (!Array.isArray(s.head) || s.head.length < 2 || s.head.length > 4) {
          throw new SlideError(i, tipo, '"head" debe tener entre 2 y 4 columnas');
        }
        // head[0] may be empty — the classic blank corner of a comparison table.
        const head = s.head.map((h: unknown, j: number) =>
          j === 0 && (h == null || h === '') ? '' : req(i, tipo, h, `head[${j}]`, 42),
        );
        if (!Array.isArray(s.rows) || s.rows.length < 2 || s.rows.length > 5) {
          throw new SlideError(i, tipo, '"rows" debe tener entre 2 y 5 filas');
        }
        const rows = s.rows.map((r: any, j: number) => {
          const row = strList(i, tipo, r, `rows[${j}]`, head.length, head.length, 64);
          return row;
        });
        return { tipo, title: opt(i, tipo, s.title, 'title', 90), eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40), head, rows, caption: opt(i, tipo, s.caption, 'caption', 130) };
      }
      case 'split': {
        const col = (c: any, name: string) => {
          if (!c || typeof c !== 'object') throw new SlideError(i, tipo, `falta "${name}"`);
          return { h: opt(i, tipo, c.h, `${name}.h`, 44), items: strList(i, tipo, c.items, `${name}.items`, 2, 5, 115) };
        };
        return { tipo, title: opt(i, tipo, s.title, 'title', 90), eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40), left: col(s.left, 'left'), right: col(s.right, 'right') };
      }
      case 'list':
        return {
          tipo, title: opt(i, tipo, s.title, 'title', 90), eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40),
          items: strList(i, tipo, s.items, 'items', 3, 6, 135), ordered: s.ordered === true,
        };
      case 'figure': {
        const src = req(i, tipo, s.src, 'src', 160);
        if (!/^[a-z0-9-]+\/[^\s]+\.(jpg|jpeg|png|webp)$/i.test(src)) {
          throw new SlideError(i, tipo, `"src" debe ser una ruta bajo src/assets/libro/ (asignatura/unidad/archivo.ext): ${src}`);
        }
        return { tipo, src, alt: req(i, tipo, s.alt, 'alt', 160), title: opt(i, tipo, s.title, 'title', 90), caption: opt(i, tipo, s.caption, 'caption', 150), credit: opt(i, tipo, s.credit, 'credit', 110) };
      }
      case 'quiz': {
        const opciones = strList(i, tipo, s.opciones, 'opciones', 2, 4, 95);
        const correcta = Number(s.correcta);
        if (!Number.isInteger(correcta) || correcta < 0 || correcta >= opciones.length) {
          throw new SlideError(i, tipo, `"correcta" debe ser un índice válido de opciones (0-${opciones.length - 1})`);
        }
        return { tipo, eyebrow: opt(i, tipo, s.eyebrow, 'eyebrow', 40), pregunta: req(i, tipo, s.pregunta, 'pregunta', 190), opciones, correcta, explicacion: opt(i, tipo, s.explicacion, 'explicacion', 220) };
      }
      case 'data':
        return { tipo, numero: req(i, tipo, s.numero, 'numero', 14), label: opt(i, tipo, s.label, 'label', 44), title: opt(i, tipo, s.title, 'title', 84), detalle: opt(i, tipo, s.detalle, 'detalle', 230) };
      case 'quote':
        return { tipo, texto: req(i, tipo, s.texto, 'texto', 210), fuente: opt(i, tipo, s.fuente, 'fuente', 64) };
      case 'exercise':
        return {
          tipo, title: req(i, tipo, s.title, 'title', 90), enunciado: req(i, tipo, s.enunciado, 'enunciado', 330),
          pasos: s.pasos == null ? undefined : strList(i, tipo, s.pasos, 'pasos', 1, 6, 155),
        };
      case 'diagram': {
        const diagrama = req(i, tipo, s.diagrama, 'diagrama', 60);
        if (!/^[A-Z][A-Za-z0-9]+$/.test(diagrama)) {
          throw new SlideError(i, tipo, `"diagrama" debe ser el nombre PascalCase de un componente de src/components/diagrams: ${diagrama}`);
        }
        return { tipo, diagrama, caption: opt(i, tipo, s.caption, 'caption', 130) };
      }
      default:
        throw new SlideError(i, tipo, `tipo desconocido — usa section/concept/terms/table/split/list/figure/quiz/data/quote/exercise/diagram`);
    }
  });
}
