// Tie-breakers triple per al ranking (spec §5.5).
// Ordre: score DESC → questionsAnswered DESC → timeTotalMs ASC.

export interface ScoreEntry {
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
}

/**
 * Comparator JS-style: retorna negatiu si `a` ha d'anar abans que `b`,
 * positiu si `b` ha d'anar abans, 0 si idèntics.
 *
 * Ordre: score desc → questionsAnswered desc → timeTotalMs asc.
 */
export function compareScores(a: ScoreEntry, b: ScoreEntry): number {
  if (a.score !== b.score) return b.score - a.score;
  if (a.questionsAnswered !== b.questionsAnswered) {
    return b.questionsAnswered - a.questionsAnswered;
  }
  return a.timeTotalMs - b.timeTotalMs;
}

/**
 * Retorna la posició 1-indexed d'`entry` dins de `sorted` (que es presuposa
 * ja ordenat per `compareScores`). Retorna null si no es troba exactament.
 */
export function rankOf<T extends ScoreEntry>(sorted: T[], entry: ScoreEntry): number | null {
  const idx = sorted.findIndex(
    (s) =>
      s.score === entry.score &&
      s.questionsAnswered === entry.questionsAnswered &&
      s.timeTotalMs === entry.timeTotalMs,
  );
  return idx >= 0 ? idx + 1 : null;
}
