import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MINIS, MINI_IDS, miniMeta } from './registry.ts';

const CONTENT = fileURLToPath(new URL('../../../content/dinamicas/', import.meta.url));

describe('MINIS', () => {
  it('declara los seis experimentos con id único', () => {
    expect(MINI_IDS).toEqual([
      'dilema', 'cazaciervo', 'belleza', 'reparto', 'bien-publico', 'subastas',
    ]);
    expect(new Set(MINI_IDS).size).toBe(MINIS.length);
  });
  it('da a cada uno un color de la paleta validada', () => {
    for (const m of MINIS) expect(m.colorVar).toMatch(/^--color-[a-z0-9-]+$/);
  });
  it('no repite color entre experimentos', () => {
    const colores = MINIS.map((m) => m.colorVar);
    expect(new Set(colores).size).toBe(colores.length);
  });
  it('miniMeta encuentra por id y protesta si no existe', () => {
    expect(miniMeta('belleza').colorVar).toBe('--color-cjd');
    // @ts-expect-error probamos el camino de error con un id inventado
    expect(() => miniMeta('no-existe')).toThrow();
  });
});

describe('enlaces a las dinámicas en papel', () => {
  it('apuntan a una dinámica publicada que existe en el repo', () => {
    for (const m of MINIS) {
      if (!m.papel) continue;
      const [, , familia, slug] = m.papel.href.split('/');
      const ficheros = readdirSync(CONTENT + familia);
      expect(ficheros).toContain(`${slug}.mdx`);
    }
  });
  it('usan URL absoluta con barra final', () => {
    for (const m of MINIS) {
      if (!m.papel) continue;
      expect(m.papel.href).toMatch(/^\/dinamicas\/[a-z-]+\/[a-z0-9-]+\/$/);
    }
  });
  it('traducen la etiqueta a los dos idiomas', () => {
    for (const m of MINIS) {
      if (!m.papel) continue;
      expect(m.papel.label.es.length).toBeGreaterThan(0);
      expect(m.papel.label.ca.length).toBeGreaterThan(0);
    }
  });
});
