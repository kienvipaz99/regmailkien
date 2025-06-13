import { delay } from '@vitechgroup/mkt-key-client'
import { random } from 'lodash'
import { ElementHandle, Page } from 'puppeteer-core'
import { evaluateWithParams } from '.'

export const waitForSelector = async (
  page: Page,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}
export const awaittypeTextToSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    text: string
    timeout: number
    shouldClearText: boolean
    enter?: boolean
  }
): Promise<boolean> => {
  const { selector, index, text, timeout, shouldClearText, enter = false } = options
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements) {
      if (shouldClearText) {
        await elements?.focus()
        await page.keyboard.down('Control')
        await page.keyboard.press('A')
        await page.keyboard.up('Control')
        await page.keyboard.press('Backspace')
      }
      await elements?.hover()
      await elements?.click({ clickCount: 3 }) // chọn hết văn bản
      await delay(300)

      if (shouldClearText) {
        await page.keyboard.press('Backspace') // sau khi click chọn hết
      }

      await elements?.type(text, { delay: random(50, 100) })
      enter && (await page.keyboard.press('Enter'))
      await delay(2000)

      return true
    }
  }
  return false
}
export const awaitclickForSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { selector, index, timeout } = options
  const start = Date.now()

  while (Date.now() - start < timeout) {
    try {
      const elements = await getElementsBySelector(page, {
        selector,
        index,
        timeout: 500 // timeout ngắn cho mỗi lần thử
      })

      if (elements) {
        const isVisible = await elements.boundingBox() // kiểm tra xem có trong viewport không
        if (isVisible) {
          await elements.click({ delay: 100 }) // thêm delay để mô phỏng người dùng thật
          return true
        }
      }
    } catch (err) {
      // có thể là lỗi detached hoặc không clickable
    }

    await delay(1000) // chờ 1 giây trước khi thử lại
  }

  return false // hết timeout
}

export const elementWaitForSelector = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await element.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}

export const waitLostForSelector = async (
  page: Page,
  selector: string,
  timeout: number
): Promise<boolean> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      if (!(await waitForSelector(page, selector, 1000))) {
        return true
      }
    } catch {
      return false
    }
    await delay(1000)
  }
  return false
}
export const clickGmailInNewTab = async (page: Page): Promise<boolean> => {
  try {
    const waitAndGetShadowRoot = async (
      handle: ElementHandle
    ): Promise<ElementHandle<Node> | null> => {
      const shadowRoot = await handle.evaluateHandle((el) => el.shadowRoot)
      return shadowRoot.asElement()
    }

    console.log('🔍 Tìm <ntp-app>...')
    const ntpApp = await page.waitForSelector('ntp-app', { timeout: 5000 })
    if (!ntpApp) throw new Error('❌ Không tìm thấy <ntp-app>')

    const shadow1 = await waitAndGetShadowRoot(ntpApp)
    if (!shadow1) throw new Error('❌ Không mở được shadowRoot từ <ntp-app>')

    const content = await shadow1.$('#content')
    if (!content) throw new Error('❌ Không tìm thấy #content trong shadow1')

    const ntpIframe = await content.$('ntp-iframe#oneGoogleBar')
    if (!ntpIframe) throw new Error('❌ Không tìm thấy <ntp-iframe#oneGoogleBar>')

    const shadow2 = await waitAndGetShadowRoot(ntpIframe)
    if (!shadow2) throw new Error('❌ Không mở được shadowRoot từ ntp-iframe')

    const iframeElement = await shadow2.$('iframe#iframe')
    if (!iframeElement) throw new Error('❌ Không tìm thấy iframe#iframe')

    const iframeContent = await iframeElement.contentFrame()
    if (!iframeContent)
      throw new Error('❌ Không thể truy cập nội dung iframe (likely cross-origin)')

    console.log('🔍 Tìm nút Gmail...')
    const gmailLink = await iframeContent.$('a[aria-label*="Gmail"]')
    if (!gmailLink) {
      console.warn('❌ Không tìm thấy nút Gmail trong iframe')
      return false
    }

    await gmailLink.click()
    console.log('✅ Đã click Gmail thành công')
    return true
  } catch (err) {
    console.error('🚨 Lỗi khi click Gmail trong new tab:', err)
    return false
  }
}

