import type { AccountGmailArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const AccountGmailApi: IIpcCustomRenderer<AccountGmailArgRoutes> = {
  create: async (payload) => window.api.accountGmail.create(payload),
  delete: async (payload) => window.api.accountGmail.delete(payload),
  readAll: async (payload) => window.api.accountGmail.readAll(payload)
}
