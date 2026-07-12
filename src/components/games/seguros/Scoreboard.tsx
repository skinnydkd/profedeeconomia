/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { ranking } from '@/lib/games/seguros/engine';
import { useGameLocale } from '../locale-context';
import { localizeInsurances, localizeTeamName } from '@/i18n/games/seguros-ca';

export const COPY = {
  es: { sinSeguros: 'sin seguros' },
  ca: { sinSeguros: 'sense segurs' },
};

export default function Scoreboard({ state }: { state: GameState }) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const insurances = localizeInsurances(locale);
  const rows = ranking(state);
  return (
    <ol class="sg-score">
      {rows.map((t, i) => (
        <li key={t.id}>
          <span class="pos">{i + 1}.</span>
          <span class="name">{localizeTeamName(t.name, locale)}</span>
          <span class="cov">
            {insurances.filter((ins) => t.coverage[ins.key]).map((ins) => ins.label).join(' · ') || c.sinSeguros}
          </span>
          <span class="cash">{t.cash} €</span>
        </li>
      ))}
    </ol>
  );
}
