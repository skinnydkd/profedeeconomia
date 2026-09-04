/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { comparar, FORMAS, type FormaId } from '../../lib/calc/forma-juridica';

/** UI strings, Valencian (AVL) alongside the ES source. IRPF and IS stay as-is. */
export const COPY = {
  es: {
    intro: 'Elegir forma jurídica es responder a tres preguntas: con qué patrimonio respondes, cuánto capital hace falta y cómo tributa el beneficio. Las dos primeras las fija la ley; la tercera depende de cuánto ganes.',
    formasTitulo: 'Las cuatro formas básicas',
    colForma: 'Forma',
    colResponsabilidad: 'Responsabilidad',
    colCapital: 'Capital mínimo',
    colSocios: 'Socios mínimos',
    colTributa: 'El beneficio tributa por',
    nombres: {
      autonomo: 'Empresario individual (autónomo)',
      'comunidad-bienes': 'Comunidad de bienes',
      sl: 'Sociedad limitada',
      cooperativa: 'Cooperativa de trabajo',
    },
    ilimitada: 'Ilimitada: respondes con tu patrimonio personal',
    limitada: 'Limitada al capital aportado',
    sinCapital: 'Sin mínimo legal',
    capitalUno: '1 € (Ley 18/2022; hasta 3.000 € hay reglas de reserva y responsabilidad)',
    irpf: 'IRPF del titular (escala progresiva)',
    sociedades: 'Impuesto de Sociedades (tipo fijo)',
    fiscalTitulo: 'Escala progresiva frente a tipo fijo',
    beneficio: 'Beneficio anual (€)',
    tipoIS: 'Tipo del Impuesto de Sociedades (%)',
    tipoAyuda: 'Este tipo es un dato que introduces tú, no una constante de la herramienta: el tipo general y los regímenes reducidos para entidades pequeñas cambian de un ejercicio a otro. Consulta el vigente en la Agencia Tributaria antes de usar el resultado para algo que no sea clase.',
    cuotaIRPF: 'Con la escala de IRPF',
    cuotaIS: 'Con el tipo fijo',
    tipoMedioIRPF: 'Tipo medio IRPF',
    diferencia: 'Diferencia',
    ahorraSociedad: 'A este beneficio, la sociedad paga menos',
    ahorraAutonomo: 'A este beneficio, la escala de IRPF sale más barata',
    corteTitulo: 'El punto de corte',
    corte: 'Por encima de este beneficio, el tipo fijo cuesta menos que la escala',
    sinCorte: 'Con este tipo fijo no hay punto de corte: la escala progresiva es más barata en todo el rango, porque el tipo fijo supera al marginal más alto.',
    graficoTitulo: 'Cuota según el beneficio',
    graficoAria: 'Curva de la cuota de IRPF frente a la recta del tipo fijo, según el beneficio',
    sinDatos: 'Revisa los datos: el beneficio no puede ser negativo y el tipo tiene que estar entre 0 y 100 %.',
    avisoTitulo: 'Lo que esta comparación no dice',
    aviso: 'Solo compara cómo tributa el beneficio, y con la escala estatal del IRPF: no incluye la mitad autonómica, ni la cuota de autónomos, ni el sueldo que el socio puede cobrarse de su propia sociedad, ni los costes de constituir y mantener una sociedad. En la práctica la fiscalidad casi nunca es la razón principal para elegir: la responsabilidad lo es.',
    decisionTitulo: 'La pregunta que decide',
    decision: 'Antes de mirar impuestos: ¿la actividad puede generar una deuda o un daño mayor que lo que aportas? Si la respuesta es sí —manipulas alimentos, tienes local abierto al público, contratas personal—, limitar la responsabilidad pesa más que cualquier diferencia de tipo.',
    comoSeCalcula: 'Cómo se calcula',
    formulaEscalaTitle: 'Escala progresiva',
    formulaEscalaDesc: ': cada tramo se aplica solo a la parte del beneficio que cae dentro de él, no al total. Por eso el tipo medio siempre es menor que el marginal.',
    formulaCorteTitle: 'Punto de corte',
    formulaCorteDesc: ': el beneficio en el que la cuota de la escala iguala a beneficio × tipo fijo. Por debajo gana la escala, por encima gana el tipo fijo.',
  },
  ca: {
    intro: 'Triar forma jurídica és respondre tres preguntes: amb quin patrimoni respons, quant de capital cal i com tributa el benefici. Les dues primeres les fixa la llei; la tercera depén de quant guanyes.',
    formasTitulo: 'Les quatre formes bàsiques',
    colForma: 'Forma',
    colResponsabilidad: 'Responsabilitat',
    colCapital: 'Capital mínim',
    colSocios: 'Socis mínims',
    colTributa: 'El benefici tributa per',
    nombres: {
      autonomo: 'Empresari individual (autònom)',
      'comunidad-bienes': 'Comunitat de béns',
      sl: 'Societat limitada',
      cooperativa: 'Cooperativa de treball',
    },
    ilimitada: 'Il·limitada: respons amb el teu patrimoni personal',
    limitada: 'Limitada al capital aportat',
    sinCapital: 'Sense mínim legal',
    capitalUno: '1 € (Llei 18/2022; fins a 3.000 € hi ha regles de reserva i responsabilitat)',
    irpf: 'IRPF del titular (escala progressiva)',
    sociedades: 'Impost de Societats (tipus fix)',
    fiscalTitulo: 'Escala progressiva enfront de tipus fix',
    beneficio: 'Benefici anual (€)',
    tipoIS: "Tipus de l'Impost de Societats (%)",
    tipoAyuda: "Este tipus és una dada que introduïxes tu, no una constant de la ferramenta: el tipus general i els règims reduïts per a entitats xicotetes canvien d'un exercici a un altre. Consulta el vigent a l'Agència Tributària abans de fer servir el resultat per a alguna cosa que no siga classe.",
    cuotaIRPF: "Amb l'escala d'IRPF",
    cuotaIS: 'Amb el tipus fix',
    tipoMedioIRPF: 'Tipus mitjà IRPF',
    diferencia: 'Diferència',
    ahorraSociedad: 'A este benefici, la societat paga menys',
    ahorraAutonomo: "A este benefici, l'escala d'IRPF ix més barata",
    corteTitulo: 'El punt de tall',
    corte: 'Per damunt d\'este benefici, el tipus fix costa menys que l\'escala',
    sinCorte: "Amb este tipus fix no hi ha punt de tall: l'escala progressiva és més barata en tot el rang, perquè el tipus fix supera el marginal més alt.",
    graficoTitulo: 'Quota segons el benefici',
    graficoAria: "Corba de la quota d'IRPF enfront de la recta del tipus fix, segons el benefici",
    sinDatos: 'Revisa les dades: el benefici no pot ser negatiu i el tipus ha d\'estar entre 0 i 100 %.',
    avisoTitulo: 'El que esta comparació no diu',
    aviso: "Només compara com tributa el benefici, i amb l'escala estatal de l'IRPF: no inclou la meitat autonòmica, ni la quota d'autònoms, ni el sou que el soci es pot cobrar de la seua pròpia societat, ni els costos de constituir i mantindre una societat. A la pràctica la fiscalitat quasi mai no és la raó principal per a triar: la responsabilitat sí que ho és.",
    decisionTitulo: 'La pregunta que decidix',
    decision: "Abans de mirar impostos: l'activitat pot generar un deute o un dany major que el que aportes? Si la resposta és sí —manipules aliments, tens local obert al públic, contractes personal—, limitar la responsabilitat pesa més que qualsevol diferència de tipus.",
    comoSeCalcula: 'Com es calcula',
    formulaEscalaTitle: 'Escala progressiva',
    formulaEscalaDesc: ": cada tram s'aplica només a la part del benefici que cau dins d'ell, no al total. Per això el tipus mitjà sempre és menor que el marginal.",
    formulaCorteTitle: 'Punt de tall',
    formulaCorteDesc: ": el benefici en què la quota de l'escala iguala benefici × tipus fix. Per davall guanya l'escala, per damunt guanya el tipus fix.",
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const ORDEN: FormaId[] = ['autonomo', 'comunidad-bienes', 'sl', 'cooperativa'];

export default function FormaJuridicaCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [beneficio, setBeneficio] = useState<number>(40000);
  const [tipoPct, setTipoPct] = useState<number>(25);

  const r = useMemo(() => comparar(beneficio, tipoPct / 100), [beneficio, tipoPct]);

  // Sampled curve for the chart: the scale bends, the flat rate is a straight line.
  const puntos = useMemo(() => {
    const max = Math.max(80000, beneficio * 1.5);
    return Array.from({ length: 25 }, (_, i) => {
      const b = (max / 24) * i;
      const c = comparar(b, tipoPct / 100);
      return { b, irpf: c.cuotaIRPF, is: c.cuotaIS, max };
    });
  }, [beneficio, tipoPct]);
  const maxCuota = Math.max(...puntos.map((p) => Math.max(p.irpf, p.is)), 1);
  const maxBase = puntos[puntos.length - 1]?.b || 1;
  const path = (key: 'irpf' | 'is') =>
    puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.b / maxBase) * 100} ${100 - (p[key] / maxCuota) * 100}`).join(' ');

  return (
    <div class="calc">
      <p class="fj__intro">{t.intro}</p>

      <div class="fj__label">{t.formasTitulo}</div>
      <div class="fj__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th scope="col">{t.colForma}</th>
              <th scope="col">{t.colResponsabilidad}</th>
              <th scope="col">{t.colCapital}</th>
              <th scope="col">{t.colSocios}</th>
              <th scope="col">{t.colTributa}</th>
            </tr>
          </thead>
          <tbody>
            {ORDEN.map((id) => {
              const f = FORMAS[id];
              return (
                <tr key={id}>
                  <th scope="row">{t.nombres[id]}</th>
                  <td class={f.responsabilidadIlimitada ? 'fail' : 'ok'}>
                    {f.responsabilidadIlimitada ? t.ilimitada : t.limitada}
                  </td>
                  <td>{f.capitalMinimo === 0 ? t.sinCapital : t.capitalUno}</td>
                  <td>{f.sociosMinimos}</td>
                  <td>{f.tributacion === 'irpf' ? t.irpf : t.sociedades}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="fj__label">{t.fiscalTitulo}</div>
      <div class="calc__form fj__row">
        <label class="calc__field">
          <span class="calc__label">{t.beneficio}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1000} value={beneficio} onInput={(e) => setBeneficio(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.tipoIS}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={1} value={tipoPct} onInput={(e) => setTipoPct(num(e))} />
          </div>
        </label>
      </div>
      <div class="calc__tip calc__tip--warn">{t.tipoAyuda}</div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.cuotaIRPF}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.cuotaIRPF, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.cuotaIS}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.cuotaIS, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.tipoMedioIRPF}</span>
                <span class="calc__metric-mini-value">{formatPercent(r.tipoMedioIRPF, 1)}</span>
              </div>
            </div>

            <div class={`calc__tip ${r.ahorroSociedad > 0 ? 'calc__tip--ok' : 'calc__tip--info'}`}>
              <strong>{r.ahorroSociedad > 0 ? t.ahorraSociedad : t.ahorraAutonomo}</strong>{' '}
              {t.diferencia}: {formatEUR(Math.abs(r.ahorroSociedad), 0)}
            </div>

            <div class="fj__panel">
              <div class="fj__label">{t.corteTitulo}</div>
              {Number.isFinite(r.beneficioDeCorte) ? (
                <p class="fj__corte">{t.corte}: <strong>{formatEUR(r.beneficioDeCorte, 0)}</strong></p>
              ) : (
                <p class="fj__note">{t.sinCorte}</p>
              )}

              <div class="fj__label">{t.graficoTitulo}</div>
              <svg class="fj__chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={t.graficoAria}>
                <path d={path('irpf')} fill="none" stroke="var(--color-terracotta, #C44E2C)" stroke-width="1.4" vector-effect="non-scaling-stroke" />
                <path d={path('is')} fill="none" stroke="var(--color-mustard, #D4A24C)" stroke-width="1.4" vector-effect="non-scaling-stroke" />
              </svg>
              <div class="fj__legend">
                <span><span class="fj__swatch fj__swatch--irpf" /> {t.cuotaIRPF}</span>
                <span><span class="fj__swatch fj__swatch--is" /> {t.cuotaIS}</span>
              </div>
            </div>

            <div class="calc__tip calc__tip--info">
              <strong>{t.avisoTitulo}</strong> {t.aviso}
            </div>
            <div class="calc__tip calc__tip--warn">
              <strong>{t.decisionTitulo}</strong> {t.decision}
            </div>
          </>
        )}
      </div>

      <details class="calc__details">
        <summary>{t.comoSeCalcula}</summary>
        <ul class="calc__formula">
          <li><strong>{t.formulaEscalaTitle}</strong>{t.formulaEscalaDesc}</li>
          <li><strong>{t.formulaCorteTitle}</strong>{t.formulaCorteDesc}</li>
        </ul>
      </details>

      <style>{`
        .fj__intro {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1rem;
        }
        .fj__label {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868);
          margin: 1.2rem 0 0.5rem;
        }
        .fj__note, .fj__corte {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0.3rem 0 0.8rem;
        }
        .fj__scroll { overflow-x: auto; }
        .fj__row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 560px) { .fj__row { grid-template-columns: 1fr; } }
        .fj__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .fj__chart {
          width: 100%;
          height: 150px;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line-soft, #EFE2CB);
          border-radius: 5px;
        }
        .fj__legend {
          display: flex;
          gap: 1.2rem;
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .fj__swatch { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 0.35rem; }
        .fj__swatch--irpf { background: var(--color-terracotta, #C44E2C); }
        .fj__swatch--is { background: var(--color-mustard, #D4A24C); }
      `}</style>
    </div>
  );
}
