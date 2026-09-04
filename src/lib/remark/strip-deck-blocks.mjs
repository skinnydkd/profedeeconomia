/**
 * Remove ```deck fenced blocks from rendered MDX output (book web page and
 * book PDF). The block is deck-authoring data consumed by the slide builder
 * (src/lib/slides/authored.ts), not book content — without this plugin every
 * unit would print its own slide script as a code listing.
 *
 * Registered in astro.config.mjs → markdown.remarkPlugins, which Astro applies
 * to .md and .mdx alike. Plain tree walk on purpose: no unist-util-visit dep.
 */
export default function stripDeckBlocks() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;
    tree.children = tree.children.filter(
      (node) => !(node.type === 'code' && node.lang === 'deck'),
    );
  };
}
