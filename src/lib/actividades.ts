/**
 * Shared vocabulary for the per-subject activity sheets
 * (`src/content/asignaturas/<slug>/actividades/`).
 */

/** Activity families the `tipo` frontmatter field may take. */
export const ACTIVIDAD_TIPOS = [
  'caso',
  'ejercicio',
  'debate',
  'dinamica',
  'proyecto',
  'investigacion',
  'noticia',
  'grafico',
  'juego',
  'creativo',
] as const;
export type ActividadTipo = (typeof ACTIVIDAD_TIPOS)[number];

/** Card / badge label of each family, per locale. */
export const ACTIVIDAD_TIPO_LABEL: Record<'es' | 'ca', Record<ActividadTipo, string>> = {
  es: {
    caso: 'Caso',
    ejercicio: 'Ejercicio',
    debate: 'Debate',
    dinamica: 'Dinámica',
    proyecto: 'Proyecto',
    investigacion: 'Investigación',
    noticia: 'Noticia',
    grafico: 'Gráfico',
    juego: 'Juego',
    creativo: 'Creativo',
  },
  ca: {
    caso: 'Cas',
    ejercicio: 'Exercici',
    debate: 'Debat',
    dinamica: 'Dinàmica',
    proyecto: 'Projecte',
    investigacion: 'Investigació',
    noticia: 'Notícia',
    grafico: 'Gràfic',
    juego: 'Joc',
    creativo: 'Creatiu',
  },
};

/**
 * Canonical filename of an activity's pre-generated PDF sheet, served from
 * /downloads/. Must match the name produced by scripts/build-actividades-pdf.mjs
 * (parseActividadPrintPath in scripts/lib/actividad-pdf-jobs.mjs).
 */
export function actividadPdfName(asignatura: string, slug: string, locale: 'es' | 'ca' = 'es'): string {
  return `actividad-${asignatura}-${slug}${locale === 'ca' ? '.ca' : ''}.pdf`;
}
