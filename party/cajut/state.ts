// party/cajut/state.ts
// Phase machine pura del joc Cajút (spec §6.2).
// Totes les funcions són immutables: prenen state, retornen state nou.

import type { Question } from './questions';
import { scoreFor } from './scoring';
import {
  MAX_PLAYERS,
  NICK_MAX_LENGTH,
  NICK_MIN_LENGTH,
  TIMER_QUESTION_S,
} from './constants';

export type Phase = 'lobby' | 'question' | 'reveal' | 'leaderboard' | 'final';

export interface Player {
  id: string;
  nick: string;
  score: number;
  isConnected: boolean;
  lastSeenAt: number;
}

export interface AnswerRecord {
  questionIndex: number;
  optionIndex: number | null;
  elapsedMs: number;
  scoreGained: number;
  wasCorrect: boolean;
}

export interface MatchConfig {
  asignaturaSlug: string;
  unidades: number[];
  totalQuestions: number | 'all';
}

export interface MatchState {
  phase: Phase;
  roomCode: string;
  hostId: string | null;
  players: Map<string, Player>;
  config: MatchConfig | null;
  questions: Question[];
  questionIndex: number;
  questionStartedAt: number;
  answers: Map<string, AnswerRecord[]>;
}

// --- Tipus de retorn per a accions amb errors ---
export type AddPlayerResult =
  | { ok: true; state: MatchState }
  | { ok: false; reason: 'too-many' | 'invalid-nick' | 'nick-taken' | 'already-joined' | 'match-started' };

export type RecordAnswerResult =
  | { ok: true; state: MatchState; gained: number }
  | { ok: false; reason: 'wrong-phase' | 'wrong-question' | 'already-answered' | 'not-a-player' };

// --- Implementacions ---

export function createInitialState(roomCode: string): MatchState {
  return {
    phase: 'lobby',
    roomCode,
    hostId: null,
    players: new Map(),
    config: null,
    questions: [],
    questionIndex: 0,
    questionStartedAt: 0,
    answers: new Map(),
  };
}

export function registerHost(state: MatchState, hostId: string): MatchState {
  return { ...state, hostId };
}

function isValidNick(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.length < NICK_MIN_LENGTH || trimmed.length > NICK_MAX_LENGTH) return null;
  return trimmed;
}

export function addPlayer(
  state: MatchState,
  id: string,
  rawNick: string,
  now: number,
): AddPlayerResult {
  if (state.phase !== 'lobby') return { ok: false, reason: 'match-started' };
  if (state.players.has(id)) return { ok: false, reason: 'already-joined' };
  if (state.players.size >= MAX_PLAYERS) return { ok: false, reason: 'too-many' };
  const nick = isValidNick(rawNick);
  if (!nick) return { ok: false, reason: 'invalid-nick' };
  const lower = nick.toLowerCase();
  for (const p of state.players.values()) {
    if (p.nick.toLowerCase() === lower) return { ok: false, reason: 'nick-taken' };
  }
  const players = new Map(state.players);
  players.set(id, { id, nick, score: 0, isConnected: true, lastSeenAt: now });
  return { ok: true, state: { ...state, players } };
}

export function removePlayer(state: MatchState, id: string): MatchState {
  if (!state.players.has(id)) return state;
  const players = new Map(state.players);
  players.delete(id);
  return { ...state, players };
}

export function kickPlayer(state: MatchState, id: string): MatchState {
  // Treure jugador (i les seues respostes). La verificació que el caller
  // és el host es fa al server.ts abans de cridar aquesta funció.
  if (!state.players.has(id)) return state;
  const players = new Map(state.players);
  players.delete(id);
  const answers = new Map(state.answers);
  answers.delete(id);
  return { ...state, players, answers };
}

export function setPlayerConnection(
  state: MatchState,
  id: string,
  isConnected: boolean,
  now: number,
): MatchState {
  const existing = state.players.get(id);
  if (!existing) return state;
  const players = new Map(state.players);
  players.set(id, { ...existing, isConnected, lastSeenAt: now });
  return { ...state, players };
}