export const elementWaitLostForSelector = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      await element.waitForSelector(selector, { timeout: 1000 })
    } catch {
      return true
    }
    await delay(1000)
  }
  return false
}

export const waitForElement = async (
  element: ElementHandle<Element>,
  selector: string,
  timeout: number
): Promise<boolean> => {
  try {
    await element.waitForSelector(selector, { timeout })
  } catch {
    return false
  }
  return true
}

export const getElementsBySelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<ElementHandle<Element> | null> => {
  const { selector, index, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = await page.$$(selector)
      if (elements.length > index) {
        return elements[index]
      }
    } catch {
      return null
    }
    await delay(1000)
    return null
  }
  return null
}

export const getAllElementsBySelector = async (
  page: Page,
  options: {
    selector: string
    timeout: number
  }
): Promise<ElementHandle<Element>[] | []> => {
  const { selector, timeout } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const elements = await page.$$(selector)
      await delay(1000)
      return elements
    } catch {
      return []
    }
  }
  return []
}

export const waitElementExistScreen = async (
  page: Page,
  options: {
    selector: string | ElementHandle<Element>
    timeout: number
    index: number
  }
): Promise<0 | 1 | 2> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }

  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const result = await evaluateWithParams<0 | 1 | 2>(
        page,
        `(selectorTarget, indexElement) => {
          const element =
            document.querySelectorAll(selectorTarget)[indexElement];
          if (
            element === undefined ||
            element?.getBoundingClientRect().top <= 0
          ) {
            return 0;
          }
          if (
            element?.getBoundingClientRect().top +
              element?.getBoundingClientRect().height >
            window.innerHeight
          ) {
            return 2;
          }
          return 1;
        }`,
        [selector, index]
      )
      if (result !== 0) {
        return result
      }
    } catch {
      return 0
    }
    await delay(1000)
  }
  return 0
}

export const waitElementLostScreen = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    index: number
  }
): Promise<0 | 1 | 2> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }

  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const result = await evaluateWithParams<number>(
        page,
        `(selectorTarget, indexElement) => {
          const element =
            document.querySelectorAll(selectorTarget)[indexElement];
          if (
            element === undefined ||
            element?.getBoundingClientRect().top <= 0
          ) {
            return 0;
          }
          if (
            element?.getBoundingClientRect().top +
              element?.getBoundingClientRect().height >
            window.innerHeight
          ) {
            return 2;
          }
          return 1;
        }`,
        [selector, index]
      )
      if (result === 0) {
        return result
      }
    } catch {
      return 1
    }
    await delay(1000)
  }
  return 1
}

export const checkExistElements = async (
  page: Page,
  timeout: number,
  querySelectors: string[]
): Promise<number> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      let num = 0

      num = await evaluateWithParams<number>(
        page,
        `(selectors) => {
			let output = 0;
			for (let i = 0; i < selectors.length; i++) {
				if (document.querySelectorAll(selectors[i]).length > 0) {
				output = i + 1;
				break;
				}
			}
			return output;
			}`,
        [querySelectors]
      )

      return num
    } catch {
      return 0
    }
  }
  return 0
}

export const checkExistElementsWithXpath = async (
  page: Page,
  timeout: number,
  querySelectors: string[]
): Promise<number> => {
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      let num = 0

      num = await evaluateWithParams<number>(
        page,
        `(selectors) => {
			let output = 0;
			for (let i = 0; i < selectors.length; i++) {
				if (document.evaluate(selector[i], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength > 0){
				output = i + 1;
				break;
				}
			}
			return output;
			}`,
        [querySelectors]
      )

      return num
    } catch {
      return 0
    }
  }
  return 0
}
