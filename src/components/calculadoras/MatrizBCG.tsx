/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';

type BCGState = {
  estrella: string;
  interrogante: string;
  vaca: string;
  perro: string;
};

const INITIAL: BCGState = {
  estrella: '',
  interrogante: '',
  vaca: '',
  perro: '',
};

export default function MatrizBCG() {
  const [state, setState] = usePersistentState<BCGState>('pde:plantilla:bcg', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(id: keyof BCGState, value: string) {
    setState({ ...state, [id]: value });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'matriz-bcg', formato);
    } catch (_) {
      // print is always-works fallback
    } finally {
      setExporting(null);
    }
  }

  function handleVaciar() {
    if (confirm('¿Vaciar la plantilla?')) {
      setState(INITIAL);
    }
  }

  return (
    <div class="bcg-root">
      <p class="bcg-intro">
        Clasifica las unidades de negocio o productos de una empresa en la Matriz BCG (Boston
        Consulting Group) según su cuota de mercado relativa y el crecimiento del mercado.
      </p>

      <div class="bcg-lienzo" ref={lienzoRef}>
        {/* Axis label: vertical (Crecimiento del mercado) */}
        <div class="bcg-axis-y" aria-hidden="true">
          <span class="bcg-axis-label">Crecimiento del mercado</span>
          <span class="bcg-axis-ends">
            <span>Alto</span>
            <span>Bajo</span>
          </span>
        </div>

        <div class="bcg-inner">
          {/* Axis label: horizontal (Cuota relativa) */}
          <div class="bcg-axis-x" aria-hidden="true">
            <span class="bcg-axis-x-end bcg-axis-x-end--left">Alta</span>
            <span class="bcg-axis-label">Cuota de mercado relativa</span>
            <span class="bcg-axis-x-end bcg-axis-x-end--right">Baja</span>
          </div>

          {/* 2x2 grid */}
          <div class="bcg-grid">
            {/* Row 1 */}
            <div class="bcg-cell bcg-cell--estrella">
              <span class="bcg-cell-title">Estrella</span>
              <span class="bcg-cell-subtitle">Crecimiento alto · Cuota alta</span>
              <textarea
                value={state.estrella}
                placeholder="Productos con alta cuota en un mercado en expansión. Requieren inversión para mantener el liderazgo."
                onInput={(e) => setField('estrella', (e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div class="bcg-cell bcg-cell--interrogante">
              <span class="bcg-cell-title">Interrogante</span>
              <span class="bcg-cell-subtitle">Crecimiento alto · Cuota baja</span>
              <textarea
                value={state.interrogante}
                placeholder="Mercado en crecimiento pero baja cuota. Decisión clave: invertir para crecer o desinvertir."
                onInput={(e) => setField('interrogante', (e.target as HTMLTextAreaElement).value)}
              />
            </div>

            {/* Row 2 */}
            <div class="bcg-cell bcg-cell--vaca">
              <span class="bcg-cell-title">Vaca</span>
              <span class="bcg-cell-subtitle">Crecimiento bajo · Cuota alta</span>
              <textarea
                value={state.vaca}
                placeholder="Alta cuota en un mercado maduro. Generan caja con poca inversión: financian a otros."
                onInput={(e) => setField('vaca', (e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div class="bcg-cell bcg-cell--perro">
              <span class="bcg-cell-title">Perro</span>
              <span class="bcg-cell-subtitle">Crecimiento bajo · Cuota baja</span>
              <textarea
                value={state.perro}
                placeholder="Baja cuota en un mercado estancado. Candidatos a desinversión salvo nicho rentable."
                onInput={(e) => setField('perro', (e.target as HTMLTextAreaElement).value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bcg-actions no-print">
        <button
          class="bcg-btn bcg-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? 'Generando…' : 'Exportar PNG'}
        </button>
        <button
          class="bcg-btn bcg-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? 'Generando…' : 'Exportar PDF'}
        </button>
        <button class="bcg-btn" onClick={() => window.print()}>
          Imprimir
        </button>
        <button class="bcg-btn bcg-btn--danger" onClick={handleVaciar}>
          Vaciar
        </button>
      </div>

      <style>{`
        .bcg-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .bcg-intro {
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .bcg-lienzo {
          display: flex;
          gap: 0;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
          overflow: hidden;
          background: var(--color-paper, #ffffff);
        }
        .bcg-axis-y {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0.25rem;
          background: var(--color-bg-soft, #F8E8D0);
          border-right: 1px solid var(--color-line, #E5D4BD);
          min-width: 2rem;
          gap: 0.5rem;
        }
        .bcg-axis-y .bcg-axis-label {
          writing-mode: vertical-lr;
          transform: rotate(180deg);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          flex: 1;
          text-align: center;
        }
        .bcg-axis-ends {
          display: none; /* shown via grid position labels instead */
        }
        .bcg-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .bcg-axis-x {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.75rem;
          background: var(--color-bg-soft, #F8E8D0);
          border-bottom: 1px solid var(--color-line, #E5D4BD);
          font-size: 0.75rem;
          color: var(--color-ink-mute, #8A7868);
        }
        .bcg-axis-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.75rem;
        }
        .bcg-axis-x-end {
          font-size: 0.7rem;
          color: var(--color-ink-mute, #8A7868);
        }
        .bcg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          flex: 1;
          min-height: 22rem;
        }
        .bcg-cell {
          display: flex;
          flex-direction: column;
          padding: 0.875rem;
          gap: 0.25rem;
          border-top: 1px solid var(--color-line, #E5D4BD);
          border-left: 1px solid var(--color-line, #E5D4BD);
          background: var(--color-paper, #ffffff);
        }
        .bcg-cell:nth-child(odd) {
          border-left: none;
        }
        .bcg-cell:nth-child(1),
        .bcg-cell:nth-child(2) {
          border-top: none;
        }
        .bcg-cell-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .bcg-cell--estrella .bcg-cell-title { color: var(--color-terra, #C44E2C); }
        .bcg-cell--interrogante .bcg-cell-title { color: var(--color-mustard-deep, #A87A2A); }
        .bcg-cell--vaca .bcg-cell-title { color: var(--color-eco1, #1F6E6E); }
        .bcg-cell--perro .bcg-cell-title { color: var(--color-ink-mute, #8A7868); }

        .bcg-cell-subtitle {
          font-size: 0.72rem;
          color: var(--color-ink-mute, #8A7868);
          margin-bottom: 0.375rem;
        }
        .bcg-cell textarea {
          flex: 1;
          width: 100%;
          min-height: 7rem;
          border: none;
          outline: none;
          resize: vertical;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-ink, #2A1F18);
        }
        .bcg-cell textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }
        .bcg-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .bcg-btn {
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
        .bcg-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .bcg-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .bcg-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .bcg-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .bcg-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .bcg-lienzo {
            width: 100%;
            page-break-inside: avoid;
          }
          .bcg-grid {
            min-height: unset;
          }
          .bcg-cell textarea {
            resize: none;
            border: none;
            color: #000 !important;
            background: transparent !important;
          }
          .bcg-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
