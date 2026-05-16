import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ASIGNATURA_SLUGS = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso'] as const;
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
    lang: z.enum(LANGS).default('es'),
    estado: z.enum(ESTADOS).default('borrador'),
  }),
});

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
    preguntas: z.array(
      z.object({
        // The question itself.
        enunciado: z.string(),
        // 2..6 alternatives. The 0-indexed position of the right one
        // is given by `correcta`.
        opciones: z.array(z.string()).min(2).max(6),
        correcta: z.number().int().min(0),
        // Optional one-paragraph rationale shown after the user submits.
        explicacion: z.string().optional(),
      })
    ).min(1),
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
      .enum(['PuntoMuerto', 'VANTIR', 'Ratios', 'BuscadorItinerarios', 'GeneradorCVEuropass'])
      .optional(),
    /** External URL for resources hosted elsewhere; ignored when componente is set. */
    url_interactivo: z.string().optional(),
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

export const collections = {
  libro,
  actividades,
  tests,
  recursos,
  juegos,
};
