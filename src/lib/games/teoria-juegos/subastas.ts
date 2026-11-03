// src/lib/games/teoria-juegos/subastas.ts
/**
 * The four classic auction formats, played with independent private values.
 *
 * Two pairs behave identically once you look at the strategy rather than the
 * theatre: the English (ascending) auction ends where the second-highest bidder
 * drops out, exactly like a Vickrey second-price envelope; and the Dutch
 * (descending) clock is a first-price envelope with a countdown. Bidding your
 * true value is weakly dominant when you pay the second price, and shading your
 * bid is the best reply when you pay your own — which is why the seller's
 * takings come out roughly the same either way (revenue equivalence).
 */
import type { Rng } from './types';
import { media } from './aula';

export type Formato = 'inglesa' | 'holandesa' | 'sobre-1' | 'sobre-2';

export const FORMATOS: Formato[] = ['inglesa', 'holandesa', 'sobre-1', 'sobre-2'];

/** True where the winner pays the runner-up's bid instead of their own. */
export function pagaSegundoPrecio(formato: Formato): boolean {
  return formato === 'inglesa' || formato === 'sobre-2';
}

export interface SubastaConfig {
  /** A fixed format, or 'rotar' to cycle through the four and compare. */
  formato: Formato | 'rotar';
  /** Bots bidding against the player. */
  rivales: number;
  /** Private values are drawn uniformly from [0, valorMax]. */
  valorMax: number;
  rondas: number;
}

export const SUBASTA_DEFAULT: SubastaConfig = {
  formato: 'rotar',
  rivales: 4,
  valorMax: 100,
  rondas: 8,
};

export function formatoDeRonda(cfg: SubastaConfig, ronda: number): Formato {
  if (cfg.formato !== 'rotar') return cfg.formato;
  return FORMATOS[(Math.max(1, ronda) - 1) % FORMATOS.length];
}

/**
 * A risk-neutral bot's bid. Paying the second price, its true value is weakly
 * dominant; paying its own bid, the symmetric equilibrium with uniform values
 * is to shade to (n-1)/n of the value.
 */
export function pujaBot(formato: Formato, valor: number, postores: number, rng: Rng): number {
  const n = Math.max(2, postores);
  const base = pagaSegundoPrecio(formato) ? valor : (valor * (n - 1)) / n;
  const ruido = 1 + (rng() - 0.5) * 0.08;
  return Math.max(0, Math.round(base * ruido));
}

export interface Postor {
  valor: number;
  puja: number;
}

export interface ResultadoSubasta {
  /** Index of the winning bidder, or -1 when nobody bid anything. */
  ganador: number;
  precio: number;
  /** The winner's value minus what they paid. Negative means overpaying. */
  excedente: number;
}

export function resolverSubasta(postores: Postor[], formato: Formato): ResultadoSubasta {
  if (postores.length === 0) return { ganador: -1, precio: 0, excedente: 0 };
  let ganador = 0;
  for (let i = 1; i < postores.length; i++) {
    if (postores[i].puja > postores[ganador].puja) ganador = i;
  }
  const mejor = postores[ganador].puja;
  if (mejor <= 0) return { ganador: -1, precio: 0, excedente: 0 };
  const resto = postores.filter((_, i) => i !== ganador).map((p) => p.puja);
  const segunda = resto.length ? Math.max(...resto) : 0;
  const precio = pagaSegundoPrecio(formato) ? segunda : mejor;
  return { ganador, precio, excedente: postores[ganador].valor - precio };
}

export interface SubastaRonda {
  formato: Formato;
  /** Index 0 is the player; 1..n are the bots. */
  postores: Postor[];
  ganador: number;
  precio: number;
  excedenteJugador: number;
  ganaJugador: boolean;
}

export interface SubastaState {
  config: SubastaConfig;
  /** The player's private value for the item on the block right now. */
  valorActual: number;
  historial: SubastaRonda[];
  terminado: boolean;
}

function valorAleatorio(max: number, rng: Rng): number {
  return Math.round(rng() * max);
}

export function crearSubastaState(
  config: SubastaConfig = SUBASTA_DEFAULT,
  rng: Rng = Math.random,
): SubastaState {
  const cfg = {
    ...config,
    rivales: Math.max(1, Math.round(config.rivales)),
    rondas: Math.max(1, Math.round(config.rondas)),
  };
  return { config: cfg, valorActual: valorAleatorio(cfg.valorMax, rng), historial: [], terminado: false };
}

export function pujar(state: SubastaState, puja: number, rng: Rng = Math.random): SubastaState {
  if (state.terminado) return state;
  const cfg = state.config;
  const ronda = state.historial.length + 1;
  const formato = formatoDeRonda(cfg, ronda);
  const postores: Postor[] = [
    { valor: state.valorActual, puja: Math.max(0, Math.round(puja)) },
    ...Array.from({ length: cfg.rivales }, () => {
      const valor = valorAleatorio(cfg.valorMax, rng);
      return { valor, puja: pujaBot(formato, valor, cfg.rivales + 1, rng) };
    }),
  ];
  const res = resolverSubasta(postores, formato);
  const ganaJugador = res.ganador === 0;
  const historial = [
    ...state.historial,
    {
      formato,
      postores,
      ganador: res.ganador,
      precio: res.precio,
      excedenteJugador: ganaJugador ? res.excedente : 0,
      ganaJugador,
    },
  ];
  const terminado = historial.length >= cfg.rondas;
  return {
    ...state,
    historial,
    terminado,
    valorActual: terminado ? state.valorActual : valorAleatorio(cfg.valorMax, rng),
  };
}

export function excedenteTotal(state: SubastaState): number {
  return state.historial.reduce((s, r) => s + r.excedenteJugador, 0);
}

export interface IngresoFormato {
  formato: Formato;
  subastas: number;
  ingresoMedio: number;
}

/**
 * Average price per format across the rounds played. With enough rounds the four
 * numbers close in on each other: that is revenue equivalence, in the students'
 * own data rather than on a slide.
 */
export function ingresoPorFormato(state: SubastaState): IngresoFormato[] {
  return FORMATOS.map((formato) => {
    const rondas = state.historial.filter((r) => r.formato === formato);
    return {
      formato,
      subastas: rondas.length,
      ingresoMedio: media(rondas.map((r) => r.precio)),
    };
  }).filter((f) => f.subastas > 0);
}

export interface ComparativaFormato {
  formato: Formato;
  ganador: number;
  precio: number;
}

/**
 * The same class bids, resolved under each of the four rulebooks. The winner
 * never changes; only the price does — which is the whole lesson.
 */
export function compararFormatos(pujas: number[]): ComparativaFormato[] {
  const postores = pujas
    .filter((p) => Number.isFinite(p))
    .map((p) => ({ valor: 0, puja: Math.max(0, p) }));
  return FORMATOS.map((formato) => {
    const r = resolverSubasta(postores, formato);
    return { formato, ganador: r.ganador, precio: r.precio };
  });
}
