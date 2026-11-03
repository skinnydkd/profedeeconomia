import { describe, it, expect } from 'vitest';
import { estadoMasReciente, intervaloPolling, POLL_DECISIONES_MS, POLL_RAPIDO_MS } from './polling';

describe('intervaloPolling (CODE-SRV-15)', () => {
  it('stops once the league is closed', () => {
    expect(intervaloPolling('cerrada', true)).toBeNull();
  });

  it('stops while the tab is hidden, whatever the phase', () => {
    for (const fase of [undefined, 'decisiones', 'resultados', 'cerrada']) {
      expect(intervaloPolling(fase, false)).toBeNull();
    }
  });

  it('slows down while the teams decide', () => {
    expect(intervaloPolling('decisiones', true)).toBe(POLL_DECISIONES_MS);
    expect(POLL_DECISIONES_MS).toBeGreaterThanOrEqual(15_000);
  });

  it('stays quick while a round closes and before the first answer', () => {
    expect(intervaloPolling('resultados', true)).toBe(POLL_RAPIDO_MS);
    expect(intervaloPolling(undefined, true)).toBe(POLL_RAPIDO_MS);
  });
});

describe('estadoMasReciente', () => {
  const ronda = (n: number, generadoEn?: number) => ({ ronda: n, generadoEn });

  it('takes the first state it gets', () => {
    expect(estadoMasReciente(null, ronda(1, 10))).toEqual(ronda(1, 10));
  });

  it('never lets an older copy replace a newer state', () => {
    // Round 3 is closed and the refresh shows round 4; a poll answered from the
    // CDN copy built before the close must not bring round 3 back.
    expect(estadoMasReciente(ronda(4, 2_000), ronda(3, 1_000))).toEqual(ronda(4, 2_000));
  });

  it('takes a newer state, and any state from a server that does not date them', () => {
    expect(estadoMasReciente(ronda(3, 1_000), ronda(4, 2_000))).toEqual(ronda(4, 2_000));
    expect(estadoMasReciente(ronda(3), ronda(4))).toEqual(ronda(4));
  });
});
