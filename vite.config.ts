import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Eğer backend endpoint'leriniz /auth/... şeklindeyse ve /api prefix'i YOKSA alttaki rewrite'ı AÇIN:
        // rewrite: (path) => path.replace(/^\/api/, ''),
        // Bazı backend'ler Origin header'ını uygulama seviyesinde engelliyor olabilir.
        // Origin header'ını proxy tarafında kaldırmak için:
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Origin header'ını kaldır
            proxyReq.removeHeader('origin');
          });
        },
      },
    },
  },
})