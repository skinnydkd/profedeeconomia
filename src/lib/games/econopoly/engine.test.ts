import { describe, it, expect } from 'vitest';
import {
  createInitialState, rollDice, move, computeRent, resolveCell, buyProperty,
  startAuction, auctionBid, auctionPass, upgradeRd, applyTax, advancePhase,
  endTurn, netWorth, giniIndex, checkVictory, applyNewsCard,
} from './engine';
import { CELLS, sectorCellIds } from './board';
import {
  INITIAL_CASH, RD_MULTIPLIERS, MONOPOLY_BONUS, CYCLE_RENT, PASS_START_BONUS,
  AUCTION_MIN_INCREMENT, TOTAL_ROUNDS, PUBLIC_FUND_SHARE_PCT,
  RD_UPGRADE_COST_PCT, CB_INITIAL_RATE, CB_RATE_RANGE, CYCLE_PROPERTY,
} from './constants';
import { NEWS_CARDS } from './events';

const PLAYERS = [
  { name: 'Lara',  color: '#1F6E6E', isHuman: true },
  { name: 'Marc',  color: '#C44E2C', isHuman: false },
];
const seq = (vals: number[]) => { let i = 0; return () => vals[i++ % vals.length]; };

describe('econopoly engine', () => {
  it('initial state: cash, positions, phase, cycle', () => {
    const s = createInitialState(PLAYERS);
    expect(s.players.length).toBe(2);
    for (const p of s.players) { expect(p.cash).toBe(INITIAL_CASH); expect(p.position).toBe(0); expect(p.alive).toBe(true); }
    expect(s.round).toBe(1);
    expect(s.phase).toBe('roll');
    expect(s.cycle).toBe('expansion');
    expect(s.winner).toBeNull();
    expect(s.cbRate).toBe(CB_INITIAL_RATE);
    expect(s.publicFund).toBe(0);
  });

  it('rollDice produces 1..6 for each die deterministically with rng', () => {
    const r = rollDice(seq([0.0, 0.99]));
    expect(r.d1).toBe(1); expect(r.d2).toBe(6);
  });

  it('rollDice produces values in 1..6 range', () => {
    const r = rollDice(seq([0.5, 0.5]));
    expect(r.d1).toBeGreaterThanOrEqual(1);
    expect(r.d1).toBeLessThanOrEqual(6);
    expect(r.d2).toBeGreaterThanOrEqual(1);
    expect(r.d2).toBeLessThanOrEqual(6);
  });

  it('move wraps around 28 cells and grants PASS_START_BONUS when crossing 0', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].position = 25;
    const before = s.players[0].cash;
    const next = move(s, 5); // 25 + 5 = 30 → wraps to 2, crossed start
    expect(next.players[0].position).toBe(2);
    expect(next.players[0].cash).toBe(before + PASS_START_BONUS);
  });

  it('move with publicFund grants PASS_START_BONUS + floor(publicFund * 10%)', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].position = 25;
    s.publicFund = 100;
    const before = s.players[0].cash;
    const next = move(s, 5);
    const share = Math.floor(100 * PUBLIC_FUND_SHARE_PCT);
    expect(next.players[0].cash).toBe(before + PASS_START_BONUS + share);
    expect(next.publicFund).toBe(100 - share);
  });

  it('move without wrap does NOT grant PASS_START_BONUS', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].position = 0;
    const before = s.players[0].cash;
    const next = move(s, 3); // 0 + 3 = 3, no wrap
    expect(next.players[0].position).toBe(3);
    expect(next.players[0].cash).toBe(before); // no bonus
  });

  it('move landing exactly on SALIDA also grants PASS_START_BONUS', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].position = 25;
    const before = s.players[0].cash;
    const next = move(s, 3); // 25 + 3 = 28 → wraps to 0
    expect(next.players[0].position).toBe(0);
    expect(next.players[0].cash).toBe(before + PASS_START_BONUS);
  });

  it('computeRent applies R+D × cycle × monopoly bonus', () => {
    const s = createInitialState(PLAYERS);
    // give player 1 both properties of sector A → monopoly
    const sectorA = sectorCellIds('A');
    for (const cid of sectorA) s.properties[cid] = { cellId: cid, owner: 1, rdLevel: 1 };
    s.cycle = 'expansion';
    const rent = computeRent(s, sectorA[0]);
    const base = CELLS[sectorA[0]].property!.baseRent;
    const expected = Math.round(base * RD_MULTIPLIERS[1] * CYCLE_RENT.expansion * MONOPOLY_BONUS);
    expect(rent).toBe(expected);
  });

  it('computeRent without monopoly: no bonus', () => {
    const s = createInitialState(PLAYERS);
    const sectorA = sectorCellIds('A');
    // player 0 owns only one cell of sector A
    s.properties[sectorA[0]] = { cellId: sectorA[0], owner: 0, rdLevel: 0 };
    // player 1 owns the other
    s.properties[sectorA[1]] = { cellId: sectorA[1], owner: 1, rdLevel: 0 };
    s.cycle = 'expansion';
    const rent = computeRent(s, sectorA[0]);
    const base = CELLS[sectorA[0]].property!.baseRent;
    const expected = Math.round(base * RD_MULTIPLIERS[0] * CYCLE_RENT.expansion);
    expect(rent).toBe(expected);
  });

  it('computeRent in recession is lower than expansion', () => {
    const s = createInitialState(PLAYERS);
    const sectorA = sectorCellIds('A');
    s.properties[sectorA[0]] = { cellId: sectorA[0], owner: 0, rdLevel: 0 };
    const rentExp = computeRent({ ...s, cycle: 'expansion' }, sectorA[0]);
    const rentRec = computeRent({ ...s, cycle: 'recession' }, sectorA[0]);
    expect(rentExp).toBeGreaterThan(rentRec);
  });

  it('buyProperty transfers cash and ownership', () => {
    const s = createInitialState(PLAYERS); s.phase = 'resolve';
    const cellId = sectorCellIds('A')[0];
    s.players[0].position = cellId;
    s.pendingPurchase = cellId;
    const before = s.players[0].cash;
    const next = buyProperty(s, cellId);
    expect(next.properties[cellId].owner).toBe(0);
    expect(next.players[0].cash).toBe(before - CELLS[cellId].property!.basePrice);
    expect(next.pendingPurchase).toBeNull();
  });

  it('startAuction + bid + pass: highest bid wins', () => {
    const s = createInitialState(PLAYERS); s.phase = 'resolve';
    const cellId = sectorCellIds('A')[0];
    s.players[0].position = cellId;
    let s2 = startAuction(s, cellId);
    expect(s2.activeAuction).not.toBeNull();
    // Force player 0 as current bidder
    s2.activeAuction!.currentBidder = 0;
    s2 = auctionBid(s2, CELLS[cellId].property!.basePrice + AUCTION_MIN_INCREMENT);
    // Player 1 passes
    s2.activeAuction!.currentBidder = 1;
    s2 = auctionPass(s2);
    expect(s2.activeAuction).toBeNull();
    expect(s2.properties[cellId].owner).toBe(0); // bidder won
  });

  it('auctionPass with no bids: property stays unowned', () => {
    const s = createInitialState(PLAYERS); s.phase = 'resolve';
    const cellId = sectorCellIds('B')[0];
    s.players[0].position = cellId;
    let s2 = startAuction(s, cellId);
    // Both players pass without bidding
    s2.activeAuction!.currentBidder = 0;
    s2 = auctionPass(s2);
    if (s2.activeAuction !== null) {
      s2.activeAuction!.currentBidder = 1;
      s2 = auctionPass(s2);
    }
    expect(s2.activeAuction).toBeNull();
    expect(s2.properties[cellId].owner).toBeNull(); // no winner
  });

  it('upgradeRd costs RD_UPGRADE_COST_PCT of base price and advances level', () => {
    const s = createInitialState(PLAYERS); s.phase = 'action';
    const cellId = sectorCellIds('A')[0];
    s.properties[cellId] = { cellId, owner: 0, rdLevel: 0 };
    const cost = CELLS[cellId].property!.basePrice * RD_UPGRADE_COST_PCT;
    const cashBefore = s.players[0].cash;
    const next = upgradeRd(s, cellId);
    expect(next.properties[cellId].rdLevel).toBe(1);
    expect(next.players[0].cash).toBe(cashBefore - cost);
  });

  it('upgradeRd capped at level 3', () => {
    const s = createInitialState(PLAYERS); s.phase = 'action';
    const cellId = sectorCellIds('A')[0];
    s.properties[cellId] = { cellId, owner: 0, rdLevel: 3 };
    const cashBefore = s.players[0].cash;
    const next = upgradeRd(s, cellId);
    expect(next.properties[cellId].rdLevel).toBe(3);
    expect(next.players[0].cash).toBe(cashBefore);
  });

  it('upgradeRd only works for owner', () => {
    const s = createInitialState(PLAYERS); s.phase = 'action';
    const cellId = sectorCellIds('A')[0];
    s.properties[cellId] = { cellId, owner: 1, rdLevel: 0 }; // player 1 owns
    const cashBefore = s.players[0].cash;
    const next = upgradeRd(s, cellId);
    expect(next.properties[cellId].rdLevel).toBe(0);
    expect(next.players[0].cash).toBe(cashBefore);
  });

  it('applyTax: progressive 5/10/15% on net worth, added to publicFund', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].cash = 400; // <500 → 5%
    const before = s.publicFund;
    const next = applyTax({ ...s, current: 0 });
    expect(next.publicFund).toBe(before + 20);   // 400 * 5%
    expect(next.players[0].cash).toBe(400 - 20);
  });

  it('applyTax: 500-1000 range → 10%', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].cash = 800; // 500-1000 → 10%
    const next = applyTax({ ...s, current: 0 });
    expect(next.publicFund).toBe(80);  // 800 * 10%
    expect(next.players[0].cash).toBe(800 - 80);
  });

  it('applyTax: >1000 → 15%', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].cash = 1500;
    const next = applyTax({ ...s, current: 0 });
    expect(next.publicFund).toBe(225);  // 1500 * 15%
    expect(next.players[0].cash).toBe(1500 - 225);
  });

  it('giniIndex is 0 when all players have equal net worth', () => {
    const s = createInitialState(PLAYERS);
    expect(giniIndex(s)).toBeCloseTo(0, 2);
  });

  it('giniIndex >0 when players have different net worth', () => {
    const s = createInitialState(PLAYERS);
    s.players[0].cash = 3000;
    s.players[1].cash = 100;
    expect(giniIndex(s)).toBeGreaterThan(0);
    expect(giniIndex(s)).toBeLessThanOrEqual(1);
  });

  it('checkVictory: at round > TOTAL_ROUNDS, highest net worth wins', () => {
    const s = createInitialState(PLAYERS);
    s.round = TOTAL_ROUNDS + 1;
    s.players[0].cash = 5000; s.players[1].cash = 1000;
    expect(checkVictory(s)).toBe(0);
  });

  it('checkVictory: before TOTAL_ROUNDS, returns null', () => {
    const s = createInitialState(PLAYERS);
    s.round = TOTAL_ROUNDS;
    expect(checkVictory(s)).toBeNull();
  });

  it('endTurn advances current to next alive player; round++ on wrap', () => {
    const s = createInitialState(PLAYERS);
    s.phase = 'action';
    const next = endTurn(s);
    expect(next.current).toBe(1);
    const next2 = endTurn(next);
    expect(next2.current).toBe(0);
    expect(next2.round).toBe(2);
  });

  it('cycle alternates expansion/recession every CYCLE_LENGTH rounds', () => {
    let s = createInitialState(PLAYERS);
    for (let r = 1; r <= 6; r++) {
      s.round = r;
      // simulate a full round wrap by calling endTurn twice
      s.current = s.players.length - 1; s.phase = 'action';
      s = endTurn(s);
    }
    // after round 5 → should flip to recession
    expect(s.cycle).toBe('recession');
  });

  it('resolveCell on tax cell calls applyTax', () => {
    const s = createInitialState(PLAYERS);
    const taxCell = CELLS.find((c) => c.kind === 'tax')!;
    s.players[0].position = taxCell.id;
    s.phase = 'resolve';
    s.players[0].cash = 400;
    const fundBefore = s.publicFund;
    const next = resolveCell(s);
    expect(next.publicFund).toBeGreaterThan(fundBefore);
  });

  it('resolveCell on property with no owner sets pendingPurchase', () => {
    const s = createInitialState(PLAYERS);
    const propCell = CELLS.find((c) => c.kind === 'property')!;
    s.players[0].position = propCell.id;
    s.phase = 'resolve';
    const next = resolveCell(s);
    expect(next.pendingPurchase).toBe(propCell.id);
  });

  it('resolveCell on property owned by another player pays rent', () => {
    const s = createInitialState(PLAYERS);
    const sectorA = sectorCellIds('A');
    const cellId = sectorA[0];
    s.properties[cellId] = { cellId, owner: 1, rdLevel: 0 };
    s.players[0].position = cellId;
    s.phase = 'resolve';
    const cashBefore0 = s.players[0].cash;
    const cashBefore1 = s.players[1].cash;
    const next = resolveCell(s);
    const rent = computeRent(s, cellId);
    expect(next.players[0].cash).toBe(cashBefore0 - rent);
    expect(next.players[1].cash).toBe(cashBefore1 + rent);
  });

  it('resolveCell on own property: no effect', () => {
    const s = createInitialState(PLAYERS);
    const sectorA = sectorCellIds('A');
    const cellId = sectorA[0];
    s.properties[cellId] = { cellId, owner: 0, rdLevel: 0 };
    s.players[0].position = cellId;
    s.phase = 'resolve';
    const cashBefore = s.players[0].cash;
    const next = resolveCell(s);
    expect(next.players[0].cash).toBe(cashBefore);
    expect(next.pendingPurchase).toBeNull();
  });

  it('resolveCell on CB cell bumps cbRate and clamps to range', () => {
    const s = createInitialState(PLAYERS);
    const cbCell = CELLS.find((c) => c.kind === 'cb')!;
    s.players[0].position = cbCell.id;
    s.phase = 'resolve';
    const rngUp = seq([0.9]); // >0.5 → +1
    const next = resolveCell(s, rngUp);
    expect(next.cbRate).toBe(CB_INITIAL_RATE + 1);
  });

  it('resolveCell on news cell sets lastEvent', () => {
    const s = createInitialState(PLAYERS);
    const newsCell = CELLS.find((c) => c.kind === 'news')!;
    s.players[0].position = newsCell.id;
    s.phase = 'resolve';
    const next = resolveCell(s, seq([0.0]));
    expect(next.lastEvent).not.toBeNull();
  });

  it('applyNewsCard bonusCash (no sector) gives cash to current player', () => {
    const s = createInitialState(PLAYERS);
    s.current = 0;
    const idx = NEWS_CARDS.findIndex((c) => c.id === 'inheritance');
    const rng = seq([idx / NEWS_CARDS.length]);
    const cashBefore = s.players[0].cash;
    const next = applyNewsCard(s, rng);
    expect(next.players[0].cash).toBeGreaterThan(cashBefore);
  });

  it('applyNewsCard rateChange -1 decrements cbRate', () => {
    const s = createInitialState(PLAYERS);
    s.current = 0;
    s.cbRate = 5;
    const idx = NEWS_CARDS.findIndex((c) => c.id === 'rate_down');
    const rng = seq([idx / NEWS_CARDS.length]);
    const next = applyNewsCard(s, rng);
    expect(next.cbRate).toBe(4);
  });

  it('applyNewsCard rateChange clamps to CB_RATE_RANGE min', () => {
    const s = createInitialState(PLAYERS);
    s.cbRate = CB_RATE_RANGE[0]; // already at minimum
    const idx = NEWS_CARDS.findIndex((c) => c.id === 'rate_down');
    const rng = seq([idx / NEWS_CARDS.length]);
    const next = applyNewsCard(s, rng);
    expect(next.cbRate).toBe(CB_RATE_RANGE[0]); // clamped
  });

  it('netWorth includes cash + property values', () => {
    const s = createInitialState(PLAYERS);
    const sectorA = sectorCellIds('A');
    const cellId = sectorA[0];
    s.properties[cellId] = { cellId, owner: 0, rdLevel: 0 };
    const expectedPropertyValue = CELLS[cellId].property!.basePrice * RD_MULTIPLIERS[0] * CYCLE_PROPERTY[s.cycle];
    const nw = netWorth(s, 0);
    expect(nw).toBeCloseTo(INITIAL_CASH + expectedPropertyValue, 0);
  });

  it('advancePhase: roll → resolve → action', () => {
    const s = createInitialState(PLAYERS);
    expect(s.phase).toBe('roll');
    // Move player to position 0 (start), advancePhase from roll → rolls dice and moves → resolve
    const s1 = advancePhase(s, seq([0.5, 0.5]));
    expect(s1.phase).toBe('resolve');
    // advance from resolve → action
    s1.players[0].position = 0; // put player on start to avoid complex effects
    const s2 = advancePhase(s1, seq([0.5]));
    expect(s2.phase).toBe('action');
  });
});
