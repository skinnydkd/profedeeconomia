/** @jsxImportSource preact */
import type { Dispatch, StateUpdater } from 'preact/hooks';
import type { GameState, InsuranceKey } from '@/lib/games/seguros/types';
import { setCoverage, lockCoverage, premiumsFor } from '@/lib/games/seguros/engine';
import { useGameLocale } from '../locale-context';
import { localizeInsurances, localizeTeamName } from '@/i18n/games/seguros-ca';
import Scoreboard from './Scoreboard';

interface Props {
  state: GameState;
  setState: Dispatch<StateUpdater<GameState | null>>;
}

export const COPY = {
  es: {
    kicker: 'Cobertura',
    ronda: 'Ronda',
    de: 'de',
    cobraPre: 'Cada equipo cobra',
    cobraPost:
      'esta ronda. Marca qué seguros contrata cada equipo (se mantiene lo de la ronda anterior). Al confirmar se cobran las primas.',
    equipo: 'Equipo',
    primaTotal: 'Prima total',
    coverAria: (team: string, ins: string, covered: boolean) =>
      `${team} · ${ins}${covered ? ' (cubierto)' : ''}`,
    clasificacion: 'Clasificación',
    confirmar: 'Confirmar cobertura y cobrar primas →',
  },
  ca: {
    kicker: 'Cobertura',
    ronda: 'Ronda',
    de: 'de',
    cobraPre: 'Cada equip cobra',
    cobraPost:
      'esta ronda. Marca quins segurs contracta cada equip (es manté el de la ronda anterior). En confirmar es cobren les primes.',
    equipo: 'Equip',
    primaTotal: 'Prima total',
    coverAria: (team: string, ins: string, covered: boolean) =>
      `${team} · ${ins}${covered ? ' (cobert)' : ''}`,
    clasificacion: 'Classificació',
    confirmar: 'Confirma la cobertura i cobra les primes →',
  },
};

export default function CoverageScreen({ state, setState }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const insurances = localizeInsurances(locale);

  // Functional updater: derive from the latest state, not the closed-over
  // `state`. Otherwise several quick toggles between renders clobber each other
  // (each handler would start from the same stale snapshot).
  const toggle = (teamId: number, key: InsuranceKey) =>
    setState((prev) => (prev ? setCoverage(prev, teamId, key) : prev));

  return (
    <div class="sg">
      <span class="sg__kicker">{c.kicker}</span>
      <h1>{c.ronda} {state.round} <span class="sg__round">{c.de} {state.config.rounds}</span></h1>
      <p>{c.cobraPre} <strong>{state.config.income} €</strong> {c.cobraPost}</p>

      <table class="sg-grid">
        <thead>
          <tr>
            <th>{c.equipo}</th>
            {insurances.map((ins) => (
              <th key={ins.key}>{ins.label}<span class="prima">{ins.prima} €</span></th>
            ))}
            <th>{c.primaTotal}</th>
          </tr>
        </thead>
        <tbody>
          {state.teams.map((t) => (
            <tr key={t.id}>
              <td>{localizeTeamName(t.name, locale)}<span class="prima">{t.cash} €</span></td>
              {insurances.map((ins) => (
                <td key={ins.key}>
                  <button
                    class="sg-cell"
                    aria-pressed={t.coverage[ins.key] ? 'true' : 'false'}
                    aria-label={c.coverAria(localizeTeamName(t.name, locale), ins.label, t.coverage[ins.key])}
                    onClick={() => toggle(t.id, ins.key)}
                  >{t.coverage[ins.key] ? '✓' : ''}</button>
                </td>
              ))}
              <td class="prima">{premiumsFor(t)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style="margin-top:1.4rem">{c.clasificacion}</h2>
      <Scoreboard state={state} />

      <p style="margin-top:1.2rem">
        <button class="sg-btn" onClick={() => setState((prev) => (prev ? lockCoverage(prev) : prev))}>
          {c.confirmar}
        </button>
      </p>
    </div>
  );
}
