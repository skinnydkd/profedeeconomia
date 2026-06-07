/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../../lib/storage';
import { nivelForScore, type NivelInfo } from '../../lib/retos';
import type { Item, RetoData } from './parse-reto';
import '../QuizPlayer.css';
import './RetoPlayer.css';

type Props = {
  reto: RetoData;
  niveles: NivelInfo[];          // exactly 3 (real descriptors or generic fallback)
  competenciaTexto: string;
  competenciaCodigo: string;
  storageKey: string;            // localStorage namespace, pass the reto slug
};

type Respuesta = number | boolean | number[] | string[] | string | null;

type Entrada = {
  item: Item;
  pasoTitulo: string;
  escenario?: string;
  primeroDelPaso: boolean;
};

function aplanar(reto: RetoData): Entrada[] {
  const out: Entrada[] = [];
  reto.pasos.forEach((paso) => {
    paso.items.forEach((item, itemIdx) => {
      out.push({ item, pasoTitulo: paso.titulo, escenario: paso.escenario, primeroDelPaso: itemIdx === 0 });
    });
  });
  return out;
}

const esAuto = (it: Item) => it.tipo !== 'abierta';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function respondida(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r !== null;
    case 'numerico': return typeof r === 'number' && !Number.isNaN(r);
    case 'relacionar': return Array.isArray(r) && (r as number[]).length === it.izquierda.length && (r as number[]).every((x) => x >= 0);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length;
    case 'abierta': return typeof r === 'string' && r.trim().length > 0;
  }
}

function esCorrecta(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r === it.correcta;
    case 'numerico': return typeof r === 'number' && Math.abs(r - it.respuesta) <= (it.tolerancia ?? 0);
    case 'relacionar': return Array.isArray(r) && it.correctas.every((c, i) => (r as number[])[i] === c);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length && (r as string[]).every((v, i) => v === it.elementos[i]);
    case 'abierta': return false; // not auto-scored
  }
}

const numComma = (n: number) => String(n).replace('.', ',');

type Estado = { idx: number; respuestas: Respuesta[]; confirmadas: boolean[]; finalizado: boolean };

function emptyState(entradas: Entrada[]): Estado {
  return {
    idx: 0,
    respuestas: entradas.map((e) => (e.item.tipo === 'ordenar' ? shuffle(e.item.elementos) : null)),
    confirmadas: entradas.map(() => false),
    finalizado: false,
  };
}

function bestKey(storageKey: string): string {
  return `reto:${storageKey}:best`;
}

