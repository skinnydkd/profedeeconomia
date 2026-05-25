# Diagnóstico IPE II (ipe2-fp)

> Diagnóstico Fase 0 del plan de mejora 2026 (`docs/plan-mejora-libros-2026.md`). Lectura de las 9 unidades de IPE II (`src/content/asignaturas/ipe2-fp/libro/`).
> Fecha: 2026-05-24 · Autor: sub-agente IPE II (Pau).

## Findings globales

### Tono y consistencia

El tono general es **sólido y diferenciado**: prosa más directa y más orientada a la acción que EDMN 2BACH, con marcada vocación pedagógica de FP (enfoque en la persona que busca su primer empleo o monta un proyecto pequeño, no en la teoría empresarial abstracta). El módulo cumple bien su mandato curricular (RD 659/2023, Anexo V): la marca "IPE II es FP, no Bachillerato" es perceptible en el tono, en los ejemplos y en los SolvedExercises.

Diferencias de densidad por bloque:

- **Unidades 1-3 (inserción laboral)**: narrativas y muy aplicadas. U1 y U2 son las más ricas y las que más dependen de datos de mercado actualizables. U3 (competencias) es la más atemporal y la más sólida.
- **Unidades 4-8 (emprendimiento)**: el núcleo emprendedor del módulo. U4 es introductoria y breve; U5-U8 van ganando densidad conceptual. U8 es la que presenta más riesgo de solapamiento grave.
- **Unidad 9 (capstone)**: bien construida, con SolvedExercise integrador. La tabla "bloques del plan de empresa" es el mejor organizador del módulo.

Una diferencia estructural importante respecto a EDMN: **IPE II no tiene grandes cifras macroeconómicas** (no hay PIB, deuda pública, tipos de interés en serie…) porque el foco es micro y de FP. Esto hace que la carga de cifras desactualizables sea **menor que en EDMN o Eco 1BACH**, aunque las pocas que hay son muy visibles (paro juvenil, datos de mercado laboral, empresas mencionadas con cifras concretas).

### Componentes MDX

| Componente | Unidades que lo usan | Comentario |
|---|---|---|
| `Callout` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. OK. |
| `Curiosity` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. OK. Calidad desigual (ver U7 y U8 infra). |
| `RealExample` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. OK. Algunos ejemplos de emprendimiento a verificar. |
| `KeyTakeaways` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. OK. |
| `Steps` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. Bien usado. |
| `Diagram` (SVG) | 1, 2, 3, 5, 6, 7, 8, 9 | **Falta en U4**. U4 (mentalidad emprendedora) no tiene ningún diagrama propio; el esquema EntreComp merecería uno. |
| `SolvedExercise` | 7, 8, 9 | **Solo 3/9**. Hay oportunidades claras en U1 (calcular semanas de búsqueda según ratio de conversión), U2 (comparar versiones de CV con/sin palabras clave ATS) y U9 ya tiene el capstone. |
| `Bibliography` | 1, 2, 3, 4, 5, 6, 7, 8, 9 | Universal. OK. Algunas ediciones desactualizadas (ver infra). |

### Bibliografía

Calidad razonable pero desigual:

- **U3, U5, U8**: las más sólidas. Citan fuentes primarias correctas (Goleman, Salovey/Mayer, Tuckman, Belbin, Fitzpatrick, Ries, Brown/IDEO, Ley 5/2011).
- **U1, U2**: fuentes muy institucionales (SEPE, INE, EPA, AEPD) y pocas doctrinales. Bien para uso práctico del alumno, pero falta referencia académica de RRHH/selección.
- **U4**: cita Bacigalupo et al. (2016) para EntreComp — correcto, es la fuente oficial. Schumpeter correcto. Falta citar el Manual de Oslo con edición explícita.
- **U7**: la referencia a Kotler & Armstrong es la 13.ª ed. (2017) — **hay 16.ª ed. (2022)**. Actualizar.
- **U9**: Sahlman (1997) HBR 75(4) — correcto. Falta Kawasaki y algún recurso de simulación financiera española (cámaras.es Plan de Empresa — aparece en "Para profundizar" pero no en la bibliografía formal).

**Issues transversales de bibliografía**:
- WEF *Future of Jobs Report* citado en U3 como edición 2023; hay **edición 2025** (publicada enero 2025). Actualizar.
- CareerBuilder/Harris Poll (U2) citada como "2023" pero en el mercado de información de RRHH esta encuesta puede haber cambiado de formato o haberse discontinuado; verificar que sigue siendo la fuente de referencia.

### El gran issue transversal: solapamiento con el bloque emprendedor del proyecto

Este es el hallazgo más importante del diagnóstico y se desarrolla en detalle en el mapa de solapamiento (sección final). En síntesis: **IPE II Unidades 5-9 solapan de forma intensa con EDMN 2BACH Unidades 4-5-6-12 y con Eco 4ESO Unidad 9 y con EEAE/GPE**. La diferenciación existe (enfoque FP aplicado vs. teoría empresarial de Bachillerato) pero no está siempre explicitada en el texto, lo que genera el riesgo de que el alumno o el profesorado perciban el libro como una versión simplificada de EDMN en lugar de como un módulo con identidad propia.

---

## Findings per unit

### Unit 1 — De alumno a candidato: el mercado laboral y los procesos de selección

**Cifras desactualizadas**:

- "*la tasa de paro alta en comparación europea, especialmente concentrada en los menores de 25 años, que históricamente duplica o triplica la tasa general*" → formulación deliberadamente vaga ("históricamente", sin cifra concreta) — esto es positivo editorialmente, pero el bloque de datos debe complementarse con la cifra real EPA más reciente. EPA T4 2025 / Eurostat Q4 2025 son la fuente. La tasa de paro juvenil (<25) en España ronda el 25-27 % en 2024-2025 (frente al 14-15 % de media UE). **Añadir dato con año en un Callout o Curiosity**.
- "*el 60-70 % de los puestos se cubren por mercado oculto*" → cifra muy extendida en el sector de orientación laboral, pero **su origen es difuso**. Se atribuye a distintos estudios sin fuente primaria universal. En el contexto de FP, donde las bolsas de empleo de los centros tienen un peso específico, el porcentaje puede variar. Suavizar a "se estima que más de la mitad de las vacantes…" o citar fuente concreta (Lincoln Quillian & Axinn 2017 o InfoJobs Informe 2024).
- "*Distintos estudios del sector de RRHH estiman que una mayoría de las grandes y medianas empresas usan algún tipo de ATS*" → la Curiosity sobre el ATS usa lenguaje deliberadamente vago ("distintos estudios", "una mayoría"). Es razonable dado que los estudios de uso de ATS varían enormemente según el tamaño de empresa y el país. No urge cambiar, pero si se quiere cuantificar: estudios de Jobscan (2023) y de Greenhouse (2024) dan porcentajes del 75-99 % para empresas con más de 100 empleados en EEUU; en España el dato es más modesto. Añadir restricción geográfica o dejar como está.
- RDL 32/2021 como norma vigente → correcto; la reforma laboral de 2021 sigue en vigor y el contrato indefinido sigue siendo la regla general. No hay cambio legislativo posterior que altere esto a mayo 2026.

