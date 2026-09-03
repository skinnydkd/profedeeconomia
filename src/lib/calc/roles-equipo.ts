/**
 * Team-role coverage: which roles a team has, which it is missing and which it
 * has three of.
 *
 * This is NOT the Belbin Self-Perception Inventory, which is a proprietary
 * instrument: it is a classroom self-assessment built from plain behavioural
 * statements, using the role names the textbook chapter already introduces. It
 * produces a starting point for a conversation about who does what, never a
 * profile, a diagnosis or a label to stick on anyone. Callers should say so.
 *
 * The genuinely useful output is at team level, not individual: a paper
 * questionnaire tells you your own tendency, and what a project actually needs
 * to know is whether anybody is going to finish things.
 */

export type Rol = 'cerebro' | 'coordinador' | 'implementador' | 'evaluador' | 'cohesionador' | 'finalizador';

export const ROLES: Rol[] = ['cerebro', 'coordinador', 'implementador', 'evaluador', 'cohesionador', 'finalizador'];

/** One person's self-assessment: a 0–4 score per role. */
export interface Persona {
  nombre: string;
  puntuaciones: Partial<Record<Rol, number>>;
}

export interface PerfilPersona {
  nombre: string;
  /** Roles tied for this person's highest score, in ROLES order. */
  dominantes: Rol[];
  total: number;
}

export interface CoberturaRol {
  rol: Rol;
  /** People whose score for this role is at or above the cover threshold. */
  cubiertoPor: string[];
  /** Sum across the team, for reading relative strength. */
  suma: number;
  estado: 'hueco' | 'cubierto' | 'saturado';
}

export interface Resultado {
  valido: boolean;
  personas: PerfilPersona[];
  cobertura: CoberturaRol[];
  huecos: Rol[];
  saturados: Rol[];
}

/** A person counts as covering a role from this score up. */
export const UMBRAL_COBERTURA = 3;
/** Three or more people covering the same role is a crowded role, not a strong one. */
export const UMBRAL_SATURACION = 3;

export function analizar(personas: Persona[]): Resultado {
  const vacio: Resultado = { valido: false, personas: [], cobertura: [], huecos: [], saturados: [] };
  if (!Array.isArray(personas) || personas.length === 0) return vacio;

  const puntuacionesValidas = personas.every((p) =>
    ROLES.every((r) => {
      const v = p.puntuaciones[r];
      return v === undefined || (Number.isFinite(v) && v >= 0 && v <= 4);
    }),
  );
  if (!puntuacionesValidas) return vacio;

  const perfiles: PerfilPersona[] = personas.map((p) => {
    const vals = ROLES.map((r) => p.puntuaciones[r] ?? 0);
    const max = Math.max(...vals);
    return {
      nombre: p.nombre,
      // A flat profile has no dominant role, and saying so is more honest than
      // picking the first one alphabetically.
      dominantes: max > 0 ? ROLES.filter((r) => (p.puntuaciones[r] ?? 0) === max) : [],
      total: vals.reduce((s, v) => s + v, 0),
    };
  });

  const cobertura: CoberturaRol[] = ROLES.map((rol) => {
    const cubiertoPor = personas.filter((p) => (p.puntuaciones[rol] ?? 0) >= UMBRAL_COBERTURA).map((p) => p.nombre);
    return {
      rol,
      cubiertoPor,
      suma: personas.reduce((s, p) => s + (p.puntuaciones[rol] ?? 0), 0),
      estado:
        cubiertoPor.length === 0 ? 'hueco'
        : cubiertoPor.length >= UMBRAL_SATURACION ? 'saturado'
        : 'cubierto',
    };
  });

  return {
    valido: true,
    personas: perfiles,
    cobertura,
    huecos: cobertura.filter((c) => c.estado === 'hueco').map((c) => c.rol),
    saturados: cobertura.filter((c) => c.estado === 'saturado').map((c) => c.rol),
  };
}
