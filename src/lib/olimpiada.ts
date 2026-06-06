/**
 * Data and helpers for the «Olimpiada de Economía» prep section (Bachillerato).
 * Thematic blocks reuse the generic familia-grouping (shared with Dinámicas etc.).
 * Color tokens reuse global.css — no new colors.
 */
import type { Familia } from './familia-grouping';
export { groupByFamilia } from './familia-grouping';
export type { Familia, FamiliaGroup, HasFamilia } from './familia-grouping';

export const BLOQUES: Familia[] = [
  { slug: 'fpp',                 label: 'FPP y coste de oportunidad',        intro: 'Frontera de posibilidades, eficiencia y coste de oportunidad.', colorVar: '--color-taller3' },
  { slug: 'oferta-demanda',      label: 'Oferta, demanda y elasticidad',     intro: 'Equilibrio de mercado, desplazamientos y elasticidades.',       colorVar: '--color-eco1' },
  { slug: 'punto-muerto',        label: 'Producción, costes y punto muerto', intro: 'Costes, umbral de rentabilidad y la cuenta de resultados.',     colorVar: '--color-edmn' },
  { slug: 'politica-economica',  label: 'Política monetaria y fiscal',       intro: 'Objetivos, instrumentos y efectos sobre precios, producción y empleo.', colorVar: '--color-ipe2' },
  { slug: 'mercado-trabajo',     label: 'Mercado de trabajo y desempleo',    intro: 'EPA, tasas, tipos de paro y el funcionamiento del mercado laboral.', colorVar: '--color-fopp' },
  { slug: 'contabilidad',        label: 'Contabilidad y rentabilidad',       intro: 'Balance, resultado, fondo de maniobra y ratios de rentabilidad.', colorVar: '--color-gpe' },
  { slug: 'estructuras-mercado', label: 'Estructuras de mercado',            intro: 'Competencia perfecta, monopolio, oligopolio y competencia monopolística.', colorVar: '--color-terra' },
  { slug: 'macro-magnitudes',    label: 'Macromagnitudes: PIB, inflación y ciclo', intro: 'Medición del PIB, IPC e inflación, crecimiento y ciclo económico.', colorVar: '--color-ipe1' },
  { slug: 'sistema-financiero',  label: 'Dinero y sistema financiero',       intro: 'Funciones del dinero, creación bancaria, bancos centrales y tipos de interés.', colorVar: '--color-eeae' },
  { slug: 'comercio-internacional', label: 'Comercio internacional',         intro: 'Ventaja comparativa, balanza de pagos, tipos de cambio y proteccionismo.', colorVar: '--color-mustard' },
  { slug: 'empresa',             label: 'La empresa y sus áreas',            intro: 'Formas jurídicas, crecimiento, organización y áreas funcionales.', colorVar: '--color-eco4' },
  { slug: 'fallos-mercado',      label: 'Fallos de mercado e intervención',  intro: 'Externalidades, bienes públicos, información asimétrica y poder de mercado.', colorVar: '--color-fopp' },
];

export const BLOQUE_SLUGS = BLOQUES.map((b) => b.slug) as [string, ...string[]];
const BY_SLUG = new Map(BLOQUES.map((b) => [b.slug, b]));
export function bloqueMeta(slug: string): Familia {
  const b = BY_SLUG.get(slug);
  if (!b) throw new Error(`unknown bloque: ${slug}`);
  return b;
}

