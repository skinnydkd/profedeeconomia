// Game constants for Insider multiplayer game

export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const MIN_PLAYERS = 4;
// Students per room (the host does not count), as in Cajút: room for a whole
// Bachillerato group, not for a script registering players without end.
export const MAX_PLAYERS = 40;
export const DEFAULT_ROUNDS = 5;
// Upper bounds of what clients may send; the forms stay below them (the name
// input takes 20 characters, the guess input 60, the rounds select up to 10).
export const NAME_MAX_LENGTH = 20;
export const GUESS_MAX_LENGTH = 60;
export const ID_MAX_LENGTH = 64;
export const MAX_ROUNDS = 20;
export const TIMER_SHOW_WORD_S = 10;
export const TIMER_DISCUSSION_PER_PLAYER_S = 30;
export const TIMER_GUESS_S = 30;
export const TIMER_VOTING_S = 60;
export const SCORE_VOTE_CORRECT = 100;
export const SCORE_IMPOSTOR_SURVIVES = 200;
export const SCORE_IMPOSTOR_GUESS_CORRECT = 150;
export const SCORE_CITIZEN_CATCH = 50;

export function impostorCountFor(players: number): 1 | 2 | 3 {
  if (players < 8) return 1;
  if (players < 16) return 2;
  return 3;
}
