import { ipcRendererInvoke } from '@main/core/custom-ipc'
import { GMapArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererGMap: IIpcCustomRenderer<GMapArgRoutes> = {
  readAllByParams: async (payload) => await ipcRendererInvoke('gMap_readAllByParams', payload),
  exportFile: async (payload) => await ipcRendererInvoke('gMap_exportFile', payload)
}
