// src/lib/games/stonks/data/inflation.ts
/**
 * Spanish annual CPI (IPC general, variación media anual), 1971-2025, as
 * fractions: 0.145 = +14,5 %.
 *
 * SOURCE OF REFERENCE: INE, índice de precios de consumo, media anual. The
 * pre-1977 figures come from the retrospective series (the modern IPC base
 * starts later), so they are indicative of magnitude rather than official.
 *
 * FIGURES ARE ROUNDED TO ONE DECIMAL AND ARE NOT AUDITED against the INE
 * series — see the design spec §7. They are faithful in direction and rough
 * magnitude, which is what the game's lesson needs; they are not statistics.
 * Replacing this file with a verified CSV must not require any change to
 * engine.ts or money.ts.
 *
 * Why this table exists at all: without it a player who hid in deposits from
 * 1974 to 1982 would be told they had won, having lost roughly half their
 * purchasing power.
 */
export const CPI: Record<number, number> = {
  // The inflationary decade: two oil shocks and the Moncloa Pacts.
  1971: 0.082, 1972: 0.083, 1973: 0.114, 1974: 0.157, 1975: 0.170,
  1976: 0.176, 1977: 0.245, 1978: 0.198, 1979: 0.157, 1980: 0.156,
  1981: 0.146, 1982: 0.144, 1983: 0.122, 1984: 0.113, 1985: 0.088,
  // Disinflation towards the convergence criteria and the euro.
  1986: 0.088, 1987: 0.052, 1988: 0.048, 1989: 0.068, 1990: 0.067,
  1991: 0.059, 1992: 0.059, 1993: 0.046, 1994: 0.047, 1995: 0.047,
  1996: 0.036, 1997: 0.020, 1998: 0.018, 1999: 0.023, 2000: 0.034,
  // The euro years: low and stable, then the crisis and its deflation.
  2001: 0.036, 2002: 0.035, 2003: 0.030, 2004: 0.030, 2005: 0.034,
  2006: 0.035, 2007: 0.028, 2008: 0.041, 2009: -0.003, 2010: 0.018,
  2011: 0.032, 2012: 0.024, 2013: 0.014, 2014: -0.001, 2015: -0.005,
  2016: -0.002, 2017: 0.020, 2018: 0.017, 2019: 0.007, 2020: -0.003,
  // The return of inflation.
  2021: 0.031, 2022: 0.084, 2023: 0.035, 2024: 0.028, 2025: 0.024,
};

export const CPI_FIRST_YEAR = 1971;
export const CPI_LAST_YEAR = 2025;
