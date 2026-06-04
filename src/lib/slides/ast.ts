/**
 * Typed MDX AST helpers for the slide renderer. TS port of the logic in
 * scripts/slide-parsers/ast.mjs (unified + remark-mdx). Pure, unit-testable.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { parse as parseYaml } from 'yaml';

const processor = unified().use(remarkParse).use(remarkMdx);

export interface MdxAttr {
  type: string;
  name?: string;
  value?: string | { value?: string } | null;
}

export interface MdxNode {
  type: string;
  name?: string;
  value?: string;
  depth?: number;
  children?: MdxNode[];
  attributes?: MdxAttr[];
}

/** Split YAML frontmatter from the body and parse the body to an MDX AST. */
export function parseMdx(src: string): { frontmatter: any; ast: MdxNode } {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = m ? parseYaml(m[1]) ?? {} : {};
  const body = m ? m[2] : norm;
  const ast = processor.parse(body) as unknown as MdxNode;
  return { frontmatter, ast };
}

/** Depth-first collect of every JSX element node with the given component name. */
export function findByName(node: MdxNode, name: string, out: MdxNode[] = []): MdxNode[] {
  if (!node || typeof node !== 'object') return out;
  if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === name) {
    out.push(node);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) findByName(child, name, out);
  }
  return out;
}

/** Flatten all text under a node into a single normalised string. */
export function getText(node: MdxNode | undefined): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    return node.children.map(getText).join(' ').replace(/\s+/g, ' ').trim();
  }
  return '';
}

/** Read a JSX attribute as a string (handles both literal and expression values). */
export function getAttr(node: MdxNode, attr: string): string {
  const a = (node.attributes || []).find((x) => x.type === 'mdxJsxAttribute' && x.name === attr);
  if (!a) return '';
  if (typeof a.value === 'string') return a.value;
  if (a.value && typeof a.value === 'object') return a.value.value ?? '';
  return '';
}

/** The first child that is a JSX element (used to read a Diagram's inner component name). */
export function firstJsxChildName(node: MdxNode): string {
  const child = (node.children || []).find(
    (c) => c.type === 'mdxJsxFlowElement' || c.type === 'mdxJsxTextElement',
  );
  return child?.name ?? '';
}
