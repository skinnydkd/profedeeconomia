# Nuevas asignaturas — EEAE y GPE (Bachillerato emprendimiento, CV) (2026)

> Acordado con Pau el 2026-05-22 tras investigación curricular a fondo (fuentes oficiales DOGV / ceice.gva.es / educagob). Crear 2 asignaturas nuevas de Bachillerato centradas en emprendimiento, con el mismo pipeline que las 7 existentes (libro + actividades + tests + recursos + programación). GPE lleva **además** un cuaderno de proyecto.

## Contexto y hallazgos de la investigación

El catálogo oficial de Batxillerat de la Comunitat Valenciana (Decret 108/2022) contiene **cuatro** materias de economía/empresa:

| Materia (valenciano) | Castellano | Estado |
|---|---|---|
| Economia | Economía | ✅ ya existe → `eco-1bach` (modalidad Hum. y CC. Sociales) |
| Empresa i disseny de models de negoci | Empresa y Diseño de Modelos de Negocio | ✅ ya existe → `edmn-2bach` (modalidad, 2.º) |
| **Economia, empreneduria i activitat empresarial** | **Economía, Emprendimiento y Actividad Empresarial** | ❌ a crear → `eeae-bach` |
| **Gestió de projectes d'emprenedoria** | **Gestión de Proyectos de Emprendimiento** | ❌ a crear → `gpe-bach` |

Matices verificados:
- **No existe** ninguna materia CV llamada "Fundamentos de gestión de empresa" ni "Gestió de Projectes Empresarials" (eran recuerdos aproximados de Pau; probablemente la antigua "Fonaments d'Administració i Gestió" de LOMCE, ya sustituida por EDMN).
- **GPE** es una **optativa de oferta obligatoria** ofertable en **1.º O 2.º** de Batxillerat (la normativa no la fija a un curso). Es la única optativa autonómica puramente de emprendimiento. Enfocada a que el alumnado **desarrolle su propio proyecto emprendedor** ligado al desarrollo económico local.
- **EEAE** es materia de **modalidad General** (RD 243/2022 · Decret 108/2022), con fuerte peso de emprendimiento y actividad empresarial; distinta de `eco-1bach`.

## Decisiones de Pau

- Crear **las dos** asignaturas, etiquetadas como **Bachillerato (1.º/2.º) sin fijar curso** (la normativa CV es flexible para GPE; EEAE se deja igualmente flexible por decisión de Pau).
- Alcance: **scaffold completo con libro** (no placeholder).
- **GPE**: ambos formatos → **libro teórico** (unidades por bloque) **+ cuaderno de proyecto** (guiado por fases del proyecto emprendedor, estilo cuaderno EBAU existente).
- Colores nuevos validados: **EEAE → verde pino `#2E5E3A`** (soft `#D9E6DC`); **GPE → granate/vino `#8C2F39`** (soft `#F1DADD`).

## Marco normativo (verificado)

- **EEAE** (`eeae-bach`): RD 243/2022 (currículo básico estatal, materia de modalidad General) · Decret 108/2022 (concreción CV). 3 bloques de saberes, 6 competencias específicas.
- **GPE** (`gpe-bach`): Decret 108/2022 (CV), optativa autonómica de oferta obligatoria. 3 bloques (Economia / Emprenedoria / Activitat empresarial), competencias específicas CE1–CE7.

Nota de introducción de cada libro (igual que el resto): basado en el currículo CV (Decret 108/2022); cada centro/CCAA concreta su programación.

Fuentes oficiales:
- Currículo Batxillerat CV (ceice.gva.es): https://ceice.gva.es/va/web/ordenacion-academica/bachillerato/curriculo
- PDF EEAE (GVA): https://portal.edu.gva.es/noucurriculum/wp-content/uploads/sites/1918/2023/02/Economia-emprendimiento-y-actividad-empresarial-1.pdf
- PDF GPE (ceice): https://ceice.gva.es/documents/162640733/364026431/Gesti%C3%B3+de+projectes+d'emprenedoria.pdf
- EEAE en Educagob (estatal): https://educagob.educacionfpydeportes.gob.es/curriculo/curriculo-lomloe/menu-curriculos-basicos/bachillerato/materias/economia-emprendimiento-actividad/desarrollo.html

