import { describe, it, expect } from 'vitest';
import { ui, t } from './ui';
import { LOCALES } from './locale';

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
});
