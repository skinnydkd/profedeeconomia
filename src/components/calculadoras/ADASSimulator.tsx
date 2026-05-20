/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  BASE_Y,
  BASE_P,
  adPrice,
  srasPrice,
  potentialOutput,
  solveADAS,
  adjustToLongRun,
  type ADASState,
  type GapKind,
} from '@/lib/calc/ad-as';
import { formatNumber } from '@/lib/calc/format';

/**
 * AD-AS interactive simulator — the editorial diferenciador of Eco 1BACH U8.
 *
 * All the economics live in the pure, unit-tested module `lib/calc/ad-as.ts`.
 * This component is only state + UI: it lets the student push aggregate demand
 * and short-run aggregate supply around (by economic *cause*), shows the new
 * short-run equilibrium, the output gap against potential output (LRAS), and a
 * "long-run adjustment" button that closes the gap. Four teaching presets set
 * the scene with a one-line explanation each.
 */

interface Preset {
  label: string;
  state: ADASState;
  note: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Política fiscal expansiva',
    state: { adShift: 25, srasShift: 0, lrasShift: 0 },
    note: 'El sector público sube el gasto y la inversión: la demanda agregada se desplaza a la derecha. Suben el producto y los precios, y se abre una brecha inflacionaria.',
  },
  {
    label: 'Shock de oferta (petróleo)',
    state: { adShift: 0, srasShift: -25, lrasShift: 0 },
    note: 'El encarecimiento de la energía dispara los costes: la SRAS se desplaza a la izquierda. Suben los precios y cae el producto: estanflación.',
  },
  {
    label: 'Recesión de demanda',
    state: { adShift: -25, srasShift: 0, lrasShift: 0 },
    note: 'El pesimismo recorta consumo e inversión: la demanda agregada cae. Bajan precios y producto, y aparece una brecha recesiva con desempleo cíclico.',
  },
  {
    label: 'Boom inflacionario',
    state: { adShift: 35, srasShift: 0, lrasShift: 0 },
    note: 'Crédito barato y euforia disparan la demanda muy por encima del potencial: el producto se sobrecalienta y la inflación se acelera.',
  },
];

// Demand-side causes the student can toggle (each nudges adShift).
const AD_CAUSES: ReadonlyArray<{ key: string; label: string; delta: number }> = [
  { key: 'consumo', label: 'Consumo de las familias', delta: 10 },
  { key: 'inversion', label: 'Inversión empresarial', delta: 10 },
  { key: 'gasto', label: 'Gasto público', delta: 10 },
  { key: 'export', label: 'Exportaciones netas', delta: 10 },
];

// Supply-side causes (each nudges srasShift; cost rises shift SRAS left).
const SRAS_CAUSES: ReadonlyArray<{ key: string; label: string; delta: number }> = [
  { key: 'energia', label: 'Precio de la energía ↑', delta: -10 },
  { key: 'salarios', label: 'Salarios ↑', delta: -10 },
  { key: 'productividad', label: 'Productividad ↑', delta: 10 },
];

