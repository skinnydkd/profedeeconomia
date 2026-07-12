/** @jsxImportSource preact */
// EndScreen — winner + per-faction stats + economic lesson per school.
// Props: { state, onRestart }

import type { GameState, FactionId } from '@/lib/games/econrisk/types';
import { ownedCount } from '@/lib/games/econrisk/engine';
import { useGameLocale } from '../locale-context';
import { localizeFactions, localizeFactionMeta } from '@/i18n/games/econrisk-ca';

export const COPY = {
  es: {
    lessons: {
      keynes:
        'El keynesianismo demuestra que la inversión pública puede estabilizar la economía en crisis: el Estado como motor de demanda agregada.',
      marx:
        'El marxismo analiza las contradicciones del capital: la conquista territorial refleja cómo la acumulación genera conflicto estructural.',
      austrian:
        'La escuela austríaca defiende la solidez monetaria y la espontaneidad del mercado: la defensa robusta es la base de la prosperidad.',
      neoclassic:
        'La economía neoclásica usa el concepto de ventaja comparativa: especializarse donde eres más eficiente maximiza el bienestar global.',
    } as Record<FactionId, string>,
    endEyebrow: (round: number) => `Ronda ${round} · Partida terminada`,
    ganan: 'Ganan los',
    partidaTerminada: 'Partida terminada',
    eliminado: '(eliminado)',
    leccionTitle: 'Lección de economía',
    jugarOtraVez: 'Jugar otra vez',
  },
  ca: {
    lessons: {
      keynes:
        "El keynesianisme demostra que la inversió pública pot estabilitzar l'economia en crisi: l'Estat com a motor de la demanda agregada.",
      marx:
        "El marxisme analitza les contradiccions del capital: la conquista territorial reflectix com l'acumulació genera conflicte estructural.",
      austrian:
        "L'escola austríaca defén la solidesa monetària i l'espontaneïtat del mercat: la defensa robusta és la base de la prosperitat.",
      neoclassic:
        "L'economia neoclàssica usa el concepte d'avantatge comparatiu: especialitzar-se on eres més eficient maximitza el benestar global.",
    } as Record<FactionId, string>,
    endEyebrow: (round: number) => `Ronda ${round} · Partida acabada`,
    ganan: 'Guanyen els',
    partidaTerminada: 'Partida acabada',
    eliminado: '(eliminat)',
    leccionTitle: "Lliçó d'economia",
    jugarOtraVez: 'Torna a jugar',
  },
};

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function EndScreen({ state, onRestart }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const winner = state.winner;
  const winnerMeta = winner ? localizeFactionMeta(locale)[winner] : null;

  // Sort factions by territory count descending
  const factions = localizeFactions(locale);
  const sorted = [...factions].sort(
    (a, b) => ownedCount(state, b.id) - ownedCount(state, a.id),
  );

  return (
    <div class="er-end">
      <div class="er-end-card">
        <div class="er-end-eyebrow">
          {c.endEyebrow(state.round)}
        </div>

        <h2 class="er-end-headline">
          {winnerMeta ? (
            <>
              {c.ganan}{' '}
              <span class="ac" style={{ color: winnerMeta.color }}>
                {winnerMeta.label}
              </span>
            </>
          ) : (
            c.partidaTerminada
          )}
        </h2>

        {/* Winner faction card */}
        {winnerMeta && (
          <div class="er-winner-card">
            <div class="er-winner-top" style={{ background: winnerMeta.color }} />
            <div class="er-winner-body">
              <div>
                <p class="er-winner-school">{winnerMeta.school}</p>
                <h3 class="er-winner-name">{winnerMeta.label}</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#5C4A3D' }}>
                  {winnerMeta.power}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Per-faction territory counts */}
        <div class="er-faction-stats">
          {sorted.map((f) => {
            const count = ownedCount(state, f.id);
            const alive = state.factions[f.id].alive;
            return (
              <div
                key={f.id}
                class={`er-faction-stat-row${f.id === winner ? ' winner' : ''}`}
              >
                <span
                  class="er-faction-stat-swatch"
                  style={{ background: f.color, opacity: alive ? 1 : 0.35 }}
                />
                <span class="er-faction-stat-name">
                  {f.label}
                  {!alive && (
                    <span style={{ color: '#8A7868', fontWeight: 400, fontSize: '0.78rem' }}>
                      {' '}{c.eliminado}
                    </span>
                  )}
                </span>
                <span class="er-faction-stat-count">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Economic lesson for the winning school */}
        {winner && (
          <div class="er-lessons">
            <h3>{c.leccionTitle}</h3>
            <ul>
              <li>{c.lessons[winner]}</li>
            </ul>
          </div>
        )}

        <button class="er-end-cta" onClick={onRestart}>
          {c.jugarOtraVez}
        </button>
      </div>
    </div>
  );
}
