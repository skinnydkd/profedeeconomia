/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
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
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (AD, SRAS, LRAS, P, Y, E*, E**, %, €, subscripts, numeric values) is not
 * translated. Preset/cause ids stay structural; their translated labels are
 * nested under those ids. Mirrors the sibling calculators.
 */
export const COPY = {
  es: {
    escenarios: 'Escenarios',
    reiniciar: 'Reiniciar',
    demandaAgregada: 'Demanda agregada (AD)',
    adHint:
      'Un desplazamiento positivo empuja la AD a la derecha (más consumo, inversión, gasto público o exportaciones netas).',
    adShiftLabel: 'Desplazamiento total de la AD',
    ofertaCortoPlazo: 'Oferta de corto plazo (SRAS)',
    srasHint:
      'Un choque negativo (energía o salarios al alza) desplaza la SRAS a la izquierda; una mejora de productividad la lleva a la derecha.',
    srasShiftLabel: 'Desplazamiento total de la SRAS',
    produccionPotencial: 'Producción potencial (LRAS)',
    lrasShiftLabel: 'Cambio estructural del potencial',
    ajusteTitle:
      'La SRAS se ajusta hasta que el producto vuelve al potencial: la brecha se cierra y todo el ajuste recae en los precios.',
    ajusteBtn: 'Ajuste a largo plazo →',
    yaEnPotencial: 'La economía ya produce en el potencial.',
    brechaProduccion: 'Brecha de producción',
    nivelPrecios: 'Nivel de precios P*',
    sobreIndiceBase: ' sobre el índice base 100',
    produccionY: 'Producción Y*',
    delPotencial: ' del potencial',
    potencialLras: 'Potencial (LRAS)',
    plenoEmpleo: 'Pleno empleo de los recursos',
    comoSeCalculan: 'Cómo se calculan los equilibrios',
    equilibrioCortoPlazo: 'Equilibrio de corto plazo',
    largoPlazo: 'Largo plazo',
    largoPlazoDesc1: 'el producto vuelve al potencial',
    largoPlazoDesc2: 'y todo el ajuste recae en el nivel de precios.',
    chartAria: 'Modelo AD-AS con brecha de producción',
    yAxis: 'Y (PIB real)',
    sinVariacion: 'Sin variación',
    gapNeutra: 'Pleno empleo: la economía produce justo en el potencial.',
    gapInflacionaria: (mag: string) =>
      `Brecha inflacionaria (+${mag} % sobre el potencial): la economía se sobrecalienta y presiona los precios al alza.`,
    gapRecesiva: (mag: string) =>
      `Brecha recesiva (−${mag} % bajo el potencial): hay recursos ociosos y desempleo cíclico.`,
    interpretInicial:
      'La economía parte del equilibrio: produce en el potencial con precios estables. Aplica un escenario o desplaza las curvas para ver qué ocurre.',
    interpretEstanflacion:
      'Estanflación: el choque negativo de oferta sube los precios y, a la vez, hunde la producción. La política de demanda no puede arreglar las dos cosas a la vez.',
    interpretExpansion:
      'La expansión de la demanda empuja producto y precios al alza por encima del potencial. A largo plazo, los costes se ajustan y la economía vuelve al potencial con precios más altos: pulsa "Ajuste a largo plazo".',
    interpretRecesion:
      'La caída de la demanda deja la economía por debajo del potencial: desempleo cíclico. A largo plazo, costes y salarios ceden y la SRAS recupera el potencial con precios más bajos.',
    interpretMejoraOferta:
      'La mejora de oferta abarata producir: el producto sube y los precios bajan. Es el escenario más favorable, propio de avances de productividad.',
    interpretDefault:
      'Las curvas se han desplazado: observa cómo cambian el equilibrio de corto plazo (E*) y la brecha respecto al potencial (LRAS).',
    presets: {
      fiscal: {
        label: 'Política fiscal expansiva',
        note: 'El sector público sube el gasto y la inversión: la demanda agregada se desplaza a la derecha. Suben el producto y los precios, y se abre una brecha inflacionaria.',
      },
      oferta: {
        label: 'Shock de oferta (petróleo)',
        note: 'El encarecimiento de la energía dispara los costes: la SRAS se desplaza a la izquierda. Suben los precios y cae el producto: estanflación.',
      },
      recesion: {
        label: 'Recesión de demanda',
        note: 'El pesimismo recorta consumo e inversión: la demanda agregada cae. Bajan precios y producto, y aparece una brecha recesiva con desempleo cíclico.',
      },
      boom: {
        label: 'Boom inflacionario',
        note: 'Crédito barato y euforia disparan la demanda muy por encima del potencial: el producto se sobrecalienta y la inflación se acelera.',
      },
    },
    adCauses: {
      consumo: 'Consumo de las familias',
      inversion: 'Inversión empresarial',
      gasto: 'Gasto público',
      export: 'Exportaciones netas',
    },
    srasCauses: {
      energia: 'Precio de la energía ↑',
      salarios: 'Salarios ↑',
      productividad: 'Productividad ↑',
    },
  },
  ca: {
    escenarios: 'Escenaris',
    reiniciar: 'Reiniciar',
    demandaAgregada: 'Demanda agregada (AD)',
    adHint:
      'Un desplaçament positiu empeny la AD a la dreta (més consum, inversió, despesa pública o exportacions netes).',
    adShiftLabel: 'Desplaçament total de la AD',
    ofertaCortoPlazo: 'Oferta de curt termini (SRAS)',
    srasHint:
      "Un xoc negatiu (energia o salaris a l'alça) desplaça la SRAS a l'esquerra; una millora de productivitat la porta a la dreta.",
    srasShiftLabel: 'Desplaçament total de la SRAS',
    produccionPotencial: 'Producció potencial (LRAS)',
    lrasShiftLabel: 'Canvi estructural del potencial',
    ajusteTitle:
      "La SRAS s'ajusta fins que el producte torna al potencial: la bretxa es tanca i tot l'ajust recau en els preus.",
    ajusteBtn: 'Ajust a llarg termini →',
    yaEnPotencial: "L'economia ja produïx en el potencial.",
    brechaProduccion: 'Bretxa de producció',
    nivelPrecios: 'Nivell de preus P*',
    sobreIndiceBase: " sobre l'índex base 100",
    produccionY: 'Producció Y*',
    delPotencial: ' del potencial',
    potencialLras: 'Potencial (LRAS)',
    plenoEmpleo: 'Plena ocupació dels recursos',
    comoSeCalculan: 'Com es calculen els equilibris',
    equilibrioCortoPlazo: 'Equilibri de curt termini',
    largoPlazo: 'Llarg termini',
    largoPlazoDesc1: 'el producte torna al potencial',
    largoPlazoDesc2: "i tot l'ajust recau en el nivell de preus.",
    chartAria: 'Model AD-AS amb bretxa de producció',
    yAxis: 'Y (PIB real)',
    sinVariacion: 'Sense variació',
    gapNeutra: "Plena ocupació: l'economia produïx just en el potencial.",
    gapInflacionaria: (mag: string) =>
      `Bretxa inflacionària (+${mag} % sobre el potencial): l'economia es sobreescalfa i pressiona els preus a l'alça.`,
    gapRecesiva: (mag: string) =>
      `Bretxa recessiva (−${mag} % davall del potencial): hi ha recursos ociosos i desocupació cíclica.`,
    interpretInicial:
      "L'economia parteix de l'equilibri: produïx en el potencial amb preus estables. Aplica un escenari o desplaça les corbes per a vore què passa.",
    interpretEstanflacion:
      "Estanflació: el xoc negatiu d'oferta apuja els preus i, alhora, enfonsa la producció. La política de demanda no pot arreglar les dos coses alhora.",
    interpretExpansion:
      "L'expansió de la demanda empeny producte i preus a l'alça per damunt del potencial. A llarg termini, els costos s'ajusten i l'economia torna al potencial amb preus més alts: prem «Ajust a llarg termini».",
    interpretRecesion:
      "La caiguda de la demanda deixa l'economia per davall del potencial: desocupació cíclica. A llarg termini, costos i salaris cedixen i la SRAS recupera el potencial amb preus més baixos.",
    interpretMejoraOferta:
      "La millora d'oferta abarateix produir: el producte puja i els preus baixen. És l'escenari més favorable, propi d'avanços de productivitat.",
    interpretDefault:
      "Les corbes s'han desplaçat: observa com canvien l'equilibri de curt termini (E*) i la bretxa respecte al potencial (LRAS).",
    presets: {
      fiscal: {
        label: 'Política fiscal expansiva',
        note: "El sector públic apuja la despesa i la inversió: la demanda agregada es desplaça a la dreta. Pugen el producte i els preus, i s'obri una bretxa inflacionària.",
      },
      oferta: {
        label: "Xoc d'oferta (petroli)",
        note: "L'encariment de l'energia dispara els costos: la SRAS es desplaça a l'esquerra. Pugen els preus i cau el producte: estanflació.",
      },
      recesion: {
        label: 'Recessió de demanda',
        note: 'El pessimisme retalla consum i inversió: la demanda agregada cau. Baixen preus i producte, i apareix una bretxa recessiva amb desocupació cíclica.',
      },
      boom: {
        label: 'Boom inflacionari',
        note: "Crèdit barat i eufòria disparen la demanda molt per damunt del potencial: el producte es sobreescalfa i la inflació s'accelera.",
      },
    },
    adCauses: {
      consumo: 'Consum de les famílies',
      inversion: 'Inversió empresarial',
      gasto: 'Despesa pública',
      export: 'Exportacions netes',
    },
    srasCauses: {
      energia: "Preu de l'energia ↑",
      salarios: 'Salaris ↑',
      productividad: 'Productivitat ↑',
    },
  },
} as const;

