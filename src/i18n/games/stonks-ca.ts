// src/i18n/games/stonks-ca.ts
import type { AssetCard, AssetId, AssetMeta, Half, LifeEvent } from '@/lib/games/stonks/types';
import type { Locale } from '@/i18n/locale';
import { NEWS_CA } from './stonks-news-ca';
import { CARD_BODIES_CA } from './stonks-cards-ca';

export { NEWS_CA, CARD_BODIES_CA };

/**
 * Valencian overlay for Stonks.
 *
 * Everything the player reads during a game is translated: asset labels,
 * company profiles, life events, the 110 semester headlines
 * (stonks-news-ca.ts) and the 28 deep cards (stonks-cards-ca.ts). The parity
 * test in content-parity.test.ts requires every id to be present, so a new
 * headline or card in Spanish fails the suite until it is translated too.
 */

export const ASSETS_CA: Record<AssetId, { label: string; profile?: string }> = {
  efectivo: { label: 'Efectiu' },
  deposito: { label: 'Depòsit a termini' },
  deuda: { label: 'Deute públic espanyol' },
  oro: { label: 'Or' },
  vivienda: { label: 'Habitatge a Espanya' },
  bolsa_es: { label: 'Borsa espanyola' },
  sp500: { label: 'Borsa dels EUA' },
  mundial: { label: 'Borsa mundial' },
  bitcoin: { label: 'Criptomoneda' },

  e_apple: { label: 'Electrònica de consum', profile: 'EUA · ix a borsa el 1980' },
  e_msft: { label: 'Programari', profile: 'EUA · ix a borsa el 1986' },
  e_amzn: { label: 'Comerç electrònic', profile: 'EUA · ix a borsa el 1997' },
  e_nvda: { label: 'Semiconductors', profile: 'EUA · ix a borsa el 1999' },
  e_itx: { label: 'Tèxtil', profile: 'Espanya · ix a borsa el 2001' },
  e_nokia: { label: 'Telefonia mòbil', profile: 'Finlàndia · cotitza des del 1994' },
  e_terra: { label: 'Portal d’internet', profile: 'Espanya · ix a borsa el 1999' },
  e_enron: { label: 'Energia', profile: 'EUA · cotitza des del 1986' },
  e_popular: { label: 'Banca', profile: 'Espanya · cotitza des del 1971' },
};

export const LIFE_EVENTS_CA: Record<string, string> = {
  coche: 'Avaria del cotxe.',
  medico: 'Despesa mèdica inesperada.',
  multa: 'Multa de trànsit.',
  electrodom: 'Avaria d’electrodomèstics.',
  reforma: 'Reparació a casa.',
  dental: 'Despesa dental imprevista.',
  viaje: 'Viatge inesperat.',
  paro: 'Et quedes sense faena uns quants mesos.',
  derrama: 'Derrama extraordinària de l’edifici.',
  paga: 'Paga extra de Nadal.',
  herencia: 'Herència familiar.',
  loteria: 'Premi de loteria!',
  devolucion: 'Devolució d’Hisenda.',
  premio: 'Premi per objectius en la faena.',
  cumple: 'Regal d’aniversari.',
  ropausada: 'Venda de roba usada.',
};

// ── Accessors used by the components ──────────────────────────────────────

/** Overlays the Valencian label and profile; everything else stays as-is. */
export function localizeAsset(a: AssetMeta, locale: Locale): AssetMeta {
  if (locale !== 'ca') return a;
  const ca = ASSETS_CA[a.id];
  if (!ca) return a;
  return { ...a, label: ca.label, profile: ca.profile ?? a.profile };
}

export function localizeLifeEvent(e: LifeEvent, locale: Locale): string {
  return locale === 'ca' ? LIFE_EVENTS_CA[e.id] ?? e.text : e.text;
}

export function localizeNews(year: number, half: Half, fallback: string, locale: Locale): string {
  return locale === 'ca' ? NEWS_CA[`${year}-${half}`] ?? fallback : fallback;
}

export function localizeCard(card: AssetCard | undefined, locale: Locale): AssetCard | undefined {
  if (!card || locale !== 'ca') return card;
  const ca = CARD_BODIES_CA[card.id];
  return ca ? { ...card, title: ca.title, body: ca.body } : card;
}
