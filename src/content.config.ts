import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { FAMILIA_SLUGS } from './lib/dinamicas';
import { FAMILIA_DEBATE_SLUGS } from './lib/debates';
import { MATERIA_SLUGS } from './lib/proyectos';
import { BLOQUE_SLUGS } from './lib/olimpiada';

const ASIGNATURA_SLUGS = [
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
const LANGS = ['es', 'ca'] as const;
const ESTADOS = ['borrador', 'revision', 'publicado'] as const;

/* =========================================================
   asignaturas/{slug}/libro/{numero}-{slug}.{md,mdx}
   The single source of truth for each unit. From this MDX
   the website page, the book PDF and the slide deck PDF are
   all derived.
   ========================================================= */
const libro = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/libro/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad: z.number().int().min(1),
    title: z.string(),
    lema: z.string().optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    duracion: z.string().optional(),
    bloque: z.string().optional(),
    sabers: z.array(z.string()).default([]),
    publicado_en: z.coerce.date().optional(),
  }),
});

/* =========================================================
   actividades / tests / recursos — same shape, different folder
   ========================================================= */
const actividades = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/actividades/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad_relacionada: z.number().int().min(1),
    title: z.string(),
    tipo: z.enum(['caso', 'ejercicio', 'debate', 'dinamica', 'proyecto']),
    /** Short summary shown on the card grid. */
    descripcion: z.string(),
    duracion: z.string().optional(),
    /** Optional list of materials the teacher needs to prepare. */
    materiales: z.array(z.string()).default([]),
    /** "individual" / "parejas" / "grupos pequeños (3-5)" / "grupo clase". */
    agrupacion: z.string().optional(),
    /** LOMLOE key competences worked, by code: CCL, CP, STEM, CD, CPSAA, CC, CE, CCEC. */
    competencias_clave: z.array(z.string()).default([]),
    /** Subject-specific competences (ESO/Bach: "CE1", "CE3"…) or learning
     *  outcomes for FP ("RA1", "RA3"…), as worked by the activity. */
    competencias_especificas: z.array(z.string()).default([]),
    /** LOMLOE saberes básicos worked, by code (e.g. "A.1", "B.2"). If empty,
     *  derived from the libro unit (unidad_relacionada) at render time. */
    sabers: z.array(z.string()).default([]),
    /** Worked solution steps for `tipo: ejercicio`. Shown in the teacher edition
     *  of the cuaderno only. Each item may contain inline HTML/markup. */
    solucion: z.array(z.string()).default([]),
    /** True if the activity mirrors an EBAU/PAU exam exercise (only meaningful
     *  for 2.º Bach subjects with EBAU, e.g. EDMN). Shows an "EBAU" badge. */
    ebau: z.boolean().default(false),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* Self-assessment question types. A question without `tipo` is treated as
 * 'opcion-multiple' so the existing tests keep validating unchanged. */
const preguntaMC = z.object({
  tipo: z.literal('opcion-multiple'),
  enunciado: z.string(),
  opciones: z.array(z.string()).min(2).max(6),
  correcta: z.number().int().min(0),
  explicacion: z.string().optional(),
});
const preguntaVF = z.object({
  tipo: z.literal('verdadero-falso'),
  enunciado: z.string(),
  correcta: z.boolean(),
  explicacion: z.string().optional(),
});
const preguntaNum = z.object({
  tipo: z.literal('numerico'),
  enunciado: z.string(),
  respuesta: z.number(),
  tolerancia: z.number().min(0).default(0),
  unidad: z.string().optional(),
  explicacion: z.string().optional(),
});
const preguntaRel = z.object({
  tipo: z.literal('relacionar'),
  enunciado: z.string(),
  // izquierda, derecha y correctas deben tener la misma longitud (validado en
  // la autoría; el render tolera longitudes desiguales sin romper).
  izquierda: z.array(z.string()).min(2),
  derecha: z.array(z.string()).min(2),
  correctas: z.array(z.number().int().min(0)),
  explicacion: z.string().optional(),
});
const preguntaSchema = z.preprocess(
  (val) =>
    val && typeof val === 'object' && !('tipo' in val) ? { ...val, tipo: 'opcion-multiple' } : val,
  z.discriminatedUnion('tipo', [preguntaMC, preguntaVF, preguntaNum, preguntaRel])
);

