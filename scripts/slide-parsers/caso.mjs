/**
 * Renders <CasoDilema> and <VuelveAlCaso> as side-by-side image+text slides.
 * The image comes from the unit's hero photo: by convention, the first
 * <Figure> import in the MDX. If no image is available, falls back to
 * a single-column text layout (still uses the caso class for typography).
 */
import { getText, getAttr } from './ast.mjs';
import { dataUri } from './imports.mjs';

export function renderCaso(node, { heroImageAbs }) {
  return render(node, { heroImageAbs, klass: 'caso', kicker: 'CASO REAL' });
}

export function renderVuelveAlCaso(node, { heroImageAbs }) {
  return render(node, { heroImageAbs, klass: 'caso caso-resuelto', kicker: 'VUELVE AL CASO' });
}

function render(node, { heroImageAbs, klass, kicker }) {
  const titular = getAttr(node, 'titular') || '';
  const pregunta = getAttr(node, 'pregunta') || '';
  const fuente = getAttr(node, 'fuente') || '';
  const body = getText(node);
  const url = dataUri(heroImageAbs);

  return [
    `<!-- _class: ${klass} -->`,
    '',
    `<div class="caso__media">`,
    url ? `  <img src="${url}" alt="" />` : '',
    `</div>`,
    `<div class="caso__body">`,
    `  <p class="caso__kicker">${kicker}</p>`,
    titular ? `  <h2>${esc(titular)}</h2>` : '',
    body ? `  <p class="caso__body-text">${esc(body)}</p>` : '',
    pregunta ? `  <p class="caso__pregunta">${esc(pregunta)}</p>` : '',
    fuente ? `  <p class="caso__fuente">${esc(fuente)}</p>` : '',
    `</div>`,
  ].filter((l) => l != null).join('\n');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
