/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { ranking } from '@/lib/games/seguros/engine';
import { INSURANCES } from '@/lib/games/seguros/data';

export default function Scoreboard({ state }: { state: GameState }) {
  const rows = ranking(state);
  return (
    <ol class="sg-score">
      {rows.map((t, i) => (
        <li key={t.id}>
          <span class="pos">{i + 1}.</span>
          <span class="name">{t.name}</span>
          <span class="cov">
            {INSURANCES.filter((ins) => t.coverage[ins.key]).map((ins) => ins.label).join(' · ') || 'sin seguros'}
          </span>
          <span class="cash">{t.cash} €</span>
        </li>
      ))}
    </ol>
  );
}