// Ámbitos territoriales en que se agrupan los exámenes. La C. Valenciana va
// primera (es nuestro contexto) y la fase nacional la segunda; el resto, por
// orden alfabético. El formato del examen VARÍA según la comunidad.
export interface Ambito { slug: string; label: string; intro: string; }
export const AMBITOS: Ambito[] = [
  { slug: 'cv',            label: 'Comunitat Valenciana', intro: 'Fase local de la C. Valenciana (UA/UV/UPV/UJI/UMH). Es el formato que describe la guía: test + ejercicio + comentario, 2 horas.' },
  { slug: 'nacional',      label: 'Fase nacional',        intro: 'Olimpiada Española de Economía: la final estatal a la que pasan los finalistas de cada fase local.' },
  { slug: 'madrid',        label: 'Comunidad de Madrid',  intro: 'Fase local de Madrid (UAM, URJC, UCM, UAH, UC3M). Publicados con soluciones.' },
  { slug: 'andalucia',     label: 'Andalucía',            intro: 'Fase local de Andalucía (Universidad de Sevilla).' },
  { slug: 'castilla-leon', label: 'Castilla y León',      intro: 'Fase local de Castilla y León (Universidad de Valladolid).' },
  { slug: 'pais-vasco',    label: 'País Vasco',           intro: 'Fase local del País Vasco (UPV/EHU).' },
  { slug: 'navarra',       label: 'Navarra',              intro: 'Fase local de Navarra (Universidad Pública de Navarra).' },
  { slug: 'extremadura',   label: 'Extremadura',          intro: 'Fase local de Extremadura (Universidad de Extremadura).' },
  { slug: 'galicia',       label: 'Galicia',              intro: 'Fase local de Galicia (Universidade de Santiago de Compostela).' },
  { slug: 'asturias',      label: 'Asturias',             intro: 'Fase local de Asturias (Universidad de Oviedo).' },
  { slug: 'practica',      label: 'Material de práctica', intro: 'Material de práctica propio para entrenar sin presión de convocatoria.' },
];
export const AMBITO_SLUGS = AMBITOS.map((a) => a.slug);