export function configureMatch(
  state: MatchState,
  config: MatchConfig,
  questions: Question[],
): MatchState {
  return { ...state, config, questions };
}

export function startMatch(state: MatchState, now: number): MatchState {
  return {
    ...state,
    phase: 'question',
    questionIndex: 0,
    questionStartedAt: now,
  };
}

export function recordAnswer(
  state: MatchState,
  playerId: string,
  questionIndex: number,
  optionIndex: number,
  now: number,
): RecordAnswerResult {
  if (state.phase !== 'question') return { ok: false, reason: 'wrong-phase' };
  if (questionIndex !== state.questionIndex) return { ok: false, reason: 'wrong-question' };
  if (!state.players.has(playerId)) return { ok: false, reason: 'not-a-player' };
  const existing = state.answers.get(playerId) ?? [];
  if (existing.some((a) => a.questionIndex === questionIndex)) {
    return { ok: false, reason: 'already-answered' };
  }
  const q = state.questions[questionIndex];
  const elapsedMs = Math.max(0, now - state.questionStartedAt);
  const wasCorrect = optionIndex === q.correcta;
  const gained = scoreFor(wasCorrect, elapsedMs, TIMER_QUESTION_S);

  const record: AnswerRecord = {
    questionIndex,
    optionIndex,
    elapsedMs,
    scoreGained: gained,
    wasCorrect,
  };
  const newAnswers = new Map(state.answers);
  newAnswers.set(playerId, [...existing, record]);

  const player = state.players.get(playerId)!;
  const players = new Map(state.players);
  players.set(playerId, { ...player, score: player.score + gained });

  return { ok: true, state: { ...state, players, answers: newAnswers }, gained };
}

export function allAnswered(state: MatchState): boolean {
  if (state.phase !== 'question') return false;
  const connected = [...state.players.values()].filter((p) => p.isConnected);
  if (connected.length === 0) return false;
  return connected.every((p) => {
    const ans = state.answers.get(p.id) ?? [];
    return ans.some((a) => a.questionIndex === state.questionIndex);
  });
}

export function advanceToReveal(state: MatchState, _now: number): MatchState {
  return { ...state, phase: 'reveal' };
}

export function advanceToLeaderboard(state: MatchState, _now: number): MatchState {
  return { ...state, phase: 'leaderboard' };
}

export function advanceToNextQuestion(state: MatchState, now: number): MatchState {
  const nextIdx = state.questionIndex + 1;
  if (nextIdx >= state.questions.length) {
    return { ...state, phase: 'final' };
  }
  return { ...state, phase: 'question', questionIndex: nextIdx, questionStartedAt: now };
}

export function skipQuestion(state: MatchState, now: number): MatchState {
  // Equival a saltar al reveal sense esperar timer. Els que no han respost
  // queden amb la seua absència; el server podria registrar AnswerRecord
  // amb optionIndex=null per a la pantalla final de revisió, però mantenim
  // la lògica pura simple: la fase canvia, res més.
  return advanceToReveal(state, now);
}

export function endMatch(state: MatchState): MatchState {
  return { ...state, phase: 'final' };
}

// --- Tipus de projecció (els consumeix el client a través de types.ts) ---

export interface PublicPlayer {
  id: string;
  nick: string;
  score: number;
  isConnected: boolean;
  hasAnswered: boolean;
}

export interface PublicQuestion {
  index: number;
  total: number;
  enunciado: string;
  opciones: string[];
  // No correcta, no explicacion
}

export interface PublicReveal {
  correctOption: number;
  perOptionCounts: number[];
  top5: Array<{ id: string; nick: string; score: number }>;
}

export interface PublicRankingEntry {
  id: string;
  nick: string;
  score: number;
}

export interface PublicState {
  phase: Phase;
  roomCode: string;
  players: PublicPlayer[];
  currentQuestion: PublicQuestion | null;
  lastReveal: PublicReveal | null;
  finalRanking: PublicRankingEntry[] | null;
  timerEndsAt: number | null;
}

