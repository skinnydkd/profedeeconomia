/** @jsxImportSource preact */
import { useState, useEffect, useMemo } from 'preact/hooks';
import './BusinessGame.css';
import {
  simularRonda,
  ranking,
  DEFAULT_PARAMS,
  ESTADO_INICIAL,
  type MarketParams,
  type TeamDecision,
  type TeamState,
  type RoundResult,
} from '@/lib/business-game/engine';
import { CAMPOS, AREAS, decisionPorDefecto, eur, num } from '@/lib/business-game/ui';

/**
 * Business Game — prototipo jugable LOCAL (sin backend todavía).
 *
 * El profesor monta los equipos, cada ronda introduce las decisiones de las 4
 * áreas de cada empresa, cierra la ronda (ejecuta el motor) y ve resultados y
 * ranking. Sirve para validar el modelo de mercado y la mecánica antes de
 * conectar la persistencia (Supabase + registro de «Juegos Económicos»).
 *
 * El estado se guarda en localStorage para poder retomar la partida.
 */

const STORAGE_KEY = 'bg-state-v1';

interface Equipo { id: string; nombre: string; }
interface Persisted {
  params: MarketParams;
  equipos: Equipo[];
  fase: 'setup' | 'decisiones' | 'resultados';
  ronda: number;
  estados: Record<string, TeamState>;
  decisiones: Record<string, TeamDecision>;
  historia: { ronda: number; resultados: RoundResult[] }[];
}

function nuevoId(): string { return 'e' + Math.floor(performance.now() * 1000).toString(36); }

export default function BusinessGame() {
  const [st, setSt] = useState<Persisted | null>(null);

  // Carga inicial (SSR-safe).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { setSt(JSON.parse(raw)); return; }
    } catch {}
    setSt(estadoNuevo());
  }, []);

  useEffect(() => {
    if (st) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(st)); } catch {}
  }, [st]);

  if (!st) return <div class="bg"><p class="bg__loading">Cargando…</p></div>;

  return (
    <div class="bg">
      {st.fase === 'setup' && <Setup st={st} setSt={setSt} />}
      {st.fase === 'decisiones' && <Decisiones st={st} setSt={setSt} />}
      {st.fase === 'resultados' && <Resultados st={st} setSt={setSt} />}
    </div>
  );
}

function estadoNuevo(): Persisted {
  const equipos: Equipo[] = [
    { id: nuevoId(), nombre: 'Empresa A' },
    { id: nuevoId(), nombre: 'Empresa B' },
    { id: nuevoId(), nombre: 'Empresa C' },
  ];
  return {
    params: { ...DEFAULT_PARAMS },
    equipos,
    fase: 'setup',
    ronda: 1,
    estados: Object.fromEntries(equipos.map((e) => [e.id, { ...ESTADO_INICIAL }])),
    decisiones: {},
    historia: [],
  };
}

