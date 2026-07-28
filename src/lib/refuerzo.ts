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
