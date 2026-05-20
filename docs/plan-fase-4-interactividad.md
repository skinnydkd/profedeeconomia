# Plan de ejecución — Fase 4: Interactividad ampliada (eje D)

> Acordado con Pau el 2026-05-20: hacer la Fase D **entera, en orden, con cobertura amplia** (subagentes en paralelo, como con los diagramas). Modo recomendado del [plan de mejora](./plan-mejora-libros-2026.md).

## Arquitectura existente

- Calculadoras = islas Preact en `src/components/calculadoras/*.tsx`, montadas con `client:load` en `src/pages/[asignatura]/recursos/[slug].astro`, seleccionadas por `recurso.data.componente` (enum en `src/content.config.ts`).
- Cada recurso es un `.md` en `src/content/asignaturas/{slug}/recursos/` con `componente: 'X'`.
- Estilos compartidos `.calc__*` (y `.bi__*`, `.cv__*`) viven en el `<style is:global>` de `[slug].astro`.

## Disciplina TDD (CLAUDE.md)

Lógica de cálculo compleja → **función pura testeada**. Setup nuevo:
- `vitest` (devDep) + `vitest.config.ts` (entorno node, `src/**/*.{test,spec}.ts`).
- Lógica en `src/lib/calc/*.ts`, importada por los `.tsx`. Tests en `src/lib/calc/*.test.ts`.
- `npm test` antes de cada commit. Helper compartido: `src/lib/calc/format.ts` (EUR/%, parse es-ES).

## Olas de ejecución

### Ola 0 — Setup (HECHO)
Vitest + config + `format.ts` testeado + `jspdf` instalado (para el CV).

### Ola 1 — Robustecer las 4 calculadoras existentes
Una subtarea por componente. Extraer lógica a `src/lib/calc/`, tests, y mejorar el componente:
- **ADASSimulator** (Eco1B U8) → modelo menos lineal: tipo de interés, expectativas, brecha de producción visualizada. `lib/calc/ad-as.ts`.
- **BuscadorItinerarios** (FOPP U5) → de 8 a 16-20 itinerarios + filtro por CCAA. `lib/calc/itinerarios.ts` (datos + matching).
- **GeneradorCVEuropass** (FOPP U9) → descarga **PDF real** con jsPDF (además del print). `lib/calc/cv-pdf.ts`.
- **CalculadoraNominaESO** (Eco4ESO U8) → IRPF con hijos, discapacidad, deducciones; tramos 2026. `lib/calc/nomina.ts`, `lib/calc/irpf.ts`.

### Ola 2 — 8 calculadoras/simuladores nuevos
Crear `.tsx` + `lib/calc/*.ts` + tests. **El cableado compartido lo hace el hilo principal** (enum `componente`, imports en `[slug].astro`, `.md` de recurso) para evitar conflictos en paralelo.
- **EDMN**: DCF (Discounted Cash Flow); ratios financieros con benchmarks sectoriales.
- **Eco 1BACH**: elasticidad con gráfico; multiplicador del gasto con AD-AS.
- **Eco 4ESO**: IRPF declaración real; coste coche propio vs alquiler/transporte.
- **FOPP**: test vocacional RIASEC Holland (30 preguntas); presupuesto universidad 4 años.

### Ola 3 — Funcionalidades transversales
- **Persistencia localStorage**: notas de los tests (QuizPlayer scores), bookmarks, notas por unidad.
- **Timelines interactivas**: UE (Eco1B U12), itinerarios (FOPP U5).
- **Tooltips** al pasar el ratón por elementos de los diagramas (hover info extra).

## Cableado de una calculadora nueva (checklist)

1. `src/lib/calc/<x>.ts` + `<x>.test.ts` (lógica pura, TDD).
2. `src/components/calculadoras/<X>.tsx` (UI Preact, importa la lógica, usa clases `.calc__*`).
3. `componente` enum en `src/content.config.ts` → añadir `'<X>'`.
4. `src/pages/[asignatura]/recursos/[slug].astro` → import + `{recurso.data.componente === '<X>' && <X client:load />}`.
5. `src/content/asignaturas/{slug}/recursos/<slug>.md` con `componente: '<X>'`, `estado: publicado`.
6. Estilos propios (si hace falta) en el `<style is:global>` de `[slug].astro`.
7. `npm test` + `npm run build` verdes.

## Verificación por ola

- `npm test` verde (lógica).
- `npm run build` verde (191+ páginas).
- Revisión visual de Pau en el navegador (las calculadoras no se validan solo con build/test).

## Fuera de alcance

- Backend / cuentas (Fase 2 plataforma).
- Catalán/valenciano.
- Cuadernos de actividades PDF (ver [plan aparte](./plan-cuadernos-actividades.md)).
