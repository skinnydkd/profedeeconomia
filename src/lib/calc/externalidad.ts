/**
 * Externalities and the Pigouvian correction, on linear curves.
 *
 * Inverse demand: P = A − B·Q          (private marginal benefit)
 * Private marginal cost: CMg = c + d·Q
 * External effect: a constant `e` per unit, a cost when the externality is
 * negative and a benefit when it is positive.
 *
 * The market clears where private benefit meets private cost. The social
 * optimum adds `e` to the side that bears it, and the gap between the two
 * quantities is the welfare triangle. Everything here is exact for straight
 * lines, which is the case a Bachillerato exercise works with.
 */
export type TipoExternalidad = 'negativa' | 'positiva';

export interface Curvas {
  /** Demand intercept: the price at which the first unit is demanded. */
  A: number;
  /** Demand slope (>0): how fast the price falls as quantity rises. */
  B: number;
  /** Marginal-cost intercept. */
  c: number;
  /** Marginal-cost slope (≥0). */
  d: number;
  /** Size of the external effect per unit (≥0). */
  e: number;
  tipo: TipoExternalidad;
}

export interface Punto {
  Q: number;
  /** Price on the demand curve at that quantity: what buyers pay. */
  P: number;
}

export interface Resultado {
  valido: boolean;
  privado: Punto;
  social: Punto;
  /** Price the sellers keep once the tax is paid (or once the subsidy is added). */
  precioProductor: number;
  /** The Pigouvian instrument: a tax when negative, a subsidy when positive. */
  instrumento: number;
  /** Welfare lost by producing the private quantity instead of the social one. */
  perdidaEficiencia: number;
  /** Tax collected, or subsidy paid, at the social quantity. */
  recaudacion: number;
  /** Units between the market outcome and the social optimum. */
  brecha: number;
}

function equilibrioLineal(A: number, B: number, c: number, d: number, desplazamiento: number): Punto {
  const pendiente = B + d;
  if (pendiente <= 0) return { Q: NaN, P: NaN };
  const Q = (A - c + desplazamiento) / pendiente;
  return { Q, P: A - B * Q };
}

export function analizar(curvas: Curvas): Resultado {
  const { A, B, c, d, e, tipo } = curvas;
  const vacio: Resultado = {
    valido: false,
    privado: { Q: NaN, P: NaN }, social: { Q: NaN, P: NaN },
    precioProductor: NaN, instrumento: e, perdidaEficiencia: NaN, recaudacion: NaN, brecha: NaN,
  };
  if (B <= 0 || d < 0 || e < 0) return vacio;

  const privado = equilibrioLineal(A, B, c, d, 0);
  if (!Number.isFinite(privado.Q) || privado.Q <= 0) return vacio;

  // A negative externality shifts the relevant cost up by e (fewer units are
  // worth producing); a positive one shifts the relevant benefit up by e.
  const social = equilibrioLineal(A, B, c, d, tipo === 'negativa' ? -e : e);
  // A subsidy large enough to drive the buyers' price below zero is off the
  // board rather than a corner worth drawing, so it is rejected like a
  // negative quantity.
  if (!Number.isFinite(social.Q) || social.Q < 0 || social.P < 0) return { ...vacio, privado };

  const brecha = Math.abs(privado.Q - social.Q);
  return {
    valido: true,
    privado,
    social,
    precioProductor: tipo === 'negativa' ? social.P - e : social.P + e,
    instrumento: e,
    // Triangle between the two quantities, height e: the units whose social
    // cost and social benefit are on the wrong side of each other.
    perdidaEficiencia: 0.5 * e * brecha,
    recaudacion: e * social.Q,
    brecha,
  };
}
