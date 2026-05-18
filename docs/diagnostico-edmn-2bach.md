# Diagnóstico EDMN 2BACH

> Diagnóstico Fase 0 del plan de mejora 2026 (`docs/plan-mejora-libros-2026.md`). Lectura de las 12 units de EDMN 2BACH en la rama `feat/edmn-figures-rollout` (PR #24).
> Fecha: 2026-05-18 · Autor: sub-agent EDMN (Pau).

## Findings globales

### Tono y consistencia

El tono general es **muy sólido y bastante uniforme**: prosa editorial densa, primera persona del plural sin caer en lo personal, equilibrio entre ejemplo concreto y abstracción teórica. El registro encaja con la dirección estética Variant C. La uniformidad entre units 1–12 sugiere que se redactaron en bloques contiguos por el mismo agente o por agentes con instrucciones muy similares. No detecto fronteras claras "wave 1" vs "wave 2".

Sí hay diferencias pequeñas de **densidad** y de **carga numérica**:

- Units 1–3 son las más narrativas (mucho contexto, muchas curiosidades, pocas fórmulas).
- Units 4–5 son intermedias (Canvas, mapa de empatía, doble diamante: conceptual con visual).
- Units 6–11 son las más operativas y numéricas (4P, punto muerto, VAN/TIR, ratios). Aquí aparecen los `SolvedExercise`.
- Unit 12 vuelve al registro narrativo del cierre, sin ejercicios cuantitativos pero con plantilla del plan.

Una incoherencia menor: la **firma personal de Pau** aparece solo en Unit 1 (*"Para Pau Mompó, autor de este libro…"*), rompe ligeramente la voz coral del resto. Decisión a tomar: mantener (y replicar) o quitar.

### Components MDX

Uso muy desigual del repertorio disponible:

| Component | Units que lo usan | Comentario |
|---|---|---|
| `Callout` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Universal. OK. |
| `Curiosity` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Universal. OK. Una por unit (a veces dos). |
| `RealExample` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Universal. OK. |
| `KeyTakeaways` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Universal. OK. |
| `Steps` | 2, 5, 8, 9, 10, 11, 12 | **Solo 7/12**. Units 1, 3, 4, 6, 7 también tienen procesos secuenciales que podrían usar `Steps`. |
| `Diagram` (SVG) | 1, 2, 3, 4, 5, 6, 7, 8, 9 | **Solo 9/12**. Units 10, 11, 12 no tienen ni un solo diagrama propio. Lagunas evidentes: balance/masas patrimoniales (U10), fondo de maniobra y ratios (U11), TAM/SAM/SOM y plan-de-empresa (U12). |
| `SolvedExercise` | 6, 7, 9, 10, 11 | **Solo 5/12**. Concentrados en lo numérico. U2 (cuotas autónomo, tarifa plana), U8 (cálculo coste empresa) y U12 (cálculo VAN/TIR del plan) son candidatos claros. |
| `Bibliography` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | Universal. OK. |

**Recomendación**: estandarizar `Steps` y `Diagram` en las units que faltan; añadir `SolvedExercise` en U2, U8 y U12.

### Bibliografía

Calidad **alta en general**, pero con desigualdad:

- **Units 1, 3, 5, 7, 9, 11** tienen bibliografías ejemplares: mezcla manuales clásicos en inglés (Brealey, Porter, Ries, Drucker, Maslow), normativa española exacta, papers recientes y fuentes oficiales (INE, Eurostat, BOE).
- **Units 2, 10** son más débiles: muy normativas (BOE puro) y poco doctrinales. U2 podría añadir Crespi & Dejuan sobre tejido empresarial español; U10 podría añadir Goxens o Lainez sobre contabilidad española.
- **Unit 4** cita la tesis doctoral de Osterwalder (2004) **directamente** — bien. Pero falta el clásico de Magretta (2002) *"Why Business Models Matter"*.
- **Unit 12** la bibliografía es escueta (6 items) frente a la magnitud de la unit (cierre del curso). Falta Osterwalder *Value Proposition Design* otra vez, falta Kawasaki *The Art of the Start*.

**Issues transversales**:
- Faltan **fuentes españolas accesibles** para profesores que no leen inglés: añadir Amat, Pérez Carballo, Maroto Acín, Veciana donde aplique.
- Faltan **enlaces** a documentos en PDF o webs oficiales (BOE, INE) para uso docente directo.
- El formato es inconsistente: a veces `*cursiva*`, a veces no; a veces año en `()` antes del título, a veces después.

### Imágenes débiles (top 3-5)

Sin acceso al binario, juzgo por caption y rol pedagógico:

1. **U7 — `kuka-robots-industriales.jpg`** (Unit 7, función productiva). Caption admite que "*la automatización no resuelve por sí sola la calidad*"; la imagen funciona casi como decoración. La unit no necesita robots industriales para nada conceptual: sustituir por un **diagrama de flujo de proceso** real o por una foto más ligada al lean (operario con tablero kanban).
2. **U9 — `nyse-trading-floor.jpg`** (función financiera). Es la **tercera bolsa** en la misma unit (Madrid, Frankfurt, NYC). Saturación. Eliminar y reaprovechar el espacio para un diagrama de la cascada de financiación FFF → angels → VC.
3. **U11 — `bloomberg-terminal.jpg`** (análisis financiero). Imagen de aspiración profesional pero **lejana al aula** de 2BACH. Sustituir por captura de cuentas anuales reales (Mercadona, Inditex) anotadas con flechas.
4. **U1 — `kirzner-lecture.jpg`** (escuela austríaca). Foto de Kirzner gesticulando en un atril, muy poco editorial. La caption hace todo el trabajo pedagógico. Considerar eliminar (Kirzner es secundario respecto a Schumpeter, que ya tiene retrato).
5. **U10 — `aduana-madrid.jpg`** (Casa de la Aduana). La foto sirve sólo como pretexto visual ("Hacienda recibe la información"). El balance de la papelería del SolvedExercise sería visualmente mucho más útil reconstruido como tabla estilizada en SVG.

### Diagramas oportunos (top 3-5)

Lagunas más evidentes para añadir SVG:

1. **U10 — Diagrama del balance en masas patrimoniales** (cuadro de doble entrada con activo a la izquierda, PN+pasivo a la derecha, separación corriente/no corriente). Es **inexcusable** que no exista; es la columna vertebral de la unit.
2. **U10 — Cascada de la cuenta de P&G** (waterfall chart: Ingresos − Gastos explotación = EBIT − Resultado financiero = BAI − Impuesto = Resultado ejercicio). El `SolvedExercise 10.2` lo construye en tabla; un waterfall lo haría memorable.
3. **U11 — Diagrama del fondo de maniobra** (las dos formulaciones equivalentes, parte alta vs parte baja del balance, con cruz de equilibrio).
4. **U11 — Pirámide DuPont** (descomposición ROE = margen × rotación × apalancamiento). Es el clásico que el currículo no pide explícitamente pero los manuales sí incluyen y es el "wow moment" del análisis.
5. **U12 — Funnel TAM / SAM / SOM** (los tres círculos concéntricos o el embudo). Es el visual canónico del estudio de mercado y la unit lo introduce sin diagrama.
6. **Bonus — U9** Diagrama de la cascada de financiación de una startup (FFF → angels → semilla → serie A → serie B → salida). Está descrita en `Steps` pero un timeline visual con tickets de inversión sería mejor.
7. **Bonus — U8** Pirámide de Maslow + tabla Herzberg + triángulo Pink (autonomía/maestría/propósito) en un solo diagrama comparativo "tres teorías de la motivación".

## Findings per unit

### Unit 1 — La persona emprendedora y el espíritu empresarial

**Cifras desactualizadas**:

- "*más de 3,3 millones de autónomos registrados*" → verificar con afiliación RETA 2025 (cifra actual ronda 3,4M).
- "*Sector primario aproximadamente el 3 % del PIB; secundario 20 %; terciario 74 %*" → datos INE 2024 actualizan ligeramente (3 / 19 / 74 aprox). Citar el año explícitamente.
- "*la tasa de actividad emprendedora… es de aproximadamente el 6 % en España, frente al 9-10 % de la media europea*" → GEM España 2023-2024 da 7,2 % TEA; está desactualizado. Sustituir por dato 2024 y citar fuente con año.
- "*aproximadamente el 70 % del emprendimiento es por oportunidad y el 30 % por necesidad*" → GEM 2023 da 71,5 % / 19,7 % (el resto, mixto). Refinar.
- "*por cada 10 hombres que emprenden, lo hacen aproximadamente 7,5 mujeres*" → GEM 2024 da ratio cercano a 8/10. Verificar.
- "*Mercadona cerró 2023 con 102.000 personas… salario medio de entrada de 1.685 € brutos al mes… beneficio neto de 1.009 M€*" → memoria 2024 actualiza (plantilla 104.000+, beneficio 1.384 M€ en 2024). **Actualizar a 2024 ya cerrado**.
- "*estudio del MIT publicado en 2020 sobre 2,7 millones de fundadores*" → Azoulay et al. (citado en biblio) — correcto, pero el dato "edad media 45 años" se ha matizado en publicaciones posteriores (la media de fundadores **exitosos** de empresas de alto crecimiento es 45; la edad media de **cualquier** fundador es ~42). Precisar.
- "*aproximadamente el doble, según datos del CIS*" sobre hijos de empresarios → falta referencia exacta. Verificar fuente.

**Citas a verificar**:

- RD 243/2022, BOE-A-2022-5521 — correcto.
- Schumpeter (1942), *Capitalismo, socialismo y democracia* — correcto.
- Kirzner (1973), *Competition and Entrepreneurship* — correcto.
- Ajzen (1991), *The Theory of Planned Behavior* — correcto.
- Azoulay et al. (2020), *Age and High-Growth Entrepreneurship*, AER: Insights, 2(1) — correcto.
- Frase atribuida a Schumpeter sobre Marx *"la deuda intelectual en el prólogo"* → verificar página exacta; la fuente más sólida es el cap. 7 del libro, no el prólogo.
- Anecdotario Apple/Wozniak/Bloomberg 2014 → verificar fuente exacta de la cita.

**3 mejoras prioritarias**:

1. **Añadir SolvedExercise cuantitativo** sobre clasificación europea (caso: una empresa con plantilla 45, factura 12M, balance 8M — ¿en qué tramo entra y por qué?). La unit introduce la Recomendación 2003/361/CE pero no la pone a trabajar.
2. **Reducir y reorganizar la sección de mitos** (3 mitos + 1 cuarto colateral). Es excesivamente larga y solapa con "lo que dice la investigación moderna". Unificar en un solo bloque "Lo que la investigación realmente dice".
3. **Cuantificar el ejemplo de Mercadona** mejor (productividad por trabajador, churn, NPS si está disponible) en lugar de la frase genérica "*productividad casi el doble que la media del sector*". Añadir microtabla.

**Solapamiento**:

- **Mercadona** aparece en U1 (función social), U6 (mix coherente), U11 (sector retail). Decidir cuál es el "owner" del caso. Recomendación: U6 (es el caso canónico de mix coherente); en U1 sustituir por Pescafresh o Cooperativa Mondragón (este último también está en U2 — ojo).
- **Inditex** aparece en U1 (Amancio Ortega/Zorba), U2 (Arteixo), U6 (omnicanal), U7 (Lean en moda). Demasiado. Owner = U7 (lean en moda), citas breves en las demás.
- **Glovo** aparece en U1 (pivote), U2 (transformación SL→SA), U4 (mencionado en pivote). Owner = U1 o U2; eliminar de U4.
- **Schumpeter** aparece en U1 (destrucción creativa). En Eco 1BACH posiblemente reaparece en el bloque de macro/ciclos. Verificar cross-libros.

---

### Unit 2 — Tipos de empresas y su organización

**Cifras desactualizadas**:

- "*cuotas mensuales a la Seguridad Social (entre 80 € y 590 € al mes en 2024)*" → tramos RETA 2025 cambian (oscila 200-590 según tablas 2025). **Actualizar a 2025**.
- "*tarifa plana… actualmente 80 €/mes, antes 60 €*" → vigente, pero la reforma de 2023 mantiene 80 € hasta 2025. Confirmar 2026 (puede haber cambiado con presupuestos).
- "*ZEC… tributan al 4 %*" → correcto a 2025.
- "*Inditex con más de 162.000 empleados y operaciones en 96 países*" → memoria 2024 actualiza (165.000 emp., 96 países correcto).
- "*Mondragón factura 11.215 M€ anuales, emplea a 70.000 personas en 95 cooperativas*" → memoria 2023 da 11.500 M€, plantilla 70.330. Actualizar a 2024.
- "*Hasta 2010, fundar una SL costaba 3.005,06 €*" → narrativa correcta, pero el contexto legal SLFS se introdujo en 2013 (Ley 14/2013), no 2010. Revisar.
- "*delivery hero adquirió el 83 % del capital por 2.300 M€*" en enero 2022 → correcto; pero conviene añadir que en 2024 Delivery Hero anunció spin-off potencial — actualizar.
- "*La empresa española mediana — la que partiría el ranking por la mitad — no tiene ni un solo asalariado*" → cita DIRCE INE 2024, verificar cifra exacta (1,8M sin asalariados sobre 3,3M).

**Citas a verificar**:

- Ley 14/2013, de 27 de septiembre, de apoyo a los emprendedores — correcto.
- Recomendación 2003/361/CE — correcto.
- Ley 27/1999 de Cooperativas — correcto. **Pero**: actualizada por Ley 1/2023 (Ley Concursal) y modificada por Ley Crea y Crece (2022). Mencionar.
- RD Legislativo 1/2010 (LSC) — correcto. La SL de "1 €" se introdujo con la **Ley 18/2022 (Crea y Crece)**, no antes. El texto dice "*una reforma de 2022 simplificó aún más el trámite*" pero podría ser más explícito y citar Ley 18/2022.
- Falta citar la **Ley 5/2017** sobre el RETA — sí está en biblio, OK.

**3 mejoras prioritarias**:

1. **Añadir SolvedExercise cuantitativo** sobre cuándo conviene pasar de autónomo a SLU (caso: persona factura 60.000 € beneficio neto, comparar IRPF marginal vs IS 25% con simulación numérica). Es la decisión más práctica que aparece en la unit y no se cuantifica.
2. **Ampliar la sección "Otras formas jurídicas"** que está poco desarrollada (Sociedad Civil, Colectiva, Comanditaria). Añadir caso real reciente donde la elección de Sociedad Civil costó dinero (despachos profesionales).
3. **Actualizar el árbol de decisión** con la SLFS y la SL Crea y Crece (1 €), que ahora hacen casi obsoleto el escalón "autónomo si capital < 3.000 €".

**Solapamiento**:

- **Inditex/Arteixo** — repite con U1 y U7 (ver U1).
- **Mondragón** — owner natural de esta unit (cooperativa). Mantener aquí; eliminar referencias en otras units si las hay.
- **Glovo** — aparece en U1 (pivote) y U2 (transformación SL→SA). Decidir owner: la transformación encaja mejor aquí; el pivote, en U1.

---

### Unit 3 — El entorno empresarial y las estrategias

**Cifras desactualizadas**:

- "*España vivió en 2022 una inflación del 8,4 %, la más alta desde 1985*" → correcto histórico. Añadir contexto 2024 (2,8 %) y 2025 (proyección AIReF ~2 %).
- "*El BCE subió tipos del 0 % al 4,5 % entre 2022 y 2023*" → correcto. **Actualizar**: en 2024-2025 el BCE ha bajado a 3,25 % (octubre 2024) y se prevé 2,5-3 % final 2025. Mencionar fase de bajada.
- "*El 80 % de la población española vive en zonas urbanas*" → correcto (INE 2024: 80,7 %).
- "*El teletrabajo aumentó del 4,8 % al 13,5 % en España entre 2019 y 2023*" → EPA muestra que el teletrabajo cayó tras 2022 al 12 % en 2024. Sustituir por dato 2024 con tendencia.
- "*DANA Valencia 2024*" → cita correcta y actual. Bien.
- "*aerolíneas que venden vuelos neutros en carbono*" → contexto OK pero la directiva CSRD se aplica desde 2024-2025 a grandes; mencionar año concreto.
- "*Patagonia… valorada en 3.000 millones de dólares… dividendos anuales (estimados en 100 M$/año)*" → cifras Chouinard 2022 correctas.
- "*Yvon Chouinard transfirió el 100 % de las acciones de la empresa a una fundación medioambiental*" → matiz: 2% voting a Purpose Trust + 98% no-voting a Holdfast Collective. El texto ya lo aclara — OK.

**Citas a verificar**:

- Porter (1979), *How Competitive Forces Shape Strategy*, HBR 57(2) — correcto.
- Aguilar (1967), *Scanning the Business Environment* — correcto.
- Ansoff (1957), *Strategies for Diversification*, HBR 35(5) — correcto.
- Brandenburger & Nalebuff (1996), *Co-opetition* — correcto.
- Bowen (1953), *Social Responsibilities of the Businessman* — correcto.
- Friedman (1970), *NYT Magazine* — correcto.
- Elkington (1994), *Towards the Sustainable Corporation*, CMR 36(2) — correcto.
- Ley Orgánica 3/2007 — correcto.
- Naciones Unidas (2015), Agenda 2030, Resolución A/RES/70/1 — correcto.
- Anécdota Porter "rechazado dos veces por HBR" — verificar fuente original.

**3 mejoras prioritarias**:

1. **Sustituir la frase "Aguilar 1967 con cuatro dimensiones (PEST)"** por una referencia más sólida: el origen del acrónimo PESTEL es debatido (algunos lo atribuyen a Fahey & Narayanan 1986). Aguilar habló de *ETPS*. Precisar atribución o suavizar ("popularizado a partir de los años 60").
2. **Añadir SolvedExercise o caso aplicado** del DAFO cruzado (la unit lo introduce pero no lo ejemplifica con caso completo). Un mini-caso de una pyme real (panadería, librería) con sus 4×3 elementos por casilla y 4 cruces estratégicos.
3. **Conectar más explícitamente PESTEL con el tablero ESG/CSRD** que la unit menciona de pasada. Añadir mini-callout: "PESTEL como input del análisis de materialidad ESG".

**Solapamiento**:

- **Porter cinco fuerzas** se introducen aquí Y se reutilizan en U12 (donde es entregable del capstone). OK la repetición, pero recomendar que U12 envíe explícitamente a U3 para teoría y aquí se ejecute solo el caso del proyecto.
- **DAFO** se introduce aquí. Eco 1BACH posiblemente tiene también DAFO en bloque de empresa — verificar cross-libros.
- **Ansoff** introducido aquí. No reaparece en otras units de EDMN. OK.

---

### Unit 4 — Modelos de negocio: concepto y evolución

**Cifras desactualizadas**:

- "*Filmin… más de 17.000 títulos… 2024 más de 450.000 suscriptores y rentabilidad operativa*" → memoria Filmin 2024 da 600.000 suscriptores y rentabilidad. Actualizar.
- "*Cabify… 2024 facturó 600 M€ con presencia en 90 ciudades de España, Portugal y Latinoamérica*" → memoria Cabify 2024 da ~700 M€ y 120 ciudades. Verificar y actualizar.
- "*Las plataformas freemium típicas convierten entre el 2 % y el 5 %*" → benchmark consistente (Spotify ~46% premium global pero ese es un outlier). Mantener pero matizar.
- "*más de 17 millones de usuarios*" Wallapop → cifra de 2022; en 2024 supera 20M. Actualizar.
- "*250 millones de suscriptores*" Spotify (caption foto) → 2024 cerró con 263M premium y 675M MAU. Actualizar.
- "*Glovo… Delivery Hero adquirió la mayoría del capital por 2.300 M€*" en 2022 → correcto; ver U2 sobre spin-off 2024.

**Citas a verificar**:

- Osterwalder & Pigneur (2010), *Business Model Generation* — correcto.
- Osterwalder (2004), tesis doctoral U. Lausana — verificable, sólida.
- Anderson (2006), *The Long Tail* — correcto.
- Christensen (1997), *The Innovator's Dilemma* — correcto.
- Eisenmann, Parker & Van Alstyne (2006), *Strategies for Two-Sided Markets*, HBR 84(10) — correcto.
- Ries (2011), *The Lean Startup* — correcto.
- Anécdota del **crowdfunding de BMG con 470 lectores** (24-240 USD) — verificar fuente; el dato 470 es el más citado pero algunas fuentes dan 478.
- Anécdota "*Blockbuster… en 2010 estaba en quiebra*" — correcto (Chapter 11 en septiembre 2010).

**3 mejoras prioritarias**:

1. **Añadir Magretta (2002) "Why Business Models Matter" (HBR)** a la bibliografía y un mini-callout con su definición canónica (la mejor síntesis del concepto en 2 párrafos).
2. **Profundizar el bloque "Modelos híbridos"** que está poco desarrollado (3 párrafos). Casos reales españoles claros (Filmin como híbrido, Holaluz como híbrido). Es donde la mayoría de pymes reales encaja.
3. **Añadir caso de fracaso de pivote** (no solo de éxito). Quibi, Theranos, o algún caso español tipo Hawkers (no fracaso pero mutación interesante).

**Solapamiento**:

- **Spotify** aparece aquí y en U6 (suscripción) brevemente. Owner = U4.
- **Netflix** aparece aquí (mutaciones) y en U3 (sustitutivos del cine). Owner = U4 (mutaciones de modelo); en U3 mantener mención breve.
- **Glovo** ver U1 y U2.
- **Filmin / Cabify** introducidas como RealExample aquí. Únicos. Bien.

---

### Unit 5 — Diseño creativo de modelos de negocio

**Cifras desactualizadas**:

- "*Wallapop… más de 17 millones de usuarios*" → ver U4. Actualizar a 2024.
- "*el cerebro procesa información visual treinta veces más rápido que información textual*" → **dato dudoso**. La cita "60.000x más rápido" o "30x" circula sin fuente científica sólida. Suavizar a "más rápido, según estudios de procesamiento visual" o eliminar la cuantificación.
- "*New Coke 1985… llamadas a un ritmo de 8.000 al día*" → cifra documentada (Pendergrast 1993) — verificar.
- "*la empresa rectificó en 79 días*" → correcto (23 abril – 11 julio 1985 = 79 días).

**Citas a verificar**:

- Osterwalder et al. (2014), *Value Proposition Design* — correcto.
- XPLANE (2009), *Empathy Map Canvas* — correcto.
- Lindstrom (2008), *Buyology* — correcto pero **controvertido metodológicamente**; el texto ya advierte sobre divulgación. Bien.
- Damasio (1994), *Descartes' Error* — correcto.
- Eberle (1971), *SCAMPER* — correcto.
- Osborn (1953), *Applied Imagination* — correcto, padre del brainstorming.
- British Design Council (2005), *Double Diamond* — correcto. **Actualizar**: en 2019 el Design Council publicó el "Framework for Innovation" que actualiza el modelo. Mencionar.
- Maurya (2012), *Running Lean* — correcto.
- Anécdota **Wallapop / Wallabox** (Gerard Olivé, El Referente 2018) — verificar la fuente exacta y la cronología (algunas versiones difieren).

**3 mejoras prioritarias**:

1. **Reducir tono divulgativo en neuromarketing**: la sección actual es la más débil de la unit en rigor científico. Reducir la lista de "hallazgos" a 2-3 con respaldo meta-analítico claro. Eliminar o matizar "*la atención dura entre 3 y 7 segundos*" (cifras varían enormemente según contexto).
2. **Añadir Value Proposition Canvas como diagrama propio** (no solo mencionar). Es la herramienta hermana del BMC, citada en biblio pero no representada visualmente. Lleva un SVG.
3. **Añadir SolvedExercise/caso aplicado** de una iteración real del Canvas paso a paso (BMC v1 → entrevistas → BMC v2 con cambios marcados visualmente). Sería el mejor activo pedagógico de la unit.

**Solapamiento**:

- **Wallapop** aquí (pivote Wallabox). Bien.
- **Apple Macintosh/iPod** aquí. Apple aparece también en U3 (App Store ecosistema). Diferentes ángulos, OK.

---

### Unit 6 — La función comercial y el marketing

**Cifras desactualizadas**:

- "*Mercadona facturó 35.529 M€ con 1.677 tiendas en España*" en 2023 → memoria 2024 da 38.811 M€ y 1.690 tiendas. **Actualizar a 2024**.
- "*Carrefour facturó 13.146 M€ con 1.279 establecimientos*" en 2023 → memoria 2024 da cifras similares ligeramente diferentes. Verificar.
- "*8.000 referencias, mayoría marca propia Hacendado*" Mercadona → correcto rango.
- "*gastos publicitarios inferiores al 0,2 % de facturación*" Mercadona → verificar dato exacto.
- "*40.000-60.000 referencias incluyendo electrónica y textil*" Carrefour → verificable.
- "*entre el 2,5 % del sector*" gastos publicitarios → verificar fuente.

**Citas a verificar**:

- Kotler & Keller (2016), 15ª ed. — **desactualizado**. Hay 16ª (2022). Sustituir.
- McCarthy (1960), *Basic Marketing* — correcto.
- Borden (1964), *The Concept of the Marketing Mix*, JAR — correcto.
- Trout & Ries (2001), *Positioning* — correcto (es reedición; original 1981).
- Booms & Bitner (1981), 7P para servicios — correcto.
- Lauterborn (1990), 4C, *Advertising Age* — correcto.
- Anécdota **Borden tenía 12 variables, McCarthy las redujo a 4** — verificar; el texto dice "McCarthy dos años antes" pero McCarthy publicó *Basic Marketing* en **1960**, y Borden el artículo en **1964**. La cronología en la curiosity está **invertida**: McCarthy formuló las 4P antes y Borden defendió las 12. **Error a corregir**.

**3 mejoras prioritarias**:

1. **CORREGIR el error cronológico de la `Curiosity` sobre Borden/McCarthy**: McCarthy (1960) precede a Borden (1964) en la formulación moderna. El texto actual dice lo contrario y es factualmente incorrecto. Reescribir la anécdota.
2. **Añadir SolvedExercise sobre elasticidad precio-demanda** vinculado al SolvedExercise 6.1 (cuál es la elasticidad implícita del plan B vs plan A en la tortilla). Es el concepto que falta para cerrar el bucle del precio.
3. **Profundizar la sección de canales digitales**: D2C, marketplaces, social commerce. La unit los menciona de pasada pero son la transformación más relevante de la función comercial actual. Falta un mini-bloque dedicado.

**Solapamiento**:

- **Mercadona** owner aquí (mix coherente). Ver U1.
- **Boqueria** aparece como foto en U1 y U6. Diferentes ángulos. OK.

---

### Unit 7 — La función productiva

**Cifras desactualizadas**:

- "*la productividad por hora trabajada en España es aproximadamente un 12 % inferior a la media de la Unión Europea*" → Eurostat 2024 da 91,7 (UE=100), brecha del 8,3 %. Actualizar.
- "*Inditex… ciclo completo… 15 días, frente a 6-9 meses del sector tradicional*" → cifra clásica pero criticada por exagerada; algunas fuentes dan 21-25 días reales. Suavizar a "2-4 semanas".
- "*Zara desecha solo el 10 % de su producción cada temporada, frente al 30-40 % del sector*" → dato Inditex 2022; en 2024 publicó datos sobre devoluciones y stock no vendido. Verificar.
- "*márgenes operativos del 18 %*" Inditex → memoria 2024 (margen EBIT 18,6 %). Correcto.

**Citas a verificar**:

- Womack, Jones & Roos (1990), *The Machine That Changed the World* — correcto, canónico.
- Ohno (1988), *Toyota Production System* — correcto.
- Porter (1985), *Competitive Advantage* — correcto.
- Goldratt (1984), *The Goal* — correcto.
- Liker (2004), *The Toyota Way* — correcto.
- Eurostat — añadir año específico de la consulta.
- Anécdota **Ford copió del matadero de Chicago** — correcto y bien documentado (Hounshell, 1984; Brinkley, 2003).
- Hospital **Virginia Mason redujo errores médicos un 50 %** — verificar fuente; cifra circula pero conviene anclar a paper concreto (Pham et al., Health Affairs 2007 o similar).

**3 mejoras prioritarias**:

1. **Añadir tabla comparativa de los 4 tipos de proceso productivo** (proyecto/lotes/cadena/continua) cruzada con coste fijo, flexibilidad, capacidad, sectores típicos. Hoy la información está en bullets, sería más memorable como tabla.
2. **Ampliar Six Sigma** o eliminarla. Actualmente recibe 3 líneas y se descarta para pymes. Si no se va a desarrollar, eliminar mención; si se mantiene, dar al menos un ejemplo concreto de impacto.
3. **Añadir nueva categoría de SolvedExercise** sobre apalancamiento operativo dinámico (qué le pasa al beneficio si las ventas caen un 20 % en cada uno de los dos planes del 7.2). Es el natural complemento del ejercicio existente.

**Solapamiento**:

- **Inditex** owner aquí en lean. Ver U1, U2.
- **Mercadona** mencionada brevemente (cost-driven). OK.

---

### Unit 8 — La gestión de los recursos humanos

**Cifras desactualizadas**:

- "*tasa de temporalidad en España 25 % en 2019, frente al 14 % de media europea*" → correcto histórico.
- "*tasa cifras de temporalidad… aproximadamente el 16 % en 2024*" → Eurostat Q3 2024 da 15,1 %, EPA T4 2024 da 15,6 %. Aproximado correcto. Refinar a "alrededor del 15-16 %".
- "*coste laboral medio por hora 24,7 €/h en España, 41,3 €/h en Alemania, 40,8 €/h en Francia, 30,9 €/h en Italia*" → Eurostat Labour Cost Index 2024 — verificar cifra exacta y año. Las cifras 2024 publicadas en 2025 actualizarán.
- "*productividad española por hora trabajada es un 25 % inferior a la alemana*" → coherente con dato del U7 (12 % UE, gap mayor con Alemania). Verificar consistencia entre U7 y U8.
- "*cotización del trabajador a la Seguridad Social (aproximadamente el 6,35 % del bruto)*" → correcto (4,82 contingencias comunes + 1,55 desempleo + 0,10 FOGASA pequeña = 6,47%). Refinar a 6,47 %.
- "*por cada euro que el trabajador cobra en bruto, la empresa paga aproximadamente 0,30-0,35 €*" → correcto (~29-31 % cotización patronal según contingencias). Verificar tablas 2025.

**Citas a verificar**:

- RD Legislativo 2/2015, ET — correcto.
- RD-Ley 32/2021 reforma laboral — correcto.
- RD-Ley 6/2019 igualdad — correcto.
- WEF (2023), *The Future of Jobs Report* — **desactualizado**. Hay edición 2025 publicada en enero 2025. Actualizar.
- Schwaber & Sutherland (2020), *The Scrum Guide* — correcto.
- Pink (2009), *Drive* — correcto.
- Maslow (1943), *A Theory of Human Motivation* — correcto.
- Herzberg (1959), *The Motivation to Work* — correcto.
- *Manifesto for Agile Software Development* (2001) — correcto.
- Anécdota **manifiesto ágil firmado en Snowbird, Utah, 17 personas** — correcto y verificable.

**3 mejoras prioritarias**:

1. **Añadir SolvedExercise sobre cálculo de coste empresa**: caso concreto (salario bruto 30.000 € anual, cotizaciones, prorrata pagas extras, indemnización por despido potencial). Es el "concepto clave" y no se cuantifica.
2. **Profundizar tabla de modalidades contractuales** con columna adicional "indemnización por despido" y "bonificaciones disponibles". Actualmente la tabla es muy esquemática.
3. **Añadir mini-bloque sobre IA y empleo**: la unit menciona la IA al final pero merece más espacio dado el momento del libro (2026). Datos de WEF 2025 sobre puestos en riesgo / creados.

**Solapamiento**:

- Mención a igualdad/RD-Ley 6/2019 en U3 y U8. OK: U3 es teoría general, U8 aplicación laboral. Cross-reference explícito ya está.
- Maslow / Herzberg / Pink — únicos a U8. Bien.

---

### Unit 9 — La función financiera

**Cifras desactualizadas**:

- Ejemplos numéricos en SolvedExercise están bien construidos y no dependen de año concreto. OK.
- "*el deuda no debería superar el 60-65 % del balance*" — regla orientativa, OK.
- **No hay cifras macro desactualizables** importantes (la unit es metodológica).
- **Falta** mencionar tipos de interés actuales del BCE (3,25 % oct 2024, bajando) — relevante para el cálculo de la tasa de descuento. Añadir como contexto.

**Citas a verificar**:

- Brealey, Myers & Allen (2020), 13ª ed. — **desactualizado**. Hay 14ª (2022). Sustituir.
- Suárez Suárez (2014) — correcto, manual español canónico.
- Berk & DeMarzo (2019), 5ª ed. — hay 6ª (2023). Actualizar.
- Cassano & Mason (2017) sobre business angels — verificar publicación exacta.
- ENISA — añadir URL completa.
- Etimología de **bancarrota / banca rotta** — correcta, bien documentada.
- "*Verkami… 12.000 proyectos por un total acumulado de 42 millones de euros*" — verificar memoria 2024.
- "*comisión del 5 %*" Verkami — correcto.

**3 mejoras prioritarias**:

1. **Añadir SolvedExercise sobre TIR explícitamente** (la unit la introduce pero no la calcula). Un caso simple con flujos uniformes donde se puede calcular la TIR aproximada por interpolación o por tabla. Cierra el bucle VAN/PayBack/TIR.
2. **Ampliar la cascada de financiación** con cifras españolas reales (qué valoraciones manejan business angels españoles, qué fondos VC son los principales en España: Seaya, K Fund, Samaipata, Adara, Kibo Ventures). Hoy la cascada es genérica.
3. **Añadir sección "fintech y financiación alternativa 2024-2026"**: BNPL para empresas, *revenue-based financing*, plataformas como Capchase, Stenn, Verse. La unit termina con crowdfunding clásico y se queda en 2015.

**Solapamiento**:

- **Glovo** ya tratada en U1 y U2.
- **Verkami** introducida aquí como RealExample. Única. Bien.

---

### Unit 10 — La información contable en la empresa

**Cifras desactualizadas**:

- "*impuesto sobre beneficios (Generalmente 25%)*" en tabla P&G → correcto pero conviene mencionar tipo reducido 23% (pymes) y 15% (nueva creación) que ya aparecen en U2.
- "*Pescanova… deuda real de 3.600 M€ frente a los 930 M€ declarados*" → cifras correctas y verificables.
- "*Manuel Fernández de Sousa… condenado en 2020 a 8 años de cárcel*" → Audiencia Nacional, sentencia 7/2020, correcto.
- "*KPMG fue sancionada*" → correcto (ICAC, 2020). Verificar.

**Citas a verificar**:

- RD 1514/2007 (PGC) — correcto. Vigente con modificaciones (RD 1/2021 adaptación NIIF 9, 15, 16).
- RD 1515/2007 (PGC pymes) — correcto.
- Código de Comercio (1885), Libro Primero, Título III — correcto.
- Pisón Fernández (2018) — correcto, manual español sólido.
- Wild, Shaw & Chiappetta (2019), 24ª ed. — hay 26ª (2023). Actualizar.
- Pacioli (1494), *Summa de arithmetica* — correcto.
- **Falta**: Lainez, Sánchez Toledano, Goxens. Manuales españoles de referencia.
- Frase atribuida a Pacioli *"No se acuesta el comerciante…"* → la cita es **apócrifa**; circula en internet pero no aparece en el original. Aclarar o eliminar.

**3 mejoras prioritarias**:

1. **Crear diagrama del balance en masas patrimoniales** (cuadro de doble entrada con ANC/AC y PN/PNC/PC). **Es la laguna visual más grave del libro**. Sin este diagrama, el `SolvedExercise 10.1` exige al alumno construir mentalmente lo que un SVG resolvería en 5 segundos.
2. **Crear diagrama waterfall de la cuenta de P&G** (Ingresos → −Gastos → EBIT → ±Resultado financiero → BAI → −Impuesto → Resultado ejercicio). Cierra visualmente lo que el `SolvedExercise 10.2` construye numéricamente.
3. **Profundizar sección de principios contables**: hoy solo lista 5 de 9 ("conviene reconocer al menos cinco"). Listar los 9 (faltan: precio de adquisición, no compensación está, importancia relativa, correlación de ingresos y gastos). Es contenido curricular básico.

**Solapamiento**:

- **Pescanova** owner aquí (fraude contable). Único.
- **Mercadona** mencionada en `Callout` ejemplo. Ver owner U6.

---

### Unit 11 — Análisis e interpretación de los estados financieros

**Cifras desactualizadas**:

- "*Abengoa… deuda total de 9.500 M€… en 2022 acabó liquidada en el mayor concurso de acreedores de la historia empresarial española*" → correcto. La liquidación se aprobó en 2022 pero el proceso se cerró en 2024. Refinar.
- "*Lehman Brothers… apalancamiento de más de 30 veces*" → correcto (~30.7x al cierre 2007).
- "*Holaluz factura 390 M€/año y tiene 315.000 clientes*" → ver U12, dato de 2023; resultados 2024 actualizan (cierre 2024-2025 a verificar).
- Ratios benchmark ("*entre 0,4 y 0,6*", "*por encima de 1,5*") — orientativos, OK.

**Citas a verificar**:

- Brealey, Myers & Allen (2020) — ver U9, hay 14ª ed.
- Amat (2017), 10ª ed. — hay 11ª (2021). Actualizar.
- Garrido Miralles & Íñiguez Sánchez (2017) — verificar edición vigente.
- Penman (2013) — hay 5ª ed. (2017). Actualizar.
- Higgins (2019), 12ª ed. — hay 13ª (2022). Actualizar.
- **Falta**: Suárez Suárez (otra obra de análisis), Pérez-Carballo.
- "*Audiencia Nacional, sentencia 7/2020*" Abengoa → verificar (el proceso de Abengoa fue mercantil, no penal personal hasta donde se sabe). El texto dice "Informe de la CNMV" — coherente.

**3 mejoras prioritarias**:

1. **Crear diagrama del fondo de maniobra** (representación visual de las dos formulaciones equivalentes con el balance dibujado). Cierra la laguna visual de la sección estructural de la unit.
2. **Añadir descomposición DuPont** (ROE = margen × rotación × apalancamiento financiero). Es el "wow moment" estándar del análisis financiero y elegantemente conecta U10 (P&G), U11 (rentabilidades) y U9 (apalancamiento). Hoy no aparece.
3. **Añadir sección "lectura sectorial"** con tabla de ratios saludables por sector típico (retail, industria, software, hostelería, banca). Es lo que el currículo realmente pide implícitamente y la unit lo menciona pero no lo concreta.

**Solapamiento**:

- **Abengoa** owner aquí (apalancamiento). Único.
- **Lehman** mencionado solo en caption. OK.
- **Mercadona** en `Callout` ejemplo (fondo maniobra negativo). Ver owner U6; aquí es ilustrativo, OK.

---

### Unit 12 — Comunicación, prototipado y plan de empresa

**Cifras desactualizadas**:

- "*Dropbox… lista de espera para probar el servicio pasó de 5.000 a 75.000 personas*" → correcto, dato canónico de Drew Houston (TechCrunch Disrupt 2010).
- "*Holaluz cotiza en BME Growth, factura 390 M€/año y tiene 315.000 clientes*" → cifra 2023. Actualizar a 2024 si memoria disponible.
- "*94 % del mercado doméstico*" controlado por las cinco grandes — verificar; CNMC 2024 da cifras algo distintas.

**Citas a verificar**:

- Ries (2011), *The Lean Startup* — correcto.
- Blank & Dorf (2012), *The Startup Owner's Manual* — correcto.
- Heath & Heath (2007), *Made to Stick* — correcto.
- Porter (1979) HBR — correcto.
- Sahlman (1997), *How to Write a Great Business Plan*, HBR 75(4) — correcto, **lectura canónica**, bien incluida.
- Mullins (2013), 4ª ed. — hay 5ª (2018). Actualizar.
- **Falta**: Kawasaki *The Art of the Start*, Thiel *Zero to One*, Osterwalder *Value Proposition Design* (ya en U5).
- Anécdota **Ilene Rosenzweig inventó elevator pitch en Vanity Fair** — **dudoso**. La atribución más extendida es al sector real estate de los años 60-70 (Philip Crosby) o a Michael Caruso. Verificar. Si no es robusto, eliminar o suavizar atribución.

**3 mejoras prioritarias**:

1. **Añadir SolvedExercise de capstone** integrado (un caso completo con todos los cálculos del libro: punto muerto, VAN, ratios, coste empresa, TAM/SAM/SOM). Sería el "ejercicio resumen" del curso entero. **Crítico** dado que es la unit capstone.
2. **Crear diagrama TAM/SAM/SOM** (embudo o círculos concéntricos). Es el único concepto numérico de la unit que no tiene representación visual.
3. **Ampliar la sección de defensa pública** con rúbrica concreta de evaluación (qué criterios, qué pesos, qué preguntas-tipo del tribunal). Es la culminación del curso y se despacha en 2 párrafos. Añadir guía operativa para profesorado.

**Solapamiento**:

- **Porter cinco fuerzas** referencia explícita a U3 — bien. Pero reduce esta sección a un párrafo (ya está la teoría en U3).
- **Holaluz** owner aquí (estudio de mercado). Único.
- **Dropbox** owner aquí (MVP). Único.
- **Lean Startup / Ries** mencionado en U1, U4, U5, U12. Owner = U12 (cierre). En las anteriores, citas breves.
