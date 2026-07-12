/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import { usePersistentState } from '@/lib/plantillas/persistence';
import { exportarNodo } from '@/lib/plantillas/export';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. The persisted state key
 * (pde:generador:registro-aula) and alumno ids stay structural; only what the
 * teacher reads is translated. INITIAL seeds empty fields (no visible default
 * labels), so nothing in the seed needs localizing.
 */
export const COPY = {
  es: {
    intro:
      'Registra la asistencia, actitud y entrega de tareas de cada alumno por sesión. Añade o elimina filas según el número de alumnos del grupo.',
    heading: 'Registro de aula',
    fechaLabel: 'Fecha',
    fechaPlaceholder: 'dd/mm/aaaa',
    sesionLabel: 'Sesión / unidad',
    sesionPlaceholder: 'Ej. Sesión 3 — Mercado de trabajo',
    thAlumno: 'Alumno/a',
    thAsistencia: 'Asistencia',
    thActitud: 'Actitud',
    thEntregas: 'Entregas',
    thObservaciones: 'Observaciones',
    eliminarFilaAria: 'Eliminar fila',
    nombrePlaceholder: 'Nombre',
    asistenciaPlaceholder: 'P / A / R',
    actitudPlaceholder: '1–5',
    entregasPlaceholder: 'Sí / No',
    observacionesPlaceholder: 'Observaciones',
    eliminarAlumnoTitle: 'Eliminar alumno',
    addAlumno: '+ Añadir alumno',
    generando: 'Generando…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Vaciar',
    confirmVaciar: '¿Vaciar la plantilla?',
  },
  ca: {
    intro:
      "Registra l'assistència, l'actitud i l'entrega de tasques de cada alumne per sessió. Afig o elimina files segons el nombre d'alumnes del grup.",
    heading: "Registre d'aula",
    fechaLabel: 'Data',
    fechaPlaceholder: 'dd/mm/aaaa',
    sesionLabel: 'Sessió / unitat',
    sesionPlaceholder: 'P. ex. Sessió 3 — Mercat de treball',
    thAlumno: 'Alumne/a',
    thAsistencia: 'Assistència',
    thActitud: 'Actitud',
    thEntregas: 'Entregues',
    thObservaciones: 'Observacions',
    eliminarFilaAria: 'Eliminar fila',
    nombrePlaceholder: 'Nom',
    asistenciaPlaceholder: 'P / A / R',
    actitudPlaceholder: '1–5',
    entregasPlaceholder: 'Sí / No',
    observacionesPlaceholder: 'Observacions',
    eliminarAlumnoTitle: 'Eliminar alumne',
    addAlumno: '+ Afegir alumne',
    generando: 'Generant…',
    exportarPng: 'Exportar PNG',
    exportarPdf: 'Exportar PDF',
    imprimir: 'Imprimir',
    vaciar: 'Buidar',
    confirmVaciar: 'Voleu buidar la plantilla?',
  },
} as const;

interface Props { locale?: Locale }

type Alumno = {
  id: string;
  nombre: string;
  asistencia: string;
  actitud: string;
  entregas: string;
  observaciones: string;
};

type RegistroAulaState = {
  fecha: string;
  sesion: string;
  alumnos: Alumno[];
};

const INITIAL: RegistroAulaState = {
  fecha: '',
  sesion: '',
  alumnos: [
    { id: 'a1', nombre: '', asistencia: '', actitud: '', entregas: '', observaciones: '' },
    { id: 'a2', nombre: '', asistencia: '', actitud: '', entregas: '', observaciones: '' },
    { id: 'a3', nombre: '', asistencia: '', actitud: '', entregas: '', observaciones: '' },
  ],
};

