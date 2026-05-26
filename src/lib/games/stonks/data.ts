/**
 * Static data for the Stonks investment game.
 *
 * Ported from webpde/stonks.html (STONKS_DATA object). All annual return values
 * are stored as fractions: 0.15 = +15%, −0.37 = −37%. A null value means the
 * asset did not yet exist / was not available to players that year.
 *
 * Asset name mapping from the original source:
 *   savings → ahorro, deposit → deposito, bonds → bonos, gold → oro,
 *   ibex35 → ibex, sp500 → sp500, bitcoin → bitcoin, realestate → inmobiliario
 *
 * Numeric conversion: original percentages were divided by 100
 * (e.g. −21.7 → −0.217).
 */
// src/lib/games/stonks/data.ts
import type { AssetId, AssetMeta, LifeEvent, MarketData } from './types';

export const INITIAL_CASH = 5000;
export const INCOME_PER_ROUND = 3000;
export const INDEX_ASSET: AssetId = 'sp500'; // AI DCA index
export const ALLOCATION_STEP = 5;
export const ALLOCATION_MAX = 100;

export const ASSETS: AssetMeta[] = [
  { id: 'ahorro',       label: 'Ahorro',        risk: 'baja',    unlockRound: 0, blurb: 'Dinero disponible al instante; casi no da rendimiento y pierde poder con la inflación.' },
  { id: 'deposito',     label: 'Depósito',      risk: 'baja',    unlockRound: 0, blurb: 'Inmovilizas el dinero un tiempo a cambio de un interés fijo pequeño.' },
  { id: 'bonos',        label: 'Bonos',         risk: 'media',   unlockRound: 5, blurb: 'Prestas dinero a un Estado o empresa que te lo devuelve con intereses.' },
  { id: 'oro',          label: 'Oro',           risk: 'media',   unlockRound: 5, blurb: 'Activo refugio: suele subir cuando hay miedo, pero no genera rentas.' },
  { id: 'ibex',         label: 'IBEX 35',       risk: 'alta',    unlockRound: 3, blurb: 'Índice de las 35 mayores empresas españolas; sube y baja con la economía.' },
  { id: 'sp500',        label: 'S&P 500',       risk: 'alta',    unlockRound: 3, blurb: 'Índice de las 500 mayores empresas de EE. UU.; el más seguido del mundo.' },
  { id: 'bitcoin',      label: 'Bitcoin',       risk: 'extrema', unlockRound: 8, blurb: 'Criptomoneda muy volátil: puede multiplicarse o desplomarse en un año.' },
  { id: 'inmobiliario', label: 'Inmobiliario',  risk: 'media',   unlockRound: 8, blurb: 'Comprar vivienda o locales para alquilar; poco líquido, sube despacio.' },
];

export const ASSET_IDS = ASSETS.map((a) => a.id) as AssetId[];

