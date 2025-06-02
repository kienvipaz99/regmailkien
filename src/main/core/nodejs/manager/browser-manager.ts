import { checkCloseQueue, logger, sendMessageToMain } from '@main/core/nodejs'
import { ITaskName } from '@main/types'
import { IDataBrowserManager } from '@preload/types'
import { IMktBrowserOption, MktBrowser } from '@vitechgroup/mkt-browser'
import { DB_PROFILE_FILE } from '../_const'
import { BrowserStatus } from '../enum'

class BrowserSession {
  public uid: string
  public browser: MktBrowser
  public startPromise: Promise<MktBrowser | undefined> | null

  public status: BrowserStatus
  public lastUsed: number

  constructor(uid: string, browser: MktBrowser) {
    this.uid = uid
    this.browser = browser

    this.status = BrowserStatus.IDLE
    this.lastUsed = Date.now()
  }

  public async start(): Promise<boolean> {
    this.status = BrowserStatus.STARTING

    try {
      this.startPromise = this.browser.start()
      await this.startPromise
      this.status = BrowserStatus.RUNNING
      this.startPromise = null
      return true
    } catch (error) {
      this.status = BrowserStatus.IDLE
      this.startPromise = null
      logger.error(`[Lỗi khởi tạo trình duyệt]: [UID_ACCOUNT = ${this.uid}], ${error}`)
      await this.close()
      return false
    }
  }

  public async close(): Promise<boolean> {
    try {
      if (this.startPromise) {
        await this.startPromise
      }
      const result = await this.browser.close()
      if (result) {
        this.status = BrowserStatus.CLOSED
      }
      return result
    } catch (error) {
      logger.error(`[Lỗi đóng trình duyệt]: ${error}`)
      return false
    } finally {
      this.startPromise = null
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

  public createBrowser(
    uid: string,
    options: Pick<
      IMktBrowserOption,
      'realIp' | 'version' | 'baseProfilePath' | 'baseBrowserPath' | 'screenSize' | 'sort' | 'scale'
    > & { startUrl: string; socialPlatform: string; hide: boolean }
  ): void {
    const session = this.sessionMap.get(uid)
    if (session) {
      session.lastUsed = Date.now()
      return
    }

    const mktBrowser: MktBrowser = new MktBrowser({
      ...options,
      os: 'win',
      language: 'vi',
      profileId: uid.trim(),
      profileName: uid.trim(),
      profileDb: DB_PROFILE_FILE
    })

    this.sessionMap.set(uid, new BrowserSession(uid, mktBrowser))
  }

  public async startBrowser(
    uid: string,
    noOpenNewTab: boolean = false,
    noBlockRequests: boolean = false
  ): Promise<MktBrowser | undefined> {
    const session = this.sessionMap.get(uid)
    if (!session) {
      return
    }

    if ([BrowserStatus.IDLE, BrowserStatus.CLOSED].includes(session.status)) {
      const result = await session.start()
      if (!result) {
        return
      }
      this.registerBrowserEvents(uid, session.browser, noOpenNewTab, noBlockRequests)
    }

    return session.browser
  }

  public async closeBrowser(uid: string): Promise<boolean> {
    const session = this.sessionMap.get(uid)
    if (!session) {
      return false
    }

    console.log('pid', session.browser.chromeProcess)

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
    browser: MktBrowser,
    noOpenNewTab: boolean,
    noBlockRequests: boolean
  ): void {
    browser.browser.on('disconnected', () => this.sessionMap.delete(uid))

    if (!noBlockRequests) {
      browser.action.pagePup
        .setRequestInterception(true)
        .then(() => {
          browser.action.pagePup.on('request', (req) => {
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
      browser.browser.on('targetcreated', (target) =>
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
