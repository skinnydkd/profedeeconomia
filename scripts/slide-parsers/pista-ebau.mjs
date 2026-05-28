import { getText, getAttr } from './ast.mjs';

export function renderPistaEbau(node) {
  const tipo = getAttr(node, 'tipo') || 'teorica';
  const concepto = getAttr(node, 'concepto') || 'Pista EBAU';
  const apendice = getAttr(node, 'apendice') || '';
  const body = getText(node);
  const tipoLabel = tipo === 'practica' ? 'Práctica' : 'Teoría';
  return [
    '<!-- _class: ebau -->',
    '',
    `<span class="ebau__flag">EBAU · ${esc(tipoLabel)}</span>`,
    '',
    `## ${esc(concepto)}`,
    '',
    `<div class="ebau__body">${esc(body)}</div>`,
    apendice ? `\n<p class="ebau__ref">→ ${esc(apendice)}</p>` : '',
  ].filter(Boolean).join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
