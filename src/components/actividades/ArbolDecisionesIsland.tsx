/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import type { ArbolJSON, Kpis, Opcion } from './types.ts';
import { applyDelta, percentChange } from './kpi.ts';

interface Props {
  data: ArbolJSON;
  /** Stable id used as the sessionStorage key. */
  simuladorId: string;
}

type Phase = 'intro' | 'node' | 'feedback' | 'final';

interface SessionState {
  phase: Phase;
  nodeId: string;
  kpis: Kpis;
  lastChoice: { feedback: string; next: string } | null;
}

export default function ArbolDecisionesIsland({ data, simuladorId }: Props) {
  const storageKey = `arbol:${simuladorId}`;
  const initialState: SessionState = { phase: 'intro', nodeId: '', kpis: data.intro.kpi_inicial, lastChoice: null };

  const [state, setState] = useState<SessionState>(() => {
    if (typeof window === 'undefined') return initialState;
    const stored = window.sessionStorage.getItem(storageKey);
    if (!stored) return initialState;
    try { return JSON.parse(stored) as SessionState; } catch { return initialState; }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  function start() {
    const firstNodeId = Object.keys(data.nodes)[0];
    setState({ phase: 'node', nodeId: firstNodeId, kpis: data.intro.kpi_inicial, lastChoice: null });
  }

  function chooseOption(opt: Opcion) {
    const newKpis = applyDelta(state.kpis, opt.kpi_delta);
    setState({ ...state, phase: 'feedback', kpis: newKpis, lastChoice: { feedback: opt.feedback, next: opt.next } });
  }

  function advance() {
    if (!state.lastChoice) return;
    const next = state.lastChoice.next;
    if (next.startsWith('final:')) {
      setState({ ...state, phase: 'final', nodeId: next.replace('final:', ''), lastChoice: null });
    } else {
      setState({ ...state, phase: 'node', nodeId: next, lastChoice: null });
    }
  }

  function restart() {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(storageKey);
    setState(initialState);
  }

  return (
    <div class="arbol">
      <KpiBar kpis={state.kpis} initial={data.intro.kpi_inicial} />

      {state.phase === 'intro' && (
        <div class="arbol__card">
          <p class="arbol__kicker">{data.intro.kicker}</p>
          <h2 class="arbol__h2">{data.intro.titulo}</h2>
          <p class="arbol__contexto">{data.intro.contexto}</p>
          <button class="arbol__btn-primary" type="button" onClick={start}>Empezar</button>
        </div>
      )}

      {state.phase === 'node' && data.nodes[state.nodeId] && (
        <div class="arbol__card">
          <h3 class="arbol__h3">{data.nodes[state.nodeId].titulo}</h3>
          <p class="arbol__situacion">{data.nodes[state.nodeId].situacion}</p>
          <ul class="arbol__opciones">
            {data.nodes[state.nodeId].opciones.map((opt, i) => (
              <li key={i}>
                <button class="arbol__opcion" type="button" onClick={() => chooseOption(opt)}>{opt.label}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.phase === 'feedback' && state.lastChoice && (
        <div class="arbol__feedback">
          <p class="arbol__kicker arbol__kicker--mustard">Consecuencia</p>
          <p>{state.lastChoice.feedback}</p>
          <button class="arbol__btn-primary" type="button" onClick={advance}>Continuar</button>
        </div>
      )}

      {state.phase === 'final' && data.finales[state.nodeId] && (
        <div class="arbol__final">
          <p class="arbol__kicker">Final</p>
          <h2 class="arbol__h2">{data.finales[state.nodeId].titulo}</h2>
          <p class="arbol__resumen">{data.finales[state.nodeId].resumen}</p>
          <h3 class="arbol__h3">Lecciones clave</h3>
          <ul class="arbol__lecciones">
            {data.finales[state.nodeId].lecciones_clave.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
          <button class="arbol__btn-secondary" type="button" onClick={restart}>Reiniciar simulación</button>
        </div>
      )}
    </div>
  );
}

function KpiBar({ kpis, initial }: { kpis: Kpis; initial: Kpis }) {
  return (
    <div class="kpi-bar">
      {Object.keys(initial).map((k) => {
        const change = percentChange(initial[k], kpis[k] ?? initial[k]);
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
        return (
          <div class={`kpi-pill kpi-pill--${trend}`} key={k}>
            <span class="kpi-pill__label">{k}</span>
            <span class="kpi-pill__value">{kpis[k] ?? initial[k]}</span>
            {change !== 0 && <span class="kpi-pill__delta">{change > 0 ? '+' : ''}{change}%</span>}
          </div>
        );
      })}
    </div>
  );
}
