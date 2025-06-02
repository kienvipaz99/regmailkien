import { logger, sendMessageToMain } from '@main/core/nodejs'
import { ICheckBrowserData, IResponseDownloadChrome } from '@preload/types'
import { MktBrowserChecker } from '@vitechgroup/mkt-browser'
import { MessagePort } from 'node:worker_threads'

export class CheckBrowser {
  private chromeVersion: string

  private parentPort: MessagePort
  private mktBrowserChecker: MktBrowserChecker

  constructor(data: ICheckBrowserData, parentPort: MessagePort) {
    const { chromePath, chromeVersion } = data

    this.chromeVersion = chromeVersion

    this.parentPort = parentPort
    this.mktBrowserChecker = MktBrowserChecker.get(chromePath)
    this.mktBrowserChecker.setProgressDownloadBrowser(this.progressDownloadBrowser.bind(this))
  }

  public async startCheck(): Promise<void> {
    sendMessageToMain(this.parentPort, { key: 'wait_check_browser' })

    try {
      await this.mktBrowserChecker.checkBrowser(this.chromeVersion)
    } catch (error) {
      logger.error(`[Check browser error]: ${error}`)
      sendMessageToMain(this.parentPort, { key: 'download_chrome_progress', data: 0 })
    } finally {
      sendMessageToMain(this.parentPort, { key: 'check_browser_success' })
    }
  }

  private progressDownloadBrowser({ tokens }: { tokens: IResponseDownloadChrome }): void {
    const downloaded = parseFloat(tokens.downloadedMB)
    const fullSize = parseFloat(tokens.fullSizeMB)

    if (!fullSize || isNaN(downloaded) || isNaN(fullSize)) {
      return sendMessageToMain(this.parentPort, { key: 'download_chrome_progress', data: 0 })
    }

    sendMessageToMain(this.parentPort, {
      key: 'download_chrome_progress',
      data: +((downloaded / fullSize) * 100).toFixed(2)
    })
  }
}
