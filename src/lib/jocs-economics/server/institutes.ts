// src/lib/jocs-economics/server/institutes.ts
// Normalitzador d'institut: text → key canònica.
// Mateix institut escrit de N maneres → mateix key.

/**
 * Normalitza el nom d'un institut a una clau canònica:
 *   1. NFD decomposition per separar caràcters base de diacrítics
 *   2. Strip diacrítics combinats (U+0300..U+036F)
 *   3. Lowercase
 *   4. Strip tot el que no siga [a-z0-9]
 *
 * Exemple: "IES Lluís Vives" → "iesluisvives"
 * Exemple: "I.E.S. Lluís Vives" → "iesluisvives"
 */
export function normalizeInstitute(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // strip diacritics combinats
    .toLowerCase()
    .replace(/ll(?=[aeiou])/g, 'l')    // ll+vocal → l (Lluís ≡ Luis; Vell conserva ll)
    .replace(/[^a-z0-9]/g, '');        // només a-z0-9
}

/**
 * Shortest key accepted for an institute. With less left after normalizing
 * («学校», «!!», «I.E.»), unrelated centres would share one ranking entry.
 */
export const MIN_INSTITUTE_KEY_LENGTH = 3;

export function isValidInstituteKey(norm: string): boolean {
  return norm.length >= MIN_INSTITUTE_KEY_LENGTH;
}

/**
 * Name as it will be shown in the public ranking: control and format
 * characters removed (bidi overrides and isolates, zero-width spaces, BOM),
 * which could hide text or reorder it for everyone who reads the list, and
 * runs of whitespace collapsed to one space.
 */
export function cleanDisplayName(raw: string): string {
  return raw
    .replace(/\s+/gu, ' ')
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}
