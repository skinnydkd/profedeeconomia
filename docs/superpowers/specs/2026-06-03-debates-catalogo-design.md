# Spec — Catálogo de Debates (completar la sección)

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: producción de contenido (17 debates nuevos) sobre la sección `/debates/` ya existente

## 1. Objetivo

Completar la sección `/debates/` (hoy: marco + 1 pilot) con un catálogo de **~18 debates,
3 por familia**, todos `estado: publicado`, siguiendo exactamente el patrón del pilot
(`src/content/debates/mercado-estado/01-salario-minimo.mdx`). No hay cambios de
infraestructura: solo se añaden ficheros MDX a la colección `debates`.

## 2. Decisiones de alcance (acordadas en brainstorming)

- **3 debates por familia** (las 6 familias), ≈18 total. El pilot ya cubre el #1 de
  `mercado-estado`, así que se redactan **17 nuevos**.
- **`estado: publicado`** (salen vivos en producción), con una **revisión de calidad**
  (precisión económica, equilibrio de ambas posturas, acentos, sin emojis, unidades reales)
  por debate antes de publicar.
- Mismo patrón que el pilot: frontmatter completo + cuerpo (argumentario por bando, mecánica
  con `<Fases>`, ficha de alumno imprimible con `<FichaAlumno>`).

## 3. Catálogo (18 debates, 3 por familia)

Numeración = `orden` y prefijo de fichero `src/content/debates/{familia}/{nn}-{slug}.mdx`.

### Mercado y Estado (`mercado-estado`)
1. *(existe)* ¿Debe el Estado subir el salario mínimo? — `01-salario-minimo`
2. ¿Deben limitarse por ley los precios del alquiler? — `02-tope-alquileres` · formato `parlamentario`
3. ¿Sería buena idea una renta básica universal? — `03-renta-basica` · `mesa-redonda`

### Trabajo y desigualdad (`trabajo-desigualdad`)
1. ¿Hay que implantar la jornada laboral de 4 días? — `01-jornada-4-dias` · `parlamentario`
2. ¿Deben subir los impuestos a las grandes fortunas? — `02-impuesto-grandes-fortunas` · `parlamentario`
3. ¿Es justo el impuesto de sucesiones? — `03-impuesto-sucesiones` · `dilema-etico`

### Globalización y comercio (`globalizacion-comercio`)
1. ¿Proteccionismo o libre comercio? — `01-proteccionismo-libre-comercio` · `parlamentario`
2. ¿Deslocalizar la producción: bueno o malo? — `02-deslocalizacion` · `mesa-redonda`
3. ¿Comprar local o comprar barato (importado)? — `03-comprar-local-vs-barato` · `dilema-etico`

### Sostenibilidad y crecimiento (`sostenibilidad-crecimiento`)
1. ¿Decrecimiento o crecimiento verde? — `01-decrecimiento-vs-crecimiento-verde` · `mesa-redonda`
2. ¿Hay que limitar los vuelos cortos por el clima? — `02-vuelos-cortos` · `parlamentario`
3. ¿Quién debe pagar la transición ecológica? — `03-quien-paga-transicion` · `mesa-redonda`

### Ética, empresa y consumo (`etica-empresa-consumo`)
1. ¿La responsabilidad social de las empresas es real o *greenwashing*? — `01-rsc-vs-greenwashing` · `juicio-simulado`
2. ¿Debe limitarse la publicidad dirigida a menores? — `02-publicidad-menores` · `parlamentario`
3. ¿Debe haber un tope a los sueldos de los altos directivos? — `03-tope-sueldos-directivos` · `dilema-etico`

### Dinero, tecnología y futuro (`dinero-tecnologia-futuro`)
1. ¿Las criptomonedas: futuro del dinero o burbuja? — `01-criptomonedas` · `mesa-redonda`
2. ¿Destruirá la IA más empleo del que crea? — `02-ia-y-empleo` · `parlamentario`
3. ¿Hacia una sociedad sin dinero en efectivo? — `03-sociedad-sin-efectivo` · `mesa-redonda`

(Los formatos son orientativos; al redactar se elige el más natural entre `parlamentario`,
`mesa-redonda`, `juicio-simulado`, `dilema-etico`, `fishbowl`.)

## 4. Patrón de cada debate (igual que el pilot)

**Frontmatter** (todos los campos del schema `debates`):
- `title`, `mocion` (afirmación clara y debatible), `familia`, `orden`, `descripcion` (one-liner),
  `formato`, `duracion` (p. ej. "50-55 min"), `agrupacion`, `nivel` (`[bach]`, `[bach, fp]`,
  `[eso, bach]`… según el tema), `objetivos` (≥3), `conceptos_clave`.
- `posturas`: 2 (a veces 3) con `id`, `label`, `sintesis`; típicamente `a-favor` / `en-contra`.
- `unidades_relacionadas`: **2-3 pares `{asignatura, unidad}` REALES y publicados**, validados
  contra los libros al redactar (no de memoria). Cada redactor hace `grep` en
  `src/content/asignaturas/*/libro/*.mdx` por los conceptos del debate y confirma `unidad:` +
  `estado: publicado`.
- `competencias_clave` (p. ej. `["CCL", "CPSAA", "CC"]` — el debate trabaja sobre todo la
  comunicación lingüística y la competencia ciudadana), `competencias_especificas: []`.
- `rubrica`: 4 criterios (calidad de argumentos, uso de evidencia, capacidad de refutación,
  expresión oral y turnos), cada uno con `competencia`.
- `lang: es`, `estado: publicado`.

**Cuerpo MDX** (imports `Argumentario`, `Fases`, `FichaAlumno` desde `@components/debates/`):
- `## De qué va` — contexto breve y neutral del tema.
- `## Argumentario` — un `<Argumentario postura="..." tono="favor|contra">` por bando, con
  3-4 argumentos con evidencia/datos reales y honestos. **Ambas posturas igual de fuertes**
  (no caricaturizar ninguna).
- `## Cómo se desarrolla` — un `<Fases fases={[...]}>` con preparación → aperturas → réplica →
  turno del público → cierre → debrief, con tiempos.
- Una `<FichaAlumno>` imprimible: moción, espacio para postura y argumentos propios, y un
  argumento rival a refutar.

## 5. Calidad (revisión por debate)

Cada debate pasa una revisión que verifica: precisión económica (sin errores de concepto),
**equilibrio real** de ambas posturas, datos/ejemplos plausibles y no inventados como cifras
exactas falsas, acentos correctos, **sin emojis pictográficos**, `unidades_relacionadas`
apuntando a unidades publicadas reales, y frontmatter válido contra el schema.

## 6. Verificación

- `astro build` completo verde: las ~18 páginas de detalle prerenderizan; el hub muestra las
  6 familias pobladas; `_print-isolation` sigue verde.
- Smoke en producción tras el merge: varias rutas `/debates/{familia}/{slug}/` → 200.

## 7. Fuera de alcance

- Cambios en la infraestructura de la sección (schema, componentes, páginas) — ya están.
- Versión imprimible más allá de la ficha de alumno existente.
- Traducción ca/val.
