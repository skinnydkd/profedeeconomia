import { defineConfig } from 'vitest/config';

// Tests target the pure calculation logic in src/lib/calc/*. The Preact
// components import these modules, so the maths is verified independently of
// the DOM (node environment, no jsdom needed).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
