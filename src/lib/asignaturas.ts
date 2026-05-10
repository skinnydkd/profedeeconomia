/**
 * Single source of truth for the four asignaturas.
 * Used by navigation, the home grid, the per-asignatura hubs and any
 * place that needs the slug ↔ display name ↔ color-coding mapping.
 *
 * Per CLAUDE.md and docs/PRD.md §3.2, the structure is binding: four
 * asignaturas, each with the same internal sub-sections.
 */

export const ASIGNATURA_SLUGS = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso'] as const;
export type AsignaturaSlug = (typeof ASIGNATURA_SLUGS)[number];

export type Asignatura = {
  slug: AsignaturaSlug;
  level: string;          // "2.º Bachillerato", "1.º Bachillerato", etc.
  shortLabel: string;     // "EDMN 2BACH"
  title: string;          // "Empresa y Diseño de Modelos de Negocio"
  tagline: string;        // 1-2 lines for the home card
  num: string;            // "01" — italic-style ordinal
  color: 'edmn' | 'eco1' | 'eco4' | 'fopp';
  marcoNormativo: string; // RD 243/2022 / RD 217/2022
  modalidad?: string;     // "Modalidad Humanidades y CC. Sociales"
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
  },
};

export const ASIGNATURAS_LIST: Asignatura[] = ASIGNATURA_SLUGS.map((s) => ASIGNATURAS[s]);

export const SECCIONES_TRANSVERSALES = [
  { slug: 'juegos',         label: 'Juegos',         description: 'Material para una clase activa.' },
  { slug: 'herramientas',   label: 'Herramientas',   description: 'Generadores de SA LOMLOE y pruebas.' },
  { slug: 'emprendimiento', label: 'Emprendimiento', description: 'Plantillas y dinámicas transversales.' },
] as const;
