/**
 * Single source of truth for all asignaturas.
 *
 * Hi ha 9 asignaturas distribuïdes per etapa:
 * - **ESO** → Taller de Economía (3.º), Economía y Emprendimiento (4.º), FOPP (4.º)
 * - **Bachillerato** → Economía (1.º), EDMN (2.º), y dos optativas de emprendimiento
 *   ofertables en 1.º o 2.º (EEAE y GPE, currículo CV)
 * - **Formación Profesional** → IPE I, IPE II
 *
 * Cada una té un `estado` ('publicado' | 'proximamente'). Les que tenen
 * `proximamente` mostren un placeholder al hub i no apareixen ni a la
 * llista de cards de la home ni generen rutes filles (libro/tests/etc).
 *
 * Per CLAUDE.md i docs/PRD.md §3.2, la divisió per assignatura és vinculant.
 */

export const ASIGNATURA_SLUGS = [
  'edmn-2bach',
  'eco-1bach',
  'eco-4eso',
  'fopp-4eso',
  'taller-eco-3eso',
  'ipe1-fp',
  'ipe2-fp',
  'eeae-bach',
  'gpe-bach',
] as const;
export type AsignaturaSlug = (typeof ASIGNATURA_SLUGS)[number];

export type Etapa = 'eso' | 'bach' | 'fp';
// 'bach' = optativa de Bachillerato ofertable en 1.º o 2.º (sin curso fijo).
export type Curso = '3eso' | '4eso' | '1bach' | '2bach' | 'bach' | 'fp';
export type Estado = 'publicado' | 'proximamente';

export type Asignatura = {
  slug: AsignaturaSlug;
  level: string;
  shortLabel: string;
  title: string;
  tagline: string;
  num: string;
  color: 'edmn' | 'eco1' | 'eco4' | 'fopp' | 'taller3' | 'ipe1' | 'ipe2' | 'eeae' | 'gpe' | 'proximamente';
  marcoNormativo: string;
  modalidad?: string;
  etapa: Etapa;
  curso: Curso;
  estado: Estado;
};

export const ASIGNATURAS: Record<AsignaturaSlug, Asignatura> = {
  'edmn-2bach': {
    slug: 'edmn-2bach',
    level: '2.º Bachillerato',
    shortLabel: 'EDMN 2BACH',
    title: 'Empresa y Diseño de Modelos de Negocio',
    tagline:
      'Doce unidades alrededor del Business Model Canvas, las áreas funcionales y un proyecto capstone de plan de empresa que recorre todo el curso.',
    num: '01',
    color: 'edmn',
    marcoNormativo: 'Real Decreto 243/2022',
    modalidad: 'Modalidad Humanidades y CC. Sociales',
    etapa: 'bach',
    curso: '2bach',
    estado: 'publicado',
  },
  'eco-1bach': {
    slug: 'eco-1bach',
    level: '1.º Bachillerato',
    shortLabel: 'Eco 1BACH',
    title: 'Economía',
    tagline:
      'Microeconomía, macroeconomía, sistemas e introducción a las finanzas. Con simulador AD‑AS y la teoría de la decisión, que casi siempre se nos queda fuera del temario.',
    num: '02',
    color: 'eco1',
    marcoNormativo: 'Real Decreto 243/2022',
    modalidad: 'Modalidad Humanidades y CC. Sociales',
    etapa: 'bach',
    curso: '1bach',
    estado: 'publicado',
  },
  'eco-4eso': {
    slug: 'eco-4eso',
    level: '4.º ESO',
    shortLabel: 'Eco 4ESO',
    title: 'Economía y Emprendimiento',
    tagline:
      'Economía básica con la mirada puesta en lo que el alumnado se va a encontrar fuera: nómina, IRPF, contratos, decisiones de consumo.',
    num: '03',
    color: 'eco4',
    marcoNormativo: 'Real Decreto 217/2022',
    etapa: 'eso',
    curso: '4eso',
    estado: 'publicado',
  },
  'fopp-4eso': {
    slug: 'fopp-4eso',
    level: '4.º ESO',
    shortLabel: 'FOPP 4ESO',
    title: 'Formación y Orientación Personal y Profesional',
    tagline:
      'Itinerarios, derechos laborales y orientación. La asignatura nueva de la LOMLOE, sin material decente disponible. Hasta ahora.',
    num: '04',
    color: 'fopp',
    marcoNormativo: 'Real Decreto 217/2022',
    etapa: 'eso',
    curso: '4eso',
    estado: 'publicado',
  },
  'taller-eco-3eso': {
    slug: 'taller-eco-3eso',
    level: '3.º ESO',
    shortLabel: 'Taller 3ESO',
    title: 'Taller de Economía',
    tagline:
      'Primer contacto con la economía: consumo responsable, dinero y ahorro, empresas y emprendimiento, trabajo e impuestos. La optativa que abre el camino hacia 4.º ESO.',
    num: '05',
    color: 'taller3',
    marcoNormativo: 'Real Decreto 217/2022 (optativa de iniciación económica y emprendedora)',
    etapa: 'eso',
    curso: '3eso',
    estado: 'publicado',
  },
  'ipe1-fp': {
    slug: 'ipe1-fp',
    level: 'FP — Grado Medio y Superior',
    shortLabel: 'IPE I',
    title: 'Itinerario Personal para la Empleabilidad I',
    tagline:
      'El módulo que sustituye a la FOL en primer curso: autoconocimiento profesional, prevención de riesgos laborales, contrato y derechos, y salud psicosocial.',
    num: '06',
    color: 'ipe1',
    marcoNormativo: 'Ley Orgánica 3/2022 (LOFP) · RD 659/2023, Anexo V',
    etapa: 'fp',
    curso: 'fp',
    estado: 'publicado',
  },
  'ipe2-fp': {
    slug: 'ipe2-fp',
    level: 'FP — Grado Medio y Superior',
    shortLabel: 'IPE II',
    title: 'Itinerario Personal para la Empleabilidad II',
    tagline:
      'Continuación de IPE I en segundo curso: búsqueda activa de empleo, marca personal, competencias para el empleo y un proyecto emprendedor de innovación social.',
    num: '07',
    color: 'ipe2',
    marcoNormativo: 'Ley Orgánica 3/2022 (LOFP) · RD 659/2023, Anexo V',
    etapa: 'fp',
    curso: 'fp',
    estado: 'publicado',
  },
  'eeae-bach': {
    slug: 'eeae-bach',
    level: '1.º Bachillerato',
    shortLabel: 'EEAE',
    title: 'Economía, Emprendimiento y Actividad Empresarial',
    tagline:
      'La materia de modalidad General que junta economía, iniciativa emprendedora y actividad empresarial. Para entender cómo se crea valor antes de elegir itinerario.',
    num: '08',
    color: 'eeae',
    marcoNormativo: 'Real Decreto 243/2022 · Decret 108/2022 (CV)',
    modalidad: 'Modalidad General',
    etapa: 'bach',
    curso: '1bach',
    estado: 'publicado',
  },
  'gpe-bach': {
    slug: 'gpe-bach',
    level: 'Bachillerato (1.º/2.º)',
    shortLabel: 'GPE',
    title: 'Gestión de Proyectos de Emprendimiento',
    tagline:
      'Una materia de proyecto: el alumnado monta su propia iniciativa emprendedora ligada al territorio. Lleva libro teórico y cuaderno de proyecto guiado por fases.',
    num: '09',
    color: 'gpe',
    marcoNormativo: 'Decret 108/2022 (CV) — optativa de oferta obligatoria',
    modalidad: 'Optativa de oferta obligatoria',
    etapa: 'bach',
    curso: 'bach',
    estado: 'publicado',
  },
};

