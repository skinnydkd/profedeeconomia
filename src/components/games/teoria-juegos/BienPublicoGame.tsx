/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import {
  BIEN_PUBLICO_DEFAULT, crearBienPublicoState, jugarBienPublico, totalJugador,
  mpcr, optimoSocial, equilibrioEgoista, analizarAula,
  type BienPublicoState,
} from '@/lib/games/teoria-juegos/bien-publico';
import { leerNumeros, media } from '@/lib/games/teoria-juegos/aula';
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { BOTONES } from './copy';
import { Barras, Datos, Nota, EntradaClase } from './ui';

const cfg = BIEN_PUBLICO_DEFAULT;

const COPY = {
  es: {
    escena:
      'Cada uno recibe {E} fichas por ronda y decide en secreto cuántas mete en el fondo común. Lo que haya en el fondo se multiplica por {m} y se reparte a partes iguales entre los {n}, aporte quien aporte.',
    regla:
      'Cada ficha que metes te devuelve {mpcr} a ti… y {m} al grupo. Ahí está la trampa: te sale mal a ti y bien a todos.',
    tuAporte: 'Aportas',
    quedas: 'te quedas',
    fichas: 'fichas',
    fondo: 'Fondo común',
    reparto: 'Reparto por cabeza',
    tuPago: 'Te llevas esta ronda',
    acumulado: 'Acumulado',
    aportaciones: 'Aportaciones de la ronda',
    mesa: 'En la mesa',
    tipos: {
      gorron: 'Gorrón', altruista: 'Altruista', condicional: 'Condicional', cansada: 'Se cansa',
    } as Record<string, string>,
    evolucion: 'Aportación media, ronda a ronda',
    optimo: 'Si todos aportaran todo',
    egoista: 'Si nadie aportara nada',
    debrief:
      'Casi todas las clases empiezan aportando bastante y acaban aportando poco. No es que se vuelvan egoístas: es que los cooperadores condicionales dejan de aportar cuando ven que otros no lo hacen. Por eso los bienes públicos reales —la sanidad, las carreteras, un parque— no se financian pidiendo el favor, sino con impuestos: no porque la gente sea mala, sino porque nadie quiere ser el único que paga.',
    aulaEtiqueta: 'Lo que ha aportado cada uno (0-{E})',
    aulaPista: 'Un número por alumno.',
    aulaMedia: 'Aportación media',
    aulaPago: 'Se lleva cada uno',
    aulaOptimo: 'Se habrían llevado aportando todo',
    aulaPerdida: 'Se ha quedado sobre la mesa',
    aulaNota: 'Cómo usarlo',
    aulaTexto:
      'Recoge las aportaciones en papel, escríbelas aquí y proyecta el resultado. La cifra que duele es la última: lo que la clase ha dejado sin ganar por no fiarse. Repítelo una segunda ronda después de dejarles hablar treinta segundos entre ellos y compara.',
  },
  ca: {
    escena:
      'Cadascú rep {E} fitxes per ronda i decideix en secret quantes fica al fons comú. El que hi haja al fons es multiplica per {m} i es reparteix a parts iguals entre els {n}, aporte qui aporte.',
    regla:
      "Cada fitxa que fiques et torna {mpcr} a tu… i {m} al grup. Ahí està la trampa: t'ix malament a tu i bé a tots.",
    tuAporte: 'Aportes',
    quedas: 'et quedes',
    fichas: 'fitxes',
    fondo: 'Fons comú',
    reparto: 'Repartiment per cap',
    tuPago: "T'endús aquesta ronda",
    acumulado: 'Acumulat',
    aportaciones: 'Aportacions de la ronda',
    mesa: 'A la taula',
    tipos: {
      gorron: 'Gorrer', altruista: 'Altruista', condicional: 'Condicional', cansada: 'Es cansa',
    } as Record<string, string>,
    evolucion: 'Aportació mitjana, ronda a ronda',
    optimo: 'Si tots aportaren tot',
    egoista: 'Si ningú aportara res',
    debrief:
      "Quasi totes les classes comencen aportant bastant i acaben aportant poc. No és que es tornen egoistes: és que els cooperadors condicionals deixen d'aportar quan veuen que altres no ho fan. Per això els béns públics reals —la sanitat, les carreteres, un parc— no es financen demanant el favor, sinó amb impostos: no perquè la gent siga roïna, sinó perquè ningú vol ser l'únic que paga.",
    aulaEtiqueta: 'El que ha aportat cadascú (0-{E})',
    aulaPista: 'Un número per alumne.',
    aulaMedia: 'Aportació mitjana',
    aulaPago: "S'endú cadascú",
    aulaOptimo: "S'haurien endut aportant-ho tot",
    aulaPerdida: "S'ha quedat damunt la taula",
    aulaNota: 'Com usar-ho',
    aulaTexto:
      "Recull les aportacions en paper, escriu-les ací i projecta el resultat. La xifra que fa mal és l'última: el que la classe ha deixat de guanyar per no fiar-se'n. Repeteix-ho una segona ronda després de deixar-los parlar trenta segons entre ells i compara.",
  },
};

export default function BienPublicoGame({ modo }: { modo: Modo }) {
  const locale = useGameLocale();
  return modo === 'solo' ? <BienPublicoSolo locale={locale} /> : <BienPublicoAula locale={locale} />;
}

type Locale = keyof typeof COPY;

