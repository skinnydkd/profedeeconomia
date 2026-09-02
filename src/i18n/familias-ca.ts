import { type Familia } from '@/lib/familia-grouping';
import { type Locale } from './locale';

export type FamiliaOverlay = Partial<Record<string, Pick<Familia, 'label' | 'intro'>>>;

/**
 * Overlay VAL label/intro onto family headers; structural fields (slug,
 * colorVar) stay ES. Generic over the item type: the olimpiada `Ambito` and
 * `Bloque` registries are family-shaped but carry no `colorVar`.
 */
export function localizeFamilias<T extends Pick<Familia, 'slug' | 'label' | 'intro'>>(
  list: T[],
  overlay: FamiliaOverlay,
  locale: Locale,
): T[] {
  return locale === 'es' ? list : list.map((f) => ({ ...f, ...overlay[f.slug] }));
}

// Keyed by family slug. One overlay per registry (slugs may repeat ACROSS
// registries with different meaning — never merge them into one map).
// Valencian (AVL) translations authored for Pau's review; not auto-published.

export const FAMILIAS_DEBATE_CA: FamiliaOverlay = {
  'mercado-estado': {
    label: 'Mercat i Estat',
    intro: "Fins a on ha d'intervindre l'Estat en l'economia?",
  },
  'trabajo-desigualdad': {
    label: 'Treball i desigualtat',
    intro: 'Salaris, ocupació i repartiment de la renda.',
  },
  'globalizacion-comercio': {
    label: 'Globalització i comerç',
    intro: 'Comerç internacional, deslocalització i proteccionisme.',
  },
  'sostenibilidad-crecimiento': {
    label: 'Sostenibilitat i creixement',
    intro: 'Créixer sense límit o decréixer per a durar?',
  },
  'etica-empresa-consumo': {
    label: 'Ètica, empresa i consum',
    intro: 'Responsabilitat de les empreses i consum conscient.',
  },
  'dinero-tecnologia-futuro': {
    label: 'Diners, tecnologia i futur',
    intro: 'Cripto, automatització, IA i renda bàsica.',
  },
};

export const FAMILIAS_DINAMICAS_CA: FamiliaOverlay = {
  'mercat-treball': {
    label: 'Mercat de treball',
    intro: 'Entrevistes, selecció i negociació salarial.',
  },
  'mercats-preus': {
    label: 'Mercats i preus',
    intro: 'Com es formen els preus: competència, monopoli i càrtel.',
  },
  'distribucion-produccion': {
    label: 'Distribució i producció',
    intro: 'Qui es queda quin valor en una cadena de producció.',
  },
  'decisiones-comunes': {
    label: 'Decisions i béns comuns',
    intro: "Cooperar o aprofitar-se: béns comuns, béns públics i comerç.",
  },
  'sistemas-debates': {
    label: 'Sistemes econòmics i debats',
    intro: 'Mercat, Estat i els grans debats, amb rols i torns.',
  },
  'empresa-organizacion': {
    label: 'Empresa i organització',
    intro: 'Decidir en equip: juntes, cooperatives i cadenes de subministrament.',
  },
  'teoria-juegos': {
    label: 'Teoria de jocs',
    intro: "Jocs clàssics i subhastes per a veure l'estratègia en acció.",
  },
};

export const MATERIAS_PROYECTOS_CA: FamiliaOverlay = {
  historia: {
    label: 'Història',
    intro: "Crisis, revolucions i l'economia darrere dels fets.",
  },
  matematicas: {
    label: 'Matemàtiques',
    intro: "Dades, percentatges, índexs i gràfics per a entendre l'economia.",
  },
  geografia: {
    label: 'Geografia',
    intro: "Territori, recursos i comerç: on passa l'economia.",
  },
  'etica-valores': {
    label: 'Ètica i valors',
    intro: 'Decisions econòmiques amb dilemes morals i ciutadania.',
  },
  filosofia: {
    label: 'Filosofia',
    intro: 'La bona vida, la justícia i el sentit dels diners.',
  },
  lengua: {
    label: 'Llengua',
    intro: 'Comunicar, persuadir i analitzar el discurs econòmic.',
  },
  tecnologia: {
    label: 'Tecnologia',
    intro: 'Construir, programar i prototipar amb mirada econòmica.',
  },
};

