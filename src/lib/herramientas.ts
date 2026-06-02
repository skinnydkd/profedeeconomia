/**
 * Registry for the transversal «Herramientas» toolbox. Each tool is an existing
 * Preact island keyed by `componente` (the same enum used by the `recursos`
 * collection). The per-tool curriculum map is NOT stored here — it is derived
 * from `recursos` at build time (see unidadesPorComponente). Family color-coding
 * reuses existing global.css tokens — no new colors.
 */
import type { Familia } from './familia-grouping';
import { groupByFamilia } from './familia-grouping';
export type { Familia, FamiliaGroup } from './familia-grouping';

export const COMPONENTE_KEYS = [
  'PuntoMuerto', 'VANTIR', 'Ratios', 'ADASSimulator', 'InteresCompuesto', 'NominaESO',
  'Presupuesto503020', 'BuscadorItinerarios', 'GeneradorCVEuropass', 'DCF', 'RatiosBenchmark',
  'Elasticidad', 'MultiplicadorGasto', 'IRPFDeclaracion', 'CocheVsAlternativa', 'RIASEC',
  'PresupuestoUni',
] as const;
export type ComponenteKey = typeof COMPONENTE_KEYS[number];

export type TipoHerramienta = 'calculadora' | 'simulador' | 'test' | 'generador' | 'buscador' | 'plantilla';

export interface Herramienta {
  componente: ComponenteKey;
  slug: string;
  title: string;
  familia: string;
  orden: number;
  tipo: TipoHerramienta;
  descripcion: string;
  competencias_clave: string[];
  competencias_especificas: string[];
}

export const FAMILIAS_HERRAMIENTA: Familia[] = [
  { slug: 'costes-resultados',   label: 'Costes y resultados',     intro: 'Umbral de rentabilidad y análisis de cuentas.',        colorVar: '--color-edmn' },
  { slug: 'mercados-macro',      label: 'Mercados y macroeconomía',intro: 'Elasticidad, oferta y demanda agregada, multiplicador.', colorVar: '--color-eco1' },
  { slug: 'inversion-finanzas',  label: 'Inversión y finanzas',    intro: 'Valorar inversiones: VAN, TIR, descuento e interés.',   colorVar: '--color-mustard' },
  { slug: 'finanzas-personales', label: 'Finanzas personales',     intro: 'Nómina, IRPF, presupuesto y decisiones de gasto.',      colorVar: '--color-fopp' },
  { slug: 'orientacion-fp',      label: 'Orientación y FP',        intro: 'Intereses, itinerarios y currículum.',                  colorVar: '--color-ipe2' },
];

