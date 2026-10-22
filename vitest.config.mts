import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globals: true,
    reporters: ['default', './test/support/gallery-reporter.ts'],
    env: {
      FONTCONFIG_FILE: fileURLToPath(new URL('./test/fonts.conf', import.meta.url)),
    },
  },
});
