/** @jsxImportSource preact */
import type { GameState, AssetGroup } from '@/lib/games/stonks/types';
import {
  availableAssets, allocationSum, isAllocationValid, netWorth, realNetWorth,
  currentYear, currentHalf, previewCost, TOTAL_ROUNDS,
} from '@/lib/games/stonks/engine';
import { ALLOCATION_STEP } from '@/lib/games/stonks/data';
import { useGameLocale } from '../locale-context';
import { localizeAsset } from '@/i18n/games/stonks-ca';

// Core allocation screen — the player distributes 100 % among the assets that
// exist this semester, grouped so a board of a dozen rows stays readable.

interface Props {
  state: GameState;
  onChange: (id: string, delta: number) => void;
  onOpenCard: (id: string) => void;
  onConfirm: () => void;
}

const GROUP_ORDER: AssetGroup[] = ['seguro', 'bolsa', 'empresa'];

export const COPY = {
  es: {
    semester: (h: number, y: number) => `${h === 0 ? '1.er' : '2.º'} semestre de ${y}`,
    round: (n: number, total: number) => `Semestre ${n} de ${total}`,
    patrimonio: 'Tu patrimonio',
    real: (y: number) => `en poder adquisitivo de ${y}`,
    groups: { seguro: 'Sin sobresaltos', bolsa: 'Bolsa', empresa: 'Empresas sueltas' },
    info: (label: string) => `Qué es ${label}`,
    reducir: (label: string) => `Reducir ${label} ${ALLOCATION_STEP} %`,
    aumentar: (label: string) => `Aumentar ${label} ${ALLOCATION_STEP} %`,
    total: 'Total repartido',
    cost: (com: string, tax: string) =>
      `Mover la cartera te costará ${com} € de comisiones y ${tax} € de impuestos.`,
    costFree: 'Dejarla como está no cuesta nada.',
    confirmar: 'Confirmar',
    riesgo: { baja: 'Riesgo bajo', media: 'Riesgo medio', alta: 'Riesgo alto', extrema: 'Riesgo extremo' },
  },
  ca: {
    semester: (h: number, y: number) => `${h === 0 ? '1r' : '2n'} semestre de ${y}`,
    round: (n: number, total: number) => `Semestre ${n} de ${total}`,
    patrimonio: 'El teu patrimoni',
    real: (y: number) => `en poder adquisitiu de ${y}`,
    groups: { seguro: 'Sense sobresalts', bolsa: 'Borsa', empresa: 'Empreses soltes' },
    info: (label: string) => `Què és ${label}`,
    reducir: (label: string) => `Reduir ${label} ${ALLOCATION_STEP} %`,
    aumentar: (label: string) => `Augmentar ${label} ${ALLOCATION_STEP} %`,
    total: 'Total repartit',
    cost: (com: string, tax: string) =>
      `Moure la cartera et costarà ${com} € de comissions i ${tax} € d’impostos.`,
    costFree: 'Deixar-la com està no costa res.',
    confirmar: 'Confirma',
    riesgo: { baja: 'Risc baix', media: 'Risc mitjà', alta: 'Risc alt', extrema: 'Risc extrem' },
  },
};

const euros = (n: number) => Math.round(n).toLocaleString('es-ES');

export function AllocateScreen({ state, onChange, onOpenCard, onConfirm }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const board = availableAssets(state);
  const sum = allocationSum(state);
  const valid = isAllocationValid(state);
  const { commission, tax } = previewCost(state);
  // Suppress the preview entirely at zero: the ABSENCE of a cost line is what
  // teaches that leaving a portfolio alone is free.
  const showsCost = commission + tax > 0.5;

  return (
    <div class="sk-phone">
      <div class="sk-top">
        <div>
          <div class="sk-year serif">{c.semester(currentHalf(state), currentYear(state))}</div>
          <div class="sk-round">{c.round(state.round + 1, TOTAL_ROUNDS)}</div>
        </div>
      </div>

      <div class="sk-wealth">
        <div class="l">{c.patrimonio}</div>
        <div class="v">{euros(netWorth(state))} €</div>
        <div class="r">
          {euros(realNetWorth(state))} € {c.real(state.startYear)}
        </div>
      </div>

      <div class="sk-assets">
        {GROUP_ORDER.map((group) => {
          const rows = board.filter((a) => a.group === group);
          if (rows.length === 0) return null;
          return (
            <section key={group}>
              <h3 class="sk-group">{c.groups[group]}</h3>
              {rows.map((raw) => {
                const a = localizeAsset(raw, locale);
                const pct = state.allocation[a.id] || 0;
                return (
                  <div class={`sk-asset risk-${a.risk}`} key={a.id}>
                    <div class="row1">
                      <div class="sk-asset-id">
                        <span class="nm">{a.label}</span>
                        <button
                          class="sk-info"
                          aria-label={c.info(a.label)}
                          onClick={() => onOpenCard(a.id)}
                        >
                          i
                        </button>
                        <span class="sk-asset-sub">
                          {a.profile ?? c.riesgo[a.risk]}
                        </span>
                      </div>
                      <div class="ctrl">
                        <button
                          class="sk-btn"
                          aria-label={c.reducir(a.label)}
                          onClick={() => onChange(a.id, -ALLOCATION_STEP)}
                        >
                          −
                        </button>
                        <span class="sk-pct">{pct}%</span>
                        <button
                          class="sk-btn"
                          aria-label={c.aumentar(a.label)}
                          onClick={() => onChange(a.id, +ALLOCATION_STEP)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div class="sk-bar">
                      <i style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <div class="sk-total">
        <span class="lab">{c.total}</span>
        <span class={valid ? 'ok' : 'bad'}>
          {sum}%{valid ? ' ✓' : ''}
        </span>
      </div>

      <p class="sk-costline">
        {showsCost ? c.cost(euros(commission), euros(tax)) : c.costFree}
      </p>

      <button class="sk-cta" disabled={!valid} onClick={onConfirm}>
        {c.confirmar}
      </button>
    </div>
  );
}
