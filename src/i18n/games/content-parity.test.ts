import { describe, it, expect } from 'vitest';
import { ASSETS, YEAR_NEWS, LIFE_EVENTS } from '@/lib/games/stonks/data';
import {
  ASSETS_CA,
  YEAR_NEWS_CA,
  LIFE_EVENTS_CA,
  localizeAssets,
} from './stonks-ca';

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
