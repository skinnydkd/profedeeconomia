/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  costeCocheAnual,
  costeAlternativaAnual,
  compararMovilidad,
} from '../../lib/calc/coche';
import { formatEUR, formatNumber } from '../../lib/calc/format';

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
export default function CocheVsAlternativa() {
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
          Reiniciar valores
        </button>
      </div>

      {/* Two input columns. .calc__metric-grid is a responsive auto-fit grid
          that already exists in the shared stylesheet (stacks on mobile). */}
      <div class="calc__metric-grid">
        {/* ---- Columna coche ---- */}
        <div>
          <p class="calc__sub">Coche propio</p>

          <label class="calc__field">
            <span class="calc__label">Precio de compra</span>
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
            <span class="calc__label">Años de vida útil</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={1}
                step={1}
                value={anosVidaUtil}
                onInput={(e) => setAnosVidaUtil(num(e))}
              />
              <span class="calc__unit">años</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Kilómetros al año</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={500}
                value={kmAnuales}
                onInput={(e) => setKmAnuales(num(e))}
              />
              <span class="calc__unit">km/año</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Consumo</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={0.5}
                value={consumoL100}
                onInput={(e) => setConsumoL100(num(e))}
              />
              <span class="calc__unit">L/100 km</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Precio del combustible</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={0.05}
                value={precioCombustible}
                onInput={(e) => setPrecioCombustible(num(e))}
              />
              <span class="calc__unit">€/L</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Seguro</span>
            <div class="calc__input-wrap">
              <input type="number" min={0} step={10} value={seguro} onInput={(e) => setSeguro(num(e))} />
              <span class="calc__unit">€/año</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Mantenimiento y reparaciones</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={10}
                value={mantenimiento}
                onInput={(e) => setMantenimiento(num(e))}
              />
              <span class="calc__unit">€/año</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Impuestos (IVTM…)</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={impuestos}
                onInput={(e) => setImpuestos(num(e))}
              />
              <span class="calc__unit">€/año</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Aparcamiento</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={10}
                value={aparcamiento}
                onInput={(e) => setAparcamiento(num(e))}
              />
              <span class="calc__unit">€/año</span>
            </div>
          </label>
        </div>

        {/* ---- Columna alternativa ---- */}
        <div>
          <p class="calc__sub">Alternativa sin coche</p>

          <label class="calc__field">
            <span class="calc__label">Abono de transporte público</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={abonoTransporteMensual}
                onInput={(e) => setAbono(num(e))}
              />
              <span class="calc__unit">€/mes</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Viajes en taxi / VTC al mes</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={viajesTaxiMes}
                onInput={(e) => setViajesTaxi(num(e))}
              />
              <span class="calc__unit">viajes/mes</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Coste medio del viaje en taxi</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={costeMedioTaxi}
                onInput={(e) => setCosteTaxi(num(e))}
              />
              <span class="calc__unit">€/viaje</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Días de alquiler / car-sharing al año</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={1}
                value={alquilerPuntualDias}
                onInput={(e) => setAlquilerDias(num(e))}
              />
              <span class="calc__unit">días/año</span>
            </div>
          </label>

          <label class="calc__field">
            <span class="calc__label">Coste del día de alquiler</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={5}
                value={costeAlquilerDia}
                onInput={(e) => setCosteAlquiler(num(e))}
              />
              <span class="calc__unit">€/día</span>
            </div>
          </label>

          <div class="calc__metric" style="margin-top: 0.6rem;">
            <span class="calc__metric-label">Recuerda</span>
            <span class="calc__metric-detail">
              La alternativa no incluye depreciación, seguro ni impuestos: no
              tienes un coche que pierda valor cada año.
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
              ? 'Las dos opciones cuestan lo mismo'
              : ganaCoche
                ? 'Sale más barato el coche propio'
                : 'Sale más barata la alternativa sin coche'}
          </span>
          <span class="calc__metric-value">{formatEUR(comparacion.diferenciaAnual, 0)}</span>
          <span class="calc__metric-unit">de diferencia al año</span>
        </div>

        {/* Comparative bars. */}
        <p class="calc__sub">Coste total anual de cada opción</p>
        {/* Comparative bars built on the existing .calc__bar / .calc__bar-fill
            classes; the row layout is inline as it has no dedicated CSS. */}
        <div style="display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.6rem;">
          <span style="flex: 0 0 5.5rem; font-weight: 600;">Coche</span>
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
          <span style="flex: 0 0 5.5rem; font-weight: 600;">Alternativa</span>
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
            <span class="calc__metric-mini-label">Coste del coche por km</span>
            <span class="calc__metric-mini-value">
              {coche.costePorKm === null
                ? '—'
                : `${formatNumber(coche.costePorKm, 3)} €/km`}
            </span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Depreciación anual</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.depreciacion, 0)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Combustible anual</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.combustible, 0)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Costes fijos del coche</span>
            <span class="calc__metric-mini-value">{formatEUR(coche.fijos, 0)}</span>
          </div>
        </div>

        {comparacion.kmEquilibrio !== null && (
          <div class="calc__warning is-ok">
            A partir de unos{' '}
            <strong>{formatNumber(comparacion.kmEquilibrio, 0)} km al año</strong> el
            coche propio empezaría a salir más barato que esta alternativa
            (manteniendo el resto de datos igual).
          </div>
        )}

        <details class="calc__details">
          <summary>Los costes ocultos del coche</summary>
          <div class="calc__formula">
            <p>
              Cuando pensamos en lo que cuesta un coche solemos fijarnos solo en
              la <strong>gasolina</strong>. Pero el combustible suele ser la parte
              pequeña: lo caro es lo que no se ve en el día a día.
            </p>
            <p>
              La <strong>depreciación</strong> (el valor que pierde el coche cada
              año) es casi siempre el mayor coste, seguida del{' '}
              <strong>seguro</strong>, el <strong>mantenimiento</strong>, los{' '}
              <strong>impuestos</strong> y el <strong>aparcamiento</strong>. Por eso
              dividir el coste total entre los kilómetros recorridos (coste por km)
              ayuda a comparar de forma justa con no tener coche.
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