interface Props {
  locale?: Locale;
}

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

type PresetId = 'fiscal' | 'oferta' | 'recesion' | 'boom';
type AdCauseKey = 'consumo' | 'inversion' | 'gasto' | 'export';
type SrasCauseKey = 'energia' | 'salarios' | 'productividad';

interface Preset {
  id: PresetId;
  state: ADASState;
}

const PRESETS: Preset[] = [
  {
    id: 'fiscal',
    state: { adShift: 25, srasShift: 0, lrasShift: 0 },
  },
  {
    id: 'oferta',
    state: { adShift: 0, srasShift: -25, lrasShift: 0 },
  },
  {
    id: 'recesion',
    state: { adShift: -25, srasShift: 0, lrasShift: 0 },
  },
  {
    id: 'boom',
    state: { adShift: 35, srasShift: 0, lrasShift: 0 },
  },
];

// Demand-side causes the student can toggle (each nudges adShift).
const AD_CAUSES: ReadonlyArray<{ key: AdCauseKey; delta: number }> = [
  { key: 'consumo', delta: 10 },
  { key: 'inversion', delta: 10 },
  { key: 'gasto', delta: 10 },
  { key: 'export', delta: 10 },
];

// Supply-side causes (each nudges srasShift; cost rises shift SRAS left).
const SRAS_CAUSES: ReadonlyArray<{ key: SrasCauseKey; delta: number }> = [
  { key: 'energia', delta: -10 },
  { key: 'salarios', delta: -10 },
  { key: 'productividad', delta: 10 },
];

