import {
  AccountArgRoutes,
  AccountGmailArgRoutes,
  ActionArgRoutes,
  AddressRouters,
  AuthArgRoutes,
  CategoryArgRoutes,
  GMapArgRoutes,
  IPrefixIpcEnum,
  MakeEndpoints,
  PostArgRoutes,
  ProxyArgRoutes,
  SettingArgRoutes,
  UiUtilArgRoutes
} from '@preload/types'

export interface PreloadEventMap
  extends MakeEndpoints<IPrefixIpcEnum.auth, AuthArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.category, CategoryArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.account, AccountArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.post, PostArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.setting, SettingArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.uiUtil, UiUtilArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.action, ActionArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.gMap, GMapArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.proxy, ProxyArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.accountGmail, AccountGmailArgRoutes>,
    MakeEndpoints<IPrefixIpcEnum.address, AddressRouters> {}

export type EventKey = keyof PreloadEventMap
export type EventArgs<K extends EventKey> = PreloadEventMap[K][0]
export type EventReturn<K extends EventKey> = PreloadEventMap[K][1]
