// Pure role assignment — deterministic via injectable rng
import { WORDS } from './words';

export interface RoleAssignment {
  impostors: Set<string>;
  word: string;
}

/**
 * Assigns impostors and selects the secret word for a round.
 * Uses Fisher-Yates shuffle via rng for full determinism in tests.
 *
 * @param playerIds - All player ids in the round
 * @param impostorCount - Number of impostors to assign
 * @param rng - Random number generator (injectable for tests)
 */
export function assignRoles(
  playerIds: string[],
  impostorCount: number,
  rng: () => number,
): RoleAssignment {
  // Select word via rng
  const word = WORDS[Math.floor(rng() * WORDS.length)];

  // Fisher-Yates shuffle for deterministic selection
  const shuffled = [...playerIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = tmp!;
  }

  const impostors = new Set(shuffled.slice(0, impostorCount));
  return { impostors, word };
}
