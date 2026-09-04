/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import { evaluar, type Puesto, type Cuadrante } from '../../lib/calc/karasek';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Un trabajo exigente no es lo mismo que un trabajo que enferma. Lo que marca la diferencia no es cuánto se pide, sino cuánto se puede decidir y con qué apoyo se cuenta. Describe un puesto y mira dónde cae.',
    aviso: 'Esto describe un puesto de trabajo, no a una persona. No es una prueba de salud ni puede serlo: toma unas condiciones de trabajo y dice en qué cuadrante caen.',
    entradaTitulo: 'El puesto',
    demanda: 'Exigencia',
    demandaAyuda: 'Carga de trabajo, ritmo, presión de tiempo, interrupciones',
    control: 'Margen de decisión',
    controlAyuda: 'Poder decidir el orden, el método, el ritmo y las pausas; poder usar lo que sabes',
    apoyo: 'Apoyo',
    apoyoAyuda: 'De los compañeros y, sobre todo, de quien manda cuando surge un problema',
    escala: 'Del 0 al 10',
    resultadoTitulo: 'Dónde cae este puesto',
    cuadrantes: {
      'alta-tension': 'Alta tensión',
      activo: 'Trabajo activo',
      pasivo: 'Trabajo pasivo',
      'baja-tension': 'Baja tensión',
    },
    descripciones: {
      'alta-tension': 'Se exige mucho y no se decide casi nada. Es el cuadrante que la investigación asocia con más riesgo cardiovascular y de salud mental, y no porque el trabajo sea duro: porque es duro sin margen.',
      activo: 'Se exige mucho y se puede decidir. Es exigente y puede cansar, pero es el cuadrante donde la gente aprende y crece. Un cirujano o una jefa de proyecto están aquí.',
      pasivo: 'Ni se exige ni se decide. Suena cómodo y no lo es: se pierden habilidades, la motivación cae y la vuelta a un puesto exigente se hace cuesta arriba.',
      'baja-tension': 'Poca exigencia y mucho margen. El cuadrante más tranquilo, aunque a largo plazo puede quedarse corto para quien quiere desarrollarse.',
    },
    apoyoBajoTitulo: 'Y encima, con poco apoyo',
    apoyoBajoTexto: 'El apoyo es el tercer eje del modelo y funciona como amortiguador: el mismo puesto con apoyo y sin apoyo no es el mismo puesto. Sin él, cualquier cuadrante empeora, y la alta tensión se vuelve isotensión, que es la peor combinación de las cuatro.',
    apoyoAltoTexto: 'El apoyo es alto, y eso amortigua. Un puesto exigente con gente al lado y un mando que responde se aguanta mucho mejor que el mismo puesto en solitario.',
    salidaTitulo: 'Cómo salir de la alta tensión',
    salidaControl: 'Subiendo el margen de decisión en {n} puntos',
    salidaDemanda: 'O bajando la exigencia en {n} puntos',
    salidaTexto: 'Las dos vías valen, pero no cuestan lo mismo. Bajar la carga suele exigir contratar; dar margen para ordenar tareas y decidir pausas es una medida organizativa que no cuesta dinero, y por eso es la primera que hay que mirar.',
    noAltaTension: 'Este puesto no está en alta tensión. Eso no significa que no haya nada que mejorar: mira el apoyo y, si el cuadrante es pasivo, el problema es otro y también es un problema.',
    matrizTitulo: 'Los cuatro cuadrantes',
    matrizAria: 'Cuadrantes del modelo demanda-control con la posición del puesto descrito',
    ejeDemanda: 'Exigencia',
    ejeControl: 'Margen de decisión',
    bajo: 'Bajo',
    alto: 'Alto',
    origenTitulo: 'Lo que se corrige aquí no es la persona',
    origenTexto: 'Las tres variables del modelo son condiciones del puesto: cuánto se pide, cuánto se decide y con quién se cuenta. Se cambian reorganizando el trabajo, no con una charla de gestión del estrés. La formación en afrontamiento ayuda, pero es el último eslabón, no el primero.',
    sinDatos: 'Los tres valores tienen que estar entre 0 y 10.',
    presets: 'Ejemplos',
    presetAlmacen: 'Ritmo impuesto sin margen',
    presetActivo: 'Exigente pero con margen',
    presetPasivo: 'Puesto sin contenido',
  },
  ca: {
    intro: "Una faena exigent no és el mateix que una faena que fa emmalaltir. El que marca la diferència no és quant es demana, sinó quant es pot decidir i amb quin suport es compta. Descriu un lloc i mira on cau.",
    aviso: "Això descriu un lloc de treball, no una persona. No és una prova de salut ni ho pot ser: pren unes condicions de treball i diu en quin quadrant cauen.",
    entradaTitulo: 'El lloc',
    demanda: 'Exigència',
    demandaAyuda: 'Càrrega de faena, ritme, pressió de temps, interrupcions',
    control: 'Marge de decisió',
    controlAyuda: "Poder decidir l'orde, el mètode, el ritme i les pauses; poder fer servir el que saps",
    apoyo: 'Suport',
    apoyoAyuda: 'Dels companys i, sobretot, de qui mana quan sorgix un problema',
    escala: 'Del 0 al 10',
    resultadoTitulo: 'On cau este lloc',
    cuadrantes: {
      'alta-tension': 'Alta tensió',
      activo: 'Treball actiu',
      pasivo: 'Treball passiu',
      'baja-tension': 'Baixa tensió',
    },
    descripciones: {
      'alta-tension': "S'exigix molt i no es decidix quasi res. És el quadrant que la investigació associa amb més risc cardiovascular i de salut mental, i no perquè la faena siga dura: perquè és dura sense marge.",
      activo: "S'exigix molt i es pot decidir. És exigent i pot cansar, però és el quadrant on la gent aprén i creix. Un cirurgià o una cap de projecte estan ací.",
      pasivo: "Ni s'exigix ni es decidix. Sona còmode i no ho és: es perden habilitats, la motivació cau i la tornada a un lloc exigent es fa costa amunt.",
      'baja-tension': 'Poca exigència i molt de marge. El quadrant més tranquil, encara que a llarg termini pot quedar-se curt per a qui vol desenvolupar-se.',
    },
    apoyoBajoTitulo: 'I damunt, amb poc suport',
    apoyoBajoTexto: "El suport és el tercer eix del model i funciona com a amortidor: el mateix lloc amb suport i sense suport no és el mateix lloc. Sense ell, qualsevol quadrant empitjora, i l'alta tensió es torna isotensió, que és la pitjor combinació de les quatre.",
    apoyoAltoTexto: 'El suport és alt, i això amortix. Un lloc exigent amb gent al costat i un comandament que respon s\'aguanta molt millor que el mateix lloc en solitari.',
    salidaTitulo: "Com eixir de l'alta tensió",
    salidaControl: 'Pujant el marge de decisió en {n} punts',
    salidaDemanda: "O abaixant l'exigència en {n} punts",
    salidaTexto: "Les dues vies valen, però no costen el mateix. Abaixar la càrrega sol exigir contractar; donar marge per a ordenar tasques i decidir pauses és una mesura organitzativa que no costa diners, i per això és la primera que cal mirar.",
    noAltaTension: "Este lloc no està en alta tensió. Això no vol dir que no hi haja res a millorar: mira el suport i, si el quadrant és passiu, el problema és un altre i també és un problema.",
    matrizTitulo: 'Els quatre quadrants',
    matrizAria: 'Quadrants del model demanda-control amb la posició del lloc descrit',
    ejeDemanda: 'Exigència',
    ejeControl: 'Marge de decisió',
    bajo: 'Baix',
    alto: 'Alt',
    origenTitulo: 'El que es corregix ací no és la persona',
    origenTexto: "Les tres variables del model són condicions del lloc: quant es demana, quant es decidix i amb qui es compta. Es canvien reorganitzant la faena, no amb una xarrada de gestió de l'estrés. La formació en afrontament ajuda, però és l'últim baula, no el primer.",
    sinDatos: 'Els tres valors han d\'estar entre 0 i 10.',
    presets: 'Exemples',
    presetAlmacen: 'Ritme imposat sense marge',
    presetActivo: 'Exigent però amb marge',
    presetPasivo: 'Lloc sense contingut',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);

