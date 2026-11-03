/** @jsxImportSource preact */
/**
 * Right/wrong mark next to an option once the answer is confirmed, so the
 * result does not rely on green and red alone. `soloLector` keeps the words
 * for screen readers and shows only the symbol (the matching rows).
 */
export default function Marca({ ok, texto, soloLector = false }: { ok: boolean; texto: string; soloLector?: boolean }) {
  return (
    <span class={['qp__marca', ok ? 'is-ok' : 'is-fail'].join(' ')}>
      <span aria-hidden="true">{ok ? '✓' : '✗'}</span>
      <span class={soloLector ? 'qp__sr' : 'qp__marca-texto'}>{texto}</span>
    </span>
  );
}
