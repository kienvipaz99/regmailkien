import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { IIpcCustomRenderer, SettingArgRoutes } from '@preload/types'

export const IpcRendererSetting: IIpcCustomRenderer<SettingArgRoutes> = {
  readSettingBy: async (payload) => await ipcRendererInvoke('setting_readSettingBy', payload),
  checkKeyAi: async (payload) => await ipcRendererInvoke('setting_checkKeyAi', payload),
  updateSettingBy: async (payload) => await ipcRendererInvoke('setting_updateSettingBy', payload)
}