export default function ADASSimulator() {
  const [state, setState] = useState<ADASState>({ adShift: 0, srasShift: 0, lrasShift: 0 });

  const result = useMemo(() => solveADAS(state), [state]);

  function reset() {
    setState({ adShift: 0, srasShift: 0, lrasShift: 0 });
  }

  function applyPreset(p: Preset) {
    setState(p.state);
  }

  function toLongRun() {
    setState((s) => adjustToLongRun(s));
  }

  function set<K extends keyof ADASState>(key: K, value: number) {
    setState((s) => ({ ...s, [key]: value }));
  }

  const atPotential = Math.abs(result.outputGap) < 0.05;

  return (
    <div class="calc">
      <div class="calc__sub">Escenarios</div>
      <div class="calc__presets">
        {PRESETS.map((p) => (
          <button
            type="button"
            class="calc__btn calc__btn--ghost"
            onClick={() => applyPreset(p)}
            title={p.note}
          >
            {p.label}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          Reiniciar
        </button>
      </div>

      <div class="calc__sub">Demanda agregada (AD)</div>
      <p class="adas__hint">
        Un desplazamiento positivo empuja la AD a la derecha (más consumo, inversión, gasto
        público o exportaciones netas).
      </p>
      <div class="adas__causes">
        {AD_CAUSES.map((c) => (
          <button
            type="button"
            class="adas__cause adas__cause--terra"
            onClick={() => set('adShift', state.adShift + c.delta)}
          >
            {c.label} <span class="adas__cause-plus">+</span>
          </button>
        ))}
      </div>
      <SliderField
        label="Desplazamiento total de la AD"
        min={-50}
        max={50}
        step={5}
        value={state.adShift}
        onChange={(v) => set('adShift', v)}
        accent="terra"
      />

      <div class="calc__sub">Oferta de corto plazo (SRAS)</div>
      <p class="adas__hint">
        Un choque negativo (energía o salarios al alza) desplaza la SRAS a la izquierda; una
        mejora de productividad la lleva a la derecha.
      </p>
      <div class="adas__causes">
        {SRAS_CAUSES.map((c) => (
          <button
            type="button"
            class="adas__cause adas__cause--mustard"
            onClick={() => set('srasShift', state.srasShift + c.delta)}
          >
            {c.label} <span class="adas__cause-plus">{c.delta > 0 ? '+' : '−'}</span>
          </button>
        ))}
      </div>
      <SliderField
        label="Desplazamiento total de la SRAS"
        min={-50}
        max={50}
        step={5}
        value={state.srasShift}
        onChange={(v) => set('srasShift', v)}
        accent="mustard"
      />

      <div class="calc__sub">Producción potencial (LRAS)</div>
      <SliderField
        label="Cambio estructural del potencial"
        min={-30}
        max={30}
        step={5}
        value={state.lrasShift}
        onChange={(v) => set('lrasShift', v)}
        accent="ink"
      />

      <div class="adas__lr-row">
        <button
          type="button"
          class="calc__btn calc__btn--ghost"
          onClick={toLongRun}
          disabled={atPotential}
          title="La SRAS se ajusta hasta que el producto vuelve al potencial: la brecha se cierra y todo el ajuste recae en los precios."
        >
          Ajuste a largo plazo →
        </button>
        {atPotential && (
          <span class="adas__lr-note">La economía ya produce en el potencial.</span>
        )}
      </div>

      <div class="calc__results">
        <ADASChart state={state} result={result} />

        <div class="calc__metric calc__metric--primary">
          <span class="calc__metric-label">Brecha de producción</span>
          <span class="calc__metric-value">{fmtGap(result.outputGap)}</span>
          <span class="calc__metric-detail">{gapHeadline(result.gapKind, result.outputGapPct)}</span>
        </div>

        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric">
            <span class="calc__metric-label">Nivel de precios P*</span>
            <span class="calc__metric-value">{formatNumber(result.shortRun.P, 1)}</span>
            <span class="calc__metric-detail">{fmtDelta(result.shortRun.P - BASE_P)} sobre el índice base 100</span>
          </div>
          <div class="calc__metric">
            <span class="calc__metric-label">Producción Y*</span>
            <span class="calc__metric-value">{formatNumber(result.shortRun.Y, 1)}</span>
            <span class="calc__metric-detail">{fmtPctOfPotential(result.shortRun.Y, result.potentialY)} del potencial</span>
          </div>
          <div class="calc__metric">
            <span class="calc__metric-label">Potencial (LRAS)</span>
            <span class="calc__metric-value">{formatNumber(result.potentialY, 1)}</span>
            <span class="calc__metric-detail">Pleno empleo de los recursos</span>
          </div>
        </div>

        <div class="adas__interp">
          <p>{interpret(state, result)}</p>
        </div>

        <details class="calc__details">
          <summary>Cómo se calculan los equilibrios</summary>
          <div class="calc__formula">
            <p>
              <strong>AD:</strong> P = {BASE_P} + ({BASE_Y} + {fmtSigned(state.adShift)}) − Y
              &nbsp;·&nbsp;
              <strong>SRAS:</strong> P = {BASE_P} + (Y − {BASE_Y} − {fmtSigned(state.srasShift)})
            </p>
            <p>
              <strong>Equilibrio de corto plazo</strong> (AD = SRAS): Y* ={' '}
              <strong>{formatNumber(result.shortRun.Y, 1)}</strong>, P* ={' '}
              <strong>{formatNumber(result.shortRun.P, 1)}</strong>.
            </p>
            <p>
              <strong>Largo plazo</strong> (AD = LRAS): el producto vuelve al potencial Y** ={' '}
              <strong>{formatNumber(result.potentialY, 1)}</strong> y todo el ajuste recae en el
              nivel de precios.
            </p>
          </div>
        </details>
      </div>

      <style>{`
        .adas__hint {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          color: var(--color-ink-mute);
          margin: -0.3rem 0 0.6rem;
          line-height: 1.5;
        }
        .adas__causes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 0.9rem;
        }
        .adas__cause {
          font-family: var(--font-sans);
          font-size: 0.84rem;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          border: 1.5px solid var(--color-line);
          background: var(--color-bg);
          color: var(--color-ink-soft);
          cursor: pointer;
          transition: border-color .15s var(--ease-soft), color .15s var(--ease-soft),
            background .15s var(--ease-soft);
        }
        .adas__cause-plus {
          font-family: var(--font-mono);
          font-weight: 700;
          margin-left: 0.15rem;
        }
        .adas__cause--terra:hover {
          border-color: var(--color-terra);
          color: var(--color-terra);
          background: var(--color-terra-soft);
        }
        .adas__cause--mustard:hover {
          border-color: var(--color-mustard);
          color: var(--color-mustard-deep);
          background: var(--color-mustard-soft);
        }
        .adas__lr-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .adas__lr-note {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-ink-mute);
        }
        .adas__slider-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 0.3rem;
        }
        .adas__slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--color-line-soft);
          outline: none;
        }
        .adas__slider::-webkit-slider-thumb {
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
        .adas__slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-terra);
          cursor: pointer;
          border: 2px solid var(--color-paper);
        }
        .adas__slider--mustard::-webkit-slider-thumb { background: var(--color-mustard); }
        .adas__slider--mustard::-moz-range-thumb { background: var(--color-mustard); }
        .adas__slider--ink::-webkit-slider-thumb { background: var(--color-ink); }
        .adas__slider--ink::-moz-range-thumb { background: var(--color-ink); }
        .adas__slider-value {
          font-family: var(--font-mono);
          font-size: 0.92rem;
          color: var(--color-ink);
          font-weight: 600;
          min-width: 3.5ch;
          text-align: right;
        }
        .adas__slider-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;
        }
        .adas__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg);
          border: 1px solid var(--color-line);
          border-radius: 6px;
          margin-bottom: 1.4rem;
        }
        .adas__interp {
          background: var(--color-bg-cream);
          border-left: 3px solid var(--color-mustard);
          padding: 0.9rem 1.1rem;
          border-radius: 0 4px 4px 0;
          margin: 1rem 0;
          font-family: var(--font-serif);
          font-size: 0.98rem;
          line-height: 1.55;
          color: var(--color-ink-soft);
        }
        .adas__interp p { margin: 0; }
      `}</style>
    </div>
  );
}

function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
  accent,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  accent: 'terra' | 'mustard' | 'ink';
}) {
  const cls =
    accent === 'mustard'
      ? 'adas__slider adas__slider--mustard'
      : accent === 'ink'
        ? 'adas__slider adas__slider--ink'
        : 'adas__slider';
  return (
    <div class="calc__field adas__slider-row">
      <div class="adas__slider-head">
        <span class="calc__label">{label}</span>
        <span class="adas__slider-value">{value > 0 ? `+${value}` : value}</span>
      </div>
      <input
        type="range"
        class={cls}
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) => onChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
      />
    </div>
  );
}

