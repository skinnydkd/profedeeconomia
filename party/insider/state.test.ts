import { describe, it, expect } from 'vitest';
import {
  createLobby,
  startRound,
  applyVote,
  tallyAndEliminate,
  applyGuess,
  advanceToNextRound,
  advanceSpeaker,
  isFinished,
} from './state';
import { WORDS } from './words';

// Deterministic rng: cycles through a fixed sequence
function makeSeqRng(seq: number[]): () => number {
  let i = 0;
  return () => seq[i++ % seq.length]!;
}

describe('createLobby', () => {
  it('returns a lobby-phase state with empty players', () => {
    const s = createLobby();
    expect(s.phase).toBe('lobby');
    expect(s.round).toBe(0);
    expect(s.players).toEqual({});
    expect(s.impostors.size).toBe(0);
  });
});

describe('startRound', () => {
  it('transitions from lobby to show_word', () => {
    let state = createLobby();
    state = {
      ...state,
      players: {
        p1: { id: 'p1', name: 'Alice', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p2: { id: 'p2', name: 'Bob', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p3: { id: 'p3', name: 'Carol', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p4: { id: 'p4', name: 'Dave', alive: true, hasVoted: false, turnDone: false, score: 0 },
      },
      totalRounds: 3,
      impostorCount: 1,
    };
    const next = startRound(state, makeSeqRng([0.0, 0.1, 0.2, 0.3, 0.4, 0.5]));
    expect(next.phase).toBe('show_word');
    expect(next.round).toBe(1);
    expect(next.word).toBeTruthy();
    expect(WORDS).toContain(next.word);
    expect(next.impostors.size).toBe(1);
    expect(next.speakerOrder.length).toBe(4);
  });

  it('assigns correct number of impostors', () => {
    let state = createLobby();
    const playerIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
    const players = Object.fromEntries(
      playerIds.map((id) => [
        id,
        { id, name: id, alive: true, hasVoted: false, turnDone: false, score: 0 },
      ]),
    );
    state = { ...state, players, totalRounds: 5, impostorCount: 2 };
    const next = startRound(state, Math.random);
    expect(next.impostors.size).toBe(2);
  });
});

describe('applyVote', () => {
  it('records the vote for a voter', () => {
    const state = createLobby();
    const next = applyVote(state, 'voter1', 'target2');
    expect(next.votes['voter1']).toBe('target2');
  });

  it('overwrites a previous vote by the same voter', () => {
    let state = createLobby();
    state = applyVote(state, 'voter1', 'target2');
    state = applyVote(state, 'voter1', 'target3');
    expect(state.votes['voter1']).toBe('target3');
  });

  it('does not mutate the original state', () => {
    const state = createLobby();
    const next = applyVote(state, 'v', 't');
    expect(state.votes['v']).toBeUndefined();
    expect(next.votes['v']).toBe('t');
  });
});

describe('tallyAndEliminate — tie-break rule', () => {
  it('eliminates the player with the most votes', () => {
    let state = createLobby();
    state = {
      ...state,
      players: {
        a: { id: 'a', name: 'A', alive: true, hasVoted: true, turnDone: false, score: 0 },
        b: { id: 'b', name: 'B', alive: true, hasVoted: true, turnDone: false, score: 0 },
        c: { id: 'c', name: 'C', alive: true, hasVoted: true, turnDone: false, score: 0 },
      },
      votes: { v1: 'b', v2: 'b', v3: 'a' },
      impostors: new Set(['b']),
    };
    const result = tallyAndEliminate(state);
    expect(result.eliminatedId).toBe('b');
    expect(result.wasImpostor).toBe(true);
  });

  it('tie-break: eliminates the player with lowest id alphabetically', () => {
    // 'alice' and 'charlie' both get 1 vote — 'alice' < 'charlie' alphabetically → alice eliminated
    let state = createLobby();
    state = {
      ...state,
      players: {
        alice: { id: 'alice', name: 'Alice', alive: true, hasVoted: true, turnDone: false, score: 0 },
        bob: { id: 'bob', name: 'Bob', alive: true, hasVoted: true, turnDone: false, score: 0 },
        charlie: { id: 'charlie', name: 'Charlie', alive: true, hasVoted: true, turnDone: false, score: 0 },
      },
      votes: { bob: 'alice', alice: 'charlie' },
      impostors: new Set(['charlie']),
    };
    const result = tallyAndEliminate(state);
    // 'alice' < 'charlie' → alice is eliminated (lowest id alphabetically)
    expect(result.eliminatedId).toBe('alice');
    expect(result.wasImpostor).toBe(false);
  });

  it('tie-break: lowest id alphabetically wins among tied candidates', () => {
    // 'bob' and 'dave' each get 2 votes — 'bob' < 'dave' → bob eliminated
    let state = createLobby();
    state = {
      ...state,
      players: {
        alice: { id: 'alice', name: 'Alice', alive: true, hasVoted: true, turnDone: false, score: 0 },
        bob: { id: 'bob', name: 'Bob', alive: true, hasVoted: true, turnDone: false, score: 0 },
        charlie: { id: 'charlie', name: 'Charlie', alive: true, hasVoted: true, turnDone: false, score: 0 },
        dave: { id: 'dave', name: 'Dave', alive: true, hasVoted: true, turnDone: false, score: 0 },
      },
      votes: { alice: 'bob', charlie: 'bob', bob: 'dave', dave: 'dave' },
      impostors: new Set(['alice']),
    };
    const result = tallyAndEliminate(state);
    expect(result.eliminatedId).toBe('bob');
  });

  it('marks eliminated player alive=false and sets phase to reveal', () => {
    let state = createLobby();
    state = {
      ...state,
      players: {
        p1: { id: 'p1', name: 'P1', alive: true, hasVoted: true, turnDone: false, score: 0 },
        p2: { id: 'p2', name: 'P2', alive: true, hasVoted: true, turnDone: false, score: 0 },
      },
      votes: { p1: 'p2', p2: 'p2' },
      impostors: new Set(['p1']),
    };
    const result = tallyAndEliminate(state);
    expect(result.state.phase).toBe('reveal');
    expect(result.state.players['p2']!.alive).toBe(false);
    expect(result.state.players['p1']!.alive).toBe(true);
  });
});

describe('applyGuess', () => {
  it('returns correct=true when guess matches the word (case-insensitive)', () => {
    let state = createLobby();
    state = { ...state, word: 'Inflación' };
    const result = applyGuess(state, 'inflación');
    expect(result.guessCorrect).toBe(true);
  });

  it('returns correct=false when guess does not match', () => {
    let state = createLobby();
    state = { ...state, word: 'Monopolio' };
    const result = applyGuess(state, 'Deflación');
    expect(result.guessCorrect).toBe(false);
  });
});

describe('advanceToNextRound', () => {
  it('increments round and resets per-round state', () => {
    let state = createLobby();
    state = {
      ...state,
      round: 1,
      totalRounds: 3,
      votes: { p1: 'p2' },
      players: {
        p1: { id: 'p1', name: 'A', alive: true, hasVoted: true, turnDone: true, score: 50 },
        p2: { id: 'p2', name: 'B', alive: false, hasVoted: true, turnDone: true, score: 0 },
        p3: { id: 'p3', name: 'C', alive: true, hasVoted: true, turnDone: true, score: 100 },
      },
    };
    const next = advanceToNextRound(state, Math.random);
    expect(next.round).toBe(2);
    expect(next.votes).toEqual({});
    // hasVoted and turnDone reset for alive players
    const aliveIds = Object.values(next.players)
      .filter((p) => p.alive)
      .map((p) => p.id);
    for (const id of aliveIds) {
      expect(next.players[id]!.hasVoted).toBe(false);
      expect(next.players[id]!.turnDone).toBe(false);
    }
    // scores preserved
    expect(next.players['p1']!.score).toBe(50);
    expect(next.players['p3']!.score).toBe(100);
  });

  it('transitions to show_word phase', () => {
    let state = createLobby();
    state = {
      ...state,
      round: 1,
      totalRounds: 3,
      players: {
        p1: { id: 'p1', name: 'A', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p2: { id: 'p2', name: 'B', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p3: { id: 'p3', name: 'C', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p4: { id: 'p4', name: 'D', alive: true, hasVoted: false, turnDone: false, score: 0 },
      },
      impostorCount: 1,
    };
    const next = advanceToNextRound(state, Math.random);
    expect(next.phase).toBe('show_word');
  });
});

describe('isFinished', () => {
  it('returns false when round < totalRounds', () => {
    let state = createLobby();
    state = { ...state, round: 3, totalRounds: 5 };
    expect(isFinished(state)).toBe(false);
  });

  it('returns true when round === totalRounds (last round just completed)', () => {
    // isFinished is called after tally/reveal while round still equals the last completed round.
    // A game configured for 5 rounds must finish when round reaches 5, not 6.
    let state = createLobby();
    state = { ...state, round: 5, totalRounds: 5 };
    expect(isFinished(state)).toBe(true);
  });

  it('returns true when round > totalRounds', () => {
    let state = createLobby();
    state = { ...state, round: 6, totalRounds: 5 };
    expect(isFinished(state)).toBe(true);
  });

  it('5-round game: plays exactly 5 rounds — round 4 is not finished, round 5 is', () => {
    let state = createLobby();
    state = { ...state, round: 4, totalRounds: 5 };
    expect(isFinished(state)).toBe(false);
    state = { ...state, round: 5 };
    expect(isFinished(state)).toBe(true);
  });
});

describe('tallyAndEliminate — 0-vote guard', () => {
  it('returns null eliminatedId when there are 0 votes, does not crash', () => {
    let state = createLobby();
    state = {
      ...state,
      players: {
        p1: { id: 'p1', name: 'P1', alive: true, hasVoted: false, turnDone: false, score: 0 },
        p2: { id: 'p2', name: 'P2', alive: true, hasVoted: false, turnDone: false, score: 0 },
      },
      votes: {},
      impostors: new Set(['p1']),
    };
    const result = tallyAndEliminate(state);
    expect(result.eliminatedId).toBeNull();
    expect(result.wasImpostor).toBe(false);
    // State is returned unchanged (no scoring, no elimination)
    expect(result.state.players['p1']!.alive).toBe(true);
    expect(result.state.players['p2']!.alive).toBe(true);
  });
});

describe('advanceSpeaker', () => {
  function makeStateWithSpeakers(ids: string[]): ReturnType<typeof createLobby> {
    const players = Object.fromEntries(
      ids.map((id) => [id, { id, name: id, alive: true, hasVoted: false, turnDone: false, score: 0 }]),
    );
    return {
      ...createLobby(),
      phase: 'discussion' as const,
      speakerOrder: ids,
      currentSpeakerIndex: 0,
      players,
    };
  }

  it('marks current speaker turnDone=true and increments currentSpeakerIndex', () => {
    const state = makeStateWithSpeakers(['p1', 'p2', 'p3']);
    const next = advanceSpeaker(state);
    expect(next.currentSpeakerIndex).toBe(1);
    expect(next.players['p1']!.turnDone).toBe(true);
    expect(next.players['p2']!.turnDone).toBe(false);
  });

  it('does not mutate the original state', () => {
    const state = makeStateWithSpeakers(['p1', 'p2']);
    const next = advanceSpeaker(state);
    expect(state.currentSpeakerIndex).toBe(0);
    expect(state.players['p1']!.turnDone).toBe(false);
    expect(next.currentSpeakerIndex).toBe(1);
  });

  it('can be called repeatedly to advance all speakers', () => {
    let state = makeStateWithSpeakers(['p1', 'p2', 'p3']);
    state = advanceSpeaker(state);
    state = advanceSpeaker(state);
    state = advanceSpeaker(state);
    expect(state.currentSpeakerIndex).toBe(3);
    expect(state.players['p1']!.turnDone).toBe(true);
    expect(state.players['p2']!.turnDone).toBe(true);
    expect(state.players['p3']!.turnDone).toBe(true);
  });

  it('returns state unchanged when currentSpeakerIndex is already past the end', () => {
    let state = makeStateWithSpeakers(['p1']);
    state = { ...state, currentSpeakerIndex: 1 }; // already past end
    const next = advanceSpeaker(state);
    expect(next.currentSpeakerIndex).toBe(1); // unchanged
  });

  it('after advancing past all speakers, currentSpeakerIndex >= speakerOrder.length', () => {
    let state = makeStateWithSpeakers(['p1', 'p2']);
    state = advanceSpeaker(state); // index=1
    state = advanceSpeaker(state); // index=2
    expect(state.currentSpeakerIndex).toBe(2);
    expect(state.currentSpeakerIndex >= state.speakerOrder.length).toBe(true);
  });
});
