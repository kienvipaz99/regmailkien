import { DB_MAP_FILE, logger, MASP, sendMessageToMain } from '@main/core/nodejs'
import { BrowserManager, JobManager } from '@main/core/nodejs/manager'
import {
  Account,
  ICustomData,
  IDataAction,
  IJobWorkerData,
  IModuleAction,
  IResultMessageWorker,
  ITaskName
} from '@preload/types'
import { MktBrowser } from '@vitechgroup/mkt-browser'
import { JobDetailStatus, MktJobQueue } from '@vitechgroup/mkt-job-queue'
import { delay, PrefixKeySync } from '@vitechgroup/mkt-key-client'
import { MktMaps } from '@vitechgroup/mkt-maps'
import { IPayloadProxyAssigned, ProviderNameType } from '@vitechgroup/mkt-proxy-client'
import { exec } from 'child_process'
import { MessagePort } from 'node:worker_threads'
import { promisify } from 'util'
import { executeAction } from '../google_map'
import { executeActionPhone } from '../google_map/actionphone'

const execAsync = promisify(exec)

export class StartAction {
  private data: IJobWorkerData
  private parentPort: MessagePort
  private mktJobQueue: MktJobQueue
  private browserManager: BrowserManager
  private static availableDevices: string[] = []
  private static deviceLocks: Set<string> = new Set()

  private actionNoOpenNewTab: ITaskName[] = []
  private actionNoCloseChrome: ITaskName[] = ['open_chrome']
  private actionNoHideBrowser: ITaskName[] = ['scan_g_map_by_keyword', 'create_gmail']

  constructor(data: IJobWorkerData, mktJobQueue: MktJobQueue, parentPort: MessagePort) {
    console.log('🚀 ~ StartAction ~ constructor ~ data:', data)
    this.data = data
    this.mktJobQueue = mktJobQueue
    this.parentPort = parentPort
  }

