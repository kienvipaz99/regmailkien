import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { AccountArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererAccount: IIpcCustomRenderer<AccountArgRoutes> = {
  create: async (payload) => await ipcRendererInvoke('account_create', payload),
  removeByField: async (payload) => await ipcRendererInvoke('account_removeByField', payload),
  updateByClipboard: async (payload) =>
    await ipcRendererInvoke('account_updateByClipboard', payload),
  readAccountByField: async (payload) =>
    await ipcRendererInvoke('account_readAccountByField', payload),
  readAccountByParams: async (payload) =>
    await ipcRendererInvoke('account_readAccountByParams', payload),
  counterTotalLiveAndDie: async () => await ipcRendererInvoke('account_counterTotalLiveAndDie'),
  removeFieldByUid: async (payload) => await ipcRendererInvoke('account_removeFieldByUid', payload),
  updateAccountByField: async (payload) =>
    await ipcRendererInvoke('account_updateAccountByField', payload)
}
