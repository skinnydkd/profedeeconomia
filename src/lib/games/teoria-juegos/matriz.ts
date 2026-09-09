// src/lib/games/teoria-juegos/matriz.ts
/**
 * Repeated symmetric 2x2 game engine, shared by the prisoner's dilemma and the
 * stag hunt: same mechanics, different payoff numbers, opposite lesson. Keeping
 * one engine means the strategy roster (tit-for-tat and friends) is written and
 * tested once.
 *
 * Payoffs are stated from the row player's point of view; the game is symmetric,
 * so the column player reads the mirrored cell.
 */
import type { Rng } from './types';

/** 'C' cooperates (stay silent / hunt stag), 'D' defects (confess / chase hare). */
export type Move = 'C' | 'D';

export type MatrizId = 'dilema' | 'cazaciervo';

export interface Payoffs {
  /** Both cooperate. */
  CC: number;
  /** I cooperate, the other defects — the sucker's payoff. */
  CD: number;
  /** I defect, the other cooperates — the temptation. */
  DC: number;
  /** Both defect. */
  DD: number;
}

export const MATRICES: Record<MatrizId, Payoffs> = {
  // T(5) > R(3) > P(1) > S(0): defecting dominates, yet mutual defection is worse
  // for both than mutual cooperation. The whole point of the dilemma.
  dilema: { CC: 3, CD: 0, DC: 5, DD: 1 },
  // R(4) > T(3) >= P(2) > S(0): cooperating is best *if* the other cooperates.
  // Two equilibria, so the problem is trust and coordination, not temptation.
  cazaciervo: { CC: 4, CD: 0, DC: 3, DD: 2 },
};

export function payoffFor(id: MatrizId, mine: Move, theirs: Move): number {
  const p = MATRICES[id];
  if (mine === 'C') return theirs === 'C' ? p.CC : p.CD;
  return theirs === 'C' ? p.DC : p.DD;
}

export type BotId =
  | 'siempre-coopera'
  | 'siempre-traiciona'
  | 'tit-for-tat'
  | 'rencorosa'
  | 'perdonavidas'
  | 'aleatoria'
  | 'sondeadora';

export interface Ronda {
  jugador: Move;
  bot: Move;
  puntosJugador: number;
  puntosBot: number;
}

/**
 * Bot decision rules. Each reads the rounds played so far (oldest first) and
 * returns its move for the next one. They never see the player's current move,
 * so no strategy can peek.
 */
export const BOTS: Record<BotId, (historia: Ronda[], rng: Rng) => Move> = {
  'siempre-coopera': () => 'C',
  'siempre-traiciona': () => 'D',
  // Copies the player's last move; starts by cooperating.
  'tit-for-tat': (h) => (h.length === 0 ? 'C' : h[h.length - 1].jugador),
  // Cooperates until betrayed once, then never again.
  rencorosa: (h) => (h.some((r) => r.jugador === 'D') ? 'D' : 'C'),
  // Tit for two tats: only retaliates after two betrayals in a row.
  perdonavidas: (h) =>
    h.length >= 2 && h[h.length - 1].jugador === 'D' && h[h.length - 2].jugador === 'D' ? 'D' : 'C',
  aleatoria: (_h, rng) => (rng() < 0.5 ? 'C' : 'D'),
  // Defects on round 2 to test the water; if punished it plays tit-for-tat,
  // otherwise it keeps exploiting.
  sondeadora: (h) => {
    if (h.length === 0) return 'C';
    if (h.length === 1) return 'D';
    const castigada = h.slice(1).some((r) => r.jugador === 'D');
    return castigada ? h[h.length - 1].jugador : 'D';
  },
};

export const BOT_IDS = Object.keys(BOTS) as BotId[];

export interface MatrizState {
  juego: MatrizId;
  bot: BotId;
  rondas: number;
  historia: Ronda[];
  /** Set once the planned number of rounds has been played. */
  terminado: boolean;
}

export function crearMatrizState(juego: MatrizId, bot: BotId, rondas: number): MatrizState {
  return { juego, bot, rondas: Math.max(1, Math.round(rondas)), historia: [], terminado: false };
}

export function jugarRonda(state: MatrizState, jugada: Move, rng: Rng = Math.random): MatrizState {
  if (state.terminado) return state;
  const bot = BOTS[state.bot](state.historia, rng);
  const ronda: Ronda = {
    jugador: jugada,
    bot,
    puntosJugador: payoffFor(state.juego, jugada, bot),
    puntosBot: payoffFor(state.juego, bot, jugada),
  };
  const historia = [...state.historia, ronda];
  return { ...state, historia, terminado: historia.length >= state.rondas };
}

export interface Totales {
  jugador: number;
  bot: number;
}

export function totales(historia: Ronda[]): Totales {
  return historia.reduce<Totales>(
    (acc, r) => ({ jugador: acc.jugador + r.puntosJugador, bot: acc.bot + r.puntosBot }),
    { jugador: 0, bot: 0 },
  );
}

/** Share of rounds each side cooperated, 0-1. Empty history reads as 0. */
export function tasaCooperacion(historia: Ronda[]): Totales {
  if (historia.length === 0) return { jugador: 0, bot: 0 };
  const c = historia.reduce(
    (acc, r) => ({
      jugador: acc.jugador + (r.jugador === 'C' ? 1 : 0),
      bot: acc.bot + (r.bot === 'C' ? 1 : 0),
    }),
    { jugador: 0, bot: 0 },
  );
  return { jugador: c.jugador / historia.length, bot: c.bot / historia.length };
}

/**
 * What the player would have scored had they played the same move every round,
 * facing the same bot moves. Used in the debrief to answer "would defecting all
 * the way have been better?" without hand-waving.
 */
export function contrafactual(state: MatrizState, jugada: Move): number {
  return state.historia.reduce((s, r) => s + payoffFor(state.juego, jugada, r.bot), 0);
}

/**
 * Population version for `aula` mode: with `cooperadores` of `total` students
 * cooperating, what does an individual cooperator and an individual defector
 * expect to score against a random classmate? The gap is the free-rider premium.
 */
export function pagosPoblacion(
  juego: MatrizId,
  cooperadores: number,
  total: number,
): { cooperar: number; traicionar: number; media: number } {
  if (total <= 1) return { cooperar: 0, traicionar: 0, media: 0 };
  const c = Math.max(0, Math.min(total, Math.round(cooperadores)));
  const d = total - c;
  // A cooperator meets one of the other total-1 students at random.
  const pC = c > 0 ? ((c - 1) * payoffFor(juego, 'C', 'C') + d * payoffFor(juego, 'C', 'D')) / (total - 1) : 0;
  const pD = d > 0 ? (c * payoffFor(juego, 'D', 'C') + (d - 1) * payoffFor(juego, 'D', 'D')) / (total - 1) : 0;
  return { cooperar: pC, traicionar: pD, media: (c * pC + d * pD) / total };
}
