# Diagnóstico IPE I (`ipe1-fp`)

> Diagnóstico Fase 0 del plan de mejora 2026 (`docs/plan-mejora-libros-2026.md`). Eje A: rigor y actualidad. Lectura de las 9 unidades de IPE I (`src/content/asignaturas/ipe1-fp/libro/`).
> Fecha: 2026-05-24 · Autor: sub-agente auditoría editorial (Pau).
> Marco normativo de referencia: RD 659/2023 Anexo V (IPE I/II), RD-Ley 32/2021 (reforma laboral), RDLeg 8/2015 (LGSS), RDLeg 2/2015 (ET), Ley 31/1995 (PRL), Orden PJC/297/2026 (cotizaciones 2026).

---

## Findings globales

### Tono y consistencia

El tono general es **sólido y adecuado para el público FP**: prosa editorial directa, segunda persona del singular, equilibrio entre rigor jurídico y accesibilidad. Diferencia bien el registro de IPE respecto a la ESO: va con artículos reales, cifras con decimales reales, referencias legales con número BOE. Es el tono correcto para Grado Medio y Superior.

La uniformidad es alta en las unidades 1-5 (bloque de proyecto personal) y notable en las 6-9 (bloque jurídico-preventivo). Hay una diferencia de densidad razonable: las unidades 6-7-8 son las más técnicas y las más largas, lo que corresponde a su contenido.

Una **incoherencia de tono** puntual: la Curiosity de U1 sobre el "Future of Jobs Report" no cita el año de la edición concreta, lo que debilita el dato. Las demás citas de organismos (WEF, OIT, OMS) son suficientemente atribuidas pero a menudo sin año específico.

### Componentes MDX

| Componente | Units que lo usan | Comentario |
|---|---|---|
| `Callout` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |
| `Curiosity` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |
| `RealExample` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |
| `KeyTakeaways` | 4,5,6,7,8,9 | Falta en U1, U2, U3. Las tres primeras units no tienen bloque de síntesis visual. |
| `Steps` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |
| `SolvedExercise` | 4,5,6,7,8,9 | Falta en U1, U2, U3 (bloque proyecto personal). U2 y U3 son candidatas claras. |
| `Bibliography` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |
| `Diagram` (SVG) | 2,3,4,6,7 | Ausente en U1, U5, U8, U9. Lagunas evidentes. |
| `Figure` | 1,2,3,4,5,6,7,8,9 | Universal. OK. |

**Recomendación**: añadir `KeyTakeaways` a U1-U3 y `SolvedExercise` a U2 (inventario de competencias con evidencias) y U3 (DAFO y objetivos SMART aplicados).

### Bibliografía

Calidad **correcta pero desigual**:
- **U8 (PRL)** tiene la bibliografía más sólida: cita todas las normas con enlace BOE exacto, INSST, OMS, RD 1299/2006, RD 773/1997, RD 485/1997. Ejemplar.
- **U6-U7 (contrato/SS)** correctas: ET, RDL 32/2021, LGSS con enlace, Ley Rider. Bien.
- **U1-U5 (empleabilidad/orientación)**: más débiles en bibliografía académica. U2 tiene los clásicos de Holland, Gardner, Deci-Ryan y Schein — bien. U3 incluye la referencia de Matthews (2015) sobre objetivos escritos — correcto pero el estudio original es discutido metodológicamente (solo 267 participantes, sin grupo de control riguroso; ver nota en Findings U3).
- **U9 (psicosocial)**: mezcla bien OMS, INSST, normativa y referencia primaria de Karasek (1979). La referencia de Maslach (1997) es sólida.

**Ausencias bibliográficas transversales**:
- No aparece el **Observatorio Estatal de la Formación Profesional** como fuente complementaria al SEPE.
- U7 no cita el **RD-Ley 13/2022** (nuevo sistema de cotización autónomos por ingresos reales) en la bibliografía, aunque sí lo menciona en el texto. Añadir para coherencia.
- U9: falta citar explícitamente el **método CoPsoQ-istas21** en bibliografía (lo menciona en el texto como referencia del INSST pero no está en el bloque `<Bibliography>`).

### Imágenes (sin acceso al binario)

Valoración por caption y rol pedagógico:
1. **U7 — `seguridad-social-edificio.jpg`** (Badajoz). Caption puramente descriptiva, escaso valor pedagógico. El diagrama de la U7 (TiposContrato, reutilizado) compensa, pero una imagen del flujo de cotización (empresa → TGSS → prestación) sería mucho más útil.
2. **U8 — `senalizacion-seguridad.jpg`** — correcta y bien captionada.
3. **U6 — `oficina-rrhh.png`** — genérica. Considerar sustituir por captura anotada de una nómina real (el diagrama `NominaAnotada` ya hace parte de ese trabajo).
4. **U1 — `office-workspace.jpg`** y **`coworking.jpg`** — decorativas, aceptables para abrir la unit pero de escaso valor cognitivo.

### Diagramas: lagunas prioritarias

1. **U1** — Mapa de factores de empleabilidad (diagrama circular o radial con los 7 factores y su nivel de controlabilidad). La unit los lista en bullets; un visual los haría memorables.
2. **U6** — El componente `NominaAnotada` ya existe (bien). El componente `TiposContrato` también. Ninguna laguna estructural en U6.
3. **U7** — Falta un diagrama de la **acción protectora** (árbol o tabla: contingencia → prestación → % base reguladora → duración). El texto lo cubre en prosa pero sin síntesis visual.
4. **U9** — Falta representar el **modelo demanda-control-apoyo de Karasek** (el cuadrante 2×2 con las cuatro zonas: activo, pasivo, alta tensión, baja tensión). Es la herramienta central de la unit y el SolvedExercise 9.1 la aplica sin apoyo visual.
5. **U3** — El `DAFOGrid` existe. Falta un diagrama del **CAME cruzado** (los cuatro cruces estratégicos con flechas entre casillas del DAFO). Mencionado en texto pero sin visual.

---

## Findings per unit

---

### Unit 1 — El reto de tu empleabilidad

