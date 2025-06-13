import { logger, sendMessageToMain } from '@main/core/nodejs'
import { BrowserManager, JobManager } from '@main/core/nodejs/manager'
import { IDataAction, IJobWorkerData, IResultMessageWorker, ITaskName } from '@preload/types'
import { JobDetailStatus, MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { IProxyAssigned } from '@vitechgroup/mkt-proxy-client'
import { MessagePort } from 'node:worker_threads'
import { executeAction } from '../google_map'

export class StartAction {
  private data: IJobWorkerData
  private parentPort: MessagePort
  private mktJobQueue: MktJobQueue
  private browserManager: BrowserManager

  constructor(data: IJobWorkerData, mktJobQueue: MktJobQueue, parentPort: MessagePort) {
    console.log('🚀 ~ StartAction ~ constructor ~ data:', data)
    this.data = data
    this.mktJobQueue = mktJobQueue
    this.parentPort = parentPort
  }

  public async start(): Promise<void> {
    this.browserManager = new BrowserManager({
      parentPort: this.parentPort,
      mktJobQueue: this.mktJobQueue
    })

    const jobManager = await JobManager.create({
      retry: this.data.retry,
      jobId: this.data.jobId,
      parentPort: this.parentPort,
      mktJobQueue: this.mktJobQueue,
      callbackAction: this.callbackAction.bind(this),
      handleParentMessage: this.handleParentMessage.bind(this)
    })

    jobManager.start()
  }
  private async callbackAction(
    dataAction: IDataAction<ITaskName>,
    proxy?: IProxyAssigned
  ): Promise<JobDetailStatus> {
    console.log('🚀 ~ StartAction ~ callbackAction ~ proxy:', proxy)

    const result = await executeAction({
      ...dataAction,
      proxy
    })

    return result ? JobDetailStatus.complete : JobDetailStatus.fail
  }
  private async handleParentMessage(message: IResultMessageWorker<unknown>): Promise<void> {
    switch (message.key) {
      case 'stop_all_job':
      case 'close_all_chrome': {
        sendMessageToMain(this.parentPort, { key: `wait_${message.key}` })
        await this.browserManager.closeAllBrowser()
        break
      }
      default: {
        logger.debug(`[Không xử lý]: key = ${message.key}`)

        break
      }
    }
  }
}
