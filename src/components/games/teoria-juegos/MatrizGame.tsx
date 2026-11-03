/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import {
  MATRICES, BOT_IDS, payoffFor, crearMatrizState, jugarRonda, totales,
  tasaCooperacion, contrafactual, pagosPoblacion,
  type BotId, type MatrizId, type MatrizState, type Move,
} from '@/lib/games/teoria-juegos/matriz';
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { BOTONES } from './copy';
import { Barras, Datos, Nota } from './ui';

const COPY = {
  es: {
    dilema: {
      C: 'Callar', D: 'Delatar',
      escena:
        'Os han detenido a los dos. Si calláis los dos, salís con poco. Si tú delatas y el otro calla, tú te libras. Si os delatáis, os cae a los dos.',
      debrief:
        'Delatar es mejor decisión gane quien gane el otro: es una estrategia dominante. Por eso la lógica individual lleva a un resultado que los dos preferiríais evitar. Solo la repetición —y la posibilidad de devolvértela— hace que la cooperación aguante.',
    },
    cazaciervo: {
      C: 'Cazar el ciervo', D: 'Cazar la liebre',
      escena:
        'Entre los dos podéis cazar un ciervo, pero hace falta que los dos aguantéis en el puesto. Cualquiera puede irse a por una liebre: menos comida, pero segura.',
      debrief:
        'Aquí traicionar no domina: si el otro coopera, lo mejor es cooperar. Hay dos equilibrios (los dos al ciervo, los dos a la liebre) y el problema no es la codicia sino la confianza. Con una sola palabra antes de empezar, la clase entera se va al ciervo.',
    },
    bots: {
      'siempre-coopera': ['Ingenua', 'Coopera pase lo que pase.'],
      'siempre-traiciona': ['Implacable', 'Traiciona siempre, sin excepción.'],
      'tit-for-tat': ['Ojo por ojo', 'Empieza cooperando y luego copia tu última jugada.'],
      rencorosa: ['Rencorosa', 'Coopera hasta que la traicionas una vez. Ya no vuelve.'],
      perdonavidas: ['Indulgente', 'Solo se venga si la traicionas dos veces seguidas.'],
      aleatoria: ['Impredecible', 'Lanza una moneda cada ronda.'],
      sondeadora: ['Tanteadora', 'Prueba a traicionar pronto; si no la castigas, sigue.'],
    } as Record<BotId, [string, string]>,
    rival: 'Elige rival',
    rondas: 'Rondas',
    matriz: 'Puntos que te llevas tú',
    elOtro: 'El otro',
    tuJuegas: '¿Qué haces?',
    hizo: 'El rival hizo',
    coopero: 'cooperar',
    traiciono: 'traicionar',
    tuTasa: 'Cooperaste',
    suTasa: 'Cooperó',
    siempreD: 'Si hubieras traicionado siempre',
    siempreC: 'Si hubieras cooperado siempre',
    contraMismas: 'contra esas mismas jugadas del rival',
    aulaTotal: 'Alumnos que votan',
    aulaCoop: 'Cuántos eligen cooperar',
    aulaCoopPago: 'Puntos de quien coopera',
    aulaTraiPago: 'Puntos de quien traiciona',
    aulaMedia: 'Puntos medios de la clase',
    aulaNota: 'Qué mirar',
    aulaTexto:
      'Mueve el número de cooperadores y fíjate en cuál de las dos barras va por delante. Ahí está la respuesta a «¿qué me conviene a mí?», y explica por qué la clase acaba donde acaba.',
  },
  ca: {
    dilema: {
      C: 'Callar', D: 'Delatar',
      escena:
        "Us han detingut als dos. Si calleu els dos, eixiu amb poc. Si tu delates i l'altre calla, tu te'n lliures. Si us delateu, us cau als dos.",
      debrief:
        "Delatar és millor decisió faça el que faça l'altre: és una estratègia dominant. Per això la lògica individual porta a un resultat que tots dos preferiríeu evitar. Només la repetició —i la possibilitat de tornar-te-la— fa que la cooperació aguante.",
    },
    cazaciervo: {
      C: 'Caçar el cérvol', D: 'Caçar la llebre',
      escena:
        "Entre els dos podeu caçar un cérvol, però cal que tots dos aguanteu al lloc. Qualsevol pot anar-se'n a per una llebre: menys menjar, però segura.",
      debrief:
        "Ací trair no domina: si l'altre coopera, el millor és cooperar. Hi ha dos equilibris (tots dos al cérvol, tots dos a la llebre) i el problema no és la cobdícia sinó la confiança. Amb una sola paraula abans de començar, la classe sencera se'n va al cérvol.",
    },
    bots: {
      'siempre-coopera': ['Ingènua', 'Coopera passe el que passe.'],
      'siempre-traiciona': ['Implacable', 'Traeix sempre, sense excepció.'],
      'tit-for-tat': ['Ull per ull', 'Comença cooperant i després copia la teua última jugada.'],
      rencorosa: ['Rancorosa', 'Coopera fins que la traeixes una vegada. Ja no torna.'],
      perdonavidas: ['Indulgent', 'Només es venja si la traeixes dues vegades seguides.'],
      aleatoria: ['Impredictible', 'Tira una moneda cada ronda.'],
      sondeadora: ['Tantejadora', 'Prova de trair aviat; si no la castigues, continua.'],
    } as Record<BotId, [string, string]>,
    rival: 'Tria rival',
    rondas: 'Rondes',
    matriz: "Punts que t'endús tu",
    elOtro: "L'altre",
    tuJuegas: 'Què fas?',
    hizo: 'El rival va fer',
    coopero: 'cooperar',
    traiciono: 'trair',
    tuTasa: 'Vas cooperar',
    suTasa: 'Va cooperar',
    siempreD: 'Si hagueres traït sempre',
    siempreC: 'Si hagueres cooperat sempre',
    contraMismas: 'contra aquestes mateixes jugades del rival',
    aulaTotal: 'Alumnes que voten',
    aulaCoop: 'Quants trien cooperar',
    aulaCoopPago: 'Punts de qui coopera',
    aulaTraiPago: 'Punts de qui traeix',
    aulaMedia: 'Punts mitjans de la classe',
    aulaNota: 'Què mirar',
    aulaTexto:
      "Mou el nombre de cooperadors i fixa't en quina de les dues barres va per davant. Ahí està la resposta a «què em convé a mi?», i explica per què la classe acaba on acaba.",
  },
};

