/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. "Business Model Canvas"
 * is a product name and stays untranslated. The persisted state field names /
 * block ids (socios_clave, propuestas_valor, …) are storage keys and stay in
 * ES; only the visible labels and placeholders are translated.
 */
export const COPY = {
  es: {
    intro:
      'Describe el modelo de negocio de una empresa en nueve bloques clave, siguiendo el Business Model Canvas de Osterwalder y Pigneur.',
    sociosClaveLabel: 'Socios clave',
    sociosClavePlaceholder: '¿Quiénes son los principales socios y proveedores?',
    actividadesClaveLabel: 'Actividades clave',
    actividadesClavePlaceholder: '¿Qué actividades críticas requiere la propuesta de valor?',
    recursosClaveLabel: 'Recursos clave',
    recursosClavePlaceholder: '¿Qué activos son imprescindibles para el modelo?',
    propuestasValorLabel: 'Propuestas de valor',
    propuestasValorPlaceholder: '¿Qué problema resuelve o necesidad satisface? ¿Qué valor entrega a cada segmento?',
    relacionesClientesLabel: 'Relaciones con clientes',
    relacionesClientesPlaceholder: '¿Qué tipo de relación establece con cada segmento?',
    canalesLabel: 'Canales',
    canalesPlaceholder: '¿Cómo llega a los clientes y cómo les entrega la propuesta?',
    segmentosClientesLabel: 'Segmentos de clientes',
    segmentosClientesPlaceholder: '¿Para quién crea valor? ¿Quiénes son sus clientes más importantes?',
    estructuraCostesLabel: 'Estructura de costes',
    estructuraCostesPlaceholder: '¿Cuáles son los costes más importantes del modelo?',
    fuentesIngresosLabel: 'Fuentes de ingresos',
    fuentesIngresosPlaceholder: '¿Por qué valor están dispuestos a pagar los clientes? ¿Cómo pagan actualmente?',
    confirmVaciar: '¿Vaciar la plantilla?',
    generando: 'Generando…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Vaciar',
  },
  ca: {
    intro:
      "Descriu el model de negoci d'una empresa en nou blocs clau, seguint el Business Model Canvas d'Osterwalder i Pigneur.",
    sociosClaveLabel: 'Socis clau',
    sociosClavePlaceholder: 'Qui són els principals socis i proveïdors?',
    actividadesClaveLabel: 'Activitats clau',
    actividadesClavePlaceholder: 'Quines activitats crítiques requerix la proposta de valor?',
    recursosClaveLabel: 'Recursos clau',
    recursosClavePlaceholder: 'Quins actius són imprescindibles per al model?',
    propuestasValorLabel: 'Proposta de valor',
    propuestasValorPlaceholder: 'Quin problema resol o quina necessitat satisfà? Quin valor entrega a cada segment?',
    relacionesClientesLabel: 'Relació amb els clients',
    relacionesClientesPlaceholder: 'Quin tipus de relació establix amb cada segment?',
    canalesLabel: 'Canals',
    canalesPlaceholder: 'Com arriba als clients i com els entrega la proposta?',
    segmentosClientesLabel: 'Segments de clients',
    segmentosClientesPlaceholder: 'Per a qui crea valor? Qui són els seus clients més importants?',
    estructuraCostesLabel: 'Estructura de costos',
    estructuraCostesPlaceholder: 'Quins són els costos més importants del model?',
    fuentesIngresosLabel: 'Fonts d\'ingressos',
    fuentesIngresosPlaceholder: 'Per quin valor estan disposats a pagar els clients? Com paguen actualment?',
    confirmVaciar: 'Voleu buidar la plantilla?',
    generando: 'Generant…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Buidar',
  },
} as const;

interface Props { locale?: Locale }

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

export default function BusinessModelCanvas({ locale = 'es' }: Props) {
  const c = COPY[locale];
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
    if (confirm(c.confirmVaciar)) {
      setState(INITIAL);
    }
  }

  return (
    <div class="bmc-root">
      <p class="bmc-intro">{c.intro}</p>

      <div class="bmc-lienzo" ref={lienzoRef}>
        {/* Top 5-column area */}
        <div class="bmc-top">
          <Block
            id="socios_clave"
            label={c.sociosClaveLabel}
            value={state.socios_clave}
            onUpdate={setField}
            placeholder={c.sociosClavePlaceholder}
          />
          <div class="bmc-stack">
            <Block
              id="actividades_clave"
              label={c.actividadesClaveLabel}
              value={state.actividades_clave}
              onUpdate={setField}
              placeholder={c.actividadesClavePlaceholder}
            />
            <Block
              id="recursos_clave"
              label={c.recursosClaveLabel}
              value={state.recursos_clave}
              onUpdate={setField}
              placeholder={c.recursosClavePlaceholder}
            />
          </div>
          <Block
            id="propuestas_valor"
            label={c.propuestasValorLabel}
            value={state.propuestas_valor}
            onUpdate={setField}
            placeholder={c.propuestasValorPlaceholder}
          />
          <div class="bmc-stack">
            <Block
              id="relaciones_clientes"
              label={c.relacionesClientesLabel}
              value={state.relaciones_clientes}
              onUpdate={setField}
              placeholder={c.relacionesClientesPlaceholder}
            />
            <Block
              id="canales"
              label={c.canalesLabel}
              value={state.canales}
              onUpdate={setField}
              placeholder={c.canalesPlaceholder}
            />
          </div>
          <Block
            id="segmentos_clientes"
            label={c.segmentosClientesLabel}
            value={state.segmentos_clientes}
            onUpdate={setField}
            placeholder={c.segmentosClientesPlaceholder}
          />
        </div>

        {/* Bottom 2-column area */}
        <div class="bmc-bottom">
          <Block
            id="estructura_costes"
            label={c.estructuraCostesLabel}
            value={state.estructura_costes}
            onUpdate={setField}
            placeholder={c.estructuraCostesPlaceholder}
          />
          <Block
            id="fuentes_ingresos"
            label={c.fuentesIngresosLabel}
            value={state.fuentes_ingresos}
            onUpdate={setField}
            placeholder={c.fuentesIngresosPlaceholder}
          />
        </div>
      </div>

      <div class="bmc-actions no-print">
        <button
          class="bmc-btn bmc-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? c.generando : c.exportarPng}
        </button>
        <button
          class="bmc-btn bmc-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? c.generando : c.exportarPdf}
        </button>
        <button class="bmc-btn" onClick={() => window.print()}>
          {c.imprimir}
        </button>
        <button class="bmc-btn bmc-btn--danger" onClick={handleVaciar}>
          {c.vaciar}
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
