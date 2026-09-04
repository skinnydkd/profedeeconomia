import { describe, it, expect } from 'vitest';
import { subjectFaqs } from './faq';
import { ASIGNATURAS } from './asignaturas';
import { localizeAsignatura } from '@/i18n/asignaturas-ca';

describe('subjectFaqs', () => {
  it('derives accurate FAQ from the asignatura data', () => {
    const a = ASIGNATURAS['edmn-2bach'];
    const faqs = subjectFaqs(a);
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    // first answer reuses the (reviewed) tagline → no drift
    expect(faqs[0].a).toBe(a.tagline);
    // the normativa answer carries the real marco normativo
    expect(faqs.some((f) => f.a.includes(a.marcoNormativo))).toBe(true);
    // gratuito answer mentions the license
    expect(faqs.some((f) => /Creative Commons/.test(f.a))).toBe(true);
    // every entry is a non-empty Q and A
    for (const f of faqs) {
      expect(f.q.length).toBeGreaterThan(0);
      expect(f.a.length).toBeGreaterThan(0);
    }
  });

  it('builds a FAQ for every published subject without throwing', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      const faqs = subjectFaqs(a);
      expect(faqs.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('subjectFaqs — naming questions (§5.4)', () => {
  it('answers the IPE/FOL question on both IPE hubs', () => {
    for (const slug of ['ipe1-fp', 'ipe2-fp'] as const) {
      const faqs = subjectFaqs(ASIGNATURAS[slug]);
      expect(faqs.some((f) => /FOL/.test(f.q))).toBe(true);
      expect(faqs.some((f) => /Ley Orgánica 3\/2022|RD 659\/2023/.test(f.a))).toBe(true);
    }
  });

  it('answers what FOPP is, and that it is not FOL', () => {
    const faqs = subjectFaqs(ASIGNATURAS['fopp-4eso']);
    expect(faqs.some((f) => /FOPP/.test(f.q) && /FOL/.test(f.q))).toBe(true);
    expect(faqs.some((f) => /Formación y Orientación Personal y Profesional/.test(f.a))).toBe(true);
  });

  it('leaves the derived entries first, so the tagline still leads', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(subjectFaqs(a)[0].a).toBe(a.tagline);
    }
  });

  it('adds naming questions only where a real naming confusion exists', () => {
    const withNaming = Object.values(ASIGNATURAS).filter((a) => subjectFaqs(a).length > 4);
    expect(withNaming.map((a) => a.slug).sort()).toEqual(['fopp-4eso', 'ipe1-fp', 'ipe2-fp']);
  });
});

describe('subjectFaqs — locale (§5.8)', () => {
  it('answers in Valencian on a ca hub, including the naming questions', () => {
    const a = localizeAsignatura(ASIGNATURAS['fopp-4eso'], 'ca');
    const faqs = subjectFaqs(a, 'ca');
    expect(faqs[0].q).toBe('Què és Formació i Orientació Personal i Professional (4t ESO)?');
    expect(faqs[0].a).toBe(a.tagline);
    expect(faqs.some((f) => /currículum bàsic estatal LOMLOE/.test(f.a))).toBe(true);
    expect(faqs.some((f) => /FOL de 4t d'ESO/.test(f.q))).toBe(true);
  });

  it('never leaks Spanish interrogation marks into a Valencian FAQ', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      for (const f of subjectFaqs(localizeAsignatura(a, 'ca'), 'ca')) {
        expect(f.q).not.toContain('¿');
      }
    }
  });

  it('keeps the same number of entries in both languages', () => {
    for (const a of Object.values(ASIGNATURAS)) {
      expect(subjectFaqs(localizeAsignatura(a, 'ca'), 'ca')).toHaveLength(subjectFaqs(a, 'es').length);
    }
  });

  it('defaults to Spanish when no locale is given', () => {
    expect(subjectFaqs(ASIGNATURAS['fopp-4eso'])[0].q).toContain('¿Qué es');
  });
});
