import { ipcMainHandle } from '@main/core/custom-ipc'
import { createResponse } from '@main/core/nodejs'
import { CategoryModel, PostModel } from '@main/database/models'
import { Post } from '../database/entities'

export const IpcMainPost = (): void => {
  ipcMainHandle('post_create', async (_, payload) => {
    const result = await CategoryModel.readAllByField([
      { key: 'id', select: payload.categoryId ?? '' }
    ])

    if (!result.payload?.data?.length) {
      return createResponse('category_not_found', 'error')
    }

    const post = Post.create({ ...payload, category: result.payload?.data?.[0] })

    return await PostModel.create([post])
  })

  ipcMainHandle('post_readPostByParams', async (_, payload) => {
    return await PostModel.readAllByParams(payload)
  })

  ipcMainHandle('post_removeByField', async (_, payload) => {
    return await PostModel.removeByField(payload)
  })

  ipcMainHandle('post_updatePostByField', async (_, payload) => {
    const result = await CategoryModel.readAllByField([
      { key: 'id', select: payload.value.categoryId ?? '' }
    ])

    if (result.payload?.data?.length) {
      payload.value.category = result.payload?.data?.[0]
    }
    delete payload.value.categoryId
    return await PostModel.updatePostByField(payload)
  })

  ipcMainHandle('post_readPostByField', async (_, payload) => {
    return await PostModel.readAllByField(payload)
  })
}
