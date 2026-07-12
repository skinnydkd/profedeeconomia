/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import {
  unlockedAssets,
  allocationSum,
  isAllocationValid,
  netWorth,
  currentYear,
} from '@/lib/games/stonks/engine';
import { TOTAL_ROUNDS, ALLOCATION_STEP } from '@/lib/games/stonks/data';
import { useGameLocale } from '../locale-context';
import { localizeAssets } from '@/i18n/games/stonks-ca';

// Core allocation screen — the player distributes 100% among unlocked assets.

interface Props {
  state: GameState;
  onChange: (id: string, delta: number) => void; // step of +/-5
  onConfirm: () => void;
}

export const COPY = {
  es: {
    ronda: (n: number, total: number) => `Ronda ${n} de ${total}`,
    patrimonio: 'Tu patrimonio',
    bloqueado: 'se desbloquea más adelante',
    reducir: (label: string) => `Reducir ${label} ${ALLOCATION_STEP}%`,
    aumentar: (label: string) => `Aumentar ${label} ${ALLOCATION_STEP}%`,
    total: 'Total repartido',
    confirmar: 'Confirmar inversión',
    riesgo: { baja: 'Riesgo bajo', media: 'Riesgo medio', alta: 'Riesgo alto', extrema: 'Riesgo extremo' },
  },
  ca: {
    ronda: (n: number, total: number) => `Ronda ${n} de ${total}`,
    patrimonio: 'El teu patrimoni',
    bloqueado: 'es desbloqueja més avant',
    reducir: (label: string) => `Reduir ${label} ${ALLOCATION_STEP}%`,
    aumentar: (label: string) => `Augmentar ${label} ${ALLOCATION_STEP}%`,
    total: 'Total repartit',
    confirmar: 'Confirma la inversió',
    riesgo: { baja: 'Risc baix', media: 'Risc mitjà', alta: 'Risc alt', extrema: 'Risc extrem' },
  },
};

export function AllocateScreen({ state, onChange, onConfirm }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const assets = localizeAssets(locale);
  const unlocked = unlockedAssets(state.round);
  const sum = allocationSum(state);
  const valid = isAllocationValid(state);

  return (
    <div class="sk-phone">
      <div class="sk-top">
        <div>
          <div class="sk-year serif">{currentYear(state)}</div>
          <div class="sk-round">{c.ronda(state.round + 1, TOTAL_ROUNDS)}</div>
        </div>
      </div>

      <div class="sk-wealth">
        <div class="l">{c.patrimonio}</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div>
      </div>

      <div class="sk-assets">
        {assets.map((a) => {
          const locked = !unlocked.some((u) => u.id === a.id);
          const pct = state.allocation[a.id] || 0;
          return (
            <div class={`sk-asset risk-${a.risk}${locked ? ' locked' : ''}`} key={a.id}>
              <div class="row1">
                <div>
                  <span class="nm">{a.label}</span>
                  {locked ? (
                    <span class="lock">{c.bloqueado}</span>
                  ) : (
                    <span class={`risk r-${a.risk}`}>{c.riesgo[a.risk]}</span>
                  )}
                </div>
                {!locked && (
                  <div class="ctrl">
                    <button class="sk-btn" aria-label={c.reducir(a.label)} onClick={() => onChange(a.id, -ALLOCATION_STEP)}>
                      −
                    </button>
                    <span class="sk-pct">{pct}%</span>
                    <button class="sk-btn" aria-label={c.aumentar(a.label)} onClick={() => onChange(a.id, +ALLOCATION_STEP)}>
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
        <span class="lab">{c.total}</span>
        <span class={valid ? 'ok' : 'bad'}>
          {sum}%{valid ? ' ✓' : ''}
        </span>
      </div>

      <button class="sk-cta" disabled={!valid} onClick={onConfirm}>
        {c.confirmar}
      </button>
    </div>
  );
}
