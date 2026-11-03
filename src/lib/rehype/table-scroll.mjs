/**
 * Wrap every Markdown table in a region that scrolls sideways on its own.
 *
 * A table cannot shrink below its min-content, so on a phone a wide one used
 * to push the whole page sideways (VIS-LEC-14). The wrapper scrolls instead,
 * and since a scrolling box must be reachable with the keyboard, it is a
 * focusable region named after the table's first column headers.
 *
 * Inside the table, a figure and its unit (25.000 €, 15 %) are joined with a
 * no-break space, so a narrow column cannot leave the € alone on a line.
 *
 * Registered in astro.config.mjs → markdown.rehypePlugins, which Astro applies
 * to .md and .mdx alike. Plain tree walk on purpose: no unist-util-visit dep.
 */
const WRAP_CLASS = 'tabla-scroll';

export default function rehypeTableScroll() {
  return (tree, file) => {
    const path = file?.path ?? file?.history?.[0] ?? '';
    const noun = /\.ca\.mdx?$/.test(path) ? 'Taula' : 'Tabla';
    wrapTables(tree, noun);
  };
}

function wrapTables(node, noun) {
  if (!Array.isArray(node.children)) return;
  if (isWrapper(node)) return;
  node.children = node.children.map((child) => {
    if (child.type === 'element' && child.tagName === 'table') {
      keepUnitsTogether(child);
      return {
        type: 'element',
        tagName: 'div',
        properties: { className: [WRAP_CLASS], role: 'region', tabIndex: 0, ariaLabel: label(child, noun) },
        children: [child],
      };
    }
    wrapTables(child, noun);
    return child;
  });
}

function isWrapper(node) {
  const cls = node.properties?.className;
  return node.type === 'element' && Array.isArray(cls) && cls.includes(WRAP_CLASS);
}

function label(table, noun) {
  const heads = headerCells(table).map(textOf).map((s) => s.trim()).filter(Boolean);
  if (heads.length === 0) return noun;
  const shown = heads.slice(0, 3).join(', ');
  return `${noun}: ${shown}${heads.length > 3 ? '…' : ''}`;
}

function headerCells(table) {
  const thead = (table.children ?? []).find((c) => c.type === 'element' && c.tagName === 'thead');
  const row = thead?.children?.find((c) => c.type === 'element' && c.tagName === 'tr');
  return (row?.children ?? []).filter((c) => c.type === 'element' && c.tagName === 'th');
}

function textOf(node) {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

function keepUnitsTogether(node) {
  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = node.value.replace(/(\d) (€|%)/g, '$1\u00a0$2');
    return;
  }
  (node.children ?? []).forEach(keepUnitsTogether);
}
