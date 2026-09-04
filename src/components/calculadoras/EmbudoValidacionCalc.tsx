/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber, formatPercent } from '../../lib/calc/format';
import { analizar, type Paso } from '../../lib/calc/embudo-validacion';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    pasosTitulo: 'Los pasos de tu embudo',
    pasosAyuda: 'Escribe cuánta gente llega a cada paso, de arriba abajo. Cada paso tiene que ser menor o igual que el anterior: si crece, hay algo mal contado.',
    colPaso: 'Paso',
    colPersonas: 'Personas',
    colConversion: 'Pasan del anterior',
    colTotal: 'Sobre el total',
    colPerdidas: 'Se pierden aquí',
    anadir: 'Añadir un paso',
    quitar: 'Quitar',
    dineroTitulo: 'El dinero',
    gasto: 'Lo que has gastado en total (€)',
    ingreso: 'Lo que ganas por cada conversión (€)',
    sinDatos: 'Revisa el embudo: hacen falta al menos dos pasos, el primero con gente, y ningún paso puede tener más personas que el anterior.',
    conversiones: 'Conversiones',
    conversionGlobal: 'Conversión total',
    costePorConversion: 'Coste por conversión',
    ingresos: 'Ingresos',
    margen: 'Resultado',
    cuelloTitulo: 'Dónde está el problema',
    cuelloTexto: 'El paso más débil es',
    cuelloExplicacion: 'Ahí es donde se pierde la mayor proporción de gente, y es el único paso en el que merece la pena trabajar ahora. Mejorar un paso que ya convierte bien apenas mueve el resultado final; arreglar el peor lo mueve entero.',
    sinCuello: 'Todos los pasos convierten igual: no hay un cuello de botella claro.',
    vanidadTitulo: 'Métricas de vanidad',
    vanidadTexto: 'El número de arriba —las visitas, los seguidores, la gente que ve la publicación— sube fácil y no decide nada. Los números que deciden son los de abajo, y sobre todo el coste por conversión: si cuesta más conseguir un cliente de lo que ese cliente deja, el proyecto pierde dinero cada vez que crece.',
    sinConversiones: 'Ninguna persona llegó al final: no hay coste por conversión que calcular, solo gasto.',
    presets: 'Ejemplos',
    presetRedes: 'Proyecto vendiendo por redes',
    presetPuesto: 'Puesto en el mercadillo del centro',
    presetEncuesta: 'Validación con entrevistas',
    comoSeCalcula: 'Cómo se calcula',
    formulaConversionTitle: 'Conversión de un paso',
    formulaConversionDesc: ': personas del paso ÷ personas del paso anterior.',
    formulaGlobalTitle: 'Conversión total',
    formulaGlobalDesc: ': personas del último paso ÷ personas del primero. Es el producto de todas las conversiones intermedias.',
    formulaCosteTitle: 'Coste por conversión',
    formulaCosteDesc: ': gasto total ÷ personas que llegaron al final.',
  },
  ca: {
    pasosTitulo: 'Els passos del teu embut',
    pasosAyuda: "Escriu quanta gent arriba a cada pas, de dalt a baix. Cada pas ha de ser menor o igual que l'anterior: si creix, hi ha alguna cosa mal comptada.",
    colPaso: 'Pas',
    colPersonas: 'Persones',
    colConversion: "Passen de l'anterior",
    colTotal: 'Sobre el total',
    colPerdidas: "Se'n perden ací",
    anadir: 'Afegir un pas',
    quitar: 'Llevar',
    dineroTitulo: 'Els diners',
    gasto: 'El que has gastat en total (€)',
    ingreso: 'El que guanyes per cada conversió (€)',
    sinDatos: "Revisa l'embut: fan falta almenys dos passos, el primer amb gent, i cap pas pot tindre més persones que l'anterior.",
    conversiones: 'Conversions',
    conversionGlobal: 'Conversió total',
    costePorConversion: 'Cost per conversió',
    ingresos: 'Ingressos',
    margen: 'Resultat',
    cuelloTitulo: 'On està el problema',
    cuelloTexto: 'El pas més dèbil és',
    cuelloExplicacion: "Ahí és on es perd la major proporció de gent, i és l'únic pas en què val la pena treballar ara. Millorar un pas que ja convertix bé a penes mou el resultat final; arreglar el pitjor el mou sencer.",
    sinCuello: "Tots els passos convertixen igual: no hi ha un coll d'ampolla clar.",
    vanidadTitulo: 'Mètriques de vanitat',
    vanidadTexto: 'El número de dalt —les visites, els seguidors, la gent que veu la publicació— puja fàcil i no decidix res. Els números que decidixen són els de baix, i sobretot el cost per conversió: si costa més aconseguir un client del que eixe client deixa, el projecte perd diners cada vegada que creix.',
    sinConversiones: 'Cap persona va arribar al final: no hi ha cost per conversió a calcular, només despesa.',
    presets: 'Exemples',
    presetRedes: 'Projecte venent per xarxes',
    presetPuesto: 'Parada al mercadet del centre',
    presetEncuesta: 'Validació amb entrevistes',
    comoSeCalcula: 'Com es calcula',
    formulaConversionTitle: "Conversió d'un pas",
    formulaConversionDesc: ': persones del pas ÷ persones del pas anterior.',
    formulaGlobalTitle: 'Conversió total',
    formulaGlobalDesc: ": persones de l'últim pas ÷ persones del primer. És el producte de totes les conversions intermèdies.",
    formulaCosteTitle: 'Cost per conversió',
    formulaCosteDesc: ': despesa total ÷ persones que van arribar al final.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;
const texto = (e: Event) => (e.target as HTMLInputElement).value;

const PRESETS = {
  es: {
    redes: [
      { nombre: 'Ven la publicación', personas: 1200 },
      { nombre: 'Entran al perfil', personas: 180 },
      { nombre: 'Escriben preguntando', personas: 51 },
      { nombre: 'Compran', personas: 12 },
    ],
    puesto: [
      { nombre: 'Pasan por delante', personas: 400 },
      { nombre: 'Se paran a mirar', personas: 90 },
      { nombre: 'Preguntan el precio', personas: 34 },
      { nombre: 'Compran', personas: 21 },
    ],
    entrevistas: [
      { nombre: 'Personas contactadas', personas: 60 },
      { nombre: 'Aceptan la entrevista', personas: 24 },
      { nombre: 'Dicen tener el problema', personas: 15 },
      { nombre: 'Pagarían por resolverlo', personas: 4 },
    ],
  },
  ca: {
    redes: [
      { nombre: 'Veuen la publicació', personas: 1200 },
      { nombre: 'Entren al perfil', personas: 180 },
      { nombre: 'Escriuen preguntant', personas: 51 },
      { nombre: 'Compren', personas: 12 },
    ],
    puesto: [
      { nombre: 'Passen per davant', personas: 400 },
      { nombre: 'Es paren a mirar', personas: 90 },
      { nombre: 'Pregunten el preu', personas: 34 },
      { nombre: 'Compren', personas: 21 },
    ],
    entrevistas: [
      { nombre: 'Persones contactades', personas: 60 },
      { nombre: "Accepten l'entrevista", personas: 24 },
      { nombre: 'Diuen tindre el problema', personas: 15 },
      { nombre: 'Pagarien per resoldre-ho', personas: 4 },
    ],
  },
} as const;

/**
 * The validation funnel of a class project, with the weakest step called out.
 *
 * The final conversion is the number every project already knows; the step
 * that is losing the people is the one worth working on, and it is almost
 * never the last one.
 *
 * Eco 4ESO · Unit 10.
 */
export default function EmbudoValidacionCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const presets = PRESETS[locale];

  const [pasos, setPasos] = useState<Paso[]>(() => presets.redes.map((p) => ({ ...p })));
  const [gasto, setGasto] = useState<number>(60);
  const [ingreso, setIngreso] = useState<number>(18);

  const r = useMemo(() => analizar(pasos, gasto, ingreso), [pasos, gasto, ingreso]);

  const editar = (i: number, campo: keyof Paso, valor: string | number) => {
    setPasos((prev) => prev.map((p, j) => (j === i ? { ...p, [campo]: valor } : p)));
  };
  const anadir = () => setPasos((prev) => [...prev, { nombre: '', personas: 0 }]);
  const quitar = (i: number) => setPasos((prev) => prev.filter((_, j) => j !== i));

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setPasos(presets.redes.map((p) => ({ ...p }))); setGasto(60); setIngreso(18); }}>{t.presetRedes}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setPasos(presets.puesto.map((p) => ({ ...p }))); setGasto(45); setIngreso(6); }}>{t.presetPuesto}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setPasos(presets.entrevistas.map((p) => ({ ...p }))); setGasto(0); setIngreso(0); }}>{t.presetEncuesta}</button>
      </div>

      <div class="ev__label">{t.pasosTitulo}</div>
      <p class="ev__note">{t.pasosAyuda}</p>
      <div class="ev__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th>{t.colPaso}</th>
              <th>{t.colPersonas}</th>
              <th>{t.colConversion}</th>
              <th>{t.colTotal}</th>
              <th>{t.colPerdidas}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pasos.map((p, i) => {
              const v = r.valido ? r.pasos[i] : undefined;
              return (
                <tr key={i} class={v?.esCuelloBotella ? 'ev__cuello' : ''}>
                  <td>
                    <input class="ev__cell ev__cell--wide" type="text" value={p.nombre}
                      onInput={(e) => editar(i, 'nombre', texto(e))} />
                  </td>
                  <td>
                    <input class="ev__cell" type="number" min={0} step={10} value={p.personas}
                      onInput={(e) => editar(i, 'personas', num(e))} />
                  </td>
                  <td>{v && Number.isFinite(v.conversion) ? formatPercent(v.conversion) : '—'}</td>
                  <td>{v ? formatPercent(v.conversionTotal) : '—'}</td>
                  <td>{v && i > 0 ? formatNumber(v.perdidas, 0) : '—'}</td>
                  <td>
                    {pasos.length > 2 && (
                      <button type="button" class="calc__btn calc__btn--ghost" onClick={() => quitar(i)}>{t.quitar}</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button type="button" class="calc__btn" onClick={anadir}>{t.anadir}</button>

      <div class="ev__label">{t.dineroTitulo}</div>
      <div class="calc__form ev__row">
        <label class="calc__field">
          <span class="calc__label">{t.gasto}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={5} value={gasto} onInput={(e) => setGasto(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.ingreso}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1} value={ingreso} onInput={(e) => setIngreso(num(e))} />
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.conversiones}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.conversiones, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.conversionGlobal}</span>
                <span class="calc__metric-mini-value">{formatPercent(r.conversionGlobal, 2)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.costePorConversion}</span>
                <span class="calc__metric-mini-value">
                  {Number.isFinite(r.costePorConversion) ? formatEUR(r.costePorConversion) : '—'}
                </span>
              </div>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.ingresos}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.ingresos, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.margen}</span>
                <span class={`calc__metric-mini-value ${r.margen >= 0 ? 'ok' : 'fail'}`}>{formatEUR(r.margen, 0)}</span>
              </div>
            </div>

            {r.conversiones === 0 && <p class="ev__note">{t.sinConversiones}</p>}

            <div class="ev__panel">
              <div class="ev__label">{t.cuelloTitulo}</div>
              {r.indiceCuelloBotella >= 0 ? (
                <>
                  <p class="ev__verdict">
                    {t.cuelloTexto} <strong>{r.pasos[r.indiceCuelloBotella].nombre || `#${r.indiceCuelloBotella + 1}`}</strong>
                    {' · '}{formatPercent(r.pasos[r.indiceCuelloBotella].conversion)}
                  </p>
                  <p class="ev__note">{t.cuelloExplicacion}</p>
                </>
              ) : (
                <p class="ev__note">{t.sinCuello}</p>
              )}
            </div>

            <div class="ev__panel">
              <div class="ev__label">{t.vanidadTitulo}</div>
              <p class="ev__note">{t.vanidadTexto}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaConversionTitle}</strong>{t.formulaConversionDesc}</p>
            <p><strong>{t.formulaGlobalTitle}</strong>{t.formulaGlobalDesc}</p>
            <p><strong>{t.formulaCosteTitle}</strong>{t.formulaCosteDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .ev__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1.4rem 0 0.5rem;
        }
        .ev__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .ev__row { grid-template-columns: 1fr; } }
        .ev__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .ev__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .ev__scroll { overflow-x: auto; }
        .ev__cell {
          width: 6rem;
          padding: 0.2rem 0.35rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 3px;
          background: var(--color-bg, #FBF6EC);
          color: inherit;
        }
        .ev__cell--wide { width: 12rem; font-family: var(--font-sans); }
        .ev__cuello { background: var(--color-soft, #F8E8D0); }
        .ev__verdict {
          margin-top: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-ink, #2A1F18);
        }
      `}</style>
    </div>
  );
}
