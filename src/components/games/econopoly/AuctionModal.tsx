/** @jsxImportSource preact */
// AuctionModal — overlay shown when state.activeAuction !== null.
// Displays property info, current highest bid, bidder queue.
// Only renders bid/pass buttons when currentBidder is a human player.
// When the AI is the current bidder, shows a waiting message instead.

import type { GameState } from '@/lib/games/econopoly/types';
import { AUCTION_MIN_INCREMENT } from '@/lib/games/econopoly/constants';
import { useGameLocale } from '../locale-context';
import { localizeCells } from '@/i18n/games/econopoly-ca';

// Chip background color by sector (mirrors CSS chip classes)
const CHIP_BG: Record<string, string> = {
  A: '#1F6E6E', B: '#1F6E6E',
  C: '#A87A2A', D: '#A87A2A',
  E: '#C44E2C', F: '#C44E2C',
  G: '#2E5E3A', H: '#2E5E3A',
};

interface Props {
  state: GameState;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export const COPY = {
  es: {
    eyebrow: 'Subasta en curso',
    sector: (s: string) => `Sector ${s}`,
    basePrice: 'Precio base',
    highest: 'Puja más alta',
    nextMin: 'Siguiente puja mínima',
    turn: 'Turno de:',
    passed: 'Han pasado:',
    bid: (amount: number) => `Pujar ${amount} €`,
    noFunds: 'Sin fondos suficientes',
    pass: 'Pasar',
    waiting: (name: string) => `Esperando a ${name} (IA)...`,
  },
  ca: {
    eyebrow: 'Subhasta en curs',
    sector: (s: string) => `Sector ${s}`,
    basePrice: 'Preu base',
    highest: 'Puja més alta',
    nextMin: 'Pròxima puja mínima',
    turn: 'Torn de:',
    passed: 'Han passat:',
    bid: (amount: number) => `Puja ${amount} €`,
    noFunds: 'Sense fons suficients',
    pass: 'Passa',
    waiting: (name: string) => `Esperant ${name} (IA)...`,
  },
};

export function AuctionModal({ state, onBid, onPass }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const cells = localizeCells(locale);
  const auction = state.activeAuction;
  if (!auction) return null;

  const cell = cells[auction.cellId];
  const property = cell.property;
  if (!property) return null;

  const nextBid = auction.highestBid + AUCTION_MIN_INCREMENT;
  const currentBidderPlayer = state.players[auction.currentBidder];
  const highestBidderName = auction.highestBidder !== null
    ? state.players[auction.highestBidder]?.name ?? '?'
    : null;

  const isHumanTurn = currentBidderPlayer?.isHuman === true;
  const canAffordBid = currentBidderPlayer
    ? nextBid <= currentBidderPlayer.cash
    : false;

  return (
    <div class="ep2-modal-backdrop">
      <div class="ep2-modal">
        {/* Header */}
        <div class="ep2-modal-eyebrow">{c.eyebrow}</div>
        <h2 class="ep2-modal-title">{property.label}</h2>
        <span
          class="ep2-modal-sector"
          style={{ background: CHIP_BG[property.sector] ?? '#8A7868' }}
        >
          {c.sector(property.sector)}
        </span>

        {/* Bid info rows */}
        <div style={{ marginTop: '18px' }}>
          <div class="ep2-auction-row">
            <span>{c.basePrice}</span>
            <span class="v">{property.basePrice} €</span>
          </div>
          <div class="ep2-auction-row">
            <span>{c.highest}</span>
            <span class="v">
              {auction.highestBidder !== null
                ? `${auction.highestBid} € — ${highestBidderName}`
                : '—'}
            </span>
          </div>
          <div class="ep2-auction-row" style={{ borderBottom: 'none' }}>
            <span>{c.nextMin}</span>
            <span class="v">{nextBid} €</span>
          </div>
        </div>

        {/* Current bidder */}
        <div class="ep2-auction-bidder">
          {c.turn} <strong style={{ color: currentBidderPlayer?.color ?? '#2A1F18' }}>
            {currentBidderPlayer?.name ?? '?'}
          </strong>
          {!isHumanTurn && ' (IA)'}
        </div>

        {/* Passed players */}
        {auction.passed.length > 0 && (
          <div class="ep2-passed-list">
            {c.passed}{' '}
            {auction.passed.map((pid) => (
              <span key={pid} class="badge">
                {state.players[pid]?.name ?? `J${pid}`}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons — only when a human is the current bidder */}
        {isHumanTurn ? (
          <div class="ep2-btns" style={{ marginTop: '16px' }}>
            <button
              class="primary"
              onClick={() => onBid(nextBid)}
              disabled={!canAffordBid}
              title={!canAffordBid ? c.noFunds : undefined}
            >
              {c.bid(nextBid)}
            </button>
            <button class="ghost" onClick={onPass}>
              {c.pass}
            </button>
          </div>
        ) : (
          <div class="ep2-auction-waiting">
            {c.waiting(currentBidderPlayer?.name ?? '?')}
          </div>
        )}
      </div>
    </div>
  );
}
