# HANDOFF — «De cero a empresa» (proyecto emprendimiento transversal)

## Estat actual (2026-05-31)
**Tanda COMPLETA.** Arquitectura + 3 fases pilot implementades, gate verd, llest per PR/review.

**Branca:** `feat/emprendimiento-proyecto-transversal` (des de main, NO mergejada encara).

### Gate final (Task 9) — verd
- `npx vitest run` → 587 tests passen (55 fitxers), inclosos els 9 d'emprendimiento.
- `npx astro build` → ✓ Complete, sense errors.
- Rutes generades i verificades: `/emprendimiento/`, `/emprendimiento/proyecto/`,
  `/emprendimiento/proyecto/{01,04,08}/`, `/emprendimiento/proyecto/imprimir/`.
- PDF: `public/downloads/emprendimiento-proyecto.pdf` (8 pàgines, portada + 3 fases).

### Commits d'aquesta tanda (totes les 9 tasques del pla)
- `2271633` mòdul itineraris + tests (Task 1)
- `bfc5cae` col·lecció `proyectoTransversal` + fixture (Task 2)
- `13af1e4` 3 fases pilot MDX (Task 3)
- `5272bc4` FaseMeta + PuenteUnidades (Task 4)
- `0652171` índex projecte + MapaTransversal (Task 6)
- `067d668` ruta `[fase].astro` (Task 5)
- `a81050e` ruta `imprimir.astro` + script PDF + package.json (Task 7)
- `714fd79` reescriptura landing `/emprendimiento/` (Task 8)
- `afc8e42` **fix**: ponts a slug real d'unitat (vegeu sota)

### Bug trobat i arreglat al gate (TDD)
`PuenteUnidades` enllaçava a `/<asignatura>/libro/<número>` però la ruta del llibre
usa el slug del fitxer (`09-funcion-financiera`). Tots els ponts donaven 404 — trencant
la transversalitat, que és el cor del projecte. Fix: helper pur `unidadSlug()` a
`src/lib/emprendimiento.ts` (resol número→slug contra la col·lecció `libro` publicada),
amb tests. Si la unitat no està publicada, es renderitza text pla en lloc d'un enllaç trencat.
Verificat: els 5 ponts de les 3 fases resolen a pàgines existents.

## Documents clau
- Spec: `docs/superpowers/specs/2026-05-31-emprendimiento-proyecto-transversal-design.md`
- Pla: `docs/superpowers/plans/2026-05-31-emprendimiento-proyecto-transversal.md`

## Pendents (pròximes tandes, FORA d'aquesta)
- 8 fases restants (2,3,5,6,7,9,10,11) + ★ fase «venta valiente».
- Components interactius per fase (si escau).
- Quan «De cero a empresa» estigui live: suavitzar la targeta Emprendimiento de la home (follow-up de PR #71).

## Notes tècniques
- `fase` al frontmatter = NUMBER; `fase_label` = string. Param de ruta = número zero-padded ("01","04","08").
- Color emprendimiento = mostassa #D4A24C. GPE = granate #8C2F39.
- Ponts: `unidades_relacionadas` guarda número d'unitat; `unidadSlug()` el tradueix a slug real. Verificar sempre contra el catàleg en afegir fases noves.
- Artefactes de build solts a netejar: `buildout.log`, `checkout.log` (no commitejats).

## PR obert en paral·lel (NO confondre)
PR #71 `fix/home-desactualizada`: home actualitzada + /herramientas/ → oposicioneseconomia. Pendent merge de Pau.
