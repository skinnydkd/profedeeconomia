# Auditoria 2026-11-23 — lots 4 a 6

Continuació de `2026-11-23-auditoria-lots-1-3.md` (PR #378). Pau va aprovar els lots 4-6 el 2026-11-23.

Branca: `feat/auditoria-2026-11-lots-4-6`, apilada sobre `fix/auditoria-2026-11-lots-1-3`. PR contra aquella branca; es reorienta a `main` quan #378 es fusione.

## Lot 4 — UX i accessibilitat
- Unitat del llibre en mòbil: índex plegable, objectius sense duplicar, fitxa compacta (el contingut començava 8,5 pantalles avall).
- Unitat: índex que marca la secció actual i progrés de lectura; final orientat a l'alumne (test → següent unitat) abans del bloc docent; fila de material amb PDF de diapositives i versió imprimible; CSS d'impressió global.
- Diapositives: posició a l'URL (`#n`), tecla B (pantalla negra), enllaç ES/VAL, barra compacta en mòbil, scroll suau que respecta `prefers-reduced-motion`.
- Navegació: menú mòbil sense scroll ni focus per davall; desplegable per hover amb `aria-expanded` coherent.
- Quiz: «Repasa la unidad» com a enllaç; h3 orfe al test; `<aside>` dins de `main`; diagrames amb scroll enfocables.

## Lot 5 — SEO i captació
- Descripcions úniques a `actividades-dinamicas` (196 pàgines); descripcions retallades a ≤155 caràcters.
- JSON-LD: `BreadcrumbList` als tests i a retos/situaciones/proyecto; Organization amb `@id`.
- Sales de joc i rànquing: `noindex` i fora del sitemap.
- `llms.txt` generat des de `ASIGNATURAS` (deia 9 assignatures).
- Botons «Copiar enlace», «Compartir en Classroom» i «Informar de un error» (mailto) a unitats.
- Peu: llicència CC BY-NC-SA i com citar. Nota curricular (RD 243/2022, RD 217/2022) a la introducció del llibre.

## Lot 6 — projecte
- Imatges originals > 1 MB a `src/assets` (126 fitxers, 696 MB la carpeta) redimensionades a ≤ 2000 px.
- `.gitignore` (`.playwright-mcp/`), col·lecció `juegos` buida, hint `is:inline`.
- Pedaços de dependències dins de la mateixa major (astro 5.18.x, tailwind 4.3.x, sitemap 3.7.x).
- README, índex de `docs/`, HANDOFF marcat com a històric.
- CLAUDE.md: «Estat actual» cert i afirmacions falses corregides (10 assignatures, ca publicat, Supabase/PartyKit en producció, flux PR real). Cap regla vinculant s'esborra.

## Fora (decisió de Pau)
- Cercador (Pagefind: dependència nova i índex que pesa al deploy).
- Pàgina «Novedades»/RSS: CLAUDE.md exclou blog/notícies al MVP.
- Pàgina «recursos para profesorado»: canvi d'estructura.
- Veu en primera persona a `/sobre`, `/contacto`, `/generadores`.
- Estat dels jocs en tornar enrere (Stonks), mode fosc, vista de presentador amb notes.
