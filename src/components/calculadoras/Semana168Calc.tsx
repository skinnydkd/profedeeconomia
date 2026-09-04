/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber, formatPercent } from '../../lib/calc/format';
import { repartir, HORAS_SEMANA, SUENO_RECOMENDADO, type Bloque } from '../../lib/calc/semana168';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Una semana tiene 168 horas para todo el mundo. Reparte las tuyas y mira qué sale: no es un test ni dice nada sobre ti, solo suma y divide lo que tú escribes.',
    repartoTitulo: 'Tu semana',
    sueno: 'Dormir',
    instituto: 'Clases',
    deberes: 'Deberes y estudio',
    transporte: 'Ir y volver',
    comidas: 'Comer, ducharse, vestirse',
    deporte: 'Deporte y actividad física',
    pantallas: 'Pantallas de ocio',
    familia: 'Familia y amigos, en persona',
    otras: 'Otras cosas',
    horasSemana: 'horas a la semana',
    colBloque: 'En qué',
    colHoras: 'Horas',
    colDia: 'Al día',
    colPorcentaje: 'De la semana',
    total: 'Horas repartidas',
    libres: 'Horas sin asignar',
    sobrepasada: 'Has repartido más de 168 horas: la semana no da para tanto. Algo de lo que has escrito ocurre a la vez que otra cosa, o está estimado de más.',
    sinDatos: 'Alguna de las horas no se puede leer. Escribe números de cero para arriba en todas las filas.',
    holgura: 'Las horas sin asignar no son tiempo libre garantizado: son las que se van en lo que no se ha contado. Si el número es muy grande, probablemente falte algún bloque.',
    suenoTitulo: 'El sueño',
    suenoPorNoche: 'Horas por noche',
    suenoCorto: 'Está por debajo de lo que suelen recomendar las guías de sueño para la adolescencia, que sitúan el descanso entre 8 y 10 horas por noche.',
    suenoOk: 'Está dentro del rango que suelen recomendar las guías de sueño para la adolescencia, entre 8 y 10 horas por noche.',
    suenoLargo: 'Está por encima del rango habitual de 8 a 10 horas. Puede ser normal en una semana de recuperación.',
    suenoAviso: 'Esto es una cuenta, no un diagnóstico. Si el descanso preocupa de verdad, eso se habla con la familia o con el equipo de orientación, no con una calculadora.',
    graficoTitulo: 'La semana entera, a escala',
    graficoAria: 'Barra con el reparto de las 168 horas de la semana',
    sinAsignar: 'Sin asignar',
    lecturaTitulo: 'Para qué sirve esto',
    lectura: 'Casi nadie sabe en qué se le van las horas hasta que las escribe. El ejercicio no es apuntar lo que te gustaría hacer, sino lo que hiciste la semana pasada. La diferencia entre las dos versiones es justamente la conversación que merece la pena tener.',
    presets: 'Ejemplos',
    presetTipica: 'Una semana corriente',
    presetExamenes: 'Semana de exámenes',
    presetVacia: 'Empezar de cero',
    comoSeCalcula: 'Cómo se calcula',
    formulaTotalTitle: 'Total',
    formulaTotalDesc: ': la suma de todos los bloques. Lo que sobra hasta 168 son las horas sin asignar.',
    formulaDiaTitle: 'Al día',
    formulaDiaDesc: ': horas de la semana ÷ 7.',
    formulaPorcentajeTitle: 'De la semana',
    formulaPorcentajeDesc: ': horas del bloque ÷ 168.',
  },
  ca: {
    intro: 'Una setmana té 168 hores per a tothom. Repartix les teues i mira què ix: no és un test ni diu res sobre tu, només suma i dividix el que tu escrius.',
    repartoTitulo: 'La teua setmana',
    sueno: 'Dormir',
    instituto: 'Classes',
    deberes: 'Deures i estudi',
    transporte: 'Anar i tornar',
    comidas: 'Menjar, dutxar-se, vestir-se',
    deporte: 'Esport i activitat física',
    pantallas: "Pantalles d'oci",
    familia: 'Família i amics, en persona',
    otras: 'Altres coses',
    horasSemana: 'hores a la setmana',
    colBloque: 'En què',
    colHoras: 'Hores',
    colDia: 'Al dia',
    colPorcentaje: 'De la setmana',
    total: 'Hores repartides',
    libres: 'Hores sense assignar',
    sobrepasada: "Has repartit més de 168 hores: la setmana no dona per a tant. Alguna cosa del que has escrit passa alhora que una altra, o està estimada de més.",
    sinDatos: "Alguna de les hores no es pot llegir. Escriu números de zero cap amunt en totes les files.",
    holgura: "Les hores sense assignar no són temps lliure garantit: són les que se'n van en el que no s'ha comptat. Si el número és molt gran, probablement falte algun bloc.",
    suenoTitulo: 'El son',
    suenoPorNoche: 'Hores per nit',
    suenoCorto: "Està per davall del que solen recomanar les guies de son per a l'adolescència, que situen el descans entre 8 i 10 hores per nit.",
    suenoOk: "Està dins del rang que solen recomanar les guies de son per a l'adolescència, entre 8 i 10 hores per nit.",
    suenoLargo: 'Està per damunt del rang habitual de 8 a 10 hores. Pot ser normal en una setmana de recuperació.',
    suenoAviso: "Això és un compte, no un diagnòstic. Si el descans preocupa de veritat, això es parla amb la família o amb l'equip d'orientació, no amb una calculadora.",
    graficoTitulo: 'La setmana sencera, a escala',
    graficoAria: 'Barra amb el repartiment de les 168 hores de la setmana',
    sinAsignar: 'Sense assignar',
    lecturaTitulo: 'Per a què servix això',
    lectura: "Quasi ningú sap en què se li'n van les hores fins que les escriu. L'exercici no és apuntar el que t'agradaria fer, sinó el que vas fer la setmana passada. La diferència entre les dues versions és justament la conversa que val la pena tindre.",
    presets: 'Exemples',
    presetTipica: 'Una setmana corrent',
    presetExamenes: "Setmana d'exàmens",
    presetVacia: 'Començar de zero',
    comoSeCalcula: 'Com es calcula',
    formulaTotalTitle: 'Total',
    formulaTotalDesc: ': la suma de tots els blocs. El que sobra fins a 168 són les hores sense assignar.',
    formulaDiaTitle: 'Al dia',
    formulaDiaDesc: ': hores de la setmana ÷ 7.',
    formulaPorcentajeTitle: 'De la setmana',
    formulaPorcentajeDesc: ': hores del bloc ÷ 168.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

const CLAVES = [
  'sueno', 'instituto', 'deberes', 'transporte', 'comidas',
  'deporte', 'pantallas', 'familia', 'otras',
] as const;

type Clave = typeof CLAVES[number];

/** Colours cycle through the palette tokens; no new colours are introduced. */
const COLORES = [
  '#1F6E6E', '#C44E2C', '#D4A24C', '#5B3A4E', '#8A7868',
  '#4F8C3F', '#9C3A1C', '#A87A2A', '#E5D4BD',
];

const SEMANA_TIPICA: Record<Clave, number> = {
  sueno: 56, instituto: 30, deberes: 10, transporte: 5, comidas: 14,
  deporte: 4, pantallas: 21, familia: 10, otras: 0,
};
const SEMANA_EXAMENES: Record<Clave, number> = {
  sueno: 45, instituto: 30, deberes: 28, transporte: 5, comidas: 12,
  deporte: 1, pantallas: 14, familia: 4, otras: 0,
};
const SEMANA_VACIA: Record<Clave, number> = {
  sueno: 0, instituto: 0, deberes: 0, transporte: 0, comidas: 0,
  deporte: 0, pantallas: 0, familia: 0, otras: 0,
};

/**
 * The 168-hour week: what a week actually holds, added up.
 *
 * Deliberately not a questionnaire and deliberately not scored. It adds,
 * divides, and compares the sleep block against the published range for
 * adolescence, and says in as many words that it diagnoses nothing.
 *
 * FOPP 4ESO · Unit 2.
 */
export default function Semana168Calc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [horas, setHoras] = useState<Record<Clave, number>>({ ...SEMANA_TIPICA });

  const bloques: Bloque[] = CLAVES.map((c) => ({ clave: c, horas: horas[c] }));
  const r = useMemo(() => repartir(bloques), [horas]);

  const etiqueta = (c: Clave) => t[c];

  const segmentos = r.valido
    ? r.bloques.filter((b) => b.horas > 0).map((b, i) => ({
        ...b,
        color: COLORES[CLAVES.indexOf(b.clave as Clave) % COLORES.length],
        i,
      }))
    : [];

  return (
    <div class="calc">
      <p class="s168__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setHoras({ ...SEMANA_TIPICA })}>{t.presetTipica}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setHoras({ ...SEMANA_EXAMENES })}>{t.presetExamenes}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setHoras({ ...SEMANA_VACIA })}>{t.presetVacia}</button>
      </div>

      <div class="s168__label">{t.repartoTitulo}</div>
      <div class="s168__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th>{t.colBloque}</th>
              <th>{t.colHoras}</th>
              <th>{t.colDia}</th>
              <th>{t.colPorcentaje}</th>
            </tr>
          </thead>
          <tbody>
            {CLAVES.map((c, i) => {
              const v = r.valido ? r.bloques[i] : undefined;
              return (
                <tr key={c}>
                  <td>
                    <span class="s168__dot" style={`background:${COLORES[i % COLORES.length]}`} />
                    {etiqueta(c)}
                  </td>
                  <td>
                    <input class="s168__cell" type="number" min={0} max={168} step={1} value={horas[c]}
                      onInput={(e) => setHoras((prev) => ({ ...prev, [c]: num(e) }))} />
                  </td>
                  <td>{v ? formatNumber(v.porDia, 1) : '—'}</td>
                  <td>{v ? formatPercent(v.porcentaje) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.total}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.total, 1)} / {HORAS_SEMANA}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.libres}</span>
                <span class={`calc__metric-mini-value ${r.sobrepasada ? 'fail' : ''}`}>{formatNumber(r.libres, 1)}</span>
              </div>
            </div>

            {r.sobrepasada ? (
              <div class="calc__warning">{t.sobrepasada}</div>
            ) : (
              <p class="s168__note">{t.holgura}</p>
            )}

            <div class="s168__panel">
              <div class="s168__label">{t.graficoTitulo}</div>
              <div class="s168__stack" role="img" aria-label={t.graficoAria}>
                {segmentos.map((b) => (
                  <span
                    key={b.clave}
                    class="s168__seg"
                    style={`width:${(b.horas / HORAS_SEMANA) * 100}%;background:${b.color}`}
                    title={`${etiqueta(b.clave as Clave)}: ${formatNumber(b.horas, 1)} h`}
                  />
                ))}
                {r.libres > 0 && (
                  <span class="s168__seg s168__seg--libre" style={`width:${(r.libres / HORAS_SEMANA) * 100}%`} />
                )}
              </div>
              <div class="s168__legend">
                {segmentos.map((b) => (
                  <span class="s168__key" key={b.clave}>
                    <span class="s168__dot" style={`background:${b.color}`} />
                    {etiqueta(b.clave as Clave)}
                  </span>
                ))}
                {r.libres > 0 && (
                  <span class="s168__key">
                    <span class="s168__dot s168__dot--libre" />
                    {t.sinAsignar}
                  </span>
                )}
              </div>
            </div>

            <div class="s168__panel">
              <div class="s168__label">{t.suenoTitulo}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.suenoPorNoche}</span>
                  <span class="calc__metric-mini-value">{formatNumber(r.suenoPorNoche, 1)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{SUENO_RECOMENDADO.min} – {SUENO_RECOMENDADO.max} h</span>
                  <span class={`calc__metric-mini-value ${r.lecturaSueno === 'ok' ? 'ok' : ''}`}>
                    {formatNumber(r.suenoPorNoche * 7, 0)} {t.horasSemana}
                  </span>
                </div>
              </div>
              <p class="s168__note">
                {r.lecturaSueno === 'corto' ? t.suenoCorto : r.lecturaSueno === 'largo' ? t.suenoLargo : t.suenoOk}
              </p>
              <p class="s168__note">{t.suenoAviso}</p>
            </div>

            <div class="s168__panel">
              <div class="s168__label">{t.lecturaTitulo}</div>
              <p class="s168__note">{t.lectura}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaTotalTitle}</strong>{t.formulaTotalDesc}</p>
            <p><strong>{t.formulaDiaTitle}</strong>{t.formulaDiaDesc}</p>
            <p><strong>{t.formulaPorcentajeTitle}</strong>{t.formulaPorcentajeDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .s168__intro {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin-bottom: 1rem;
        }
        .s168__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1.4rem 0 0.5rem;
        }
        .s168__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .s168__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .s168__scroll { overflow-x: auto; }
        .s168__cell {
          width: 5rem;
          padding: 0.2rem 0.35rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 3px;
          background: var(--color-bg, #FBF6EC);
          color: inherit;
        }
        .s168__stack {
          display: flex;
          width: 100%;
          height: 22px;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
          overflow: hidden;
        }
        .s168__seg { display: block; height: 100%; }
        .s168__seg--libre {
          background: repeating-linear-gradient(45deg, #EFE2CB, #EFE2CB 4px, #F8E8D0 4px, #F8E8D0 8px);
        }
        .s168__legend {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 0.9rem;
          margin-top: 0.6rem;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .s168__key { display: inline-flex; align-items: center; gap: 0.35rem; }
        .s168__dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 2px;
          margin-right: 0.35rem;
        }
        .s168__dot--libre { background: #EFE2CB; }
      `}</style>
    </div>
  );
}
