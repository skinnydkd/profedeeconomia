// src/lib/games/stonks/lessons.test.ts
import { describe, it, expect } from 'vitest';
import { buildLessons } from './lessons';
import { createInitialState, TOTAL_ROUNDS } from './engine';
import type { GameState } from './types';

const finished = (over: Partial<GameState> = {}): GameState => ({
  ...createInitialState(() => 0.5),
  startYear: 2001,
  round: TOTAL_ROUNDS,
  phase: 'finished',
  history: Array.from({ length: TOTAL_ROUNDS }, (_, i) => ({
    year: 2001 + Math.floor(i / 2),
    half: (i % 2) as 0 | 1,
    nominal: 5000 * (1 + i / 50),
    real: 5000,
    ai: 5000 * (1 + i / 40),
  })),
  ...over,
});

describe('buildLessons', () => {
  it('returns between three and six sentences', () => {
    const l = buildLessons(finished());
    expect(l.length).toBeGreaterThanOrEqual(3);
    expect(l.length).toBeLessThanOrEqual(6);
  });

  it('always says how the player did against the benchmark', () => {
    expect(buildLessons(finished()).join(' ')).toMatch(/El Mercado/);
  });

  it('calls out the gap when inflation ate the gain', () => {
    const s = finished({
      startYear: 1971,
      history: Array.from({ length: TOTAL_ROUNDS }, (_, i) => ({
        year: 1971 + Math.floor(i / 2),
        half: (i % 2) as 0 | 1,
        nominal: 5000 * (1 + i / 10),
        real: 4000,
        ai: 5000,
      })),
    });
    expect(buildLessons(s).join(' ')).toMatch(/poder adquisitivo/i);
  });

  it('stays quiet about inflation when real value kept up with nominal', () => {
    const s = finished({
      history: Array.from({ length: TOTAL_ROUNDS }, (_, i) => ({
        year: 2001 + Math.floor(i / 2),
        half: (i % 2) as 0 | 1,
        nominal: 5000 + i,
        real: 5000 + i,
        ai: 5000,
      })),
    });
    expect(buildLessons(s).join(' ')).not.toMatch(/poder adquisitivo/i);
  });

  it('never tells a player who did not trade what their trading cost', () => {
    const text = buildLessons(finished({ totalCosts: 0 })).join(' ');
    expect(text).not.toMatch(/te ha costado/i);
    expect(text).toMatch(/no has pagado/i);
  });

  it('reports the real cost when there was trading', () => {
    // es-ES writes four-digit numbers without a thousands separator, so this
    // is '4200' and not '4.200'. Accept either rather than pinning the locale.
    const text = buildLessons(finished({ totalCosts: 4200 })).join(' ');
    expect(text).toMatch(/4\.?200/);
    expect(text).toMatch(/comisiones e impuestos/);
  });

  it('mentions concentration only when it actually happened', () => {
    expect(buildLessons(finished({ peakStockShare: 0.62 })).join(' ')).toMatch(/62 %/);
    expect(buildLessons(finished({ peakStockShare: 0.05 })).join(' ')).not.toMatch(/una sola empresa/i);
  });

  it('names a company that died, and only if one did', () => {
    expect(buildLessons(finished({ deaths: ['e_terra'] })).join(' ')).toMatch(/Terra/);
    expect(buildLessons(finished({ deaths: [] })).join(' ')).not.toMatch(/desapareció/);
  });

  it('survives a game with an empty history', () => {
    const l = buildLessons(finished({ history: [] }));
    expect(l.length).toBeGreaterThanOrEqual(3);
  });
});

describe('the sentence about companies that disappeared', () => {
  it('agrees in the singular for one company', () => {
    const l = buildLessons(finished({ deaths: ['e_enron'] })).join(' ');
    expect(l).toContain('Enron desapareció durante tu partida');
    expect(l).toContain('No quebró por sorpresa');
  });

  it('agrees in the plural for two — a run can kill more than one', () => {
    const l = buildLessons(finished({ deaths: ['e_enron', 'e_terra'] })).join(' ');
    expect(l).toContain('Enron y Terra desaparecieron durante tu partida');
    expect(l).toContain('No quebraron por sorpresa');
    expect(l).not.toContain('desapareció');
    expect(l).not.toContain('No quebró');
  });
});

describe('buildLessons in Valencian', () => {
  it('speaks Valencian under ca, Spanish by default', () => {
    expect(buildLessons(finished(), 'ca').join(' ')).toMatch(/«El Mercat»/);
    expect(buildLessons(finished()).join(' ')).toMatch(/«El Mercado»/);
  });

  it('keeps the same rules: cost only when there was trading', () => {
    expect(buildLessons(finished({ totalCosts: 0 }), 'ca').join(' ')).toMatch(/No has pagat/);
    expect(buildLessons(finished({ totalCosts: 4200 }), 'ca').join(' ')).toMatch(/comissions i impostos/);
  });

  it('agrees in number for the companies that disappeared', () => {
    expect(buildLessons(finished({ deaths: ['e_enron'] }), 'ca').join(' '))
      .toContain('Enron va desaparéixer durant la teua partida');
    expect(buildLessons(finished({ deaths: ['e_enron', 'e_terra'] }), 'ca').join(' '))
      .toContain('Enron i Terra van desaparéixer durant la teua partida');
  });

  it('pads a quiet game with Valencian generic lessons, never Spanish ones', () => {
    const l = buildLessons(finished({ history: [] }), 'ca').join(' ');
    expect(l).not.toMatch(/riesgo|interés compuesto|impuesto/);
  });
});
