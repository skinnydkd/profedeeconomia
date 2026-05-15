/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

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
export default function RatiosCalc() {
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
      <div class="calc__sub">Activo</div>
      <div class="calc__form">
        <NumberField label="Activo no corriente" value={anc} setValue={setAnc} unit="mil €" />
        <NumberField label="Existencias" value={existencias} setValue={setExistencias} unit="mil €" />
        <NumberField label="Realizable (clientes)" value={realizable} setValue={setRealizable} unit="mil €" />
        <NumberField label="Disponible (caja + bancos)" value={disponible} setValue={setDisponible} unit="mil €" />
      </div>

      <div class="calc__sub">Patrimonio neto y pasivo</div>
      <div class="calc__form">
        <NumberField label="Patrimonio neto" value={pn} setValue={setPn} unit="mil €" />
        <NumberField label="Pasivo no corriente" value={pnc} setValue={setPnc} unit="mil €" />
        <NumberField label="Pasivo corriente" value={pc} setValue={setPc} unit="mil €" />
      </div>

      <div class="calc__sub">Cuenta de resultados</div>
      <div class="calc__form">
        <NumberField label="BAII (Resultado de explotación)" value={baii} setValue={setBaii} unit="mil €" />
        <NumberField label="Beneficio neto" value={beneficioNeto} setValue={setBeneficioNeto} unit="mil €" />
      </div>

      <div class="calc__results">
        <div class={`calc__warning ${r.cuadra ? 'is-ok' : ''}`}>
          {r.cuadra
            ? `✓ El balance cuadra: ${r.activoTotal} mil € en ambos lados.`
            : `⚠ El balance NO cuadra. Activo: ${r.activoTotal} mil € · PN+Pasivo: ${r.pnPasivoTotal} mil €. Diferencia: ${(r.activoTotal - r.pnPasivoTotal).toFixed(0)} mil €.`}
        </div>

        <div class="calc__sub">Equilibrio</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label="Fondo de maniobra" value={`${r.fondoManiobra} mil €`} ok={r.fondoManiobra > 0} comentario={comentaFM(r.fondoManiobra)} />
        </div>

        <div class="calc__sub">Ratios financieros</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label="Liquidez general" value={fmtRatio(r.liquidezGeneral)} ok={diagRatio(r.liquidezGeneral, [1.5, 2])} comentario="Sano: 1,5 – 2" />
          <Metric label="Tesorería (acid test)" value={fmtRatio(r.acidTest)} ok={diagRatio(r.acidTest, [0.8, 1.2])} comentario="Sano: ≈ 1" />
          <Metric label="Disponibilidad" value={fmtRatio(r.disponibilidad)} ok={diagRatio(r.disponibilidad, [0.1, 0.3])} comentario="Sano: 0,1 – 0,3" />
          <Metric label="Solvencia" value={fmtRatio(r.solvencia)} ok={r.solvencia !== null && r.solvencia > 1.5} comentario="Sano: > 1,5" />
          <Metric label="Endeudamiento" value={fmtPct(r.endeudamiento)} ok={diagRatio(r.endeudamiento, [0.4, 0.6])} comentario="Sano: 40 – 60 %" />
        </div>

        <div class="calc__sub">Rentabilidades</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <Metric label="ROA (rentabilidad económica)" value={r.roa === null ? '—' : `${r.roa.toFixed(2).replace('.', ',')} %`} ok={r.roa !== null && r.roa > 5} comentario="Eficiencia operativa del activo" />
          <Metric label="ROE (rentabilidad financiera)" value={r.roe === null ? '—' : `${r.roe.toFixed(2).replace('.', ',')} %`} ok={r.roe !== null && r.roe > 8} comentario="Rendimiento del capital aportado por los socios" />
          <Metric label="Apalancamiento (ROE − ROA)" value={r.roe !== null && r.roa !== null ? `${(r.roe - r.roa).toFixed(2).replace('.', ',')} pp` : '—'} ok={r.roe !== null && r.roa !== null && r.roe > r.roa} comentario="Positivo: la deuda aporta valor a los socios" />
        </div>

        <details class="calc__details">
          <summary>Cómo se calcula cada ratio</summary>
          <div class="calc__formula">
            <p><strong>Fondo de maniobra</strong> = Activo corriente − Pasivo corriente</p>
            <p><strong>Liquidez general</strong> = AC / PC. <em>Por debajo de 1, la empresa no cubre sus deudas a corto plazo.</em></p>
            <p><strong>Acid test</strong> = (AC − Existencias) / PC. <em>Excluye las existencias porque no siempre se convierten rápido en caja.</em></p>
            <p><strong>Disponibilidad</strong> = Disponible / PC. <em>Tesorería líquida disponible para pagar lo más urgente.</em></p>
            <p><strong>Solvencia</strong> = Activo / Pasivo total. <em>Por debajo de 1, quiebra técnica.</em></p>
            <p><strong>Endeudamiento</strong> = Pasivo / (PN + Pasivo). <em>Cuánto del balance está financiado con deuda.</em></p>
            <p><strong>ROA</strong> = BAII / Activo total. <em>Mide la eficiencia del activo independientemente de cómo se haya financiado.</em></p>
            <p><strong>ROE</strong> = Beneficio neto / Patrimonio neto. <em>Mide el rendimiento que obtienen los accionistas.</em></p>
            <p><strong>Apalancamiento financiero</strong>: si ROA &gt; coste de la deuda, el ROE supera al ROA y la empresa rentabiliza la deuda; si ROA &lt; coste de la deuda, ocurre lo contrario.</p>
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
function comentaFM(fm: number): string {
  if (fm > 0) return 'Equilibrio sano';
  if (fm === 0) return 'Frágil';
  return 'Desequilibrio (señal de alarma en la mayoría de sectores)';
}
