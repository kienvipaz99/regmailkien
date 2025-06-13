import { changeFingerprint, CreateProfileChormeHidemium, OpenChormeHidemium } from '@main/helper'
import { ICustomData, ITaskName } from '@main/types'
import { JobDetailStatus } from '@vitechgroup/mkt-job-queue'
import { IProxyAssigned } from '@vitechgroup/mkt-proxy-client'
import axios from 'axios'
import puppeteer from 'puppeteer-core'
import { findNextAvailablePosition, getActualScreenResolution } from '../helper/rowchrome'
import { RegGmailChormeHidemium } from './tasks'
interface ICustomDataWithProxy extends ICustomData<ITaskName> {
  proxy?: IProxyAssigned
}

export const executeAction = async (data: ICustomDataWithProxy): Promise<JobDetailStatus> => {
  const { jobData } = data
  const checkTypeRegister = jobData.config.creation_method
  let result: JobDetailStatus = JobDetailStatus.complete
  // const device: string | null = null

  switch (checkTypeRegister) {
    case 'browser': {
      try {
        const col = jobData?.setting_system.chrome_columns.columns
        const thread = jobData?.setting_system?.threads_run
        const row = Math.ceil(thread / col)
        const screenRes = await getActualScreenResolution()
        const { width, height } = {
          width: Math.floor(screenRes.width / col),
          height: Math.floor(screenRes.height / row)
        }
        const { x, y } = findNextAvailablePosition(width, height, col, row)
        // const dataproxy = await ProxyHi()
        // const passproxy=parseProxyString(da)
        const chormeProfile = await CreateProfileChormeHidemium({
          name: data.account.uid,
          proxy: data.proxy
            ? data.proxy?.password
              ? `HTTP|${data.proxy?.host}|${data.proxy?.port}|${data.proxy?.username}|${data.proxy?.password}`
              : `HTTP|${data.proxy?.host}|${data.proxy?.port}`
            : '',
          resolution: `${width}x${height}`
        })

        if (!chormeProfile?.content?.uuid) {
          console.error('Failed to create chrome profile')
          return JobDetailStatus.fail
        }

        await changeFingerprint(chormeProfile?.content?.uuid)
        const startChorme = await OpenChormeHidemium(
          chormeProfile?.content?.uuid,
          x,
          y,
          width,
          height
        )

        if (!startChorme?.data?.status) {
          console.error('Failed to start chrome')
          return JobDetailStatus.fail
        }

        const response = await axios.get(
          `http://127.0.0.1:${startChorme?.data?.remote_port}/json/version`
        )
        const wsUrl = response.data.webSocketDebuggerUrl
        const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl })
        const [page] = await browser.pages()

        const regResult = await RegGmailChormeHidemium({
          ...data,
          page: page,
          uuid: chormeProfile?.content?.uuid
        })

        result = regResult ? JobDetailStatus.complete : JobDetailStatus.fail

        // Đóng browser trước khi trả về kết quả
        if (browser) {
          try {
            await browser.close()
            console.log('Closed browser for account:', data.account.uid)
          } catch (error) {
            console.error('Error closing browser:', error)
          }
        }

        // Thêm delay nhỏ để đảm bảo browser đã đóng hoàn toàn
      } catch (error) {
        console.error('Error in browser registration:', error)
        result = JobDetailStatus.fail
      }
      break
    }
    // case 'phone': {
    //   const deviceManager = new DeviceManager()

    //   try {
    //     console.log('Starting phone registration for account:', data.account.uid)
    //     device = await deviceManager.waitForDevice()
    //     console.log('Got device:', device)

    //     const phoneResult = await RegGmailPhone({
    //       ...data,
    //       serinamephone: device
    //     })
    //     result = phoneResult ? JobDetailStatus.complete : JobDetailStatus.fail
    //     console.log('Phone registration result:', result)
    //   } catch (error) {
    //     console.error('Error in phone registration:', error)
    //     result = JobDetailStatus.fail
    //   } finally {
    //     if (device) {
    //       deviceManager.releaseDevice(device)
    //       console.log('Released device:', device)
    //     }
    //   }
    //   break
    // }
    default:
      break
  }

  return result
}
