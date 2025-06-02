import { ipcMainHandle } from '@main/core/custom-ipc'
import { initializeWorker } from '@main/core/electron'
import { createResponse, sendMessageToWorker } from '@main/core/nodejs'
import {
  connectMktJobDb,
  createJob,
  exportCsvDialogWithStream,
  readAllSetting,
  settings,
  updateSettingBy
} from '@main/helper'
import {
  IBackupProfileData,
  IExportExcel,
  IJobWorkerData,
  IRecoveryWorkerData,
  ITaskTypes
} from '@main/types'
import { Worker } from 'node:worker_threads'

export const IpcMainAction = (): void => {
  let worker: Worker | null = null

  ipcMainHandle('action_startAction', async (_, payload) => {
    const { actionName: type, data } = payload
    console.log('🚀 ~ ipcMainHandle ~ data:', data)

    switch (type) {
      case 'recovery_data': {
        initializeWorker<IRecoveryWorkerData>({ type, data: { path: data[0] } })
        return createResponse('wait_recovery_data', 'success')
      }

      case 'backup_profile': {
        const { setting_system } = readAllSetting()
        initializeWorker<IBackupProfileData>({
          type,
          data: { listUid: data, path: setting_system.profile_backup_path }
        })
        return createResponse('wait_backup_profile', 'success')
      }

      case 'close_chrome': {
        if (worker) {
          sendMessageToWorker(worker, { key: 'close_all_chrome' })
        }
        return createResponse('wait_close_chrome', 'success')
      }

      case 'stop_job': {
        if (worker) {
          sendMessageToWorker(worker, { key: 'stop_all_job' })
        }
        return createResponse('wait_stop_job', 'success')
      }

      case 'export_excel': {
        const filePath = await exportCsvDialogWithStream('g_map_export')
        initializeWorker<IExportExcel>({
          type,
          data: { jobId: payload.jobId ?? '', typeExport: payload?.typeExport ?? '', filePath }
        })
        return createResponse('waiting_export_data', 'success')
      }

      default: {
        const mktJobDb = await connectMktJobDb()

        const data = await createJob(mktJobDb, payload)

        if (!data) {
          return createResponse('start_action_error', 'error')
        }

        updateSettingBy<ITaskTypes['action_history']>('action_history', {
          [type]: { isWork: true, jobId: data.jobId }
        })

        worker = initializeWorker<IJobWorkerData>({ type, data })
        return createResponse('start_action_success', 'success')
      }
    }
  })

  ipcMainHandle('action_readHistoryBy', async (_, payload) => {
    const mktJobDb = await connectMktJobDb()

    const data = settings.get('action_history')?.[payload.actionName]
    if (!data || !data.jobId) {
      return createResponse('read_history_failed', 'error')
    }

    const jobDetail = await mktJobDb.jobDetailModel?.whereJobId(data.jobId).getMany()
    return createResponse('read_history_success', 'success', {
      data: jobDetail
    })
  })
}
