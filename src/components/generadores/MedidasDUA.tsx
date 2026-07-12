/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. The persisted state key
 * (pde:generador:medidas-dua), the field ids and the roman numerals I/II/III
 * stay structural; only what the teacher reads is translated. INITIAL is all
 * empty, so there are no user-facing default labels to seed.
 */
export const COPY = {
  es: {
    intro:
      'Planifica los ajustes de diseño universal para el aprendizaje (DUA): cómo presentar la información, qué formas de expresión se ofrecen y cómo se mantiene la motivación del alumno.',
    heading: 'Medidas DUA / adaptación',
    contextoLabel: 'Contexto / alumno',
    contextoPlaceholder:
      'Describe brevemente el contexto del aula o las características del alumno para quien se diseñan las medidas.',
    barrerasLabel: 'Barreras detectadas',
    barrerasPlaceholder:
      '¿Qué obstáculos dificultan el aprendizaje? (barreras de acceso, de comprensión, de motivación…)',
    repTitle: 'Representación',
    repDesc: 'Cómo se presenta la información al alumno',
    repPlaceholder:
      'Ej. Texto simplificado, esquemas visuales, audio, glosario de términos, ajuste de tipografía o contraste…',
    accTitle: 'Acción y expresión',
    accDesc: 'Cómo el alumno demuestra lo que sabe',
    accPlaceholder:
      'Ej. Producción oral en lugar de escrita, tiempo adicional, uso de herramientas digitales, formato alternativo de tarea…',
    impTitle: 'Implicación',
    impDesc: 'Cómo se mantiene la motivación y el compromiso',
    impPlaceholder:
      'Ej. Elección de temas, trabajo cooperativo, retroalimentación inmediata, metas a corto plazo, refuerzo positivo…',
    recursosLabel: 'Recursos y materiales',
    recursosPlaceholder:
      'Lista los materiales, herramientas o apoyos concretos que se utilizarán (aplicaciones, fichas adaptadas, persona de apoyo…).',
    seguimientoLabel: 'Seguimiento',
    seguimientoPlaceholder:
      '¿Cómo y cuándo se evaluará la eficacia de las medidas? ¿Qué indicadores usarás para ajustarlas?',
    generando: 'Generando…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Vaciar',
    confirmVaciar: '¿Vaciar la plantilla?',
  },
  ca: {
    intro:
      "Planifica els ajustos de disseny universal per a l'aprenentatge (DUA): com presentar la informació, quines formes d'expressió s'oferixen i com es manté la motivació de l'alumne.",
    heading: 'Mesures DUA / adaptació',
    contextoLabel: 'Context / alumne',
    contextoPlaceholder:
      "Descriu breument el context de l'aula o les característiques de l'alumne per a qui es dissenyen les mesures.",
    barrerasLabel: 'Barreres detectades',
    barrerasPlaceholder:
      "Quins obstacles dificulten l'aprenentatge? (barreres d'accés, de comprensió, de motivació…)",
    repTitle: 'Representació',
    repDesc: "Com es presenta la informació a l'alumne",
    repPlaceholder:
      'Ex. Text simplificat, esquemes visuals, àudio, glossari de termes, ajust de tipografia o contrast…',
    accTitle: 'Acció i expressió',
    accDesc: "Com l'alumne demostra el que sap",
    accPlaceholder:
      "Ex. Producció oral en lloc d'escrita, temps addicional, ús de ferramentes digitals, format alternatiu de tasca…",
    impTitle: 'Implicació',
    impDesc: 'Com es manté la motivació i el compromís',
    impPlaceholder:
      'Ex. Elecció de temes, treball cooperatiu, retroalimentació immediata, metes a curt termini, reforç positiu…',
    recursosLabel: 'Recursos i materials',
    recursosPlaceholder:
      "Llista els materials, ferramentes o suports concrets que s'utilitzaran (aplicacions, fitxes adaptades, persona de suport…).",
    seguimientoLabel: 'Seguiment',
    seguimientoPlaceholder:
      'Com i quan s\'avaluarà l\'eficàcia de les mesures? Quins indicadors utilitzaràs per a ajustar-les?',
    generando: 'Generant…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Buidar',
    confirmVaciar: 'Voleu buidar la plantilla?',
  },
} as const;

interface Props { locale?: Locale }

type MedidasDUAState = {
  contexto: string;
  barreras: string;
  representacion: string;
  accion: string;
  implicacion: string;
  recursos: string;
  seguimiento: string;
};

const INITIAL: MedidasDUAState = {
  contexto: '',
  barreras: '',
  representacion: '',
  accion: '',
  implicacion: '',
  recursos: '',
  seguimiento: '',
};

