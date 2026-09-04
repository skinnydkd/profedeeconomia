/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { calcularTasas, tasaParoMalCalculada, type PoblacionEPA } from '../../lib/calc/tasas-epa';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Statistical notation
 * (%, pers.) is not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    intro: 'Introduce los datos de una población y comprueba las tres tasas que publica la EPA cada trimestre. Los denominadores no son los mismos: ahí está la trampa.',
    datos: 'Datos de la encuesta',
    labelPoblacion: 'Población de 16 años o más',
    labelOcupados: 'Personas ocupadas',
    labelParados: 'Personas paradas',
    derivados: 'Lo que se deduce de esos tres números',
    activos: 'Población activa',
    inactivos: 'Población inactiva',
    activosDetalle: 'Ocupados + parados: quienes trabajan o buscan trabajo.',
    inactivosDetalle: 'Estudiantes a tiempo completo, jubilados, quien no busca empleo.',
    tasaActividad: 'Tasa de actividad',
    tasaEmpleo: 'Tasa de empleo',
    tasaParo: 'Tasa de paro',
    detalleActividad: 'Qué parte de la población en edad de trabajar participa en el mercado laboral.',
    detalleEmpleo: 'Qué parte de la población en edad de trabajar tiene efectivamente un empleo.',
    detalleParo: 'Qué parte de quienes quieren trabajar no encuentra empleo.',
    trampa: 'La trampa del denominador',
    trampaTexto: 'El error más común es dividir los parados entre toda la población de 16+ en lugar de entre la población activa. Sale una cifra mucho más baja y suena bien, pero no es la tasa de paro.',
    trampaBien: 'Bien: parados / activos',
    trampaMal: 'Mal: parados / población 16+',
    incoherente: 'Estos números no describen una población posible: los ocupados más los parados no pueden superar la población de 16 años o más, y ninguna cifra puede ser negativa.',
    ejemplos: 'Cargar un ejemplo',
    ejemploVilanova: 'Vilanova del Camp (el del libro)',
    ejemploEspana: 'España, 1.er trimestre de 2026',
    comoSeCalcula: 'Cómo se calcula',
    formActividad: ' = (población activa / población de 16+) × 100',
    formEmpleo: ' = (ocupados / población de 16+) × 100',
    formParo: ' = (parados / población activa) × 100',
    nota: 'La EPA es una encuesta a hogares del INE y se publica cada trimestre. No es lo mismo que el paro registrado del SEPE, que cuenta a quien se ha inscrito en una oficina de empleo.',
  },
  ca: {
    intro: "Introduïx les dades d'una població i comprova les tres taxes que publica l'EPA cada trimestre. Els denominadors no són els mateixos: ahí està el parany.",
    datos: "Dades de l'enquesta",
    labelPoblacion: 'Població de 16 anys o més',
    labelOcupados: 'Persones ocupades',
    labelParados: 'Persones aturades',
    derivados: "El que es dedueix d'eixos tres números",
    activos: 'Població activa',
    inactivos: 'Població inactiva',
    activosDetalle: 'Ocupats + aturats: qui treballa o busca faena.',
    inactivosDetalle: 'Estudiants a temps complet, jubilats, qui no busca ocupació.',
    tasaActividad: "Taxa d'activitat",
    tasaEmpleo: "Taxa d'ocupació",
    tasaParo: "Taxa d'atur",
    detalleActividad: "Quina part de la població en edat de treballar participa en el mercat laboral.",
    detalleEmpleo: "Quina part de la població en edat de treballar té efectivament una ocupació.",
    detalleParo: 'Quina part de qui vol treballar no troba ocupació.',
    trampa: 'El parany del denominador',
    trampaTexto: "L'error més comú és dividir els aturats entre tota la població de 16+ en lloc d'entre la població activa. Ix una xifra molt més baixa i sona bé, però no és la taxa d'atur.",
    trampaBien: 'Bé: aturats / actius',
    trampaMal: 'Malament: aturats / població 16+',
    incoherente: 'Estos números no descriuen una població possible: els ocupats més els aturats no poden superar la població de 16 anys o més, i cap xifra pot ser negativa.',
    ejemplos: 'Carregar un exemple',
    ejemploVilanova: 'Vilanova del Camp (el del llibre)',
    ejemploEspana: 'Espanya, 1r trimestre de 2026',
    comoSeCalcula: 'Com es calcula',
    formActividad: ' = (població activa / població de 16+) × 100',
    formEmpleo: ' = (ocupats / població de 16+) × 100',
    formParo: ' = (aturats / població activa) × 100',
    nota: "L'EPA és una enquesta a llars de l'INE i es publica cada trimestre. No és el mateix que l'atur registrat del SEPE, que compta qui s'ha inscrit en una oficina d'ocupació.",
  },
} as const;

