import { describe, it, expect } from 'vitest';
import { TERRITORIES, byId, CONTINENTS, CONTINENT_BONUS, continentTerritories } from './map';

describe('econrisk map', () => {
  it('has 24 territories across 6 continents', () => {
    expect(TERRITORIES.length).toBe(24);
    expect(CONTINENTS.length).toBe(6);
  });
  it('every continent has at least 2 territories and a positive bonus', () => {
    for (const c of CONTINENTS) {
      expect(continentTerritories(c).length).toBeGreaterThanOrEqual(2);
      expect(CONTINENT_BONUS[c]).toBeGreaterThan(0);
    }
  });
  it('adjacency is symmetric and references valid ids', () => {
    for (const t of TERRITORIES) {
      for (const n of t.adj) {
        expect(byId[n]).toBeTruthy();
        expect(byId[n].adj).toContain(t.id);
      }
    }
  });
  it('every territory has node coordinates within the viewBox', () => {
    for (const t of TERRITORIES) {
      expect(t.x).toBeGreaterThanOrEqual(0); expect(t.x).toBeLessThanOrEqual(600);
      expect(t.y).toBeGreaterThanOrEqual(0); expect(t.y).toBeLessThanOrEqual(360);
    }
  });
  it('the map is a connected graph', () => {
    const seen = new Set<string>(); const stack = [TERRITORIES[0].id];
    while (stack.length) { const id = stack.pop()!; if (seen.has(id)) continue; seen.add(id); stack.push(...byId[id].adj); }
    expect(seen.size).toBe(TERRITORIES.length);
  });
});
