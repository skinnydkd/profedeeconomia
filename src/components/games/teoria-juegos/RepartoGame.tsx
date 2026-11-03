/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import {
  REPARTO_DEFAULT, crearRepartoState, ofertar, responder, totalJugador,
  analizarOfertas, curvaRechazo, mejorOferta,
  type RepartoState, type RepartoVariante, type Rol,
} from '@/lib/games/teoria-juegos/reparto';
import { leerNumeros, tramos } from '@/lib/games/teoria-juegos/aula';
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { BOTONES } from './copy';
import { Barras, Datos, Nota, EntradaClase } from './ui';

const COPY = {
  es: {
    escena:
      'Hay 100 € sobre la mesa. Una persona propone cómo repartirlos y la otra responde. Lo que cambia todo es si esa respuesta puede o no tumbar el reparto.',
    variante: 'Qué juego',
    ultimatum: 'Ultimátum',
    ultimatumD: 'Quien responde puede rechazar. Si rechaza, los dos se quedan sin nada.',
    dictador: 'Dictador',
    dictadorD: 'Quien responde no pinta nada: se queda con lo que le den.',
    rol: 'Tu papel',
    proponente: 'Propongo yo',
    proponenteD: 'Decides cuánto ofreces y ves qué pasa.',
    respondedor: 'Respondo yo',
    respondedorD: 'Te llegan ofertas y decides si las aceptas.',
    oferta: 'Le ofreces',
    teOfrecen: 'Te ofrecen',
    aceptar: 'Aceptar',
    rechazar: 'Rechazar',
    quedarme: 'Me quedo',
    aceptada: 'Aceptada',
    rechazada: 'Rechazada — los dos os quedáis a cero',
    rival: 'Quien responde',
    umbral: 'Su mínimo era',
    tipos: {
      calculador: 'Calculador', tolerante: 'Tolerante', orgulloso: 'Orgulloso', justiciero: 'Justiciero',
      tacano: 'Tacaño', calculista: 'Calculista', prudente: 'Prudente', igualitario: 'Igualitario',
    } as Record<string, string>,
    total: 'Te has llevado',
    historial: 'Rondas jugadas',
    debriefU:
      'La teoría dice que hay que aceptar cualquier cosa: 1 € es mejor que 0 €. En la práctica, las ofertas por debajo del 25-30 % se rechazan casi siempre, y quien propone lo sabe: por eso la oferta típica en todos los países donde se ha probado ronda el 40 %. Rechazar cuesta dinero y aun así se hace, porque castigar un reparto injusto también vale algo.',
    debriefD:
      'Aquí no hay castigo posible y aun así casi nadie ofrece 0. Comparar las dos versiones separa dos cosas que se confunden: cuánto de lo que damos es generosidad y cuánto es miedo a que nos lo tumben.',
    aulaOfertas: 'Ofertas de la clase (% para el otro)',
    aulaOfertasPista: 'Un número por alumno, de 0 a 100.',
    aulaUmbrales: 'Mínimos que aceptarían (%)',
    aulaUmbralesPista: 'Lo mismo, pero preguntando «¿por debajo de qué % rechazarías?».',
    aulaMediaOferta: 'Oferta media',
    aulaJustas: 'Ofertas del 40 % o más',
    aulaTacanas: 'Ofertas del 10 % o menos',
    aulaReparto: 'Cómo reparte la clase',
    aulaCurva: 'Qué gana quien propone, según lo que ofrezca',
    aulaMejor: 'La oferta que más renta',
    aulaRechazo: 'rechazo',
    aulaNota: 'El momento de la verdad',
    aulaTexto:
      'Con las dos listas puestas, la pantalla calcula cuál habría sido la mejor oferta contra esta clase concreta. Casi nunca es 0 y casi nunca es 50: está en el punto donde el miedo al rechazo deja de compensar la codicia.',
  },
  ca: {
    escena:
      "Hi ha 100 € damunt la taula. Una persona proposa com repartir-los i l'altra respon. El que ho canvia tot és si aquesta resposta pot o no tombar el repartiment.",
    variante: 'Quin joc',
    ultimatum: 'Ultimàtum',
    ultimatumD: 'Qui respon pot rebutjar. Si rebutja, tots dos es queden sense res.',
    dictador: 'Dictador',
    dictadorD: 'Qui respon no pinta res: es queda amb el que li donen.',
    rol: 'El teu paper',
    proponente: 'Propose jo',
    proponenteD: 'Decideixes quant ofereixes i veus què passa.',
    respondedor: 'Responc jo',
    respondedorD: "T'arriben ofertes i decideixes si les acceptes.",
    oferta: 'Li ofereixes',
    teOfrecen: "T'ofereixen",
    aceptar: 'Acceptar',
    rechazar: 'Rebutjar',
    quedarme: 'Em quede',
    aceptada: 'Acceptada',
    rechazada: 'Rebutjada — tots dos us quedeu a zero',
    rival: 'Qui respon',
    umbral: 'El seu mínim era',
    tipos: {
      calculador: 'Calculador', tolerante: 'Tolerant', orgulloso: 'Orgullós', justiciero: 'Justicier',
      tacano: 'Garrepa', calculista: 'Calculista', prudente: 'Prudent', igualitario: 'Igualitari',
    } as Record<string, string>,
    total: "T'has endut",
    historial: 'Rondes jugades',
    debriefU:
      "La teoria diu que cal acceptar qualsevol cosa: 1 € és millor que 0 €. A la pràctica, les ofertes per davall del 25-30 % es rebutgen quasi sempre, i qui proposa ho sap: per això l'oferta típica a tots els països on s'ha provat ronda el 40 %. Rebutjar costa diners i tot i així es fa, perquè castigar un repartiment injust també val alguna cosa.",
    debriefD:
      "Ací no hi ha càstig possible i tot i així quasi ningú ofereix 0. Comparar les dues versions separa dues coses que es confonen: quant del que donem és generositat i quant és por que ens ho tomben.",
    aulaOfertas: "Ofertes de la classe (% per a l'altre)",
    aulaOfertasPista: 'Un número per alumne, de 0 a 100.',
    aulaUmbrales: 'Mínims que acceptarien (%)',
    aulaUmbralesPista: 'El mateix, però preguntant «per davall de quin % rebutjaries?».',
    aulaMediaOferta: 'Oferta mitjana',
    aulaJustas: 'Ofertes del 40 % o més',
    aulaTacanas: 'Ofertes del 10 % o menys',
    aulaReparto: 'Com reparteix la classe',
    aulaCurva: 'Què guanya qui proposa, segons el que oferisca',
    aulaMejor: "L'oferta que més renda",
    aulaRechazo: 'rebuig',
    aulaNota: 'El moment de la veritat',
    aulaTexto:
      "Amb les dues llistes posades, la pantalla calcula quina hauria sigut la millor oferta contra aquesta classe concreta. Quasi mai és 0 i quasi mai és 50: està al punt on la por al rebuig deixa de compensar la cobdícia.",
  },
};

