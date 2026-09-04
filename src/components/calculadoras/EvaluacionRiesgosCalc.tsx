/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { evaluar, valorarRiesgo, type Riesgo, type Probabilidad, type Consecuencia, type Nivel } from '../../lib/calc/evaluacion-riesgos';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Evaluar un riesgo es cruzar dos preguntas: qué probabilidad hay de que pase y qué gravedad tendría si pasa. Del cruce sale un nivel, y del nivel sale si se puede seguir trabajando o no.',
    listaTitulo: 'Los riesgos que has identificado',
    colRiesgo: 'Riesgo',
    colProbabilidad: 'Probabilidad',
    colConsecuencia: 'Consecuencias',
    colNivel: 'Nivel',
    colAccion: '¿Se puede seguir trabajando?',
    riesgoPlaceholder: 'Describe el riesgo, no la máquina: «caída al mismo nivel por suelo mojado»',
    probabilidades: { baja: 'Baja', media: 'Media', alta: 'Alta' },
    consecuencias: {
      'ligeramente-daninio': 'Ligeramente dañino',
      daninio: 'Dañino',
      'extremadamente-daninio': 'Extremadamente dañino',
    },
    consecuenciasAyuda: {
      'ligeramente-daninio': 'Cortes y magulladuras pequeñas, molestias, irritación de ojos',
      daninio: 'Quemaduras, fracturas menores, sordera, dermatitis, asma',
      'extremadamente-daninio': 'Amputaciones, fracturas mayores, cáncer laboral, lesiones fatales',
    },
    niveles: { trivial: 'Trivial', tolerable: 'Tolerable', moderado: 'Moderado', importante: 'Importante', intolerable: 'Intolerable' },
    acciones: {
      trivial: 'No se requiere acción específica.',
      tolerable: 'No hace falta mejorar la acción preventiva, pero conviene buscar soluciones más rentables y comprobar que la eficacia se mantiene.',
      moderado: 'Hay que reducir el riesgo, determinando las inversiones precisas y fijando un plazo. Si va asociado a consecuencias extremadamente dañinas, hay que precisar mejor la probabilidad antes de decidir.',
      importante: 'No debe comenzarse el trabajo hasta que se haya reducido el riesgo. Si se está realizando, hay que remediarlo en un tiempo inferior al de los riesgos moderados.',
      intolerable: 'No debe comenzarse ni continuarse el trabajo hasta que se reduzca el riesgo. Si no es posible reducirlo, incluso con recursos ilimitados, el trabajo tiene que quedar prohibido.',
    },
    si: 'Sí',
    no: 'No: hay que corregir antes',
    anyadir: 'Añadir riesgo',
    quitar: 'Quitar el último',
    resumenTitulo: 'El resumen',
    bloqueantesTitulo: 'Lo que para el trabajo',
    bloqueantesTexto: 'Estos riesgos no permiten empezar ni continuar hasta que se corrijan. No es una recomendación: es lo que dice la metodología, y es la diferencia entre una evaluación y una opinión.',
    sinBloqueantes: 'Ningún riesgo evaluado impide trabajar mientras se aplican las medidas. Eso no significa que no haya nada que hacer: todo lo que esté por encima de trivial exige acción.',
    matrizTitulo: 'La matriz',
    matrizAria: 'Matriz de probabilidad por consecuencias con el nivel de riesgo resultante',
    ordenTitulo: 'El orden importa',
    ordenTexto: 'Antes de valorar hay que identificar bien: un riesgo es lo que puede pasar y por qué, no la máquina. «La sierra» no es un riesgo; «corte por contacto con el disco sin resguardo» sí, y solo así se puede decidir la medida.',
    jerarquiaTitulo: 'Y antes de los equipos de protección',
    jerarquiaTexto: 'La ley pide combatir el riesgo en su origen y anteponer la protección colectiva a la individual. Dar guantes es lo último de la lista, no lo primero: antes van eliminar el peligro, sustituirlo, aislarlo con un resguardo y organizar el trabajo de otra forma.',
    fuente: 'Matriz y tabla de acción del método simplificado de evaluación de riesgos que publica el INSST para el nivel básico.',
    sinDatos: 'Revisa la tabla: cada riesgo necesita una probabilidad y unas consecuencias válidas.',
    presets: 'Ejemplos',
    presetTaller: 'Aula-taller',
  },
  ca: {
    intro: "Avaluar un risc és creuar dues preguntes: quina probabilitat hi ha que passe i quina gravetat tindria si passa. Del creuament ix un nivell, i del nivell ix si es pot continuar treballant o no.",
    listaTitulo: 'Els riscos que has identificat',
    colRiesgo: 'Risc',
    colProbabilidad: 'Probabilitat',
    colConsecuencia: 'Conseqüències',
    colNivel: 'Nivell',
    colAccion: 'Es pot continuar treballant?',
    riesgoPlaceholder: 'Descriu el risc, no la màquina: «caiguda al mateix nivell per sòl mullat»',
    probabilidades: { baja: 'Baixa', media: 'Mitjana', alta: 'Alta' },
    consecuencias: {
      'ligeramente-daninio': 'Lleugerament danyós',
      daninio: 'Danyós',
      'extremadamente-daninio': 'Extremadament danyós',
    },
    consecuenciasAyuda: {
      'ligeramente-daninio': "Talls i blaus xicotets, molèsties, irritació d'ulls",
      daninio: 'Cremades, fractures menors, sordera, dermatitis, asma',
      'extremadamente-daninio': 'Amputacions, fractures majors, càncer laboral, lesions fatals',
    },
    niveles: { trivial: 'Trivial', tolerable: 'Tolerable', moderado: 'Moderat', importante: 'Important', intolerable: 'Intolerable' },
    acciones: {
      trivial: 'No es requerix cap acció específica.',
      tolerable: "No cal millorar l'acció preventiva, però convé buscar solucions més rendibles i comprovar que l'eficàcia es manté.",
      moderado: "Cal reduir el risc, determinant les inversions necessàries i fixant un termini. Si va associat a conseqüències extremadament danyoses, cal precisar millor la probabilitat abans de decidir.",
      importante: "No s'ha de començar la faena fins que s'haja reduït el risc. Si s'està fent, cal remeiar-ho en un temps inferior al dels riscos moderats.",
      intolerable: "No s'ha de començar ni continuar la faena fins que es reduïsca el risc. Si no és possible reduir-lo, fins i tot amb recursos il·limitats, la faena ha de quedar prohibida.",
    },
    si: 'Sí',
    no: 'No: cal corregir abans',
    anyadir: 'Afegir risc',
    quitar: "Llevar l'últim",
    resumenTitulo: 'El resum',
    bloqueantesTitulo: 'El que para la faena',
    bloqueantesTexto: "Estos riscos no permeten començar ni continuar fins que es corregisquen. No és una recomanació: és el que diu la metodologia, i és la diferència entre una avaluació i una opinió.",
    sinBloqueantes: "Cap risc avaluat no impedix treballar mentres s'apliquen les mesures. Això no vol dir que no hi haja res a fer: tot el que estiga per damunt de trivial exigix acció.",
    matrizTitulo: 'La matriu',
    matrizAria: 'Matriu de probabilitat per conseqüències amb el nivell de risc resultant',
    ordenTitulo: "L'orde importa",
    ordenTexto: "Abans de valorar cal identificar bé: un risc és el que pot passar i per què, no la màquina. «La serra» no és un risc; «tall per contacte amb el disc sense resguard» sí, i només així es pot decidir la mesura.",
    jerarquiaTitulo: 'I abans dels equips de protecció',
    jerarquiaTexto: "La llei demana combatre el risc en el seu origen i anteposar la protecció col·lectiva a la individual. Donar guants és l'últim de la llista, no el primer: abans van eliminar el perill, substituir-lo, aïllar-lo amb un resguard i organitzar la faena d'una altra manera.",
    fuente: "Matriu i taula d'acció del mètode simplificat d'avaluació de riscos que publica l'INSST per al nivell bàsic.",
    sinDatos: 'Revisa la taula: cada risc necessita una probabilitat i unes conseqüències vàlides.',
    presets: 'Exemples',
    presetTaller: 'Aula-taller',
  },
} as const;

