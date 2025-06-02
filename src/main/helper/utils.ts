import { DB_JOB_FILE, DB_PROFILE_FILE, DB_PROXY_FILE } from '@main/core/nodejs'
import { AppSettings, ITaskTypes } from '@main/types'
import { MktBrowserDb } from '@vitechgroup/mkt-browser'
import { MktJobDb } from '@vitechgroup/mkt-job-queue'
import { MktProxyDb, MktProxyManager } from '@vitechgroup/mkt-proxy-client'
import { merge } from 'lodash'
import { settings } from './settings'

export const connectMktJobDb = async (): Promise<MktJobDb> => {
  const mktJobDb = new MktJobDb(DB_JOB_FILE)

  if (!mktJobDb.dataSource.isInitialized) {
    await mktJobDb.dataSource.initialize()
    mktJobDb.connect()
  }

  return mktJobDb
}
export const connectMktProxyDb = async (): Promise<MktProxyDb> => {
  const mktProxyFb = MktProxyManager.getInstance(DB_PROXY_FILE).mktProxyDb

  if (!mktProxyFb.dataSource.isInitialized) {
    await mktProxyFb.dataSource.initialize()
    mktProxyFb.connect()
  }

  return mktProxyFb
}
export const connectMktBrowserDb = async (): Promise<MktBrowserDb> => {
  const mktBrowserDb = MktBrowserDb.get(DB_PROFILE_FILE)

  if (!mktBrowserDb.dataSource.isInitialized) {
    await mktBrowserDb.dataSource.initialize()
    mktBrowserDb.connect()
  }

  return mktBrowserDb
}

export const updateSettingBy = <T>(
  by: keyof AppSettings,
  payload: Partial<T>,
  isMerge = true
): void => {
  const currentSettings = settings.get(by) || {}
  const updatedSettings = isMerge ? merge(currentSettings, payload) : payload
  settings.set(by, updatedSettings)
}

export const readAllSetting = (): Omit<AppSettings, keyof ITaskTypes> => {
  const user = settings.get('user')
  const setting_api = settings.get('setting_api')
  const setting_proxy = settings.get('setting_proxy')
  const setting_system = settings.get('setting_system')

  return { user, setting_api, setting_proxy, setting_system }
}

export const updateActionSetting = (): void => {
  updateSettingBy<ITaskTypes['action_history']>('action_history', {
    action_history: { isWork: false },
    backup_profile: { isWork: false },
    recovery_data: { isWork: false },
    stop_job: { isWork: false },
    close_chrome: { isWork: false },
    check_browser: { isWork: false },
    open_chrome: { isWork: false },
    scan_g_map_by_keyword: { isWork: false },
    create_gmail: { isWork: false }
  })
  updateSettingBy<ITaskTypes['stop_job']>('stop_job', { is_pending_stop: false })
  updateSettingBy<ITaskTypes['close_chrome']>('close_chrome', { is_pending_close: false })
  updateSettingBy<ITaskTypes['check_browser']>('check_browser', { is_pending_check: false })
}
