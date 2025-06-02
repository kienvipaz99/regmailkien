import { MASP } from '@main/core/nodejs'
import {
  IMainResponse,
  IMainResponseStatus,
  IResponsePayload,
  IResultMessageWorker
} from '@preload/types'
import { MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { ActionSyncData, clientSendSyncData, EntitySyncData } from '@vitechgroup/mkt-key-client'
import { MessagePort, Worker } from 'node:worker_threads'

export const createResponse = <T>(
  key: string,
  status: IMainResponseStatus,
  payload: Partial<IResponsePayload<T>> | null = null
): IMainResponse<T> => {
  return {
    message: { key },
    payload,
    status
  }
}

export const sendMessageToWorker = <T>(worker: Worker, payload: IResultMessageWorker<T>): void =>
  worker.postMessage(payload)

export const sendMessageToMain = <T>(
  parentPort: MessagePort,
  payload: IResultMessageWorker<T>
): void => parentPort.postMessage(payload)

export const actionSyncData = (
  entity: EntitySyncData,
  action: ActionSyncData,
  dataSync: unknown
): void => {
  clientSendSyncData(entity, MASP, action, dataSync)
}

export const checkCloseQueue = async (
  mktJobQueue: MktJobQueue,
  forceClose: boolean
): Promise<boolean> => {
  if (!mktJobQueue.getJobDb().dataSource.isInitialized) {
    await mktJobQueue.getJobDb().dataSource.initialize()
    mktJobQueue.getJobDb().connect()
  }

  const running = mktJobQueue.countRunning()
  const remaining = await mktJobQueue.countJobRemaining()

  return forceClose ? running <= 0 : (remaining ?? 0) <= 0 && running <= 0
}
