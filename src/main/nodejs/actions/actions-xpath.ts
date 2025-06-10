import { logger } from '@main/core/nodejs'
import { ResultType } from '@vitechgroup/mkt-browser'
import { delay, sampleShuffle, splitTrim } from '@vitechgroup/mkt-key-client'
import { map, sample } from 'lodash'
import { ElementHandle, Page } from 'puppeteer-core'
import { scrollToElementVisible } from '.'

const translateExpression = (text: string): string => {
  const upperCaseChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZĂÂÊÔƠƯÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠÀẠẢÃÂẦẤẨẪẬĂẰẮẲẴẶÈẸẺẼÊỀẾỂỄỆÌÍỊÒỌỎÕÔỒỐỔỖỘƠỜỚỞỠỢÙÚỤỦŨƯỪỨỬỮỰỲÝỴỶỸ'
  const lowerCaseChars =
    'abcdefghijklmnopqrstuvwxyzăâêôơưàáâãèéêìíòóôõùúăđĩũơàạảãâầấẩẫậăằắẳẵặèẹẻẽêềếểễệìíịòọỏõôồốổỗộơờớởỡợùúụủũưừứửữựỳýỵỷỹ'
  return `translate(${text}, "${upperCaseChars}", "${lowerCaseChars}")`
}

export const generateXpath = (options: { xpath: string; innerText: string }): string[] => {
  const xpaths = splitTrim(options.xpath, '|') || []
  const innerTexts = splitTrim(options.innerText, '|') || []
  return xpaths.flatMap((xpath) =>
    innerTexts.map(
      (text) =>
        `::-p-xpath(//${xpath}[contains(${translateExpression('.')}, "${text.toLowerCase()}") or contains(${translateExpression('@aria-label')}, "${text.toLowerCase()}") or contains(${translateExpression('@accept')}, "${text.toLowerCase()}")])`
    )
  )
}

export const findElementForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    scroll?: boolean
    controllerRace?: AbortController
    timeout?: number
  }
): Promise<ResultType<ElementHandle<Element>>> => {
  try {
    const { innerText, xpath, scroll = false, timeout = 10000, controllerRace } = options
    const xpaths = generateXpath({ xpath, innerText })
    const result = await Promise.race(
      map(xpaths, (xpath) =>
        page
          .waitForSelector(xpath, {
            timeout,
            visible: true,
            signal: controllerRace?.signal
          })
          .then((el) => {
            controllerRace?.abort()
            return { is_show: !!el, selector: null, xpath, element: el }
          })
          .catch(() => ({
            is_show: false,
            element: null,
            xpath: null,
            selector: null
          }))
      )
    )

    if (scroll && result.element) {
      await scrollToElementVisible(page, { element: result.element })
    }

    return result
  } catch (error) {
    logger.error(`[Find element for xpath] ${error}`)
    return { is_show: false, element: null, xpath: null, selector: null }
  }
}

export const clickForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    scroll?: boolean
    timeout?: number
  }
): Promise<boolean> => {
  try {
    const abortController = new AbortController()
    const { element } = await findElementForXpath(page, {
      ...options,
      controllerRace: abortController
    })

    if (element) {
      await delay(1000)
      await element.click()
      return true
    }
  } catch (error) {
    logger.error(`[Click for xpath] ${error}`)
  }
  return false
}

export const typeTextForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    text: string
    scroll?: boolean
    timeout?: number
    focus?: boolean
    controllerRace?: AbortController
  }
): Promise<boolean> => {
  try {
    const abortController = new AbortController()

    const { element } = await findElementForXpath(page, {
      ...options,
      controllerRace: abortController
    })

    if (element) {
      if (options.focus) {
        element.focus()
      }
      await delay(1000)
      await element.type(options.text, { delay: 39 })
      return true
    }
  } catch (error) {
    logger.error(`[Type text for xpath] ${error}`)
  }
  return false
}

export const uploadFileForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    scroll?: boolean
    path: string
    timeout?: number
    controllerRace?: AbortController
  }
): Promise<boolean> => {
  try {
    const abortController = new AbortController()

    const { element } = await findElementForXpath(page, {
      ...options,
      controllerRace: abortController
    })

    if (element) {
      await delay(1000)
      await (element as ElementHandle<HTMLInputElement>).uploadFile(options.path)
      return true
    }
  } catch (error) {
    logger.error(`[Upload file for xpath] ${error}`)
  }
  return false
}

export const clickRandomElementForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    scroll?: boolean
    timeout?: number
    index?: number
    controllerRace?: AbortController
  }
): Promise<boolean> => {
  try {
    const { xpath } = await findElementForXpath(page, options)
    if (!xpath) {
      return false
    }

    const elements = await page.$$(xpath)
    if (!elements) {
      return false
    }

    const element = sampleShuffle<ElementHandle<Element>>(elements)
    if (!element) {
      return false
    }

    await element.click()

    return true
  } catch (error) {
    logger.error(`[Click random element for xpath] ${error}`)
  }
  return false
}

export const clickXpathAndTypeText = async (
  page: Page,
  options: { innerText: string; xpath: string; text: string; shouldClearText: boolean }
): Promise<void> => {
  const { innerText, xpath, text, shouldClearText } = options

  await clickForXpath(page, { innerText, xpath })

  if (shouldClearText) {
    await page.keyboard.down('Control')
    await page.keyboard.press('A')
    await page.keyboard.up('Control')
    await page.keyboard.press('Backspace')
  }

  await delay(1000)

  await page.keyboard.type(text, { delay: 39 })
}

export const getRandomElementForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
  }
): Promise<ElementHandle<Element> | undefined> => {
  try {
    const { innerText, xpath } = options

    const xpaths = generateXpath({ xpath, innerText })

    for (const xpath of xpaths) {
      const elements = await page.$$(xpath)
      if (elements.length > 0) {
        return sample(elements)
      }
    }
  } catch (error) {
    logger.error(`[Find all element for xpath] ${error}`)
  }
  return undefined
}

export const clickAllElementsForXpath = async (
  page: Page,
  options: {
    innerText: string
    xpath: string
    scroll: boolean
    timeout?: number
  }
): Promise<boolean> => {
  try {
    const { xpath } = await findElementForXpath(page, options)
    if (!xpath) {
      return false
    }

    const elements = await page.$$(xpath)
    if (!elements) {
      return false
    }

    for (const element of elements) {
      if (options.scroll) {
        await scrollToElementVisible(page, { element, time: 2000 })
      }
      await delay(2000)
      await element.click()
    }

    return true
  } catch (error) {
    logger.error(`[Click All Elements For Xpath] ${error}`)
  }
  return false
}
