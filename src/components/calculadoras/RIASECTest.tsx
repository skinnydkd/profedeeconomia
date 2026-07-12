/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  PREGUNTAS,
  RIASEC_ORDEN,
  ESCALA_MAX,
  evaluar,
  type RIASEC,
  type Puntuaciones,
} from '../../lib/calc/riasec';
import { type Locale } from '@/i18n/locale';

/**
 * RIASEC vocational interest test for FOPP 4ESO. All the data and scoring lives
 * in `lib/calc/riasec.ts` (pure, unit-tested); this component is only the UI:
 * it presents the 30 statements in pages, collects 1-5 ratings, and renders the
 * three-letter Holland code with the dominant types and their study/career
 * orientations, plus a hexagonal score wheel. Reuses the shared `.calc__*` /
 * `.bi__*` styles (Variant C). It is an orientation tool, not a diagnosis.
 *
 * NOTE: the 30 questionnaire statements (PREGUNTAS) and the six type
 * descriptions (TIPOS: nombre, lema, descripcion, orientaciones) live in the
 * pure lib module and are NOT translated here — they render as-is (ES fallback).
 */

/**
 * UI strings, Valencian (AVL) alongside the ES source. The RIASEC acronym and
 * the letters R/I/A/S/E/C are scoring keys and stay untouched. Guarded by
 * copy-parity.test.ts.
 */
export const COPY = {
  es: {
    escala: { 1: 'Nada', 2: 'Poco', 3: 'Algo', 4: 'Bastante', 5: 'Mucho' },
    tuCodigoHolland: 'Tu código Holland',
    estudiosQueEncajan: 'Estudios que encajan',
    profesionesEjemplo: 'Profesiones de ejemplo',
    volverHacer: 'Volver a hacer el test',
    comoInterpreta: 'Cómo se interpreta',
    interpIntro: 'El modelo RIASEC de John L. Holland describe seis tipos de intereses:',
    sufRealista: 'ealista',
    sufInvestigador: 'nvestigador',
    sufArtistico: 'rtístico',
    sufSocial: 'ocial',
    sufEmprendedor: 'mprendedor',
    sufConvencional: 'onvencional',
    interpY: ' y ',
    interpTipo: 'Nadie es de un solo tipo: tu perfil son las',
    interpTres: 'tres',
    interpPerfil:
      'letras con mayor puntuación (tu código Holland). Sirve para orientarte hacia estudios y profesiones afines,',
    interpNo: 'no',
    interpDiagnostico:
      ' es un diagnóstico cerrado. Coméntalo con tu tutor/a y con orientación del centro.',
    bloque: (actual: number, total: number, contestadas: number, preguntas: number) =>
      `Bloque ${actual} de ${total} · ${contestadas}/${preguntas} respondidas`,
    indicaPre: 'Indica cuánto te gustaría hacer cada cosa, de',
    indicaNada: 'nada',
    indicaEntre: 'a',
    indicaMucho: 'mucho',
    anterior: '← Anterior',
    verResultado: 'Ver resultado',
    siguiente: 'Siguiente →',
    respondePara: (n: number) => `Responde las ${n} afirmaciones para continuar.`,
    hexAria: 'Rueda hexagonal con tu puntuación en cada uno de los seis tipos RIASEC',
  },
  ca: {
    escala: { 1: 'Gens', 2: 'Poc', 3: 'Una mica', 4: 'Bastant', 5: 'Molt' },
    tuCodigoHolland: 'El teu codi Holland',
    estudiosQueEncajan: 'Estudis que encaixen',
    profesionesEjemplo: "Professions d'exemple",
    volverHacer: 'Tornar a fer el test',
    comoInterpreta: "Com s'interpreta",
    interpIntro: "El model RIASEC de John L. Holland descriu sis tipus d'interessos:",
    sufRealista: 'ealista',
    sufInvestigador: 'nvestigador',
    sufArtistico: 'rtístic',
    sufSocial: 'ocial',
    sufEmprendedor: 'mprenedor',
    sufConvencional: 'onvencional',
    interpY: ' i ',
    interpTipo: "Ningú és d'un sol tipus: el teu perfil són les",
    interpTres: 'tres',
    interpPerfil:
      'lletres amb més puntuació (el teu codi Holland). Servix per a orientar-te cap a estudis i professions afins,',
    interpNo: 'no',
    interpDiagnostico:
      " és un diagnòstic tancat. Comenta-ho amb el teu tutor/a i amb l'orientació del centre.",
    bloque: (actual: number, total: number, contestadas: number, preguntas: number) =>
      `Bloc ${actual} de ${total} · ${contestadas}/${preguntas} respostes`,
    indicaPre: "Indica quant t'agradaria fer cada cosa, de",
    indicaNada: 'gens',
    indicaEntre: 'a',
    indicaMucho: 'molt',
    anterior: '← Anterior',
    verResultado: 'Veure resultat',
    siguiente: 'Següent →',
    respondePara: (n: number) => `Respon les ${n} afirmacions per a continuar.`,
    hexAria: 'Roda hexagonal amb la teua puntuació en cadascun dels sis tipus RIASEC',
  },
} as const;

