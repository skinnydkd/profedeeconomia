/**
 * Deposit creation by the banking system, round by round.
 *
 * A deposit of `deposito` arrives at a bank. The bank keeps a fraction `r`
 * (coeficiente de caja) as reserves and lends the rest. Of every loan the
 * public keeps a fraction `f` in cash and pays the rest to someone who
 * deposits it again, so each round is smaller than the last by a factor
 * (1 − r)(1 − f).
 *
 * With f = 0 this collapses to the textbook multiplier 1/r. The general form
 * is the same as the (1 + c) / (r + c) written in most manuals, with
 * f = c / (1 + c); expressing the drain as «how much of each loan stays in
 * cash» is the version a student can act out with the rounds table in front.
 */
export interface Ronda {
  /** 1-indexed: round 1 is the original deposit. */
  n: number;
  deposito: number;
  reservas: number;
  prestamo: number;
  /** Part of the loan that stays as cash and never comes back as a deposit. */
  efectivo: number;
}

export interface Creacion {
  valido: boolean;
  /** Deposits created per euro of the original deposit. */
  multiplicador: number;
  depositosTotales: number;
  reservasTotales: number;
  prestamosTotales: number;
  efectivoTotal: number;
  /** Deposits beyond the original one: the money the system actually created. */
  dineroCreado: number;
  /** Deposits plus cash in the public's hands. */
  ofertaMonetaria: number;
}

const ratioValido = (x: number) => Number.isFinite(x) && x >= 0 && x <= 1;

/** Closed form for the whole process. `r` and `f` are fractions, not percentages. */
export function creacion(deposito: number, r: number, f = 0): Creacion {
  const vacio: Creacion = {
    valido: false, multiplicador: NaN, depositosTotales: NaN, reservasTotales: NaN,
    prestamosTotales: NaN, efectivoTotal: NaN, dineroCreado: NaN, ofertaMonetaria: NaN,
  };
  if (!Number.isFinite(deposito) || deposito <= 0) return vacio;
  if (!ratioValido(r) || !ratioValido(f)) return vacio;

  const factor = (1 - r) * (1 - f);
  // r = 0 and f = 0 means nothing ever leaves the loop: the series diverges.
  if (factor >= 1) return vacio;

  const multiplicador = 1 / (1 - factor);
  const depositosTotales = deposito * multiplicador;
  const prestamosTotales = depositosTotales * (1 - r);
  return {
    valido: true,
    multiplicador,
    depositosTotales,
    reservasTotales: depositosTotales * r,
    prestamosTotales,
    efectivoTotal: prestamosTotales * f,
    dineroCreado: depositosTotales - deposito,
    ofertaMonetaria: depositosTotales + prestamosTotales * f,
  };
}

/** The first `n` rounds, for the table the students fill in by hand. */
export function rondas(deposito: number, r: number, f = 0, n = 6): Ronda[] {
  if (!creacion(deposito, r, f).valido) return [];
  const factor = (1 - r) * (1 - f);
  const filas: Ronda[] = [];
  let d = deposito;
  for (let i = 1; i <= n; i++) {
    const prestamo = d * (1 - r);
    filas.push({ n: i, deposito: d, reservas: d * r, prestamo, efectivo: prestamo * f });
    d = prestamo * (1 - f);
    if (d < 1e-9) break;
  }
  return filas;
}

/** Reserve ratio implied by a target multiplier, for working the problem backwards. */
export function coeficientePara(multiplicador: number): number {
  if (!Number.isFinite(multiplicador) || multiplicador < 1) return NaN;
  return 1 / multiplicador;
}
