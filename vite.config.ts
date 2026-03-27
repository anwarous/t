import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Pyodide bundles WebAssembly and large assets that Vite's pre-bundler
  // cannot process. Excluding it here lets the module be loaded at runtime
  // from the CDN (see algoCompiler/CompilerRes/pythonCompiler.ts).
  optimizeDeps: {
    exclude: ['pyodide'],
  },
})