export interface PrivateAnswerReview {
  questionIndex: number;
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion?: string;
  myOptionIndex: number | null;
  wasCorrect: boolean;
  scoreGained: number;
}

export interface PrivateState {
  myId: string;
  isHost: boolean;
  myNick: string | null;
  myScore: number;
  myRank: number | null;
  myAnswerHistory: PrivateAnswerReview[] | null;
}

// --- Helpers ---

function countAnswers(state: MatchState, qIdx: number, optionsLen: number): number[] {
  const counts = new Array(optionsLen).fill(0);
  for (const answers of state.answers.values()) {
    const a = answers.find((r) => r.questionIndex === qIdx);
    if (a && a.optionIndex !== null && a.optionIndex >= 0 && a.optionIndex < optionsLen) {
      counts[a.optionIndex]++;
    }
  }
  return counts;
}

function rankedPlayers(state: MatchState): Player[] {
  return [...state.players.values()].sort((a, b) => b.score - a.score);
}

export function toPublicState(state: MatchState, timerEndsAt: number | null = null): PublicState {
  const players: PublicPlayer[] = [...state.players.values()].map((p) => ({
    id: p.id,
    nick: p.nick,
    score: p.score,
    isConnected: p.isConnected,
    hasAnswered: (state.answers.get(p.id) ?? []).some((a) => a.questionIndex === state.questionIndex),
  }));

  const q = state.questions[state.questionIndex];
  // Exposem currentQuestion durant question/reveal/leaderboard perquè HostReveal
  // pugui mostrar enunciat+opcions amb la correcta destacada. La PublicQuestion
  // NO porta `correcta` ni `explicacion`; aquesta info viatja per `lastReveal`.
  const showQ =
    (state.phase === 'question' || state.phase === 'reveal' || state.phase === 'leaderboard') && q;
  const currentQuestion: PublicQuestion | null = showQ
    ? {
        index: state.questionIndex,
        total: state.questions.length,
        enunciado: q.enunciado,
        opciones: q.opciones,
      }
    : null;

  const showReveal = (state.phase === 'reveal' || state.phase === 'leaderboard') && q;
  const lastReveal: PublicReveal | null = showReveal
    ? {
        correctOption: q.correcta,
        perOptionCounts: countAnswers(state, state.questionIndex, q.opciones.length),
        top5: rankedPlayers(state)
          .slice(0, 5)
          .map((p) => ({ id: p.id, nick: p.nick, score: p.score })),
      }
    : null;

  const finalRanking: PublicRankingEntry[] | null =
    state.phase === 'final'
      ? rankedPlayers(state).map((p) => ({ id: p.id, nick: p.nick, score: p.score }))
      : null;

  return {
    phase: state.phase,
    roomCode: state.roomCode,
    players,
    currentQuestion,
    lastReveal,
    finalRanking,
    timerEndsAt,
  };
}

export function toPrivateState(state: MatchState, viewerId: string): PrivateState {
  const isHost = state.hostId === viewerId;
  const player = state.players.get(viewerId);
  const rank = (() => {
    if (!player) return null;
    const ranked = rankedPlayers(state);
    const idx = ranked.findIndex((p) => p.id === viewerId);
    return idx >= 0 ? idx + 1 : null;
  })();

  const history: PrivateAnswerReview[] | null =
    state.phase === 'final' && player
      ? state.questions.map((q, i) => {
          const answers = state.answers.get(viewerId) ?? [];
          const a = answers.find((r) => r.questionIndex === i);
          return {
            questionIndex: i,
            enunciado: q.enunciado,
            opciones: q.opciones,
            correcta: q.correcta,
            ...(q.explicacion ? { explicacion: q.explicacion } : {}),
            myOptionIndex: a?.optionIndex ?? null,
            wasCorrect: a?.wasCorrect ?? false,
            scoreGained: a?.scoreGained ?? 0,
          };
        })
      : null;

  return {
    myId: viewerId,
    isHost,
    myNick: player?.nick ?? null,
    myScore: player?.score ?? 0,
    myRank: rank,
    myAnswerHistory: history,
  };
}
