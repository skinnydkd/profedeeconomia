/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber } from '../../lib/calc/format';
import { clasificar, paraBajarDeTramo, UMBRALES, type Entrada, type Sector, type Propiedad, type Ambito } from '../../lib/calc/clasifica-empresa';

/** UI strings, Valencian (AVL) alongside the ES source. PYME stays PYME. */
export const COPY = {
  es: {
    intro: 'Clasificar una empresa no es un ejercicio de etiquetas: el tamaño decide a qué ayudas puede optar, qué obligaciones contables tiene y con qué se la compara. Escribe los tres datos y mira dónde cae.',
    datosTitulo: 'Los tres datos que fija la norma',
    empleados: 'Personas empleadas (media anual)',
    facturacion: 'Facturación anual (€)',
    balance: 'Total del balance (€)',
    otrosTitulo: 'Los otros criterios de clasificación',
    sector: 'Sector',
    propiedad: 'Propiedad del capital',
    ambito: 'Ámbito geográfico',
    sectores: { primario: 'Primario: extrae del medio natural', secundario: 'Secundario: transforma', terciario: 'Terciario: presta servicios' },
    propiedades: { privada: 'Privada', publica: 'Pública', mixta: 'Mixta' },
    ambitos: { local: 'Local o regional', nacional: 'Nacional', multinacional: 'Multinacional' },
    resultadoTitulo: 'Cómo se clasifica',
    tamanos: { micro: 'Microempresa', pequena: 'Pequeña empresa', mediana: 'Mediana empresa', grande: 'Gran empresa' },
    esPyme: 'Es PYME',
    noPyme: 'No es PYME',
    si: 'Sí',
    no: 'No',
    limitaEmpleados: 'Lo que la saca de PYME es la plantilla: con 250 personas o más ya es gran empresa, aunque facture poco.',
    limitaFinanciero: 'La plantilla cabría en mediana, pero superan a la vez el techo de facturación y el de balance.',
    paraBajar: 'Para entrar en el tramo de {tramo} necesitaría como mucho {empleados} personas y no superar los {facturacion} de facturación (o quedarse por debajo del techo de balance).',
    reglaTitulo: 'La regla tiene una forma que sorprende',
    regla: 'El límite de plantilla es obligatorio por sí solo: si lo superas, subes de tramo aunque el dinero cuadre. En cambio la facturación y el balance son alternativos: basta con cumplir uno de los dos. Por eso una empresa puede facturar 3 millones y seguir siendo microempresa.',
    tablaTitulo: 'Los umbrales',
    colTramo: 'Tramo',
    colEmpleados: 'Personas (menos de)',
    colFacturacion: 'Facturación (hasta)',
    colBalance: 'Balance (hasta)',
    fuente: 'Umbrales de la Recomendación 2003/361/CE de la Comisión Europea, que es la definición que se usa para ayudas, estadísticas y programas europeos.',
    porQueImporta: 'Por qué importa el tramo',
    porQueImportaTexto: 'De la categoría dependen cosas concretas: el acceso a determinadas subvenciones y programas, si se puede presentar cuentas abreviadas, si hace falta auditoría y con qué grupo se compara la empresa en cualquier estadística sectorial.',
    sinDatos: 'Revisa los datos: las tres cifras tienen que ser números de cero para arriba.',
    presets: 'Ejemplos',
    presetTaller: 'Taller de barrio',
    presetIndustria: 'Industria mediana',
    presetGrande: 'Gran empresa',
  },
  ca: {
    intro: "Classificar una empresa no és un exercici d'etiquetes: la grandària decidix a quines ajudes pot optar, quines obligacions comptables té i amb què se la compara. Escriu les tres dades i mira on cau.",
    datosTitulo: 'Les tres dades que fixa la norma',
    empleados: 'Persones emprades (mitjana anual)',
    facturacion: 'Facturació anual (€)',
    balance: 'Total del balanç (€)',
    otrosTitulo: 'Els altres criteris de classificació',
    sector: 'Sector',
    propiedad: 'Propietat del capital',
    ambito: 'Àmbit geogràfic',
    sectores: { primario: 'Primari: extrau del medi natural', secundario: 'Secundari: transforma', terciario: 'Terciari: presta servicis' },
    propiedades: { privada: 'Privada', publica: 'Pública', mixta: 'Mixta' },
    ambitos: { local: 'Local o regional', nacional: 'Nacional', multinacional: 'Multinacional' },
    resultadoTitulo: 'Com es classifica',
    tamanos: { micro: 'Microempresa', pequena: 'Empresa xicoteta', mediana: 'Empresa mitjana', grande: 'Gran empresa' },
    esPyme: 'És PIME',
    noPyme: 'No és PIME',
    si: 'Sí',
    no: 'No',
    limitaEmpleados: 'El que la trau de PIME és la plantilla: amb 250 persones o més ja és gran empresa, encara que facture poc.',
    limitaFinanciero: 'La plantilla cabria en mitjana, però superen alhora el sostre de facturació i el de balanç.',
    paraBajar: 'Per a entrar al tram de {tramo} necessitaria com a molt {empleados} persones i no superar els {facturacion} de facturació (o quedar-se per davall del sostre de balanç).',
    reglaTitulo: 'La regla té una forma que sorprén',
    regla: "El límit de plantilla és obligatori per si sol: si el superes, puges de tram encara que els diners quadren. En canvi la facturació i el balanç són alternatius: n'hi ha prou de complir-ne un dels dos. Per això una empresa pot facturar 3 milions i continuar sent microempresa.",
    tablaTitulo: 'Els llindars',
    colTramo: 'Tram',
    colEmpleados: 'Persones (menys de)',
    colFacturacion: 'Facturació (fins a)',
    colBalance: 'Balanç (fins a)',
    fuente: "Llindars de la Recomanació 2003/361/CE de la Comissió Europea, que és la definició que es fa servir per a ajudes, estadístiques i programes europeus.",
    porQueImporta: 'Per què importa el tram',
    porQueImportaTexto: "De la categoria depenen coses concretes: l'accés a determinades subvencions i programes, si es poden presentar comptes abreujats, si cal auditoria i amb quin grup es compara l'empresa en qualsevol estadística sectorial.",
    sinDatos: 'Revisa les dades: les tres xifres han de ser números de zero cap amunt.',
    presets: 'Exemples',
    presetTaller: 'Taller de barri',
    presetIndustria: 'Indústria mitjana',
    presetGrande: 'Gran empresa',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const sel = (e: Event) => (e.currentTarget as HTMLSelectElement).value;

const PRESETS: Record<string, Entrada> = {
  taller: { empleados: 4, facturacion: 260_000, balance: 180_000, sector: 'terciario', propiedad: 'privada', ambito: 'local' },
  industria: { empleados: 120, facturacion: 24_000_000, balance: 19_000_000, sector: 'secundario', propiedad: 'privada', ambito: 'nacional' },
  grande: { empleados: 900, facturacion: 180_000_000, balance: 140_000_000, sector: 'secundario', propiedad: 'privada', ambito: 'multinacional' },
};

export default function ClasificaEmpresaCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [e, setE] = useState<Entrada>(PRESETS.taller);

  const r = useMemo(() => clasificar(e), [e]);
  const bajar = useMemo(() => paraBajarDeTramo(e), [e]);
  const set = (k: keyof Entrada, v: number | string) => setE((p) => ({ ...p, [k]: v }));

  return (
    <div class="calc">
      <p class="ce__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setE(PRESETS.taller)}>{t.presetTaller}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setE(PRESETS.industria)}>{t.presetIndustria}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setE(PRESETS.grande)}>{t.presetGrande}</button>
      </div>

      <div class="ce__label">{t.datosTitulo}</div>
      <div class="calc__form ce__row">
        <label class="calc__field">
          <span class="calc__label">{t.empleados}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={1} value={e.empleados} onInput={(ev) => set('empleados', num(ev))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.facturacion}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={10000} value={e.facturacion} onInput={(ev) => set('facturacion', num(ev))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.balance}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={10000} value={e.balance} onInput={(ev) => set('balance', num(ev))} /></div>
        </label>
      </div>

      <div class="ce__label">{t.otrosTitulo}</div>
      <div class="calc__form ce__row">
        <label class="calc__field">
          <span class="calc__label">{t.sector}</span>
          <div class="calc__input-wrap">
            <select value={e.sector ?? 'terciario'} onChange={(ev) => set('sector', sel(ev) as Sector)}>
              {(Object.keys(t.sectores) as Sector[]).map((k) => <option value={k} key={k}>{t.sectores[k]}</option>)}
            </select>
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.propiedad}</span>
          <div class="calc__input-wrap">
            <select value={e.propiedad ?? 'privada'} onChange={(ev) => set('propiedad', sel(ev) as Propiedad)}>
              {(Object.keys(t.propiedades) as Propiedad[]).map((k) => <option value={k} key={k}>{t.propiedades[k]}</option>)}
            </select>
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.ambito}</span>
          <div class="calc__input-wrap">
            <select value={e.ambito ?? 'local'} onChange={(ev) => set('ambito', sel(ev) as Ambito)}>
              {(Object.keys(t.ambitos) as Ambito[]).map((k) => <option value={k} key={k}>{t.ambitos[k]}</option>)}
            </select>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="ce__label">{t.resultadoTitulo}</div>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.tablaTitulo}</span>
                <span class="calc__metric-mini-value">{t.tamanos[r.tamano]}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{r.esPyme ? t.esPyme : t.noPyme}</span>
                <span class={`calc__metric-mini-value ${r.esPyme ? 'ok' : 'fail'}`}>{r.esPyme ? t.si : t.no}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.sector}</span>
                <span class="calc__metric-mini-value">{t.sectores[e.sector ?? 'terciario'].split(':')[0]}</span>
              </div>
            </div>

            {r.criterioLimitante && (
              <div class="calc__tip calc__tip--warn">
                {r.criterioLimitante === 'empleados' ? t.limitaEmpleados : t.limitaFinanciero}
              </div>
            )}

            {bajar && (
              <p class="ce__note">
                {t.paraBajar
                  .replace('{tramo}', t.tamanos[bajar.tamano])
                  .replace('{empleados}', formatNumber(bajar.empleadosMax, 0))
                  .replace('{facturacion}', formatEUR(bajar.facturacionMax, 0))}
              </p>
            )}

            <div class="ce__panel">
              <div class="ce__label">{t.tablaTitulo}</div>
              <div class="ce__scroll">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th scope="col">{t.colTramo}</th>
                      <th scope="col">{t.colEmpleados}</th>
                      <th scope="col">{t.colFacturacion}</th>
                      <th scope="col">{t.colBalance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UMBRALES.map((u) => (
                      <tr key={u.tamano} class={r.tamano === u.tamano ? 'ce__fila--activa' : undefined}>
                        <th scope="row">{t.tamanos[u.tamano]}</th>
                        <td>{formatNumber(u.empleados, 0)}</td>
                        <td>{formatEUR(u.facturacion, 0)}</td>
                        <td>{formatEUR(u.balance, 0)}</td>
                      </tr>
                    ))}
                    <tr class={r.tamano === 'grande' ? 'ce__fila--activa' : undefined}>
                      <th scope="row">{t.tamanos.grande}</th>
                      <td colSpan={3}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="ce__note">{t.fuente}</p>
            </div>

            <div class="calc__tip calc__tip--info">
              <strong>{t.reglaTitulo}</strong> {t.regla}
            </div>
            <div class="calc__tip calc__tip--info">
              <strong>{t.porQueImporta}</strong> {t.porQueImportaTexto}
            </div>
          </>
        )}
      </div>

      <style>{`
        .ce__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .ce__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .ce__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.7rem; }
        .ce__scroll { overflow-x: auto; }
        .ce__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 560px) { .ce__row { grid-template-columns: 1fr; } }
        .ce__panel {
          margin-top: 1.4rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .ce__fila--activa { background: var(--color-soft, #F8E8D0); }
      `}</style>
    </div>
  );
}
