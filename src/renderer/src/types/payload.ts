import type {
  Account,
  AppSettings,
  IActionUiUtilBy,
  ICategoryType,
  IFieldUpdateAndCheck,
  IMainResponse,
  IPayloadStartAction,
  ITaskName,
  Post
} from '@preload/types'
import { UseMutateFunction } from '@tanstack/react-query'
import { ITypeProxy } from '@vitechgroup/mkt-proxy-client'
import { Dispatch, SetStateAction } from 'react'

export type IPayloadChangeCategory = { categoryId: string; ids: string[] }

export type IPayloadCreateCategory = { name: string; type: ICategoryType }

export type IPayloadCreateAccount = {
  [key: string]: string | string[]
  template: string
  formatOptions: string[]
  category: string
  values: string
}
export interface IPayloadRemoveProxy {
  ids: string[]
}
export type IPostType = 'image' | 'video' | 'text' | 'share' | 'reels'

export interface IPayloadCreatePostFromPostFacebookScan {
  categoryId: string
  listUidPostFacebookScan: string[]
}

export interface IPayloadCreateUpdatePost extends Partial<Post> {
  categoryId?: string
}

export interface IPayloadRemoveCategory {
  id: string
  name: string
}
export interface IPayloadRemoveGmail {
  id: string
  name: string
}

export interface IPayloadCreateAccountGmail {
  gmail: string
  password: string
}

export interface IPayloadUpdateCategory extends IPayloadRemoveCategory {
  resetName: string
}

export interface IPayloadService {
  updateByClipboard?: UseMutateFunction<
    IMainResponse<string[]>,
    Error,
    IFieldUpdateAndCheck<Account, string[], keyof Account>,
    unknown
  >
  removeFieldBy?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<Account, Array<keyof Account>, string[]>,
    unknown
  >
  copyByField?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<Account, string, string[]>,
    unknown
  >
  copy2faCode?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<Account, undefined, string[]>,
    unknown
  >
  actionBy?: UseMutateFunction<
    IMainResponse<string[]>,
    Error,
    IFieldUpdateAndCheck<Account, IActionUiUtilBy, string[]>,
    unknown
  >
  updateAccountByField?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<Account, Partial<Account>, string[]>,
    unknown
  >
  removePostByField?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<Post, undefined, string[]>,
    unknown
  >
  startAction?: UseMutateFunction<IMainResponse<boolean>, Error, IPayloadStartAction, unknown>
  updateSettings?: UseMutateFunction<
    IMainResponse<boolean>,
    Error,
    IFieldUpdateAndCheck<AppSettings, object, undefined>,
    unknown
  >
  setAction?: Dispatch<SetStateAction<ITaskName>>
}

export interface IPayloadScanGMap {
  keyword: string
}

export type IPayloadCreateProxy = {
  [key: string]: string | string[]
  template: string
  formatOptions: string[]
  values: string
  proxyType: ITypeProxy
}
export interface IPayloadAssignProxy {
  action: ActionAssignProxy
  listProxyId: string[]
  listAccountId: string[]
  quantity: number
}

export type ActionAssignProxy =
  | 'one_proxy_one_account'
  | 'one_proxy_many_account'
  | 'random_one_proxy_one_account'
  | 'proxy_in_turn_account'

export interface IPayloadCreateGmail {
  creation_method: 'browser' | 'phone'
  default_password: string
  use_random_password: boolean
  first_name_path: string
  last_name_path: string
  show_browser: boolean
  interval: {
    from: number
    to: number
  }
}