const rellena = (txt: string) =>
  txt
    .replace('{E}', String(cfg.dotacion))
    .replace(/\{m\}/g, String(cfg.multiplicador))
    .replace('{n}', String(cfg.jugadores))
    .replace('{mpcr}', mpcr(cfg.multiplicador, cfg.jugadores).toFixed(1));

function BienPublicoSolo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [state, setState] = useState<BienPublicoState>(() => crearBienPublicoState());
  const [aporte, setAporte] = useState(cfg.dotacion / 2);

  const ultima = state.historial[state.historial.length - 1];
  const nombres = [b.tu, ...state.tipos.map((t) => c.tipos[t] ?? t)];

  return (
    <>
      <p>{rellena(c.escena)}</p>
      <p class="tj-pista">{rellena(c.regla)}</p>

      <Datos
        items={[
          {
            etiqueta: `${b.ronda} / ${state.config.rondas}`,
            valor: String(Math.min(state.historial.length + (state.terminado ? 0 : 1), state.config.rondas)),
          },
          { etiqueta: c.acumulado, valor: totalJugador(state).toFixed(1) },
        ]}
      />

      {!state.terminado && (
        <div class="tj-caja">
          <div class="tj-campo">
            <label for="tj-aporte">
              {c.tuAporte} {aporte} {c.fichas} · {c.quedas} {cfg.dotacion - aporte}
            </label>
            <input
              id="tj-aporte" type="range" min={0} max={cfg.dotacion} step={1} value={aporte}
              onInput={(e) => setAporte(parseInt((e.target as HTMLInputElement).value, 10))}
            />
          </div>
          <div class="tj-acciones">
            <button type="button" class="tj-btn tj-btn--big" onClick={() => setState(jugarBienPublico(state, aporte))}>
              {b.jugar}
            </button>
          </div>
        </div>
      )}

      {ultima && (
        <div class="tj-caja">
          <Datos
            items={[
              { etiqueta: c.fondo, valor: String(ultima.bote) },
              { etiqueta: c.reparto, valor: ((ultima.bote * cfg.multiplicador) / cfg.jugadores).toFixed(1) },
              { etiqueta: c.tuPago, valor: ultima.pagos[0].toFixed(1) },
            ]}
          />
          <h3>{c.aportaciones}</h3>
          <div class="tj-scroll">
            <table class="tj-tabla">
              <thead>
                <tr>
                  <th>{c.mesa}</th>
                  <th>{c.tuAporte}</th>
                  <th>{c.tuPago}</th>
                </tr>
              </thead>
              <tbody>
                {ultima.contribuciones.map((cont, i) => (
                  <tr key={i} class={i === 0 ? 'gana' : undefined}>
                    <td>{nombres[i]}</td>
                    <td>{cont}</td>
                    <td>{ultima.pagos[i].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {state.historial.length > 1 && (
        <>
          <h3>{c.evolucion}</h3>
          <Barras
            max={cfg.dotacion}
            items={state.historial.map((r, i) => ({
              etiqueta: `${b.ronda} ${i + 1}`,
              valor: media(r.contribuciones),
              texto: media(r.contribuciones).toFixed(1),
            }))}
          />
        </>
      )}

      {state.terminado && (
        <>
          <div class="tj-caja">
            <Datos
              items={[
                { etiqueta: c.acumulado, valor: totalJugador(state).toFixed(1) },
                { etiqueta: c.optimo, valor: (optimoSocial(cfg) * state.config.rondas).toFixed(0) },
                { etiqueta: c.egoista, valor: (equilibrioEgoista(cfg) * state.config.rondas).toFixed(0) },
              ]}
            />
          </div>
          <Nota titulo={b.debrief}><p>{c.debrief}</p></Nota>
          <div class="tj-acciones">
            <button type="button" class="tj-btn" onClick={() => setState(crearBienPublicoState())}>
              {b.reiniciar}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function BienPublicoAula({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [raw, setRaw] = useState('');
  const numeros = leerNumeros(raw);
  const a = analizarAula(numeros, cfg.dotacion, cfg.multiplicador);

  return (
    <>
      <p>{rellena(c.escena)}</p>
      <p class="tj-pista">{rellena(c.regla)}</p>

      <EntradaClase
        etiqueta={rellena(c.aulaEtiqueta)}
        pista={c.aulaPista}
        valor={raw}
        onValor={(v) => setRaw(v)}
        onLimpiar={() => setRaw('')}
        limpiarTexto={b.limpiar}
      />

      {a.contribuciones.length === 0 ? (
        <p class="tj-pista">{b.sinDatos}</p>
      ) : (
        <div class="tj-caja">
          <Datos
            items={[
              { etiqueta: c.aulaMedia, valor: a.media.toFixed(1) },
              { etiqueta: c.fondo, valor: String(a.bote) },
              { etiqueta: c.aulaPago, valor: a.pagoMedio.toFixed(1) },
              { etiqueta: c.aulaOptimo, valor: a.optimo.toFixed(1) },
              { etiqueta: c.aulaPerdida, valor: a.perdida.toFixed(1) },
            ]}
          />
          <Barras
            max={cfg.dotacion}
            items={a.contribuciones.map((x, i) => ({
              etiqueta: `#${i + 1}`,
              valor: x,
              texto: String(x),
              tenue: x === 0,
            }))}
          />
        </div>
      )}

      <Nota titulo={c.aulaNota}>
        <p>{c.aulaTexto}</p>
        <p>{c.debrief}</p>
      </Nota>
    </>
  );
}
