/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { calcular, type Entradas, type Nivel } from '../../lib/calc/cuenta-resultados';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Accounting labels that
 * are the same in both (EBITDA, BAII, BAI) are kept.
 */
export const COPY = {
  es: {
    explotacionTitulo: 'Resultado de explotación',
    ventas: 'Importe neto de la cifra de negocios (€)',
    aprovisionamientos: 'Aprovisionamientos (€)',
    personal: 'Gastos de personal (€)',
    otros: 'Otros gastos de explotación (€)',
    amortizacion: 'Amortización del inmovilizado (€)',
    financieroTitulo: 'Resultado financiero e impuesto',
    ingresosFin: 'Ingresos financieros (€)',
    gastosFin: 'Gastos financieros (€)',
    tipo: 'Tipo del impuesto de sociedades (%)',
    tipoAyuda: 'El tipo general es el 25 %. Una empresa de nueva creación tributa al 15 % en el primer ejercicio con base positiva y en el siguiente.',
    sinDatos: 'Revisa los datos: la cifra de negocios tiene que ser mayor que cero, los gastos no pueden ser negativos y el tipo impositivo va entre 0 y 100 %.',
    cascadaTitulo: 'La cascada',
    margenBruto: 'Margen bruto',
    ebitda: 'EBITDA',
    baii: 'BAII · resultado de explotación',
    bai: 'BAI · resultado antes de impuestos',
    resultado: 'Resultado del ejercicio',
    sobreVentas: 'sobre ventas',
    impuesto: 'Impuesto sobre beneficios',
    resultadoFinanciero: 'Resultado financiero',
    perdidas: 'La empresa pierde dinero antes de impuestos. En este cálculo no se aplica impuesto sobre una pérdida; en la realidad esa pérdida puede compensarse con beneficios de ejercicios siguientes.',
    lecturasTitulo: 'Qué dice cada escalón',
    lecturaMargenT: 'Margen bruto.',
    lecturaMargenD: 'Lo que queda de cada venta después de pagar lo que se ha vendido. Si este escalón es estrecho, no hay nada que hacer más abajo.',
    lecturaEbitdaT: 'EBITDA.',
    lecturaEbitdaD: 'El resultado antes de amortizaciones, intereses e impuestos: se acerca a lo que el negocio genera con su actividad, sin decisiones de inversión ni de financiación.',
    lecturaBaiiT: 'BAII.',
    lecturaBaiiD: 'Ya descuenta la amortización, así que incorpora el desgaste de lo que la empresa usa para producir. Es el resultado con el que se compara la rentabilidad económica.',
    lecturaBaiT: 'BAI.',
    lecturaBaiD: 'Aquí entran los intereses. Dos empresas idénticas con distinta deuda tienen el mismo BAII y distinto BAI: la diferencia es cómo se han financiado.',
    lecturaResultadoT: 'Resultado del ejercicio.',
    lecturaResultadoD: 'Lo que queda para los socios, en reservas o en dividendos.',
    avisoTitulo: 'Una advertencia',
    aviso: 'Este resultado no es dinero en la cuenta. Una venta a crédito ya está aquí aunque no se haya cobrado, y la amortización resta sin que salga un euro. Para saber si hay caja hace falta una previsión de tesorería, no una cuenta de resultados.',
    presets: 'Ejemplos',
    presetSana: 'Empresa con beneficio',
    presetApalancada: 'Buen negocio, mala financiación',
    presetPerdidas: 'Ejercicio en pérdidas',
    comoSeCalcula: 'Cómo se calcula',
    formulaMargenTitle: 'Margen bruto',
    formulaMargenDesc: ': cifra de negocios − aprovisionamientos.',
    formulaEbitdaTitle: 'EBITDA',
    formulaEbitdaDesc: ': margen bruto − gastos de personal − otros gastos de explotación.',
    formulaBaiiTitle: 'BAII y BAI',
    formulaBaiiDesc: ': BAII = EBITDA − amortización; BAI = BAII + ingresos financieros − gastos financieros.',
    formulaResultadoTitle: 'Resultado',
    formulaResultadoDesc: ': BAI − impuesto, con impuesto = BAI × tipo cuando el BAI es positivo.',
  },
  ca: {
    explotacionTitulo: "Resultat d'explotació",
    ventas: 'Import net de la xifra de negocis (€)',
    aprovisionamientos: 'Aprovisionaments (€)',
    personal: 'Despeses de personal (€)',
    otros: "Altres despeses d'explotació (€)",
    amortizacion: "Amortització de l'immobilitzat (€)",
    financieroTitulo: 'Resultat financer i impost',
    ingresosFin: 'Ingressos financers (€)',
    gastosFin: 'Despeses financeres (€)',
    tipo: "Tipus de l'impost de societats (%)",
    tipoAyuda: 'El tipus general és el 25 %. Una empresa de nova creació tributa al 15 % en el primer exercici amb base positiva i en el següent.',
    sinDatos: 'Revisa les dades: la xifra de negocis ha de ser major que zero, les despeses no poden ser negatives i el tipus impositiu va entre 0 i 100 %.',
    cascadaTitulo: 'La cascada',
    margenBruto: 'Marge brut',
    ebitda: 'EBITDA',
    baii: "BAII · resultat d'explotació",
    bai: "BAI · resultat abans d'impostos",
    resultado: "Resultat de l'exercici",
    sobreVentas: 'sobre vendes',
    impuesto: 'Impost sobre beneficis',
    resultadoFinanciero: 'Resultat financer',
    perdidas: "L'empresa perd diners abans d'impostos. En este càlcul no s'aplica impost sobre una pèrdua; a la realitat eixa pèrdua pot compensar-se amb beneficis d'exercicis següents.",
    lecturasTitulo: 'Què diu cada escaló',
    lecturaMargenT: 'Marge brut.',
    lecturaMargenD: "El que queda de cada venda després de pagar el que s'ha venut. Si este escaló és estret, no hi ha res a fer més avall.",
    lecturaEbitdaT: 'EBITDA.',
    lecturaEbitdaD: "El resultat abans d'amortitzacions, interessos i impostos: s'acosta al que el negoci genera amb la seua activitat, sense decisions d'inversió ni de finançament.",
    lecturaBaiiT: 'BAII.',
    lecturaBaiiD: "Ja descompta l'amortització, així que incorpora el desgast del que l'empresa usa per a produir. És el resultat amb què es compara la rendibilitat econòmica.",
    lecturaBaiT: 'BAI.',
    lecturaBaiD: "Ací entren els interessos. Dues empreses idèntiques amb deute distint tenen el mateix BAII i distint BAI: la diferència és com s'han finançat.",
    lecturaResultadoT: "Resultat de l'exercici.",
    lecturaResultadoD: 'El que queda per als socis, en reserves o en dividends.',
    avisoTitulo: 'Una advertència',
    aviso: "Este resultat no són diners al compte. Una venda a crèdit ja està ací encara que no s'haja cobrat, i l'amortització resta sense que isca un euro. Per a saber si hi ha caixa cal una previsió de tresoreria, no un compte de resultats.",
    presets: 'Exemples',
    presetSana: 'Empresa amb benefici',
    presetApalancada: 'Bon negoci, mal finançament',
    presetPerdidas: 'Exercici en pèrdues',
    comoSeCalcula: 'Com es calcula',
    formulaMargenTitle: 'Marge brut',
    formulaMargenDesc: ': xifra de negocis − aprovisionaments.',
    formulaEbitdaTitle: 'EBITDA',
    formulaEbitdaDesc: ": marge brut − despeses de personal − altres despeses d'explotació.",
    formulaBaiiTitle: 'BAII i BAI',
    formulaBaiiDesc: ": BAII = EBITDA − amortització; BAI = BAII + ingressos financers − despeses financeres.",
    formulaResultadoTitle: 'Resultat',
    formulaResultadoDesc: ': BAI − impost, amb impost = BAI × tipus quan el BAI és positiu.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * The income statement built level by level, with each step drawn as a share
 * of turnover so the reader sees where the money goes and not only what is
 * left at the end.
 *
 * EDMN 2BACH · Unit 10.
 */
export default function CuentaResultadosCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [ventas, setVentas] = useState<number>(500000);
  const [aprovisionamientos, setAprov] = useState<number>(200000);
  const [personal, setPersonal] = useState<number>(150000);
  const [otros, setOtros] = useState<number>(60000);
  const [amortizacion, setAmortizacion] = useState<number>(30000);
  const [ingresosFin, setIngresosFin] = useState<number>(2000);
  const [gastosFin, setGastosFin] = useState<number>(12000);
  const [tipoPct, setTipoPct] = useState<number>(25);

  const entradas: Entradas = {
    ventas, aprovisionamientos, gastosPersonal: personal, otrosGastosExplotacion: otros,
    amortizacion, ingresosFinancieros: ingresosFin, gastosFinancieros: gastosFin,
    tipoImpositivo: tipoPct / 100,
  };
  const r = useMemo(
    () => calcular(entradas),
    [ventas, aprovisionamientos, personal, otros, amortizacion, ingresosFin, gastosFin, tipoPct],
  );

  const etiqueta = (n: Nivel) =>
    n.clave === 'margenBruto' ? t.margenBruto
    : n.clave === 'ebitda' ? t.ebitda
    : n.clave === 'baii' ? t.baii
    : n.clave === 'bai' ? t.bai
    : t.resultado;

  const aplicar = (v: [number, number, number, number, number, number, number]) => {
    setVentas(v[0]); setAprov(v[1]); setPersonal(v[2]); setOtros(v[3]);
    setAmortizacion(v[4]); setIngresosFin(v[5]); setGastosFin(v[6]);
  };

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([500000, 200000, 150000, 60000, 30000, 2000, 12000])}>{t.presetSana}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([500000, 200000, 150000, 60000, 30000, 1000, 62000])}>{t.presetApalancada}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([500000, 240000, 200000, 80000, 40000, 1000, 20000])}>{t.presetPerdidas}</button>
      </div>

      <div class="cr__label">{t.explotacionTitulo}</div>
      <div class="calc__form cr__row">
        <label class="calc__field">
          <span class="calc__label">{t.ventas}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10000} value={ventas} onInput={(e) => setVentas(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.aprovisionamientos}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={10000} value={aprovisionamientos} onInput={(e) => setAprov(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.personal}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={10000} value={personal} onInput={(e) => setPersonal(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.otros}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={5000} value={otros} onInput={(e) => setOtros(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.amortizacion}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={5000} value={amortizacion} onInput={(e) => setAmortizacion(num(e))} />
          </div>
        </label>
      </div>

      <div class="cr__label">{t.financieroTitulo}</div>
      <div class="calc__form cr__row">
        <label class="calc__field">
          <span class="calc__label">{t.ingresosFin}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1000} value={ingresosFin} onInput={(e) => setIngresosFin(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.gastosFin}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1000} value={gastosFin} onInput={(e) => setGastosFin(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.tipo}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={1} value={tipoPct} onInput={(e) => setTipoPct(num(e))} />
          </div>
        </label>
      </div>
      <p class="cr__note">{t.tipoAyuda}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="cr__label">{t.cascadaTitulo}</div>
            <div class="cr__cascade">
              {r.niveles.map((n) => (
                <div class="cr__step" key={n.clave}>
                  <div class="cr__step-head">
                    <span class="cr__step-name">{etiqueta(n)}</span>
                    <span class={`cr__step-amount ${n.importe < 0 ? 'is-neg' : ''}`}>{formatEUR(n.importe, 0)}</span>
                  </div>
                  <div class="cr__track">
                    <span
                      class={`cr__fill ${n.importe < 0 ? 'is-neg' : ''}`}
                      style={`width:${Math.min(100, Math.abs(n.sobreVentas) * 100)}%`}
                    />
                  </div>
                  <span class="cr__step-pct">{formatPercent(n.sobreVentas)} {t.sobreVentas}</span>
                </div>
              ))}
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.resultadoFinanciero}</span>
                <span class={`calc__metric-mini-value ${r.resultadoFinanciero < 0 ? 'fail' : ''}`}>
                  {formatEUR(r.resultadoFinanciero, 0)}
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.impuesto}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.impuesto, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.resultado}</span>
                <span class={`calc__metric-mini-value ${r.resultado >= 0 ? 'ok' : 'fail'}`}>
                  {formatEUR(r.resultado, 0)}
                </span>
              </div>
            </div>

            {r.perdidas && <div class="calc__warning">{t.perdidas}</div>}

            <div class="cr__panel">
              <div class="cr__label">{t.lecturasTitulo}</div>
              <ul class="cr__list">
                {([
                  [t.lecturaMargenT, t.lecturaMargenD],
                  [t.lecturaEbitdaT, t.lecturaEbitdaD],
                  [t.lecturaBaiiT, t.lecturaBaiiD],
                  [t.lecturaBaiT, t.lecturaBaiD],
                  [t.lecturaResultadoT, t.lecturaResultadoD],
                ] as [string, string][]).map(([titulo, texto]) => (
                  <li key={titulo}><strong>{titulo}</strong> {texto}</li>
                ))}
              </ul>
            </div>

            <div class="cr__panel">
              <div class="cr__label">{t.avisoTitulo}</div>
              <p class="cr__note">{t.aviso}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaMargenTitle}</strong>{t.formulaMargenDesc}</p>
            <p><strong>{t.formulaEbitdaTitle}</strong>{t.formulaEbitdaDesc}</p>
            <p><strong>{t.formulaBaiiTitle}</strong>{t.formulaBaiiDesc}</p>
            <p><strong>{t.formulaResultadoTitle}</strong>{t.formulaResultadoDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .cr__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .cr__row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .cr__row { grid-template-columns: 1fr; } }
        .cr__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .cr__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .cr__list {
          margin: 0.6rem 0 0;
          padding-left: 1.1rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .cr__list li { margin-bottom: 0.45rem; }
        .cr__cascade { margin-top: 0.4rem; }
        .cr__step { margin-bottom: 0.85rem; }
        .cr__step-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.6rem; }
        .cr__step-name {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
        }
        .cr__step-amount { font-family: var(--font-mono, monospace); font-size: 0.85rem; }
        .cr__step-amount.is-neg { color: #B83A3A; }
        .cr__track {
          margin-top: 0.25rem;
          height: 10px;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line-soft, #EFE2CB);
          border-radius: 3px;
          overflow: hidden;
        }
        .cr__fill { display: block; height: 100%; background: var(--color-mustard, #D4A24C); }
        .cr__fill.is-neg { background: #B83A3A; }
        .cr__step-pct {
          display: block;
          margin-top: 0.2rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.74rem;
          color: var(--color-ink-mute, #8A7868);
        }
      `}</style>
    </div>
  );
}
