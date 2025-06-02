import { delay } from '@vitechgroup/mkt-key-client'
import { CommanAdb } from './commandadb'
const packageName = 'com.google.android.gm'
export const openApp = async (serinamephone: string): Promise<void> => {
  await CommanAdb(
    serinamephone,
    `shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`
  )
}
export const closeApp = async (serinamephone: string): Promise<void> => {
  await CommanAdb(serinamephone, `shell am force-stop ${packageName}`)
}
export async function isOpenedApp(
  serinamephone: string,
  activeType: 'checkopengmail',
  timeOut: number
): Promise<boolean> {
  const startTime = Date.now()

  while ((Date.now() - startTime) / 1000 < timeOut) {
    try {
      const command = `shell dumpsys window windows | findstr "mCurrentFocus mFocusedApp""`
      let isRunning = false

      switch (activeType) {
        case 'checkopengmail': {
          const result = await CommanAdb(serinamephone, command)
          isRunning =
            result?.stdout?.includes(
              'com.google.android.gm/com.google.android.gm.ConversationListActivityGmail'
            ) ?? false
          break
        }
      }

      if (isRunning) return true
      await delay(3000)
    } catch {
      return false
    }
  }

  return false
}
