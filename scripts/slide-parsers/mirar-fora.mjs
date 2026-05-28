import { getText, getAttr } from './ast.mjs';

/**
 * <MirarFora unidad={n} libro={{titulo, meta, porque, paginas}}
 *   video={{titulo, meta, duracion, porque, url}}
 *   cuenta={{titulo, meta, porque}}
 *   actividad_titulo="…" actividad_duracion="…">
 *   children: activity description
 * </MirarFora>
 */
export function renderMirarFora(node) {
  const libro = parseObjAttr(getAttr(node, 'libro'));
  const video = parseObjAttr(getAttr(node, 'video'));
  const cuenta = parseObjAttr(getAttr(node, 'cuenta'));
  const actTit = getAttr(node, 'actividad_titulo') || '';
  const actDur = getAttr(node, 'actividad_duracion') || '';
  const actDesc = getText(node);

  const cell = (icon, type, title, author, desc) => [
    '<div class="mf__cell">',
    `  <div class="mf__icon">${icon}</div>`,
    `  <div class="mf__type">${esc(type)}</div>`,
    `  <div class="mf__title">${esc(title || '—')}</div>`,
    author ? `  <div class="mf__author">${esc(author)}</div>` : '',
    desc ? `  <div class="mf__desc">${esc(desc)}</div>` : '',
    '</div>',
  ].filter(Boolean).join('\n');

  return [
    '<!-- _class: mirar-fora -->',
    '',
    cell('§', 'Leer', libro.titulo, libro.meta, libro.porque),
    cell('▶', 'Ver', video.titulo, [video.meta, video.duracion].filter(Boolean).join(' · '), video.porque),
    cell('@', 'Seguir', cuenta.titulo, cuenta.meta, cuenta.porque),
    cell('✎', 'Hacer', actTit, actDur, actDesc),
  ].join('\n');
}

/**
 * Cheap parser for inline object expressions like
 *   { titulo: 'X', meta: 'Y', porque: 'Z' }
 * Reads only string values (single, double, or backtick quoted).
 */
function parseObjAttr(src) {
  if (!src || typeof src !== 'string') return {};
  const out = {};
  const re = /(\w+)\s*:\s*(['"`])([\s\S]*?)\2/g;
  let m;
  while ((m = re.exec(src))) out[m[1]] = m[3];
  return out;
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
