import { IViewPortPosition } from '@main/types'
import { delay } from '@vitechgroup/mkt-key-client'
import { random } from 'lodash'
import { ElementHandle, Page } from 'puppeteer-core'
import { checkExistElements } from './elements'

const moveMouseToViewportPosition = async (
  page: Page,
  x = 0.5,
  y = 0.5
): Promise<IViewPortPosition> => {
  const viewport = page.viewport()
  if (!viewport) {
    return { x: 252, y: 192 }
  }

  const { width, height } = viewport
  const p = { x: width * x, y: height * y }

  await page.mouse.move(p.x, p.y)

  return p
}

export const scrollVerticalByMouse = async (
  page: Page,
  y: number,
  wait: number = 50,
  time: number = Date.now() + 10000
): Promise<boolean> => {
  try {
    let isScroll = true
    while (isScroll) {
      await moveMouseToViewportPosition(page, 0.7, 0.5)
      await page.mouse.wheel({ deltaY: y })
      if (Date.now() > time) {
        isScroll = false
      }
      await delay(wait)
    }
    return true
  } catch (error) {
    console.log('🚀 ~ scrollVerticalByMouse:', error)
    return false
  }
}
export const scrollVertical = async (
  page: Page,
  y: number,
  wait: number = 50,
  counter: number = 1
): Promise<boolean> => {
  try {
    let count = 0
    while (count++ < counter) {
      await moveMouseToViewportPosition(page, 0.7, 0.5)
      await page.mouse.wheel({ deltaY: y })
      await delay(wait)
    }
    return true
  } catch (error) {
    console.log('🚀 ~ scrollVertical:', error)
    return false
  }
}

export const scrollToElementVisible = async (
  page: Page,
  payload: { element: ElementHandle | null; time?: number }
): Promise<boolean> => {
  try {
    const { element, time = Date.now() + 10000 } = payload
    if (!element) {
      return false
    }

    const p = await moveMouseToViewportPosition(page)

    let elementY = -1

    while (Date.now() < time) {
      const boundingBox = await element.boundingBox()
      if (boundingBox) {
        elementY = boundingBox.y + boundingBox.height / 2
        if (Math.abs(elementY - p.y) < 50) {
          await page.evaluate((el) => el.scrollIntoView({ block: 'center' }), element)
          return true
        }
        const deltaY = elementY < p.y ? -50 : 50
        await page.mouse.wheel({ deltaY })
        await delay(100)
      } else {
        await delay(500)
      }
    }
  } catch (error) {
    console.log('🚀 ~ scrollToElementVisible:', error)
  }
  return false
}

export const scrollToSelectorVisible = async (
  page: Page,
  payload: { selectors: string[]; time?: number },
  deltaY: number = 100
): Promise<boolean> => {
  try {
    const { selectors, time = Date.now() + 5000 } = payload
    if (!selectors) {
      return false
    }
    while (Date.now() < time) {
      const index = await checkExistElements(page, 1000, selectors)
      if (index > 0) {
        break
      }
      await page.mouse.wheel({ deltaY })
      await delay(random(200, 300))
    }
    return true
  } catch (error) {
    console.log('🚀 ~ scrollToSelectorVisible:', error)
    return false
  }
}
