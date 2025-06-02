import { actionSyncData, createResponse, logger } from '@main/core/nodejs'
import { IMainResponse } from '@main/types'
import { ActionSyncData, EntitySyncData } from '@vitechgroup/mkt-key-client'
import { chunk, map, random } from 'lodash'
import { accountGmailQB } from '../AppDataSource'
import { AccountGmail } from '../entities'

export const AccountGmailModel = {
  upsert: async (payload: AccountGmail[]): Promise<IMainResponse<boolean>> => {
    try {
      await Promise.all(
        map(
          chunk(payload, random(300, 500)),
          async (chunk) =>
            await accountGmailQB()
              .insert()
              .into(AccountGmail)
              .values(chunk)
              .orIgnore('gmail')
              .execute()
              .then(() => {
                actionSyncData(EntitySyncData.account, ActionSyncData.create, chunk)
                return true
              })
              .catch(() => false)
        )
      )
      return createResponse('upsert_gmail_success', 'success')
    } catch (error) {
      logger.error(`Error upsert gmail account ${error}`)
      return createResponse('upsert_gmail_failed', 'error')
    }
  },

  readAll: async (): Promise<IMainResponse<AccountGmail[]>> => {
    try {
      const data = await accountGmailQB()
        .select(['account_gmail.id', 'account_gmail.gmail'])
        .getMany()

      return createResponse('read_all_gmail_success', 'success', { data })
    } catch (error) {
      logger.error(`Error read all gmail accounts: ${error}`)
      return createResponse('read_all_gmail_failed', 'error')
    }
  },

  deleteByGmail: async (gmailList: string[]): Promise<IMainResponse<boolean>> => {
    try {
      await accountGmailQB().delete().where('gmail IN (:...gmailList)', { gmailList }).execute()

      return createResponse('delete_gmail_success', 'success')
    } catch (error) {
      logger.error(`Error deleting gmail accounts: ${error}`)
      return createResponse('delete_gmail_failed', 'error')
    }
  }
}
