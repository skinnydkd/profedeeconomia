import { existsSync as defaultExists } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAttr } from './ast.mjs';
import { fileUrl } from './imports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

export function renderDiagram(node, { asignatura, unitSlug, positionalIndex, existsFn = defaultExists }) {
  const id = getAttr(node, 'id') || '';
  const caption = getAttr(node, 'caption') || '';
  const source = getAttr(node, 'source') || '';
  const filename = id ? `${id}.png` : `diagram-${String(positionalIndex + 1).padStart(2, '0')}.png`;
  const abs = resolve(root, 'public/slides-assets', asignatura, unitSlug, filename);
  if (!existsFn(abs)) return null;

  return [
    '<!-- _class: diagram -->',
    '',
    caption ? `## ${esc(caption)}` : '',
    '',
    `![${esc(caption)}](${fileUrl(abs)})`,
    '',
    source ? `<p class="diagram__caption">Fuente: ${esc(source)}</p>` : '',
  ].filter(Boolean).join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
