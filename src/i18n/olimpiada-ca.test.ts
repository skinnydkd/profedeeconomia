import { describe, it, expect } from 'vitest';
import { GUIA } from '@/lib/olimpiada';
import { localizeGuia } from './olimpiada-ca';

describe('localizeGuia', () => {
  it('es returns the guide unchanged', () => {
    expect(localizeGuia(GUIA, 'es')).toEqual(GUIA);
  });
  it('ca keeps the same number of partes and translates them', () => {
    const guia = localizeGuia(GUIA, 'ca');
    expect(guia.partes.length).toBe(GUIA.partes.length);
    expect(guia.duracion).not.toBe(GUIA.duracion);
    expect(guia.partes[0].nombre).not.toBe(GUIA.partes[0].nombre);
  });
  it('ca keeps the scoring untouched', () => {
    const guia = localizeGuia(GUIA, 'ca');
    expect(guia.total).toBe('10 punts');
    expect(guia.partes.map((p) => p.puntos)).toEqual(['4 pts', '3 pts', '3 pts']);
  });
});