## Registro de asignaturas (`src/lib/asignaturas.ts` + `src/content.config.ts`)

| num | slug | title (ES) | shortLabel | level | color | curso |
|---|---|---|---|---|---|---|
| 08 | `eeae-bach` | Economía, Emprendimiento y Actividad Empresarial | EEAE | Bachillerato (1.º/2.º) | `eeae` | `bach` |
| 09 | `gpe-bach` | Gestión de Proyectos de Emprendimiento | GPE | Bachillerato (1.º/2.º) | `gpe` | `bach` |

Cambios de modelo de datos:
- Añadir `'bach'` al type `Curso`.
- Añadir `'eeae' | 'gpe'` al type `color`.
- En `ASIGNATURAS_POR_ETAPA.bach.cursos` añadir un subgrupo `bach` → label "Optativas (1.º/2.º)", `asignaturas: filter(curso === 'bach')`, después de 1bach/2bach.
- `eeae-bach`: `modalidad: 'Modalidad General'`.
- `gpe-bach`: `modalidad: 'Optativa de oferta obligatoria'`.

## Colores (sistema visual — aprobado por Pau)

`src/styles/global.css` (junto a los demás `--color-*`):
```css
--color-eeae: #2E5E3A;  --color-eeae-soft: #D9E6DC;   /* verde pino — EEAE */
--color-gpe:  #8C2F39;  --color-gpe-soft:  #F1DADD;    /* granate — GPE */
```
Replicar el patrón `c-{color}` en:
- `src/components/SubjectCard.astro` (`.subject-card.c-eeae`, `.c-gpe`)
- `src/pages/[asignatura]/index.astro` (`.section-card.c-eeae/.c-gpe` y `.title.c-eeae/.c-gpe`)
- Los **4** `imprimir.astro` (libro, actividades, ebau, programacion) — añadir `eeae` y `gpe` al map `ACCENTS` para que los PDF no caigan al terracota por defecto. (También `proyecto/imprimir.astro` nuevo, ver abajo.)

## Cuaderno de proyecto (GPE) — colección nueva `proyecto`

Modelado sobre la colección `ebau` existente (secciones ordenadas con su propia ruta), aislado para no tocar EBAU:
- `src/content.config.ts`: colección `proyecto`, glob `asignaturas/*/proyecto/**/*.{md,mdx}`. Schema: `asignatura`, `orden:int>=0`, `title`, `fase` (string, opcional), `lang`, `estado`.
- Páginas nuevas: `src/pages/[asignatura]/proyecto/index.astro` + `imprimir.astro` (espejo de `ebau/`).
- El hub de la asignatura muestra la sección "Proyecto" solo si hay contenido `proyecto` para ese slug.
- De momento solo `gpe-bach` lo usa.

## Estructura de los libros (unidades)

> Granularidad provisional basada en los 3 bloques oficiales. Los títulos y `sabers[]` exactos se fijan contra los PDF oficiales del DOGV durante la ejecución (Fases B/C), preferiblemente con agentes de investigación como en la tanda anterior. Vigilar **no duplicar** `eco-1bach` ni `edmn-2bach`.

### EEAE — `eeae-bach` (~10 unidades, 3 bloques, 6 CE)
**Bloque 1 — Economía**
1. La economía y el problema de la escasez — necesidades, elección, coste de oportunidad, sistemas económicos.
2. La economía conectada — economía y otras disciplinas, ética, sostenibilidad, perspectiva de género.
3. Cómo funcionan los mercados — oferta, demanda, precios, agentes (intro, sin solapar 1BACH).
4. El entorno económico — indicadores básicos, ciclo, papel del sector público (visión panorámica).

**Bloque 2 — Emprendimiento**
5. El perfil emprendedor — iniciativa, competencias emprendedoras, autoconocimiento.
6. Creatividad e innovación — generación y evaluación de ideas, metodologías creativas.
7. Emprendimiento social y ODS — impacto, ética, sostenibilidad, economía del bien común.

