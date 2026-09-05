// src/lib/games/stonks/data/assets.ts
import type { AssetMeta, AssetId, StockId, Half } from '../types';

/**
 * The 18 assets a game can offer. Availability is keyed to the SEMESTER an
 * asset really existed, not to a round index — that is what stops bitcoin
 * from turning up in 1984.
 *
 * Companies carry a blind `label` + `profile` for play and a `realName` that
 * only the reveal screen ever shows. A test in assets.test.ts asserts the real
 * name never leaks into what the board displays.
 */
export const ASSETS: AssetMeta[] = [
  // ── Base assets, available from the first semester of the data ──────────
  { id: 'efectivo', label: 'Efectivo',               risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'deposito', label: 'Depósito a plazo',       risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'deuda',    label: 'Deuda pública española', risk: 'baja',    group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'oro',      label: 'Oro',                    risk: 'media',   group: 'seguro', fromYear: 1971, fromHalf: 0 },
  { id: 'vivienda', label: 'Vivienda en España',     risk: 'media',   group: 'seguro', fromYear: 1971, fromHalf: 0 },
  // bolsa_es is the Índice General de la Bolsa de Madrid to 1991 and the IBEX 35
  // from 1992; the asset's card says so, because a silent change of reference
  // would be a trap rather than a lesson.
  { id: 'bolsa_es', label: 'Bolsa española',         risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'sp500',    label: 'Bolsa de EE. UU.',       risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'mundial',  label: 'Bolsa mundial',          risk: 'alta',    group: 'bolsa',  fromYear: 1971, fromHalf: 0 },
  { id: 'bitcoin',  label: 'Criptomoneda',           risk: 'extrema', group: 'bolsa',  fromYear: 2011, fromHalf: 0 },

  // ── Companies: five of these nine are drawn per game ────────────────────
  { id: 'e_apple',   label: 'Electrónica de consumo', profile: 'EE. UU. · sale a bolsa en 1980', realName: 'Apple',
    risk: 'extrema', group: 'empresa', fromYear: 1981, fromHalf: 0 },
  { id: 'e_msft',    label: 'Software',               profile: 'EE. UU. · sale a bolsa en 1986', realName: 'Microsoft',
    risk: 'extrema', group: 'empresa', fromYear: 1986, fromHalf: 1 },
  { id: 'e_amzn',    label: 'Comercio electrónico',   profile: 'EE. UU. · sale a bolsa en 1997', realName: 'Amazon',
    risk: 'extrema', group: 'empresa', fromYear: 1997, fromHalf: 1 },
  { id: 'e_nvda',    label: 'Semiconductores',        profile: 'EE. UU. · sale a bolsa en 1999', realName: 'Nvidia',
    risk: 'extrema', group: 'empresa', fromYear: 1999, fromHalf: 0 },
  { id: 'e_itx',     label: 'Textil',                 profile: 'España · sale a bolsa en 2001',  realName: 'Inditex',
    risk: 'extrema', group: 'empresa', fromYear: 2001, fromHalf: 1 },
  { id: 'e_nokia',   label: 'Telefonía móvil',        profile: 'Finlandia · cotiza desde 1994',  realName: 'Nokia',
    risk: 'extrema', group: 'empresa', fromYear: 1994, fromHalf: 0 },

  // Terra was absorbed by its parent in 2005 at a price that bore no relation
  // to its 2000 peak: a near-total loss, but not a zero like the other two.
  { id: 'e_terra',   label: 'Portal de internet',     profile: 'España · sale a bolsa en 1999',  realName: 'Terra',
    risk: 'extrema', group: 'empresa', fromYear: 1999, fromHalf: 1, untilYear: 2005, untilHalf: 1, finalReturn: -0.92 },
  { id: 'e_enron',   label: 'Energía',                profile: 'EE. UU. · cotiza desde 1986',    realName: 'Enron',
    risk: 'extrema', group: 'empresa', fromYear: 1986, fromHalf: 0, untilYear: 2001, untilHalf: 1, finalReturn: -1 },
  { id: 'e_popular', label: 'Banca',                  profile: 'España · cotiza desde 1971',     realName: 'Banco Popular',
    risk: 'extrema', group: 'empresa', fromYear: 1971, fromHalf: 0, untilYear: 2017, untilHalf: 0, finalReturn: -1 },
];

export const ASSET_IDS = ASSETS.map((a) => a.id);
export const assetMeta = Object.fromEntries(ASSETS.map((a) => [a.id, a])) as Record<AssetId, AssetMeta>;
export const STOCK_IDS = ASSETS.filter((a) => a.group === 'empresa').map((a) => a.id) as StockId[];

/** Companies that made their holders rich; the draw guarantees at least one. */
export const STAR_STOCKS: StockId[] = ['e_apple', 'e_msft', 'e_amzn', 'e_nvda', 'e_itx'];

/** Companies that ended in a wipe-out or a near-total loss. */
export const DOOMED_STOCKS: StockId[] = ['e_terra', 'e_enron', 'e_popular'];

/** Semesters since year 0, so two (year, half) pairs can be compared directly. */
const rank = (year: number, half: number): number => year * 2 + half;

export function isAvailable(a: AssetMeta, year: number, half: Half): boolean {
  const now = rank(year, half);
  if (now < rank(a.fromYear, a.fromHalf)) return false;
  if (a.untilYear !== undefined) return now <= rank(a.untilYear, a.untilHalf ?? 1);
  return true;
}
