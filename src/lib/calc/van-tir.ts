/**
 * VAN and TIR of an investment — pure, unit-tested logic for the VAN/TIR
 * calculator (EDMN 2BACH, Unit 9).
 *
 *   VAN(r) = −I₀ + Σ Fₜ / (1 + r)ᵗ
 *   TIR    = the rate r at which VAN(r) = 0
 *
 * A single TIR is only guaranteed when the cash flows change sign once (−I₀
 * followed by positive flows). With x = 1 / (1 + r) the VAN is a polynomial in
 * x, and by Descartes' rule of signs it has at most as many positive roots as
 * sign changes, possibly fewer by an even number. So [−100, 230, −132] has two
 * TIRs (10 % and 20 %), and [−100.000, 50.000, 50.000, 50.000, −60.000] has
 * none. The TIR is therefore searched on a grid of rates instead of by one
 * bisection between two fixed ends, which could only answer "no converge".
 */

export function van(inversion: number, flujos: readonly number[], r: number): number {
  return -inversion + flujos.reduce((acc, f, i) => acc + f / Math.pow(1 + r, i + 1), 0);
}

/** Sign changes along the cash flows −I₀, F₁ … Fₙ; zeros are skipped. */
export function cambiosDeSigno(inversion: number, flujos: readonly number[]): number {
  let cambios = 0;
  let previo = 0;
  for (const f of [-inversion, ...flujos]) {
    if (f === 0) continue;
    const signo = Math.sign(f);
    if (previo !== 0 && signo !== previo) cambios++;
    previo = signo;
  }
  return cambios;
}

/** Lowest rate searched: −99 %. */
export const TIR_MIN = -0.99;
/** Highest rate searched: 10.000 %. The search only goes past 500 % when the VAN is still positive there. */
export const TIR_MAX = 100;

export type ResultadoTIR =
  | { tipo: 'unica'; tir: number }
  | { tipo: 'varias'; tirs: number[] }
  | { tipo: 'ninguna' }
  | { tipo: 'fueraDeRango'; lado: 'inferior' | 'superior' };

/** Bisection inside a bracket whose ends have opposite signs. */
function biseccion(f: (r: number) => number, a: number, b: number, fa: number): number {
  for (let i = 0; i < 200 && b - a > 1e-12; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (fm === 0) return m;
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

/** Roots of f between consecutive points of `malla`, found through sign changes. */
function raices(f: (r: number) => number, malla: readonly number[]): number[] {
  const encontradas: number[] = [];
  let a = malla[0];
  let fa = f(a);
  if (fa === 0) encontradas.push(a);
  for (let i = 1; i < malla.length; i++) {
    const b = malla[i];
    const fb = f(b);
    if (fb === 0) encontradas.push(b);
    else if (fa !== 0 && Math.sign(fa) !== Math.sign(fb)) encontradas.push(biseccion(f, a, b, fa));
    a = b;
    fa = fb;
  }
  return encontradas;
}

/** Evenly spaced points from a to b (both included). */
function tramo(a: number, b: number, pasos: number): number[] {
  return Array.from({ length: pasos + 1 }, (_, i) => a + ((b - a) * i) / pasos);
}

/**
 * Every TIR of the investment between −99 % and 10.000 %.
 *
 * The VAN is scanned every 0,1 points from −99 % to 100 % and every point up
 * to 500 %. When it is still positive at 500 % there is a root further up
 * (the VAN tends to −I₀ as the rate grows), so the scan goes on, doubling the
 * upper end up to 10.000 %. When nothing is found, the signs of the VAN at
 * both ends tell a TIR that lies outside the range from one that does not
 * exist.
 */
export function calcularTIR(inversion: number, flujos: readonly number[]): ResultadoTIR {
  const serie = [-inversion, ...flujos];
  if (!serie.every(Number.isFinite) || cambiosDeSigno(inversion, flujos) === 0) {
    return { tipo: 'ninguna' };
  }
  const f = (r: number) => van(inversion, flujos, r);
  const noNulos = serie.filter((x) => x !== 0);
  // Sign of the VAN as r → ∞ (the first flow dominates) and as r → −100 % (the last one does).
  const signoInfinito = Math.sign(noNulos[0]);
  const signoMenos100 = Math.sign(noNulos[noNulos.length - 1]);

  const malla = [
    ...Array.from({ length: 1991 }, (_, i) => (i - 990) / 1000), // −99 % … 100 %, every 0,1 points
    ...Array.from({ length: 400 }, (_, i) => (i + 101) / 100), // 101 % … 500 %, every point
  ];
  const tirs = raices(f, malla);
  let hi = malla[malla.length - 1];
  while (Math.sign(f(hi)) !== signoInfinito && hi < TIR_MAX) {
    const siguiente = Math.min(hi * 2, TIR_MAX);
    tirs.push(...raices(f, tramo(hi, siguiente, 200)).filter((r) => r > hi));
    hi = siguiente;
  }

  if (tirs.length === 1) return { tipo: 'unica', tir: tirs[0] };
  if (tirs.length > 1) return { tipo: 'varias', tirs };
  if (Math.sign(f(TIR_MIN)) !== signoMenos100) return { tipo: 'fueraDeRango', lado: 'inferior' };
  if (Math.sign(f(hi)) !== signoInfinito) return { tipo: 'fueraDeRango', lado: 'superior' };
  return { tipo: 'ninguna' };
}
