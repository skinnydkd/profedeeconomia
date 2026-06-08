/**
 * Business Game — motor de mercado.
 *
 * Núcleo del simulador de empresa de curso completo: cada ronda, varias
 * empresas (equipos) compiten en un mercado compartido. Reparte la demanda
 * según el atractivo RELATIVO de cada oferta (calidad, marketing y precio) y
 * calcula ventas, costes y beneficio.
 *
 * Es lógica pura y determinista: dadas las decisiones de todos los equipos y los
 * parámetros del mercado, devuelve los resultados de la ronda. Así se puede
 * testear y ajustar el modelo sin tocar interfaz ni base de datos.
 *
 * Todos los pesos y costes son parámetros (`MarketParams`) para que el profesor
 * pueda calibrar la dificultad y el comportamiento del mercado.
 */

/** Parámetros del mercado, fijados por el profesor al crear la liga. */
export interface MarketParams {
  /** Demanda total del mercado en la ronda 1 (unidades). */
  demandaBase: number;
  /** Crecimiento de la demanda total por ronda (0.05 = +5 % cada año). */
  crecimientoDemanda: number;
  /** Pesos del atractivo: deben sumar 1 (se normalizan si no). */
  pesoCalidad: number;
  pesoMarketing: number;
  pesoPrecio: number;
  /** Precio de referencia del mercado (€/unidad); ancla del atractivo-precio. */
  precioReferencia: number;
  /** Coste fijo por ronda (€). */
  costeFijo: number;
  /** Coste variable unitario base (€/unidad), antes de mejoras de productividad. */
  costeVariableBase: number;
  /** Coste de almacenar una unidad no vendida (€/unidad). */
  costeStock: number;
  /** Tipo de interés del préstamo por ronda (0.08 = 8 %). */
  interesPrestamo: number;
}

/** Decisiones de un equipo en una ronda, una por área. */
export interface TeamDecision {
  /** Comercial: precio de venta (€/unidad). */
  precio: number;
  /** Comercial: gasto en marketing/publicidad (€). */
  marketing: number;
  /** Operaciones: unidades a producir. */
  produccion: number;
  /** Operaciones: inversión en calidad del producto (€). */
  calidad: number;
  /** RR. HH.: inversión en plantilla, formación y salarios (€). */
  rrhh: number;
  /** Finanzas: préstamo solicitado esta ronda (€). */
  prestamo: number;
}

/** Estado acumulado de un equipo entre rondas. */
export interface TeamState {
  /** Caja acumulada (€); puede ser negativa (descubierto). */
  caja: number;
  /** Beneficio acumulado de todas las rondas (€). Es el marcador del ranking. */
  beneficioAcumulado: number;
  /** Deuda viva acumulada por los préstamos (€). */
  deuda: number;
}

export interface TeamInput {
  id: string;
  nombre: string;
  estado: TeamState;
  decision: TeamDecision;
}

/** Resultado de un equipo tras simular la ronda. */
export interface RoundResult {
  id: string;
  nombre: string;
  /** Nivel de calidad resultante (0-100). */
  calidad: number;
  /** Coste variable unitario tras la mejora de productividad por RR. HH. (€). */
  costeVariableUnitario: number;
  /** Puntuación de atractivo (relativa, sin unidad). */
  atractivo: number;
  /** Cuota de demanda del mercado (0-1). */
  cuota: number;
  /** Demanda captada (unidades). */
  demanda: number;
  /** Ventas reales = min(demanda, producción) (unidades). */
  ventas: number;
  /** Unidades producidas y no vendidas (unidades). */
  stock: number;
  ingresos: number;
  costes: number;
  /** Beneficio de la ronda (€). */
  beneficio: number;
  /** Estado acumulado tras aplicar esta ronda. */
  estado: TeamState;
}

export const DEFAULT_PARAMS: MarketParams = {
  demandaBase: 10000,
  crecimientoDemanda: 0.05,
  pesoCalidad: 0.35,
  pesoMarketing: 0.25,
  pesoPrecio: 0.4,
  precioReferencia: 20,
  costeFijo: 30000,
  costeVariableBase: 9,
  costeStock: 2,
  interesPrestamo: 0.08,
};

/** Calidad (0-100) en función de la inversión en calidad y el apoyo de RR. HH.
 * Rendimientos decrecientes (raíz): doblar la inversión no dobla la calidad. */
export function nivelCalidad(inversionCalidad: number, inversionRRHH: number): number {
  const base = 40;
  const aporteCalidad = 28 * Math.sqrt(Math.max(0, inversionCalidad) / 10000);
  const aporteRRHH = 12 * Math.sqrt(Math.max(0, inversionRRHH) / 10000);
  return clamp(base + aporteCalidad + aporteRRHH, 0, 100);
}

