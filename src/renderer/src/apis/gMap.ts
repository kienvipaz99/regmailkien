import { GMapArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const GMapApi: IIpcCustomRenderer<GMapArgRoutes> = {
  readAllByParams: async (payload) => window.api.gMap.readAllByParams(payload),
  exportFile: async (payload) => window.api.gMap.exportFile(payload)
}
