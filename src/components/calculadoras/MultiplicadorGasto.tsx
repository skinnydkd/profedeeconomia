/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  multiplier,
  solveMultiplier,
  spendingRounds,
  type MultiplierParams,
} from '@/lib/calc/multiplicador';
import { formatNumber } from '@/lib/calc/format';

/**
 * Keynesian spending-multiplier calculator — Eco 1BACH Unit 8 (AD-AS model /
 * fiscal policy).
 *
 * All the economics live in the pure, unit-tested module
 * `lib/calc/multiplicador.ts`. This component is only state + UI: the student
 * picks the marginal propensity to consume (PMC), an autonomous spending
 * injection (ΔGasto, e.g. public spending) and, optionally, a proportional
 * income tax t. It shows the multiplier k, the total change in equilibrium
 * income ΔY = k·ΔGasto, and an SVG cascade of decreasing spending rounds that
 * visually converges to ΔY.
 */

const ROUNDS_SHOWN = 8;

export default function MultiplicadorGasto() {
  const [pmc, setPmc] = useState<number>(0.8);
  const [deltaGasto, setDeltaGasto] = useState<number>(100);
  const [useTax, setUseTax] = useState<boolean>(false);
  const [t, setT] = useState<number>(0.25);

  const params: MultiplierParams = useMemo(
    () => ({ pmc, t: useTax ? t : 0 }),
    [pmc, useTax, t]
  );

  const result = useMemo(() => solveMultiplier(deltaGasto, params), [deltaGasto, params]);
  const noTaxK = useMemo(() => multiplier({ pmc }), [pmc]);
  const rounds = useMemo(
    () => (result.converges ? spendingRounds(deltaGasto, params, ROUNDS_SHOWN) : []),
    [deltaGasto, params, result.converges]
  );

  const spendRatio = pmc * (useTax ? 1 - t : 1);

  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field mg__slider-field">
          <div class="mg__slider-head">
            <span class="calc__label">Propensión marginal al consumo (PMC)</span>
            <span class="mg__slider-value">{formatNumber(pmc, 2)}</span>
          </div>
          <input
            type="range"
            class="mg__slider"
            min={0}
            max={0.99}
            step={0.01}
            value={pmc}
            onInput={(e) => setPmc(parseFloat((e.target as HTMLInputElement).value))}
          />
          <span class="calc__metric-detail">
            PMS = 1 − PMC = {formatNumber(result.pms, 2)} (lo que las familias ahorran de cada euro)
          </span>
        </label>

        <label class="calc__field">
          <span class="calc__label">Inyección de gasto autónomo (ΔGasto)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={10}
              value={deltaGasto}
              onInput={(e) => setDeltaGasto(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">mill. €</span>
          </div>
          <span class="calc__metric-detail">
            Por ejemplo, un aumento del gasto público, la inversión o las exportaciones.
          </span>
        </label>

        <label class="mg__toggle">
          <input
            type="checkbox"
            checked={useTax}
            onChange={(e) => setUseTax((e.target as HTMLInputElement).checked)}
          />
          <span>Incluir un tipo impositivo proporcional (t)</span>
        </label>

        {useTax && (
          <label class="calc__field mg__slider-field">
            <div class="mg__slider-head">
              <span class="calc__label">Tipo impositivo (t)</span>
              <span class="mg__slider-value">{formatNumber(t * 100, 0)} %</span>
            </div>
            <input
              type="range"
              class="mg__slider mg__slider--mustard"
              min={0}
              max={0.6}
              step={0.01}
              value={t}
              onInput={(e) => setT(parseFloat((e.target as HTMLInputElement).value))}
            />
            <span class="calc__metric-detail">
              Los impuestos drenan parte de cada ronda de renta antes de consumirse, así que el
              multiplicador se reduce.
            </span>
          </label>
        )}
      </div>

      <div class="calc__results">
        {!result.converges ? (
          <div class="calc__warning">
            Con PMC = 1 (las familias gastan todo lo que ganan) la serie no converge: el multiplicador
            tiende a infinito. Baja la PMC por debajo de 1 para ver un resultado finito.
          </div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">Multiplicador del gasto (k)</span>
              <span class="calc__metric-value">{formatNumber(result.k, 2)}</span>
              <span class="calc__metric-detail">
                Cada euro de gasto autónomo genera {formatNumber(result.k, 2)} € de renta.
              </span>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Variación de la renta de equilibrio (ΔY)</span>
                <span class="calc__metric-mini-value">
                  {fmtSigned(result.deltaIncome)} mill. €
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Inyección inicial (ΔGasto)</span>
                <span class="calc__metric-mini-value">{fmtSigned(result.deltaSpending)} mill. €</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Efecto neto (ΔY − ΔGasto)</span>
                <span class="calc__metric-mini-value">
                  {fmtSigned(result.deltaIncome - result.deltaSpending)} mill. €
                </span>
              </div>
            </div>

            <RoundsChart
              rounds={rounds}
              total={result.deltaIncome}
              deltaSpending={deltaGasto}
            />

            <details class="calc__details">
              <summary>Cómo se calcula</summary>
              <div class="calc__formula">
                <p>
                  <strong>Multiplicador</strong> ={' '}
                  {useTax ? (
                    <>
                      1 / (1 − PMC·(1 − t)) = 1 / (1 − {formatNumber(pmc, 2)}·(1 −{' '}
                      {formatNumber(t, 2)})) = <strong>{formatNumber(result.k, 2)}</strong>
                    </>
                  ) : (
                    <>
                      1 / (1 − PMC) = 1 / (1 − {formatNumber(pmc, 2)}) ={' '}
                      <strong>{formatNumber(result.k, 2)}</strong>
                    </>
                  )}
                </p>
                <p>
                  <strong>Variación de la renta</strong> = k · ΔGasto = {formatNumber(result.k, 2)} ·{' '}
                  {formatNumber(deltaGasto, 0)} ={' '}
                  <strong>{formatNumber(result.deltaIncome, 1)} mill. €</strong>
                </p>
                <p>
                  La inyección inicial pone en marcha rondas sucesivas de consumo inducido: cada ronda
                  reinyecta el {formatNumber(spendRatio * 100, 0)} % de la renta de la anterior. La suma
                  de todas las rondas converge a ΔY.
                </p>
                {useTax && (
                  <p>
                    Sin impuestos el multiplicador sería {formatNumber(noTaxK, 2)}; el tipo impositivo lo
                    reduce a {formatNumber(result.k, 2)}.
                  </p>
                )}
              </div>
            </details>
          </>
        )}
      </div>

      <style>{`
        .mg__slider-field {
          gap: 0.45rem;
        }
        .mg__slider-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
        }
        .mg__slider-value {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ink);
          min-width: 3.5ch;
          text-align: right;
        }
        .mg__slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--color-line-soft);
          outline: none;
        }
        .mg__slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-terra);
          cursor: pointer;
          border: 2px solid var(--color-paper);
          box-shadow: 0 1px 3px rgba(42, 31, 24, 0.3);
        }
        .mg__slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-terra);
          cursor: pointer;
          border: 2px solid var(--color-paper);
        }
        .mg__slider--mustard::-webkit-slider-thumb { background: var(--color-mustard); }
        .mg__slider--mustard::-moz-range-thumb { background: var(--color-mustard); }
        .mg__toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--color-ink-soft);
          cursor: pointer;
          margin-top: 0.2rem;
        }
        .mg__toggle input { width: 1.05rem; height: 1.05rem; accent-color: var(--color-terra); }
        .mg__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg);
          border: 1px solid var(--color-line);
          border-radius: 6px;
          margin: 1.2rem 0 0.4rem;
        }
        .mg__chart-caption {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-ink-soft);
          margin: 0 0 1rem;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   Inline SVG of the spending cascade: one decreasing bar per
   round plus a reference line at the converged total ΔY.
   ========================================================= */
function RoundsChart({
  rounds,
  total,
  deltaSpending,
}: {
  rounds: ReturnType<typeof spendingRounds>;
  total: number;
  deltaSpending: number;
}) {
  if (rounds.length === 0) return null;

  const W = 600;
  const H = 320;
  const ML = 50;
  const MR = 70;
  const MT = 24;
  const MB = 40;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;

  // Scale: tallest bar is the initial injection; the ΔY line sits above all
  // bars, so the vertical axis spans the (absolute) total with a little air.
  const maxVal = Math.max(Math.abs(total), Math.abs(deltaSpending)) || 1;
  const hOf = (v: number) => (Math.abs(v) / maxVal) * innerH;
  const baseY = MT + innerH;

  const n = rounds.length;
  const slot = innerW / n;
  const barW = Math.min(slot * 0.62, 46);

  const totalY = baseY - hOf(total);

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        class="mg__chart"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Cascada de rondas de gasto que converge a la variación total de la renta"
      >
        {/* Baseline */}
        <line x1={ML} y1={baseY} x2={ML + innerW} y2={baseY} stroke="var(--color-ink)" stroke-width="1.5" />

        {/* Decreasing bars, one per round */}
        {rounds.map((r, i) => {
          const cx = ML + slot * i + slot / 2;
          const x = cx - barW / 2;
          const h = hOf(r.spending);
          const y = baseY - h;
          return (
            <g key={r.round}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx="2"
                fill="var(--color-terra)"
                opacity={1 - (i / (n + 2)) * 0.55}
              />
              <text
                x={cx}
                y={baseY + 16}
                text-anchor="middle"
                font-family="var(--font-mono)"
                font-size="11"
                fill="var(--color-ink-mute)"
              >
                {r.round}
              </text>
            </g>
          );
        })}

        {/* Reference line at the converged total ΔY */}
        <line
          x1={ML}
          y1={totalY}
          x2={ML + innerW}
          y2={totalY}
          stroke="var(--color-mustard-deep)"
          stroke-width="2"
          stroke-dasharray="6 5"
        />
        <text
          x={ML + innerW + 6}
          y={totalY + 4}
          font-family="var(--font-serif)"
          font-size="13"
          font-style="italic"
          font-weight="600"
          fill="var(--color-mustard-deep)"
        >
          ΔY
        </text>

        {/* Axis labels */}
        <text
          x={ML + innerW}
          y={baseY + 34}
          text-anchor="end"
          font-family="var(--font-sans)"
          font-size="12"
          font-style="italic"
          fill="var(--color-ink-soft)"
        >
          Rondas de gasto
        </text>
        <text
          x={ML - 8}
          y={MT - 8}
          text-anchor="start"
          font-family="var(--font-sans)"
          font-size="12"
          font-style="italic"
          fill="var(--color-ink-soft)"
        >
          Gasto inducido por ronda
        </text>
      </svg>
      <p class="mg__chart-caption">
        La inyección inicial (ronda 1) genera rondas decrecientes de consumo inducido. Su suma converge
        a la variación total de la renta ΔY (línea discontinua).
      </p>
    </>
  );
}

/* Presentation helper: signed es-ES number. */
function fmtSigned(v: number): string {
  if (!Number.isFinite(v)) return '∞';
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return `${sign}${formatNumber(Math.abs(v), 1)}`;
}
