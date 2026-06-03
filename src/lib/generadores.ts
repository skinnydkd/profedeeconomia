/**
 * Registry for the teacher-tools section «Generadores»: 6 native interactive
 * tools (rubric, grading, and 4 fillable templates) plus the 2 external
 * generators hosted on oposicioneseconomia.es. Separate from the student
 * `/herramientas/` toolbox. No curriculum map (teacher tools aren't unit-bound).
 */
export type TipoGenerador = 'rubrica' | 'calculadora' | 'plantilla';
export type GrupoGenerador = 'evaluacion' | 'aula';

export const GENERADOR_KEYS = ['Rubrica', 'Calificaciones', 'Autoevaluacion', 'PlanRefuerzo', 'RegistroAula', 'MedidasDUA'] as const;
export type GeneradorKey = typeof GENERADOR_KEYS[number];

export interface GeneradorNativo {
  componente: GeneradorKey;
  slug: string;
  title: string;
  descripcion: string;
  comoUsar: string;
  tipo: TipoGenerador;
  grupo: GrupoGenerador;
  orden: number;
}
export interface GeneradorExterno { title: string; descripcion: string; href: string; eyebrow: string; }

const PROGRAMACION_URL = 'https://oposicioneseconomia.es/programacion';

export const GENERADORES_EXTERNOS: GeneradorExterno[] = [
  { eyebrow: 'Generador', title: 'Situaciones de Aprendizaje', descripcion: 'Un asistente por pasos que arma una Situación de Aprendizaje LOMLOE completa: saberes, competencias, criterios, secuencia de actividades, instrumentos de evaluación y medidas DUA. Lista para imprimir.', href: PROGRAMACION_URL },
  { eyebrow: 'Generador', title: 'Programación anual', descripcion: 'Monta una programación didáctica anual alineada con el currículo LOMLOE de tu asignatura y nivel, lista para descargar.', href: PROGRAMACION_URL },
];

export const GENERADORES_NATIVOS: GeneradorNativo[] = [
  { componente: 'Rubrica', slug: 'rubricas', title: 'Generador de rúbricas', tipo: 'rubrica', grupo: 'evaluacion', orden: 1, descripcion: 'Construye una rúbrica con criterios y niveles de logro, ligada a competencias, lista para exportar e imprimir.', comoUsar: 'Añade criterios y niveles, escribe el descriptor de cada celda y expórtala en PDF o imprímela.' },
  { componente: 'Calificaciones', slug: 'calificaciones', title: 'Calculadora de calificaciones', tipo: 'calculadora', grupo: 'evaluacion', orden: 2, descripcion: 'Media ponderada de instrumentos o competencias y conversor de niveles de rúbrica a nota.', comoUsar: 'Introduce los pesos y las notas de cada instrumento; abajo, convierte niveles de rúbrica en una calificación.' },
  { componente: 'Autoevaluacion', slug: 'autoevaluacion', title: 'Autoevaluación y coevaluación', tipo: 'plantilla', grupo: 'evaluacion', orden: 3, descripcion: 'Hoja para que el alumnado se autoevalúe o evalúe al equipo según unos criterios y una escala.', comoUsar: 'Edita los criterios, reparte la hoja y que el alumnado marque su valoración. Exporta o imprime.' },
  { componente: 'PlanRefuerzo', slug: 'plan-refuerzo', title: 'Plan de refuerzo', tipo: 'plantilla', grupo: 'aula', orden: 4, descripcion: 'Ficha de refuerzo o recuperación para un alumno: áreas, medidas, actividades, temporización y seguimiento.', comoUsar: 'Rellena los campos del plan para el alumno, guárdalo (se autoguarda) y expórtalo o imprímelo.' },
  { componente: 'RegistroAula', slug: 'registro-aula', title: 'Registro de aula', tipo: 'plantilla', grupo: 'aula', orden: 5, descripcion: 'Hoja de seguimiento del grupo: asistencia, actitud, entregas y observaciones por alumno.', comoUsar: 'Añade los alumnos, anota el seguimiento de la sesión y expórtalo o imprímelo.' },
  { componente: 'MedidasDUA', slug: 'medidas-dua', title: 'Medidas DUA / adaptación', tipo: 'plantilla', grupo: 'aula', orden: 6, descripcion: 'Plantilla de medidas de atención a la diversidad (DUA): barreras, ajustes, recursos y seguimiento.', comoUsar: 'Describe el contexto, las barreras y los ajustes (representación, acción, implicación), y expórtalo.' },
];

const BY_SLUG = new Map(GENERADORES_NATIVOS.map((g) => [g.slug, g]));
export function generadorPorSlug(slug: string): GeneradorNativo | undefined { return BY_SLUG.get(slug); }

export function gruposNativos(): { grupo: GrupoGenerador; label: string; items: GeneradorNativo[] }[] {
  const defs: { grupo: GrupoGenerador; label: string }[] = [
    { grupo: 'evaluacion', label: 'Evaluación' },
    { grupo: 'aula', label: 'Atención y aula' },
  ];
  return defs.map((d) => ({
    ...d,
    items: GENERADORES_NATIVOS.filter((g) => g.grupo === d.grupo).sort((a, b) => a.orden - b.orden),
  })).filter((g) => g.items.length > 0);
}
