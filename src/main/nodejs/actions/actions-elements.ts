import { delay } from '@vitechgroup/mkt-key-client'
import { Browser, ElementHandle, FileChooser, Page } from 'puppeteer-core'
import { evaluateWithParams, getElementsBySelector, waitElementExistScreen } from '.'

export const clickForSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { selector, index, timeout } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    await elements?.click()
  } catch {
    return false
  }
  return true
}

export const tapForSelector = async (
  page: Page,
  options: {
    selector: string
    index: number
    timeout: number
  }
): Promise<boolean> => {
  const { selector, index, timeout } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    await elements?.tap()
  } catch {
    return false
  }
  return true
}

export const typeTextToElement = async (
  page: Page,
  options: {
    element: ElementHandle | null
    text: string
    shouldClearText: boolean
    enter?: boolean
  }
): Promise<boolean> => {
  const { element, text, shouldClearText, enter = false } = options
  try {
    if (shouldClearText) {
      await element?.focus()
      await page.keyboard.down('Control')
      await page.keyboard.press('A')
      await page.keyboard.up('Control')
      await page.keyboard.press('Backspace')
    }
    await element?.type(text, { delay: 10 })
    enter && (await page.keyboard.press('Enter'))
  } catch {
    return false
  }
  return true
}

export const typeTextToSelector = async (
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
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })

    if (shouldClearText) {
      await elements?.focus()
      await page.keyboard.down('Control')
      await page.keyboard.press('A')
      await page.keyboard.up('Control')
      await page.keyboard.press('Backspace')
    }
    await elements?.type(text, { delay: 100 })
    enter && (await page.keyboard.press('Enter'))
  } catch {
    return false
  }
  return true
}

export const scrollWindow = async (page: Page, scrollValue: number): Promise<boolean> => {
  try {
    const fn = `(scroll) =>
      window.scroll({
        top: window.scrollY + scroll,
        behavior: 'smooth',
      })`
    await evaluateWithParams(page, fn, [scrollValue])
  } catch {
    return false
  }
  return true
}

export const scrollSmooth = async (page: Page, distance: number): Promise<boolean> => {
  try {
    const fn = `(top) =>
      window.scroll({
        top,
        behavior: 'smooth',
      })`
    await evaluateWithParams(page, fn, [distance])
    return true
  } catch {
    return false
  }
}

export const evaluateClickSelector = async (
  page: Page,
  options: {
    selector: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, timeout, index } = options
  const initialTime = new Date().getTime()
  let futureTime = 0
  if (timeout !== null) {
    futureTime = initialTime + timeout
  }
  while (futureTime === null || new Date().getTime() < futureTime) {
    try {
      const fn = `(selectorTarget, indexElement) => {
        const elementTarget = document.querySelectorAll(selectorTarget);
        if (elementTarget.length > indexElement) {
          elementTarget[indexElement].click();
          return true;
        }
        return false;
      }`

      const result = await evaluateWithParams<boolean>(page, fn, [selector, index])
      if (result) return true
    } catch {
      return false
    }
    await delay(1000)
  }
  return false
}

export const scrollToElement = async (
  page: Page,
  options: {
    selector: string | ElementHandle<Element>
    scrollTime: number
    scrollValue: number
    index: number
  }
): Promise<boolean> => {
  const { selector, scrollTime, scrollValue, index } = options
  const timeout = 1000
  try {
    for (let i = 0; i < scrollTime; i++) {
      await scrollWindow(page, scrollValue)
      if (
        (await waitElementExistScreen(page, {
          selector,
          timeout,
          index
        })) === 1
      )
        return true
      await delay(1000)
    }
    const fn = `(selectorTarget, indexElement) => {
      const elements =
        document.querySelectorAll(selectorTarget)[indexElement];
      if (elements)
        elements.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }`

    await evaluateWithParams(page, fn, [selector, index])
    return true
  } catch {
    return false
  }
}

export const clearText = async (page: Page, selector: string): Promise<void> => {
  const input = await page.$(selector)
  await input?.click()
  await page.keyboard.press('Backspace')
}

export const uploadFile = async (
  page: Page,
  options: {
    selector: string
    path: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, path, timeout, index } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements) {
      await (elements as ElementHandle<HTMLInputElement>).uploadFile(path)
      return true
    }
  } catch {
    return false
  }
  return false
}

export const waitForFileChooser = async (page: Page): Promise<FileChooser | undefined> => {
  try {
    return await page.waitForFileChooser({ timeout: 10000 })
  } catch (e) {
    return undefined
  }
}

export const uploadFileByAccept = async (
  page: Page,
  options: {
    element: ElementHandle<Element>
    path: string
  }
): Promise<boolean> => {
  try {
    const [fileChooser] = await Promise.all([waitForFileChooser(page), options.element.tap()])
    await fileChooser?.accept([options.path])
    return true
  } catch (e) {
    return false
  }
}

export const uploadFileByAccepts = async (
  page: Page,
  options: {
    element: ElementHandle<Element>
    path: string[]
  }
): Promise<boolean> => {
  try {
    const [fileChooser] = await Promise.all([waitForFileChooser(page), options.element.click()])
    await fileChooser?.accept(options.path)
    return true
  } catch (e) {
    return false
  }
}

export const selectOption = async (
  page: Page,
  options: {
    selector: string
    value: string
    timeout: number
    index: number
  }
): Promise<boolean> => {
  const { selector, value, timeout, index } = options
  try {
    const elements = await getElementsBySelector(page, {
      selector,
      index,
      timeout
    })
    if (elements != null) {
      await elements.select(value)
      return true
    }
  } catch {
    return false
  }
  return false
}

export const close = async (browser: Browser): Promise<boolean> => {
  try {
    await browser.close()
    return true
  } catch {
    return false
  }
}

export const getClassNameElementByInnerHtml = async (
  page: Page,
  htmlContents: string[],
  selectors: string[]
): Promise<string | undefined> => {
  for (const selector of selectors) {
    const className = await page.$$eval(
      selector,
      (elements, htmlContents) => {
        const element = elements.find((el) =>
          htmlContents.some((content) => el.innerHTML.includes(content))
        )
        if (element) {
          return element.className
        }
        return null
      },
      htmlContents
    )

    if (className) {
      return className
    }
  }
  return undefined
}

export const uploadFileForElement = async (
  element: ElementHandle<Element>,
  options: {
    path: string
    selector: string
  }
): Promise<boolean> => {
  try {
    const inputElement = await element.$(options.selector)
    if (inputElement) {
      await (inputElement as ElementHandle<HTMLInputElement>).uploadFile(options.path)
      return true
    }
  } catch {
    return false
  }
  return false
}
