/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * AD-AS interactive simulator — the editorial diferenciador of Unit 8.
 *
 * Three controls (AD, SRAS, LRAS horizontal shifts) drive a simple linear
 * macroeconomic model whose short-run and long-run equilibria are computed
 * analytically and drawn live on an inline SVG.
 *
 *   AD:   P = 200 − Y + adShift          (rightward shift → higher P at each Y)
 *   SRAS: P = Y − 100 − srasShift        (rightward shift → lower  P at each Y)
 *   LRAS: vertical at Y = 100 + lrasShift
 *
 * Short-run eq. (AD ∩ SRAS):
 *   2Y = 300 + adShift + srasShift  →  Y_sr = (300 + AD + SRAS) / 2
 *   P_sr = 200 − Y_sr + adShift
 *
 * Long-run eq. (AD ∩ LRAS):
 *   Y_lr = 100 + lrasShift
 *   P_lr = 200 − Y_lr + adShift = 100 + adShift − lrasShift
 */

type Preset = { label: string; ad: number; sras: number; lras: number; note: string };

const PRESETS: Preset[] = [
  {
    label: 'Shock COVID 2020',
    ad: -30,
    sras: -20,
    lras: 0,
    note: 'Caída de la demanda agregada por confinamientos y choque de oferta por roturas de cadena.',
  },
  {
    label: 'Subida del petróleo 2022',
    ad: 0,
    sras: -25,
    lras: 0,
    note: 'Choque de oferta puro: encarecimiento de inputs energéticos.',
  },
  {
    label: 'Estímulo NextGenEU',
    ad: 20,
    sras: 5,
    lras: 10,
    note: 'Expansión fiscal e inversión productiva: empuja demanda y producción potencial.',
  },
];

