// src/lib/jocs-economics/client/types.ts

export interface PublicQuestion {
  id: string;
  enunciado?: string;
  opciones: string[];
}

export interface StartRequest { playerName: string; institute: string }
export interface StartResponse { gameId: string; token: string; question: PublicQuestion; lives: number; score: number }

export interface AnswerRequest { gameId: string; token: string; questionId: string; optionIdx: number; clientElapsedMs: number }

export interface AnswerResult {
  isCorrect: boolean;
  correctIdx: number;
  scoreGain: number;
  livesLeft: number;
  elapsedMsRecorded: number;
  explicacion?: string;
}

export interface AnswerResponseOngoing {
  result: AnswerResult;
  nextQuestion: PublicQuestion;
  totals: { score: number; questionsAnswered: number; timeTotalMs: number };
}

export interface AnswerResponseFinished {
  result: AnswerResult;
  finished: true;
  final: FinalStats;
}

export type AnswerResponse = AnswerResponseOngoing | AnswerResponseFinished;

export interface FinalStats {
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
  maxDifficultyReached: number;
  finalRank: number | null;
  instituteRank: number | null;
}

export interface LeaderboardIndividualRow {
  rank: number; playerName: string; institute: string;
  score: number; questionsAnswered: number; timeTotalMs: number; finishedAt: string;
}
export interface LeaderboardInstituteRow {
  rank: number; institute: string; totalScore: number; playersCount: number;
  topPlayer: { playerName: string; score: number };
}

export interface ApiError { error: string }
