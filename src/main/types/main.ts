import { IDataRetry, ITaskName } from '.'

export type ITypeLocales = 'vi' | 'en'

export type ITypeModuleLogUpdate = 'general' | ITaskName

export interface IResultCheckLiveOrDie {
  uid: string
  result: boolean
}

export type IResponseCheckAi = 200 | 401 | 429 | 500 | null

export interface IProxyEntries extends Omit<IResultCheckLiveOrDie, 'result'> {
  entry: string
}

export type IDialogType =
  | 'folder'
  | 'file'
  | 'image'
  | 'video'
  | 'audio'
  | 'application'
  | 'image_and_video'

export interface IDialogFilter {
  name: string
  extensions: string[]
}

export type IDialogProperty = Array<
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent'
>

export type ITypeGetToken =
  | 'eagg'
  | 'cookie_android'
  | 'cookie_messenger_android'
  | 'cookie_fb_lite'

export type IActionUiUtilBy =
  | 'remove_profile'
  | 'remove_cache'
  | 'check_exits_profile'
  | 'backup_database'

export interface IInfoFile extends IRecoveryWorkerData, Omit<IDialogFilter, 'extensions'> {
  size: number
  base64: string
}

export interface IPayloadShowDialog {
  type: IDialogType
  maxImage?: number
  maxVideo?: number
  isMulti?: boolean
}

export interface IPayloadExportFile {
  type: ITypeExport
  listUidSelect: string[]
}

export type ITypeExport = 'accounts_export' | 'post_export' | `g_map_export`

export interface CsvFileOpts extends IRecoveryWorkerData {
  headers: string[]
  delimiter?: string
  rowDelimiter?: string
}

export interface IRecoveryWorkerData {
  path: string
}

export interface IBackupProfileData {
  path: string
  listUid: string[]
}

export interface IJobWorkerData {
  jobId: string
  threadRun: number
  retry?: IDataRetry
}

export interface IExportExcel {
  jobId: string
  typeExport: string
  filePath: string
}

export interface LogDetail {
  mess: string
  success: boolean
  uidTarget?: string
}

export type IKeyMessageWorker =
  | 'stop_all_job'
  | 'wait_stop_all_job'
  | 'log_update'
  | 'recovery_progress'
  | 'download_chrome_progress'
  | 'wait_check_browser'
  | 'check_browser_success'
  | 'recovery_failed'
  | 'recovery_finally'
  | 'backup_profile_process'
  | 'wait_close_all_chrome'
  | 'backup_database_process'
  | 'backup_database_success'
  | 'backup_database_failed'
  | 'close_all_chrome'
  | 'job_action_finally'
  | 'read_config_again'
  | 'auto_login_success'
  | 'read_data_account_again'
  | 'read_history_again'
  | 'action_done'
  | 'sync_data_done'
  | 'start_sync_data'
  | 'sync_data_failed'
  | 'sync_data_progress'
  | 'update_setting_sync'
  | 'check_retry_action'
  | 'error'
  // Maps
  | 'read_data_g_map'
  | 'export_excel_success'

export interface IResultMessageWorker<T> {
  key: IKeyMessageWorker
  data?: T
}

export interface IProcessBackupProfile {
  key: string
  filePath?: string
  progress: number
  bytesCopied?: number
  totalBytes?: number
  copiedFormatted?: string
  totalFormatted?: string
}

export interface IPayloadProfileBackup {
  uid: string
  path: string
  size: number
}

export interface IResultAddTpeDialog {
  dialogType: IDialogProperty
  filterType: IDialogFilter[]
}
