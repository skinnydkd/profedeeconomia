import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ui } from '../i18n/ui';

/**
 * Shared blocks of the dynamics, debates and entrepreneurship pages used to
 * print Castilian labels on 141 /ca/ pages («Esto se trabaja en…», «Tarjeta
 * de rol», «Ficha del alumno»…). Same guard as libro-i18n.test.ts: resolve
 * the locale and take every label from the dictionary.
 */
const COMPONENTES = [
  'src/components/emprendimiento/PuenteUnidades.astro',
  'src/components/emprendimiento/MapaTransversal.astro',
  'src/components/dinamicas/RoleCard.astro',
  'src/components/dinamicas/FichaAlumno.astro',
  'src/components/debates/FichaAlumno.astro',
];

describe('shared dynamics/debates/entrepreneurship labels', () => {
  it.each(COMPONENTES)('%s resolves the active locale', (path) => {
    const src = readFileSync(path, 'utf8');
    expect(src).toContain('getLocale(Astro.currentLocale)');
    expect(src).toContain("from '@/i18n/ui'");
  });

  it.each(COMPONENTES)('%s prints no bare words between tags', (path) => {
    const src = readFileSync(path, 'utf8');
    const body = src.slice(src.indexOf('---', 3) + 3).replace(/<style[\s\S]*<\/style>/, '');
    const literals = [...body.matchAll(/>([^<>{}]*[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][^<>{}]*)</g)]
      .map((m) => m[1].trim())
      .filter((s) => s.length > 0);
    expect(literals).toEqual([]);
  });

  it('declares the new keys in both languages, translated', () => {
    for (const k of ['puente.titulo', 'puente.unidad', 'puente.competencias', 'rolecard.tag', 'rolecard.corte', 'ficha.tag', 'mapa.lead'] as const) {
      expect(ui.ca[k], `missing ca for ${k}`).toBeTruthy();
      expect(ui.ca[k]).not.toBe(ui.es[k]);
    }
  });
});