export default function RepartoGame({ modo }: { modo: Modo }) {
  const locale = useGameLocale();
  return modo === 'solo' ? <RepartoSolo locale={locale} /> : <RepartoAula locale={locale} />;
}

type Locale = keyof typeof COPY;

function RepartoSolo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [variante, setVariante] = useState<RepartoVariante>('ultimatum');
  const [rol, setRol] = useState<Rol>('proponente');
  const [state, setState] = useState<RepartoState | null>(null);
  const [oferta, setOferta] = useState(40);

  if (!state) {
    return (
      <>
        <p>{c.escena}</p>
        <h3>{c.variante}</h3>
        <div class="tj-ops">
          <button type="button" class="tj-op" aria-pressed={variante === 'ultimatum'} onClick={() => setVariante('ultimatum')}>
            {c.ultimatum}<small>{c.ultimatumD}</small>
          </button>
          <button type="button" class="tj-op" aria-pressed={variante === 'dictador'} onClick={() => setVariante('dictador')}>
            {c.dictador}<small>{c.dictadorD}</small>
          </button>
        </div>
        <h3>{c.rol}</h3>
        <div class="tj-ops">
          <button type="button" class="tj-op" aria-pressed={rol === 'proponente'} onClick={() => setRol('proponente')}>
            {c.proponente}<small>{c.proponenteD}</small>
          </button>
          <button type="button" class="tj-op" aria-pressed={rol === 'respondedor'} onClick={() => setRol('respondedor')}>
            {c.respondedor}<small>{c.respondedorD}</small>
          </button>
        </div>
        <div class="tj-acciones">
          <button
            type="button" class="tj-btn tj-btn--big"
            onClick={() => setState(crearRepartoState({ ...REPARTO_DEFAULT, variante, rol }))}
          >
            {b.empezar}
          </button>
        </div>
      </>
    );
  }

  const { config } = state;
  const ultima = state.historial[state.historial.length - 1];
  const debrief = config.variante === 'ultimatum' ? c.debriefU : c.debriefD;

  return (
    <>
      <Datos
        items={[
          {
            etiqueta: `${b.ronda} / ${config.rondas}`,
            valor: String(Math.min(state.historial.length + (state.terminado ? 0 : 1), config.rondas)),
          },
          { etiqueta: c.total, valor: `${Math.round(totalJugador(state.historial))} €` },
        ]}
      />

      {!state.terminado && config.rol === 'proponente' && (
        <div class="tj-caja">
          <div class="tj-campo">
            <label for="tj-oferta">{c.oferta}: {oferta} € · {c.quedarme} {100 - oferta} €</label>
            <input
              id="tj-oferta" type="range" min={0} max={100} step={1} value={oferta}
              onInput={(e) => setOferta(parseInt((e.target as HTMLInputElement).value, 10))}
            />
          </div>
          <div class="tj-acciones">
            <button type="button" class="tj-btn tj-btn--big" onClick={() => setState(ofertar(state, oferta))}>
              {b.jugar}
            </button>
          </div>
        </div>
      )}

      {!state.terminado && config.rol === 'respondedor' && state.pendiente && (
        <div class="tj-caja">
          <h3>{c.teOfrecen}: {Math.round((state.pendiente.ofertaPct * config.bote) / 100)} €</h3>
          <p class="tj-pista">
            {c.tipos[state.pendiente.oponente]} · {c.quedarme}{' '}
            {config.bote - Math.round((state.pendiente.ofertaPct * config.bote) / 100)} €{' '}
            {locale === 'es' ? 'para quien propone' : 'per a qui proposa'}
          </p>
          <div class="tj-acciones">
            <button type="button" class="tj-btn tj-btn--big" onClick={() => setState(responder(state, true))}>
              {c.aceptar}
            </button>
            <button
              type="button" class="tj-btn tj-btn--big tj-btn--ghost"
              disabled={config.variante === 'dictador'}
              onClick={() => setState(responder(state, false))}
            >
              {c.rechazar}
            </button>
          </div>
        </div>
      )}

      {ultima && (
        <div class="tj-caja">
          <h3>{ultima.aceptada ? c.aceptada : c.rechazada}</h3>
          <Datos
            items={[
              { etiqueta: b.tu, valor: `${Math.round(ultima.jugador)} €` },
              { etiqueta: b.rival, valor: `${Math.round(ultima.rival)} €` },
              ...(ultima.umbralPct !== null
                ? [{ etiqueta: c.umbral, valor: `${Math.round(ultima.umbralPct)} %` }]
                : []),
            ]}
          />
          <p class="tj-pista">{c.rival}: {c.tipos[ultima.oponente] ?? ultima.oponente}</p>
        </div>
      )}

      {state.historial.length > 0 && (
        <>
          <h3>{c.historial}</h3>
          <ol class="tj-log">
            {[...state.historial].reverse().map((r, i) => {
              const n = state.historial.length - i;
              return (
                <li key={n}>
                  <span class="n">{n}</span>
                  <span class="txt">
                    {r.ofertaPct} % · {c.tipos[r.oponente] ?? r.oponente} ·{' '}
                    {r.aceptada ? c.aceptada.toLowerCase() : c.rechazar.toLowerCase()}
                  </span>
                  <span class="pts">{Math.round(r.jugador)} €</span>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {state.terminado && (
        <>
          <Nota titulo={b.debrief}><p>{debrief}</p></Nota>
          <div class="tj-acciones">
            <button type="button" class="tj-btn" onClick={() => setState(null)}>{b.reiniciar}</button>
          </div>
        </>
      )}
    </>
  );
}

function RepartoAula({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const b = BOTONES[locale];
  const [rawOfertas, setRawOfertas] = useState('');
  const [rawUmbrales, setRawUmbrales] = useState('');
  const ofertas = leerNumeros(rawOfertas);
  const umbrales = leerNumeros(rawUmbrales);
  const a = analizarOfertas(ofertas);
  const curva = curvaRechazo(umbrales, 100, 10);
  const mejor = umbrales.length ? mejorOferta(curva) : null;
  const pct = (x: number) => `${Math.round(x * 100)} %`;

  return (
    <>
      <p>{c.escena}</p>

      <EntradaClase
        etiqueta={c.aulaOfertas}
        pista={c.aulaOfertasPista}
        valor={rawOfertas}
        onValor={(v) => setRawOfertas(v)}
        onLimpiar={() => setRawOfertas('')}
        limpiarTexto={b.limpiar}
      />

      {a.ofertas.length > 0 && (
        <div class="tj-caja">
          <Datos
            items={[
              { etiqueta: c.aulaMediaOferta, valor: `${a.media.toFixed(1)} %` },
              { etiqueta: c.aulaJustas, valor: pct(a.proporcionJusta) },
              { etiqueta: c.aulaTacanas, valor: pct(a.proporcionTacana) },
            ]}
          />
          <h3>{c.aulaReparto}</h3>
          <Barras
            items={tramos(a.ofertas, 100, 10).map((t) => ({
              etiqueta: `${t.etiqueta} %`,
              valor: t.cuenta,
              texto: String(t.cuenta),
            }))}
          />
        </div>
      )}

      <div class="tj-campo tj-campo--ancho">
        <label for="tj-umbrales">{c.aulaUmbrales}</label>
        <textarea
          id="tj-umbrales"
          value={rawUmbrales}
          placeholder="30 25 40 0 50 …"
          onInput={(e) => setRawUmbrales((e.target as HTMLTextAreaElement).value)}
        />
        <p class="tj-pista">
          {c.aulaUmbralesPista}{' '}
          <button type="button" class="tj-link" onClick={() => setRawUmbrales('')}>{b.limpiar}</button>
        </p>
      </div>

      {mejor && (
        <div class="tj-caja">
          <h3>{c.aulaCurva}</h3>
          <Barras
            items={curva.map((p) => ({
              etiqueta: `${p.ofertaPct} %`,
              valor: p.esperado,
              texto: `${Math.round(p.esperado)} € · ${pct(p.rechazo)} ${c.aulaRechazo}`,
              tenue: p.ofertaPct !== mejor.ofertaPct,
            }))}
          />
          <p>
            <strong>{c.aulaMejor}: {mejor.ofertaPct} %</strong> — {Math.round(mejor.esperado)} €
          </p>
        </div>
      )}

      {a.ofertas.length === 0 && umbrales.length === 0 && <p class="tj-pista">{b.sinDatos}</p>}

      <Nota titulo={c.aulaNota}>
        <p>{c.aulaTexto}</p>
        <p>{c.debriefU}</p>
      </Nota>
    </>
  );
}
