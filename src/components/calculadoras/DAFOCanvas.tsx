/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. The DAFO acronym and
 * the persisted quadrant ids (fortalezas, debilidades, oportunidades,
 * amenazas) are storage keys and stay in ES; only labels are translated.
 */
export const COPY = {
  es: {
    intro:
      'Analiza la situación de una empresa u organización: factores internos (fortalezas y debilidades) y externos (oportunidades y amenazas).',
    colPositivo: 'Positivo',
    colNegativo: 'Negativo',
    rowInterno: 'Interno',
    rowExterno: 'Externo',
    fortalezasTitle: 'Fortalezas',
    debilidadesTitle: 'Debilidades',
    oportunidadesTitle: 'Oportunidades',
    amenazasTitle: 'Amenazas',
    fortalezasPlaceholder: '¿Qué hace bien la empresa? ¿Qué recursos o capacidades diferenciales tiene?',
    debilidadesPlaceholder: '¿Qué aspectos internos limitan su rendimiento o competitividad?',
    oportunidadesPlaceholder: '¿Qué factores del entorno puede aprovechar a su favor?',
    amenazasPlaceholder: '¿Qué factores externos pueden perjudicarla?',
    confirmVaciar: '¿Vaciar la plantilla?',
    generando: 'Generando…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Vaciar',
  },
  ca: {
    intro:
      "Analitza la situació d'una empresa o organització: factors interns (fortaleses i debilitats) i externs (oportunitats i amenaces).",
    colPositivo: 'Positiu',
    colNegativo: 'Negatiu',
    rowInterno: 'Intern',
    rowExterno: 'Extern',
    fortalezasTitle: 'Fortaleses',
    debilidadesTitle: 'Debilitats',
    oportunidadesTitle: 'Oportunitats',
    amenazasTitle: 'Amenaces',
    fortalezasPlaceholder: "Què fa bé l'empresa? Quins recursos o capacitats diferencials té?",
    debilidadesPlaceholder: 'Quins aspectes interns limiten el seu rendiment o competitivitat?',
    oportunidadesPlaceholder: "Quins factors de l'entorn pot aprofitar al seu favor?",
    amenazasPlaceholder: 'Quins factors externs poden perjudicar-la?',
    confirmVaciar: 'Voleu buidar la plantilla?',
    generando: 'Generant…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Buidar',
  },
} as const;

interface Props { locale?: Locale }

type DAFOState = {
  fortalezas: string;
  debilidades: string;
  oportunidades: string;
  amenazas: string;
};

const INITIAL: DAFOState = {
  fortalezas: '',
  debilidades: '',
  oportunidades: '',
  amenazas: '',
};

