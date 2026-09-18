// src/lib/games/teoria-juegos/registry.ts
/**
 * The six experiments inside /juegos/teoria-juegos/, in hub order. Prose lives
 * in the island's copy.ts (it needs ES + CA); this file holds only structure, so
 * the engines and their tests never depend on wording.
 *
 * `papel` points at the paper dinámica that covers the same game with cards and
 * a whiteboard: the screen is a complement to those, not a replacement.
 */
import type { MiniId, MiniMeta } from './types';

export const MINIS: MiniMeta[] = [
  {
    id: 'dilema',
    colorVar: '--color-terra',
    papel: {
      href: '/dinamicas/decisiones-comunes/03-dilema-prisionero/',
      label: { es: 'El dilema del prisionero (repetido)', ca: 'El dilema del presoner (repetit)' },
    },
  },
  {
    id: 'cazaciervo',
    colorVar: '--color-eco1',
    papel: {
      href: '/dinamicas/teoria-juegos/01-laboratorio-juegos/',
      label: { es: 'Laboratorio de teoría de juegos', ca: 'Laboratori de teoria de jocs' },
    },
  },
  { id: 'belleza', colorVar: '--color-cjd' },
  {
    id: 'reparto',
    colorVar: '--color-fopp',
    papel: {
      href: '/dinamicas/distribucion-produccion/02-ultimatum/',
      label: { es: 'El juego del ultimátum', ca: "El joc de l'ultimàtum" },
    },
  },
  {
    id: 'bien-publico',
    colorVar: '--color-taller3',
    papel: {
      href: '/dinamicas/decisiones-comunes/02-bienes-publicos/',
      label: { es: 'El juego de los bienes públicos', ca: 'El joc dels béns públics' },
    },
  },
  {
    id: 'subastas',
    colorVar: '--color-mustard-deep',
    papel: {
      href: '/dinamicas/teoria-juegos/02-tipos-subasta/',
      label: { es: 'Los tipos de subasta', ca: 'Els tipus de subhasta' },
    },
  },
];

export const MINI_IDS: MiniId[] = MINIS.map((m) => m.id);

export function miniMeta(id: MiniId): MiniMeta {
  const m = MINIS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown mini-game: ${id}`);
  return m;
}
