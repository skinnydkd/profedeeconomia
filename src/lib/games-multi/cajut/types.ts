// src/lib/games-multi/cajut/types.ts
// Contractes compartits client ↔ servidor PartyKit per al joc Cajút.
// Re-exporta projeccions des de la lògica pura del servidor per garantir
// que client i servidor parlen la mateixa shape.

export type {
  Phase,
  PublicPlayer,
  PublicQuestion,
  PublicReveal,
  PublicRankingEntry,
  PublicState,
  PrivateAnswerReview,
  PrivateState,
} from '../../../../party/cajut/state';

export interface CajutClientOptions {
  host: string;
  roomCode: string;
  playerId: string;
  asHost?: boolean;
}

// --- Client → Server ---
export type JoinMsg = {
  type: 'join';
  nick: string;
};

export type StartMatchMsg = {
  type: 'startMatch';
  asignaturaSlug: string;
  unidades: number[];
  totalQuestions: number | 'all';
};

export type SubmitAnswerMsg = {
  type: 'submitAnswer';
  questionIndex: number;
  optionIndex: number;
};

export type SkipQuestionMsg = { type: 'skipQuestion' };
export type KickPlayerMsg = { type: 'kickPlayer'; playerId: string };
export type EndMatchMsg = { type: 'endMatch' };
export type RestartMsg = { type: 'restart' };

export type ClientMsg =
  | JoinMsg
  | StartMatchMsg
  | SubmitAnswerMsg
  | SkipQuestionMsg
  | KickPlayerMsg
  | EndMatchMsg
  | RestartMsg;

// --- Server → Client ---
export type PublicBroadcast = {
  type: 'public';
  state: import('../../../../party/cajut/state').PublicState;
};

export type PrivateBroadcast = {
  type: 'private';
  state: import('../../../../party/cajut/state').PrivateState;
};

export type ErrorBroadcast = {
  type: 'error';
  reason:
    | 'invalid-nick'
    | 'nick-taken'
    | 'already-joined'
    | 'too-many'
    | 'match-started'
    | 'room-not-found'
    | 'not-host'
    | 'wrong-phase'
    | 'wrong-question'
    | 'already-answered'
    | 'not-a-player';
};

export type ServerMsg = PublicBroadcast | PrivateBroadcast | ErrorBroadcast;
