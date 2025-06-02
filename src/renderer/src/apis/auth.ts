import type { AuthArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const AuthApi: IIpcCustomRenderer<AuthArgRoutes> = {
  getUser: async () => window.api.auth.getUser()
  // getHis: async () => window.api.auth.getHis(),
  // loginTool: async (payload) => window.api.auth.loginTool(payload),
  // logoutTool: async () => window.api.auth.logoutTool()
  // forgotPass: async () => window.api.auth.forgotPass(),
  // login: async (payload) => window.api.auth.login(payload),
  // logout: async () => window.api.auth.logout(),
  // register: async (payload) => window.api.auth.register(payload),
  // verifyToken: async () => window.api.auth.verifyToken()
}