// Ported from webpde/stonks.html. Fractions (0.15 = +15%). null = not yet available.
// Source: STONKS_DATA.assets[*].returns array, index 0=2000 .. 24=2024.
// Old asset names → new AssetId:
//   savings → ahorro, deposit → deposito, bonds → bonos, gold → oro,
//   ibex35 → ibex, sp500 → sp500, bitcoin → bitcoin, realestate → inmobiliario
// Conversion: divide by 100 (e.g. -21.7 → -0.217).
export const MARKET_DATA: MarketData = {
  //         ahorro  deposito  bonos   oro     ibex     sp500    bitcoin  inmobiliario
  2000: { ahorro:  0.025, deposito:  0.040, bonos:  0.048, oro: -0.054, ibex: -0.217, sp500: -0.091, bitcoin: null,  inmobiliario:  0.085 },
  2001: { ahorro:  0.023, deposito:  0.038, bonos:  0.051, oro:  0.007, ibex: -0.078, sp500: -0.119, bitcoin: null,  inmobiliario:  0.080 },
  2002: { ahorro:  0.020, deposito:  0.030, bonos:  0.055, oro:  0.256, ibex: -0.281, sp500: -0.221, bitcoin: null,  inmobiliario:  0.152 },
  2003: { ahorro:  0.015, deposito:  0.025, bonos:  0.042, oro:  0.199, ibex:  0.282, sp500:  0.287, bitcoin: null,  inmobiliario:  0.174 },
  2004: { ahorro:  0.012, deposito:  0.022, bonos:  0.040, oro:  0.056, ibex:  0.174, sp500:  0.109, bitcoin: null,  inmobiliario:  0.172 },
  2005: { ahorro:  0.015, deposito:  0.020, bonos:  0.035, oro:  0.182, ibex:  0.182, sp500:  0.049, bitcoin: null,  inmobiliario:  0.139 },
  2006: { ahorro:  0.020, deposito:  0.028, bonos:  0.038, oro:  0.232, ibex:  0.318, sp500:  0.158, bitcoin: null,  inmobiliario:  0.110 },
  2007: { ahorro:  0.030, deposito:  0.040, bonos:  0.043, oro:  0.319, ibex:  0.073, sp500:  0.055, bitcoin: null,  inmobiliario:  0.058 },
  2008: { ahorro:  0.035, deposito:  0.045, bonos:  0.040, oro:  0.043, ibex: -0.394, sp500: -0.370, bitcoin: null,  inmobiliario: -0.095 },
  2009: { ahorro:  0.010, deposito:  0.020, bonos:  0.040, oro:  0.250, ibex:  0.298, sp500:  0.265, bitcoin: null,  inmobiliario: -0.067 },
  2010: { ahorro:  0.005, deposito:  0.015, bonos:  0.048, oro:  0.295, ibex: -0.174, sp500:  0.151, bitcoin: null,  inmobiliario: -0.039 },
  2011: { ahorro:  0.008, deposito:  0.018, bonos:  0.054, oro:  0.101, ibex: -0.131, sp500:  0.021, bitcoin: null,  inmobiliario: -0.112 },
  2012: { ahorro:  0.005, deposito:  0.015, bonos:  0.050, oro:  0.070, ibex: -0.047, sp500:  0.160, bitcoin:  1.860, inmobiliario: -0.137 },
  2013: { ahorro:  0.003, deposito:  0.010, bonos:  0.035, oro: -0.283, ibex:  0.214, sp500:  0.324, bitcoin: 55.070, inmobiliario: -0.050 },
  2014: { ahorro:  0.002, deposito:  0.008, bonos:  0.020, oro: -0.015, ibex:  0.037, sp500:  0.137, bitcoin: -0.173, inmobiliario:  0.003 },
  2015: { ahorro:  0.001, deposito:  0.005, bonos:  0.012, oro: -0.104, ibex: -0.072, sp500:  0.014, bitcoin:  1.240, inmobiliario:  0.011 },
  2016: { ahorro:  0.000, deposito:  0.003, bonos:  0.010, oro:  0.086, ibex: -0.020, sp500:  0.120, bitcoin:  1.240, inmobiliario:  0.015 },
  2017: { ahorro:  0.000, deposito:  0.002, bonos:  0.008, oro:  0.137, ibex:  0.074, sp500:  0.218, bitcoin: 13.380, inmobiliario:  0.024 },
  2018: { ahorro:  0.000, deposito:  0.001, bonos:  0.006, oro: -0.021, ibex: -0.150, sp500: -0.044, bitcoin: -0.726, inmobiliario:  0.034 },
  2019: { ahorro:  0.000, deposito:  0.001, bonos:  0.003, oro:  0.183, ibex:  0.118, sp500:  0.315, bitcoin:  0.872, inmobiliario:  0.032 },
  2020: { ahorro:  0.000, deposito:  0.000, bonos:  0.001, oro:  0.246, ibex: -0.155, sp500:  0.184, bitcoin:  3.010, inmobiliario: -0.018 },
  2021: { ahorro:  0.000, deposito:  0.000, bonos:  0.003, oro: -0.036, ibex:  0.079, sp500:  0.287, bitcoin:  0.598, inmobiliario:  0.037 },
  2022: { ahorro:  0.005, deposito:  0.010, bonos:  0.025, oro:  0.004, ibex: -0.056, sp500: -0.181, bitcoin: -0.643, inmobiliario:  0.055 },
  2023: { ahorro:  0.025, deposito:  0.030, bonos:  0.035, oro:  0.131, ibex:  0.228, sp500:  0.263, bitcoin:  1.557, inmobiliario:  0.032 },
  2024: { ahorro:  0.030, deposito:  0.035, bonos:  0.032, oro:  0.272, ibex:  0.148, sp500:  0.250, bitcoin:  1.215, inmobiliario:  0.046 },
};