**Citas a verificar**:

- RD 659/2023, BOE-A-2023-16889 → correcto, verificado.
- RDL 32/2021 reforma laboral → correcto.
- Bolles, R. N. (2024). *What Color Is Your Parachute?* → correcto; edición 2024 existe.
- Pereda Marín y Berrocal Berrocal (2018) → correcto, editorial CERA. Libro académico, verificable.
- Adecco / Infoempleo (2024). *Informe Infoempleo-Adecco* → correcto, este informe se publica anualmente. Verificar que la edición 2024 está disponible y que los datos mencionados en el texto coinciden con ella.
- **RealExample "Marc"** → caso de ficción elaborado pedagógicamente. El nombre del responsable técnico, la empresa, el sector (Administración de Sistemas Informáticos en Red), la localidad y el desenlace son construcciones típicas de sub-agente. **No es caso real verificable**; debe quedar claro en el texto que es un caso compuesto/ilustrativo. Riesgo bajo porque no se atribuye a empresa real con nombre.

**Errores factuales**:

- Ninguno grave detectado. La distinción mercado abierto/oculto, las fases del proceso de selección (ATS → preselección → pruebas → entrevista → oferta) y el método STAR están bien descritos y son sólidos.

**Inconsistencias internas**:

- El `Diagram` de `MetodoSTAR` aparece **dos veces** en la unidad (líneas 101-103 y 207-209), con el mismo caption. Es un duplicado de componente que debería eliminarse en la primera aparición o diferenciarse.

**Solapamiento**:

- **Método STAR** → también aparece en IPE I (U2, autoconocimiento; y en U3, DAFO personal) según el currículum de nuevas-asignaturas-2026. En IPE II aparece en U1 y U3. **Owner dentro de IPE II: U1** (primera introducción en el contexto de la entrevista por competencias). En U3 debe usarse sin explicar de nuevo la mecánica. Verificar si IPE I lo explica ya — si es así, U1 IPE II debería hacer cross-reference a IPE I en lugar de explicarlo desde cero.
- **Assessment center** → concepto propio de esta unidad, no aparece en otros libros del proyecto. OK, sin solapamiento.

---

### Unit 2 — Tu marca personal: comunicación y presencia digital profesional

**Cifras desactualizadas**:

- "*LinkedIn… más de mil millones de perfiles en el mundo y más de quince millones en España*" → LinkedIn no publica datos de perfiles activos de España de forma oficial y sistemática. La cifra de 15 M para España circula en prensa sectorial (2023-2024) pero no tiene fuente primaria robusta. El número global de 1.000 M sí es cifra oficial de LinkedIn (2023). **Suavizar a "más de un millardo de perfiles en el mundo" y omitir el dato español sin fuente sólida**, o bien citar la fuente sectorial con año explícito.
- "*un perfil con foto adecuada recibe muchas más visitas*" → formulación vaga que evita la cifra concreta. LinkedIn en sus estadísticas internas habla de 14x más vistas (dato de LinkedIn Talent Solutions 2019, reiterado sin actualizar). Si se quiere cuantificar, citar LinkedIn Talent Solutions con el año; si no, mantener la formulación vaga.
- CareerBuilder / Harris Poll (2023). *Social Media Recruitment Survey* → **verificar que esta encuesta existe como publicada en 2023**. CareerBuilder discontinuó o modificó varias de sus encuestas anuales. La edición mencionada en la bibliografía puede no existir bajo ese título exacto. La Curiosity sobre reclutadores buscando online cita "estudios internacionales del sector de selección (entre ellos los informes anuales de la consultora CareerBuilder y de Harris Poll)" sin cifras exactas. Dado que la formulación es vaga, el riesgo editorial es bajo, pero conviene verificar que la cita bibliográfica coincide con una publicación real. Si no, eliminar de la bibliografía formal y mantener solo en el Curiosity como referencia de tendencia general.

**Citas a verificar**:

- Peters, T. (1997). *The Brand Called You*. Fast Company, n.º 10 → **correcto y verificable**. Es el artículo fundacional del personal branding; existe en la hemeroteca de Fast Company.
- RGPD art. 17 (derecho al olvido) → correcto. Reglamento (UE) 2016/679, art. 17, plenamente vigente.
- Comisión Europea (2025). *Plataforma Europass* → formato de cita cuestionable (no es una publicación académica formal). Cambiar a cita institucional: "Comisión Europea. Europass. Recuperado de europass.europa.eu".
- **Frase atribuida a Jeff Bezos** "tu marca personal es lo que dicen de ti cuando sales de la sala" → **cita apócrifa de alta sospecha**. Esta frase circula masivamente en webs de personal branding pero no tiene fuente primaria identificada (libro, entrevista, discurso con fecha y contexto). La atribución más documentada podría ser a Beth Kobliner o a Jeff Bezos de forma muy indirecta. **Recomendación: eliminar la atribución a Bezos o cambiarla a "como suele decirse en el mundo del personal branding"**. Este es el riesgo de cita apócrifa más claro del libro.
- **RealExample "Sara"** → caso de ficción pedagógica. La agencia de publicidad de su ciudad que escribe tras ver el portfolio es un desenlace arquetípico de sub-agente. No se atribuye a empresa real. Riesgo bajo.

**Errores factuales**:

- Ninguno grave. La descripción del derecho al olvido (RGPD art. 17) y el proceso de auditoría de identidad digital son correctos y vigentes.

**Inconsistencias internas**:

- Ninguna detectada.

**Solapamiento**:

- **Identidad digital / huella digital** → también tratada en IPE I (U5: "Aprendizaje autónomo, competencia e identidad digital — PLE, marca personal"). La U2 de IPE II debería hacer cross-reference explícito a IPE I U5 y profundizar solo lo nuevo (el ATS, la optimización del CV, el portfolio de FP) sin repetir la auditoría de huella que ya trabajó IPE I.
- **RGPD / derecho al olvido** → también mencionado en Eco 4ESO (según diagnostico-eco-4eso.md, U5 — consumo digital). **Owner: Eco 4ESO para el marco general del RGPD; IPE II para la aplicación laboral específica (eliminación de contenido perjudicial antes de la búsqueda de empleo)**. La distinción es de ángulo; ambas son válidas si se diferencian.

