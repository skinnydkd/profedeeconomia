/** @jsxImportSource preact */
import type { Dispatch, StateUpdater } from 'preact/hooks';
import type { GameState } from '@/lib/games/seguros/types';
import { revealEvent, nextRound } from '@/lib/games/seguros/engine';
import { useGameLocale } from '../locale-context';
import { localizeEventLabel, localizeTeamName } from '@/i18n/games/seguros-ca';
import Scoreboard from './Scoreboard';

interface Props {
  state: GameState;
  setState: Dispatch<StateUpdater<GameState | null>>;
}

export const COPY = {
  es: {
    kicker: 'Imprevisto',
    ronda: 'Ronda',
    de: 'de',
    primasCobradas: 'Primas cobradas. El azar decide qué pasa esta ronda…',
    revelar: 'Revelar imprevisto',
    clasificacion: 'Clasificación',
    imprevisto: 'Imprevisto',
    sinNovedad: 'Sin novedad',
    dano: (n: number) => `Daño: ${n} € si no estabas cubierto`,
    cubierto: 'Cubierto: no paga',
    paga: (n: number) => `Paga ${n} €`,
    verResultados: 'Ver resultados finales →',
    siguienteRonda: 'Siguiente ronda →',
  },
  ca: {
    kicker: 'Imprevist',
    ronda: 'Ronda',
    de: 'de',
    primasCobradas: 'Primes cobrades. L\'atzar decidix què passa esta ronda…',
    revelar: 'Revela l\'imprevist',
    clasificacion: 'Classificació',
    imprevisto: 'Imprevist',
    sinNovedad: 'Sense novetat',
    dano: (n: number) => `Dany: ${n} € si no estaves cobert`,
    cubierto: 'Cobert: no paga',
    paga: (n: number) => `Paga ${n} €`,
    verResultados: 'Veure els resultats finals →',
    siguienteRonda: 'Ronda següent →',
  },
};

export default function EventScreen({ state, setState }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const ev = state.currentEvent;
  return (
    <div class="sg">
      <span class="sg__kicker">{c.kicker}</span>
      <h1>{c.ronda} {state.round} <span class="sg__round">{c.de} {state.config.rounds}</span></h1>

      {state.phase === 'event' && (
        <>
          <p>{c.primasCobradas}</p>
          <button class="sg-btn" onClick={() => setState((prev) => (prev ? revealEvent(prev) : prev))}>{c.revelar}</button>
          <h2>{c.clasificacion}</h2>
          <Scoreboard state={state} />
        </>
      )}

      {state.phase === 'resolved' && ev && (
        <>
          <div class="sg-event">
            <span class="sg__kicker">{ev.cubre ? c.imprevisto : c.sinNovedad}</span>
            <h2>{localizeEventLabel(ev, locale)}</h2>
            {ev.dano > 0 && <p class="dano">{c.dano(ev.dano)}</p>}
          </div>

          {ev.dano > 0 && ev.cubre && (
            <ul class="sg-score">
              {state.teams.map((t) => {
                const safe = t.coverage[ev.cubre!];
                return (
                  <li key={t.id}>
                    <span class="name">{localizeTeamName(t.name, locale)}</span>
                    <span class={safe ? 'sg-outcome--safe' : 'sg-outcome--hit'}>
                      {safe ? c.cubierto : c.paga(ev.dano)}
                    </span>
                    <span class="cash">{t.cash} €</span>
                  </li>
                );
              })}
            </ul>
          )}

          <h2>{c.clasificacion}</h2>
          <Scoreboard state={state} />

          <button class="sg-btn" onClick={() => setState((prev) => (prev ? nextRound(prev) : prev))}>
            {state.round >= state.config.rounds ? c.verResultados : c.siguienteRonda}
          </button>
        </>
      )}
    </div>
  );
}
