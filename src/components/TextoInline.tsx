/** @jsxImportSource preact */
import { trozosInline } from './quiz-utils';

/**
 * Renders the **strong** and *em* emphasis that authors write in question
 * texts (tests, reto items, the olympiad bank) instead of showing asterisks.
 */
export default function TextoInline({ texto }: { texto: string }) {
  return (
    <>
      {trozosInline(texto).map((t, i) =>
        t.tipo === 'strong' ? <strong key={i}>{t.texto}</strong> : t.tipo === 'em' ? <em key={i}>{t.texto}</em> : t.texto,
      )}
    </>
  );
}
