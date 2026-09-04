/**
 * Empathy map: six zones about a person, and the two that actually feed a
 * value proposition.
 *
 * The module tracks what has been filled in and flags the two failure modes
 * that make an empathy map useless. The first is leaving zones empty, which is
 * obvious. The second is subtler and far more common: filling the observable
 * zones (sees, hears, says and does) and leaving pains and gains empty — the
 * map then describes a person without saying what they need, and a value
 * proposition cannot be derived from it.
 */

export type Zona = 'piensa-siente' | 've' | 'oye' | 'dice-hace' | 'dolores' | 'ganancias';

export const ZONAS: Zona[] = ['piensa-siente', 've', 'oye', 'dice-hace', 'dolores', 'ganancias'];

/** The two zones a value proposition is actually built from. */
export const ZONAS_CLAVE: Zona[] = ['dolores', 'ganancias'];

export interface Entrada {
  zona: Zona;
  texto: string;
}

export interface Resultado {
  valido: boolean;
  /** Whether the persona has a name; an unnamed persona drifts into "everyone". */
  tieneNombre: boolean;
  porZona: Record<Zona, number>;
  total: number;
  zonasVacias: Zona[];
  /** True when both pains and gains have at least one entry. */
  listoParaPropuesta: boolean;
  /**
   * True when the observable zones are filled but pains and gains are not:
   * a description of a person with nothing to act on.
   */
  soloObservable: boolean;
}

export function evaluar(nombre: string, entradas: Entrada[]): Resultado {
  const vacioPorZona = Object.fromEntries(ZONAS.map((z) => [z, 0])) as Record<Zona, number>;
  if (!Array.isArray(entradas)) {
    return {
      valido: false, tieneNombre: false, porZona: vacioPorZona, total: 0,
      zonasVacias: ZONAS, listoParaPropuesta: false, soloObservable: false,
    };
  }

  const utiles = entradas.filter((e) => e.texto && e.texto.trim().length > 0 && ZONAS.includes(e.zona));
  const porZona = utiles.reduce((acc, e) => {
    acc[e.zona] += 1;
    return acc;
  }, { ...vacioPorZona });

  const zonasVacias = ZONAS.filter((z) => porZona[z] === 0);
  const observablesLlenas = (['ve', 'oye', 'dice-hace'] as Zona[]).every((z) => porZona[z] > 0);
  const clavesLlenas = ZONAS_CLAVE.every((z) => porZona[z] > 0);

  return {
    valido: true,
    tieneNombre: Boolean(nombre && nombre.trim().length >= 2),
    porZona,
    total: utiles.length,
    zonasVacias,
    listoParaPropuesta: clavesLlenas,
    soloObservable: observablesLlenas && !clavesLlenas,
  };
}
