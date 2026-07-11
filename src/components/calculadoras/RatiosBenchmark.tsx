/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { formatNumber, formatPercent } from '../../lib/calc/format';
import { type Locale } from '@/i18n/locale';
import {
  evaluarEmpresa,
  esFavorable,
  RATIOS,
  SECTORES,
  type Categoria,
  type DatosEmpresa,
  type Evaluacion,
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

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (ROE, ROA, €, %, ratio formulas) is not translated: the formula expressions
 * come straight from `RATIOS[].formula`. Sector and ratio labels/notes live in
 * the imported dataset keyed by structural id (SectorId / RatioId); the ids stay
 * as lookup keys and only the displayed label is translated here. Guarded by
 * copy-parity.test.ts.
 */
export const COPY = {
  es: {
    sectorEmpresa: 'Sector de la empresa',
    compararSector: 'Comparar con el sector',
    balanceActivo: 'Balance — Activo',
    balanceFinanciacion: 'Balance — Financiación',
    cuentaPyG: 'Cuenta de pérdidas y ganancias',
    unit: 'mil €',
    lblActivoCorriente: 'Activo corriente',
    lblExistencias: 'Existencias',
    lblActivoTotal: 'Activo total',
    lblPasivoCorriente: 'Pasivo corriente',
    lblDeudaTotal: 'Deuda total (pasivo)',
    lblPatrimonioNeto: 'Patrimonio neto',
    lblVentas: 'Ventas (cifra de negocio)',
    lblBaii: 'BAII (resultado de explotación)',
    lblBeneficioNeto: 'Beneficio neto',
    balanceCuadra: (v: string) =>
      `✓ El balance cuadra: activo total = patrimonio neto + deuda = ${v} mil €.`,
    balanceNoCuadra: (a: string, pnd: string) =>
      `⚠ Revisa el balance: activo total (${a}) ≠ patrimonio neto + deuda (${pnd} mil €).`,
    pcMayorDeuda: '⚠ El pasivo corriente no puede ser mayor que la deuda total.',
    thRatio: 'Ratio',
    thValor: 'Valor',
    thRango: 'Rango sector',
    thPosicion: 'Posición',
    notaRangos1: 'Los rangos por sector son ',
    notaRangosStrong: 'valores de referencia orientativos',
    notaRangos2:
      ' para el aula, no cifras oficiales. Para un análisis real consulta estadísticas sectoriales oficiales (p. ej. la Central de Balances del Banco de España).',
    comoSeCalcula: 'Cómo se calcula cada ratio',
    lecturaStrong: 'Lectura por sector',
    lecturaTexto:
      ': «sano» depende del sector. Un comercio vive con liquidez baja y mucha rotación; una tecnológica, con poca deuda y márgenes amplios. Por eso comparamos cada ratio con la banda típica del sector elegido.',
    metricSector: 'sector',
    categoria: {
      liquidez: 'Liquidez',
      endeudamiento: 'Endeudamiento',
      rentabilidad: 'Rentabilidad',
      rotacion: 'Rotación',
    },
    posicion: {
      bajo: 'Por debajo del sector',
      dentro: 'Dentro del rango',
      alto: 'Por encima del sector',
      sinDato: 'Sin dato',
    },
    sectorNombre: {
      comercio: 'Comercio / retail',
      industria: 'Industria / fabricación',
      hosteleria: 'Hostelería / restauración',
      tecnologia: 'Tecnología / servicios',
    },
    sectorNota: {
      comercio: 'Mucha rotación, márgenes ajustados y liquidez baja (cobra al contado, paga a plazo).',
      industria: 'Activo fijo elevado, más deuda y rotación baja; márgenes intermedios.',
      hosteleria: 'Rotación alta, márgenes estrechos y a menudo bastante apalancada.',
      tecnologia: 'Poco activo y poca deuda, alta autonomía y márgenes amplios.',
    },
    ratioNombre: {
      liquidez: 'Liquidez (ratio corriente)',
      acida: 'Prueba ácida (test ácido)',
      endeudamiento: 'Endeudamiento',
      autonomia: 'Autonomía financiera',
      roe: 'ROE (rentabilidad financiera)',
      roa: 'ROA (rentabilidad económica)',
      margenNeto: 'Margen neto sobre ventas',
      rotacionActivos: 'Rotación de activos',
    },
    ratioDescripcion: {
      liquidez:
        'Cuántas veces el activo a corto plazo cubre las deudas a corto plazo. Por debajo de 1 hay riesgo de no poder pagar.',
      acida: 'Como la liquidez pero sin contar las existencias, que no siempre se venden rápido.',
      endeudamiento: 'Porcentaje del activo financiado con deuda. Cuanto más alto, más dependencia externa.',
      autonomia:
        'Porcentaje del activo financiado con recursos propios. Es el complemento del endeudamiento.',
      roe: 'Rendimiento que obtienen los socios sobre el capital que han aportado.',
      roa: 'Eficiencia del activo para generar beneficio, al margen de cómo se financie.',
      margenNeto: 'Cuánto beneficio queda por cada euro vendido.',
      rotacionActivos: 'Cuántos euros de ventas genera cada euro invertido en activo.',
    },
  },
  ca: {
    sectorEmpresa: "Sector de l'empresa",
    compararSector: 'Comparar amb el sector',
    balanceActivo: 'Balanç — Actiu',
    balanceFinanciacion: 'Balanç — Finançament',
    cuentaPyG: 'Compte de pèrdues i guanys',
    unit: 'mil €',
    lblActivoCorriente: 'Actiu corrent',
    lblExistencias: 'Existències',
    lblActivoTotal: 'Actiu total',
    lblPasivoCorriente: 'Passiu corrent',
    lblDeudaTotal: 'Deute total (passiu)',
    lblPatrimonioNeto: 'Patrimoni net',
    lblVentas: 'Vendes (xifra de negoci)',
    lblBaii: "BAII (resultat d'explotació)",
    lblBeneficioNeto: 'Benefici net',
    balanceCuadra: (v: string) =>
      `✓ El balanç quadra: actiu total = patrimoni net + deute = ${v} mil €.`,
    balanceNoCuadra: (a: string, pnd: string) =>
      `⚠ Revisa el balanç: actiu total (${a}) ≠ patrimoni net + deute (${pnd} mil €).`,
    pcMayorDeuda: '⚠ El passiu corrent no pot ser major que el deute total.',
    thRatio: 'Ràtio',
    thValor: 'Valor',
    thRango: 'Rang sector',
    thPosicion: 'Posició',
    notaRangos1: 'Els rangs per sector són ',
    notaRangosStrong: 'valors de referència orientatius',
    notaRangos2:
      " per a l'aula, no xifres oficials. Per a una anàlisi real consulta estadístiques sectorials oficials (p. ex. la Central de Balanços del Banc d'Espanya).",
    comoSeCalcula: 'Com es calcula cada ràtio',
    lecturaStrong: 'Lectura per sector',
    lecturaTexto:
      ': «sa» depén del sector. Un comerç viu amb liquiditat baixa i molta rotació; una tecnològica, amb poc deute i marges amplis. Per això comparem cada ràtio amb la banda típica del sector triat.',
    metricSector: 'sector',
    categoria: {
      liquidez: 'Liquiditat',
      endeudamiento: 'Endeutament',
      rentabilidad: 'Rendibilitat',
      rotacion: 'Rotació',
    },
    posicion: {
      bajo: 'Per davall del sector',
      dentro: 'Dins del rang',
      alto: 'Per damunt del sector',
      sinDato: 'Sense dada',
    },
    sectorNombre: {
      comercio: 'Comerç / retail',
      industria: 'Indústria / fabricació',
      hosteleria: 'Hostaleria / restauració',
      tecnologia: 'Tecnologia / servicis',
    },
    sectorNota: {
      comercio: 'Molta rotació, marges ajustats i liquiditat baixa (cobra al comptat, paga a termini).',
      industria: 'Actiu fix elevat, més deute i rotació baixa; marges intermedis.',
      hosteleria: 'Rotació alta, marges estrets i sovint prou palanquejada.',
      tecnologia: 'Poc actiu i poc deute, alta autonomia i marges amplis.',
    },
    ratioNombre: {
      liquidez: 'Liquiditat (ràtio corrent)',
      acida: 'Prova àcida (test àcid)',
      endeudamiento: 'Endeutament',
      autonomia: 'Autonomia financera',
      roe: 'ROE (rendibilitat financera)',
      roa: 'ROA (rendibilitat econòmica)',
      margenNeto: 'Marge net sobre vendes',
      rotacionActivos: "Rotació d'actius",
    },
    ratioDescripcion: {
      liquidez:
        "Quantes vegades l'actiu a curt termini cobrix els deutes a curt termini. Per davall d'1 hi ha risc de no poder pagar.",
      acida: 'Com la liquiditat però sense comptar les existències, que no sempre es venen ràpid.',
      endeudamiento: "Percentatge de l'actiu finançat amb deute. Com més alt, més dependència externa.",
      autonomia:
        "Percentatge de l'actiu finançat amb recursos propis. És el complement de l'endeutament.",
      roe: 'Rendiment que obtenen els socis sobre el capital que han aportat.',
      roa: "Eficiència de l'actiu per a generar benefici, al marge de com es finance.",
      margenNeto: 'Quant benefici queda per cada euro venut.',
      rotacionActivos: 'Quants euros de vendes genera cada euro invertit en actiu.',
    },
  },
} as const;

interface Props { locale?: Locale }

const CATEGORIA_ORDEN: Categoria[] = ['liquidez', 'endeudamiento', 'rentabilidad', 'rotacion'];

export default function RatiosBenchmark({ locale = 'es' }: Props) {
  const c = COPY[locale];
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

  const porCategoria = CATEGORIA_ORDEN.map((cat) => ({
    cat,
    items: evaluacion.filter((e) => e.def.categoria === cat),
  }));

  return (
    <div class="calc">
      <div class="calc__sub">{c.sectorEmpresa}</div>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.compararSector}</span>
          <div class="calc__input-wrap">
            <select
              value={sector}
              onChange={(e) => setSector((e.target as HTMLSelectElement).value as SectorId)}
            >
              {SECTORES.map((s) => (
                <option value={s.id}>{c.sectorNombre[s.id]}</option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <p class="calc__note">{c.sectorNota[sector]}</p>

      <div class="calc__sub">{c.balanceActivo}</div>
      <div class="calc__form">
        <NumberField label={c.lblActivoCorriente} value={activoCorriente} setValue={setActivoCorriente} unit={c.unit} />
        <NumberField label={c.lblExistencias} value={existencias} setValue={setExistencias} unit={c.unit} />
        <NumberField label={c.lblActivoTotal} value={activoTotal} setValue={setActivoTotal} unit={c.unit} />
      </div>

      <div class="calc__sub">{c.balanceFinanciacion}</div>
      <div class="calc__form">
        <NumberField label={c.lblPasivoCorriente} value={pasivoCorriente} setValue={setPasivoCorriente} unit={c.unit} />
        <NumberField label={c.lblDeudaTotal} value={deudaTotal} setValue={setDeudaTotal} unit={c.unit} />
        <NumberField label={c.lblPatrimonioNeto} value={patrimonioNeto} setValue={setPatrimonioNeto} unit={c.unit} />
      </div>

      <div class="calc__sub">{c.cuentaPyG}</div>
      <div class="calc__form">
        <NumberField label={c.lblVentas} value={ventas} setValue={setVentas} unit={c.unit} />
        <NumberField label={c.lblBaii} value={baii} setValue={setBaii} unit={c.unit} />
        <NumberField label={c.lblBeneficioNeto} value={beneficioNeto} setValue={setBeneficioNeto} unit={c.unit} />
      </div>

      <div class="calc__results">
        <div class={`calc__warning ${cuadra ? 'is-ok' : ''}`}>
          {cuadra
            ? c.balanceCuadra(formatNumber(activoTotal, 0))
            : c.balanceNoCuadra(formatNumber(activoTotal, 0), formatNumber(patrimonioNeto + deudaTotal, 0))}
        </div>
        {pcMayorDeuda && (
          <div class="calc__warning">
            {c.pcMayorDeuda}
          </div>
        )}

        {porCategoria.map(({ cat, items }) => (
          <>
            <div class="calc__sub">{c.categoria[cat]}</div>
            <div class="calc__metric-grid calc__metric-grid--three">
              {items.map((ev) => (
                <RatioMetric ev={ev} locale={locale} />
              ))}
            </div>
          </>
        ))}

        <table class="calc__table">
          <thead>
            <tr>
              <th>{c.thRatio}</th>
              <th>{c.thValor}</th>
              <th>{c.thRango}</th>
              <th>{c.thPosicion}</th>
            </tr>
          </thead>
          <tbody>
            {evaluacion.map((ev) => (
              <tr>
                <td>{c.ratioNombre[ev.id]}</td>
                <td>{fmtValor(ev)}</td>
                <td>{fmtRango(ev)}</td>
                <td>{c.posicion[ev.posicion]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p class="calc__note">
          {c.notaRangos1}<strong>{c.notaRangosStrong}</strong>{c.notaRangos2}
        </p>

        <details class="calc__details">
          <summary>{c.comoSeCalcula}</summary>
          <div class="calc__formula">
            {RATIOS.map((def) => (
              <p>
                <strong>{c.ratioNombre[def.id]}</strong> = {def.formula}. <em>{c.ratioDescripcion[def.id]}</em>
              </p>
            ))}
            <p>
              <strong>{c.lecturaStrong}</strong>{c.lecturaTexto}
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

function RatioMetric({ ev, locale }: { ev: Evaluacion; locale: Locale }) {
  const c = COPY[locale];
  const ok = esFavorable(ev.id, ev.posicion);
  return (
    <div class={`calc__metric ${ok ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
      <span class="calc__metric-label">{c.ratioNombre[ev.id]}</span>
      <span class="calc__metric-value">{fmtValor(ev)}</span>
      <span class="calc__metric-detail">
        {c.posicion[ev.posicion]} · {c.metricSector} {fmtRango(ev)}
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
