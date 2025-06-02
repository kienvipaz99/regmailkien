import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { AccountGmailArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererAccountGmail: IIpcCustomRenderer<AccountGmailArgRoutes> = {
  create: async (payload) => await ipcRendererInvoke('accountGmail_create', payload),
  delete: async (payload) => await ipcRendererInvoke('accountGmail_delete', payload),
  readAll: async (payload) => await ipcRendererInvoke('accountGmail_readAll', payload)
}