export interface Simulacro { slug: string; title: string; convocatoria: string; anio: number; pdf: string; oficial: boolean; ambito: string; }
// Exámenes oficiales recientes (en general los 3 últimos por ámbito), descargados
// de las webs oficiales de las universidades organizadoras. El formato varía por
// comunidad; casi todas usan ya un test teórico + ejercicio práctico + comentario.
export const SIMULACROS: Simulacro[] = [
  // Comunitat Valenciana (UA)
  { slug: 'cv-2025', title: 'Examen 2025', convocatoria: 'Universidad de Alicante', anio: 2025, pdf: '/olimpiada/examen-cv-2025.pdf', oficial: true, ambito: 'cv' },
  { slug: 'cv-2024', title: 'Examen 2024', convocatoria: 'Universidad de Alicante', anio: 2024, pdf: '/olimpiada/examen-cv-2024.pdf', oficial: true, ambito: 'cv' },
  { slug: 'cv-2023', title: 'Examen 2023', convocatoria: 'Universidad de Alicante', anio: 2023, pdf: '/olimpiada/examen-cv-2023.pdf', oficial: true, ambito: 'cv' },
  // Fase nacional (Olimpiada Española de Economía)
  { slug: 'nac-2025', title: 'Examen 2025', convocatoria: 'Olimpiada Española de Economía', anio: 2025, pdf: '/olimpiada/examen-nacional-2025.pdf', oficial: true, ambito: 'nacional' },
  { slug: 'nac-2024', title: 'Examen 2024 · Logroño', convocatoria: 'Olimpiada Española de Economía', anio: 2024, pdf: '/olimpiada/examen-nacional-2024.pdf', oficial: true, ambito: 'nacional' },
  { slug: 'nac-2023', title: 'Examen 2023 · Sevilla', convocatoria: 'Olimpiada Española de Economía', anio: 2023, pdf: '/olimpiada/examen-nacional-2023.pdf', oficial: true, ambito: 'nacional' },
  // Comunidad de Madrid (UCM, con soluciones)
  { slug: 'mad-2026', title: 'Examen 2026 (con soluciones)', convocatoria: 'Olimpiada de Madrid · XVII', anio: 2026, pdf: '/olimpiada/examen-madrid-2026.pdf', oficial: true, ambito: 'madrid' },
  { slug: 'mad-2025', title: 'Examen 2025 (con soluciones)', convocatoria: 'Olimpiada de Madrid · XVI', anio: 2025, pdf: '/olimpiada/examen-madrid-2025.pdf', oficial: true, ambito: 'madrid' },
  { slug: 'mad-2024', title: 'Examen 2024 (con soluciones)', convocatoria: 'Olimpiada de Madrid · XV', anio: 2024, pdf: '/olimpiada/examen-madrid-2024.pdf', oficial: true, ambito: 'madrid' },
  // Andalucía (Universidad de Sevilla)
  { slug: 'and-2025', title: 'Examen 2025', convocatoria: 'Universidad de Sevilla', anio: 2025, pdf: '/olimpiada/examen-andalucia-2025.pdf', oficial: true, ambito: 'andalucia' },
  { slug: 'and-2024', title: 'Examen 2024', convocatoria: 'Universidad de Sevilla', anio: 2024, pdf: '/olimpiada/examen-andalucia-2024.pdf', oficial: true, ambito: 'andalucia' },
  { slug: 'and-2023', title: 'Examen 2023', convocatoria: 'Universidad de Sevilla', anio: 2023, pdf: '/olimpiada/examen-andalucia-2023.pdf', oficial: true, ambito: 'andalucia' },
  // Castilla y León (Universidad de Valladolid)
  { slug: 'cyl-2025', title: 'Examen 2025', convocatoria: 'Universidad de Valladolid', anio: 2025, pdf: '/olimpiada/examen-castilla-leon-2025.pdf', oficial: true, ambito: 'castilla-leon' },
  { slug: 'cyl-2024', title: 'Examen 2024', convocatoria: 'Universidad de Valladolid', anio: 2024, pdf: '/olimpiada/examen-castilla-leon-2024.pdf', oficial: true, ambito: 'castilla-leon' },
  { slug: 'cyl-2021', title: 'Examen 2021', convocatoria: 'Universidad de Valladolid', anio: 2021, pdf: '/olimpiada/examen-castilla-leon-2021.pdf', oficial: true, ambito: 'castilla-leon' },
  // País Vasco (UPV/EHU)
  { slug: 'pv-2023', title: 'Examen 2023', convocatoria: 'UPV/EHU', anio: 2023, pdf: '/olimpiada/examen-pais-vasco-2023.pdf', oficial: true, ambito: 'pais-vasco' },
  { slug: 'pv-2022', title: 'Examen 2022', convocatoria: 'UPV/EHU', anio: 2022, pdf: '/olimpiada/examen-pais-vasco-2022.pdf', oficial: true, ambito: 'pais-vasco' },
  { slug: 'pv-2021', title: 'Examen 2021', convocatoria: 'UPV/EHU', anio: 2021, pdf: '/olimpiada/examen-pais-vasco-2021.pdf', oficial: true, ambito: 'pais-vasco' },
  // Navarra (UPNA)
  { slug: 'nav-2025', title: 'Examen 2025', convocatoria: 'Universidad Pública de Navarra', anio: 2025, pdf: '/olimpiada/examen-navarra-2025.pdf', oficial: true, ambito: 'navarra' },
  { slug: 'nav-2024', title: 'Examen 2024', convocatoria: 'Universidad Pública de Navarra', anio: 2024, pdf: '/olimpiada/examen-navarra-2024.pdf', oficial: true, ambito: 'navarra' },
  { slug: 'nav-2023', title: 'Examen 2023', convocatoria: 'Universidad Pública de Navarra', anio: 2023, pdf: '/olimpiada/examen-navarra-2023.pdf', oficial: true, ambito: 'navarra' },
  // Extremadura (UEx)
  { slug: 'ext-2026', title: 'Examen 2026', convocatoria: 'Universidad de Extremadura', anio: 2026, pdf: '/olimpiada/examen-extremadura-2026.pdf', oficial: true, ambito: 'extremadura' },
  { slug: 'ext-2025', title: 'Examen 2025', convocatoria: 'Universidad de Extremadura', anio: 2025, pdf: '/olimpiada/examen-extremadura-2025.pdf', oficial: true, ambito: 'extremadura' },
  { slug: 'ext-2024', title: 'Examen 2024', convocatoria: 'Universidad de Extremadura', anio: 2024, pdf: '/olimpiada/examen-extremadura-2024.pdf', oficial: true, ambito: 'extremadura' },
  // Galicia (USC)
  { slug: 'gal-2024', title: 'Examen 2024', convocatoria: 'Universidade de Santiago de Compostela', anio: 2024, pdf: '/olimpiada/examen-galicia-2024.pdf', oficial: true, ambito: 'galicia' },
  // Asturias (Uniovi)
  { slug: 'ast-2024', title: 'Examen 2024', convocatoria: 'Universidad de Oviedo', anio: 2024, pdf: '/olimpiada/examen-asturias-2024.pdf', oficial: true, ambito: 'asturias' },
  // Material de práctica
  { slug: 'megaexamen', title: 'Megaexamen de práctica', convocatoria: 'Material de práctica del profesor', anio: 0, pdf: '/olimpiada/megaexamen-olimpiadas.pdf', oficial: false, ambito: 'practica' },
];

