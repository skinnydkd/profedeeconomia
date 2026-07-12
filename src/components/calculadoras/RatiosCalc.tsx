/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation and
 * acronyms (AC, PC, PN, PNC, ANC, BAII, ROA, ROE, €, %, pp, "acid test") and
 * the ratio formula operators are not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    subActivo: 'Activo',
    subPnPasivo: 'Patrimonio neto y pasivo',
    subResultados: 'Cuenta de resultados',
    subEquilibrio: 'Equilibrio',
    subRatios: 'Ratios financieros',
    subRentabilidades: 'Rentabilidades',

    fieldAnc: 'Activo no corriente',
    fieldExistencias: 'Existencias',
    fieldRealizable: 'Realizable (clientes)',
    fieldDisponible: 'Disponible (caja + bancos)',
    fieldPn: 'Patrimonio neto',
    fieldPnc: 'Pasivo no corriente',
    fieldPc: 'Pasivo corriente',
    fieldBaii: 'BAII (Resultado de explotación)',
    fieldBeneficioNeto: 'Beneficio neto',

    balanceCuadra: (total: number) => `✓ El balance cuadra: ${total} mil € en ambos lados.`,
    balanceNoCuadra: (activoTotal: number, pnPasivoTotal: number, diff: string) =>
      `⚠ El balance NO cuadra. Activo: ${activoTotal} mil € · PN+Pasivo: ${pnPasivoTotal} mil €. Diferencia: ${diff} mil €.`,

    metricFdm: 'Fondo de maniobra',
    metricLiquidez: 'Liquidez general',
    metricTesoreria: 'Tesorería (acid test)',
    metricDisponibilidad: 'Disponibilidad',
    metricSolvencia: 'Solvencia',
    metricEndeudamiento: 'Endeudamiento',
    metricRoa: 'ROA (rentabilidad económica)',
    metricRoe: 'ROE (rentabilidad financiera)',
    metricApalancamiento: 'Apalancamiento (ROE − ROA)',

    comLiquidez: 'Sano: 1,5 – 2',
    comTesoreria: 'Sano: ≈ 1',
    comDisponibilidad: 'Sano: 0,1 – 0,3',
    comSolvencia: 'Sano: > 1,5',
    comEndeudamiento: 'Sano: 40 – 60 %',
    comRoa: 'Eficiencia operativa del activo',
    comRoe: 'Rendimiento del capital aportado por los socios',
    comApalancamiento: 'Positivo: la deuda aporta valor a los socios',

    fmSano: 'Equilibrio sano',
    fmFragil: 'Frágil',
    fmDesequilibrio: 'Desequilibrio (señal de alarma en la mayoría de sectores)',

    detailsSummary: 'Cómo se calcula cada ratio',
    fFdmName: 'Fondo de maniobra',
    fFdmBody: '= Activo corriente − Pasivo corriente',
    fLiqName: 'Liquidez general',
    fLiqFormula: '= AC / PC.',
    fLiqNote: 'Por debajo de 1, la empresa no cubre sus deudas a corto plazo.',
    fAcidName: 'Acid test',
    fAcidFormula: '= (AC − Existencias) / PC.',
    fAcidNote: 'Excluye las existencias porque no siempre se convierten rápido en caja.',
    fDispName: 'Disponibilidad',
    fDispFormula: '= Disponible / PC.',
    fDispNote: 'Tesorería líquida disponible para pagar lo más urgente.',
    fSolvName: 'Solvencia',
    fSolvFormula: '= Activo / Pasivo total.',
    fSolvNote: 'Por debajo de 1, quiebra técnica.',
    fEndName: 'Endeudamiento',
    fEndFormula: '= Pasivo / (PN + Pasivo).',
    fEndNote: 'Cuánto del balance está financiado con deuda.',
    fRoaName: 'ROA',
    fRoaFormula: '= BAII / Activo total.',
    fRoaNote: 'Mide la eficiencia del activo independientemente de cómo se haya financiado.',
    fRoeName: 'ROE',
    fRoeFormula: '= Beneficio neto / Patrimonio neto.',
    fRoeNote: 'Mide el rendimiento que obtienen los accionistas.',
    fApalName: 'Apalancamiento financiero',
    fApalBody:
      ': si ROA > coste de la deuda, el ROE supera al ROA y la empresa rentabiliza la deuda; si ROA < coste de la deuda, ocurre lo contrario.',
  },
  ca: {
    subActivo: 'Actiu',
    subPnPasivo: 'Patrimoni net i passiu',
    subResultados: 'Compte de resultats',
    subEquilibrio: 'Equilibri',
    subRatios: 'Ràtios financeres',
    subRentabilidades: 'Rendibilitats',

    fieldAnc: 'Actiu no corrent',
    fieldExistencias: 'Existències',
    fieldRealizable: 'Realitzable (clients)',
    fieldDisponible: 'Disponible (caixa + bancs)',
    fieldPn: 'Patrimoni net',
    fieldPnc: 'Passiu no corrent',
    fieldPc: 'Passiu corrent',
    fieldBaii: "BAII (Resultat d'explotació)",
    fieldBeneficioNeto: 'Benefici net',

    balanceCuadra: (total: number) => `✓ El balanç quadra: ${total} mil € als dos costats.`,
    balanceNoCuadra: (activoTotal: number, pnPasivoTotal: number, diff: string) =>
      `⚠ El balanç NO quadra. Actiu: ${activoTotal} mil € · PN+Passiu: ${pnPasivoTotal} mil €. Diferència: ${diff} mil €.`,

    metricFdm: 'Fons de maniobra',
    metricLiquidez: 'Liquiditat general',
    metricTesoreria: 'Tresoreria (acid test)',
    metricDisponibilidad: 'Disponibilitat',
    metricSolvencia: 'Solvència',
    metricEndeudamiento: 'Endeutament',
    metricRoa: 'ROA (rendibilitat econòmica)',
    metricRoe: 'ROE (rendibilitat financera)',
    metricApalancamiento: 'Palanquejament (ROE − ROA)',

    comLiquidez: 'Saludable: 1,5 – 2',
    comTesoreria: 'Saludable: ≈ 1',
    comDisponibilidad: 'Saludable: 0,1 – 0,3',
    comSolvencia: 'Saludable: > 1,5',
    comEndeudamiento: 'Saludable: 40 – 60 %',
    comRoa: "Eficiència operativa de l'actiu",
    comRoe: 'Rendiment del capital aportat pels socis',
    comApalancamiento: 'Positiu: el deute aporta valor als socis',

    fmSano: 'Equilibri sa',
    fmFragil: 'Fràgil',
    fmDesequilibrio: "Desequilibri (senyal d'alarma en la majoria de sectors)",

    detailsSummary: 'Com es calcula cada ràtio',
    fFdmName: 'Fons de maniobra',
    fFdmBody: '= Actiu corrent − Passiu corrent',
    fLiqName: 'Liquiditat general',
    fLiqFormula: '= AC / PC.',
    fLiqNote: "Per davall d'1, l'empresa no cobrix els seus deutes a curt termini.",
    fAcidName: 'Acid test',
    fAcidFormula: '= (AC − Existències) / PC.',
    fAcidNote: 'Exclou les existències perquè no sempre es convertixen ràpid en caixa.',
    fDispName: 'Disponibilitat',
    fDispFormula: '= Disponible / PC.',
    fDispNote: 'Tresoreria líquida disponible per a pagar allò més urgent.',
    fSolvName: 'Solvència',
    fSolvFormula: '= Actiu / Passiu total.',
    fSolvNote: "Per davall d'1, fallida tècnica.",
    fEndName: 'Endeutament',
    fEndFormula: '= Passiu / (PN + Passiu).',
    fEndNote: 'Quina part del balanç està finançada amb deute.',
    fRoaName: 'ROA',
    fRoaFormula: '= BAII / Actiu total.',
    fRoaNote: "Mesura l'eficiència de l'actiu independentment de com s'haja finançat.",
    fRoeName: 'ROE',
    fRoeFormula: '= Benefici net / Patrimoni net.',
    fRoeNote: 'Mesura el rendiment que obtenen els accionistes.',
    fApalName: 'Palanquejament financer',
    fApalBody:
      ": si ROA > cost del deute, el ROE supera el ROA i l'empresa rendibilitza el deute; si ROA < cost del deute, ocorre el contrari.",
  },
} as const;

