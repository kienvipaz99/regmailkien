import { Buffer } from 'buffer'
import { CommanAdb } from './commandadb'

export const inputText = async (deviceId: string, text: string): Promise<void> => {
  try {
    const encoded = Buffer.from(text, 'utf-8').toString('base64')
    const command = `shell am broadcast -a ADB_INPUT_B64 --es msg ${encoded}`
    await CommanAdb(deviceId, command)
  } catch (error) {
    console.error(`❌ Failed to input text on ${deviceId}:`, error)
  }
}
export const clearText = async (deviceId: string): Promise<void> => {
  await CommanAdb(deviceId, `shell am broadcast -a ADB_CLEAR_TEXT`)
}
export const activeADBKeyboard = async (deviceId: string): Promise<void> => {
  try {
    let cmdCommand = `shell ime enable com.android.adbkeyboard/.AdbIME`
    await CommanAdb(deviceId, cmdCommand)

    cmdCommand = `shell ime set com.android.adbkeyboard/.AdbIME`
    await CommanAdb(deviceId, cmdCommand)
  } catch (error) {
    console.error('Error activating ADB Keyboard:', error)
  }
}
export const unactiveADBKeyboard = async (deviceId: string): Promise<void> => {
  try {
    const cmdCommands = `shell ime reset`
    await CommanAdb(deviceId, cmdCommands)
  } catch (error) {
    console.error('Error activating ADB Keyboard:', error)
  }
}
export const isPackageInstalled = async (
  deviceId: string,
  packageName: string
): Promise<boolean> => {
  try {
    const command = `shell pm list packages`
    const result = await CommanAdb(deviceId, command)
    // Kiểm tra kết quả trả về
    return result?.stdout?.includes(packageName) ?? false
  } catch (error) {
    console.error('Lỗi khi kiểm tra package:', error)
    return false // Giả định lỗi nghĩa là package không tồn tại
  }
}
