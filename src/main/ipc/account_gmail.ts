import { ipcMainHandle } from '@main/core/custom-ipc'
import { AccountGmailModel } from '@main/database/models/Account_Gmail'

export const IpcMainAccountGmail = (): void => {
  ipcMainHandle('accountGmail_create', async (_, payload) => {
    return await AccountGmailModel.upsert([payload])
  })

  ipcMainHandle('accountGmail_readAll', async () => {
    return await AccountGmailModel.readAll()
  })

  ipcMainHandle('accountGmail_delete', async (_, payload) => {
    return await AccountGmailModel.deleteByGmail([payload.id])
  })
}
