// party/cajut/questions.ts
// Loader del banc privat de preguntes. Importa el JSON generat per
// `scripts/build-cajut-manifest.mjs`; tot el banc queda en memòria del DO.

import data from './questions.generated.json';

export interface Question {
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion?: string;
}

interface QuestionsManifest {
  version: number;
  generatedAt: string;
  preguntas: Record<string, Question[]>;
}

const manifest = data as QuestionsManifest;

/** Concatena preguntes de totes les unitats donades, ignorant les que no existeixen. */
export function getPool(asignaturaSlug: string, unidades: number[]): Question[] {
  return unidades.flatMap((n) => manifest.preguntas[`${asignaturaSlug}/${n}`] ?? []);
}

/**
 * Sample sense reposició de N elements del pool, usant un RNG injectable
 * (Fisher-Yates parcial). Si N >= pool.length, retorna el pool sencer barrejat.
 */
export function samplePool(pool: Question[], n: number, rng: () => number): Question[] {
  const arr = pool.slice();
  const k = Math.min(n, arr.length);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k);
}

/**
 * Barreja les opcions d'una pregunta i actualitza l'index `correcta` perquè
 * segueixi assenyalant la mateixa opció original.
 */
export function shuffleOptions(q: Question, rng: () => number): Question {
  const correctText = q.opciones[q.correcta];
  const shuffled = q.opciones.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    ...q,
    opciones: shuffled,
    correcta: shuffled.indexOf(correctText),
  };
}
