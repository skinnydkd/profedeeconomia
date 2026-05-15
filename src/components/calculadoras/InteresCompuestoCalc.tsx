/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * Interés compuesto con aportaciones periódicas mensuales.
 *
 * Cada mes:
 *   saldo_{t+1} = saldo_t * (1 + r/12) + aportación_mensual
 *
 * El gráfico muestra dos series anuales:
 *   – aportaciones acumuladas (mustard)
 *   – capital total (terra, grueso)
 * de forma que la separación entre ambas líneas visualiza el efecto del
 * interés compuesto a lo largo del tiempo.
 */

type Preset = {
  label: string;
  capitalInicial: number;
  aportacionMensual: number;
  tipoAnual: number;
  anios: number;
  note: string;
};

const PRESETS: Preset[] = [
  {
    label: 'Plan de pensiones 30 años',
    capitalInicial: 1000,
    aportacionMensual: 200,
    tipoAnual: 6,
    anios: 30,
    note: 'Ahorro a largo plazo con rentabilidad media de mercado.',
  },
  {
    label: 'Hucha agresiva',
    capitalInicial: 5000,
    aportacionMensual: 500,
    tipoAnual: 4,
    anios: 20,
    note: 'Aportación alta con rentabilidad moderada.',
  },
];

export default function InteresCompuestoCalc() {
  const [capitalInicial, setCapitalInicial] = useState<number>(1000);
  const [aportacionMensual, setAportacionMensual] = useState<number>(100);
  const [tipoAnual, setTipoAnual] = useState<number>(5);
  const [anios, setAnios] = useState<number>(30);

  const result = useMemo(() => {
    if (anios <= 0 || anios > 70) {
      return {
        valido: false as const,
        mensaje: 'El horizonte temporal debe estar entre 1 y 70 años.',
      };
    }
    if (tipoAnual <= -100) {
      return { valido: false as const, mensaje: 'El tipo de interés no es válido.' };
    }
    const rMensual = tipoAnual / 100 / 12;
    const meses = Math.round(anios * 12);

    // Trayectoria mes a mes; guardamos series anuales para el gráfico.
    let saldo = capitalInicial;
    let aportado = capitalInicial;
    const serieCapital: number[] = [capitalInicial];
    const serieAportado: number[] = [capitalInicial];

    for (let m = 1; m <= meses; m++) {
      saldo = saldo * (1 + rMensual) + aportacionMensual;
      aportado += aportacionMensual;
      if (m % 12 === 0) {
        serieCapital.push(saldo);
        serieAportado.push(aportado);
      }
    }

    const capitalFinal = saldo;
    const totalAportado = aportado;
    const intereses = capitalFinal - totalAportado;
    const ratio = totalAportado > 0 ? intereses / totalAportado : 0;

    return {
      valido: true as const,
      capitalFinal,
      totalAportado,
      intereses,
      ratio,
      serieCapital,
      serieAportado,
    };
  }, [capitalInicial, aportacionMensual, tipoAnual, anios]);

  function reset() {
    setCapitalInicial(1000);
    setAportacionMensual(100);
    setTipoAnual(5);
    setAnios(30);
  }

  function applyPreset(p: Preset) {
    setCapitalInicial(p.capitalInicial);
    setAportacionMensual(p.aportacionMensual);
    setTipoAnual(p.tipoAnual);
    setAnios(p.anios);
  }

  return (
    <div class="calc">
      <div class="calc__sub">Presets</div>
      <div class="ic__presets">
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

      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Capital inicial</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={capitalInicial}
              onInput={(e) =>
                setCapitalInicial(parseFloat((e.target as HTMLInputElement).value) || 0)
              }
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Aportación mensual</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={25}
              value={aportacionMensual}
              onInput={(e) =>
                setAportacionMensual(parseFloat((e.target as HTMLInputElement).value) || 0)
              }
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Tipo de interés anual</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-50}
              step={0.25}
              value={tipoAnual}
              onInput={(e) => setTipoAnual(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">% anual</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Años</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={1}
              max={70}
              step={1}
              value={anios}
              onInput={(e) => setAnios(parseInt((e.target as HTMLInputElement).value, 10) || 0)}
            />
            <span class="calc__unit">años</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">Capital final</span>
              <span class="calc__metric-value">{fmtMoney(result.capitalFinal)}</span>
              <span class="calc__metric-detail">
                Al cabo de {anios} años con {fmtMoney(aportacionMensual)} al mes al{' '}
                {tipoAnual.toFixed(2).replace('.', ',')} % anual.
              </span>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Total aportado</span>
                <span class="calc__metric-mini-value">{fmtMoney(result.totalAportado)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Intereses ganados</span>
                <span class="calc__metric-mini-value ok">{fmtMoney(result.intereses)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Ratio interés / aportado</span>
                <span class="calc__metric-mini-value">
                  {(result.ratio * 100).toFixed(1).replace('.', ',')} %
                </span>
              </div>
            </div>

            <ICChart
              serieCapital={result.serieCapital}
              serieAportado={result.serieAportado}
              anios={anios}
            />

            <details class="calc__details">
              <summary>Cómo se calcula</summary>
              <div class="calc__formula">
                <p>
                  El saldo se actualiza cada mes con el tipo mensual r/12 =
                  {' '}
                  {(tipoAnual / 12).toFixed(4).replace('.', ',')} % y se suma la aportación
                  mensual de {fmtMoney(aportacionMensual)}.
                </p>
                <p>
                  De los <strong>{fmtMoney(result.capitalFinal)}</strong> finales, has aportado{' '}
                  <strong>{fmtMoney(result.totalAportado)}</strong> y los intereses son{' '}
                  <strong>{fmtMoney(result.intereses)}</strong>. Eso significa que cada euro
                  aportado se ha convertido en{' '}
                  <strong>
                    {(result.capitalFinal / Math.max(result.totalAportado, 1))
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                    €
                  </strong>
                  .
                </p>
              </div>
            </details>
          </>
        )}
      </div>

      <style>{`
        .ic__presets {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .ic__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg);
          border: 1px solid var(--color-line);
          border-radius: 6px;
          margin-top: 1.4rem;
        }
        .ic__legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: 0.86rem;
          color: var(--color-ink-soft);
        }
        .ic__legend-swatch {
          display: inline-block;
          width: 18px;
          height: 4px;
          border-radius: 2px;
          margin-right: 0.4em;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}

function ICChart({
  serieCapital,
  serieAportado,
  anios,
}: {
  serieCapital: number[];
  serieAportado: number[];
  anios: number;
}) {
  const W = 600;
  const H = 320;
  const ML = 60;
  const MR = 20;
  const MT = 20;
  const MB = 40;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;

  const maxValue = Math.max(...serieCapital, 1);
  const niceMax = niceCeil(maxValue);

  const xOf = (i: number) => ML + (i / Math.max(serieCapital.length - 1, 1)) * innerW;
  const yOf = (v: number) => MT + innerH - (v / niceMax) * innerH;

  const capitalPath = toPath(serieCapital.map((v, i) => [xOf(i), yOf(v)]));
  const aportadoPath = toPath(serieAportado.map((v, i) => [xOf(i), yOf(v)]));

  // Area between aportado and capital → highlights the compound interest gap.
  const areaPoints = [
    ...serieAportado.map((v, i) => [xOf(i), yOf(v)] as [number, number]),
    ...serieCapital.map((v, i) => [xOf(i), yOf(v)] as [number, number]).reverse(),
  ];
  const areaPath = toPath(areaPoints) + ' Z';

  // Y axis tick marks (4 levels)
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (niceMax / ticks) * i);

  // X axis tick marks — at year multiples that look reasonable
  const xTickStep = anios <= 10 ? 1 : anios <= 25 ? 5 : 10;
  const xTicks: number[] = [];
  for (let y = 0; y <= anios; y += xTickStep) xTicks.push(y);
  if (xTicks[xTicks.length - 1] !== anios) xTicks.push(anios);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        class="ic__chart"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Evolución del capital frente a aportaciones"
      >
        {/* Grid */}
        {yTicks.map((v) => (
          <line
            x1={ML}
            y1={yOf(v)}
            x2={ML + innerW}
            y2={yOf(v)}
            stroke="var(--color-line-soft)"
            stroke-width="1"
            stroke-dasharray="3 4"
          />
        ))}

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

        {/* Y tick labels */}
        {yTicks.map((v) => (
          <text
            x={ML - 8}
            y={yOf(v) + 4}
            text-anchor="end"
            font-family="var(--font-mono)"
            font-size="10"
            fill="var(--color-ink-mute)"
          >
            {fmtCompact(v)}
          </text>
        ))}

        {/* X tick labels */}
        {xTicks.map((y) => (
          <>
            <line
              x1={xOf(y)}
              y1={MT + innerH}
              x2={xOf(y)}
              y2={MT + innerH + 4}
              stroke="var(--color-ink-mute)"
            />
            <text
              x={xOf(y)}
              y={MT + innerH + 18}
              text-anchor="middle"
              font-family="var(--font-mono)"
              font-size="11"
              fill="var(--color-ink-mute)"
            >
              {y}
            </text>
          </>
        ))}

        {/* Axis titles */}
        <text
          x={ML + innerW}
          y={H - 6}
          text-anchor="end"
          font-family="var(--font-sans)"
          font-size="12"
          fill="var(--color-ink-soft)"
          font-style="italic"
        >
          años
        </text>

        {/* Area between aportado and capital (interest gap) */}
        <path d={areaPath} fill="var(--color-terra-soft)" opacity="0.55" />

        {/* Aportado line (mustard) */}
        <path d={aportadoPath} fill="none" stroke="var(--color-mustard-deep)" stroke-width="2.5" />

        {/* Capital line (terra, thicker) */}
        <path d={capitalPath} fill="none" stroke="var(--color-terra)" stroke-width="3" />
      </svg>

      <div class="ic__legend">
        <span>
          <span
            class="ic__legend-swatch"
            style={{ background: 'var(--color-terra)' }}
          />
          Capital total
        </span>
        <span>
          <span
            class="ic__legend-swatch"
            style={{ background: 'var(--color-mustard-deep)' }}
          />
          Aportaciones acumuladas
        </span>
        <span>
          <span
            class="ic__legend-swatch"
            style={{ background: 'var(--color-terra-soft)', height: '10px' }}
          />
          Intereses generados
        </span>
      </div>
    </div>
  );
}

function toPath(points: Array<[number, number] | number[]>): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(' ');
}

function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const norm = v / base;
  let nice: number;
  if (norm <= 1) nice = 1;
  else if (norm <= 2) nice = 2;
  else if (norm <= 5) nice = 5;
  else nice = 10;
  return nice * base;
}

function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} M€`;
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)} k€`;
  return `${n.toFixed(0)} €`;
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
