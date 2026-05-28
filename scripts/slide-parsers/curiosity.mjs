import { getText, getAttr } from './ast.mjs';

export function renderCuriosity(node) {
  const titulo = getAttr(node, 'titulo') || getAttr(node, 'title') || '¿Sabías que…?';
  const body = getText(node);
  return [
    '<!-- _class: curiosity -->',
    '',
    '<div class="curiosity__ornament">✻</div>',
    '',
    `## ${esc(titulo)}`,
    '',
    `<p>${esc(body)}</p>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
