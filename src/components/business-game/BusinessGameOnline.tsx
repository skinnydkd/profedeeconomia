/** @jsxImportSource preact */
import { useState, useEffect, useCallback } from 'preact/hooks';
import './BusinessGame.css';
import BusinessGame from './BusinessGame';
import { CAMPOS, AREAS, decisionPorDefecto, eur, num } from '@/lib/business-game/ui';
import type { TeamDecision } from '@/lib/business-game/engine';

/**
 * Business Game ONLINE (Fase 1b) — multijugador por rondas con persistencia.
 * El profe crea una liga (código) y los equipos se unen desde sus dispositivos.
 * Reutiliza Supabase + el registro nombre/instituto de «Juegos Económicos».
 *
 * Requiere el backend en /api/business-game/ y la migración SQL aplicada.
 */

const API = '/api/business-game';
const SESION_KEY = 'bg-online-v1';

interface Sesion { rol: 'profe' | 'equipo'; token: string; codigo: string; equipoId?: string; }
interface Estado {
  liga: { id: string; nombre: string; ronda: number; fase: string; numRondas: number };
  equipos: { id: string; nombre: string; instituto: string; caja: number; beneficioAcumulado: number; deuda: number; haEnviado: boolean }[];
  resultados: { equipoId: string; ronda: number; calidad: number; cuota: number; ventas: number; stock: number; ingresos: number; costes: number; beneficio: number; beneficioAcumulado: number }[];
}

async function post(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? 'Error de red');
  return data;
}

