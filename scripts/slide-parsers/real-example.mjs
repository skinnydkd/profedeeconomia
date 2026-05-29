import { getText, getAttr } from './ast.mjs';

export function renderRealExample(node) {
  const empresa = getAttr(node, 'empresa') || getAttr(node, 'nombre') || '';
  const body = getText(node);
  return [
    '<!-- _class: example -->',
    '',
    `<p class="example__kicker">Caso real${empresa ? ' · ' + esc(empresa) : ''}</p>`,
    '',
    '## ' + (empresa ? esc(empresa) : 'Ejemplo real'),
    '',
    `<div class="example__body">${esc(body)}</div>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
