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
    lost: 'perdido contra el',
    verdictPost: 'Mercado',
    patrimonio: 'Tu patrimonio',
    ai: 'IA «El Mercado»',
    legendYou: 'Tú',
    lessonsTitle: 'Lo que has aprendido',
    restart: 'Jugar otra vez',
    dataNote:
      'Sobre los datos: rentabilidades anuales históricas y aproximadas, de 2000 a 2024. El IBEX 35 no incluye dividendos y el S&P 500 sí, y va en dólares, así que la comparación favorece al S&P. Los bonos rinden el interés de cada año, sin las pérdidas de precio que tuvieron en 2022.',
    lessons: [
      'Diversificar reduce el riesgo: no lo pongas todo en un solo activo.',
      'Tiempo en el mercado supera a acertar el momento: invertir pronto y mantener.',
      'El interés compuesto hace que lo ganado también gane: cuanto antes empiezas, más trabaja el tiempo.',
      'Ojo con el retrovisor: la IA invierte en el índice que mejor fue, y eso solo se sabe después. Rentabilidades pasadas no garantizan las futuras.',
      'La mayoría de los fondos de gestión activa no bate a su índice a largo plazo (informes SPIVA).',
      'DCA: invertir lo mismo cada periodo, pase lo que pase.',
    ],
  },
  ca: {
    eyebrow: (from: number | undefined, to: number | undefined, years: number) =>
      `${from} — ${to} · ${years} anys`,
    verdictPre: 'Has',
    won: 'guanyat el',
    lost: 'perdut contra el',
    verdictPost: 'Mercat',
    patrimonio: 'El teu patrimoni',
    ai: 'IA «El Mercat»',
    legendYou: 'Tu',
    lessonsTitle: 'El que has aprés',
    restart: 'Torna a jugar',
    dataNote:
      'Sobre les dades: rendibilitats anuals històriques i aproximades, de 2000 a 2024. L\'IBEX 35 no inclou dividends i l\'S&P 500 sí, i va en dòlars, així que la comparació afavorix l\'S&P. Els bons rendixen l\'interés de cada any, sense les pèrdues de preu que van tindre el 2022.',
    lessons: [
      'Diversificar reduïx el risc: no ho poses tot en un sol actiu.',
      'El temps en el mercat supera encertar el moment: invertir prompte i mantindre.',
      'L\'interés compost fa que el que has guanyat també guanye: com més prompte comences, més treballa el temps.',
      'Compte amb el retrovisor: la IA invertix en l\'índex que millor va anar, i això només se sap després. Les rendibilitats passades no garantixen les futures.',
      'La majoria dels fons de gestió activa no superen el seu índex a llarg termini (informes SPIVA).',
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
        <p class="kf-note">{c.dataNote}</p>
      </div>

      <div class="kf-cta">
        <button class="kf-cta-primary" onClick={onRestart}>
          {c.restart}
        </button>
      </div>
    </div>
  );
}