export default function ADASSimulator() {
  const [adShift, setAdShift] = useState<number>(0);
  const [srasShift, setSrasShift] = useState<number>(0);
  const [lrasShift, setLrasShift] = useState<number>(0);

  const eq = useMemo(() => {
    const Y_sr = (300 + adShift + srasShift) / 2;
    const P_sr = 200 - Y_sr + adShift;
    const Y_lr = 100 + lrasShift;
    const P_lr = 200 - Y_lr + adShift;
    return { Y_sr, P_sr, Y_lr, P_lr };
  }, [adShift, srasShift, lrasShift]);

  function reset() {
    setAdShift(0);
    setSrasShift(0);
    setLrasShift(0);
  }

  function applyPreset(p: Preset) {
    setAdShift(p.ad);
    setSrasShift(p.sras);
    setLrasShift(p.lras);
  }

  return (
    <div class="calc">
      <div class="calc__sub">Presets</div>
      <div class="adas__presets">
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

      <div class="calc__sub">Desplazamientos</div>
      <div class="calc__form">
        <SliderField
          label="Demanda agregada (AD)"
          min={-50}
          max={50}
          step={5}
          value={adShift}
          onChange={setAdShift}
          accent="terra"
        />
        <SliderField
          label="Oferta de corto plazo (SRAS)"
          min={-50}
          max={50}
          step={5}
          value={srasShift}
          onChange={setSrasShift}
          accent="mustard"
        />
        <SliderField
          label="Producción potencial (LRAS)"
          min={-30}
          max={30}
          step={5}
          value={lrasShift}
          onChange={setLrasShift}
          accent="ink"
        />
      </div>

      <div class="calc__results">
        <ADASChart
          ad={adShift}
          sras={srasShift}
          lras={lrasShift}
          Y_sr={eq.Y_sr}
          P_sr={eq.P_sr}
          Y_lr={eq.Y_lr}
          P_lr={eq.P_lr}
        />

        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric">
            <span class="calc__metric-label">Y* (corto plazo)</span>
            <span class="calc__metric-value">{eq.Y_sr.toFixed(1).replace('.', ',')}</span>
            <span class="calc__metric-detail">
              {fmtDelta(eq.Y_sr - 100)} respecto al equilibrio inicial
            </span>
          </div>
          <div class="calc__metric">
            <span class="calc__metric-label">P* (corto plazo)</span>
            <span class="calc__metric-value">{eq.P_sr.toFixed(1).replace('.', ',')}</span>
            <span class="calc__metric-detail">
              {fmtDelta(eq.P_sr - 100)} respecto al equilibrio inicial
            </span>
          </div>
          <div class="calc__metric calc__metric--primary">
            <span class="calc__metric-label">Brecha de producción</span>
            <span class="calc__metric-value">{(eq.Y_sr - eq.Y_lr).toFixed(1).replace('.', ',')}</span>
            <span class="calc__metric-detail">{gapInterpretation(eq.Y_sr - eq.Y_lr)}</span>
          </div>
        </div>

        <div class="calc__metric-grid">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Y** (largo plazo)</span>
            <span class="calc__metric-mini-value">{eq.Y_lr.toFixed(1).replace('.', ',')}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">P** (largo plazo)</span>
            <span class="calc__metric-mini-value">{eq.P_lr.toFixed(1).replace('.', ',')}</span>
          </div>
        </div>

        <div class="adas__interp">
          <p>{interpretAD(adShift)}</p>
          <p>{interpretSRAS(srasShift)}</p>
          <p>{interpretLRAS(lrasShift)}</p>
        </div>

        <details class="calc__details">
          <summary>Cómo se calculan los equilibrios</summary>
          <div class="calc__formula">
            <p>
              <strong>AD:</strong> P = 200 − Y + {adShift} &nbsp;·&nbsp;
              <strong>SRAS:</strong> P = Y − 100 − ({srasShift}) &nbsp;·&nbsp;
              <strong>LRAS:</strong> Y = 100 + ({lrasShift})
            </p>
            <p>
              <strong>Equilibrio corto plazo</strong> (AD = SRAS): 2Y = 300 + AD + SRAS
              → Y* = <strong>{eq.Y_sr.toFixed(1).replace('.', ',')}</strong>, P* ={' '}
              <strong>{eq.P_sr.toFixed(1).replace('.', ',')}</strong>.
            </p>
            <p>
              <strong>Equilibrio largo plazo</strong> (AD = LRAS): Y** = 100 + LRAS ={' '}
              <strong>{eq.Y_lr.toFixed(1).replace('.', ',')}</strong>, P** ={' '}
              <strong>{eq.P_lr.toFixed(1).replace('.', ',')}</strong>.
            </p>
          </div>
        </details>
      </div>

      <style>{`
        .adas__presets {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .adas__slider-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
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
        .adas__interp p { margin: 0 0 0.4em; }
        .adas__interp p:last-child { margin-bottom: 0; }
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
   ========================================================= */
function ADASChart({
  ad,
  sras,
  lras,
  Y_sr,
  P_sr,
  Y_lr,
  P_lr,
}: {
  ad: number;
  sras: number;
  lras: number;
  Y_sr: number;
  P_sr: number;
  Y_lr: number;
  P_lr: number;
}) {
  // Viewbox 600 × 400 with margins.
  const W = 600;
  const H = 400;
  const ML = 60; // left margin
  const MR = 80; // right margin (room for curve labels)
  const MT = 30;
  const MB = 50;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;

  // Domain: Y ∈ [0, 250], P ∈ [0, 250]
  const Y_MIN = 0;
  const Y_MAX = 250;
  const P_MIN = 0;
  const P_MAX = 250;

  const xOf = (y: number) => ML + ((y - Y_MIN) / (Y_MAX - Y_MIN)) * innerW;
  const yOf = (p: number) => MT + innerH - ((p - P_MIN) / (P_MAX - P_MIN)) * innerH;

  // AD: P = 200 − Y + ad  →  endpoints clipped to domain.
  // At Y = 0:   P = 200 + ad
  // At Y = 250: P = -50 + ad
  // We'll just clip with the helper.
  const adP = (y: number) => 200 - y + ad;
  const srasP = (y: number) => y - 100 - sras;

  // Compute clipped polyline endpoints inside the visible domain.
  const adLine = clipLine(adP, Y_MIN, Y_MAX, P_MIN, P_MAX);
  const srasLine = clipLine(srasP, Y_MIN, Y_MAX, P_MIN, P_MAX);
  const lrasX = xOf(100 + lras);

  // Curve labels (anchor at right endpoint of each curve when visible).
  const adLabel = adLine ? { x: xOf(adLine.x2) + 6, y: yOf(adLine.y2) } : null;
  const srasLabel = srasLine ? { x: xOf(srasLine.x2) + 6, y: yOf(srasLine.y2) - 4 } : null;
  const lrasLabel = { x: lrasX + 6, y: MT + 14 };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      class="adas__chart"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Modelo AD-AS"
    >
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

      {/* Tick at Y = 100 (potential reference) */}
      <line
        x1={xOf(100)}
        y1={MT + innerH}
        x2={xOf(100)}
        y2={MT + innerH + 4}
        stroke="var(--color-ink-mute)"
      />
      <text
        x={xOf(100)}
        y={MT + innerH + 18}
        text-anchor="middle"
        font-family="var(--font-mono)"
        font-size="11"
        fill="var(--color-ink-mute)"
      >
        100
      </text>
      <line
        x1={ML - 4}
        y1={yOf(100)}
        x2={ML}
        y2={yOf(100)}
        stroke="var(--color-ink-mute)"
      />
      <text
        x={ML - 8}
        y={yOf(100) + 4}
        text-anchor="end"
        font-family="var(--font-mono)"
        font-size="11"
        fill="var(--color-ink-mute)"
      >
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
        <text
          x={adLabel.x}
          y={adLabel.y}
          font-family="var(--font-serif)"
          font-size="14"
          font-style="italic"
          fill="var(--color-terra)"
          font-weight="600"
        >
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
        <text
          x={srasLabel.x}
          y={srasLabel.y}
          font-family="var(--font-serif)"
          font-size="14"
          font-style="italic"
          fill="var(--color-mustard-deep)"
          font-weight="600"
        >
          SRAS
        </text>
      )}

      {/* LRAS vertical */}
      <line
        x1={lrasX}
        y1={MT}
        x2={lrasX}
        y2={MT + innerH}
        stroke="var(--color-ink)"
        stroke-width="2"
        stroke-dasharray="6 5"
      />
      <text
        x={lrasLabel.x}
        y={lrasLabel.y}
        font-family="var(--font-serif)"
        font-size="14"
        font-style="italic"
        fill="var(--color-ink)"
        font-weight="600"
      >
        LRAS
      </text>

      {/* Equilibria — short run */}
      {inDomain(Y_sr, P_sr, Y_MIN, Y_MAX, P_MIN, P_MAX) && (
        <>
          <circle cx={xOf(Y_sr)} cy={yOf(P_sr)} r="6" fill="var(--color-terra)" stroke="var(--color-paper)" stroke-width="2" />
          <text
            x={xOf(Y_sr) + 10}
            y={yOf(P_sr) - 8}
            font-family="var(--font-serif)"
            font-size="13"
            font-style="italic"
            fill="var(--color-terra)"
            font-weight="600"
          >
            E*
          </text>
        </>
      )}

      {/* Equilibria — long run */}
      {inDomain(Y_lr, P_lr, Y_MIN, Y_MAX, P_MIN, P_MAX) && (
        <>
          <circle cx={xOf(Y_lr)} cy={yOf(P_lr)} r="5" fill="var(--color-mustard-deep)" stroke="var(--color-paper)" stroke-width="2" />
          <text
            x={xOf(Y_lr) + 10}
            y={yOf(P_lr) + 18}
            font-family="var(--font-serif)"
            font-size="13"
            font-style="italic"
            fill="var(--color-mustard-deep)"
            font-weight="600"
          >
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
  // Linear function: gather candidate intersection points with each box edge.
  const pts: Array<{ y: number; p: number }> = [];

  // Vertical edges Y = Ymin, Y = Ymax.
  for (const y of [Ymin, Ymax]) {
    const p = f(y);
    if (p >= Pmin && p <= Pmax) pts.push({ y, p });
  }

  // Horizontal edges P = Pmin, P = Pmax. Solve f(y) = P for y.
  // f is linear in y with slope ±1, so this is easy. But we keep generic.
  // Approximate slope by sampling two points.
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
  // Sort by Y and take the extremes.
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
   Interpretation helpers.
   ========================================================= */
function fmtDelta(d: number): string {
  if (Math.abs(d) < 0.05) return 'Sin variación';
  const sign = d > 0 ? '+' : '';
  return `${sign}${d.toFixed(1).replace('.', ',')}`;
}

function gapInterpretation(gap: number): string {
  if (Math.abs(gap) < 0.05) return 'Pleno empleo: la economía produce al nivel potencial.';
  if (gap > 0) return 'Brecha expansiva: la producción supera el potencial; presión inflacionista.';
  return 'Brecha recesiva: la producción está por debajo del potencial; desempleo cíclico.';
}

function interpretAD(ad: number): string {
  if (ad === 0) return 'Demanda agregada estable: ni expansión ni contracción.';
  if (ad > 0)
    return 'Expansión de la demanda agregada: política fiscal expansiva, optimismo de consumidores y empresas, aumento del gasto público o subida de las exportaciones netas. Empuja P y Y al alza a corto plazo.';
  return 'Contracción de la demanda agregada: ajuste fiscal, pesimismo, restricción del crédito o caída de las exportaciones. Empuja P y Y a la baja a corto plazo.';
}

function interpretSRAS(sras: number): string {
  if (sras === 0) return 'Oferta agregada de corto plazo estable.';
  if (sras > 0)
    return 'Choque positivo de oferta de corto plazo: caída de los costes (energía barata, salarios moderados, mejora de la productividad). P baja y Y sube.';
  return 'Choque negativo de oferta (estanflación): subida de los costes productivos (energía, salarios, inputs importados). P sube y Y cae.';
}

function interpretLRAS(lras: number): string {
  if (lras === 0) return 'Producción potencial estable: stock de capital, trabajo y tecnología sin cambios.';
  if (lras > 0)
    return 'Aumento de la producción potencial: más capital, más fuerza de trabajo, mejor tecnología o reformas estructurales. Crecimiento sostenido a largo plazo.';
  return 'Caída de la producción potencial: destrucción de capital, pérdida de población activa, regresión tecnológica. Menor capacidad estructural.';
}
