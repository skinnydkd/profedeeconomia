/**
 * Shuffle utilities for RetoPlayer and QuizPlayer.
 * Extracted as a pure module so the helpers are unit-testable without importing
 * JSX / Preact in the test environment.
 */

/**
 * Fisher-Yates shuffle — returns a new array. `rng` defaults to Math.random;
 * pass a seeded generator when the server render and the hydrated island must
 * agree on the order.
 */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Like `shuffle`, but guarantees the result is NOT identical to the original
 * order when there are ≥2 elements.
 *
 * Retries up to 20 times; bails after that (handles degenerate cases where all
 * elements have the same value and every permutation is "identical").
 */
export function shuffleNoIdentidad<T>(arr: T[], rng: () => number = Math.random): T[] {
  if (arr.length < 2) return [...arr];
  let s = shuffle(arr, rng);
  let intentos = 0;
  while (intentos < 20 && s.every((v, i) => v === arr[i])) {
    s = shuffle(arr, rng);
    intentos++;
  }
  return s;
}
