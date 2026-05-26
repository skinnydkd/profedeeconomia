// party/cajut/scoring.ts
// Speed-bonus Kahoot-style: 1000 → 500 → 0 (spec §7).

import { SCORE_MAX, SCORE_MIN_ON_CORRECT } from './constants';

/**
 * Calcula la puntuació per a una resposta donada.
 * - Incorrecta o sense resposta: 0 punts.
 * - Correcta: decay lineal de SCORE_MAX (t=0) a SCORE_MIN_ON_CORRECT (t=timerS).
 *   Si elapsedMs > timerS*1000, clampeja al límit (correcta tardia val SCORE_MIN_ON_CORRECT).
 *
 * @param isCorrect  true si l'alumne ha encertat
 * @param elapsedMs  ms transcorreguts des de l'inici de la pregunta fins a la resposta
 * @param timerS     timer total de la pregunta en segons (típicament TIMER_QUESTION_S)
 * @returns          punts enters (0 .. SCORE_MAX)
 */
export function scoreFor(isCorrect: boolean, elapsedMs: number, timerS: number): number {
  if (!isCorrect) return 0;
  const elapsedRatio = Math.min(1, Math.max(0, elapsedMs / (timerS * 1000)));
  return Math.round(SCORE_MAX - (SCORE_MAX - SCORE_MIN_ON_CORRECT) * elapsedRatio);
}