**Bloque 3 — Actividad empresarial**
8. La empresa y sus áreas — tipos, funciones, organización.
9. Estrategia y competitividad — entorno, ventaja competitiva, modelos de negocio.
10. Transformación digital de la empresa — tecnología, digitalización, tendencias.

### GPE — `gpe-bach`: libro teórico (~7 unidades) + cuaderno de proyecto

**Libro teórico** (3 bloques, CE1–CE7) — base conceptual del proyecto:
**Bloc 1 — Economia**
1. Economía y desarrollo económico local — entorno, recursos del territorio, valor local.
2. Agentes y mercados para emprender — clientes, competencia, ecosistema emprendedor.

**Bloc 2 — Emprenedoria**
3. De la persona emprendedora a la idea — perfil, motivación, fuentes de ideas.
4. De la idea a la oportunidad — validación, propuesta de valor, cliente.

**Bloc 3 — Activitat empresarial**
5. El modelo de negocio — BMC, segmentos, ingresos/costes.
6. Viabilidad del proyecto — plan económico-financiero básico, recursos.
7. Puesta en marcha — formas jurídicas, trámites, plan de acción y comunicación.

**Cuaderno de proyecto** (`proyecto`, ~6 fases, orientado a la práctica):
1. Fase 0 — Equipo y reto (constitución del equipo, elección del problema/territorio).
2. Fase 1 — Idea y oportunidad (ideación, validación con clientes).
3. Fase 2 — Modelo de negocio (BMC aplicado al proyecto).
4. Fase 3 — Marketing y prototipo (propuesta de valor, MVP, validación).
5. Fase 4 — Viabilidad (plan económico-financiero del proyecto).
6. Fase 5 — Puesta en marcha y pitch (forma jurídica, plan de acción, presentación final).

## Convenciones (idénticas a los libros existentes)

- MDX en `src/content/asignaturas/{slug}/libro/{NN}-{slug-kebab}.mdx`.
- Frontmatter libro: `asignatura`, `unidad`, `title`, `lema`, `estado`, `objetivos[]`, `conceptos_clave[]`, `duracion`, `bloque`, `sabers[]`.
- Componentes disponibles: `Callout`, `Curiosity`, `RealExample`, `Bibliography`, `KeyTakeaways`, `Steps`, `SolvedExercise`, `Diagram` + diagramas SVG, `Figure`.
- Actividades (8-10/libro): `tipo` (caso/ejercicio/debate/dinamica/proyecto), `unidad_relacionada`, `competencias_clave[]`, `competencias_especificas[]` (CE1…CE7), `materiales[]`, `agrupacion`. `ebau: false` (no son materias EBAU).
- Tests (8-10/libro): `preguntas[]` (enunciado, opciones, correcta, explicacion).
- Recursos: reutilizar calculadoras/simuladores existentes donde encaje (p. ej. `PuntoMuerto`, `RatiosBenchmark`, `VANTIR` para viabilidad; sin duplicar).
- `ebau/` **no aplica** (estas materias no tienen EBAU).
- Programación didáctica por asignatura en `programacion/programacion.mdx`.

## Solapamientos a vigilar (no duplicar)
- **EEAE vs `eco-1bach`** (Economía): EEAE es modalidad General, enfoque emprendedor/aplicado; el bloque de Economía es panorámico/introductorio, no microeconomía completa.
- **EEAE/GPE vs `edmn-2bach`** (EDMN): EDMN es teoría empresarial de modalidad (BMC + áreas funcionales + plan de empresa exhaustivo); EEAE/GPE son más de iniciativa y proyecto emprendedor.
- **GPE libro vs GPE cuaderno**: el libro da la teoría; el cuaderno es la guía práctica paso a paso del proyecto del alumnado.
- **GPE vs `eco-4eso` / `ipe2-fp`**: GPE es nivel Bachillerato con proyecto propio y desarrollo local; evitar repetir el material introductorio de ESO/FP.

## Plan de ejecución (fases)

