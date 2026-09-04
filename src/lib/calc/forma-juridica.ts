/**
 * Comparing the basic legal forms of a Spanish business on the three things
 * that actually decide the choice: liability, capital and how the profit is
 * taxed.
 *
 * On tax, the module deliberately compares *structures*, not a definitive tax
 * bill: an empresario individual pays IRPF on a progressive scale, while a
 * sociedad pays a flat Impuesto de Sociedades on its profit. The interesting
 * teaching result is the profit at which the flat rate stops being worse than
 * the progressive scale — the crossover.
 *
 * The IS rate is an INPUT, not a constant: rates and reduced regimes for small
 * entities change, and this module must not assert one. The caller supplies it
 * and the UI says where to check it. For the IRPF side we reuse the state scale
 * already vetted in irpf.ts, with the same caveat it carries: the autonomous
 * community half of the scale is not modelled.
 */
import { ESCALA_IRPF_2026, type TramoEscala } from './irpf';

export type FormaId = 'autonomo' | 'sl' | 'cooperativa' | 'comunidad-bienes';

export interface Forma {
  id: FormaId;
  /** Does the owner answer with personal assets beyond what was put in? */
  responsabilidadIlimitada: boolean;
  /** Minimum share capital required to constitute, in euros. */
  capitalMinimo: number;
  /** Does the entity have legal personality separate from its members? */
  personalidadJuridica: boolean;
  /** Profit taxed on the owner's IRPF ('irpf') or on the entity ('sociedades'). */
  tributacion: 'irpf' | 'sociedades';
  /** Minimum number of founders. */
  sociosMinimos: number;
}

/**
 * Structural facts, not rates: these come from the Código de Comercio, the Ley
 * de Sociedades de Capital and the Ley de Cooperativas, and they do not change
 * from one Budget to the next the way tax rates do.
 */
export const FORMAS: Record<FormaId, Forma> = {
  autonomo: {
    id: 'autonomo', responsabilidadIlimitada: true, capitalMinimo: 0,
    personalidadJuridica: false, tributacion: 'irpf', sociosMinimos: 1,
  },
  'comunidad-bienes': {
    id: 'comunidad-bienes', responsabilidadIlimitada: true, capitalMinimo: 0,
    personalidadJuridica: false, tributacion: 'irpf', sociosMinimos: 2,
  },
  sl: {
    id: 'sl', responsabilidadIlimitada: false, capitalMinimo: 1,
    personalidadJuridica: true, tributacion: 'sociedades', sociosMinimos: 1,
  },
  cooperativa: {
    id: 'cooperativa', responsabilidadIlimitada: false, capitalMinimo: 0,
    personalidadJuridica: true, tributacion: 'sociedades', sociosMinimos: 2,
  },
};

/** Tax due on a taxable base under a bracket scale. */
export function cuotaEscala(base: number, escala: TramoEscala[] = ESCALA_IRPF_2026): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  return escala.reduce((acc, tr) => {
    const enTramo = Math.min(base, tr.hasta) - tr.desde;
    return enTramo > 0 ? acc + enTramo * tr.tipo : acc;
  }, 0);
}

export interface Comparacion {
  valido: boolean;
  beneficio: number;
  /** Tax if the profit is taxed on the owner's IRPF scale. */
  cuotaIRPF: number;
  /** Tax if the profit is taxed at the flat corporate rate. */
  cuotaIS: number;
  /** Effective average rate under each route. */
  tipoMedioIRPF: number;
  tipoMedioIS: number;
  /** Positive when the corporate route pays less at this profit. */
  ahorroSociedad: number;
  /**
   * Profit above which the flat rate costs less than the progressive scale,
   * or NaN when the flat rate never wins within the searched range.
   */
  beneficioDeCorte: number;
}

/**
 * Where the flat rate overtakes the scale. Solved by bisection on the sign of
 * (cuotaIRPF − cuotaIS), which is monotonic because the IRPF average rate
 * rises with the base while the flat rate does not.
 */
export function puntoDeCorte(tipoIS: number, escala: TramoEscala[] = ESCALA_IRPF_2026, max = 1_000_000): number {
  if (!Number.isFinite(tipoIS) || tipoIS < 0 || tipoIS > 1) return NaN;
  const dif = (b: number) => cuotaEscala(b, escala) - b * tipoIS;
  if (dif(max) <= 0) return NaN;
  let lo = 0, hi = max;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (dif(mid) > 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

export function comparar(
  beneficio: number,
  tipoIS: number,
  escala: TramoEscala[] = ESCALA_IRPF_2026,
): Comparacion {
  const vacio: Comparacion = {
    valido: false, beneficio: NaN, cuotaIRPF: NaN, cuotaIS: NaN,
    tipoMedioIRPF: NaN, tipoMedioIS: NaN, ahorroSociedad: NaN, beneficioDeCorte: NaN,
  };
  if (!Number.isFinite(beneficio) || beneficio < 0) return vacio;
  if (!Number.isFinite(tipoIS) || tipoIS < 0 || tipoIS > 1) return vacio;

  const cuotaIRPF = cuotaEscala(beneficio, escala);
  const cuotaIS = beneficio * tipoIS;

  return {
    valido: true,
    beneficio,
    cuotaIRPF,
    cuotaIS,
    tipoMedioIRPF: beneficio > 0 ? cuotaIRPF / beneficio : 0,
    tipoMedioIS: tipoIS,
    ahorroSociedad: cuotaIRPF - cuotaIS,
    beneficioDeCorte: puntoDeCorte(tipoIS, escala),
  };
}
