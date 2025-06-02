import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { IIpcCustomRenderer, UiUtilArgRoutes } from '@preload/types'

export const IpcRendererUiUtil: IIpcCustomRenderer<UiUtilArgRoutes> = {
  copy2faCode: async (payload) => await ipcRendererInvoke('uiUtil_copy2faCode', payload),
  copyByField: async (payload) => await ipcRendererInvoke('uiUtil_copyByField', payload),
  actionBy: async (payload) => await ipcRendererInvoke('uiUtil_actionBy', payload),
  getInfoFile: async (payload) => await ipcRendererInvoke('uiUtil_getInfoFile', payload),
  showDialog: async (payload) => await ipcRendererInvoke('uiUtil_showDialog', payload),
  exportFileBy: async (payload) => await ipcRendererInvoke('uiUtil_exportFileBy', payload),
  getLocales: async (payload) => await ipcRendererInvoke('uiUtil_getLocales', payload)
}
