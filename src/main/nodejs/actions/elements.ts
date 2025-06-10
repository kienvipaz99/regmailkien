import { delay } from '@vitechgroup/mkt-key-client'
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