export default function BusinessGameOnline() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [modo, setModo] = useState<'inicio' | 'crear' | 'unirse' | 'practica'>('inicio');
  const [estado, setEstado] = useState<Estado | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(SESION_KEY); if (raw) setSesion(JSON.parse(raw)); } catch {}
    setCargado(true);
  }, []);
  const guardar = (s: Sesion | null) => {
    setSesion(s);
    try { s ? localStorage.setItem(SESION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESION_KEY); } catch {}
  };

  const refrescar = useCallback(async (codigo: string) => {
    try {
      const res = await fetch(`${API}/estado?codigo=${encodeURIComponent(codigo)}`);
      if (res.ok) setEstado(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (!sesion) return;
    refrescar(sesion.codigo);
    const id = setInterval(() => refrescar(sesion.codigo), 4000);
    return () => clearInterval(id);
  }, [sesion, refrescar]);

  if (!cargado) return <div class="bg"><p class="bg__loading">Cargando…</p></div>;

  if (!sesion) {
    if (modo === 'practica') return <div class="bg"><button class="bg__btn bg__btn--ghost" onClick={() => setModo('inicio')}>← Volver</button><div style="height:1rem" /><BusinessGame /></div>;
    if (modo === 'crear') return <div class="bg"><CrearLiga onCreada={(s) => { guardar(s); setModo('inicio'); }} onCancel={() => setModo('inicio')} /></div>;
    if (modo === 'unirse') return <div class="bg"><Unirse onUnido={(s) => { guardar(s); setModo('inicio'); }} onCancel={() => setModo('inicio')} /></div>;
    return (
      <div class="bg">
        <div class="bg__panel">
          <h2 class="bg__h2">Business Game</h2>
          <p class="bg__lead">El simulador de empresa de curso completo. Elige cómo entrar:</p>
          <div class="bg__elige">
            <button class="bg__elige-card" onClick={() => setModo('crear')}><strong>Soy profe</strong><span>Crear una liga y obtener el código</span></button>
            <button class="bg__elige-card" onClick={() => setModo('unirse')}><strong>Soy un equipo</strong><span>Unirme con el código del profe</span></button>
          </div>
          <button class="bg__toggle" onClick={() => setModo('practica')}>▸ Probar en local, sin registro (modo práctica)</button>
        </div>
      </div>
    );
  }

  return (
    <div class="bg">
      {sesion.rol === 'profe'
        ? <PanelProfe sesion={sesion} estado={estado} onRefrescar={() => refrescar(sesion.codigo)} onSalir={() => { guardar(null); setEstado(null); }} />
        : <ConsolaEquipo sesion={sesion} estado={estado} onSalir={() => { guardar(null); setEstado(null); }} />}
    </div>
  );
}

// ── Crear liga (profe) ───────────────────────────────────
function CrearLiga({ onCreada, onCancel }: { onCreada: (s: Sesion) => void; onCancel: () => void }) {
  const [nombre, setNombre] = useState('');
  const [instituto, setInstituto] = useState('');
  const [numRondas, setNumRondas] = useState(8);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const crear = async () => {
    setEnviando(true); setError('');
    try {
      const d = await post('crear', { nombre, instituto, numRondas });
      onCreada({ rol: 'profe', token: d.token, codigo: d.codigo });
    } catch (e) { setError((e as Error).message); } finally { setEnviando(false); }
  };
  return (
    <div class="bg__panel">
      <h2 class="bg__h2">Crear una liga</h2>
      <p class="bg__lead">Crea la partida y comparte el código con la clase para que los equipos se unan.</p>
      <label class="bg__field"><span class="bg__field-label">Nombre de la liga</span><input class="bg__input bg__input--name" value={nombre} onInput={(e) => setNombre((e.target as HTMLInputElement).value)} placeholder="Ej. 2.º BACH Empresa" /></label>
      <label class="bg__field"><span class="bg__field-label">Instituto o centro</span><input class="bg__input bg__input--name" value={instituto} onInput={(e) => setInstituto((e.target as HTMLInputElement).value)} placeholder="Tu instituto" /></label>
      <label class="bg__field"><span class="bg__field-label">Número de rondas (años)</span><input class="bg__input" type="number" min={1} max={20} value={numRondas} onInput={(e) => setNumRondas(parseInt((e.target as HTMLInputElement).value) || 8)} /></label>
      {error && <p class="bg__error">{error}</p>}
      <div class="bg__actions">
        <button class="bg__btn bg__btn--primary" onClick={crear} disabled={enviando || nombre.length < 2 || instituto.length < 2}>{enviando ? 'Creando…' : 'Crear liga →'}</button>
        <button class="bg__btn bg__btn--ghost" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Unirse (equipo) ──────────────────────────────────────
function Unirse({ onUnido, onCancel }: { onUnido: (s: Sesion) => void; onCancel: () => void }) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [instituto, setInstituto] = useState('');
  const [miembros, setMiembros] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const unir = async () => {
    setEnviando(true); setError('');
    try {
      const d = await post('unirse', { codigo, nombre, instituto, miembros });
      onUnido({ rol: 'equipo', token: d.token, codigo: codigo.toUpperCase(), equipoId: d.equipoId });
    } catch (e) { setError((e as Error).message); } finally { setEnviando(false); }
  };
  return (
    <div class="bg__panel">
      <h2 class="bg__h2">Unirse a una liga</h2>
      <label class="bg__field"><span class="bg__field-label">Código de la liga</span><input class="bg__input bg__input--name bg__codigo-input" value={codigo} maxLength={6} onInput={(e) => setCodigo((e.target as HTMLInputElement).value.toUpperCase())} placeholder="ABC123" /></label>
      <label class="bg__field"><span class="bg__field-label">Nombre de vuestra empresa</span><input class="bg__input bg__input--name" value={nombre} onInput={(e) => setNombre((e.target as HTMLInputElement).value)} placeholder="Ej. Innovatech" /></label>
      <label class="bg__field"><span class="bg__field-label">Instituto o centro</span><input class="bg__input bg__input--name" value={instituto} onInput={(e) => setInstituto((e.target as HTMLInputElement).value)} /></label>
      <label class="bg__field"><span class="bg__field-label">Integrantes (opcional)</span><input class="bg__input bg__input--name" value={miembros} onInput={(e) => setMiembros((e.target as HTMLInputElement).value)} placeholder="Nombres del equipo" /></label>
      {error && <p class="bg__error">{error}</p>}
      <p class="bg__nota-mini">Tu empresa e instituto aparecerán en el ranking.</p>
      <div class="bg__actions">
        <button class="bg__btn bg__btn--primary" onClick={unir} disabled={enviando || codigo.length !== 6 || nombre.length < 2 || instituto.length < 2}>{enviando ? 'Entrando…' : 'Unirse →'}</button>
        <button class="bg__btn bg__btn--ghost" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Panel del profe ──────────────────────────────────────
function PanelProfe({ sesion, estado, onRefrescar, onSalir }: { sesion: Sesion; estado: Estado | null; onRefrescar: () => void; onSalir: () => void }) {
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState('');
  if (!estado) return <div class="bg__panel"><p class="bg__loading">Cargando la liga…</p></div>;
  const { liga, equipos } = estado;
  const enviados = equipos.filter((e) => e.haEnviado).length;
  const cerrar = async () => {
    setCerrando(true); setError('');
    try { await post('cerrar', {}, sesion.token); onRefrescar(); } catch (e) { setError((e as Error).message); } finally { setCerrando(false); }
  };
  return (
    <div class="bg__panel">
      <div class="bg__ronda-head">
        <h2 class="bg__h2">{liga.nombre}</h2>
        <span class="bg__ronda-tag">{liga.fase === 'cerrada' ? 'Liga terminada' : `Ronda ${liga.ronda} de ${liga.numRondas}`}</span>
      </div>
      <div class="bg__codigo-box">Código de la liga: <strong>{sesion.codigo}</strong></div>

      <h3 class="bg__h3">Empresas ({equipos.length}) · {enviados}/{equipos.length} han enviado decisiones</h3>
      <Ranking estado={estado} />

      {error && <p class="bg__error">{error}</p>}
      <div class="bg__actions">
        {liga.fase !== 'cerrada' && <button class="bg__btn bg__btn--primary" onClick={cerrar} disabled={cerrando || equipos.length === 0}>{cerrando ? 'Calculando…' : `Cerrar la ronda ${liga.ronda} →`}</button>}
        <button class="bg__btn bg__btn--ghost" onClick={onSalir}>Salir</button>
      </div>
      <Historia estado={estado} />
    </div>
  );
}

// ── Consola del equipo ───────────────────────────────────
function ConsolaEquipo({ sesion, estado, onSalir }: { sesion: Sesion; estado: Estado | null; onSalir: () => void }) {
  const [dec, setDec] = useState<TeamDecision>(decisionPorDefecto());
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  if (!estado) return <div class="bg__panel"><p class="bg__loading">Cargando la liga…</p></div>;
  const { liga } = estado;
  const yo = estado.equipos.find((e) => e.id === sesion.equipoId);
  const enviar = async () => {
    setEnviando(true); setError('');
    try { await post('decisiones', { decision: dec }, sesion.token); } catch (e) { setError((e as Error).message); } finally { setEnviando(false); }
  };
  const setCampo = (k: keyof TeamDecision, v: number) => setDec({ ...dec, [k]: v });

  return (
    <div class="bg__panel">
      <div class="bg__ronda-head">
        <h2 class="bg__h2">{yo?.nombre ?? 'Tu empresa'}</h2>
        <span class="bg__ronda-tag">{liga.fase === 'cerrada' ? 'Liga terminada' : `Ronda ${liga.ronda} de ${liga.numRondas}`}</span>
      </div>
      {yo && <p class="bg__card-caja">Caja: <strong>{eur(yo.caja)}</strong> · Beneficio acumulado: <strong>{eur(yo.beneficioAcumulado)}</strong></p>}

      {liga.fase !== 'cerrada' && (
        yo?.haEnviado
          ? <div class="bg__espera">✓ Decisiones enviadas para la ronda {liga.ronda}. Esperando a que el profe cierre la ronda…<br /><span class="bg__nota-mini">Puedes seguir cambiándolas y reenviar hasta que se cierre.</span></div>
          : <p class="bg__lead">Fija las decisiones de tu empresa en las 4 áreas y envíalas.</p>
      )}

      {liga.fase !== 'cerrada' && (
        <div class="bg__card" style="margin-bottom:1.2rem">
          {AREAS.map((area) => (
            <div class="bg__area" key={area}>
              <span class="bg__area-name">{area}</span>
              {CAMPOS.filter((c) => c.area === area).map((c) => (
                <label class="bg__field bg__field--row" key={c.key}>
                  <span class="bg__field-label">{c.label}</span>
                  <span class="bg__field-input"><input class="bg__input" type="number" min={0} step={c.step} value={dec[c.key]} onInput={(e) => setCampo(c.key, parseFloat((e.target as HTMLInputElement).value) || 0)} /><span class="bg__unit">{c.unidad}</span></span>
                </label>
              ))}
            </div>
          ))}
          {error && <p class="bg__error">{error}</p>}
          <button class="bg__btn bg__btn--primary" onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : yo?.haEnviado ? 'Reenviar decisiones' : `Enviar decisiones de la ronda ${liga.ronda}`}</button>
        </div>
      )}

      <h3 class="bg__h3">Ranking</h3>
      <Ranking estado={estado} miId={sesion.equipoId} />
      <div class="bg__actions"><button class="bg__btn bg__btn--ghost" onClick={onSalir}>Salir</button></div>
      <Historia estado={estado} />
    </div>
  );
}

// ── Ranking + Historia (compartidos) ─────────────────────
function Ranking({ estado, miId }: { estado: Estado; miId?: string }) {
  const ult = ultimaRonda(estado);
  return (
    <div class="bg__tabla-wrap">
      <table class="bg__tabla">
        <thead><tr><th>#</th><th>Empresa</th><th>Instituto</th><th>Últ. beneficio</th><th>Benef. acum.</th><th>Caja</th></tr></thead>
        <tbody>
          {estado.equipos.map((e, i) => {
            const r = ult.get(e.id);
            return (
              <tr key={e.id} class={e.id === miId ? 'bg__yo' : ''}>
                <td class="bg__pos">{i + 1}</td>
                <td class="bg__nombre">{e.nombre}</td>
                <td class="bg__nombre" style="font-size:0.82rem;color:var(--color-ink-mute)">{e.instituto}</td>
                <td class={r && r.beneficio < 0 ? 'bg__fail' : 'bg__ok'}>{r ? eur(r.beneficio) : '—'}</td>
                <td class="bg__acum">{eur(e.beneficioAcumulado)}</td>
                <td>{eur(e.caja)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Historia({ estado }: { estado: Estado }) {
  const rondas = [...new Set(estado.resultados.map((r) => r.ronda))].sort((a, b) => a - b);
  if (rondas.length < 1) return null;
  return (
    <details class="bg__historia">
      <summary>Histórico ({rondas.length} {rondas.length === 1 ? 'ronda' : 'rondas'})</summary>
      <div class="bg__historia-body">
        {estado.equipos.map((e) => (
          <div class="bg__hist-row" key={e.id}>
            <span class="bg__hist-name">{e.nombre}</span>
            <span class="bg__hist-vals">
              {rondas.map((ro) => {
                const r = estado.resultados.find((x) => x.equipoId === e.id && x.ronda === ro);
                return <span class={`bg__hist-val ${r && r.beneficio >= 0 ? 'bg__ok' : 'bg__fail'}`} key={ro} title={`Ronda ${ro}`}>{r ? eur(r.beneficio) : '—'}</span>;
              })}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}

function ultimaRonda(estado: Estado): Map<string, { beneficio: number }> {
  const max = estado.resultados.reduce((m, r) => Math.max(m, r.ronda), 0);
  return new Map(estado.resultados.filter((r) => r.ronda === max).map((r) => [r.equipoId, { beneficio: r.beneficio }]));
}