export const YEARS = Object.keys(MARKET_DATA).map(Number).sort((a, b) => a - b);
export const TOTAL_ROUNDS = YEARS.length;

// Year news strings in Spanish. Ported from STONKS_DATA.events (title + effect).
// Years missing from original (2004, 2006, 2010, 2014, 2016) filled with historically accurate context.
export const YEAR_NEWS: Record<number, string> = {
  2000: 'Estalla la burbuja de las puntocom: las bolsas tecnológicas se desploman.',
  2001: 'Los atentados del 11-S y la recesión sacuden los mercados mundiales.',
  2002: 'Escándalos contables de Enron y WorldCom hunden la confianza inversora.',
  2003: 'Recuperación tras la burbuja: los mercados rebotan con fuerza.',
  2004: 'Crecimiento global sólido; el precio del petróleo sube con fuerza.',
  2005: 'El boom inmobiliario español acelera: España construye más que Francia y Alemania juntas.',
  2006: 'Economía global en máximos; los mercados bursátiles encadenan años de ganancias.',
  2007: 'Primeras señales de crisis en las hipotecas subprime de EE. UU.',
  2008: 'Crisis financiera global: cae Lehman Brothers y los mercados se desploman un 40 %.',
  2009: 'Los bancos centrales imprimen dinero para salvar la economía; los mercados se recuperan.',
  2010: 'Crisis de la deuda soberana europea: Grecia, Portugal e Irlanda necesitan rescates.',
  2011: 'La crisis de deuda se extiende a Italia y España; el IBEX marca mínimos.',
  2012: 'España recibe un rescate bancario de 100.000 M€; el BCE promete «lo que haga falta».',
  2013: 'Bitcoin supera los 1.000 $ por primera vez; las bolsas recuperan niveles precrisis.',
  2014: 'Deflación en Europa, caída del petróleo y primeras bajadas de tipos del BCE.',
  2015: 'China desacelera y sus bolsas se hunden; volatilidad global.',
  2016: 'Brexit y elección de Trump sorprenden a los mercados, que terminan al alza.',
  2017: 'Fiebre del Bitcoin: supera los 20.000 $; las bolsas globales en máximos históricos.',
  2018: 'Crypto winter: el Bitcoin cae un 72 %; tensiones comerciales EE. UU.-China.',
  2019: 'Guerra comercial EE. UU.-China; los bancos centrales bajan tipos; bolsas al alza.',
  2020: 'La COVID-19 paraliza la economía mundial; caída histórica y recuperación en V.',
  2021: 'Boom post-COVID: acciones, inmuebles y criptomonedas suben a máximos.',
  2022: 'Inflación disparada y guerra en Ucrania; los bancos centrales suben tipos con fuerza.',
  2023: 'Revolución de la IA (ChatGPT): las bolsas tecnológicas se disparan.',
  2024: 'El S&P 500 encadena récords históricos impulsado por la IA y la tecnología.',
};

export const LIFE_EVENTS: LifeEvent[] = [
  { id: 'coche',      text: 'Avería del coche.',                   amount: -1500 },
  { id: 'medico',     text: 'Gasto médico inesperado.',            amount: -3000 },
  { id: 'multa',      text: 'Multa de tráfico.',                   amount: -400  },
  { id: 'electrodom', text: 'Avería de electrodomésticos.',        amount: -800  },
  { id: 'reforma',    text: 'Reparación en casa.',                 amount: -2500 },
  { id: 'dental',     text: 'Gasto dental imprevisto.',            amount: -1000 },
  { id: 'viaje',      text: 'Viaje inesperado.',                   amount: -1800 },
  { id: 'paga',       text: 'Bonus de Navidad.',                   amount:  2000 },
  { id: 'herencia',   text: 'Herencia familiar.',                  amount:  8000 },
  { id: 'loteria',    text: '¡Premio de lotería!',                  amount:  5000 },
  { id: 'devolucion', text: 'Devolución de Hacienda.',             amount:  1200 },
  { id: 'premio',     text: 'Premio por objetivos en el trabajo.', amount:  3000 },
  { id: 'cumple',     text: 'Regalo de cumpleaños.',               amount:   500 },
  { id: 'ropausada',  text: 'Venta de ropa usada.',                amount:   300 },
];

export const LIFE_EVENT_CHANCE = 0.3; // probability per round
