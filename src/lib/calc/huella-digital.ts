/**
 * A digital-footprint audit: a checklist of things that can actually be done,
 * not a score that rates a person.
 *
 * Everything here is deliberately about *actions taken*, never about habits or
 * personality. The output is an ordered to-do list, and the order is the point:
 * some of these take two minutes and remove a real risk, while others are
 * housekeeping. The module never stores or transmits anything — the caller
 * holds the answers in component state.
 */

export type Area = 'acceso' | 'privacidad' | 'reputacion' | 'derechos';

export interface Accion {
  id: string;
  area: Area;
  /**
   * How much this reduces real exposure, 1–3. Used only to sort the pending
   * list: a high number means "do this one first", not "you are in danger".
   */
  peso: 1 | 2 | 3;
  /** Roughly how long it takes, in minutes. Sorting tie-breaker. */
  minutos: number;
}

/** The audit itself. Labels live in the island's COPY, keyed by id. */
export const ACCIONES: Accion[] = [
  { id: 'contrasenas-distintas', area: 'acceso', peso: 3, minutos: 20 },
  { id: 'verificacion-dos-pasos', area: 'acceso', peso: 3, minutos: 10 },
  { id: 'gestor-contrasenas', area: 'acceso', peso: 2, minutos: 15 },
  { id: 'sesiones-abiertas', area: 'acceso', peso: 2, minutos: 5 },
  { id: 'perfiles-privados', area: 'privacidad', peso: 3, minutos: 10 },
  { id: 'ubicacion-desactivada', area: 'privacidad', peso: 2, minutos: 5 },
  { id: 'revisar-apps-conectadas', area: 'privacidad', peso: 2, minutos: 10 },
  { id: 'datos-en-bio', area: 'privacidad', peso: 2, minutos: 5 },
  { id: 'buscarse-el-nombre', area: 'reputacion', peso: 3, minutos: 5 },
  { id: 'revisar-etiquetas', area: 'reputacion', peso: 1, minutos: 15 },
  { id: 'correo-serio', area: 'reputacion', peso: 1, minutos: 5 },
  { id: 'borrar-cuentas-viejas', area: 'reputacion', peso: 2, minutos: 30 },
  { id: 'conoce-derecho-supresion', area: 'derechos', peso: 2, minutos: 10 },
  { id: 'sabe-denunciar', area: 'derechos', peso: 3, minutos: 10 },
  { id: 'pide-permiso-fotos', area: 'derechos', peso: 3, minutos: 0 },
];

export interface Resultado {
  valido: boolean;
  /** Ids not yet done, most worth doing first. */
  pendientes: Accion[];
  hechas: number;
  total: number;
  /** Minutes to clear everything still pending. */
  minutosPendientes: number;
  /** Pending count per area, so the UI can show where the gap is. */
  porArea: Record<Area, { hechas: number; total: number }>;
  /** The two highest-weight pending actions, or fewer when almost done. */
  siguientes: Accion[];
}

export function auditar(hechas: Set<string> | string[]): Resultado {
  const set = hechas instanceof Set ? hechas : new Set(hechas);
  if (!(set instanceof Set)) {
    return {
      valido: false, pendientes: [], hechas: 0, total: 0, minutosPendientes: 0,
      porArea: { acceso: { hechas: 0, total: 0 }, privacidad: { hechas: 0, total: 0 }, reputacion: { hechas: 0, total: 0 }, derechos: { hechas: 0, total: 0 } },
      siguientes: [],
    };
  }

  const pendientes = ACCIONES.filter((a) => !set.has(a.id))
    .sort((a, b) => b.peso - a.peso || a.minutos - b.minutos);

  const porArea = ACCIONES.reduce((acc, a) => {
    acc[a.area] ??= { hechas: 0, total: 0 };
    acc[a.area].total += 1;
    if (set.has(a.id)) acc[a.area].hechas += 1;
    return acc;
  }, {} as Resultado['porArea']);

  return {
    valido: true,
    pendientes,
    hechas: ACCIONES.length - pendientes.length,
    total: ACCIONES.length,
    minutosPendientes: pendientes.reduce((s, a) => s + a.minutos, 0),
    porArea,
    siguientes: pendientes.slice(0, 2),
  };
}
