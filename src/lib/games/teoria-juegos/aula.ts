// src/lib/games/teoria-juegos/aula.ts
/**
 * Helpers for `aula` mode: the teacher projects the screen, the class votes by
 * hand and the teacher types the raw numbers in. These turn that list into the
 * analysis the paper dinámica asks them to do on the whiteboard.
 */

/**
 * Read a list of numbers typed by a teacher in a hurry: commas, spaces, line
 * breaks and semicolons all separate; a comma used as a decimal point is only
 * read as such when it sits between digits and no other separator is in play.
 */
export function leerNumeros(raw: string): number[] {
  const usaComaDecimal = /\d,\d/.test(raw) && !/\d\s*,\s*\d+\s*,/.test(raw);
  const limpio = usaComaDecimal ? raw.replace(/(\d),(\d)/g, '$1.$2') : raw.replace(/,/g, ' ');
  return limpio
    .split(/[\s;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n));
}

export function media(xs: number[]): number {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
}

export function mediana(xs: number[]): number {
  if (xs.length === 0) return 0;
  const o = [...xs].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}

export interface Tramo {
  desde: number;
  hasta: number;
  etiqueta: string;
  cuenta: number;
}

/**
 * Bucket values into equal-width bins over [0, max]. The last bin is closed on
 * the right so the top value is never dropped.
 */
export function tramos(xs: number[], max: number, ancho: number): Tramo[] {
  const n = Math.max(1, Math.ceil(max / ancho));
  const salida: Tramo[] = Array.from({ length: n }, (_, i) => ({
    desde: i * ancho,
    hasta: Math.min(max, (i + 1) * ancho),
    etiqueta: `${i * ancho}–${Math.min(max, (i + 1) * ancho)}`,
    cuenta: 0,
  }));
  for (const x of xs) {
    if (!Number.isFinite(x)) continue;
    const v = Math.max(0, Math.min(max, x));
    const i = Math.min(n - 1, Math.floor(v / ancho));
    salida[i].cuenta += 1;
  }
  return salida;
}
