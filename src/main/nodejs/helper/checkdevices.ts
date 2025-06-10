import { logger } from '@main/core/nodejs'
import { delay } from '@vitechgroup/mkt-key-client'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class DeviceManager {
  public static availableDevices: string[] = []
  public static deviceLocks: Set<string> = new Set()

  public async getAvailableDevices(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('adb devices')
      const devices = stdout
        .split('\n')
        .slice(1)
        .filter((line) => line.trim() && line.includes('device'))
        .map((line) => line.split('\t')[0])
      DeviceManager.availableDevices = devices
      return devices
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error(`Error getting devices: ${errorMessage}`)
      return []
    }
  }

  public async acquireDevice(): Promise<string | null> {
    if (DeviceManager.availableDevices.length === 0) {
      await this.getAvailableDevices()
    }

    for (const device of DeviceManager.availableDevices) {
      if (!DeviceManager.deviceLocks.has(device)) {
        DeviceManager.deviceLocks.add(device)
        return device
      }
    }
    return null
  }

  public async waitForDevice(): Promise<string> {
    let device: string | null = null
    while (!device) {
      device = await this.acquireDevice()
      if (!device) {
        logger.info('Waiting for available device...')
        await delay(5000) // Wait 5 seconds before checking again
        await this.getAvailableDevices() // Refresh device list
      }
    }
    return device
  }

  public releaseDevice(device: string): void {
    DeviceManager.deviceLocks.delete(device)
  }
}