#### Cifras desactualizadas

- "*la media española ronda los seis-siete empleos a lo largo de la carrera*" → afirmación orientativa, no cita fuente ni año. Es una estimación razonable pero conviene atribuirla (Eurostat o SEPE Informe Mercado de Trabajo) o suavizarla a "varios empleos".
- El diagrama `SectoresEconomicos` usa "datos INE, aprox. 2025" — vago. Concretar: INE EPA T4 2025 o la fecha exacta usada al construir el diagrama.
- "*el aprendizaje permanente o aprendizaje a lo largo de la vida, y la Unión Europea lo considera una de las ocho competencias clave para la ciudadanía*" → correcto (Recomendación Consejo UE 2018). Sin embargo el marco europeo fue actualizado en 2022 (Recomendación sobre educación para la sostenibilidad). Verificar si el número de competencias clave se mantiene en 8 o ha variado.
- El `RealExample` de los técnicos que pivotaron a la eólica no cita una fuente concreta: "*informes de empleo verde, SEPE y Fundación Biodiversidad*". Suficientemente atribuido para un ejemplo ilustrativo, pero sería más sólido con un informe SEPE con año.
- La Curiosity sobre "la mitad de las competencias técnicas caducan en 5 años" cita "los informes Future of Jobs del Foro Económico Mundial" sin año. La edición 2025 (enero 2025) da datos más actualizados. **Citar edición 2025 con año**.

#### Citas legales a verificar

- RD 659/2023, BOE-A-2023-16889 → correcto.
- LO 3/2022, BOE-A-2022-5139 → correcto.
- Recomendación Consejo UE (2018) sobre competencias clave → correcto, pero verificar si hay actualización 2022 relevante para la cita concreta.

#### Citas apócrifas/sospechosas

- Ninguna cita atribuida a persona concreta en esta unit. La Curiosity sobre WEF y el 50 % de competencias caducando es una cifra ampliamente repetida en divulgación pero con distintas versiones (algunos informes dicen "se transformarán" más que "caducarán"). **Suavizar o citar la edición exacta del WEF**.

#### Errores factuales

- Ninguno detectado. La explicación de empleabilidad interna/externa es conceptualmente correcta (Hillage & Pollard, 1998 — no citado explícitamente, podría añadirse).

#### Inconsistencias internas

- Ninguna con otras unidades del libro.

#### Solapamiento cross-libros

- El concepto de **empleabilidad** se introduce aquí como punto de partida de IPE I. En **FOPP 4ESO U1** también se trabaja empleabilidad, autoconocimiento y actitud ante el trabajo. La diferencia de nivel es correcta: FOPP es ESO (orientación básica), IPE I es FP (módulo con derecho laboral real). No hay duplicación problemática, pero conviene una cross-reference explícita en FOPP U1 del tipo "en FP desarrollarás esto con mayor profundidad".
- El **factor de digitalización/automatización** del mercado laboral aparece aquí y en **Eco 1BACH U8** (ciclos y desempleo tecnológico). Ángulos distintos (orientación laboral personal vs macroeconomía), compatible.

---

### Unit 2 — Conócete: intereses, competencias y motivaciones

#### Cifras desactualizadas

- No hay cifras macroeconómicas. Los datos son conceptuales (modelos Holland, Gardner, Deci-Ryan, Schein). Sin cifras desactualizables críticas.
- La Curiosity del "efecto de sobrejustificación" cita el experimento de Deci y Lepper (años 70) correctamente como investigación clásica. OK.

#### Citas legales a verificar

- RD 659/2023, Anexo V → correcto.

#### Citas apócrifas/sospechosas

- **Holland (1997)** — 3.ª ed. correcta. La 1.ª ed. es de 1959; esta es la referencia estándar. OK.
- **Gardner (1983, ed. conmemorativa 2011)** — correcto. Pero la teoría tiene 9 inteligencias (la naturalista se añadió en 1995; la inteligencia "existencial" se propuso después pero no la incluye oficialmente). El texto lista 8 correctamente (sin la existencial), lo que es canónico. OK.
- **Schein (1990)** — correcto. Hay edición revisada (2006, Jossey-Bass), podrían actualizarse las referencias a la más reciente.
- **Deci y Ryan (1985)** — correcto. La teoría de la autodeterminación ha tenido actualizaciones hasta 2017. Considerar añadir Ryan & Deci (2017) *Self-Determination Theory* (Guilford Press) como referencia más completa.

#### Errores factuales

- El texto afirma que la tipología RIASEC "es la base de la mayoría de los test de orientación que existen, incluidos los del SEPE y los servicios de empleo europeos" → correcto en líneas generales. El SEPE usa modelos propios pero compatibles con Holland. OK.
- La lista de 8 inteligencias de Gardner no incluye la "existencial/trascendental" que Gardner exploró después. La unit lista 8, que es la versión más citada. No es un error, es la versión canónica estándar. OK.

#### Inconsistencias internas

- La teoría de la autodeterminación (Deci-Ryan) se menciona aquí (U2) y el modelo de Karasek en U9 incluye el "apoyo social" como tercer eje. Ambos son compatibles. No hay inconsistencia.

#### Solapamiento cross-libros

- **Autoconocimiento profesional / RIASEC** — aparece aquí (IPE I U2) y en **FOPP 4ESO U1** (autoconocimiento e intereses). La diferencia de nivel es correcta: FOPP es orientación ESO (más básica), IPE es FP (inventario de competencias con evidencias, ancla de carrera, motivación intrínseca/extrínseca con rigor psicológico). **No duplicar**: confirmar que FOPP U1 no entra en la teoría de la autodeterminación de Deci-Ryan (eso es propio de IPE).
- **Gardner inteligencias múltiples** — también en **FOPP 4ESO U1** probablemente. Verificar: si aparece, mantener en ambos (ESO introduce el concepto, FP lo aplica al diagnóstico competencial).

---

### Unit 3 — Tu DAFO personal y tu proyecto profesional

#### Cifras desactualizadas

