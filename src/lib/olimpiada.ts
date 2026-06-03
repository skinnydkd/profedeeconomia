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
];

export const BLOQUE_SLUGS = BLOQUES.map((b) => b.slug) as [string, ...string[]];
const BY_SLUG = new Map(BLOQUES.map((b) => [b.slug, b]));
export function bloqueMeta(slug: string): Familia {
  const b = BY_SLUG.get(slug);
  if (!b) throw new Error(`unknown bloque: ${slug}`);
  return b;
}

export interface Simulacro { slug: string; title: string; convocatoria: string; anio: number; pdf: string; oficial: boolean; }
export const SIMULACROS: Simulacro[] = [
  { slug: 'cv-2014', title: 'Fase Local C. Valenciana 2014', convocatoria: 'Fase Local · C. Valenciana', anio: 2014, pdf: '/olimpiada/examen-olimpiadas-1.pdf', oficial: true },
  { slug: 'cv-2018', title: 'Fase Local C. Valenciana 2018', convocatoria: 'Fase Local · C. Valenciana', anio: 2018, pdf: '/olimpiada/examen-olimpiadas-3.pdf', oficial: true },
  { slug: 'cv-2021', title: 'Fase Local C. Valenciana 2021', convocatoria: 'Fase Local · C. Valenciana', anio: 2021, pdf: '/olimpiada/examen-olimpiadas-2.pdf', oficial: true },
  { slug: 'megaexamen', title: 'Megaexamen de práctica', convocatoria: 'Material de práctica del profesor', anio: 0, pdf: '/olimpiada/megaexamen-olimpiadas.pdf', oficial: false },
];

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
  duracion: '2 horas y 30 minutos',
  total: '8 puntos',
  partes: [
    { nombre: 'Parte I — Teoría', puntos: '4,5 pts (3 × 1,5)', descripcion: 'Elige 3 de 6 preguntas de desarrollo. Definir conceptos y representarlos gráficamente; razonar la veracidad de afirmaciones.' },
    { nombre: 'Parte II — Ejercicio', puntos: '3 pts', descripcion: 'Elige 1 de 2 ejercicios numéricos. El punto muerto aparece casi siempre; también FPP, oferta-demanda algebraica o contabilidad.' },
    { nombre: 'Parte III — Comentario de texto', puntos: '2,5 pts', descripcion: 'Texto de prensa económica con preguntas que conectan cada párrafo con un concepto del temario.' },
  ],
};
