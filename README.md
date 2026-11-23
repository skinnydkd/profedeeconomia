# profedeeconomia.es

Plataforma editorial para profesores de instituto de economía, empresa y
finanzas. Estructura **por asignatura**: cada una con libro, diapositivas,
actividades, tests y recursos. Currículo básico estatal LOMLOE (y autonómico
valenciano en las optativas de Bachillerato).
Producción: https://www.profedeeconomia.es

## Asignaturas (10)

Definidas en `src/lib/asignaturas.ts`: `edmn-2bach`, `eco-1bach`, `eco-4eso`,
`fopp-4eso`, `taller-eco-3eso`, `ipe1-fp`, `ipe2-fp`, `eeae-bach`, `gpe-bach`,
`cjd-bach`. Todas comparten estructura:

```
/<asignatura>/            hub
/<asignatura>/libro/      libro y unidades (MDX)
/<asignatura>/diapositivas/ · actividades/ · tests/ · recursos/
```

Secciones transversales: `/juegos/`, `/jocs-economics/`, `/herramientas/`,
`/generadores/`, `/emprendimiento/`, `/debates/`, `/dinamicas/`, `/proyectos/`,
`/olimpiada/`, `/sobre/`, `/contacto/`, `/legal/`. `/oposiciones` redirige (301)
a oposicioneseconomia.es.

Idiomas: castellano (raíz) y valenciano (`/ca/`), generado por el i18n de Astro
(`es` por defecto, sin prefijo).

## Stack y servicios

- Astro 5 + Preact (islas) + Tailwind 4 + MDX, TypeScript estricto.
- Vercel: salida estática más 10 funciones API (`src/pages/api/jocs/` y
  `src/pages/api/business-game/`).
- Supabase (`supabase/migrations/`): ranking de jocs-economics y Business Game.
- PartyKit (`party/`, `partykit.json`): juegos multijugador Insider y Cajút.
- Vercel Blob: los PDF no viajan en el deploy; `vercel.json` redirige
  `/downloads`, `/slides`, `/ebau-examenes` y `/olimpiada` (`*.pdf`) al Blob.
- GA4 solo con consentimiento previo; Vercel Web Analytics.

## Comandos

```bash
npm install
npm run dev            # servidor en localhost:4321
npm test               # vitest (el pretest regenera manifiestos)
npm run check          # astro check (tipos)
npm run build          # build de producción a dist/ (prebuild + postbuild)
npm run build:all      # OG + build + todos los PDF (libros, cuadernos, decks...)
npm run build:pdf      # PDF de los libros; otros: build:workbooks, :decks, :debates...
npm run upload:pdfs    # sube los PDF a Vercel Blob (necesita .env)
npm run party:dev      # PartyKit en local
npm run party:deploy   # despliega PartyKit
```

Variables de entorno: ver `.env.example`.

## Dónde vive cada cosa

- `src/content/asignaturas/<slug>/...` contenido MDX; `src/content.config.ts`, esquema.
- `src/pages/`, `src/components/`, `src/layouts/`, `src/lib/`, `src/i18n/`.
- `scripts/` generadores (PDF, OG, manifiestos); `party/` servidores de juegos.
- `docs/` documentación (índice en `docs/README.md`); `documents/plans/` planes.
- `.github/workflows/`: `ci.yml` (tests, tipos, build, diapositivas) y
  `design-lint.yml` (no bloqueante).

## Despliegue

Un push a `main` es un deploy de producción en Vercel. Los cambios que no
afectan al sitio (docs, `.github`, `.claude`) no deben generar build mediante el
Ignored Build Step de Vercel (se configura en el panel del proyecto, no en este repo).

## Sitio antiguo (webpde)

`vercel.json` contiene redirecciones 301 desde las URL del sitio antiguo
(`/empresa.html`, `/economia-1bach.html`, etc.) hacia las rutas por asignatura.
El repo no confirma ninguna URL alternativa donde siga vivo el sitio antiguo.

## Más

`docs/README.md` (índice de documentación) y `CLAUDE.md` (decisiones vinculantes,
estética, flujo de trabajo).
