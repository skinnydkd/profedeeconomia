import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ui } from '../i18n/ui';

/**
 * The book components carry their own section labels — «Ejercicio resuelto»,
 * «Voces en desacuerdo», «Vuelve al caso» and the rest. They were written as
 * Spanish literals, so the Valencian edition of every book rendered them in
 * Spanish while its content was translated.
 *
 * These guards keep that from coming back: a label has to come from the shared
 * dictionary, and a component that reads the dictionary has to resolve the
 * active locale rather than assume one.
 */
const DIR = join(import.meta.dirname, '.');
const LOCALIZED = [
  'CasoDilema', 'CasoReal', 'Curiosity', 'EnEstaFase', 'ErroresQueCuestan',
  'KeyTakeaways', 'MirarFora', 'PistaEbau', 'RealExample', 'RetoEtapa',
  'SolvedExercise', 'TldrUnidad', 'VocesDesacuerdo', 'VuelveAlCaso',
];

const read = (name: string) => readFileSync(join(DIR, `${name}.astro`), 'utf8');

describe('book component labels', () => {
  it.each(LOCALIZED)('%s resolves the active locale', (name) => {
    const src = read(name);
    expect(src).toContain("getLocale(Astro.currentLocale)");
    expect(src).toContain("from '@/i18n/ui'");
  });

  it.each(LOCALIZED)('%s takes every label from the dictionary', (name) => {
    const src = read(name);
    // Everything the template prints between tags is either an expression or
    // punctuation; a bare Spanish word there is a literal that was missed.
    const body = src.slice(src.indexOf('---', 3) + 3);
    // «vs» and «TL;DR» are the same string in both languages and are printed
    // as they are on purpose; everything else has to come from the dictionary.
    const IGUALES = new Set(['vs', 'TL;DR']);
    const literals = [...body.matchAll(/>([^<>{}]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^<>{}]*)</g)]
      .map((m) => m[1].trim())
      .filter((s) => s.length > 0 && !IGUALES.has(s));
    expect(literals).toEqual([]);
  });

  it('declares every libro.* key in both languages', () => {
    const keys = Object.keys(ui.es).filter((k) => k.startsWith('libro.'));
    expect(keys.length).toBeGreaterThanOrEqual(20);
    for (const k of keys) {
      expect(ui.ca[k as keyof typeof ui.ca], `missing ca for ${k}`).toBeTruthy();
    }
  });

  it('translates the labels that differ between the two languages', () => {
    // A handful are legitimately identical (Vídeo, Etapa, Entregable:); these
    // are the ones that were visibly wrong in the Valencian edition.
    for (const k of ['libro.ejercicioResuelto', 'libro.vocesDesacuerdo', 'libro.vuelveAlCaso',
                     'libro.ejemploReal', 'libro.casoReal', 'libro.enResumen']) {
      expect(ui.ca[k as keyof typeof ui.ca]).not.toBe(ui.es[k as keyof typeof ui.es]);
    }
  });

  it('leaves the components that never had a label alone', () => {
    const sinEtiqueta = readdirSync(DIR)
      .filter((f) => f.endsWith('.astro'))
      .filter((f) => !LOCALIZED.includes(f.replace('.astro', '')));
    expect(sinEtiqueta.length).toBeGreaterThan(0);
  });
});
