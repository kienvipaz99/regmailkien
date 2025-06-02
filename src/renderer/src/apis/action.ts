import type { ActionArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const ActionApi: IIpcCustomRenderer<ActionArgRoutes> = {
  startAction: async (payload) => window.api.action.startAction(payload),
  readHistoryBy: async (payload) => window.api.action.readHistoryBy(payload)
}
