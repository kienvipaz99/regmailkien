/* eslint-disable no-constant-condition */
import { sendMessageToMain } from '@main/core/nodejs'
import { AccountGmailModel } from '@main/database/models'
import {
  clickByPoint,
  clickDetectNodeByXPath,
  detectNodeByXPath,
  Point,
  swipePhone
} from '@main/nodejs/actionphone'
import {
  activeADBKeyboard,
  inputText,
  unactiveADBKeyboard
} from '@main/nodejs/actionphone/adbkeyboad'
import { disableInterNet, enableInterNet } from '@main/nodejs/actionphone/click-adb'
import {
  clickGender,
  generateRandomEmail,
  generateRandomPassword,
  randomAction,
  randomVietnameseName
} from '@main/nodejs/actionphone/random-action'
import { ICustomData, ITaskName } from '@main/types'
import { delay } from '@vitechgroup/mkt-key-client'
import { random } from 'lodash'
import { closeApp, isOpenedApp, openApp } from '../../../actionphone/open-app'

export const RegGmailPhone = async (data: ICustomData<ITaskName>): Promise<boolean> => {
  try {
    const { serinamephone, jobData, parentPort } = data as ICustomData<'create_gmail'>
    const { default_password, first_name_path, use_random_password, interval, last_name_path } =
      jobData.config

    const firstName = randomVietnameseName(first_name_path)
    const lastName = randomVietnameseName(last_name_path)
    const password = use_random_password ? generateRandomPassword() : default_password
    const email = generateRandomEmail()
    if (!serinamephone) {
      return false
    }
    await activeADBKeyboard(serinamephone)
    await openApp(serinamephone)

    if (await isOpenedApp(serinamephone, 'checkopengmail', 120)) {
      await clickDetectNodeByXPath(
        serinamephone,
        '//node[@resource-id="com.google.android.gm:id/selected_account_disc_gmail"]',
        4
      )
      while (true) {
        if (await detectNodeByXPath(serinamephone, '//node[@text="Thêm tài khoản khác"]', 3)) {
          console.log('đẫ tìm thấy')

          await clickDetectNodeByXPath(serinamephone, '//node[@text="Thêm tài khoản khác"]', 3)
          await delay(2000)
          break
        } else {
          await swipePhone(serinamephone, 120, 500, 120, 50)
        }
      }
      await clickDetectNodeByXPath(serinamephone, '//node[@text="Google"]', 3)
      await clickDetectNodeByXPath(serinamephone, '//node[@text="Tạo tài khoản"]', 6)
      await clickByPoint(serinamephone, new Point(540, 1110))
      if (await detectNodeByXPath(serinamephone, '//node[@text="Nhập tên của bạn"]', 3)) {
        await clickByPoint(serinamephone, new Point(540, 731))
        // nhập họ
        console.log('data', lastName)
        await inputText(serinamephone, lastName)

        await clickByPoint(serinamephone, new Point(540, 971))
        //nhap ten
        await inputText(serinamephone, firstName)
        console.log('data', firstName)

        await clickDetectNodeByXPath(serinamephone, '//node[@class="android.widget.Button"]', 2)
        if (await detectNodeByXPath(serinamephone, '//node[@text="Thông tin cơ bản"]', 3)) {
          await clickByPoint(serinamephone, new Point(213, 731))
          // nhập ngày sinh
          await inputText(serinamephone, random(1, 31).toString())

          await clickDetectNodeByXPath(serinamephone, '//node[@resource-id="month"]', 2)

          await randomAction(serinamephone)

          await clickByPoint(serinamephone, new Point(867, 731))
          //nhap năm
          await inputText(serinamephone, random(1980, 2005).toString())

          await clickDetectNodeByXPath(serinamephone, '//node[@resource-id="gender"]', 2)
          await clickGender(serinamephone)

          await clickDetectNodeByXPath(serinamephone, '//node[@class="android.widget.Button"]', 2)
          if (
            await detectNodeByXPath(
              serinamephone,
              '//node[@text="Chọn địa chỉ Gmail của bạn Chọn một địa chỉ Gmail hoặc tạo địa chỉ của riêng bạn"]',
              2
            )
          ) {
            await clickDetectNodeByXPath(serinamephone, '//node[@resource-id="selectionc15"]', 2)
            await inputText(serinamephone, email)
          } else {
            if (await detectNodeByXPath(serinamephone, '//node[@text="Cách bạn đăng nhập"]', 3)) {
              //nhap gmail
              await inputText(serinamephone, email)
            }
          }

          await clickDetectNodeByXPath(serinamephone, '//node[@class="android.widget.Button"]', 2)

          if (await detectNodeByXPath(serinamephone, '//node[@text="Tạo một mật khẩu mạnh"]', 3)) {
            //nhap mat khau
            await inputText(serinamephone, password)
            await clickDetectNodeByXPath(serinamephone, '//node[@class="android.widget.Button"]', 2)
          }
          if (
            await detectNodeByXPath(
              serinamephone,
              '//node[@text="Xem lại thông tin tài khoản của bạn Sau này, bạn có thể sử dụng địa chỉ email này để đăng nhập"]',
              3
            )
          ) {
            await clickDetectNodeByXPath(serinamephone, '//node[@class="android.widget.Button"]', 2)
            await swipePhone(serinamephone, 120, 1200, 120, 50)
            await swipePhone(serinamephone, 120, 1200, 120, 50)
            await clickDetectNodeByXPath(serinamephone, '//node[@text="Tôi đồng ý"]', 2)

            await AccountGmailModel.upsert([
              {
                gmail: email + '@gmail.com',
                password: password
              }
            ])
            console.log('create gmail success', email, password)
            sendMessageToMain(parentPort, { key: 'read_data_account_gmail' })
            await delay(15000)
            await closeApp(serinamephone)
            await disableInterNet(serinamephone)
            await delay(5000)
            await enableInterNet(serinamephone)
            await delay(random(interval.from, interval.to))
            await unactiveADBKeyboard(serinamephone)
          }
        }
      }
    }

    return true
  } catch (error) {
    console.error('error scanGMapByKeyword', error)
    return false
  }
}