interface Props { locale?: Locale }

/** The worked example of FOPP 4ESO · Unidad 7 (SolvedExercise 7.1). */
const VILANOVA: PoblacionEPA = { poblacion16: 20000, ocupados: 9600, parados: 1400 };
/** EPA, 1.er trimestre 2026 (INE), in thousands of people. */
const ESPANA: PoblacionEPA = { poblacion16: 42460, ocupados: 22290, parados: 2708 };

/**
 * Calculator for the three EPA rates — activity, employment and unemployment —
 * from three head counts. Shows each rate next to the division it comes from,
 * because the unit's whole point is that the denominators differ.
 * FOPP 4ESO · Unidad 7.
 */
export default function TasasEPACalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [p, setP] = useState<PoblacionEPA>({ ...VILANOVA });

  const r = useMemo(() => calcularTasas(p), [p]);
  const malo = useMemo(() => tasaParoMalCalculada(p), [p]);

  const set = (key: keyof PoblacionEPA) => (e: Event) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    setP({ ...p, [key]: Number.isFinite(val) ? val : 0 });
  };

  return (
    <div class="calc">
      <p class="epa__intro">{c.intro}</p>

      <div class="epa__examples">
        <span class="epa__examples-label">{c.ejemplos}</span>
        <button type="button" class="epa__chip" onClick={() => setP({ ...VILANOVA })}>
          {c.ejemploVilanova}
        </button>
        <button type="button" class="epa__chip" onClick={() => setP({ ...ESPANA })}>
          {c.ejemploEspana}
        </button>
      </div>

      <h3 class="epa__section-title">{c.datos}</h3>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.labelPoblacion}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={100} value={p.poblacion16} onInput={set('poblacion16')} />
            <span class="calc__unit">pers.</span>
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{c.labelOcupados}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={100} value={p.ocupados} onInput={set('ocupados')} />
            <span class="calc__unit">pers.</span>
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{c.labelParados}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={100} value={p.parados} onInput={set('parados')} />
            <span class="calc__unit">pers.</span>
          </div>
        </label>
      </div>

      {!r.coherente && <p class="calc__warning">{c.incoherente}</p>}

      <h3 class="epa__section-title">{c.derivados}</h3>
      <div class="calc__metric-grid">
        <div class="calc__metric">
          <span class="calc__metric-label">{c.activos}</span>
          <span class="calc__metric-value">{fmtN(r.activos)}</span>
          <span class="calc__metric-detail">{c.activosDetalle}</span>
        </div>
        <div class="calc__metric">
          <span class="calc__metric-label">{c.inactivos}</span>
          <span class="calc__metric-value">{fmtN(r.inactivos)}</span>
          <span class="calc__metric-detail">{c.inactivosDetalle}</span>
        </div>
      </div>

      <div class="calc__metric-grid calc__metric-grid--three">
        <TasaCard label={c.tasaActividad} tasa={r.actividad} detalle={c.detalleActividad} />
        <TasaCard label={c.tasaEmpleo} tasa={r.empleo} detalle={c.detalleEmpleo} />
        <TasaCard label={c.tasaParo} tasa={r.paro} detalle={c.detalleParo} primary />
      </div>

      <section class="epa__trampa">
        <h3 class="epa__section-title">{c.trampa}</h3>
        <p class="epa__trampa-text">{c.trampaTexto}</p>
        <div class="epa__compare">
          <div class="epa__compare-cell">
            <span class="epa__compare-label">{c.trampaBien}</span>
            <span class="epa__compare-value epa__compare-value--good">{fmtPct(r.paro.valor)}</span>
            <span class="epa__compare-frac">{fmtN(r.paro.numerador)} / {fmtN(r.paro.denominador)}</span>
          </div>
          <div class="epa__compare-cell">
            <span class="epa__compare-label">{c.trampaMal}</span>
            <span class="epa__compare-value epa__compare-value--bad">{fmtPct(malo.valor)}</span>
            <span class="epa__compare-frac">{fmtN(malo.numerador)} / {fmtN(malo.denominador)}</span>
          </div>
        </div>
      </section>

      <details class="calc__details">
        <summary>{c.comoSeCalcula}</summary>
        <div class="calc__formula">
          <p><strong>{c.tasaActividad}</strong>{c.formActividad}</p>
          <p><strong>{c.tasaEmpleo}</strong>{c.formEmpleo}</p>
          <p><strong>{c.tasaParo}</strong>{c.formParo}</p>
          <p>{c.nota}</p>
        </div>
      </details>

      <style>{`
        .epa__intro {
          font-family: var(--font-serif);
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1.1rem;
        }
        .epa__examples {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.3rem;
        }
        .epa__examples-label {
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-ink-mute, #8A7868);
        }
        .epa__chip {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          padding: 0.35rem 0.8rem;
          cursor: pointer;
        }
        .epa__chip:hover {
          border-color: var(--color-terra, #C44E2C);
          color: var(--color-terra, #C44E2C);
        }
        .epa__section-title {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--color-ink-mute, #8A7868);
          margin: 1.5rem 0 0.7rem;
        }
        .epa__frac {
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          color: var(--color-ink-mute, #8A7868);
          font-variant-numeric: tabular-nums;
        }
        .epa__trampa {
          margin-top: 1.6rem;
          padding: 1.1rem 1.2rem;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .epa__trampa .epa__section-title { margin-top: 0; }
        .epa__trampa-text {
          font-family: var(--font-serif);
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1rem;
        }
        .epa__compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }
        @media (max-width: 520px) {
          .epa__compare { grid-template-columns: 1fr; }
        }
        .epa__compare-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          padding: 0.8rem 0.9rem;
        }
        .epa__compare-label {
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-ink-mute, #8A7868);
        }
        .epa__compare-value {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .epa__compare-value--good { color: #2f7d4f; }
        .epa__compare-value--bad { color: #B83A3A; }
        .epa__compare-frac {
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          color: var(--color-ink-mute, #8A7868);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function TasaCard({
  label,
  tasa,
  detalle,
  primary = false,
}: {
  label: string;
  tasa: { valor: number | null; numerador: number; denominador: number };
  detalle: string;
  primary?: boolean;
}) {
  return (
    <div class={`calc__metric${primary ? ' calc__metric--primary' : ''}`}>
      <span class="calc__metric-label">{label}</span>
      <span class="calc__metric-value">{fmtPct(tasa.valor)}</span>
      <span class="epa__frac">{fmtN(tasa.numerador)} / {fmtN(tasa.denominador)}</span>
      <span class="calc__metric-detail">{detalle}</span>
    </div>
  );
}

/* ── Pure helpers ────────────────────────────────────────────────────────── */

function fmtN(n: number): string {
  return n.toLocaleString('es-ES', { maximumFractionDigits: 0 });
}

function fmtPct(n: number | null): string {
  if (n === null) return '—';
  return `${n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}
