/**
 * Sector-benchmarked financial ratios for EDMN 2BACH (Unit 11 — análisis de
 * estados financieros).
 *
 * Pure module (no Preact). Given the balance + a few P&L figures it computes the
 * key liquidity, leverage, profitability and turnover ratios, and then
 * classifies each one against an *orientative* sector benchmark range:
 *   - 'bajo'   : below the typical range for that sector
 *   - 'dentro' : inside the typical range
 *   - 'alto'   : above the typical range
 *
 * IMPORTANT — honesty about the benchmark data: the ranges below are NOT official
 * figures. They are reasonable orientative bands a teacher can use in class to
 * discuss why "healthy" depends on the sector (a supermarket lives with low
 * liquidity and high turnover; a tech firm carries little debt and high margins).
 * They are flagged everywhere as "valores de referencia orientativos". For a real
 * analysis the figures must come from official sector statistics (e.g. Central de
 * Balances del Banco de España, Registros Mercantiles).
 */

/* -------------------------------------------------------------------------- */
/*  Inputs                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Raw figures taken from the balance and the income statement. All in the same
 * monetary unit (e.g. thousands of euros). The classification only needs the
 * derived ratios, but keeping the masses explicit makes the formulas obvious to
 * a student.
 */
export interface DatosEmpresa {
  /** Activo corriente (existencias + realizable + disponible). */
  activoCorriente: number;
  /** Pasivo corriente (deudas a corto plazo). */
  pasivoCorriente: number;
  /** Existencias (inventory) — excluded from the acid test. */
  existencias: number;
  /** Deuda total = pasivo corriente + pasivo no corriente. */
  deudaTotal: number;
  /** Patrimonio neto (equity). */
  patrimonioNeto: number;
  /** Activo total = patrimonio neto + deuda total. */
  activoTotal: number;
  /** Ventas / cifra de negocio (net sales). */
  ventas: number;
  /** Beneficio neto (net profit after tax). */
  beneficioNeto: number;
  /** BAII / resultado de explotación (operating profit, EBIT). */
  baii: number;
}

/* -------------------------------------------------------------------------- */
/*  Computed ratios                                                            */
/* -------------------------------------------------------------------------- */

/** Stable identifier for every ratio we compute and benchmark. */
export type RatioId =
  | 'liquidez'
  | 'acida'
  | 'endeudamiento'
  | 'autonomia'
  | 'roe'
  | 'roa'
  | 'margenNeto'
  | 'rotacionActivos';

export type Categoria = 'liquidez' | 'endeudamiento' | 'rentabilidad' | 'rotacion';

/** Unit of a ratio: a coefficient (times) or a percentage. */
export type Unidad = 'veces' | 'porcentaje';

export interface RatioDef {
  id: RatioId;
  nombre: string;
  categoria: Categoria;
  unidad: Unidad;
  formula: string;
  descripcion: string;
}

/** Static metadata for each ratio (name, category, formula, plain description). */
export const RATIOS: readonly RatioDef[] = [
  {
    id: 'liquidez',
    nombre: 'Liquidez (ratio corriente)',
    categoria: 'liquidez',
    unidad: 'veces',
    formula: 'Activo corriente / Pasivo corriente',
    descripcion:
      'Cuántas veces el activo a corto plazo cubre las deudas a corto plazo. Por debajo de 1 hay riesgo de no poder pagar.',
  },
  {
    id: 'acida',
    nombre: 'Prueba ácida (test ácido)',
    categoria: 'liquidez',
    unidad: 'veces',
    formula: '(Activo corriente − Existencias) / Pasivo corriente',
    descripcion:
      'Como la liquidez pero sin contar las existencias, que no siempre se venden rápido.',
  },
  {
    id: 'endeudamiento',
    nombre: 'Endeudamiento',
    categoria: 'endeudamiento',
    unidad: 'porcentaje',
    formula: 'Deuda total / Activo total',
    descripcion: 'Porcentaje del activo financiado con deuda. Cuanto más alto, más dependencia externa.',
  },
  {
    id: 'autonomia',
    nombre: 'Autonomía financiera',
    categoria: 'endeudamiento',
    unidad: 'porcentaje',
    formula: 'Patrimonio neto / Activo total',
    descripcion:
      'Porcentaje del activo financiado con recursos propios. Es el complemento del endeudamiento.',
  },
  {
    id: 'roe',
    nombre: 'ROE (rentabilidad financiera)',
    categoria: 'rentabilidad',
    unidad: 'porcentaje',
    formula: 'Beneficio neto / Patrimonio neto',
    descripcion: 'Rendimiento que obtienen los socios sobre el capital que han aportado.',
  },
  {
    id: 'roa',
    nombre: 'ROA (rentabilidad económica)',
    categoria: 'rentabilidad',
    unidad: 'porcentaje',
    formula: 'BAII / Activo total',
    descripcion: 'Eficiencia del activo para generar beneficio, al margen de cómo se financie.',
  },
  {
    id: 'margenNeto',
    nombre: 'Margen neto sobre ventas',
    categoria: 'rentabilidad',
    unidad: 'porcentaje',
    formula: 'Beneficio neto / Ventas',
    descripcion: 'Cuánto beneficio queda por cada euro vendido.',
  },
  {
    id: 'rotacionActivos',
    nombre: 'Rotación de activos',
    categoria: 'rotacion',
    unidad: 'veces',
    formula: 'Ventas / Activo total',
    descripcion: 'Cuántos euros de ventas genera cada euro invertido en activo.',
  },
] as const;

