# Mejora del proyecto de emprendimiento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Enrich «De cero a empresa» with a sparkly company-examples library, entrepreneurial-attitude activities (micro + kit), and an "interview entrepreneurs" project with a printable template.

**Architecture:** Two new MDX collections (`emprendimientoEjemplos`, `emprendimientoActividades`) + an `EjemploEmpresa` card component + galleries + a fixed interview-project page with a pagedjs PDF template. Phases get micro-activities via existing `Callout`/`Steps`.

**Tech Stack:** Astro 5 content collections, MDX, pagedjs-cli.

---

## File Structure
- `src/content.config.ts` — add `emprendimientoEjemplos`, `emprendimientoActividades` collections.
- `src/components/emprendimiento/EjemploEmpresa.astro` — card (props: entry or slug; renders 4P or BMC + chispa).
- `src/pages/emprendimiento/ejemplos/index.astro` — gallery.
- `src/pages/emprendimiento/actividades/index.astro` — kit gallery.
- `src/pages/emprendimiento/entrevista-emprendedores/index.astro` — project page.
- `src/pages/emprendimiento/entrevista-emprendedores/imprimir.astro` — printable template.
- `scripts/build-entrevista-pdf.mjs` — pagedjs → `public/downloads/entrevista-emprendedores-plantilla.pdf`.
- `src/pages/emprendimiento/index.astro` + `proyecto/index.astro` — MODIFY: integration links.
- Content (Fase 2): `src/content/emprendimiento/{ejemplos,actividades}/*.mdx`; phase MDX micro-activities.

---

# FASE 1 — Marco

## Task 1: Collections schema
- [ ] In `src/content.config.ts` add:
```ts
const emprendimientoEjemplos = defineCollection({
  loader: glob({ pattern: 'emprendimiento/ejemplos/**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    nombre: z.string(),
    tipo: z.enum(['real', 'ficticia', 'local']),
    sector: z.string(),
    problema: z.string(),
    segmento: z.string(),
    modelo: z.enum(['4p', 'bmc']),
    // 4P
    p_producto: z.string().optional(), p_precio: z.string().optional(),
    p_plaza: z.string().optional(), p_promocion: z.string().optional(),
    // BMC (9 bloques)
    bmc: z.object({
      socios: z.string(), actividades: z.string(), recursos: z.string(),
      propuesta: z.string(), relaciones: z.string(), canales: z.string(),
      segmentos: z.string(), costes: z.string(), ingresos: z.string(),
    }).partial().optional(),
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
```
- [ ] Register both in `collections`. `npx astro check --minimumSeverity error` → no new errors. Commit.

## Task 2: EjemploEmpresa component
- [ ] Create `src/components/emprendimiento/EjemploEmpresa.astro`. Props: `{ ejemplo }` (a collection entry's data) OR `{ slug }` (then it `getCollection('emprendimientoEjemplos')` and finds it). Renders a card: `nombre`, a `tipo` tag, `problema` + `segmento`, then either a 4-cell 4P grid (Producto/Precio/Plaza/Promoción) or a 9-cell BMC grid, and `chispa` as a footer one-liner. Per-tipo accent colour. Scoped styles (web + a `@media print` compact variant). Commit.

## Task 3: Galleries
- [ ] `src/pages/emprendimiento/ejemplos/index.astro` — `getCollection('emprendimientoEjemplos')` (published), sort by `orden`, render a grid of `<EjemploEmpresa ejemplo={e.data} />` with a BaseLayout hub header. Filter chips by tipo/modelo (CSS/JS, optional).
- [ ] `src/pages/emprendimiento/actividades/index.astro` — `getCollection('emprendimientoActividades')` (published), render each as a card (title, objetivo, duracion) linking to a detail OR rendering the body inline (`render(entry)` + `<Content/>`). Choose inline accordion-free list for simplicity.
- [ ] Build green. Commit.

## Task 4: Interview project + printable template
- [ ] `src/pages/emprendimiento/entrevista-emprendedores/index.astro` (BaseLayout): instrucciones, metodología, ética/consentimiento, el guion de petición, las 10 obligatorias + ~30 optativas (as ordered/unordered lists), entrega (correo genérico `hola@profedeeconomia.es`). A "Descargar plantilla" button → `/downloads/entrevista-emprendedores-plantilla.pdf`.
- [ ] `src/pages/emprendimiento/entrevista-emprendedores/imprimir.astro` — print-only template: header (negocio/emprendedor/dirección/alumnos), the 10 obligatorias with answer space, 5 optativas blanks. `<meta name="robots" content="noindex">`. Paged.js polyfill like other print routes.
- [ ] `scripts/build-entrevista-pdf.mjs` — copy the structure of `scripts/build-proyecto-transversal-pdf.mjs`: serve dist, pagedjs the imprimir route → `public/downloads/entrevista-emprendedores-plantilla.pdf`. Add `"build:entrevista"` to package.json; wire into `build:all`.
- [ ] `npm run build && node scripts/build-entrevista-pdf.mjs` → PDF generated. Commit.

## Task 5: Integration links + noindex/sitemap
- [ ] `src/pages/emprendimiento/index.astro` (and/or `proyecto/index.astro`): add cards/links to «Ejemplos con chispa» (`/emprendimiento/ejemplos/`), «Kit de actividades» (`/emprendimiento/actividades/`) and «Entrevista a emprendedores» (`/emprendimiento/entrevista-emprendedores/`).
- [ ] Add a link to the interview project from `src/content/asignaturas/eco-4eso/libro/09-*.mdx` (or its actividades) — a `RecursoDestacado`/`MirarFora`-style pointer.
- [ ] Extend the sitemap filter in `astro.config.mjs` to drop `/entrevista-emprendedores/imprimir/` (it is noindex). Build green; no broken links. Commit. PR Fase 1.

---

# FASE 2 — Contenido (subagentes)
- [ ] **Ejemplos (~8-10)**: real (Spotify, Mercadona, Glovo, Hawkers…), ficticias divertidas (inventadas, libres de derechos), 1-2 locales. Cada uno con 4P o BMC verificado y `chispa`. Tono con gracia pero pedagógico; reales correctos, ficticias claramente ficticias. Files in `emprendimiento/ejemplos/`.
- [ ] **Micro-actividades**: editar las fases 1,2,4,5,7,11 de `emprendimiento/proyecto/` añadiendo un `Callout`+`Steps` (icebreaker, pitch 1 min, role-play entrevista, message-test, conflicto, pitch+feedback). MDX-safe.
- [ ] **Kit (~6-8)**: `emprendimiento/actividades/` — retos de pedir, perder la vergüenza, hablar en público, decir que no, negociar. Cada una con objetivo/pasos/variantes.
- [ ] Build green; revisión de tono/calidad. Regenerar el PDF del proyecto transversal. PR Fase 2.

---

## Self-Review (plan vs spec)
- Spec §3.1 ejemplos collection + component + galería → T1, T2, T3. ✓
- Spec §3.2 micro-actividades en fases → Fase 2 (Callout/Steps). ✓
- Spec §3.3 kit collection + ruta → T1, T3, Fase 2. ✓
- Spec §3.4 entrevista page + plantilla PDF → T4. ✓
- Spec §3.5 integración → T5. ✓
- Spec §5 testing → T3/T4 build + PDF; T5 links/sitemap. ✓
