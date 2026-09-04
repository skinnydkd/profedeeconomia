/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber } from '../../lib/calc/format';
import { analizar, type Curvas, type TipoExternalidad } from '../../lib/calc/externalidad';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Notation (P, Q, CMg,
 * BMg, €) is not translated.
 */
export const COPY = {
  es: {
    tipoTitulo: 'Tipo de externalidad',
    negativa: 'Negativa (el mercado produce de más)',
    positiva: 'Positiva (el mercado produce de menos)',
    negativaPie: 'Cada unidad producida impone un coste a terceros que ni el vendedor ni el comprador pagan: contaminación, ruido, atascos.',
    positivaPie: 'Cada unidad produce un beneficio a terceros que nadie paga al que la compra: vacunas, educación, un edificio restaurado.',
    demandaTitulo: 'Demanda: P = A − B · Q',
    interceptoDemanda: 'A (precio máximo)',
    pendienteDemanda: 'B (pendiente, >0)',
    costeTitulo: 'Coste marginal privado: CMg = c + d · Q',
    interceptoCoste: 'c (coste de la primera unidad)',
    pendienteCoste: 'd (pendiente, ≥0)',
    efectoTitulo: 'Efecto externo',
    efectoLabel: 'Coste o beneficio externo por unidad (€)',
    sinDatos: 'Con estos parámetros no hay un mercado que analizar. Comprueba que A sea mayor que c, que B sea mayor que 0 y que el efecto externo no sea tan grande que la cantidad óptima quede por debajo de cero.',
    resultadoMercado: 'Lo que hace el mercado',
    resultadoOptimo: 'Lo que sería socialmente óptimo',
    cantidad: 'Cantidad',
    precio: 'Precio que paga quien compra',
    precioProductor: 'Precio que se queda quien vende',
    instrumentoImpuesto: 'Impuesto pigouviano por unidad',
    instrumentoSubvencion: 'Subvención pigouviana por unidad',
    perdida: 'Pérdida de eficiencia del mercado sin corregir',
    recaudacion: 'Recaudación del impuesto',
    coste: 'Coste de la subvención',
    brecha: 'Unidades de diferencia',
    lecturaNegativa: 'El mercado produce de más porque el precio no incluye el daño. Un impuesto igual al coste externo hace que el vendedor lo tenga en cuenta y la cantidad baja hasta la socialmente eficiente.',
    lecturaPositiva: 'El mercado produce de menos porque quien compra no cobra el beneficio que genera a los demás. Una subvención igual a ese beneficio hace que la cantidad suba hasta la socialmente eficiente.',
    avisoPerdida: 'El triángulo de pérdida no es dinero que alguien se lleve: es valor que desaparece, y por eso corregir la externalidad mejora a la sociedad en conjunto aunque haya quien salga perdiendo.',
    presets: 'Ejemplos',
    presetCementera: 'Cementera que contamina',
    presetVacunas: 'Campaña de vacunación',
    presetAtascos: 'Coches en hora punta',
    leyendaDemanda: 'Demanda (BMg privado)',
    leyendaCoste: 'CMg privado',
    leyendaSocialNeg: 'CMg social (CMg + coste externo)',
    leyendaSocialPos: 'BMg social (demanda + beneficio externo)',
    chartAria: 'Gráfico de la externalidad con el equilibrio de mercado y el óptimo social',
    comoSeCalcula: 'Cómo se calcula',
    formulaMercadoTitle: 'Equilibrio de mercado',
    formulaMercadoDesc: ': A − B·Q = c + d·Q → Q = (A − c) / (B + d).',
    formulaOptimoTitle: 'Óptimo social',
    formulaOptimoDesc: ': se añade el efecto externo al lado que lo soporta y se vuelve a igualar; con una externalidad negativa, Q = (A − c − e) / (B + d).',
    formulaImpuestoTitle: 'Impuesto o subvención',
    formulaImpuestoDesc: ': igual al efecto externo por unidad (e). Con él, el mercado por su cuenta llega al óptimo.',
    formulaPerdidaTitle: 'Pérdida de eficiencia',
    formulaPerdidaDesc: ': triángulo de base la diferencia de cantidades y altura e → ½ · e · |Q_mercado − Q_óptimo|.',
  },
  ca: {
    tipoTitulo: "Tipus d'externalitat",
    negativa: 'Negativa (el mercat produïx de més)',
    positiva: 'Positiva (el mercat produïx de menys)',
    negativaPie: 'Cada unitat produïda imposa un cost a tercers que ni el venedor ni el comprador paguen: contaminació, soroll, embossos.',
    positivaPie: 'Cada unitat produïx un benefici a tercers que ningú paga al que la compra: vacunes, educació, un edifici restaurat.',
    demandaTitulo: 'Demanda: P = A − B · Q',
    interceptoDemanda: 'A (preu màxim)',
    pendienteDemanda: 'B (pendent, >0)',
    costeTitulo: 'Cost marginal privat: CMg = c + d · Q',
    interceptoCoste: 'c (cost de la primera unitat)',
    pendienteCoste: 'd (pendent, ≥0)',
    efectoTitulo: 'Efecte extern',
    efectoLabel: 'Cost o benefici extern per unitat (€)',
    sinDatos: "Amb estos paràmetres no hi ha un mercat a analitzar. Comprova que A siga major que c, que B siga major que 0 i que l'efecte extern no siga tan gran que la quantitat òptima quede per davall de zero.",
    resultadoMercado: 'El que fa el mercat',
    resultadoOptimo: 'El que seria socialment òptim',
    cantidad: 'Quantitat',
    precio: 'Preu que paga qui compra',
    precioProductor: 'Preu que es queda qui ven',
    instrumentoImpuesto: 'Impost pigovià per unitat',
    instrumentoSubvencion: 'Subvenció pigoviana per unitat',
    perdida: "Pèrdua d'eficiència del mercat sense corregir",
    recaudacion: "Recaptació de l'impost",
    coste: 'Cost de la subvenció',
    brecha: 'Unitats de diferència',
    lecturaNegativa: "El mercat produïx de més perquè el preu no inclou el dany. Un impost igual al cost extern fa que el venedor el tinga en compte i la quantitat baixa fins a la socialment eficient.",
    lecturaPositiva: 'El mercat produïx de menys perquè qui compra no cobra el benefici que genera als altres. Una subvenció igual a eixe benefici fa que la quantitat puge fins a la socialment eficient.',
    avisoPerdida: "El triangle de pèrdua no són diners que algú s'emporte: és valor que desapareix, i per això corregir l'externalitat millora la societat en conjunt encara que hi haja qui isca perdent.",
    presets: 'Exemples',
    presetCementera: 'Cimentera que contamina',
    presetVacunas: 'Campanya de vacunació',
    presetAtascos: 'Cotxes en hora punta',
    leyendaDemanda: 'Demanda (BMg privat)',
    leyendaCoste: 'CMg privat',
    leyendaSocialNeg: 'CMg social (CMg + cost extern)',
    leyendaSocialPos: 'BMg social (demanda + benefici extern)',
    chartAria: "Gràfic de l'externalitat amb l'equilibri de mercat i l'òptim social",
    comoSeCalcula: 'Com es calcula',
    formulaMercadoTitle: "Equilibri de mercat",
    formulaMercadoDesc: ': A − B·Q = c + d·Q → Q = (A − c) / (B + d).',
    formulaOptimoTitle: 'Òptim social',
    formulaOptimoDesc: ": s'afig l'efecte extern al costat que el suporta i es torna a igualar; amb una externalitat negativa, Q = (A − c − e) / (B + d).",
    formulaImpuestoTitle: 'Impost o subvenció',
    formulaImpuestoDesc: ": igual a l'efecte extern per unitat (e). Amb ell, el mercat pel seu compte arriba a l'òptim.",
    formulaPerdidaTitle: "Pèrdua d'eficiència",
    formulaPerdidaDesc: ': triangle de base la diferència de quantitats i altura e → ½ · e · |Q_mercat − Q_òptim|.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * Externality and the Pigouvian correction.
 *
 * Draws the private equilibrium against the social optimum, sizes the tax (or
 * subsidy) that closes the gap and shades the welfare triangle between them.
 * Defaults reproduce the worked case of the unit's activity.
 *
 * Eco 1BACH · Unit 6.
 */
export default function ExternalidadCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [tipo, setTipo] = useState<TipoExternalidad>('negativa');
  const [A, setA] = useState<number>(100);
  const [B, setB] = useState<number>(0.5);
  const [c, setC] = useState<number>(20);
  const [d, setD] = useState<number>(0.5);
  const [e, setE] = useState<number>(20);

  const curvas: Curvas = { A, B, c, d, e, tipo };
  const r = useMemo(() => analizar(curvas), [A, B, c, d, e, tipo]);

  const aplicar = (p: Partial<Curvas>) => {
    if (p.tipo) setTipo(p.tipo);
    if (p.A !== undefined) setA(p.A);
    if (p.B !== undefined) setB(p.B);
    if (p.c !== undefined) setC(p.c);
    if (p.d !== undefined) setD(p.d);
    if (p.e !== undefined) setE(p.e);
  };

  const negativa = tipo === 'negativa';

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar({ tipo: 'negativa', A: 100, B: 0.5, c: 20, d: 0.5, e: 20 })}>{t.presetCementera}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar({ tipo: 'positiva', A: 60, B: 0.5, c: 10, d: 0.25, e: 15 })}>{t.presetVacunas}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar({ tipo: 'negativa', A: 12, B: 0.02, c: 2, d: 0.01, e: 3 })}>{t.presetAtascos}</button>
      </div>

      <div class="ext__label">{t.tipoTitulo}</div>
      <div class="calc__radio-group">
        <label class={`calc__radio ${negativa ? 'is-active' : ''}`}>
          <input type="radio" name="ext-tipo" checked={negativa} onChange={() => setTipo('negativa')} />
          <span>{t.negativa}</span>
        </label>
        <label class={`calc__radio ${!negativa ? 'is-active' : ''}`}>
          <input type="radio" name="ext-tipo" checked={!negativa} onChange={() => setTipo('positiva')} />
          <span>{t.positiva}</span>
        </label>
      </div>
      <p class="ext__note">{negativa ? t.negativaPie : t.positivaPie}</p>

      <div class="ext__label">{t.demandaTitulo}</div>
      <div class="calc__form ext__row">
        <label class="calc__field">
          <span class="calc__label">{t.interceptoDemanda}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={5} value={A} onInput={(ev) => setA(num(ev))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.pendienteDemanda}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0.01} step={0.1} value={B} onInput={(ev) => setB(num(ev))} />
          </div>
        </label>
      </div>

      <div class="ext__label">{t.costeTitulo}</div>
      <div class="calc__form ext__row">
        <label class="calc__field">
          <span class="calc__label">{t.interceptoCoste}</span>
          <div class="calc__input-wrap">
            <input type="number" step={5} value={c} onInput={(ev) => setC(num(ev))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.pendienteCoste}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={0.1} value={d} onInput={(ev) => setD(num(ev))} />
          </div>
        </label>
      </div>

      <div class="ext__label">{t.efectoTitulo}</div>
      <div class="calc__form ext__row">
        <label class="calc__field">
          <span class="calc__label">{t.efectoLabel}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1} value={e} onInput={(ev) => setE(num(ev))} />
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <ExternalidadChart curvas={curvas} resultado={r} locale={locale} />

            <div class="ext__legend">
              <span class="ext__key ext__key--dem" /> {t.leyendaDemanda}
              <span class="ext__key ext__key--cmg" /> {t.leyendaCoste}
              <span class="ext__key ext__key--soc" /> {negativa ? t.leyendaSocialNeg : t.leyendaSocialPos}
            </div>

            <div class="ext__panel">
              <div class="ext__label">{t.resultadoMercado}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.cantidad}</span>
                  <span class="calc__metric-mini-value">{formatNumber(r.privado.Q, 2)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.precio}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.privado.P)}</span>
                </div>
              </div>
            </div>

            <div class="ext__panel">
              <div class="ext__label">{t.resultadoOptimo}</div>
              <div class="calc__metric-grid calc__metric-grid--three">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.cantidad}</span>
                  <span class="calc__metric-mini-value ok">{formatNumber(r.social.Q, 2)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.precio}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.social.P)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.precioProductor}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.precioProductor)}</span>
                </div>
              </div>
            </div>

            <div class="ext__panel">
              <div class="calc__metric-grid calc__metric-grid--three">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{negativa ? t.instrumentoImpuesto : t.instrumentoSubvencion}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.instrumento)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.perdida}</span>
                  <span class="calc__metric-mini-value fail">{formatEUR(r.perdidaEficiencia)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{negativa ? t.recaudacion : t.coste}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.recaudacion)}</span>
                </div>
              </div>
              <p class="ext__note">{negativa ? t.lecturaNegativa : t.lecturaPositiva}</p>
              <p class="ext__note">{t.avisoPerdida}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaMercadoTitle}</strong>{t.formulaMercadoDesc}</p>
            <p><strong>{t.formulaOptimoTitle}</strong>{t.formulaOptimoDesc}</p>
            <p><strong>{t.formulaImpuestoTitle}</strong>{t.formulaImpuestoDesc}</p>
            <p><strong>{t.formulaPerdidaTitle}</strong>{t.formulaPerdidaDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .ext__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .ext__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .ext__row { grid-template-columns: 1fr; } }
        .ext__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .ext__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .ext__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          margin-top: 1rem;
        }
        .ext__legend {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: 0.84rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .ext__key { display: inline-block; width: 20px; height: 0; border-top: 2px solid; margin-left: 0.7rem; }
        .ext__key--dem { border-color: #1F6E6E; margin-left: 0; }
        .ext__key--cmg { border-color: var(--color-terra, #C44E2C); }
        .ext__key--soc { border-color: var(--color-mustard, #D4A24C); border-top-style: dashed; }
      `}</style>
    </div>
  );
}

/* ── SVG chart ─────────────────────────────────────────────────────────── */

interface ChartProps {
  curvas: Curvas;
  resultado: ReturnType<typeof analizar>;
  locale: Locale;
}

function ExternalidadChart({ curvas, resultado, locale }: ChartProps) {
  const t = COPY[locale];
  const { A, B, c, d, e, tipo } = curvas;
  const W = 360, H = 280, ML = 46, MR = 16, MT = 16, MB = 36;
  const iW = W - ML - MR, iH = H - MT - MB;

  const demanda = (q: number) => A - B * q;
  const cmg = (q: number) => c + d * q;
  // The dashed curve is whichever side carries the external effect.
  const social = (q: number) => (tipo === 'negativa' ? cmg(q) + e : demanda(q) + e);

  const qMax = Math.max(resultado.privado.Q, resultado.social.Q, A / B) * 1.05;
  // A positive externality lifts the whole demand line by e, so the top of the
  // board is not always the demand intercept.
  const pMax = Math.max(A, c + d * qMax, social(0)) * 1.05;

  const xOf = (q: number) => ML + (q / qMax) * iW;
  const yOf = (p: number) => MT + iH - (p / pMax) * iH;

  /** Straight segment from q = 0 up to where the line reaches zero, or the edge. */
  const linea = (f: (q: number) => number) => {
    const cero = f(0) / ((f(0) - f(1)) || Infinity);
    const fin = f(qMax) < 0 && cero > 0 ? Math.min(qMax, cero) : qMax;
    return `${xOf(0)},${yOf(f(0))} ${xOf(fin)},${yOf(f(fin))}`;
  };

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (pMax / ticks) * i);
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => (qMax / ticks) * i);

  // Welfare triangle: apex where the two social curves cross (the optimum),
  // and a vertical side of height e at the market quantity, where demand and
  // private marginal cost meet.
  const qA = resultado.social.Q;
  const qB = resultado.privado.Q;
  const vertice = tipo === 'negativa' ? demanda(qA) : cmg(qA);
  const triangulo = [
    `${xOf(qA)},${yOf(vertice)}`,
    `${xOf(qB)},${yOf(resultado.privado.P)}`,
    `${xOf(qB)},${yOf(resultado.privado.P + e)}`,
  ].join(' ');

  return (
    <svg class="ext__chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.chartAria}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={ML} y1={yOf(v)} x2={W - MR} y2={yOf(v)} stroke="#EFE2CB" stroke-width="1" />
          <text x={ML - 6} y={yOf(v) + 3} text-anchor="end" font-size="9" fill="#8A7868">{formatNumber(v, 0)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={H - MB + 14} text-anchor="middle" font-size="9" fill="#8A7868">{formatNumber(v, 0)}</text>
      ))}

      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />
      <line x1={ML} y1={MT + iH} x2={W - MR} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />

      {e > 0 && <polygon points={triangulo} fill="#C44E2C" opacity="0.16" />}

      <polyline points={linea(social)} fill="none" stroke="#D4A24C" stroke-width="2" stroke-dasharray="5 4" />
      <polyline points={linea(cmg)} fill="none" stroke="#C44E2C" stroke-width="2" />
      <polyline points={linea(demanda)} fill="none" stroke="#1F6E6E" stroke-width="2" />

      <line x1={xOf(qB)} y1={yOf(0)} x2={xOf(qB)} y2={yOf(resultado.privado.P)} stroke="#8A7868" stroke-width="1" stroke-dasharray="3 3" />
      <line x1={xOf(qA)} y1={yOf(0)} x2={xOf(qA)} y2={yOf(resultado.social.P)} stroke="#8A7868" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx={xOf(qB)} cy={yOf(resultado.privado.P)} r="4.5" fill="#C44E2C" stroke="#FBF6EC" stroke-width="1.4" />
      <circle cx={xOf(qA)} cy={yOf(resultado.social.P)} r="4.5" fill="#1F6E6E" stroke="#FBF6EC" stroke-width="1.4" />

      <text x={W - MR} y={H - 4} text-anchor="end" font-size="10" fill="#5C4A3D">Q</text>
      <text x={4} y={MT - 4} text-anchor="start" font-size="10" fill="#5C4A3D">P (€)</text>
    </svg>
  );
}