export default function RegistroAula({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [state, setState] = usePersistentState<RegistroAulaState>('pde:generador:registro-aula', INITIAL);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const lienzoRef = useRef<HTMLDivElement>(null);

  function setHeader(field: 'fecha' | 'sesion', value: string) {
    setState({ ...state, [field]: value });
  }

  function setAlumnoField(id: string, field: keyof Omit<Alumno, 'id'>, value: string) {
    setState({
      ...state,
      alumnos: state.alumnos.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    });
  }

  function addAlumno() {
    const newId = 'a' + Date.now();
    setState({
      ...state,
      alumnos: [
        ...state.alumnos,
        { id: newId, nombre: '', asistencia: '', actitud: '', entregas: '', observaciones: '' },
      ],
    });
  }

  function removeAlumno(id: string) {
    if (state.alumnos.length <= 1) return;
    setState({ ...state, alumnos: state.alumnos.filter((a) => a.id !== id) });
  }

  async function handleExport(formato: 'png' | 'pdf') {
    if (!lienzoRef.current) return;
    setExporting(formato);
    try {
      await exportarNodo(lienzoRef.current, 'registro-aula', formato);
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
    <div class="ra-root">
      <p class="ra-intro">
        {c.intro}
      </p>

      <div class="lienzo" ref={lienzoRef}>
        <h2 class="ra-heading">{c.heading}</h2>

        <div class="ra-header-grid">
          <div class="ra-field">
            <label class="ra-label" for="ra-fecha">{c.fechaLabel}</label>
            <input
              id="ra-fecha"
              class="ra-input"
              type="text"
              value={state.fecha}
              placeholder={c.fechaPlaceholder}
              onInput={(e) => setHeader('fecha', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="ra-field">
            <label class="ra-label" for="ra-sesion">{c.sesionLabel}</label>
            <input
              id="ra-sesion"
              class="ra-input"
              type="text"
              value={state.sesion}
              placeholder={c.sesionPlaceholder}
              onInput={(e) => setHeader('sesion', (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="ra-table-wrap">
          <table class="ra-table">
            <thead>
              <tr>
                <th class="ra-th ra-th--alumno">{c.thAlumno}</th>
                <th class="ra-th">{c.thAsistencia}</th>
                <th class="ra-th">{c.thActitud}</th>
                <th class="ra-th">{c.thEntregas}</th>
                <th class="ra-th ra-th--obs">{c.thObservaciones}</th>
                <th class="ra-th ra-th--remove no-print" aria-label={c.eliminarFilaAria} />
              </tr>
            </thead>
            <tbody>
              {state.alumnos.map((alumno) => (
                <tr key={alumno.id} class="ra-row">
                  <td class="ra-td">
                    <input
                      class="ra-cell-input"
                      type="text"
                      value={alumno.nombre}
                      placeholder={c.nombrePlaceholder}
                      onInput={(e) =>
                        setAlumnoField(alumno.id, 'nombre', (e.target as HTMLInputElement).value)
                      }
                    />
                  </td>
                  <td class="ra-td">
                    <input
                      class="ra-cell-input"
                      type="text"
                      value={alumno.asistencia}
                      placeholder={c.asistenciaPlaceholder}
                      onInput={(e) =>
                        setAlumnoField(alumno.id, 'asistencia', (e.target as HTMLInputElement).value)
                      }
                    />
                  </td>
                  <td class="ra-td">
                    <input
                      class="ra-cell-input"
                      type="text"
                      value={alumno.actitud}
                      placeholder={c.actitudPlaceholder}
                      onInput={(e) =>
                        setAlumnoField(alumno.id, 'actitud', (e.target as HTMLInputElement).value)
                      }
                    />
                  </td>
                  <td class="ra-td">
                    <input
                      class="ra-cell-input"
                      type="text"
                      value={alumno.entregas}
                      placeholder={c.entregasPlaceholder}
                      onInput={(e) =>
                        setAlumnoField(alumno.id, 'entregas', (e.target as HTMLInputElement).value)
                      }
                    />
                  </td>
                  <td class="ra-td ra-td--obs">
                    <textarea
                      class="ra-cell-textarea"
                      value={alumno.observaciones}
                      placeholder={c.observacionesPlaceholder}
                      onInput={(e) =>
                        setAlumnoField(
                          alumno.id,
                          'observaciones',
                          (e.target as HTMLTextAreaElement).value,
                        )
                      }
                    />
                  </td>
                  <td class="ra-td no-print">
                    <button
                      class="ra-remove-btn"
                      onClick={() => removeAlumno(alumno.id)}
                      disabled={state.alumnos.length <= 1}
                      aria-label={c.eliminarFilaAria}
                      title={c.eliminarAlumnoTitle}
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

      <div class="ra-actions no-print">
        <button class="ra-btn ra-btn--add" onClick={addAlumno}>
          {c.addAlumno}
        </button>
        <button
          class="ra-btn ra-btn--primary"
          onClick={() => handleExport('png')}
          disabled={exporting !== null}
        >
          {exporting === 'png' ? c.generando : c.exportarPng}
        </button>
        <button
          class="ra-btn ra-btn--primary"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
        >
          {exporting === 'pdf' ? c.generando : c.exportarPdf}
        </button>
        <button class="ra-btn" onClick={() => window.print()}>
          {c.imprimir}
        </button>
        <button class="ra-btn ra-btn--danger" onClick={handleVaciar}>
          {c.vaciar}
        </button>
      </div>

      <style>{`
        .ra-root {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .ra-intro {
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
        .ra-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink, #2A1F18);
          margin: 0 0 1.25rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--color-terra, #C44E2C);
        }
        .ra-header-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 0.75rem 1.25rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 480px) {
          .ra-header-grid { grid-template-columns: 1fr; }
        }
        .ra-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .ra-label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink-mute, #8A7868);
        }
        .ra-input {
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
        .ra-input:focus {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 1px;
        }
        .ra-table-wrap {
          overflow-x: auto;
        }
        .ra-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .ra-th {
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
        .ra-th--alumno { min-width: 140px; }
        .ra-th--obs { min-width: 180px; }
        .ra-th--remove { width: 2rem; border-left: none; }
        .ra-td {
          padding: 0.375rem 0.375rem;
          border: 1px solid var(--color-line, #E5D4BD);
          vertical-align: top;
        }
        .ra-td--obs { min-width: 180px; }
        .ra-cell-input {
          width: 100%;
          padding: 0.3rem 0.4rem;
          border: none;
          background: transparent;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
          color: var(--color-ink, #2A1F18);
          box-sizing: border-box;
        }
        .ra-cell-input:focus {
          outline: 1px solid var(--color-terra, #C44E2C);
          border-radius: 0.2rem;
        }
        .ra-cell-input::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }
        .ra-cell-textarea {
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
        .ra-cell-textarea:focus {
          outline: 1px solid var(--color-terra, #C44E2C);
          border-radius: 0.2rem;
        }
        .ra-cell-textarea::placeholder {
          color: var(--color-ink-mute, #8A7868);
          font-size: 0.8rem;
        }
        .ra-remove-btn {
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
        .ra-remove-btn:hover:not(:disabled) {
          color: var(--color-terra, #C44E2C);
          background: var(--color-terra-soft, #FBE3D6);
        }
        .ra-remove-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .ra-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-top: 1rem;
        }
        .ra-btn {
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
        .ra-btn:hover:not(:disabled) {
          background: var(--color-bg-soft, #F8E8D0);
        }
        .ra-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .ra-btn--primary {
          background: var(--color-terra, #C44E2C);
          color: #fff;
          border-color: var(--color-terra, #C44E2C);
        }
        .ra-btn--primary:hover:not(:disabled) {
          background: var(--color-terra-deep, #9C3A1C);
        }
        .ra-btn--add {
          background: var(--color-bg-soft, #F8E8D0);
          border-color: var(--color-line, #E5D4BD);
        }
        .ra-btn--danger {
          color: var(--color-ink-soft, #5C4A3D);
        }

        @media print {
          .no-print { display: none !important; }
          .lienzo {
            border: none;
            padding: 0;
            width: 100%;
          }
          .ra-cell-input,
          .ra-cell-textarea {
            resize: none;
            color: #000 !important;
            background: transparent !important;
          }
          .ra-root {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
