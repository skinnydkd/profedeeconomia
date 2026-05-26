/**
 * 28-cell Econopoly board — ported from webpde/econopoly.html.
 *
 * SOURCE LAYOUT (webpde indices 0-27, Catalan names):
 *   Bottom row L→R  (0-6):  SORTIDA, Cooperativa Agrícola, IMPOSTOS, Fàbrica Tèxtil,
 *                            NOTICIA, Startup Digital, BANC CENTRAL
 *   Right col  T→B  (7-13): Cadena Hotelera, NOTICIA, Planta Solar, Refineria,
 *                            MERCAT LLIURE, Aerolinia Nacional, IMPOSTOS
 *   Top row    R→L  (14-20): BANC CENTRAL, Resort Turístic, NOTICIA, Promotora Immobiliària,
 *                             R+D, Constructora Nacional, BANC CENTRAL
 *   Left col   B→T  (21-27): Banc Comercial, NOTICIA, Asseguradora, Exportadora Agroalimentaria,
 *                             Hospital Privat, Big Tech, Plataforma Petroli
 *
 * REMAPPING to clockwise ring with corners at 0/7/14/21:
 *   The plan requires: 0=SALIDA(start), 7=IMPUESTO(tax), 14=MERCADO LIBRE(freemarket),
 *   21=NOTICIA(news). The source has SORTIDA@0 but the other corners at non-7/14/21 positions,
 *   so the ring is rebuilt clockwise preserving all 16 properties, 8 specials and 4 corners.
 *
 * SECTOR MAPPING (webpde sector name → new SectorId, paired by price proximity):
 *   tech         → A  (Startup Digital 120 / Big Tech 380)
 *   serveis      → B  (Cadena Hotelera 140 / Hospital Privat 340)
 *   energia      → C  (Planta Solar 160 / Refineria 180)   ← already adjacent in source
 *   financer     → D  (Banc Comercial 280 / Asseguradora 300)
 *   agricultura  → E  (Cooperativa 60 / Exportadora 320)
 *   industria    → F  (Fàbrica Tèxtil 100 / Plataforma Petroli 400)
 *   turisme      → G  (Aerolinia 200 / Resort 220)          ← already adjacent in source
 *   construccio  → H  (Promotora 240 / Constructora 260)    ← already adjacent in source
 */
import type { Cell, SectorId } from './types';
import { BOARD_SIZE } from './constants';

export const SECTOR_IDS: SectorId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Spanish display label per sector (used in UI chips and side panel). */
export const SECTOR_LABEL: Record<SectorId, string> = {
  A: 'Tecnología',
  B: 'Servicios',
  C: 'Energía',
  D: 'Finanzas',
  E: 'Agricultura',
  F: 'Industria',
  G: 'Turismo',
  H: 'Construcción',
};

/**
 * Paired palette colors: 4 Variant C accents, 2 sectors each.
 * A-B: teal, C-D: mostaza, E-F: terracota, G-H: pi
 */
export const SECTOR_COLOR: Record<SectorId, string> = {
  A: '#1F6E6E', B: '#1F6E6E',  // teal
  C: '#A87A2A', D: '#A87A2A',  // mostaza
  E: '#C44E2C', F: '#C44E2C',  // terracota
  G: '#2E5E3A', H: '#2E5E3A',  // pi
};

/**
 * 28-cell ring in clockwise order starting at SALIDA (position 0).
 *
 * Corners: 0=SALIDA, 7=IMPUESTO, 14=MERCADO LIBRE, 21=NOTICIA.
 * Specials occupying non-property, non-corner slots: 3× Banco Central (cb),
 * 3× Noticia (news), 1× R+D (rd), 1× Impuesto (tax at pos 24).
 * Properties: 16 cells (sectors A-H, 2 per sector), prices/rents faithful to source.
 */
