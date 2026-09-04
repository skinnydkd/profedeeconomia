import { type Herramienta } from '@/lib/herramientas';
import { type Locale } from './locale';

type HerramientaCA = Partial<Pick<Herramienta, 'title' | 'descripcion'>>;

// Valencian (AVL) overlay for the /herramientas/ toolbox cards. Structural
// fields (slug, familia, componente, tipo, orden, competencias) stay in the ES
// source of truth. Acronyms (VAN, TIR, DCF, IRPF, DAFO, BCG, RIASEC, Europass)
// and «Business Model Canvas» are kept as-is: they are the terms used in class.
export const HERRAMIENTAS_CA: Partial<Record<string, HerramientaCA>> = {
  'mision-vision': {
    title: 'El test de la frase buida',
    descripcion: "Comprova si la vostra missió, visió i valors diuen alguna cosa o els signaria qualsevol empresa de qualsevol sector.",
  },
  'tareas-automatizables': {
    title: "Quina part d'un lloc és rutina",
    descripcion: "Repartix les hores d'un lloc entre tasques rutinàries i tasques que exigixen criteri, tracte o mans, i descriu en què es convertix.",
  },
  'progresividad-fiscal': {
    title: 'Progressiu i regressiu, amb números',
    descripcion: "Dues persones, la mateixa compra: quin percentatge dels seus diners s'emporta un impost sobre la renda i quin un sobre el consum.",
  },
  'demanda-control': {
    title: 'Exigència, marge de decisió i suport',
    descripcion: "Situa un lloc als quadrants del model de Karasek i diu què caldria per a traure'l de l'alta tensió.",
  },
  'mapa-empatia': {
    title: "Mapa d'empatia",
    descripcion: 'Sis zones sobre una persona concreta, i avís quan falten les dues de les quals ix la proposta de valor.',
  },
  'evaluacion-riesgos': {
    title: "Avaluació de riscos laborals",
    descripcion: 'Creua probabilitat i conseqüències, dona el nivell de risc i diu si es pot continuar treballant mentres es corregix.',
  },
  scamper: {
    title: 'SCAMPER: obrir abans de tancar',
    descripcion: "Genera idees des de set angles i no deixa puntuar-ne cap fins que hi ha d'on triar.",
  },
  'afirmacion-sostenible': {
    title: "Analitzador d'afirmacions de sostenibilitat",
    descripcion: 'Set preguntes per a saber si una afirmació verda es pot comprovar. No diu si és certa: diu si és verificable.',
  },
  'roles-de-equipo': {
    title: "Cobertura de papers de l'equip",
    descripcion: "Quins papers cobrix un equip i quins no cobrix ningú, a partir de l'autovaloració dels seus membres.",
  },
  'huella-digital': {
    title: "Auditoria d'empremta digital",
    descripcion: 'Llista d\'accions concretes sobre accés, privacitat, reputació i drets, ordenada pel que més lleva de damunt.',
  },
  'objetivos-smart': {
    title: "Comprovador d'objectius SMART",
    descripcion: 'Revisa si un objectiu complix les cinc lletres i calcula el ritme setmanal que exigix.',
  },
  'clasificar-empresa': {
    title: "Classificador d'empreses",
    descripcion: "Situa una empresa per grandària (llindars europeus), sector, propietat i àmbit, i explica què la deixa fora de PIME.",
  },
  'forma-juridica': {
    title: 'Comparador de formes jurídiques',
    descripcion: "Responsabilitat, capital i tributació d'autònom, S.L. i cooperativa, amb el punt de tall entre escala progressiva i tipus fix.",
  },
  'pib-real-deflactor': {
    title: 'PIB nominal, PIB real i deflactor',
    descripcion: 'Separa quant del creixement del PIB és més producció i quant són preus.',
  },
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
  'tamano-mercado': {
    title: 'Grandària de mercat (TAM, SAM i SOM)',
    descripcion:
      'De tota la població als clients que un projecte pot aconseguir de veritat, i quants en fan falta per al seu objectiu.',
  },
  'embudo-validacion': {
    title: 'Embut de validació',
    descripcion:
      'Conversió pas a pas d\'un projecte, el pas que més gent perd i el cost de cada venda.',
  },
  'compra-inteligente': {
    title: 'Preu per unitat i cost de pagar a terminis',
    descripcion:
      'Compara formats amb la mateixa vara i esbrina quina TAE amaga una quota mensual que sembla xicoteta.',
  },
  'semana-168-horas': {
    title: 'El pressupost de les 168 hores',
    descripcion:
      'Repartix les hores d\'una setmana entre son, classes, estudi, esport i pantalles, i mira què ix.',
  },
};

/** Overlay the Valencian strings onto a tool when locale is 'ca'. */
export function localizeHerramienta(h: Herramienta, locale: Locale): Herramienta {
  return locale === 'es' ? h : { ...h, ...HERRAMIENTAS_CA[h.slug] };
}
