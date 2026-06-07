// src/lib/retos.ts
export interface NivelInfo {
  nivel: string;
  descriptor: string;
}

/**
 * Map a score (aciertos out of total auto-scored items) to an achievement-level
 * index: 0 = En desarrollo (<50%), 1 = Adecuado (50–<80%), 2 = Avanzado (≥80%).
 * Returns 0 when there are no auto-scored items.
 */
export function nivelForScore(aciertos: number, total: number): 0 | 1 | 2 {
  if (total <= 0) return 0;
  const pct = aciertos / total;
  if (pct >= 0.8) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

interface NivelRaw { nivel: string; descriptor: string }
interface CompetenciaRaw { codigo: string; descripcion: string; niveles?: NivelRaw[] }
interface EvaluacionDataLike { competencias?: CompetenciaRaw[] }

/**
 * Look up a competencia específica by código in a subject's evaluación data and
 * return its description plus its three achievement-level descriptors. Returns
 * null when the código is absent or it does not have at least 3 levels (the
 * caller then falls back to generic level labels).
 */
export function resolveNiveles(
  evaluacionData: EvaluacionDataLike,
  codigo: string,
): { competenciaTexto: string; niveles: NivelInfo[] } | null {
  const comp = evaluacionData?.competencias?.find((c) => c.codigo === codigo);
  if (!comp || !Array.isArray(comp.niveles) || comp.niveles.length < 3) return null;
  return {
    competenciaTexto: comp.descripcion,
    niveles: comp.niveles.slice(0, 3).map((n) => ({ nivel: n.nivel, descriptor: n.descriptor })),
  };
}
