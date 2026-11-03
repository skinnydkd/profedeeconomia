import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A controlled <input type="number"> fed with `parseFloat(value) || 0` wiped
 * a half-typed "-" or "2." and wrote 0 back into the field, so "-5000" became
 * +5000 (CODE-INT-04). The islands with number fields go through NumberInput,
 * which only commits valid numbers. This guard stops a raw number field from
 * coming back. Range sliders are fine: their value is always a valid number.
 */
const DIRS = ['src/components/calculadoras', 'src/components/generadores', 'src/components/business-game'];

describe('number fields of the calculator islands', () => {
  it('go through NumberInput instead of a raw <input type="number">', () => {
    const raw = DIRS.flatMap((dir) =>
      readdirSync(dir)
        .filter((f) => f.endsWith('.tsx'))
        .filter((f) => readFileSync(join(dir, f), 'utf8').includes('type="number"'))
        .map((f) => join(dir, f)),
    );
    expect(raw).toEqual([]);
  });
});