const tests = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/tests/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad_relacionada: z.number().int().min(1),
    title: z.string(),
    duracion_estimada: z.string().optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
    preguntas: z.array(preguntaSchema).min(1),
  }),
});

const recursos = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/recursos/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad_relacionada: z.number().int().min(1).optional(),
    title: z.string(),
    descripcion: z.string(),
    tipo: z.enum(['simulador', 'calculadora', 'plantilla', 'visualizacion']),
    /**
     * Identifier of the Preact component to render inside the resource page.
     * The dispatch happens in `src/pages/[asignatura]/recursos/[slug].astro`.
     * Add new identifiers there as new components ship.
     */
    componente: z
      .enum(['PuntoMuerto', 'VANTIR', 'Ratios', 'ADASSimulator', 'InteresCompuesto', 'NominaESO', 'Presupuesto503020', 'BuscadorItinerarios', 'GeneradorCVEuropass', 'DCF', 'RatiosBenchmark', 'Elasticidad', 'MultiplicadorGasto', 'IRPFDeclaracion', 'CocheVsAlternativa', 'RIASEC', 'PresupuestoUni', 'Productividad', 'EquilibrioMercado', 'DAFO', 'CanvasBM', 'BCG'])
      .optional(),
    /** External URL for resources hosted elsewhere; ignored when componente is set. */
    url_interactivo: z.string().optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   asignaturas/{slug}/actividades-dinamicas/{numero}-{slug}.mdx
   Decision-tree simulators. The MDX body must contain exactly one
   ```json … ``` fenced block whose content is parsed by
   src/components/actividades/parse-tree.ts.
   ========================================================= */
const actividadesDinamicas = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/actividades-dinamicas/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    unidad_relacionada: z.number().int().min(1),
    title: z.string(),
    tipo: z.enum(['arbol-decisiones']),
    componente: z.enum(['ArbolDecisiones']),
    duracion: z.string().optional(),
    descripcion: z.string().optional(),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
    publicado_en: z.coerce.date().optional(),
  }),
});

/* =========================================================
   programacion — una programación didáctica por asignatura
   ========================================================= */
const programacion = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/programacion/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    title: z.string(),
    /** Short summary shown on the hub card / hero. */
    descripcion: z.string(),
    /** Reference horizon: lectivas/semana and número de evaluaciones. */
    horas_semanales: z.number().optional(),
    num_evaluaciones: z.number().int().min(1).default(3),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   ebau — cuadernos de preparación de la prueba de acceso (PAU/EBAU).
   Varias secciones ordenadas por asignatura; de momento solo EDMN 2BACH (CV).
   ========================================================= */
const ebau = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/ebau/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    /** Comunidad autónoma de referencia de la prueba. */
    comunidad: z.string().default('Comunitat Valenciana'),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   proyecto — cuaderno de proyecto guiado por fases. Mismo
   patrón que `ebau`: varias secciones ordenadas por asignatura.
   De momento solo lo usa GPE (gpe-bach).
   ========================================================= */
const proyecto = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/proyecto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    /** Etiqueta de la fase del proyecto ("Fase 1 — Idea y oportunidad"). */
    fase: z.string().optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   emprendimiento/proyecto — «De cero a empresa».
   Transversal entrepreneurship project. One MDX per phase,
   NOT tied to any asignatura. Source of truth for the phase
   pages and the project workbook PDF.
   ========================================================= */
