import { describe, it, expect } from 'vitest';
import { applyAnswer, RESULT_SCREEN_MS, type GameSession } from './session';
import type { AnswerResponse, PublicQuestion } from './types';

const Q1: PublicQuestion = { id: 'eco-001', enunciado: '¿Qué es el coste de oportunidad?', opciones: ['a', 'b', 'c', 'd'] };
const Q2: PublicQuestion = { id: 'eco-002', enunciado: '¿Qué mide el IPC?', opciones: ['w', 'x', 'y', 'z'] };

const SESSION: GameSession = {
  gameId: 'g1',
  token: 't',
  currentQuestion: Q1,
  livesLeft: 3,
  score: 0,
  questionsAnswered: 0,
  timeTotalMs: 0,
  questionStartedAtMs: 1_000,
};

const RESULT = {
  isCorrect: false,
  correctIdx: 2,
  scoreGain: 0,
  livesLeft: 2,
  elapsedMsRecorded: 4000,
  explicacion: 'Explicación de la pregunta 1',
};

describe('applyAnswer', () => {
  it('keeps the answered question for the result screen while the session moves on', () => {
    const res: AnswerResponse = {
      result: RESULT,
      nextQuestion: Q2,
      totals: { score: 0, questionsAnswered: 1, timeTotalMs: 4000 },
    };
    const out = applyAnswer(SESSION, 1, res, 50_000);
    expect(out.kind).toBe('next');
    // The correction (correctIdx, explanation) is shown on question 1, not on question 2.
    expect(out.lastResult).toEqual({ question: Q1, result: RESULT, selectedOptionIdx: 1 });
    if (out.kind !== 'next') return;
    expect(out.session.currentQuestion).toBe(Q2);
    expect(out.session.livesLeft).toBe(2);
    expect(out.session.questionsAnswered).toBe(1);
    expect(out.session.timeTotalMs).toBe(4000);
    expect(out.session.questionStartedAtMs).toBe(50_000 + RESULT_SCREEN_MS);
  });

  it('keeps the answered question when the answer ends the game', () => {
    const final = { score: 300, questionsAnswered: 5, timeTotalMs: 20_000, maxDifficultyReached: 1.4, finalRank: 7, instituteRank: null };
    const res: AnswerResponse = { result: { ...RESULT, livesLeft: 0 }, finished: true, final };
    const out = applyAnswer(SESSION, -1, res, 50_000);
    expect(out).toEqual({
      kind: 'finished',
      lastResult: { question: Q1, result: { ...RESULT, livesLeft: 0 }, selectedOptionIdx: -1 },
      final,
    });
  });
});