/* =========================================================
   Inline SVG chart for the AD-AS model.
   Curves and points come straight from the pure model module.
   ========================================================= */
function ADASChart({
  state,
  result,
}: {
  state: ADASState;
  result: ReturnType<typeof solveADAS>;
}) {
  const W = 600;
  const H = 400;
  const ML = 60;
  const MR = 80;
  const MT = 30;
  const MB = 50;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;

  const Y_MIN = 0;
  const Y_MAX = 250;
  const P_MIN = 0;
  const P_MAX = 250;

  const xOf = (y: number) => ML + ((y - Y_MIN) / (Y_MAX - Y_MIN)) * innerW;
  const yOf = (p: number) => MT + innerH - ((p - P_MIN) / (P_MAX - P_MIN)) * innerH;

  const adLine = clipLine((y) => adPrice(y, state), Y_MIN, Y_MAX, P_MIN, P_MAX);
  const srasLine = clipLine((y) => srasPrice(y, state), Y_MIN, Y_MAX, P_MIN, P_MAX);
  const lrasX = xOf(potentialOutput(state));

  const { shortRun, longRun, potentialY } = result;
  const Y_sr = shortRun.Y;
  const P_sr = shortRun.P;
  const Y_lr = longRun.Y;
  const P_lr = longRun.P;

  const adLabel = adLine ? { x: xOf(adLine.x2) + 6, y: yOf(adLine.y2) } : null;
  const srasLabel = srasLine ? { x: xOf(srasLine.x2) + 6, y: yOf(srasLine.y2) - 4 } : null;
  const lrasLabel = { x: lrasX + 6, y: MT + 14 };

  const gapVisible =
    Math.abs(Y_sr - potentialY) > 0.05 &&
    inDomain(Y_sr, P_sr, Y_MIN, Y_MAX, P_MIN, P_MAX);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      class="adas__chart"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Modelo AD-AS con brecha de producción"
    >
      {/* Output-gap shading between actual output and potential */}
      {gapVisible && (
        <rect
          x={Math.min(xOf(Y_sr), lrasX)}
          y={MT}
          width={Math.abs(xOf(Y_sr) - lrasX)}
          height={innerH}
          fill={Y_sr > potentialY ? 'var(--color-terra-soft)' : 'var(--color-mustard-soft)'}
          opacity="0.6"
        />
      )}

      {/* Axes */}
      <line
        x1={ML}
        y1={MT + innerH}
        x2={ML + innerW}
        y2={MT + innerH}
        stroke="var(--color-ink)"
        stroke-width="1.5"
      />
      <line x1={ML} y1={MT} x2={ML} y2={MT + innerH} stroke="var(--color-ink)" stroke-width="1.5" />

      {/* Axis labels */}
      <text
        x={ML + innerW}
        y={MT + innerH + 32}
        text-anchor="end"
        font-family="var(--font-sans)"
        font-size="13"
        fill="var(--color-ink-soft)"
        font-style="italic"
      >
        Y (PIB real)
      </text>
      <text
        x={ML - 14}
        y={MT - 8}
        text-anchor="end"
        font-family="var(--font-sans)"
        font-size="13"
        fill="var(--color-ink-soft)"
        font-style="italic"
      >
        P
      </text>

      {/* Reference ticks at the baseline value 100 */}
      <line x1={xOf(100)} y1={MT + innerH} x2={xOf(100)} y2={MT + innerH + 4} stroke="var(--color-ink-mute)" />
      <text x={xOf(100)} y={MT + innerH + 18} text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--color-ink-mute)">
        100
      </text>
      <line x1={ML - 4} y1={yOf(100)} x2={ML} y2={yOf(100)} stroke="var(--color-ink-mute)" />
      <text x={ML - 8} y={yOf(100) + 4} text-anchor="end" font-family="var(--font-mono)" font-size="11" fill="var(--color-ink-mute)">
        100
      </text>

      {/* AD curve */}
      {adLine && (
        <line
          x1={xOf(adLine.x1)}
          y1={yOf(adLine.y1)}
          x2={xOf(adLine.x2)}
          y2={yOf(adLine.y2)}
          stroke="var(--color-terra)"
          stroke-width="3"
          stroke-linecap="round"
        />
      )}
      {adLabel && (
        <text x={adLabel.x} y={adLabel.y} font-family="var(--font-serif)" font-size="14" font-style="italic" fill="var(--color-terra)" font-weight="600">
          AD
        </text>
      )}

      {/* SRAS curve */}
      {srasLine && (
        <line
          x1={xOf(srasLine.x1)}
          y1={yOf(srasLine.y1)}
          x2={xOf(srasLine.x2)}
          y2={yOf(srasLine.y2)}
          stroke="var(--color-mustard-deep)"
          stroke-width="3"
          stroke-linecap="round"
        />
      )}
      {srasLabel && (
        <text x={srasLabel.x} y={srasLabel.y} font-family="var(--font-serif)" font-size="14" font-style="italic" fill="var(--color-mustard-deep)" font-weight="600">
          SRAS
        </text>
      )}

      {/* LRAS vertical */}
      <line x1={lrasX} y1={MT} x2={lrasX} y2={MT + innerH} stroke="var(--color-ink)" stroke-width="2" stroke-dasharray="6 5" />
      <text x={lrasLabel.x} y={lrasLabel.y} font-family="var(--font-serif)" font-size="14" font-style="italic" fill="var(--color-ink)" font-weight="600">
        LRAS
      </text>

      {/* Short-run equilibrium */}
      {inDomain(Y_sr, P_sr, Y_MIN, Y_MAX, P_MIN, P_MAX) && (
        <>
          <circle cx={xOf(Y_sr)} cy={yOf(P_sr)} r="6" fill="var(--color-terra)" stroke="var(--color-paper)" stroke-width="2" />
          <text x={xOf(Y_sr) + 10} y={yOf(P_sr) - 8} font-family="var(--font-serif)" font-size="13" font-style="italic" fill="var(--color-terra)" font-weight="600">
            E*
          </text>
        </>
      )}

      {/* Long-run equilibrium (on LRAS) — only when it differs from short run */}
      {gapVisible && inDomain(Y_lr, P_lr, Y_MIN, Y_MAX, P_MIN, P_MAX) && (
        <>
          <circle cx={xOf(Y_lr)} cy={yOf(P_lr)} r="5" fill="var(--color-ink)" stroke="var(--color-paper)" stroke-width="2" />
          <text x={xOf(Y_lr) + 10} y={yOf(P_lr) + 18} font-family="var(--font-serif)" font-size="13" font-style="italic" fill="var(--color-ink)" font-weight="600">
            E**
          </text>
        </>
      )}
    </svg>
  );
}