export const FAMILIAS_HERRAMIENTA_CA: FamiliaOverlay = {
  'costes-resultados': {
    label: 'Costos i resultats',
    intro: 'Llindar de rendibilitat i anàlisi de comptes.',
  },
  'mercados-macro': {
    label: 'Mercats i macroeconomia',
    intro: 'Escassetat, mercats, fallades, macroeconomia i comerç.',
  },
  'inversion-finanzas': {
    label: 'Inversió i finances',
    intro: 'Valorar inversions: VAN, TIR, descompte i interés.',
  },
  'finanzas-personales': {
    label: 'Finances personals',
    intro: 'Nòmina, IRPF, pressupost i decisions de despesa.',
  },
  'orientacion-fp': {
    label: 'Orientació i FP',
    intro: 'Interessos, itineraris i currículum.',
  },
  'estrategia-planificacion': {
    label: 'Estratègia i planificació',
    intro: 'Diagnòstic, disseny i pla: model de negoci, cartera, clients i tresoreria.',
  },
};

export const BLOQUES_OLIMPIADA_CA: FamiliaOverlay = {
  fpp: {
    label: "FPP i cost d'oportunitat",
    intro: "Frontera de possibilitats, eficiència i cost d'oportunitat.",
  },
  'oferta-demanda': {
    label: 'Oferta, demanda i elasticitat',
    intro: 'Equilibri de mercat, desplaçaments i elasticitats.',
  },
  'punto-muerto': {
    label: 'Producció, costos i punt mort',
    intro: 'Costos, llindar de rendibilitat i el compte de resultats.',
  },
  'politica-economica': {
    label: 'Política monetària i fiscal',
    intro: 'Objectius, instruments i efectes sobre preus, producció i ocupació.',
  },
  'mercado-trabajo': {
    label: 'Mercat de treball i atur',
    intro: "EPA, taxes, tipus d'atur i el funcionament del mercat laboral.",
  },
  contabilidad: {
    label: 'Comptabilitat i rendibilitat',
    intro: 'Balanç, resultat, fons de maniobra i ràtios de rendibilitat.',
  },
  'estructuras-mercado': {
    label: 'Estructures de mercat',
    intro: 'Competència perfecta, monopoli, oligopoli i competència monopolística.',
  },
  'macro-magnitudes': {
    label: 'Macromagnituds: PIB, inflació i cicle',
    intro: 'Mesura del PIB, IPC i inflació, creixement i cicle econòmic.',
  },
  'sistema-financiero': {
    label: 'Diners i sistema financer',
    intro: "Funcions dels diners, creació bancària, bancs centrals i tipus d'interés.",
  },
  'comercio-internacional': {
    label: 'Comerç internacional',
    intro: 'Avantatge comparatiu, balança de pagaments, tipus de canvi i proteccionisme.',
  },
  empresa: {
    label: 'L\'empresa i les seues àrees',
    intro: 'Formes jurídiques, creixement, organització i àrees funcionals.',
  },
  'fallos-mercado': {
    label: 'Fallades de mercat i intervenció',
    intro: 'Externalitats, béns públics, informació asimètrica i poder de mercat.',
  },
};

export const AMBITOS_OLIMPIADA_CA: FamiliaOverlay = {
  cv: {
    label: 'Comunitat Valenciana',
    intro:
      'Fase local de la Comunitat Valenciana (UA/UV/UPV/UJI/UMH). És el format que descriu la guia: test + exercici + comentari, 2 hores.',
  },
  nacional: {
    label: 'Fase nacional',
    intro:
      "Olimpíada Espanyola d'Economia: la final estatal a què passen els finalistes de cada fase local.",
  },
  madrid: {
    label: 'Comunitat de Madrid',
    intro: 'Fase local de Madrid (UAM, URJC, UCM, UAH, UC3M). Publicats amb solucions.',
  },
  andalucia: {
    label: 'Andalusia',
    intro: "Fase local d'Andalusia (Universitat de Sevilla).",
  },
  'castilla-leon': {
    label: 'Castella i Lleó',
    intro: 'Fase local de Castella i Lleó (Universitat de Valladolid).',
  },
  'pais-vasco': {
    label: 'País Basc',
    intro: 'Fase local del País Basc (UPV/EHU).',
  },
  navarra: {
    label: 'Navarra',
    intro: 'Fase local de Navarra (Universitat Pública de Navarra).',
  },
  extremadura: {
    label: 'Extremadura',
    intro: "Fase local d'Extremadura (Universitat d'Extremadura).",
  },
  galicia: {
    label: 'Galícia',
    intro: 'Fase local de Galícia (Universidade de Santiago de Compostela).',
  },
  asturias: {
    label: 'Astúries',
    intro: "Fase local d'Astúries (Universitat d'Oviedo).",
  },
  practica: {
    label: 'Material de pràctica',
    intro: 'Material de pràctica propi per a entrenar sense pressió de convocatòria.',
  },
};
