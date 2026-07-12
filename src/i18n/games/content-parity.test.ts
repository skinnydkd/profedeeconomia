import { describe, it, expect } from 'vitest';
// stonks
import { ASSETS, YEAR_NEWS, LIFE_EVENTS } from '@/lib/games/stonks/data';
import { ASSETS_CA, YEAR_NEWS_CA, LIFE_EVENTS_CA, localizeAssets } from './stonks-ca';
// econopoly
import { CELLS, SECTOR_LABEL } from '@/lib/games/econopoly/board';
import { NEWS_CARDS } from '@/lib/games/econopoly/events';
import { CELLS_CA, SECTOR_LABEL_CA, NEWS_CARDS_CA } from './econopoly-ca';
// econrisk
import { FACTIONS } from '@/lib/games/econrisk/factions';
import { EVENT_CARDS } from '@/lib/games/econrisk/events';
import { TERRITORIES } from '@/lib/games/econrisk/map';
import { FACTIONS_CA, EVENT_CARDS_CA, TERRITORIES_CA } from './econrisk-ca';
// seguros
import { INSURANCES, EVENT_DECK, DEFAULT_CONFIG } from '@/lib/games/seguros/data';
import { INSURANCES_CA, EVENT_DECK_CA, TEAM_NAMES_CA } from './seguros-ca';

/**
 * Content overlay completeness: every id/key present in the Spanish game data
 * must have a non-empty Valencian translation. A missing id would silently fall
 * back to Spanish at render time — this guard makes that fail loudly instead.
 */
describe('stonks content overlay completeness', () => {
  it('every asset id is translated (label + blurb), non-empty', () => {
    for (const a of ASSETS) {
      expect(ASSETS_CA[a.id], `asset ${a.id}`).toBeTruthy();
      expect(ASSETS_CA[a.id].label, `label ${a.id}`).toBeTruthy();
      expect(ASSETS_CA[a.id].blurb, `blurb ${a.id}`).toBeTruthy();
    }
  });

  it('every YEAR_NEWS year is translated, non-empty', () => {
    for (const year of Object.keys(YEAR_NEWS)) {
      expect(YEAR_NEWS_CA[Number(year)], `year ${year}`).toBeTruthy();
    }
  });

  it('every life event id is translated, non-empty', () => {
    for (const e of LIFE_EVENTS) {
      expect(LIFE_EVENTS_CA[e.id], `life event ${e.id}`).toBeTruthy();
    }
  });

  it('localizeAssets actually swaps the label under ca', () => {
    const es = localizeAssets('es');
    const ca = localizeAssets('ca');
    expect(ca.some((a, i) => a.label !== es[i].label)).toBe(true);
  });
});

describe('econopoly content overlay completeness', () => {
  it('every labelled board cell is translated, non-empty', () => {
    for (const cell of CELLS) {
      if (cell.label) {
        expect(CELLS_CA[cell.id], `cell ${cell.id}`).toBeTruthy();
      }
    }
  });

  it('every sector label is translated, non-empty', () => {
    for (const key of Object.keys(SECTOR_LABEL)) {
      expect(SECTOR_LABEL_CA[key as keyof typeof SECTOR_LABEL_CA], `sector ${key}`).toBeTruthy();
    }
  });

  it('every news card id is translated, non-empty', () => {
    for (const card of NEWS_CARDS) {
      expect(NEWS_CARDS_CA[card.id], `news ${card.id}`).toBeTruthy();
    }
  });
});

describe('econrisk content overlay completeness', () => {
  it('every faction is translated (label + school + power), non-empty', () => {
    for (const f of FACTIONS) {
      expect(FACTIONS_CA[f.id], `faction ${f.id}`).toBeTruthy();
      expect(FACTIONS_CA[f.id].label, `label ${f.id}`).toBeTruthy();
      expect(FACTIONS_CA[f.id].school, `school ${f.id}`).toBeTruthy();
      expect(FACTIONS_CA[f.id].power, `power ${f.id}`).toBeTruthy();
    }
  });

  it('every event card id is translated, non-empty', () => {
    for (const card of EVENT_CARDS) {
      expect(EVENT_CARDS_CA[card.id], `event ${card.id}`).toBeTruthy();
    }
  });

  it('every territory id is translated, non-empty', () => {
    for (const t of TERRITORIES) {
      expect(TERRITORIES_CA[t.id], `territory ${t.id}`).toBeTruthy();
    }
  });
});

describe('seguros content overlay completeness', () => {
  it('every insurance key is translated, non-empty', () => {
    for (const ins of INSURANCES) {
      expect(INSURANCES_CA[ins.key], `insurance ${ins.key}`).toBeTruthy();
    }
  });

  it('every event deck card key is translated, non-empty', () => {
    for (const card of EVENT_DECK) {
      expect(EVENT_DECK_CA[card.key], `event ${card.key}`).toBeTruthy();
    }
  });

  it('every default team name is translated, non-empty', () => {
    for (const name of DEFAULT_CONFIG.teamNames) {
      expect(TEAM_NAMES_CA[name], `team ${name}`).toBeTruthy();
    }
  });
});
