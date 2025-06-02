import { ipcMainHandle } from '@main/core/custom-ipc'
import { checkValidChrome } from '@main/core/electron'
import { createResponse } from '@main/core/nodejs'
import { settings, updateSettingBy } from '@main/helper'
import { checkApiKeyGemini, checkApiKeyOpenAI } from '@main/nodejs/helper'
import type { IResponseCheckAi, IStatusCheckAi } from '@preload/types'

export const IpcMainSetting = (): void => {
  ipcMainHandle('setting_readSettingBy', async (_, payload) => {
    return createResponse('read_setting_system_success', 'success', {
      data: settings.get(payload.key)
    })
  })

  ipcMainHandle('setting_updateSettingBy', async (_, payload) => {
    updateSettingBy(payload.key, payload.value, false)
    if (payload.key === 'setting_system') {
      const { chrome_path, chrome_version } = settings.get('setting_system')
      checkValidChrome(chrome_path, chrome_version)
    }
    return createResponse('update_setting_success', 'success')
  })

  ipcMainHandle('setting_checkKeyAi', async (_, payload) => {
    let status: IResponseCheckAi = null
    let msg: IStatusCheckAi | null = null

    switch (payload.ai) {
      case 'gemini':
        status = await checkApiKeyGemini(payload.key, payload.model)
        break
      case 'gpt':
        status = await checkApiKeyOpenAI(payload.key)
        break
    }

    switch (status) {
      case 200:
        msg = 'valid_api_key'
        break
      case 401:
        msg = 'invalid_api_key'
        break
      case 429:
        msg = 'key_api_limit'
        break
      case 500:
        msg = 'server_error'
        break
      default:
        msg = 'error_unknown'
        break
    }

    return createResponse('check_key_ai_success', 'success', {
      data: msg
    })
  })
}
