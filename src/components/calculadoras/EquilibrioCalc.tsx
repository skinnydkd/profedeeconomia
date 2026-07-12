/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import {
  equilibrio,
  evaluarPrecio,
  intervencion,
  type Coef,
} from '../../lib/calc/equilibrio';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (P, Q, Qd, Qs, P*, Q*, €, %, coefficients a/b/c/d) is not translated.
 * Mirrors the sibling calculators.
 *
 * Note: the alias used inside the components is `t` (not `c`), because `c`
 * is already the supply-intercept coefficient/state in this file.
 */
export const COPY = {
  es: {
    curvaDemanda: 'Curva de demanda: Qd = a − b · P',
    interceptoDemanda: 'a (intercepto demanda)',
    pendienteDemanda: 'b (pendiente demanda, >0)',
    curvaOferta: 'Curva de oferta: Qs = c + d · P',
    interceptoOferta: 'c (intercepto oferta)',
    pendienteOferta: 'd (pendiente oferta, >0)',
    sinEquilibrio: 'No hay equilibrio válido con estos parámetros. Comprueba que a > c y que b, d > 0.',
    precioEquilibrio: 'Precio de equilibrio (P*)',
    cantidadEquilibrio: 'Cantidad de equilibrio (Q*)',
    analizarPrecio: 'Analizar un precio',
    precioInspeccionar: 'Precio a inspeccionar (P)',
    introduceCurvas: 'Introduce curvas con equilibrio válido para analizar un precio.',
    qdLabel: 'Qd (cantidad demandada)',
    qsLabel: 'Qs (cantidad ofrecida)',
    excedente: 'Excedente',
    escasez: 'Escasez',
    udsUnit: 'uds',
    hayExcedente: 'Hay excedente: la oferta supera la demanda. Los productores tendrán presión para bajar el precio hacia P*.',
    hayEscasez: 'Hay escasez: la demanda supera la oferta. Los consumidores tendrán presión para subir el precio hacia P*.',
    precioEquilibrioNota: 'Este precio es el de equilibrio. El mercado está despejado.',
    activarIntervencion: 'Activar intervención de precio',
    tipoIntervencion: 'Tipo de intervención',
    opcionMaximo: 'Precio máximo (tope máximo)',
    opcionMinimo: 'Precio mínimo (tope mínimo)',
    precioFijado: 'Precio fijado',
    maxSinEfecto: 'El precio máximo está por encima del precio de equilibrio: no tiene efecto sobre el mercado.',
    minSinEfecto: 'El precio mínimo está por debajo del precio de equilibrio: no tiene efecto sobre el mercado.',
    cantidadIntercambiada: 'Cantidad intercambiada',
    maxEscasez: 'Un precio máximo efectivo genera escasez: los demandantes quieren más de lo que los productores ofrecen a ese precio.',
    minExcedente: 'Un precio mínimo efectivo genera excedente: los productores ofrecen más de lo que los demandantes quieren a ese precio.',
    comoSeCalcula: 'Cómo se calcula',
    formulaEqTitle: 'Equilibrio',
    formulaEqDesc: ': igualamos Qd = Qs → a − b·P* = c + d·P* → P* = (a − c) / (b + d); Q* = a − b·P*.',
    formulaPrecioTitle: 'A un precio P dado',
    formulaPrecioDesc: ': Qd = a − b·P; Qs = c + d·P; exceso = Qs − Qd.',
    formulaMaxTitle: 'Precio máximo',
    formulaMaxDesc: ' (tope): efectivo solo si P_max < P*. Genera escasez = Qd − Qs.',
    formulaMinTitle: 'Precio mínimo',
    formulaMinDesc: ' (suelo): efectivo solo si P_min > P*. Genera excedente = Qs − Qd.',
    chartAria: 'Gráfico de oferta y demanda con punto de equilibrio',
    chartEscasez: 'escasez',
    chartExcedente: 'excedente',
    leyendaDemanda: 'Demanda',
    leyendaOferta: 'Oferta',
  },
  ca: {
    curvaDemanda: 'Corba de demanda: Qd = a − b · P',
    interceptoDemanda: 'a (intercepció demanda)',
    pendienteDemanda: 'b (pendent demanda, >0)',
    curvaOferta: "Corba d'oferta: Qs = c + d · P",
    interceptoOferta: 'c (intercepció oferta)',
    pendienteOferta: 'd (pendent oferta, >0)',
    sinEquilibrio: 'No hi ha equilibri vàlid amb estos paràmetres. Comprova que a > c i que b, d > 0.',
    precioEquilibrio: "Preu d'equilibri (P*)",
    cantidadEquilibrio: "Quantitat d'equilibri (Q*)",
    analizarPrecio: 'Analitzar un preu',
    precioInspeccionar: 'Preu a inspeccionar (P)',
    introduceCurvas: 'Introduïx corbes amb equilibri vàlid per a analitzar un preu.',
    qdLabel: 'Qd (quantitat demandada)',
    qsLabel: 'Qs (quantitat oferida)',
    excedente: 'Excedent',
    escasez: 'Escassetat',
    udsUnit: 'unitats',
    hayExcedente: "Hi ha excedent: l'oferta supera la demanda. Els productors tindran pressió per a abaixar el preu cap a P*.",
    hayEscasez: "Hi ha escassetat: la demanda supera l'oferta. Els consumidors tindran pressió per a pujar el preu cap a P*.",
    precioEquilibrioNota: "Este preu és el d'equilibri. El mercat es buida.",
    activarIntervencion: 'Activar intervenció de preu',
    tipoIntervencion: "Tipus d'intervenció",
    opcionMaximo: 'Preu màxim (límit màxim)',
    opcionMinimo: 'Preu mínim (límit mínim)',
    precioFijado: 'Preu fixat',
    maxSinEfecto: "El preu màxim està per damunt del preu d'equilibri: no té efecte sobre el mercat.",
    minSinEfecto: "El preu mínim està per davall del preu d'equilibri: no té efecte sobre el mercat.",
    cantidadIntercambiada: 'Quantitat intercanviada',
    maxEscasez: 'Un preu màxim efectiu genera escassetat: els demandants volen més del que els productors oferixen a este preu.',
    minExcedente: 'Un preu mínim efectiu genera excedent: els productors oferixen més del que els demandants volen a este preu.',
    comoSeCalcula: 'Com es calcula',
    formulaEqTitle: 'Equilibri',
    formulaEqDesc: ': igualem Qd = Qs → a − b·P* = c + d·P* → P* = (a − c) / (b + d); Q* = a − b·P*.',
    formulaPrecioTitle: 'A un preu P donat',
    formulaPrecioDesc: ': Qd = a − b·P; Qs = c + d·P; excés = Qs − Qd.',
    formulaMaxTitle: 'Preu màxim',
    formulaMaxDesc: ' (sostre): efectiu només si P_max < P*. Genera escassetat = Qd − Qs.',
    formulaMinTitle: 'Preu mínim',
    formulaMinDesc: ' (sòl): efectiu només si P_min > P*. Genera excedent = Qs − Qd.',
    chartAria: "Gràfic d'oferta i demanda amb punt d'equilibri",
    chartEscasez: 'escassetat',
    chartExcedente: 'excedent',
    leyendaDemanda: 'Demanda',
    leyendaOferta: 'Oferta',
  },
} as const;

