# Diagnóstico FOPP 4ESO — Fase 0 (2026-05-18)

> Diagnóstico detallado del cuarto libro del rebranding (Formación y Orientación Personal y Profesional, 4.º ESO) para la Fase 0 del Plan de mejora de los 4 libros — 2026. Material analizado: 10 units MDX en la branca `feat/fopp-4eso-foundation` (PR #27), ~2.976 líneas totales, 4 diagramas SVG (SistemaEducativo, BloquesFOPP, CVStructure + DAFOGrid reutilizado de Eco 4ESO), 2 recursos Preact (BuscadorItinerarios, GeneradorCVEuropass), bibliografía estable de 6-12 fuentes per unit.

## Resumen ejecutivo

- 10 units publicadas (`estado: publicado`), todas con frontmatter completo, lema, KeyTakeaways, Bibliography.
- Densidad real: 263-326 líneas/unit (objetivo curricular 220-300; ligero exceso en Units 4 y 10). El currículo decía Unit 3 = "8-9 sesiones"; en código son 270 líneas, **no** las 411 mencionadas en el prompt — está justificada y bien dimensionada.
- Tono general: **adecuado y honesto** para tema sensible. Pau ha conseguido tratar salud mental, relaciones tóxicas, dismorfia digital, bullying y suicidio sin pornografía emocional ni paternalismo. La Línea 024 aparece a tiempo; no se moraliza.
- Diferenciadores editoriales (Units 5, 8, 9): **sólidamente cumplidos**. Son el activo más fuerte del libro. Unit 8 con cita exacta de artículos del ET es la pieza más original del rebranding completo.
- Talón de Aquiles: cifras estructurales del Bloque E (Units 7-8) ancladas en datos 2024 que **deberán refrescarse para 2025-2026** antes de septiembre. Algunas cifras del SMI están desactualizadas o inconsistentes (ver Unit 7 vs Unit 8). Recursos Preact descritos pero sin auditoría del componente real.
- Solapamiento crítico: **Unit 8 (FOPP)** ↔ Unit 8 Eco 4ESO sobre nómina/contratos/ET. Decisión de Fase 1 obligada: ¿qué libro mantiene el detalle?

---

## Findings per unit

### Unit 1 — Autoconocimiento e identidad personal (293 líneas, Bloc A)

**Cifras a verificar**
- Harvard Grant Study cifra "268 alumnos universitarios" (1938): correcto.
- "75 años" Grant Study: correcto en 2013 cuando Waldinger dio TED, pero ya son **88 años** en 2026. Actualizar redacción.

**Citas a verificar**
- Gardner 1983 *Frames of Mind*: OK.
- García y Miralles, *Ikigai* 2016: OK.
- Cita literal de Buenafuente (*La Vanguardia*, abril 2023): **verificar fecha y publicación exactas** — riesgo de cita reconstruida.
- Erikson *Identity: Youth and Crisis* 1968: OK.
- Schwartz 1992 referencia: OK.

**3 mejoras prioritarias**
1. Añadir un diagrama propio de "8 inteligencias de Gardner" (hoy se listan en texto plano de 8 bullets — pesadas de leer). Una grid 4×2 con icono tipográfico + verbos clave de profesión sería el diagrama más rentable del libro.
2. SolvedExercise tipo "calcula tu jerarquía de valores" semi-guiado (no es unit cuantitativa, pero un ejemplo trabajado de DAFO personal con plantilla rellenada paso a paso ayuda al docente).
3. Reading time + glosario de 8-12 términos (identidad, rol, valor, ikigai, intrapersonal, kinestésica, DAFO, flow…) — preparar para Fase 2.

**Solapamiento**
- DAFO personal aparece también en Unit 10 (capstone). OK, es revisión deliberada.
- DAFO como herramienta empresarial **sí** aparece en EDMN 2BACH y Eco 4ESO. Conviene una nota explícita "lo veréis en versión empresarial en…" — ya existe línea 213, mantener.

---

### Unit 2 — Emociones, autoestima y salud mental (295 líneas, Bloc A)

**Cifras a verificar**
- "25 % de adolescentes españoles 15-24 con síntomas de ansiedad" (Sanidad ENS 2023): comprobar el dato exacto en publicación oficial — circula la cifra del 20-22 % en algunos informes. Riesgo medio.
- "80 % de adolescentes españolas retoca fotos" (OCU 2024): **verificar el informe OCU original**. Es el dato más viral y conviene no equivocarse con la fuente.
- "se ha duplicado en menos de una década": redacción vaga, citar año base concreto.
- Twenge et al. 2023 *Lancet Public Health*: comprobar título exacto de la referencia bibliográfica (línea 288).
- "España aprobó en 2024 la prohibición del móvil en horario escolar": en realidad fue **recomendación del Consejo Escolar del Estado** en enero 2024, varias CCAA legislaron después. Matizar.

**Citas a verificar**
- Ekman 1972 *Emotions in the Human Face*: OK.
- Goleman *Inteligencia emocional* 1995 (ed. esp. 1996): OK.
- Haidt *The Anxious Generation* 2024: OK.
- Rosenberg *Comunicación No Violenta*: el subtítulo correcto es "un lenguaje de vida" en algunas ediciones, "el lenguaje de la vida" en otras. Confirmar.
- Carolina Marín y Simone Biles (Tokio 2021, twisties): hecho histórico OK.

**3 mejoras prioritarias**
1. **Imagen débil**: Daniel Kahneman aparece como retrato suelto sin conexión visual con técnicas de regulación. El bloque "tres técnicas" pide diagrama propio (3 columnas con icono + 1 frase resumen + cuándo aplicar). Imagen mindfulness genérica es la más sustituible del libro.
2. La sección 024 / ANAR / Esperanza ahora es Callout. Mover a **componente dedicado tipo `<RecursosAyuda>`** reutilizable; reaparecerá en Unit 3 (relaciones tóxicas → 016) y Unit 10. Evita inconsistencias.
3. SolvedExercise faltante: aplicar la fórmula CNV "Yo siento... cuando tú... porque... me gustaría que..." a 2-3 situaciones reales del aula con respuestas modelo.

**Solapamiento**
- Haidt + Karolinska + Twenge se repiten en Unit 3 (FOMO). Decidir qué unidad mantiene cada cita; no las tres en ambas units.
- Kahneman aparece también en Unit 4 (mejor encaje allí). Quitar de aquí o reducir.

---

### Unit 3 — Mi entorno: familiar, social y digital (270 líneas, Bloc B)

**Cifras a verificar**
- Save the Children "Yo a eso no juego" 2024: 9,3 % bullying / 6,9 % ciberbullying — **verificar cifras exactas** del informe.
- Karolinska 2023 "3.300 adolescentes suecos, ratio 1,7× ansiedad / 2,2× depresión": comprobar paper *Computers in Human Behavior* 2023 — sospecha de cifras reconstruidas (no hay equipo del Karolinska firmando ese paper concreto; la firma principal del estudio sueco más citado de 2023 sobre redes y mental health es del Karolinska + Universidad de Gotemburgo, pero las cifras concretas hay que cuadrarlas).
- "13 % alumnado de Ingeniería Informática femenino, bajada desde 30 % en años ochenta" INE 2024: cifra **plausible y publicada**, citar año exacto del dato INE.
- AEPD: edad mínima legal consentimiento digital en España = **14 años** (correcto, art. 7 LOPDGDD 3/2018).

**Citas a verificar**
- Bourdieu *La distinction* 1979: OK.
- Olweus 1993: OK.
- McGinnis 2004 en *The Harbus* (Harvard Business School): **verificar publicación exacta** — el artículo se cita mucho pero la atribución exacta a *The Harbus* no siempre se confirma.
- **Caso Kamila Tarriño**: nombre real con datos sensibles de menor. Pau señala que la víctima "ha pedido públicamente que su historia sirva para prevenir otros casos". **Verificar consentimiento explícito documentado** y, si hay duda, anonimizar (es práctica habitual en pedagogía sobre acoso). Es la decisión editorial más sensible del libro entero.
- Ley 4/2023 LGTBI: OK, BOE núm. 51 confirmado.
- Pulsera Brave / Plan International 2021: verificar campaña.
- "Más de 80 institutos españoles la incorporaron en 2022": dato puntual difícil de verificar — considerar redacción más prudente.

**3 mejoras prioritarias**
1. **Caso Kamila Tarriño**: revisión legal/editorial antes de publicar bajo ese nombre. Si no se documenta consentimiento exhaustivo, anonimizar a "Aitana, alumna de 12 años de Vigo" sin perder valor pedagógico. Riesgo reputacional alto.
2. Diagrama propio "Tres tipos de capital de Bourdieu" (económico-cultural-social) o "Tres tipos de presión grupal (explícita/implícita/anticipada)". Hoy todo en texto.
3. Sección B.5 (diversidad e igualdad) queda muy corta y citativa: 4 leyes seguidas + un párrafo sobre brecha STEM. Equilibrar con un caso concreto (un breve `<RealExample>` de discriminación laboral juvenil documentada) para no quedarse en la cita legal seca.

**Solapamiento**
- Haidt *The Anxious Generation* (también Unit 2). Mantener solo aquí — encaja mejor en B.3 que en A.4.
- Línea 016 (violencia de género) — coherente con la 024/ANAR de Unit 2 → mover a componente reutilizable (ver mejora #2 de Unit 2).
- Capital cultural / sociología de Bourdieu: NO aparece en otros libros. Diferenciador limpio.

**Decisión sobre densidad**: las 270 líneas son **adecuadas**, no requieren partición. Cubre 5 sabers (B.1-B.5) en una sola unit y eso impone densidad. Partir generaría units cortas con saber único y rompería el bloque pedagógico. **Mantener intacta**.

---

### Unit 4 — Cómo tomamos decisiones (316 líneas, Bloc C — la más larga)

**Cifras a verificar**
- Schwartz / Iyengar experimento mermeladas (24 vs 6 sabores, "10 veces menos compras"): cifra clásica. **Verificar replicación** — el estudio original (Iyengar & Lepper 2000) tiene réplicas mixtas; algunos meta-análisis posteriores (Scheibehenne et al. 2010) lo cuestionan. Añadir matiz "estudio clásico pero discutido" para rigor.
- "Andrea Solà ganó medalla oro SpainSkills 2022, representó España WorldSkills Lyon 2024": **verificar persona real y datos** o marcarlo como ejemplo ilustrativo.
- Bezos carta a accionistas 1997 y *two-way doors*: **el framework de one-way / two-way doors es de la carta de 1997-1998-1999** — verificar año exacto (más conocida es 1997, pero la formulación de las puertas aparece más nítidamente en cartas posteriores).

**Citas a verificar**
- Kahneman *Thinking, Fast and Slow* 2011: OK.
- Damasio *Descartes' Error* 1994: OK.
- Simon *Models of Man* 1957: OK.
- Robert Frost *The Road Not Taken* 1916 — traducción al castellano: revisar fidelidad ("pesaroso de no poder tomarlos los dos" es traducción libre, varias versiones en circulación).

**3 mejoras prioritarias**
1. SolvedExercise: la tabla del paso 4 (Bach Ciencias / FP / Bach General con puntuaciones) está casi a un paso de ser SolvedExercise formal. Convertirla en `<SolvedExercise>` numerado con enunciado, datos, solución y comentario.
2. Diagrama "Cuatro sesgos cognitivos" (anclaje / confirmación / coste hundido / sesgo del presente) en 2×2 con micro-ejemplo en cada cuadrante — repetitividad textual actual cansa.
3. Reducir 30-40 líneas: la unit excede el rango objetivo (220-300). Candidatos a poda: ejemplos largos del test de tolerancia al riesgo (líneas 229-240, 8 preguntas + 3 rangos cabe en 5 líneas más compactas) y la sección "racional vs emocional" tiene 3 párrafos donde sobran 1.

**Solapamiento**
- Kahneman aparece también en Unit 2. **Mover toda la presencia de Kahneman aquí** (mejor encaje). Quitar Figure de Unit 2.
- Bezos / two-way doors: **NO aparece en EDMN 2BACH ni Eco 1BACH**. Diferenciador limpio.
- Schwartz *Paradox of Choice*: aparece también en Eco 1BACH Unit 4 (microeconomía del consumidor)? **Verificar y decidir libro propietario** — caso límite.

---

### Unit 5 — El sistema educativo: itinerarios tras 4.º ESO ★ (306 líneas, Bloc D)

**Cifras a verificar**
- Tasa de empleo titulados FP Superior "supera el 75 %": **citar fuente con año exacto** (OCDE Education at a Glance 2024 ✓).
- "Familias técnicas (Informática, Electricidad, Sanidad, Fabricación Mecánica, Mantenimiento) >90 % empleabilidad en algunas comunidades": **dato regional disperso**, citar comunidad concreta o eliminar el "90 %" o sustituir por rango.
- "En Alemania ~60 % de jóvenes elige FP, en España ~12 %": cifras Eurostat consistentes con la realidad pero **comprobar series 2023-2024**.
- Aida medalla nacional SpainSkills en Estética Personal Decorativa: **verificar caso real o marcar ficticio**. Riesgo de inventar caso.
- Mario pivotaje Bachillerato → FP Sistemas Microinformáticos: **verificar o marcar ficticio**.

**Citas a verificar**
- RD 243/2022 Bachillerato: OK.
- LOFP RD 659/2023: OK.
- Ley Orgánica 3/2022 FP: OK.
- LOSU 2/2023: aparece en Unit 6, no Unit 5 — coherencia OK.

**3 mejoras prioritarias**
1. Marcar explícitamente los casos Aida y Mario como ilustrativos si no son personas reales documentadas. La fórmula "Imagina a Aida, alumna ficticia..." es válida y honesta; "ganó la medalla nacional" sin fuente verificable es problemático.
2. Las 26 familias profesionales listadas verticalmente cansan mucho. Convertir en **diagrama o tabla compacta agrupada por sector económico** (industria / servicios / sanidad / técnico…) — encaja con cómo lo redefine Unit 6.
3. Glosario aún no implementado: EBAU/PEvAU/PAU, ECTS, distrito único, ponderación, nota de corte, modalidad, familia profesional, ciclo, FCT, dual, prueba de acceso. ~12 términos críticos.

**Solapamiento**
- Diagrama `SistemaEducativo.astro` es propio del libro y único. Bien.
- Sistema educativo / EBAU **no aparece en otros libros**. Diferenciador limpio.

---

### Unit 6 — Formación Profesional, Universidad y becas (314 líneas, Bloc D)

**Cifras a verificar**
- Salarios de entrada por familia (líneas 86-91): **datos AEFI 2024**. Pau ha hecho un esfuerzo notable, pero estos rangos cambian rápido. Refresco anual obligado. Comprobar:
  - DAW/DAM/ASIR 24-28k €: plausible.
  - Mecatrónica 22-26k €: plausible.
  - Cuidados Auxiliares Enfermería 18-21k público / 15-18k privado: plausible.
  - Administración y Finanzas 19-22k: posiblemente alto para 2024-2025 reales.
- Erasmus+ ayudas 310-540 € / 360-600 €: **verificar tabla 2024-2025** (importes pueden haberse ajustado por inflación).
- "Cuantía total beca MEFP universitaria ronda 3.500-5.500 € anuales": citar fuente.
- "50 % alumnado becado MEFP es primera generación universitaria" (Fundación La Caixa Memoria Becas 2024): **verificar la cifra y la fuente exacta** — el dato es conocido pero la atribución concreta hay que confirmarla.
- "1,6 millones universitarios / 800.000 FP" — MEFP 2024: OK rango.
- SMI 2024 1.184 €: OK. **Actualizar a SMI 2026** cuando se publique.
- Lucía y Diego (RealExamples): mismo problema que Aida/Mario — verificar o marcar ilustrativos.

**Citas a verificar**
- LOSU Ley Orgánica 2/2023: OK.
- Convocatoria de Becas MEFP 2024-2025: OK.
- Fundación Bertelsmann FP Dual 2024: OK.

**3 mejoras prioritarias**
1. La fórmula EBAU aparece **dos veces** (Unit 5 línea 130, Unit 6 línea 153). Consolidar en Unit 6 (con detalle) y dejar referencia ligera en Unit 5.
2. Diagrama "Cómo se calcula la nota de admisión EBAU" — fórmula visual: 0,6×Bach + 0,4×EBAU base + ponderaciones (max 4) = max 14. Hoy es texto denso de párrafo, ideal para SVG explicativo.
3. Convertir el listado de 5 tipos de becas (MEFP / autonómicas / AEPE / Erasmus+ / La Caixa) en **tabla comparativa** (quién, importe, plazo, requisitos clave) — herramienta de referencia que el alumno reutilizará todo el curso.

**Solapamiento**
- Becas / Erasmus+ no aparece en otros libros. Diferenciador limpio.
- Universidad y grados: solo aquí. OK.

---

### Unit 7 — El mundo del trabajo: mercado laboral en España (263 líneas, Bloc E)

**Cifras a verificar**
- EPA T3 2024: actividad 58,6 % / paro 11,3 % / empleo 52 % — **actualizar a últimos datos disponibles 2025-2026**.
- Sectores económicos: primario 3 % PIB / secundario 22 % / terciario 67 % / cuaternario 8 %. **Verificar últimos datos INE Contabilidad Nacional 2024-2025**.
- Turismo "12 % del PIB / 2,5 millones empleos directos": OK pero año concreto.
- "85 millones turistas internacionales 2023, segundo del mundo": **se confirma 85,1 M (INE), pero en 2024 España superó a Francia con ~94 M** y se convirtió en primer destino mundial según FrontIneur/OMT. **Dato OBLIGATORIO de actualizar**.
- SMI "2024-2025: 1.184 €": **inconsistencia con Unit 8 que dice "SMI 2026 1.184 €"**. Verificar el dato oficial 2026 (probablemente subió a 1.200+ €). Decisión Fase 1.
- Salarios medios por nivel formativo (líneas 159-163): "ESO ~16k, FP GM ~22k, FP GS ~25k, Grado ~28k, Máster ~33k" — Encuesta Estructura Salarial 2024 INE. **Verificar exactitud** y refrescar si hay datos 2025.
- "Tasa paro juvenil España ~27 % T3 2024 vs UE ~14 %": OK orden de magnitud, actualizar año.
- "Paro juvenil España 2013: 56 %": OK histórico.

**Citas a verificar**
- AIReF informe dualidad: OK existe.
- Banco de España informe paro juvenil 2023: OK temática existe, verificar título.
- RD 145/2024 SMI: OK pero ya hay RD posterior para 2025/2026.

**3 mejoras prioritarias**
1. **Refresco completo de TODAS las cifras macro** a datos más recientes disponibles (EPA, EPA juvenil, sectores económicos, SMI, turismo). Es la unit con cifras más perecederas del libro.
2. Diagrama "Tarta sectores económicos España" — 3 % / 22 % / 67 % / 8 % en gráfico circular con leyenda. SVG sencillo, alto valor pedagógico.
3. SolvedExercise: calcular las tres tasas EPA con cifras hipotéticas dadas (población 16+, ocupados, parados) → tasa actividad / tasa paro / tasa empleo. Es la unit cuantitativa y no tiene SolvedExercise.

**Solapamiento**
- Sectores económicos y CNAE aparece en Eco 4ESO Unit 1 y Eco 1BACH Unit 1. **Decisión obligada**: dónde se mantiene el cubrimiento detallado. Aquí FOPP debería ser ligero y remitir a Eco 4ESO/1BACH.
- EPA / tasa paro: mismo problema. Eco 4ESO Unit 6 (mercado laboral) lo cubre con más profundidad económica. Aquí FOPP debería **enfocarse en lectura útil para joven que busca empleo**, no en metodología INE.
- Sectores cuaternarios no aparece en EDMN/Eco — diferenciador limpio.

---

### Unit 8 — Tus derechos como trabajador ★ (293 líneas, Bloc E)

**Cifras a verificar**
- **SMI 2026 = 1.184 €**: **INCONSISTENCIA crítica con Unit 7** que dice 2024-2025. Pau lo escribe como 2026 aquí. Decidir cifra oficial real (probablemente >1.184 € en 2026). El SMI 2024 fue 1.134 € → 2025 fue 1.184 € → 2026 está por confirmar. **Fix prioritario Fase 1**.
- Despido improcedente 33 días/año, max 24 mensualidades (post-Reforma 2012): OK.
- Despido objetivo 20 días/año, max 12 mensualidades: OK.
- "Jornada máxima 40 h cómputo anual, 9 h ordinarias diarias adultos": OK.
- Vacaciones 30 días naturales: OK ET art. 38.
- Pagas extras 2 mínimo (junio + Navidad): OK ET art. 31.
- Inspección Trabajo "1,2 millones actuaciones/año, plazo 3-6 meses, sanción media >7.500 € grave, hasta 200.000 € muy grave": **verificar memoria anual ITSS** — orden de magnitud razonable.
- Caso Glovo / Ley Rider: hecho histórico OK. RDL 9/2021 OK.
- Sentencia TS 2023 Mercadona vacaciones: **verificar número de sentencia exacto y fecha**. Difícil sin acceso a CENDOJ.

**Citas a verificar**
- RDLeg 2/2015 ET: OK.
- Ley 31/1995 PRL: OK.
- RDL 32/2021 Reforma laboral: OK.
- RD 773/1997 EPIs: OK.
- Decreto 26 julio 1957 trabajos peligrosos para menores: **verificar vigencia** — sigue parcialmente vigente pero hay normativa posterior compleja.
- TJUE *King v. Sash Window Workshop* 2017: OK existe.

**3 mejoras prioritarias**
1. **Resolver el conflicto SMI Unit 7 ↔ Unit 8** y unificar a cifra oficial 2026. Es el dato más visible del libro.
2. SolvedExercise 8.1 (Marta vacaciones contrato verano) está **excelente** — es el mejor del libro entero. Replicar con un segundo: calcular finiquito completo (salario último mes + vacaciones proporcionales + pagas extras prorrateadas) para reforzar el tema fuerte de la unit.
3. Diagrama "Anatomía de una nómina" o "Cómo reclamar un derecho laboral vulnerado" en flow vertical (empresa → comité/sindicato → ITSS → SMAC → Juzgado Social). Hoy es Steps textual; en SVG sería referencia visual reutilizable.

**Solapamiento — CRÍTICO**
- **Eco 4ESO Unit 8 — Trabajo, contrato y nómina**: cubrirá ET, jornada, vacaciones, contratos, nómina, finiquito desde óptica económico-jurídica.
- **FOPP Unit 8 — Derechos laborales**: cubre lo mismo desde óptica práctica del joven trabajador.
- **Decisión obligatoria Fase 1**:
  - Opción A: Eco 4ESO mantiene la teoría económica (estructura del contrato, tipos, nómina como cálculo); FOPP mantiene la práctica de derechos vulnerados, ITSS, Ley Rider, salud mental laboral, casos.
  - Opción B (preferida): FOPP es propietaria del bloque "tu primer contrato como menor de 18" (autorización parental, prohibiciones específicas, derechos exigibles) que Eco 4ESO no toca; Eco 4ESO mantiene el detalle de cotizaciones y cuotas patronales.
- En cualquier caso, **eliminar el doble cubrimiento de la fórmula de vacaciones proporcionales y de la cita del ET art. 38** — solo en un libro.

---

### Unit 9 — Buscar empleo: CV, marca personal y entrevista ★ (300 líneas, Bloc F)

**Cifras a verificar**
- "7,4 segundos primera revisión CV" (Ladders Inc. 2018, eyetracking): cifra muy citada pero **el estudio original Ladders de 2012 daba 6 segundos**, el de 2018 dio 7,4. Citar correctamente.
- "60-70 % de puestos nunca se publican" (informes Adecco): **es una cifra muy circulada pero metodológicamente discutida**. Citar como estimación con fuente exacta o usar rango más prudente.
- "75 % reclutadores ha detectado mentira en CV / 51 % candidatos confiesa mentir" (CareerBuilder Hiring Mistakes): **verificar el estudio**, las cifras CareerBuilder se actualizan cada 2 años.
- "Más de 1.000 millones de perfiles LinkedIn en 2024, +15 millones España": OK orden de magnitud.

**Citas a verificar**
- Europass plataforma: OK.
- Bolles *What Color Is Your Parachute?* ed. 2024: OK existe ed. actualizada anual.
- Adecco Guía Empleabilidad 2024: OK existe.
- AEPD guía derecho al olvido 2024: OK existe.
- "Pablo" RealExample LinkedIn first job: marcar ilustrativo si no es persona real documentada.

**3 mejoras prioritarias**
1. Diagrama "Método STAR" (Situación-Tarea-Acción-Resultado) en 4 cajas con ejemplo trabajado completo. Hoy todo en texto.
2. Reducción opcional: 300 líneas en el límite, pero la unit tiene 10 preguntas de entrevista + 5 fuentes ofertas + 7 errores CV + 5 errores entrevista + 5 puntos huella digital. Considerar consolidar las listas (errores fatales entrevista + 7 errores CV podrían fundirse en checklist visual única).
3. **Auditoría del componente `GeneradorCVEuropass`** (recurso Preact): el .md solo describe; verificar que el componente real produce HTML imprimible robusto, MCER A1-C2 funcional, validación de campos. Crítico para diferenciador.

**Solapamiento**
- LinkedIn y marca personal: **no aparece en otros libros**. Diferenciador limpio.
- Método STAR: solo aquí.
- CV / búsqueda empleo: solo aquí (en EDMN 2BACH hay algo de "emprender tu carrera" pero no kit operativo). OK.

---

### Unit 10 — Mi proyecto de vida: capstone integrador (326 líneas, Bloc A-F — la más larga)

**Cifras a verificar**
- Harvard Grant Study "724 hombres": **el número real comúnmente citado es 268 hombres del Grant Study original + 456 hombres del Glueck Study** = 724 combinados. OK si redacta "724 hombres y posteriormente sus familias", pero contradice Unit 1 que dice "268 alumnos universitarios". **Unificar cifra entre ambas units** (Unit 1 habla solo del Grant, Unit 10 del combinado).
- "Charla TED 2015 Waldinger vista por +50 millones": **verificar contador actualizado a 2026** (probablemente >70-80 millones).
- "Karolinska + UC Davis metaanálisis 62.250 adultos mayores, 19 % menos riesgo demencia" (Boyle et al. 2022 *Ageing Research Reviews*): **verificar paper y cifras exactas**. La cita es bibliográficamente plausible.

**Citas a verificar**
- Frankl *El hombre en busca de sentido* 1946: OK.
- Sinek *Start with Why* 2009: OK.
- Goggins *Can't Hurt Me* 2018: OK.
- Newport *Deep Work* 2016: OK.
- Doran SMART 1981 *Management Review*: OK.
- Pink *Drive* 2009: OK — pero también referenciado en Unit 4 como teoría AMP (autonomía/maestría/propósito). Coherente.

**3 mejoras prioritarias**
1. Reducción 30-40 líneas: la unit excede el rango (220-300). Candidatos: el bloque "Recapitulación del kit de salida" (líneas 64-95) repite las 9 units anteriores con detalle innecesario — puede reducirse a la mitad apoyándose en BloquesFOPP diagram. La "Despedida" (líneas 277-295) es preciosa pero podría ser una caja `<EpilogueQuote>` más compacta.
2. **Plantilla descargable** o componente Preact "Mi proyecto de vida" — el Steps de 7 pasos pide una ficha imprimible o un formulario guardable. Mejor diferenciador posible: capstone con artefacto tangible.
3. Diagrama "Tres horizontes temporales" (12 meses / 3-5 años / 10 años) en línea de tiempo visual con ejemplos por dimensión (personal/formativa/profesional).

**Solapamiento**
- Reutiliza ikigai (Unit 1 + Unit 10): **correcto**, es la integración prevista.
- Reutiliza SMART: **no aparece en otros libros**. Diferenciador limpio.
- Recapitulación de las 9 units anteriores: por definición solapa con todas. Asumido.

---

## Findings globales del libro FOPP 4ESO

### Tono ante tema sensible

**Veredicto: BIEN tratado**, con dos cautelas.

- Salud mental adolescente, suicidio, líneas de ayuda (024 / ANAR / Esperanza): aparecen en Unit 2 con redacción seria, sin dramatismo, con recursos públicos. Excelente.
- Relaciones tóxicas (Unit 3): las cinco señales son las clínicas estándar, el 016 está citado, no se cae en moralina. Correcto.
- Bullying / ciberbullying (Unit 3): protocolo correcto, datos Save the Children, énfasis adecuado en el observador. **Excepción**: el caso Kamila Tarriño con nombre real de menor es la decisión editorial más arriesgada. Requiere verificación de consentimiento o anonimización antes de Fase 1.
- Dismorfia digital / comparación social (Unit 2 + 3): tratado con datos (OCU 80 %, Karolinska, Twenge/Haidt) sin demonizar redes ni infantilizar al alumnado. Bien.
- Sexualidad implícita: el libro no entra en sexualidad explícita; cuando aparece (relaciones, género, LGTBI Unit 3 B.5) lo hace por la vía del marco legal y los derechos. Decisión editorial defendible para 4.º ESO general.

### Unit 3 (411 líneas)

**Falsa alarma**: la unit real son **270 líneas**, no 411 como menciona el prompt. La densidad es adecuada para 5 sabers (B.1-B.5) en una sola unit y está bien estructurada. **NO partir**. Si en algún momento se considera, separar como B.1-B.2 (familia + iguales) + B.3-B.5 (digital + local + diversidad) — pero rompería la coherencia "entornos múltiples desde los que decides". Mantener como está.

### Recursos Preact: BuscadorItinerarios + GeneradorCVEuropass

**Estado actual**: los .md docentes están bien redactados (qué/cuándo/cómo). El componente real no se ha auditado en este diagnóstico.

**Pendiente Fase 2 o 4**:
- BuscadorItinerarios: ¿cuántas preguntas reales (el .md dice 6, currículo dice 5-6), qué matriz de pesos, qué vías de salida, se actualiza con cambios LOMLOE/LOFP?
- GeneradorCVEuropass: ¿genera HTML válido para impresión a PDF nativa del navegador?, ¿soporta los 7 campos del CV junior?, ¿valida MCER A1-C2?, ¿accesible WCAG?
- Riesgo: si son MVPs sin robustez, pierden el diferenciador. **Auditoría técnica obligatoria** antes de promocionar como "diferenciador editorial".

### Diferenciadores editoriales: Units 5, 8, 9

**Veredicto: cumplidos**, con matices.

- **Unit 5 (cartografía sistema educativo)**: el diagrama `SistemaEducativo.astro` + las pasarelas explicadas + la modalidad General LOMLOE bien tratada + RealExamples de pivotaje Bachillerato↔FP → **diferenciador real frente a Anaya/Editex/McGraw-Hill**. Lo único que falla es presentar las 26 familias como lista vertical: ahí pierde fuerza visual.
- **Unit 8 (derechos laborales)**: el SolvedExercise 8.1 de Marta es **el mejor del libro entero**, citación de artículos exactos del ET, ruta de reclamación con ITSS, caso Glovo + Ley Rider. **Activo competitivo más fuerte**. Único riesgo: la inconsistencia SMI con Unit 7.
- **Unit 9 (búsqueda empleo)**: el diagrama CVStructure existe, las 10 preguntas STAR + 7 errores CV + 5 fuentes ofertas + mercado oculto + huella digital → **diferenciador real**. El kit operativo es lo que el currículo prometía y se cumple. El GeneradorCVEuropass necesita auditoría técnica.

**Las tres units cumplen lo prometido en `docs/curriculum-fopp-4eso.md` §6**. No se quedan a medias.

### Overlap con Eco 4ESO Unit 8 (nómina/contratos) — DECISIÓN OBLIGATORIA

**Conflicto detectado**: ET, jornada, vacaciones, contratos, finiquito aparecen tanto en Eco 4ESO Unit 8 (que cubre "Trabajo, contrato y nómina" desde óptica económica) como en FOPP Unit 8 (desde óptica derechos del joven trabajador).

**Recomendación de propietario per tema**:

| Tema | Libro propietario | Notas |
|---|---|---|
| Estructura nómina, cotizaciones SS, retenciones IRPF, cálculo neto | **Eco 4ESO Unit 8** | Es contenido económico-jurídico técnico |
| Tipos de contrato laboral (indefinido / temporal / formación / fijo discontinuo) | **Eco 4ESO Unit 8** | Marco general |
| ET derechos básicos del trabajador (10 derechos) | **FOPP Unit 8** | Visión práctica utilitarista |
| Trabajar a los 16-18 (autorización parental, prohibiciones específicas) | **FOPP Unit 8** | Único en FOPP |
| Vacaciones proporcionales (fórmula + SolvedExercise) | **FOPP Unit 8** | Ya es SolvedExercise estrella |
| Prevención Riesgos Laborales (Ley 31/1995, EPIs) | **FOPP Unit 8** | Único en FOPP |
| Convenio colectivo, sindicatos, comité empresa | **FOPP Unit 8** | Único en FOPP |
| Inspección Trabajo, SMAC, Juzgado Social, reclamación | **FOPP Unit 8** | Único en FOPP |
| Caso Glovo + Ley Rider | **FOPP Unit 8** | Único en FOPP |
| SMI valor concreto del año | **Ambos** pero con cifra IDÉNTICA actualizada | Inconsistencia actual |

**Acción Fase 1**: Eco 4ESO Unit 8 referencia a FOPP Unit 8 explícitamente para PRL, convenio, reclamación; FOPP Unit 8 referencia a Eco 4ESO Unit 8 para el detalle de cotizaciones y cálculo de nómina.

### Overlap con EDMN

- Menor que con Eco 4ESO. EDMN 2BACH es batxillerat (2 años más madurez), tema empresa/mercat/contabilidad. Solo coincide en:
  - DAFO (FOPP Unit 1 personal, EDMN como herramienta empresarial). **OK, complementarios**.
  - Toma de decisiones / sesgos (FOPP Unit 4, EDMN posibles capítulos de decisión empresarial). Verificar si Kahneman aparece también en EDMN: si sí, decidir libro propietario.
  - Comunicación CV / entrevista / LinkedIn: FOPP único. EDMN no debería cubrir esto.

### Bibliografía: ¿accesible para profesorado FOPP?

**Veredicto: MIXTO**.

El profesorado de FOPP en España típicamente es:
- Orientador/a del centro (titulación: Pedagogía, Psicopedagogía, Psicología).
- Profesor de Servicios a la Comunidad (FOL).
- Profesor de Filosofía / Lengua / Geografía e Historia (con apoyo).
- Más raramente: economista (especialidad 0061 Economía).

**Análisis bibliografía actual**:
- Fuentes pedagógicas y psicológicas (Gardner, Erikson, Goleman, Kahneman, Rosenberg, Pink): **familiares al profesorado de orientación**. Bien.
- Fuentes sociológicas (Bourdieu, Olweus, Twenge, Haidt): **familiares al profesorado de Filosofía/Sociales**. Bien.
- Fuentes económicas (OCDE Education at a Glance, Banco de España, AIReF, AEFI, SEPE): **menos familiares al profesorado de orientación pura**, más al de FOL/Economía. Aceptable.
- Fuentes legales (RD 217/2022, ET, Ley 31/1995, Ley 4/2023, RGPD, LOPDGDD, LOSU, LOFP): **densas pero necesarias** para Bloque E-F.

**Riesgo**: el orientador típico puede sentirse cómodo con Units 1-4 (orientación pura) y menos con Units 7-9 (mundo laboral, derechos, búsqueda empleo). 

**Recomendación Fase 2**: añadir a cada unit un mini-bloque "Para profundizar (lectura docente)" con 3-5 fuentes **divulgativas accesibles** (artículos de elDiario.es, *Cuadernos de Pedagogía*, podcasts, vídeos) además de la bibliografía académica densa. Multiplicará la usabilidad sin perder rigor.

### Imágenes débiles

**Auditoría rápida** (30 imágenes totales según plan):

**Sólidas** (mantener):
- Howard Gardner retrato (Unit 1)
- Andreu Buenafuente en RealExample mencionado, pero la foto que probablemente acompaña...
- Carolina Marín (Unit 2) — relevante y bien atribuida
- Daniel Kahneman (Unit 2/Unit 4)
- Fachada Salamanca (Unit 5) — icónica
- INSST Madrid (Unit 8)
- Primero de Mayo (Unit 8)
- Trabajadores EPI (Unit 8) — relevante
- Erasmus Groningen (Unit 6) — relevante

**Débiles o sustituibles** (auditoría Fase 3):
- Journal writing (Unit 1) — stock genérico de "escribir en libreta", añade poco
- Torii Itsukushima (Unit 1) — bello pero conexión con ikigai forzada
- Mindfulness meditation (Unit 1/2) — stock genérico
- Joven smartphone (Unit 3) — stock genérico
- Banco alimentos Madrid (Unit 3) — OK pero ilustrativo, no estrictamente necesario
- Cena familiar (Unit 3) — stock genérico
- Fork forest road (Unit 4) — ilustrativa del Frost pero genérica
- Bezos spheres (Unit 4) — débil conexión visual con "two-way doors"
- Goleman WEF (Unit 4) — retrato, OK
- FP taller metal (Unit 5) — la nota de pie reconoce que es "imagen ilustrativa de un taller equivalente" (no español). **Sustituir por una real española**.
- Examen aula (Unit 5) — la misma nota "imagen ilustrativa". **Sustituir**.
- Premios FP (Unit 6) — OK, acto institucional español
- Aula UCM (Unit 6) — OK
- Olivar Montoro (Unit 7) — bella pero conexión con "sector primario" justa
- Coworking Madrid (Unit 7) — stock
- Oficina empleo Madrid (Unit 7) — OK contextual
- Entrevista trabajo (Unit 9) — stock genérico
- LinkedIn HQ (Unit 9) — irrelevante, edificio Sunnyvale no aporta
- Feria empleo (Unit 9) — OK
- Sunrise hiking (Unit 10) — stock motivacional. **Sustituir por algo menos cliché**.
- Mentoring session (Unit 10) — stock genérico
- Graduación ESI (Unit 10) — OK acto formal

**Total a sustituir Fase 3.1**: ~10-12 imágenes débiles. Concentrar esfuerzo en Units 1, 3, 4, 7, 9 y 10.

### Diagramas: ya hay 4 (3 propios + 1 reusado) — bien para baseline

- `SistemaEducativo.astro` (Unit 5) — pieza estrella
- `BloquesFOPP.astro` (Unit 10) — recapitulación visual
- `CVStructure.astro` (Unit 9) — diferenciador
- `DAFOGrid.astro` (Unit 1, reutilizado de Eco 4ESO) — OK

**Diagramas oportunos para Fase 3.2** (recomendaciones específicas FOPP, priorizadas):
1. **Ocho inteligencias Gardner** (Unit 1) — grid 4×2 con profesiones — alto valor pedagógico
2. **Tres horizontes temporales SMART** (Unit 10) — línea de tiempo con dimensiones — refuerza capstone
3. **Cuatro sesgos cognitivos** (Unit 4) — 2×2 con micro-ejemplos — visualiza tema denso
4. **Cómo se calcula la nota de admisión EBAU** (Unit 6) — fórmula visual con ponderaciones
5. **Tarta sectores económicos España** (Unit 7) — círculo 3/22/67/8 % con leyenda
6. **Tres tipos de capital Bourdieu** (Unit 3) — Venn o tabla — diferenciador sociológico
7. **Método STAR** (Unit 9) — 4 cajas con ejemplo trabajado
8. **Tres técnicas regulación emocional** (Unit 2) — 3 columnas con cuándo aplicar cada una
9. **Ruta para reclamar derecho laboral vulnerado** (Unit 8) — flow vertical empresa → ITSS → Juzgado
10. **Quiz vocacional RIASEC Holland** (Unit 5 o recurso aparte) — ya en plan general Fase 4 como interactivo

**Reusables cross-libro**:
- DAFOGrid (ya reusado)
- SistemaEducativo podría reaparecer en Eco 4ESO Unit 1
- Tarta sectores económicos: idéntica en Eco 4ESO Unit 1 y Eco 1BACH Unit 1 — **diagrama compartido obligatorio**

---

## Backlog priorizado para Fases 1-4

### Fase 1 — Quick wins editoriales (eje A) — sesión 2026-06-01

1. **CRÍTICO**: Resolver inconsistencia SMI Unit 7 vs Unit 8 con cifra oficial 2026 real.
2. **CRÍTICO**: Decidir y aplicar split de propietario Eco 4ESO Unit 8 ↔ FOPP Unit 8.
3. **CRÍTICO**: Revisión legal del caso Kamila Tarriño (Unit 3) — anonimizar si no hay consentimiento documentado.
4. Refresco de TODAS las cifras macro Unit 7 (EPA, sectores, turismo 94 M 2024) a últimos datos disponibles.
5. Marcar como ilustrativos los RealExamples no documentados (Aida, Mario, Lucía, Diego, Pablo, Andrea Solà, Luis).
6. Verificar cifras CV (Ladders 7,4 seg), Karolinska 2023, OCU 80 %, Iyengar mermeladas.
7. Unificar cifras Harvard Grant Study entre Unit 1 (268) y Unit 10 (724 combinado).
8. Eliminar duplicidades cross-units: Haidt (Unit 2→3), Kahneman (Unit 2→4), Schwartz cross-libros.
9. Verificar fechas RD/leyes; añadir referencias precisas BOE.
10. Componente `<RecursosAyuda>` reutilizable con 024/ANAR/016/Esperanza — sustituir Callouts duplicados.

### Fase 2 — Profundización pedagógica (eje B) — sesión 2026-06-29

11. Reading time per unit (calculable automáticamente sobre word count).
12. Glosario 8-12 términos per unit (especial prioridad Units 5-6-8 por densidad terminológica).
13. "Para profundizar" docente per unit (3-5 lecturas/podcasts/vídeos divulgativos accesibles a orientador no economista).
14. 2-3 preguntas reflexión abiertas per unit (Unit 10 ya las tiene de facto en el Steps).
15. SolvedExercises faltantes: Unit 1 (DAFO personal trabajado), Unit 2 (CNV aplicada), Unit 4 (matriz decisión convertida en SolvedExercise), Unit 7 (tres tasas EPA), Unit 8 (un finiquito completo, complementando 8.1).
16. Reducción 30-40 líneas Units 4 y 10 (exceden rango objetivo).

### Fase 3 — Visualidad editorial (eje C) — sesión 2026-07-13

17. Sustitución 10-12 imágenes débiles (ver lista §Imágenes débiles).
18. 8-10 diagramas SVG nuevos (ver lista §Diagramas oportunos).
19. Reusos cross-libro: tarta sectores económicos compartida con Eco 4ESO/1BACH.

### Fase 4 — Interactividad ampliada (eje D) — sesión 2026-08-03

20. Auditoría técnica + refuerzo BuscadorItinerarios (validar matriz pesos, ampliar vías post-LOFP 2023).
21. Auditoría técnica + refuerzo GeneradorCVEuropass (HTML→PDF robusto, MCER, validación).
22. **Quiz vocacional RIASEC Holland 30 preguntas** (en plan general; alto valor FOPP).
23. **Calculadora presupuesto universidad 4 años** (en plan general; alto valor FOPP — matrícula + residencia + transporte + libros, simulando beca MEFP).
24. Plantilla descargable / componente Preact "Mi proyecto de vida" (Unit 10 capstone) con persistencia localStorage.
25. Timeline interactiva Unit 5 itinerarios post-ESO (clicar en cada vía despliega detalle + pasarelas).

---

## Métricas finales del diagnóstico

- **Units analizadas**: 10/10.
- **Líneas MDX revisadas**: 2.976 (frente a 2.500 estimado en el plan — ligero exceso).
- **Diagramas existentes**: 4 (3 propios + 1 reutilizado).
- **Recursos Preact descritos**: 2 (sin auditoría técnica del componente).
- **Cifras flagged a verificar**: ~25-30 (concentradas en Units 6, 7 y 8).
- **Citas a verificar**: ~15-20 (concentradas en RealExamples no documentados).
- **Solapamientos críticos detectados**: 1 (Eco 4ESO Unit 8) + 1 menor (Bourdieu/DAFO cross-units internas).
- **Imágenes a sustituir**: 10-12.
- **Diagramas nuevos recomendados**: 8-10.
- **SolvedExercises faltantes**: 5.
- **Decisión editorial sensible pendiente**: caso Kamila Tarriño (anonimizar o documentar consentimiento).

**Conclusión global**: FOPP 4ESO es un libro **sólido como punto de partida**, con los tres diferenciadores editoriales prometidos (Units 5, 8, 9) cumplidos, tono adecuado para tema sensible y un SolvedExercise estrella (8.1 Marta). Las prioridades absolutas para Fase 1 son: SMI consistente, split con Eco 4ESO Unit 8, revisión legal del caso Kamila, refresco macro Unit 7. Con esas cuatro acciones + Fases 2-4 según plan, el libro queda listo para producción septiembre 2026.
