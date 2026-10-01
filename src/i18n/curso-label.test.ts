import { describe, expect, it } from 'vitest';
import { ASIGNATURAS } from '@/lib/asignaturas';
import { cursoLabel } from './ui';

describe('cursoLabel', () => {
  it('names the course of every subject in both languages', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      for (const locale of ['es', 'ca'] as const) {
        expect(cursoLabel(a.curso, locale), `${a.slug} (${locale})`).toBeTruthy();
      }
    }
  });

  it('labels the Bachillerato optional subjects as optativas', () => {
    expect(cursoLabel('bach', 'es')).toBe('Optativas (1.º/2.º)');
    expect(cursoLabel('bach', 'ca')).toBe('Optatives (1r/2n)');
  });
});
