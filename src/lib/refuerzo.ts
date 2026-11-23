/**
 * Canonical filename for a refuerzo/ampliación block's pre-generated PDF, served
 * from /downloads/. Must match the name produced by scripts/build-refuerzo-pdf.mjs
 * (and parseRefuerzoPrintPath).
 */
export function refuerzoPdfName(
  asignatura: string,
  evaluacion: number,
  tipo: 'refuerzo' | 'ampliacion',
  locale: 'es' | 'ca' = 'es',
): string {
  return `${asignatura}-${tipo}-eval${evaluacion}${locale === 'ca' ? '.ca' : ''}.pdf`;
}

/** A data-driven chart attached to a refuerzo item (see `graficoRefuerzo` in content.config.ts). */
export interface GraficoRefuerzo {
  tipo: 'mercado' | 'xy';
  caption: string;
  props: Record<string, unknown>;
}

/** What each chart type cannot render without. */
export const CAMPOS_GRAFICO: Record<GraficoRefuerzo['tipo'], string[]> = {
  mercado: ['id', 'titulo', 'desc', 'pMax', 'qMax', 'curvas'],
  xy: ['id', 'titulo', 'desc', 'xMax', 'yMax', 'ejeX', 'ejeY'],
};
