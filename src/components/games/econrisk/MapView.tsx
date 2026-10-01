/** @jsxImportSource preact */
// MapView — SVG node-graph map for Econrisk.
// Renders territory nodes filled with owner faction color + unit count.
// Adjacency lines drawn once per pair (higher id only).
// Click on a node calls onSelect(id). Highlights selectedId with a border ring.
// Each node is also a keyboard button (Tab, then Enter/Space), and the map is a
// group so screen readers reach them; the drawing around them is aria-hidden.

import type { GameState } from '@/lib/games/econrisk/types';
import { byId } from '@/lib/games/econrisk/map';
import { useGameLocale } from '../locale-context';
import { localizeTerritories, localizeFactionMeta } from '@/i18n/games/econrisk-ca';

// Continent background rect config: [continent label, x, y, w, h]
// The ES label doubles as a stable key; the display text is resolved from COPY.
const CONTINENT_REGIONS: Array<[string, number, number, number, number]> = [
  // label, x, y, w, h  (bounding box for the cluster)
  ['N. América',   20,  18, 150, 152],
  ['S. América',   20, 185, 150, 158],
  ['Europa',      195,  18, 175, 165],
  ['África',      195, 192, 135, 153],
  ['Asia',        378,  18, 205, 162],
  ['Oceanía',     428, 200, 160, 152],
];

export const COPY = {
  es: {
    mapAria: 'Mapa de territorios de Econrisk',
    nodeAria: (label: string, units: number, faction: string) =>
      `${label}: ${units} unidades (${faction})`,
    continents: {
      'N. América': 'N. América',
      'S. América': 'S. América',
      'Europa': 'Europa',
      'África': 'África',
      'Asia': 'Asia',
      'Oceanía': 'Oceanía',
    } as Record<string, string>,
  },
  ca: {
    mapAria: "Mapa de territoris d'Econrisk",
    nodeAria: (label: string, units: number, faction: string) =>
      `${label}: ${units} unitats (${faction})`,
    continents: {
      'N. América': 'N. Amèrica',
      'S. América': 'S. Amèrica',
      'Europa': 'Europa',
      'África': 'Àfrica',
      'Asia': 'Àsia',
      'Oceanía': 'Oceania',
    } as Record<string, string>,
  },
};

interface Props {
  state: GameState;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MapView({ state, selectedId, onSelect }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const territories = localizeTerritories(locale);
  const fmeta = localizeFactionMeta(locale);

  return (
    <svg
      viewBox="0 0 600 360"
      width="100%"
      height="100%"
      class="er-map-svg"
      role="group"
      aria-label={c.mapAria}
    >
      {/* Continent background regions */}
      <g aria-hidden="true">
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
              {c.continents[label] ?? label}
            </text>
          </g>
        ))}
      </g>

      {/* Adjacency lines — draw each pair once (only when neighbour id > territory id) */}
      <g stroke="#C9B79A" stroke-width="1.5" opacity="0.7" aria-hidden="true">
        {territories.flatMap((t) =>
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
        {territories.map((t) => {
          const cell = state.territories[t.id];
          if (!cell) return null;
          const meta = fmeta[cell.owner];
          const col = meta?.color ?? '#8A7868';
          const isSelected = selectedId === t.id;
          return (
            <g
              key={t.id}
              class="er-node"
              onClick={() => onSelect(t.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); // Space would scroll the page
                  onSelect(t.id);
                }
              }}
              style={{ cursor: 'pointer' }}
              role="button"
              // Lowercase: SVG attributes are case-sensitive and Preact sets them verbatim.
              tabindex={0}
              aria-pressed={isSelected}
              aria-label={c.nodeAria(t.label, cell.units, meta?.label ?? cell.owner)}
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

      {/* Territory labels (below each node) — already in each node's aria-label */}
      <g aria-hidden="true">
        {territories.map((t) => (
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
