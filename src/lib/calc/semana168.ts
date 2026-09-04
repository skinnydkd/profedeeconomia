/**
 * The week has 168 hours, and a plan that does not add up to 168 is not a
 * plan. This module only adds, divides and compares against the usual sleep
 * guidance for adolescence; it diagnoses nothing.
 */
export const HORAS_SEMANA = 168;

/** Sleep guidance for teenagers, in hours per night, as the usual range. */
export const SUENO_RECOMENDADO = { min: 8, max: 10 } as const;

export interface Bloque {
  clave: string;
  horas: number;
}

export interface BloqueValorado extends Bloque {
  /** Share of the whole week. */
  porcentaje: number;
  /** Hours per day, for reading a weekly figure at a human scale. */
  porDia: number;
}

export interface Resultado {
  valido: boolean;
  bloques: BloqueValorado[];
  total: number;
  /** 168 − total. Negative when the week has been over-booked. */
  libres: number;
  sobrepasada: boolean;
  /** Hours of sleep per night implied by the sleep block. */
  suenoPorNoche: number;
  /** 'corto' | 'ok' | 'largo' against the usual guidance. */
  lecturaSueno: 'corto' | 'ok' | 'largo';
}

export function repartir(bloques: Bloque[], claveSueno = 'sueno'): Resultado {
  const vacio: Resultado = {
    valido: false, bloques: [], total: NaN, libres: NaN, sobrepasada: false,
    suenoPorNoche: NaN, lecturaSueno: 'ok',
  };
  if (!Array.isArray(bloques) || bloques.length === 0) return vacio;
  if (!bloques.every((b) => Number.isFinite(b.horas) && b.horas >= 0)) return vacio;

  const total = bloques.reduce((s, b) => s + b.horas, 0);
  const sueno = bloques.find((b) => b.clave === claveSueno)?.horas ?? 0;
  const suenoPorNoche = sueno / 7;

  return {
    valido: true,
    bloques: bloques.map((b) => ({
      ...b,
      porcentaje: b.horas / HORAS_SEMANA,
      porDia: b.horas / 7,
    })),
    total,
    libres: HORAS_SEMANA - total,
    sobrepasada: total > HORAS_SEMANA,
    suenoPorNoche,
    lecturaSueno:
      suenoPorNoche < SUENO_RECOMENDADO.min ? 'corto'
      : suenoPorNoche > SUENO_RECOMENDADO.max ? 'largo'
      : 'ok',
  };
}