export const CELLS: Cell[] = [
  // ── Quarter 1: pos 0-6 ──────────────────────────────────────────────
  { id: 0,  kind: 'start',      label: 'SALIDA' },
  { id: 1,  kind: 'property',   label: 'Cooperativa Agrícola',
    property: { sector: 'E', label: 'Cooperativa Agrícola',    basePrice: 60,  baseRent: 6  } },
  { id: 2,  kind: 'property',   label: 'Fábrica Textil',
    property: { sector: 'F', label: 'Fábrica Textil',          basePrice: 100, baseRent: 10 } },
  { id: 3,  kind: 'news',       label: 'Noticia' },
  { id: 4,  kind: 'property',   label: 'Startup Digital',
    property: { sector: 'A', label: 'Startup Digital',         basePrice: 120, baseRent: 12 } },
  { id: 5,  kind: 'property',   label: 'Cadena Hotelera',
    property: { sector: 'B', label: 'Cadena Hotelera',         basePrice: 140, baseRent: 14 } },
  { id: 6,  kind: 'cb',         label: 'Banco Central' },

  // ── Corner + Quarter 2: pos 7-13 ────────────────────────────────────
  { id: 7,  kind: 'tax',        label: 'IMPUESTO' },
  { id: 8,  kind: 'property',   label: 'Planta Solar',
    property: { sector: 'C', label: 'Planta Solar',            basePrice: 160, baseRent: 16 } },
  { id: 9,  kind: 'news',       label: 'Noticia' },
  { id: 10, kind: 'property',   label: 'Refinería',
    property: { sector: 'C', label: 'Refinería',               basePrice: 180, baseRent: 18 } },
  { id: 11, kind: 'property',   label: 'Aerolínea Nacional',
    property: { sector: 'G', label: 'Aerolínea Nacional',      basePrice: 200, baseRent: 20 } },
  { id: 12, kind: 'cb',         label: 'Banco Central' },
  { id: 13, kind: 'property',   label: 'Resort Turístico',
    property: { sector: 'G', label: 'Resort Turístico',        basePrice: 220, baseRent: 22 } },

  // ── Corner + Quarter 3: pos 14-20 ───────────────────────────────────
  { id: 14, kind: 'freemarket', label: 'MERCADO LIBRE' },
  { id: 15, kind: 'property',   label: 'Promotora Inmobiliaria',
    property: { sector: 'H', label: 'Promotora Inmobiliaria',  basePrice: 240, baseRent: 24 } },
  { id: 16, kind: 'news',       label: 'Noticia' },
  { id: 17, kind: 'property',   label: 'Constructora Nacional',
    property: { sector: 'H', label: 'Constructora Nacional',   basePrice: 260, baseRent: 26 } },
  { id: 18, kind: 'rd',         label: 'R+D' },
  { id: 19, kind: 'property',   label: 'Banco Comercial',
    property: { sector: 'D', label: 'Banco Comercial',         basePrice: 280, baseRent: 28 } },
  { id: 20, kind: 'cb',         label: 'Banco Central' },

  // ── Corner + Quarter 4: pos 21-27 ───────────────────────────────────
  { id: 21, kind: 'news',       label: 'NOTICIA' },
  { id: 22, kind: 'property',   label: 'Aseguradora',
    property: { sector: 'D', label: 'Aseguradora',             basePrice: 300, baseRent: 30 } },
  { id: 23, kind: 'property',   label: 'Exportadora Agroalimentaria',
    property: { sector: 'E', label: 'Exportadora Agroalimentaria', basePrice: 320, baseRent: 32 } },
  { id: 24, kind: 'tax',        label: 'Impuesto' },
  { id: 25, kind: 'property',   label: 'Hospital Privado',
    property: { sector: 'B', label: 'Hospital Privado',        basePrice: 340, baseRent: 34 } },
  { id: 26, kind: 'property',   label: 'Big Tech',
    property: { sector: 'A', label: 'Big Tech',                basePrice: 380, baseRent: 38 } },
  { id: 27, kind: 'property',   label: 'Plataforma Petróleo',
    property: { sector: 'F', label: 'Plataforma Petróleo',     basePrice: 400, baseRent: 40 } },
];

// Sanity-check at module level (stripped in production builds by tree-shaking)
if (CELLS.length !== BOARD_SIZE) {
  throw new Error(`Board must have ${BOARD_SIZE} cells, got ${CELLS.length}`);
}

/** Look up a cell by its ring position (0..27). */
export const cellById = (id: number): Cell => CELLS[id];

/** All 16 property cells. */
export const properties = (): Cell[] => CELLS.filter((c) => c.kind === 'property');

/** Both cell ids belonging to a sector (always exactly 2). */
export const sectorCellIds = (s: SectorId): number[] =>
  CELLS.filter((c) => c.property?.sector === s).map((c) => c.id);
