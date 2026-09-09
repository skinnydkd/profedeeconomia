// src/lib/games/teoria-juegos/reparto.ts
/**
 * Two ways of splitting the same pot:
 *
 *  - `dictador`: the proposer decides and that is that. Whatever is offered is
 *    pure preference — self-interest alone predicts zero.
 *  - `ultimatum`: the responder can reject, and rejection burns both shares.
 *    Textbook rationality says accept any crumb; nobody does.
 *
 * The player can sit on either side of the table, because the lesson only
 * lands once you have been the one deciding whether to burn the money.
 */
import type { Rng } from './types';
import { media } from './aula';

export type RepartoVariante = 'dictador' | 'ultimatum';
export type Rol = 'proponente' | 'respondedor';

/** Responder personalities: how big a share they need before they accept. */
export type TipoRespondedor = 'calculador' | 'tolerante' | 'orgulloso' | 'justiciero';

export const RESPONDEDORES: Record<TipoRespondedor, { minimo: number; ruido: number }> = {
  // Homo economicus: a crumb beats nothing.
  calculador: { minimo: 1, ruido: 0 },
  tolerante: { minimo: 15, ruido: 6 },
  orgulloso: { minimo: 30, ruido: 8 },
  justiciero: { minimo: 42, ruido: 6 },
};

export const TIPOS_RESPONDEDOR = Object.keys(RESPONDEDORES) as TipoRespondedor[];

/** Proposer personalities, as a share of the pot they tend to offer. */
export type TipoProponente = 'tacano' | 'calculista' | 'prudente' | 'igualitario';

export const PROPONENTES: Record<TipoProponente, { oferta: number; ruido: number }> = {
  tacano: { oferta: 8, ruido: 6 },
  calculista: { oferta: 25, ruido: 8 },
  prudente: { oferta: 38, ruido: 7 },
  igualitario: { oferta: 50, ruido: 3 },
};

export const TIPOS_PROPONENTE = Object.keys(PROPONENTES) as TipoProponente[];

/** The share this responder needs this time, as a percentage of the pot. */
export function umbralDe(tipo: TipoRespondedor, rng: Rng): number {
  const { minimo, ruido } = RESPONDEDORES[tipo];
  return Math.max(0, Math.min(100, minimo + (rng() - 0.5) * 2 * ruido));
}

/** The share this proposer offers this time, as a percentage of the pot. */
export function ofertaDe(tipo: TipoProponente, rng: Rng): number {
  const { oferta, ruido } = PROPONENTES[tipo];
  return Math.max(0, Math.min(100, Math.round(oferta + (rng() - 0.5) * 2 * ruido)));
}

export interface Resultado {
  aceptada: boolean;
  proponente: number;
  respondedor: number;
}

export function resolverDictador(bote: number, ofertaPct: number): Resultado {
  const pct = Math.max(0, Math.min(100, ofertaPct));
  const respondedor = (bote * pct) / 100;
  return { aceptada: true, proponente: bote - respondedor, respondedor };
}

export function resolverUltimatum(bote: number, ofertaPct: number, umbralPct: number): Resultado {
  const pct = Math.max(0, Math.min(100, ofertaPct));
  if (pct < umbralPct) return { aceptada: false, proponente: 0, respondedor: 0 };
  const respondedor = (bote * pct) / 100;
  return { aceptada: true, proponente: bote - respondedor, respondedor };
}

export interface RepartoRonda {
  ofertaPct: number;
  /** The responder's threshold — null in the dictator game, which has none. */
  umbralPct: number | null;
  oponente: string;
  aceptada: boolean;
  jugador: number;
  rival: number;
}

export interface RepartoConfig {
  variante: RepartoVariante;
  rol: Rol;
  bote: number;
  rondas: number;
}

export const REPARTO_DEFAULT: RepartoConfig = {
  variante: 'ultimatum',
  rol: 'proponente',
  bote: 100,
  rondas: 6,
};

export interface RepartoState {
  config: RepartoConfig;
  historial: RepartoRonda[];
  /** Offer waiting for the player's answer (responder role only). */
  pendiente: { ofertaPct: number; oponente: TipoProponente } | null;
  terminado: boolean;
}

function siguienteOferta(cfg: RepartoConfig, rng: Rng): RepartoState['pendiente'] {
  if (cfg.rol !== 'respondedor') return null;
  const oponente = TIPOS_PROPONENTE[Math.floor(rng() * TIPOS_PROPONENTE.length) % TIPOS_PROPONENTE.length];
  return { ofertaPct: ofertaDe(oponente, rng), oponente };
}

