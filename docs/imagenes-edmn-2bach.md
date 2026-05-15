# Imágenes del libro EDMN 2BACH — mapa editorial

Mapa de imágenes para acompañar las 12 unidades del libro de Empresa, Diseño de Modelos de Negocio (EDMN 2BACH). Sigue el **camí 3** acordado con Pau: fotografía real curada (Wikimedia Commons + Wikipedia con licencias CC/PD compatibles), sin generación AI.

## Reglas editoriales

1. **3-5 imágenes por unit**. Cualquier número fuera de ese rango requiere justificación específica.
2. **Solo Wikimedia Commons / Wikipedia**, licencias **CC BY / CC BY-SA / CC0 / PD**. Ninguna imagen sin verificar licencia.
3. **Descargar siempre desde URLs de thumb a 1280px** (`/thumb/.../1280px-...jpg`) para mantener el repo ligero. Astro `astro:assets` emite las variantes responsive.
4. **Atribución estándar**: `Foto: {autor}, {licencia} vía Wikimedia Commons`. CC0 y PD pueden omitir nombre pero por cortesía editorial lo mantenemos.
5. **Anchored, no decorative**: cada imagen debe anclar un `<RealExample>`, una `<Curiosity>` o una sección teórica concreta. Nada solo "para llenar".
6. **Sin gente retratada actual** salvo retratos históricos doctrinales (Schumpeter, Porter, Maslow, etc.) o figuras públicas en contexto profesional documentado. Evitar fotos genéricas de "personas trabajando".
7. **Ratio preferido** 16:9 o 3:2 para hero / context; 4:3 o 1:1 para retratos. Ratio único por unit cuando sea posible para coherencia visual.
8. **Sin solapamiento con `<Diagram>`**: si una sección ya tiene diagrama SVG, evitar también foto en el mismo bloque para no saturar.

## Convención técnica

- Carpeta: `src/assets/libro/edmn-2bach/{NN}/` donde NN es el número de unit con cero a la izquierda
- Nombre de fichero: kebab-case descriptivo (`mondragon-sede.jpg`, `schumpeter-portrait.jpg`)
- Import en MDX:
  ```mdx
  import nombreImagen from '@assets/libro/edmn-2bach/02/nombre-imagen.jpg';
  ```
- Uso:
  ```mdx
  <Figure
    src={nombreImagen}
    alt="Descripción factual de lo que se ve"
    caption="Pie editorial que conecta con el contenido"
    credit="Foto: Autor, CC BY-SA 4.0 vía Wikimedia Commons"
    aspectHint="16/9"
  />
  ```

## Mapa por unit

### Unit 1 — La persona emprendedora y el espíritu empresarial

Anclajes preferentes:
- Joseph Schumpeter (retrato histórico) → sección Schumpeter vs Kirzner
- Israel Kirzner (si hay foto disponible) → misma sección
- Ejemplo emprendedor español documentado en RealExample
- Contexto GEM España (gráfica o imagen institucional)

### Unit 2 — Tipos de empresas y su organización ✅ *pilot completed*

- Inditex Arteixo HQ → RealExample localización (hecho)
- Mondragón sede → RealExample cooperativa (hecho)
- Pendiente: Registro Mercantil, autónomo en su workspace, polígono industrial español

### Unit 3 — El entorno empresarial y las estrategias

- Michael Porter (retrato) → sección 5 fuerzas
- Iconografía PESTEL (factor concreto: planta solar, infraestructura logística)
- Ejemplo cluster español (calzado en Elche, calzado en Petrer, marroquinería Ubrique)
- Empresa con materialidad ESG documentada

### Unit 4 — Modelos de negocio: concepto y evolución

- Alex Osterwalder (retrato si disponible) → marco BMC
- Spotify / Netflix interface histórica → modelo plataforma/suscripción
- Booking.com / eBay → modelo marketplace
- Caso B2B español documentado

### Unit 5 — Diseño creativo de modelos de negocio

- IDEO o d.school (Stanford) → Design Thinking
- Prototipo de cartón / wireframe → MVP
- Sesión de ideación / brainstorming documentada → técnicas creativas
- Empresa española nacida de Design Thinking (Glovo, Cabify en early stage)

### Unit 6 — La función comercial y el marketing

- Escaparate icónico (Inditex, El Corte Inglés, Mercadona) → 4P producto/plaza
- Anuncio prensa histórico español → 4P promoción
- Cambio de packaging histórico → ciclo de vida del producto
- Ejemplo segmentación documentado

### Unit 7 — La función productiva

- Línea de producción real (planta SEAT Martorell, Repsol, fábrica española) → producción
- Almacén logístico (Inditex, Mercadona, Amazon) → gestión de inventarios
- Cadena de montaje histórica (Ford / Taylor) → contexto histórico
- Control de calidad industrial documentado

### Unit 8 — La gestión de los recursos humanos

- Abraham Maslow (retrato) → pirámide motivación
- Frederick Herzberg (si disponible) → teoría bifactorial
- Oficina española típica documentada → contexto RRHH
- Acción de formación / aula de empresa → desarrollo

### Unit 9 — La función financiera

- Bolsa de Madrid (interior o fachada) → mercados financieros
- Banco de España (sede) → política monetaria contexto
- Documento financiero histórico (acción antigua, bono) → instrumentos
- Sede de fondo de capital riesgo español (Seaya, K Fund) → financiación externa

### Unit 10 — La información contable en la empresa

- Libro mayor / libro diario antiguo → tradición contable
- Plan General Contable (portada o documento) → marco normativo español
- Luca Pacioli (retrato histórico) → origen contabilidad por partida doble
- Documentos contables modernos (factura, balance) → ciclo contable

### Unit 11 — Análisis e interpretación de los estados financieros

- Auditoría / despacho profesional documentado → análisis externo
- Memoria anual de empresa española (portada) → fuente de análisis
- Bloomberg terminal o dashboard financiero documentado → análisis cuantitativo
- Caso de quiebra histórica española (Banco Popular, Pescanova) → análisis predictivo

### Unit 12 — Comunicación, prototipado y plan de empresa

- Pitch deck histórico documentado (Airbnb, Uber) → comunicación
- Demo day startup / South Summit Madrid → contexto pitching
- Plan de empresa físico (documento histórico) → estructura tradicional
- Equipo joven presentando proyecto → contexto educativo (cuidado con derechos)

## Estado de implementación

| Unit | Estado | Imágenes |
|---|---|---|
| 1 | pendiente | 0 |
| 2 | pilot | 2 |
| 3 | pendiente | 0 |
| 4 | pendiente | 0 |
| 5 | pendiente | 0 |
| 6 | pendiente | 0 |
| 7 | pendiente | 0 |
| 8 | pendiente | 0 |
| 9 | pendiente | 0 |
| 10 | pendiente | 0 |
| 11 | pendiente | 0 |
| 12 | pendiente | 0 |
| **Total objetivo** | | **~40** |

## Pipeline post-imágenes

1. `npm run build` — verificar Astro emite WebP responsivos correctamente
2. `npm run build:pdf` — regenerar PDF descargable con imágenes embedidas (paged.js)
3. `npm run build:slides` — regenerar diapositivas Marp con imágenes (si pipeline soporta)
