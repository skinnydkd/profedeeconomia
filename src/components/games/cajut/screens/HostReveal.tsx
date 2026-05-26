/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostReveal.tsx
// Projector view during the reveal phase.
// Shows: same question text, options with correct highlighted and wrong dimmed,
// per-option vote counts + percentages.

import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
}

export function HostReveal({ publicState }: Props) {
  // currentQuestion is exposed during reveal phase (without `correcta`)
  // lastReveal carries correctOption + perOptionCounts
  const q = publicState.currentQuestion!;
  const rev = publicState.lastReveal!;
  const totalVotes = rev.perOptionCounts.reduce((s, n) => s + n, 0) || 1;

  return (
    <div class="cajut-host">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span class="subtle">
          Pregunta {q.index + 1} / {q.total} &mdash; Resultat
        </span>
      </header>

      <h2 class="enunciado-host" style={{ marginTop: '24px' }}>
        {q.enunciado}
      </h2>

      <div class="option-grid" style={{ marginTop: '32px' }}>
        {q.opciones.map((opt, i) => {
          const count = rev.perOptionCounts[i] ?? 0;
          const pct = Math.round((count / totalVotes) * 100);
          const isCorrect = i === rev.correctOption;
          return (
            <div
              key={i}
              class={`option-cell ${isCorrect ? 'correct' : 'dimmed'}`}
              data-opt={i}
            >
              <span class="letter">{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                {count} &middot; {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Top 5 mini-podium */}
      {rev.top5.length > 0 && (
        <section style={{ marginTop: '24px' }}>
          <p class="subtle">Top 5</p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rev.top5.map((p, i) => (
              <li
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  borderBottom: '1px solid var(--cajut-line-soft)',
                  fontSize: 15,
                }}
              >
                <span>
                  <strong>{i + 1}.</strong> {p.nick}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.score}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
