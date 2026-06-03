# Spec — Herramientas: plantillas interactivas + calculadoras nuevas

- **Fecha**: 2026-06-03
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Tipo**: ampliación de la sección `/herramientas/` (2 calculadoras nuevas + 3 plantillas rellenables)

## 1. Objetivo

Ampliar la caja de herramientas `/herramientas/` con **5 herramientas nuevas**, todas
como islas Preact integradas en el registro `HERRAMIENTAS` existente:

- **2 calculadoras**: productividad y equilibrio de mercado.
- **3 plantillas rellenables** (tipo `plantilla`): DAFO, Business Model Canvas y matriz BCG.
  Se escriben en el navegador, se autoguardan (localStorage), se exportan a PNG/PDF y se imprimen.

Se construye sobre la arquitectura ya establecida (registro TS + `HerramientaIsland` +
página de detalle con mapa curricular). Esta es la fase que quedó fuera de alcance del
marco inicial.

## 2. Decisiones de alcance (acordadas en brainstorming)

- **Las 5 a la vez** (un PR).
- **Plantillas** = rellenar + **autoguardar en localStorage** + **exportar PNG/PDF** + imprimir.
- **Equilibrio** = ecuaciones lineales → P*, Q* + **gráfico** SVG + **topes (precio máx/mín) y
  excesos** (escasez/excedente). SIN impuestos (fase futura).
- **Productividad** = productividad **parcial por factor** (trabajo, capital) + **global** +
  **variación %** entre dos periodos.
- **Mapa curricular de las 5 nuevas** = **override manual** en el registro (enfoque A), no
  derivado (no tienen recursos asociados).

## 3. Arquitectura (encaje en la sección existente)

### 3.1 Registro (`src/lib/herramientas.ts`)

- `COMPONENTE_KEYS` += `'Productividad', 'EquilibrioMercado', 'DAFO', 'CanvasBM', 'BCG'` (→ 22).
- Nueva familia en `FAMILIAS_HERRAMIENTA`: `{ slug: 'estrategia-planificacion', label: 'Estrategia y planificación', intro: 'Diagnóstico y diseño: DAFO, modelo de negocio y cartera.', colorVar: '--color-gpe' }`. (Token libre; existe en global.css.)
- 5 entradas nuevas en `HERRAMIENTAS`:
  - `Productividad` → familia `costes-resultados`, tipo `calculadora`.
  - `EquilibrioMercado` → familia `mercados-macro`, tipo `calculadora`.
  - `DAFO`, `CanvasBM`, `BCG` → familia `estrategia-planificacion`, tipo `plantilla`.
- **Override de mapa curricular**: se añade a `Herramienta` un campo opcional
  `unidades_relacionadas?: { asignatura: string; unidad: number }[]`. Para las 5 nuevas se
  rellena con unidades reales (validadas contra los libros publicados al escribir las fichas).

### 3.2 Dispatcher (`src/components/calculadoras/HerramientaIsland.astro`)

Añadir los 5 imports y las 5 ramas `{componente === 'Productividad' && <ProductividadCalc client:load />}`
… etc. (mismo patrón que las 17 actuales).

### 3.3 Página de detalle (`src/pages/herramientas/[familia]/[slug].astro`)

El cálculo de `unidades` pasa a: **usar el override manual del registro si existe, si no
derivar de recursos**:

```ts
const derivadas = unidadesPorComponente(recursos.filter((r) => r.data.estado === 'publicado')).get(componente) ?? [];
const unidades = h.unidades_relacionadas ?? derivadas;
```

(Las 17 existentes siguen derivando; las 5 nuevas usan su override.)

### 3.4 Enum de `recursos` (`src/content.config.ts`)

Añadir los 5 nuevos identificadores al enum `componente` de la colección `recursos`, para
mantenerlo alineado con `COMPONENTE_KEYS` y permitir que en el futuro se puedan embeber en
recursos por asignatura.

## 4. Calculadoras nuevas (patrón existente: lógica pura testeada + isla)

### 4.1 Productividad — `src/lib/calc/productividad.ts` + `ProductividadCalc.tsx`

Lógica pura:
- `productividadFactor(produccion, factor)` = `produccion / factor` (trabajo: producción/trabajadores
  o /horas; capital: producción/unidades de capital). Devuelve `null` o marca inválido si `factor <= 0`.
- `productividadGlobal(valorProduccion, valorFactores)` = `valorProduccion / valorFactores`.
- `variacionPct(p0, p1)` = `(p1 - p0) / p0 * 100` (con guardas para `p0 = 0`).

Isla: inputs de dos periodos (producción, trabajadores/horas, capital, valores), muestra
productividad del trabajo, del capital y global de cada periodo y la variación % entre ambos.

### 4.2 Equilibrio de mercado — `src/lib/calc/equilibrio.ts` + `EquilibrioCalc.tsx`

Modelo lineal: `Qd = a − b·P`, `Qs = c + d·P` (con `b, d > 0`).
Lógica pura:
- `equilibrio(a, b, c, d)` → `{ P: (a−c)/(b+d), Q: a − b·P }`; inválido si `b+d = 0` o `P/Q < 0`.
- `evaluarPrecio(coef, P)` → `{ qd, qs, exceso: qs − qd }` (exceso>0 = excedente/exceso de oferta;
  exceso<0 = escasez/exceso de demanda).
