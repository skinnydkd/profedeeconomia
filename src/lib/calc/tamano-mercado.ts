/**
 * Sizing the market for a school project: TAM, SAM and SOM.
 *
 * The three figures are the same multiplication filtered three times, and the
 * point of separating them is that a project which claims «our market is
 * 47 million people» has not filtered anything. The last figure is the only
 * one worth planning with.
 */
export interface Entradas {
  /** Everyone in the area the project can physically reach. */
  poblacion: number;
  /** Share of that population that fits the customer profile (0–1). */
  perfil: number;
  /** Purchases per customer and year. */
  frecuencia: number;
  /** Average price per purchase, in euros. */
  precio: number;
  /** Share of the reachable market the project expects to win (0–1). */
  cuota: number;
  /** Revenue the project wants to reach in a year, in euros. */
  objetivo: number;
}

export interface Resultado {
  valido: boolean;
  /** Everybody buying: the ceiling, not a target. */
  tam: number;
  /** Only the people who fit the profile. */
  sam: number;
  /** The share of those the project expects to win. */
  som: number;
  clientesPerfil: number;
  clientesPropios: number;
  somMensual: number;
  /** Customers needed to hit the revenue target. */
  clientesParaObjetivo: number;
  /** Share of the reachable market that target implies. */
  cuotaParaObjetivo: number;
  /** True when the target needs more than the whole reachable market. */
  objetivoImposible: boolean;
}

const positivo = (x: number) => Number.isFinite(x) && x > 0;
const fraccion = (x: number) => Number.isFinite(x) && x > 0 && x <= 1;

export function calcular(e: Entradas): Resultado {
  const vacio: Resultado = {
    valido: false, tam: NaN, sam: NaN, som: NaN, clientesPerfil: NaN,
    clientesPropios: NaN, somMensual: NaN, clientesParaObjetivo: NaN,
    cuotaParaObjetivo: NaN, objetivoImposible: false,
  };
  if (!positivo(e.poblacion) || !positivo(e.frecuencia) || !positivo(e.precio)) return vacio;
  if (!fraccion(e.perfil) || !fraccion(e.cuota)) return vacio;
  if (!Number.isFinite(e.objetivo) || e.objetivo < 0) return vacio;

  const gastoPorCliente = e.frecuencia * e.precio;
  const clientesPerfil = e.poblacion * e.perfil;
  const clientesPropios = clientesPerfil * e.cuota;
  const sam = clientesPerfil * gastoPorCliente;
  const clientesParaObjetivo = e.objetivo / gastoPorCliente;

  return {
    valido: true,
    tam: e.poblacion * gastoPorCliente,
    sam,
    som: clientesPropios * gastoPorCliente,
    clientesPerfil,
    clientesPropios,
    somMensual: (clientesPropios * gastoPorCliente) / 12,
    clientesParaObjetivo,
    cuotaParaObjetivo: clientesParaObjetivo / clientesPerfil,
    // A target above the whole reachable market is the answer the exercise is
    // looking for: the plan is wrong, not the arithmetic.
    objetivoImposible: e.objetivo > sam,
  };
}
