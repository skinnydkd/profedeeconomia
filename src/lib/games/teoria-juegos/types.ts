// src/lib/games/teoria-juegos/types.ts
/**
 * Shared vocabulary for the six classic game-theory experiments under
 * /juegos/teoria-juegos/. Every mini-game ships two modes:
 *
 *  - `solo`: the student plays against scripted bots (no backend, same shape as
 *    Stonks or Econrisk).
 *  - `aula`: the teacher projects the screen, the class votes by hand and the
 *    teacher types the raw numbers in. The engine then does the analysis the
 *    paper dinámica asks the teacher to do on the whiteboard.
 */

export type MiniId =
  | 'dilema'
  | 'cazaciervo'
  | 'belleza'
  | 'reparto'
  | 'bien-publico'
  | 'subastas';

export type Modo = 'solo' | 'aula';

/** Deterministic-in-tests random source. Same contract as the other games. */
export type Rng = () => number;

export interface MiniMeta {
  id: MiniId;
  /** Colour token name from global.css used as the mini-game accent. */
  colorVar: string;
  /** Companion paper dinámica, so the screen can send the teacher there. */
  papel?: { href: string; label: { es: string; ca: string } };
}
