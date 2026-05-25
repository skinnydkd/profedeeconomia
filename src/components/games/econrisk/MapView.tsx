/** @jsxImportSource preact */
// MapView — SVG node-graph map for Econrisk.
// Renders territory nodes filled with owner faction color + unit count.
// Adjacency lines drawn once per pair (higher id only).
// Click on a node calls onSelect(id). Highlights selectedId with a border ring.

import type { GameState } from '@/lib/games/econrisk/types';
import { TERRITORIES, byId } from '@/lib/games/econrisk/map';
import { factionMeta } from '@/lib/games/econrisk/factions';

// Continent background rect config: [continent, label, x, y, w, h]
const CONTINENT_REGIONS: Array<[string, number, number, number, number]> = [
  // label, x, y, w, h  (bounding box for the cluster)
  ['N. América',   20,  18, 150, 152],
  ['S. América',   20, 185, 150, 158],
  ['Europa',      195,  18, 175, 165],
  ['África',      195, 192, 135, 153],
  ['Asia',        378,  18, 205, 162],
  ['Oceanía',     428, 200, 160, 152],
];

interface Props {
  state: GameState;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ state, selectedId, onSelect }: Props) {
  return (
    <svg
      viewBox="0 0 600 360"
      width="100%"
      height="100%"
      class="er-map-svg"
      role="img"
      aria-label="Mapa de territorios de Econrisk"
    >
      {/* Continent background regions */}
      <g>
        {CONTINENT_REGIONS.map(([label, x, y, w, h]) => (
          <g key={label}>
            <rect
              x={x} y={y} width={w} height={h}
              rx={6}
              fill="none"
              stroke="#C9B79A"
              stroke-width="0.75"
              stroke-dasharray="4 3"
              opacity="0.5"
            />
            <text
              x={x + 6}
              y={y + 12}
              class="er-continent-label"
            >
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* Adjacency lines — draw each pair once (only when neighbour id > territory id) */}
      <g stroke="#C9B79A" stroke-width="1.5" opacity="0.7">
        {TERRITORIES.flatMap((t) =>
          t.adj
            .filter((n) => n > t.id)
            .map((n) => {
              const nb = byId[n];
              if (!nb) return null;
              return (
                <line
                  key={`${t.id}-${n}`}
                  x1={t.x} y1={t.y}
                  x2={nb.x} y2={nb.y}
                />
              );
            })
        )}
      </g>

      {/* Territory nodes */}
      <g
        font-family="JetBrains Mono, monospace"
        font-size="12"
        font-weight="700"
        text-anchor="middle"
      >
        {TERRITORIES.map((t) => {
          const cell = state.territories[t.id];
          if (!cell) return null;
          const meta = factionMeta[cell.owner];
          const col = meta?.color ?? '#8A7868';
          const isSelected = selectedId === t.id;
          return (
            <g
              key={t.id}
              class="er-node"
              onClick={() => onSelect(t.id)}
              style={{ cursor: 'pointer' }}
              aria-label={`${t.label}: ${cell.units} unidades (${meta?.label ?? cell.owner})`}
            >
              {/* Outer ring for selected state */}
              {isSelected && (
                <circle
                  cx={t.x} cy={t.y} r={21}
                  fill="none"
                  stroke="#2A1F18"
                  stroke-width="2.5"
                  opacity="0.75"
                />
              )}
              {/* Main node circle */}
              <circle
                cx={t.x} cy={t.y} r={16}
                fill={col}
              />
              {/* Unit count */}
              <text
                x={t.x}
                y={t.y + 5}
                fill="#fff"
                dominant-baseline="auto"
              >
                {cell.units}
              </text>
            </g>
          );
        })}
      </g>

      {/* Territory labels (below each node) */}
      <g>
        {TERRITORIES.map((t) => (
          <text
            key={`lbl-${t.id}`}
            x={t.x}
            y={t.y + 29}
            class="er-terr-label"
            pointer-events="none"
          >
            {t.label}
          </text>
        ))}
      </g>
    </svg>
  );
}
