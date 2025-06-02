import {
  APP_DATA_CLIENT_DIR,
  BROWSER_DIR,
  LOGGER_CLIENT_DIR,
  PrefixKeySync,
  UPDATE_DIR,
  getPathData,
  getPathResources
} from '@vitechgroup/mkt-key-client'
import { ensureDirSync } from 'fs-extra'

export const USERNAME_MKT = import.meta.env.MAIN_VITE_USERNAME_MKT
export const PASSWORD_MKT = import.meta.env.MAIN_VITE_PASSWORD_MKT

export const VERSION_APP = import.meta.env.VITE_VERSION_APP
export const LAST_UPDATED_APP = import.meta.env.VITE_LAST_UPDATED_APP
export const APP_NAME = import.meta.env.MAIN_VITE_APP_NAME
export const APP_ID = import.meta.env.MAIN_VITE_APP_ID
export const APPLE_ID = import.meta.env.MAIN_VITE_APPLE_ID
export const APP_AUTHOR = import.meta.env.MAIN_VITE_APP_AUTHOR
export const APP_TITLE = import.meta.env.MAIN_VITE_APP_TITLE
export const BASE_URL_APP_KEY = import.meta.env.MAIN_VITE_BASE_URL_APP_KEY
export const URL_APP_KEY = import.meta.env.MAIN_VITE_URL_APP_KEY
export const MASP = import.meta.env.MAIN_VITE_MASP as PrefixKeySync
export const KEY_256 = import.meta.env.MAIN_VITE_KEY_256
export const KEY_API_INBOXES = import.meta.env.MAIN_VITE_KEY_API_MAIL_INBOXES

export const DB_FILE = getPathData(APP_NAME, [`${APP_ID}.db`])
export const DB_JOB_FILE = getPathData(APP_NAME, [`${APP_ID}.job.db`])
export const DB_SCAN_FILE = getPathData(APP_NAME, [`${APP_ID}.scan.db`])
export const DB_PROXY_FILE = getPathData(APP_NAME, [`${APP_ID}.proxy.db`])
export const DB_HISTORY_FILE = getPathData(APP_NAME, [`${APP_ID}.history.db`])
export const DB_PROFILE_FILE = getPathData(APP_NAME, [`${APP_ID}.profile.db`])

export const LOGGER_DIR = getPathData(APP_NAME, ['Logs'])
export const EXPORT_DIR = getPathData(APP_NAME, ['Exports'])
export const PROFILE_DIR = getPathData(APP_NAME, ['Profiles'])
export const DOWNLOAD_DIR = getPathData(APP_NAME, ['Downloads'])
export const PATH_UI = getPathData(APP_NAME, ['PATH_UI'])

export const BACKUP_DIR = getPathData(APP_NAME, ['Backups'])

// ZALO Only
export const EXAMPLE_EXCEL_FILE = getPathData(APP_NAME, ['Phone example.xlsx'])
export const LD_DIR = getPathData(APP_NAME, ['LDPlayer'])
export const LD_APP_DIR = getPathData(APP_NAME, ['emulator-mkt'])
export const DATA_DIR = getPathData(APP_NAME, ['Data'])

// Maps Only
export const DB_MAP_FILE = getPathResources([`${APP_ID}.address.db`])

if (MASP === PrefixKeySync.client) {
  Promise.all([
    ensureDirSync(APP_DATA_CLIENT_DIR),
    ensureDirSync(LOGGER_CLIENT_DIR),
    ensureDirSync(UPDATE_DIR),
    ensureDirSync(BROWSER_DIR)
  ])
} else {
  Promise.all([
    ensureDirSync(LOGGER_DIR),
    ensureDirSync(EXPORT_DIR),
    ensureDirSync(PROFILE_DIR),
    ensureDirSync(DOWNLOAD_DIR),
    ...(MASP === PrefixKeySync.zalo ? [ensureDirSync(LD_DIR), ensureDirSync(LD_APP_DIR)] : [])
  ])
}
