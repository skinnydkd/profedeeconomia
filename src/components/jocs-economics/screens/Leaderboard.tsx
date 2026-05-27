// src/components/jocs-economics/screens/Leaderboard.tsx
import { useState, useEffect } from 'preact/hooks';
import { api } from '../../../lib/jocs-economics/client/api';
import type { LeaderboardIndividualRow, LeaderboardInstituteRow } from '../../../lib/jocs-economics/client/types';
import '../jocs.css';

export default function Leaderboard() {
  const [tab, setTab] = useState<'individual' | 'institute'>('individual');
  const [individual, setIndividual] = useState<LeaderboardIndividualRow[]>([]);
  const [institute, setInstitute] = useState<LeaderboardInstituteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const promise = tab === 'individual'
      ? api.leaderboardIndividual(50, 0).then((r) => setIndividual(r.rows))
      : api.leaderboardInstitute(50, 0).then((r) => setInstitute(r.rows));
    promise.catch(() => {}).finally(() => setLoading(false));
  }, [tab]);

  function formatTime(ms: number): string {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  return (
    <div class="jocs-app">
      <h1 class="jocs-title" style={{ fontSize: 28, margin: '20px 0' }}>Ranking</h1>

      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--jocs-line-soft)', marginBottom: 20 }}>
        <button
          onClick={() => setTab('individual')}
          style={{
            background: 'none', border: 'none', padding: '8px 0',
            fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
            color: tab === 'individual' ? 'var(--jocs-ink)' : 'var(--jocs-ink-mute)',
            borderBottom: tab === 'individual' ? '2px solid var(--jocs-blue-deep)' : '2px solid transparent',
            fontWeight: tab === 'individual' ? 600 : 400,
          }}
        >
          Individual
        </button>
        <button
          onClick={() => setTab('institute')}
          style={{
            background: 'none', border: 'none', padding: '8px 0',
            fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
            color: tab === 'institute' ? 'var(--jocs-ink)' : 'var(--jocs-ink-mute)',
            borderBottom: tab === 'institute' ? '2px solid var(--jocs-blue-deep)' : '2px solid transparent',
            fontWeight: tab === 'institute' ? 600 : 400,
          }}
        >
          Institutos
        </button>
      </div>

      {loading && <p class="jocs-mute">Cargando…</p>}

      {!loading && tab === 'individual' && (
        individual.length === 0 ? (
          <p class="jocs-mute">Aún no hay partidas registradas. ¡Sé el primero!</p>
        ) : (
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {individual.map((r) => (
              <li key={`${r.rank}-${r.playerName}`} style={{ padding: '12px 0', borderBottom: '1px solid var(--jocs-line-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
                    #{r.rank} {r.playerName}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18 }}>{r.score}</span>
                </div>
                <div class="jocs-mute" style={{ fontSize: 12 }}>
                  {r.institute} · {r.questionsAnswered} preg · {formatTime(r.timeTotalMs)}
                </div>
              </li>
            ))}
          </ol>
        )
      )}

      {!loading && tab === 'institute' && (
        institute.length === 0 ? (
          <p class="jocs-mute">Aún no hay institutos en el ranking.</p>
        ) : (
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {institute.map((r) => (
              <li key={`${r.rank}-${r.institute}`} style={{ padding: '12px 0', borderBottom: '1px solid var(--jocs-line-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
                    #{r.rank} {r.institute}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18 }}>{r.totalScore}</span>
                </div>
                <div class="jocs-mute" style={{ fontSize: 12 }}>
                  Top 5: {r.totalScore} pts · Top jugador: {r.topPlayer.playerName} ({r.topPlayer.score}) · {r.playersCount} participantes
                </div>
              </li>
            ))}
          </ol>
        )
      )}

      <p style={{ textAlign: 'center', marginTop: 32 }}>
        <a class="jocs-link" href="/jocs-economics/">← Volver a jugar</a>
      </p>
    </div>
  );
}
