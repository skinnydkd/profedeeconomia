import { getText, getAttr } from './ast.mjs';

/**
 * <KeyTakeaways title="…" variant="…">
 *   bullet list as slot
 * </KeyTakeaways>
 */
export function renderKeyTakeaways(node) {
  const title = getAttr(node, 'title') || 'Lo esencial';
  const bullets = [];
  for (const child of node.children || []) {
    if (child.type === 'list') {
      for (const li of child.children || []) bullets.push(getText(li));
    }
  }
  if (!bullets.length) return null;
  return [
    `## ${esc(title)}`,
    '',
    ...bullets.map((b) => `- ${b}`),
  ].join('\n');
}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
