import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // three.js alone is ~580 kB and is already split into a lazy chunk.
  build: { chunkSizeWarningLimit: 700 },
});
