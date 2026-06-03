# Catálogo de Debates — Implementation Plan

> Content-production plan. Spec: docs/superpowers/specs/2026-06-03-debates-catalogo-design.md

**Goal:** Add 17 new `estado: publicado` debates (3 per family) following the pilot pattern, each with real `unidades_relacionadas`, then verify build and ship to production.

## Tasks
- **Task 1-6 (one per family):** produce that family's new debates (mercado-estado: 2; others: 3) as MDX files under `src/content/debates/{familia}/`, following the pilot `01-salario-minimo.mdx` exactly (frontmatter + Argumentario/Fases/FichaAlumno body). Real units grepped+validated from published libros. Balanced both sides. No emojis. Accents correct.
- **Task 7 (quality review):** per-family read-only review — economic accuracy, balance, real published units, accents, no emojis, valid frontmatter. Fix issues.
- **Task 8:** full `astro build` green; PR feat/debates-catalogo → dev → main; verify production.

## Per-debate contract: identical to src/content/debates/mercado-estado/01-salario-minimo.mdx
Frontmatter all schema fields + `estado: publicado`; body = `## De qué va`, `## Argumentario` (one `<Argumentario>` per side, 3-4 evidence-backed arguments), `## Cómo se desarrolla` (`<Fases>`), `<FichaAlumno>`. unidades_relacionadas = 2-3 real {asignatura, unidad} validated against published libro frontmatter.
