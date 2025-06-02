import { dialogAuthError, initializeWorker, sendMessageRenderer } from '@main/core/electron'
import { AuthModel, logger, MASP, PASSWORD_MKT, USERNAME_MKT, VERSION_APP } from '@main/core/nodejs'
import { settings, updateActionSetting, updateSettingBy } from '@main/helper'
import { getPublicIP } from '@main/nodejs/helper'
import { ICheckBrowserData, ISettingProxy, ISettingSystem, ITaskTypes, IUser } from '@preload/types'
import { MktBrowserChecker } from '@vitechgroup/mkt-browser'
import {
  BROWSER_DIR,
  BROWSER_VER,
  downloadAndInstallMktClient,
  getResolution,
  isAppRunning,
  ISDEV,
  isFakeHost,
  MktClient,
  openMktClient,
  ProductOfFb,
  SocketEventKey,
  SyncDataSocketClient
} from '@vitechgroup/mkt-key-client'
import { app } from 'electron'
import { isEmpty } from 'lodash'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export const registerSocketEvents = (): void => {
  const socketSync = SyncDataSocketClient.get()
  socketSync.forMasp(MASP)
  socketSync.login()
  if (ProductOfFb.includes(MASP) && process.env[`isSyncDataCare_${MASP}`] === 'true') {
    initializeWorker<unknown>({ type: 'sync_data_realtime', data: {} })
  }
}

export const checkMktClientAndAuth = async (): Promise<boolean> => {
  const clientRunning = await isAppRunning().catch((error) => {
    logger.error(`No mkt client => download and install ${error}`)
    return false
  })

  if (!clientRunning) {
    try {
      await openMktClient()
    } catch (error) {
      downloadAndInstallMktClient().then(() => app.exit())

      logger.error(`No mkt client => download and install ${error}`)
    }
  }

  if (ISDEV) {
    process.env.usernameMKT = USERNAME_MKT
    process.env.passwordMKT = PASSWORD_MKT
  }

  if (!process.env.usernameMKT && !process.env.passwordMKT) {
    SyncDataSocketClient.get().emit(SocketEventKey.OPEN_PRODUCT, MASP)

    logger.error(`No username and password: ${SocketEventKey.OPEN_PRODUCT}`)

    app.exit()
  }

  await autoLogin().catch(() => app.exit())

  return clientRunning
}

export const preAppCheck = async (): Promise<void> => {
  let { chrome_path, chrome_version } = settings.get('setting_system')

  if (resolve(chrome_path) !== resolve(BROWSER_DIR)) {
    chrome_path = BROWSER_DIR
  }

  if (!chrome_version) {
    chrome_version = BROWSER_VER
  }

  updateSettingBy<ISettingSystem>('setting_system', { chrome_path, chrome_version })
  checkValidChrome(chrome_path, chrome_version)

  autoCheckAuth()
}

export const reloadSetting = (): void => {
  if (ProductOfFb.includes(MASP)) {
    updateSettingBy<ISettingSystem>('setting_system', {
      is_sync_data_from_care: process.env[`isSyncDataCare_${MASP}`] === 'true'
    })
  }

  getPublicIP().then((ip_local) => updateSettingBy<ISettingProxy>('setting_proxy', { ip_local }))

  getResolution().then((screen_desktop) =>
    updateSettingBy('setting_system', { chrome_columns: { screen_desktop } })
  )

  updateActionSetting()
}

export const checkValidChrome = (chromePath: string, chromeVersion: string): void => {
  const { is_pending_check, current_path, current_version } = settings.get('check_browser')

  const chromeExePath =
    MktBrowserChecker.get(chromePath).executableBrowserFilePathForVersion(chromeVersion)

  if (existsSync(chromeExePath) && !isEmpty(current_path) && !isEmpty(current_version)) {
    const isResolve =
      resolve(current_path) === resolve(chromePath) && current_version === chromeVersion
    if (is_pending_check || isResolve) {
      return
    }
  }

  updateSettingBy<ITaskTypes['check_browser']>('check_browser', {
    is_pending_check: true,
    current_path: chromePath,
    current_version: chromeVersion
  })

  initializeWorker<ICheckBrowserData>({
    type: 'check_browser',
    data: { chromePath, chromeVersion }
  })
}

const autoLogin = async (): Promise<void> => {
  const username = process.env.usernameMKT
  const password = process.env.passwordMKT

  if (username && password) {
    const result = await AuthModel.loginTool({ username, password })

    if (result) {
      updateSettingBy<IUser>('user', result ?? {})
      sendMessageRenderer('auto_login_success')

      return
    }
  }

  app.exit()
}

const autoCheckAuth = (): void => {
  setInterval(() => {
    let isFakeAuth = false

    MktClient.get()
      .auth.verifyVersion({ version: VERSION_APP })
      .then(({ success }) => {
        isFakeAuth = !success
      })
      .catch((error) => {
        logger.error(`${error.response}`)
        if (400 <= error.response?.status && error.response?.status <= 499) {
          // 400 || 401 || 403 || 404
          isFakeAuth = true
        }
      })
      .finally(() => {
        if (isFakeHost() || isFakeAuth) {
          dialogAuthError()
        }
      })
  }, 600000)
}
