# Diagnóstico Eco 4ESO — Fase 0 del plan de mejora 2026

> Diagnóstico detallado del libro Eco 4ESO (Economía y Emprendimiento, optativa de 4.º de la ESO, 10 units). Sesión 2026-05-18, Fase 0 del plan consensuado en `docs/plan-mejora-libros-2026.md`. Contenido analizado vía `git show feat/eco-4eso-foundation:...`.

## Contexto y método

- **Branch revisado**: `feat/eco-4eso-foundation` (PR #26, sin merge).
- **Units**: 10 (4 bloques A-D, conforme al RD 217/2022 + twist editorial profedeeconomia en Units 5 y 8).
- **Densidad media**: ~250 líneas MDX por unit (objetivo 220-300). Las Units 7-10 son las más densas (8-12 sesiones). La Unit 8 ronda las 350 líneas, justificable por la doble carga (nómina + IRPF + contratos + formas jurídicas).
- **Diagramas SVG**: 6 (4 nuevos: RolesEquipo, Presupuesto503020, NominaAnotada, PitchDeck10Slides; 2 reusados de EDMN: BusinessModelCanvas, DoubleDiamond).
- **Calculadoras detectadas en plan**: NominaESO (Unit 8) y Presupuesto503020 (Unit 7). Diagnóstico textual del MDX; el componente calculadora vive fuera de la unidad y se evalúa por la calidad pedagógica del andamiaje en el MDX.

## Findings por unit

### Unit 1 — ¿Qué es emprender? Mitos y realidades

**Cifras a verificar / actualizar**
- DIRCE 1 enero 2024: 3.357.251 empresas activas / 99,8 % pymes / 94,2 % micro / 1.847.000 sin asalariados / 5.211 con ≥250 empleados. Datos coherentes con DIRCE 2024 publicado en septiembre 2024. **Actualizable a DIRCE 2025** (publicación septiembre 2025) en Fase 1.
- "64 % del empleo privado en pymes": cifra OK pero sin fuente exacta citada (Cifras PyME suele dar ≈66 %). Verificar.
- "72 empresas por cada 1.000 habitantes" / "media trabajadores España 4,7 vs Alemania 11,3": cifras de Cifras PyME 2023-24, OK; revisar edición vigente.
- Bitwise (Pol Tarsa, Barcelona 2019, 800.000 € en 4 años): **caso difícil de verificar públicamente**, podría ser invención del sub-agente. CRÍTICO — sustituir por caso documentado.
- Mark Zuckerberg "habitación universitaria" / Bezos "30 años" / Hastings "37" / Ortega "39": datos OK.
- Estudio MIT Azoulay et al. 2018, edad media 45 años: OK (NBER 24489 / AER Insights 2(1)).

**Citas a verificar**
- Cita literal del estudio Azoulay et al.: "casi el doble de probabilidades de tener éxito un fundador de 50 que uno de 30". El paper da una afirmación en ese sentido pero el ratio exacto conviene afinar.
- Ferràs, X. (2019) — referencia bibliográfica válida.

**Solapamiento con otros libros**
- **Mercadona (familia Roig, 1977)**: aparece aquí Y en EDMN 2BACH Unit 1. Decidir libro principal.
- **Tejido empresarial DIRCE**: solapa con EDMN Unit 1 ("3,3 millones de empresas, 99,8 % pymes…"). Coordinación necesaria en Fase 1: profundidad analítica diferente justifica duplicado parcial, pero la cifra exacta debe ser la misma y citada una vez.
- **Imagen mercado de Valencia (jamón)**: ya usada en webpde antiguo; OK pero atribución doble.
- **Reed Hastings / Bezos / Ortega / Zuckerberg**: lista de casos también usada en EDMN/Eco 1BACH. Verificar y diversificar si procede.

**3 mejoras prioritarias**
1. **Verificar y/o sustituir el caso Bitwise/Pol Tarsa**: si no se confirma con fuente accesible, reemplazar por un caso real español de joven emprendedor (Glovo arranque, Wallapop arranque, Cabify Madrid). Esta unidad es la primera del curso, no puede abrir con un caso inventable.
- **Añadir un mini-glosario de 8-12 términos** (DIRCE, pyme, microempresa, autoemprendimiento, intraemprendimiento, emprendimiento social, FFF, etc.) al estilo Fase 2 del plan.
3. **Diagrama SVG nuevo**: pirámide visual del tejido empresarial español (3,3M → 99,8% pymes → 94,2% micro → 55% sin asalariados). Hoy se cuenta solo con prosa y un Curiosity; el dato pide visualización.

---

### Unit 2 — Habilidades del emprendedor

**Cifras a verificar**
- Edison: la frase de las "10.000 formas que no funcionan" es **apócrifa/folklore**, no hay registro escrito de Edison diciéndola textualmente. La unidad la presenta como atribución prudente ("frase atribuida"), correcto, pero conviene reforzar la cautela.
- Sara Blakely "5.000 dólares" / "Forbes 2012 mujer más joven hecha a sí misma en mil millones": OK (Forbes 2012).
- "Brainstorming inventado por Alex Osborn en 1953": OK (Applied Imagination).
- "SCAMPER desarrollado por Bob Eberle en los años setenta": OK.
- Dweck: "3 décadas de investigación 1988-2017": OK como aproximación.

**Citas a verificar**
- "Mindset" de Dweck en castellano: Sirio publicó la edición. OK.
- Estudio Dweck en escuelas de Chicago sobre añadir "todavía" mejorando notas: esta afirmación es **interpretación divulgativa**, no resultado experimental directo. Citar con cuidado.
- Adrián Ferran (2014) *Comer para pensar*: referencia OK pero **no aparece citada en el texto**. ¿Para qué se incluye? Revisar bibliografía o añadir cita en cuerpo.
- Sara Blakely *How I Built This* 2018: OK.

**Solapamiento**
- **Brainstorming + SCAMPER**: solapa con EDMN Unit 3 (innovación) y con Eco 1BACH Unit 11 (innovación). Eco 4ESO tiene la versión más pedagógica; debería quedarse aquí y los otros referenciar.
- **Dweck mentalidad de crecimiento**: NO solapa con EDMN/Eco 1BACH (es exclusiva de Eco 4ESO). Buena diferenciación.
- **Edison filamento bombilla**: solapa potencial con EDMN Unit 3 (innovación). Verificar.
- **Sara Blakely Spanx**: NO solapa, exclusiva aquí. Bien.

**3 mejoras prioritarias**
1. **Reformular la afirmación sobre Edison y el experimento Dweck-Chicago** con cautela académica más explícita ("se ha popularizado…" en lugar de "demostró").
2. **Limpiar la bibliografía**: o citar Ferran Adrià en el cuerpo o quitar de la bibliografía; añadir referencia académica sólida (paper original de Dweck en *Psychological Review*).
3. **SolvedExercise faltante** sobre SCAMPER aplicado a un objeto concreto, con plantilla rellenada y evaluada (los Steps lo presentan pero sin pauta de evaluación). Sería el primer ejercicio resuelto del libro tras Unit 1.

---

### Unit 3 — Ética y emprendimiento social

**Cifras a verificar**
- La Fageda: "18M € facturación / 300 personas / >150 con discapacidad / 3ª marca de yogures Cataluña / fundada 1982": cifras razonables. La 3ª posición en Cataluña conviene verificar contra dato Nielsen 2023-24.
- B Corp en España: "≈120 empresas certificadas a cierre 2024": cifra razonable (B Lab Spain). Actualizable a 2025.
- Volkswagen Dieselgate: "30.000 M€ multas / 40× emisiones": OK (cifras públicas).
- H&M Conscious Collection: Norwegian Consumer Authority 2022: OK.
- GEM España 2022-23: TEA 7,5 % h / 5,3 % m: OK.
- Holaluz: B Corp en 2018, salida BME Growth 2019, fundada 2010 por Pi/Vila/Nogué: OK.

**Citas legales a verificar**
- Bowen (1953) *Social Responsibilities of the Businessman*: OK.
- Friedman (1970) NYT artículo: OK.
- Ley 5/2011 Economía Social: OK.
- LO 3/2007 Igualdad: OK.
- RD-Ley 6/2019 medidas igualdad y empleo: OK.
- **CSRD** "obliga a publicar memorias desde 2024-2025": correcto pero matizar — entró en vigor escalonadamente, primeras empresas grandes reportan ejercicio 2024.
- McKinsey *Diversity Wins* (2020): OK.

**Solapamiento**
- **Friedman vs Bowen**: solapa potencial con EDMN Unit 5 (RSC) y Eco 1BACH ética. Verificar quién mantiene la versión canónica.
- **La Fageda**: NO solapa, exclusiva aquí. Excelente caso.
- **Holaluz**: solapa potencial con Eco 1BACH (energía/renovables). Verificar.
- **ODS Agenda 2030**: la lista de 17 ODS aparece en EDMN Unit 5 y Eco 1BACH Unit 8. Mantener solo aquí con detalle, los otros referencian.
- **Greenwashing Volkswagen/H&M**: posible solape con EDMN. Coordinar.

**3 mejoras prioritarias**
1. **Diagrama SVG nuevo**: pirámide de los 3 niveles de RSC (filantropía → integración → estrategia) con flecha de "profundidad de compromiso". Hoy todo es texto.
2. **Añadir caso español de greenwashing reciente** que el alumno reconozca (Endesa-Iberdrola "verde", Repsol "renovables", Inditex "Join Life" con quejas FACUA). Volkswagen y H&M son extranjeros y antiguos.
3. **Actualizar GEM España a edición 2023-24** (publicada finales 2024) si está disponible.

---

### Unit 4 — El entorno: detectar oportunidades

**Cifras a verificar**
- "SMI 2026 = 1.184 €": pendiente de subida real de 2026. El SMI 2025 fue 1.184 €/14p tras RD-Ley 1/2025; el de 2026 está por aprobar. **CRÍTICO — verificar en Fase 1**.
- Inflación 2022 8,4 %: OK (IPC anual INE).
- "Solar fotovoltaica residencial +300 % España 2020-2024": cifra UNEF razonable pero conviene fuente exacta.
- "9,5 M personas >65 años en 2025": OK aproximadamente (INE Padrón).
- "Teletrabajo del 4,8 % al 13,5 % entre 2019 y 2023": EPA INE, OK.
- Wallapop: "17 M usuarios" (KeyTakeaway) vs "19 M usuarios" (Unit 6, mismo libro). **Inconsistencia interna**. Reconciliar.
- Airbnb "80.000 M$" (Unit 4) vs "90.000 M$" (Unit 9). Reconciliar.

**Citas legales a verificar**
- Ley 20/2007 Estatuto Trabajo Autónomo, edad mínima 16: OK.
- Reglamento UE 2016/679 RGPD: OK (citado en Unit 5).
- Aguilar (1967) formulación PEST: OK.

**Solapamiento**
- **PESTEL**: solapa con EDMN Unit 6 (entorno empresa) y Eco 1BACH macroentorno. La versión 4ESO es la más pedagógica; profundizar EDMN y referenciar en lugar de duplicar.
- **Wallapop**: aparece en Unit 4 Y en Unit 6 del mismo libro. **Solapamiento intra-libro**. Decidir unidad principal.
- **Airbnb**: aparece en Unit 4, Unit 9 (Airbnb story de Chesky/Gebbia). Coherencia interna.
- **Glovo**: aparece en Unit 8 y Unit 9 del mismo libro. Aceptable porque el ángulo es distinto (rider/laboral en Unit 8, MVP en Unit 9), pero verificar.

**3 mejoras prioritarias**
1. **Reconciliar cifras de Wallapop y Airbnb dentro del propio libro** (CRÍTICO de coherencia interna).
2. **Actualizar SMI 2026 con la cifra oficial** una vez aprobada (probablemente febrero 2026, retroactivo a enero).
3. **Convertir el "diario de molestias" en plantilla descargable/imprimible**, no solo tabla MDX. Es la herramienta más diferenciadora de la unidad.

---

### Unit 5 — Consumo inteligente y derechos del consumidor (★ twist editorial)

**Cifras a verificar**
- Garantía legal 3 años desde RD-ley 7/2021: OK (entrada en vigor 1 enero 2022).
- Multa Renfe AEPD 30.000 €: **verificar resolución PS/00057/2023**. Esta cifra parece baja para AEPD (suelen ser cientos de miles a millones). Posible error del sub-agente. Verificar referencia exacta.
- FTC vs Amazon Prime "11 clics / 6 páginas / 15 opciones, Project Iliad": casos reales documentados en demanda FTC junio 2023. OK.
- Brignull 2010 acuñación "dark patterns": OK.
- Digital Services Act Reglamento UE 2022/2065: OK.

**Citas legales a verificar**
- RDLeg 1/2007 LGDCU: OK.
- RD-ley 7/2021: OK (transposición Directiva 2019/771).
- Directiva 2011/83/UE: OK.
- RGPD: OK.
- Ley 34/1988 General Publicidad y Ley 3/1991 Competencia Desleal: OK.
- "Artículos 102-108 LGDCU sobre desistimiento": **verificar numeración exacta** (recientemente la LGDCU ha sido modificada varias veces).
- Reglamento UE 1169/2011 etiquetado alimentario: OK.

**Solapamiento**
- **Esta unidad es exclusiva del libro Eco 4ESO** (twist editorial profedeeconomia, saber B.4). NO solapa con EDMN ni Eco 1BACH. Excelente diferenciador.
- Solo potencial solape menor con FOPP 4ESO Unit 1 si trata vida cotidiana.

**3 mejoras prioritarias**
1. **Verificar la multa AEPD a Renfe** (30.000 € parece insuficiente; podría confundirse con otra resolución). Si el caso no se sostiene, sustituir por sanción AEPD reciente bien documentada.
2. **Diagrama SVG nuevo**: catálogo visual de los 5 dark patterns con icono y patrón visual de cada uno (forced continuity, roach motel, confirmshaming, drip pricing, misdirection). Hoy solo texto.
3. **Calculadora interactiva nueva (Fase 4)**: simulador de drip pricing tipo Ryanair que muestre cómo un vuelo "29 €" se convierte en "87 €" con extras. Vincularía el contenido al diferenciador editorial digital.

**Imagen débil**
- `amazon-box.jpg` (caja de Amazon): demasiado genérica. Sustituible por captura real de proceso de cancelación Amazon Prime (Project Iliad) o por imagen de catálogo de dark patterns reales.

---

### Unit 6 — Recursos humanos y equipos

**Cifras a verificar**
- Proyecto Aristóteles Google 2012-2015, 180 equipos: OK (Duhigg NYT Magazine, re:Work).
- Belbin 1981: OK.
- Pink *Drive* 2009: OK.
- Edmondson 1999 paper seguridad psicológica: OK (Administrative Science Quarterly 44(2)).
- Wallapop "19 M usuarios España, Italia y Portugal" / "400 personas" / ">350 M € inversión": cifras razonables. **Reconciliar con Unit 4 que dice 17 M**.
- "Tres fundadores: Agus Gómez, Gerard Olivé, Miguel Vicente": OK.

**Citas a verificar**
- Lencioni *Five Dysfunctions*: OK.
- Scrum Guide Schwaber/Sutherland 2020: OK.

**Solapamiento**
- **Roles Belbin**: solapa potencial con EDMN Unit 9 (RRHH/equipos). Verificar.
- **Scrum/sprint**: posible solape con EDMN o FOPP. Coordinar.
- **Wallapop**: tercer aparición tras Unit 4 (Eco 4ESO) y posibles menciones en otros libros. **Sobreuso del caso Wallapop**.
- **Proyecto Aristóteles Google**: ¿aparece en EDMN? Verificar.
- **Daniel Pink + autonomía/maestría/propósito**: posible solape con FOPP 4ESO si trata motivación profesional.

**3 mejoras prioritarias**
1. **Reducir el uso del caso Wallapop a UNA aparición sólida en el libro** (mejor en Unit 4 como detección de oportunidades, retirar de Unit 6 y sustituir por otro caso de equipo fundador español: Cabify, Glovo arranque, Holaluz).
2. **Diagrama RolesEquipo ya creado**: verificar que muestra los 5 roles con punto fuerte/punto débil visibles. Si no, ampliar.
3. **Añadir SolvedExercise** sobre cómo simular un sprint de 2 semanas en un proyecto de aula con plantilla de daily, retrospectiva y entregable; hoy hay Steps pero no ejercicio resuelto.

---

### Unit 7 — Dinero, presupuesto y financiación

**Cifras a verificar**
- Regla 50-30-20 Elizabeth Warren *All Your Worth* 2005: OK.
- Tarifa Plana autónomos: "80 €/mes durante 12 meses, ampliable a 24 si rendimientos < SMI": OK con sistema vigente desde 2023 (Ley 31/2022 + RD 504/2022).
- ENISA "Jóvenes Emprendedores hasta 75.000 €": OK.
- Verkami: "12.000 proyectos / 42 M€ acumulados": razonable, verificar memoria 2023-24.
- Orgullo y Satisfacción Verkami: "pedían 18.000 €, recaudaron >96.000 €, >3.500 aportantes": **verificar campaña real 2014**.
- Cifras del SolvedExercise 7.2 (100 € al 5 % 30 años = 432,19 €): cálculo correcto. (1,05)^30 = 4,32194.
- Circular Banco España 5/2012 obligación TAE: OK.

**Citas a verificar**
- Warren & Tyagi 2005 *All Your Worth*: OK.
- Mishkin (2019) *Economics of Money*: OK.

**Solapamiento**
- **Regla 50-30-20**: NO solapa con EDMN/Eco 1BACH (es twist personal). Buen diferenciador.
- **Interés simple vs compuesto**: solapa potencialmente con EDMN Unit 11 (matemática financiera) o Eco 1BACH 8 (dinero). En 4ESO debe ser introducción; profundización en BACH.
- **TIN/TAE**: idéntico, solapa con EDMN/Eco 1BACH. Coordinar.
- **Fuentes financiación (FFF, banco, crowdfunding, business angels, ICO, ENISA)**: solapa fuerte con EDMN Unit 7 o equivalente. Decidir libro principal.
- **Verkami**: NO solapa, exclusivo. Buen caso.

**3 mejoras prioritarias**
1. **Verificar campaña Verkami "Orgullo y Satisfacción"** con datos exactos.
2. **Calculadora Presupuesto503020 (ya prevista en plan)**: rigurosamente, hoy el MDX presenta tabla y SolvedExercise pero no integra calculadora interactiva. Confirmar componente real en Fase 4.
3. **Diagrama Presupuesto503020 ya creado**: verificar que muestra los 3 segmentos con porcentajes y ejemplos cuantificados; hoy depende de cómo se haya implementado.

---

### Unit 8 — Economía personal: nómina, IRPF y contratos (★ twist editorial)

**Cifras a verificar**
- Orden ESS/2098/2014 modelo nómina: OK.
- Ley 35/2006 IRPF: OK.
- RD-Ley 32/2021 Reforma Laboral: OK.
- Cotización trabajador SS 6,35 % (4,7 + 1,55 + 0,1 + 0,1 MEI): correcto para 2024. **MEI subió a 0,12 % en 2025**, llegando a 0,13 % en 2026 según calendario aprobado. CRÍTICO — actualizar.
- Tramos IRPF estatales 2024: OK pero conviene actualizar a tabla 2025-2026 (los tramos suelen tocarse).
- Mínimo personal exento 5.550 €: OK 2024 pero verificar 2026.
- "Tasa temporalidad caída del 25 % al 17 % en 3 años" tras reforma 2021: cifras INE EPA OK.
- Tarifa plana autónomos 80 €/mes: OK.
- 3,4 M autónomos 2024 TGSS: OK.
- Impuesto sociedades 25 % / 15 % nuevas creación: OK.
- Cooperativas 20 % fiscalmente protegidas: OK.
- Ley Crea y Crece 2022 capital mínimo SL 1 €: OK.
- STS 805/2020 caso Glovo: OK (25 septiembre 2020).
- Ley Rider RD-Ley 9/2021: OK.
- **OCU 30 % trabajadores no saben leer nómina (2023)**: cifra divulgativa, verificar fuente exacta o reformular como "estimación".

**Citas a verificar**
- Orden ESS/2098/2014: OK.
- Ley 35/2006 IRPF: OK.
- AEAT Manual práctico Renta 2023: OK pero **actualizar a Renta 2024-2025**.

**Solapamiento**
- **Esta unidad es exclusiva (★ twist editorial)**. NO solapa con EDMN/Eco 1BACH. Excelente diferenciador.
- Solo posible solape menor con FOPP 4ESO si trata contratos/inserción laboral (verificar Unit 1-2 FOPP).

**3 mejoras prioritarias**
1. **Actualizar todas las cifras a 2026**: tramos IRPF, mínimo personal exento, MEI, cuota autónomos, SMI. CRÍTICO porque esta unidad es la más vulnerable a obsolescencia.
2. **Calculadora NominaESO (ya prevista en plan, Fase 4)**: el MDX presenta tabla ejemplo y SolvedExercise 8.1, pero la calculadora interactiva (input bruto anual → output desglose nómina con SS/IRPF/neto) es lo que justifica el carácter práctico. Confirmar componente.
3. **Imagen Yolanda Díaz**: cuidado político. La caption la presenta como "impulsora" de la reforma; correcto históricamente pero conviene neutralidad sobria. Sustituir por imagen de nómina anotada de verdad o de una mano firmando contrato laboral.

---

### Unit 9 — Diseño del proyecto: BMC, Design Thinking y prototipado

**Cifras a verificar**
- Osterwalder 2010 BMC: OK.
- Ries 2011 *The Lean Startup*: OK.
- IDEO ratón Apple Lisa 1980: caso real. "Steve Jobs" en 1980 estaba aún en Apple. OK.
- Glovo: "Oscar Pierre y Sacha Michaud 2015 / l'Eixample Barcelona / Excel + 3 motos": **verificar origen exacto**. La historia es coherente con entrevistas pero la "Eixample" como barrio inicial conviene confirmar (algunas fuentes dicen Sant Cugat).
- Airbnb octubre 2007 / colchones / 80 $ / 3 huéspedes / "Boston, Utah, India": cifras OK con la historia oficial de Chesky.
- "Airbnb vale >90.000 M$" (Unit 9) vs "80.000 M$" (Unit 4). **Inconsistencia interna**.
- Stanford d.school: OK.
- Brown 2009 *Change by Design*: OK.

**Citas a verificar**
- Maurya 2012 *Running Lean*: OK.
- Kelley & Kelley 2013 *Creative Confidence*: OK.

**Solapamiento**
- **BMC**: aparece en EDMN Unit 10 (modelos de negocio) y aquí. Diagrama reusado, coherente; profundidad distinta justifica duplicado.
- **Lean Startup / MVP / pivot**: solapa con EDMN Unit 12 y Eco 1BACH. La versión 4ESO debe ser más simple.
- **Design Thinking**: posible solape con EDMN. Coordinar.
- **Airbnb**: aparece aquí, Unit 4 y posiblemente EDMN. Sobreuso.
- **Slack pivot**: NO solapa (exclusivo Unit 10).

**3 mejoras prioritarias**
1. **Reconciliar Airbnb dentro del libro** (80 M vs 90 M$). Idem fechas/historias.
2. **Coordinar BMC con EDMN**: la versión 4ESO debería ser claramente simplificada (post-its grandes, vocabulario más accesible); la EDMN, más analítica.
3. **Verificar barrio inicial Glovo** (Eixample vs Sant Cugat). Una versión dice "piso en Sant Cugat" (Unit 6) y otra "l'Eixample" (Unit 9). Coherencia interna crítica.

---

### Unit 10 — Validación, comunicación y pitch del proyecto

**Cifras a verificar**
- Slack pivot desde Glitch 2009-2012: OK.
- "Salesforce compra Slack por 27.700 M$ en 2021": OK (anunciado dic 2020, cerrado julio 2021).
- "Slack 8.000 empresas lista espera primer día agosto 2013": OK con datos de Butterfield.
- Kawasaki regla 10/20/30: OK.
- Airbnb pitch deck 2008 / 600.000 $ / Y Combinator: OK.
- 4YFN Barcelona, MWC: OK.
- Tucuvi, Yapaya: empresas reales. **Verificar que efectivamente levantaron rondas tras 4YFN 2024** — la atribución es divulgativa.
- "Airbnb vale >80.000 M$" (Unit 10) — coherente con Unit 4 pero no con Unit 9 (90 M$). Reconciliar trilateralmente.

**Citas a verificar**
- Sinek *Start with Why*: OK.
- Anderson *TED Talks*: OK.
- Memoria 4YFN 2024 MWC Barcelona: OK.

**Solapamiento**
- **Pitch deck Kawasaki 10/20/30**: posible solape con EDMN Unit 12 o equivalente. Coordinar.
- **Storytelling**: posible solape con EDMN/Eco 1BACH si tratan comunicación. La versión 4ESO debe ser pedagógica básica.
- **Slack pivot**: posible solape con EDMN Unit 12 (Lean Startup). Verificar.
- **Airbnb**: tercer aparición en el libro tras Units 4 y 9. **Sobreuso crítico**.
- **Métricas vanidad vs accionables**: posible solape con EDMN Unit 11 o 12 (marketing/innovación).

**3 mejoras prioritarias**
1. **Reducir el caso Airbnb a UNA aparición principal en el libro** (Unit 4 como detección de necesidad propia o Unit 9 como MVP), retirando de las otras dos.
2. **Verificar atribución 4YFN 2024 + Tucuvi/Yapaya** con fuente concreta. Si no se sostiene, generalizar la afirmación.
3. **Diagrama PitchDeck10Slides ya creado**: verificar que muestra las 10 slides con tiempo asignado a cada una; integración pedagógica clara.

---

## Findings globales del libro Eco 4ESO

### Tono 4ESO

- **Unit 1 está EN SU PUNTO**, no demasiado simple: introduce 3 modalidades de emprender + DIRCE + 4 mitos + 5 rasgos. Sólido sin abrumar.
- **Unit 3 (ética)** roza la **densidad excesiva** para 4ESO: 3 niveles RSC + 17 ODS + B Corp + greenwashing + igualdad + economía circular + comercio justo. Demasiado bloque B teórico en una sola unidad. Considerar partir o aligerar bibliografía.
- **Unit 8 (nómina/IRPF/contratos/formas jurídicas)** es la más densa por necesidad — 10-12 sesiones, 350 líneas. Justificable porque es el twist editorial, pero pide andamiaje pedagógico extra (mini-glosario, preguntas guía).
- **Units 9-10 (capstone)** funcionan bien como tándem pero **se solapan internamente con MVP/prototipo/Lean Startup**. Distinguir mejor: Unit 9 = diseño, Unit 10 = validación + pitch.
- En general el tono es **correcto para 4ESO**: vocabulario accesible, ejemplos cotidianos, sin condescendencia. Mejor calibrado que Eco 1BACH en ese aspecto.

### Overlap con EDMN y Eco 1BACH (CRÍTICO)

Top 5 solapamientos cross-libros a resolver en Fase 1:

1. **Tejido empresarial DIRCE (3,3M empresas, 99,8 % pymes)**: EDMN Unit 1 + Eco 4ESO Unit 1. Decisión: EDMN profundo (análisis), Eco 4ESO referenciado (con cita cifra).
2. **PESTEL**: EDMN Unit 6 + Eco 4ESO Unit 4. Decisión: Eco 4ESO es la versión pedagógica simplificada (pensada para 4ESO); EDMN la versión analítica completa (Porter + 5 fuerzas integrado).
3. **BMC**: EDMN Unit 10 + Eco 4ESO Unit 9. Diagrama compartido OK; profundidad distinta justifica duplicado. Coordinar vocabulario.
4. **Lean Startup / MVP / pivot**: EDMN Unit 12 + Eco 4ESO Unit 9-10. Decisión: Eco 4ESO versión introductoria, EDMN versión avanzada con métricas de validación.
5. **Fuentes de financiación (FFF, banco, crowdfunding, business angels, ICO, ENISA)**: EDMN Unit 7 + Eco 4ESO Unit 7. Posible duplicación literal. Coordinar.

Solapamientos intra-libro (Eco 4ESO consigo mismo) detectados:

- **Wallapop**: Unit 4 + Unit 6 (caso fundador) — sobreuso. Quitar de Unit 6.
- **Airbnb**: Unit 4 + Unit 9 (MVP colchones) + Unit 10 (pitch deck 10 slides) — sobreuso crítico. Reducir a UNA aparición principal.
- **Glovo**: Unit 8 (rider laboral) + Unit 9 (MVP Excel + 3 motos) — aceptable porque ángulos distintos, pero coherencia interna en barrio inicial (Eixample vs Sant Cugat) necesaria.

### Calculadoras NominaESO + Presupuesto503020

- **Presupuesto503020 (Unit 7)**: el MDX presenta la regla con texto + tabla + SolvedExercise 7.1. **Rigor pedagógico OK**, **pero simplista en cuanto a interactividad**: hoy es solo diagrama estático. Pasa la prueba de "regla 50-30-20" pero el componente calculadora real (input ingresos → output desglose) no está integrado en el MDX. Está previsto en Fase 4. Cuando se construya, conviene añadir:
  - Editable de la regla (algunas familias necesitan 60-25-15 si rentas bajas).
  - Persistencia localStorage del presupuesto del alumno.
  - Gráfico circular interactivo (no solo el SVG estático).

- **NominaESO (Unit 8)**: el MDX presenta SolvedExercise 8.1 con cálculo completo (bruto 18k → SS 6,35% → IRPF 9% → neto 15.237 €). **Rigor pedagógico ALTO**. **Simplificaciones aceptables**: base de cotización aproximada al bruto (ignora prorrateo extras estricto), tipo medio IRPF estimado (9% en lugar de cálculo por tramos completo). Para una calculadora real Fase 4, conviene:
  - Input: salario bruto anual + situación familiar (soltero, casado, n hijos).
  - Output: nómina mes a mes con desglose real (base cotización con prorrateo, tipo IRPF según tramos AEAT 2026, MEI 2026 actual).
  - Comparación bruto/neto/coste empresa (lo que paga la empresa además del bruto).
  - Persistencia localStorage.
  - Botón "imprimir nómina ejemplo".

**Veredicto**: el andamiaje pedagógico en el MDX es **riguroso para 4ESO**, no simplista. La calculadora interactiva real (Fase 4) debe ir un paso más allá para honrar el diferenciador editorial.

### Tratamiento del diferenciador editorial: Units 5 y 8

- **Unit 5 (consumo digital)**: APROVECHADA al 80 %. Incluye dark patterns, RGPD, derecho desistimiento, garantía 3 años, ruta de reclamación. Solo falta:
  - Catálogo visual de dark patterns en diagrama SVG.
  - Calculadora drip pricing tipo Ryanair (Fase 4).
  - Caso de greenwashing español reciente (los actuales son Volkswagen y H&M, extranjeros).
- **Unit 8 (nómina/IRPF/contratos)**: APROVECHADA al 90 %. Cubre lo esencial con rigor + caso Glovo + Reforma 2021 + formas jurídicas + Tarifa Plana. Solo falta:
  - Calculadora NominaESO interactiva real (Fase 4).
  - Actualización todas las cifras a 2026.
  - Diagrama NominaAnotada ya creado; verificar que muestra los 7 conceptos con etiquetas claras.

**Veredicto general**: el diferenciador editorial está BIEN APROVECHADO. Las dos units twist son las más sólidas del libro pedagógicamente y las que más justifican su existencia frente a otros manuales 4ESO comerciales.

### Bibliografía

- **Densidad media**: 6-8 referencias por unit. Adecuada para 4ESO (menos cargada que Bachillerato como pide el currículo).
- **Calidad**: mezcla de fuentes oficiales (BOE, INE, OCU, FACUA, AEPD, BdE, AEAT) y bibliografía secundaria sólida (Dweck, Pink, Ries, Osterwalder, Kawasaki, Belbin). Apropiada.
- **Puntos débiles**:
  - Unit 2 cita a Ferran Adrià sin que aparezca en el cuerpo. Limpiar.
  - Algunas referencias son URLs sin DOI ni edición específica (Wallapop, Verkami) — aceptable para fuentes primarias corporativas pero conviene fecha de consulta.
  - Falta referencia académica directa al paper original de Dweck en la Unit 2 (cita libro divulgativo, no paper).
  - La Unit 6 (equipos) podría incorporar referencia al paper original de Edmondson 1999 ya citado (bien) y un caso académico español si existe.

### Imágenes débiles (top 3-5)

1. **`amazon-box.jpg` (Unit 5)**: caja genérica de Amazon. Demasiado obvia, no aporta. **Sustituir** por captura real de proceso de cancelación de Prime con anotaciones (Project Iliad) o por imagen de dark pattern en pantalla real.
2. **`hucha-ceramica.jpg` (Unit 7)**: foto de huchas genéricas. Cliché visual. **Sustituir** por imagen de billetes acumulándose con gráfico interés compuesto superpuesto, o por foto editorial de cuaderno de presupuesto manuscrito.
3. **`euros-billetes-monedas.jpg` (Unit 7)**: billetes y monedas extendidos sobre mesa. Genérica. **Sustituir** por imagen contextual (entrada del Banco de España, gráfico financiero real, persona haciendo cálculos).
4. **`yolanda-diaz-oficial.jpg` (Unit 8)**: retrato oficial político. La caption la enmarca como "impulsora" — correcto pero carga política. **Sustituir** por foto neutral de nómina real anotada, o de oficina SEPE, o de manos firmando contrato.
5. **`mercadona-tavernes.jpg` (Unit 1)**: fachada de supermercado genérica. La narrativa pide "empezó pequeño y creció". **Sustituir** por foto histórica Mercadona años 80 si existe, o por collage antes/después.

### Diagramas oportunos nuevos (top 3-5)

Ya hay 4 nuevos creados (RolesEquipo Unit 6, Presupuesto503020 Unit 7, NominaAnotada Unit 8, PitchDeck10Slides Unit 10) + 2 reusados (BMC Unit 9, DoubleDiamond Unit 9). Faltan:

1. **Pirámide del tejido empresarial español (Unit 1)**: 3,3 M empresas → 99,8 % pymes → 94,2 % micro → 55 % sin asalariados → 0,2 % grandes. Hoy todo prosa.
2. **3 niveles de RSC (Unit 3)**: filantropía / integración / estrategia con flecha de "profundidad de compromiso" y ejemplo por nivel.
3. **Catálogo visual de 5 dark patterns (Unit 5)**: forced continuity / roach motel / confirmshaming / drip pricing / misdirection. Icono + esquema visual por cada uno.
4. **Comparativa interés simple vs compuesto a 5/10/20/30 años (Unit 7)**: gráfico de líneas que muestre la divergencia exponencial. Hoy es tabla.
5. **Triángulo de motivación intrínseca de Pink (Unit 6)**: autonomía / maestría / propósito como triángulo con definición corta de cada vértice. Hoy solo bullets.
6. **Comparativa formas jurídicas (Unit 8)**: tabla visual autónomo vs SL vs cooperativa con capital, responsabilidad, fiscalidad, gobernanza. Hoy es prosa por bloques.

---

## Backlog priorizado para Fases 1-4 (libro Eco 4ESO)

### Fase 1 (eje A — rigor)
- [CRÍTICO] Verificar/sustituir caso Bitwise/Pol Tarsa (Unit 1).
- [CRÍTICO] Verificar multa AEPD Renfe 30.000 € (Unit 5).
- [CRÍTICO] Reconciliar cifras Wallapop (17M vs 19M) y Airbnb (80MM vs 90MM$) intra-libro.
- [CRÍTICO] Reconciliar barrio inicial Glovo (Eixample vs Sant Cugat) intra-libro.
- [CRÍTICO] Actualizar cifras 2026: SMI, MEI, tramos IRPF, mínimo personal, cuota autónomos, DIRCE.
- Coordinar desolapamiento con EDMN: DIRCE, PESTEL, BMC, Lean Startup, fuentes financiación (5 casos).
- Reducir sobreuso Airbnb y Wallapop a UNA aparición por libro.
- Sustituir Volkswagen/H&M (greenwashing) por caso español reciente.
- Limpiar bibliografía Unit 2 (Ferran Adrià sin cita en cuerpo).

### Fase 2 (eje B — profundización pedagógica)
- Mini-glosario 8-12 términos por unit (especialmente Units 7 y 8, densas técnicamente).
- "Para profundizar": lecturas opcionales por unit (Ferràs para Unit 1, Dweck paper para Unit 2, La Fageda Harvard Business School para Unit 3, etc.).
- SolvedExercise nuevo Unit 2 (SCAMPER aplicado).
- SolvedExercise nuevo Unit 6 (sprint de 2 semanas con plantilla).
- Preguntas de reflexión final por unit.
- Reading time visible por unit.

### Fase 3 (eje C — visualidad)
- 6 diagramas SVG nuevos (ver lista arriba).
- Sustitución de 5 imágenes débiles.
- Portada PDF Eco 4ESO digna.
- Plantilla descargable "diario de molestias" (Unit 4).

### Fase 4 (eje D — interactividad)
- Calculadora NominaESO real (Unit 8) con cifras 2026.
- Calculadora Presupuesto503020 interactiva con persistencia (Unit 7).
- Calculadora drip pricing Ryanair simulator (Unit 5, nueva).
- Calculadora IRPF declaración real con tramos 2026 (nueva, complementaria a la simulación 9% estática).
- Persistencia tests + scores localStorage transversal.

---

*Diagnóstico cerrado 2026-05-18. No commit hasta consolidar con los diagnósticos de EDMN, Eco 1BACH y FOPP en `docs/diagnostico-libros-2026.md`.*
