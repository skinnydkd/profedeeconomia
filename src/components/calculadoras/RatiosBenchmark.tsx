/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { formatNumber, formatPercent } from '../../lib/calc/format';
import {
  evaluarEmpresa,
  esFavorable,
  RATIOS,
  SECTORES,
  type Categoria,
  type DatosEmpresa,
  type Evaluacion,
  type Posicion,
  type SectorId,
} from '../../lib/calc/ratios-benchmark';

/**
 * Sector-benchmarked financial ratios calculator (EDMN 2BACH, Unit 11).
 *
 * Differs from `RatiosCalc.tsx`: instead of fixed "healthy" thresholds, it
 * compares each ratio against an *orientative* benchmark band for the chosen
 * sector and shows whether the company falls below / inside / above it. All the
 * maths and the benchmark dataset live in `lib/calc/ratios-benchmark.ts` (pure,
 * unit-tested); this component is only the UI. It reuses the shared `.calc__*`
 * styles defined in the recurso page.
 */

const CATEGORIA_LABEL: Record<Categoria, string> = {
  liquidez: 'Liquidez',
  endeudamiento: 'Endeudamiento',
  rentabilidad: 'Rentabilidad',
  rotacion: 'Rotación',
};

const POSICION_LABEL: Record<Posicion, string> = {
  bajo: 'Por debajo del sector',
  dentro: 'Dentro del rango',
  alto: 'Por encima del sector',
  sinDato: 'Sin dato',
};

const CATEGORIA_ORDEN: Categoria[] = ['liquidez', 'endeudamiento', 'rentabilidad', 'rotacion'];

