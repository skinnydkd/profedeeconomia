// src/components/retos/parse-reto.ts
import { z } from 'zod';

const itemSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('opcion-multiple'), enunciado: z.string(), opciones: z.array(z.string()).min(2).max(6), correcta: z.number().int().min(0), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('verdadero-falso'), enunciado: z.string(), correcta: z.boolean(), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('numerico'), enunciado: z.string(), respuesta: z.number(), tolerancia: z.number().min(0).optional(), unidad: z.string().optional(), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('relacionar'), enunciado: z.string(), izquierda: z.array(z.string()).min(2), derecha: z.array(z.string()).min(2), correctas: z.array(z.number().int().min(0)), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('ordenar'), enunciado: z.string(), elementos: z.array(z.string()).min(2), explicacion: z.string().optional() }),
  z.object({ tipo: z.literal('abierta'), enunciado: z.string(), modelo: z.string() }),
]);

const pasoSchema = z.object({
  titulo: z.string(),
  escenario: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

const retoSchema = z.object({
  intro: z.object({ kicker: z.string().optional(), titulo: z.string(), contexto: z.string() }),
  pasos: z.array(pasoSchema).min(1),
});

export type Item = z.infer<typeof itemSchema>;
export type Paso = z.infer<typeof pasoSchema>;
export type RetoData = z.infer<typeof retoSchema>;

/**
 * Extract the first fenced ```json … ``` block from an MDX body and return it
 * as a Zod-validated RetoData. Throws a descriptive error (surfaces in the build
 * log) when the block is missing or the structure is invalid.
 */
export function parseRetoFromMdxBody(body: string): RetoData {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error('parseRetoFromMdxBody: no JSON block found in MDX body');
  let raw: unknown;
  try {
    raw = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`parseRetoFromMdxBody: malformed JSON — ${(err as Error).message}`);
  }
  const result = retoSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`parseRetoFromMdxBody: invalid reto — ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return result.data;
}