interface Props { locale?: Locale }

const POR_PAGINA = 5;
const TOTAL_PAGINAS = Math.ceil(PREGUNTAS.length / POR_PAGINA);

/** The 1-5 Likert scale values; labels are localized in COPY.escala. */
const ESCALA = [1, 2, 3, 4, 5] as const;

/** Brand color per dimension (Variant C accents). */
const COLOR: Record<RIASEC, string> = {
  R: '#C44E2C', // terracota
  I: '#1F6E6E', // teal
  A: '#5B3A4E', // berenjena
  S: '#D4A24C', // mostaza
  E: '#9C3A1C', // terracota profundo
  C: '#A87A2A', // mostaza profundo
};

export default function RIASECTest({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [pagina, setPagina] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const inicio = pagina * POR_PAGINA;
  const preguntasPagina = PREGUNTAS.slice(inicio, inicio + POR_PAGINA);
  const contestadas = Object.keys(respuestas).length;
  const paginaCompleta = preguntasPagina.every((p) => respuestas[p.id] !== undefined);
  const esUltima = pagina === TOTAL_PAGINAS - 1;

  const resultado = useMemo(
    () => (finalizado ? evaluar(respuestas) : null),
    [finalizado, respuestas]
  );

  function elegir(id: string, valor: number) {
    setRespuestas((prev) => ({ ...prev, [id]: valor }));
  }

  function siguiente() {
    if (esUltima) {
      setFinalizado(true);
      return;
    }
    setPagina((p) => Math.min(TOTAL_PAGINAS - 1, p + 1));
  }

  function anterior() {
    setPagina((p) => Math.max(0, p - 1));
  }

  function reiniciar() {
    setRespuestas({});
    setPagina(0);
    setFinalizado(false);
  }

  // ─── Result screen ──────────────────────────────────────────
  if (finalizado && resultado) {
    return (
      <div class="calc">
        <div class="calc__results" style="margin-top:0; padding-top:0; border-top:none;">
          <p class="calc__eyebrow" style="text-align:center;">
            {c.tuCodigoHolland}
          </p>
          <h2
            class="qp__nota"
            style="justify-content:center; letter-spacing:0.15em; font-size:3rem;"
          >
            {resultado.codigo}
          </h2>
          <p class="calc__sub" style="text-align:center; margin-top:0;">
            {resultado.tipos.map((t) => t.nombre).join(' · ')}
          </p>

          <HexWheel
            puntuaciones={resultado.puntuaciones}
            dominantes={resultado.dominantes}
            locale={locale}
          />

          <div class="bi__cards" style="margin-top:1.6rem;">
            {resultado.tipos.map((t, i) => (
              <div class="bi__card" style={`border-top:3px solid ${COLOR[t.letra]};`}>
                <div class="bi__card-rank" style={`color:${COLOR[t.letra]};`}>
                  #{i + 1} · {t.letra}
                </div>
                <h3 class="bi__card-title">{t.nombre}</h3>
                <p style="font-style:italic; color:#5C4A3D; margin:0.2rem 0 0.7rem;">{t.lema}</p>
                <p>{t.descripcion}</p>

                <p class="bi__card-section">{c.estudiosQueEncajan}</p>
                <ul class="bi__card-list">
                  {t.orientaciones.estudios.map((e) => (
                    <li>{e}</li>
                  ))}
                </ul>

                <p class="bi__card-section">{c.profesionesEjemplo}</p>
                <ul class="bi__card-list">
                  {t.orientaciones.profesiones.map((pr) => (
                    <li>{pr}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div class="bi__actions" style="margin-top:1.6rem;">
            <button type="button" class="calc__btn calc__btn--ghost" onClick={reiniciar}>
              {c.volverHacer}
            </button>
          </div>

          <details class="calc__details">
            <summary>{c.comoInterpreta}</summary>
            <div class="calc__formula">
              <p>
                {c.interpIntro}{' '}
                <strong>R</strong>{c.sufRealista}, <strong>I</strong>{c.sufInvestigador},{' '}
                <strong>A</strong>{c.sufArtistico}, <strong>S</strong>{c.sufSocial},{' '}
                <strong>E</strong>{c.sufEmprendedor}{c.interpY}<strong>C</strong>{c.sufConvencional}.{' '}
                {c.interpTipo} <em>{c.interpTres}</em> {c.interpPerfil} <em>{c.interpNo}</em>
                {c.interpDiagnostico}
              </p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  // ─── Question screen ────────────────────────────────────────
  return (
    <div class="calc">
      <div class="qp__header">
        <span class="qp__eyebrow">
          {c.bloque(pagina + 1, TOTAL_PAGINAS, contestadas, PREGUNTAS.length)}
        </span>
        <div class="qp__progress">
          {Array.from({ length: TOTAL_PAGINAS }, (_, i) => (
            <span
              key={i}
              class={['qp__dot', i === pagina ? 'is-current' : '', i < pagina ? 'is-ok' : '']
                .join(' ')
                .trim()}
            />
          ))}
        </div>
      </div>

      <p class="calc__sub" style="margin-top:0.4rem;">
        {c.indicaPre} <em>{c.indicaNada}</em> {c.indicaEntre} <em>{c.indicaMucho}</em>.
      </p>

      <div class="riasec__items">
        {preguntasPagina.map((p) => {
          const valor = respuestas[p.id];
          return (
            <div class="bi__card" key={p.id} style="padding:1rem 1.1rem;">
              <p style="margin:0 0 0.7rem; font-weight:500;">{p.texto}</p>
              <div class="riasec__scale" role="group" aria-label={p.texto}>
                {ESCALA.map((opt) => (
                  <button
                    type="button"
                    class={`bi__chip ${valor === opt ? 'is-on' : ''}`}
                    aria-pressed={valor === opt}
                    onClick={() => elegir(p.id, opt)}
                    style="flex:1; justify-content:center; text-align:center;"
                  >
                    <span style="display:block; font-weight:700;">{opt}</span>
                    <span style="display:block; font-size:0.78rem;">{c.escala[opt]}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div class="bi__actions" style="margin-top:1.3rem;">
        <button
          type="button"
          class="calc__btn calc__btn--ghost"
          onClick={anterior}
          disabled={pagina === 0}
        >
          {c.anterior}
        </button>
        <button
          type="button"
          class="bi__btn bi__btn--primary"
          onClick={siguiente}
          disabled={!paginaCompleta}
        >
          {esUltima ? c.verResultado : c.siguiente}
        </button>
      </div>
      {!paginaCompleta && (
        <p class="bi__hint" style="text-align:right;">
          {c.respondePara(preguntasPagina.length)}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hexagonal score wheel                                                      */
/* -------------------------------------------------------------------------- */

/** Min between Likert tops (5×5 = 25). Used to scale the radar polygon. */
const PUNTUACION_MAX = ESCALA_MAX * 5;

function HexWheel({
  puntuaciones,
  dominantes,
  locale,
}: {
  puntuaciones: Puntuaciones;
  dominantes: RIASEC[];
  locale: Locale;
}) {
  const c = COPY[locale];
  const cx = 200;
  const cy = 185;
  const rMax = 130;
  // Hexagon vertices: one per dimension, starting at the top, clockwise.
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const point = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const outer = RIASEC_ORDEN.map((_, i) => point(i, rMax));
  const valores = RIASEC_ORDEN.map((dim, i) => {
    const ratio = Math.max(0, Math.min(1, puntuaciones[dim] / PUNTUACION_MAX));
    return point(i, rMax * ratio);
  });

  const grid = outer.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const shape = valores.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox="0 0 400 380"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={c.hexAria}
      style="max-width:420px; width:100%; height:auto; display:block; margin:1.4rem auto 0;"
    >
      {/* Concentric reference rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          points={outer.map((p) => {
            const ix = cx + (p.x - cx) * f;
            const iy = cy + (p.y - cy) * f;
            return `${ix.toFixed(1)},${iy.toFixed(1)}`;
          }).join(' ')}
          fill="none"
          stroke="#E5D4BD"
          stroke-width="1"
        />
      ))}
      {/* Spokes */}
      {outer.map((p) => (
        <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#EFE2CB" stroke-width="1" />
      ))}
      {/* Score polygon */}
      <polygon points={shape} fill="#C44E2C22" stroke="#C44E2C" stroke-width="2.5" />
      {/* Vertices + labels */}
      {RIASEC_ORDEN.map((dim, i) => {
        const lbl = point(i, rMax + 22);
        const v = valores[i];
        const esDom = dominantes.includes(dim);
        return (
          <>
            <circle cx={v.x} cy={v.y} r={esDom ? 5 : 3.5} fill={COLOR[dim]} />
            <text
              x={lbl.x}
              y={lbl.y}
              text-anchor="middle"
              dominant-baseline="middle"
              font-family="'Fraunces', serif"
              font-size={esDom ? 22 : 18}
              font-weight={esDom ? 700 : 500}
              fill={COLOR[dim]}
            >
              {dim}
            </text>
            <text
              x={lbl.x}
              y={lbl.y + 15}
              text-anchor="middle"
              font-family="'Switzer', sans-serif"
              font-size="9.5"
              fill="#8A7868"
            >
              {puntuaciones[dim]}
            </text>
          </>
        );
      })}
    </svg>
  );
}
