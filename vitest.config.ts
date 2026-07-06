import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Tests target the pure calculation logic in src/lib/calc/*. The Preact
// components import these modules, so the maths is verified independently of
// the DOM (node environment, no jsdom needed).
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@content': path.resolve(__dirname, './src/content'),
    },
  },
  test: {
    environment: 'node',
    include: [
      'src/**/*.{test,spec}.ts',
      'party/**/*.{test,spec}.ts',
      'scripts/**/*.{test,spec}.mjs',
    ],
  },
});
