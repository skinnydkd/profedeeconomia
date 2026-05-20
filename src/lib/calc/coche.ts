/**
 * Coste de tener coche propio vs. una alternativa de movilidad — pure,
 * unit-tested logic for Eco 4ESO (decisiones de consumo / economía personal).
 *
 * Teaching goal: surface the *hidden* costs of owning a car. Pupils tend to
 * think only about fuel, but depreciation, insurance, maintenance, taxes and
 * parking usually dwarf it. The model compares the total annual cost (and the
 * cost per km) of a private car against a mix of public transport season pass,
 * occasional car rental / car-sharing and taxi rides.
 *
 *   Depreciación anual = precioCompra / añosVidaUtil
 *   Combustible anual  = (kmAnuales / 100) · consumoL100 · precioCombustible
 *   Coste total coche  = depreciación + combustible + fijos
 *   Coste por km       = coste total / kmAnuales        [si kmAnuales > 0]
 *
 * Money is in euros, distances in km. All inputs have realistic Spanish
 * defaults at the UI layer but the logic itself is data-agnostic.
 */

/** Inputs describing the cost of owning and running a private car for a year. */
export interface OpcionesCoche {
  /** Purchase price of the car, in euros. */
  precioCompra: number;
  /** Useful life over which the purchase is depreciated, in years. */
  anosVidaUtil: number;
  /** Kilometres driven per year. */
  kmAnuales: number;
  /** Fuel consumption in litres per 100 km. */
  consumoL100: number;
  /** Fuel price, in euros per litre. */
  precioCombustible: number;
  /** Annual insurance premium, in euros. */
  seguro: number;
  /** Annual maintenance + repairs + tyres, in euros. */
  mantenimiento: number;
  /** Annual taxes (e.g. impuesto de circulación / IVTM), in euros. */
  impuestos: number;
  /** Annual parking (garage, residential permit…), in euros. */
  aparcamiento: number;
  /** Any other recurring fixed cost (ITV amortised, tolls…), in euros. */
  otrosFijos?: number;
}

/** Breakdown of the annual cost of owning a car. */
export interface ResultadoCoche {
  /** Annual depreciation: precioCompra / añosVidaUtil. */
  depreciacion: number;
  /** Annual fuel cost. */
  combustible: number;
  /** Sum of the fixed costs (insurance, maintenance, taxes, parking, other). */
  fijos: number;
  /** Total annual cost: depreciación + combustible + fijos. */
  total: number;
  /** Cost per km (total / kmAnuales); null when kmAnuales <= 0. */
  costePorKm: number | null;
}

/** Inputs describing the cost of the car-free alternative for a year. */
export interface OpcionesAlternativa {
  /** Monthly public-transport season pass, in euros. */
  abonoTransporteMensual: number;
  /** Average taxi / VTC rides per month. */
  viajesTaxiMes: number;
  /** Average cost of a taxi / VTC ride, in euros. */
  costeMedioTaxi: number;
  /** Days of occasional car rental / car-sharing per year. */
  alquilerPuntualDias: number;
  /** Cost of one rental / car-sharing day, in euros. */
  costeAlquilerDia: number;
  /** Any other recurring annual cost (bike upkeep, etc.), in euros. */
  otrosAnuales?: number;
}

/** Breakdown of the annual cost of the alternative. */
export interface ResultadoAlternativa {
  /** Annual cost of the public-transport season pass. */
  transporte: number;
  /** Annual cost of taxi / VTC rides. */
  taxi: number;
  /** Annual cost of occasional rental / car-sharing. */
  alquiler: number;
  /** Sum of any other annual costs. */
  otros: number;
  /** Total annual cost. */
  total: number;
}

/** Result of comparing the car against the alternative. */
export interface ResultadoComparacion {
  /** Total annual cost of the car. */
  totalCoche: number;
  /** Total annual cost of the alternative. */
  totalAlternativa: number;
  /**
   * Annual saving of choosing the cheaper option (always >= 0). It is the
   * absolute difference between both totals.
   */
  diferenciaAnual: number;
  /** Which option is cheaper for the given kilometres. */
  opcionMasBarata: 'coche' | 'alternativa' | 'empate';
  /**
   * Break-even kilometres per year at which both options cost the same,
   * keeping every other input fixed. null when there is no positive
   * crossover (e.g. the per-km fuel cost is 0 or the alternative is already
   * cheaper than the car's fixed-only cost at any mileage).
   */
  kmEquilibrio: number | null;
}

