/** @jsxImportSource preact */
// SidePanel — phase bar + player card + hand + econ strip + action area.
// Props are passed from EconopolyGame; all action callbacks are void→void.

import type { GameState } from '@/lib/games/econopoly/types';
import { netWorth, giniIndex } from '@/lib/games/econopoly/engine';
import { RD_MULTIPLIERS } from '@/lib/games/econopoly/constants';
import type { RdLevel } from '@/lib/games/econopoly/types';
import { useGameLocale } from '../locale-context';
import {
  localizeCells,
  localizeSectorLabel,
  localizeNewsCard,
} from '@/i18n/games/econopoly-ca';

interface Props {
  state: GameState;
  onRollDice: () => void;
  onBuyPending: () => void;
  onPassPending: () => void;
  onUpgradeRd: (cellId: number) => void;
  onEndTurn: () => void;
}

// Map phase string to step index
function phaseIndex(phase: string): number {
  if (phase === 'roll') return 0;
  if (phase === 'resolve') return 1;
  return 2;
}

export const COPY = {
  es: {
    phases: ['Tirar', 'Resolver', 'Acción'],
    aiTurn: 'Turno de la IA',
    aiPlaying: (name: string) => `${name} está jugando...`,
    auctionLab: 'Subasta en curso',
    auctionTxt: 'Hay una subasta activa. Usa el panel emergente para pujar o pasar.',
    buyLab: 'Acción: Comprar o subastar',
    caido: 'Has caído en',
    caidoResto: (price: number) => `. Precio: ${price} €. Compra ahora o pasa a subasta.`,
    buy: (price: number) => `Comprar por ${price} €`,
    noFunds: 'Sin fondos suficientes',
    passAuction: 'Pasar (subastar)',
    rollLab: 'Acción: Tirar dados',
    rollTxt: 'Tira 2d6 para avanzar. Si caes en propiedad libre, podrás comprarla al precio base o pasar a subasta.',
    roll: 'Tirar 2d6',
    upgradeLab: 'Acción: Fase de mejora',
    upgradeTxt: 'Puedes mejorar R+D en tus propiedades (50% del precio base por nivel) o terminar el turno.',
    needCash: (cost: number) => `Necesitas ${cost} €`,
    rdBtn: (label: string, cost: number) => `R+D ${label} (${cost} €)`,
    endTurn: 'Terminar turno',
    roleHuman: 'En turno · Humano',
    roleAI: 'En turno · IA',
    cash: 'Efectivo',
    worth: 'Patrimonio',
    props: (n: number) => `Propiedades (${n})`,
    rdMult: (mult: string) => `R+D x${mult}`,
    cbRate: 'BC tipo',
    gini: 'Gini',
    publicFund: 'F. público',
    event: 'Evento',
  },
  ca: {
    phases: ['Tirar', 'Resoldre', 'Acció'],
    aiTurn: 'Torn de la IA',
    aiPlaying: (name: string) => `${name} està jugant...`,
    auctionLab: 'Subhasta en curs',
    auctionTxt: 'Hi ha una subhasta activa. Usa el panell emergent per a pujar o passar.',
    buyLab: 'Acció: Comprar o subhastar',
    caido: 'Has caigut en',
    caidoResto: (price: number) => `. Preu: ${price} €. Compra ara o passa a subhasta.`,
    buy: (price: number) => `Compra per ${price} €`,
    noFunds: 'Sense fons suficients',
    passAuction: 'Passa (subhasta)',
    rollLab: 'Acció: Tirar els daus',
    rollTxt: 'Tira 2d6 per a avançar. Si caus en una propietat lliure, podràs comprar-la al preu base o passar a subhasta.',
    roll: 'Tira 2d6',
    upgradeLab: 'Acció: Fase de millora',
    upgradeTxt: 'Pots millorar R+D en les teues propietats (50% del preu base per nivell) o acabar el torn.',
    needCash: (cost: number) => `Necessites ${cost} €`,
    rdBtn: (label: string, cost: number) => `R+D ${label} (${cost} €)`,
    endTurn: 'Acaba el torn',
    roleHuman: 'En torn · Humà',
    roleAI: 'En torn · IA',
    cash: 'Efectiu',
    worth: 'Patrimoni',
    props: (n: number) => `Propietats (${n})`,
    rdMult: (mult: string) => `R+D x${mult}`,
    cbRate: 'BC tipus',
    gini: 'Gini',
    publicFund: 'F. públic',
    event: 'Esdeveniment',
  },
};

