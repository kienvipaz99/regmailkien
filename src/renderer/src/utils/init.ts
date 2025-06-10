import type {
  IConfigAi,
  IFormScanMap,
  IFormScanPost,
  ISettingAPI,
  ISettingProxy,
  ISettingSystem
} from '@preload/types'

const configAi: IConfigAi = {
  supplier: 'gpt',
  ai_key: '',
  model_chat: 'gpt-4o-mini',
  config_render: { language: 'vietnamese', level_creation: 'highly', tone: 'default' }
}

export const defaultSettingSystem: ISettingSystem = {
  is_sync_data_from_care: false,
  chrome_path: '',
  chrome_version: '131',
  threads_run: 1,
  thread_proxy: 2,
  max_threads_run: 10,
  backup: { path: '', is_auto: false, day: 'monday', backup_time: '' },
  chrome_columns: { is_use: false, columns: 1, rows: 1, screen_desktop: '1920x1080' },
  chrome_delay: { is_use: false, type: 'delay' },
  is_hidden_chrome: false,
  is_use_app_facebook: false,
  is_login_cookies: { is_use: false },
  is_auto_get_cookies: { is_use: false },
  custom_input: { value: 0, is_use: false },
  is_use_extensions_proxy_static: false,
  profile_path: '',
  restore_data: { restore_time: '', path: '' },
  open_facebook_url: { is_use: false, open_facebook_by_url: 'www.facebook.com' },
  get_token: { is_use: false, type: 'EAAG' },
  show_avatar: false,
  config_ai: configAi,
  is_login_facebook_with_email: false,
  profile_backup_path: '',
  screen_desktop: ''
}

export const defaultSettingProxy: ISettingProxy = {
  ip_local: '',
  type_proxy: 'no_change_ip',
  selected_proxy: 'no_selected',
  proxy_mart_key: { list_key: '' },
  proxy_mart_reseller: { api_key: '', list_key: '' },
  proxy_v6: { list_key: '' },
  tm_proxy: { list_key: '' },
  ww_proxy: { list_key: '' },
  kiot_proxy: { list_key: '' }
}

export const defaultSettingApi: ISettingAPI = {
  captcha: {
    valuesApi: [],
    key_omocaptcha: { list_key: '' },
    key_anticaptcha: { list_key: '' }
  },
  mail: {
    valuesApi: [],
    key_1secmail_com: { list_key: '' },
    key_etempmail_com: { list_key: '' },
    key_fviainboxes_com: { list_key: '' },
    key_inboxes: { list_key: '' },
    key_mail_mkt: { list_key: '' },
    key_mail_tm: { list_key: '' },
    key_moakt_com: { list_key: '' },
    key_smvmail_com: { list_key: '' },
    key_temp_mail_io: { list_key: '' },
    key_tempm_com: { list_key: '' }
  },
  phone: {
    valuesApi: [],
    key_viotp_com: { list_key: '' },
    key_chaycodeso3_com: { list_key: '' },
    key_fastsim_online: { list_key: '' },
    key_hcotp_com: { list_key: '' },
    key_ironsim_com: { list_key: '' },
    key_muasms_com: { list_key: '' },
    key_otp282_com: { list_key: '' }
  }
}

export const defaultScanPost: IFormScanPost = {
  type_scan: 'link',
  link_key: '',
  scan_post: {
    number: 5
  },
  type_scan_post: 'random',
  save_media: {
    is_checked: false
  },
  categoryId: {
    selected: null
  }
}

export const defaultScanMap: IFormScanMap = {
  interval: {
    from: 2,
    to: 3
  },

  creation_method: 'browser',
  default_password: '',
  use_random_password: false,
  first_name_path: '',
  last_name_path: '',
  number_of_accounts: 5
}
