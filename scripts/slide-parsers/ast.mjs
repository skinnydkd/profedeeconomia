/**
 * MDX AST helpers used by every parser. Wraps `unified` + `remark-parse`
 * + `remark-mdx` so the rest of the codebase doesn't need to know about
 * the parsing pipeline.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';

const processor = unified().use(remarkParse).use(remarkMdx);

function splitFrontmatter(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: norm };
  return { fm: parseYaml(m[1]) ?? {}, body: m[2] };
}

export function parseMdx(src) {
  const { fm, body } = splitFrontmatter(src);
  const ast = processor.parse(body);
  return { frontmatter: fm, ast };
}

/**
 * Walks the tree and returns all JSX elements whose `name` matches.
 * Includes both block and inline forms (mdxJsxFlowElement and
 * mdxJsxTextElement).
 */
export function findComponents(node, name, out = []) {
  if (!node || typeof node !== 'object') return out;
  if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === name) {
    out.push(node);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) findComponents(child, name, out);
  }
  return out;
}

/**
 * Recursively collects plain-text content from a subtree, joining with
 * spaces. Skips JSX expressions (we don't evaluate JS).
 */
export function getText(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') return '';
  if (!Array.isArray(node.children)) return '';
  return node.children.map(getText).join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Reads a JSX attribute by name. Returns the literal string when the
 * attribute is a string; returns the expression source code when it's
 * a JSX expression. Returns undefined when absent.
 */
export function getAttr(jsxNode, attrName) {
  const attrs = jsxNode.attributes || [];
  for (const a of attrs) {
    if (a.name === attrName) {
      if (a.value == null) return true;
      if (typeof a.value === 'string') return a.value;
      if (a.value.type === 'mdxJsxAttributeValueExpression') return a.value.value;
    }
  }
  return undefined;
}
