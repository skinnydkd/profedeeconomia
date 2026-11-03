/** @jsxImportSource preact */
import type { ComponentChildren } from 'preact';
import type { MiniId, Modo } from '@/lib/games/teoria-juegos/types';
import { miniMeta } from '@/lib/games/teoria-juegos/registry';
import { useGameLocale } from '../locale-context';
import { COPY } from './copy';
import ModoSwitch from './ModoSwitch';

/**
 * Chrome around one experiment: its accent colour, the way back to the hub, the
 * mode switch and the link to the paper dinámica that covers the same game.
 */
export default function MiniShell({
  id,
  modo,
  onModo,
  onVolver,
  children,
}: {
  id: MiniId;
  modo: Modo;
  onModo: (m: Modo) => void;
  onVolver: () => void;
  children: ComponentChildren;
}) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const meta = miniMeta(id);
  const t = c.minis[id];
  return (
    <div class="tj" style={`--tj-color: var(${meta.colorVar})`}>
      <div class="tj-cabecera">
        <button type="button" class="tj-link" onClick={onVolver}>
          {c.volver}
        </button>
        <ModoSwitch modo={modo} onModo={onModo} />
      </div>
      <h1>{t.title}</h1>
      <p class="tj__lede">{t.tagline}</p>
      {children}
      {meta.papel && (
        <p class="tj-papel">
          {c.enPapel} <a href={meta.papel.href}>{meta.papel.label[locale]}</a>
        </p>
      )}
    </div>
  );
}
