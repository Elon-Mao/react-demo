import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateMenu from './src/components/menu'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-demo',
  define: {
    MENU_ITEMS: generateMenu()
  },
  server: {
    port: 3000,
  }
})
