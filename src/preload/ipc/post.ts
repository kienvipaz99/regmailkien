import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { IIpcCustomRenderer, PostArgRoutes } from '@preload/types'

export const IpcRendererPost: IIpcCustomRenderer<PostArgRoutes> = {
  create: async (payload) => await ipcRendererInvoke('post_create', payload),
  readPostByParams: async (payload) => await ipcRendererInvoke('post_readPostByParams', payload),
  removeByField: async (payload) => await ipcRendererInvoke('post_removeByField', payload),
  updatePostByField: async (payload) => await ipcRendererInvoke('post_updatePostByField', payload),
  readPostByField: async (payload) => await ipcRendererInvoke('post_readPostByField', payload)
}
