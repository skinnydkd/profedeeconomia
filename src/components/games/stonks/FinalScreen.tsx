/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth } from '@/lib/games/stonks/engine';
import { EvolucionChart } from './EvolucionChart';

// Final summary card: verdict, player vs AI scores, evolution chart, 6 lessons.

const LESSONS = [
  'Diversificar reduce el riesgo: no lo pongas todo en un solo activo.',
  'Tiempo en el mercado supera a acertar el momento: invertir pronto y mantener.',
  'El interés compuesto es la fuerza más poderosa de las finanzas.',
  'La volatilidad no es tu enemiga si tienes paciencia.',
  'El 80% de los fondos activos no baten al índice a largo plazo.',
  'DCA: invertir lo mismo cada periodo, pase lo que pase.',
];

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function FinalScreen({ state, onRestart }: Props) {
  const you = Math.round(netWorth(state));
  const ai = Math.round(state.ai.netWorth);
  const won = you >= ai;

  return (
    <div class="kf-card">
      <div class="kf-eyebrow">
        {state.history[0]?.year} — {state.history.at(-1)?.year} · {state.history.length} años
      </div>

      <div class="kf-verdict serif">
        Has <span class="ac">{won ? 'ganado contra' : 'perdido contra'}</span> el Mercado
      </div>

      <div class="kf-scores">
        <div class="kf-score you">
          <div class="l">Tu patrimonio</div>
          <div class="v">{you.toLocaleString('es-ES')} €</div>
        </div>
        <div class="kf-score ai">
          <div class="l">IA «El Mercat»</div>
          <div class="v">{ai.toLocaleString('es-ES')} €</div>
        </div>
      </div>

      <div class="kf-chart">
        <EvolucionChart history={state.history} />
        <div class="kf-legend">
          <span>
            <i style={{ background: '#C44E2C' }} />
            Tú
          </span>
          <span>
            <i style={{ background: '#8A7868' }} />
            IA «El Mercat»
          </span>
        </div>
      </div>

      <div class="kf-lessons">
        <h3 class="serif">Lo que has aprendido</h3>
        <ul>
          {LESSONS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <div class="kf-cta">
        <button class="primary" onClick={onRestart}>
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}
