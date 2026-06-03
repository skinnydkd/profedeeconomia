/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';

type Criterio = {
  id: string;
  texto: string;
};

type AutoevaluacionState = {
  titulo: string;
  nombre: string;
  equipo: string;
  fecha: string;
  escala: string[];
  criterios: Criterio[];
};

const INITIAL: AutoevaluacionState = {
  titulo: '',
  nombre: '',
  equipo: '',
  fecha: '',
  escala: ['Poco', 'Bastante', 'Mucho'],
  criterios: [
    { id: 'c1', texto: '' },
    { id: 'c2', texto: '' },
    { id: 'c3', texto: '' },
  ],
};

export default function Autoevaluacion() {
  const [state, setState] = usePersistentState<AutoevaluacionState>('pde:generador:autoevaluacion', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(field: 'titulo' | 'nombre' | 'equipo' | 'fecha', value: string) {
    setState({ ...state, [field]: value });
  }

  function setEscalaLabel(idx: number, value: string) {
    const escala = [...state.escala];
    escala[idx] = value;
    setState({ ...state, escala });
  }

  function setCriterio(id: string, texto: string) {
    setState({
      ...state,
      criterios: state.criterios.map((c) => (c.id === id ? { ...c, texto } : c)),
    });
  }

  function addCriterio() {
    const newId = 'c' + Date.now();
    setState({ ...state, criterios: [...state.criterios, { id: newId, texto: '' }] });
  }

  function removeCriterio(id: string) {
    if (state.criterios.length <= 1) return;
    setState({ ...state, criterios: state.criterios.filter((c) => c.id !== id) });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'autoevaluacion', formato);
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
    <div class="ae-root">
      <p class="ae-intro">
        Diseña una ficha de autoevaluación o coevaluación: define los criterios a valorar, ajusta
        las etiquetas de la escala y entrégala al alumno para que marque su nivel.
      </p>

      <div class="lienzo" ref={lienzoRef}>
        <h2 class="ae-heading">Autoevaluación / coevaluación</h2>

        <div class="ae-meta-grid">
          <div class="ae-field ae-field--titulo">
            <label class="ae-label" for="ae-titulo">Título / tarea</label>
            <input
              id="ae-titulo"
              class="ae-input"
              type="text"
              value={state.titulo}
              placeholder="Ej. Trabajo cooperativo — Unidad 3"
              onInput={(e) => setField('titulo', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="ae-field">
            <label class="ae-label" for="ae-nombre">Nombre del alumno/a</label>
            <input
              id="ae-nombre"
              class="ae-input"
              type="text"
              value={state.nombre}
              placeholder="Nombre y apellidos"
              onInput={(e) => setField('nombre', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="ae-field">
            <label class="ae-label" for="ae-equipo">Equipo / grupo</label>
            <input
              id="ae-equipo"
              class="ae-input"
              type="text"
              value={state.equipo}
              placeholder="Ej. Grupo A"
              onInput={(e) => setField('equipo', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="ae-field">
            <label class="ae-label" for="ae-fecha">Fecha</label>
            <input
              id="ae-fecha"
              class="ae-input"
              type="text"
              value={state.fecha}
              placeholder="dd/mm/aaaa"
              onInput={(e) => setField('fecha', (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="ae-escala-config no-print">
          <span class="ae-label">Etiquetas de la escala</span>
          <div class="ae-escala-inputs">
            {state.escala.map((label, idx) => (
              <div key={idx} class="ae-escala-item">
                <span class="ae-escala-num">{idx + 1}</span>
                <input
                  class="ae-input ae-input--escala"
                  type="text"
                  value={label}
                  placeholder={`Nivel ${idx + 1}`}
                  onInput={(e) => setEscalaLabel(idx, (e.target as HTMLInputElement).value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div class="ae-table-wrap">
          <table class="ae-table">
            <thead>
              <tr>
                <th class="ae-th ae-th--criterio">Criterio</th>
                {state.escala.map((label, idx) => (
                  <th key={idx} class="ae-th ae-th--nivel">
                    {label || `Nivel ${idx + 1}`}
                  </th>
                ))}
                <th class="ae-th ae-th--remove no-print" aria-label="Eliminar fila" />
              </tr>
            </thead>
            <tbody>
              {state.criterios.map((criterio) => (
                <tr key={criterio.id} class="ae-row">
                  <td class="ae-td ae-td--criterio">
                    <textarea
                      class="ae-criterio-input"
                      value={criterio.texto}
                      placeholder="Describe el criterio o aspecto a valorar…"
                      onInput={(e) =>
                        setCriterio(criterio.id, (e.target as HTMLTextAreaElement).value)
                      }
                    />
                  </td>
                  {state.escala.map((_, idx) => (
                    <td key={idx} class="ae-td ae-td--check">
                      <div class="ae-check-box" aria-label={`Marcar ${state.escala[idx]}`} />
                    </td>
                  ))}
                  <td class="ae-td no-print">
                    <button
                      class="ae-remove-btn"
                      onClick={() => removeCriterio(criterio.id)}
                      disabled={state.criterios.length <= 1}
                      aria-label="Eliminar criterio"
                      title="Eliminar criterio"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div class="ae-actions no-print">
        <button class="ae-btn ae-btn--add" onClick={addCriterio}>
          + Añadir criterio
        </button>
        <button
          class="ae-btn ae-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? 'Generando…' : 'Exportar PNG'}
        </button>
        <button
          class="ae-btn ae-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? 'Generando…' : 'Exportar PDF'}
        </button>
        <button class="ae-btn" onClick={() => window.print()}>
          Imprimir
        </button>
        <button class="ae-btn ae-btn--danger" onClick={handleVaciar}>
          Vaciar
        </button>
      </div>

      <style>{`
        .ae-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .ae-intro {
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
        .ae-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-terra, #C44E2C);
        }
        .ae-meta-grid {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr;
          gap: 0.75rem 1rem;
          margin-bottom: 1.25rem;
        }
        .ae-field--titulo {
          grid-column: 1 / -1;
        }
        @media (max-width: 600px) {
          .ae-meta-grid { grid-template-columns: 1fr; }
          .ae-field--titulo { grid-column: auto; }
        }
        .ae-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .ae-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          margin-bottom: 0.2rem;
        }
        .ae-input {
          padding: 0.45rem 0.625rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.9rem;
          color: var(--color-ink, #2A1F18);
          box-sizing: border-box;
          width: 100%;
        }
        .ae-input:focus {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 1px;
        }
        .ae-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.825rem;
        }
        .ae-escala-config {
          margin-bottom: 1.125rem;
        }
        .ae-escala-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 0.35rem;
        }
        .ae-escala-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .ae-escala-num {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-ink-mute, #8A7868);
          min-width: 1rem;
          text-align: center;
        }
        .ae-input--escala {
          width: 7rem;
        }
        .ae-table-wrap {
          overflow-x: auto;
        }
        .ae-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .ae-th {
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-ink-mute, #8A7868);
          background: var(--color-bg-soft, #F8E8D0);
          padding: 0.5rem 0.625rem;
          border: 1px solid var(--color-line, #E5D4BD);
          white-space: nowrap;
        }
        .ae-th--criterio {
          min-width: 200px;
          text-align: left;
        }
        .ae-th--nivel {
          min-width: 80px;
          text-align: center;
        }
        .ae-th--remove {
          width: 2rem;
          border-left: none;
        }
        .ae-td {
          padding: 0.375rem 0.375rem;
          border: 1px solid var(--color-line, #E5D4BD);
          vertical-align: middle;
        }
        .ae-td--criterio {
          vertical-align: top;
        }
        .ae-td--check {
          text-align: center;
        }
        .ae-criterio-input {
          width: 100%;
          min-height: 3rem;
          padding: 0.3rem 0.4rem;
          border: none;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--color-ink, #2A1F18);
          resize: vertical;
          box-sizing: border-box;
        }
        .ae-criterio-input:focus {
          outline: 1px solid var(--color-terra, #C44E2C);
          border-radius: 0.2rem;
        }
        .ae-criterio-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }
        .ae-check-box {
          width: 1.25rem;
          height: 1.25rem;
          border: 1.5px solid var(--color-line, #E5D4BD);
          border-radius: 0.2rem;
          margin: 0 auto;
          background: transparent;
          cursor: default;
        }
        .ae-remove-btn {
          background: none;
          border: none;
          color: var(--color-ink-mute, #8A7868);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          padding: 0.2rem 0.4rem;
          border-radius: 0.2rem;
          transition: color 0.15s, background 0.15s;
        }
        .ae-remove-btn:hover:not(:disabled) {
          color: var(--color-terra, #C44E2C);
          background: var(--color-terra-soft, #FBE3D6);
        }
        .ae-remove-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .ae-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .ae-btn {
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
        .ae-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .ae-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .ae-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .ae-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .ae-btn--add {
          background: var(--color-bg-soft, #F8E8D0);
          border-color: var(--color-line, #E5D4BD);
        }
        .ae-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .lienzo {
            border: none;
            padding: 0;
            width: 100%;
          }
          .ae-criterio-input {
            resize: none;
            color: #000 !important;
            background: transparent !important;
          }
          .ae-input {
            color: #000 !important;
            background: transparent !important;
          }
          .ae-check-box {
            border-color: #999;
          }
          .ae-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
