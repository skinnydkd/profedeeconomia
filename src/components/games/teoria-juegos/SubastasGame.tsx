/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import {
  FORMATOS, crearSubastaState, pujar, formatoDeRonda,
  excedenteTotal, ingresoPorFormato, compararFormatos, pagaSegundoPrecio,
  type SubastaState,
} from '@/lib/games/teoria-juegos/subastas';
import { leerNumeros } from '@/lib/games/teoria-juegos/aula';
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { BOTONES } from './copy';
import { Barras, Datos, Nota, EntradaClase } from './ui';

const COPY = {
  es: {
    escena:
      'Sale un lote a subasta y solo tú sabes lo que vale para ti. Cada ronda cambia el reglamento: en unos pagas lo que pujas, en otros pagas lo que pujó el segundo.',
    formatos: {
      inglesa: ['Inglesa', 'Sube el precio hasta que solo queda uno. Acaba donde se rinde el penúltimo.'],
      holandesa: ['Holandesa', 'El precio baja hasta que alguien lo para. Quien para, paga ese precio.'],
      'sobre-1': ['Sobre cerrado, primer precio', 'Todos pujan a la vez en secreto. Gana la más alta y paga lo suyo.'],
      'sobre-2': ['Sobre cerrado, segundo precio', 'Igual, pero quien gana paga la puja del segundo.'],
    } as Record<string, [string, string]>,
    pagas: 'Pagas',
    tuPuja: 'Tu puja',
    tuValor: 'Vale para ti',
    reglamento: 'Reglamento de esta ronda',
    precio: 'Precio final',
    ganaste: 'Te lo llevas',
    perdiste: 'Se lo lleva otro',
    excedente: 'Ganancia de esta ronda',
    acumulado: 'Ganancia acumulada',
    tuyo: 'lo que pujas tú',
    segundo: 'la puja del segundo',
    postores: 'Las pujas',
    recaudacion: 'Recaudación media por formato',
    debrief:
      'Cuando pagas la puja del segundo, decir la verdad es lo mejor que puedes hacer: subir tu puja no baja el precio, solo te arriesga a pagar más de lo que vale. Cuando pagas la tuya, conviene pujar por debajo del valor, y cuanta menos competencia haya, más por debajo. Lo llamativo es el final: con pujas bien calculadas, los cuatro formatos recaudan casi lo mismo. Es el teorema de equivalencia de ingresos, y tienes tus propias rondas para comprobarlo.',
    aulaEtiqueta: 'Las pujas de la clase',
    aulaPista: 'Un número por alumno o por grupo.',
    aulaTabla: 'La misma subasta con los cuatro reglamentos',
    aulaGanador: 'Puja ganadora',
    aulaDesierta: 'Desierta',
    aulaNota: 'Lo que se ve aquí',
    aulaTexto:
      'Con las mismas pujas encima de la mesa, el ganador no cambia nunca: cambia lo que paga. Pregunta después quién habría pujado distinto sabiendo el reglamento de antemano — esa es la respuesta que buscamos.',
  },
  ca: {
    escena:
      'Ix un lot a subhasta i només tu saps el que val per a tu. Cada ronda canvia el reglament: en uns pagues el que puges, en altres pagues el que va pujar el segon.',
    formatos: {
      inglesa: ['Anglesa', "Puja el preu fins que només en queda un. Acaba on es rendeix el penúltim."],
      holandesa: ['Holandesa', 'El preu baixa fins que algú el para. Qui para, paga aquest preu.'],
      'sobre-1': ['Sobre tancat, primer preu', 'Tots pugen alhora en secret. Guanya la més alta i paga el seu.'],
      'sobre-2': ['Sobre tancat, segon preu', 'Igual, però qui guanya paga la puja del segon.'],
    } as Record<string, [string, string]>,
    pagas: 'Pagues',
    tuPuja: 'La teua puja',
    tuValor: 'Val per a tu',
    reglamento: "Reglament d'aquesta ronda",
    precio: 'Preu final',
    ganaste: "Te l'endús",
    perdiste: "Se l'endú un altre",
    excedente: "Guany d'aquesta ronda",
    acumulado: 'Guany acumulat',
    tuyo: 'el que puges tu',
    segundo: 'la puja del segon',
    postores: 'Les pujes',
    recaudacion: 'Recaptació mitjana per format',
    debrief:
      "Quan pagues la puja del segon, dir la veritat és el millor que pots fer: pujar la teua puja no baixa el preu, només t'arrisca a pagar més del que val. Quan pagues la teua, convé pujar per davall del valor, i com menys competència hi haja, més per davall. El cridaner és el final: amb pujes ben calculades, els quatre formats recapten quasi el mateix. És el teorema d'equivalència d'ingressos, i tens les teues pròpies rondes per a comprovar-ho.",
    aulaEtiqueta: 'Les pujes de la classe',
    aulaPista: 'Un número per alumne o per grup.',
    aulaTabla: 'La mateixa subhasta amb els quatre reglaments',
    aulaGanador: 'Puja guanyadora',
    aulaDesierta: 'Deserta',
    aulaNota: 'El que es veu ací',
    aulaTexto:
      "Amb les mateixes pujes damunt la taula, el guanyador no canvia mai: canvia el que paga. Pregunta després qui hauria pujat diferent sabent el reglament per endavant — eixa és la resposta que busquem.",
  },
};

