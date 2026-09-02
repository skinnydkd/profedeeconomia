import { type Herramienta } from '@/lib/herramientas';
import { type Locale } from './locale';

type HerramientaCA = Partial<Pick<Herramienta, 'title' | 'descripcion'>>;

// Valencian (AVL) overlay for the /herramientas/ toolbox cards. Structural
// fields (slug, familia, componente, tipo, orden, competencias) stay in the ES
// source of truth. Acronyms (VAN, TIR, DCF, IRPF, DAFO, BCG, RIASEC, Europass)
// and «Business Model Canvas» are kept as-is: they are the terms used in class.
export const HERRAMIENTAS_CA: Partial<Record<string, HerramientaCA>> = {
  'punto-muerto': {
    title: 'Punt mort (llindar de rendibilitat)',
    descripcion: "Calcula el punt mort i el llindar de rendibilitat d'un producte.",
  },
  ratios: {
    title: 'Ràtios financeres',
    descripcion: 'Liquiditat, solvència, endeutament i rendibilitat a partir del balanç.',
  },
  'ratios-benchmark': {
    title: 'Ràtios amb comparativa sectorial',
    descripcion: "Compara les ràtios d'una empresa amb referències del sector.",
  },
  productividad: {
    title: 'Productivitat',
    descripcion:
      'Productivitat del treball i del capital, global i la seua variació entre periodes.',
  },
  elasticidad: {
    title: 'Elasticitat de la demanda',
    descripcion: "Elasticitat preu de la demanda i el seu efecte sobre l'ingrés.",
  },
  'oferta-demanda-agregada': {
    title: 'Simulador oferta i demanda agregada',
    descripcion: "Mou l'AD i l'AS i observa l'efecte sobre producció i preus.",
  },
  'multiplicador-gasto': {
    title: 'Multiplicador de la despesa',
    descripcion: 'Efecte multiplicador d\'una variació de la despesa sobre la renda.',
  },
  'equilibrio-mercado': {
    title: 'Equilibri de mercat',
    descripcion: "Oferta i demanda lineals: preu i quantitat d'equilibri, topalls i excessos.",
  },
  'van-tir': {
    title: 'VAN i TIR',
    descripcion: "Valor actual net i taxa interna de retorn d'una inversió.",
  },
  'descuento-flujos': {
    title: 'Descompte de fluxos (DCF)',
    descripcion: 'Valora un projecte descomptant els seus fluxos de caixa futurs.',
  },
  'interes-compuesto': {
    title: 'Interés compost',
    descripcion: "Creixement d'un capital amb interés compost i aportacions.",
  },
  nomina: {
    title: 'Calculadora de nòmina',
    descripcion: "Del salari brut al net: cotitzacions i retenció d'IRPF.",
  },
  irpf: {
    title: "Declaració d'IRPF",
    descripcion: 'Simula una declaració de la renda senzilla pas a pas.',
  },
  'presupuesto-universidad': {
    title: 'Pressupost per a la universitat',
    descripcion: "Estima el cost d'estudiar fora i com finançar-ho.",
  },
  'presupuesto-50-30-20': {
    title: 'Pressupost 50/30/20',
    descripcion: 'Reparteix uns ingressos entre necessitats, desitjos i estalvi.',
  },
  'coche-vs-alternativa': {
    title: 'Cotxe propi o alternatives?',
    descripcion: 'Compara el cost real del cotxe davant altres opcions de mobilitat.',
  },
  'test-riasec': {
    title: "Test d'interessos RIASEC",
    descripcion: "Identifica perfils d'interés professional (model RIASEC).",
  },
  'cv-europass': {
    title: 'Generador de CV Europass',
    descripcion: 'Ompli i descarrega un currículum en format Europass.',
  },
  itinerarios: {
    title: 'Cercador d\'itineraris formatius',
    descripcion: 'Explora què estudiar després segons els teus interessos i nivell.',
  },
  dafo: {
    title: 'DAFO',
    descripcion: 'Llenç de Debilitats, Amenaces, Fortaleses i Oportunitats per a omplir.',
  },
  'business-model-canvas': {
    title: 'Business Model Canvas',
    descripcion: 'Els 9 blocs del model de negoci per a dissenyar i pivotar.',
  },
  'matriz-bcg': {
    title: 'Matriu BCG',
    descripcion: 'Cartera de productes per creixement i quota: estrella, interrogant, vaca i gos.',
  },
  'tasas-epa': {
    title: "Les tres taxes de l'EPA",
    descripcion: "Taxa d'activitat, d'ocupació i d'atur a partir de tres xifres de població.",
  },
  'matriz-decision': {
    title: 'Matriu de decisió ponderada',
    descripcion: 'Compara opcions amb criteris explícits i amb la mateixa vara.',
  },
  'frontera-posibilidades': {
    title: 'Frontera de possibilitats de producció',
    descripcion:
      "Escassetat i cost d'oportunitat: punts eficients, ineficients i inabastables, i el desplaçament per creixement.",
  },
  'externalidad-impuesto': {
    title: 'Externalitats i impost pigovià',
    descripcion:
      "Equilibri de mercat enfront d'òptim social, impost o subvenció correctora i pèrdua d'eficiència.",
  },
  'multiplicador-bancario': {
    title: 'Creació de diners bancaris',
    descripcion: "Quants diners crea el sistema bancari a partir d'un depòsit, ronda a ronda.",
  },
  'ventaja-comparativa': {
    title: 'Avantatge comparatiu i comerç',
    descripcion:
      "Costos d'oportunitat de dos països, qui s'especialitza en què i el rang de la relació d'intercanvi.",
  },
  'cuenta-resultados': {
    title: 'Compte de resultats escalonat',
    descripcion:
      "De la xifra de negocis al resultat de l'exercici, parant en marge brut, EBITDA, BAII i BAI.",
  },
  'coste-contratacion': {
    title: "Cost real d'una contractació",
    descripcion:
      "El que costa un empleat a l'empresa, el que cobra la persona i la distància entre les dues xifres.",
  },
  'cac-ltv': {
    title: 'Cost de captació i valor del client',
    descripcion:
      'CAC, LTV, ràtio entre els dos i mesos que es tarda a recuperar el que s\'ha invertit a captar.',
  },
  'prevision-tesoreria': {
    title: 'Previsió de tresoreria a 12 mesos',
    descripcion:
      'Cobraments i pagaments mes a mes, el pitjor moment de caixa i per què el benefici no són els diners disponibles.',
  },
};

/** Overlay the Valencian strings onto a tool when locale is 'ca'. */
export function localizeHerramienta(h: Herramienta, locale: Locale): Herramienta {
  return locale === 'es' ? h : { ...h, ...HERRAMIENTAS_CA[h.slug] };
}