// ── Setup ────────────────────────────────────────────────
function Setup({ st, setSt }: { st: Persisted; setSt: (s: Persisted) => void }) {
  const [avanzado, setAvanzado] = useState(false);
  const setNombre = (id: string, nombre: string) =>
    setSt({ ...st, equipos: st.equipos.map((e) => (e.id === id ? { ...e, nombre } : e)) });
  const add = () => {
    const id = nuevoId();
    setSt({ ...st, equipos: [...st.equipos, { id, nombre: `Empresa ${String.fromCharCode(65 + st.equipos.length)}` }], estados: { ...st.estados, [id]: { ...ESTADO_INICIAL } } });
  };
  const quitar = (id: string) => {
    const { [id]: _, ...estados } = st.estados;
    setSt({ ...st, equipos: st.equipos.filter((e) => e.id !== id), estados });
  };
  const setParam = (k: keyof MarketParams, v: number) => setSt({ ...st, params: { ...st.params, [k]: v } });
  const empezar = () => {
    const decisiones = Object.fromEntries(st.equipos.map((e) => [e.id, st.decisiones[e.id] ?? decisionPorDefecto()]));
    setSt({ ...st, fase: 'decisiones', decisiones });
  };

  return (
    <div class="bg__panel">
      <h2 class="bg__h2">Monta la partida</h2>
      <p class="bg__lead">Cada equipo dirige una empresa. Compiten en el mismo mercado: lo que vende cada uno depende de sus decisiones <em>y</em> de las del resto.</p>

      <div class="bg__equipos">
        {st.equipos.map((e) => (
          <div class="bg__equipo-row" key={e.id}>
            <input class="bg__input bg__input--name" value={e.nombre} onInput={(ev) => setNombre(e.id, (ev.target as HTMLInputElement).value)} />
            {st.equipos.length > 2 && <button class="bg__x" onClick={() => quitar(e.id)} aria-label="Quitar">×</button>}
          </div>
        ))}
      </div>
      {st.equipos.length < 8 && <button class="bg__btn bg__btn--ghost" onClick={add}>+ Añadir empresa</button>}

      <button class="bg__toggle" onClick={() => setAvanzado(!avanzado)}>{avanzado ? '▾' : '▸'} Parámetros del mercado (avanzado)</button>
      {avanzado && (
        <div class="bg__params">
          <ParamNum label="Demanda base (ud)" k="demandaBase" st={st} set={setParam} step={500} />
          <ParamNum label="Crecimiento demanda/ronda" k="crecimientoDemanda" st={st} set={setParam} step={0.01} />
          <ParamNum label="Precio de referencia (€)" k="precioReferencia" st={st} set={setParam} step={1} />
          <ParamNum label="Coste fijo/ronda (€)" k="costeFijo" st={st} set={setParam} step={1000} />
          <ParamNum label="Coste variable base (€/ud)" k="costeVariableBase" st={st} set={setParam} step={0.5} />
          <ParamNum label="Peso calidad" k="pesoCalidad" st={st} set={setParam} step={0.05} />
          <ParamNum label="Peso marketing" k="pesoMarketing" st={st} set={setParam} step={0.05} />
          <ParamNum label="Peso precio" k="pesoPrecio" st={st} set={setParam} step={0.05} />
        </div>
      )}

      <div class="bg__actions">
        <button class="bg__btn bg__btn--primary" onClick={empezar} disabled={st.equipos.length < 2}>Empezar la 1.ª ronda →</button>
        <button class="bg__btn bg__btn--ghost" onClick={() => { localStorage.removeItem(STORAGE_KEY); setSt(estadoNuevo()); }}>Reiniciar</button>
      </div>
    </div>
  );
}

function ParamNum({ label, k, st, set, step }: { label: string; k: keyof MarketParams; st: Persisted; set: (k: keyof MarketParams, v: number) => void; step: number }) {
  return (
    <label class="bg__field">
      <span class="bg__field-label">{label}</span>
      <input class="bg__input" type="number" step={step} value={st.params[k]} onInput={(e) => set(k, parseFloat((e.target as HTMLInputElement).value) || 0)} />
    </label>
  );
}

