import { delay } from '@vitechgroup/mkt-key-client'
import { random } from 'lodash'
import { ElementHandle, Page } from 'puppeteer-core'
import { evaluate } from '.'

const scrollToElementVisible = async (
  page: Page,
  payload: { element: ElementHandle | null; time?: number }
): Promise<boolean> => {
  const { element, time = Date.now() + 10000 } = payload
  if (!element) {
    return false
  }

  const viewportHeight = await evaluate<number>(page, `() => window.innerHeight`)

  const targetY = viewportHeight / 2

  let elementY = -1

  await page.mouse.move(252, 192)

  while (Date.now() < time) {
    const boundingBox = await element.boundingBox()
    if (boundingBox) {
      elementY = boundingBox.y + boundingBox.height / 2
      if (Math.abs(elementY - targetY) < 50) {
        await element.scrollIntoView()
        break
      }

      const deltaY = elementY < targetY ? -50 : 50

      await page.mouse.wheel({ deltaY })

      await delay(100)
    } else {
      await delay(500)
    }
  }
  return false
}

export const waitElementAndClick = async (
  page: Page,
  options: {
    selector: string
    timeout?: number
    is_scroll?: boolean
  }
): Promise<ElementHandle<Element> | undefined> => {
  const { selector, timeout = 10000, is_scroll = false } = options
  return page
    .waitForSelector(selector, { timeout })
    .then(async (element) => {
      if (!element) {
        return undefined
      }

      if (is_scroll) {
        await scrollToElementVisible(page, { element })
      }

      element.click()

      return element
    })
    .catch(() => undefined)
}

export const waitElementAndScreenShoot = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    is_scroll?: boolean
  }
): Promise<{ image: string; width: number; height: number } | undefined> => {
  const { selector, timeout, is_scroll = false } = options
  return page
    .waitForSelector(selector, { timeout })
    .then(async (element) => {
      if (!element) {
        return undefined
      }
      if (is_scroll) {
        await scrollToElementVisible(page, { element })
      }

      const image = await element.screenshot({ encoding: 'base64' })

      const boundingBox = await element.boundingBox()

      return { image, width: boundingBox?.width || -1, height: boundingBox?.height || -1 }
    })
    .catch(() => {
      return undefined
    })
}

export const waitElementAndTypeText = async (
  page: Page,
  options: {
    selector: string
    timeout?: number
    text: string
    is_scroll?: boolean
    is_enter?: boolean
  }
): Promise<ElementHandle<Element> | undefined> => {
  const { selector, timeout = 10000, text, is_scroll = false, is_enter = false } = options
  return page
    .waitForSelector(selector, { timeout })
    .then(async (element) => {
      if (!element) {
        return undefined
      }

      if (is_scroll) {
        await scrollToElementVisible(page, { element })
      }

      element.type(text, { delay: 39 })

      if (is_enter) {
        await page.keyboard.press('Enter')
      }

      return element
    })
    .catch(() => {
      return undefined
    })
}

export const waitElementAndUploadFile = async (
  page: Page,
  options: {
    selector: string
    timeout?: number
    path: string
    is_scroll?: boolean
  }
): Promise<ElementHandle<Element> | undefined> => {
  const { selector, timeout = 10000, path, is_scroll = false } = options
  return page
    .waitForSelector(selector, { timeout })
    .then(async (element) => {
      if (!element) {
        return undefined
      }

      if (is_scroll) {
        await scrollToElementVisible(page, { element })
      }

      await (element as ElementHandle<HTMLInputElement>).uploadFile(path)

      return element
    })
    .catch(() => {
      return undefined
    })
}

export const waitElementsAndClickRandom = async (
  page: Page,
  options: {
    selector: string
    timeout?: number
    is_scroll?: boolean
    index?: number
  }
): Promise<boolean> => {
  const { selector, timeout = 10000, is_scroll = false, index = -1 } = options
  return page
    .waitForSelector(selector, { timeout })
    .then(async (e) => {
      if (!e) {
        return false
      }

      const elements = await page.$$(selector)
      if (!elements) {
        return false
      }

      const element = elements[index !== -1 ? index : random(0, elements.length - 1)]

      if (is_scroll) {
        await scrollToElementVisible(page, { element })
      }

      element.click()

      return true
    })
    .catch(() => {
      return false
    })
}
