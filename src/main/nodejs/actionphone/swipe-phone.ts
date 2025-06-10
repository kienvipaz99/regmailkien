import { logger } from '@main/core/nodejs'
import { CommanAdb } from './commandadb'

export const swipePhone = async (
  deviceId: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): Promise<boolean> => {
  const command = `shell input swipe ${x1} ${y1} ${x2} ${y2} 500`
  try {
    await CommanAdb(deviceId, command)
    logger.info(`✅ Vuốt trên thiết bị ${deviceId} từ (${x1},${y1}) đến (${x2},${y2})`)
    return true
  } catch (error) {
    logger.error(`❌ Lỗi vuốt trên thiết bị ${deviceId}: ${String(error)}`)
    return false
  }
}
