// src/lib/games/stonks/data/assets.test.ts
import { describe, it, expect } from 'vitest';
import {
  ASSETS, ASSET_IDS, STOCK_IDS, STAR_STOCKS, DOOMED_STOCKS, assetMeta, isAvailable,
} from './assets';

describe('asset catalogue', () => {
  it('holds 18 assets: 9 base and 9 companies', () => {
    expect(ASSETS).toHaveLength(18);
    expect(STOCK_IDS).toHaveLength(9);
    expect(ASSETS.filter((a) => a.group !== 'empresa')).toHaveLength(9);
  });

  it('has unique ids', () => {
    expect(new Set(ASSET_IDS).size).toBe(ASSET_IDS.length);
  });

  it('gives every company a blind profile and a real name', () => {
    for (const id of STOCK_IDS) {
      const a = assetMeta[id];
      expect(a.profile, `profile ${id}`).toBeTruthy();
      expect(a.realName, `realName ${id}`).toBeTruthy();
      expect(a.group).toBe('empresa');
    }
  });

  it('never leaks a real company name into the labels shown during play', () => {
    for (const id of STOCK_IDS) {
      const a = assetMeta[id];
      const shown = `${a.label} ${a.profile}`.toLowerCase();
      expect(shown, `blind label ${id}`).not.toContain(a.realName!.toLowerCase());
    }
  });

  it('gives every doomed company an end date and a final return', () => {
    for (const id of DOOMED_STOCKS) {
      const a = assetMeta[id];
      expect(a.untilYear, `untilYear ${id}`).toBeTypeOf('number');
      expect(a.finalReturn, `finalReturn ${id}`).toBeTypeOf('number');
      expect(a.finalReturn!).toBeLessThan(0);
      expect(a.finalReturn!).toBeGreaterThanOrEqual(-1);
    }
  });

  it('wipes out Enron and Banco Popular but not Terra, which was absorbed', () => {
    expect(assetMeta.e_enron.finalReturn).toBe(-1);
    expect(assetMeta.e_popular.finalReturn).toBe(-1);
    expect(assetMeta.e_terra.finalReturn).toBeGreaterThan(-1);
    expect(assetMeta.e_terra.finalReturn).toBeLessThan(-0.8);
  });

  it('keeps stars and doomed companies disjoint', () => {
    expect(STAR_STOCKS.filter((s) => DOOMED_STOCKS.includes(s))).toEqual([]);
  });

  it('only lists real company ids in the star and doomed groups', () => {
    for (const id of [...STAR_STOCKS, ...DOOMED_STOCKS]) {
      expect(STOCK_IDS, `group member ${id}`).toContain(id);
    }
  });

  it('makes the eight core assets available from the first semester of 1971', () => {
    const core = ASSETS.filter((a) => a.group !== 'empresa' && a.id !== 'bitcoin');
    expect(core).toHaveLength(8);
    for (const a of core) expect(isAvailable(a, 1971, 0), a.id).toBe(true);
  });

  it('gates bitcoin to 2011 and Nvidia to 1999', () => {
    expect(isAvailable(assetMeta.bitcoin, 2010, 1)).toBe(false);
    expect(isAvailable(assetMeta.bitcoin, 2011, 0)).toBe(true);
    expect(isAvailable(assetMeta.e_nvda, 1998, 1)).toBe(false);
    expect(isAvailable(assetMeta.e_nvda, 1999, 0)).toBe(true);
  });

  it('respects the half a company listed in, not just the year', () => {
    // Microsoft listed in March 1986 but the catalogue puts it in H2 1986.
    expect(isAvailable(assetMeta.e_msft, 1986, 0)).toBe(false);
    expect(isAvailable(assetMeta.e_msft, 1986, 1)).toBe(true);
  });

  it('keeps a doomed company available through its final semester and no further', () => {
    expect(isAvailable(assetMeta.e_enron, 2001, 1)).toBe(true);
    expect(isAvailable(assetMeta.e_enron, 2002, 0)).toBe(false);
    expect(isAvailable(assetMeta.e_popular, 2017, 0)).toBe(true);
    expect(isAvailable(assetMeta.e_popular, 2017, 1)).toBe(false);
  });

  it('marks every company as extreme risk — a single company always is', () => {
    for (const id of STOCK_IDS) expect(assetMeta[id].risk, id).toBe('extrema');
  });
});
