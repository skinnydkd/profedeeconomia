/**
 * RIASEC vocational interest test (Holland's typology) for FOPP 4ESO
 * (Unit on self-knowledge and career orientation).
 *
 * Pure module (no Preact): the dataset of 30 statements (5 per dimension),
 * a `puntuar()` scorer, a `codigoHolland()` ranker, plus per-type descriptions
 * and study/career orientations.
 *
 * The model is John L. Holland's RIASEC hexagon (Realistic, Investigative,
 * Artistic, Social, Enterprising, Conventional). Each person is described by
 * the three dominant types — the "Holland code" (e.g. "SAE"). Orientations map
 * each type to real Spanish post-4ESO pathways (Bachillerato modalities, FP
 * families and example occupations), so the result is grounded, not invented.
 *
 * This is an orientation tool, not a deterministic diagnosis.
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

/** The six Holland dimensions, single-letter coded. */
export type RIASEC = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

/** Canonical order of the six dimensions (also the tie-break order). */
export const RIASEC_ORDEN: readonly RIASEC[] = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

/** Likert scale used by each statement: 1 (nada) … 5 (mucho). */
export const ESCALA_MIN = 1;
export const ESCALA_MAX = 5;

export interface Pregunta {
  id: string;
  /** The statement the student rates ("Me gustaría…"). */
  texto: string;
  /** Which Holland dimension this statement measures. */
  dimension: RIASEC;
}

/** Score per dimension after rating all statements. */
export type Puntuaciones = Record<RIASEC, number>;

export interface TipoInfo {
  letra: RIASEC;
  nombre: string;
  /** One-line tagline used in the wheel / cards. */
  lema: string;
  /** Short description of the type (interests + way of working). */
  descripcion: string;
  /** Real study/career orientations associated with this type. */
  orientaciones: {
    /** Post-4ESO Bachillerato modalities and/or FP families that fit. */
    estudios: string[];
    /** Example real occupations. */
    profesiones: string[];
  };
}

export interface ResultadoRiasec {
  puntuaciones: Puntuaciones;
  /** The three dominant letters, ordered (e.g. "SAE"). */
  codigo: string;
  /** The three dominant letters as an array, ordered. */
  dominantes: RIASEC[];
  /** Full info for each of the three dominant types, in order. */
  tipos: TipoInfo[];
}

/* -------------------------------------------------------------------------- */
/*  Question bank — 30 statements, 5 per dimension                            */
/* -------------------------------------------------------------------------- */

/**
 * 30 age-appropriate statements for 4º ESO. Five per Holland dimension.
 * Each is phrased as something the student would enjoy doing, so the same
 * 1-5 "nada … mucho" scale applies to all of them.
 */
