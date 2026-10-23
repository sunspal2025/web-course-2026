import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { rollupOptions: { input: fileURLToPath(new URL('./source.html', import.meta.url)) } },
});
