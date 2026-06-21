import { describe, it, expect } from 'vitest';
import { jsonLdToString, organizationLd, articleLd, courseLd, itemListLd, faqLd, SAME_AS } from './seo';

describe('jsonLdToString', () => {
  it('escapes < to avoid </script> injection', () => {
    const result = jsonLdToString({ name: '</script><script>alert(1)</script>' });
    expect(result).not.toContain('</script>');
    expect(result).toContain('\\u003c');
  });

  it('produces valid JSON after unescaping \\u003c', () => {
    const obj = { title: 'Economía <básica>', value: 42 };
    const str = jsonLdToString(obj);
    // The JSON parser understands < as < so round-trip is lossless.
    const parsed = JSON.parse(str);
    expect(parsed).toEqual(obj);
  });

  it('leaves regular content untouched', () => {
    const result = jsonLdToString({ name: 'profedeeconomia', type: 'Organization' });
    expect(result).toContain('profedeeconomia');
    expect(result).toContain('Organization');
  });
});

describe('seo structured-data builders', () => {
  it('organizationLd is an EducationalOrganization with entity links', () => {
    const org = organizationLd() as Record<string, unknown>;
    expect(org['@type']).toBe('EducationalOrganization');
    expect(org.sameAs).toEqual([...SAME_AS]);
    expect(Array.isArray(org.knowsAbout)).toBe(true);
  });

  it('articleLd is a dual Article/LearningResource with absolute image', () => {
    const ld = articleLd({
      title: 'Unidad 1',
      description: 'desc',
      path: '/edmn-2bach/libro/01-x/',
      datePublished: '2026-05-10',
      image: '/og/edmn-2bach.png',
      educationalLevel: '2.º Bachillerato',
      teaches: ['empresa', 'emprendimiento'],
    });
    expect(ld['@type']).toEqual(['Article', 'LearningResource']);
    expect(ld.image).toBe('https://www.profedeeconomia.es/og/edmn-2bach.png');
    expect(ld.teaches).toEqual(['empresa', 'emprendimiento']);
    expect(ld.educationalLevel).toBe('2.º Bachillerato');
  });

  it('articleLd falls back dateModified to datePublished and omits empty teaches', () => {
    const ld = articleLd({
      title: 't',
      description: 'd',
      path: '/x/',
      datePublished: '2026-05-10',
      teaches: [],
    });
    expect(ld.dateModified).toBe('2026-05-10');
    expect(ld.teaches).toBeUndefined();
  });

  it('articleLd prefers an explicit dateModified', () => {
    const ld = articleLd({
      title: 't',
      description: 'd',
      path: '/x/',
      datePublished: '2026-05-10',
      dateModified: '2026-06-20',
    });
    expect(ld.dateModified).toBe('2026-06-20');
  });

  it('courseLd carries LOMLOE educationalAlignment and provider', () => {
    const ld = courseLd({
      name: 'Economía (1.º Bachillerato)',
      description: 'd',
      path: '/eco-1bach/',
      educationalLevel: '1.º Bachillerato',
      marcoNormativo: 'Real Decreto 243/2022',
      targetName: 'Economía, 1.º Bachillerato',
    }) as Record<string, any>;
    expect(ld['@type']).toBe('Course');
    expect(ld.isAccessibleForFree).toBe(true);
    expect(ld.educationalAlignment.educationalFramework).toBe('LOMLOE — Real Decreto 243/2022');
    expect(ld.provider['@type']).toBe('EducationalOrganization');
  });

  it('faqLd builds a FAQPage with Question/Answer pairs', () => {
    const ld = faqLd([{ q: '¿Es gratis?', a: 'Sí, gratis.' }]) as Record<string, any>;
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity[0]['@type']).toBe('Question');
    expect(ld.mainEntity[0].name).toBe('¿Es gratis?');
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe('Sí, gratis.');
  });

  it('itemListLd numbers items from 1 with absolute urls', () => {
    const ld = itemListLd({
      name: 'Índice',
      items: [
        { name: 'U1', path: '/a/libro/01/' },
        { name: 'U2', path: '/a/libro/02/' },
      ],
    }) as Record<string, any>;
    expect(ld.numberOfItems).toBe(2);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].url).toBe('https://www.profedeeconomia.es/a/libro/02/');
  });
});
