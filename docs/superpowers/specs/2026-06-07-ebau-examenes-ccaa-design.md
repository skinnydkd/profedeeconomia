# Exámenes EBAU por comunidad (EDMN 2BACH) — Design Spec

**Date:** 2026-06-07
**Status:** Approved (design), pending implementation plan
**Branch:** `feat/ebau-examenes`

## Objetivo

Añadir a la asignatura **EDMN 2BACH** (la única de 2º Bachillerato con EBAU —
«Economía de la Empresa») una sección de **exámenes EBAU oficiales de años anteriores,
por comunidad autónoma**, con el examen y su resolución (criterios de corrección) en PDF
descargable. Cobertura objetivo: **2024 y 2025** (convocatoria de junio = ordinaria y de
julio = extraordinaria) de cada CCAA, y **2026 como "próximamente"**.

## Realidad técnica (verificada en brainstorming)

- Los PDFs **no se pueden auto-descargar de examenesdepau.com** (la descarga va por JS;
  el HTML no expone la URL del fichero).
- **Sí se pueden descargar de fuentes oficiales** (portales de universidades/consejerías)
  cuando exponen el PDF directo. Verificado con `curl`: UAH (Madrid) y Junta de Andalucía
  devuelven `application/pdf` real. → Estrategia: **descargar de fuentes oficiales y
  alojar** en nuestro repo.
- **La cobertura será parcial:** no todas las CCAA publican los 4 exámenes + solución como
  PDF directo limpio. Los huecos quedan **"próximamente"**. Sin inventar nada.

## Decisiones del usuario (brainstorming)

- Alojar los PDFs en nuestro web (no enlazar fuera).
- Fuente: portales oficiales (descarga directa por `curl`).
- Alcance de la primera tanda: **las 17 CCAA de una vez**.

## Alcance

- Asignatura: **edmn-2bach** únicamente.
- 17 CCAA: Comunitat Valenciana, Madrid, Andalucía, Aragón, Asturias, Cantabria, Castilla
  y León, Castilla-La Mancha, Cataluña, Extremadura, Galicia, Islas Baleares, Islas
  Canarias, La Rioja, Navarra, País Vasco, Región de Murcia.
- Años/convocatorias: 2024 (junio, julio), 2025 (junio, julio). 2026 = "próximamente".

### Fuera de alcance

- Otras asignaturas (solo edmn-2bach tiene EBAU).
- Años anteriores a 2024 (se pueden añadir luego: el sistema escala solo).
- Generar/derivar contenido de examen (solo se alojan PDFs oficiales reales).
- Tocar la sección EBAU de preparación existente (guía/teoría/simulacros) más allá de
  enlazar la nueva subsección.

## Arquitectura

Patrón espejo de la sección **Olimpiada/simulacros** (registro TS + PDFs estáticos en
`public/` + render agrupado), con **detección automática de ficheros** para el estado
"próximamente".

### 1. Ficheros PDF (estáticos, oficiales)

Ruta: `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`
- `{ccaa}`: slug de comunidad (lista fija, abajo).
- `{anio}`: `2024` | `2025`.
- `{conv}`: `junio` | `julio`.
- `{tipo}`: `examen` | `solucion`.

Ejemplo: `public/ebau-examenes/madrid/empresa-2025-junio-examen.pdf`.
URL pública: `/ebau-examenes/madrid/empresa-2025-junio-examen.pdf`.

### 2. Registro `src/lib/ebau-examenes.ts`

```ts
export interface Ccaa { slug: string; label: string; }

// CV primero (comunidad de Pau), resto alfabético.
export const CCAA_LIST: Ccaa[] = [
  { slug: 'comunidad-valenciana', label: 'Comunitat Valenciana' },
  { slug: 'andalucia', label: 'Andalucía' },
  { slug: 'aragon', label: 'Aragón' },
  { slug: 'asturias', label: 'Asturias' },
  { slug: 'cantabria', label: 'Cantabria' },
  { slug: 'castilla-la-mancha', label: 'Castilla-La Mancha' },
  { slug: 'castilla-y-leon', label: 'Castilla y León' },
  { slug: 'cataluna', label: 'Cataluña' },
  { slug: 'extremadura', label: 'Extremadura' },
  { slug: 'galicia', label: 'Galicia' },
  { slug: 'islas-baleares', label: 'Islas Baleares' },
  { slug: 'islas-canarias', label: 'Islas Canarias' },
  { slug: 'la-rioja', label: 'La Rioja' },
  { slug: 'madrid', label: 'Comunidad de Madrid' },
  { slug: 'murcia', label: 'Región de Murcia' },
  { slug: 'navarra', label: 'Navarra' },
  { slug: 'pais-vasco', label: 'País Vasco' },
];

export const ANIOS = [2025, 2024] as const;        // disponibles (descendente)
export const CONVOCATORIAS = [
  { slug: 'junio', label: 'Junio (ordinaria)' },
  { slug: 'julio', label: 'Julio (extraordinaria)' },
] as const;

export type Tipo = 'examen' | 'solucion';

/** Ruta relativa dentro de public/ (sin barra inicial). */
export function ebauPdfRelPath(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `ebau-examenes/${ccaa}/empresa-${anio}-${conv}-${tipo}.pdf`;
}
/** URL pública (con barra inicial). */
export function ebauPdfHref(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `/${ebauPdfRelPath(ccaa, anio, conv, tipo)}`;
}
```

