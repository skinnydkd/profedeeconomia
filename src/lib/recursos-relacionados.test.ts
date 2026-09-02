import { describe, it, expect } from 'vitest';
import {
  buildIndiceRecursos, recursosDeUnidad, slugBase, pickByLocale,
  type RecursoEntrada,
} from './recursos-relacionados.ts';

const entradas: RecursoEntrada[] = [
  { tipo: 'juego', slug: 'econrisk', title: 'Econrisk', href: '/juegos/econrisk/', familiaColorVar: '--color-terra',
    unidades: [{ asignatura: 'eco-1bach', unidad: 1, nota: 'Escuelas de pensamiento.' }] },
  { tipo: 'dinamica', slug: '01-tragedia-comunes', title: 'La tragedia de los comunes', href: '/dinamicas/decisiones-comunes/01-tragedia-comunes/', familiaColorVar: '--color-taller3',
    unidades: [{ asignatura: 'eco-1bach', unidad: 6 }, { asignatura: 'eeae-bach', unidad: 3 }] },
];

describe('buildIndiceRecursos / recursosDeUnidad', () => {
  const idx = buildIndiceRecursos(entradas);

  it('agrupa por asignatura#unidad y por tipo, conservando la nota de cada vínculo', () => {
    const r = recursosDeUnidad(idx, 'eco-1bach', 1);
    expect(r.juego).toHaveLength(1);
    expect(r.juego[0].title).toBe('Econrisk');
    expect(r.juego[0].nota).toBe('Escuelas de pensamiento.');
    expect(r.dinamica).toHaveLength(0);
  });

  it('un mismo recurso aparece en cada unidad que referencia', () => {
    expect(recursosDeUnidad(idx, 'eco-1bach', 6).dinamica).toHaveLength(1);
    expect(recursosDeUnidad(idx, 'eeae-bach', 3).dinamica[0].slug).toBe('01-tragedia-comunes');
  });

  it('una unidad sin recursos devuelve todos los grupos vacíos, sin excepción', () => {
    const r = recursosDeUnidad(idx, 'fopp-4eso', 99);
    expect(r.dinamica).toEqual([]);
    expect(r.juego).toEqual([]);
    expect(r.herramienta).toEqual([]);
  });
});

describe('slugBase', () => {
  it('takes the last segment of a content id', () => {
    expect(slugBase('mercado-estado/02-tope-alquileres')).toBe('02-tope-alquileres');
  });
  it('drops the .ca suffix so both languages share one route', () => {
    expect(slugBase('mercado-estado/02-tope-alquileres.ca')).toBe('02-tope-alquileres');
  });
  it('survives a leading or trailing slash', () => {
    expect(slugBase('/a/b/')).toBe('b');
    expect(slugBase('solo')).toBe('solo');
  });
  it('leaves an id that merely contains "ca" alone', () => {
    expect(slugBase('familia/01-cacao')).toBe('01-cacao');
  });
});

describe('pickByLocale', () => {
  const e = (id: string, lang?: string) => ({ id, data: lang ? { lang } : {} });
  const dos = [e('f/01-uno'), e('f/01-uno.ca', 'ca'), e('f/02-dos'), e('f/02-dos.ca', 'ca')];

  it('returns the Spanish entries for es', () => {
    expect(pickByLocale(dos, 'es').map((x) => x.id)).toEqual(['f/01-uno', 'f/02-dos']);
  });
  it('returns the Valencian ones for ca', () => {
    expect(pickByLocale(dos, 'ca').map((x) => x.id)).toEqual(['f/01-uno.ca', 'f/02-dos.ca']);
  });
  it('falls back to Spanish when a translation is missing', () => {
    const parcial = [e('f/01-uno'), e('f/01-uno.ca', 'ca'), e('f/02-dos')];
    expect(pickByLocale(parcial, 'ca').map((x) => x.id)).toEqual(['f/01-uno.ca', 'f/02-dos']);
  });
  it('keeps one entry per resource, never both languages', () => {
    expect(pickByLocale(dos, 'ca')).toHaveLength(2);
    expect(pickByLocale(dos, 'es')).toHaveLength(2);
  });
  it('shows the same resources in the same order in both editions', () => {
    const es = pickByLocale(dos, 'es').map((x) => slugBase(x.id));
    const ca = pickByLocale(dos, 'ca').map((x) => slugBase(x.id));
    expect(ca).toEqual(es);
  });
  it('treats a missing lang as Spanish', () => {
    expect(pickByLocale([e('f/01-uno')], 'ca').map((x) => x.id)).toEqual(['f/01-uno']);
  });
  it('ignores a language that is neither the target nor Spanish', () => {
    const conOtra = [e('f/01-uno'), e('f/01-uno.eu', 'eu')];
    expect(pickByLocale(conOtra, 'ca').map((x) => x.id)).toEqual(['f/01-uno']);
  });
});
