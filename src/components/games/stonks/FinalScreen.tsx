/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth } from '@/lib/games/stonks/engine';
import { EvolucionChart } from './EvolucionChart';
import { useGameLocale } from '../locale-context';

// Final summary card: verdict, player vs AI scores, evolution chart, 6 lessons.

export const COPY = {
  es: {
    eyebrow: (from: number | undefined, to: number | undefined, years: number) =>
      `${from} — ${to} · ${years} años`,
    verdictPre: 'Has',
    won: 'ganado al',
    lost: 'perdido contra',
    verdictPost: 'el Mercado',
    patrimonio: 'Tu patrimonio',
    ai: 'IA «El Mercat»',
    legendYou: 'Tú',
    lessonsTitle: 'Lo que has aprendido',
    restart: 'Jugar otra vez',
    lessons: [
      'Diversificar reduce el riesgo: no lo pongas todo en un solo activo.',
      'Tiempo en el mercado supera a acertar el momento: invertir pronto y mantener.',
      'El interés compuesto es la fuerza más poderosa de las finanzas.',
      'La volatilidad no es tu enemiga si tienes paciencia.',
      'El 80% de los fondos activos no baten al índice a largo plazo.',
      'DCA: invertir lo mismo cada periodo, pase lo que pase.',
    ],
  },
  ca: {
    eyebrow: (from: number | undefined, to: number | undefined, years: number) =>
      `${from} — ${to} · ${years} anys`,
    verdictPre: 'Has',
    won: 'guanyat al',
    lost: 'perdut contra',
    verdictPost: 'el Mercat',
    patrimonio: 'El teu patrimoni',
    ai: 'IA «El Mercat»',
    legendYou: 'Tu',
    lessonsTitle: 'El que has aprés',
    restart: 'Torna a jugar',
    lessons: [
      'Diversificar reduïx el risc: no ho poses tot en un sol actiu.',
      'El temps en el mercat supera encertar el moment: invertir prompte i mantindre.',
      'L\'interés compost és la força més poderosa de les finances.',
      'La volatilitat no és la teua enemiga si tens paciència.',
      'El 80 % dels fons actius no superen l\'índex a llarg termini.',
      'DCA: invertir el mateix cada període, passe el que passe.',
    ],
  },
};

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function FinalScreen({ state, onRestart }: Props) {
  const c = COPY[useGameLocale()];
  const you = Math.round(netWorth(state));
  const ai = Math.round(state.ai.netWorth);
  const won = you >= ai;

  return (
    <div class="kf-card">
      <div class="kf-eyebrow">
        {c.eyebrow(state.history[0]?.year, state.history.at(-1)?.year, state.history.length)}
      </div>

      <div class="kf-verdict serif">
        {c.verdictPre} <span class="ac">{won ? c.won : c.lost}</span> {c.verdictPost}
      </div>

      <div class="kf-scores">
        <div class="kf-score you">
          <div class="l">{c.patrimonio}</div>
          <div class="v">{you.toLocaleString('es-ES')} €</div>
        </div>
        <div class="kf-score ai">
          <div class="l">{c.ai}</div>
          <div class="v">{ai.toLocaleString('es-ES')} €</div>
        </div>
      </div>

      <div class="kf-chart">
        <EvolucionChart history={state.history} />
        <div class="kf-legend">
          <span>
            <i style={{ background: '#C44E2C' }} />
            {c.legendYou}
          </span>
          <span>
            <i style={{ background: '#8A7868' }} />
            {c.ai}
          </span>
        </div>
      </div>

      <div class="kf-lessons">
        <h3 class="serif">{c.lessonsTitle}</h3>
        <ul>
          {c.lessons.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <div class="kf-cta">
        <button class="kf-cta-primary" onClick={onRestart}>
          {c.restart}
        </button>
      </div>
    </div>
  );
}
