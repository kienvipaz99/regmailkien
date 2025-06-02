import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse, logger } from '@main/core/nodejs'
import { AccountModel } from '@main/database/models'
import { unZipAccountSync, updateByClipboardBasedOnPayload } from '@main/nodejs/helper'
import { clipboard } from 'electron'
import { isEmpty } from 'lodash'

export const IpcMainAccount = (): void => {
  ipcMainHandle('account_create', async (_, payload) => {
    const accounts = await unZipAccountSync(
      payload.template,
      '|',
      payload.values,
      true,
      payload.category
    )

    return await AccountModel.upsert(accounts)
  })

  ipcMainHandle('account_readAccountByField', async (_, payload) => {
    return await AccountModel.readAllByField(payload)
  })

  ipcMainHandle('account_readAccountByParams', async (_, payload) => {
    return await AccountModel.readAllByParams(payload)
  })

  ipcMainHandle('account_updateAccountByField', async (_, payload) => {
    return await AccountModel.updateAccountByField(payload)
  })

  ipcMainHandle('account_counterTotalLiveAndDie', async () => {
    return await AccountModel.counterTotalLiveAndDie()
  })

  ipcMainHandle('account_updateByClipboard', async (_, payload) => {
    try {
      const text = clipboard.readText()
      if (isEmpty(text)) {
        return createResponse('no_text_clipboard_update', 'error')
      }
      const data = await updateByClipboardBasedOnPayload(text, payload)
      return createResponse('update_by_clipboard_success', 'success', {
        data
      })
    } catch (error) {
      logger.error(`Update by clipboard failed ${error}`)
      return createResponse('update_by_clipboard_failed', 'error')
    }
  })

  ipcMainHandle('account_removeFieldByUid', async (_, payload) => {
    return await AccountModel.removeFieldByUid(payload)
  })

  ipcMainHandle('account_removeByField', async (_, payload) => {
    return await AccountModel.removeByField(payload)
  })
}