export default function MatrizGame({ juego, modo }: { juego: MatrizId; modo: Modo }) {
  const locale = useGameLocale();
  return modo === 'solo'
    ? <MatrizSolo juego={juego} locale={locale} />
    : <MatrizAula juego={juego} locale={locale} />;
}

type Locale = keyof typeof COPY;

function Matriz({ juego, locale }: { juego: MatrizId; locale: Locale }) {
  const c = COPY[locale];
  const g = c[juego];
  const b = BOTONES[locale];
  return (
    <div class="tj-scroll">
      <table class="tj-matriz">
        <caption class="tj-pista">{c.matriz}</caption>
        <thead>
          <tr>
            <td class="esq" />
            <th scope="col">{c.elOtro}: {g.C}</th>
            <th scope="col">{c.elOtro}: {g.D}</th>
          </tr>
        </thead>
        <tbody>
          {(['C', 'D'] as Move[]).map((mia) => (
            <tr key={mia}>
              <th scope="row">{b.tu}: {mia === 'C' ? g.C : g.D}</th>
              {(['C', 'D'] as Move[]).map((suya) => (
                <td key={suya} class="yo">{payoffFor(juego, mia, suya)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatrizSolo({ juego, locale }: { juego: MatrizId; locale: Locale }) {
  const c = COPY[locale];
  const g = c[juego];
  const b = BOTONES[locale];
  const [bot, setBot] = useState<BotId>('tit-for-tat');
  const [rondas, setRondas] = useState(10);
  const [state, setState] = useState<MatrizState | null>(null);

  if (!state) {
    return (
      <>
        <p>{g.escena}</p>
        <Matriz juego={juego} locale={locale} />
        <h3>{c.rival}</h3>
        <div class="tj-ops">
          {BOT_IDS.map((id) => (
            <button
              type="button" class="tj-op" key={id}
              aria-pressed={bot === id} onClick={() => setBot(id)}
            >
              {c.bots[id][0]}
              <small>{c.bots[id][1]}</small>
            </button>
          ))}
        </div>
        <div class="tj-campo">
          <label for="tj-rondas">{c.rondas}</label>
          <input
            id="tj-rondas" type="number" min={1} max={50} value={rondas}
            onInput={(e) => setRondas(parseInt((e.target as HTMLInputElement).value || '10', 10))}
          />
        </div>
        <div class="tj-acciones">
          <button
            type="button" class="tj-btn tj-btn--big"
            onClick={() => setState(crearMatrizState(juego, bot, Number.isFinite(rondas) ? rondas : 10))}
          >
            {b.empezar}
          </button>
        </div>
      </>
    );
  }

  const t = totales(state.historia);
  const tasas = tasaCooperacion(state.historia);
  const ronda = Math.min(state.historia.length + 1, state.rondas);

  return (
    <>
      <Datos
        items={[
          { etiqueta: `${b.ronda} / ${state.rondas}`, valor: String(state.terminado ? state.rondas : ronda) },
          { etiqueta: b.tu, valor: String(t.jugador) },
          { etiqueta: c.bots[state.bot][0], valor: String(t.bot) },
        ]}
      />
      <Matriz juego={juego} locale={locale} />

      {!state.terminado ? (
        <>
          <h3>{c.tuJuegas}</h3>
          <div class="tj-acciones">
            <button type="button" class="tj-btn tj-btn--big" onClick={() => setState(jugarRonda(state, 'C'))}>
              {g.C}
            </button>
            <button type="button" class="tj-btn tj-btn--big tj-btn--ghost" onClick={() => setState(jugarRonda(state, 'D'))}>
              {g.D}
            </button>
          </div>
        </>
      ) : (
        <div class="tj-caja">
          <h3>{b.resultado}</h3>
          <Barras
            items={[
              { etiqueta: b.tu, valor: t.jugador },
              { etiqueta: c.bots[state.bot][0], valor: t.bot, tenue: true },
            ]}
          />
          <p>
            {c.tuTasa} <strong>{Math.round(tasas.jugador * 100)}%</strong> · {c.suTasa}{' '}
            <strong>{Math.round(tasas.bot * 100)}%</strong>
          </p>
          <p class="tj-pista">
            {c.siempreD}: <strong>{contrafactual(state, 'D')}</strong> · {c.siempreC}:{' '}
            <strong>{contrafactual(state, 'C')}</strong> — {c.contraMismas}.
          </p>
          <div class="tj-acciones">
            <button type="button" class="tj-btn" onClick={() => setState(null)}>{b.reiniciar}</button>
          </div>
        </div>
      )}

      {state.historia.length > 0 && (
        <ol class="tj-log">
          {[...state.historia].reverse().map((r, i) => {
            const n = state.historia.length - i;
            return (
              <li key={n}>
                <span class="n">{n}</span>
                <span class="txt">
                  {b.tu}: {r.jugador === 'C' ? g.C : g.D} · {c.hizo}{' '}
                  {r.bot === 'C' ? c.coopero : c.traiciono}
                </span>
                <span class="pts">+{r.puntosJugador}</span>
              </li>
            );
          })}
        </ol>
      )}

      {state.terminado && <Nota titulo={b.debrief}><p>{g.debrief}</p></Nota>}
    </>
  );
}

function MatrizAula({ juego, locale }: { juego: MatrizId; locale: Locale }) {
  const c = COPY[locale];
  const g = c[juego];
  const b = BOTONES[locale];
  const [total, setTotal] = useState(24);
  const [coop, setCoop] = useState(12);
  const cooperadores = Math.max(0, Math.min(total, coop));
  const p = pagosPoblacion(juego, cooperadores, total);
  const uno = (n: number) => n.toFixed(1);

  return (
    <>
      <p>{g.escena}</p>
      <Matriz juego={juego} locale={locale} />

      <div class="tj-campo">
        <label for="tj-total">{c.aulaTotal}</label>
        <input
          id="tj-total" type="number" min={2} max={60} value={total}
          onInput={(e) => setTotal(Math.max(2, parseInt((e.target as HTMLInputElement).value || '24', 10) || 2))}
        />
      </div>
      <div class="tj-campo">
        <label for="tj-coop">{c.aulaCoop}: {cooperadores} / {total}</label>
        <input
          id="tj-coop" type="range" min={0} max={total} value={cooperadores}
          onInput={(e) => setCoop(parseInt((e.target as HTMLInputElement).value, 10))}
        />
      </div>

      <div class="tj-caja">
        <Barras
          items={[
            { etiqueta: g.C, valor: p.cooperar, texto: uno(p.cooperar) },
            { etiqueta: g.D, valor: p.traicionar, texto: uno(p.traicionar), tenue: true },
          ]}
          max={Math.max(MATRICES[juego].DC, MATRICES[juego].CC)}
        />
        <Datos
          items={[
            { etiqueta: c.aulaCoopPago, valor: uno(p.cooperar) },
            { etiqueta: c.aulaTraiPago, valor: uno(p.traicionar) },
            { etiqueta: c.aulaMedia, valor: uno(p.media) },
          ]}
        />
      </div>

      <Nota titulo={c.aulaNota}>
        <p>{c.aulaTexto}</p>
        <p>{g.debrief}</p>
      </Nota>
      <p class="tj-pista">{b.clase}</p>
    </>
  );
}