/**
 * Returns the two visible endpoints {x1, y1, x2, y2} of a linear function
 * P = f(Y) clipped to the rectangular domain [Ymin, Ymax] × [Pmin, Pmax].
 * Coordinates are in *data* units (Y, P), not pixels.
 * Returns null if the curve is entirely outside the box.
 */
function clipLine(
  f: (y: number) => number,
  Ymin: number,
  Ymax: number,
  Pmin: number,
  Pmax: number
): { x1: number; y1: number; x2: number; y2: number } | null {
  const pts: Array<{ y: number; p: number }> = [];

  for (const y of [Ymin, Ymax]) {
    const p = f(y);
    if (p >= Pmin && p <= Pmax) pts.push({ y, p });
  }

  const f0 = f(0);
  const f1 = f(1);
  const slope = f1 - f0;
  if (slope !== 0) {
    for (const p of [Pmin, Pmax]) {
      const y = (p - f0) / slope;
      if (y >= Ymin && y <= Ymax) pts.push({ y, p });
    }
  }

  if (pts.length < 2) return null;
  pts.sort((a, b) => a.y - b.y);
  const a = pts[0];
  const b = pts[pts.length - 1];
  if (a.y === b.y) return null;
  return { x1: a.y, y1: a.p, x2: b.y, y2: b.p };
}

