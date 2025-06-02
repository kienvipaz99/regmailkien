import { IIpcCustomRenderer, ProxyArgRoutes } from '@preload/types'

export const ProxyApi: IIpcCustomRenderer<ProxyArgRoutes> = {
  create: async (payload) => window.api.proxy.create(payload),
  readProxyByParams: async (payload) => window.api.proxy.readProxyByParams(payload),
  delete: async (payload) => window.api.proxy.delete(payload),
  readProxyByField: async (payload) => window.api.proxy.readProxyByField(payload),
  updateProxyRotateByField: async (payload) => window.api.proxy.updateProxyRotateByField(payload),
  checkLiveOrDieProxy: async (payload) => window.api.proxy.checkLiveOrDieProxy(payload),
  updateProxyStaticByField: async (payload) => window.api.proxy.updateProxyStaticByField(payload),
  readAllHistoryProxy: async (payload) => window.api.proxy.readAllHistoryProxy(payload)
}
