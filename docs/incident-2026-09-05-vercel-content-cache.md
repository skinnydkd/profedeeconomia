# 2026-09-05 — Les 16 pàgines noves de CJD no van eixir a producció

## Què va passar

En fusionar el #252 (el llibre de CJD, 16 fitxers de contingut nous), el build
de producció de Vercel va generar 985 URLs en castellà quan el build local i el
de GitHub Actions, sobre el mateix commit `53ba5a2`, en generen 1001.

Les 16 que falten són exactament les que depenen dels fitxers de contingut nous:

- `/cjd-bach/libro/01..08-*/` (8)
- `/cjd-bach/actividades-dinamicas/01..08-*/` (8)

La resta del lloc és idèntica. Les pàgines índex de l'assignatura sí que hi són,
perquè només depenen de `estado: 'publicado'` a `src/lib/asignaturas.ts`, no de
la col·lecció `libro`.

## Comprovacions fetes

| Build | Commit | Memòria cau restaurada de | URLs |
|---|---|---|---|
| Preview del #252 | `b32b96e` | preview anterior de la branca | 1001 |
| **Producció** | `53ba5a2` | build del #251 (sense els fitxers) | **985** |
| GitHub Actions | `53ba5a2` | — (build net) | 1001 |
| Local | `53ba5a2` | — | 1001 |
| Preview de diagnòstic | `da4c527` | **el build de producció trencat** | 1001 |

`git diff b32b96e 53ba5a2` és buit: els dos arbres són el mateix.

## Diagnòstic

La sospita inicial era la memòria cau de build de Vercel: el magatzem de la capa
de contingut d'Astro viu a `node_modules/.astro/data-store.json`
(`config.cacheDir`), `node_modules` forma part d'eixa memòria cau, i el build de
producció la va restaurar del #251, on els 16 fitxers encara no existien.

**La prova la descarta.** El preview de diagnòstic (`da4c527`) és un canvi només
de documentació, sense tocar cap config, i Vercel li va restaurar la memòria cau
del build de producció trencat. Tot i així en va generar 1001. O siga que un
magatzem vell no perd fitxers nous: el `glob()` loader d'Astro 5.18 els detecta
igual (comprovat també en local).

Queda, doncs, com una errada d'una sola vegada del primer build que va veure els
fitxers nous. **El remei és tornar a desplegar `main`**, amb memòria cau o sense:
qualsevol build posterior ja els agafa.

## Com detectar-ho una altra vegada

La línia `[sitemap-i18n-alternates] sitemap-0.xml: mirrored N URLs` del registre
de build diu quantes URLs en castellà s'han generat. Si eixe número no coincidix
amb el del build de GitHub Actions del mateix commit, falta contingut.
