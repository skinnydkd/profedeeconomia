// Valencian (AVL) content overlay for the Asegurados (seguros) game.
//
// The game data in src/lib/games/seguros/data.ts stays in Spanish (the engine
// reads only its numeric/structural fields: prima, dano, peso, key). Here we
// translate the *display* text — insurance labels, event-card labels and team
// names — keyed by the stable `key`/name, and expose resolvers the components
// call with the current locale. Under 'es' the resolvers return the raw ES data
// untouched. Team names and the drawn event card live in the saved state, so
// they are resolved by key/name at render time (never rewritten in the save).
import type { Locale } from '@/i18n/locale';
import type { Insurance, EventCard, InsuranceKey } from '@/lib/games/seguros/types';
import { INSURANCES, EVENT_DECK } from '@/lib/games/seguros/data';

// --- Insurances: label per key ---------------------------------------------
export const INSURANCES_CA: Record<InsuranceKey, string> = {
  movil: 'Mòbil',
  coche: 'Cotxe/Moto',
  hogar: 'Llar',
  salud: 'Salut',
  rc: 'Resp. civil',
};

// --- Event deck: label per key ---------------------------------------------
export const EVENT_DECK_CA: Record<string, string> = {
  calma: 'Tot tranquil: no passa res',
  movil: 'Pantalla trencada / robatori del mòbil',
  coche: 'Accident de cotxe o moto',
  salud: 'Despesa mèdica inesperada',
  hogar: 'Incendi o inundació a casa',
  rc: 'Et reclamen judicialment',
};

// --- Team names: name per ES default name ----------------------------------
export const TEAM_NAMES_CA: Record<string, string> = {
  'Equipo A': 'Equip A',
  'Equipo B': 'Equip B',
  'Equipo C': 'Equip C',
  'Equipo D': 'Equip D',
  'Equipo E': 'Equip E',
  'Equipo F': 'Equip F',
  'Equipo G': 'Equip G',
  'Equipo H': 'Equip H',
};

// --- Resolvers -------------------------------------------------------------
export function localizeInsurances(locale: Locale): Insurance[] {
  return locale === 'ca'
    ? INSURANCES.map((i) => ({ ...i, label: INSURANCES_CA[i.key] }))
    : INSURANCES;
}

export function localizeEventDeck(locale: Locale): EventCard[] {
  return locale === 'ca'
    ? EVENT_DECK.map((c) => ({ ...c, label: EVENT_DECK_CA[c.key] }))
    : EVENT_DECK;
}

// Single stored card resolver: the drawn event card is persisted in state, so
// its label is resolved by `key` at render time (mirrors localizeLifeEvent).
export function localizeEventLabel(event: EventCard, locale: Locale): string {
  return (locale === 'ca' ? EVENT_DECK_CA[event.key] : undefined) ?? event.label;
}

// Team names are persisted in the saved state; resolve by the stored ES name.
export function localizeTeamName(name: string, locale: Locale): string {
  return (locale === 'ca' ? TEAM_NAMES_CA[name] : undefined) ?? name;
}