export default function RetoPlayer({ reto, niveles, competenciaTexto, competenciaCodigo, storageKey }: Props) {
  const entradas = useMemo(() => aplanar(reto), [reto]);
  const totalAuto = useMemo(() => entradas.filter((e) => esAuto(e.item)).length, [entradas]);
  const [estado, setEstado] = useState<Estado>(() => emptyState(entradas));

  const [bestNivel, setBestNivel] = useState<number | null>(null);
  useEffect(() => {
    const stored = loadJSON<number | null>(bestKey(storageKey), null);
    if (typeof stored === 'number') setBestNivel(stored);
  }, [storageKey]);

  const aciertos = useMemo(
    () => entradas.reduce((acc, e, i) => acc + (esAuto(e.item) && esCorrecta(e.item, estado.respuestas[i]) ? 1 : 0), 0),
    [entradas, estado.respuestas],
  );
  const nivelIdx = nivelForScore(aciertos, totalAuto);

  const entrada = entradas[estado.idx];
  const item = entrada.item;
  const r = estado.respuestas[estado.idx];
  const confirmada = estado.confirmadas[estado.idx];
  const total = entradas.length;

  function setRespuesta(value: Respuesta) {
    if (confirmada) return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      respuestas[s.idx] = value;
      return { ...s, respuestas };
    });
  }

  function elegirRel(li: number, di: number) {
    if (confirmada || item.tipo !== 'relacionar') return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      const base = Array.isArray(respuestas[s.idx]) ? [...(respuestas[s.idx] as number[])] : new Array(item.izquierda.length).fill(-1);
      base[li] = di;
      respuestas[s.idx] = base;
      return { ...s, respuestas };
    });
  }

  function mover(pos: number, dir: -1 | 1) {
    if (confirmada || item.tipo !== 'ordenar') return;
    setEstado((s) => {
      const respuestas = [...s.respuestas];
      const arr = [...(respuestas[s.idx] as string[])];
      const target = pos + dir;
      if (target < 0 || target >= arr.length) return s;
      [arr[pos], arr[target]] = [arr[target], arr[pos]];
      respuestas[s.idx] = arr;
      return { ...s, respuestas };
    });
  }

  function confirmar() {
    if (!respondida(item, r)) return;
    setEstado((s) => {
      const confirmadas = [...s.confirmadas];
      confirmadas[s.idx] = true;
      return { ...s, confirmadas };
    });
  }

  function siguiente() {
    setEstado((s) => {
      if (s.idx + 1 >= total) {
        setBestNivel((prev) => {
          if (prev !== null && prev >= nivelIdx) return prev;
          saveJSON(bestKey(storageKey), nivelIdx);
          return nivelIdx;
        });
        return { ...s, finalizado: true };
      }
      return { ...s, idx: s.idx + 1 };
    });
  }

  function anterior() { setEstado((s) => ({ ...s, idx: Math.max(0, s.idx - 1) })); }
  function reiniciar() { setEstado(emptyState(entradas)); }
  function borrarProgreso() { removeKey(bestKey(storageKey)); setBestNivel(null); }

  // ─── Final screen: achievement level ─────────────────────
  if (estado.finalizado) {
    const nivel = niveles[nivelIdx] ?? { nivel: ['En desarrollo', 'Adecuado', 'Avanzado'][nivelIdx], descriptor: '' };
    return (
      <div class="qp rp">
        <div class="qp__final">
          <div class="qp__eyebrow">Resultado · {competenciaCodigo}</div>
          <div class={`rp__nivel rp__nivel--${nivelIdx}`}>
            <span class="rp__nivel-label">Nivel de logro</span>
            <strong class="rp__nivel-name">{nivel.nivel}</strong>
          </div>
          <p class="qp__detail">{aciertos} de {totalAuto} {totalAuto === 1 ? 'ítem evaluable' : 'ítems evaluables'} correctos</p>
          {nivel.descriptor && <p class="rp__nivel-desc">{nivel.descriptor}</p>}
          <p class="rp__comp"><strong>{competenciaCodigo}.</strong> {competenciaTexto}</p>
          {bestNivel !== null && (
            <p class="qp__best">Tu mejor nivel: {(niveles[bestNivel]?.nivel) ?? ['En desarrollo', 'Adecuado', 'Avanzado'][bestNivel]}</p>
          )}
          <div class="qp__actions">
            <button class="qp__btn qp__btn--primary" type="button" onClick={reiniciar}>Volver a intentarlo</button>
            {bestNivel !== null && (
              <button class="qp__btn qp__btn--ghost" type="button" onClick={borrarProgreso}>Borrar mi progreso</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Item screen ─────────────────────────────────────────
  const acerto = confirmada && esCorrecta(item, r);
  const ordArr = item.tipo === 'ordenar' && Array.isArray(r) ? (r as string[]) : [];

  return (
    <div class="qp rp">
      <div class="qp__header">
        <span class="qp__eyebrow">Paso {estado.idx + 1} de {total}</span>
        <div class="qp__progress">
          {entradas.map((e, i) => {
            const done = estado.confirmadas[i];
            const auto = esAuto(e.item);
            const ok = done && auto && esCorrecta(e.item, estado.respuestas[i]);
            const fail = done && auto && !ok;
            return (
              <span key={i} class={['qp__dot', i === estado.idx ? 'is-current' : '', ok ? 'is-ok' : '', fail ? 'is-fail' : '', done && !auto ? 'is-ok' : ''].join(' ').trim()} />
            );
          })}
        </div>
      </div>

      {entrada.primeroDelPaso && (
        <div class="rp__paso">
          <h2 class="rp__paso-titulo">{entrada.pasoTitulo}</h2>
          {entrada.escenario && <div class="rp__escenario" dangerouslySetInnerHTML={{ __html: entrada.escenario }} />}
        </div>
      )}

      <h3 class="qp__enunciado">{item.enunciado}</h3>

      {item.tipo === 'opcion-multiple' && (
        <ol class="qp__opciones">
          {item.opciones.map((opt, i) => {
            const sel = r === i;
            const corr = i === item.correcta;
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

      {item.tipo === 'verdadero-falso' && (
        <div class="qp__vf">
          {[true, false].map((v) => {
            const sel = r === v;
            const corr = v === item.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(v)} disabled={confirmada} aria-pressed={sel}>
                <span class="qp__opt-texto">{v ? 'Verdadero' : 'Falso'}</span>
              </button>
            );
          })}
        </div>
      )}

      {item.tipo === 'numerico' && (
        <div class={['qp__num', confirmada ? (acerto ? 'is-correct' : 'is-incorrect') : ''].join(' ').trim()}>
          <label class="qp__num-label">
            <span>Tu respuesta</span>
            <span class="qp__num-field">
              <input type="text" inputMode="decimal" class="qp__num-input" disabled={confirmada}
                value={typeof r === 'number' && !Number.isNaN(r) ? numComma(r) : ''}
                onInput={(e) => { const raw = (e.currentTarget.value || '').replace(',', '.').trim(); setRespuesta(raw === '' ? null : Number(raw)); }} />
              {item.unidad && <span class="qp__num-unidad">{item.unidad}</span>}
            </span>
          </label>
        </div>
      )}

      {item.tipo === 'relacionar' && (
        <table class="qp__rel">
          <tbody>
            {item.izquierda.map((izq, li) => {
              const arr = Array.isArray(r) ? (r as number[]) : [];
              const chosen = arr[li] ?? -1;
              const okRow = confirmada && chosen === item.correctas[li];
              return (
                <tr class={confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''}>
                  <td class="qp__rel-num">{li + 1}</td>
                  <td class="qp__rel-izq">{izq}</td>
                  <td class="qp__rel-der">
                    <select disabled={confirmada} value={String(chosen)} onChange={(e) => elegirRel(li, Number(e.currentTarget.value))}>
                      <option value="-1">— elige —</option>
                      {item.derecha.map((der, di) => (<option value={String(di)}>{String.fromCharCode(97 + di)}) {der}</option>))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {item.tipo === 'ordenar' && (
        <ul class="rp__ord">
          {ordArr.map((el, pos) => {
            const okRow = confirmada && el === item.elementos[pos];
            return (
              <li class={['rp__ord-item', confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''].join(' ').trim()}>
                <span class="rp__ord-pos">{pos + 1}</span>
                <span class="rp__ord-text">{el}</span>
                {!confirmada && (
                  <span class="rp__ord-btns">
                    <button type="button" onClick={() => mover(pos, -1)} disabled={pos === 0} aria-label="Subir">↑</button>
                    <button type="button" onClick={() => mover(pos, 1)} disabled={pos === ordArr.length - 1} aria-label="Bajar">↓</button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {item.tipo === 'abierta' && (
        <div class="rp__abierta">
          <textarea class="rp__abierta-input" rows={4} disabled={confirmada}
            value={typeof r === 'string' ? r : ''}
            placeholder="Escribe tu respuesta…"
            onInput={(e) => setRespuesta(e.currentTarget.value)} />
          {confirmada && (
            <div class="rp__modelo">
              <span class="rp__modelo-label">Respuesta modelo (compárala con la tuya):</span>
              <div class="rp__modelo-body" dangerouslySetInnerHTML={{ __html: item.modelo }} />
            </div>
          )}
        </div>
      )}

      {confirmada && item.tipo !== 'abierta' && (
        <div class={['qp__feedback', acerto ? 'is-ok' : 'is-fail'].join(' ')}>
          <strong>{acerto ? '¡Correcto!' : 'Incorrecto.'}</strong>
          {'explicacion' in item && item.explicacion && <p>{item.explicacion}</p>}
        </div>
      )}

      <div class="qp__actions">
        <button class="qp__btn qp__btn--ghost" type="button" onClick={anterior} disabled={estado.idx === 0}>← Anterior</button>
        {!confirmada ? (
          <button class="qp__btn qp__btn--primary" type="button" onClick={confirmar} disabled={!respondida(item, r)}>
            {item.tipo === 'abierta' ? 'Ver respuesta modelo' : 'Confirmar'}
          </button>
        ) : (
          <button class="qp__btn qp__btn--primary" type="button" onClick={siguiente}>
            {estado.idx + 1 === total ? 'Ver mi nivel' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
