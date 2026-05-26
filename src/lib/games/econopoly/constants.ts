export const INITIAL_CASH = 1500;
export const PASS_START_BONUS = 200;
export const PUBLIC_FUND_SHARE_PCT = 0.10;          // 10% of fund split per pass
export const TOTAL_ROUNDS = 20;
export const RD_MULTIPLIERS = [1.0, 1.5, 2.0, 3.0] as const;
export const RD_UPGRADE_COST_PCT = 0.5;             // 50% of base price per level
export const MONOPOLY_BONUS = 2;                    // x2 rent if owns both in sector
export const TAX_BRACKETS = [
  { threshold: 500,  rate: 0.05 },
  { threshold: 1000, rate: 0.10 },
  { threshold: Infinity, rate: 0.15 },
] as const;
export const CYCLE_RENT = { expansion: 1.3, recession: 0.7 } as const;
export const CYCLE_PROPERTY = { expansion: 1.2, recession: 0.8 } as const;
export const CYCLE_LENGTH = 5;                       // alternate every 5 rounds
export const CB_INITIAL_RATE = 5;                    // %
export const CB_RATE_RANGE = [2, 12] as const;
export const AUCTION_MIN_INCREMENT = 10;
export const BOARD_SIZE = 28;
