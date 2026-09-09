/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import {
  BELLEZA_DEFAULT, NIVEL_MAX, crearBellezaState, jugarBelleza, analizarAula,
  type BellezaState,
} from '@/lib/games/teoria-juegos/belleza';
import { leerNumeros } from '@/lib/games/teoria-juegos/aula';
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { BOTONES } from './copy';
import { Barras, Datos, Nota, EntradaClase } from './ui';

const COPY = {
  es: {
    escena:
      'Números del 0 al 100. No hay azar ni trampa: todo depende de lo que creas que van a decir los demás… y de lo que creas que ellos creen que vas a decir tú.',
    tuNumero: 'Tu número (0-100)',
    objetivo: 'Objetivo (2/3 de la media)',
    mediaR: 'Media de la ronda',
    tuTirada: 'Tu número',
    ganas: '¡Ganas la ronda!',
    pierdes: 'Esta vez no',
    rondasJugadas: 'Rondas ganadas',
    numeros: 'Los números de la ronda',
    evolucion: 'Cómo se ha movido el objetivo',
    debrief:
      'El equilibrio de Nash es 0: si todo el mundo razona hasta el final, todo el mundo dice 0. Pero casi nadie lo hace en la primera ronda, porque para llegar ahí hay que suponer que los demás también han razonado hasta el final. Lo que mide este juego no es inteligencia, es cuántos pasos de «si ellos piensan eso, entonces yo…» da cada cual. Y ronda a ronda, la clase entera baja.',
    nivel: 'Nivel',
    nivel0: 'Nivel 0 · al azar (≈50)',
    nivelN: 'Nivel {n} · los demás, nivel {p}',
    aulaEtiqueta: 'Números de la clase',
    aulaPista: 'Separa con espacios, comas o saltos de línea.',
    aulaGanador: 'Gana el número',
    aulaNiveles: 'En qué escalón de razonamiento está la clase',
    aulaNota: 'Cómo usarlo',
    aulaTexto:
      'Pide los números en secreto, escríbelos aquí y proyecta el resultado. Pregunta después a quien haya dicho 0 por qué lo ha dicho, y a quien haya dicho 50 también: las dos respuestas son la clase entera de teoría de juegos.',
  },
  ca: {
    escena:
      "Números del 0 al 100. No hi ha atzar ni trampa: tot depén del que cregues que diran els altres… i del que cregues que ells creuen que diràs tu.",
    tuNumero: 'El teu número (0-100)',
    objetivo: 'Objectiu (2/3 de la mitjana)',
    mediaR: 'Mitjana de la ronda',
    tuTirada: 'El teu número',
    ganas: 'Guanyes la ronda!',
    pierdes: 'Aquesta vegada no',
    rondasJugadas: 'Rondes guanyades',
    numeros: 'Els números de la ronda',
    evolucion: "Com s'ha mogut l'objectiu",
    debrief:
      "L'equilibri de Nash és 0: si tothom raona fins al final, tothom diu 0. Però quasi ningú ho fa a la primera ronda, perquè per arribar ahí cal suposar que els altres també han raonat fins al final. El que mesura aquest joc no és intel·ligència, és quants passos de «si ells pensen això, aleshores jo…» fa cadascú. I ronda a ronda, la classe sencera baixa.",
    nivel: 'Nivell',
    nivel0: 'Nivell 0 · a l’atzar (≈50)',
    nivelN: 'Nivell {n} · els altres, nivell {p}',
    aulaEtiqueta: 'Números de la classe',
    aulaPista: 'Separa amb espais, comes o salts de línia.',
    aulaGanador: 'Guanya el número',
    aulaNiveles: 'En quin escaló de raonament està la classe',
    aulaNota: 'Com usar-ho',
    aulaTexto:
      "Demana els números en secret, escriu-los ací i projecta el resultat. Pregunta després a qui haja dit 0 per què ho ha dit, i a qui haja dit 50 també: les dues respostes són la classe sencera de teoria de jocs.",
  },
};

export default function BellezaGame({ modo }: { modo: Modo }) {
  const locale = useGameLocale();
  return modo === 'solo' ? <BellezaSolo locale={locale} /> : <BellezaAula locale={locale} />;
}

type Locale = keyof typeof COPY;

