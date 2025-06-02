import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse } from '@main/core/nodejs'
import { CategoryModel } from '@main/database/models'
import { Category } from '../database/entities'

export const IpcMainCategory = (): void => {
  ipcMainHandle('category_readCategoryByField', async (_, payload) => {
    return await CategoryModel.readAllByField(payload)
  })

  ipcMainHandle('category_readCategoryByParams', async (_, payload) => {
    return await CategoryModel.readAllByParams(payload)
  })

  ipcMainHandle('category_create', async (_, payload) => {
    const listCategory = await CategoryModel.readAllByField([
      {
        key: 'name',
        select: payload.name
      },
      {
        key: 'category_type',
        select: payload.type
      }
    ])

    if (listCategory.payload?.data?.length) {
      return createResponse('category_already_exists', 'error')
    }

    const category = Category.create({ name: payload.name, category_type: payload.type })
    return await CategoryModel.upsert([category])
  })

  ipcMainHandle('category_update', async (_, payload) => {
    return await CategoryModel.update(payload)
  })

  ipcMainHandle('category_delete', async (_, payload) => {
    return await CategoryModel.remove(payload)
  })
}