export default function RatiosBenchmark() {
  // Sector selector.
  const [sector, setSector] = useState<SectorId>('comercio');

  // Balance — activo.
  const [activoCorriente, setActivoCorriente] = useState<number>(200);
  const [existencias, setExistencias] = useState<number>(80);
  const [activoTotal, setActivoTotal] = useState<number>(400);
  // Balance — financiación.
  const [pasivoCorriente, setPasivoCorriente] = useState<number>(100);
  const [deudaTotal, setDeudaTotal] = useState<number>(200);
  const [patrimonioNeto, setPatrimonioNeto] = useState<number>(200);
  // Cuenta de PyG.
  const [ventas, setVentas] = useState<number>(600);
  const [baii, setBaii] = useState<number>(48);
  const [beneficioNeto, setBeneficioNeto] = useState<number>(30);

  const datos: DatosEmpresa = {
    activoCorriente,
    pasivoCorriente,
    existencias,
    deudaTotal,
    patrimonioNeto,
    activoTotal,
    ventas,
    beneficioNeto,
    baii,
  };

  const evaluacion = useMemo(() => evaluarEmpresa(datos, sector), [
    activoCorriente,
    pasivoCorriente,
    existencias,
    deudaTotal,
    patrimonioNeto,
    activoTotal,
    ventas,
    beneficioNeto,
    baii,
    sector,
  ]);

  // Coherence checks to warn the student (not blocking).
  const cuadra = Math.abs(activoTotal - (patrimonioNeto + deudaTotal)) < 0.01;
  const pcMayorDeuda = pasivoCorriente > deudaTotal + 0.01;
  const sectorActual = SECTORES.find((s) => s.id === sector)!;

  const porCategoria = CATEGORIA_ORDEN.map((cat) => ({
    cat,
    items: evaluacion.filter((e) => e.def.categoria === cat),
  }));

  return (
    <div class="calc">
      <div class="calc__sub">Sector de la empresa</div>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Comparar con el sector</span>
          <div class="calc__input-wrap">
            <select
              value={sector}
              onChange={(e) => setSector((e.target as HTMLSelectElement).value as SectorId)}
            >
              {SECTORES.map((s) => (
                <option value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <p class="calc__note">{sectorActual.nota}</p>

      <div class="calc__sub">Balance — Activo</div>
      <div class="calc__form">
        <NumberField label="Activo corriente" value={activoCorriente} setValue={setActivoCorriente} unit="mil €" />
        <NumberField label="Existencias" value={existencias} setValue={setExistencias} unit="mil €" />
        <NumberField label="Activo total" value={activoTotal} setValue={setActivoTotal} unit="mil €" />
      </div>

      <div class="calc__sub">Balance — Financiación</div>
      <div class="calc__form">
        <NumberField label="Pasivo corriente" value={pasivoCorriente} setValue={setPasivoCorriente} unit="mil €" />
        <NumberField label="Deuda total (pasivo)" value={deudaTotal} setValue={setDeudaTotal} unit="mil €" />
        <NumberField label="Patrimonio neto" value={patrimonioNeto} setValue={setPatrimonioNeto} unit="mil €" />
      </div>

      <div class="calc__sub">Cuenta de pérdidas y ganancias</div>
      <div class="calc__form">
        <NumberField label="Ventas (cifra de negocio)" value={ventas} setValue={setVentas} unit="mil €" />
        <NumberField label="BAII (resultado de explotación)" value={baii} setValue={setBaii} unit="mil €" />
        <NumberField label="Beneficio neto" value={beneficioNeto} setValue={setBeneficioNeto} unit="mil €" />
      </div>

      <div class="calc__results">
        <div class={`calc__warning ${cuadra ? 'is-ok' : ''}`}>
          {cuadra
            ? `✓ El balance cuadra: activo total = patrimonio neto + deuda = ${formatNumber(activoTotal, 0)} mil €.`
            : `⚠ Revisa el balance: activo total (${formatNumber(activoTotal, 0)}) ≠ patrimonio neto + deuda (${formatNumber(patrimonioNeto + deudaTotal, 0)} mil €).`}
        </div>
        {pcMayorDeuda && (
          <div class="calc__warning">
            ⚠ El pasivo corriente no puede ser mayor que la deuda total.
          </div>
        )}

        {porCategoria.map(({ cat, items }) => (
          <>
            <div class="calc__sub">{CATEGORIA_LABEL[cat]}</div>
            <div class="calc__metric-grid calc__metric-grid--three">
              {items.map((ev) => (
                <RatioMetric ev={ev} />
              ))}
            </div>
          </>
        ))}

        <table class="calc__table">
          <thead>
            <tr>
              <th>Ratio</th>
              <th>Valor</th>
              <th>Rango sector</th>
              <th>Posición</th>
            </tr>
          </thead>
          <tbody>
            {evaluacion.map((ev) => (
              <tr>
                <td>{ev.def.nombre}</td>
                <td>{fmtValor(ev)}</td>
                <td>{fmtRango(ev)}</td>
                <td>{POSICION_LABEL[ev.posicion]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p class="calc__note">
          Los rangos por sector son <strong>valores de referencia orientativos</strong> para el
          aula, no cifras oficiales. Para un análisis real consulta estadísticas sectoriales
          oficiales (p. ej. la Central de Balances del Banco de España).
        </p>

        <details class="calc__details">
          <summary>Cómo se calcula cada ratio</summary>
          <div class="calc__formula">
            {RATIOS.map((def) => (
              <p>
                <strong>{def.nombre}</strong> = {def.formula}. <em>{def.descripcion}</em>
              </p>
            ))}
            <p>
              <strong>Lectura por sector</strong>: «sano» depende del sector. Un comercio vive con
              liquidez baja y mucha rotación; una tecnológica, con poca deuda y márgenes amplios.
              Por eso comparamos cada ratio con la banda típica del sector elegido.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                              */
/* -------------------------------------------------------------------------- */

function RatioMetric({ ev }: { ev: Evaluacion }) {
  const ok = esFavorable(ev.id, ev.posicion);
  return (
    <div class={`calc__metric ${ok ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
      <span class="calc__metric-label">{ev.def.nombre}</span>
      <span class="calc__metric-value">{fmtValor(ev)}</span>
      <span class="calc__metric-detail">
        {POSICION_LABEL[ev.posicion]} · sector {fmtRango(ev)}
      </span>
    </div>
  );
}

function NumberField({
  label,
  value,
  setValue,
  unit,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  unit: string;
}) {
  return (
    <label class="calc__field">
      <span class="calc__label">{label}</span>
      <div class="calc__input-wrap">
        <input
          type="number"
          step={1}
          value={value}
          onInput={(e) => setValue(parseFloat((e.target as HTMLInputElement).value) || 0)}
        />
        <span class="calc__unit">{unit}</span>
      </div>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Formatting helpers (es-ES, accents preserved)                             */
/* -------------------------------------------------------------------------- */

/** Format a ratio value honouring its unit (coefficient or percentage). */
function fmtValor(ev: Evaluacion): string {
  if (ev.valor === null) return '—';
  return ev.def.unidad === 'porcentaje'
    ? formatPercent(ev.valor, 1, true)
    : formatNumber(ev.valor, 2);
}

/** Format the sector band honouring the ratio unit. */
function fmtRango(ev: Evaluacion): string {
  const [lo, hi] = ev.rango;
  return ev.def.unidad === 'porcentaje'
    ? `${formatPercent(lo, 0, true)} – ${formatPercent(hi, 0, true)}`
    : `${formatNumber(lo, 2)} – ${formatNumber(hi, 2)}`;
}
