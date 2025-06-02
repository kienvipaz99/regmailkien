import { BACKUP_DIR, PROFILE_DIR } from '@main/core/nodejs'
import {
  AppSettings,
  defaultSettingApi,
  defaultSettingProxy,
  defaultSettingSystem
} from '@preload/types'
import { BROWSER_DIR } from '@vitechgroup/mkt-key-client'
import Store, { Schema } from 'electron-store'

const schema: Schema<AppSettings> = {
  close_chrome: {
    type: 'object',
    default: {}
  },
  create_gmail: {
    type: 'object',
    default: {}
  },
  check_browser: {
    type: 'object',
    default: {}
  },
  stop_job: {
    type: 'object',
    default: {}
  },
  backup_profile: {
    type: 'object',
    default: {}
  },
  sync_data_realtime: {
    type: 'object',
    default: {}
  },
  open_chrome: {
    type: 'object',
    default: {}
  },
  recovery_data: {
    type: 'object',
    default: {}
  },
  action_history: {
    type: 'object',
    default: {}
  },
  user: {
    type: 'object',
    default: {}
  },
  setting_api: {
    type: 'object',
    default: defaultSettingApi
  },
  setting_proxy: {
    type: 'object',
    default: defaultSettingProxy
  },
  setting_system: {
    type: 'object',
    default: {
      ...defaultSettingSystem,
      chrome_path: BROWSER_DIR,
      profile_path: PROFILE_DIR,
      backup: {
        ...defaultSettingSystem.backup,
        path: BACKUP_DIR
      }
    }
  },
  scan_g_map_by_keyword: {
    type: 'object',
    default: {}
  },
  export_excel: {
    type: 'object',
    default: {}
  },
  base_action: {}
}

const settings = new Store({ schema })
export { settings }
