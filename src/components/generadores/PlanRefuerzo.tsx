/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';

type PlanRefuerzoState = {
  alumno: string;
  grupo: string;
  curso: string;
  fecha: string;
  areas: string;
  medidas: string;
  actividades: string;
  temporizacion: string;
  seguimiento: string;
};

const INITIAL: PlanRefuerzoState = {
  alumno: '',
  grupo: '',
  curso: '',
  fecha: '',
  areas: '',
  medidas: '',
  actividades: '',
  temporizacion: '',
  seguimiento: '',
};

export default function PlanRefuerzo() {
  const [state, setState] = usePersistentState<PlanRefuerzoState>('pde:generador:plan-refuerzo', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setField(id: keyof PlanRefuerzoState, value: string) {
    setState({ ...state, [id]: value });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'plan-refuerzo', formato);
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
    <div class="pr-root">
      <p class="pr-intro">
        Documenta el plan de refuerzo o recuperación de un alumno: áreas a reforzar, medidas
        adoptadas, actividades propuestas y seguimiento.
      </p>

      <div class="lienzo" ref={lienzoRef}>
        <h2 class="pr-heading">Plan de refuerzo / recuperación</h2>

        <div class="pr-meta-grid">
          <div class="pr-field">
            <label class="pr-label" for="pr-alumno">Alumno/a</label>
            <input
              id="pr-alumno"
              class="pr-input"
              type="text"
              value={state.alumno}
              placeholder="Nombre y apellidos"
              onInput={(e) => setField('alumno', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pr-field">
            <label class="pr-label" for="pr-grupo">Grupo</label>
            <input
              id="pr-grupo"
              class="pr-input"
              type="text"
              value={state.grupo}
              placeholder="Ej. 2.º A"
              onInput={(e) => setField('grupo', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pr-field">
            <label class="pr-label" for="pr-curso">Curso</label>
            <input
              id="pr-curso"
              class="pr-input"
              type="text"
              value={state.curso}
              placeholder="Ej. 2024-2025"
              onInput={(e) => setField('curso', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pr-field">
            <label class="pr-label" for="pr-fecha">Fecha</label>
            <input
              id="pr-fecha"
              class="pr-input"
              type="text"
              value={state.fecha}
              placeholder="dd/mm/aaaa"
              onInput={(e) => setField('fecha', (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="pr-section">
          <label class="pr-label" for="pr-areas">Áreas / criterios a reforzar</label>
          <textarea
            id="pr-areas"
            class="pr-textarea"
            value={state.areas}
            placeholder="Indica las competencias, criterios de evaluación o contenidos en los que el alumno presenta dificultades."
            onInput={(e) => setField('areas', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="pr-section">
          <label class="pr-label" for="pr-medidas">Medidas / apoyos</label>
          <textarea
            id="pr-medidas"
            class="pr-textarea"
            value={state.medidas}
            placeholder="Describe las medidas de atención a la diversidad, apoyos dentro o fuera del aula, adaptaciones metodológicas, etc."
            onInput={(e) => setField('medidas', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="pr-section">
          <label class="pr-label" for="pr-actividades">Actividades propuestas</label>
          <textarea
            id="pr-actividades"
            class="pr-textarea"
            value={state.actividades}
            placeholder="Lista las actividades, ejercicios o tareas específicas que se proponen para superar las dificultades."
            onInput={(e) => setField('actividades', (e.target as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="pr-section">
          <label class="pr-label" for="pr-temporizacion">Temporización</label>
          <input
            id="pr-temporizacion"
            class="pr-input"
            type="text"
            value={state.temporizacion}
            placeholder="Ej. Del 10 de octubre al 30 de noviembre; revisión semanal los martes."
            onInput={(e) => setField('temporizacion', (e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="pr-section">
          <label class="pr-label" for="pr-seguimiento">Seguimiento / observaciones</label>
          <textarea
            id="pr-seguimiento"
            class="pr-textarea"
            value={state.seguimiento}
            placeholder="Registra los avances, incidencias y cualquier observación relevante durante el período de refuerzo."
            onInput={(e) => setField('seguimiento', (e.target as HTMLTextAreaElement).value)}
          />
        </div>
      </div>

      <div class="pr-actions no-print">
        <button
          class="pr-btn pr-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? 'Generando…' : 'Exportar PNG'}
        </button>
        <button
          class="pr-btn pr-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? 'Generando…' : 'Exportar PDF'}
        </button>
        <button class="pr-btn" onClick={() => window.print()}>
          Imprimir
        </button>
        <button class="pr-btn pr-btn--danger" onClick={handleVaciar}>
          Vaciar
        </button>
      </div>

      <style>{`
        .pr-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .pr-intro {
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
        .pr-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-terra, #C44E2C);
        }
        .pr-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 1.25rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 480px) {
          .pr-meta-grid { grid-template-columns: 1fr; }
        }
        .pr-section {
          margin-bottom: 1.125rem;
        }
        .pr-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
          margin-bottom: 0.35rem;
        }
        .pr-input {
          width: 100%;
          padding: 0.45rem 0.625rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.9rem;
          color: var(--color-ink, #2A1F18);
          box-sizing: border-box;
        }
        .pr-input:focus {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 1px;
        }
        .pr-textarea {
          width: 100%;
          min-height: 5rem;
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
        .pr-textarea:focus {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 1px;
        }
        .pr-textarea::placeholder,
        .pr-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.825rem;
        }
        .pr-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .pr-btn {
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
        .pr-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .pr-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .pr-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .pr-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .pr-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .lienzo {
            border: none;
            padding: 0;
            width: 100%;
          }
          .pr-input,
          .pr-textarea {
            resize: none;
            border: 1px solid #ccc;
            color: #000 !important;
            background: transparent !important;
          }
          .pr-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
