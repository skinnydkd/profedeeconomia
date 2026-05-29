import type { ArbolJSON } from './types.ts';

/**
 * Extracts the first fenced ```json … ``` block from an MDX body and
 * returns it as a validated ArbolJSON. Throws with a descriptive
 * message on any failure — the failure goes to the build log and
 * surfaces immediately when Pau edits a tree.
 */
export function parseTreeFromMdxBody(body: string): ArbolJSON {
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error('parseTreeFromMdxBody: no JSON block found in MDX body');

  let raw: unknown;
  try {
    raw = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`parseTreeFromMdxBody: malformed JSON — ${(err as Error).message}`);
  }

  return validateTree(raw);
}

function validateTree(raw: unknown): ArbolJSON {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('parseTreeFromMdxBody: root must be an object');
  }
  const r = raw as Record<string, unknown>;
  const intro = r.intro as Record<string, unknown> | undefined;
  if (!intro || typeof intro.titulo !== 'string') {
    throw new Error('parseTreeFromMdxBody: intro.titulo is required');
  }
  if (typeof r.nodes !== 'object' || r.nodes === null) {
    throw new Error('parseTreeFromMdxBody: nodes object is required');
  }
  if (typeof r.finales !== 'object' || r.finales === null) {
    throw new Error('parseTreeFromMdxBody: finales object is required');
  }
  return raw as ArbolJSON;
}
