// src/lib/games/stonks/data/market.ts
/**
 * Annual total returns 1971-2025, as fractions (0.15 = +15 %).
 *
 * HOW TO READ THIS FILE — AND ITS LIMITS (design spec §7)
 *
 *   · All series are expressed FROM A SPANISH INVESTOR'S POINT OF VIEW: in
 *     pesetas before 1999 and euros after, converted at 166,386. Foreign
 *     assets are therefore UNHEDGED — the dollar's swings are included,
 *     because a Spanish saver really did carry them. The currency adjustment
 *     is approximate.
 *   · Equities and property are TOTAL RETURN (dividends and rents
 *     reinvested). Gold and bitcoin are price only. Deposits and public debt
 *     are the nominal return of the period.
 *   · REFERENCE SERIES: bolsa_es = Índice General de la Bolsa de Madrid to
 *     1991, IBEX 35 with dividends from 1992 · sp500 = S&P 500 TR ·
 *     mundial = MSCI World TR · deuda = Spanish 10-year sovereign ·
 *     deposito = average time-deposit rate · vivienda = average dwelling
 *     price (Ministerio de Vivienda / INE) plus an assumed rental yield.
 *   · FIGURES ARE ROUNDED AND NOT AUDITED against a primary source. They are
 *     faithful in direction and rough magnitude — which is what the game has
 *     to teach — and they are not investment data. Replacing this file with a
 *     verified CSV must not require touching engine.ts.
 *
 * `efectivo` is deliberately absent: semesterReturn always answers 0 for it.
 * That zero, against the CPI table, is the whole lesson of holding cash.
 */
import type { AssetId, Half } from '../types';
import { assetMeta } from './assets';

export const MARKET_FIRST_YEAR = 1971;
export const MARKET_LAST_YEAR = 2025;

