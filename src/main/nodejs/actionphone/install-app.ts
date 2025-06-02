import { logger } from '@main/core/nodejs'
import { CommanAdb } from './commandadb'

/**
 * Cài đặt APK vào thiết bị Android qua ADB.
 * @param deviceId ID của thiết bị (đầu ra của `adb devices`)
 * @param apkPath Đường dẫn tới file APK trên máy tính (ví dụ: "C:/apps/app-release.apk")
 */
export const installApk = async (deviceId: string, apkPath: string): Promise<boolean> => {
  if (!apkPath.endsWith('.apk')) {
    logger.error(`❌ Đường dẫn APK không hợp lệ: ${apkPath}`)
    return false
  }

  const result = await CommanAdb(deviceId, `install -r "${apkPath}"`) // `-r` để ghi đè nếu app đã tồn tại

  if (result && result.stdout.includes('Success')) {
    logger.info(`✅ Cài đặt APK thành công trên thiết bị ${deviceId}`)
    return true
  } else {
    logger.error(`❌ Lỗi cài đặt APK: ${result?.stdout || 'Không có output'}`)
    return false
  }
}
export const inputText = async (deviceId: string, text: string): Promise<void> => {
  try {
    const b64Text = Buffer.from(text, 'utf-8').toString('base64')
    const command = `shell am broadcast -a ADB_INPUT_B64 --es msg "${b64Text}"`
    await CommanAdb(deviceId, command)
  } catch (error) {
    logger.error(`❌ Lỗi khi nhập văn bản vào thiết bị ${deviceId}: ${String(error)}`)
  }
}
