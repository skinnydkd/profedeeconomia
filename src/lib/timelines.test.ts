import { describe, it, expect } from 'vitest';
import { euIntegrationTimeline, itinerariosPostESOTimeline } from './timelines';

describe('timeline datasets', () => {
  const datasets = {
    euIntegrationTimeline,
    itinerariosPostESOTimeline,
  };

  for (const [name, events] of Object.entries(datasets)) {
    describe(name, () => {
      it('is a non-empty array', () => {
        expect(Array.isArray(events)).toBe(true);
        expect(events.length).toBeGreaterThan(0);
      });

      it('every event has a year, a non-empty title and a non-empty description', () => {
        for (const ev of events) {
          expect(ev.year === '' || ev.year === undefined).toBe(false);
          expect(typeof ev.title).toBe('string');
          expect(ev.title.trim().length).toBeGreaterThan(0);
          expect(typeof ev.description).toBe('string');
          expect(ev.description.trim().length).toBeGreaterThan(10);
        }
      });
    });
  }

  it('EU integration milestones are in chronological order', () => {
    // Use the first 4-digit year found in each label to compare.
    const firstYear = (y: string | number) =>
      typeof y === 'number' ? y : parseInt(String(y).match(/\d{4}/)?.[0] ?? '0', 10);
    const years = euIntegrationTimeline.map((e) => firstYear(e.year));
    const sorted = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sorted);
  });

  it('EU timeline includes the milestones referenced by Eco 1BACH Unit 12', () => {
    const years = euIntegrationTimeline.map((e) => String(e.year));
    expect(years).toContain('1951'); // CECA
    expect(years).toContain('1957'); // Tratados de Roma
    expect(years).toContain('1986'); // España entra en la CEE
    expect(years).toContain('1992'); // Maastricht
  });
});
