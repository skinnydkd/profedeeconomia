/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import {
  fronteraY, clasificar, costeOportunidadArco, crecimiento,
  type FPP, type FormaFPP,
} from '../../lib/calc/fpp';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Quantities and the
 * axis notation stay as they are.
 */
export const COPY = {
  es: {
    bienesTitulo: 'Los dos bienes',
    nombreX: 'Bien del eje horizontal',
    nombreY: 'Bien del eje vertical',
    maxX: 'Máximo del bien horizontal',
    maxY: 'Máximo del bien vertical',
    formaTitulo: 'Forma de la frontera',
    formaRecta: 'Recta (coste constante)',
    formaConcava: 'Cóncava (coste creciente)',
    formaRectaPie: 'Los recursos sirven igual para los dos bienes, así que renunciar a una unidad cuesta siempre lo mismo.',
    formaConcavaPie: 'Los recursos no son igual de buenos para los dos bienes: cuanto más se produce de uno, más caro sale cada unidad adicional.',
    defaultX: 'Bienes de consumo',
    defaultY: 'Bienes de capital',
    puntoTitulo: 'Un punto de producción',
    puntoX: 'Cantidad del bien horizontal',
    puntoY: 'Cantidad del bien vertical',
    enFrontera: 'En la frontera: eficiente',
    dentro: 'Dentro de la frontera: ineficiente',
    fuera: 'Fuera de la frontera: inalcanzable',
    enFronteraNota: 'Todos los recursos están empleados y bien empleados. Para producir más de un bien hay que producir menos del otro.',
    dentroNota: 'Se puede producir más de los dos bienes a la vez sin renunciar a nada: hay recursos parados o mal empleados.',
    fueraNota: 'No hay recursos suficientes para ese punto. Solo se alcanzaría con más recursos o mejor tecnología.',
    sobreFrontera: 'En la frontera, con esa cantidad del bien horizontal, caben',
    costeTitulo: 'Coste de oportunidad de moverse por la frontera',
    desde: 'Desde (bien horizontal)',
    hasta: 'Hasta (bien horizontal)',
    ganancia: 'Se gana',
    sacrificio: 'Se sacrifica',
    costeUnidad: 'Coste por unidad',
    costeSinMovimiento: 'Elige dos puntos distintos de la frontera para medir el coste de oportunidad.',
    costeFueraRango: 'Los dos puntos tienen que estar entre 0 y el máximo del bien horizontal.',
    costeRectaNota: 'Sobre una frontera recta este número no cambia: da igual dónde se mida.',
    costeConcavaNota: 'Sobre una frontera cóncava este número crece a medida que se avanza hacia la derecha. Prueba a medir el mismo salto al principio y al final.',
    crecimientoTitulo: 'Crecimiento económico',
    activarCrecimiento: 'Dibujar la frontera después de crecer',
    crecX: 'Crecimiento del bien horizontal (%)',
    crecY: 'Crecimiento del bien vertical (%)',
    crecimientoNota: 'El crecimiento desplaza la frontera hacia fuera: lo que antes era inalcanzable pasa a ser posible. Si un bien crece más que el otro, la frontera se inclina en lugar de moverse en paralelo.',
    leyendaActual: 'Frontera actual',
    leyendaCrecida: 'Después de crecer',
    chartAria: 'Frontera de posibilidades de producción con el punto elegido',
    presets: 'Ejemplos',
    presetConsumoCapital: 'Consumo y capital',
    presetTrigoAcero: 'Trigo y acero',
    presetEstudioOcio: 'Horas de estudio y de ocio',
    comoSeCalcula: 'Cómo se calcula',
    formulaRectaTitle: 'Frontera recta',
    formulaRectaDesc: ': Y = maxY · (1 − X / maxX). El coste de oportunidad de una unidad de X es maxY / maxX en todo el trazado.',
    formulaConcavaTitle: 'Frontera cóncava',
    formulaConcavaDesc: ': Y = maxY · √(1 − (X / maxX)²). El coste de oportunidad crece conforme X aumenta.',
    formulaCosteTitle: 'Coste de oportunidad',
    formulaCosteDesc: ' entre dos puntos: unidades de Y sacrificadas ÷ unidades de X ganadas.',
    formulaPuntoTitle: 'Posición de un punto',
    formulaPuntoDesc: ': se compara la Y del punto con la Y de la frontera para esa X.',
  },
  ca: {
    bienesTitulo: 'Els dos béns',
    nombreX: "Bé de l'eix horitzontal",
    nombreY: "Bé de l'eix vertical",
    maxX: 'Màxim del bé horitzontal',
    maxY: 'Màxim del bé vertical',
    formaTitulo: 'Forma de la frontera',
    formaRecta: 'Recta (cost constant)',
    formaConcava: 'Còncava (cost creixent)',
    formaRectaPie: 'Els recursos servixen igual per als dos béns, així que renunciar a una unitat costa sempre el mateix.',
    formaConcavaPie: "Els recursos no són igual de bons per als dos béns: com més es produïx d'un, més cara ix cada unitat addicional.",
    defaultX: 'Béns de consum',
    defaultY: 'Béns de capital',
    puntoTitulo: 'Un punt de producció',
    puntoX: 'Quantitat del bé horitzontal',
    puntoY: 'Quantitat del bé vertical',
    enFrontera: 'A la frontera: eficient',
    dentro: 'Dins de la frontera: ineficient',
    fuera: 'Fora de la frontera: inabastable',
    enFronteraNota: "Tots els recursos estan emprats i ben emprats. Per a produir més d'un bé cal produir menys de l'altre.",
    dentroNota: 'Es pot produir més dels dos béns alhora sense renunciar a res: hi ha recursos parats o mal emprats.',
    fueraNota: "No hi ha recursos prou per a eixe punt. Només s'assoliria amb més recursos o millor tecnologia.",
    sobreFrontera: 'A la frontera, amb eixa quantitat del bé horitzontal, hi caben',
    costeTitulo: "Cost d'oportunitat de moure's per la frontera",
    desde: 'Des de (bé horitzontal)',
    hasta: 'Fins a (bé horitzontal)',
    ganancia: 'Es guanya',
    sacrificio: 'Es sacrifica',
    costeUnidad: 'Cost per unitat',
    costeSinMovimiento: "Tria dos punts distints de la frontera per a mesurar el cost d'oportunitat.",
    costeFueraRango: "Els dos punts han d'estar entre 0 i el màxim del bé horitzontal.",
    costeRectaNota: 'Sobre una frontera recta este número no canvia: tant li fa on es mesure.',
    costeConcavaNota: "Sobre una frontera còncava este número creix a mesura que s'avança cap a la dreta. Prova a mesurar el mateix salt al principi i al final.",
    crecimientoTitulo: 'Creixement econòmic',
    activarCrecimiento: 'Dibuixar la frontera després de créixer',
    crecX: 'Creixement del bé horitzontal (%)',
    crecY: 'Creixement del bé vertical (%)',
    crecimientoNota: "El creixement desplaça la frontera cap a fora: el que abans era inabastable passa a ser possible. Si un bé creix més que l'altre, la frontera s'inclina en lloc de moure's en paral·lel.",
    leyendaActual: 'Frontera actual',
    leyendaCrecida: 'Després de créixer',
    chartAria: 'Frontera de possibilitats de producció amb el punt triat',
    presets: 'Exemples',
    presetConsumoCapital: 'Consum i capital',
    presetTrigoAcero: 'Blat i acer',
    presetEstudioOcio: "Hores d'estudi i d'oci",
    comoSeCalcula: 'Com es calcula',
    formulaRectaTitle: 'Frontera recta',
    formulaRectaDesc: ": Y = maxY · (1 − X / maxX). El cost d'oportunitat d'una unitat de X és maxY / maxX en tot el traçat.",
    formulaConcavaTitle: 'Frontera còncava',
    formulaConcavaDesc: ": Y = maxY · √(1 − (X / maxX)²). El cost d'oportunitat creix conforme X augmenta.",
    formulaCosteTitle: "Cost d'oportunitat",
    formulaCosteDesc: ' entre dos punts: unitats de Y sacrificades ÷ unitats de X guanyades.',
    formulaPuntoTitle: "Posició d'un punt",
    formulaPuntoDesc: ': es compara la Y del punt amb la Y de la frontera per a eixa X.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;
const fmt = (v: number) => formatNumber(v, 2);

/**
 * Production possibilities frontier.
 *
 * Shows the three positions a production point can be in, measures the arc
 * opportunity cost between two points of the frontier — constant on the line,
 * increasing on the curve — and draws the outward shift after growth.
 *
 * Eco 1BACH · Unit 1.
 */
export default function FPPCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [nombreX, setNombreX] = useState<string>(t.defaultX);
  const [nombreY, setNombreY] = useState<string>(t.defaultY);
  const [maxX, setMaxX] = useState<number>(100);
  const [maxY, setMaxY] = useState<number>(80);
  const [forma, setForma] = useState<FormaFPP>('concava');

  // Opens on a point that sits on the frontier (80·√(1 − 0,6²) = 64), so the
  // first reading is the efficient case and moving off it is the teacher's
  // deliberate next step.
  const [puntoX, setPuntoX] = useState<number>(60);
  const [puntoY, setPuntoY] = useState<number>(64);

  const [x1, setX1] = useState<number>(0);
  const [x2, setX2] = useState<number>(20);

  const [crecerActivo, setCrecerActivo] = useState<boolean>(false);
  const [crecX, setCrecX] = useState<number>(20);
  const [crecY, setCrecY] = useState<number>(20);

  const fpp: FPP = { maxX, maxY, forma };
  const valido = maxX > 0 && maxY > 0;

  const posicion = useMemo(
    () => (valido ? clasificar(fpp, puntoX, puntoY) : null),
    [maxX, maxY, forma, puntoX, puntoY],
  );
  const yFrontera = useMemo(() => fronteraY(fpp, puntoX), [maxX, maxY, forma, puntoX]);
  const coste = useMemo(
    () => costeOportunidadArco(fpp, x1, x2),
    [maxX, maxY, forma, x1, x2],
  );
  const crecida = useMemo(
    () => (crecerActivo ? crecimiento(fpp, crecX, crecY) : null),
    [maxX, maxY, forma, crecerActivo, crecX, crecY],
  );

  const aplicar = (nx: string, ny: string, mx: number, my: number, f: FormaFPP) => {
    setNombreX(nx); setNombreY(ny); setMaxX(mx); setMaxY(my); setForma(f);
    setPuntoX(Math.round(mx * 0.6)); setPuntoY(Math.round(my * 0.5));
    setX1(0); setX2(Math.round(mx * 0.2));
  };

  const costeMedible = Number.isFinite(coste.coste) && Number.isFinite(coste.deltaY);

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(t.defaultX, t.defaultY, 100, 80, 'concava')}>{t.presetConsumoCapital}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(locale === 'ca' ? 'Blat' : 'Trigo', locale === 'ca' ? 'Acer' : 'Acero', 200, 120, 'concava')}>{t.presetTrigoAcero}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(locale === 'ca' ? "Hores d'estudi" : 'Horas de estudio', locale === 'ca' ? "Hores d'oci" : 'Horas de ocio', 40, 40, 'recta')}>{t.presetEstudioOcio}</button>
      </div>

      <div class="fpp__label">{t.bienesTitulo}</div>
      <div class="calc__form fpp__row">
        <label class="calc__field">
          <span class="calc__label">{t.nombreX}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombreX} onInput={(e) => setNombreX((e.target as HTMLInputElement).value)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.nombreY}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombreY} onInput={(e) => setNombreY((e.target as HTMLInputElement).value)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.maxX}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={maxX} onInput={(e) => setMaxX(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.maxY}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={maxY} onInput={(e) => setMaxY(num(e))} />
          </div>
        </label>
      </div>

      <div class="fpp__label">{t.formaTitulo}</div>
      <div class="calc__radio-group">
        <label class={`calc__radio ${forma === 'recta' ? 'is-active' : ''}`}>
          <input type="radio" name="fpp-forma" checked={forma === 'recta'} onChange={() => setForma('recta')} />
          <span>{t.formaRecta}</span>
        </label>
        <label class={`calc__radio ${forma === 'concava' ? 'is-active' : ''}`}>
          <input type="radio" name="fpp-forma" checked={forma === 'concava'} onChange={() => setForma('concava')} />
          <span>{t.formaConcava}</span>
        </label>
      </div>
      <p class="fpp__note">{forma === 'recta' ? t.formaRectaPie : t.formaConcavaPie}</p>

      <div class="calc__results">
        <FPPChart
          fpp={fpp}
          crecida={crecida}
          puntoX={puntoX}
          puntoY={puntoY}
          x1={x1}
          x2={x2}
          nombreX={nombreX}
          nombreY={nombreY}
          locale={locale}
        />

        {crecerActivo && (
          <div class="fpp__legend">
            <span class="fpp__key fpp__key--now" /> {t.leyendaActual}
            <span class="fpp__key fpp__key--next" /> {t.leyendaCrecida}
          </div>
        )}

        <div class="fpp__panel">
          <div class="fpp__label">{t.puntoTitulo}</div>
          <div class="calc__form fpp__row">
            <label class="calc__field">
              <span class="calc__label">{t.puntoX}</span>
              <div class="calc__input-wrap">
                <input type="number" min={0} step={5} value={puntoX} onInput={(e) => setPuntoX(num(e))} />
              </div>
            </label>
            <label class="calc__field">
              <span class="calc__label">{t.puntoY}</span>
              <div class="calc__input-wrap">
                <input type="number" min={0} step={5} value={puntoY} onInput={(e) => setPuntoY(num(e))} />
              </div>
            </label>
          </div>
          {posicion && (
            <>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{nombreX} · {nombreY}</span>
                  <span class={`calc__metric-mini-value ${posicion === 'eficiente' ? 'ok' : posicion === 'inalcanzable' ? 'fail' : ''}`}>
                    {posicion === 'eficiente' ? t.enFrontera : posicion === 'ineficiente' ? t.dentro : t.fuera}
                  </span>
                </div>
                {Number.isFinite(yFrontera) && (
                  <div class="calc__metric-mini">
                    <span class="calc__metric-mini-label">{t.sobreFrontera}</span>
                    <span class="calc__metric-mini-value">{fmt(yFrontera)}</span>
                  </div>
                )}
              </div>
              <p class="fpp__note">
                {posicion === 'eficiente' ? t.enFronteraNota : posicion === 'ineficiente' ? t.dentroNota : t.fueraNota}
              </p>
            </>
          )}
        </div>

        <div class="fpp__panel">
          <div class="fpp__label">{t.costeTitulo}</div>
          <div class="calc__form fpp__row">
            <label class="calc__field">
              <span class="calc__label">{t.desde}</span>
              <div class="calc__input-wrap">
                <input type="number" min={0} step={5} value={x1} onInput={(e) => setX1(num(e))} />
              </div>
            </label>
            <label class="calc__field">
              <span class="calc__label">{t.hasta}</span>
              <div class="calc__input-wrap">
                <input type="number" min={0} step={5} value={x2} onInput={(e) => setX2(num(e))} />
              </div>
            </label>
          </div>
          {!costeMedible ? (
            <p class="fpp__note">{x1 === x2 ? t.costeSinMovimiento : t.costeFueraRango}</p>
          ) : (
            <>
              <div class="calc__metric-grid calc__metric-grid--three">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.ganancia} · {nombreX}</span>
                  <span class="calc__metric-mini-value">{fmt(Math.abs(coste.deltaX))}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.sacrificio} · {nombreY}</span>
                  <span class="calc__metric-mini-value">{fmt(Math.abs(coste.deltaY))}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.costeUnidad}</span>
                  <span class="calc__metric-mini-value">{fmt(Math.abs(coste.coste))}</span>
                </div>
              </div>
              <p class="fpp__note">{forma === 'recta' ? t.costeRectaNota : t.costeConcavaNota}</p>
            </>
          )}
        </div>

        <div class="fpp__panel">
          <label class="fpp__toggle">
            <input type="checkbox" checked={crecerActivo}
              onChange={(e) => setCrecerActivo((e.target as HTMLInputElement).checked)} />
            <span class="fpp__label" style="display:inline;margin:0;">{t.activarCrecimiento}</span>
          </label>
          {crecerActivo && (
            <>
              <div class="calc__form fpp__row">
                <label class="calc__field">
                  <span class="calc__label">{t.crecX}</span>
                  <div class="calc__input-wrap">
                    <input type="number" min={0} step={5} value={crecX} onInput={(e) => setCrecX(num(e))} />
                  </div>
                </label>
                <label class="calc__field">
                  <span class="calc__label">{t.crecY}</span>
                  <div class="calc__input-wrap">
                    <input type="number" min={0} step={5} value={crecY} onInput={(e) => setCrecY(num(e))} />
                  </div>
                </label>
              </div>
              <p class="fpp__note">{t.crecimientoNota}</p>
            </>
          )}
        </div>

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaRectaTitle}</strong>{t.formulaRectaDesc}</p>
            <p><strong>{t.formulaConcavaTitle}</strong>{t.formulaConcavaDesc}</p>
            <p><strong>{t.formulaCosteTitle}</strong>{t.formulaCosteDesc}</p>
            <p><strong>{t.formulaPuntoTitle}</strong>{t.formulaPuntoDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .fpp__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .fpp__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .fpp__row { grid-template-columns: 1fr; } }
        .fpp__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .fpp__toggle { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
        .fpp__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .fpp__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          margin-top: 1rem;
        }
        .fpp__legend {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: 0.84rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .fpp__key { display: inline-block; width: 22px; height: 0; border-top: 2px solid; }
        .fpp__key--now { border-color: var(--color-terra, #C44E2C); }
        .fpp__key--next { border-color: var(--color-mustard, #D4A24C); border-top-style: dashed; margin-left: 0.8rem; }
      `}</style>
    </div>
  );
}

/* ── SVG chart ─────────────────────────────────────────────────────────── */

interface ChartProps {
  fpp: FPP;
  crecida: FPP | null;
  puntoX: number;
  puntoY: number;
  x1: number;
  x2: number;
  nombreX: string;
  nombreY: string;
  locale: Locale;
}

function FPPChart({ fpp, crecida, puntoX, puntoY, x1, x2, nombreX, nombreY, locale }: ChartProps) {
  const t = COPY[locale];
  const W = 360, H = 280, ML = 46, MR = 16, MT = 16, MB = 40;
  const iW = W - ML - MR, iH = H - MT - MB;

  const maxXPlot = Math.max(fpp.maxX, crecida?.maxX ?? 0, 1) * 1.06;
  const maxYPlot = Math.max(fpp.maxY, crecida?.maxY ?? 0, 1) * 1.06;

  const xOf = (x: number) => ML + (x / maxXPlot) * iW;
  const yOf = (y: number) => MT + iH - (y / maxYPlot) * iH;

  /** Polyline for a frontier: 40 samples is smooth enough at this size. */
  const path = (f: FPP) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = (f.maxX / 40) * i;
      const y = fronteraY(f, x);
      if (Number.isFinite(y)) pts.push(`${xOf(x).toFixed(1)},${yOf(y).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxYPlot / ticks) * i);
  const xTicks = Array.from({ length: ticks + 1 }, (_, i) => (maxXPlot / ticks) * i);

  const dentro = (x: number) => x >= 0 && x <= fpp.maxX;
  const y1 = fronteraY(fpp, x1);
  const y2 = fronteraY(fpp, x2);
  const puntoVisible = puntoX >= 0 && puntoX <= maxXPlot && puntoY >= 0 && puntoY <= maxYPlot;

  return (
    <svg class="fpp__chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.chartAria}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={ML} y1={yOf(v)} x2={W - MR} y2={yOf(v)} stroke="#EFE2CB" stroke-width="1" />
          <text x={ML - 6} y={yOf(v) + 3} text-anchor="end" font-size="9" fill="#8A7868">
            {formatNumber(v, 0)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={H - MB + 14} text-anchor="middle" font-size="9" fill="#8A7868">
          {formatNumber(v, 0)}
        </text>
      ))}

      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />
      <line x1={ML} y1={MT + iH} x2={W - MR} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />

      {crecida && (
        <polyline points={path(crecida)} fill="none" stroke="#D4A24C" stroke-width="2" stroke-dasharray="5 4" />
      )}
      <polyline points={path(fpp)} fill="none" stroke="#C44E2C" stroke-width="2" />

      {/* The arc whose opportunity cost is being measured. */}
      {dentro(x1) && dentro(x2) && x1 !== x2 && (
        <g>
          <line x1={xOf(x1)} y1={yOf(y1)} x2={xOf(x2)} y2={yOf(y1)} stroke="#5C4A3D" stroke-width="1" stroke-dasharray="3 3" />
          <line x1={xOf(x2)} y1={yOf(y1)} x2={xOf(x2)} y2={yOf(y2)} stroke="#5C4A3D" stroke-width="1" stroke-dasharray="3 3" />
          <circle cx={xOf(x1)} cy={yOf(y1)} r="3" fill="#5C4A3D" />
          <circle cx={xOf(x2)} cy={yOf(y2)} r="3" fill="#5C4A3D" />
        </g>
      )}

      {puntoVisible && (
        <circle cx={xOf(puntoX)} cy={yOf(puntoY)} r="5" fill="#1F6E6E" stroke="#FBF6EC" stroke-width="1.5" />
      )}

      <text x={W - MR} y={H - 6} text-anchor="end" font-size="10" fill="#5C4A3D">{nombreX}</text>
      <text x={4} y={MT - 4} text-anchor="start" font-size="10" fill="#5C4A3D">{nombreY}</text>
    </svg>
  );
}