- No hay cifras macroeconómicas. El contenido es metodológico. Sin datos desactualizables.
- La Curiosity sobre Gail Matthews y los objetivos escritos: "*en un estudio sobre fijación de objetivos observó que las personas que escribían sus metas las cumplían en una proporción notablemente mayor*" → **ALERTA**: el estudio de Matthews (2015) de la Dominican University of California circula mucho en divulgación pero su metodología es débil (no tiene grupo de control real comparable, la muestra es pequeña y el diseño no cumple estándares de publicación peer-reviewed). No está indexado en bases de datos académicas. **Recomendación**: suavizar la afirmación o eliminar la atribución a Matthews y decir "la investigación en psicología de objetivos sugiere" (lo que está más respaldado es la implementación de intenciones de Gollwitzer, 1999). Citar la fuente débil en un libro de FP que se usa en producción es un riesgo de rigor.

#### Citas legales a verificar

- RD 659/2023, Anexo V (RA4) → correcto.
- LO 3/2022 → correcto.
- Humphrey (2005) sobre el origen del DAFO → El DAFO/SWOT se atribuye comúnmente a un proyecto de Stanford Research Institute (SRI) de los años 60-70, con Albert Humphrey como figura central. La referencia al "SRI Alumni Newsletter 2005" es la cita más citada del propio Humphrey, pero fuentes historiográficas recientes cuestionan la paternidad única de Humphrey. La cita es la más usada; aceptable mientras se reconozca que es "origen histórico debatido". **Suavizar**: "popularizado por Albert Humphrey (SRI, años 60-70; Humphrey 2005)".

#### Citas apócrifas/sospechosas

- **Gail Matthews (2015)** — estudio de rigor débil. Ver nota arriba.
- **Doran (1981)** sobre SMART → correcto. Es la fuente primaria del acrónimo, publicada en *Management Review*. OK.

#### Errores factuales

- Ninguno detectado. La explicación del CAME es correcta (las cuatro estrategias cruzadas del DAFO). Las estrategias "ofensiva, defensiva, de reorientación y de supervivencia" corresponden a la nomenclatura estándar. OK.

#### Inconsistencias internas

- El DAFO se presenta aquí (U3 IPE I) como herramienta de **proyecto personal/empleabilidad** y en **IPE II U6** como herramienta de **proyecto emprendedor** (DAFO/CAME empresarial). Correcto: son aplicaciones del mismo método en contextos distintos. El libro advierte en U3 que el CAME reaparecerá en IPE II. OK.

#### Solapamiento cross-libros

- **DAFO personal** — también en **FOPP 4ESO U1** (DAFO personal de orientación vital). El diagnóstico de EDMN ya resolvió el solapamiento DAFO como: EDMN U3 (DAFO empresarial) + FOPP U1 (DAFO personal). Aquí IPE I U3 añade un tercer uso (DAFO personal de empleabilidad). Verificar que FOPP U1 y IPE I U3 tienen distinta profundidad: FOPP más sencillo (ESO), IPE I con análisis CAME completo y objetivos SMART (nivel FP). No duplicar el análisis CAME en FOPP si ya está aquí.
- **Objetivos SMART** — posiblemente también en **FOPP U3 o U9** (búsqueda de empleo). Si aparece, IPE I debe ser el owner del desarrollo completo (con Doran citado); FOPP puede mencionar brevemente.

---

### Unit 4 — El sector productivo y tu perfil

#### Cifras desactualizadas

- "*España es una economía fuertemente terciarizada: alrededor del 76 % del empleo está en servicios*" → **cifra a verificar**. INE EPA T4 2025 da el terciario aproximadamente en 77-78 % del total de ocupados (los datos varían según el año y el criterio de agregación). La cifra del 76 % es razonable pero conviene citar el año: "según EPA T4 2025, alrededor del 77 %".
- El diagrama `SectoresEconomicos` indica "(datos INE, aprox. 2025)" — **mismo problema de vaguedad que U1**. Concretar trimestre.
- "*El sector secundario tiene escasez crónica de profesionales cualificados*" → correcto; la *Cámara de Comercio de España (2024)* está citada en bibliografía. OK.
- El SolvedExercise 4.1 usa "cifras ilustrativas de un año concreto" para el Observatorio de Ocupaciones → razonable para un ejercicio metodológico; no hay error de dato real porque es explícitamente ficticio.
- "*La FP de Grado Medio da acceso al subgrupo C1 y el Grado Superior al subgrupo B*" → **VERIFICAR**. Según el EBEP (RDLeg 5/2015), el subgrupo C1 requiere Bachillerato o Técnico (GM de FP), y el subgrupo A2 requiere Diplomatura o Grado Superior de FP equivalente. El subgrupo **B** fue creado por la LOFP (LO 3/2022) específicamente para los títulos de Grado Superior de FP, pero su implantación efectiva en los distintos cuerpos de funcionarios es gradual. **Error potencial**: el texto dice "Grado Superior → subgrupo B", que es técnicamente correcto según la LOFP, pero en la práctica muchas administraciones aún clasifican a los GS en el A2 transitoriamente. Añadir nota de cautela: "según la LOFP 3/2022, el Grado Superior da acceso al subgrupo B; la implantación en cada administración puede variar; consultar convocatoria específica".

#### Citas legales a verificar

- EBEP, RDLeg 5/2015 → correcto con enlace BOE. OK.
- LO 3/2022 (LOFP) → correcto. OK.
- RD 659/2023 → correcto. OK.
- OCDE (2025), *OECD Skills Outlook 2025* → cita correcta para fuente prospectiva. OK.

#### Citas apócrifas/sospechosas

- Ninguna.

#### Errores factuales

- **El acceso de GS al subgrupo B vs A2**: ver nota en Cifras. El texto no es incorrecto en sentido estricto (la LOFP lo establece así), pero requiere la nota de cautela práctica.
- La afirmación "*Grado Superior al subgrupo B*" no especifica que el RD de equivalencias entre títulos FP y funciones públicas está en proceso de actualización. Añadir prudencia.

#### Inconsistencias internas

- Ninguna.

