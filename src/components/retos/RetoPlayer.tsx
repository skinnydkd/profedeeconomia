/** @jsxImportSource preact */
import { useEffect, useId, useMemo, useRef, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../../lib/storage';
import { nivelForScore, type NivelInfo } from '../../lib/retos';
import type { Item, RetoData } from './parse-reto';
import Marca from '../QuizMarca';
import TextoInline from '../TextoInline';
import { lecturasNumero, numeroCorrecto, ordenesOpciones, ordenValido, rngDesde, textoNoNumerico, textoPlano } from '../quiz-utils';
import '../QuizPlayer.css';
import './RetoPlayer.css';
import { shuffleNoIdentidad } from './shuffle-utils';

type Props = {
  reto: RetoData;
  niveles: NivelInfo[];          // exactly 3 (real descriptors or generic fallback)
  competenciaTexto: string;
  competenciaCodigo: string;
  storageKey: string;            // localStorage namespace, pass the reto slug
  locale?: 'es' | 'ca';          // UI chrome locale (defaults to Castilian)
};

const COPY = {
  es: {
    genericos: ['En desarrollo', 'Adecuado', 'Avanzado'],
    resultado: 'Resultado', nivelLogro: 'Nivel de logro',
    de: 'de', itemEval: 'ítem evaluable', itemsEval: 'ítems evaluables', correctos: 'correctos',
    mejorNivel: 'Tu mejor nivel:', reintentar: 'Volver a intentarlo', borrar: 'Borrar mi progreso',
    paso: 'Paso', pasoDe: 'de', verdadero: 'Verdadero', falso: 'Falso',
    tuRespuesta: 'Tu respuesta', elige: '— elige —', subir: 'Subir', bajar: 'Bajar',
    escribeRespuesta: 'Escribe tu respuesta…', respuestaModelo: 'Respuesta modelo (compárala con la tuya):',
    correcto: '¡Correcto!', incorrecto: 'Incorrecto.', respuestaCorrecta: 'Respuesta correcta:',
    anterior: '← Anterior', verModelo: 'Ver respuesta modelo', confirmar: 'Confirmar',
    verNivel: 'Ver mi nivel', siguiente: 'Siguiente →',
    marcaCorrecta: 'Correcta', marcaTuya: 'Tu respuesta', filaBien: 'correcta', filaMal: 'incorrecta',
    progreso: 'Progreso',
    cambiarSigno: 'Cambiar el signo', avisoNumero: 'Escribe solo un número, por ejemplo 12,5.',
  },
  ca: {
    genericos: ['En desenvolupament', 'Adequat', 'Avançat'],
    resultado: 'Resultat', nivelLogro: "Nivell d'assoliment",
    de: 'de', itemEval: 'ítem avaluable', itemsEval: 'ítems avaluables', correctos: 'correctes',
    mejorNivel: 'El teu millor nivell:', reintentar: 'Tornar a intentar-ho', borrar: 'Esborrar el meu progrés',
    paso: 'Pas', pasoDe: 'de', verdadero: 'Vertader', falso: 'Fals',
    tuRespuesta: 'La teua resposta', elige: '— tria —', subir: 'Pujar', bajar: 'Baixar',
    escribeRespuesta: 'Escriu la teua resposta…', respuestaModelo: 'Resposta model (compara-la amb la teua):',
    correcto: 'Correcte!', incorrecto: 'Incorrecte.', respuestaCorrecta: 'Resposta correcta:',
    anterior: '← Anterior', verModelo: 'Veure resposta model', confirmar: 'Confirmar',
    verNivel: 'Veure el meu nivell', siguiente: 'Següent →',
    marcaCorrecta: 'Correcta', marcaTuya: 'La teua resposta', filaBien: 'correcta', filaMal: 'incorrecta',
    progreso: 'Progrés',
    cambiarSigno: 'Canviar el signe', avisoNumero: 'Escriu només un número, per exemple 12,5.',
  },
} as const;

/** Numeric items keep the text as typed (a string); "ordenar" keeps the current order (string[]). */
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

function respondida(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r !== null;
    case 'numerico': return typeof r === 'string' && lecturasNumero(r).length > 0;
    case 'relacionar': return Array.isArray(r) && (r as number[]).length === it.izquierda.length && (r as number[]).every((x) => x >= 0);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length;
    case 'abierta': return typeof r === 'string' && r.trim().length > 0;
  }
}

