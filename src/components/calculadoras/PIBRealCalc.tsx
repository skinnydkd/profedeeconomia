/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber, formatPercent } from '../../lib/calc/format';
import { valorar, type Anyo } from '../../lib/calc/pib-real';

/** UI strings, Valencian (AVL) alongside the ES source. PIB stays PIB in both. */
export const COPY = {
  es: {
    intro: 'El PIB nominal sube por dos motivos distintos: porque se produce más o porque todo cuesta más. El deflactor separa las dos cosas. Escribe una serie y comprueba cuál de los dos está pasando.',
    entradaTitulo: 'La serie',
    colAnyo: 'Periodo',
    colNominal: 'PIB nominal',
    colDeflactor: 'Deflactor (base 100)',
    colPoblacion: 'Población',
    colReal: 'PIB real',
    colCrecNominal: 'Var. nominal',
    colCrecReal: 'Var. real',
    colInflacion: 'Inflación implícita',
    colPerCapita: 'PIB real per cápita',
    anyadir: 'Añadir periodo',
    quitar: 'Quitar el último',
    unidadAyuda: 'Las cifras van en la unidad que quieras (millones de euros, miles de millones): la herramienta no la interpreta, solo exige que sea la misma en toda la columna. La población, en la misma escala que quieras leer el per cápita.',
    resultadosTitulo: 'Lo que dice la serie',
    sinDatos: 'Falta algún dato o el deflactor no es positivo. Revisa las filas: el deflactor tiene que ser mayor que cero y el PIB nominal no puede ser negativo.',
    espejismo: 'Aquí el PIB nominal sube y el real no: todo el aumento es precio. Es exactamente el caso que hace falta el deflactor para ver.',
    espejismoTitulo: 'Ojo con este periodo',
    baseNota: 'El periodo con deflactor 100 es el año base: ahí el PIB nominal y el real coinciden por definición, no por casualidad.',
    graficoTitulo: 'Nominal frente a real',
    graficoAria: 'Barras comparando el PIB nominal y el PIB real de cada periodo',
    leyendaNominal: 'PIB nominal',
    leyendaReal: 'PIB real',
    presets: 'Ejemplos',
    presetInflacion: 'Crecimiento solo por precios',
    presetReal: 'Crecimiento real',
    presetPoblacion: 'Crece el PIB, cae el per cápita',
    comoSeCalcula: 'Cómo se calcula',
    formulaRealTitle: 'PIB real',
    formulaRealDesc: ': PIB nominal ÷ deflactor × 100. Es la producción valorada a los precios del año base.',
    formulaDeflactorTitle: 'Deflactor',
    formulaDeflactorDesc: ': PIB nominal ÷ PIB real × 100. Mide cuánto han subido los precios de todo lo que se produce, no solo de la cesta de la compra.',
    formulaPerCapitaTitle: 'Per cápita',
    formulaPerCapitaDesc: ': PIB real ÷ población. Puede caer aunque el PIB suba, si la población crece más deprisa.',
    aviso: 'El deflactor del PIB y el IPC no son lo mismo y no tienen por qué coincidir: el IPC mide una cesta de consumo fija, y el deflactor, todo lo que produce el país. Cuando en una noticia salen dos cifras de inflación distintas, suele ser por esto.',
  },
  ca: {
    intro: 'El PIB nominal puja per dos motius diferents: perquè es produïx més o perquè tot costa més. El deflactor separa les dues coses. Escriu una sèrie i comprova quin dels dos està passant.',
    entradaTitulo: 'La sèrie',
    colAnyo: 'Període',
    colNominal: 'PIB nominal',
    colDeflactor: 'Deflactor (base 100)',
    colPoblacion: 'Població',
    colReal: 'PIB real',
    colCrecNominal: 'Var. nominal',
    colCrecReal: 'Var. real',
    colInflacion: 'Inflació implícita',
    colPerCapita: 'PIB real per capita',
    anyadir: 'Afegir període',
    quitar: "Llevar l'últim",
    unidadAyuda: "Les xifres van en la unitat que vulgues (milions d'euros, milers de milions): la ferramenta no la interpreta, només exigix que siga la mateixa en tota la columna. La població, en la mateixa escala que vulgues llegir el per capita.",
    resultadosTitulo: 'El que diu la sèrie',
    sinDatos: 'Falta alguna dada o el deflactor no és positiu. Revisa les files: el deflactor ha de ser major que zero i el PIB nominal no pot ser negatiu.',
    espejismo: 'Ací el PIB nominal puja i el real no: tot l\'augment és preu. És exactament el cas per al qual cal el deflactor per a vore-ho.',
    espejismoTitulo: 'Compte amb este període',
    baseNota: 'El període amb deflactor 100 és l\'any base: ahí el PIB nominal i el real coincidixen per definició, no per casualitat.',
    graficoTitulo: 'Nominal enfront de real',
    graficoAria: 'Barres comparant el PIB nominal i el PIB real de cada període',
    leyendaNominal: 'PIB nominal',
    leyendaReal: 'PIB real',
    presets: 'Exemples',
    presetInflacion: 'Creixement només per preus',
    presetReal: 'Creixement real',
    presetPoblacion: 'Creix el PIB, cau el per capita',
    comoSeCalcula: 'Com es calcula',
    formulaRealTitle: 'PIB real',
    formulaRealDesc: ': PIB nominal ÷ deflactor × 100. És la producció valorada als preus de l\'any base.',
    formulaDeflactorTitle: 'Deflactor',
    formulaDeflactorDesc: ': PIB nominal ÷ PIB real × 100. Mesura quant han pujat els preus de tot el que es produïx, no només de la cistella de la compra.',
    formulaPerCapitaTitle: 'Per capita',
    formulaPerCapitaDesc: ': PIB real ÷ població. Pot caure encara que el PIB puge, si la població creix més de pressa.',
    aviso: "El deflactor del PIB i l'IPC no són el mateix i no tenen per què coincidir: l'IPC mesura una cistella de consum fixa, i el deflactor, tot el que produïx el país. Quan en una notícia ixen dues xifres d'inflació diferents, sol ser per això.",
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);

const PRESET_INFLACION: Anyo[] = [
  { etiqueta: '2023', nominal: 1000, deflactor: 100, poblacion: 10 },
  { etiqueta: '2024', nominal: 1050, deflactor: 105, poblacion: 10 },
  { etiqueta: '2025', nominal: 1103, deflactor: 110.3, poblacion: 10 },
];
const PRESET_REAL: Anyo[] = [
  { etiqueta: '2023', nominal: 1000, deflactor: 100, poblacion: 10 },
  { etiqueta: '2024', nominal: 1080, deflactor: 102, poblacion: 10 },
  { etiqueta: '2025', nominal: 1170, deflactor: 104, poblacion: 10 },
];
const PRESET_POBLACION: Anyo[] = [
  { etiqueta: '2023', nominal: 1000, deflactor: 100, poblacion: 10 },
  { etiqueta: '2024', nominal: 1040, deflactor: 100, poblacion: 11 },
  { etiqueta: '2025', nominal: 1080, deflactor: 100, poblacion: 12.5 },
];

export default function PIBRealCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [anyos, setAnyos] = useState<Anyo[]>(PRESET_INFLACION);

  const r = useMemo(() => valorar(anyos), [anyos]);
  const maxValor = useMemo(
    () => (r.valido ? Math.max(...r.anyos.flatMap((a) => [a.nominal, a.real])) : 1),
    [r],
  );

  const set = (i: number, campo: keyof Anyo, valor: number | string) =>
    setAnyos((prev) => prev.map((a, j) => (j === i ? { ...a, [campo]: valor } : a)));

  return (
    <div class="calc">
      <p class="pib__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setAnyos(PRESET_INFLACION)}>{t.presetInflacion}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setAnyos(PRESET_REAL)}>{t.presetReal}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setAnyos(PRESET_POBLACION)}>{t.presetPoblacion}</button>
      </div>

      <div class="pib__label">{t.entradaTitulo}</div>
      <div class="pib__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th scope="col">{t.colAnyo}</th>
              <th scope="col">{t.colNominal}</th>
              <th scope="col">{t.colDeflactor}</th>
              <th scope="col">{t.colPoblacion}</th>
            </tr>
          </thead>
          <tbody>
            {anyos.map((a, i) => (
              <tr key={i}>
                <td><input type="text" value={a.etiqueta} onInput={(e) => set(i, 'etiqueta', (e.currentTarget as HTMLInputElement).value)} /></td>
                <td><input type="number" min={0} step={10} value={a.nominal} onInput={(e) => set(i, 'nominal', num(e))} /></td>
                <td><input type="number" min={0.1} step={0.1} value={a.deflactor} onInput={(e) => set(i, 'deflactor', num(e))} /></td>
                <td><input type="number" min={0} step={0.5} value={a.poblacion ?? 0} onInput={(e) => set(i, 'poblacion', num(e))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="pib__note">{t.unidadAyuda}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setAnyos((p) => [...p, { etiqueta: '', nominal: p[p.length - 1]?.nominal ?? 1000, deflactor: p[p.length - 1]?.deflactor ?? 100, poblacion: p[p.length - 1]?.poblacion ?? 10 }])}>
          {t.anyadir}
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" disabled={anyos.length <= 2}
          onClick={() => setAnyos((p) => p.slice(0, -1))}>
          {t.quitar}
        </button>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="pib__label">{t.resultadosTitulo}</div>
            <div class="pib__scroll">
              <table class="calc__table">
                <thead>
                  <tr>
                    <th scope="col">{t.colAnyo}</th>
                    <th scope="col">{t.colReal}</th>
                    <th scope="col">{t.colCrecNominal}</th>
                    <th scope="col">{t.colCrecReal}</th>
                    <th scope="col">{t.colInflacion}</th>
                    <th scope="col">{t.colPerCapita}</th>
                  </tr>
                </thead>
                <tbody>
                  {r.anyos.map((a, i) => (
                    <tr key={i}>
                      <th scope="row">{a.etiqueta}</th>
                      <td>{formatNumber(a.real, 1)}</td>
                      <td>{formatPercent(a.crecimientoNominal, 1)}</td>
                      <td class={a.espejismo ? 'fail' : undefined}>{formatPercent(a.crecimientoReal, 1)}</td>
                      <td>{formatPercent(a.inflacion, 1)}</td>
                      <td>{formatNumber(a.perCapita, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {r.anyos.some((a) => a.espejismo) && (
              <div class="calc__tip calc__tip--warn">
                <strong>{t.espejismoTitulo}</strong> {t.espejismo}
              </div>
            )}
            <p class="pib__note">{t.baseNota}</p>

            <div class="pib__panel">
              <div class="pib__label">{t.graficoTitulo}</div>
              <div class="pib__chart" role="img" aria-label={t.graficoAria}>
                {r.anyos.map((a, i) => (
                  <div class="pib__group" key={i}>
                    <div class="pib__bars">
                      <span class="pib__bar pib__bar--nom" style={{ height: `${Math.max(2, (a.nominal / maxValor) * 100)}%` }} />
                      <span class="pib__bar pib__bar--real" style={{ height: `${Math.max(2, (a.real / maxValor) * 100)}%` }} />
                    </div>
                    <span class="pib__tick">{a.etiqueta}</span>
                  </div>
                ))}
              </div>
              <div class="pib__legend">
                <span><span class="pib__swatch pib__swatch--nom" /> {t.leyendaNominal}</span>
                <span><span class="pib__swatch pib__swatch--real" /> {t.leyendaReal}</span>
              </div>
            </div>

            <div class="calc__tip calc__tip--info">{t.aviso}</div>
          </>
        )}
      </div>

      <details class="calc__details">
        <summary>{t.comoSeCalcula}</summary>
        <ul class="calc__formula">
          <li><strong>{t.formulaRealTitle}</strong>{t.formulaRealDesc}</li>
          <li><strong>{t.formulaDeflactorTitle}</strong>{t.formulaDeflactorDesc}</li>
          <li><strong>{t.formulaPerCapitaTitle}</strong>{t.formulaPerCapitaDesc}</li>
        </ul>
      </details>

      <style>{`
        .pib__intro {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1rem;
        }
        .pib__label {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868);
          margin: 1rem 0 0.5rem;
        }
        .pib__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .pib__scroll { overflow-x: auto; }
        .pib__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .pib__chart {
          display: flex;
          align-items: flex-end;
          gap: 1.2rem;
          height: 140px;
          padding-top: 0.5rem;
        }
        .pib__group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .pib__bars { flex: 1; display: flex; align-items: flex-end; gap: 4px; width: 100%; justify-content: center; }
        .pib__bar { display: block; width: 26px; border-radius: 3px 3px 0 0; }
        .pib__bar--nom { background: var(--color-mustard, #D4A24C); }
        .pib__bar--real { background: var(--color-terracotta, #C44E2C); }
        .pib__tick {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          color: var(--color-ink-mute, #8A7868);
          margin-top: 0.4rem;
        }
        .pib__legend {
          display: flex;
          gap: 1.2rem;
          margin-top: 0.8rem;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .pib__swatch {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          margin-right: 0.35rem;
        }
        .pib__swatch--nom { background: var(--color-mustard, #D4A24C); }
        .pib__swatch--real { background: var(--color-terracotta, #C44E2C); }
      `}</style>
    </div>
  );
}