interface Props { locale?: Locale }

/**
 * Financial ratios calculator (Unit 11).
 *
 * Inputs the five great masses of the balance + a few P&L numbers
 * and outputs:
 *   - Fondo de maniobra
 *   - Ratio de liquidez general
 *   - Ratio de tesorería (acid test)
 *   - Ratio de disponibilidad
 *   - Ratio de solvencia
 *   - Ratio de endeudamiento
 *   - ROA, ROE
 */
export default function RatiosCalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
  // Activo
  const [anc, setAnc] = useState<number>(108);
  const [existencias, setExistencias] = useState<number>(60);
  const [realizable, setRealizable] = useState<number>(50);
  const [disponible, setDisponible] = useState<number>(10);
  // Pasivo + PN
  const [pn, setPn] = useState<number>(80);
  const [pnc, setPnc] = useState<number>(120);
  const [pc, setPc] = useState<number>(140);
  // P&G
  const [baii, setBaii] = useState<number>(36);
  const [beneficioNeto, setBeneficioNeto] = useState<number>(20);

  const r = useMemo(() => {
    const ac = existencias + realizable + disponible;
    const activoTotal = anc + ac;
    const pasivoTotal = pnc + pc;
    const pnPasivoTotal = pn + pasivoTotal;
    const cuadra = Math.abs(activoTotal - pnPasivoTotal) < 0.01;

    const fondoManiobra = ac - pc;
    const liquidezGeneral = pc > 0 ? ac / pc : null;
    const acidTest = pc > 0 ? (ac - existencias) / pc : null;
    const disponibilidad = pc > 0 ? disponible / pc : null;
    const solvencia = pasivoTotal > 0 ? activoTotal / pasivoTotal : null;
    const endeudamiento = pnPasivoTotal > 0 ? pasivoTotal / pnPasivoTotal : null;
    const roa = activoTotal > 0 ? (baii / activoTotal) * 100 : null;
    const roe = pn > 0 ? (beneficioNeto / pn) * 100 : null;

    return {
      ac, activoTotal, pasivoTotal, pnPasivoTotal, cuadra,
      fondoManiobra, liquidezGeneral, acidTest, disponibilidad,
      solvencia, endeudamiento, roa, roe,
    };
  }, [anc, existencias, realizable, disponible, pn, pnc, pc, baii, beneficioNeto]);

  return (
    <div class="calc">
      <div class="calc__sub">{c.subActivo}</div>
      <div class="calc__form">
        <NumberField label={c.fieldAnc} value={anc} setValue={setAnc} unit="mil €" />
        <NumberField label={c.fieldExistencias} value={existencias} setValue={setExistencias} unit="mil €" />
        <NumberField label={c.fieldRealizable} value={realizable} setValue={setRealizable} unit="mil €" />
        <NumberField label={c.fieldDisponible} value={disponible} setValue={setDisponible} unit="mil €" />
      </div>

      <div class="calc__sub">{c.subPnPasivo}</div>
      <div class="calc__form">
        <NumberField label={c.fieldPn} value={pn} setValue={setPn} unit="mil €" />
        <NumberField label={c.fieldPnc} value={pnc} setValue={setPnc} unit="mil €" />
        <NumberField label={c.fieldPc} value={pc} setValue={setPc} unit="mil €" />
      </div>

      <div class="calc__sub">{c.subResultados}</div>
      <div class="calc__form">
        <NumberField label={c.fieldBaii} value={baii} setValue={setBaii} unit="mil €" />
        <NumberField label={c.fieldBeneficioNeto} value={beneficioNeto} setValue={setBeneficioNeto} unit="mil €" />
      </div>

      <div class="calc__results">
        <div class={`calc__warning ${r.cuadra ? 'is-ok' : ''}`}>
          {r.cuadra
            ? c.balanceCuadra(r.activoTotal)
            : c.balanceNoCuadra(r.activoTotal, r.pnPasivoTotal, (r.activoTotal - r.pnPasivoTotal).toFixed(0))}
        </div>

        <div class="calc__sub">{c.subEquilibrio}</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label={c.metricFdm} value={`${r.fondoManiobra} mil €`} ok={r.fondoManiobra > 0} comentario={comentaFM(r.fondoManiobra, locale)} />
        </div>

        <div class="calc__sub">{c.subRatios}</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label={c.metricLiquidez} value={fmtRatio(r.liquidezGeneral)} ok={diagRatio(r.liquidezGeneral, [1.5, 2])} comentario={c.comLiquidez} />
          <Metric label={c.metricTesoreria} value={fmtRatio(r.acidTest)} ok={diagRatio(r.acidTest, [0.8, 1.2])} comentario={c.comTesoreria} />
          <Metric label={c.metricDisponibilidad} value={fmtRatio(r.disponibilidad)} ok={diagRatio(r.disponibilidad, [0.1, 0.3])} comentario={c.comDisponibilidad} />
          <Metric label={c.metricSolvencia} value={fmtRatio(r.solvencia)} ok={r.solvencia !== null && r.solvencia > 1.5} comentario={c.comSolvencia} />
          <Metric label={c.metricEndeudamiento} value={fmtPct(r.endeudamiento)} ok={diagRatio(r.endeudamiento, [0.4, 0.6])} comentario={c.comEndeudamiento} />
        </div>

        <div class="calc__sub">{c.subRentabilidades}</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label={c.metricRoa} value={r.roa === null ? '—' : `${r.roa.toFixed(2).replace('.', ',')} %`} ok={r.roa !== null && r.roa > 5} comentario={c.comRoa} />
          <Metric label={c.metricRoe} value={r.roe === null ? '—' : `${r.roe.toFixed(2).replace('.', ',')} %`} ok={r.roe !== null && r.roe > 8} comentario={c.comRoe} />
          <Metric label={c.metricApalancamiento} value={r.roe !== null && r.roa !== null ? `${(r.roe - r.roa).toFixed(2).replace('.', ',')} pp` : '—'} ok={r.roe !== null && r.roa !== null && r.roe > r.roa} comentario={c.comApalancamiento} />
        </div>

        <details class="calc__details">
          <summary>{c.detailsSummary}</summary>
          <div class="calc__formula">
            <p><strong>{c.fFdmName}</strong> {c.fFdmBody}</p>
            <p><strong>{c.fLiqName}</strong> {c.fLiqFormula} <em>{c.fLiqNote}</em></p>
            <p><strong>{c.fAcidName}</strong> {c.fAcidFormula} <em>{c.fAcidNote}</em></p>
            <p><strong>{c.fDispName}</strong> {c.fDispFormula} <em>{c.fDispNote}</em></p>
            <p><strong>{c.fSolvName}</strong> {c.fSolvFormula} <em>{c.fSolvNote}</em></p>
            <p><strong>{c.fEndName}</strong> {c.fEndFormula} <em>{c.fEndNote}</em></p>
            <p><strong>{c.fRoaName}</strong> {c.fRoaFormula} <em>{c.fRoaNote}</em></p>
            <p><strong>{c.fRoeName}</strong> {c.fRoeFormula} <em>{c.fRoeNote}</em></p>
            <p><strong>{c.fApalName}</strong>{c.fApalBody}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

function NumberField({ label, value, setValue, unit }: { label: string; value: number; setValue: (n: number) => void; unit: string }) {
  return (
    <label class="calc__field">
      <span class="calc__label">{label}</span>
      <div class="calc__input-wrap">
        <input
          type="number"
          step={1}
          value={value}
          onInput={(e) => setValue(parseFloat((e.target as HTMLInputElement).value) || 0)}
        />
        <span class="calc__unit">{unit}</span>
      </div>
    </label>
  );
}

function Metric({ label, value, ok, comentario }: { label: string; value: string; ok: boolean; comentario: string }) {
  return (
    <div class={`calc__metric ${ok ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
      <span class="calc__metric-label">{label}</span>
      <span class="calc__metric-value">{value}</span>
      <span class="calc__metric-detail">{comentario}</span>
    </div>
  );
}

function fmtRatio(n: number | null): string {
  return n === null ? '—' : n.toFixed(2).replace('.', ',');
}
function fmtPct(n: number | null): string {
  return n === null ? '—' : `${(n * 100).toFixed(1).replace('.', ',')} %`;
}
function diagRatio(n: number | null, [lo, hi]: [number, number]): boolean {
  return n !== null && n >= lo && n <= hi * 1.2;
}
function comentaFM(fm: number, locale: Locale): string {
  const c = COPY[locale];
  if (fm > 0) return c.fmSano;
  if (fm === 0) return c.fmFragil;
  return c.fmDesequilibrio;
}
