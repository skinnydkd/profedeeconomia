// Valencian (AVL) content overlay for the Econopoly game.
//
// The game data in src/lib/games/econopoly/{board,events}.ts stays in Spanish
// (the engine reads only its numeric/structural fields). Here we translate the
// *display* text — cell/property labels, sector names, news-card text — keyed by
// the stable id, and expose resolvers the components call with the current
// locale. Under 'es' the resolvers return the raw ES data untouched.
import type { Locale } from '@/i18n/locale';
import type { Cell, NewsCard, SectorId } from '@/lib/games/econopoly/types';
import { CELLS, SECTOR_LABEL } from '@/lib/games/econopoly/board';

// --- Cells: display label per ring position id -----------------------------
// For property cells the same translated name applies to both `cell.label` and
// `cell.property.label`; for corners/specials only `cell.label` exists.
export const CELLS_CA: Record<number, string> = {
  0: 'EIXIDA',
  1: 'Cooperativa Agrícola',
  2: 'Fàbrica Tèxtil',
  3: 'Notícia',
  4: 'Startup Digital',
  5: 'Cadena Hotelera',
  6: 'Banc Central',
  7: 'IMPOST',
  8: 'Planta Solar',
  9: 'Notícia',
  10: 'Refineria',
  11: 'Aerolínia Nacional',
  12: 'Banc Central',
  13: 'Resort Turístic',
  14: 'MERCAT LLIURE',
  15: 'Promotora Immobiliària',
  16: 'Notícia',
  17: 'Constructora Nacional',
  18: 'R+D',
  19: 'Banc Comercial',
  20: 'Banc Central',
  21: 'NOTÍCIA',
  22: 'Asseguradora',
  23: 'Exportadora Agroalimentària',
  24: 'Impost',
  25: 'Hospital Privat',
  26: 'Big Tech',
  27: 'Plataforma Petroli',
};

// --- Sector display labels --------------------------------------------------
export const SECTOR_LABEL_CA: Record<SectorId, string> = {
  A: 'Tecnologia',
  B: 'Serveis',
  C: 'Energia',
  D: 'Finances',
  E: 'Agricultura',
  F: 'Indústria',
  G: 'Turisme',
  H: 'Construcció',
};

// --- News cards: text per id ------------------------------------------------
export const NEWS_CARDS_CA: Record<string, string> = {
  tech_boom:
    'Boom tecnològic: les empreses tech augmenten el seu valor un 20%. Rendes de Tecnologia +20% este torn.',
  energy_crisis:
    'Crisi energètica: el preu del petroli es duplica. Rendes d\'Energia +50% este torn.',
  construction_bust:
    'La bombolla immobiliària esclata: les propietats de Construcció perden el 30%. Rendes -30% este torn.',
  rate_down:
    'El Banc Central abaixa els tipus d\'interés. El crèdit és més barat.',
  agri_subsidy:
    'Subvenció agrícola: reps 50 € si tens propietats d\'Agricultura.',
  tourism_bust:
    'Pandèmia global: el turisme cau un 25%. Rendes de Turisme -25% este torn.',
  tourism_boom:
    'Boom turístic: Europa bat rècords de visitants. Rendes de Turisme +30% este torn.',
  trade_war: 'Guerra comercial: tots els jugadors paguen 30 € en aranzels.',
  public_fund:
    'Repartiment del fons públic: cada jugador rep 75 € del tresor.',
  banking_crisis:
    'Crisi bancària: el sector Finances perd el 30% del seu valor. Rendes -30% este torn.',
  green_subsidy:
    'Subvenció verda: reps 40 € si tens propietats d\'Energia.',
  industry_bust:
    'Recessió industrial: les fàbriques tanquen. Rendes d\'Indústria -25% este torn.',
  tax_holiday: 'Vacances fiscals! El pròxim impost no es cobra.',
  inflation:
    'Inflació descontrolada: tots els preus pugen un 15%. (Efecte informatiu este torn.)',
  construction_boom:
    'Pla d\'infraestructures: Rendes de Construcció +30% este torn.',
  inheritance: 'Herència inesperada: el jugador actual rep 100 €.',
  regulation_fine:
    'Nova regulació: el jugador amb més patrimoni paga 50 €. (Efecte informatiu este torn.)',
  free_rd:
    'Avanç tecnològic: la pròxima millora de R+D és gratuïta. (Efecte informatiu este torn.)',
  health_reform:
    'Reforma sanitària: el sector Serveis guanya un 20% de valor. Rendes +20% este torn.',
  harvest_boom:
    'Collita extraordinària: Rendes d\'Agricultura +30% este torn.',
};

// --- Resolvers -------------------------------------------------------------
export function localizeCells(locale: Locale): Cell[] {
  if (locale !== 'ca') return CELLS;
  return CELLS.map((c) => {
    const label = CELLS_CA[c.id] ?? c.label;
    return c.property
      ? { ...c, label, property: { ...c.property, label } }
      : { ...c, label };
  });
}

export function localizeSectorLabel(locale: Locale): Record<SectorId, string> {
  return locale === 'ca' ? SECTOR_LABEL_CA : SECTOR_LABEL;
}

export function localizeNewsCard(card: NewsCard, locale: Locale): string {
  return (locale === 'ca' ? NEWS_CARDS_CA[card.id] : undefined) ?? card.text;
}
