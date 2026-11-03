// src/lib/jocs-economics/server/shuffle.ts
// Order of a question's options within one game. Derived from the game and
// question ids, so the server needs no extra column to grade the answer: the
// same pair always gives the same order. The bank keeps `correcta` in file
// order; 43 % of it is the first option, so unshuffled a player who never
// answers (or always taps A) scored far above chance.

/** Mulberry32 seeded with an FNV-1a hash of the text. */
function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** `orden[k]` is the bank index of the option shown in position k. */
export function ordenOpciones(gameId: string, questionId: string, n: number): number[] {
  const next = rng(`opciones:${gameId}:${questionId}`);
  const orden = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  return orden;
}

/** What the player sees: never `correcta` nor `explicacion`, options in game order. */
export function publicQuestion(
  q: { id: string; opciones: string[]; enunciado?: string },
  gameId: string,
): { id: string; enunciado?: string; opciones: string[] } {
  const orden = ordenOpciones(gameId, q.id, q.opciones.length);
  return {
    id: q.id,
    ...(q.enunciado ? { enunciado: q.enunciado } : {}),
    opciones: orden.map((i) => q.opciones[i]),
  };
}

/** Bank index of the option the player tapped. */
export function indiceBanco(gameId: string, questionId: string, n: number, mostrado: number): number {
  return ordenOpciones(gameId, questionId, n)[mostrado];
}

/** Position on screen of a bank option (to point at the right answer). */
export function indiceMostrado(gameId: string, questionId: string, n: number, banco: number): number {
  return ordenOpciones(gameId, questionId, n).indexOf(banco);
}
