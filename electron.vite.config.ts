import react from '@vitejs/plugin-react'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({ exclude: ['open', 'fs-extra', 'better-sqlite3'] }),
      swcPlugin(),
      bytecodePlugin()
    ],
    optimizeDeps: {
      include: [
        '@vitechgroup/mkt-key-client',
        '@vitechgroup/mkt-proxy-client',
        '@vitechgroup/mkt-browser',
        '@vitechgroup/mkt-job-queue',
        '@vitechgroup/mkt-maps'
      ]
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload')
      }
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({ exclude: ['open', 'fs-extra', 'better-sqlite3'] }),
      swcPlugin(),
      bytecodePlugin()
    ],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@renderer': resolve('src/renderer/src')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@preload/types': resolve('src/preload/types')
      }
    },
    plugins: [react()]
  }
})
