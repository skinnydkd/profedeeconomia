/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import {
  costeCocheAnual,
  costeAlternativaAnual,
  compararMovilidad,
} from '../../lib/calc/coche';
import { formatEUR, formatNumber } from '../../lib/calc/format';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation and
 * units (€, %, km, L/100 km, €/L…) are not translated. Mirrors the sibling
 * calculators.
 */
export const COPY = {
  es: {
    reiniciar: 'Reiniciar valores',
    cocheSub: 'Coche propio',
    precioCompra: 'Precio de compra',
    anosVidaUtil: 'Años de vida útil',
    unitAnos: 'años',
    kmAnuales: 'Kilómetros al año',
    unitKmAnio: 'km/año',
    consumo: 'Consumo',
    unitL100: 'L/100 km',
    precioCombustible: 'Precio del combustible',
    unitEurL: '€/L',
    seguro: 'Seguro',
    unitEurAnio: '€/año',
    mantenimiento: 'Mantenimiento y reparaciones',
    impuestos: 'Impuestos (IVTM…)',
    aparcamiento: 'Aparcamiento',
    altSub: 'Alternativa sin coche',
    abonoTransporte: 'Abono de transporte público',
    unitEurMes: '€/mes',
    viajesTaxi: 'Viajes en taxi / VTC al mes',
    unitViajesMes: 'viajes/mes',
    costeMedioTaxi: 'Coste medio del viaje en taxi',
    unitEurViaje: '€/viaje',
    diasAlquiler: 'Días de alquiler / car-sharing al año',
    unitDiasAnio: 'días/año',
    costeAlquilerDia: 'Coste del día de alquiler',
    unitEurDia: '€/día',
    recuerda: 'Recuerda',
    recuerdaDetalle:
      'La alternativa no incluye depreciación, seguro ni impuestos: no tienes un coche que pierda valor cada año.',
    verdictEmpate: 'Las dos opciones cuestan lo mismo',
    verdictCoche: 'Sale más barato el coche propio',
    verdictAlt: 'Sale más barata la alternativa sin coche',
    deDiferencia: 'de diferencia al año',
    costeTotalAnual: 'Coste total anual de cada opción',
    barCoche: 'Coche',
    barAlt: 'Alternativa',
    costePorKm: 'Coste del coche por km',
    depreciacionAnual: 'Depreciación anual',
    combustibleAnual: 'Combustible anual',
    costesFijos: 'Costes fijos del coche',
    kmEquilibrioPre: 'A partir de unos',
    kmEquilibrioKmAnio: 'km al año',
    kmEquilibrioPost:
      ' el coche propio empezaría a salir más barato que esta alternativa (manteniendo el resto de datos igual).',
    ocultosSummary: 'Los costes ocultos del coche',
    ocultosP1a: 'Cuando pensamos en lo que cuesta un coche solemos fijarnos solo en la ',
    ocultosGasolina: 'gasolina',
    ocultosP1b:
      '. Pero el combustible suele ser la parte pequeña: lo caro es lo que no se ve en el día a día.',
    ocultosP2a: 'La ',
    ocultosDepreciacion: 'depreciación',
    ocultosP2b:
      ' (el valor que pierde el coche cada año) es casi siempre el mayor coste, seguida del ',
    ocultosSeguro: 'seguro',
    ocultosP2c: ', el ',
    ocultosMantenimiento: 'mantenimiento',
    ocultosP2d: ', los ',
    ocultosImpuestos: 'impuestos',
    ocultosP2e: ' y el ',
    ocultosAparcamiento: 'aparcamiento',
    ocultosP2f:
      '. Por eso dividir el coste total entre los kilómetros recorridos (coste por km) ayuda a comparar de forma justa con no tener coche.',
  },
  ca: {
    reiniciar: 'Reiniciar valors',
    cocheSub: 'Cotxe propi',
    precioCompra: 'Preu de compra',
    anosVidaUtil: 'Anys de vida útil',
    unitAnos: 'anys',
    kmAnuales: "Quilòmetres a l'any",
    unitKmAnio: 'km/any',
    consumo: 'Consum',
    unitL100: 'L/100 km',
    precioCombustible: 'Preu del combustible',
    unitEurL: '€/L',
    seguro: 'Assegurança',
    unitEurAnio: '€/any',
    mantenimiento: 'Manteniment i reparacions',
    impuestos: 'Impostos (IVTM…)',
    aparcamiento: 'Aparcament',
    altSub: 'Alternativa sense cotxe',
    abonoTransporte: 'Abonament de transport públic',
    unitEurMes: '€/mes',
    viajesTaxi: 'Viatges en taxi / VTC al mes',
    unitViajesMes: 'viatges/mes',
    costeMedioTaxi: 'Cost mitjà del viatge en taxi',
    unitEurViaje: '€/viatge',
    diasAlquiler: "Dies de lloguer / car-sharing a l'any",
    unitDiasAnio: 'dies/any',
    costeAlquilerDia: 'Cost del dia de lloguer',
    unitEurDia: '€/dia',
    recuerda: 'Recorda',
    recuerdaDetalle:
      "L'alternativa no inclou depreciació, assegurança ni impostos: no tens un cotxe que perda valor cada any.",
    verdictEmpate: 'Les dues opcions costen el mateix',
    verdictCoche: 'Ix més barat el cotxe propi',
    verdictAlt: "Ix més barata l'alternativa sense cotxe",
    deDiferencia: "de diferència a l'any",
    costeTotalAnual: 'Cost total anual de cada opció',
    barCoche: 'Cotxe',
    barAlt: 'Alternativa',
    costePorKm: 'Cost del cotxe per km',
    depreciacionAnual: 'Depreciació anual',
    combustibleAnual: 'Combustible anual',
    costesFijos: 'Costos fixos del cotxe',
    kmEquilibrioPre: "A partir d'uns",
    kmEquilibrioKmAnio: "km a l'any",
    kmEquilibrioPost:
      ' el cotxe propi començaria a eixir més barat que esta alternativa (mantenint la resta de dades igual).',
    ocultosSummary: 'Els costos ocults del cotxe',
    ocultosP1a: 'Quan pensem en el que costa un cotxe, solem fixar-nos només en la ',
    ocultosGasolina: 'gasolina',
    ocultosP1b:
      '. Però el combustible sol ser la part xicoteta: el car és el que no es veu en el dia a dia.',
    ocultosP2a: 'La ',
    ocultosDepreciacion: 'depreciació',
    ocultosP2b:
      " (el valor que perd el cotxe cada any) és quasi sempre el major cost, seguida de l'",
    ocultosSeguro: 'assegurança',
    ocultosP2c: ', el ',
    ocultosMantenimiento: 'manteniment',
    ocultosP2d: ', els ',
    ocultosImpuestos: 'impostos',
    ocultosP2e: " i l'",
    ocultosAparcamiento: 'aparcament',
    ocultosP2f:
      '. Per això, dividir el cost total entre els quilòmetres recorreguts (cost per km) ajuda a comparar de manera justa amb no tindre cotxe.',
  },
} as const;

