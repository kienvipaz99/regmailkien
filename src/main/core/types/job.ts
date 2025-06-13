import {
  Account,
  IJobData,
  IJobDetailData,
  IResultMessageWorker,
  ITaskName,
  ITypeModuleLogUpdate
} from '@preload/types'
import { ITypeLogUpdate, JobDetail, JobDetailStatus, MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { EnumProxyProvider, IProxyAssigned, IProxyInfo } from '@vitechgroup/mkt-proxy-client'
import { MessagePort } from 'node:worker_threads'

export type IDataAction<K extends ITaskName> = {
  account: Account
  jobData: IJobData<K>
  jobDetail: JobDetail
  jobDetailData: IJobDetailData<K>
  logUpdate: ITypeLogUpdate<ITypeModuleLogUpdate>
} & Pick<IDefaultData, 'jobId' | 'parentPort'>

export interface IDefaultData {
  jobId: string
  parentPort: MessagePort
  mktJobQueue: MktJobQueue
}

export interface IDataRetry {
  is_use: boolean
  numRetry: number
  timeout: number
}

export type ICallbackAction<K extends ITaskName> = (
  data: IDataAction<K>,
  proxy?: IProxyAssigned
) => Promise<JobDetailStatus>

export type IHandleParentMessage = (message: IResultMessageWorker<unknown>) => Promise<void>

export interface IPayloadJobManager<K extends ITaskName> extends IDefaultData {
  retry?: IDataRetry
  callbackAction: ICallbackAction<K>
  handleParentMessage: IHandleParentMessage
}
export interface IProxyData {
  proxy: IProxyInfo | undefined
  typeChangeIp: EnumProxyProvider | 'shared_key_pool'
}
