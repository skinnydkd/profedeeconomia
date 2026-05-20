import { describe, it, expect } from 'vitest';
import {
  BASE_Y,
  BASE_P,
  adPrice,
  srasPrice,
  potentialOutput,
  shortRunEquilibrium,
  longRunEquilibrium,
  classifyGap,
  solveADAS,
  srasShiftForLongRun,
  adjustToLongRun,
  type ADASState,
} from './ad-as';

const base: ADASState = { adShift: 0, srasShift: 0, lrasShift: 0 };

describe('curves at the baseline', () => {
  it('AD and SRAS both pass through (BASE_Y, BASE_P) with no shocks', () => {
    expect(adPrice(BASE_Y, base)).toBeCloseTo(BASE_P);
    expect(srasPrice(BASE_Y, base)).toBeCloseTo(BASE_P);
  });
  it('AD slopes down (higher Y → lower P)', () => {
    expect(adPrice(BASE_Y + 10, base)).toBeLessThan(adPrice(BASE_Y, base));
  });
  it('SRAS slopes up (higher Y → higher P)', () => {
    expect(srasPrice(BASE_Y + 10, base)).toBeGreaterThan(srasPrice(BASE_Y, base));
  });
  it('LRAS sits at potential output = 100 with no structural change', () => {
    expect(potentialOutput(base)).toBe(100);
  });
});

describe('base equilibrium', () => {
  it('short-run equilibrium is exactly (100, 100) with no shocks', () => {
    const eq = shortRunEquilibrium(base);
    expect(eq.Y).toBeCloseTo(100);
    expect(eq.P).toBeCloseTo(100);
  });
  it('the economy starts at full employment (gap = 0)', () => {
    const r = solveADAS(base);
    expect(r.outputGap).toBeCloseTo(0);
    expect(r.gapKind).toBe('neutra');
  });
});

describe('demand shock — fiscal/monetary expansion (AD right)', () => {
  it('raises both P and Y in the short run', () => {
    const r = solveADAS({ ...base, adShift: 20 });
    expect(r.shortRun.Y).toBeGreaterThan(100);
    expect(r.shortRun.P).toBeGreaterThan(100);
  });
  it('opens an inflationary (expansive) gap', () => {
    const r = solveADAS({ ...base, adShift: 20 });
    expect(r.outputGap).toBeGreaterThan(0);
    expect(r.gapKind).toBe('inflacionaria');
  });
});

describe('demand shock — recession (AD left)', () => {
  it('lowers both P and Y in the short run', () => {
    const r = solveADAS({ ...base, adShift: -20 });
    expect(r.shortRun.Y).toBeLessThan(100);
    expect(r.shortRun.P).toBeLessThan(100);
  });
  it('opens a recessionary gap', () => {
    const r = solveADAS({ ...base, adShift: -20 });
    expect(r.outputGap).toBeLessThan(0);
    expect(r.gapKind).toBe('recesiva');
  });
});

describe('negative supply shock — stagflation (SRAS left)', () => {
  it('raises P but lowers Y (P↑ Y↓)', () => {
    const r = solveADAS({ ...base, srasShift: -20 });
    expect(r.shortRun.P).toBeGreaterThan(100);
    expect(r.shortRun.Y).toBeLessThan(100);
  });
  it('opens a recessionary gap despite rising prices', () => {
    const r = solveADAS({ ...base, srasShift: -20 });
    expect(r.outputGap).toBeLessThan(0);
    expect(r.gapKind).toBe('recesiva');
  });
});

describe('positive supply shock (SRAS right)', () => {
  it('lowers P and raises Y (P↓ Y↑)', () => {
    const r = solveADAS({ ...base, srasShift: 20 });
    expect(r.shortRun.P).toBeLessThan(100);
    expect(r.shortRun.Y).toBeGreaterThan(100);
  });
});