/** Agrupa los simulacros por ámbito, en el orden de AMBITOS, ya ordenados por año desc. */
export function simulacrosPorAmbito(): { ambito: Ambito; examenes: Simulacro[] }[] {
  return AMBITOS.map((ambito) => ({
    ambito,
    examenes: SIMULACROS.filter((s) => s.ambito === ambito.slug).sort((a, b) => b.anio - a.anio),
  })).filter((g) => g.examenes.length > 0);
}

export interface Lectura { categoria: string; titulo: string; autor: string; comentario: string; }
export const LECTURAS: Lectura[] = [
  // Economía general
  {
    categoria: 'Economía general',
    titulo: 'Economía para el 99% de la población',
    autor: 'Ha-Joon Chang',
    comentario: 'Repasa las grandes escuelas de pensamiento con ejemplos actuales; ideal para responder preguntas de teoría con criterio propio.',
  },
  {
    categoria: 'Economía general',
    titulo: 'Homo economicus',
    autor: 'Anxo Penalonga',
    comentario: 'Divulgación cercana escrita por un docente español; útil para asentar vocabulario antes de la fase local.',
  },
  {
    categoria: 'Economía general',
    titulo: 'Freakonomics',
    autor: 'Steven D. Levitt y Stephen J. Dubner',
    comentario: 'Muestra cómo el análisis de incentivos explica comportamientos sorprendentes; enriquece la parte de comentario de texto.',
  },
  {
    categoria: 'Economía general',
    titulo: 'El economista camuflado',
    autor: 'Tim Harford',
    comentario: 'Aplica micro de forma elegante a situaciones cotidianas; ayuda a construir argumentos en los ejercicios de razonamiento.',
  },
  {
    categoria: 'Economía general',
    titulo: 'La felicidad',
    autor: 'Richard Layard',
    comentario: 'Introduce la economía del bienestar y sus implicaciones de política; abre perspectiva más allá del PIB.',
  },
  // Economía conductual
  {
    categoria: 'Economía conductual',
    titulo: 'Pensar rápido, pensar despacio',
    autor: 'Daniel Kahneman',
    comentario: 'Referencia obligada sobre sesgos cognitivos; imprescindible si el enunciado de la Olimpiada aborda decisiones no racionales.',
  },
  {
    categoria: 'Economía conductual',
    titulo: 'Portarse mal',
    autor: 'Richard Thaler',
    comentario: 'El propio padre de la economía conductual explica sus ideas con humor; lectura directa y amena para Bachillerato.',
  },
  {
    categoria: 'Economía conductual',
    titulo: 'Ruido',
    autor: 'Daniel Kahneman, Olivier Sibony y Cass R. Sunstein',
    comentario: 'Complementa a Kahneman con el concepto de variabilidad en los juicios; para quienes ya dominan los sesgos básicos.',
  },
  // Teoría de juegos
  {
    categoria: 'Teoría de juegos',
    titulo: 'El arte de la estrategia',
    autor: 'Avinash Dixit y Barry Nalebuff',
    comentario: 'La introducción más accesible a la teoría de juegos; cubre dilema del prisionero, Nash y aplicaciones de oligopolio.',
  },
  {
    categoria: 'Teoría de juegos',
    titulo: 'La teoría de juegos: una breve introducción',
    autor: 'Ken Binmore',
    comentario: 'Síntesis rigurosa en pocas páginas; útil para reforzar la base teórica antes de la fase nacional.',
  },
  // Clásicos del pensamiento
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'La riqueza de las naciones',
    autor: 'Adam Smith',
    comentario: 'El texto fundacional de la economía moderna; vale leer al menos los capítulos sobre división del trabajo y la mano invisible.',
  },
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'Teoría general del empleo, el interés y el dinero',
    autor: 'John Maynard Keynes',
    comentario: 'Obra que revolucionó la macroeconomía; la introducción y los capítulos sobre demanda agregada son asequibles para un buen alumno de Bachillerato.',
  },
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'Libertad de elegir',
    autor: 'Milton Friedman',
    comentario: 'Expone la visión monetarista y liberal con claridad; contrasta bien con Keynes para entender el debate de política económica.',
  },
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'El capital en el siglo XXI',
    autor: 'Thomas Piketty',
    comentario: 'Análisis empírico de la desigualdad en el largo plazo; la primera parte es suficiente para manejar los argumentos principales.',
  },
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'Por qué fracasan los países',
    autor: 'Daron Acemoglu y James A. Robinson',
    comentario: 'Explica el papel de las instituciones en el desarrollo; proporciona argumentos sólidos para preguntas sobre crecimiento económico.',
  },
  {
    categoria: 'Clásicos del pensamiento',
    titulo: 'El precio de la desigualdad',
    autor: 'Joseph E. Stiglitz',
    comentario: 'Critica los fallos de mercado y la captura regulatoria con datos recientes; amplía la perspectiva sobre política económica y bienestar.',
  },
  // Finanzas e inversión
  {
    categoria: 'Finanzas e inversión',
    titulo: 'Un paseo aleatorio por Wall Street',
    autor: 'Burton G. Malkiel',
    comentario: 'Introduce la hipótesis del mercado eficiente y las finanzas personales; útil para preguntas sobre mercados de capitales.',
  },
  {
    categoria: 'Finanzas e inversión',
    titulo: 'Principios',
    autor: 'Ray Dalio',
    comentario: 'Ofrece una visión de la máquina económica desde dentro de un fondo global; complementa la teoría con una perspectiva profesional.',
  },
  // Marketing y empresa
  {
    categoria: 'Marketing y empresa',
    titulo: 'Marketing 4.0',
    autor: 'Philip Kotler',
    comentario: 'Actualiza los fundamentos del marketing al entorno digital; referencia directa para la parte de empresa en la Olimpiada.',
  },
  {
    categoria: 'Marketing y empresa',
    titulo: 'Ser competitivo',
    autor: 'Michael E. Porter',
    comentario: 'Recoge las cinco fuerzas y la ventaja competitiva en ensayos aplicados; lectura de referencia para la estrategia empresarial.',
  },
  // Webs y recursos
  {
    categoria: 'Webs y recursos',
    titulo: 'econgraphs.org',
    autor: '',
    comentario: 'Gráficos interactivos de microeconomía y macroeconomía; ideal para visualizar desplazamientos de curvas antes del examen.',
  },
  {
    categoria: 'Webs y recursos',
    titulo: 'economics-games.com',
    autor: '',
    comentario: 'Juegos didácticos en línea que simulan mercados, subastas y dilemas; refuerza la intuición económica de forma entretenida.',
  },
  {
    categoria: 'Webs y recursos',
    titulo: 'Destripando la Economía (YouTube)',
    autor: '',
    comentario: 'Canal de divulgación económica en castellano que explica conceptos macroeconómicos y de actualidad con rigor y claridad.',
  },
];

export interface ParteGuia { nombre: string; puntos: string; tiempo?: string; descripcion: string; }
export const GUIA: { duracion: string; total: string; partes: ParteGuia[] } = {
  duracion: '2 horas',
  total: '10 puntos',
  partes: [
    { nombre: 'Parte I — Test teórico', puntos: '4 pts', descripcion: 'Dieciséis preguntas tipo test con una sola opción correcta, sobre Economía de 1.º y Empresa (EDMN) de 2.º. Penalizan los fallos: tres incorrectas restan una correcta; las no contestadas ni suman ni restan.' },
    { nombre: 'Parte II — Ejercicio práctico', puntos: '3 pts', descripcion: 'Dos ejercicios, uno de Economía y otro de Empresa; eliges y resuelves solo uno. El punto muerto aparece casi siempre; también FPP, oferta-demanda algebraica o contabilidad.' },
    { nombre: 'Parte III — Comentario de texto', puntos: '3 pts', descripcion: 'Texto de actualidad económica con preguntas que conectan cada párrafo con un concepto del temario.' },
  ],
};