/** Coste variable unitario tras la mejora de productividad que aporta RR. HH.
 * La inversión en personas reduce el CVu hasta un 40 % con rendimientos
 * decrecientes. */
export function costeVariableUnitario(params: MarketParams, inversionRRHH: number): number {
  const reduccionMax = 0.4;
  const factor = reduccionMax * (1 - Math.exp(-Math.max(0, inversionRRHH) / 25000));
  return params.costeVariableBase * (1 - factor);
}

/** Atractivo relativo de una oferta. Mayor calidad y marketing suben; mayor
 * precio baja (vía precio de referencia). El marketing tiene rendimientos
 * decrecientes (raíz). */
export function atractivo(params: MarketParams, d: TeamDecision, calidad: number): number {
  const { pesoCalidad, pesoMarketing, pesoPrecio } = normalizarPesos(params);
  const compCalidad = calidad / 100; // 0-1
  const compMarketing = Math.sqrt(Math.max(0, d.marketing)) / Math.sqrt(50000); // ~0-1 para gastos típicos
  const compPrecio = d.precio > 0 ? params.precioReferencia / d.precio : 0; // 1 si precio = referencia
  const score = pesoCalidad * compCalidad + pesoMarketing * compMarketing + pesoPrecio * compPrecio;
  return Math.max(0, score);
}

/** Simula una ronda completa del mercado. `ronda` empieza en 1. */
export function simularRonda(params: MarketParams, equipos: TeamInput[], ronda: number): RoundResult[] {
  const p = normalizarPesos(params);
  const demandaTotal = params.demandaBase * Math.pow(1 + params.crecimientoDemanda, Math.max(0, ronda - 1));

  // 1) Atractivo de cada equipo.
  const pre = equipos.map((e) => {
    const calidad = nivelCalidad(e.decision.calidad, e.decision.rrhh);
    const cvu = costeVariableUnitario(p, e.decision.rrhh);
    const a = atractivo(p, e.decision, calidad);
    return { e, calidad, cvu, atractivo: a };
  });

  const sumaAtractivo = pre.reduce((s, x) => s + x.atractivo, 0);

  // 2) Reparto de demanda, ventas, costes y beneficio.
  return pre.map((x) => {
    const cuota = sumaAtractivo > 0 ? x.atractivo / sumaAtractivo : 1 / pre.length;
    const demanda = demandaTotal * cuota;
    const ventas = Math.min(demanda, x.e.decision.produccion);
    const stock = Math.max(0, x.e.decision.produccion - demanda);

    const ingresos = ventas * x.e.decision.precio;
    const costes =
      params.costeFijo +
      x.cvu * x.e.decision.produccion +
      x.e.decision.marketing +
      x.e.decision.calidad +
      x.e.decision.rrhh +
      params.interesPrestamo * (x.e.estado.deuda + x.e.decision.prestamo) +
      params.costeStock * stock;
    const beneficio = ingresos - costes;

    const estado: TeamState = {
      caja: x.e.estado.caja + beneficio + x.e.decision.prestamo,
      beneficioAcumulado: x.e.estado.beneficioAcumulado + beneficio,
      deuda: x.e.estado.deuda + x.e.decision.prestamo,
    };

    return {
      id: x.e.id,
      nombre: x.e.nombre,
      calidad: round2(x.calidad),
      costeVariableUnitario: round2(x.cvu),
      atractivo: round4(x.atractivo),
      cuota: round4(cuota),
      demanda: Math.round(demanda),
      ventas: Math.round(ventas),
      stock: Math.round(stock),
      ingresos: round2(ingresos),
      costes: round2(costes),
      beneficio: round2(beneficio),
      estado: {
        caja: round2(estado.caja),
        beneficioAcumulado: round2(estado.beneficioAcumulado),
        deuda: round2(estado.deuda),
      },
    };
  });
}

/** Ordena los resultados para el ranking: por beneficio acumulado desc. */
export function ranking(resultados: RoundResult[]): RoundResult[] {
  return [...resultados].sort((a, b) => b.estado.beneficioAcumulado - a.estado.beneficioAcumulado);
}

export const ESTADO_INICIAL: TeamState = { caja: 0, beneficioAcumulado: 0, deuda: 0 };

// ── helpers ──────────────────────────────────────────────
function normalizarPesos(p: MarketParams): MarketParams {
  const suma = p.pesoCalidad + p.pesoMarketing + p.pesoPrecio;
  if (suma <= 0) return { ...p, pesoCalidad: 1 / 3, pesoMarketing: 1 / 3, pesoPrecio: 1 / 3 };
  return { ...p, pesoCalidad: p.pesoCalidad / suma, pesoMarketing: p.pesoMarketing / suma, pesoPrecio: p.pesoPrecio / suma };
}
function clamp(n: number, min: number, max: number): number { return Math.min(max, Math.max(min, n)); }
function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