export const HERRAMIENTAS: Herramienta[] = [
  { componente: 'PuntoMuerto',        slug: 'punto-muerto',        title: 'Punto muerto (umbral de rentabilidad)', familia: 'costes-resultados',   orden: 1, tipo: 'calculadora', descripcion: 'Calcula el punto muerto y el umbral de rentabilidad de un producto.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'Ratios',             slug: 'ratios',              title: 'Ratios financieros',                    familia: 'costes-resultados',   orden: 2, tipo: 'calculadora', descripcion: 'Liquidez, solvencia, endeudamiento y rentabilidad a partir del balance.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'RatiosBenchmark',    slug: 'ratios-benchmark',    title: 'Ratios con comparativa sectorial',      familia: 'costes-resultados',   orden: 3, tipo: 'calculadora', descripcion: 'Compara los ratios de una empresa con referencias del sector.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'Elasticidad',        slug: 'elasticidad',         title: 'Elasticidad de la demanda',             familia: 'mercados-macro',      orden: 1, tipo: 'calculadora', descripcion: 'Elasticidad precio de la demanda y su efecto sobre el ingreso.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  { componente: 'ADASSimulator',      slug: 'oferta-demanda-agregada', title: 'Simulador oferta y demanda agregada', familia: 'mercados-macro',  orden: 2, tipo: 'simulador',   descripcion: 'Mueve la AD y la AS y observa el efecto sobre producción y precios.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  { componente: 'MultiplicadorGasto', slug: 'multiplicador-gasto', title: 'Multiplicador del gasto',               familia: 'mercados-macro',      orden: 3, tipo: 'calculadora', descripcion: 'Efecto multiplicador de una variación del gasto sobre la renta.', competencias_clave: ['STEM', 'CD'], competencias_especificas: [] },
  { componente: 'VANTIR',             slug: 'van-tir',             title: 'VAN y TIR',                             familia: 'inversion-finanzas',  orden: 1, tipo: 'calculadora', descripcion: 'Valor actual neto y tasa interna de retorno de una inversión.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'DCF',                slug: 'descuento-flujos',    title: 'Descuento de flujos (DCF)',             familia: 'inversion-finanzas',  orden: 2, tipo: 'calculadora', descripcion: 'Valora un proyecto descontando sus flujos de caja futuros.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'InteresCompuesto',   slug: 'interes-compuesto',   title: 'Interés compuesto',                     familia: 'inversion-finanzas',  orden: 3, tipo: 'calculadora', descripcion: 'Crecimiento de un capital con interés compuesto y aportaciones.', competencias_clave: ['STEM', 'CD', 'CE'], competencias_especificas: [] },
  { componente: 'NominaESO',          slug: 'nomina',              title: 'Calculadora de nómina',                 familia: 'finanzas-personales', orden: 1, tipo: 'calculadora', descripcion: 'Del salario bruto al neto: cotizaciones y retención de IRPF.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'IRPFDeclaracion',    slug: 'irpf',                title: 'Declaración de IRPF',                   familia: 'finanzas-personales', orden: 2, tipo: 'calculadora', descripcion: 'Simula una declaración de la renta sencilla paso a paso.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'PresupuestoUni',     slug: 'presupuesto-universidad', title: 'Presupuesto para la universidad',   familia: 'finanzas-personales', orden: 3, tipo: 'calculadora', descripcion: 'Estima el coste de estudiar fuera y cómo financiarlo.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'Presupuesto503020',  slug: 'presupuesto-50-30-20',title: 'Presupuesto 50/30/20',                  familia: 'finanzas-personales', orden: 4, tipo: 'calculadora', descripcion: 'Reparte unos ingresos entre necesidades, deseos y ahorro.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'CocheVsAlternativa', slug: 'coche-vs-alternativa',title: '¿Coche propio o alternativas?',         familia: 'finanzas-personales', orden: 5, tipo: 'calculadora', descripcion: 'Compara el coste real del coche frente a otras opciones de movilidad.', competencias_clave: ['STEM', 'CPSAA', 'CD'], competencias_especificas: [] },
  { componente: 'RIASEC',             slug: 'test-riasec',         title: 'Test de intereses RIASEC',              familia: 'orientacion-fp',      orden: 1, tipo: 'test',        descripcion: 'Identifica perfiles de interés profesional (modelo RIASEC).', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
  { componente: 'GeneradorCVEuropass',slug: 'cv-europass',         title: 'Generador de CV Europass',              familia: 'orientacion-fp',      orden: 2, tipo: 'generador',   descripcion: 'Rellena y descarga un currículum en formato Europass.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
  { componente: 'BuscadorItinerarios',slug: 'itinerarios',         title: 'Buscador de itinerarios formativos',    familia: 'orientacion-fp',      orden: 3, tipo: 'buscador',    descripcion: 'Explora qué estudiar después según tus intereses y nivel.', competencias_clave: ['CPSAA', 'CE'], competencias_especificas: [] },
];

const BY_SLUG = new Map(HERRAMIENTAS.map((h) => [`${h.familia}/${h.slug}`, h]));

export function herramientaPorSlug(familia: string, slug: string): Herramienta | undefined {
  return BY_SLUG.get(`${familia}/${slug}`);
}

/** Group the registry by family (FAMILIAS_HERRAMIENTA order), exposing the tool on `.h`. */
export function gruposHerramientas() {
  const items = HERRAMIENTAS.map((h) => ({
    slug: h.slug,
    data: { familia: h.familia, orden: h.orden, title: h.title, unidades_relacionadas: [] as { asignatura: string; unidad: number }[] },
    h,
  }));
  return groupByFamilia(FAMILIAS_HERRAMIENTA, items);
}

/** Derive, per componente, the {asignatura, unidad} pairs from the recursos that embed it. */
export function unidadesPorComponente(
  recursos: { data: { componente?: string; asignatura: string; unidad_relacionada?: number } }[]
): Map<string, { asignatura: string; unidad: number }[]> {
  const map = new Map<string, { asignatura: string; unidad: number }[]>();
  for (const r of recursos) {
    const { componente, asignatura, unidad_relacionada } = r.data;
    if (!componente || unidad_relacionada === undefined) continue;
    const arr = map.get(componente) ?? [];
    if (!arr.some((u) => u.asignatura === asignatura && u.unidad === unidad_relacionada)) {
      arr.push({ asignatura, unidad: unidad_relacionada });
    }
    map.set(componente, arr);
  }
  return map;
}