interface Props { locale?: Locale }

/**
 * Coche propio vs. alternativa de movilidad — calculator for Eco 4ESO
 * (decisiones de consumo / economía personal).
 *
 * Compares the total annual cost (and the cost per km) of owning a private car
 * against a car-free mix of public-transport pass + occasional rental/car-sharing
 * + taxi rides. The teaching point is the hidden cost of car ownership:
 * depreciation, insurance, maintenance, taxes and parking, not just fuel.
 *
 * Mirrors the .calc__* layout shared by the other interactive calculators.
 */
export default function CocheVsAlternativa({ locale = 'es' }: Props) {
  const c = COPY[locale];
  // Car inputs — realistic Spanish defaults (mid-size used car, average use).
  const [precioCompra, setPrecioCompra] = useState<number>(18000);
  const [anosVidaUtil, setAnosVidaUtil] = useState<number>(10);
  const [kmAnuales, setKmAnuales] = useState<number>(12000);
  const [consumoL100, setConsumoL100] = useState<number>(6);
  const [precioCombustible, setPrecioCombustible] = useState<number>(1.55);
  const [seguro, setSeguro] = useState<number>(500);
  const [mantenimiento, setMantenimiento] = useState<number>(700);
  const [impuestos, setImpuestos] = useState<number>(120);
  const [aparcamiento, setAparcamiento] = useState<number>(600);

  // Alternative inputs.
  const [abonoTransporteMensual, setAbono] = useState<number>(40);
  const [viajesTaxiMes, setViajesTaxi] = useState<number>(4);
  const [costeMedioTaxi, setCosteTaxi] = useState<number>(12);
  const [alquilerPuntualDias, setAlquilerDias] = useState<number>(15);
  const [costeAlquilerDia, setCosteAlquiler] = useState<number>(45);

  const { coche, alternativa, comparacion } = useMemo(() => {
    const coche = costeCocheAnual({
      precioCompra,
      anosVidaUtil,
      kmAnuales,
      consumoL100,
      precioCombustible,
      seguro,
      mantenimiento,
      impuestos,
      aparcamiento,
    });
    const alternativa = costeAlternativaAnual({
      abonoTransporteMensual,
      viajesTaxiMes,
      costeMedioTaxi,
      alquilerPuntualDias,
      costeAlquilerDia,
    });
    const comparacion = compararMovilidad(
      { ...coche, kmAnuales, consumoL100, precioCombustible },
      alternativa
    );
    return { coche, alternativa, comparacion };
  }, [
    precioCompra,
    anosVidaUtil,
    kmAnuales,
    consumoL100,
    precioCombustible,
    seguro,
    mantenimiento,
    impuestos,
    aparcamiento,
    abonoTransporteMensual,
    viajesTaxiMes,
    costeMedioTaxi,
    alquilerPuntualDias,
    costeAlquilerDia,
  ]);

  function reset() {
    setPrecioCompra(18000);
    setAnosVidaUtil(10);
    setKmAnuales(12000);
    setConsumoL100(6);
    setPrecioCombustible(1.55);
    setSeguro(500);
    setMantenimiento(700);
    setImpuestos(120);
    setAparcamiento(600);
    setAbono(40);
    setViajesTaxi(4);
    setCosteTaxi(12);
    setAlquilerDias(15);
    setCosteAlquiler(45);
  }

  // Comparative bar widths (relative to the more expensive option).
  const maxTotal = Math.max(coche.total, alternativa.total, 1);
  const anchoCoche = (coche.total / maxTotal) * 100;
  const anchoAlt = (alternativa.total / maxTotal) * 100;

  const ganaCoche = comparacion.opcionMasBarata === 'coche';
  const ganaAlt = comparacion.opcionMasBarata === 'alternativa';

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      {/* Two input columns. .calc__metric-grid is a responsive auto-fit grid
          that already exists in the shared stylesheet (stacks on mobile). */}
      <div class="calc__metric-grid">
        {/* ---- Columna coche ---- */}
        <div>
          <p class="calc__sub">{c.cocheSub}</p>

          <label class="calc__field">
            <span class="calc__label">{c.precioCompra}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={500}
                value={precioCompra}
                onInput={(e) => setPrecioCompra(num(e))}
              />
              <span class="calc__unit">€</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.anosVidaUtil}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={1}
                step={1}
                value={anosVidaUtil}
                onInput={(e) => setAnosVidaUtil(num(e))}
              />
              <span class="calc__unit">{c.unitAnos}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.kmAnuales}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={500}
                value={kmAnuales}
                onInput={(e) => setKmAnuales(num(e))}
              />
              <span class="calc__unit">{c.unitKmAnio}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.consumo}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={0.5}
                value={consumoL100}
                onInput={(e) => setConsumoL100(num(e))}
              />
              <span class="calc__unit">{c.unitL100}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.precioCombustible}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={0.05}
                value={precioCombustible}
                onInput={(e) => setPrecioCombustible(num(e))}
              />
              <span class="calc__unit">{c.unitEurL}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.seguro}</span>
            <div class="calc__input-wrap">
              <input type="number" min={0} step={10} value={seguro} onInput={(e) => setSeguro(num(e))} />
              <span class="calc__unit">{c.unitEurAnio}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.mantenimiento}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={10}
                value={mantenimiento}
                onInput={(e) => setMantenimiento(num(e))}
              />
              <span class="calc__unit">{c.unitEurAnio}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.impuestos}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={impuestos}
                onInput={(e) => setImpuestos(num(e))}
              />
              <span class="calc__unit">{c.unitEurAnio}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.aparcamiento}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={10}
                value={aparcamiento}
                onInput={(e) => setAparcamiento(num(e))}
              />
              <span class="calc__unit">{c.unitEurAnio}</span>
            </div>
          </label>
        </div>

        {/* ---- Columna alternativa ---- */}
        <div>
          <p class="calc__sub">{c.altSub}</p>

          <label class="calc__field">
            <span class="calc__label">{c.abonoTransporte}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={abonoTransporteMensual}
                onInput={(e) => setAbono(num(e))}
              />
              <span class="calc__unit">{c.unitEurMes}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.viajesTaxi}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={viajesTaxiMes}
                onInput={(e) => setViajesTaxi(num(e))}
              />
              <span class="calc__unit">{c.unitViajesMes}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.costeMedioTaxi}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={costeMedioTaxi}
                onInput={(e) => setCosteTaxi(num(e))}
              />
              <span class="calc__unit">{c.unitEurViaje}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.diasAlquiler}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={alquilerPuntualDias}
                onInput={(e) => setAlquilerDias(num(e))}
              />
              <span class="calc__unit">{c.unitDiasAnio}</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">{c.costeAlquilerDia}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={costeAlquilerDia}
                onInput={(e) => setCosteAlquiler(num(e))}
              />
              <span class="calc__unit">{c.unitEurDia}</span>
            </div>
          </label>

          <div class="calc__metric" style="margin-top: 0.6rem;">
            <span class="calc__metric-label">{c.recuerda}</span>
            <span class="calc__metric-detail">
              {c.recuerdaDetalle}
            </span>
          </div>
        </div>
      </div>

      <div class="calc__results">
        {/* Highlighted verdict. */}
        <div
          class={`calc__metric calc__metric--primary ${
            ganaAlt ? 'calc__metric--ok' : ''
          }`}
        >
          <span class="calc__metric-label">
            {comparacion.opcionMasBarata === 'empate'
              ? c.verdictEmpate
              : ganaCoche
                ? c.verdictCoche
                : c.verdictAlt}
          </span>
          <span class="calc__metric-value">{formatEUR(comparacion.diferenciaAnual, 0)}</span>
          <span class="calc__metric-unit">{c.deDiferencia}</span>
        </div>

        {/* Comparative bars. */}
        <p class="calc__sub">{c.costeTotalAnual}</p>
        {/* Comparative bars built on the existing .calc__bar / .calc__bar-fill
            classes; the row layout is inline as it has no dedicated CSS. */}
        <div style="display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.6rem;">
          <span style="flex: 0 0 5.5rem; font-weight: 600;">{c.barCoche}</span>
          <div class="calc__bar" style="flex: 1; margin: 0;">
            <div
              class="calc__bar-fill"
              style={{ width: `${anchoCoche}%`, background: 'var(--color-terra)' }}
            />
          </div>
          <span style="flex: 0 0 auto; font-family: var(--font-mono); font-weight: 600;">
            {formatEUR(coche.total, 0)}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.7rem;">
          <span style="flex: 0 0 5.5rem; font-weight: 600;">{c.barAlt}</span>
          <div class="calc__bar" style="flex: 1; margin: 0;">
            <div
              class="calc__bar-fill"
              style={{ width: `${anchoAlt}%`, background: 'var(--color-mustard)' }}
            />
          </div>
          <span style="flex: 0 0 auto; font-family: var(--font-mono); font-weight: 600;">
            {formatEUR(alternativa.total, 0)}
          </span>
        </div>

        {/* Key metrics. */}
        <div class="calc__metric-grid">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.costePorKm}</span>
            <span class="calc__metric-mini-value">
              {coche.costePorKm === null
                ? '—'
                : `${formatNumber(coche.costePorKm, 3)} €/km`}
            </span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.depreciacionAnual}</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.depreciacion, 0)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.combustibleAnual}</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.combustible, 0)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.costesFijos}</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.fijos, 0)}</span>
          </div>
        </div>

        {comparacion.kmEquilibrio !== null && (
          <div class="calc__warning is-ok">
            {c.kmEquilibrioPre}{' '}
            <strong>{formatNumber(comparacion.kmEquilibrio, 0)} {c.kmEquilibrioKmAnio}</strong>{c.kmEquilibrioPost}
          </div>
        )}

        <details class="calc__details">
          <summary>{c.ocultosSummary}</summary>
          <div class="calc__formula">
            <p>
              {c.ocultosP1a}<strong>{c.ocultosGasolina}</strong>{c.ocultosP1b}
            </p>
            <p>
              {c.ocultosP2a}<strong>{c.ocultosDepreciacion}</strong>{c.ocultosP2b}
              <strong>{c.ocultosSeguro}</strong>{c.ocultosP2c}<strong>{c.ocultosMantenimiento}</strong>{c.ocultosP2d}
              <strong>{c.ocultosImpuestos}</strong>{c.ocultosP2e}<strong>{c.ocultosAparcamiento}</strong>{c.ocultosP2f}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

/** Read a numeric value from an input event, defaulting to 0. */
function num(e: Event): number {
  return parseFloat((e.target as HTMLInputElement).value) || 0;
}
