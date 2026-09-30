/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';

/** How long the result has to stay still before it is announced, in ms. */
const ESPERA_MS = 500;

/**
 * A visually hidden line with a calculator's main result, in a polite live
 * region so screen readers announce it when it changes. The islands
 * recalculate on every keystroke, so the line waits until the result has
 * been still for half a second: typing 24000 announces one result, not five.
 */
export default function LiveSummary({ text }: { text: string }) {
  const [anunciado, setAnunciado] = useState(text);
  useEffect(() => {
    const t = setTimeout(() => setAnunciado(text), ESPERA_MS);
    return () => clearTimeout(t);
  }, [text]);
  return (
    <div class="sr-only" role="status" aria-live="polite">
      {anunciado}
    </div>
  );
}