function BellezaSolo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [state, setState] = useState<BellezaState>(() => crearBellezaState());
  const [numero, setNumero] = useState(33);

  const ultima = state.historial[state.historial.length - 1];
  const ganadas = state.historial.filter((r) => r.gana).length;

  return (
    <>
      <p>{c.escena}</p>

      <Datos
        items={[
          {
            etiqueta: `${b.ronda} / ${state.config.rondas}`,
            valor: String(Math.min(state.historial.length + (state.terminado ? 0 : 1), state.config.rondas)),
          },
          { etiqueta: c.rondasJugadas, valor: `${ganadas}` },
        ]}
      />

      {!state.terminado && (
        <>
          <div class="tj-campo">
            <label for="tj-num">{c.tuNumero}</label>
            <input
              id="tj-num" type="number" min={0} max={100} value={numero}
              onInput={(e) => setNumero(parseInt((e.target as HTMLInputElement).value || '0', 10))}
            />
          </div>
          <div class="tj-acciones">
            <button
              type="button" class="tj-btn tj-btn--big"
              onClick={() => setState(jugarBelleza(state, Number.isFinite(numero) ? numero : 0))}
            >
              {b.jugar}
            </button>
          </div>
        </>
      )}

      {ultima && (
        <div class="tj-caja">
          <h3>{ultima.gana ? c.ganas : c.pierdes}</h3>
          <Datos
            items={[
              { etiqueta: c.tuTirada, valor: String(ultima.jugador) },
              { etiqueta: c.objetivo, valor: ultima.objetivo.toFixed(1) },
              {
                etiqueta: c.mediaR,
                valor: ((ultima.jugador + ultima.bots.reduce((s, n) => s + n, 0)) / (ultima.bots.length + 1)).toFixed(1),
              },
            ]}
          />
          <h3>{c.numeros}</h3>
          <Barras
            max={100}
            items={[
              { etiqueta: b.tu, valor: ultima.jugador },
              ...ultima.bots.map((n, i) => ({ etiqueta: `#${i + 1}`, valor: n, tenue: true })),
            ]}
          />
        </div>
      )}

      {state.historial.length > 1 && (
        <>
          <h3>{c.evolucion}</h3>
          <Barras
            max={100}
            items={state.historial.map((r, i) => ({
              etiqueta: `${b.ronda} ${i + 1}`,
              valor: r.objetivo,
              texto: r.objetivo.toFixed(1),
            }))}
          />
        </>
      )}

      {state.terminado && (
        <>
          <Nota titulo={b.debrief}><p>{c.debrief}</p></Nota>
          <div class="tj-acciones">
            <button type="button" class="tj-btn" onClick={() => setState(crearBellezaState())}>
              {b.reiniciar}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function BellezaAula({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [raw, setRaw] = useState('');
  const numeros = leerNumeros(raw);
  const a = analizarAula(numeros, BELLEZA_DEFAULT);

  return (
    <>
      <p>{c.escena}</p>
      <EntradaClase
        etiqueta={c.aulaEtiqueta}
        pista={c.aulaPista}
        valor={raw}
        onValor={(v) => setRaw(v)}
        onLimpiar={() => setRaw('')}
        limpiarTexto={b.limpiar}
      />

      {a.numeros.length === 0 ? (
        <p class="tj-pista">{b.sinDatos}</p>
      ) : (
        <>
          <div class="tj-caja">
            <Datos
              items={[
                { etiqueta: b.media, valor: a.media.toFixed(1) },
                { etiqueta: c.objetivo, valor: a.objetivo.toFixed(1) },
                {
                  etiqueta: c.aulaGanador,
                  valor: a.ganadores.map((i) => a.numeros[i]).join(' · ') || '—',
                },
              ]}
            />
          </div>
          <h3>{c.aulaNiveles}</h3>
          <Barras
            items={a.porNivel.map((cuenta, nivel) => ({
              etiqueta:
                nivel === 0
                  ? c.nivel0
                  : nivel === NIVEL_MAX
                    ? `${c.nivel} ${NIVEL_MAX}+`
                    : c.nivelN.replace('{n}', String(nivel)).replace('{p}', String(nivel - 1)),
              valor: cuenta,
              texto: String(cuenta),
            }))}
          />
        </>
      )}

      <Nota titulo={c.aulaNota}>
        <p>{c.aulaTexto}</p>
        <p>{c.debrief}</p>
      </Nota>
    </>
  );
}
