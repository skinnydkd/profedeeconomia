import { getText } from './ast.mjs';

export function renderTldr(node) {
  const body = getText(node);
  return [
    '<!-- _class: tldr -->',
    '',
    '<p class="tldr__kicker">TL;DR</p>',
    '',
    `<p class="pullquote">${esc(body)}</p>`,
  ].join('\n');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
