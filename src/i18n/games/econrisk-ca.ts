// Valencian (AVL) content overlay for the Econrisk game.
//
// The game data in src/lib/games/econrisk/* stays in Spanish (the engine and AI
// read only ids/structure/numbers). Here we translate the *display* text —
// faction label/school/power, event card text, territory names — keyed by the
// stable id, and expose resolvers the components call with the current locale.
// Under 'es' the resolvers return the raw ES data untouched.
import type { Locale } from '@/i18n/locale';
import type { FactionId, Territory, EventCard } from '@/lib/games/econrisk/types';
import { FACTIONS, factionMeta, type FactionMeta } from '@/lib/games/econrisk/factions';
import { TERRITORIES, byId } from '@/lib/games/econrisk/map';

// --- Factions: label + school + power per id -------------------------------
export const FACTIONS_CA: Record<FactionId, { label: string; school: string; power: string }> = {
  keynes: {
    label: 'Keynesians',
    school: 'Keynesianisme',
    power: '+2 unitats gratis cada 3 torns (estímul fiscal).',
  },
  marx: {
    label: 'Marxistes',
    school: 'Marxisme',
    power: 'Conquisten automàticament territoris enemics defensats per 1 unitat.',
  },
  austrian: {
    label: 'Austríacs',
    school: 'Escola austríaca',
    power: '+1 a la defensa en tots els seus territoris (diners sòlids).',
  },
  neoclassic: {
    label: 'Neoclàssics',
    school: 'Economia neoclàssica',
    power: 'Poden atacar 1 territori no adjacent per torn (avantatge comparatiu).',
  },
};

// --- Event cards: text per id ----------------------------------------------
export const EVENT_CARDS_CA: Record<string, string> = {
  debt_crisis: 'Crisi de deute: tots els jugadors perden 2 unitats del territori amb més tropes.',
  trade_deal: 'Acord comercial: dos continents adjacents no poden ser atacats este torn.',
  sanctions: 'Sancions econòmiques: el jugador amb més territoris perd 3 unitats distribuïdes.',
  export_boom: 'Boom exportador: qui controla un continent sencer guanya +3 unitats extra.',
  global_recession:
    "Recessió global: els mercats internacionals es contrauen i l'activitat econòmica es desaccelera a tot el món.",
  tech_advance: 'Avanç tecnològic: el jugador amb menys territoris guanya 4 unitats.',
  temp_alliance: 'Aliança temporal: els dos jugadors amb menys territoris guanyen +2 unitats.',
  hyperinflation: 'Hiperinflació: tots els jugadors perden 1 unitat de cada territori amb 3 o més unitats.',
  humanitarian_aid: 'Ajuda humanitària: tots els territoris amb 1 sola unitat guanyen +1.',
  trade_war:
    'Guerra comercial: les tensions aranzelàries entre potències creen incertesa en els fluxos comercials globals.',
  industrial_revolution:
    'Revolució industrial: tots els jugadors guanyen 1 unitat per cada 3 territoris que controlen.',
  capital_flight: 'Fuga de capitals: el jugador amb més territoris transferix 2 unitats al jugador amb menys.',
  non_aggression: 'Pacte de no-agressió: no es pot atacar a Europa este torn.',
  economic_spring: 'Primavera econòmica: tots els jugadors guanyen +2 unitats.',
  financial_crisis_2008:
    'Crisi financera de 2008: el sector financer (Europa i Amèrica del Nord) perd 1 unitat per territori.',
};

// --- Territories: label per id ---------------------------------------------
export const TERRITORIES_CA: Record<string, string> = {
  canada: 'Canadà',
  usa_west: 'EUA Oest',
  usa_east: 'EUA Est',
  mexico: 'Mèxic',
  andes: 'Andes',
  brasil: 'Brasil',
  argentina: 'Argentina',
  nordics: 'Nòrdics',
  europa_occ: 'Europa Occ.',
  europa_central: 'Europa Central',
  europa_est: 'Europa Est',
  mediterrani: 'Mediterrani',
  africa_nord: 'Àfrica Nord',
  africa_occ: 'Àfrica Occ.',
  africa_est: 'Àfrica Est',
  africa_sud: 'Àfrica Sud',
  orient_mitja: 'Orient Mitjà',
  india: 'Índia',
  xina: 'Xina',
  japo: 'Japó',
  sudest_asia: 'Sud-est Asiàtic',
  illes_pacific: 'Illes Pacífic',
  australia: 'Austràlia',
  nova_zelanda: 'Nova Zelanda',
};

// --- Resolvers -------------------------------------------------------------
export function localizeFactions(locale: Locale): FactionMeta[] {
  return locale === 'ca' ? FACTIONS.map((f) => ({ ...f, ...FACTIONS_CA[f.id] })) : FACTIONS;
}

export function localizeFactionMeta(locale: Locale): Record<FactionId, FactionMeta> {
  return locale === 'ca'
    ? (Object.fromEntries(
        FACTIONS.map((f) => [f.id, { ...f, ...FACTIONS_CA[f.id] }]),
      ) as Record<FactionId, FactionMeta>)
    : factionMeta;
}

export function localizeEventText(event: EventCard, locale: Locale): string {
  return (locale === 'ca' ? EVENT_CARDS_CA[event.id] : undefined) ?? event.text;
}

export function localizeTerritories(locale: Locale): Territory[] {
  return locale === 'ca'
    ? TERRITORIES.map((t) => ({ ...t, label: TERRITORIES_CA[t.id] ?? t.label }))
    : TERRITORIES;
}

export function localizeTerritoryName(id: string, locale: Locale): string {
  return (locale === 'ca' ? TERRITORIES_CA[id] : undefined) ?? byId[id]?.label ?? id;
}