function inDomain(
  y: number,
  p: number,
  Ymin: number,
  Ymax: number,
  Pmin: number,
  Pmax: number
): boolean {
  return y >= Ymin && y <= Ymax && p >= Pmin && p <= Pmax;
}

/* =========================================================
   Interpretation helpers (presentation only).
   ========================================================= */
function fmtDelta(d: number): string {
  if (Math.abs(d) < 0.05) return 'Sin variación';
  const sign = d > 0 ? '+' : '−';
  return `${sign}${formatNumber(Math.abs(d), 1)}`;
}

function fmtGap(gap: number): string {
  if (Math.abs(gap) < 0.05) return '0';
  const sign = gap > 0 ? '+' : '−';
  return `${sign}${formatNumber(Math.abs(gap), 1)}`;
}

function fmtSigned(v: number): string {
  return v >= 0 ? `+${v}` : `${v}`;
}

function fmtPctOfPotential(Y: number, potential: number): string {
  if (potential === 0) return '—';
  return formatNumber((Y / potential) * 100, 0) + ' %';
}

function gapHeadline(kind: GapKind, pct: number): string {
  const mag = formatNumber(Math.abs(pct), 1);
  if (kind === 'neutra') return 'Pleno empleo: la economía produce justo en el potencial.';
  if (kind === 'inflacionaria')
    return `Brecha inflacionaria (+${mag} % sobre el potencial): la economía se sobrecalienta y presiona los precios al alza.`;
  return `Brecha recesiva (−${mag} % bajo el potencial): hay recursos ociosos y desempleo cíclico.`;
}

