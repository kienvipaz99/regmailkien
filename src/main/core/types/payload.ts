import { ITaskName } from '@preload/types'
import { MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { ILogin, ILoginToolResponse, IProfile, MktUser } from '@vitechgroup/mkt-key-client'
import { MessagePort } from 'node:worker_threads'

export interface IDataBrowserManager {
  parentPort: MessagePort
  mktJobQueue: MktJobQueue
}

export interface ICheckBrowserData {
  chromePath: string
  chromeVersion: string
}

export type IUser = ILogin & MktUser & IProfile & Pick<ILoginToolResponse, 'remainingDay'>

export interface ICustomWorkerData<T> {
  type: ITaskName
  data: T
}

export interface IResponseDownloadChrome {
  fullSizeMB: string
  downloadedMB: string
}

export interface ITaskSyncDataRealtime {
  isWork: boolean
}

interface ITaskCheckBrowser {
  is_pending_check: boolean
  current_path: string
  current_version: string
}

interface ITaskActionOpenChrome extends ITaskSyncDataRealtime {}

interface ITaskActionCloseChrome {
  is_pending_close: boolean
}

interface ITaskStopJob {
  is_pending_stop: boolean
}

export interface ITaskCoreTypes {
  sync_data_realtime: ITaskSyncDataRealtime
  check_browser: ITaskCheckBrowser
  open_chrome: ITaskActionOpenChrome
  close_chrome: ITaskActionCloseChrome
  stop_job: ITaskStopJob
}