// ── Decisiones ───────────────────────────────────────────
function Decisiones({ st, setSt }: { st: Persisted; setSt: (s: Persisted) => void }) {
  const setDec = (id: string, k: keyof TeamDecision, v: number) =>
    setSt({ ...st, decisiones: { ...st.decisiones, [id]: { ...(st.decisiones[id] ?? decisionPorDefecto()), [k]: v } } });

  const cerrar = () => {
    const entradas = st.equipos.map((e) => ({ id: e.id, nombre: e.nombre, estado: st.estados[e.id] ?? { ...ESTADO_INICIAL }, decision: st.decisiones[e.id] ?? decisionPorDefecto() }));
    const resultados = simularRonda(st.params, entradas, st.ronda);
    const estados = { ...st.estados };
    for (const r of resultados) estados[r.id] = r.estado;
    setSt({ ...st, fase: 'resultados', estados, historia: [...st.historia, { ronda: st.ronda, resultados }] });
  };

  return (
    <div class="bg__panel">
      <div class="bg__ronda-head">
        <h2 class="bg__h2">Ronda {st.ronda} — decisiones</h2>
        <span class="bg__ronda-tag">Año {st.ronda} de la empresa</span>
      </div>
      <p class="bg__lead">Cada empresa fija sus decisiones en las 4 áreas. Al cerrar la ronda, el mercado reparte las ventas.</p>

      <div class="bg__grid">
        {st.equipos.map((e) => {
          const d = st.decisiones[e.id] ?? decisionPorDefecto();
          return (
            <div class="bg__card" key={e.id}>
              <h3 class="bg__card-title">{e.nombre}</h3>
              <p class="bg__card-caja">Caja: <strong>{eur(st.estados[e.id]?.caja ?? 0)}</strong></p>
              {AREAS.map((area) => (
                <div class="bg__area" key={area}>
                  <span class="bg__area-name">{area}</span>
                  {CAMPOS.filter((c) => c.area === area).map((c) => (
                    <label class="bg__field bg__field--row" key={c.key}>
                      <span class="bg__field-label">{c.label}</span>
                      <span class="bg__field-input">
                        <input class="bg__input" type="number" min={0} step={c.step} value={d[c.key]} onInput={(ev) => setDec(e.id, c.key, parseFloat((ev.target as HTMLInputElement).value) || 0)} />
                        <span class="bg__unit">{c.unidad}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div class="bg__actions">
        <button class="bg__btn bg__btn--primary" onClick={cerrar}>Cerrar la ronda {st.ronda} y ver resultados →</button>
      </div>
    </div>
  );
}

// ── Resultados ───────────────────────────────────────────
function Resultados({ st, setSt }: { st: Persisted; setSt: (s: Persisted) => void }) {
  const ultima = st.historia[st.historia.length - 1];
  const orden = useMemo(() => ranking(ultima.resultados), [ultima]);
  const siguiente = () => setSt({ ...st, fase: 'decisiones', ronda: st.ronda + 1 });
  const acabar = () => setSt({ ...st, fase: 'setup' });

  return (
    <div class="bg__panel">
      <div class="bg__ronda-head">
        <h2 class="bg__h2">Ronda {ultima.ronda} — resultados</h2>
        <span class="bg__ronda-tag">Ranking por beneficio acumulado</span>
      </div>

      <div class="bg__tabla-wrap">
        <table class="bg__tabla">
          <thead>
            <tr><th>#</th><th>Empresa</th><th>Calidad</th><th>Cuota</th><th>Ventas</th><th>Stock</th><th>Ingresos</th><th>Costes</th><th>Beneficio</th><th>Benef. acum.</th></tr>
          </thead>
          <tbody>
            {orden.map((r, i) => (
              <tr key={r.id} class={r.beneficio < 0 ? 'is-perdida' : ''}>
                <td class="bg__pos">{i + 1}</td>
                <td class="bg__nombre">{r.nombre}</td>
                <td>{r.calidad.toFixed(0)}</td>
                <td>{(r.cuota * 100).toFixed(1)} %</td>
                <td>{num(r.ventas)}</td>
                <td>{num(r.stock)}</td>
                <td>{eur(r.ingresos)}</td>
                <td>{eur(r.costes)}</td>
                <td class={r.beneficio >= 0 ? 'bg__ok' : 'bg__fail'}>{eur(r.beneficio)}</td>
                <td class="bg__acum">{eur(r.estado.beneficioAcumulado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {st.historia.length > 1 && (
        <details class="bg__historia">
          <summary>Histórico ({st.historia.length} rondas)</summary>
          <div class="bg__historia-body">
            {st.equipos.map((e) => (
              <div class="bg__hist-row" key={e.id}>
                <span class="bg__hist-name">{e.nombre}</span>
                <span class="bg__hist-vals">
                  {st.historia.map((h) => {
                    const r = h.resultados.find((x) => x.id === e.id);
                    return <span class={`bg__hist-val ${r && r.beneficio >= 0 ? 'bg__ok' : 'bg__fail'}`} key={h.ronda} title={`Ronda ${h.ronda}`}>{r ? eur(r.beneficio) : '—'}</span>;
                  })}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      <div class="bg__actions">
        <button class="bg__btn bg__btn--primary" onClick={siguiente}>Siguiente ronda ({st.ronda + 1}) →</button>
        <button class="bg__btn bg__btn--ghost" onClick={acabar}>Terminar partida</button>
      </div>
    </div>
  );
}
