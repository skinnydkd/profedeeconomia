import { describe, it, expect } from 'vitest';
import { MAX_INICIOS_POR_VENTANA, permitirInicio, VENTANA_MS } from './rate-limit';

describe('permitirInicio', () => {
  it('lets a class of 25 behind one IP play two rounds within the hour', () => {
    const store = new Map<string, number[]>();
    let now = 0;
    for (let ronda = 0; ronda < 2; ronda++) {
      for (let alumno = 0; alumno < 25; alumno++) {
        expect(permitirInicio(store, '88.12.34.56', now)).toBe(true);
        now += 500; // they start within a few seconds of each other
      }
      now += 20 * 60 * 1000; // a 20-minute round
    }
  });

  it('stops a flood from one IP inside the same minute', () => {
    const store = new Map<string, number[]>();
    for (let i = 0; i < MAX_INICIOS_POR_VENTANA; i++) expect(permitirInicio(store, 'x', i)).toBe(true);
    expect(permitirInicio(store, 'x', 100)).toBe(false);
    expect(permitirInicio(store, 'y', 100)).toBe(true);
    expect(permitirInicio(store, 'x', VENTANA_MS + 100)).toBe(true);
  });

  it('sweeps stale IPs so the map does not grow forever', () => {
    const store = new Map<string, number[]>();
    for (let i = 0; i < 5001; i++) permitirInicio(store, `ip-${i}`, 0);
    permitirInicio(store, 'nueva', VENTANA_MS * 2);
    expect(store.size).toBe(1);
  });
});
