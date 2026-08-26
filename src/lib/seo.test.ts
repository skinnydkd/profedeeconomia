import { describe, it, expect } from 'vitest';
import { jsonLdToString, organizationLd, articleLd, courseLd, itemListLd, faqLd, SAME_AS, pageTitle, MAX_TITLE_CHARS, quizLd } from './seo';

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

describe('pageTitle — length-aware brand suffix (§5.7)', () => {
  it('appends the brand when the title has room', () => {
    expect(pageTitle('Juegos')).toBe('Juegos — profedeeconomia');
  });

  it('drops the brand when appending it would overflow the display budget', () => {
    const long = 'Corrige el CV imposible: encuentra y arregla los 15 errores';
    expect(long.length + ' — profedeeconomia'.length).toBeGreaterThan(MAX_TITLE_CHARS);
    expect(pageTitle(long)).toBe(long);
  });

  it('never emits a title longer than the budget purely because of the brand', () => {
    for (let n = 1; n <= 120; n++) {
      const t = 'x'.repeat(n);
      const out = pageTitle(t);
      expect(out === t || out.length <= MAX_TITLE_CHARS).toBe(true);
    }
  });

  it('respects an explicit opt-out even when the brand would fit', () => {
    expect(pageTitle('Juegos', false)).toBe('Juegos');
  });

  it('does not double the brand on a title that already ends with it', () => {
    expect(pageTitle('Algo — profedeeconomia')).toBe('Algo — profedeeconomia');
  });
});

describe('quizLd — Education Q&A (§5.5)', () => {
  const base = { name: 'Test · Unidad 3', about: 'DAFO', educationalLevel: '4.º ESO', path: '/fopp-4eso/tests/03/' };

  it('maps a multiple-choice question to one accepted and the rest suggested', () => {
    const ld = quizLd({
      ...base,
      questions: [
        { tipo: 'opcion-multiple', enunciado: '¿Qué es el **DAFO**?', opciones: ['Mal', 'Bien', 'Peor'], correcta: 1, explicacion: 'Porque *sí*.' },
      ],
    })!;
    expect(ld['@type']).toBe('Quiz');
    const q = ld.hasPart[0] as Record<string, any>;
    expect(q.eduQuestionType).toBe('Multiple choice');
    expect(q.text).toBe('¿Qué es el DAFO?'); // Markdown stripped
    expect(q.acceptedAnswer.text).toBe('Bien');
    expect(q.acceptedAnswer.answerExplanation.text).toBe('Porque sí.');
    expect(q.suggestedAnswer.map((s: any) => s.text)).toEqual(['Mal', 'Peor']);
  });

  it('renders true/false in the page language', () => {
    const es = quizLd({ ...base, questions: [{ tipo: 'verdadero-falso', enunciado: 'X', correcta: true }] })!;
    expect((es.hasPart[0] as any).acceptedAnswer.text).toBe('Verdadero');
    const ca = quizLd({ ...base, locale: 'ca', questions: [{ tipo: 'verdadero-falso', enunciado: 'X', correcta: false }] })!;
    expect((ca.hasPart[0] as any).acceptedAnswer.text).toBe('Fals');
    expect(ca.inLanguage).toBe('ca-ES');
  });

  it('carries the unit on a numeric answer', () => {
    const ld = quizLd({ ...base, questions: [{ tipo: 'numerico', enunciado: 'X', respuesta: 12, unidad: '€' }] })!;
    expect((ld.hasPart[0] as any).acceptedAnswer.text).toBe('12 €');
    expect((ld.hasPart[0] as any).eduQuestionType).toBe('Flashcard');
  });

  it('skips matching questions, which have no single answer string', () => {
    expect(quizLd({ ...base, questions: [{ tipo: 'relacionar', enunciado: 'X' }] })).toBeNull();
  });

  it('drops a multiple-choice question whose correct index is out of range', () => {
    expect(quizLd({ ...base, questions: [{ tipo: 'opcion-multiple', enunciado: 'X', opciones: ['a'], correcta: 7 }] })).toBeNull();
  });

  it('points at the Valencian URL on a ca page', () => {
    const ld = quizLd({ ...base, locale: 'ca', questions: [{ tipo: 'numerico', enunciado: 'X', respuesta: 1 }] })!;
    expect(ld.url).toContain('/ca/fopp-4eso/tests/03/');
  });
});
