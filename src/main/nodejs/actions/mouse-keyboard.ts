import { Page } from 'puppeteer-core'
import { getElementsBySelector } from './elements'

export const clickMouse = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, timeout, index } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements != null) {
      const boundingBox = await elements.boundingBox()
      if (boundingBox != null) {
        await page.mouse.click(
          boundingBox.x + boundingBox.width / 2,
          boundingBox.y + boundingBox.height / 2
        )
        return true
      }
    }
  } catch {
    return false
  }
  return false
}

export const typeOnKeyboard = async (page: Page, text: string, delay: number): Promise<void> => {
  await page.keyboard.type(text, { delay })
}

export const keyboardPressEnter = async (page: Page): Promise<void> => {
  await page.keyboard.press('Enter')
}

export const clickMouseByBoundingBox = async (
  page: Page,
  boundingBox: {
    x: number
    width: number
    y: number
    height: number
  }
): Promise<boolean> => {
  try {
    if (boundingBox) {
      await page.mouse.click(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      )
      return true
    }
  } catch {
    return false
  }
  return false
}
