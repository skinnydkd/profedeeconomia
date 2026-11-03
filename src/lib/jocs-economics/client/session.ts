// src/lib/jocs-economics/client/session.ts
// Pure client-side transitions of Jocs Econòmics, kept out of JocsApp so they
// can be tested without a DOM.

import type { AnswerResponse, AnswerResult, FinalStats, PublicQuestion } from './types';

export interface GameSession {
  gameId: string;
  token: string;
  currentQuestion: PublicQuestion;
  livesLeft: number;
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
  questionStartedAtMs: number;
}

/** What the result screen shows: the question just answered, with its correction. */
export interface ResultData {
  question: PublicQuestion;
  result: AnswerResult;
  selectedOptionIdx: number;
}

/** The result stays on screen this long; the server starts the next question's clock after it too. */
export const RESULT_SCREEN_MS = 3000;

export type AnswerOutcome =
  | { kind: 'finished'; lastResult: ResultData; final: FinalStats }
  | { kind: 'next'; lastResult: ResultData; session: GameSession };

/**
 * Applies the server's answer. The session moves on to the next question, but
 * the result keeps the one that was answered: `correctIdx` and the explanation
 * belong to it, not to the statement and options of the next one.
 */
export function applyAnswer(
  session: GameSession,
  selectedOptionIdx: number,
  res: AnswerResponse,
  now: number,
): AnswerOutcome {
  const lastResult: ResultData = { question: session.currentQuestion, result: res.result, selectedOptionIdx };
  if ('finished' in res) return { kind: 'finished', lastResult, final: res.final };
  return {
    kind: 'next',
    lastResult,
    session: {
      ...session,
      currentQuestion: res.nextQuestion,
      livesLeft: res.result.livesLeft,
      score: res.totals.score,
      questionsAnswered: res.totals.questionsAnswered,
      timeTotalMs: res.totals.timeTotalMs,
      // Reset again when the question actually appears, after the result screen.
      questionStartedAtMs: now + RESULT_SCREEN_MS,
    },
  };
}
