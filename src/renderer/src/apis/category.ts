import type { CategoryArgRoutes, IIpcCustomRenderer } from '@preload/types'

export const CategoryApi: IIpcCustomRenderer<CategoryArgRoutes> = {
  readCategoryByField: async (payload) => window.api.category.readCategoryByField(payload),
  readCategoryByParams: async (payload) => window.api.category.readCategoryByParams(payload),
  create: async (payload) => window.api.category.create(payload),
  delete: async (payload) => window.api.category.delete(payload),
  update: async (payload) => window.api.category.update(payload)
}
