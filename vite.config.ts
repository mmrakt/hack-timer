import { crx, defineManifest } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'hack-timer',
  version: '0.0.1',
  description: 'A simple pomodoro timer to improve productivity',
  icons: {
    '16': 'public/assets/img/h-16.png',
    '48': 'public/assets/img/h-48.png',
    '128': 'public/assets/img/h-128.png'
  },
  action: {
    default_popup: 'popup.html'
  },
  background: {
    service_worker: 'src/background/main.ts',
    type: 'module'
  },
  permissions: ['storage', 'tabs', 'notifications'],
  commands: {
    toggle_timer_status: {
      suggested_key: {
        default: 'MacCtrl+Shift+T'
      },
      description: 'Toggle Pause/Resume a timer'
    }
  },
  options_page: 'expire.html'
})

export default defineConfig({
  publicDir: 'public',
  build: {
    emptyOutDir: true,
    outDir: 'build',
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/chunk-[hash].js'
      }
    }
  },
  plugins: [react(), crx({ manifest })]
})
