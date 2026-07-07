import { describe, it, expect } from 'vitest';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { localizeAsignatura, ASIGNATURAS_CA } from './asignaturas-ca';

describe('localizeAsignatura', () => {
  it('es returns the original object unchanged', () => {
    const a = ASIGNATURAS['edmn-2bach'];
    expect(localizeAsignatura(a, 'es')).toEqual(a);
  });
  it('ca overlays the Valencian title', () => {
    const a = localizeAsignatura(ASIGNATURAS['edmn-2bach'], 'ca');
    expect(a.title).toBe('Empresa i Disseny de Models de Negoci');
    expect(a.slug).toBe('edmn-2bach'); // structural fields preserved
  });
  it('every CA overlay key is a real asignatura slug', () => {
    for (const slug of Object.keys(ASIGNATURAS_CA)) {
      expect(ASIGNATURAS[slug as keyof typeof ASIGNATURAS]).toBeDefined();
    }
  });
  it('every published asignatura has a CA overlay', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      if (a.estado === 'publicado') {
        expect(ASIGNATURAS_CA[a.slug]).toBeDefined();
      }
    }
  });
});
