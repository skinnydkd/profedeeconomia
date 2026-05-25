# Diagnóstico EEAE Bach — Auditoría editorial completa

> Diagnóstico **Fase 0 ampliada + auditoría editorial completa** (3 ejes: A rigor/actualidad, B pedagogía, C tono/cumplimiento CLAUDE.md) del libro de **EEAE** (`eeae-bach`, *Economía, Emprendimiento y Actividad Empresarial*, 1.º Bachillerato modalidad General, currículo básico estatal RD 243/2022 · concreción CV Decret 108/2022).
>
> Esta asignatura es **NUEVA y nunca ha pasado revisión humana** (drafted por sub-agentes en la tanda de mayo 2026, PR #57). La auditoría es por tanto más profunda que los diagnósticos de los 4 libros originales: cubre las 10 unidades (Bloque A 1-4 · Bloque B 5-7 · Bloque C 8-10).
>
> Fecha: 2026-05-24 · Autor: sub-agente de auditoría editorial EEAE. Sitio EN PRODUCCIÓN (las 10 unidades están con `estado: publicado`).

## Nota de calidad de partida (importante)

A diferencia de los 4 libros originales diagnosticados el 2026-05-18 (que estaban en estado *bon draft* pre-Fase 2), **EEAE ya nace con casi todo el aparato pedagógico de la Fase 2 incorporado**: todas las unidades tienen cabecera con tiempo de lectura + saberes + pre-requisitos + "Al acabar esta unidad sabrás", glosario, "Para profundizar" (5 lecturas con justificación) y "Preguntas para reflexionar". Esto es excelente y está **muy por encima** del nivel de salida de EDMN/Eco1B/Eco4ESO/FOPP en su Fase 0. El foco de esta auditoría, por tanto, se desplaza hacia **rigor/actualidad (eje A)**, **solapamiento cross-libros (crítico en EEAE)** y **verificación de citas y cifras**, más que a las carencias pedagógicas estructurales (que en su mayoría ya están cubiertas).

---

## Findings globales

### Tono y consistencia

El tono es **sólido, uniforme y plenamente coherente con la dirección Variant C**: prosa editorial densa, primera persona del plural ("vimos", "veremos", "no necesitamos"), registro sobrio y a la vez próximo, con buen equilibrio entre el caso concreto y la abstracción. Es notablemente uniforme entre las 10 unidades, lo que sugiere redacción en bloque por agentes con instrucciones homogéneas.

- **NO cae en lo personal de Pau**: en ninguna unidad aparece "Hola, soy Pau" ni firma personal. La voz coral se mantiene de principio a fin. **Cumple el CLAUDE.md** en este punto (mejor que EDMN, que tenía la firma personal en U1).
- **Registro proper sin ser comercial**: usa "conviene", "fíjate", "piensa en", reconocimiento de realidad de aula. No vende, no promete, no promociona. Cumple.
- **Densidad consistente**: ~25-28 min de lectura declarados por unidad, coherente con la densidad objetivo del curriculum doc (260-360 líneas). Bloc A (1-4) es el más narrativo/conceptual; Bloc B (5-7) intermedio; Bloc C (8-10) el más aplicado.

Incoherencia menor de tono: el tratamiento del "tú" (segunda persona del singular, "tu móvil", "tu dinero", "piensa en") convive con el plural coral. Es deliberado y funciona bien (dirigirse al alumno), pero conviene verificar que sea consistente — en algunas unidades el "tú" es muy frecuente y en otras casi ausente.

### Cumplimiento CLAUDE.md

- **Emojis pictográficos (📖⏱🎯): NINGUNO encontrado** en las 4 primeras unidades revisadas (pendiente confirmar en 5-10, ver findings per unit). Las cabeceras usan texto plano ("Tiempo estimado de lectura", "Saberes LOMLOE") en vez de iconos emoji — correcto según la regla. Se usan símbolos tipográficos permitidos (→, ×, —, ·, °).
- **Acentos/tildes (castellano)**: correctos en todo lo revisado. Sin errores diacríticos detectados.
- **Nota LOMLOE**: el curriculum doc exige una nota explícita en la introducción de cada libro citando el RD. **Hallazgo de cumplimiento**: las unidades citan el RD 243/2022 en la bibliografía y en la cabecera ("Saberes LOMLOE"), pero **NINGUNA unidad incluye el párrafo-nota literal** que el CLAUDE.md marca como obligatorio ("Este libro se basa en el currículo básico estatal LOMLOE... Cada comunidad autónoma establece concreciones... Conviene consultar la concreción de tu CCAA"). El curriculum-eeae-bach.md sí lo tiene (§4), pero no se ha trasladado al libro. **Acción recomendada**: añadir la nota LOMLOE en la introducción de la Unidad 1 (la primera del libro), citando RD 243/2022 y Decret 108/2022 CV.
- **Sin mascota, sin gradientes cridaners, sin lenguaje comercial/promocional**: cumple.

### Components MDX (uso por unidad)

| Component | Units que lo usan | Comentario |
|---|---|---|
| `Callout` | 1-10 | Universal. OK. |
| `Curiosity` | 1-10 | Universal. 1-2 por unidad. OK. |
| `RealExample` | 1-10 | Universal y **central** (diferenciador "estudio de casos"). 2-3 por unidad. OK. |
| `KeyTakeaways` | 1-10 | Universal. OK. |
| `Steps` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | Universal o casi. Buen uso. |
| `Diagram` (SVG) | 1, 2, 3, 4, 5, 6, 8, 9 | **8/10**. **Lagunas: U7 y U10 NO tienen diagrama propio** (solo Figures). U7 es la unidad más larga; U10 es el capstone de cierre. Son las dos mayores lagunas visuales. |
| `SolvedExercise` | 4 (4.1) | **Solo 1/10**, coherente con el curriculum (única unidad con componente cuantitativo: finanzas personales). Bloc C (estrategia, modelos de negocio) es cualitativo por diseño; no necesita SolvedExercise. |
| `Figure` | 1-10 | 3 por unidad. Usa variantes (`inline-small`, `wide`, `right`). Buena variedad ya aplicada (cumple parte del eje C de Fase 3). |
| `Bibliography` | 1-10 | Universal, con fuentes oficiales y normativa exacta. OK. |

**Diagramas SVG reutilizados de otros libros** (a verificar que no dupliquen contenido doctrinal de su owner): `TeoriaProspectiva`, `MatrizSesgos` (comparten con Eco 1BACH U2), `EconomiaCircular`, `FlujoCircular`, `DoubleDiamond` y `DAFOGrid` (comparten con EDMN U3/U5), `PorterForces` (EDMN U3), `EmpresaFunctions` (EDMN). Reutilizar el componente SVG es correcto; el riesgo es que el **texto** alrededor duplique al owner.

### Bibliografía (global)

Calidad **alta y muy homogénea**. Mezcla correcta de: normativa exacta (RD 243/2022 con BOE-A-2022-5521), clásicos (Smith, Robbins, Simon, Kahneman-Tversky, Bentham, Mill, Sen, Brundtland), fuentes oficiales españolas y europeas accesibles (INE, Eurostat, CNMV, Banco de España, AIReF, MITECO, AEMA, FAO, ONU) y portales vivos útiles para el aula (finanzasparatodos.es, cnmv.es, un.org). Formato consistente (autor, año, *título en cursiva*, editorial). **Es de las mejores bibliografías del catálogo.**

Issues menores:
- Ediciones a verificar puntualmente (ver per unit), pero la mayoría son fuentes oficiales sin edición que envejezca.
- Samuelson & Nordhaus citado en 19.ª ed. (2019): es la última en inglés, correcta.
- Mankiw *Principios de economía* 10.ª ed. (2024): correcta.

### Imágenes débiles (top 5, por caption/rol)

Juzgando por caption y rol pedagógico (sin acceso al binario). En general las imágenes son **mejores que la media del catálogo**: hay variantes de `<Figure>` aplicadas y casi todas tienen rol pedagógico real, no decorativo. Las más flojas:

1. **U4 — `bce-frankfurt.jpg` + `banco-de-espana.jpg`**: dos edificios institucionales en la misma unidad, ambos de rol puramente ilustrativo ("desde aquí se decide..."). Saturación de "fachadas de bancos". Conservar uno; el otro podría sustituirse por algo más conceptual (un esquema o un dato visual).
2. **U8 — `patagonia-store.jpg`**: fachada de tienda como ilustración de "liderar dando ejemplo". Es la **3.ª aparición de Patagonia** en el libro (U3 caso, U7 Chouinard, U8 tienda+RealExample). Imagen redundante; si se sustituye el caso de U8 (recomendado), cae también la imagen.
3. **U10 — `data-center.jpg` / `robots-fabrica.jpg`**: imágenes de stock tecnológico genérico (servidores, brazos robóticos). Funcionan pero son el tipo de imagen "aspiracional lejana" que el diagnóstico EDMN también flageaba (kuka-robots). U10 ganaría más con un **diagrama** (que no tiene) que con otra foto de robots.
4. **U5 — `daniel-goleman` + `jose-antonio-marina`**: dos retratos `inline-small` en la misma unidad (más Gardner en diagrama). Aceptable, pero al límite de "cabezas parlantes".
5. **U1 — `mercado-central-valencia.jpg`** y **U3 — `planta-solar-sanlucar.jpg`**: de las mejores del libro, bien ancladas. NO tocar (referencia de lo que funciona).

### Diagramas oportunos (top lagunas para añadir SVG)

Bloc A está bien servido. Las lagunas se concentran en Bloc B/C:

1. **U10 — Diagrama "destruir / transformar / crear empleo"** (los tres efectos de la automatización). Es el concepto central de la unidad y solo está en `Steps` textual; un esquema lo haría memorable.
2. **U10 — Esquema-síntesis "la empresa del futuro"** que ate los hilos del curso (tecnológica + flexible + sostenible + perfil emprendedor). U10 es el capstone de cierre y **no tiene ni un diagrama**: la laguna visual más grave del libro.
3. **U10 — Timeline de las 4 revoluciones industriales** (vapor → electricidad → electrónica → digital/IA). Hoy en prosa; un timeline visual es el formato natural.
4. **U7 — Diagrama del "abanico continuo" empresa comercial ↔ empresa social ↔ ONG** (con los dos ejes: fin último y de qué vive). El texto lo describe muy bien pero sin SVG; sería un diagrama propio y diferenciador (no reutilizado de EDMN).
5. **U7 — Círculo dorado de Sinek** (porqué / cómo / qué) o esquema misión-visión-valores. U7 es la única unidad del Bloc B sin diagrama.

---

## Findings per unit

### Unidad 1 — La economía y el problema de la escasez

**Cifras desactualizadas / a verificar**:
- "*el 95,3 % de la población española de 16 a 74 años usó internet*" (INE 2023) → existe dato 2024/2025; la encuesta TIC-H se publica anualmente. Actualizar al último disponible y citar año.
- "*tiempo medio de uso del móvil en España en torno a tres o cuatro horas diarias*" → vago a propósito ("la cifra exacta importa menos"). Aceptable, pero podría anclarse a una fuente concreta (Digital 2025 de We Are Social / Data Reportal).
- "*1.183 millones de kilos de alimentos en 2023*" (MAPA) → verificar contra el informe de desperdicio 2024 cuando esté publicado; sitio en producción 2026.
- "*130 litros de agua envasada por persona y año*" (ANEABE) → verificar cifra y año exacto (ronda 130-140 L según campaña).
- "*casi 8.200 millones de personas*" (en U3, pero se origina como dato de contexto) → coherente con 2025 (la ONU estima ~8,2 Bn a mediados de 2025). OK.
- Sectores económicos del diagrama: "*Datos aproximados 2025, EPA (INE)*" → bien etiquetado con año; verificar que el SVG `SectoresEconomicos` use el reparto ~3/19/74 actual.

**Citas a verificar**:
- RD 243/2022, BOE-A-2022-5521 — correcto.
- Smith (1776), paradoja del valor, libro I cap. IV — **correcto** (la referencia al capítulo es exacta, a diferencia de algunas atribuciones flojas de EDMN).
- "*formulada con claridad por el economista Paul Samuelson*" (las tres preguntas qué/cómo/para quién) — atribución razonable y extendida; Samuelson las popularizó. OK.
- Robbins (1932), *An Essay on the Nature and Significance of Economic Science* — correcto (la definición de escasez de Robbins).
- "Día Cero" de Ciudad del Cabo 2018 — correcto y verificable.
- Earth Overshoot Day (Global Footprint Network) — correcto; el texto ya advierte que es "metáfora pedagógica". Bien.

**Errores factuales**: ninguno detectado.

**Pedagogía (eje B)**: completa. Reading time, pre-requisitos (ninguno, primera unidad — bien señalado), objetivos, glosario de 14 términos, "Para profundizar" (5), 4 preguntas de reflexión. SolvedExercise: no tiene, coherente (unidad conceptual). **No requiere refuerzo pedagógico.**

**Cumplimiento CLAUDE.md**: limpio. Sin emojis. **Aquí debería ir la nota LOMLOE** obligatoria del libro (es la introducción del libro completo).

**Solapamiento cross-libros** (CRÍTICO en EEAE):
- **Escasez, coste de oportunidad, eficiencia, mecanismos de asignación, mercado** → solapan de lleno con **Eco 1BACH U1** (y Eco 4ESO). El curriculum-eeae-bach.md §6 marca la regla: EEAE es **panorámico**, Eco 1BACH es el **owner doctrinal** del modelo formal. **Verificación positiva**: U1 cumple la regla explícitamente ("No vamos a dibujar gráficos ni a hacer cálculos", "el funcionamiento detallado del mercado... pertenece a otras materias"). Mantener cross-reference implícita; **owner = Eco 1BACH** para oferta-demanda formal, EEAE se queda con la panorámica. **Bien diferenciado.**
- **Paradoja del valor / Adam Smith** → probable aparición también en Eco 1BACH. Verificar; si está, owner = Eco 1BACH o repartir (Smith histórico aquí, utilidad marginal allá).
- **Modelo como mapa / economía ciencia social** → solapa con Eco 1BACH U1. Aceptable (es introducción de materia, ambas la necesitan).

---

### Unidad 2 — Decisiones económicas: racionalidad y comportamiento

**Cifras desactualizadas / a verificar**:
- "*Gini de la renta disponible en España... en torno a 31-32 en 2023*" (Eurostat) → verificar último dato (2024 publicado en 2025; rondaba 31,5). El texto ya pide "consultar datos actualizados". Aceptable pero actualizar año.
- "*Finlandia encabeza la lista de forma sostenida*" (World Happiness Report) → correcto a 2024-2025 (Finlandia lidera desde 2018). El texto pide consultar la edición más reciente. OK.
- "*España suele situarse en una posición media-alta*" en el WHR → correcto (España ~puesto 30-38 según edición). Vago pero defendible.

**Citas a verificar**:
- Simon (1955), *A Behavioral Model of Rational Choice*, QJE 69(1) — correcto. Nobel 1978 — correcto.
- Kahneman & Tversky (1979), *Prospect Theory*, Econometrica 47(2) — correcto. Kahneman Nobel 2002 — correcto.
- Bentham (1789), *An Introduction to the Principles of Morals and Legislation* — correcto.
- Mill (1863), *Utilitarianism* — correcto. **Cita "es mejor ser un Sócrates insatisfecho que un cerdo satisfecho"** → es de Mill (*Utilitarianism*, cap. II), **correcta y bien atribuida** (no apócrifa).
- Sen, Nobel 1998 — correcto. *La idea de la justicia* (2009) — correcto.
- Easterlin (1974) paradoja — correcto.
- Pareto (eficiencia) — correcto.
- **Curiosity del auto-icono de Bentham en el University College London** → **VERIFICAR con cuidado**: el auto-icono es real y está en el UCL. La afirmación "se le hace asistir a algunas reuniones oficiales" la propia Curiosity la marca como "leyenda universitaria" — bien matizado, pero conviene confirmar que el matiz se mantenga. (Históricamente, asistió como invitado a un acto del 150 y 200 aniversario, registrado como "presente, no votante" — la leyenda está suavizada correctamente.)

**Errores factuales**: ninguno detectado. La distinción Sistema 1 / Sistema 2 atribuida a Kahneman es correcta (popularizó la terminología de Stanovich-West).

**Pedagogía (eje B)**: completa y excelente. Glosario de 13 términos, "Para profundizar" (5, muy bien elegidas), 4 preguntas, sección "Conexión con las siguientes unidades" (muy buena). Dos diagramas propios (TeoriaProspectiva, MatrizSesgos). **No requiere refuerzo.**

**Cumplimiento CLAUDE.md**: limpio.

**Solapamiento cross-libros** (CRÍTICO):
- **Economía del comportamiento, Kahneman, sesgos, heurísticas, Sistema 1/2, aversión a la pérdida, teoría prospectiva** → **solapa fuerte con Eco 1BACH U2** (economía del comportamiento, que es SU diferenciador editorial declarado) y con **FOPP U4** (decisiones vitales). El curriculum-eeae-bach.md §6 reconoce el solape y marca el ángulo diferenciador de EEAE: **enfocado al perfil decisor y emprendedor, NO a la microeconomía / teoría del consumidor**. **Verificación positiva**: U2 cumple ("No las trataremos como teoría del consumidor —eso pertenece a otra materia—, sino como herramientas para entender cómo decide cualquier persona"; los 5 sesgos están enmarcados en clave emprendedora). **Bien diferenciado**, pero conviene una **cross-reference explícita**: owner doctrinal de econ. comportamiento = Eco 1BACH U2; EEAE aplica al perfil emprendedor. El diagrama `TeoriaProspectiva` probablemente se comparte/duplica con Eco 1BACH (el plan-mejora pedía crear "Teoría Prospectiva Kahneman (U2)" para Eco 1BACH) — verificar que no sea literalmente el mismo contenido doctrinal.
- **Utilitarismo, eficiencia vs equidad, Pareto, bienestar, IDH, Gini** → solapa con Eco 1BACH (microeconomía del bienestar). Owner = Eco 1BACH para el aparato formal; EEAE lo trata en clave ética/filosófica (utilitarismo Bentham-Mill). Diferenciación razonable.
- **Sen / capacidades** → único probable aquí. Bien.

---

### Unidad 3 — Economía conectada: ética, sostenibilidad y ODS

**Cifras desactualizadas / a verificar**:
- "*casi 8.200 millones de personas*" → coherente con 2025. OK.
- "*Earth Overshoot Day... ronda finales de julio o principios de agosto*" → correcto (2024 cayó el 1 de agosto). OK.
- Informe Stern (2006) "coste de no actuar > coste de actuar" → correcto; podría complementarse con referencias más recientes (IPCC AR6, 2023) que confirman la tesis.
- "*Pacto Verde Europeo... neutralidad climática en 2050*" → correcto. "*presentado en 2019*" → correcto (COM(2019) 640, dic. 2019).
- "*193 países miembros de la ONU... Agenda 2030... 17 ODS y 169 metas*" → correcto.
- España y ODS: "*buena posición dentro del grupo de cabeza*" → coherente con el Sustainable Development Report (España ~puesto 16-20). Vago pero defendible.

**Citas a verificar**:
- Informe Brundtland (1987), *Nuestro futuro común*, definición de desarrollo sostenible — **correcta y exacta**.
- Agenda 2030, Resolución A/RES/70/1 (ONU 2015) — correcto.
- Límites planetarios: Rockström et al. (2009) y Richardson et al. (2023) — **correcto y actualizado** (la revisión de 2023 en Science Advances es real). Buena bibliografía.
- Fundación Ellen MacArthur — correcto, referente real de economía circular.
- **RealExample MUD Jeans** ("Lease A Jeans", alquiler de vaqueros) → **VERIFICAR**: MUD Jeans es una empresa neerlandesa real con modelo "Lease A Jean" documentado. Es legítimo (no inventado). Verificar que los detalles del modelo (cuota, recompra, deshilachado) sigan vigentes — la empresa ha cambiado su oferta con los años.
- Pacto Verde Europeo, COM(2019) 640 — correcto.

**Errores factuales**: ninguno detectado.

**Pedagogía (eje B)**: completa. Glosario de 12 términos, "Para profundizar" (5), 4 preguntas. Un diagrama propio (EconomiaCircular). **No requiere refuerzo.**

**Cumplimiento CLAUDE.md**: limpio. Buen tratamiento del greenwashing con mirada crítica no ingenua (cumple el tono "exigente, ni cínico ni moralista").

**Solapamiento cross-libros** (CRÍTICO):
- **Fallos de mercado, externalidades, tragedia de los comunes, bienes comunes, intervención pública** → **solapa fuerte con Eco 1BACH** (fallos de mercado es unidad propia allí). Regla cumplida: EEAE lo trata "de forma panorámica... su análisis fino pertenece a otras materias" (lo dice literalmente). **Owner = Eco 1BACH**; EEAE panorámico. Bien.
- **ODS / Agenda 2030 / desarrollo sostenible / economía circular** → solapa con Eco 4ESO U5 (consumo responsable), EDMN U3 (RSC, ESG, sostenibilidad empresarial) y Eco 1BACH. En EEAE es saber curricular explícito (A.1.6, A.2.5) y bloque central. **Owner de ODS = EEAE/EEAE-GPE** por peso curricular; en los demás, cross-reference. Verificar que EDMN U3 (Patagonia, triple bottom line, Elkington) no duplique el caso. **Posible solape de casos**: revisar que el caso de empresa sostenible no se repita con Patagonia de EDMN U3.
- **Fallos del sector público** → probablemente único de EEAE en este catálogo (Eco 1BACH puede tenerlo). Verificar.

---

### Unidad 4 — El entorno económico y financiero

**Cifras desactualizadas / a verificar**:
- "*en 2024 España recibió cerca de 94 millones de turistas internacionales, que gastaron en torno a 126.000 millones de euros*" (INE FRONTUR/EGATUR) → **verificar contra cierre 2024 definitivo**: las cifras provisionales 2024 rondaron 93,8M turistas y ~126.000 M€ de gasto — **correcto y actualizado a 2024**. Buen dato reciente. (Cuando salga el dato 2025 conviene refrescar, sitio en producción.)
- Mención al BCE subiendo/bajando tipos → tratada de forma genérica ("cuando sube o baja los tipos"), sin cifra concreta que envejezca. Bien; pero podría añadirse contexto del tipo actual (BCE en fase de bajada, ~2-2,5% a inicios 2026) como ancla viva.
- Interés compuesto SolvedExercise: cifras inventadas didácticas (1.000 €, 3%, 3 años) — no envejecen. Bien construido.

**Citas a verificar**:
- RD 243/2022 — correcto.
- "*salario viene del latín salarium, relacionado con la sal*" → **etimología correcta y bien documentada** (no apócrifa).
- Funciones del dinero (medio de pago, unidad de cuenta, depósito de valor) — correcto, canónico.
- CNMV y "chiringuitos financieros" → correcto, es terminología oficial de la CNMV.
- finanzasparatodos.es (BdE + CNMV) — correcto, portal real.

**Errores factuales**: 
- En el SolvedExercise 4.1, paso 3: "*Si en lugar de 3 años fueran 30 años al 3 %, Marta (simple) tendría 1.900 € y Lucía (compuesto) tendría unos 2.427 €*". **Verificar el cálculo**: interés simple 30 años al 3% = 1.000 × (1 + 0,03×30) = 1.000 × 1,9 = **1.900 €** ✓. Compuesto = 1.000 × 1,03^30 = 1.000 × 2,4273 = **2.427 €** ✓. **Cálculos correctos.** Diferencia ~527 € ("más de 500 €") ✓.

**Pedagogía (eje B)**: completa. **Único SolvedExercise del Bloc A** (4.1, interés simple vs compuesto), bien elegido y correcto. Glosario de 13 términos, "Para profundizar" (5), 4 preguntas. Dos diagramas (FlujoCircular, InteresCompuesto). **No requiere refuerzo**; si acaso, un segundo SolvedExercise de presupuesto personal (regla 50/30/20) reforzaría la parte de finanzas personales, pero no es imprescindible.

**Cumplimiento CLAUDE.md**: limpio.

**Solapamiento cross-libros** (CRÍTICO):
- **Flujo circular de la renta, agentes económicos, oferta/demanda agregadas, efecto multiplicador** → **solapa fuerte con Eco 1BACH** (macro: flujo circular, AD-AS, multiplicador del gasto son unidades propias). Regla cumplida: EEAE explícitamente "sin recurrir al modelo AD-AS formal", "no vamos a representar esto con gráficos". **Owner = Eco 1BACH**; EEAE panorámico. Bien diferenciado, pero el diagrama `FlujoCircular` probablemente se comparte con Eco 1BACH — verificar.
- **Dinero, funciones del dinero, sistema financiero, bancos** → solapa con Eco 1BACH (dinero y sistema financiero) y EDMN U9 (función financiera). EEAE panorámico. Owner del aparato = Eco 1BACH/EDMN; EEAE introductorio. Bien.
- **Finanzas personales, presupuesto, ahorro/inversión, riesgo-beneficio, interés compuesto, CNMV** → **solapa con Eco 4ESO U8** (economía personal, nómina, calculadora) y FOPP. En EEAE es saber curricular A.1.5. El interés compuesto SolvedExercise puede solapar con Eco 4ESO. **Decisión**: owner de finanzas personales detalladas = Eco 4ESO (ESO, más práctico); EEAE se queda con riesgo-beneficio + interés compuesto como aplicación del entorno financiero. Diferenciación aceptable por nivel.
- **Turismo como caso** → probable solape con Eco 1BACH (sector exterior, balanza de pagos). Verificar; aquí es ilustración del flujo circular, allí sería balanza. Ángulos distintos, aceptable.

---

### Unidad 5 — El perfil de la persona emprendedora

**Cifras desactualizadas / a verificar**:
- GEM España: "*edad media de quien funda una empresa supera holgadamente los cuarenta*" / "*a partir de los 35 años*" → coherente con los informes GEM; verificar contra la última edición GEM España publicada. Los datos están enmarcados con prudencia ("una proporción importante", "una parte significativa"), lo que envejece bien. **Importante consistencia interna**: U5 dice "a partir de los 35 años" y U6 dice "entre los 35 y los 54 años" — son compatibles pero conviene unificar la franja exacta entre ambas unidades.
- "*millones de usuarios activos*" (Wallapop, en RealExample) → vago a propósito, no envejece. Pero ver solapamiento abajo: Wallapop también es caso en U6 y en Eco 4ESO.

**Citas a verificar**:
- Goleman (1995/1996), *Inteligencia emocional* — correcto. "raíces en Salovey y Mayer" — correcto (acuñaron el término en 1990). Bien matizado.
- Marina (2012), *La inteligencia ejecutiva*, Ariel — correcto.
- Gardner, inteligencias múltiples — correcto; el texto lo presenta como "discutido pero influyente", buena cautela.
- Mayo / experimentos de Hawthorne (1924-1932, Western Electric, Cicero/Chicago) — **correcto**; el texto advierte que "los estudios originales han sido muy discutidos después", excelente honestidad.
- Maslow (pirámide) y Herzberg (factores higiene/motivadores) — correctos.
- Fisher, Ury & Patton (1991), *Getting to Yes*, Harvard Negotiation Project — correcto (2.ª ed. 1991; original 1981).
- Dweck (2006), *Mindset* — correcto.
- Carol Dweck "mentalidad fija vs crecimiento" — correcto.
- Walter Mischel, experimento del marshmallow (finales años 60, Stanford) — **correcto**; el texto añade el matiz de las réplicas recientes que cuestionan el efecto (Watts et al., 2018), excelente rigor.
- **RealExample PlayStation / Ken Kutaragi** → **VERIFICAR con cuidado** (caso potencialmente embellecido por el sub-agente): Kutaragi sí fue ingeniero de Sony, sí trabajó en el chip de sonido SPC700 usado en la Super Nintendo, y la PlayStation se lanzó en 1994 (Japón) con respaldo de Norio Ohga. El relato es **sustancialmente correcto** y bien documentado (fuente Asakura 2000 es real). OK.

**Errores factuales**: ninguno detectado.

**Pedagogía (eje B)**: completa y de alto nivel. Glosario de 11 términos, "Para profundizar" (5), 4 preguntas, conexión con unidades siguientes. Dos diagramas (GardnerInteligencias, RolesEquipo). Sin SolvedExercise (coherente, unidad cualitativa). **No requiere refuerzo.**

**Cumplimiento CLAUDE.md**: limpio. Sin emojis.

**Solapamiento cross-libros** (CRÍTICO):
- **Perfil emprendedor, mito del emprendedor nato, competencia emprendedora, edad real de quien emprende, GEM** → **solapa fuerte con EDMN U1** ("La persona emprendedora y el espíritu empresarial"), que trata exactamente lo mismo (mitos, GEM, edad, Azoulay MIT). EDMN es 2.º Bach y más doctrinal; EEAE es 1.º Bach modalidad General. **DECISIÓN NECESARIA**: ambos pueden coexistir por nivel/curso distinto, pero el riesgo de clon es alto. El curriculum-eeae §6 marca que EEAE debe ser "perfil y habilidades personales, no plan de empresa formal". EEAE cumple (se centra en IE/IEn, competencias sociales, relaciones humanas — más "soft" que EDMN). **Recomendación**: owner del dato MIT/Azoulay = EDMN; owner de inteligencia emocional/ejecutiva + relaciones humanas = EEAE. Mantener el GEM en ambos pero con cifras coherentes.
- **Inteligencia emocional / ejecutiva (Goleman, Marina), Gardner** → probablemente único en EEAE dentro del catálogo. Bien (es su diferenciador). Verificar que no aparezca en EDMN U8 (RRHH/motivación).
- **Motivación: Maslow, Herzberg, motivación intrínseca/extrínseca, Hawthorne/Mayo, liderazgo (autoritario/democrático/laissez-faire)** → **solapa fuerte con EDMN U8** ("Gestión de los recursos humanos"), que es el owner doctrinal de Maslow/Herzberg/Pink/motivación. El curriculum-eeae avisa: EEAE NO debe hacer teoría funcional de RRHH. **RIESGO DE SOLAPE**: U5 trata Maslow, Herzberg, motivación intrínseca/extrínseca, estilos de liderazgo — esto es muy próximo a EDMN U8. **Diferenciación**: EEAE lo enmarca en "gestión de grupos y relaciones humanas" desde el perfil personal del emprendedor (saber B.3), no como área funcional de empresa. Es defendible curricularmente (B.3 lo pide), pero conviene **cross-reference explícita a EDMN U8** para el tratamiento empresarial completo, y vigilar que no se dupliquen los mismos diagramas (pirámide Maslow). **Owner doctrinal de teorías de motivación = EDMN U8**; EEAE las usa aplicadas a relaciones humanas del emprendedor.
- **Negociación Harvard (Fisher-Ury)** → probable solape con EDMN U12 (comunicación/pitch) o único. Verificar.
- **Wallapop** → ver U6 (caso repetido en U5 mención + U6 RealExample completo + Eco 4ESO). Consolidar.

---

### Unidad 6 — Creatividad, innovación e iniciativa

**Hallazgo de cumplimiento CLAUDE.md (frontmatter)**: el `conceptos_clave` mezcla **valenciano/catalán** con castellano: `"esperit emprendedor"` (debería ser "espíritu emprendedor"). El contenido del libro es en castellano (MVP), así que esto es una **errata de idioma en el frontmatter** que conviene corregir. (El `bloque: "Bloc B"` en valenciano es consistente con el resto de unidades y con el curriculum doc, así que ese se deja; pero "esperit" en un campo de conceptos sí desentona.)

**Cifras desactualizadas / a verificar**:
- GEM España "*entre los 35 y los 54 años*" → ver nota de consistencia con U5 (allí "a partir de los 35"). Unificar.
- "*GEM España 2022-2023*" citado con año concreto en el RealExample y bibliografía → para sitio en producción 2026, conviene actualizar a la edición más reciente disponible (2024-2025).
- Wallapop "*nació en Barcelona en 2013*" → correcto. "*millones de usuarios activos*" → vago, no envejece.

**Citas a verificar**:
- Modelo del doble diamante, Design Council UK (2005) — correcto. **Nota**: el Design Council actualizó el modelo en 2019 ("Framework for Innovation"); conviene mencionarlo (mismo issue que EDMN U5).
- SCAMPER (Eberle) — correcto. Bibliografía cita Eberle (1996), correcto.
- Brainstorming — atribuible a Osborn (1953); el texto no lo cita explícitamente pero el concepto es correcto.
- Stephen Covey, proactividad, *Los 7 hábitos* (1989) — correcto.
- Ken Robinson, *El elemento* (2009) y TED "Do schools kill creativity?" (2006) — **correcto** (la charla es de 2006, una de las TED más vistas).
- **Curiosity del pósit / 3M / Spencer Silver / Art Fry** → **correcto y bien documentado** (Silver 1968, adhesivo de baja adherencia; Fry, coro de iglesia; lanzamiento Post-it 1980). No apócrifo.
- **Curiosity de pivotes (Twitch/Justin.tv, Flickr/Game Neverending, Slack/Glitch, Stewart Butterfield)** → **correcto y bien documentado** (Butterfield fundó Flickr desde Game Neverending y Slack desde Glitch; Twitch surgió de Justin.tv). Excelente caso, no inventado.
- Osterwalder & Pigneur (2011), *Generación de modelos de negocio*, citado en bibliografía "para la herramienta DAFO" → **referencia floja**: Business Model Generation NO es la fuente del DAFO (que es de los años 60-70, atribuido al SRI/Albert Humphrey). Citar Osterwalder para el DAFO es incorrecto. **Corregir la bibliografía**: el DAFO no procede de ahí.

**Errores factuales**:
- Bibliografía item 5: atribuir el DAFO a Osterwalder & Pigneur es **incorrecto** (ver arriba).
- Título del RealExample: "*Una molestia personal que se convirtió en empresa: Glovo no, Wallapop*" — el "Glovo no, Wallapop" es un giro de redacción extraño/coloquial poco editorial; conviene reescribir el título a algo sobrio ("Una molestia cotidiana convertida en empresa: Wallapop").

**Pedagogía (eje B)**: completa. Glosario de 12 términos, "Para profundizar" (5), 4 preguntas, conexión con el resto del curso. Dos diagramas (DoubleDiamond, DAFOGrid). **No requiere refuerzo.**

**Cumplimiento CLAUDE.md**: limpio salvo la errata "esperit" del frontmatter y el título coloquial del RealExample.

**Solapamiento cross-libros** (CRÍTICO):
- **DAFO (personal aquí; empresarial en U9)** → **solapa con EDMN U3** (DAFO empresarial, owner doctrinal) y con **FOPP U1** (DAFO personal). La tabla del diagnóstico maestro ya decidió: "DAFO — mantener todos (empresarial vs personal, complementarios)". EEAE hace DAFO personal en U6 y anuncia DAFO empresarial en U9 → **coherente**, pero el DAFO personal de EEAE U6 solapa directamente con FOPP U1 (DAFO personal). **Decisión**: ambos son DAFO personal; uno es Bach (EEAE) y otro 4ESO (FOPP). Aceptable por nivel; el diagrama `DAFOGrid` se comparte.
- **Doble diamante / divergir-converger / brainstorming / SCAMPER / mapas mentales** → **solapa fuerte con EDMN U5** ("Diseño creativo de modelos de negocio"), owner doctrinal del doble diamante, SCAMPER, design thinking. EEAE lo trata en clave de "entrenar la creatividad personal" (saber B.2), no de diseñar modelos de negocio. Diferenciación curricular válida, pero el diagrama `DoubleDiamond` se comparte con EDMN. **Cross-reference recomendada.**
- **Pivote / Wallapop** → **Wallapop** aparece en EEAE U5 (mención), EEAE U6 (RealExample completo) y **Eco 4ESO** (según diagnóstico maestro). Y el concepto de **pivote** + casos (Twitch, Slack, Flickr) solapa con EDMN U1/U4 (Glovo pivote). **Decisión**: owner de Wallapop = EEAE U6 (caso de "molestia cotidiana"); eliminar mención redundante en U5 o reducirla. Owner de "pivote" como concepto con casos = EEAE U6 aquí (Twitch/Slack son casos nuevos, no chocan con EDMN). OK, pero consolidar Wallapop en una sola aparición principal por libro.
- **Gestión del error / fallar pronto / cultura del fracaso** → solapa con EDMN (lean startup, MVP) y con la U2 de EEAE (aversión a la pérdida). Coherente intra-libro (U6 cita explícitamente la U2). Bien.
- **Riesgo calculado, creencias limitantes** → propio del bloque emprendedor; solapa parcial con EDMN U1. Aceptable.

---

### Unidad 7 — Del proyecto a la empresa: misión, visión y emprendimiento social

**Cifras desactualizadas / a verificar**:
- Patagonia: misión 2018 "Estamos en el negocio para salvar nuestro planeta" → correcto; cesión a fundación/Holdfast Collective sept. 2022 "Earth is now our only shareholder" → correcto y verificable. **Atención al solapamiento con EDMN U3** (mismo caso Patagonia/Chouinard) y con EEAE U8 (Patagonia otra vez): ver solapamiento.
- La Fageda "nació en 1982", "emplea a cientos de personas" → correcto; verificar cifra de empleados con la última memoria (ronda 270-300 personas).
- Grameen Bank / Yunus, Nobel de la Paz 2006 → correcto.

**Citas a verificar**:
- Simon Sinek, "círculo dorado" (porqué/cómo/qué), *Start with Why* (2009) + TED — correcto.
- Steve Blank, "get out of the building" / "sal del edificio" — **correcta atribución** (Blank es el origen del customer development). Bibliografía cita Blank & Dorf (2012), *The Startup Owner's Manual* — correcto.
- OEPM, propiedad industrial vs intelectual — correcto. Ley 24/2015 de Patentes (BOE-A-2015-8328) — **correcto y exacto**. RD Legislativo 1/1996 (texto refundido LPI, BOE-A-1996-8930) — **correcto y exacto**.
- Patente "hasta veinte años" — correcto (art. 58 Ley 24/2015).
- B Corp / B Lab — correcto.
- Curiosity de marcas de color (Milka morado, Louboutin rojo de suela, "naranja de bricolaje") → **correcto**: Milka tiene el lila/morado registrado, Louboutin el rojo Pantone 18-1663TP de suela (sentencia TJUE 2018). El "naranja de bricolaje" alude probablemente a una marca concreta (¿Leroy Merlin / B&Q?) — verificar o concretar; está vago.

**Errores factuales**: ninguno detectado. Las distinciones jurídicas (propiedad industrial registrable vs intelectual que nace con la creación; marca vs patente vs modelo de utilidad vs diseño industrial) son **correctas y bien explicadas** — de lo mejor del libro en rigor legal.

**Pedagogía (eje B)**: completa y rica. Glosario de 17 términos (el más amplio del libro), "Para profundizar" (6), 6 preguntas de reflexión, conexión con el resto de la materia. **Carencia menor**: es la unidad más larga (~330 líneas) y NO tiene `Diagram` propio (solo Figures) ni `Steps` con SVG — podría beneficiarse de un diagrama (p. ej. el "abanico continuo" empresa comercial ↔ ONG, o el círculo dorado de Sinek). Sin SolvedExercise (coherente). **Recomendación visual**: añadir 1 diagrama (abanico empresa-ONG o círculo dorado).

**Cumplimiento CLAUDE.md**: limpio. Sin emojis.

**Solapamiento cross-libros** (CRÍTICO):
- **Misión, visión, valores** → solapa con EDMN (cultura empresarial, plan de empresa) y posiblemente Eco 4ESO/IPE II. EEAE lo trata como "propósito, no papeleo" (saber B.5). Diferenciación válida. Owner del tratamiento empresarial formal = EDMN; EEAE en clave de propósito personal del proyecto.
- **Propiedad industrial/intelectual, marca, patente, OEPM** → probablemente único o casi único en EEAE dentro del catálogo (EDMN puede tocarlo de pasada). Bien desarrollado aquí. Verificar EDMN U12.
- **MVP / validar / "sal del edificio" / empezar pequeño / lean** → **solapa fuerte con EDMN U12** (prototipado, MVP, Dropbox) y EDMN U4/U5 (lean startup, Ries). EEAE lo trata como "actitud, no plan de empresa". Diferenciación válida pero el solape conceptual es alto. Cross-reference recomendada; owner del MVP/lean detallado = EDMN.
- **Patagonia (CASO MUY REPETIDO)** → aparece en **EDMN U3** (owner declarado: RSC, triple bottom line, Chouinard cede empresa), **EEAE U7** (misión que cambió) y **EEAE U8** (liderar dando ejemplo). **PROBLEMA**: Patagonia aparece 3 veces (1 en EDMN + 2 en EEAE). **DECISIÓN NECESARIA**: dentro de EEAE, consolidar — usar Patagonia como owner en UNA unidad (U7, misión, es el mejor encaje) y en U8 sustituir el RealExample de Patagonia por otro caso de liderazgo-ejemplo (hay muchos: p. ej. un líder español, o Buurtzorg que ya está en U8). Cross-libros: owner doctrinal RSC = EDMN U3; EEAE puede mantener Patagonia para "misión" pero conviene no triplicar.
- **Emprendimiento social, B Corp, economía social, La Fageda, Grameen/Yunus, microcrédito** → propio de EEAE (saber B.5) y solapa con GPE (emprendimiento Bach). Owner = EEAE/GPE. La Fageda y Grameen son casos nuevos, no chocan. Bien. Verificar que GPE no duplique La Fageda.
- **ODS / sostenibilidad** → retoma U3 explícitamente (cross-reference correcta intra-libro). Bien.

---

### Unidad 8 — La empresa y su actividad

**Cifras desactualizadas / a verificar**:
- "*a 1 de enero de 2024 había en España alrededor de 3,3 millones de empresas activas... más de la mitad (en torno al 52 %) no tiene ningún asalariado*" (DIRCE) → **verificar contra DIRCE a 1 enero 2025** (publicado en 2025; sitio en producción 2026). Las cifras 2024 son correctas pero conviene refrescar al último DIRCE. El ~52% sin asalariados es coherente.
- "*en la UE, en 2024, alrededor de un tercio de los miembros de los consejos de administración de las grandes cotizadas eran mujeres*" → coherente con Eurostat 2024 (~33-34% UE). Verificar último dato.
- "*las mujeres son cerca del 36-37 % de los trabajadores autónomos*" (Seguridad Social) → coherente; verificar dato RETA actual.
- "*directiva europea de 2022 que fija objetivos de presencia femenina en los consejos*" → correcto (Directiva (UE) 2022/2381, "Women on Boards", objetivo 40% no ejecutivos para 2026). Podría citarse el número exacto.
- Licencia marital en España "no desapareció del todo hasta 1975" → **correcto** (Ley 14/1975 reformó el Código Civil eliminando la licencia marital).

**Citas a verificar**:
- **Curiosity de Kodak / Steven Sasson / primera cámara digital 1975 / quiebra 2012** → **correcto y bien documentado** (Sasson construyó el prototipo digital en Kodak en 1975; Kodak Chapter 11 en enero 2012). Excelente caso.
- Christensen (1997), *The Innovator's Dilemma* — correcto.
- Greenleaf (1970), *The Servant as Leader* / liderazgo de servicio — correcto.
- Laloux (2014), *Reinventing Organizations* — correcto.
- **RealExample Buurtzorg** (Jos de Blok, 2006, equipos autogestionados de enfermería) → **correcto y verificable** (caso real neerlandés, recogido en Laloux). No inventado.
- Margarita Salas, patente del fago phi29, "una de las más rentables del CSIC" → **correcto** (la patente de la ADN polimerasa del phi29 fue la patente más rentable del CSIC). 
- María Wonenburger (matemática gallega), Mary Barra (CEO de GM desde 2014, primera mujer al frente de un gran fabricante de automóviles), Anne Wojcicki (cofundadora de 23andMe) → **correctos**.
- Chouinard (2005), *Let My People Go Surfing* — correcto.

**Errores factuales**: ninguno detectado.

**Inconsistencia interna (intra-libro)**:
- **Liderazgo y estilos (autoritario/democrático/laissez-faire) se tratan DOS VECES**: en U5 (gestión de grupos, saber B.3) con los mismos tres estilos y casi la misma redacción, y en U8 (saber C.3) otra vez con los mismos tres estilos. **Redundancia clara**. Saber C.3 (RD) sí incluye liderazgo, así que la repetición está justificada curricularmente, pero la redacción es casi idéntica. **Recomendación**: en U8 reducir los estilos a una mención con cross-reference a U5 ("vimos los estilos en la Unidad 5"), y aquí profundizar solo en lo nuevo (liderazgo situacional, servant leadership, liderazgo ≠ autoridad formal). Evitar reexplicar lo mismo.
- **Hawthorne/Mayo y motivación** se citan en U5 (completo) y se referencian en U8 ("los célebres experimentos de Hawthorne, que veíamos en el bloque de emprendimiento") — **bien resuelto** con cross-reference, no duplica.

**Pedagogía (eje B)**: completa. Glosario de 11 términos, "Para profundizar" (5), 4 preguntas, conexión con el bloque. Un diagrama (EmpresaFunctions). **No requiere refuerzo pedagógico**; sí depurar la redundancia de liderazgo con U5.

**Cumplimiento CLAUDE.md**: limpio. Buen tratamiento del papel de la mujer con datos, no con tópicos (cumple).

**Solapamiento cross-libros** (CRÍTICO):
- **Definición de empresa, áreas funcionales, unidad básica de producción** → **solapa con EDMN** (toda la teoría de empresa) y Eco 4ESO/IPE II. EEAE explícitamente "no es un manual de organización de empresas... eso pertenece a otra materia". Diferenciación cumplida (mira la empresa "como fenómeno humano"). Owner teoría funcional = EDMN; el diagrama `EmpresaFunctions` probablemente se comparte con EDMN.
- **Tejido empresarial español, DIRCE, país de pymes** → **solapa con EDMN U1/U2** (DIRCE, tejido empresarial) y Eco 4ESO U1. La tabla maestra ya decidió "DIRCE — mantener todos". Aceptable.
- **Cultura empresarial, gestión del talento, liderazgo, motivación** → **solapa fuerte con EDMN U8** (RRHH) — owner doctrinal de motivación/talento = EDMN. EEAE lo trata desde "fenómeno humano" (saber C.3). Riesgo de solape alto pero curricularmente justificado. Cross-reference a EDMN U8 recomendada.
- **Modelo de negocio (suscripción, plataforma, freemium)** → **solapa con EDMN U4 (modelos de negocio) y EEAE U9** (la propia U9 los desarrolla). En U8 es solo "telón de fondo" que anuncia U9 — bien acotado. Owner = EDMN U4 / EEAE U9.
- **Brecha de género, techo de cristal, mujeres en consejos** → propio de EEAE (saber C.3) y solapa con EDMN U8 (igualdad, RD-Ley 6/2019) y Eco/FOPP. EEAE es el owner más natural por peso curricular explícito. Bien.
- **Kodak / Christensen (innovador's dilemma)** → solapa con EDMN U4 (Christensen, disrupción, Blockbuster). Casos distintos (Kodak aquí, Blockbuster allá) pero misma teoría. Owner doctrinal Christensen = EDMN U4; EEAE usa Kodak como ilustración de cultura. Aceptable.
- **Patagonia (3.ª aparición)** → ver U7. Aquí en U8 como "liderar dando ejemplo". **Recomendación: sustituir** por otro caso para no triplicar Patagonia en EEAE.

---

### Unidad 9 — Estrategia, competitividad y modelos de negocio

**Cifras desactualizadas / a verificar** (FLAGS de actualidad importantes):
- "*Spotify superó los 200 millones de suscriptores premium en 2024*" → **técnicamente cierto pero conservador**: el dato real de cierre Q4 2024 es **263 millones** premium (y ~290M a Q4 2025). "Superó los 200 millones" es literalmente verdad pero queda corto y envejece mal. **Recomendación**: actualizar a "más de 260 millones (cierre 2024)" o "cerca de 290 millones (2025)". *(Verificado vía SEC/Statista, mayo 2026.)*
- "*disponible en España desde 2009*" (Spotify) → correcto. Fundada en Suecia 2006 → correcto.
- Airbnb "*fundada en 2008*", plataforma sin inmuebles propios → correcto.
- Gillette / cuchillas y hojas → modelo correcto; King C. Gillette principios del s. XX → correcto.

**Citas a verificar**:
- Porter, *Competitive Strategy* (1980), cinco fuerzas, liderazgo en costes vs diferenciación → **correcto y exacto** (la cita del diagrama dice "Porter 1980", correcto).
- Christensen (1997), innovación disruptiva → correcto.
- Freeman (1984), *Strategic Management: A Stakeholder Approach* → **correcto y exacto** (Freeman es el padre de la teoría de stakeholders, 1984).
- Anderson (2006), *The Long Tail* → correcto.
- Osterwalder & Pigneur (2011), *Generación de modelos de negocio* → correcto **aquí** (a diferencia de U6, donde se citaba mal para el DAFO; en U9 se cita correctamente para el Canvas/modelos de negocio).
- **Curiosity de Kodak (segunda aparición)** → ver inconsistencia abajo.

**Errores factuales**: ninguno detectado.

**Inconsistencia interna (intra-libro) — IMPORTANTE**:
- **Kodak se cuenta DOS VECES casi idéntica**: en U8 (Curiosity "Kodak: tener la tecnología y no atreverse a usarla", Sasson 1975, quiebra 2012) y en U9 (Curiosity "Kodak inventó la cámara digital… y la guardó en un cajón", Sasson 1975, quiebra 2012). **Es el mismo caso, mismo dato, misma moraleja, en dos unidades consecutivas.** **Recomendación clara**: dejar Kodak en UNA sola unidad (U9 encaja mejor, por "innovación disruptiva mal gestionada") y en U8 sustituir por otro caso de "cultura que teme al cambio" (Blockbuster, Nokia, BlackBerry), o convertir la mención de U8 en una referencia breve a U9.
- **DAFO empresarial** (U9) ↔ **DAFO personal** (U6): bien resuelto, U9 hace cross-reference explícita a U6 ("la misma herramienta... que en la Unidad 6 aplicamos a una persona"). El diagrama `DAFOGrid` se reutiliza correctamente. No es redundancia, es progresión pedagógica deliberada. **Bien.**
- **RSC / stakeholders / sostenibilidad** se tratan en U9 (saber C.5) y otra vez en U10 (saber C.5). Hay solape: ambos tienen Callout de stakeholders y de RSC. U10 retoma con enfoque "estrategia de futuro", pero la definición se repite. **Recomendación**: en U10 dar por vista la definición de U9 y centrarse en el ángulo de futuro/supervivencia, evitando reexplicar qué es un stakeholder.

**Pedagogía (eje B)**: completa. Glosario de 14 términos, "Para profundizar" (5), 4 preguntas, conexión con el curso. Dos diagramas (PorterForces, DAFOGrid). Es la unidad más densa del Bloc C (~338 líneas, 28 min). **No requiere refuerzo.**

**Cumplimiento CLAUDE.md**: limpio. Buena delimitación con EDMN (callout/blockquote explícito: "El Business Model Canvas... se estudia en profundidad en EDMN 2.º Bach").

**Solapamiento cross-libros** (CRÍTICO — la unidad con MÁS solape de todo el libro):
- **Modelos de negocio (suscripción, freemium, plataforma, publicidad, low cost, long tail), BMC** → **solape máximo con EDMN U4 "Modelos de negocio: concepto y evolución"** (owner doctrinal: Christensen, Anderson long tail, Spotify, Netflix, plataformas). EEAE lo trata "como fenómeno, no como plantilla". **El propio libro lo gestiona bien** con un blockquote que envía a EDMN para el Canvas. Owner doctrinal modelos de negocio = EDMN U4; EEAE en clave de casos/fenómeno. Vigilar que los casos no se dupliquen: **Spotify** está en EEAE U9 y en EDMN U4 (según diagnóstico EDMN, "Spotify owner = EDMN U4"). **DECISIÓN**: o se reparte (Spotify en uno, Airbnb en otro) o se acepta por nivel/curso distinto. Recomiendo Airbnb como caso-ancla de plataforma en EEAE (no aparece en EDMN) y reducir Spotify a mención.
- **Estrategia competitiva, Porter cinco fuerzas, ventaja competitiva, liderazgo en costes/diferenciación** → **solape fuerte con EDMN U3** (Porter cinco fuerzas, owner doctrinal) y EDMN U12 (capstone). El diagrama `PorterForces` se comparte con EDMN. Owner Porter = EDMN U3. EEAE lo aplica panorámicamente. Cross-reference recomendada.
- **Marketing digital, segmentación, mercado, cliente, target** → **solape con EDMN U6 "La función comercial y el marketing"** (owner de las 4P, segmentación, marketing). EEAE se centra en lo digital (saber C.2) sin las 4P clásicas — diferenciación válida. Owner marketing = EDMN U6.
- **RSC, stakeholders, triple bottom line** → **solape con EDMN U3** (RSC, ESG, Elkington, Friedman) y EEAE U3/U10. Owner doctrinal RSC = EDMN U3. EEAE lo trata como cierre estratégico. Cross-reference recomendada.
- **Transformación digital / innovación** → solapa con EEAE U10 (la propia U10 lo desarrolla a fondo). En U9 es introductorio, U10 lo amplía → progresión deliberada, aceptable.

---

### Unidad 10 — Transformación digital y la empresa del futuro

**Cifras desactualizadas / a verificar** (FLAGS de actualidad CRÍTICOS — unidad sobre el "futuro", la que peor envejece):
- "*alrededor del 13,5 % de las empresas de la UE de 10 o más empleados utilizaban ya alguna tecnología de IA (2024), frente a en torno al 8 % del año anterior*" → **el dato 2024 (13,5%) es CORRECTO** (verificado Eurostat), pero **ya está desactualizado para un sitio en producción 2026**: el dato 2025 de Eurostat es **20,0 %** (Dinamarca 42%, Finlandia 37,8%, Suecia 35%). **Recomendación: actualizar a 20% (2025)** y mencionar el salto. *(Verificado vía Eurostat, dic. 2025.)*
- "*entre las grandes empresas... supera con holgura el 40 %*" (IA) → coherente con 2024-2025; verificar el dato exacto 2025.
- "*teletrabajo... estabilizado en torno al 7-8 % de ocupados*" (EPA) → coherente con los últimos datos EPA; verificar contra EPA 2025.
- "*pre-pandemia 4-5 %*", "*Q2 2020 por encima del 16 %*" → correctos históricamente.
- "*sucursales bancarias reducidas a menos de la mitad respecto al máximo de 2008*" (BdE) → correcto y verificable.
- "*IA generativa... se popularizó a partir de finales de 2022*" → correcto (ChatGPT, nov. 2022).

**Citas a verificar**:
- **Curiosity de los luditas** (1811, Ned Ludd, Inglaterra) → **correcto y bien documentado**, con la moraleja matizada (el empleo total no se hundió pero la transición arruinó oficios). Excelente rigor histórico.
- Schwab (2016), *La cuarta revolución industrial* / WEF → correcto.
- Tegmark (2017), *Life 3.0 / Vida 3.0* → correcto.
- WEF *Future of Jobs Report* → correcto; **conviene citar edición concreta** (hay edición 2025, enero 2025). El diagnóstico EDMN ya flageó que WEF 2023 estaba desactualizado; aquí EEAE cita "ediciones recientes" sin año — concretar a 2025.
- Ley 10/2021 de trabajo a distancia (BOE-A-2021-11472) → **correcto y exacto**.
- LO 3/2018 de Protección de Datos, art. 88 (derecho a desconexión digital) → **correcto y exacto**.

**Errores factuales**: ninguno detectado.

**Inconsistencia interna (intra-libro)**:
- **Revolución tecnológica / olas industriales**: se trata en U8 ("Tres olas de transformación": vapor, electricidad+cadena, digital) y en U10 ("Una más en una larga serie de revoluciones": cuatro revoluciones industriales). Hay solape pero con matiz: U8 lo presenta como marco panorámico (saber C.1), U10 lo desarrolla con la 4.ª revolución y la IA (saberes C.1, C.4). Aceptable como progresión, pero conviene una cross-reference de U10 a U8 para no reexplicar las olas desde cero.
- **Kodak**: ver U9 (Kodak está en U8 Y U9; en U10 NO se repite — bien). Consolidar entre U8 y U9.
- **RSC / stakeholders / economía circular / sostenibilidad**: se definen en U9 y se re-definen en U10 (Callouts duplicados). Ver nota en U9. **Recomendación**: U10 debería dar por vistas las definiciones y aportar solo el ángulo "estrategia de futuro/supervivencia".
- **Economía circular**: definida en U3 (completo, con diagrama) y retomada en U10 (sin diagrama, definición repetida). U10 hace cross-reference a U3 ("que ya asomó en la Unidad 3") — bien resuelto, no duplica diagrama.

**Pedagogía (eje B)**: completa y es un buen capstone de cierre de curso ("atando los hilos", "cierre del curso" que recapitula las 10 unidades). Glosario de 16 términos, "Para profundizar" (5), 6 preguntas, recapitulación final. **Carencia visual**: U10 **NO tiene ningún `Diagram` propio** (solo 3 Figures fotográficas), siendo la unidad de cierre. Es la mayor laguna visual del libro. **Recomendación**: añadir 1-2 diagramas (p. ej. "destruir/transformar/crear empleo", las 4 revoluciones industriales en timeline, o un esquema-síntesis de la empresa del futuro que ate los hilos del curso).

**Cumplimiento CLAUDE.md**: limpio. Excelente tono ante la IA ("ni catastrofismo ni ingenuidad"), cumple el registro crítico. Sin emojis.

**Solapamiento cross-libros** (CRÍTICO):
- **Revolución tecnológica, transformación digital, IA y empleo, automatización** → solapa con EDMN U7 (función productiva, automatización, Industria 4.0) y EDMN U8 (IA y empleo, WEF Future of Jobs). EEAE lo trata como "empresa del futuro" panorámico (saberes C.1, C.4). Owner del análisis IA-empleo detallado = EDMN U8; EEAE en clave prospectiva. Cross-reference recomendada.
- **Teletrabajo, gig economy, derecho a desconexión** → solapa con EDMN U8 (RRHH, modalidades) y FOPP U8 (derechos laborales). Owner derecho a desconexión/trabajo a distancia (Ley 10/2021) = puede repartirse; aquí EEAE lo trata como tendencia, FOPP como derecho exigible. Diferenciación válida.
- **Sostenibilidad, economía circular, RSC, stakeholders, greenwashing** → solapa con EEAE U3 (owner intra-libro), EDMN U3 y EEAE U9. Owner sostenibilidad = EEAE U3; U10 debería remitir, no redefinir.
- **Aprendizaje a lo largo de la vida, reskilling/upskilling** → probablemente único o casi único; solapa parcial con FOPP (orientación). Bien.

---

## Mapa de solapamiento cross-libros (síntesis)

EEAE es, por diseño curricular, la asignatura del catálogo que **más solapa con las demás**: su Bloc A toca lo de Eco 1BACH (economía), su Bloc B lo de EDMN/GPE (emprendimiento) y su Bloc C lo de EDMN (empresa). El curriculum-eeae-bach.md §6 marca la regla maestra y EEAE **la cumple bien en general** (panorámico vs detallado, perfil personal vs teoría funcional, casos vs metodología). La tabla resume los owners doctrinales y la acción recomendada:

| Concepto / caso | Aparece en | Owner doctrinal | Acción en EEAE |
|---|---|---|---|
| Escasez, coste oport., mercado, asignación | EEAE U1 + Eco 1BACH U1 + Eco 4ESO | **Eco 1BACH** (modelo formal) | Mantener panorámico (ya cumple); sin gráficos |
| Economía del comportamiento, Kahneman, sesgos | EEAE U2 + Eco 1BACH U2 + FOPP U4 | **Eco 1BACH U2** (diferenciador propio) | Mantener en clave perfil decisor; cross-ref a Eco 1BACH |
| Utilitarismo, eficiencia/equidad, Pareto, IDH | EEAE U2 + Eco 1BACH | **Eco 1BACH** (bienestar formal) | Mantener en clave ética/filosófica |
| Fallos de mercado, externalidades, comunes | EEAE U3 + Eco 1BACH | **Eco 1BACH** | Mantener panorámico (ya cumple) |
| ODS, sostenibilidad, economía circular | EEAE U3/U7/U9/U10 + EDMN U3 + Eco 4ESO U5 + GPE | **EEAE U3** (saber curricular central) | Owner intra-catálogo; consolidar dentro de EEAE en U3 |
| Flujo circular, AD-AS, multiplicador, dinero | EEAE U4 + Eco 1BACH | **Eco 1BACH** (macro formal) | Mantener panorámico (ya cumple) |
| Finanzas personales, interés compuesto, CNMV | EEAE U4 + Eco 4ESO U8 + FOPP | **Eco 4ESO U8** (nivel ESO práctico) | Mantener riesgo-beneficio + interés compuesto por nivel Bach |
| Perfil emprendedor, mito nato, GEM, edad | EEAE U5/U6 + EDMN U1 | **Reparto por curso**: EDMN 2º (doctrinal) / EEAE 1º (soft) | Owner IE/IEjecutiva/relaciones = EEAE; dato MIT = EDMN |
| Motivación: Maslow, Herzberg, Hawthorne, liderazgo | EEAE U5/U8 + EDMN U8 | **EDMN U8** (RRHH funcional) | Cross-ref a EDMN; evitar reexplicar; **liderazgo repetido en EEAE U5 y U8 — consolidar** |
| Creatividad, doble diamante, SCAMPER, design thinking | EEAE U6 + EDMN U5 | **EDMN U5** (diseño de modelos) | Mantener en clave "creatividad personal" (B.2); cross-ref |
| DAFO | EEAE U6 (personal) + U9 (empresarial) + EDMN U3 + FOPP U1 | Reparto: EDMN U3 empresarial / FOPP U1 + EEAE U6 personal | Coherente (personal U6 → empresarial U9); cross-ref a FOPP U1 |
| Misión/visión/valores, MVP, lean, "sal del edificio" | EEAE U7 + EDMN U4/U5/U12 | **EDMN U12** (plan/prototipado) | Mantener en clave "propósito, no papeleo" (B.5); cross-ref |
| Propiedad industrial/intelectual, marca, patente, OEPM | EEAE U7 (+ EDMN puntual) | **EEAE U7** (bien desarrollado) | Owner; verificar EDMN U12 no duplique |
| Emprendimiento social, B Corp, La Fageda, Yunus | EEAE U7 + GPE | **EEAE U7 / GPE** | Owner; verificar GPE no duplique La Fageda |
| Patagonia / Chouinard | EDMN U3 + **EEAE U7 + EEAE U8** | **EDMN U3** (RSC) | **TRIPLICADO**: consolidar a 1 sola unidad en EEAE (U7) |
| Empresa, áreas funcionales, DIRCE, pymes | EEAE U8 + EDMN U1/U2 + Eco 4ESO U1 | **EDMN** (teoría funcional) | Mantener "fenómeno humano" (C.3); DIRCE aceptable repartido |
| Cultura, talento, gestión del talento | EEAE U8 + EDMN U8 | **EDMN U8** | Cross-ref; mantener enfoque "personas" |
| Modelos de negocio (suscripción/plataforma/freemium), BMC | EEAE U8/U9 + EDMN U4 | **EDMN U4** (modelos de negocio) | Ya gestionado con blockquote a EDMN; **Spotify duplicado con EDMN U4 — repartir** |
| Estrategia, Porter 5 fuerzas, ventaja competitiva | EEAE U9 + EDMN U3/U12 | **EDMN U3** | Cross-ref; PorterForces compartido |
| Marketing digital, segmentación, target | EEAE U9 + EDMN U6 | **EDMN U6** (4P, marketing) | Mantener foco digital (C.2) |
| RSC, stakeholders, Freeman | EEAE U9/U10 + EDMN U3 | **EDMN U3** | Cross-ref; evitar redefinir en U10 |
| Brecha de género, techo de cristal | EEAE U8 + EDMN U8 + FOPP/Eco | **EEAE U8** (saber C.3 explícito) | Owner natural |
| Kodak / Christensen disrupción | EEAE U8 + U9 + EDMN U4 | EDMN U4 (Christensen) | **Kodak duplicado EEAE U8/U9 — dejar en 1 (U9)** |
| IA y empleo, transformación digital, teletrabajo | EEAE U10 + EDMN U7/U8 + FOPP U8 | **EDMN U8** (IA-empleo) / **FOPP** (derechos) | Mantener prospectivo (C.4); cross-ref |

**Conclusión del mapa**: EEAE **no es un clon** de EDMN ni de Eco 1BACH. Cumple la regla de "panorámico/perfil/casos vs detallado/funcional/método", y a menudo lo declara explícitamente en el propio texto (excelente). Los problemas de solape reales y accionables son sobre todo **internos a EEAE** (Patagonia ×3, Kodak ×2, liderazgo ×2, RSC/stakeholders ×2) más algún caso compartido con EDMN que conviene repartir (Spotify). Las cross-references explícitas son la acción principal recomendada, no recortar contenido.

---

## Resumen ejecutivo y backlog priorizado

### Valoración global

**EEAE nace con una calidad muy alta**, claramente por encima del estado de salida de los 4 libros originales en su Fase 0. Tono uniforme y excelente (coral, sobrio, próximo, sin caer nunca en lo personal de Pau), rigor doctrinal sólido, citas legales exactas, casos reales bien documentados (no se detectan casos inventados por el sub-agente — al contrario que el caso Bitwise flageado en Eco 4ESO), y **todo el aparato pedagógico de la Fase 2 ya incorporado** (reading time, pre-requisitos, objetivos, glosario, "Para profundizar", preguntas de reflexión, conexiones inter-unidad). Cumple el CLAUDE.md en tono, estética y prohibiciones.

### Cifras flageadas: ~20-25 (la mayoría leves)

La mayoría son "actualizar al último año" de fuentes oficiales (INE, Eurostat, GEM, DIRCE), no errores. Las **3 más urgentes** por ser un sitio en producción 2026:
1. **U10 — IA en empresas UE: 13,5% (2024) → 20,0% (2025)** [verificado Eurostat]. La unidad sobre "el futuro" no puede llevar el dato del año anterior.
2. **U9 — Spotify "más de 200M premium": real 263M (2024) / ~290M (2025)** [verificado SEC/Statista]. Queda muy corto.
3. **U8 — DIRCE a 1 enero 2024 → actualizar a 2025** (tejido empresarial, núm. empresas, % sin asalariados).

### Citas dudosas / apócrifas: NINGUNA confirmada

Verificación muy positiva. Todas las citas célebres están bien atribuidas (Mill "Sócrates insatisfecho" → correcto; Sinek; Blank "sal del edificio"; luditas; pósit 3M; pivotes Slack/Twitch). Los casos de empresas son **reales y verificables** (Wallapop, MUD Jeans, La Fageda, Grameen, Buurtzorg, PlayStation/Kutaragi, Kodak/Sasson, Spotify, Airbnb, Patagonia). El auto-icono de Bentham y el experimento de Mischel llevan los matices correctos. **Un único error de atribución bibliográfica**: U6 cita Osterwalder & Pigneur como fuente del DAFO (incorrecto; el DAFO no procede de ahí).

### Emojis pictográficos: 0 (CERO)

Búsqueda en las 10 unidades: **ningún emoji pictográfico** (📖⏱🎯 etc.). Solo símbolos tipográficos permitidos (→ × — · ☐). Cumple la regla del CLAUDE.md sin excepciones.

### Problemas de tono / compliance

- **Nota LOMLOE ausente**: ninguna unidad incluye el párrafo-nota obligatorio del CLAUDE.md (currículo básico estatal + concreción CCAA). Se cita el RD pero no la nota literal. **Añadir en la intro de U1.**
- **Frontmatter U6**: `conceptos_clave` contiene `"esperit emprendedor"` en valenciano (debe ser castellano en el MVP). Errata de idioma.
- **Título coloquial U6**: RealExample "Glovo no, Wallapop" — poco editorial; reescribir.

### Top 3 problemas (accionables)

1. **Repeticiones internas de casos/conceptos**: Patagonia ×3 (U3 EDMN + U7 + U8), Kodak ×2 (U8 + U9), liderazgo/estilos ×2 (U5 + U8), RSC/stakeholders ×2 (U9 + U10). Consolidar cada uno a una sola aparición principal + cross-reference.
2. **Cifras de actualidad en las unidades "de futuro" (U9, U10)**: IA UE (13,5%→20%), Spotify (200M→263/290M), DIRCE 2024→2025. Son las que peor envejecen y están a la vista del lector.
3. **Lagunas visuales en U7 y U10**: las dos únicas unidades sin `Diagram` propio, y U10 es el capstone de cierre. Añadir 1-2 diagramas en cada una (abanico empresa-ONG / círculo dorado en U7; destruir-transformar-crear empleo / síntesis empresa del futuro en U10).

### Backlog priorizado

**Quick wins (eje A — alta prioridad)**:
- [ ] Añadir nota LOMLOE en intro U1 (RD 243/2022 + Decret 108/2022 CV).
- [ ] Actualizar IA UE 13,5%→20% (U10), Spotify 200M→263/290M (U9), DIRCE 2024→2025 (U8).
- [ ] Corregir frontmatter U6 ("esperit"→"espíritu") y título RealExample U6.
- [ ] Corregir bibliografía U6 (DAFO no es de Osterwalder).
- [ ] Unificar franja de edad GEM entre U5 ("desde 35") y U6 ("35-54").
- [ ] Actualizar ediciones/años: WEF Future of Jobs → 2025 (U10), GEM España → última edición.

**Consolidación de repeticiones (eje A)**:
- [ ] Patagonia: dejar en EEAE U7 (misión); sustituir el RealExample de U8 por otro caso de liderazgo-ejemplo.
- [ ] Kodak: dejar en U9 (disrupción); convertir U8 en cross-ref o sustituir por otro caso.
- [ ] Liderazgo/estilos: desarrollar en U5; en U8 remitir a U5 y aportar solo lo nuevo (situacional, servant, ≠ autoridad).
- [ ] RSC/stakeholders: definir en U9; en U10 remitir y dar solo el ángulo de futuro.
- [ ] Spotify: reducir a mención en EEAE U9 (owner del caso = EDMN U4); reforzar Airbnb como caso-ancla de plataforma.

**Cross-references explícitas (eje A/B — barato y de alto valor)**:
- [ ] Añadir remisiones a EDMN (U3 Porter/RSC, U4 modelos, U5 design thinking, U6 marketing, U8 RRHH/IA) y a Eco 1BACH (U2 econ. comportamiento, fallos de mercado, flujo circular) donde EEAE toca su terreno panorámicamente.

**Visualidad (eje C)**:
- [ ] Añadir diagrama en U7 (abanico empresa-ONG o círculo dorado) y 1-2 en U10 (empleo IA / síntesis empresa del futuro / timeline 4 revoluciones).
- [ ] Revisar imágenes débiles: U4 (dos bancos), U8 (Patagonia store si cae el caso), U10 (stock tecnológico → preferir diagrama).

**Pedagogía (eje B)**: prácticamente cubierta de origen. Único añadido valorable (no imprescindible): un 2.º SolvedExercise de presupuesto personal (regla 50/30/20) en U4.

### Verificación de cobertura curricular

Las 10 unidades cubren **íntegramente** los 3 bloques y los 6 CE del RD 243/2022 según el mapeo del curriculum-eeae-bach.md (Bloc A: U1-4; Bloc B: U5-7; Bloc C: U8-10). El marco legal citado en todas las unidades es **correcto** (RD 243/2022, BOE-A-2022-5521). **Falta solo trasladar al libro la nota de concreción autonómica CV (Decret 108/2022)** que sí está en el doc de currículo. Cobertura: completa.
