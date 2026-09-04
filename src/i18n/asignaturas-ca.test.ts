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

describe('ASIGNATURAS_CA — seoTitle', () => {
  const MAX_TITLE_CHARS = 60;

  it('every published asignatura has a Valencian seoTitle', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      if (a.estado !== 'publicado') continue;
      expect(ASIGNATURAS_CA[a.slug]?.seoTitle?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('keeps every Valencian seoTitle inside the display budget', () => {
    for (const o of Object.values(ASIGNATURAS_CA)) {
      expect((o.seoTitle ?? '').length).toBeLessThanOrEqual(MAX_TITLE_CHARS);
    }
  });

  it('front-loads the same acronym as the ES title — teachers search it in both languages', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      const overlay = ASIGNATURAS_CA[a.slug];
      if (!overlay?.seoTitle) continue;
      const head = a.shortLabel.split(' ')[0];
      // Acronym subjects keep the acronym verbatim; named ones are translated
      // (Economía → Economia, Taller de Economía → Taller d'Economia).
      if (head === head.toUpperCase()) expect(overlay.seoTitle.startsWith(head)).toBe(true);
    }
  });

  it('ca overlays the Valencian seoTitle onto the asignatura', () => {
    expect(localizeAsignatura(ASIGNATURAS['fopp-4eso'], 'ca').seoTitle).toBe(
      'FOPP 4t ESO: llibre, diapositives i activitats gratis',
    );
  });
});

describe('ASIGNATURAS_CA — seoName', () => {
  it('every published asignatura has a Valencian seoName', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      if (a.estado !== 'publicado') continue;
      expect(ASIGNATURAS_CA[a.slug]?.seoName?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('every Valencian seoTitle starts with its Valencian seoName', () => {
    for (const o of Object.values(ASIGNATURAS_CA)) {
      if (!o.seoTitle || !o.seoName) continue;
      expect(o.seoTitle.startsWith(o.seoName)).toBe(true);
    }
  });

  it('leaves room for the child-page prefix it gets composed into', () => {
    for (const o of Object.values(ASIGNATURAS_CA)) {
      expect(`Llibre de ${o.seoName} en PDF gratis`.length).toBeLessThanOrEqual(60);
    }
  });
});
