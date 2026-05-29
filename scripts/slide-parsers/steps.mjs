import { getText } from './ast.mjs';

/**
 * <Steps> renders as a single exercise-class slide listing each child <li>
 * as a numbered step. Useful for procedural blocks like "cómo formular un
 * objetivo SMART" or "cómo segmentar un mercado".
 */
export function renderSteps(node, titleFallback = 'Pasos') {
  const items = (node.children || []).flatMap((child) => {
    if (child.type === 'list') return (child.children || []).map(getText);
    return [];
  }).filter(Boolean);

  if (!items.length) return null;

  return [
    '<!-- _class: exercise -->',
    '',
    `<p class="exercise__kicker">PROCEDIMIENTO</p>`,
    `## ${esc(titleFallback)}`,
    '',
    '<ol class="exercise__steps">',
    ...items.map((i) => `  <li>${esc(i)}</li>`),
    '</ol>',
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
