/**
 * Mark teacher-only sections of an activity body so the student workbook can hide them.
 *
 * Each top-level h2 whose text matches TEACHER_HEADING (solutions, grading notes,
 * "for the teacher"), plus every sibling up to the next h2, is wrapped in
 * <section data-docente>. The student print page hides `[data-docente]` with CSS;
 * the teacher edition and the web pages show it as before.
 *
 * Registered in astro.config.mjs → markdown.rehypePlugins. Plain tree walk on
 * purpose: no unist-util-visit dep. Only the root's direct children are scanned.
 */
const TEACHER_HEADING = /profesor|professor|docent|correcci|soluci|respuesta de referencia|resposta de referència|resultados esperados|resultats esperats/i;

/** True when an h2's text marks a teacher-only section. */
export function esSeccionDocente(text) {
  return TEACHER_HEADING.test(text);
}

export default function rehypeDocenteSections() {
  return (tree) => {
    const out = [];
    const kids = tree.children ?? [];
    for (let i = 0; i < kids.length; i++) {
      const node = kids[i];
      if (!isH2(node) || !esSeccionDocente(textOf(node))) {
        out.push(node);
        continue;
      }
      const group = [node];
      while (i + 1 < kids.length && !isH2(kids[i + 1])) group.push(kids[++i]);
      out.push({ type: 'element', tagName: 'section', properties: { dataDocente: '' }, children: group });
    }
    tree.children = out;
  };
}

function isH2(node) {
  return node.type === 'element' && node.tagName === 'h2';
}

function textOf(node) {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}
