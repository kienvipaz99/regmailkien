import type {
  Account,
  IPayloadCreateGmail,
  ISettingAPI,
  ISettingProxy,
  ISettingSystem,
  ITypeModuleLogUpdate,
  ITypePositionScan,
  IUser
} from '@preload/types'
import type { MktBrowser } from '@vitechgroup/mkt-browser'
import type { IPayloadLogUpdate, JobDetail } from '@vitechgroup/mkt-job-queue'
import { MessagePort } from 'node:worker_threads'
import { ITaskName, ITaskTypes } from './task-action'

export type ITypeLogUpdate = (options: IPayloadLogUpdate<ITypeModuleLogUpdate>) => Promise<boolean>

export interface ICustomData<K extends ITaskName> {
  jobId: string
  jobDetail: JobDetail
  jobDetailData: IJobDetailData<K>
  jobData: IJobData<K>
  account: Account
  parentPort: MessagePort
  mktBrowser?: MktBrowser
  logUpdate: ITypeLogUpdate
  serinamephone?: string
}

export interface IViewportChrome {
  width: number
  height: number
}

type TaskUniqueData<K extends ITaskName> = K extends keyof ICustomUniqueData
  ? { uniqueData: ICustomUniqueData[K] }
  : object

export type IJobDetailData<K extends ITaskName> = {
  uidAccount: string
} & TaskUniqueData<K>

export interface ICustomUniqueData {
  open_chrome: IBaseUniqueData
  scan_g_map_by_keyword: IBaseUniqueData
  create_gmail: IPayloadCreateGmail
}

export interface IBaseUniqueData {
  itemPosition: ITypePositionScan
  list_keyword_scan: string[]
  countPositionRemain: number
}

export interface IJobData<K extends ITaskName> {
  setting_api: ISettingAPI
  setting_proxy: ISettingProxy
  setting_system: ISettingSystem
  actionName: K
  config: ITaskTypes[K]
  user: IUser
  no_change_proxy?: boolean
}

export interface IPayloadUpdateSetting<T> {
  by: ITaskName
  data: Partial<T>
}

export interface IPayloadUpdateLogPassAccount {
  uid: string
  by: string
  old_password: string
  new_password: string
}

export interface IPayloadUpsertGroupCount {
  created_time: number
  group_member_profiles: { count: number }
  id: string
  link: string
  name: string
  viewer_post_status: string
  visibility: string
}
