import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { ActionArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererAction: IIpcCustomRenderer<ActionArgRoutes> = {
  startAction: async (payload) => await ipcRendererInvoke('action_startAction', payload),
  readHistoryBy: async (payload) => await ipcRendererInvoke('action_readHistoryBy', payload)
}