#### Solapamiento cross-libros

- **Sector productivo / ocupaciones / CNO / SEPE** — única en IPE I. No hay solapamiento con FOPP (que trabaja búsqueda de empleo a nivel ESO sin profundidad en CNO) ni con Eco 4ESO. OK.
- **Función pública / oposición / bolsa de trabajo** — también en **FOPP 4ESO U8 o U9** posiblemente (derechos laborales básicos). Verificar: IPE I debe ser el owner del desarrollo completo (EBEP, subgrupos, proceso de bolsa); FOPP puede mencionar la función pública como opción sin profundizar.

---

### Unit 5 — Aprendizaje autónomo e identidad digital

#### Cifras desactualizadas

- "*alrededor de siete de cada diez empresas consultan los perfiles digitales de los candidatos*" → La Curiosity atribuye esto a "estudios de plataformas como Adecco e Infojobs". **ALERTA**: los informes de Adecco e Infojobs son estudios de parte (marketing de sus plataformas) y los porcentajes varían mucho entre ediciones. La cifra del "70 %" circula sin estudio académico sólido detrás. **Suavizar**: "distintos informes de sector coinciden en que la mayoría de los reclutadores revisa los perfiles digitales antes de la entrevista" o citar el estudio exacto con año.
- La referencia a **DigComp 2.2** es la versión publicada en 2022 por la Comisión Europea (JRC). Es la última publicada hasta la fecha de este diagnóstico. OK.

#### Citas legales a verificar

- RGPD (2016/679) → correcto.
- LOPDGDD (LO 3/2018, art. derecho al olvido y rectificación) → correcto.
- LO 3/2022 (LOFP) → correcto.
- RD 659/2023 → correcto.
- DigComp 2.2 (Comisión Europea, JRC, 2022) → correcto.

#### Citas apócrifas/sospechosas

- "Adecco e Infojobs (2024)" en bibliografía → fuentes de parte con metodología no auditada. Ver nota arriba.

#### Errores factuales

- Ninguno detectado. La distinción identidad digital / huella digital / marca personal es correcta y alineada con la terminología estándar del sector.

#### Inconsistencias internas

- Ninguna.

#### Solapamiento cross-libros

- **Identidad digital / marca personal** — también en **FOPP 4ESO U9** (kit de búsqueda de empleo, incluye CV digital y perfil profesional). Verificar profundidad: FOPP debe quedarse en el CV Europass y la netiqueta básica; IPE I cubre PLE, DigComp, RGPD y la gestión estratégica de la huella. La diferencia de nivel es correcta si se mantiene esa distribución.
- **Huella digital / RGPD / derecho al olvido** — también en **Eco 4ESO U5** (economía digital y privacidad). Ángulos distintos (Eco 4ESO → economía de los datos como bien; IPE I → empleabilidad y reputación). Compatible.

---

### Unit 6 — El contrato de trabajo y tus derechos

Esta es la unidad con mayor densidad de datos legales y económicos verificables. Auditada con mayor detalle.

#### Cifras desactualizadas

- **SMI 2026**: el texto dice "*1.221 € brutos mensuales en 14 pagas (17.094 € anuales), fijado por el Real Decreto 126/2026*" → **CORRECTO**. Confirmado: RD 126/2026, BOE-A-2026-3815, en vigor desde 1 de enero de 2026. El SMI es exactamente 1.221 € mensuales en 14 pagas = 17.094 € anuales. Sin error.
- **Cotización Seguridad Social trabajador ≈ 6,35 %**: el texto usa este valor en el SolvedExercise 6.1 y en el texto explicativo. **VERIFICAR COMPOSICIÓN**:
  - Contingencias comunes: 4,70 % (trabajador) — correcto (Orden PJC/297/2026).
  - Desempleo contrato indefinido: 1,55 % (trabajador) — correcto.
  - Formación profesional: 0,10 % (trabajador) — correcto.
  - FOGASA: 0 % (trabajador, íntegro a cargo empresa) — correcto.
  - MEI 2026: **0,15 %** (trabajador) — **ERROR EN LA UNIT**: el texto de U6 dice "más el nuevo MEI" de forma genérica pero NO incluye el MEI en el porcentaje del 6,35 %. La suma correcta para 2026 es: 4,70 + 1,55 + 0,10 + **0,15** = **6,50 %**, no 6,35 %. La diferencia es de 0,15 puntos, que en la nómina de Aitana (1.800 €) supone 2,70 € mensuales de error (6,50 % × 1.800 = 117 € vs 6,35 % × 1.800 = 114,30 €). **Es un error factual cuantitativo que afecta al SolvedExercise 6.1**.
  - **Conclusión**: el tipo correcto para 2026 que el trabajador ve descontado en la nómina es **6,50 %** (incluyendo MEI 0,15 %), no 6,35 %. Corregir en el texto y en el SolvedExercise 6.1.
- **SolvedExercise 6.1 — nómina de Aitana**: enunciado dice "cotización SS a su cargo es del 6,35 %" → debe ser **6,50 %** para 2026. Recalculado:
  - Cotización SS: 1.800 × 0,065 = **117,00 €** (vs 114,30 € del libro).
  - IRPF: 1.800 × 0,09 = 162,00 € (correcto).
  - Total deducciones: 117,00 + 162,00 = **279,00 €** (vs 276,30 € del libro).
  - Neto: 1.800 − 279,00 = **1.521,00 €** (vs 1.523,70 € del libro).
  - Diferencia: 2,70 € al mes de error. Pequeña pero en un libro de FP sobre derecho laboral, la exactitud es crítica.
- **Cotización empresa**: el texto dice "alrededor del 30 %" en la Curiosity y en el KeyTakeaways. Para 2026:
  - Contingencias comunes empresa: 23,60 %.
  - Desempleo empresa (indefinido): 5,50 %.
  - Formación profesional empresa: 0,60 %.
  - FOGASA empresa: 0,20 %.
  - MEI empresa: 0,75 %.
  - **Total empresa: 30,65 %**.
  - El texto dice "cerca del 30 %" → ligeramente bajo. Actualizar a "alrededor del 30-31 %". La Curiosity de U7 dice "30-32 %" → más preciso, pero inconsistente con U6 que dice "30 %". **Inconsistencia entre U6 y U7** que debe resolverse: usar "30-31 %" en ambas (que corresponde a los tipos 2026).
