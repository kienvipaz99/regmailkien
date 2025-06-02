import { electronApp, is, optimizer } from '@electron-toolkit/utils'

import { ISDEV } from '@vitechgroup/mkt-key-client'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import {
  preAppCheck,
  registerSocketEvents,
  reloadSetting,
  sendMessageRenderer
} from './core/electron'
import { APP_NAME, APPLE_ID, logger, MASP } from './core/nodejs'
import { initDatabase, registerIPC } from './helper'

const gotTheLock = app.requestSingleInstanceLock({ MASP: MASP })
if (!gotTheLock) {
  app.quit()
} else {
  let mainWindow: BrowserWindow
  let splashWindow: BrowserWindow | null

  registerSocketEvents()
  // checkMktClientAndAuth()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  const createSplashWindow = (): void => {
    splashWindow = new BrowserWindow({
      width: 700,
      height: 700,
      frame: false,
      transparent: true, // Nền trong suốt
      alwaysOnTop: true, // Luôn ở trên
      resizable: false, // Không thay đổi kích thước
      webPreferences: {
        sandbox: false // Không cần preload
      }
    })

    splashWindow.loadFile(join(__dirname, '../../resources/splash.html'))
  }

  const createWindow = (): void => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1366,
      height: 768,
      minWidth: 1280,
      minHeight: 768,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : { icon }),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        devTools: ISDEV
      }
    })

    mainWindow.once('ready-to-show', () => {
      if (splashWindow) {
        splashWindow.close() // Đóng Splash Screen
        splashWindow = null // Giải phóng bộ nhớ
      }
      mainWindow.setTitle(APP_NAME)
      mainWindow.maximize()
      mainWindow.focus()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId(APPLE_ID)

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    reloadSetting()
    registerIPC()

    ipcMain.on('app-close', () => {
      app.quit() // Đóng app
    })

    initDatabase()

    createSplashWindow()

    const intervalId = setInterval(() => {
      clearInterval(intervalId)
      createWindow()
      setTimeout(() => preAppCheck(), 6000)
    }, 3000)

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  process.on('uncaughtException', (error) => {
    sendMessageRenderer('error')
    logger.error(`Error process: ${error}`)
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.
}