export const ASIGNATURAS_LIST: Asignatura[] = ASIGNATURA_SLUGS.map((s) => ASIGNATURAS[s]);

/** Solament les asignatures publicades, per a navegació pública i grids. */
export const ASIGNATURAS_PUBLICADAS: Asignatura[] = ASIGNATURAS_LIST.filter(
  (a) => a.estado === 'publicado'
);

/** Agrupacions per etapa per a navegació desplegable. */
export const ASIGNATURAS_POR_ETAPA = {
  eso: {
    label: 'ESO',
    cursos: {
      '3eso': {
        label: '3.º ESO',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === '3eso'),
      },
      '4eso': {
        label: '4.º ESO',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === '4eso'),
      },
    },
  },
  bach: {
    label: 'BACH',
    cursos: {
      '1bach': {
        label: '1.º Bach',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === '1bach'),
      },
      '2bach': {
        label: '2.º Bach',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === '2bach'),
      },
      bach: {
        label: 'Optativas (1.º/2.º)',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === 'bach'),
      },
    },
  },
  fp: {
    label: 'FP',
    cursos: {
      fp: {
        label: 'Grado Medio y Superior',
        asignaturas: ASIGNATURAS_LIST.filter((a) => a.curso === 'fp'),
      },
    },
  },
} as const;

export const SECCIONES_TRANSVERSALES = [
  { slug: 'dinamicas',      label: 'Dinámicas',      description: 'Role-plays y simulaciones para hacer en clase.' },
  { slug: 'herramientas',   label: 'Herramientas',   description: 'Calculadoras y simuladores para usar en clase.' },
  { slug: 'emprendimiento', label: 'Emprendimiento', description: '«De cero a empresa»: un proyecto para montar un negocio paso a paso.' },
  { slug: 'proyectos',      label: 'Proyectos interdisciplinares', description: 'Proyectos que cruzan la economía con otra materia.' },
  { slug: 'debates',        label: 'Debates',        description: 'Controversias económicas para argumentar en clase.' },
  { slug: 'juegos',         label: 'Juegos',         description: 'Material para una clase activa.' },
  { slug: 'jocs-economics', label: 'Juegos Económicos', description: 'Concurso competitivo de economía con ranking por alumno e instituto.' },
  { slug: 'generadores',    label: 'Herramientas Docentes', description: 'Generadores LOMLOE y herramientas de evaluación y aula.' },
] as const;
