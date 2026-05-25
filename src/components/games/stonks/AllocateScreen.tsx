/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import {
  unlockedAssets,
  allocationSum,
  isAllocationValid,
  netWorth,
  currentYear,
} from '@/lib/games/stonks/engine';
import { ASSETS, TOTAL_ROUNDS } from '@/lib/games/stonks/data';

// Core allocation screen — the player distributes 100% among unlocked assets.

interface Props {
  state: GameState;
  onChange: (id: string, delta: number) => void; // step of +/-5
  onConfirm: () => void;
}

const RISK_LABEL: Record<string, string> = {
  baja: 'Riesgo bajo',
  media: 'Riesgo medio',
  alta: 'Riesgo alto',
  extrema: 'Riesgo extremo',
};

export function AllocateScreen({ state, onChange, onConfirm }: Props) {
  const unlocked = unlockedAssets(state.round);
  const sum = allocationSum(state);
  const valid = isAllocationValid(state);

  return (
    <div class="sk-phone">
      <div class="sk-top">
        <div>
          <div class="sk-year serif">{currentYear(state)}</div>
          <div class="sk-round">
            Ronda {state.round + 1} de {TOTAL_ROUNDS}
          </div>
        </div>
      </div>

      <div class="sk-wealth">
        <div class="l">Tu patrimonio</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div>
      </div>

      <div class="sk-assets">
        {ASSETS.map((a) => {
          const locked = !unlocked.some((u) => u.id === a.id);
          const pct = state.allocation[a.id] || 0;
          return (
            <div class={`sk-asset risk-${a.risk}${locked ? ' locked' : ''}`} key={a.id}>
              <div class="row1">
                <div>
                  <span class="nm">{a.label}</span>
                  {locked ? (
                    <span class="lock">se desbloquea más adelante</span>
                  ) : (
                    <span class={`risk r-${a.risk}`}>{RISK_LABEL[a.risk]}</span>
                  )}
                </div>
                {!locked && (
                  <div class="ctrl">
                    <button class="sk-btn" onClick={() => onChange(a.id, -5)}>
                      −
                    </button>
                    <span class="sk-pct">{pct}%</span>
                    <button class="sk-btn" onClick={() => onChange(a.id, +5)}>
                      +
                    </button>
                  </div>
                )}
              </div>
              {!locked && (
                <div class="sk-bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div class="sk-total">
        <span class="lab">Total repartido</span>
        <span class={valid ? 'ok' : 'bad'}>
          {sum}%{valid ? ' ✓' : ''}
        </span>
      </div>

      <button class="sk-cta" disabled={!valid} onClick={onConfirm}>
        Confirmar inversión
      </button>
    </div>
  );
}
