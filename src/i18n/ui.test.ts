import { describe, it, expect } from 'vitest';
import { ui, t, type UIKey } from './ui';
import { LOCALES } from './locale';
import { SECCIONES_TRANSVERSALES } from '@/lib/asignaturas';

describe('ui dictionary', () => {
  it('every es key exists in every locale (parity)', () => {
    const esKeys = Object.keys(ui.es);
    for (const loc of LOCALES) {
      expect(Object.keys(ui[loc]).sort()).toEqual(esKeys.sort());
    }
  });
  it('t returns the localized string', () => {
    expect(t('footer.tagline', 'ca')).toContain('professorat');
    expect(t('footer.tagline', 'es')).toContain('profesores');
  });
  it('localizes a card CTA to Valencian', () => {
    expect(t('card.abrir', 'es')).toBe('Abrir →');
    expect(t('card.abrir', 'ca')).not.toBe('Abrir →');
  });
  it('every transversal section has label + desc keys in every locale', () => {
    for (const s of SECCIONES_TRANSVERSALES) {
      const labelKey = `sec.${s.slug}.label` as UIKey;
      const descKey = `sec.${s.slug}.desc` as UIKey;
      for (const loc of LOCALES) {
        expect(ui[loc][labelKey]).toBeTruthy();
        expect(ui[loc][descKey]).toBeTruthy();
      }
    }
  });
});
