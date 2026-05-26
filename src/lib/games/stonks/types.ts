// src/lib/games/stonks/types.ts
export type AssetId =
  | 'ahorro' | 'deposito' | 'bonos' | 'oro'
  | 'ibex' | 'sp500' | 'bitcoin' | 'inmobiliario';

export type Risk = 'baja' | 'media' | 'alta' | 'extrema';

export interface AssetMeta {
  id: AssetId;
  label: string;        // es
  risk: Risk;
  unlockRound: number;  // round index from which the asset can be used
  blurb: string;        // one-sentence description for the info button (es)
}

export interface LifeEvent {
  id: string;
  text: string;   // es
  amount: number; // € applied to cash (negative = expense)
}

/** Annual return as a fraction (0.15 = +15%). null = asset did not exist that year. */
export type MarketData = Record<number, Record<AssetId, number | null>>;

export interface GameState {
  round: number;                       // 0-based index into the sorted year list
  cash: number;
  holdings: Record<AssetId, number>;   // € currently held per asset
  allocation: Record<AssetId, number>; // % for the round in progress (integers, sum 100)
  ai: { netWorth: number };
  lastEvent: LifeEvent | null;         // event applied in the most recent advance
  lastReturns: Record<AssetId, number | null> | null; // returns applied last advance
  history: { year: number; playerNet: number; aiNet: number }[];
  phase: 'start' | 'news' | 'allocate' | 'results' | 'finished';
}
