// Shared types for Insider multiplayer game — consumed by server (party/) and client (src/)

export type Phase = 'lobby' | 'show_word' | 'discussion' | 'voting' | 'reveal' | 'guess' | 'finished';

export interface PublicPlayer {
  id: string;
  name: string;
  alive: boolean;
  hasVoted: boolean;
  turnDone: boolean;
  score: number;
}

export interface PublicState {
  phase: Phase;
  round: number;
  totalRounds: number;
  impostorCount: number;
  players: PublicPlayer[];
  currentSpeakerId: string | null;
  speakerOrder: string[];           // ids in order for the current round
  timerEndsAt: number | null;       // unix ms (server clock)
  votesCast: number;
  lastReveal: { eliminatedId: string; wasImpostor: boolean } | null;
  lastGuess: { guess: string; correct: boolean } | null;
  word: string | null;              // revealed to everyone at finished or after reveal
  finalRanking: { id: string; name: string; score: number }[] | null;
}

export interface PrivateState {
  myId: string;
  role: 'citizen' | 'impostor';
  word: string | null;              // null if impostor
  canVote: boolean;
  canGuess: boolean;
  isHost: boolean;
}

export type ClientMsg =
  | { type: 'join'; name: string; playerId: string; asHost?: boolean }
  | { type: 'startGame'; totalRounds: number; impostorCountOverride?: number }
  | { type: 'advancePhase' }                    // host force-advance (e.g., skip timer)
  | { type: 'vote'; targetId: string }
  | { type: 'guess'; word: string }
  | { type: 'restart' };

export type ServerMsg =
  | { type: 'public'; state: PublicState }
  | { type: 'private'; state: PrivateState }
  | { type: 'error'; reason: string };
