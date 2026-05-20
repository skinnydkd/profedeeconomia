/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../lib/storage';

export type Pregunta = {
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion?: string;
};

type Props = {
  preguntas: Pregunta[];
  /** Used as a localStorage namespace so two quizzes on the same site
   *  don't share state. Pass the test slug. */
  storageKey: string;
};

type Estado = {
  /** Index of the current pregunta. */
  idx: number;
  /** Per-question chosen option index (or null). */
  respuestas: (number | null)[];
  /** Per-question whether the user has confirmed and seen the result. */
  confirmadas: boolean[];
  /** True once the user has finished and seen the summary screen. */
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

/** localStorage key holding the best `nota10` ever achieved for this quiz. */
function bestKey(storageKey: string): string {
  return `quiz:${storageKey}:best`;
}

export default function QuizPlayer({ preguntas, storageKey }: Props) {
  const total = preguntas.length;
  const [estado, setEstado] = useState<Estado>(() => emptyState(total));

  // Best nota persisted across attempts. Loaded after mount (never during the
  // server render) to avoid an SSR/client hydration mismatch.
  const [bestNota, setBestNota] = useState<number | null>(null);

  useEffect(() => {
    const stored = loadJSON<number | null>(bestKey(storageKey), null);
    if (typeof stored === 'number') setBestNota(stored);
  }, [storageKey]);

  const aciertos = useMemo(
    () =>
      estado.respuestas.reduce<number>((acc, r, i) => {
        return acc + (r === preguntas[i].correcta ? 1 : 0);
      }, 0),
    [estado.respuestas, preguntas]
  );

  const nota10 = total === 0 ? 0 : Math.round((aciertos / total) * 1000) / 100;
  const pregunta = preguntas[estado.idx];
  const respuestaActual = estado.respuestas[estado.idx];
  const confirmada = estado.confirmadas[estado.idx];

  function elegir(i: number) {
    if (confirmada) return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      respuestas[s.idx] = i;
      return { ...s, respuestas };
    });
  }

  function confirmar() {
    if (respuestaActual === null) return;
    setEstado((s) => {
      const confirmadas = [...s.confirmadas];
      confirmadas[s.idx] = true;
      return { ...s, confirmadas };
    });
  }

  function siguiente() {
    setEstado((s) => {
      if (s.idx + 1 >= total) {
        // Finishing the attempt: persist the best nota if this one is higher.
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

  /** Formats a nota10 (0–10) with comma decimals, e.g. "8,50". */
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
          {bestNota !== null && (
            <p class="qp__best">Tu mejor nota: {formatNota(bestNota)} / 10</p>
          )}
          <p class="qp__detail">
            {aciertos} {aciertos === 1 ? 'acierto' : 'aciertos'} de {total}{' '}
            {total === 1 ? 'pregunta' : 'preguntas'}
            {' · '}
            <strong class={aprobado ? 'ok' : 'fail'}>
              {aprobado ? 'Apto' : 'Repasa la unidad'}
            </strong>
          </p>

          <ol class="qp__review">
            {preguntas.map((p, i) => {
              const r = estado.respuestas[i];
              const ok = r === p.correcta;
              return (
                <li class={ok ? 'ok' : 'fail'}>
                  <span class="qp__review-num">{String(i + 1).padStart(2, '0')}</span>
                  <span class="qp__review-text">
                    <strong>{p.enunciado}</strong>
                    <br />
                    Tu respuesta: <em>{r === null ? '— sin responder —' : p.opciones[r]}</em>
                    {!ok && (
                      <>
                        <br />
                        Correcta: <em>{p.opciones[p.correcta]}</em>
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
  const acerto = confirmada && respuestaActual === pregunta.correcta;
  const fallo = confirmada && respuestaActual !== pregunta.correcta;

  return (
    <div class="qp">
      <div class="qp__header">
        <span class="qp__eyebrow">Pregunta {estado.idx + 1} de {total}</span>
        <div class="qp__progress">
          {preguntas.map((_, i) => (
            <span
              key={i}
              class={[
                'qp__dot',
                i === estado.idx ? 'is-current' : '',
                estado.confirmadas[i] && estado.respuestas[i] === preguntas[i].correcta ? 'is-ok' : '',
                estado.confirmadas[i] && estado.respuestas[i] !== preguntas[i].correcta ? 'is-fail' : '',
              ].join(' ').trim()}
            />
          ))}
        </div>
      </div>

      {estado.idx === 0 && !confirmada && bestNota !== null && (
        <p class="qp__best">Tu mejor nota: {formatNota(bestNota)} / 10</p>
      )}

      <h3 class="qp__enunciado">{pregunta.enunciado}</h3>

      <ol class="qp__opciones">
        {pregunta.opciones.map((opt, i) => {
          const seleccionada = respuestaActual === i;
          const esCorrecta = i === pregunta.correcta;
          let stateClass = '';
          if (confirmada) {
            if (esCorrecta) stateClass = 'is-correct';
            else if (seleccionada) stateClass = 'is-incorrect';
          } else if (seleccionada) {
            stateClass = 'is-selected';
          }
          return (
            <li>
              <button
                type="button"
                class={['qp__opt', stateClass].join(' ').trim()}
                onClick={() => elegir(i)}
                disabled={confirmada}
                aria-pressed={seleccionada}
              >
                <span class="qp__opt-letra">{String.fromCharCode(65 + i)}</span>
                <span class="qp__opt-texto">{opt}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {confirmada && (
        <div class={['qp__feedback', acerto ? 'is-ok' : 'is-fail'].join(' ')}>
          <strong>{acerto ? '¡Correcto!' : 'Incorrecto.'}</strong>
          {pregunta.explicacion && <p>{pregunta.explicacion}</p>}
        </div>
      )}

      <div class="qp__actions">
        <button
          class="qp__btn qp__btn--ghost"
          type="button"
          onClick={anterior}
          disabled={estado.idx === 0}
        >
          ← Anterior
        </button>
        {!confirmada ? (
          <button
            class="qp__btn qp__btn--primary"
            type="button"
            onClick={confirmar}
            disabled={respuestaActual === null}
          >
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
