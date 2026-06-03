/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { mediaPonderada, rubricaANota, sumaPesos } from '@/lib/calc/calificaciones';
import { formatNumber } from '@/lib/calc/format';

/**
 * Grading calculator island — two independent blocks:
 *   1. Weighted average across assessment instruments.
 *   2. Rubric levels → numeric mark converter.
 */

interface Row {
  nombre: string;
  peso: number;
  nota: number;
}

const DEFAULT_ROWS: Row[] = [
  { nombre: 'Examen', peso: 50, nota: 6.5 },
  { nombre: 'Trabajo', peso: 30, nota: 8 },
  { nombre: 'Actitud', peso: 20, nota: 9 },
];

export default function CalificacionesCalc() {
  // ── Block 1: weighted average ──────────────────────────────────────────────
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  const totalPesos = useMemo(() => sumaPesos(rows), [rows]);
  const mediaFinal = useMemo(() => mediaPonderada(rows), [rows]);

  function updateRow(i: number, field: keyof Row, raw: string) {
    setRows((prev) => {
      const next = [...prev];
      if (field === 'nombre') {
        next[i] = { ...next[i], nombre: raw };
      } else {
        const v = parseFloat(raw);
        next[i] = { ...next[i], [field]: Number.isFinite(v) ? v : 0 };
      }
      return next;
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { nombre: 'Nueva prueba', peso: 0, nota: 0 }]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  // ── Block 2: rubric → mark ─────────────────────────────────────────────────
  const [obtenidos, setObtenidos] = useState<number>(12);
  const [maximos, setMaximos] = useState<number>(16);
  const [escala, setEscala] = useState<number>(10);

  const notaRubrica = useMemo(
    () => rubricaANota(obtenidos, maximos, escala),
    [obtenidos, maximos, escala],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  function fmtNota(n: number | null): string {
    if (n === null) return '—';
    return formatNumber(n, 2);
  }

  return (
    <div class="cg-calc">

      {/* ── BLOCK 1: Media ponderada ─────────────────────────────────────── */}
      <section class="cg-calc__block">
        <h3 class="cg-calc__block-title">Media ponderada</h3>

        <div class="cg-calc__table-wrap">
          <table class="cg-calc__table">
            <thead>
              <tr>
                <th class="cg-calc__th cg-calc__th--nombre">Instrumento</th>
                <th class="cg-calc__th">Peso (%)</th>
                <th class="cg-calc__th">Nota (0–10)</th>
                <th class="cg-calc__th cg-calc__th--action" aria-label="Eliminar fila" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} class="cg-calc__row">
                  <td class="cg-calc__td">
                    <input
                      class="cg-calc__input cg-calc__input--text"
                      type="text"
                      value={row.nombre}
                      onInput={(e) =>
                        updateRow(i, 'nombre', (e.target as HTMLInputElement).value)
                      }
                      aria-label={`Nombre del instrumento ${i + 1}`}
                    />
                  </td>
                  <td class="cg-calc__td">
                    <input
                      class="cg-calc__input"
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={row.peso}
                      onInput={(e) =>
                        updateRow(i, 'peso', (e.target as HTMLInputElement).value)
                      }
                      aria-label={`Peso de ${row.nombre}`}
                    />
                  </td>
                  <td class="cg-calc__td">
                    <input
                      class="cg-calc__input"
                      type="number"
                      min={0}
                      max={escala}
                      step={0.5}
                      value={row.nota}
                      onInput={(e) =>
                        updateRow(i, 'nota', (e.target as HTMLInputElement).value)
                      }
                      aria-label={`Nota de ${row.nombre}`}
                    />
                  </td>
                  <td class="cg-calc__td cg-calc__td--action">
                    <button
                      class="cg-calc__btn-remove"
                      onClick={() => removeRow(i)}
                      title="Eliminar fila"
                      aria-label={`Eliminar ${row.nombre}`}
                      disabled={rows.length <= 1}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button class="cg-calc__btn-add" onClick={addRow}>
          + Añadir instrumento
        </button>

        {totalPesos !== 100 && (
          <p class="cg-calc__notice">
            Los pesos suman {totalPesos} %, no 100 %. La media se calcula proporcionalmente.
          </p>
        )}

        <div class="cg-calc__result-row">
          <div class="cg-calc__metric cg-calc__metric--primary">
            <span class="cg-calc__metric-label">Nota final</span>
            <span class="cg-calc__metric-value">{fmtNota(mediaFinal)}</span>
            <span class="cg-calc__metric-unit">/ 10</span>
          </div>
          <div class="cg-calc__metric">
            <span class="cg-calc__metric-label">Suma de pesos</span>
            <span class="cg-calc__metric-value">{totalPesos}</span>
            <span class="cg-calc__metric-unit">%</span>
          </div>
        </div>
      </section>

      {/* ── BLOCK 2: Rúbrica → nota ──────────────────────────────────────── */}
      <section class="cg-calc__block">
        <h3 class="cg-calc__block-title">Rúbrica → nota</h3>
        <p class="cg-calc__block-desc">
          Convierte los puntos obtenidos en una rúbrica en una nota sobre la escala deseada.
        </p>

        <div class="cg-calc__form">
          <label class="cg-calc__field">
            <span class="cg-calc__label">Puntos obtenidos</span>
            <div class="cg-calc__input-wrap">
              <input
                class="cg-calc__input"
                type="number"
                min={0}
                step={1}
                value={obtenidos}
                onInput={(e) =>
                  setObtenidos(parseFloat((e.target as HTMLInputElement).value) || 0)
                }
              />
            </div>
          </label>

          <label class="cg-calc__field">
            <span class="cg-calc__label">Puntos máximos</span>
            <div class="cg-calc__input-wrap">
              <input
                class="cg-calc__input"
                type="number"
                min={1}
                step={1}
                value={maximos}
                onInput={(e) =>
                  setMaximos(parseFloat((e.target as HTMLInputElement).value) || 0)
                }
              />
            </div>
          </label>

          <label class="cg-calc__field">
            <span class="cg-calc__label">Escala de calificación</span>
            <div class="cg-calc__input-wrap">
              <input
                class="cg-calc__input"
                type="number"
                min={1}
                step={1}
                value={escala}
                onInput={(e) =>
                  setEscala(parseFloat((e.target as HTMLInputElement).value) || 10)
                }
              />
            </div>
          </label>
        </div>

        <div class="cg-calc__result-row">
          <div class="cg-calc__metric cg-calc__metric--primary">
            <span class="cg-calc__metric-label">Nota resultante</span>
            <span class="cg-calc__metric-value">{fmtNota(notaRubrica)}</span>
            <span class="cg-calc__metric-unit">/ {escala}</span>
          </div>
          {notaRubrica !== null && (
            <div class="cg-calc__metric">
              <span class="cg-calc__metric-label">Porcentaje</span>
              <span class="cg-calc__metric-value">
                {formatNumber((obtenidos / maximos) * 100, 1)}
              </span>
              <span class="cg-calc__metric-unit">%</span>
            </div>
          )}
        </div>

        {maximos <= 0 && (
          <p class="cg-calc__notice">
            Los puntos máximos deben ser mayores que 0.
          </p>
        )}
      </section>

      <style>{`
        .cg-calc {
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .cg-calc__block {
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cg-calc__block-title {
          font-family: var(--font-heading, serif);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
          margin: 0;
        }

        .cg-calc__block-desc {
          font-size: 0.9rem;
          color: var(--color-ink-mute, #8A7868);
          margin: 0;
        }

        /* ── Table ────────────────────────────────────────────────── */
        .cg-calc__table-wrap {
          overflow-x: auto;
        }

        .cg-calc__table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .cg-calc__th {
          text-align: left;
          padding: 0.4rem 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-ink-soft, #5C4A3D);
          border-bottom: 2px solid var(--color-line, #E5D4BD);
          white-space: nowrap;
        }

        .cg-calc__th--nombre {
          width: 45%;
        }

        .cg-calc__th--action {
          width: 2.5rem;
        }

        .cg-calc__td {
          padding: 0.35rem 0.5rem;
          border-bottom: 1px solid var(--color-line-soft, #EFE2CB);
          vertical-align: middle;
        }

        .cg-calc__td--action {
          text-align: center;
        }

        /* ── Inputs ───────────────────────────────────────────────── */
        .cg-calc__input {
          width: 100%;
          padding: 0.35rem 0.5rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.9rem;
          color: var(--color-ink, #2A1F18);
          background: var(--color-bg, #FBF6EC);
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .cg-calc__input:focus {
          outline: none;
          border-color: var(--color-terra, #C44E2C);
        }

        .cg-calc__input--text {
          min-width: 8rem;
        }

        /* ── Add / Remove buttons ─────────────────────────────────── */
        .cg-calc__btn-remove {
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

        .cg-calc__btn-remove:hover:not(:disabled) {
          color: var(--color-terra, #C44E2C);
          background: var(--color-terra-soft, #FBE3D6);
        }

        .cg-calc__btn-remove:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .cg-calc__btn-add {
          align-self: flex-start;
          background: none;
          border: 1px dashed var(--color-line, #E5D4BD);
          border-radius: 0.25rem;
          color: var(--color-ink-soft, #5C4A3D);
          cursor: pointer;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.85rem;
          padding: 0.35rem 0.75rem;
          transition: border-color 0.15s, color 0.15s;
        }

        .cg-calc__btn-add:hover {
          border-color: var(--color-terra, #C44E2C);
          color: var(--color-terra, #C44E2C);
        }

        /* ── Notice ───────────────────────────────────────────────── */
        .cg-calc__notice {
          font-size: 0.85rem;
          color: var(--color-ink-soft, #5C4A3D);
          background: var(--color-cream, #F5EDD9);
          border-left: 3px solid var(--color-mostassa, #D4A24C);
          padding: 0.5rem 0.75rem;
          border-radius: 0 0.25rem 0.25rem 0;
          margin: 0;
        }

        /* ── Results ──────────────────────────────────────────────── */
        .cg-calc__result-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          align-items: flex-end;
          border-top: 1px solid var(--color-line, #E5D4BD);
          padding-top: 1rem;
        }

        .cg-calc__metric {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .cg-calc__metric--primary .cg-calc__metric-value {
          font-size: 2.25rem;
          color: var(--color-terra, #C44E2C);
          font-family: var(--font-heading, serif);
          font-weight: 700;
          line-height: 1;
        }

        .cg-calc__metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-ink-mute, #8A7868);
        }

        .cg-calc__metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
          line-height: 1;
        }

        .cg-calc__metric-unit {
          font-size: 0.8rem;
          color: var(--color-ink-mute, #8A7868);
        }

        /* ── Inline form (Block 2) ────────────────────────────────── */
        .cg-calc__form {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cg-calc__field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          min-width: 8rem;
        }

        .cg-calc__label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-ink-soft, #5C4A3D);
        }

        .cg-calc__input-wrap {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
      `}</style>
    </div>
  );
}
