/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (CF, P, CVu, Q, €) is not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    cfLabel: 'Costes fijos mensuales (CF)',
    cfUnit: '€/mes',
    precioLabel: 'Precio de venta unitario (P)',
    unidadUnit: '€/unidad',
    cvuLabel: 'Coste variable unitario (CVu)',
    demandaLabel: 'Demanda prevista (opcional)',
    demandaUnit: 'unidades/mes',
    avisoMargen: 'El precio debe ser mayor que el coste variable unitario para tener punto muerto.',
    puntoMuerto: 'Punto muerto',
    facturacion: (v: string) => `≈ ${v} de facturación mensual`,
    margenContribucion: 'Margen contribución unitario',
    beneficioPrevisto: 'Beneficio previsto (con la demanda)',
    margenSeguridad: 'Margen de seguridad',
    comoSeCalcula: 'Cómo se calcula',
    formulaMargen: 'Margen de contribución unitario',
    formulaPuntoMuerto: 'Punto muerto',
    unidades: 'unidades',
    explicacionSeguridad: 'El margen de seguridad indica cuánto puede caer la demanda antes de entrar en pérdidas. En este caso:',
    sobran: 'sobran',
    faltan: 'faltan',
    unidadesHastaPM: 'unidades para llegar al punto muerto.',
    chartAria: 'Gráfico del punto muerto con las rectas de ingresos, costes totales y costes fijos',
    chartEjeQ: 'Q (uds)',
    chartIngresos: 'Ingresos',
    chartCostesTotales: 'C. totales',
    chartCostesFijos: 'C. fijos',
  },
  ca: {
    cfLabel: 'Costos fixos mensuals (CF)',
    cfUnit: '€/mes',
    precioLabel: 'Preu de venda unitari (P)',
    unidadUnit: '€/unitat',
    cvuLabel: 'Cost variable unitari (CVu)',
    demandaLabel: 'Demanda prevista (opcional)',
    demandaUnit: 'unitats/mes',
    avisoMargen: 'El preu ha de ser major que el cost variable unitari per a tindre punt mort.',
    puntoMuerto: 'Punt mort',
    facturacion: (v: string) => `≈ ${v} de facturació mensual`,
    margenContribucion: 'Marge de contribució unitari',
    beneficioPrevisto: 'Benefici previst (amb la demanda)',
    margenSeguridad: 'Marge de seguretat',
    comoSeCalcula: 'Com es calcula',
    formulaMargen: 'Marge de contribució unitari',
    formulaPuntoMuerto: 'Punt mort',
    unidades: 'unitats',
    explicacionSeguridad: "El marge de seguretat indica quant pot caure la demanda abans d'entrar en pèrdues. En este cas:",
    sobran: 'sobren',
    faltan: 'falten',
    unidadesHastaPM: 'unitats per a arribar al punt mort.',
    chartAria: "Gràfic del punt mort amb les rectes d'ingressos, costos totals i costos fixos",
    chartEjeQ: 'Q (unitats)',
    chartIngresos: 'Ingressos',
    chartCostesTotales: 'C. totals',
    chartCostesFijos: 'C. fixos',
  },
} as const;

interface Props { locale?: Locale }

/**
 * Punto muerto / umbral de rentabilidad calculator.
 *
 *   Q* = CF / (P − CVu)
 *
 * Useful for the capstone project when each team needs to estimate
 * the break-even of their proposed business.
 */
