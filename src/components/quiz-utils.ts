/**
 * Pure helpers shared by QuizPlayer and RetoPlayer: reading numbers typed by
 * hand, shuffling the options and the inline emphasis that authors write in
 * Markdown. Kept free of JSX so vitest covers them in the node environment.
 */
import { shuffle } from './retos/shuffle-utils';

// ─── Numeric answers ─────────────────────────────────────────

/**
 * Every number a typed answer can reasonably stand for. Empty while it is not
 * a number yet ("", "-", "12,"), so the quiz does not let it be confirmed.
 *
 * Students in Spain write "12,5" and "1.500"; others write "12.5". Both marks
 * work as decimal separator and as thousands separator. A lone separator
 * followed by exactly three digits ("1.500", "2,250") is ambiguous, so both
 * readings are returned and the grader accepts either of them.
 */
export function lecturasNumero(raw: string): number[] {
  let s = raw
    .trim()
    .replace(/[\s  ]/g, '') // spaces, including non-breaking and thin ones
    .replace(/[−‒–]/g, '-') // typographic minus and dashes
    .replace(/[%€$]+$/u, ''); // a unit sign typed out of habit
  let signo = 1;
  if (s.startsWith('-')) {
    signo = -1;
    s = s.slice(1);
  } else if (s.startsWith('+')) {
    s = s.slice(1);
  }
  if (!/^[\d.,]+$/.test(s) || !/\d/.test(s)) return [];

  const lecturas: string[] = [];
  const hayPunto = s.includes('.');
  const hayComa = s.includes(',');
  if (hayPunto && hayComa) {
    // Both marks: the last one is the decimal separator ("1.234,5", "1,234.5").
    const pos = Math.max(s.lastIndexOf('.'), s.lastIndexOf(','));
    const miles = s[pos] === '.' ? ',' : '.';
    const entera = s.slice(0, pos);
    const decimales = s.slice(pos + 1);
    if (!new RegExp(`^\\d{1,3}(?:\\${miles}\\d{3})*$`).test(entera) || !/^\d+$/.test(decimales)) return [];
    lecturas.push(`${entera.split(miles).join('')}.${decimales}`);
  } else if (hayPunto || hayComa) {
    const sep = hayPunto ? '.' : ',';
    const partes = s.split(sep);
    if (partes.length > 2) {
      // Several separators can only be thousands groups ("1.500.000").
      if (!new RegExp(`^\\d{1,3}(?:\\${sep}\\d{3})+$`).test(s)) return [];
      lecturas.push(partes.join(''));
    } else {
      const [entera, decimales] = partes;
      if (decimales === '') return []; // still typing: "12,"
      lecturas.push(`${entera || '0'}.${decimales}`);
      if (/^[1-9]\d{0,2}$/.test(entera) && /^\d{3}$/.test(decimales)) lecturas.push(entera + decimales);
    }
  } else {
    lecturas.push(s);
  }
  return lecturas.map((l) => signo * Number(l)).filter((n) => Number.isFinite(n));
}

/**
 * Whether a typed answer matches the expected number within the tolerance.
 * The small epsilon absorbs binary rounding (1,26 − 1,25 is 0.010000000000000009).
 */
export function numeroCorrecto(raw: string, respuesta: number, tolerancia = 0): boolean {
  const margen = tolerancia + 1e-9 * Math.max(1, Math.abs(respuesta));
  return lecturasNumero(raw).some((n) => Math.abs(n - respuesta) <= margen);
}

// ─── Option order ────────────────────────────────────────────

/** FNV-1a: a 32-bit seed from a string. */
function semilla(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministic generator (mulberry32). The same text gives the same sequence
 * on the server and in the browser, so the first order survives hydration.
 */
export function rngDesde(texto: string): () => number {
  let a = semilla(texto);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Display order for `n` options: `orden[k]` is the original index shown in position k. */
export function permutacion(n: number, rng: () => number = Math.random): number[] {
  return shuffle(
    Array.from({ length: n }, (_, i) => i),
    rng,
  );
}

/**
 * One display order per question: a permutation for multiple choice, an empty
 * array for the other types. Answers keep the original indices, so grading
 * against `correcta` does not change.
 */
export function ordenesOpciones(
  preguntas: ReadonlyArray<{ tipo: string; opciones?: string[] }>,
  rng: () => number,
): number[][] {
  return preguntas.map((p) => (p.tipo === 'opcion-multiple' && p.opciones ? permutacion(p.opciones.length, rng) : []));
}

/** The order to paint: the stored permutation, or the file order if it does not fit. */
export function ordenValido(orden: number[] | undefined, n: number): number[] {
  if (orden && orden.length === n && orden.every((i) => i >= 0 && i < n)) return orden;
  return Array.from({ length: n }, (_, i) => i);
}

// ─── Inline emphasis ─────────────────────────────────────────

export type TrozoInline = { tipo: 'texto' | 'em' | 'strong'; texto: string };

/*
 * **strong**, *em* and _em_. As in CommonMark, emphasis only opens after a
 * non-word character and closes before one, so "P*", "P* · Q*", "Q_d" and
 * "2 * 3" stay literal.
 */
const ENFASIS =
  /(?<![\p{L}\p{N}*])\*\*(?=\S)(.+?)(?<=\S)\*\*(?![\p{L}\p{N}*])|(?<![\p{L}\p{N}*])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![\p{L}\p{N}*])|(?<![\p{L}\p{N}_])_(?=[^\s_])(.+?)(?<=[^\s_])_(?![\p{L}\p{N}_])/gu;

/** Splits a question text into plain, em and strong runs. */
export function trozosInline(texto: string): TrozoInline[] {
  const trozos: TrozoInline[] = [];
  let desde = 0;
  for (const m of texto.matchAll(ENFASIS)) {
    const inicio = m.index ?? 0;
    if (inicio > desde) trozos.push({ tipo: 'texto', texto: texto.slice(desde, inicio) });
    if (m[1] !== undefined) trozos.push({ tipo: 'strong', texto: m[1] });
    else trozos.push({ tipo: 'em', texto: m[2] ?? m[3] ?? '' });
    desde = inicio + m[0].length;
  }
  if (desde < texto.length) trozos.push({ tipo: 'texto', texto: texto.slice(desde) });
  return trozos;
}

/** The same text without the emphasis marks, for <option> and aria-label. */
export function textoPlano(texto: string): string {
  return trozosInline(texto)
    .map((t) => t.texto)
    .join('');
}
