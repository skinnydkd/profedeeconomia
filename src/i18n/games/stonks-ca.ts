// Valencian (AVL) content overlay for the Stonks game.
//
// The game data in src/lib/games/stonks/data.ts stays in Spanish (the engine
// reads only its numeric/structural fields). Here we translate the *display*
// text — asset labels/blurbs, year news, life events — keyed by the stable id,
// and expose resolvers the components call with the current locale. Under 'es'
// the resolvers return the raw ES data untouched.
import type { Locale } from '@/i18n/locale';
import type { AssetId, AssetMeta, LifeEvent } from '@/lib/games/stonks/types';
import { ASSETS, YEAR_NEWS, LIFE_EVENTS } from '@/lib/games/stonks/data';

// --- Assets: label + blurb per id ------------------------------------------
export const ASSETS_CA: Record<AssetId, { label: string; blurb: string }> = {
  ahorro: {
    label: 'Estalvi',
    blurb: 'Diners disponibles a l\'instant; quasi no dona rendiment i perd poder amb la inflació.',
  },
  deposito: {
    label: 'Depòsit',
    blurb: 'Immobilitzes els diners un temps a canvi d\'un interés fix menut.',
  },
  bonos: {
    label: 'Bons',
    blurb: 'Prestes diners a un Estat o empresa que te\'ls torna amb interessos.',
  },
  oro: {
    label: 'Or',
    blurb: 'Actiu refugi: sol pujar quan hi ha por, però no genera rendes.',
  },
  ibex: {
    label: 'IBEX 35',
    blurb: 'Índex de les 35 majors empreses espanyoles; puja i baixa amb l\'economia.',
  },
  sp500: {
    label: 'S&P 500',
    blurb: 'Índex de les 500 majors empreses dels EUA; el més seguit del món.',
  },
  bitcoin: {
    label: 'Bitcoin',
    blurb: 'Criptomoneda molt volàtil: pot multiplicar-se o esfondrar-se en un any.',
  },
  inmobiliario: {
    label: 'Immobiliari',
    blurb: 'Comprar habitatge o locals per a llogar; poc líquid, puja a poc a poc.',
  },
};

// --- Year news: one line per year ------------------------------------------
export const YEAR_NEWS_CA: Record<number, string> = {
  2000: 'Esclata la bombolla de les puntcom: les borses tecnològiques s\'enfonsen.',
  2001: 'Els atemptats de l\'11-S i la recessió sacsegen els mercats mundials.',
  2002: 'Escàndols comptables d\'Enron i WorldCom enfonsen la confiança inversora.',
  2003: 'Recuperació després de la bombolla: els mercats reboten amb força.',
  2004: 'Creixement global sòlid; el preu del petroli puja amb força.',
  2005: 'El boom immobiliari espanyol accelera: Espanya construïx més que França i Alemanya juntes.',
  2006: 'Economia global en màxims; els mercats borsaris encadenen anys de guanys.',
  2007: 'Primeres senyals de crisi en les hipoteques subprime dels EUA.',
  2008: 'Crisi financera global: cau Lehman Brothers i els mercats s\'enfonsen un 40 %.',
  2009: 'Els bancs centrals imprimixen diners per a salvar l\'economia; els mercats es recuperen.',
  2010: 'Crisi del deute sobirà europeu: Grècia, Portugal i Irlanda necessiten rescats.',
  2011: 'La crisi de deute s\'estén a Itàlia i Espanya; l\'IBEX marca mínims.',
  2012: 'Espanya rep un rescat bancari de 100.000 M€; el BCE promet «el que faça falta».',
  2013: 'Bitcoin supera els 1.000 $ per primera vegada; les borses recuperen nivells precrisi.',
  2014: 'Deflació a Europa, caiguda del petroli i primeres baixades de tipus del BCE.',
  2015: 'La Xina desaccelera i les seues borses s\'enfonsen; volatilitat global.',
  2016: 'El Brexit i l\'elecció de Trump sorprenen els mercats, que acaben a l\'alça.',
  2017: 'Febre del Bitcoin: supera els 20.000 $; les borses globals en màxims històrics.',
  2018: 'Crypto winter: el Bitcoin cau un 72 %; tensions comercials EUA-Xina.',
  2019: 'Guerra comercial EUA-Xina; els bancs centrals abaixen tipus; borses a l\'alça.',
  2020: 'La COVID-19 paralitza l\'economia mundial; caiguda històrica i recuperació en V.',
  2021: 'Boom post-COVID: accions, immobles i criptomonedes pugen a màxims.',
  2022: 'Inflació disparada i guerra a Ucraïna; els bancs centrals pugen tipus amb força.',
  2023: 'Revolució de la IA (ChatGPT): les borses tecnològiques es disparen.',
  2024: 'L\'S&P 500 encadena rècords històrics impulsat per la IA i la tecnologia.',
};

// --- Life events: text per id ----------------------------------------------
export const LIFE_EVENTS_CA: Record<string, string> = {
  coche: 'Avaria del cotxe.',
  medico: 'Despesa mèdica inesperada.',
  multa: 'Multa de trànsit.',
  electrodom: 'Avaria d\'electrodomèstics.',
  reforma: 'Reparació a casa.',
  dental: 'Despesa dental imprevista.',
  viaje: 'Viatge inesperat.',
  paga: 'Paga extra de Nadal.',
  herencia: 'Herència familiar.',
  loteria: 'Premi de loteria!',
  devolucion: 'Devolució d\'Hisenda.',
  premio: 'Premi per objectius a la faena.',
  cumple: 'Regal d\'aniversari.',
  ropausada: 'Venda de roba usada.',
};

// --- Resolvers -------------------------------------------------------------
export function localizeAssets(locale: Locale): AssetMeta[] {
  return locale === 'ca' ? ASSETS.map((a) => ({ ...a, ...ASSETS_CA[a.id] })) : ASSETS;
}

export function localizeYearNews(year: number, locale: Locale): string {
  return (locale === 'ca' ? YEAR_NEWS_CA[year] : undefined) ?? YEAR_NEWS[year];
}

export function localizeLifeEvent(event: LifeEvent, locale: Locale): string {
  return (locale === 'ca' ? LIFE_EVENTS_CA[event.id] : undefined) ?? event.text;
}
