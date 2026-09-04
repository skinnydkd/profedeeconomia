/**
 * Classifying a firm the way the textbook chapter does: by size, by sector, by
 * ownership and by scope.
 *
 * The size thresholds are the ones in Commission Recommendation 2003/361/EC,
 * the definition the EU uses for aid, statistics and programme eligibility.
 * They are a stable legal criterion, not a rate that changes each Budget, so
 * they live here as constants — but the rule has a shape that surprises
 * people: the headcount ceiling is binding on its own, while turnover and
 * balance-sheet total are alternatives, so meeting either one is enough.
 */

export type Tamano = 'micro' | 'pequena' | 'mediana' | 'grande';
export type Sector = 'primario' | 'secundario' | 'terciario';
export type Propiedad = 'privada' | 'publica' | 'mixta';
export type Ambito = 'local' | 'nacional' | 'multinacional';

export interface Umbral {
  tamano: Exclude<Tamano, 'grande'>;
  /** Strict upper bound on the annual work units (headcount). */
  empleados: number;
  /** Ceiling in euros for annual turnover. */
  facturacion: number;
  /** Ceiling in euros for the balance-sheet total. */
  balance: number;
}

/** Commission Recommendation 2003/361/EC, article 2. */
export const UMBRALES: Umbral[] = [
  { tamano: 'micro', empleados: 10, facturacion: 2_000_000, balance: 2_000_000 },
  { tamano: 'pequena', empleados: 50, facturacion: 10_000_000, balance: 10_000_000 },
  { tamano: 'mediana', empleados: 250, facturacion: 50_000_000, balance: 43_000_000 },
];

export interface Entrada {
  empleados: number;
  facturacion: number;
  balance: number;
  sector?: Sector;
  propiedad?: Propiedad;
  ambito?: Ambito;
}

export interface Clasificacion {
  valido: boolean;
  tamano: Tamano;
  /** True while the firm counts as a PYME under the Recommendation. */
  esPyme: boolean;
  /**
   * Which test kept the firm out of the next size down: 'empleados' when the
   * headcount was the binding one, 'financiero' when both money ceilings were,
   * or null when it already sits in the smallest bracket.
   */
  criterioLimitante: 'empleados' | 'financiero' | null;
  /** The threshold row the firm was placed in, or null when it is large. */
  umbral: Umbral | null;
}

export function clasificar(e: Entrada): Clasificacion {
  const vacio: Clasificacion = {
    valido: false, tamano: 'micro', esPyme: false, criterioLimitante: null, umbral: null,
  };
  const nums = [e.empleados, e.facturacion, e.balance];
  if (!nums.every((n) => Number.isFinite(n) && n >= 0)) return vacio;

  for (const u of UMBRALES) {
    // Headcount is binding on its own; turnover and balance are alternatives.
    const cabeEnPlantilla = e.empleados < u.empleados;
    const cabeEnDinero = e.facturacion <= u.facturacion || e.balance <= u.balance;
    if (cabeEnPlantilla && cabeEnDinero) {
      return { valido: true, tamano: u.tamano, esPyme: true, criterioLimitante: null, umbral: u };
    }
  }

  const ultimo = UMBRALES[UMBRALES.length - 1];
  const superaPlantilla = e.empleados >= ultimo.empleados;
  return {
    valido: true,
    tamano: 'grande',
    esPyme: false,
    criterioLimitante: superaPlantilla ? 'empleados' : 'financiero',
    umbral: null,
  };
}

/** What the firm would have to change to drop into the next bracket down. */
export function paraBajarDeTramo(e: Entrada): { tamano: Tamano; empleadosMax: number; facturacionMax: number } | null {
  const actual = clasificar(e);
  if (!actual.valido) return null;
  const i = UMBRALES.findIndex((u) => u.tamano === actual.tamano);
  const destino = i > 0 ? UMBRALES[i - 1] : actual.tamano === 'grande' ? UMBRALES[UMBRALES.length - 1] : null;
  if (!destino) return null;
  return { tamano: destino.tamano, empleadosMax: destino.empleados - 1, facturacionMax: destino.facturacion };
}
