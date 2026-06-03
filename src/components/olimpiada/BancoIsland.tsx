/** @jsxImportSource preact */
/**
 * Interactive island for the banco de preguntas.
 * Shows a row of bloque selector buttons; the selected block
 * feeds QuizPlayer with that block's questions.
 */
import { useState } from 'preact/hooks';
import QuizPlayer from '@components/QuizPlayer.tsx';
import type { Pregunta } from '@components/QuizPlayer.tsx';

interface BloqueTab {
  slug: string;
  label: string;
}

interface Props {
  porBloque: Record<string, Pregunta[]>;
  bloques: BloqueTab[];
}

export default function BancoIsland({ porBloque, bloques }: Props) {
  const [selected, setSelected] = useState<string>(bloques[0]?.slug ?? '');
  const preguntas = porBloque[selected] ?? [];

  return (
    <div class="banco">
      <div class="banco__chips">
        {bloques.map((b) => (
          <button
            key={b.slug}
            type="button"
            class={['banco__chip', selected === b.slug ? 'is-active' : ''].join(' ').trim()}
            onClick={() => setSelected(b.slug)}
          >
            {b.label}
            {porBloque[b.slug]?.length > 0 && (
              <span class="banco__count">{porBloque[b.slug].length}</span>
            )}
          </button>
        ))}
      </div>

      <div class="banco__player">
        {preguntas.length === 0 ? (
          <p class="banco__empty">
            Sin preguntas aún en este bloque — próximamente.
          </p>
        ) : (
          <QuizPlayer
            preguntas={preguntas}
            storageKey={`olimpiada-banco-${selected}`}
          />
        )}
      </div>

      <style>{`
        .banco { font-family: var(--font-sans); }
        .banco__chips {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .banco__chip {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: var(--font-sans); font-size: 0.85rem; font-weight: 600;
          color: var(--color-ink-soft); background: transparent;
          border: 1.5px solid var(--color-line); border-radius: 999px;
          padding: 0.4rem 0.9rem; cursor: pointer;
          transition: all .15s ease;
        }
        .banco__chip:hover { border-color: var(--color-terra); color: var(--color-terra); }
        .banco__chip.is-active {
          background: var(--color-terra); border-color: var(--color-terra);
          color: #fff;
        }
        .banco__count {
          font-size: 0.72rem; font-weight: 700;
          background: rgba(255,255,255,0.25); border-radius: 999px;
          padding: 0.05rem 0.4rem;
        }
        .banco__chip:not(.is-active) .banco__count {
          background: var(--color-bg-soft); color: var(--color-ink-mute);
        }
        .banco__player { min-height: 200px; }
        .banco__empty {
          color: var(--color-ink-mute); font-style: italic;
          padding: 1.5rem; text-align: center;
          background: var(--color-bg-soft); border-radius: 8px;
          border: 1px dashed var(--color-line);
        }
      `}</style>
    </div>
  );
}
