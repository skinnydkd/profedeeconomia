import { getText } from './ast.mjs';

/**
 * Given the consecutive prose / list / table nodes that sit between two
 * MDX components inside a section, render one concept slide. Skips empty
 * blocks. Returns null if no useful content.
 */
export function renderConceptSlide(heading, nodes) {
  const pieces = [];
  for (const n of nodes) {
    if (n.type === 'heading' && n.depth === 3) {
      pieces.push(`### ${getText(n)}`);
    } else if (n.type === 'heading' && n.depth >= 4) {
      pieces.push(`#### ${getText(n)}`);
    } else if (n.type === 'paragraph') {
      const t = getText(n);
      if (t) pieces.push(t);
    } else if (n.type === 'list') {
      const items = (n.children || []).map(getText).filter(Boolean);
      pieces.push(...items.map((i) => `- ${i}`));
    } else if (n.type === 'table') {
      pieces.push(renderTable(n));
    } else if (n.type === 'blockquote') {
      const t = getText(n);
      if (t) pieces.push(`> ${t}`);
    } else if (n.type === 'code') {
      pieces.push('```\n' + (n.value || '') + '\n```');
    }
  }
  if (!pieces.length) return null;
  return [`## ${heading}`, '', ...pieces].join('\n');
}

function renderTable(node) {
  const rows = (node.children || []).map((row) =>
    (row.children || []).map((cell) => getText(cell)),
  );
  if (!rows.length) return '';
  const header = `| ${rows[0].join(' | ')} |`;
  const sep = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const body = rows.slice(1).map((r) => `| ${r.join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}
