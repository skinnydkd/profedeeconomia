/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../lib/storage';
import './QuizPlayer.css';

export type Pregunta =
  | { tipo: 'opcion-multiple'; enunciado: string; opciones: string[]; correcta: number; explicacion?: string }
  | { tipo: 'verdadero-falso'; enunciado: string; correcta: boolean; explicacion?: string }
  | { tipo: 'numerico'; enunciado: string; respuesta: number; tolerancia?: number; unidad?: string; explicacion?: string }
  | { tipo: 'relacionar'; enunciado: string; izquierda: string[]; derecha: string[]; correctas: number[]; explicacion?: string };

/** MC/numeric → number, V/F → boolean, relacionar → number[] (chosen right index per left, -1 unset). */
export type Respuesta = number | boolean | number[] | null;

type Props = {
  preguntas: Pregunta[];
  /** Used as a localStorage namespace so two quizzes on the same site
   *  don't share state. Pass the test slug. */
  storageKey: string;
};

type Estado = {
  idx: number;
  respuestas: Respuesta[];
  confirmadas: boolean[];
  finalizado: boolean;
};

function emptyState(n: number): Estado {
  return {
    idx: 0,
    respuestas: new Array(n).fill(null),
    confirmadas: new Array(n).fill(false),
    finalizado: false,
  };
}

/** Whether the user has provided a gradeable answer for this question. */
function respondida(p: Pregunta, r: Respuesta): boolean {
  switch (p.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso':
      return r !== null;
    case 'numerico':
      return typeof r === 'number' && !Number.isNaN(r);
    case 'relacionar':
      return Array.isArray(r) && r.length === p.izquierda.length && r.every((x) => x >= 0);
  }
}

/** Grades the answer for a question of any type. */
function esCorrecta(p: Pregunta, r: Respuesta): boolean {
  switch (p.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso':
      return r === p.correcta;
    case 'numerico':
      return typeof r === 'number' && Math.abs(r - p.respuesta) <= (p.tolerancia ?? 0);
    case 'relacionar':
      return Array.isArray(r) && p.correctas.every((c, i) => r[i] === c);
  }
}

const numComma = (n: number) => String(n).replace('.', ',');

/** Human-readable rendering of the user's answer (for the review screen). */
function formatResp(p: Pregunta, r: Respuesta): string {
  if (r === null || r === undefined) return '— sin responder —';
  switch (p.tipo) {
    case 'opcion-multiple':
      return typeof r === 'number' ? p.opciones[r] : '—';
    case 'verdadero-falso':
      return r ? 'Verdadero' : 'Falso';
    case 'numerico':
      return typeof r === 'number' ? numComma(r) + (p.unidad ? ' ' + p.unidad : '') : '—';
    case 'relacionar':
      return Array.isArray(r)
        ? r.map((d, i) => `${i + 1}→${d >= 0 ? String.fromCharCode(97 + d) : '·'}`).join('  ')
        : '—';
  }
}

/** Human-readable rendering of the correct answer (for the review screen). */
function formatCorr(p: Pregunta): string {
  switch (p.tipo) {
    case 'opcion-multiple':
      return p.opciones[p.correcta];
    case 'verdadero-falso':
      return p.correcta ? 'Verdadero' : 'Falso';
    case 'numerico':
      return numComma(p.respuesta) + (p.unidad ? ' ' + p.unidad : '');
    case 'relacionar':
      return p.correctas.map((d, i) => `${i + 1}→${String.fromCharCode(97 + d)}`).join('  ');
  }
}

/** localStorage key holding the best `nota10` ever achieved for this quiz. */
function bestKey(storageKey: string): string {
  return `quiz:${storageKey}:best`;
}

