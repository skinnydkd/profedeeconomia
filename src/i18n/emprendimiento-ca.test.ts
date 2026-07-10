import { describe, it, expect } from 'vitest';
import { ITINERARIOS } from '@/lib/emprendimiento';
import { localizeItinerario, ITINERARIOS_CA } from './emprendimiento-ca';

describe('localizeItinerario', () => {
  it('es returns unchanged', () => {
    expect(localizeItinerario(ITINERARIOS[0], 'es')).toEqual(ITINERARIOS[0]);
  });
  it('ca overlays the label and preserves id and fases', () => {
    const it0 = localizeItinerario(ITINERARIOS[0], 'ca');
    expect(it0.id).toBe(ITINERARIOS[0].id);
    expect(it0.fases).toEqual(ITINERARIOS[0].fases);
  });
  it('every overlay key is a real itinerario id + every itinerario has an overlay', () => {
    const ids = new Set<string>(ITINERARIOS.map((i) => i.id));
    for (const key of Object.keys(ITINERARIOS_CA)) expect(ids.has(key)).toBe(true);
    for (const i of ITINERARIOS) expect(ITINERARIOS_CA[i.id]).toBeDefined();
  });
});
