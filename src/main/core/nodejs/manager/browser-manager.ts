import { checkCloseQueue, logger, sendMessageToMain } from '@main/core/nodejs'
import { ITaskName } from '@main/types'
import { IDataBrowserManager } from '@preload/types'
import { BrowserConfig, BrowserProviderFacade, IBrowserProvider } from '@vitechgroup/mkt-browser'
import { BrowserStatus } from '../enum'

class BrowserSession {
  public uid: string
  public browser: IBrowserProvider
  public startPromise: Promise<IBrowserProvider | undefined> | null

  public status: BrowserStatus
  public lastUsed: number

  constructor(uid: string, browser: IBrowserProvider) {
    this.uid = uid
    this.browser = browser

    this.status = BrowserStatus.IDLE
    this.lastUsed = Date.now()
  }

  public async close(): Promise<boolean> {
    try {
      await this.browser.close()
      return true
    } catch (error) {
      logger.error(`[Lỗi đóng trình duyệt]: ${error}`)
      return false
    }
  }
}

export class BrowserManager {
  private isCloseAll: boolean = false
  private sessionMap: Map<string, BrowserSession> = new Map()

  private payload: IDataBrowserManager

  constructor(payload: IDataBrowserManager) {
    this.payload = payload

    this.payload.parentPort.on('check_queue', this.handleCheckQueue.bind(this))
  }

  public async startBrowser(
    uid: string,
    options: BrowserConfig,
    noOpenNewTab: boolean = false,
    noBlockRequests: boolean = false
  ): Promise<IBrowserProvider | undefined> {
    try {
      const result = await BrowserProviderFacade.getProvider(options)
      if (!result) {
        return
      }

      this.sessionMap.set(uid, new BrowserSession(uid, result))

      this.registerBrowserEvents(uid, result, noOpenNewTab, noBlockRequests)
      return result
    } catch (error) {
      logger.error(`[Lỗi khởi tạo trình duyệt]: ${error}`)
      return undefined
    }
  }

  public async closeBrowser(uid: string): Promise<boolean> {
    const session = this.sessionMap.get(uid)
    if (!session) {
      return false
    }

    const result = await session.close()
    if (result) {
      this.sessionMap.delete(uid)
    }

    return result
  }

  public async closeAllBrowser(): Promise<void> {
    this.isCloseAll = true

    const closePromises = Array.from(this.sessionMap.values()).map((session) =>
      this.closeBrowser(session.uid)
    )

    await Promise.all(closePromises)
    this.sessionMap.clear()
    sendMessageToMain<ITaskName>(this.payload.parentPort, { key: 'job_action_finally' })
  }

  private registerBrowserEvents(
    uid: string,
    browser: IBrowserProvider,
    noOpenNewTab: boolean,
    noBlockRequests: boolean
  ): void {
    browser.getBrowser().on('disconnected', () => this.sessionMap.delete(uid))

    if (!noBlockRequests) {
      browser
        .getPage()
        .setRequestInterception(true)
        .then(() => {
          browser.getPage().on('request', (req) => {
            if (['stylesheet', 'font', 'image'].includes(req.resourceType())) {
              req.abort()
            } else {
              req.continue()
            }
          })
        })
        .catch((error) => {
          logger.error(`[Đăng ký sự kiện request] Lỗi: ${error}`)
        })
    }

    if (noOpenNewTab) {
      browser.getBrowser().on('targetcreated', (target) =>
        target
          .page()
          .then((newPage) => {
            if (newPage) {
              newPage.close()
            }
          })
          .catch((error) => {
            logger.error(`[Đóng tab mới] Lỗi: ${error}`)
          })
      )
    }
  }

  private async handleCheckQueue(actionName: ITaskName): Promise<void> {
    const shouldCloseQueue = await checkCloseQueue(this.payload.mktJobQueue, this.isCloseAll)

    if (shouldCloseQueue) {
      sendMessageToMain<ITaskName>(this.payload.parentPort, {
        key: 'action_done',
        data: actionName
      })
      sendMessageToMain<ITaskName>(this.payload.parentPort, { key: 'read_data_account_again' })
    }

    if (this.sessionMap.size <= 0 && shouldCloseQueue) {
      this.payload.parentPort.emit('check_retry_action')
    }
  }
}