export default function QuizPlayer({ preguntas, storageKey }: Props) {
  const total = preguntas.length;
  const [estado, setEstado] = useState<Estado>(() => emptyState(total));

  const [bestNota, setBestNota] = useState<number | null>(null);
  useEffect(() => {
    const stored = loadJSON<number | null>(bestKey(storageKey), null);
    if (typeof stored === 'number') setBestNota(stored);
  }, [storageKey]);

  const aciertos = useMemo(
    () =>
      estado.respuestas.reduce<number>(
        (acc, r, i) => acc + (esCorrecta(preguntas[i], r) ? 1 : 0),
        0
      ),
    [estado.respuestas, preguntas]
  );

  const nota10 = total === 0 ? 0 : Math.round((aciertos / total) * 1000) / 100;
  const pregunta = preguntas[estado.idx];
  const respuestaActual = estado.respuestas[estado.idx];
  const confirmada = estado.confirmadas[estado.idx];

  function setRespuesta(value: Respuesta) {
    if (confirmada) return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      respuestas[s.idx] = value;
      return { ...s, respuestas };
    });
  }

  function elegirRel(li: number, di: number) {
    if (confirmada) return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      const p = preguntas[s.idx];
      const len = p.tipo === 'relacionar' ? p.izquierda.length : 0;
      const base = Array.isArray(respuestas[s.idx])
        ? [...(respuestas[s.idx] as number[])]
        : new Array(len).fill(-1);
      base[li] = di;
      respuestas[s.idx] = base;
      return { ...s, respuestas };
    });
  }

  function confirmar() {
    if (!respondida(pregunta, respuestaActual)) return;
    setEstado((s) => {
      const confirmadas = [...s.confirmadas];
      confirmadas[s.idx] = true;
      return { ...s, confirmadas };
    });
  }

  function siguiente() {
    setEstado((s) => {
      if (s.idx + 1 >= total) {
        setBestNota((prev) => {
          if (prev !== null && prev >= nota10) return prev;
          saveJSON(bestKey(storageKey), nota10);
          return nota10;
        });
        return { ...s, finalizado: true };
      }
      return { ...s, idx: s.idx + 1 };
    });
  }

  function anterior() {
    setEstado((s) => ({ ...s, idx: Math.max(0, s.idx - 1) }));
  }
  function reiniciar() {
    setEstado(emptyState(total));
  }
  function borrarProgreso() {
    removeKey(bestKey(storageKey));
    setBestNota(null);
  }
  function formatNota(n: number): string {
    return n.toFixed(2).replace('.', ',');
  }

  // ─── Final summary screen ─────────────────────────────────
  if (estado.finalizado) {
    const aprobado = aciertos / total >= 0.5;
    return (
      <div class="qp">
        <div class="qp__final">
          <div class="qp__eyebrow">Resultado</div>
          <h2 class="qp__nota">
            <span class="qp__nota-num">{formatNota(nota10)}</span>
            <span class="qp__nota-sobre">/ 10</span>
          </h2>
          {bestNota !== null && <p class="qp__best">Tu mejor nota: {formatNota(bestNota)} / 10</p>}
          <p class="qp__detail">
            {aciertos} {aciertos === 1 ? 'acierto' : 'aciertos'} de {total}{' '}
            {total === 1 ? 'pregunta' : 'preguntas'}
            {' · '}
            <strong class={aprobado ? 'ok' : 'fail'}>{aprobado ? 'Apto' : 'Repasa la unidad'}</strong>
          </p>

          <ol class="qp__review">
            {preguntas.map((p, i) => {
              const r = estado.respuestas[i];
              const ok = esCorrecta(p, r);
              return (
                <li class={ok ? 'ok' : 'fail'}>
                  <span class="qp__review-num">{String(i + 1).padStart(2, '0')}</span>
                  <span class="qp__review-text">
                    <strong>{p.enunciado}</strong>
                    <br />
                    Tu respuesta: <em>{formatResp(p, r)}</em>
                    {!ok && (
                      <>
                        <br />
                        Correcta: <em>{formatCorr(p)}</em>
                      </>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <div class="qp__actions">
            <button class="qp__btn qp__btn--primary" type="button" onClick={reiniciar}>
              Volver a intentarlo
            </button>
            {bestNota !== null && (
              <button class="qp__btn qp__btn--ghost" type="button" onClick={borrarProgreso}>
                Borrar mi progreso
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Question screen ─────────────────────────────────
  const acerto = confirmada && esCorrecta(pregunta, respuestaActual);

  return (
    <div class="qp">
      <div class="qp__header">
        <span class="qp__eyebrow">Pregunta {estado.idx + 1} de {total}</span>
        <div class="qp__progress">
          {preguntas.map((_, i) => {
            const done = estado.confirmadas[i];
            const ok = done && esCorrecta(preguntas[i], estado.respuestas[i]);
            return (
              <span
                key={i}
                class={[
                  'qp__dot',
                  i === estado.idx ? 'is-current' : '',
                  done && ok ? 'is-ok' : '',
                  done && !ok ? 'is-fail' : '',
                ].join(' ').trim()}
              />
            );
          })}
        </div>
      </div>

      {estado.idx === 0 && !confirmada && bestNota !== null && (
        <p class="qp__best">Tu mejor nota: {formatNota(bestNota)} / 10</p>
      )}

      <h3 class="qp__enunciado">{pregunta.enunciado}</h3>

      {/* Opción múltiple */}
      {pregunta.tipo === 'opcion-multiple' && (
        <ol class="qp__opciones">
          {pregunta.opciones.map((opt, i) => {
            const sel = respuestaActual === i;
            const corr = i === pregunta.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <li>
                <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(i)} disabled={confirmada} aria-pressed={sel}>
                  <span class="qp__opt-letra">{String.fromCharCode(65 + i)}</span>
                  <span class="qp__opt-texto">{opt}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {/* Verdadero / Falso */}
      {pregunta.tipo === 'verdadero-falso' && (
        <div class="qp__vf">
          {[true, false].map((v) => {
            const sel = respuestaActual === v;
            const corr = v === pregunta.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(v)} disabled={confirmada} aria-pressed={sel}>
                <span class="qp__opt-texto">{v ? 'Verdadero' : 'Falso'}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Numérico */}
      {pregunta.tipo === 'numerico' && (
        <div class={['qp__num', confirmada ? (acerto ? 'is-correct' : 'is-incorrect') : ''].join(' ').trim()}>
          <label class="qp__num-label">
            <span>Tu respuesta</span>
            <span class="qp__num-field">
              <input
                type="text"
                inputmode="decimal"
                class="qp__num-input"
                disabled={confirmada}
                value={typeof respuestaActual === 'number' && !Number.isNaN(respuestaActual) ? numComma(respuestaActual) : ''}
                onInput={(e) => {
                  const raw = (e.currentTarget.value || '').replace(',', '.').trim();
                  setRespuesta(raw === '' ? null : Number(raw));
                }}
              />
              {pregunta.unidad && <span class="qp__num-unidad">{pregunta.unidad}</span>}
            </span>
          </label>
        </div>
      )}

      {/* Relacionar */}
      {pregunta.tipo === 'relacionar' && (
        <table class="qp__rel">
          <tbody>
            {pregunta.izquierda.map((izq, li) => {
              const arr = Array.isArray(respuestaActual) ? respuestaActual : [];
              const chosen = arr[li] ?? -1;
              const okRow = confirmada && chosen === pregunta.correctas[li];
              return (
                <tr class={confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''}>
                  <td class="qp__rel-num">{li + 1}</td>
                  <td class="qp__rel-izq">{izq}</td>
                  <td class="qp__rel-der">
                    <select disabled={confirmada} value={String(chosen)} onChange={(e) => elegirRel(li, Number(e.currentTarget.value))}>
                      <option value="-1">— elige —</option>
                      {pregunta.derecha.map((der, di) => (
                        <option value={String(di)}>{String.fromCharCode(97 + di)}) {der}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {confirmada && (
        <div class={['qp__feedback', acerto ? 'is-ok' : 'is-fail'].join(' ')}>
          <strong>{acerto ? '¡Correcto!' : 'Incorrecto.'}</strong>
          {!acerto && pregunta.tipo !== 'opcion-multiple' && (
            <p class="qp__feedback-corr">Respuesta correcta: <em>{formatCorr(pregunta)}</em></p>
          )}
          {pregunta.explicacion && <p>{pregunta.explicacion}</p>}
        </div>
      )}

      <div class="qp__actions">
        <button class="qp__btn qp__btn--ghost" type="button" onClick={anterior} disabled={estado.idx === 0}>
          ← Anterior
        </button>
        {!confirmada ? (
          <button class="qp__btn qp__btn--primary" type="button" onClick={confirmar} disabled={!respondida(pregunta, respuestaActual)}>
            Confirmar respuesta
          </button>
        ) : (
          <button class="qp__btn qp__btn--primary" type="button" onClick={siguiente}>
            {estado.idx + 1 === total ? 'Ver resultado' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
