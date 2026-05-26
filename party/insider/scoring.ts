// Pure scoring functions for Insider
import {
  SCORE_VOTE_CORRECT,
  SCORE_IMPOSTOR_SURVIVES,
  SCORE_IMPOSTOR_GUESS_CORRECT,
  SCORE_CITIZEN_CATCH,
} from './constants';

export interface ScoringInput {
  votes: Record<string, string>;    // voterId → targetId
  impostors: Set<string>;
  alive: string[];                  // all alive players at time of voting
}

export interface ScoringResult {
  deltas: Record<string, number>;   // playerId → score delta (only non-zero entries)
}

/**
 * Computes score deltas after a round's reveal.
 *
 * Scoring rules:
 * - wasImpostor === true (impostor caught):
 *   - Each alive citizen gets SCORE_CITIZEN_CATCH (+50)
 *   - Each voter who voted for the eliminated impostor gets SCORE_VOTE_CORRECT (+100) additionally
 *   - If guess is provided and correct: eliminated impostor gets SCORE_IMPOSTOR_GUESS_CORRECT (+150)
 * - wasImpostor === false (citizen voted out / impostor survived):
 *   - Each remaining impostor gets SCORE_IMPOSTOR_SURVIVES (+200)
 */
export function applyRoundScores(
  input: ScoringInput,
  eliminatedId: string,
  wasImpostor: boolean,
  guess?: { word: string; correct: boolean },
): ScoringResult {
  const deltas: Record<string, number> = {};

  const add = (id: string, amount: number) => {
    deltas[id] = (deltas[id] ?? 0) + amount;
  };

  if (wasImpostor) {
    // All alive citizens (excluding the eliminated impostor) get the catch bonus
    for (const playerId of input.alive) {
      if (playerId !== eliminatedId && !input.impostors.has(playerId)) {
        add(playerId, SCORE_CITIZEN_CATCH);
      }
    }

    // Voters who correctly identified the impostor get the vote bonus additionally
    for (const [voterId, targetId] of Object.entries(input.votes)) {
      if (targetId === eliminatedId) {
        add(voterId, SCORE_VOTE_CORRECT);
      }
    }

    // Impostor's guess bonus
    if (guess?.correct) {
      add(eliminatedId, SCORE_IMPOSTOR_GUESS_CORRECT);
    }
  } else {
    // Citizen was eliminated — impostors survived
    for (const impostorId of input.impostors) {
      if (input.alive.includes(impostorId)) {
        add(impostorId, SCORE_IMPOSTOR_SURVIVES);
      }
    }
  }

  // Remove zero deltas for cleanliness
  for (const key of Object.keys(deltas)) {
    if (deltas[key] === 0) delete deltas[key];
  }

  return { deltas };
}