---

### Unit 3 — Competencias para el empleo: personales, sociales y emocionales

**Cifras desactualizadas**:

- WEF (2023). *Future of Jobs Report 2023* → **hay edición 2025** (enero 2025). Actualizar referencia en bibliografía y en el Callout ("Los grandes informes sobre el futuro del empleo —en particular el *Future of Jobs Report* del Foro Económico Mundial—"). Cambiar "2023" por "2025" y verificar que las competencias listadas siguen siendo las mismas (la edición 2025 mantiene pensamiento analítico, creatividad y resiliencia en el top; sí hay cambios menores en el ranking).
- Belbin, R. M. (1981). *Management Teams* → correcto; el modelo Belbin sigue siendo la referencia canónica. No hay edición más reciente que lo sustituya (hay ediciones del propio libro posteriores, como 2010 Butterworth-Heinemann, que es la más citada; la original es 1981 pero el ISBN más accesible es el de 2010). Actualizar edición a la más reciente disponible.
- Tuckman (1965), Covey (1989), Goleman (1995), Salovey & Mayer (1990) → todos correctos.

**Citas a verificar**:

- "*las empresas contratan por las técnicas y despiden por las transversales*" → frase que circula como cita sin fuente específica. En el texto no se atribuye a nadie —es una afirmación del narrador—. OK sin atribución, pero conviene añadir un refuerzo empírico (el dato de Goleman sobre el 80-90 % de diferenciadores de alto rendimiento que son emocionales, de *Working with Emotional Intelligence* 1998, es la fuente más citada para esto). Actualmente el Curiosity apoya esto narrativamente; bien.
- **Caso "Nadia"** (RealExample) → caso de ficción pedagógica. El laboratorio, el rival con mejor expediente, la entrevistadora y la frase final son construcciones de sub-agente. Arquetípico y bien construido. Sin riesgo de verificación factual porque no se atribuye a empresa ni persona real.

**Errores factuales**:

- "*Daniel Goleman popularizó en 1995, a partir del trabajo previo de Peter Salovey y John Mayer, el concepto de inteligencia emocional*" → correcto. La atribución de la precedencia de Salovey/Mayer (1990) sobre la popularización de Goleman (1995) está bien documentada.
- Fases de Tuckman con "*adjourning*" (5.ª fase) → Tuckman añadió la 5.ª fase en 1977 con Jensen (*Stages of small group development revisited*, Group and Organization Management). El texto las cita todas correctas.

**Inconsistencias internas**:

- Ninguna detectada.

**Solapamiento**:

- **Inteligencia emocional (Goleman)** → también aparece mencionado en FOPP 4ESO (diagnóstico-fopp-4eso.md) y en IPE I (U9, salud psicosocial). **Owner para profundidad**: IPE II U3, que le dedica un bloque completo con los 5 componentes. En FOPP debe ser referencia breve.
- **Matriz de Eisenhower** → también aparece en FOPP 4ESO y posiblemente en IPE I. La gestión del tiempo es transversal; la diferencia debe estar en el contexto (IPE II lo aplica a la agenda de búsqueda de empleo y del proyecto emprendedor; FOPP a la gestión personal del estudiante). Mantener en ambos con ese ángulo diferenciado.
- **Belbin y roles de equipo** → único en el proyecto; sin solapamiento conocido. OK.

---

### Unit 4 — Mentalidad emprendedora e innovación

**Cifras desactualizadas**:

- Manual de Oslo: citado como OCDE/Eurostat (2018), 4.ª ed. → correcto, es la edición vigente a 2026. No hay 5.ª edición publicada.
- EntreComp citado como Bacigalupo et al. (2016) → correcto. La CE publicó una actualización en 2022 (*EntreComp into Action*) que no añade nuevas competencias pero sí marcos de aplicación. Opcionalmente mencionar.

**Citas a verificar**:

