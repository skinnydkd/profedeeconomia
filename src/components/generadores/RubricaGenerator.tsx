/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';

// ── Types ────────────────────────────────────────────────────────────────────

interface Criterio {
  id: string;
  nombre: string;
  competencia: string;
  celdas: string[];
}

interface RubricaState {
  titulo: string;
  niveles: string[];
  criterios: Criterio[];
}

// ── Static initial state (no dynamic ids/Date.now/Math.random here) ──────────

const INITIAL: RubricaState = {
  titulo: '',
  niveles: ['Insuficiente', 'Suficiente', 'Notable', 'Sobresaliente'],
  criterios: [
    { id: 'c1', nombre: '', competencia: '', celdas: ['', '', '', ''] },
    { id: 'c2', nombre: '', competencia: '', celdas: ['', '', '', ''] },
  ],
};

// ── Counter ref for handler-generated ids (browser-only, not in INITIAL) ─────
let _idCounter = 3;

function genId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `c${_idCounter++}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function RubricaGenerator() {
  const [state, setState] = usePersistentState<RubricaState>('pde:generador:rubricas', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  // ── Field helpers ──────────────────────────────────────────────────────────

  function setTitulo(v: string) {
    setState({ ...state, titulo: v });
  }

  function setNivelLabel(i: number, v: string) {
    const niveles = state.niveles.map((n, idx) => (idx === i ? v : n));
    setState({ ...state, niveles });
  }

  function setCriterioNombre(id: string, v: string) {
    setState({
      ...state,
      criterios: state.criterios.map((c) => (c.id === id ? { ...c, nombre: v } : c)),
    });
  }

  function setCriterioCompetencia(id: string, v: string) {
    setState({
      ...state,
      criterios: state.criterios.map((c) =>
        c.id === id ? { ...c, competencia: v } : c,
      ),
    });
  }

  function setCelda(id: string, col: number, v: string) {
    setState({
      ...state,
      criterios: state.criterios.map((c) => {
        if (c.id !== id) return c;
        const celdas = c.celdas.map((cell, i) => (i === col ? v : cell));
        return { ...c, celdas };
      }),
    });
  }

  // ── Nivel add / remove (keeps celdas in sync) ─────────────────────────────

  function addNivel() {
    setState({
      ...state,
      niveles: [...state.niveles, ''],
      criterios: state.criterios.map((c) => ({ ...c, celdas: [...c.celdas, ''] })),
    });
  }

  function quitarNivel() {
    if (state.niveles.length <= 2) return;
    setState({
      ...state,
      niveles: state.niveles.slice(0, -1),
      criterios: state.criterios.map((c) => ({ ...c, celdas: c.celdas.slice(0, -1) })),
    });
  }

  // ── Criterio add / remove ──────────────────────────────────────────────────

  function addCriterio() {
    const newCriterio: Criterio = {
      id: genId(),
      nombre: '',
      competencia: '',
      celdas: state.niveles.map(() => ''),
    };
    setState({ ...state, criterios: [...state.criterios, newCriterio] });
  }

  function removeCriterio(id: string) {
    if (state.criterios.length <= 1) return;
    setState({ ...state, criterios: state.criterios.filter((c) => c.id !== id) });
  }

  // ── Export / print / vaciar ────────────────────────────────────────────────

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'rubrica', formato);
    } catch (_) {
      // print is always-works fallback
    } finally {
      setExporting(null);
    }
  }

  function handleVaciar() {
    if (confirm('¿Vaciar la rúbrica?')) {
      setState(INITIAL);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div class="rg-root">
      <p class="rg-intro">
        Diseña una rúbrica de evaluación: define los criterios, los niveles de desempeño y los
        descriptores para cada combinación. Se guarda automáticamente en tu navegador.
      </p>

      {/* ── Lienzo (capturado para exportar) ─────────────────────────────── */}
      <div class="rg-lienzo-wrap">
        <div class="lienzo" ref={lienzoRef}>
          {/* Título */}
          <div class="rg-titulo-row">
            <input
              class="rg-titulo-input"
              type="text"
              placeholder="Título de la rúbrica"
              value={state.titulo}
              onInput={(e) => setTitulo((e.target as HTMLInputElement).value)}
            />
          </div>

          {/* Tabla */}
          <div class="rg-table-scroll">
            <table class="rg-table">
              <thead>
                <tr class="rg-thead-row">
                  <th class="rg-th rg-th--criterio">Criterio</th>
                  <th class="rg-th rg-th--competencia">Competencia</th>
                  {state.niveles.map((nivel, i) => (
                    <th key={i} class="rg-th rg-th--nivel">
                      <input
                        class="rg-nivel-input"
                        type="text"
                        value={nivel}
                        placeholder={`Nivel ${i + 1}`}
                        onInput={(e) => setNivelLabel(i, (e.target as HTMLInputElement).value)}
                        aria-label={`Etiqueta del nivel ${i + 1}`}
                      />
                    </th>
                  ))}
                  {/* Spacer column for remove-criterio buttons */}
                  <th class="rg-th rg-th--actions no-print" aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                {state.criterios.map((criterio) => (
                  <tr key={criterio.id} class="rg-tr">
                    <td class="rg-td rg-td--criterio">
                      <input
                        class="rg-input rg-input--criterio"
                        type="text"
                        value={criterio.nombre}
                        placeholder="Nombre del criterio"
                        onInput={(e) =>
                          setCriterioNombre(criterio.id, (e.target as HTMLInputElement).value)
                        }
                        aria-label="Nombre del criterio"
                      />
                    </td>
                    <td class="rg-td rg-td--competencia">
                      <input
                        class="rg-input rg-input--competencia"
                        type="text"
                        value={criterio.competencia}
                        placeholder="p.&nbsp;ej. CE4"
                        onInput={(e) =>
                          setCriterioCompetencia(
                            criterio.id,
                            (e.target as HTMLInputElement).value,
                          )
                        }
                        aria-label="Competencia relacionada"
                      />
                    </td>
                    {criterio.celdas.map((celda, col) => (
                      <td key={col} class="rg-td rg-td--celda">
                        <textarea
                          class="rg-textarea"
                          value={celda}
                          placeholder="Descriptor…"
                          onInput={(e) =>
                            setCelda(criterio.id, col, (e.target as HTMLTextAreaElement).value)
                          }
                          aria-label={`Descriptor: ${criterio.nombre || 'criterio'} — nivel ${col + 1}`}
                        />
                      </td>
                    ))}
                    <td class="rg-td rg-td--actions no-print">
                      <button
                        class="rg-btn-remove"
                        onClick={() => removeCriterio(criterio.id)}
                        title="Eliminar criterio"
                        aria-label={`Eliminar criterio ${criterio.nombre || ''}`}
                        disabled={state.criterios.length <= 1}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controls inside lienzo but hidden at print */}
          <div class="rg-table-controls no-print">
            <button class="rg-btn-table-ctrl" onClick={addCriterio}>
              + Añadir criterio
            </button>
            <div class="rg-nivel-controls">
              <button class="rg-btn-table-ctrl" onClick={addNivel}>
                + Añadir nivel
              </button>
              <button
                class="rg-btn-table-ctrl rg-btn-table-ctrl--quitar"
                onClick={quitarNivel}
                disabled={state.niveles.length <= 2}
              >
                − Quitar nivel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action bar (outside lienzo, hidden at print) ───────────────────── */}
      <div class="rg-actions no-print">
        <button
          class="rg-btn rg-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? 'Generando…' : 'Exportar PNG'}
        </button>
        <button
          class="rg-btn rg-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? 'Generando…' : 'Exportar PDF'}
        </button>
        <button class="rg-btn" onClick={() => window.print()}>
          Imprimir
        </button>
        <button class="rg-btn rg-btn--danger" onClick={handleVaciar}>
          Vaciar
        </button>
      </div>

      {/* ── Scoped styles ────────────────────────────────────────────────────── */}
      <style>{`
        .rg-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }

        .rg-intro {
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }

        /* ── Scrollable wrapper for wide tables on screen ────────────────── */
        .rg-lienzo-wrap {
          overflow-x: auto;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.375rem;
        }

        .lienzo {
          background: var(--color-paper, #ffffff);
          padding: 1.25rem;
          min-width: 36rem;
        }

        /* ── Título ──────────────────────────────────────────────────────── */
        .rg-titulo-row {
          margin-bottom: 1rem;
        }

        .rg-titulo-input {
          width: 100%;
          font-family: var(--font-heading, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
          border: none;
          border-bottom: 2px solid var(--color-terra, #C44E2C);
          background: transparent;
          padding: 0.25rem 0;
          outline: none;
          box-sizing: border-box;
        }

        .rg-titulo-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-weight: 400;
        }

        /* ── Table scroll wrapper ────────────────────────────────────────── */
        .rg-table-scroll {
          overflow-x: auto;
        }

        /* ── Table ───────────────────────────────────────────────────────── */
        .rg-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          table-layout: auto;
        }

        .rg-thead-row {
          background: var(--color-bg-soft, #F8E8D0);
        }

        .rg-th {
          padding: 0.5rem 0.625rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-soft, #5C4A3D);
          border: 1px solid var(--color-line, #E5D4BD);
          text-align: left;
          white-space: nowrap;
        }

        .rg-th--criterio {
          width: 14%;
          min-width: 8rem;
        }

        .rg-th--competencia {
          width: 8%;
          min-width: 5rem;
        }

        .rg-th--nivel {
          min-width: 9rem;
        }

        .rg-th--actions {
          width: 2.5rem;
          border: none;
          background: transparent;
        }

        .rg-nivel-input {
          width: 100%;
          border: none;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-soft, #5C4A3D);
          outline: none;
          text-align: left;
          box-sizing: border-box;
        }

        .rg-nivel-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
        }

        /* ── Body rows ───────────────────────────────────────────────────── */
        .rg-tr:nth-child(even) .rg-td {
          background: var(--color-cream, #F5EDD9);
        }

        .rg-td {
          padding: 0.5rem 0.625rem;
          border: 1px solid var(--color-line, #E5D4BD);
          vertical-align: top;
          background: var(--color-paper, #ffffff);
        }

        .rg-td--criterio {
          vertical-align: middle;
        }

        .rg-td--competencia {
          vertical-align: middle;
          text-align: center;
        }

        .rg-td--actions {
          border: none;
          background: transparent;
          vertical-align: middle;
          text-align: center;
        }

        /* ── Inputs inside table ─────────────────────────────────────────── */
        .rg-input {
          width: 100%;
          border: none;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
          color: var(--color-ink, #2A1F18);
          outline: none;
          box-sizing: border-box;
        }

        .rg-input--criterio {
          font-weight: 600;
        }

        .rg-input--competencia {
          font-size: 0.8rem;
          color: var(--color-terra, #C44E2C);
          font-weight: 600;
          text-align: center;
        }

        .rg-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-weight: 400;
        }

        /* ── Textarea descriptors ────────────────────────────────────────── */
        .rg-textarea {
          width: 100%;
          min-height: 5rem;
          border: none;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--color-ink, #2A1F18);
          outline: none;
          resize: vertical;
          box-sizing: border-box;
        }

        .rg-textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }

        /* ── Remove button ───────────────────────────────────────────────── */
        .rg-btn-remove {
          background: none;
          border: none;
          color: var(--color-ink-mute, #8A7868);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          transition: color 0.15s, background 0.15s;
        }

        .rg-btn-remove:hover:not(:disabled) {
          color: var(--color-terra, #C44E2C);
          background: var(--color-terra-soft, #FBE3D6);
        }

        .rg-btn-remove:disabled {
          opacity: 0.3;
          cursor: default;
        }

        /* ── Table controls ──────────────────────────────────────────────── */
        .rg-table-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.875rem;
          padding-top: 0.875rem;
          border-top: 1px solid var(--color-line-soft, #EFE2CB);
        }

        .rg-nivel-controls {
          display: flex;
          gap: 0.5rem;
        }

        .rg-btn-table-ctrl {
          background: none;
          border: 1px dashed var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          color: var(--color-ink-soft, #5C4A3D);
          cursor: pointer;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.8rem;
          padding: 0.3rem 0.65rem;
          transition: border-color 0.15s, color 0.15s;
        }

        .rg-btn-table-ctrl:hover:not(:disabled) {
          border-color: var(--color-terra, #C44E2C);
          color: var(--color-terra, #C44E2C);
        }

        .rg-btn-table-ctrl--quitar:hover:not(:disabled) {
          border-color: var(--color-ink-soft, #5C4A3D);
          color: var(--color-ink-soft, #5C4A3D);
        }

        .rg-btn-table-ctrl:disabled {
          opacity: 0.35;
          cursor: default;
        }

        /* ── Action bar ──────────────────────────────────────────────────── */
        .rg-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }

        .rg-btn {
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

        .rg-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }

        .rg-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .rg-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }

        .rg-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }

        .rg-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        /* ── Print ───────────────────────────────────────────────────────── */
        @media print {
          .no-print {
            display: none !important;
          }

          .rg-root {
            padding: 0;
          }

          .rg-intro {
            display: none;
          }

          .rg-lienzo-wrap {
            border: none;
            overflow: visible;
          }

          .lienzo {
            padding: 0;
            min-width: unset;
            width: 100%;
          }

          .rg-table {
            width: 100%;
            page-break-inside: avoid;
          }

          .rg-titulo-input,
          .rg-nivel-input,
          .rg-input,
          .rg-textarea {
            color: #000 !important;
            background: transparent !important;
            resize: none !important;
            border: none !important;
          }

          .rg-td,
          .rg-th {
            border: 1px solid #ccc !important;
          }

          .rg-thead-row {
            background: #f0ece4 !important;
          }
        }
      `}</style>
    </div>
  );
}