export default function SubastasGame({ modo }: { modo: Modo }) {
  const locale = useGameLocale();
  return modo === 'solo' ? <SubastasSolo locale={locale} /> : <SubastasAula locale={locale} />;
}

type Locale = keyof typeof COPY;

function SubastasSolo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [state, setState] = useState<SubastaState>(() => crearSubastaState());
  const [puja, setPuja] = useState(0);

  const ronda = state.historial.length + 1;
  const formato = formatoDeRonda(state.config, ronda);
  const ultima = state.historial[state.historial.length - 1];
  const ingresos = ingresoPorFormato(state);

  return (
    <>
      <p>{c.escena}</p>

      <Datos
        items={[
          {
            etiqueta: `${b.ronda} / ${state.config.rondas}`,
            valor: String(Math.min(ronda, state.config.rondas)),
          },
          { etiqueta: c.acumulado, valor: `${excedenteTotal(state)} €` },
        ]}
      />

      {!state.terminado && (
        <div class="tj-caja">
          <h3>{c.reglamento}: {c.formatos[formato][0]}</h3>
          <p class="tj-pista">
            {c.formatos[formato][1]} — {c.pagas}: {pagaSegundoPrecio(formato) ? c.segundo : c.tuyo}.
          </p>
          <Datos items={[{ etiqueta: c.tuValor, valor: `${state.valorActual} €` }]} />
          <div class="tj-campo">
            <label for="tj-puja">{c.tuPuja}: {puja} €</label>
            <input
              id="tj-puja" type="range" min={0} max={state.config.valorMax} step={1} value={puja}
              onInput={(e) => setPuja(parseInt((e.target as HTMLInputElement).value, 10))}
            />
          </div>
          <div class="tj-acciones">
            <button type="button" class="tj-btn tj-btn--big" onClick={() => setState(pujar(state, puja))}>
              {b.jugar}
            </button>
          </div>
        </div>
      )}

      {ultima && (
        <div class="tj-caja">
          <h3>{ultima.ganaJugador ? c.ganaste : c.perdiste}</h3>
          <Datos
            items={[
              { etiqueta: c.reglamento, valor: c.formatos[ultima.formato][0] },
              { etiqueta: c.precio, valor: `${ultima.precio} €` },
              { etiqueta: c.excedente, valor: `${ultima.excedenteJugador} €` },
            ]}
          />
          <h3>{c.postores}</h3>
          <div class="tj-scroll">
            <table class="tj-tabla">
              <thead>
                <tr><th>{c.postores}</th><th>{c.tuValor}</th><th>{c.tuPuja}</th></tr>
              </thead>
              <tbody>
                {ultima.postores.map((p, i) => (
                  <tr key={i} class={i === ultima.ganador ? 'gana' : undefined}>
                    <td>{i === 0 ? b.tu : `#${i}`}</td>
                    <td>{p.valor}</td>
                    <td>{p.puja}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ingresos.length > 1 && (
        <>
          <h3>{c.recaudacion}</h3>
          <Barras
            items={ingresos.map((i) => ({
              etiqueta: c.formatos[i.formato][0],
              valor: i.ingresoMedio,
              texto: `${i.ingresoMedio.toFixed(1)} €`,
            }))}
          />
        </>
      )}

      {state.terminado && (
        <>
          <Nota titulo={b.debrief}><p>{c.debrief}</p></Nota>
          <div class="tj-acciones">
            <button type="button" class="tj-btn" onClick={() => setState(crearSubastaState())}>
              {b.reiniciar}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function SubastasAula({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [raw, setRaw] = useState('');
  const pujas = leerNumeros(raw);
  const comparativa = compararFormatos(pujas);

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

      {pujas.length === 0 ? (
        <p class="tj-pista">{b.sinDatos}</p>
      ) : (
        <div class="tj-caja">
          <h3>{c.aulaTabla}</h3>
          <div class="tj-scroll">
            <table class="tj-tabla">
              <thead>
                <tr><th>{c.reglamento}</th><th>{c.aulaGanador}</th><th>{c.precio}</th></tr>
              </thead>
              <tbody>
                {comparativa.map((f) => (
                  <tr key={f.formato}>
                    <td>{c.formatos[f.formato][0]}</td>
                    <td>{f.ganador < 0 ? c.aulaDesierta : `#${f.ganador + 1} · ${pujas[f.ganador]} €`}</td>
                    <td>{f.ganador < 0 ? '—' : `${f.precio} €`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div class="tj-caja">
        <h3>{c.reglamento}</h3>
        <ul class="tj-log">
          {FORMATOS.map((f) => (
            <li key={f}>
              <span class="txt"><strong>{c.formatos[f][0]}.</strong> {c.formatos[f][1]}</span>
            </li>
          ))}
        </ul>
      </div>

      <Nota titulo={c.aulaNota}>
        <p>{c.aulaTexto}</p>
        <p>{c.debrief}</p>
      </Nota>
    </>
  );
}
