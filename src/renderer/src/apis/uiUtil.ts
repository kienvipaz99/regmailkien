import type { IIpcCustomRenderer, UiUtilArgRoutes } from '@preload/types'

export const UiUtilApi: IIpcCustomRenderer<UiUtilArgRoutes> = {
  copy2faCode: async (payload) => window.api.uiUtil.copy2faCode(payload),
  actionBy: async (payload) => window.api.uiUtil.actionBy(payload),
  copyByField: async (payload) => window.api.uiUtil.copyByField(payload),
  getInfoFile: async (payload) => window.api.uiUtil.getInfoFile(payload),
  showDialog: async (payload) => window.api.uiUtil.showDialog(payload),
  exportFileBy: async (payload) => window.api.uiUtil.exportFileBy(payload),
  getLocales: async (payload) => window.api.uiUtil.getLocales(payload)
}