export default function DAFOCanvas({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [state, setState] = usePersistentState<DAFOState>('pde:plantilla:dafo', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(id: keyof DAFOState, value: string) {
    setState({ ...state, [id]: value });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'dafo', formato);
    } catch (_) {
      // print is always-works fallback
    } finally {
      setExporting(null);
    }
  }

  function handleVaciar() {
    if (confirm(c.confirmVaciar)) {
      setState(INITIAL);
    }
  }

  return (
    <div class="dafo-root">
      <p class="dafo-intro">{c.intro}</p>

      <div class="dafo-lienzo" ref={lienzoRef}>
        <div class="dafo-header" aria-hidden="true">
          <div class="dafo-corner" />
          <div class="dafo-col-label dafo-col-label--first">{c.colPositivo}</div>
          <div class="dafo-col-label">{c.colNegativo}</div>
        </div>

        <div class="dafo-row">
          <div class="dafo-row-label">{c.rowInterno}</div>
          <div class="dafo-cell dafo-cell--positivo-interno">
            <span class="dafo-cell-title">{c.fortalezasTitle}</span>
            <textarea
              value={state.fortalezas}
              placeholder={c.fortalezasPlaceholder}
              onInput={(e) => setField('fortalezas', (e.target as HTMLTextAreaElement).value)}
            />
          </div>
          <div class="dafo-cell dafo-cell--negativo-interno">
            <span class="dafo-cell-title">{c.debilidadesTitle}</span>
            <textarea
              value={state.debilidades}
              placeholder={c.debilidadesPlaceholder}
              onInput={(e) => setField('debilidades', (e.target as HTMLTextAreaElement).value)}
            />
          </div>
        </div>

        <div class="dafo-row">
          <div class="dafo-row-label">{c.rowExterno}</div>
          <div class="dafo-cell dafo-cell--positivo-externo">
            <span class="dafo-cell-title">{c.oportunidadesTitle}</span>
            <textarea
              value={state.oportunidades}
              placeholder={c.oportunidadesPlaceholder}
              onInput={(e) => setField('oportunidades', (e.target as HTMLTextAreaElement).value)}
            />
          </div>
          <div class="dafo-cell dafo-cell--negativo-externo">
            <span class="dafo-cell-title">{c.amenazasTitle}</span>
            <textarea
              value={state.amenazas}
              placeholder={c.amenazasPlaceholder}
              onInput={(e) => setField('amenazas', (e.target as HTMLTextAreaElement).value)}
            />
          </div>
        </div>
      </div>

      <div class="dafo-actions no-print">
        <button
          class="dafo-btn dafo-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? c.generando : c.exportarPng}
        </button>
        <button
          class="dafo-btn dafo-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? c.generando : c.exportarPdf}
        </button>
        <button class="dafo-btn" onClick={() => window.print()}>
          {c.imprimir}
        </button>
        <button class="dafo-btn dafo-btn--danger" onClick={handleVaciar}>
          {c.vaciar}
        </button>
      </div>

      <style>{`
        .dafo-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .dafo-intro {
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .dafo-lienzo {
          display: grid;
          grid-template-columns: 5rem 1fr 1fr;
          grid-template-rows: auto 1fr 1fr;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
          overflow: hidden;
          background: var(--color-paper, #ffffff);
          min-height: 28rem;
        }
        .dafo-header {
          display: contents;
        }
        .dafo-corner {
          background: var(--color-bg-soft, #F8E8D0);
          border-right: 1px solid var(--color-line, #E5D4BD);
          border-bottom: 1px solid var(--color-line, #E5D4BD);
        }
        .dafo-col-label {
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          padding: 0.5rem 0;
          background: var(--color-bg-soft, #F8E8D0);
          border-bottom: 1px solid var(--color-line, #E5D4BD);
        }
        .dafo-col-label--first {
          border-right: none;
        }
        .dafo-col-label:last-of-type {
          border-left: 1px solid var(--color-line, #E5D4BD);
        }
        .dafo-row {
          display: contents;
        }
        .dafo-row-label {
          display: flex;
          align-items: center;
          justify-content: center;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          background: var(--color-bg-soft, #F8E8D0);
          border-right: 1px solid var(--color-line, #E5D4BD);
          border-top: 1px solid var(--color-line, #E5D4BD);
          padding: 0.75rem 0.25rem;
        }
        .dafo-cell {
          display: flex;
          flex-direction: column;
          padding: 0.875rem;
          border-top: 1px solid var(--color-line, #E5D4BD);
          gap: 0.5rem;
          background: var(--color-paper, #ffffff);
        }
        .dafo-cell:nth-child(odd) {
          border-left: 1px solid var(--color-line, #E5D4BD);
        }
        .dafo-cell-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-terra, #C44E2C);
        }
        .dafo-cell--negativo-interno .dafo-cell-title,
        .dafo-cell--negativo-externo .dafo-cell-title {
          color: var(--color-ink-soft, #5C4A3D);
        }
        .dafo-cell textarea {
          flex: 1;
          width: 100%;
          min-height: 8rem;
          border: none;
          outline: none;
          resize: vertical;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-ink, #2A1F18);
        }
        .dafo-cell textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.825rem;
        }
        .dafo-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .dafo-btn {
          padding: 0.45rem 1rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          background: var(--color-paper, #ffffff);
          color: var(--color-ink, #2A1F18);
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .dafo-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .dafo-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .dafo-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .dafo-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .dafo-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .dafo-lienzo {
            min-height: unset;
            width: 100%;
            page-break-inside: avoid;
          }
          .dafo-cell textarea {
            resize: none;
            border: none;
            color: #000 !important;
            background: transparent !important;
          }
          .dafo-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
