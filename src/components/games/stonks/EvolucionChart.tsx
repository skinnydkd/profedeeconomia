/** @jsxImportSource preact */

// Hand-written SVG line chart: player net worth vs AI benchmark over the game history.
// No external chart library. Player line → terracota #C44E2C; AI line → muted #8A7868 dashed.

interface Point {
  year: number;
  playerNet: number;
  aiNet: number;
}

export function EvolucionChart({ history }: { history: Point[] }) {
  if (history.length === 0) return null;

  const W = 600, H = 220, padL = 50, padR = 20, padT = 20, padB = 30;
  const max = Math.max(...history.flatMap((p) => [p.playerNet, p.aiNet]), 1);
  const xs = (i: number) =>
    padL + (i / (history.length - 1 || 1)) * (W - padL - padR);
  const ys = (v: number) => H - padB - (v / max) * (H - padT - padB);
  const line = (key: 'playerNet' | 'aiNet') =>
    history.map((p, i) => `${xs(i)},${ys(p[key])}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label="Evolución del patrimonio frente a la IA"
    >
      {/* Axes */}
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#E5D4BD" stroke-width="1" />
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#E5D4BD" stroke-width="1" />

      {/* AI line — muted dashed */}
      <polyline
        fill="none"
        stroke="#8A7868"
        stroke-width="2"
        stroke-dasharray="4 3"
        points={line('aiNet')}
      />

      {/* Player line — terracota solid */}
      <polyline
        fill="none"
        stroke="#C44E2C"
        stroke-width="2.5"
        points={line('playerNet')}
      />

      {/* Year labels */}
      <text
        x={padL}
        y={H - 8}
        font-family="monospace"
        font-size="9"
        fill="#8A7868"
      >
        {history[0].year}
      </text>
      <text
        x={W - padR}
        y={H - 8}
        text-anchor="end"
        font-family="monospace"
        font-size="9"
        fill="#8A7868"
      >
        {history[history.length - 1].year}
      </text>
    </svg>
  );
}