const sum = (...xs: number[]) => xs.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

/**
 * Annual cost of owning and running a private car, broken down into
 * depreciation, fuel and fixed costs, plus the resulting cost per km.
 */
export function costeCocheAnual(opciones: OpcionesCoche): ResultadoCoche {
  const {
    precioCompra,
    anosVidaUtil,
    kmAnuales,
    consumoL100,
    precioCombustible,
    seguro,
    mantenimiento,
    impuestos,
    aparcamiento,
    otrosFijos = 0,
  } = opciones;

  const depreciacion = anosVidaUtil > 0 ? precioCompra / anosVidaUtil : 0;
  const combustible = (Math.max(0, kmAnuales) / 100) * consumoL100 * precioCombustible;
  const fijos = sum(seguro, mantenimiento, impuestos, aparcamiento, otrosFijos);
  const total = depreciacion + combustible + fijos;
  const costePorKm = kmAnuales > 0 ? total / kmAnuales : null;

  return { depreciacion, combustible, fijos, total, costePorKm };
}

/**
 * Annual cost of the car-free alternative: public-transport pass + taxi rides
 * + occasional rental / car-sharing + any other recurring annual cost.
 */
export function costeAlternativaAnual(opciones: OpcionesAlternativa): ResultadoAlternativa {
  const {
    abonoTransporteMensual,
    viajesTaxiMes,
    costeMedioTaxi,
    alquilerPuntualDias,
    costeAlquilerDia,
    otrosAnuales = 0,
  } = opciones;

  const transporte = abonoTransporteMensual * 12;
  const taxi = viajesTaxiMes * costeMedioTaxi * 12;
  const alquiler = alquilerPuntualDias * costeAlquilerDia;
  const otros = Number.isFinite(otrosAnuales) ? otrosAnuales : 0;
  const total = transporte + taxi + alquiler + otros;

  return { transporte, taxi, alquiler, otros, total };
}

/**
 * Compare the car against the alternative for a given mileage and report the
 * annual difference, the cheaper option and the break-even kilometres.
 *
 * Break-even logic: the alternative is modelled as mileage-independent (the
 * defaults already bundle taxi/rental), while the car cost is
 *   coche(km) = costesFijos + variableCochePorKm · km
 * where costesFijos = depreciación + fijos and variableCochePorKm is the fuel
 * cost per km. Solving coche(km) = totalAlternativa gives the crossover.
 */
export function compararMovilidad(
  coche: ResultadoCoche & { kmAnuales: number; consumoL100: number; precioCombustible: number },
  alternativa: ResultadoAlternativa
): ResultadoComparacion {
  const totalCoche = coche.total;
  const totalAlternativa = alternativa.total;
  const diferenciaAnual = Math.abs(totalCoche - totalAlternativa);

  let opcionMasBarata: ResultadoComparacion['opcionMasBarata'];
  if (Math.abs(totalCoche - totalAlternativa) < 1e-9) opcionMasBarata = 'empate';
  else opcionMasBarata = totalCoche < totalAlternativa ? 'coche' : 'alternativa';

  // Fixed (mileage-independent) part of the car cost and its variable per-km
  // fuel cost. costesFijos = total − combustible; variable = combustible/km.
  const costesFijosCoche = totalCoche - coche.combustible;
  const variableCochePorKm = (coche.consumoL100 / 100) * coche.precioCombustible;

  let kmEquilibrio: number | null = null;
  if (variableCochePorKm > 0) {
    const km = (totalAlternativa - costesFijosCoche) / variableCochePorKm;
    if (Number.isFinite(km) && km > 0) kmEquilibrio = km;
  }

  return { totalCoche, totalAlternativa, diferenciaAnual, opcionMasBarata, kmEquilibrio };
}
