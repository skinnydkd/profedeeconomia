/** @jsxImportSource preact */
import type { Dispatch, StateUpdater } from 'preact/hooks';
import type { GameState } from '@/lib/games/seguros/types';
import { revealEvent, nextRound } from '@/lib/games/seguros/engine';
import Scoreboard from './Scoreboard';

interface Props {
  state: GameState;
  setState: Dispatch<StateUpdater<GameState | null>>;
}

export default function EventScreen({ state, setState }: Props) {
  const ev = state.currentEvent;
  return (
    <div class="sg">
      <span class="sg__kicker">Imprevisto</span>
      <h1>Ronda {state.round} <span class="sg__round">de {state.config.rounds}</span></h1>

      {state.phase === 'event' && (
        <>
          <p>Primas cobradas. El azar decide qué pasa esta ronda…</p>
          <button class="sg-btn" onClick={() => setState(revealEvent(state))}>Revelar imprevisto</button>
        </>
      )}

      {state.phase === 'resolved' && ev && (
        <>
          <div class="sg-event">
            <span class="sg__kicker">{ev.cubre ? 'Imprevisto' : 'Sin novedad'}</span>
            <h2>{ev.label}</h2>
            {ev.dano > 0 && <p class="dano">Daño: {ev.dano} € si no estabas cubierto</p>}
          </div>

          {ev.dano > 0 && ev.cubre && (
            <ul class="sg-score">
              {state.teams.map((t) => {
                const safe = t.coverage[ev.cubre!];
                return (
                  <li key={t.id}>
                    <span class="name">{t.name}</span>
                    <span class={safe ? 'sg-outcome--safe' : 'sg-outcome--hit'}>
                      {safe ? 'Cubierto: no paga' : `Paga ${ev.dano} €`}
                    </span>
                    <span class="cash">{t.cash} €</span>
                  </li>
                );
              })}
            </ul>
          )}

          <h2>Clasificación</h2>
          <Scoreboard state={state} />

          <button class="sg-btn" onClick={() => setState(nextRound(state))}>
            {state.round >= state.config.rounds ? 'Ver resultados finales →' : 'Siguiente ronda →'}
          </button>
        </>
      )}
    </div>
  );
}
