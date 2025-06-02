import { createResponse, KEY_256, logger, MASP, VERSION_APP } from '@main/core/nodejs'
import { IMainResponse, IUser } from '@preload/types'
import {
  Auth,
  ILogin,
  ILoginToolResponse,
  IRegisterForm,
  makeLicense,
  makeMediaUrl,
  MktClient,
  sha256His
} from '@vitechgroup/mkt-key-client'

export const AuthModel = {
  setLicense: async (username: string): Promise<MktClient> => {
    try {
      const his = await sha256His()
      MktClient.forLicense('NO LICENSE', 'NO SECRET')

      const { userId } = await MktClient.get().auth.getUserId(username)
      if (!userId || !his) {
        throw new Error('username Khong ton tai!')
      }

      const license = makeLicense(MASP, his, userId)
      const mktClient = MktClient.forLicense(license, KEY_256)
      return mktClient
    } catch (error) {
      console.log('🚀 ~ setLicense: ~ error:', error)
      throw new Error('AuthModel setLicense error!')
    }
  },

  loginTool: async (payload: ILogin): Promise<IUser | undefined> => {
    try {
      const mktClient = await AuthModel.setLicense(payload.username)

      const auth = await mktClient.auth.loginTool({ ...payload, version: VERSION_APP })
      if (auth.refreshToken && auth.refreshToken.value) {
        mktClient.httpClient.setAuth(auth)

        return await AuthModel.updateUserInfo({ ...auth, ...payload })
      }
    } catch (error) {
      logger.error(`Auth login tool error: ${error}`)
    }

    return
  },

  login: async (payload: ILogin): Promise<IUser | undefined> => {
    try {
      const auth = await MktClient.get().auth.login(payload)
      if (auth && auth.accessToken) {
        MktClient.get().httpClient.setAuth(auth as Auth)

        return await AuthModel.updateUserInfo({ ...payload, ...auth })
      }
    } catch (error) {
      logger.error(`Auth login error: ${error}`)
    }

    return
  },

  register: async (payload: IRegisterForm): Promise<IMainResponse<boolean>> => {
    try {
      const response = await MktClient.get().auth.register(payload)
      if (response && response.success) {
        return createResponse('register_success', 'success')
      }
    } catch (error) {
      logger.error(`Auth register error: ${error}`)
    }

    return createResponse('register_failed', 'error')
  },

  updateUserInfo: async (
    auth: ILogin & Partial<ILoginToolResponse>
  ): Promise<IUser | undefined> => {
    const [customer, profile] = await Promise.all([
      MktClient.get().customer.getMe(),
      MktClient.get().auth.getProfile()
    ])

    const expiresAt = new Date(Date.now() + auth.accessToken!.expiresIn)
    const user = {
      email: auth.username,
      password: auth.password,
      remember: auth.remember || false,
      apiToken: auth.accessToken!.value,
      refreshToken: auth.refreshToken!.value,
      expiresIn: auth.accessToken!.expiresIn,
      userId: auth.userId,
      his: auth.his,
      isCustomer: auth.isCustomer,
      isEmployee: auth.isEmployee,
      expiresAt,
      customerId: customer.id,
      fullName: profile.fullName,
      avatar: makeMediaUrl(
        typeof profile.avatar === 'string' ? profile.avatar : profile.avatar?.path || ''
      ),
      remainingDay: auth.remainingDay || 0,
      isVinhVien: auth.isVinhVien
    }

    try {
      return user as unknown as IUser
    } catch (error) {
      logger.error(`Auth update user info error: ${error}`)
    }

    return
  },

  logout: async (user: IUser): Promise<IUser | undefined> => {
    try {
      await MktClient.get().auth.logout(user.refreshToken)

      user.apiToken = ''

      return user
    } catch (error) {
      logger.error(`Auth logout error ${error}`)
    }

    return
  },

  logoutTool: async (payload?: ILogin): Promise<boolean> => {
    try {
      const his = await sha256His()
      await MktClient.get().auth.logoutTool({
        his,
        masp: MASP,
        username: process.env.USERNAME_MKT || payload?.username || '',
        password: process.env.PASSWORD_MKT || payload?.password || ''
      })
      return true
    } catch (error) {
      logger.error(`Auth logout error ${error}`)
    }

    return false
  }
}
