import { z } from 'astro/zod';

/*
 * Self-assessment question types of the `tests` collection. A question without
 * `tipo` is treated as 'opcion-multiple' so the existing tests keep validating
 * unchanged. Kept out of content.config.ts so the rules can be unit-tested.
 */
const preguntaMC = z.object({
  tipo: z.literal('opcion-multiple'),
  enunciado: z.string(),
  opciones: z.array(z.string()).min(2).max(6),
  correcta: z.number().int().min(0),
  explicacion: z.string().optional(),
});
const preguntaVF = z.object({
  tipo: z.literal('verdadero-falso'),
  enunciado: z.string(),
  correcta: z.boolean(),
  explicacion: z.string().optional(),
});
const preguntaNum = z.object({
  tipo: z.literal('numerico'),
  enunciado: z.string(),
  respuesta: z.number(),
  tolerancia: z.number().min(0).default(0),
  unidad: z.string().optional(),
  explicacion: z.string().optional(),
});
const preguntaRel = z.object({
  tipo: z.literal('relacionar'),
  enunciado: z.string(),
  // `correctas[i]` is the index in `derecha` of the match for `izquierda[i]`.
  izquierda: z.array(z.string()).min(2),
  derecha: z.array(z.string()).min(2),
  correctas: z.array(z.number().int().min(0)),
  explicacion: z.string().optional(),
});

/*
 * The answer has to exist: a `correcta` past the last option, or a matching
 * whose three lists disagree, is a question nobody can get right, and the
 * player renders it without complaint. The discriminated union only takes plain
 * objects, so the checks run on the union.
 */
export const preguntaSchema = z.preprocess(
  (val) =>
    val && typeof val === 'object' && !('tipo' in val) ? { ...val, tipo: 'opcion-multiple' } : val,
  z.discriminatedUnion('tipo', [preguntaMC, preguntaVF, preguntaNum, preguntaRel]).superRefine((p, ctx) => {
    if (p.tipo === 'opcion-multiple' && p.correcta >= p.opciones.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correcta'], message: 'correcta ha de ser un índex vàlid de opciones' });
    }
    if (p.tipo === 'relacionar') {
      if (p.derecha.length !== p.izquierda.length || p.correctas.length !== p.izquierda.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['correctas'],
          message: 'izquierda, derecha i correctas han de tindre la mateixa longitud',
        });
      } else if (p.correctas.some((c) => c >= p.derecha.length)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correctas'], message: 'cada correcta ha de ser un índex vàlid de derecha' });
      }
    }
  }),
);