export const PREGUNTAS: readonly Pregunta[] = [
  // R — Realista (manos, máquinas, naturaleza, deporte, trabajo físico)
  { id: 'r1', texto: 'Montar, reparar o construir cosas con mis propias manos.', dimension: 'R' },
  { id: 'r2', texto: 'Trabajar con máquinas, herramientas o motores.', dimension: 'R' },
  { id: 'r3', texto: 'Hacer actividades al aire libre o en contacto con la naturaleza.', dimension: 'R' },
  { id: 'r4', texto: 'Practicar deporte o trabajos que exijan esfuerzo físico.', dimension: 'R' },
  { id: 'r5', texto: 'Cuidar animales o cultivar plantas.', dimension: 'R' },

  // I — Investigador (analizar, experimentar, resolver problemas, ciencia)
  { id: 'i1', texto: 'Resolver problemas de matemáticas o de lógica.', dimension: 'I' },
  { id: 'i2', texto: 'Hacer experimentos y averiguar por qué pasan las cosas.', dimension: 'I' },
  { id: 'i3', texto: 'Investigar un tema a fondo hasta entenderlo bien.', dimension: 'I' },
  { id: 'i4', texto: 'Analizar datos, gráficos o información para sacar conclusiones.', dimension: 'I' },
  { id: 'i5', texto: 'Leer sobre ciencia, tecnología o cómo funciona el mundo.', dimension: 'I' },

  // A — Artístico (crear, diseñar, expresarse, imaginar)
  { id: 'a1', texto: 'Dibujar, pintar o diseñar imágenes.', dimension: 'A' },
  { id: 'a2', texto: 'Escribir historias, poemas o guiones.', dimension: 'A' },
  { id: 'a3', texto: 'Tocar un instrumento, cantar o componer música.', dimension: 'A' },
  { id: 'a4', texto: 'Inventar ideas originales y proyectos creativos.', dimension: 'A' },
  { id: 'a5', texto: 'Actuar, bailar, hacer fotografía o vídeo.', dimension: 'A' },

  // S — Social (ayudar, enseñar, cuidar, trabajar con personas)
  { id: 's1', texto: 'Ayudar a otras personas a resolver sus problemas.', dimension: 'S' },
  { id: 's2', texto: 'Explicar o enseñar algo a un compañero o compañera.', dimension: 'S' },
  { id: 's3', texto: 'Cuidar a personas que lo necesitan (mayores, peques, enfermos).', dimension: 'S' },
  { id: 's4', texto: 'Trabajar en equipo y conocer gente nueva.', dimension: 'S' },
  { id: 's5', texto: 'Colaborar en causas sociales o voluntariado.', dimension: 'S' },

  // E — Emprendedor (liderar, convencer, vender, organizar, dirigir)
  { id: 'e1', texto: 'Liderar un grupo y organizar lo que hay que hacer.', dimension: 'E' },
  { id: 'e2', texto: 'Convencer a otras personas de mis ideas.', dimension: 'E' },
  { id: 'e3', texto: 'Montar mi propio negocio o vender un producto.', dimension: 'E' },
  { id: 'e4', texto: 'Hablar en público y defender una propuesta.', dimension: 'E' },
  { id: 'e5', texto: 'Tomar decisiones y asumir retos con responsabilidad.', dimension: 'E' },

  // C — Convencional (ordenar, clasificar, números, normas, precisión)
  { id: 'c1', texto: 'Organizar, ordenar y clasificar información o materiales.', dimension: 'C' },
  { id: 'c2', texto: 'Llevar cuentas, presupuestos o registros con números.', dimension: 'C' },
  { id: 'c3', texto: 'Seguir instrucciones y normas claras paso a paso.', dimension: 'C' },
  { id: 'c4', texto: 'Trabajar con ordenadores en tareas precisas y detalladas.', dimension: 'C' },
  { id: 'c5', texto: 'Hacer trabajos cuidadosos donde no se pueden cometer errores.', dimension: 'C' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Type descriptions + orientations                                          */
/* -------------------------------------------------------------------------- */

export const TIPOS: Readonly<Record<RIASEC, TipoInfo>> = {
  R: {
    letra: 'R',
    nombre: 'Realista',
    lema: 'Hacer, construir, manejar',
    descripcion:
      'Prefieres el trabajo práctico y manual, con cosas, máquinas, herramientas, plantas o animales. Te gusta ver resultados concretos y, a menudo, trabajar al aire libre o en movimiento más que sentado/a teorizando.',
    orientaciones: {
      estudios: [
        'Bachillerato de Ciencias y Tecnología (rama técnica)',
        'FP de Electromecánica, Instalaciones, Automoción o Mecanizado',
        'FP de Agraria, Forestal o Marítimo-pesquera',
        'Enseñanzas Deportivas',
      ],
      profesiones: [
        'Mecánico/a, electricista o instalador/a',
        'Técnico/a de mantenimiento industrial',
        'Agricultor/a, jardinero/a o agente forestal',
        'Técnico/a o monitor/a deportivo/a',
      ],
    },
  },
  I: {
    letra: 'I',
    nombre: 'Investigador',
    lema: 'Analizar, descubrir, entender',
    descripcion:
      'Te mueve la curiosidad: te gusta observar, analizar y resolver problemas para entender por qué funcionan las cosas. Disfrutas con las ciencias, las matemáticas y el pensamiento abstracto antes que con el trato comercial.',
    orientaciones: {
      estudios: [
        'Bachillerato de Ciencias y Tecnología',
        'Grados de Ciencias, Ingeniería, Matemáticas o Sanidad',
        'FP de Química, Sanidad o Informática (DAW/DAM)',
      ],
      profesiones: [
        'Investigador/a o científico/a',
        'Ingeniero/a o analista de datos',
        'Médico/a, farmacéutico/a o técnico/a de laboratorio',
        'Programador/a o desarrollador/a de software',
      ],
    },
  },
  A: {
    letra: 'A',
    nombre: 'Artístico',
    lema: 'Crear, diseñar, expresar',
    descripcion:
      'Valoras la creatividad y la expresión personal. Te gusta imaginar, diseñar y crear con libertad, sin demasiadas normas rígidas. Disfrutas con el arte, la música, la escritura, el diseño o lo audiovisual.',
    orientaciones: {
      estudios: [
        'Bachillerato de Artes',
        'Ciclos de Artes Plásticas y Diseño',
        'FP de Imagen y Sonido, Diseño o Audiovisuales',
        'Estudios Superiores de Música, Danza o Diseño',
      ],
      profesiones: [
        'Diseñador/a gráfico/a o ilustrador/a',
        'Músico/a, actor/actriz o bailarín/a',
        'Escritor/a, guionista o periodista cultural',
        'Realizador/a audiovisual o fotógrafo/a',
      ],
    },
  },
  S: {
    letra: 'S',
    nombre: 'Social',
    lema: 'Ayudar, enseñar, cuidar',
    descripcion:
      'Te realizas trabajando con y para las personas: ayudar, enseñar, cuidar o acompañar. Tienes facilidad para el trato, la empatía y el trabajo en equipo, y te importa el bienestar de los demás.',
    orientaciones: {
      estudios: [
        'Bachillerato de Humanidades y Ciencias Sociales',
        'Grados de Magisterio, Psicología, Trabajo Social o Enfermería',
        'FP de Atención a la Dependencia, Integración Social o Educación Infantil',
      ],
      profesiones: [
        'Profesor/a o educador/a',
        'Psicólogo/a o trabajador/a social',
        'Enfermero/a o auxiliar de cuidados',
        'Animador/a sociocultural o monitor/a',
      ],
    },
  },
  E: {
    letra: 'E',
    nombre: 'Emprendedor',
    lema: 'Liderar, convencer, emprender',
    descripcion:
      'Te gusta liderar, organizar y persuadir. Disfrutas asumiendo retos, tomando decisiones, vendiendo ideas o proyectos y dirigiendo equipos. Te atrae el mundo de la empresa, los negocios y la iniciativa propia.',
    orientaciones: {
      estudios: [
        'Bachillerato de Humanidades y Ciencias Sociales (vía Economía/Empresa)',
        'Grados de ADE, Marketing, Economía o Derecho',
        'FP de Administración, Comercio y Marketing o Gestión de Ventas',
      ],
      profesiones: [
        'Empresario/a o emprendedor/a',
        'Comercial, responsable de ventas o de marketing',
        'Director/a o gerente de equipos',
        'Abogado/a o consultor/a',
      ],
    },
  },
  C: {
    letra: 'C',
    nombre: 'Convencional',
    lema: 'Organizar, ordenar, gestionar',
    descripcion:
      'Te sientes cómodo/a con tareas ordenadas, claras y bien definidas. Eres metódico/a, cuidadoso/a con los detalles y te manejas bien con números, datos, normas y procedimientos. Valoras la precisión y la organización.',
    orientaciones: {
      estudios: [
        'Bachillerato de Humanidades y Ciencias Sociales o Ciencias',
        'Grados de Administración y Dirección de Empresas, Finanzas o Contabilidad',
        'FP de Administración y Gestión, Administración y Finanzas o Informática',
      ],
      profesiones: [
        'Administrativo/a o gestor/a de oficina',
        'Contable, técnico/a contable o de nóminas',
        'Auxiliar de banca o de gestión',
        'Técnico/a de datos o de sistemas',
      ],
    },
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Scoring                                                                    */
/* -------------------------------------------------------------------------- */

/** Empty score map (all dimensions at 0). */
export function puntuacionesVacias(): Puntuaciones {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

/**
 * Sum each rated statement into its dimension. `respuestas` maps a question id
 * to its 1-5 rating; missing or out-of-range answers are treated as 0 so a
 * partially filled test still produces a coherent (lower) score.
 */
export function puntuar(respuestas: Record<string, number>): Puntuaciones {
  const total = puntuacionesVacias();
  for (const pregunta of PREGUNTAS) {
    const valor = respuestas[pregunta.id];
    if (typeof valor !== 'number' || !Number.isFinite(valor)) continue;
    if (valor < ESCALA_MIN || valor > ESCALA_MAX) continue;
    total[pregunta.dimension] += valor;
  }
  return total;
}

/**
 * Return the three dominant dimensions, highest score first. Ties are broken
 * deterministically by the canonical RIASEC order (R > I > A > S > E > C) so the
 * code is stable for the same input regardless of object iteration quirks.
 */
export function dominantes(puntuaciones: Puntuaciones): RIASEC[] {
  return [...RIASEC_ORDEN]
    .sort((a, b) => {
      const diff = puntuaciones[b] - puntuaciones[a];
      if (diff !== 0) return diff;
      // Stable tie-break: earlier in canonical order wins.
      return RIASEC_ORDEN.indexOf(a) - RIASEC_ORDEN.indexOf(b);
    })
    .slice(0, 3);
}

/** Three-letter Holland code (e.g. "SAE"). */
export function codigoHolland(puntuaciones: Puntuaciones): string {
  return dominantes(puntuaciones).join('');
}

/**
 * Full result: scores, ordered dominant letters, the Holland code and the
 * matching type info for each of the three dominant types.
 */
export function evaluar(respuestas: Record<string, number>): ResultadoRiasec {
  const puntuaciones = puntuar(respuestas);
  const dom = dominantes(puntuaciones);
  return {
    puntuaciones,
    codigo: dom.join(''),
    dominantes: dom,
    tipos: dom.map((letra) => TIPOS[letra]),
  };
}