function esCorrecta(it: Item, r: Respuesta): boolean {
  switch (it.tipo) {
    case 'opcion-multiple':
    case 'verdadero-falso': return r === it.correcta;
    case 'numerico': return typeof r === 'string' && numeroCorrecto(r, it.respuesta, it.tolerancia);
    case 'relacionar': return Array.isArray(r) && it.correctas.every((c, i) => (r as number[])[i] === c);
    case 'ordenar': return Array.isArray(r) && (r as string[]).length === it.elementos.length && (r as string[]).every((v, i) => v === it.elementos[i]);
    case 'abierta': return false; // not auto-scored
  }
}

const numComma = (n: number) => String(n).replace('.', ',');

/** The correct answer in words, for the feedback of a wrong answer. */
function formatCorr(it: Item, orden: number[], t: (typeof COPY)[keyof typeof COPY]): string {
  switch (it.tipo) {
    case 'opcion-multiple': return `${String.fromCharCode(65 + orden.indexOf(it.correcta))}) ${it.opciones[it.correcta]}`;
    case 'verdadero-falso': return it.correcta ? t.verdadero : t.falso;
    case 'numerico': return numComma(it.respuesta) + (it.unidad ? ' ' + it.unidad : '');
    case 'relacionar': return it.correctas.map((d, i) => `${i + 1}→${String.fromCharCode(97 + d)}`).join('  ');
    case 'ordenar': return it.elementos.map((el, i) => `${i + 1}. ${el}`).join(' · ');
    case 'abierta': return '';
  }
}

type Estado = {
  idx: number;
  respuestas: Respuesta[];
  confirmadas: boolean[];
  finalizado: boolean;
  /** Display order of the multiple-choice options per item. */
  ordenes: number[][];
};

/**
 * A fresh attempt. The first one is shuffled with a generator seeded by the
 * reto, so the server render and the hydrated island agree; retries reshuffle
 * at random.
 */
function emptyState(entradas: Entrada[], rng: () => number): Estado {
  return {
    idx: 0,
    respuestas: entradas.map((e) => (e.item.tipo === 'ordenar' ? shuffleNoIdentidad(e.item.elementos, rng) : null)),
    confirmadas: entradas.map(() => false),
    finalizado: false,
    ordenes: ordenesOpciones(entradas.map((e) => e.item), rng),
  };
}

function bestKey(storageKey: string): string {
  return `reto:${storageKey}:best`;
}

