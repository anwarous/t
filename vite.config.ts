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
  server: {
    proxy: {
      '/algo-api': {
        target: process.env.ALGO_COMPILER_PROXY_TARGET ?? 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/algo-api/, ''),
      },
    },
  },
  // Pyodide bundles WebAssembly and large assets that Vite's pre-bundler
  // cannot process. Excluding it here lets the module be loaded at runtime
  // from the CDN (see algoCompiler/CompilerRes/pythonCompiler.ts).
  optimizeDeps: {
    exclude: ['pyodide'],
  },
})
