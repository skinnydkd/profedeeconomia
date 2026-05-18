# Plan de mejora de los 4 libros — 2026

> Pla de millora consensuat amb Pau el 2026-05-18 per a portar els 4 llibres del rebranding (EDMN 2BACH, Eco 1BACH, Eco 4ESO, FOPP 4ESO) del nivell *bon draft* actual al nivell *producte editorial professional*.

## Context

Tras la sesión maratoniana de 2026-05-15/16 que produjo los 4 libros completos (drafted por sub-agentes en sesiones autónomas), el estado de salida es:

| Libro | Units | Líneas MDX | Diagramas SVG | Tests | Actividades | Recursos | Imágenes | PDF | Slides |
|---|---|---|---|---|---|---|---|---|---|
| EDMN 2BACH | 12 | 3.449 | 13 | 12 | 12 | 3 | 44 (PR #24) | 43 MB | 24 |
| Eco 1BACH | 12 | 4.250 | 8 | 12 | 12 | 2 | 48 | 43 MB | 24 |
| Eco 4ESO | 10 | 2.500 | 6 (4+2 reusados) | 10 | 10 | 2 | 30 | 23 MB | 20 |
| FOPP 4ESO | 10 | 2.500 | 4 (3+1 reusado) | 10 | 10 | 2 | 30 | 23 MB | 20 |
| **Total** | **44** | **~12.700** | **31** | **44** | **44** | **9** | **152** | **~132 MB** | **88** |

Diagnóstico inicial de Pau (2026-05-18): *"estan molt bé, tant en contingut com format, però són més que millorables"*. Acordamos un plan de mejora estructurado en **6 ejes de impacto** y **5 fases ordenadas**, en **modo recomendado** (Fases 0-4, sin platforma extendida ni docs docent en esta tanda).

## 6 ejes de impacto

| Eje | Qué abarca | Coste relativo | Impacto |
|---|---|---|---|
| **A. Rigor y actualidad** | Revisión de cifras 2025-2026, citas legales exactas, doctrinales, eliminación de repeticiones cross-libros | Bajo | Alto — credibilidad |
| **B. Profundidad pedagógica** | "Antes de empezar", glosario per unit, "Para profundizar", preguntas de reflexión, reading time, más SolvedExercises | Medio | Alto — utilidad aula |
| **C. Visualidad editorial** | +15-20 diagramas SVG nuevos, QC de imágenes (sustituir las débiles), portadas dignas per cada PDF, micro-tipografía print | Medio-Alto | Alto — diferenciador estético |
| **D. Interactividad ampliada** | +6-8 calculadoras/simuladores, timelines interactivas, persistencia scores tests con localStorage, notes per unit | Alto | Medio-Alto — diferenciador funcional |
| **E. Plataforma** *(no en mode recomanat)* | Búsqueda transversal, a11y, SEO, mobile, dark mode | Alto | Medio |
| **F. Documentación docente** *(no en mode recomanat)* | Guías pedagógicas anuales, plantillas programación LOMLOE, rúbricas, adaptación CCAA | Medio | Alto para captación profesorado |

**Modo elegido**: **Recomendado** (Fases 0, 1, 2, 3, 4 = ejes A, B, C, D). Fases 5-6 (ejes E + F) quedan fuera de esta tanda; se evaluarán cuando se complete el modo recomendado.

## Plan de fases

### Fase 0 — Diagnóstico detallado (1 sesión: 2026-05-18, HOY)

**Objetivo**: identificar las 3 mejoras prioritarias por unit + issues globales.

**Entregables**:
- `docs/diagnostico-libros-2026.md` con findings estructurados por libro y unit
- Lista de cifras desactualizadas a sustituir
- Lista de citas legales a verificar
- Lista de repeticiones entre libros
- Backlog priorizado para las siguientes fases

**Método**: 4 sub-agentes en paralelo, uno por libro. Cada uno lee las units via `git show <branch>:src/content/...` (porque los contenidos viven en PRs abiertos sin merge).

### Fase 1 — Quick wins editorial (2-3 sesiones, eje A)

**Una sesión por libro o por bloque, según volumen de findings**.

**Objetivos**:
- Sweep completo de cifras → 2025-2026 (datos INE, Eurostat, AIReF, BdE más actuales)
- Verificación legal exacta (RD, articles ET, articles LOMLOE)
- Despluploitación cross-libros (Mercadona EDMN+Eco1Bach, Schumpeter EDMN+Eco1Bach, etc. — decidir qué libro mantiene cada caso)
- Format unificado d'atribució d'imatges
- Corrección de cualquier error factual o pedagógico detectado en Fase 0

**Método**: PRs sucesivas, una por libro, aplicando findings de la Fase 0.

### Fase 2 — Profundización pedagógica (4 sesiones, 1 por libro, eje B)

**Una sesión per libro completo**.

**Objetivos por unit**:
- Header con: reading time + pre-requisitos + objetivos checklist visual
- Glosario de 8-12 términos clave per unit
- Sección "Para profundizar" con 3-5 lecturas opcionales (libros, papers, documentales)
- 2-3 preguntas de reflexión abiertas al final
- 1-2 SolvedExercises adicionales en units cuantitativas (los faltantes detectados en Fase 0)
- Refuerzo de los capstones integradores (Units 12 EDMN/Eco1B, Units 9-10 Eco4ESO/FOPP)

**Método**: agentes paralelos per unit, con plantilla unificada para cada bloque pedagógico.

### Fase 3 — Visualidad editorial (3 sesiones, eje C)

**Una sesión per tema**.

**Sesión 3.1 — Auditoría y sustitución de imágenes débiles**:
- Identificar las 15-20 imágenes menos editoriales (basadas en Fase 0)
- Buscar substitutes en Wikimedia / Pexels / Unsplash con criterio más estricto
- Mantener atribución y licencia

**Sesión 3.2 — Nuevos diagramas SVG + variantes de Figure**:
- 15-20 nuevos diagramas (Phillips dinámica, Lorenz interactivo, RIASEC vocacional, etc.)
- Componentes Astro reusables con la paleta Variant C
- **Ampliar `<Figure>` con 5 variants nuevas** (afegit per Pau 2026-05-18): `left` / `right` (flotants amb wraparound), `half`, `full` (bleed), `inline-small` (portraits petits). Distribució objectiu: ~40% default + 20% wide/full + 15% flotants + 15% tight + 10% inline-small. Cal verificar comportament print.

**Sesión 3.3 — Print y tipografía**:
- Diseño de portadas dignas per cada PDF (no solo cubierta simple)
- Tuneo paged.js: widows/orphans, hyphenation, floats
- Re-renderizado de los 4 PDFs

### Fase 4 — Interactividad ampliada (3-4 sesiones, eje D)

**Una sesión per libro o per tipo de feature**.

**Calculadoras nuevas prioritarias**:
- EDMN: Calc. DCF (Discounted Cash Flow) completo, Calc. ratios financieros con benchmarks
- Eco 1BACH: Calc. elasticidad con gráfico, Calc. multiplicador del gasto con visualización AD-AS
- Eco 4ESO: Calc. IRPF declaración real, Calc. coste vehicle propio vs alquiler
- FOPP: Quiz vocacional RIASEC Holland 30 preguntas, Calc. presupuesto universidad 4 años

**Funcionalidades transversales**:
- Persistencia localStorage: scores tests, notas per unit, bookmarks
- Timelines interactivas (Unit 12 Eco 1BACH UE, Unit 5 FOPP itinerarios)
- Hover sobre elements dels diagrames mostra info extra (tooltips)

## Calendario estimado

Ritmo acordado: **1 sesión larga semanal** (típicamente sábado mañana).

| Fecha | Sesión | Fase | Entregable |
|---|---|---|---|
| 2026-05-18 | Sesión 1 | Fase 0 | `docs/diagnostico-libros-2026.md` |
| 2026-05-25 | Sesión 2 | Fase 1.1 | Mejoras eje A — EDMN + Eco 1BACH |
| 2026-06-01 | Sesión 3 | Fase 1.2 | Mejoras eje A — Eco 4ESO + FOPP |
| 2026-06-08 | Sesión 4 | Fase 2.1 | Profundización pedagógica EDMN |
| 2026-06-15 | Sesión 5 | Fase 2.2 | Profundización pedagógica Eco 1BACH |
| 2026-06-22 | Sesión 6 | Fase 2.3 | Profundización pedagógica Eco 4ESO |
| 2026-06-29 | Sesión 7 | Fase 2.4 | Profundización pedagógica FOPP |
| 2026-07-06 | Sesión 8 | Fase 3.1 | Auditoría imágenes + substituciones |
| 2026-07-13 | Sesión 9 | Fase 3.2 | Nuevos diagramas SVG |
| 2026-07-20 | Sesión 10 | Fase 3.3 | Portadas PDF + tipografía print |
| 2026-07-27 | Sesión 11 | Fase 4.1 | Calculadoras EDMN + Eco 1BACH |
| 2026-08-03 | Sesión 12 | Fase 4.2 | Calculadoras Eco 4ESO + FOPP |
| 2026-08-10 | Sesión 13 | Fase 4.3 | Funcionalidades transversales localStorage |
| 2026-08-17 | Sesión 14 (buffer) | — | Revisión final + ajustes |

**Total**: 14 sesiones, ~3 meses (mayo-agosto 2026). Llegaremos al inicio del curso 2026-2027 (septiembre) con los 4 libros profesionalizados.

## Validación con terceros

Pau ha decidido **NO** incorporar beta-test con profesorado/alumnado en esta tanda. Se reserva para una hipotètica Fase 7 posterior si se decide expandir alcance.

## Pre-requisitos al inicio (antes de Fase 1)

Antes de empezar la Fase 1, se necesita:
- **Las 4 PRs de libros (#24, #25, #26, #27) merged a main** en orden #24 → #25 → #26 → #27
- O alternativamente, una branca de integración que las una

Sin esto, las fases siguientes serían inconsistentes (cambios sobre PRs no mergeadas se perderían en conflictos).

**Acción inmediata tras Fase 0**: Pau valida los 4 PRs de libros y los mergea, o autoriza a Claude a hacerlo en cadena con rebase mecánico.

## Out of scope explícito

Confirmado por Pau, fuera de este plan:
- Eje E (plataforma: búsqueda, a11y, SEO, mòbil, dark mode)
- Eje F (documentación docente)
- Validación con terceros (beta-test)
- Expansión a libros FOL/EIE/IAEE/FAG (decisión separada para fase 2027)
- Migración del webpde antiguo (proyecto separado)
- Catalán/Valenciano (i18n CA — futur)

## Mètriques d'èxit del plan

Al finalitzar (agost 2026), els 4 llibres deuran tindre:

- ✅ Zero cifras anteriors a 2024 sense actualitzar
- ✅ Zero cites legals errònies o sense article exacte
- ✅ Cap repetició cross-libros (Mercadona només a un, Schumpeter només a un, etc.)
- ✅ Cada unit té: reading time + glossari (8-12 termes) + "Para profundizar" + preguntes de reflexió
- ✅ +15-20 diagrames SVG nous distribuïts segons necessitat
- ✅ +15-20 imatges substituïdes per millors
- ✅ Portades de PDF de qualitat editorial
- ✅ +6-8 calculadoras/simuladors nous
- ✅ Tests amb persistència de scores
- ✅ Sistema de notes per unit (localStorage)
- ✅ Timelines interactives a 2-3 units clave
- ✅ Build verde, tots els PDFs regenerats, totes les slides regenerades

Quan tots aquests check estiguin verds, els 4 llibres es consideren *llestos per producció* (setembre 2026).
