import { sendMessageToMain } from '@main/core/nodejs'
import { AccountGmailModel } from '@main/database/models'
import { CloseChromeProfileHidemium, deleteChromeProfile } from '@main/helper'
import {
  generateRandomEmail,
  generateRandomPassword,
  randomVietnameseName
} from '@main/nodejs/actionphone/random-action'
import {
  awaitclickForSelector,
  awaittypeTextToSelector,
  getElementsBySelector
} from '@main/nodejs/actions'

import { scrollVerticalByMouse } from '@main/nodejs/actions/scrolling'
import { ICustomData, ITaskName } from '@main/types'
import { delay } from '@vitechgroup/mkt-key-client'
import { random } from 'lodash'

export const RegGmailChormeHidemium = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  const { page, jobData, uuid, parentPort } = data as ICustomData<'create_gmail'>

  try {
    const { default_password, first_name_path, use_random_password, last_name_path } =
      jobData.config

    if (!page) {
      throw new Error('Không tìm thấy tab Chrome nào!')
    }

    const firstName = randomVietnameseName(first_name_path)
    const lastName = randomVietnameseName(last_name_path)
    const password = use_random_password ? generateRandomPassword() : default_password
    let email = ''
    await delay(random(3000, 6000))
    await page.goto(
      'https://accounts.google.com/v3/signin/identifier?continue=https://accounts.google.com/signin/chrome/sync/finish?est%3DAI3H0-pwSuQ-Gs89EP2IdosvSymt3dmwodVIREQUPmrYyjjRh8t1O9TGemPNNMv1o7PRFMFGQSIjR8efxdz-4g%26continue%3Dhttps://www.google.com/&dsh=S-1207215215:1749806600661800&ffgf=1&ssp=1&flowName=GlifDesktopChromeSync',
      {
        waitUntil: 'networkidle2'
      }
    )
    await awaitclickForSelector(page, {
      selector: '[aria-haspopup="menu"]',
      index: 0,
      timeout: 20000
    })
    await delay(random(1000, 3000))
    await awaitclickForSelector(page, {
      selector: '[role="menuitem"]',
      index: 0,
      timeout: 20000
    })
    // await awaitclickForSelector(page, {
    //   selector: 'div[class="label-tracker"]',
    //   index: 1,
    //   timeout: 20000
    // })
    // await delay(random(2000, 4000))

    // await awaitclickForSelector(page, {
    //   selector: 'a[slot="options"]',
    //   index: 2,
    //   timeout: 10000
    // })
    // await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    // await delay(random(1000, 6000))

    await awaittypeTextToSelector(page, {
      selector: 'input[id="lastName"]',
      index: 0,
      text: lastName,
      timeout: 15000,
      shouldClearText: false
    })
    await delay(random(1000, 3000))
    await awaittypeTextToSelector(page, {
      selector: 'input[id="firstName"]',
      index: 0,
      text: firstName,
      timeout: 15000,
      shouldClearText: false,
      enter: true
    })
    await awaittypeTextToSelector(page, {
      selector: '[id="day"]',
      index: 0,
      text: random(1, 28).toString(),
      timeout: 15000,
      shouldClearText: false
    })
    await delay(random(1000, 3000))

    await awaitclickForSelector(page, {
      selector: '[role="combobox"]',
      index: 0,
      timeout: 10000
    })
    await delay(random(1000, 3000))

    await awaitclickForSelector(page, {
      selector: `li[data-value="${random(1, 8)}"]`,
      index: 0,
      timeout: 10000
    })
    await delay(random(1000, 3000))
    await awaittypeTextToSelector(page, {
      selector: '[id="year"]',
      index: 0,
      text: random(1970, 2005).toString(),
      timeout: 15000,
      shouldClearText: false
    })
    await delay(random(1000, 3000))

    await awaitclickForSelector(page, {
      selector: '[id="gender"]',
      index: 0,
      timeout: 10000
    })
    await delay(random(1000, 3000))
    const randomgender = random(1, 2)

    await awaitclickForSelector(page, {
      selector: `li[data-value="${randomgender}"]`,
      index: 1,
      timeout: 10000
    })

    await delay(random(1000, 3000))
    const buttons = await page.$$('button[type="button"]')
    if (buttons.length > 0) {
      await buttons[0].click() // click vào button đầu tiên
    }
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    await delay(5000)
    const checkelements = await getElementsBySelector(page, {
      selector: '[data-value="custom"]',
      index: 0,
      timeout: 3000
    })
    if (checkelements) {
      await awaitclickForSelector(page, {
        selector: '[data-value="custom"]',
        index: 0,
        timeout: 5000
      })
    }
    for (let l = 0; l < 3; l++) {
      email = generateRandomEmail(firstName, lastName)

      await awaittypeTextToSelector(page, {
        selector: '[name="Username"]',
        index: 0,
        text: email,
        timeout: 15000,
        shouldClearText: true,
        enter: true
      })
      const check = await getElementsBySelector(page, {
        selector: '[fill="currentColor"]',
        index: 0,
        timeout: 3000
      })
      if (!check) {
        break
      }
      await delay(random(1000, 3000))
      if (l == 2) {
        return false
      }
    }

    await delay(random(1000, 3000))

    await awaittypeTextToSelector(page, {
      selector: '[type="password"]',
      index: 0,
      text: password,
      timeout: 15000,
      shouldClearText: false
    })
    await awaittypeTextToSelector(page, {
      selector: '[type="password"]',
      index: 1,
      text: password,
      timeout: 15000,
      shouldClearText: false,
      enter: true
    })
    await delay(random(5000, 6000))
    const elements = await getElementsBySelector(page, {
      selector: '[id="phoneNumberId"]',
      index: 0,
      timeout: 3000
    })
    const qrcode = await getElementsBySelector(page, {
      selector: 'img[alt]',
      index: 0,
      timeout: 3000
    })
    const check_recovery_email = await getElementsBySelector(page, {
      selector: 'input[id="recoveryEmailId"]',
      index: 0,
      timeout: 3000
    })
    if (elements || qrcode) {
      if (uuid) {
        await CloseChromeProfileHidemium(uuid)
        await deleteChromeProfile(uuid)
      }
      return true
    } else if (check_recovery_email) {
      console.log('thành công')

      await awaitclickForSelector(page, {
        selector: 'button[type="button"]',
        index: 0,
        timeout: 3000
      })
      await delay(random(4000, 6000))
      await awaitclickForSelector(page, {
        selector: 'button[type="button"]',
        index: 0,
        timeout: 3000
      })
      await scrollVerticalByMouse(page, 1000, 100, 10)
      await awaitclickForSelector(page, {
        selector: 'button[type="button"]',
        index: 3,
        timeout: 3000
      })
      await AccountGmailModel.upsert([
        {
          gmail: email + '@gmail.com',
          password: password
        }
      ])
      console.log('create gmail success', email, password)
      sendMessageToMain(parentPort, { key: 'read_data_account_gmail' })
      await delay(10000)
    }
    await delay(random(1000, 3000))
    return true
  } catch (error) {
    console.log('🚀 ~ RegGmailChormeHidemium ~ error:', error)
    await CloseChromeProfileHidemium(uuid || '')
    await deleteChromeProfile(uuid || '')
    return false
  }
}
