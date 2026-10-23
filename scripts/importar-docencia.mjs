#!/usr/bin/env node
// Usage: node scripts/importar-docencia.mjs [--no-git] [--prune] [--src <dir>] [--out <repoRoot>]
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importDocencia } from './lib/docencia.mjs';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(n);
  return i < 0 ? undefined : args[i + 1];
};
const report = importDocencia({
  sourceDir: path.resolve(opt('--src') ?? process.env.DOCENCIA_DIR ?? 'C:/dev/docencia'),
  outDir: path.resolve(opt('--out') ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..')),
  noGit: args.includes('--no-git'),
  prune: args.includes('--prune'),
});
console.log(JSON.stringify(report, null, 2));
