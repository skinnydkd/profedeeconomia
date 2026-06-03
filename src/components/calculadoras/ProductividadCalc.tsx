/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  productividadFactor,
  productividadGlobal,
  variacionPct,
} from '../../lib/calc/productividad';

/**
 * Productivity calculator — partial (labour, hours, capital) and global.
 * Shows two periods side by side and the % change between them.
 * Eco 1BACH · Unit 3 / EDMN 2BACH · Unit 2.
 */

interface Period {
  produccion: number;
  trabajadores: number;
  horas: number;
  capital: number;
  valorProduccion: number;
  valorFactores: number;
}

const DEFAULT_P1: Period = {
  produccion: 500,
  trabajadores: 10,
  horas: 200,
  capital: 50000,
  valorProduccion: 25000,
  valorFactores: 20000,
};

const DEFAULT_P2: Period = {
  produccion: 640,
  trabajadores: 10,
  horas: 200,
  capital: 50000,
  valorProduccion: 32000,
  valorFactores: 22000,
};

export default function ProductividadCalc() {
  const [p1, setP1] = useState<Period>({ ...DEFAULT_P1 });
  const [p2, setP2] = useState<Period>({ ...DEFAULT_P2 });

  const r1 = useMemo(() => computePeriod(p1), [p1]);
  const r2 = useMemo(() => computePeriod(p2), [p2]);

  const delta = useMemo(() => ({
    trabajoNull: r1.trabajo === null || r2.trabajo === null,
    capitalNull: r1.capital === null || r2.capital === null,
    globalNull: r1.global === null || r2.global === null,
    trabajo: r1.trabajo !== null && r2.trabajo !== null ? variacionPct(r1.trabajo, r2.trabajo) : null,
    capital: r1.capital !== null && r2.capital !== null ? variacionPct(r1.capital, r2.capital) : null,
    global: r1.global !== null && r2.global !== null ? variacionPct(r1.global, r2.global) : null,
  }), [r1, r2]);

  return (
    <div class="calc">
      <div class="prod__grid">
        {/* ── Period 1 ── */}
        <section class="prod__period">
          <h3 class="prod__period-title">Periodo 1</h3>
          <div class="calc__form">
            <PeriodInputs period={p1} onChange={setP1} />
          </div>
          <ResultsPanel r={r1} />
        </section>

        {/* ── Period 2 ── */}
        <section class="prod__period">
          <h3 class="prod__period-title">Periodo 2</h3>
          <div class="calc__form">
            <PeriodInputs period={p2} onChange={setP2} />
          </div>
          <ResultsPanel r={r2} />
        </section>
      </div>

      {/* ── Variation row ── */}
      <div class="prod__delta">
        <h3 class="prod__delta-title">Variación Periodo 1 → Periodo 2</h3>
        <div class="calc__metric-grid calc__metric-grid--three">
          <DeltaMetric
            label="Productividad del trabajo"
            value={delta.trabajo}
          />
          <DeltaMetric
            label="Productividad del capital"
            value={delta.capital}
          />
          <DeltaMetric
            label="Productividad global"
            value={delta.global}
          />
        </div>
      </div>

      <details class="calc__details">
        <summary>Cómo se calcula</summary>
        <div class="calc__formula">
          <p><strong>Productividad del trabajo</strong> = Producción / Trabajadores. Mide cuánto produce cada trabajador.</p>
          <p><strong>Productividad por hora</strong> = Producción / Horas totales trabajadas.</p>
          <p><strong>Productividad del capital</strong> = Producción / Capital. Mide el rendimiento de cada euro de capital.</p>
          <p><strong>Productividad global</strong> = Valor de la producción / Valor de los factores. Permite comparar períodos con diferentes precios.</p>
          <p><strong>Variación (%)</strong> = ( Nuevo − Base ) / Base × 100.</p>
        </div>
      </details>

      <style>{`
        .prod__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.4rem;
        }
        @media (max-width: 620px) {
          .prod__grid { grid-template-columns: 1fr; }
        }
        .prod__period {
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
          padding: 1.1rem 1.2rem;
          background: var(--color-paper, #FFFFFF);
        }
        .prod__period-title {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 0 0 0.9rem;
        }
        .prod__results {
          margin-top: 1rem;
          display: grid;
          gap: 0.5rem;
        }
        .prod__row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-ink-soft, #5C4A3D);
          padding: 0.3rem 0;
          border-bottom: 1px solid var(--color-line-soft, #EFE2CB);
        }
        .prod__row:last-child { border-bottom: none; }
        .prod__row-label { color: var(--color-ink-soft, #5C4A3D); }
        .prod__row-value {
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
          font-variant-numeric: tabular-nums;
        }
        .prod__row-value.null-val { color: var(--color-ink-mute, #8A7868); }
        .prod__delta {
          margin-top: 1.6rem;
          padding: 1.1rem 1.2rem;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .prod__delta-title {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1rem;
        }
        .prod__delta-up { color: #1F6E6E; }
        .prod__delta-down { color: #B83A3A; }
        .prod__delta-flat { color: var(--color-ink-mute, #8A7868); }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function PeriodInputs({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const set = (key: keyof Period) => (e: Event) => {
    const val = parseFloat((e.target as HTMLInputElement).value) || 0;
    onChange({ ...period, [key]: val });
  };

  return (
    <>
      <label class="calc__field">
        <span class="calc__label">Producción (unidades)</span>
        <div class="calc__input-wrap">
          <input type="number" min={0} step={10} value={period.produccion} onInput={set('produccion')} />
          <span class="calc__unit">uds</span>
        </div>
      </label>
      <label class="calc__field">
        <span class="calc__label">Trabajadores</span>
        <div class="calc__input-wrap">
          <input type="number" min={1} step={1} value={period.trabajadores} onInput={set('trabajadores')} />
          <span class="calc__unit">pers.</span>
        </div>
      </label>
      <label class="calc__field">
        <span class="calc__label">Horas trabajadas (total)</span>
        <div class="calc__input-wrap">
          <input type="number" min={1} step={10} value={period.horas} onInput={set('horas')} />
          <span class="calc__unit">h</span>
        </div>
      </label>
      <label class="calc__field">
        <span class="calc__label">Capital empleado</span>
        <div class="calc__input-wrap">
          <input type="number" min={1} step={1000} value={period.capital} onInput={set('capital')} />
          <span class="calc__unit">€</span>
        </div>
      </label>
      <label class="calc__field">
        <span class="calc__label">Valor de la producción</span>
        <div class="calc__input-wrap">
          <input type="number" min={0} step={500} value={period.valorProduccion} onInput={set('valorProduccion')} />
          <span class="calc__unit">€</span>
        </div>
      </label>
      <label class="calc__field">
        <span class="calc__label">Valor de los factores</span>
        <div class="calc__input-wrap">
          <input type="number" min={1} step={500} value={period.valorFactores} onInput={set('valorFactores')} />
          <span class="calc__unit">€</span>
        </div>
      </label>
    </>
  );
}

function ResultsPanel({ r }: { r: ReturnType<typeof computePeriod> }) {
  return (
    <div class="prod__results">
      <div class="prod__row">
        <span class="prod__row-label">Prod. trabajo (uds/trabajador)</span>
        <span class={`prod__row-value${r.trabajo === null ? ' null-val' : ''}`}>
          {r.trabajo === null ? '—' : fmtN(r.trabajo)}
        </span>
      </div>
      <div class="prod__row">
        <span class="prod__row-label">Prod. trabajo (uds/hora)</span>
        <span class={`prod__row-value${r.trabajoPorHora === null ? ' null-val' : ''}`}>
          {r.trabajoPorHora === null ? '—' : fmtN(r.trabajoPorHora)}
        </span>
      </div>
      <div class="prod__row">
        <span class="prod__row-label">Prod. capital (uds/€)</span>
        <span class={`prod__row-value${r.capital === null ? ' null-val' : ''}`}>
          {r.capital === null ? '—' : fmtN(r.capital, 4)}
        </span>
      </div>
      <div class="prod__row">
        <span class="prod__row-label">Prod. global (€ prod / € fact.)</span>
        <span class={`prod__row-value${r.global === null ? ' null-val' : ''}`}>
          {r.global === null ? '—' : fmtN(r.global, 3)}
        </span>
      </div>
    </div>
  );
}

function DeltaMetric({ label, value }: { label: string; value: number | null }) {
  const cls = value === null ? '' : value > 0 ? 'prod__delta-up' : value < 0 ? 'prod__delta-down' : 'prod__delta-flat';
  const txt = value === null
    ? '—'
    : `${value > 0 ? '+' : ''}${value.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  return (
    <div class="calc__metric-mini">
      <span class="calc__metric-mini-label">{label}</span>
      <span class={`calc__metric-mini-value ${cls}`}>{txt}</span>
    </div>
  );
}

/* ── Pure helpers ────────────────────────────────────────────────────────── */

function computePeriod(p: Period) {
  return {
    trabajo: productividadFactor(p.produccion, p.trabajadores),
    trabajoPorHora: productividadFactor(p.produccion, p.horas),
    capital: productividadFactor(p.produccion, p.capital),
    global: productividadGlobal(p.valorProduccion, p.valorFactores),
  };
}

function fmtN(n: number, decimals = 2): string {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
