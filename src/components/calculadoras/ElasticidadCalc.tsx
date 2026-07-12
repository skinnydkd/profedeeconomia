/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import {
  analyze,
  type ElasticityKind,
  type PricePoint,
  type RevenueDirection,
} from '../../lib/calc/elasticidad';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (P, Q, E, IT, €, %, subscripts) is not translated. Mirrors the sibling
 * calculators.
 */
export const COPY = {
  es: {
    precioInicial: 'Precio inicial (P₁)',
    cantidadInicial: 'Cantidad inicial (Q₁)',
    precioFinal: 'Precio final (P₂)',
    cantidadFinal: 'Cantidad final (Q₂)',
    udsUnit: 'uds',
    dosPuntosDistintos: 'Introduce dos puntos distintos de la curva de demanda.',
    precioMedioCero: 'El precio medio no puede ser cero.',
    cantidadMediaCero: 'La cantidad media no puede ser cero.',
    elasticidadLabel: 'Elasticidad (método del punto medio)',
    variacionCantidad: 'Variación de la cantidad',
    variacionPrecio: 'Variación del precio',
    clasificacion: 'Clasificación',
    alSubirPrecio: 'Al subir el precio, el ingreso total',
    itAntes: 'IT antes (precio menor)',
    itDespues: 'IT después (precio mayor)',
    dosPreciosAnalizar: 'Introduce dos precios distintos para analizar el efecto sobre los ingresos.',
    chartAria: 'Curva de demanda con los dos puntos introducidos',
    comoSeCalcula: 'Cómo se calcula',
    metodoTitle: 'Método del punto medio (elasticidad arco):',
    metodoDesc: ' usa la media de los dos valores como base, por lo que el resultado es el mismo suba o baje el precio.',
    signoNegativo: 'El signo es negativo porque cantidad y precio se mueven en sentidos opuestos (ley de la demanda). Para clasificar se usa el valor absoluto |E|: |E| > 1 elástica, |E| < 1 inelástica, |E| = 1 unitaria.',
    itTitle: 'Ingreso total',
    itDesc: ' (IT = P · Q): si la demanda es elástica, al subir el precio el IT baja; si es inelástica, el IT sube; si es unitaria, no cambia.',
    aquiPasaDe: (before: string, after: string) => ` Aquí pasa de ${before} a ${after}.`,
    dosPreciosVer: ' Introduce dos precios distintos para ver el efecto sobre los ingresos.',
    kindShort: {
      elastica: 'elástica',
      inelastica: 'inelástica',
      unitaria: 'unitaria',
      perfectamente_elastica: 'perf. elástica',
      perfectamente_inelastica: 'perf. inelástica',
    },
    kindLabel: {
      elastica: 'Demanda elástica',
      inelastica: 'Demanda inelástica',
      unitaria: 'Demanda de elasticidad unitaria',
      perfectamente_elastica: 'Demanda perfectamente elástica',
      perfectamente_inelastica: 'Demanda perfectamente inelástica',
    },
    revWord: {
      sube: 'sube',
      baja: 'baja',
      igual: 'no cambia',
    },
  },
  ca: {
    precioInicial: 'Preu inicial (P₁)',
    cantidadInicial: 'Quantitat inicial (Q₁)',
    precioFinal: 'Preu final (P₂)',
    cantidadFinal: 'Quantitat final (Q₂)',
    udsUnit: 'unitats',
    dosPuntosDistintos: 'Introduïx dos punts distints de la corba de demanda.',
    precioMedioCero: 'El preu mitjà no pot ser zero.',
    cantidadMediaCero: 'La quantitat mitjana no pot ser zero.',
    elasticidadLabel: 'Elasticitat (mètode del punt mig)',
    variacionCantidad: 'Variació de la quantitat',
    variacionPrecio: 'Variació del preu',
    clasificacion: 'Classificació',
    alSubirPrecio: "En pujar el preu, l'ingrés total",
    itAntes: 'IT abans (preu menor)',
    itDespues: 'IT després (preu major)',
    dosPreciosAnalizar: "Introduïx dos preus distints per a analitzar l'efecte sobre els ingressos.",
    chartAria: 'Corba de demanda amb els dos punts introduïts',
    comoSeCalcula: 'Com es calcula',
    metodoTitle: 'Mètode del punt mig (elasticitat arc):',
    metodoDesc: ' usa la mitjana dels dos valors com a base, de manera que el resultat és el mateix tant si puja com si baixa el preu.',
    signoNegativo: "El signe és negatiu perquè quantitat i preu es mouen en sentits oposats (llei de la demanda). Per a classificar s'usa el valor absolut |E|: |E| > 1 elàstica, |E| < 1 inelàstica, |E| = 1 unitària.",
    itTitle: 'Ingrés total',
    itDesc: " (IT = P · Q): si la demanda és elàstica, en pujar el preu l'IT baixa; si és inelàstica, l'IT puja; si és unitària, no canvia.",
    aquiPasaDe: (before: string, after: string) => ` Ací passa de ${before} a ${after}.`,
    dosPreciosVer: " Introduïx dos preus distints per a veure l'efecte sobre els ingressos.",
    kindShort: {
      elastica: 'elàstica',
      inelastica: 'inelàstica',
      unitaria: 'unitària',
      perfectamente_elastica: 'perf. elàstica',
      perfectamente_inelastica: 'perf. inelàstica',
    },
    kindLabel: {
      elastica: 'Demanda elàstica',
      inelastica: 'Demanda inelàstica',
      unitaria: "Demanda d'elasticitat unitària",
      perfectamente_elastica: 'Demanda perfectament elàstica',
      perfectamente_inelastica: 'Demanda perfectament inelàstica',
    },
    revWord: {
      sube: 'puja',
      baja: 'baixa',
      igual: 'no canvia',
    },
  },
} as const;