/** One computed ratio value. `null` when the formula divides by zero. */
export interface RatioValor {
  id: RatioId;
  /** Coefficient (e.g. 1.8) or fraction for percentages (e.g. 0.45 = 45 %). */
  valor: number | null;
}

/**
 * Compute every ratio from the company data. Division by zero is handled by
 * returning `null` for that ratio (the caller decides how to render it).
 * Percentages are returned as fractions (0.45 = 45 %), consistent with
 * `format.ts#formatPercent(scaled=true)`.
 */
export function calcularRatios(d: DatosEmpresa): Record<RatioId, number | null> {
  const div = (num: number, den: number): number | null => (den !== 0 ? num / den : null);
  return {
    liquidez: div(d.activoCorriente, d.pasivoCorriente),
    acida: div(d.activoCorriente - d.existencias, d.pasivoCorriente),
    endeudamiento: div(d.deudaTotal, d.activoTotal),
    autonomia: div(d.patrimonioNeto, d.activoTotal),
    roe: div(d.beneficioNeto, d.patrimonioNeto),
    roa: div(d.baii, d.activoTotal),
    margenNeto: div(d.beneficioNeto, d.ventas),
    rotacionActivos: div(d.ventas, d.activoTotal),
  };
}

/* -------------------------------------------------------------------------- */
/*  Sector benchmarks (ORIENTATIVE — not official figures)                    */
/* -------------------------------------------------------------------------- */

export type SectorId = 'comercio' | 'industria' | 'hosteleria' | 'tecnologia';

export interface Sector {
  id: SectorId;
  nombre: string;
  /** One-line description of the sector's financial profile, for the UI. */
  nota: string;
}

export const SECTORES: readonly Sector[] = [
  {
    id: 'comercio',
    nombre: 'Comercio / retail',
    nota: 'Mucha rotación, márgenes ajustados y liquidez baja (cobra al contado, paga a plazo).',
  },
  {
    id: 'industria',
    nombre: 'Industria / fabricación',
    nota: 'Activo fijo elevado, más deuda y rotación baja; márgenes intermedios.',
  },
  {
    id: 'hosteleria',
    nombre: 'Hostelería / restauración',
    nota: 'Rotación alta, márgenes estrechos y a menudo bastante apalancada.',
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología / servicios',
    nota: 'Poco activo y poca deuda, alta autonomía y márgenes amplios.',
  },
] as const;

/** Inclusive [min, max] band considered "typical / healthy" for a sector. */
export type Rango = readonly [min: number, max: number];

/**
 * Orientative benchmark bands per sector. Coefficients for `veces` ratios and
 * fractions for `porcentaje` ratios (0.45 = 45 %). These are teaching ranges,
 * NOT official statistics — see the file header.
 */