export function SidePanel({
  state,
  onRollDice,
  onBuyPending,
  onPassPending,
  onUpgradeRd,
  onEndTurn,
}: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const cells = localizeCells(locale);
  const sectorLabel = localizeSectorLabel(locale);

  const currentPlayer = state.players[state.current];
  if (!currentPlayer) return null;

  const isHuman = currentPlayer.isHuman;
  const isAI = !isHuman;
  const currentPhaseIdx = phaseIndex(state.phase);

  // Net worth and Gini
  const nw = netWorth(state, state.current);
  const gini = giniIndex(state);

  // Current position label
  const posCell = cells[currentPlayer.position];
  const posLabel = posCell.property
    ? `${posCell.label} (${sectorLabel[posCell.property.sector]} · ${posCell.property.sector})`
    : posCell.label;

  // Properties owned by current player
  const ownedProps = Object.values(state.properties)
    .filter((ps) => ps.owner === state.current)
    .map((ps) => {
      const cell = cells[ps.cellId];
      return { cellId: ps.cellId, label: cell.label, sector: cell.property!.sector, rdLevel: ps.rdLevel };
    });

  // Pending purchase info
  const pendingCell = state.pendingPurchase !== null ? cells[state.pendingPurchase] : null;
  const pendingPrice = pendingCell?.property?.basePrice ?? 0;

  // R+D upgrade candidates (action phase, owned, rdLevel < 3, can afford)
  const upgradeable = Object.values(state.properties)
    .filter((ps) => ps.owner === state.current && ps.rdLevel < 3)
    .map((ps) => {
      const cell = cells[ps.cellId];
      const cost = cell.property ? Math.round(cell.property.basePrice * 0.5) : 0;
      const canAfford = currentPlayer.cash >= cost;
      return { cellId: ps.cellId, label: cell.label, cost, canAfford };
    });

  // Action area content
  function renderAction() {
    if (isAI) {
      return (
        <div class="ep2-action">
          <div class="lab">{c.aiTurn}</div>
          <div class="ep2-ai-thinking">
            <span class="ep2-ai-dot" />
            {c.aiPlaying(currentPlayer.name)}
          </div>
        </div>
      );
    }

    // Auction takes priority
    if (state.activeAuction !== null) {
      return (
        <div class="ep2-action">
          <div class="lab">{c.auctionLab}</div>
          <div class="txt">{c.auctionTxt}</div>
        </div>
      );
    }

    // Pending purchase
    if (state.pendingPurchase !== null && pendingCell) {
      return (
        <div class="ep2-action">
          <div class="lab">{c.buyLab}</div>
          <div class="txt">
            {c.caido} <strong>{pendingCell.label}</strong>{c.caidoResto(pendingPrice)}
          </div>
          <div class="ep2-btns">
            <button
              class="primary"
              onClick={onBuyPending}
              disabled={currentPlayer.cash < pendingPrice}
              title={currentPlayer.cash < pendingPrice ? c.noFunds : undefined}
            >
              {c.buy(pendingPrice)}
            </button>
            <button class="ghost" onClick={onPassPending}>
              {c.passAuction}
            </button>
          </div>
        </div>
      );
    }

    if (state.phase === 'roll') {
      return (
        <div class="ep2-action">
          <div class="lab">{c.rollLab}</div>
          <div class="txt">{c.rollTxt}</div>
          <div class="ep2-btns">
            <button class="primary" onClick={onRollDice}>
              {c.roll}
              {state.lastRoll
                ? ` (${state.lastRoll.d1}+${state.lastRoll.d2})`
                : ''}
            </button>
          </div>
        </div>
      );
    }

    // action phase
    return (
      <div class="ep2-action">
        <div class="lab">{c.upgradeLab}</div>
        <div class="txt">{c.upgradeTxt}</div>
        {upgradeable.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {upgradeable.map((u) => (
              <div key={u.cellId} class="ep2-btns" style={{ marginTop: 0 }}>
                <button
                  class="ghost"
                  onClick={() => onUpgradeRd(u.cellId)}
                  disabled={!u.canAfford}
                  title={!u.canAfford ? c.needCash(u.cost) : undefined}
                  style={{ fontSize: '11px', flex: 'none', width: '100%' }}
                >
                  {c.rdBtn(u.label, u.cost)}
                </button>
              </div>
            ))}
          </div>
        )}
        <div class="ep2-btns" style={{ marginTop: upgradeable.length > 0 ? '8px' : '12px' }}>
          <button class="primary" onClick={onEndTurn}>
            {c.endTurn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside class="ep2-panel">
      {/* Phase bar */}
      <div class="ep2-phases">
        {c.phases.map((label, i) => {
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
          {isHuman ? c.roleHuman : c.roleAI}
        </div>
        <div class="pname" style={{ color: currentPlayer.color }}>
          {currentPlayer.name}
        </div>
        <div class="pos">{posLabel}</div>
        <div class="ep2-money">
          <div>
            <div class="lab">{c.cash}</div>
            <div class="v">{currentPlayer.cash} €</div>
          </div>
          <div>
            <div class="lab">{c.worth}</div>
            <div class="v">{Math.round(nw)} €</div>
          </div>
        </div>
      </div>

      {/* Properties hand */}
      {ownedProps.length > 0 && (
        <div class="ep2-hand">
          <h4>{c.props(ownedProps.length)}</h4>
          <div class="ep2-hand-grid">
            {ownedProps.map((p) => (
              <div key={p.cellId} class={`ep2-prop sec-${p.sector}`}>
                <div class="pn">{p.label}</div>
                <span class="rd">
                  {c.rdMult(RD_MULTIPLIERS[p.rdLevel as RdLevel].toFixed(1))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Econ stats strip */}
      <div class="ep2-econ">
        <div>
          <div class="lab">{c.cbRate}</div>
          <div class="v">{state.cbRate}%</div>
        </div>
        <div>
          <div class="lab">{c.gini}</div>
          <div class="v">{gini.toFixed(2)}</div>
        </div>
        <div>
          <div class="lab">{c.publicFund}</div>
          <div class="v">{state.publicFund} €</div>
        </div>
      </div>

      {/* Action area */}
      {renderAction()}

      {/* Last event ticker */}
      {state.lastEvent && (
        <div class="ep2-ticker">
          <span class="l">{c.event}</span>
          <span class="t">{localizeNewsCard(state.lastEvent, locale)}</span>
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
