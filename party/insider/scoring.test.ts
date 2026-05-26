import { describe, it, expect } from 'vitest';
import { applyRoundScores } from './scoring';
import {
  SCORE_VOTE_CORRECT,
  SCORE_IMPOSTOR_SURVIVES,
  SCORE_IMPOSTOR_GUESS_CORRECT,
  SCORE_CITIZEN_CATCH,
} from './constants';

describe('applyRoundScores', () => {
  it('awards SCORE_VOTE_CORRECT to voters of the eliminated impostor', () => {
    const r = applyRoundScores(
      {
        votes: { v1: 'imp1', v2: 'imp1', v3: 'c2' },
        impostors: new Set(['imp1']),
        alive: ['v1', 'v2', 'v3', 'imp1', 'c2'],
      },
      'imp1',
      true,
    );
    expect(r.deltas.v1).toBe(SCORE_VOTE_CORRECT + SCORE_CITIZEN_CATCH);
    expect(r.deltas.v2).toBe(SCORE_VOTE_CORRECT + SCORE_CITIZEN_CATCH);
    expect(r.deltas.v3 ?? 0).toBe(SCORE_CITIZEN_CATCH); // wrong vote, no +100, but +50 catch
  });

  it('awards SCORE_IMPOSTOR_SURVIVES when wasImpostor === false (citizen voted out)', () => {
    const r = applyRoundScores(
      {
        votes: { v1: 'c2', v2: 'c2' },
        impostors: new Set(['imp1']),
        alive: ['v1', 'v2', 'imp1', 'c2'],
      },
      'c2',
      false,
    );
    expect(r.deltas.imp1).toBe(SCORE_IMPOSTOR_SURVIVES);
  });

  it('awards SCORE_IMPOSTOR_GUESS_CORRECT if impostor guesses correctly', () => {
    const r = applyRoundScores(
      { votes: {}, impostors: new Set(['imp1']), alive: ['imp1', 'c1'] },
      'imp1',
      true,
      { word: 'Inflación', correct: true },
    );
    expect(r.deltas.imp1).toBe(SCORE_IMPOSTOR_GUESS_CORRECT);
  });

  it('awards no SCORE_IMPOSTOR_GUESS_CORRECT if impostor guesses wrong', () => {
    const r = applyRoundScores(
      { votes: {}, impostors: new Set(['imp1']), alive: ['imp1', 'c1'] },
      'imp1',
      true,
      { word: 'Monopolio', correct: false },
    );
    expect(r.deltas.imp1 ?? 0).toBe(0);
  });

  it('gives no delta to players who did not vote (no hasVoted means no score)', () => {
    const r = applyRoundScores(
      {
        votes: { v1: 'imp1' },
        impostors: new Set(['imp1']),
        alive: ['v1', 'imp1', 'silent'],
      },
      'imp1',
      true,
    );
    // silent did not vote — should get SCORE_CITIZEN_CATCH (citizen who catches) but not SCORE_VOTE_CORRECT
    expect(r.deltas.silent ?? 0).toBe(SCORE_CITIZEN_CATCH);
    expect(r.deltas.v1).toBe(SCORE_VOTE_CORRECT + SCORE_CITIZEN_CATCH);
  });

  it('citizens who voted correctly get both bonuses, wrong voters get only SCORE_CITIZEN_CATCH', () => {
    const r = applyRoundScores(
      {
        votes: { c1: 'imp1', c2: 'imp1', c3: 'c4' },
        impostors: new Set(['imp1']),
        alive: ['c1', 'c2', 'c3', 'c4', 'imp1'],
      },
      'imp1',
      true,
    );
    expect(r.deltas.c1).toBe(SCORE_VOTE_CORRECT + SCORE_CITIZEN_CATCH);
    expect(r.deltas.c2).toBe(SCORE_VOTE_CORRECT + SCORE_CITIZEN_CATCH);
    expect(r.deltas.c3).toBe(SCORE_CITIZEN_CATCH);
    expect(r.deltas.c4).toBe(SCORE_CITIZEN_CATCH);
  });
});