- `intervencion(coef, tipo: 'maximo' | 'minimo', precio)` → cantidad intercambiada (`min(qd, qs)`),
  escasez o excedente, y si el tope es efectivo (precio máx por debajo de P*, precio mín por encima).

Isla: inputs a, b, c, d; muestra P* y Q*; **gráfico SVG** con la recta de demanda (pendiente
negativa), la de oferta (positiva), el punto de equilibrio y, si se activa un precio dado o un
tope, una línea horizontal y el segmento de escasez/excedente resaltado. Tabla con qd, qs y exceso.

## 5. Plantillas rellenables (islas con estado + persistencia + exportación)

### 5.1 Utilidades compartidas (`src/lib/plantillas/`)

- `src/lib/plantillas/persistence.ts` → `usePersistentState<T>(key: string, initial: T)`: hook Preact
  (preact/hooks) que sincroniza estado con `localStorage` bajo `key` (debounced, tolerante a JSON
  inválido / SSR sin window). Una clave por plantilla, p. ej. `pde:plantilla:dafo`.
- `src/lib/plantillas/export.ts` → `exportarNodo(el: HTMLElement, nombre: string, formato: 'png' | 'pdf')`:
  usa `html2canvas` para rasterizar el nodo y descarga PNG, o lo coloca en un `jspdf` A4 apaisado y
  descarga PDF. Reutiliza las dependencias que ya usa `GeneradorCVEuropass.tsx`.
- La lógica de `equilibrio`/`productividad` se testea; los hooks/DOM no (se verifican en build + smoke).

### 5.2 Las tres plantillas

Cada una es una isla `*.tsx` con celdas `contenteditable`/`<textarea>` por bloque, `usePersistentState`
para el contenido, una barra de acciones (Exportar PNG · Exportar PDF · Imprimir · Vaciar) y `@media print`
para imprimir solo el lienzo:

- **`DAFOCanvas.tsx`** — 2×2: Debilidades, Amenazas, Fortalezas, Oportunidades (interno/externo × negativo/positivo).
- **`BusinessModelCanvas.tsx`** — 9 bloques: socios clave, actividades clave, recursos clave, propuestas de
  valor, relaciones con clientes, canales, segmentos de clientes, estructura de costes, fuentes de ingresos.
- **`MatrizBCG.tsx`** — 2×2: Estrella, Interrogante, Vaca, Perro (crecimiento × cuota), texto por cuadrante.

Estilo editorial coherente (tokens existentes, sin colores nuevos más allá de la familia). Sin emojis pictográficos.

## 6. Mapa curricular de las 5 nuevas (override manual)

Cada herramienta nueva lleva `unidades_relacionadas` con 1–3 pares `{asignatura, unidad}` reales:
- DAFO, Canvas, BCG: unidades de estrategia / plan de empresa / modelo de negocio (EDMN 2BACH, EEAE, GPE…).
- Productividad: unidades de producción/empresa (EDMN, Eco 1BACH…).
- Equilibrio: unidades de mercado / oferta y demanda (Eco 1BACH, Eco 4ESO…).
Las unidades se fijan contra los libros publicados al implementar (no de memoria), igual que en Debates.

## 7. Testing (TDD para la lógica)

- `src/lib/calc/productividad.test.ts` — factor, global, variación, guardas (factor 0, p0 0).
- `src/lib/calc/equilibrio.test.ts` — P*/Q*, exceso a un precio, escasez/excedente, tope efectivo o no, casos inválidos.
- `src/lib/herramientas.test.ts` (ampliar) — 22 herramientas; 6 familias; las 5 nuevas con su familia y tipo;
  override `unidades_relacionadas` presente y bien formado en las 5; los 22 componentes únicos.
- Verificación final: `astro build` completo verde. Las 22 páginas de detalle prerenderizan; las 5 islas
  nuevas hidratan; persistencia y exportación se comprueban en dev (smoke), no en unit test.

## 8. Fuera de alcance

- Impuestos/subvenciones en el equilibrio (desplazamientos de curva).
- Productividad ligada a costes/competitividad (se eligió el alcance medio).
- BCG con plot automático de productos por cuota/crecimiento (es lienzo de texto por cuadrante, no gráfico).
- Guardar/compartir online (solo localStorage local).
- Traducción ca/val (estructura preparada; contenido `es`).

## 9. Riesgos y mitigaciones

- **Exportación PNG/PDF frágil** (html2canvas con fuentes/SVG): mitigado reutilizando el patrón ya
  probado de `GeneradorCVEuropass`; el gráfico de equilibrio es SVG simple. Si la exportación de una
  plantilla falla, degradar a «imprimir» (que siempre funciona) sin bloquear el resto.
- **Gráfico de equilibrio**: mantener el SVG autocontenido y a escala fija; la lógica numérica va en
  `equilibrio.ts` (testeada), el SVG solo pinta.
- **localStorage en SSR/build**: el hook debe ser no-op sin `window` (guardas), para que el prerender
  no rompa.
- **PR grande** (5 islas + 2 libs + registro + familia): aceptado (decisión «las 5 a la vez»); se puede
  partir si la revisión se hace inmanejable.
- **Build-break**: ruta de detalle ya existe; no se crean `.ts` sueltos bajo `src/pages/`.
