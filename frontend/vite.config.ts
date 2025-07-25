// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
      // Si usas SCSS para temas personalizados
      // styles: { configFile: 'src/styles/settings.scss' },
    }),
    // Opcional: fuentes de Google
    // ViteFonts({
    //   google: {
    //     families: [
    //       { name: 'Roboto', styles: 'wght@100;300;400;500;700;900' },
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.ts', '.vue'],
  },
  define: { 'process.env': {} },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  build: {
    outDir: 'dist', // Todo el build irá aquí
    emptyOutDir: true,
  },
})
