/** @jsxImportSource preact */
// SidePanel — phase bar + player card + hand + econ strip + action area.
// Props are passed from EconopolyGame; all action callbacks are void→void.

import type { GameState } from '@/lib/games/econopoly/types';
import { CELLS, SECTOR_LABEL } from '@/lib/games/econopoly/board';
import { netWorth, giniIndex } from '@/lib/games/econopoly/engine';
import { RD_MULTIPLIERS } from '@/lib/games/econopoly/constants';
import type { RdLevel } from '@/lib/games/econopoly/types';

interface Props {
  state: GameState;
  onRollDice: () => void;
  onBuyPending: () => void;
  onPassPending: () => void;
  onUpgradeRd: (cellId: number) => void;
  onEndTurn: () => void;
}

// Phase bar step labels
const PHASE_LABELS = ['Tirar', 'Resolver', 'Accion'];

// Map phase string to step index
function phaseIndex(phase: string): number {
  if (phase === 'roll') return 0;
  if (phase === 'resolve') return 1;
  return 2;
}

export function SidePanel({
  state,
  onRollDice,
  onBuyPending,
  onPassPending,
  onUpgradeRd,
  onEndTurn,
}: Props) {
  const currentPlayer = state.players[state.current];
  if (!currentPlayer) return null;

  const isHuman = currentPlayer.isHuman;
  const isAI = !isHuman;
  const currentPhaseIdx = phaseIndex(state.phase);

  // Net worth and Gini
  const nw = netWorth(state, state.current);
  const gini = giniIndex(state);

  // Current position label
  const posCell = CELLS[currentPlayer.position];
  const posLabel = posCell.property
    ? `${posCell.label} (${SECTOR_LABEL[posCell.property.sector]} · ${posCell.property.sector})`
    : posCell.label;

  // Properties owned by current player
  const ownedProps = Object.values(state.properties)
    .filter((ps) => ps.owner === state.current)
    .map((ps) => {
      const cell = CELLS[ps.cellId];
      return { cellId: ps.cellId, label: cell.label, sector: cell.property!.sector, rdLevel: ps.rdLevel };
    });

  // Pending purchase info
  const pendingCell = state.pendingPurchase !== null ? CELLS[state.pendingPurchase] : null;
  const pendingPrice = pendingCell?.property?.basePrice ?? 0;

  // R+D upgrade candidates (action phase, owned, rdLevel < 3, can afford)
  const upgradeable = Object.values(state.properties)
    .filter((ps) => ps.owner === state.current && ps.rdLevel < 3)
    .map((ps) => {
      const cell = CELLS[ps.cellId];
      const cost = cell.property ? Math.round(cell.property.basePrice * 0.5) : 0;
      const canAfford = currentPlayer.cash >= cost;
      return { cellId: ps.cellId, label: cell.label, cost, canAfford };
    });

  // Action area content
  function renderAction() {
    if (isAI) {
      return (
        <div class="ep2-action">
          <div class="lab">Turno de la IA</div>
          <div class="ep2-ai-thinking">
            <span class="ep2-ai-dot" />
            {currentPlayer.name} esta jugando...
          </div>
        </div>
      );
    }

    // Auction takes priority
    if (state.activeAuction !== null) {
      return (
        <div class="ep2-action">
          <div class="lab">Subasta en curso</div>
          <div class="txt">
            Hay una subasta activa. Usa el panel emergente para pujar o pasar.
          </div>
        </div>
      );
    }

    // Pending purchase
    if (state.pendingPurchase !== null && pendingCell) {
      return (
        <div class="ep2-action">
          <div class="lab">Accion: Comprar o subastar</div>
          <div class="txt">
            Has caido en <strong>{pendingCell.label}</strong>. Precio: {pendingPrice} €.
            Compra ahora o pasa a subasta.
          </div>
          <div class="ep2-btns">
            <button
              class="primary"
              onClick={onBuyPending}
              disabled={currentPlayer.cash < pendingPrice}
              title={currentPlayer.cash < pendingPrice ? 'Sin fondos suficientes' : undefined}
            >
              Comprar por {pendingPrice} €
            </button>
            <button class="ghost" onClick={onPassPending}>
              Pasar (subastar)
            </button>
          </div>
        </div>
      );
    }

    if (state.phase === 'roll') {
      return (
        <div class="ep2-action">
          <div class="lab">Accion: Tirar dados</div>
          <div class="txt">
            Tira 2d6 para avanzar. Si caes en propiedad libre, podras comprarla al precio base o pasar a subasta.
          </div>
          <div class="ep2-btns">
            <button class="primary" onClick={onRollDice}>
              Tirar 2d6
              {state.lastRoll
                ? ` (${state.lastRoll.d1}+${state.lastRoll.d2})`
                : ''}
            </button>
          </div>
        </div>
      );
    }

    if (state.phase === 'resolve') {
      return (
        <div class="ep2-action">
          <div class="lab">Resolviendo casilla</div>
          <div class="txt">
            {state.lastEvent
              ? state.lastEvent.text
              : `Estas en ${posLabel}.`}
          </div>
        </div>
      );
    }

    // action phase
    return (
      <div class="ep2-action">
        <div class="lab">Accion: Fase de mejora</div>
        <div class="txt">
          Puedes mejorar R+D en tus propiedades (50% del precio base por nivel) o terminar el turno.
        </div>
        {upgradeable.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {upgradeable.map((u) => (
              <div key={u.cellId} class="ep2-btns" style={{ marginTop: 0 }}>
                <button
                  class="ghost"
                  onClick={() => onUpgradeRd(u.cellId)}
                  disabled={!u.canAfford}
                  title={!u.canAfford ? `Necesitas ${u.cost} €` : undefined}
                  style={{ fontSize: '11px', flex: 'none', width: '100%' }}
                >
                  R+D {u.label} ({u.cost} €)
                </button>
              </div>
            ))}
          </div>
        )}
        <div class="ep2-btns" style={{ marginTop: upgradeable.length > 0 ? '8px' : '12px' }}>
          <button class="primary" onClick={onEndTurn}>
            Terminar turno
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside class="ep2-panel">
      {/* Phase bar */}
      <div class="ep2-phases">
        {PHASE_LABELS.map((label, i) => {
          let cls = 'ep2-phase';
          if (i < currentPhaseIdx) cls += ' done';
          else if (i === currentPhaseIdx) cls += ' on';
          return (
            <div key={label} class={cls}>
              <span class="n">{i + 1}</span>{label}
            </div>
          );
        })}
      </div>

      {/* Player card */}
      <div
        class="ep2-pcard"
        style={{ borderTopColor: currentPlayer.color }}
      >
        <div class="role">
          {isHuman ? 'En turno · Humano' : 'En turno · IA'}
        </div>
        <div class="pname" style={{ color: currentPlayer.color }}>
          {currentPlayer.name}
        </div>
        <div class="pos">{posLabel}</div>
        <div class="ep2-money">
          <div>
            <div class="lab">Efectivo</div>
            <div class="v">{currentPlayer.cash} €</div>
          </div>
          <div>
            <div class="lab">Patrimonio</div>
            <div class="v">{Math.round(nw)} €</div>
          </div>
        </div>
      </div>

      {/* Properties hand */}
      {ownedProps.length > 0 && (
        <div class="ep2-hand">
          <h4>Propiedades ({ownedProps.length})</h4>
          <div class="ep2-hand-grid">
            {ownedProps.map((p) => (
              <div key={p.cellId} class={`ep2-prop sec-${p.sector}`}>
                <div class="pn">{p.label}</div>
                <span class="rd">
                  R+D x{RD_MULTIPLIERS[p.rdLevel as RdLevel].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Econ stats strip */}
      <div class="ep2-econ">
        <div>
          <div class="lab">BC tipo</div>
          <div class="v">{state.cbRate}%</div>
        </div>
        <div>
          <div class="lab">Gini</div>
          <div class="v">{gini.toFixed(2)}</div>
        </div>
        <div>
          <div class="lab">F. publico</div>
          <div class="v">{state.publicFund} €</div>
        </div>
      </div>

      {/* Action area */}
      {renderAction()}

      {/* Last event ticker */}
      {state.lastEvent && (
        <div class="ep2-ticker">
          <span class="l">Evento</span>
          <span class="t">{state.lastEvent.text}</span>
        </div>
      )}

      {/* Recent log (last 5 entries) */}
      {state.log.length > 0 && (
        <div class="ep2-log">
          {state.log.slice(-5).map((entry, i) => (
            <div key={i} class="ep2-log-entry">{entry}</div>
          ))}
        </div>
      )}
    </aside>
  );
}
