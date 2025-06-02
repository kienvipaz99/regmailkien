import type { IIpcCustomRenderer, SettingArgRoutes } from '@preload/types'

export const SettingApi: IIpcCustomRenderer<SettingArgRoutes> = {
  readSettingBy: async (payload) => window.api.setting.readSettingBy(payload),
  checkKeyAi: async (payload) => window.api.setting.checkKeyAi(payload),
  updateSettingBy: async (payload) => window.api.setting.updateSettingBy(payload)
}
