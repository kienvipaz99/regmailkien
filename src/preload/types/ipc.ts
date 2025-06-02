import { ElectronAPI } from '@electron-toolkit/preload'
import {
  Account,
  AccountGmail,
  AppSettings,
  Category,
  IActionUiUtilBy,
  IFieldUpdateAndCheck,
  IInfoFile,
  IIpcCustomRenderer,
  IObjectParams,
  IPayloadAssignProxy,
  IPayloadCheckAi,
  IPayloadCreateAccount,
  IPayloadCreateCategory,
  IPayloadCreateProxy,
  IPayloadCreateUpdatePost,
  IPayloadExportFile,
  IPayloadReadHistory,
  IPayloadRemoveCategory,
  IPayloadRemoveGmail,
  IPayloadRemoveProxy,
  IPayloadShowDialog,
  IPayloadStartAction,
  IPayloadUpdateCategory,
  IStatusCheckAi,
  ITypeLocales,
  IUser,
  Maps,
  Post
} from '@preload/types'
import type { JobDetail } from '@vitechgroup/mkt-job-queue'
import type { District, Province } from '@vitechgroup/mkt-maps'
import { IResponseCheckLiveDie, Proxy, Session } from '@vitechgroup/mkt-proxy-client'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IpcApi
  }
}

export interface IpcApi {
  auth: IIpcCustomRenderer<AuthArgRoutes>
  category: IIpcCustomRenderer<CategoryArgRoutes>
  account: IIpcCustomRenderer<AccountArgRoutes>
  post: IIpcCustomRenderer<PostArgRoutes>
  setting: IIpcCustomRenderer<SettingArgRoutes>
  uiUtil: IIpcCustomRenderer<UiUtilArgRoutes>
  action: IIpcCustomRenderer<ActionArgRoutes>
  gMap: IIpcCustomRenderer<GMapArgRoutes>
  address: IIpcCustomRenderer<AddressRouters>
  proxy: IIpcCustomRenderer<ProxyArgRoutes>
  accountGmail: IIpcCustomRenderer<AccountGmailArgRoutes>
  app: IIpcCustomRenderer<{ closeApp: { args: undefined; ret: void } }>
}

export type AuthArgRoutes = {
  getUser: { args: undefined; ret: IUser }
  // getHis: { args: undefined; ret: string }
  // loginTool: { args: ILogin; ret: boolean }
  // logoutTool: { args: undefined; ret: boolean }
  // forgotPass: { args: undefined; ret: boolean }
  // register: { args: IRegisterForm; ret: boolean }
  // login: { args: ILogin; ret: boolean }
  // logout: { args: undefined; ret: boolean }
  // verifyToken: { args: undefined; ret: boolean }
}
export type ProxyArgRoutes = {
  create: { args: IPayloadCreateProxy; ret: boolean }
  readProxyByParams: { args: IObjectParams; ret: Proxy[] }
  readProxyByField: {
    args: IFieldUpdateAndCheck<Proxy, undefined, string[]>[]
    ret: Proxy[]
  }
  delete: { args: IPayloadRemoveProxy; ret: boolean }
  updateProxyStaticByField: {
    args: IPayloadAssignProxy
    ret: boolean
  }
  updateProxyRotateByField: {
    args: IFieldUpdateAndCheck<Proxy, Partial<Proxy>, string[]>
    ret: boolean
  }
  checkLiveOrDieProxy: { args: string[]; ret: IResponseCheckLiveDie[] }
  readAllHistoryProxy: { args: IObjectParams; ret: Session[] }
}
export type AccountGmailArgRoutes = {
  create: { args: AccountGmail; ret: boolean }
  readAll: { args: IObjectParams; ret: AccountGmail[] }
  delete: { args: IPayloadRemoveGmail; ret: boolean }
}
export type CategoryArgRoutes = {
  create: { args: IPayloadCreateCategory; ret: boolean }
  readCategoryByParams: { args: IObjectParams; ret: Category[] }
  readCategoryByField: {
    args: IFieldUpdateAndCheck<Category, undefined, string>[]
    ret: Category[]
  }
  update: { args: IPayloadUpdateCategory; ret: boolean }
  delete: { args: IPayloadRemoveCategory; ret: boolean }
}

export type AccountArgRoutes = {
  create: { args: IPayloadCreateAccount; ret: boolean }
  readAccountByParams: { args: IObjectParams; ret: Account[] }
  readAccountByField: {
    args: IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[]
    ret: Account[]
  }
  updateAccountByField: {
    args: IFieldUpdateAndCheck<Account, Partial<Account>, string[]>
    ret: boolean
  }
  counterTotalLiveAndDie: { args: undefined; ret: boolean }
  removeFieldByUid: {
    args: IFieldUpdateAndCheck<Account, Array<keyof Account>, string[]>
    ret: boolean
  }
  updateByClipboard: { args: IFieldUpdateAndCheck<Account, string[], keyof Account>; ret: string[] }
  removeByField: {
    args: IFieldUpdateAndCheck<Account, undefined, string[] | boolean>[]
    ret: boolean
  }
}

export type PostArgRoutes = {
  create: { args: IPayloadCreateUpdatePost; ret: boolean }
  readPostByParams: { args: IObjectParams; ret: Post[] }
  updatePostByField: {
    args: IFieldUpdateAndCheck<Post, IPayloadCreateUpdatePost, string[]>
    ret: boolean
  }
  removeByField: { args: IFieldUpdateAndCheck<Post, undefined, string[]>; ret: boolean }
  readPostByField: { args: IFieldUpdateAndCheck<Post, undefined, string[]>[]; ret: Post[] }
}

export type SettingArgRoutes = {
  readSettingBy: { args: IFieldUpdateAndCheck<AppSettings, undefined, string>; ret: unknown }
  updateSettingBy: { args: IFieldUpdateAndCheck<AppSettings, object, undefined>; ret: boolean }
  checkKeyAi: { args: IPayloadCheckAi; ret: IStatusCheckAi | null }
}

export type UiUtilArgRoutes = {
  copyByField: { args: IFieldUpdateAndCheck<Account, string, string[]>; ret: boolean }
  copy2faCode: { args: IFieldUpdateAndCheck<Account, undefined, string[]>; ret: boolean }
  actionBy: { args: IFieldUpdateAndCheck<Account, IActionUiUtilBy, string[]>; ret: string[] }
  getInfoFile: { args: string; ret: IInfoFile }
  showDialog: { args: IPayloadShowDialog; ret: string | string[] }
  exportFileBy: { args: IPayloadExportFile; ret: boolean }
  getLocales: { args: ITypeLocales; ret: object }
}

export type ActionArgRoutes = {
  startAction: { args: IPayloadStartAction; ret: boolean }
  readHistoryBy: { args: IPayloadReadHistory; ret: JobDetail[] }
}

export type GMapArgRoutes = {
  readAllByParams: { args: IObjectParams; ret: Maps[] }
  exportFile: { args: IObjectParams; ret: boolean }
}

export type AddressRouters = {
  readAllProvince: { args: undefined; ret: Province[] }
  readDistrictByProvinceId: { args: IObjectParams; ret: District[] }
}