  private async getAvailableDevices(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('adb devices')
      const devices = stdout
        .split('\n')
        .slice(1)
        .filter((line) => line.trim() && line.includes('device'))
        .map((line) => line.split('\t')[0])
      StartAction.availableDevices = devices
      return devices
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error(`Error getting devices: ${errorMessage}`)
      return []
    }
  }

  private async acquireDevice(): Promise<string | null> {
    if (StartAction.availableDevices.length === 0) {
      await this.getAvailableDevices()
    }

    for (const device of StartAction.availableDevices) {
      if (!StartAction.deviceLocks.has(device)) {
        StartAction.deviceLocks.add(device)
        return device
      }
    }
    return null
  }

  private async waitForDevice(): Promise<string> {
    let device: string | null = null
    while (!device) {
      device = await this.acquireDevice()
      if (!device) {
        logger.info('Waiting for available device...')
        await delay(5000) // Wait 5 seconds before checking again
        await this.getAvailableDevices() // Refresh device list
      }
    }
    return device
  }

  private releaseDevice(device: string): void {
    StartAction.deviceLocks.delete(device)
  }

  public start(): void {
    this.browserManager = new BrowserManager({
      parentPort: this.parentPort,
      mktJobQueue: this.mktJobQueue
    })

    new JobManager({
      retry: this.data.retry,
      jobId: this.data.jobId,
      parentPort: this.parentPort,
      mktJobQueue: this.mktJobQueue,
      callbackAction: this.callbackAction.bind(this),
      handleParentMessage: this.handleParentMessage.bind(this)
    }).start()
  }

  private async callbackAction(
    dataAction: IDataAction<ITaskName>,
    proxy?: IPayloadProxyAssigned
  ): Promise<JobDetailStatus> {
    const dataGoogle = await this.initDataAccount(dataAction.account)
    if (!dataGoogle) {
      return JobDetailStatus.fail
    }

    const { jobData } = dataAction as ICustomData<'create_gmail'>
    const checkTypeRegister = jobData.config.creation_method
    let result: boolean | undefined

    if (checkTypeRegister === 'browser') {
      const mktBrowser = await this.startBrowser(dataAction, proxy)
      if (!mktBrowser) {
        return JobDetailStatus.fail
      }

      const module = this.initModule(mktBrowser)
      result = await executeAction({ ...module, ...dataAction, ...dataGoogle, mktBrowser })
      if (!this.actionNoCloseChrome.includes(dataAction.jobData.actionName)) {
        await this.browserManager.closeBrowser(dataAction.account.uid)
      }
    } else {
      const device = await this.waitForDevice()
      try {
        result = await executeActionPhone({
          ...dataAction,
          ...dataGoogle,
          serinamephone: device
        })
      } finally {
        this.releaseDevice(device)
      }
    }

    return result ? JobDetailStatus.complete : JobDetailStatus.fail
  }

  private async startBrowser(
    dataAction: IDataAction<ITaskName>,
    proxy?: IPayloadProxyAssigned
  ): Promise<MktBrowser | undefined> {
    const hideChrome = Object.prototype.hasOwnProperty.call(
      dataAction.jobData.config,
      'show_browser'
    )
      ? !dataAction.jobData.config['show_browser']
      : false
    this.browserManager.createBrowser(dataAction.account.uid, {
      startUrl: '',
      socialPlatform: 'google|facebook',
      hide: hideChrome,
      realIp: dataAction.jobData.setting_proxy.ip_local,
      version: dataAction.jobData.setting_system.chrome_version,
      baseProfilePath: dataAction.jobData.setting_system.profile_path,
      baseBrowserPath: dataAction.jobData.setting_system.chrome_path,
      screenSize: dataAction.jobData.setting_system.chrome_columns.screen_desktop,
      sort: {
        height: MASP === PrefixKeySync.maps ? 1080 : undefined,
        row: dataAction.jobData.setting_system.chrome_columns.rows,
        thread: dataAction.jobData.setting_system.threads_run,
        col: dataAction.jobData.setting_system.chrome_columns.columns,
        resolution: dataAction.jobData.setting_system.chrome_columns.screen_desktop
      },
      ...(proxy && {
        configProxy: {
          thread: dataAction.jobData.setting_system.threads_run,
          threadPerIp: dataAction.jobData.setting_system.thread_proxy,
          list_key: proxy.key,
          name:
            dataAction.jobData.setting_proxy.type_proxy === 'no_change_ip'
              ? 'ww_proxy'
              : (dataAction.jobData.setting_proxy.type_proxy as ProviderNameType),
          ...(dataAction.jobData.no_change_proxy
            ? false
            : dataAction.jobData.setting_proxy.selected_proxy === 'proxy_rotating'
              ? { proxyRotatingStr: proxy }
              : { proxyStr: `${proxy.host}:${proxy.port}:${proxy.username}:${proxy.password}` })
        }
      })
    })

    try {
      return await this.browserManager.startBrowser(
        dataAction.account.uid,
        this.actionNoOpenNewTab.includes(dataAction.jobData.actionName),
        this.actionNoHideBrowser.includes(dataAction.jobData.actionName)
      )
    } catch (error) {
      logger.error(
        `[Lỗi khởi động trình duyệt]: [UID_ACCOUNT = ${dataAction.account.uid}], ${error}`
      )
    }
    return
  }

  private async initDataAccount(account: Account): Promise<object | undefined> {
    try {
      return {}
    } catch (error) {
      logger.error(`[Lỗi khởi tạo dữ liệu tài khoản]: [UID_ACCOUNT = ${account.uid}], ${error}`)
    }

    return
  }

  private async handleParentMessage(message: IResultMessageWorker<unknown>): Promise<void> {
    switch (message.key) {
      case 'stop_all_job':
      case 'close_all_chrome': {
        sendMessageToMain(this.parentPort, { key: `wait_${message.key}` })
        await this.browserManager.closeAllBrowser()

        break
      }

      default: {
        logger.debug(`[Không xử lý]: key = ${message.key}`)

        break
      }
    }
  }

  private initModule(mktBrowser: MktBrowser): Omit<IModuleAction, 'mktBrowser'> {
    const mktMaps = new MktMaps({ browserAction: mktBrowser.action, dbMapFile: DB_MAP_FILE })
    return { mktMaps }
  }
}
