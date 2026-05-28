import { getAttr } from './ast.mjs';
import { resolveAssetPath, dataUri } from './imports.mjs';

export function renderFigure(node, importsMap) {
  const srcAttr = getAttr(node, 'src') || '';
  const alt = getAttr(node, 'alt') || '';
  const caption = getAttr(node, 'caption') || '';
  const credit = getAttr(node, 'credit') || '';

  // src may be either a literal path string or a JSX expression naming an import.
  const importPath = importsMap.get(String(srcAttr).trim());
  const abs = resolveAssetPath(importPath);
  const url = dataUri(abs);
  if (!url) return null; // skip — better to omit than to render broken

  return [
    '<!-- _class: figure -->',
    '',
    `<img src="${url}" alt="${escAttr(alt)}" />`,
    '',
    caption ? `<p class="figure__caption">${esc(caption)}</p>` : '',
    credit ? `<p class="figure__credit">${esc(credit)}</p>` : '',
  ].filter((l) => l != null).join('\n');
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escAttr(s) { return esc(s).replace(/"/g, '&quot;'); }
