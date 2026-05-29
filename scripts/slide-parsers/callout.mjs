import { getText, getAttr } from './ast.mjs';

/**
 * <Callout> is rendered as a small attention slide. We re-use the
 * curiosity layout but keep the mustard accent muted.
 */
export function renderCallout(node) {
  const tipo = getAttr(node, 'tipo') || getAttr(node, 'type') || 'nota';
  const body = getText(node);
  if (!body) return null;
  return [
    '<!-- _class: curiosity -->',
    '',
    `## ${esc(String(tipo).toUpperCase())}`,
    '',
    `<p>${esc(body)}</p>`,
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