export default function ADASSimulator({ locale = 'es' }: Props) {
  const c = COPY[locale];
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
      <div class="calc__sub">{c.escenarios}</div>
      <div class="calc__presets">
        {PRESETS.map((p) => (
          <button
            type="button"
            class="calc__btn calc__btn--ghost"
            onClick={() => applyPreset(p)}
            title={c.presets[p.id].note}
          >
            {c.presets[p.id].label}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      <div class="calc__sub">{c.demandaAgregada}</div>
      <p class="adas__hint">{c.adHint}</p>
      <div class="adas__causes">
        {AD_CAUSES.map((cause) => (
          <button
            type="button"
            class="adas__cause adas__cause--terra"
            onClick={() => set('adShift', state.adShift + cause.delta)}
          >
            {c.adCauses[cause.key]} <span class="adas__cause-plus">+</span>
          </button>
        ))}
      </div>
      <SliderField
        label={c.adShiftLabel}
        min={-50}
        max={50}
        step={5}
        value={state.adShift}
        onChange={(v) => set('adShift', v)}
        accent="terra"
      />

      <div class="calc__sub">{c.ofertaCortoPlazo}</div>
      <p class="adas__hint">{c.srasHint}</p>
      <div class="adas__causes">
        {SRAS_CAUSES.map((cause) => (
          <button
            type="button"
            class="adas__cause adas__cause--mustard"
            onClick={() => set('srasShift', state.srasShift + cause.delta)}
          >
            {c.srasCauses[cause.key]} <span class="adas__cause-plus">{cause.delta > 0 ? '+' : '−'}</span>
          </button>
        ))}
      </div>
      <SliderField
        label={c.srasShiftLabel}
        min={-50}
        max={50}
        step={5}
        value={state.srasShift}
        onChange={(v) => set('srasShift', v)}
        accent="mustard"
      />

      <div class="calc__sub">{c.produccionPotencial}</div>
      <SliderField
        label={c.lrasShiftLabel}
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
          title={c.ajusteTitle}
        >
          {c.ajusteBtn}
        </button>
        {atPotential && (
          <span class="adas__lr-note">{c.yaEnPotencial}</span>
        )}
      </div>

      <div class="calc__results">
        <ADASChart state={state} result={result} locale={locale} />

        <div class="calc__metric calc__metric--primary">
          <span class="calc__metric-label">{c.brechaProduccion}</span>
          <span class="calc__metric-value">{fmtGap(result.outputGap)}</span>
          <span class="calc__metric-detail">{gapHeadline(result.gapKind, result.outputGapPct, locale)}</span>
        </div>

        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric">
            <span class="calc__metric-label">{c.nivelPrecios}</span>
            <span class="calc__metric-value">{formatNumber(result.shortRun.P, 1)}</span>
            <span class="calc__metric-detail">{fmtDelta(result.shortRun.P - BASE_P, locale)}{c.sobreIndiceBase}</span>
          </div>
          <div class="calc__metric">
            <span class="calc__metric-label">{c.produccionY}</span>
            <span class="calc__metric-value">{formatNumber(result.shortRun.Y, 1)}</span>
            <span class="calc__metric-detail">{fmtPctOfPotential(result.shortRun.Y, result.potentialY)}{c.delPotencial}</span>
          </div>
          <div class="calc__metric">
            <span class="calc__metric-label">{c.potencialLras}</span>
            <span class="calc__metric-value">{formatNumber(result.potentialY, 1)}</span>
            <span class="calc__metric-detail">{c.plenoEmpleo}</span>
          </div>
        </div>

        <div class="adas__interp">
          <p>{interpret(state, result, locale)}</p>
        </div>

        <details class="calc__details">
          <summary>{c.comoSeCalculan}</summary>
          <div class="calc__formula">
            <p>
              <strong>AD:</strong> P = {BASE_P} + ({BASE_Y} + {fmtSigned(state.adShift)}) − Y
              &nbsp;·&nbsp;
              <strong>SRAS:</strong> P = {BASE_P} + (Y − {BASE_Y} − {fmtSigned(state.srasShift)})
            </p>
            <p>
              <strong>{c.equilibrioCortoPlazo}</strong> (AD = SRAS): Y* ={' '}
              <strong>{formatNumber(result.shortRun.Y, 1)}</strong>, P* ={' '}
              <strong>{formatNumber(result.shortRun.P, 1)}</strong>.
            </p>
            <p>
              <strong>{c.largoPlazo}</strong> (AD = LRAS): {c.largoPlazoDesc1} Y** ={' '}
              <strong>{formatNumber(result.potentialY, 1)}</strong> {c.largoPlazoDesc2}
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
          padding: 0.9rem 1.1rem;
          border-radius: 4px;
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
  locale,
}: {
  state: ADASState;
  result: ReturnType<typeof solveADAS>;
  locale: Locale;
}) {
  const c = COPY[locale];
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
      aria-label={c.chartAria}
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
        {c.yAxis}
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
function fmtDelta(d: number, locale: Locale): string {
  if (Math.abs(d) < 0.05) return COPY[locale].sinVariacion;
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

function gapHeadline(kind: GapKind, pct: number, locale: Locale): string {
  const c = COPY[locale];
  const mag = formatNumber(Math.abs(pct), 1);
  if (kind === 'neutra') return c.gapNeutra;
  if (kind === 'inflacionaria') return c.gapInflacionaria(mag);
  return c.gapRecesiva(mag);
}

function interpret(state: ADASState, result: ReturnType<typeof solveADAS>, locale: Locale): string {
  const c = COPY[locale];
  const { adShift, srasShift } = state;
  const noShock = adShift === 0 && srasShift === 0 && state.lrasShift === 0;
  if (noShock) {
    return c.interpretInicial;
  }
  // Headline the dominant story.
  if (srasShift < 0 && result.shortRun.P > BASE_P && result.shortRun.Y < BASE_Y) {
    return c.interpretEstanflacion;
  }
  if (adShift > 0 && result.gapKind === 'inflacionaria') {
    return c.interpretExpansion;
  }
  if (adShift < 0 && result.gapKind === 'recesiva') {
    return c.interpretRecesion;
  }
  if (srasShift > 0) {
    return c.interpretMejoraOferta;
  }
  return c.interpretDefault;
}