export default function PuntoMuertoCalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [cf, setCf] = useState<number>(3000);
  const [precio, setPrecio] = useState<number>(1.5);
  const [cvu, setCvu] = useState<number>(0.5);
  const [demandaPrevista, setDemandaPrevista] = useState<number>(4000);

  const result = useMemo(() => {
    const margen = precio - cvu;
    if (margen <= 0) {
      return {
        valido: false,
        mensaje: c.avisoMargen,
        margen,
      };
    }
    const Q = cf / margen;
    const facturacionEnPM = Q * precio;
    const beneficioPrevisto = demandaPrevista * margen - cf;
    const margenSeguridad = demandaPrevista > 0 ? ((demandaPrevista - Q) / demandaPrevista) * 100 : 0;
    return {
      valido: true,
      margen,
      Q,
      facturacionEnPM,
      beneficioPrevisto,
      margenSeguridad,
      cubrePuntoMuerto: demandaPrevista >= Q,
    };
  }, [cf, precio, cvu, demandaPrevista, c]);
  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.cfLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={cf}
              onInput={(e) => setCf(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.cfUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.precioLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={0.1}
              value={precio}
              onInput={(e) => setPrecio(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.unidadUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.cvuLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={0.1}
              value={cvu}
              onInput={(e) => setCvu(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.unidadUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.demandaLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={demandaPrevista}
              onInput={(e) => setDemandaPrevista(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.demandaUnit}</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">{c.puntoMuerto}</span>
              <span class="calc__metric-value">{Math.ceil(result.Q!).toLocaleString('es-ES')}</span>
              <span class="calc__metric-unit">{c.demandaUnit}</span>
              <span class="calc__metric-detail">
                {c.facturacion(fmtMoney(result.facturacionEnPM!))}
              </span>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.margenContribucion}</span>
                <span class="calc__metric-mini-value">{fmtMoney(result.margen!)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.beneficioPrevisto}</span>
                <span class={`calc__metric-mini-value ${result.beneficioPrevisto! >= 0 ? 'ok' : 'fail'}`}>
                  {fmtMoney(result.beneficioPrevisto!)}/mes
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.margenSeguridad}</span>
                <span class={`calc__metric-mini-value ${result.cubrePuntoMuerto ? 'ok' : 'fail'}`}>
                  {result.margenSeguridad!.toFixed(1).replace('.', ',')} %
                </span>
              </div>
            </div>

            <PuntoMuertoChart
              cf={cf}
              precio={precio}
              cvu={cvu}
              demanda={demandaPrevista}
              Q={result.Q!}
              locale={locale}
            />

            <details class="calc__details">
              <summary>{c.comoSeCalcula}</summary>
              <div class="calc__formula">
                <p><strong>{c.formulaMargen}</strong> = P − CVu = {fmtMoney(precio)} − {fmtMoney(cvu)} = <strong>{fmtMoney(result.margen!)}</strong></p>
                <p><strong>{c.formulaPuntoMuerto}</strong> = CF / (P − CVu) = {fmtMoney(cf)} / {fmtMoney(result.margen!)} = <strong>{Math.ceil(result.Q!).toLocaleString('es-ES')} {c.unidades}</strong></p>
                <p>{c.explicacionSeguridad} {result.margenSeguridad! >= 0 ? c.sobran : c.faltan} {Math.abs(demandaPrevista - result.Q!).toFixed(0)} {c.unidadesHastaPM}</p>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Break-even SVG chart ──────────────────────────────────────────────────
 * Classic break-even diagram: total revenue (IT = P·Q), total cost
 * (CT = CF + CVu·Q) and fixed cost (CF) lines, with the break-even point at
 * their intersection and the loss / profit regions shaded. Mirrors the SVG
 * style used by EquilibrioCalc for visual consistency.
 */
interface ChartProps {
  cf: number;
  precio: number;
  cvu: number;
  demanda: number;
  Q: number;
  locale: Locale;
}

function PuntoMuertoChart({ cf, precio, cvu, demanda, Q, locale }: ChartProps) {
  const c = COPY[locale];
  const W = 360;
  const H = 280;
  const ML = 52;
  const MR = 16;
  const MT = 18;
  const MB = 36;
  const iW = W - ML - MR;
  const iH = H - MT - MB;

  // Q domain: comfortably past both the break-even and the forecast demand.
  const maxQ = Math.max(Q, demanda, 1) * 1.35;
  // € domain: revenue is the highest line in the visible range (P > CVu here).
  const maxMoney = Math.max(precio * maxQ, cf + cvu * maxQ, 1) * 1.05;

  const xOf = (q: number) => ML + (q / maxQ) * iW;
  const yOf = (m: number) => MT + iH - (m / maxMoney) * iH;

  // Break-even money value (IT and CT coincide here).
  const moneyPM = precio * Q;
  const pmInRange = Q <= maxQ;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxMoney / ticks) * i);
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxQ / ticks) * i);

  const demandaInRange = demanda > 0 && demanda <= maxQ;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={c.chartAria}
      style={{
        width: '100%',
        height: 'auto',
        background: 'var(--color-bg, #FBF6EC)',
        border: '1px solid var(--color-line, #E5D4BD)',
        borderRadius: '6px',
        marginTop: '1.4rem',
      }}
    >
      {/* Loss region (left of break-even): between CT above and IT below */}
      {pmInRange && (
        <polygon
          points={`${xOf(0)},${yOf(0)} ${xOf(Q)},${yOf(moneyPM)} ${xOf(0)},${yOf(cf)}`}
          fill="#B83A3A" fill-opacity="0.10"
        />
      )}
      {/* Profit region (right of break-even): between IT above and CT below */}
      {pmInRange && (
        <polygon
          points={`${xOf(Q)},${yOf(moneyPM)} ${xOf(maxQ)},${yOf(precio * maxQ)} ${xOf(maxQ)},${yOf(cf + cvu * maxQ)}`}
          fill="var(--color-terra, #C44E2C)" fill-opacity="0.10"
        />
      )}

      {/* Grid lines */}
      {yTicks.map((m) => (
        <line
          x1={ML} y1={yOf(m)} x2={ML + iW} y2={yOf(m)}
          stroke="var(--color-line-soft, #EFE2CB)" stroke-width="1" stroke-dasharray="3 4"
        />
      ))}

      {/* Axes */}
      <line x1={ML} y1={MT + iH} x2={ML + iW} y2={MT + iH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />
      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />

      {/* Y tick labels (€) */}
      {yTicks.map((m) => (
        <text x={ML - 6} y={yOf(m) + 4} text-anchor="end"
          font-family="var(--font-mono)" font-size="9" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(m)}
        </text>
      ))}

      {/* X tick labels (Q) */}
      {xTicks.map((q) => (
        <text x={xOf(q)} y={MT + iH + 15} text-anchor="middle"
          font-family="var(--font-mono)" font-size="9" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(q)}
        </text>
      ))}

      {/* Axis labels */}
      <text x={ML - 40} y={MT + 6} font-family="var(--font-sans)" font-size="11" font-style="italic"
        fill="var(--color-ink-soft, #5C4A3D)">€</text>
      <text x={ML + iW} y={H - 4} text-anchor="end" font-family="var(--font-sans)" font-size="11"
        font-style="italic" fill="var(--color-ink-soft, #5C4A3D)">{c.chartEjeQ}</text>

      {/* Fixed cost line (CF) — mustard dashed */}
      <line x1={xOf(0)} y1={yOf(cf)} x2={xOf(maxQ)} y2={yOf(cf)}
        stroke="var(--color-mustard-deep, #A87A2A)" stroke-width="1.6" stroke-dasharray="5 4" />
      <text x={xOf(maxQ) - 2} y={yOf(cf) - 5} text-anchor="end"
        font-family="var(--font-sans)" font-size="10" font-weight="700"
        fill="var(--color-mustard-deep, #A87A2A)">CF</text>

      {/* Total cost line (CT = CF + CVu·Q) — teal */}
      <line x1={xOf(0)} y1={yOf(cf)} x2={xOf(maxQ)} y2={yOf(cf + cvu * maxQ)}
        stroke="var(--color-eco1, #1F6E6E)" stroke-width="2.5" />
      <text x={xOf(maxQ) - 2} y={yOf(cf + cvu * maxQ) + 14} text-anchor="end"
        font-family="var(--font-sans)" font-size="11" font-weight="700"
        fill="var(--color-eco1, #1F6E6E)">CT</text>

      {/* Total revenue line (IT = P·Q) — terracota */}
      <line x1={xOf(0)} y1={yOf(0)} x2={xOf(maxQ)} y2={yOf(precio * maxQ)}
        stroke="var(--color-terra, #C44E2C)" stroke-width="2.5" />
      <text x={xOf(maxQ) - 2} y={yOf(precio * maxQ) - 5} text-anchor="end"
        font-family="var(--font-sans)" font-size="11" font-weight="700"
        fill="var(--color-terra-deep, #9C3A1C)">IT</text>

      {/* Demand forecast — vertical guide */}
      {demandaInRange && (
        <>
          <line x1={xOf(demanda)} y1={MT} x2={xOf(demanda)} y2={MT + iH}
            stroke="var(--color-ink-mute, #8A7868)" stroke-width="1" stroke-dasharray="2 3" />
          <text x={xOf(demanda)} y={MT - 4} text-anchor="middle"
            font-family="var(--font-mono)" font-size="8.5" fill="var(--color-ink-mute, #8A7868)">
            demanda
          </text>
        </>
      )}

      {/* Break-even point */}
      {pmInRange && (
        <>
          <line x1={ML} y1={yOf(moneyPM)} x2={xOf(Q)} y2={yOf(moneyPM)}
            stroke="var(--color-ink-mute, #8A7868)" stroke-width="1" stroke-dasharray="3 3" />
          <line x1={xOf(Q)} y1={MT + iH} x2={xOf(Q)} y2={yOf(moneyPM)}
            stroke="var(--color-ink-mute, #8A7868)" stroke-width="1" stroke-dasharray="3 3" />
          <circle cx={xOf(Q)} cy={yOf(moneyPM)} r="5"
            fill="var(--color-mustard, #D4A24C)" stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />
          <text x={xOf(Q) + 8} y={yOf(moneyPM) + 14}
            font-family="var(--font-mono)" font-size="10" fill="var(--color-ink, #2A1F18)">
            PM ({fmtAxis(Q)})
          </text>
        </>
      )}

      {/* Legend */}
      <rect x={ML + 6} y={MT + 4} width="66" height="50" rx="3"
        fill="var(--color-paper, #FFFFFF)" stroke="var(--color-line, #E5D4BD)" stroke-width="1" />
      <line x1={ML + 12} y1={MT + 14} x2={ML + 26} y2={MT + 14}
        stroke="var(--color-terra, #C44E2C)" stroke-width="2.5" />
      <text x={ML + 30} y={MT + 18} font-family="var(--font-sans)" font-size="9"
        fill="var(--color-ink-soft, #5C4A3D)">{c.chartIngresos}</text>
      <line x1={ML + 12} y1={MT + 28} x2={ML + 26} y2={MT + 28}
        stroke="var(--color-eco1, #1F6E6E)" stroke-width="2.5" />
      <text x={ML + 30} y={MT + 32} font-family="var(--font-sans)" font-size="9"
        fill="var(--color-ink-soft, #5C4A3D)">{c.chartCostesTotales}</text>
      <line x1={ML + 12} y1={MT + 42} x2={ML + 26} y2={MT + 42}
        stroke="var(--color-mustard-deep, #A87A2A)" stroke-width="1.6" stroke-dasharray="5 4" />
      <text x={ML + 30} y={MT + 46} font-family="var(--font-sans)" font-size="9"
        fill="var(--color-ink-soft, #5C4A3D)">{c.chartCostesFijos}</text>
    </svg>
  );
}

function fmtAxis(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: n >= 100 ? 0 : 1 });
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
