# Nuevas asignaturas — Taller de Economía 3ESO, IPE I, IPE II (2026)

> Acordado con Pau el 2026-05-20 tras investigación curricular a fondo (3 agentes de investigación). Crear 3 libros nuevos con el mismo pipeline que los 4 existentes (libro + diapositivas + actividades + tests + recursos).

## Decisiones de Pau

- **IPE I y II**: versión de **Grado Medio y Superior** (RD 659/2023, Anexo V). Son los módulos que **sustituyen a la FOL** en la nueva FP. Nombre oficial: "Itinerario **Personal** para la Empleabilidad" (corregido de "Profesional").
- **Taller de Economía 3ESO**: base curricular **genérica/neutra** (la optativa común de iniciación a la actividad económica y emprendedora de 3.º ESO en la mayoría de CCAA), NO la concreción valenciana específica. Se conserva el nombre amable "Taller de Economía".

## Marco normativo (verificado)

- **Taller de Economía 3ESO**: optativa LOMLOE de 3.º ESO (RD 217/2022 marco ESO; las optativas las concretan las CCAA — versión neutra de iniciación económica y emprendedora). Nota de introducción: aclarar que es optativa y que cada CCAA fija su concreción.
- **IPE I / IPE II**: LOFP (LO 3/2022) + **RD 659/2023, Anexo V** (currículo básico de los módulos comunes de Grado Medio/Superior). Sustituyen a FOL. Implantación 2024-25. Especialidad docente: FOL.

## Estructura de los libros (unidades)

### Taller de Economía 3ESO — `taller-eco-3eso` (9 unidades)
Primer contacto, vivencial, neutro entre CCAA. Más básico que Economía y Emprendimiento 4ESO (evitar solapar: aquí nivel introductorio/cotidiano).
1. ¿Qué es la economía? — escasez, elección, coste de oportunidad, necesidades.
2. Los agentes económicos y el flujo circular — familias, empresas, Estado.
3. Consumo inteligente y responsable — derechos del consumidor, publicidad, consumo sostenible.
4. El dinero y los medios de pago — dinero, banca básica, pagos digitales, fraude.
5. Mi presupuesto: ingresos, gastos y ahorro — finanzas personales básicas.
6. Las empresas y el emprendimiento — tipos de empresa, economía social, idea de negocio.
7. El mundo del trabajo — empleo, derechos laborales básicos, primer CV.
8. El sector público y los impuestos — servicios públicos, Estado del bienestar, fiscalidad básica.
9. Economía sostenible y tu proyecto — ODS, economía circular, mini-proyecto emprendedor/de servicio (capstone).

### IPE I — `ipe1-fp` (9 unidades, RA1-RA6 del Anexo V)
1. El reto de tu empleabilidad — qué es la empleabilidad y cómo se construye. (RA5)
2. Conócete: intereses, competencias y motivaciones — autoconocimiento profesional. (RA4)
3. Tu DAFO personal y tu proyecto profesional — DAFO, objetivos, hoja de ruta. (RA4)
4. El sector productivo y tu perfil — mercado laboral, ocupaciones del título. (RA2)
5. Aprendizaje autónomo, competencia e identidad digital — PLE, marca personal. (RA5)
6. El contrato de trabajo y tus derechos — relación laboral, modalidades, convenio, nómina. (RA3)
7. Seguridad Social y vicisitudes del contrato — prestaciones, suspensión/extinción. (RA3)
8. Prevención de riesgos laborales (nivel básico) — cultura preventiva, gestión, primeros auxilios. (RA1)
9. Salud psicosocial y bienestar en el trabajo — estrés, burnout, desconexión digital. (RA6)

### IPE II — `ipe2-fp` (9 unidades, RA1-RA5 del Anexo V; continuación, foco emprendimiento)
1. De alumno a candidato: el mercado laboral hoy — procesos de selección actuales. (RA1)
2. Tu marca personal — construcción y comunicación de marca. (RA1)
3. Competencias para el empleo — sociales, emocionales, equipo, gestión del tiempo. (RA2)
4. Mentalidad emprendedora e innovación — habilidades emprendedoras, intraemprendimiento, metodologías ágiles. (RA3)
5. De la idea a la oportunidad — detección de problemas, proceso creativo, validación con clientes. (RA4)
6. El entorno y el modelo de negocio — DAFO/CAME, Economía Circular y del Bien Común, modelo de negocio. (RA4)
7. Marketing y validación — marketing operativo, prototipo, atención al cliente. (RA4)
8. Emprendimiento social y design thinking — innovación social, liderazgo ético, ODS. (RA5)
9. Viabilidad y puesta en marcha — plan económico-financiero, formas jurídicas, trámites. (RA5)

## Convenciones (idénticas a los 4 libros existentes)

- MDX en `src/content/asignaturas/{slug}/libro/{NN}-{slug-kebab}.mdx`.
- Frontmatter: `asignatura`, `unidad`, `title`, `lema`, `estado: publicado`, `objetivos[]`, `conceptos_clave[]`, `duracion`, `bloque`, `sabers[]`.
- Componentes disponibles: `Callout`, `Curiosity`, `RealExample`, `Bibliography`, `KeyTakeaways`, `Steps`, `SolvedExercise`, `Diagram` + diagramas SVG, `Figure`.
- Estructura pedagógica (Fase 2): header con duración/objetivos, glosario (8-12 términos), "Para profundizar" (3-5 lecturas), 2-3 preguntas de reflexión, KeyTakeaways.
- Actividades (8-10/libro): `.md` con `tipo` (caso/ejercicio/debate/dinamica/proyecto), `unidad_relacionada`, `materiales`, `agrupacion`.
- Tests (8-10/libro): `.md` con `preguntas[]` (enunciado, opciones, correcta, explicacion).
- Recursos: reutilizar calculadoras/simuladores existentes donde encaje (RIASEC y GeneradorCV para IPE; Presupuesto503020 para Taller; etc.).

## Solapamientos a vigilar (no duplicar)
- Taller 3ESO vs Economía y Emprendimiento 4ESO: 3ESO más básico y cotidiano.
- IPE I/II vs FOPP 4ESO (ESO, orientación básica) y vs FOL: IPE es FP con derecho laboral, PRL, Seguridad Social y nómina reales.
- IPE II emprendimiento vs EDMN 2BACH: IPE II nivel FP aplicado/proyecto, no teoría empresarial de Bachillerato.

## Estado de ejecución
- [x] Investigación curricular (3 agentes)
- [x] Corrección de `asignaturas.ts` (nombres "Personal", niveles GM/GS)
- [x] Libros (MDX) de los 3 (9+9+9 unidades)
- [x] Actividades (9+9+9) + tests (9+9+9) + recursos (2+3+2)
- [x] Flip `estado` a `publicado` + build (297 págs) + PDFs de libro + cuadernos + diapositivas (Marp)
- [ ] **Imágenes (follow-up)**: los 3 libros aún no llevan fotos (`<Figure>`), igual que los 4 originales se hicieron primero sin imágenes y se añadieron después (PR #24). Pendiente para una tanda posterior.
- [ ] Revisión visual de Pau (contenido, calculadoras reutilizadas, PDFs).
