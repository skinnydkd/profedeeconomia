/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  analyze,
  type ElasticityKind,
  type PricePoint,
  type RevenueDirection,
} from '../../lib/calc/elasticidad';

/**
 * Price elasticity of demand calculator (Eco 1BACH · Unit 5).
 *
 * The student enters two points of the demand curve (P1, Q1) and (P2, Q2).
 * We report the arc elasticity (midpoint method), highlight the classification
 * (elástica / inelástica / unitaria and the two limit cases), and show how
 * total revenue (IT = P · Q) reacts to a price rise.
 *
 * The SVG chart draws the demand line through both points so students *see*
 * how a steeper curve means a more inelastic demand. Variant C palette
 * (terracota + mostaza) via CSS variables for site coherence.
 */
export default function ElasticidadCalc() {
  const [p1, setP1] = useState<number>(4);
  const [q1, setQ1] = useState<number>(120);
  const [p2, setP2] = useState<number>(6);
  const [q2, setQ2] = useState<number>(80);

  const result = useMemo(() => {
    const a: PricePoint = { P: p1, Q: q1 };
    const b: PricePoint = { P: p2, Q: q2 };

    // Same point on both axes, or zero average price/quantity → not analysable.
    if (p1 === p2 && q1 === q2) {
      return { valido: false as const, mensaje: 'Introduce dos puntos distintos de la curva de demanda.' };
    }
    if (p1 + p2 === 0) {
      return { valido: false as const, mensaje: 'El precio medio no puede ser cero.' };
    }
    if (q1 + q2 === 0) {
      return { valido: false as const, mensaje: 'La cantidad media no puede ser cero.' };
    }

    try {
      return { valido: true as const, ...analyze(a, b) };
    } catch (e) {
      return { valido: false as const, mensaje: (e as Error).message };
    }
  }, [p1, q1, p2, q2]);

  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Precio inicial (P₁)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={0.5}
              value={p1}
              onInput={(e) => setP1(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Cantidad inicial (Q₁)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={5}
              value={q1}
              onInput={(e) => setQ1(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">uds</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Precio final (P₂)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={0.5}
              value={p2}
              onInput={(e) => setP2(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Cantidad final (Q₂)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={5}
              value={q2}
              onInput={(e) => setQ2(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">uds</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">Elasticidad (método del punto medio)</span>
              <span class="calc__metric-value">{fmtE(result.arc.E)}</span>
              <span class="calc__metric-detail">{result.label}</span>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Variación de la cantidad</span>
                <span class="calc__metric-mini-value">{fmtPct(result.arc.pctChangeQ)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Variación del precio</span>
                <span class="calc__metric-mini-value">{fmtPct(result.arc.pctChangeP)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Clasificación</span>
                <span class="calc__metric-mini-value">{kindShort(result.kind)}</span>
              </div>
            </div>

            {result.revenue ? (
              <div class="el__revenue">
                <div class="el__revenue-head">
                  Al subir el precio, el ingreso total{' '}
                  <strong class={revClass(result.revenue.direction)}>
                    {revWord(result.revenue.direction)}
                  </strong>
                </div>
                <div class="calc__metric-grid">
                  <div class="calc__metric-mini">
                    <span class="calc__metric-mini-label">IT antes (precio menor)</span>
                    <span class="calc__metric-mini-value">{fmtMoney(result.revenue.before)}</span>
                  </div>
                  <div class="calc__metric-mini">
                    <span class="calc__metric-mini-label">IT después (precio mayor)</span>
                    <span class={`calc__metric-mini-value ${result.revenue.change >= 0 ? 'ok' : 'fail'}`}>
                      {fmtMoney(result.revenue.after)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div class="el__revenue">
                <div class="el__revenue-head">
                  Introduce dos precios distintos para analizar el efecto sobre los ingresos.
                </div>
              </div>
            )}

            <DemandChart
              a={{ P: p1, Q: q1 }}
              b={{ P: p2, Q: q2 }}
              kind={result.kind}
            />

            <details class="calc__details">
              <summary>Cómo se calcula</summary>
              <div class="calc__formula">
                <p>
                  <strong>Método del punto medio (elasticidad arco):</strong> usa la media de
                  los dos valores como base, por lo que el resultado es el mismo suba o baje el
                  precio.
                </p>
                <p>
                  E = ( ΔQ / Q̄ ) / ( ΔP / P̄ ) = ({fmtPct(result.arc.pctChangeQ)}) / ({fmtPct(result.arc.pctChangeP)}) ={' '}
                  <strong>{fmtE(result.arc.E)}</strong>
                </p>
                <p>
                  El signo es negativo porque cantidad y precio se mueven en sentidos opuestos
                  (ley de la demanda). Para clasificar se usa el valor absoluto |E|:
                  {' '}|E| &gt; 1 elástica, |E| &lt; 1 inelástica, |E| = 1 unitaria.
                </p>
                <p>
                  <strong>Ingreso total</strong> (IT = P · Q): si la demanda es elástica, al
                  subir el precio el IT baja; si es inelástica, el IT sube; si es unitaria, no
                  cambia.
                  {result.revenue
                    ? ` Aquí pasa de ${fmtMoney(result.revenue.before)} a ${fmtMoney(result.revenue.after)}.`
                    : ' Introduce dos precios distintos para ver el efecto sobre los ingresos.'}
                </p>
              </div>
            </details>
          </>
        )}
      </div>

      <style>{`
        .el__revenue {
          margin-top: 1.2rem;
          padding: 1rem 1.1rem;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line);
          border-radius: 6px;
        }
        .el__revenue-head {
          font-family: var(--font-sans);
          font-size: 0.98rem;
          color: var(--color-ink-soft);
          margin-bottom: 0.8rem;
        }
        .el__revenue-head .up { color: var(--color-mustard-deep, #A87A2A); }
        .el__revenue-head .down { color: #B83A3A; }
        .el__revenue-head .flat { color: var(--color-ink-mute); }
        .el__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line);
          border-radius: 6px;
          margin-top: 1.4rem;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------- SVG chart -------------------------------- */

function DemandChart({ a, b, kind }: { a: PricePoint; b: PricePoint; kind: ElasticityKind }) {
  const W = 600;
  const H = 360;
  const ML = 56;
  const MR = 24;
  const MT = 24;
  const MB = 44;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;

  const maxQ = Math.max(a.Q, b.Q, 1) * 1.15;
  const maxP = Math.max(a.P, b.P, 1) * 1.15;

  const xOf = (q: number) => ML + (q / maxQ) * innerW;
  const yOf = (p: number) => MT + innerH - (p / maxP) * innerH;

  // Order points by price so the demand line is drawn from low-P to high-P.
  const lowP = a.P <= b.P ? a : b;
  const highP = a.P <= b.P ? b : a;

  // Extend the straight demand line across the full plot for context.
  const dq = highP.Q - lowP.Q;
  const dp = highP.P - lowP.P;
  let lineStart: [number, number];
  let lineEnd: [number, number];
  if (dp === 0) {
    // Horizontal demand (perfectly elastic): flat line at this price.
    lineStart = [xOf(0), yOf(lowP.P)];
    lineEnd = [xOf(maxQ), yOf(lowP.P)];
  } else if (dq === 0) {
    // Vertical demand (perfectly inelastic): vertical line at this quantity.
    lineStart = [xOf(lowP.Q), yOf(0)];
    lineEnd = [xOf(lowP.Q), yOf(maxP)];
  } else {
    // Q as a function of P, extended to the plot's price range.
    const qAt = (p: number) => lowP.Q + (dq / dp) * (p - lowP.P);
    lineStart = [xOf(qAt(0)), yOf(0)];
    lineEnd = [xOf(qAt(maxP)), yOf(maxP)];
  }

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxP / ticks) * i);
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxQ / ticks) * i);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      class="el__chart"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Curva de demanda con los dos puntos introducidos"
    >
      {/* Grid */}
      {yTicks.map((p) => (
        <line
          x1={ML}
          y1={yOf(p)}
          x2={ML + innerW}
          y2={yOf(p)}
          stroke="var(--color-line-soft, #EFE2CB)"
          stroke-width="1"
          stroke-dasharray="3 4"
        />
      ))}

      {/* Axes */}
      <line x1={ML} y1={MT + innerH} x2={ML + innerW} y2={MT + innerH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />
      <line x1={ML} y1={MT} x2={ML} y2={MT + innerH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />

      {/* Y tick labels (price) */}
      {yTicks.map((p) => (
        <text x={ML - 8} y={yOf(p) + 4} text-anchor="end" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(p)}
        </text>
      ))}

      {/* X tick labels (quantity) */}
      {xTicks.map((q) => (
        <text x={xOf(q)} y={MT + innerH + 18} text-anchor="middle" font-family="var(--font-mono)" font-size="10" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(q)}
        </text>
      ))}

      {/* Axis titles */}
      <text x={ML - 44} y={MT + 4} font-family="var(--font-sans)" font-size="12" font-style="italic" fill="var(--color-ink-soft, #5C4A3D)">
        P
      </text>
      <text x={ML + innerW} y={H - 6} text-anchor="end" font-family="var(--font-sans)" font-size="12" font-style="italic" fill="var(--color-ink-soft, #5C4A3D)">
        Q
      </text>

      {/* Demand line (terracota) */}
      <line
        x1={lineStart[0]}
        y1={lineStart[1]}
        x2={lineEnd[0]}
        y2={lineEnd[1]}
        stroke="var(--color-terra, #C44E2C)"
        stroke-width="2.5"
      />
      <text
        x={lineEnd[0] - 6}
        y={lineEnd[1] + 16}
        text-anchor="end"
        font-family="var(--font-sans)"
        font-size="12"
        font-weight="700"
        fill="var(--color-terra-deep, #9C3A1C)"
      >
        D ({kindShort(kind)})
      </text>

      {/* Guide lines + the two marked points */}
      {[a, b].map((pt, i) => (
        <>
          <line x1={ML} y1={yOf(pt.P)} x2={xOf(pt.Q)} y2={yOf(pt.P)} stroke="var(--color-mustard-deep, #A87A2A)" stroke-width="1" stroke-dasharray="2 3" />
          <line x1={xOf(pt.Q)} y1={MT + innerH} x2={xOf(pt.Q)} y2={yOf(pt.P)} stroke="var(--color-mustard-deep, #A87A2A)" stroke-width="1" stroke-dasharray="2 3" />
          <circle cx={xOf(pt.Q)} cy={yOf(pt.P)} r="5" fill="var(--color-mustard, #D4A24C)" stroke="var(--color-ink, #2A1F18)" stroke-width="1.2" />
          <text
            x={xOf(pt.Q) + 9}
            y={yOf(pt.P) - 7}
            font-family="var(--font-mono)"
            font-size="11"
            fill="var(--color-ink, #2A1F18)"
          >
            {i === 0 ? '1' : '2'} ({fmtAxis(pt.Q)}, {fmtAxis(pt.P)})
          </text>
        </>
      ))}
    </svg>
  );
}

/* ------------------------------- formatting ------------------------------- */

function fmtE(E: number): string {
  if (!Number.isFinite(E)) return E > 0 ? '+∞' : '−∞';
  return E.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(ratio: number): string {
  const pct = ratio * 100;
  return `${pct.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtAxis(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}

function kindShort(kind: ElasticityKind): string {
  switch (kind) {
    case 'elastica':
      return 'elástica';
    case 'inelastica':
      return 'inelástica';
    case 'unitaria':
      return 'unitaria';
    case 'perfectamente_elastica':
      return 'perf. elástica';
    case 'perfectamente_inelastica':
      return 'perf. inelástica';
  }
}

function revWord(d: RevenueDirection): string {
  return d === 'sube' ? 'sube' : d === 'baja' ? 'baja' : 'no cambia';
}

function revClass(d: RevenueDirection): string {
  return d === 'sube' ? 'up' : d === 'baja' ? 'down' : 'flat';
}
