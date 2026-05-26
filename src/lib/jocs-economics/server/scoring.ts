// src/lib/jocs-economics/server/scoring.ts
// Score = dificultat x 100, arrodonit (spec §5.3).
// Sense speed bonus (decisio §4 spec).

export function scoreFor(currentDifficulty: number): number {
  return Math.round(currentDifficulty * 100);
}
