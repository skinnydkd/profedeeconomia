import { describe, it, expect } from 'vitest';
import { subjectFaqs } from './faq';
import { ASIGNATURAS } from './asignaturas';

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
