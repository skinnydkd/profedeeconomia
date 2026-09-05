// src/lib/games/stonks/types.ts
export type BaseAssetId =
  | 'efectivo' | 'deposito' | 'deuda' | 'oro' | 'vivienda'
  | 'bolsa_es' | 'sp500' | 'mundial' | 'bitcoin';

export type StockId =
  | 'e_apple' | 'e_msft' | 'e_amzn' | 'e_nvda' | 'e_itx'
  | 'e_nokia' | 'e_terra' | 'e_enron' | 'e_popular';

export type AssetId = BaseAssetId | StockId;
export type Risk = 'baja' | 'media' | 'alta' | 'extrema';
export type Half = 0 | 1;
export type AssetGroup = 'seguro' | 'bolsa' | 'empresa';

/** A holding, tracked at average cost so realised gains can be computed on partial sales. */
export interface Position { value: number; cost: number; }

export interface AssetMeta {
  id: AssetId;
  label: string;          // es — row name. For stocks: the sector ('Semiconductores')
  profile?: string;       // es — stocks only: 'EE. UU. · sale a bolsa en 1999'
  realName?: string;      // stocks only: revealed on RevealScreen
  risk: Risk;
  group: AssetGroup;
  fromYear: number;
  fromHalf: Half;
  untilYear?: number;     // last semester the asset trades
  untilHalf?: Half;
  finalReturn?: number;   // return applied in the until-semester (-1 = wiped out)
}

/** amount is expressed in euros of the window's start year. */
export interface LifeEvent { id: string; text: string; amount: number; }

export interface SemesterNews { year: number; half: Half; text: string; }

/** id is an AssetId, 'clase_empresa', or `${StockId}_reveal`. */
export interface AssetCard { id: string; title: string; body: string[]; }

export interface GameState {
  startYear: number;                    // 1971..2001
  round: number;                        // 0..50 (50 = finished)
  stocks: StockId[];                    // the 5 companies drawn for this game
  seenCards: string[];                  // cards already shown
  holdings: Record<AssetId, Position>;  // includes `efectivo`; there is no separate cash field
  allocation: Record<AssetId, number>;  // integer % for the round in progress
  pendingGain: number;                  // gains realised by forced liquidation, taxed next semester
  totalCosts: number;                   // running total of commission + tax, for the closing lessons
  peakStockShare: number;               // largest share of net worth ever held in one company (0..1)
  ai: Position;
  lastEvent: LifeEvent | null;
  lastReturns: Partial<Record<AssetId, number>> | null;
  lastCosts: { commission: number; tax: number; forced: boolean } | null;
  lastDeath: StockId | null;
  deaths: StockId[];                    // every company that died while the game ran
  history: { year: number; half: Half; nominal: number; real: number; ai: number }[];
  phase: 'start' | 'intro' | 'news' | 'allocate' | 'results' | 'reveal' | 'finished';
}