- **Periodo de prueba máximo**: el texto dice "orientativamente, hasta 6 meses para técnicos titulados y 2 meses en el resto". El ET (art. 14.1) fija: para técnicos, no podrá exceder de 6 meses; para los demás trabajadores, de 2 meses. En empresas de menos de 25 trabajadores, el periodo de prueba para trabajadores no técnicos no podrá exceder de 3 meses. **El texto simplifica omitiendo el caso especial de empresas pequeñas**. Añadir esta matización.

#### Citas legales a verificar

- ET, RDLeg 2/2015, art. 1.1 (notas relación laboral) → correcto.
- ET, art. 14 (periodo de prueba) → correcto. Ver matización arriba.
- ET, art. 15 (contrato temporal con causa tasada, máx. 6 meses, ampliable a 12 por convenio) → **VERIFICAR**: tras RD-Ley 32/2021, el contrato por circunstancias de la producción tiene un máximo de 6 meses ampliable a 12 **solo si el convenio sectorial de ámbito estatal o, en su defecto, el convenio sectorial de ámbito inferior lo establece**. El texto lo dice correctamente: "máximo 6 meses, ampliable a 12 por convenio". OK.
- RD-Ley 32/2021 → correcto, BOE citado.
- RD-Ley 9/2021, Ley Rider → correcto.
- RD 126/2026, SMI → correcto.
- REGCON → correcto.
- TGSS bases y tipos → referencia general correcta; ver nota sobre el tipo exacto (6,50 % vs 6,35 %).

#### Citas apócrifas/sospechosas

- Ninguna. Las frases de ejemplo en los `RealExample` son ilustrativas, no atribuidas a persona real.

#### **Errores factuales**

1. **ERROR CRÍTICO**: el tipo de cotización del trabajador se da como **6,35 %** cuando en 2026 es **6,50 %** (incluye MEI 0,15 %). Afecta al texto explicativo, al `Callout` de deducciones, al SolvedExercise 6.1 y al KeyTakeaways. **Corregir con prioridad Fase 1**.
2. La descripción de la cotización por desempleo en U7 menciona "7,05 % en contrato indefinido" → correcto para 2026 (5,50 empresa + 1,55 trabajador = 7,05 %). OK.

#### Inconsistencias internas

- **U6 dice "cotización empresa ≈ 30 %"** / **U7 dice "30-32 %"** → inconsistencia menor pero real. El valor correcto para 2026 es ~30,65 %. Usar "alrededor del 30-31 %" en ambas units.

#### Solapamiento cross-libros

- **Nómina / cotizaciones / IRPF** — también en **Eco 4ESO U8** (calculadora de nómina ESO) y en **FOPP 4ESO U8** (derechos laborales básicos). Según la decisión del diagnóstico-libros-2026, Eco 4ESO U8 mantiene el detalle de cotizaciones y cálculo, y FOPP se queda con drets exigibles + PRL. IPE I U6 es de nivel FP: debe ser el más riguroso (tipos exactos, cálculo del SolvedExercise). **Confirmar** que los tipos de cotización son consistentes entre IPE I U6 y Eco 4ESO U8 una vez corregido el MEI.
- **Tipos de contrato / reforma 2021** — también en **FOPP 4ESO U8**. FOPP debe ser más básico (indefinido/temporal/formativo como concepto) e IPE I más técnico (con causas tasadas del art. 15 ET, diferencia entre circunstancias de producción y sustitución). La distribución actual parece correcta.

---

### Unit 7 — La Seguridad Social y las vicisitudes del contrato

#### Cifras desactualizadas

- **Tipos de cotización en la tabla (U7)**:
  - Contingencias comunes: 28,30 % (23,60 empresa + 4,70 trabajador) → **CORRECTO** para 2026 (Orden PJC/297/2026).
  - Desempleo indefinido: ~7,05 % (5,50 empresa + 1,55 trabajador) → **CORRECTO** para 2026.
  - Formación profesional: 0,70 % (0,60 empresa + 0,10 trabajador) → **CORRECTO** para 2026.
  - FOGASA: 0,20 % (íntegro empresa) → **CORRECTO** para 2026.
  - Accidentes de trabajo: "tipo variable según peligrosidad, íntegro empresa" → correcto.
  - **MEI**: el texto dice "en 2025 alcanza el 0,80 % (0,67 % empresa, 0,13 % trabajador) y sube gradualmente hasta 2050" → **ERROR**: en **2026** el MEI es **0,90 %** (0,75 % empresa + 0,15 % trabajador), no el 0,80 % de 2025. El texto usa los valores de 2025 para lo que será 2026 en producción. **Corregir urgente**.
  - El texto nombra correctamente que el MEI "sube gradualmente" pero da el valor 2025. Para un libro en producción en 2026, la cifra correcta es: **MEI 2026 = 0,90 % (empresa 0,75 % + trabajador 0,15 %)**.
