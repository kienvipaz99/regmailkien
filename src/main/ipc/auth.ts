import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse, logger } from '@main/core/nodejs'
import { settings } from '@main/helper'
import { isEmpty } from 'lodash'

export const IpcMainAuth = (): void => {
  // ipcMainHandle('auth_getHis', async () => {
  //   try {
  //     const data = await sha256His()
  //     if (!isEmpty(data)) {
  //       return createResponse('get_his_success', 'success', { data })
  //     }
  //   } catch (error) {
  //     logger.error(`Auth get his error ${error}`)
  //   }
  //   return createResponse('get_his_failed', 'error')
  // })

  ipcMainHandle('auth_getUser', async () => {
    try {
      const data = settings.get('user')
      if (!isEmpty(data)) {
        return createResponse('get_account_success', 'success', {
          data
        })
      }
    } catch (error) {
      logger.error(`Auth get User error ${error}`)
    }
    return createResponse('get_info_account_failed', 'error')
  })

  // ipcMainHandle('auth_forgotPass', () => {
  //   return createResponse('forgot_password_success', 'success')
  // })

  // ipcMainHandle('auth_login', async (_, payload) => {
  //   const result = await AuthModel.login(payload)
  //   if (!result) {
  //     return createResponse('login_failed', 'error')
  //   }
  //   settings.set('user', result)
  //   return createResponse('login_success', 'success')
  // })

  // ipcMainHandle('auth_loginTool', async (_, payload) => {
  //   const result = await AuthModel.loginTool(payload)
  //   if (!result) {
  //     return createResponse('login_failed', 'error')
  //   }
  //   settings.set('user', result)
  //   return createResponse('login_success', 'success')
  // })

  // ipcMainHandle('auth_logout', async () => {
  //   try {
  //     if (!user?.apiToken || !user?.refreshToken) {
  //       return createResponse('api_token_or_refresh_token_not_null', 'error')
  //     }

  //     const result = await AuthModel.logout(user)
  //     settings.set('user', result)
  //     return createResponse('logout_success', 'success')
  //   } catch (error) {
  //     logger.error(`Auth logout error ${error}`)
  //   }
  //   return createResponse('logout_failed', 'error')
  // })

  // ipcMainHandle('auth_register', async (_, payload) => {
  //   return await AuthModel.register(payload)
  // })

  // ipcMainHandle('auth_verifyToken', () => {
  //   return createResponse('verify_token_success', 'success')
  // })
}
