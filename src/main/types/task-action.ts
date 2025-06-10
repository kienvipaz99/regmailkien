/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPayloadCreateGmail, ITaskScanGMapByKeyword } from '@preload/types'
import { ITaskCoreTypes } from '.'

export type IOrder = 'random' | 'in_turn'

export interface IntervalForm {
  from: number
  to: number
}

export type ITypeAction = 'random' | 'in_turn'

export type ITypePost = 'post' | 'comment' | 'message' | 'share' | 'seeding' | 'reel' | 'facebook'

export interface IUseAi {
  is_use_ai: boolean
}
export interface IDuplicate {
  is_duplicate: boolean
}
export interface IUse {
  is_use: boolean
}
export interface IReTry extends IUse {
  min_retries: number
  max_retries: number
  wait_time: number
}

export interface IBaseConfig {
  interval: IntervalForm
  conventions_account_limit: IntervalForm
  errors_counter_allowed: number
  retry: IReTry
}
export interface IConfigChorme {
  resolution: string
  proxy?: string
  name: string
}
export type IViewPortPosition = { x: number; y: number }
export interface IResponseCreateProfileChorme {
  type: string
  title: string
  content: {
    uuid: string
    name: string
    version: string
  }
}
export interface IResponseOpenChormeHidemium {
  status: string
  data: {
    status: boolean
    remote_port: number
    profile_path: string
    execute_path: string
    profile_name: string
    uuid: string
    web_socket: string
  }
}
export interface IResponseCloseChormeHidemium {
  uuid: string
  status: boolean
}
export type ITaskName = keyof ITaskTypes

export interface ITaskAction {
  name: ITaskName
  config: ITaskTypes[ITaskName]
}

type IActionHistory = Record<ITaskName, IPayloadHistory>

export interface ITaskTypes extends ITaskCoreTypes {
  backup_profile: ITaskBackUpProfile
  recovery_data: ITaskRecoveryData
  scan_g_map_by_keyword: ITaskScanGMapByKeyword
  create_gmail: IPayloadCreateGmail
  action_history: IActionHistory
  export_excel: IExportExcel
  base_action: any
}

interface IExportExcel {
  job_id: string
}

interface IPayloadHistory {
  jobId?: string
  isWork: boolean
}

type ITaskRecoveryData = {
  //
}

type ITaskBackUpProfile = {
  //
}

export type ITypeReaction = 'like' | 'haha' | 'wow' | 'love' | 'support' | 'sorry' | 'anger'

interface IReaction extends IUse {
  type: ITypeReaction | 'random'
}

export interface IConfigShare {
  list_uid_post: string
  max_account_share: number
  max_post_share: number
  reaction: IReaction
  seen_first_share: { time: number } & IUse
  comment: IConfigComment
  share_to: 'personal' | 'story' | 'group'
  eye_livestream: { quantity: number } & IUse
  share_group: IConfigGroup
}

interface IConfigGroup extends IDuplicate {
  is_join: boolean
  type: 'group_account' | 'group_by_uid'
  list_uid_group: string
}

export interface IContentAvailable extends IDuplicate {
  list_uid_content: string[]
  order: 'random' | 'in_turn'
}

export interface IFormScanPost {
  type_scan: 'link' | 'keyword'
  link_key: string
  scan_post: { number: number }
  type_scan_post: 'random' | 'order'
  save_media: { is_checked: boolean }
  categoryId: { selected: string | null }
}

export interface IPayloadStartAction {
  actionName: ITaskName
  data: string[]
  jobId?: string
  typeExport?: string
}

export interface IPayloadReadHistory extends Omit<IPayloadStartAction, 'data'> {}

// export interface IExportData {
//   typeExport: ITaskName
//   data: string[]
// }

interface IConfigPostReel {
  list_video: string[]
  tag_friend: {
    keyword: string
    quantity: number
  } & IUse
}

export interface IConfigPost extends IConfigPostReel {
  max_account_share: number
  max_group_share: number
  is_anonymous: boolean
  comment: IConfigComment
  post_to: 'personal' | 'reel' | 'group'
  post_group: IConfigGroup
}

export interface IConfigContent {
  type: 'available' | 'ai' | 'facebook'
  content_available: IContentAvailable
  content_ai: IContentAi
  content_facebook: IContentFacebook
}

export interface IContentAi extends IUse {
  type: 'ai_create' | 'ai_create_sugget'
  max_create_word: IntervalForm
  keyword_suggest: string
}

export interface IContentFacebook extends IUse {
  list_uid_page: string
  list_uid_account: string
  list_uid_group: string
  post_group: { type: 'keyword' | 'id_group' | 'group_participated' }
  type: 'uid_page' | 'uid_account' | 'uid_group'
  edit: { add: 'first' | 'last' } & IUseAi & IUse
  get: { keyword: string; max: number } & IUse
}

interface IConfigComment extends IUse, IDuplicate {
  content: string
  quantity: number
}

export type IGender = 'FEMALE' | 'MALE' | 'NEUTER' | 'random'

export interface IFormScanMap {
  interval: IntervalForm

  creation_method: string // 'browser' or 'phone'
  default_password: string
  use_random_password: false
  first_name_path: string
  last_name_path: string
  number_of_accounts: number
}