### Fase A — Scaffold (esta sesión) ✅
- [x] Añadir slugs/entradas en `asignaturas.ts` y `content.config.ts` (`bach`, colores `eeae`/`gpe`).
- [x] Colores en `global.css` + `SubjectCard.astro` + `[asignatura]/index.astro` + 4 `imprimir.astro`.
- [x] Subgrupo "Optativas (1.º/2.º)" en `ASIGNATURAS_POR_ETAPA`.
- [x] Colección `proyecto` + páginas `proyecto/index.astro` + `imprimir.astro`; enlace condicional en el hub.
- [x] Ambas como `estado: 'proximamente'` (hub muestra placeholder; no aparecen en la home). El contenido llega en B/C.
- [x] `npm run build` verde (431 págs) + 258 tests OK.

> Nota: las rutas índice hijas (`/{slug}/libro/`, `/tests/`, etc.) se generan también para asignaturas `proximamente` con un estado vacío elegante ("aparecerán aquí…"); es el comportamiento intencional existente, no enlazado desde el hub placeholder.

### Fase B — Libro EEAE (multisesión)
- [x] `docs/curriculum-eeae-bach.md` (currículo oficial RD 243/2022 + Decret 108/2022, vía agente de investigación).
- [x] EEAE fijada a **1.º Bachillerato** (oficial; modalidad General). `curso: '1bach'`.
- [x] **10 unidades MDX** (Bloc A 1-4 · Bloc B 5-7 · Bloc C 8-10) + 10 tests + 20 actividades, `estado: borrador`. Sin imágenes/diagramas (pasada visual posterior). Build verificado (flip temporal a publicado: 473 págs OK).
- [ ] **Recursos** EEAE (reutilizar calculadoras existentes donde encaje; p. ej. interés compuesto para U4).
- [ ] **Programación** didáctica (`programacion/programacion.mdx`).
- [ ] Revisión de Pau → `estado: publicado` (unidades + asignatura) + PDFs (libro/diapositivas).

### Fase C — Libro + cuaderno GPE (multisesión)
- [x] `docs/curriculum-gpe-bach.md` (verificado contra PDF oficial DOGV con pdftotext; GPE = 6 CE + 5 bloques por fases, distinto de EEAE).
- [x] Libro teórico **7 unidades** + **cuaderno de proyecto 6 fases** (colección `proyecto`) + 7 tests + 14 actividades + recurso (PuntoMuerto) + programación. `estado: borrador`. Build verificado (flip temporal: 464 págs, `/gpe-bach/proyecto/` OK).
- [ ] Revisión de Pau → `estado: publicado` (unidades + cuaderno + asignatura) + PDFs.

## Estado de ejecución
- [x] Investigación curricular (fuentes oficiales DOGV/ceice/educagob)
- [x] Decisiones de Pau (qué materias, sin fijar curso, scaffold completo, colores, GPE doble formato)
- [x] Fase A — scaffold + registro + colores + colección `proyecto`
- [x] Fase B — libro EEAE: 10 unidades + 10 tests + 20 actividades + 2 recursos + programación (borrador). FALTA: revisión de Pau + publicar + PDFs.
- [x] Fase C — GPE: libro 7 unidades + cuaderno 6 fases + 7 tests + 14 actividades + recurso + programación (borrador). FALTA: revisión de Pau + publicar + PDFs.
- [x] **PDFs y diapositivas generados** (con flip temporal a publicado): libro + cuaderno actividades + programación de ambas, cuaderno de proyecto de GPE (nuevo `scripts/build-proyecto-pdf.mjs` + `npm run build:proyecto`), y 34 diapositivas Marp (10 EEAE + 7 GPE, PDF+HTML). En `public/downloads/` y `public/slides/`.
- [ ] **Pendiente común**: revisión de Pau de ambos → flip a publicado (contenido + campo `estado` de las asignaturas en asignaturas.ts). Si Pau edita contenido en la revisión, regenerar los PDFs/diapositivas afectados. → imágenes (pasada visual posterior, como el resto de libros).
- [ ] Imágenes (`<Figure>`) — follow-up posterior, como el resto de libros
- [ ] Revisión visual de Pau (contenido, recursos reutilizados, PDFs)
