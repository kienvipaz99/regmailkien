import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import {
  IpcRenderAddress,
  IpcRendererAccount,
  IpcRendererAccountGmail,
  IpcRendererAction,
  IpcRendererAuth,
  IpcRendererCategory,
  IpcRendererGMap,
  IpcRendererPost,
  IpcRendererProxy,
  IpcRendererSetting,
  IpcRendererUiUtil
} from './ipc'
import { IMainResponse, IpcApi } from './types'

// Custom APIs for renderer
const api: IpcApi = {
  auth: IpcRendererAuth,
  category: IpcRendererCategory,
  account: IpcRendererAccount,
  post: IpcRendererPost,
  setting: IpcRendererSetting,
  uiUtil: IpcRendererUiUtil,
  action: IpcRendererAction,
  gMap: IpcRendererGMap,
  address: IpcRenderAddress,
  proxy: IpcRendererProxy,
  accountGmail: IpcRendererAccountGmail,
  app: {
    closeApp: () =>
      new Promise<IMainResponse<void>>(() => {
        ipcRenderer.send('app-close')
      })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
