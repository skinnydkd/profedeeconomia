/**
 * The hollow-phrase test, applied to a mission, a vision and a set of values.
 *
 * The test the chapter proposes is simple to state and hard to pass: if any
 * company in any sector could sign the sentence without changing a word, it
 * says nothing. This module operationalises that in two ways — by looking for
 * the words that make a statement interchangeable, and by checking that the
 * structural pieces are there at all.
 *
 * It cannot judge whether a mission is a GOOD one. It can tell you whether it
 * is a statement about this project or a sentence that would fit on any wall.
 */

export type Tipo = 'mision' | 'vision' | 'valor';
export type Fallo = 'vacio' | 'palabra-hueca' | 'sin-para-quien' | 'sin-horizonte' | 'no-comprobable';

/**
 * Words that carry no information on their own. They are not forbidden — a
 * mission may legitimately mention quality — but a statement built ONLY out of
 * them is the definition of a hollow phrase.
 */
export const PALABRAS_HUECAS = [
  'excelencia', 'calidad', 'líder', 'lider', 'liderazgo', 'valor añadido', 'valor anadido',
  'sinergia', 'compromiso', 'pasión', 'pasion', 'vanguardia', 'referente',
  'mejor', 'innovador', 'innovadora', 'satisfacción', 'satisfaccion', 'aportando valor',
  'excel·lència', 'excellencia', 'qualitat', 'líders', 'compromís', 'passió', 'referent',
];

/** A statement needs one of these to say who it is for. */
const MARCAS_DESTINATARIO = [
  ' para ', ' a las ', ' a los ', ' a la ', ' al ', ' de las personas ', ' del barrio ',
  ' per a ', ' a les ', ' als ', ' del barri ',
];

/** A vision needs a horizon: a year, a number of years, or an explicit "when". */
const MARCAS_HORIZONTE = [/\b20\d{2}\b/, /\b\d+\s*(años|anys)\b/, /\ben\s+\d+\b/];

export interface Analisis {
  tipo: Tipo;
  texto: string;
  fallos: Fallo[];
  /** Hollow words actually found, so the UI can point at them. */
  huecasEncontradas: string[];
  aprobado: boolean;
}

export interface Resultado {
  valido: boolean;
  analisis: Analisis[];
  aprobados: number;
  total: number;
}

function analizar(tipo: Tipo, texto: string): Analisis {
  const t = (texto ?? '').trim();
  const bajo = ` ${t.toLowerCase()} `;
  const fallos: Fallo[] = [];

  if (t.length < 12) fallos.push('vacio');

  const huecasEncontradas = PALABRAS_HUECAS.filter((p) => bajo.includes(p));
  // A statement is only condemned for hollowness when the hollow words are not
  // accompanied by anything concrete: a mission may say "quality" and still name
  // what it does and for whom.
  const palabras = t.split(/\s+/).filter(Boolean).length;
  if (huecasEncontradas.length > 0 && palabras < 14) fallos.push('palabra-hueca');

  if (tipo === 'mision' && t.length >= 12 && !MARCAS_DESTINATARIO.some((m) => bajo.includes(m))) {
    fallos.push('sin-para-quien');
  }
  if (tipo === 'vision' && t.length >= 12 && !MARCAS_HORIZONTE.some((re) => re.test(t))) {
    fallos.push('sin-horizonte');
  }
  // A value is a rule of conduct: it has to be possible to check whether it was
  // kept. A verb is the cheapest available proxy for "something gets done".
  if (tipo === 'valor' && t.length >= 12 && !/\b(publicamos|pagamos|rechazamos|damos|informamos|devolvemos|compramos|contratamos|publiquem|paguem|rebutgem|donem|informem|tornem|comprem|contractem)\b/i.test(t)) {
    fallos.push('no-comprobable');
  }

  return { tipo, texto: t, fallos, huecasEncontradas, aprobado: fallos.length === 0 };
}

export function evaluar(entradas: { tipo: Tipo; texto: string }[]): Resultado {
  if (!Array.isArray(entradas) || entradas.length === 0) {
    return { valido: false, analisis: [], aprobados: 0, total: 0 };
  }
  const analisis = entradas.map((e) => analizar(e.tipo, e.texto));
  return {
    valido: true,
    analisis,
    aprobados: analisis.filter((a) => a.aprobado).length,
    total: analisis.length,
  };
}
