// Word bank for Insider — Spanish economic terms.
// Ported from webpde/insider.html (original was trilingual CA/ES/EN; MVP is ES only).
// 70 terms across 5 categories: macro, micro, finances, empresa, fiscal.
//
// Canonical source of truth: imported both by the PartyKit server
// (party/insider/words.ts re-exports this) and by the print-and-play page
// (/juegos/insider/imprimir/), so the printed word cards always match the game.

export type WordCategory = 'macro' | 'micro' | 'finances' | 'empresa' | 'fiscal';

export interface Word {
  term: string;
  cat: WordCategory;
}

export const WORD_BANK: Word[] = [
  // Macroeconomía (15)
  { term: 'Inflación', cat: 'macro' },
  { term: 'Deflación', cat: 'macro' },
  { term: 'PIB', cat: 'macro' },
  { term: 'Desempleo', cat: 'macro' },
  { term: 'Recesión', cat: 'macro' },
  { term: 'Estanflación', cat: 'macro' },
  { term: 'Deuda pública', cat: 'macro' },
  { term: 'Superávit', cat: 'macro' },
  { term: 'Déficit', cat: 'macro' },
  { term: 'Política monetaria', cat: 'macro' },
  { term: 'Política fiscal', cat: 'macro' },
  { term: 'Tipo de interés', cat: 'macro' },
  { term: 'Crecimiento económico', cat: 'macro' },
  { term: 'Ciclo económico', cat: 'macro' },
  { term: 'Globalización', cat: 'macro' },

  // Microeconomía (15)
  { term: 'Monopolio', cat: 'micro' },
  { term: 'Oligopolio', cat: 'micro' },
  { term: 'Oferta', cat: 'micro' },
  { term: 'Demanda', cat: 'micro' },
  { term: 'Elasticidad', cat: 'micro' },
  { term: 'Coste de oportunidad', cat: 'micro' },
  { term: 'Economías de escala', cat: 'micro' },
  { term: 'Externalidad', cat: 'micro' },
  { term: 'Bien público', cat: 'micro' },
  { term: 'Rendimientos decrecientes', cat: 'micro' },
  { term: 'Competencia perfecta', cat: 'micro' },
  { term: 'Equilibrio de mercado', cat: 'micro' },
  { term: 'Coste marginal', cat: 'micro' },
  { term: 'Utilidad marginal', cat: 'micro' },
  { term: 'Ventaja comparativa', cat: 'micro' },

  // Finanzas (15)
  { term: 'Hipoteca', cat: 'finances' },
  { term: 'Acción', cat: 'finances' },
  { term: 'Bono', cat: 'finances' },
  { term: 'Dividendo', cat: 'finances' },
  { term: 'Fondo de inversión', cat: 'finances' },
  { term: 'Bitcoin', cat: 'finances' },
  { term: 'Interés compuesto', cat: 'finances' },
  { term: 'Tipo de cambio', cat: 'finances' },
  { term: 'Bolsa', cat: 'finances' },
  { term: 'Tarjeta de crédito', cat: 'finances' },
  { term: 'Préstamo', cat: 'finances' },
  { term: 'Amortización', cat: 'finances' },
  { term: 'Diversificación', cat: 'finances' },
  { term: 'Rentabilidad', cat: 'finances' },
  { term: 'Liquidez', cat: 'finances' },

  // Empresa (15)
  { term: 'Emprendedor', cat: 'empresa' },
  { term: 'Franquicia', cat: 'empresa' },
  { term: 'Patente', cat: 'empresa' },
  { term: 'Marketing', cat: 'empresa' },
  { term: 'Publicidad', cat: 'empresa' },
  { term: 'Cuenta de resultados', cat: 'empresa' },
  { term: 'Balance', cat: 'empresa' },
  { term: 'Cash flow', cat: 'empresa' },
  { term: 'Start-up', cat: 'empresa' },
  { term: 'Productividad', cat: 'empresa' },
  { term: 'Salario mínimo', cat: 'empresa' },
  { term: 'Subcontratación', cat: 'empresa' },
  { term: 'Fusión', cat: 'empresa' },
  { term: 'Adquisición', cat: 'empresa' },
  { term: 'Logística', cat: 'empresa' },

  // Fiscal (10)
  { term: 'IVA', cat: 'fiscal' },
  { term: 'IRPF', cat: 'fiscal' },
  { term: 'Impuesto', cat: 'fiscal' },
  { term: 'Arancel', cat: 'fiscal' },
  { term: 'Subvención', cat: 'fiscal' },
  { term: 'Presupuesto', cat: 'fiscal' },
  { term: 'Evasión fiscal', cat: 'fiscal' },
  { term: 'Contribuyente', cat: 'fiscal' },
  { term: 'Base imponible', cat: 'fiscal' },
  { term: 'Cuota tributaria', cat: 'fiscal' },
];

// Flat array of terms — this is the primary export used by game logic.
export const WORDS: string[] = WORD_BANK.map((w) => w.term);

export const CATEGORY_LABEL: Record<WordCategory, string> = {
  macro: 'Macroeconomía',
  micro: 'Microeconomía',
  finances: 'Finanzas',
  empresa: 'Empresa',
  fiscal: 'Fiscalidad',
};