describe('structural change — LRAS shift', () => {
  it('moves potential output and the long-run equilibrium', () => {
    const r = solveADAS({ ...base, lrasShift: 15 });
    expect(r.potentialY).toBe(115);
    expect(r.longRun.Y).toBe(115);
  });
  it('a pure LRAS rise (no demand change) leaves a recessionary gap short run', () => {
    // Potential jumped to 115 but AD/SRAS still cross at 100.
    const r = solveADAS({ ...base, lrasShift: 15 });
    expect(r.shortRun.Y).toBeCloseTo(100);
    expect(r.outputGap).toBeCloseTo(-15);
    expect(r.gapKind).toBe('recesiva');
  });
});

describe('long-run self-correction (gap → 0)', () => {
  it('after a demand expansion the long run returns output to potential', () => {
    const shocked: ADASState = { ...base, adShift: 20 };
    const corrected = adjustToLongRun(shocked);
    const r = solveADAS(corrected);
    expect(r.shortRun.Y).toBeCloseTo(r.potentialY);
    expect(r.outputGap).toBeCloseTo(0);
    expect(r.gapKind).toBe('neutra');
  });
  it('the price level rises after correcting a demand expansion', () => {
    const shocked: ADASState = { ...base, adShift: 20 };
    const before = solveADAS(shocked);
    const after = solveADAS(adjustToLongRun(shocked));
    // Long-run price exceeds the original short-run equilibrium price.
    expect(after.shortRun.P).toBeGreaterThan(before.shortRun.P);
    // Output is back at potential, the whole adjustment is in P.
    expect(after.shortRun.Y).toBeCloseTo(100);
  });
  it('after a negative supply shock the long run also returns to potential', () => {
    const shocked: ADASState = { ...base, srasShift: -20 };
    const after = solveADAS(adjustToLongRun(shocked));
    expect(after.outputGap).toBeCloseTo(0);
    expect(after.gapKind).toBe('neutra');
  });
  it('srasShiftForLongRun is 0 when there is no shock', () => {
    expect(srasShiftForLongRun(base)).toBeCloseTo(0);
  });
  it('the corrected short-run equilibrium equals the analytic long-run point', () => {
    const shocked: ADASState = { ...base, adShift: 20 };
    const longRun = longRunEquilibrium(shocked);
    const correctedSr = shortRunEquilibrium(adjustToLongRun(shocked));
    expect(correctedSr.Y).toBeCloseTo(longRun.Y);
    expect(correctedSr.P).toBeCloseTo(longRun.P);
  });
});

describe('output gap percentage', () => {
  it('expresses the gap relative to potential output', () => {
    const r = solveADAS({ ...base, adShift: 20 });
    // gap = +10 over potential 100 → +10 %
    expect(r.outputGap).toBeCloseTo(10);
    expect(r.outputGapPct).toBeCloseTo(10);
  });
});

describe('classifyGap', () => {
  it('labels positive, negative and zero gaps', () => {
    expect(classifyGap(5)).toBe('inflacionaria');
    expect(classifyGap(-5)).toBe('recesiva');
    expect(classifyGap(0)).toBe('neutra');
  });
  it('treats tiny floating-point noise as neutral', () => {
    expect(classifyGap(1e-12)).toBe('neutra');
    expect(classifyGap(-1e-12)).toBe('neutra');
  });
});

describe('edge cases', () => {
  it('combined demand expansion + negative supply shock can keep Y near potential but raise P', () => {
    const r = solveADAS({ ...base, adShift: 20, srasShift: -20 });
    // AD +20 and SRAS −20 offset on output but stack on prices.
    expect(r.shortRun.Y).toBeCloseTo(100);
    expect(r.shortRun.P).toBeGreaterThan(100);
    expect(r.gapKind).toBe('neutra');
  });
  it('large symmetric shocks stay finite and self-consistent', () => {
    const r = solveADAS({ adShift: 50, srasShift: 50, lrasShift: 30 });
    expect(Number.isFinite(r.shortRun.Y)).toBe(true);
    expect(Number.isFinite(r.shortRun.P)).toBe(true);
    // AD ∩ SRAS must satisfy both curve equations.
    const state: ADASState = { adShift: 50, srasShift: 50, lrasShift: 30 };
    expect(adPrice(r.shortRun.Y, state)).toBeCloseTo(r.shortRun.P);
    expect(srasPrice(r.shortRun.Y, state)).toBeCloseTo(r.shortRun.P);
  });
});
