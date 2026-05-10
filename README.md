# profedeeconomia.es

Plataforma editorial para profesores de instituto de economía, empresa y
finanzas. Estructura **por asignatura**: cada una con libro, diapositivas,
actividades, tests y recursos. Currículo básico estatal LOMLOE.

> Rebrand de profedeeconomia.es. El sitio actual (webpde) sigue vivo en
> `legacy.profedeeconomia.es` durante la transición.

## Stack

- **Astro 5** + **Preact** (islas para recursos interactivos)
- **Tailwind 4** (vía `@tailwindcss/vite`)
- **MDX** para contenido de los libros (single source of truth: del MDX se
  derivan página web, PDF del libro y diapositivas)
- **Vercel** (hosting + 301 al edge para `/oposiciones`)
- **TypeScript estricto**

## Comandos

```bash
npm install    # primera vez
npm run dev    # servidor de desarrollo en localhost:4321
npm run build  # build de producción a dist/
npm run preview# previsualiza el build
npm run check  # type-check + linting de Astro
```

## Estructura

```
src/
├── content.config.ts          schema de Content Collections (Astro 5)
├── content/                   contenido MDX de los libros (vacío al MVP)
│   └── asignaturas/<slug>/{libro,actividades,tests,recursos}/
├── lib/
│   └── asignaturas.ts         single source of truth de las 4 asignaturas
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   └── SubjectCard.astro
├── pages/
│   ├── index.astro                                home
│   ├── [asignatura]/index.astro                   hub (4 asignaturas)
│   ├── [asignatura]/[seccion].astro               diapositivas/actividades/tests/recursos
│   ├── [asignatura]/libro/index.astro             índice del libro
│   ├── [asignatura]/libro/[unidad].astro          unidad del libro (renderiza MDX)
│   ├── juegos/, herramientas/, emprendimiento/    placeholders
└── styles/
    └── global.css             tokens Variant C vía @theme
```

## Direcció estètica

Variant C (validada 2026-05-10): cream `#FBF6EC` + terracota `#C44E2C` +
mostassa `#D4A24C` con color-coding por asignatura (terracota / teal / mostassa /
berenjena). Tipografía: **Fraunces** (variable, ejes SOFT/WONK) + **Switzer** +
**JetBrains Mono**.

Spec completa en `CLAUDE.md` §"Direcció estètica" y `docs/PRD.md` §6.3-§6.5.

## Documentación

- `CLAUDE.md` — guía vinculante del proyecto
- `docs/PRD.md` — visión, alcance, sitemap, distribución de contenido
- `docs/migration-map.md` — qué viene del webpde antiguo y a dónde
- `docs/curriculum-edmn-2bach.md` — currículo del primer libro (12 unidades)
- `mockups/` — variantes A, B, C en HTML+CSS puros (registro histórico)