### 3. Detección automática de disponibilidad (build-time)

La página de detalle, en su frontmatter (Node, en build), comprueba con `fs.existsSync`
qué PDFs hay en `public/ebau-examenes/...`. Para cada `(ccaa, anio, conv)` calcula
`examenDisponible` y `solucionDisponible`. Si no hay examen → "Próximamente". 2026 se
muestra siempre como "próximamente" (no se comprueba fichero). Así, soltar un PDF en la
carpeta lo publica sin tocar código.

### 4. Ruta `src/pages/[asignatura]/ebau/examenes/index.astro`

- `getStaticPaths`: solo asignaturas con sección EBAU publicada (de facto, `edmn-2bach`).
- Construye la estructura `CCAA_LIST × ANIOS × CONVOCATORIAS` + detección de ficheros + la
  fila 2026 "próximamente".
- Render: agrupado por comunidad (CV primero). Por cada comunidad, una tarjeta/bloque con
  filas por año-convocatoria: «Examen (PDF)» + «Resolución (PDF)» como enlaces `download`
  cuando existen; etiqueta «Próximamente» cuando no. UI espejo de
  `src/pages/olimpiada/simulacros/index.astro`.
- Nota legal/atribución: pie indicando que los exámenes son documentos oficiales de las
  pruebas de acceso de cada comunidad, alojados con fin educativo, con mención de la fuente.

### 5. Enlace desde la sección EBAU existente

En `src/pages/[asignatura]/ebau/index.astro`, añadir un enlace/callout a
`./examenes/` («Exámenes oficiales de otras comunidades»). No se cambia el resto de la
sección de preparación.

### 6. Población de PDFs (subagentes, 17 CCAA)

Un subagente por comunidad. Cada uno:
1. Busca (WebSearch) la fuente **oficial** (universidad/consejería de esa CCAA) de los
   exámenes de «Economía de la Empresa» (alias «Empresa y Diseño de Modelos de Negocio»)
   EBAU/PAU/PEvAU/EvAU de **2024 y 2025**, convocatoria ordinaria (junio) y extraordinaria
   (julio), y sus **criterios de corrección / solución**.
2. Para cada PDF con URL directa, lo descarga con `curl` a
   `public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`.
3. **Verifica** cada descarga: HTTP 200, `content-type: application/pdf`, cabecera `%PDF-`,
   tamaño > 20 KB. Si falla, borra el fichero (no dejar PDFs corruptos/HTML).
4. **No inventa**: si no encuentra una fuente oficial con PDF directo para un hueco, lo
   deja vacío (→ "próximamente").
5. Reporta cobertura: qué huecos llenó, fuentes usadas, y qué falta.

Preferencia de fuentes: portal oficial de la CCAA/universidad coordinadora. Evitar
agregadores con descarga por JS (no sirven) y, salvo necesidad, blogs/academias.

### 7. Helper de test (TDD)

`src/lib/ebau-examenes.test.ts`: `ebauPdfRelPath` / `ebauPdfHref` (convención de nombre y
URL) y orden de `CCAA_LIST` (CV primero, 17 entradas).

## Flujo de datos

```
public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{examen|solucion}.pdf   (PDFs oficiales)
   │  fs.existsSync (build) → disponibilidad por (ccaa, anio, conv)
   └─► /[asignatura]/ebau/examenes/ → tabla por comunidad: examen/solución o "próximamente"
                                       (+ 2026 siempre "próximamente")
```

## Testing

- **Unit (TDD):** `ebauPdfRelPath`, `ebauPdfHref`, `CCAA_LIST` (17, CV primero).
- **Build:** `npm run build` genera `/edmn-2bach/ebau/examenes/` sin error.
- **Cobertura:** tras la tanda de subagentes, `find public/ebau-examenes -name '*.pdf'`
  lista los PDFs reales; la página muestra "Descargar" donde hay fichero y "próximamente"
  donde no.
- **Verificación de ficheros:** todos los PDF descargados empiezan por `%PDF-` y pesan
  > 20 KB (sin HTML de error renombrado a .pdf).
- **Manual (Pau):** revisar que cada PDF es el examen correcto (CCAA/año/convocatoria) —
  gate de exactitud; abrir una muestra.

## Riesgos / notas

- **Exactitud del fichero:** el riesgo principal es descargar un PDF equivocado (otra
  asignatura/año). Mitigación: verificación de formato + el subagente registra la URL
  fuente por fichero + revisión manual de Pau. Se prioriza fuente oficial.
- **Cobertura desigual:** se asume y se gestiona con "próximamente"; no es un fallo.
- **Copyright:** exámenes oficiales de pruebas públicas, alojados con fin educativo y
  atribución a la fuente. Decisión del usuario (igual que la sección Olimpiada, que ya
  aloja PDFs en `public/olimpiada/`).
- **`src/pages` + Windows build-break:** la ruta es `.astro`; el test del helper va en
  `src/lib`, nunca como `.ts` suelto en `src/pages` (ver [[project-windows-build-break]]).
- **Nombres CCAA del fichero vs slug del exam en origen:** el slug de asignatura difiere
  por CCAA en origen (p.ej. CV usa «empresa»); nuestro nombre de fichero es uniforme
  (`empresa-...`). El subagente mapea de la fuente a nuestro nombre.
