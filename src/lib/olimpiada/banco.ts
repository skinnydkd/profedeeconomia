/** A banco question: extends QuizPlayer's Pregunta with the thematic block + level. */
export interface PreguntaBanco {
  bloque: string;            // one of BLOQUE_SLUGS
  nivel: 1 | 2 | 3;          // 1 concepto, 2 aplicación, 3 olimpiada
  enunciado: string;
  opciones: string[];
  correcta: number;          // index into opciones
  explicacion?: string;
}
export const BANCO: PreguntaBanco[] = [ /* populated in Task 6, ~10-15 per core block */ ];
export function preguntasDeBloque(bloque: string): PreguntaBanco[] {
  return BANCO.filter((p) => p.bloque === bloque);
}
