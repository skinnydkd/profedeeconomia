import { describe, it, expect } from 'vitest';
import { CELLS, SECTOR_IDS, sectorCellIds, SECTOR_COLOR } from './board';
import { BOARD_SIZE } from './constants';

describe('econopoly board', () => {
  it(`has exactly ${BOARD_SIZE} cells`, () => { expect(CELLS.length).toBe(BOARD_SIZE); });
  it('cells are numbered 0..27 in order', () => {
    CELLS.forEach((c, i) => expect(c.id).toBe(i));
  });
  it('has the 4 corners at positions 0, 7, 14, 21 with the right kinds', () => {
    expect(CELLS[0].kind).toBe('start');
    expect(CELLS[7].kind).toBe('tax');
    expect(CELLS[14].kind).toBe('freemarket');
    expect(CELLS[21].kind).toBe('news');
  });
  it('has exactly 16 property cells, paired into 8 sectors of 2', () => {
    const props = CELLS.filter((c) => c.kind === 'property');
    expect(props.length).toBe(16);
    for (const s of SECTOR_IDS) {
      expect(sectorCellIds(s).length).toBe(2);
    }
  });
  it('the 8 sectors share 4 accent colors (A-B, C-D, E-F, G-H)', () => {
    expect(SECTOR_COLOR.A).toBe(SECTOR_COLOR.B);
    expect(SECTOR_COLOR.C).toBe(SECTOR_COLOR.D);
    expect(SECTOR_COLOR.E).toBe(SECTOR_COLOR.F);
    expect(SECTOR_COLOR.G).toBe(SECTOR_COLOR.H);
    expect(new Set([SECTOR_COLOR.A, SECTOR_COLOR.C, SECTOR_COLOR.E, SECTOR_COLOR.G]).size).toBe(4);
  });
  it('every property has positive base price and rent', () => {
    for (const c of CELLS.filter((c) => c.kind === 'property')) {
      expect(c.property!.basePrice).toBeGreaterThan(0);
      expect(c.property!.baseRent).toBeGreaterThan(0);
    }
  });
});
