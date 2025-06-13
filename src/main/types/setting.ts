import { EnumProxyProvider } from '@vitechgroup/mkt-proxy-client'
import { ITaskTypes, IUser } from '.'

export type AppSettings = {
  user: IUser
  setting_system: ISettingSystem
  setting_api: ISettingAPI
  setting_proxy: ISettingProxy
} & {
  [K in keyof ITaskTypes]: ITaskTypes[K]
}

import { IUse } from '@preload/types'

type IDayValue = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

type IBackup = { path: string; is_auto: boolean; day: IDayValue; backup_time: string }

type IRowCol = 1 | 2 | 4 | 6

type IChromeColumn = { is_use: boolean; columns: IRowCol; rows: IRowCol; screen_desktop: string }

type IChromeDelay = { is_use: boolean; type: 'delay' | 'not_delay' }

type IOpenFacebookUrl = 'www.facebook.com' | 'mbasic.facebook.com'

type ICustomInput = { value: number } & IUse

type IAutoGetToken = { is_use: boolean; type: 'EAAG' | 'EAAB' }

type IChooseOpenFacebook = { is_use: boolean; open_facebook_by_url: IOpenFacebookUrl }

type IRestoreData = { restore_time: string; path: string }

export type IConfigAi = {
  supplier: ISupplier
  ai_key: string
  model_chat: IModelChat
  config_render: { language: ILanguageAi; level_creation: ILevelCreationAi; tone: IToneAi }
}

export type ISupplier = 'gpt' | 'gemini'

export type IModelChat =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'

export type ILanguageAi = 'vietnamese' | 'english'

export type ILevelCreationAi = 'highly' | 'low'

export type IToneAi =
  | 'default'
  | 'humorous'
  | 'casual'
  | 'interesting'
  | 'professional'
  | 'witty'
  | 'sarcastic'
  | 'feminine'
  | 'masculine'
  | 'dramatic'
  | 'harsh'

export type IKey = { list_key: string }

export type ISettingSystem = {
  is_sync_data_from_care: boolean
  chrome_path: string
  chrome_version: string
  threads_run: number
  max_threads_run: number
  backup: IBackup
  thread_proxy: number
  chrome_columns: IChromeColumn
  chrome_delay: IChromeDelay
  is_hidden_chrome: boolean
  is_use_app_facebook: boolean
  is_login_cookies: IUse
  is_auto_get_cookies: IUse
  is_login_facebook_with_email: boolean
  custom_input: ICustomInput
  get_token: IAutoGetToken
  is_use_extensions_proxy_static: boolean
  open_facebook_url: IChooseOpenFacebook
  profile_path: string
  restore_data: IRestoreData
  profile_backup_path: string
  show_avatar: boolean
  config_ai: IConfigAi
  screen_desktop: string
}

export type ISettingProxy = {
  ip_local: string
  type_proxy: EnumProxyProvider | 'no_change_ip' | 'shared_key_pool'
  selected_proxy: 'proxy_rotating' | 'no_selected'
  tm_proxy: IKey
  proxy_v6: IKey
  ww_proxy: IKey
  proxy_mart_key: IKey
  proxy_mart_reseller: IKey & { api_key: string }
  kiot_proxy: IKey
}

export type IStatusCheckAi =
  | 'valid_api_key'
  | 'invalid_api_key'
  | 'key_api_limit'
  | 'server_error'
  | 'error_unknown'

export type IPayloadCheckAi = {
  key: string
  model: string
  ai: ISupplier
}

export type ITypeCaptcha =
  | 'key_2captcha'
  | 'key_capmonster'
  | 'key_omocaptcha'
  | 'key_captcha69'
  | 'key_rucaptcha'
  | 'key_ez_captcha'
  | 'key_capsolver'
  | 'key_anticaptcha'

type ISettingCaptcha = {
  valuesApi: ITypeCaptcha[]
  key_omocaptcha: IKey
  key_anticaptcha: IKey
}

export type ITypePhone =
  | 'key_viotp_com'
  | 'key_hcotp_com'
  | 'key_ironsim_com'
  | 'key_fastsim_online'
  | 'key_chaycodeso3_com'
  | 'key_otp282_com'
  | 'key_muasms_com'

type ISettingPhone = {
  valuesApi: ITypePhone[]
  key_viotp_com: IKey
  key_hcotp_com: IKey
  key_ironsim_com: IKey
  key_fastsim_online: IKey
  key_chaycodeso3_com: IKey
  key_otp282_com: IKey
  key_muasms_com: IKey
}

type ITypeMail =
  | 'key_moakt_com'
  | 'key_mail_tm'
  | 'key_temp_mail_io'
  | 'key_tempm_com'
  | 'key_fviainboxes_com'
  | 'key_1secmail_com'
  | 'key_smvmail_com'
  | 'key_etempmail_com'
  | 'key_inboxes'
  | 'key_mail_mkt'

type ISettingMail = {
  valuesApi: ITypeMail[]
  key_moakt_com: IKey
  key_mail_tm: IKey
  key_temp_mail_io: IKey
  key_tempm_com: IKey
  key_fviainboxes_com: IKey
  key_1secmail_com: IKey
  key_smvmail_com: IKey
  key_etempmail_com: IKey
  key_inboxes: IKey
  key_mail_mkt: IKey
}

export type ISettingAPI = {
  captcha: ISettingCaptcha
  phone: ISettingPhone
  mail: ISettingMail
}
