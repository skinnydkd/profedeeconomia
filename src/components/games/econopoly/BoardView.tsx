/** @jsxImportSource preact */
// BoardView — 8×8 CSS-grid board for Econopoly.
//
// 28 cells in clockwise order from SALIDA (position 0):
//   Positions 0..7   → top row,    col 1..8, row 1
//   Positions 8..13  → right col,  col 8,    row 2..7
//   Positions 14..20 → bottom row, col 8..2 (right to left), row 8
//   Positions 21..27 → left col,   col 1,    row 7..2 (bottom to top)
//
// Inner 6×6 area (CSS grid lines col 2..8, row 2..8) is the cycle center.
// Tokens are colored discs (no letter) positioned bottom-left of the cell.

import type { GameState } from '@/lib/games/econopoly/types';
import { CELLS } from '@/lib/games/econopoly/board';

// ─── pos() ───────────────────────────────────────────────────────────────────
// Map cell id 0..27 to (gridColumn, gridRow) in an 8×8 CSS grid (1-indexed).
// The mapping produces a clockwise ring starting at top-left corner (id 0).
function pos(id: number): { col: number; row: number } {
  // Top row: ids 0-7 → row 1, cols 1-8
  if (id <= 7) return { row: 1, col: id + 1 };
  // Right col: ids 8-13 → col 8, rows 2-7
  if (id <= 13) return { row: id - 6, col: 8 };
  // Bottom row: ids 14-20 → row 8, cols 8-2 (right to left, clockwise)
  if (id <= 20) return { row: 8, col: 8 - (id - 14) };
  // Left col: ids 21-27 → col 1, rows 7-1 (bottom to top, clockwise)
  return { row: 8 - (id - 21), col: 1 };
}

// ─── cellClass() ─────────────────────────────────────────────────────────────
function cellClass(id: number): string {
  const c = CELLS[id];
  if (c.kind === 'property' && c.property) {
    return `ep2-cell sec-${c.property.sector}`;
  }
  if (id === 0 || id === 7 || id === 14 || id === 21) {
    return 'ep2-cell corner';
  }
  return 'ep2-cell special';
}

// ─── chipIndex() ─────────────────────────────────────────────────────────────
// Within a sector, the first occurrence in cell order gets chip suffix "1",
// the second gets "2". We pre-compute this from the board order.
function buildChipIndex(): Map<number, string> {
  const sectorCount: Record<string, number> = {};
  const index = new Map<number, string>();
  for (const c of CELLS) {
    if (c.kind === 'property' && c.property) {
      const s = c.property.sector;
      sectorCount[s] = (sectorCount[s] ?? 0) + 1;
      index.set(c.id, `${s}${sectorCount[s]}`);
    }
  }
  return index;
}

const CHIP_INDEX = buildChipIndex();

// ─── cornerSubtitle() ────────────────────────────────────────────────────────
function cornerSubtitle(id: number): string {
  if (id === 0) return '+200 €';
  if (id === 7) return '5/10/15 %';
  if (id === 14) return 'sin renta';
  if (id === 21) return 'Carta';
  return '';
}

// ─── specialSubtitle() ───────────────────────────────────────────────────────
function specialSubtitle(kind: string): string {
  if (kind === 'news') return 'Carta';
  if (kind === 'cb') return 'Tipos';
  if (kind === 'rd') return 'Mejorar';
  if (kind === 'tax') return '5/10/15 %';
  return '';
}

// ─── BoardView ───────────────────────────────────────────────────────────────

interface Props {
  state: GameState;
  onCellClick?: (id: number) => void;
}

export function BoardView({ state, onCellClick }: Props) {
  return (
    <div class="ep2-board">
      {/* Center cycle protagonist — spans inner 6×6 */}
      <div class="ep2-center" style={{ gridColumn: '2 / 8', gridRow: '2 / 8' }}>
        <div class="round-lab">
          Ronda {state.round} / 20
        </div>
        <div class={`pro serif-it${state.cycle === 'recession' ? ' rec' : ''}`}>
          {state.cycle === 'expansion' ? 'Expansión' : 'Recesión'}
        </div>
        <div class="subt">
          {state.cycle === 'expansion'
            ? 'Rentas +30%. Valor de las propiedades +20%.'
            : 'Rentas -30%. Valor de las propiedades -20%.'}
        </div>
      </div>

      {/* 28 ring cells */}
      {CELLS.map((c) => {
        const { col, row } = pos(c.id);
        const cls = cellClass(c.id);
        const tokens = state.players.filter(
          (pl) => pl.alive && pl.position === c.id,
        );

        return (
          <div
            key={c.id}
            class={cls}
            style={{ gridColumn: col, gridRow: row }}
            onClick={() => onCellClick?.(c.id)}
          >
            {c.kind === 'property' && c.property ? (
              <>
                <span class={`chip ${c.property.sector}`}>
                  {CHIP_INDEX.get(c.id) ?? c.property.sector}
                </span>
                <div class="nm">{c.property.label}</div>
                <div class="pr">{c.property.basePrice} €</div>
              </>
            ) : (c.id === 0 || c.id === 7 || c.id === 14 || c.id === 21) ? (
              // corners
              <>
                <div class="cl">{c.label}</div>
                {cornerSubtitle(c.id) && (
                  <div class="ci">{cornerSubtitle(c.id)}</div>
                )}
              </>
            ) : (
              // specials
              <>
                <div class="sl">{c.label}</div>
                {specialSubtitle(c.kind) && (
                  <div class="si">{specialSubtitle(c.kind)}</div>
                )}
              </>
            )}

            {/* Player tokens */}
            {tokens.map((t, i) => {
              const isActive = state.current === t.id;
              return (
                <span
                  key={t.id}
                  class={`tok2 t${i + 1}${isActive ? ' active' : ''}`}
                  style={{ background: t.color }}
                />
              );
            })}

            {/* R+D level indicator for owned properties */}
            {c.kind === 'property' && (() => {
              const ps = state.properties[c.id];
              if (!ps || ps.owner === null || ps.rdLevel === 0) return null;
              const owner = state.players[ps.owner];
              return (
                <span
                  class="ep2-rd-badge"
                  style={{ background: owner?.color ?? '#8A7868' }}
                >
                  {ps.rdLevel}
                </span>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}
