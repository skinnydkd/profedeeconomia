# Diagnóstico Eco 1BACH — Fase 0 plan de mejora 2026

> Documento generado el 2026-05-18 por el sub-agente de diagnóstico del Bloque Eco 1BACH. Contenido leído desde la branca `feat/eco-1bach-foundation` (PR #25). Estructura paralela al diagnóstico EDMN. No se han modificado los `.mdx`.

---

## 1. Findings globales del libro Eco 1BACH

### 1.1. Consistencia tono Wave 1 (U1–U6) vs Wave 2 (U7–U12)

El libro está sorprendentemente cohesionado en tono: Wave 1 (Units 1–6) abre con buen ritmo expositivo, voz adulta y manual-de-bachillerato sólido. Wave 2 (Units 7–12) mantiene la misma voz pero **se densifica con datos cuantitativos** (cifras INE, BCE, Eurostat) y aparecen `<RealExample>` más largos y casi periodísticos (cf. Lehman en U10, Draghi en U11, NextGen en U12). No es incoherencia, es **progresión deliberada**: macroeconomía exige más anclajes empíricos que microeconomía. Pequeño defecto: el lema/intro de U7 promete *"manual de bachillerato sólido"* y el de U10 es casi literario; convendría unificar registro a "editorial sobrio con anclaje en realidad" en Fase 2.

**El verdadero problema de consistencia es de densidad**. U10 (47 KB), U11 (42 KB) y U12 (50 KB) son notablemente más largas que la media (28-35 KB). U11 y U12 superan ya el techo objetivo de 380 líneas del CLAUDE.md. **Riesgo**: que el alumnado de bachillerato real no termine la U12 si la última unidad del curso es la más larga de todas.

### 1.2. ADASSimulator: ¿basta el modelo lineal?

El simulador AD-AS lineal mencionado en U8 (`/eco-1bach/recursos/simulador-ad-as/`) **es suficiente para el currículo LOMLOE de 1.º Bach**: el RD 243/2022 pide el modelo AD-AS como herramienta de interpretación de ciclos y shocks, no como ejercicio matemático cerrado. **Recomendación**: NO ampliar a modelo curvilíneo. Sí ampliar funcionalidades pedagógicas: (a) modo "guía-Pau" que reproduzca los cuatro casos canónicos del manual paso a paso con narración; (b) preset "España 2008-2024" que cargue los seis shocks del ciclo histórico de U8 con un solo clic; (c) preset "shock energético 2022" reproduciendo el SolvedExercise 8.1. Eso convierte el simulador en compañero del manual, no en juguete suelto.

### 1.3. SolvedExercises: ¿faltan en units cuantitativas?

Inventario actual:

| Unit | Naturaleza | SolvedExercises | ¿Suficiente? |
|---|---|---|---|
| U1 | Conceptual | 0 | OK |
| U2 | Conceptual + análisis marginal | 1 (estudio Marta) | **Falta uno de dilema del prisionero numérico** |
| U3 | Cuantitativa (financiera) | 2 (interés compuesto + hipoteca) | OK |
| U4 | Cuantitativa (algebraica) | 2 (equilibrio + alquiler Madrid) | OK |
| U5 | Cuantitativa (elasticidad/excedentes) | 2 (elasticidad + impuesto tabaco) | **Falta uno de elasticidad-renta/cruzada y otro de precio máximo** |
| U6 | Conceptual | 0 | **Debería tener uno cuantitativo de impuesto pigouviano vs subvención** |
| U7 | Cuantitativa (PIB/IPC) | 2 (PIB método gasto + deflactor) | **Falta uno de tasa inflación interanual y otro de EPA** |
| U8 | Conceptual + cuantitativa (Gini) | 2 (shock petrolero + Gini) | OK |
| U9 | Cuantitativa | 2 (tasas EPA + SMI/monopsonio) | OK |
| U10 | Cuantitativa | 1 (multiplicador dinero) | **Falta uno sobre conversión efectivo↔depósito o cálculo agregado M1→M3** |
| U11 | Cuantitativa | 2 (multiplicador gasto + hipoteca) | OK |
| U12 | Cuantitativa (ventaja comparativa) | 1 (Norpaís-Surpaís) | OK |

**Prioridad de añadir SolvedExercises en Fase 2**: U5 (precio máximo con peso muerto), U6 (impuesto pigouviano calibrado al daño marginal), U7 (cálculo de tasa de paro y tasa de actividad con datos EPA reales).

### 1.4. Bibliografía

Excelente en cantidad y calidad. **Punto fuerte**: cita siempre RD 243/2022 + manuales de referencia (Mankiw, Krugman, Blanchard) + fuentes oficiales españolas (INE, BdE, AIReF, CNMV). **Punto débil sistemático**: las citas a Mankiw, Krugman, Blanchard son a versiones **viejas** (Mankiw 9.ª 2021; Krugman 5.ª 2018-2019; Blanchard 7.ª 2021; Mishkin 12.ª 2019). En mayo de 2026 ya están disponibles ediciones más recientes (Mankiw 10.ª 2024; Blanchard 8.ª 2023; Mishkin 13.ª 2022). Sustituir en Fase 1. **Otro punto débil**: ausencia notable de **referencias en castellano accesibles**: Tirole *La economía del bien común* (2017), Piketty *El capital en el siglo XXI* (2014), Reinert *Cómo se hicieron ricos los países ricos* (Crítica), publicaciones del IEB-UB, FEDEA, Funcas, BBVA Research. Añadir en Fase 2 como apartado "Para profundizar" pedagógico.

### 1.5. Imágenes débiles (top 5)

1. **U3 — `einsteinRetrato`**: cita apócrifa atribuida a Einstein. Aunque la curiosidad lo aclara honestamente, la foto refuerza la atribución dudosa. **Sustituir** por imagen de billete/moneda histórica (e.g. Banco de España emisión peseta-euro) o por una "tabla del crecimiento de 100 € a 50 años" como infografía propia.
2. **U3 — `bankiaSede` (Torres KIO)**: las Torres KIO son sede corporativa de Bankia desde 2007, pero el caso preferentes se refiere a colocación en sucursales bancarias por toda España. **Sustituir** por imagen de sucursal o por la fachada de la antigua Caja Madrid en plaza Celenque.
3. **U7 — `keynesBrettonWoods`**: foto institucional y formal, poco evocadora. **Mejor opción**: foto del propio Keynes en 1936 con la *Teoría General* o foto de la portada original del libro.
4. **U9 — `oficinaEmpleoMadrid`**: oficina genérica con poco impacto visual. Sustituir por foto histórica de cola en oficina INEM años 80/90 o por gráfico de la propia EPA.
5. **U10 — `bitcoinToken`**: foto trivial de moneda física de Bitcoin. **Sustituir** por screenshot real del white paper de Satoshi Nakamoto o por gráfico de evolución del precio Bitcoin 2009-2024.

### 1.6. Diagramas oportunos a añadir (top 5)

Ya hay 8 SVGs (OfertaDemanda, FlujoCircular, ADAS, FPP, CurvaPhillips, CurvaLorenz, ElasticidadCasos, CicloEconomico). Faltan:

1. **U2 — Curva del valor de la Teoría Prospectiva** (Kahneman-Tversky 1979). Diagrama con punto de referencia, cóncava en ganancias y convexa-pronunciada en pérdidas. Falta ahora mismo a pesar de que el texto la describe verbalmente con detalle. **Alto impacto pedagógico**.
2. **U3 — Gráfico del interés compuesto** (curva exponencial vs lineal del interés simple, con escala 10/20/30/40/50 años). Visualiza la "magia matemática" que el manual narra con números. **Alto impacto pedagógico**.
3. **U5 — Diagrama de excedentes con peso muerto de un impuesto**. El texto los menciona constantemente pero solo se ve `ElasticidadCasos`. Necesario el clásico triángulo de peso muerto con áreas EC/EP/recaudación/PM coloreadas. **Alto impacto**.
4. **U6 — Matriz rivalidad × exclusión 2×2** (bien privado, bien de club, bien común, bien público). El texto lo da en tabla markdown, pero el formato visual de matriz facilita memorización. **Medio impacto**.
5. **U10 — Esquema institucional del Eurosistema** (BCE en el centro, 20 BCN alrededor, MUS, MUR, niveles 1-2-3 de supervisión). Visualiza una arquitectura que en texto es densa. **Medio impacto**.

Adicionales recomendados pero de prioridad menor: U7 desglose del PIB pie chart (visualizar 57 % C + 20 % I + 19 % G + saldo X-M), U8 reproducción animable del ciclo español 2008-2024, U12 mapa de zona euro con fechas de adopción del euro.

### 1.7. Aprovechamiento del diferenciador editorial U2 (Kahneman)

El currículo `curriculum-eco-1bach.md` declara la Unit 2 (economía del comportamiento) como uno de los dos diferenciadores editoriales del libro. **Diagnóstico**: U2 está **bien pero se queda corta para ser diferenciador**. Lo que hay (Sistema 1/2, cinco sesgos, Teoría Prospectiva, nudges) es del nivel estándar de Mankiw o Krugman. **Para convertirlo en diferenciador real**, faltan:

- **Caso práctico aplicado a un alumno de bachillerato**: análisis de cómo TikTok, Shein, Bizum o las apps de citas explotan cada sesgo concreto. El `<RealExample>` de "dark patterns" apunta en esta dirección pero solo lo cita superficialmente.
- **Un "test diagnóstico" interactivo** (componente Preact): 8-10 preguntas tipo Kahneman que detecten al alumno sus propios sesgos y le pongan número.
- **Sección dedicada a Richard Thaler** (Nobel 2017) y los nudges aplicados a España: opt-out en pensiones, donación de órganos, etiquetado nutricional Nutriscore. Aparecen citados pero sin detalle.
- **Curva de valor Teoría Prospectiva como SVG** (cf. punto 1.6).

Coste-beneficio: añadir 1.5-2 KB de texto + 1 diagrama SVG + 1 componente Preact (Fase 4) convertiría U2 en la unidad más reconocible del libro, superando a Econosublime y a los manuales comerciales habituales.

---

## 2. Findings per unit

### Unit 1 — La economía como ciencia social

**Cifras desactualizadas o poco precisas**
- "Servicios representan en torno al 74 % del PIB según el INE (2023)" — dato correcto pero conviene actualizar a serie 2024 (INE publica Contabilidad Nacional anual cada marzo).
- RealExample "España y la FPP histórica": cita primario 2,6 % del PIB / 3,7 % población activa en 2023. Actualizar con datos 2024 disponibles en marzo 2025.
- "Gasto público total ~45 % del PIB" en sistema mixto: actualizable a 2024 (Eurostat publicó 45,9 % en abril 2025 para España).
- Card-Krueger Nobel "2021" — correcto.

**Citas legales/doctrinales a verificar**
- RD 243/2022 — correcto (BOE-A-2022-5521).
- Robbins (1932) — correcto.
- Cita de Joan Robinson sobre modelos — repetida en muchos manuales pero la atribución exacta es difícil de localizar. Sugerencia: verificar fuente original (puede ser de *Economic Philosophy*, 1962, no anterior).
- Card-Krueger 1994 *American Economic Review* 84(4) — correcto.

**3 mejoras prioritarias** (por impacto):
1. **Añadir tabla resumen final de los cuatro factores productivos** con su retribución y un ejemplo español por cada uno (terreno → renta agrícola en Lleida; trabajo → salario nómina; capital → fábrica Ford Almussafes; iniciativa empresarial → Amancio Ortega Inditex). Refuerza memorización antes de exámenes.
2. **Glosario de 10-12 términos clave** al final (escasez, FPP, coste de oportunidad, economía positiva/normativa, etc.). Cumple el requisito de Fase 2 plan-mejora.
3. **Sección "Para profundizar"** con 3-5 lecturas opcionales: Mankiw cap. 1-2, Tirole *La economía del bien común* cap. 1, podcast *Freakonomics* episodio piloto.

**Solapamiento detectado**
- "Adam Smith / mano invisible" aparece también en U4 (página del modelo competitivo) y U6 (introducción de fallos). **Decisión recomendada**: mantener la presentación biográfica completa en U1 (es la introducción canónica del autor), reducir en U4 a una mención y en U6 reformular como "el mismo Smith que vimos en U1 no contemplaba…". Evita repetición de retrato fotográfico.
- Sección "Agentes económicos y flujo circular" (l. 207-217) **solapa fuertemente con U7 § "Los cuatro agentes económicos"** y con U7 § "El flujo circular de la renta". **Decisión recomendada**: dejar en U1 una versión esquemática de 5 líneas con remisión explícita "se desarrolla en detalle en la Unit 7" y mover el contenido sustantivo a U7.
- "Economía positiva vs normativa" aparece aquí y se vuelve a presentar **completa con ejemplos discriminantes** en U11 § 1. Mantener en U11 la versión completa (es saber D.1 del currículo) y dejar en U1 una mención breve con remisión.

---

### Unit 2 — La toma de decisiones económicas

**Cifras desactualizadas**
- No hay cifras españolas en U2 (es unidad conceptual). OK.
- Reglamento DSA citado como "2022" — correcto (Reglamento UE 2022/2065, en vigor desde 2024).

**Citas a verificar**
- Kahneman muerto en 2024 (correcto, falleció marzo 2024). El caption del Figure dice "(1934-2024)" — correcto.
- Tversky muerto 1996 — correcto.
- Simon Premio Nobel 1978 — correcto.
- Card-Krueger Nobel 2021 (reaparece en U2, U5 y U9) — correcto.
- Cobra effect: cita atribuida a Horst Siebert (2001). En realidad el libro de Siebert es *Der Kobra-Effekt: Wie man Irrwege der Wirtschaftspolitik vermeidet* (2001), correcto. La anécdota concreta de Delhi es controvertida y algunos historiadores la cuestionan; el manual ya señala "anécdota recogida por", honesto pero podría matizar "no confirmada documentalmente, pero ilustrativa".
- Concorde / *Concorde fallacy*: Arkes & Blumer 1985 — correcto, fuente canónica.
- Eyal *Hooked* 2014 y Thaler-Sunstein *Nudge* 2008 — correctos.
- Levitt-Dubner *Freakonomics* 2005 — correcto.

**3 mejoras prioritarias**:
1. **Añadir SolvedExercise numérico del dilema del prisionero** con cálculo de pagos esperados en versión repetida (estrategia *tit for tat*) — convertiría una unidad conceptual en aplicable cuantitativamente.
2. **Diagrama SVG de la curva de valor de Teoría Prospectiva** (Kahneman-Tversky 1979) — actualmente solo está descrita en texto, lo cual desperdicia uno de los conceptos más visualizables del libro.
3. **Ampliar la sección de nudges aplicados a España** (donación de órganos, opt-out pensiones futuro, Nutriscore, descuentos al transporte público) con un `<RealExample>` específico. Conecta con U11 § D.2 fiscal y refuerza el diferenciador editorial.

**Solapamiento**
- Análisis marginal (BMg/CMg) aparece aquí (decisión individual) y se redesarrolla en U4 (decisión empresarial de producción) y U11 (política monetaria). **Decisión recomendada**: mantener en U2 la lógica general como herramienta del pensamiento económico, en U4/11 aplicar específicamente sin reexplicar.
- Card-Krueger SMI: la historia del paper de 1994 aparece en U1, U2 (mencionado en costes hundidos), U5 (caso central de precio mínimo) y U9 (sección dedicada). **Decisión recomendada**: presentar al detalle solo en U5 (donde es ejemplo canónico de precio mínimo) o en U9 (donde es debate empírico SMI). **Eliminar en U1 y U2** la mención larga y dejar solo cita pasante con remisión.
- "Aversión a la pérdida / Teoría Prospectiva" reaparece en U3 (al hablar de venta de acciones a pérdidas) sin remisión clara. Añadir cross-reference.

---

### Unit 3 — Planificación financiera personal

**Cifras desactualizadas o poco precisas**
- "Tipo de interés oficial del BCE (depósito): 4 % a finales de 2023; 3,5 % tras primeros recortes de 2024" — **DESACTUALIZADO**. En mayo 2026 el tipo depósito del BCE está en torno al 2,25-2,50 % (tras ciclo completo de bajadas 2024-2025). Sustituir.
- "Euribor a 12 meses: 3,7-3,8 % durante buena parte de 2024" — **DESACTUALIZADO**. Actualizar a serie 2025 disponible (probablemente Euribor cierra 2025 en torno al 2,3-2,5 %).
- "Salario medio bruto en España (INE 2023): 28.360 € anuales" — actualizar a INE 2024 (Encuesta Anual Estructura Salarial publicada junio 2025).
- "Salario más frecuente: 15.500 € anuales" — actualizar.
- Precios vivienda Madrid 4.000-4.500 €/m² y Valencia 2.300-2.600 €/m² — actualizar a serie 2025-2026 (Madrid ya supera 5.000 €/m² en muchos distritos, Valencia ronda los 3.000 €/m²).
- "Tasa de ahorro de los hogares: 5-8 % en 2023-2024" — actualizar a 2025 (Banco de España publica trimestralmente).
- "Bizum 27 millones de usuarios" — citado en U10, no en U3. OK.
- RealExample "Bankia preferentes 22.000 millones de euros" — correcto, validable contra Memoria CNMV.
- RealExample "Euribor pasó de −0,5 % a +4 % en 18 meses": correcto históricamente, pero el contexto narrativo presupone presente actual; añadir nota "tras el ciclo de bajadas 2024-2025, el Euribor se ha relajado de nuevo a cifras en torno a 2,5 %".

**Citas a verificar**
- Cita Einstein "Compound interest is the eighth wonder…" — apócrifa. El manual ya lo señala honestamente: mantener.
- FGD 100.000 €/titular/entidad — correcto (Real Decreto 2606/1996 y modificaciones).
- "Cliente debe pasar antes por notario para acta de transparencia gratuita" desde 2019 — correcto (Ley 5/2019, de 15 de marzo, reguladora de los contratos de crédito inmobiliario).
- Plan Educación Financiera BdE + CNMV "desde 2008" — correcto.

**3 mejoras prioritarias**:
1. **Actualizar TODAS las cifras de contexto** (tipos BCE, Euribor, SMI, salarios INE, precios vivienda) a serie 2025-2026 disponible en mayo 2026. Es la unidad **más sensible a desactualización** del libro porque trata productos financieros vivos.
2. **Añadir diagrama SVG del interés compuesto** (cf. punto 1.6 globales). Cambio de impacto pedagógico alto.
3. **Sección "Para profundizar" con calculadoras públicas**: Finanzas para Todos (BdE/CNMV), calculadora hipotecaria del BdE, simulador de pensiones de la Seguridad Social. Conecta el manual con herramientas vivas que el alumno puede usar al salir de clase.

**Solapamiento**
- "Banco de España como educador financiero" aparece aquí y se redesarrolla en U10 (rol institucional completo) y U11 (transmisión política monetaria). **Decisión recomendada**: presentar funciones supervisor/educador aquí brevemente con remisión; rol técnico macro en U10.
- "Euribor y mecánica de hipotecas" aparece en U3 (Solved 3.2 + RealExample) y reaparece de forma muy detallada en U11 (Solved 11.2 + RealExample Draghi/Lagarde + Steps de transmisión). **Decisión recomendada**: U3 presenta la mecánica desde el lado del consumidor (cuota, TIN, TAE); U11 desde el lado del BCE (transmisión política monetaria). Reforzar la diferencia de perspectiva para que no sea repetición. Pero el SolvedExercise 3.2 (cuota hipoteca al 3,5 %) y el SolvedExercise 11.2 (cuota hipoteca con Euribor 3,6 %) son **casi el mismo ejercicio**. Diferenciar: U3 hipoteca fija recién firmada, U11 hipoteca variable revisada con shock de tipos.
- "Caso Bankia preferentes" aparece aquí (RealExample largo) y vuelve a aparecer en U10 (RealExample "Rescate Bankia 22.000M FROB") más amplio. **Decisión recomendada**: en U3 mantener la dimensión "comercialización inadecuada a minoristas" (educación financiera), en U10 la dimensión "rescate bancario y reformas Unión Bancaria" (sistema financiero). Las dos dimensiones son legítimas, pero el caso se cita dos veces con argumentos que se solapan parcialmente. Posible compresión.

---

### Unit 4 — Microeconomía I: oferta, demanda y mercado

**Cifras desactualizadas**
- RealExample aceite de oliva: precios 3,30 €/kg → 9 €/kg entre 2021 y 2023, cosecha 666.000 t vs media 1,4 M t. **Verificar**: en mayo 2026 los precios han bajado mucho (cosecha 2024/2025 recuperada hasta ~1,1 M t y precios de nuevo en torno a 4-5 €/kg). Añadir continuación "en 2025 la cosecha se ha recuperado y el precio ha vuelto a niveles cercanos a 4-5 €/kg".
- RealExample smartphones 2014 (350-400 €) vs 2024 (150-200 €): orientativo, OK.
- RealExample alquiler Madrid 15 €/m² (2020) → 21 €/m² (2024): actualizar a serie INE 2025 (índice precio alquiler publicado).
- "Mercadona ronda 27 %, Carrefour 9 %, Lidl 7 %" del mercado distribución alimentaria — **datos de 2023 aprox**. Actualizar con Kantar Worldpanel 2025: Mercadona supera ya el 28 %, Lidl crece, Carrefour estable. Verificar.
- "Iberdrola, Endesa y Naturgy concentran 65-70 % del mercado doméstico de electricidad" — verificar con informe CNMC 2024-2025.

**Citas a verificar**
- Alfred Marshall *Principios* 1890 — correcto.
- Ouigo e Iryo entrada en AVE desde 2021 — correcto (Ouigo mayo 2021, Iryo noviembre 2022).
- Cártel fabricantes de coches 2015-2021 sancionado por CNMC — correcto (multa CNMC julio 2015, recurrida y confirmada en cascada hasta 2021-2022).
- Adam Smith *La riqueza de las naciones* 1776 — correcto. Pero la atribución "Smith nunca dibujó una curva de oferta y demanda" del `<Curiosity>` es **académicamente correcta**: la representación gráfica es de Marshall (1890), aunque Cournot ya había usado representaciones gráficas en 1838. Matizable.

**3 mejoras prioritarias**:
1. **Añadir SolvedExercise sobre desplazamiento simultáneo de las dos curvas** con análisis de qué variable queda indeterminada. Es el caso más realista (poco enseñado en bachillerato) y tiene alto valor pedagógico.
2. **Actualizar cifras de cuotas de mercado** (Mercadona, eléctricas, telecos, banca) a 2025-2026. Estas cifras envejecen rápido y son la prueba de fuego de credibilidad del manual.
3. **Sección "Bienes Giffen y Veblen"** mencionada brevemente en l.100 pero no desarrollada. Añadir 3-4 párrafos con ejemplos contemporáneos (bienes de lujo, NFTs, ropa de marca) — atractivo para adolescentes.

**Solapamiento**
- "Adam Smith / mano invisible" — solapa con U1 y U6 (ver § U1).
- "Ouigo e Iryo / liberalización AVE" aparece aquí y se podría tocar en U6 (defensa de la competencia, monopolios naturales). **Decisión recomendada**: presentar caso completo aquí, en U6 solo mención.
- "Iberdrola, Endesa, Naturgy" aparece aquí (oligopolio) y reaparece en U6 (poder de mercado). **Decisión recomendada**: misma estructura, presentar caso aquí.
- **Solapamiento intrabloque B**: el ejercicio Solved 4.1 introduce precio máximo de auriculares, exceso de demanda y "lo veremos en U6". Pero U6 no desarrolla precios máximos al alquiler. Quien lo desarrolla es **U5 § "Aplicaciones: precios máximos…"**. Corregir la remisión cruzada: "lo veremos en la Unidad 5".

**Solapamiento con EDMN — caso Mercadona/Inditex**:
- Mercadona se menciona en U4 (estructura competencia monopolística supermercados). En EDMN (libro 1) Mercadona/Inditex son **casos centrales recurrentes** del libro entero (modelo de negocio, recursos humanos, marketing, internacionalización). **Decisión recomendada**: en Eco 1BACH dejar Mercadona solo como caso de **estructura de mercado** (perspectiva macro/sectorial), y reservar el caso detallado de modelo de negocio (proveedores, marca propia, gestión RR.HH.) a EDMN. No repetir argumentos. Cross-reference si el alumno está cursando ambas.

---

### Unit 5 — Microeconomía II: elasticidad y aplicaciones

**Cifras desactualizadas**
- Tabla de elasticidades empíricas (pan 0,2; tabaco 0,4 corto plazo; restaurantes 1,5; viajes en avión 1,8). Son rangos de la literatura empírica que no cambian sustancialmente; OK.
- SMI España 2018 (735,90 €/mes) → 2024 (1.134 €/mes en 14 pagas) — **actualizar a 2025**: SMI 2025 es 1.184 €/mes en 14 pagas (RD 87/2025). Y 2026: pendiente de actualización del observatorio AIReF.
- "Tipos del BCE altos en 2024" — desactualizado (ver U3 y U10).

**Citas a verificar**
- Pigou *Economics of Welfare* 1920 — correcto.
- David Card Nobel 2021 — correcto.
- Card-Krueger 1994 *AER* 84(4) — correcto.
- Jensen y Miller 2008 *AER* 98(4) "Giffen Behavior" — correcto, paper canónico sobre bienes Giffen empíricos (provincias rurales de China).
- Sugar tax UK abril 2018, *Soft Drinks Industry Levy* — correcto.
- *The Lancet* 2023 estudio de Rogers et al. — correcto, publicado.
- Berlín *Mietendeckel* 2020 anulado 2021 por Tribunal Constitucional — correcto.
- Cataluña Ley de zonas tensionadas 2024 — correcto (Ley 12/2023 de vivienda + decreto autonómico de 2024).
- AIReF (2023) y Banco de España (2022) sobre SMI — correctos, informes públicos.

**3 mejoras prioritarias**:
1. **SolvedExercise sobre precio máximo con cálculo de peso muerto** (paralelo al Solved 5.2 del impuesto al tabaco). U5 ya tiene el caso conceptual del alquiler pero falta un ejercicio cuantitativo de precio máximo. Refuerza el patrón "calcular EC, EP, PM antes y después de la intervención".
2. **Añadir diagrama SVG dedicado a excedentes con peso muerto** (cf. punto 1.6). El texto los menciona pero solo se ve `ElasticidadCasos`.
3. **Sección sobre fiscalidad pigouviana de bebidas azucaradas en España** (impuesto entró en vigor en algunas CCAA: Cataluña desde 2017, debate nacional pendiente). Conecta U5 con U6 y U11.

**Solapamiento**
- Card-Krueger SMI: redesarrollado en U9 con detalle (es el saber C.3 del currículo). **Decisión recomendada**: en U5 presentar como ejemplo de precio mínimo en mercado de trabajo (caso técnico) y en U9 presentar como debate empírico extendido del SMI español. Las dos presentaciones tienen perspectiva ligeramente distinta, pero el caso US 1992 se repite literalmente. Comprimir en U5 o ampliar diferenciación.
- Impuestos pigouvianos: introducidos aquí (Sugar tax) y redesarrollados en U6 (sección Externalidades). **Decisión recomendada**: presentar Sugar tax aquí como aplicación pura del modelo elasticidad/peso muerto/incidencia; en U6 desarrollar la justificación teórica completa (Pigou-Coase-mercados de derechos). Bien diferenciado, mantener.
- Bienes Giffen: mencionados en U4 (l.100) brevemente y desarrollados en U5 (`<Curiosity>` Robert Jensen China). **Decisión recomendada**: dejar la curiosidad solo en U5.

---

### Unit 6 — Microeconomía III: fallos de mercado

**Cifras desactualizadas**
- "Precio del derecho de emisión, hoy en torno a 70-90 €/tCO₂" (EU ETS): verificar mayo 2026. En 2024 oscilaba 60-80 €/tCO₂; en 2025-2026 ha caído algo (esquema con sobreoferta tras incorporación marítimo en 2024). Actualizar.
- Multas Google: 2.420 M€ (2017), 4.340 M€ (2018), 1.490 M€ (2019) — correctos.
- Apple multa 1.840 M€ en 2024 — correcto (marzo 2024, Comisión Europea, caso Spotify).
- DMA Reglamento UE 2022/1925 en vigor 2024 — correcto.
- VW dieselgate más de 32.000 M€ pagados en multas/recompras — correcto orden de magnitud.

**Citas a verificar**
- Pigou (1920) *Economics of Welfare* — correcto.
- Samuelson (1954) *Pure Theory of Public Expenditure* — correcto.
- Coase (1960) *Problem of Social Cost* — correcto. Nobel 1991 — correcto.
- Akerlof (1970) *Market for Lemons* — correcto.
- Spence (1973) *Job Market Signaling* — correcto.
- Stiglitz y Weiss (1981) *Credit Rationing* — correcto.
- Ostrom *Governing the Commons* 1990, Nobel 2009 — correcto.
- Hardin (1968) *Tragedy of the Commons* — correcto.
- Buchanan-Tullock *Calculus of Consent* 1962, Buchanan Nobel 1986 — correcto.
- Akerlof, Spence, Stiglitz Nobel 2001 — correcto (los tres compartieron).
- "Coase: caso del médico y el confitero": **error histórico menor**. El caso citado por Coase en *The Problem of Social Cost* es **Sturges v. Bridgman (1879)**, donde el demandante era un médico y el demandado un confitero (no panadero/panadería como otros manuales recogen incorrectamente). Correcto en este manual.
- "EU ETS desde 2005" — correcto.

**3 mejoras prioritarias**:
1. **SolvedExercise cuantitativo de impuesto pigouviano** que calcule el impuesto óptimo dada una externalidad marginal estimada. Es la unidad más conceptual del bloque B y se beneficia mucho de un cálculo numérico. Por ejemplo, externalidad del CO₂ a 60 €/tCO₂ y demanda de gasolina inelástica → calcular impuesto óptimo y reducción de consumo.
2. **Diagrama SVG matriz rivalidad × exclusión** (cf. punto 1.6) que reemplace o complemente la tabla markdown actual.
3. **Ampliar caso EU ETS** con datos más recientes y conectar con la transición ecológica de U12 (decreto fit-for-55 europeo). Refuerza coherencia macro del libro.

**Solapamiento**
- "Externalidades" aparece aquí (sección dedicada) y se cita en U2 (decisiones éticas con externalidades) y en U11 (justificaciones de intervención pública). **Decisión recomendada**: presentar al completo aquí, en U2 y U11 solo remisión.
- "Información asimétrica seguros / Bankia preferentes / crisis 2008" — aquí desarrollado, y reaparece en U3 (preferentes desde lado consumidor) y U10 (Lehman + Bankia rescate). **Decisión recomendada**: mantener tres ángulos diferenciados pero asegurar que el caso preferentes no se repita literalmente; en U6 enfocar selección adversa, en U3 mala comercialización, en U10 rescate.
- "Defensa de la competencia / CNMC / DG COMP" aparece aquí completa y reaparece brevemente en U4 (cárteles fabricantes coches). **Decisión recomendada**: presentar completa aquí; en U4 solo mención del caso.

**Solapamiento con EDMN — caso Schumpeter / innovación / monopolios**:
- En EDMN (libro 1) se desarrolla largamente Schumpeter, destrucción creativa, innovación empresarial. En Eco 1BACH U6 se trata "poder de mercado" y "monopolios naturales" desde la lógica regulatoria (CNMC, DMA), sin mencionar a Schumpeter por nombre. **Solapamiento bajo**, está bien diferenciado por perspectivas. Recomendable solo una cross-reference suelta "para la perspectiva empresarial e innovadora, ver EDMN 2BACH cap. X".

---

### Unit 7 — Macroeconomía I: agentes, flujo circular e indicadores

**Cifras desactualizadas**
- "PIB español ronda 1,5 billones de euros en 2023 (1.498.324 millones)" — actualizar a 2024 (probable >1,55 billones, INE Contabilidad Anual marzo 2025) y 2025.
- "Décima economía mundial / cuarta zona euro" — verificar (sigue siendo correcto en 2025).
- Distribución VAB sectorial 2023: servicios 74,3 %, industria 15,6 %, construcción 6,8 %, agricultura 2,6 % — actualizar a 2024.
- "47 % remuneración asalariados / 42 % EBE" — comprobar revisión 2024.
- PIB hundimiento 2020 (−11,2 %) → recuperación 2024 — correcto histórico. Pero "fue en el segundo trimestre de 2024 cuando España volvió oficialmente al nivel de PIB real previo a la pandemia" — verificar contra revisión INE.
- IPC España: tabla con 2021 +3,1 %, 2022 +8,4 %, 2023 +3,5 %, 2024 +2,8 % — **2024 cierra finalmente alrededor del 2,9 %** según INE enero 2025. Verificar. Añadir 2025 (probablemente 2,1-2,4 %).
- "Inflación zona euro 1,7-2,2 % en 2024" — verificar serie BCE 2024-2025.
- EPA T3-2024: 24,2M activos / 21,5M ocupados / 2,7M parados / paro 11,3 % / actividad 58,7 % / paro juvenil 26,6 %. Actualizar a EPA T1-2026 disponible en mayo 2026 (paro probablemente bajado a ~10,5-11 %, juvenil ~25 %).
- Media zona euro paro 2024 ~6,4 % — verificar Eurostat 2025.
- "Cuenta corriente 2023: +39.000 M€ ≈ +2,6 % PIB" — actualizar a 2024 disponible.
- "Exportaciones bienes y servicios ~38 % PIB (Eurostat 2023)" — actualizar.
- "Gasto público total ~45 % PIB" / "consumo público ~19 %" — actualizar.
- "Economía sumergida 17-20 % PIB" — sigue siendo cifra de Schneider-Medina (2018), referencia válida pero ya antigua.
- "Argentina inflación 211 % a cierre 2023, pico mensual 25,5 % en diciembre, cierre 2024 117 %" — correcto. Actualizar con cierre 2025 (probable descenso significativo bajo Milei, ~25-50 %).

**Citas a verificar**
- RD 243/2022 — correcto.
- Keynes *Teoría general* 1936 — correcto.
- Cita de Robert F. Kennedy 18 marzo 1968 Universidad de Kansas — correcto, discurso documentado.
- Simon Kuznets advertencia al Congreso en 1934 — correcto, *National Income, 1929-1932* informe al Senado.
- Kuznets Nobel 1971 — correcto.
- INDEC manipulación 2007-2015 — correcto.
- IPC base 2021, vigente en INE — verificar (en 2026 podría haber base actualizada a 2026).
- EPA metodología OIT/Eurostat 60.000 viviendas/trimestre — correcto.
- EPA 1964 primera publicación — correcto.

**3 mejoras prioritarias**:
1. **Actualizar todas las cifras** (PIB, IPC, EPA, balanza pagos) a serie 2025-2026 disponible. Es la unidad **más sensible a quedarse desfasada** del libro junto con U3 y U11.
2. **SolvedExercise nuevo de tasa de inflación interanual** con datos INE reales (ejemplo: calcular inflación 2024 desde IPC enero/diciembre, comparar con subyacente). Refuerza saber operacional del IPC.
3. **SolvedExercise nuevo o ampliado de EPA** que conecte las tres tasas (actividad, paro, empleo) con un caso de "efecto desánimo" similar al de U9 Solved 9.1. (Actualmente U7 no tiene SolvedExercise de EPA; U9 sí.) **O bien** mover el Solved 9.1 a U7 y dejar U9 con ejercicio de SMI/monopsonio puro.

**Solapamiento**
- "Cuatro agentes económicos / flujo circular" aparece aquí completo. En U1 hay una versión esquemática (l.207-217). **Decisión recomendada**: comprimir U1 al esquema mínimo + remisión.
- "PIB, IPC, EPA, balanza pagos" son el contenido nuclear del Bloque C y se desarrollan completos aquí. Posteriormente U8 usa PIB/IPC/paro, U9 EPA, U10 sistema financiero, U11 política fiscal/monetaria, U12 balanza con UE. **Bien estructurado**, sin solapamiento problemático.
- "IDH (PNUD)" — mencionado aquí en § "Lo que el PIB no mide" y reaparece en U8 § 6 ampliado. **Decisión recomendada**: presentar al completo en U8 (es donde el currículo C.2 sitúa "indicadores del desarrollo social"); aquí solo mención.
- "Inflación + IPC" — definido aquí y reaparece en U11 § "Inflación: tres tipos y crisis 2022-2023" desarrollado a fondo. **Decisión recomendada**: definir y medir aquí; en U11 explicar tipologías y el mecanismo macroeconómico.

---

### Unit 8 — Macroeconomía II: modelo AD-AS y ciclos económicos

**Cifras desactualizadas**
- PIB España 2022: +5,5 %, 2023: +2,5 %, 2024: +3,2 % — correcto. Añadir 2025 disponible (probable 2,5-3 %).
- IPC España: 5,8 % febrero 2022 → 10,8 % julio 2022. Correcto histórico.
- Tipo BCE refinanciación: 0,00 % junio 2022 → 4,50 % septiembre 2023. **Faltan datos 2024-2025**: ciclo de bajadas iniciado junio 2024, llegando a 3,15 % depósito en diciembre 2024 y a ~2,25-2,5 % en mayo 2026 (verificar).
- "España no recuperó el nivel pre-crisis hasta 2017 — nueve años después del pico cíclico" — correcto.
- "Italia, ni siquiera en 2024" — verificar 2025.
- "Doble recesión 2008-2014" — correcto.
- Crisis euro 2012: prima riesgo española 638 pb julio 2012 — correcto.
- Rescate MEDE 61.000 M€ — correcto (de un máximo autorizado de 100.000 M€).
- 2020 PIB −10,8 % — correcto.
- Paro 26,9 % T1-2013 — correcto.
- Gini Suecia 0,28; España 0,33; EE.UU. 0,41; Brasil 0,52; Sudáfrica 0,63 — orden de magnitud correcto. Verificar con datos Eurostat 2024-2025.
- "Gini España aumentó de 0,32 (pre-crisis) a 0,35 durante doble recesión, moderado desde 2015" — verificar serie INE Encuesta Condiciones de Vida.
- PTF España <0,5 % anual vs zona euro 1 % vs EE.UU. 1,5 % — orden de magnitud habitual, OK.
- Gasto I+D España 1,4 % PIB vs UE 2,2 % vs Alemania/Corea 3,5 % — actualizar (España 2024 está alrededor del 1,49 %, objetivo Horizonte Europa).

**Citas a verificar**
- Robert Solow Nobel 1987, modelo 1956 — correcto.
- Solow (1956, 1957) — correctos en bibliografía.
- "Lost decade japonesa de los 90" — correcto.
- IDH puesto 27 España, IDH 0,911 — verificar con HDR 2024-2025 (publicado anualmente por PNUD).
- "Encabeza Noruega 0,966 o Suiza 0,967" — verificar HDR más reciente.
- Mahbub ul Haq + Amartya Sen + diseño IDH 1990 — correcto.
- Sen Nobel 1998 — correcto.
- NBER datación ciclos desde 1854, CEPR Europa — correcto.

**3 mejoras prioritarias**:
1. **Ampliar el simulador AD-AS** con presets españoles (cf. punto 1.2 globales). U8 es la unidad que más se beneficia de interactividad.
2. **Actualizar cifras del ciclo español** con datos 2025 disponibles (PIB, paro, prima de riesgo, evolución BCE post-2023).
3. **Diagrama SVG nuevo: descomposición del crecimiento del PIB potencial** según modelo Solow (Y = A·F(K,L)) con barras apiladas para España vs EE.UU. vs zona euro. Visualiza el "problema de productividad española" que el texto desarrolla. Alto impacto pedagógico.

**Solapamiento**
- "Curva de Lorenz / Gini" — desarrollado aquí (saber C.2) con Solved 8.2. No reaparece en otras units. OK.
- "Modelo de Solow / PTF" — desarrollado aquí. No reaparece en otras units. OK.
- "IDH" — versión completa aquí (saber C.2), versión esquemática en U7. Bien diferenciado.
- "Ciclo económico" — desarrollado aquí con caso España 2008-2024. Reaparece brevemente en U11 (justificación intervención pública para estabilizar el ciclo). Bien diferenciado.
- "Shock petrolero 2022 / Ucrania" — caso ilustrado aquí (Solved 8.1) y reaparece en U11 (crisis inflacionaria 2022-2023). **Decisión recomendada**: aquí enfocar la respuesta del BCE como ilustración del modelo AD-AS; en U11 enfocar la dimensión política monetaria y respuesta institucional española (escudo social, excepción ibérica). Bien diferenciado, mantener.

---

### Unit 9 — Mercado de trabajo y desempleo

**Cifras desactualizadas**
- "España convive desde los años 80 con tasas de paro estructuralmente más altas que media UE" — correcto.
- SMI tabla 2017-2024 — actualizar 2025: 1.184 €/mes en 14 pagas (RD 87/2025 enero 2025), +4,4 % vs 2024.
- "Tasa temporalidad cayó al 14-15 % a finales 2023" — actualizar con datos 2024-2025-2026 disponibles.
- "Paro juvenil 27 % en 2024 frente al 14 % UE" — actualizar.
- "Paro larga duración afecta a más del 40 % de los parados" — actualizar.
- "Productividad laboral española ~80 % de Alemania" — verificar serie BCE/Eurostat.
- "España alcanzó 27,16 % paro T1-2013, 6,2M parados, paro juvenil 57,2 %" — correcto.
- "NAIRU España estimada 10-12 %, Alemania/PB 4-5 %" — orden correcto, verificar última estimación BdE.
- "Brecha salarial ajustada España ~9 %, sin ajustar 15-18 %" — actualizar a Eurostat 2024.
- "Estudios penalización maternidad −11 % salario tras primer hijo" — correcto (Kleven et al. 2019 + replicación BdE).
- "75 % trabajo a tiempo parcial lo realizan mujeres" — actualizar a INE 2024-2025.

**Citas a verificar**
- Phillips (1958) *Economica* — correcto.
- Friedman (1968) *American Economic Review* — correcto.
- Card-Krueger 1994 — correcto.
- Kleven, Landais, Søgaard (2019) *AEJ Applied* — correcto.
- RDL 32/2021 reforma laboral Yolanda Díaz — correcto.
- Directiva UE 2023/970 transparencia retributiva — correcto.
- Reforma permisos parentales 2021 16 semanas iguales — correcto (RD-Ley 6/2019 + ampliación Ley 2/2023).
- *Great Resignation* JOLTS noviembre 2021 4,5 M dimisiones — correcto.
- Beveridge *Unemployment* 1909 — correcto.
- Board of Trade británica 1888 — correcto.
- EPA España primera publicación 1964 — correcto.

**3 mejoras prioritarias**:
1. **Actualizar todas las cifras EPA, SMI, temporalidad, brecha salarial** a serie 2025-2026.
2. **Diagrama SVG sobre los cuatro tipos de paro** con caso español por cada uno (friccional → recién titulado, estructural → minero asturiano, cíclico → COVID 2020, estacional → temporero Huelva). Visual + memotécnico.
3. **SolvedExercise sobre brecha salarial** con datos reales hombre/mujer mismo perfil (edad/sector/jornada) — refuerza la distinción brecha ajustada vs sin ajustar.

**Solapamiento**
- Card-Krueger SMI: aparece aquí completo y mencionado también en U1, U2, U5. **Decisión recomendada**: este es el lugar canónico para presentación completa. Comprimir menciones anteriores a remisión "lo veremos en U9".
- "Curva de Phillips / NAIRU" — desarrollada aquí (saber C.3). No reaparece en otras units. OK.
- EPA — definida en U7, aplicada aquí. Bien diferenciado.
- Reforma laboral 2021 Yolanda Díaz — caso central aquí. No reaparece en otras units. OK.

---

### Unit 10 — Sistema financiero, dinero y banca

**Cifras desactualizadas o poco precisas**
- M0 zona euro "1,5 billones €", M1 "10,7 billones €", M3 "16 billones €" (2024) — actualizar a serie BCE 2025-2026.
- Coeficiente legal reservas zona euro "1 % desde 2012" — correcto.
- "Eurozona 20 países, Croacia 2023" — correcto.
- Tipo facilidad depósito BCE: "3,25 % octubre 2024, tras recortes desde 4 % septiembre 2023" — **DESACTUALIZADO**. Mayo 2026: tras ciclo completo de bajadas BCE, depósito está en torno a 2,00-2,25 %.
- Tipo MRO octubre 2024 "3,40 %" — actualizar.
- Tipo facilidad marginal "3,65 %" — actualizar.
- Euribor 12 m "2,7-3,2 % 2024" — actualizar (probablemente Euribor mayo 2026 en torno a 2,3-2,5 %).
- Inflación zona euro 2024 "1,7-2,2 %" — verificar.
- Bizum "27 millones usuarios 2024, >70.000 M€ anuales" — actualizar a 2025-2026 (Bizum tiene crecimiento sostenido).
- Capitalización BME "700.000 M€" — actualizar.
- Activos sistema bancario español "2,9 billones €" — actualizar.
- "Cinco grandes bancos concentran >70 % crédito y depósitos" — actualizar; con la OPA BBVA-Sabadell de 2024-2025, verificar resultado y nueva estructura.
- "BBVA OPA hostil a Sabadell 2024" — actualizar el estado en mayo 2026 (la OPA estuvo en proceso autorización CNMC durante 2024-2025; resultado final pendiente o ya cerrado).
- Bitcoin precio medio 2024 "40.000-70.000 USD" — actualizar a 2025-2026 (en 2025 Bitcoin tocó 100.000+ USD).
- Bitcoin consumo energético "130 TWh anuales" — verificar con Cambridge CBECI 2025.

**Citas a verificar**
- Lehman Brothers quiebra 15 sept 2008, activos 691.000 M USD — correcto.
- Bankia salida bolsa julio 2011 a 3,75 €, nacionalización mayo 2012, pérdidas 19.193 M€ — correcto.
- FROB 22.424 M€ rescate Bankia — correcto.
- MEDE préstamo hasta 100.000 M€ — correcto.
- "MUS 2014, MUR 2015, Basilea III" — correcto.
- Nixon shock 15 agosto 1971 fin convertibilidad — correcto.
- Bretton Woods julio 1944, 730 delegados 44 países — correcto.
- Satoshi Nakamoto white paper 2008 — correcto.
- TerraUSD colapso mayo 2022 ~60.000 M USD — correcto.
- Ethereum migración proof-of-stake septiembre 2022 — correcto.
- Euro digital lanzamiento "2027-2028" — verificar timeline BCE actualizado.
- BdE inaugurado 1891 sede Cibeles — correcto.
- BCE Frankfurt sede 2015 (Coop Himmelb(l)au) — correcto.
- Primer cajero España 9 sept 1971 Banco Popular Madrid — correcto.
- Cajeros España 53.000 (2008) → 45.000 (2024) — actualizar.

**3 mejoras prioritarias**:
1. **Actualizar TODOS los tipos BCE, Euribor y métricas bancarias** a mayo 2026. Es, junto con U3 y U11, la unidad más sensible a desactualización monetaria.
2. **SolvedExercise sobre cálculo de agregados monetarios** (dado un balance bancario simple, calcular M0→M3). Refuerza concepto operacional. Actualmente solo hay Solved 10.1 sobre multiplicador.
3. **Actualizar el caso BBVA-Sabadell OPA** con su desenlace real (en mayo 2026 ya estará resuelto). Refuerza credibilidad y actualidad.

**Solapamiento**
- "Banco de España" — descrito brevemente en U3 (educación financiera) y aquí desarrollado al completo. Bien diferenciado.
- "BCE / tipos oficiales / política monetaria" — descrito aquí (estructura institucional) y desarrollado en U11 (instrumento de política económica). Bien diferenciado: aquí *qué es*, en U11 *cómo se usa*. Mantener.
- "Bankia rescate" — aquí (RealExample largo Bankia + FROB + MUS + MUR) y en U3 (preferentes desde lado consumidor). **Solapamiento parcial**: el caso Bankia se cita dos veces con énfasis diferentes pero los datos numéricos (22.000 M€) se repiten. **Decisión recomendada**: en U3 quitar referencia al rescate FROB y dejar solo la dimensión "comercialización inadecuada de preferentes" desde el consumidor; en U10 dejar el caso completo del rescate.
- "Lehman Brothers" — caso citado aquí (mercado interbancario) y reaparece como contexto histórico en U6 (información asimétrica subprime). Bien diferenciado.
- "Crisis financiera 2008 / subprime / titulización" — aquí (Lehman) y en U6 (información asimétrica + selección adversa). Bien diferenciado por perspectivas.

---

### Unit 11 — Políticas económicas: fiscal y monetaria

**Cifras desactualizadas**
- "España cerró 2024 con déficit 3,0 % PIB y deuda ~107 %" — actualizar a 2025 disponible (AIReF publica trimestralmente).
- "Servicio deuda 25.000 → 40.000 M€ entre 2021 y 2024" — actualizar.
- "Nueva regla fiscal europea abril 2024" — correcta (Reglamento UE 2024/1263).
- "Pico inflación zona euro 10,6 % octubre 2022" — correcto.
- "Pico España 10,8 % julio 2022" — correcto.
- IPC España 2023 cerró 3,2 % — correcto. Falta 2024 y 2025.
- "BCE subió tipos del 0 % al 4,5 % en 14 meses (julio 2022 – septiembre 2023)" — correcto.
- Lagarde presidenta BCE desde 1 noviembre 2019 — correcto.
- Mario Draghi "whatever it takes" 26 julio 2012 Londres — correcto.
- "Spread España 600 pb verano 2012" — correcto.
- "PEPP marzo 2020, 1,85 billones €" — correcto.
- "PSPP marzo 2015, ~2,6 billones €" — correcto.
- "Recortes BCE desde junio 2024" — correcto; ampliar serie hasta 2026.
- "Bono CAP energético / IVA electricidad 5 % / 20 cts/litro carburante / excepción ibérica" — correctos.
- "Gasto protección social España ~28 % PIB" — verificar.
- "Economía sumergida España 17-20 %" — Schneider-Medina 2018, referencia ya vieja.
- "MEI 0,8 % en 2025, creciente al 1,2 % en 2029" — verificar.

**Citas a verificar**
- Curva de Laffer 1974 cena con Cheney y Rumsfeld en *Two Continents* — anécdota popular bien documentada.
- Ibn Jaldún siglo XIV anticipo curva Laffer — correcto.
- Modelo Bismarck / Beveridge — correctos.
- Ley 39/2006 Dependencia — correcta.
- Friedman Nobel 1976 monetarismo — correcto.
- Draghi 26 julio 2012 Global Investment Conference — correcto.
- Tratado Funcionamiento UE mandato BCE estabilidad precios primaria — correcto.
- AIReF informes — correctos.
- Reglamento UE 2024/1263 — correcto.
- RDL 20/2022 escudo social — correcto.
- "Reserva Federal mandato dual" vs "BCE mandato jerárquico" — correcto.
- Tributo "facilidad de depósito negativa 2014-2022" — correcto.

**3 mejoras prioritarias**:
1. **Acortar la unidad** (42 KB, supera el techo recomendado de 380 líneas). Comprimir secciones que se solapan con otras (e.g. mecánica EPA ya en U7, multiplicador del dinero ya en U10, ciclo y AD-AS ya en U8). U11 debe centrarse en las **palancas** (qué hace el Estado), dejando la mecánica de los indicadores en otras unidades.
2. **Actualizar todas las cifras macro y de política monetaria** a mayo 2026 (déficit/deuda, tipos BCE, Euribor, IPC).
3. **SolvedExercise sobre cálculo del déficit público** dado un escenario de Presupuestos (gastos por partida + ingresos por impuesto). Refuerza saber D.2 del currículo. Actualmente solo hay Solved 11.1 sobre multiplicador y Solved 11.2 sobre hipoteca.

**Solapamiento**
- "Economía positiva / normativa" — desarrollado aquí completo (saber D.1) y mencionado en U1. Mantener en U11 la versión completa; comprimir U1.
- "Multiplicador del gasto" — aquí desarrollado (saber D.1). No reaparece. OK.
- "Curva de Laffer" — aquí desarrollada. No reaparece. OK.
- "Estado del bienestar / pensiones Bismarck-Beveridge" — aquí desarrollado (saber D.2). Reaparece esquemáticamente en U12 (demografía, MEI, Pacto Toledo). **Decisión recomendada**: aquí el modelo institucional; en U12 los retos demográficos. Bien diferenciado.
- "BCE / política monetaria / QE / QT / Draghi / Lagarde" — descrito esquemáticamente en U10 (institución) y desarrollado aquí (instrumento). Bien diferenciado.
- "Transmisión política monetaria a hipotecas" — Solved 11.2 y RealExample dedicado. Solved 3.2 cubre lo mismo desde lado consumidor. **Solapamiento alto**: SolvedExercise 11.2 (hipoteca 180.000 €/30 años, tipo 2021 → tipo 2024) es prácticamente equivalente a Solved 3.2 (hipoteca 160.000 €/25 años, tipo 3,5 % fijo). Diferenciar: U3 enseñar cuota fija nueva; U11 enseñar shock de revisión hipoteca variable.
- "Inflación tres tipos (demanda/costes/estanflación)" — aquí (saber D.3). Reaparece esquemáticamente en U7 (definición IPC) y U8 (shock petrolero AD-AS). Bien diferenciado.
- "Crisis inflacionaria 2022-2023 zona euro" — caso aquí (D.3) y caso en U8 (Solved 8.1 con respuesta BCE). **Decisión recomendada**: en U8 ilustración del modelo AD-AS; en U11 política monetaria como respuesta institucional. Mantener pero asegurar que el análisis BCE no se repita literalmente.
- "Friedman / monetarismo" — citado aquí (`<Figure>` + caption). Aparece también en U9 (Friedman 1968 y curva Phillips expectativas). Bien diferenciado.

---

### Unit 12 — Globalización, UE y retos contemporáneos

**Cifras desactualizadas**
- "Exportaciones globales 2023 ~31 billones USD, ~1/3 PIB mundial" — actualizar 2024 (OMC publica anualmente).
- "Pobreza extrema mundial 36 % (1990) → 8 % (2022)" — actualizar a Banco Mundial 2024.
- "Comercio internacional ×10 entre 1980 y 2023" — orden correcto, actualizar.
- "Esperanza vida mundial 64 → 73 años desde 1990" — correcto.
- "Reino Unido séptimo cliente España >19.000 M€ pre-Brexit / −8 % real 2023" — actualizar a serie ICEX 2024-2025.
- "OBR estima Brexit reduce PIB UK ~4 %" — correcto.
- "Exportaciones UK a UE −14 % real 2019-2023" — verificar ONS 2024-2025.
- "NextGenerationEU 750.000 M€ totales" — correcto.
- "España receptor 163.000 M€ (77.000 transferencias + resto préstamos)" — correcto pero verificar adenda 2023.
- "España recibió ~48.000 M€ a mediados 2024" — actualizar a mayo 2026.
- "Plan termina en 2026" — correcto, en pleno cierre operacional.
- "20 países euro tras Croacia 2023" — correcto.
- "España puesto 16 SDG Index 2023" — actualizar a SDG Index 2024-2025.
- "España IDH 0,911 puesto 27 (HDR 2023-2024)" — actualizar (citado en U8, no aquí).
- "Tasa fecundidad española ~1,2 hijos/mujer" — correcto.
- "Edad mediana España >45 años (vs 33 en 1990)" — correcto.
- "Ratio cotizantes/pensionistas 2:1 hoy, 1,5:1 en 2050 proyectado" — correcto.
- "Esperanza vida nacer 83 años" — correcto.
- "Frey-Osborne 2013 ~47 % empleos automatizables USA" — correcto pero la propia literatura posterior matiza (Arntz-Gregory-Zierahn 2016 OCDE rebaja al 9-14 % por nivel de tarea, no empleo). Mejorar la presentación matizada.
- AI Act europea 2024 — correcto.
- "Ley Rider 2021" — correcto (Ley 12/2021).
- Acuerdo OCDE impuesto mínimo global 15 % (2021) — correcto.

**Citas a verificar**
- Smith 1776 / Ricardo 1817 — correctos.
- OMC 1995 sucesora GATT 1947 — correcto.
- 164 miembros OMC — verificar 2025-2026 (puede haber nuevas adhesiones).
- "Ronda Doha abierta 2001 nunca cerrada" — correcto.
- "Órgano apelación OMC bloqueado desde 2019" — correcto.
- CECA 1951, Tratados Roma 1957, Acta Única 1986, Maastricht 1992, euro contable 1999, físico 2002 — correctos.
- España entró CEE 1986 — correcto.
- Pacto Verde Europeo 2019 — correcto.
- Ellen MacArthur Foundation 2010 — correcto.
- Georgescu-Roegen 1971 — correcto.
- Daly *Steady-State Economics* 1991 (cita) o 1977 (primera edición) — verificar.
- Latouche, Hickel, Raworth — correctos.
- Raworth *Doughnut Economics* 2017 — correcto.
- Branko Milanović curva del elefante — correcto.
- Malcolm McLean contenedor 1956 — correcto.
- China ingreso OMC 2001 — correcto.
- 17 ODS Agenda 2030 adoptados sept 2015 — correcto.
- PRTR España 2021 — correcto.
- *Beyond Growth Conferences* Parlamento Europeo desde 2018 — correcto.

**3 mejoras prioritarias**:
1. **Reducir longitud** (50 KB, la unidad más larga del libro y la última del curso — riesgo de que el alumnado no llegue). Comprimir secciones de listas (ODS 17 ítems, hitos UE 9 ítems) y consolidar repeticiones internas. Objetivo: bajar de 50 KB a 38-42 KB.
2. **Añadir timeline interactiva** (Preact, Fase 4) de los hitos de la UE 1951-2024 con eventos clickables. Convertirá la sección "Setenta años de construcción" en una experiencia visual.
3. **Refinar el caso Frey-Osborne (2013)** matizándolo con Arntz-Gregory-Zierahn (OCDE 2016) y con literatura post-LLM (post-2023). El 47 % es la cifra famosa pero ya superada por la literatura. Refuerza rigor.

**Solapamiento**
- "Modelo de Solow / PTF / problema productividad española" — desarrollado en U8. Reaparece esquemáticamente aquí (revolución digital → polarización mercado laboral, PTF). **Decisión recomendada**: aquí mencionar con remisión a U8 y enfocar el ángulo "retos contemporáneos del modelo productivo".
- "Estado del bienestar / pensiones / Pacto Toledo / MEI" — desarrollado en U11 (D.2). Reaparece aquí en sección "Demografía, pensiones y migraciones". **Decisión recomendada**: en U11 modelo institucional Bismarck/Beveridge; aquí los retos demográficos específicos y la dimensión migratoria. Bien diferenciado.
- "Curva de Phillips / NAIRU / brecha salarial / EPA" — desarrollados en U9. No reaparecen aquí. OK.
- "Globalización / cadenas globales / desigualdad" — tema propio de U12 (saber E.1). No reaparece. OK.
- "Pacto Verde Europeo / transición ecológica / economía circular" — aquí desarrollado (saber E.2-E.5). Mención breve en U6 (EU ETS). Bien diferenciado.
- "AI Act / Ley Rider / impacto digital empleo" — aquí (saber E.2). Mención breve en U9 (paro estructural). Bien diferenciado.

**Solapamiento con EDMN (libro 1)**:
- **Inditex/Amancio Ortega / Mercadona modelo de negocio**: presentados en EDMN en detalle. En Eco 1BACH U12 *no* aparecen específicamente. Bien.
- **Schumpeter / destrucción creativa / innovación**: presentado en EDMN. En Eco 1BACH no aparece en U12. Bien diferenciado.
- **Crowdfunding, PYME, internacionalización empresa**: en EDMN. En Eco 1BACH U10 se menciona Bizum (fintech) que también está en EDMN; mantener Bizum en ambos con perspectivas distintas (EDMN: producto financiero pyme; Eco 1BACH: agregado monetario).

---

## 3. Resumen ejecutivo cross-unit

**Cifras a actualizar masivamente** (mayo 2026): tipos BCE, Euribor, IPC España y zona euro, SMI 2025-2026, PIB y crecimiento 2024-2025, EPA 2025-2026, deuda y déficit 2024-2025, precios vivienda Madrid/Valencia 2025-2026, datos NextGenerationEU recibidos. Es la actuación más urgente de Fase 1. Estimación: 30-40 cifras dispersas por las 12 units.

**Citas legales/doctrinales con error**: prácticamente ninguno. El libro está sólidamente referenciado. Pequeños puntos: edición de Daly *Steady-State Economics* (1977 vs 1991), atribución Joan Robinson en U1, matiz Frey-Osborne 2013 en U12.

**Solapamientos cross-unit más relevantes**:
1. **Bankia preferentes** entre U3 y U10 (consumidor vs rescate). Comprimir uno.
2. **Card-Krueger SMI** entre U1, U2, U5 y U9. Mantener completo solo en U9.
3. **Cuota hipoteca** entre Solved 3.2 y Solved 11.2. Diferenciar perspectivas.

**Solapamientos con EDMN**:
1. **Mercadona**: presentación distinta (estructura de mercado en Eco 1BACH, modelo de negocio en EDMN). OK con cross-reference.
2. **Bizum**: aparece en EDMN y Eco 1BACH U10. Perspectivas distintas (producto pyme vs fintech sistémica), mantener.
3. **Schumpeter, destrucción creativa, Porter**: bien aislados a EDMN, no contaminan Eco 1BACH.

**Componentes faltantes para Fase 2**:
- Glosarios per unit (10-12 términos clave): faltan en TODAS las units.
- Sección "Para profundizar" con 3-5 lecturas opcionales: falta en TODAS.
- Preguntas de reflexión finales: falta en TODAS.
- Reading time + pre-requisitos: falta en TODAS.

**Diagramas SVG nuevos prioritarios** (5):
1. Curva valor Teoría Prospectiva (U2)
2. Interés compuesto exponencial (U3)
3. Excedentes con peso muerto (U5)
4. Matriz rivalidad × exclusión (U6)
5. Descomposición Solow crecimiento (U8)

**Imágenes a sustituir** (5): Einstein (U3), Torres KIO Bankia (U3), Keynes Bretton Woods (U7), Oficina empleo (U9), Bitcoin token (U10).

**SolvedExercises a añadir** (priorizados): U5 precio máximo con peso muerto, U6 impuesto pigouviano calibrado, U7 tasa de paro EPA + inflación interanual, U10 agregados monetarios M0→M3, U11 déficit público.

**Riesgos de longitud**: U10 (47 KB), U11 (42 KB), U12 (50 KB) superan el techo recomendado de 38 KB / 380 líneas. La última unidad del curso (U12) es la más larga, lo cual es pedagógicamente arriesgado. Recortar en Fase 2.
