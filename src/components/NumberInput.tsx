/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { InputHTMLAttributes } from 'preact';
import {
  displayedText,
  draftOnBlur,
  onNumberInput,
  type NumberDraft,
} from '../lib/calc/number-input';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onInput' | 'onBlur'> & {
  /** The committed value the calculator works with. */
  value: number;
  /** Receives every valid number typed; never the empty or half-typed states ("-", "2."). */
  onValue: (value: number) => void;
};

/**
 * Drop-in `<input type="number">` for the calculator islands. It renders the
 * same element with the same attributes, but lets people type "-5000", "2.5"
 * or clear the field without the value snapping back to 0 halfway through.
 * The editing rules live in lib/calc/number-input.ts.
 */
export default function NumberInput({ value, onValue, ...rest }: Props) {
  const [draft, setDraft] = useState<NumberDraft | null>(null);
  return (
    <input
      type="number"
      {...rest}
      value={displayedText(draft, value)}
      onInput={(e) => {
        const input = e.currentTarget;
        const next = onNumberInput(input.value, input.validity.badInput, value);
        setDraft(next.draft);
        if (next.commit !== null) onValue(next.commit);
      }}
      onBlur={() => setDraft(draftOnBlur)}
    />
  );
}
