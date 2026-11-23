# Auditoria 2026-11-23 — lots 1 a 3

Origen: auditoria amb 11 subagents (tècnica, seguretat, enllaços, visual, contingut Bach i ESO/FP, seccions transversals, SEO, projecte, màrqueting, UX). Pau va aprovar els lots 1-3 el 2026-11-23.

Branca: `fix/auditoria-2026-11-lots-1-3`. Un sol PR contra `main` (un sol build de Vercel). Commits per unitat lògica.

## Lot 1 — trencat en producció
- Econopoly: pantalles setup/fi/passar dispositiu fora de `.ep2` → botó «Empezar» invisible.
- QuizPlayer «relacionar»: qualifica per índex; amb etiquetes duplicades marca malament respostes correctes.
- `PuenteUnidades.astro`: «Unidad3», «Competencias específicas:CE2» (espais col·lapsats).
- `/api/jocs/leaderboard`: `limit` no numèric → 500.
- Cajút (client PartyKit): sense gestió d'`error`/`close` → «Conectando…» per sempre.
- `<noscript>` a les pàgines de jocs `client:only`.
- 404 sota `/ca/` en castellà.
- `vercel.json`: `/_astro/*` immutable, `/fonts/*` amb caché llarga.
- Bàner de cookies a zoom 400% (WCAG 1.4.10) i dos contrastos < 4,5:1.
- Política de privacitat: declarar el que el codi fa (Supabase, PartyKit, Vercel Web Analytics sense galetes).

## Lot 2 — contingut
- Taller: solució U5 (interès amb ingressos mensuals), etiquetes duplicades als tests 05 i 07.
- FOPP: «Detective laboral» (dates futures, «casos reals» inventats, xifres sense font), delegat de personal (des d'11), Erasmus+ incoherent.
- IPE I: enunciat de nòmina incoherent. Eco 4ESO: retenció < 17.094 €, «¿» al CA, pregunta IVA del test 06.
- Eco 1BACH U3: caixa del pis (100 % finançat), dades BCE/Euríbor 2026 per verificar.
- EEAE U4 prerequisits; GPE U6 «seis vías», 24 % PIB vs 330.000 M€, cas il·lustratiu; GPE activitats en esborrany; CJD dinàmica 11 (IS 19 %).
- 16 enllaços externs morts i 14 `http://`.
- Biaix de longitud: la resposta correcta és la més llarga (92 % Eco 4ESO, 75 % FOPP).

## Lot 3 — identitat visual
- Jocs (econopoly, insider, cajut): esborrar tokens locals desfasats, usar `--color-*` globals; Fraunces a 500; cos ≥ 1rem.
- Vores d'accent d'un sol costat: econopoly, `olimpiada/fichas`, `RIASECTest`.
- Color d'assignatura només per a assignatures (`/juegos`, `/olimpiada`, `/debates`, `/herramientas`).
- Eines amb `--font-display`/`--font-heading` inexistents → `--font-serif`.
- Etiqueta redundant damunt del H1 a diapositives/tests/recursos.
- `theme-color` i `apple-touch-icon`.

## Fora d'aquests lots (decisió o acció de Pau)
- `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` a Vercel (o retirar el rànquing).
- Spend Management i límit de peticions al tallafoc de Vercel; desactivar Speed Insights Plus.
- Titular a l'avís legal (LSSI art. 10).
- Veu en primera persona a `/sobre`, `/contacto`, `/generadores` (lot de marca).
- Lots 4-6 (UX, SEO/captació, projecte).

## Verificació
`npm test`, `npm run check`, `npm run build`; captura d'Econopoly i d'una pàgina de joc al navegador.
