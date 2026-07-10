import { type GeneradorNativo, type GeneradorExterno } from '@/lib/generadores';
import { type Locale } from './locale';

type GenNativoCA = Partial<Pick<GeneradorNativo, 'title' | 'descripcion' | 'comoUsar'>>;

// Valencian (AVL) overlay for the /generadores/ teacher-tool cards. Structural
// fields (slug, componente, tipo, grupo, orden) stay in the ES source of truth.
export const GENERADORES_NATIVOS_CA: Partial<Record<string, GenNativoCA>> = {
  rubricas: {
    title: 'Generador de rúbriques',
    descripcion:
      "Construeix una rúbrica amb criteris i nivells d'assoliment, lligada a competències, llesta per a exportar i imprimir.",
    comoUsar:
      'Afig criteris i nivells, escriu el descriptor de cada cel·la i exporta-la en PDF o imprimix-la.',
  },
  calificaciones: {
    title: 'Calculadora de qualificacions',
    descripcion:
      "Mitjana ponderada d'instruments o competències i conversor de nivells de rúbrica a nota.",
    comoUsar:
      'Introduïx els pesos i les notes de cada instrument; davall, convertix nivells de rúbrica en una qualificació.',
  },
  autoevaluacion: {
    title: 'Autoavaluació i coavaluació',
    descripcion:
      "Full perquè l'alumnat s'autoavalue o avalue l'equip segons uns criteris i una escala.",
    comoUsar:
      "Edita els criteris, repartix el full i que l'alumnat marque la seua valoració. Exporta o imprimix.",
  },
  'plan-refuerzo': {
    title: 'Pla de reforç',
    descripcion:
      "Fitxa de reforç o recuperació per a un alumne: àrees, mesures, activitats, temporització i seguiment.",
    comoUsar:
      "Ompli els camps del pla per a l'alumne, guarda'l (s'autoguarda) i exporta'l o imprimix-lo.",
  },
  'registro-aula': {
    title: "Registre d'aula",
    descripcion:
      'Full de seguiment del grup: assistència, actitud, entregues i observacions per alumne.',
    comoUsar: "Afig els alumnes, anota el seguiment de la sessió i exporta'l o imprimix-lo.",
  },
  'medidas-dua': {
    title: 'Mesures DUA / adaptació',
    descripcion:
      "Plantilla de mesures d'atenció a la diversitat (DUA): barreres, ajustos, recursos i seguiment.",
    comoUsar:
      "Descriu el context, les barreres i els ajustos (representació, acció, implicació), i exporta'l.",
  },
};

export function localizeGeneradorNativo(g: GeneradorNativo, locale: Locale): GeneradorNativo {
  return locale === 'es' ? g : { ...g, ...GENERADORES_NATIVOS_CA[g.slug] };
}

type GenExternoCA = Partial<Pick<GeneradorExterno, 'eyebrow' | 'title' | 'descripcion'>>;

// Keyed by the ES `title`: externals have no slug and BOTH point at the same
// href (the sibling project's /programacion), so href is not a unique key.
export const GENERADORES_EXTERNOS_CA: Partial<Record<string, GenExternoCA>> = {
  'Situaciones de Aprendizaje': {
    eyebrow: 'Generador',
    title: "Situacions d'Aprenentatge",
    descripcion:
      "Un assistent per passos que arma una Situació d'Aprenentatge LOMLOE completa: sabers, competències, criteris, seqüència d'activitats, instruments d'avaluació i mesures DUA. Llesta per a imprimir.",
  },
  'Programación anual': {
    eyebrow: 'Generador',
    title: 'Programació anual',
    descripcion:
      'Munta una programació didàctica anual alineada amb el currículum LOMLOE de la teua assignatura i nivell, llesta per a descarregar.',
  },
};

export function localizeGeneradorExterno(g: GeneradorExterno, locale: Locale): GeneradorExterno {
  return locale === 'es' ? g : { ...g, ...GENERADORES_EXTERNOS_CA[g.title] };
}
