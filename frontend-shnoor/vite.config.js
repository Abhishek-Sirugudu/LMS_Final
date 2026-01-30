import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'process', '');
  return {
    plugins: [
      react(),
      tailwindcss()
    ],

    // Production build optimization
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: env.NODE_ENV !== 'production',

      // Chunk splitting strategy for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React libraries
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],

            // Heavy libraries
            'vendor-charts': ['recharts'],
            'vendor-editor': ['@monaco-editor/react'],

            // UI libraries
            'vendor-ui': ['lucide-react', 'emoji-picker-react']
          }
        }
      },

      // Increase chunk size warning limit (in KB)
      chunkSizeWarningLimit: 1000,

      // Enable CSS code splitting
      cssCodeSplit: true
    },

    // Development server config
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      cors: true,

      // Faster HMR
      hmr: {
        overlay: true
      }
    },

    // Preview server config (for testing production build)
    preview: {
      port: 4173,
      strictPort: true,
      open: true
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios'
      ]
    }
  }
});
