import { getText, getAttr } from './ast.mjs';

/**
 * <VocesDesacuerdo tema="…" postura_a={{etiqueta, tesis}} postura_b={{etiqueta, tesis}}>
 *   children: contextual blurb (rendered below the two columns in the book; we
 *   drop it on slides — the columns are already self-explanatory).
 * </VocesDesacuerdo>
 */
export function renderVoces(node) {
  const tema = getAttr(node, 'tema') || 'Voces en desacuerdo';
  const a = parseObjAttr(getAttr(node, 'postura_a'));
  const b = parseObjAttr(getAttr(node, 'postura_b'));

  return [
    '<!-- _class: voces -->',
    '',
    '<div class="voces__col voces__col--a">',
    `  <p class="voces__label">${esc(tema)}</p>`,
    `  <p class="voces__name">${esc(a.etiqueta || 'A')}</p>`,
    `  <p class="voces__pos">${esc(a.tesis || '')}</p>`,
    '</div>',
    '<div class="voces__col voces__col--b">',
    `  <p class="voces__label">${esc(tema)}</p>`,
    `  <p class="voces__name">${esc(b.etiqueta || 'B')}</p>`,
    `  <p class="voces__pos">${esc(b.tesis || '')}</p>`,
    '</div>',
  ].join('\n');
}

/**
 * Cheap parser for inline object expressions like
 *   { etiqueta: 'X', tesis: 'Y' }
 * Reads only string values (single or double quoted). Sufficient for our
 * usage in EDMN.
 */
function parseObjAttr(src) {
  if (!src || typeof src !== 'string') return {};
  const out = {};
  const re = /(\w+)\s*:\s*(['"])([\s\S]*?)\2/g;
  let m;
  while ((m = re.exec(src))) out[m[1]] = m[3];
  return out;
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