- **RETA nuevo sistema (RD-Ley 13/2022)**: el texto dice "Desde 2023 cotizan según sus rendimientos reales" → correcto. El sistema es progresivo (2023-2025 es el periodo de adaptación; desde 2025 ya está plenamente implantado). La afirmación es correcta pero podría precisarse: "desde 2023 (implantación completa en 2025)".
- **Prestación por desempleo**: "el 70 % de la base reguladora durante los primeros 180 días y el 60 % a partir del día 181" → **CORRECTO**. Los topes se actualizan anualmente con los PGE; el texto los menciona sin dar cifras exactas de tope (correcto, porque cambian). OK.
- **Duración paro**: "por cada 360 días cotizados se obtienen 120 días de paro, hasta un máximo de 720 días (24 meses)" → **CORRECTO**. OK.
- **Mínimo cotizado para paro**: "al menos 360 días (12 meses) en los 6 años anteriores" → **CORRECTO**. OK.
- **Incapacidad temporal por enfermedad común**: "no cobras nada los 3 primeros días; del día 4 al 20 cobras el 60 %; del día 21 en adelante, el 75 %" → **CORRECTO** (LGSS art. 173). OK.
- **IT accidente de trabajo**: "75 % desde el día siguiente a la baja" → **CORRECTO** (LGSS art. 173.1). OK.
- **Jubilación, edad**: "tiende a los 67 años, salvo carreras de cotización muy largas que permiten jubilarse a los 65" → **CORRECTO** (la edad ordinaria es 67 años para quien no acredite 38 años y 6 meses cotizados; 65 años para quien sí lo acredite). OK para 2026.
- **Mínimo 15 años cotizados para jubilación**: **CORRECTO** (LGSS art. 205). OK.
- **Despido objetivo: 20 días/año, tope 12 mensualidades** → **CORRECTO** (ET art. 53). OK.
- **Despido improcedente: 33 días/año, tope 24 mensualidades** → **CORRECTO** (ET art. 56.1, tras reforma 2012). OK.
- El SolvedExercise 7.1 calcula indemnización de Hugo: 5 años × 33 días/año × (24.000/365) = 10.848,75 € → **CORRECTO**. Cálculo bien planteado y verificado.

#### Citas legales a verificar

- LGSS, RDLeg 8/2015 → correcto, con enlace BOE.
- ET arts. 45, 49, 52, 53, 54, 56 → todos correctamente atribuidos.
- RD-Ley 32/2021 → correcto.
- RD-Ley 13/2022 (RETA por ingresos reales) → correcto. **Añadir a bibliografía** (mencionado en texto pero falta en el bloque `<Bibliography>`).
- Constitución, art. 41 (Seguridad Social) → correcto.
- El RealExample sobre "despido exprés" menciona "Reforma laboral de 2012 (Ley 3/2012)" → **VERIFICAR**: la reforma de 2012 fue el **Real Decreto-Ley 3/2012, de 10 de febrero**, de medidas urgentes para la reforma del mercado laboral, posteriormente tramitado como **Ley 3/2012, de 6 de julio**. El texto dice "Reforma laboral de 2012 (Ley 3/2012)" — aceptable pero impreciso (la primera norma era un RDL; añadir "Ley 3/2012, de 6 de julio" para exactitud).

#### Citas apócrifas/sospechosas

- Ninguna.

#### **Errores factuales**

1. **ERROR CRÍTICO**: el MEI citado como "0,80 % en 2025 (empresa 0,67 % + trabajador 0,13 %)" es el valor de **2025**, no de **2026**. Para 2026: **MEI = 0,90 % (empresa 0,75 % + trabajador 0,15 %)**. Corregir con prioridad Fase 1.
2. **Inconsistencia cotización empresa U6 vs U7**: ver nota en U6.

#### Inconsistencias internas

- **U6** dice cotización empresa "≈ 30 %" y **U7** dice "30-32 %". El valor correcto para 2026 (sin accidentes, que varía por actividad) es ~30,65 %. Unificar a "alrededor del 30-31 %" en ambas units.
- El diagrama reutilizado de U7 (`TiposContrato`) es el mismo que U6. Reutilizar es eficiente pero conviene que la leyenda en U7 indique que es a efectos de indemnizaciones, no de forma idéntica al diagrama de U6 (que explica modalidades). Considerar diagrama propio para U7 centrado en la escala de indemnizaciones.

#### Solapamiento cross-libros

- **Seguridad Social / prestaciones** — también en **FOPP 4ESO U8** (derechos laborales básicos: paro, baja). El nivel de FOPP debe ser mucho más básico (concepto de cotizar + qué da derecho al paro). IPE I U7 es el owner del desarrollo completo con porcentajes exactos, periodo de carencia, cálculo de indemnizaciones. Confirmar que FOPP no entra en los porcentajes de la IT ni en el cálculo de despido.

---

### Unit 8 — Prevención de Riesgos Laborales (nivel básico)

#### Cifras desactualizadas

- Límite de ruido 80 dB(A) como nivel de acción → **CORRECTO** (RD 286/2006, Anexo II, nivel de exposición diaria que obliga a actuar). OK.
- Pirámide de Bird (1969): "1,7 millones de accidentes" → dato correcto según el estudio original de Frank Bird (1966-1969, publicado 1969). OK.
- Comité de Seguridad y Salud "obligatorio en empresas de 50 o más" → **CORRECTO** (LPRL art. 38.2). OK.
- "Empresario puede asumir personalmente hasta 10-25 trabajadores" → **VERIFICAR**: el RD 39/1997 establece que el empresario puede asumir personalmente la prevención en empresas de hasta **10 trabajadores** (no peligrosas) o hasta **25 trabajadores** cuando la empresa cuente con un único centro de trabajo y no desarrolle actividades peligrosas. El texto dice "10-25" — técnicamente correcto pero ambiguo. Precisar: "hasta 10 trabajadores en general, o hasta 25 en empresa de un único centro no peligroso".

#### Citas legales a verificar

- Ley 31/1995 LPRL → correcto, con enlace BOE.
- RD 39/1997, Reglamento Servicios de Prevención → correcto.
- RD 773/1997 (EPI) → correcto.
- RD 485/1997 (señalización) → correcto.
- RD 1299/2006 (cuadro enfermedades profesionales) → correcto.
- RD 286/2006 (ruido) → citado en SolvedExercise 8.1, correcto.
- LGSS arts. 156-157 (accidente/enfermedad profesional) → correcto.
- RD 659/2023 → correcto.