const PRESETS: Record<string, Puesto> = {
  almacen: { demanda: 9, control: 2, apoyo: 3 },
  activo: { demanda: 8, control: 8, apoyo: 7 },
  pasivo: { demanda: 2, control: 2, apoyo: 5 },
};

export default function KarasekCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [p, setP] = useState<Puesto>(PRESETS.almacen);
  const r = useMemo(() => evaluar(p), [p]);
  const set = (k: keyof Puesto, v: number) => setP((prev) => ({ ...prev, [k]: v }));

  return (
    <div class="calc">
      <p class="ka__intro">{t.intro}</p>
      <div class="calc__tip calc__tip--info">{t.aviso}</div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setP(PRESETS.almacen)}>{t.presetAlmacen}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setP(PRESETS.activo)}>{t.presetActivo}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setP(PRESETS.pasivo)}>{t.presetPasivo}</button>
      </div>

      <div class="ka__label">{t.entradaTitulo}</div>
      <div class="calc__form">
        {(['demanda', 'control', 'apoyo'] as (keyof Puesto)[]).map((k) => (
          <label class="calc__field ka__wide" key={k}>
            <span class="calc__label">
              {t[k]} <span class="ka__ayuda">{t[`${k}Ayuda` as 'demandaAyuda']}</span>
            </span>
            <div class="ka__slider">
              <input type="range" min={0} max={10} step={1} value={p[k]} onInput={(e) => set(k, num(e))} />
              <span class="ka__valor">{p[k]}</span>
            </div>
          </label>
        ))}
      </div>
      <p class="ka__note">{t.escala}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="ka__label">{t.resultadoTitulo}</div>
            <div class={`calc__metric calc__metric--primary ${r.esAltaTension ? 'calc__metric--fail' : ''}`}>
              <span class="calc__metric-label">{t.cuadrantes[r.cuadrante]}</span>
              <span class="calc__metric-detail">{t.descripciones[r.cuadrante]}</span>
            </div>

            <div class={`calc__tip ${r.apoyoBajo ? 'calc__tip--warn' : 'calc__tip--ok'}`}>
              {r.apoyoBajo ? <><strong>{t.apoyoBajoTitulo}</strong> {t.apoyoBajoTexto}</> : t.apoyoAltoTexto}
            </div>

            <div class="ka__panel">
              <div class="ka__label">{t.matrizTitulo}</div>
              <div class="ka__matriz" role="img" aria-label={t.matrizAria}>
                {(['alta-tension', 'activo', 'pasivo', 'baja-tension'] as Cuadrante[]).map((c) => (
                  <div class={`ka__celda ${r.cuadrante === c ? 'ka__celda--activa' : ''}`} key={c}>
                    <strong>{t.cuadrantes[c]}</strong>
                  </div>
                ))}
              </div>
              <div class="ka__ejes">
                <span>{t.ejeControl}: {t.bajo} → {t.alto}</span>
                <span>{t.ejeDemanda}: {t.alto} ↑ / {t.bajo} ↓</span>
              </div>
            </div>

            {r.esAltaTension ? (
              <div class="calc__tip calc__tip--warn">
                <strong>{t.salidaTitulo}:</strong>{' '}
                {t.salidaControl.replace('{n}', formatNumber(r.controlNecesario, 1))}.{' '}
                {t.salidaDemanda.replace('{n}', formatNumber(r.reduccionDemandaNecesaria, 1))}. {t.salidaTexto}
              </div>
            ) : (
              <div class="calc__tip calc__tip--info">{t.noAltaTension}</div>
            )}

            <div class="calc__tip calc__tip--info">
              <strong>{t.origenTitulo}</strong> {t.origenTexto}
            </div>
          </>
        )}
      </div>

      <style>{`
        .ka__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .ka__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .ka__note { font-family: var(--font-sans); font-size: 0.85rem; color: var(--color-ink-mute, #8A7868); margin-top: 0.4rem; }
        .ka__wide { width: 100%; }
        .ka__ayuda { display: block; font-weight: 400; font-size: 0.8rem; color: var(--color-ink-mute, #8A7868); text-transform: none; letter-spacing: 0; }
        .ka__slider { display: flex; align-items: center; gap: 0.8rem; }
        .ka__slider input { flex: 1; }
        .ka__valor { font-family: var(--font-mono, monospace); font-size: 1rem; min-width: 1.6rem; text-align: right; }
        .ka__panel {
          margin-top: 1.2rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .ka__matriz { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
        .ka__celda {
          padding: 1.1rem 0.7rem; text-align: center;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          font-family: var(--font-sans); font-size: 0.85rem;
          background: var(--color-cream, #F5EDD9);
          color: var(--color-ink-mute, #8A7868);
        }
        .ka__celda--activa {
          background: var(--color-terracotta, #C44E2C);
          border-color: var(--color-terracotta, #C44E2C);
          color: var(--color-paper, #FFFFFF);
        }
        .ka__ejes {
          display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
          margin-top: 0.7rem;
          font-family: var(--font-sans); font-size: 0.8rem; color: var(--color-ink-mute, #8A7868);
        }
      `}</style>
    </div>
  );
}
