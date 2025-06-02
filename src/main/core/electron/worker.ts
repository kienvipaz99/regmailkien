import { logger, sendMessageToWorker } from '@main/core/nodejs'
import { handleWorkerMessage, updateActionSetting } from '@main/helper'
import WorkerAction from '@main/nodejs/worker?nodeWorker'
import { ICustomWorkerData } from '@preload/types'
import { app } from 'electron'
import { Worker } from 'node:worker_threads'
import { sendMessageRenderer } from './func'

export const initializeWorker = <T>(workerData: ICustomWorkerData<T>): Worker => {
  const worker = WorkerAction({ workerData: workerData })

  worker.on('message', (message) => handleWorkerMessage(worker, message))
  worker.on('exit', (code) => logger.debug(`Worker exit: ${code}`))
  worker.on('error', (error) => {
    logger.debug(`Worker error: ${error}`)
    updateActionSetting()
    sendMessageRenderer('job_action_finally')
  })

  app.on('before-quit', () => {
    sendMessageToWorker(worker, { key: 'close_all_chrome' })
  })

  return worker
}