**Todos los artículos de la LPRL citados en la unidad son correctos**:
- Art. 4 (definiciones: prevención, condición de trabajo, daños) → correcto.
- Art. 14 (derecho y deber, coste no recae en trabajador) → correcto.
- Art. 15 (nueve principios) → **ALERTA DE ORDEN**: el texto enumera los nueve principios como: evitar, evaluar, combatir en origen, adaptar el trabajo a la persona, tener en cuenta la técnica, sustituir lo peligroso, planificar, anteponer colectiva a individual, dar instrucciones. Este orden es coherente con el art. 15 LPRL, que los enumera en letras a-i. OK.
- Art. 16 (evaluación de riesgos) → correcto.
- Art. 18 (información, consulta) → correcto.
- Art. 20 (emergencias) → correcto.
- Art. 29 (obligaciones trabajador, usar EPI) → correcto.
- Arts. 33-40 (participación, delegados de prevención, Comité de SS) → correcto.

#### Citas apócrifas/sospechosas

- "*Maniobra de Heimdal*" → **ERROR TIPOGRÁFICO O FACTUAL**: la maniobra se llama **maniobra de Heimlich** (o compresiones abdominales), no "Heimdal". Heimdal es un personaje de la mitología nórdica (y de la franquicia Marvel). La maniobra la creó Henry Heimlich en 1974. **Corregir urgente**.
- La pirámide de Bird como "Frank Bird (1969)" → correcto. El estudio original fue realizado entre 1966 y 1969 para la Insurance Company of North America. OK.

#### **Errores factuales**

1. **ERROR TIPOGRÁFICO/CONCEPTUAL**: "maniobra de Heimdal" debe ser **maniobra de Heimlich**. Un error de este tipo en un libro de primeros auxilios de FP es especialmente sensible. **Corregir con prioridad máxima Fase 1**.
2. El texto dice que el marcado CE de los EPI los hace conformes. OK en concepto. Pero desde el **Reglamento UE 2016/425** (que derogó la anterior Directiva 89/686/CEE), los EPI se rigen por este Reglamento, no por la Directiva. El RD 773/1997 está parcialmente desactualizado en este punto. Para nivel básico de FP, mencionar solo que deben llevar "marcado CE conforme al Reglamento UE 2016/425" es más preciso que remitir al RD de 1997 como referencia principal de conformidad del EPI. No es un error grave pero sí una imprecisión técnica a actualizar.

#### Inconsistencias internas

- Ninguna con otras unidades.

#### Solapamiento cross-libros

- **PRL nivel básico** — esta unidad cubre el programa del Anexo IV del RD 39/1997. Es **único de IPE I** en el ecosistema de libros del rebranding. No hay solapamiento con ningún otro libro (FOPP, Eco, EDMN). Los libros de secundaria solo mencionan PRL de pasada en el contexto de condiciones de trabajo; IPE I es el owner exclusivo del desarrollo completo. OK.

---

### Unit 9 — Salud psicosocial y bienestar en el trabajo

#### Cifras desactualizadas

- La **OMS incluyó el burnout en la CIE-11 en 2019** → **CORRECTO**. La CIE-11 entró en vigor el 1 de enero de 2022; el burnout figura como "QD85 Burnout" en el bloque de "Problemas asociados con el empleo o con el desempleo". La matización del texto ("no como una enfermedad médica general, sino como algo ligado específicamente al contexto del trabajo") es **correcta y relevante**. OK.
- El **tecnoestrés** fue acuñado por "Craig Brod en 1984" → correcto (Technostress: The Human Cost of the Computer Revolution, 1984). OK.
- **Marisa Salanova y equipo WANT de la Universitat Jaume I** → referencia correcta y española, bien incluida.
- "El derecho a la desconexión digital, artículo 88 de la LOPDGDD (LO 3/2018)" → **CORRECTO**. OK.
- "Artículo 18 de la Ley 10/2021 de trabajo a distancia" → **CORRECTO**. OK.
- "Francia fue pionera con la ley El Khomri, 2016, obligó a empresas de más de 50 trabajadores" → **VERIFICAR**: la Loi El Khomri (Loi n° 2016-1088) estableció la obligación de negociar el derecho a la desconexión, **no de forma unilateral, sino como materia de negociación en empresas de más de 50 empleados**. El texto dice correctamente "obligó a negociar". OK.
- **Karasek (1979)** — cita correcta. La referencia en bibliografía es: *"Job demands, job decision latitude, and mental strain", Administrative Science Quarterly, 24(2)* → correcto. OK.
- **Maslach & Leiter (1997), *The Truth About Burnout*, Jossey-Bass** → correcto. OK.

#### Citas legales a verificar

- LPRL Ley 31/1995, art. 16 (evaluación de riesgos psicosociales) → correcto.
- LO 3/2018, art. 88 (desconexión digital) → correcto.
- Ley 10/2021, art. 18 (desconexión en teletrabajo) → correcto.
- LO 3/2007 (acoso por razón de sexo) → el texto dice "Ley Orgánica 3/2007". **Verificar**: la LO 3/2007 es la Ley para la Igualdad Efectiva de Mujeres y Hombres, que en su art. 7 define el acoso sexual y el acoso por razón de sexo. La cita es correcta. OK.
- RD 659/2023 → correcto.

#### Citas apócrifas/sospechosas

- La referencia de Heinz Leymann como desarrollador del concepto de **mobbing** es correcta. Leymann (1990, 1996) en Journal of Occupational Medicine y en la monografía *Mobbing* (1993). No cita el año exacto en el texto — añadir "(Leymann, 1996)" al mencionar el concepto.
- Herbert Freudenberger (1974) como primer descriptor del burnout → correcto (*"Staff burn-out", Journal of Social Issues, 30(1)*). OK.

#### Errores factuales

- "el tecnoestrés tiene tres caras: tecnoansiedad, tecnofatiga, tecnoadicción" → **CORRECTO** según la clasificación del equipo de Salanova (WANT). OK.
- "fatiga por videollamada popularizada con el teletrabajo" → concepto correcto; Bailenson (2021, Stanford) publicó el primer estudio empírico. No se cita pero es una afirmación bien documentada. OK.

#### Inconsistencias internas

- Ninguna.

#### Solapamiento cross-libros

