import { parseMdx } from './ast.mjs';
import { readImports } from './imports.mjs';
import { assembleDeck } from '../slide-builders/deck-assembler.mjs';

export function buildDeckMarkdown(src, { asignatura, unitSlug }) {
  const { frontmatter, ast } = parseMdx(src);
  const importsMap = readImports(ast);
  const slides = assembleDeck({ frontmatter, ast, asignatura, unitSlug, importsMap });

  const head = [
    '---',
    'marp: true',
    'theme: profedeeconomia',
    'size: 16:9',
    'paginate: true',
    `title: "Unidad ${frontmatter.unidad} · ${frontmatter.title}"`,
    '---',
    '',
  ].join('\n');

  return head + slides.join('\n\n---\n\n') + '\n';
}