export function crearRepartoState(
  config: RepartoConfig = REPARTO_DEFAULT,
  rng: Rng = Math.random,
): RepartoState {
  const cfg = { ...config, rondas: Math.max(1, Math.round(config.rondas)) };
  return { config: cfg, historial: [], pendiente: siguienteOferta(cfg, rng), terminado: false };
}

/** The player proposes a split (proposer role). */
export function ofertar(state: RepartoState, ofertaPct: number, rng: Rng = Math.random): RepartoState {
  if (state.terminado || state.config.rol !== 'proponente') return state;
  const pct = Math.max(0, Math.min(100, Math.round(ofertaPct)));
  const { variante, bote } = state.config;
  const tipo = TIPOS_RESPONDEDOR[Math.floor(rng() * TIPOS_RESPONDEDOR.length) % TIPOS_RESPONDEDOR.length];
  const umbral = variante === 'ultimatum' ? umbralDe(tipo, rng) : null;
  const res = umbral === null ? resolverDictador(bote, pct) : resolverUltimatum(bote, pct, umbral);
  const ronda: RepartoRonda = {
    ofertaPct: pct,
    umbralPct: umbral,
    oponente: tipo,
    aceptada: res.aceptada,
    jugador: res.proponente,
    rival: res.respondedor,
  };
  const historial = [...state.historial, ronda];
  return { ...state, historial, terminado: historial.length >= state.config.rondas };
}

/** The player accepts or rejects the pending offer (responder role). */
export function responder(state: RepartoState, acepta: boolean, rng: Rng = Math.random): RepartoState {
  if (state.terminado || state.config.rol !== 'respondedor' || !state.pendiente) return state;
  const { ofertaPct, oponente } = state.pendiente;
  const { bote, variante } = state.config;
  // In the dictator game the responder has no say: the offer simply lands.
  const aceptada = variante === 'dictador' ? true : acepta;
  const res = aceptada ? resolverDictador(bote, ofertaPct) : { aceptada: false, proponente: 0, respondedor: 0 };
  const ronda: RepartoRonda = {
    ofertaPct,
    umbralPct: null,
    oponente,
    aceptada,
    jugador: res.respondedor,
    rival: res.proponente,
  };
  const historial = [...state.historial, ronda];
  const terminado = historial.length >= state.config.rondas;
  return {
    ...state,
    historial,
    terminado,
    pendiente: terminado ? null : siguienteOferta(state.config, rng),
  };
}

export function totalJugador(historial: RepartoRonda[]): number {
  return historial.reduce((s, r) => s + r.jugador, 0);
}

export interface AulaReparto {
  ofertas: number[];
  media: number;
  /** Share of offers of 40% or more — the "fair split" band. */
  proporcionJusta: number;
  /** Share of offers of 10% or less — the textbook-rational band. */
  proporcionTacana: number;
}

export function analizarOfertas(ofertas: number[]): AulaReparto {
  const limpias = ofertas.filter((n) => Number.isFinite(n)).map((n) => Math.max(0, Math.min(100, n)));
  const total = limpias.length || 1;
  return {
    ofertas: limpias,
    media: media(limpias),
    proporcionJusta: limpias.filter((o) => o >= 40).length / total,
    proporcionTacana: limpias.filter((o) => o <= 10).length / total,
  };
}

export interface PuntoCurva {
  ofertaPct: number;
  /** Share of the class that would reject an offer this size, 0-1. */
  rechazo: number;
  /** What the proposer keeps on average at this offer, given those rejections. */
  esperado: number;
}

/**
 * The rejection curve from the class's own minimum acceptable offers, plus the
 * proposer's expected earnings at each offer size. Where that peaks is the
 * answer to "so how much *should* I have offered?" — and it is almost never 0.
 */
export function curvaRechazo(umbrales: number[], bote: number, paso = 5): PuntoCurva[] {
  const limpios = umbrales.filter((n) => Number.isFinite(n)).map((n) => Math.max(0, Math.min(100, n)));
  const puntos: PuntoCurva[] = [];
  for (let oferta = 0; oferta <= 100; oferta += paso) {
    const rechazan = limpios.filter((u) => oferta < u).length;
    const rechazo = limpios.length ? rechazan / limpios.length : 0;
    puntos.push({
      ofertaPct: oferta,
      rechazo,
      esperado: (1 - rechazo) * bote * (1 - oferta / 100),
    });
  }
  return puntos;
}

/** The offer with the highest expected earnings on that curve (lowest wins ties). */
export function mejorOferta(curva: PuntoCurva[]): PuntoCurva | null {
  return curva.reduce<PuntoCurva | null>(
    (mejor, p) => (mejor === null || p.esperado > mejor.esperado + 1e-9 ? p : mejor),
    null,
  );
}
