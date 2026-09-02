/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber, formatPercent } from '../../lib/calc/format';
import { calcular, type Entradas } from '../../lib/calc/tamano-mercado';

/** UI strings, Valencian (AVL) alongside the ES source. TAM/SAM/SOM are kept. */
export const COPY = {
  es: {
    mercadoTitulo: 'A cuánta gente puedes llegar',
    poblacion: 'Personas que viven en tu zona',
    poblacionAyuda: 'Tu pueblo, tu barrio o tu comarca: hasta donde de verdad podéis llegar. Si el proyecto es del instituto, empieza por el instituto.',
    perfil: 'De esas, las que encajan con tu cliente (%)',
    clienteTitulo: 'Cuánto gasta cada cliente',
    frecuencia: 'Veces que compra al año',
    precio: 'Precio medio de cada compra (€)',
    cuotaTitulo: 'Cuánto crees que puedes captar',
    cuota: 'Parte de esos clientes que crees que serán tuyos (%)',
    cuotaAyuda: 'Sé prudente. Un proyecto de clase que dice que se llevará el 30 % de su mercado está diciendo, sin darse cuenta, que va a ganar a todos los competidores a la vez.',
    objetivo: 'Ingresos que quieres conseguir en un año (€)',
    sinDatos: 'Revisa los datos: la población, la frecuencia y el precio tienen que ser mayores que cero, y los dos porcentajes estar entre 0 y 100 %.',
    tam: 'TAM · todo el mercado',
    tamPie: 'Si comprara todo el mundo de tu zona.',
    sam: 'SAM · el mercado al que puedes llegar',
    samPie: 'Solo las personas que encajan con tu cliente.',
    som: 'SOM · lo que esperas conseguir',
    somPie: 'Tu parte de ese mercado. Es la única cifra con la que se planifica.',
    clientesPerfil: 'Clientes que encajan',
    clientesPropios: 'Clientes que esperas tener',
    somMensual: 'Ingresos al mes',
    objetivoTitulo: 'Y para tu objetivo, ¿cuánta gente hace falta?',
    clientesObjetivo: 'Clientes necesarios',
    cuotaObjetivo: 'Cuota que eso supone',
    objetivoOk: 'El objetivo cabe dentro del mercado al que puedes llegar. Otra cosa es que sea fácil.',
    objetivoImposible: 'El objetivo es mayor que todo el mercado al que puedes llegar: harían falta más clientes de los que existen. No es un fallo del cálculo, es que el plan no cabe.',
    embudoTitulo: 'Las tres cifras, a escala',
    lecturaTitulo: 'Cómo leerlo',
    lectura: 'Un proyecto que dice «nuestro mercado son 47 millones de personas» no ha filtrado nada. El TAM sirve para situarse; el SAM, para saber a quién te diriges de verdad; y el SOM es el único número con el que se hace un presupuesto. Si el SOM mensual no da para pagar lo que cuesta el proyecto, el problema está en el modelo y no en el esfuerzo.',
    presets: 'Ejemplos',
    presetInstituto: 'Servicio dentro del instituto',
    presetPueblo: 'Producto para tu pueblo',
    presetComarca: 'Tienda online comarcal',
    comoSeCalcula: 'Cómo se calcula',
    formulaTamTitle: 'TAM',
    formulaTamDesc: ': población × compras al año × precio medio.',
    formulaSamTitle: 'SAM',
    formulaSamDesc: ': TAM × porcentaje de personas que encajan con tu cliente.',
    formulaSomTitle: 'SOM',
    formulaSomDesc: ': SAM × la cuota que esperas captar.',
    formulaObjetivoTitle: 'Clientes para el objetivo',
    formulaObjetivoDesc: ': ingresos objetivo ÷ (compras al año × precio medio).',
  },
  ca: {
    mercadoTitulo: 'A quanta gent pots arribar',
    poblacion: 'Persones que viuen a la teua zona',
    poblacionAyuda: "El teu poble, el teu barri o la teua comarca: fins on de veritat podeu arribar. Si el projecte és de l'institut, comença per l'institut.",
    perfil: "D'eixes, les que encaixen amb el teu client (%)",
    clienteTitulo: 'Quant gasta cada client',
    frecuencia: "Vegades que compra a l'any",
    precio: 'Preu mitjà de cada compra (€)',
    cuotaTitulo: 'Quant creus que pots captar',
    cuota: "Part d'eixos clients que creus que seran teus (%)",
    cuotaAyuda: "Sigues prudent. Un projecte de classe que diu que s'emportarà el 30 % del seu mercat està dient, sense adonar-se'n, que guanyarà tots els competidors alhora.",
    objetivo: 'Ingressos que vols aconseguir en un any (€)',
    sinDatos: 'Revisa les dades: la població, la freqüència i el preu han de ser majors que zero, i els dos percentatges estar entre 0 i 100 %.',
    tam: 'TAM · tot el mercat',
    tamPie: 'Si comprara tothom de la teua zona.',
    sam: 'SAM · el mercat al qual pots arribar',
    samPie: 'Només les persones que encaixen amb el teu client.',
    som: 'SOM · el que esperes aconseguir',
    somPie: "La teua part d'eixe mercat. És l'única xifra amb què es planifica.",
    clientesPerfil: 'Clients que encaixen',
    clientesPropios: 'Clients que esperes tindre',
    somMensual: 'Ingressos al mes',
    objetivoTitulo: 'I per al teu objectiu, quanta gent fa falta?',
    clientesObjetivo: 'Clients necessaris',
    cuotaObjetivo: 'Quota que això suposa',
    objetivoOk: "L'objectiu cap dins del mercat al qual pots arribar. Una altra cosa és que siga fàcil.",
    objetivoImposible: "L'objectiu és major que tot el mercat al qual pots arribar: farien falta més clients dels que existixen. No és una fallada del càlcul, és que el pla no hi cap.",
    embudoTitulo: 'Les tres xifres, a escala',
    lecturaTitulo: 'Com llegir-ho',
    lectura: "Un projecte que diu «el nostre mercat són 47 milions de persones» no ha filtrat res. El TAM servix per a situar-se; el SAM, per a saber a qui et dirigixes de veritat; i el SOM és l'únic número amb què es fa un pressupost. Si el SOM mensual no dona per a pagar el que costa el projecte, el problema està al model i no a l'esforç.",
    presets: 'Exemples',
    presetInstituto: "Servici dins de l'institut",
    presetPueblo: 'Producte per al teu poble',
    presetComarca: 'Botiga en línia comarcal',
    comoSeCalcula: 'Com es calcula',
    formulaTamTitle: 'TAM',
    formulaTamDesc: ": població × compres a l'any × preu mitjà.",
    formulaSamTitle: 'SAM',
    formulaSamDesc: ': TAM × percentatge de persones que encaixen amb el teu client.',
    formulaSomTitle: 'SOM',
    formulaSomDesc: ': SAM × la quota que esperes captar.',
    formulaObjetivoTitle: "Clients per a l'objectiu",
    formulaObjetivoDesc: ": ingressos objectiu ÷ (compres a l'any × preu mitjà).",
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * TAM, SAM and SOM for a class project, with the reverse question attached:
 * how many customers a revenue target actually needs.
 *
 * Eco 4ESO · Unit 4.
 */
export default function TamanoMercadoCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [poblacion, setPoblacion] = useState<number>(80000);
  const [perfilPct, setPerfilPct] = useState<number>(12);
  const [frecuencia, setFrecuencia] = useState<number>(6);
  const [precio, setPrecio] = useState<number>(15);
  const [cuotaPct, setCuotaPct] = useState<number>(3);
  const [objetivo, setObjetivo] = useState<number>(20000);

  const entradas: Entradas = {
    poblacion, perfil: perfilPct / 100, frecuencia, precio, cuota: cuotaPct / 100, objetivo,
  };
  const r = useMemo(
    () => calcular(entradas),
    [poblacion, perfilPct, frecuencia, precio, cuotaPct, objetivo],
  );

  const aplicar = (v: [number, number, number, number, number, number]) => {
    setPoblacion(v[0]); setPerfilPct(v[1]); setFrecuencia(v[2]); setPrecio(v[3]); setCuotaPct(v[4]); setObjetivo(v[5]);
  };

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([700, 40, 20, 2, 25, 1000])}>{t.presetInstituto}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([12000, 20, 8, 9, 6, 4000])}>{t.presetPueblo}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar([80000, 12, 6, 15, 3, 20000])}>{t.presetComarca}</button>
      </div>

      <div class="tm__label">{t.mercadoTitulo}</div>
      <div class="calc__form tm__row">
        <label class="calc__field">
          <span class="calc__label">{t.poblacion}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={100} value={poblacion} onInput={(e) => setPoblacion(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.perfil}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={100} step={1} value={perfilPct} onInput={(e) => setPerfilPct(num(e))} />
          </div>
        </label>
      </div>
      <p class="tm__note">{t.poblacionAyuda}</p>

      <div class="tm__label">{t.clienteTitulo}</div>
      <div class="calc__form tm__row">
        <label class="calc__field">
          <span class="calc__label">{t.frecuencia}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={1} value={frecuencia} onInput={(e) => setFrecuencia(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.precio}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0.1} step={1} value={precio} onInput={(e) => setPrecio(num(e))} />
          </div>
        </label>
      </div>

      <div class="tm__label">{t.cuotaTitulo}</div>
      <div class="calc__form tm__row">
        <label class="calc__field">
          <span class="calc__label">{t.cuota}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={100} step={1} value={cuotaPct} onInput={(e) => setCuotaPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.objetivo}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={500} value={objetivo} onInput={(e) => setObjetivo(num(e))} />
          </div>
        </label>
      </div>
      <p class="tm__note">{t.cuotaAyuda}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="tm__label">{t.embudoTitulo}</div>
            <div class="tm__funnel">
              {([
                [t.tam, r.tam, t.tamPie, 1],
                [t.sam, r.sam, t.samPie, r.sam / r.tam],
                [t.som, r.som, t.somPie, r.som / r.tam],
              ] as [string, number, string, number][]).map(([nombre, valor, pie, ancho], i) => (
                <div class="tm__level" key={nombre}>
                  <div class="tm__level-head">
                    <span class="tm__level-name">{nombre}</span>
                    <span class="tm__level-value">{formatEUR(valor, 0)}</span>
                  </div>
                  <div class="tm__track">
                    <span class={`tm__fill tm__fill--${i}`} style={`width:${Math.max(0.6, ancho * 100)}%`} />
                  </div>
                  <span class="tm__level-pie">{pie}</span>
                </div>
              ))}
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.clientesPerfil}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.clientesPerfil, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.clientesPropios}</span>
                <span class="calc__metric-mini-value ok">{formatNumber(r.clientesPropios, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.somMensual}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.somMensual, 0)}</span>
              </div>
            </div>

            <div class="tm__panel">
              <div class="tm__label">{t.objetivoTitulo}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.clientesObjetivo}</span>
                  <span class="calc__metric-mini-value">{formatNumber(r.clientesParaObjetivo, 0)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.cuotaObjetivo}</span>
                  <span class={`calc__metric-mini-value ${r.objetivoImposible ? 'fail' : ''}`}>
                    {formatPercent(r.cuotaParaObjetivo)}
                  </span>
                </div>
              </div>
              <p class={`tm__verdict ${r.objetivoImposible ? 'is-fail' : 'is-ok'}`}>
                {r.objetivoImposible ? t.objetivoImposible : t.objetivoOk}
              </p>
            </div>

            <div class="tm__panel">
              <div class="tm__label">{t.lecturaTitulo}</div>
              <p class="tm__note">{t.lectura}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaTamTitle}</strong>{t.formulaTamDesc}</p>
            <p><strong>{t.formulaSamTitle}</strong>{t.formulaSamDesc}</p>
            <p><strong>{t.formulaSomTitle}</strong>{t.formulaSomDesc}</p>
            <p><strong>{t.formulaObjetivoTitle}</strong>{t.formulaObjetivoDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .tm__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .tm__row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .tm__row { grid-template-columns: 1fr; } }
        .tm__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .tm__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .tm__funnel { margin-top: 0.4rem; }
        .tm__level { margin-bottom: 1rem; }
        .tm__level-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.6rem; }
        .tm__level-name {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
        }
        .tm__level-value { font-family: var(--font-mono, monospace); font-size: 0.85rem; }
        .tm__track {
          margin-top: 0.25rem;
          height: 14px;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line-soft, #EFE2CB);
          border-radius: 3px;
          overflow: hidden;
        }
        .tm__fill { display: block; height: 100%; }
        .tm__fill--0 { background: var(--color-line, #E5D4BD); }
        .tm__fill--1 { background: var(--color-mustard, #D4A24C); }
        .tm__fill--2 { background: var(--color-terra, #C44E2C); }
        .tm__level-pie {
          display: block;
          margin-top: 0.2rem;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: var(--color-ink-mute, #8A7868);
        }
        .tm__verdict {
          margin-top: 0.8rem;
          padding: 0.5rem 0.8rem;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
          background: var(--color-cream, #F5EDD9);
        }
        .tm__verdict.is-ok { border-color: #4F8C3F; }
        .tm__verdict.is-fail { border-color: #B83A3A; }
      `}</style>
    </div>
  );
}
