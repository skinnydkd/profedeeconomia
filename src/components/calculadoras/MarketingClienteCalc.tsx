/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber, formatPercent } from '../../lib/calc/format';
import { analizar, type Entradas } from '../../lib/calc/marketing-cliente';

/**
 * UI strings, Valencian (AVL) alongside the ES source. The acronyms CAC and
 * LTV are kept: they are the terms used in the unit and in the sector.
 */
export const COPY = {
  es: {
    captacionTitulo: 'Lo que cuesta conseguir un cliente',
    gasto: 'Gasto en marketing y ventas del periodo (€)',
    clientes: 'Clientes nuevos conseguidos',
    clienteTitulo: 'Lo que deja un cliente',
    ticket: 'Compra media (€)',
    compras: 'Compras al año',
    margen: 'Margen bruto sobre la venta (%)',
    retencion: 'Clientes que siguen comprando un año después (%)',
    retencionAyuda: 'Con un 75 % de retención, un cliente dura de media cuatro años: 1 ÷ (1 − 0,75). Es la cifra que más mueve el resultado, y casi siempre la peor estimada.',
    sinDatos: 'Revisa los datos: el gasto, los clientes, la compra media y las compras al año tienen que ser mayores que cero, el margen entre 0 y 100 %, y la retención por debajo del 100 %.',
    cac: 'CAC · coste de captación',
    ltv: 'LTV · valor del cliente',
    ratio: 'LTV / CAC',
    payback: 'Meses para recuperar el CAC',
    margenAnual: 'Margen que deja al año',
    vidaMedia: 'Años que dura de media',
    ingresoAnual: 'Factura al año',
    veredictoPerdida: 'Cada cliente cuesta más de lo que deja: el negocio pierde dinero al crecer.',
    veredictoAjustado: 'El cliente cubre su coste, pero con poco margen para errores o para pagar la estructura.',
    veredictoSano: 'El cliente deja bastante más de lo que cuesta conseguirlo.',
    barraTitulo: 'Coste frente a valor',
    barraCac: 'CAC',
    barraLtv: 'LTV',
    lecturaRatio: 'La regla de oro del sector pide un LTV al menos tres veces el CAC. No es una ley: es un margen de seguridad para cubrir los costes que no están en este cálculo —local, administración, el equipo que no vende— y para aguantar que la retención real sea peor que la estimada.',
    lecturaPayback: 'El payback importa tanto como el ratio: un cliente que tarda dos años en devolver lo que costó conseguirlo obliga a financiar ese hueco, aunque al final sea rentable.',
    palancasTitulo: 'Las cuatro palancas',
    palancas: 'Solo hay cuatro formas de mejorar el número: gastar menos por cliente captado, subir la compra media, conseguir que compren más veces, o que se queden más tiempo. La última suele ser la más barata y la que menos se trabaja.',
    presets: 'Ejemplos',
    presetTienda: 'Tienda online de ropa',
    presetSuscripcion: 'Suscripción mensual',
    presetMalo: 'Captación demasiado cara',
    comoSeCalcula: 'Cómo se calcula',
    formulaCacTitle: 'CAC',
    formulaCacDesc: ': gasto en marketing y ventas ÷ clientes nuevos conseguidos con ese gasto.',
    formulaVidaTitle: 'Vida media',
    formulaVidaDesc: ': 1 ÷ (1 − retención). Es la suma de la serie 1 + r + r² + …, es decir, los años que se espera que siga comprando.',
    formulaLtvTitle: 'LTV',
    formulaLtvDesc: ': compra media × compras al año × margen × vida media. Se cuenta el margen, no la facturación.',
    formulaPaybackTitle: 'Payback',
    formulaPaybackDesc: ': CAC ÷ (margen anual ÷ 12), en meses.',
  },
  ca: {
    captacionTitulo: 'El que costa aconseguir un client',
    gasto: 'Despesa en màrqueting i vendes del període (€)',
    clientes: 'Clients nous aconseguits',
    clienteTitulo: 'El que deixa un client',
    ticket: 'Compra mitjana (€)',
    compras: "Compres a l'any",
    margen: 'Marge brut sobre la venda (%)',
    retencion: 'Clients que continuen comprant un any després (%)',
    retencionAyuda: 'Amb un 75 % de retenció, un client dura de mitjana quatre anys: 1 ÷ (1 − 0,75). És la xifra que més mou el resultat, i quasi sempre la pitjor estimada.',
    sinDatos: "Revisa les dades: la despesa, els clients, la compra mitjana i les compres a l'any han de ser majors que zero, el marge entre 0 i 100 %, i la retenció per davall del 100 %.",
    cac: 'CAC · cost de captació',
    ltv: 'LTV · valor del client',
    ratio: 'LTV / CAC',
    payback: 'Mesos per a recuperar el CAC',
    margenAnual: "Marge que deixa a l'any",
    vidaMedia: 'Anys que dura de mitjana',
    ingresoAnual: "Factura a l'any",
    veredictoPerdida: 'Cada client costa més del que deixa: el negoci perd diners en créixer.',
    veredictoAjustado: "El client cobrix el seu cost, però amb poc marge per a errors o per a pagar l'estructura.",
    veredictoSano: 'El client deixa prou més del que costa aconseguir-lo.',
    barraTitulo: 'Cost enfront de valor',
    barraCac: 'CAC',
    barraLtv: 'LTV',
    lecturaRatio: "La regla d'or del sector demana un LTV almenys tres vegades el CAC. No és una llei: és un marge de seguretat per a cobrir els costos que no estan en este càlcul —local, administració, l'equip que no ven— i per a aguantar que la retenció real siga pitjor que l'estimada.",
    lecturaPayback: 'El payback importa tant com el ràtio: un client que tarda dos anys a tornar el que va costar aconseguir-lo obliga a finançar eixe buit, encara que al final siga rendible.',
    palancasTitulo: 'Les quatre palanques',
    palancas: "Només hi ha quatre formes de millorar el número: gastar menys per client captat, pujar la compra mitjana, aconseguir que compren més vegades, o que es queden més temps. L'última sol ser la més barata i la que menys es treballa.",
    presets: 'Exemples',
    presetTienda: 'Botiga en línia de roba',
    presetSuscripcion: 'Subscripció mensual',
    presetMalo: 'Captació massa cara',
    comoSeCalcula: 'Com es calcula',
    formulaCacTitle: 'CAC',
    formulaCacDesc: ': despesa en màrqueting i vendes ÷ clients nous aconseguits amb eixa despesa.',
    formulaVidaTitle: 'Vida mitjana',
    formulaVidaDesc: ": 1 ÷ (1 − retenció). És la suma de la sèrie 1 + r + r² + …, és a dir, els anys que s'espera que continue comprant.",
    formulaLtvTitle: 'LTV',
    formulaLtvDesc: ": compra mitjana × compres a l'any × marge × vida mitjana. Es compta el marge, no la facturació.",
    formulaPaybackTitle: 'Payback',
    formulaPaybackDesc: ': CAC ÷ (marge anual ÷ 12), en mesos.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * Customer acquisition cost against lifetime value.
 *
 * EDMN 2BACH · Unit 6.
 */
export default function MarketingClienteCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [gasto, setGasto] = useState<number>(6000);
  const [clientes, setClientes] = useState<number>(120);
  const [ticket, setTicket] = useState<number>(25);
  const [compras, setCompras] = useState<number>(8);
  const [margenPct, setMargenPct] = useState<number>(40);
  const [retencionPct, setRetencionPct] = useState<number>(75);

  const entradas: Entradas = {
    gastoMarketing: gasto,
    nuevosClientes: clientes,
    ticketMedio: ticket,
    comprasAnio: compras,
    margenBruto: margenPct / 100,
    retencion: retencionPct / 100,
  };
  const r = useMemo(() => analizar(entradas), [gasto, clientes, ticket, compras, margenPct, retencionPct]);

  const aplicar = (v: [number, number, number, number, number, number]) => {
    setGasto(v[0]); setClientes(v[1]); setTicket(v[2]); setCompras(v[3]); setMargenPct(v[4]); setRetencionPct(v[5]);
  };

  // The two bars share a scale so the comparison is honest.
  const escala = r.valido ? Math.max(r.cac, r.ltv) : 1;

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([6000, 120, 25, 8, 40, 75])}>{t.presetTienda}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([9000, 300, 12, 12, 70, 60])}>{t.presetSuscripcion}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([30000, 120, 25, 4, 35, 40])}>{t.presetMalo}</button>
      </div>

      <div class="mc__label">{t.captacionTitulo}</div>
      <div class="calc__form mc__row">
        <label class="calc__field">
          <span class="calc__label">{t.gasto}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={500} value={gasto} onInput={(e) => setGasto(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.clientes}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={clientes} onInput={(e) => setClientes(num(e))} />
          </div>
        </label>
      </div>

      <div class="mc__label">{t.clienteTitulo}</div>
      <div class="calc__form mc__row">
        <label class="calc__field">
          <span class="calc__label">{t.ticket}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={5} value={ticket} onInput={(e) => setTicket(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.compras}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={1} value={compras} onInput={(e) => setCompras(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.margen}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={100} step={5} value={margenPct} onInput={(e) => setMargenPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.retencion}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={99} step={5} value={retencionPct} onInput={(e) => setRetencionPct(num(e))} />
          </div>
        </label>
      </div>
      <p class="mc__note">{t.retencionAyuda}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.cac}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.cac)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.ltv}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.ltv)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.ratio}</span>
                <span class={`calc__metric-mini-value ${r.veredicto === 'sano' ? 'ok' : r.veredicto === 'perdida' ? 'fail' : ''}`}>
                  × {formatNumber(r.ratio, 2)}
                </span>
              </div>
            </div>

            <div class="mc__panel">
              <div class="mc__label">{t.barraTitulo}</div>
              <div class="mc__bar-row">
                <span class="mc__bar-label">{t.barraCac}</span>
                <span class="mc__bar mc__bar--cac" style={`width:${(r.cac / escala) * 100}%`} />
                <span class="mc__bar-value">{formatEUR(r.cac, 0)}</span>
              </div>
              <div class="mc__bar-row">
                <span class="mc__bar-label">{t.barraLtv}</span>
                <span class="mc__bar mc__bar--ltv" style={`width:${(r.ltv / escala) * 100}%`} />
                <span class="mc__bar-value">{formatEUR(r.ltv, 0)}</span>
              </div>
              <p class={`mc__verdict ${r.veredicto}`}>
                {r.veredicto === 'perdida' ? t.veredictoPerdida : r.veredicto === 'ajustado' ? t.veredictoAjustado : t.veredictoSano}
              </p>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.ingresoAnual}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.ingresoAnualCliente, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.margenAnual}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.margenAnualCliente, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.vidaMedia}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.vidaMedia, 1)}</span>
              </div>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.payback}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.paybackMeses, 1)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.margen}</span>
                <span class="calc__metric-mini-value">{formatPercent(entradas.margenBruto)}</span>
              </div>
            </div>

            <p class="mc__note">{t.lecturaRatio}</p>
            <p class="mc__note">{t.lecturaPayback}</p>

            <div class="mc__panel">
              <div class="mc__label">{t.palancasTitulo}</div>
              <p class="mc__note">{t.palancas}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaCacTitle}</strong>{t.formulaCacDesc}</p>
            <p><strong>{t.formulaVidaTitle}</strong>{t.formulaVidaDesc}</p>
            <p><strong>{t.formulaLtvTitle}</strong>{t.formulaLtvDesc}</p>
            <p><strong>{t.formulaPaybackTitle}</strong>{t.formulaPaybackDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .mc__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .mc__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .mc__row { grid-template-columns: 1fr; } }
        .mc__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .mc__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .mc__bar-row {
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.5rem;
        }
        .mc__bar-label, .mc__bar-value {
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .mc__bar { display: block; height: 12px; border-radius: 3px; min-width: 3px; }
        .mc__bar--cac { background: var(--color-terra, #C44E2C); }
        .mc__bar--ltv { background: var(--color-mustard, #D4A24C); }
        .mc__verdict {
          margin-top: 0.9rem;
          padding: 0.5rem 0.8rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
          background: var(--color-cream, #F5EDD9);
        }
        .mc__verdict.sano { border-color: #4F8C3F; }
        .mc__verdict.perdida { border-color: #B83A3A; }
      `}</style>
    </div>
  );
}
