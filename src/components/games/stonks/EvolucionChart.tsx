/** @jsxImportSource preact */
import type { Half } from '@/lib/games/stonks/types';
import { useGameLocale } from '../locale-context';

// Hand-written SVG line chart, no library. Three series:
//   player nominal → terracota solid   #C44E2C
//   player real    → terracota dashed  #C44E2C
//   benchmark      → muted solid       #8A7868
//
// The dashed terracota line is the point of the whole chart: the gap between it
// and the solid one is the part of the gain inflation took.

interface Point {
  year: number;
  half: Half;
  nominal: number;
  real: number;
  ai: number;
}

export const COPY = {
  es: { ariaLabel: 'Evolución del patrimonio en euros, en poder adquisitivo y frente al mercado' },
  ca: { ariaLabel: 'Evolució del patrimoni en euros, en poder adquisitiu i enfront del mercat' },
};

export function EvolucionChart({ history }: { history: Point[] }) {
  const c = COPY[useGameLocale()];
  if (history.length === 0) return null;

  const W = 600, H = 220, padL = 50, padR = 20, padT = 20, padB = 30;
  const max = Math.max(...history.flatMap((p) => [p.nominal, p.real, p.ai]), 1);
  const xs = (i: number) => padL + (i / (history.length - 1 || 1)) * (W - padL - padR);
  const ys = (v: number) => H - padB - (v / max) * (H - padT - padB);
  const line = (key: 'nominal' | 'real' | 'ai') =>
    history.map((p, i) => `${xs(i)},${ys(p[key])}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={c.ariaLabel}>
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#E5D4BD" strokeWidth="1" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#E5D4BD" strokeWidth="1" />

      <polyline fill="none" stroke="#8A7868" strokeWidth="2" points={line('ai')} />
      <polyline
        fill="none"
        stroke="#C44E2C"
        strokeWidth="2"
        strokeDasharray="4 3"
        points={line('real')}
      />
      <polyline fill="none" stroke="#C44E2C" strokeWidth="2.5" points={line('nominal')} />

      <text x={padL} y={H - 8} fontFamily="monospace" fontSize="9" fill="#8A7868">
        {history[0].year}
      </text>
      <text
        x={W - padR}
        y={H - 8}
        textAnchor="end"
        fontFamily="monospace"
        fontSize="9"
        fill="#8A7868"
      >
        {history[history.length - 1].year}
      </text>
    </svg>
  );
}