function interpret(state: ADASState, result: ReturnType<typeof solveADAS>): string {
  const { adShift, srasShift } = state;
  const noShock = adShift === 0 && srasShift === 0 && state.lrasShift === 0;
  if (noShock) {
    return 'La economía parte del equilibrio: produce en el potencial con precios estables. Aplica un escenario o desplaza las curvas para ver qué ocurre.';
  }
  // Headline the dominant story.
  if (srasShift < 0 && result.shortRun.P > BASE_P && result.shortRun.Y < BASE_Y) {
    return 'Estanflación: el choque negativo de oferta sube los precios y, a la vez, hunde la producción. La política de demanda no puede arreglar las dos cosas a la vez.';
  }
  if (adShift > 0 && result.gapKind === 'inflacionaria') {
    return 'La expansión de la demanda empuja producto y precios al alza por encima del potencial. A largo plazo, los costes se ajustan y la economía vuelve al potencial con precios más altos: pulsa "Ajuste a largo plazo".';
  }
  if (adShift < 0 && result.gapKind === 'recesiva') {
    return 'La caída de la demanda deja la economía por debajo del potencial: desempleo cíclico. A largo plazo, costes y salarios ceden y la SRAS recupera el potencial con precios más bajos.';
  }
  if (srasShift > 0) {
    return 'La mejora de oferta abarata producir: el producto sube y los precios bajan. Es el escenario más favorable, propio de avances de productividad.';
  }
  return 'Las curvas se han desplazado: observa cómo cambian el equilibrio de corto plazo (E*) y la brecha respecto al potencial (LRAS).';
}
