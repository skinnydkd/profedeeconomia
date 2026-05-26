/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostFinal.tsx
// Final podium screen shown to the host after all questions are done.
// Shows: top-3 podium (rising boxes), full ranking, "Nova partida" button.

import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
  onRestart: () => void;
}

export function HostFinal({ publicState, onRestart }: Props) {
  const ranking = publicState.finalRanking ?? [];
  const [first, second, third] = [ranking[0], ranking[1], ranking[2]];

  return (
    <div class="cajut-host">
      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          textAlign: 'center',
          fontSize: 36,
          margin: '0 0 8px',
        }}
      >
        Final de la partida
      </h2>

      {/* Podium top-3 */}
      <div class="podi">
        {/* 2nd place — left */}
        <div class="step second">
          {second ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>2n</div>
              <div style={{ fontSize: 22, fontFamily: 'Fraunces, serif' }}>{second.nick}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', marginTop: 6 }}>
                {second.score}
              </div>
            </>
          ) : (
            <span class="subtle">—</span>
          )}
        </div>

        {/* 1st place — center, tallest */}
        <div class="step first">
          {first ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>1r</div>
              <div style={{ fontSize: 28, fontFamily: 'Fraunces, serif' }}>{first.nick}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, marginTop: 8 }}>
                {first.score}
              </div>
            </>
          ) : (
            <span class="subtle">—</span>
          )}
        </div>

        {/* 3rd place — right */}
        <div class="step third">
          {third ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>3r</div>
              <div style={{ fontSize: 20, fontFamily: 'Fraunces, serif' }}>{third.nick}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', marginTop: 6 }}>
                {third.score}
              </div>
            </>
          ) : (
            <span class="subtle">—</span>
          )}
        </div>
      </div>

      <p class="subtle" style={{ textAlign: 'center', marginTop: '24px' }}>
        Els alumnes poden revisar les seues respostes al movil.
      </p>

      {/* Full ranking */}
      <ol style={{ maxWidth: 600, margin: '24px auto 0', listStyle: 'none', padding: 0 }}>
        {ranking.map((p, i) => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 14px',
              borderBottom: '1px solid var(--cajut-line-soft)',
              fontSize: 14,
            }}
          >
            <span>
              {i + 1}. {p.nick}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.score}</span>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '16px' }}>
        <button
          onClick={onRestart}
          style={{
            padding: '12px 28px',
            background: 'var(--cajut-ink)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Nova partida
        </button>
      </div>
    </div>
  );
}
