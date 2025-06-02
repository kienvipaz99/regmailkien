import type {
  ActionAssignProxy,
  ILanguageAi,
  ILevelCreationAi,
  IModelChat,
  IOptionSelectFormat,
  ISupplier,
  IToneAi,
  ITypeCaptcha,
  ITypePhone
} from '@preload/types'
import {
  AngryIconFB,
  HahaIconFB,
  LikeIconFB,
  LoveIconFB,
  RandomIconFB,
  WowIconFB
} from '@renderer/assets/images/icon'
import { TFunction } from 'i18next'

export const optionsFormat: IOptionSelectFormat<string>[] = [
  {
    label: 'uid',
    value: 'uid'
  },
  {
    label: 'password',
    value: 'password'
  },
  {
    label: '_2fa',
    value: '_2fa'
  },
  {
    label: 'name',
    value: 'name'
  },
  {
    label: 'token',
    value: 'token'
  },
  {
    label: 'cookie',
    value: 'cookie'
  },
  {
    label: 'email',
    value: 'email'
  },
  {
    label: 'pass_email',
    value: 'pass_email'
  },
  {
    label: 'recovery_email',
    value: 'recovery_email'
  },
  {
    label: 'pass_recovery_email',
    value: 'pass_recovery_email'
  },
  {
    label: 'birthday',
    value: 'birthday'
  },
  {
    label: 'proxy',
    value: 'proxy'
  }
]

export const configFormatAccount = [
  {
    label: 'option',
    value: 'custom'
  },
  { label: 'Uid | Pass | Cookie', value: 'uid, password, cookie' },
  {
    label: 'Uid | Pass | 2FA | Email |Pass Mail | Mail KP ',
    value: 'uid, password, _2fa, email, pass_email, recovery_email'
  },
  {
    label: 'Uid | Pass | Cookie | Token | Mail | Passmail',
    value: 'uid, password, cookie, token, email, pass_email'
  },
  {
    label: 'Uid | Pass | 2FA | Cookie | Mail | Passmail | Mail KP',
    value: 'uid, password, _2fa, cookie, email, pass_email, recovery_email'
  },
  {
    label: 'Uid | Pass | 2FA | Cookie | Token | Mail | Passmail | MailKP',
    value: 'uid, password, _2fa, cookie, token, email, pass_email, recovery_email'
  },
  {
    label: 'Uid | Pass | 2FA | Email |Pass Mail | Mail KP| Cookie | Token',
    value: 'uid, password, _2fa, email, pass_email, recovery_email, cookie, token'
  }
]

export const configTag = [
  { label: 'checkpoint_state.956', value: '956' },
  { label: 'checkpoint_state.956_purple_safe', value: '956_purple_safe' },
  { label: 'checkpoint_state.282', value: '282' },
  { label: 'checkpoint_state.checkpoint_unknown', value: 'checkpoint_unknown' },
  { label: 'checkpoint_state.disable', value: 'disable' },
  { label: 'checkpoint_state.pass_no_mail', value: 'pass_no_mail' }
]

export const configStatus: IOptionSelectFormat<string>[] = [
  { label: 'Live', value: 'live' },
  { label: 'Die', value: 'die' }
]

export const configSupplier: IOptionSelectFormat<ISupplier>[] = [
  { label: 'GPT', value: 'gpt' },
  { label: 'Gemini', value: 'gemini' }
]

export const configGemini: IOptionSelectFormat<IModelChat>[] = [
  { label: 'Gemini-1.5 Flash', value: 'gemini-1.5-flash' },
  { label: 'Gemini-1.5 Pro', value: 'gemini-1.5-pro' }
]

export const configGpt: IOptionSelectFormat<IModelChat>[] = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4o mini', value: 'gpt-4o-mini' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' }
]

export const configLanguage: IOptionSelectFormat<ILanguageAi>[] = [
  { label: 'vietnam', value: 'vietnamese' },
  { label: 'english', value: 'english' }
]