export const ANNUAL: Record<number, Partial<Record<AssetId, number>>> = {
  // ── The inflationary seventies ─────────────────────────────────────────
  1971: { deposito: 0.060, deuda: 0.072, oro: 0.150, vivienda: 0.120, bolsa_es: 0.120, sp500: 0.140, mundial: 0.170, e_popular: 0.110 },
  1972: { deposito: 0.062, deuda: 0.074, oro: 0.450, vivienda: 0.140, bolsa_es: 0.250, sp500: 0.190, mundial: 0.220, e_popular: 0.280 },
  1973: { deposito: 0.075, deuda: 0.085, oro: 0.700, vivienda: 0.160, bolsa_es: 0.120, sp500: -0.150, mundial: -0.150, e_popular: 0.140 },
  1974: { deposito: 0.095, deuda: 0.105, oro: 0.650, vivienda: 0.170, bolsa_es: -0.080, sp500: -0.260, mundial: -0.250, e_popular: -0.100 },
  1975: { deposito: 0.100, deuda: 0.110, oro: -0.250, vivienda: 0.165, bolsa_es: -0.120, sp500: 0.370, mundial: 0.330, e_popular: -0.140 },
  1976: { deposito: 0.105, deuda: 0.115, oro: -0.040, vivienda: 0.170, bolsa_es: -0.300, sp500: 0.240, mundial: 0.140, e_popular: -0.320 },
  1977: { deposito: 0.135, deuda: 0.150, oro: 0.200, vivienda: 0.220, bolsa_es: -0.330, sp500: -0.070, mundial: 0.050, e_popular: -0.350 },
  1978: { deposito: 0.140, deuda: 0.155, oro: 0.300, vivienda: 0.195, bolsa_es: -0.080, sp500: 0.060, mundial: 0.180, e_popular: -0.060 },
  1979: { deposito: 0.135, deuda: 0.150, oro: 1.250, vivienda: 0.160, bolsa_es: -0.050, sp500: 0.180, mundial: 0.110, e_popular: -0.030 },
  1980: { deposito: 0.140, deuda: 0.155, oro: 0.150, vivienda: 0.155, bolsa_es: -0.020, sp500: 0.320, mundial: 0.260, e_popular: 0.000 },

  // ── Disinflation, and the great Spanish bull market of 1985-89 ─────────
  1981: { deposito: 0.145, deuda: 0.160, oro: -0.320, vivienda: 0.145, bolsa_es: -0.100, sp500: -0.050, mundial: -0.030, e_popular: -0.080, e_apple: -0.350 },
  1982: { deposito: 0.148, deuda: 0.165, oro: 0.150, vivienda: 0.140, bolsa_es: 0.030, sp500: 0.210, mundial: 0.110, e_popular: 0.060, e_apple: 0.750 },
  1983: { deposito: 0.140, deuda: 0.155, oro: -0.160, vivienda: 0.125, bolsa_es: 0.120, sp500: 0.220, mundial: 0.230, e_popular: 0.160, e_apple: -0.250 },
  1984: { deposito: 0.135, deuda: 0.150, oro: -0.190, vivienda: 0.115, bolsa_es: 0.420, sp500: 0.060, mundial: 0.050, e_popular: 0.480, e_apple: -0.300 },
  1985: { deposito: 0.120, deuda: 0.140, oro: 0.060, vivienda: 0.090, bolsa_es: 0.400, sp500: 0.320, mundial: 0.410, e_popular: 0.450, e_apple: -0.450 },
  1986: { deposito: 0.110, deuda: 0.130, oro: 0.190, vivienda: 0.150, bolsa_es: 1.100, sp500: 0.180, mundial: 0.420, e_popular: 1.200, e_apple: 1.250, e_msft: 0.500, e_enron: 0.100 },
  1987: { deposito: 0.105, deuda: 0.125, oro: 0.220, vivienda: 0.180, bolsa_es: 0.080, sp500: 0.050, mundial: 0.160, e_popular: 0.050, e_apple: 1.500, e_msft: 1.200, e_enron: 0.050 },
  1988: { deposito: 0.098, deuda: 0.118, oro: -0.150, vivienda: 0.220, bolsa_es: 0.250, sp500: 0.160, mundial: 0.240, e_popular: 0.300, e_apple: -0.050, e_msft: -0.030, e_enron: 0.150 },
  1989: { deposito: 0.105, deuda: 0.125, oro: -0.030, vivienda: 0.230, bolsa_es: 0.050, sp500: 0.310, mundial: 0.170, e_popular: 0.080, e_apple: -0.200, e_msft: 0.600, e_enron: 0.200 },
  1990: { deposito: 0.112, deuda: 0.132, oro: -0.030, vivienda: 0.120, bolsa_es: -0.220, sp500: -0.030, mundial: -0.170, e_popular: -0.200, e_apple: 0.500, e_msft: 0.730, e_enron: 0.100 },

  // ── Convergence towards the euro ───────────────────────────────────────
  1991: { deposito: 0.108, deuda: 0.128, oro: -0.100, vivienda: 0.040, bolsa_es: 0.170, sp500: 0.300, mundial: 0.190, e_popular: 0.200, e_apple: -0.100, e_msft: 1.220, e_enron: 0.150 },
  1992: { deposito: 0.105, deuda: 0.125, oro: -0.060, vivienda: 0.010, bolsa_es: -0.040, sp500: 0.070, mundial: -0.050, e_popular: -0.050, e_apple: -0.050, e_msft: 0.150, e_enron: 0.250 },
  1993: { deposito: 0.092, deuda: 0.180, oro: 0.170, vivienda: 0.005, bolsa_es: 0.540, sp500: 0.100, mundial: 0.230, e_popular: 0.600, e_apple: -0.450, e_msft: -0.060, e_enron: 0.180 },
  1994: { deposito: 0.075, deuda: -0.020, oro: -0.020, vivienda: 0.010, bolsa_es: -0.110, sp500: 0.010, mundial: 0.050, e_popular: -0.120, e_apple: 0.350, e_msft: 0.510, e_enron: -0.050, e_nokia: 0.900 },
  1995: { deposito: 0.082, deuda: 0.190, oro: 0.010, vivienda: 0.020, bolsa_es: 0.180, sp500: 0.370, mundial: 0.210, e_popular: 0.220, e_apple: -0.200, e_msft: 0.440, e_enron: 0.300, e_nokia: -0.250 },
  1996: { deposito: 0.062, deuda: 0.210, oro: -0.050, vivienda: 0.025, bolsa_es: 0.420, sp500: 0.230, mundial: 0.140, e_popular: 0.480, e_apple: -0.350, e_msft: 0.880, e_enron: 0.180, e_nokia: 0.800 },
  1997: { deposito: 0.045, deuda: 0.130, oro: -0.210, vivienda: 0.035, bolsa_es: 0.420, sp500: 0.330, mundial: 0.160, e_popular: 0.500, e_apple: -0.370, e_msft: 0.560, e_enron: 0.050, e_nokia: 2.500, e_amzn: 0.300 },
  1998: { deposito: 0.035, deuda: 0.110, oro: -0.010, vivienda: 0.060, bolsa_es: 0.380, sp500: 0.280, mundial: 0.250, e_popular: 0.300, e_apple: 2.120, e_msft: 1.150, e_enron: 0.380, e_nokia: 2.300, e_amzn: 9.660 },
  1999: { deposito: 0.028, deuda: -0.060, oro: 0.010, vivienda: 0.090, bolsa_es: 0.180, sp500: 0.210, mundial: 0.250, e_popular: -0.050, e_apple: 1.510, e_msft: 0.680, e_enron: 0.580, e_nokia: 2.200, e_amzn: 0.430, e_nvda: 2.300, e_terra: 1.800 },
  2000: { deposito: 0.038, deuda: 0.060, oro: 0.020, vivienda: 0.120, bolsa_es: -0.120, sp500: -0.090, mundial: -0.130, e_popular: 0.100, e_apple: -0.710, e_msft: -0.630, e_enron: 0.890, e_nokia: -0.250, e_amzn: -0.800, e_nvda: 0.900, e_terra: -0.700 },

  // ── Dot-com bust, housing boom, and the crash ──────────────────────────
  2001: { deposito: 0.038, deuda: 0.050, oro: 0.080, vivienda: 0.130, bolsa_es: -0.060, sp500: -0.120, mundial: -0.170, e_popular: 0.050, e_itx: 0.150, e_enron: -0.616, e_apple: 0.470, e_msft: 0.530, e_nokia: -0.250, e_amzn: -0.300, e_nvda: 2.300, e_terra: -0.550 },
  2002: { deposito: 0.032, deuda: 0.090, oro: 0.050, vivienda: 0.155, bolsa_es: -0.230, sp500: -0.220, mundial: -0.320, e_popular: -0.080, e_apple: -0.350, e_msft: -0.220, e_nokia: -0.500, e_amzn: 0.750, e_nvda: -0.900, e_terra: -0.550, e_itx: -0.180 },
  2003: { deposito: 0.025, deuda: 0.040, oro: 0.005, vivienda: 0.170, bolsa_es: 0.320, sp500: 0.290, mundial: 0.110, e_popular: 0.200, e_apple: 0.490, e_msft: 0.070, e_nokia: 0.150, e_amzn: 1.790, e_nvda: 1.600, e_terra: 0.250, e_itx: 0.120 },
  2004: { deposito: 0.022, deuda: 0.070, oro: -0.020, vivienda: 0.175, bolsa_es: 0.210, sp500: 0.110, mundial: 0.070, e_popular: 0.180, e_apple: 2.010, e_msft: 0.090, e_nokia: -0.400, e_amzn: 0.250, e_nvda: -0.200, e_terra: -0.100, e_itx: 0.320 },
  2005: { deposito: 0.023, deuda: 0.050, oro: 0.350, vivienda: 0.135, bolsa_es: 0.230, sp500: 0.050, mundial: 0.260, e_popular: 0.120, e_terra: -0.278, e_apple: 1.230, e_msft: -0.010, e_nokia: 0.250, e_amzn: 0.060, e_nvda: 0.800, e_itx: 0.300 },
  2006: { deposito: 0.030, deuda: 0.000, oro: 0.100, vivienda: 0.100, bolsa_es: 0.360, sp500: 0.160, mundial: 0.070, e_popular: 0.220, e_apple: 0.180, e_msft: 0.150, e_nokia: 0.100, e_amzn: 0.250, e_nvda: 1.000, e_itx: 0.250 },
  2007: { deposito: 0.042, deuda: 0.020, oro: 0.180, vivienda: 0.050, bolsa_es: 0.110, sp500: 0.050, mundial: -0.020, e_popular: -0.180, e_apple: 1.340, e_msft: 0.210, e_nokia: 0.900, e_amzn: 1.350, e_nvda: 0.500, e_itx: -0.130 },
  2008: { deposito: 0.048, deuda: 0.090, oro: 0.110, vivienda: -0.070, bolsa_es: -0.370, sp500: -0.370, mundial: -0.380, e_popular: -0.420, e_apple: -0.570, e_msft: -0.440, e_nokia: -0.600, e_amzn: -0.450, e_nvda: -0.760, e_itx: -0.250 },
  2009: { deposito: 0.022, deuda: 0.040, oro: 0.210, vivienda: -0.065, bolsa_es: 0.340, sp500: 0.260, mundial: 0.260, e_popular: -0.080, e_apple: 1.470, e_msft: 0.600, e_nokia: 0.050, e_amzn: 1.620, e_nvda: 1.300, e_itx: 0.750 },
  2010: { deposito: 0.018, deuda: -0.030, oro: 0.380, vivienda: -0.040, bolsa_es: -0.130, sp500: 0.150, mundial: 0.200, e_popular: -0.300, e_apple: 0.530, e_msft: -0.070, e_nokia: -0.250, e_amzn: 0.340, e_nvda: -0.030, e_itx: 0.380 },

  // ── Euro crisis, QE, and the long bull market ──────────────────────────
  2011: { deposito: 0.025, deuda: -0.060, oro: 0.140, vivienda: -0.110, bolsa_es: -0.070, sp500: 0.020, mundial: -0.020, e_popular: -0.400, e_apple: 0.260, e_msft: -0.050, e_nokia: -0.500, e_amzn: -0.040, e_nvda: -0.150, e_itx: 0.080, bitcoin: 14.000 },
  2012: { deposito: 0.028, deuda: 0.030, oro: 0.050, vivienda: -0.135, bolsa_es: -0.020, sp500: 0.160, mundial: 0.140, e_popular: -0.600, e_apple: 0.330, e_msft: 0.060, e_nokia: -0.100, e_amzn: 0.450, e_nvda: 0.050, e_itx: 0.650, bitcoin: 1.850 },
  2013: { deposito: 0.019, deuda: 0.110, oro: -0.310, vivienda: -0.050, bolsa_es: 0.270, sp500: 0.320, mundial: 0.210, e_popular: 0.100, e_apple: 0.080, e_msft: 0.440, e_nokia: 0.900, e_amzn: 0.590, e_nvda: 0.080, e_itx: 0.050, bitcoin: 54.000 },
  2014: { deposito: 0.011, deuda: 0.160, oro: 0.120, vivienda: 0.003, bolsa_es: 0.080, sp500: 0.140, mundial: 0.200, e_popular: -0.250, e_apple: 0.400, e_msft: 0.280, e_nokia: 0.200, e_amzn: -0.220, e_nvda: 0.260, e_itx: 0.060, bitcoin: -0.580 },
  2015: { deposito: 0.006, deuda: 0.020, oro: -0.003, vivienda: 0.011, bolsa_es: -0.030, sp500: 0.010, mundial: 0.110, e_popular: -0.300, e_apple: -0.030, e_msft: 0.230, e_nokia: -0.100, e_amzn: 1.180, e_nvda: 0.650, e_itx: 0.370, bitcoin: 0.350 },
  2016: { deposito: 0.003, deuda: 0.050, oro: 0.120, vivienda: 0.015, bolsa_es: 0.020, sp500: 0.120, mundial: 0.110, e_popular: -0.650, e_apple: 0.120, e_msft: 0.150, e_nokia: -0.350, e_amzn: 0.110, e_nvda: 2.240, e_itx: -0.030, bitcoin: 1.200 },
  2017: { deposito: 0.002, deuda: 0.010, oro: -0.010, vivienda: 0.024, bolsa_es: 0.110, sp500: 0.220, mundial: 0.080, e_apple: 0.460, e_msft: 0.410, e_nokia: -0.050, e_amzn: 0.560, e_nvda: 0.820, e_itx: -0.090, bitcoin: 13.000 },
  2018: { deposito: 0.002, deuda: 0.020, oro: 0.030, vivienda: 0.034, bolsa_es: -0.110, sp500: -0.040, mundial: -0.040, e_apple: -0.070, e_msft: 0.210, e_nokia: 0.250, e_amzn: 0.280, e_nvda: -0.310, e_itx: -0.080, bitcoin: -0.730 },
  2019: { deposito: 0.001, deuda: 0.090, oro: 0.210, vivienda: 0.032, bolsa_es: 0.160, sp500: 0.310, mundial: 0.300, e_apple: 0.890, e_msft: 0.580, e_nokia: -0.300, e_amzn: 0.230, e_nvda: 0.770, e_itx: 0.400, bitcoin: 0.900 },
  2020: { deposito: 0.001, deuda: 0.060, oro: 0.140, vivienda: -0.018, bolsa_es: -0.120, sp500: 0.180, mundial: 0.060, e_apple: 0.810, e_msft: 0.430, e_nokia: 0.050, e_amzn: 0.760, e_nvda: 1.220, e_itx: -0.030, bitcoin: 2.900 },

  // ── Inflation returns ──────────────────────────────────────────────────
  2021: { deposito: 0.001, deuda: -0.020, oro: 0.030, vivienda: 0.050, bolsa_es: 0.120, sp500: 0.290, mundial: 0.320, e_apple: 0.340, e_msft: 0.530, e_nokia: 0.450, e_amzn: 0.020, e_nvda: 1.250, e_itx: 0.030, bitcoin: 0.650 },
  2022: { deposito: 0.006, deuda: -0.150, oro: 0.060, vivienda: 0.070, bolsa_es: -0.020, sp500: -0.180, mundial: -0.130, e_apple: -0.260, e_msft: -0.240, e_nokia: -0.200, e_amzn: -0.500, e_nvda: -0.500, e_itx: -0.220, bitcoin: -0.640 },
  2023: { deposito: 0.025, deuda: 0.080, oro: 0.090, vivienda: 0.045, bolsa_es: 0.280, sp500: 0.260, mundial: 0.200, e_apple: 0.480, e_msft: 0.580, e_nokia: -0.250, e_amzn: 0.810, e_nvda: 2.390, e_itx: 0.600, bitcoin: 1.500 },
  2024: { deposito: 0.027, deuda: 0.030, oro: 0.350, vivienda: 0.080, bolsa_es: 0.200, sp500: 0.250, mundial: 0.260, e_apple: 0.300, e_msft: 0.140, e_nokia: 0.250, e_amzn: 0.440, e_nvda: 1.710, e_itx: 0.180, bitcoin: 1.150 },
  2025: { deposito: 0.020, deuda: 0.020, oro: 0.400, vivienda: 0.090, bolsa_es: 0.350, sp500: 0.150, mundial: 0.120, e_apple: 0.120, e_msft: 0.180, e_nokia: 0.300, e_amzn: 0.100, e_nvda: 0.400, e_itx: 0.050, bitcoin: 0.250 },
};

