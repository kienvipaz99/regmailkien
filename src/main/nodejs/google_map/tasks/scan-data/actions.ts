import { sendMessageToMain } from '@main/core/nodejs'
import { AccountGmailModel } from '@main/database/models'
import { CloseChromeProfileHidemium, deleteChromeProfile } from '@main/helper'
import {
  generateRandomEmail,
  generateRandomPassword,
  randomVietnameseName
} from '@main/nodejs/actionphone/random-action'
import {
  clickForSelector,
  getElementsBySelector,
  scrollVertical,
  typeTextToSelector
} from '@main/nodejs/actions'
import { ICustomData, ITaskName } from '@main/types'
import { delay } from '@vitechgroup/mkt-key-client'
import { randomInt } from 'crypto'

export const RegGmailChormeHidemium = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  const { browser, jobData, uuid, parentPort } = data as ICustomData<'create_gmail'>

  try {
    const { default_password, first_name_path, use_random_password, last_name_path } =
      jobData.config
    const allPages = await browser?.pages()
    const page = allPages?.[0]

    if (!page) {
      throw new Error('Không tìm thấy tab Chrome nào!')
    }
    const firstName = randomVietnameseName(first_name_path)
    const lastName = randomVietnameseName(last_name_path)
    const password = use_random_password ? generateRandomPassword() : default_password
    const email = generateRandomEmail(firstName, lastName)
    await page.goto('https://mail.google.com/mail/?tab=rm&ogbl')
    await delay(randomInt(1000, 3000))
    const checklink = await getElementsBySelector(page, {
      selector: 'div[class="label-tracker"]',
      index: 0,
      timeout: 3000
    })
    if (!checklink) {
      await page.goto('https://mail.google.com/mail/?tab=rm&ogbl', {
        waitUntil: 'load'
      })
    }
    await delay(5000)
    await clickForSelector(page, {
      selector: 'div[class="label-tracker"]',
      index: 1,
      timeout: 10000
    })
    //click option
    await clickForSelector(page, {
      selector: 'a[slot="options"]',
      index: 2,
      timeout: 10000
    })
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    await delay(randomInt(1000, 3000))
    await typeTextToSelector(page, {
      selector: 'input[id="firstName"]',
      index: 0,
      text: firstName,
      timeout: 15000,
      shouldClearText: false
    })
    await delay(randomInt(1000, 3000))

    await typeTextToSelector(page, {
      selector: 'input[id="lastName"]',
      index: 0,
      text: lastName,
      timeout: 15000,
      shouldClearText: false,
      enter: true
    })
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    // Wait for the next page's element to be loaded
    await delay(5000)
    await clickForSelector(page, {
      selector: '[role="combobox"]',
      index: 0,
      timeout: 10000
    })
    await delay(randomInt(1000, 3000))
    await clickForSelector(page, {
      selector: `li[data-value="${randomInt(1, 12)}"]`,
      index: 0,
      timeout: 10000
    })
    await delay(randomInt(1000, 3000))

    await typeTextToSelector(page, {
      selector: '[id="day"]',
      index: 0,
      text: randomInt(1, 28).toString(),
      timeout: 15000,
      shouldClearText: false
    })
    await delay(randomInt(1000, 3000))

    await typeTextToSelector(page, {
      selector: '[id="year"]',
      index: 0,
      text: randomInt(1970, 2005).toString(),
      timeout: 15000,
      shouldClearText: false
    })
    await delay(randomInt(1000, 3000))

    await clickForSelector(page, {
      selector: '[id="gender"]',
      index: 0,
      timeout: 10000
    })
    await delay(randomInt(1000, 3000))

    await clickForSelector(page, {
      selector: `li[data-value="${randomInt(1, 2)}"]`,
      index: 1,
      timeout: 10000
    })
    console.log('chọn xong giới tính')

    await delay(randomInt(1000, 3000))
    const buttons = await page.$$('button[type="button"]')
    if (buttons.length > 0) {
      console.log('chọn xong nút tiếp')

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
      await clickForSelector(page, {
        selector: '[data-value="custom"]',
        index: 0,
        timeout: 5000
      })
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await typeTextToSelector(page, {
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
      await delay(randomInt(1000, 3000))
    }
    await delay(randomInt(1000, 3000))

    await typeTextToSelector(page, {
      selector: '[type="password"]',
      index: 0,
      text: password,
      timeout: 15000,
      shouldClearText: false
    })
    await typeTextToSelector(page, {
      selector: '[type="password"]',
      index: 1,
      text: password,
      timeout: 15000,
      shouldClearText: false,
      enter: true
    })
    await delay(randomInt(5000, 6000))
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

      await clickForSelector(page, {
        selector: 'button[type="button"]',
        index: 0,
        timeout: 3000
      })
      await delay(randomInt(4000, 6000))
      await clickForSelector(page, {
        selector: 'button[type="button"]',
        index: 0,
        timeout: 3000
      })
      await scrollVertical(page, 1000, 100, 10)
      await clickForSelector(page, {
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
    await delay(randomInt(1000, 3000))
    return true
  } catch (error) {
    console.log('🚀 ~ RegGmailChormeHidemium ~ error:', error)
    await CloseChromeProfileHidemium(uuid || '')
    await deleteChromeProfile(uuid || '')
    return false
  }
}
