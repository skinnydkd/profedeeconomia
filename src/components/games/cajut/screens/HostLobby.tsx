/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostLobby.tsx
// Lobby screen: room code display + asignatura/unit selector + player list + start button.
// Fetches /games-multi/cajut/manifest.json (generated at build by prebuild script).

import { useEffect, useState } from 'preact/hooks';
import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface ManifestUnidad {
  numero: number;
  title: string;
  preguntasCount: number;
}
interface ManifestAsig {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  unidades: ManifestUnidad[];
}
interface Manifest {
  generatedAt: string;
  version: number;
  asignaturas: ManifestAsig[];
}

interface Props {
  publicState: PublicState;
  onStart: (asignaturaSlug: string, unidades: number[], totalQuestions: number | 'all') => void;
  onKick: (playerId: string) => void;
}

export function HostLobby({ publicState, onStart, onKick }: Props) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedAsig, setSelectedAsig] = useState<string | null>(null);
  const [selectedUnidades, setSelectedUnidades] = useState<number[]>([]);
  const [totalQ, setTotalQ] = useState<number | 'all'>(15);

  useEffect(() => {
    fetch('/games-multi/cajut/manifest.json')
      .then((r) => r.json())
      .then(setManifest)
      .catch((err) => console.error('Failed to load Cajut manifest', err));
  }, []);

  const asigMeta = manifest?.asignaturas.find((a) => a.slug === selectedAsig) ?? null;

  function toggleUnidad(n: number) {
    setSelectedUnidades((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b),
    );
  }

  const canStart =
    selectedAsig !== null &&
    selectedUnidades.length > 0 &&
    publicState.players.length >= 1;

  return (
    <div class="cajut-host">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', margin: 0 }}>Cajut</h1>
        <span class="subtle">
          Sala oberta &middot; {publicState.players.length} alumne
          {publicState.players.length === 1 ? '' : 's'}
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
        {/* Left: room code */}
        <section>
          <p class="subtle">Codi de sala</p>
          <div class="codi-sala">{publicState.roomCode}</div>
          <p class="subtle" style={{ textAlign: 'center', marginTop: '8px' }}>
            Els alumnes entren a{' '}
            <code>profedeeconomia.es/juegos/cajut?room={publicState.roomCode}</code>
          </p>
        </section>

        {/* Right: asignatura + unit selector */}
        <section>
          <p class="subtle">Assignatura</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {manifest?.asignaturas.map((a) => (
              <button
                key={a.slug}
                onClick={() => {
                  setSelectedAsig(a.slug);
                  setSelectedUnidades([]);
                }}
                style={{
                  padding: '6px 10px',
                  border: `2px solid ${selectedAsig === a.slug ? a.color : 'var(--cajut-line)'}`,
                  background: selectedAsig === a.slug ? a.color : 'transparent',
                  color: selectedAsig === a.slug ? '#fff' : 'var(--cajut-ink)',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {a.shortName}
              </button>
            ))}
          </div>

          {asigMeta && (
            <div style={{ marginTop: '14px' }}>
              <p class="subtle">Unitats</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '4px',
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {asigMeta.unidades.map((u) => (
                  <label
                    key={u.numero}
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 13 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUnidades.includes(u.numero)}
                      onChange={() => toggleUnidad(u.numero)}
                    />
                    <span>
                      U{u.numero}. {u.title}
                    </span>
                    <span class="subtle" style={{ marginLeft: 'auto' }}>
                      {u.preguntasCount}
                    </span>
                  </label>
                ))}
              </div>

              <p class="subtle" style={{ marginTop: '10px' }}>Nombre de preguntes</p>
              <select
                value={String(totalQ)}
                onChange={(e) => {
                  const v = (e.target as HTMLSelectElement).value;
                  setTotalQ(v === 'all' ? 'all' : Number(v));
                }}
                style={{ fontSize: 14, padding: '4px 8px' }}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="all">Totes</option>
              </select>
            </div>
          )}
        </section>
      </div>

      {/* Player list */}
      <section style={{ marginTop: '24px' }}>
        <p class="subtle">Alumnes connectats</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {publicState.players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                if (confirm(`Expulsar ${p.nick}?`)) onKick(p.id);
              }}
              style={{
                padding: '6px 10px',
                border: '1px solid var(--cajut-line)',
                background: 'var(--cajut-paper)',
                borderRadius: 4,
                fontSize: 13,
                cursor: 'pointer',
              }}
              title="Clica per expulsar"
            >
              {p.nick}
            </button>
          ))}
          {publicState.players.length === 0 && (
            <span class="subtle">Cap alumne connectat encara.</span>
          )}
        </div>
      </section>

      {/* Start button */}
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '24px' }}>
        <button
          disabled={!canStart}
          onClick={() => onStart(selectedAsig!, selectedUnidades, totalQ)}
          style={{
            padding: '14px 36px',
            background: canStart ? 'var(--cajut-ink)' : 'var(--cajut-ink-mute)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
            cursor: canStart ? 'pointer' : 'not-allowed',
          }}
        >
          Comenar partida
        </button>
        {!canStart && (
          <p class="subtle" style={{ marginTop: 8 }}>
            {publicState.players.length === 0
              ? 'Esperant que entre algun alumne.'
              : selectedUnidades.length === 0
                ? 'Tria almenys una unitat.'
                : ''}
          </p>
        )}
      </div>
    </div>
  );
}