interface Props { locale?: Locale }

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
export default function ElasticidadCalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [p1, setP1] = useState<number>(4);
  const [q1, setQ1] = useState<number>(120);
  const [p2, setP2] = useState<number>(6);
  const [q2, setQ2] = useState<number>(80);

  const result = useMemo(() => {
    const a: PricePoint = { P: p1, Q: q1 };
    const b: PricePoint = { P: p2, Q: q2 };

    // Same point on both axes, or zero average price/quantity → not analysable.
    if (p1 === p2 && q1 === q2) {
      return { valido: false as const, mensaje: c.dosPuntosDistintos };
    }
    if (p1 + p2 === 0) {
      return { valido: false as const, mensaje: c.precioMedioCero };
    }
    if (q1 + q2 === 0) {
      return { valido: false as const, mensaje: c.cantidadMediaCero };
    }

    try {
      return { valido: true as const, ...analyze(a, b) };
    } catch (e) {
      return { valido: false as const, mensaje: (e as Error).message };
    }
  }, [p1, q1, p2, q2, c]);

  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.precioInicial}</span>
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
          <span class="calc__label">{c.cantidadInicial}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={5}
              value={q1}
              onInput={(e) => setQ1(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.udsUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.precioFinal}</span>
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
          <span class="calc__label">{c.cantidadFinal}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              step={5}
              value={q2}
              onInput={(e) => setQ2(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.udsUnit}</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">{c.elasticidadLabel}</span>
              <span class="calc__metric-value">{fmtE(result.arc.E)}</span>
              <span class="calc__metric-detail">{c.kindLabel[result.kind]}</span>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.variacionCantidad}</span>
                <span class="calc__metric-mini-value">{fmtPct(result.arc.pctChangeQ)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.variacionPrecio}</span>
                <span class="calc__metric-mini-value">{fmtPct(result.arc.pctChangeP)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.clasificacion}</span>
                <span class="calc__metric-mini-value">{c.kindShort[result.kind]}</span>
              </div>
            </div>

            {result.revenue ? (
              <div class="el__revenue">
                <div class="el__revenue-head">
                  {c.alSubirPrecio}{' '}
                  <strong class={revClass(result.revenue.direction)}>
                    {c.revWord[result.revenue.direction]}
                  </strong>
                </div>
                <div class="calc__metric-grid">
                  <div class="calc__metric-mini">
                    <span class="calc__metric-mini-label">{c.itAntes}</span>
                    <span class="calc__metric-mini-value">{fmtMoney(result.revenue.before)}</span>
                  </div>
                  <div class="calc__metric-mini">
                    <span class="calc__metric-mini-label">{c.itDespues}</span>
                    <span class={`calc__metric-mini-value ${result.revenue.change >= 0 ? 'ok' : 'fail'}`}>
                      {fmtMoney(result.revenue.after)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div class="el__revenue">
                <div class="el__revenue-head">
                  {c.dosPreciosAnalizar}
                </div>
              </div>
            )}

            <DemandChart
              a={{ P: p1, Q: q1 }}
              b={{ P: p2, Q: q2 }}
              kind={result.kind}
            />

            <details class="calc__details">
              <summary>{c.comoSeCalcula}</summary>
              <div class="calc__formula">
                <p>
                  <strong>{c.metodoTitle}</strong>{c.metodoDesc}
                </p>
                <p>
                  E = ( ΔQ / Q̄ ) / ( ΔP / P̄ ) = ({fmtPct(result.arc.pctChangeQ)}) / ({fmtPct(result.arc.pctChangeP)}) ={' '}
                  <strong>{fmtE(result.arc.E)}</strong>
                </p>
                <p>
                  {c.signoNegativo}
                </p>
                <p>
                  <strong>{c.itTitle}</strong>{c.itDesc}
                  {result.revenue
                    ? c.aquiPasaDe(fmtMoney(result.revenue.before), fmtMoney(result.revenue.after))
                    : c.dosPreciosVer}
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
