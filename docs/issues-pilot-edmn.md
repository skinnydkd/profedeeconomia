# EDMN 2BACH — Issues d'auditoria (pilot innovació)

Data: 2026-05-27
Tipus: visuals (paged.js) + contingut.

## Visuals

### B-001 — TOC overflow al canvi de pàgina · ✓ Resolt a Task 0.3

- Descripció: ítems del TOC que es trenquen entre dues pàgines re-flueixen
  amb el `lema` en columna vertical estretíssima al marge esquerre.
  Capturat al screenshot del 2026-05-27 amb l'ítem 06 "El contrato de
  trabajo y tus derechos" de l'IPE1-FP.
- Causa: `.toc__item` a `imprimir.astro` usa
  `display: grid; grid-template-columns: 16mm 1fr auto` sense
  `break-inside: avoid`. Paged.js fragmenta l'ítem entre pàgines i el
  grid items perden el seu ample esperat.
- Severitat: alta (visible al primer fullejada del llibre).
- Fix aplicat: `break-inside: avoid` + `page-break-inside: avoid` al
  `.toc__item`, més `-webkit-line-clamp: 2` al `.toc__lede` perquè els
  lemes massa llargs es trunquen a 2 línies amb el·lipsis en comptes de
  forçar el trencament.

### B-002 — `build-book-pdf.mjs` apunta a `dist/` en comptes de `dist/client/` · ✓ Resolt

- Descripció: després de la migració a l'adaptador @astrojs/vercel, els
  fitxers estàtics es generen a `dist/client/` però el script de PDF
  servia `dist/` arrel, donant 404 a totes les rutes.
- Severitat: alta (bloquejava qualsevol generació de PDF).
- Fix aplicat: detecció automàtica — si existeix `dist/client/`, l'usa;
  si no, fa fallback a `dist/`. Sense canviar el comportament esperat
  per a builds antics.

## Contingut

Pendents d'omplir si en surten més durant el pilot o aplicació d'altres
fases.

## Pilot completat

Data: 2026-05-27

- Tots els 7 components nous renderitzen correctament al build.
- El PDF d'EDMN 2BACH genera amb èxit (266 pàgines).
- L'apèndix EBAU substitueix el PDF independent.
- El Reto del curso obri el llibre amb la rúbrica.
- U6 és la unitat pilot completa amb els 7 patrons aplicats.

Pendent: aplicar el patró a U1-U5 i U7-U12 (nou pla).