export default function RetoPlayer({ reto, niveles, competenciaTexto, competenciaCodigo, storageKey, locale = 'es' }: Props) {
  const t = COPY[locale];
  const entradas = useMemo(() => aplanar(reto), [reto]);
  const totalAuto = useMemo(() => entradas.filter((e) => esAuto(e.item)).length, [entradas]);
  const [estado, setEstado] = useState<Estado>(() => emptyState(entradas, rngDesde(storageKey)));

  const [bestNivel, setBestNivel] = useState<number | null>(null);
  useEffect(() => {
    const stored = loadJSON<number | null>(bestKey(storageKey), null);
    if (typeof stored === 'number') setBestNivel(stored);
  }, [storageKey]);

  // After moving, focus goes to the new item (or the result), not to <body>.
  const enunciadoRef = useRef<HTMLHeadingElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);
  // Ids for the numeric field: its hint, and its own name, which the sign
  // button inside the same <label> would otherwise join.
  const avisoNumeroId = useId();
  const moverFoco = useRef(false);
  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    (estado.finalizado ? resultadoRef.current : enunciadoRef.current)?.focus();
  }, [estado.idx, estado.finalizado]);

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
    moverFoco.current = true;
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

  function anterior() { moverFoco.current = true; setEstado((s) => ({ ...s, idx: Math.max(0, s.idx - 1) })); }
  function reiniciar() { moverFoco.current = true; setEstado(emptyState(entradas, Math.random)); }
  function borrarProgreso() { removeKey(bestKey(storageKey)); setBestNivel(null); }

  // ─── Final screen: achievement level ─────────────────────
  if (estado.finalizado) {
    const nivel = niveles[nivelIdx] ?? { nivel: t.genericos[nivelIdx], descriptor: '' };
    return (
      <div class="qp rp">
        <div class="qp__final">
          <div class="qp__eyebrow">{t.resultado} · {competenciaCodigo}</div>
          <div class={`rp__nivel rp__nivel--${nivelIdx}`} ref={resultadoRef} tabIndex={-1}>
            <span class="rp__nivel-label">{t.nivelLogro}</span>
            <strong class="rp__nivel-name">{nivel.nivel}</strong>
          </div>
          <p class="qp__detail">{aciertos} {t.de} {totalAuto} {totalAuto === 1 ? t.itemEval : t.itemsEval} {t.correctos}</p>
          {nivel.descriptor && <p class="rp__nivel-desc">{nivel.descriptor}</p>}
          <p class="rp__comp"><strong>{competenciaCodigo}.</strong> {competenciaTexto}</p>
          {bestNivel !== null && (
            <p class="qp__best">{t.mejorNivel} {(niveles[bestNivel]?.nivel) ?? t.genericos[bestNivel]}</p>
          )}
          <div class="qp__actions">
            <button class="qp__btn qp__btn--primary" type="button" onClick={reiniciar}>{t.reintentar}</button>
            {bestNivel !== null && (
              <button class="qp__btn qp__btn--ghost" type="button" onClick={borrarProgreso}>{t.borrar}</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Item screen ─────────────────────────────────────────
  const acerto = confirmada && esCorrecta(item, r);
  // Said out loud when the text cannot become a number: «Confirmar» alone just stays disabled.
  const noEsNumero = item.tipo === 'numerico' && !confirmada && typeof r === 'string' && textoNoNumerico(r);
  // The decimal keypad of iOS has no minus key, so the sign has its own button.
  // It is there for every numeric item: showing it only for negative answers
  // would give the answer away.
  const cambiarSigno = () => {
    const v = typeof r === 'string' ? r.trim() : '';
    setRespuesta(/^[-−]/.test(v) ? v.slice(1) : `-${v}`);
    numeroRef.current?.focus();
  };
  const ordArr = item.tipo === 'ordenar' && Array.isArray(r) ? (r as string[]) : [];
  const orden = item.tipo === 'opcion-multiple' ? ordenValido(estado.ordenes[estado.idx], item.opciones.length) : [];
  const hechos = estado.confirmadas.filter(Boolean).length;

  return (
    <div class="qp rp">
      <div class="qp__header">
        <span class="qp__eyebrow">{t.paso} {estado.idx + 1} {t.pasoDe} {total}</span>
        <div class="qp__progress" role="img" aria-label={`${t.progreso}: ${hechos} ${t.de} ${total}`}>
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

      <h3 class="qp__enunciado" ref={enunciadoRef} tabIndex={-1}><TextoInline texto={item.enunciado} /></h3>

      {item.tipo === 'opcion-multiple' && (
        <ol class="qp__opciones">
          {orden.map((i, pos) => {
            const sel = r === i;
            const corr = i === item.correcta;
            const sc = confirmada ? (corr ? 'is-correct' : sel ? 'is-incorrect' : '') : sel ? 'is-selected' : '';
            return (
              <li key={i}>
                <button type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(i)} disabled={confirmada} aria-pressed={sel}>
                  <span class="qp__opt-letra">{String.fromCharCode(65 + pos)}</span>
                  <span class="qp__opt-texto"><TextoInline texto={item.opciones[i]} /></span>
                  {confirmada && (corr || sel) && <Marca ok={corr} texto={corr ? t.marcaCorrecta : t.marcaTuya} />}
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
              <button key={String(v)} type="button" class={['qp__opt', sc].join(' ').trim()} onClick={() => setRespuesta(v)} disabled={confirmada} aria-pressed={sel}>
                <span class="qp__opt-texto">{v ? t.verdadero : t.falso}</span>
                {confirmada && (corr || sel) && <Marca ok={corr} texto={corr ? t.marcaCorrecta : t.marcaTuya} />}
              </button>
            );
          })}
        </div>
      )}

      {item.tipo === 'numerico' && (
        <div class={['qp__num', confirmada ? (acerto ? 'is-correct' : 'is-incorrect') : ''].join(' ').trim()}>
          <label class="qp__num-label">
            <span id={`${avisoNumeroId}-l`}>{t.tuRespuesta}</span>
            <span class="qp__num-field">
              <button type="button" class="rp__signe" onClick={cambiarSigno} disabled={confirmada} aria-label={t.cambiarSigno}>±</button>
              <input type="text" inputMode="decimal" autoComplete="off" class="qp__num-input" disabled={confirmada}
                ref={numeroRef}
                value={typeof r === 'string' ? r : ''}
                onInput={(e) => setRespuesta(e.currentTarget.value)}
                aria-labelledby={item.unidad ? `${avisoNumeroId}-l ${avisoNumeroId}-u` : `${avisoNumeroId}-l`}
                aria-invalid={noEsNumero || undefined}
                aria-describedby={noEsNumero ? avisoNumeroId : undefined} />
              {item.unidad && <span class="qp__num-unidad" id={`${avisoNumeroId}-u`}>{item.unidad}</span>}
            </span>
          </label>
          {noEsNumero && <p class="qp__num-aviso" id={avisoNumeroId}>{t.avisoNumero}</p>}
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
                <tr key={li} class={confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''}>
                  <td class="qp__rel-num">{li + 1}</td>
                  <td class="qp__rel-izq">
                    <TextoInline texto={izq} />
                    {confirmada && <Marca ok={okRow} texto={okRow ? t.filaBien : t.filaMal} soloLector />}
                  </td>
                  <td class="qp__rel-der">
                    <select aria-label={`${li + 1}. ${textoPlano(izq)}`} disabled={confirmada} value={String(chosen)} onChange={(e) => elegirRel(li, Number(e.currentTarget.value))}>
                      <option value="-1">{t.elige}</option>
                      {item.derecha.map((der, di) => (<option value={String(di)}>{String.fromCharCode(97 + di)}) {textoPlano(der)}</option>))}
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
              <li key={el} class={['rp__ord-item', confirmada ? (okRow ? 'is-ok' : 'is-fail') : ''].join(' ').trim()}>
                <span class="rp__ord-pos">{pos + 1}</span>
                <span class="rp__ord-text"><TextoInline texto={el} /></span>
                {confirmada && <Marca ok={okRow} texto={okRow ? t.filaBien : t.filaMal} soloLector />}
                {!confirmada && (
                  <span class="rp__ord-btns">
                    <button type="button" onClick={() => mover(pos, -1)} disabled={pos === 0} aria-label={t.subir}>↑</button>
                    <button type="button" onClick={() => mover(pos, 1)} disabled={pos === ordArr.length - 1} aria-label={t.bajar}>↓</button>
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
            placeholder={t.escribeRespuesta}
            onInput={(e) => setRespuesta(e.currentTarget.value)} />
          {confirmada && (
            <div class="rp__modelo">
              <span class="rp__modelo-label">{t.respuestaModelo}</span>
              <div class="rp__modelo-body" dangerouslySetInnerHTML={{ __html: item.modelo }} />
            </div>
          )}
        </div>
      )}

      {/* Live region: present before the answer is confirmed so it is announced */}
      <div class="qp__live" role="status">
        {confirmada && item.tipo !== 'abierta' && (
          <div class={['qp__feedback', acerto ? 'is-ok' : 'is-fail'].join(' ')}>
            <strong>{acerto ? t.correcto : t.incorrecto}</strong>
            {!acerto && (
              <p class="qp__feedback-corr">{t.respuestaCorrecta} <em><TextoInline texto={formatCorr(item, orden, t)} /></em></p>
            )}
            {'explicacion' in item && item.explicacion && <p><TextoInline texto={item.explicacion} /></p>}
          </div>
        )}
      </div>

      <div class="qp__actions">
        <button class="qp__btn qp__btn--ghost" type="button" onClick={anterior} disabled={estado.idx === 0}>{t.anterior}</button>
        {!confirmada ? (
          <button class="qp__btn qp__btn--primary" type="button" onClick={confirmar} disabled={!respondida(item, r)}>
            {item.tipo === 'abierta' ? t.verModelo : t.confirmar}
          </button>
        ) : (
          <button class="qp__btn qp__btn--primary" type="button" onClick={siguiente}>
            {estado.idx + 1 === total ? t.verNivel : t.siguiente}
          </button>
        )}
      </div>
    </div>
  );
}