interface Props { locale?: Locale }
const sel = (e: Event) => (e.currentTarget as HTMLSelectElement).value;
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;
const PROBS: Probabilidad[] = ['baja', 'media', 'alta'];
const CONS: Consecuencia[] = ['ligeramente-daninio', 'daninio', 'extremadamente-daninio'];

const PRESET: Riesgo[] = [
  { id: 'Caída al mismo nivel por suelo mojado', probabilidad: 'media', consecuencia: 'daninio' },
  { id: 'Corte por contacto con disco sin resguardo', probabilidad: 'alta', consecuencia: 'extremadamente-daninio' },
  { id: 'Exposición a ruido continuado sin protección', probabilidad: 'alta', consecuencia: 'daninio' },
  { id: 'Molestias por iluminación insuficiente', probabilidad: 'baja', consecuencia: 'ligeramente-daninio' },
];

export default function EvaluacionRiesgosCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [riesgos, setRiesgos] = useState<Riesgo[]>(PRESET);
  const r = useMemo(() => evaluar(riesgos), [riesgos]);

  const set = (i: number, campo: keyof Riesgo, v: string) =>
    setRiesgos((p) => p.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));

  return (
    <div class="calc">
      <p class="er__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setRiesgos(PRESET)}>{t.presetTaller}</button>
      </div>

      <div class="er__label">{t.listaTitulo}</div>
      <div class="er__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th scope="col">{t.colRiesgo}</th>
              <th scope="col">{t.colProbabilidad}</th>
              <th scope="col">{t.colConsecuencia}</th>
              <th scope="col">{t.colNivel}</th>
              <th scope="col">{t.colAccion}</th>
            </tr>
          </thead>
          <tbody>
            {riesgos.map((x, i) => {
              const nivel = valorarRiesgo(x.probabilidad, x.consecuencia);
              const bloquea = nivel === 'importante' || nivel === 'intolerable';
              return (
                <tr key={i}>
                  <td><input type="text" value={x.id} placeholder={t.riesgoPlaceholder} onInput={(e) => set(i, 'id', txt(e))} /></td>
                  <td>
                    <select value={x.probabilidad} onChange={(e) => set(i, 'probabilidad', sel(e))}>
                      {PROBS.map((p) => <option value={p} key={p}>{t.probabilidades[p]}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={x.consecuencia} onChange={(e) => set(i, 'consecuencia', sel(e))}>
                      {CONS.map((c) => <option value={c} key={c}>{t.consecuencias[c]}</option>)}
                    </select>
                  </td>
                  <td class={bloquea ? 'fail' : nivel === 'trivial' ? 'ok' : undefined}>
                    {nivel ? t.niveles[nivel] : '—'}
                  </td>
                  <td class={bloquea ? 'fail' : 'ok'}>{bloquea ? t.no : t.si}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setRiesgos((p) => [...p, { id: '', probabilidad: 'baja', consecuencia: 'ligeramente-daninio' }])}>
          {t.anyadir}
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" disabled={riesgos.length <= 1}
          onClick={() => setRiesgos((p) => p.slice(0, -1))}>{t.quitar}</button>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="er__label">{t.resumenTitulo}</div>
            <ul class="er__acciones">
              {(Object.keys(t.niveles) as Nivel[]).filter((n) => r.porNivel[n] > 0).reverse().map((n) => (
                <li key={n}>
                  <strong>{t.niveles[n]} ({r.porNivel[n]})</strong> — {t.acciones[n]}
                </li>
              ))}
            </ul>

            {r.bloqueantes.length > 0 ? (
              <div class="calc__tip calc__tip--warn">
                <strong>{t.bloqueantesTitulo}:</strong>{' '}
                {r.bloqueantes.map((b) => b.id || '—').join('; ')}. {t.bloqueantesTexto}
              </div>
            ) : (
              <div class="calc__tip calc__tip--ok">{t.sinBloqueantes}</div>
            )}
          </>
        )}

        <div class="er__panel">
          <div class="er__label">{t.matrizTitulo}</div>
          <div class="er__scroll">
            <table class="calc__table" aria-label={t.matrizAria}>
              <thead>
                <tr>
                  <th scope="col"></th>
                  {CONS.map((c) => (
                    <th scope="col" key={c}>
                      {t.consecuencias[c]}
                      <span class="er__ayuda">{t.consecuenciasAyuda[c]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROBS.map((p) => (
                  <tr key={p}>
                    <th scope="row">{t.probabilidades[p]}</th>
                    {CONS.map((c) => {
                      const n = valorarRiesgo(p, c) as Nivel;
                      return <td key={c} class={n === 'intolerable' || n === 'importante' ? 'fail' : n === 'trivial' ? 'ok' : undefined}>{t.niveles[n]}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="er__note">{t.fuente}</p>
        </div>

        <div class="calc__tip calc__tip--info">
          <strong>{t.ordenTitulo}</strong> {t.ordenTexto}
        </div>
        <div class="calc__tip calc__tip--info">
          <strong>{t.jerarquiaTitulo}</strong> {t.jerarquiaTexto}
        </div>
      </div>

      <style>{`
        .er__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .er__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .er__note { font-family: var(--font-sans); font-size: 0.85rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.7rem; }
        .er__scroll { overflow-x: auto; }
        .er__ayuda {
          display: block; font-weight: 400; font-size: 0.76rem;
          color: var(--color-ink-mute, #8A7868); margin-top: 0.15rem;
        }
        .er__panel {
          margin-top: 1.4rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .er__acciones {
          list-style: none; margin: 0.3rem 0 0.8rem; padding: 0;
          font-family: var(--font-sans); font-size: 0.9rem; display: grid; gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