export default function MedidasDUA({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [state, setState] = usePersistentState<MedidasDUAState>('pde:generador:medidas-dua', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(id: keyof MedidasDUAState, value: string) {
    setState({ ...state, [id]: value });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'medidas-dua', formato);
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
    <div class="dua-root">
      <p class="dua-intro">
        {c.intro}
      </p>

      <div class="lienzo" ref={lienzoRef}>
        <h2 class="dua-heading">{c.heading}</h2>

        <div class="dua-section">
          <label class="dua-label" for="dua-contexto">{c.contextoLabel}</label>
          <textarea
            id="dua-contexto"
            class="dua-textarea"
            value={state.contexto}
            placeholder={c.contextoPlaceholder}
            onInput={(e) => setField('contexto', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="dua-section">
          <label class="dua-label" for="dua-barreras">{c.barrerasLabel}</label>
          <textarea
            id="dua-barreras"
            class="dua-textarea"
            value={state.barreras}
            placeholder={c.barrerasPlaceholder}
            onInput={(e) => setField('barreras', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="dua-principles">
          <div class="dua-principle dua-principle--rep">
            <div class="dua-principle-header">
              <span class="dua-principle-num">I</span>
              <span class="dua-principle-title">{c.repTitle}</span>
            </div>
            <p class="dua-principle-desc">{c.repDesc}</p>
            <textarea
              id="dua-representacion"
              class="dua-textarea dua-textarea--principle"
              value={state.representacion}
              placeholder={c.repPlaceholder}
              onInput={(e) => setField('representacion', (e.target as HTMLTextAreaElement).value)}
            />
          </div>

          <div class="dua-principle dua-principle--acc">
            <div class="dua-principle-header">
              <span class="dua-principle-num">II</span>
              <span class="dua-principle-title">{c.accTitle}</span>
            </div>
            <p class="dua-principle-desc">{c.accDesc}</p>
            <textarea
              id="dua-accion"
              class="dua-textarea dua-textarea--principle"
              value={state.accion}
              placeholder={c.accPlaceholder}
              onInput={(e) => setField('accion', (e.target as HTMLTextAreaElement).value)}
            />
          </div>

          <div class="dua-principle dua-principle--imp">
            <div class="dua-principle-header">
              <span class="dua-principle-num">III</span>
              <span class="dua-principle-title">{c.impTitle}</span>
            </div>
            <p class="dua-principle-desc">{c.impDesc}</p>
            <textarea
              id="dua-implicacion"
              class="dua-textarea dua-textarea--principle"
              value={state.implicacion}
              placeholder={c.impPlaceholder}
              onInput={(e) => setField('implicacion', (e.target as HTMLTextAreaElement).value)}
            />
          </div>
        </div>

        <div class="dua-section">
          <label class="dua-label" for="dua-recursos">{c.recursosLabel}</label>
          <textarea
            id="dua-recursos"
            class="dua-textarea"
            value={state.recursos}
            placeholder={c.recursosPlaceholder}
            onInput={(e) => setField('recursos', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="dua-section">
          <label class="dua-label" for="dua-seguimiento">{c.seguimientoLabel}</label>
          <textarea
            id="dua-seguimiento"
            class="dua-textarea"
            value={state.seguimiento}
            placeholder={c.seguimientoPlaceholder}
            onInput={(e) => setField('seguimiento', (e.target as HTMLTextAreaElement).value)}
          />
        </div>
      </div>

      <div class="dua-actions no-print">
        <button
          class="dua-btn dua-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? c.generando : c.exportarPng}
        </button>
        <button
          class="dua-btn dua-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? c.generando : c.exportarPdf}
        </button>
        <button class="dua-btn" onClick={() => window.print()}>
          {c.imprimir}
        </button>
        <button class="dua-btn dua-btn--danger" onClick={handleVaciar}>
          {c.vaciar}
        </button>
      </div>

      <style>{`
        .dua-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .dua-intro {
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .lienzo {
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
          background: var(--color-paper, #ffffff);
          padding: 1.5rem;
        }
        .dua-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-terra, #C44E2C);
        }
        .dua-section {
          margin-bottom: 1.125rem;
        }
        .dua-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          margin-bottom: 0.35rem;
        }
        .dua-textarea {
          width: 100%;
          min-height: 4.5rem;
          padding: 0.5rem 0.625rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-ink, #2A1F18);
          resize: vertical;
          box-sizing: border-box;
        }
        .dua-textarea:focus {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 1px;
        }
        .dua-textarea--principle {
          min-height: 5.5rem;
        }
        .dua-textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.825rem;
        }
        .dua-principles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.125rem;
        }
        @media (max-width: 600px) {
          .dua-principles { grid-template-columns: 1fr; }
        }
        .dua-principle {
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dua-principle--rep {
          border-top: 3px solid var(--color-terra, #C44E2C);
        }
        .dua-principle--acc {
          border-top: 3px solid var(--color-mostassa, #D4A24C);
        }
        .dua-principle--imp {
          border-top: 3px solid var(--color-ink-soft, #5C4A3D);
        }
        .dua-principle-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dua-principle-num {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--color-bg-soft, #F8E8D0);
          color: var(--color-ink-soft, #5C4A3D);
          padding: 0.15rem 0.45rem;
          border-radius: 0.2rem;
          letter-spacing: 0.04em;
        }
        .dua-principle-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
        }
        .dua-principle-desc {
          font-size: 0.8rem;
          color: var(--color-ink-mute, #8A7868);
          margin: 0;
          line-height: 1.4;
        }
        .dua-principle .dua-textarea--principle {
          border-color: transparent;
          background: var(--color-bg-soft, #F8E8D0);
        }
        .dua-principle .dua-textarea--principle:focus {
          border-color: var(--color-terra, #C44E2C);
          background: transparent;
        }
        .dua-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .dua-btn {
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
        .dua-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .dua-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .dua-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .dua-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .dua-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .lienzo {
            border: none;
            padding: 0;
            width: 100%;
          }
          .dua-textarea {
            resize: none;
            color: #000 !important;
            background: transparent !important;
          }
          .dua-principle .dua-textarea--principle {
            background: transparent !important;
          }
          .dua-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
