import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { AuthArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererAuth: IIpcCustomRenderer<AuthArgRoutes> = {
  getUser: async () => await ipcRendererInvoke('auth_getUser')
  // getHis: async () => await ipcRendererInvoke('auth_getHis'),
  // loginTool: async (payload) => await ipcRendererInvoke('auth_loginTool', payload),
  // logoutTool: async () => await ipcRendererInvoke('auth_logoutTool')
  // forgotPass: async () => await ipcRendererInvoke('auth_forgotPass'),
  // login: async (payload) => await ipcRendererInvoke('auth_login', payload),
  // logout: async () => await ipcRendererInvoke('auth_logout'),
  // register: async (payload) => await ipcRendererInvoke('auth_register', payload),
  // verifyToken: async () => await ipcRendererInvoke('auth_verifyToken')
}
