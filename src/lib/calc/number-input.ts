/**
 * Editing logic of the calculators' numeric fields (components/NumberInput.tsx),
 * kept pure so it can be tested without a DOM.
 *
 * A controlled <input type="number"> cannot hold a half-typed number. While
 * the text is "-", or "2." in a Spanish-locale browser, the browser reports
 * value "" with validity.badInput. The islands used to commit
 * `parseFloat(value) || 0` on every keystroke, so the state became 0, Preact
 * wrote "0" back into the field and the minus sign or the decimal point was
 * lost: "-5000" ended up as +5000. The field now keeps the text the browser
 * reports while it is being edited and only commits a valid, non-empty number.
 */

/** The number a field's text stands for, or null while it is empty or not (yet) a valid number. */
export function parseNumberInput(raw: string, badInput: boolean): number | null {
  if (badInput || raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** What was typed in a field, and the committed value it belongs to. */
export interface NumberDraft {
  text: string;
  value: number;
}

/**
 * Handle an input event. `raw` and `badInput` are what the browser reports
 * (`input.value`, `input.validity.badInput`) and `value` is the committed value.
 * Returns the draft to keep and the number to commit, or null to leave the
 * committed value alone.
 */
export function onNumberInput(
  raw: string,
  badInput: boolean,
  value: number,
): { draft: NumberDraft; commit: number | null } {
  const commit = parseNumberInput(raw, badInput);
  return { draft: { text: raw, value: commit ?? value }, commit };
}

/**
 * Text the field shows. The draft wins while the committed value is still the
 * one it belongs to, so the field always shows what the browser already holds
 * and is never rewritten under the cursor. Any other value (a preset, a reset,
 * a limit the calculator applies) is shown as it is.
 */
export function displayedText(draft: NumberDraft | null, value: number): string {
  return draft !== null && Object.is(draft.value, value) ? draft.text : String(value);
}

/**
 * Draft to keep when the field loses focus: a valid number stays as typed
 * ("1.50" is not turned into "1.5"); an empty or half-typed one is dropped, so
 * the field shows again the value the calculator is using.
 */
export function draftOnBlur(draft: NumberDraft | null): NumberDraft | null {
  return draft !== null && parseNumberInput(draft.text, false) !== null ? draft : null;
}
