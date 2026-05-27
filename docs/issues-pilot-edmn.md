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

## Contingut

Pendents d'omplir si en surten més durant el pilot o aplicació d'altres
fases.