- **Salud psicosocial / burnout / acoso laboral** — en **FOPP 4ESO U3 o U9** puede haber alguna mención (gestión emocional, bienestar). Verificar: IPE I U9 es el owner del desarrollo PRL de los riesgos psicosociales (con Karasek, evaluación, CoPsoQ-istas21, desconexión digital legal). FOPP puede hablar del bienestar emocional en clave personal pero sin entrar en la normativa de PRL ni en el mobbing como riesgo laboral con protocolo. Mantener la distinción nivel.
- **Estrés / gestión emocional** — en **Eco 4ESO** posiblemente en U8 o U9 (finanzas personales o economía del hogar). Verificar: si Eco 4ESO toca el bienestar personal, deben ser ángulos distintos (económico vs laboral).

---

## Resumen de prioridades para Fase 1

### Errores críticos (corregir antes de cualquier nueva sesión)

| Prioridad | Error | Unit | Descripción |
|---|---|---|---|
| 🔴 1 | **Maniobra de Heimlich** escrita "Heimdal" | U8 | Error tipográfico en procedimiento médico de primeros auxilios |
| 🔴 2 | **MEI 2026 = 0,90 %** (no 0,80 % de 2025) | U7 | Tipo MEI desactualizado (usa valor 2025 en libro en producción 2026) |
| 🔴 3 | **Cotización trabajador 2026 = 6,50 %** (no 6,35 %) | U6, U6 SolvedExercise 6.1 | El 6,35 % no incluye MEI 0,15 %; nómina de Aitana recalcular |

### Errores importantes (Fase 1, sesión de sweep)

| Prioridad | Issue | Unit | Descripción |
|---|---|---|---|
| 🟠 4 | **Cotización empresa**: unificar "≈30-31 %" | U6 y U7 | U6 dice "30 %" y U7 dice "30-32 %"; valor 2026 es ~30,65 % |
| 🟠 5 | **Subgrupo B FP Grado Superior**: añadir nota de cautela | U4 | La LOFP 3/2022 establece subgrupo B pero la implantación en administraciones es gradual |
| 🟠 6 | **Matthews (2015)** sobre objetivos escritos | U3 | Estudio de rigor débil; suavizar atribución o sustituir por Gollwitzer (1999) |
| 🟠 7 | **Adecco/Infojobs "70 % consultan perfiles digitales"** | U5 | Fuente de parte sin auditoría independiente; suavizar cuantificación |
| 🟠 8 | **WEF Future of Jobs**: añadir edición 2025 con año | U1 | La Curiosity cita WEF sin año; la edición 2025 es la más reciente disponible |

### Mejoras de precisión (Fase 1, barrido complementario)

| Issue | Unit | Descripción |
|---|---|---|
| Periodo de prueba empresas < 25 trabajadores: hasta 3 meses para no técnicos | U6 | El texto omite la excepción de empresas pequeñas del art. 14 ET |
| RETA "implantación completa en 2025" | U7 | Precisar la fase de implantación del sistema de ingresos reales |
| Leymann: añadir año "(Leymann, 1996)" al citar el mobbing | U9 | Cita correcta pero sin año en el texto |
| RD-Ley 13/2022 en bibliografía de U7 | U7 | Citado en texto pero falta en el bloque `<Bibliography>` |
| Sectors diagram "(datos INE, aprox. 2025)": concretar trimestre | U1, U4 | Vaguedad en la atribución temporal del diagrama de sectores |
| Reglamento UE 2016/425 en EPI (actualiza directiva 89/686/CEE) | U8 | El RD 773/1997 sigue siendo válido para muchas cosas pero el marco europeo de EPI es ahora el Reglamento 2016/425 |

---

## Solapamientos cross-libros: tabla de decisiones

| Concepto | IPE I | Otros libros | Decisión recomendada |
|---|---|---|---|
| **Empleabilidad / actitud profesional** | U1 (desarrollada, FP nivel) | FOPP U1 (ESO básico) | IPE I owner completo; FOPP queda en orientación vital básica sin teoría de la empleabilidad |
| **Autoconocimiento / RIASEC / Gardner** | U2 (con rigor psicológico) | FOPP U1 (ESO simplificado) | Ambos lo trabajan; IPE más profundo (ancla de carrera, Deci-Ryan). Confirmar que FOPP no duplica la autodeterminación |
| **DAFO personal + CAME** | U3 (completo con CAME y SMART) | FOPP U1 (DAFO personal básico), EDMN U3 (DAFO empresarial) | IPE I owner del CAME desarrollado; FOPP queda con DAFO solo; EDMN mantiene DAFO empresarial |
| **Función pública / oposición / EBEP** | U4 (completo) | FOPP posiblemente U9 | IPE I owner; FOPP menciona solo como opción sin profundidad |
| **Identidad digital / marca personal** | U5 (con RGPD, DigComp, PLE) | FOPP U9 (CV digital básico), Eco 4ESO U5 (economía datos) | IPE I owner del desarrollo profesional; FOPP queda en CV + netiqueta; Eco 4ESO en privacidad económica |
| **Nómina / cotizaciones / IRPF** | U6 (cálculo real FP nivel) | Eco 4ESO U8 (calculadora ESO), FOPP U8 (derechos) | IPE I owner del cálculo técnico; Eco 4ESO complementa con IRPF personal; FOPP queda en lectura básica de nómina |
| **Tipos de contrato / reforma 2021** | U6 (con causas legales exactas) | FOPP U8 (conceptos básicos) | IPE I owner jurídico; FOPP en modalidades a nivel ESO |
| **Seguridad Social / prestaciones** | U7 (porcentajes exactos, cálculo) | FOPP U8 (paro/baja básico) | IPE I owner del cálculo y requisitos; FOPP solo concepto |
| **PRL nivel básico** | U8 (completo, Anexo IV RD 39/1997) | Ninguno | IPE I owner exclusivo; es el único libro del rebranding que cubre el nivel básico PRL |
| **Riesgos psicosociales / burnout / desconexión** | U9 (con Karasek, CoPsoQ, normativa) | FOPP (bienestar emocional personal) | IPE I owner del marco legal y preventivo; FOPP en gestión emocional personal sin diagnóstico organizativo |
