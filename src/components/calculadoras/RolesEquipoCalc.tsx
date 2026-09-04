/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { analizar, ROLES, type Persona, type Rol } from '../../lib/calc/roles-equipo';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Esto no es un test de personalidad ni te clasifica: es una forma de ver de un vistazo qué papeles cubre vuestro equipo y cuáles no cubre nadie. Lo interesante casi nunca es tu columna, sino los huecos.',
    aviso: 'No es el cuestionario oficial de Belbin, que es un instrumento con licencia. Son frases de comportamiento pensadas para clase, con los mismos nombres de rol que usa la unidad. Sirven para hablar de quién hace qué, no para etiquetar a nadie.',
    equipoTitulo: 'El equipo',
    persona: 'Persona',
    anyadir: 'Añadir persona',
    quitar: 'Quitar la última',
    escala: 'Del 0 (nunca soy yo) al 4 (soy yo casi siempre)',
    roles: {
      cerebro: 'Cerebro',
      coordinador: 'Coordinador',
      implementador: 'Implementador',
      evaluador: 'Evaluador',
      cohesionador: 'Cohesionador',
      finalizador: 'Finalizador',
    },
    descripciones: {
      cerebro: 'Se me ocurren ideas distintas cuando el grupo se atasca',
      coordinador: 'Reparto tareas, pongo orden y me aseguro de que todos hablen',
      implementador: 'Convierto lo que se decide en algo que se hace de verdad',
      evaluador: 'Veo los fallos de un plan antes de que se pongan en marcha',
      cohesionador: 'Me doy cuenta de cómo está la gente y evito que el grupo se rompa',
      finalizador: 'Reviso, cierro y no dejo cabos sueltos ni entregas a medias',
    },
    perfilesTitulo: 'Lo que sale de cada persona',
    dominante: 'Papel dominante',
    sinDominante: 'Sin papel dominante: perfil repartido, que también es información',
    coberturaTitulo: 'Cobertura del equipo',
    colRol: 'Papel',
    colQuien: 'Quién lo cubre',
    colEstado: 'Estado',
    estados: { hueco: 'Nadie', cubierto: 'Cubierto', saturado: 'Demasiada gente' },
    huecosTitulo: 'Los huecos',
    huecosTexto: 'Nadie del equipo llega al umbral en estos papeles. No significa que falte gente: significa que alguien tendrá que ocuparse aunque no sea lo suyo, y conviene decidirlo ahora y no en la última semana.',
    sinHuecos: 'Todos los papeles tienen a alguien. Eso no garantiza que el equipo funcione, pero quita la excusa más común.',
    saturadosTitulo: 'Los papeles con cola',
    saturadosTexto: 'Aquí sobra gente. Tres personas proponiendo ideas y ninguna cerrando entregas es el equipo que llega tarde a todo.',
    lecturaTitulo: 'Cómo leer esto',
    lectura: 'Los papeles no son tipos de persona: son cosas que hay que hacer. La misma persona ocupa papeles distintos en equipos distintos, y en un grupo de tres hay que cubrir seis papeles entre tres, así que todo el mundo hará más de uno. Un perfil repartido no es peor que uno marcado.',
    sinDatos: 'Revisa las puntuaciones: van del 0 al 4.',
    presets: 'Ejemplos',
    presetEquilibrado: 'Equipo equilibrado',
    presetIdeas: 'Todo ideas, nada de entregas',
  },
  ca: {
    intro: "Això no és un test de personalitat ni et classifica: és una forma de vore d'un colp d'ull quins papers cobrix el vostre equip i quins no cobrix ningú. L'interessant quasi mai no és la teua columna, sinó els buits.",
    aviso: "No és el qüestionari oficial de Belbin, que és un instrument amb llicència. Són frases de comportament pensades per a classe, amb els mateixos noms de rol que fa servir la unitat. Servixen per a parlar de qui fa què, no per a etiquetar ningú.",
    equipoTitulo: "L'equip",
    persona: 'Persona',
    anyadir: 'Afegir persona',
    quitar: "Llevar l'última",
    escala: 'Del 0 (mai no soc jo) al 4 (soc jo quasi sempre)',
    roles: {
      cerebro: 'Cervell',
      coordinador: 'Coordinador',
      implementador: 'Implementador',
      evaluador: 'Avaluador',
      cohesionador: 'Cohesionador',
      finalizador: 'Finalitzador',
    },
    descripciones: {
      cerebro: "Se m'acudixen idees diferents quan el grup s'encalla",
      coordinador: 'Repartisc tasques, pose orde i m\'assegure que tots parlen',
      implementador: 'Convertisc el que es decidix en alguna cosa que es fa de veritat',
      evaluador: "Veig les fallades d'un pla abans que es posen en marxa",
      cohesionador: "M'adone de com està la gent i evite que el grup es trenque",
      finalizador: 'Revise, tanque i no deixe caps solts ni lliuraments a mitges',
    },
    perfilesTitulo: 'El que ix de cada persona',
    dominante: 'Paper dominant',
    sinDominante: 'Sense paper dominant: perfil repartit, que també és informació',
    coberturaTitulo: "Cobertura de l'equip",
    colRol: 'Paper',
    colQuien: 'Qui el cobrix',
    colEstado: 'Estat',
    estados: { hueco: 'Ningú', cubierto: 'Cobert', saturado: 'Massa gent' },
    huecosTitulo: 'Els buits',
    huecosTexto: "Ningú de l'equip no arriba al llindar en estos papers. No vol dir que falte gent: vol dir que algú se n'haurà d'ocupar encara que no siga el seu, i convé decidir-ho ara i no l'última setmana.",
    sinHuecos: "Tots els papers tenen algú. Això no garantix que l'equip funcione, però lleva l'excusa més comuna.",
    saturadosTitulo: 'Els papers amb cua',
    saturadosTexto: "Ací sobra gent. Tres persones proposant idees i cap tancant lliuraments és l'equip que arriba tard a tot.",
    lecturaTitulo: 'Com llegir això',
    lectura: "Els papers no són tipus de persona: són coses que cal fer. La mateixa persona ocupa papers diferents en equips diferents, i en un grup de tres cal cobrir sis papers entre tres, així que tothom en farà més d'un. Un perfil repartit no és pitjor que un de marcat.",
    sinDatos: 'Revisa les puntuacions: van del 0 al 4.',
    presets: 'Exemples',
    presetEquilibrado: 'Equip equilibrat',
    presetIdeas: 'Tot idees, res de lliuraments',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;

const PRESET_EQUILIBRADO: Persona[] = [
  { nombre: 'Ada', puntuaciones: { cerebro: 4, evaluador: 3, implementador: 1, coordinador: 1, cohesionador: 2, finalizador: 1 } },
  { nombre: 'Bruno', puntuaciones: { cerebro: 1, evaluador: 2, implementador: 4, coordinador: 1, cohesionador: 1, finalizador: 3 } },
  { nombre: 'Carla', puntuaciones: { cerebro: 2, evaluador: 1, implementador: 2, coordinador: 4, cohesionador: 3, finalizador: 1 } },
];
const PRESET_IDEAS: Persona[] = [
  { nombre: 'Ada', puntuaciones: { cerebro: 4, evaluador: 1, implementador: 1, coordinador: 2, cohesionador: 2, finalizador: 0 } },
  { nombre: 'Bruno', puntuaciones: { cerebro: 4, evaluador: 2, implementador: 1, coordinador: 1, cohesionador: 1, finalizador: 0 } },
  { nombre: 'Carla', puntuaciones: { cerebro: 3, evaluador: 1, implementador: 2, coordinador: 2, cohesionador: 3, finalizador: 1 } },
];

export default function RolesEquipoCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [personas, setPersonas] = useState<Persona[]>(PRESET_EQUILIBRADO);
  const r = useMemo(() => analizar(personas), [personas]);

  const setNombre = (i: number, v: string) =>
    setPersonas((p) => p.map((x, j) => (j === i ? { ...x, nombre: v } : x)));
  const setPunt = (i: number, rol: Rol, v: number) =>
    setPersonas((p) => p.map((x, j) => (j === i ? { ...x, puntuaciones: { ...x.puntuaciones, [rol]: v } } : x)));

  return (
    <div class="calc">
      <p class="re__intro">{t.intro}</p>
      <div class="calc__tip calc__tip--info">{t.aviso}</div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setPersonas(PRESET_EQUILIBRADO)}>{t.presetEquilibrado}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setPersonas(PRESET_IDEAS)}>{t.presetIdeas}</button>
      </div>

      <div class="re__label">{t.equipoTitulo}</div>
      <p class="re__note">{t.escala}</p>
      <div class="re__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th scope="col">{t.colRol}</th>
              {personas.map((p, i) => (
                <th scope="col" key={i}>
                  <input class="re__nombre" type="text" value={p.nombre} onInput={(e) => setNombre(i, txt(e))} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((rol) => (
              <tr key={rol}>
                <th scope="row">
                  {t.roles[rol]}
                  <span class="re__desc">{t.descripciones[rol]}</span>
                </th>
                {personas.map((p, i) => (
                  <td key={i}>
                    <input type="number" min={0} max={4} step={1}
                      value={p.puntuaciones[rol] ?? 0}
                      onInput={(e) => setPunt(i, rol, num(e))} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setPersonas((p) => [...p, { nombre: `${t.persona} ${p.length + 1}`, puntuaciones: {} }])}>
          {t.anyadir}
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" disabled={personas.length <= 2}
          onClick={() => setPersonas((p) => p.slice(0, -1))}>
          {t.quitar}
        </button>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="re__label">{t.perfilesTitulo}</div>
            <ul class="re__perfiles">
              {r.personas.map((p) => (
                <li key={p.nombre}>
                  <strong>{p.nombre}</strong>{' — '}
                  {p.dominantes.length > 0
                    ? `${t.dominante}: ${p.dominantes.map((d) => t.roles[d]).join(', ')}`
                    : t.sinDominante}
                </li>
              ))}
            </ul>

            <div class="re__label">{t.coberturaTitulo}</div>
            <div class="re__scroll">
              <table class="calc__table">
                <thead>
                  <tr>
                    <th scope="col">{t.colRol}</th>
                    <th scope="col">{t.colQuien}</th>
                    <th scope="col">{t.colEstado}</th>
                  </tr>
                </thead>
                <tbody>
                  {r.cobertura.map((c) => (
                    <tr key={c.rol}>
                      <th scope="row">{t.roles[c.rol]}</th>
                      <td>{c.cubiertoPor.length > 0 ? c.cubiertoPor.join(', ') : '—'}</td>
                      <td class={c.estado === 'hueco' ? 'fail' : c.estado === 'cubierto' ? 'ok' : undefined}>
                        {t.estados[c.estado]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {r.huecos.length > 0 ? (
              <div class="calc__tip calc__tip--warn">
                <strong>{t.huecosTitulo}:</strong> {r.huecos.map((h) => t.roles[h]).join(', ')}. {t.huecosTexto}
              </div>
            ) : (
              <div class="calc__tip calc__tip--ok">{t.sinHuecos}</div>
            )}

            {r.saturados.length > 0 && (
              <div class="calc__tip calc__tip--info">
                <strong>{t.saturadosTitulo}:</strong> {r.saturados.map((s) => t.roles[s]).join(', ')}. {t.saturadosTexto}
              </div>
            )}

            <div class="calc__tip calc__tip--info">
              <strong>{t.lecturaTitulo}</strong> {t.lectura}
            </div>
          </>
        )}
      </div>

      <style>{`
        .re__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .re__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .re__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 0.6rem; }
        .re__scroll { overflow-x: auto; }
        .re__nombre { width: 100%; min-width: 5rem; }
        .re__desc {
          display: block; font-weight: 400; font-size: 0.8rem;
          color: var(--color-ink-mute, #8A7868); margin-top: 0.15rem;
        }
        .re__perfiles {
          list-style: none; margin: 0.3rem 0 0.5rem; padding: 0;
          font-family: var(--font-sans); font-size: 0.93rem; display: grid; gap: 0.35rem;
        }
      `}</style>
    </div>
  );
}
