import { sendMessageRenderer } from '@main/core/electron'
import { DB_MAP_FILE, DB_SCAN_FILE, logger } from '@main/core/nodejs'
import {
  AppDataHistorySource,
  AppDataScanSource,
  AppDataSource
} from '@main/database/AppDataSource'
import { GMapModel } from '@main/database/models'
import {
  IpcMainAccount,
  IpcMainAccountGmail,
  IpcMainAction,
  IpcMainAuth,
  IpcMainCategory,
  IpcMainGMap,
  IpcMainPost,
  IpcMainProxy,
  IpcMainSetting,
  IpcMainUiUtil
} from '@main/ipc'
import { IpcAddress } from '@main/ipc/address'
import { IPayloadUpdateSetting, IResultMessageWorker, ITaskTypes } from '@main/types'
import { MktMapDb } from '@vitechgroup/mkt-maps'
import { existsSync, unlinkSync } from 'node:fs'
import { Worker } from 'node:worker_threads'
import { updateActionSetting, updateSettingBy } from './utils'

export const handleWorkerMessage = (
  worker: Worker,
  { key, data }: IResultMessageWorker<unknown>
): void => {
  switch (key) {
    case 'job_action_finally': {
      updateActionSetting()
      worker.terminate()

      break
    }

    case 'check_browser_success': {
      updateSettingBy<ITaskTypes['check_browser']>('check_browser', { is_pending_check: false })
      // worker.terminate()

      break
    }

    case 'wait_close_all_chrome': {
      updateSettingBy<ITaskTypes['close_chrome']>('close_chrome', { is_pending_close: true })

      break
    }

    case 'wait_stop_all_job': {
      updateSettingBy<ITaskTypes['stop_job']>('stop_job', { is_pending_stop: true })

      break
    }

    case 'read_config_again': {
      const payload = data as IPayloadUpdateSetting<unknown>
      updateSettingBy(payload.by, payload.data, true)

      break
    }
  }

  sendMessageRenderer(key, data)
}

export const registerIPC = (): void => {
  IpcMainAuth()
  IpcMainCategory()
  IpcMainAccount()
  IpcMainPost()
  IpcMainSetting()
  IpcMainUiUtil()
  IpcMainAction()
  IpcMainGMap()
  IpcMainAccountGmail()
  IpcMainProxy()
}

export const initDatabase = async (): Promise<void> => {
  setImmediate(() => {
    if (existsSync(DB_SCAN_FILE)) {
      unlinkSync(DB_SCAN_FILE)
    }
  })

  try {
    AppDataSource.initialize()
    AppDataScanSource.initialize().then(() => {
      GMapModel.clearData()
    })
    AppDataHistorySource.initialize()
    await MktMapDb.get(DB_MAP_FILE)
      .connect()
      .then(() => {
        IpcAddress()
      })
  } catch (error) {
    logger.error(`[Init DB error]: ${error}`)
  }
}
