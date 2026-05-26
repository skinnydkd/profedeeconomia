// Cajút — constants compartides server/client
// Mantenir en sync amb spec §8

export const TIMER_QUESTION_S = 20;
export const TIMER_REVEAL_S = 5;
export const TIMER_LEADERBOARD_S = 5;

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 40;

export const SCORE_MAX = 1000;
export const SCORE_MIN_ON_CORRECT = 500;

export const ROOM_CODE_LENGTH = 4;
// Alfabet sense ambigüitats visuals (no I/O/0/1)
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const RECONNECT_WINDOW_MS = 2 * 60 * 1000; // 2 minuts

export const NICK_MIN_LENGTH = 1;
export const NICK_MAX_LENGTH = 20;

export const TOTAL_QUESTIONS_OPTIONS = [10, 15, 20, 25, 'all'] as const;
export const DEFAULT_TOTAL_QUESTIONS = 15;

// Color-coding d'opcions (spec §11) — paleta Variant C, cap color nou
export const OPTION_COLORS = [
  { bg: '#C44E2C', fg: '#FFFFFF' }, // A · terracota
  { bg: '#1F6E6E', fg: '#FFFFFF' }, // B · teal
  { bg: '#D4A24C', fg: '#3a2a10' }, // C · mostassa
  { bg: '#2E5E3A', fg: '#FFFFFF' }, // D · pine
  { bg: '#5B3A4E', fg: '#FFFFFF' }, // E · berenjena
  { bg: '#7A5840', fg: '#FFFFFF' }, // F · marró fosc
] as const;
