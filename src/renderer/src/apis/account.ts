import type { AccountArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const AccountApi: IIpcCustomRenderer<AccountArgRoutes> = {
  create: async (payload) => window.api.account.create(payload),
  updateByClipboard: async (payload) => window.api.account.updateByClipboard(payload),
  readAccountByField: async (payload) => window.api.account.readAccountByField(payload),
  readAccountByParams: async (payload) => window.api.account.readAccountByParams(payload),
  removeByField: async (payload) => window.api.account.removeByField(payload),
  counterTotalLiveAndDie: async () => window.api.account.counterTotalLiveAndDie(),
  removeFieldByUid: async (payload) => window.api.account.removeFieldByUid(payload),
  updateAccountByField: async (payload) => window.api.account.updateAccountByField(payload)
}
