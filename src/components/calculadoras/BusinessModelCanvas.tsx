/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';

type BMCState = {
  socios_clave: string;
  actividades_clave: string;
  recursos_clave: string;
  propuestas_valor: string;
  relaciones_clientes: string;
  canales: string;
  segmentos_clientes: string;
  estructura_costes: string;
  fuentes_ingresos: string;
};

const INITIAL: BMCState = {
  socios_clave: '',
  actividades_clave: '',
  recursos_clave: '',
  propuestas_valor: '',
  relaciones_clientes: '',
  canales: '',
  segmentos_clientes: '',
  estructura_costes: '',
  fuentes_ingresos: '',
};

type BlockId = keyof BMCState;

function Block({
  id,
  label,
  value,
  onUpdate,
  placeholder,
}: {
  id: BlockId;
  label: string;
  value: string;
  onUpdate: (id: BlockId, v: string) => void;
  placeholder?: string;
}) {
  return (
    <div class={`bmc-cell bmc-cell--${id}`}>
      <span class="bmc-cell-title">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder ?? ''}
        onInput={(e) => onUpdate(id, (e.target as HTMLTextAreaElement).value)}
      />
    </div>
  );
}

export default function BusinessModelCanvas() {
  const [state, setState] = usePersistentState<BMCState>('pde:plantilla:canvas', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(id: BlockId, value: string) {
    setState({ ...state, [id]: value });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'business-model-canvas', formato);
    } catch (_) {
      // print fallback always available
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
    <div class="bmc-root">
      <p class="bmc-intro">
        Describe el modelo de negocio de una empresa en nueve bloques clave, siguiendo el
        Business Model Canvas de Osterwalder y Pigneur.
      </p>

      <div class="bmc-lienzo" ref={lienzoRef}>
        {/* Top 5-column area */}
        <div class="bmc-top">
          <Block
            id="socios_clave"
            label="Socios clave"
            value={state.socios_clave}
            onUpdate={setField}
            placeholder="¿Quiénes son los principales socios y proveedores?"
          />
          <div class="bmc-stack">
            <Block
              id="actividades_clave"
              label="Actividades clave"
              value={state.actividades_clave}
              onUpdate={setField}
              placeholder="¿Qué actividades críticas requiere la propuesta de valor?"
            />
            <Block
              id="recursos_clave"
              label="Recursos clave"
              value={state.recursos_clave}
              onUpdate={setField}
              placeholder="¿Qué activos son imprescindibles para el modelo?"
            />
          </div>
          <Block
            id="propuestas_valor"
            label="Propuestas de valor"
            value={state.propuestas_valor}
            onUpdate={setField}
            placeholder="¿Qué problema resuelve o necesidad satisface? ¿Qué valor entrega a cada segmento?"
          />
          <div class="bmc-stack">
            <Block
              id="relaciones_clientes"
              label="Relaciones con clientes"
              value={state.relaciones_clientes}
              onUpdate={setField}
              placeholder="¿Qué tipo de relación establece con cada segmento?"
            />
            <Block
              id="canales"
              label="Canales"
              value={state.canales}
              onUpdate={setField}
              placeholder="¿Cómo llega a los clientes y cómo les entrega la propuesta?"
            />
          </div>
          <Block
            id="segmentos_clientes"
            label="Segmentos de clientes"
            value={state.segmentos_clientes}
            onUpdate={setField}
            placeholder="¿Para quién crea valor? ¿Quiénes son sus clientes más importantes?"
          />
        </div>

        {/* Bottom 2-column area */}
        <div class="bmc-bottom">
          <Block
            id="estructura_costes"
            label="Estructura de costes"
            value={state.estructura_costes}
            onUpdate={setField}
            placeholder="¿Cuáles son los costes más importantes del modelo?"
          />
          <Block
            id="fuentes_ingresos"
            label="Fuentes de ingresos"
            value={state.fuentes_ingresos}
            onUpdate={setField}
            placeholder="¿Por qué valor están dispuestos a pagar los clientes? ¿Cómo pagan actualmente?"
          />
        </div>
      </div>

      <div class="bmc-actions no-print">
        <button
          class="bmc-btn bmc-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? 'Generando…' : 'Exportar PNG'}
        </button>
        <button
          class="bmc-btn bmc-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? 'Generando…' : 'Exportar PDF'}
        </button>
        <button class="bmc-btn" onClick={() => window.print()}>
          Imprimir
        </button>
        <button class="bmc-btn bmc-btn--danger" onClick={handleVaciar}>
          Vaciar
        </button>
      </div>

      <style>{`
        .bmc-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .bmc-intro {
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .bmc-lienzo {
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
          overflow: hidden;
          background: var(--color-paper, #ffffff);
        }
        .bmc-top {
          display: grid;
          grid-template-columns: 1fr 1fr 1.25fr 1fr 1fr;
          border-bottom: 1px solid var(--color-line, #E5D4BD);
          min-height: 18rem;
        }
        .bmc-stack {
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--color-line, #E5D4BD);
          border-right: 1px solid var(--color-line, #E5D4BD);
        }
        .bmc-stack .bmc-cell {
          flex: 1;
          border: none;
          border-radius: 0;
        }
        .bmc-stack .bmc-cell + .bmc-cell {
          border-top: 1px solid var(--color-line, #E5D4BD);
        }
        .bmc-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .bmc-cell {
          display: flex;
          flex-direction: column;
          padding: 0.875rem;
          gap: 0.5rem;
          background: var(--color-paper, #ffffff);
          border-left: 1px solid var(--color-line, #E5D4BD);
          min-height: 6rem;
        }
        .bmc-cell:first-child,
        .bmc-bottom .bmc-cell:first-child {
          border-left: none;
        }
        .bmc-bottom .bmc-cell + .bmc-cell {
          border-left: 1px solid var(--color-line, #E5D4BD);
        }
        .bmc-cell--propuestas_valor .bmc-cell-title {
          color: var(--color-terra, #C44E2C);
        }
        .bmc-cell-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
        }
        .bmc-cell--propuestas_valor {
          background: var(--color-bg-cream, #F5EDD9);
        }
        .bmc-cell textarea {
          flex: 1;
          width: 100%;
          min-height: 5rem;
          border: none;
          outline: none;
          resize: vertical;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-ink, #2A1F18);
        }
        .bmc-cell textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }

        /* Responsive: stack on narrow */
        @media (max-width: 680px) {
          .bmc-top {
            grid-template-columns: 1fr;
            min-height: unset;
          }
          .bmc-stack {
            border-left: none;
            border-right: none;
          }
          .bmc-cell {
            border-left: none;
            border-top: 1px solid var(--color-line, #E5D4BD);
          }
          .bmc-bottom {
            grid-template-columns: 1fr;
          }
          .bmc-bottom .bmc-cell + .bmc-cell {
            border-left: none;
            border-top: 1px solid var(--color-line, #E5D4BD);
          }
        }

        .bmc-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .bmc-btn {
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
        .bmc-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .bmc-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .bmc-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .bmc-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .bmc-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .bmc-lienzo {
            width: 100%;
            page-break-inside: avoid;
          }
          .bmc-cell textarea {
            resize: none;
            border: none;
            color: #000 !important;
            background: transparent !important;
          }
          .bmc-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
