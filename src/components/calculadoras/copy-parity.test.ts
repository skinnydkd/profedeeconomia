import { describe, it, expect } from 'vitest';
import { COPY as PuntoMuerto } from './PuntoMuertoCalc';
import { COPY as DCF } from './DCFCalc';
import { COPY as VANTIR } from './VANTIRCalc';
import { COPY as Benchmark } from './RatiosBenchmark';
import { COPY as DAFO } from './DAFOCanvas';
import { COPY as Productividad } from './ProductividadCalc';
import { COPY as Presupuesto503020 } from './CalculadoraPresupuesto503020';
import { COPY as MatrizBCG } from './MatrizBCG';
import { COPY as Ratios } from './RatiosCalc';
import { COPY as IRPF } from './IRPFDeclaracion';
import { COPY as RIASEC } from './RIASECTest';
import { COPY as NominaESO } from './CalculadoraNominaESO';
import { COPY as BusinessModelCanvas } from './BusinessModelCanvas';
import { COPY as BuscadorItinerarios } from './BuscadorItinerarios';
import { COPY as Elasticidad } from './ElasticidadCalc';
import { COPY as Equilibrio } from './EquilibrioCalc';
import { COPY as Multiplicador } from './MultiplicadorGasto';
import { COPY as InteresCompuesto } from './InteresCompuestoCalc';
import { COPY as CocheVsAlternativa } from './CocheVsAlternativa';
import { COPY as PresupuestoUni } from './PresupuestoUni';
import { COPY as GeneradorCVEuropass } from './GeneradorCVEuropass';
import { COPY as ADASSimulator } from './ADASSimulator';
import { COPY as TasasEPA } from './TasasEPACalc';
import { COPY as MatrizDecision } from './MatrizDecision';
import { COPY as FPP } from './FPPCalc';
import { COPY as Externalidad } from './ExternalidadCalc';
import { COPY as MultiplicadorBancario } from './MultiplicadorBancarioCalc';
import { COPY as VentajaComparativa } from './VentajaComparativaCalc';
import { COPY as CuentaResultados } from './CuentaResultadosCalc';
import { COPY as CosteContratacion } from './CosteContratacionCalc';
import { COPY as MarketingCliente } from './MarketingClienteCalc';
import { COPY as Tesoreria } from './TesoreriaCalc';
import { COPY as TamanoMercado } from './TamanoMercadoCalc';
import { COPY as CompraInteligente } from './CompraInteligenteCalc';
import { COPY as EmbudoValidacion } from './EmbudoValidacionCalc';
import { COPY as Semana168 } from './Semana168Calc';
import { COPY as PIBReal } from './PIBRealCalc';
import { COPY as FormaJuridica } from './FormaJuridicaCalc';
import { COPY as ClasificaEmpresa } from './ClasificaEmpresaCalc';
import { COPY as ObjetivosSMART } from './ObjetivosSMARTCalc';
import { COPY as HuellaDigital } from './HuellaDigitalCalc';
import { COPY as RolesEquipo } from './RolesEquipoCalc';
import { COPY as AfirmacionSostenible } from './AfirmacionSostenibleCalc';

/**
 * Every localized island exports a `COPY = { es, ca }`. This guard fails when a
 * string is added to one language and forgotten in the other — without it the
 * missing key would silently render as `undefined` rather than fall back.
 *
 * Add each island here as it is translated.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['PuntoMuertoCalc', PuntoMuerto],
  ['DCFCalc', DCF],
  ['VANTIRCalc', VANTIR],
  ['RatiosBenchmark', Benchmark],
  ['DAFOCanvas', DAFO],
  ['ProductividadCalc', Productividad],
  ['CalculadoraPresupuesto503020', Presupuesto503020],
  ['MatrizBCG', MatrizBCG],
  ['RatiosCalc', Ratios],
  ['IRPFDeclaracion', IRPF],
  ['RIASECTest', RIASEC],
  ['CalculadoraNominaESO', NominaESO],
  ['BusinessModelCanvas', BusinessModelCanvas],
  ['BuscadorItinerarios', BuscadorItinerarios],
  ['ElasticidadCalc', Elasticidad],
  ['EquilibrioCalc', Equilibrio],
  ['MultiplicadorGasto', Multiplicador],
  ['InteresCompuestoCalc', InteresCompuesto],
  ['CocheVsAlternativa', CocheVsAlternativa],
  ['PresupuestoUni', PresupuestoUni],
  ['GeneradorCVEuropass', GeneradorCVEuropass],
  ['ADASSimulator', ADASSimulator],
  ['TasasEPACalc', TasasEPA],
  ['MatrizDecision', MatrizDecision],
  ['FPPCalc', FPP],
  ['ExternalidadCalc', Externalidad],
  ['MultiplicadorBancarioCalc', MultiplicadorBancario],
  ['VentajaComparativaCalc', VentajaComparativa],
  ['CuentaResultadosCalc', CuentaResultados],
  ['CosteContratacionCalc', CosteContratacion],
  ['MarketingClienteCalc', MarketingCliente],
  ['TesoreriaCalc', Tesoreria],
  ['TamanoMercadoCalc', TamanoMercado],
  ['CompraInteligenteCalc', CompraInteligente],
  ['EmbudoValidacionCalc', EmbudoValidacion],
  ['Semana168Calc', Semana168],
  ['PIBRealCalc', PIBReal],
  ['FormaJuridicaCalc', FormaJuridica],
  ['ClasificaEmpresaCalc', ClasificaEmpresa],
  ['ObjetivosSMARTCalc', ObjetivosSMART],
  ['HuellaDigitalCalc', HuellaDigital],
  ['RolesEquipoCalc', RolesEquipo],
  ['AfirmacionSostenibleCalc', AfirmacionSostenible],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

/** Some islands nest label maps keyed by a structural id (sector, ratio, …). */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('island COPY parity', () => {
  for (const [name, copy] of ISLANDS) {
    it(`${name}: es and ca have identical key sets`, () => {
      expect(keyPaths(copy.ca).sort()).toEqual(keyPaths(copy.es).sort());
    });

    it(`${name}: no ca value is empty`, () => {
      const walk = (obj: Record<string, unknown>, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'function') continue;
          if (isRecord(value)) walk(value, `${prefix}${key}.`);
          else expect(value, `${name}.ca.${prefix}${key}`).toBeTruthy();
        }
      };
      walk(copy.ca);
    });
  }
});
