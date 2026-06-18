/** @jsxImportSource preact */
import type { Dispatch, StateUpdater } from 'preact/hooks';
import type { GameState } from '@/lib/games/seguros/types';
import { INSURANCES } from '@/lib/games/seguros/data';
import { setCoverage, lockCoverage, premiumsFor } from '@/lib/games/seguros/engine';

interface Props {
  state: GameState;
  setState: Dispatch<StateUpdater<GameState | null>>;
}

export default function CoverageScreen({ state, setState }: Props) {
  const toggle = (teamId: number, key: typeof INSURANCES[number]['key']) =>
    setState(setCoverage(state, teamId, key));

  return (
    <div class="sg">
      <span class="sg__kicker">Cobertura</span>
      <h1>Ronda {state.round} <span class="sg__round">de {state.config.rounds}</span></h1>
      <p>Cada equipo cobra <strong>{state.config.income} €</strong> esta ronda. Marca qué seguros
        contrata cada equipo (se mantiene lo de la ronda anterior). Al confirmar se cobran las primas.</p>

      <table class="sg-grid">
        <thead>
          <tr>
            <th>Equipo</th>
            {INSURANCES.map((ins) => (
              <th key={ins.key}>{ins.label}<span class="prima">{ins.prima} €</span></th>
            ))}
            <th>Prima total</th>
          </tr>
        </thead>
        <tbody>
          {state.teams.map((t) => (
            <tr key={t.id}>
              <td>{t.name}<span class="prima">{t.cash} €</span></td>
              {INSURANCES.map((ins) => (
                <td key={ins.key}>
                  <button
                    class="sg-cell"
                    aria-pressed={t.coverage[ins.key] ? 'true' : 'false'}
                    title={`${t.name} · ${ins.label}`}
                    onClick={() => toggle(t.id, ins.key)}
                  >{t.coverage[ins.key] ? '✓' : ''}</button>
                </td>
              ))}
              <td class="prima">{premiumsFor(t)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style="margin-top:1.2rem">
        <button class="sg-btn" onClick={() => setState(lockCoverage(state))}>
          Confirmar cobertura y cobrar primas →
        </button>
      </p>
    </div>
  );
}