export const configCreative: IOptionSelectFormat<ILevelCreationAi>[] = [
  { label: 'hight', value: 'highly' },
  { label: 'low', value: 'low' }
]
export const configTone: IOptionSelectFormat<IToneAi>[] = [
  { label: 'defaults', value: 'default' },
  { label: 'humorous', value: 'humorous' },
  { label: 'casual', value: 'casual' },
  { label: 'interesting', value: 'interesting' },
  { label: 'professional', value: 'professional' },
  { label: 'witty', value: 'witty' },
  { label: 'sarcastic', value: 'sarcastic' },
  { label: 'feminine', value: 'feminine' },
  { label: 'masculine', value: 'masculine' },
  { label: 'dramatic_emphasis', value: 'dramatic' },
  { label: 'harsh', value: 'harsh' }
]
export const configApiCaptcha: IOptionSelectFormat<ITypeCaptcha>[] = [
  { label: 'omocaptcha', value: 'key_omocaptcha' },
  { label: 'anticaptcha', value: 'key_anticaptcha' }
]
export const configApiSim: IOptionSelectFormat<ITypePhone>[] = [
  { label: 'Viotp.com', value: 'key_viotp_com' },
  { label: 'hcotp.com', value: 'key_hcotp_com' },
  { label: 'ironsim.com', value: 'key_ironsim_com' },
  { label: 'fastsim.online', value: 'key_fastsim_online' },
  { label: 'chaycodeso3.com', value: 'key_chaycodeso3_com' },
  { label: 'otp282.com', value: 'key_otp282_com' },
  { label: 'muasms.com', value: 'key_muasms_com' }
]
export const reactions = [
  { name: 'like', Icon: LikeIconFB },
  { name: 'love', Icon: LoveIconFB },
  { name: 'wow', Icon: WowIconFB },
  { name: 'haha', Icon: HahaIconFB },
  { name: 'anger', Icon: AngryIconFB },
  { name: 'random', Icon: RandomIconFB }
]

export const areaOptions = [
  { value: 'country', label: 'country' },
  { value: 'province', label: 'province' },
  { value: 'district', label: 'district' }
  // { value: 'ward', label: t('ward') }
]

export const typePositionCountry = [
  { value: 'country_province', label: 'scan_type_detail_country' }
]
export const typePositionProvince = [
  { value: 'province_district', label: 'scan_type_detail_province' },
  {
    value: 'province_district_ward',
    label: 'scan_type_detail_province_2'
  }
]
export const typePositionDistrict = [{ value: 'district_ward', label: 'scan_type_detail_district' }]

export const countryOptions = [{ value: 'vietnam', label: 'Việt Nam' }]

export const configFormatProxy = (t: TFunction): IOptionSelectFormat<string>[] => [
  {
    label: t('option'),
    value: 'custom'
  },
  {
    label: 'User Name | Password | Host | Port',
    value: 'username, password, host, port'
  },
  {
    label: 'Host | Port | User Name | Password',
    value: 'host, port, username, password'
  },
  {
    label: 'Host | Port',
    value: 'host, port'
  }
]

export const optionsFormatProxy: IOptionSelectFormat<string>[] = [
  {
    label: 'host',
    value: 'host'
  },
  {
    label: 'port',
    value: 'port'
  },
  {
    label: 'username',
    value: 'username'
  },
  {
    label: 'pass',
    value: 'password'
  }
]

export const optionTypeProxy: IOptionSelectFormat<ActionAssignProxy>[] = [
  {
    label: 'one_proxy_account',
    value: 'one_proxy_one_account'
  },
  {
    label: 'one_proxy_multi_account',
    value: 'one_proxy_many_account'
  },
  {
    label: 'random_proxy_account',
    value: 'random_one_proxy_one_account'
  },
  {
    label: 'auto_proxy_account',
    value: 'proxy_in_turn_account'
  }
]

export const providerLink: Record<string, string> = {
  tm_proxy: 'https://tmproxy.com',
  kiot_proxy: 'https://app.kiotproxy.com/register?ref=PHANMEMMKT',
  ww_proxy: 'https://www.wwproxy.com/register?ref=171797',
  proxy_mart_key: 'https://proxymart.net/?ref=phanmemmkt.vn',
  proxy_mart_reseller: 'https://proxymart.net/?ref=phanmemmkt.vn',
  net_proxy: 'https://console.netproxy.io/?ref=168394',
  // zing_proxy: 'https://acc.zingproxy.com/account/register?ref=ZP33902',
  proxy_v6: 'https://app.proxyv6.net/auth/register?ref=phanmemmkt'
}
