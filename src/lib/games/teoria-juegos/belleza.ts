// src/lib/games/teoria-juegos/belleza.ts
/**
 * Keynesian beauty contest: everybody picks a number in [0, max] and whoever
 * lands closest to `p` times the average wins. The Nash equilibrium is 0, but
 * nobody plays it at first — what the game actually measures is how many steps
 * of "if they think that, then I…" each player takes (level-k reasoning).
 *
 * Bots are level-k players: a level-k bot assumes everyone else is level k-1.
 * Between rounds they learn, which is what makes a class converge downwards.
 */
import type { Rng } from './types';

export interface BellezaConfig {
  /** Fraction of the average to aim at. 2/3 is the classic. */
  p: number;
  /** Upper end of the allowed range. */
  max: number;
  /** How many bots sit at the table alongside the player. */
  bots: number;
  rondas: number;
}

export const BELLEZA_DEFAULT: BellezaConfig = { p: 2 / 3, max: 100, bots: 9, rondas: 4 };

/** Highest reasoning depth the bots will ever reach; keeps guesses off zero. */
export const NIVEL_MAX = 6;

/** A level-k guess: the anchor discounted once per step of reasoning. */
export function nivelK(ancla: number, nivel: number, p: number): number {
  return ancla * Math.pow(p, Math.max(0, nivel));
}

/**
 * Which reasoning level a number is closest to, given the anchor. Used to sort
 * a class's answers into level bands in `aula` mode.
 */
export function nivelDe(numero: number, ancla: number, p: number): number {
  if (!(numero > 0) || ancla <= 0 || p <= 0 || p >= 1) return NIVEL_MAX;
  const k = Math.log(numero / ancla) / Math.log(p);
  return Math.max(0, Math.min(NIVEL_MAX, Math.round(k)));
}

/** Starting reasoning depths: most people stop at 1-2 steps, a few go deeper. */
export function repartoNiveles(n: number, rng: Rng): number[] {
  const pesos = [0.22, 0.34, 0.24, 0.12, 0.05, 0.03]; // levels 0..5
  const niveles: number[] = [];
  for (let i = 0; i < n; i++) {
    let r = rng();
    let nivel = pesos.length - 1;
    for (let k = 0; k < pesos.length; k++) {
      if (r < pesos[k]) { nivel = k; break; }
      r -= pesos[k];
    }
    niveles.push(nivel);
  }
  return niveles;
}

/** A bot's actual guess: its level-k number, jittered ±10% and clamped. */
export function tiradaBot(nivel: number, ancla: number, cfg: BellezaConfig, rng: Rng): number {
  const base = nivelK(ancla, nivel, cfg.p);
  const ruido = 1 + (rng() - 0.5) * 0.2;
  return Math.max(0, Math.min(cfg.max, Math.round(base * ruido)));
}

/** The number to be closest to: p times the mean of every guess on the table. */
export function objetivo(numeros: number[], p: number): number {
  if (numeros.length === 0) return 0;
  return (numeros.reduce((s, n) => s + n, 0) / numeros.length) * p;
}

/** Indices of the guesses closest to the target; ties all win, as in class. */
export function ganadores(numeros: number[], p: number): number[] {
  if (numeros.length === 0) return [];
  const obj = objetivo(numeros, p);
  const distancias = numeros.map((n) => Math.abs(n - obj));
  const mejor = Math.min(...distancias);
  return distancias.flatMap((d, i) => (Math.abs(d - mejor) < 1e-9 ? [i] : []));
}

export interface BellezaRonda {
  ancla: number;
  jugador: number;
  bots: number[];
  objetivo: number;
  /** Index 0 is the player; 1..n are the bots, in roster order. */
  ganadores: number[];
  gana: boolean;
}

export interface BellezaState {
  config: BellezaConfig;
  niveles: number[];
  historial: BellezaRonda[];
  terminado: boolean;
}

export function crearBellezaState(
  config: BellezaConfig = BELLEZA_DEFAULT,
  rng: Rng = Math.random,
): BellezaState {
  return {
    config,
    niveles: repartoNiveles(Math.max(1, config.bots), rng),
    historial: [],
    terminado: false,
  };
}

/** The anchor a round is reasoned from: half the range at first, then the last target. */
export function anclaDe(state: BellezaState): number {
  const previa = state.historial[state.historial.length - 1];
  return previa ? Math.max(previa.objetivo, 0) : state.config.max / 2;
}

export function jugarBelleza(state: BellezaState, numero: number, rng: Rng = Math.random): BellezaState {
  if (state.terminado) return state;
  const cfg = state.config;
  const jugador = Math.max(0, Math.min(cfg.max, Math.round(numero)));
  const ancla = anclaDe(state);
  const bots = state.niveles.map((nivel) => tiradaBot(nivel, ancla, cfg, rng));
  const numeros = [jugador, ...bots];
  const obj = objetivo(numeros, cfg.p);
  const gana = ganadores(numeros, cfg.p);
  const ronda: BellezaRonda = {
    ancla, jugador, bots, objetivo: obj, ganadores: gana, gana: gana.includes(0),
  };
  // Between rounds roughly half the table takes one more step of reasoning:
  // that learning is what drives a real class towards zero.
  const niveles = state.niveles.map((n) => (rng() < 0.5 ? Math.min(NIVEL_MAX, n + 1) : n));
  const historial = [...state.historial, ronda];
  return { ...state, niveles, historial, terminado: historial.length >= cfg.rondas };
}

export interface AulaBelleza {
  numeros: number[];
  media: number;
  objetivo: number;
  ganadores: number[];
  /** How many answers fell in each reasoning level, index = level. */
  porNivel: number[];
}

/** Analysis of a set of numbers typed in from the class vote. */
export function analizarAula(numeros: number[], cfg: BellezaConfig): AulaBelleza {
  const limpios = numeros.filter((n) => Number.isFinite(n)).map((n) => Math.max(0, Math.min(cfg.max, n)));
  const media = limpios.length ? limpios.reduce((s, n) => s + n, 0) / limpios.length : 0;
  const porNivel = Array.from({ length: NIVEL_MAX + 1 }, () => 0);
  for (const n of limpios) porNivel[nivelDe(n, cfg.max / 2, cfg.p)] += 1;
  return {
    numeros: limpios,
    media,
    objetivo: objetivo(limpios, cfg.p),
    ganadores: ganadores(limpios, cfg.p),
    porNivel,
  };
}
