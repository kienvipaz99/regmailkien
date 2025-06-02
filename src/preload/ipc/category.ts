import { ipcRendererInvoke } from '@main/core/custom-ipc'
import type { CategoryArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const IpcRendererCategory: IIpcCustomRenderer<CategoryArgRoutes> = {
  create: async (payload) => await ipcRendererInvoke('category_create', payload),
  delete: async (payload) => await ipcRendererInvoke('category_delete', payload),
  update: async (payload) => await ipcRendererInvoke('category_update', payload),
  readCategoryByField: async (payload) =>
    await ipcRendererInvoke('category_readCategoryByField', payload),
  readCategoryByParams: async (payload) =>
    await ipcRendererInvoke('category_readCategoryByParams', payload)
}
