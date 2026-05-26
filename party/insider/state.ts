// Pure state machine for Insider game — all functions are pure (no side effects)
// Tie-break rule for tallyAndEliminate: when multiple players have the same max votes,
// the player with the LOWEST id alphabetically (localeCompare) is eliminated.
// This rule is deterministic and tested.

import { assignRoles } from './roles';
import { applyRoundScores } from './scoring';
import type { Phase } from '../../src/lib/games-multi/insider/types';

export interface PlayerState {
  id: string;
  name: string;
  alive: boolean;
  hasVoted: boolean;
  turnDone: boolean;
  score: number;
}

export interface GameState {
  phase: Phase;
  round: number;
  totalRounds: number;
  impostorCount: number;
  players: Record<string, PlayerState>;
  impostors: Set<string>;
  word: string | null;
  votes: Record<string, string>;     // voterId → targetId
  speakerOrder: string[];            // alive player ids for current round, in order
  currentSpeakerIndex: number;
}

export interface TallyResult {
  state: GameState;
  eliminatedId: string | null;
  wasImpostor: boolean;
}

export interface GuessResult {
  state: GameState;
  guessCorrect: boolean;
}

/** Creates an empty lobby state. */
export function createLobby(): GameState {
  return {
    phase: 'lobby',
    round: 0,
    totalRounds: 5,
    impostorCount: 1,
    players: {},
    impostors: new Set(),
    word: null,
    votes: {},
    speakerOrder: [],
    currentSpeakerIndex: 0,
  };
}

/**
 * Begins a new round from the current state.
 * Assigns roles and word, shuffles speaker order, advances round counter.
 */
export function startRound(state: GameState, rng: () => number): GameState {
  const alivePlayers = Object.values(state.players).filter((p) => p.alive);
  const aliveIds = alivePlayers.map((p) => p.id);

  const { impostors, word } = assignRoles(aliveIds, state.impostorCount, rng);

  // Shuffle speaker order using Fisher-Yates via rng
  const shuffledOrder = [...aliveIds];
  for (let i = shuffledOrder.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffledOrder[i]!;
    shuffledOrder[i] = shuffledOrder[j]!;
    shuffledOrder[j] = tmp;
  }

  return {
    ...state,
    phase: 'show_word',
    round: state.round + 1,
    impostors,
    word,
    votes: {},
    speakerOrder: shuffledOrder,
    currentSpeakerIndex: 0,
    players: Object.fromEntries(
      Object.values(state.players).map((p) => [
        p.id,
        { ...p, hasVoted: false, turnDone: false },
      ]),
    ),
  };
}

/** Records a vote by a voter for a target. Returns a new state (immutable). */
export function applyVote(state: GameState, voterId: string, targetId: string): GameState {
  return {
    ...state,
    votes: { ...state.votes, [voterId]: targetId },
  };
}

/**
 * Counts votes among alive players and eliminates the most-voted one.
 * Tie-break rule: lowest id alphabetically (using localeCompare) is eliminated.
 * This is deterministic and must be tested.
 */
export function tallyAndEliminate(state: GameState): TallyResult {
  // Guard: no votes cast — return without elimination
  const voteEntries = Object.entries(state.votes);
  if (voteEntries.length === 0) {
    return { state, eliminatedId: null, wasImpostor: false };
  }

  // Count votes (only votes targeting alive players count)
  const alivePlayers = Object.values(state.players).filter((p) => p.alive);
  const aliveSet = new Set(alivePlayers.map((p) => p.id));

  const tally: Record<string, number> = {};
  for (const targetId of Object.values(state.votes)) {
    if (aliveSet.has(targetId)) {
      tally[targetId] = (tally[targetId] ?? 0) + 1;
    }
  }

  // Guard: all votes targeted dead players — no valid elimination
  if (Object.keys(tally).length === 0) {
    return { state, eliminatedId: null, wasImpostor: false };
  }

  // Find maximum vote count
  const maxVotes = Math.max(0, ...Object.values(tally));

  // Collect all candidates with max votes
  const candidates = Object.keys(tally).filter((id) => tally[id] === maxVotes);

  // Tie-break: lowest id alphabetically
  candidates.sort((a, b) => a.localeCompare(b));
  const eliminatedId = candidates[0]!;

  const wasImpostor = state.impostors.has(eliminatedId);

  // Apply score deltas
  const aliveIds = alivePlayers.map((p) => p.id);
  const scoring = applyRoundScores(
    { votes: state.votes, impostors: state.impostors, alive: aliveIds },
    eliminatedId,
    wasImpostor,
  );

  // Update player scores and mark eliminated as dead
  const updatedPlayers = Object.fromEntries(
    Object.values(state.players).map((p) => [
      p.id,
      {
        ...p,
        alive: p.id === eliminatedId ? false : p.alive,
        score: p.score + (scoring.deltas[p.id] ?? 0),
      },
    ]),
  );

  // Determine next phase: if impostor caught → guess; else → next round or finished
  const nextPhase: Phase = wasImpostor ? 'guess' : 'reveal';

  return {
    state: {
      ...state,
      phase: nextPhase,
      players: updatedPlayers,
    },
    eliminatedId,
    wasImpostor,
  };
}

/**
 * Applies an impostor's guess attempt. Returns whether it was correct and updates state.
 */
export function applyGuess(state: GameState, guessWord: string): GuessResult {
  const normalize = (s: string) => s.trim().toLowerCase();
  const guessCorrect = normalize(guessWord) === normalize(state.word ?? '');

  return {
    state: {
      ...state,
      phase: 'reveal',
    },
    guessCorrect,
  };
}

/**
 * Advances to the next round, resetting per-round state while preserving scores.
 * Uses rng to assign new roles and shuffle speaker order.
 */
export function advanceToNextRound(state: GameState, rng: () => number): GameState {
  // Reset per-round player state for alive players; keep scores
  const resetPlayers = Object.fromEntries(
    Object.values(state.players).map((p) => [
      p.id,
      { ...p, hasVoted: false, turnDone: false },
    ]),
  );

  const stateForNextRound: GameState = {
    ...state,
    players: resetPlayers,
    votes: {},
    impostors: new Set(),
    word: null,
    speakerOrder: [],
    currentSpeakerIndex: 0,
  };

  return startRound(stateForNextRound, rng);
}

/**
 * Returns true when the game is over (all rounds completed).
 * isFinished is called after tallyAndEliminate/reveal, while round still equals
 * the last completed round. A game configured for N rounds finishes when
 * round >= totalRounds (i.e. the current completed round is the last one).
 */
export function isFinished(state: GameState): boolean {
  return state.round >= state.totalRounds;
}

/**
 * Advances the speaker to the next slot in speakerOrder.
 * Marks the current speaker's turnDone = true and increments currentSpeakerIndex.
 * If already at the last speaker, returns state unchanged (caller handles transition to voting).
 */
export function advanceSpeaker(state: GameState): GameState {
  const { currentSpeakerIndex, speakerOrder } = state;
  if (currentSpeakerIndex >= speakerOrder.length) return state;

  const currentSpeakerId = speakerOrder[currentSpeakerIndex];
  const updatedPlayers = currentSpeakerId && state.players[currentSpeakerId]
    ? {
        ...state.players,
        [currentSpeakerId]: { ...state.players[currentSpeakerId]!, turnDone: true },
      }
    : state.players;

  return {
    ...state,
    players: updatedPlayers,
    currentSpeakerIndex: currentSpeakerIndex + 1,
  };
}