export const BENCHMARKS: Record<SectorId, Record<RatioId, Rango>> = {
  comercio: {
    liquidez: [0.9, 1.5],
    acida: [0.4, 0.9],
    endeudamiento: [0.5, 0.7],
    autonomia: [0.3, 0.5],
    roe: [0.08, 0.2],
    roa: [0.04, 0.1],
    margenNeto: [0.01, 0.05],
    rotacionActivos: [1.8, 3.5],
  },
  industria: {
    liquidez: [1.3, 2.0],
    acida: [0.7, 1.2],
    endeudamiento: [0.5, 0.7],
    autonomia: [0.3, 0.5],
    roe: [0.06, 0.15],
    roa: [0.03, 0.08],
    margenNeto: [0.03, 0.08],
    rotacionActivos: [0.6, 1.3],
  },
  hosteleria: {
    liquidez: [0.7, 1.3],
    acida: [0.5, 1.0],
    endeudamiento: [0.55, 0.8],
    autonomia: [0.2, 0.45],
    roe: [0.06, 0.18],
    roa: [0.03, 0.09],
    margenNeto: [0.02, 0.07],
    rotacionActivos: [1.2, 2.5],
  },
  tecnologia: {
    liquidez: [1.5, 2.5],
    acida: [1.3, 2.3],
    endeudamiento: [0.2, 0.45],
    autonomia: [0.55, 0.8],
    roe: [0.1, 0.25],
    roa: [0.07, 0.18],
    margenNeto: [0.08, 0.2],
    rotacionActivos: [0.5, 1.2],
  },
};

/* -------------------------------------------------------------------------- */
/*  Classification vs benchmark                                               */
/* -------------------------------------------------------------------------- */

export type Posicion = 'bajo' | 'dentro' | 'alto' | 'sinDato';

export interface Evaluacion {
  id: RatioId;
  def: RatioDef;
  valor: number | null;
  rango: Rango;
  posicion: Posicion;
  /** Short human-readable verdict for the UI. */
  comentario: string;
}

/**
 * Place a single ratio value inside (or outside) its sector band.
 * `null` -> 'sinDato'. Values exactly on the boundary count as 'dentro'.
 */
export function clasificar(valor: number | null, [min, max]: Rango): Posicion {
  if (valor === null || !Number.isFinite(valor)) return 'sinDato';
  if (valor < min) return 'bajo';
  if (valor > max) return 'alto';
  return 'dentro';
}

/**
 * Whether a position is "good" for that ratio. For most ratios staying inside
 * the band is the healthy outcome. Endeudamiento is the exception worth noting:
 * being *below* the band (less debt than the sector) is not a problem, so we
 * treat 'bajo' as acceptable there too. This is only used to drive the visual
 * ok/fail cue, never to give a hard verdict.
 */
export function esFavorable(id: RatioId, pos: Posicion): boolean {
  if (pos === 'dentro') return true;
  if (pos === 'sinDato') return false;
  if (id === 'endeudamiento') return pos === 'bajo';
  if (id === 'autonomia') return pos === 'alto';
  // For liquidity, profitability and turnover, being above the band is usually
  // fine too (more cushion / more profit / more efficient).
  return pos === 'alto';
}

function comentar(id: RatioId, pos: Posicion): string {
  switch (pos) {
    case 'sinDato':
      return 'No se puede calcular (división por cero).';
    case 'dentro':
      return 'Dentro del rango típico del sector.';
    case 'bajo':
      if (id === 'endeudamiento')
        return 'Por debajo del sector: menos deuda de lo habitual (señal positiva).';
      if (id === 'autonomia')
        return 'Por debajo del sector: depende más de financiación ajena.';
      return 'Por debajo del rango típico del sector.';
    case 'alto':
      if (id === 'endeudamiento')
        return 'Por encima del sector: más deuda de lo habitual; vigilar.';
      if (id === 'autonomia')
        return 'Por encima del sector: mucha financiación propia.';
      return 'Por encima del rango típico del sector.';
  }
}

/**
 * Full evaluation: compute every ratio, classify it against the chosen sector's
 * benchmark band, and attach a short comment. The order follows `RATIOS`.
 */
export function evaluarEmpresa(d: DatosEmpresa, sector: SectorId): Evaluacion[] {
  const valores = calcularRatios(d);
  const bandas = BENCHMARKS[sector];
  return RATIOS.map((def) => {
    const valor = valores[def.id];
    const rango = bandas[def.id];
    const posicion = clasificar(valor, rango);
    return {
      id: def.id,
      def,
      valor,
      rango,
      posicion,
      comentario: comentar(def.id, posicion),
    };
  });
}
