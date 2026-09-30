import { describe, it, expect } from 'vitest';
import {
  displayedText,
  draftOnBlur,
  onNumberInput,
  parseNumberInput,
  type NumberDraft,
} from './number-input';

/**
 * What a Spanish-locale Chromium reports for the text in an
 * <input type="number">: a valid floating-point number comes back as is,
 * anything else ("-", "2.") as value "" with validity.badInput.
 */
function browser(text: string): { value: string; badInput: boolean } {
  if (text === '') return { value: '', badInput: false };
  return /^-?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/.test(text)
    ? { value: text, badInput: false }
    : { value: '', badInput: true };
}

/**
 * Type `keystrokes` (the successive texts of the field) into a field whose
 * committed value starts at `initial`. `limit` is what the calculator does
 * with a committed number. Returns the final value and every text Preact
 * would have written into the field, i.e. each render whose `value` differs
 * from what the browser holds.
 */
function teclear(initial: number, keystrokes: string[], limit: (n: number) => number = (n) => n) {
  let value = initial;
  let draft: NumberDraft | null = null;
  const rewrites: string[] = [];
  for (const text of keystrokes) {
    const shown = browser(text);
    const r = onNumberInput(shown.value, shown.badInput, value);
    draft = r.draft;
    if (r.commit !== null) value = limit(r.commit);
    const rendered = displayedText(draft, value);
    if (rendered !== shown.value) rewrites.push(rendered);
  }
  return { value, draft, rewrites };
}

describe('parseNumberInput', () => {
  it('reads valid numbers, negatives and decimals included', () => {
    expect(parseNumberInput('-5000', false)).toBe(-5000);
    expect(parseNumberInput('2.5', false)).toBe(2.5);
    expect(parseNumberInput('0', false)).toBe(0);
    expect(parseNumberInput('1e3', false)).toBe(1000);
  });

  it('commits nothing for an empty field or a half-typed number', () => {
    expect(parseNumberInput('', false)).toBeNull();
    expect(parseNumberInput('', true)).toBeNull(); // "-" or "2." as the browser reports them
  });
});

describe('typing into a calculator field', () => {
  it('keeps the minus sign: "-5000" is committed as −5000, not +5000', () => {
    const r = teclear(0, ['-', '-5', '-50', '-500', '-5000']);
    expect(r.value).toBe(-5000);
    expect(r.rewrites).toEqual([]);
  });

  it('keeps the decimal point: "2.5" is committed as 2,5, not 5', () => {
    const r = teclear(0, ['2', '2.', '2.5']);
    expect(r.value).toBe(2.5);
    expect(r.rewrites).toEqual([]);
  });

  it('does not commit "-" or "2." on their own', () => {
    expect(teclear(1500, ['-']).value).toBe(1500);
    expect(teclear(1500, ['2', '2.']).value).toBe(2);
  });

  it('lets the field be cleared without writing a 0 into it', () => {
    const r = teclear(1500, ['']);
    expect(r.value).toBe(1500);
    expect(r.rewrites).toEqual([]);
  });

  it('shows the committed value again when an empty or half-typed field loses focus', () => {
    const vacio = teclear(1500, ['']);
    expect(displayedText(draftOnBlur(vacio.draft), vacio.value)).toBe('1500');
    const menos = teclear(1500, ['-']);
    expect(displayedText(draftOnBlur(menos.draft), menos.value)).toBe('1500');
  });

  it('keeps a valid number as typed when the field loses focus', () => {
    const r = teclear(1, ['1', '1.', '1.5', '1.50']);
    expect(r.value).toBe(1.5);
    expect(displayedText(draftOnBlur(r.draft), r.value)).toBe('1.50');
  });

  it('shows a value set from outside (preset, reset) over the draft', () => {
    const r = teclear(0, ['1', '12']);
    expect(displayedText(r.draft, 120000)).toBe('120000');
  });

  it('shows the value the calculator keeps when it limits what was typed', () => {
    const r = teclear(2, ['-', '-3'], (n) => Math.max(0, n));
    expect(r.value).toBe(0);
    expect(r.rewrites).toEqual(['0']);
  });
});
