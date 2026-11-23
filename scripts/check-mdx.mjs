// Compiles the given MDX files and reports syntax errors, without a full build.
//   node scripts/check-mdx.mjs src/content/asignaturas/eco-1bach/libro/05-*.mdx
// It also checks that a file and its .ca twin carry the same chart ids.
import { readFileSync, existsSync } from 'node:fs';
import { compile } from '@mdx-js/mdx';

const ids = (src) => [...src.matchAll(/<(?:MercadoGrafico|GraficoXY)\s+id="([^"]+)"/g)].map((m) => m[1]);
let failed = 0;
for (const file of process.argv.slice(2)) {
  const src = readFileSync(file, 'utf8');
  // Frontmatter and the fenced deck block are not MDX: blank them, keeping line numbers.
  const body = src.replace(/^---\r?\n[\s\S]*?\r?\n---/, (m) => m.replace(/[^\n]/g, ''));
  try {
    await compile(body, { development: false });
  } catch (e) {
    failed++;
    console.log(`FAIL ${file}:${e.line ?? '?'}:${e.column ?? '?'} ${e.reason ?? e.message}`);
    continue;
  }
  const own = ids(src);
  const dup = own.filter((id, i) => own.indexOf(id) !== i);
  if (dup.length) { failed++; console.log(`FAIL ${file}: duplicate chart ids ${dup.join(', ')}`); continue; }
  const twin = file.endsWith('.ca.mdx') ? file.replace(/\.ca\.mdx$/, '.mdx') : file.replace(/\.mdx$/, '.ca.mdx');
  if (existsSync(twin) && ids(readFileSync(twin, 'utf8')).join() !== own.join()) {
    failed++;
    console.log(`FAIL ${file}: chart ids differ from ${twin}`);
    continue;
  }
  console.log(`ok   ${file} (${own.length} charts)`);
}
process.exit(failed ? 1 : 0);
