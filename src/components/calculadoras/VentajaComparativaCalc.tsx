/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import { analizar, intercambio, type Paises } from '../../lib/calc/ventaja-comparativa';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Country and good names
 * are user input, so they are only seeded from here.
 */
export const COPY = {
  es: {
    datosTitulo: 'Producción máxima de cada país',
    paisA: 'Nombre del país A',
    paisB: 'Nombre del país B',
    bien1: 'Nombre del bien 1',
    bien2: 'Nombre del bien 2',
    defaultPaisA: 'España',
    defaultPaisB: 'Portugal',
    defaultBien1: 'Aceite',
    defaultBien2: 'Tela',
    maxDe: 'Máximo de',
    sinDatos: 'Los cuatro máximos tienen que ser mayores que cero.',
    costesTitulo: 'Costes de oportunidad',
    colPais: 'País',
    colCoste1: 'Una unidad del bien 1 cuesta',
    colCoste2: 'Una unidad del bien 2 cuesta',
    absolutaTitulo: 'Ventaja absoluta',
    comparativaTitulo: 'Ventaja comparativa',
    empate: 'Ninguno: empatan',
    sinComparativa: 'Los dos países tienen los mismos costes de oportunidad, así que no hay ventaja comparativa y el comercio no genera ninguna ganancia. El tamaño no cuenta: lo que cuenta es el coste relativo.',
    absolutaAmbos: 'produce más de los dos bienes. Aun así, no se queda con los dos: quien manda es el coste relativo.',
    especializacionTitulo: 'Si cada uno se especializa del todo',
    produceMundo: 'El mundo produce',
    rangoTitulo: 'Relación de intercambio',
    rangoTexto: 'Para que el intercambio interese a los dos, una unidad del bien 1 tiene que valer entre',
    rangoY: 'y',
    rangoUnidades: 'unidades del bien 2.',
    rangoPorque: 'Por debajo del límite inferior, el país que exporta el bien 1 preferiría producir él mismo el bien 2. Por encima del superior, el que lo importa preferiría producirlo él. La teoría delimita el rango, pero no dice en qué punto del rango se cierra el trato: eso es negociación.',
    intercambioTitulo: 'Comprobar un intercambio concreto',
    unidadesBien1: 'Unidades del bien 1 que se intercambian',
    unidadesBien2: 'Unidades del bien 2 que se intercambian',
    relacion: 'Relación de intercambio',
    dentro: 'Dentro del rango: los dos ganan',
    fuera: 'Fuera del rango: uno de los dos pierde',
    ganancia: 'Ganancia (en unidades del bien 2)',
    consumo: 'Consumo final',
    intercambioInvalido: 'Ningún país puede exportar más de lo que produce especializándose del todo. Baja alguna de las dos cantidades.',
    exporta: 'exporta el bien 1',
    graficoTitulo: 'Las dos fronteras y el consumo con comercio',
    graficoPie: 'El punto de consumo queda fuera de la frontera de cada país: eso es exactamente lo que aporta el comercio, consumir más de lo que se puede producir.',
    chartAria: 'Frontera de posibilidades de producción del país con su punto de consumo tras el intercambio',
    presets: 'Ejemplos',
    presetRicardo: 'El clásico de Ricardo',
    presetEmpate: 'Mismos costes relativos',
    presetGigante: 'País grande y país pequeño',
    comoSeCalcula: 'Cómo se calcula',
    formulaCosteTitle: 'Coste de oportunidad',
    formulaCosteDesc: ' de una unidad del bien 1: máximo del bien 2 ÷ máximo del bien 1. El del bien 2 es su inverso.',
    formulaAbsTitle: 'Ventaja absoluta',
    formulaAbsDesc: ': produce más en términos absolutos. No decide quién se especializa.',
    formulaCompTitle: 'Ventaja comparativa',
    formulaCompDesc: ': renuncia a menos del otro bien. Como los costes son inversos, cada país tiene la suya en un bien distinto.',
    formulaGananciaTitle: 'Ganancia del intercambio',
    formulaGananciaDesc: ': lo que recibe menos lo que habría podido producir por su cuenta con los recursos que libera.',
  },
  ca: {
    datosTitulo: 'Producció màxima de cada país',
    paisA: 'Nom del país A',
    paisB: 'Nom del país B',
    bien1: 'Nom del bé 1',
    bien2: 'Nom del bé 2',
    defaultPaisA: 'Espanya',
    defaultPaisB: 'Portugal',
    defaultBien1: 'Oli',
    defaultBien2: 'Tela',
    maxDe: 'Màxim de',
    sinDatos: 'Els quatre màxims han de ser majors que zero.',
    costesTitulo: "Costos d'oportunitat",
    colPais: 'País',
    colCoste1: 'Una unitat del bé 1 costa',
    colCoste2: 'Una unitat del bé 2 costa',
    absolutaTitulo: 'Avantatge absolut',
    comparativaTitulo: 'Avantatge comparatiu',
    empate: 'Cap: empaten',
    sinComparativa: "Els dos països tenen els mateixos costos d'oportunitat, així que no hi ha avantatge comparatiu i el comerç no genera cap guany. La grandària no compta: el que compta és el cost relatiu.",
    absolutaAmbos: 'produïx més dels dos béns. Tot i això, no es queda amb els dos: qui mana és el cost relatiu.',
    especializacionTitulo: "Si cadascun s'especialitza del tot",
    produceMundo: 'El món produïx',
    rangoTitulo: "Relació d'intercanvi",
    rangoTexto: "Perquè l'intercanvi interesse als dos, una unitat del bé 1 ha de valdre entre",
    rangoY: 'i',
    rangoUnidades: 'unitats del bé 2.',
    rangoPorque: "Per davall del límit inferior, el país que exporta el bé 1 preferiria produir ell mateix el bé 2. Per damunt del superior, el que l'importa preferiria produir-lo ell. La teoria delimita el rang, però no diu en quin punt del rang es tanca el tracte: això és negociació.",
    intercambioTitulo: 'Comprovar un intercanvi concret',
    unidadesBien1: "Unitats del bé 1 que s'intercanvien",
    unidadesBien2: "Unitats del bé 2 que s'intercanvien",
    relacion: "Relació d'intercanvi",
    dentro: 'Dins del rang: els dos hi guanyen',
    fuera: 'Fora del rang: un dels dos hi perd',
    ganancia: 'Guany (en unitats del bé 2)',
    consumo: 'Consum final',
    intercambioInvalido: "Cap país pot exportar més del que produïx especialitzant-se del tot. Abaixa alguna de les dues quantitats.",
    exporta: 'exporta el bé 1',
    graficoTitulo: 'Les dues fronteres i el consum amb comerç',
    graficoPie: "El punt de consum queda fora de la frontera de cada país: això és exactament el que aporta el comerç, consumir més del que es pot produir.",
    chartAria: "Frontera de possibilitats de producció del país amb el seu punt de consum després de l'intercanvi",
    presets: 'Exemples',
    presetRicardo: 'El clàssic de Ricardo',
    presetEmpate: 'Mateixos costos relatius',
    presetGigante: 'País gran i país xicotet',
    comoSeCalcula: 'Com es calcula',
    formulaCosteTitle: "Cost d'oportunitat",
    formulaCosteDesc: " d'una unitat del bé 1: màxim del bé 2 ÷ màxim del bé 1. El del bé 2 és el seu invers.",
    formulaAbsTitle: 'Avantatge absolut',
    formulaAbsDesc: ": produïx més en termes absoluts. No decidix qui s'especialitza.",
    formulaCompTitle: 'Avantatge comparatiu',
    formulaCompDesc: ": renuncia a menys de l'altre bé. Com que els costos són inversos, cada país té el seu en un bé distint.",
    formulaGananciaTitle: "Guany de l'intercanvi",
    formulaGananciaDesc: ': el que rep menys el que hauria pogut produir pel seu compte amb els recursos que allibera.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;
const fmt = (v: number) => formatNumber(v, 2);

/**
 * Ricardian comparative advantage with two countries and two goods.
 *
 * Separates the absolute advantage from the comparative one, marks the band
 * the terms of trade must sit inside, and checks a concrete swap: both
 * frontiers are drawn with the consumption point outside them.
 *
 * Eco 1BACH · Unit 12.
 */
export default function VentajaComparativaCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [nombreA, setNombreA] = useState<string>(t.defaultPaisA);
  const [nombreB, setNombreB] = useState<string>(t.defaultPaisB);
  const [nombre1, setNombre1] = useState<string>(t.defaultBien1);
  const [nombre2, setNombre2] = useState<string>(t.defaultBien2);

  const [a1, setA1] = useState<number>(120);
  const [a2, setA2] = useState<number>(240);
  const [b1, setB1] = useState<number>(60);
  const [b2, setB2] = useState<number>(180);

  const [q1, setQ1] = useState<number>(40);
  const [q2, setQ2] = useState<number>(100);

  const paises: Paises = { a: { bien1: a1, bien2: a2 }, b: { bien1: b1, bien2: b2 } };
  const an = useMemo(() => analizar(paises), [a1, a2, b1, b2]);
  const swap = useMemo(() => intercambio(paises, q1, q2), [a1, a2, b1, b2, q1, q2]);

  const nombreDe = (p: 'a' | 'b' | null) => (p === 'a' ? nombreA : p === 'b' ? nombreB : t.empate);

  const aplicar = (v: [number, number, number, number], swapQ: [number, number]) => {
    setA1(v[0]); setA2(v[1]); setB1(v[2]); setB2(v[3]);
    setQ1(swapQ[0]); setQ2(swapQ[1]);
  };

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([120, 240, 60, 180], [40, 100])}>{t.presetRicardo}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([100, 200, 50, 100], [20, 45])}>{t.presetEmpate}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([500, 500, 20, 60], [20, 40])}>{t.presetGigante}</button>
      </div>

      <div class="vc__label">{t.datosTitulo}</div>
      <div class="calc__form vc__row">
        <label class="calc__field">
          <span class="calc__label">{t.paisA}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombreA} onInput={(e) => setNombreA((e.target as HTMLInputElement).value)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.paisB}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombreB} onInput={(e) => setNombreB((e.target as HTMLInputElement).value)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.bien1}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombre1} onInput={(e) => setNombre1((e.target as HTMLInputElement).value)} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.bien2}</span>
          <div class="calc__input-wrap">
            <input type="text" value={nombre2} onInput={(e) => setNombre2((e.target as HTMLInputElement).value)} />
          </div>
        </label>
      </div>

      <div class="calc__form vc__row">
        <label class="calc__field">
          <span class="calc__label">{nombreA} · {t.maxDe} {nombre1}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={a1} onInput={(e) => setA1(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{nombreA} · {t.maxDe} {nombre2}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={a2} onInput={(e) => setA2(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{nombreB} · {t.maxDe} {nombre1}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={b1} onInput={(e) => setB1(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{nombreB} · {t.maxDe} {nombre2}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={b2} onInput={(e) => setB2(num(e))} />
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!an.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="vc__panel">
              <div class="vc__label">{t.costesTitulo}</div>
              <div class="vc__scroll">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>{t.colPais}</th>
                      <th>{t.colCoste1} ({nombre1})</th>
                      <th>{t.colCoste2} ({nombre2})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{nombreA}</td>
                      <td>{fmt(an.costes.a1)} {nombre2}</td>
                      <td>{fmt(an.costes.a2)} {nombre1}</td>
                    </tr>
                    <tr>
                      <td>{nombreB}</td>
                      <td>{fmt(an.costes.b1)} {nombre2}</td>
                      <td>{fmt(an.costes.b2)} {nombre1}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="vc__panel">
              <div class="vc__label">{t.absolutaTitulo}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{nombre1}</span>
                  <span class="calc__metric-mini-value">{nombreDe(an.absoluta.bien1)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{nombre2}</span>
                  <span class="calc__metric-mini-value">{nombreDe(an.absoluta.bien2)}</span>
                </div>
              </div>
              {an.absoluta.bien1 !== null && an.absoluta.bien1 === an.absoluta.bien2 && (
                <p class="vc__note">{nombreDe(an.absoluta.bien1)} {t.absolutaAmbos}</p>
              )}
            </div>

            <div class="vc__panel">
              <div class="vc__label">{t.comparativaTitulo}</div>
              {an.comparativa.bien1 === null ? (
                <p class="vc__note">{t.sinComparativa}</p>
              ) : (
                <>
                  <div class="calc__metric-grid">
                    <div class="calc__metric-mini">
                      <span class="calc__metric-mini-label">{nombre1}</span>
                      <span class="calc__metric-mini-value ok">{nombreDe(an.comparativa.bien1)}</span>
                    </div>
                    <div class="calc__metric-mini">
                      <span class="calc__metric-mini-label">{nombre2}</span>
                      <span class="calc__metric-mini-value ok">{nombreDe(an.comparativa.bien2)}</span>
                    </div>
                  </div>
                  {an.especializacion && (
                    <p class="vc__note">
                      <strong>{t.especializacionTitulo}.</strong> {t.produceMundo} {fmt(an.especializacion.bien1)} {nombre1} · {fmt(an.especializacion.bien2)} {nombre2}.
                    </p>
                  )}
                </>
              )}
            </div>

            {an.rango && (
              <div class="vc__panel">
                <div class="vc__label">{t.rangoTitulo}</div>
                <p class="vc__note">
                  {t.rangoTexto} <strong>{fmt(an.rango.min)}</strong> {t.rangoY} <strong>{fmt(an.rango.max)}</strong> {t.rangoUnidades}
                </p>
                <p class="vc__note">{t.rangoPorque}</p>
              </div>
            )}

            {an.rango && (
              <div class="vc__panel">
                <div class="vc__label">{t.intercambioTitulo}</div>
                <div class="calc__form vc__row">
                  <label class="calc__field">
                    <span class="calc__label">{t.unidadesBien1} ({nombre1})</span>
                    <div class="calc__input-wrap">
                      <input type="number" min={1} step={5} value={q1} onInput={(e) => setQ1(num(e))} />
                    </div>
                  </label>
                  <label class="calc__field">
                    <span class="calc__label">{t.unidadesBien2} ({nombre2})</span>
                    <div class="calc__input-wrap">
                      <input type="number" min={1} step={5} value={q2} onInput={(e) => setQ2(num(e))} />
                    </div>
                  </label>
                </div>

                {!swap.valido ? (
                  <p class="vc__note">{t.intercambioInvalido}</p>
                ) : (
                  <>
                    <div class="calc__metric-grid calc__metric-grid--three">
                      <div class="calc__metric-mini">
                        <span class="calc__metric-mini-label">{t.relacion}</span>
                        <span class="calc__metric-mini-value">{fmt(swap.relacion)}</span>
                      </div>
                      <div class="calc__metric-mini">
                        <span class="calc__metric-mini-label">{t.ganancia} · {nombreA}</span>
                        <span class={`calc__metric-mini-value ${swap.gananciaA >= 0 ? 'ok' : 'fail'}`}>{fmt(swap.gananciaA)}</span>
                      </div>
                      <div class="calc__metric-mini">
                        <span class="calc__metric-mini-label">{t.ganancia} · {nombreB}</span>
                        <span class={`calc__metric-mini-value ${swap.gananciaB >= 0 ? 'ok' : 'fail'}`}>{fmt(swap.gananciaB)}</span>
                      </div>
                    </div>
                    <p class={`vc__verdict ${swap.dentroDelRango ? 'is-ok' : 'is-fail'}`}>
                      {swap.dentroDelRango ? t.dentro : t.fuera} · {nombreDe(swap.exportadorBien1)} {t.exporta}
                    </p>

                    <div class="vc__label">{t.graficoTitulo}</div>
                    <div class="vc__charts">
                      <PPFChart
                        titulo={nombreA}
                        max1={a1} max2={a2}
                        consumo={swap.consumoA}
                        etiqueta1={nombre1} etiqueta2={nombre2}
                        locale={locale}
                      />
                      <PPFChart
                        titulo={nombreB}
                        max1={b1} max2={b2}
                        consumo={swap.consumoB}
                        etiqueta1={nombre1} etiqueta2={nombre2}
                        locale={locale}
                      />
                    </div>
                    <p class="vc__note">{t.graficoPie}</p>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaCosteTitle}</strong>{t.formulaCosteDesc}</p>
            <p><strong>{t.formulaAbsTitle}</strong>{t.formulaAbsDesc}</p>
            <p><strong>{t.formulaCompTitle}</strong>{t.formulaCompDesc}</p>
            <p><strong>{t.formulaGananciaTitle}</strong>{t.formulaGananciaDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .vc__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .vc__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .vc__row { grid-template-columns: 1fr; } }
        .vc__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .vc__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .vc__scroll { overflow-x: auto; }
        .vc__verdict {
          margin-top: 0.8rem;
          padding: 0.5rem 0.8rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
          background: var(--color-cream, #F5EDD9);
        }
        .vc__verdict.is-ok { border-color: #4F8C3F; }
        .vc__verdict.is-fail { border-color: #B83A3A; }
        .vc__charts { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
        @media (max-width: 560px) { .vc__charts { grid-template-columns: 1fr; } }
        .vc__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

/* ── SVG chart ─────────────────────────────────────────────────────────── */

interface ChartProps {
  titulo: string;
  max1: number;
  max2: number;
  consumo: { bien1: number; bien2: number };
  etiqueta1: string;
  etiqueta2: string;
  locale: Locale;
}

/** One country's straight frontier with its post-trade consumption point. */
function PPFChart({ titulo, max1, max2, consumo, etiqueta1, etiqueta2, locale }: ChartProps) {
  const t = COPY[locale];
  const W = 220, H = 190, ML = 34, MR = 12, MT = 24, MB = 30;
  const iW = W - ML - MR, iH = H - MT - MB;

  const x1Max = Math.max(max1, consumo.bien1) * 1.08;
  const x2Max = Math.max(max2, consumo.bien2) * 1.08;
  const xOf = (v: number) => ML + (v / x1Max) * iW;
  const yOf = (v: number) => MT + iH - (v / x2Max) * iH;

  return (
    <svg class="vc__chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${titulo}: ${t.chartAria}`}>
      <text x={ML} y={14} font-size="10" font-weight="700" fill="#2A1F18">{titulo}</text>

      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />
      <line x1={ML} y1={MT + iH} x2={W - MR} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />

      <line x1={xOf(0)} y1={yOf(max2)} x2={xOf(max1)} y2={yOf(0)} stroke="#C44E2C" stroke-width="2" />

      <line x1={xOf(consumo.bien1)} y1={yOf(0)} x2={xOf(consumo.bien1)} y2={yOf(consumo.bien2)} stroke="#8A7868" stroke-width="1" stroke-dasharray="3 3" />
      <line x1={xOf(0)} y1={yOf(consumo.bien2)} x2={xOf(consumo.bien1)} y2={yOf(consumo.bien2)} stroke="#8A7868" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx={xOf(consumo.bien1)} cy={yOf(consumo.bien2)} r="4" fill="#1F6E6E" stroke="#FBF6EC" stroke-width="1.3" />

      <text x={ML - 4} y={yOf(max2) + 3} text-anchor="end" font-size="8" fill="#8A7868">{formatNumber(max2, 0)}</text>
      <text x={xOf(max1)} y={H - MB + 12} text-anchor="middle" font-size="8" fill="#8A7868">{formatNumber(max1, 0)}</text>
      <text x={W - MR} y={H - 4} text-anchor="end" font-size="8" fill="#5C4A3D">{etiqueta1}</text>
      <text x={2} y={MT - 4} text-anchor="start" font-size="8" fill="#5C4A3D">{etiqueta2}</text>
    </svg>
  );
}