interface Props { locale?: Locale }

/**
 * Market equilibrium calculator.
 * Model: Qd = a − b·P, Qs = c + d·P  (b, d > 0)
 *
 * Features:
 * - Shows P* and Q*
 * - Evaluates a user-chosen price (shortage / surplus at that price)
 * - Optional price ceiling (tope máximo) or floor (tope mínimo) intervention
 * - SVG supply/demand graph with equilibrium dot, guides, and intervention line
 *
 * Eco 1BACH · Unit 4 / EDMN 2BACH · Unit 3.
 */
export default function EquilibrioCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  // Curve coefficients: Qd = a − b·P, Qs = c + d·P
  const [a, setA] = useState<number>(200);
  const [b, setB] = useState<number>(10);
  const [c, setC] = useState<number>(20);
  const [d, setD] = useState<number>(10);

  // Inspected price
  const [precioInsp, setPrecioInsp] = useState<number>(8);

  // Intervention toggle
  const [topeActivo, setTopeActivo] = useState<boolean>(false);
  const [topeTipo, setTopeTipo] = useState<'maximo' | 'minimo'>('maximo');
  const [topePrecio, setTopePrecio] = useState<number>(7);

  const coef: Coef = { a, b, c, d };

  const eq = useMemo(() => equilibrio(a, b, c, d), [a, b, c, d]);

  const evalInsp = useMemo(() => evaluarPrecio(coef, precioInsp), [a, b, c, d, precioInsp]);

  const evalTope = useMemo(
    () => (topeActivo ? intervencion(coef, topeTipo, topePrecio) : null),
    [a, b, c, d, topeActivo, topeTipo, topePrecio],
  );

  return (
    <div class="calc">
      {/* ── Parameters ── */}
      <div class="eq__section-label">{t.curvaDemanda}</div>
      <div class="calc__form eq__form-row">
        <label class="calc__field">
          <span class="calc__label">{t.interceptoDemanda}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={a}
              onInput={(e) => setA(parseFloat((e.target as HTMLInputElement).value) || 0)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.pendienteDemanda}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0.1} step={1} value={b}
              onInput={(e) => setB(parseFloat((e.target as HTMLInputElement).value) || 0)} />
          </div>
        </label>
      </div>

      <div class="eq__section-label">{t.curvaOferta}</div>
      <div class="calc__form eq__form-row">
        <label class="calc__field">
          <span class="calc__label">{t.interceptoOferta}</span>
          <div class="calc__input-wrap">
            <input type="number" step={10} value={c}
              onInput={(e) => setC(parseFloat((e.target as HTMLInputElement).value) || 0)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.pendienteOferta}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0.1} step={1} value={d}
              onInput={(e) => setD(parseFloat((e.target as HTMLInputElement).value) || 0)} />
          </div>
        </label>
      </div>

      {/* ── Equilibrium result ── */}
      <div class="calc__results">
        {!eq.valido ? (
          <div class="calc__warning">
            {t.sinEquilibrio}
          </div>
        ) : (
          <div class="calc__metric-grid">
            <div class="calc__metric-mini">
              <span class="calc__metric-mini-label">{t.precioEquilibrio}</span>
              <span class="calc__metric-mini-value">{fmtN(eq.P)}</span>
            </div>
            <div class="calc__metric-mini">
              <span class="calc__metric-mini-label">{t.cantidadEquilibrio}</span>
              <span class="calc__metric-mini-value">{fmtN(eq.Q)}</span>
            </div>
          </div>
        )}

        {/* ── SVG graph ── */}
        <EquilibrioChart
          coef={coef}
          eq={eq.valido ? { P: eq.P, Q: eq.Q } : null}
          precioInsp={precioInsp}
          evalInsp={evalInsp}
          topeActivo={topeActivo}
          topeTipo={topeTipo}
          topePrecio={topePrecio}
          locale={locale}
        />

        {/* ── Inspect a price ── */}
        <div class="eq__inspect">
          <div class="eq__section-label">{t.analizarPrecio}</div>
          <div class="calc__form eq__form-row">
            <label class="calc__field">
              <span class="calc__label">{t.precioInspeccionar}</span>
              <div class="calc__input-wrap">
                <input type="number" step={0.5} value={precioInsp}
                  onInput={(e) => setPrecioInsp(parseFloat((e.target as HTMLInputElement).value) || 0)} />
              </div>
            </label>
          </div>
          {!eq.valido ? (
            <div class="eq__note">{t.introduceCurvas}</div>
          ) : (
            <>
              <div class="calc__metric-grid calc__metric-grid--three">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.qdLabel}</span>
                  <span class="calc__metric-mini-value">{fmtN(evalInsp.qd)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.qsLabel}</span>
                  <span class="calc__metric-mini-value">{fmtN(evalInsp.qs)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{evalInsp.exceso >= 0 ? t.excedente : t.escasez}</span>
                  <span class={`calc__metric-mini-value ${evalInsp.exceso >= 0 ? 'ok' : 'fail'}`}>
                    {fmtN(Math.abs(evalInsp.exceso))} {t.udsUnit}
                  </span>
                </div>
              </div>
              {evalInsp.exceso > 0 && (
                <div class="eq__note">{t.hayExcedente}</div>
              )}
              {evalInsp.exceso < 0 && (
                <div class="eq__note">{t.hayEscasez}</div>
              )}
              {evalInsp.exceso === 0 && (
                <div class="eq__note ok">{t.precioEquilibrioNota}</div>
              )}
            </>
          )}
        </div>

        {/* ── Intervention ── */}
        <div class="eq__tope">
          <label class="eq__tope-toggle">
            <input
              type="checkbox"
              checked={topeActivo}
              onChange={(e) => setTopeActivo((e.target as HTMLInputElement).checked)}
            />
            <span class="eq__section-label" style="display:inline;margin:0;">{t.activarIntervencion}</span>
          </label>

          {topeActivo && (
            <div class="eq__tope-controls">
              <div class="calc__form eq__form-row">
                <label class="calc__field">
                  <span class="calc__label">{t.tipoIntervencion}</span>
                  <div class="calc__input-wrap">
                    <select
                      value={topeTipo}
                      onChange={(e) => setTopeTipo((e.target as HTMLSelectElement).value as 'maximo' | 'minimo')}
                    >
                      <option value="maximo">{t.opcionMaximo}</option>
                      <option value="minimo">{t.opcionMinimo}</option>
                    </select>
                  </div>
                </label>
                <label class="calc__field">
                  <span class="calc__label">{t.precioFijado}</span>
                  <div class="calc__input-wrap">
                    <input type="number" min={0} step={0.5} value={topePrecio}
                      onInput={(e) => setTopePrecio(parseFloat((e.target as HTMLInputElement).value) || 0)} />
                  </div>
                </label>
              </div>

              {evalTope && (
                <div class="eq__tope-result">
                  {!evalTope.efectivo ? (
                    <div class="eq__note">
                      {topeTipo === 'maximo' ? t.maxSinEfecto : t.minSinEfecto}
                    </div>
                  ) : (
                    <>
                      <div class="calc__metric-grid calc__metric-grid--three">
                        <div class="calc__metric-mini">
                          <span class="calc__metric-mini-label">{t.cantidadIntercambiada}</span>
                          <span class="calc__metric-mini-value">{fmtN(evalTope.intercambiada)} {t.udsUnit}</span>
                        </div>
                        {evalTope.escasez > 0 && (
                          <div class="calc__metric-mini">
                            <span class="calc__metric-mini-label">{t.escasez}</span>
                            <span class="calc__metric-mini-value fail">{fmtN(evalTope.escasez)} {t.udsUnit}</span>
                          </div>
                        )}
                        {evalTope.excedente > 0 && (
                          <div class="calc__metric-mini">
                            <span class="calc__metric-mini-label">{t.excedente}</span>
                            <span class="calc__metric-mini-value ok">{fmtN(evalTope.excedente)} {t.udsUnit}</span>
                          </div>
                        )}
                      </div>
                      {topeTipo === 'maximo' && evalTope.escasez > 0 && (
                        <div class="eq__note">{t.maxEscasez}</div>
                      )}
                      {topeTipo === 'minimo' && evalTope.excedente > 0 && (
                        <div class="eq__note">{t.minExcedente}</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaEqTitle}</strong>{t.formulaEqDesc}</p>
            <p><strong>{t.formulaPrecioTitle}</strong>{t.formulaPrecioDesc}</p>
            <p><strong>{t.formulaMaxTitle}</strong>{t.formulaMaxDesc}</p>
            <p><strong>{t.formulaMinTitle}</strong>{t.formulaMinDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .eq__section-label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .eq__form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem 1rem;
        }
        @media (max-width: 480px) {
          .eq__form-row { grid-template-columns: 1fr; }
        }
        .eq__inspect {
          margin-top: 1.6rem;
          padding: 1rem 1.1rem;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .eq__tope {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .eq__tope-toggle {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }
        .eq__tope-controls { margin-top: 0.8rem; }
        .eq__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
          padding: 0.5rem 0.8rem;
          background: var(--color-soft, #F8E8D0);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
        }
        .eq__note.ok { border-color: var(--color-terra, #C44E2C); }
        .eq__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          margin-top: 1.4rem;
        }
      `}</style>
    </div>
  );
}

/* ── SVG chart ─────────────────────────────────────────────────────────── */

interface ChartProps {
  coef: Coef;
  eq: { P: number; Q: number } | null;
  precioInsp: number;
  evalInsp: { qd: number; qs: number; exceso: number };
  topeActivo: boolean;
  topeTipo: 'maximo' | 'minimo';
  topePrecio: number;
  locale: Locale;
}

function EquilibrioChart({ coef, eq, precioInsp, evalInsp, topeActivo, topeTipo, topePrecio, locale }: ChartProps) {
  const t = COPY[locale];
  const W = 360;
  const H = 280;
  const ML = 48;
  const MR = 20;
  const MT = 20;
  const MB = 36;
  const iW = W - ML - MR;
  const iH = H - MT - MB;

  const { a, b, c, d } = coef;

  // Domain: P from 0 to a/b (demand touches P-axis when Qd=0: P=a/b)
  // Clamp to 0.1 to prevent division-by-zero in yOf when a=0.
  const maxP = Math.max(b > 0 ? (a / b) * 1.05 : 20, 0.1);
  // Q domain: max of demand at P=0 (=a) and supply at P=maxP (=c + d*maxP)
  const maxQ = Math.max(a, c + d * maxP, 1) * 1.05;

  const xOf = (q: number) => ML + (q / maxQ) * iW;
  const yOf = (p: number) => MT + iH - (p / maxP) * iH;

  // Demand line: from (Q=a, P=0) to (Q=0, P=a/b)
  const demandX1 = xOf(a);
  const demandY1 = yOf(0);
  const demandX2 = xOf(0);
  const demandY2 = yOf(b > 0 ? a / b : 0);

  // Supply line: from (Q=c, P=0) upward to maxP
  const supplyX1 = xOf(c);
  const supplyY1 = yOf(0);
  const supplyX2 = xOf(c + d * maxP);
  const supplyY2 = yOf(maxP);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxP / ticks) * i);
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxQ / ticks) * i);

  // Price-inspection line: clamp to chart domain
  const inspP = Math.max(0, Math.min(maxP, precioInsp));
  const inspQd = Math.max(0, Math.min(maxQ, evalInsp.qd));
  const inspQs = Math.max(0, Math.min(maxQ, evalInsp.qs));

  // Tope line
  const topeP = topeActivo ? Math.max(0, Math.min(maxP, topePrecio)) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      class="eq__chart"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={t.chartAria}
    >
      {/* Grid lines */}
      {yTicks.map((p) => (
        <line
          x1={ML} y1={yOf(p)} x2={ML + iW} y2={yOf(p)}
          stroke="var(--color-line-soft, #EFE2CB)" stroke-width="1" stroke-dasharray="3 4"
        />
      ))}

      {/* Axes */}
      <line x1={ML} y1={MT + iH} x2={ML + iW} y2={MT + iH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />
      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />

      {/* Y tick labels */}
      {yTicks.map((p) => (
        <text x={ML - 6} y={yOf(p) + 4} text-anchor="end"
          font-family="var(--font-mono)" font-size="9" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(p)}
        </text>
      ))}

      {/* X tick labels */}
      {xTicks.map((q) => (
        <text x={xOf(q)} y={MT + iH + 15} text-anchor="middle"
          font-family="var(--font-mono)" font-size="9" fill="var(--color-ink-mute, #8A7868)">
          {fmtAxis(q)}
        </text>
      ))}

      {/* Axis labels */}
      <text x={ML - 36} y={MT + 6} font-family="var(--font-sans)" font-size="11" font-style="italic"
        fill="var(--color-ink-soft, #5C4A3D)">P</text>
      <text x={ML + iW} y={H - 4} text-anchor="end" font-family="var(--font-sans)" font-size="11"
        font-style="italic" fill="var(--color-ink-soft, #5C4A3D)">Q</text>

      {/* Demand line — terracota */}
      <line x1={demandX1} y1={demandY1} x2={demandX2} y2={demandY2}
        stroke="var(--color-terra, #C44E2C)" stroke-width="2.5" />
      <text x={demandX2 + 4} y={demandY2 - 4}
        font-family="var(--font-sans)" font-size="11" font-weight="700"
        fill="var(--color-terra-deep, #9C3A1C)">D</text>

      {/* Supply line — teal (eco1bach color) */}
      <line x1={supplyX1} y1={supplyY1} x2={supplyX2} y2={supplyY2}
        stroke="var(--color-eco1, #1F6E6E)" stroke-width="2.5" />
      <text x={supplyX2 - 4} y={supplyY2 - 6} text-anchor="end"
        font-family="var(--font-sans)" font-size="11" font-weight="700"
        fill="var(--color-eco1, #1F6E6E)">O</text>

      {/* Equilibrium guides + dot */}
      {eq && (
        <>
          <line x1={ML} y1={yOf(eq.P)} x2={xOf(eq.Q)} y2={yOf(eq.P)}
            stroke="var(--color-ink-mute, #8A7868)" stroke-width="1" stroke-dasharray="3 3" />
          <line x1={xOf(eq.Q)} y1={MT + iH} x2={xOf(eq.Q)} y2={yOf(eq.P)}
            stroke="var(--color-ink-mute, #8A7868)" stroke-width="1" stroke-dasharray="3 3" />
          <circle cx={xOf(eq.Q)} cy={yOf(eq.P)} r="5"
            fill="var(--color-mustard, #D4A24C)" stroke="var(--color-ink, #2A1F18)" stroke-width="1.5" />
          <text x={xOf(eq.Q) + 8} y={yOf(eq.P) - 6}
            font-family="var(--font-mono)" font-size="10" fill="var(--color-ink, #2A1F18)">
            E ({fmtAxis(eq.Q)}, {fmtAxis(eq.P)})
          </text>
        </>
      )}

      {/* Inspected price horizontal line */}
      <line x1={ML} y1={yOf(inspP)} x2={ML + iW} y2={yOf(inspP)}
        stroke="var(--color-mustard-deep, #A87A2A)" stroke-width="1.2" stroke-dasharray="4 3" />

      {/* Shortage/surplus segment at inspected price */}
      {Math.abs(evalInsp.exceso) > 0.01 && (
        <>
          <line
            x1={xOf(Math.min(inspQd, inspQs))} y1={yOf(inspP)}
            x2={xOf(Math.max(inspQd, inspQs))} y2={yOf(inspP)}
            stroke={evalInsp.exceso < 0 ? '#B83A3A' : 'var(--color-eco1, #1F6E6E)'}
            stroke-width="4" stroke-linecap="round"
          />
          <text
            x={xOf((inspQd + inspQs) / 2)} y={yOf(inspP) - 7}
            text-anchor="middle" font-family="var(--font-mono)" font-size="9"
            fill={evalInsp.exceso < 0 ? '#B83A3A' : 'var(--color-eco1, #1F6E6E)'}>
            {evalInsp.exceso < 0 ? t.chartEscasez : t.chartExcedente}
          </text>
        </>
      )}

      {/* Tope line (if active) */}
      {topeActivo && (
        <line x1={ML} y1={yOf(topeP)} x2={ML + iW} y2={yOf(topeP)}
          stroke={topeTipo === 'maximo' ? '#B83A3A' : '#1F6E6E'}
          stroke-width="1.8" stroke-dasharray="6 3" />
      )}

      {/* Legend */}
      <rect x={ML + iW - 80} y={MT + 4} width="78" height="36" rx="3"
        fill="var(--color-paper, #FFFFFF)" stroke="var(--color-line, #E5D4BD)" stroke-width="1" />
      <line x1={ML + iW - 74} y1={MT + 14} x2={ML + iW - 60} y2={MT + 14}
        stroke="var(--color-terra, #C44E2C)" stroke-width="2.5" />
      <text x={ML + iW - 56} y={MT + 18} font-family="var(--font-sans)" font-size="9"
        fill="var(--color-ink-soft, #5C4A3D)">{t.leyendaDemanda}</text>
      <line x1={ML + iW - 74} y1={MT + 28} x2={ML + iW - 60} y2={MT + 28}
        stroke="var(--color-eco1, #1F6E6E)" stroke-width="2.5" />
      <text x={ML + iW - 56} y={MT + 32} font-family="var(--font-sans)" font-size="9"
        fill="var(--color-ink-soft, #5C4A3D)">{t.leyendaOferta}</text>
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function fmtN(n: number, decimals = 2): string {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtAxis(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: 1 });
}
