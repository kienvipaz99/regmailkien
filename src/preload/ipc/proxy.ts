import { ipcRendererInvoke } from '@main/core/custom-ipc'
import { IIpcCustomRenderer, ProxyArgRoutes } from '@preload/types'

export const IpcRendererProxy: IIpcCustomRenderer<ProxyArgRoutes> = {
  create: async (payload) => await ipcRendererInvoke('proxy_create', payload),
  readProxyByParams: async (payload) => await ipcRendererInvoke('proxy_readProxyByParams', payload),
  delete: async (payload) => await ipcRendererInvoke('proxy_delete', payload),
  readAllHistoryProxy: async (payload) =>
    await ipcRendererInvoke('proxy_readAllHistoryProxy', payload),
  checkLiveOrDieProxy: async (payload) =>
    await ipcRendererInvoke('proxy_checkLiveOrDieProxy', payload),
  updateProxyRotateByField: async (payload) =>
    await ipcRendererInvoke('proxy_updateProxyRotateByField', payload),
  readProxyByField: async (payload) => await ipcRendererInvoke('proxy_readProxyByField', payload),
  updateProxyStaticByField: async (payload) =>
    await ipcRendererInvoke('proxy_updateProxyStaticByField', payload)
}
