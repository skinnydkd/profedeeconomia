/**
 * The demand–control–support model applied to one job.
 *
 * Karasek's point, and the reason this is worth a tool rather than a slide, is
 * that demand alone does not explain strain: a demanding job with room to
 * decide is not the same job as a demanding one without it. The quadrant makes
 * that visible, and the support axis says which of two jobs in the same
 * quadrant is the worse one to be in.
 *
 * This describes a POST, not a person. It is not a health screening and cannot
 * be one: it takes a description of working conditions and names the quadrant
 * they fall in.
 */

export type Cuadrante = 'alta-tension' | 'activo' | 'pasivo' | 'baja-tension';

export interface Puesto {
  /** Workload, pace and time pressure, 0–10. */
  demanda: number;
  /** Room to decide order, method, pace and to use one's skills, 0–10. */
  control: number;
  /** Support from colleagues and from the line manager, 0–10. */
  apoyo: number;
}

export interface Resultado {
  valido: boolean;
  cuadrante: Cuadrante;
  /** True in the quadrant the evidence associates with the most harm. */
  esAltaTension: boolean;
  /** Low support turns any quadrant into a worse version of itself. */
  apoyoBajo: boolean;
  /**
   * How much the control would have to rise to leave high strain, or 0 when
   * the job is not in that quadrant. The single most actionable number here.
   */
  controlNecesario: number;
  /** Same, for lowering demand instead. */
  reduccionDemandaNecesaria: number;
}

/** Midpoint of the 0–10 scale: above it counts as high. */
export const UMBRAL = 5;

export function evaluar(p: Puesto): Resultado {
  const vacio: Resultado = {
    valido: false, cuadrante: 'pasivo', esAltaTension: false, apoyoBajo: false,
    controlNecesario: 0, reduccionDemandaNecesaria: 0,
  };
  const vals = [p?.demanda, p?.control, p?.apoyo];
  if (!vals.every((v) => Number.isFinite(v) && (v as number) >= 0 && (v as number) <= 10)) return vacio;

  const demandaAlta = p.demanda > UMBRAL;
  const controlAlto = p.control > UMBRAL;

  const cuadrante: Cuadrante =
    demandaAlta && !controlAlto ? 'alta-tension'
    : demandaAlta && controlAlto ? 'activo'
    : !demandaAlta && !controlAlto ? 'pasivo'
    : 'baja-tension';

  const esAltaTension = cuadrante === 'alta-tension';

  return {
    valido: true,
    cuadrante,
    esAltaTension,
    apoyoBajo: p.apoyo <= UMBRAL,
    // Just past the threshold is enough to change quadrant; 0.5 keeps it off
    // the boundary where `>` would still read as low.
    controlNecesario: esAltaTension ? Math.round((UMBRAL + 0.5 - p.control) * 10) / 10 : 0,
    reduccionDemandaNecesaria: esAltaTension ? Math.round((p.demanda - UMBRAL) * 10) / 10 : 0,
  };
}
