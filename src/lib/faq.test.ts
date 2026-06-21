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
