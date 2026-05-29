import { getText, getAttr } from './ast.mjs';

/**
 * Returns [enunciadoSlide, solucionSlide]. The split is heuristic: we
 * look for the first child paragraph that starts with **Solución** or
 * a thematic break; everything before goes to the enunciado, the rest
 * to the solución. If we can't split, both slides repeat the full body
 * — better than silently dropping content.
 */
export function renderSolvedExercise(node) {
  const titulo = getAttr(node, 'titulo') || getAttr(node, 'title') || 'Ejercicio resuelto';
  const children = node.children || [];

  let splitIdx = -1;
  for (let i = 0; i < children.length; i++) {
    const text = getText(children[i]);
    if (/^\s*\*?\*?Soluci[oó]n/i.test(text) || children[i].type === 'thematicBreak') {
      splitIdx = i;
      break;
    }
  }

  const enunciadoNodes = splitIdx >= 0 ? children.slice(0, splitIdx) : children;
  const solucionNodes = splitIdx >= 0 ? children.slice(splitIdx) : children;
  const enunciadoText = enunciadoNodes.map(getText).join(' ').trim();
  const solucionText = solucionNodes.map(getText).join(' ').trim();

  const enunciado = [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">ENUNCIADO</p>`,
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(enunciadoText)}</p>`,
  ].join('\n');

  const solucion = [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">SOLUCIÓN</p>`,
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(solucionText)}</p>`,
  ].join('\n');

  return [enunciado, solucion];
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
