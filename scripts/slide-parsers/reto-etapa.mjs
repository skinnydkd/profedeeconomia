import { getText, getAttr } from './ast.mjs';

export function renderRetoEtapa(node) {
  const etapaRaw = getAttr(node, 'etapa');
  // etapa is declared as `number` in the component; the MDX expression may be
  // `etapa={6}` (string "6" after parsing) or `etapa="6"`.
  const etapa = String(etapaRaw ?? '?').replace(/[^\d]/g, '') || '?';
  const titulo = getAttr(node, 'titulo') || 'Reto del curso';
  const entregable = getAttr(node, 'entregable') || '';
  const body = getText(node);
  const num = etapa === '?' ? '?/12' : `${etapa.padStart(2, '0')}/12`;

  return [
    '<!-- _class: reto -->',
    '',
    `<div class="reto__num">${num}</div>`,
    `<div>`,
    `  <h2>Reto · ${esc(titulo)}</h2>`,
    entregable ? `  <p><strong>Entregable:</strong> ${esc(entregable)}</p>` : '',
    body ? `  <div class="reto__tasks">${esc(body)}</div>` : '',
    `</div>`,
  ].filter((l) => l != null).join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
