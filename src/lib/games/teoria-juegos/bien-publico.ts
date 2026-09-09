// src/lib/games/teoria-juegos/bien-publico.ts
/**
 * Public goods game. Everyone gets the same endowment and secretly puts part of
 * it into a common pot; the pot is multiplied and shared equally regardless of
 * who paid in. Each euro contributed returns less than a euro to the person who
 * paid it (MPCR < 1) but more than a euro to the group (multiplier > 1) — so
 * free-riding is individually rational and collectively ruinous.
 *
 * The interesting part is not round one; it is the decay across rounds when
 * conditional cooperators notice they are carrying the free-riders.
 */
import type { Rng } from './types';
import { media } from './aula';

export interface BienPublicoConfig {
  /** Player plus bots. */
  jugadores: number;
  /** Tokens each player gets every round. */
  dotacion: number;
  /** The pot is multiplied by this before being split equally. */
  multiplicador: number;
  rondas: number;
}

export const BIEN_PUBLICO_DEFAULT: BienPublicoConfig = {
  jugadores: 5,
  dotacion: 10,
  multiplicador: 2,
  rondas: 8,
};

export type TipoAportante = 'gorron' | 'altruista' | 'condicional' | 'cansada';

export const TIPOS_APORTANTE: TipoAportante[] = ['gorron', 'altruista', 'condicional', 'cansada'];

/**
 * Marginal per-capita return: what one contributed token gives back to the
 * person who contributed it. The dilemma only exists while it is below 1.
 */
export function mpcr(multiplicador: number, jugadores: number): number {
  return jugadores > 0 ? multiplicador / jugadores : 0;
}

/** Payoff per player: what they kept, plus their equal share of the multiplied pot. */
export function pagos(contribuciones: number[], dotacion: number, multiplicador: number): number[] {
  const n = contribuciones.length;
  if (n === 0) return [];
  const bote = contribuciones.reduce((s, c) => s + Math.max(0, c), 0);
  const reparto = (bote * multiplicador) / n;
  return contribuciones.map((c) => dotacion - Math.max(0, c) + reparto);
}

/** Everyone contributes everything: the efficient outcome. */
export function optimoSocial(cfg: BienPublicoConfig): number {
  return cfg.dotacion * cfg.multiplicador;
}

/** Nobody contributes: the dominant-strategy equilibrium. */
export function equilibrioEgoista(cfg: BienPublicoConfig): number {
  return cfg.dotacion;
}

/**
 * What a bot puts in. `mediaPrevia` is the average contribution of the *other*
 * players last round, which is what a conditional cooperator reciprocates.
 */
export function contribucionBot(
  tipo: TipoAportante,
  cfg: BienPublicoConfig,
  mediaPrevia: number | null,
  ronda: number,
  rng: Rng,
): number {
  const E = cfg.dotacion;
  const jitter = (x: number) => Math.max(0, Math.min(E, Math.round(x + (rng() - 0.5) * 2)));
  switch (tipo) {
    case 'gorron':
      return 0;
    case 'altruista':
      return E;
    case 'condicional':
      // Round one it gives the benefit of the doubt, then it mirrors the group.
      return mediaPrevia === null ? jitter(E * 0.7) : jitter(mediaPrevia);
    case 'cansada':
      // Starts generous and loses faith one notch per round.
      return jitter(E * Math.max(0, 1 - 0.18 * (ronda - 1)));
  }
}

export interface BienPublicoRonda {
  /** Index 0 is the player; 1..n follow the bot roster. */
  contribuciones: number[];
  pagos: number[];
  bote: number;
}

export interface BienPublicoState {
  config: BienPublicoConfig;
  tipos: TipoAportante[];
  historial: BienPublicoRonda[];
  terminado: boolean;
}

/** A roster with one of each type, cycling if there are more bots than types. */
export function repartoTipos(bots: number): TipoAportante[] {
  return Array.from({ length: Math.max(0, bots) }, (_, i) => TIPOS_APORTANTE[i % TIPOS_APORTANTE.length]);
}

export function crearBienPublicoState(config: BienPublicoConfig = BIEN_PUBLICO_DEFAULT): BienPublicoState {
  const cfg = {
    ...config,
    jugadores: Math.max(2, Math.round(config.jugadores)),
    rondas: Math.max(1, Math.round(config.rondas)),
  };
  return { config: cfg, tipos: repartoTipos(cfg.jugadores - 1), historial: [], terminado: false };
}

/** Average contribution of everyone but `salvo` in the last round played. */
export function mediaAjena(state: BienPublicoState, salvo: number): number | null {
  const ultima = state.historial[state.historial.length - 1];
  if (!ultima) return null;
  return media(ultima.contribuciones.filter((_, i) => i !== salvo));
}

export function jugarBienPublico(
  state: BienPublicoState,
  contribucion: number,
  rng: Rng = Math.random,
): BienPublicoState {
  if (state.terminado) return state;
  const cfg = state.config;
  const mia = Math.max(0, Math.min(cfg.dotacion, Math.round(contribucion)));
  const ronda = state.historial.length + 1;
  const contribuciones = [
    mia,
    ...state.tipos.map((t, i) => contribucionBot(t, cfg, mediaAjena(state, i + 1), ronda, rng)),
  ];
  const bote = contribuciones.reduce((s, c) => s + c, 0);
  const historial = [
    ...state.historial,
    { contribuciones, pagos: pagos(contribuciones, cfg.dotacion, cfg.multiplicador), bote },
  ];
  return { ...state, historial, terminado: historial.length >= cfg.rondas };
}

export function totalJugador(state: BienPublicoState): number {
  return state.historial.reduce((s, r) => s + r.pagos[0], 0);
}

export interface AulaBienPublico {
  contribuciones: number[];
  media: number;
  bote: number;
  /** What each student takes home, given what the class actually put in. */
  pagoMedio: number;
  /** What everyone would have taken home contributing everything. */
  optimo: number;
  /** Value the class left on the table by not contributing it all. */
  perdida: number;
}

export function analizarAula(
  contribuciones: number[],
  dotacion: number,
  multiplicador: number,
): AulaBienPublico {
  const limpias = contribuciones
    .filter((c) => Number.isFinite(c))
    .map((c) => Math.max(0, Math.min(dotacion, c)));
  const bote = limpias.reduce((s, c) => s + c, 0);
  const p = pagos(limpias, dotacion, multiplicador);
  const optimo = dotacion * multiplicador;
  return {
    contribuciones: limpias,
    media: media(limpias),
    bote,
    pagoMedio: media(p),
    optimo,
    perdida: limpias.length ? Math.max(0, optimo - media(p)) : 0,
  };
}
