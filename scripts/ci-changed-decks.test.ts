import { describe, it, expect } from 'vitest';
import { allSubjects, decksToCheck, subjectOf, ENGINE_PREFIXES } from './ci-changed-decks.mjs';

/**
 * The deck overflow check is the only thing standing between a too-long slide
 * and a PDF that ships with text spilling out of the 16:9 box. CI runs it only
 * for the subjects this helper names, so a subject wrongly left out is a slide
 * nobody looks at again. Hence the bias in `decksToCheck`, and hence these.
 */
const SUBJECTS = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso'];

describe('subjectOf', () => {
  it('reads the slug out of a unit path', () => {
    expect(subjectOf('src/content/asignaturas/fopp-4eso/libro/07-mundo.mdx')).toBe('fopp-4eso');
    expect(subjectOf('src/content/asignaturas/fopp-4eso/libro/07-mundo.ca.mdx')).toBe('fopp-4eso');
  });

  it('ignores anything that is not a unit', () => {
    expect(subjectOf('src/content/asignaturas/fopp-4eso/tests/07-mundo.md')).toBeNull();
    expect(subjectOf('src/content/asignaturas/fopp-4eso/libro/nested/07.mdx')).toBeNull();
    expect(subjectOf('src/lib/slides/authored.ts')).toBeNull();
    expect(subjectOf('README.md')).toBeNull();
  });
});

describe('decksToCheck', () => {
  it('picks only the subjects whose units changed', () => {
    expect(
      decksToCheck(
        [
          'src/content/asignaturas/fopp-4eso/libro/07-mundo.mdx',
          'src/content/asignaturas/eco-1bach/libro/05-elasticidad.ca.mdx',
        ],
        SUBJECTS,
      ),
    ).toEqual(['eco-1bach', 'fopp-4eso']);
  });

  it('does not repeat a subject that changed in both languages', () => {
    expect(
      decksToCheck(
        [
          'src/content/asignaturas/fopp-4eso/libro/07-mundo.mdx',
          'src/content/asignaturas/fopp-4eso/libro/07-mundo.ca.mdx',
        ],
        SUBJECTS,
      ),
    ).toEqual(['fopp-4eso']);
  });

  it('checks every subject when the slide engine changes', () => {
    for (const prefix of ENGINE_PREFIXES) {
      const path = prefix.endsWith('/') ? `${prefix}something.ts` : prefix;
      expect(decksToCheck([path], SUBJECTS), path).toEqual(SUBJECTS);
    }
  });

  it('checks every subject when an engine change rides along with a content one', () => {
    expect(
      decksToCheck(
        ['src/content/asignaturas/fopp-4eso/libro/07-mundo.mdx', 'src/styles/slides.css'],
        SUBJECTS,
      ),
    ).toEqual(SUBJECTS);
  });

  it('checks nothing when no deck can have moved', () => {
    expect(
      decksToCheck(
        ['README.md', 'src/content/asignaturas/fopp-4eso/tests/07-mundo.md', 'package.json'],
        SUBJECTS,
      ),
    ).toEqual([]);
  });

  it('drops a slug the content tree no longer has', () => {
    expect(
      decksToCheck(['src/content/asignaturas/materia-borrada/libro/01-x.mdx'], SUBJECTS),
    ).toEqual([]);
  });

  it('tolerates the blank line a piped `git diff` leaves at the end', () => {
    expect(
      decksToCheck(['src/content/asignaturas/eco-4eso/libro/01-x.mdx', ''], SUBJECTS),
    ).toEqual(['eco-4eso']);
  });
});

describe('allSubjects', () => {
  it('finds the real subjects in this repository', () => {
    const found = allSubjects();
    expect(found).toEqual(expect.arrayContaining(SUBJECTS));
    expect(found.length).toBeGreaterThanOrEqual(SUBJECTS.length);
  });

  it('returns nothing rather than throwing when the tree is missing', () => {
    expect(allSubjects('does/not/exist')).toEqual([]);
  });
});
