import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/discord-card-canvas/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: ({ names }) =>
          names[0] === 'LICENSE' ? 'assets/[name]-[hash].txt' : 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    // The dev server's stub for Node built-ins throws on import, and loadFonts imports path
    alias: { path: fileURLToPath(new URL('./path.ts', import.meta.url)) },
  },
});
