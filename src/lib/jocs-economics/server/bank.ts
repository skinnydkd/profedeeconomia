// src/lib/jocs-economics/server/bank.ts
// Loader del banc privat + funció de selecció de pregunta amb gradient (spec §5.4).
// El banc s'importa del JSON generat per build-jocs-bank.mjs.

import bankData from '../../../server-only/jocs-bank.json';

export interface Question {
  id: string;
  categoria: 'economia' | 'finances' | 'empresa';
  dificultat: number;
  opciones: string[];
  correcta: number;
  explicacion?: string;
}

export interface BankData {
  preguntas: Question[];
}

const DEFAULT_BANK = bankData as BankData;

// Finestres successives a provar (en aquest ordre) si la prèvia no té candidates
const WINDOWS = [0.5, 1.0, 2.0];

export class BankExhaustedError extends Error {
  constructor() {
    super('bank-exhausted');
    this.name = 'BankExhaustedError';
  }
}

/**
 * Selecciona la propera pregunta basant-se en `targetDifficulty`, excloent `seen`,
 * usant `rng` per a la tria aleatòria entre candidates equivalents.
 *
 * Estratègia (spec §5.4):
 *  1. Filtra preguntes amb |dificultat − target| ≤ 0.5 i id no a `seen`.
 *  2. Si buit, prova ±1.0, després ±2.0.
 *  3. Si encara buit, retorna la més propera no-vista (fallback).
 *  4. Si totes vistes → BankExhaustedError.
 *
 * @param bank — injectable per a tests (default: bank importat del JSON)
 */
export function nextQuestion(
  targetDifficulty: number,
  seen: readonly string[],
  rng: () => number,
  bank: BankData = DEFAULT_BANK,
): Question {
  const seenSet = new Set(seen);
  const available = bank.preguntas.filter((q) => !seenSet.has(q.id));
  if (available.length === 0) throw new BankExhaustedError();

  for (const w of WINDOWS) {
    const candidates = available.filter((q) => Math.abs(q.dificultat - targetDifficulty) <= w);
    if (candidates.length > 0) {
      return candidates[Math.floor(rng() * candidates.length)];
    }
  }

  // Fallback: closest by absolute distance
  const closest = available
    .slice()
    .sort((a, b) => Math.abs(a.dificultat - targetDifficulty) - Math.abs(b.dificultat - targetDifficulty));
  return closest[0];
}

/** Helper per a tests/debug: retorna el banc carregat */
export function getBankInfo(): { total: number; byCategoria: Record<string, number> } {
  const by: Record<string, number> = { economia: 0, finances: 0, empresa: 0 };
  for (const q of DEFAULT_BANK.preguntas) {
    if (by[q.categoria] !== undefined) by[q.categoria]++;
  }
  return { total: DEFAULT_BANK.preguntas.length, byCategoria: by };
}
