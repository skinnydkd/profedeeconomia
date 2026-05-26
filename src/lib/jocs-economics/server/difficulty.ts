// src/lib/jocs-economics/server/difficulty.ts
// Gradient continu de dificultat (spec §5.2).
// Cada encert puja +0.2; cada error manté el valor (vida −1 ja és penalització).

export const DIFFICULTY_MIN = 1.0;
export const DIFFICULTY_MAX = 10.0;
export const DIFFICULTY_STEP_CORRECT = 0.2;
export const DIFFICULTY_STEP_INCORRECT = 0;

export function nextDifficulty(current: number, isCorrect: boolean): number {
  const delta = isCorrect ? DIFFICULTY_STEP_CORRECT : DIFFICULTY_STEP_INCORRECT;
  const raw = current + delta;
  return Math.min(DIFFICULTY_MAX, Math.max(DIFFICULTY_MIN, raw));
}
