/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { finalize, WINDOW_YEARS } from '@/lib/games/stonks/engine';
import { buildLessons } from '@/lib/games/stonks/lessons';
import { EvolucionChart } from './EvolucionChart';
import { useGameLocale } from '../locale-context';

// Final card: what the 25 years came to after tax, in euros and in purchasing
// power, against a benchmark that made no decisions at all.

export const COPY = {
  es: {
    eyebrow: (from: number, to: number) => `${from} — ${to} · ${WINDOW_YEARS} años`,
    verdictPre: 'Has',
    won: 'ganado a',
    lost: 'perdido contra',
    verdictPost: '«El Mercado»',
    patrimonio: 'Tu patrimonio',
    ai: '«El Mercado»',
    settle: 'Cifras después de liquidar y pagar los impuestos sobre las plusvalías.',
    legendYou: 'Tú, en euros',
    legendReal: 'Tú, en poder adquisitivo',
    legendAi: '«El Mercado»',
    lessonsTitle: 'Lo que ha pasado en tu partida',
    dataNote:
      'Rendimientos anuales históricos redondeados y no auditados; el reparto por semestres ' +
      'sigue el método documentado en el código.',
    restart: 'Jugar otra vez',
  },
  ca: {
    eyebrow: (from: number, to: number) => `${from} — ${to} · ${WINDOW_YEARS} anys`,
    verdictPre: 'Has',
    won: 'guanyat',
    lost: 'perdut contra',
    verdictPost: '«El Mercat»',
    patrimonio: 'El teu patrimoni',
    ai: '«El Mercat»',
    settle: 'Xifres després de liquidar i pagar els impostos sobre les plusvàlues.',
    legendYou: 'Tu, en euros',
    legendReal: 'Tu, en poder adquisitiu',
    legendAi: '«El Mercat»',
    lessonsTitle: 'El que ha passat en la teua partida',
    dataNote:
      'Rendiments anuals històrics arredonits i no auditats; el repartiment per semestres ' +
      'segueix el mètode documentat al codi.',
    restart: 'Torna a jugar',
  },
};

interface Props {
  state: GameState;
  onRestart: () => void;
}

const euros = (n: number) => Math.round(n).toLocaleString('es-ES');

export function FinalScreen({ state, onRestart }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const { player, ai } = finalize(state);
  const won = player >= ai;
  const from = state.history[0]?.year ?? state.startYear;
  const to = state.history.at(-1)?.year ?? state.startYear + WINDOW_YEARS - 1;

  return (
    <div class="kf-card">
      <div class="kf-eyebrow">{c.eyebrow(from, to)}</div>

      <div class="kf-verdict serif">
        {c.verdictPre} <span class="ac">{won ? c.won : c.lost}</span> {c.verdictPost}
      </div>

      <div class="kf-scores">
        <div class="kf-score you">
          <div class="l">{c.patrimonio}</div>
          <div class="v">{euros(player)} €</div>
        </div>
        <div class="kf-score ai">
          <div class="l">{c.ai}</div>
          <div class="v">{euros(ai)} €</div>
        </div>
      </div>
      <p class="kf-settle">{c.settle}</p>

      <div class="kf-chart">
        <EvolucionChart history={state.history} />
        <div class="kf-legend">
          <span>
            <i style={{ background: '#C44E2C' }} />
            {c.legendYou}
          </span>
          <span>
            <i class="dashed" style={{ background: '#C44E2C' }} />
            {c.legendReal}
          </span>
          <span>
            <i style={{ background: '#8A7868' }} />
            {c.legendAi}
          </span>
        </div>
      </div>

      <div class="kf-lessons">
        <h3 class="serif">{c.lessonsTitle}</h3>
        <ul>
          {buildLessons(state, locale).map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p class="kf-note">{c.dataNote}</p>
      </div>

      <p class="kf-datanote">{c.dataNote}</p>

      <div class="kf-cta">
        <button class="kf-cta-primary" onClick={onRestart}>
          {c.restart}
        </button>
      </div>
    </div>
  );
}
