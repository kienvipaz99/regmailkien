import { clickDetectNodeByXPath } from '@main/nodejs/actionphone'
import { ICustomData, ITaskName } from '@main/types'
import { isOpenedApp, openApp } from '../../../actionphone/open-app'

export const RegGmailPhone = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  try {
    const { serinamephone } = data as ICustomData<'create_gmail'>
    if (!serinamephone) {
      return false
    }
    await openApp(serinamephone)

    if (await isOpenedApp(serinamephone, 'checkopengmail', 120)) {
      await clickDetectNodeByXPath(
        serinamephone,
        '//node[@resource-id="com.google.android.gm:id/selected_account_disc_gmail"]',
        4
      )
    }

    return true
  } catch (error) {
    console.error('error scanGMapByKeyword', error)
    return false
  }
}