/**
 * Intra-year shape for the years where WHEN it happened is the lesson
 * (design spec §7.1). Only the FIRST half is stored; semesterReturn derives
 * the second from the annual figure, so the invariant
 *
 *     (1 + h1) · (1 + h2) = 1 + annual
 *
 * holds by construction and cannot be broken by a typo. Without these, 2020
 * would read "+8,6 % and +8,6 %" and quietly erase the March crash.
 */
export const FIRST_HALF: Record<number, Partial<Record<AssetId, number>>> = {
  // First oil shock: the crash arrives with the Yom Kippur war, in the autumn.
  1973: { sp500: -0.030, mundial: -0.040, bolsa_es: 0.110, oro: 0.400 },
  1974: { sp500: -0.120, mundial: -0.110, bolsa_es: 0.010, oro: 0.500 },
  // Black Monday is October 1987: the year was strongly up until then.
  1987: { sp500: 0.240, mundial: 0.290, bolsa_es: 0.310, e_apple: 0.900 },
  // The dot-com peak is March 2000; the collapse fills the rest of the year.
  2000: { sp500: 0.010, mundial: -0.010, e_nvda: 0.750, e_amzn: -0.400, e_terra: -0.200, e_apple: -0.130, e_msft: -0.360 },
  // Bear Stearns in March, Lehman in September: the second half was far worse.
  2008: { sp500: -0.115, mundial: -0.120, bolsa_es: -0.140, e_popular: -0.170, oro: 0.080 },
  // Covid: roughly -34 % peak to trough in March, then a V-shaped recovery.
  2020: { sp500: -0.040, mundial: -0.062, bolsa_es: -0.240, e_nvda: 0.450, e_amzn: 0.490 },
  // The rate shock hit bonds first and hardest, in the first half.
  2022: { deuda: -0.115, sp500: -0.200, mundial: -0.180, bitcoin: -0.560 },
};

/** Geometric halves: the default when a year carries no explicit shape. */
const geometricHalf = (annual: number): number => Math.sqrt(1 + annual) - 1;

/** Semesters since year 0, so two (year, half) pairs can be compared directly. */
const rank = (year: number, half: number): number => year * 2 + half;

/**
 * Return for one semester. `null` means the asset did not trade then, which
 * the UI renders as a locked row rather than as a zero.
 */
export function semesterReturn(id: AssetId, year: number, half: Half): number | null {
  const meta = assetMeta[id];
  if (!meta) return null;
  if (id === 'efectivo') return 0;

  const now = rank(year, half);
  if (now < rank(meta.fromYear, meta.fromHalf)) return null;

  if (meta.untilYear !== undefined) {
    const last = rank(meta.untilYear, meta.untilHalf ?? 1);
    if (now > last) return null;
    // A company's last semester is its collapse, whatever the market did.
    if (now === last) return meta.finalReturn ?? null;
  }

  const annual = ANNUAL[year]?.[id];
  if (annual === undefined) return null;

  const h1 = FIRST_HALF[year]?.[id];
  if (h1 === undefined) return geometricHalf(annual);
  return half === 0 ? h1 : (1 + annual) / (1 + h1) - 1;
}