const proyectoTransversal = defineCollection({
  loader: glob({
    pattern: 'emprendimiento/proyecto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    /** Phase number; also the route param (zero-padded) and sort key. */
    fase: z.number().int().min(1),
    title: z.string(),
    /** Display label, e.g. "Fase 1 — Detecta". */
    fase_label: z.string(),
    /** Core lean phase (true) vs. deepening phase for Batx/FP (false). */
    nucleo: z.boolean().default(true),
    nivel: z.enum(['todos', 'eso', 'bach-fp']).default('todos'),
    /** Brave optional tier (the ★ "venta real" phase). Excluded from numbered itineraries. */
    valiente: z.boolean().default(false),
    duracion: z.string(),
    /** One-line description of the deliverable produced in this phase. */
    entregable: z.string(),
    /** Bridges to specific units of each asignatura. */
    unidades_relacionadas: z
      .array(
        z.object({
          asignatura: z.enum(ASIGNATURA_SLUGS),
          unidad: z.number().int().min(1),
          nota: z.string().optional(),
        })
      )
      .default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    /** Student-workbook content for this phase, rendered identically on the web
     *  phase page and in the printable cuaderno PDF (single source). */
    cuaderno: z
      .object({
        tarea: z.string(),
        reflexion: z.string(),
        orientacion_docente: z.string().optional(),
        plantilla: z.object({
          tipo: z.enum(['canvas-bm', '4p', 'punto-muerto', 'procesos', 'pitch', 'tabla']),
          columnas: z.array(z.string()).optional(),
          filas: z.number().int().optional(),
        }),
      })
      .optional(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   dinamicas/{familia}/{nn}-{slug}.mdx — transversal classroom
   dynamics (role-plays, market simulations, debates). NOT tied
   to a single asignatura; each maps to units across asignaturas
   via `unidades_relacionadas`. Single source for the page + print.
   ========================================================= */
const dinamicas = defineCollection({
  loader: glob({ pattern: 'dinamicas/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    familia: z.enum(FAMILIA_SLUGS),
    /** Sort key within the family; also the filename prefix. */
    orden: z.number().int().min(0),
    /** One-line summary for the hub card. */
    descripcion: z.string(),
    tipo: z.enum(['role-play', 'simulacion-mercado', 'juego-experimental', 'debate', 'negociacion']),
    duracion: z.string(),
    agrupacion: z.string(),
    participantes: z.string().optional(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    materiales_necesarios: z.array(z.string()).default([]),
    /** Cross-asignatura curriculum map. */
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   juegos — material transversal
   ========================================================= */
const juegos = defineCollection({
  loader: glob({
    pattern: 'juegos/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    descripcion: z.string(),
    nivel_recomendado: z.array(z.string()).min(1),
    asignatura_principal: z.enum(ASIGNATURA_SLUGS).optional(),
    duracion: z.string(),
    modo: z.string(),
    estado: z.enum(['publicado', 'pendiente_migracion', 'en_desarrollo']),
    legacy_url: z.string().optional(),
    lang: z.enum(LANGS).default('es'),
  }),
});

/* =========================================================
   jocs-economics — banc de preguntes per al joc multijugador
   Cada fitxer .md = una pregunta; el frontmatter és la font
   de veritat que el builder llegeix per generar el JSON del banc.
   ========================================================= */
const jocsEconomicsPreguntas = defineCollection({
  loader: glob({
    pattern: 'jocs-economics/preguntas/**/*.md',
    base: './src/content',
  }),
  schema: z.object({
    id: z.string().regex(/^(eco|fin|emp)-\d{4}-[a-z0-9-]+$/),
    categoria: z.enum(['economia', 'finances', 'empresa']),
    dificultat: z.number().min(1).max(10),
    opciones: z.array(z.string()).min(2).max(4),
    correcta: z.number().int().min(0),
    explicacion: z.string().optional(),
    estado: z.enum(['borrador', 'revision', 'publicado']).default('borrador'),
    font: z.string().optional(),
    revisat_per: z.string().optional(),
    revisat_at: z.string().optional(),
  }).refine((data) => data.correcta < data.opciones.length, {
    message: 'correcta ha de ser un index vàlid de opciones',
    path: ['correcta'],
  }),
});

/* =========================================================
   reto — pàgines d'obertura i rúbrica del Reto del curs.
   Mateix patró que `ebau` i `proyecto`: seccions ordenades
   per asignatura. De moment només l'usa EDMN 2BACH.
   ========================================================= */
const retoCurso = defineCollection({
  loader: glob({
    pattern: 'asignaturas/*/reto/**/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    asignatura: z.enum(ASIGNATURA_SLUGS),
    orden: z.number().int().min(0),
    title: z.string(),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   debates/{familia}/{nn}-{slug}.mdx — transversal classroom
   debates (motion, sides, argumentary, mechanics, rubric).
   ========================================================= */
const debates = defineCollection({
  loader: glob({ pattern: 'debates/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    mocion: z.string(),
    familia: z.enum(FAMILIA_DEBATE_SLUGS),
    /** Sort key within the family; also the filename prefix. */
    orden: z.number().int().min(0),
    /** One-line summary for the hub card. */
    descripcion: z.string(),
    formato: z.enum(['parlamentario', 'mesa-redonda', 'juicio-simulado', 'dilema-etico', 'fishbowl']),
    duracion: z.string(),
    agrupacion: z.string(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    /** The opposing sides (>= 2). */
    posturas: z.array(z.object({
      id: z.string(),
      label: z.string(),
      sintesis: z.string(),
    })).min(2),
    /** Cross-asignatura curriculum map. */
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    /** Structured rubric → printable ficha + competency link. */
    rubrica: z.array(z.object({
      criterio: z.string(),
      descripcion: z.string(),
      competencia: z.string().optional(),
    })).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   proyectos/{materia}/{nn}-{slug}.mdx — interdisciplinary
   ABP projects crossing economics with another subject.
   ========================================================= */
const proyectos = defineCollection({
  loader: glob({ pattern: 'proyectos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    materia: z.enum(MATERIA_SLUGS),
    orden: z.number().int().min(0),
    descripcion: z.string(),
    reto: z.string(),
    producto_final: z.string(),
    nivel: z.array(z.enum(['eso', 'bach', 'fp'])).min(1),
    duracion: z.string(),
    agrupacion: z.string(),
    objetivos: z.array(z.string()).min(1),
    conceptos_clave: z.array(z.string()).default([]),
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
    competencias_clave: z.array(z.string()).default([]),
    competencias_especificas: z.array(z.string()).default([]),
    rubrica: z.array(z.object({
      criterio: z.string(),
      descripcion: z.string(),
      competencia: z.string().optional(),
    })).default([]),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   olimpiada/fichas — one MDX per thematic block (FPP, oferta-demanda, etc.)
   ========================================================= */
const olimpiadaFichas = defineCollection({
  loader: glob({ pattern: 'olimpiada/fichas/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(), bloque: z.enum(BLOQUE_SLUGS), orden: z.number().int().min(0),
    resumen: z.string(), conceptos_clave: z.array(z.string()).default([]),
    herramienta: z.enum(['PuntoMuerto', 'Equilibrio', 'Elasticidad', 'ADASSimulator']).optional(),
    preguntas_tipicas: z.array(z.string()).default([]),
    competencias_clave: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default('es'), estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   olimpiada/textos — press/taller texts with guided questions
   ========================================================= */
const olimpiadaTextos = defineCollection({
  loader: glob({ pattern: 'olimpiada/textos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(), fuente: z.string(), fecha: z.string(), descripcion: z.string(),
    orden: z.number().int().min(0), temas: z.array(z.string()).default([]),
    bloque: z.enum(BLOQUE_SLUGS).optional(),
    lang: z.enum(LANGS).default('es'), estado: z.enum(ESTADOS).default('borrador'),
  }),
});

/* =========================================================
   emprendimiento/ejemplos — worked company examples (4P / BMC) with chispa.
   emprendimiento/actividades — entrepreneurial-attitude activity kit.
   ========================================================= */
const emprendimientoEjemplos = defineCollection({
  loader: glob({ pattern: 'emprendimiento/ejemplos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['real', 'ficticia', 'local']),
    sector: z.string(),
    problema: z.string(),
    segmento: z.string(),
    modelo: z.enum(['4p', 'bmc']),
    p_producto: z.string().optional(),
    p_precio: z.string().optional(),
    p_plaza: z.string().optional(),
    p_promocion: z.string().optional(),
    bmc: z
      .object({
        socios: z.string(), actividades: z.string(), recursos: z.string(),
        propuesta: z.string(), relaciones: z.string(), canales: z.string(),
        segmentos: z.string(), costes: z.string(), ingresos: z.string(),
      })
      .partial()
      .optional(),
    chispa: z.string(),
    orden: z.number().int().default(0),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

const emprendimientoActividades = defineCollection({
  loader: glob({ pattern: 'emprendimiento/actividades/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    objetivo: z.string(),
    duracion: z.string().optional(),
    agrupacion: z.string().optional(),
    materiales: z.array(z.string()).default([]),
    orden: z.number().int().default(0),
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

export const collections = {
  libro,
  actividades,
  tests,
  recursos,
  actividadesDinamicas,
  programacion,
  ebau,
  proyecto,
  proyectoTransversal,
  emprendimientoEjemplos,
  emprendimientoActividades,
  dinamicas,
  debates,
  proyectos,
  juegos,
  jocsEconomicsPreguntas,
  retoCurso,
  olimpiadaFichas,
  olimpiadaTextos,
};
