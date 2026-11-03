import { describe, it, expect } from 'vitest';
// stonks
import { ASSETS, NEWS, CARDS, LIFE_EVENTS, CLASS_CARD_ID } from '@/lib/games/stonks/data';
import {
  ASSETS_CA, NEWS_CA, CARD_BODIES_CA, LIFE_EVENTS_CA,
  localizeAsset, localizeNews, localizeCard,
} from './stonks-ca';
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
  it('every asset id has a Valencian label, non-empty', () => {
    for (const a of ASSETS) {
      expect(ASSETS_CA[a.id], `asset ${a.id}`).toBeTruthy();
      expect(ASSETS_CA[a.id].label, `label ${a.id}`).toBeTruthy();
    }
  });

  it('every company keeps its blind profile in Valencian too', () => {
    for (const a of ASSETS.filter((x) => x.profile)) {
      expect(ASSETS_CA[a.id].profile, `profile ${a.id}`).toBeTruthy();
    }
  });

  it('never leaks a real company name into the Valencian labels either', () => {
    for (const a of ASSETS.filter((x) => x.realName)) {
      const shown = `${ASSETS_CA[a.id].label} ${ASSETS_CA[a.id].profile ?? ''}`.toLowerCase();
      expect(shown, `blind label ${a.id}`).not.toContain(a.realName!.toLowerCase());
    }
  });

  it('every life event id is translated, non-empty', () => {
    for (const e of LIFE_EVENTS) {
      expect(LIFE_EVENTS_CA[e.id], `life event ${e.id}`).toBeTruthy();
    }
  });

  it('localizeAsset actually swaps the label under ca', () => {
    const a = ASSETS[0];
    expect(localizeAsset(a, 'ca').label).not.toBe(a.label);
    expect(localizeAsset(a, 'es').label).toBe(a.label);
  });

  it('every semester headline is translated, and nothing extra', () => {
    const keys = NEWS.map((n) => `${n.year}-${n.half}`);
    for (const k of keys) expect(NEWS_CA[k], `headline ${k}`).toBeTruthy();
    expect(Object.keys(NEWS_CA).sort()).toEqual([...keys].sort());
    const n = NEWS[0];
    expect(localizeNews(n.year, n.half, n.text, 'ca')).not.toBe(n.text);
  });

  it('every card is translated paragraph by paragraph, and nothing extra', () => {
    for (const c of CARDS) {
      const ca = CARD_BODIES_CA[c.id];
      expect(ca, `card ${c.id}`).toBeTruthy();
      expect(ca.title, `card title ${c.id}`).toBeTruthy();
      expect(ca.body.length, `card ${c.id} paragraph count`).toBe(c.body.length);
      for (const p of ca.body) expect(p, `card ${c.id} empty paragraph`).toBeTruthy();
    }
    expect(Object.keys(CARD_BODIES_CA).sort()).toEqual(CARDS.map((c) => c.id).sort());
    expect(localizeCard(CARDS[0], 'ca')).not.toEqual(CARDS[0]);
  });

  it('never leaks a real company name into a Valencian card shown during play', () => {
    for (const a of ASSETS.filter((x) => x.realName)) {
      const ca = CARD_BODIES_CA[a.id];
      if (!ca) continue;
      const text = `${ca.title} ${ca.body.join(' ')}`.toLowerCase();
      expect(text, `blind card ${a.id}`).not.toContain(a.realName!.toLowerCase());
      const intro = CARD_BODIES_CA[CLASS_CARD_ID];
      if (intro) {
        expect(`${intro.title} ${intro.body.join(' ')}`.toLowerCase(), `class card leaks ${a.id}`)
          .not.toContain(a.realName!.toLowerCase());
      }
    }
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
