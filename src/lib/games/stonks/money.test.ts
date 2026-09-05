// src/lib/games/stonks/money.test.ts
import { describe, it, expect } from 'vitest';
import { commissionRate, capitalGainsTax, sellFrom, cpiIndex, toReal } from './money';
import { CPI, CPI_FIRST_YEAR, CPI_LAST_YEAR } from './data/inflation';

describe('CPI table', () => {
  it('covers every year from 1971 to 2025 with no gaps', () => {
    for (let y = CPI_FIRST_YEAR; y <= CPI_LAST_YEAR; y++) {
      expect(CPI[y], `CPI ${y}`).toBeTypeOf('number');
    }
  });

  it('remembers that Spain had double-digit inflation for a decade', () => {
    for (let y = 1973; y <= 1984; y++) {
      expect(CPI[y], `CPI ${y}`).toBeGreaterThan(0.10);
    }
  });
});

describe('commissionRate', () => {
  it('charges 1% up to 1990, 0.5% to 2010, 0.2% after', () => {
    expect(commissionRate(1971)).toBeCloseTo(0.010);
    expect(commissionRate(1990)).toBeCloseTo(0.010);
    expect(commissionRate(1991)).toBeCloseTo(0.005);
    expect(commissionRate(2010)).toBeCloseTo(0.005);
    expect(commissionRate(2011)).toBeCloseTo(0.002);
    expect(commissionRate(2025)).toBeCloseTo(0.002);
  });
});

describe('capitalGainsTax', () => {
  it('is zero for a loss or a zero gain', () => {
    expect(capitalGainsTax(-500)).toBe(0);
    expect(capitalGainsTax(0)).toBe(0);
  });

  it('applies 19% inside the first bracket', () => {
    expect(capitalGainsTax(6000)).toBeCloseTo(1140, 2);
  });

  it('is progressive, not a cliff', () => {
    // 6000*0.19 + 44000*0.21
    expect(capitalGainsTax(50000)).toBeCloseTo(10380, 2);
    // + 50000*0.23
    expect(capitalGainsTax(100000)).toBeCloseTo(21880, 2);
  });

  it('never lets one more euro of gain cost more than one euro of tax', () => {
    for (const g of [5999, 6000, 6001, 49999, 50000, 50001]) {
      expect(capitalGainsTax(g + 1) - capitalGainsTax(g)).toBeLessThan(1);
    }
  });
});

describe('sellFrom', () => {
  it('realises gain proportionally at average cost', () => {
    const { position, realised } = sellFrom({ value: 2000, cost: 1000 }, 500);
    expect(realised).toBeCloseTo(250, 6);
    expect(position.value).toBeCloseTo(1500, 6);
    expect(position.cost).toBeCloseTo(750, 6);
  });

  it('realises a loss when the position is under water', () => {
    const { realised } = sellFrom({ value: 500, cost: 1000 }, 500);
    expect(realised).toBeCloseTo(-500, 6);
  });

  it('is a no-op on an empty position', () => {
    const { position, realised } = sellFrom({ value: 0, cost: 0 }, 100);
    expect(realised).toBe(0);
    expect(position).toEqual({ value: 0, cost: 0 });
  });

  it('never sells more than the position holds', () => {
    const { position } = sellFrom({ value: 100, cost: 100 }, 999);
    expect(position.value).toBe(0);
    expect(position.cost).toBe(0);
  });
});

describe('cpiIndex', () => {
  it('is exactly 1 at the start of the window', () => {
    expect(cpiIndex(1980, 0)).toBe(1);
  });

  it('compounds half a year per semester', () => {
    expect(cpiIndex(1980, 1)).toBeCloseTo(Math.sqrt(1 + CPI[1980]), 6);
    expect(cpiIndex(1980, 2)).toBeCloseTo(1 + CPI[1980], 6);
  });

  it('is monotonically non-decreasing across a window with no deflation', () => {
    for (let r = 1; r <= 50; r++) {
      expect(cpiIndex(1971, r)).toBeGreaterThanOrEqual(cpiIndex(1971, r - 1));
    }
  });

  it('roughly quintuples prices over the 1971-1981 decade', () => {
    const tenYears = cpiIndex(1971, 20);
    expect(tenYears).toBeGreaterThan(3.5);
    expect(tenYears).toBeLessThan(6);
  });

  it('deflates nominal euros into start-year purchasing power', () => {
    expect(toReal(1000, 2)).toBeCloseTo(500, 6);
  });

  it('throws rather than silently guessing outside the data', () => {
    expect(() => cpiIndex(1960, 4)).toThrow(/CPI/);
  });
});
