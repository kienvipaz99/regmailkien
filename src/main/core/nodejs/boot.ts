import { logger } from '@main/core/nodejs'
import { MktClient } from '@vitechgroup/mkt-key-client'

export const isLoggedIn = (): boolean => {
  try {
    const token = MktClient.get().httpClient.token
    if (token) {
      return true
    }
  } catch (error) {
    logger.error(`isLoggedIn: ${error}`)
  }
  return false
}