- "*Richard Cantillon alrededor de 1730*" → correcto; el *Essai sur la Nature du Commerce en Général* de Cantillon se data ~1730, aunque no se publicó hasta 1755.
- "*Jean-Baptiste Say añadió la idea de que el emprendedor traslada recursos económicos*" → correcto y bien documentado (*Traité d'économie politique*, 1803).
- "*Schumpeter (1942) y la destrucción creadora*" → correcto; la referencia habitual es *Capitalismo, socialismo y democracia* (1942). **Atención: en EDMN 2BACH U1 aparece también Schumpeter como referencia principal**. Ver mapa de solapamiento.
- **RealExample "Post-it / 3M" (Spencer Silver y Art Fry)** → **correcto y verificable**. Silver desarrolló el adhesivo en 1968; Fry lo aplicó en 1974; el lanzamiento comercial fue en 1980. La política "15 % time" de 3M es documentada y real. Es uno de los casos más sólidos del libro en cuanto a factualidad. La única imprecisión potencial: algunas fuentes dan 1974 como cuando Fry "conectó" el adhesivo, pero otras dan 1973. Verificar fecha exacta en historia corporativa de 3M. Riesgo bajo.
- "*Gifford y Elizabeth Pinchot*" (intraemprendimiento) → en el texto se cita a "Gifford Pinchot III" correctamente. La bibliografía cita Pinchot (1985) *Intrapreneuring*. Es correcto. La esposa Elizabeth tuvo un rol posterior; al texto decir "los Pinchot en los años 80" es un matiz menor. Bien.
- **Curiosity "Toyota/kaizen"** → correcto y documentado (Imai, 1986; el sistema andon es verificable en la bibliografía del Sistema de Producción Toyota de Ohno). Sin riesgo de cita apócrifa.

**Errores factuales**:

- Ninguno grave detectado.

**Inconsistencias internas**:

- Ninguna.

**Solapamiento**:

- **Schumpeter y destrucción creadora** → EDMN 2BACH U1 es el owner primario (con más profundidad doctrinal). En IPE II U4 aparece en la Curiosity como contexto histórico breve. OK como referencia corta; puede mantenerse, pero añadir nota al pie: "Para la profundización doctrinal ver EDMN 2BACH U1".
- **Metodologías ágiles (Scrum, Kanban)** → no aparecen en EDMN 2BACH (que usa *lean* en U7 para producción, no Scrum). **Owner para Scrum/Kanban: IPE II U4**. Sin solapamiento grave.
- **kaizen / mejora continua** → EDMN 2BACH U7 trata el lean en profundidad y menciona Toyota. IPE II U4 lo introduce brevemente desde el enfoque del intraemprendimiento. **Owner para lean profundo: EDMN U7**. IPE II U4 como contextualización FP. Añadir cross-reference explícito.
- **Manual de Oslo / tipos de innovación** → único en el proyecto a este nivel de detalle. OK.

---

### Unit 5 — De la idea a la oportunidad

**Cifras desactualizadas**:

- **Caso Dropbox** ("lista de espera pasó de 5.000 a 75.000 personas en una sola noche" en 2007) → el dato es el canónico de Drew Houston citado en su charla TechCrunch Disrupt 2010. Es correcto. **Atención: el mismo caso aparece también en U7 (RealExample) y en EDMN 2BACH U12 (RealExample)**. Ver inconsistencias y solapamiento.
- **Caso Glovo** ("Oscar Pierre lanzó Glovo en Barcelona en 2015 con un sistema mínimo y trabajo manual") → correcto en lo esencial. La versión de Glovo operando "casi a mano" en sus primeras semanas es un dato de entrevistas públicas a Pierre. Sin embargo, no hay fuente citada en el texto (la fuente bibliográfica no incluye este caso). Añadir fuente: entrevistas de Oscar Pierre en El País, Expansión o El Referente (2017-2019). **Además: Glovo aparece ya en EDMN 2BACH U1 (pivote), U2 (transformación SL→SA) y U4 (mencionado en pivote)**. En IPE II U5 aparece ahora también. Ver mapa de solapamiento.

**Citas a verificar**:

- British Design Council (2005), Double Diamond → correcto. **Atención**: EDMN 2BACH U5 menciona que el Design Council publicó en 2019 el "Framework for Innovation" como actualización. IPE II no menciona esta actualización. Coherencia recomendada: ambos libros deberían mencionar la actualización 2019 o ninguno.
- XPLANE (2009), Empathy Map Canvas → correcto.
- Fitzpatrick, R. (2013). *The Mom Test* → correcto.
- Ries, E. (2011). *The Lean Startup* → correcto; la edición española existe.
- Blank, S. (2005). *The Four Steps to the Epiphany* → correcto.
- Osborn, A. F. (1953). *Applied Imagination* → correcto.

**Errores factuales**:

- Ninguno grave detectado.

**Inconsistencias internas**:

- El caso Dropbox en U5 dice que la lista de espera pasó "de 5.000 a 75.000 personas en una sola noche". El mismo caso en U7 dice "en 24 horas". El dato "en una sola noche" y "en 24 horas" son coherentes entre sí; no es contradicción grave. Pero las fuentes de U5 ("el vídeo original de Dropbox (2007)") y U7 ("Charla de Drew Houston en TechCrunch Disrupt 2010") son distintas: el vídeo de Dropbox es de 2007 pero la charla donde Houston narró el salto de la lista de espera es de 2010. Unificar la fuente y el año en ambas unidades.

**Solapamiento**:

- **Doble diamante** → aparece en U5 y también en U8. En ambas con el mismo diagrama `<DoubleDiamond />`. **Owner primario: U5** (primera introducción en contexto de proceso creativo). U8 lo reutiliza en el contexto del design thinking social. Recomendación: en U8 hacer cross-reference explícito a U5 y reducir la explicación.
- **Mapa de empatía** → también en EDMN 2BACH U5 (cita XPLANE 2009). En IPE II U5 aparece como herramienta de campo. La diferencia de nivel es importante: EDMN lo introduce en el contexto del BMC y del estudio de mercado de Bachillerato; IPE II lo presenta como herramienta de trabajo de campo de FP con énfasis operativo. Mantener los dos, con cross-reference desde IPE II hacia EDMN para quien quiera profundizar en la teoría.
- **The Mom Test / entrevistas de cliente** → único en el proyecto con esta profundidad. OK.

---

### Unit 6 — El entorno y el modelo de negocio

**Cifras desactualizadas**:

- No hay cifras macro desactualizables en esta unidad. Los datos del DAFO de ejemplo (cocina a domicilio) son ficticios y pedagógicos.
- **Too Good To Go** (RealExample) → la empresa es real y su modelo está bien descrito. No se dan cifras concretas de "packs salvados" ni de facturación, lo cual es prudente dado que cambian cada año. Sin cifras que actualizar.
- **Patagonia** (Curiosity) → el anuncio "Don't Buy This Jacket" de 2011 y el programa Worn Wear son verificables y correctos. No hay cifras de ventas que actualizar.
- Economía del bien común / Christian Felber (2010) → correcto; edición española Deusto 2012 también correcta.
- Ellen MacArthur Foundation (2013). *Towards the Circular Economy* → correcto.

**Citas a verificar**:

- Osterwalder & Pigneur (2010). *Business Model Generation* → correcto.
- Magretta (2002). *Why Business Models Matter*. HBR 80(5) → correcto.
- Humphrey, A. (2005). *SWOT Analysis for Management Consulting*. SRI Alumni Newsletter → **atribución parcialmente discutida**. Albert Humphrey desarrolló el DAFO en Stanford Research Institute en los años 60-70; el artículo de 2005 en el SRI Newsletter es una fuente secundaria tardía, no el origen del método. La atribución es convencional pero no completamente rigurosa. Suavizar a "popularizado en entornos académicos y empresariales desde los años 60-70; recogido en Humphrey (2005)".

**Errores factuales**:

- Ninguno grave.

**Inconsistencias internas**:

- Ninguna.

**Solapamiento — el más grave de todo el libro**:

- **Business Model Canvas** → EDMN 2BACH U4 es el owner con profundidad doctrinal plena (incluye tesis doctoral de Osterwalder, 9 bloques desarrollados con casos reales, comparativa de modelos). En Eco 4ESO U9 también aparece en versión simplificada. **IPE II U6 es la tercera aparición del BMC en el proyecto**. La diferenciación es razonable (IPE II lo aplica como herramienta del proyecto emprendedor de FP, no como estudio teórico), pero debe ser más explícita: añadir una nota tipo "Si quieres profundizar en la teoría del Canvas, ver EDMN 2BACH Unidad 4, donde está explicado en mayor detalle". Sin esa nota, el profesor de FP puede pensar que el libro copia a EDMN.
- **DAFO** → presente en EDMN 2BACH U3, FOPP 4ESO U1 (DAFO personal) e IPE I U3 (DAFO personal). En IPE II U6 es **DAFO del proyecto emprendedor** — diferente ángulo respecto a DAFO personal de IPE I. Cross-reference desde IPE II U6 a IPE I U3 recomendado: "En IPE I aprendiste a hacer tu propio DAFO personal; aquí aplicamos la misma herramienta al proyecto".
- **CAME** → solo aparece en IPE II U6. Owner claro sin solapamiento.
- **Economía circular** → también en U8 de IPE II (con el mismo diagrama `<EconomiaCircular />`). Dentro del propio libro, duplicado. Ver solapamiento interno.
- **Economía del bien común** → única en el proyecto. Owner: IPE II U6.

---

### Unit 7 — Marketing y validación

**Cifras desactualizadas**:

- **Cifras de Mercadona** (RealExample): "*Mercadona facturó 35.529 M€ con 1.677 tiendas en España en 2023*" → la misma cifra aparece en EDMN 2BACH U6. EDMN 2BACH U6 ya la flaggea como desactualizada (memoria 2024 da 38.811 M€, 1.690 tiendas). **Actualizar a datos 2024 en ambos libros simultáneamente**. La mención de gastos publicitarios "menos del 0,2 % de la facturación" y "media del sector 2,5 %" también aparece en EDMN U6 — ver owner.
- **Curiosity "1 de cada 26"** → la referencia a los estudios TARP para la Casa Blanca (años 70-80) y la cifra "26 insatisfechos por cada quejoso" es un dato muy citado en literatura de atención al cliente, pero su origen exacto es discutido. La versión más citada procede de Goodman (1999) basándose en datos TARP; el texto lo atribuye genéricamente a "estudios de la consultora TARP". Correcto en términos generales; la imprecisión de atribución es la norma en este dato. Mantener tal como está o añadir Goodman (1999) como referencia más específica.
- Kotler & Armstrong (2017), 13.ª ed. → **hay 16.ª ed. (2022)**. Actualizar.

**Citas a verificar**:

- McCarthy, E. J. (1960). *Basic Marketing* → correcto.
- Osterwalder et al. (2014). *Value Proposition Design* → correcto.
- Ries, E. (2011). *The Lean Startup* → correcto.
- Fitzpatrick (2013). *The Mom Test* → correcto.
- **RealExample Dropbox** (U7) → mismo caso que U5 con ligera variación narrativa. Ver inconsistencia de fuente anotada en U5. **Solapamiento interno grave: Dropbox aparece en U5 y U7 de IPE II, y además en EDMN 2BACH U12**. Decisión necesaria: dentro de IPE II, eliminar de U5 o de U7 y mantener solo en una. Recomendación: mantenerlo en U5 (donde se introduce el prototipo) y en U7 convertirlo en una referencia brevísima sin narración completa.

**Errores factuales**:

- Ninguno grave. El SolvedExercise 7.1 (punto muerto del proyecto "Recreo Sano") está bien construido numéricamente y verificado: `MC Plan A = 2,50 − 1,40 = 1,10 €`; `Beneficio = 1,10 × 22 × 20 − 180 = 304 €`; punto muerto `180/1,10/20 = 8,18 desayunos/día ≈ 8,2`. Correcto.

**Inconsistencias internas**:

- **Mercadona**: en U7 se usan cifras 2023 (35.529 M€) mientras que en la misma unidad se dice que las decisiones son para "tu proyecto". Ver también cifra en EDMN U6. **Inconsistencia cross-libro y desactualización**.
- El concepto de **propuesta de valor** aparece ya en U2 (propuesta de valor personal/marca), en U6 (bloque central del Canvas) y aquí en U7 (Value Proposition Canvas). Dentro de IPE II es la tercera aparición. En U7 se profundiza con el Value Proposition Canvas de Osterwalder — eso justifica la repetición. Pero falta añadir la nota "Recuerda que en U6 ya trabajaste la propuesta de valor en el Canvas; aquí la desarrollamos con la herramienta específica de Osterwalder". 

**Solapamiento**:

- **4P / marketing mix** → EDMN 2BACH U6 trata las 4P con mayor profundidad doctrinal (incluyendo 4C, 7P, historia Borden/McCarthy). **Owner profundidad doctrinal: EDMN U6**. IPE II U7 las trata de forma operativa para el proyecto de FP — es la diferenciación correcta. Añadir cross-reference explícito: "En EDMN 2BACH encontrarás la teoría completa del marketing mix con sus variantes (7P, 4C)".
- **Punto muerto** → también en EDMN 2BACH U7 (SolvedExercise 7.2, apalancamiento operativo) y en IPE II U9 (capstone). **Owner del cálculo básico**: ambos libros lo trabajan, pero desde ángulos distintos (EDMN desde la función productiva y la dirección de empresa; IPE II desde la viabilidad del proyecto emprendedor de FP). La coexistencia es legítima. **Dentro de IPE II, U7 introduce el punto muerto y U9 lo integra en el capstone**: coherente.
- **Mercadona** como RealExample → owner decidido en EDMN U6. En IPE II U7 su mención es ilustrativa de la coherencia de las 4P. Reducir a Callout corto o sustituir por un ejemplo de pyme de FP más cercano (una panadería de barrio que practica precio estable, sin publicidad, solo calidad y boca a boca).

---

### Unit 8 — Emprendimiento social y design thinking

**Cifras desactualizadas**:

- **Mondragón** (RealExample): "*más de 90 cooperativas con en torno a 70.000 personas trabajadoras*" → la misma empresa aparece en EDMN 2BACH U2 con cifra de "11.500 M€ y 70.330 personas". En EDMN U2 se flaggea como pendiente de actualización a 2024. **En IPE II U8 solo se dan personas (70.000) sin facturación**, lo cual es más fácil de mantener actualizado. Verificar datos 2024 del informe anual de Mondragón: en 2024 la plantilla roza los 68.000-70.000 (algunos socios se desvincularon); la facturación 2024 está en torno a 11.800-12.200 M€. Actualizar con dato 2024 si disponible.
- **Auara** (RealExample): "*empresa social española fundada en 2016 por Antonio Espinosa de los Monteros. Vende agua mineral en botellas hechas 100 % de plástico reciclado (fue la primera en España en lograrlo) y dedica el 100 % de sus dividendos a financiar proyectos de acceso a agua potable*" → Auara es una empresa real. El modelo descrito (100 % plástico reciclado, 100 % de dividendos a proyectos de agua) es correcto según sus memorias de impacto publicadas. Verificar que el dato "100 % plástico reciclado" sigue siendo actual en 2025 (en 2022 lo anunciaron, en 2023-24 confirmaron). Sin cifras de volumen de ventas o proyectos financiados que actualizar (el texto no las da). **Bien construido.**
- **Triodos Bank, Fiare Banca Ética** → mencionados como ejemplos de banca ética. Ambos operan en España y son verificables. Correcto.
- **Goteo, Verkami, Kickstarter** → plataformas de crowdfunding verificables. Correcto.

**Citas a verificar**:

- Ley 5/2011, de 29 de marzo, de Economía Social → correcto.
- Brown, T. (2008). *Design Thinking*. HBR 86(6) → correcto. El artículo de Tim Brown en HBR existe y es la referencia canónica del design thinking como metodología.
- Yunus, M. (2008). *Un mundo sin pobreza* → correcto; edición española Paidós.
- Naciones Unidas (2015). Resolución A/RES/70/1 → correcto.
- **Curiosity "IDEO y el carrito de la compra"** → el caso del programa *Nightline* de ABC de 1999 es **correcto y verificable**. El vídeo existe disponible online. El detalle de "cinco días" y los hallazgos de la observación (ruedas que giran 90 grados, cestas modulares) están documentados. Es uno de los RealExamples más sólidos facturalmente de todo el libro.
- **"*triple bottom line*: personas, planeta y beneficio"** → atribución habitual a John Elkington (1994). En el texto no se atribuye a nadie — se usa como concepto. Correcto no atribuirlo porque es terminología de uso general.

**Errores factuales**:

- El texto dice "*193 Estados miembros de la ONU*" aprobaron la Agenda 2030 en 2015 → correcto a 2015, pero ONU en 2026 tiene 193 miembros, lo que coincide.
- Los principios de la Ley 5/2011 (art. 4) están bien citados. Verificar que la ley no ha sido modificada en puntos relevantes desde 2011. La LOFP 2022 no modifica los principios de la Ley de Economía Social; sigue vigente.

**Inconsistencias internas**:

- El diagrama `<DoubleDiamond />` aparece en U5 y en U8. En U8 tiene el mismo caption prácticamente, y la descripción es casi idéntica. **Duplicado interno significativo**. En U8 podría sustituirse el diagrama por una referencia al ya visto en U5 ("como vimos en la Unidad 5, el doble diamante…") y eliminarse el componente SVG duplicado.
- El diagrama `<EconomiaCircular />` aparece en U6 y en U8 con el mismo caption ("De la economía lineal… a la economía circular"). **Duplicado interno**. En U8 debería usarse como referencia cruzada a U6, no repetir el diagrama.

**Solapamiento**:

- **Design thinking** → EDMN 2BACH U5 trata el design thinking (doble diamante, mapa de empatía) con profundidad similar pero en contexto de diseño de modelos de negocio de Bachillerato. **La diferenciación de IPE II U8 es el enfoque en el reto social** (emprendimiento social, ODS), no el método en sí. Esto es correcto como estrategia editorial. Añadir cross-reference: "En EDMN 2BACH el design thinking se aplica al diseño de modelos de negocio en general; aquí lo orientamos específicamente a retos sociales".
- **ODS** → también en Eco 4ESO (U8 o U9 según el diagnóstico pendiente), EEAE, GPE, y en U6 de IPE II (sostenibilidad). En IPE II U8 se profundiza con la Agenda 2030 y la relación con el emprendimiento social. Diferenciación por profundidad y ángulo; legítima.
- **Cooperativas / economía social** → EDMN 2BACH U2 trata las formas jurídicas incluyendo cooperativas. **IPE II U8 las trata desde la perspectiva del emprendimiento social y sus principios (Ley 5/2011)**. La diferenciación de ángulo es correcta. Cross-reference recomendado desde IPE II U8: "Para el detalle jurídico de las cooperativas ver IPE II U9 (formas jurídicas)".
- **Mondragón** → owner decidido en EDMN 2BACH U2 (cooperativa + formas jurídicas). En IPE II U8 aparece como ejemplo de economía social a gran escala. La diferencia de ángulo (EDMN: ángulo jurídico-empresarial; IPE II: ángulo económica social y solidaria) permite coexistencia, pero es la quinta aparición de Mondragón en el proyecto (EDMN U2 + IPE II U8; posiblemente en más libros). Valorar reducir a cross-reference breve.

---

### Unit 9 — Viabilidad y puesta en marcha (capstone)

**Cifras desactualizadas**:

- "*desde la Ley 18/2022 «Crea y Crece», basta 1 € (con ciertas reservas obligatorias)*" → correcto. La ley vigente establece capital mínimo de 1 € con la reserva legal del 20 % hasta llegar a 3.000 €. Sigue en vigor.
- "*tarifa reducida de cuota de autónomo 80 €*" en el SolvedExercise 9.1 → **verificar tramo RETA 2025-2026**. La tarifa plana/reducida para nuevos autónomos en 2024-2025 es de 80 €/mes durante el primer año, luego progresiva según base elegida. En 2026 el sistema progresivo de cuotas RETA (según rendimientos netos) está plenamente implantado. La cuota de 80 € puede no ser la vigente para todos los perfiles. **Precisar que es la tarifa reducida del primer año para nuevos autónomos** o actualizar al tramo correcto del sistema progresivo 2025-2026 (cuota mínima: ~200 €/mes para rendimientos bajos; tarifa reducida primer año: 80 €/mes durante 12 meses y prórroga si se cumplen condiciones). El SolvedExercise asume 80 €/mes sin contextualizar si es el primer año o no — **añadir la aclaración**.
- Sistema **CIRCE / PAE** → vigente. Correcto.
- **ENISA** (microcréditos) → correcto y vigente. Verificar que las líneas mencionadas siguen activas en 2026 (ENISA suele renovar sus convocatorias anualmente).

**Citas a verificar**:

- RD 659/2023 → correcto.
- RDL 1/2010 (Ley de Sociedades de Capital, LSC) → correcto. Vigente con modificaciones posteriores (Ley 18/2022 es la más relevante y está citada por separado).
- Ley 18/2022, «Crea y Crece» → correcto.
- Ley 5/2011 → correcto.
- Sahlman (1997). *How to Write a Great Business Plan*. HBR 75(4) → correcto; es la referencia canónica para el plan de empresa.
- Ries (2011) → correcto.
- **RealExample "Glovo"** en U9 → el caso de Glovo aparece por **cuarta vez** en el libro: U5 (validación con MVP manual), U7 (implícitamente en la lógica de pivote), y ahora U9 (viabilidad y financiación). En EDMN 2BACH aparece en U1 (pivote), U2 (transformación SL→SA) y U4. La adquisición por Delivery Hero por 2.300 M€ en 2022 está bien documentada. El énfasis de U9 (pérdidas sostenidas gracias a rondas de inversión) es correcto factualmente. **Pero Glovo tiene una frecuencia de aparición desproporcionada** en el proyecto (EDMN U1 + U2 + U4 + IPE II U5 + U9 = 5 apariciones). Reducir en IPE II a una aparición (U5 o U9, no ambas).

**Errores factuales**:

- El SolvedExercise 9.1 (ReUña) está numéricamente correcto: MC = 18−5 = 13 €; punto muerto = 240/13 = 18,46 ≈ 19 servicios/mes; resultado = (13×120)−240 = 1.320 €/mes. Bien construido y verificado.

**Inconsistencias internas**:

- En U9 se menciona la "tarifa reducida (cuota de autónomo 80 €)" en el SolvedExercise 9.1 sin aclarar el año. En U1 no se menciona la cuota de autónomo. Pero en IPE I U7 (Seguridad Social) deben aparecer los tramos RETA actuales. Si esos datos ya están en IPE I, U9 de IPE II debería referenciar a IPE I y no dar una cifra que puede quedar obsoleta.

**Solapamiento**:

- **Formas jurídicas (autónomo, SL, SA, cooperativa)** → EDMN 2BACH U2 es el owner con mayor profundidad doctrinal y tabla comparativa completa. IPE II U9 las trata desde la perspectiva de la decisión del emprendedor de FP al arrancar. La diferenciación es correcta y la simplificación (árbol de decisión) es adecuada para FP. Añadir cross-reference: "Para el análisis completo de las formas jurídicas, costes de constitución y régimen fiscal ver EDMN 2BACH Unidad 2".
- **Trámites de constitución (Hacienda, RETA, Registro Mercantil, licencias)** → también en IPE I (U6-U7, derechos laborales y Seguridad Social). IPE II U9 los ve desde la perspectiva del emprendedor que crea la empresa; IPE I los ve desde la perspectiva del trabajador que se da de alta. La diferenciación es correcta.
- **Plan de empresa** → EDMN 2BACH U12 es el capstone de Bachillerato con plan de empresa completo (Porter + VAN + TIR + ratios + pitch). **IPE II U9 es el capstone de FP**: más operativo, sin VAN/TIR, centrado en el punto muerto y la viabilidad básica. La diferenciación de nivel es correcta y necesaria.
- **Punto muerto** → ya introducido en U7 de IPE II. En U9 se usa en el ejercicio capstone. Coherencia interna correcta; no es repetición innecesaria sino aplicación progresiva.

---

## Mapa de solapamiento con otros libros del proyecto

Este es el hallazgo más importante de la auditoría. Las unidades 5-9 de IPE II solapan con herramientas y conceptos que aparecen en varios libros del proyecto. El criterio de diferenciación que debe aplicarse es: **IPE II es FP aplicada → el enfoque es el proyecto del alumno concreto, no la teoría empresarial abstracta de Bachillerato**.

| Concepto / herramienta | IPE II (unit) | EDMN 2BACH (unit) | Eco 4ESO (unit) | EEAE / GPE | Decisión de owner |
|---|---|---|---|---|---|
| Business Model Canvas | U6 | U4 (owner doctrinal) | U9 (simplificado) | EEAE/GPE probable | EDMN U4 = dueño de la teoría. IPE II U6 = aplicación FP del BMC al proyecto propio. Añadir cross-ref desde IPE II a EDMN. |
| DAFO (empresarial) | U6 | U3 | — | EEAE probable | EDMN U3 = owner empresarial; IPE II U6 = aplicación al proyecto FP. Cross-ref desde IPE II a EDMN. |
| DAFO (personal) | — (en IPE I U3) | — | — | — | IPE I U3 = owner del DAFO personal. IPE II U6 debe cross-referir a IPE I. |
| CAME | U6 | — | — | — | IPE II U6 = owner único. Sin solapamiento. |
| Doble diamante / DT | U5, U8 | U5 | — | — | EDMN U5 = owner doctrinal. IPE II U5 = aplicación proceso creativo FP. IPE II U8 = design thinking social (ángulo diferente). Eliminar diagrama duplicado en U8. |
| Mapa de empatía | U5 | U5 | — | — | EDMN U5 = owner con más contexto teórico. IPE II U5 = herramienta de campo FP. Cross-ref. |
| Propuesta de valor | U2, U6, U7 | U5, U12 | — | EEAE probable | Owner del concepto global: EDMN U5. IPE II lo aplica en tres contextos distintos (marca personal, Canvas, marketing). Coherente internamente; añadir cross-ref a EDMN para la teoría. |
| Value Proposition Canvas | U7 | U5 (mencionado) | — | — | IPE II U7 lo trabaja como herramienta operativa. EDMN U5 lo menciona en bibliografía. IPE II U7 puede ser owner del VPC operativo sin conflicto. |
| 4P / marketing mix | U7 | U6 (owner doctrinal: historia, 4C, 7P) | — | — | EDMN U6 = owner con la teoría completa. IPE II U7 = aplicación operativa al proyecto FP. Cross-ref desde IPE II a EDMN para profundizar. |
| Punto muerto | U7, U9 | U7 (apalancamiento operativo) | — | — | Ambos trabajan punto muerto desde ángulos distintos (EDMN: función productiva; IPE II: viabilidad emprendedora). Coexistencia legítima. Cross-ref. |
| Emprendimiento social / design thinking social | U8 | — | — | EEAE (probable) | IPE II U8 = owner para FP. Si EEAE tiene también, decidir nivel; FP más aplicado, EEAE más conceptual. |
| ODS | U6, U8 | U3 (CSRD/ESG) | — | EEAE, GPE (probable) | Cada libro los menciona desde su ángulo. Coexistencia legítima si el nivel de profundidad es coherente. |
| Formas jurídicas | U9 | U2 (owner doctrinal) | U1 (empresa simplificada) | — | EDMN U2 = owner de la teoría completa. IPE II U9 = árbol de decisión simplificado para FP. Cross-ref desde IPE II a EDMN. |
| Schumpeter / destrucción creadora | U4 (Curiosity breve) | U1 (owner) | — | — | EDMN U1 = owner. IPE II U4 = referencia histórica breve. OK. |
| kaizen / mejora continua | U4 | U7 (lean owner) | — | — | EDMN U7 = owner lean. IPE II U4 = kaizen como intraemprendimiento. Ángulo diferente; cross-ref recomendado. |
| Metodologías ágiles (Scrum, Kanban) | U4 | — | — | — | IPE II U4 = owner único. Sin solapamiento. |
| Inteligencia emocional (Goleman) | U3 | — | FOPP probable | — | IPE II U3 = owner para FP con los 5 componentes. FOPP = referencia breve. |
| Economía circular | U6, U8 | — | — | — | IPE II U6 = primera introducción. IPE II U8 = reutilización en contexto social. Eliminar diagrama duplicado en U8; usar cross-ref interno. |
| Glovo | U5, U9 | U1, U2, U4 | — | — | Exceso de frecuencia (5+ apariciones en el proyecto). Dentro de IPE II, mantener solo en U5 o solo en U9. En EDMN, owner = U1 (pivote). Reducir apariciones. |
| Dropbox | U5, U7 | U12 | — | — | EDMN U12 = owner (MVP simulado en plan de empresa capstone). IPE II: mantener solo en U5; U7 usar como referencia brevísima. |
| Mondragón | U8 | U2 | — | — | EDMN U2 = owner. IPE II U8 = ángulo economía social. Mantener pero reducir la narración (cross-ref a EDMN). |
| Mercadona | U7 | U6 (owner), U1, U11 | U4 (Eco 1BACH) | — | EDMN U6 = owner definitivo. En IPE II U7 sustituir por pyme de FP o reducir a Callout brevísimo. |

---

## Top 3 problemas

1. **Solapamiento masivo no gestionado en el bloque emprendedor (U5-U9)**: las herramientas centrales del proyecto (BMC, doble diamante, mapa de empatía, propuesta de valor, 4P, formas jurídicas) se explican en IPE II sin cross-references explícitos a EDMN 2BACH, Eco 4ESO ni al propio EEAE/GPE. El riesgo no es de error factual sino de **percepción de plagio o de "libro de segunda fila"** frente a EDMN. La solución es sencilla: añadir una nota editorial sistemática en cada herramienta compartida que diga "en IPE II nos centramos en la aplicación FP de esta herramienta; para la teoría completa ver [libro X, unidad Y]". Esto convierte el solapamiento en un sistema de referencias cruzadas y diferencia claramente el nivel y el enfoque.

2. **Citas apócrifas o sin fuente primaria robusta**: (a) la frase atribuida a Jeff Bezos sobre la marca personal — **eliminar atribución o sustituir**; (b) el dato del 60-70 % de vacantes en el mercado oculto — **añadir fuente concreta o suavizar la cuantificación**; (c) CareerBuilder/Harris Poll (2023) en bibliografía de U2 — **verificar existencia exacta de la publicación**. Estos tres puntos son los de mayor riesgo reputacional del libro.

3. **Diagramas duplicados internamente**: el diagrama `<DoubleDiamond />` aparece en U5 y U8; el diagrama `<EconomiaCircular />` aparece en U6 y U8. En un libro que se lee en secuencia, estos duplicados son percibidos inmediatamente como falta de cuidado editorial. Solución: en U8, sustituir ambos diagramas por cross-references textuales a U5 y U6 respectivamente.

---

## Cifras a actualizar (resumen ejecutivo)

| Cifra | Unidad | Estado | Acción |
|---|---|---|---|
| Tasa paro juvenil <25 años | U1 | No citada explícitamente (formulación vaga) | Añadir cifra EPA/Eurostat con año en Callout |
| 60-70 % mercado oculto | U1 | Sin fuente primaria sólida | Añadir fuente concreta o suavizar |
| LinkedIn +1.000 M perfiles / +15 M España | U2 | El dato España sin fuente robusta | Omitir cifra España o citar fuente sectorial con año |
| WEF Future of Jobs Report | U3 | Edición 2023 citada; hay 2025 | Actualizar a edición 2025 |
| Mondragón 70.000 personas | U8 | Datos 2022-2023; hay memoria 2024 | Actualizar con dato 2024 |
| Mercadona 35.529 M€ / 1.677 tiendas | U7 | Datos 2023; hay memoria 2024 (38.811 M€) | Actualizar a 2024 (coordinado con EDMN U6) |
| Cuota autónomo 80 €/mes (SolvedEx 9.1) | U9 | Tarifa reducida primer año; sin aclarar contexto | Añadir aclaración "primer año, tarifa reducida" y verificar vigencia 2026 |
| Kotler & Armstrong, 13.ª ed. (2017) | U7 | Hay 16.ª ed. (2022) | Actualizar |
| Belbin (1981), edición original | U3 | Hay reimpresiones 2010 (Butterworth-Heinemann) | Actualizar a edición más accesible |

---

## Citas sospechosas / a verificar (resumen ejecutivo)

| Cita | Unidad | Estado | Acción |
|---|---|---|---|
| Frase "tu marca personal es lo que dicen cuando sales" atribuida a Jeff Bezos | U2 | **Apócrifa de alta sospecha** | Eliminar atribución a Bezos o suavizar a "como suele decirse" |
| CareerBuilder/Harris Poll (2023) en bibliografía | U2 | Existencia de la publicación 2023 sin verificar | Verificar publicación exacta; si no existe, eliminar de bibliografía formal |
| 60-70 % vacantes mercado oculto | U1 | Cifra sin fuente primaria clara | Citar fuente (InfoJobs/Adecco informe anual, Quillian & Axinn 2017) o suavizar |
| Humphrey (2005) como origen del DAFO | U6 | Atribución parcialmente discutida | Suavizar: "popularizado desde los años 60-70; recogido en Humphrey (2005)" |
| RealExample "Marc" (U1) y "Sara" (U2) | U1, U2 | Casos de ficción pedagógica (sub-agente) | Añadir nota editorial "caso compuesto ilustrativo" si el formato del libro lo prevé |
| RealExample "Nadia" (U3) | U3 | Caso de ficción pedagógica | Ídem anterior |

---

## Inconsistencias internas (resumen ejecutivo)

| Inconsistencia | Unidades | Acción |
|---|---|---|
| Diagrama `<MetodoSTAR />` duplicado | U1 (aparece 2 veces) | Eliminar primera aparición o diferenciar el caption |
| Diagrama `<DoubleDiamond />` duplicado | U5 y U8 | Eliminar en U8; usar cross-ref textual a U5 |
| Diagrama `<EconomiaCircular />` duplicado | U6 y U8 | Eliminar en U8; usar cross-ref textual a U6 |
| Caso Dropbox con fuentes inconsistentes | U5 ("vídeo 2007") y U7 ("charla 2010") | Unificar fuente en ambas unidades (charla Houston 2010 es la más citada) |
| Glovo: frecuencia excesiva | U5 y U9 (+ EDMN) | Dentro de IPE II, mantener solo en U5 o en U9 |
| Propuesta de valor: 3 apariciones sin cross-ref | U2, U6, U7 | Añadir cross-ref U6→U2 y U7→U6 para que el alumno vea la progresión |
| Cuota autónomo 80 € sin aclarar contexto | U9 SolvedEx 9.1 | Aclarar "tarifa reducida primer año" |
